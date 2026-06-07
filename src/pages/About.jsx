import React from 'react';

export default function About() {
    return (
        <div className="mx-auto max-w-4xl px-6 py-12">
            <h2 className="text-3xl font-semibold text-slate-900">About ORDO</h2>
            <p className="mt-4 text-slate-700">ORDO is a career operating system that helps individuals build verified project work, follow a structured roadmap, and connect with opportunity. This prototype demonstrates the core ideas for onboarding, project submission, verification, and opportunity discovery.</p>
            <section className="mt-8 space-y-4">
                <h3 className="text-xl font-semibold">Vision</h3>
                <p className="text-slate-600">Create a trusted path from learning to paid work by making projects verifiable and discoverable to teams and mentors.</p>
            </section>
        </div>
    );
}
