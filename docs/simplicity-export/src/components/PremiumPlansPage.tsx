import { Check, Crown, Sparkles, Zap, ArrowLeft, X } from 'lucide-react';
import { useState } from 'react';

interface PremiumPlansPageProps {
  onBack?: () => void;
  onSelectPlan?: (planId: string) => void;
  isPremium?: boolean;
}

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  savings?: string;
}

export function PremiumPlansPage({ onBack, onSelectPlan, isPremium = false }: PremiumPlansPageProps) {
  const [selectedPlan, setSelectedPlan] = useState<string>('monthly');

  const plans: Plan[] = [
    {
      id: 'monthly',
      name: 'Monthly',
      price: '€1.99',
      period: '/month',
      description: 'Perfect for trying out premium features',
      features: [
        'AI-generated daily reports',
        'AI-generated weekly reports',
        'AI-generated monthly reports',
        'Unlimited AI assistant access',
        'Advanced notebook features',
        'Upload custom podcasts',
        'Priority support',
      ],
    },
    {
      id: 'yearly',
      name: 'Yearly',
      price: '€19.99',
      period: '/year',
      description: 'Best value - save over 15%',
      popular: true,
      savings: 'Save €4',
      features: [
        'AI-generated daily reports',
        'AI-generated weekly reports',
        'AI-generated monthly reports',
        'Unlimited AI assistant access',
        'Advanced notebook features',
        'Upload custom podcasts',
        'Priority support',
        'Early access to new features',
      ],
    },
    {
      id: 'lifetime',
      name: 'Lifetime',
      price: '€49.99',
      period: 'one-time',
      description: 'Pay once, access forever',
      savings: 'Best Deal',
      features: [
        'AI-generated daily reports',
        'AI-generated weekly reports',
        'AI-generated monthly reports',
        'Unlimited AI assistant access',
        'Advanced notebook features',
        'Upload custom podcasts',
        'Priority support',
        'Early access to new features',
        'Lifetime updates',
        'No recurring charges',
      ],
    },
  ];

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleContinue = () => {
    onSelectPlan?.(selectedPlan);
  };

  return (
    <>
      {/* Modal Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4"
        onClick={onBack}
      >
        {/* Modal Container */}
        <div 
          className="bg-background rounded-2xl shadow-2xl border border-border max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button - Floating */}
          <button
            onClick={onBack}
            className="absolute top-4 right-4 z-10 p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Scrollable Content */}
          <div className="overflow-y-auto flex-1">
            <div className="px-6 py-6">
              {/* Hero Section */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-2xl mb-3">
                  <Crown className="w-7 h-7 text-amber-600 dark:text-amber-500" />
                </div>
                <h2 className="text-lg font-bold text-foreground mb-2">Upgrade to Premium</h2>
                <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
                  Get AI-generated daily, weekly, and monthly reports to stay ahead of financial markets
                </p>
              </div>

              {/* Plans Grid */}
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                {plans.map((plan) => (
                  <button
                    key={plan.id}
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`relative p-5 rounded-xl border-2 transition-all text-left ${
                      selectedPlan === plan.id
                        ? 'border-foreground bg-card shadow-lg scale-[1.02]'
                        : 'border-border bg-card hover:border-border/80 hover:shadow-md'
                    }`}
                  >
                    {/* Popular Badge */}
                    {plan.popular && (
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                        <div className="bg-foreground text-background px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" />
                          Most Popular
                        </div>
                      </div>
                    )}

                    {/* Savings Badge */}
                    {plan.savings && !plan.popular && (
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                        <div className="bg-amber-600 dark:bg-amber-500 text-white px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider">
                          {plan.savings}
                        </div>
                      </div>
                    )}

                    {/* Selection Indicator */}
                    <div className={`absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedPlan === plan.id
                        ? 'border-foreground bg-foreground'
                        : 'border-border bg-transparent'
                    }`}>
                      {selectedPlan === plan.id && (
                        <Check className="w-3 h-3 text-background" />
                      )}
                    </div>

                    {/* Plan Details */}
                    <div className="mb-3">
                      <h3 className="text-sm font-bold text-foreground mb-1">{plan.name}</h3>
                      <p className="text-[10px] text-muted-foreground mb-2">{plan.description}</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-foreground">{plan.price}</span>
                        <span className="text-[11px] text-muted-foreground">{plan.period}</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-1.5">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Check className="w-3 h-3 text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-[10px] text-foreground leading-snug">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </button>
                ))}
              </div>

              {/* Continue Button */}
              <div className="max-w-md mx-auto mb-6">
                <button
                  onClick={handleContinue}
                  className="w-full px-6 py-3 bg-foreground text-background rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <Crown className="w-4 h-4" />
                  Continue with {plans.find(p => p.id === selectedPlan)?.name}
                </button>
                <p className="text-center text-[10px] text-muted-foreground mt-2">
                  Cancel anytime • 7-day money-back guarantee
                </p>
              </div>

              {/* Features Highlights */}
              <div className="pt-6 border-t border-border/30">
                <h3 className="text-sm font-bold text-foreground text-center mb-5">What You'll Get</h3>
                <div className="grid md:grid-cols-3 gap-5">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-11 h-11 bg-muted rounded-xl mb-2">
                      <Sparkles className="w-5 h-5 text-foreground" />
                    </div>
                    <h4 className="text-[11px] font-bold text-foreground mb-1">AI-Powered Reports</h4>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      Get comprehensive daily, weekly, and monthly market analysis
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-11 h-11 bg-muted rounded-xl mb-2">
                      <Zap className="w-5 h-5 text-foreground" />
                    </div>
                    <h4 className="text-[11px] font-bold text-foreground mb-1">Unlimited AI Assistant</h4>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      Ask questions and get instant insights about any episode
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-11 h-11 bg-muted rounded-xl mb-2">
                      <Crown className="w-5 h-5 text-foreground" />
                    </div>
                    <h4 className="text-[11px] font-bold text-foreground mb-1">Premium Features</h4>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      Upload custom podcasts, advanced notebook, and priority support
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}