import { FileText, AlertCircle, Scale, ShieldCheck, CreditCard, Ban } from 'lucide-react';

interface TermsPageProps {
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

export function TermsPage(props?: TermsPageProps) {
  const lastUpdated = 'January 10, 2026';

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Introduction */}
      <div className="bg-muted/30 rounded-2xl p-4 mb-6 border border-border/50">
        <div className="flex items-start gap-3">
          <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="text-sm font-semibold mb-1.5 text-[#1a1a1a] dark:text-white">Welcome to Simplicity</h2>
            <p className="text-muted-foreground leading-relaxed text-[11px]">
              These Terms of Service govern your use of Simplicity's website, mobile applications, and services. By accessing or using our service, you agree to be bound by these Terms.
            </p>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground mt-2">
          Last updated: {lastUpdated}
        </p>
      </div>

      {/* Separator before Acceptance of Terms */}
      <div className="border-t border-border/30 my-7" />

      {/* Main Content */}
      <div className="space-y-0">
        {/* Acceptance of Terms */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Scale className="w-3.5 h-3.5 text-muted-foreground" />
            <h2 className="text-xs font-semibold text-[#1a1a1a] dark:text-white">1. Acceptance of Terms</h2>
          </div>
          <div className="space-y-2 text-muted-foreground leading-relaxed text-[11px]">
            <p className="bg-card border border-border/50 rounded-xl p-3">
              By creating an account or using Simplicity, you confirm that you are at least 18 years old (or the age of majority in your jurisdiction) and have the legal capacity to enter into these Terms.
            </p>
          </div>
        </section>

        {/* Separator before Account Responsibilities */}
        <div className="border-t border-border/30 my-7" />

        {/* Account Responsibilities */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground" />
            <h2 className="text-xs font-semibold text-[#1a1a1a] dark:text-white">2. Account Responsibilities</h2>
          </div>
          <div className="space-y-2 text-muted-foreground text-[11px]">
            <ul className="space-y-1.5">
              <li className="flex items-start gap-2 bg-card border border-border/50 rounded-xl p-2.5">
                <div className="w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0 mt-1.5" />
                <span>You are responsible for maintaining the confidentiality of your account credentials and all activities under your account.</span>
              </li>
              <li className="flex items-start gap-2 bg-card border border-border/50 rounded-xl p-2.5">
                <div className="w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0 mt-1.5" />
                <span>You must provide accurate, current, and complete information when creating your account.</span>
              </li>
              <li className="flex items-start gap-2 bg-card border border-border/50 rounded-xl p-2.5">
                <div className="w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0 mt-1.5" />
                <span>You must notify us immediately of any unauthorized access or security breach.</span>
              </li>
              <li className="flex items-start gap-2 bg-card border border-border/50 rounded-xl p-2.5">
                <div className="w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0 mt-1.5" />
                <span>You may not share your account with others or create multiple accounts.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Separator before Service Description */}
        <div className="border-t border-border/30 my-7" />

        {/* Service Description */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-3.5 h-3.5 text-muted-foreground" />
            <h2 className="text-xs font-semibold text-[#1a1a1a] dark:text-white">3. Service Description</h2>
          </div>
          <div className="space-y-2 text-muted-foreground leading-relaxed text-[11px]">
            <p className="bg-card border border-border/50 rounded-xl p-3">
              Simplicity provides access to financial podcast content and AI-generated summaries. We offer both free and Premium subscription tiers with features including ad-free listening, AI summaries, and priority support.
            </p>
            <p className="bg-card border border-border/50 rounded-xl p-3">
              We reserve the right to modify, suspend, or discontinue any aspect of the service at any time, with or without notice.
            </p>
          </div>
        </section>

        {/* Separator before Subscription and Billing */}
        <div className="border-t border-border/30 my-7" />

        {/* Subscription and Billing */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="w-3.5 h-3.5 text-muted-foreground" />
            <h2 className="text-xs font-semibold text-[#1a1a1a] dark:text-white">4. Subscription and Billing</h2>
          </div>
          <div className="space-y-2 text-muted-foreground text-[11px]">
            <div className="bg-card border border-border/50 rounded-xl p-3">
              <h3 className="font-semibold text-[#1a1a1a] dark:text-white mb-1">Premium Subscriptions</h3>
              <p>Premium subscriptions are billed on a recurring basis (monthly or annually) until cancelled. Charges are non-refundable except as required by law.</p>
            </div>
            <div className="bg-card border border-border/50 rounded-xl p-3">
              <h3 className="font-semibold text-[#1a1a1a] dark:text-white mb-1">Cancellation</h3>
              <p>You may cancel your Premium subscription at any time. Cancellation takes effect at the end of the current billing period.</p>
            </div>
            <div className="bg-card border border-border/50 rounded-xl p-3">
              <h3 className="font-semibold text-[#1a1a1a] dark:text-white mb-1">Price Changes</h3>
              <p>We may change subscription prices with at least 30 days' notice. Continued use after price changes constitutes acceptance.</p>
            </div>
          </div>
        </section>

        {/* Separator before User Conduct */}
        <div className="border-t border-border/30 my-7" />

        {/* User Conduct */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Ban className="w-3.5 h-3.5 text-muted-foreground" />
            <h2 className="text-xs font-semibold text-[#1a1a1a] dark:text-white">5. User Conduct</h2>
          </div>
          <div className="space-y-2 text-muted-foreground leading-relaxed text-[11px]">
            <p className="bg-card border border-border/50 rounded-xl p-3">
              You agree not to:
            </p>
            <ul className="space-y-1.5">
              <li className="flex items-start gap-2 bg-card border border-border/50 rounded-xl p-2.5">
                <div className="w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0 mt-1.5" />
                <span>Use the service for any illegal or unauthorized purpose</span>
              </li>
              <li className="flex items-start gap-2 bg-card border border-border/50 rounded-xl p-2.5">
                <div className="w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0 mt-1.5" />
                <span>Attempt to gain unauthorized access to our systems or other users' accounts</span>
              </li>
              <li className="flex items-start gap-2 bg-card border border-border/50 rounded-xl p-2.5">
                <div className="w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0 mt-1.5" />
                <span>Reverse engineer, decompile, or disassemble any part of the service</span>
              </li>
              <li className="flex items-start gap-2 bg-card border border-border/50 rounded-xl p-2.5">
                <div className="w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0 mt-1.5" />
                <span>Use automated systems (bots, scrapers) to access the service</span>
              </li>
              <li className="flex items-start gap-2 bg-card border border-border/50 rounded-xl p-2.5">
                <div className="w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0 mt-1.5" />
                <span>Redistribute or resell content from the service without permission</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Separator before Intellectual Property */}
        <div className="border-t border-border/30 my-7" />

        {/* Intellectual Property */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Scale className="w-3.5 h-3.5 text-muted-foreground" />
            <h2 className="text-xs font-semibold text-[#1a1a1a] dark:text-white">6. Intellectual Property</h2>
          </div>
          <div className="space-y-2 text-muted-foreground leading-relaxed text-[11px]">
            <p className="bg-card border border-border/50 rounded-xl p-3">
              All content, features, and functionality of Simplicity are owned by Simplicity or our licensors and are protected by copyright, trademark, and other intellectual property laws.
            </p>
            <p className="bg-card border border-border/50 rounded-xl p-3">
              Podcast content is owned by the respective podcast creators. AI-generated summaries are created by Simplicity for educational purposes under fair use.
            </p>
          </div>
        </section>

        {/* Separator before Disclaimers and Limitations */}
        <div className="border-t border-border/30 my-7" />

        {/* Disclaimers */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-3.5 h-3.5 text-muted-foreground" />
            <h2 className="text-xs font-semibold text-[#1a1a1a] dark:text-white">7. Disclaimers and Limitations</h2>
          </div>
          <div className="space-y-2 text-muted-foreground leading-relaxed text-[11px]">
            <div className="bg-card border border-border/50 rounded-xl p-3">
              <h3 className="font-semibold text-[#1a1a1a] dark:text-white mb-1">Financial Information Disclaimer</h3>
              <p>Content on Simplicity is for informational and educational purposes only. It is not financial, investment, legal, or tax advice. Always consult with qualified professionals before making financial decisions.</p>
            </div>
            <div className="bg-card border border-border/50 rounded-xl p-3">
              <h3 className="font-semibold text-[#1a1a1a] dark:text-white mb-1">Service \"As Is\"</h3>
              <p>The service is provided \"as is\" without warranties of any kind. We do not guarantee that the service will be uninterrupted, secure, or error-free.</p>
            </div>
            <div className="bg-card border border-border/50 rounded-xl p-3">
              <h3 className="font-semibold text-[#1a1a1a] dark:text-white mb-1">Limitation of Liability</h3>
              <p>To the maximum extent permitted by law, Simplicity shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.</p>
            </div>
          </div>
        </section>

        {/* Separator before Termination */}
        <div className="border-t border-border/30 my-7" />

        {/* Termination */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Ban className="w-3.5 h-3.5 text-muted-foreground" />
            <h2 className="text-xs font-semibold text-[#1a1a1a] dark:text-white">8. Termination</h2>
          </div>
          <div className="space-y-2 text-muted-foreground leading-relaxed text-[11px]">
            <p className="bg-card border border-border/50 rounded-xl p-3">
              We may terminate or suspend your account immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.
            </p>
            <p className="bg-card border border-border/50 rounded-xl p-3">
              You may terminate your account at any time by deleting your account in Settings. Upon termination, your right to use the service will immediately cease.
            </p>
          </div>
        </section>

        {/* Separator before Changes to These Terms */}
        <div className="border-t border-border/30 my-7" />

        {/* Changes to Terms */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-3.5 h-3.5 text-muted-foreground" />
            <h2 className="text-xs font-semibold text-[#1a1a1a] dark:text-white">9. Changes to These Terms</h2>
          </div>
          <div className="space-y-2 text-muted-foreground leading-relaxed text-[11px]">
            <p className="bg-card border border-border/50 rounded-xl p-3">
              We may update these Terms from time to time. We will notify you of any material changes by posting the updated Terms on this page. Your continued use of the Service after changes constitutes your acceptance of the new Terms.
            </p>
          </div>
        </section>

        {/* Separator before Governing Law */}
        <div className="border-t border-border/30 my-7" />

        {/* Governing Law */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Scale className="w-3.5 h-3.5 text-muted-foreground" />
            <h2 className="text-xs font-semibold text-[#1a1a1a] dark:text-white">10. Governing Law</h2>
          </div>
          <div className="space-y-2 text-muted-foreground leading-relaxed text-[11px]">
            <p className="bg-card border border-border/50 rounded-xl p-3">
              These Terms shall be governed by and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions.
            </p>
          </div>
        </section>

        {/* Separator before Contact Us */}
        <div className="border-t border-border/30 my-7" />

        {/* Contact */}
        <section className="bg-muted/30 rounded-2xl p-4 border border-border/50">
          <h2 className="text-xs font-semibold mb-2 text-[#1a1a1a] dark:text-white">11. Contact Us</h2>
          <p className="text-muted-foreground mb-3 text-[11px]">
            If you have any questions about these Terms, please contact us:
          </p>
          <div className="space-y-1.5 text-[11px]">
            <p className="text-muted-foreground">
              <strong className="text-[#1a1a1a] dark:text-white">Email:</strong>{' '}
              <a href="mailto:legal@simplicity.com" className="text-[#1a1a1a] dark:text-white underline">
                legal@simplicity.com
              </a>
            </p>
            <p className="text-muted-foreground">
              <strong className="text-[#1a1a1a] dark:text-white">Address:</strong><br />
              Simplicity Legal Team<br />
              123 Innovation Drive<br />
              San Francisco, CA 94102<br />
              United States
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}