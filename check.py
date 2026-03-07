import re
with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()
for m in re.finditer(r'<div id="\w+ModalSheet"[^>]+>\s*<div[^>]+padding:(.*?)box-sizing:border-box;', text):
    print(m.group(0))