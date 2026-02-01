import { ArrowLeft, Eye, Keyboard, MousePointer, Volume2, Palette, Type } from 'lucide-react';

interface AccessibilityLandingPageProps {
  onBack?: () => void;
}

export function AccessibilityLandingPage({ onBack }: AccessibilityLandingPageProps) {
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
          <h1 className="text-4xl font-bold mb-4">Accessibility</h1>
          <p className="text-lg text-muted-foreground">
            Making Simplicity accessible to everyone
          </p>
        </div>

        {/* Introduction */}
        <div className="mb-8 bg-card rounded-2xl p-8 border border-border shadow-sm">
          <p className="text-muted-foreground leading-relaxed">
            We are committed to ensuring that Simplicity is accessible to all users, including those with 
            disabilities. We strive to meet WCAG 2.1 Level AA standards and continuously work to improve 
            the accessibility of our platform.
          </p>
        </div>

        {/* Accessibility Features */}
        <div className="space-y-6">
          {/* Keyboard Navigation */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shrink-0">
                <Keyboard className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Keyboard Navigation</h2>
            </div>
            <div className="ml-11 text-sm text-muted-foreground space-y-2">
              <p>Our platform is fully navigable using only a keyboard:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Tab through interactive elements in logical order</li>
                <li>Use Enter/Space to activate buttons and links</li>
                <li>Arrow keys for navigating lists and menus</li>
                <li>Escape key to close modals and menus</li>
              </ul>
            </div>
          </div>

          {/* Screen Reader Support */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center shrink-0">
                <Volume2 className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Screen Reader Support</h2>
            </div>
            <div className="ml-11 text-sm text-muted-foreground space-y-2">
              <p>We provide comprehensive screen reader support:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Semantic HTML for proper content structure</li>
                <li>ARIA labels and descriptions for interactive elements</li>
                <li>Clear headings and landmarks for navigation</li>
                <li>Alternative text for all images and icons</li>
                <li>Tested with NVDA, JAWS, and VoiceOver</li>
              </ul>
            </div>
          </div>

          {/* Visual Accessibility */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-600 to-red-600 rounded-lg flex items-center justify-center shrink-0">
                <Eye className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Visual Accessibility</h2>
            </div>
            <div className="ml-11 text-sm text-muted-foreground space-y-2">
              <p>Visual elements designed for accessibility:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>High contrast color combinations (WCAG AA compliant)</li>
                <li>Dark mode for reduced eye strain</li>
                <li>Resizable text up to 200% without loss of functionality</li>
                <li>Color is never the only means of conveying information</li>
                <li>Clear focus indicators for keyboard navigation</li>
              </ul>
            </div>
          </div>

          {/* Text and Typography */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-orange-600 rounded-lg flex items-center justify-center shrink-0">
                <Type className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Text and Typography</h2>
            </div>
            <div className="ml-11 text-sm text-muted-foreground space-y-2">
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Clear, readable fonts with good letter spacing</li>
                <li>Adequate line height for easy reading</li>
                <li>Sufficient text size for comfortable reading</li>
                <li>Support for browser zoom up to 400%</li>
              </ul>
            </div>
          </div>

          {/* Mouse and Touch */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-600 to-yellow-600 rounded-lg flex items-center justify-center shrink-0">
                <MousePointer className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Mouse and Touch Targets</h2>
            </div>
            <div className="ml-11 text-sm text-muted-foreground space-y-2">
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Large touch targets (minimum 44x44 pixels)</li>
                <li>Adequate spacing between interactive elements</li>
                <li>No time limits on interactions</li>
                <li>Support for both mouse and touch interfaces</li>
              </ul>
            </div>
          </div>

          {/* Theme Support */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center shrink-0">
                <Palette className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Theme and Customization</h2>
            </div>
            <div className="ml-11 text-sm text-muted-foreground space-y-2">
              <p>Customize your experience:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Switch between light and dark themes</li>
                <li>Respects your system's color scheme preferences</li>
                <li>Reduces motion for users who prefer it</li>
              </ul>
            </div>
          </div>

          {/* Feedback */}
          <div className="bg-muted/30 rounded-xl p-6 border border-border/50">
            <h2 className="text-base font-semibold mb-2 text-foreground">Accessibility Feedback</h2>
            <p className="text-sm text-muted-foreground mb-3">
              We are continuously working to improve accessibility. If you encounter any accessibility barriers 
              or have suggestions, please contact us at:
            </p>
            <p className="text-sm font-medium text-foreground">
              accessibility@simplicity.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
