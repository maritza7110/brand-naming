interface AppLayoutProps {
  left: React.ReactNode;
  right: React.ReactNode;
}

export function AppLayout({ left, right }: AppLayoutProps) {
  return (
    <div className="grid grid-cols-[7fr_3fr] h-screen min-w-[1024px]">
      {left}
      {right}
    </div>
  );
}
