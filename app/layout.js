import "../styles/globals.css";

export const metadata = {
  title: "Code Destiny",
  description: "Code Destiny web app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body>
        {children}
      </body>
    </html>
  );
}
