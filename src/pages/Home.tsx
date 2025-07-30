import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UsageStats } from "@/components/ui/usage-stats";
import { UpgradeModal } from "@/components/ui/upgrade-modal";
import { Bot, Plus, TrendingUp, Users, Crown, MessageSquare } from "lucide-react";

export default function Home() {
  // Mock current user plan data
  const currentPlan = {
    name: "Free",
    chatbots: { used: 1, limit: 1 },
    chats: { used: 45, limit: 100 },
    uploads: false,
    apiAccess: false,
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-text bg-clip-text text-transparent">
            Welcome back!
          </h1>
          <p className="text-lg text-muted-foreground mt-2">
            Here's what's happening with your chatbots today.
          </p>
        </div>
        <div className="flex gap-3">
          {currentPlan.chatbots.used >= (currentPlan.chatbots.limit || 0) ? (
            <UpgradeModal 
              feature="Create New Chatbot"
              currentPlan={currentPlan.name}
              suggestedPlan="Starter"
            >
              <Button variant="outline" className="border-yellow-500 text-yellow-600 hover:bg-yellow-50">
                <Crown className="mr-2 h-4 w-4" />
                Upgrade to Create
              </Button>
            </UpgradeModal>
          ) : (
            <Button className="bg-gradient-primary hover:bg-gradient-primary/90 shadow-glow">
              <Plus className="mr-2 h-4 w-4" />
              Create New Bot
            </Button>
          )}
        </div>
      </div>

      {/* Usage Stats and Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <UsageStats plan={currentPlan} />
        </div>
        
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-elegant transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Chatbots</CardTitle>
              <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentPlan.chatbots.used}</div>
              <p className="text-xs text-muted-foreground">
                of {currentPlan.chatbots.limit || "unlimited"} allowed
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-elegant transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Chats</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentPlan.chats.used}</div>
              <p className="text-xs text-muted-foreground">
                of {currentPlan.chats.limit} this month
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-elegant transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-elegant transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87.3%</div>
              <p className="text-xs text-muted-foreground">+2.1% from last week</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/50 backdrop-blur-sm border-border shadow-elegant-md">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Get started with creating and managing your chatbots
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-glow">
              <Plus className="mr-2 h-4 w-4" />
              Create New Chatbot
            </Button>
            <Button variant="outline" className="w-full border-border hover:bg-secondary/50">
              View All Chatbots
            </Button>
            <Button variant="outline" className="w-full border-border hover:bg-secondary/50">
              Analytics Dashboard
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border shadow-elegant-md">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates from your chatbots
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Customer Support Bot updated</p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New conversation started</p>
                  <p className="text-xs text-muted-foreground">5 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Analytics report generated</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}