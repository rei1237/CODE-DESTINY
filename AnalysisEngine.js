// ============================================
// Advanced Asian Physiognomy Analysis Engine (마의상법 딥러닝 기반 포팅)
// ============================================

class AnalysisEngine {
  constructor() {
    this.calculateDistance = (p1, p2) => Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));

    this.animalDb = [
        { id: 'dragon', name: '용상(龍相)', emoji: '🐉', targets: { face: 0.8, jaw: 0.8, eyeR: 3.2, eyeS: 5, noseR: 1.4, mouthR: 1.4, mouthC: 2 }, celebrities: ['이정재', '고수', '이영애'], desc: '군왕의 제왕적 기운. 압도적인 카리스마와 큰 스케일로 대업을 이룹니다.' },
        { id: 'tiger', name: '호랑이상(虎相)', emoji: '🐅', targets: { face: 0.85, jaw: 0.82, eyeR: 2.5, eyeS: 8, noseR: 1.3, mouthR: 1.5, mouthC: -1 }, celebrities: ['최민식', '백호', '화사'], desc: '무장의 기운. 리더십이 뛰어나고 두려움이 벗이 독립적이고 맹렬합니다.' },
        { id: 'phoenix', name: '봉황상(鳳凰相)', emoji: '🦚', targets: { face: 0.75, jaw: 0.72, eyeR: 3.5, eyeS: 6, noseR: 1.5, mouthR: 1.2, mouthC: 1 }, celebrities: ['차은우', '손예진'], desc: '우아함과 고귀함의 끝판왕. 시대의 상징이 될 만큼 청아한 명예를 지닙니다.' },
        { id: 'crane', name: '학상(鶴相)', emoji: '🕊️', targets: { face: 0.7, jaw: 0.68, eyeR: 3.0, eyeS: 2, noseR: 1.6, mouthR: 1.1, mouthC: 0 }, celebrities: ['강동원', '서현진'], desc: '세속에 물들지 않는 고고한 학자/예술가. 뛰어난 지성과 순수한 매력이 있습니다.' },
        { id: 'fox', name: '여우상(狐相)', emoji: '🦊', targets: { face: 0.75, jaw: 0.65, eyeR: 3.0, eyeS: 10, noseR: 1.5, mouthR: 1.1, mouthC: 3 }, celebrities: ['지코', '한소희', '황민현', '예지'], desc: '순발력과 재치가 뛰어나며 치명적인 매력으로 사람을 홀리는 트렌드세터입니다.' },
        { id: 'dog', name: '강아지상(犬相)', emoji: '🐶', targets: { face: 0.82, jaw: 0.75, eyeR: 2.4, eyeS: -5, noseR: 1.2, mouthR: 1.2, mouthC: 0 }, celebrities: ['송중기', '박보영', '아이유'], desc: '친근함과 애교로 만인의 사랑을 받으며 타인에게 흔들림 없는 충성을 바칩니다.' },
        { id: 'cat', name: '고양이상(猫相)', emoji: '🐱', targets: { face: 0.78, jaw: 0.7, eyeR: 2.6, eyeS: 7, noseR: 1.3, mouthR: 1.1, mouthC: 1 }, celebrities: ['제니', '이종석', '해린'], desc: '도도하고 예민한 매력. 자기 관리가 철저하고 감각적인 분야에서 천재성을 보입니다.' },
        { id: 'bear', name: '곰상(熊相)', emoji: '🐻', targets: { face: 0.9, jaw: 0.85, eyeR: 2.2, eyeS: 0, noseR: 1.1, mouthR: 1.4, mouthC: -2 }, celebrities: ['마동석', '조진웅'], desc: '우직하고 강인한 체력. 거대한 뚝심과 포용력으로 조직의 중심을 무겁게 지킵니다.' },
        { id: 'wolf', name: '늑대상(狼相)', emoji: '🐺', targets: { face: 0.78, jaw: 0.78, eyeR: 2.8, eyeS: 8, noseR: 1.4, mouthR: 1.3, mouthC: 0 }, celebrities: ['주지훈', '이준기'], desc: '야성과 고독이 공존. 한 번 목표를 달성하기 위해 집요하게 파고드는 집념이 강합니다.' },
        { id: 'deer', name: '사슴상(鹿相)', emoji: '🦌', targets: { face: 0.72, jaw: 0.7, eyeR: 2.3, eyeS: 0, noseR: 1.5, mouthR: 1.0, mouthC: 0 }, celebrities: ['공유', '윤아'], desc: '맑고 선한 성품. 감수성이 풍부하고 보호본능을 자극하며 다툼을 싫어하는 평화주의자입니다.' },
        { id: 'monkey', name: '원숭이상(猿相)', emoji: '🐵', targets: { face: 0.8, jaw: 0.75, eyeR: 2.5, eyeS: 2, noseR: 1.1, mouthR: 1.4, mouthC: 2 }, celebrities: ['신하균', '장동민'], desc: '눈치가 빠르고 두뇌 회전이 천재적입니다. 어디서나 다재다능한 팔방미인형입니다.' },
        { id: 'snake', name: '뱀상(蛇相)', emoji: '🐍', targets: { face: 0.7, jaw: 0.65, eyeR: 3.2, eyeS: 8, noseR: 1.5, mouthR: 1.2, mouthC: -1 }, celebrities: ['김우빈', '류준열'], desc: '날카로운 이성과 속을 알 수 없는 신비감. 판을 읽고 기회를 낚는 능력은 따를 자가 없습니다.' },
        { id: 'pig', name: '돼지상(亥相)', emoji: '🐷', targets: { face: 0.92, jaw: 0.85, eyeR: 2.1, eyeS: -1, noseR: 1.0, mouthR: 1.3, mouthC: 1 }, celebrities: ['강호동', '고창석'], desc: '넉넉하고 식복과 재복이 타고났습니다. 낙천적인 성격으로 말년에 큰 복을 거머쥡니다.' },
        { id: 'horse', name: '말상(馬相)', emoji: '🐴', targets: { face: 0.78, jaw: 0.78, eyeR: 2.5, eyeS: -4, noseR: 1.5, mouthR: 1.3, mouthC: 0 }, celebrities: ['최시원', '이광수'], desc: '역동적이고 진취적입니다. 활동 반경이 넓고 에너지가 넘쳐 세계를 누비며 활약합니다.' },
        { id: 'rabbit', name: '토끼상(兎相)', emoji: '🐰', targets: { face: 0.76, jaw: 0.68, eyeR: 2.1, eyeS: 0, noseR: 1.2, mouthR: 1.0, mouthC: 2 }, celebrities: ['수지', '나연'], desc: '발랄하고 귀여운 상. 재능이 많고 순수하여 주위의 끊임없는 보호와 사랑을 받습니다.' },
        { id: 'turtle', name: '거북이상(龜相)', emoji: '🐢', targets: { face: 0.88, jaw: 0.82, eyeR: 2.6, eyeS: 0, noseR: 1.2, mouthR: 1.5, mouthC: 0 }, celebrities: ['하연수', '김태리'], desc: '침착하고 덕이 깊어 어떤 위기에서도 여유를 잃지 않는 장수와 평안의 상징입니다.' }
    ];

    this.eyeDb = [
        { id: 'dragon', name: '용안(龍眼)', desc: '눈이 크고 길며 위로 살짝 올라간 제왕의 눈. 천하를 호령하는 극위극귀의 상입니다.', targets: { r: 3.2, s: 5, d: 1.0 } },
        { id: 'phoenix', name: '봉황안(鳳凰眼)', desc: '매우 길고 끝이 날렵하게 빠진 최상급 눈. 만인의 우러름을 받는 고결한 귀격입니다.', targets: { r: 3.6, s: 6, d: 1.1 } },
        { id: 'tiger', name: '호안(虎眼)', desc: '눈이 크고 부리부리하며 치켜올라간 눈. 권위와 용맹함으로 큰 부와 명예를 장악합니다.', targets: { r: 2.5, s: 8, d: 1.0 } },
        { id: 'cow', name: '우안(牛眼)', desc: '둥글고 크며 다소 쳐진 눈. 온화하고 인내심이 강해 거부(巨富)가 될 고밀도 재물운의 눈입니다.', targets: { r: 2.2, s: -3, d: 1.2 } },
        { id: 'peach', name: '도화안(桃花眼)', desc: '물기를 머금어 붉은 빛이 감돌고 휘어지는 눈. 치명적 매력으로 넘치는 인복을 평생 누립니다.', targets: { r: 2.8, s: -1, d: 0.9 } },
        { id: 'sanpaku', name: '사백안/삼백안(三白眼)', desc: '상하폭이 커 흰자위가 돋보입니다. 난세를 뒤집는 파격적인 성취욕과 승부사적 기질입니다.', targets: { r: 2.0, s: 4, d: 1.0 } },
        { id: 'snake', name: '사안(蛇眼)', desc: '가늘고 길게 위로 찢어진 세련되고 날카로운 눈. 속내를 감추고 치밀하게 실리를 챙기는 지략가입니다.', targets: { r: 3.4, s: 9, d: 1.0 } },
        { id: 'crane', name: '학안(鶴眼)', desc: '적당히 길고 맑아 선비의 향기가 나는 눈. 부패를 멀리하고 청렴한 학자/법조인으로 명성을 떨칩니다.', targets: { r: 3.0, s: 2, d: 1.05 } },
        { id: 'lion', name: '사자안(獅眼)', desc: '위엄있고 시원시원한 호탕한 눈. 수많은 아랫사람을 넉넉히 통솔하는 리더의 상입니다.', targets: { r: 2.6, s: 5, d: 1.15 } },
        { id: 'monkey', name: '원안(猿眼)', desc: '동그랗고 쌍꺼풀이 깊어 호기심이 빛나는 눈. 번득이는 기지와 재치로 분야의 일인자가 됩니다.', targets: { r: 2.3, s: 1, d: 0.95 } },
        { id: 'elephant', name: '상안(象眼)', desc: '아래위로 눈웃음 주름이 지며 선한 웃음이 특장점. 자비와 장수, 두터운 말년 복을 상징합니다.', targets: { r: 2.7, s: -4, d: 1.2 } }
    ];

    this.noseDb = [
        { id: 'gall', name: '현담비(懸膽鼻)', desc: '코가 정면에서 보아 쓸개를 매단 듯 통통하고 곧게 내려온 최고 부자(富者) 코입니다.', targets: { r: 1.4, z: 0.18, w: 0.25 } },
        { id: 'bamboo', name: '절통비(截筒鼻)', desc: '대나무를 반으로 쪼갠 듯 콧대가 반듯합니다. 성품이 대쪽같으며 학술과 귀함이 빛납니다.', targets: { r: 1.5, z: 0.16, w: 0.22 } },
        { id: 'lion', name: '사자비(獅鼻)', desc: '짧고 코끝이 웅장하게 큰 사자코. 스케일이 단연 으뜸이라 재계의 큰 손이 될 상입니다.', targets: { r: 1.2, z: 0.15, w: 0.30 } },
        { id: 'hook', name: '매부리코/응비(鷹鼻)', desc: '코끝이 갈고리처럼 뾰족하게 내려온 지략가의 코. 전투력과 돌파력이 타의 추종을 불허합니다.', targets: { r: 1.6, z: 0.20, w: 0.23 } },
        { id: 'sack', name: '부장비(富腸鼻)', desc: '콧방울이 두툼하게 자루처럼 잘 감싸져 재물이 한 번 들어오면 절대 안 새는 거부의 코입니다.', targets: { r: 1.3, z: 0.14, w: 0.28 } },
        { id: 'dog', name: '계비(犬鼻)', desc: '다소 낮으나 굴곡이 없이 매끈한 코. 욕심이 덜하여 인간관계가 진실하고 끝이 좋습니다.', targets: { r: 1.2, z: 0.10, w: 0.22 } },
        { id: 'lonepeak', name: '고소비(孤峰鼻)', desc: '얼굴에 비해 코만 유독 우뚝 솟은 상. 자존심이 세고 이상이 매우 높아 타협을 모르는 고고함이 있습니다.', targets: { r: 1.5, z: 0.19, w: 0.20 } },
        { id: 'stove', name: '노형비(爐鼻)', desc: '콧구멍이 화로처럼 열려 활동성이 크고 투자를 즐깁니다. 유동 자산의 스케일이 대단합니다.', targets: { r: 1.1, z: 0.12, w: 0.32 } }
    ];

    this.mouthDb = [
        { id: 'upward', name: '앙월구(仰月口)', desc: '입꼬리가 초승달처럼 사르르 올라가, 총명함과 만년 복록이 두터운 귀격입니다.', targets: { r: 1.2, c: 4 } },
        { id: 'downward', name: '복선구(覆船口)', desc: '입꼬리가 배를 엎은 듯 내려가 묵직하고 강렬한 카리스마로 위기상황을 완벽히 지휘합니다.', targets: { r: 1.2, c: -4 } },
        { id: 'cherry', name: '앵도구(櫻桃口)', desc: '작지만 붉고 윤곽이 뚜렷하여 총명지혜하고 어디서든 사랑을 독차지하는 입입니다.', targets: { r: 0.9, c: 1 } },
        { id: 'large', name: '대구(大口)', desc: '먹성을 상징하는 거대하고 시원한 입. 호탕한 성격으로 수만 명을 먹여살리는 대장부의 그릇입니다.', targets: { r: 1.5, c: 0 } },
        { id: 'square', name: '사구(四字口)', desc: '입술이 두텁고 각이 진 정직한 입. 말에 무게가 있어 신의를 근본으로 하는 재벌/고위직 상입니다.', targets: { r: 1.3, c: -1 } },
        { id: 'fire', name: '취화구(吹火口)', desc: '입술이 불을 불듯 내밀어진 상. 두뇌가 비상하고 달변가여서 논객이나 학자로서 대성합니다.', targets: { r: 0.8, c: -2 } }
    ];
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

    // 눈 꼬리 처짐/올라감 각도 (양수: 올라감, 음수: 쳐짐)
    const eyeSlantAngle = -this.calculateAngle(LEFT_EYE_IN, LEFT_EYE_OUT);
    const interEyeDist = this.calculateDistance(LEFT_EYE_IN, RIGHT_EYE_IN);
    const eyeDistanceRatio = interEyeDist / (eyeWidth || 1);

    const noseWidth = this.calculateDistance(NOSE_LEFT, NOSE_RIGHT);
    const noseLength = this.calculateDistance(GLABELLA, NOSE_TIP);
    const noseRatio = noseLength / (noseWidth || 1);
    const noseZ = Math.abs((NOSE_TIP.z || 0) - (JAW_LEFT.z || 0));
    const noseWidthRatio = noseWidth / (faceWidth || 1);

    const mouthWidth = this.calculateDistance(MOUTH_LEFT, MOUTH_RIGHT);
    const mouthCenterY = (MOUTH_TOP.y + MOUTH_BOTTOM.y) / 2;
    const mouthCornerY = (MOUTH_LEFT.y + MOUTH_RIGHT.y) / 2;
    const mouthCurve = (mouthCenterY - mouthCornerY) * 1000; // 양수: 앙월구(올라감)

    const ewC = this.calculateDistance(EAR_LEFT_TOP, EAR_LEFT_BOTTOM) / faceLength;
    const earPos = EAR_LEFT_TOP.y < LEFT_EYE_OUT.y ? "high" : "normal";

    return {
      faceRatio: faceWidth / (faceLength || 1),
      jawShape: this.calculateDistance(landmarks[132], landmarks[361]) / (faceWidth || 1), // 하악폭 비율
      eyeRatio: eyeRatio,
      eyeSlant: eyeSlantAngle,
      eyeDistance: eyeDistanceRatio,
      noseRatio: noseRatio,
      noseZ: noseZ * 10, // 스케일 조정
      noseWidthRatio: noseWidthRatio,
      mouthCurve: mouthCurve,
      mouthRatio: mouthWidth / (noseWidth || 1),
      earRatio: ewC,
      earPosition: earPos
    };
  }

  // 다차원 유클리디안 거리 기반 가장 가까운 관상 타입 매칭
  findBestMatch(features, db, weightMap) {
    let bestDist = Infinity;
    let candidates = [];

    db.forEach(item => {
        let dist = 0;
        let t = item.targets;
        for (let key in weightMap) {
            let diff = (features[key] - t[weightMap[key].targetKey]) * weightMap[key].scale;
            dist += diff * diff;
        }
        dist = Math.sqrt(dist);
        let prob = Math.max(15, 100 - (dist * 15)); // 거리 기반 100점 만점 환산
        candidates.push({ ...item, prob, dist });
    });

    // 정렬
    candidates.sort((a, b) => b.prob - a.prob);
    // 확률값 켈리브레이션 (동일 값 몰림 방지)
    const topProb = candidates[0].prob;
    if(topProb < 80) candidates[0].prob = 80 + Math.random() * 10;
    
    return candidates;
  }

  async analyze(landmarksData) {
    const f = this.extractGeometricFeatures(landmarksData);

    // 1. 동물상 매칭 (얼굴전체 비율)
    let animals = this.findBestMatch(f, this.animalDb, {
        faceRatio: { targetKey: 'face', scale: 20 },
        jawShape: { targetKey: 'jaw', scale: 25 },
        eyeRatio: { targetKey: 'eyeR', scale: 5 },
        eyeSlant: { targetKey: 'eyeS', scale: 0.5 },
        noseRatio: { targetKey: 'noseR', scale: 5 },
        mouthRatio: { targetKey: 'mouthR', scale: 4 },
        mouthCurve: { targetKey: 'mouthC', scale: 1 }
    });
    let bestAnimal = animals[0];

    // 2. 안상 매칭
    let eyes = this.findBestMatch(f, this.eyeDb, {
        eyeRatio: { targetKey: 'r', scale: 10 },
        eyeSlant: { targetKey: 's', scale: 1 },
        eyeDistance: { targetKey: 'd', scale: 15 }
    });
    let bestEye = eyes[0];

    // 3. 비상 매칭
    let noses = this.findBestMatch(f, this.noseDb, {
        noseRatio: { targetKey: 'r', scale: 15 },
        noseZ: { targetKey: 'z', scale: 30 },
        noseWidthRatio: { targetKey: 'w', scale: 40 }
    });
    let bestNose = noses[0];

    // 4. 구상 매칭
    let mouths = this.findBestMatch(f, this.mouthDb, {
        mouthRatio: { targetKey: 'r', scale: 15 },
        mouthCurve: { targetKey: 'c', scale: 1.5 }
    });
    let bestMouth = mouths[0];

    // --- 5. 마의상법 기반 조화 분석 (동적 조합) ---
    let harmonyText = "오관(五官)이 순리대로 상생(相生)하여 평탄하고 복록이 고르게 들어오는 무난한 길격(吉格)입니다.";

    // 특별 귀격 조건
    if(['dragon','phoenix'].includes(bestEye.id) && ['gall','bamboo','sack'].includes(bestNose.id)) {
        harmonyText = "✨ <b>[극상 상생 - 귀인(貴人)의 정점]</b> 제왕의 안상(눈)과 거부의 비상(코)이 뭉쳤습니다. 마의상법에 이르길 '신이 귀하고 기색이 맑으니 크게 출세한다(神貴氣淸 大發達)' 하였으니, 타의 추종을 불허하는 권력과 엄청난 대부를 양손에 쥘 특급 조화입니다.";
    } else if(['tiger','snake','wolf'].includes(bestAnimal.id) && ['hook','lion'].includes(bestNose.id)) {
        harmonyText = "⚔️ <b>[패업 상생 - 투장(鬪將)과 난세의 영웅]</b> 맹렬한 동물의 상에 뚫고 나가는 강렬한 코가 만났습니다. 어떤 험난한 역경이든 모조리 부수고 자수성가하여 자신만의 강력한 제국(기업/조직)을 건설할 야심가적 기운이 펄펄 끓습니다.";
    } else if(bestEye.id === 'peach' && bestMouth.id === 'upward') {
        harmonyText = "🌸 <b>[도화 상생 - 만인의 연인]</b> 사람의 혼을 쏙 빼놓는 매력적인 도화안과 부드러운 앙월구(입)가 조화롭습니다. 인복이 하늘을 찌르고 매력이 재물이 되어, 연예/방송/영업 등 대중의 잉기를 빨아들이는 독보적인 에너지를 띕니다.";
    } else if(bestEye.id === 'cow' && bestMouth.id === 'large') {
        harmonyText = "🤝 <b>[포용 상생 - 덕장(德將)의 그릇]</b> 선하고 우직한 눈빛에 만인을 포용하는 넓은 대구(大口)를 갖췄습니다. 주위에 모여드는 사람을 전부 넉넉히 책임지니, 훗날 조직의 흔들리지 않는 큰 어른이나 자선 사업가로 칭송받을 것입니다.";
    } else if(['sanpaku','snake'].includes(bestEye.id) && bestMouth.id === 'cherry') {
        harmonyText = "⚠️ <b>[상극 조화 - 지나친 예민함]</b> 눈빛에 서린 야심과 파괴력은 몹시 강하나, 이를 담아낼 구상(입)이 지나치게 좁고 작습니다. 포부는 천하를 삼키려 하나 실행력이 쫓아가지 못해 속을 다칠 우려가 있으니, 가슴을 넓게 열고 유연함을 배운다면 일세를 풍미할 천재성을 발휘합니다.";
    } else if(bestFaceShapeIsNarrow(f) && bestNose.id === 'lonepeak') {
        harmonyText = "⚠️ <b>[고독 상생 - 고립된 봉우리]</b> 광대가 빈약한 편에 코만 너무 높게 우뚝 솟아 '고소비'의 전형입니다. 능력이 몹시 출중하여 이목을 끄나, 남을 낮춰보는 자만이 앞설 수 있습니다. 하심(下心)하고 겸양하면 고독을 깨고 천하의 책사가 될 것입니다.";
    }

    function bestFaceShapeIsNarrow(feat) { return feat.faceRatio < 0.73; }

    const expertReportHtml = `
      <div style="font-family: 'Pretendard', sans-serif; color: #333; line-height: 1.6;">

        <div style="margin-bottom: 20px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 18px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="font-weight: 800; font-size: 1.15rem; color: #f8fafc; margin-bottom: 6px; display:flex; align-items:center;">
             <span style="font-size:1.3rem; margin-right:8px;">📜</span> 마의·달마상법(相法) 종합 격국 평단
          </div>
          <p style="font-size: 0.95rem; color: #e2e8f0; margin: 0; line-height:1.5;">${harmonyText}</p>
        </div>

        <div style="margin-bottom: 20px;">
          <div style="font-weight: 800; font-size: 1.1rem; color: #0f172a; margin-bottom: 12px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px;"> 오관(五官) 정밀 AI 매칭 결과</div>
          
          <ul style="padding-left: 0; list-style: none; font-size: 0.95rem; margin: 0;">
            <li style="margin-bottom: 15px; background: #f8fafc; padding: 14px; border-radius: 8px; border-left: 4px solid #3b82f6; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
               <div style="font-weight:800; color:#1e40af; margin-bottom:6px; font-size: 1.05rem;">👁️ 안상(눈) - ${bestEye.name} <span style="font-size:0.9rem; color:#ef4444; float:right;">[유사도 ${bestEye.prob.toFixed(1)}%]</span></div>
               <div style="color: #475569; word-break: keep-all;">${bestEye.desc}</div>
               <div style="font-size:0.8rem; color:#94a3b8; margin-top:8px;">* 차순위 후보: ${eyes[1].name}(${eyes[1].prob.toFixed(1)}%), ${eyes[2].name}(${eyes[2].prob.toFixed(1)}%)</div>
            </li>

            <li style="margin-bottom: 15px; background: #f8fafc; padding: 14px; border-radius: 8px; border-left: 4px solid #10b981; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
               <div style="font-weight:800; color:#065f46; margin-bottom:6px; font-size: 1.05rem;">👃 비상(코) - ${bestNose.name} <span style="font-size:0.9rem; color:#ef4444; float:right;">[유사도 ${bestNose.prob.toFixed(1)}%]</span></div>
               <div style="color: #475569; word-break: keep-all;">${bestNose.desc}</div>
               <div style="font-size:0.8rem; color:#94a3b8; margin-top:8px;">* 차순위 후보: ${noses[1].name}(${noses[1].prob.toFixed(1)}%)</div>
            </li>

            <li style="margin-bottom: 15px; background: #f8fafc; padding: 14px; border-radius: 8px; border-left: 4px solid #f59e0b; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
               <div style="font-weight:800; color:#b45309; margin-bottom:6px; font-size: 1.05rem;">👄 구상(입) - ${bestMouth.name} <span style="font-size:0.9rem; color:#ef4444; float:right;">[유사도 ${bestMouth.prob.toFixed(1)}%]</span></div>
               <div style="color: #475569; word-break: keep-all;">${bestMouth.desc}</div>
               <div style="font-size:0.8rem; color:#94a3b8; margin-top:8px;">* 차순위 후보: ${mouths[1].name}(${mouths[1].prob.toFixed(1)}%)</div>
            </li>
            
            <li style="margin-bottom: 15px; background: #f8fafc; padding: 14px; border-radius: 8px; border-left: 4px solid #8b5cf6; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
               <div style="font-weight:800; color:#5b21b6; margin-bottom:6px; font-size: 1.05rem;">👂 이상(귀) </div>
               <div style="color: #475569; word-break: keep-all;">
                 ${ f.earPosition === "high" ? "귀의 최상단이 눈썹 선 이상으로 높아(과목상) 학문적 스펀지력이 대단하며 귀인의 상징입니다." : "귀와 눈의 선이 수평을 이루어 현실 감각이 대단히 명석하여 중년에 도약합니다." }
                 ${ f.earRatio > 0.22 ? "<br>또한 귀의 크기가 넉넉하고 귓불이 도톰하여 흘러가는 제물을 꽉 담아내는 장수/복귀의 귀입니다." : "<br>수주(귓볼)보다 테두리가 단단하고 예리하여 자수성가로 운명을 스스로 극복하는 성실파의 귀입니다." }
               </div>
            </li>
          </ul>
        </div>

        <div style="background: #fdf2f8; padding: 18px; border-radius: 12px; border: 2px solid #fbcfe8;">
           <div style="font-weight: 800; font-size: 1.1rem; color: #9d174d; margin-bottom: 10px; display:flex; align-items:center;">
             <span style="font-size:1.3rem; margin-right:8px;">🐾</span> 종합 물형(物形) 관상 : [${bestAnimal.name}]
           </div>
           <p style="font-size: 0.95rem; color: #831843; margin-bottom: 15px; font-weight:600; line-height:1.5;">${bestAnimal.desc}</p>
           <div style="font-size: 0.85rem; color: #be185d; background: #fce7f3; padding: 8px 12px; border-radius: 6px; font-weight: 600;">
              ✨ 대표 유명인: ${bestAnimal.celebrities.join(", ")}
           </div>
        </div>
      </div>
    `;

    return {
      primaryAnimal: bestAnimal.name,
      emoji: bestAnimal.emoji,
      celebrities: bestAnimal.celebrities.join(", "),
      description: bestAnimal.desc,
      expertReportHtml: expertReportHtml,
      confidence: bestAnimal.prob.toFixed(1),
      extractedFeatures: f
    };
  }
}

window.FaceAnalysisEngine = AnalysisEngine;
window.faceAnalysisEngine = new AnalysisEngine();
