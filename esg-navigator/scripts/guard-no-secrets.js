#!/usr/bin/env node
const { execSync } = require("node:child_process");
const { readFileSync, existsSync } = require("node:fs");
const path = require("node:path");
function staged(){ return execSync("git diff --cached --name-only --diff-filter=ACM",{encoding:"utf8"}).split("\n").map(s=>s.trim()).filter(Boolean); }
const bannedNames=[/^\.(env|env\..*)$/i,/\.pem$/i,/\.pfx$/i,/\.p12$/i,/id_.*/i];
const bannedContent=[/ANTHROPIC_API_KEY\s*=\s*sk-/i,/JWT_SECRET\s*=\s*\S+/i,/-----BEGIN [A-Z ]*PRIVATE KEY-----/,/\bapi[-_]?key\b\s*[:=]\s*['"][A-Za-z0-9_\-]{16,}['"]/i];
let fail=false;
for(const f of staged()){
  const base = path.basename(f);
  if (bannedNames.some(rx=>rx.test(base))) { console.error(`❌ Secret-like file: ${f}`); fail=true; continue; }
  if (!existsSync(f)) continue;
  const txt = readFileSync(f,"utf8");
  for(const rx of bannedContent){ if(rx.test(txt)){ console.error(`❌ Secret-like content in ${f}\n   Pattern: ${rx}`); fail=true; break; } }
}
if (fail){ console.error("\n🚫 Commit blocked: remove secrets."); process.exit(1); }
process.exit(0);
