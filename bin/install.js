#!/usr/bin/env node

/**
 * LLasM Skill Installer
 * Copies the LLasM skill to ~/.cursor/skills/llasm/
 */

import { existsSync, mkdirSync, cpSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { homedir } from 'os';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = join(__dirname, '..');
const destDir = join(homedir(), '.cursor', 'skills', 'llasm');

// Files and directories to copy
const items = [
  'SKILL.md',
  'llasm.js',
  'reference',
  'examples'
];

console.log('Installing LLasM skill...\n');

// Create destination directory
if (!existsSync(destDir)) {
  mkdirSync(destDir, { recursive: true });
  console.log(`Created: ${destDir}`);
}

// Copy files
for (const item of items) {
  const src = join(srcDir, item);
  const dest = join(destDir, item);
  
  if (!existsSync(src)) {
    console.log(`Skipping: ${item} (not found)`);
    continue;
  }
  
  cpSync(src, dest, { recursive: true });
  console.log(`Copied: ${item}`);
}

console.log(`
LLasM skill installed to: ${destDir}

Usage:
1. Open Cursor
2. Ask: "Build me a todo app" (or any web page)
3. The agent will use the LLasM skill to generate a complete HTML file
4. Save the output and open in browser

The generated HTML references ./llasm.js - the agent will copy it alongside your page.
`);
