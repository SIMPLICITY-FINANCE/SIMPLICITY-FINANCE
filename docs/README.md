# Documentation Structure

This directory contains all project documentation organized by category.

## Directory Structure

```
docs/
├── README.md                    # This file
├── planning/                    # Project planning and execution documents
│   ├── EXECUTE_V2.md           # Main execution roadmap (Milestones 1-6)
│   ├── FIGMA_STYLE_SPEC.md     # Design system specification
│   ├── VISUAL_PARITY_SUMMARY.md # UI implementation status
│   ├── MILESTONE_4_TESTING.md   # Testing milestone documentation
│   ├── SIMPLICITY_FINANCE_BLUEPRINT.txt
│   └── SIMPLICITY_FINANCE_EXECUTION_CHECKLIST.txt
├── deployment/                  # Deployment and infrastructure docs
│   └── DEPLOYMENT.md           # Production deployment guide
└── screenshots/                 # Figma screenshots and UI references
    ├── (1)-MAIN-VIEW.png
    ├── (2)-LEFT-BAR.png
    ├── (3)-HOME.png
    └── ... (all Figma screenshots)
```

## Key Documents

### Planning
- **EXECUTE_V2.md** - Primary execution roadmap with 6 milestones for production readiness
- **FIGMA_STYLE_SPEC.md** - Design tokens and UI primitive specifications
- **VISUAL_PARITY_SUMMARY.md** - Status of Figma → Code implementation

### Deployment
- **DEPLOYMENT.md** - Production deployment checklist and environment setup

### Screenshots
- Figma design references numbered (1) through (30)
- Used for visual parity verification during UI development

## Next Steps

See `planning/EXECUTE_V2.md` for the complete roadmap. Current priority:
- **Milestone 1:** Regression Prevention (Smoke Tests + CI)
