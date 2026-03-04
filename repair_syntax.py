import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# The invalid JS chunk:
invalid_js_pattern = re.compile(
    r'(\n\s*/\* 우주의 신비감 \(Cosmic UI\) 적용 \*/\n\s*<style>[\s\S]*?</style>\n)',
    re.MULTILINE
)

# Extract it
m = invalid_js_pattern.search(text)
if m:
    invalid_block = m.group(1)
    
    # Remove it from JS
    text = text.replace(invalid_block, "")
    
    # Put it right before `</head>` or in another `<style>` block in the HTML section outside of scripts
    text = text.replace('</head>', invalid_block + '\n</head>')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
