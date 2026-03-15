# Tarot Analysis Engine Spec

## Step 1) DB 설계 + JSON 구조

아래 스키마 기준으로 `server/data/tarot-cards.db.json`(실운영), `server/data/tarot-cards.sample.json`(샘플/폴백)을 사용합니다.

- 필수 필드:
  - `id`
  - `name` / `nameKr`
  - `arcanaType` (`Major`/`Minor`)
  - `suit` (`Wands`/`Cups`/`Swords`/`Pentacles`/`null`)
  - `rank`, `number`
  - `keywords.upright[]`, `keywords.reversed[]`
  - `interpretations.upright.{general,love,money,career}`
  - `interpretations.reversed.{general,love,money,career}`

JSON Schema 파일: `server/data/tarot-cards.schema.json`

### 샘플 데이터 2개 (메이저 1, 마이너 1)

```json
{
  "id": "M00",
  "name": "The Fool",
  "nameKr": "바보",
  "arcanaType": "Major",
  "suit": null,
  "rank": "0",
  "number": 0,
  "imageKey": "major-the-fool",
  "keywords": {
    "upright": ["새로운 시작", "자유", "모험", "순수함"],
    "reversed": ["무모함", "준비 부족", "충동", "회피"]
  },
  "interpretations": {
    "upright": {
      "general": "새로운 출발이 열리는 시점입니다. 계산보다 신뢰가 더 큰 기회를 만듭니다.",
      "love": "관계에서 솔직함과 가벼운 용기가 흐름을 바꿉니다.",
      "money": "새로운 수입 경로를 실험할 수 있지만 기본 안전장치는 먼저 확보하세요.",
      "career": "익숙한 틀을 벗어난 제안이 성장 기회로 연결됩니다."
    },
    "reversed": {
      "general": "성급한 판단이 손실로 이어질 수 있으니 속도를 낮추세요.",
      "love": "감정의 즉흥성이 오해를 만들 수 있어 의도 확인이 필요합니다.",
      "money": "검증되지 않은 투자는 피하고 지출 통제를 먼저 하세요.",
      "career": "준비 없는 도전보다 역량 보강 후 실행이 유리합니다."
    }
  }
}
```

```json
{
  "id": "C01",
  "name": "Ace of Cups",
  "nameKr": "컵 에이스",
  "arcanaType": "Minor",
  "suit": "Cups",
  "rank": "Ace",
  "number": 1,
  "imageKey": "cups-ace",
  "keywords": {
    "upright": ["감정의 시작", "치유", "공감", "연결"],
    "reversed": ["감정 억압", "거리감", "소통 단절", "정서 고갈"]
  },
  "interpretations": {
    "upright": {
      "general": "감정적 회복과 새로운 정서적 연결이 시작됩니다.",
      "love": "관계에서 진심이 열린다면 빠르게 친밀도가 높아집니다.",
      "money": "감정 소비보다 가치 중심 소비가 재정 안정에 도움이 됩니다.",
      "career": "협업 신뢰가 강화되며 인간관계 기반 성과가 좋아집니다."
    },
    "reversed": {
      "general": "감정을 밀어두면 판단력이 흐려질 수 있습니다.",
      "love": "서운함이 누적되기 쉬워 먼저 감정 언어를 꺼내야 합니다.",
      "money": "정서 불안정으로 인한 충동 소비를 주의하세요.",
      "career": "팀 내 감정 마찰이 생산성을 떨어뜨릴 수 있습니다."
    }
  }
}
```

## Step 2) 스프레드 로직 구현

구현 위치: `server/services/tarot-engine.service.js`

- 중복 없는 추출: Fisher-Yates 셔플 후 앞에서 N장 슬라이스
- 정/역방향: 카드마다 `Math.random() < 0.5`로 50:50
- 지원 스프레드:
  - `one_card`
  - `three_card_past_present_future`
  - `three_card_cause_process_outcome`

## Step 3) 맞춤형 해석 알고리즘

입력:
- `category` (`general`, `love`, `money`, `career`)
- `drawnCards[]` (`cardId`, `orientation`, `position`)

처리:
1. 카테고리 정규화 (`normalizeCategory`)
2. 카드별 해석 텍스트 선택 (`selectInterpretation`)
3. 포지션 전이 문장(`과거/현재/미래` 또는 `원인/과정/결과`)과 결합
4. 스토리(`story`) + 최종 조언(`advice`) 생성

출력:
- 카드별 내러티브(`cardNarratives`)
- 통합 스토리(`story`)
- 결론형 조언(`advice`)

## Step 4) REST API 명세

라우트 파일: `server/routes/tarot.routes.js`

### 1) 엔진 메타
- `GET /api/tarot/meta`

Response:
```json
{
  "ok": true,
  "engine": {
    "deckSize": 78,
    "spreads": ["one_card", "three_card_past_present_future", "three_card_cause_process_outcome"],
    "categories": ["general", "love", "money", "career"]
  }
}
```

### 2) 카드 드로우
- `POST /api/tarot/draw`

Request:
```json
{
  "spreadType": "three_card_past_present_future"
}
```

Response (UI 렌더링용 카드 정보 분리):
```json
{
  "ok": true,
  "spreadType": "three_card_past_present_future",
  "cards": [
    {
      "position": "past",
      "orientation": "upright",
      "cardId": "M00",
      "name": "The Fool",
      "nameKr": "바보",
      "type": "Major",
      "suit": null,
      "rank": "0",
      "imageKey": "major-the-fool",
      "keywords": ["새로운 시작", "자유", "모험", "순수함"]
    }
  ]
}
```

### 3) 해석 생성
- `POST /api/tarot/reading`

Request:
```json
{
  "category": "love",
  "spreadType": "three_card_past_present_future",
  "cards": [
    { "cardId": "M00", "position": "past", "orientation": "upright" },
    { "cardId": "C01", "position": "present", "orientation": "reversed" },
    { "cardId": "P03", "position": "future", "orientation": "upright" }
  ]
}
```

Response (이미지/애니메이션 적용 쉽게 분리):
```json
{
  "ok": true,
  "category": "love",
  "spreadType": "three_card_past_present_future",
  "cards": [
    {
      "cardId": "M00",
      "name": "The Fool",
      "nameKr": "바보",
      "position": "past",
      "orientation": "upright",
      "imageKey": "major-the-fool",
      "keywords": ["새로운 시작", "자유", "모험", "순수함"]
    }
  ],
  "reading": {
    "story": "과거의 흐름에서는 ... 현재의 국면에서는 ... 다가올 전개에서는 ...",
    "advice": "질문 카테고리(love) 기준으로 보면 ...",
    "cardNarratives": [
      {
        "cardId": "M00",
        "position": "past",
        "interpretation": "관계에서 솔직함과 가벼운 용기가 흐름을 바꿉니다."
      }
    ]
  }
}
```

## 운영 메모

- 현재 샘플 DB는 구조 검증용이며, 실운영에서는 `server/data/tarot-cards.db.json`에 78장을 채워 넣으면 즉시 동작합니다.
- 카드 이미지는 `imageKey`를 프론트의 CDN/로컬 매핑 테이블과 연결해 렌더링하면 됩니다.
