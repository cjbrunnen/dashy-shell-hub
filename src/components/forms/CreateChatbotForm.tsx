import { useState } from "react";
import { useForm } from "react-hook-form";
import { Upload, Bot, Palette, MessageSquare, User, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FormData {
  name: string;
  personalityStyle: string;
  themeColor: string;
  systemPrompt: string;
}

interface CreateChatbotFormProps {
  onSuccess?: () => void;
}

const personalityOptions = [
  { value: "Friendly", label: "Friendly", description: "Warm and approachable tone" },
  { value: "Professional", label: "Professional", description: "Business-like and formal" },
  { value: "Humorous", label: "Humorous", description: "Light-hearted and fun" },
  { value: "Technical", label: "Technical", description: "Precise and detail-oriented" }
];

export function CreateChatbotForm({ onSuccess }: CreateChatbotFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<FormData>({
    defaultValues: {
      themeColor: "#3b82f6"
    }
  });

  const selectedPersonality = watch("personalityStyle");

  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return [];
    
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      const isValidType = file.type === "application/pdf" || file.type === "text/plain";
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      
      if (!isValidType) {
        toast({
          title: "Invalid file type",
          description: `${file.name} must be a PDF or TXT file`,
          variant: "destructive"
        });
        return false;
      }
      
      if (!isValidSize) {
        toast({
          title: "File too large",
          description: `${file.name} must be less than 10MB`,
          variant: "destructive"
        });
        return false;
      }
      
      return true;
    });

    setUploadedFiles(validFiles);
    return validFiles;
  };

  const uploadFilesToStorage = async (files: File[], userId: string) => {
    const uploadPromises = files.map(async (file) => {
      const fileName = `${userId}/${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from("chatbot-resources")
        .upload(fileName, file);

      if (error) throw error;
      return data.path;
    });

    return Promise.all(uploadPromises);
  };

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in to create a chatbot");

      // Upload files to storage if any
      let resourceFilePaths: string[] = [];
      if (uploadedFiles.length > 0) {
        resourceFilePaths = await uploadFilesToStorage(uploadedFiles, user.id);
      }

      // Create chatbot via edge function
      const { data: result, error } = await supabase.functions.invoke('create-chatbot', {
        body: {
          name: data.name,
          personalityStyle: data.personalityStyle,
          themeColor: data.themeColor,
          systemPrompt: data.systemPrompt,
          resourceFiles: resourceFilePaths
        }
      });

      if (error) throw error;

      toast({
        title: "Success!",
        description: `Chatbot "${data.name}" has been created successfully.`,
      });

      // Reset form
      reset();
      setUploadedFiles([]);
      
      // Call success callback
      onSuccess?.();

    } catch (error) {
      console.error("Error creating chatbot:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create chatbot",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-primary">
            <Bot className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl">Create New Chatbot</CardTitle>
            <CardDescription>
              Configure your AI chatbot with personality, styling, and knowledge base
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Chatbot Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Chatbot Name
            </Label>
            <Input
              id="name"
              placeholder="e.g., Customer Support Assistant"
              {...register("name", { required: "Chatbot name is required" })}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Personality Style */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Select Personality Style
            </Label>
            <Select onValueChange={(value) => setValue("personalityStyle", value)}>
              <SelectTrigger className={errors.personalityStyle ? "border-red-500" : ""}>
                <SelectValue placeholder="Choose a personality style" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border shadow-elegant z-50">
                {personalityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="hover:bg-secondary/80">
                    <div className="space-y-1">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-sm text-muted-foreground">{option.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.personalityStyle && (
              <p className="text-sm text-red-500">Personality style is required</p>
            )}
            {selectedPersonality && (
              <p className="text-sm text-muted-foreground">
                Selected: {personalityOptions.find(p => p.value === selectedPersonality)?.description}
              </p>
            )}
          </div>

          {/* Theme Color */}
          <div className="space-y-2">
            <Label htmlFor="themeColor" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Theme Color
            </Label>
            <div className="flex items-center gap-3">
              <Input
                id="themeColor"
                type="color"
                className="w-16 h-10 rounded-lg border cursor-pointer"
                {...register("themeColor", { required: "Theme color is required" })}
              />
              <Input
                type="text"
                placeholder="#3b82f6"
                className="flex-1"
                {...register("themeColor", { required: "Theme color is required" })}
              />
            </div>
            {errors.themeColor && (
              <p className="text-sm text-red-500">{errors.themeColor.message}</p>
            )}
          </div>

          {/* System Prompt */}
          <div className="space-y-2">
            <Label htmlFor="systemPrompt" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              System Prompt
            </Label>
            <Textarea
              id="systemPrompt"
              placeholder="You are a helpful assistant that..."
              rows={4}
              {...register("systemPrompt", { required: "System prompt is required" })}
              className={errors.systemPrompt ? "border-red-500" : ""}
            />
            {errors.systemPrompt && (
              <p className="text-sm text-red-500">{errors.systemPrompt.message}</p>
            )}
            <p className="text-sm text-muted-foreground">
              Define how your chatbot should behave and respond to users
            </p>
          </div>

          {/* Upload Resource Files */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Resource Files (Optional)
            </Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <div className="space-y-2">
                <p className="text-sm font-medium">Upload PDF or TXT files</p>
                <p className="text-xs text-muted-foreground">
                  These files will be used as knowledge base for your chatbot
                </p>
                <Input
                  type="file"
                  accept=".pdf,.txt"
                  multiple
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="max-w-xs mx-auto"
                />
              </div>
            </div>
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Uploaded files:</p>
                <ul className="space-y-1">
                  {uploadedFiles.map((file, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-center gap-2">
                      <Upload className="h-3 w-3" />
                      {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-primary hover:bg-gradient-primary/90 shadow-glow"
          >
            {isLoading ? "Creating Chatbot..." : "Create Chatbot"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}