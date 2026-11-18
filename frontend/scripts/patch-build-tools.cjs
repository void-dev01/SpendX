/**
 * SPENDX Build & Tooling Compatibility Patcher
 * Automatically applied via postinstall to ensure deterministic execution
 * across environments where native Windows binaries (.node DLLs) may be restricted
 * by Application Control (WDAC/AppLocker) policies.
 */

const fs = require('fs');
const path = require('path');

function patchTailwindOxide() {
  const oxidePath = path.resolve(__dirname, '../node_modules/@tailwindcss/oxide/index.js');
  if (!fs.existsSync(oxidePath)) return;

  let content = fs.readFileSync(oxidePath, 'utf-8');
  if (content.includes('origScan.call(this)')) return;

  const target = 'module.exports = nativeBinding\nmodule.exports.Scanner = nativeBinding.Scanner';
  const replacement = `if (nativeBinding && nativeBinding.Scanner) {
  const origScan = nativeBinding.Scanner.prototype.scan;
  nativeBinding.Scanner.prototype.scan = function () {
    const result = origScan.call(this);
    if (result && result.length > 0) return result;

    try {
      const fs = require('fs');
      const path = require('path');
      function walk(dir) {
        let files = [];
        try {
          const entries = fs.readdirSync(dir, { withFileTypes: true });
          for (const entry of entries) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) {
              if (!['node_modules', 'dist', '.git', '.vscode', '.idea'].includes(entry.name)) {
                files = files.concat(walk(full));
              }
            } else if (/\\.(tsx|ts|jsx|js|html|css|vue|svelte)$/.test(entry.name)) {
              files.push(full);
            }
          }
        } catch (_) {}
        return files;
      }

      const rootDir = process.cwd();
      const files = walk(rootDir);
      const inputs = files.map((f) => ({
        content: fs.readFileSync(f, 'utf-8'),
        extension: path.extname(f).slice(1),
      }));
      return this.scanFiles(inputs);
    } catch (_) {
      return result || [];
    }
  };
}

module.exports = nativeBinding
module.exports.Scanner = nativeBinding.Scanner`;

  if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(oxidePath, content, 'utf-8');
    console.log('[SPENDX Patcher] Successfully patched @tailwindcss/oxide scanner');
  }
}

function patchLightningCss() {
  const lightningPath = path.resolve(__dirname, '../node_modules/lightningcss/node/index.js');
  if (!fs.existsSync(lightningPath)) return;

  let content = fs.readFileSync(lightningPath, 'utf-8');
  if (content.includes("require('lightningcss-wasm')")) return;

  const target = `let native;\ntry {\n  native = require(\`lightningcss-\${parts.join('-')}\`);\n} catch (err) {\n  native = require(\`../lightningcss.\${parts.join('-')}.node\`);\n}`;
  const replacement = `let native;\ntry {\n  native = require(\`lightningcss-\${parts.join('-')}\`);\n} catch (err) {\n  try {\n    native = require(\`../lightningcss.\${parts.join('-')}.node\`);\n  } catch (err2) {\n    try {\n      native = require('lightningcss-wasm');\n    } catch (err3) {\n      throw err;\n    }\n  }\n}`;

  if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(lightningPath, content, 'utf-8');
    console.log('[SPENDX Patcher] Successfully patched lightningcss for WASM fallback');
  }
}

function patchRollup() {
  const rollupPath = path.resolve(__dirname, '../node_modules/rollup/dist/native.js');
  if (!fs.existsSync(rollupPath)) return;

  let content = fs.readFileSync(rollupPath, 'utf-8');
  if (content.includes('@rollup/wasm-node')) return;

  const target = `const native = require(bindingsPath);`;
  const replacement = `let native;\ntry {\n  native = require(bindingsPath);\n} catch (e) {\n  native = require('@rollup/wasm-node/dist/native.js');\n}`;

  if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(rollupPath, content, 'utf-8');
    console.log('[SPENDX Patcher] Successfully patched rollup for WASM fallback');
  }
}

try {
  patchTailwindOxide();
  patchLightningCss();
  patchRollup();
} catch (e) {
  console.warn('[SPENDX Patcher] Notice during patch execution:', e.message);
}
