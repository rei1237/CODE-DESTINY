function renderAstroInsight() {
    var birth = window._ziweiBirth || { year:2000, month:1, day:1, hour:12, minute:0, lat:37.6, lon:127.0, tz:9 };
    var y = birth.year, m = birth.month, d = birth.day;
    var h = (birth.hour != null ? birth.hour : 12);
    var min = (birth.minute != null ? birth.minute : 0);
    var lat = birth.lat || 37.6, lon = birth.lon || 127.0, tz = (birth.tz != null ? birth.tz : 9);

    /* ── AstroEngine 천체역학 계산 (Jean Meeus 기반) ── */
    var chart = AstroEngine.calcAll(y, m, d, h + min/60, lat, lon, tz);

    /* ── 현재 날짜 목성 트랜짓 (실시간) ── */
    var now = new Date();
    var chartNow = AstroEngine.calcAll(now.getFullYear(), now.getMonth()+1, now.getDate(), 12, lat, lon, tz);
    var jupiterTransit = chartNow.planets.Jupiter.sign.sign;
    var jupiterIndex = astrologer.signs.indexOf(jupiterTransit);

    /* ── 별자리 인덱스 매핑 ── */
    var sunIndex  = astrologer.signs.indexOf(chart.sun.sign);
    var moonIndex = astrologer.signs.indexOf(chart.moon.sign);
    var ascIndex  = astrologer.signs.indexOf(chart.asc.sign);
    var mcIndex   = astrologer.signs.indexOf(chart.mc.sign);
    if(sunIndex  < 0) sunIndex  = 0;
    if(moonIndex < 0) moonIndex = 0;
    if(ascIndex  < 0) ascIndex  = 0;
    if(mcIndex   < 0) mcIndex   = 0;
    if(jupiterIndex < 0) jupiterIndex = 0;

    /* ── 텍스트 해석 (기존 astrologer 인터프리테이션 활용) ── */
    var p = astrologer.calcPersona(y, m, d, h, min); // ruler, chironMeaning, descSun 재사용
    var descIndex = (ascIndex + 6) % 12;
    var h6Index   = (ascIndex + 5) % 12;

    /* ── 행성 표 렌더 ── */
    var PLANET_KR = {Mercury:'수성(☿)',Venus:'금성(♀)',Mars:'화성(♂)',Jupiter:'목성(♃)',Saturn:'토성(♄)',Uranus:'천왕성(♅)',Neptune:'해왕성(♆)',Pluto:'명왕성(♇)'};
    var PLANET_ELEM = {Mercury:'공기',Venus:'흙',Mars:'불',Jupiter:'불',Saturn:'흙',Uranus:'공기',Neptune:'물',Pluto:'물'};
    function fmtDeg(s){ return s ? '<span style="color:#94a3b8;font-size:0.75rem"> '+s.deg.toFixed(1)+'°</span>' : ''; }
    var planetRows = '';
    ['Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune','Pluto'].forEach(function(pn){
        var pl = chart.planets[pn];
        if(!pl) return;
        var retroTag = pl.retro ? '<span style="color:#f87171;font-size:0.72rem;font-weight:700;margin-left:4px">Rx ℞</span>' : '';
        var signTxt = pl.sign ? pl.sign.sign : '—';
        planetRows += '<tr>';
        planetRows += '<td style="padding:7px 10px;white-space:nowrap;color:#c4b5fd;font-weight:700;font-size:0.82rem">'+PLANET_KR[pn]+'</td>';
        planetRows += '<td style="padding:7px 10px;color:#fde68a;font-size:0.82rem">'+signTxt+fmtDeg(pl.sign)+'</td>';
        planetRows += '<td style="padding:7px 10px;font-size:0.75rem;color:#64748b">'+( PLANET_ELEM[pn]||'' )+'</td>';
        planetRows += '<td style="padding:7px 10px">'+retroTag+'</td>';
        planetRows += '</tr>';
    });

    /* ── Jupiter 트랜짓 메시지 (astrologer 배열 재사용) ── */
    var transitMsg = [
        "새로운 12년 주기의 시작을 알리는 발화점입니다. 양자리 목성은 폭발적인 주도성과 확장을 요구하므로, 주저하지 말고 스스로의 브랜드를 세상에 뻗어내는 선구자적 행동을 취할 때 최고의 우주적 보상을 얻습니다.",
        "물질적인 결실과 안정감의 확장이 일어나는 시즌입니다. 황소자리 목성의 에너지는 당신의 통장 잔고와 내면적 평안을 비호합니다. 실질적인 투자와 미적 가치의 증대에 집중하여 스스로의 가치를 공고히 하십시오.",
        "지적 호기심과 거미줄 같은 네트워크가 무한히 증폭됩니다. 쌍둥이자리 목성은 다양한 커뮤니케이션과 단기 프로젝트를 쏟아냅니다. 정보망을 넓히고 유연하게 변화에 타협할 때 예상치 못한 행운의 돌파구가 열립니다.",
        "정서적 뿌리와 가정 테두리 안에서의 치유가 크게 확장됩니다. 게자리 목성은 심리적 베이스캠프를 단단하게 구축하도록 지지합니다. 거주지 이동, 부동산 매입, 내면의 성찰 등에 막강한 긍정적 흐름이 부여됩니다.",
        "억눌러둔 창조적 에너지와 로맨스의 불꽃이 장대하게 타오릅니다. 사자자리 목성 시기에는 무대의 주인공이 되어야만 합니다. 엔터테인먼트, 예술적 성취, 연애 등 삶의 기쁨을 향유하는 데 모든 행운이 집중되어 있습니다.",
        "일상의 질서와 직업적 스킬을 완벽하게 재건할 절호의 타임라인입니다. 처녀자리 목성은 건강의 회복, 업무 환경의 긍정적 변화를 이끕니다. 거창한 야망보다 디테일을 마스터할 때 당신의 가치가 전문성으로 크게 인정받습니다.",
        "운명적인 동반자와의 만남이나 계약, 법적 파트너십의 체결에 매우 강력한 청신호가 켜집니다. 천칭자리 목성은 사회적 무대에서의 세련된 관계 형성을 상징합니다. 내가 아닌 너와의 협력을 통해 혼자 이룰 수 없는 부가가치를 창출합니다.",
        "표면적 관계를 넘어선 심리적 밀착과 공유 자산(타인의 돈, 투자금)의 극대화가 열립니다. 전갈자리 목성은 죽음과 부활 같은 강렬한 변환의 치유력을 줍니다. 심연의 감정을 마주하고 무의식을 정화할 때 압도적 카리스마를 얻습니다.",
        "고등 지식, 철학, 종교, 그리고 해외라는 물리적·정신적 경계 확장의 시즌입니다. 사수자리 목성은 가장 목성다운 확장력을 발휘하여 당신을 더 큰 세계관으로 이끕니다. 한 곳에 머물지 말고 출판, 여행, 학문적 탐구를 통해 비상하십시오.",
        "모든 노력의 총체적 결실과 사회적 명예(타이틀) 획득의 트로피를 상징합니다. 염소자리 목성은 커리어의 정점과 승진, 권위의 확립을 약속합니다. 지금껏 쌓아 올린 책임감 위에 막강한 사회적 영향력을 더하여 승리자의 자리에 등극합니다.",
        "개인적 성취를 넘어선 공동체 의식과 인류애, 새로운 비전의 실현을 서포트합니다. 물병자리 목성 시기에는 혁신적이고 독립적인 커뮤니티 활동, 사이드 프로젝트를 통해 막강한 인맥망을 구축하며 희망적인 미래를 쟁취합니다.",
        "에고(Ego)의 경계를 허물고 무의식의 정화와 영성적 해방을 맞이하는 내적 정리 기간입니다. 물고기자리 목성은 자비와 이타적인 희생 속에서 큰 치유를 줍니다. 일상의 요란함에서 벗어나 혼자만의 직관과 사색을 즐길 때 거대한 내면적 힘을 응축하게 됩니다."
    ];

    var sunInterpretations = [
        "1하우스 양자리 태양은 가장 순수한 형태의 화성 에너지를 발산합니다. 타인의 시선을 의식하기보다는 본능적인 충동과 개척 정신으로 삶을 돌파해 나갑니다. 도전을 두려워하지 않으나 때로는 지나친 조급함이 스스로를 지치게 할 수 있으니 완급 조절이 필요합니다.",
        "2하우스 황소자리 태양은 오감을 통한 물질적 안정과 미적 가치를 추구합니다. 타고난 인내심과 우직함으로 한 번 결심한 목표는 무너뜨리지 않는 성을 쌓듯 달성해냅니다. 삶의 속도가 느린 대신 결과물의 질적 완성도는 타의 추종을 불허합니다.",
        "3하우스 쌍둥이자리 태양은 끊임없이 정보를 흡수하고 유통하는 지적 호기심의 화신입니다. 상황에 따른 유연성과 적응력이 탁월하여 어떤 낯선 환경에서도 재치 있게 살아남습니다. 다방면으로 분산된 관심사를 하나로 응집시킬 몰입의 훈련이 성과를 좌우합니다.",
        "4하우스 게자리 태양은 정서적 뿌리와 친밀함을 생명처럼 여깁니다. 타인의 감정에 공명하는 능력이 매우 뛰어나 그룹 내에서 무의식적인 엄마 역할을 수행하곤 합니다. 예민한 감수성을 보호하기 위해 단단한 껍질을 두르지만 안에는 무한한 헌신이 숨쉬고 있습니다.",
        "5하우스 사자자리 태양은 무대 중앙에서 가장 밝게 빛나야 직성이 풀리는 왕의 에너지를 지닙니다. 존재 자체로 뿜어져 나오는 카리스마와 창조성은 주변 사람들에게 영감을 불어넣습니다. 자존심이 꺾이는 것을 극도로 경계하나, 내면은 칭찬을 갈구하는 아이와 같습니다.",
        "6하우스 처녀자리 태양은 질서와 체계, 그리고 헌신을 통해 스스로의 존재를 증명합니다. 미세한 결함을 포착해내는 날카로운 분석력은 당신을 대체 불가능한 전문가로 만듭니다. 완벽주의가 스스로를 검열하고 옥죄지 않도록 때로는 자신에게 관대해질 필요가 있습니다.",
        "7하우스 천칭자리 태양은 '나'와 '너'의 끊임없는 조율 속에서 자아를 발견합니다. 갈등을 중재하고 평화를 이끌어내는 탁월한 외교관적 기질이 있으며 심미안이 뛰어납니다. 타인의 시선과 관계망 속에서 미움받지 않으려는 태도가 결단력을 흐리게 할 수 있습니다.",
        "8하우스 전갈자리 태양은 타인과 세상의 피상적인 면에 만족하지 않고 기저의 비밀과 금기까지 파고듭니다. 배신을 결코 잊지 않는 강렬한 집착과 소유욕의 이면에는 끝없는 애정에 대한 갈구가 자리합니다. 죽음과 재생, 파괴와 부활을 거치며 진정으로 탈바꿈하는 영혼입니다.",
        "9하우스 사수자리 태양은 구속을 거부하고 무한한 자유와 철학적 비전을 찾아 질주합니다. 낙관적이고 철학적인 태도로 인생을 거대한 탐험으로 여기며, 하나의 정답에 얽매이는 것을 답답해합니다. 이상이 너무 높아 자칫 현실 감각을 잃지 않게 주의가 필요합니다.",
        "10하우스 염소자리 태양은 가파른 절벽을 오르는 산양처럼 사회적 성취와 명예를 향해 묵묵히 전진합니다. 책임감과 시간의 가치를 누구보다 잘 알기에 대기만성형 승리자가 될 확률이 농후합니다. 억압된 감정과 워커홀릭 기질을 해소할 휴식의 기술이 요구됩니다.",
        "11하우스 물병자리 태양은 기성의 규칙에 저항하고 인류애와 미래 지향적 가치를 대변합니다. 독창적인 사고방식으로 집단 내에서 아방가르드한 해결책을 제시하며 독립된 개체로서의 연대를 꿈꿉니다. 너무 객관적인 시선 탓에 간혹 타인에게 지나치게 냉정해 보일 수 있습니다.",
        "12하우스 물고기자리 태양은 세상의 모든 경계를 허무는 바다 같은 수용력을 소유했습니다. 예술적 영감과 무의식적 직관이 탁월하게 발달해 있어 논리로는 설명하기 힘든 영성적 힘을 발휘합니다. 현실감이 떨어지는 경향이 있어 타인의 부정적 에너지를 스펀지처럼 흡수치 않도록 경계해야 합니다."
    ];

    var sunSign  = chart.sun.sign;
    var moonSign = chart.moon.sign;
    var ascSign  = chart.asc.sign;
    var mcSign   = chart.mc.sign;
    var descSign = astrologer.signs[descIndex];
    var h6Sign   = astrologer.signs[h6Index];
    var saturnSign = chart.planets.Saturn ? chart.planets.Saturn.sign.sign : astrologer.signs[0];
    var venusSign  = chart.planets.Venus  ? chart.planets.Venus.sign.sign  : astrologer.signs[0];
    var marsSign   = chart.planets.Mars   ? chart.planets.Mars.sign.sign   : astrologer.signs[0];

    var sunDeg  = chart.sun.deg  != null ? ' <span style="color:#94a3b8;font-size:0.78rem">'+chart.sun.deg.toFixed(2)+'°</span>' : '';
    var moonDeg = chart.moon.deg != null ? ' <span style="color:#94a3b8;font-size:0.78rem">'+chart.moon.deg.toFixed(2)+'°</span>' : '';

    var vmAspect = '';
    var vi = astrologer.signs.indexOf(venusSign), mi2 = astrologer.signs.indexOf(marsSign);
    if(vi===mi2) vmAspect = "<span class='aspect-hl'>[합(Conjunction) 강렬한 결합]</span> 매력 어필과 행동력이 일치하여 매우 폭발적인 연애 스타일.";
    else if((vi-mi2+12)%12===6) vmAspect = "<span class='aspect-hl'>[충(Opposition) 극단적 대립]</span> 내가 원하는 가치(금성)와 쟁취 방식(화성)이 정반대 — 강렬한 끌림과 충돌 동시 경험.";

    // [MASTER INSIGHT] Override & Add Custom Reading for 1991-02-20
    var masterInsight = '';
    if (Math.abs(chart.jdUT - 2448307.86) < 0.01) {
       masterInsight = `<div class="astro-section" style="border-left:4px solid #D4AF37; background:linear-gradient(to right, rgba(212,175,55,0.05), transparent); margin-bottom:20px;">
            <div class="astro-subhead" style="color:#D4AF37; font-family:'Cinzel',serif;">👑 Absolute Celestial Sync (마스터 리딩)</div>
            <div class="astro-desc" style="font-size:0.95rem;">
                <p><b>[Elemental Synergy: 물고기자리 ☀ & 황소자리 ☽]</b><br>
                당신은 몽상하는 자아(Pisces Sun)와 현실적 안정(Taurus Moon)이 절묘하게 교차하는 영혼입니다.
                물고기자리의 무한한 상상력을 황소자리의 끈기로 구체화할 때, 당신의 꿈은 단순한 환상이 아닌 거대한 현실이 됩니다.
                감정의 파도가 칠 때(Water), 단단한 흙(Earth)이 방파제가 되어주는 완벽한 상호보완적 구조를 가졌습니다.</p>
                <p><b>[Karmic Path: 토성 & 11하우스]</b><br>
                토성(Saturn)이 11하우스 물병자리(Domicile)에 위치하여, 당신은 전생으로부터 '혁신적 공동체'를 건설해야 하는 업(Karma)을 가지고 왔습니다.
                고독한 천재로서의 시련을 견뎌내고, 소수정예의 동료들과 함께 시대를 앞서가는 비전을 제시하는 것이 당신의 영적 소명입니다.</p>
                <p><b>[Vital Point: 포르투나 & 스피릿]</b><br>
                물질적 풍요의 포르투나(♊ 3H)는 '언어와 소통'을 통해 부가 창출됨을 암시하며,
                영적 성장의 스피릿(♑ 10H)은 '사회적 정점'에 도달하는 것이 곧 영혼의 완성임을 가리킵니다.</p>
            </div>
        </div>`;
    }

    /* ── 4원소 실시간 계산 ── */
    var SIGN_ELEM = {
        '양자리':'fire','사자자리':'fire','사수자리':'fire',
        '황소자리':'earth','처녀자리':'earth','염소자리':'earth',
        '쌍둥이자리':'air','천칭자리':'air','물병자리':'air',
        '게자리':'water','전갈자리':'water','물고기자리':'water'
    };
    var elemCount = { fire:0, earth:0, air:0, water:0 };
    var elemPlanets = { fire:[], earth:[], air:[], water:[] };
    var elemSigns   = [chart.sun.sign, chart.moon.sign, chart.asc.sign, chart.mc.sign];
    var elemPlanetNames = ['Mercury','Venus','Mars','Jupiter','Saturn'];
    elemPlanetNames.forEach(function(pn){
        if(chart.planets[pn]) elemSigns.push(chart.planets[pn].sign.sign);
    });
    elemSigns.forEach(function(s, i){
        var el = SIGN_ELEM[s];
        if(el) { elemCount[el]++; elemPlanets[el].push(s); }
    });
    var elemTotal = elemCount.fire + elemCount.earth + elemCount.air + elemCount.water || 1;
    var elemPct = {
        fire:  Math.round(elemCount.fire  / elemTotal * 100),
        earth: Math.round(elemCount.earth / elemTotal * 100),
        air:   Math.round(elemCount.air   / elemTotal * 100),
        water: Math.round(elemCount.water / elemTotal * 100)
    };
    var elemDominant = Object.keys(elemCount).reduce(function(a,b){ return elemCount[a]>=elemCount[b]?a:b; });
    var elemDomNames = { fire:'🔥 불(Fire)의 시대', earth:'🌿 흙(Earth)의 번영', air:'💨 공기(Air)의 지성', water:'💧 물(Water)의 감성' };
    var elemDomDesc  = {
        fire:  '창조, 열정, 직관이 넘치는 영혼. 행동이 먼저이고 생각은 나중.',
        earth: '물질적 현실 감각과 인내가 최강 무기. 꾸준함이 부를 쌓는다.',
        air:   '논리와 언어, 소통으로 세상을 이끄는 지식인 기질.',
        water: '감수성과 영성이 폭발하는 직관의 달인. 타인의 감정에 즉각 공명.'
    };

    /* ── 피르다리아 계산 (Chaldean order, 낮 출생 기준) ── */
    var FIRDARIA_DAY  = [
        {planet:'☀ 태양(Sun)',   years:10, kr:'태양', theme:'자아 확립·명예·창조력의 시대. 당신이 주인공이 될 무대가 펼쳐집니다.'},
        {planet:'♀ 금성(Venus)', years:8,  kr:'금성', theme:'사랑·미적 성취·재물의 꽃이 활짝 피는 달콤한 시기.'},
        {planet:'☿ 수성(Mercury)',years:13, kr:'수성', theme:'학습·커뮤니케이션·계약과 협상의 시대. 언어가 곧 권력.'},
        {planet:'☽ 달(Moon)',    years:9,  kr:'달',   theme:'내면의 감정을 정화하고 가정·모성·직관이 빛나는 시기.'},
        {planet:'♄ 토성(Saturn)',years:11, kr:'토성', theme:'시련과 인내, 그 끝에 단단한 전문성이 완성되는 여정.'},
        {planet:'♃ 목성(Jupiter)',years:12,kr:'목성', theme:'확장·행운·성장의 정점. 씨앗이 거목으로 자라나는 시절.'},
        {planet:'♂ 화성(Mars)',  years:7,  kr:'화성', theme:'도전·경쟁·에너지 폭발. 멈추지 말고 전진할 것.'}
    ];
    var age = now.getFullYear() - y;
    var firdariaMain = null, firdariaMainYearsLeft = 0;
    var accAge = 0;
    for(var fi = 0; fi < FIRDARIA_DAY.length; fi++){
        accAge += FIRDARIA_DAY[fi].years;
        if(age < accAge){
            firdariaMain = FIRDARIA_DAY[fi];
            firdariaMainYearsLeft = accAge - age;
            break;
        }
        age -= FIRDARIA_DAY[fi].years; // 한 바퀴 넘으면 재순환
        if(fi === FIRDARIA_DAY.length - 1){ fi = -1; }
    }
    if(!firdariaMain) firdariaMain = FIRDARIA_DAY[0];
    // 서브 피르다리아: 메인 기간을 7개 행성으로 균등 분할
    var subIdx = Math.floor((firdariaMain.years - firdariaMainYearsLeft) / (firdariaMain.years / 7)) % 7;
    var firdariaSubPlanet = FIRDARIA_DAY[subIdx].kr;

    /* ── 연간 프로펙션 계산 ── */
    var HOUSE_KR = ['1하우스(자아·몸)','2하우스(재물·가치)','3하우스(소통·이동)',
                    '4하우스(가정·뿌리)','5하우스(창조·연애)','6하우스(건강·일상)',
                    '7하우스(관계·계약)','8하우스(변환·심연)','9하우스(철학·여행)',
                    '10하우스(사회·명예)','11하우스(공동체·미래)','12하우스(영성·은둔)'];
    var PROFECTION_RULER = ['화성','금성','수성','달','태양','수성','금성','화성','목성','토성','토성','목성'];
    var PROFECTION_SIGN  = astrologer.signs;
    var profAge = now.getFullYear() - y; // 만 나이 기준
    var profHouseIdx = profAge % 12;
    var profHouse    = HOUSE_KR[profHouseIdx];
    var profSign     = PROFECTION_SIGN[(ascIndex + profHouseIdx) % 12];
    var profRuler    = PROFECTION_RULER[profHouseIdx];
    var profThemes   = [
        '자아 이미지 리부트의 해. 새로운 나를 세상에 선언하라.',
        '돈과 자존감을 동시에 챙기는 해. 내 가치를 증명할 기회.',
        '말과 글이 운명을 바꾸는 해. 네트워크를 적극적으로 넓혀라.',
        '가족과 심리적 기반이 핵심 과제. 내면의 안전지대를 구축하라.',
        '사랑·창작·자녀에게 행운이 집중되는 해. 즐거움을 추구하라.',
        '건강 관리와 직업적 루틴이 미래를 좌우하는 해.',
        '중요한 파트너십·계약·결혼 이슈가 수면 위로 떠오른다.',
        '심리적 변환과 유산·투자·은밀한 관계가 주 무대.',
        '해외·학업·종교가 새로운 지평을 열어주는 자유의 해.',
        '커리어의 정점을 향해 달리는 성과의 해. 사회적 타이틀 획득 집중.',
        '공동체와 비전, 우정이 인생을 확장시키는 연대의 해.',
        '내면 정화·영성·은둔이 다음 큰 사이클을 준비시키는 해.'
    ];

    var html = '<div class="astro-body star-container" id="astroBodyWrap">' + masterInsight

    /* ───────────────────────────────────────────
     * 섹션 1: 통합 인연 리포트 (Synastry & Bond)
     * ─────────────────────────────────────────── */
        +'<div class="astro-section" style="border-left:4px solid #f472b6; background:linear-gradient(to right, rgba(244,114,182,0.06), transparent);">'
        +'<div class="astro-subhead" style="color:#f472b6;">💞 통합 인연 리포트 (Synastry &amp; Bond)</div>'
        +'<div class="astro-desc">'
        +'<p><b>[하강궁 — 끌림의 코드]</b> 당신의 하강궁(7H)이 <b>'+descSign+'</b>에 걸려있습니다. 무의식이 억눌러 온 그림자 자아의 에너지가 이 별자리를 가진 타인에게 폭발적으로 투사되며, 인생을 통틀어 이 파동을 지닌 인연에게 가장 강렬히 매혹됩니다.</p>'
        +'<p><b>[Venus ♀ × Mars ♂ — 끌림의 화학반응]</b> 금성(<b>'+venusSign+'</b>)과 화성(<b>'+marsSign+'</b>)의 교차가 만들어내는 당신만의 관계 화학식: '+vmAspect+(vmAspect?'':' 두 에너지가 보완 관계를 이루며 안정적이고 지속 가능한 끌림을 형성합니다.')+'</p>'
        +'<p><b>[Chiron 키론 — 상처가 인연을 부른다]</b> "'+p.chironMeaning+'" 이 상처를 정면으로 끌어안는 과정에서 운명적 인연이 찾아옵니다.</p>'
        +'<div style="background:rgba(244,114,182,0.08); border-radius:10px; padding:14px; margin-top:12px;">'
        +'<div style="color:#f9a8d4; font-weight:700; margin-bottom:8px; font-size:0.88rem; text-transform:uppercase; letter-spacing:1px;">Bond Compatibility Map</div>'
        +'<ul style="padding-left:18px; margin:0; font-size:0.9rem; color:#e2e8f0; line-height:1.8;">'
        +'<li><b>💕 연애 궁합</b> — <b>'+moonSign+'</b> 달의 감정선과 물·흙 기운 영혼에게서 깊은 안식을 얻습니다. 자극보다 포근한 공존이 더 오래 지속됩니다.</li>'
        +'<li><b>✨ 속 궁합</b> — <b>'+venusSign+'</b> 금성이 원하는 사랑의 질감은 섬세한 터치와 무언의 이해. 말로 하지 않아도 통하는 교감이 핵심입니다.</li>'
        +'<li><b>🤝 일 궁합</b> — <b>'+mcSign+'</b> MC를 뒷받침할 현실적 조력자, 특히 흙의 별자리가 든든한 파트너가 됩니다.</li>'
        +'</ul>'
        +'</div>'
        +'</div>'
        +'</div>'

    /* ───────────────────────────────────────────
     * 기존 섹션 1·2: 페르소나 + 사회적 소명
     * ─────────────────────────────────────────── */
        +'<div class="astro-section">'
        +'<div class="astro-subhead">📌 1. 심층 페르소나 (천체역학 기반 · Jean Meeus 알고리즘)</div>'
        +'<div class="astro-tags">'
        +'<span class="astro-tag">☀ 태양</span> <span class="astro-planet">'+sunSign+'</span>'+sunDeg
        +' <span class="astro-tag">☽ 달</span> <span class="astro-planet">'+moonSign+'</span>'+moonDeg
        +' <span class="astro-tag">↑ Asc 상승궁</span> <span class="astro-planet">'+ascSign+'</span>'
        +'</div>'
        +'<div class="astro-desc">'
        +'<p><b>[핵심 자아의 발현]</b><br>'+sunInterpretations[sunIndex]+'</p>'
        +'<p><b>[정서와 무의식의 그림자]</b><br>'+moonSign+'에 위치한 달은 정서적 안정감의 원천입니다. 무의식적으로 이 영역이 충족될 때 파괴된 멘탈을 가장 빠르게 회복하며, 위기의 순간 민낯이자 방어기제로 작용합니다.</p>'
        +'<p>당신의 외적 페르소나인 상승궁(Ascendant)은 <b>'+ascSign+'</b>에 걸려 있습니다.</p>'
        +'</div>'
        +'<div class="astro-core">"차트 룰러(Chart Ruler): <strong>'+p.ruler+'</strong> — 영혼의 마스터키"</div>'
        +'</div>'

        +'<div class="astro-section">'
        +'<div class="astro-subhead">📌 2. 사회적 소명과 천직 (MC & Placidus)</div>'
        +'<div class="astro-tags">'
        +'<span class="astro-tag">MC 천정(10H)</span> <span class="astro-planet">'+mcSign+'</span>'
        +' <span class="astro-tag">6H</span> <span class="astro-house">'+h6Sign+'</span>'
        +' <span class="astro-tag">Saturn ♄</span> <span class="astro-planet">'+saturnSign+(chart.planets.Saturn&&chart.planets.Saturn.retro?' <span style="color:#f87171;font-size:0.75rem">Rx</span>':'')+'</span>'
        +'</div>'
        +'<div class="astro-desc">'
        +'<p>사회적 정점(MC)은 <b>'+mcSign+'</b>. 토성이 <b>'+saturnSign+'</b>에서 던지는 시련을 극복할 때 비로소 이 타이틀이 완성됩니다.</p>'
        +'</div>'
        +'</div>'

    /* ───────────────────────────────────────────
     * 섹션 3: 4원소 균형 (실시간 계산)
     * ─────────────────────────────────────────── */
        +'<div class="astro-section">'
        +'<div class="astro-subhead">📌 3. 4원소 균형 (Elemental Balance)</div>'
        +'<div class="astro-desc">'
        +'<div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:14px;">'
        +['fire','earth','air','water'].map(function(el){
            var cfg = { fire:['#f87171','🔥','불(Fire)'], earth:['#fde68a','🌿','흙(Earth)'], air:['#93c5fd','💨','공기(Air)'], water:['#34d399','💧','물(Water)'] };
            var c = cfg[el]; var pct = elemPct[el];
            return '<div style="background:rgba(255,255,255,0.04); border-radius:10px; padding:12px; border:1px solid rgba(255,255,255,0.07);">'
                +'<div style="font-size:0.85rem; color:'+c[0]+'; font-weight:700; margin-bottom:6px;">'+c[1]+' '+c[2]+'</div>'
                +'<div style="font-size:1.5rem; font-weight:900; color:'+c[0]+'; line-height:1;">'+pct+'<span style="font-size:0.75rem; color:#94a3b8; font-weight:400;">%</span></div>'
                +'<div style="height:4px; background:#1e293b; border-radius:2px; margin-top:8px; overflow:hidden;"><div style="height:100%; width:'+pct+'%; background:'+c[0]+'; border-radius:2px; transition:width 1.5s ease;"></div></div>'
                +'</div>';
        }).join('')
        +'</div>'
        +'<div style="background:rgba(255,255,255,0.04); border-radius:10px; padding:12px; font-size:0.9rem;">'
        +'<span style="color:#fbbf24; font-weight:700;">지배 원소: '+elemDomNames[elemDominant]+'</span>'
        +'<p style="margin:6px 0 0 0; color:#cbd5e1; line-height:1.5;">'+elemDomDesc[elemDominant]+'</p>'
        +'</div>'
        +'</div>'
        +'</div>'

    /* ───────────────────────────────────────────
     * 섹션 4: 목성 트랜짓 (기존)
     * ─────────────────────────────────────────── */
        +'<div class="astro-section">'
        +'<div class="astro-subhead">📌 4. 거대한 우주의 통신 (목성 트랜짓)</div>'
        +'<div class="astro-tags">'
        +'<span class="astro-tag">Jupiter ♃ Transit</span> <span class="astro-planet">'+jupiterTransit+'</span>'
        +' <span style="color:#94a3b8;font-size:0.78rem">('+now.getFullYear()+'.'+String(now.getMonth()+1).padStart(2,'0')+'.'+now.getDate()+'일 기준)</span>'
        +'</div>'
        +'<div class="astro-desc">'
        +'<p>현재 목성이 <b>'+jupiterTransit+'</b>에 상주하며 당신의 거시적 운명에 거대한 기류 변화를 촉구합니다.</p>'
        +'<div class="astro-core" style="font-size:1.0rem;margin-top:14px;font-weight:bold">"👉 '+transitMsg[jupiterIndex]+'"</div>'
        +'</div>'
        +'</div>'

    /* ───────────────────────────────────────────
     * 섹션 5: 피르다리아 (실시간 계산)
     * ─────────────────────────────────────────── */
        +'<div class="astro-section" style="border-left:3px solid #a78bfa;">'
        +'<div class="astro-subhead" style="color:#a78bfa;">📌 5. 피르다리아 (Firdaria — 고전 시간 통치자)</div>'
        +'<div class="astro-desc">'
        +'<div style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:12px;">'
        +'<div style="flex:1; min-width:130px; background:rgba(167,139,250,0.12); border-radius:10px; padding:12px; border:1px solid rgba(167,139,250,0.3); text-align:center;">'
        +'<div style="font-size:0.75rem; color:#a78bfa; text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;">메인 타임로드</div>'
        +'<div style="font-size:1.2rem; font-weight:900; color:#ddd6fe;">'+firdariaMain.planet+'</div>'
        +'<div style="font-size:0.72rem; color:#94a3b8; margin-top:4px;">잔여 약 '+firdariaMainYearsLeft+'년</div>'
        +'</div>'
        +'<div style="flex:1; min-width:130px; background:rgba(167,139,250,0.06); border-radius:10px; padding:12px; border:1px solid rgba(167,139,250,0.15); text-align:center;">'
        +'<div style="font-size:0.75rem; color:#a78bfa; text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;">서브 타임로드</div>'
        +'<div style="font-size:1.2rem; font-weight:900; color:#c4b5fd;">'+firdariaSubPlanet+'</div>'
        +'</div>'
        +'</div>'
        +'<p>'+firdariaMain.theme+'</p>'
        +'<p style="font-size:0.88rem; color:#a78bfa;">✦ 서브 기간 <b>'+firdariaSubPlanet+'</b>의 에너지가 주파수를 더하며 이 테마를 세밀하게 조율합니다.</p>'
        +'</div>'
        +'</div>'

    /* ───────────────────────────────────────────
     * 섹션 6: 연간 프로펙션 (실시간 계산)
     * ─────────────────────────────────────────── */
        +'<div class="astro-section" style="border-left:3px solid #22d3ee;">'
        +'<div class="astro-subhead" style="color:#22d3ee;">📌 6. 연간 프로펙션 (Annual Profection — '+now.getFullYear()+'년)</div>'
        +'<div class="astro-desc">'
        +'<div style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:12px;">'
        +'<div style="flex:1; min-width:130px; background:rgba(34,211,238,0.1); border-radius:10px; padding:12px; border:1px solid rgba(34,211,238,0.25); text-align:center;">'
        +'<div style="font-size:0.75rem; color:#22d3ee; text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;">올해의 하우스</div>'
        +'<div style="font-size:1.0rem; font-weight:800; color:#a5f3fc;">'+profHouse+'</div>'
        +'</div>'
        +'<div style="flex:1; min-width:100px; background:rgba(34,211,238,0.1); border-radius:10px; padding:12px; border:1px solid rgba(34,211,238,0.25); text-align:center;">'
        +'<div style="font-size:0.75rem; color:#22d3ee; text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;">지배 별자리</div>'
        +'<div style="font-size:1.0rem; font-weight:800; color:#a5f3fc;">'+profSign+'</div>'
        +'</div>'
        +'<div style="flex:1; min-width:100px; background:rgba(34,211,238,0.1); border-radius:10px; padding:12px; border:1px solid rgba(34,211,238,0.25); text-align:center;">'
        +'<div style="font-size:0.75rem; color:#22d3ee; text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;">올해의 행성</div>'
        +'<div style="font-size:1.2rem; font-weight:900; color:#67e8f9;">'+profRuler+'</div>'
        +'</div>'
        +'</div>'
        +'<p>'+profThemes[profHouseIdx]+'</p>'
        +'</div>'
        +'</div>'

    /* ───────────────────────────────────────────
     * 섹션 7: 쌈바 & 연이 카운슬링
     * ─────────────────────────────────────────── */
        +'<div class="astro-expert">'
        +'<div class="expert-title">🗣️ 쌈바 &amp; 연이의 코즈믹 카운슬링</div>'
        +'<div class="expert-msg">'
        +'<div class="neo-bubble"><strong>[분석가 쌈바 🦁]</strong> "당신의 차트는 <b>'+sunSign+'</b> 태양의 본질적 의지와 <b>'+ascSign+'</b> 상승궁 사이의 역학적 긴장도를 어떻게 다루느냐에 따라 성공의 볼륨이 결정됩니다. 올해 <b>'+profHouse+'</b> 프로펙션과 피르다리아 타임로드 <b>'+firdariaMain.kr+'</b>의 교차점에서 당신에게 허락된 창문이 열립니다. 지금 이 순간을 놓치지 마십시오."</div>'
        +'<div class="yeon-bubble"><strong>[공감요정 연이 🐷]</strong> "우와, <b>'+venusSign+'</b> 금성의 부드럽고 매력적인 에너지가 당신을 반짝이게 해주고 있어요! 💖 지배 원소 <b>'+elemDomNames[elemDominant]+'</b>를 다스리면 인간관계가 놀랍게 부드러워진답니다. 달(<b>'+moonSign+'</b>)의 속삭임대로 감정에 솔직해지는 연습을 해보세요. 자신을 꽉 안아주세요!"</div>'
        +'</div>'
        +'</div>'

    /* ───────────────────────────────────────────
     * 섹션 최하단: 메타데이터 + 행성 테이블
     * ─────────────────────────────────────────── */
        +'<div style="margin-top:16px;padding:12px 14px;background:rgba(0,0,0,0.4);border-radius:10px;border:1px solid rgba(148,163,184,0.1)">'
        +'<div style="color:#475569;font-size:0.7rem;line-height:1.9">🔬 <b style="color:#64748b">천체역학 계산 메타데이터</b> (Jean Meeus, Astronomical Algorithms 2nd Ed.)<br>'
        +'ΔT = '+chart.dT.toFixed(1)+'초 &nbsp;|&nbsp; 황도 경사각 ε = '+chart.eps.toFixed(4)+'° &nbsp;|&nbsp; JD(TT) = '+chart.jdTT.toFixed(5)
        +' &nbsp;|&nbsp; 위도 '+lat.toFixed(2)+'° / 경도 '+lon.toFixed(2)+'° &nbsp;|&nbsp; UTC+'+tz
        +'<br><span style="color:#334155">태양 정확도 ≈0.01° · 달 ≈0.3° · 행성 ≈0.5–1° · 하우스: Placidus 구면삼각법</span>'
        +'</div>'

    /* ── Falling Stars CSS 주입 (이미 삽입됐으면 스킵) ── */
    if(!document.getElementById('falling-stars-style')){
        var styleEl = document.createElement('style');
        styleEl.id = 'falling-stars-style';
        styleEl.textContent = `
        .star-container { position:relative; overflow:hidden; }
        .astro-star {
            position:absolute; background:#fff; border-radius:50%;
            opacity:0; pointer-events:none; z-index:0;
            animation: astroFall linear infinite;
        }
        @keyframes astroFall {
            0%   { transform:translateY(-10vh) translateX(0px);  opacity:0; }
            10%  { opacity:0.6; }
            90%  { opacity:0.4; }
            100% { transform:translateY(110vh) translateX(22px); opacity:0; }
        }
        .astro-body > * { position:relative; z-index:1; }
        `;
        document.head.appendChild(styleEl);
    }

    document.getElementById('astroResult').innerHTML = html;

    /* ── 별 생성 (DOM 삽입 후) ── */
    var wrap = document.getElementById('astroBodyWrap');
    if(wrap && !wrap.dataset.starsAdded){
        wrap.dataset.starsAdded = '1';
        for(var si = 0; si < 28; si++){
            var star = document.createElement('div');
            star.className = 'astro-star';
            var size = Math.random() * 2.5 + 0.8;
            star.style.cssText = [
                'width:'+size+'px',
                'height:'+size+'px',
                'left:'+Math.random()*100+'%',
                'top:'+Math.random()*100+'%',
                'animation-duration:'+(Math.random()*8+6)+'s',
                'animation-delay:'+(-Math.random()*10)+'s',
                'filter:blur('+(size>2?'0.4px':'0px')+')'
            ].join(';');
            wrap.appendChild(star);
        }
    }
}

/* ─────── 자미두수 12궁 심층 분석 요약 ─────── */
var ZW_BRIGHTNESS={
  '자미':{'子':'평','丑':'묘','寅':'왕','卯':'평','辰':'묘','巳':'평','午':'왕','未':'묘','申':'평','酉':'평','戌':'묘','亥':'평'},
  '천기':{'子':'평','丑':'함','寅':'묘','卯':'왕','辰':'평','巳':'묘','午':'함','未':'평','申':'묘','酉':'왕','戌':'평','亥':'묘'},
  '태양':{'子':'함','丑':'함','寅':'묘','卯':'왕','辰':'왕','巳':'왕','午':'묘','未':'왕','申':'평','酉':'함','戌':'함','亥':'함'},
  '무곡':{'子':'묘','丑':'왕','寅':'평','卯':'평','辰':'묘','巳':'평','午':'평','未':'평','申':'왕','酉':'묘','戌':'함','亥':'묘'},
  '천동':{'子':'왕','丑':'평','寅':'평','卯':'묘','辰':'함','巳':'평','午':'함','未':'묘','申':'평','酉':'평','戌':'함','亥':'왕'},
  '염정':{'子':'평','丑':'평','寅':'묘','卯':'평','辰':'묘','巳':'함','午':'묘','未':'함','申':'묘','酉':'평','戌':'평','亥':'평'},
  '천부':{'子':'묘','丑':'묘','寅':'왕','卯':'평','辰':'묘','巳':'평','午':'묘','未':'묘','申':'왕','酉':'평','戌':'묘','亥':'평'},
  '태음':{'子':'왕','丑':'묘','寅':'평','卯':'평','辰':'함','巳':'함','午':'함','未':'평','申':'평','酉':'묘','戌':'묘','亥':'왕'},
  '탐랑':{'子':'왕','丑':'평','寅':'묘','卯':'묘','辰':'평','巳':'묘','午':'왕','未':'평','申':'묘','酉':'묘','戌':'평','亥':'묘'},
  '거문':{'子':'왕','丑':'묘','寅':'평','卯':'함','辰':'평','巳':'묘','午':'함','未':'묘','申':'묘','酉':'평','戌':'함','亥':'묘'},
  '천상':{'子':'묘','丑':'묘','寅':'왕','卯':'평','辰':'묘','巳':'평','午':'묘','未':'묘','申':'왕','酉':'평','戌':'묘','亥':'평'},
  '천량':{'子':'평','丑':'묘','寅':'묘','卯':'평','辰':'묘','巳':'평','午':'묘','未':'함','申':'묘','酉':'평','戌':'묘','亥':'함'},
  '칠살':{'子':'묘','丑':'평','寅':'묘','卯':'평','辰':'묘','巳':'평','午':'묘','未':'평','申':'묘','酉':'평','戌':'묘','亥':'평'},
  '파군':{'子':'왕','丑':'함','寅':'묘','卯':'함','辰':'묘','巳':'함','午':'왕','未':'함','申':'묘','酉':'함','戌':'묘','亥':'함'}
};
var ZW_GUNG_DEF={
  '명궁':'선천 자아·기질·운명의 뿌리',
  '형제궁':'형제·친구·동기 관계망',
  '부처궁':'배우자·파트너십 인연구조',
  '자녀궁':'자녀·창작·부하의 생산력',
  '재백궁':'재물·수입·현금 흐름',
  '질액궁':'신체 건강·체질의 기반',
  '천이궁':'이동·대외활동·타향 운기',
  '노복궁':'사회 인맥·부하·협력자',
  '관록궁':'직업·사회 성취·명예',
  '전택궁':'주거·부동산·생활기반',
  '복덕궁':'정신 행복·여유·내면세계',
  '부모궁':'부모·윗사람·문서운'
};
var ZW_STAR_KW={
  '자미':'권위·지도','천기':'지혜·변통','태양':'명성·발산','무곡':'결단·재력',
  '천동':'평화·복덕','염정':'열정·통제','천부':'포용·저장','태음':'직관·심미',
  '탐랑':'매력·욕구','거문':'통찰·언변','천상':'조화·봉사','천량':'원칙·구원',
  '칠살':'돌파·독립','파군':'변혁·개척'
};
var ZW_SIHUA_LABEL={'화록':'화록(祿)▲','화권':'화권(權)▲','화과':'화과(科)▲','화기':'화기(忌)▼'};
var ZW_SIHUA_COLOR={'화록':'#4ade80','화권':'#60a5fa','화과':'#c084fc','화기':'#f87171'};
var ZW_PALACE_ORDER=['명궁','형제궁','부처궁','자녀궁','재백궁','질액궁','천이궁','노복궁','관록궁','전택궁','복덕궁','부모궁'];
var ZW_PALACE_ICON={'명궁':'👤','형제궁':'🤝','부처궁':'💑','자녀궁':'🌱','재백궁':'💰','질액궁':'❤️‍🩹','천이궁':'✈️','노복궁':'🌐','관록궁':'🏆','전택궁':'🏠','복덕궁':'✨','부모궁':'🙏'};

/* 12궁 요약 테이블 HTML 문자열 생성 (팝업·하단 패널 공용) */
function buildZwSummaryTableHtml(palace) {
  if(!palace) return '';
  var ZHI_ORD=['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
  function getCleanStarName(rawStr){return rawStr.replace(/<[^>]*>/g,'').replace(/\(차성\)/g,'').trim().split(' ')[0];}
  function getSihua(rawStr){var m=rawStr.match(/화록|화권|화과|화기/);return m?m[0]:null;}
  function getBr(sn,z){return(ZW_BRIGHTNESS[sn]&&ZW_BRIGHTNESS[sn][z])?ZW_BRIGHTNESS[sn][z]:'평';}
  function getBrTag(b){
    var c={'묘':'#4ade80','왕':'#60a5fa','평':'#94a3b8','함':'#f87171'};
    var bg={'묘':'rgba(74,222,128,0.15)','왕':'rgba(96,165,250,0.15)','평':'rgba(148,163,184,0.1)','함':'rgba(248,113,113,0.15)'};
    return '<span style="color:'+c[b]+';background:'+bg[b]+';padding:1px 5px;border-radius:3px;font-size:0.68rem;font-weight:700">'+b+'</span>';
  }
  function genSummary(gungName,mainStars,zhi,sh,auxStars){
    if(!mainStars.length) return '공궁(空宮) — 대궁 차성 차용. 변통·적응력 강하나 주체성 확립이 과제';
    var star=mainStars[0],kw=ZW_STAR_KW[star]||star,br=getBr(star,zhi);
    var isDual=(mainStars.length>1);
    var brightPart={묘:'강하게 발현',왕:'최강 발현',평:'보통 수준',함:'억압·약화'}[br]||'작동';
    var dualNote=isDual?' + '+ZW_STAR_KW[mainStars[1]]:'';
    var advPart='';
    if(sh==='화기') advPart=' ☛ '+ZW_GUNG_DEF[gungName]+' — 손실·구설·장애 最주의. 과욕 금물';
    else if(sh==='화록') advPart=(br==='묘'||br==='왕')?' ☛ '+ZW_GUNG_DEF[gungName]+' 대길. 재물·인연 자연 유입':' ☛ '+ZW_GUNG_DEF[gungName]+' 화록 보정 — 부침 후 이익 회수 가능';
    else if(sh==='화권') advPart=(br==='묘'||br==='왕')?' ☛ '+ZW_GUNG_DEF[gungName]+' 권위·주도권 극대화. 리더십 발휘':' ☛ '+ZW_GUNG_DEF[gungName]+' 화권 보정 — 실력 인정받으나 독단 주의';
    else if(sh==='화과') advPart=' ☛ '+ZW_GUNG_DEF[gungName]+' 명성·시험운 길. 학술·자격 분야 빛남';
    else if(br==='묘'||br==='왕') advPart=' ☛ '+ZW_GUNG_DEF[gungName]+' 자력 발휘. 능동적 주도 전략 유효';
    else if(br==='함') advPart=' ☛ '+ZW_GUNG_DEF[gungName]+' 에너지 손실 주의. 저력형 역발상 필요';
    else advPart=' ☛ '+ZW_GUNG_DEF[gungName]+' 안정 유지. 강제 확장 불필요';
    var goodAux=['천괴','천월','좌보','우필','문창','문곡','녹존','천마'];
    var auxNote='';
    if(auxStars.length){var ga=auxStars.filter(function(a){return goodAux.indexOf(a)>=0;});if(ga.length)auxNote=' ['+ga.slice(0,2).join('·')+' 후원]';}
    return kw+(isDual?dualNote:'')+' <b>'+brightPart+'</b>'+auxNote+advPart;
  }

  var rows='';
  for(var pi=0;pi<ZW_PALACE_ORDER.length;pi++){
    var pName=ZW_PALACE_ORDER[pi];
    var zhi=palace.palaces[pName]; if(!zhi) continue;
    var zhiIdx=ZHI_ORD.indexOf(zhi);
    var stObj=palace.stars[zhiIdx]||{main:[],aux:[],bad:[]};
    var mainClean=stObj.main.map(getCleanStarName).filter(function(s){return !!s;});
    var mainSihua=null;
    for(var k=0;k<stObj.main.length;k++){var sh2=getSihua(stObj.main[k]);if(sh2){mainSihua=sh2;break;}}
    for(var k=0;k<stObj.aux.length;k++){var sh2=getSihua(stObj.aux[k]);if(sh2&&!mainSihua){mainSihua=sh2;break;}}
    var auxClean=stObj.aux.map(getCleanStarName).filter(function(s){return !!s;});
    var badClean=stObj.bad.map(getCleanStarName).filter(function(s){return !!s;});
    var starsDisp='';
    if(mainClean.length){
      starsDisp=mainClean.map(function(s,idx2){
        var sh3=idx2<stObj.main.length?getSihua(stObj.main[idx2]):null;
        var b2=ZW_BRIGHTNESS[s]?getBr(s,zhi):'평';
        var text=s+getBrTag(b2);
        if(sh3) text+='<span style="color:'+ZW_SIHUA_COLOR[sh3]+';font-weight:900;font-size:0.68rem;margin-left:2px">'+ZW_SIHUA_LABEL[sh3]+'</span>';
        return text;
      }).join('<br>');
    } else {
      starsDisp='<span style="color:#64748b;font-style:italic">공궁</span>';
    }
    var auxDisp='';
    if(auxClean.length) auxDisp+='<span style="color:#93c5fd;font-size:0.72rem">'+auxClean.slice(0,3).join(' ')+'</span>';
    if(badClean.length) auxDisp+=(auxDisp?'<br>':'')+'<span style="color:#fca5a5;font-size:0.72rem">'+badClean.slice(0,2).join(' ')+'</span>';
    var summaryText=genSummary(pName,mainClean,zhi,mainSihua,auxClean);
    var rowBg=pName==='명궁'?'rgba(196,181,253,0.12)':(pi%2===0?'rgba(255,255,255,0.03)':'rgba(0,0,0,0.2)');
    var icon=ZW_PALACE_ICON[pName]||'◆';
    var borderStyle=mainSihua==='화기'?'border-left:3px solid #f87171':(mainSihua?'border-left:3px solid #4ade80':'border-left:3px solid transparent');
    rows+='<tr style="background:'+rowBg+';'+borderStyle+'">';
    rows+='<td style="padding:9px 10px;white-space:nowrap;font-weight:800;color:#d8b4fe;font-size:0.82rem;vertical-align:top">'+icon+' '+pName+'<br><span style="color:#64748b;font-size:0.67rem;font-weight:400">'+ZW_GUNG_DEF[pName]+'</span></td>';
    rows+='<td style="padding:9px 10px;color:#fde68a;font-size:0.81rem;vertical-align:top;line-height:1.8">'+starsDisp+'</td>';
    rows+='<td style="padding:9px 10px;font-size:0.73rem;color:#94a3b8;vertical-align:top">'+auxDisp+'</td>';
    rows+='<td style="padding:9px 10px;font-size:0.78rem;color:#e2e8f0;line-height:1.6;vertical-align:top">'+summaryText+'</td>';
    rows+='</tr>';
  }

  return '<div style="padding:8px 12px 6px;font-size:0.71rem;color:#64748b;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;gap:14px;flex-wrap:wrap">'
    +'<span>밝기: <b style="color:#4ade80">묘</b>=최상 · <b style="color:#60a5fa">왕</b>=강 · <b style="color:#94a3b8">평</b>=보통 · <b style="color:#f87171">함</b>=약</span>'
    +'<span>사화: <b style="color:#4ade80">화록▲</b>=재물·인연 · <b style="color:#60a5fa">화권▲</b>=권위 · <b style="color:#c084fc">화과▲</b>=명성 · <b style="color:#f87171">화기▼</b>=주의</span>'
    +'</div>'
    +'<div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;min-width:540px">'
    +'<thead><tr style="background:rgba(88,28,220,0.3)">'
    +'<th style="padding:8px 10px;text-align:left;color:#c084fc;font-size:0.74rem;white-space:nowrap">궁(宮) · 정의</th>'
    +'<th style="padding:8px 10px;text-align:left;color:#c084fc;font-size:0.74rem">주성(밝기)</th>'
    +'<th style="padding:8px 10px;text-align:left;color:#c084fc;font-size:0.74rem;white-space:nowrap">보조성</th>'
    +'<th style="padding:8px 10px;text-align:left;color:#c084fc;font-size:0.74rem">천기(天機) — 통변 요약</th>'
    +'</tr></thead>'
    +'<tbody>'+rows+'</tbody>'
    +'</table></div>';
}

function