const fs = require('fs');
let text = fs.readFileSync('js/saju-engine.js', 'utf8');

const targetStr =       '</div>'+
    '</div>'+
    /* AI 프롬프트 박스들 */
    '<div class=\"prem-box\" style=\"background:#fff;margin-top:12px;border:1px solid #FFB7B2;\">'+
      '<span class=\"prem-title\" style=\"color:#FF8BA7;\">🎨 맞춤형 사주 물상 AI 프롬프트</span>'+
      '<p style=\"font-size:0.8rem;color:#888;margin-bottom:10px;\">이 문구를 복사해 AI(미드저니 등)에게 풍경화 스타일 물상을 요청해보세요.</p>'+
      '<div style=\"background:#FFF5F8;padding:12px;border-radius:10px;font-size:0.85rem;border:1px dashed #FF8BA7;word-break:break-all;color:#555;\">'+prompt+'</div>'+
      '<button class=\"btn-sub\" style=\"margin-top:10px;padding:10px;font-size:0.8rem;background:#FF8BA7;color:white;border:none;border-radius:8px;\" onclick=\"navigator.clipboard.writeText(\\\''+safePrompt+'\\').then(function(){alert(\\\'✨ 프롬프트가 복사되었습니다!\\\');})\">📋 프롬프트 복사하기</button>'+
    '</div>'+
    '<div class=\"prem-box\" style=\"background:linear-gradient(135deg,#FCE4EC,#F3E5F5);margin-top:12px;border:1.5px solid #E91E63;\">'+
      '<span class=\"prem-title\" style=\"color:#C2185B;\">🐾 내 사주 아바타 — 귀여운 동물 캐릭터</span>'+
      '<p style=\"font-size:0.8rem;color:#555;margin-bottom:10px;\">타고난 사주 기운을 귀여운 동물로 표현했습니다.</p>'+
      '<div style=\"background:rgba(255,255,255,.8);padding:12px;border-radius:10px;font-size:0.85rem;border:1px dashed #E879A4;word-break:break-all;color:#555;\">'+generateAvatarPrompt(p)+'</div>'+
      '<button class=\"btn-sub\" style=\"margin-top:10px;padding:10px;font-size:0.8rem;background:#E879A4;color:white;border:none;border-radius:8px;\" onclick=\"navigator.clipboard.writeText(\\\''+generateAvatarPrompt(p).replace(/'/g,\"\\\\'\")+'\\').then(function(){alert(\\\'✨ 아바타 프롬프트가 복사되었습니다!\\\');})\">📋 아바타 프롬프트 복사</button>'+
    '</div>'+
    '<div class=\"prem-box\" style=\"background:linear-gradient(135deg,#E1F5FE,#F0F4C3);margin-top:12px;border:1.5px solid #0277BD;\">'+
      '<span class=\"prem-title\" style=\"color:#01579B;\">💕 내 이상형 얼굴 — 사주 궁합 기반 AI 초상화</span>'+
      '<p style=\"font-size:0.8rem;color:#555;margin-bottom:10px;\">당신의 사주와 잘 맞는 이상형의 특징을 반영한 얼굴 초상화 프롬프트입니다.</p>'+
      '<div style=\"background:rgba(255,255,255,.8);padding:12px;border-radius:10px;font-size:0.85rem;border:1px dashed #4FC3F7;word-break:break-all;color:#555;\">'+generateIdealPartnerPrompt(p,natal)+'</div>'+
      '<button class=\"btn-sub\" style=\"margin-top:10px;padding:10px;font-size:0.8rem;background:#4FC3F7;color:white;border:none;border-radius:8px;\" onclick=\"navigator.clipboard.writeText(\\\''+generateIdealPartnerPrompt(p,natal).replace(/'/g,\"\\\\'\")+'\\').then(function(){alert(\\\'✨ 이상형 프롬프트가 복사되었습니다!\\\');})\">📋 이상형 프롬프트 복사</button>'+
    '</div>'+
    '</div>';

  var existing = document.getElementById('specialCharmCard');
  if(existing) existing.remove();
  document.getElementById('dailyMonthlyCard').insertAdjacentHTML('afterend', html);
};

const replaceStr =       '</div>'+
    '</div>';

  var aiPromptHtml = 
    '<div id=\"aiPromptCard\" style=\"margin-top:15px\">'+
    /* AI 프롬프트 박스들 */
    '<div class=\"prem-box\" style=\"background:#fff;border:1px solid #FFB7B2;\">'+
      '<span class=\"prem-title\" style=\"color:#FF8BA7;\">🎨 맞춤형 사주 물상 AI 프롬프트</span>'+
      '<p style=\"font-size:0.8rem;color:#888;margin-bottom:10px;\">이 문구를 복사해 AI(미드저니 등)에게 풍경화 스타일 물상을 요청해보세요.</p>'+
      '<div style=\"background:#FFF5F8;padding:12px;border-radius:10px;font-size:0.85rem;border:1px dashed #FF8BA7;word-break:break-all;color:#555;\">'+prompt+'</div>'+
      '<button class=\"btn-sub\" style=\"margin-top:10px;padding:10px;font-size:0.8rem;background:#FF8BA7;color:white;border:none;border-radius:8px;\" onclick=\"navigator.clipboard.writeText(\\\''+safePrompt+'\\').then(function(){alert(\\\'✨ 프롬프트가 복사되었습니다!\\\');})\">📋 프롬프트 복사하기</button>'+
    '</div>'+
    '<div class=\"prem-box\" style=\"background:linear-gradient(135deg,#FCE4EC,#F3E5F5);margin-top:12px;border:1.5px solid #E91E63;\">'+
      '<span class=\"prem-title\" style=\"color:#C2185B;\">🐾 내 사주 아바타 — 귀여운 동물 캐릭터</span>'+
      '<p style=\"font-size:0.8rem;color:#555;margin-bottom:10px;\">타고난 사주 기운을 귀여운 동물로 표현했습니다.</p>'+
      '<div style=\"background:rgba(255,255,255,.8);padding:12px;border-radius:10px;font-size:0.85rem;border:1px dashed #E879A4;word-break:break-all;color:#555;\">'+generateAvatarPrompt(p)+'</div>'+
      '<button class=\"btn-sub\" style=\"margin-top:10px;padding:10px;font-size:0.8rem;background:#E879A4;color:white;border:none;border-radius:8px;\" onclick=\"navigator.clipboard.writeText(\\\''+generateAvatarPrompt(p).replace(/'/g,\"\\\\'\")+'\\').then(function(){alert(\\\'✨ 아바타 프롬프트가 복사되었습니다!\\\');})\">📋 아바타 프롬프트 복사</button>'+
    '</div>'+
    '<div class=\"prem-box\" style=\"background:linear-gradient(135deg,#E1F5FE,#F0F4C3);margin-top:12px;border:1.5px solid #0277BD;\">'+
      '<span class=\"prem-title\" style=\"color:#01579B;\">💕 내 이상형 얼굴 — 사주 궁합 기반 AI 초상화</span>'+
      '<p style=\"font-size:0.8rem;color:#555;margin-bottom:10px;\">당신의 사주와 잘 맞는 이상형의 특징을 반영한 얼굴 초상화 프롬프트입니다.</p>'+
      '<div style=\"background:rgba(255,255,255,.8);padding:12px;border-radius:10px;font-size:0.85rem;border:1px dashed #4FC3F7;word-break:break-all;color:#555;\">'+generateIdealPartnerPrompt(p,natal)+'</div>'+
      '<button class=\"btn-sub\" style=\"margin-top:10px;padding:10px;font-size:0.8rem;background:#4FC3F7;color:white;border:none;border-radius:8px;\" onclick=\"navigator.clipboard.writeText(\\\''+generateIdealPartnerPrompt(p,natal).replace(/'/g,\"\\\\'\")+'\\').then(function(){alert(\\\'✨ 이상형 프롬프트가 복사되었습니다!\\\');})\">📋 이상형 프롬프트 복사</button>'+
    '</div>'+
    '</div>';

  var existing = document.getElementById('specialCharmCard');
  if(existing) existing.remove();
  
  var existingAi = document.getElementById('aiPromptCard');
  if(existingAi) existingAi.remove();
  
  document.getElementById('dailyMonthlyCard').insertAdjacentHTML('afterend', html);
  document.getElementById('specialCharmCard').insertAdjacentHTML('afterend', aiPromptHtml);
};

if(text.includes(targetStr)) {
  fs.writeFileSync('js/saju-engine.js', text.replace(targetStr, replaceStr), 'utf8');
  console.log('Successfully replaced');
} else {
  console.log('Target string not found!');
  // print first few lines of targetStr and what actually exists
  console.log("Looking for:");
  console.log(targetStr.substring(0, 100));
}