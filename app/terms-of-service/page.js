export const metadata = {
  title: "Terms of Service | 이용약관",
  description:
    "Code Destiny 이용약관 페이지입니다. 서비스 이용 규칙, 면책, 책임 제한 및 분쟁 처리 원칙을 안내합니다.",
  keywords: ["Terms of Service", "이용약관", "서비스 책임 제한", "면책"],
  alternates: {
    canonical: "/terms-of-service",
  },
};

const sectionStyle = {
  background: "rgba(15, 23, 42, 0.8)",
  border: "1px solid rgba(148, 163, 184, 0.25)",
  borderRadius: "14px",
  padding: "18px",
};

export default function TermsOfServicePage() {
  return (
    <main style={{ maxWidth: "920px", margin: "0 auto", padding: "28px 16px 42px", color: "#e2e8f0" }}>
      <h1 style={{ fontSize: "32px", fontWeight: 800, marginBottom: "8px" }}>이용약관 (Terms of Service)</h1>
      <p style={{ opacity: 0.86, lineHeight: 1.7, marginBottom: "20px" }}>
        시행일: 2026-03-14 / Effective Date: 2026-03-14
      </p>

      <section style={{ ...sectionStyle, marginBottom: "14px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>1. 약관의 목적 / Purpose</h2>
        <p style={{ lineHeight: 1.75 }}>
          본 약관은 Code Destiny가 제공하는 온라인 서비스의 이용 조건과 절차, 당사자 간 권리·의무 및 책임사항을 규정합니다.
          These terms govern access to and use of Code Destiny services, including rights, obligations, and liabilities.
        </p>
      </section>

      <section style={{ ...sectionStyle, marginBottom: "14px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>2. 이용자 의무 / User Obligations</h2>
        <p style={{ lineHeight: 1.75 }}>
          이용자는 관계 법령 및 본 약관을 준수해야 하며, 서비스 운영을 방해하거나 타인의 권리를 침해하는 행위를 해서는 안 됩니다.
          Users must comply with applicable laws and shall not interfere with operations or infringe rights of others.
        </p>
      </section>

      <section style={{ ...sectionStyle, marginBottom: "14px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>3. 서비스 성격 및 한계 / Nature of Service</h2>
        <p style={{ lineHeight: 1.75 }}>
          본 서비스의 운세/해석 정보는 참고용 콘텐츠이며 법률, 의료, 투자 등 전문 자문을 대체하지 않습니다.
          Fortune content is provided for informational and entertainment purposes only and does not replace professional advice.
        </p>
      </section>

      <section style={{ ...sectionStyle, marginBottom: "14px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>4. 면책 조항 / Disclaimer</h2>
        <p style={{ lineHeight: 1.75 }}>
          회사는 천재지변, 네트워크 장애, 제3자 서비스 중단 등 불가항력 사유로 인한 서비스 중단에 대해 책임을 지지 않습니다.
          We are not liable for interruptions caused by force majeure events, network failures, or third-party service disruptions.
        </p>
      </section>

      <section style={{ ...sectionStyle, marginBottom: "14px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>5. 책임의 제한 / Limitation of Liability</h2>
        <p style={{ lineHeight: 1.75 }}>
          회사의 손해배상 책임은 관련 법령이 허용하는 범위 내에서 제한되며, 이용자의 귀책사유로 발생한 손해에 대해서는 책임을 지지 않습니다.
          Liability is limited to the extent permitted by law, and we are not responsible for damages caused by user fault.
        </p>
      </section>

      <section style={sectionStyle}>
        <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "8px" }}>6. 문의 / Contact</h2>
        <p style={{ lineHeight: 1.75 }}>
          약관 문의: seongbae555@gmail.com
          <br />
          Terms inquiries: seongbae555@gmail.com
        </p>
      </section>
    </main>
  );
}
