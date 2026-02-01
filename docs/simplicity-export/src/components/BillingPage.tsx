import { useState } from 'react';
import { 
  CreditCard, 
  Calendar, 
  Download, 
  Check,
  ChevronRight,
  Crown,
  AlertCircle,
  X
} from 'lucide-react';

interface BillingPageProps {
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

interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: 'paid' | 'pending' | 'failed';
  invoiceNumber: string;
}

export function BillingPage({ isPremium, onUpgrade }: BillingPageProps) {
  const [showCancelModal, setShowCancelModal] = useState(false);

  const mockInvoices: Invoice[] = [
    { id: '1', date: 'Jan 15, 2026', amount: '$12.99', status: 'paid', invoiceNumber: 'INV-2026-001' },
    { id: '2', date: 'Dec 15, 2025', amount: '$12.99', status: 'paid', invoiceNumber: 'INV-2025-012' },
    { id: '3', date: 'Nov 15, 2025', amount: '$12.99', status: 'paid', invoiceNumber: 'INV-2025-011' },
    { id: '4', date: 'Oct 15, 2025', amount: '$12.99', status: 'paid', invoiceNumber: 'INV-2025-010' },
  ];

  return (
    <div className="max-w-xl mx-auto">
      <div>
        {/* Current Plan */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="p-2.5 md:p-3 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-muted rounded">
                <Crown className="w-3 h-3 text-muted-foreground" />
              </div>
              <div>
                <h2 className="text-xs font-semibold text-foreground uppercase tracking-wide">CURRENT PLAN</h2>
                <p className="text-[10px] text-muted-foreground">Your subscription details</p>
              </div>
            </div>
          </div>
          
          <div className="p-3 md:p-4">
            {isPremium ? (
              <div>
                <div className="flex items-start justify-between mb-2.5 md:mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-foreground">Premium</h3>
                      <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-500 text-[10px] font-medium rounded-full">
                        Active
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">Full access to all features</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-foreground">$12.99</div>
                    <div className="text-[10px] text-muted-foreground">per month</div>
                  </div>
                </div>

                {/* Features List */}
                <div className="bg-muted/30 rounded-lg p-2.5 md:p-3 mb-2.5 md:mb-3">
                  <div className="space-y-1.5">
                    {[
                      'Unlimited AI summaries',
                      'Priority processing',
                      'Advanced analytics',
                      'Export summaries as PDF',
                      'No ads'
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                        <span className="text-[11px] text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Next Billing Date */}
                <div className="flex items-center justify-between p-2.5 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-[11px] text-foreground">Next billing date</span>
                  </div>
                  <span className="text-[11px] font-medium text-foreground">Feb 15, 2026</span>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-start justify-between mb-2.5 md:mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-1">Free</h3>
                    <p className="text-[11px] text-muted-foreground">Basic features included</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-foreground">$0</div>
                    <div className="text-[10px] text-muted-foreground">per month</div>
                  </div>
                </div>

                {/* Features List */}
                <div className="bg-muted/30 rounded-lg p-2.5 md:p-3 mb-2.5 md:mb-3">
                  <div className="space-y-1.5">
                    {[
                      '5 AI summaries per month',
                      'Standard processing',
                      'Basic features'
                    ].map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                        <span className="text-[11px] text-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Upgrade Button */}
                {onUpgrade && (
                  <button
                    onClick={onUpgrade}
                    className="w-full py-2.5 px-4 bg-foreground hover:bg-foreground/90 text-background rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Crown className="w-4 h-4" />
                    <span className="text-xs font-semibold">Upgrade to Premium</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Payment Method - Only show for Premium users */}
        {isPremium && (
          <>
            <div className="border-t border-border/30 my-5 md:my-7" />

            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="p-2.5 md:p-3 border-b border-border bg-muted/30">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-muted rounded">
                    <CreditCard className="w-3 h-3 text-muted-foreground" />
                  </div>
                  <div>
                    <h2 className="text-xs font-semibold text-foreground uppercase tracking-wide">PAYMENT METHOD</h2>
                    <p className="text-[10px] text-muted-foreground">Manage your payment information</p>
                  </div>
                </div>
              </div>
              
              <div className="divide-y divide-border">
                <button className="w-full p-2.5 md:p-3 flex items-center justify-between hover:bg-muted/50 transition-colors text-left">
                  <div className="flex items-center gap-2.5 md:gap-3">
                    <div className="w-9 md:w-10 h-6 md:h-7 bg-gradient-to-br from-gray-700 to-gray-900 rounded flex items-center justify-center flex-shrink-0">
                      <CreditCard className="w-3.5 md:w-4 h-3.5 md:h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-[11px] text-foreground">•••• •••• •••• 4242</div>
                      <div className="text-[10px] text-muted-foreground">Expires 12/2027</div>
                    </div>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                </button>

                <button className="w-full p-2.5 md:p-3 flex items-center justify-center hover:bg-muted/50 transition-colors">
                  <span className="text-[11px] font-medium text-foreground">+ Add Payment Method</span>
                </button>
              </div>
            </div>
          </>
        )}

        {/* Billing History - Only show for Premium users */}
        {isPremium && (
          <>
            <div className="border-t border-border/30 my-5 md:my-7" />

            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="p-2.5 md:p-3 border-b border-border bg-muted/30">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-muted rounded">
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                  </div>
                  <div>
                    <h2 className="text-xs font-semibold text-foreground uppercase tracking-wide">BILLING HISTORY</h2>
                    <p className="text-[10px] text-muted-foreground">View and download invoices</p>
                  </div>
                </div>
              </div>
              
              <div className="divide-y divide-border">
                {mockInvoices.map((invoice) => (
                  <div key={invoice.id} className="p-2.5 md:p-3 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 md:gap-2 mb-0.5 md:mb-1 flex-wrap">
                          <span className="text-[11px] font-medium text-foreground whitespace-nowrap">{invoice.date}</span>
                          <span className={`px-1.5 md:px-2 py-0.5 text-[9px] font-medium rounded-full whitespace-nowrap ${
                            invoice.status === 'paid' 
                              ? 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400' 
                              : invoice.status === 'pending'
                              ? 'bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400'
                              : 'bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400'
                          }`}>
                            {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                          </span>
                        </div>
                        <div className="text-[10px] text-muted-foreground">{invoice.invoiceNumber}</div>
                      </div>
                      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                        <span className="text-[11px] font-semibold text-foreground">{invoice.amount}</span>
                        <button 
                          className="p-1.5 hover:bg-muted rounded-lg transition-colors"
                          title="Download invoice"
                        >
                          <Download className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Cancel Subscription - Only show for Premium users */}
        {isPremium && (
          <>
            <div className="border-t border-border/30 my-5 md:my-7" />

            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setShowCancelModal(true)}
                className="w-full p-2.5 md:p-3 flex items-center justify-between hover:bg-muted/50 transition-colors text-left group"
              >
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-3.5 h-3.5 text-red-600 dark:text-red-400 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-[11px] text-red-600 dark:text-red-400">Cancel Subscription</div>
                    <div className="text-[10px] text-muted-foreground">End your premium membership</div>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
              </button>
            </div>
          </>
        )}

        {/* Separator before About section */}
        <div className="border-t border-border/30 my-5 md:my-7" />

        {/* Page Footer Info */}
        <div className="bg-muted/50 border border-border/50 rounded-xl p-2.5 md:p-3 mb-0 shadow-sm hover:shadow-md transition-all">
          <div className="flex gap-2 items-start">
            <div className="flex-shrink-0">
              <div className="w-7 md:w-8 h-7 md:h-8 rounded-lg bg-muted flex items-center justify-center">
                <CreditCard className="w-3.5 md:w-4 h-3.5 md:h-4 text-muted-foreground" />
              </div>
            </div>
            <div>
              <h2 className="text-xs font-semibold mb-1 text-foreground">ABOUT BILLING</h2>
              <p className="text-[11px] text-muted-foreground leading-relaxed mb-1.5">
                Manage your subscription, payment methods, and billing history. Your subscription automatically renews each month unless cancelled. All payments are processed securely.
              </p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">How to use:</span> View your current plan details and next billing date. Update or add payment methods. Download invoices from your billing history. Cancel your subscription anytime with access until the end of your billing period.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-3 md:p-4" onClick={() => setShowCancelModal(false)}>
          <div className="bg-background rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b border-border sticky top-0 bg-background z-10">
              <h2 className="text-sm font-semibold text-foreground">Cancel Subscription</h2>
              <button
                onClick={() => setShowCancelModal(false)}
                className="w-8 h-8 rounded-full hover:bg-muted transition-colors flex items-center justify-center flex-shrink-0"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-4 md:p-5">
              <div className="mb-4">
                <p className="text-[11px] text-foreground leading-relaxed mb-3">
                  Are you sure you want to cancel your Premium subscription? You'll lose access to:
                </p>
                <div className="space-y-1.5 mb-3 md:mb-4">
                  {[
                    'Unlimited AI summaries',
                    'Priority processing',
                    'Advanced analytics',
                    'Export summaries as PDF'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <X className="w-3.5 h-3.5 text-red-600 dark:text-red-400 flex-shrink-0" />
                      <span className="text-[11px] text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/30 rounded-lg p-2.5 md:p-3">
                  <p className="text-[11px] text-amber-900 dark:text-amber-200 leading-relaxed">
                    <span className="font-semibold">Note:</span> You'll continue to have access to Premium features until Feb 15, 2026. After that, your account will be downgraded to the Free plan.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row gap-2">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 py-2.5 px-4 bg-foreground hover:bg-foreground/90 text-background rounded-lg transition-colors order-1 md:order-1"
                >
                  <span className="text-xs font-semibold">Keep Premium</span>
                </button>
                <button
                  onClick={() => {
                    // Handle cancellation
                    setShowCancelModal(false);
                  }}
                  className="flex-1 py-2.5 px-4 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors order-2 md:order-2"
                >
                  <span className="text-xs font-semibold">Cancel Subscription</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}