import Link from 'next/link';
import { AuthBackground } from '@/components/auth/AuthBackground';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen h-screen max-h-screen w-full flex flex-col justify-between overflow-hidden bg-slate-50 text-slate-800 antialiased selection:bg-blue-500 selection:text-white">
      {/* Background Graphic Elements */}
      <AuthBackground />

      {/* Top Header */}
      <header className="relative z-10 w-full px-4 sm:px-8 py-3 sm:py-4 flex items-center justify-between border-b border-slate-200/50 backdrop-blur-xs">
        <Link 
          href="/" 
          className="flex items-center gap-2 group transition-transform active:scale-[0.98]"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-900 text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-sm group-hover:bg-blue-800 transition-colors">
            FDA
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-slate-900 leading-tight">
              FDA<span className="text-blue-900">Verify</span>
            </span>
            <span className="text-[10px] text-slate-600 font-medium tracking-wide">
              Product Verification Portal
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-1.5 text-[11px] text-emerald-800 font-medium bg-emerald-50 border border-emerald-200/60 px-2.5 py-1 rounded-full shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Official Verification Network
          </div>
          <Link
            href="/"
            className="text-xs font-medium text-slate-600 hover:text-blue-900 transition-colors flex items-center gap-1 group"
          >
            <span>Back to site</span>
            <svg
              className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </header>

      {/* Main Single-Screen Content Slot */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-2 sm:py-3 overflow-y-auto sm:overflow-hidden">
        <div className="w-full max-w-lg mx-auto">
          {children}
        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="relative z-10 w-full px-4 sm:px-8 py-2.5 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-600 border-t border-slate-200/50 backdrop-blur-xs gap-1">
        <div className="flex items-center gap-2">
          <span>&copy; {new Date().getFullYear()} U.S. Food and Drug Administration.</span>
          <span className="hidden sm:inline text-slate-300">|</span>
          <span className="hidden sm:inline text-slate-600">All rights reserved.</span>
        </div>
        <div className="flex items-center gap-4 text-slate-600">
          <span className="flex items-center gap-1">
            <svg className="w-3 h-3 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            256-Bit SSL Encrypted
          </span>
          <Link href="/privacy" className="hover:text-blue-900 transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-blue-900 transition-colors">
            Terms
          </Link>
        </div>
      </footer>
    </div>
  );
}