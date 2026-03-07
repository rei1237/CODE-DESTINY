/* ================================================================
   fortune-engine.js  |  연이의 꿀꿀 만세력 SEO 운세 엔진
   - 12띠 / 12별자리 / 오늘·내일·주간·월간 운세 자동 생성
   - 날짜 시드 기반 결정론적 콘텐츠 (같은 날 = 같은 내용)
   - 브라우저에서 직접 실행, 백엔드 불필요
================================================================ */
(function(root) {
  'use strict';

  /* ── 12띠 데이터 ── */
  var ANIMALS = [
    { id:'rat',     ko:'쥐띠',    emoji:'🐭', years:[1960,1972,1984,1996,2008,2020], element:'水', earthly:'자(子)', keyword:'영리함·재치' },
    { id:'ox',      ko:'소띠',    emoji:'🐂', years:[1961,1973,1985,1997,2009,2021], element:'土', earthly:'축(丑)', keyword:'성실함·인내' },
    { id:'tiger',   ko:'호랑이띠',emoji:'🐯', years:[1962,1974,1986,1998,2010,2022], element:'木', earthly:'인(寅)', keyword:'용맹함·리더십' },
    { id:'rabbit',  ko:'토끼띠',  emoji:'🐰', years:[1963,1975,1987,1999,2011,2023], element:'木', earthly:'묘(卯)', keyword:'온유함·예술감각' },
    { id:'dragon',  ko:'용띠',    emoji:'🐲', years:[1964,1976,1988,2000,2012,2024], element:'土', earthly:'진(辰)', keyword:'카리스마·야망' },
    { id:'snake',   ko:'뱀띠',    emoji:'🐍', years:[1965,1977,1989,2001,2013,2025], element:'火', earthly:'사(巳)', keyword:'지혜·직관' },
    { id:'horse',   ko:'말띠',    emoji:'🐴', years:[1966,1978,1990,2002,2014,2026], element:'火', earthly:'오(午)', keyword:'자유로움·열정' },
    { id:'goat',    ko:'양띠',    emoji:'🐑', years:[1967,1979,1991,2003,2015,2027], element:'土', earthly:'미(未)', keyword:'온화함·배려' },
    { id:'monkey',  ko:'원숭이띠',emoji:'🐵', years:[1968,1980,1992,2004,2016,2028], element:'金', earthly:'신(申)', keyword:'재치·적응력' },
    { id:'rooster', ko:'닭띠',    emoji:'🐓', years:[1969,1981,1993,2005,2017,2029], element:'金', earthly:'유(酉)', keyword:'완벽주의·자신감' },
    { id:'dog',     ko:'개띠',    emoji:'🐶', years:[1970,1982,1994,2006,2018,2030], element:'土', earthly:'술(戌)', keyword:'충직함·정의감' },
    { id:'pig',     ko:'돼지띠',  emoji:'🐷', years:[1971,1983,1995,2007,2019,2031], element:'水', earthly:'해(亥)', keyword:'복덕·순수함' }
  ];

  /* ── 12별자리 데이터 ── */
  var SIGNS = [
    { id:'aries',       ko:'양자리',     emoji:'♈', period:'3/21~4/19',  planet:'화성',   element:'불', keyword:'개척정신·열정' },
    { id:'taurus',      ko:'황소자리',   emoji:'♉', period:'4/20~5/20',  planet:'금성',   element:'흙', keyword:'안정·감각미' },
    { id:'gemini',      ko:'쌍둥이자리', emoji:'♊', period:'5/21~6/21',  planet:'수성',   element:'공기', keyword:'소통·다재다능' },
    { id:'cancer',      ko:'게자리',     emoji:'♋', period:'6/22~7/22',  planet:'달',     element:'물', keyword:'직관·모성애' },
    { id:'leo',         ko:'사자자리',   emoji:'♌', period:'7/23~8/22',  planet:'태양',   element:'불', keyword:'카리스마·창의' },
    { id:'virgo',       ko:'처녀자리',   emoji:'♍', period:'8/23~9/22',  planet:'수성',   element:'흙', keyword:'분석력·완벽주의' },
    { id:'libra',       ko:'천칭자리',   emoji:'♎', period:'9/23~10/23', planet:'금성',   element:'공기', keyword:'균형·아름다움' },
    { id:'scorpio',     ko:'전갈자리',   emoji:'♏', period:'10/24~11/22',planet:'명왕성', element:'물', keyword:'집중력·변혁' },
    { id:'sagittarius', ko:'사수자리',   emoji:'♐', period:'11/23~12/21',planet:'목성',   element:'불', keyword:'모험·철학' },
    { id:'capricorn',   ko:'염소자리',   emoji:'♑', period:'12/22~1/19', planet:'토성',   element:'흙', keyword:'야망·책임감' },
    { id:'aquarius',    ko:'물병자리',   emoji:'♒', period:'1/20~2/18',  planet:'천왕성', element:'공기', keyword:'독창성·인류애' },
    { id:'pisces',      ko:'물고기자리', emoji:'♓', period:'2/19~3/20',  planet:'해왕성', element:'물', keyword:'공감·영성' }
  ];

  /* ── 시간대 설정 ── */
  var PERIODS = [
    { id:'today',    ko:'오늘의',  label:'오늘의 운세' },
    { id:'tomorrow', ko:'내일의',  label:'내일의 운세' },
    { id:'weekly',   ko:'이번 주', label:'주간 운세' },
    { id:'monthly',  ko:'이달의',  label:'월간 운세' }
  ];

  /* ── 행운 색상 풀 ── */
  var LUCKY_COLORS = ['빨간색','주황색','노란색','초록색','파란색','하늘색','보라색','분홍색','흰색','금색','은색','갈색','옥색','자주색','연두색','남색','코랄','민트','라벤더','카키'];

  /* ── 결정론적 시드 난수 (Mulberry32) ── */
  function mulberry32(a) {
    return function() {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function makeSeed(dateStr, id, periodId) {
    var s = dateStr + id + periodId;
    var h = 0x811c9dc5;
    for (var i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return h;
  }

  function pickRand(rand, arr) {
    return arr[Math.floor(rand() * arr.length)];
  }

  function randInt(rand, min, max) {
    return min + Math.floor(rand() * (max - min + 1));
  }

  /* ── 운세 텍스트 풀 (카테고리별 다양한 문장) ── */
  var TEXTS = {
    total: [
      '오늘은 새로운 시작을 위한 에너지가 충만한 날입니다. 주변의 기운이 당신을 응원하고 있으니 자신감을 갖고 도전해 보세요.',
      '막혔던 일이 서서히 풀리기 시작하는 기운이 감지됩니다. 인내심을 발휘하면 좋은 결과로 이어질 것입니다.',
      '오늘은 직감을 믿는 것이 중요합니다. 논리보다 마음이 이끄는 방향을 따라가면 예상치 못한 행운이 찾아옵니다.',
      '대인관계에서 성과를 거두기 좋은 날입니다. 솔직하고 진심 어린 태도가 상대방의 마음을 움직일 것입니다.',
      '꼼꼼한 준비가 빛을 발하는 날입니다. 서두르지 말고 단계적으로 접근하면 원하는 결과에 가까워집니다.',
      '오늘은 약간의 긴장감이 감돌지만, 이는 성장을 위한 자극이 됩니다. 집중력을 유지하며 하나씩 처리하세요.',
      '뜻밖의 인연이나 기회가 찾아올 수 있습니다. 열린 마음으로 주변을 살피면 소중한 인연을 만날 수 있어요.',
      '안정적이고 차분한 하루가 예상됩니다. 오늘은 큰 변화보다 현재의 것을 다지는 데 집중하는 것이 유리합니다.',
      '창의적인 아이디어가 샘솟는 날입니다. 평소 미뤄뒀던 창작 활동이나 기획에 도전해 보세요.',
      '도움을 줄 수 있는 기회가 주어집니다. 너그러운 마음으로 주변을 품어주면 그 기운이 배가 되어 돌아옵니다.',
      '순탄한 흐름 속에서도 사소한 방심은 금물입니다. 작은 부분까지 신경 쓰는 세심함이 성공을 완성시킵니다.',
      '변화와 혁신의 기운이 흐르고 있습니다. 틀에 박힌 방식보다 새로운 접근법을 시도해 보세요.'
    ],
    love: [
      '연인이 있다면 상대방의 작은 목소리에 귀 기울여 주세요. 공감과 경청이 관계를 더욱 단단하게 만들어 줍니다.',
      '솔로라면 우연한 만남이 새로운 인연으로 발전할 수 있는 날입니다. 자연스러운 모습을 보여주세요.',
      '애정운이 활발하게 움직이고 있습니다. 마음속 감정을 솔직하게 표현하면 상대방이 더욱 가까워집니다.',
      '서로에 대한 이해와 배려가 풍성한 날입니다. 오늘은 함께하는 시간을 소중하게 여겨보세요.',
      '작은 오해가 쌓이지 않도록 주의하세요. 의사소통을 명확히 하는 것이 관계 유지의 핵심입니다.',
      '이성적 매력이 돋보이는 날입니다. 자신다운 모습이 상대의 마음을 끌어당기는 자석이 됩니다.',
      '기다리던 소식이 들려올 수 있습니다. 조급해하지 말고 자연스러운 흐름에 맡겨보세요.',
      '과거의 감정에 얽매이기보다 현재에 충실한 것이 좋습니다. 새로운 가능성에 마음을 열어보세요.',
      '특별한 이벤트나 깜짝 선물로 상대방을 기쁘게 할 수 있습니다. 작은 정성이 큰 감동이 됩니다.',
      '혼자 있는 시간이 자신을 성장시키는 기회가 됩니다. 내면을 충만히 채운 뒤 인연을 만나면 더욱 빛납니다.',
      '연인 사이라면 미래에 대한 真실한 대화가 관계를 한 단계 성장시킵니다.',
      '매력이 자연스럽게 발산되는 날입니다. 특별히 노력하지 않아도 상대방의 시선을 끌 수 있어요.'
    ],
    money: [
      '수입과 지출의 균형을 잘 맞추는 것이 중요한 날입니다. 충동적인 소비는 자제하고 계획적으로 관리하세요.',
      '뜻밖의 소득이나 이익이 들어올 징조가 보입니다. 새로운 재물이 흘러들어오는 통로가 열리고 있어요.',
      '투자나 저축을 시작하기에 좋은 타이밍입니다. 장기적인 안목으로 재정 계획을 세워보세요.',
      '지출이 예상보다 늘어날 수 있으니 미리 예산을 확인하세요. 불필요한 비용 최소화가 관건입니다.',
      '재물운이 안정적으로 흐르고 있습니다. 무리한 도전보다는 현재 상황을 내실 있게 다지는 것이 현명합니다.',
      '인맥을 통한 금전 기회가 열릴 수 있습니다. 비즈니스 모임이나 네트워킹에 적극 참여해 보세요.',
      '소비보다 저축이 재물운을 키우는 지름길입니다. 절제하는 오늘이 풍요로운 내일을 만듭니다.',
      '현재의 재정 상태를 점검하기 좋은 날입니다. 작은 낭비 요소를 찾아 제거하는 것이 목돈으로 이어집니다.',
      '창의적인 방식으로 수익을 창출할 기회가 보입니다. 부업이나 새로운 수입원을 모색해 보세요.',
      '주변 사람의 재정 조언이 도움이 됩니다. 신뢰할 수 있는 사람과 정보를 나눠보세요.'
    ],
    health: [
      '충분한 수분 섭취와 규칙적인 식사가 건강을 지키는 기본입니다. 스트레칭으로 몸의 긴장을 풀어주세요.',
      '소화 기능에 주의가 필요한 날입니다. 자극적인 음식을 피하고 소화에 좋은 을식을 선택하세요.',
      '과로를 주의해야 합니다. 일과 휴식의 균형을 잘 맞추어야 장기적인 건강을 유지할 수 있습니다.',
      '가벼운 운동이나 산책이 기운을 북돋아 줄 것입니다. 자연 속에서의 활동이 특히 효과적입니다.',
      '정신 건강 관리가 중요한 날입니다. 명상이나 호흡 훈련으로 마음의 안정을 찾아보세요.',
      '눈과 목의 피로 관리에 신경 쓰세요. 스크린 시간을 줄이고 충분한 휴식을 취하는 것이 좋습니다.',
      '전반적인 컨디션이 양호합니다. 꾸준한 운동 습관을 유지하면 더욱 좋은 상태를 이어갈 수 있어요.',
      '잠이 보약입니다. 오늘은 일찍 잠자리에 들어 숙면을 취하는 것이 내일의 활력이 됩니다.',
      '면역력 강화에 좋은 음식을 섭취하세요. 과일과 채소를 충분히 먹으면 활력이 넘칩니다.',
      '허리와 어깨 건강에 주의가 필요합니다. 올바른 자세를 유지하고 중간중간 스트레칭을 해주세요.',
      '에너지 레벨이 높아 활기찬 하루가 예상됩니다. 이 기운을 활용해 운동이나 활동적인 취미를 즐겨보세요.',
      '무리하면 피로가 쌓일 수 있습니다. 오늘만큼은 자신을 위한 여유 시간을 갖고 충전하세요.'
    ],
    advice: [
      '긍정적인 마음가짐이 모든 것을 바꿉니다. "할 수 있다"고 믿는 순간 길이 열립니다.',
      '작은 일에 흔들리지 마세요. 큰 그림을 보며 천천히 나아가면 반드시 목표에 도달합니다.',
      '오늘 하루의 감사할 일 세 가지를 적어보세요. 감사함이 쌓일수록 더 많은 행운이 찾아옵니다.',
      '모든 것을 혼자 해결하려 하지 마세요. 도움을 요청하는 용기가 때로는 가장 현명한 선택입니다.',
      '과거에 대한 후회보다 미래의 가능성에 집중해 보세요. 지금 이 순간이 가장 젊은 날입니다.',
      '자신에게 친절해지세요. 스스로를 격려하고 칭찬하는 습관이 자존감을 높여줍니다.',
      '새로운 것을 배우는 데 두려워하지 마세요. 한 걸음씩 나아가는 것이 큰 성과를 만들어냅니다.',
      '인내는 모든 성공의 어머니입니다. 지금 힘들더라도 포기하지 않으면 반드시 빛이 들어옵니다.',
      '진심으로 대하는 인간관계가 삶을 풍요롭게 합니다. 오늘은 소중한 사람에게 연락해 보세요.',
      '완벽함보다 꾸준함이 더 중요합니다. 매일 조금씩 쌓아가는 노력이 기적을 만들어냅니다.',
      '결과에 집착하기보다 과정을 즐기는 마인드가 진정한 행복을 가져다줍니다.',
      '다름을 인정하는 태도가 관계의 폭을 넓힙니다. 상대방의 입장에서 한번 생각해보세요.'
    ]
  };

  /* ── 날짜 문자열 생성 ── */
  function getDateStr(offsetDays) {
    var d = new Date();
    d.setDate(d.getDate() + (offsetDays || 0));
    return d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate();
  }

  function getWeekStr() {
    var d = new Date();
    var day = d.getDay();
    var monday = new Date(d);
    monday.setDate(d.getDate() - (day === 0 ? 6 : day - 1));
    return monday.getFullYear() + '-W' + monday.getDate();
  }

  function getMonthStr() {
    var d = new Date();
    return d.getFullYear() + '-' + (d.getMonth()+1);
  }

  /* ── 운세 생성 코어 ── */
  function generateFortune(entityId, periodId) {
    var dateStr;
    if (periodId === 'today')    dateStr = getDateStr(0);
    else if (periodId === 'tomorrow') dateStr = getDateStr(1);
    else if (periodId === 'weekly')   dateStr = getWeekStr();
    else                              dateStr = getMonthStr();

    var seed = makeSeed(dateStr, entityId, periodId);
    var rand = mulberry32(seed);

    var score = function(base) { return Math.min(100, Math.max(30, base + randInt(rand, -15, 15))); };

    var totalScore   = score(65);
    var loveScore    = score(60);
    var moneyScore   = score(60);
    var healthScore  = score(65);
    var luckyNum     = randInt(rand, 1, 45);
    var luckyNum2    = randInt(rand, 1, 45);
    while (luckyNum2 === luckyNum) luckyNum2 = randInt(rand, 1, 45);
    var luckyColor   = pickRand(rand, LUCKY_COLORS);

    return {
      total:   { score: totalScore,  text: pickRand(rand, TEXTS.total) },
      love:    { score: loveScore,   text: pickRand(rand, TEXTS.love) },
      money:   { score: moneyScore,  text: pickRand(rand, TEXTS.money) },
      health:  { score: healthScore, text: pickRand(rand, TEXTS.health) },
      advice:  pickRand(rand, TEXTS.advice),
      luckyNumber: luckyNum + ', ' + luckyNum2,
      luckyColor:  luckyColor,
      dateStr: dateStr
    };
  }

  /* ── 점수를 별 등급으로 변환 ── */
  function scoreToStars(s) {
    if (s >= 85) return { grade:'최고운', stars:'★★★★★', color:'#FFD700' };
    if (s >= 70) return { grade:'좋은운',  stars:'★★★★☆', color:'#FFA500' };
    if (s >= 55) return { grade:'평범운',  stars:'★★★☆☆', color:'#A0A0A0' };
    if (s >= 40) return { grade:'주의운',  stars:'★★☆☆☆', color:'#E87070' };
    return          { grade:'조심운',  stars:'★☆☆☆☆', color:'#CC3333' };
  }

  /* ── 페이지 렌더 ── */
  function renderPage(config) {
    var type       = config.type;     // 'animal' | 'sign'
    var entityId   = config.id;
    var periodId   = config.period;   // 'today' | 'tomorrow' | 'weekly' | 'monthly'

    var entity = null;
    if (type === 'animal') {
      for (var a = 0; a < ANIMALS.length; a++) {
        if (ANIMALS[a].id === entityId) { entity = ANIMALS[a]; break; }
      }
    } else {
      for (var s = 0; s < SIGNS.length; s++) {
        if (SIGNS[s].id === entityId) { entity = SIGNS[s]; break; }
      }
    }
    if (!entity) { document.getElementById('fortuneApp').innerHTML = '<p style="text-align:center;padding:40px;color:#fff">페이지를 찾을 수 없습니다.</p>'; return; }

    var period = null;
    for (var p = 0; p < PERIODS.length; p++) {
      if (PERIODS[p].id === periodId) { period = PERIODS[p]; break; }
    }
    if (!period) period = PERIODS[0];

    var ft = generateFortune(entityId, periodId);
    var totalStar  = scoreToStars(ft.total.score);
    var loveStar   = scoreToStars(ft.love.score);
    var moneyStar  = scoreToStars(ft.money.score);
    var healthStar = scoreToStars(ft.health.score);

    var entityName = entity.ko;
    var pageTitle  = period.ko + ' ' + entityName + ' 운세 | 연이의 꿀꿀 만세력';
    var metaDesc   = '오늘 ' + entityName + ' 총운 ' + ft.total.score + '점. ' + ft.total.text.slice(0, 60) + '...';

    /* SEO meta 동적 업데이트 */
    document.title = pageTitle;
    var dm = document.getElementById('metaDesc');
    if (dm) dm.setAttribute('content', metaDesc);
    var tc = document.getElementById('metaOg');
    if (tc) tc.setAttribute('content', pageTitle);

    /* JSON-LD 구조화 데이터 */
    var today = new Date().toISOString().split('T')[0];
    var jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Article',
          'headline': period.ko + ' ' + entityName + ' 운세',
          'description': metaDesc,
          'datePublished': today,
          'dateModified': today,
          'author': { '@type': 'Organization', 'name': '연이의 꿀꿀 만세력' },
          'publisher': {
            '@type': 'Organization',
            'name': '연이의 꿀꿀 만세력',
            'url': 'https://code-destiny.com'
          },
          'mainEntityOfPage': { '@type': 'WebPage', '@id': window.location.href }
        },
        {
          '@type': 'FAQPage',
          'mainEntity': [
            {
              '@type': 'Question',
              'name': '오늘 ' + entityName + ' 총운은 어떤가요?',
              'acceptedAnswer': { '@type': 'Answer', 'text': ft.total.text }
            },
            {
              '@type': 'Question',
              'name': '오늘 ' + entityName + ' 행운 숫자와 행운 색은?',
              'acceptedAnswer': { '@type': 'Answer', 'text': '행운 숫자: ' + ft.luckyNumber + ', 행운 색: ' + ft.luckyColor }
            }
          ]
        },
        {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': '홈', 'item': 'https://code-destiny.com/' },
            { '@type': 'ListItem', 'position': 2, 'name': '운세', 'item': 'https://code-destiny.com/fortune/' },
            { '@type': 'ListItem', 'position': 3, 'name': period.label, 'item': 'https://code-destiny.com/fortune/' + periodId + '/' },
            { '@type': 'ListItem', 'position': 4, 'name': entityName, 'item': window.location.href }
          ]
        }
      ]
    };
    var ldEl = document.getElementById('jsonLd');
    if (ldEl) ldEl.textContent = JSON.stringify(jsonLd);

    /* ── 다른 개체 내부 링크 생성 ── */
    var otherLinks = '';
    var list = (type === 'animal') ? ANIMALS : SIGNS;
    for (var k = 0; k < list.length; k++) {
      if (list[k].id !== entityId) {
        otherLinks += '<a class="fe-link-chip" href="/fortune/' + periodId + '/' + list[k].id + '.html">' + list[k].emoji + ' ' + list[k].ko + '</a>';
      }
    }

    /* ── HTML 조립 ── */
    var html = [
      '<nav class="fe-breadcrumb" aria-label="breadcrumb">',
      '  <a href="/">🏠 홈</a> <span>›</span> <a href="/fortune/">운세</a> <span>›</span> <a href="/fortune/' + periodId + '/">' + period.label + '</a> <span>›</span> <span>' + entityName + '</span>',
      '</nav>',

      '<header class="fe-header">',
      '  <div class="fe-entity-emoji" aria-hidden="true">' + entity.emoji + '</div>',
      '  <h1 class="fe-title">' + period.ko + ' ' + entityName + ' 운세</h1>',
      '  <p class="fe-subtitle">' + (type === 'animal' ? entity.earthly + ' · ' + entity.element + '행 · ' + entity.keyword : entity.period + ' · ' + entity.planet + '인 · ' + entity.keyword) + '</p>',
      '  <div class="fe-total-score" style="color:' + totalStar.color + '">',
      '    <span class="fe-stars">' + totalStar.stars + '</span>',
      '    <span class="fe-grade">' + totalStar.grade + ' ' + ft.total.score + '점</span>',
      '  </div>',
      '</header>',

      '<section class="fe-card fe-card--total">',
      '  <h2 class="fe-card-title">🌟 오늘의 총운</h2>',
      '  <div class="fe-score-bar"><div class="fe-score-fill" style="width:' + ft.total.score + '%;background:' + totalStar.color + '"></div></div>',
      '  <p class="fe-card-text">' + ft.total.text + '</p>',
      '</section>',

      '<div class="fe-grid3">',
      _subCard('❤️', '연애운', ft.love, loveStar),
      _subCard('💰', '재물운', ft.money, moneyStar),
      _subCard('💪', '건강운', ft.health, healthStar),
      '</div>',

      '<section class="fe-card fe-card--lucky">',
      '  <h2 class="fe-card-title">🍀 오늘의 행운 정보</h2>',
      '  <div class="fe-lucky-grid">',
      '    <div class="fe-lucky-item"><div class="fe-lucky-icon">🎨</div><div class="fe-lucky-label">행운 색</div><div class="fe-lucky-val">' + ft.luckyColor + '</div></div>',
      '    <div class="fe-lucky-item"><div class="fe-lucky-icon">🔢</div><div class="fe-lucky-label">행운 숫자</div><div class="fe-lucky-val">' + ft.luckyNumber + '</div></div>',
      '  </div>',
      '</section>',

      '<section class="fe-card fe-card--advice">',
      '  <h2 class="fe-card-title">💡 오늘의 조언</h2>',
      '  <blockquote class="fe-advice">"' + ft.advice + '"</blockquote>',
      '</section>',

      '<section class="fe-links">',
      '  <h2 class="fe-links-title">' + entityName + ' 다른 운세</h2>',
      '  <div class="fe-link-pills">',
      '    <a class="fe-link-chip fe-link-chip--period" href="/fortune/today/' + entityId + '.html">📅 오늘 운세</a>',
      '    <a class="fe-link-chip fe-link-chip--period" href="/fortune/tomorrow/' + entityId + '.html">📆 내일 운세</a>',
      '    <a class="fe-link-chip fe-link-chip--period" href="/fortune/weekly/' + entityId + '.html">🗓️ 주간 운세</a>',
      '    <a class="fe-link-chip fe-link-chip--period" href="/fortune/monthly/' + entityId + '.html">📊 월간 운세</a>',
      '  </div>',
      '  <h2 class="fe-links-title" style="margin-top:20px">다른 ' + (type==='animal' ? '띠' : '별자리') + ' 운세</h2>',
      '  <div class="fe-link-pills">' + otherLinks + '</div>',
      '</section>',

      '<section class="fe-cta">',
      '  <h2 class="fe-cta-title">🔮 더 깊은 운세 분석</h2>',
      '  <div class="fe-cta-btns">',
      '    <a class="fe-cta-btn fe-cta-btn--main" href="/">🐷 사주팔자 무료 분석</a>',
      '    <a class="fe-cta-btn" href="/?tab=compat">💞 궁합 보기</a>',
      '    <a class="fe-cta-btn" href="/?tab=tarot">🃏 타로 뽑기</a>',
      '  </div>',
      '</section>'
    ].join('\n');

    document.getElementById('fortuneApp').innerHTML = html;

    /* 점수 바 애니메이션 */
    requestAnimationFrame(function() {
      requestAnimationFrame(function() {
        var bars = document.querySelectorAll('.fe-score-fill');
        for (var i = 0; i < bars.length; i++) {
          bars[i].style.transition = 'width 1s ease';
        }
      });
    });
  }

  function _subCard(icon, label, ft, star) {
    return [
      '<section class="fe-card fe-sub-card">',
      '  <h2 class="fe-card-title">' + icon + ' ' + label + '</h2>',
      '  <div class="fe-score-bar"><div class="fe-score-fill" style="width:' + ft.score + '%;background:' + star.color + '"></div></div>',
      '  <div style="font-size:.78rem;color:' + star.color + ';margin:4px 0 8px">' + star.stars + ' ' + star.grade + ' ' + ft.score + '점</div>',
      '  <p class="fe-card-text fe-card-text--sm">' + ft.text + '</p>',
      '</section>'
    ].join('\n');
  }

  /* ── Public API ── */
  root.FortuneEngine = {
    ANIMALS:  ANIMALS,
    SIGNS:    SIGNS,
    PERIODS:  PERIODS,
    generateFortune: generateFortune,
    renderPage: renderPage,
    /* URL에서 config 파싱 후 렌더링 */
    initFromConfig: function(cfg) {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() { renderPage(cfg); });
      } else {
        renderPage(cfg);
      }
    }
  };

})(window);
