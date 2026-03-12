(function () {
  var SUBJECT_ANIMAL_DB = [
    { key: '호랑이', aliases: ['호랑이', '범', '타이거'], energy: '명예와 결단', symbol: '🐯', tarotHints: ['힘', '황제', '전차'] },
    { key: '강아지', aliases: ['강아지', '개', '멍멍이'], energy: '인연과 충성', symbol: '🐶', tarotHints: ['연인', '별', '태양'] },
    { key: '고양이', aliases: ['고양이', '냥이', '캣'], energy: '직감과 경계', symbol: '🐱', tarotHints: ['여사제', '달', '은둔자'] },
    { key: '뱀', aliases: ['뱀', '서펀트'], energy: '지혜와 변환', symbol: '🐍', tarotHints: ['죽음', '절제', '마법사'] },
    { key: '용', aliases: ['용', '드래곤'], energy: '확장과 비상', symbol: '🐉', tarotHints: ['세계', '태양', '마법사'] },
    { key: '늑대', aliases: ['늑대', '울프'], energy: '독립과 본능', symbol: '🐺', tarotHints: ['은둔자', '달', '힘'] },
    { key: '사자', aliases: ['사자', '라이언'], energy: '리더십과 자존', symbol: '🦁', tarotHints: ['힘', '황제', '태양'] },
    { key: '곰', aliases: ['곰', '베어'], energy: '인내와 축적', symbol: '🐻', tarotHints: ['황제', '펜타클 9', '은둔자'] },
    { key: '토끼', aliases: ['토끼', '래빗'], energy: '민감함과 순발', symbol: '🐰', tarotHints: ['별', '완드 8', '바보'] },
    { key: '말', aliases: ['말', '홀스'], energy: '추진과 이동', symbol: '🐴', tarotHints: ['전차', '완드 기사', '완드 8'] },
    { key: '새', aliases: ['새', '새떼', '새장', '버드'], energy: '소식과 관점', symbol: '🐦', tarotHints: ['심판', '별', '소드 에이스'] },
    { key: '물고기', aliases: ['물고기', '피시'], energy: '무의식과 흐름', symbol: '🐟', tarotHints: ['달', '컵 에이스', '절제'] },
    { key: '거북이', aliases: ['거북이', '터틀'], energy: '장기전과 보호', symbol: '🐢', tarotHints: ['세계', '은둔자', '펜타클 기사'] },
    { key: '여우', aliases: ['여우', '폭스'], energy: '전략과 민첩성', symbol: '🦊', tarotHints: ['마법사', '소드 7', '은둔자'] },
    { key: '사슴', aliases: ['사슴', '디어'], energy: '순수와 회복', symbol: '🦌', tarotHints: ['별', '컵 2', '절제'] },
    { key: '코끼리', aliases: ['코끼리', '엘리펀트'], energy: '기억과 책임', symbol: '🐘', tarotHints: ['황제', '교황', '펜타클 10'] },
    { key: '원숭이', aliases: ['원숭이', '몽키'], energy: '재치와 적응', symbol: '🐵', tarotHints: ['바보', '마법사', '완드 페이지'] },
    { key: '까마귀', aliases: ['까마귀', '레이븐'], energy: '경고와 통찰', symbol: '🪶', tarotHints: ['죽음', '탑', '여사제'] },
    { key: '부엉이', aliases: ['부엉이', '올빼미', 'owl'], energy: '지혜와 야간 직관', symbol: '🦉', tarotHints: ['여사제', '은둔자', '정의'] },
    { key: '나비', aliases: ['나비', '버터플라이'], energy: '변화와 재탄생', symbol: '🦋', tarotHints: ['죽음', '세계', '별'] }
  ];

  var SUBJECT_HUMAN_OBJECT_DB = [
    { key: '엄마', aliases: ['엄마', '어머니'], energy: '보호와 수용', symbol: '👩' },
    { key: '아빠', aliases: ['아빠', '아버지'], energy: '기준과 책임', symbol: '👨' },
    { key: '친구', aliases: ['친구', '동료'], energy: '상호 지지', symbol: '🤝' },
    { key: '연인', aliases: ['연인', '남친', '여친'], energy: '관계의 선택', symbol: '💞' },
    { key: '아이', aliases: ['아이', '아기', '어린이'], energy: '순수성과 시작', symbol: '🧒' },
    { key: '열쇠', aliases: ['열쇠', '키'], energy: '해결 단서', symbol: '🗝️' },
    { key: '문', aliases: ['문', '문틈', '문고리'], energy: '경계와 전환', symbol: '🚪' },
    { key: '시계', aliases: ['시계', '초침', '시간'], energy: '타이밍과 압박', symbol: '⏳' },
    { key: '거울', aliases: ['거울', '반사'], energy: '자기 인식', symbol: '🪞' },
    { key: '다리', aliases: ['다리', '브릿지'], energy: '연결과 통과', symbol: '🌉' },
    { key: '길', aliases: ['길', '골목', '도로'], energy: '진로와 방향', symbol: '🛤️' },
    { key: '집', aliases: ['집', '방', '거실'], energy: '안전 기반', symbol: '🏠' },
    { key: '학교', aliases: ['학교', '교실'], energy: '학습 과제', symbol: '🏫' },
    { key: '물', aliases: ['물', '바다', '강', '파도'], energy: '감정 파동', symbol: '🌊' },
    { key: '불', aliases: ['불', '화재', '불꽃'], energy: '긴장과 재점화', symbol: '🔥' }
  ];

  var ACTION_DB = [
    { key: '쫓기다', aliases: ['쫓기다', '도망치다', '도망가다', '추격당하다'], vibe: '회피 패턴', tarotHints: ['달', '소드 9', '탑'], actionItem: '회피 중인 문제를 한 줄로 명명하고 오늘 10분만 직면하세요.' },
    { key: '잡다', aliases: ['잡다', '붙잡다', '쥐다', '획득하다'], vibe: '기회 포착', tarotHints: ['마법사', '완드 에이스', '펜타클 에이스'], actionItem: '지금 잡은 단서를 24시간 안에 작은 결과물로 연결하세요.' },
    { key: '대화하다', aliases: ['대화하다', '말하다', '이야기하다', '소통하다'], vibe: '내적 통합', tarotHints: ['연인', '컵 2', '정의'], actionItem: '감정-사실-요청의 3문장 구조로 대화를 시작하세요.' },
    { key: '숨다', aliases: ['숨다', '숨기다', '피하다'], vibe: '방어 모드', tarotHints: ['은둔자', '달', '소드 4'], actionItem: '잠시 숨는 것은 괜찮지만, 복귀 시간을 미리 정해 불안을 줄이세요.' },
    { key: '달리다', aliases: ['달리다', '질주하다', '뛰다'], vibe: '과속 경향', tarotHints: ['완드 8', '전차', '바보'], actionItem: '속도보다 방향 점검이 우선입니다. 오늘 우선순위 1개만 완수하세요.' },
    { key: '넘어가다', aliases: ['넘어가다', '건너다', '통과하다'], vibe: '장벽 돌파', tarotHints: ['전차', '세계', '완드 6'], actionItem: '넘어야 할 문턱을 세 단계로 쪼개 첫 단계만 즉시 실행하세요.' },
    { key: '떨어지다', aliases: ['떨어지다', '추락하다'], vibe: '통제 상실 감각', tarotHints: ['탑', '달', '매달린 사람'], actionItem: '완벽주의를 낮추고 안전장치 1개를 먼저 확보하세요.' },
    { key: '날다', aliases: ['날다', '비행하다', '떠오르다'], vibe: '확장 욕구', tarotHints: ['세계', '태양', '바보'], actionItem: '확장 계획을 숫자 목표 1개로 구체화하세요.' },
    { key: '찾다', aliases: ['찾다', '수색하다', '탐색하다'], vibe: '해결 탐색', tarotHints: ['별', '은둔자', '소드 에이스'], actionItem: '해결 후보 3개를 적고 즉시 시도 가능한 1개부터 실행하세요.' },
    { key: '울다', aliases: ['울다', '눈물', '오열하다'], vibe: '감정 배출', tarotHints: ['컵 5', '절제', '별'], actionItem: '감정을 억누르지 말고 글로 배출한 뒤 회복 루틴을 시작하세요.' },
    { key: '웃다', aliases: ['웃다', '미소', '즐거워하다'], vibe: '회복 신호', tarotHints: ['태양', '컵 10', '별'], actionItem: '좋았던 장면을 기록해 재현 가능한 습관으로 고정하세요.' },
    { key: '먹다', aliases: ['먹다', '먹이다', '삼키다'], vibe: '결핍 보충', tarotHints: ['여황제', '컵 에이스', '절제'], actionItem: '신체 리듬을 먼저 회복하면 심리 판단 정확도가 올라갑니다.' },
    { key: '싸우다', aliases: ['싸우다', '다투다', '충돌하다'], vibe: '경계 충돌', tarotHints: ['정의', '힘', '완드 5'], actionItem: '감정 과열 구간에서는 사실 확인 후 대응 시간을 늦추세요.' },
    { key: '도와주다', aliases: ['도와주다', '구하다', '보호하다'], vibe: '책임 활성화', tarotHints: ['여황제', '교황', '완드 6'], actionItem: '도움의 경계를 정해 소진을 방지하면서 지속 가능하게 유지하세요.' },
    { key: '잃다', aliases: ['잃다', '분실하다', '놓치다'], vibe: '상실 인식', tarotHints: ['컵 5', '죽음', '은둔자'], actionItem: '잃은 것과 남은 것을 분리 기록하면 복구 경로가 선명해집니다.' },
    { key: '만나다', aliases: ['만나다', '조우하다', '마주치다'], vibe: '관계 전환', tarotHints: ['연인', '운명의 수레바퀴', '컵 2'], actionItem: '첫 인상보다 합의 가능한 행동 규칙을 먼저 맞추세요.' }
  ];

  var EMOTION_DB = [
    { key: '불안', aliases: ['불안', '초조', '긴장'], tone: '리스크 과대지각', tarotHints: ['달', '소드 9', '절제'], comfort: '불안은 결말이 아니라 경고음입니다. 사실 3가지를 확인하면 시야가 안정됩니다.' },
    { key: '무서움', aliases: ['무섭다', '두렵다', '공포'], tone: '위협 민감 상태', tarotHints: ['힘', '달', '탑'], comfort: '두려움은 생존 본능입니다. 작은 통제 행동이 마음을 빠르게 회복시킵니다.' },
    { key: '슬픔', aliases: ['슬프다', '우울', '허무'], tone: '상실 처리 단계', tarotHints: ['컵 5', '별', '절제'], comfort: '슬픔은 정리의 문입니다. 남아 있는 자원을 확인하면 다시 움직일 힘이 생깁니다.' },
    { key: '기쁨', aliases: ['기쁘다', '행복', '즐겁다'], tone: '확장 가능 상태', tarotHints: ['태양', '컵 10', '세계'], comfort: '좋은 감정은 추진 연료입니다. 오늘의 성취를 기록해 흐름을 확장하세요.' },
    { key: '분노', aliases: ['화나다', '분노', '짜증'], tone: '경계 회복 요구', tarotHints: ['정의', '힘', '완드 5'], comfort: '분노는 경계가 무너졌다는 신호입니다. 요구사항을 문장으로 분명히 하세요.' },
    { key: '답답함', aliases: ['답답하다', '막막', '숨막힘'], tone: '시야 정체 상태', tarotHints: ['매달린 사람', '은둔자', '소드 8'], comfort: '멈춤은 패배가 아닙니다. 관점을 바꾸면 출구가 보입니다.' },
    { key: '죄책감', aliases: ['미안', '죄책감', '후회'], tone: '자기 비난 루프', tarotHints: ['심판', '정의', '절제'], comfort: '후회는 교정의 재료입니다. 자기 처벌보다 다음 행동을 선택하세요.' },
    { key: '안도', aliases: ['안심', '안도', '편안'], tone: '회복 착지 단계', tarotHints: ['절제', '별', '컵 6'], comfort: '안도는 회복의 증거입니다. 안정 루틴을 계속 유지하면 반등이 빨라집니다.' },
    { key: '외로움', aliases: ['외롭다', '고독', '쓸쓸'], tone: '연결 결핍 신호', tarotHints: ['은둔자', '컵 5', '컵 2'], comfort: '고독은 연결 필요 신호입니다. 안전한 대화 1개를 시도해 균형을 맞추세요.' },
    { key: '설렘', aliases: ['설레다', '기대', '흥분'], tone: '새 출발 가속', tarotHints: ['바보', '완드 에이스', '태양'], comfort: '설렘은 출발 에너지입니다. 실행 가능한 첫 단계를 오늘 확정하세요.' }
  ];

  var FALLBACK_CARDS = [
    { id: 'ar17', name_kr: '별', name: 'The Star' },
    { id: 'ar01', name_kr: '마법사', name: 'The Magician' },
    { id: 'ar08', name_kr: '힘', name: 'Strength' }
  ];

  function safeText(text) {
    return String(text || '').replace(/\s+/g, ' ').trim();
  }

  function includesAny(text, aliases) {
    for (var i = 0; i < aliases.length; i += 1) {
      if (text.indexOf(aliases[i]) >= 0) return true;
    }
    return false;
  }

  function scoreEntry(text, aliases) {
    var score = 0;
    for (var i = 0; i < aliases.length; i += 1) {
      if (text.indexOf(aliases[i]) >= 0) {
        score += 1;
        if (aliases[i].length >= 3) score += 1;
      }
    }
    return score;
  }

  function topEntry(text, db) {
    var best = null;
    for (var i = 0; i < db.length; i += 1) {
      var s = scoreEntry(text, db[i].aliases);
      if (s > 0 && (!best || s > best.score)) {
        best = { entry: db[i], score: s };
      }
    }
    return best ? best.entry : null;
  }

  function classifyInput(text) {
    var t = safeText(text);

    var subjectAnimal = topEntry(t, SUBJECT_ANIMAL_DB);
    var subjectEtc = topEntry(t, SUBJECT_HUMAN_OBJECT_DB);
    var action = topEntry(t, ACTION_DB);
    var emotion = topEntry(t, EMOTION_DB);

    var subject = subjectAnimal || subjectEtc || {
      key: '낯선 존재',
      aliases: ['낯선 존재'],
      energy: '미정의 가능성',
      symbol: '🧭',
      tarotHints: ['여사제', '은둔자', '별']
    };

    if (!action) {
      action = {
        key: '찾다',
        vibe: '해결 탐색',
        tarotHints: ['별', '소드 에이스', '은둔자'],
        actionItem: '핵심 문제를 1문장으로 정의하고 가장 작은 행동부터 시작하세요.'
      };
    }

    if (!emotion) {
      emotion = {
        key: '불안',
        tone: '리스크 과대지각',
        tarotHints: ['달', '절제', '별'],
        comfort: '감정 파동은 지나갑니다. 지금 할 수 있는 가장 작은 통제 행동에 집중하세요.'
      };
    }

    return {
      subject: subject,
      action: action,
      emotion: emotion
    };
  }

  function getDeck() {
    if (Array.isArray(window.TAROT_DATA) && window.TAROT_DATA.length) return window.TAROT_DATA;
    return FALLBACK_CARDS;
  }

  function pickCardByHints(deck, hints, used, fallbackIndex) {
    for (var h = 0; h < hints.length; h += 1) {
      for (var i = 0; i < deck.length; i += 1) {
        var c = deck[i];
        var id = c.id || c.name_kr || c.name;
        if (used[id]) continue;
        var nm = String(c.name_kr || '') + ' ' + String(c.name || '');
        if (nm.indexOf(hints[h]) >= 0) {
          used[id] = true;
          return c;
        }
      }
    }

    for (var j = 0; j < deck.length; j += 1) {
      var c2 = deck[j];
      var id2 = c2.id || c2.name_kr || c2.name;
      if (!used[id2]) {
        used[id2] = true;
        return c2;
      }
    }

    return FALLBACK_CARDS[fallbackIndex];
  }

  function tarotImageUrl(card) {
    if (!card || !card.short) return '';
    var ext = card.short === 'TheLovers' ? '.jpg' : '.jpeg';
    return 'https://raw.githubusercontent.com/krates98/tarotcardapi/main/images/' + card.short + ext;
  }

  function randomStory(a, b, c) {
    var variants = [
      '"' + a + '"의 본능이 "' + b + '"의 태도와 만나 "' + c + '"을(를) 성장의 연료로 바꾸는 흐름이 감지됩니다.',
      '이번 꿈은 "' + a + '"이라는 상징, "' + b + '"라는 선택, "' + c + '"의 감정이 결합되어 두려운 대상을 내 편으로 만드는 지혜를 보여줍니다.',
      '세 키워드의 화학 반응이 분명합니다. "' + a + '"이 건넨 힌트와 "' + b + '"의 실행, "' + c + '"의 감정 조절이 현실 전환점을 만듭니다.'
    ];
    return variants[Math.floor(Math.random() * variants.length)];
  }

  function luckMultiplier(subject, action, emotion) {
    var base = 58;
    if (subject.scoreBoost) base += subject.scoreBoost;
    if (/기회|돌파|확장|가속|통합/.test(action.vibe || '')) base += 12;
    if (/회복|안도|기쁨|설렘|확장/.test(emotion.tone || '')) base += 10;
    if (/과대지각|정체|비난/.test(emotion.tone || '')) base -= 4;
    var jitter = Math.floor(Math.random() * 14);
    return Math.max(55, Math.min(94, base + jitter));
  }

  function interpretDream(inputText) {
    var clean = safeText(inputText);
    if (!clean || clean.length < 4) {
      throw new Error('누가(또는 무엇이) 어떤 행동을 했고, 그래서 어떤 감정을 느꼈는지 서술해주세요.');
    }

    var parsed = classifyInput(clean);
    var deck = getDeck();
    var used = {};

    var rootCard = pickCardByHints(deck, parsed.subject.tarotHints || ['힘', '연인', '황제'], used, 0);
    var messageCard = pickCardByHints(deck, parsed.action.tarotHints || ['마법사', '전차', '별'], used, 1);
    var guidanceCard = pickCardByHints(deck, parsed.emotion.tarotHints || ['절제', '별', '힘'], used, 2);

    var rootName = rootCard.name_kr || rootCard.name || '루트 아르카나';
    var messageName = messageCard.name_kr || messageCard.name || '메시지 아르카나';
    var guidanceName = guidanceCard.name_kr || guidanceCard.name || '가이던스 아르카나';

    var chemistry = randomStory(parsed.subject.key, parsed.action.key, parsed.emotion.key);

    var step1 = {
      step: 1,
      title: '🛡️ 아르카나 루트 진단 (원형 에너지)',
      card_id: rootCard.id || 'root-card',
      card_name: rootCard.name_kr || rootCard.name || '카드',
      meaning: '루트 카드 <' + rootName + '>는 "' + parsed.subject.key + '" 상징이 지닌 ' + (parsed.subject.energy || '핵심 본능') + '을 전면화합니다. 이는 단순 감정 반응이 아니라 무의식이 보내는 핵심 생존 전략 신호입니다. ' + chemistry + ' 아르카나 관점에서 현재 국면의 1차 과제는 감정 파동을 억누르는 것이 아니라 패턴을 명명해 질서로 전환하는 것입니다.',
      warning_or_healing: '전문 해석 포인트: 회피 대상을 구조화(대상·원인·대응 3분할)하면 관계와 선택의 주도권이 빠르게 회복됩니다.'
    };

    var step2 = {
      step: 2,
      title: '📌 아르카나 메시지 판독 (행동 프로토콜)',
      card_id: messageCard.id || 'message-card',
      card_name: messageCard.name_kr || messageCard.name || '카드',
      meaning: '메시지 카드 <' + messageName + '>는 "' + parsed.action.key + '" 행동이 현재 ' + parsed.action.vibe + ' 단계에 있음을 확인합니다. 이 조합은 운세가 막힌 것이 아니라, 실행 순서가 미세하게 어긋났음을 시사합니다. 즉흥 반응보다 의식적 루틴(관찰→선택→행동)으로 전환할 때 체감 운세가 상승합니다.',
      action_item: parsed.action.actionItem
    };

    var step3 = {
      step: 3,
      title: '⏳ 아르카나 가이던스 (심리 통합)',
      card_id: guidanceCard.id || 'guidance-card',
      card_name: guidanceCard.name_kr || guidanceCard.name || '카드',
      meaning: '가이던스 카드 <' + guidanceName + '>는 "' + parsed.emotion.key + '" 감정을 ' + parsed.emotion.tone + ' 신호로 재해석합니다. 이 감정은 실패의 증거가 아니라 조정 시점을 알려주는 알림이며, 심리 에너지가 새 방향으로 재배치되는 전환기 징후입니다.',
      final_comfort: parsed.emotion.comfort
    };

    var luck = luckMultiplier(parsed.subject, parsed.action, parsed.emotion);

    var payload = {
      wizard_greeting: '여행자여, 세 장의 아르카나가 당신의 무의식 지도 위에 정렬되었습니다.',
      analysis: {
        extracted_keywords: [parsed.subject.key, parsed.action.key, parsed.emotion.key],
        steps: [step1, step2, step3]
      },
      luck_multiplier: String(luck) + '%'
    };

    var cards = [
      {
        step: 'Root',
        keyword: parsed.subject.key,
        card_id: step1.card_id,
        card_name: step1.card_name,
        card_short: rootCard.short || '',
        tarot_image_url: tarotImageUrl(rootCard),
        symbol: parsed.subject.symbol || '🛡️',
        image_description: '주체 상징 "' + parsed.subject.key + '"의 에너지 일러스트',
        energy_keyword: parsed.subject.energy || '핵심 본능',
        interpretation: step1.meaning,
        focus: 'Healing: ' + step1.warning_or_healing
      },
      {
        step: 'Message',
        keyword: parsed.action.key,
        card_id: step2.card_id,
        card_name: step2.card_name,
        card_short: messageCard.short || '',
        tarot_image_url: tarotImageUrl(messageCard),
        symbol: '📌',
        image_description: '행동 상징 "' + parsed.action.key + '"의 흐름 일러스트',
        energy_keyword: parsed.action.vibe,
        interpretation: step2.meaning,
        focus: 'Action: ' + step2.action_item
      },
      {
        step: 'Guidance',
        keyword: parsed.emotion.key,
        card_id: step3.card_id,
        card_name: step3.card_name,
        card_short: guidanceCard.short || '',
        tarot_image_url: tarotImageUrl(guidanceCard),
        symbol: '⏳',
        image_description: '심리 상징 "' + parsed.emotion.key + '"의 안정화 일러스트',
        energy_keyword: parsed.emotion.tone,
        interpretation: step3.meaning,
        focus: 'Comfort: ' + step3.final_comfort
      }
    ];

    return {
      title: '무의식의 서고 마스터 리포트',
      summary: payload.wizard_greeting + ' 루트<' + rootName + '> · 메시지<' + messageName + '> · 가이던스<' + guidanceName + '>의 배열은 "' + parsed.subject.key + ' → ' + parsed.action.key + ' → ' + parsed.emotion.key + '" 흐름을 하나의 운행 프로토콜로 통합하라고 지시합니다. ' + chemistry,
      scene: step1.meaning + ' ' + step1.warning_or_healing,
      symbol: step2.meaning + ' ' + step2.action_item,
      echo: step3.meaning + ' ' + step3.final_comfort,
      cards: cards,
      keywords: payload.analysis.extracted_keywords,
      finalSpell: '오늘의 주문: 나는 아르카나의 신호를 해독하고, 감정을 질서로, 선택을 운의 궤도로 정렬한다.',
      json: payload,
      jsonReport: JSON.stringify(payload, null, 2),
      classifiedInput: {
        subject: parsed.subject.key,
        action: parsed.action.key,
        emotion: parsed.emotion.key
      }
    };
  }

  window.DreamLedgerAI = {
    interpretDream: interpretDream
  };
})();
