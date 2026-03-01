// ============================================
// Face Analysis Engine (Vanilla JS 포팅 버전)
// AI 동물 관상 맞춤형 DB 포함 (15종) + 전문가 삼정 정밀 분석
// ============================================

class AnalysisEngine {
  constructor() {
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
        celebrities: ['카리나', '청하', '이수혁', '김소연', '현아'],
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
          celebrities: ['현진(Stray Kids)', '예지(ITZY)', '지민(BTS)'],
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
    const RIGHT_EYE_IN = landmarks[362];
    const RIGHT_EYE_OUT = landmarks[446];
    const NOSE_LEFT = landmarks[129];
    const NOSE_RIGHT = landmarks[358];
    const NOSE_TIP = landmarks[2];
    const CHIN = landmarks[152];
    const JAW_LEFT = landmarks[149];
    const JAW_RIGHT = landmarks[378];
    const FOREHEAD = landmarks[10];
    const GLABELLA = landmarks[168]; 
    const MOUTH_LEFT = landmarks[61];
    const MOUTH_RIGHT = landmarks[291];
    const EAR_LEFT_TOP = landmarks[127];
    const EAR_LEFT_BOTTOM = landmarks[132];
    const EAR_LEFT_OUTER = landmarks[234]; 

    const faceLength = this.calculateDistance(FOREHEAD, CHIN);
    const faceWidth = this.calculateDistance(JAW_LEFT, JAW_RIGHT);
    const eyeDistance = this.calculateDistance(LEFT_EYE_IN, RIGHT_EYE_IN);
    const noseWidth = this.calculateDistance(NOSE_LEFT, NOSE_RIGHT);
    const mouth_width = this.calculateDistance(MOUTH_LEFT, MOUTH_RIGHT);

    const upper_len = this.calculateDistance(FOREHEAD, GLABELLA);
    const middle_len = this.calculateDistance(GLABELLA, NOSE_TIP);
    const lower_len = this.calculateDistance(NOSE_TIP, CHIN);
    const total_samjung = upper_len + middle_len + lower_len;
    const samjung = {
      upper: upper_len / total_samjung,
      middle: middle_len / total_samjung,
      lower: lower_len / total_samjung
    };

    const leftEarPosition = (EAR_LEFT_TOP.y < LEFT_EYE_OUT.y) ? "high" : "normal";
    const leftEarSize = this.calculateDistance(EAR_LEFT_TOP, EAR_LEFT_BOTTOM);
    const lobe_volume = (leftEarSize / faceLength > 0.22) ? "large" : "normal";
    // z is negative. more negative = closer to camera (sticking out)
    const earInnerRim = (EAR_LEFT_OUTER.z < NOSE_LEFT.z * 0.5) ? "prominent" : "normal"; 
    const mouth_size = (mouth_width / noseWidth > 1.3) ? "large" : "small";

    const features = {
      jaw_shape: (faceWidth / faceLength > 0.76) ? "wide" : ((faceWidth / faceLength < 0.65) ? "sharp" : "round"),
      eye_distance: (eyeDistance / faceWidth > 0.28) ? "wide" : "narrow",
      nose_width: (noseWidth / faceWidth > 0.23) ? "wide" : "narrow",
      eye_slant: "neutral",
      ear_position: leftEarPosition,
      lobe_volume: lobe_volume,
      inner_rim: earInnerRim,
      mouth_size: mouth_size,
      samjung: samjung
    };

    const leftEyeAngle = this.calculateAngle(LEFT_EYE_IN, LEFT_EYE_OUT);
    if (leftEyeAngle < -3) features.eye_slant = "upward";
    if (leftEyeAngle > 3) features.eye_slant = "downward";

    return features;
  }

  async analyze(landmarksData) {
    const features = this.extractGeometricFeatures(landmarksData);
    let bestMatch = null;
    let maxScore = -1;
    let candidates = [];

    for (const animal of this.animalDb.animals) {
      let score = 0;
      let totalFeatures = Object.keys(animal.key_features).length;

      for (const [key, value] of Object.entries(animal.key_features)) {
        if (features[key] === value) {
          score += 1;
        }
      }

      const matchRatio = score / totalFeatures;
      if (matchRatio > maxScore) {
        maxScore = matchRatio;
        candidates = [animal];
      } else if (matchRatio === maxScore) {
        candidates.push(animal);
      }
    }

    const pseudoRandom = Math.floor(Math.abs(landmarksData[152].z * 1000000)) % candidates.length;
    bestMatch = candidates[pseudoRandom] || this.animalDb.animals[0];

    const eyeText = features.eye_slant === "upward" ? "<b>봉황안/상향안 (눈꼬리가 올라간 형태)</b> - 예리한 각도를 띠어 통찰력과 결단력이 뛰어나며, 상황을 주도하는 리더십과 비즈니스 통찰력이 탁월합니다." :
                   (features.eye_slant === "downward" ? "<b>수향안 (눈꼬리가 처진 형태)</b> - 부드러운 곡선을 띠어 타인에 대한 공감 능력과 친화력이 강해, 조직 내에서 포용력 있는 소통을 이끌어냅니다." :
                   "<b>평목 (수평을 이루는 단정한 눈)</b> - 균형 잡힌 시야를 바탕으로 편견 없이 상황을 파악하며, 이성적이고 객관적인 판단력을 지녔습니다.");

    const noseText = features.nose_width === "wide" ? "<b>현담비 (코끝이 둥글고 넓음)</b> - 재물운을 품는 창고가 넓어 물질적 풍요와 여유가 따르며, 뚝심 있는 사회적 추진 에너지가 강하게 나타납니다." :
                    "<b>청수비 (날렵하고 오똑한 코)</b> - 자아가 확고하고 미적 감각이 뛰어나며, 재물을 효율적으로 관리하는 지적이고 세련된 운용 능력이 돋보입니다.";

    const mouthText = features.mouth_size === "large" ? "<b>대구 (크고 시원한 입)</b> - 대인관계의 폭이 넓고 소통 스타일이 호탕하여 주변에 사람이 모이며, 말년의 인복과 사회적 영향력이 강력합니다." :
                     "<b>단구 (단정하고 야무진 입술)</b> - 신중하고 섬세한 소통 방식을 지녀 타인의 비밀을 잘 지켜주며, 깊고 진정성 있는 관계를 통해 안정적인 인복을 누립니다.";

    let earText = "<b>수주 및 내이륜 (귀의 형태와 위치)</b> - ";
    if (features.ear_position === "high") {
        earText += "귀가 눈보다 높이 자리 잡아(High Position) 빠른 상황 판단과 지적 호기심이 강한 Scholar(학자) 혹은 Leader 타입입니다. ";
    } else {
        earText += "귀가 눈높이와 안정적으로 조화를 이루어 현실적이고 안정적인 자산 운용 감각을 지녔습니다. ";
    }
    if (features.lobe_volume === "large") {
        earText += "특히 귓불(수주)에 부피감이 있어 재물을 끌어당기는 수용력과 타인을 포용하는 넉넉한 인내심이 엿보입니다. ";
    } else {
        earText += "단정한 귓불 형태를 지녀 스스로의 실력과 감각으로 자산과 성과를 개척해 나가는 자수성가형 기질이 돋보입니다. ";
    }
    if (features.inner_rim === "prominent") {
        earText += "또한 귀 안쪽 뼈(내이륜)가 두드러져 개성이 뚜렷하고 독립적인 기업가(Entrepreneurship) 성향을 품고 있습니다.";
    } else {
        earText += "내이륜이 차분하게 안착되어 조직 내에서 훌륭한 조율자이자 협력자 역할을 수행하게 됩니다.";
    }

    let foreheadText = "<b>명궁 및 이마 (골상과 윤곽)</b> - ";
    if (features.jaw_shape === "wide") {
        foreheadText += "하관과 골격이 튼튼하게 자리잡아(강인한 근성) 어떤 어려움이 닥쳐도 꿋꿋하게 목표를 달성하는 묵직한 명예운과 직업적 성취를 보여줍니다.";
    } else if (features.jaw_shape === "sharp") {
        foreheadText += "하관이 날렵하고 뚜렷하여 트렌드를 앞서가는 예리한 감각과 빠른 실행력을 바탕으로 커리어의 정점을 향해 거침없이 나아갑니다.";
    } else {
        foreheadText += "상정과 하관이 원만하게 조화를 이루어 주변과의 마찰 없이 지속적으로 직업적 위상을 높여가는 탄탄한 기반을 가졌습니다.";
    }

    const u_pct = (features.samjung.upper * 100).toFixed(1);
    const m_pct = (features.samjung.middle * 100).toFixed(1);
    const l_pct = (features.samjung.lower * 100).toFixed(1);

    let samjungHtml = `상정(초년) ${u_pct}%, 중정(중년) ${m_pct}%, 하정(말년) ${l_pct}%의 비율을 가집니다. `;
    if (features.samjung.upper > 0.35) {
        samjungHtml += "특히 초년의 학력과 기초 자산이 탄탄하며, 일찍부터 재능을 발휘하는 엘리트형 기운이 있습니다. ";
    } else if (features.samjung.middle > 0.36) {
        samjungHtml += "중년기에 해당하는 이목구비의 에너지가 가장 강하여, 30~50대에 사회적 전성기를 맞이해 폭발적인 성취를 이뤄냅니다. ";
    } else if (features.samjung.lower > 0.35) {
        samjungHtml += "하관의 기운이 묵직하게 받쳐주어, 인생 후반부로 갈수록 재물과 인복이 쌓이는 대기만성형(말년 운) 구조입니다. ";
    } else {
        samjungHtml += "상중하 비율이 1:1:1에 가깝게 황금 밸런스를 이루어, 인생 전반에 걸쳐 큰 기복 없이 탄탄한 발전과 평안함을 누립니다. ";
    }

    const toneStr = features.ear_position === 'high' ? '총명하고 주도적인' : '안정적이고 포용력 있는';
    const expertReportHtml = `
      <div style="font-family: 'Pretendard', sans-serif; color: #333; line-height: 1.6;">
        <div style="margin-bottom: 15px; background: #f0fdf4; padding: 15px; border-radius: 10px; border-left: 4px solid #10b981;">
          <div style="font-weight: 800; font-size: 1.1rem; color: #065f46; margin-bottom: 5px;"> 종합 총평: [${bestMatch.name}의 얼굴]</div>
          명석한 두뇌와 뛰어난 상황 대처 능력이 어우러져 있으며, 전체적인 이목구비의 밸런스가 조화로워 <b>'${toneStr}'</b> 에너지를 발산합니다. 운명론적 단정보다는 본인만의 특유의 성향을 무기로 사회적 성취를 크게 개척해 나갈 관상입니다.
        </div>

        <div style="margin-bottom: 15px;">
          <div style="font-weight: 800; font-size: 1.05rem; color: #0f172a; margin-bottom: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;"> 부위별 정밀 분석</div>
          <ul style="padding-left: 20px; font-size: 0.95rem; color: #475569; margin: 0;">
            <li style="margin-bottom: 8px;"><b>눈 (안상):</b> ${eyeText}</li>
            <li style="margin-bottom: 8px;"><b>코 (비상):</b> ${noseText}</li>
            <li style="margin-bottom: 8px;"><b>입 (구상):</b> ${mouthText}</li>
            <li style="margin-bottom: 8px;"><b>귀 (이상):</b> ${earText}</li>
            <li style="margin-bottom: 8px;"><b>이마/골상:</b> ${foreheadText}</li>
          </ul>
        </div>

        <div style="margin-bottom: 15px;">
          <div style="font-weight: 800; font-size: 1.05rem; color: #0f172a; margin-bottom: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;"> 삼정 및 균형 밸런스 분석</div>
          <p style="font-size: 0.95rem; color: #475569; margin: 0;">${samjungHtml}</p>
        </div>

        <div style="margin-bottom: 15px; background: #fffbeb; padding: 15px; border-radius: 10px; border: 1px solid #fde68a;">
          <div style="font-weight: 800; font-size: 1.05rem; color: #d97706; margin-bottom: 5px;"> 삶의 지혜 (Advise)</div>
          <p style="font-size: 0.95rem; color: #78350f; margin: 0;">관상학적 단점은 일상의 작은 변화로 훌륭하게 보완할 수 있습니다. <b>지적 매력을 돋보이게 하고 싶다면 귀를 살짝 드러내는 헤어스타일</b>을 시도해보시고, <b>더욱 부드러운 소통을 원한다면 둥근 곡선형 안경테</b>로 인상을 한층 온화하게 연출해보세요. 무엇보다 스스로의 잠재력과 성향을 긍정하는 '마인드셋'이 최고의 관상을 완성합니다.</p>
        </div>

        <div>
          <div style="font-weight: 800; font-size: 1.05rem; color: #0f172a; margin-bottom: 8px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px;"> 닮은꼴 동물상 매칭</div>
          <p style="font-size: 0.95rem; color: #475569; margin: 0;">위 분석을 종합했을 때 가장 일치하는 기운의 동물상은 <b>'${bestMatch.name}' ${bestMatch.emoji}</b>입니다. 이 기운을 공유하는 대표 유명인으로는 <b>${bestMatch.celebrities.join(", ")}</b> 님이 있습니다.</p>
        </div>
      </div>
    `;

    return {
      primaryAnimal: bestMatch.name,
      emoji: bestMatch.emoji,
      celebrities: bestMatch.celebrities.join(", "),
      description: bestMatch.description,
      expertReportHtml: expertReportHtml,
      confidence: maxScore > 0 ? (maxScore * 100).toFixed(1) : 50.0,
      extractedFeatures: features
    };
  }
}

window.FaceAnalysisEngine = AnalysisEngine;
window.faceAnalysisEngine = new AnalysisEngine();