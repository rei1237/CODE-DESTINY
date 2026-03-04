import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# I am adding the new sections to renderAstroInsight UI
html_to_insert = """
    /* ── 궁합 및 고급 기능 (Synastry, Firdaria, Profection) 공간 추가 ── */
    var advancedAstrologyHtml = `
    <div class="astro-section">
      <div class="astro-subhead">📌 3. 4원소 균형 (Elemental Balance)</div>
      <div class="astro-desc" style="display:flex; justify-content:space-around;">
        <span style="color:#f87171">불(Fire): 25%</span>
        <span style="color:#fde68a">흙(Earth): 40%</span>
        <span style="color:#60a5fa">공기(Air): 20%</span>
        <span style="color:#34d399">물(Water): 15%</span>
      </div>
      <p style="text-align:center; font-size:0.8rem; margin-top:5px; color:#94a3b8;">
        물질적 안정성(흙)이 주도하며 창조적 열정(불)이 보완하는 구조입니다.
      </p>
    </div>

    <div class="astro-section">
      <div class="astro-subhead">📌 4. 궁합(Synastry) 및 인연의 끈</div>
      <div class="astro-desc">
        <p><b>[소울메이트 시그니처]</b> 당신의 금성(Venus)과 상대의 화성(Mars)이 만들어내는 각도는 매우 강렬한 로맨틱 텐션을 자아냅니다.</p>
        <p><b>[업장(Karmic)의 교차]</b> 토성(Saturn)의 위치로 보아 책임감과 인내를 배우는 배움의 관계로 이어질 확률이 짙습니다. 단기적인 쾌락보다 상호 성장을 추구하세요.</p>
      </div>
    </div>

    <div class="astro-section">
      <div class="astro-subhead">📌 5. 피르다리아 (Firdaria - 고전 시간 통치자)</div>
      <div class="astro-desc">
        <p>현재 당신을 지배하는 메인 타임로드는 <b>수성(Mercury)</b>입니다. 지적 탐구, 커뮤니케이션, 단기 여행이 인생의 주 무대가 되는 시기입니다.</p>
        <p>서브 타임로드는 <b>금성(Venus)</b>으로, 이 시기에는 인간관계의 호전과 미적 성취, 그리고 재정적 이익이 따르게 될 것입니다.</p>
      </div>
    </div>

    <div class="astro-section">
      <div class="astro-subhead">📌 6. 연간 프로펙션 (Annual Profections)</div>
      <div class="astro-desc">
        <p>올해 당신은 <b>제 4하우스(게자리/달)</b> 프로펙션 해를 맞이합니다.</p>
        <p>핵심 테마: 가정, 주거 환경의 변화, 내적 뿌리의 다지기. 올해의 가장 중요한 천체는 '달(Moon)'이며, 멘탈 케어와 가족 관계가 핵심이 됩니다.</p>
      </div>
    </div>`;

    html += advancedAstrologyHtml;
"""

text = text.replace(
    '''  var html = '<div class="astro-body">' + masterInsight''',
    html_to_insert + '''\n  var html = '<div class="astro-body">' + masterInsight'''
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
