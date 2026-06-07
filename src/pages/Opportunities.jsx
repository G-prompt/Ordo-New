import React, { useEffect, useState } from 'react';

const getHeaders = () => {
    const token = localStorage.getItem('ordo_token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { authorization: token } : {}),
    };
};

const api = async (path, options = {}) => {
    const res = await fetch(path, {
        ...options,
        headers: { ...getHeaders(), ...(options.headers || {}) },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw data;
    return data;
};

export default function Opportunities() {
    const [opportunities, setOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        loadOpportunities();
    }, []);

    const loadOpportunities = async () => {
        setLoading(true);
        setMessage('');
        try {
            const data = await api('/api/v1/opportunities/feed');
            setOpportunities(data);
        } catch (error) {
            setMessage(error?.error || error?.message || 'Unable to load opportunities.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-6xl px-6 py-12">
            <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <h2 className="text-3xl font-semibold text-slate-900">Opportunities</h2>
                <p className="mt-3 text-slate-600">Explore roles, internships, and project openings tailored to your current journey.</p>
            </div>

            {message && <div className="mb-6 rounded-2xl bg-amber-50 p-4 text-amber-700 ring-1 ring-amber-200">{message}</div>}

            {loading ? (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-slate-600 shadow-sm">Loading opportunity feed...</div>
            ) : opportunities.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-slate-700 shadow-sm">
                    <p className="text-lg font-semibold">No opportunities available yet.</p>
                    <p className="mt-3 text-slate-600">Refresh the page or check back after submitting your first project to see new matches.</p>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2">
                    {opportunities.map((opp) => (
                        <div key={opp.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-sm uppercase tracking-[0.25em] text-brand-600">{opp.company}</p>
                                    <h3 className="mt-2 text-xl font-semibold text-slate-900">{opp.title}</h3>
                                </div>
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">{opp.location}</span>
                            </div>
                            <p className="mt-4 text-slate-600">This opportunity is a strong match if you are working on project-based learning and portfolio development.</p>
                            <div className="mt-5 flex flex-wrap gap-3">
                                <button type="button" className="rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700">View details</button>
                                <button type="button" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Save</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
