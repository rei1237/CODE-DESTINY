import re

with open('HwatuFortune.js', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update Category selection quote trigger with GSAP character image scaling effect
cat_match = re.search(r'window\.setHwatuCategory = function\(cat, btnParam\) \{.*?\n\s*\}', text, flags=re.DOTALL)
new_cat = '''window.setHwatuCategory = function(cat, btnParam) {
    window.currentHwatuCategory = cat;
    document.querySelectorAll('#hwatuCategoryBox .ctg-btn').forEach(b => b.classList.remove('active'));
    if(btnParam) btnParam.classList.add('active');
    
    // 카테고리 클릭 시 사운드
    if(typeof playClackSound === 'function') {
        playClackSound(200); 
        setTimeout(() => playClackSound(250), 100);
    }

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

with open('HwatuFortune.js', 'w', encoding='utf-8') as f:
    f.write(text)

