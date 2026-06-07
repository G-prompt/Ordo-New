import React from 'react';

export default function Privacy() {
    return (
        <div className="mx-auto max-w-4xl px-6 py-12 animate-fade-in">
            <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
                <h2 className="text-3xl font-semibold text-slate-900">Privacy Policy</h2>
                <p className="mt-4 text-slate-600">ORDO is a demonstration prototype. It stores minimal demo auth data and project metadata for the current session.</p>
                <section className="mt-8 space-y-5 text-slate-600">
                    <div>
                        <h3 className="text-xl font-semibold text-slate-900">What we store</h3>
                        <p className="mt-2">This demo app stores user accounts, project metadata, and sample portfolio entries in a local JSON store.</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-slate-900">No sensitive storage</h3>
                        <p className="mt-2">Do not use this prototype for any sensitive or production data. It is not designed for secure storage.</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-slate-900">Contact</h3>
                        <p className="mt-2">For questions about this prototype, use the Contact page or open the project files directly.</p>
                    </div>
                </section>
            </div>
        </div>
    );
}
