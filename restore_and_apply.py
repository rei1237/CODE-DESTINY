# coding: utf-8
import io, re

with io.open("index.html", "r", encoding="utf-8") as f:
    text = f.read()

# 1. Distribute Ads
old_core = "var CORE_IDS  = ['sajuCard','iljuCard','tenshinCard','dailyMonthlyCard','compatCard','similarCelebCard','johuCard','ukbuCard','summaryCard','daewunCard','quantumCard'];"
new_core = "var CORE_IDS  = ['sajuCard','adMiddle1','iljuCard','tenshinCard','johuCard','ukbuCard','adMiddle2','dailyMonthlyCard','summaryCard','adMiddle3','daewunCard','quantumCard','adMiddle4','compatCard','adMiddle5','similarCelebCard'];"
text = text.replace(old_core, new_core)

old_fun = "var FUN_IDS   = ['villainCard','skillTreeCard','energyCoordCard','healthReportCard','hormone-vibe-section','tTestCard','destinySection'];"
new_fun = "var FUN_IDS   = ['villainCard','adMiddle6','skillTreeCard','adMiddle7','energyCoordCard','healthReportCard','adMiddle8','hormone-vibe-section','tTestCard'];"
text = text.replace(old_fun, new_fun)

loop_pattern = r'//  Main Accordion Body Ads\s.*?\}\);[\s\r\n]*\}'
text = re.sub(loop_pattern, '', text, flags=re.DOTALL)

# 2. Add Premium CSS safely near the end of </style>
css_premium = """
/* 퀀텀 명리 엔진 업그레이드 스타일 (Premium UX) */
.quantum-mode {
  padding: 35px 25px;
  background: linear-gradient(145deg, rgba(20,25,45,0.85), rgba(30,35,65,0.95));
  border-radius: 28px;
  border: 1px solid rgba(255,255,255,0.1);
  box-shadow: 0 25px 50px rgba(0,0,0,0.6), inset 0 0 20px rgba(255,255,255,0.03);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  color: #f8fafc;
  margin-bottom: 35px;
  position: relative;
  overflow: visible;
  text-align: center;
  font-family: 'Pretendard', sans-serif;
}
.quantum-title { 
  font-size: 1.6rem; 
  font-weight: 900; 
  letter-spacing: 4px; 
  background: linear-gradient(to right, #e2e8f0, #a78bfa, #f472b6);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 10px; 
  text-transform: uppercase; 
  text-shadow: 0 2px 10px rgba(167,139,250,0.2);
}
.quantum-subtitle { font-size: 0.95rem; color: #cbd5e1; font-weight: 400; margin-bottom: 35px; letter-spacing: 0.5px; opacity: 0.9; }

/* 3D Card */
.quantum-card-scene { width: 190px; height: 280px; margin: 0 auto; perspective: 1200px; z-index: 2; position: relative; }
.quantum-card { width: 100%; height: 100%; position: relative; transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275); transform-style: preserve-3d; cursor: pointer; }
.quantum-card.flip-it { transform: rotateY(180deg) scale(1.08); box-shadow: 0 0 45px rgba(139, 92, 246, 0.5); animation: q-glow 3s infinite alternate; }
@keyframes q-glow { 
  0% { box-shadow: 0 0 35px rgba(167, 139, 250, 0.4), 0 0 15px rgba(167, 139, 250, 0.2) inset; } 
  100% { box-shadow: 0 0 55px rgba(236, 72, 153, 0.6), 0 0 25px rgba(236, 72, 153, 0.3) inset; } 
}
.quantum-card-inner { width: 100%; height: 100%; position: absolute; transform-style: preserve-3d; }
.quantum-card-front, .quantum-card-back { width: 100%; height: 100%; position: absolute; backface-visibility: hidden; border-radius: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.quantum-card-front { 
  background: linear-gradient(135deg, #0f172a, #2e1065); 
  border: 1px solid rgba(255,255,255,0.2); 
  overflow: hidden; 
  box-shadow: inset 0 0 30px rgba(0,0,0,0.5);
}
.quantum-card-back { 
  background: linear-gradient(135deg, rgba(30,41,59,0.95), rgba(15,23,42,0.95)); 
  border: 1px solid rgba(167,139,250,0.4); 
  transform: rotateY(180deg); 
  padding: 24px; 
  text-align: center; 
  backdrop-filter: blur(12px); 
}
.q-stars { position: absolute; top:0; left:0; right:0; bottom:0; background-image: radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px); background-size: 20px 20px; opacity: 0.2; }
.q-logo { font-size: 56px; font-weight: 900; color: #fff; text-shadow: 0 0 20px rgba(167, 139, 250, 1), 0 0 40px rgba(167, 139, 250, 0.6); z-index: 1; margin-bottom: 12px; }
.q-tap-text { z-index: 1; font-size: 0.85rem; color: #e2e8f0; text-transform: uppercase; letter-spacing: 4px; font-weight: 600; background: rgba(0,0,0,0.3); padding: 4px 12px; border-radius: 20px; }

/* Expanded Dashboard */
.q-dashboard { margin-top: -30px; padding-top: 50px; opacity: 0; transform: translateY(20px); transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1); display: none; }
.q-dashboard.show { opacity: 1; transform: translateY(0); }

/* Daily Pillars */
.q-pillars-wrap { display: flex; justify-content: center; gap: 20px; margin-bottom: 25px; }
.q-pillar { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 15px 20px; width: 100px; backdrop-filter: blur(5px); transition: transform 0.3s ease, background 0.3s ease; }
.q-pillar:hover { transform: translateY(-3px); background: rgba(255,255,255,0.08); }
.q-p-label { font-size: 0.7rem; color: #94a3b8; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px; }
.q-p-char { font-size: 2rem; font-weight: 700; color: #f8fafc; text-shadow: 0 0 10px rgba(255,255,255,0.3); }
.q-p-desc { font-size: 0.75rem; color: #cbd5e1; margin-top: 5px; }

/* Explanation Core */
.q-explanation { font-size: 0.9rem; line-height: 1.6; color: #e2e8f0; font-weight: 300; margin: 0 auto 30px auto; max-width: 90%; background: rgba(0,0,0,0.2); padding: 20px; border-radius: 16px; border-left: 2px solid #a78bfa; text-align: left; }
.q-explanation strong { color: #fff; font-weight: 600; }

/* Elemental Balance Chips */
.q-elements-title { font-size: 0.8rem; color: #94a3b8; letter-spacing: 2px; margin-bottom: 15px; text-transform: uppercase; }
.q-elements-row { display: flex; justify-content: center; gap: 12px; margin-bottom: 30px; flex-wrap: wrap; }
.q-chip { position: relative; width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; font-weight: 600; color: #fff; cursor: pointer; transition: all 0.3s ease; border: 1px solid rgba(255,255,255,0.2); }
.q-chip:hover { transform: scale(1.15); z-index: 10; }
.q-chip.wood { background: linear-gradient(135deg, #10b981, #047857); box-shadow: 0 0 15px rgba(16, 185, 129, 0.4); }
.q-chip.fire { background: linear-gradient(135deg, #f43f5e, #be123c); box-shadow: 0 0 15px rgba(244, 63, 94, 0.4); }
.q-chip.earth { background: linear-gradient(135deg, #eab308, #a16207); box-shadow: 0 0 15px rgba(234, 179, 8, 0.4); }
.q-chip.metal { background: linear-gradient(135deg, #94a3b8, #475569); box-shadow: 0 0 15px rgba(148, 163, 184, 0.4); }
.q-chip.water { background: linear-gradient(135deg, #3b82f6, #1d4ed8); box-shadow: 0 0 15px rgba(59, 130, 246, 0.4); }
.q-chip.active { border: 2px solid #fff; box-shadow: 0 0 25px currentColor; }

/* Tooltip */
.q-chip .q-tooltip { visibility: hidden; width: 140px; background: rgba(15,23,42,0.95); color: #f8fafc; text-align: center; border-radius: 8px; padding: 10px; position: absolute; z-index: 1; bottom: 125%; left: 50%; transform: translateX(-50%) translateY(10px); opacity: 0; transition: opacity 0.3s, transform 0.3s; border: 1px solid rgba(255,255,255,0.1); font-size: 0.75rem; font-weight: 400; line-height: 1.4; pointer-events: none; }
.q-chip .q-tooltip::after { content: ""; position: absolute; top: 100%; left: 50%; margin-left: -5px; border-width: 5px; border-style: solid; border-color: rgba(15,23,42,0.95) transparent transparent transparent; }
.q-chip:hover .q-tooltip { visibility: visible; opacity: 1; transform: translateX(-50%) translateY(0); }

/* Gaeun Prescript */
.gaeun-prescript { padding: 20px; border-radius: 16px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); box-shadow: inset 0 0 20px rgba(0,0,0,0.2); }
.gaeun-title { font-size: 0.95rem; color: #c4b5fd; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
"""
if "/* 퀀텀 명리 엔진 업그레이드 스타일 (Premium UX) */" not in text:
    text = text.replace('  </style>', css_premium + '\n  </style>')

# 3. HTML Insertion
html_insertion = """
    <!--  오늘의 운명 카드 (Premium Quantum Destiny) -->
    <div class="destiny-section quantum-mode" id="destinySection" style="display:none; margin: 20px 0;">
      <div class="quantum-wrap">
        <div class="quantum-title">Today's Destiny Card</div>
        <div class="quantum-subtitle" id="qSub">에너지 파동을 분석하기 위해 카드를 터치하세요</div>
        
        <div class="quantum-card-scene" id="qCardScene">
          <div class="quantum-card" id="qCardEl" onclick="startQuantumAnalysis()">
            <div class="quantum-card-inner" id="qCardInner">
              <div class="quantum-card-front">
                <div class="q-stars"></div>
                <div class="q-logo"></div>
                <div class="q-tap-text">Tap to Align</div>
              </div>
              <div class="quantum-card-back">
                <div style="font-size:1.8rem; margin-bottom:10px;"></div>
                <div style="font-size:1.1rem; font-weight:700; color:#fdf4ff; margin-bottom:8px;">분석 완료</div>
                <div style="font-size:0.85rem; color:#e2e8f0; line-height:1.4;">아래 대시보드에서<br>오늘의 퀀텀 명리를 확인하세요.</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Expanded Dashboard -->
        <div class="q-dashboard" id="qDashboard">
          <!-- Daily Pillars -->
          <div class="q-pillars-wrap">
            <div class="q-pillar">
              <div class="q-p-label">천간 (Sky)</div>
              <div class="q-p-char" id="qDayGan">--</div>
              <div class="q-p-desc" id="qDayGanDesc">--</div>
            </div>
            <div class="q-pillar">
              <div class="q-p-label">지지 (Earth)</div>
              <div class="q-p-char" id="qDayJi">--</div>
              <div class="q-p-desc" id="qDayJiDesc">--</div>
            </div>
          </div>
          
          <!-- Human-centric Explanation -->
          <div class="q-explanation" id="qExplanation">
            분석된 운세 데이터가 이곳에 표시됩니다.
          </div>
          
          <!-- Elemental Balance -->
          <div class="q-elements-title">Elemental Balance & Tooltips</div>
          <div class="q-elements-row" id="qElementsRow">
            <div class="q-chip wood" id="cWood">木<span class="q-tooltip">초록/나무의 기운<br>성장과 새로운 시작을 의미합니다.</span></div>
            <div class="q-chip fire" id="cFire">火<span class="q-tooltip">빨강/불의 기운<br>열정과 확산을 의미합니다.</span></div>
            <div class="q-chip earth" id="cEarth">土<span class="q-tooltip">노랑/흙의 기운<br>안정과 포용을 의미합니다.</span></div>
            <div class="q-chip metal" id="cMetal">金<span class="q-tooltip">백색/쇠의 기운<br>결실과 단호함을 의미합니다.</span></div>
            <div class="q-chip water" id="cWater">水<span class="q-tooltip">검정/물의 기운<br>지혜와 유연함을 의미합니다.</span></div>
          </div>
          
          <!-- Gaeun -->
          <div class="gaeun-prescript" id="gaeunBox">
            <h4 class="gaeun-title"> 오늘의 운세 및 라이프가이드</h4>
            <div class="gaeun-grid" style="display:flex; flex-direction:column; gap:12px;">
              <div class="g-item" style="flex-direction:row; text-align:left; justify-content:flex-start; align-items:center; background: rgba(0,0,0,0.3); padding: 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
                <div class="g-icon" style="background:var(--neo-red, #f43f5e); border:none; color:#f8fafc; flex-shrink:0; font-size: 1.1rem; box-shadow: 0 0 10px rgba(244,63,94,0.4);"></div>
                <div style="margin-left: 12px;">
                  <div class="g-type" style="text-align:left; color:#cbd5e1; font-weight:700;">인간관계/연애</div>
                  <div class="g-desc" id="gRel" style="text-align:left; line-height: 1.4; margin-top:4px;">--</div>
                </div>
              </div>
              <div class="g-item" style="flex-direction:row; text-align:left; justify-content:flex-start; align-items:center; background: rgba(0,0,0,0.3); padding: 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
                <div class="g-icon" style="background:var(--neo-green, #10b981); border:none; color:#f8fafc; flex-shrink:0; font-size: 1.1rem; box-shadow: 0 0 10px rgba(16,185,129,0.4);"></div>
                <div style="margin-left: 12px;">
                  <div class="g-type" style="text-align:left; color:#cbd5e1; font-weight:700;">재물/비즈니스</div>
                  <div class="g-desc" id="gHealth" style="text-align:left; line-height: 1.4; margin-top:4px;">--</div>
                </div>
              </div>
              <div class="g-item" style="flex-direction:row; text-align:left; justify-content:flex-start; align-items:center; background: rgba(0,0,0,0.3); padding: 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);">
                <div class="g-icon" style="background:var(--neo-yellow, #eab308); border:none; color:#f8fafc; flex-shrink:0; font-size: 1.1rem; box-shadow: 0 0 10px rgba(234,179,8,0.4);"></div>
                <div style="margin-left: 12px;">
                  <div class="g-type" style="text-align:left; color:#cbd5e1; font-weight:700;">개운법 (컬러/액션)</div>
                  <div class="g-desc" id="gAction" style="text-align:left; line-height: 1.4; margin-top:4px;">--</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
"""
target_comment = "<!-- 9. 연이의 편지 / 쌈바의 팩폭 -->"
if "<!--  오늘의 운명 카드 (Premium Quantum Destiny) -->" not in text:
    text = text.replace(target_comment, html_insertion + "\n    " + target_comment)

# 4. JS Insertion SAFELY using slice up to var TAROT_DATA
s_idx = text.find('function renderTodayDestinyCard(p){')
e_idx = text.find('var TAROT_DATA = [')
if s_idx != -1 and e_idx != -1:
    old_func = text[s_idx:e_idx]
    
    js_premium = """let quantumAnalyzeState = 'idle';

function renderTodayDestinyCard(p) {
  var sec=document.getElementById('destinySection');
  if(!sec)return;
  sec.style.display='block';
  window.quantumProfile = p;
}

document.addEventListener("DOMContentLoaded", function() {
  const card = document.getElementById("qCardEl");
  const scene = document.getElementById("qCardScene");
  if(scene && card) {
    const handleMove = (x, y, rect, divisor) => {
      if (quantumAnalyzeState !== 'idle') return;
      let cx = x - rect.left - rect.width/2;
      let cy = y - rect.top - rect.height/2;
      card.style.transform = `rotateY(${cx/divisor}deg) rotateX(${-cy/divisor}deg)`;
    };
    scene.addEventListener("mousemove", e => handleMove(e.clientX, e.clientY, scene.getBoundingClientRect(), 5));
    scene.addEventListener("mouseleave", () => {
      if (quantumAnalyzeState === 'idle') card.style.transform = "rotateY(0deg) rotateX(0deg)";
    });
    scene.addEventListener("touchmove", e => handleMove(e.touches[0].clientX, e.touches[0].clientY, scene.getBoundingClientRect(), 7), {passive:true});
    scene.addEventListener("touchend", () => {
      if (quantumAnalyzeState === 'idle') card.style.transform = "rotateY(0deg) rotateX(0deg)";
    });
  }
});

function startQuantumAnalysis() {
  if (quantumAnalyzeState !== 'idle') return;
  quantumAnalyzeState = 'analyzing';
  
  const card = document.getElementById("qCardEl");
  const subtitle = document.getElementById("qSub");
  
  if(card) {
      card.style.transition = 'transform 0.1s linear';
      let vibInterval = setInterval(() => { card.style.transform = `rotateZ(${(Math.random()-0.5)*4}deg) scale(0.98)`; }, 80);
      
      if(subtitle) subtitle.innerHTML = "퀀텀 명리 엔진 가동 중... <span style='color:#a78bfa; font-weight:500;'>(우주 에너지 맵핑)</span>";
      
      setTimeout(() => {
        clearInterval(vibInterval);
        card.style.transition = 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        showQuantumResult();
      }, 2300);
  }
}

function showQuantumResult() {
  quantumAnalyzeState = 'result';
  const sub = document.getElementById("qSub");
  if(sub) sub.innerHTML = "오늘의 <span style='color:#f8fafc; font-weight:600;'>명리 인사이트</span>가 도출되었습니다.";

  const card = document.getElementById("qCardEl");
  if(card) card.className += ' flip-it';

  let p = window.quantumProfile;
  let today = new Date();
  let todayGZ = window.getGanZhiForDate ? window.getGanZhiForDate(today.getFullYear(), today.getMonth()+1, today.getDate(), today.getHours()) : null;

  let dGan = todayGZ ? todayGZ.g : ((p && p.d && p.d.g) ? p.d.g : '丙');
  let dJi  = todayGZ ? todayGZ.j : ((p && p.d && p.d.j) ? p.d.j : '辰');

  const ganNames = {'甲':'큰 나무','乙':'화초','丙':'태양','丁':'촛불','戊':'큰 산','己':'평야','庚':'바위/철','辛':'보석','壬':'큰 바다','癸':'비/이슬'};
  const jiNames = {'子':'씨앗/물','丑':'겨울 땅','寅':'봄의 시작','卯':'봄의 절정','辰':'봄의 끝','巳':'여름 불','午':'여름 절정','未':'여름 끝','申':'가을 시작','酉':'가을 절정','戌':'가을 끝','亥':'겨울 시작'};
  
  const ganDesc = ganNames[dGan] || '하늘의 기운';
  const jiDesc = jiNames[dJi] || '땅의 기운';

  if(document.getElementById("qDayGan")) document.getElementById("qDayGan").innerText = dGan;
  if(document.getElementById("qDayJi")) document.getElementById("qDayJi").innerText = dJi;
  if(document.getElementById("qDayGanDesc")) document.getElementById("qDayGanDesc").innerText = ganDesc;
  if(document.getElementById("qDayJiDesc")) document.getElementById("qDayJiDesc").innerText = jiDesc;

  // 오행 관계 계산 (생/극)
  var todayEl = (window.GAN && window.GAN[dGan]) ? window.GAN[dGan].e : 'earth';
  var birthGan = (p && p.d && p.d.g) ? p.d.g : '甲';
  var birthEl = (window.GAN && window.GAN[birthGan]) ? window.GAN[birthGan].e : 'wood';
  
  var SHENG2 = {wood:'fire',fire:'earth',earth:'metal',metal:'water',water:'wood'};
  var KE2 = {wood:'earth',earth:'water',water:'fire',fire:'metal',metal:'wood'};  
  var rel = 'neutral';
  
  if(SHENG2[birthEl]===todayEl) rel='gen_out'; 
  else if(SHENG2[todayEl]===birthEl) rel='gen_in'; 
  else if(KE2[birthEl]===todayEl) rel='ke_out'; 
  else if(KE2[todayEl]===birthEl) rel='ke_in'; 
  else if(birthEl===todayEl) rel='same';

  var relMsg = {
    gen_in: { 
      overall: '오늘의 기운이 당신의 본원(사주)을 부드럽게 생(生)해줍니다. 움츠렸던 것들이 피어나는 활기찬 파동의 날입니다.',
      love: '연인이나 주변 사람과의 감정 교류가 자연스럽게 깊어집니다. 진심을 전하기 좋은 날입니다.',
      money: '뜻밖의 수익이나 좋은 제안이 들어올 수 있는 길운입니다.',
      action: '지금까지 망설였던 결정을 오늘 실행에 옮겨보세요. 우주가 당신의 타이밍을 돕습니다.'
    },
    gen_out: { 
      overall: '당신의 에너지가 오늘 기운에 긍정적인 영향을 미치는 날. 베풀수록 좋은 주파수로 돌아오는 날입니다.',
      love: '당신이 먼저 다가가야 합니다. 배려하는 만큼 관계의 깊이가 더해집니다.',
      money: '지출이 다소 늘어날 수 있습니다. 나를 위한 가치 있는 투자인지 한 번 더 확인하세요.',
      action: '남을 돕는 일에서 우주적 보람을 느낍니다. 멘토링이나 무언가를 지원하는 행동이 행운을 부릅니다.'
    },
    ke_in: { 
      overall: '오늘의 강한 기운이 당신의 사주를 자극합니다. 긴장을 단단히 하고 외부의 변수를 지혜롭게 넘기는 파동이 필요합니다.',
      love: '오해가 생기기 쉬운 주파수입니다. 날선 말보다 부드럽게 경청하는 자세가 관계를 지켜줍니다.',
      money: '예상치 못한 손실 주의. 중요한 계약이나 서명은 내일로 미루시길 권장합니다.',
      action: '급한 결정보다 검토에 집중하세요. 돌다리도 두드리며 천천히 건너는 것이 최고의 개운법입니다.'
    },
    ke_out: { 
      overall: '당신이 오늘 외부의 기운을 완벽히 통제하고 눌러주는 날. 추진력은 강하지만 주변을 살피는 여유를 가지세요.',
      love: '리더십과 본인의 뚜렷한 주관이 드러납니다. 상대방에게 부드러운 말투를 의도적으로 더해주세요.',
      money: '협상이나 계약에서 본인이 유리한 고지를 점할 수 있는 상승장입니다.',
      action: '장애물을 돌파해내기 완벽한 날입니다. 단, 독단적인 결정은 피하고 주변과 호흡을 맞추세요.'
    },
    same: { 
      overall: '오늘의 기운과 당신의 사주가 완벽하게 같은 주파수(비견/겁재)를 띕니다. 자신감이 크게 올라가는 폭발적인 날입니다.',
      love: '나와 결이 같은 사람을 만나거나, 가까운 사람과 더욱 돈독해지는 공명 현상이 일어납니다.',
      money: '경쟁이 치열할 수 있지만 당신의 실력을 증명할 수 있는 기회입니다. 본인의 가치를 과감히 알리세요.',
      action: '새로운 프로젝트의 시작, 혹은 사람들과의 네트워킹에 에너지를 집중 쏟아보세요.'
    },    
    neutral: { 
      overall: '오늘은 큰 기복 없이 잔잔하게 흘러가는 날입니다. 루틴을 충실히 따르면 매우 안정적으로 파동이 유지됩니다.',
      love: '감정의 큰 파도보다는 안정감이 최우선입니다. 일상의 소소하고 따뜻한 배려로 사이를 다져보세요.',
      money: '거대한 변화보다는 현상유지와 꾸준한 관리가 중요한 날입니다. 자산을 점검해보세요.',
      action: '미뤄뒀던 밀린 일들을 처리하기에 좋은 날입니다. 작은 성취가 모여 큰 에너지가 됩니다.'
    }
  };
  
  var msg = relMsg[rel] || relMsg.neutral;
  let explainHtml = `당신의 오늘 하루는 <strong>${ganDesc}</strong>의 기운과 <strong>${jiDesc}</strong>의 에너지가 만나 특별한 파동을 형성합니다.<br><br><span style="color:#f8fafc;">${msg.overall}</span>`;

  if(document.getElementById("qExplanation")) document.getElementById("qExplanation").innerHTML = explainHtml;
  if(document.getElementById("gRel")) document.getElementById("gRel").innerText = msg.love;
  if(document.getElementById("gHealth")) document.getElementById("gHealth").innerText = msg.money;
  if(document.getElementById("gAction")) document.getElementById("gAction").innerText = msg.action;

  const chips = document.querySelectorAll('.q-chip');
  chips.forEach(c => { c.classList.remove('active'); c.style.transform = ''; });
  
  const targetChip = document.querySelector(`.q-chip.${todayEl}`);
  if(targetChip) { targetChip.classList.add('active'); targetChip.style.transform = 'scale(1.1)'; }

  const dBoard = document.getElementById("qDashboard");
  if(dBoard) {
      dBoard.style.display = "block";
      setTimeout(() => { dBoard.classList.add('show'); }, 100);
  }
}

"""
    text = text.replace(old_func, js_premium)

with io.open("index.html", "w", encoding="utf-8", newline='\n') as f:
    f.write(text.replace('\ufeff', ''))
