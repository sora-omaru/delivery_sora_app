import Header from "@/components/header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className=" max-w-screen-xl mx-auto px-10 pt-16">
        {children}
      </main>
    </>
  );
}
