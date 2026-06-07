import React from 'react';

export default function Guide() {
    return (
        <div className="mx-auto max-w-5xl px-6 py-12">
            <div className="rounded-[2rem] border border-brand-200 bg-white p-10 shadow-2xl shadow-brand-500/10">
                <div className="mb-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                    <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-brand-600">ORDO Guide</p>
                        <h1 className="mt-4 text-4xl font-semibold text-slate-900">Your onboarding guide for ORDO</h1>
                        <p className="mt-4 text-lg leading-8 text-slate-600">
                            Learn how ORDO brings verified project work, career roadmaps, and opportunity flow together so you can move from training to hire-ready impact.
                        </p>
                    </div>
                    <div className="rounded-3xl border border-brand-100 bg-brand-50 p-6">
                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-700">What this guide covers</p>
                        <ul className="mt-4 space-y-3 text-slate-700">
                            <li>Why ORDO exists and who it helps</li>
                            <li>How to use the dashboard, portfolio, and verification tools</li>
                            <li>How ORDO solves onboarding friction for career builders</li>
                            <li>Where to find help and next steps</li>
                        </ul>
                    </div>
                </div>

                <section className="space-y-6">
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                        <h2 className="text-2xl font-semibold text-slate-900">Why ORDO exists</h2>
                        <p className="mt-3 text-slate-600 leading-7">
                            ORDO is designed to bridge the gap between certification and career-ready work. It helps learners, early career builders, and career switchers move from isolated training to verified projects, mentor-reviewed outcomes, and a curated opportunity feed.
                        </p>
                        <div className="mt-5 grid gap-4 sm:grid-cols-3">
                            <div className="rounded-3xl bg-white p-5 shadow-sm">
                                <p className="text-sm uppercase tracking-[0.2em] text-brand-600">Problem</p>
                                <p className="mt-2 text-slate-600">Great skills are hard to turn into trusted experience.</p>
                            </div>
                            <div className="rounded-3xl bg-white p-5 shadow-sm">
                                <p className="text-sm uppercase tracking-[0.2em] text-brand-600">Solution</p>
                                <p className="mt-2 text-slate-600">ORDO helps you submit projects, verify them, and present real product work.</p>
                            </div>
                            <div className="rounded-3xl bg-white p-5 shadow-sm">
                                <p className="text-sm uppercase tracking-[0.2em] text-brand-600">Impact</p>
                                <p className="mt-2 text-slate-600">You gain confidence, portfolio evidence, and a stronger path to hiring teams.</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-2xl font-semibold text-slate-900">What ORDO can do for you</h2>
                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                            {[
                                {
                                    title: 'Build verified work',
                                    description: 'Submit project entries, track progress, and surface your portfolio in a trustable way.',
                                },
                                {
                                    title: 'Follow a career roadmap',
                                    description: 'See milestone-based guidance that helps you focus on product-led outcomes.',
                                },
                                {
                                    title: 'Get verification',
                                    description: 'Request assessments for your submitted projects and capture verified scores.',
                                },
                                {
                                    title: 'Discover opportunities',
                                    description: 'Access a curated feed of roles and mentor-ready positioning aligned to your work.',
                                },
                            ].map((item) => (
                                <div key={item.title} className="rounded-3xl border border-slate-200 p-5">
                                    <p className="text-lg font-semibold text-slate-900">{item.title}</p>
                                    <p className="mt-3 text-slate-600">{item.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-brand-200 bg-brand-50 p-6 shadow-sm">
                        <h2 className="text-2xl font-semibold text-slate-900">How to get started</h2>
                        <ol className="mt-5 space-y-4 pl-4 text-slate-600">
                            <li className="list-decimal">Create an account or sign in to open your dashboard.</li>
                            <li className="list-decimal">Use the Overview tab to review your roadmap and submit a new project.</li>
                            <li className="list-decimal">Go to Portfolio to manage submitted work and request verification.</li>
                            <li className="list-decimal">Watch the opportunity feed for matched roles and mentorship suggestions.</li>
                            <li className="list-decimal">Update your profile settings to keep your account current.</li>
                        </ol>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="text-2xl font-semibold text-slate-900">The ORDO promise</h2>
                            <p className="mt-3 text-slate-600 leading-7">
                                ORDO is about clarity, credibility, and momentum. It helps you package your project work so that hiring teams can see the actual value you created, not just the certificates you earned.
                            </p>
                        </div>
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="text-2xl font-semibold text-slate-900">Need more help?</h2>
                            <p className="mt-3 text-slate-600 leading-7">
                                If you want personalized support, use the Contact page to message the ORDO team. We recommend starting with the guide, then submitting your first project within the Dashboard Overview.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
