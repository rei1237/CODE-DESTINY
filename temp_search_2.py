with open("index.html", "r", encoding="utf-8") as f:
    text = f.read()

idx = text.find("advancedAstrologyHtml")
while idx != -1:
    print(f"--- MATCH {idx} ---")
    print(text[idx-50:idx+550])
    idx = text.find("advancedAstrologyHtml", idx + 1)
