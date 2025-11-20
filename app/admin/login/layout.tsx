export default function LoginLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    // Return children directly (no navbar/sidebar)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        {children}
      </div>
    );
  }
  