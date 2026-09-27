export default function FilialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen bg-black text-white">
      <main className="h-full w-full">
        {children}
      </main>
    </div>
  );
}
