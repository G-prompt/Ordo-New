import React, { useState } from 'react';

const navItems = [
    { label: 'About', view: 'about' },
    { label: 'Features', view: 'features' },
    { label: 'Guide', view: 'guide' },
    { label: 'Pricing', view: 'pricing' },
    { label: 'Docs', view: 'docs' },
    { label: 'Contact', view: 'contact' },
];

export default function Header({ setView, navigateWithLoader, user, logout }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const handleNav = (viewName) => {
        setMenuOpen(false);
        navigateWithLoader(viewName);
    };

    return (
        <header className="w-full border-b border-slate-100 bg-white">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
                <div className="flex items-center gap-3">
                    <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-accent-700 p-1 shadow-lg shadow-purple-500/20">
                        <img src="/logo.svg" alt="ORDO" className="h-8 w-8 rounded-full bg-white p-1 transition-transform duration-300 hover:scale-105" />
                        <span className="absolute inset-0 rounded-full border border-white/20" />
                    </div>
                    <button onClick={() => handleNav('landing')} className="text-lg font-semibold text-slate-900">ORDO</button>
                    <nav className="ml-6 hidden gap-3 text-sm md:flex">
                        {navItems.map((item) => (
                            <button key={item.view} onClick={() => handleNav(item.view)} className="text-slate-600 hover:text-slate-900">
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setMenuOpen((open) => !open)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 md:hidden"
                        aria-label="Toggle navigation"
                    >
                        {menuOpen ? '✕' : '☰'}
                    </button>
                    {user ? (
                        <>
                            <button onClick={() => navigateWithLoader('dashboard')} className="hidden rounded-md px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 md:inline-flex">App</button>
                            <button onClick={logout} className="hidden rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white md:inline-flex">Sign out</button>
                        </>
                    ) : (
                        <>
                            <button onClick={() => navigateWithLoader('login')} className="hidden rounded-md px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 md:inline-flex">Sign in</button>
                            <button onClick={() => navigateWithLoader('signup')} className="hidden rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white md:inline-flex">Get started</button>
                        </>
                    )}
                </div>
            </div>
            {menuOpen && (
                <div className="border-t border-slate-100 bg-white px-6 py-4 md:hidden">
                    <div className="flex flex-col gap-3">
                        {navItems.map((item) => (
                            <button key={item.view} onClick={() => handleNav(item.view)} className="w-full rounded-2xl px-4 py-3 text-left text-slate-700 hover:bg-slate-50">
                                {item.label}
                            </button>
                        ))}
                        {user ? (
                            <>
                                <button onClick={() => { setMenuOpen(false); navigateWithLoader('dashboard'); }} className="w-full rounded-2xl px-4 py-3 text-left text-slate-700 hover:bg-slate-50">App</button>
                                <button onClick={() => { setMenuOpen(false); logout(); }} className="w-full rounded-2xl bg-brand-600 px-4 py-3 text-left text-white">Sign out</button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => { setMenuOpen(false); navigateWithLoader('login'); }} className="w-full rounded-2xl px-4 py-3 text-left text-slate-700 hover:bg-slate-50">Sign in</button>
                                <button onClick={() => { setMenuOpen(false); navigateWithLoader('signup'); }} className="w-full rounded-2xl bg-brand-600 px-4 py-3 text-left text-white">Get started</button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
