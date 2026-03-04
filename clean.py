with open('HwatuFortune.js', 'r', encoding='utf-8') as f:
    text = f.read()

rep = '''if(window.BokchaeAdComponent) { finalHwatuHTML += window.BokchaeAdComponent.createHtml('Saju'); }
          document.getElementById('fortuneDetails').innerHTML = finalHwatuHTML;
          if(window.BokchaeAdComponent) setTimeout(() => window.BokchaeAdComponent.injectScript(), 100);'''
to = '''document.getElementById('fortuneDetails').innerHTML = finalHwatuHTML;'''

text = text.replace(rep, to)

with open('HwatuFortune.js', 'w', encoding='utf-8') as f:
    f.write(text)
