import { Target, Zap, Shield, Globe, Sparkles, ArrowLeft } from 'lucide-react';

interface AboutLandingPageProps {
  onBack?: () => void;
}

export function AboutLandingPage({ onBack }: AboutLandingPageProps) {
  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Summaries',
      description: 'Get the essence of hour-long financial podcasts in just minutes with our advanced AI technology.',
    },
    {
      icon: Target,
      title: 'Focus on What Matters',
      description: 'Skip the fluff and get straight to the key insights, actionable advice, and important takeaways.',
    },
    {
      icon: Zap,
      title: 'Stay Informed, Fast',
      description: 'Keep up with the latest financial trends and insights without spending hours listening.',
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data privacy and security are paramount. We never sell your data and maintain strict security standards.',
    },
    {
      icon: Globe,
      title: 'Always Accessible',
      description: 'Access your summaries anytime, anywhere, from any device with a clean, intuitive interface.',
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">About Simplicity</h1>
          <p className="text-lg text-muted-foreground">
            Making financial knowledge accessible to everyone
          </p>
        </div>

        {/* What We Do Section */}
        <div className="mb-12 bg-card rounded-2xl p-8 border border-border shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-foreground">What is Simplicity?</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Simplicity is a podcast summarization tool that helps you stay informed about financial markets 
            without spending hours listening to podcasts. We transform lengthy financial podcast episodes into 
            actionable insights you can consume in minutes.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Our mission is to democratize access to financial knowledge by making expert insights accessible, 
            understandable, and actionable for busy professionals.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Why Choose Simplicity?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-card border border-border rounded-xl p-6 hover:border-border/80 transition-all"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-base font-semibold mb-2 text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Our Story Section */}
        <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Our Story</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We built Simplicity because we were tired of spending hours listening to financial podcasts just 
            to extract a few key insights. We knew there had to be a better way.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            By leveraging cutting-edge AI technology, we've created a tool that gives you the best of both 
            worlds: the depth of expert analysis from top financial podcasts, delivered with the efficiency 
            of modern technology.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Today, thousands of professionals use Simplicity to stay informed about markets, make better 
            decisions, and save countless hours every week.
          </p>
        </div>
      </div>
    </div>
  );
}
