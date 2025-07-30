import { useState } from "react";
import { Check, Zap, Crown, Building } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    name: "Free",
    price: "$0",
    interval: "forever",
    description: "Perfect for getting started",
    icon: Zap,
    features: [
      "1 chatbot",
      "100 chats per month",
      "Basic analytics",
      "Community support"
    ],
    limitations: [
      "No file uploads",
      "No API access"
    ],
    buttonText: "Current Plan",
    disabled: true,
    popular: false
  },
  {
    name: "Starter",
    price: "$19",
    interval: "per month",
    description: "For small businesses and teams",
    icon: Zap,
    features: [
      "3 chatbots",
      "1,000 chats per month",
      "File uploads",
      "Standard analytics",
      "Email support"
    ],
    buttonText: "Upgrade to Starter",
    disabled: false,
    popular: true
  },
  {
    name: "Pro",
    price: "$49",
    interval: "per month",
    description: "For growing businesses",
    icon: Crown,
    features: [
      "10 chatbots",
      "5,000 chats per month",
      "Advanced analytics",
      "Export to CSV",
      "Read API access",
      "Priority support"
    ],
    buttonText: "Upgrade to Pro",
    disabled: false,
    popular: false
  },
  {
    name: "Business",
    price: "$129",
    interval: "per month",
    description: "For large organizations",
    icon: Building,
    features: [
      "Unlimited chatbots",
      "50,000 chats per month",
      "Full analytics suite",
      "Full API access",
      "Custom integrations",
      "Dedicated support"
    ],
    buttonText: "Upgrade to Business",
    disabled: false,
    popular: false
  }
];

export default function Pricing() {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleUpgrade = async (planName: string) => {
    setIsLoading(planName);
    // TODO: Implement Stripe checkout
    setTimeout(() => setIsLoading(null), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-text bg-clip-text text-transparent">
          Choose Your Plan
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Scale your chatbot analytics with our flexible pricing tiers. Start free and upgrade as you grow.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <Card 
              key={plan.name} 
              className={`relative transition-all duration-300 hover:shadow-elegant ${
                plan.popular 
                  ? "ring-2 ring-primary shadow-glow scale-105" 
                  : "hover:scale-102"
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-primary text-primary-foreground">
                  Most Popular
                </Badge>
              )}
              
              <CardHeader className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className={`p-3 rounded-full ${
                    plan.popular ? "bg-gradient-primary" : "bg-secondary"
                  }`}>
                    <Icon className={`h-6 w-6 ${
                      plan.popular ? "text-primary-foreground" : "text-foreground"
                    }`} />
                  </div>
                </div>
                
                <div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground ml-1">/{plan.interval}</span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                  {plan.limitations?.map((limitation, index) => (
                    <div key={index} className="flex items-center gap-3 opacity-60">
                      <span className="h-4 w-4 flex-shrink-0 text-center">×</span>
                      <span className="text-sm line-through">{limitation}</span>
                    </div>
                  ))}
                </div>
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  disabled={plan.disabled || isLoading === plan.name}
                  onClick={() => handleUpgrade(plan.name)}
                >
                  {isLoading === plan.name ? "Processing..." : plan.buttonText}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <div className="bg-card/50 backdrop-blur-sm rounded-lg p-8 text-center space-y-4">
        <h3 className="text-2xl font-semibold">Need a custom solution?</h3>
        <p className="text-muted-foreground">
          Contact our sales team for enterprise pricing and custom features.
        </p>
        <Button variant="outline">Contact Sales</Button>
      </div>
    </div>
  );
}