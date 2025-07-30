import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreateChatbotForm } from "@/components/forms/CreateChatbotForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Bot, Plus, Edit, Trash2, ExternalLink, RefreshCw } from "lucide-react";

interface Chatbot {
  id: string;
  name: string;
  personality_style: string;
  theme_color: string;
  system_prompt: string;
  resource_files: string[];
  created_at: string;
  updated_at: string;
}

export default function Chatbots() {
  const [chatbots, setChatbots] = useState<Chatbot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { toast } = useToast();

  const fetchChatbots = async () => {
    try {
      const { data, error } = await supabase
        .from('chatbots')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setChatbots(data || []);
    } catch (error) {
      console.error('Error fetching chatbots:', error);
      toast({
        title: "Error",
        description: "Failed to load chatbots",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatbots();
  }, []);

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
    fetchChatbots(); // Refresh the list
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const { error } = await supabase
        .from('chatbots')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Chatbot "${name}" has been deleted`
      });

      fetchChatbots(); // Refresh the list
    } catch (error) {
      console.error('Error deleting chatbot:', error);
      toast({
        title: "Error",
        description: "Failed to delete chatbot",
        variant: "destructive"
      });
    }
  };

  if (showCreateForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => setShowCreateForm(false)}
          >
            ← Back to Chatbots
          </Button>
        </div>
        <CreateChatbotForm onSuccess={handleCreateSuccess} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-text bg-clip-text text-transparent">
            My Chatbots
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Manage and configure your AI chatbots
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={fetchChatbots}
            disabled={loading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-primary hover:bg-gradient-primary/90 shadow-glow"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Bot
          </Button>
        </div>
      </div>

      {/* Chatbots Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : chatbots.length === 0 ? (
        <div className="text-center py-12">
          <Bot className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No chatbots yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first chatbot to get started
          </p>
          <Button 
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-primary hover:bg-gradient-primary/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Your First Chatbot
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chatbots.map((chatbot) => (
            <Card key={chatbot.id} className="hover:shadow-elegant transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: chatbot.theme_color + '20' }}
                    >
                      <Bot 
                        className="h-5 w-5" 
                        style={{ color: chatbot.theme_color }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">
                        {chatbot.name}
                      </CardTitle>
                      <CardDescription>
                        <Badge variant="secondary" className="mt-1">
                          {chatbot.personality_style}
                        </Badge>
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {chatbot.system_prompt}
                  </p>
                </div>

                {chatbot.resource_files?.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {chatbot.resource_files.length} resource file(s) uploaded
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <p className="text-xs text-muted-foreground">
                    Created {new Date(chatbot.created_at).toLocaleDateString()}
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDelete(chatbot.id, chatbot.name)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}