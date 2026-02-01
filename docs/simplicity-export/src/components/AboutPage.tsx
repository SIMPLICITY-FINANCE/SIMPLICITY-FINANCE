import { Target, Zap, Shield, Globe, Smartphone, Sparkles } from 'lucide-react';

interface AboutPageProps {
  isPremium?: boolean;
  onUpgrade?: () => void;
  onChatClick?: () => void;
  isLoggedIn?: boolean;
  userImage?: string;
  userName?: string;
  onSignIn?: () => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onHelpClick?: () => void;
  onSignOut?: () => void;
}

export function AboutPage(props?: AboutPageProps) {
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
    <div className="w-full max-w-xl mx-auto">
      {/* What We Do Section */}
      <div className="mb-6 bg-muted/30 rounded-2xl p-4 border border-border/50">
        <h2 className="text-sm font-semibold mb-2 text-[#1a1a1a] dark:text-white">What is Simplicity?</h2>
        <div className="space-y-2 text-muted-foreground leading-relaxed text-[11px]">
          <p>
            Simplicity is a podcast summarization tool designed specifically for financial content. We transform lengthy financial podcasts into concise, easy-to-digest summaries, helping you stay informed without the time commitment.
          </p>
          <p>
            Whether you're interested in investing, economics, personal finance, or market analysis, Simplicity extracts the key insights and actionable advice so you can learn more in less time. Get the essence of a 60-minute podcast in a 2-minute read.
          </p>
          <p>
            Our platform curates the best financial podcasts, generates intelligent summaries using advanced AI, and delivers them in a clean, distraction-free interface. With features like personalized recommendations, saved summaries, and an AI chatbot for premium users, we're making financial education more accessible than ever.
          </p>
        </div>
      </div>

      {/* Separator before Why Choose Simplicity */}
      <div className="border-t border-border/30 my-7" />

      {/* Features */}
      <div className="mb-7">
        <h2 className="text-sm font-semibold mb-3 text-[#1a1a1a] dark:text-white">Why Choose Simplicity?</h2>
        <div className="space-y-2">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card border border-border/50 rounded-xl p-3 hover:border-border transition-all"
            >
              <div className="flex items-start gap-3">
                <div className="inline-flex p-1.5 rounded-lg bg-muted/50 flex-shrink-0">
                  <feature.icon className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xs font-semibold mb-1 text-[#1a1a1a] dark:text-white">{feature.title}</h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Separator before Take Simplicity Anywhere */}
      <div className="border-t border-border/30 my-7" />

      {/* Mobile App Section */}
      <div className="mb-7 bg-muted/30 rounded-2xl p-4 border border-border/50">
        <div className="text-center">
          <div className="inline-flex p-2 bg-foreground rounded-xl mb-2">
            <Smartphone className="w-5 h-5 text-background" />
          </div>
          <h2 className="text-sm font-semibold mb-1.5 text-[#1a1a1a] dark:text-white">Take Simplicity Anywhere</h2>
          <p className="text-[11px] text-muted-foreground mb-3">
            Download our mobile app and access your podcast summaries on the go. Available for iOS and Android.
          </p>
          <div className="flex items-center justify-center gap-2">
            <button className="px-3 py-1.5 bg-foreground text-background rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5 text-[10px]">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              App Store
            </button>
            <button className="px-3 py-1.5 bg-foreground text-background rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5 text-[10px]">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
              </svg>
              Google Play
            </button>
          </div>
        </div>
      </div>

      {/* Separator before Simplicity by the Numbers */}
      <div className="border-t border-border/30 my-7" />

      {/* Stats */}
      <div className="bg-muted/30 rounded-2xl p-4 border border-border/50">
        <h2 className="text-sm font-semibold mb-3 text-center text-[#1a1a1a] dark:text-white">Simplicity by the Numbers</h2>
        <div className="grid grid-cols-4 gap-3">
          <div className="text-center">
            <div className="text-base font-semibold mb-0.5 text-[#1a1a1a] dark:text-white">50K+</div>
            <div className="text-muted-foreground text-[9px]">Active Users</div>
          </div>
          <div className="text-center">
            <div className="text-base font-semibold mb-0.5 text-[#1a1a1a] dark:text-white">500+</div>
            <div className="text-muted-foreground text-[9px]">Podcasts</div>
          </div>
          <div className="text-center">
            <div className="text-base font-semibold mb-0.5 text-[#1a1a1a] dark:text-white">10K+</div>
            <div className="text-muted-foreground text-[9px]">Episodes Summarized</div>
          </div>
          <div className="text-center">
            <div className="text-base font-semibold mb-0.5 text-[#1a1a1a] dark:text-white">1M+</div>
            <div className="text-muted-foreground text-[9px]">Hours Saved</div>
          </div>
        </div>
      </div>
    </div>
  );
}