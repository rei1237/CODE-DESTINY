import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace("""if(window.BokchaeAdComponent) { oracleHtml += window.BokchaeAdComponent.createHtml('Tarot'); }
      tarotOracleResult.innerHTML = oracleHtml;
      if(window.BokchaeAdComponent) setTimeout(() => window.BokchaeAdComponent.injectScript(), 100);""", "tarotOracleResult.innerHTML = oracleHtml;")

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)

