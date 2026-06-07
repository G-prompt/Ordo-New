import React from 'react';

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-6 py-12">
            <div className="max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-2xl shadow-slate-200/40">
                <p className="text-sm uppercase tracking-[0.4em] text-brand-600">404</p>
                <h1 className="mt-4 text-4xl font-semibold text-slate-900">Page not found</h1>
                <p className="mt-4 text-slate-600">The page you were looking for does not exist. Use the buttons below to return to ORDO or explore the main site.</p>
                <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                    <button type="button" onClick={() => window.location.reload()} className="rounded-full bg-brand-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-700">Refresh</button>
                    <button type="button" onClick={() => window.location.href = '/'} className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">Home</button>
                </div>
            </div>
        </div>
    );
}
