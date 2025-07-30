import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Helper logging function
const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CREATE-CHATBOT] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Function started");

    // Create Supabase client with service role for database operations
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    
    const user = userData.user;
    if (!user?.id) throw new Error("User not authenticated");
    logStep("User authenticated", { userId: user.id });

    // Parse request body
    const body = await req.json();
    const { name, personalityStyle, themeColor, systemPrompt, resourceFiles } = body;

    // Validate required fields
    if (!name || !personalityStyle || !themeColor || !systemPrompt) {
      throw new Error("Missing required fields: name, personalityStyle, themeColor, and systemPrompt are required");
    }

    // Validate personality style
    const validPersonalities = ['Friendly', 'Professional', 'Humorous', 'Technical'];
    if (!validPersonalities.includes(personalityStyle)) {
      throw new Error(`Invalid personality style. Must be one of: ${validPersonalities.join(', ')}`);
    }

    logStep("Creating chatbot", { name, personalityStyle, themeColor });

    // Insert chatbot into database first to get the ID
    const { data: chatbot, error: insertError } = await supabaseClient
      .from("chatbots")
      .insert({
        user_id: user.id,
        name,
        personality_style: personalityStyle,
        theme_color: themeColor,
        system_prompt: systemPrompt,
        resource_files: resourceFiles || []
      })
      .select()
      .single();

    if (insertError) {
      logStep("Database error", { error: insertError });
      throw new Error(`Failed to create chatbot: ${insertError.message}`);
    }

    // Generate embed code using the chatbot ID
    const embedCode = `<script>
  (function() {
    var chatbotId = '${chatbot.id}';
    var script = document.createElement('script');
    script.src = 'https://jzgaoyceskwebjyqqypz.supabase.co/functions/v1/chatbot-widget?id=' + chatbotId;
    script.async = true;
    script.onload = function() {
      if (window.initChatbot) {
        window.initChatbot(chatbotId);
      }
    };
    document.head.appendChild(script);
  })();
</script>`;

    // Update chatbot with embed code
    const { error: updateError } = await supabaseClient
      .from("chatbots")
      .update({ embed_code: embedCode })
      .eq("id", chatbot.id);

    if (updateError) {
      logStep("Database update error", { error: updateError });
      throw new Error(`Failed to update chatbot with embed code: ${updateError.message}`);
    }

    logStep("Chatbot created successfully", { chatbotId: chatbot.id });

    return new Response(JSON.stringify({
      success: true,
      chatbot: chatbot
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in create-chatbot", { message: errorMessage });
    
    return new Response(JSON.stringify({ 
      error: errorMessage 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});