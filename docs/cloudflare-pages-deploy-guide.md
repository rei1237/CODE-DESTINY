# Cloudflare Pages 배포 가이드

## 빌드 및 배포 전 필수 확인사항

- **package.json**의 build 스크립트는 이미 Cloudflare 어댑터를 포함하도록 통합되어 있습니다:
  
  "build": "next build && npx @opennextjs/cloudflare build"

- **next.config.mjs**의 outputFileTracingRoot 설정 경고도 해결되어 있습니다.

## Cloudflare Pages 대시보드 설정

1. **프로젝트 빌드 후**
2. Cloudflare Pages 대시보드에서 해당 프로젝트의 **Build output directory**(빌드 결과물 경로)를 반드시 아래와 같이 지정하세요:

   
   **.open-next/assets**

   (마침표 포함, 전체 경로: `.open-next/assets`)

3. 이 경로를 잘못 지정하면 사이트가 정상적으로 표시되지 않습니다.

---

- 빌드 후 실제 결과물은 `.open-next/assets` 폴더에 생성됩니다.
- Cloudflare Pages의 output directory가 이 경로와 일치해야만 사이트가 정상적으로 배포됩니다.

> ⚠️ **반드시 .open-next/assets로 지정해야 합니다!**

---

### 추가 참고
- 기타 wrangler, 환경 변수 등은 기존 설정을 그대로 사용하면 됩니다.
- 문제가 발생하면 빌드 로그와 output directory 경로를 다시 확인하세요.
