with open("index.html", "r", encoding="utf-8") as f:
    text = f.read()

idx = text.find("function renderAstroInsight")
print("Function start:", idx)
end_idx = text.find("function renderZwSummary", idx)
print("Function end:", end_idx)

idx2 = idx
while True:
    idx2 = text.find("innerHTML =", idx2 + 1, end_idx)
    if idx2 == -1: break
    print("Found innerHTML at:", idx2)
    print(text[idx2-50:idx2+50])

print("Looking for acc-astro-body assignment...")
idx3 = text.find("acc-astro-body", idx, end_idx)
if idx3 != -1:
    print(text[idx3-50:idx3+50])
