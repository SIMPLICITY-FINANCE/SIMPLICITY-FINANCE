import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  User, 
  Bell, 
  Lock, 
  Eye, 
  Palette,
  Download,
  CreditCard,
  Shield,
  Mail,
  FileText,
  ChevronRight
} from 'lucide-react';

interface SettingsPageProps {
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
  onBillingClick?: () => void;
}

export function SettingsPage({ isPremium, onUpgrade, onChatClick, isLoggedIn, userImage, userName, onSignIn, onProfileClick, onSettingsClick, onHelpClick, onSignOut, onBillingClick }: SettingsPageProps) {
  const { theme, setTheme } = useTheme();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [newEpisodes, setNewEpisodes] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [autoSummarize, setAutoSummarize] = useState(true);
  const [summaryLength, setSummaryLength] = useState('medium');

  const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
        enabled ? 'bg-muted-foreground' : 'bg-muted'
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-background transition-transform ${
          enabled ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  );

  return (
    <div className="w-full max-w-xl mx-auto">
      <div>
        {/* Account Settings */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-3 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-muted rounded">
                <User className="w-3 h-3 text-muted-foreground" />
              </div>
              <div>
                <h2 className="text-xs font-semibold text-foreground uppercase tracking-wide">ACCOUNT</h2>
                <p className="text-[10px] text-muted-foreground">Manage your account information</p>
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-border">
            <button className="w-full p-3 flex items-center justify-between hover:bg-muted/50 transition-colors text-left">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                <div>
                  <div className="font-medium text-[11px] text-foreground">Email Address</div>
                  <div className="text-[10px] text-muted-foreground">sarah.johnson@email.com</div>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            </button>

            <button className="w-full p-3 flex items-center justify-between hover:bg-muted/50 transition-colors text-left">
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                <div>
                  <div className="font-medium text-[11px] text-foreground">Password</div>
                  <div className="text-[10px] text-muted-foreground">Change your password</div>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            </button>

            <button className="w-full p-3 flex items-center justify-between hover:bg-muted/50 transition-colors text-left"
              onClick={onBillingClick}
            >
              <div className="flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5 text-muted-foreground" />
                <div>
                  <div className="font-medium text-[11px] text-foreground">Billing & Subscription</div>
                  <div className="text-[10px] text-muted-foreground">Manage your premium subscription</div>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Separator before Notifications */}
        <div className="border-t border-border/30 my-7" />

        {/* Notifications */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-3 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-muted rounded">
                <Bell className="w-3 h-3 text-muted-foreground" />
              </div>
              <div>
                <h2 className="text-xs font-semibold text-foreground uppercase tracking-wide">NOTIFICATIONS</h2>
                <p className="text-[10px] text-muted-foreground">Configure how you receive notifications</p>
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-border">
            <div className="p-3 flex items-center justify-between">
              <div>
                <div className="font-medium text-[11px] text-foreground">Email Notifications</div>
                <div className="text-[10px] text-muted-foreground">Receive notifications via email</div>
              </div>
              <ToggleSwitch enabled={emailNotifications} onChange={() => setEmailNotifications(!emailNotifications)} />
            </div>

            <div className="p-3 flex items-center justify-between">
              <div>
                <div className="font-medium text-[11px] text-foreground">Push Notifications</div>
                <div className="text-[10px] text-muted-foreground">Receive push notifications</div>
              </div>
              <ToggleSwitch enabled={pushNotifications} onChange={() => setPushNotifications(!pushNotifications)} />
            </div>

            <div className="p-3 flex items-center justify-between">
              <div>
                <div className="font-medium text-[11px] text-foreground">New Episodes</div>
                <div className="text-[10px] text-muted-foreground">Notify when podcasts you follow release new episodes</div>
              </div>
              <ToggleSwitch enabled={newEpisodes} onChange={() => setNewEpisodes(!newEpisodes)} />
            </div>

            <div className="p-3 flex items-center justify-between">
              <div>
                <div className="font-medium text-[11px] text-foreground">Weekly Digest</div>
                <div className="text-[10px] text-muted-foreground">Receive a weekly summary of your activity</div>
              </div>
              <ToggleSwitch enabled={weeklyDigest} onChange={() => setWeeklyDigest(!weeklyDigest)} />
            </div>
          </div>
        </div>

        {/* Separator before Summary Preferences */}
        <div className="border-t border-border/30 my-7" />

        {/* Playback Settings */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-3 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-muted rounded">
                <FileText className="w-3 h-3 text-muted-foreground" />
              </div>
              <div>
                <h2 className="text-xs font-semibold text-foreground uppercase tracking-wide">SUMMARY PREFERENCES</h2>
                <p className="text-[10px] text-muted-foreground">Configure how summaries are generated</p>
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-border">
            <div className="p-3 flex items-center justify-between">
              <div>
                <div className="font-medium text-[11px] text-foreground">Auto-Summarize New Episodes</div>
                <div className="text-[10px] text-muted-foreground">Automatically generate summaries for new episodes</div>
              </div>
              <ToggleSwitch enabled={autoSummarize} onChange={() => setAutoSummarize(!autoSummarize)} />
            </div>

            <div className="p-3">
              <div className="font-medium mb-2 text-[11px] text-foreground">Summary Length</div>
              <div className="space-y-1.5">
                {['short', 'medium', 'long'].map((length) => (
                  <button
                    key={length}
                    onClick={() => setSummaryLength(length)}
                    className={`w-full p-2 rounded-lg border transition-all text-left ${
                      summaryLength === length
                        ? 'border-muted-foreground bg-muted/50'
                        : 'border-border hover:bg-muted/30'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                        summaryLength === length
                          ? 'border-muted-foreground'
                          : 'border-border'
                      }`}>
                        {summaryLength === length && (
                          <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium capitalize text-[11px] text-foreground">{length}</div>
                        <div className="text-[10px] text-muted-foreground">
                          {length === 'short' && 'Brief overview (2-3 paragraphs)'}
                          {length === 'medium' && 'Standard summary (4-6 paragraphs)'}
                          {length === 'long' && 'Detailed breakdown (7-10 paragraphs)'}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Separator before Appearance */}
        <div className="border-t border-border/30 my-7" />

        {/* Appearance */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-3 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-muted rounded">
                <Palette className="w-3 h-3 text-muted-foreground" />
              </div>
              <div>
                <h2 className="text-xs font-semibold text-foreground uppercase tracking-wide">APPEARANCE</h2>
                <p className="text-[10px] text-muted-foreground">Customize the look and feel</p>
              </div>
            </div>
          </div>
          
          <div className="p-3">
            <div className="font-medium mb-2 text-[11px] text-foreground">Theme</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'light', label: 'Light', icon: '☀️' },
                { value: 'dark', label: 'Dark', icon: '🌙' },
                { value: 'system', label: 'System', icon: '💻' }
              ].map((themeOption) => (
                <button
                  key={themeOption.value}
                  onClick={() => setTheme(themeOption.value)}
                  className={`p-2.5 rounded-lg border transition-all ${
                    theme === themeOption.value
                      ? 'border-muted-foreground bg-muted/50'
                      : 'border-border hover:bg-muted/30'
                  }`}
                >
                  <div className="text-xl mb-1">{themeOption.icon}</div>
                  <div className="font-medium text-[11px] text-foreground">{themeOption.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Separator before Privacy & Security */}
        <div className="border-t border-border/30 my-7" />

        {/* Privacy & Security */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-3 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-muted rounded">
                <Shield className="w-3 h-3 text-muted-foreground" />
              </div>
              <div>
                <h2 className="text-xs font-semibold text-foreground uppercase tracking-wide">PRIVACY & SECURITY</h2>
                <p className="text-[10px] text-muted-foreground">Control your privacy settings</p>
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-border">
            <button className="w-full p-3 flex items-center justify-between hover:bg-muted/50 transition-colors text-left">
              <div className="flex items-center gap-2">
                <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                <div>
                  <div className="font-medium text-[11px] text-foreground">Privacy Settings</div>
                  <div className="text-[10px] text-muted-foreground">Manage who can see your activity</div>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            </button>

            <button className="w-full p-3 flex items-center justify-between hover:bg-muted/50 transition-colors text-left">
              <div className="flex items-center gap-2">
                <Download className="w-3.5 h-3.5 text-muted-foreground" />
                <div>
                  <div className="font-medium text-[11px] text-foreground">Download Your Data</div>
                  <div className="text-[10px] text-muted-foreground">Request a copy of your data</div>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            </button>

            <button className="w-full p-3 flex items-center justify-between hover:bg-muted/50 transition-colors text-left group">
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-muted-foreground" />
                <div>
                  <div className="font-medium text-[11px] text-foreground">Delete Account</div>
                  <div className="text-[10px] text-muted-foreground">Permanently delete your account and data</div>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Separator before About Settings */}
        <div className="border-t border-border/30 my-7" />

        {/* Page Footer Info */}
        <div className="bg-muted/50 border border-border/50 rounded-xl p-3 mb-0 shadow-sm hover:shadow-md transition-all">
          <div className="flex gap-2 items-start">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                <Palette className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <div>
              <h2 className="text-xs font-semibold mb-1 text-foreground">ABOUT SETTINGS</h2>
              <p className="text-[11px] text-muted-foreground leading-relaxed mb-1.5">
                Customize your Simplicity experience with personalized preferences for notifications, summaries, appearance, and privacy. Configure how you interact with podcast content and manage your account security.
              </p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">How to use:</span> Toggle notification preferences to control alerts. Adjust summary length based on your reading preference. Switch between Light, Dark, or System theme. Manage your privacy settings and account data from the Privacy & Security section.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}