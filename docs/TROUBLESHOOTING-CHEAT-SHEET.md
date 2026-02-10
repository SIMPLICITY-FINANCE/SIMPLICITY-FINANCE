# SIMPLICITY FINANCE - QUICK TROUBLESHOOTING CHEAT SHEET

🚨 EMERGENCY FIXES - COPY & PASTE
----------------------------------

### Issue: Download Audio Fails
```bash
# Check Docker is running
docker ps

# Update yt-dlp
docker pull jauderho/yt-dlp:latest

# Force Docker in .env.local
echo "YT_DLP_USE_DOCKER=true" >> .env.local

# Restart
npx inngest-cli dev
npm run dev
```

### Issue: Database Write Blocked
```bash
# Add to .env.local
echo "ALLOW_PROD_DB_WRITE=1" >> .env.local

# Restart
npm run dev
```

### Issue: Lost Git Work
```bash
# Find lost commits
git reflog -30

# Recover from commit hash
git branch recovered-work <commit-hash>
git checkout recovered-work
```

### Issue: Notifications Not Showing
```sql
-- Run in Supabase SQL Editor
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL DEFAULT 'default',
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  link TEXT NOT NULL,
  icon_type TEXT NOT NULL,
  metadata JSONB,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  read_at TIMESTAMP
);
```

---

📋 QUICK DIAGNOSTIC COMMANDS
-----------------------------

```bash
# Health Check
docker ps                              # Docker running?
git status                             # Any uncommitted changes?
cat .env.local | grep DATABASE_URL     # DB configured?

# Check Services
npx drizzle-kit studio                 # Database accessible?
open http://localhost:8288             # Inngest dashboard
curl https://api.deepgram.com/v1/      # Deepgram up?

# Debug Episode
ls -la output/VIDEO_ID/                # Files created?
cat output/VIDEO_ID/download.log       # Download logs
cat output/VIDEO_ID/error.json         # Error details

# Test Components
docker run --rm jauderho/yt-dlp:latest --version  # yt-dlp version
yt-dlp --version                                   # System yt-dlp
ffprobe output/VIDEO_ID/audio.mp3                  # Audio valid?
```

---

🎯 COMMON ERROR PATTERNS
-------------------------

| Error | Cause | Fix |
|-------|-------|-----|
| "All strategies failed" | yt-dlp outdated | Update Docker image |
| "Safety check failed" | DB write blocked | Add ALLOW_PROD_DB_WRITE=1 |
| "Quota exceeded" | API limit hit | Wait or upgrade plan |
| "Table not found" | Missing migration | Run drizzle-kit push |
| "Connection refused" | DB down | Check Supabase status |
| "Invalid API key" | Wrong/missing key | Check .env.local |

---

📞 TELL AI TO:
--------------

"Read /mnt/user-data/outputs/MASTER-TROUBLESHOOTING-GUIDE.txt and help me fix [describe issue]"

---

✅ SYSTEM HEALTH CHECK
----------------------

Run these to verify system is healthy:

```bash
# 1. Services Running
docker ps                    # Should list containers
ps aux | grep node          # Next.js and Inngest running

# 2. Database Connected
npx drizzle-kit studio      # Should open without error

# 3. APIs Working
curl "https://www.googleapis.com/youtube/v3/videos?part=snippet&id=dQw4w9WgXcQ&key=$YOUTUBE_API_KEY"

# 4. Test Episode
# Submit a known working URL and watch Inngest dashboard

# 5. Check Quotas
# - YouTube: https://console.cloud.google.com/apis/dashboard
# - Deepgram: https://console.deepgram.com/
# - OpenAI: https://platform.openai.com/usage
```

---

🔧 MAINTENANCE SCHEDULE
-----------------------

**Daily:**
- Monitor failed ingestions (Inngest dashboard)
- Check API quota usage

**Weekly:**
- Update Docker images: `docker pull jauderho/yt-dlp:latest` 
- Review error logs
- Test sample episode end-to-end

**Monthly:**
- Database backup (Supabase auto-backups, verify they work)
- Review API costs
- Update dependencies: `npm update` 

---

🚀 DEPLOYMENT CHECKLIST
------------------------

Before deploying to Vercel:

```bash
# 1. Test Locally
□ All episodes process successfully
□ Reports generate correctly
□ Notifications work
□ No errors in console

# 2. Environment Variables
□ All keys added to Vercel dashboard
□ ALLOW_PROD_DB_WRITE=1 set
□ DATABASE_URL points to Supabase

# 3. Integrations
□ Inngest connected to Vercel app
□ Supabase accessible from Vercel IPs

# 4. Verify
□ Test episode ingestion on Vercel preview
□ Check Inngest cloud dashboard
□ Verify database writes
```

---

💾 BACKUP IMPORTANT FILES
--------------------------

**Before making changes, backup:**
```bash
cp .env.local .env.local.backup
cp inngest/lib/ytdlp.ts inngest/lib/ytdlp.ts.backup
git commit -am "WIP: before changes"
```

---

📚 DOCUMENTATION LOCATIONS
--------------------------

**Master Reference:**
`/mnt/user-data/outputs/MASTER-TROUBLESHOOTING-GUIDE.txt` 

**Specific Fixes:**
- Force Docker yt-dlp: `/mnt/user-data/outputs/force-docker-ytdlp.txt` 
- Database write fix: `/mnt/user-data/outputs/fix-persist-db-safety-check.txt` 
- Git recovery: `/mnt/user-data/outputs/git-work-recovery.txt` 
- Notifications: `/mnt/user-data/outputs/notification-system.txt` 
- Reports system: `/mnt/user-data/outputs/reports-weekly-monthly-quarterly.txt` 

**System Understanding:**
- Complete explanation: `/mnt/user-data/outputs/system-complete-explanation.txt` 

---

🎓 KEY LEARNINGS
-----------------

**1. yt-dlp Changes Often**
- YouTube updates break downloaders frequently
- Always use Docker for latest version
- Check version if downloads fail

**2. Database Safety Is Important**
- ALLOW_PROD_DB_WRITE flag prevents accidents
- Necessary when Supabase is dev DB
- Remove for production (or keep if using Supabase prod)

**3. Background Jobs Are Separate**
- Inngest runs independently of Next.js
- Not affected by Vercel 60s timeout
- Check Inngest dashboard for job status

**4. Environment Variables Matter**
- Missing keys cause silent failures
- Always verify after server restart
- Document all required variables

**5. Git Saves Everything**
- `git reflog` is your friend
- Commits are never truly lost
- Stash frequently, commit often

---

END OF CHEAT SHEET

Print this out or keep it handy!
