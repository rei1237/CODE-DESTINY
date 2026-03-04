with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace(
    'var html = \'<div class="astro-body">\' + masterInsight',
    'var html = \'<div class="astro-body cosmic-theme">\' + masterInsight'
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
