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

export default function Verification() {
    const [verifications, setVerifications] = useState([]);
    const [projects, setProjects] = useState({});
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        loadVerificationData();
    }, []);

    const loadVerificationData = async () => {
        setLoading(true);
        setMessage('');
        try {
            const [verificationData, projectData] = await Promise.all([
                api('/api/v1/verifications'),
                api('/api/v1/projects'),
            ]);
            setProjects(projectData.reduce((map, project) => {
                map[project.id] = project;
                return map;
            }, {}));
            setVerifications(verificationData);
        } catch (error) {
            setMessage(error?.error || error?.message || 'Unable to load verifications.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-6xl px-6 py-12">
            <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <h2 className="text-3xl font-semibold text-slate-900">Verification</h2>
                <p className="mt-3 text-slate-600">Review the scores and verification history for your submitted projects.</p>
            </div>

            {message && <div className="mb-6 rounded-2xl bg-amber-50 p-4 text-amber-700 ring-1 ring-amber-200">{message}</div>}

            {loading ? (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-slate-600 shadow-sm">Loading verification reports...</div>
            ) : verifications.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-slate-700 shadow-sm">
                    <p className="text-lg font-semibold">No verification reports yet.</p>
                    <p className="mt-3 text-slate-600">Submit and verify a project from the dashboard to generate your first assessment.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {verifications.map((verification) => (
                        <div key={verification.id} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                <div>
                                    <p className="text-sm uppercase tracking-[0.25em] text-slate-500">Verification report</p>
                                    <h3 className="mt-2 text-xl font-semibold text-slate-900">{projects[verification.projectId]?.title || 'Untitled project'}</h3>
                                </div>
                                <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
                                    Score: <span className="font-semibold text-slate-900">{verification.score}</span>
                                </div>
                            </div>
                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <p className="text-sm text-slate-500">Assessor</p>
                                    <p className="mt-2 text-slate-700">{verification.assessor || 'AI'}</p>
                                </div>
                                <div className="rounded-2xl bg-slate-50 p-4">
                                    <p className="text-sm text-slate-500">Reviewed</p>
                                    <p className="mt-2 text-slate-700">{verification.verifiedAt ? new Date(verification.verifiedAt).toLocaleDateString() : 'Pending'}</p>
                                </div>
                            </div>
                            {verification.comment && (
                                <div className="mt-4 rounded-2xl bg-slate-50 p-4">
                                    <p className="text-sm font-semibold text-slate-900">Review notes</p>
                                    <p className="mt-2 text-slate-600">{verification.comment}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
