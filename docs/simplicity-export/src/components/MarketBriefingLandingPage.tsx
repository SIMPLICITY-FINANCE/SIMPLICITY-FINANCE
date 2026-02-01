import { ArrowRight, TrendingUp, FileText, Radio, Calendar, BarChart3, Activity, Users, Briefcase, LineChart, CheckCircle2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface MarketBriefingLandingPageProps {
  onSignIn?: () => void;
  onSignUp?: () => void;
  onViewSampleReport?: () => void;
}

export function MarketBriefingLandingPage({ 
  onSignIn = () => {}, 
  onSignUp = () => {},
  onViewSampleReport = () => {} 
}: MarketBriefingLandingPageProps) {
  
  return (
    <div className="min-h-screen bg-[#fafaf9]">
      {/* Navigation Bar */}
      <nav className="border-b border-border/30 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-[#1a1a1a] rounded-md flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-[#1a1a1a] tracking-tight">SIMPLICITY</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-[#525252] hover:text-[#1a1a1a] transition-colors">Features</a>
              <a href="#pricing" className="text-sm text-[#525252] hover:text-[#1a1a1a] transition-colors">Pricing</a>
              <button 
                onClick={onViewSampleReport}
                className="text-sm text-[#525252] hover:text-[#1a1a1a] transition-colors"
              >
                Sample Report
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                onClick={onSignIn}
                className="px-4 py-1.5 bg-[#1a1a1a] text-white text-sm hover:bg-[#2a2a2a] transition-colors rounded-md"
              >
                Sign In
              </button>
              <button 
                onClick={onSignUp}
                className="px-4 py-1.5 bg-[#1a1a1a] text-white text-sm hover:bg-[#2a2a2a] transition-colors rounded-md"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-semibold text-[#1a1a1a] mb-6 leading-tight">
                Understand the Markets in 5 Minutes a Day.
              </h1>
              <p className="text-lg text-[#525252] mb-8 leading-relaxed">
                AI-generated summaries of financial podcasts, news, macro data, and prediction markets — structured, neutral, and signal-driven.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={onSignUp}
                  className="px-6 py-3 bg-[#1a1a1a] text-white hover:bg-[#2a2a2a] transition-colors rounded-lg flex items-center justify-center gap-2 group"
                >
                  Sign Up
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={onViewSampleReport}
                  className="px-6 py-3 bg-white text-[#1a1a1a] border border-border hover:bg-[#f5f5f5] transition-colors rounded-lg"
                >
                  View Sample Report
                </button>
              </div>
            </div>
            
            {/* Product Mockup */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl border border-border/30 overflow-hidden">
                <div className="bg-[#f5f5f5] border-b border-border/30 px-4 py-3 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#dc2626]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></div>
                  <span className="text-xs text-[#525252] ml-4">Market Briefing — Today</span>
                </div>
                <div className="p-6 space-y-4">
                  {/* Mock feed items */}
                  <div className="bg-[#fafaf9] rounded-lg p-4 border border-border/30">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-medium text-[#525252]">SHORT-TERM</span>
                      <span className="text-xs px-2 py-0.5 bg-[#10b981]/10 text-[#10b981] rounded">High Confidence</span>
                    </div>
                    <p className="text-sm text-[#1a1a1a] mb-2">Fed speakers signal potential rate pause...</p>
                    <div className="flex gap-2 text-xs text-[#737373]">
                      <span>Markets</span>
                      <span>•</span>
                      <span>Economy</span>
                    </div>
                  </div>
                  
                  <div className="bg-[#fafaf9] rounded-lg p-4 border border-border/30">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-medium text-[#525252]">MEDIUM-TERM</span>
                      <span className="text-xs px-2 py-0.5 bg-[#f59e0b]/10 text-[#f59e0b] rounded">Medium Confidence</span>
                    </div>
                    <p className="text-sm text-[#1a1a1a] mb-2">Tech earnings season shows divergence...</p>
                    <div className="flex gap-2 text-xs text-[#737373]">
                      <span>Markets</span>
                      <span>•</span>
                      <span>Tech</span>
                    </div>
                  </div>
                  
                  <div className="bg-[#fafaf9] rounded-lg p-4 border border-border/30">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-medium text-[#525252]">LONG-TERM</span>
                      <span className="text-xs px-2 py-0.5 bg-[#525252]/10 text-[#525252] rounded">Speculative</span>
                    </div>
                    <p className="text-sm text-[#1a1a1a] mb-2">Geopolitical tensions may reshape supply chains...</p>
                    <div className="flex gap-2 text-xs text-[#737373]">
                      <span>Geo-Politics</span>
                      <span>•</span>
                      <span>Economy</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-semibold text-[#1a1a1a] text-center mb-4">
            Too Much Content. Not Enough Signal.
          </h2>
          <p className="text-center text-[#525252] mb-12 max-w-2xl mx-auto">
            Market participants face an overwhelming amount of information every day.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#fafaf9] rounded-xl p-6 border border-border/30">
              <div className="w-10 h-10 bg-[#1a1a1a] rounded-lg flex items-center justify-center mb-4">
                <Radio className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-medium text-[#1a1a1a] mb-2">Hours of podcasts, no time to listen</h3>
              <p className="text-sm text-[#525252] leading-relaxed">
                Financial podcasts contain valuable insights, but listening takes too much time.
              </p>
            </div>
            
            <div className="bg-[#fafaf9] rounded-xl p-6 border border-border/30">
              <div className="w-10 h-10 bg-[#1a1a1a] rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-medium text-[#1a1a1a] mb-2">News headlines without context</h3>
              <p className="text-sm text-[#525252] leading-relaxed">
                Headlines grab attention but rarely provide the full picture you need.
              </p>
            </div>
            
            <div className="bg-[#fafaf9] rounded-xl p-6 border border-border/30">
              <div className="w-10 h-10 bg-[#1a1a1a] rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-medium text-[#1a1a1a] mb-2">Opinions mixed with facts and predictions</h3>
              <p className="text-sm text-[#525252] leading-relaxed">
                Hard to distinguish between data-driven insights and speculation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 px-6 bg-[#fafaf9]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-[#1a1a1a] text-center mb-4">
            One Page. Everything That Matters.
          </h2>
          <p className="text-center text-[#525252] mb-12 max-w-2xl mx-auto">
            Every insight structured, categorized, and confidence-rated.
          </p>
          
          {/* Full-width Report Mockup */}
          <div className="bg-white rounded-2xl shadow-xl border border-border/30 overflow-hidden">
            <div className="bg-[#f5f5f5] border-b border-border/30 px-6 py-4">
              <h3 className="font-semibold text-[#1a1a1a]">Daily Market Briefing</h3>
              <p className="text-sm text-[#525252]">Monday, February 1, 2026</p>
            </div>
            
            <div className="p-8 space-y-6">
              {/* Short/Medium/Long Term Section */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-6 bg-[#10b981] rounded"></div>
                    <h4 className="font-medium text-[#1a1a1a]">Short-Term</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-[#525252] leading-relaxed">
                      • Fed speakers signal dovish tone
                    </div>
                    <div className="text-sm text-[#525252] leading-relaxed">
                      • Treasury yields compress further
                    </div>
                    <div className="text-sm text-[#525252] leading-relaxed">
                      • Tech sector rotation continues
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-6 bg-[#3b82f6] rounded"></div>
                    <h4 className="font-medium text-[#1a1a1a]">Medium-Term</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-[#525252] leading-relaxed">
                      • Q1 earnings season outlook mixed
                    </div>
                    <div className="text-sm text-[#525252] leading-relaxed">
                      • Inflation expectations stable
                    </div>
                    <div className="text-sm text-[#525252] leading-relaxed">
                      • Dollar weakness expected to persist
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-1 h-6 bg-[#8b5cf6] rounded"></div>
                    <h4 className="font-medium text-[#1a1a1a]">Long-Term</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-[#525252] leading-relaxed">
                      • Structural shifts in energy markets
                    </div>
                    <div className="text-sm text-[#525252] leading-relaxed">
                      • Fiscal policy concerns mounting
                    </div>
                    <div className="text-sm text-[#525252] leading-relaxed">
                      • Demographic trends impact growth
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Category Breakdown */}
              <div className="border-t border-border/30 pt-6 mt-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <div className="text-xs font-medium text-[#525252] mb-2">ECONOMY</div>
                    <div className="text-sm text-[#1a1a1a] mb-1">CPI data in line with expectations</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-[#f5f5f5] rounded-full overflow-hidden">
                        <div className="h-full bg-[#10b981] w-4/5"></div>
                      </div>
                      <span className="text-xs text-[#525252]">80%</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs font-medium text-[#525252] mb-2">GEO-POLITICS</div>
                    <div className="text-sm text-[#1a1a1a] mb-1">Trade negotiations progressing</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-[#f5f5f5] rounded-full overflow-hidden">
                        <div className="h-full bg-[#f59e0b] w-3/5"></div>
                      </div>
                      <span className="text-xs text-[#525252]">60%</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs font-medium text-[#525252] mb-2">MARKETS</div>
                    <div className="text-sm text-[#1a1a1a] mb-1">Volatility expected to increase</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-[#f5f5f5] rounded-full overflow-hidden">
                        <div className="h-full bg-[#3b82f6] w-2/3"></div>
                      </div>
                      <span className="text-xs text-[#525252]">70%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-[#1a1a1a] text-center mb-4">
            Comprehensive Market Intelligence
          </h2>
          <p className="text-center text-[#525252] mb-12 max-w-2xl mx-auto">
            All the data sources and insights you need in one structured format.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-[#fafaf9] rounded-xl p-6 border border-border/30 hover:shadow-md hover:bg-accent/30 hover:border-border transition-all">
              <div className="w-10 h-10 bg-[#1a1a1a] rounded-lg flex items-center justify-center mb-4">
                <Radio className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-medium text-[#1a1a1a] mb-2">Podcast & YouTube Intelligence</h3>
              <p className="text-sm text-[#525252] leading-relaxed">
                Automatically summarises trusted shows and channels so you never miss key insights.
              </p>
            </div>
            
            <div className="bg-[#fafaf9] rounded-xl p-6 border border-border/30 hover:shadow-md hover:bg-accent/30 hover:border-border transition-all">
              <div className="w-10 h-10 bg-[#1a1a1a] rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-medium text-[#1a1a1a] mb-2">Structured Market Reports</h3>
              <p className="text-sm text-[#525252] leading-relaxed">
                Fixed format, consistent structure, zero fluff. Know exactly where to find what you need.
              </p>
            </div>
            
            <div className="bg-[#fafaf9] rounded-xl p-6 border border-border/30 hover:shadow-md hover:bg-accent/30 hover:border-border transition-all">
              <div className="w-10 h-10 bg-[#1a1a1a] rounded-lg flex items-center justify-center mb-4">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-medium text-[#1a1a1a] mb-2">Economic Calendar & Macro Data</h3>
              <p className="text-sm text-[#525252] leading-relaxed">
                CPI, rates, GDP, employment — all key economic indicators tracked and contextualized.
              </p>
            </div>
            
            <div className="bg-[#fafaf9] rounded-xl p-6 border border-border/30 hover:shadow-md hover:bg-accent/30 hover:border-border transition-all">
              <div className="w-10 h-10 bg-[#1a1a1a] rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-medium text-[#1a1a1a] mb-2">Prediction Market Probabilities</h3>
              <p className="text-sm text-[#525252] leading-relaxed">
                Market-implied odds from Polymarket and other prediction markets integrated into reports.
              </p>
            </div>
            
            <div className="bg-[#fafaf9] rounded-xl p-6 border border-border/30 hover:shadow-md hover:bg-accent/30 hover:border-border transition-all">
              <div className="w-10 h-10 bg-[#1a1a1a] rounded-lg flex items-center justify-center mb-4">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-medium text-[#1a1a1a] mb-2">Real-Time News & Social Signals</h3>
              <p className="text-sm text-[#525252] leading-relaxed">
                Curated news and Twitter/X feed filtered for relevance, not noise.
              </p>
            </div>
            
            <div className="bg-[#fafaf9] rounded-xl p-6 border border-border/30 hover:shadow-md hover:bg-accent/30 hover:border-border transition-all">
              <div className="w-10 h-10 bg-[#1a1a1a] rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-medium text-[#1a1a1a] mb-2">Confidence & Consensus Indicators</h3>
              <p className="text-sm text-[#525252] leading-relaxed">
                See what's strong vs speculative with clear confidence ratings on every insight.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-[#fafaf9]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-semibold text-[#1a1a1a] text-center mb-4">
            How It Works
          </h2>
          <p className="text-center text-[#525252] mb-12 max-w-2xl mx-auto">
            From data ingestion to actionable insights in three steps.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#1a1a1a] rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-semibold">1</span>
              </div>
              <h3 className="font-medium text-[#1a1a1a] mb-2">We ingest trusted sources</h3>
              <p className="text-sm text-[#525252] leading-relaxed">
                Financial podcasts, YouTube channels, news feeds, macro data, and prediction markets.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-[#1a1a1a] rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-semibold">2</span>
              </div>
              <h3 className="font-medium text-[#1a1a1a] mb-2">AI extracts & structures insights</h3>
              <p className="text-sm text-[#525252] leading-relaxed">
                Advanced language models identify key insights and organize them by timeframe and category.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-[#1a1a1a] rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-semibold">3</span>
              </div>
              <h3 className="font-medium text-[#1a1a1a] mb-2">You read one clear report</h3>
              <p className="text-sm text-[#525252] leading-relaxed">
                Everything you need to know, organized and ready to inform your decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-semibold text-[#1a1a1a] text-center mb-4">
            Built for Market Participants
          </h2>
          <p className="text-center text-[#525252] mb-12 max-w-2xl mx-auto">
            Designed for professionals who need signal, not noise.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#fafaf9] rounded-xl p-6 border border-border/30 text-center">
              <div className="w-12 h-12 bg-[#1a1a1a] rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-medium text-[#1a1a1a] mb-2">Investors</h3>
              <p className="text-sm text-[#525252]">
                Long-term capital allocators seeking macro context.
              </p>
            </div>
            
            <div className="bg-[#fafaf9] rounded-xl p-6 border border-border/30 text-center">
              <div className="w-12 h-12 bg-[#1a1a1a] rounded-xl flex items-center justify-center mx-auto mb-4">
                <LineChart className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-medium text-[#1a1a1a] mb-2">Traders</h3>
              <p className="text-sm text-[#525252]">
                Active market participants needing fast market reads.
              </p>
            </div>
            
            <div className="bg-[#fafaf9] rounded-xl p-6 border border-border/30 text-center">
              <div className="w-12 h-12 bg-[#1a1a1a] rounded-xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-medium text-[#1a1a1a] mb-2">Analysts</h3>
              <p className="text-sm text-[#525252]">
                Research professionals monitoring multiple indicators.
              </p>
            </div>
            
            <div className="bg-[#fafaf9] rounded-xl p-6 border border-border/30 text-center">
              <div className="w-12 h-12 bg-[#1a1a1a] rounded-xl flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-medium text-[#1a1a1a] mb-2">Macro-focused</h3>
              <p className="text-sm text-[#525252]">
                Professionals tracking economic and geopolitical trends.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-6 bg-[#fafaf9]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-semibold text-[#1a1a1a] text-center mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-center text-[#525252] mb-12 max-w-2xl mx-auto">
            Choose the frequency that matches your needs.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-8 border border-border/30 hover:shadow-lg transition-shadow">
              <div className="text-center mb-6">
                <h3 className="font-medium text-[#1a1a1a] mb-2">Weekly</h3>
                <div className="flex items-baseline justify-center gap-1 mb-1">
                  <span className="text-4xl font-semibold text-[#1a1a1a]">$1</span>
                  <span className="text-sm text-[#525252]">/week</span>
                </div>
                <p className="text-sm text-[#525252]">Perfect for weekend review</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2 text-sm text-[#525252]">
                  <CheckCircle2 className="w-4 h-4 text-[#10b981] mt-0.5 flex-shrink-0" />
                  <span>One comprehensive report per week</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-[#525252]">
                  <CheckCircle2 className="w-4 h-4 text-[#10b981] mt-0.5 flex-shrink-0" />
                  <span>All major sources covered</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-[#525252]">
                  <CheckCircle2 className="w-4 h-4 text-[#10b981] mt-0.5 flex-shrink-0" />
                  <span>Email delivery</span>
                </li>
              </ul>
              <button 
                onClick={onSignUp}
                className="w-full px-6 py-2.5 border border-border text-[#1a1a1a] hover:bg-[#f5f5f5] transition-colors rounded-lg"
              >
                Get Started
              </button>
            </div>
            
            <div className="bg-white rounded-xl p-8 border-2 border-[#1a1a1a] hover:shadow-xl transition-shadow relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#1a1a1a] text-white text-xs rounded-full">
                Most Popular
              </div>
              <div className="text-center mb-6">
                <h3 className="font-medium text-[#1a1a1a] mb-2">Bi-Weekly</h3>
                <div className="flex items-baseline justify-center gap-1 mb-1">
                  <span className="text-4xl font-semibold text-[#1a1a1a]">$3</span>
                  <span className="text-sm text-[#525252]">/2 weeks</span>
                </div>
                <p className="text-sm text-[#525252]">Stay current, not overwhelmed</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2 text-sm text-[#525252]">
                  <CheckCircle2 className="w-4 h-4 text-[#10b981] mt-0.5 flex-shrink-0" />
                  <span>Two comprehensive reports per week</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-[#525252]">
                  <CheckCircle2 className="w-4 h-4 text-[#10b981] mt-0.5 flex-shrink-0" />
                  <span>All sources + breaking updates</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-[#525252]">
                  <CheckCircle2 className="w-4 h-4 text-[#10b981] mt-0.5 flex-shrink-0" />
                  <span>Priority email delivery</span>
                </li>
              </ul>
              <button 
                onClick={onSignUp}
                className="w-full px-6 py-2.5 bg-[#1a1a1a] text-white hover:bg-[#2a2a2a] transition-colors rounded-lg"
              >
                Get Started
              </button>
            </div>
            
            <div className="bg-white rounded-xl p-8 border border-border/30 hover:shadow-lg transition-shadow">
              <div className="text-center mb-6">
                <h3 className="font-medium text-[#1a1a1a] mb-2">Daily</h3>
                <div className="flex items-baseline justify-center gap-1 mb-1">
                  <span className="text-4xl font-semibold text-[#1a1a1a]">$5</span>
                  <span className="text-sm text-[#525252]">/week</span>
                </div>
                <p className="text-sm text-[#525252]">Maximum market awareness</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-2 text-sm text-[#525252]">
                  <CheckCircle2 className="w-4 h-4 text-[#10b981] mt-0.5 flex-shrink-0" />
                  <span>Daily morning briefings</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-[#525252]">
                  <CheckCircle2 className="w-4 h-4 text-[#10b981] mt-0.5 flex-shrink-0" />
                  <span>Real-time breaking updates</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-[#525252]">
                  <CheckCircle2 className="w-4 h-4 text-[#10b981] mt-0.5 flex-shrink-0" />
                  <span>Premium support</span>
                </li>
              </ul>
              <button 
                onClick={onSignUp}
                className="w-full px-6 py-2.5 bg-[#1a1a1a] text-white hover:bg-[#2a2a2a] transition-colors rounded-lg"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-semibold text-[#1a1a1a] mb-4">
            Stop Scrolling. Start Understanding.
          </h2>
          <p className="text-lg text-[#525252] mb-8">
            Create your account and start receiving structured market intelligence.
          </p>
          <button 
            onClick={onSignUp}
            className="px-8 py-3.5 bg-[#1a1a1a] text-white hover:bg-[#2a2a2a] transition-colors rounded-lg inline-flex items-center gap-2 group"
          >
            Sign Up Now
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 bg-[#fafaf9] py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-[#1a1a1a] rounded-md flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-[#1a1a1a]">SIMPLICITY</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-[#525252]">
              <button onClick={onViewSampleReport} className="hover:text-[#1a1a1a] transition-colors">About</button>
              <button className="hover:text-[#1a1a1a] transition-colors">Privacy</button>
              <button className="hover:text-[#1a1a1a] transition-colors">Terms</button>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-border/30 text-center">
            <p className="text-xs text-[#737373]">
              Informational only. No investment advice. © 2026 SIMPLICITY. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}