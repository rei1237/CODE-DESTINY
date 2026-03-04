import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Revert Iching
revert1 = '''-if(window.BokchaeAdComponent) { html += window.BokchaeAdComponent.createHtml('Saju'); }
    wrap.innerHTML = html;
    if(window.BokchaeAdComponent) setTimeout(() => window.BokchaeAdComponent.injectScript(), 100);'''
replacerevert1 = 'wrap.innerHTML = html;'
text = text.replace(revert1, replacerevert1)

text = text.replace("""if(window.BokchaeAdComponent) { html += window.BokchaeAdComponent.createHtml('Saju'); }
    wrap.innerHTML = html;
    if(window.BokchaeAdComponent) setTimeout(() => window.BokchaeAdComponent.injectScript(), 100);""", "wrap.innerHTML = html;")

# 2. Revert Astro
text = text.replace("""if(window.BokchaeAdComponent) { html += window.BokchaeAdComponent.createHtml('Zodiac'); }
    document.getElementById('astroResult').innerHTML = html;
    if(window.BokchaeAdComponent) setTimeout(() => window.BokchaeAdComponent.injectScript(), 100);""", "document.getElementById('astroResult').innerHTML = html;")

# 3. Accordion Add
injection = '''
    if (mw) mw.style.display = 'none';

    // ✄ Main Accordion Body Ads 
    if (window.BokchaeAdComponent && !window._iaAdsInjected) {
      window._iaAdsInjected = true;
      var catMap = {
        'acc-core': 'Saju',
        'acc-fun': 'Saju',
        'acc-ai': 'Saju',
        'acc-lotto': 'Saju',
        'acc-ziwei': 'Saju',
        'acc-iching': 'Saju',
        'acc-astro': 'Zodiac'
      };
      
      GROUPS.forEach(function(g, idx) {
        // 2,4,6 th accordions get ads
        if (idx % 2 !== 0) {
          var body = document.getElementById(g.id + '-body');
          if (body) {
            var cat = catMap[g.id] || 'Saju';
            var adWrapper = document.createElement('view');
            adWrapper.innerHTML = window.BokchaeAdComponent.createHtml(cat);
            body.appendChild(adWrapper);
            setTimeout(function() { window.BokchaeAdComponent.injectScript(); }, 150);
          }
        }
      });
    }
'''

text = text.replace("if (mw) mw.style.display = 'none';", injection)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

print('Fixed injection!')
