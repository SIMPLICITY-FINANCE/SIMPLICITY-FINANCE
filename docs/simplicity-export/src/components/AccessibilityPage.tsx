import { Eye, Keyboard, Volume2, Smartphone, Mail, Shield } from 'lucide-react';

interface AccessibilityPageProps {
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

export function AccessibilityPage(props?: AccessibilityPageProps) {
  const features = [
    {
      icon: Keyboard,
      title: 'Keyboard Navigation',
      description: 'Full keyboard support for all interactive elements. Use Tab to navigate, Enter to activate, and Escape to close dialogs.',
    },
    {
      icon: Eye,
      title: 'Screen Reader Support',
      description: 'Optimized for screen readers with proper ARIA labels, semantic HTML, and descriptive alt text for all images.',
    },
    {
      icon: Volume2,
      title: 'Audio Controls',
      description: 'Customizable playback speed, volume controls, and transcript availability for podcast episodes.',
    },
    {
      icon: Smartphone,
      title: 'Responsive Design',
      description: 'Fully responsive interface that works seamlessly across desktop, tablet, and mobile devices.',
    }
  ];

  const standards = [
    'WCAG 2.1 Level AA compliance',
    'Section 508 standards',
    'Proper color contrast ratios (4.5:1 minimum)',
    'Resizable text up to 200% without loss of functionality',
    'Focus indicators for all interactive elements',
    'Semantic HTML5 structure',
    'Alt text for all meaningful images',
    'Captions and transcripts for audio content'
  ];

  const shortcuts = [
    { action: 'Play/Pause', description: 'Toggle audio playback', key: 'Space' },
    { action: 'Search', description: 'Focus search bar', key: 'Ctrl + K' },
    { action: 'Navigate', description: 'Move between elements', key: 'Tab / Shift + Tab' },
    { action: 'Close Dialog', description: 'Close modal or popup', key: 'Escape' },
  ];

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Mission */}
      <div className="bg-muted/30 rounded-2xl p-4 mb-6 border border-border/50">
        <div className="flex items-start gap-3">
          <Shield className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="text-sm font-semibold mb-1.5 text-[#1a1a1a] dark:text-white">Our Commitment</h2>
            <p className="text-muted-foreground leading-relaxed text-[11px]">
              At Simplicity, we believe financial education should be accessible to everyone, regardless of ability. We are committed to ensuring our platform provides an inclusive experience for all users, including those with disabilities. Accessibility is not an afterthought—it's core to our mission.
            </p>
          </div>
        </div>
      </div>

      {/* Separator before Accessibility Features */}
      <div className="border-t border-border/30 my-7" />

      {/* Accessibility Features */}
      <div className="mb-0">
        <h2 className="text-xs font-semibold mb-3 text-[#1a1a1a] dark:text-white">Accessibility Features</h2>
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

      {/* Separator before Standards & Compliance */}
      <div className="border-t border-border/30 my-7" />

      {/* Standards Compliance */}
      <div className="mb-0">
        <h2 className="text-xs font-semibold mb-3 text-[#1a1a1a] dark:text-white">Standards & Compliance</h2>
        <div className="bg-card border border-border/50 rounded-xl p-3">
          <p className="text-muted-foreground mb-3 text-[11px]">
            Simplicity strives to meet or exceed the following accessibility standards:
          </p>
          <ul className="space-y-1.5">
            {standards.map((standard, index) => (
              <li key={index} className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0 mt-1.5" />
                <span className="text-muted-foreground text-[11px]">{standard}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Separator before Keyboard Shortcuts */}
      <div className="border-t border-border/30 my-7" />

      {/* Keyboard Shortcuts */}
      <div className="mb-0">
        <h2 className="text-xs font-semibold mb-3 text-[#1a1a1a] dark:text-white">Keyboard Shortcuts</h2>
        <div className="bg-card border border-border/50 rounded-xl overflow-hidden">
          <div className="divide-y divide-border/50">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="p-2.5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-[11px] text-[#1a1a1a] dark:text-white">{shortcut.action}</div>
                  <div className="text-[10px] text-muted-foreground">{shortcut.description}</div>
                </div>
                <kbd className="px-2 py-0.5 bg-muted/50 rounded-lg font-mono text-[9px] border border-border/50">
                  {shortcut.key}
                </kbd>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Separator before Ongoing Improvement */}
      <div className="border-t border-border/30 my-7" />

      {/* Ongoing Improvement */}
      <div className="mb-0">
        <h2 className="text-xs font-semibold mb-3 text-[#1a1a1a] dark:text-white">Ongoing Improvement</h2>
        <div className="bg-card border border-border/50 rounded-xl p-3">
          <p className="text-muted-foreground leading-relaxed mb-2 text-[11px]">
            Accessibility is an ongoing commitment. We continuously:
          </p>
          <ul className="space-y-1.5 text-muted-foreground">
            <li className="flex items-start gap-2">
              <div className="w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0 mt-1.5" />
              <span className="text-[11px]">Conduct regular accessibility audits with assistive technology users</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0 mt-1.5" />
              <span className="text-[11px]">Test with real users who rely on assistive technologies</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0 mt-1.5" />
              <span className="text-[11px]">Provide accessibility training to our development team</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0 mt-1.5" />
              <span className="text-[11px]">Monitor and implement the latest accessibility best practices</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0 mt-1.5" />
              <span className="text-[11px]">Gather feedback from our community to improve accessibility</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Separator before Known Issues */}
      <div className="border-t border-border/30 my-7" />

      {/* Known Issues */}
      <div className="mb-0">
        <h2 className="text-xs font-semibold mb-3 text-[#1a1a1a] dark:text-white">Known Issues</h2>
        <div className="bg-card border border-border/50 rounded-xl p-3">
          <p className="text-muted-foreground leading-relaxed mb-2 text-[11px]">
            We're transparent about areas where we're still improving:
          </p>
          <ul className="space-y-1.5 text-muted-foreground">
            <li className="flex items-start gap-2">
              <div className="w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0 mt-1.5" />
              <span className="text-[11px]">Some third-party embedded content may not meet our accessibility standards</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0 mt-1.5" />
              <span className="text-[11px]">We're working to add more keyboard shortcuts for power users</span>
            </li>
            <li className="flex items-start gap-2">
              <div className="w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0 mt-1.5" />
              <span className="text-[11px]">Additional language support and translations are in development</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Separator before We Want Your Feedback */}
      <div className="border-t border-border/30 my-7" />

      {/* Feedback */}
      <div className="bg-muted/30 rounded-2xl p-4 border border-border/50">
        <div className="flex items-start gap-3 mb-3">
          <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="text-xs font-semibold mb-1.5 text-[#1a1a1a] dark:text-white">We Want Your Feedback</h2>
            <p className="text-muted-foreground leading-relaxed text-[11px]">
              If you encounter any accessibility barriers while using Simplicity, or have suggestions for improvement, please let us know. Your feedback helps us build a better, more inclusive product.
            </p>
          </div>
        </div>
        <div className="bg-card border border-border/50 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-[11px] text-[#1a1a1a] dark:text-white">Email:</span>
            <a href="mailto:accessibility@simplicity.com" className="text-[11px] text-[#1a1a1a] dark:text-white underline">
              accessibility@simplicity.com
            </a>
          </div>
          <p className="text-[10px] text-muted-foreground">
            We aim to respond to accessibility inquiries within 2 business days.
          </p>
        </div>
      </div>
    </div>
  );
}