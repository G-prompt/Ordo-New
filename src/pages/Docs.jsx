import React, { useEffect, useState } from 'react';

const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    let index = 0;
    let value = bytes;
    while (value >= 1024 && index < units.length - 1) {
        value /= 1024;
        index += 1;
    }
    return `${value.toFixed(1)} ${units[index]}`;
};

export default function Docs() {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [savedResources, setSavedResources] = useState([]);
    const [status, setStatus] = useState('');

    useEffect(() => {
        const stored = window.localStorage.getItem('ordo_docs_resources');
        if (stored) {
            setSavedResources(JSON.parse(stored));
        }
    }, []);

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files || []).map((file) => ({
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
        }));
        setSelectedFiles(files);
    };

    const saveResources = () => {
        if (!selectedFiles.length) {
            setStatus('Select files before saving.');
            return;
        }
        const resources = [...savedResources, ...selectedFiles];
        window.localStorage.setItem('ordo_docs_resources', JSON.stringify(resources));
        setSavedResources(resources);
        setSelectedFiles([]);
        setStatus('Resources saved locally for this prototype.');
    };

    return (
        <div className="mx-auto max-w-6xl px-6 py-12">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600">Documentation</p>
                        <h2 className="mt-3 text-3xl font-semibold text-slate-900">Project resources and upload center</h2>
                        <p className="mt-3 text-slate-600">Upload your project documents, images, videos, and support files. This prototype stores file metadata in the browser for review.</p>
                    </div>
                    <div className="rounded-3xl bg-brand-600 px-5 py-4 text-white shadow-lg">
                        <p className="text-sm uppercase tracking-[0.25em]">Resources</p>
                        <p className="mt-2 text-lg font-semibold">Project files</p>
                    </div>
                </div>

                <div className="mt-10 rounded-3xl border border-dashed border-brand-200 bg-brand-50 p-6">
                    <label className="block text-sm font-medium text-slate-700">
                        Attach documents, images, or videos
                        <input
                            type="file"
                            multiple
                            accept="image/*,video/*,.pdf,.doc,.docx,.ppt,.pptx"
                            onChange={handleFileChange}
                            className="mt-3 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                        />
                    </label>
                    <div className="mt-4 flex flex-wrap gap-3">
                        <button onClick={saveResources} className="rounded-2xl bg-gradient-to-r from-brand-600 to-accent-600 px-5 py-3 text-sm font-semibold text-white transition hover:shadow-lg">Save resources</button>
                        {status && <span className="text-sm text-slate-600">{status}</span>}
                    </div>
                </div>

                <div className="mt-10 grid gap-6 lg:grid-cols-2">
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                        <h3 className="text-xl font-semibold text-slate-900">Selected files</h3>
                        <div className="mt-4 space-y-3">
                            {selectedFiles.length > 0 ? selectedFiles.map((file) => (
                                <div key={`${file.name}-${file.size}`} className="rounded-2xl bg-white p-4 shadow-sm">
                                    <p className="font-semibold text-slate-900">{file.name}</p>
                                    <p className="text-sm text-slate-500">{file.type || 'Unknown type'} • {formatBytes(file.size)}</p>
                                </div>
                            )) : <p className="text-sm text-slate-500">No files selected yet.</p>}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                        <h3 className="text-xl font-semibold text-slate-900">Saved resources</h3>
                        <div className="mt-4 space-y-3">
                            {savedResources.length > 0 ? savedResources.map((file, index) => (
                                <div key={`${file.name}-${index}`} className="rounded-2xl bg-white p-4 shadow-sm">
                                    <p className="font-semibold text-slate-900">{file.name}</p>
                                    <p className="text-sm text-slate-500">{file.type || 'Unknown type'} • {formatBytes(file.size)}</p>
                                </div>
                            )) : <p className="text-sm text-slate-500">Saved resources will appear here after you upload.</p>}
                        </div>
                    </div>
                </div>
            </div>

            <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <h3 className="text-xl font-semibold text-slate-900">API</h3>
                <p className="mt-3 text-slate-600">The demo backend exposes endpoints under <code className="rounded bg-slate-100 px-2 py-1">/api/v1/*</code> for auth, roadmap, projects, portfolio, verification, and opportunities.</p>
            </section>
        </div>
    );
}
