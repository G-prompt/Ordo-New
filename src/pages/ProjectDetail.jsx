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

export default function ProjectDetail() {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [verifications, setVerifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [requesting, setRequesting] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        setMessage('');
        try {
            const [projectsData, verificationData] = await Promise.all([
                api('/api/v1/projects'),
                api('/api/v1/verifications'),
            ]);
            setProjects(projectsData);
            setVerifications(verificationData);
            const nextSelected = selectedProject
                ? projectsData.find((project) => project.id === selectedProject.id)
                : projectsData[0];
            setSelectedProject(nextSelected || null);
        } catch (error) {
            setMessage(error?.error || error?.message || 'Unable to load projects. Please sign in and try again.');
        } finally {
            setLoading(false);
        }
    };

    const requestVerification = async (projectId) => {
        setRequesting(true);
        setMessage('');
        try {
            await api('/api/v1/verify/assess', {
                method: 'POST',
                body: JSON.stringify({ projectId }),
            });
            setMessage('Verification requested successfully. Refreshing project details...');
            await loadData();
        } catch (error) {
            setMessage(error?.error || error?.message || 'Verification request failed.');
        } finally {
            setRequesting(false);
        }
    };

    const selectedVerifications = selectedProject
        ? verifications.filter((verification) => verification.projectId === selectedProject.id)
        : [];

    return (
        <div className="mx-auto max-w-6xl px-6 py-12">
            <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <h2 className="text-3xl font-semibold text-slate-900">Project detail</h2>
                <p className="mt-3 text-slate-600">Review your submitted work, repository links, and verification history in one place.</p>
            </div>

            {message && <div className="mb-6 rounded-2xl bg-amber-50 p-4 text-amber-700 ring-1 ring-amber-200">{message}</div>}

            {loading ? (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-slate-600 shadow-sm">Loading your project details...</div>
            ) : projects.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-slate-700 shadow-sm">
                    <p className="text-lg font-semibold">No projects found.</p>
                    <p className="mt-3 text-slate-600">Submit your first project from the dashboard overview to see details here.</p>
                </div>
            ) : (
                <div className="grid gap-6 lg:grid-cols-[0.95fr_1.3fr]">
                    <div className="space-y-4">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h3 className="text-xl font-semibold text-slate-900">Your projects</h3>
                            <div className="mt-4 space-y-3">
                                {projects.map((project) => (
                                    <button
                                        key={project.id}
                                        type="button"
                                        onClick={() => setSelectedProject(project)}
                                        className={`w-full rounded-3xl p-4 text-left transition ${selectedProject?.id === project.id ? 'border border-brand-500 bg-brand-50' : 'border border-slate-200 bg-slate-50 hover:border-brand-300 hover:bg-brand-50/60'}`}
                                    >
                                        <p className="font-semibold text-slate-900">{project.title}</p>
                                        <p className="mt-1 text-sm text-slate-600">{project.repositoryUrl || 'No repository link provided.'}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="rounded-3xl border border-slate-200 bg-brand-50 p-6 shadow-sm">
                            <h3 className="text-xl font-semibold text-slate-900">Verification pulse</h3>
                            <p className="mt-3 text-slate-700">Requests submitted here are assessed automatically and added to your verification history.</p>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h3 className="text-xl font-semibold text-slate-900">{selectedProject?.title}</h3>
                                    <p className="mt-2 text-slate-600">Project metadata, repository URL, and submitted details.</p>
                                </div>
                                {selectedProject && (
                                    <button
                                        type="button"
                                        onClick={() => requestVerification(selectedProject.id)}
                                        disabled={requesting}
                                        className="rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {requesting ? 'Requesting...' : 'Request verification'}
                                    </button>
                                )}
                            </div>

                            {selectedProject ? (
                                <div className="mt-6 space-y-4">
                                    <div className="rounded-3xl bg-slate-50 p-4">
                                        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Repository</p>
                                        <a href={selectedProject.repositoryUrl || '#'} target="_blank" rel="noreferrer" className="mt-2 block text-sm font-semibold text-brand-600 hover:underline">
                                            {selectedProject.repositoryUrl || 'No repository provided'}
                                        </a>
                                    </div>
                                    <div className="rounded-3xl bg-slate-50 p-4">
                                        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Submitted</p>
                                        <p className="mt-2 text-slate-700">{selectedProject.createdAt ? new Date(selectedProject.createdAt).toLocaleDateString() : 'Unknown date'}</p>
                                    </div>
                                    <div className="rounded-3xl bg-slate-50 p-4">
                                        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Verification history</p>
                                        {selectedVerifications.length > 0 ? (
                                            <div className="mt-3 space-y-3">
                                                {selectedVerifications.map((verification) => (
                                                    <div key={verification.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                                                        <div className="flex items-center justify-between gap-3">
                                                            <p className="font-semibold text-slate-900">Score {verification.score}</p>
                                                            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Verified</span>
                                                        </div>
                                                        <p className="mt-2 text-sm text-slate-600">Assessor: {verification.assessor || 'AI'}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="mt-3 text-slate-600">No verification records yet. Request verification to generate your first score.</p>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="mt-6 rounded-3xl bg-slate-50 p-6 text-slate-600">Select a project from the list to see details here.</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
