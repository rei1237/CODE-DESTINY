// HwatuFortune.js - 화투점 (The Tazza Vibe)
// 배경: 어두운 네이비와 금색 포인트, 은은한 연기 피어오르는 탁자 느낌

/* ── 화투 이미지 경로 헬퍼 ── */
function hwatuImg(month, index) {
    return 'sudda/hwatu/' + month + '_' + index + '.png';
}

const TAZZA_SYSTEM = {
    CHARACTERS: {
        master: { name: '퐁퐁장', image: 'sudda/master.png', tone: 'advice', catchphrase: '"기술 부리지 마라. 운명이란 건… 속여서 되는 게 아니여."' },
        goni: { name: '꼬니', image: 'sudda/goni.png', tone: 'fortune', catchphrase: '"이게 내 팔자인가 보지. 한 판 화끈하게 뒤집어볼까?"' },
        madam: { name: '천마담', image: 'sudda/madam.png', tone: 'love', catchphrase: '"나 서울대 나온 여자야. 격조 있는 운세만 내놓을게."' },
        agui: { name: '아구', image: 'sudda/agui.png', tone: 'warning', catchphrase: '"뻥치다 걸리면 코피 나는 거 안 배웠어? 솔직하게 봐줄게."' },
        gosu: { name: '짝꿍', image: 'sudda/gosu.png', tone: 'insight', catchphrase: '"기술이 아니라 심리전이야. 니 속마음… 다 들여다보인다."' }
    },

    /*
     * 표준 화투 48장 완전 덱
     * type: kwang(광) / yul(열끗) / tti(띠) / pi(피) / dpi(쌍피)
     * img: sudda/hwatu/${month}_${index}.png
     *
     * 1월(송학):  1_1광  1_2홍단  1_3피  1_4피
     * 2월(매조):  2_1열  2_2홍단  2_3피  2_4피
     * 3월(벚꽃):  3_1광  3_2홍단  3_3피  3_4피
     * 4월(흑싸리):4_1열  4_2청단  4_3피  4_4피
     * 5월(난초):  5_1열  5_2청단  5_3피  5_4피
     * 6월(모란):  6_1열  6_2청단  6_3피  6_4피
     * 7월(홍싸리):7_1열  7_2홍단  7_3피  7_4피
     * 8월(공산):  8_1광  8_2열    8_3피  8_4피
     * 9월(국화):  9_1열  9_2청단  9_3피  9_4피
     * 10월(단풍): 10_1열 10_2청단 10_3피 10_4피
     * 11월(오동): 11_1광 11_2피   11_3피 11_4쌍피
     * 12월(비):   12_1비광 12_2열 12_3띠 12_4쌍피
     */
    DECK: [
        // 1월 송학
        { month:1, idx:1, type:'kwang', name:'송학 광',   label:'1월 광',   img: hwatuImg(1,1) },
        { month:1, idx:2, type:'tti',   name:'송학 홍단', label:'1월 홍단', img: hwatuImg(1,2) },
        { month:1, idx:3, type:'pi',    name:'송학 피',   label:'1월 피',   img: hwatuImg(1,3) },
        { month:1, idx:4, type:'pi',    name:'송학 피',   label:'1월 피',   img: hwatuImg(1,4) },
        // 2월 매조
        { month:2, idx:1, type:'yul',   name:'매조 열끗', label:'2월 열끗', img: hwatuImg(2,1) },
        { month:2, idx:2, type:'tti',   name:'매조 홍단', label:'2월 홍단', img: hwatuImg(2,2) },
        { month:2, idx:3, type:'pi',    name:'매조 피',   label:'2월 피',   img: hwatuImg(2,3) },
        { month:2, idx:4, type:'pi',    name:'매조 피',   label:'2월 피',   img: hwatuImg(2,4) },
        // 3월 벚꽃
        { month:3, idx:1, type:'kwang', name:'벚꽃 광',   label:'3월 광',   img: hwatuImg(3,1) },
        { month:3, idx:2, type:'tti',   name:'벚꽃 홍단', label:'3월 홍단', img: hwatuImg(3,2) },
        { month:3, idx:3, type:'pi',    name:'벚꽃 피',   label:'3월 피',   img: hwatuImg(3,3) },
        { month:3, idx:4, type:'pi',    name:'벚꽃 피',   label:'3월 피',   img: hwatuImg(3,4) },
        // 4월 흑싸리
        { month:4, idx:1, type:'yul',   name:'흑싸리 열끗', label:'4월 열끗', img: hwatuImg(4,1) },
        { month:4, idx:2, type:'tti',   name:'흑싸리 청단', label:'4월 청단', img: hwatuImg(4,2) },
        { month:4, idx:3, type:'pi',    name:'흑싸리 피',   label:'4월 피',   img: hwatuImg(4,3) },
        { month:4, idx:4, type:'pi',    name:'흑싸리 피',   label:'4월 피',   img: hwatuImg(4,4) },
        // 5월 난초
        { month:5, idx:1, type:'yul',   name:'난초 열끗', label:'5월 열끗', img: hwatuImg(5,1) },
        { month:5, idx:2, type:'tti',   name:'난초 청단', label:'5월 청단', img: hwatuImg(5,2) },
        { month:5, idx:3, type:'pi',    name:'난초 피',   label:'5월 피',   img: hwatuImg(5,3) },
        { month:5, idx:4, type:'pi',    name:'난초 피',   label:'5월 피',   img: hwatuImg(5,4) },
        // 6월 모란
        { month:6, idx:1, type:'yul',   name:'모란 열끗', label:'6월 열끗', img: hwatuImg(6,1) },
        { month:6, idx:2, type:'tti',   name:'모란 청단', label:'6월 청단', img: hwatuImg(6,2) },
        { month:6, idx:3, type:'pi',    name:'모란 피',   label:'6월 피',   img: hwatuImg(6,3) },
        { month:6, idx:4, type:'pi',    name:'모란 피',   label:'6월 피',   img: hwatuImg(6,4) },
        // 7월 홍싸리
        { month:7, idx:1, type:'yul',   name:'홍싸리 열끗', label:'7월 열끗', img: hwatuImg(7,1) },
        { month:7, idx:2, type:'tti',   name:'홍싸리 홍단', label:'7월 홍단', img: hwatuImg(7,2) },
        { month:7, idx:3, type:'pi',    name:'홍싸리 피',   label:'7월 피',   img: hwatuImg(7,3) },
        { month:7, idx:4, type:'pi',    name:'홍싸리 피',   label:'7월 피',   img: hwatuImg(7,4) },
        // 8월 공산명월
        { month:8, idx:1, type:'kwang', name:'공산 광',   label:'8월 광',   img: hwatuImg(8,1) },
        { month:8, idx:2, type:'yul',   name:'공산 열끗', label:'8월 열끗', img: hwatuImg(8,2) },
        { month:8, idx:3, type:'pi',    name:'공산 피',   label:'8월 피',   img: hwatuImg(8,3) },
        { month:8, idx:4, type:'pi',    name:'공산 피',   label:'8월 피',   img: hwatuImg(8,4) },
        // 9월 국화
        { month:9, idx:1, type:'yul',   name:'국화 열끗', label:'9월 열끗', img: hwatuImg(9,1) },
        { month:9, idx:2, type:'tti',   name:'국화 청단', label:'9월 청단', img: hwatuImg(9,2) },
        { month:9, idx:3, type:'pi',    name:'국화 피',   label:'9월 피',   img: hwatuImg(9,3) },
        { month:9, idx:4, type:'pi',    name:'국화 피',   label:'9월 피',   img: hwatuImg(9,4) },
        // 10월 단풍
        { month:10, idx:1, type:'yul',  name:'단풍 열끗', label:'10월 열끗', img: hwatuImg(10,1) },
        { month:10, idx:2, type:'tti',  name:'단풍 청단', label:'10월 청단', img: hwatuImg(10,2) },
        { month:10, idx:3, type:'pi',   name:'단풍 피',   label:'10월 피',   img: hwatuImg(10,3) },
        { month:10, idx:4, type:'pi',   name:'단풍 피',   label:'10월 피',   img: hwatuImg(10,4) },
        // 11월 오동
        { month:11, idx:1, type:'kwang', name:'오동 광',   label:'11월 광',  img: hwatuImg(11,1) },
        { month:11, idx:2, type:'pi',    name:'오동 피',   label:'11월 피',  img: hwatuImg(11,2) },
        { month:11, idx:3, type:'pi',    name:'오동 피',   label:'11월 피',  img: hwatuImg(11,3) },
        { month:11, idx:4, type:'dpi',   name:'오동 쌍피', label:'11월 쌍피', img: hwatuImg(11,4) },
        // 12월 비
        { month:12, idx:1, type:'kwang', name:'비 비광',   label:'12월 비광', img: hwatuImg(12,1) },
        { month:12, idx:2, type:'yul',   name:'비 열끗',   label:'12월 열끗', img: hwatuImg(12,2) },
        { month:12, idx:3, type:'tti',   name:'비 띠',     label:'12월 띠',   img: hwatuImg(12,3) },
        { month:12, idx:4, type:'dpi',   name:'비 쌍피',   label:'12월 쌍피', img: hwatuImg(12,4) }
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
.hwatu-front { background: #1a1a1b; color: #fff; transform: rotateY(180deg); flex-direction: column; padding: 0; overflow: hidden; }
.hwatu-front .marker { font-size: 0.85rem; font-weight: bold; margin-top: 4px; color: #ffd700; text-shadow: 0 1px 3px #000; position: relative; z-index: 1; }

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
    display: flex; justify-content: center; align-items: flex-end; overflow: hidden;
}
.tazza-hero-img { 
    height: 75vh; width: auto; object-fit: contain; margin: 0 -20px;
    filter: brightness(0) drop-shadow(0 0 25px rgba(185, 28, 28, 0.5)); 
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
@media(max-width: 480px) { 
    .tazza-hero-img { 
        height: 55vh; 
        width: auto; 
        filter: brightness(0) drop-shadow(0 0 30px rgba(185, 28, 28, 0.6)); 
    }
    .tazza-hero-bg { opacity: 0.65; }
}

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
            <img src="sudda/agui.png" class="tazza-hero-img">
            <img src="sudda/gosu.png" class="tazza-hero-img">
            <img src="sudda/master.png" class="tazza-hero-img">
        </div>
        <div class="hwatu-table" style="position: relative; z-index: 2;">
            <h2 class="tazza-title" style="font-family: '궁서', cursive; font-size: 2.8rem; letter-spacing: -2px; color: #d4af37; text-shadow: 2px 2px 5px rgba(185,28,28,0.8);">화투 운세: 신의 손길</h2>
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
                        <img id="hCard1Img" src="" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:6px;display:none;">
                        <div id="hCard1Emoji" style="font-size:3rem;display:none;"></div>
                        <div id="hCard1Text" class="marker"></div>
                    </div>
                </div>
                <div class="hwatu-card-wrapper" id="hCard2">
                    <div class="hwatu-card hwatu-back"></div>
                    <div class="hwatu-card hwatu-front">
                        <img id="hCard2Img" src="" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:6px;display:none;">
                        <div id="hCard2Emoji" style="font-size:3rem;display:none;"></div>
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
        if(audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();
        
        osc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.04);
        
        filter.type = 'highpass';
        filter.frequency.value = 800;
        
        gainNode.gain.setValueAtTime(0.8, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.04);
        
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.04);
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
// DECK에서 특정 월/인덱스 카드 찾기 헬퍼
function _deckCard(month, idx) {
    return TAZZA_SYSTEM.DECK.find(c => c.month === month && c.idx === idx) ||
           TAZZA_SYSTEM.DECK.find(c => c.month === month) || 
           { month, idx, type:'pi', name: month+'월', label: month+'월', img: hwatuImg(month, idx) };
}
// 땡 패 2장 (같은 월, 서로 다른 인덱스)
function _deckPair(month) {
    const cards = TAZZA_SYSTEM.DECK.filter(c => c.month === month);
    if (cards.length >= 2) return [cards[0], cards[1]];
    return [_deckCard(month,1), _deckCard(month,2)];
}

function determineJokbo() {
    let rand = Math.random(); let card1, card2;
    
    // 운세 밸런스 조정: 좋은 패 확률 대폭 축소, 광땡 10% 이하, 나머지 균등 배분
    if(rand < 0.02) { 
        // 2% 삼팔광땡 (가장 희귀함)
        card1 = _deckCard(3, 1); 
        card2 = _deckCard(8, 1); 
    }
    else if(rand < 0.10) { 
        // 8% 일삼 또는 일팔광땡 (총 광땡 확률 10% 이내)
        card1 = _deckCard(1, 1);
        card2 = Math.random() < 0.5 ? _deckCard(3, 1) : _deckCard(8, 1);
    }
    else if(rand < 0.35) { 
        // 25% 땡 (1~10땡)
        const d = Math.floor(Math.random() * 10) + 1;
        [card1, card2] = _deckPair(d);
    }
    else if(rand < 0.65) {
        // 30% 특별 족보 (알리, 독사, 구삥, 장삥, 장사, 세륙)
        const goodCombos = [[1,2], [1,4], [1,9], [1,10], [4,10], [4,6]];
        const cb = goodCombos[Math.floor(Math.random() * goodCombos.length)];
        card1 = _deckCard(cb[0], 3);
        card2 = _deckCard(cb[1], 3);
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
    
    // 카테고리 클릭 시 사운드
    if(typeof playClackSound === 'function') {
        playClackSound(200); 
        setTimeout(() => playClackSound(250), 100);
    }

    let quote = "";
    if(cat === 'wealth') quote = '천마담: "나 서울대 나온 여자야. 아무 판에나 돈 안 걸어. 확실한 데만 골라줄게."';
    else if(cat === 'love') quote = '꼬니: "사랑도 승부야. 내 전부를 걸 때가 오는 법이지."';
    else if(cat === 'contact') quote = '짝꿍: "뻥치지 마라. 니 속마음, 연락 기다리고 있는 거 다 보여."';
    else if(cat === 'success') quote = '퐁퐁장: "기억해라. 진짜 실력은 기술이 아니라 흔들리지 않는 배짱에서 나온다."';
    
    const sub = document.querySelector('.tazza-sub');
    if(sub) {
        sub.innerText = quote;
        sub.style.color = "#d4af37";
        if(window.gsap) gsap.fromTo(sub, { scale: 1.05, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5 });
    }
}

function getFortuneAndCharacter(score) {
    let charKey, reading;
    const cat = window.currentHwatuCategory;
    
    if(score === 100) charKey = 'goni'; 
    else if(cat === 'love' && score >= 75) charKey = 'madam';
    else if(cat === 'wealth' && score >= 90) charKey = 'madam';
    else if(score >= 90) charKey = 'goni'; 
    else if(score === 10 || score === 0) charKey = 'agui'; 
    else if(cat === 'contact' || cat === 'success') charKey = 'gosu'; 
    else charKey = 'master'; 

    if (cat === 'wealth') {
        if(score === 100) reading = "묻고 더블로 가! 오늘 당신의 금전운은 천하무적. 판돈을 전부 끌어모아 판을 키워도 좋은 날이다.";
        else if(score >= 90) reading = "패가 아주 좋게 떨어졌군. 예상치 못한 거래처에서 연락이 오거나 투자한 곳에서 쏠쏠한 수익이 떨어질 거다.";
        else if(score >= 70) reading = "평타는 치는 패야. 큰 욕심만 안 부리면 길가다가 지폐 한 장 줍거나, 점심값 굳는 쏠쏠한 재미를 볼 수 있다.";
        else if(score === 10 || score === 0) reading = "싸늘하다... 가슴에 비수가 날아와 꽂힌다. 밑장 빼다 걸릴 수 있는 최악의 금전운. 지갑을 꼭 닫고 몸을 사리쇼.";
        else reading = "큰 판을 벌이기엔 아직 무리다. 바람이 불 때는 납작 엎드리고, 기술을 아끼며 지금 있는 돈부터 지키는 게 순리야.";
    } 
    else if (cat === 'love') {
        if(score === 100) reading = "마음에 쏙 드는 인연을 만날 찰떡궁합의 패. 고백을 망설이고 있다면 오늘이 바로 승부수를 던질 타이밍이다.";
        else if(score >= 90) reading = "당신의 매력이 절정에 달해 주변 사람들이 전부 당신에게 홀리는 날. 눈빛 하나로 마음을 흔들 수 있다.";
        else if(score >= 70) reading = "잔잔하게 마음이 통하는 무난한 흐름. 오늘은 억지로 상황을 만들려 하지 말고 진심을 담은 한 마디면 족하다.";
        else if(score === 10 || score === 0) reading = "싸늘하다... 애정 전선에 구라가 섞여있소. 괜한 헛소문이나 어장관리에 당할 수 있으니 상대를 똑바로 보쇼.";
        else reading = "지금은 밀당을 할 때가 아니다. 패가 말렸을 땐 포커페이스를 유지하며 마음을 숨기는 게 오히려 낫다.";
    }
    else if (cat === 'contact') {
        if(score === 100) reading = "아주 반가운 소식! 인연이 끊길 뻔했던 귀인에게서 깜짝 연락이 오거나 기다리던 답장을 받게 된다.";
        else if(score >= 90) reading = "상대방도 당신 패를 읽으려 눈치를 보고 있다. 가볍게 찔러보는 선톡 하나가 꽉 막힌 물꼬를 터줄 거다.";
        else if(score >= 70) reading = "사람들의 마음이 당신에게 열려 있는 날. 안부를 묻고 대화를 들어주기만 해도 관계가 한층 끈끈해진다.";
        else if(score === 10 || score === 0) reading = "구라치다 걸리면 피 보는 거 안 배웠냐? 섣부른 연락은 돌이킬 수 없는 강을 건너게 하니 오늘 핸드폰은 꺼두는 게 상책이오.";
        else reading = "무소식이 희소식이라 했다. 억지로 타선을 이어붙이려다 오히려 역풍을 맞으니 여유롭게 기다리는 지혜를 가져라.";
    }
    else { 
        if(score === 100) reading = "완벽한 타점. 면접이든 시험이든 당신의 실력이 100% 발휘되어 경쟁자들을 압도하고 당당히 승리를 거머쥔다.";
        else if(score >= 90) reading = "준비한 만큼 훌륭한 성과를 거두는 기운. 심사관이나 윗선의 눈에 띄어 단숨에 입지를 굳히게 될 거다.";
        else if(score >= 70) reading = "순조로운 전개. 다만 방심은 금물이다. 디테일한 부분에서 승패가 갈리니 마지막까지 집중의 끈을 놓지 마라.";
        else if(score === 10 || score === 0) reading = "구라치다 걸리면 피 보는 거 안 배웠냐? 요행을 바라거나 꼼수로 합격을 노리면 크게 당하게 되어 있소. 정공법을 택하쇼.";
        else reading = "아직은 칼을 더 갈아야 할 시기. 평범함 속에 지혜가 있으니 조급함을 버리고 기본기로 승부해라.";
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
    // 카드 1 이미지 렌더링
    const img1 = document.getElementById('hCard1Img');
    const em1  = document.getElementById('hCard1Emoji');
    if (card1.img) {
        img1.src = card1.img; img1.alt = card1.name;
        img1.style.display = 'block'; em1.style.display = 'none';
    } else {
        em1.innerText = card1.emoji || '🎴'; em1.style.display = 'block'; img1.style.display = 'none';
    }
    document.getElementById('hCard1Text').innerText = card1.label || card1.name;
    // 카드 2 이미지 렌더링
    const img2 = document.getElementById('hCard2Img');
    const em2  = document.getElementById('hCard2Emoji');
    if (card2.img) {
        img2.src = card2.img; img2.alt = card2.name;
        img2.style.display = 'block'; em2.style.display = 'none';
    } else {
        em2.innerText = card2.emoji || '🎴'; em2.style.display = 'block'; img2.style.display = 'none';
    }
    document.getElementById('hCard2Text').innerText = card2.label || card2.name;

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
        let finalHwatuHTML = charHTML + reading;
          document.getElementById('fortuneDetails').innerHTML = finalHwatuHTML;
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
    const text = "[🎴 화투점 결과]\n나의 패: " + document.getElementById('jokboName').innerText + "\n👉 내 타짜 운세 확인하기: " + window.location.href;
    if (navigator.share) { navigator.share({ title: '화투점', text: text }).catch(console.error); } 
    else { alert("클립보드에 복사되었습니다.\n\n" + text); }
};


