
window._drawIching = function() {
  const qInput = document.getElementById('ichingQuestion');
  const qStr = qInput ? qInput.value.trim() : '';
  const wrap = document.getElementById('ichingResultWrap');
  if(!wrap) return;

  wrap.style.display = 'block';
  wrap.innerHTML = `
    <div class="iching-loading">
      <div style="font-size:3rem; margin-bottom:10px; animation: spin 4s linear infinite;">☯️</div>
      <div style="font-size:1.1rem; letter-spacing:1px; color:#FFD700; font-weight:700;">천지(天地)의 흐름을 짚어 신탁을 내립니다...</div>
      <div style="font-size:0.85rem; color:#A0AABF; margin-top:8px;">(무의식의 괘를 던지는 중)</div>
    </div>
  `;
  
  const trigrams = [
    {sym:'☰', name:'건(天)', nat:'강건함과 끝없는 추진력', elem:'하늘', love:'강렬한 이끌림', career:'거침없는 돌파', wealth:'크게 얻고 크게 쓰는 기운', exam:'시운이 돕는 최상의 운', doc:'확실하고 명백한 조건'},
    {sym:'☱', name:'태(澤)', nat:'유연한 기쁨과 소통', elem:'연못', love:'언변으로 통하는 마음', career:'원만한 소통과 타협', wealth:'흐르는 물처럼 모이는 재물', exam:'면접과 구술에서 빛남', doc:'화기애애한 합의'},
    {sym:'☲', name:'리(火)', nat:'밝고 뜨거운 통찰력', elem:'불', love:'눈부시게 타오르는 열정', career:'빛나는 타이밍과 조명', wealth:'빠르고 강렬한 이익', exam:'예상 적중의 행운', doc:'유리하게 작성된 빛나는 계약'},
    {sym:'☳', name:'진(雷)', nat:'강렬한 시작과 놀람', elem:'우레', love:'우연히 다가온 운명적 설렘', career:'새로운 분야의 파격적 개척', wealth:'예상치 못한 대박의 징조', exam:'아슬아슬한 극적 통과', doc:'번개처럼 빠르게 성사됨'},
    {sym:'☴', name:'손(風)', nat:'스미는 듯한 부드러움', elem:'바람', love:'서서히 젖어드는 인연', career:'유연한 대처로 쌓아가는 성공', wealth:'안정적이고 지속적인 수익', exam:'착실한 노력의 결실', doc:'디테일한 조항을 살펴야 할 때'},
    {sym:'☵', name:'감(水)', nat:'깊고 아득한 지혜', elem:'물', love:'비밀스럽고 깊어지는 애정', career:'위기를 기회로 바꾸는 책략', wealth:'손절과 유지가 중요한 때', exam:'어려움 속의 한 줄기 빛', doc:'함정이 없는지 신중히 검토하라'},
    {sym:'☶', name:'간(山)', nat:'침착함과 묵직한 안정', elem:'산', love:'쉽게 변하지 않는 우직함', career:'내실을 다지는 든든한 휴식기', wealth:'안전 자산의 축적', exam:'흔들림 없는 평정심', doc:'보수적이고 묵직한 서명'},
    {sym:'☷', name:'곤(地)', nat:'만물을 포용하는 평온', elem:'땅', love:'다 퍼주는 헌신적 사랑', career:'서포트하며 때를 기다림', wealth:'장기적인 안목의 저축', exam:'성실함이 만든 확실한 합격', doc:'모두가 상생하는 윈윈 결과'}
  ];

  setTimeout(() => {
    let upIdx = Math.floor(Math.random()*8);
    let dnIdx = Math.floor(Math.random()*8);
    let upper = trigrams[upIdx];
    let lower = trigrams[dnIdx];
    
    let hexChar = String.fromCharCode(0x4DC0 + Math.floor(Math.random()*64)); 
    let randName = [
      '중천건','중지곤','수뢰둔','산수몽','수천수','천수송','지수사','수지비',
      '풍천소축','천택리','지천태','천지비','천화동인','화천대유','지산겸','뇌지예',
      '택뢰수','산풍고','지림','풍지관','화뢰서합','산화비','산지박','지뢰복',
      '천뢰무망','산천대축','산뢰이','택풍대과','감위수','리위화','택산함','뇌풍항',
      '천산둔','뇌천대장','화지진','지화명이','풍화가인','화택규','수산건','뇌수해',
      '산택손','풍뢰익','택천쾌','천풍구','택지췌','지풍승','택수곤','수풍정',
      '택화혁','화풍정','진위뢰','간위산','풍산점','뇌택귀매','뇌화풍','화산려',
      '손위풍','태위택','풍수환','수택절','풍택중부','뇌산소과','수화기제','화수미제'
    ];
    let pickName = randName[Math.floor(Math.random()*64)];
    
    let html = `
      <div class="iching-hex show">${hexChar}</div>
      <div style="text-align:center; font-weight:900; color:#FFD700; margin-bottom:15px; font-size:1.4rem; letter-spacing:3px; text-shadow: 0 0 10px rgba(255,215,0,0.5);">
        『 ${pickName} 』
      </div>
      <div class="iching-divider"></div>
      <div style="display:flex; justify-content:center; gap:30px; color:#A0AABF; font-size:0.95rem; margin-bottom:25px;">
        <div style="text-align:center;">
          <div style="font-size:0.8rem; margin-bottom:4px; color:#888;">상괘(현재의 표면)</div>
          <strong style="color:#FFA500; font-size:1.1rem;">${upper.name} ${upper.sym}</strong>
        </div>
        <div style="width:1px; background:rgba(255,215,0,0.3); height:35px;"></div>
        <div style="text-align:center;">
          <div style="font-size:0.8rem; margin-bottom:4px; color:#888;">하괘(미래의 이면)</div>
          <strong style="color:#FFA500; font-size:1.1rem;">${lower.name} ${lower.sym}</strong>
        </div>
      </div>

      <div class="iching-text">
        <strong class="p-title">🕯️ [조식(調息)] — 하늘에 묻다</strong>
        <span style="color:#FFF; font-style:italic;">"${qStr ? qStr : '내면의 깊은 고민'}..."</span><br>
        당신의 간절한 뜻이 허공을 가르며 무극(無極)에 닿았습니다. 대자연의 호흡이 당신의 질문을 조용히 읊조리며, 고착된 운명의 장막을 서서히 걷어냅니다.
      </div>

      <div class="iching-text">
        <strong class="p-title">📜 [작괘(作卦)] — 신탁이 내려지다</strong>
        오래된 거북의 등껍질 위로 음양(陰陽)의 산가지가 흩뿌려집니다...<br>
        밖으로는 <strong>${upper.nat}</strong>을 뜻하는 본괘(本卦)를 얹고, 안으로는 <strong>${lower.nat}</strong>을 담은 지괘(之卦)의 뿌리를 세워, 당신의 당면한 질문에 단호한 결론을 지어냅니다.
      </div>

      <div class="iching-text" style="border-bottom:none; margin-bottom:0;">
        <strong class="p-title">🏮 [괘사(卦辭) & 효사(爻辭)] — 대가의 조언</strong>
        주역의 현자가 당신에게 속삭입니다. <br>
        <div style="background:rgba(255,215,0,0.05); padding:10px; border-left:3px solid #FFD700; margin:10px 0; font-style:italic; color:#E2E8F0;">
          "때로는 <span style="color:#FFD700">${lower.elem}</span>처럼 안으로 인내를 다지고, 때로는 <span style="color:#FFD700">${upper.elem}</span>처럼 밖으로 기세를 뻗어나가라."
        </div>
        현재 당신의 운기는 <span style="color:#fff;">외부의 기세</span>와 <span style="color:#fff;">내면의 숨은 본성</span>이 격렬하게 교차하는 임계점입니다. 헛된 욕망과 집착을 버리고, 흐름의 변곡점(타이밍)을 직시할 때 비로소 닫혀있던 거대한 문이 열릴 것입니다.
      </div>

      <div class="iching-divider"></div>

      <div style="margin-top:20px;">
        <div class="iching-category">
          <div class="iching-badge">💕 연애</div>
          <div class="iching-desc">${upper.name}의 겉모습과 ${lower.name}의 속마음이 교차합니다. <strong>${upper.love}</strong>과 <strong>${lower.love}</strong>의 양상이 부딪히며 인연의 향방을 결정짓습니다.</div>
        </div>
        <div class="iching-category">
          <div class="iching-badge">🚀 사업 / 커리어</div>
          <div class="iching-desc"><strong>${upper.career}</strong>의 강한 흐름이 다가옵니다. 겉으로는 담대하게 뻗어가되, 내면에는 <strong>${lower.career}</strong>의 철저함을 지녀야 진퇴(進退)의 때를 잃지 않습니다.</div>
        </div>
        <div class="iching-category">
          <div class="iching-badge">💰 투자 / 재물</div>
          <div class="iching-desc">현재 이익의 흐름은 <strong>${upper.wealth}</strong>을 향합니다. 다만, 바닥을 단단히 지키는 힘은 <strong>${lower.wealth}</strong>이니, 냉정한 포트폴리오 밸런스가 운명을 가릅니다.</div>
        </div>
        <div class="iching-category">
          <div class="iching-badge">💮 합격 / 성취</div>
          <div class="iching-desc">하늘이 내어주는 천시(天時)는 <strong>${upper.exam}</strong>에 놓여있고, 당신의 노력인 지리(地利)는 <strong>${lower.exam}</strong>으로 피어납니다. 두 기운이 공명할 때 정상에 오릅니다.</div>
        </div>
        <div class="iching-category" style="margin-bottom:0;">
          <div class="iching-badge">📜 계약 / 문서 / 방위</div>
          <div class="iching-desc">서면상으로는 <strong>${upper.doc}</strong>의 길운이 보이나, 이면에는 <strong>${lower.doc}</strong>의 까다로운 속성이 숨어있습니다. 디테일을 살펴 함정을 빗겨가야 길(吉)을 취할 수 있습니다.</div>
        </div>
      </div>
    `;
    wrap.innerHTML = html;
  }, 2200);
}
