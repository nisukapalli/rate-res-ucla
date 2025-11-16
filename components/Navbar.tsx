"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState<{ id: number; username: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/");
    router.refresh();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-5 bg-blue-600">
      <Link href="/" className="text-white font-black text-3xl px-12">
        RateResUCLA
      </Link>
      <div className="flex items-center gap-4">
        <Link
          href="/housing"
          className="text-white font-semibold hover:underline px-3 py-2"
        >
          All Housing
        </Link>
        <Link
          href="/review"
          className="text-white font-semibold hover:underline px-3 py-2"
        >
          Add a Review
        </Link>
        {!loading && (
          <>
            {user ? (
              <>
                <span className="text-white font-semibold px-3 py-2">
                  {user.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-white font-semibold hover:underline px-3 py-2"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-white font-semibold hover:underline px-3 py-2"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="text-white font-semibold hover:underline px-3 py-2"
                >
                  Sign Up
                </Link>
              </>
            )}
          </>
        )}
      </div>
    </nav>
  );
}