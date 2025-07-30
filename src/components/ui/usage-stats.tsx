import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, MessageCircle, Upload, Zap } from "lucide-react";

interface UsageStatsProps {
  plan: {
    name: string;
    chatbots: { used: number; limit: number | null };
    chats: { used: number; limit: number };
    uploads: boolean;
    apiAccess: boolean;
  };
}

export function UsageStats({ plan }: UsageStatsProps) {
  const getUsagePercentage = (used: number, limit: number | null) => {
    if (limit === null) return 0; // Unlimited
    return Math.min((used / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-500";
    if (percentage >= 70) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Usage Overview
            </CardTitle>
            <CardDescription>Current plan: {plan.name}</CardDescription>
          </div>
          <Badge variant="secondary">{plan.name} Plan</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Chatbots Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4" />
              <span className="text-sm font-medium">Chatbots</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {plan.chatbots.used} / {plan.chatbots.limit || "∞"}
            </span>
          </div>
          {plan.chatbots.limit && (
            <Progress 
              value={getUsagePercentage(plan.chatbots.used, plan.chatbots.limit)} 
              className="h-2"
            />
          )}
          {plan.chatbots.limit && getUsagePercentage(plan.chatbots.used, plan.chatbots.limit) >= 90 && (
            <p className="text-xs text-red-500">Approaching limit - consider upgrading</p>
          )}
        </div>

        {/* Chats Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Monthly Chats</span>
            </div>
            <span className={`text-sm ${getUsageColor(getUsagePercentage(plan.chats.used, plan.chats.limit))}`}>
              {plan.chats.used.toLocaleString()} / {plan.chats.limit.toLocaleString()}
            </span>
          </div>
          <Progress 
            value={getUsagePercentage(plan.chats.used, plan.chats.limit)} 
            className="h-2"
          />
          {getUsagePercentage(plan.chats.used, plan.chats.limit) >= 90 && (
            <p className="text-xs text-red-500">Approaching monthly limit - consider upgrading</p>
          )}
        </div>

        {/* Features */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Available Features</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className={`flex items-center gap-2 ${plan.uploads ? "text-green-500" : "text-muted-foreground"}`}>
              <Upload className="h-4 w-4" />
              <span className="text-sm">File Uploads</span>
            </div>
            <div className={`flex items-center gap-2 ${plan.apiAccess ? "text-green-500" : "text-muted-foreground"}`}>
              <Zap className="h-4 w-4" />
              <span className="text-sm">API Access</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}