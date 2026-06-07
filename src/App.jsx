
import { useEffect, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';
import About from './pages/About';
import Contact from './pages/Contact';
import Features from './pages/Features';
import Guide from './pages/Guide';
import Pricing from './pages/Pricing';
import Docs from './pages/Docs';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';
import ProjectDetail from './pages/ProjectDetail';
import Verification from './pages/Verification';
import Opportunities from './pages/Opportunities';
import Admin from './pages/Admin';

const apiHeaders = () => {
    const token = localStorage.getItem('ordo_token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { authorization: token } : {}),
    };
};

const api = async (path, options = {}) => {
    const res = await fetch(path, {
        ...options,
        headers: { ...apiHeaders(), ...(options.headers || {}) },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw data;
    return data;
};

import { useNavigate, useLocation } from 'react-router-dom';

function App() {
    const [view, setView] = useState('landing');
    const [message, setMessage] = useState('');
    const [user, setUser] = useState(null);
    const [roadmap, setRoadmap] = useState(null);
    const [portfolio, setPortfolio] = useState([]);
    const [opportunities, setOpportunities] = useState([]);
    const [projects, setProjects] = useState([]);
    const [verifications, setVerifications] = useState([]);
    const [dashboardPage, setDashboardPage] = useState('overview');
    const [dashboardLoading, setDashboardLoading] = useState(false);
    const [dashboardIntro, setDashboardIntro] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [settingsForm, setSettingsForm] = useState({ name: '', email: '', notifications: true });
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({ name: '', email: '', password: '', title: '', repositoryUrl: '' });

    useEffect(() => {
        const token = localStorage.getItem('ordo_token');
        const savedUser = localStorage.getItem('ordo_user');
        if (token && savedUser) {
            try {
                setUser(JSON.parse(savedUser));
                setDashboardLoading(true);
                navigate(viewToPath.dashboard);
            } catch {
                localStorage.removeItem('ordo_user');
                localStorage.removeItem('ordo_token');
            } finally {
                setInitialLoading(false);
            }
            return;
        }

        const timer = window.setTimeout(() => setInitialLoading(false), 1200);
        return () => window.clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (view === 'dashboard' && user) {
            loadDashboard();
        }
    }, [view, user]);

    useEffect(() => {
        if (user) {
            setSettingsForm({
                name: user.name || '',
                email: user.email || '',
                notifications: true,
            });
        }
    }, [user]);

    useEffect(() => {
        if (dashboardIntro) {
            const timer = window.setTimeout(() => setDashboardIntro(false), 2800);
            return () => window.clearTimeout(timer);
        }
        return undefined;
    }, [dashboardIntro]);

    const handleChange = (field) => (event) => {
        setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

    const handleError = (error) => {
        setMessage(error?.error || error?.message || 'Unexpected error');
    };

    const navigate = useNavigate();
    const location = useLocation();

    const viewToPath = {
        landing: '/',
        login: '/login',
        signup: '/signup',
        dashboard: '/dashboard',
        about: '/about',
        features: '/features',
        contact: '/contact',
        pricing: '/pricing',
        docs: '/docs',
        guide: '/guide',
        terms: '/terms',
        privacy: '/privacy',
        project: '/project',
        verification: '/verification',
        opportunities: '/opportunities',
        admin: '/admin',
    };

    const pathToView = Object.fromEntries(Object.entries(viewToPath).map(([k, v]) => [v, k]));

    const navigateWithLoader = (target) => {
        setMessage('');
        setPageLoading(true);
        const path = viewToPath[target] || target;
        window.setTimeout(() => {
            setPageLoading(false);
            navigate(path);
        }, 1200);
    };

    // Sync location -> view on back/forward navigation
    useEffect(() => {
        const current = location.pathname || '/';
        const mapped = pathToView[current] || (current === '/' ? 'landing' : 'landing');
        if (mapped !== view) setView(mapped);
    }, [location.pathname]);

    const doRegister = async () => {
        try {
            await api('/api/v1/auth/register', {
                method: 'POST',
                body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
            });
            setMessage('Account created. Please sign in.');
            navigate(viewToPath.login);
        } catch (error) {
            handleError(error);
        }
    };

    const doLogin = async () => {
        try {
            const data = await api('/api/v1/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email: form.email, password: form.password }),
            });
            localStorage.setItem('ordo_token', data.token);
            localStorage.setItem('ordo_user', JSON.stringify(data.user));
            setUser(data.user);
            setDashboardLoading(true);
            navigate(viewToPath.dashboard);
            setMessage('');
            setForm((prev) => ({ ...prev, password: '' }));
        } catch (error) {
            handleError(error);
        }
    };

    const loadDashboard = async () => {
        const start = Date.now();
        try {
            setDashboardLoading(true);
            const roadmapData = await api('/api/v1/career/roadmap', {
                method: 'POST',
                body: JSON.stringify({ goal: 'Product-led growth builder' }),
            });
            const portfolioData = await api('/api/v1/portfolio');
            const oppData = await api('/api/v1/opportunities/feed');
            const projectsData = await api('/api/v1/projects');
            const verifs = await api('/api/v1/verifications');
            setRoadmap(roadmapData);
            setPortfolio(portfolioData);
            setOpportunities(oppData);
            setProjects(projectsData);
            setVerifications(verifs);
        } catch (error) {
            handleError(error);
        } finally {
            const elapsed = Date.now() - start;
            const minTime = 1000;
            if (elapsed < minTime) {
                await new Promise((resolve) => window.setTimeout(resolve, minTime - elapsed));
            }
            setDashboardLoading(false);
            setDashboardIntro(true);
        }
    };

    const submitProject = async () => {
        try {
            await api('/api/v1/projects/submit', {
                method: 'POST',
                body: JSON.stringify({ title: form.title, repositoryUrl: form.repositoryUrl }),
            });
            setMessage('Project submitted successfully.');
            setForm((prev) => ({ ...prev, title: '', repositoryUrl: '' }));
            loadDashboard();
        } catch (error) {
            handleError(error);
        }
    };

    const verifyProject = async (projectId) => {
        try {
            const data = await api('/api/v1/verify/assess', {
                method: 'POST',
                body: JSON.stringify({ projectId }),
            });
            setMessage(`Verified project with score ${data.score}`);
        } catch (error) {
            handleError(error);
        }
    };

    const logout = () => {
        localStorage.removeItem('ordo_token');
        localStorage.removeItem('ordo_user');
        setUser(null);
        navigate(viewToPath.landing);
        setRoadmap(null);
        setPortfolio([]);
        setOpportunities([]);
        setMessage('You have signed out.');
    };

    const renderLanding = () => (
        <div className="max-w-4xl mx-auto px-6 py-12 animate-fade-in">
            <header className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3 pt-1">
                    <img src="/logo.svg" alt="ORDO" className="w-16 h-16 flex-shrink-0" />
                    <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-brand-600 font-bold">ORDO</p>
                        <h1 className="mt-2 text-4xl font-semibold text-slate-900 sm:text-5xl">From Certificate to Career</h1>
                        <p className="mt-4 text-slate-600 max-w-2xl leading-7">Build verified skills, showcase portfolio projects, and connect with hiring teams on a polished platform designed for professional growth.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button onClick={() => navigateWithLoader('login')} className="rounded-md bg-brand-600 hover:bg-brand-700 px-5 py-3 text-sm font-semibold text-white transition shadow-lg hover:shadow-xl">Sign In</button>
                    <button onClick={() => navigateWithLoader('signup')} className="rounded-md border-2 border-brand-600 px-5 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-50 hover:border-brand-700 hover:text-brand-700">Create Account</button>
                </div>
            </header>
            <section className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-3xl bg-gradient-to-br from-brand-50 to-slate-50 p-8 shadow-premium border border-brand-200">
                    <h2 className="text-2xl font-semibold text-slate-900">Launch your real product journey</h2>
                    <p className="mt-3 text-slate-600">Sign up and start building your portfolio with a curated career blueprint, verified work, and a pipeline of opportunity.</p>
                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border border-brand-200 bg-white p-5 hover:border-brand-300 transition">
                            <p className="text-sm uppercase tracking-[0.2em] text-brand-600 font-semibold">Growth blueprint</p>
                            <p className="mt-3 text-slate-700">A structured path that connects projects to real-world career outcomes.</p>
                        </div>
                        <div className="rounded-2xl border border-brand-200 bg-white p-5 hover:border-brand-300 transition">
                            <p className="text-sm uppercase tracking-[0.2em] text-brand-600 font-semibold">Verified experience</p>
                            <p className="mt-3 text-slate-700">Showcase real work that hiring teams can trust.</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-accent-700 p-8 text-white shadow-xl hover:shadow-2xl transition">
                    <h3 className="text-2xl font-semibold">Built with product teams and talent leaders in mind</h3>
                    <p className="mt-4 text-purple-100">A polished, enterprise-grade experience for building credible career momentum and long-term professional value.</p>
                    <div className="mt-8 space-y-3 text-purple-100">
                        <p>• Mentor-reviewed development roadmap</p>
                        <p>• Project submissions, review, and verification</p>
                        <p>• Opportunity feed designed for early career builders</p>
                    </div>
                </div>
            </section>
            <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-semibold text-slate-900">Explore ORDO</h2>
                <p className="mt-2 text-slate-600">Jump directly to key website pages or get started with the app.</p>
                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    {[
                        { label: 'About', view: 'about' },
                        { label: 'Features', view: 'features' },
                        { label: 'Pricing', view: 'pricing' },
                        { label: 'Docs', view: 'docs' },
                        { label: 'Guide', view: 'guide' },
                    ].map((card) => (
                        <button
                            key={card.view}
                            onClick={() => navigateWithLoader(card.view)}
                            className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-6 text-left text-slate-800 transition hover:border-brand-300 hover:bg-brand-50"
                        >
                            <span className="block text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">{card.label}</span>
                            <span className="mt-3 block text-lg font-semibold">Go</span>
                        </button>
                    ))}
                </div>
            </section>
        </div>
    );

    const renderForm = () => (
        <div className="mx-auto mt-12 max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-semibold">{view === 'login' ? 'Sign in' : 'Create account'}</h2>
                <button
                    onClick={() => navigateWithLoader('landing')}
                    className="text-sm font-medium text-slate-500 hover:text-slate-800"
                >Back</button>
            </div>
            {message && <div className="mb-4 rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700">{message}</div>}
            <div className="space-y-4">
                {view === 'signup' && (
                    <label className="block text-sm font-medium text-slate-700">
                        Name
                        <input
                            value={form.name}
                            onChange={handleChange('name')}
                            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-brand-500"
                            placeholder="Full name"
                        />
                    </label>
                )}
                <label className="block text-sm font-medium text-slate-700">
                    Email
                    <input
                        value={form.email}
                        onChange={handleChange('email')}
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-brand-500"
                        placeholder="you@example.com"
                        type="email"
                    />
                </label>
                <label className="block text-sm font-medium text-slate-700">
                    Password
                    <div className="relative mt-2">
                        <input
                            value={form.password}
                            onChange={handleChange('password')}
                            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 outline-none focus:border-brand-500"
                            placeholder="••••••••"
                            type={showPassword ? 'text' : 'password'}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-brand-600 transition"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
                                <circle cx="11" cy="11" r="6" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </label>
            </div>
            <button
                onClick={view === 'login' ? doLogin : doRegister}
                className="mt-6 w-full rounded-2xl bg-gradient-to-r from-brand-600 to-accent-600 px-5 py-3 text-sm font-semibold text-white transition hover:shadow-lg hover:from-brand-700 hover:to-accent-700"
            >{view === 'login' ? 'Sign in' : 'Create account'}</button>
            <div className="mt-4 text-center text-sm text-slate-500">
                {view === 'login' ? 'New here?' : 'Already have an account?'}
                <button onClick={() => navigateWithLoader(view === 'login' ? 'signup' : 'login')} className="ml-2 font-semibold text-brand-600 hover:text-brand-700">
                    {view === 'login' ? 'Create one' : 'Sign in'}
                </button>
            </div>
        </div>
    );

    const renderDashboardHeader = () => (
        <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <img src="/logo.svg" alt="ORDO" className="w-12 h-12" />
                    <div className="leading-tight">
                        <p className="text-sm uppercase tracking-[0.3em] text-brand-500">ORDO Dashboard</p>
                        <h1 className="text-3xl font-semibold text-slate-900">Welcome back, {user?.name || user?.email}</h1>
                    </div>
                </div>
                <button onClick={logout} className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Sign out</button>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
                {['overview', 'portfolio', 'settings'].map((page) => (
                    <button
                        key={page}
                        onClick={() => setDashboardPage(page)}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${dashboardPage === page ? 'bg-brand-600 text-white shadow-lg' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                    >
                        {page === 'overview' ? 'Overview' : page === 'portfolio' ? 'Portfolio' : 'Settings'}
                    </button>
                ))}
            </div>
        </div>
    );

    const renderDashboardOverview = () => (
        <>
            {renderStrategicOverview()}
            <div className="mb-6 rounded-3xl border border-brand-200 bg-brand-50 p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.3em] text-brand-700">New user guide</p>
                        <h2 className="mt-1 text-2xl font-semibold text-slate-900">Explore ORDO step-by-step</h2>
                        <p className="mt-3 text-slate-600">Visit the onboarding guide anytime to learn how ORDO turns verified projects into career-ready momentum.</p>
                    </div>
                    <button onClick={() => navigateWithLoader('guide')} className="rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700">Open guide</button>
                </div>
            </div>
            <div className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
                <section className="space-y-6">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-semibold text-slate-900">Career roadmap</h2>
                        <p className="mt-3 text-slate-600">Follow a product-led path to real project outcomes and professional momentum.</p>
                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                            {roadmap ? roadmap.skills.map((skill) => (
                                <span key={skill} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700">{skill}</span>
                            )) : <div className="text-slate-500">Loading roadmap...</div>}
                        </div>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold text-slate-900">Submit a project</h2>
                                <p className="mt-1 text-sm text-slate-500">Add a project to your portfolio and unlock verification.</p>
                            </div>
                        </div>
                        <div className="mt-5 space-y-4">
                            <input
                                value={form.title}
                                onChange={handleChange('title')}
                                placeholder="Project title"
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-brand-500"
                            />
                            <input
                                value={form.repositoryUrl}
                                onChange={handleChange('repositoryUrl')}
                                placeholder="Repository URL"
                                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-brand-500"
                            />
                            <button onClick={submitProject} className="rounded-2xl bg-gradient-to-r from-brand-600 to-accent-600 px-5 py-3 text-sm font-semibold text-white transition hover:shadow-lg hover:from-brand-700 hover:to-accent-700 w-full">Submit project</button>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-semibold text-slate-900">Opportunity feed</h2>
                        <div className="mt-4 space-y-3">
                            {opportunities.length > 0 ? opportunities.map((opp) => (
                                <div key={opp.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                                    <p className="font-semibold text-slate-900">{opp.title}</p>
                                    <p className="text-sm text-slate-500">{opp.company} • {opp.location}</p>
                                </div>
                            )) : <div className="text-slate-500">Loading opportunities...</div>}
                        </div>
                    </div>
                </section>

                <aside className="space-y-6">
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <h2 className="text-xl font-semibold text-slate-900">Portfolio</h2>
                        <div className="mt-4 space-y-4">
                            {portfolio.length > 0 ? portfolio.map((item) => (
                                <div key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="font-semibold text-slate-900">{item.title}</p>
                                        <button onClick={() => verifyProject(item.projectId)} className="rounded-full bg-gradient-to-r from-brand-600 to-brand-500 px-3 py-1 text-xs font-semibold text-white hover:shadow-md transition">Verify</button>
                                    </div>
                                    <p className="mt-2 text-sm text-slate-600">{item.description || 'No description provided.'}</p>
                                </div>
                            )) : <div className="text-slate-500">Get started by creating your first project.</div>}
                        </div>
                    </div>

                    <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-accent-700 p-6 text-white shadow-lg hover:shadow-xl transition border border-brand-500/30">
                        <h2 className="text-xl font-semibold">Next milestone</h2>
                        <p className="mt-3 text-purple-100">Turn your progress into a polished portfolio that hiring teams and mentors can evaluate with confidence.</p>
                    </div>
                </aside>
            </div>
        </>
    );

    const renderStrategicOverview = () => {
        const totalProjects = projects.filter((p) => p.ownerId === (user && user.id)).length || 0;
        const verifiedCount = verifications.length || 0;
        const avgScore = verifications.length ? Math.round(verifications.reduce((s, v) => s + (v.score || 0), 0) / verifications.length) : 0;
        const roadmapProjects = (roadmap && roadmap.projects && roadmap.projects.length) ? roadmap.projects.length : 3;
        const roadmapProgress = roadmapProjects ? Math.min(100, Math.round((verifiedCount / roadmapProjects) * 100)) : 0;

        return (
            <div className="mx-auto mb-6 max-w-6xl rounded-3xl bg-gradient-to-r from-brand-50 to-accent-500/10 p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold text-slate-700">Strategic overview</p>
                        <h3 className="mt-1 text-2xl font-semibold text-slate-900">Your progress at a glance</h3>
                    </div>
                    <div className="flex gap-3">
                        <div className="rounded-2xl bg-white px-4 py-3 text-center">
                            <p className="text-sm text-slate-500">Projects</p>
                            <p className="mt-1 text-lg font-semibold text-slate-900">{totalProjects}</p>
                        </div>
                        <div className="rounded-2xl bg-white px-4 py-3 text-center">
                            <p className="text-sm text-slate-500">Verified</p>
                            <p className="mt-1 text-lg font-semibold text-slate-900">{verifiedCount}</p>
                        </div>
                        <div className="rounded-2xl bg-white px-4 py-3 text-center">
                            <p className="text-sm text-slate-500">Avg score</p>
                            <p className="mt-1 text-lg font-semibold text-slate-900">{avgScore || '—'}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <p className="text-sm text-slate-600">Roadmap progress</p>
                    <div className="mt-2 w-full rounded-full bg-slate-100/60 p-1">
                        <div style={{ width: `${roadmapProgress}%` }} className="rounded-full bg-gradient-to-r from-brand-600 to-accent-600 px-2 py-1 text-sm font-semibold text-white text-center">{roadmapProgress}%</div>
                    </div>
                </div>
            </div>
        );
    };

    const renderPortfolioPage = () => (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900">Your portfolio</h2>
                <p className="mt-3 text-slate-600">Track submitted work and view verification status across all projects.</p>
                <div className="mt-6 space-y-4">
                    {portfolio.length > 0 ? portfolio.map((item) => (
                        <div key={item.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <p className="text-lg font-semibold text-slate-900">{item.title}</p>
                                    <p className="mt-1 text-sm text-slate-600">{item.description || 'No description provided.'}</p>
                                </div>
                                <button onClick={() => verifyProject(item.projectId)} className="rounded-full bg-gradient-to-r from-brand-600 to-brand-500 px-4 py-2 text-xs font-semibold text-white hover:shadow-md transition">Verify work</button>
                            </div>
                        </div>
                    )) : <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-500">No portfolio items yet. Submit your first project from Overview.</div>}
                </div>
            </div>
        </div>
    );

    const renderSettingsPage = () => (
        <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900">Account settings</h2>
                <p className="mt-3 text-slate-600">Manage your profile details and notification preferences.</p>
                <div className="mt-6 space-y-4">
                    <label className="block text-sm font-medium text-slate-700">
                        Name
                        <input
                            value={settingsForm.name}
                            onChange={(event) => setSettingsForm((prev) => ({ ...prev, name: event.target.value }))}
                            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-brand-500"
                            placeholder="Your name"
                        />
                    </label>
                    <label className="block text-sm font-medium text-slate-700">
                        Email
                        <input
                            value={settingsForm.email}
                            onChange={(event) => setSettingsForm((prev) => ({ ...prev, email: event.target.value }))}
                            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-brand-500"
                            placeholder="you@example.com"
                            type="email"
                        />
                    </label>
                    <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                        <input
                            type="checkbox"
                            checked={settingsForm.notifications}
                            onChange={() => setSettingsForm((prev) => ({ ...prev, notifications: !prev.notifications }))}
                            className="h-5 w-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                        />
                        <span className="text-sm text-slate-700">Email notifications for roadmap updates and mentorship offers</span>
                    </label>
                    <button
                        onClick={() => {
                            setUser((prev) => ({ ...prev, name: settingsForm.name, email: settingsForm.email }));
                            localStorage.setItem('ordo_user', JSON.stringify({ ...user, name: settingsForm.name, email: settingsForm.email }));
                            setMessage('Settings saved successfully.');
                        }}
                        className="rounded-2xl bg-gradient-to-r from-brand-600 to-accent-600 px-5 py-3 text-sm font-semibold text-white transition hover:shadow-lg hover:from-brand-700 hover:to-accent-700"
                    >Save changes</button>
                </div>
            </div>
        </div>
    );

    const renderBrandLoader = () => (
        <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-2xl rounded-[2.5rem] bg-white/95 p-10 text-center shadow-2xl shadow-brand-500/10 ring-1 ring-slate-200 backdrop-blur-xl">
                <div className="relative mx-auto mb-8 h-32 w-32">
                    <div className="absolute inset-0 rounded-full bg-brand-600/10 blur-2xl animate-logo-glow" />
                    <div className="absolute inset-0 rounded-full border border-brand-300/30" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <img src="/logo.svg" alt="ORDO" className="h-20 w-20 rounded-full bg-slate-50 p-2 shadow-xl animate-logo-orbit" />
                    </div>
                    <span className="absolute -left-3 top-1/2 h-3 w-3 rounded-full bg-accent-500 shadow-lg shadow-accent-500/40 animate-logo-pulse" />
                    <span className="absolute right-1 top-6 h-3 w-3 rounded-full bg-brand-500 shadow-lg shadow-brand-500/40 animate-logo-pulse animation-delay-200" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-900">Preparing ORDO</h3>
                <p className="mt-3 text-slate-600">Loading your workspace, roadmap, and verified project tools with a premium brand experience.</p>
                <div className="mt-6 inline-flex items-center gap-3 rounded-full bg-slate-100 px-5 py-3 text-sm font-medium text-slate-600 shadow-sm">
                    <span className="inline-flex h-3 w-3 rounded-full bg-brand-600 animate-pulse" />
                    Stay tuned — everything is almost ready.
                </div>
            </div>
        </div>
    );

    const renderDashboardLoading = () => (
        <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
            <div className="flex flex-col items-center gap-5 rounded-3xl bg-white/95 p-10 text-center shadow-premium ring-1 ring-slate-200 backdrop-blur-xl">
                <div className="relative flex h-28 w-28 items-center justify-center animate-logo-bounce">
                    <div className="absolute inset-0 rounded-full animate-logo-pulse" style={{ background: 'radial-gradient(circle at center, rgba(59,130,246,0.18), rgba(99,102,241,0.06))' }} />
                    <img src="/logo.svg" alt="ORDO" className="relative h-20 w-20 animate-logo-spin" />
                </div>
                <div>
                    <p className="text-lg font-semibold text-slate-900">Refreshing ORDO</p>
                    <p className="mt-2 max-w-xs text-sm text-slate-500">Your dashboard is reloading with the latest career roadmap, verified project insights, and opportunity feed.</p>
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm font-medium text-brand-600">
                    <span className="inline-flex h-3 w-3 rounded-full bg-brand-600 animate-pulse" />
                    Loading workspace...
                </div>
            </div>
        </div>
    );

    const renderDashboardIntro = () => (
        <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
            <div className="relative w-full max-w-5xl overflow-hidden rounded-[2.5rem] border border-brand-100 bg-gradient-to-br from-brand-600 via-accent-600 to-slate-950 p-8 text-white shadow-2xl shadow-brand-500/20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.08),_transparent_35%)]" />
                <div className="absolute -right-20 top-0 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
                <div className="relative space-y-6">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-brand-200">Dashboard intro</p>
                            <h2 className="mt-3 text-3xl font-semibold">Welcome to your ORDO command center</h2>
                        </div>
                        <button
                            onClick={() => setDashboardIntro(false)}
                            className="rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                        >Skip intro</button>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-3">
                        {[
                            { label: 'Roadmap', description: 'Progress toward product milestones with visual guidance.' },
                            { label: 'Portfolio', description: 'Track submissions, reviews, and verified outcomes.' },
                            { label: 'Opportunities', description: 'See curated roles and hire-ready pathways.' },
                        ].map((item) => (
                            <div key={item.label} className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-sm transition hover:-translate-y-1 hover:bg-white/15">
                                <p className="text-sm uppercase tracking-[0.25em] text-brand-200">{item.label}</p>
                                <p className="mt-3 text-sm text-slate-100">{item.description}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 rounded-3xl bg-white/10 p-6 ring-1 ring-white/20">
                        <p className="text-sm text-slate-100">Your dashboard will surface verified projects, AI-guided insights, and a stronger path from learning to hire-ready career work.</p>
                        <div className="mt-4 flex flex-wrap gap-3">
                            <span className="rounded-full bg-white/15 px-4 py-2 text-xs text-white/80">Verified outcomes</span>
                            <span className="rounded-full bg-white/15 px-4 py-2 text-xs text-white/80">Mentor signals</span>
                            <span className="rounded-full bg-white/15 px-4 py-2 text-xs text-white/80">Portfolio growth</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderDashboard = () => (
        <div className="min-h-screen bg-slate-50 px-6 py-10">
            <div className="mx-auto max-w-6xl">
                {dashboardLoading ? renderDashboardLoading()
                    : dashboardIntro ? renderDashboardIntro()
                        : (
                            <>
                                {renderDashboardHeader()}

                                {message && <div className="mb-6 rounded-3xl bg-slate-100 px-5 py-4 text-slate-700 shadow-sm">{message}</div>}

                                {dashboardPage === 'overview'
                                    ? renderDashboardOverview()
                                    : dashboardPage === 'portfolio'
                                        ? renderPortfolioPage()
                                        : renderSettingsPage()}
                                {/* AI assistant lives in the right column under Overview */}
                                {dashboardPage === 'overview' && <AIAssistant />}
                            </>
                        )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <Header navigateWithLoader={navigateWithLoader} user={user} logout={logout} />

            <main>
                {pageLoading || initialLoading ? renderBrandLoader()
                    : view === 'landing' ? renderLanding()
                        : view === 'login' || view === 'signup' ? renderForm()
                            : view === 'dashboard' ? (user ? renderDashboard() : renderLanding())
                                : view === 'about' ? <About />
                                    : view === 'features' ? <Features />
                                        : view === 'contact' ? <Contact />
                                            : view === 'pricing' ? <Pricing />
                                                : view === 'docs' ? <Docs />
                                                    : view === 'guide' ? <Guide />
                                                        : view === 'terms' ? <Terms />
                                                            : view === 'privacy' ? <Privacy />
                                                                : view === 'project' ? <ProjectDetail />
                                                                    : view === 'verification' ? <Verification />
                                                                        : view === 'opportunities' ? <Opportunities />
                                                                            : view === 'admin' ? <Admin />
                                                                                : <NotFound />}
            </main>

            <Footer navigateWithLoader={navigateWithLoader} />
        </div>
    );
}

export default App;
