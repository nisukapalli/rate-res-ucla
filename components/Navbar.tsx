import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-6 py-5 bg-blue-600">
      <Link href="/" className="text-white font-black text-3xl px-12">RateResUCLA</Link>
      <div className="flex items-center gap-4">
        <Link href="/housing" className="text-white font-semibold hover:underline px-3 py-2">
          All Housing
        </Link>
        <Link href="/review" className="text-white font-semibold hover:underline px-3 py-2">
          Write a Review
        </Link>
        <Link href="/login" className="text-white font-semibold hover:underline px-3 py-2">
          Log In
        </Link>
        <Link href="/signup" className="text-white font-semibold hover:underline px-3 py-2">
          Sign Up
        </Link>
      </div>
    </nav>
  );
}