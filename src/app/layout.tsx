import type { Metadata } from "next";
import Mainheader from "./components/Mainheader";
import Mainfooter from "./components/Mainfooter";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Mainheader />
        {children}
        <Mainfooter />
      </body>
    </html>
  );
}
