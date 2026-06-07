import React from 'react';

export default function Features() {
    return (
        <div className="mx-auto max-w-6xl px-6 py-12">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Features</p>
                        <h2 className="mt-4 text-3xl font-semibold text-slate-900">Everything ORDO does to help you build career-ready work.</h2>
                        <p className="mt-3 text-slate-600">From verified project submissions to structured roadmaps, ORDO is designed to move learners into meaningful work faster.</p>
                    </div>
                    <div className="rounded-3xl bg-gradient-to-r from-brand-600 to-accent-700 px-6 py-5 text-white shadow-xl">
                        <p className="text-sm uppercase tracking-[0.25em] text-brand-100">Trusted workflow</p>
                        <p className="mt-3 text-2xl font-semibold">Verified. Visible. Valuable.</p>
                    </div>
                </div>

                <div className="mt-10 grid gap-6 md:grid-cols-2">
                    {[
                        { title: 'Verified portfolio building', description: 'Submit real projects, track reviews, and make your work easy to evaluate.' },
                        { title: 'Structured career roadmap', description: 'Follow a staged learning path with product-led milestones and mentor feedback.' },
                        { title: 'Opportunity discovery', description: 'Stay connected to early-career roles, internships, and networked referrals.' },
                        { title: 'Mentor and verification support', description: 'Get project validation and guidance from mentors or AI-backed review flows.' },
                    ].map((item) => (
                        <div key={item.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                            <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
                            <p className="mt-3 text-slate-600">{item.description}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-accent-700 p-8 text-white shadow-2xl">
                        <h3 className="text-2xl font-semibold">Build with clarity, not confusion.</h3>
                        <p className="mt-4 text-slate-100">ORDO makes each step visible: talent profile, verified work, roadmap progress, and the next opportunity. It is a unified experience for learners, freelancers, and early-career professionals.</p>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                        <h3 className="text-xl font-semibold text-slate-900">What makes ORDO different</h3>
                        <ul className="mt-5 space-y-3 text-slate-600">
                            <li>• Projects that show impact, not just completion.</li>
                            <li>• Skill-based journey aligned to real product roles.</li>
                            <li>• Built-in verification, mentorship, and career signals.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
