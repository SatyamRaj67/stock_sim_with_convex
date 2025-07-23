const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-900">
      {children}
    </div>
  );
};

export default AuthLayout;
