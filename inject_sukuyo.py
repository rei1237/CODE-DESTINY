import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add ACC-SUKUYO in GROUPS
groups_target = "var GROUPS = ["
groups_inject = """var GROUPS = [
    { id:'acc-sukuyo', emoji:'💫', title:'숙요점 & 퀀텀 명리', open:false, color:'#c084fc', lite:'#9333ea', bg:'rgba(250,245,255,1)' },"""
if "{ id:'acc-sukuyo'" not in text:
    text = text.replace(groups_target, groups_inject)

# 2. Add SUKUYO_IDS and moveCard
if "var SUKUYO_IDS" not in text:
    text = re.sub(r'(var LOTTO_IDS\s*=\s*\[\'lottoCard\'\];)', r"\1\n  var SUKUYO_IDS = ['sukuyoCard'];", text)

if "SUKUYO_IDS.forEach" not in text:
    text = re.sub(
        r'(LOTTO_IDS\.forEach\(function\(id\)\s*\{\s*moveCard\(id,\s*\'acc-lotto\'\);\s*\}\);)',
        r"\1\n    SUKUYO_IDS.forEach(function(id) { moveCard(id, 'acc-sukuyo'); });",
        text
    )

# 3. Add html block for sukuyoCard
html_block = """
    <!-- 6-4. 숙요점 & 퀀텀 명리 -->
    <section class="card" id="sukuyoCard" style="display:none" aria-labelledby="sukuyoTitle">
      <h3 id="sukuyoTitle" class="sec-title" style="color: #9333ea;">💫 숙요점 & 퀀텀 명리 대시보드</h3>
      <div id="sukuyoSection"></div>
    </section>
"""
if 'id="sukuyoCard"' not in text:
    text = re.sub(r'(<section\s+class="card"\s+id="lottoCard"[\s\S]*?</section>)', r'\1\n' + html_block, text)

# 4. Add QuantumFortuneEngine & renderSukuyo
script_block = """
/* ─────────────────────────────────────────────────────────
 * LUNAR-SOLAR HYBRID ENGINE: SUKUYO & QUANTUM SAJU
 * ───────────────────────────────────────────────────────── */
function QuantumFortuneEngine(lunarObj, bazi, natal, p) {
    var LUNAR_MONTH_START_MANSION = [
        0, // index 0 unused
        22, // 1월: 실(室)
        24, // 2월: 규(奎)
        26, // 3월: 위(胃)
        1,  // 4월: 묘(昴)
        3,  // 5월: 자(觜)
        5,  // 6월: 귀(鬼)
        7,  // 7월: 성(星)
        9,  // 8월: 익(翼)
        11, // 9월: 각(角)
        13, // 10월: 저(氐)
        15, // 11월: 심(心)
        17  // 12월: 두(斗)
    ];

    var MANSIONS = [
        { name: "각(角)", jp: "Kaku", elem: "목", keyword: "사교성, 인기" },
        { name: "항(亢)", jp: "Ko", elem: "금", keyword: "리더십, 저항" },
        { name: "저(氐)", jp: "Tei", elem: "토", keyword: "의지, 배짱" },
        { name: "방(房)", jp: "Bo", elem: "일", keyword: "카리스마, 재물" },
        { name: "심(心)", jp: "Shin", elem: "월", keyword: "인애, 다정" },
        { name: "미(尾)", jp: "Bi", elem: "화", keyword: "투쟁, 집념" },
        { name: "기(箕)", jp: "Ki", elem: "수", keyword: "모험, 개척" },
        { name: "두(斗)", jp: "To", elem: "목", keyword: "영적, 명예" },
        // 우(牛) 제외 (27숙 체계)
        { name: "여(女)", jp: "Jo", elem: "토", keyword: "학구, 지적" },
        { name: "허(虛)", jp: "Kyo", elem: "일", keyword: "복잡, 비애" },
        { name: "위(危)", jp: "Ki", elem: "월", keyword: "자유, 반항" },
        { name: "실(室)", jp: "Shitsu", elem: "화", keyword: "자신감, 호탕" },
        { name: "벽(壁)", jp: "Heki", elem: "수", keyword: "학문, 신뢰" },
        { name: "규(奎)", jp: "Kei", elem: "목", keyword: "진정성, 가업" },
        { name: "루(婁)", jp: "Ro", elem: "금", keyword: "순수, 봉사" },
        { name: "위(胃)", jp: "I",  elem: "토", keyword: "야심, 돌파" },
        { name: "묘(昴)", jp: "Bo", elem: "일", keyword: "재치, 유머" },
        { name: "필(畢)", jp: "Hitsu", elem: "월", keyword: "안정, 우직" },
        { name: "자(觜)", jp: "Shi", elem: "화", keyword: "언변, 설득" },
        { name: "삼(參)", jp: "San", elem: "수", keyword: "지성, 호기심" },
        { name: "정(井)", jp: "Sei", elem: "목", keyword: "감성, 감수성" },
        { name: "귀(鬼)", jp: "Ki",  elem: "금", keyword: "변덕, 영감" },
        { name: "류(柳)", jp: "Ryu", elem: "토", keyword: "열정, 집착" },
        { name: "성(星)", jp: "Sei", elem: "일", keyword: "독립, 고고함" },
        { name: "장(張)", jp: "Cho", elem: "월", keyword: "화려, 권위" },
        { name: "익(翼)", jp: "Yoku", elem: "화", keyword: "온화, 조화" },
        { name: "진(軫)", jp: "Shin", elem: "수", keyword: "이동, 신속" }
    ];

    // 1. Sukuyo Logic
    var lm = lunarObj ? lunarObj.month : 1;
    var ld = lunarObj ? lunarObj.day : 1;
    var startIdx = LUNAR_MONTH_START_MANSION[lm] || 0;
    var myMansionIdx = (startIdx + ld - 1) % 27;
    var myMansion = MANSIONS[myMansionIdx];

    // 2. Quantum Score Calculation
    // Use Elements from natal
    var quantumBase = 50; 
    var maxElem = Math.max(natal.counts.wood, natal.counts.fire, natal.counts.earth, natal.counts.metal, natal.counts.water);
    var balanceBonus = maxElem <= 3 ? 20 : 0; // Better balance -> higher base
    
    // Day luck (Pseudo sync based on today's day)
    var todayStr = new Date().toISOString().slice(0,10);
    var pseudoHash = (myMansionIdx * 7 + parseInt(todayStr.slice(8,10)) * 13) % 30;
    var finalSync = quantumBase + balanceBonus + pseudoHash;
    if (finalSync > 100) finalSync = 100;

    return {
        mansion: myMansion,
        sync: finalSync,
        metadata: {
            item: ["크리스탈 오브제", "은제 반지", "만년필", "딥우드 향수", "가죽 다이어리", "네이비 실크 타이"][pseudoHash % 6],
            color: ['#f87171', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#f472b6'][myMansionIdx % 6]
        }
    };
}

function renderSukuyo(p, natal, bazi, lunarObj) {
    var area = document.getElementById('sukuyoSection');
    var card = document.getElementById('sukuyoCard');
    if (!area || !card || !lunarObj) return;

    var result = QuantumFortuneEngine(lunarObj, bazi, natal, p);
    var m = result.mansion;

    var html = `
    <style>
      .sukuyo-container {
        font-family: 'Pretendard', sans-serif;
        background: rgba(20, 10, 30, 0.6);
        border: 1px solid rgba(147, 51, 234, 0.4);
        border-radius: 16px;
        padding: 20px;
        color: #fff;
        backdrop-filter: blur(12px);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(147, 51, 234, 0.1);
        text-align: center;
        overflow: hidden;
        position: relative;
      }
      .sy-gauge-wrap {
        position: relative;
        width: 140px;
        height: 140px;
        margin: 10px auto 20px;
      }
      .sy-gauge-bg {
        fill: none;
        stroke: rgba(255, 255, 255, 0.1);
        stroke-width: 8;
      }
      .sy-gauge-fg {
        fill: none;
        stroke: url(#sy-grad);
        stroke-width: 8;
        stroke-linecap: round;
        stroke-dasharray: 400;
        stroke-dashoffset: ${400 - (400 * result.sync / 100)};
        transition: stroke-dashoffset 1.5s ease-in-out;
        transform: rotate(-90deg);
        transform-origin: 50% 50%;
      }
      .sy-gauge-text {
        position: absolute;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        font-size: 1.8rem;
        font-weight: 800;
        color: #e9d5ff;
        text-shadow: 0 0 10px rgba(147, 51, 234, 0.6);
      }
      .sy-sub-text {
        font-size: 0.7rem;
        color: #cbd5e1;
        margin-top: 4px;
        display: block;
      }
      .sy-mansion-box {
        background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(0,0,0,0.2));
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 12px;
        padding: 15px;
        margin-bottom: 20px;
      }
      .sy-mansion-title {
        font-size: 1.4rem;
        color: #fca5a5;
        font-weight: 700;
        margin-bottom: 8px;
        letter-spacing: 2px;
      }
      .sy-mansion-keyword {
        background: #4c1d95;
        color: #fff;
        padding: 4px 10px;
        border-radius: 20px;
        font-size: 0.8rem;
        display: inline-block;
        margin-bottom: 15px;
      }
      .sy-mansion-desc {
        font-size: 0.9rem;
        color: #cbd5e1;
        line-height: 1.5;
        word-break: keep-all;
      }
      .sy-item-box {
        display: flex;
        justify-content: space-around;
        background: rgba(0,0,0,0.3);
        padding: 12px;
        border-radius: 10px;
      }
      .sy-item {
        font-size: 0.85rem;
      }
      .sy-item span {
        display: block;
        font-size: 1.1rem;
        margin-bottom: 5px;
      }
    </style>

    <div class="sukuyo-container">
      <svg width="0" height="0">
        <defs>
          <linearGradient id="sy-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f472b6" />
            <stop offset="100%" stop-color="#9333ea" />
          </linearGradient>
        </defs>
      </svg>
      
      <div style="font-size: 1rem; color: #a78bfa; font-weight: 600; margin-bottom: 5px;">오늘의 퀀텀 싱크로율</div>
      <div class="sy-gauge-wrap">
        <svg width="140" height="140" viewBox="0 0 140 140">
          <circle class="sy-gauge-bg" cx="70" cy="70" r="63"></circle>
          <circle class="sy-gauge-fg" cx="70" cy="70" r="63"></circle>
        </svg>
        <div class="sy-gauge-text">${result.sync}%</div>
      </div>

      <div class="sy-mansion-box">
        <div class="sy-mansion-title">본명숙: ${m.name}</div>
        <div class="sy-mansion-keyword">핵심 키워드 • ${m.keyword}</div>
        <div class="sy-mansion-desc">
          태어난 음력일을 기준으로 도출된 당신의 별자리는 <b>${m.name}</b>입니다. 
          이 별자리는 일본 고전 숙요점 체계에서 <b>${m.elem}</b>의 기운을 담고 있으며, 깊은 무의식 안에 <b>[${m.keyword}]</b>의 에너지가 내재되어 있음을 의미합니다.
          사주 원국의 오행과 결합된 퀀텀 점수에 따르면, 오늘은 당신만의 독특한 매력을 발산하기에 최적화된 우주적 타이밍입니다.
        </div>
      </div>

      <div class="sy-item-box">
        <div class="sy-item"><span>✨</span>행운의 아이템<br><b>${result.metadata.item}</b></div>
        <div class="sy-item"><span>🎨</span>오러(Aura) 컬러<br><b style="color:${result.metadata.color}">${result.metadata.color.toUpperCase()}</b></div>
      </div>
    </div>
    `;

    area.innerHTML = html;
    card.style.display = 'block';
}
"""
if "function renderSukuyo" not in text:
    text = re.sub(r'(function renderLottoNumbers.*?\n\}\n)', r'\1\n' + script_block, text, flags=re.DOTALL)

# 5. Inject renderSukuyo call in calculate()
call_inject = """renderLottoNumbers(natal, bazi);
      if(typeof lunarDateObj !== 'undefined') {
          renderSukuyo(p, natal, bazi, lunarDateObj);
      }"""
if "renderSukuyo(" not in text:
    text = text.replace("renderLottoNumbers(natal, bazi);", call_inject)


with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
