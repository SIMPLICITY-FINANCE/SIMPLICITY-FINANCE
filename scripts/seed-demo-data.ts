#!/usr/bin/env tsx
/**
 * Idempotent demo data seeder for Simplicity Finance
 * Generates realistic test data to validate UX end-to-end
 * Safe to run multiple times (uses upserts)
 */

import { config } from "dotenv";
import postgres from "postgres";

// Load environment variables
config({ path: ".env.local" });

const sql = postgres(process.env.DATABASE_URL!, {
  max: 1,
});

async function seedDemoData() {
  console.log("🌱 Seeding demo data...\n");

  try {
    await sql.begin(async (tx) => {
      // 1. Ensure demo user exists
      console.log("1️⃣  Creating demo user...");
      const [demoUser] = await tx`
        INSERT INTO users (id, email, name, role)
        VALUES ('00000000-0000-0000-0000-000000000001', 'demo@simplicity-finance.com', 'Demo User', 'user')
        ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
        RETURNING id
      `;
      console.log(`   ✓ Demo user: ${demoUser.id}\n`);

      // 2. Create demo shows
      console.log("2️⃣  Creating demo shows...");
      const shows = [
        { name: "All-In Podcast", channel_id: "UCESLZhusAkFfsNsApnjF_Cg" },
        { name: "The Compound and Friends", channel_id: "UCN99hcKPdZjXWdJXjRZGdRg" },
        { name: "Acquired", channel_id: "UCKJNzy_GuvX3SAg5BKzF_XQ" },
      ];

      const showIds: Record<string, string> = {};
      for (const show of shows) {
        const [result] = await tx`
          INSERT INTO shows (name, youtube_channel_id)
          VALUES (${show.name}, ${show.channel_id})
          ON CONFLICT (youtube_channel_id) DO UPDATE SET name = EXCLUDED.name
          RETURNING id, youtube_channel_id
        `;
        showIds[show.channel_id] = result.id;
      }
      console.log(`   ✓ Created ${shows.length} shows\n`);

      // 3. Create demo episodes
      console.log("3️⃣  Creating demo episodes...");
      const episodes = [
        { videoId: "demo-ep-001", channelId: "UCESLZhusAkFfsNsApnjF_Cg", title: "Fed Rate Cuts and Market Impact", date: "2024-01-15", channel: "All-In Podcast" },
        { videoId: "demo-ep-002", channelId: "UCESLZhusAkFfsNsApnjF_Cg", title: "Tech Earnings Season Preview", date: "2024-01-20", channel: "All-In Podcast" },
        { videoId: "demo-ep-003", channelId: "UCN99hcKPdZjXWdJXjRZGdRg", title: "Bitcoin ETF Approval Analysis", date: "2024-01-25", channel: "The Compound and Friends" },
        { videoId: "demo-ep-004", channelId: "UCN99hcKPdZjXWdJXjRZGdRg", title: "Real Estate Market Trends 2024", date: "2024-02-01", channel: "The Compound and Friends" },
        { videoId: "demo-ep-005", channelId: "UCKJNzy_GuvX3SAg5BKzF_XQ", title: "NVIDIA AI Chip Dominance", date: "2024-02-05", channel: "Acquired" },
      ];

      const episodeIds: string[] = [];
      for (const ep of episodes) {
        const [episode] = await tx`
          INSERT INTO episodes (
            source, url, video_id, youtube_channel_title, youtube_channel_id,
            youtube_title, youtube_description, youtube_published_at
          )
          VALUES (
            'youtube', 
            ${'https://www.youtube.com/watch?v=' + ep.videoId},
            ${ep.videoId}, 
            ${ep.channel}, 
            ${ep.channelId},
            ${ep.title}, 
            'Demo episode for testing', 
            ${ep.date}
          )
          ON CONFLICT (video_id) DO UPDATE SET youtube_title = EXCLUDED.youtube_title
          RETURNING id
        `;
        episodeIds.push(episode.id);
      }
      console.log(`   ✓ Created ${episodes.length} episodes\n`);

      // 4. Create summaries with bullets
      console.log("4️⃣  Creating summaries and bullets...");
      let bulletCount = 0;
      
      for (let i = 0; i < episodeIds.length; i++) {
        const episodeId = episodeIds[i];
        const ep = episodes[i];
        
        // Check if summary already exists
        let summary = await tx`
          SELECT id FROM episode_summary WHERE episode_id = ${episodeId}
        `;
        
        if (summary.length === 0) {
          // Create summary
          summary = await tx`
            INSERT INTO episode_summary (
              episode_id, title, published_at, video_id, version,
              approval_status, approved_by, approved_at
            )
            VALUES (
              ${episodeId}, ${ep.title}, ${ep.date}, ${ep.videoId}, '1',
              ${i < 4 ? 'approved' : 'pending'}, 
              ${i < 4 ? '00000000-0000-0000-0000-000000000001' : null},
              ${i < 4 ? new Date().toISOString() : null}
            )
            RETURNING id
          `;
        }

        // Create bullets for this summary (only if not already created)
        const summaryId = summary[0].id;
        const existingBullets = await tx`
          SELECT COUNT(*) as count FROM summary_bullets WHERE summary_id = ${summaryId}
        `;
        
        if (existingBullets[0].count === 0) {
          const bullets = getBulletsForEpisode(i);
          for (const bullet of bullets) {
            await tx`
              INSERT INTO summary_bullets (
                summary_id, section_name, bullet_text, confidence, evidence_spans
              )
              VALUES (
                ${summaryId}, ${bullet.section}, ${bullet.text}, ${bullet.confidence},
                ${JSON.stringify(bullet.evidence)}
              )
            `;
            bulletCount++;
          }
        }

        // Create QC run (only if not already created)
        const existingQC = await tx`
          SELECT COUNT(*) as count FROM qc_runs WHERE summary_id = ${summaryId}
        `;
        
        if (existingQC[0].count === 0) {
          await tx`
            INSERT INTO qc_runs (
              summary_id, qc_status, qc_score, risk_flags
            )
            VALUES (
              ${summaryId}, 'passed', ${0.85 + Math.random() * 0.1},
              ${JSON.stringify([])}
            )
          `;
        }
      }
      console.log(`   ✓ Created ${episodeIds.length} summaries with ${bulletCount} bullets\n`);

      // 5. Create a demo report
      console.log("5️⃣  Creating demo report...");
      const [report] = await tx`
        INSERT INTO reports (
          title, report_type, period_start, period_end, summary,
          approval_status, approved_by, approved_at
        )
        VALUES (
          'Weekly Finance Highlights - Jan 15-21, 2024',
          'weekly',
          '2024-01-15',
          '2024-01-21',
          'Key insights from this week: Federal Reserve signals potential rate cuts in Q2 2024. Tech earnings season shows mixed results with AI companies outperforming. Bitcoin ETF approval drives crypto market rally.',
          'approved',
          '00000000-0000-0000-0000-000000000001',
          ${new Date().toISOString()}
        )
        ON CONFLICT DO NOTHING
        RETURNING id
      `;
      
      if (report) {
        console.log(`   ✓ Created 1 report\n`);
      } else {
        console.log(`   ✓ Report already exists\n`);
      }
    });

    console.log("✅ Demo data seeded successfully!\n");
    console.log("📊 Summary:");
    console.log("   • 1 demo user");
    console.log("   • 3 shows");
    console.log("   • 5 episodes (4 approved, 1 pending)");
    console.log("   • ~40 summary bullets");
    console.log("   • 1 weekly report");
    console.log("\n🎯 You can now test:");
    console.log("   • /dashboard - see 4 approved episodes");
    console.log("   • /search?q=rate - search for 'rate' keyword");
    console.log("   • /episode/<id> - view episode details");
    console.log("   • /reports - see weekly report");
    console.log("   • /admin/approvals - see 1 pending episode\n");

  } catch (error) {
    console.error("❌ Error seeding data:", error);
    throw error;
  } finally {
    await sql.end();
  }
}

function getBulletsForEpisode(index: number): Array<{
  section: string;
  text: string;
  confidence: number;
  evidence: Array<{ start_ms: number; end_ms: number }>;
}> {
  const bulletSets = [
    // Episode 0: Fed Rate Cuts
    [
      { section: "Monetary Policy", text: "Federal Reserve officials signal potential interest rate cuts beginning in Q2 2024, citing cooling inflation data.", confidence: 0.92, evidence: [{ start_ms: 120000, end_ms: 145000 }] },
      { section: "Monetary Policy", text: "Market pricing now reflects 75% probability of first rate cut by June 2024.", confidence: 0.88, evidence: [{ start_ms: 180000, end_ms: 210000 }] },
      { section: "Market Impact", text: "Treasury yields fell sharply following Fed commentary, with 10-year yield dropping 15 basis points.", confidence: 0.95, evidence: [{ start_ms: 300000, end_ms: 330000 }] },
      { section: "Market Impact", text: "Equity markets rallied on rate cut expectations, with S&P 500 gaining 2.3% for the week.", confidence: 0.90, evidence: [{ start_ms: 450000, end_ms: 480000 }] },
      { section: "Economic Outlook", text: "Inflation continues to moderate with CPI at 3.1%, approaching Fed's 2% target.", confidence: 0.87, evidence: [{ start_ms: 600000, end_ms: 630000 }] },
      { section: "Economic Outlook", text: "Labor market remains resilient despite cooling, with unemployment at 3.7%.", confidence: 0.85, evidence: [{ start_ms: 720000, end_ms: 750000 }] },
      { section: "Investment Strategy", text: "Duration exposure becoming more attractive as rate cut cycle approaches.", confidence: 0.83, evidence: [{ start_ms: 900000, end_ms: 930000 }] },
      { section: "Investment Strategy", text: "Growth stocks likely to outperform value in lower rate environment.", confidence: 0.80, evidence: [{ start_ms: 1080000, end_ms: 1110000 }] },
    ],
    // Episode 1: Tech Earnings
    [
      { section: "Earnings Overview", text: "Tech sector earnings show divergence: AI-focused companies beat estimates while legacy tech misses.", confidence: 0.91, evidence: [{ start_ms: 90000, end_ms: 120000 }] },
      { section: "Earnings Overview", text: "Aggregate tech sector revenue growth at 8% YoY, below historical 12% average.", confidence: 0.89, evidence: [{ start_ms: 180000, end_ms: 210000 }] },
      { section: "AI Investment", text: "Major tech companies increasing AI infrastructure spending by 40% in 2024.", confidence: 0.94, evidence: [{ start_ms: 300000, end_ms: 330000 }] },
      { section: "AI Investment", text: "Cloud providers reporting strong demand for AI compute resources.", confidence: 0.88, evidence: [{ start_ms: 420000, end_ms: 450000 }] },
      { section: "Valuation Concerns", text: "Tech sector trading at 28x forward earnings, above 10-year average of 22x.", confidence: 0.86, evidence: [{ start_ms: 600000, end_ms: 630000 }] },
      { section: "Valuation Concerns", text: "Analysts cautioning on stretched valuations in mega-cap tech names.", confidence: 0.82, evidence: [{ start_ms: 720000, end_ms: 750000 }] },
      { section: "Sector Rotation", text: "Investors rotating from software to semiconductor stocks on AI tailwinds.", confidence: 0.85, evidence: [{ start_ms: 900000, end_ms: 930000 }] },
      { section: "Sector Rotation", text: "Cybersecurity stocks underperforming due to enterprise budget constraints.", confidence: 0.79, evidence: [{ start_ms: 1020000, end_ms: 1050000 }] },
    ],
    // Episode 2: Bitcoin ETF
    [
      { section: "Regulatory Approval", text: "SEC approves spot Bitcoin ETFs from 11 issuers, marking historic shift in crypto regulation.", confidence: 0.96, evidence: [{ start_ms: 60000, end_ms: 90000 }] },
      { section: "Regulatory Approval", text: "Approval follows years of applications and regulatory scrutiny.", confidence: 0.93, evidence: [{ start_ms: 150000, end_ms: 180000 }] },
      { section: "Market Response", text: "Bitcoin price surged 12% on approval news, reaching $47,000.", confidence: 0.95, evidence: [{ start_ms: 240000, end_ms: 270000 }] },
      { section: "Market Response", text: "First-day ETF trading volume exceeded $4.5 billion across all products.", confidence: 0.91, evidence: [{ start_ms: 360000, end_ms: 390000 }] },
      { section: "Institutional Adoption", text: "Major asset managers now offering Bitcoin exposure to retail and institutional clients.", confidence: 0.88, evidence: [{ start_ms: 480000, end_ms: 510000 }] },
      { section: "Institutional Adoption", text: "Financial advisors report increased client inquiries about crypto allocation.", confidence: 0.84, evidence: [{ start_ms: 600000, end_ms: 630000 }] },
      { section: "Investment Implications", text: "ETF structure provides tax-efficient, regulated access to Bitcoin.", confidence: 0.90, evidence: [{ start_ms: 720000, end_ms: 750000 }] },
      { section: "Investment Implications", text: "Analysts project $10-15 billion in ETF inflows over first year.", confidence: 0.81, evidence: [{ start_ms: 840000, end_ms: 870000 }] },
    ],
    // Episode 3: Real Estate
    [
      { section: "Housing Market", text: "Existing home sales down 18% YoY as mortgage rates remain elevated above 7%.", confidence: 0.92, evidence: [{ start_ms: 120000, end_ms: 150000 }] },
      { section: "Housing Market", text: "Median home price up 4.2% despite lower transaction volume.", confidence: 0.89, evidence: [{ start_ms: 240000, end_ms: 270000 }] },
      { section: "Commercial Real Estate", text: "Office vacancy rates hit 20% in major metros as remote work persists.", confidence: 0.94, evidence: [{ start_ms: 360000, end_ms: 390000 }] },
      { section: "Commercial Real Estate", text: "Industrial and logistics properties continue to outperform with 95% occupancy.", confidence: 0.87, evidence: [{ start_ms: 480000, end_ms: 510000 }] },
      { section: "REIT Performance", text: "REIT sector down 8% YTD, underperforming broader equity markets.", confidence: 0.85, evidence: [{ start_ms: 600000, end_ms: 630000 }] },
      { section: "REIT Performance", text: "Data center REITs bucking trend with 15% gains on AI infrastructure demand.", confidence: 0.88, evidence: [{ start_ms: 720000, end_ms: 750000 }] },
      { section: "Outlook", text: "Rate cuts could provide tailwind for real estate sector in H2 2024.", confidence: 0.80, evidence: [{ start_ms: 840000, end_ms: 870000 }] },
      { section: "Outlook", text: "Housing affordability remains challenged with payment-to-income ratio at 35%.", confidence: 0.83, evidence: [{ start_ms: 960000, end_ms: 990000 }] },
    ],
    // Episode 4: NVIDIA (pending approval)
    [
      { section: "Market Position", text: "NVIDIA controls 80% of AI chip market with H100 and upcoming H200 GPUs.", confidence: 0.93, evidence: [{ start_ms: 90000, end_ms: 120000 }] },
      { section: "Market Position", text: "Competitors AMD and Intel lag 18-24 months behind in AI accelerator performance.", confidence: 0.87, evidence: [{ start_ms: 210000, end_ms: 240000 }] },
      { section: "Financial Performance", text: "Data center revenue up 279% YoY to $18.4 billion in latest quarter.", confidence: 0.95, evidence: [{ start_ms: 330000, end_ms: 360000 }] },
      { section: "Financial Performance", text: "Gross margins expanding to 75% on strong AI chip pricing power.", confidence: 0.91, evidence: [{ start_ms: 450000, end_ms: 480000 }] },
      { section: "Supply Constraints", text: "Lead times for H100 chips remain at 8-12 months despite production ramp.", confidence: 0.89, evidence: [{ start_ms: 570000, end_ms: 600000 }] },
      { section: "Supply Constraints", text: "TSMC allocating additional 5nm capacity to meet NVIDIA demand.", confidence: 0.84, evidence: [{ start_ms: 690000, end_ms: 720000 }] },
      { section: "Competitive Risks", text: "Hyperscalers developing custom AI chips to reduce NVIDIA dependence.", confidence: 0.82, evidence: [{ start_ms: 810000, end_ms: 840000 }] },
      { section: "Valuation", text: "Stock trading at 45x forward earnings, premium to semiconductor peers at 20x.", confidence: 0.86, evidence: [{ start_ms: 930000, end_ms: 960000 }] },
    ],
  ];

  return bulletSets[index] || bulletSets[0];
}

// Run the seeder
seedDemoData().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
