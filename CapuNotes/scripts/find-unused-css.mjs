// scripts/find-unused-css.mjs
// Escanea el repo y muestra cuáles CSS están usados (importados) y cuáles no.
// Uso: node scripts/find-unused-css.mjs

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const ROOT = process.cwd();
const SRC = join(ROOT, "src");
const STYLES_DIR = join(SRC, "styles");

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

function read(file) {
  try { return readFileSync(file, "utf8"); } catch { return ""; }
}

function normalizePath(p) {
  return p.replaceAll("\\", "/");
}

const allFiles = walk(ROOT);
const styleFiles = allFiles
  .filter(f => normalizePath(f).includes("/src/styles/"))
  .filter(f => extname(f) === ".css");

const codeFiles = allFiles.filter(f => {
  const ext = extname(f);
  return [".jsx", ".js", ".tsx", ".ts", ".css"].includes(ext) &&
         !normalizePath(f).includes("/node_modules/");
});

const imports = new Map(styleFiles.map(f => [normalizePath(f), 0]));

// Busca coincidencias de importaciones a styles
for (const file of codeFiles) {
  const src = read(file);
  for (const css of styleFiles) {
    const rel = normalizePath(css).split("/src/")[1]; // e.g. styles/table.css
    const short = rel.replace(/^styles\//, "");
    const patterns = [
      `"/${rel}"`, `'/${rel}'`,
      `"@/${rel}"`, `'@/${rel}'`,
      `"./${short}"`, `'./${short}'`,
      `"../styles/${short}"`, `'../styles/${short}'`,
      `@import "/${rel}"`, `@import "@/${rel}"`,
      `@import "./${short}"`, `@import "../styles/${short}"`,
    ];
    if (patterns.some(pt => src.includes(pt))) {
      imports.set(normalizePath(css), (imports.get(normalizePath(css)) || 0) + 1);
    }
  }
}

// Reporte
const used = [];
const unused = [];
for (const [css, count] of imports.entries()) {
  (count > 0 ? used : unused).push({ css, count });
}

console.log("== CSS usados ==");
used.sort((a,b)=>a.css.localeCompare(b.css)).forEach(({css,count})=>{
  console.log(`✔ ${css}  (importado ${count} vez/veces)`);
});

console.log("\n== CSS potencialmente NO usados ==");
if (unused.length === 0) {
  console.log("No se encontraron CSS sin importar. 🎉");
} else {
  unused.sort((a,b)=>a.css.localeCompare(b.css)).forEach(({css})=>{
    console.log(`• ${css}`);
  });
  console.log("\nSugerencia: eliminá con cuidado los listados arriba (verificá en la app).");
}
