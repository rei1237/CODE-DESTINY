with open("index.html", "r", encoding="utf-8") as f:
    text = f.read()

idx = text.find("cosmic-theme")
print(text[idx-50:idx+250])
