import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Remove the misplaced `html += advancedAstrologyHtml;`
text = text.replace('    html += advancedAstrologyHtml;\n', '')

# 2. Add `html += advancedAstrologyHtml;` before the innerHTML assignment
target = "document.getElementById('astroResult').innerHTML = html;"
if "html += advancedAstrologyHtml;" not in text and target in text:
    text = text.replace(
        target,
        "html += advancedAstrologyHtml;\n    " + target
    )

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
