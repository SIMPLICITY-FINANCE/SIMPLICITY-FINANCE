# CHANGELOG
# Most recent entries at the top.

## [2026-02-12]

### Added
- AI rules system (.windsurf/rules.md)
- Documentation structure (docs/PRD.md, docs/CHANGELOG.md)
- Folder-specific rules (inngest/RULES.md, app/api/RULES.md, db/RULES.md)

---

## [2026-02-10]

### Added
- Weekly, monthly, quarterly report generation
- Admin manual report generation interface
- Real-time notification system (bell icon + dropdown)
- NotificationDropdown component with portal rendering

### Fixed
- Episode download now uses Docker yt-dlp (version 2026.02.04)
- Database write safety check (added ALLOW_PROD_DB_WRITE=1)
- Notification dropdown cutoff (added DropdownMenuPortal)

### Changed
- Discover page redesigned: tabs → single page with carousels
- Report page redesigned: added weekly/monthly/quarterly tabs

---

## TEMPLATE FOR NEW ENTRIES:

## [YYYY-MM-DD]

### Added
- [Feature name] - [one line description]

### Fixed
- [Bug] - [what was wrong and how fixed]

### Changed
- [Component] - [what changed and why]

### Removed
- [Feature] - [why removed]
