import { ArrowLeft, FileText, AlertCircle, Scale, Ban } from 'lucide-react';

interface TermsLandingPageProps {
  onBack?: () => void;
}

export function TermsLandingPage({ onBack }: TermsLandingPageProps) {
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
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-sm text-muted-foreground">
            Last updated: January 29, 2026
          </p>
        </div>

        {/* Introduction */}
        <div className="mb-8 bg-card rounded-2xl p-8 border border-border shadow-sm">
          <p className="text-muted-foreground leading-relaxed">
            Welcome to Simplicity. By accessing or using our service, you agree to be bound by these Terms of 
            Service. Please read them carefully before using our platform.
          </p>
        </div>

        {/* Terms Sections */}
        <div className="space-y-6">
          {/* Acceptance of Terms */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Acceptance of Terms</h2>
            </div>
            <div className="ml-11 text-sm text-muted-foreground">
              <p>
                By creating an account or using Simplicity, you agree to these Terms of Service and our Privacy 
                Policy. If you do not agree to these terms, you may not use our service.
              </p>
            </div>
          </div>

          {/* Use of Service */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center shrink-0">
                <Scale className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Use of Service</h2>
            </div>
            <div className="ml-11 text-sm text-muted-foreground space-y-2">
              <p>You agree to:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Use the service only for lawful purposes</li>
                <li>Not share your account credentials with others</li>
                <li>Not attempt to gain unauthorized access to our systems</li>
                <li>Not use the service to distribute spam or malicious content</li>
                <li>Not scrape or copy content without permission</li>
              </ul>
            </div>
          </div>

          {/* Subscription and Billing */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-600 to-red-600 rounded-lg flex items-center justify-center shrink-0">
                <AlertCircle className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Subscription and Billing</h2>
            </div>
            <div className="ml-11 text-sm text-muted-foreground space-y-2">
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Subscriptions renew automatically unless cancelled</li>
                <li>You can cancel your subscription at any time</li>
                <li>Refunds are provided at our discretion</li>
                <li>We may change pricing with 30 days notice</li>
                <li>You are responsible for all charges to your account</li>
              </ul>
            </div>
          </div>

          {/* Intellectual Property */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-orange-600 rounded-lg flex items-center justify-center shrink-0">
                <Ban className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Intellectual Property</h2>
            </div>
            <div className="ml-11 text-sm text-muted-foreground">
              <p>
                All content, features, and functionality of Simplicity are owned by us and are protected by 
                copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, 
                or create derivative works without our explicit permission.
              </p>
            </div>
          </div>

          {/* Limitation of Liability */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-600 to-yellow-600 rounded-lg flex items-center justify-center shrink-0">
                <AlertCircle className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Limitation of Liability</h2>
            </div>
            <div className="ml-11 text-sm text-muted-foreground">
              <p>
                Simplicity is provided "as is" without warranties of any kind. We are not liable for any damages 
                arising from your use of the service. The content provided is for informational purposes only and 
                should not be considered financial advice.
              </p>
            </div>
          </div>

          {/* Termination */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center shrink-0">
                <Ban className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Termination</h2>
            </div>
            <div className="ml-11 text-sm text-muted-foreground">
              <p>
                We may terminate or suspend your account at any time for violations of these terms. You may 
                terminate your account at any time through your account settings.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-muted/30 rounded-xl p-6 border border-border/50">
            <h2 className="text-base font-semibold mb-2 text-foreground">Questions About These Terms?</h2>
            <p className="text-sm text-muted-foreground mb-3">
              If you have questions or concerns about these Terms of Service, please contact us at:
            </p>
            <p className="text-sm font-medium text-foreground">
              legal@simplicity.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
