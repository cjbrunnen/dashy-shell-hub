-- Add embed_code column to chatbots table
ALTER TABLE public.chatbots 
ADD COLUMN embed_code TEXT;