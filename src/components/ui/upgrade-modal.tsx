import { useState } from "react";
import { Crown, Zap, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface UpgradeModalProps {
  feature: string;
  currentPlan: string;
  suggestedPlan: string;
  children: React.ReactNode;
}

const planFeatures: Record<string, string[]> = {
  Starter: ["3 chatbots", "1,000 chats/month", "File uploads", "Standard analytics"],
  Pro: ["10 chatbots", "5,000 chats/month", "Advanced analytics", "CSV export", "API access"],
  Business: ["Unlimited chatbots", "50,000 chats/month", "Full analytics", "Full API", "Priority support"]
};

const planPrices: Record<string, string> = {
  Starter: "$19",
  Pro: "$49",
  Business: "$129"
};

export function UpgradeModal({ feature, currentPlan, suggestedPlan, children }: UpgradeModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    setIsLoading(true);
    // TODO: Implement Stripe checkout
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-3 rounded-full bg-gradient-primary">
              <Crown className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          
          <DialogTitle className="text-2xl">
            Upgrade Required
          </DialogTitle>
          
          <DialogDescription className="text-base">
            <strong>{feature}</strong> is not available on your current {currentPlan} plan.
            Upgrade to {suggestedPlan} to unlock this feature.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-card/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">{suggestedPlan} Plan</h4>
              <Badge variant="secondary">{planPrices[suggestedPlan]}/month</Badge>
            </div>
            
            <ul className="space-y-2">
              {planFeatures[suggestedPlan]?.map((planFeature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <Zap className="h-3 w-3 text-green-500" />
                  {planFeature}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => window.location.reload()}
            >
              Maybe Later
            </Button>
            <Button 
              className="flex-1"
              onClick={handleUpgrade}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : `Upgrade to ${suggestedPlan}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}