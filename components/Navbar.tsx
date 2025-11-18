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

interface Building {
  id: number;
  name: string;
  address: string;
  type: string;
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkAuth();
    fetchBuildings();
  }, [pathname]); // Re-check auth when route changes

  useEffect(() => {
    // Close dropdowns when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchBuildings = async () => {
    try {
      const response = await fetch('/api/buildings');
      if (response.ok) {
        const data = await response.json();
        setBuildings(data);
      }
    } catch (error) {
      console.error('Failed to fetch buildings:', error);
    }
  };

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

  const handleBuildingClick = (buildingName: string) => {
    const slug = buildingName.replace(/\s+/g, '_');
    setSearchQuery('');
    setShowSearchResults(false);
    router.push(`/housing/${slug}`);
  };

  const filteredBuildings = buildings.filter(building =>
    building.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5); // Show max 5 results

  const showSearch = pathname !== '/housing';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-6 py-5 bg-blue-600">
      <Link href="/" className="text-white font-black text-3xl px-12">RateResUCLA</Link>
      
      {showSearch && (
        <div className="flex-1 max-w-md mx-8" ref={searchRef}>
          <div className="relative">
            <input
              type="text"
              placeholder="Search for a building..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              className="w-full px-4 py-2 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white border-2 border-transparent"
            />
            {showSearchResults && searchQuery && (
              <div className="absolute top-full mt-1 w-full bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
                {filteredBuildings.length > 0 ? (
                  filteredBuildings.map((building) => (
                    <button
                      key={building.id}
                      onClick={() => handleBuildingClick(building.name)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 border-b border-gray-200 last:border-b-0"
                    >
                      <div className="font-semibold text-gray-900">{building.name}</div>
                      <div className="text-sm text-gray-600">{building.address}</div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-gray-500 text-sm">
                    No buildings found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      
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
                      href={`/users/${user.id}/settings`}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Settings
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