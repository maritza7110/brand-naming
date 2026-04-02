interface AppLayoutProps {
  left: React.ReactNode;
  right: React.ReactNode;
}

export function AppLayout({ left, right }: AppLayoutProps) {
  return (
    <div className="flex flex-col lg:grid lg:grid-cols-[7fr_3fr] min-h-screen">
      {left}
      {right}
    </div>
  );
}
