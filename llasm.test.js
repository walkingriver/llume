/**
 * LLasM Runtime Unit Tests
 * Tests core functionality of the llasm.js runtime
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Helper to set up a fresh DOM with llasm structure
function setupDOM(html = '', manifest = { v: 1, r: { s: {} }, l: { en: {} } }) {
  document.body.innerHTML = `
    ${html}
    <script type="application/llasm+json" id="manifest">${JSON.stringify(manifest)}</script>
  `;
}

// Import llasm - it auto-inits on DOMContentLoaded
let l;
beforeEach(async () => {
  // Reset DOM
  document.body.innerHTML = '';
  document.documentElement.className = '';
  localStorage.clear();
  
  // Re-import to get fresh instance
  vi.resetModules();
  const module = await import('./llasm.js');
  l = module.l;
});

describe('Manifest Parsing', () => {
  it('parses manifest from DOM', () => {
    setupDOM('', { v: 1, r: { s: { count: 42 } }, l: { en: {} } });
    l.m();
    expect(l.s().count).toBe(42);
  });

  it('accepts manifest object directly', () => {
    setupDOM();
    l.m({ v: 1, r: { s: { name: 'test' } }, l: { en: {} } });
    expect(l.s().name).toBe('test');
  });
});

describe('State Management', () => {
  it('updates state with L.u()', () => {
    setupDOM();
    l.m({ v: 1, r: { s: { count: 0 } }, l: { en: {} } });
    l.u({ count: 5 });
    expect(l.s().count).toBe(5);
  });

  it('returns state snapshot with L.s()', () => {
    setupDOM();
    l.m({ v: 1, r: { s: { a: 1, b: 2 } }, l: { en: {} } });
    const state = l.s();
    expect(state.a).toBe(1);
    expect(state.b).toBe(2);
  });
});

describe('DOM Binding (data-m-bind)', () => {
  it('binds state to text content', () => {
    setupDOM('<span data-m-bind="count">0</span>');
    l.m({ v: 1, r: { s: { count: 10 } }, l: { en: {} } });
    expect(document.querySelector('[data-m-bind="count"]').textContent).toBe('10');
  });

  it('updates DOM when state changes', () => {
    setupDOM('<span data-m-bind="count">0</span>');
    l.m({ v: 1, r: { s: { count: 0 } }, l: { en: {} } });
    l.u({ count: 99 });
    expect(document.querySelector('[data-m-bind="count"]').textContent).toBe('99');
  });

  it('binds to input value', () => {
    setupDOM('<input data-m-bind="name" />');
    l.m({ v: 1, r: { s: { name: 'Alice' } }, l: { en: {} } });
    expect(document.querySelector('input').value).toBe('Alice');
  });

  it('applies pipe transforms', () => {
    setupDOM('<span data-m-bind="name|upper"></span>');
    l.m({ v: 1, r: { s: { name: 'hello' } }, l: { en: {} } });
    expect(document.querySelector('span').textContent).toBe('HELLO');
  });
});

describe('Conditional Rendering (data-m-if)', () => {
  it('shows element when condition is truthy', () => {
    setupDOM('<div data-m-if="show">Visible</div>');
    l.m({ v: 1, r: { s: { show: true } }, l: { en: {} } });
    expect(document.querySelector('[data-m-if]').hidden).toBe(false);
  });

  it('hides element when condition is falsy', () => {
    setupDOM('<div data-m-if="show">Hidden</div>');
    l.m({ v: 1, r: { s: { show: false } }, l: { en: {} } });
    expect(document.querySelector('[data-m-if]').hidden).toBe(true);
  });

  it('handles negated conditions', () => {
    setupDOM('<div data-m-if="!loading">Ready</div>');
    l.m({ v: 1, r: { s: { loading: false } }, l: { en: {} } });
    expect(document.querySelector('[data-m-if]').hidden).toBe(false);
  });

  it('handles array length conditions', () => {
    setupDOM('<div data-m-if="items.length==0">Empty</div>');
    l.m({ v: 1, r: { s: { items: [] } }, l: { en: {} } });
    expect(document.querySelector('[data-m-if]').hidden).toBe(false);
  });
});

describe('Event Binding (data-m-on)', () => {
  it('calls handler on click', () => {
    setupDOM('<button data-m-on="click:increment">+</button>');
    l.m({ v: 1, r: { s: { count: 0 } }, l: { en: {} } });
    l.h({ increment: (e, s, L) => L.u({ count: s.count + 1 }) });
    
    document.querySelector('button').click();
    expect(l.s().count).toBe(1);
  });

  it('prevents default on form submit', () => {
    setupDOM('<form data-m-on="submit:save"><button type="submit">Save</button></form>');
    l.m({ v: 1, r: { s: {} }, l: { en: {} } });
    
    let saved = false;
    l.h({ save: () => { saved = true; } });
    
    const form = document.querySelector('form');
    const event = new Event('submit', { cancelable: true });
    form.dispatchEvent(event);
    
    expect(saved).toBe(true);
    expect(event.defaultPrevented).toBe(true);
  });
});

describe('i18n (data-m-tx)', () => {
  it('translates text content', () => {
    setupDOM('<h1 data-m-tx="title"></h1>');
    l.m({ v: 1, r: { s: {} }, l: { en: { title: 'Hello World' } } });
    expect(document.querySelector('h1').textContent).toBe('Hello World');
  });

  it('switches locale with L.r()', () => {
    setupDOM('<h1 data-m-tx="greeting"></h1>');
    l.m({ v: 1, r: { s: {} }, l: { en: { greeting: 'Hello' }, es: { greeting: 'Hola' } } });
    expect(document.querySelector('h1').textContent).toBe('Hello');
    
    l.r('es');
    expect(document.querySelector('h1').textContent).toBe('Hola');
  });
});

describe('Dark Mode', () => {
  it('applies dark class based on localStorage', () => {
    localStorage.setItem('llasm-dark', 'true');
    setupDOM('<button data-m-enhance="darkmode">Toggle</button>');
    l.m({ v: 1, r: { s: {} }, l: { en: {} } });
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('toggles dark mode on click', () => {
    setupDOM('<button data-m-enhance="darkmode">Toggle</button>');
    l.m({ v: 1, r: { s: {} }, l: { en: {} } });
    
    const btn = document.querySelector('button');
    btn.click();
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    
    btn.click();
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});

describe('Toast Notifications', () => {
  it('creates toast element', () => {
    setupDOM();
    l.m({ v: 1, r: { s: {} }, l: { en: {} } });
    l.t('Test message', 'ok');
    
    const toast = document.querySelector('[data-m-toast]');
    expect(toast).not.toBeNull();
    expect(toast.textContent).toBe('Test message');
    expect(toast.classList.contains('ok')).toBe(true);
  });
});

describe('Query Helpers', () => {
  it('L.q() queries single element', () => {
    setupDOM('<div id="test">Test</div>');
    l.m({ v: 1, r: { s: {} }, l: { en: {} } });
    expect(l.q('#test').textContent).toBe('Test');
  });

  it('L.qa() queries multiple elements', () => {
    setupDOM('<span class="item">A</span><span class="item">B</span>');
    l.m({ v: 1, r: { s: {} }, l: { en: {} } });
    expect(l.qa('.item').length).toBe(2);
  });
});

describe('Validation', () => {
  it('validates schema with L.v()', () => {
    setupDOM();
    l.m({ v: 1, r: { s: {} }, l: { en: {} } });
    
    const schema = { name: { req: true }, age: { min: 0, max: 150 } };
    
    // Valid data
    const valid = l.v(schema, { name: 'Alice', age: 30 });
    expect(valid.v).toBe(true);
    expect(valid.e.length).toBe(0);
    
    // Invalid data
    const invalid = l.v(schema, { name: '', age: 200 });
    expect(invalid.v).toBe(false);
    expect(invalid.e.length).toBeGreaterThan(0);
  });
});
