import "./globals.css";

export const metadata = {
  title: "ResumeAI - Smart Interview Assistant",
  description: "AI-powered resume analysis and interview preparation",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
