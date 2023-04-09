import Image from "next/image";
import "./globals.css";

import Logo from "public/WotpatateLogot.png";
import LogoText from "public/WotpatateText.png";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body className="flex h-screen flex-col bg-red-600">
        <header>
          <Link
            href="/"
            className="flex flex-row items-center justify-center gap-3 p-5"
          >
            <Image alt="logo" src={Logo} width={80} height={80} />
            <Image alt="logo" src={LogoText} height={50} />
          </Link>
        </header>
        {children}
      </body>
    </html>
  );
}
