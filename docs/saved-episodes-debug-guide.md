# Saved Episodes Debug & Testing Guide

## 🔍 Diagnostic Infrastructure Added

### New API Endpoints
1. **`/api/saved/ids`** - Returns array of saved episode IDs
   - Logs: user ID, count, first 10 IDs
   
2. **`/api/saved`** - Returns full saved episode data (already existed, enhanced with logs)
   - Logs: user ID, count, first 3 episode IDs

3. **`/api/save-episode`** - Enhanced with detailed logging
   - Logs: episode ID, user ID, insert success, total count after save
   
4. **`/api/unsave-episode`** - Enhanced with detailed logging
   - Logs: episode ID, user ID, deletion success, remaining count

### Debug Panel (Dev Only)
- **Location**: Bottom-right corner of `/saved` page
- **Shows**:
  - Saved IDs count from context
  - First 10 saved IDs
  - Warning if no IDs in context

### Console Logging
All components now log extensively in development:
- `[SavedContext]` - Context initialization, add/remove operations, refetch
- `[SaveButton]` - Toggle actions, API calls, state sync
- `[SavedList]` - Render counts, refetch operations, visible episodes
- `[SavedPage]` - Server-side query results
- `[SAVE]` - API save operations
- `[UNSAVE]` - API unsave operations
- `[SAVED/IDS]` - ID fetch operations
- `[SAVED API]` - Full episode fetch operations

---

## 🧪 Testing Instructions

### Test 1: Check Initial State (Fresh DB)
**Expected**: No bookmarks selected, no saved episodes

1. Open browser console (F12)
2. Navigate to http://localhost:3000/dashboard
3. **Look for**:
   ```
   [SavedContext] Initialized with 0 IDs: []
   ```
4. Check bookmark icons - should all be **outline** (not filled)
5. Navigate to http://localhost:3000/saved
6. **Look for**:
   ```
   [SavedPage] Server: Found 0 saved episodes
   [SavedList] Render with 0 episodes, 0 IDs in context
   ```
7. Check debug panel - should show "Saved IDs Count: 0"

### Test 2: Save an Episode
**Expected**: Icon fills instantly, episode appears in saved tab

1. On dashboard, click a bookmark icon
2. **Look for in console**:
   ```
   [SaveButton] <episodeId> toggling from false to true
   [SaveButton] Calling /api/save-episode for <episodeId>
   [SavedContext] Adding episode: <episodeId>
   [SavedContext] New set size: 1 Contains: true
   ```
3. **Look for in terminal**:
   ```
   [SAVE] Request received for episode: <episodeId>
   [SAVE] User ID: 00000000-0000-0000-0000-000000000001
   [SAVE] ✅ Successfully saved episode
   [SAVE] Total saved episodes for user: 1
   ```
4. Icon should be **filled blue** immediately
5. Navigate to `/saved`
6. **Look for**:
   ```
   [SavedList] Context size changed to: 1
   [SAVED API] ✅ Found 1 saved episodes
   [SAVED API] First 3 episode IDs: [<episodeId>]
   [SavedList] ✅ Refetched 1 episodes from API
   [SavedList] Visible episodes: 1 / 1
   ```
7. Episode should appear in the list
8. Debug panel should show "Saved IDs Count: 1"

### Test 3: Unsave an Episode
**Expected**: Icon empties instantly, episode disappears from saved tab

1. On saved page, click "Remove" button
2. **Look for in console**:
   ```
   [SavedContext] Removing episode: <episodeId>
   [SavedContext] New set size: 0 Contains: false
   ```
3. **Look for in terminal**:
   ```
   [UNSAVE] Request received for episode: <episodeId>
   [UNSAVE] ✅ Successfully unsaved episode
   [UNSAVE] Total saved episodes remaining: 0
   ```
4. Episode should disappear from list immediately
5. Debug panel should show "Saved IDs Count: 0"

### Test 4: Hard Refresh Persistence
**Expected**: Saved state persists after refresh

1. Save an episode (Test 2)
2. Hard refresh browser (Cmd+Shift+R or Ctrl+F5)
3. **Look for**:
   ```
   [SavedContext] Initialized with 1 IDs: [<episodeId>]
   ```
4. Bookmark icon should still be filled
5. Episode should still appear in `/saved`

---

## 🐛 Common Issues to Diagnose

### Issue: Bookmark icon changes but episode doesn't appear in /saved

**Check**:
1. Does `[SAVE]` log show success in terminal?
2. Does `[SavedContext] New set size` increase?
3. Does `/api/saved` return the episode?
4. Does `[SavedList] Visible episodes` match `episodes` count?

**Likely causes**:
- **ID mismatch**: Feed uses different ID than save API
  - Check: Compare episode ID in `[SaveButton]` vs `[SAVE]` logs
- **User mismatch**: Context initialized with wrong user's IDs
  - Check: `[SavedContext] Initialized` vs `[SAVE] User ID`
- **Refetch not triggering**: Context size not changing
  - Check: `[SavedContext] New set size` logs

### Issue: Episode appears in /saved but bookmark icon not filled

**Check**:
1. Does `[SavedContext] Initialized` include the episode ID?
2. Does `SaveButton` receive correct `initialSaved` prop?
3. Does `isSaved(episodeId)` return true?

**Likely causes**:
- **Context not initialized**: Layout not fetching saved IDs
  - Check: `[SavedContext] Initialized with X IDs`
- **ID format mismatch**: String vs UUID format
  - Check: Compare IDs in debug panel vs episode cards

### Issue: Nothing works at all

**Check**:
1. Is context provider wrapping the app?
2. Are API routes returning 200?
3. Is database connection working?

**Likely causes**:
- **Provider missing**: Check `app/(app)/layout.tsx`
- **Database error**: Check terminal for Postgres errors
- **API errors**: Check Network tab in browser DevTools

---

## 📊 Expected Log Flow (Happy Path)

### On Page Load
```
[SavedContext] Initialized with 0 IDs: []
[SavedPage] Server: Found 0 saved episodes
[SavedList] Render with 0 episodes, 0 IDs in context
```

### On Save Click
```
[SaveButton] <id> toggling from false to true
[SaveButton] Calling /api/save-episode for <id>
[SavedContext] Adding episode: <id>
[SavedContext] New set size: 1 Contains: true
[SAVE] Request received for episode: <id>
[SAVE] ✅ Successfully saved episode
[SAVE] Total saved episodes for user: 1
[SaveButton] <id> API success: {...}
```

### On Navigate to /saved
```
[SavedPage] Server: Found 1 saved episodes
[SavedPage] Server: First 3 IDs: [<id>]
[SavedList] Render with 1 episodes, 1 IDs in context
[SavedList] Context size changed to: 1
[SAVED API] Fetching saved episodes for user: ...
[SAVED API] ✅ Found 1 saved episodes
[SavedList] ✅ Refetched 1 episodes from API
[SavedList] Visible episodes: 1 / 1
```

---

## 📝 Files Changed

### Created
- `app/api/saved/ids/route.ts` - Lightweight ID endpoint
- `app/(app)/saved/DebugPanel.tsx` - Dev-only debug UI
- `docs/saved-episodes-debug-guide.md` - This file

### Modified
- `app/contexts/SavedEpisodesContext.tsx` - Added refetch, logging, immutable updates
- `app/components/ui/SaveButton.tsx` - Added logging, state sync
- `app/(app)/saved/SavedEpisodesList.tsx` - Added refetch logic, logging
- `app/(app)/saved/page.tsx` - Added debug panel, server logging
- `app/api/save-episode/route.ts` - Enhanced logging
- `app/api/unsave-episode/route.ts` - Enhanced logging
- `app/api/saved/route.ts` - Enhanced logging

---

## ✅ Next Steps

1. **Test in browser** - Follow Test 1-4 above
2. **Check all logs** - Compare actual vs expected
3. **Identify root cause** - Use debug panel + logs
4. **Report findings** - Share which test failed and what logs showed

The diagnostic infrastructure is complete. All logging is in place to identify exactly where the data flow breaks.
