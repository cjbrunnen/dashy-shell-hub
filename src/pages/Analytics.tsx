import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Users, MessageSquare, Clock, Zap } from "lucide-react";

export default function Analytics() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Track your chatbot performance and user engagement.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-card/50 backdrop-blur-sm border-border shadow-elegant-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">45,231</div>
            <div className="flex items-center space-x-1 text-xs">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+12%</span>
              <span className="text-muted-foreground">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border shadow-elegant-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">8,429</div>
            <div className="flex items-center space-x-1 text-xs">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+5%</span>
              <span className="text-muted-foreground">from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border shadow-elegant-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">1.2s</div>
            <div className="flex items-center space-x-1 text-xs">
              <TrendingDown className="h-3 w-3 text-green-500" />
              <span className="text-green-500">-15%</span>
              <span className="text-muted-foreground">improvement</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border shadow-elegant-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">94.2%</div>
            <div className="flex items-center space-x-1 text-xs">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-green-500">+2%</span>
              <span className="text-muted-foreground">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/50 backdrop-blur-sm border-border shadow-elegant-md">
          <CardHeader>
            <CardTitle>Top Performing Bots</CardTitle>
            <CardDescription>
              Ranked by conversation volume and success rate
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {[
                { name: "Customer Support Bot", conversations: 15420, rate: 96.5, trend: "up" },
                { name: "Sales Assistant", conversations: 12890, rate: 94.2, trend: "up" },
                { name: "FAQ Bot", conversations: 8950, rate: 91.8, trend: "down" }
              ].map((bot, index) => (
                <div key={bot.name} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                  <div className="flex items-center space-x-3">
                    <Badge variant="outline" className="w-6 h-6 rounded-full p-0 flex items-center justify-center">
                      {index + 1}
                    </Badge>
                    <div>
                      <p className="font-medium">{bot.name}</p>
                      <p className="text-sm text-muted-foreground">{bot.conversations.toLocaleString()} conversations</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{bot.rate}%</span>
                    {bot.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border shadow-elegant-md">
          <CardHeader>
            <CardTitle>Recent Insights</CardTitle>
            <CardDescription>
              Key metrics and trends from the past 7 days
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                <div className="flex items-center space-x-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Engagement Up</span>
                </div>
                <p className="text-sm text-green-700">User engagement increased by 23% this week.</p>
              </div>
              
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                <div className="flex items-center space-x-2 mb-1">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Faster Responses</span>
                </div>
                <p className="text-sm text-blue-700">Average response time improved by 300ms.</p>
              </div>
              
              <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
                <div className="flex items-center space-x-2 mb-1">
                  <Zap className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">High Success Rate</span>
                </div>
                <p className="text-sm text-purple-700">Customer satisfaction reached 94.2% this month.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}