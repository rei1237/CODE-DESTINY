import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

target = "var maxElem = Math.max(_c.wood, _c.fire, _c.earth, _c.metal, _c.water, natal.counts.fire, natal.counts.earth, natal.counts.metal, natal.counts.water);"
replacement = "var maxElem = Math.max(_c.wood, _c.fire, _c.earth, _c.metal, _c.water);"

text = text.replace(target, replacement)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
