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

export default function Admin() {
    const [user, setUser] = useState(null);
    const [projects, setProjects] = useState([]);
    const [verifications, setVerifications] = useState([]);
    const [opportunities, setOpportunities] = useState([]);
    const [topic, setTopic] = useState('career growth');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [requesting, setRequesting] = useState(false);

    useEffect(() => {
        loadAdminData();
    }, []);

    const loadAdminData = async () => {
        setLoading(true);
        setMessage('');
        try {
            const [userData, projectsData, verificationData, opportunityData] = await Promise.all([
                api('/api/v1/users/me'),
                api('/api/v1/projects'),
                api('/api/v1/verifications'),
                api('/api/v1/opportunities/feed'),
            ]);
            setUser(userData);
            setProjects(projectsData);
            setVerifications(verificationData);
            setOpportunities(opportunityData);
        } catch (error) {
            setMessage(error?.error || error?.message || 'Unable to load admin data.');
        } finally {
            setLoading(false);
        }
    };

    const requestMentor = async () => {
        if (!topic) return;
        setRequesting(true);
        setMessage('');
        try {
            await api('/api/v1/mentors/request', {
                method: 'POST',
                body: JSON.stringify({ topic }),
            });
            setMessage('Mentor request submitted. A mentor will be assigned shortly.');
        } catch (error) {
            setMessage(error?.error || error?.message || 'Unable to request a mentor.');
        } finally {
            setRequesting(false);
        }
    };

    return (
        <div className="mx-auto max-w-6xl px-6 py-12">
            <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <h2 className="text-3xl font-semibold text-slate-900">Admin console</h2>
                <p className="mt-3 text-slate-600">Manage your ORDO workspace, see account metrics, and request mentor support.</p>
            </div>

            {message && <div className="mb-6 rounded-2xl bg-amber-50 p-4 text-amber-700 ring-1 ring-amber-200">{message}</div>}

            {loading ? (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-slate-600 shadow-sm">Loading admin dashboard...</div>
            ) : (
                <div className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Account</p>
                            <h3 className="mt-3 text-2xl font-semibold text-slate-900">{user?.name || 'User'}</h3>
                            <p className="mt-2 text-slate-600">{user?.email || 'No email available.'}</p>
                        </div>
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Projects</p>
                            <h3 className="mt-3 text-2xl font-semibold text-slate-900">{projects.length}</h3>
                            <p className="mt-2 text-slate-600">Submitted project items in your workspace.</p>
                        </div>
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Verifications</p>
                            <h3 className="mt-3 text-2xl font-semibold text-slate-900">{verifications.length}</h3>
                            <p className="mt-2 text-slate-600">Verification records for your submitted work.</p>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h3 className="text-xl font-semibold text-slate-900">Opportunity feed</h3>
                        <p className="mt-3 text-slate-600">ORDO shows a feed of roles aligned to your project progress.</p>
                        <div className="mt-5 grid gap-4 sm:grid-cols-2">
                            {opportunities.slice(0, 4).map((opp) => (
                                <div key={opp.id} className="rounded-3xl bg-slate-50 p-4">
                                    <p className="text-sm uppercase tracking-[0.2em] text-brand-600">{opp.company}</p>
                                    <p className="mt-2 font-semibold text-slate-900">{opp.title}</p>
                                    <p className="mt-1 text-sm text-slate-600">{opp.location}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-brand-50 p-6 shadow-sm">
                        <h3 className="text-xl font-semibold text-slate-900">Request a mentor</h3>
                        <p className="mt-3 text-slate-700">Ask ORDO to match you with a mentor for your current career topic.</p>
                        <input
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            placeholder="Enter mentorship topic"
                            className="mt-4 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-brand-500"
                        />
                        <button
                            onClick={requestMentor}
                            disabled={requesting}
                            className="mt-4 rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {requesting ? 'Requesting...' : 'Request mentor'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
