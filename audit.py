import re

files = ['index.html', 'js/saju-engine.js', 'js/iching-engine.js', 'js/astral-soul.js', 'js/oracle-kcg.js']
for fname in files:
    with open(fname, 'r', encoding='utf-8') as f:
        text = f.read()
    print(f'=== {fname} ===')
    # touch-action: none
    for m in re.finditer(r'.{40}touch-action\s*:\s*none.{40}', text):
        print(' [touch-none]', repr(m.group(0)))
    # preventDefault inside touch/wheel listeners
    for m in re.finditer(r'(touchstart|touchmove|touchend|wheel)[^\x22]{0,200}preventDefault', text, re.DOTALL):
        print(' [preventDefault]', repr(m.group(0)[:120]))
    # overflow hidden on main containers
    for m in re.finditer(r'(body|html|modal|Modal)[^\{]{0,80}overflow\s*:\s*hidden', text):
        print(' [overflow-hidden]', repr(m.group(0)))
    # webkit-scrollbar display:none
    for m in re.finditer(r'::-webkit-scrollbar\s*\{[^\}]*display\s*:\s*none', text):
        print(' [scrollbar-none]', repr(m.group(0)[:80]))
    print()
