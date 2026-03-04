// HwatuFortune.js - 타짜 화투점 (The Tazza Vibe)
// 배경: 어두운 네이비와 금색 포인트, 은은한 연기 피어오르는 탁자 느낌

const TAZZA_SYSTEM = {
    CHARACTERS: {
        master: { name: '평경장', image: 'sudda/master.png', tone: 'advice', catchphrase: '"기술 쓰지 마라. 운명은 속이는 게 아니야."' },
        goni: { name: '고니', image: 'sudda/goni.png', tone: 'fortune', catchphrase: '"이게 내 운명인가 보지. 한 판 제대로 벌여볼까?"' },
        madam: { name: '정마담', image: 'sudda/madam.png', tone: 'love', catchphrase: '"나 이대 나온 여자야. 품격 있는 결과만 보여줄게."' },
        agui: { name: '아귀', image: 'sudda/agui.png', tone: 'warning', catchphrase: '"구라치다 걸리면 피 보는 거 안 배웠냐? 정직하게 봐준다."' },
        gosu: { name: '짝귀', image: 'sudda/gosu.png', tone: 'insight', catchphrase: '"기술이 아니야, 사람 마음을 읽는 거지. 네 속마음 다 보인다."' }
    },
    // 화투패 1~10월 데이터 (섯다용) 배열은 각각 [특수/광, 피/일반] 2장씩       
    DECK: [
        { month: 1, type: 'kwang', emoji: '☀️', name: '1광' }, { month: 1, type: 'pi', emoji: '🎴', name: '1피' },
        { month: 2, type: 'tti', emoji: '🕊️', name: '2열' }, { month: 2, type: 'pi', emoji: '🎴', name: '2피' },
        { month: 3, type: 'kwang', emoji: '🌸', name: '3광' }, { month: 3, type: 'pi', emoji: '🎴', name: '3피' },
        { month: 4, type: 'tti', emoji: '🌿', name: '4열' }, { month: 4, type: 'pi', emoji: '🎴', name: '4피' },
        { month: 5, type: 'tti', emoji: '🌾', name: '5띠' }, { month: 5, type: 'pi', emoji: '🎴', name: '5피' },
        { month: 6, type: 'tti', emoji: '🌹', name: '6띠' }, { month: 6, type: 'pi', emoji: '🎴', name: '6피' },
        { month: 7, type: 'tti', emoji: '🐗', name: '7띠' }, { month: 7, type: 'pi', emoji: '🎴', name: '7피' },
        { month: 8, type: 'kwang', emoji: '🎑', name: '8광' }, { month: 8, type: 'pi', emoji: '🎴', name: '8피' },
        { month: 9, type: 'tti', emoji: '🌼', name: '9열' }, { month: 9, type: 'pi', emoji: '🎴', name: '9피' },
        { month: 10, type: 'tti', emoji: '🍁', name: '10띠'}, { month: 10, type: 'pi', emoji: '🎴', name: '10피' }
    ]
};

// 공유 및 CSS 주입
const hwatuStyles = `
/* 1. 비주얼 스타일: 어두운 네이비 배경, 금색 포인트, 연기 효과 */
#hwatuModalOverlay {
    display: none; position: fixed; inset: 0; z-index: 100000;
    background: radial-gradient(circle at top, #142017 0%, #080808 60%, #2a0808 100%);
    overflow-y: auto; overflow-x: hidden; color: #e5e7eb; font-family: 'Noto Serif KR', serif;
}
.smoke-layer {
    position: absolute; width: 100%; height: 100%; pointer-events: none;
    background: url('https://raw.githubusercontent.com/Toss/tossface/main/dist/svg/u1F4A8.svg') center/cover no-repeat;
    opacity: 0.05; filter: blur(8px); animation: smokeDrift 20s infinite alternate;
}
@keyframes smokeDrift { 0% { transform: translateY(0) scale(1); } 100% { transform: translateY(-20px) scale(1.1); } }

.hwatu-table {
    max-width: 600px; margin: 40px auto; padding: 20px; text-align: center; position: relative; min-height: 500px;
}
.tazza-title {
    font-size: 2.2rem; color: #d4af37; text-shadow: 0 4px 15px rgba(251,191,36,0.3);
    margin-bottom: 5px; font-weight: bold; border-bottom: 2px solid #d4af37; display: inline-block; padding-bottom: 10px;
}
.tazza-sub { color: #94a3b8; font-size: 0.95rem; margin-bottom: 30px; letter-spacing: 1px; }

/* 2. 셔플 & 카드 영역 */
#shuffleArea {
    position: relative; width: 100%; height: 350px; margin-bottom: 20px;
    perspective: 1500px;
}
.hwatu-deck-card {
    width: 60px; height: 96px; position: absolute;
    left: calc(50% - 30px); top: calc(50% - 48px);
    border-radius: 6px; box-shadow: 0 4px 10px rgba(0,0,0,0.6);
    background: repeating-linear-gradient(45deg, #b91c1c, #b91c1c 8px, #991b1b 8px, #991b1b 16px);
    border: 3px solid #fff; box-sizing: border-box; cursor: pointer;
    transform-style: preserve-3d; opacity: 0;
}

/* 선택된 카드 Reveal Area */
.reveal-area {
    display: none; justify-content: center; gap: 20px;
    perspective: 1000px; margin-top: 20px;
}
.hwatu-card-wrapper {
    width: 100px; height: 160px; position: relative;
    transform-style: preserve-3d; transition: transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.hwatu-card-wrapper.flipped { transform: rotateY(180deg) scale(1.1); }
.hwatu-card {
    position: absolute; width: 100%; height: 100%; border-radius: 8px; backface-visibility: hidden;
    box-shadow: 0 8px 20px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;
    font-size: 3rem; border: 2px solid #d4af37;
}
.hwatu-back { background: repeating-linear-gradient(45deg, #b91c1c, #b91c1c 10px, #991b1b 10px, #991b1b 20px); border: 4px solid #fff; }
.hwatu-front { background: #fff; color: #000; transform: rotateY(180deg); flex-direction: column; }
.hwatu-front .marker { font-size: 0.9rem; font-weight: bold; margin-top: 10px; color: #b91c1c; }

/* 다중 캐릭터 팝업 (크기 확대) */
.tazza-multi-popup {
    position: fixed; background: rgba(15, 23, 42, 0.95); border: 2px solid #d4af37;
    display: flex; align-items: center; padding: 15px 20px; border-radius: 40px; z-index: 100001;
    width: max-content; max-width: 340px; box-shadow: 0 6px 20px rgba(0,0,0,0.9); opacity: 0; pointer-events: none;
}
.tazza-multi-popup img { width: 70px; height: 70px; border-radius: 50%; border: 2px solid #d4af37; margin-right: 15px; flex-shrink: 0; object-fit: cover;}
.tazza-popup-text-col { display: flex; flex-direction: column; }
.tazza-popup-name { font-size: 0.9rem; color: #e2e8f0; margin-bottom: 4px; text-align:left; font-weight: bold; }
.tazza-popup-quote { color: #facc15; font-size: 1.05rem; font-weight: bold; font-style: italic; line-height: 1.4; text-align:left; word-break:keep-all; text-shadow: 1px 1px 2px #000; }

/* 카테고리 선택 및 배경 캐릭터 꾸미기 */
.hwatu-category-container {
    display: flex; justify-content: center; gap: 8px; margin-bottom: 25px; flex-wrap: wrap; position: relative; z-index: 10;
}
.ctg-btn {
    background: rgba(0,0,0,0.6); border: 1px solid #d4af37; color: #cbd5e1; padding: 10px 18px; border-radius: 20px;
    cursor: pointer; font-family: inherit; font-size: 0.95rem; transition: 0.3s; box-shadow: 0 4px 10px rgba(0,0,0,0.5);
}
.ctg-btn:hover { background: rgba(251,191,36,0.2); }
.ctg-btn.active { background: #d4af37; color: #1a202c; font-weight: bold; box-shadow: 0 0 15px rgba(251,191,36,0.5); border-color: #f59e0b; }

.tazza-hero-bg {
    position: absolute; width: 100%; height: 100%; top: 0; left: 0; pointer-events: none; opacity: 0.8; z-index: 0;
    display: flex; justify-content: space-between; align-items: flex-end; overflow: hidden;
}
.tazza-hero-img { 
    height: 70vh; width: auto; object-fit: contain; 
    filter: brightness(0) drop-shadow(0 0 20px rgba(185, 28, 28, 0.4)); 
}
/* Overhead Flickering Lamp Effect */
.flickering-lamp {
    position: absolute; top: -50px; left: 50%; transform: translateX(-50%);
    width: 600px; height: 600px;
    background: radial-gradient(circle at center, rgba(212, 175, 55, 0.15) 0%, transparent 60%);
    animation: flicker 3s infinite alternate; pointer-events: none; z-index: 1;
}
@keyframes flicker {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
    70% { opacity: 0.8; }
    80% { opacity: 0.4; }
}
@media(max-width: 480px) { .tazza-hero-img { width: 100px; } }

#tcTop { top: -100px; left: 50%; transform: translateX(-50%); }
#tcBottom { bottom: -100px; left: 50%; transform: translateX(-50%); }
#tcLeft { top: 25%; left: -350px; transform: translateY(-50%); }
#tcRight { top: 65%; right: -350px; transform: translateY(-50%); }

/* 공통 버튼 */
.btn-hwatu {
    background: linear-gradient(to right, #b91c1c, #991b1b); color: #d4af37; border: 2px solid #d4af37; padding: 14px 30px;
    border-radius: 30px; font-size: 1.2rem; cursor: pointer; font-family: inherit; font-weight: bold;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.6); transition: 0.3s; letter-spacing: 1px;
}
.btn-hwatu:hover { transform: scale(1.05); box-shadow: 0 6px 20px rgba(251,191,36,0.4); text-shadow: 0 0 5px #d4af37; }
.btn-hwatu:disabled { filter: grayscale(1); cursor: not-allowed; transform: none; opacity: 0.5; }

/* 결과창 */
.result-box {
    margin-top: 30px; background: rgba(15,23,42,0.8); padding: 25px; border-radius: 12px;
    border: 1px solid #d4af37; display: none; text-align: left; animation: fadeInUp 0.8s forwards;
    position: relative; overflow: hidden;
}
.jokbo-name { font-size: 2rem; color: #ef4444; font-weight: bold; text-align: center; margin: 10px 0 20px; text-shadow: 0 2px 5px #000; letter-spacing: 2px; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
`;

function loadGSAP(callback) {
    if(window.gsap) { callback(); return; }
    const script = document.createElement('script');
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
    script.onload = callback;
    document.head.appendChild(script);
}

function injectHwatuHTML() {
    const styleEl = document.createElement('style');
    styleEl.innerHTML = hwatuStyles;
    document.head.appendChild(styleEl);

    const overlay = document.createElement('div');
    overlay.id = 'hwatuModalOverlay';
    overlay.innerHTML = `
        <div class="smoke-layer"></div>
        <div style="position:absolute; top:20px; left:20px; color:#d4af37; z-index:10; font-weight:bold;">남은 횟수: <span id="hwatuLimitText"></span>/10</div>
        <button onclick="closeHwatuModal()" style="position:absolute; top:20px; right:20px; background:rgba(0,0,0,0.5); border:1px solid #d4af37; color:#d4af37; font-size:1.5rem; width:40px; height:40px; border-radius:50%; cursor:pointer; z-index:10; transition:0.2s;">&times;</button>
        
        <div class="vignette-overlay"></div><div id="goldAura" class="gold-aura"></div><div class="flickering-lamp"></div>
        <div class="tazza-hero-bg">
            <img src="sudda/goni.png" class="tazza-hero-img" style="transform: scaleX(-1);">
            <img src="sudda/madam.png" class="tazza-hero-img">
        </div>
        <div class="hwatu-table">
            <h2 class="tazza-title" style="font-family: '궁서', cursive; font-size: 2.8rem; letter-spacing: -2px; color: #d4af37; text-shadow: 2px 2px 5px rgba(185,28,28,0.8);">타짜: 신의 손길</h2>
            <div class="tazza-sub">"원하는 운을 고르고, 패를 섞어보쇼."</div>
            
            <div class="hwatu-category-container" id="hwatuCategoryBox">
                <button class="ctg-btn active" onclick="setHwatuCategory('wealth', this)"> 재물운</button>
                <button class="ctg-btn" onclick="setHwatuCategory('love', this)"> 애정운</button>
                <button class="ctg-btn" onclick="setHwatuCategory('contact', this)"> 연락운</button>
                <button class="ctg-btn" onclick="setHwatuCategory('success', this)"> 합격/직장운</button>
            </div>
            
            <div id="shuffleArea">
                <!-- GSAP 카드가 여기 생성됨 -->
                <button class="btn-hwatu" id="startShuffleBtn" onclick="startShuffleSequence()" style="position:absolute; top:50%; left:50%; transform:translate(-50%, -50%); z-index:100;">운세 보기 (패 섞기)</button>
            </div>

            <div class="reveal-area" id="revealArea">
                <div class="hwatu-card-wrapper" id="hCard1">
                    <div class="hwatu-card hwatu-back"></div>
                    <div class="hwatu-card hwatu-front">
                        <div id="hCard1Emoji" style="font-size: 3rem;"></div>
                        <div id="hCard1Text" class="marker"></div>
                    </div>
                </div>
                <div class="hwatu-card-wrapper" id="hCard2">
                    <div class="hwatu-card hwatu-back"></div>
                    <div class="hwatu-card hwatu-front">
                        <div id="hCard2Emoji" style="font-size: 3rem;"></div>
                        <div id="hCard2Text" class="marker"></div>
                    </div>
                </div>
            </div>

            <div id="hwatuWarnMsg" style="color:#d4af37; margin-top:20px; font-weight:bold; display:none; font-size:1.1rem; text-shadow: 0 2px 4px #000;"></div>

            <div class="result-box" id="hwatuResultBox">
                <div class="jokbo-name" id="jokboName"></div>
                <div style="font-size: 1.1rem; line-height: 1.7; color: #e5e7eb; margin-bottom:20px; text-align:center;" id="fortuneDetails"></div>
                <button class="btn-hwatu" style="width:100%; font-size:1.1rem;" onclick="shareHwatu()">📢 전보 치기 (공유)</button>
            </div>
        </div>

        <!-- 다중 타짜 캐릭터 팝업 인터랙션 -->
        <div class="tazza-multi-popup" id="tcTop"><img id="tcTopImg" src=""><div class="tazza-popup-text-col"><span class="tazza-popup-name" id="tcTopName"></span><span class="tazza-popup-quote" id="tcTopText"></span></div></div>
        <div class="tazza-multi-popup" id="tcBottom"><img id="tcBottomImg" src=""><div class="tazza-popup-text-col"><span class="tazza-popup-name" id="tcBottomName"></span><span class="tazza-popup-quote" id="tcBottomText"></span></div></div>
        <div class="tazza-multi-popup" id="tcLeft"><img id="tcLeftImg" src=""><div class="tazza-popup-text-col"><span class="tazza-popup-name" id="tcLeftName"></span><span class="tazza-popup-quote" id="tcLeftText"></span></div></div>
        <div class="tazza-multi-popup" id="tcRight"><img id="tcRightImg" src=""><div class="tazza-popup-text-col"><span class="tazza-popup-name" id="tcRightName"></span><span class="tazza-popup-quote" id="tcRightText"></span></div></div>
    `;
    document.body.appendChild(overlay);
    loadGSAP(() => {});
}

// 오디오 합성: 셔플 착착 소리
function playClackSound(freq=150) {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.05);
        gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.05);
    } catch(e) {}
}

const getTodayDateStr = () => {
    const d = new Date(); return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
};
const checkDailyLimit = () => {
    const today = getTodayDateStr();
    let stats = JSON.parse(localStorage.getItem('hwatuStats') || '{}');
    if(stats.date !== today) { stats = { date: today, count: 0 }; }
    return stats;
};

// 섯다 족보 판별
function determineJokbo() {
    let rand = Math.random(); let card1, card2;
    
    // 운세 밸런스 조정: 좋은 패 확률 대폭 축소, 광땡 10% 이하, 나머지 균등 배분
    if(rand < 0.02) { 
        // 2% 삼팔광땡 (가장 희귀함)
        card1 = { month: 3, type: 'kwang', emoji: '🎴', name: '3광' }; 
        card2 = { month: 8, type: 'kwang', emoji: '🎴', name: '8광' }; 
    }
    else if(rand < 0.10) { 
        // 8% 일삼 또는 일팔광땡 (총 광땡 확률 10% 이내)
        card1 = { month: 1, type: 'kwang', emoji: '🎴', name: '1광' };
        card2 = Math.random() < 0.5 ? { month: 3, type: 'kwang', emoji: '🎴', name: '3광' } : { month: 8, type: 'kwang', emoji: '🎴', name: '8광' };
    }
    else if(rand < 0.35) { 
        // 25% 땡 (1~10땡)
        const d = Math.floor(Math.random() * 10) + 1; 
        card1 = { month: d, type: 'kwang', emoji: '🎴', name: d+'월' }; 
        card2 = { month: d, type: 'pi', emoji: '🎴', name: d+'월' }; 
    }
    else if(rand < 0.65) {
        // 30% 특별 족보 (알리, 독사, 구삥, 장삥, 장사, 세륙)
        const goodCombos = [[1,2], [1,4], [1,9], [1,10], [4,10], [4,6]];
        const cb = goodCombos[Math.floor(Math.random() * goodCombos.length)];
        card1 = { month: cb[0], type: 'pi', emoji: '🎴', name: cb[0]+'피' };
        card2 = { month: cb[1], type: 'pi', emoji: '🎴', name: cb[1]+'피' };
    }
    else {
        // 35% 완전 무작위 (끗, 망통, 사구파투 등)
        card1 = TAZZA_SYSTEM.DECK[Math.floor(Math.random() * TAZZA_SYSTEM.DECK.length)];
        do { card2 = TAZZA_SYSTEM.DECK[Math.floor(Math.random() * TAZZA_SYSTEM.DECK.length)]; } while(card1 === card2);
    }
    
    const m1 = card1.month, m2 = card2.month;
    let jokbo = "끗", score = (m1 + m2) % 10;

    if(m1 === 3 && m2 === 8 || m1 === 8 && m2 === 3) { jokbo = "삼팔광땡"; score = 100; }
    else if(m1 === 1 && m2 === 8 || m1 === 8 && m2 === 1) { jokbo = "일팔광땡"; score = 99; }
    else if(m1 === 1 && m2 === 3 || m1 === 3 && m2 === 1) { jokbo = "일삼광땡"; score = 98; }
    else if(m1 === m2) { jokbo = m1 === 10 ? "장땡" : m1 + "땡"; score = 90 + m1; }
    else if(m1 === 1 && m2 === 2 || m1 === 2 && m2 === 1) { jokbo = "알리"; score = 80; }
    else if(m1 === 1 && m2 === 4 || m1 === 4 && m2 === 1) { jokbo = "독사"; score = 79; }
    else if(m1 === 1 && m2 === 9 || m1 === 9 && m2 === 1) { jokbo = "구삥"; score = 78; }
    else if(m1 === 1 && m2 === 10 || m1 === 10 && m2 === 1) { jokbo = "장삥"; score = 77; }
    else if(m1 === 4 && m2 === 10 || m1 === 10 && m2 === 4) { jokbo = "장사"; score = 76; }
    else if(m1 === 4 && m2 === 6 || m1 === 6 && m2 === 4) { jokbo = "세륙"; score = 75; }
    else if(m1 === 4 && m2 === 9 || m1 === 9 && m2 === 4) { jokbo = "사구파투"; score = 10; }
    else { jokbo = score === 0 ? "망통" : score + "끗"; }

    return { card1, card2, jokbo, score };
}

window.currentHwatuCategory = 'wealth';
window.setHwatuCategory = function(cat, btnParam) {
    window.currentHwatuCategory = cat;
    document.querySelectorAll('#hwatuCategoryBox .ctg-btn').forEach(b => b.classList.remove('active'));
    if(btnParam) btnParam.classList.add('active');
};

function getFortuneAndCharacter(score) {
    let charKey, reading;
    const cat = window.currentHwatuCategory;
    
    // 타짜 캐릭터 특징 기반 선정 (점수에 따라 분위기 결정)
    if(score >= 98) charKey = 'goni'; // 최고 운 (고니)
    else if(cat === 'love' && score >= 75) charKey = 'madam'; // 애정운은 마담
    else if(score >= 91) charKey = 'madam'; // 고득점 (정마담)
    else if(score === 10) charKey = 'agui'; // 최악/위기 (아귀)
    else if(cat === 'contact' || cat === 'success') charKey = 'gosu'; // 연락/합격은 짝귀
    else charKey = 'master'; // 기본 조언 (평경장)

    // 카테고리별 맞춤 풀이 (섯다 방식의 화투점)
    if (cat === 'wealth') {
        if(score >= 98) reading = "인생 역전의 기회! 오늘 당신의 금전운은 천하무적입니다. 어디서 돈벼락이 떨어질지 모르니 큰 판을 벌여도 좋은 날입니다.";
        else if(score >= 90) reading = "자금이 원활하게 도는 날. 주식이나 투자, 계약에서 쏠쏠한 수익이 기대됩니다. 자신 있게 밀어붙이세요.";
        else if(score >= 70) reading = "소소한 재물운이 있습니다. 큰 돈은 아니어도 뜻밖의 꽁돈이 생기거나 맛있는 걸 대접받을 수 있겠습니다.";
        else if(score === 10) reading = "싸늘하다... 가슴에 비수가 날아와 꽂힌다. 밑장 빼다 걸릴 수 있는 최악의 금전운. 지갑을 꼭 닫고 몸을 사리쇼.";
        else reading = "큰 욕심을 부리면 오히려 잃기 쉬운 날입니다. 바람이 불 때는 납작 엎드리고, 기술을 아끼며 현상 유지를 목표로 하세요.";
    } 
    else if (cat === 'love') {
        if(score >= 98) reading = "천생연분, 찰떡궁합! 오늘 마음에 둔 사람에게 고백한다면 100% 성공입니다. 솔로라면 운명적인 만남이 기다립니다.";
        else if(score >= 90) reading = "당신의 매력이 절정에 달해 주변 사람들이 전부 당신에게 홀릴 것입니다. 연애 전선에 강력한 청신호가 켜졌습니다.";
        else if(score >= 70) reading = "무난하고 달콤한 애정운. 서로의 마음을 확인하며 잔잔하게 관계가 발전합니다. 진심 어린 대화가 포인트!";
        else if(score === 10) reading = "싸늘하다... 가슴에 비수가 날아와 꽂힌다. 애정 전선에 구라가 섞여있소. 거짓말에 속지 않도록 상대를 똑바로 보쇼.";
        else reading = "당장 큰 진전을 기대하기보다는 현재의 관계를 유지하며 내실을 다져야 할 때입니다. 밀당보다는 진정성으로 승부하세요.";
    }
    else if (cat === 'contact') {
        if(score >= 98) reading = "기다리던 그 사람에게서 깜짝 연락이 오거나, 평소 끊겼던 소중한 인연이 기적처럼 다시 이어지는 날입니다.";
        else if(score >= 90) reading = "상대방도 당신을 생각하고 있습니다. 먼저 가벼운 안부 문자라도 던져보세요. 아주 긍정적인 답장이 올 것입니다.";
        else if(score >= 70) reading = "연락의 흐름이 나쁘지 않습니다. 사람들의 마음을 읽고 공감해 주면, 끈끈한 네트워크가 자연스럽게 형성될 것입니다.";
        else if(score === 10) reading = "구라치다 걸리면 피 보는 거 안 배웠냐? 섣부른 연락은 돌이킬 수 없는 강을 건너게 하니 오늘 핸드폰은 꺼두는 게 상책이오.";
        else reading = "무소식이 희소식입니다. 억지로 이끌어내려 하지 말고, 때가 올 때까지 여유롭게 기다리는 지혜가 필요합니다.";
    }
    else { // success
        if(score >= 98) reading = "완벽한 합격, 성공의 운! 면접이든 시험이든 당신의 실력을 120% 발휘하여 단번에 좋은 소식을 거머쥘 것입니다.";
        else if(score >= 90) reading = "노력한 만큼 훌륭한 성과를 거두는 날. 승진이나 이직, 자격증 시험 등에 있어 강력한 합격의 기운이 따릅니다.";
        else if(score >= 70) reading = "순조로운 진행이 예상됩니다. 다만 방심은 금물입니다. 마지막까지 디테일(사람의 마음, 면접관의 의도 등)을 놓치지 마세요.";
        else if(score === 10) reading = "구라치다 걸리면 피 보는 거 안 배웠냐? 요행을 바라거나 꼼수로 합격을 노리면 크게 당하게 되어 있소. 정공법을 택하쇼.";
        else reading = "지금은 잠시 인내하고 실력을 더 다져야 할 시기입니다. 평범함 속에 길이 있으니 조급해하지 말고 기본기에 충실하세요.";
    }
    
    return { character: TAZZA_SYSTEM.CHARACTERS[charKey], reading };
}

window.openHwatuModal = function() {
    if(!document.getElementById('hwatuModalOverlay')) { injectHwatuHTML(); }
    const stats = checkDailyLimit();
    document.getElementById('hwatuLimitText').innerText = 10 - stats.count;
    document.getElementById('hwatuResultBox').style.display = 'none';
    document.getElementById('hwatuWarnMsg').style.display = 'none';
    document.getElementById('revealArea').style.display = 'none';
    document.getElementById('hCard1').classList.remove('flipped');
    document.getElementById('hCard2').classList.remove('flipped');
    document.getElementById('shuffleArea').style.display = 'block';
    document.getElementById('shuffleArea').style.opacity = 1;
    document.getElementById('shuffleArea').style.height = '350px';
    
    // 이전 카드 있으면 삭제
    const area = document.getElementById('shuffleArea');
    area.querySelectorAll('.hwatu-deck-card').forEach(c => c.remove());

    const btn = document.getElementById('startShuffleBtn');
    btn.style.display = 'block';
    btn.innerText = "운세 보기 (패 섞기)";
    btn.disabled = false;
    document.getElementById('hwatuModalOverlay').style.display = 'block';
};

window.closeHwatuModal = function() { document.getElementById('hwatuModalOverlay').style.display = 'none'; };

// 시퀀스 상태 변수
let selectedCards = 0;
let drawData = null;

window.startShuffleSequence = function() {
    let stats = checkDailyLimit();
    if(stats.count >= 10) {
        let warn = document.getElementById('hwatuWarnMsg');
        warn.innerText = "너 너무 많이 했어! 손모가지 날아간다! 오늘은 판 접으쇼!";
        warn.style.color = "#ef4444";
        warn.style.display = 'block'; return;
    }
    document.getElementById('startShuffleBtn').style.display = 'none';

    // --- 다시 뽑기 시 이전 UI 및 카드 초기화 --- //
    document.getElementById('hwatuResultBox').style.display = 'none';
    document.getElementById('revealArea').style.display = 'none';
    document.getElementById('hCard1').classList.remove('flipped');
    document.getElementById('hCard2').classList.remove('flipped');
    document.getElementById('shuffleArea').style.display = 'block';
    document.getElementById('shuffleArea').style.opacity = 1;
    document.getElementById('shuffleArea').style.height = '350px';
    const areaCards = document.getElementById('shuffleArea').querySelectorAll('.hwatu-deck-card');
    areaCards.forEach(c => c.remove());
    // ------------------------------------------ //

    // --- 상하좌우 4명 캐릭터 동시 팝업 등장 --- //
    const charKeys = Object.keys(TAZZA_SYSTEM.CHARACTERS).sort(() => 0.5 - Math.random());
    const positions = ['Top', 'Bottom', 'Left', 'Right'];
    
    for(let i=0; i<4; i++) {
        const char = TAZZA_SYSTEM.CHARACTERS[charKeys[i]];
        const pos = positions[i];
        document.getElementById(`tc${pos}Img`).src = char.image || 'icons/honeypig.svg';
        document.getElementById(`tc${pos}Name`).innerText = char.name;
        document.getElementById(`tc${pos}Text`).innerText = char.catchphrase;
    }

    if(window.gsap) {
        gsap.to('#tcTop', { top: 20, opacity: 1, duration: 0.6, ease: "back.out(1.2)" });
        gsap.to('#tcBottom', { bottom: 20, opacity: 1, duration: 0.6, ease: "back.out(1.2)", delay: 0.1 });
        gsap.to('#tcLeft', { left: 10, opacity: 1, duration: 0.6, ease: "back.out(1.2)", delay: 0.2 });
        gsap.to('#tcRight', { right: 10, opacity: 1, duration: 0.6, ease: "back.out(1.2)", delay: 0.3 });

        setTimeout(() => {
            gsap.to('#tcTop', { top: -150, opacity: 0, duration: 0.5 });
            gsap.to('#tcBottom', { bottom: -150, opacity: 0, duration: 0.5 });
            gsap.to('#tcLeft', { left: -350, opacity: 0, duration: 0.5 });
            gsap.to('#tcRight', { right: -350, opacity: 0, duration: 0.5 });
        }, 3800);
    }
    // ----------------------------------------- //

    // GSAP 셔플 애니메이션 (속도를 위해 24장 사용)
    const area = document.getElementById('shuffleArea');
    const NUM_CARDS = 24;
    
    let deckDOMs = [];
    for(let i=0; i<NUM_CARDS; i++){
        let c = document.createElement('div');
        c.className = 'hwatu-deck-card';
        area.appendChild(c);
        deckDOMs.push(c);
    }

    if(window.gsap) {
        // 1. 카드가 모임
        gsap.to(deckDOMs, { opacity: 1, duration: 0.2, stagger: 0.01 });
        // 2. 셔플 (진동 & 위아래 이동)착착 소리
        gsap.to(deckDOMs, {
            y: () => (Math.random() - 0.5) * 80,
            x: () => (Math.random() - 0.5) * 30,
            rotation: () => (Math.random() - 0.5) * 45,
            duration: 0.1, yoyo: true, repeat: 18, delay: 0.3,
            onStart: () => {
                let clacks = 0;
                let iv = setInterval(() => { playClackSound(150 + Math.random()*50); clacks++; if(clacks>15) clearInterval(iv); }, 60);
            }
        });
        // 3. 슬로우 모션 공중 체공
        gsap.to(deckDOMs, {
            y: -150, x: () => (Math.random() - 0.5) * 50, rotation: () => (Math.random() - 0.5) * 180, scale: 1.1,
            duration: 1.2, delay: 2.2, ease: "power2.out"
        });
        // 4. 바닥으로 모이기 후 부채꼴 스프레드
        gsap.to(deckDOMs, {
            y: 0, x: 0, scale: 1, rotation: 0, duration: 0.4, delay: 3.5,
            onComplete: () => { spreadCards(deckDOMs); }
        });
    } else {
        // Fallback
        setTimeout(() => spreadCards(deckDOMs), 1000);
    }
};

function spreadCards(deckDOMs) {
    playClackSound(100);
    
    // 부채꼴 회전 계산
    const startAngle = -75;
    const endAngle = 75;
    const step = (endAngle - startAngle) / (deckDOMs.length - 1);
    const radius = 220; // 부채꼴 반지름
    
    gsap.to(deckDOMs, {
        rotation: (i) => startAngle + (step * i),
        x: (i) => Math.sin((startAngle + (step * i)) * Math.PI / 180) * radius,
        y: (i) => -Math.cos((startAngle + (step * i)) * Math.PI / 180) * radius + radius - 50,
        duration: 0.8, ease: "back.out(1.2)",
        onComplete: () => {
            // 패 세팅 완료! User chooses 2 cards
            drawData = determineJokbo();
            selectedCards = 0;
            deckDOMs.forEach(c => {
                c.onclick = () => onCardSelected(c, deckDOMs);
            });
            let warn = document.getElementById('hwatuWarnMsg');
            warn.innerText = "조심스럽게 2장의 패를 뽑으쇼.";
            warn.style.color = "#d4af37";
            warn.style.display = 'block';
        }
    });
}

function onCardSelected(cardEl, deckDOMs) {
    if(cardEl.classList.contains('picked')) return;
    cardEl.classList.add('picked');
    playClackSound(250);
    
    // 선택된 카드를 위로 살짝 띄우기
    gsap.to(cardEl, { y: cardEl._gsap.y - 30, scale: 1.2, duration: 0.2, boxShadow: "0 0 15px #d4af37" });
    
    selectedCards++;
    if(selectedCards === 2) {
        // 덱 카드 클릭 비활성화
        deckDOMs.forEach(c => c.onclick = null);
        document.getElementById('hwatuWarnMsg').style.display = 'none';
        
        let stats = checkDailyLimit(); stats.count++;
        localStorage.setItem('hwatuStats', JSON.stringify(stats));
        document.getElementById('hwatuLimitText').innerText = 10 - stats.count;
        
        // 셔플 영역 서서히 사라지고 리빌 영역 등장
        gsap.to(document.getElementById('shuffleArea'), { opacity: 0, duration: 0.6, delay: 0.5, onComplete: () => {
            document.getElementById('shuffleArea').style.display = 'none';
            showReveal();
        }});
    }
}

function showReveal() {
    const { card1, card2, jokbo, score } = drawData;
    const { character, reading } = getFortuneAndCharacter(score);
    
    document.getElementById('revealArea').style.display = 'flex';
    document.getElementById('hCard1Emoji').innerText = card1.emoji;
    document.getElementById('hCard1Text').innerText = card1.name;
    document.getElementById('hCard2Emoji').innerText = card2.emoji;
    document.getElementById('hCard2Text').innerText = card2.name;

    setTimeout(() => { document.getElementById('hCard1').classList.add('flipped'); playClackSound(); }, 200);
    setTimeout(() => { document.getElementById('hCard2').classList.add('flipped'); playClackSound(); }, 900);

    setTimeout(() => {
        document.getElementById('jokboName').innerText = "【 " + jokbo + " 】";
        let charHTML = `
            <div style="display:flex;align-items:center;margin-bottom:20px;background:rgba(0,0,0,0.4);padding:15px;border-radius:10px;border-left:4px solid #d4af37;">
                <img src="${character.image || 'icons/honey%20manse.png'}" style="width:70px;height:70px;border-radius:50%;margin-right:15px;border:2px solid #d4af37;box-shadow:0 0 10px rgba(251,191,36,0.2);">
                <div style="flex:1;">
                    <div style="color:#94a3b8;font-size:0.9rem;margin-bottom:5px;">${character.name} 가 말하길..</div>
                    <div style="color:#facc15;font-weight:bold;font-style:italic;line-height:1.4;">${character.catchphrase}</div>
                </div>
            </div>
        `;
        document.getElementById('fortuneDetails').innerHTML = charHTML + reading;
        document.getElementById('hwatuResultBox').style.display = 'block';
        
        // 다시 뽑기 위한 리셋
        const btn = document.getElementById('startShuffleBtn');
        btn.innerText = "한 판 더? (다시 뽑기)";
        btn.style.display = 'block';
        document.getElementById('shuffleArea').style.display = 'block';
        document.getElementById('shuffleArea').style.height = '60px'; // 높이 축소하여 공간 절약
        document.getElementById('shuffleArea').style.opacity = 1;
        const areaCards = document.getElementById('shuffleArea').querySelectorAll('.hwatu-deck-card');
        areaCards.forEach(c => c.remove());
    }, 1800);
}

window.shareHwatu = function() {
    const text = "[🎴 타짜 화투점 결과]\n나의 패: " + document.getElementById('jokboName').innerText + "\n👉 내 타짜 운세 확인하기: " + window.location.href;
    if (navigator.share) { navigator.share({ title: '타짜 화투점', text: text }).catch(console.error); } 
    else { alert("클립보드에 복사되었습니다.\n\n" + text); }
};

