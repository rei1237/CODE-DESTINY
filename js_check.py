
with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

idx = text.find('if (tabIching && ibody && !tabIching.dataset.iaMoved)')
print(text[idx-100:idx+1500])

