import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, Plus, Settings, Play, Pause } from "lucide-react";

const chatbots = [
  {
    id: 1,
    name: "Customer Support Bot",
    description: "Handles customer inquiries and support tickets",
    status: "active",
    conversations: 1250,
    lastActive: "2 min ago"
  },
  {
    id: 2,
    name: "Sales Assistant",
    description: "Helps with product recommendations and sales",
    status: "active",
    conversations: 890,
    lastActive: "5 min ago"
  },
  {
    id: 3,
    name: "FAQ Bot",
    description: "Answers frequently asked questions",
    status: "paused",
    conversations: 450,
    lastActive: "1 hour ago"
  }
];

export default function Chatbots() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Chatbots</h1>
          <p className="text-muted-foreground mt-2">
            Manage and monitor your AI chatbots.
          </p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-glow">
          <Plus className="mr-2 h-4 w-4" />
          Create Chatbot
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chatbots.map((bot) => (
          <Card key={bot.id} className="bg-card/50 backdrop-blur-sm border-border shadow-elegant-md hover:shadow-elegant-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{bot.name}</CardTitle>
                </div>
                <Badge 
                  variant={bot.status === "active" ? "default" : "secondary"}
                  className={bot.status === "active" ? "bg-gradient-primary text-primary-foreground" : ""}
                >
                  {bot.status}
                </Badge>
              </div>
              <CardDescription>{bot.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Conversations</p>
                  <p className="font-semibold text-primary">{bot.conversations.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Active</p>
                  <p className="font-semibold">{bot.lastActive}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1 border-border hover:bg-secondary/50">
                  <Settings className="mr-2 h-4 w-4" />
                  Configure
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className={`${
                    bot.status === "active" 
                      ? "text-yellow-600 hover:bg-yellow-50" 
                      : "text-green-600 hover:bg-green-50"
                  } border-border`}
                >
                  {bot.status === "active" ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}