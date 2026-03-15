/**
 * Download all 78 tarot card images from krates98/tarotcardapi to public/tarot-cards/
 * Run: node scripts/download-tarot-images.js
 */
const fs = require("fs");
const path = require("path");
const https = require("https");

const RAW_BASE = "https://raw.githubusercontent.com/krates98/tarotcardapi/main/images/";
const OUT_DIR = path.join(__dirname, "../public/tarot-cards");

// cardId -> filename (matches krates98/tarotcardapi exactly)
const CARD_TO_FILENAME = {
  M00: "thefool.jpeg",
  M01: "themagician.jpeg",
  M02: "thehighpriestess.jpeg",
  M03: "theempress.jpeg",
  M04: "theemperor.jpeg",
  M05: "thehierophant.jpeg",
  M06: "TheLovers.jpg",
  M07: "thechariot.jpeg",
  M08: "thestrength.jpeg",
  M09: "thehermit.jpeg",
  M10: "wheeloffortune.jpeg",
  M11: "justice.jpeg",
  M12: "thehangedman.jpeg",
  M13: "death.jpeg",
  M14: "temperance.jpeg",
  M15: "thedevil.jpeg",
  M16: "thetower.jpeg",
  M17: "thestar.jpeg",
  M18: "themoon.jpeg",
  M19: "thesun.jpeg",
  M20: "judgement.jpeg",
  M21: "theworld.jpeg",
  W01: "aceofwands.jpeg",
  W02: "twoofwands.jpeg",
  W03: "threeofwands.jpeg",
  W04: "fourofwands.jpeg",
  W05: "fiveofwands.jpeg",
  W06: "sixofwands.jpeg",
  W07: "sevenofwands.jpeg",
  W08: "eightofwands.jpeg",
  W09: "nineofwands.jpeg",
  W10: "tenofwands.jpeg",
  W11: "pageofwands.jpeg",
  W12: "knightofwands.jpeg",
  W13: "queenofwands.jpeg",
  W14: "kingofwands.jpeg",
  C01: "aceofcups.jpeg",
  C02: "twoofcups.jpeg",
  C03: "threeofcups.jpeg",
  C04: "fourofcups.jpeg",
  C05: "fiveofcups.jpeg",
  C06: "sixofcups.jpeg",
  C07: "sevenofcups.jpeg",
  C08: "eightofcups.jpeg",
  C09: "nineofcups.jpeg",
  C10: "tenofcups.jpeg",
  C11: "pageofcups.jpeg",
  C12: "knightofcups.jpeg",
  C13: "queenofcups.jpeg",
  C14: "kingofcups.jpeg",
  S01: "aceofswords.jpeg",
  S02: "twoofswords.jpeg",
  S03: "threeofswords.jpeg",
  S04: "fourofswords.jpeg",
  S05: "fiveofswords.jpeg",
  S06: "sixofswords.jpeg",
  S07: "sevenofswords.jpeg",
  S08: "eightofswords.jpeg",
  S09: "nineofswords.jpeg",
  S10: "tenofswords.jpeg",
  S11: "pageofswords.jpeg",
  S12: "knightofswords.jpeg",
  S13: "queenofswords.jpeg",
  S14: "kingofswords.jpeg",
  P01: "aceofpentacles.jpeg",
  P02: "twoofpentacles.jpeg",
  P03: "threeofpentacles.jpeg",
  P04: "fourofpentacles.jpeg",
  P05: "fiveofpentacles.jpeg",
  P06: "sixofpentacles.jpeg",
  P07: "sevenofpentacles.jpeg",
  P08: "eightofpentacles.jpeg",
  P09: "nineofpentacles.jpeg",
  P10: "tenofpentacles.jpeg",
  P11: "pageofpentacles.jpeg",
  P12: "knightofpentacles.jpeg",
  P13: "queenofpentacles.jpeg",
  P14: "kingofpentacles.jpeg",
};

function download(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode === 302 || res.statusCode === 301) {
          return download(res.headers.location).then(resolve).catch(reject);
        }
        if (res.statusCode !== 200) {
          reject(new Error(`${url} -> ${res.statusCode}`));
          return;
        }
        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => resolve(Buffer.concat(chunks)));
        res.on("error", reject);
      })
      .on("error", reject);
  });
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  const entries = Object.entries(CARD_TO_FILENAME);
  let ok = 0;
  let fail = 0;

  for (const [cardId, filename] of entries) {
    const url = RAW_BASE + filename;
    const outPath = path.join(OUT_DIR, filename);
    try {
      const buf = await download(url);
      fs.writeFileSync(outPath, buf);
      console.log("OK:", cardId, "->", filename);
      ok++;
    } catch (err) {
      console.error("FAIL:", cardId, filename, err.message);
      fail++;
    }
  }

  console.log("\nDone:", ok, "ok,", fail, "failed");
}

main().catch(console.error);
