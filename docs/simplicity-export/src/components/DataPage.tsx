import { Database, Download, Trash2, FileText, Lock, RefreshCw } from 'lucide-react';

interface DataPageProps {
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

export function DataPage(props?: DataPageProps) {
  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Introduction */}
      <div className="bg-muted/30 rounded-2xl p-4 mb-6 border border-border/50">
        <div className="flex items-start gap-3">
          <Database className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="text-sm font-semibold mb-1.5 text-[#1a1a1a] dark:text-white">Data Transparency</h2>
            <p className="text-muted-foreground leading-relaxed text-[11px]">
              We believe you should have full control over your data. This page lets you view, download, and manage all the information we store about you.
            </p>
          </div>
        </div>
      </div>

      {/* Separator before What Data We Store */}
      <div className="border-t border-border/30 my-7" />

      {/* Data Categories */}
      <div className="mb-0">
        <h2 className="text-xs font-semibold mb-3 text-[#1a1a1a] dark:text-white">What Data We Store</h2>
        <div className="space-y-2">
          <div className="bg-card border border-border/50 rounded-xl p-3">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-muted/50 rounded-lg flex-shrink-0">
                <FileText className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="text-xs font-semibold mb-1 text-[#1a1a1a] dark:text-white">Account Information</h3>
                <p className="text-[11px] text-muted-foreground mb-2">
                  Your name, email address, account settings, and subscription status.
                </p>
                <button className="text-[10px] text-[#1a1a1a] dark:text-white font-semibold underline">
                  View Details →
                </button>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border/50 rounded-xl p-3">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-muted/50 rounded-lg flex-shrink-0">
                <Database className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="text-xs font-semibold mb-1 text-[#1a1a1a] dark:text-white">Listening History</h3>
                <p className="text-[11px] text-muted-foreground mb-2">
                  Episodes you've listened to, podcasts you follow, and your saved content.
                </p>
                <button className="text-[10px] text-[#1a1a1a] dark:text-white font-semibold underline">
                  View Details →
                </button>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border/50 rounded-xl p-3">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-muted/50 rounded-lg flex-shrink-0">
                <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="text-xs font-semibold mb-1 text-[#1a1a1a] dark:text-white">Usage Data</h3>
                <p className="text-[11px] text-muted-foreground mb-2">
                  How you interact with Simplicity, including search queries and feature usage.
                </p>
                <button className="text-[10px] text-[#1a1a1a] dark:text-white font-semibold underline">
                  View Details →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Separator before Data Management */}
      <div className="border-t border-border/30 my-7" />

      {/* Actions */}
      <div className="mb-0">
        <h2 className="text-xs font-semibold mb-3 text-[#1a1a1a] dark:text-white">Data Management</h2>
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-card border border-border/50 rounded-xl p-3 hover:border-border transition-all text-left group">
            <div className="p-1.5 bg-muted/50 rounded-lg inline-flex mb-2 flex-shrink-0">
              <Download className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
            <h3 className="text-xs font-semibold mb-1 text-[#1a1a1a] dark:text-white">Download Your Data</h3>
            <p className="text-[11px] text-muted-foreground">
              Request a complete copy of all your data in a portable format.
            </p>
          </button>

          <button className="bg-card border border-border/50 rounded-xl p-3 hover:border-border transition-all text-left group">
            <div className="p-1.5 bg-muted/50 rounded-lg inline-flex mb-2 flex-shrink-0">
              <Lock className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
            <h3 className="text-xs font-semibold mb-1 text-[#1a1a1a] dark:text-white">Privacy Settings</h3>
            <p className="text-[11px] text-muted-foreground">
              Control who can see your activity and manage privacy preferences.
            </p>
          </button>
        </div>
      </div>

      {/* Separator before GDPR Rights */}
      <div className="border-t border-border/30 my-7" />

      {/* GDPR Rights */}
      <div className="bg-card border border-border/50 rounded-xl p-3 mb-0">
        <h3 className="text-xs font-semibold mb-2 text-[#1a1a1a] dark:text-white">Your Rights Under GDPR</h3>
        <div className="space-y-1.5 text-[11px] text-muted-foreground">
          <div className="flex items-start gap-2">
            <div className="w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0 mt-1.5" />
            <span><strong className="text-[#1a1a1a] dark:text-white">Right to Access:</strong> Request a copy of your personal data</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0 mt-1.5" />
            <span><strong className="text-[#1a1a1a] dark:text-white">Right to Rectification:</strong> Correct inaccurate personal data</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0 mt-1.5" />
            <span><strong className="text-[#1a1a1a] dark:text-white">Right to Erasure:</strong> Request deletion of your data</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0 mt-1.5" />
            <span><strong className="text-[#1a1a1a] dark:text-white">Right to Data Portability:</strong> Receive your data in a machine-readable format</span>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-1 h-1 rounded-full bg-muted-foreground flex-shrink-0 mt-1.5" />
            <span><strong className="text-[#1a1a1a] dark:text-white">Right to Object:</strong> Object to processing of your personal data</span>
          </div>
        </div>
      </div>

      {/* Separator before Delete Account */}
      <div className="border-t border-border/30 my-7" />

      {/* Delete Account */}
      <div className="bg-muted/30 border border-border/50 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <div className="p-1.5 bg-muted/50 rounded-lg flex-shrink-0">
            <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <h2 className="text-xs font-semibold mb-1.5 text-[#1a1a1a] dark:text-white">Delete Your Account</h2>
            <p className="text-muted-foreground mb-3 leading-relaxed text-[11px]">
              Permanently delete your account and all associated data. This action cannot be undone. All your listening history, saved content, and preferences will be permanently removed.
            </p>
            <button className="px-3 py-1.5 bg-foreground hover:opacity-90 text-background rounded-lg font-medium transition-opacity text-[10px]">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}