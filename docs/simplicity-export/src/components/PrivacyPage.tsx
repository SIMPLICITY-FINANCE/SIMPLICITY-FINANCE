import { Shield, Lock, Eye, Database, Cookie, UserX, Globe, FileText } from 'lucide-react';

interface PrivacyPageProps {
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

export function PrivacyPage(props?: PrivacyPageProps) {
  const lastUpdated = 'January 10, 2026';

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Quick Overview */}
      <div className="bg-muted/30 rounded-2xl p-4 mb-6 border border-border/50">
        <div className="flex items-start gap-3 mb-2">
          <Shield className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="text-sm font-semibold mb-1.5 text-[#1a1a1a] dark:text-white">Your Privacy Matters</h2>
            <p className="text-muted-foreground leading-relaxed text-[11px]">
              At Simplicity, we are committed to protecting your privacy. This policy explains how we collect, use, and safeguard your personal information. We believe in transparency and give you control over your data.
            </p>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground mt-2">
          Last updated: {lastUpdated}
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-0">
        {/* Information We Collect */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Database className="w-3.5 h-3.5 text-muted-foreground" />
            <h2 className="text-xs font-semibold text-[#1a1a1a] dark:text-white">1. Information We Collect</h2>
          </div>
          <div className="space-y-2 text-muted-foreground leading-relaxed text-[11px]">
            <div className="bg-card border border-border/50 rounded-xl p-3">
              <h3 className="font-semibold text-[#1a1a1a] dark:text-white mb-1.5 text-[11px]">Information You Provide</h3>
              <ul className="space-y-1 ml-3">
                <li className="flex items-start gap-1.5">
                  <span className="text-muted-foreground mt-0.5">•</span>
                  <span><strong className="text-[#1a1a1a] dark:text-white">Account Information:</strong> Name, email address, password (encrypted), and profile information.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-muted-foreground mt-0.5">•</span>
                  <span><strong className="text-[#1a1a1a] dark:text-white">Payment Information:</strong> Billing details processed securely through third-party payment processors.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-muted-foreground mt-0.5">•</span>
                  <span><strong className="text-[#1a1a1a] dark:text-white">Communications:</strong> Content of messages when you contact our support team.</span>
                </li>
              </ul>
            </div>

            <div className="bg-card border border-border/50 rounded-xl p-3">
              <h3 className="font-semibold text-[#1a1a1a] dark:text-white mb-1.5 text-[11px]">Information We Collect Automatically</h3>
              <ul className="space-y-1 ml-3">
                <li className="flex items-start gap-1.5">
                  <span className="text-muted-foreground mt-0.5">•</span>
                  <span><strong className="text-[#1a1a1a] dark:text-white">Usage Data:</strong> Podcasts and episodes you view, searches you perform, and features you interact with.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-muted-foreground mt-0.5">•</span>
                  <span><strong className="text-[#1a1a1a] dark:text-white">Device Information:</strong> Device type, operating system, browser type and version.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-muted-foreground mt-0.5">•</span>
                  <span><strong className="text-[#1a1a1a] dark:text-white">Log Data:</strong> IP address, access times, pages viewed, and referring URLs.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* How We Use Your Information */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Eye className="w-3.5 h-3.5 text-muted-foreground" />
            <h2 className="text-xs font-semibold text-[#1a1a1a] dark:text-white">2. How We Use Your Information</h2>
          </div>
          <div className="space-y-2 text-muted-foreground text-[11px]">
            <ul className="space-y-1.5">
              <li className="flex items-start gap-2 bg-card border border-border/50 rounded-xl p-2.5">
                <div className="w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0 mt-1.5" />
                <span><strong className="text-[#1a1a1a] dark:text-white">Provide Service:</strong> Create and manage your account, process transactions, deliver podcast summaries.</span>
              </li>
              <li className="flex items-start gap-2 bg-card border border-border/50 rounded-xl p-2.5">
                <div className="w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0 mt-1.5" />
                <span><strong className="text-[#1a1a1a] dark:text-white">Improve & Personalize:</strong> Recommend relevant podcasts and episodes, customize your experience.</span>
              </li>
              <li className="flex items-start gap-2 bg-card border border-border/50 rounded-xl p-2.5">
                <div className="w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0 mt-1.5" />
                <span><strong className="text-[#1a1a1a] dark:text-white">Communications:</strong> Send transactional emails, notifications about new episodes, service updates.</span>
              </li>
              <li className="flex items-start gap-2 bg-card border border-border/50 rounded-xl p-2.5">
                <div className="w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0 mt-1.5" />
                <span><strong className="text-[#1a1a1a] dark:text-white">Security:</strong> Detect, prevent, and respond to fraud, abuse, and security incidents.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Data Sharing */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Lock className="w-3.5 h-3.5 text-muted-foreground" />
            <h2 className="text-xs font-semibold text-[#1a1a1a] dark:text-white">3. How We Share Your Information</h2>
          </div>
          <div className="space-y-2 text-muted-foreground leading-relaxed text-[11px]">
            <p className="bg-card border border-border/50 rounded-xl p-3">
              <strong className="text-[#1a1a1a] dark:text-white">We do not sell your personal data.</strong> We may share your information only in limited circumstances:
            </p>
            <ul className="space-y-1.5">
              <li className="flex items-start gap-2 bg-card border border-border/50 rounded-xl p-2.5">
                <div className="w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0 mt-1.5" />
                <span><strong className="text-[#1a1a1a] dark:text-white">Service Providers:</strong> Third-party vendors like payment processors, cloud hosting, and analytics providers.</span>
              </li>
              <li className="flex items-start gap-2 bg-card border border-border/50 rounded-xl p-2.5">
                <div className="w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0 mt-1.5" />
                <span><strong className="text-[#1a1a1a] dark:text-white">Legal Requirements:</strong> When required by law or to protect rights and safety.</span>
              </li>
              <li className="flex items-start gap-2 bg-card border border-border/50 rounded-xl p-2.5">
                <div className="w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0 mt-1.5" />
                <span><strong className="text-[#1a1a1a] dark:text-white">Business Transfers:</strong> In connection with mergers or acquisitions.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Cookies */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Cookie className="w-3.5 h-3.5 text-muted-foreground" />
            <h2 className="text-xs font-semibold text-[#1a1a1a] dark:text-white">4. Cookies and Tracking</h2>
          </div>
          <div className="space-y-2 text-muted-foreground leading-relaxed text-[11px]">
            <p className="bg-card border border-border/50 rounded-xl p-3">
              We use cookies to collect and store information about your interactions with our Service. You can control cookies through your browser settings.
            </p>
          </div>
        </section>

        {/* Data Retention */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-3.5 h-3.5 text-muted-foreground" />
            <h2 className="text-xs font-semibold text-[#1a1a1a] dark:text-white">5. Data Retention</h2>
          </div>
          <div className="space-y-2 text-muted-foreground leading-relaxed text-[11px]">
            <p className="bg-card border border-border/50 rounded-xl p-3">
              We retain your personal information for as long as necessary to provide the Service. When you delete your account, we will delete or anonymize your personal information within 30 days.
            </p>
          </div>
        </section>

        {/* Your Rights */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <UserX className="w-3.5 h-3.5 text-muted-foreground" />
            <h2 className="text-xs font-semibold text-[#1a1a1a] dark:text-white">6. Your Rights and Choices</h2>
          </div>
          <div className="space-y-2 text-muted-foreground text-[11px]">
            <p className="leading-relaxed">Depending on your location, you may have certain rights regarding your personal information:</p>
            <ul className="space-y-1.5">
              <li className="flex items-start gap-2 bg-card border border-border/50 rounded-xl p-2.5">
                <div className="w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0 mt-1.5" />
                <span><strong className="text-[#1a1a1a] dark:text-white">Access & Portability:</strong> Request access to your personal information in a portable format.</span>
              </li>
              <li className="flex items-start gap-2 bg-card border border-border/50 rounded-xl p-2.5">
                <div className="w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0 mt-1.5" />
                <span><strong className="text-[#1a1a1a] dark:text-white">Correction:</strong> Update or correct inaccurate information through your account settings.</span>
              </li>
              <li className="flex items-start gap-2 bg-card border border-border/50 rounded-xl p-2.5">
                <div className="w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0 mt-1.5" />
                <span><strong className="text-[#1a1a1a] dark:text-white">Deletion:</strong> Request deletion of your personal information by deleting your account in Settings.</span>
              </li>
              <li className="flex items-start gap-2 bg-card border border-border/50 rounded-xl p-2.5">
                <div className="w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0 mt-1.5" />
                <span><strong className="text-[#1a1a1a] dark:text-white">Opt-Out:</strong> Unsubscribe from promotional emails using the link in each email.</span>
              </li>
            </ul>
            <p className="bg-card border border-border/50 rounded-xl p-3 mt-2">
              To exercise these rights, contact us at <a href="mailto:privacy@simplicity.com" className="text-[#1a1a1a] dark:text-white font-semibold underline">privacy@simplicity.com</a>
            </p>
          </div>
        </section>

        {/* Data Security */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-3.5 h-3.5 text-muted-foreground" />
            <h2 className="text-xs font-semibold text-[#1a1a1a] dark:text-white">7. Data Security</h2>
          </div>
          <div className="space-y-2 text-muted-foreground leading-relaxed text-[11px]">
            <p className="bg-card border border-border/50 rounded-xl p-3">
              We implement appropriate technical and organizational security measures including encryption, regular security assessments, and access controls to protect your personal information.
            </p>
          </div>
        </section>

        {/* International Transfers */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-3.5 h-3.5 text-muted-foreground" />
            <h2 className="text-xs font-semibold text-[#1a1a1a] dark:text-white">8. International Data Transfers</h2>
          </div>
          <div className="space-y-2 text-muted-foreground leading-relaxed text-[11px]">
            <p className="bg-card border border-border/50 rounded-xl p-3">
              Your information may be transferred to countries other than your country of residence. We implement appropriate safeguards to protect your data in accordance with this Privacy Policy and applicable laws.
            </p>
          </div>
        </section>

        {/* Children's Privacy */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-3.5 h-3.5 text-muted-foreground" />
            <h2 className="text-xs font-semibold text-[#1a1a1a] dark:text-white">9. Children's Privacy</h2>
          </div>
          <div className="space-y-2 text-muted-foreground leading-relaxed text-[11px]">
            <p className="bg-card border border-border/50 rounded-xl p-3">
              The Service is not intended for children under 13 years old. We do not knowingly collect personal information from children.
            </p>
          </div>
        </section>

        {/* Changes to Policy */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-3.5 h-3.5 text-muted-foreground" />
            <h2 className="text-xs font-semibold text-[#1a1a1a] dark:text-white">10. Changes to This Policy</h2>
          </div>
          <div className="space-y-2 text-muted-foreground leading-relaxed text-[11px]">
            <p className="bg-card border border-border/50 rounded-xl p-3">
              We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the updated policy on this page. Your continued use of the Service after changes indicates your acceptance.
            </p>
          </div>
        </section>

        {/* Contact */}
        <section className="bg-muted/30 rounded-2xl p-4 border border-border/50">
          <h2 className="text-xs font-semibold mb-2 text-[#1a1a1a] dark:text-white">11. Contact Us</h2>
          <p className="text-muted-foreground mb-3 text-[11px]">
            If you have questions or requests regarding this Privacy Policy, please contact us:
          </p>
          <div className="space-y-1.5 text-[11px]">
            <p className="text-muted-foreground">
              <strong className="text-[#1a1a1a] dark:text-white">Email:</strong>{' '}
              <a href="mailto:privacy@simplicity.com" className="text-[#1a1a1a] dark:text-white underline">
                privacy@simplicity.com
              </a>
            </p>
            <p className="text-muted-foreground">
              <strong className="text-[#1a1a1a] dark:text-white">Address:</strong><br />
              Simplicity Privacy Team<br />
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