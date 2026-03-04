import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

old = """    var degWhole = Math.floor(lon % 30);
    var minWhole = Math.floor(((lon % 30) - degWhole) * 60);
    var display = SIGNS[idx] + ' ' + degWhole + ' ' + minWhole + '\\'';"""

new = """    var degWhole = Math.floor(lon % 30);
    var minWhole = Math.floor(((lon % 30) - degWhole) * 60);
    var display = SIGNS[idx] + ' ' + degWhole + '° ' + minWhole + '\\'';"""

if old in text:
    print('Found')
    text = text.replace(old, new)
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(text)
else:
    print('Not found')
