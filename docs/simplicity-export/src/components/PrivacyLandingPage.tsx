import { ArrowLeft, Shield, Lock, Eye, Database, UserCheck } from 'lucide-react';

interface PrivacyLandingPageProps {
  onBack?: () => void;
}

export function PrivacyLandingPage({ onBack }: PrivacyLandingPageProps) {
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
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">
            Last updated: January 29, 2026
          </p>
        </div>

        {/* Introduction */}
        <div className="mb-8 bg-card rounded-2xl p-8 border border-border shadow-sm">
          <p className="text-muted-foreground leading-relaxed">
            At Simplicity, we take your privacy seriously. This Privacy Policy explains how we collect, use, 
            disclose, and safeguard your information when you use our service. Please read this privacy policy 
            carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
          </p>
        </div>

        {/* Privacy Sections */}
        <div className="space-y-6">
          {/* Information We Collect */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shrink-0">
                <Database className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Information We Collect</h2>
            </div>
            <div className="ml-11 text-sm text-muted-foreground space-y-2">
              <p>We collect information that you provide directly to us, including:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Email address for account creation</li>
                <li>Usage data and preferences</li>
                <li>Payment information (processed securely by third-party providers)</li>
                <li>Communications you send to us</li>
              </ul>
            </div>
          </div>

          {/* How We Use Your Information */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center shrink-0">
                <UserCheck className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">How We Use Your Information</h2>
            </div>
            <div className="ml-11 text-sm text-muted-foreground space-y-2">
              <p>We use the information we collect to:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Process your transactions and send related information</li>
                <li>Send you technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Monitor and analyze trends, usage, and activities</li>
              </ul>
            </div>
          </div>

          {/* Data Security */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-600 to-red-600 rounded-lg flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Data Security</h2>
            </div>
            <div className="ml-11 text-sm text-muted-foreground">
              <p>
                We use administrative, technical, and physical security measures to help protect your personal 
                information. While we have taken reasonable steps to secure the personal information you provide 
                to us, please be aware that no security measures are perfect or impenetrable.
              </p>
            </div>
          </div>

          {/* Data Sharing */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-orange-600 rounded-lg flex items-center justify-center shrink-0">
                <Eye className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Data Sharing and Disclosure</h2>
            </div>
            <div className="ml-11 text-sm text-muted-foreground space-y-2">
              <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>With your consent</li>
                <li>With service providers who perform services on our behalf</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and prevent fraud</li>
              </ul>
            </div>
          </div>

          {/* Your Rights */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Your Privacy Rights</h2>
            </div>
            <div className="ml-11 text-sm text-muted-foreground space-y-2">
              <p>You have the right to:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Object to processing of your information</li>
                <li>Export your data</li>
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-muted/30 rounded-xl p-6 border border-border/50">
            <h2 className="text-base font-semibold mb-2 text-foreground">Questions About Privacy?</h2>
            <p className="text-sm text-muted-foreground mb-3">
              If you have questions or concerns about this Privacy Policy, please contact us at:
            </p>
            <p className="text-sm font-medium text-foreground">
              privacy@simplicity.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
