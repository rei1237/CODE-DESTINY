import sys, re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace(
    'pSigns[n] = {sign: toSign(pData[n].lon), retro: pData[n].retro};',
    '''pSigns[n] = toSign(pData[n].lon);
    pSigns[n]["retro"] = pData[n].retro;
    pSigns[n]["sign"] = pSigns[n]["sign"];'''
)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
