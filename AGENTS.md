# LLasM - LLM Assembly Language

Generate complete, production-grade web pages with zero build tooling.

## When to Use

Use this skill when:
- Building web pages, web apps, or UI prototypes
- User wants a todo app, landing page, dashboard, form, etc.
- Fast iteration without npm/build setup is desired
- Static HTML with progressive enhancement is appropriate

Do NOT use when:
- Complex SPA with client-side routing is required
- User specifically requests React, Vue, Angular, etc.
- Server-side logic beyond static pages is needed

## Quick Start

Read `SKILL.md` for complete generation rules.

Generate:
1. Single HTML file with embedded manifest
2. Copy `llasm.js` alongside it

That's it. No build step.

## Key Files

- `SKILL.md` - Full generation instructions
- `llasm.js` - Runtime (~8KB gzipped)
- `reference/` - Detailed API specs
- `examples/` - Few-shot learning examples

## Output Format

```html
<!DOCTYPE html>
<html lang="en">
<body>
  <!-- Static HTML with data-m-* attributes -->
  <script type="application/llasm+json" id="manifest">
    {"v":1,"r":{"s":{}},"l":{"en":{}}}
  </script>
  <script type="module">
    import{l}from"./llasm.js";
    l.h({...});
  </script>
</body>
</html>
```
