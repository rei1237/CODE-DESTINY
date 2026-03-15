import fs from "fs";
import path from "path";

const BASE = "https://themaintarot.com";
const ENTRY_POINTS = [
  "/tarot-card-meaning/major-arcana/",
  "/tarot-card-meaning/minor-arcana/",
];
const RESERVED_SLUGS = new Set([
  "major-arcana",
  "minor-arcana",
  "reversed",
  "feed",
  "page",
]);

const MAJOR_ARCANA = [
  ["M00", "The Fool", "바보", 0],
  ["M01", "The Magician", "마법사", 1],
  ["M02", "The High Priestess", "여사제", 2],
  ["M03", "The Empress", "여황제", 3],
  ["M04", "The Emperor", "황제", 4],
  ["M05", "The Hierophant", "교황", 5],
  ["M06", "The Lovers", "연인", 6],
  ["M07", "The Chariot", "전차", 7],
  ["M08", "Strength", "힘", 8],
  ["M09", "The Hermit", "은둔자", 9],
  ["M10", "Wheel of Fortune", "운명의 수레바퀴", 10],
  ["M11", "Justice", "정의", 11],
  ["M12", "The Hanged Man", "매달린 사람", 12],
  ["M13", "Death", "죽음", 13],
  ["M14", "Temperance", "절제", 14],
  ["M15", "The Devil", "악마", 15],
  ["M16", "The Tower", "탑", 16],
  ["M17", "The Star", "별", 17],
  ["M18", "The Moon", "달", 18],
  ["M19", "The Sun", "태양", 19],
  ["M20", "Judgement", "심판", 20],
  ["M21", "The World", "세계", 21],
];

const MINOR_SUITS = ["Wands", "Cups", "Swords", "Pentacles"];
const MINOR_RANKS = [
  "Ace",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Page",
  "Knight",
  "Queen",
  "King",
];

function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/&amp;/g, "&")
    .replace(/[^a-z0-9가-힣]+/g, " ")
    .trim();
}

function cleanText(html) {
  return String(html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function splitMeaningBlocks(articleText) {
  const upMatch = articleText.match(
    /(정방향|upright)([\s\S]*?)(역방향|reversed|리버스)/i,
  );
  const revMatch = articleText.match(/(역방향|reversed|리버스)([\s\S]*)$/i);

  const upright = upMatch ? upMatch[2].trim() : articleText.slice(0, 1200).trim();
  const reversed = revMatch ? revMatch[2].trim() : articleText.slice(1200, 2400).trim();
  return { upright, reversed };
}

function pickKeywords(articleText) {
  const lineMatch = articleText.match(/(키워드|keywords?)\s*[:：]\s*([^\n]+)/i);
  if (!lineMatch) {
    return {
      upright: [],
      reversed: [],
    };
  }

  const list = lineMatch[2]
    .split(/[,/|]/)
    .map((v) => v.trim())
    .filter(Boolean)
    .slice(0, 10);

  return {
    upright: list.slice(0, 5),
    reversed: list.slice(0, 5),
  };
}

function makeInterpretationSet(upright, reversed) {
  const up = upright || "";
  const rev = reversed || "";
  return {
    upright: {
      general: up,
      love: up,
      money: up,
      career: up,
    },
    reversed: {
      general: rev,
      love: rev,
      money: rev,
      career: rev,
    },
  };
}

function createCardCatalog() {
  const majors = MAJOR_ARCANA.map(([id, name, nameKr, number]) => ({
    id,
    name,
    nameKr,
    arcanaType: "Major",
    suit: null,
    rank: String(number),
    number,
    imageKey: `major-${id.toLowerCase()}`,
  }));

  const minors = [];
  MINOR_SUITS.forEach((suit) => {
    MINOR_RANKS.forEach((rank, index) => {
      minors.push({
        id: `${suit[0]}${String(index + 1).padStart(2, "0")}`,
        name: `${rank} of ${suit}`,
        nameKr: `${suit} ${rank}`,
        arcanaType: "Minor",
        suit,
        rank,
        number: index + 1,
        imageKey: `${suit.toLowerCase()}-${rank.toLowerCase()}`,
      });
    });
  });

  return majors.concat(minors);
}

async function fetchHtml(url) {
  const response = await fetch(url, {
    headers: { "user-agent": "Mozilla/5.0" },
  });
  if (!response.ok) {
    throw new Error(`fetch failed: ${response.status} ${url}`);
  }
  return response.text();
}

function extractCardLinks(html) {
  const matches = html.match(/https:\/\/themaintarot\.com\/tarot-card-meaning\/[^"'#\s<>]+/g) || [];
  const cleaned = [...new Set(matches)].map((url) => (url.endsWith("/") ? url : `${url}/`));

  return cleaned.filter((url) => {
    const slug = url.split("/").filter(Boolean).pop();
    if (!slug) return false;
    if (RESERVED_SLUGS.has(slug)) return false;
    if (slug.startsWith("page")) return false;
    return true;
  });
}

function extractTitleAndArticle(html) {
  const titleMatch =
    html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) ||
    html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const articleMatch =
    html.match(/<article[\s\S]*?<\/article>/i) ||
    html.match(/<main[\s\S]*?<\/main>/i);

  const title = cleanText(titleMatch?.[1] || "");
  const articleText = cleanText(articleMatch?.[0] || html);
  return { title, articleText };
}

function findBestSource(card, sources) {
  const targetTokens = normalize(`${card.name} ${card.nameKr}`).split(" ");
  let best = null;
  let bestScore = 0;

  sources.forEach((source) => {
    const haystack = normalize(`${source.title} ${source.articleText}`);
    const score = targetTokens.reduce((acc, token) => {
      if (!token || token.length < 2) return acc;
      return haystack.includes(token) ? acc + 1 : acc;
    }, 0);

    if (score > bestScore) {
      best = source;
      bestScore = score;
    }
  });

  return best;
}

function fallbackInterpretations(nameKr) {
  return {
    upright: {
      general: `${nameKr} 정방향은 확장과 기회의 흐름을 뜻합니다.`,
      love: `${nameKr} 정방향은 관계 개선의 가능성이 커짐을 의미합니다.`,
      money: `${nameKr} 정방향은 안정적인 재정 흐름을 만들 수 있는 시기입니다.`,
      career: `${nameKr} 정방향은 실행력을 높일수록 성과가 따라오는 신호입니다.`,
    },
    reversed: {
      general: `${nameKr} 역방향은 지연과 점검이 필요한 상태를 시사합니다.`,
      love: `${nameKr} 역방향은 감정 표현 방식의 조정이 필요함을 뜻합니다.`,
      money: `${nameKr} 역방향은 리스크를 줄이는 보수적 접근이 유리합니다.`,
      career: `${nameKr} 역방향은 목표를 재정렬하고 실행 순서를 조정해야 합니다.`,
    },
  };
}

async function build() {
  const links = new Set();

  for (const endpoint of ENTRY_POINTS) {
    for (let page = 1; page <= 12; page += 1) {
      const url = page === 1 ? `${BASE}${endpoint}` : `${BASE}${endpoint}page/${page}/`;
      try {
        const html = await fetchHtml(url);
        const cardLinks = extractCardLinks(html);
        if (cardLinks.length === 0 && page > 1) break;
        cardLinks.forEach((cardUrl) => links.add(cardUrl));
      } catch (error) {
        if (page === 1) {
          throw error;
        }
        break;
      }
    }
  }

  const sources = [];
  for (const link of links) {
    try {
      const html = await fetchHtml(link);
      const parsed = extractTitleAndArticle(html);
      sources.push({
        url: link,
        ...parsed,
      });
      console.log(`[ok] parsed ${link}`);
    } catch (error) {
      console.warn(`[warn] skipped ${link}: ${error.message}`);
    }
  }

  const catalog = createCardCatalog();

  const cards = catalog.map((card) => {
    const source = findBestSource(card, sources);
    if (!source) {
      return {
        ...card,
        keywords: { upright: [], reversed: [] },
        interpretations: fallbackInterpretations(card.nameKr),
        symbols: [],
      };
    }

    const { upright, reversed } = splitMeaningBlocks(source.articleText);
    return {
      ...card,
      keywords: pickKeywords(source.articleText),
      interpretations: makeInterpretationSet(upright, reversed),
      symbols: [],
    };
  });

  const output = {
    version: "1.0.0",
    source: {
      name: "themaintarot",
      url: `${BASE}/tarot-card-meaning/`,
      lastSyncedAt: new Date().toISOString(),
    },
    cards,
  };

  const outPath = path.resolve("server/data/tarot-cards.db.json");
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2), "utf8");
  console.log(`[done] wrote ${outPath}`);
}

build().catch((error) => {
  console.error("[fatal]", error.message);
  process.exit(1);
});
