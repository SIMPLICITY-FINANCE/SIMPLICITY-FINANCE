import { Mail, Send, HelpCircle, ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface ContactPageProps {
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

export function ContactPage({ isPremium, onUpgrade, onChatClick, isLoggedIn, userImage, userName, onSignIn, onProfileClick, onSettingsClick, onHelpClick, onSignOut }: ContactPageProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'How does Simplicity work?',
      answer: 'Simplicity transforms financial podcast episodes into concise, easy-to-read text summaries. Simply select a podcast episode from our catalog, and you\\\'ll get a detailed summary with key takeaways, topics covered, and timestamps—all in a clean, readable format.'
    },
    {
      question: 'What\\\'s the difference between Free and Premium?',
      answer: 'Free users get access to podcast summaries with ads in the right sidebar. Premium members enjoy an ad-free experience with our AI chatbot assistant, priority support, unlimited saves, and early access to new features.'
    },
    {
      question: 'How often are new summaries added?',
      answer: 'We add new podcast summaries daily as episodes are released. Popular financial podcasts are summarized within 24-48 hours of publication. Premium members can also request priority summarization for specific episodes.'
    },
    {
      question: 'Can I save summaries to read later?',
      answer: 'Yes! Click the bookmark icon on any episode summary to save it to your \"Saved\" collection. You can access all your saved summaries anytime from the left sidebar.'
    },
    {
      question: 'Do you offer audio playback?',
      answer: 'No, Simplicity focuses exclusively on text-based summaries. We believe reading summaries is the most efficient way to consume podcast content and retain key information.'
    },
    {
      question: 'Can I request a specific podcast to be added?',
      answer: 'Absolutely! Use the contact form below to suggest podcasts you\\\'d like to see on Simplicity. We regularly review user requests and prioritize the most popular suggestions.'
    },
    {
      question: 'How do I cancel my Premium subscription?',
      answer: 'You can cancel your Premium subscription anytime from Settings > Subscription. Your Premium benefits will continue until the end of your billing period.'
    },
    {
      question: 'Is my reading data private?',
      answer: 'Yes, we take privacy seriously. Your reading history, saved summaries, and personal preferences are never shared with third parties. See our Privacy Policy for full details.'
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* FAQ Section */}
      <div className="mb-0">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1 bg-muted rounded">
            <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <h2 className="text-xs font-semibold text-foreground uppercase tracking-wide">FREQUENTLY ASKED QUESTIONS</h2>
        </div>

        <div className="space-y-1.5">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-card border border-border/50 shadow-sm rounded-xl overflow-hidden hover:bg-muted/30 transition-all"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-muted/50 transition-colors"
              >
                <span className="font-medium pr-3 text-[11px] text-foreground">{faq.question}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-muted-foreground flex-shrink-0 transition-transform ${
                    openFaqIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFaqIndex === index && (
                <div className="px-3 pb-3 pt-0">
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Separator before Contact Form */}
      <div className="border-t border-border/30 my-7" />

      {/* Contact Form */}
      <div className="bg-muted/50 border border-border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1 bg-muted rounded">
            <Mail className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-xs font-semibold text-foreground uppercase tracking-wide">STILL NEED HELP?</h2>
            <p className="text-[10px] text-muted-foreground">Send us a message and we'll get back to you soon.</p>
          </div>
        </div>

        <form className="space-y-2.5">
          {/* Name & Email */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-medium mb-1 text-foreground">Name *</label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full px-2.5 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-muted-foreground focus:border-transparent transition-all text-[11px] text-foreground placeholder:text-muted-foreground"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-medium mb-1 text-foreground">Email *</label>
              <input
                type="email"
                placeholder="your.email@example.com"
                className="w-full px-2.5 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-muted-foreground focus:border-transparent transition-all text-[11px] text-foreground placeholder:text-muted-foreground"
                required
              />
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-[10px] font-medium mb-1 text-foreground">Subject *</label>
            <input
              type="text"
              placeholder="What's this about?"
              className="w-full px-2.5 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-muted-foreground focus:border-transparent transition-all text-[11px] text-foreground placeholder:text-muted-foreground"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-[10px] font-medium mb-1 text-foreground">Category</label>
            <select className="w-full px-2.5 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-muted-foreground focus:border-transparent transition-all text-[11px] text-foreground">
              <option>General Inquiry</option>
              <option>Technical Support</option>
              <option>Account & Billing</option>
              <option>Feature Request</option>
              <option>Podcast Suggestion</option>
              <option>Report an Issue</option>
              <option>Other</option>
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="block text-[10px] font-medium mb-1 text-foreground">Message *</label>
            <textarea
              placeholder="Tell us more about your inquiry..."
              rows={5}
              className="w-full px-2.5 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-muted-foreground focus:border-transparent transition-all resize-none text-[11px] text-foreground placeholder:text-muted-foreground"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 bg-foreground text-background rounded-lg hover:opacity-90 transition-all font-medium flex items-center justify-center gap-2 text-[11px]"
          >
            <Send className="w-3.5 h-3.5" />
            Send Message
          </button>

          <p className="text-[10px] text-muted-foreground text-center">
            We typically respond within 1-2 business days. Premium members receive priority support.
          </p>
        </form>
      </div>

      {/* Separator before About Help */}
      <div className="border-t border-border/30 my-7" />

      {/* Page Footer Info */}
      <div className="bg-muted/50 border border-border/50 rounded-xl p-3 mb-0 shadow-sm hover:shadow-md transition-all">
        <div className="flex gap-2 items-start">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
              <HelpCircle className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
          <div>
            <h2 className="text-xs font-semibold mb-1 text-foreground">ABOUT HELP</h2>
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-1.5">
              Find answers to common questions and get support for your Simplicity account. Browse our FAQ section for quick solutions or contact our support team directly for personalized assistance.
            </p>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              <span className="font-medium text-foreground">How to use:</span> Check the FAQ section above for answers to common questions about features, subscriptions, and usage. Use the contact form to reach our support team with specific inquiries. Premium members receive priority support with faster response times.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}