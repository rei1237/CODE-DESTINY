import re

with open('HwatuFortune.js', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update Kakao Share
old_share = r'''window.shareHwatu = function\(\) \{
      const text = "\[ 타짜 화투점 결과\]\\n나의 패: " \+ document.getElementById\('jokboName'\)\.innerText \+ "\\n 내 타짜 운세 확인하기: " \+ window.location.href;
      if \(navigator\.share\) \{ navigator\.share\(\{ title: '타짜 화투점', text: text \}\)\.catch\(console\.error\); \} 
      else \{ alert\("클립보드에 복사되었습니다\.\\n\\n" \+ text\); \}
  \};'''

new_share = '''window.shareHwatu = function() {
      const text = "[ 타짜: 신의 손길]\\n나의 패: " + document.getElementById('jokboName').innerText + "\\n\\n 타짜 운세판에 입장하기:\\n" + window.location.href;
      const encoded = encodeURIComponent(text);
      const kakaoUrl = 'kakaotalk://send?text=' + encoded;
      const a = document.createElement('a');
      a.href = kakaoUrl;
      a.click();
      setTimeout(() => {
          if (!navigator.userAgent.match(/KAKAOTALK/i)) {
              alert(text + "\\n\\n(카카오톡 앱으로 공유를 시도했습니다. 카카오톡이 설치되어 있다면 메시지 전송 창이 열립니다.)");
          }
      }, 500);
  };'''
text = re.sub(old_share, new_share, text)

# 2. Add Audio Context Resuming and better Clack sound
sound_match = re.search(r'function playClackSound\(freq=150\) \{.*?\n\s*\}', text, flags=re.DOTALL)
new_sound = '''function playClackSound(freq=150) {
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
}'''
if sound_match: text = text[:sound_match.start()] + new_sound + text[sound_match.end():]

# 3. Update Category selection quote trigger
cat_match = re.search(r'window\.setHwatuCategory = function\(cat, btnParam\) \{.*?\}', text, flags=re.DOTALL)
new_cat = '''window.setHwatuCategory = function(cat, btnParam) {
    window.currentHwatuCategory = cat;
    document.querySelectorAll('#hwatuCategoryBox .ctg-btn').forEach(b => b.classList.remove('active'));
    if(btnParam) btnParam.classList.add('active');
    
    // 카테고리 클릭 시 사운드
    playClackSound(200); 
    setTimeout(() => playClackSound(250), 100);

    let quote = "";
    if(cat === 'wealth') quote = '정마담: "나 이대 나온 여자야. 아무 판에나 돈 안 걸어. 확실한 곳을 골라줄게."';
    else if(cat === 'love') quote = '고니: "사랑도 도박이야. 내 모든 걸 걸 때가 있는 법이지."';
    else if(cat === 'contact') quote = '짝귀: "구라치지 마라. 네 속마음, 내 연락 기다리고 있잖아?"';
    else if(cat === 'success') quote = '평경장: "기억해라. 진정한 실력은 기술이 아니라 평상심에서 나오는 거다."';
    
    const sub = document.querySelector('.tazza-sub');
    if(sub) {
        sub.innerText = quote;
        sub.style.color = "#d4af37";
        if(window.gsap) gsap.fromTo(sub, { scale: 1.05, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5 });
    }
}'''
if cat_match: text = text.replace(cat_match.group(0), new_cat)

# 4. Refined Fortune Readings (Non Overlapping)
fortune_match = re.search(r'function getFortuneAndCharacter\(score\) \{.*?return \{ character.*?;\n\}', text, flags=re.DOTALL)
new_fortune = '''function getFortuneAndCharacter(score) {
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
}'''
if fortune_match: text = text[:fortune_match.start()] + new_fortune + text[fortune_match.end():]

with open('HwatuFortune.js', 'w', encoding='utf-8') as f:
    f.write(text)

print("Audio, share and extra quotes updated.")
