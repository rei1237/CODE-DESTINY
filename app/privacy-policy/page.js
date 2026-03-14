export const metadata = {
  title: "Privacy Policy | 개인정보처리방침",
  description:
    "Code Destiny 개인정보처리방침 페이지입니다. 쿠키 사용, 광고 제공, 개인정보 처리 목적과 이용자 권리를 안내합니다.",
  keywords: ["Privacy Policy", "개인정보처리방침", "쿠키", "애드센스", "Google AdSense"],
  alternates: {
    canonical: "/privacy-policy",
  },
};

const sectionStyle = {
  background: "rgba(15, 23, 42, 0.8)",
  border: "1px solid rgba(148, 163, 184, 0.25)",
  borderRadius: "14px",
  padding: "18px",
};

export default function PrivacyPolicyPage() {
  return (
    <main style={{ maxWidth: "920px", margin: "0 auto", padding: "28px 16px 42px", color: "#e2e8f0" }}>
      <h1 style={{ fontSize: "32px", fontWeight: 800, marginBottom: "8px" }}>개인정보처리방침 (Privacy Policy)</h1>
      <p style={{ opacity: 0.86, lineHeight: 1.7, marginBottom: "20px" }}>
        시행일: 2026-03-14 / Effective Date: 2026-03-14
      </p>

      <section style={{ ...sectionStyle, marginBottom: "14px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>1. 개인정보 처리 목적 / Purpose of Processing</h2>
        <p style={{ lineHeight: 1.75 }}>
          Code Destiny는 사주/운세 결과 제공, 서비스 품질 향상, 부정 이용 방지, 고객 문의 대응을 위하여 최소한의 개인정보를 처리합니다.
          We process limited personal information to provide fortune analysis, improve service quality, prevent abuse, and respond to support requests.
        </p>
      </section>

      <section style={{ ...sectionStyle, marginBottom: "14px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>2. 수집 항목 / Data Categories</h2>
        <p style={{ lineHeight: 1.75 }}>
          입력 정보(예: 생년월일, 출생시간, 성별), 접속 로그, 기기/브라우저 정보, 쿠키 식별자 등을 처리할 수 있습니다.
          We may process input data (birth date/time, gender), access logs, device/browser metadata, and cookie identifiers.
        </p>
      </section>

      <section style={{ ...sectionStyle, marginBottom: "14px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>3. 쿠키 및 광고 고지 / Cookies and Advertising</h2>
        <p style={{ lineHeight: 1.75 }}>
          본 서비스는 쿠키를 사용하여 사용자 환경을 개선하고, Google AdSense를 포함한 제3자 광고 파트너가 쿠키를 통해 맞춤형 또는
          비맞춤형 광고를 제공할 수 있습니다. 사용자는 브라우저 설정을 통해 쿠키 저장을 거부하거나 삭제할 수 있습니다.
          This service uses cookies, and third-party vendors including Google may serve personalized or non-personalized ads using cookies.
          You may disable or delete cookies in your browser settings.
        </p>
      </section>

      <section style={{ ...sectionStyle, marginBottom: "14px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>4. 보유 및 파기 / Retention and Deletion</h2>
        <p style={{ lineHeight: 1.75 }}>
          개인정보는 수집 목적 달성 시 또는 관련 법령에서 정한 기간이 경과하면 지체 없이 파기합니다.
          Personal data is deleted without undue delay when processing purposes are fulfilled or statutory retention periods expire.
        </p>
      </section>

      <section style={{ ...sectionStyle, marginBottom: "14px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>5. 이용자 권리 / Data Subject Rights</h2>
        <p style={{ lineHeight: 1.75 }}>
          이용자는 본인 정보에 대한 열람, 정정, 삭제, 처리정지 요청권을 가질 수 있으며 관련 요청은 아래 문의처로 접수할 수 있습니다.
          You may request access, correction, deletion, or restriction of your data through the contact channel below.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>6. 문의처 / Contact</h2>
        <p style={{ lineHeight: 1.75 }}>
          이메일: seongbae555@gmail.com
          <br />
          For privacy inquiries: seongbae555@gmail.com
        </p>
      </section>
    </main>
  );
}
