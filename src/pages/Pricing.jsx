import React from 'react';

export default function Pricing() {
    return (
        <div className="mx-auto max-w-4xl px-6 py-12">
            <h2 className="text-3xl font-semibold text-slate-900">Pricing</h2>
            <p className="mt-4 text-slate-700">ORDO prototype pricing plans (example):</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
                    <h3 className="font-semibold">Free</h3>
                    <p className="mt-3 text-slate-600">Basic portfolio and roadmap</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
                    <h3 className="font-semibold">Pro</h3>
                    <p className="mt-3 text-slate-600">Verified assessments and opportunity boosts</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
                    <h3 className="font-semibold">Enterprise</h3>
                    <p className="mt-3 text-slate-600">Team onboarding and program management</p>
                </div>
            </div>
        </div>
    );
}
