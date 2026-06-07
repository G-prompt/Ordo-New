import React, { useState, useEffect, useRef } from 'react';

const getAuthHeaders = () => {
    const token = localStorage.getItem('ordo_token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { authorization: token } : {}),
    };
};

export default function AIAssistant() {
    const [prompt, setPrompt] = useState('Summarize my recent portfolio progress and recommend the next project.');
    const [loading, setLoading] = useState(false);
    const [reply, setReply] = useState('');
    const [showModal, setShowModal] = useState(false);
    const samples = [
        'Summarize my recent portfolio progress and recommend the next project.',
        'How can I improve the README for my project to attract recruiters?',
        'Suggest three small projects to showcase frontend skills.'
    ];
    const token = localStorage.getItem('ordo_token');
    const [demoLoading, setDemoLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const historyRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (showModal) {
            // focus textarea when modal opens
            setTimeout(() => inputRef.current?.focus?.(), 50);
        }
    }, [showModal]);

    useEffect(() => {
        // scroll history to bottom on new messages
        if (historyRef.current) {
            historyRef.current.scrollTop = historyRef.current.scrollHeight;
        }
    }, [messages]);

    const send = async () => {
        if (!prompt) return;
        setLoading(true);
        setReply('');
        // append user message
        setMessages((prev) => [...prev, { role: 'user', text: prompt }]);
        try {
            const res = await fetch('/api/v1/ai/assist', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({ prompt }),
            });
            const data = await res.json();
            if (!res.ok) throw data;
            const text = data.response || JSON.stringify(data);
            // append assistant message
            setMessages((prev) => [...prev, { role: 'assistant', text }]);
            setReply(text);
        } catch (err) {
            const errText = err?.error || 'Unable to reach AI assistant.';
            setMessages((prev) => [...prev, { role: 'assistant', text: errText }]);
            setReply(errText);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-slate-700">AI Assistant</p>
                <p className="mt-2 text-sm text-slate-500">Ask the AI for concise advice about your portfolio and roadmap.</p>
                <div className="mt-4 flex items-center gap-3">
                    <button onClick={() => setShowModal(true)} className="rounded-full bg-brand-600 px-4 py-2 text-white font-semibold hover:shadow-md">Ask AI</button>
                    <span className="text-sm text-slate-500">Powered by AI • Courtesy of Team Turing</span>
                </div>
                {!token && (
                    <>
                        <div className="mt-3 text-sm text-slate-600">Sign in to try the full AI assistant. Alternatively, try the demo below to see how it works.</div>
                        <div className="mt-3 flex items-center gap-3">
                            <button onClick={async () => {
                                try {
                                    setDemoLoading(true);
                                    setReply('');
                                    setMessages((prev) => [...prev, { role: 'user', text: '(demo)' }]);
                                    const res = await fetch('/api/v1/ai/demo');
                                    const data = await res.json();
                                    const text = data.response || JSON.stringify(data);
                                    setMessages((prev) => [...prev, { role: 'assistant', text }]);
                                } catch (e) {
                                    setMessages((prev) => [...prev, { role: 'assistant', text: 'Demo unavailable.' }]);
                                } finally {
                                    setDemoLoading(false);
                                }
                            }} className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium">{demoLoading ? 'Loading...' : 'Try demo'}</button>
                        </div>
                    </>
                )}
                {reply && (
                    <div className="mt-4 rounded-lg bg-slate-50 p-4 text-slate-700">
                        <pre className="whitespace-pre-wrap text-sm">{reply}</pre>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
                    <div className="relative z-10 mx-4 w-full max-w-3xl rounded-2xl bg-white p-6 shadow-2xl">
                        <div className="flex items-start justify-between">
                            <h3 className="text-lg font-semibold">AI Assistant</h3>
                            <button onClick={() => setShowModal(false)} aria-label="Close" className="text-slate-500">✕</button>
                        </div>
                        <p className="mt-2 text-sm text-slate-500">Ask the AI for concise advice about your portfolio and roadmap.</p>

                        <div className="mt-4">
                            <div ref={historyRef} className="max-h-60 overflow-auto space-y-3">
                                {messages.length === 0 && (
                                    <div className="text-sm text-slate-500">No conversation yet — ask a question or try a sample.</div>
                                )}
                                {messages.map((m, i) => (
                                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`${m.role === 'user' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-800'} max-w-[80%] rounded-2xl px-4 py-2 text-sm`}>{m.text}</div>
                                    </div>
                                ))}
                            </div>

                            <textarea ref={inputRef} value={prompt} onChange={(e) => setPrompt(e.target.value)} className="mt-3 w-full rounded-lg border border-slate-200 p-3" rows={5} />
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                {samples.map((s) => (
                                    <button key={s} onClick={() => setPrompt(s)} className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-700 hover:bg-slate-50">{s.length > 60 ? `${s.slice(0, 57)}...` : s}</button>
                                ))}
                            </div>
                            <div className="mt-4 flex items-center gap-3">
                                <button onClick={send} disabled={loading || !token} className="rounded-full bg-brand-600 px-4 py-2 text-white font-semibold hover:shadow-md">{loading ? 'Thinking...' : token ? 'Send' : 'Sign in to send'}</button>
                                <button onClick={async () => {
                                    try {
                                        setDemoLoading(true);
                                        setReply('');
                                        setMessages((prev) => [...prev, { role: 'user', text: '(demo)' }]);
                                        const res = await fetch('/api/v1/ai/demo');
                                        const data = await res.json();
                                        const text = data.response || JSON.stringify(data);
                                        setMessages((prev) => [...prev, { role: 'assistant', text }]);
                                    } catch (e) {
                                        setMessages((prev) => [...prev, { role: 'assistant', text: 'Demo unavailable.' }]);
                                    } finally {
                                        setDemoLoading(false);
                                    }
                                }} className="rounded-md border border-slate-200 px-3 py-2 text-sm">{demoLoading ? 'Loading...' : 'Try demo'}</button>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
