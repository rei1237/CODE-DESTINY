import re

with open('HwatuFortune.js', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace("""if(window.BokchaeAdComponent) { finalHwatuHTML += window.BokchaeAdComponent.createHtml('Saju'); }
          resultDiv.innerHTML = finalHwatuHTML;
          if(window.BokchaeAdComponent) setTimeout(() => window.BokchaeAdComponent.injectScript(), 100);""", "resultDiv.innerHTML = finalHwatuHTML;")

with open('HwatuFortune.js', 'w', encoding='utf-8') as f:
    f.write(text)
