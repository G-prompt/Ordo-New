import React from 'react';

export default function Footer({ navigateWithLoader }) {
    return (
        <footer className="w-full border-t border-slate-100 bg-white">
            <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-slate-600">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <div className="flex items-center gap-3">
                        <img src="/logo.svg" alt="ORDO" className="h-8 w-8" />
                        <span className="font-semibold text-slate-900">ORDO</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <span>© {new Date().getFullYear()} ORDO</span>
                        <button type="button" onClick={() => navigateWithLoader?.('landing')} className="text-brand-600 hover:underline">Home</button>
                        <button type="button" onClick={() => navigateWithLoader?.('features')} className="text-slate-500 hover:underline">Features</button>
                        <button type="button" onClick={() => navigateWithLoader?.('guide')} className="text-slate-500 hover:underline">Guide</button>
                        <button type="button" onClick={() => navigateWithLoader?.('contact')} className="text-slate-500 hover:underline">Contact</button>
                        <button type="button" onClick={() => navigateWithLoader?.('terms')} className="text-slate-500 hover:underline">Terms</button>
                        <button type="button" onClick={() => navigateWithLoader?.('privacy')} className="text-slate-500 hover:underline">Privacy</button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
