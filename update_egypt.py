import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Add CSS for `.feature-card--egypt` and its CTA
css_to_add = """
.feature-card--egypt { border-bottom: 3px solid #d4af37; }
.feature-card--egypt .feature-card__cta { background: linear-gradient(135deg, #d4af37, #b8860b); }
"""

# Find where to inject CSS
# Look for `.feature-card--tazza`
css_pattern = r'(\.feature-card--tazza\s*\{\s*[^}]*\s*\})'
if re.search(css_pattern, html):
    html = re.sub(css_pattern, r'\1' + css_to_add, html, count=1)
else:
    print("Could not find .feature-card--tazza for injecting CSS")

# 2. Update Egypt Feature card CTA text
card_pattern = r'(<div class="feature-card feature-card--egypt"[\s\S]*?<span class="feature-card__cta">)(.*?)(</span>)'
if re.search(card_pattern, html):
    html = re.sub(card_pattern, r'\1신탁보러 가기\3', html)
else:
    print("Could not find Egypt feature card to update CTA text")

# 3. Replace Egypt Oracle logic
# This part replaces KEMET_GODS and the functions openKemetModal, closeKemetModal, analyzeKemetKeyword, startKemetOracle, showKemetResult
# with the new 3-card spread implementation

new_script = """
/* ==============================================================
   이집트 신탁 (Kemet Oracle) - 그랜드 히에로판트 3카드 스프레드
============================================================== */
const KEMET_GODS = [
  {
    god: "라 (Ra)",
    role: "태양과 창조의 신",
    icon: "𓇳",
    desc: "모든 것을 비추는 태양의 원반이 이글거립니다.",
    advice: "빛이 가장 강할 때 그림자도 짙은 법. 이글거리는 태양처럼 당신의 의지를 불태우되, 교만을 경계하십시오."
  },
  {
    god: "오시리스 (Osiris)",
    role: "부활과 영생의 신",
    icon: "𓁹",
    desc: "사후 세계의 옥좌에서 부활의 씨앗을 품고 있습니다.",
    advice: "육체가 쓰러져도 영혼은 다시 피어나리라. 지금의 고통은 끝이 아니라 새로운 시작을 위한 죽음일 뿐입니다."
  },
  {
    god: "이시스 (Isis)",
    role: "마법과 치유의 여신",
    icon: "𓆗",
    desc: "신비로운 치유의 날개를 넓게 펼치고 있습니다.",
    advice: "흩어진 조각들을 모아 다시 온전하게 만들 시간입니다. 당신 안의 마법 같은 생명력을 믿으십시오."
  },
  {
    god: "호루스 (Horus)",
    role: "복수와 수호의 신",
    icon: "𓅃",
    desc: "매의 눈으로 온 세상을 꿰뚫어 보고 있습니다.",
    advice: "흐릿한 시야를 거두고 진실을 직시하십시오. 잃어버린 권리는 오직 용기있는 쟁취를 통해서만 되찾을 수 있습니다."
  },
  {
    god: "세트 (Set)",
    role: "혼돈과 폭풍의 신",
    icon: "𓃣",
    desc: "사막의 모래폭풍 속에서 혼돈이 몰아칩니다.",
    advice: "때로는 파괴만이 묵은 것을 쓸어낼 수 있습니다. 통제할 수 없는 폭풍을 마주한다면, 차라리 그 바람을 타십시오."
  },
  {
    god: "토트 (Thoth)",
    role: "지혜와 달의 신",
    icon: "𓁟",
    desc: "파피루스 두루마리에 우주의 진리를 기록하고 있습니다.",
    advice: "감정에 휩쓸리지 말고 서기의 펜처럼 냉철하게 상황을 기록하십시오. 답은 이미 당신의 내면 깊은 곳에 도서관에 있습니다."
  },
  {
    god: "아누비스 (Anubis)",
    role: "죽음과 방부의 신",
    icon: "𓃢",
    desc: "영혼의 저울 앞에서 마다트의 깃털을 가늠하고 있습니다.",
    advice: "과거의 망령에 얽매이지 마십시오. 미련을 끊어내고 다음 단계로 나아갈 때, 당신의 영혼은 한결 가벼워질 것입니다."
  },
  {
    god: "하토르 (Hathor)",
    role: "사랑과 기쁨의 여신",
    icon: "𓁷",
    desc: "음악과 춤 속에 별빛 같은 환희가 흐릅니다.",
    advice: "너무 굳은 표정은 운도 피해가게 만듭니다. 삶의 기쁨과 사랑을 받아들이고 풍요를 마음에 허락하십시오."
  },
  {
    god: "바스테트 (Bastet)",
    role: "가정과 쾌락의 여신",
    icon: "𓃠",
    desc: "우아한 고양이의 모습으로 안락을 수호합니다.",
    advice: "조용히 웅크리고 있을 때와 발톱을 드러낼 때를 구분하십시오. 지금은 고요히 당신의 영역을 지키며 안정을 취할 때입니다."
  },
  {
    god: "세크메트 (Sekhmet)",
    role: "전쟁과 파괴의 여신",
    icon: "𓁦",
    desc: "피에 굶주린 암사자의 분노가 타오릅니다.",
    advice: "당신의 분노는 정당할지 몰라도 파괴의 불길은 자신마저 삼킬 수 있습니다. 끓어오르는 불길을 창조의 에너지로 돌리십시오."
  },
  {
    god: "마아트 (Ma'at)",
    role: "진리와 정의의 여신",
    icon: "𓆄",
    desc: "단 하나의 타조 깃털로 우주의 균형을 무겁게 단죄합니다.",
    advice: "우주의 법칙은 속일 수 없습니다. 거짓된 변명을 거두고 스스로의 진실 앞에 당당히 섰을 때 길은 열립니다."
  },
  {
    god: "아문 (Amun)",
    role: "숨겨진 자, 신들의 왕",
    icon: "𓇋",
    desc: "보이지 않는 바람처럼 만물에 깃들어 있습니다.",
    advice: "가장 거대한 힘은 눈에 보이지 않는 법입니다. 겉으로 드러나는 것에 연연하지 말고 보이지 않는 흐름을 신뢰하십시오."
  }
];

function openKemetModal() {
  const m = document.getElementById('kemetModalOverlay');
  if(m) m.style.display = 'block';
}

function closeKemetModal() {
  const m = document.getElementById('kemetModalOverlay');
  const resultDiv = document.getElementById('kemetResult');
  const inputEl = document.getElementById('kemetInput');
  const loader = document.getElementById('kemetLoading');

  if(m) m.style.display = 'none';
  if(resultDiv) resultDiv.style.display = 'none';
  if(inputEl) inputEl.value = '';
  if(loader) loader.style.display = 'none';
}

function startKemetOracle() {
  const inputEl = document.getElementById('kemetInput');
  const qStr = (inputEl.value || '').trim();

  if(qStr.length < 2) {
    alert("아문-라의 제단에 올릴 질문을 세 글자 이상으로 적어주십시오.");
    inputEl.focus();
    return;
  }

  const resultDiv = document.getElementById('kemetResult');
  const loader = document.getElementById('kemetLoading');

  resultDiv.style.display = 'none';
  loader.style.display = 'flex';

  setTimeout(() => {
    loader.style.display = 'none';
    showKemetSpread(qStr);
  }, 1800);
}

function getRandomGods(count) {
  const shuffled = [...KEMET_GODS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function showKemetSpread(userInput) {
  const resultDiv = document.getElementById('kemetResult');
  resultDiv.style.display = 'block';
  
  // Choose 3 Gods
  const selectedGods = getRandomGods(3);
  const pastGod = selectedGods[0];
  const presentGod = selectedGods[1];
  const futureGod = selectedGods[2];

  resultDiv.innerHTML = `
    <div style="text-align:center; padding: 20px 0; border-bottom: 2px solid #d4af37; margin-bottom: 25px;">
      <h3 style="color:#d4af37; font-size:1.4rem; margin-bottom:10px;">📜 아문-라 신전의 대사제</h3>
      <p style="color:#eee; font-style:italic; line-height:1.5; opacity:0.9;">
        "필멸자여, 그대가 올린 <strong>[&#39;${userInput}&#39;]</strong>라는 물음은 나일강의 탁한 물결처럼 현세의 고뇌로구나.<br>
        나, 아마르나의 대사제가 신성한 무덤의 봉인을 열고 세 장의 파피루스를 펼친다. <br>
        눈을 감고 고대 신들의 목소리에 귀를 기울이라."
      </p>
    </div>

    <div style="display:flex; flex-direction:column; gap:20px;">
      <div style="background:rgba(255,255,255,0.05); padding:15px; border-radius:8px; border-left:4px solid #8b5cf6;">
        <h4 style="color:#a78bfa; margin-bottom:8px; font-size:1.1rem;">⏳ 제1 파피루스 : 과거의 그림자</h4>
        <p style="margin-bottom:8px; font-size:1.2rem; font-weight:bold;">${pastGod.icon} ${pastGod.god} - ${pastGod.role}</p>
        <p style="color:#ccc; font-size:0.9rem; margin-bottom:8px;"><em>상황: ${pastGod.desc}</em></p>
        <p style="color:#fff; line-height:1.4;">${pastGod.advice}</p>
      </div>

      <div style="background:rgba(255,255,255,0.05); padding:15px; border-radius:8px; border-left:4px solid #f59e0b;">
        <h4 style="color:#fbbf24; margin-bottom:8px; font-size:1.1rem;">👁️‍🗨️ 제2 파피루스 : 현재의 시련</h4>
        <p style="margin-bottom:8px; font-size:1.2rem; font-weight:bold;">${presentGod.icon} ${presentGod.god} - ${presentGod.role}</p>
        <p style="color:#ccc; font-size:0.9rem; margin-bottom:8px;"><em>상황: ${presentGod.desc}</em></p>
        <p style="color:#fff; line-height:1.4;">${presentGod.advice}</p>
      </div>

      <div style="background:rgba(255,255,255,0.05); padding:15px; border-radius:8px; border-left:4px solid #10b981;">
        <h4 style="color:#34d399; margin-bottom:8px; font-size:1.1rem;">✨ 제3 파피루스 : 미래의 명령</h4>
        <p style="margin-bottom:8px; font-size:1.2rem; font-weight:bold;">${futureGod.icon} ${futureGod.god} - ${futureGod.role}</p>
        <p style="color:#ccc; font-size:0.9rem; margin-bottom:8px;"><em>상황: ${futureGod.desc}</em></p>
        <p style="color:#fff; line-height:1.4;">${futureGod.advice}</p>
      </div>
    </div>

    <div style="margin-top:25px; padding:15px; background:rgba(212, 175, 55, 0.1); border:1px solid rgba(212, 175, 55, 0.3); border-radius:8px; text-align:center;">
      <p style="color:#d4af37; font-weight:bold; margin-bottom:8px;">⚖️ 사제의 결론</p>
      <p style="color:#eee; line-height:1.5;">
        "마아트의 진실된 깃털은 이미 심판의 저울(⚖️)을 기울였도다.<br>
        나일강이 범람과 가뭄을 반복하듯, 이 시련 역시 정해진 주기의 일부이니라. <br>
        두려움을 거두고, 신탁이 가리키는 파피루스의 길을 따르거라."
      </p>
    </div>
  `;
}
"""

js_block_pattern = r'/\* ==============================================================\s*이집트 신탁 \(Kemet Oracle\).*?function showKemetResult[^\}]+\}[\s\n]*(?=\/\* ===)'

if re.search(js_block_pattern, html, flags=re.DOTALL):
    html = re.sub(js_block_pattern, new_script + "\n", html, flags=re.DOTALL)
else:
    # Try more lenient match
    js_block_pattern = r'const KEMET_GODS = \[[\s\S]*?function showKemetResult\([^\)]*\)\s*\{[\s\S]*?\n\s*\}[ \t]*'
    if re.search(js_block_pattern, html):
        html = re.sub(js_block_pattern, new_script + "\n", html)
    else:    
        print("Could not find the old Kemet JS block to replace")


with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Finished!")
