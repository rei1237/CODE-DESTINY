export const metadata = {
  title: "Contact Us | 문의하기",
  description: "Code Destiny 문의 페이지입니다. 이메일 및 문의 폼으로 서비스 관련 문의를 접수할 수 있습니다.",
  keywords: ["Contact Us", "문의하기", "고객지원", "Code Destiny 문의"],
  alternates: {
    canonical: "/contact-us",
  },
};

const cardStyle = {
  background: "rgba(15, 23, 42, 0.8)",
  border: "1px solid rgba(148, 163, 184, 0.25)",
  borderRadius: "14px",
  padding: "18px",
};

const inputStyle = {
  width: "100%",
  borderRadius: "10px",
  border: "1px solid rgba(148, 163, 184, 0.38)",
  background: "rgba(2, 6, 23, 0.66)",
  color: "#e2e8f0",
  padding: "10px 12px",
};

export default function ContactUsPage() {
  return (
    <main style={{ maxWidth: "920px", margin: "0 auto", padding: "28px 16px 42px", color: "#e2e8f0" }}>
      <h1 style={{ fontSize: "32px", fontWeight: 800, marginBottom: "8px" }}>문의하기 (Contact Us)</h1>
      <p style={{ opacity: 0.86, lineHeight: 1.7, marginBottom: "20px" }}>
        서비스 제휴, 오류 신고, 개인정보 및 약관 관련 문의를 아래 채널로 보내주세요.
      </p>

      <section style={{ ...cardStyle, marginBottom: "14px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "10px" }}>이메일 문의 / Email Contact</h2>
        <p style={{ lineHeight: 1.75, marginBottom: "8px" }}>
          운영 이메일: <a href="mailto:seongbae555@gmail.com" style={{ color: "#93c5fd", textDecoration: "underline" }}>seongbae555@gmail.com</a>
        </p>
        <p style={{ lineHeight: 1.75 }}>
          평균 회신 시간: 영업일 기준 1~3일 / Typical response time: 1-3 business days.
        </p>
      </section>

      <section style={cardStyle}>
        <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "10px" }}>간단 문의 폼 / Quick Contact Form</h2>
        <form
          action="mailto:seongbae555@gmail.com"
          method="post"
          encType="text/plain"
          style={{ display: "grid", gap: "10px" }}
        >
          <label>
            <span style={{ display: "block", marginBottom: "6px", fontSize: "14px" }}>이름 / Name</span>
            <input type="text" name="name" style={inputStyle} required />
          </label>
          <label>
            <span style={{ display: "block", marginBottom: "6px", fontSize: "14px" }}>이메일 / Email</span>
            <input type="email" name="email" style={inputStyle} required />
          </label>
          <label>
            <span style={{ display: "block", marginBottom: "6px", fontSize: "14px" }}>문의 내용 / Message</span>
            <textarea name="message" rows={6} style={inputStyle} required />
          </label>
          <button
            type="submit"
            style={{
              marginTop: "6px",
              borderRadius: "10px",
              border: "1px solid rgba(96, 165, 250, 0.45)",
              background: "linear-gradient(90deg, rgba(30, 64, 175, 0.9), rgba(37, 99, 235, 0.92))",
              color: "#eff6ff",
              padding: "10px 12px",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            메일 앱으로 보내기 / Send via Email App
          </button>
        </form>
      </section>
    </main>
  );
}
