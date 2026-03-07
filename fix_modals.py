import re
with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. replace padding:20px 16px 88px; -> padding:20px 16px calc(120px + env(safe-area-inset-bottom));
text = re.sub(
    r'padding:20px 16px 88px;',
    r'padding:20px 16px calc(120px + env(safe-area-inset-bottom));',
    text
)

# 2. Add document.body.style.overflow = 'hidden' to openModal functions
# and document.body.style.overflow = '' to closeModal functions.

def lock_scroll(m):
    return m.group(0) + '\n        document.body.style.overflow = "hidden";'

def unlock_scroll(m):
    return m.group(0) + '\n        document.body.style.overflow = "";'

# for astro
text = re.sub(r'(function openAstroModal\(\)\s*\{\s*var overlay = document.getElementById\(\'astroModalOverlay\'\);\s*if \(\!overlay\) return;)', lock_scroll, text)
text = re.sub(r'(function closeAstroModal\(\)\s*\{\s*var o = document.getElementById\(\'astroModalOverlay\'\); if \(o\) o.style.display = \'none\';)', unlock_scroll, text)

# for ziwei
text = re.sub(r'(function openZiweiModal\(\)\s*\{\s*var overlay = document.getElementById\(\'ziweiModalOverlay\'\);\s*if \(\!overlay\) return;)', lock_scroll, text)
text = re.sub(r'(function closeZiweiModal\(\)\s*\{\s*var o = document.getElementById\(\'ziweiModalOverlay\'\); if \(o\) o.style.display = \'none\';)', unlock_scroll, text)

# for sukuyo
text = re.sub(r'(function openSukuyoModal\(\)\s*\{\s*var overlay = document.getElementById\(\'sukuyoModalOverlay\'\);\s*if \(\!overlay\) return;)', lock_scroll, text)
text = re.sub(r'(function closeSukuyoModal\(\)\s*\{\s*var o = document.getElementById\(\'sukuyoModalOverlay\'\); if \(o\) o.style.display = \'none\';)', unlock_scroll, text)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)