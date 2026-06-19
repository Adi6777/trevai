import "./globals.css";

export const metadata = {
  title: "Trevai",
  description: "AI travel planning workspace"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
