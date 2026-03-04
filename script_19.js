
function updateCompatUI(){
  var t=document.getElementById('compatType');
  var desc=document.getElementById('compatTypeDesc');
  var btn=document.getElementById('compatRunBtn');
  if(!t||!desc||!btn)return;
  var v=t.value||'love';
  if(v==='love'){
    desc.textContent='연애/결혼: 감정, 온기, 일지·십성 간의 조화에 초점을 맞춘 분석을 제공합니다.';
    btn.innerHTML='💗 연애 궁합 분석하기';
  }else if(v==='business'){
    desc.textContent='사업/동업: 역할·책임·용신·상극을 중심으로 실무적·재무적 적합성을 평가합니다.';
    btn.innerHTML='💼 사업 궁합 분석하기';
  }else{
    desc.textContent='친구/동료: 우정·협업·에너지 호흡을 중심으로 편안함과 시너지 포인트를 안내합니다.';
    btn.innerHTML='🤝 우정/동료 궁합 분석하기';
  }
}
var compatTypeEl=document.getElementById('compatType');
if(compatTypeEl) compatTypeEl.addEventListener('change',updateCompatUI);
if(document.readyState==='complete' || document.readyState==='interactive') setTimeout(updateCompatUI,50);
