interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div className="flex min-h-screen w-full flex-col items-center gap-y-10 p-6">
      {children}
    </div>
  );
};

export default ProtectedLayout;
