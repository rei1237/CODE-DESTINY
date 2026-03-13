(() => {
  const HEAVENLY_STEMS = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
  const EARTHLY_BRANCHES = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
  const ELEMENT_ORDER = ["wood", "fire", "earth", "metal", "water"];

  const STEM_TO_ELEMENT = {
    "甲": "wood", "乙": "wood",
    "丙": "fire", "丁": "fire",
    "戊": "earth", "己": "earth",
    "庚": "metal", "辛": "metal",
    "壬": "water", "癸": "water"
  };

  const BRANCH_TO_ELEMENT = {
    "子": "water", "丑": "earth", "寅": "wood", "卯": "wood",
    "辰": "earth", "巳": "fire", "午": "fire", "未": "earth",
    "申": "metal", "酉": "metal", "戌": "earth", "亥": "water"
  };

  const ELEMENT_LABEL = {
    wood: "목(木)",
    fire: "화(火)",
    earth: "토(土)",
    metal: "금(金)",
    water: "수(水)"
  };

  const FLOWERS = {
    cherry: {
      name: "벚꽃",
      emoji: "🌸",
      desc: "따뜻한 바람처럼 사람을 끌어당기는 매력을 지닌 당신. 시작의 기회가 빠르게 열리는 날입니다.",
      tarotTheme: "설렘과 시작의 파동",
      sceneBackground: "linear-gradient(135deg, rgba(254,205,211,.72), rgba(255,255,255,.68), rgba(249,168,212,.62))",
      glowClass: "glow-rose",
      pollen: ["#fda4af", "#f9a8d4", "#fecdd3"],
      cardBack: ["#fda4af", "#f9a8d4"]
    },
    lotus: {
      name: "연꽃",
      emoji: "🪷",
      desc: "고요한 집중력으로 감정의 파도를 다스리는 당신. 흔들려도 중심을 잃지 않는 회복의 운이 강합니다.",
      tarotTheme: "치유와 깊은 직관",
      sceneBackground: "linear-gradient(135deg, rgba(186,230,253,.72), rgba(255,255,255,.7), rgba(196,181,253,.62))",
      glowClass: "glow-sky",
      pollen: ["#7dd3fc", "#93c5fd", "#c4b5fd"],
      cardBack: ["#93c5fd", "#c4b5fd"]
    },
    camellia: {
      name: "동백꽃",
      emoji: "🌺",
      desc: "진심이 강한 추진력으로 바뀌는 타입입니다. 결정을 미루지 않을수록 행운의 속도가 빨라집니다.",
      tarotTheme: "용기와 실행의 불꽃",
      sceneBackground: "linear-gradient(135deg, rgba(254,202,202,.72), rgba(255,255,255,.69), rgba(253,186,116,.62))",
      glowClass: "glow-amber",
      pollen: ["#fb7185", "#fb923c", "#fca5a5"],
      cardBack: ["#fb7185", "#fb923c"]
    },
    chrysanthemum: {
      name: "국화",
      emoji: "🌼",
      desc: "맑은 판단력과 절제된 감각을 지닌 당신. 복잡한 상황일수록 당신의 기준이 모두를 안정시킵니다.",
      tarotTheme: "균형과 명료한 선택",
      sceneBackground: "linear-gradient(135deg, rgba(254,240,138,.72), rgba(255,255,255,.72), rgba(253,224,71,.62))",
      glowClass: "glow-amber",
      pollen: ["#fde047", "#facc15", "#fcd34d"],
      cardBack: ["#facc15", "#f59e0b"]
    },
    orchid: {
      name: "난초",
      emoji: "💮",
      desc: "세밀한 감수성과 품격 있는 집중력이 빛나는 날입니다. 작은 힌트 하나가 큰 전환점이 됩니다.",
      tarotTheme: "우아한 집중과 성숙",
      sceneBackground: "linear-gradient(135deg, rgba(187,247,208,.72), rgba(255,255,255,.72), rgba(134,239,172,.62))",
      glowClass: "glow-emerald",
      pollen: ["#86efac", "#6ee7b7", "#a7f3d0"],
      cardBack: ["#34d399", "#86efac"]
    }
  };

  const TAROT_DECKS = {
    cherry: [
      { name: "The Empress", keyword: "풍요", message: "감정과 아이디어가 무르익는 날입니다. 당신의 따뜻한 한마디가 관계를 크게 꽃피웁니다." },
      { name: "The Sun", keyword: "환희", message: "막혀 있던 흐름이 밝게 열립니다. 오늘은 스스로를 드러낼수록 좋은 소식이 따라옵니다." },
      { name: "Ace of Cups", keyword: "설렘", message: "새로운 인연과 감정의 문이 열립니다. 작게 시작한 대화가 특별한 연결로 이어집니다." }
    ],
    lotus: [
      { name: "The Star", keyword: "희망", message: "흔들림 뒤에 더 선명한 방향이 보입니다. 조용히 믿고 가는 선택이 큰 회복을 만듭니다." },
      { name: "Temperance", keyword: "조율", message: "빠름보다 균형이 행운을 만듭니다. 속도를 낮추면 더 좋은 타이밍이 당신을 찾습니다." },
      { name: "The High Priestess", keyword: "직관", message: "정답은 이미 당신 안에 있습니다. 오늘은 첫 느낌을 존중할수록 후회가 줄어듭니다." }
    ],
    camellia: [
      { name: "Strength", keyword: "용기", message: "감정을 억누르기보다 다정하게 다루는 힘이 필요합니다. 그 용기가 문제를 부드럽게 돌파합니다." },
      { name: "Queen of Wands", keyword: "매력", message: "당신의 존재감이 주변을 움직입니다. 제안과 발표, 고백에 강한 운이 붙는 날입니다." },
      { name: "Wheel of Fortune", keyword: "전환", message: "멈춘 듯한 판이 갑자기 돌아갑니다. 들어온 기회는 빠르게 잡을수록 유리합니다." }
    ],
    chrysanthemum: [
      { name: "Justice", keyword: "정렬", message: "흩어진 우선순위를 정리하면 즉시 결과가 좋아집니다. 정확한 기준이 최고의 행운입니다." },
      { name: "King of Swords", keyword: "결단", message: "지금 필요한 건 감정 소모가 아닌 명확한 결정입니다. 단호함이 시간을 절약해 줍니다." },
      { name: "The World", keyword: "완성", message: "마무리 운이 강합니다. 오래 끌던 프로젝트나 관계가 의미 있게 정리됩니다." }
    ],
    orchid: [
      { name: "The Moon", keyword: "감수성", message: "애매한 분위기 속에 중요한 힌트가 숨어 있습니다. 기록하고 관찰하면 길이 보입니다." },
      { name: "The Lovers", keyword: "조화", message: "마음이 맞는 사람과의 연결이 강화됩니다. 협업과 대화에서 달콤한 기회가 열립니다." },
      { name: "Nine of Pentacles", keyword: "품격", message: "스스로의 기준을 지킬수록 성과가 커집니다. 혼자만의 리듬이 귀한 결실로 이어집니다." }
    ]
  };

  const SPECIAL_PILLARS = {
    "乙亥": "lotus",
    "丁酉": "camellia",
    "辛巳": "chrysanthemum",
    "癸卯": "cherry",
    "甲辰": "orchid"
  };

  const STEM_TRAITS = {
    wood: "성장성과 확장 감각",
    fire: "표현력과 추진력",
    earth: "안정감과 책임감",
    metal: "정밀함과 결단력",
    water: "유연함과 통찰력"
  };

  const state = {
    selectedFlowerKey: "cherry",
    selectedFlower: FLOWERS.cherry,
    currentSpread: [],
    pickedCard: null,
    profile: null,
    analysis: null
  };

  const els = {
    ambientParticles: document.getElementById("ambientParticles"),
    nameInput: document.getElementById("nameInput"),
    monthInput: document.getElementById("monthInput"),
    dayStemInput: document.getElementById("dayStemInput"),
    waterInput: document.getElementById("waterInput"),
    metalInput: document.getElementById("metalInput"),
    dayPillarInput: document.getElementById("dayPillarInput"),
    waterValue: document.getElementById("waterValue"),
    metalValue: document.getElementById("metalValue"),
    bloomBtn: document.getElementById("bloomBtn"),
    syncProfileBtn: document.getElementById("syncProfileBtn"),
    profileSummary: document.getElementById("profileSummary"),
    profileStatusBadge: document.getElementById("profileStatusBadge"),
    profileHint: document.getElementById("profileHint"),
    dayStemText: document.getElementById("dayStemText"),
    dayPillarText: document.getElementById("dayPillarText"),
    dominantElementText: document.getElementById("dominantElementText"),
    engineSourceText: document.getElementById("engineSourceText"),
    resultCapture: document.getElementById("resultCapture"),
    bloomScene: document.getElementById("bloomScene"),
    flowerGlow: document.getElementById("flowerGlow"),
    flowerWrap: document.getElementById("flowerWrap"),
    flowerVisual: document.getElementById("flowerVisual"),
    flowerName: document.getElementById("flowerName"),
    flowerDesc: document.getElementById("flowerDesc"),
    tarotTheme: document.getElementById("tarotTheme"),
    flowerPollen: document.getElementById("flowerPollen"),
    analysisLines: document.getElementById("analysisLines"),
    tarotFan: document.getElementById("tarotFan"),
    tarotResult: document.getElementById("tarotResult"),
    pickedCardName: document.getElementById("pickedCardName"),
    pickedCardMessage: document.getElementById("pickedCardMessage"),
    luckActionsSection: document.getElementById("luckActionsSection"),
    keepLuckBtn: document.getElementById("keepLuckBtn"),
    luckActions: document.getElementById("luckActions"),
    saveResultBtn: document.getElementById("saveResultBtn"),
    shareResultBtn: document.getElementById("shareResultBtn"),
    flowerPigBtn: document.getElementById("flowerPigBtn"),
    energyWood: document.getElementById("energy-wood"),
    energyFire: document.getElementById("energy-fire"),
    energyEarth: document.getElementById("energy-earth"),
    energyMetal: document.getElementById("energy-metal"),
    energyWater: document.getElementById("energy-water"),
    energyWoodValue: document.getElementById("energy-wood-value"),
    energyFireValue: document.getElementById("energy-fire-value"),
    energyEarthValue: document.getElementById("energy-earth-value"),
    energyMetalValue: document.getElementById("energy-metal-value"),
    energyWaterValue: document.getElementById("energy-water-value")
  };

  function init() {
    seedAmbientParticles();
    bindRangeLabel(els.waterInput, els.waterValue);
    bindRangeLabel(els.metalInput, els.metalValue);
    els.monthInput.value = String(new Date().getMonth() + 1);

    els.bloomBtn.addEventListener("click", handleBloom);
    els.syncProfileBtn.addEventListener("click", () => syncProfileFromStorage(false));
    els.keepLuckBtn.addEventListener("click", () => els.luckActions.classList.toggle("hidden"));
    els.saveResultBtn.addEventListener("click", handleSaveResult);
    els.shareResultBtn.addEventListener("click", handleShareResult);
    els.flowerPigBtn.addEventListener("click", () => {
      const tips = [
        "꽃돼지 한마디: 오늘은 마음이 먼저 반응한 쪽이 정답일 가능성이 높아요.",
        "꽃돼지 한마디: 작은 약속을 지키면 큰 행운이 따라와요.",
        "꽃돼지 한마디: 예쁜 말 한마디가 운의 문을 열어줍니다."
      ];
      window.alert(tips[Math.floor(Math.random() * tips.length)]);
    });

    subscribeProfileSignals();
    syncProfileFromStorage(true);
    renderEnergyBars({ wood: 0, fire: 0, earth: 0, metal: 0, water: 0 });
  }

  function subscribeProfileSignals() {
    document.addEventListener("destinyProfileChanged", () => syncProfileFromStorage(true));
    window.addEventListener("storage", (event) => {
      const key = String(event.key || "");
      if (
        key.includes("FORTUNE_APP_USER_PROFILES") ||
        key === "user_profile" ||
        key === "fortune_auth_user"
      ) {
        syncProfileFromStorage(true);
      }
    });

    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") syncProfileFromStorage(true);
    });
  }

  function syncProfileFromStorage(isSilent) {
    setProfileStatus("loading", "프로필 동기화 중");

    const profile = resolveCurrentProfile();
    state.profile = profile;

    if (!profile) {
      state.analysis = buildManualAnalysis();
      applyAnalysisToInputs(state.analysis);
      renderEnergyBars(state.analysis.weights);
      setProfileStatus("missing", "프로필 없음");
      els.profileSummary.textContent = "메인 화면에서 프로필 저장 후 다시 동기화하면 자동 오행 분석이 적용됩니다.";
      els.profileHint.textContent = "현재는 수동 보정 입력 기준으로 분석합니다.";
      return;
    }

    const analysis = analyzeFromProfile(profile);
    state.analysis = analysis;

    if (!isSilent && profile.name) {
      els.nameInput.value = profile.name;
    } else if (!els.nameInput.value && profile.name) {
      els.nameInput.value = profile.name;
    }

    applyAnalysisToInputs(analysis);
    renderEnergyBars(analysis.weights);

    setProfileStatus("ready", "연동 완료");
    const birth = profile.birth;
    const birthText = `${birth.year}.${pad2(birth.month)}.${pad2(birth.day)} ${pad2(birth.hour)}:${pad2(birth.minute)}`;
    els.profileSummary.textContent = `${profile.name} 프로필  ${birthText} 기준으로 사주 오행을 자동 분석했습니다.`;
    els.profileHint.textContent = "프로필 변경 시 자동 반영됩니다. 필요하면 수동 보정 입력으로 미세 조절하세요.";
  }

  function setProfileStatus(kind, text) {
    els.profileStatusBadge.classList.remove("status-loading", "status-ready", "status-missing");
    if (kind === "ready") {
      els.profileStatusBadge.classList.add("status-ready");
    } else if (kind === "missing") {
      els.profileStatusBadge.classList.add("status-missing");
    } else {
      els.profileStatusBadge.classList.add("status-loading");
    }
    els.profileStatusBadge.textContent = text;
  }

  function resolveCurrentProfile() {
    const fromManager = readProfileFromManager();
    if (fromManager) return fromManager;

    const fromLocalProfile = readProfileFromStorageBundle();
    if (fromLocalProfile) return fromLocalProfile;

    return null;
  }

  function readProfileFromManager() {
    try {
      const manager = window.DestinyProfileManager;
      if (!manager || !manager.storage || typeof manager.storage.current !== "function") {
        return null;
      }
      return normalizeProfile(manager.storage.current());
    } catch (_error) {
      return null;
    }
  }

  function readProfileFromStorageBundle() {
    try {
      const currentId = localStorage.getItem("FORTUNE_APP_USER_PROFILES.current");
      const listRaw = localStorage.getItem("FORTUNE_APP_USER_PROFILES.list");
      if (listRaw) {
        const list = JSON.parse(listRaw);
        if (Array.isArray(list) && list.length > 0) {
          const matched = list.find((item) => String(item.id || "") === String(currentId || ""));
          const normalized = normalizeProfile(matched || list[list.length - 1]);
          if (normalized) return normalized;
        }
      }

      const userProfileRaw = localStorage.getItem("user_profile");
      if (userProfileRaw) {
        const parsed = JSON.parse(userProfileRaw);
        const candidates = [parsed, parsed.profile, parsed.user, parsed.user_profile, parsed.currentProfile];
        for (let i = 0; i < candidates.length; i += 1) {
          const normalized = normalizeProfile(candidates[i]);
          if (normalized) return normalized;
        }
      }

      const authRaw = localStorage.getItem("fortune_auth_user");
      if (authRaw) {
        const parsedAuth = JSON.parse(authRaw);
        const normalizedAuth = normalizeProfile(parsedAuth);
        if (normalizedAuth) return normalizedAuth;
      }
    } catch (_error) {
      return null;
    }

    return null;
  }

  function normalizeProfile(raw) {
    if (!raw || typeof raw !== "object") return null;

    const source = raw;
    const birth = source.birth || {};

    const year = Number(birth.year || birth.y || source.year || source.birthYear);
    const month = Number(birth.month || birth.m || source.month || source.birthMonth);
    const day = Number(birth.day || birth.d || source.day || source.birthDay);
    const hour = Number(birth.hour != null ? birth.hour : (source.hour != null ? source.hour : 12));
    const minute = Number(birth.minute != null ? birth.minute : (source.minute != null ? source.minute : 0));

    if (!isFinite(year) || !isFinite(month) || !isFinite(day)) return null;

    const name = String(source.name || source.profileName || source.username || "사용자");

    return {
      id: String(source.id || source.profileId || "profile"),
      name,
      gender: String(source.gender || "F"),
      birth: {
        year,
        month,
        day,
        hour: isFinite(hour) ? hour : 12,
        minute: isFinite(minute) ? minute : 0,
        calType: String(birth.calType || source.calType || "solar")
      },
      location: source.location || {}
    };
  }

  function analyzeFromProfile(profile) {
    const fromEngine = analyzeWithEngineBridge(profile);
    if (fromEngine) {
      return fromEngine;
    }

    return analyzeWithCoreRule(profile);
  }

  function analyzeWithEngineBridge(profile) {
    try {
      if (typeof window.computeProfileForModal !== "function") return null;

      const computed = window.computeProfileForModal(profile);
      if (!computed || !computed.p) return null;

      const pillars = computed.p;
      const count = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };

      [pillars.y.g, pillars.m.g, pillars.d.g, pillars.h.g].forEach((stem) => {
        const element = STEM_TO_ELEMENT[stem];
        if (element) count[element] += 1;
      });

      [pillars.y.j, pillars.m.j, pillars.d.j, pillars.h.j].forEach((branch) => {
        const element = BRANCH_TO_ELEMENT[branch];
        if (element) count[element] += 1;
      });

      if (pillars.m.j && BRANCH_TO_ELEMENT[pillars.m.j]) {
        count[BRANCH_TO_ELEMENT[pillars.m.j]] += 1;
      }

      const weights = normalizeCountToPercent(count);
      const ranked = sortElements(weights);

      return {
        month: profile.birth.month,
        dayStem: pillars.d.g,
        dayPillar: `${pillars.d.g}${pillars.d.j}`,
        weights,
        dominant: ranked[0],
        support: ranked[1],
        lacking: ranked[ranked.length - 1],
        source: "engine",
        sourceLabel: "사주 엔진"
      };
    } catch (error) {
      console.warn("engine bridge failed", error);
      return null;
    }
  }

  function analyzeWithCoreRule(profile) {
    const birth = profile.birth;
    const weights = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };

    const yearStemIndex = mod((birth.year - 4), 10);
    const yearBranchIndex = mod((birth.year - 4), 12);
    const monthBranchIndex = mod((birth.month + 1), 12);

    const dayIndex = getDayIndex(birth.year, birth.month, birth.day);
    const dayStemIndex = mod(dayIndex + 50, 10);
    const dayBranchIndex = mod(dayIndex + 38, 12);

    const hourValue = Number.isFinite(birth.hour) ? birth.hour : 12;
    const hourBranchIndex = Math.floor(mod(hourValue + 1, 24) / 2);
    const hourStemIndex = mod(dayStemIndex * 2 + hourBranchIndex, 10);

    addWeight(weights, STEM_TO_ELEMENT[HEAVENLY_STEMS[yearStemIndex]], 2.2);
    addWeight(weights, BRANCH_TO_ELEMENT[EARTHLY_BRANCHES[yearBranchIndex]], 1.7);
    addWeight(weights, BRANCH_TO_ELEMENT[EARTHLY_BRANCHES[monthBranchIndex]], 2.1);
    addWeight(weights, STEM_TO_ELEMENT[HEAVENLY_STEMS[dayStemIndex]], 2.5);
    addWeight(weights, BRANCH_TO_ELEMENT[EARTHLY_BRANCHES[dayBranchIndex]], 1.3);

    if (Number.isFinite(birth.hour) && Number.isFinite(birth.minute)) {
      addWeight(weights, STEM_TO_ELEMENT[HEAVENLY_STEMS[hourStemIndex]], 0.9);
      addWeight(weights, BRANCH_TO_ELEMENT[EARTHLY_BRANCHES[hourBranchIndex]], 1.0);
    } else {
      ELEMENT_ORDER.forEach((el) => addWeight(weights, el, 0.35));
    }

    const seasonBonus = getSeasonBonus(birth.month);
    ELEMENT_ORDER.forEach((el) => {
      if (seasonBonus[el]) addWeight(weights, el, seasonBonus[el]);
    });

    const normalized = normalizeRawWeights(weights);
    const ranked = sortElements(normalized);

    return {
      month: birth.month,
      dayStem: HEAVENLY_STEMS[dayStemIndex],
      dayPillar: `${HEAVENLY_STEMS[dayStemIndex]}${EARTHLY_BRANCHES[dayBranchIndex]}`,
      weights: normalized,
      dominant: ranked[0],
      support: ranked[1],
      lacking: ranked[ranked.length - 1],
      source: "core",
      sourceLabel: "사주 엔진 코어"
    };
  }

  function buildManualAnalysis() {
    const month = Number(els.monthInput.value);
    const dayStem = els.dayStemInput.value;
    const water = Number(els.waterInput.value);
    const metal = Number(els.metalInput.value);
    const dayPillar = (els.dayPillarInput.value || "").trim();

    const raw = {
      wood: 16,
      fire: 16,
      earth: 18,
      metal,
      water
    };

    if (["甲", "乙"].includes(dayStem)) raw.wood += 10;
    if (["丙", "丁"].includes(dayStem)) raw.fire += 10;
    if (["戊", "己"].includes(dayStem)) raw.earth += 10;
    if (["庚", "辛"].includes(dayStem)) raw.metal += 8;
    if (["壬", "癸"].includes(dayStem)) raw.water += 8;

    if (month >= 3 && month <= 5) raw.wood += 6;
    if (month >= 6 && month <= 8) raw.fire += 6;
    if (month >= 9 && month <= 11) raw.metal += 6;
    if (month === 12 || month <= 2) raw.water += 6;

    const weights = normalizeRawWeights(raw);
    const ranked = sortElements(weights);

    return {
      month,
      dayStem,
      dayPillar,
      weights,
      dominant: ranked[0],
      support: ranked[1],
      lacking: ranked[ranked.length - 1],
      source: "manual",
      sourceLabel: "수동 보정"
    };
  }

  function applyAnalysisToInputs(analysis) {
    if (!analysis) return;

    const water = Number(analysis.weights.water || 0);
    const metal = Number(analysis.weights.metal || 0);

    els.monthInput.value = String(analysis.month || Number(els.monthInput.value));
    els.dayStemInput.value = analysis.dayStem || els.dayStemInput.value;
    if (analysis.dayPillar) {
      els.dayPillarInput.value = analysis.dayPillar;
    }

    els.waterInput.value = String(water);
    els.metalInput.value = String(metal);
    els.waterValue.textContent = String(water);
    els.metalValue.textContent = String(metal);

    els.dayStemText.textContent = analysis.dayStem || "-";
    els.dayPillarText.textContent = analysis.dayPillar || "-";
    els.dominantElementText.textContent = `${ELEMENT_LABEL[analysis.dominant] || analysis.dominant}`;
    els.engineSourceText.textContent = analysis.sourceLabel;
  }

  function bindRangeLabel(input, label) {
    const sync = () => {
      label.textContent = input.value;
      if (!state.profile) {
        state.analysis = buildManualAnalysis();
        renderEnergyBars(state.analysis.weights);
        applyAnalysisToInputs(state.analysis);
      }
    };
    input.addEventListener("input", sync);
    sync();
  }

  function handleBloom() {
    const analysis = state.profile ? state.analysis : buildManualAnalysis();
    state.analysis = analysis;

    const flowerKey = decideFlower(analysis);
    const flower = FLOWERS[flowerKey] || FLOWERS.cherry;

    state.selectedFlowerKey = flowerKey;
    state.selectedFlower = flower;
    state.pickedCard = null;

    const nameFromProfile = state.profile ? state.profile.name : "";
    const profile = {
      name: (els.nameInput.value || nameFromProfile || "").trim(),
      dayStem: analysis.dayStem,
      dayPillar: analysis.dayPillar,
      water: analysis.weights.water,
      metal: analysis.weights.metal,
      month: analysis.month,
      dominant: analysis.dominant,
      support: analysis.support,
      lacking: analysis.lacking,
      sourceLabel: analysis.sourceLabel,
      weights: analysis.weights
    };

    renderFlower(flower, profile);
    renderTarotSpread(flowerKey);

    els.resultCapture.classList.remove("hidden");
    els.tarotResult.classList.add("hidden");
    els.luckActionsSection.classList.add("hidden");
    els.luckActions.classList.add("hidden");

    els.resultCapture.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function decideFlower(profile) {
    if (profile.dayPillar && SPECIAL_PILLARS[profile.dayPillar]) {
      return SPECIAL_PILLARS[profile.dayPillar];
    }

    if (profile.dominant === "water" && profile.support === "wood") {
      return "lotus";
    }

    if (profile.dominant === "metal") {
      return "chrysanthemum";
    }

    if (profile.dominant === "fire") {
      return "camellia";
    }

    if (profile.dominant === "earth") {
      return "orchid";
    }

    if (profile.dominant === "wood" && profile.month >= 9 && profile.month <= 11) {
      return "orchid";
    }

    return "cherry";
  }

  function renderFlower(flower, profile) {
    const displayName = profile.name ? `${profile.name}님의 ${flower.name}` : flower.name;
    els.flowerName.textContent = displayName;
    els.flowerDesc.textContent = flower.desc;
    els.flowerVisual.textContent = flower.emoji;
    els.tarotTheme.textContent = `${flower.tarotTheme}  ${profile.sourceLabel} 기반 해석`;
    els.bloomScene.style.background = flower.sceneBackground;

    els.flowerGlow.classList.remove("glow-rose", "glow-violet", "glow-sky", "glow-amber", "glow-emerald");
    els.flowerGlow.classList.add(flower.glowClass);

    els.flowerWrap.classList.remove("flower-fade-in");
    requestAnimationFrame(() => els.flowerWrap.classList.add("flower-fade-in"));

    spawnPollen(flower.pollen);
    renderAnalysisLines(profile, flower);
  }

  function renderAnalysisLines(profile, flower) {
    const trait = STEM_TRAITS[getStemGroup(profile.dayStem)] || "균형 감각";
    const weights = profile.weights || {};
    const elementSummary = `${ELEMENT_LABEL.wood} ${weights.wood || 0}%  ${ELEMENT_LABEL.fire} ${weights.fire || 0}%  ${ELEMENT_LABEL.earth} ${weights.earth || 0}%  ${ELEMENT_LABEL.metal} ${weights.metal || 0}%  ${ELEMENT_LABEL.water} ${weights.water || 0}%`;

    const lines = [
      `${profile.sourceLabel}로 산출한 일간 ${profile.dayStem || "-"}의 핵심 성향은 ${trait}입니다.`,
      `우세 오행은 ${ELEMENT_LABEL[profile.dominant]}이며 보조 오행은 ${ELEMENT_LABEL[profile.support]}입니다. 부족 오행은 ${ELEMENT_LABEL[profile.lacking]}입니다.`,
      elementSummary,
      `${flower.name} 테마 ${flower.tarotTheme}이 오늘의 행동 포인트를 안내합니다.`
    ];

    els.analysisLines.innerHTML = "";
    lines.forEach((line, index) => {
      const item = document.createElement("li");
      item.className = "stagger-line";
      item.style.animationDelay = `${index * 120}ms`;
      item.textContent = line;
      els.analysisLines.appendChild(item);
    });
  }

  function renderEnergyBars(weights) {
    const safe = {
      wood: Number(weights.wood || 0),
      fire: Number(weights.fire || 0),
      earth: Number(weights.earth || 0),
      metal: Number(weights.metal || 0),
      water: Number(weights.water || 0)
    };

    setEnergyBar(els.energyWood, els.energyWoodValue, safe.wood);
    setEnergyBar(els.energyFire, els.energyFireValue, safe.fire);
    setEnergyBar(els.energyEarth, els.energyEarthValue, safe.earth);
    setEnergyBar(els.energyMetal, els.energyMetalValue, safe.metal);
    setEnergyBar(els.energyWater, els.energyWaterValue, safe.water);
  }

  function setEnergyBar(fillEl, valueEl, value) {
    if (!fillEl || !valueEl) return;
    const clamped = Math.max(0, Math.min(100, Number(value || 0)));
    fillEl.style.width = `${clamped}%`;
    valueEl.textContent = `${Math.round(clamped)}%`;
  }

  function getStemGroup(stem) {
    const element = STEM_TO_ELEMENT[stem];
    return element || "water";
  }

  function seedAmbientParticles() {
    if (!els.ambientParticles) {
      return;
    }
    els.ambientParticles.innerHTML = "";
    const count = window.innerWidth < 640 ? 22 : 36;
    for (let i = 0; i < count; i += 1) {
      const p = document.createElement("span");
      const size = randomNumber(5, 10);
      p.className = "particle";
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${randomNumber(0, 100)}%`;
      p.style.bottom = `${randomNumber(-12, 14)}vh`;
      p.style.animationDuration = `${randomNumber(9, 18)}s`;
      p.style.animationDelay = `${randomNumber(0, 8)}s`;
      p.style.background = randomPick(["#fda4af", "#f9a8d4", "#c4b5fd", "#93c5fd", "#fde047"]);
      els.ambientParticles.appendChild(p);
    }
  }

  function spawnPollen(colors) {
    els.flowerPollen.innerHTML = "";
    for (let i = 0; i < 24; i += 1) {
      const dot = document.createElement("span");
      const size = randomNumber(5, 10);
      dot.className = "pollen";
      dot.style.width = `${size}px`;
      dot.style.height = `${size}px`;
      dot.style.left = `${randomNumber(12, 88)}%`;
      dot.style.top = `${randomNumber(18, 82)}%`;
      dot.style.background = randomPick(colors);
      dot.style.opacity = String(randomNumber(40, 95) / 100);
      dot.style.setProperty("--pollen-x", `${randomNumber(-65, 65)}px`);
      dot.style.setProperty("--pollen-y", `${randomNumber(-130, -55)}px`);
      dot.style.animationDelay = `${randomNumber(0, 420)}ms`;
      els.flowerPollen.appendChild(dot);
    }
  }

  function renderTarotSpread(flowerKey) {
    const baseDeck = TAROT_DECKS[flowerKey] || TAROT_DECKS.cherry;
    state.currentSpread = shuffle(baseDeck.slice()).slice(0, 3);
    state.pickedCard = null;

    const rotations = [-14, 0, 14];
    els.tarotFan.innerHTML = "";

    state.currentSpread.forEach((card, index) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "tarot-card";
      btn.style.setProperty("--fan-rotate", `${rotations[index]}deg`);
      btn.style.transform = `rotate(${rotations[index]}deg)`;
      btn.dataset.cardIndex = String(index);
      btn.style.setProperty("--card-back-a", state.selectedFlower.cardBack[0]);
      btn.style.setProperty("--card-back-b", state.selectedFlower.cardBack[1]);

      btn.innerHTML = `
        <div class="tarot-card-inner">
          <div class="tarot-face tarot-back">
            <div class="back-icon">${state.selectedFlower.emoji}</div>
            <div class="back-caption">FORTUNE BLOOM</div>
          </div>
          <div class="tarot-face tarot-front">
            <div class="front-flower">${state.selectedFlower.emoji}</div>
            <div class="front-name">${card.name}</div>
            <div class="front-keyword">${card.keyword}</div>
            <div class="front-hint">당신의 꽃 기운이 선택한 카드</div>
          </div>
        </div>
      `;

      btn.addEventListener("click", () => pickTarotCard(btn, card));
      els.tarotFan.appendChild(btn);
    });
  }

  function pickTarotCard(buttonEl, card) {
    if (state.pickedCard) {
      return;
    }

    state.pickedCard = card;
    buttonEl.classList.add("flipped");

    const allCards = Array.from(els.tarotFan.querySelectorAll(".tarot-card"));
    allCards.forEach((cardEl) => {
      if (cardEl !== buttonEl) {
        cardEl.classList.add("disabled");
      }
    });

    window.setTimeout(() => {
      els.tarotResult.classList.remove("hidden");
      els.tarotResult.classList.add("picked-pop");
      els.pickedCardName.textContent = `${card.name}  ${card.keyword}`;
      els.pickedCardMessage.textContent = `${card.message} (${state.selectedFlower.name}의 흐름)`;
      els.luckActionsSection.classList.remove("hidden");
      els.luckActionsSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 360);
  }

  async function handleSaveResult() {
    const target = els.resultCapture;
    if (target.classList.contains("hidden")) {
      window.alert("먼저 꽃 피워내기를 실행해 주세요.");
      return;
    }

    if (typeof window.html2canvas === "function") {
      try {
        const canvas = await window.html2canvas(target, {
          scale: 2,
          backgroundColor: "#fffdf6",
          useCORS: true
        });
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `flower-fortune-${Date.now()}.png`;
        link.click();
        return;
      } catch (error) {
        console.error("save image failed", error);
      }
    }

    downloadTextFallback();
  }

  async function handleShareResult() {
    const shareText = buildShareText();
    if (navigator.share) {
      try {
        await navigator.share({
          title: "운명의 꽃 리포트",
          text: shareText
        });
        return;
      } catch (error) {
        if (error && error.name === "AbortError") {
          return;
        }
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
      window.alert("결과 문구를 클립보드에 복사했어요.");
    } catch (_error) {
      window.alert(shareText);
    }
  }

  function buildShareText() {
    const flower = state.selectedFlower;
    const card = state.pickedCard;
    const flowerName = flower ? flower.name : "운명의 꽃";
    const cardLine = card ? `${card.name} (${card.keyword})` : "카드 선택 전";
    const cardMessage = card ? card.message : "아직 카드를 선택하지 않았어요.";

    return [
      "[오늘의 운명의 꽃 결과]",
      `꽃: ${flowerName}`,
      `타로: ${cardLine}`,
      `메시지: ${cardMessage}`
    ].join("\n");
  }

  function downloadTextFallback() {
    const blob = new Blob([buildShareText()], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `flower-fortune-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function getSeasonBonus(month) {
    if (month >= 3 && month <= 5) {
      return { wood: 1.4, fire: 0.6 };
    }
    if (month >= 6 && month <= 8) {
      return { fire: 1.5, earth: 0.5 };
    }
    if (month >= 9 && month <= 11) {
      return { metal: 1.4, water: 0.6 };
    }
    return { water: 1.5, wood: 0.5 };
  }

  function getDayIndex(year, month, day) {
    const utcMillis = Date.UTC(year, month - 1, day);
    return Math.floor(utcMillis / 86400000) + 2440588;
  }

  function normalizeRawWeights(raw) {
    const normalized = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
    const sum = ELEMENT_ORDER.reduce((acc, key) => acc + Number(raw[key] || 0), 0);

    if (!sum) {
      return { wood: 20, fire: 20, earth: 20, metal: 20, water: 20 };
    }

    let used = 0;
    const fracs = [];

    ELEMENT_ORDER.forEach((element) => {
      const exact = (Number(raw[element] || 0) / sum) * 100;
      const floor = Math.floor(exact);
      normalized[element] = floor;
      used += floor;
      fracs.push({ element, frac: exact - floor });
    });

    let remainder = 100 - used;
    fracs.sort((a, b) => b.frac - a.frac);
    for (let i = 0; i < remainder; i += 1) {
      normalized[fracs[i % fracs.length].element] += 1;
    }

    return normalized;
  }

  function normalizeCountToPercent(count) {
    return normalizeRawWeights(count);
  }

  function addWeight(target, element, amount) {
    if (!element) return;
    target[element] = Number(target[element] || 0) + Number(amount || 0);
  }

  function sortElements(weights) {
    return [...ELEMENT_ORDER].sort((a, b) => Number(weights[b] || 0) - Number(weights[a] || 0));
  }

  function mod(n, m) {
    return ((n % m) + m) % m;
  }

  function pad2(value) {
    return String(Number(value || 0)).padStart(2, "0");
  }

  function shuffle(list) {
    for (let i = list.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }

  function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
  }

  function randomPick(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  document.addEventListener("DOMContentLoaded", init);
})();
