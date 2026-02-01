# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e5]:
        - generic [ref=e6]:
          - heading "Simplicity Finance" [level=1] [ref=e7]
          - paragraph [ref=e8]: Finance podcast intelligence from long-form audio
        - navigation [ref=e9]:
          - link "Feed" [ref=e10] [cursor=pointer]:
            - /url: /dashboard
          - link "Saved" [ref=e11] [cursor=pointer]:
            - /url: /saved
          - link "Notebook" [ref=e12] [cursor=pointer]:
            - /url: /notebook
          - link "Reports" [ref=e13] [cursor=pointer]:
            - /url: /reports
    - main [ref=e14]:
      - generic [ref=e15]:
        - heading "My Notebook" [level=2] [ref=e16]
        - paragraph [ref=e17]: Individual key points you've saved from episodes
      - paragraph [ref=e19]:
        - strong [ref=e20]: "Saved vs Notebook:"
        - text: Your notebook contains individual key points (bullets). Full episodes go in Saved.
      - generic [ref=e21]:
        - img [ref=e22]
        - paragraph [ref=e24]: Your notebook is empty
        - paragraph [ref=e25]: Check the box next to any key point to save it here
    - contentinfo [ref=e26]:
      - paragraph [ref=e28]: Simplicity Finance - Evidence-grounded finance podcast intelligence
  - button "Open Next.js Dev Tools" [ref=e34] [cursor=pointer]:
    - img [ref=e35]
  - alert [ref=e38]
```