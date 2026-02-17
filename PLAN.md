# LLasM Roadmap

## Philosophy Check

### HTML/Markdown Minification?
**Decision: No.** 
- LLMs handle whitespace fine; token cost is minimal
- Humans need to verify LLM output occasionally
- Browsers ignore whitespace anyway
- Minified HTML would hurt debugging
- Keep JS terse (LLM-only), keep HTML readable (LLM+human verification)

### PWA Support?
**Decision: Yes, as optional enhancement (future).**
- Aligns with offline-first, static HTML philosophy
- Service worker is pure JS, no build step
- Add `data-m-enhance="pwa"` to auto-register SW
- Manifest JSON can be embedded like state manifest

---

## Feature Roadmap (Prioritized)

### Tier 1: Critical (Every App Needs) ✅ COMPLETE
| # | Feature | Status | Notes |
|---|---------|--------|-------|
| 1 | `!` negation in `data-m-if` | ✅ | `data-m-if="!loading"` |
| 2 | `data-m-on` event binding | ✅ | Replace `onclick="window._fn()"` |
| 3 | Toast notifications | ✅ | `l.t(msg, type, duration)` |
| 4 | LocalStorage persistence | ✅ | `"persist":["key1","key2"]` in manifest |
| 5 | Loading spinner class | ✅ | `.spin` animation |

### Tier 2: High Value ✅ COMPLETE
| # | Feature | Status | Notes |
|---|---------|--------|-------|
| 6 | Dark mode toggle | ✅ | `data-m-enhance="darkmode"` |
| 7 | Grid utility classes | ✅ | `g`, `gc2`, `gc3`, `gc4`, `gc5`, `gc6` |
| 8 | Transitions class | ✅ | `.tr`, `.tr3`, `.tr5` |
| 9 | Truncation classes | ✅ | `.ell`, `.ln2`, `.ln3` |
| 10 | Empty state expressions | ✅ | `data-m-if="items.length==0"` |

### Tier 3: PWA & Offline
| # | Feature | Status | Notes |
|---|---------|--------|-------|
| 11 | Offline detection | ✅ | `data-m-if="_offline"` auto-bound |
| 12 | PWA manifest embedding | ⬜ | `<script type="application/manifest+json">` |
| 13 | Service worker auto-register | ⬜ | `data-m-enhance="pwa"` |

### Tier 4: Nice to Have
| # | Feature | Status | Notes |
|---|---------|--------|-------|
| 14 | Debounced inputs | ⬜ | `data-m-debounce="300"` |
| 15 | Computed state | ⬜ | Derived values auto-update |
| 16 | Image lazy loading | ⬜ | `data-m-enhance="lazy"` |
| 17 | Pagination pattern | ⬜ | `data-m-enhance="paginate"` |
| 18 | Infinite scroll | ⬜ | `data-m-enhance="infinite"` |
| 19 | Multi-step forms | ⬜ | `data-m-enhance="wizard"` |
| 20 | Date formatting pipe | ⬜ | `data-m-bind="date|date:short"` |

### Tier 5: Future Consideration
| # | Feature | Status | Notes |
|---|---------|--------|-------|
| 21 | SSR support | ⬜ | Node-based pre-rendering |
| 22 | Hydration markers | ⬜ | Partial hydration optimization |
| 23 | Web components bridge | ⬜ | Use existing WC libraries |
| 24 | Analytics hook | ⬜ | `l.track(event, data)` |

---

## Implementation Log

### Session: 2026-02-17

**v1.2.0 Released**

Features implemented:
- ✅ `data-m-on` event binding (replaces window._ pattern)
- ✅ Toast notifications (`l.t(msg, type, duration)`)
- ✅ LocalStorage persistence (`persist` array in manifest)
- ✅ Dark mode toggle (`data-m-enhance="darkmode"`)
- ✅ Conditional expressions (`data-m-if="items.length==0"`, `!loading`)
- ✅ Grid utility classes (`g gc2 gc3 gc4 gc5 gc6 gr2 gr3`)
- ✅ Animation classes (`spin pulse fade`)
- ✅ Transition classes (`tr tr3 tr5`)
- ✅ Truncation classes (`ell ln2 ln3`)
- ✅ Offline detection (`_offline` built-in state)
- ✅ Nested state access (`data-m-bind="user.name"`)

Documentation updated:
- ✅ README.md
- ✅ SKILL.md
- ✅ reference/runtime-api.md
- ✅ reference/utility-classes.md
- ✅ reference/enhancement-rules.md
- ✅ reference/manifest-schema.md

Examples updated:
- ✅ features-demo.html (new - showcases all v1.2 features)
- ✅ tour-of-heroes.html (uses data-m-on, toast, persistence)
- ✅ todo-app.html (uses data-m-on, persistence, dark mode)

**Final size:** ~7.5KB gzipped (within 9KB budget)

---

## Size Budget

| Component | Est. Size |
|-----------|-----------|
| Core runtime | ~4KB |
| Utility CSS | ~2.8KB |
| Enhancements | ~0.7KB |
| **Total** | ~7.5KB |
| **Budget** | 9KB |
| **Remaining** | ~1.5KB |

Each new feature must justify its bytes.
