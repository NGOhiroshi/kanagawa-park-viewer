import { chromium } from "playwright";
import { writeFileSync } from "fs";

const svg = `<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#34d370"/>
      <stop offset="100%" stop-color="#15803d"/>
    </linearGradient>
  </defs>

  <!-- 背景 -->
  <rect width="512" height="512" rx="110" fill="url(#bg)"/>

  <!-- ブランコ支柱 (A フレーム左) -->
  <line x1="148" y1="108" x2="76" y2="390"
        stroke="white" stroke-width="30" stroke-linecap="round"/>
  <!-- ブランコ支柱 (A フレーム右) -->
  <line x1="364" y1="108" x2="436" y2="390"
        stroke="white" stroke-width="30" stroke-linecap="round"/>

  <!-- 上部横バー -->
  <rect x="116" y="88" width="280" height="32" rx="16" fill="white"/>

  <!-- 鎖 左 -->
  <line x1="208" y1="120" x2="222" y2="298"
        stroke="white" stroke-width="14" stroke-linecap="round"/>
  <!-- 鎖 右 -->
  <line x1="304" y1="120" x2="290" y2="298"
        stroke="white" stroke-width="14" stroke-linecap="round"/>

  <!-- 子ども: 耳 (丸くて大きい) -->
  <circle cx="218" cy="244" r="16" fill="white"/>
  <circle cx="294" cy="244" r="16" fill="white"/>
  <!-- 子ども: 頭 (子供らしい大きな頭) -->
  <circle cx="256" cy="238" r="44" fill="white"/>
  <!-- 子ども: 体 -->
  <ellipse cx="256" cy="287" rx="22" ry="16" fill="white"/>
  <!-- 子ども: 腕 (鎖を握っている) -->
  <line x1="236" y1="258" x2="220" y2="284"
        stroke="white" stroke-width="14" stroke-linecap="round"/>
  <line x1="276" y1="258" x2="292" y2="284"
        stroke="white" stroke-width="14" stroke-linecap="round"/>

  <!-- 座面 -->
  <rect x="198" y="296" width="116" height="28" rx="14" fill="white"/>

  <!-- 子ども: 足 (ぶらぶら) -->
  <line x1="235" y1="324" x2="224" y2="374"
        stroke="white" stroke-width="16" stroke-linecap="round"/>
  <line x1="277" y1="324" x2="288" y2="374"
        stroke="white" stroke-width="16" stroke-linecap="round"/>

  <!-- 地面ライン -->
  <rect x="90" y="410" width="332" height="14" rx="7" fill="white" opacity="0.35"/>
  <rect x="130" y="430" width="252" height="10" rx="5" fill="white" opacity="0.20"/>
</svg>`;

const html = (size: number) => `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>*{margin:0;padding:0}</style></head>
<body style="width:${size}px;height:${size}px;overflow:hidden;">
${svg.replace('width="512" height="512"', `width="${size}" height="${size}"`)}
</body></html>`;

async function main() {
  const browser = await chromium.launch();

  for (const size of [192, 512]) {
    const page = await browser.newPage();
    await page.setViewportSize({ width: size, height: size });
    await page.setContent(html(size), { waitUntil: "load" });
    const buf = await page.screenshot({
      type: "png",
      clip: { x: 0, y: 0, width: size, height: size },
    });
    writeFileSync(`public/icons/icon-${size}.png`, buf);
    console.log(`✓ icon-${size}.png`);
    await page.close();
  }

  await browser.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
