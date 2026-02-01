import { ArrowLeft, Database, Download, Trash2, Lock, Shield } from 'lucide-react';

interface DataLandingPageProps {
  onBack?: () => void;
}

export function DataLandingPage({ onBack }: DataLandingPageProps) {
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
          <h1 className="text-4xl font-bold mb-4">Your Data Rights</h1>
          <p className="text-lg text-muted-foreground">
            Understanding how we handle your data
          </p>
        </div>

        {/* Introduction */}
        <div className="mb-8 bg-card rounded-2xl p-8 border border-border shadow-sm">
          <p className="text-muted-foreground leading-relaxed">
            At Simplicity, we believe you should have complete control over your data. This page explains your 
            data rights and how you can exercise them.
          </p>
        </div>

        {/* Data Rights Sections */}
        <div className="space-y-6">
          {/* What Data We Store */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shrink-0">
                <Database className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">What Data We Store</h2>
            </div>
            <div className="ml-11 text-sm text-muted-foreground space-y-2">
              <p>We collect and store the following types of data:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Account information (email address, name)</li>
                <li>Usage data (pages visited, features used)</li>
                <li>Preferences and settings</li>
                <li>Saved content and notes</li>
                <li>Subscription and billing information</li>
              </ul>
            </div>
          </div>

          {/* Access Your Data */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Right to Access</h2>
            </div>
            <div className="ml-11 text-sm text-muted-foreground">
              <p>
                You have the right to access all personal data we have about you. You can view most of your 
                data directly in your account settings. For a complete copy of your data, contact our support team.
              </p>
            </div>
          </div>

          {/* Export Your Data */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-600 to-red-600 rounded-lg flex items-center justify-center shrink-0">
                <Download className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Right to Data Portability</h2>
            </div>
            <div className="ml-11 text-sm text-muted-foreground">
              <p>
                You can export your data at any time in a machine-readable format. This includes your saved 
                content, notes, and preferences. Contact us to request a data export.
              </p>
            </div>
          </div>

          {/* Delete Your Data */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-orange-600 rounded-lg flex items-center justify-center shrink-0">
                <Trash2 className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Right to Deletion</h2>
            </div>
            <div className="ml-11 text-sm text-muted-foreground space-y-2">
              <p>You have the right to request deletion of your personal data. When you delete your account:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Your account and profile information will be permanently deleted</li>
                <li>Your saved content and preferences will be removed</li>
                <li>Some data may be retained for legal or security purposes</li>
                <li>Anonymized usage data may be retained for analytics</li>
              </ul>
            </div>
          </div>

          {/* Data Security */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">How We Protect Your Data</h2>
            </div>
            <div className="ml-11 text-sm text-muted-foreground space-y-2">
              <p>We use industry-standard security measures to protect your data:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Encryption in transit and at rest</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication</li>
                <li>Secure data centers with redundancy</li>
                <li>Regular backups and disaster recovery plans</li>
              </ul>
            </div>
          </div>

          {/* GDPR and CCPA */}
          <div className="bg-card rounded-xl p-6 border border-border">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Compliance</h2>
            </div>
            <div className="ml-11 text-sm text-muted-foreground">
              <p>
                We comply with GDPR (General Data Protection Regulation) and CCPA (California Consumer Privacy Act) 
                requirements. You have the right to opt-out of data sharing, request corrections to your data, 
                and withdraw consent at any time.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-muted/30 rounded-xl p-6 border border-border/50">
            <h2 className="text-base font-semibold mb-2 text-foreground">Exercise Your Data Rights</h2>
            <p className="text-sm text-muted-foreground mb-3">
              To exercise any of your data rights, please contact us at:
            </p>
            <p className="text-sm font-medium text-foreground">
              data@simplicity.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
