import React from 'react';

export default function Terms() {
    return (
        <div className="mx-auto max-w-4xl px-6 py-12 animate-fade-in">
            <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
                <h2 className="text-3xl font-semibold text-slate-900">Terms of Service</h2>
                <p className="mt-4 text-slate-600">This prototype is provided for demonstration purposes only. Use the platform to test workflows and explore product concepts, not for real legal or financial commitments.</p>
                <section className="mt-8 space-y-5 text-slate-600">
                    <div>
                        <h3 className="text-xl font-semibold text-slate-900">Acceptance</h3>
                        <p className="mt-2">By using the ORDO prototype, you agree that it is a concept application and may not reflect final production behavior.</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-slate-900">Data and privacy</h3>
                        <p className="mt-2">The app stores demo data locally and in a simple file store. Do not enter sensitive personal or production content in this version.</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-slate-900">No warranty</h3>
                        <p className="mt-2">ORDO is offered "as-is" for prototyping only. No warranties or guarantees are provided for outcomes.</p>
                    </div>
                </section>
            </div>
        </div>
    );
}
