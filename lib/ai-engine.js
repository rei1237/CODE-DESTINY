(function () {
  var KEYWORD_LIBRARY = {
    water: {
      keys: ['물', '바다', '강', '비', '파도', '홍수', '수영', '호수', '고래'],
      scene: '꿈의 공간은 감정의 물결이 강하게 흐르는 수면 위를 닮았습니다. 멈춘 듯 보여도 깊은 층에서 큰 변화가 준비되는 장면입니다.',
      symbol: '물의 상징은 정화와 재시작입니다. 최근 쌓였던 부담을 흘려보내고, 관계와 일의 흐름을 새 판으로 바꾸려는 신호로 읽힙니다.',
      echo: '이번 주에는 미루던 대화를 정리하고, 불필요한 약속 하나를 과감히 비우는 선택이 행운을 불러옵니다.'
    },
    animal: {
      keys: ['동물', '뱀', '호랑이', '새', '고양이', '강아지', '늑대', '말', '용'],
      scene: '꿈의 무대에 등장한 생명체는 본능과 보호 본능을 동시에 드러냅니다. 당신 안의 직감이 이미 답을 알고 있다는 흐름입니다.',
      symbol: '동물 상징은 본능적 판단과 경계의 회복을 뜻합니다. 타인의 기대보다 나의 리듬을 선택할수록 결과가 좋아집니다.',
      echo: '중요 결정을 앞둔 날에는 첫 느낌을 기록한 뒤 판단하세요. 직감 메모가 현실 선택의 정확도를 높여줍니다.'
    },
    travel: {
      keys: ['기차', '버스', '비행기', '길', '여행', '역', '공항', '운전', '지도'],
      scene: '이동의 장면이 강조된 꿈은 인생의 경로 전환 구간을 암시합니다. 익숙한 루트보다 새로운 방향에 시선이 향하고 있습니다.',
      symbol: '여정의 상징은 전환점, 이직, 관계 재정렬과 연결됩니다. 속도보다 방향이 중요한 시기라는 뜻입니다.',
      echo: '당장 이번 달 목표를 한 줄로 다시 정의하세요. 목적지를 선명하게 적는 행동이 실제 기회를 빠르게 끌어옵니다.'
    },
    sky: {
      keys: ['하늘', '별', '달', '태양', '은하', '우주', '구름', '밤', '빛'],
      scene: '높은 하늘과 빛의 이미지가 반복된 꿈은 관점이 확장되는 국면을 보여줍니다. 현재 고민을 더 큰 시간축에서 보라는 초대입니다.',
      symbol: '천체의 상징은 통찰, 명예, 자기 확신입니다. 불명확했던 문제에서 기준이 분명해지는 징조가 나타납니다.',
      echo: '작은 성과를 과소평가하지 마세요. 공개적으로 기록하고 공유할수록 다음 문이 빨리 열립니다.'
    },
    home: {
      keys: ['집', '방', '문', '창문', '가족', '학교', '건물', '복도', '계단'],
      scene: '실내 공간 중심의 꿈은 안전과 경계의 균형을 점검하는 흐름입니다. 익숙한 환경 안에서 감정의 재배치가 진행됩니다.',
      symbol: '집의 상징은 기반, 재정, 생활 리듬을 뜻합니다. 삶의 틀을 재정비하면 운의 체감 밀도가 높아집니다.',
      echo: '생활 루틴 하나를 고정해보세요. 취침 시간이나 아침 습관처럼 작은 고정점이 전체 운세를 안정시킵니다.'
    }
  };

  function matchTheme(text) {
    var lower = String(text || '').toLowerCase();
    var best = { name: 'sky', score: -1 };
    var names = Object.keys(KEYWORD_LIBRARY);

    names.forEach(function (name) {
      var data = KEYWORD_LIBRARY[name];
      var score = 0;
      data.keys.forEach(function (k) {
        if (lower.indexOf(k.toLowerCase()) >= 0) score += 1;
      });
      if (score > best.score) {
        best = { name: name, score: score };
      }
    });

    return KEYWORD_LIBRARY[best.name];
  }

  function buildSummary(text) {
    var clean = String(text || '').replace(/\s+/g, ' ').trim();
    if (!clean) return '기억의 파편이 작아도 괜찮습니다. 오늘의 감정 진폭을 기준으로 해몽을 시작합니다.';
    if (clean.length > 90) {
      clean = clean.slice(0, 90) + '...';
    }
    return '기록된 꿈 핵심: "' + clean + '"';
  }

  function interpretDream(inputText) {
    var theme = matchTheme(inputText);
    return {
      title: 'Dream Ledger: Midnight Translation',
      summary: buildSummary(inputText),
      scene: theme.scene,
      symbol: theme.symbol,
      echo: theme.echo
    };
  }

  window.DreamLedgerAI = {
    interpretDream: interpretDream
  };
})();
