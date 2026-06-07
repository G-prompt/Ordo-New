const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PUBLIC_DIR = path.join(__dirname, 'public');
const DIST_DIR = path.join(__dirname, 'dist');
const STATIC_DIR = fs.existsSync(DIST_DIR) ? DIST_DIR : PUBLIC_DIR;
app.use(express.static(STATIC_DIR));

// Simple file-backed JSON store for prototype persistence
const DATA_FILE = path.join(__dirname, 'data.json');

function loadData() {
    try {
        const txt = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(txt);
    } catch (e) {
        return { users: {}, sessions: {}, projects: {}, portfolios: {}, verifications: {}, opportunities: [], mentors: {}, contacts: [] };
    }
}

function saveData(db) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
}

const db = loadData();

// Helpers
function authMiddleware(req, res, next) {
    const token = req.headers['authorization'];
    if (!token || !db.sessions[token]) return res.status(401).json({ error: 'Unauthorized' });
    req.user = db.users[db.sessions[token]];
    next();
}

// Auth
app.post('/api/v1/auth/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });
    const existing = Object.values(db.users).find(u => u.email === email);
    if (existing) return res.status(400).json({ error: 'user exists' });
    const id = uuidv4();
    const passwordHash = await bcrypt.hash(password, 8);
    db.users[id] = { id, name: name || '', email, passwordHash };
    saveData(db);
    return res.json({ id, name, email });
});

app.post('/api/v1/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user = Object.values(db.users).find(u => u.email === email);
    if (!user) return res.status(400).json({ error: 'invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(400).json({ error: 'invalid credentials' });
    const token = uuidv4();
    db.sessions[token] = user.id;
    saveData(db);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

// Onboard
app.post('/api/v1/onboard', authMiddleware, (req, res) => {
    const { goals, baselineSkills } = req.body;
    db.users[req.user.id].profile = { goals, baselineSkills };
    saveData(db);
    res.json({ ok: true, profile: db.users[req.user.id].profile });
});

// Career roadmap
app.post('/api/v1/career/roadmap', authMiddleware, (req, res) => {
    const { goal } = req.body;
    // Prototype: return static roadmap
    const roadmap = {
        goal,
        skills: ['Problem Solving', 'Algorithms', 'Data Structures', 'Web Development'],
        courses: ['Intro to CS', 'Web Dev 101'],
        projects: [
            { id: 'proj-1', title: 'Personal Portfolio', difficulty: 'easy' },
            { id: 'proj-2', title: 'Team Project: Marketplace', difficulty: 'medium' }
        ]
    };
    res.json(roadmap);
});

// Projects
app.get('/api/v1/projects/recommendations', authMiddleware, (req, res) => {
    res.json(Object.values(db.projects));
});

app.get('/api/v1/projects', authMiddleware, (req, res) => {
    res.json(Object.values(db.projects));
});

app.post('/api/v1/projects/submit', authMiddleware, (req, res) => {
    const { title, description, repositoryUrl } = req.body;
    const id = uuidv4();
    const project = { id, ownerId: req.user.id, title, description, repositoryUrl, createdAt: new Date() };
    db.projects[id] = project;
    // add to portfolio
    db.portfolios[req.user.id] = db.portfolios[req.user.id] || [];
    db.portfolios[req.user.id].push({ id: uuidv4(), projectId: id, title, description, createdAt: new Date() });
    saveData(db);
    res.json(project);
});

app.get('/api/v1/portfolio/:userId', (req, res) => {
    const items = db.portfolios[req.params.userId] || [];
    res.json(items);
});

app.get('/api/v1/portfolio', authMiddleware, (req, res) => {
    const items = db.portfolios[req.user.id] || [];
    res.json(items);
});

// Opportunity feed (prototype static)
app.get('/api/v1/opportunities/feed', authMiddleware, (req, res) => {
    if (!db.opportunities || db.opportunities.length === 0) {
        db.opportunities = [
            { id: 'opp-1', title: 'Frontend Internship', company: 'Tech Co', location: 'Remote' },
            { id: 'opp-2', title: 'Research Assistant', company: 'University Lab', location: 'Accra' }
        ];
        saveData(db);
    }
    res.json(db.opportunities);
});

// Simple verification endpoint
app.post('/api/v1/verify/assess', authMiddleware, (req, res) => {
    const { projectId } = req.body;
    if (!db.projects[projectId]) return res.status(404).json({ error: 'project not found' });
    const score = Math.floor(Math.random() * 40) + 60;
    const record = { id: uuidv4(), projectId, assessor: 'AI', score, verifiedAt: new Date(), assessorId: 'ai' };
    db.verifications[record.id] = record;
    // attach to project
    db.projects[projectId].verifications = db.projects[projectId].verifications || [];
    db.projects[projectId].verifications.push(record.id);
    saveData(db);
    res.json(record);
});

// Peer review submission
app.post('/api/v1/review/submit', authMiddleware, (req, res) => {
    const { projectId, score, comment } = req.body;
    if (!db.projects[projectId]) return res.status(404).json({ error: 'project not found' });
    const record = { id: uuidv4(), projectId, assessor: 'peer', assessorId: req.user.id, score, comment, verifiedAt: new Date() };
    db.verifications[record.id] = record;
    db.projects[projectId].verifications = db.projects[projectId].verifications || [];
    db.projects[projectId].verifications.push(record.id);
    saveData(db);
    res.json(record);
});

// Return verification records for the authenticated user's projects
app.get('/api/v1/verifications', authMiddleware, (req, res) => {
    const all = Object.values(db.verifications || {});
    const filtered = all.filter((v) => db.projects[v.projectId] && db.projects[v.projectId].ownerId === req.user.id);
    res.json(filtered);
});

// AI assistant proxy — requires VUYAR_API_KEY environment variable
app.post('/api/v1/ai/assist', authMiddleware, async (req, res) => {
    // Require GEMINI_API_KEY (remove backward-compatible fallback)
    const key = process.env.GEMINI_API_KEY;
    if (!key) return res.status(501).json({ error: 'AI API key not configured on server (set GEMINI_API_KEY)' });
    const { prompt } = req.body || {};
    if (!prompt) return res.status(400).json({ error: 'prompt required' });

    try {
        const response = await fetch('https://api.openai.com/v1/responses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${key}`,
            },
            body: JSON.stringify({
                model: 'gemini-1.5',
                input: prompt,
                max_output_tokens: 512,
                temperature: 0.2,
            }),
        });

        const data = await response.json().catch(() => ({}));
        const text = data.output?.[0]?.content?.find((item) => item.type === 'output_text')?.text
            || data.output_text
            || data.choices?.[0]?.message?.content
            || JSON.stringify(data);
        res.json({ response: text });
    } catch (err) {
        res.status(500).json({ error: err.message || 'AI proxy error' });
    }
});

// Lightweight demo endpoint available to unauthenticated users for testing the assistant UI.
app.get('/api/v1/ai/demo', (req, res) => {
    const sample = `Hello — this is a demo response from ORDO's AI assistant.\n\nTry signing in to get personalized advice based on your portfolio and roadmap.`;
    res.json({ response: sample });
});

// Mentor request (simple match)
app.post('/api/v1/mentors/request', authMiddleware, (req, res) => {
    const { topic } = req.body;
    // simple round-robin or static mentor
    const mentor = { id: 'mentor-1', name: 'Senior Mentor', topics: ['Web', 'AI'] };
    db.mentors[req.user.id] = { mentor, requestedAt: new Date(), topic };
    saveData(db);
    res.json({ assigned: mentor });
});

// Contact form (public)
app.post('/api/v1/contact', (req, res) => {
    const { name, email, message } = req.body || {};
    if (!message || !message.toString().trim()) {
        return res.status(400).json({ error: 'message is required' });
    }
    db.contacts = db.contacts || [];
    const entry = { id: uuidv4(), name: name || 'Anonymous', email: email || null, message: message.toString().trim(), createdAt: new Date() };
    db.contacts.push(entry);
    saveData(db);
    res.json({ ok: true, id: entry.id });
});

// Basic user profile
app.get('/api/v1/users/me', authMiddleware, (req, res) => {
    const { id, name, email, profile } = req.user;
    res.json({ id, name, email, profile: profile || null });
});

// Serve frontend for any app route that is not an API call
app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'Not found' });
    }
    res.sendFile(path.join(STATIC_DIR, 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('ORDO prototype server listening on', port));
