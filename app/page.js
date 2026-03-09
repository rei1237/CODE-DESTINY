export default function Home() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "24px" }}>
      <section style={{ maxWidth: "720px", textAlign: "center", lineHeight: 1.6 }}>
        <h1 style={{ marginBottom: "12px" }}>Code Destiny</h1>
        <p style={{ marginBottom: "16px" }}>
          Next.js build requires an <code>app</code> or <code>pages</code> directory.
          This fallback route restores build compatibility for Cloudflare/OpenNext.
        </p>
        <p style={{ opacity: 0.8 }}>
          Main static experience is served from existing project assets.
        </p>
      </section>
    </main>
  );
}
