'use client';

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
  id: number;
  username: string;
  email: string;
  class: number;
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkAuth();
  }, [pathname]); // Re-check auth when route changes

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        cache: 'no-store',
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setDropdownOpen(false);
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-5 bg-blue-600">
      <Link href="/" className="text-white font-black text-3xl px-12">RateResUCLA</Link>
      <div className="flex items-center gap-4">
        <Link href="/housing" className="text-white font-semibold hover:underline px-3 py-2">
          All Housing
        </Link>
        <Link href="/review" className="text-white font-semibold hover:underline px-3 py-2">
          Add a Review
        </Link>
        
        {!loading && (
          <>
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="text-white font-semibold hover:bg-blue-700 px-4 py-2 rounded-lg transition flex items-center gap-2"
                >
                  Account
                  <svg 
                    className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-900">{user.username}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      <p className="text-xs text-gray-500">Class of {user.class}</p>
                    </div>
                    
                    <Link
                      href={`/users/${user.id}/reviews`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      My Reviews
                    </Link>
                    
                    <Link
                      href="/review"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Write a Review
                    </Link>
                    
                    <div className="border-t border-gray-200 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
        <Link href="/login" className="text-white font-semibold hover:underline px-3 py-2">
          Log In
        </Link>
        <Link href="/signup" className="text-white font-semibold hover:underline px-3 py-2">
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