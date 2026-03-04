import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. GROUPS Update
groups_match = re.search(r"\{\s*id:'acc-astro',\s*emoji:'\u2728'.*?\}", text)
if groups_match:
    old_astro = groups_match.group(0)
    new_egypt = old_astro + ",\n    { id:'acc-egypt',  emoji:'𓂀', title:'이집트 오라클', open:true, color:'#D4AF37', lite:'#b49129', bg:'rgba(243,229,171,0.2)' }"
    text = text.replace(old_astro, new_egypt)
    print('GROUPS updated')

# 2. EGYPT_IDS
text = text.replace("var SUKUYO_IDS = ['sukuyoCard'];", "var SUKUYO_IDS = ['sukuyoCard'];\n  var EGYPT_IDS = ['egyptCard'];")

# 3. moveAll
text = text.replace("SUKUYO_IDS.forEach(function(id) { moveCard(id, 'acc-sukuyo'); });", "SUKUYO_IDS.forEach(function(id) { moveCard(id, 'acc-sukuyo'); });\n    EGYPT_IDS.forEach(function(id) { moveCard(id, 'acc-egypt'); });")

# 4. Inject HTML Card
html_card = """
    <!-- 이집트 점 -->
    <section class="card" id="egyptCard" style="display:none" aria-labelledby="egyptTitle">
      <h3 id="egyptTitle" class="sec-title" style="color: #D4AF37;">𓂀 고대 이집트 오라클 (Eye of Horus)</h3>
      <div id="egyptSection"></div>
    </section>
"""
text = text.replace('<!-- 6-4. 숙요점 & 퀀텀 명리 -->', html_card + '\n    <!-- 6-4. 숙요점 & 퀀텀 명리 -->')

logic_str = """
/* ══════════════════════════════════════════
   고대 이집트 오라클 (Eye of Horus) Engine
══════════════════════════════════════════ */
function EgyptianOracleCore(year, month, day, natal) {
    var EGYPTIAN_DECANS = [
        { deity: "아몬-라 (Amon-Ra)", desc: "태양과 창조의 근원. 강력한 자아실현의 의지와 무한한 잠재력." },
        { deity: "오시리스 (Osiris)", desc: "부활과 영원. 끝없는 재생의 순환 속에서 피어나는 권능." },
        { deity: "이시스 (Isis)", desc: "마법과 치유. 부드럽지만 절대 꺾이지 않는 신성한 포용력." },
        { deity: "토트 (Thoth)", desc: "지혜와 진리. 차가운 이성과 운명의 도서관을 기록하는 수호자." },
        { deity: "호루스 (Horus)", desc: "질서와 승리. 모든 위협을 꿰뚫어보는 매의 눈과 압도적 지배력." },
        { deity: "아누비스 (Anubis)", desc: "죽음과 전이. 필멸의 경계를 넘나들며 진실을 이끄는 안내자." },
        { deity: "세트 (Seth)", desc: "혼돈과 사막. 파괴적인 모험을 불사하는 절대적인 힘의 화신." },
        { deity: "마아트 (Ma'at)", desc: "진실과 정의. 어떠한 편견에도 흔들리지 않는 우주적 균형과 질서." },
        { deity: "하토르 (Hathor)", desc: "아름다움과 사랑. 삶의 기쁨을 증폭시키는 풍요로운 생명력." },
        { deity: "바스트 (Bastet)", desc: "음악과 환희. 관능적이고 직관적인 에너지 속의 맹렬한 수호." },
        { deity: "세크메트 (Sekhmet)", desc: "전쟁과 수호. 타오르는 태양의 불꽃처럼 압도적인 돌파력." },
        { deity: "프타 (Ptah)", desc: "건축과 창조. 고도의 영감으로 현실의 뼈대를 주조하는 장인정신." }
    ];

    var EGYPTIAN_HIEROGLYPHS = [
        { symbol: "𓋹", name: "Ankh (앙크)", meaning: "영원한 생명력의 숨결이 당신의 궤도를 휘감고 있습니다." },
        { symbol: "𓊽", name: "Djed (제드)", meaning: "흔들리지 않는 척추 메타포, 절대적인 심리적 안정감이 구축될 시점입니다." },
        { symbol: "𓌀", name: "Was (와스)", meaning: "통제력과 절대적 권능. 당신의 뚜렷한 의지가 현실의 형태를 규정합니다." },
        { symbol: "𓂀", name: "Udjat (우자트)", meaning: "모든 것을 꿰뚫어보는 혜안. 불확실성의 안개 속에서 명확한 활로를 발견합니다." },
        { symbol: "𓆣", name: "Scarab (스카라브)", meaning: "아침의 태양을 밀어올리는 재생. 창조적 파괴 이후 위대한 부활의 모멘텀입니다." },
        { symbol: "𓍶", name: "Shen (셴)", meaning: "무한한 보호의 궤도. 인간적 한계를 초월하여 뻗어나가는 영적 에너지입니다." }
    ];

    var bd = new Date(year, Math.max(0, month-1), day);
    var startOfYear = new Date(year, 0, 0);
    var diffMs = bd - startOfYear;
    var dayOfYear = Math.floor(diffMs / 86400000) || 1;
    var decanIndex = Math.floor(dayOfYear / 10) % 36;
    var deityIndex = decanIndex % 12;
    var patronDeity = EGYPTIAN_DECANS[deityIndex];

    var now = new Date();
    var currentDayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000) || 1;
    var currentDecan = Math.floor(currentDayOfYear / 10) % 36;
    var interference = Math.abs(decanIndex - currentDecan);

    var counts = natal.counts || {wood:0,fire:0,earth:0,metal:0,water:0};
    var maxElem = Math.max(counts.wood, counts.fire, counts.earth, counts.metal, counts.water);
    
    var balanceSync = (5 - maxElem) * 12; 
    if(balanceSync < 0) balanceSync = 0;
    var timeSync = 40 - (interference % 18) * 2;
    var pseudoRandom = (year * 7 + month * 13 + day * 17) % 20;

    var maatScore = balanceSync + timeSync + pseudoRandom;
    if (maatScore > 99) maatScore = 99;
    if (maatScore < 33) maatScore = 33;

    var hIndex = (maatScore + dayOfYear) % EGYPTIAN_HIEROGLYPHS.length;
    var hieroglyph = EGYPTIAN_HIEROGLYPHS[hIndex];

    var insight = "우주의 질서 마아트(Ma'at)가 당신의 시공간을 비추고 있습니다. 수호신 <b style='color:#F3E5AB'>" + patronDeity.deity + "</b>의 강력한 파동이 현재 태양계의 정렬과 <b>" + maatScore + "%</b>의 고밀도로 공명하고 있습니다.";

    return {
        PatronDeity: patronDeity,
        MaatSyncRate: maatScore,
        DailyHieroglyph: hieroglyph,
        QuantumInsight: insight
    };
}

function renderEgyptianOracle(year, month, day, natal) {
    var area = document.getElementById('egyptSection');
    var card = document.getElementById('egyptCard');
    if (!area || !card) return;

    var res = EgyptianOracleCore(year, month, day, natal);
    var d = res.PatronDeity;
    var h = res.DailyHieroglyph;
    var score = res.MaatSyncRate;

    var tilt = (100 - score) * -0.25; 

    var html = `
    <style>
      .egypt-wrap {
        background: radial-gradient(circle at center, #003366 0%, #001122 100%);
        border: 1px solid rgba(212, 175, 55, 0.4);
        border-radius: 16px; padding: 24px;
        color: #F3E5AB; font-family: 'Pretendard', sans-serif;
        position: relative; overflow: hidden;
      }
      .egypt-wrap::before {
        content: ""; position: absolute; top:0; left:0; right:0; bottom:0;
        background: url('data:image/svg+xml;utf8,<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="1" fill="rgba(212,175,55,0.15)"/></svg>') repeat;
        opacity: 0.8; pointer-events: none;
      }
      .maat-scale {
        display: inline-block; font-size: 3.5rem;
        transform: rotate(${tilt}deg);
        transition: transform 2.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        color: #D4AF37; text-shadow: 0 0 25px rgba(212, 175, 55, 0.8);
      }
      .egypt-glass-card {
        background: rgba(0, 20, 50, 0.5); backdrop-filter: blur(12px);
        border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 12px;
        padding: 18px; margin-bottom: 16px; text-align: center;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6); position: relative; z-index: 10;
      }
      .egypt-deity { font-size: 1.5rem; color: #D4AF37; font-weight: bold; margin-bottom: 6px; letter-spacing: 1px; }
      .egypt-hiero { font-size: 4.5rem; cursor: pointer; color: #D4AF37; transition: all 0.4s; padding:10px; }
      .egypt-hiero:hover { text-shadow: 0 0 35px #D4AF37; transform: scale(1.15); }
      .egypt-insight { line-height: 1.7; font-size: 0.98rem; color: #e2e8f0; margin-top: 12px; word-break: keep-all; font-weight: 300;}
      .btn-reveal {
        background: linear-gradient(135deg, #D4AF37 0%, #8c7324 100%); color: #011;
        border: none; padding: 12px 24px; border-radius: 30px; font-weight: 800;
        cursor: pointer; transition: 0.3s; box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);
      }
      .btn-reveal:hover { filter: brightness(1.2); box-shadow: 0 6px 20px rgba(212, 175, 55, 0.6); transform: translateY(-2px); }
    </style>
    
    <div class="egypt-wrap">
      <div style="text-align: center; margin-bottom: 24px; z-index: 10; position:relative;">
        <div style="font-size: 0.8rem; color: rgba(243, 229, 171, 0.6); letter-spacing: 3px;">THE BALANCE OF MA'AT</div>
        <div class="maat-scale">⚖️</div>
        <div style="margin-top: 5px; font-size: 1.3rem; color: #fff;">영혼의 무게 동기화: <b style="color:#D4AF37;">${score}%</b></div>
      </div>

      <div class="egypt-glass-card">
        <div style="font-size:0.8rem; color: rgba(255,255,255,0.5); letter-spacing: 2px; margin-bottom: 4px;">PATRON DEITY</div>
        <div class="egypt-deity">${d.deity}</div>
        <div style="font-size:0.9rem; color:#ccc;">${d.desc}</div>
      </div>

      <div class="egypt-glass-card" id="hieroBox">
        <div style="font-size:0.8rem; color: rgba(255,255,255,0.5); letter-spacing: 2px; margin-bottom: 10px;">DIVINE REVELATION</div>
        <div class="egypt-hiero" id="hieroSym" onclick="document.getElementById('hieroMeans').style.display='block';">✧</div>
        <div style="margin-top: 5px;">
          <button class="btn-reveal" id="btnR" onclick="document.getElementById('hieroMeans').style.display='block'; this.style.display='none'; document.getElementById('hieroSym').innerText='${h.symbol}';">상징 문자 해독하기</button>
        </div>
        <div id="hieroMeans" style="display:none; margin-top:20px; animation: fadeIn 1s ease-in-out;">
          <div style="font-size: 1.4rem; color: #D4AF37; margin-bottom:10px; font-weight:bold;">${h.name}</div>
          <div class="egypt-insight">${h.meaning}</div>
        </div>
      </div>

      <div class="egypt-insight" style="text-align:center; margin-top:20px; font-style: italic; border-top: 1px solid rgba(212,175,55,0.3); padding-top: 16px;">
        "${res.QuantumInsight}"
      </div>
    </div>
    `;

    area.innerHTML = html;
    card.style.display = 'block';
}
"""

f_idx = text.find('function renderSukuyo')
if f_idx != -1:
    text = text[:f_idx] + logic_str + '\n\n' + text[f_idx:]
    print('Logic injected')

# 6. Fix sukuyo issue
# KasiEngine might fail inside try-catch leading to undefined lunarDateObj. Let's make sure it handles null/undefined gracefully.
call_fix = "renderSukuyo(p, natal, bazi, typeof lunarDateObj !== 'undefined' ? lunarDateObj : null);"
text = re.sub(r"if\s*\(\s*typeof lunarDateObj !== 'undefined'\s*\)\s*\{\s*renderSukuyo\(p,\s*natal,\s*bazi,\s*lunarDateObj\);\s*\}", call_fix, text)

# 7. Add renderEgyptianOracle 
call_egypt = "renderQuantumStrategy(p, natal, bazi);\n    renderEgyptianOracle(year, month, day, natal);"
text = text.replace("renderQuantumStrategy(p, natal, bazi);", call_egypt)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print('Done')
