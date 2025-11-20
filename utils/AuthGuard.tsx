"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // router.push("/admin/login"); // Redirect to login
      console.log("redirected");
      setIsChecking(false)
    } else {
      setIsChecking(false);
    }
  }, [router]);

  if (isChecking) {
    return (
      <div className="h-screen flex items-center justify-center text-slate-900 dark:text-slate-300">
        Checking authentication...
      </div>
    );
  }

  return <>{children}</>;
}
