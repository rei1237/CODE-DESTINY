with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

target = "renderLottoNumbers(natal, bazi);"
inject = """renderLottoNumbers(natal, bazi);
    if(typeof lunarDateObj !== 'undefined') {
      renderSukuyo(p, natal, bazi, lunarDateObj);
    }"""

if inject not in text and target in text:
    text = text.replace(target, inject)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
