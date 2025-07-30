-- Create chatbots table
CREATE TABLE public.chatbots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  personality_style TEXT NOT NULL CHECK (personality_style IN ('Friendly', 'Professional', 'Humorous', 'Technical')),
  theme_color TEXT NOT NULL,
  system_prompt TEXT NOT NULL,
  resource_files TEXT[], -- Array of file URLs
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.chatbots ENABLE ROW LEVEL SECURITY;

-- Create policies for chatbots
CREATE POLICY "Users can view their own chatbots" 
ON public.chatbots 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own chatbots" 
ON public.chatbots 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own chatbots" 
ON public.chatbots 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own chatbots" 
ON public.chatbots 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create storage bucket for chatbot resources
INSERT INTO storage.buckets (id, name, public) VALUES ('chatbot-resources', 'chatbot-resources', false);

-- Create storage policies for chatbot resources
CREATE POLICY "Users can view their own chatbot resources" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'chatbot-resources' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own chatbot resources" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'chatbot-resources' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own chatbot resources" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'chatbot-resources' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own chatbot resources" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'chatbot-resources' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create trigger for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_chatbots_updated_at
BEFORE UPDATE ON public.chatbots
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();