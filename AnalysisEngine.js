// ============================================
// Face Analysis Engine (Vanilla JS 포팅 버전)
// AI 동물 관상 맞춤형 DB 포함 (15종) + 전문가 삼정 정밀 분석
// ============================================

class AnalysisEngine {
  constructor() {
    this.faceApiModelsLoaded = false; // face-api.js 모델 로드 완료 여부
    this.animalDb = {
      animals: [
    {
        id: 'dog',
        name: '강아지상',
        emoji: '🐶',
        celebrities: ['박보영', '송중기', '강다니엘', '아이유', '백현', '수지'],
        description: `<strong>[성격 및 특징]</strong><br>
            둥글고 선한 눈매, 쳐진 눈꼬리를 가져 누구에게나 호감을 주는 인상입니다. 친근하고 다정다감한 성격으로 대인관계가 원만하며, 감정 표현에 솔직하고 애교가 많아 주변에 사람이 끊이지 않는 전형적인 인싸형 관상입니다.<br><br>
            <strong>[연애 및 결혼]</strong><br>
            연애에 있어 헌신적이고 따뜻한 순애보 스타일입니다. 질투가 다소 있을 수 있으나 상대방에게 아낌없는 애정을 줍니다.<br><br>
            <strong>[진로 및 직업]</strong><br>
            뛰어난 공감 능력과 사교성을 바탕으로 서비스직, 교육, 상담, 연예, 대중의 인기를 먹고 사는 직업에서 크게 성공합니다.<br><br>
            <strong>[재물운]</strong><br>
            인복이 곧 재물로 이어지는 운세로, 주변 사람들의 도움과 신뢰를 통해 안정적으로 부를 축적합니다.
        `,
        key_features: { 'jaw_shape': 'round', 'eye_slant': 'downward', 'eye_distance': 'wide' }
    },
    {
        id: 'cat',
        name: '고양이상',
        emoji: '🐱',
        celebrities: ['제니', '한소희', '강동원', '이준기', '이종석', '해린'],
        description: `<strong>[성격 및 특징]</strong><br>
            살짝 올라간 눈꼬리와 선명한 눈빛이 쿨하고 도도한 매력을 발산합니다. 첫인상은 차갑고 까칠해 보일 수 있으나 내면은 정이 많고 친해지면 애교가 터지는 '츤데레' 스타일입니다. 독립심이 강하고 자기 주관이 매우 뚜렷합니다.<br><br>
            <strong>[연애 및 결혼]</strong><br>
            밀당의 고수이며 묘한 섹시함이 있어 이성에게 끊임없이 대시를 받습니다. 구속받는 것을 싫어하여 자유로운 연애를 선호합니다.<br><br>
            <strong>[진로 및 직업]</strong><br>
            패션, 뷰티, 디자인, 예술, 영업 등 자신의 철학과 개성을 마음껏 펼칠 수 있는 트렌디한 분야에서 두각을 나타냅니다.<br><br>
            <strong>[재물운]</strong><br>
            본인만의 능력 스탯으로 돈을 버는 자수성가형이 많으며, 재테크 감각이 예리하여 크게 손해 보지 않습니다.
        `,
        key_features: { 'jaw_shape': 'sharp', 'eye_slant': 'upward' }
    },
    {
        id: 'fox',
        name: '여우상',
        emoji: '🦊',
        celebrities: ['지코', '황민현', '육성재', '예지', '서인국'],
        description: `<strong>[성격 및 특징]</strong><br>
            가로로 길고 찢어진 눈매와 날렵한 턱선이 돋보입니다. 세련되고 도회적인 인상을 주며 두뇌 회전이 매우 빠르고 눈치가 넓어 어떤 환경에서도 완벽히 적응합니다. 분위기를 주도하는 매력적인 눈웃음이 강력한 무기입니다.<br><br>
            <strong>[연애 및 결혼]</strong><br>
            상대방의 마음을 단숨에 사로잡는 마성의 매력 소유자입니다. 섬세하고 센스있어 연애 상대에게 최고의 만족감을 주지만, 쉽게 질리기도 합니다.<br><br>
            <strong>[진로 및 직업]</strong><br>
            기획, 마케팅, 협상, 아이디어 사업이나 예술 분야, 말로 사람을 설득하는 세일즈에서 크게 기량을 발휘합니다.<br><br>
            <strong>[재물운]</strong><br>
            두뇌가 명석해 정보를 활용한 투자(주식, 부동산 등)에 능하며 재물 회전율이 높습니다.
        `,
        key_features: { 'eye_distance': 'narrow', 'eye_slant': 'upward', 'jaw_shape': 'sharp' }
    },
    {
        id: 'deer',
        name: '사슴상',
        emoji: '🦌',
        celebrities: ['윤아', '차은우', '최민호', '고아라', '설윤'],
        description: `<strong>[성격 및 특징]</strong><br>
            유난히 맑고 큰 눈망울과 다소 긴 목을 가지고 있어 우아하고 청초한 분위기를 자아냅니다. 선하고 평화로운 성품을 지녔으며 감수성이 매우 풍부합니다. 불의를 싫어하고 지조가 있는 선비 같은 내면을 지녔습니다.<br><br>
            <strong>[연애 및 결혼]</strong><br>
            보호본능을 자극해 이성에게 맹목적인 사랑을 받는 경우가 많습니다. 본인은 신중하게 사람을 골라 깊고 안정적인 관계를 추구합니다.<br><br>
            <strong>[진로 및 직업]</strong><br>
            학자, 연구원, 교육자, 순수 예술가, 공무원 등 안정적이고 깊이 있는 학구열을 요구하는 직업과 찰떡궁합입니다.<br><br>
            <strong>[재물운]</strong><br>
            일확천금보다는 안정적이고 꾸준한 재물의 흐름을 가지며, 명예가 높아짐에 따라 자연스레 부가 따라오는 운세입니다.
        `,
        key_features: { 'eye_distance': 'wide', 'nose_width': 'narrow', 'jaw_shape': 'sharp' }
    },
    {
        id: 'rabbit',
        name: '토끼상',
        emoji: '🐰',
        celebrities: ['나연', '도영', '정국', '수지', '바비'],
        description: `<strong>[성격 및 특징]</strong><br>
            동그랗고 맑은 눈매와 귀여운 앞니가 매력 포인트입니다. 하얗고 깨끗한 이미지를 가졌으며 긍정적이고 통통 튀는 에너지로 무장해 있습니다. 호기심이 많고 활동적이며 상상력이 뛰어납니다.<br><br>
            <strong>[연애 및 결혼]</strong><br>
            귀엽고 사랑스러운 매력으로 남녀노소 가리지 않고 인기가 많습니다. 활기차고 알콩달콩한 연애를 선호합니다.<br><br>
            <strong>[진로 및 직업]</strong><br>
            엔터테인먼트, 크리에이터, 방송, 예술, 혹은 창의적인 아이디어가 필요한 스타트업 환경에서 크게 성공합니다.<br><br>
            <strong>[재물운]</strong><br>
            다양한 활동 반경만큼 여러 루트에서 부를 창출해내며 특히 젊은 시절에 큰 부를 모으는 경향이 강합니다.
        `,
        key_features: { 'jaw_shape': 'round', 'nose_width': 'narrow' }
    },
    {
        id: 'bear',
        name: '곰상',
        emoji: '🐻',
        celebrities: ['마동석', '안재홍', '슬기', '조진웅', '고창석'],
        description: `<strong>[성격 및 특징]</strong><br>
            선이 굵거나 둥글고 듬직한 얼굴형으로 포근하고 푸근한 인상을 줍니다. 겉보기엔 무뚝뚝해 보이나 속은 매우 따뜻하고 인간미가 넘칩니다. 한 번 결심한 일은 끝까지 해내는 엄청난 끈기와 인내심의 소유자입니다.<br><br>
            <strong>[연애 및 결혼]</strong><br>
            화려한 로맨스보다는 가족 같고 편안한 장기 연애에 강하며, 결혼 상대로 매우 훌륭하고 듬직한 배우자가 됩니다.<br><br>
            <strong>[진로 및 직업]</strong><br>
            건축, 제조, 중공업, 공무원, 사업가 중심의 안정적인 직업군이나, 체력과 끈기가 필요한 요식업 분야에서 대성합니다.<br><br>
            <strong>[재물운]</strong><br>
            전형적인 대기만성형 재물운으로, 티끌 모아 태산을 이루듯 중년 이후부터 막대한 재력과 자산을 갖추게 됩니다.
        `,
        key_features: { 'jaw_shape': 'wide', 'nose_width': 'wide' }
    },
    {
        id: 'tiger',
        name: '호랑이상',
        emoji: '🐯',
        celebrities: ['뷔', '화사', '이정재', '김우빈', '세븐틴 호시'],
        description: `<strong>[성격 및 특징]</strong><br>
            뚜렷하고 굵은 T존과 깊고 강렬한 눈빛을 자랑하며, 존재만으로도 묵직한 카리스마와 압도적인 오라(Aura)를 내뿜습니다. 두려움이 없고 리더십이 뛰어나 무리의 우두머리가 되며 매사에 열정과 자신감이 넘칩니다.<br><br>
            <strong>[연애 및 결혼]</strong><br>
            솔직하고 화끈한 직진 연애를 좋아합니다. 주도권을 쥐는 것을 선호하며 내 사람에게는 한없이 너그러운 순정파입니다.<br><br>
            <strong>[진로 및 직업]</strong><br>
            기업의 CEO, 정치가, 고위 공직자, 혹은 독보적인 예체능계열 탑스타 등 어떤 조직에서도 중심 및 리더 역할을 맡아 성공합니다.<br><br>
            <strong>[재물운]</strong><br>
            스케일이 남달라 한 번의 큰 성과로 막대한 부를 쟁취하는 큰손의 운명입니다. 다만 지출도 크니 통제가 필요합니다.
        `,
        key_features: { 'jaw_shape': 'wide', 'eye_slant': 'upward', 'eye_distance': 'wide' }
    },
    {
        id: 'dinosaur',
        name: '공룡상',
        emoji: '🦖',
        celebrities: ['공유', '이민기', '황인엽', '탑', '김우빈'],
        description: `<strong>[성격 및 특징]</strong><br>
            윤곽과 골격이 강하게 도드라지며 큼직한 이목구비로 시원하고 남성적인(또는 걸크러시) 분위기가 납니다. 가만히 있으면 다소 무서워 보일 수 있으나 웃을 때 개구쟁이 같은 아이 얼굴이 나오는 엄청난 반전 매력이 있습니다.<br><br>
            <strong>[연애 및 결혼]</strong><br>
            반전 매력으로 이성을 강렬하게 끌어들이며, 한 번 빠지면 헤어나올 수 없게 만드는 나쁜 남자/나쁜 여자 스타일의 치명적 매력이 있습니다.<br><br>
            <strong>[진로 및 직업]</strong><br>
            연기자, 패션모델, 스포츠 선수 혹은 현장을 누비고 직접 부딪혀 결과를 내는 자영업이나 사업 쪽에서 뛰어난 두각을 보입니다.<br><br>
            <strong>[재물운]</strong><br>
            투자와 사업 확장에 기질이 있어 자수성가로 기반을 닦는 경우가 많으며 부동산이나 큰 규모의 자산운용에 강합니다.
        `,
        key_features: { 'jaw_shape': 'wide', 'nose_width': 'wide', 'eye_slant': 'upward' }
    },
    {
        id: 'snake',
        name: '뱀상',
        emoji: '🐍',
        celebrities: ['승리', '카리나', '청하', '이수혁', '현아'],
        description: `<strong>[성격 및 특징]</strong><br>
            V라인으로 떨어지는 예리한 턱선과 광대, 좌우로 길고 매서운 눈빛은 범접불가의 신비롭고 섹시한 분위기를 줍니다. 속을 알 수 없는 치명적인 매력을 가졌고, 예리한 분석력과 완벽주의적 성향으로 철저한 자기관리를 합니다.<br><br>
            <strong>[연애 및 결혼]</strong><br>
            이성을 향한 유혹의 기술이 타의 추종을 불허하며 한 번 엮이면 절대 벗어날 수 없는 마성의 매력입니다. 눈이 매우 높은 편입니다.<br><br>
            <strong>[진로 및 직업]</strong><br>
            감각적인 디자인, 예술, 연예계, 패션계는 물론 치밀한 계획이 필요한 법조계나 투자 분석가로 일해도 크게 뻗어나갈 수 있습니다.<br><br>
            <strong>[재물운]</strong><br>
            기회가 오면 절대 놓치지 않는 결단력이 있어 벼락부자가 되기도 하며, 돈을 관리하는 감각이 매우 뛰어납니다.
        `,
        key_features: { 'jaw_shape': 'sharp', 'eye_slant': 'upward', 'eye_distance': 'narrow' }
    },
    {
        id: 'wolf',
        name: '늑대상',
        emoji: '🐺',
        celebrities: ['주지훈', '우도환', '세훈', '황인엽'],
        description: `<strong>[성격 및 특징]</strong><br>
            차가운 인상에 앙칼지면서도 남성미가 철철 넘치는 예리하고 강렬한 사백안 계열의 눈매를 가졌습니다. 무리에 충성하는 늑대처럼 차가운 겉모습 속에는 내 사람을 위한 의리와 거친 야성미가 동시에 공존합니다.<br><br>
            <strong>[연애 및 결혼]</strong><br>
            한번 마음을 허락한 상대에게는 모든 것을 바치는 일편단심 지고지순한 사랑의 표본입니다.<br><br>
            <strong>[진로 및 직업]</strong><br>
            경찰, 군인, 운동선수 등 조직력이 강한 직단 혹은 끈질긴 추적과 집념이 요구되는 IT/기획 분야에 능합니다.<br><br>
            <strong>[재물운]</strong><br>
            도박이나 편법을 싫어하고 우직하게 스스로의 실력 하나로 부를 축적하며 노년이 될수록 안정적인 거부가 됩니다.
        `,
        key_features: { 'jaw_shape': 'sharp', 'nose_width': 'narrow', 'eye_slant': 'upward' }
    },
    {
        id: 'monkey',
        name: '원숭이상',
        emoji: '🐵',
        celebrities: ['딘딘', '오마이걸 유아', 'MC몽', '신동엽'],
        description: `<strong>[성격 및 특징]</strong><br>
            입체적인 이목구비와 장난기 가득한 인상이 특징입니다. 눈치가 매우 빠르고 잔머리가 잘 돌며 어떤 무리에서든 시선을 사로잡는 재간둥이입니다. 습득력이 뛰어나고 다재다능하여 일명 '팔방미인'이라는 소리를 자주 듣습니다.<br><br>
            <strong>[연애 및 결혼]</strong><br>
            지루할 틈이 없는 이벤트와 재치로 연인을 항상 즐겁게 해주는 낭만과 유머의 전도사입니다.<br><br>
            <strong>[진로 및 직업]</strong><br>
            임기응변이 뛰어난 예능인, 유튜버, 프로그래머, 언론인 및 서비스업 등 두뇌와 순발력을 쓰는 직업에 천부적입니다.<br><br>
            <strong>[재물운]</strong><br>
            다양한 재주 덕에 여기저기서 수익을 벌어들이는 N잡러의 기질을 보이며 평생 재물이 마르지 않습니다.
        `,
        key_features: { 'jaw_shape': 'round', 'eye_distance': 'narrow' }
    },
    {
        id: 'horse',
        name: '말상',
        emoji: '🐴',
        celebrities: ['이광수', '최시원', '박완규', '유열'],
        description: `<strong>[성격 및 특징]</strong><br>
            다소 길고 선이 분명한 얼굴형에 시원시원한 이목구비를 가졌습니다. 마치 달리는 명마처럼 성격이 활달하고 개방적이며 에너지가 넘칩니다. 답답한 것을 싫어하고 늘 새로운 도전을 역동적으로 갈망하는 행동파입니다.<br><br>
            <strong>[연애 및 결혼]</strong><br>
            열정적이고 쿨한 연애를 좋아하며 상대방과 여행이나 액티비티를 함께 즐기는 스포티한 커플형입니다.<br><br>
            <strong>[진로 및 직업]</strong><br>
            무역, 영업, 항공, 교통스튜어디스, 체육인 등 전 세계를 누비며 역동성을 요하는 필드워크에서 최고의 능력을 냅니다.<br><br>
            <strong>[재물운]</strong><br>
            활동 반경이 넓어 해외에서 큰 성공을 거두거나 움직인 만큼 돈이 쏟아져 들어오는 역마 재물운을 가졌습니다.
        `,
        key_features: { 'jaw_shape': 'wide', 'nose_width': 'narrow', 'eye_slant': 'downward' }
    },
    {
        id: 'pig',
        name: '돼지상',
        emoji: '🐷',
        celebrities: ['신동', '정형돈', '조세호'],
        description: `<strong>[성격 및 특징]</strong><br>
            얼굴형이 복스럽고 통통하며 입꼬리가 자연스레 올라가 유쾌하고 넉넉한 인상을 줍니다. 성품이 온화하고 관대하여 주변 사람을 참 편안하게 해주는 매력이 있습니다. 느긋해 보이지만 먹을 복이 평생 따라다니는 운명입니다.<br><br>
            <strong>[연애 및 결혼]</strong><br>
            연인에게 한없이 다정하고 헌신하며 편안한 안식처 같은 보금자리가 되어주는 최고의 남편/아내감입니다.<br><br>
            <strong>[진로 및 직업]</strong><br>
            요식업, 유통업, 자산운용, 은행원 등 식록(食祿)이나 큰 규모의 돈과 관련된 직업을 가지면 매우 대성합니다.<br><br>
            <strong>[재물운]</strong><br>
            관상학적으로 최고의 재물복인 '천금지복'을 타고난 수저로, 아무리 어려워도 굶어 죽을 일이 없으며 중년에 큰 복이 터집니다.
        `,
        key_features: { 'jaw_shape': 'round', 'nose_width': 'wide', 'eye_distance': 'wide' }
    },
    {
        id: 'eagle',
        name: '독수리상',
        emoji: '🦅',
        celebrities: ['신현준', '이적', '박명수'],
        description: `<strong>[성격 및 특징]</strong><br>
            크고 날카로운 코(매부리코 형태)와 예리한 눈빛이 특징으로 범접하기 힘든 아우라가 흐릅니다. 먼 곳을 내다보는 통찰력과 직관력이 엄청나게 뛰어나며, 기회를 포착하면 매섭게 낚아채는 매서운 승부사 기질의 소유자입니다.<br><br>
            <strong>[연애 및 결혼]</strong><br>
            이상형의 기준이 높고 한 번 내 사람이다 싶으면 맹렬하게 쟁취해내는 상남자/상여자 스타일입니다.<br><br>
            <strong>[진로 및 직업]</strong><br>
            검찰, 경찰, 감사, 재무, 투자가, 평론가 등 남들이 보지 못하는 문제점을 찾아내고 예리한 판단이 요구되는 직업이 잘 맞습니다.<br><br>
            <strong>[재물운]</strong><br>
            정확한 정보와 타이밍을 활용하여 막대한 부를 거머쥐는 사냥꾼형 부자의 운세를 타고났습니다.
        `,
        key_features: { 'jaw_shape': 'sharp', 'nose_width': 'narrow', 'eye_distance': 'narrow' }
    },
    {
        id: 'sparrow',
        name: '참새상',
        emoji: '🐦',
        celebrities: ['최예나', '연우', '은하'],
        description: `<strong>[성격 및 특징]</strong><br>
            오밀조밀하고 작고 뚜렷한 이목구비, 특히 앙증맞은 입술이 매력적인 귀염상입니다. 언제나 쉴 새 없이 재잘거리며 이야기하는 것을 좋아하고 밝고 명랑하여 주변에 긍정적인 바이러스를 심어주는 해피바이러스입니다.<br><br>
            <strong>[연애 및 결혼]</strong><br>
            특유의 귀여움과 사랑스러운 애교로 연인의 마음을 살살 녹이며 늘 화기애애하고 즐거운 연애를 즐깁니다.<br><br>
            <strong>[진로 및 직업]</strong><br>
            방송인, 아나운서, 크리에이터, 서비스, 보육교사 등 언변과 공감 능력이 뛰어난 사람을 상대하는 직종에서 능력을 인정받습니다.<br><br>
            <strong>[재물운]</strong><br>
            사소한 기회들을 모아 알뜰살뜰하게 재물을 모으는 타고난 재테크의 달인입니다.
        `,
        key_features: { 'jaw_shape': 'round', 'nose_width': 'narrow', 'eye_distance': 'narrow' }
      },
      {
          id: 'crocodile',
          name: '악어상',
          emoji: '🐊',
          celebrities: ['김우빈', '류준열', '김진표'],
          description: `<strong>[성격 및 특징]</strong><br>강한 하관과 가로로 긴 입매, 무표정일 때 느껴지는 서늘한 아우라가 특징입니다. 인내심이 매우 강하며 목표를 정하면 수단과 방법을 가리지 않고 성취해내는 냉철한 전략가 타입입니다.<br><br><strong>[연애 및 결혼]</strong><br>쉽게 마음을 열지 않지만, 내 사람이라고 판단되면 끝까지 책임지고 보호하는 묵직한 의리를 보여줍니다.<br><br><strong>[진로 및 직업]</strong><br>정치, 금융, 대규모 프로젝트 관리, 전문 수사관 등 고도의 집중력과 압박감을 견뎌야 하는 분야에서 정점에 올라섭니다.<br><br><strong>[재물운]</strong><br>기회를 포착하는 감각이 탁월하며, 한 번 잡은 기회를 막대한 수익으로 전환하는 자본가적 기질이 강합니다.`,
          key_features: { 'jaw_shape': 'wide', 'eye_slant': 'neutral', 'nose_width': 'wide' }
      },
      {
          id: 'lynx',
          name: '시라소니상',
          emoji: '🐆',
          celebrities: ['현진(Stray Kids)', '예지(ITZY)', '지민(BTS)', '이재명'],
          description: `<strong>[성격 및 특징]</strong><br>고양이보다 날카롭고 표범보다 기민해 보이는 눈매가 특징입니다. 독립심이 극도로 강하며 타인의 간섭을 싫어하는 고고한 기질을 가졌습니다. 감각이 예민하고 직관력이 뛰어나 창의적인 발상을 자주 합니다.<br><br><strong>[연애 및 결혼]</strong><br>구속받는 것을 극도로 싫어하며, 서로의 사생활을 존중해주는 쿨하고 세련된 연애를 지향합니다.<br><br><strong>[진로 및 직업]</strong><br>예술가, 패션 디자이너, 프리랜서 전문가, 전문 기술직 등 자신만의 독보적인 영역을 구축할 수 있는 직업에서 성공합니다.<br><br><strong>[재물운]</strong><br>큰 조직에 의존하기보다 자신의 전문성을 바탕으로 수익을 창출하며, 자산의 독립성을 중요하게 여깁니다.`,
          key_features: { 'jaw_shape': 'sharp', 'eye_slant': 'upward', 'eye_distance': 'narrow' }
      },
      {
          id: 'lion',
          name: '사자상',
          emoji: '🦁',
          celebrities: ['최민식', '강호동', '고현정'],
          description: `<strong>[성격 및 특징]</strong><br>넓고 시원한 이마와 큼직한 이목구비, 전체적으로 중후하고 위엄 있는 골격을 가졌습니다. 타고난 지도자적 기질로 대중을 압도하는 카리스마를 발휘하며, 명예를 목숨처럼 소중히 여깁니다.<br><br><strong>[연애 및 결혼]</strong><br>배우자에게 든든한 버팀목이 되어주며, 가정을 지키려는 책임감이 매우 강한 가부장적/모성적 리더 스타일입니다.<br><br><strong>[진로 및 직업]</strong><br>고위 경영자, 정치 리더, 대형 조직의 장, 문화/예술계의 거장 등 권위와 명성이 따르는 자리에 적합합니다.<br><br><strong>[재물운]</strong><br>자신의 직위와 명예가 높아짐에 따라 막대한 재물이 자연스럽게 따라오는 명예 우선형 재물운입니다.`,
          key_features: { 'jaw_shape': 'wide', 'nose_width': 'wide', 'mouth_size': 'large' }
      },
      {
          id: 'hamster',
          name: '햄스터상',
          emoji: '🐹',
          celebrities: ['호시(세븐틴)', '문별(마마무)', '정연(트와이스)', '민경훈'],
          description: `<strong>[성격 및 특징]</strong><br>통통한 볼살과 동그랗고 맑은 눈, 귀여운 입매를 가졌습니다. 에너지가 넘치고 부지런하며, 주변 사람들에게 즐거움을 주는 분위기 메이커입니다. 작아 보이지만 실속이 매우 알찬 타입입니다.<br><br><strong>[연애 및 결혼]</strong><br>보호본능을 자극하며 연인에게 끊임없는 귀여움과 활력을 제공합니다. 안정적이고 소소한 행복을 추구합니다.<br><br><strong>[진로 및 직업]</strong><br>크리에이터, 마케팅, 서비스 기획, 아동 교육 등 친근함과 창의성이 필요한 분야에서 두각을 나타냅니다.<br><br><strong>[재물운]</strong><br>돈을 모으는 재미를 아는 타입으로, 소액 저축부터 시작해 차곡차곡 자산을 불려 나가는 실속파 부자운입니다.`,
          key_features: { 'jaw_shape': 'round', 'eye_distance': 'wide', 'nose_width': 'narrow' }
      },
      {
          id: 'otter',
          name: '수달상',
          emoji: '🦦',
          celebrities: ['영재(GOT7)', '셔누(몬스타엑스)', '강민경'],
          description: `<strong>[성격 및 특징]</strong><br>부드러운 얼굴 선과 매끈한 피부, 친근한 미소가 특징입니다. 사교성이 매우 뛰어나 적이 없으며, 손재주나 감각이 영특하여 어떤 일이든 빠르게 습득하는 재주꾼입니다.<br><br><strong>[연애 및 결혼]</strong><br>연인과 친구처럼 편안하게 지내는 스타일이며, 다정다감하고 세심한 배려로 관계를 건강하게 유지합니다.<br><br><strong>[진로 및 직업]</strong><br>엔지니어링, 요리사, 수공예, 방송 기술 등 정교한 기술이나 감각적인 숙련도를 요하는 직업에서 대성합니다.<br><br><strong>[재물운]</strong><br>자신의 기술력과 재능이 곧 돈이 되는 구조이며, 인적 네트워크를 통해 유익한 경제 정보를 얻는 운세입니다.`,
          key_features: { 'jaw_shape': 'round', 'eye_slant': 'neutral', 'nose_width': 'narrow' }
      },
      {
          id: 'alpaca',
          name: '알파카상',
          emoji: '🦙',
          celebrities: ['진(BTS)', '임영웅', '임시완'],
          description: `<strong>[성격 및 특징]</strong><br>다소 긴 하관과 순한 눈망울, 깨끗한 인상이 돋보입니다. 성품이 온화하고 차분하며, 예의 바른 태도로 주변의 신망이 두텁습니다. 보기보다 고집이 있고 자기 신념이 확고한 외유내강형입니다.<br><br><strong>[연애 및 결혼]</strong><br>한결같은 마음으로 상대방을 대하며, 갈등을 대화로 해결하려는 평화주의적 연애 스타일입니다.<br><br><strong>[진로 및 직업]</strong><br>외교관, 상담사, 큐레이터, 화이트칼라 전문직 등 정돈된 환경에서 지적 능력을 발휘하는 직업이 최적입니다.<br><br><strong>[재물운]</strong><br>성실함을 바탕으로 한 정직한 수익을 선호하며, 장기적인 안목으로 안정적인 자산을 구축하는 운입니다.`,
          key_features: { 'jaw_shape': 'sharp', 'eye_distance': 'wide', 'nose_width': 'narrow' }
      },
      {
          id: 'koala',
          name: '코알라상',
          emoji: '🐨',
          celebrities: ['RM(BTS)', '최우식'],
          description: `<strong>[성격 및 특징]</strong><br>둥근 콧날과 살짝 처진 눈매, 여유로운 표정이 특징입니다. 매사에 서두르지 않는 침착함을 지녔으며, 본인만의 명확한 휴식과 일의 경계가 있습니다. 사색을 즐기는 지성미를 풍깁니다.<br><br><strong>[연애 및 결혼]</strong><br>포근하고 안정감 있는 연애를 선호하며, 상대방의 이야기를 잘 들어주는 훌륭한 리스너가 되어줍니다.<br><br><strong>[진로 및 직업]</strong><br>작가, 철학자, 연구원, 심리 치료사 등 깊은 사고와 분석이 필요한 학문적 영역에서 성과를 냅니다.<br><br><strong>[재물운]</strong><br>불필요한 지출을 싫어하는 검소한 생활 습관을 지녔으며, 노후 준비가 철저한 안정 지향적 재물운입니다.`,
          key_features: { 'jaw_shape': 'round', 'eye_slant': 'downward', 'nose_width': 'wide' }
      },
      {
          id: 'leopard',
          name: '표범상',
          emoji: '🐆',
          celebrities: ['원우(세븐틴)', '소연((여자)아이들)'],
          description: `<strong>[성격 및 특징]</strong><br>날렵한 턱선과 눈꼬리가 살짝 올라간 인상으로 카리스마와 세련미가 공존합니다. 주관이 뚜렷하고 자신감이 넘치며 어떤 상황에서도 굴하지 않는 당당함이 매력적인 관상입니다.<br><br><strong>[연애 및 결혼]</strong><br>연애에 있어서도 주도적이며, 쿨하고 열정적인 연애를 선호합니다. 상대방을 이끄는 강인한 리더십이 있습니다.<br><br><strong>[진로 및 직업]</strong><br>엔터테인먼트, 패션, 리더십을 발휘하는 관리직, 혹은 트렌드를 선도하는 마케터 등에 탁월한 재능이 있습니다.<br><br><strong>[재물운]</strong><br>기회를 놓치지 않는 결단력이 있어 큰 수익을 거두는 편이며, 투자와 사업 영역에서도 크게 성공하는 운입니다.`,
          key_features: { 'jaw_shape': 'sharp', 'eye_slant': 'upward', 'eye_distance': 'wide' }
      },
      {
          id: 'giraffe',
          name: '기린상',
          emoji: '🦒',
          celebrities: ['이광수', '첸(EXO)'],
          description: `<strong>[성격 및 특징]</strong><br>다소 긴 얼굴형과 맑은 눈이 지적이고 우아한 느낌을 줍니다. 성품이 온화하고 평화주의적이며, 눈앞의 이익보다는 멀리 내다보는 혜안과 뛰어난 통찰력을 지녔습니다.<br><br><strong>[연애 및 결혼]</strong><br>안정적이고 배려심 깊은 연애를 선호합니다. 다툼을 싫어하여 상대방을 포용할 줄 아는 성숙한 사랑을 합니다.<br><br><strong>[진로 및 직업]</strong><br>학자, 연구원, 기획자, 컨설턴트 등 장기적 안목과 지적 능력이 요구되는 전략 분야에서 빛을 발합니다.<br><br><strong>[재물운]</strong><br>일확천금보다는 차곡차곡 쌓아올리는 안정적인 재물운을 지녔으며, 장기적인 가치 투자에서 승리하는 타입입니다.`,
          key_features: { 'jaw_shape': 'sharp', 'eye_distance': 'wide', 'nose_width': 'narrow' }
      },
      {
          id: 'frog',
          name: '개구리상',
          emoji: '🐸',
          celebrities: ['김민희', '하연수'],
          description: `<strong>[성격 및 특징]</strong><br>미간이 다소 넓은 큰 눈과 시원시원하고 넓은 입매로 톡톡 튀는 존재감과 개성이 매력적입니다. 매사에 활발하고 유쾌하며 주변에 언제나 웃음을 전해주는 긍정 에너지의 소유자입니다.<br><br><strong>[연애 및 결혼]</strong><br>친구처럼 편안하고 즐거운 연애를 추구하며, 상대방에게 지루할 틈을 주지 않는 유머 감각이 있습니다.<br><br><strong>[진로 및 직업]</strong><br>방송인, 크리에이터, 영업직, 홍보 등 톡톡 튀는 매력과 뛰어난 언변을 적극적으로 활용하는 직업이 좋습니다.<br><br><strong>[재물운]</strong><br>자신의 넓은 대인 관계와 뛰어난 친화력을 무기로 다양한 인맥을 통해 뜻밖의 재물과 행운을 얻습니다.`,
          key_features: { 'jaw_shape': 'round', 'eye_distance': 'wide', 'mouth_size': 'large' }
      },
      {
          id: 'camel',
          name: '낙타상',
          emoji: '🐫',
          celebrities: ['안영미', '이적'],
          description: `<strong>[성격 및 특징]</strong><br>이국적이고 깊게 패인 눈매와 다소 긴 콧대를 가졌습니다. 어떠한 고난에도 굴하지 않는 인내심과 끈기를 지녔으며, 주변 환경에 흔들림 없이 묵묵히 자신의 길을 개척하는 스타일입니다.<br><br><strong>[연애 및 결혼]</strong><br>한 번 맺은 인연을 매우 소중히 여기며, 오랜 시간 동안 변치 않는 사랑을 유지하는 진정성 있는 순애보입니다.<br><br><strong>[진로 및 직업]</strong><br>무역, 해외 비즈니스, 중장기 프로젝트 관리자, 탐험가 등 고도의 지구력과 스케일이 큰 업무에 적합합니다.<br><br><strong>[재물운]</strong><br>초기에는 고생이 따를 수 있으나 끈기로 이를 극복하며, 말년으로 갈수록 큰 부를 축적하는 대기만성형 부자 관상입니다.`,
          key_features: { 'nose_width': 'wide', 'jaw_shape': 'sharp', 'eye_slant': 'neutral' }
      },
      {
          id: 'turtle',
          name: '거북이상',
          emoji: '🐢',
          celebrities: ['하연수', '솔라(마마무)'],
          description: `<strong>[성격 및 특징]</strong><br>둥글고 부드러운 얼굴형에 가로로 넓게 퍼지는 환하고 온화한 미소가 가장 큰 매력입니다. 신중하고 차분하며 어떤 위기 상황에서도 쉽게 흔들리지 않는 굳건함을 지녀 타인에게 깊은 신뢰를 줍니다.<br><br><strong>[연애 및 결혼]</strong><br>마음을 열기까지 느리지만 매우 확실하게 키워가는 편이며, 믿음직하고 따뜻한 가정을 꾸리는 데 탁월합니다.<br><br><strong>[진로 및 직업]</strong><br>교육자, 공무원, 법조인, 재무 상담가 등 신뢰감과 성실함이 그 어떤 능력보다 중요하게 여겨지는 직업에서 존경받습니다.<br><br><strong>[재물운]</strong><br>위험한 투기보다는 꾸준한 저축과 안전 자산을 선호하며, 시간이 흐를수록 흔들리지 않는 탄탄한 재산을 굳힙니다.`,
          key_features: { 'jaw_shape': 'round', 'eye_slant': 'neutral', 'mouth_size': 'large' }
      }


]
    };
  }

  async loadDatabase() {
    return Promise.resolve();
  }

  calculateDistance(p1, p2) {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const dz = p1.z - p2.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }

  calculateAngle(p1, p2) {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
  }

  extractGeometricFeatures(landmarks) {
    const LEFT_EYE_OUT = landmarks[226];
    const LEFT_EYE_IN = landmarks[133];
    const LEFT_EYE_TOP = landmarks[159];
    const LEFT_EYE_BOTTOM = landmarks[145];
    const RIGHT_EYE_IN = landmarks[362];
    const RIGHT_EYE_OUT = landmarks[446];
    
    // 오관(五官)과 삼정(三停)을 구성하는 우주의 좌표점
    const NOSE_LEFT = landmarks[129];
    const NOSE_RIGHT = landmarks[358];
    const NOSE_TIP = landmarks[2];
    const GLABELLA = landmarks[168]; 
    const CHIN = landmarks[152];
    const JAW_LEFT = landmarks[149];
    const JAW_RIGHT = landmarks[378];
    const FOREHEAD = landmarks[10];
    const MOUTH_LEFT = landmarks[61];
    const MOUTH_RIGHT = landmarks[291];
    const MOUTH_TOP = landmarks[13];
    const MOUTH_BOTTOM = landmarks[14];
    const EAR_LEFT_TOP = landmarks[127];
    const EAR_LEFT_BOTTOM = landmarks[132];

    const faceLength = this.calculateDistance(FOREHEAD, CHIN);
    const faceWidth = this.calculateDistance(JAW_LEFT, JAW_RIGHT);

    const eyeWidth = this.calculateDistance(LEFT_EYE_IN, LEFT_EYE_OUT);
    const eyeHeight = this.calculateDistance(LEFT_EYE_TOP, LEFT_EYE_BOTTOM);
    const eyeRatio = eyeWidth / (eyeHeight || 1); 
    
    // 눈꼬리의 기울기 역학 (관상학적 음양의 균형을 수치화)
    // OUT.y가 작을수록(위로 올라갈수록) 기울기 상승. 직관성을 위해 * 100을 곱해 -10 ~ +10의 임계 스케일로 맞춤
    const leftSlant = (LEFT_EYE_OUT.y - LEFT_EYE_IN.y) * 100;
    const rightSlant = (RIGHT_EYE_OUT.y - RIGHT_EYE_IN.y) * 100;
    // 음수면 꼬리가 위로 솟구친 형상(음의 기운/호랑이·고양이상), 양수면 아래로 처진 형상(양의 기운/강아지·사슴상)
    const eyeSlantAngle = (leftSlant + rightSlant) / 2;

    // 미간(눈 사이)의 거리 계산 (관상학적 인당의 넓이)
    const interEyeDistance = this.calculateDistance(LEFT_EYE_IN, RIGHT_EYE_IN);
    const eyeDistRatio = interEyeDistance / (eyeWidth || 1);

    const noseWidth = this.calculateDistance(NOSE_LEFT, NOSE_RIGHT);
    const noseLength = this.calculateDistance(GLABELLA, NOSE_TIP);
    const noseRatio = noseLength / (noseWidth || 1); 
    const noseWidthRatio = noseWidth / (interEyeDistance || 1);
    const noseZ = Math.abs((NOSE_TIP.z || 0) - (JAW_LEFT.z || 0));

    const mouthWidth = this.calculateDistance(MOUTH_LEFT, MOUTH_RIGHT);
    const mouthCenterY = (MOUTH_TOP.y + MOUTH_BOTTOM.y) / 2;
    const mouthCornerY = (MOUTH_LEFT.y + MOUTH_RIGHT.y) / 2;
    // 앙월구(초승달) vs 복선구 (입꼬리의 고조를 결정짓는 운명의 곡선)
    const mouthCurve = mouthCenterY - mouthCornerY; 

    const earHeight = this.calculateDistance(EAR_LEFT_TOP, EAR_LEFT_BOTTOM);

    const upper_len = this.calculateDistance(FOREHEAD, GLABELLA);
    const middle_len = this.calculateDistance(GLABELLA, NOSE_TIP);
    const lower_len = this.calculateDistance(NOSE_TIP, CHIN);
    const total_samjung = upper_len + middle_len + lower_len;

    return {
      faceRatio: faceWidth / (faceLength||1), // 0.72(Sharp) ~ 0.88(Wide)
      eyeRatio: eyeRatio, 
      eyeSlant: eyeSlantAngle, // -5(Upward) ~ +5(Downward)
      eyeDistRatio: eyeDistRatio, // 0.8(Narrow) ~ 1.2(Wide)
      noseRatio: noseRatio,
      noseWidthRatio: noseWidthRatio, // 0.7(Narrow) ~ 1.0(Wide)
      noseZ: noseZ,
      mouthCurve: mouthCurve,
      mouthRatio: mouthWidth / (noseWidth||1), // 1.1(Small) ~ 1.6(Large)
      earRatio: earHeight / (faceLength||1),
      earPosition: EAR_LEFT_TOP.y < LEFT_EYE_OUT.y ? "high" : "normal",
      samjung: {
        upper: upper_len / total_samjung,
        middle: middle_len / total_samjung,
        lower: lower_len / total_samjung
      }
    };
  }

      // ============================================
    //  영혼의 그림자 (Karma Shadow) 비술 계산
    // ============================================
    calculateKarmaShadow(landmarks) {
      // 1. 재물 누수의 상 (노공/露孔)
      // 코끝(NOSE_TIP: 2)과 콧볼 하단(NOSE_BOTTOM: 164) 비교. 정면에서 기운이 새어나갈 각도 (들창코)
      const NOSE_TIP = landmarks[2];
      const NOSE_BOTTOM = landmarks[164];
      const NOSE_LEFT = landmarks[129];
      const NOSE_RIGHT = landmarks[358];
      const noseWidth = this.calculateDistance(NOSE_LEFT, NOSE_RIGHT);
      // 코끝이 위로 들릴수록(y값이 작을수록) 코 평수 대비 들린 비율 증가
      const upturnedRatio = (NOSE_BOTTOM.y - NOSE_TIP.y) / (noseWidth || 1);
      let karmaNose = 0;
      if (upturnedRatio > 0.05) {
        // 이차 함수(차이의 제곱)를 활용해 기하급수적 페널티 부여 (재물 흩어짐 지수)
        karmaNose = Math.min(100, Math.pow((upturnedRatio - 0.05) * 150, 2));
      }

      // 2. 파멸과 투쟁의 상 (사백안/하백안)
      // 눈의 세로 폭이 가로에 비해 비정상적으로 크면 흰자위가 흉하게 드러남
      const LEFT_EYE_IN = landmarks[133];
      const LEFT_EYE_OUT = landmarks[226];
      const LEFT_EYE_TOP = landmarks[159];
      const LEFT_EYE_BOTTOM = landmarks[145];
      const eyeWidth = this.calculateDistance(LEFT_EYE_IN, LEFT_EYE_OUT);
      const eyeHeight = this.calculateDistance(LEFT_EYE_TOP, LEFT_EYE_BOTTOM);
      const eyeOpenness = eyeHeight / (eyeWidth || 1);
      let karmaEye = 0;
      if (eyeOpenness > 0.45) {
        // 백안이 드러나는 살기. 파란만장 지수 폭발
        karmaEye = Math.min(100, Math.pow((eyeOpenness - 0.45) * 45, 2));
      }

      // 3. 고독과 쇠퇴의 상 (극단적 복선구)
      // 입꼬리가 배가 뒤집힌 듯 깊게 쳐진 닫힌 입매
      const MOUTH_LEFT = landmarks[61];
      const MOUTH_RIGHT = landmarks[291];
      const MOUTH_TOP = landmarks[13];
      const MOUTH_BOTTOM = landmarks[14];
      const mouthCenterY = (MOUTH_TOP.y + MOUTH_BOTTOM.y) / 2;
      const mouthCornerY = (MOUTH_LEFT.y + MOUTH_RIGHT.y) / 2;
      const mouthCurve = mouthCenterY - mouthCornerY; // 음수(-) 일수록 깊게 쳐짐
      const lipThickness = this.calculateDistance(MOUTH_TOP, MOUTH_BOTTOM);
      const mouthWidth = this.calculateDistance(MOUTH_LEFT, MOUTH_RIGHT);
      const lipRatio = lipThickness / (mouthWidth || 1);
      let karmaMouth = 0;
      if (mouthCurve < 0) { // 쳐진 입매
        const curvePenalty = Math.pow(Math.abs(mouthCurve) * 200, 2); // 가파를수록 강력
        const thinPenalty = lipRatio < 0.15 ? Math.pow((0.15 - lipRatio) * 100, 2) : 0; // 얇은 입술
        karmaMouth = Math.min(100, curvePenalty + thinPenalty);
      }

      // 4. 편협과 막힘의 상 (명궁 협소)
      // 두 눈썹 사이 거리가 눈의 폭에 비해 억눌려 있음
      const RIGHT_EYE_IN = landmarks[362];
      const interEyeDist = this.calculateDistance(LEFT_EYE_IN, RIGHT_EYE_IN);
      const glabellaRatio = interEyeDist / (eyeWidth || 1);
      let karmaGlabella = 0;
      if (glabellaRatio < 1.0) { // 명궁이 좁음
        // 영적인 통로가 닫힌 고난 지수
        karmaGlabella = Math.min(100, Math.pow((1.0 - glabellaRatio) * 40, 2));
      }

      // 5. 말년 고독의 상 (빈약한 하관과 깎인 턱)
      // 턱선의 각도가 가파르고(삼각함수 y/x) 빈약하게 뒤로 밀림(z축 비율)
      const CHIN = landmarks[152];
      const JAW_LEFT = landmarks[149];
      const JAW_RIGHT = landmarks[378];
      const jawDropY = CHIN.y - JAW_LEFT.y;
      const jawStepX = Math.abs(CHIN.x - JAW_LEFT.x);
      const jawAngle = Math.atan2(jawDropY, jawStepX) * (180 / Math.PI); // 가파른 각도
      let karmaJaw = 0;
      if (jawAngle > 45) { // 하관 피라미드각이 예리하고 가파를 때
        karmaJaw = Math.min(100, Math.pow((jawAngle - 45) * 1.5, 2)); // 지지 기반 붕괴 지수
      }

      //  전체 업보(Karma Shadow Score) 집대성 (0~100)
      const totalKarma = Math.min(100, (karmaNose + karmaEye + karmaMouth + karmaGlabella + karmaJaw) / 5);

      // 운명 개운법 (심상 처방)
      let karmaAdvice = "부모가 물려준 음덕(陰德)이 훌륭하여 얼굴에 머무는 탁한 그림자가 거의 없습니다. 지금의 온화한 마음(心相)을 잃지 말고 베푸는 삶을 영위하십시오.";
      if (totalKarma >= 15 && totalKarma < 40) {
        karmaAdvice = "삶의 작은 풍파가 얼굴의 굴곡으로 서서히 흔적을 남기고 있습니다. 매사 너그러운 마음(寬心)과 유연한 태도로 얽힌 기운을 풀어낸다면 흉은 길로 바뀔 것입니다.";
      } else if (totalKarma >= 40) {
        karmaAdvice = "오만의 뿔과 투쟁의 그림자가 관상에 깊게 드리워 노년의 쇠퇴(고독, 재물 흩어짐)가 예견됩니다. 허나 <b>관상은 심상을 이기지 못하는 법(相不如心)</b>. 매일 거울 앞에서 하심(下心)하고 감사의 미소(笑門萬福來)를 연습한다면 운명의 거대한 중력장조차 끊어낼 수 있을 것입니다.";
      }

      return {
        score: totalKarma.toFixed(1),
        nose: karmaNose.toFixed(1),
        eye: karmaEye.toFixed(1),
        mouth: karmaMouth.toFixed(1),
        glabella: karmaGlabella.toFixed(1),
        jaw: karmaJaw.toFixed(1),
        advice: karmaAdvice
      };
    }

  // ─────────────────────────────────────────────
  // face-api.js 모델 로드 (CDN 기반, 최초 1회)
  // ─────────────────────────────────────────────
  async loadFaceApiModels() {
    if (this.faceApiModelsLoaded) return;
    try {
      // face-api.js 스크립트 동적 로드
      if (!window.faceapi) {
        await new Promise((resolve, reject) => {
          const s = document.createElement('script');
          s.src = 'https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js';
          s.onload = resolve;
          s.onerror = reject;
          document.head.appendChild(s);
        });
      }
      const MODEL_URL = 'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights';
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL)
      ]);
      this.faceApiModelsLoaded = true;
      
    } catch(e) {
      console.warn('[AnalysisEngine] face-api.js 로드 실패 (표정 분석 비활성화):', e);
    }
  }

  // ─────────────────────────────────────────────
  // face-api.js 표정 감지 (이미지 또는 비디오 엘리먼트)
  // 반환: { happy, sad, angry, fearful, disgusted, surprised, neutral } (합계 ≈ 1)
  // ─────────────────────────────────────────────
  async detectExpressions(mediaEl) {
    if (!this.faceApiModelsLoaded || !window.faceapi) return null;
    try {
      const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.3 });
      const detection = await faceapi
        .detectSingleFace(mediaEl, options)
        .withFaceExpressions();
      if (!detection) return null;
      return detection.expressions; // faceapi.FaceExpressions 객체
    } catch(e) {
      console.warn('[AnalysisEngine] 표정 감지 실패:', e);
      return null;
    }
  }

async analyze(landmarksData, expressionData) {
    const features = this.extractGeometricFeatures(landmarksData);
    
          // --- 6차원 유클리디안-중력장 거리 연산 (절대 좌표 매핑 복원 & 스케일 최적화) ---
      // 각 동물상 대표 연예인의 골격 주파수를 6차원(턱선,눈매각도,미간,코너비,입크기,눈비율)으로 완전 타겟팅
      const archetypes = {
          // [개상] 이동욱, 박보검 - 둥글고 온화한 얼굴, 아래로 처진 눈매
          'dog': { face: 0.85, slant: 4.5, dist: 1.12, nose: 0.90, mouth: 1.28, eye: 2.5 },
          // [고양이상] 제니, 한소희 - 약간 둥근 얼굴, 강하게 올라간 눈매, 넓은 미간
          'cat': { face: 0.83, slant: -5.5, dist: 1.12, nose: 0.84, mouth: 1.30, eye: 2.6 },
          // [여우상] 지코, 김재원 - 갸름한 얼굴, 매우 찢어진 눈매, 좁은 미간
          'fox': { face: 0.76, slant: -6.5, dist: 0.93, nose: 0.86, mouth: 1.38, eye: 3.2 },
          // [사슴상] 아이유, 박신혜 - 길쭉한 얼굴, 순한 눈매, 작은 코
          'deer': { face: 0.76, slant: 1.0, dist: 1.02, nose: 0.80, mouth: 1.18, eye: 2.3 },
          // [토끼상] 수지, 임수정 - 둥그스름하고 통통, 처진듯 순한 눈매
          'rabbit': { face: 0.84, slant: 1.5, dist: 1.08, nose: 0.87, mouth: 1.28, eye: 2.4 },
          // [곰상] 이광수, 조정석 - 넓고 큰 얼굴, 평온한 눈매, 두꺼운 코
          'bear': { face: 0.90, slant: 0.5, dist: 1.18, nose: 1.10, mouth: 1.38, eye: 3.0 },
          // [호랑이상] 이병헌, 공유 - 넓고 다부진 얼굴, 강하게 내리뜨는 눈매
          'tiger': { face: 0.87, slant: -3.5, dist: 1.08, nose: 1.02, mouth: 1.52, eye: 2.7 },
          // [공룡상] 강호동, 이경규 - 강한 얼굴 넓이, 입이 매우 큼
          'dinosaur': { face: 0.75, slant: -1.0, dist: 1.18, nose: 1.05, mouth: 1.60, eye: 2.8 },
          // [뱀상] 승리, 카리나, 청하 - 적당히 긴 얼굴, 살짝 찢어진 눈매, 큰 입
          'snake': { face: 0.79, slant: -3.5, dist: 1.05, nose: 0.86, mouth: 1.48, eye: 3.0 },
          // [늑대상] 송중기, 남주혁 - 길쭉한 얼굴, 강하게 찢어진 눈매, 좁은 미간
          'wolf': { face: 0.79, slant: -4.5, dist: 0.97, nose: 0.92, mouth: 1.45, eye: 3.1 },
          // [원숭이상] 이특, 오나라 - 넓고 쳐지는 광대, 평평한 눈매, 큰 코
          'monkey': { face: 0.83, slant: 0.0, dist: 0.93, nose: 1.02, mouth: 1.42, eye: 2.5 },
          // [말상] 신동엽 - 세로로 매우 긴 얼굴
          'horse': { face: 0.65, slant: -0.5, dist: 1.05, nose: 0.90, mouth: 1.50, eye: 2.8 },
          // [돼지상] 뚱뚱한 둥근얼굴, 가장 넓은 코, 통통한
          'pig': { face: 0.93, slant: 1.0, dist: 1.22, nose: 1.18, mouth: 1.35, eye: 3.0 },
          // [독수리상] 카리스마 있고 날카로운 코, 좁은 미간
          'eagle': { face: 0.76, slant: -3.0, dist: 0.88, nose: 0.98, mouth: 1.22, eye: 2.9 },
          // [참새상] 작고 통통하고 귀여운 얼굴, 처진 눈매
          'sparrow': { face: 0.82, slant: 2.5, dist: 1.05, nose: 0.80, mouth: 1.08, eye: 2.3 },
          // [악어상] 윤석열 등 - 세로로 긴 얼굴, 매우 넓은 턱·입, 두꺼운 하관
          'crocodile': { face: 0.88, slant: -1.5, dist: 1.28, nose: 1.08, mouth: 1.68, eye: 3.2 },
          // [스라소니상] 강렬한 눈매와 조각 같은 얼굴
          'lynx': { face: 0.79, slant: -5.5, dist: 1.00, nose: 0.88, mouth: 1.35, eye: 2.9 },
          // [사자상] 넓고 위엄있는 얼굴, 두꺼운 코·입
          'lion': { face: 0.88, slant: -1.8, dist: 1.05, nose: 1.10, mouth: 1.58, eye: 2.6 },
          // [햄스터상] 볼살 통통하고 귀여운 얼굴
          'hamster': { face: 0.88, slant: 1.5, dist: 1.12, nose: 0.86, mouth: 1.15, eye: 2.4 },
          // [수달상] 강다니엘 - 통통하고 친근한 얼굴
          'otter': { face: 0.86, slant: -0.5, dist: 1.16, nose: 0.93, mouth: 1.40, eye: 2.6 },
          // [알파카상] 길고 독특한 얼굴형
          'alpaca': { face: 0.70, slant: 2.0, dist: 1.15, nose: 0.90, mouth: 1.22, eye: 2.5 },
          // [코알라상] 넓고 귀여운 코, 통통한 볼
          'koala': { face: 0.87, slant: 1.5, dist: 1.22, nose: 1.14, mouth: 1.28, eye: 2.6 },
          // [레오파드상] 표범처럼 날렵하고 섹시한 얼굴, 고양이상과 여우상의 중간
          'leopard': { face: 0.80, slant: -4.5, dist: 1.04, nose: 0.88, mouth: 1.45, eye: 2.8 },
          // [기린상] 매우 길쭉한 얼굴
          'giraffe': { face: 0.62, slant: 0.0, dist: 1.10, nose: 0.95, mouth: 1.32, eye: 2.4 },
          // [개구리상] 가장 넓은 얼굴, 매우 넓은 미간
          'frog': { face: 0.90, slant: 0.0, dist: 1.32, nose: 0.97, mouth: 1.62, eye: 2.4 },
          // [낙타상] 길쭉하고 광대가 도드라진 얼굴
          'camel': { face: 0.68, slant: -0.5, dist: 1.15, nose: 1.00, mouth: 1.42, eye: 2.6 },
          // [거북이상] 고개 내밀듯 넓은 얼굴, 위로 찢어진 눈매
          'turtle': { face: 0.89, slant: 3.0, dist: 1.28, nose: 0.95, mouth: 1.36, eye: 3.1 }
      };

      let candidates = [];
      this.animalDb.animals.forEach(animal => {
          let arch = archetypes[animal.id] || { face: 0.8, slant: 0, dist: 1.0, nose: 0.9, mouth: 1.3, eye: 2.8 };

          let diffF = features.faceRatio - arch.face;
          let diffS = features.eyeSlant - arch.slant;
          let diffD = features.eyeDistRatio - arch.dist;
          let diffN = features.noseWidthRatio - arch.nose;
          let diffM = features.mouthRatio - arch.mouth;
          let diffE = features.eyeRatio - arch.eye;

          // 차이의 제곱을 사용해 오차 증폭 (원래의 정밀 가중치 유지)
          let penalty = (Math.pow(diffF, 2) * 1800) + 
                        (Math.pow(diffS, 2) * 12) + 
                        (Math.pow(diffD, 2) * 1000) + 
                        (Math.pow(diffN, 2) * 1200) + 
                        (Math.pow(diffM, 2) * 500) + 
                        (Math.pow(diffE, 2) * 150);
          
          // 확률 계산을 나중으로 미루고 정확한 유클리디안 거리를 먼저 기록 (중요)
          let geoScore = Math.max(0, 2000 - penalty);
          candidates.push({ animal, penalty, geoScore });
      });

      // (특수 조건 보정은 위 점수 산출 블록에서 처리됨)

      // ── face-api.js 표정 기반 동물상 부스트 맵핑 ──
      const EXPR_BOOST = {
        happy:     { dog:40, rabbit:35, hamster:35, otter:30, koala:25, cat:5,  deer:15, bear:20, sparrow:30, alpaca:10 },
        neutral:   { cat:30, fox:25, snake:20, wolf:20, leopard:25, eagle:15, tiger:10 },
        angry:     { tiger:40, crocodile:35, lion:30, eagle:25, wolf:25, dinosaur:20, leopard:15 },
        surprised: { deer:35, rabbit:25, hamster:20, koala:20, alpaca:30, frog:20 },
        fearful:   { rabbit:30, hamster:25, deer:25, sparrow:30, otter:15 },
        disgusted: { cat:30, snake:25, leopard:25, fox:20, crocodile:15, eagle:15 },
        sad:       { dog:30, deer:35, bear:20, rabbit:15, camel:25, giraffe:10 }
      };

      // 표정 점수 보정 및 최종 totalScore 산출 (기하 60% + 표정 40%)
      candidates.forEach(c => {
        let exprScore = 0;
        if (expressionData && typeof expressionData === 'object') {
          Object.keys(EXPR_BOOST).forEach(expr => {
            const prob = expressionData[expr] || 0; // 0~1
            const boost = (EXPR_BOOST[expr][c.animal.id] || 0);
            exprScore += prob * boost * 20;
          });
        }
        c.exprScore = exprScore;
        c.totalScore = Math.max(0, c.geoScore * 0.60 + exprScore * 0.40);
      });

      // 특수 조건 보정 반영 (기존 penalty 조정 → totalScore 직접 가감)
      candidates.forEach(c => {
        if (c.animal.id === 'fox') {
          if (features.eyeSlant < -1.0 && features.faceRatio <= 0.85 && features.noseWidthRatio > 0.85) {
            c.totalScore += 300;
          }
        }
        if (c.animal.id === 'cat') {
          if (features.eyeSlant <= -4.0 && features.faceRatio >= 0.79) {
            c.totalScore += 1500;
          }
        }
        if (c.animal.id === 'snake') {
          if (features.jawSquareness >= 0.85)  c.totalScore -= 2000;
          else if (features.jawSquareness <= 0.72) c.totalScore += 2000;
          if (features.eyeSlant <= -2.0 && features.mouthRatio >= 1.38) c.totalScore += 700;
        }
        if (c.animal.id === 'crocodile') {
          if (features.jawSquareness <= 0.75)      c.totalScore -= 2000;
          else if (features.jawSquareness >= 0.85) c.totalScore += 2000;
        }
        c.totalScore = Math.max(0, c.totalScore);
      });

      // 내림차순 정렬 (높은 점수가 1위)
      candidates.sort((a, b) => b.totalScore - a.totalScore);

      // ── 소프트맥스(Softmax)로 퍼센트 계산 ──
      const TOP_K = candidates.slice(0, 6);
      const TEMP = 0.003;
      const expArr = TOP_K.map(c => Math.exp(c.totalScore * TEMP));
      const sumExp = expArr.reduce((s, v) => s + v, 0);
      const pctArr = expArr.map(v => (v / sumExp) * 100);

      let bestMatch = candidates[0].animal;
      let matchProb = pctArr[0];

      const top3 = TOP_K.slice(0, 3).map((c, i) => ({
        animal: c.animal,
        pct: pctArr[i].toFixed(1),
        isTop: i === 0
      }));

    // --- 1. 정밀 안상(眼相) 분석 (운명을 결정짓는 창) --- 
    let eyes = [
      { name: '용안(龍眼)', desc: '눈이 크고 길며 위엄이 있는 제왕의 눈. (가장 길하고 귀한 지위)', prob: 0, tag: 'dragon' },
      { name: '호안(虎眼)', desc: '둥글고 부리부리하며 날카롭게 치켜올라간 눈. (권력과 투지의 상징)', prob: 0, tag: 'tiger' },
      { name: '우안(牛眼)', desc: '크고 선하며 속눈썹이 길고 인내심이 강해 보이는 눈. (거부의 상징)', prob: 0, tag: 'cow' },
      { name: '도화안(桃花眼)', desc: '눈가에 물기가 머문 듯 붉고 웃을 때 초승달처럼 휘어지는 눈. (압도적 인복)', prob: 0, tag: 'peach' },
      { name: '삼백안/사백안(三白眼)', desc: '세로 폭이 넓어 흰자위가 많이 드러나는 형태. (기세가 강하고 파격적 승부사)', prob: 0, tag: 'sanpaku' },
      { name: '봉황안(鳳凰眼)', desc: '가로로 극도로 길고 끝이 부드럽게 날아오르는 최상급의 귀한 눈.', prob: 0, tag: 'phoenix' }
    ];
    
          // --- 영혼의 주파수를 맞추는 척도 함수 ---
      // 선형적 뺄셈(Math.abs)이 아닌, 운명의 중력장(차이의 제곱)을 사용하여
      // 특정 관상의 완벽한 비율에 가까워질수록 점수가 강력하게 응집되도록 빚어낸 비술이야
      const calcKarma = (diff1, w1, diff2 = 0, w2 = 0) => {
          let penalty = (Math.pow(diff1, 2) * w1) + (Math.pow(diff2, 2) * w2);
          return Math.max(10.1, Math.min(99.9, 100 - penalty));
      };

      // --- 1. 정밀 안상(眼相) 분석 ---
      // er: 눈의 가로세로 비율 (세상을 바라보는 시야의 넓이)
      // es: 눈꼬리 각도 (음수면 하늘을 향해 치솟고, 양수면 대지를 향해 쳐짐)
      let er = features.eyeRatio;
      let es = features.eyeSlant;

      eyes[0].prob = calcKarma(er - 3.0, 45, es - (-2), 0.8); // 용안 (제왕의 균형)
      eyes[1].prob = calcKarma(er - 2.5, 55, es - (-6), 1.2); // 호안 (맹렬하게 치켜올라간 기세)
      eyes[2].prob = calcKarma(er - 2.7, 45, es - 4, 1.2);    // 우안 (대지처럼 순하게 쳐진 눈매)

      // 도화안은 입꼬리의 기운(mc)이 달빛처럼 더해져야 진정한 유혹의 상이 완성돼
      let peachBase = calcKarma(er - 2.8, 50, es - (-1), 0.8);
      let peachBonus = features.mouthCurve > 0.003 ? 12 : 0; 
      eyes[3].prob = Math.max(10.1, Math.min(99.9, peachBase + peachBonus)); 

      eyes[4].prob = calcKarma(er - 2.2, 70);                 // 삼백안 (흰자위가 드러나는 압도적 세로 폭)
      eyes[5].prob = calcKarma(er - 3.6, 35, es - (-3), 0.8); // 봉황안 (세상을 품어내는 극도로 긴 눈매)

      eyes.sort((a,b) => b.prob - a.prob);
      let bestEye = eyes[0];

      // --- 2. 정밀 비상(鼻相) 분석 (재물의 척도) ---
      let noses = [
        { name: '현담비(懸膽鼻)', desc: '쓸개를 매단 듯 코끝(준두)이 둥글고 두툼하여 엄청난 재물을 쓸어 담는 코.', prob: 0, tag: 'gall' },
        { name: '절통비(截筒鼻)', desc: '초록 대나무를 자른 듯 콧대가 곧고 반듯하여 부귀영화를 고루 누리는 코.', prob: 0, tag: 'bamboo' },
        { name: '매부리코', desc: '콧대가 높게 솟고 끝이 날카롭게 굽어 있어 예리한 통찰력과 불굴의 투지를 지닌 코.', prob: 0, tag: 'hook' }
      ];
      let nr = features.noseRatio; 
      noses[0].prob = calcKarma(nr - 1.35, 120); // 현담비 (짧고 두툼하게 맺힌 재물창고)
      noses[1].prob = calcKarma(nr - 1.6, 150);  // 절통비 (대나무처럼 맑고 반듯한 귀격)
      noses[2].prob = calcKarma(nr - 1.9, 100);  // 매부리코 (높고 예리하게 깎아지른 승부사)

      noses.sort((a,b) => b.prob - a.prob);
      let bestNose = noses[0];

      // --- 3. 정밀 구상(口相) 분석 (복록의 수용력) ---
      let mouths = [
        { name: '앙월구(仰月口)', desc: '입꼬리가 초승달처럼 위를 향해 총명함이 빛나며 만년의 복록이 대단히 두터운 입.', prob: 0, tag: 'upward' },
        { name: '복선구(覆船口)', desc: '입꼬리가 굳게 닫혀 아래를 향하나, 결단력이 강하고 묵직한 카리스마로 조직을 이끄는 입.', prob: 0, tag: 'downward' },
        { name: '대구(大口)', desc: '시원하게 넓고 큰 입구조로 호탕한 리더십을 발휘하며 수많은 사람을 거느리는 제왕의 입.', prob: 0, tag: 'large' },
        { name: '음배구(陰配口)', desc: '작고 앙증맞으나 윤곽이 단정하여, 비밀을 무겁게 지키고 내면의 신념이 단단한 입.', prob: 0, tag: 'small' }
      ];
      // 미세한 입꼬리 근육(mc)의 파동을 1000배 증폭시켜 뚜렷한 영적 수치로 체환했어
      let mcScaled = features.mouthCurve * 1000; 
      let mr = features.mouthRatio;

      mouths[0].prob = calcKarma(mcScaled - 5, 2.5, mr - 1.35, 60);    // 앙월구 (초승달처럼 위를 향해 열린 복록)
      mouths[1].prob = calcKarma(mcScaled - (-5), 2.5, mr - 1.35, 60); // 복선구 (배가 뒤집힌 듯 무겁고 굳건한 닫힘)
      mouths[2].prob = calcKarma(mr - 1.7, 120);                       // 대구 (세상의 모든 것을 집어삼키는 호탕함)
      mouths[3].prob = calcKarma(mr - 1.05, 150);                      // 음배구 (작고 앙증맞으나 속이 꽉 찬 신념)

      mouths.sort((a,b) => b.prob - a.prob);
      let bestMouth = mouths[0];

    // --- 4. 정밀 이상(耳相) 분석 ---
    let earText = "";
    if (features.earPosition === "high") {
        earText += "귀의 윗부분이 눈썹 선보다 위치가 높아(과목상) 학문적 성취와 지혜가 대단히 뛰어나며, 일찍부터 이름을 떨치어 부귀를 누릴 <b>학자/귀인(貴人)</b>의 상입니다. ";
    } else {
        earText += "귀가 눈의 높이와 수평으로 조화를 이루어, <b>뛰어난 현실 감각과 흔들림 없는 평정심</b>으로 탄탄한 중년의 성취를 일궈내는 듬직한 상입니다. ";
    }
    if (features.earRatio > 0.22) {
        earText += "<br>특히 <b>수주(귓볼)가 매우 두껍고 넉넉하여</b> 흘러가는 재물을 꽉 쥐어 담고, 만인을 포용하는 자비로움을 갖춘 덕 있는 장수의 귀입니다.";
    } else {
        earText += "<br>수주의 테두리가 단정하고 예리하여 타인에게 헛된 기대를 걸지 않고, 스스로의 완벽주의적 <b>실력 하나로 크게 자수성가</b>하는 서늘한 감각이 비범합니다.";
    }

    // --- 5. 심화 조화 분석 (상생 / 상극) ---
    let harmonyText = "안면 오관(五官)이 각자의 자리에서 무난한 균형을 유지하고 있어 인생 전반이 크게 기울지 않는 평원(平原)의 격국입니다.";
    
    // 조화 분석 규칙 (상생/상극 매핑)
    if (bestEye.tag === 'tiger' && bestMouth.tag === 'downward') {
        harmonyText = "⚠️ <b>[상극 조화 - 호안과 복선구]</b> 눈빛의 기세가 천하를 뚫는 맹렬한 호안(虎眼)이나, 입꼬리가 굳게 닫힌 복선구로 인해 분노가 안으로 쌓여 기운이 단절될 우려가 있습니다. 유연한 미소와 온화한 덕(德)을 갖추어 기운을 순환시키면 대업을 이룹니다.";
    } else if ((bestEye.tag === 'dragon' || bestEye.tag === 'phoenix') && bestNose.tag === 'gall') {
        harmonyText = "✨ <b>[극상 상생 - 제왕과 거부의 조화]</b> 위엄 있는 용상(또는 봉황)의 눈과 천하의 재물을 쓸어 담는 현담비(懸膽鼻)가 만나 <b>가장 완벽하고 부귀한 최고의 격국(格局)</b>을 이뤘습니다. 이끄는 곳마다 엄청난 결과와 명예가 쏟아집니다.";
    } else if ((bestEye.tag === 'dragon' || bestEye.tag === 'tiger') && bestNose.tag === 'hook') {
        harmonyText = "⚔️ <b>[패업 상생 - 투장(鬪將)의 기운]</b> 두려움 없는 눈매에 매부리코의 예리하고 공격적인 기운이 더해져, 난세의 영웅이나 기업 파괴적 승부사처럼 남들이 불가능하다 여기는 일을 과감히 쟁취해내는 <b>풍운아의 격국</b>입니다.";
    } else if ((bestEye.tag === 'phoenix' || bestEye.tag === 'sanpaku') && bestNose.tag === 'bamboo') {
        harmonyText = "✨ <b>[청귀(淸貴) 상생 - 불의와 타협 않는 고고함]</b> 극도로 예리한 눈빛과 초록 대나무를 쪼갠 듯 반듯한 절통비가 아름답게 조화를 이룹니다. 학자, 판검사 혹은 시대의 리더로서 <b>탁함에 물들지 않고 맑고 숭고한 지위</b>에 오를 격국입니다.";
    } else if (bestEye.tag === 'peach' && bestMouth.tag === 'upward') {
        harmonyText = "🌸 <b>[도화 상생 - 압도적 만인의 연인]</b> 촉촉하고 아련하게 사람을 홀리는 도화안에, 자연스레 호감을 불러일으키는 사랑스러운 앙월구가 더해져 <b>한 번 보면 잊을 수 없는 엄청난 인복과 대중의 사랑</b>을 독차지하는 격국입니다.";
    } else if (bestEye.tag === 'cow' && bestMouth.tag === 'large') {
        harmonyText = "🤝 <b>[포용 상생 - 천하를 거느리는 대장보]</b> 선하고 다정다감한 우안과 한 번에 바다를 들이켤 듯 시원한 대구(大口)가 조화되어, 수많은 사람을 넉넉히 먹여 살리고 거느리는 덕장(德將)의 기운을 완벽히 뽐냅니다.";
    } else if (bestEye.tag === 'sanpaku' && bestMouth.tag === 'small') {
        harmonyText = "⚠️ <b>[상극 조화 - 삼백안과 은배구]</b> 눈빛의 야망(삼백안)은 몹시 강렬하나, 이를 뿜어낼 입(음배구)이 앙증맞고 작아 포부를 다 펼치지 못하고 속병을 앓기 쉽습니다. 소통의 폭을 과감히 넓히면 내면의 천재성이 빛을 봅니다.";
    }

    // 비술: 업보와 그림자의 농도 계산 (관상학적 흉상 수치화)
      const karmaData = this.calculateKarmaShadow(landmarksData);

      const expertReportHtml = `
      <div style="font-family: 'Pretendard', sans-serif; color: #333; line-height: 1.6;">
        
        <div style="margin-bottom: 15px; background: #f0fdf4; padding: 15px; border-radius: 10px; border-left: 4px solid #10b981;">
            <div style="font-weight: 800; font-size: 1.1rem; color: #065f46; margin-bottom: 5px;"> 👑 ${bestMatch.emoji} ${bestMatch.name} 관상 총평</div>
            <div style="font-size: 0.95rem; color: #1e293b; line-height: 1.6;">${bestMatch.description}</div>

        <div style="margin-bottom: 15px;">
          <div style="font-weight: 800; font-size: 1.05rem; color: #0f172a; margin-bottom: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;"> 오관(五官) 정밀 확률 분석</div>
          <ul style="padding-left: 0; list-style: none; font-size: 0.95rem; color: #475569; margin: 0;">
            <li style="margin-bottom: 12px; background: #f8fafc; padding: 10px; border-radius: 6px;">
               <div style="font-weight:700; color:#3b82f6; margin-bottom:4px; font-size: 1rem;">👁️ 안상(눈) - ${bestEye.name} <span style="color:#2563eb;">[${bestEye.prob.toFixed(1)}% 일치]</span></div>
               ${bestEye.desc}
               <div style="font-size:0.8rem; color:#94a3b8; margin-top:4px;">*경합 분석: ${eyes[1].name}(${eyes[1].prob.toFixed(1)}%), ${eyes[2].name}(${eyes[2].prob.toFixed(1)}%)</div>
            </li>
            <li style="margin-bottom: 12px; background: #f8fafc; padding: 10px; border-radius: 6px;">
               <div style="font-weight:700; color:#8b5cf6; margin-bottom:4px; font-size: 1rem;">👃 비상(코) - ${bestNose.name} <span style="color:#7c3aed;">[${bestNose.prob.toFixed(1)}% 일치]</span></div>
               ${bestNose.desc}
               <div style="font-size:0.8rem; color:#94a3b8; margin-top:4px;">*경합 분석: ${noses[1].name}(${noses[1].prob.toFixed(1)}%)</div>
            </li>
            <li style="margin-bottom: 12px; background: #f8fafc; padding: 10px; border-radius: 6px;">
               <div style="font-weight:700; color:#ec4899; margin-bottom:4px; font-size: 1rem;">👄 구상(입) - ${bestMouth.name} <span style="color:#db2777;">[${bestMouth.prob.toFixed(1)}% 일치]</span></div>
               ${bestMouth.desc}
            </li>
            <li style="margin-bottom: 6px; background: #f8fafc; padding: 10px; border-radius: 6px;">
               <div style="font-weight:700; color:#f59e0b; margin-bottom:4px; font-size: 1rem;">👂 이상(귀/수주)의 통찰</div>
               ${earText}
            </li>
          </ul>
        </div>

<div style="margin-bottom: 15px; background: #fef2f2; padding: 15px; border-radius: 10px; border: 1px solid #fca5a5;">
            <div style="font-weight: 800; font-size: 1.05rem; color: #991b1b; margin-bottom: 8px; border-bottom: 1px solid #fecaca; padding-bottom: 5px;"> 💀 영혼의 그림자 (Karma Shadow)</div>
            <div style="font-size: 0.95rem; color: #7f1d1d; margin-bottom: 10px;">
              현재 얼굴에 깃든 오대 업보(五大 業報)의 농도는 <b style="font-size: 1.1rem; color: #b91c1c;">${karmaData.score}%</b> 입니다.
            </div>
            <ul style="padding-left: 0; list-style: none; font-size: 0.85rem; color: #7f1d1d; margin: 0; margin-bottom: 12px; background: #fee2e2; padding: 10px; border-radius: 6px;">
              <li style="margin-bottom: 4px;">💸 <b>재물 누수 지수 (노공):</b> ${karmaData.nose}</li>
              <li style="margin-bottom: 4px;">⚔️ <b>파란만장 지수 (사백안):</b> ${karmaData.eye}</li>
              <li style="margin-bottom: 4px;">🌪️ <b>고립/쇠퇴 지수 (복선구):</b> ${karmaData.mouth}</li>
              <li style="margin-bottom: 4px;">⛓️ <b>편협/고난 지수 (명궁 협소):</b> ${karmaData.glabella}</li>
              <li style="margin-bottom: 0;">🍂 <b>말년 붕괴 지수 (빈약한 하관):</b> ${karmaData.jaw}</li>
            </ul>
            <div style="font-weight: 800; color: #991b1b; margin-bottom: 5px; font-size: 0.95rem;">✨ 운명 개운법 (心相處方)</div>
            <p style="font-size: 0.9rem; color: #7f1d1d; margin: 0; line-height: 1.5;">${karmaData.advice}</p>
          </div>

          <div style="margin-bottom: 15px; background: #fffbeb; padding: 15px; border-radius: 10px; border: 1px solid #fde68a;">
          <div style="font-weight: 800; font-size: 1.05rem; color: #d97706; margin-bottom: 5px;"> 📜 삶의 지혜 (Advise)</div>
          <p style="font-size: 0.95rem; color: #78350f; margin: 0;">관상의 흠결은 미소 하나로 훌륭하게 덧입혀지고, 아무리 좋은 상(相)도 오만한 태도 앞에서는 금세 빛을 잃습니다. <b>본인의 타고난 강점을 믿고 겸손하게 내면(心相)을 다루는 것</b>이 진정한 개운(開運)의 본질임을 잊지 마십시오.</p>
        </div>

        <div>
           <div style="font-weight: 800; font-size: 1.05rem; color: #0f172a; margin-bottom: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;"> 🐾 이면의 현대적 동물상 매칭</div>
           <!-- Top3 동물상 퍼센트 표시 -->
           <div style="margin-bottom:14px; background:#f0f9ff; padding:14px; border-radius:10px; border-left:4px solid #0ea5e9;">
             <div style="font-weight:800; font-size:0.95rem; color:#0c4a6e; margin-bottom:10px;">🐾 동물상 매칭 순위 (TOP 3)</div>
             ${top3.map((t, i) => `
             <div style="margin-bottom:${i<2?'10':'0'}px;">
               <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                 <span style="font-weight:${t.isTop?'800':'600'};font-size:${t.isTop?'1.05':'0.88'}rem;color:${t.isTop?'#0f172a':'#475569'};">${i+1}위 ${t.animal.emoji} ${t.animal.name}</span>
                 <span style="font-weight:800;color:${t.isTop?'#0ea5e9':'#64748b'};font-size:${t.isTop?'1rem':'0.85'}rem;">${t.pct}%</span>
               </div>
               <div style="background:#e2e8f0;height:${t.isTop?'10':'6'}px;border-radius:9px;overflow:hidden;">
                 <div style="height:100%;width:${t.pct}%;background:${t.isTop?'linear-gradient(90deg,#38bdf8,#0ea5e9)':'#94a3b8'};border-radius:9px;"></div>
               </div>
               ${t.isTop ? `<div style="font-size:0.75rem;color:#64748b;margin-top:3px;">대표 연예인: ${t.animal.celebrities.slice(0,3).join(', ')}</div>` : ''}
             </div>`).join('')}
           </div>
           <p style="font-size: 0.95rem; color: #475569; margin: 0;">위의 고전 관상학적 특질을 현대 매력 지수로 체환하면 <b>[${bestMatch.name} ${bestMatch.emoji}]</b>의 기운과 흡사합니다. (대표 연예인: ${bestMatch.celebrities.join(", ")})</p>
        </div>
      </div>
    `;

    return {
      primaryAnimal: bestMatch.name,
      emoji: bestMatch.emoji,
      celebrities: bestMatch.celebrities.join(", "),
      description: bestMatch.description,
      expertReportHtml: expertReportHtml,
      // 소프트맥스 기반 1위 퍼센트 (face-api 표정 반영)
      confidence: matchProb.toFixed(1),
      top3,
      extractedFeatures: features
    };
  }
}

window.FaceAnalysisEngine = AnalysisEngine;
window.faceAnalysisEngine = new AnalysisEngine();








