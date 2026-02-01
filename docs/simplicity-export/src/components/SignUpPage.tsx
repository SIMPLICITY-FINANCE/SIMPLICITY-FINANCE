import { useState } from 'react';
import { Sparkles, Mail, ArrowRight, Check } from 'lucide-react';

interface SignUpPageProps {
  onSignUpSuccess?: () => void;
  onBackToLanding?: () => void;
  onSignIn?: () => void;
}

export function SignUpPage({ onSignUpSuccess, onBackToLanding, onSignIn }: SignUpPageProps) {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<'email' | 'code' | 'success'>('email');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call to send verification code
    setTimeout(() => {
      setIsLoading(false);
      setStep('code');
    }, 1000);
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const enteredCode = code.join('');
    if (enteredCode.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);

    // Simulate API call to verify code
    setTimeout(() => {
      setIsLoading(false);
      setStep('success');
      
      // Redirect to app after success
      setTimeout(() => {
        onSignUpSuccess?.();
      }, 1500);
    }, 1000);
  };

  const handleResendCode = () => {
    setCode(['', '', '', '', '', '']);
    setError('');
    setIsLoading(true);
    
    // Simulate resending code
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-12">
          <div className="w-10 h-10 bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 dark:from-slate-800 dark:via-indigo-900 dark:to-purple-900 rounded-xl flex items-center justify-center shadow-lg ring-1 ring-black/5 dark:ring-white/5">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-wide text-foreground">SIMPLICITY</span>
        </div>

        {/* Sign Up Card */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
          {step === 'email' && (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2 text-foreground">Create your account</h1>
                <p className="text-sm text-muted-foreground">
                  Enter your email to get started. No password required.
                </p>
              </div>

              <form onSubmit={handleSendCode} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2 text-foreground">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-foreground placeholder:text-muted-foreground transition-all"
                      required
                      autoFocus
                    />
                  </div>
                  {error && (
                    <p className="mt-2 text-xs text-red-500">{error}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !email}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 dark:from-slate-800 dark:via-indigo-900 dark:to-purple-900 hover:opacity-90 text-white rounded-lg font-semibold transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending code...
                    </>
                  ) : (
                    <>
                      Continue with email
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-xs text-muted-foreground">
                  By continuing, you agree to our{' '}
                  <button className="text-foreground hover:underline">Terms of Service</button>
                  {' '}and{' '}
                  <button className="text-foreground hover:underline">Privacy Policy</button>
                </p>
              </div>

              {onBackToLanding && (
                <div className="mt-6 text-center">
                  <button
                    onClick={onBackToLanding}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ← Back to home
                  </button>
                </div>
              )}
            </>
          )}

          {step === 'code' && (
            <>
              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-950/50 dark:to-purple-950/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h1 className="text-2xl font-bold mb-2 text-foreground">Check your email</h1>
                <p className="text-sm text-muted-foreground">
                  We sent a 6-digit code to
                </p>
                <p className="text-sm font-medium text-foreground mt-1">
                  {email}
                </p>
              </div>

              <form onSubmit={handleVerifyCode} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3 text-center text-foreground">
                    Enter verification code
                  </label>
                  <div className="flex gap-2 justify-center">
                    {code.map((digit, index) => (
                      <input
                        key={index}
                        id={`code-${index}`}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleCodeChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-12 h-14 text-center text-lg font-semibold bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-foreground transition-all"
                        autoFocus={index === 0}
                      />
                    ))}
                  </div>
                  {error && (
                    <p className="mt-3 text-xs text-red-500 text-center">{error}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || code.join('').length !== 6}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 dark:from-slate-800 dark:via-indigo-900 dark:to-purple-950 hover:opacity-90 text-white rounded-lg font-semibold transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify and continue
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center space-y-2">
                <p className="text-xs text-muted-foreground">
                  Didn't receive the code?
                </p>
                <button
                  onClick={handleResendCode}
                  disabled={isLoading}
                  className="text-sm font-medium text-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors disabled:opacity-50"
                >
                  Resend code
                </button>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={() => {
                    setStep('email');
                    setCode(['', '', '', '', '', '']);
                    setError('');
                  }}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  ← Use a different email
                </button>
              </div>
            </>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-950/50 dark:to-emerald-950/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-2xl font-bold mb-2 text-foreground">Welcome to Simplicity!</h1>
              <p className="text-sm text-muted-foreground mb-6">
                Your account has been created successfully.
              </p>
              <div className="flex justify-center">
                <div className="w-8 h-8 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Redirecting you to the app...
              </p>
            </div>
          )}
        </div>

        {/* Additional Info */}
        {step === 'email' && (
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <button
                onClick={onSignIn}
                className="font-medium text-foreground hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                Sign in
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}