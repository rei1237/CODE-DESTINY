import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Correct the buggy variable declaration
# We need to find the specific injection string and move it to the end of the `html` string construction.

injection_pattern = r"(\s*/\*\s*── 궁합 및 고급 기능.*?html \+= advancedAstrologyHtml;\n)( {2}var html = '<div class=\"astro-body\">\')"
# Delete the prepended block and attach `+ advancedAstrologyHtml` at the end
match = re.search(injection_pattern, text, re.DOTALL)
if match:
    # Remove it from the current position
    text = text.replace(match.group(1), "")
    
    # We will declare it before `var html = ...` but we won't use `html += ...` yet.
    advanced_var = match.group(1).replace("html += advancedAstrologyHtml;\n", "")
    
    # Prepend the Advanced definition
    text = text.replace(
        "var html = '<div class=\"astro-body\">'", 
        advanced_var + "var html = '<div class=\"astro-body cosmic-theme\">'"
    )
    
    # Find the end of `var html = ...` construction to append it safely.
    # It ends right before `var wrap_astro = document.getElementById('astroSection');`
    # or `var wrap = document.getElementById('acc-astro-body');`
    # Let's just append it before `if(wrap)`
    text = text.replace(
        "var wrap = document.getElementById('acc-astro-body');",
        "html += advancedAstrologyHtml;\n  var wrap = document.getElementById('acc-astro-body');"
    )

# 2. Add Cosmic Theme CSS
cosmic_css = """
  /* 우주의 신비감 (Cosmic UI) 적용 */
  <style>
    #acc-astro-body .astro-body.cosmic-theme {
      background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
      color: #e2e8f0;
      border: 1px solid rgba(139, 92, 246, 0.4);
      box-shadow: 0 0 40px rgba(139, 92, 246, 0.2), inset 0 0 20px rgba(0, 0, 0, 0.8);
      border-radius: 20px;
      padding: 25px;
      position: relative;
      overflow: hidden;
      font-family: 'Pretendard', sans-serif;
    }
    #acc-astro-body .astro-body.cosmic-theme::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background-image: 
        radial-gradient(2px 2px at 20px 30px, #eee, rgba(0,0,0,0)),
        radial-gradient(2px 2px at 40px 70px, #fff, rgba(0,0,0,0)),
        radial-gradient(2px 2px at 50px 160px, #ddd, rgba(0,0,0,0)),
        radial-gradient(2px 2px at 90px 40px, #fff, rgba(0,0,0,0)),
        radial-gradient(2px 2px at 130px 80px, #fff, rgba(0,0,0,0)),
        radial-gradient(2px 2px at 160px 120px, #ddd, rgba(0,0,0,0));
      background-repeat: repeat;
      background-size: 200px 200px;
      opacity: 0.4;
      pointer-events: none;
      animation: twinkle 5s linear infinite;
    }
    @keyframes twinkle {
      0% { opacity: 0.3; }
      50% { opacity: 0.6; }
      100% { opacity: 0.3; }
    }
    #acc-astro-body .astro-section {
      background: rgba(255, 255, 255, 0.04);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 24px;
      position: relative;
      z-index: 1;
      transition: transform 0.3s ease;
    }
    #acc-astro-body .astro-section:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
      border-color: rgba(167, 139, 250, 0.4);
    }
    #acc-astro-body .astro-subhead {
      color: #d8b4fe;
      font-size: 1.2rem;
      font-weight: 700;
      border-bottom: 1px solid rgba(216, 180, 254, 0.3);
      padding-bottom: 8px;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      gap: 8px;
      text-shadow: 0 0 10px rgba(167, 139, 250, 0.5);
    }
    #acc-astro-body .astro-tags .astro-tag {
      background: rgba(139, 92, 246, 0.2);
      border: 1px solid rgba(139, 92, 246, 0.4);
      color: #e9d5ff;
    }
    #acc-astro-body .astro-desc {
      color: #cbd5e1;
      line-height: 1.6;
    }
    #acc-astro-body .astro-desc b {
      color: #fca5a5;
    }
  </style>
"""

if "cosmic-theme" not in text:
    text = text.replace("function renderAstroInsight() {", "function renderAstroInsight() {\n" + cosmic_css)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(text)
