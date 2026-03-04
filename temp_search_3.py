with open("index.html", "r", encoding="utf-8") as f:
    text = f.read()

idx = text.find("var html = '<div class=\"astro-body")
if idx != -1:
    print(text[idx-50:idx+150])
else:
    print("Not found")

print("\n--- Testing another html = ---")
idx2 = text.find("masterInsight\n")
if idx2 != -1:
    print(text[idx2-50:idx2+50])
