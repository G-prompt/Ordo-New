import React, { useState } from 'react';

export default function Contact() {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState('idle');
    const [errors, setErrors] = useState({});

    const validate = () => {
        const next = {};
        if (!form.name.trim()) next.name = 'Please enter your name.';
        if (!form.email.trim()) next.email = 'Please enter your email.';
        else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email.trim())) next.email = 'Please enter a valid email address.';
        if (!form.message.trim()) next.message = 'Please enter your message.';
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const submit = async () => {
        if (!validate()) {
            setStatus('error');
            return;
        }

        setStatus('sending');
        try {
            await fetch('https://formspree.io/f/xqeopkdz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: form.name, email: form.email, message: form.message }),
            });

            // Local persistence fallback (non-blocking)
            fetch('/api/v1/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            }).catch(() => { });

            setStatus('sent');
            setErrors({});
            setForm({ name: '', email: '', message: '' });
        } catch (e) {
            setStatus('error');
        }
    };

    return (
        <div className="min-h-[60vh] bg-gradient-to-br from-brand-600 via-accent-500 to-accent-700 py-12">
            <div className="mx-auto max-w-4xl px-6">
                <div className="rounded-3xl bg-gradient-to-br from-white/95 via-brand-100/80 to-purple-100/85 p-8 shadow-premium ring-1 ring-white/80 backdrop-blur-sm">
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
                        <div className="lg:w-1/2">
                            <h2 className="text-3xl font-semibold text-slate-900">Contact ORDO</h2>
                            <p className="mt-2 text-slate-700">Questions, partnerships, or feedback — we read every message. Use the form to reach our team (inbox: ordo.contact.me1@gmail.com).</p>

                            <div className="mt-6 space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-brand-700 to-accent-700 flex items-center justify-center text-white text-lg font-bold">O</div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">Official inbox</p>
                                        <p className="text-sm text-slate-600">ordo.contact.me1@gmail.com</p>
                                    </div>
                                </div>
                                <div className="mt-4 text-sm text-slate-700">Or use the quick links in the header to explore About, Pricing, and Docs.</div>
                            </div>
                        </div>

                        <div className="mt-6 lg:mt-0 lg:w-1/2">
                            <div className="rounded-3xl bg-slate-950/5 border border-white/30 p-6 shadow-2xl shadow-purple-500/10 backdrop-blur-sm">
                                <label className="block text-sm text-slate-700">Name
                                    <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Your name" className={`mt-2 w-full rounded-2xl border px-4 py-3 bg-white/95 focus:outline-none focus:ring-4 ${errors.name ? 'border-red-400 ring-red-200' : 'border-slate-300 focus:border-brand-600 ring-brand-200/60'}`} />
                                </label>
                                {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                                <label className="block mt-4 text-sm text-slate-700">Email
                                    <input value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} placeholder="you@example.com" className={`mt-2 w-full rounded-2xl border px-4 py-3 bg-white/95 focus:outline-none focus:ring-4 ${errors.email ? 'border-red-400 ring-red-200' : 'border-slate-300 focus:border-brand-600 ring-brand-200/60'}`} />
                                </label>
                                {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                                <label className="block mt-4 text-sm text-slate-700">Message
                                    <textarea value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))} placeholder="How can we help?" className={`mt-2 w-full rounded-2xl border px-4 py-3 h-32 bg-white/95 focus:outline-none focus:ring-4 ${errors.message ? 'border-red-400 ring-red-200' : 'border-slate-300 focus:border-brand-600 ring-brand-200/60'}`} />
                                </label>
                                {errors.message && <p className="mt-2 text-sm text-red-600">{errors.message}</p>}

                                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                                    <button disabled={status === 'sending'} onClick={submit} className="rounded-2xl bg-gradient-to-r from-brand-700 via-brand-600 to-accent-700 px-5 py-3 font-semibold text-white shadow-lg shadow-purple-500/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60">{status === 'sending' ? 'Sending...' : 'Send message'}</button>
                                    {status === 'sent' && <span className="text-sm text-green-600">Thanks — your message is on its way.</span>}
                                    {status === 'error' && <span className="text-sm text-red-600">Please check the form and try again.</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
