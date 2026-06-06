import { useState, useEffect } from "react";

const SYSTEM_PROMPT = `You are an expert AI Agent Builder. When a user describes what kind of agent they want, generate a complete, ready-to-use AI Agent specification in JSON format.

Return ONLY valid JSON (no markdown, no backticks) with this exact structure:
{
  "agentName": "Name of the agent",
  "tagline": "One-line description",
  "role": "What this agent does",
  "personality": "How the agent behaves",
  "systemPrompt": "Full system prompt (150-200 words)",
  "capabilities": ["cap 1", "cap 2", "cap 3", "cap 4", "cap 5"],
  "tools": ["tool 1", "tool 2", "tool 3"],
  "exampleTasks": ["task 1", "task 2", "task 3"],
  "bestFor": "Who should use this agent",
  "tone": "professional",
  "avatar": "emoji"
}`;

const MOCK_AGENTS = [
  { id: 1, agentName: "SupportBot Pro", avatar: "🎧", tagline: "24/7 customer support specialist", tone: "friendly", createdAt: "2 days ago", uses: 47 },
  { id: 2, agentName: "CodeReviewer X", avatar: "🔍", tagline: "Senior code review & debugging assistant", tone: "technical", createdAt: "5 days ago", uses: 23 },
  { id: 3, agentName: "ContentCraft AI", avatar: "✍️", tagline: "Social media & blog content creator", tone: "casual", createdAt: "1 week ago", uses: 89 },
];

const NAV_ITEMS = [
  { id: "overview", icon: "⬡", label: "Overview" },
  { id: "generator", icon: "⚡", label: "Build Agent" },
  { id: "agents", icon: "◈", label: "My Agents" },
  { id: "templates", icon: "📋", label: "Templates" },
  { id: "chaining", icon: "🔀", label: "Agent Chaining" },
  { id: "voice", icon: "🎙️", label: "Voice Agent" },
  { id: "memory", icon: "🧠", label: "Memory System" },
  { id: "analytics", icon: "📊", label: "Analytics" },
  { id: "creator", icon: "🎨", label: "Content Creator" },
  { id: "marketplace", icon: "🛒", label: "Marketplace" },
  { id: "integrations", icon: "🔗", label: "Integrations" },
  { id: "language", icon: "🌐", label: "Languages" },
  { id: "team", icon: "👥", label: "Team" },
  { id: "billing", icon: "◎", label: "Billing" },
  { id: "affiliate", icon: "🤝", label: "Affiliate" },
  { id: "settings", icon: "⚙", label: "Settings" },
];

const AGENT_TEMPLATES = [
  { id: "t1", name: "HR Bot", avatar: "👥", category: "HR", description: "Screen resumes, schedule interviews, answer policy questions", tags: ["Recruiting", "Onboarding", "Policy"], color: "#818cf8", prompt: "An HR assistant that screens resumes, schedules interviews, and answers HR policy questions" },
  { id: "t2", name: "Sales Bot", avatar: "💼", category: "Sales", description: "Lead qualification, follow-ups, CRM updates, objection handling", tags: ["Leads", "CRM", "Outreach"], color: "#34d399", prompt: "A sales assistant that qualifies leads, handles objections, and manages follow-up outreach" },
  { id: "t3", name: "Legal Assistant", avatar: "⚖️", category: "Legal", description: "Contract review, clause analysis, legal document drafting", tags: ["Contracts", "Compliance", "Drafting"], color: "#fbbf24", prompt: "A legal assistant that reviews contracts, analyzes clauses, and helps draft legal documents" },
  { id: "t4", name: "SEO Writer", avatar: "🔮", category: "Content", description: "Keyword research, SEO-optimized articles, meta descriptions", tags: ["Keywords", "Articles", "Meta"], color: "#c084fc", prompt: "An SEO writer that researches keywords, writes optimized articles, and creates meta descriptions" },
  { id: "t5", name: "Customer Support", avatar: "🎧", category: "Support", description: "24/7 ticket handling, FAQ responses, escalation routing", tags: ["Tickets", "FAQ", "Escalation"], color: "#60a5fa", prompt: "A customer support agent that handles tickets, answers FAQs, and routes complex issues" },
  { id: "t6", name: "Finance Advisor", avatar: "💹", category: "Finance", description: "Budget analysis, expense tracking, financial report summaries", tags: ["Budget", "Reports", "Tracking"], color: "#f472b6", prompt: "A finance advisor that analyzes budgets, tracks expenses, and summarizes financial reports" },
  { id: "t7", name: "Code Reviewer", avatar: "🔍", category: "Dev", description: "PR reviews, bug detection, code quality suggestions", tags: ["Code Review", "Bugs", "Quality"], color: "#a78bfa", prompt: "A senior code reviewer that reviews pull requests, detects bugs, and suggests improvements" },
  { id: "t8", name: "Email Marketer", avatar: "📧", category: "Marketing", description: "Campaign copy, subject lines, A/B test variants", tags: ["Campaigns", "Copywriting", "A/B"], color: "#fb923c", prompt: "An email marketing assistant that writes campaign copy, subject lines, and A/B test variants" },
];

const MARKETPLACE_AGENTS = [
  { id: 101, agentName: "SupportBot Pro", avatar: "🎧", tagline: "24/7 customer support specialist", tone: "friendly", category: "Support", price: 9, rating: 4.8, reviews: 312, seller: "TechFlow Studio", downloads: 1420, featured: true },
  { id: 102, agentName: "SEO Wizard", avatar: "🔮", tagline: "Boost rankings with AI-driven SEO strategy", tone: "professional", category: "Marketing", price: 14, rating: 4.9, reviews: 189, seller: "GrowthLab", downloads: 890, featured: true },
  { id: 103, agentName: "CodeReviewer X", avatar: "🔍", tagline: "Senior-level code review & debugging", tone: "technical", category: "Development", price: 19, rating: 4.7, reviews: 97, seller: "DevForge", downloads: 540 },
  { id: 104, agentName: "ContentCraft AI", avatar: "✍️", tagline: "Social media & blog content at scale", tone: "casual", category: "Content", price: 12, rating: 4.6, reviews: 445, seller: "CreativeAI", downloads: 2100, featured: true },
  { id: 105, agentName: "HR Recruit Agent", avatar: "👥", tagline: "Screen resumes & schedule interviews", tone: "professional", category: "HR", price: 22, rating: 4.5, reviews: 63, seller: "HireBot Inc", downloads: 310 },
  { id: 106, agentName: "Finance Advisor", avatar: "💹", tagline: "Budget tracking & financial insights", tone: "professional", category: "Finance", price: 17, rating: 4.8, reviews: 128, seller: "FinTech AI", downloads: 670 },
  { id: 107, agentName: "Legal Eagle", avatar: "⚖️", tagline: "Contract review & legal document assistant", tone: "professional", category: "Legal", price: 29, rating: 4.9, reviews: 44, seller: "LexAI", downloads: 220 },
  { id: 108, agentName: "FitCoach Pro", avatar: "💪", tagline: "Personal fitness plans & nutrition guide", tone: "friendly", category: "Health", price: 8, rating: 4.4, reviews: 267, seller: "WellBot", downloads: 1850 },
];

const CATEGORIES = ["All", "Support", "Marketing", "Development", "Content", "HR", "Finance", "Legal", "Health"];

const PLANS = [
  {
    name: "Free", price: 0, period: "forever", color: "#94a3b8", glow: "rgba(148,163,184,0.2)",
    features: ["3 agents/month", "Basic templates", "JSON export", "Email support"],
    limit: "3 agents",
  },
  {
    name: "Pro", price: 19, period: "month", color: "#818cf8", glow: "rgba(129,140,248,0.35)",
    features: ["Unlimited agents", "All templates", "JSON + API export", "Priority support", "Save & organize agents", "Advanced AI model"],
    limit: "Unlimited", popular: true,
  },
  {
    name: "Business", price: 49, period: "month", color: "#c084fc", glow: "rgba(192,132,252,0.35)",
    features: ["Everything in Pro", "5 team seats", "Custom branding", "Dedicated support", "API access", "Analytics dashboard", "SLA guarantee"],
    limit: "Unlimited",
  },
];


const LANGUAGES = [
  { code: "en", name: "English", flag: "🇬🇧", native: "English" },
  { code: "ur", name: "Urdu", flag: "🇵🇰", native: "اردو" },
  { code: "hi", name: "Hindi", flag: "🇮🇳", native: "हिंदी" },
  { code: "ar", name: "Arabic", flag: "🇸🇦", native: "العربية", rtl: true },
  { code: "zh", name: "Chinese", flag: "🇨🇳", native: "中文" },
  { code: "es", name: "Spanish", flag: "🇪🇸", native: "Español" },
  { code: "fr", name: "French", flag: "🇫🇷", native: "Français" },
  { code: "de", name: "German", flag: "🇩🇪", native: "Deutsch" },
  { code: "pt", name: "Portuguese", flag: "🇧🇷", native: "Português" },
  { code: "ru", name: "Russian", flag: "🇷🇺", native: "Русский" },
  { code: "ja", name: "Japanese", flag: "🇯🇵", native: "日本語" },
  { code: "ko", name: "Korean", flag: "🇰🇷", native: "한국어" },
  { code: "tr", name: "Turkish", flag: "🇹🇷", native: "Türkçe" },
  { code: "id", name: "Indonesian", flag: "🇮🇩", native: "Bahasa Indonesia" },
  { code: "bn", name: "Bengali", flag: "🇧🇩", native: "বাংলা" },
];

const UI_STRINGS = {
  en: { welcome: "Welcome back", overview: "Overview", buildAgent: "Build Agent", myAgents: "My Agents", marketplace: "Marketplace", integrations: "Integrations", billing: "Billing", settings: "Settings", upgrade: "UPGRADE", startBuilding: "START BUILDING →", totalAgents: "Total Agents", agentUses: "Agent Uses", thisMonth: "This Month", plan: "Plan" },
  ur: { welcome: "خوش آمدید واپس", overview: "جائزہ", buildAgent: "ایجنٹ بنائیں", myAgents: "میرے ایجنٹس", marketplace: "بازار", integrations: "انضمام", billing: "بلنگ", settings: "ترتیبات", upgrade: "اپ گریڈ", startBuilding: "بنانا شروع کریں ←", totalAgents: "کل ایجنٹس", agentUses: "ایجنٹ استعمال", thisMonth: "اس مہینے", plan: "پلان" },
  hi: { welcome: "वापस स्वागत है", overview: "अवलोकन", buildAgent: "एजेंट बनाएं", myAgents: "मेरे एजेंट", marketplace: "बाजार", integrations: "एकीकरण", billing: "बिलिंग", settings: "सेटिंग्स", upgrade: "अपग्रेड", startBuilding: "बनाना शुरू करें →", totalAgents: "कुल एजेंट", agentUses: "एजेंट उपयोग", thisMonth: "इस महीने", plan: "प्लान" },
  ar: { welcome: "مرحباً بعودتك", overview: "نظرة عامة", buildAgent: "بناء وكيل", myAgents: "وكلائي", marketplace: "السوق", integrations: "التكاملات", billing: "الفواتير", settings: "الإعدادات", upgrade: "ترقية", startBuilding: "← ابدأ البناء", totalAgents: "إجمالي الوكلاء", agentUses: "استخدامات الوكيل", thisMonth: "هذا الشهر", plan: "الخطة" },
  zh: { welcome: "欢迎回来", overview: "概览", buildAgent: "构建代理", myAgents: "我的代理", marketplace: "市场", integrations: "集成", billing: "账单", settings: "设置", upgrade: "升级", startBuilding: "开始构建 →", totalAgents: "总代理数", agentUses: "代理使用次数", thisMonth: "本月", plan: "计划" },
  es: { welcome: "Bienvenido de nuevo", overview: "Resumen", buildAgent: "Crear Agente", myAgents: "Mis Agentes", marketplace: "Mercado", integrations: "Integraciones", billing: "Facturación", settings: "Configuración", upgrade: "MEJORAR", startBuilding: "EMPEZAR →", totalAgents: "Total Agentes", agentUses: "Usos del Agente", thisMonth: "Este Mes", plan: "Plan" },
  fr: { welcome: "Bon retour", overview: "Aperçu", buildAgent: "Créer Agent", myAgents: "Mes Agents", marketplace: "Marché", integrations: "Intégrations", billing: "Facturation", settings: "Paramètres", upgrade: "AMÉLIORER", startBuilding: "COMMENCER →", totalAgents: "Total Agents", agentUses: "Utilisations", thisMonth: "Ce Mois", plan: "Plan" },
  de: { welcome: "Willkommen zurück", overview: "Übersicht", buildAgent: "Agent erstellen", myAgents: "Meine Agents", marketplace: "Marktplatz", integrations: "Integrationen", billing: "Abrechnung", settings: "Einstellungen", upgrade: "UPGRADE", startBuilding: "LOSLEGEN →", totalAgents: "Gesamt Agents", agentUses: "Agent Nutzung", thisMonth: "Diesen Monat", plan: "Plan" },
  pt: { welcome: "Bem-vindo de volta", overview: "Visão Geral", buildAgent: "Criar Agente", myAgents: "Meus Agentes", marketplace: "Mercado", integrations: "Integrações", billing: "Faturamento", settings: "Configurações", upgrade: "MELHORAR", startBuilding: "COMEÇAR →", totalAgents: "Total de Agentes", agentUses: "Usos do Agente", thisMonth: "Este Mês", plan: "Plano" },
  ru: { welcome: "Добро пожаловать", overview: "Обзор", buildAgent: "Создать агента", myAgents: "Мои агенты", marketplace: "Маркетплейс", integrations: "Интеграции", billing: "Оплата", settings: "Настройки", upgrade: "УЛУЧШИТЬ", startBuilding: "НАЧАТЬ →", totalAgents: "Всего агентов", agentUses: "Использований", thisMonth: "В этом месяце", plan: "План" },
  ja: { welcome: "おかえりなさい", overview: "概要", buildAgent: "エージェント作成", myAgents: "マイエージェント", marketplace: "マーケット", integrations: "連携", billing: "請求", settings: "設定", upgrade: "アップグレード", startBuilding: "開始する →", totalAgents: "総エージェント数", agentUses: "使用回数", thisMonth: "今月", plan: "プラン" },
  ko: { welcome: "다시 오신 걸 환영합니다", overview: "개요", buildAgent: "에이전트 만들기", myAgents: "내 에이전트", marketplace: "마켓플레이스", integrations: "연동", billing: "결제", settings: "설정", upgrade: "업그레이드", startBuilding: "시작하기 →", totalAgents: "전체 에이전트", agentUses: "사용 횟수", thisMonth: "이번 달", plan: "플랜" },
  tr: { welcome: "Tekrar hoş geldiniz", overview: "Genel Bakış", buildAgent: "Ajan Oluştur", myAgents: "Ajanlarım", marketplace: "Pazar Yeri", integrations: "Entegrasyonlar", billing: "Faturalama", settings: "Ayarlar", upgrade: "YÜKSELT", startBuilding: "BAŞLA →", totalAgents: "Toplam Ajan", agentUses: "Ajan Kullanımı", thisMonth: "Bu Ay", plan: "Plan" },
  id: { welcome: "Selamat datang kembali", overview: "Ikhtisar", buildAgent: "Buat Agen", myAgents: "Agen Saya", marketplace: "Pasar", integrations: "Integrasi", billing: "Penagihan", settings: "Pengaturan", upgrade: "TINGKATKAN", startBuilding: "MULAI →", totalAgents: "Total Agen", agentUses: "Penggunaan Agen", thisMonth: "Bulan Ini", plan: "Paket" },
  bn: { welcome: "আবার স্বাগতম", overview: "সংক্ষিপ্ত বিবরণ", buildAgent: "এজেন্ট তৈরি করুন", myAgents: "আমার এজেন্ট", marketplace: "বাজার", integrations: "ইন্টিগ্রেশন", billing: "বিলিং", settings: "সেটিংস", upgrade: "আপগ্রেড", startBuilding: "শুরু করুন →", totalAgents: "মোট এজেন্ট", agentUses: "এজেন্ট ব্যবহার", thisMonth: "এই মাসে", plan: "পরিকল্পনা" },
};

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState("overview");
  const [prompt, setPrompt] = useState("");
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savedAgents, setSavedAgents] = useState(MOCK_AGENTS);
  const [copied, setCopied] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("Pro");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [agentCount, setAgentCount] = useState(3);
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [selectedCoin, setSelectedCoin] = useState("BTC");
  const [marketCategory, setMarketCategory] = useState("All");
  const [marketSearch, setMarketSearch] = useState("");
  const [purchasedAgents, setPurchasedAgents] = useState([]);
  const [integrationSearch, setIntegrationSearch] = useState("");
  const [connectedApps, setConnectedApps] = useState(["slack"]);
  const [activeIntegTab, setActiveIntegTab] = useState("all");
  const [testingBot, setTestingBot] = useState(null);
  const [testMsg, setTestMsg] = useState("");
  const [testChat, setTestChat] = useState([]);
  const [testLoading, setTestLoading] = useState(false);
  const [uiLang, setUiLang] = useState("en");
  const [agentLang, setAgentLang] = useState(["en"]);
  const [translateLoading, setTranslateLoading] = useState(false);
  const [translatedText, setTranslatedText] = useState("");
  const [translateInput, setTranslateInput] = useState("");
  const [translateFrom, setTranslateFrom] = useState("en");
  const [translateTo, setTranslateTo] = useState("ur");
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: "Rahul Kumar", email: "rahul@example.com", role: "Admin", avatar: "R", color: "#6366f1", status: "online", joined: "Owner", agents: 8, lastActive: "Now" },
    { id: 2, name: "Ayesha Shah", email: "ayesha@company.com", role: "Editor", avatar: "A", color: "#a855f7", status: "online", joined: "3 days ago", agents: 4, lastActive: "2m ago" },
    { id: 3, name: "James Wilson", email: "james@company.com", role: "Viewer", avatar: "J", color: "#34d399", status: "away", joined: "1 week ago", agents: 1, lastActive: "1h ago" },
    { id: 4, name: "Sara Ahmed", email: "sara@company.com", role: "Editor", avatar: "S", color: "#fbbf24", status: "offline", joined: "2 weeks ago", agents: 3, lastActive: "Yesterday" },
  ]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Viewer");
  const [inviteSent, setInviteSent] = useState(false);
  const [teamTab, setTeamTab] = useState("members");
  const [activityFeed] = useState([
    { user: "Ayesha", action: "created agent", target: "Sales Outreach Bot", time: "5m ago", icon: "⚡" },
    { user: "James", action: "viewed agent", target: "SupportBot Pro", time: "22m ago", icon: "👁" },
    { user: "Sara", action: "exported agent", target: "ContentCraft AI", time: "1h ago", icon: "⬇" },
    { user: "Ayesha", action: "bought from marketplace", target: "SEO Wizard", time: "2h ago", icon: "🛒" },
    { user: "Rahul", action: "upgraded plan", target: "Pro Plan", time: "1d ago", icon: "⭐" },
    { user: "James", action: "connected integration", target: "Slack", time: "2d ago", icon: "🔗" },
  ]);
  const [previewAgent, setPreviewAgent] = useState(null);
  const [savedToast, setSavedToast] = useState(false);

  // Templates
  const [templateCategory, setTemplateCategory] = useState("All");

  // Chaining
  const [chainSteps, setChainSteps] = useState([
    { id: 1, agent: "ContentCraft AI", avatar: "✍️", output: "Blog Draft", trigger: "On Complete" },
    { id: 2, agent: "SEO Wizard", avatar: "🔮", output: "SEO Report", trigger: "Auto" },
  ]);
  const [chainRunning, setChainRunning] = useState(false);
  const [chainProgress, setChainProgress] = useState(0);

  // Voice Agent
  const [voiceLoading, setVoiceLoading] = useState(false);
  const [voiceInput, setVoiceInput] = useState("");
  const [voiceChat, setVoiceChat] = useState([]);
  const [selectedVoiceAgent, setSelectedVoiceAgent] = useState("SupportBot Pro");
  const [voiceListening, setVoiceListening] = useState(false);

  // Memory System
  const [memories, setMemories] = useState([
    { id: 1, agent: "SupportBot Pro", avatar: "🎧", key: "User prefers email over phone", type: "preference", time: "2h ago", active: true },
    { id: 2, agent: "ContentCraft AI", avatar: "✍️", key: "Brand tone: casual, Gen-Z friendly", type: "context", time: "1d ago", active: true },
    { id: 3, agent: "CodeReviewer X", avatar: "🔍", key: "Project uses TypeScript strict mode", type: "technical", time: "3d ago", active: true },
    { id: 4, agent: "SEO Wizard", avatar: "🔮", key: "Target audience: B2B SaaS founders", type: "context", time: "5d ago", active: false },
    { id: 5, agent: "SupportBot Pro", avatar: "🎧", key: "VIP customer: rahul@example.com", type: "user", time: "1w ago", active: true },
  ]);
  const [newMemoryKey, setNewMemoryKey] = useState("");
  const [newMemoryAgent, setNewMemoryAgent] = useState("SupportBot Pro");
  const [memoryFilter, setMemoryFilter] = useState("all");

  // Analytics
  const [analyticsTab, setAnalyticsTab] = useState("usage");
  const [roiHours, setRoiHours] = useState(40);
  const [roiRate, setRoiRate] = useState(25);
  const [roiAgents, setRoiAgents] = useState(3);

  // Agent Comments & Version History
  const [agentComments, setAgentComments] = useState({
    1: [
      { id: 1, author: "Ayesha", avatar: "A", color: "#a855f7", text: "This bot needs a friendlier tone for refund queries", time: "1h ago" },
      { id: 2, author: "James", avatar: "J", color: "#34d399", text: "Works great for tier-1 support tickets!", time: "3h ago" },
    ],
    2: [{ id: 3, author: "Sara", avatar: "S", color: "#fbbf24", text: "Add more technical depth for senior devs", time: "2d ago" }],
  });
  const [newComment, setNewComment] = useState("");
  const [commentAgentId, setCommentAgentId] = useState(null);
  const [versionHistory] = useState({
    1: [
      { version: "v1.3", date: "Today 2:00PM", note: "Updated tone to friendly", author: "Rahul" },
      { version: "v1.2", date: "Yesterday", note: "Added refund handling capability", author: "Ayesha" },
      { version: "v1.1", date: "3 days ago", note: "Fixed escalation routing logic", author: "Rahul" },
      { version: "v1.0", date: "1 week ago", note: "Initial agent created", author: "Rahul" },
    ],
    2: [
      { version: "v2.1", date: "2 days ago", note: "Added TypeScript support", author: "James" },
      { version: "v2.0", date: "5 days ago", note: "Upgraded to GPT-4 level prompts", author: "Rahul" },
    ],
  });
  const [selectedVersionAgent, setSelectedVersionAgent] = useState(null);
  const [showCommentModal, setShowCommentModal] = useState(false);

  // Affiliate Program
  const AFFILIATE_CODE = "RAHUL-AI-2026";
  const AFFILIATE_LINK = `https://buildagent.ai/ref/${AFFILIATE_CODE}`;
  const [affiliateCopied, setAffiliateCopied] = useState(false);
  const [affiliateTab, setAffiliateTab] = useState("dashboard");
  const [affiliateReferrals] = useState([
    { id: 1, name: "Zara Sheikh", email: "zara@startup.com", plan: "Pro", status: "active", joined: "3 days ago", commission: 3.80, paid: true },
    { id: 2, name: "Ahmed Raza", email: "ahmed@agency.pk", plan: "Business", status: "active", joined: "1 week ago", commission: 9.80, paid: true },
    { id: 3, name: "Priya Sharma", email: "priya@tech.in", plan: "Pro", status: "active", joined: "2 weeks ago", commission: 3.80, paid: false },
    { id: 4, name: "Carlos M.", email: "carlos@es.com", plan: "Pro", status: "pending", joined: "3 weeks ago", commission: 3.80, paid: false },
    { id: 5, name: "Liu Wei", email: "liu@cn.co", plan: "Business", status: "active", joined: "1 month ago", commission: 9.80, paid: true },
  ]);


  // Content Creator
  const [creatorTab, setCreatorTab] = useState("calendar");
  const [calendarPosts, setCalendarPosts] = useState([
    { id: 1, date: "Mon, Jun 9", platform: "Instagram", type: "Reel", title: "5 AI Tools for Creators", status: "scheduled", color: "#e1306c" },
    { id: 2, date: "Tue, Jun 10", platform: "YouTube", type: "Short", title: "How I Built My AI Agent", status: "draft", color: "#ff0000" },
    { id: 3, date: "Wed, Jun 11", platform: "TikTok", type: "Video", title: "ChatGPT vs Claude Comparison", status: "scheduled", color: "#69c9d0" },
    { id: 4, date: "Thu, Jun 12", platform: "LinkedIn", type: "Post", title: "AI in Business - Thread", status: "published", color: "#0077b5" },
    { id: 5, date: "Fri, Jun 13", platform: "Instagram", type: "Carousel", title: "Top 10 Prompts for 2026", status: "draft", color: "#e1306c" },
    { id: 6, date: "Sat, Jun 14", platform: "YouTube", type: "Video", title: "Full Tutorial: Agent Builder", status: "scheduled", color: "#ff0000" },
  ]);
  const [repurposeInput, setRepurposeInput] = useState("");
  const [repurposeLoading, setRepurposeLoading] = useState(false);
  const [repurposeResults, setRepurposeResults] = useState(null);
  const [selectedPlatformTemplate, setSelectedPlatformTemplate] = useState("youtube");
  const userPlan = "Free";
  const userName = "Rahul";

  // UI_STRINGS safe accessor — falls back to English for any missing language
  const t = UI_STRINGS[uiLang] || UI_STRINGS["en"];

  const buildAgent = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setAgent(null);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: `Build me an AI agent for: ${prompt}` }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map((c) => c.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setAgent(parsed);
      setAgentCount((p) => p + 1);
    } catch (err) {
      console.error("buildAgent error:", err);
      setAgent({ error: true });
    } finally {
      setLoading(false);
    }
  };

  const saveAgent = () => {
    if (!agent || agent.error) return;
    const newAgent = { ...agent, id: Date.now(), createdAt: "Just now", uses: 0 };
    setSavedAgents((p) => [newAgent, ...p]);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  const copyText = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  };

  const toneColor = {
    professional: "#60a5fa",
    friendly: "#34d399",
    casual: "#fbbf24",
    technical: "#a78bfa",
    empathetic: "#f472b6"
  };

  // Premium CSS variables and global styles
  const premiumStyles = `
    :root {
      --bg-void: #03050d;
      --bg-deep: #060a16;
      --bg-surface: #0a1020;
      --bg-raised: #0f1829;
      --bg-hover: #141f33;
      --border-subtle: rgba(99,102,241,0.08);
      --border-dim: rgba(99,102,241,0.14);
      --border-glow: rgba(99,102,241,0.3);
      --gold: #f5c842;
      --gold-dim: rgba(245,200,66,0.12);
      --gold-border: rgba(245,200,66,0.25);
      --indigo: #6366f1;
      --violet: #8b5cf6;
      --violet-bright: #a855f7;
      --text-primary: #e8eaf2;
      --text-secondary: #6b7280;
      --text-muted: #374151;
      --radius-sm: 8px;
      --radius-md: 12px;
      --radius-lg: 16px;
      --radius-xl: 20px;
    }

    * { box-sizing: border-box; }

    body { margin: 0; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.45} }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position:  200% center; }
    }
    @keyframes orb {
      0%, 100% { transform: translate(0,0) scale(1); }
      33%       { transform: translate(30px,-20px) scale(1.08); }
      66%       { transform: translate(-20px, 15px) scale(0.95); }
    }
    @keyframes glowPulse {
      0%,100% { box-shadow: 0 0 20px rgba(99,102,241,0.15), 0 0 60px rgba(99,102,241,0.05); }
      50%      { box-shadow: 0 0 35px rgba(99,102,241,0.3),  0 0 80px rgba(99,102,241,0.12); }
    }
    @keyframes borderShimmer {
      0%,100% { opacity: 0.5; }
      50%      { opacity: 1; }
    }

    .nav-item {
      transition: all 0.2s cubic-bezier(0.4,0,0.2,1);
    }
    .nav-item:hover {
      background: rgba(99,102,241,0.08) !important;
      color: #c7c9f9 !important;
    }
    .nav-item.active {
      background: linear-gradient(90deg, rgba(99,102,241,0.18), rgba(99,102,241,0.06)) !important;
      color: #818cf8 !important;
      border-left: 2px solid #6366f1 !important;
    }

    .glass-card {
      background: rgba(10,16,32,0.75);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--border-dim);
      transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
    }
    .glass-card:hover {
      border-color: var(--border-glow);
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(99,102,241,0.1);
    }

    .agent-card {
      background: rgba(10,16,32,0.75);
      border: 1px solid var(--border-subtle);
      transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
    }
    .agent-card:hover {
      border-color: rgba(99,102,241,0.35) !important;
      background: rgba(99,102,241,0.07) !important;
      box-shadow: 0 4px 24px rgba(0,0,0,0.3), 0 0 30px rgba(99,102,241,0.06);
      transform: translateY(-2px);
    }

    .plan-card {
      transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
    }
    .plan-card:hover {
      transform: translateY(-6px);
      box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(99,102,241,0.12);
    }

    .action-btn {
      transition: all 0.2s cubic-bezier(0.4,0,0.2,1);
    }
    .action-btn:hover {
      opacity: 0.9;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(99,102,241,0.35);
    }

    .gold-btn {
      transition: all 0.2s cubic-bezier(0.4,0,0.2,1);
    }
    .gold-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 24px rgba(245,200,66,0.35);
    }

    .shimmer-text {
      background: linear-gradient(90deg, #818cf8, #c084fc, #f5c842, #c084fc, #818cf8);
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: shimmer 4s linear infinite;
    }

    .example-chip {
      transition: all 0.2s;
    }
    .example-chip:hover {
      background: rgba(99,102,241,0.18) !important;
      color: #a5b4fc !important;
      border-color: rgba(99,102,241,0.35) !important;
    }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: var(--bg-void); }
    ::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.25); border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(99,102,241,0.4); }

    textarea:focus, input:focus {
      border-color: rgba(99,102,241,0.45) !important;
      outline: none;
      box-shadow: 0 0 0 3px rgba(99,102,241,0.08);
    }

    .stat-card {
      position: relative;
      overflow: hidden;
      transition: all 0.25s;
    }
    .stat-card::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle at center, rgba(99,102,241,0.04) 0%, transparent 60%);
      pointer-events: none;
    }
    .stat-card:hover {
      border-color: rgba(99,102,241,0.25) !important;
      transform: translateY(-2px);
      box-shadow: 0 8px 32px rgba(0,0,0,0.35);
    }
  `;

  return (
    <div style={{
      display: "flex", minHeight: "100vh",
      background: "var(--bg-void)",
      fontFamily: "'Sora', sans-serif",
      color: "var(--text-primary)",
      overflow: "hidden",
    }}>
      <style>{premiumStyles}</style>
      {/* Google Fonts — loaded via link to ensure @import works reliably */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />

      {/* Ambient background orbs */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "15%", left: "20%",
          width: "500px", height: "500px",
          background: "radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%)",
          borderRadius: "50%", animation: "orb 18s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", bottom: "20%", right: "15%",
          width: "400px", height: "400px",
          background: "radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)",
          borderRadius: "50%", animation: "orb 24s ease-in-out infinite reverse",
        }} />
        <div style={{
          position: "absolute", top: "60%", left: "50%",
          width: "300px", height: "300px",
          background: "radial-gradient(circle, rgba(245,200,66,0.03) 0%, transparent 70%)",
          borderRadius: "50%", animation: "orb 30s ease-in-out infinite",
        }} />
      </div>

      {/* ── SIDEBAR ─────────────────────────────────────── */}
      <div style={{
        width: sidebarOpen ? "230px" : "64px",
        minWidth: sidebarOpen ? "230px" : "64px",
        background: "rgba(6,10,22,0.92)",
        backdropFilter: "blur(24px)",
        borderRight: "1px solid rgba(99,102,241,0.1)",
        display: "flex", flexDirection: "column",
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        position: "relative", zIndex: 10,
      }}>

        {/* Logo */}
        <div style={{
          padding: "22px 18px",
          borderBottom: "1px solid rgba(99,102,241,0.08)",
          display: "flex", alignItems: "center", gap: "12px",
        }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "10px", flexShrink: 0,
            background: "linear-gradient(135deg, #6366f1, #a855f7)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "15px", fontWeight: 800, cursor: "pointer",
            boxShadow: "0 4px 16px rgba(99,102,241,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
          }} onClick={() => setSidebarOpen(p => !p)}>
            B
          </div>
          {sidebarOpen && (
            <div>
              <div style={{
                fontSize: "13px", fontWeight: 800, letterSpacing: "1.5px",
              }} className="shimmer-text">
                BUILD AGENT
              </div>
              <div style={{ fontSize: "9px", color: "#374151", letterSpacing: "2.5px", marginTop: "1px" }}>AI PLATFORM</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "14px 10px" }}>
          {NAV_ITEMS.map((item) => (
            <div
              key={item.id}
              className={`nav-item${activeNav === item.id ? " active" : ""}`}
              onClick={() => setActiveNav(item.id)}
              style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "11px 10px", borderRadius: "10px", marginBottom: "3px",
                cursor: "pointer", color: "#4b5563",
                fontSize: "13px", fontWeight: 500, letterSpacing: "0.3px",
                borderLeft: "2px solid transparent",
              }}
            >
              <span style={{ fontSize: "16px", flexShrink: 0, opacity: 0.85 }}>{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </div>
          ))}
        </nav>

        {/* Plan Badge */}
        {sidebarOpen && (
          <div style={{ padding: "14px 14px 4px" }}>
            <div style={{
              background: "linear-gradient(135deg, rgba(245,200,66,0.08), rgba(245,200,66,0.04))",
              border: "1px solid rgba(245,200,66,0.2)",
              borderRadius: "12px", padding: "13px", cursor: "pointer",
              position: "relative", overflow: "hidden",
            }} onClick={() => setActiveNav("billing")}>
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: "1px",
                background: "linear-gradient(90deg, transparent, rgba(245,200,66,0.4), transparent)",
              }} />
              <div style={{ fontSize: "8px", color: "#d4a017", letterSpacing: "2.5px", marginBottom: "4px", textTransform: "uppercase", fontWeight: 600 }}>CURRENT PLAN</div>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "#e8eaf2" }}>{userPlan}</div>
              <div style={{ marginTop: "9px", height: "3px", background: "rgba(245,200,66,0.12)", borderRadius: "2px" }}>
                <div style={{ width: "30%", height: "100%", background: "linear-gradient(90deg, #f5c842, #f59e0b)", borderRadius: "2px", boxShadow: "0 0 6px rgba(245,200,66,0.5)" }} />
              </div>
              <div style={{ fontSize: "10px", color: "#6b7280", marginTop: "5px" }}>3 / 10 agents used</div>
            </div>
          </div>
        )}

        {/* User */}
        <div style={{
          padding: "14px 16px",
          borderTop: "1px solid rgba(99,102,241,0.07)",
          display: "flex", alignItems: "center", gap: "10px",
          marginTop: "8px",
        }}>
          <div style={{
            width: "32px", height: "32px", borderRadius: "50%", flexShrink: 0,
            background: "linear-gradient(135deg, #6366f1, #a855f7)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "13px", fontWeight: 700,
            boxShadow: "0 2px 10px rgba(99,102,241,0.35)",
          }}>R</div>
          {sidebarOpen && (
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: "12px", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "#d1d5db" }}>{userName}</div>
              <div style={{ fontSize: "10px", color: "#4b5563", marginTop: "1px" }}>{userPlan} Plan</div>
            </div>
          )}
        </div>
      </div>

      {/* ── MAIN CONTENT ──────────────────────────────────── */}
      <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", position: "relative", zIndex: 1 }}>

        {/* Top Bar */}
        <div style={{
          padding: "16px 30px",
          borderBottom: "1px solid rgba(99,102,241,0.08)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "rgba(6,10,22,0.85)",
          backdropFilter: "blur(20px)",
          position: "sticky", top: 0, zIndex: 5,
        }}>
          <div>
            <div style={{ fontSize: "17px", fontWeight: 700, letterSpacing: "0.3px", color: "#e8eaf2" }}>
              {NAV_ITEMS.find(n => n.id === activeNav)?.label}
            </div>
            <div style={{ fontSize: "10px", color: "#374151", letterSpacing: "1.2px", marginTop: "1px", fontFamily: "'JetBrains Mono', monospace" }}>
              {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </div>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <div className="gold-btn" style={{
              padding: "7px 16px",
              background: "linear-gradient(135deg, rgba(245,200,66,0.15), rgba(245,200,66,0.08))",
              border: "1px solid rgba(245,200,66,0.3)",
              borderRadius: "20px", fontSize: "11px",
              color: "#f5c842", letterSpacing: "1.2px",
              cursor: "pointer", fontWeight: 600,
            }} onClick={() => setActiveNav("billing")}>
              ↑ UPGRADE
            </div>
            <div style={{
              width: "34px", height: "34px", borderRadius: "50%",
              background: "linear-gradient(135deg, #6366f1, #a855f7)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "13px", fontWeight: 700,
              boxShadow: "0 2px 12px rgba(99,102,241,0.4)",
            }}>R</div>
          </div>
        </div>

        {/* Page Content */}
        <div style={{ flex: 1, padding: "30px", animation: "fadeUp 0.35s ease" }}>

          {/* ── SAVED TOAST ── */}
          {savedToast && (
            <div style={{
              position: "fixed", bottom: "30px", right: "30px", zIndex: 9999,
              background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.35)",
              borderRadius: "12px", padding: "14px 22px",
              display: "flex", alignItems: "center", gap: "10px",
              backdropFilter: "blur(20px)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              animation: "fadeUp 0.3s ease",
              color: "#34d399", fontSize: "13px", fontWeight: 600,
            }}>
              ✓ Agent saved! <span style={{ color: "#6b7280", fontWeight: 400, cursor: "pointer", marginLeft: "4px" }}
                onClick={() => setActiveNav("agents")}>View in My Agents →</span>
            </div>
          )}

          {/* ====== OVERVIEW ====== */}
          {activeNav === "overview" && (
            <div>
              <div style={{ marginBottom: "28px" }}>
                <h2 style={{ margin: "0 0 5px", fontSize: "24px", fontWeight: 700, color: "#e8eaf2", letterSpacing: "-0.3px" }}>
                  Welcome back, {userName} 👋
                </h2>
                <p style={{ margin: 0, color: "#6b7280", fontSize: "13px", fontWeight: 400 }}>
                  Here's what's happening with your agents today.
                </p>
              </div>

              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(185px, 1fr))", gap: "16px", marginBottom: "26px" }}>
                {[
                  { label: "Total Agents", value: savedAgents.length, icon: "◈", color: "#818cf8", sub: "+2 this week", glow: "rgba(129,140,248,0.2)" },
                  { label: "Agent Uses", value: "159", icon: "⚡", color: "#34d399", sub: "+23 today", glow: "rgba(52,211,153,0.2)" },
                  { label: "This Month", value: agentCount, icon: "◎", color: "#fbbf24", sub: `${10 - agentCount} remaining`, glow: "rgba(251,191,36,0.2)" },
                  { label: "Plan", value: userPlan, icon: "◇", color: "#c084fc", sub: "Upgrade for more", glow: "rgba(192,132,252,0.2)" },
                ].map((stat) => (
                  <div key={stat.label} className="stat-card" style={{
                    background: "rgba(10,16,32,0.8)",
                    border: "1px solid rgba(99,102,241,0.1)",
                    borderRadius: "14px", padding: "22px",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontSize: "10px", color: "#4b5563", letterSpacing: "1.5px", marginBottom: "10px", textTransform: "uppercase", fontWeight: 500 }}>{stat.label}</div>
                        <div style={{ fontSize: "30px", fontWeight: 800, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
                        <div style={{ fontSize: "11px", color: "#374151", marginTop: "7px", fontFamily: "'JetBrains Mono', monospace" }}>{stat.sub}</div>
                      </div>
                      <div style={{
                        width: "40px", height: "40px", borderRadius: "10px",
                        background: `rgba(${stat.color === "#818cf8" ? "129,140,248" : stat.color === "#34d399" ? "52,211,153" : stat.color === "#fbbf24" ? "251,191,36" : "192,132,252"},0.1)`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "18px", color: stat.color,
                      }}>{stat.icon}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Agents */}
              <div style={{
                background: "rgba(10,16,32,0.8)",
                border: "1px solid rgba(99,102,241,0.1)",
                borderRadius: "14px", padding: "22px", marginBottom: "22px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                  <div style={{ fontSize: "11px", letterSpacing: "2px", color: "#818cf8", textTransform: "uppercase", fontWeight: 600 }}>▸ Recent Agents</div>
                  <span style={{ fontSize: "11px", color: "#4b5563", cursor: "pointer", transition: "color 0.2s" }}
                    onMouseEnter={e => e.target.style.color = "#818cf8"}
                    onMouseLeave={e => e.target.style.color = "#4b5563"}
                    onClick={() => setActiveNav("agents")}>View all →</span>
                </div>
                {savedAgents.slice(0, 3).map((ag) => (
                  <div key={ag.id} className="agent-card" style={{
                    display: "flex", alignItems: "center", gap: "14px",
                    padding: "13px 14px", borderRadius: "11px",
                    border: "1px solid rgba(99,102,241,0.07)",
                    marginBottom: "8px", cursor: "pointer",
                  }}>
                    <div style={{
                      width: "38px", height: "38px", borderRadius: "10px",
                      background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.1))",
                      border: "1px solid rgba(99,102,241,0.15)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "18px", flexShrink: 0,
                    }}>{ag.avatar}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "#e8eaf2" }}>{ag.agentName}</div>
                      <div style={{ fontSize: "11px", color: "#4b5563", marginTop: "2px" }}>{ag.tagline}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "11px", color: "#818cf8", fontFamily: "'JetBrains Mono', monospace" }}>{ag.uses} uses</div>
                      <div style={{ fontSize: "10px", color: "#374151", marginTop: "2px" }}>{ag.createdAt}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Build CTA */}
              <div style={{
                background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(168,85,247,0.07), rgba(245,200,66,0.04))",
                border: "1px solid rgba(99,102,241,0.22)",
                borderRadius: "16px", padding: "26px 28px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                flexWrap: "wrap", gap: "18px",
                position: "relative", overflow: "hidden",
                animation: "glowPulse 4s ease-in-out infinite",
              }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "1px", background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.5), rgba(168,85,247,0.5), transparent)" }} />
                <div>
                  <div style={{ fontSize: "17px", fontWeight: 700, marginBottom: "5px", color: "#e8eaf2" }}>Build a New Agent ⚡</div>
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>Describe your use-case and get a complete AI agent in seconds</div>
                </div>
                <button className="action-btn" onClick={() => setActiveNav("generator")} style={{
                  padding: "13px 26px",
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)",
                  border: "none", borderRadius: "12px", color: "white",
                  fontSize: "12px", fontFamily: "'Sora', sans-serif",
                  fontWeight: 700, letterSpacing: "1px", cursor: "pointer",
                  boxShadow: "0 4px 20px rgba(99,102,241,0.35)",
                }}>
                  START BUILDING →
                </button>
              </div>
            </div>
          )}

          {/* ====== AGENT GENERATOR ====== */}
          {activeNav === "generator" && (
            <div style={{ maxWidth: "720px" }}>
              <div style={{ marginBottom: "26px" }}>
                <h2 style={{ margin: "0 0 5px", fontSize: "21px", fontWeight: 700, letterSpacing: "-0.2px" }}>⚡ Build New Agent</h2>
                <p style={{ margin: 0, color: "#6b7280", fontSize: "13px" }}>Describe what you need — AI will generate a complete agent spec</p>
              </div>

              {/* Input */}
              <div style={{
                background: "rgba(10,16,32,0.85)", backdropFilter: "blur(20px)",
                border: "1px solid rgba(99,102,241,0.15)", borderRadius: "16px", padding: "26px",
                marginBottom: "22px",
              }}>
                <div style={{ fontSize: "9px", letterSpacing: "2.5px", color: "#818cf8", marginBottom: "11px", textTransform: "uppercase", fontWeight: 600 }}>▸ Your Agent Description</div>
                <textarea
                  value={prompt} onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., I need a customer support agent for my online clothing store that handles returns, size queries, and shipping status..."
                  rows={4}
                  style={{
                    width: "100%",
                    background: "rgba(3,5,13,0.7)",
                    border: "1px solid rgba(99,102,241,0.14)",
                    borderRadius: "11px", padding: "15px",
                    color: "#e8eaf2", fontSize: "13px",
                    fontFamily: "'Sora', sans-serif",
                    resize: "none", lineHeight: 1.65,
                    boxSizing: "border-box", transition: "all 0.2s",
                  }}
                  onKeyDown={(e) => e.key === "Enter" && e.ctrlKey && buildAgent()}
                />

                {/* Quick examples */}
                <div style={{ marginTop: "12px", display: "flex", flexWrap: "wrap", gap: "7px" }}>
                  {["HR Recruitment Agent", "Sales Outreach Bot", "Legal Document Reviewer", "Fitness Coach AI"].map(ex => (
                    <span key={ex} className="example-chip" onClick={() => setPrompt(ex)} style={{
                      fontSize: "10px", padding: "5px 12px",
                      background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.14)",
                      borderRadius: "20px", color: "#6b7280", cursor: "pointer", fontWeight: 500,
                    }}>
                      {ex}
                    </span>
                  ))}
                </div>

                <button onClick={buildAgent} disabled={loading || !prompt.trim()} style={{
                  marginTop: "18px", width: "100%", padding: "15px",
                  background: loading
                    ? "rgba(99,102,241,0.15)"
                    : "linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)",
                  border: "none", borderRadius: "12px", color: "white",
                  fontSize: "12px", fontFamily: "'Sora', sans-serif",
                  fontWeight: 700, letterSpacing: "2px",
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                  transition: "all 0.2s",
                  boxShadow: loading ? "none" : "0 4px 20px rgba(99,102,241,0.3)",
                }}>
                  {loading ? (
                    <><span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⚙</span> GENERATING AGENT...</>
                  ) : "⚡ GENERATE AGENT  [Ctrl+Enter]"}
                </button>
              </div>

              {/* Agent Result */}
              {agent && !agent.error && (
                <div style={{
                  background: "rgba(10,16,32,0.9)",
                  border: "1px solid rgba(99,102,241,0.22)",
                  borderRadius: "16px", overflow: "hidden",
                  animation: "fadeUp 0.4s ease",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(99,102,241,0.06)",
                }}>
                  {/* Agent Header */}
                  <div style={{
                    background: "linear-gradient(135deg, rgba(99,102,241,0.13), rgba(168,85,247,0.08))",
                    padding: "22px 26px",
                    borderBottom: "1px solid rgba(99,102,241,0.13)",
                    position: "relative",
                  }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent, #6366f1, #a855f7, transparent)" }} />
                    <div style={{ display: "flex", alignItems: "center", gap: "15px", flexWrap: "wrap" }}>
                      <div style={{
                        width: "52px", height: "52px", borderRadius: "13px",
                        background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.15))",
                        border: "1px solid rgba(99,102,241,0.2)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "26px", flexShrink: 0,
                        boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                      }}>{agent.avatar}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "9px", flexWrap: "wrap" }}>
                          <h3 style={{ margin: 0, fontSize: "19px", fontWeight: 700, color: "#e8eaf2" }}>{agent.agentName}</h3>
                          <span style={{
                            fontSize: "9px", padding: "3px 9px",
                            background: `${toneColor[agent.tone] || "#6366f1"}18`,
                            border: `1px solid ${toneColor[agent.tone] || "#6366f1"}35`,
                            borderRadius: "20px", color: toneColor[agent.tone] || "#6366f1",
                            textTransform: "uppercase", letterSpacing: "1.2px", fontWeight: 600,
                          }}>{agent.tone}</span>
                        </div>
                        <p style={{ margin: "3px 0 0", color: "#6b7280", fontSize: "12px" }}>{agent.tagline}</p>
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={saveAgent} style={{
                          padding: "8px 15px",
                          background: "rgba(52,211,153,0.12)",
                          border: "1px solid rgba(52,211,153,0.28)",
                          borderRadius: "9px", color: "#34d399",
                          fontSize: "10px", fontFamily: "'JetBrains Mono', monospace",
                          cursor: "pointer", letterSpacing: "1px", fontWeight: 600,
                          transition: "all 0.2s",
                        }}>✓ SAVE</button>
                        <button onClick={() => copyText(JSON.stringify(agent, null, 2), "all")} style={{
                          padding: "8px 15px",
                          background: "rgba(99,102,241,0.1)",
                          border: "1px solid rgba(99,102,241,0.22)",
                          borderRadius: "9px", color: copied === "all" ? "#34d399" : "#818cf8",
                          fontSize: "10px", fontFamily: "'JetBrains Mono', monospace",
                          cursor: "pointer", letterSpacing: "1px", fontWeight: 600,
                          transition: "all 0.2s",
                        }}>{copied === "all" ? "✓ COPIED" : "⎘ EXPORT"}</button>
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: "22px 26px", display: "grid", gap: "14px" }}>
                    {/* System Prompt */}
                    <div style={{
                      background: "rgba(3,5,13,0.7)", border: "1px solid rgba(99,102,241,0.1)",
                      borderRadius: "12px", padding: "16px",
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                        <div style={{ fontSize: "9px", letterSpacing: "2.5px", color: "#818cf8", textTransform: "uppercase", fontWeight: 600 }}>▸ System Prompt</div>
                        <button onClick={() => copyText(agent.systemPrompt, "sp")} style={{
                          padding: "3px 9px", background: "rgba(99,102,241,0.1)",
                          border: "1px solid rgba(99,102,241,0.15)", borderRadius: "5px",
                          color: copied === "sp" ? "#34d399" : "#4b5563",
                          fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", cursor: "pointer",
                          transition: "all 0.2s",
                        }}>{copied === "sp" ? "✓" : "⎘"} COPY</button>
                      </div>
                      <p style={{ margin: 0, color: "#9ca3af", fontSize: "11px", lineHeight: 1.75, fontFamily: "'JetBrains Mono', monospace" }}>{agent.systemPrompt}</p>
                    </div>

                    {/* Capabilities + Tools */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                      <div style={{ background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.1)", borderRadius: "12px", padding: "15px" }}>
                        <div style={{ fontSize: "9px", letterSpacing: "2px", color: "#818cf8", marginBottom: "11px", textTransform: "uppercase", fontWeight: 600 }}>▸ Capabilities</div>
                        {agent.capabilities?.map((c, i) => (
                          <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "7px" }}>
                            <span style={{ color: "#818cf8", fontSize: "8px", marginTop: "3px", flexShrink: 0 }}>◈</span>
                            <span style={{ color: "#cbd5e1", fontSize: "11px", lineHeight: 1.45 }}>{c}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ background: "rgba(168,85,247,0.05)", border: "1px solid rgba(168,85,247,0.1)", borderRadius: "12px", padding: "15px" }}>
                        <div style={{ fontSize: "9px", letterSpacing: "2px", color: "#c084fc", marginBottom: "11px", textTransform: "uppercase", fontWeight: 600 }}>▸ Tools</div>
                        {agent.tools?.map((t, i) => (
                          <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "7px" }}>
                            <span style={{ color: "#c084fc", fontSize: "8px", marginTop: "3px", flexShrink: 0 }}>◈</span>
                            <span style={{ color: "#cbd5e1", fontSize: "11px", lineHeight: 1.45 }}>{t}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Example Tasks */}
                    <div style={{ background: "rgba(52,211,153,0.04)", border: "1px solid rgba(52,211,153,0.1)", borderRadius: "12px", padding: "15px" }}>
                      <div style={{ fontSize: "9px", letterSpacing: "2px", color: "#34d399", marginBottom: "11px", textTransform: "uppercase", fontWeight: 600 }}>▸ Example Tasks</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
                        {agent.exampleTasks?.map((t, i) => (
                          <span key={i} style={{
                            fontSize: "10px", padding: "5px 11px",
                            background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.18)",
                            borderRadius: "20px", color: "#6ee7b7", fontFamily: "'JetBrains Mono', monospace",
                          }}>"{t}"</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {agent?.error && (
                <div style={{
                  background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: "12px", padding: "16px", color: "#f87171", fontSize: "12px",
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  ✗ Generation failed. Please try again.
                </div>
              )}
            </div>
          )}

          {/* ====== MY AGENTS ====== */}
          {activeNav === "agents" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "26px", flexWrap: "wrap", gap: "12px" }}>
                <div>
                  <h2 style={{ margin: "0 0 4px", fontSize: "21px", fontWeight: 700, letterSpacing: "-0.2px" }}>◈ My Agents</h2>
                  <p style={{ margin: 0, color: "#6b7280", fontSize: "13px" }}>{savedAgents.length} agents saved</p>
                </div>
                <button onClick={() => setActiveNav("generator")} style={{
                  padding: "10px 22px",
                  background: "linear-gradient(135deg, #6366f1, #a855f7)",
                  border: "none", borderRadius: "11px", color: "white",
                  fontSize: "11px", fontFamily: "'Sora', sans-serif",
                  fontWeight: 700, letterSpacing: "1px", cursor: "pointer",
                  boxShadow: "0 4px 16px rgba(99,102,241,0.3)",
                  transition: "all 0.2s",
                }}>+ NEW AGENT</button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(285px, 1fr))", gap: "16px" }}>
                {savedAgents.map((ag) => (
                  <div key={ag.id} className="agent-card" style={{ borderRadius: "14px", padding: "22px", cursor: "pointer" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "13px", marginBottom: "16px" }}>
                      <div style={{
                        width: "44px", height: "44px", borderRadius: "11px",
                        background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.1))",
                        border: "1px solid rgba(99,102,241,0.15)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "22px", flexShrink: 0,
                      }}>{ag.avatar}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "14px", fontWeight: 700, marginBottom: "3px", color: "#e8eaf2" }}>{ag.agentName}</div>
                        <div style={{ fontSize: "11px", color: "#4b5563" }}>{ag.tagline}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "13px", borderTop: "1px solid rgba(99,102,241,0.07)", marginBottom: "12px" }}>
                      <div style={{ fontSize: "10px", color: "#374151", fontFamily: "'JetBrains Mono', monospace" }}>{ag.createdAt}</div>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <span style={{ fontSize: "10px", padding: "3px 9px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "6px", color: "#818cf8", fontFamily: "'JetBrains Mono', monospace" }}>{ag.uses} uses</span>
                        <span style={{ fontSize: "10px", padding: "3px 9px", background: `${toneColor[ag.tone] || "#6366f1"}12`, border: `1px solid ${toneColor[ag.tone] || "#6366f1"}28`, borderRadius: "6px", color: toneColor[ag.tone] || "#6366f1", textTransform: "capitalize", fontFamily: "'JetBrains Mono', monospace" }}>{ag.tone}</span>
                      </div>
                    </div>
                    {/* Comments + Version History Buttons */}
                    <div style={{ display: "flex", gap: "7px" }}>
                      <button onClick={() => { setCommentAgentId(ag.id); setShowCommentModal("comments"); }} style={{
                        flex: 1, padding: "7px 0",
                        background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.15)",
                        borderRadius: "8px", color: "#818cf8", fontSize: "9px",
                        fontFamily: "'Sora', sans-serif", fontWeight: 600, cursor: "pointer", letterSpacing: "0.8px",
                      }}>💬 COMMENTS ({(agentComments[ag.id] || []).length})</button>
                      <button onClick={() => { setSelectedVersionAgent(ag.id); setShowCommentModal("versions"); }} style={{
                        flex: 1, padding: "7px 0",
                        background: "rgba(52,211,153,0.07)", border: "1px solid rgba(52,211,153,0.15)",
                        borderRadius: "8px", color: "#34d399", fontSize: "9px",
                        fontFamily: "'Sora', sans-serif", fontWeight: 600, cursor: "pointer", letterSpacing: "0.8px",
                      }}>🕐 HISTORY ({(versionHistory[ag.id] || []).length})</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comments Modal */}
              {showCommentModal === "comments" && commentAgentId !== null && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }} onClick={() => setShowCommentModal(false)}>
                  <div style={{ background: "#0a1020", border: "1px solid rgba(99,102,241,0.25)", borderRadius: "18px", padding: "26px", width: "100%", maxWidth: "480px", maxHeight: "70vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: "#e8eaf2" }}>💬 Agent Comments</div>
                      <button onClick={() => setShowCommentModal(false)} style={{ background: "transparent", border: "none", color: "#4b5563", fontSize: "18px", cursor: "pointer" }}>✕</button>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "18px" }}>
                      {(agentComments[commentAgentId] || []).length === 0 && (
                        <div style={{ textAlign: "center", color: "#374151", fontSize: "12px", padding: "20px" }}>No comments yet. Be the first!</div>
                      )}
                      {(agentComments[commentAgentId] || []).map(c => (
                        <div key={c.id} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                          <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: c.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, flexShrink: 0 }}>{c.avatar}</div>
                          <div style={{ flex: 1, background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.1)", borderRadius: "10px", padding: "10px 13px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                              <span style={{ fontSize: "10px", fontWeight: 700, color: c.color }}>{c.author}</span>
                              <span style={{ fontSize: "9px", color: "#374151", fontFamily: "'JetBrains Mono', monospace" }}>{c.time}</span>
                            </div>
                            <div style={{ fontSize: "12px", color: "#cbd5e1", lineHeight: 1.5 }}>{c.text}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <input value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Add a comment..." style={{ flex: 1, background: "rgba(3,5,13,0.7)", border: "1px solid rgba(99,102,241,0.14)", borderRadius: "9px", padding: "10px 13px", color: "#e8eaf2", fontSize: "12px", fontFamily: "'Sora', sans-serif", outline: "none" }} />
                      <button onClick={() => {
                        if (!newComment.trim()) return;
                        setAgentComments(prev => ({ ...prev, [commentAgentId]: [...(prev[commentAgentId] || []), { id: Date.now(), author: "Rahul", avatar: "R", color: "#6366f1", text: newComment.trim(), time: "Just now" }] }));
                        setNewComment("");
                      }} style={{ padding: "10px 18px", background: "linear-gradient(135deg, #6366f1, #a855f7)", border: "none", borderRadius: "9px", color: "white", fontSize: "10px", fontFamily: "'Sora', sans-serif", fontWeight: 700, cursor: "pointer" }}>POST</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Version History Modal */}
              {showCommentModal === "versions" && selectedVersionAgent !== null && (
                <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }} onClick={() => setShowCommentModal(false)}>
                  <div style={{ background: "#0a1020", border: "1px solid rgba(52,211,153,0.2)", borderRadius: "18px", padding: "26px", width: "100%", maxWidth: "480px", maxHeight: "70vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: "#e8eaf2" }}>🕐 Version History</div>
                      <button onClick={() => setShowCommentModal(false)} style={{ background: "transparent", border: "none", color: "#4b5563", fontSize: "18px", cursor: "pointer" }}>✕</button>
                    </div>
                    {(versionHistory[selectedVersionAgent] || []).length === 0 && (
                      <div style={{ textAlign: "center", color: "#374151", fontSize: "12px", padding: "20px" }}>No version history yet.</div>
                    )}
                    {(versionHistory[selectedVersionAgent] || []).map((v, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px", background: i === 0 ? "rgba(52,211,153,0.06)" : "rgba(99,102,241,0.03)", border: `1px solid ${i === 0 ? "rgba(52,211,153,0.18)" : "rgba(99,102,241,0.08)"}`, borderRadius: "11px", marginBottom: "10px" }}>
                        <div style={{ textAlign: "center", minWidth: "44px" }}>
                          <div style={{ fontSize: "11px", fontWeight: 700, color: i === 0 ? "#34d399" : "#818cf8", fontFamily: "'JetBrains Mono', monospace" }}>{v.version}</div>
                          {i === 0 && <div style={{ fontSize: "8px", color: "#34d399", marginTop: "2px" }}>LATEST</div>}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "12px", color: "#e8eaf2", marginBottom: "3px" }}>{v.note}</div>
                          <div style={{ fontSize: "9px", color: "#374151" }}>{v.date} · by {v.author}</div>
                        </div>
                        {i > 0 && (
                          <button style={{ padding: "5px 12px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "7px", color: "#818cf8", fontSize: "9px", cursor: "pointer", fontFamily: "'Sora', sans-serif", fontWeight: 600 }}>RESTORE</button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ====== MARKETPLACE ====== */}
          {activeNav === "marketplace" && (
            <div>
              {/* Header */}
              <div style={{ marginBottom: "26px" }}>
                <h2 style={{ margin: "0 0 5px", fontSize: "21px", fontWeight: 700, letterSpacing: "-0.2px" }}>🛒 Agent Marketplace</h2>
                <p style={{ margin: 0, color: "#6b7280", fontSize: "13px" }}>Buy & sell premium AI agents built by the community</p>
              </div>

              {/* Stats Bar */}
              <div style={{ display: "flex", gap: "14px", marginBottom: "24px", flexWrap: "wrap" }}>
                {[
                  { label: "Total Agents", value: "2,400+", color: "#818cf8" },
                  { label: "Sellers", value: "380+", color: "#34d399" },
                  { label: "Downloads", value: "18K+", color: "#fbbf24" },
                  { label: "Avg Rating", value: "4.7 ⭐", color: "#c084fc" },
                ].map(s => (
                  <div key={s.label} style={{
                    background: "rgba(10,16,32,0.8)", border: "1px solid rgba(99,102,241,0.1)",
                    borderRadius: "11px", padding: "13px 20px", display: "flex", flexDirection: "column", gap: "3px",
                  }}>
                    <div style={{ fontSize: "18px", fontWeight: 800, color: s.color, fontFamily: "'JetBrains Mono', monospace" }}>{s.value}</div>
                    <div style={{ fontSize: "9px", color: "#4b5563", letterSpacing: "1.5px", textTransform: "uppercase" }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Search + Filter Bar */}
              <div style={{ display: "flex", gap: "12px", marginBottom: "22px", flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
                  <span style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", color: "#374151", fontSize: "14px" }}>🔍</span>
                  <input
                    value={marketSearch}
                    onChange={e => setMarketSearch(e.target.value)}
                    placeholder="Search agents..."
                    style={{
                      width: "100%", background: "rgba(10,16,32,0.85)",
                      border: "1px solid rgba(99,102,241,0.14)", borderRadius: "11px",
                      padding: "11px 13px 11px 38px", color: "#e8eaf2",
                      fontSize: "12px", fontFamily: "'Sora', sans-serif",
                      boxSizing: "border-box", outline: "none",
                    }}
                  />
                </div>
                <button onClick={() => setActiveNav("sell-agent")} style={{
                  padding: "11px 20px",
                  background: "linear-gradient(135deg, rgba(245,200,66,0.15), rgba(245,200,66,0.08))",
                  border: "1px solid rgba(245,200,66,0.3)",
                  borderRadius: "11px", color: "#f5c842",
                  fontSize: "11px", fontFamily: "'Sora', sans-serif",
                  fontWeight: 700, letterSpacing: "1px", cursor: "pointer",
                  whiteSpace: "nowrap",
                }}>+ SELL YOUR AGENT</button>
              </div>

              {/* Category Filters */}
              <div style={{ display: "flex", gap: "7px", marginBottom: "22px", flexWrap: "wrap" }}>
                {CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => setMarketCategory(cat)} style={{
                    padding: "6px 16px",
                    background: marketCategory === cat
                      ? "linear-gradient(135deg, #6366f1, #a855f7)"
                      : "rgba(10,16,32,0.8)",
                    border: `1px solid ${marketCategory === cat ? "transparent" : "rgba(99,102,241,0.14)"}`,
                    borderRadius: "20px", color: marketCategory === cat ? "white" : "#6b7280",
                    fontSize: "10px", fontWeight: 600, cursor: "pointer",
                    letterSpacing: "0.8px", transition: "all 0.2s",
                    boxShadow: marketCategory === cat ? "0 2px 12px rgba(99,102,241,0.35)" : "none",
                  }}>{cat}</button>
                ))}
              </div>

              {/* Featured Banner */}
              {marketCategory === "All" && (
                <div style={{
                  background: "linear-gradient(135deg, rgba(245,200,66,0.1), rgba(99,102,241,0.08))",
                  border: "1px solid rgba(245,200,66,0.2)", borderRadius: "14px",
                  padding: "18px 22px", marginBottom: "22px",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  flexWrap: "wrap", gap: "12px",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "24px" }}>⭐</span>
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: 700, color: "#f5c842", marginBottom: "2px" }}>FEATURED THIS WEEK</div>
                      <div style={{ fontSize: "11px", color: "#6b7280" }}>Top rated agents handpicked by our team</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    {MARKETPLACE_AGENTS.filter(a => a.featured).map(a => (
                      <div key={a.id} style={{
                        background: "rgba(10,16,32,0.7)", border: "1px solid rgba(245,200,66,0.15)",
                        borderRadius: "9px", padding: "7px 12px",
                        display: "flex", alignItems: "center", gap: "7px", cursor: "pointer",
                      }} onClick={() => setPreviewAgent(a)}>
                        <span style={{ fontSize: "16px" }}>{a.avatar}</span>
                        <span style={{ fontSize: "11px", color: "#e8eaf2", fontWeight: 600 }}>{a.agentName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Agent Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
                {MARKETPLACE_AGENTS
                  .filter(a => marketCategory === "All" || a.category === marketCategory)
                  .filter(a => a.agentName.toLowerCase().includes(marketSearch.toLowerCase()) || a.tagline.toLowerCase().includes(marketSearch.toLowerCase()))
                  .map(ag => {
                    const isPurchased = purchasedAgents.includes(ag.id);
                    return (
                      <div key={ag.id} className="agent-card" style={{
                        borderRadius: "14px", padding: "20px", cursor: "pointer",
                        position: "relative", overflow: "hidden",
                      }}>
                        {ag.featured && (
                          <div style={{
                            position: "absolute", top: "12px", right: "12px",
                            fontSize: "8px", padding: "3px 9px",
                            background: "linear-gradient(135deg, rgba(245,200,66,0.2), rgba(245,200,66,0.1))",
                            border: "1px solid rgba(245,200,66,0.3)",
                            borderRadius: "20px", color: "#f5c842",
                            letterSpacing: "1.2px", fontWeight: 700,
                          }}>⭐ FEATURED</div>
                        )}

                        {/* Agent Info */}
                        <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "14px" }}>
                          <div style={{
                            width: "48px", height: "48px", borderRadius: "12px",
                            background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.12))",
                            border: "1px solid rgba(99,102,241,0.18)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "24px", flexShrink: 0,
                          }}>{ag.avatar}</div>
                          <div style={{ flex: 1, paddingRight: "50px" }}>
                            <div style={{ fontSize: "13px", fontWeight: 700, color: "#e8eaf2", marginBottom: "3px" }}>{ag.agentName}</div>
                            <div style={{ fontSize: "10px", color: "#4b5563", lineHeight: 1.4 }}>{ag.tagline}</div>
                          </div>
                        </div>

                        {/* Meta */}
                        <div style={{ display: "flex", gap: "8px", marginBottom: "14px", flexWrap: "wrap" }}>
                          <span style={{
                            fontSize: "9px", padding: "3px 9px",
                            background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
                            borderRadius: "20px", color: "#818cf8", letterSpacing: "0.8px",
                          }}>{ag.category}</span>
                          <span style={{
                            fontSize: "9px", padding: "3px 9px",
                            background: "rgba(52,211,153,0.07)", border: "1px solid rgba(52,211,153,0.15)",
                            borderRadius: "20px", color: "#34d399",
                            fontFamily: "'JetBrains Mono', monospace",
                          }}>⬇ {ag.downloads.toLocaleString()}</span>
                          <span style={{
                            fontSize: "9px", padding: "3px 9px",
                            background: "rgba(251,191,36,0.07)", border: "1px solid rgba(251,191,36,0.15)",
                            borderRadius: "20px", color: "#fbbf24",
                            fontFamily: "'JetBrains Mono', monospace",
                          }}>★ {ag.rating} ({ag.reviews})</span>
                        </div>

                        {/* Seller + Price + Buy */}
                        <div style={{
                          display: "flex", justifyContent: "space-between", alignItems: "center",
                          paddingTop: "13px", borderTop: "1px solid rgba(99,102,241,0.07)",
                        }}>
                          <div>
                            <div style={{ fontSize: "9px", color: "#374151", marginBottom: "2px" }}>by {ag.seller}</div>
                            <div style={{ fontSize: "18px", fontWeight: 800, color: "#818cf8", fontFamily: "'JetBrains Mono', monospace" }}>
                              ${ag.price}<span style={{ fontSize: "10px", color: "#4b5563", fontWeight: 400 }}>/mo</span>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              if (!isPurchased) {
                                setPurchasedAgents(p => [...p, ag.id]);
                                const newAg = { ...ag, id: Date.now(), createdAt: "Just now", uses: 0 };
                                setSavedAgents(p => [newAg, ...p]);
                              }
                            }}
                            style={{
                              padding: "9px 18px",
                              background: isPurchased
                                ? "rgba(52,211,153,0.1)"
                                : "linear-gradient(135deg, #6366f1, #a855f7)",
                              border: isPurchased ? "1px solid rgba(52,211,153,0.3)" : "none",
                              borderRadius: "10px",
                              color: isPurchased ? "#34d399" : "white",
                              fontSize: "10px", fontFamily: "'Sora', sans-serif",
                              fontWeight: 700, letterSpacing: "1px", cursor: isPurchased ? "default" : "pointer",
                              boxShadow: isPurchased ? "none" : "0 3px 12px rgba(99,102,241,0.35)",
                              transition: "all 0.2s",
                            }}>
                            {isPurchased ? "✓ ADDED" : "GET AGENT"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* Sell Your Agent CTA */}
              <div style={{
                marginTop: "28px",
                background: "linear-gradient(135deg, rgba(245,200,66,0.08), rgba(99,102,241,0.06))",
                border: "1px solid rgba(245,200,66,0.18)", borderRadius: "16px",
                padding: "26px 28px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                flexWrap: "wrap", gap: "18px",
              }}>
                <div>
                  <div style={{ fontSize: "16px", fontWeight: 700, color: "#f5c842", marginBottom: "5px" }}>💰 Earn by Selling Your Agents</div>
                  <div style={{ fontSize: "12px", color: "#6b7280", maxWidth: "480px" }}>
                    List your custom AI agents on the marketplace. Keep 80% revenue. Reach thousands of businesses globally.
                  </div>
                </div>
                <button style={{
                  padding: "13px 26px",
                  background: "linear-gradient(135deg, #f5c842, #f59e0b)",
                  border: "none", borderRadius: "12px", color: "#06080f",
                  fontSize: "12px", fontFamily: "'Sora', sans-serif",
                  fontWeight: 800, letterSpacing: "1px", cursor: "pointer",
                  boxShadow: "0 4px 20px rgba(245,200,66,0.35)",
                }}>
                  START SELLING →
                </button>
              </div>
            </div>
          )}


          {/* ====== BILLING ====== */}
          {activeNav === "billing" && (
            <div>
              <div style={{ marginBottom: "30px" }}>
                <h2 style={{ margin: "0 0 5px", fontSize: "21px", fontWeight: 700, letterSpacing: "-0.2px" }}>◎ Billing & Plans</h2>
                <p style={{ margin: 0, color: "#6b7280", fontSize: "13px" }}>Choose the plan that fits your needs</p>
              </div>

              {/* Toggle */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "34px" }}>
                <div style={{
                  background: "rgba(10,16,32,0.9)", border: "1px solid rgba(99,102,241,0.14)",
                  borderRadius: "30px", padding: "4px", display: "flex",
                }}>
                  {["Monthly", "Yearly (Save 20%)"].map((t) => (
                    <div key={t} style={{
                      padding: "9px 22px", borderRadius: "26px", fontSize: "11px", letterSpacing: "0.8px",
                      cursor: "pointer", transition: "all 0.2s", fontWeight: 600,
                      background: t === "Monthly" ? "linear-gradient(135deg, #6366f1, #a855f7)" : "transparent",
                      color: t === "Monthly" ? "white" : "#4b5563",
                      boxShadow: t === "Monthly" ? "0 2px 10px rgba(99,102,241,0.3)" : "none",
                    }}>{t}</div>
                  ))}
                </div>
              </div>

              {/* Plans */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", maxWidth: "920px" }}>
                {PLANS.map((plan) => (
                  <div key={plan.name} className="plan-card" style={{
                    background: plan.popular
                      ? "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(168,85,247,0.07))"
                      : "rgba(10,16,32,0.85)",
                    border: `1px solid ${plan.popular ? "rgba(99,102,241,0.35)" : "rgba(99,102,241,0.1)"}`,
                    borderRadius: "18px", padding: "26px",
                    position: "relative", overflow: "hidden",
                    boxShadow: plan.popular ? `0 0 40px ${plan.glow}` : "none",
                  }}>
                    {plan.popular && (
                      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, #6366f1, #a855f7)" }} />
                    )}
                    {plan.popular && (
                      <div style={{
                        position: "absolute", top: "15px", right: "15px",
                        fontSize: "8px", padding: "4px 11px",
                        background: "linear-gradient(135deg, #6366f1, #a855f7)",
                        borderRadius: "20px", color: "white", letterSpacing: "1.5px", fontWeight: 700,
                        boxShadow: "0 2px 10px rgba(99,102,241,0.4)",
                      }}>POPULAR</div>
                    )}

                    <div style={{ marginBottom: "22px" }}>
                      <div style={{ fontSize: "10px", color: plan.color, letterSpacing: "2.5px", marginBottom: "9px", textTransform: "uppercase", fontWeight: 600 }}>{plan.name}</div>
                      <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                        <span style={{ fontSize: "38px", fontWeight: 800, color: plan.color, lineHeight: 1 }}>${plan.price}</span>
                        {plan.price > 0 && <span style={{ fontSize: "12px", color: "#4b5563" }}>/{plan.period}</span>}
                        {plan.price === 0 && <span style={{ fontSize: "12px", color: "#4b5563" }}>{plan.period}</span>}
                      </div>
                      <div style={{ fontSize: "11px", color: "#4b5563", marginTop: "5px" }}>{plan.limit}</div>
                    </div>

                    <div style={{ marginBottom: "22px" }}>
                      {plan.features.map((f) => (
                        <div key={f} style={{ display: "flex", gap: "9px", marginBottom: "9px", alignItems: "flex-start" }}>
                          <span style={{ color: plan.color, fontSize: "10px", marginTop: "2px", flexShrink: 0 }}>✓</span>
                          <span style={{ fontSize: "12px", color: "#9ca3af" }}>{f}</span>
                        </div>
                      ))}
                    </div>

                    <button onClick={() => setSelectedPlan(plan.name)} style={{
                      width: "100%", padding: "13px",
                      background: selectedPlan === plan.name || (plan.name === "Free" && userPlan === "Free")
                        ? `${plan.color}18`
                        : plan.popular
                          ? "linear-gradient(135deg, #6366f1, #a855f7)"
                          : "rgba(99,102,241,0.1)",
                      border: `1px solid ${plan.color}35`,
                      borderRadius: "11px",
                      color: selectedPlan === plan.name ? plan.color : "white",
                      fontSize: "11px", fontFamily: "'Sora', sans-serif",
                      fontWeight: 700, letterSpacing: "1px", cursor: "pointer",
                      transition: "all 0.2s",
                      boxShadow: plan.popular && selectedPlan !== plan.name ? "0 4px 16px rgba(99,102,241,0.25)" : "none",
                    }}>
                      {plan.name === "Free" ? "CURRENT PLAN" : selectedPlan === plan.name ? "✓ SELECTED" : `GET ${plan.name.toUpperCase()}`}
                    </button>
                  </div>
                ))}
              </div>

              {/* Checkout */}
              {selectedPlan !== "Free" && (
                <div style={{ marginTop: "30px", maxWidth: "530px", animation: "fadeUp 0.3s ease" }}>

                  {/* Payment Method Selector */}
                  <div style={{ marginBottom: "18px" }}>
                    <div style={{ fontSize: "9px", color: "#818cf8", letterSpacing: "2.5px", marginBottom: "13px", textTransform: "uppercase", fontWeight: 600 }}>▸ Choose Payment Method</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>

                      {/* Stripe */}
                      <div onClick={() => setPaymentMethod("stripe")} style={{
                        background: paymentMethod === "stripe" ? "rgba(99,102,241,0.1)" : "rgba(10,16,32,0.85)",
                        border: `2px solid ${paymentMethod === "stripe" ? "#6366f1" : "rgba(99,102,241,0.1)"}`,
                        borderRadius: "13px", padding: "16px", cursor: "pointer",
                        transition: "all 0.2s", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
                      }}>
                        <div style={{
                          width: "46px", height: "28px", borderRadius: "7px",
                          background: "linear-gradient(135deg, #635bff, #7c71ff)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "11px", fontWeight: 800, color: "white", letterSpacing: "0.5px",
                          boxShadow: "0 2px 8px rgba(99,91,255,0.4)",
                        }}>stripe</div>
                        <div style={{ fontSize: "11px", color: paymentMethod === "stripe" ? "#a5b4fc" : "#4b5563", fontWeight: 600 }}>Credit Card</div>
                        <div style={{ fontSize: "9px", color: "#374151", textAlign: "center" }}>Visa · Mastercard · Amex</div>
                        {paymentMethod === "stripe" && (
                          <div style={{ fontSize: "9px", padding: "2px 8px", background: "rgba(99,102,241,0.18)", borderRadius: "10px", color: "#818cf8", letterSpacing: "1px", fontWeight: 600 }}>✓ SELECTED</div>
                        )}
                      </div>

                      {/* PayPal */}
                      <div onClick={() => setPaymentMethod("paypal")} style={{
                        background: paymentMethod === "paypal" ? "rgba(0,112,229,0.1)" : "rgba(10,16,32,0.85)",
                        border: `2px solid ${paymentMethod === "paypal" ? "#0070e5" : "rgba(99,102,241,0.1)"}`,
                        borderRadius: "13px", padding: "16px", cursor: "pointer",
                        transition: "all 0.2s", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
                      }}>
                        <div style={{
                          width: "46px", height: "28px", borderRadius: "7px",
                          background: "#003087",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "13px", fontWeight: 900, letterSpacing: "-0.5px",
                          boxShadow: "0 2px 8px rgba(0,48,135,0.5)",
                        }}>
                          <span style={{ color: "#009cde" }}>Pay</span><span style={{ color: "#012169" }}>Pal</span>
                        </div>
                        <div style={{ fontSize: "11px", color: paymentMethod === "paypal" ? "#60a5fa" : "#4b5563", fontWeight: 600 }}>PayPal</div>
                        <div style={{ fontSize: "9px", color: "#374151", textAlign: "center" }}>Fast & secure</div>
                        {paymentMethod === "paypal" && (
                          <div style={{ fontSize: "9px", padding: "2px 8px", background: "rgba(0,112,229,0.18)", borderRadius: "10px", color: "#60a5fa", letterSpacing: "1px", fontWeight: 600 }}>✓ SELECTED</div>
                        )}
                      </div>

                      {/* Crypto */}
                      <div onClick={() => setPaymentMethod("crypto")} style={{
                        background: paymentMethod === "crypto" ? "rgba(247,147,26,0.1)" : "rgba(10,16,32,0.85)",
                        border: `2px solid ${paymentMethod === "crypto" ? "#f7931a" : "rgba(99,102,241,0.1)"}`,
                        borderRadius: "13px", padding: "16px", cursor: "pointer",
                        transition: "all 0.2s", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
                      }}>
                        <div style={{
                          width: "46px", height: "28px", borderRadius: "7px",
                          background: "linear-gradient(135deg, #f7931a, #ffb347)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "16px",
                          boxShadow: "0 2px 8px rgba(247,147,26,0.4)",
                        }}>₿</div>
                        <div style={{ fontSize: "11px", color: paymentMethod === "crypto" ? "#fbbf24" : "#4b5563", fontWeight: 600 }}>Crypto</div>
                        <div style={{ fontSize: "9px", color: "#374151", textAlign: "center" }}>BTC · ETH · USDC</div>
                        {paymentMethod === "crypto" && (
                          <div style={{ fontSize: "9px", padding: "2px 8px", background: "rgba(247,147,26,0.18)", borderRadius: "10px", color: "#f7931a", letterSpacing: "1px", fontWeight: 600 }}>✓ SELECTED</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stripe Form */}
                  {paymentMethod === "stripe" && (
                    <div style={{
                      background: "rgba(10,16,32,0.9)", backdropFilter: "blur(20px)",
                      border: "1px solid rgba(99,102,241,0.15)", borderRadius: "14px", padding: "22px",
                      animation: "fadeUp 0.25s ease",
                    }}>
                      <div style={{ fontSize: "9px", color: "#818cf8", letterSpacing: "2.5px", marginBottom: "16px", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "7px", fontWeight: 600 }}>
                        <span>🔒</span> Secure Checkout via Stripe
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
                        {[
                          { label: "Card Number", placeholder: "**** **** **** ****", cols: 2 },
                          { label: "Expiry Date", placeholder: "MM / YY", cols: 1 },
                          { label: "CVV", placeholder: "***", cols: 1 },
                          { label: "Name on Card", placeholder: "Your Name", cols: 2 },
                        ].map((f) => (
                          <div key={f.label} style={{ gridColumn: `span ${f.cols}` }}>
                            <div style={{ fontSize: "9px", color: "#4b5563", marginBottom: "5px", letterSpacing: "1.2px", textTransform: "uppercase", fontWeight: 500 }}>{f.label}</div>
                            <input placeholder={f.placeholder} style={{
                              width: "100%", background: "rgba(3,5,13,0.7)",
                              border: "1px solid rgba(99,102,241,0.14)", borderRadius: "9px",
                              padding: "10px 13px", fontSize: "12px", color: "#9ca3af",
                              fontFamily: "'JetBrains Mono', monospace", boxSizing: "border-box",
                              outline: "none", transition: "all 0.2s",
                            }}
                              onFocus={e => e.target.style.borderColor = "rgba(99,102,241,0.45)"}
                              onBlur={e => e.target.style.borderColor = "rgba(99,102,241,0.14)"}
                            />
                          </div>
                        ))}
                      </div>
                      <button style={{
                        width: "100%", padding: "15px",
                        background: "linear-gradient(135deg, #635bff, #7c71ff)",
                        border: "none", borderRadius: "11px", color: "white",
                        fontSize: "12px", fontFamily: "'Sora', sans-serif",
                        fontWeight: 700, letterSpacing: "1px", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                        boxShadow: "0 4px 18px rgba(99,91,255,0.35)",
                        transition: "all 0.2s",
                      }}>
                        🔒 PAY ${PLANS.find(p => p.name === selectedPlan)?.price}/MONTH WITH STRIPE
                      </button>
                      <div style={{ textAlign: "center", fontSize: "10px", color: "#1f2937", marginTop: "10px", fontFamily: "'JetBrains Mono', monospace" }}>
                        256-bit SSL encrypted · Cancel anytime
                      </div>
                    </div>
                  )}

                  {/* PayPal Form */}
                  {paymentMethod === "paypal" && (
                    <div style={{
                      background: "rgba(10,16,32,0.9)", backdropFilter: "blur(20px)",
                      border: "1px solid rgba(0,112,229,0.18)", borderRadius: "14px", padding: "22px",
                      animation: "fadeUp 0.25s ease",
                    }}>
                      <div style={{ fontSize: "9px", color: "#60a5fa", letterSpacing: "2.5px", marginBottom: "16px", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "7px", fontWeight: 600 }}>
                        <span>🔒</span> Checkout via PayPal
                      </div>
                      <div style={{
                        background: "#003087", borderRadius: "11px", padding: "14px",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "5px",
                        marginBottom: "18px", boxShadow: "0 4px 16px rgba(0,48,135,0.5)",
                      }}>
                        <span style={{ fontSize: "20px", fontWeight: 900, color: "#009cde", fontFamily: "Arial" }}>Pay</span>
                        <span style={{ fontSize: "20px", fontWeight: 900, color: "#012169", fontFamily: "Arial" }}>Pal</span>
                      </div>
                      {[
                        { label: "PayPal Email", placeholder: "you@example.com", type: "text" },
                        { label: "Password", placeholder: "••••••••", type: "password" },
                      ].map(f => (
                        <div key={f.label} style={{ marginBottom: "12px" }}>
                          <div style={{ fontSize: "9px", color: "#4b5563", marginBottom: "5px", letterSpacing: "1.2px", textTransform: "uppercase", fontWeight: 500 }}>{f.label}</div>
                          <input type={f.type} placeholder={f.placeholder} style={{
                            width: "100%", background: "rgba(3,5,13,0.7)",
                            border: "1px solid rgba(0,112,229,0.18)", borderRadius: "9px",
                            padding: "10px 13px", fontSize: "12px", color: "#9ca3af",
                            fontFamily: "'JetBrains Mono', monospace", boxSizing: "border-box", outline: "none", transition: "all 0.2s",
                          }}
                            onFocus={e => e.target.style.borderColor = "rgba(0,112,229,0.45)"}
                            onBlur={e => e.target.style.borderColor = "rgba(0,112,229,0.18)"}
                          />
                        </div>
                      ))}
                      <div style={{ background: "rgba(0,112,229,0.06)", border: "1px solid rgba(0,112,229,0.12)", borderRadius: "9px", padding: "13px", marginBottom: "14px", marginTop: "4px" }}>
                        {[["Plan", selectedPlan], ["Billing", "Monthly"]].map(([k, v]) => (
                          <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                            <span style={{ fontSize: "11px", color: "#4b5563" }}>{k}</span>
                            <span style={{ fontSize: "11px", color: "#e8eaf2", fontWeight: 600 }}>{v}</span>
                          </div>
                        ))}
                        <div style={{ borderTop: "1px solid rgba(0,112,229,0.1)", paddingTop: "8px", display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontSize: "12px", color: "#e8eaf2", fontWeight: 700 }}>Total</span>
                          <span style={{ fontSize: "12px", color: "#60a5fa", fontWeight: 800, fontFamily: "'JetBrains Mono', monospace" }}>${PLANS.find(p => p.name === selectedPlan)?.price}/mo</span>
                        </div>
                      </div>
                      <button style={{
                        width: "100%", padding: "15px", background: "#0070e0",
                        border: "none", borderRadius: "11px", color: "white",
                        fontSize: "12px", fontFamily: "'Sora', sans-serif",
                        fontWeight: 700, letterSpacing: "1px", cursor: "pointer",
                        boxShadow: "0 4px 16px rgba(0,112,224,0.35)", transition: "all 0.2s",
                      }}>
                        PAY WITH PAYPAL →
                      </button>
                      <div style={{ textAlign: "center", fontSize: "10px", color: "#1f2937", marginTop: "10px", fontFamily: "'JetBrains Mono', monospace" }}>
                        Redirects to PayPal secure login · Cancel anytime
                      </div>
                    </div>
                  )}

                  {/* Crypto Form */}
                  {paymentMethod === "crypto" && (
                    <div style={{
                      background: "rgba(10,16,32,0.9)", backdropFilter: "blur(20px)",
                      border: "1px solid rgba(247,147,26,0.18)", borderRadius: "14px", padding: "22px",
                      animation: "fadeUp 0.25s ease",
                    }}>
                      <div style={{ fontSize: "9px", color: "#f7931a", letterSpacing: "2.5px", marginBottom: "16px", textTransform: "uppercase", display: "flex", alignItems: "center", gap: "7px", fontWeight: 600 }}>
                        <span>🔒</span> Pay with Cryptocurrency
                      </div>

                      {/* Coin selector */}
                      <div style={{ marginBottom: "18px" }}>
                        <div style={{ fontSize: "9px", color: "#4b5563", marginBottom: "9px", letterSpacing: "1.2px", textTransform: "uppercase", fontWeight: 500 }}>Select Coin</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                          {[
                            { symbol: "BTC", name: "Bitcoin", icon: "₿", color: "#f7931a", bg: "rgba(247,147,26,0.12)", border: "rgba(247,147,26,0.35)" },
                            { symbol: "ETH", name: "Ethereum", icon: "Ξ", color: "#627eea", bg: "rgba(98,126,234,0.12)", border: "rgba(98,126,234,0.35)" },
                            { symbol: "USDC", name: "USD Coin", icon: "$", color: "#2775ca", bg: "rgba(39,117,202,0.12)", border: "rgba(39,117,202,0.35)" },
                          ].map((coin) => {
                            const isSelected = selectedCoin === coin.symbol;
                            return (
                              <div key={coin.symbol} onClick={() => setSelectedCoin(coin.symbol)} style={{
                                background: isSelected ? coin.bg : "rgba(3,5,13,0.6)",
                                border: `1.5px solid ${isSelected ? coin.border : "rgba(99,102,241,0.1)"}`,
                                borderRadius: "11px", padding: "11px 8px", cursor: "pointer",
                                transition: "all 0.2s",
                                display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
                                boxShadow: isSelected ? `0 0 16px ${coin.bg}` : "none",
                              }}>
                                <div style={{ fontSize: "18px", color: coin.color, fontWeight: 900 }}>{coin.icon}</div>
                                <div style={{ fontSize: "11px", color: isSelected ? coin.color : "#4b5563", fontWeight: 700, fontFamily: "'JetBrains Mono', monospace" }}>{coin.symbol}</div>
                                <div style={{ fontSize: "9px", color: "#374151" }}>{coin.name}</div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Wallet address */}
                      <div style={{ marginBottom: "16px" }}>
                        <div style={{ fontSize: "9px", color: "#4b5563", marginBottom: "7px", letterSpacing: "1.2px", textTransform: "uppercase", fontWeight: 500 }}>Send to Wallet Address</div>
                        <div style={{
                          background: "rgba(3,5,13,0.8)", border: "1px solid rgba(247,147,26,0.18)",
                          borderRadius: "9px", padding: "11px 13px",
                          display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px",
                        }}>
                          <span style={{ fontSize: "10px", color: "#6b7280", fontFamily: "'JetBrains Mono', monospace", wordBreak: "break-all" }}>
                            {selectedCoin === "BTC" ? "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" : selectedCoin === "ETH" ? "0x71C7656EC7ab88b098defB751B7401B5f6d8976F" : "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"}
                          </span>
                          <button onClick={() => copyText(selectedCoin === "BTC" ? "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" : selectedCoin === "ETH" ? "0x71C7656EC7ab88b098defB751B7401B5f6d8976F" : "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", "wallet")} style={{
                            background: "rgba(247,147,26,0.1)", border: "1px solid rgba(247,147,26,0.2)",
                            borderRadius: "7px", padding: "5px 9px", color: "#f7931a",
                            fontSize: "9px", fontFamily: "'JetBrains Mono', monospace", cursor: "pointer",
                            flexShrink: 0, letterSpacing: "1px", fontWeight: 700, transition: "all 0.2s",
                          }}>{copied === "wallet" ? "✓ COPIED" : "COPY"}</button>
                        </div>
                      </div>

                      {/* QR */}
                      <div style={{ marginBottom: "16px", display: "flex", justifyContent: "center" }}>
                        <div style={{
                          width: "104px", height: "104px", background: "rgba(3,5,13,0.8)",
                          border: "1px solid rgba(247,147,26,0.18)", borderRadius: "12px",
                          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4px",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
                        }}>
                          <div style={{ fontSize: "28px" }}>⬛</div>
                          <div style={{ fontSize: "8px", color: "#1f2937", letterSpacing: "1.5px", fontFamily: "'JetBrains Mono', monospace" }}>QR CODE</div>
                        </div>
                      </div>

                      {/* Order summary */}
                      <div style={{ background: "rgba(247,147,26,0.05)", border: "1px solid rgba(247,147,26,0.12)", borderRadius: "9px", padding: "13px", marginBottom: "16px" }}>
                        {[
                          ["Plan", selectedPlan],
                          ["Amount (USD)", `$${PLANS.find(p => p.name === selectedPlan)?.price}/mo`],
                          ["Network", selectedCoin === "BTC" ? "Bitcoin (BTC)" : selectedCoin === "ETH" ? "Ethereum (ETH)" : "USD Coin (USDC)"],
                        ].map(([k, v]) => (
                          <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                            <span style={{ fontSize: "11px", color: "#4b5563" }}>{k}</span>
                            <span style={{ fontSize: "11px", color: "#e8eaf2", fontWeight: 600 }}>{v}</span>
                          </div>
                        ))}
                        <div style={{ borderTop: "1px solid rgba(247,147,26,0.1)", paddingTop: "9px", display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontSize: "12px", color: "#e8eaf2", fontWeight: 700 }}>≈ {selectedCoin} Amount</span>
                          <span style={{ fontSize: "12px", color: "#f7931a", fontWeight: 900, fontFamily: "'JetBrains Mono', monospace" }}>
                            {selectedCoin === "BTC"
                              ? (PLANS.find(p => p.name === selectedPlan)?.price === 19 ? "0.000302 BTC" : "0.000777 BTC")
                              : selectedCoin === "ETH"
                              ? (PLANS.find(p => p.name === selectedPlan)?.price === 19 ? "0.00712 ETH" : "0.01832 ETH")
                              : `${PLANS.find(p => p.name === selectedPlan)?.price}.00 USDC`}
                          </span>
                        </div>
                      </div>

                      <button style={{
                        width: "100%", padding: "15px",
                        background: "linear-gradient(135deg, #f7931a, #ffb347)",
                        border: "none", borderRadius: "11px", color: "#060a12",
                        fontSize: "12px", fontFamily: "'Sora', sans-serif",
                        fontWeight: 800, letterSpacing: "1px", cursor: "pointer",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                        boxShadow: "0 4px 18px rgba(247,147,26,0.4)", transition: "all 0.2s",
                      }}>
                        ₿ CONFIRM {selectedCoin} PAYMENT
                      </button>
                      <div style={{ textAlign: "center", fontSize: "10px", color: "#1f2937", marginTop: "10px", fontFamily: "'JetBrains Mono', monospace" }}>
                        Rate locked for 15 min · On-chain confirmation required · Cancel anytime
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ====== INTEGRATIONS ====== */}
          {activeNav === "integrations" && (() => {
            const INTEGRATIONS = [
              {
                id: "whatsapp", name: "WhatsApp Business", icon: "💬", color: "#25D366", bg: "rgba(37,211,102,0.08)",
                border: "rgba(37,211,102,0.2)", category: "messaging",
                desc: "Send automated messages, alerts & agent replies via WhatsApp Business API",
                features: ["Auto-reply to customer queries", "Send order updates", "Agent handoff support", "Broadcast messages"],
                badge: "POPULAR",
              },
              {
                id: "slack", name: "Slack", icon: "🟣", color: "#4A154B", bg: "rgba(74,21,75,0.12)", accent: "#E01E5A",
                border: "rgba(224,30,90,0.25)", category: "messaging",
                desc: "Connect agents to Slack channels — get instant notifications & run commands",
                features: ["Post to any channel", "Slash command triggers", "DM notifications", "Team alerts"],
                badge: "CONNECTED",
              },
              {
                id: "telegram", name: "Telegram Bot", icon: "✈️", color: "#229ED9", bg: "rgba(34,158,217,0.08)",
                border: "rgba(34,158,217,0.2)", category: "messaging",
                desc: "Deploy your agent as a fully functional Telegram bot in minutes",
                features: ["Bot commands", "Inline keyboard buttons", "Group chat support", "File sharing"],
              },
              {
                id: "email", name: "Email (Gmail/SMTP)", icon: "📧", color: "#EA4335", bg: "rgba(234,67,53,0.08)",
                border: "rgba(234,67,53,0.2)", category: "productivity",
                desc: "Auto-send emails, reply to support tickets, and trigger campaigns",
                features: ["Auto email replies", "Ticket routing", "Newsletter triggers", "Attachment handling"],
              },
              {
                id: "zapier", name: "Zapier", icon: "⚡", color: "#FF4A00", bg: "rgba(255,74,0,0.08)",
                border: "rgba(255,74,0,0.2)", category: "automation",
                desc: "Connect your agents to 5000+ apps through Zapier automation workflows",
                features: ["5000+ app connections", "Multi-step zaps", "Auto triggers", "No-code setup"],
                badge: "NEW",
              },
              {
                id: "webhook", name: "Webhook / REST API", icon: "🔌", color: "#818cf8", bg: "rgba(129,140,248,0.08)",
                border: "rgba(129,140,248,0.2)", category: "developer",
                desc: "Custom HTTP webhooks to trigger agents from any app or service",
                features: ["POST/GET webhooks", "Custom headers", "JSON payload", "Retry logic"],
              },
              {
                id: "hubspot", name: "HubSpot CRM", icon: "🧲", color: "#FF7A59", bg: "rgba(255,122,89,0.08)",
                border: "rgba(255,122,89,0.2)", category: "crm",
                desc: "Sync leads, contacts & deals — let agents qualify and follow up automatically",
                features: ["Lead qualification", "Deal stage updates", "Contact sync", "Follow-up automation"],
              },
              {
                id: "notion", name: "Notion", icon: "📝", color: "#ffffff", bg: "rgba(255,255,255,0.05)",
                border: "rgba(255,255,255,0.12)", category: "productivity",
                desc: "Read and write Notion pages, databases, and docs using your agents",
                features: ["Page creation", "Database queries", "Auto-documentation", "Meeting notes"],
              },
            ];

            const INTEG_TABS = ["all", "messaging", "automation", "crm", "developer", "productivity"];

            const filtered = INTEGRATIONS.filter(i =>
              (activeIntegTab === "all" || i.category === activeIntegTab) &&
              i.name.toLowerCase().includes(integrationSearch.toLowerCase())
            );

            const sendTestMsg = async () => {
              if (!testMsg.trim() || testLoading) return;
              const userMsg = testMsg;
              setTestMsg("");
              setTestChat(p => [...p, { role: "user", text: userMsg }]);
              setTestLoading(true);
              try {
                const res = await fetch("https://api.anthropic.com/v1/messages", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    model: "claude-sonnet-4-20250514",
                    max_tokens: 1000,
                    system: `You are a helpful AI agent connected via ${testingBot?.name}. Be concise, friendly and helpful. Respond as if you're replying in ${testingBot?.name}.`,
                    messages: [{ role: "user", content: userMsg }],
                  }),
                });
                const data = await res.json();
                const reply = data.content?.map(c => c.text || "").join("") || "Sorry, could not process.";
                setTestChat(p => [...p, { role: "bot", text: reply }]);
              } catch {
                setTestChat(p => [...p, { role: "bot", text: "⚠️ Connection error. Please try again." }]);
              } finally {
                setTestLoading(false);
              }
            };

            return (
              <div>
                {/* Header */}
                <div style={{ marginBottom: "26px" }}>
                  <h2 style={{ margin: "0 0 5px", fontSize: "21px", fontWeight: 700, letterSpacing: "-0.2px" }}>🔗 Integrations</h2>
                  <p style={{ margin: 0, color: "#6b7280", fontSize: "13px" }}>Connect your agents to WhatsApp, Slack, and 50+ platforms</p>
                </div>

                {/* Connected Banner */}
                <div style={{
                  background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.18)",
                  borderRadius: "13px", padding: "14px 20px", marginBottom: "22px",
                  display: "flex", alignItems: "center", gap: "12px",
                }}>
                  <span style={{ fontSize: "18px" }}>✅</span>
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "#34d399" }}>Slack is Connected</div>
                    <div style={{ fontSize: "11px", color: "#4b5563", marginTop: "2px" }}>Your agents can now post to #general, #support channels</div>
                  </div>
                  <button onClick={() => setTestingBot(INTEGRATIONS.find(i => i.id === "slack"))} style={{
                    marginLeft: "auto", padding: "7px 16px",
                    background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)",
                    borderRadius: "9px", color: "#34d399",
                    fontSize: "10px", fontWeight: 700, cursor: "pointer", letterSpacing: "1px",
                  }}>TEST BOT →</button>
                </div>

                {/* Search + Tabs */}
                <div style={{ display: "flex", gap: "12px", marginBottom: "18px", flexWrap: "wrap", alignItems: "center" }}>
                  <div style={{ position: "relative", flex: 1, minWidth: "180px" }}>
                    <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#374151", fontSize: "13px" }}>🔍</span>
                    <input value={integrationSearch} onChange={e => setIntegrationSearch(e.target.value)}
                      placeholder="Search integrations..."
                      style={{
                        width: "100%", background: "rgba(10,16,32,0.85)",
                        border: "1px solid rgba(99,102,241,0.14)", borderRadius: "10px",
                        padding: "10px 12px 10px 35px", color: "#e8eaf2",
                        fontSize: "12px", fontFamily: "'Sora', sans-serif",
                        boxSizing: "border-box", outline: "none",
                      }} />
                  </div>
                </div>

                {/* Category Tabs */}
                <div style={{ display: "flex", gap: "7px", marginBottom: "22px", flexWrap: "wrap" }}>
                  {INTEG_TABS.map(tab => (
                    <button key={tab} onClick={() => setActiveIntegTab(tab)} style={{
                      padding: "6px 16px",
                      background: activeIntegTab === tab ? "linear-gradient(135deg, #6366f1, #a855f7)" : "rgba(10,16,32,0.8)",
                      border: `1px solid ${activeIntegTab === tab ? "transparent" : "rgba(99,102,241,0.14)"}`,
                      borderRadius: "20px", color: activeIntegTab === tab ? "white" : "#6b7280",
                      fontSize: "10px", fontWeight: 600, cursor: "pointer",
                      letterSpacing: "0.8px", transition: "all 0.2s", textTransform: "capitalize",
                      boxShadow: activeIntegTab === tab ? "0 2px 12px rgba(99,102,241,0.35)" : "none",
                    }}>{tab}</button>
                  ))}
                </div>

                {/* Integration Cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px", marginBottom: "28px" }}>
                  {filtered.map(integ => {
                    const isConnected = connectedApps.includes(integ.id);
                    return (
                      <div key={integ.id} className="glass-card" style={{
                        borderRadius: "14px", padding: "22px",
                        background: isConnected ? `${integ.bg}` : "rgba(10,16,32,0.8)",
                        border: `1px solid ${isConnected ? integ.border : "rgba(99,102,241,0.1)"}`,
                        position: "relative", overflow: "hidden",
                        boxShadow: isConnected ? `0 0 24px ${integ.bg}` : "none",
                      }}>
                        {integ.badge && (
                          <div style={{
                            position: "absolute", top: "12px", right: "12px",
                            fontSize: "8px", padding: "3px 9px", borderRadius: "20px",
                            background: integ.badge === "CONNECTED" ? "rgba(52,211,153,0.15)" : integ.badge === "POPULAR" ? "rgba(245,200,66,0.15)" : "rgba(99,102,241,0.15)",
                            border: `1px solid ${integ.badge === "CONNECTED" ? "rgba(52,211,153,0.3)" : integ.badge === "POPULAR" ? "rgba(245,200,66,0.3)" : "rgba(99,102,241,0.3)"}`,
                            color: integ.badge === "CONNECTED" ? "#34d399" : integ.badge === "POPULAR" ? "#f5c842" : "#818cf8",
                            letterSpacing: "1.2px", fontWeight: 700,
                          }}>{integ.badge === "CONNECTED" ? "✓ CONNECTED" : integ.badge}</div>
                        )}

                        {/* Top */}
                        <div style={{ display: "flex", alignItems: "center", gap: "13px", marginBottom: "13px" }}>
                          <div style={{
                            width: "46px", height: "46px", borderRadius: "12px",
                            background: integ.bg, border: `1px solid ${integ.border}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "22px", flexShrink: 0,
                          }}>{integ.icon}</div>
                          <div>
                            <div style={{ fontSize: "14px", fontWeight: 700, color: "#e8eaf2" }}>{integ.name}</div>
                            <div style={{ fontSize: "9px", color: "#4b5563", textTransform: "uppercase", letterSpacing: "1px", marginTop: "2px" }}>{integ.category}</div>
                          </div>
                        </div>

                        <p style={{ margin: "0 0 13px", color: "#6b7280", fontSize: "11px", lineHeight: 1.6 }}>{integ.desc}</p>

                        {/* Features */}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "16px" }}>
                          {integ.features.map(f => (
                            <span key={f} style={{
                              fontSize: "9px", padding: "3px 9px",
                              background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.13)",
                              borderRadius: "20px", color: "#6b7280",
                            }}>{f}</span>
                          ))}
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            onClick={() => {
                              if (isConnected) {
                                setConnectedApps(p => p.filter(a => a !== integ.id));
                              } else {
                                setConnectedApps(p => [...p, integ.id]);
                              }
                            }}
                            style={{
                              flex: 1, padding: "9px",
                              background: isConnected
                                ? "rgba(239,68,68,0.08)"
                                : `linear-gradient(135deg, ${integ.color}22, ${integ.color}11)`,
                              border: `1px solid ${isConnected ? "rgba(239,68,68,0.2)" : integ.border}`,
                              borderRadius: "9px",
                              color: isConnected ? "#f87171" : integ.accent || integ.color,
                              fontSize: "10px", fontWeight: 700, cursor: "pointer",
                              letterSpacing: "1px", transition: "all 0.2s",
                            }}>
                            {isConnected ? "DISCONNECT" : "CONNECT"}
                          </button>
                          {isConnected && (
                            <button onClick={() => { setTestingBot(integ); setTestChat([]); }} style={{
                              padding: "9px 14px",
                              background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
                              borderRadius: "9px", color: "#818cf8",
                              fontSize: "10px", fontWeight: 700, cursor: "pointer",
                              letterSpacing: "1px", transition: "all 0.2s",
                            }}>TEST</button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Live Test Panel */}
                {testingBot && (
                  <div style={{
                    background: "rgba(10,16,32,0.95)", border: "1px solid rgba(99,102,241,0.25)",
                    borderRadius: "16px", overflow: "hidden",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(99,102,241,0.08)",
                    animation: "fadeUp 0.3s ease",
                  }}>
                    {/* Test Header */}
                    <div style={{
                      padding: "16px 22px",
                      background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(168,85,247,0.07))",
                      borderBottom: "1px solid rgba(99,102,241,0.15)",
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "20px" }}>{testingBot.icon}</span>
                        <div>
                          <div style={{ fontSize: "13px", fontWeight: 700, color: "#e8eaf2" }}>Live Test — {testingBot.name}</div>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#34d399", boxShadow: "0 0 6px #34d399" }} />
                            <span style={{ fontSize: "10px", color: "#34d399" }}>Connected & Live</span>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => { setTestingBot(null); setTestChat([]); }} style={{
                        width: "28px", height: "28px",
                        background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
                        borderRadius: "7px", color: "#f87171",
                        fontSize: "14px", cursor: "pointer", display: "flex",
                        alignItems: "center", justifyContent: "center",
                      }}>✕</button>
                    </div>

                    {/* Chat Area */}
                    <div style={{
                      height: "280px", overflowY: "auto", padding: "18px 22px",
                      display: "flex", flexDirection: "column", gap: "12px",
                    }}>
                      {testChat.length === 0 && (
                        <div style={{ textAlign: "center", marginTop: "60px" }}>
                          <div style={{ fontSize: "28px", marginBottom: "8px" }}>{testingBot.icon}</div>
                          <div style={{ fontSize: "12px", color: "#4b5563" }}>Send a message to test your {testingBot.name} bot</div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "7px", justifyContent: "center", marginTop: "14px" }}>
                            {["Hello! Who are you?", "What can you help me with?", "Tell me about pricing"].map(ex => (
                              <span key={ex} onClick={() => setTestMsg(ex)} style={{
                                fontSize: "10px", padding: "5px 12px",
                                background: "rgba(99,102,241,0.07)", border: "1px solid rgba(99,102,241,0.14)",
                                borderRadius: "20px", color: "#6b7280", cursor: "pointer",
                              }}>{ex}</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {testChat.map((msg, i) => (
                        <div key={i} style={{
                          display: "flex",
                          justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                        }}>
                          {msg.role === "bot" && (
                            <div style={{
                              width: "28px", height: "28px", borderRadius: "8px", flexShrink: 0,
                              background: `linear-gradient(135deg, ${testingBot.color}22, ${testingBot.color}11)`,
                              border: `1px solid ${testingBot.border}`,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: "14px", marginRight: "8px", alignSelf: "flex-end",
                            }}>{testingBot.icon}</div>
                          )}
                          <div style={{
                            maxWidth: "75%", padding: "10px 14px", borderRadius: "12px",
                            background: msg.role === "user"
                              ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                              : "rgba(15,24,41,0.9)",
                            border: msg.role === "user" ? "none" : "1px solid rgba(99,102,241,0.15)",
                            color: "#e8eaf2", fontSize: "12px", lineHeight: 1.6,
                            boxShadow: msg.role === "user" ? "0 3px 12px rgba(99,102,241,0.3)" : "none",
                          }}>{msg.text}</div>
                        </div>
                      ))}
                      {testLoading && (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <div style={{
                            width: "28px", height: "28px", borderRadius: "8px",
                            background: `linear-gradient(135deg, ${testingBot.color}22, ${testingBot.color}11)`,
                            border: `1px solid ${testingBot.border}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "14px",
                          }}>{testingBot.icon}</div>
                          <div style={{
                            padding: "10px 16px", borderRadius: "12px",
                            background: "rgba(15,24,41,0.9)", border: "1px solid rgba(99,102,241,0.15)",
                            display: "flex", gap: "4px", alignItems: "center",
                          }}>
                            {[0,1,2].map(d => (
                              <div key={d} style={{
                                width: "6px", height: "6px", borderRadius: "50%",
                                background: "#818cf8", animation: "pulse 1.2s ease-in-out infinite",
                                animationDelay: `${d * 0.2}s`,
                              }} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Input */}
                    <div style={{
                      padding: "14px 22px",
                      borderTop: "1px solid rgba(99,102,241,0.1)",
                      display: "flex", gap: "10px", alignItems: "center",
                    }}>
                      <input
                        value={testMsg}
                        onChange={e => setTestMsg(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && sendTestMsg()}
                        placeholder={`Message your ${testingBot.name} bot...`}
                        style={{
                          flex: 1, background: "rgba(3,5,13,0.8)",
                          border: "1px solid rgba(99,102,241,0.15)", borderRadius: "10px",
                          padding: "11px 14px", color: "#e8eaf2",
                          fontSize: "12px", fontFamily: "'Sora', sans-serif", outline: "none",
                        }}
                      />
                      <button onClick={sendTestMsg} disabled={testLoading} style={{
                        padding: "11px 20px",
                        background: testLoading ? "rgba(99,102,241,0.2)" : "linear-gradient(135deg, #6366f1, #a855f7)",
                        border: "none", borderRadius: "10px", color: "white",
                        fontSize: "11px", fontWeight: 700, cursor: testLoading ? "not-allowed" : "pointer",
                        letterSpacing: "1px", transition: "all 0.2s",
                        boxShadow: testLoading ? "none" : "0 3px 12px rgba(99,102,241,0.35)",
                      }}>
                        {testLoading ? "..." : "SEND ↗"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}


          {/* ====== LANGUAGE ====== */}
          {activeNav === "language" && (() => {
            const t = UI_STRINGS[uiLang] || UI_STRINGS["en"];

            const doTranslate = async () => {
              if (!translateInput.trim() || translateLoading) return;
              setTranslateLoading(true);
              setTranslatedText("");
              try {
                const fromLang = LANGUAGES.find(l => l.code === translateFrom)?.name || "English";
                const toLang = LANGUAGES.find(l => l.code === translateTo)?.name || "Urdu";
                const res = await fetch("https://api.anthropic.com/v1/messages", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    model: "claude-sonnet-4-20250514",
                    max_tokens: 1000,
                    messages: [{
                      role: "user",
                      content: `Translate the following text from ${fromLang} to ${toLang}. Return ONLY the translated text, nothing else:\n\n${translateInput}`
                    }],
                  }),
                });
                const data = await res.json();
                const result = data.content?.map(c => c.text || "").join("") || "";
                setTranslatedText(result);
              } catch {
                setTranslatedText("⚠️ Translation failed. Please try again.");
              } finally {
                setTranslateLoading(false);
              }
            };

            const isRTL = LANGUAGES.find(l => l.code === uiLang)?.rtl;

            return (
              <div dir={isRTL ? "rtl" : "ltr"}>
                {/* Header */}
                <div style={{ marginBottom: "26px" }}>
                  <h2 style={{ margin: "0 0 5px", fontSize: "21px", fontWeight: 700, letterSpacing: "-0.2px" }}>
                    🌐 {t.overview === "جائزہ" ? "زبان کی ترتیبات" : t.overview === "概览" ? "多语言支持" : "Multi-Language Support"}
                  </h2>
                  <p style={{ margin: 0, color: "#6b7280", fontSize: "13px" }}>
                    {uiLang === "ur" ? "اپنی مرضی کی زبان میں ڈیش بورڈ استعمال کریں" : uiLang === "hi" ? "अपनी पसंदीदा भाषा में डैशबोर्ड उपयोग करें" : "Use the dashboard & agents in your preferred language"}
                  </p>
                </div>

                {/* Stats */}
                <div style={{ display: "flex", gap: "14px", marginBottom: "26px", flexWrap: "wrap" }}>
                  {[
                    { label: "Languages", value: "15+", color: "#818cf8" },
                    { label: "Countries", value: "80+", color: "#34d399" },
                    { label: "RTL Support", value: "Yes ✓", color: "#fbbf24" },
                    { label: "Auto-Detect", value: "On", color: "#c084fc" },
                  ].map(s => (
                    <div key={s.label} style={{
                      background: "rgba(10,16,32,0.8)", border: "1px solid rgba(99,102,241,0.1)",
                      borderRadius: "11px", padding: "13px 20px",
                    }}>
                      <div style={{ fontSize: "18px", fontWeight: 800, color: s.color, fontFamily: "'JetBrains Mono', monospace" }}>{s.value}</div>
                      <div style={{ fontSize: "9px", color: "#4b5563", letterSpacing: "1.5px", textTransform: "uppercase", marginTop: "3px" }}>{s.label}</div>
                    </div>
                  ))}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "24px" }}>

                  {/* UI Language Selector */}
                  <div style={{
                    background: "rgba(10,16,32,0.85)", border: "1px solid rgba(99,102,241,0.15)",
                    borderRadius: "16px", padding: "24px",
                  }}>
                    <div style={{ fontSize: "9px", color: "#818cf8", letterSpacing: "2.5px", marginBottom: "16px", textTransform: "uppercase", fontWeight: 600 }}>▸ Dashboard UI Language</div>
                    <p style={{ margin: "0 0 16px", color: "#6b7280", fontSize: "11px", lineHeight: 1.6 }}>
                      Change the entire dashboard interface language. Buttons, menus, labels — everything updates instantly.
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                      {LANGUAGES.slice(0, 8).map(lang => (
                        <div key={lang.code} onClick={() => setUiLang(lang.code)} style={{
                          padding: "10px 12px", borderRadius: "10px", cursor: "pointer",
                          background: uiLang === lang.code
                            ? "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(168,85,247,0.12))"
                            : "rgba(3,5,13,0.6)",
                          border: `1px solid ${uiLang === lang.code ? "rgba(99,102,241,0.4)" : "rgba(99,102,241,0.08)"}`,
                          display: "flex", alignItems: "center", gap: "8px",
                          transition: "all 0.2s",
                          boxShadow: uiLang === lang.code ? "0 0 14px rgba(99,102,241,0.15)" : "none",
                        }}>
                          <span style={{ fontSize: "16px" }}>{lang.flag}</span>
                          <div>
                            <div style={{ fontSize: "11px", fontWeight: 600, color: uiLang === lang.code ? "#a5b4fc" : "#9ca3af" }}>{lang.name}</div>
                            <div style={{ fontSize: "9px", color: "#4b5563" }}>{lang.native}</div>
                          </div>
                          {uiLang === lang.code && (
                            <div style={{ marginLeft: "auto", width: "6px", height: "6px", borderRadius: "50%", background: "#818cf8", boxShadow: "0 0 6px #818cf8" }} />
                          )}
                        </div>
                      ))}
                    </div>
                    {/* Live preview */}
                    <div style={{
                      marginTop: "16px", padding: "14px", borderRadius: "11px",
                      background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.12)",
                    }}>
                      <div style={{ fontSize: "9px", color: "#4b5563", letterSpacing: "1.5px", marginBottom: "10px", textTransform: "uppercase" }}>▸ LIVE PREVIEW</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
                        {["welcome","buildAgent","myAgents","marketplace","upgrade"].map(key => (
                          <span key={key} style={{
                            fontSize: "10px", padding: "4px 11px",
                            background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
                            borderRadius: "20px", color: "#818cf8",
                            fontFamily: LANGUAGES.find(l => l.code === uiLang)?.rtl ? "serif" : "inherit",
                          }}>{(UI_STRINGS[uiLang] || UI_STRINGS["en"])[key]}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Agent Language Selector */}
                  <div style={{
                    background: "rgba(10,16,32,0.85)", border: "1px solid rgba(99,102,241,0.15)",
                    borderRadius: "16px", padding: "24px",
                  }}>
                    <div style={{ fontSize: "9px", color: "#c084fc", letterSpacing: "2.5px", marginBottom: "16px", textTransform: "uppercase", fontWeight: 600 }}>▸ Agent Response Languages</div>
                    <p style={{ margin: "0 0 16px", color: "#6b7280", fontSize: "11px", lineHeight: 1.6 }}>
                      Select which languages your agents can respond in. Multi-select allowed — agents auto-detect user language.
                    </p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                      {LANGUAGES.map(lang => {
                        const selected = agentLang.includes(lang.code);
                        return (
                          <div key={lang.code} onClick={() => {
                            setAgentLang(p => selected && p.length > 1 ? p.filter(c => c !== lang.code) : selected ? p : [...p, lang.code]);
                          }} style={{
                            padding: "9px 12px", borderRadius: "10px", cursor: "pointer",
                            background: selected ? "linear-gradient(135deg, rgba(192,132,252,0.15), rgba(168,85,247,0.08))" : "rgba(3,5,13,0.6)",
                            border: `1px solid ${selected ? "rgba(192,132,252,0.35)" : "rgba(99,102,241,0.08)"}`,
                            display: "flex", alignItems: "center", gap: "8px",
                            transition: "all 0.2s",
                          }}>
                            <span style={{ fontSize: "15px" }}>{lang.flag}</span>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: "10px", fontWeight: 600, color: selected ? "#d8b4fe" : "#6b7280" }}>{lang.name}</div>
                            </div>
                            <div style={{
                              width: "14px", height: "14px", borderRadius: "4px",
                              background: selected ? "linear-gradient(135deg, #8b5cf6, #a855f7)" : "transparent",
                              border: `1px solid ${selected ? "transparent" : "rgba(99,102,241,0.2)"}`,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: "8px", color: "white", flexShrink: 0,
                            }}>{selected ? "✓" : ""}</div>
                          </div>
                        );
                      })}
                    </div>
                    <div style={{
                      marginTop: "14px", padding: "11px 14px", borderRadius: "10px",
                      background: "rgba(192,132,252,0.06)", border: "1px solid rgba(192,132,252,0.12)",
                      display: "flex", alignItems: "center", gap: "8px",
                    }}>
                      <span style={{ fontSize: "14px" }}>🤖</span>
                      <div style={{ fontSize: "11px", color: "#9ca3af" }}>
                        <strong style={{ color: "#d8b4fe" }}>{agentLang.length} language{agentLang.length > 1 ? "s" : ""}</strong> selected — agents will auto-respond in user's language
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Translator Tool */}
                <div style={{
                  background: "rgba(10,16,32,0.85)", border: "1px solid rgba(99,102,241,0.15)",
                  borderRadius: "16px", padding: "24px", marginBottom: "22px",
                }}>
                  <div style={{ fontSize: "9px", color: "#34d399", letterSpacing: "2.5px", marginBottom: "6px", textTransform: "uppercase", fontWeight: 600 }}>▸ AI Translator — Live Demo</div>
                  <p style={{ margin: "0 0 18px", color: "#6b7280", fontSize: "11px" }}>Translate any text instantly using your AI agent. Supports all 15 languages.</p>

                  {/* From / To selectors */}
                  <div style={{ display: "flex", gap: "12px", marginBottom: "14px", alignItems: "center", flexWrap: "wrap" }}>
                    <div style={{ flex: 1, minWidth: "140px" }}>
                      <div style={{ fontSize: "9px", color: "#4b5563", letterSpacing: "1.2px", marginBottom: "6px", textTransform: "uppercase" }}>FROM</div>
                      <select value={translateFrom} onChange={e => setTranslateFrom(e.target.value)} style={{
                        width: "100%", background: "rgba(3,5,13,0.8)",
                        border: "1px solid rgba(99,102,241,0.15)", borderRadius: "9px",
                        padding: "9px 12px", color: "#e8eaf2",
                        fontSize: "12px", fontFamily: "'Sora', sans-serif", outline: "none",
                      }}>
                        {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.flag} {l.name}</option>)}
                      </select>
                    </div>
                    <div style={{ paddingTop: "18px", color: "#4b5563", fontSize: "18px", cursor: "pointer" }}
                      onClick={() => { const tmp = translateFrom; setTranslateFrom(translateTo); setTranslateTo(tmp); }}>
                      ⇄
                    </div>
                    <div style={{ flex: 1, minWidth: "140px" }}>
                      <div style={{ fontSize: "9px", color: "#4b5563", letterSpacing: "1.2px", marginBottom: "6px", textTransform: "uppercase" }}>TO</div>
                      <select value={translateTo} onChange={e => setTranslateTo(e.target.value)} style={{
                        width: "100%", background: "rgba(3,5,13,0.8)",
                        border: "1px solid rgba(99,102,241,0.15)", borderRadius: "9px",
                        padding: "9px 12px", color: "#e8eaf2",
                        fontSize: "12px", fontFamily: "'Sora', sans-serif", outline: "none",
                      }}>
                        {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.flag} {l.name}</option>)}
                      </select>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                    <div>
                      <textarea
                        value={translateInput} onChange={e => setTranslateInput(e.target.value)}
                        placeholder="Type or paste text to translate..."
                        rows={4}
                        style={{
                          width: "100%", background: "rgba(3,5,13,0.7)",
                          border: "1px solid rgba(99,102,241,0.14)", borderRadius: "10px",
                          padding: "13px", color: "#e8eaf2", fontSize: "12px",
                          fontFamily: "'Sora', sans-serif", resize: "none",
                          boxSizing: "border-box", outline: "none", lineHeight: 1.6,
                        }}
                      />
                    </div>
                    <div style={{
                      background: "rgba(3,5,13,0.5)", border: "1px solid rgba(52,211,153,0.12)",
                      borderRadius: "10px", padding: "13px", minHeight: "100px",
                      fontSize: "12px", color: translatedText ? "#e8eaf2" : "#374151",
                      lineHeight: 1.6, fontFamily: "'Sora', sans-serif",
                      direction: LANGUAGES.find(l => l.code === translateTo)?.rtl ? "rtl" : "ltr",
                    }}>
                      {translateLoading ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#4b5563" }}>
                          <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⚙</span> Translating...
                        </div>
                      ) : translatedText || "Translation will appear here..."}
                    </div>
                  </div>

                  <button onClick={doTranslate} disabled={translateLoading} style={{
                    padding: "12px 28px",
                    background: translateLoading ? "rgba(52,211,153,0.1)" : "linear-gradient(135deg, #10b981, #34d399)",
                    border: translateLoading ? "1px solid rgba(52,211,153,0.2)" : "none",
                    borderRadius: "11px", color: translateLoading ? "#34d399" : "#06080f",
                    fontSize: "11px", fontFamily: "'Sora', sans-serif",
                    fontWeight: 800, letterSpacing: "1.5px", cursor: translateLoading ? "not-allowed" : "pointer",
                    boxShadow: translateLoading ? "none" : "0 4px 16px rgba(52,211,153,0.3)",
                    display: "flex", alignItems: "center", gap: "8px",
                    transition: "all 0.2s",
                  }}>
                    {translateLoading ? <><span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⚙</span> TRANSLATING...</> : "🌐 TRANSLATE NOW"}
                  </button>
                </div>

                {/* RTL Info */}
                <div style={{
                  background: "linear-gradient(135deg, rgba(245,200,66,0.07), rgba(99,102,241,0.05))",
                  border: "1px solid rgba(245,200,66,0.15)", borderRadius: "13px", padding: "18px 22px",
                  display: "flex", gap: "14px", alignItems: "flex-start",
                }}>
                  <span style={{ fontSize: "22px", flexShrink: 0 }}>💡</span>
                  <div>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "#f5c842", marginBottom: "5px" }}>RTL Language Support</div>
                    <div style={{ fontSize: "11px", color: "#6b7280", lineHeight: 1.7 }}>
                      Arabic and other RTL languages are fully supported. When Arabic is selected as UI language, the entire dashboard layout flips to right-to-left automatically. Your agents will also respond in proper RTL format for Arabic, Urdu, and Hebrew users.
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}


          {/* ====== TEAM COLLABORATION ====== */}
          {activeNav === "team" && (
            <div>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "26px", flexWrap: "wrap", gap: "14px" }}>
                <div>
                  <h2 style={{ margin: "0 0 5px", fontSize: "21px", fontWeight: 700, letterSpacing: "-0.2px" }}>👥 Team Collaboration</h2>
                  <p style={{ margin: 0, color: "#6b7280", fontSize: "13px" }}>Manage your team, roles & shared agents</p>
                </div>
                <div style={{ display: "flex", gap: "9px" }}>
                  {["members","activity","permissions"].map(tab => (
                    <button key={tab} onClick={() => setTeamTab(tab)} style={{
                      padding: "8px 18px",
                      background: teamTab === tab ? "linear-gradient(135deg, #6366f1, #a855f7)" : "rgba(10,16,32,0.8)",
                      border: `1px solid ${teamTab === tab ? "transparent" : "rgba(99,102,241,0.14)"}`,
                      borderRadius: "20px", color: teamTab === tab ? "white" : "#6b7280",
                      fontSize: "10px", fontWeight: 600, cursor: "pointer",
                      letterSpacing: "0.8px", transition: "all 0.2s", textTransform: "capitalize",
                      boxShadow: teamTab === tab ? "0 2px 12px rgba(99,102,241,0.35)" : "none",
                    }}>{tab}</button>
                  ))}
                </div>
              </div>

              {/* Stats Row */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px,1fr))", gap: "14px", marginBottom: "24px" }}>
                {[
                  { label: "Team Members", value: teamMembers.length, icon: "👥", color: "#818cf8" },
                  { label: "Online Now", value: teamMembers.filter(m => m.status === "online").length, icon: "🟢", color: "#34d399" },
                  { label: "Total Agents", value: teamMembers.reduce((s,m) => s + m.agents, 0), icon: "◈", color: "#fbbf24" },
                  { label: "Plan Seats", value: "5 / 5", icon: "◎", color: "#c084fc" },
                ].map(s => (
                  <div key={s.label} className="stat-card" style={{
                    background: "rgba(10,16,32,0.8)", border: "1px solid rgba(99,102,241,0.1)",
                    borderRadius: "13px", padding: "18px",
                  }}>
                    <div style={{ fontSize: "22px", marginBottom: "6px" }}>{s.icon}</div>
                    <div style={{ fontSize: "26px", fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: "9px", color: "#4b5563", marginTop: "5px", letterSpacing: "1.2px", textTransform: "uppercase" }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* ── MEMBERS TAB ── */}
              {teamTab === "members" && (
                <div>
                  {/* Invite Card */}
                  <div style={{
                    background: "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(168,85,247,0.06))",
                    border: "1px solid rgba(99,102,241,0.2)", borderRadius: "14px",
                    padding: "22px", marginBottom: "22px",
                    position: "relative", overflow: "hidden",
                  }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, #6366f1, #a855f7)" }} />
                    <div style={{ fontSize: "9px", color: "#818cf8", letterSpacing: "2.5px", marginBottom: "14px", textTransform: "uppercase", fontWeight: 600 }}>▸ Invite New Member</div>
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "flex-end" }}>
                      <div style={{ flex: 2, minWidth: "180px" }}>
                        <div style={{ fontSize: "9px", color: "#4b5563", letterSpacing: "1.2px", marginBottom: "6px", textTransform: "uppercase" }}>Email Address</div>
                        <input
                          value={inviteEmail} onChange={e => { setInviteEmail(e.target.value); setInviteSent(false); }}
                          placeholder="colleague@company.com"
                          style={{
                            width: "100%", background: "rgba(3,5,13,0.7)",
                            border: "1px solid rgba(99,102,241,0.14)", borderRadius: "9px",
                            padding: "11px 13px", color: "#e8eaf2",
                            fontSize: "12px", fontFamily: "'Sora', sans-serif",
                            boxSizing: "border-box", outline: "none",
                          }}
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: "120px" }}>
                        <div style={{ fontSize: "9px", color: "#4b5563", letterSpacing: "1.2px", marginBottom: "6px", textTransform: "uppercase" }}>Role</div>
                        <select value={inviteRole} onChange={e => setInviteRole(e.target.value)} style={{
                          width: "100%", background: "rgba(3,5,13,0.7)",
                          border: "1px solid rgba(99,102,241,0.14)", borderRadius: "9px",
                          padding: "11px 12px", color: "#e8eaf2",
                          fontSize: "12px", fontFamily: "'Sora', sans-serif", outline: "none",
                        }}>
                          <option value="Viewer">👁 Viewer</option>
                          <option value="Editor">✏️ Editor</option>
                          <option value="Admin">⚡ Admin</option>
                        </select>
                      </div>
                      <button
                        onClick={() => {
                          if (!inviteEmail.trim()) return;
                          const colors = ["#f472b6","#60a5fa","#fb923c","#a3e635"];
                          const newMember = {
                            id: Date.now(), name: inviteEmail.split("@")[0],
                            email: inviteEmail, role: inviteRole,
                            avatar: inviteEmail[0].toUpperCase(),
                            color: colors[Math.floor(Math.random()*colors.length)],
                            status: "offline", joined: "Just now", agents: 0, lastActive: "Never",
                          };
                          setTeamMembers(p => [...p, newMember]);
                          setInviteSent(true);
                          setInviteEmail("");
                        }}
                        style={{
                          padding: "11px 22px",
                          background: inviteSent ? "rgba(52,211,153,0.12)" : "linear-gradient(135deg, #6366f1, #a855f7)",
                          border: inviteSent ? "1px solid rgba(52,211,153,0.3)" : "none",
                          borderRadius: "10px", color: inviteSent ? "#34d399" : "white",
                          fontSize: "11px", fontFamily: "'Sora', sans-serif",
                          fontWeight: 700, letterSpacing: "1px", cursor: "pointer",
                          boxShadow: inviteSent ? "none" : "0 3px 14px rgba(99,102,241,0.35)",
                          transition: "all 0.2s", whiteSpace: "nowrap",
                        }}>
                        {inviteSent ? "✓ SENT!" : "SEND INVITE"}
                      </button>
                    </div>
                  </div>

                  {/* Members List */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {teamMembers.map(member => {
                      const roleColors = { Admin: "#f5c842", Editor: "#818cf8", Viewer: "#34d399" };
                      const statusColors = { online: "#34d399", away: "#fbbf24", offline: "#374151" };
                      return (
                        <div key={member.id} className="glass-card" style={{
                          borderRadius: "13px", padding: "18px 22px",
                          display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap",
                        }}>
                          {/* Avatar */}
                          <div style={{ position: "relative", flexShrink: 0 }}>
                            <div style={{
                              width: "44px", height: "44px", borderRadius: "12px",
                              background: `linear-gradient(135deg, ${member.color}33, ${member.color}18)`,
                              border: `1px solid ${member.color}44`,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: "17px", fontWeight: 800, color: member.color,
                              boxShadow: `0 0 14px ${member.color}22`,
                            }}>{member.avatar}</div>
                            <div style={{
                              position: "absolute", bottom: "-2px", right: "-2px",
                              width: "11px", height: "11px", borderRadius: "50%",
                              background: statusColors[member.status],
                              border: "2px solid #03050d",
                              boxShadow: member.status === "online" ? `0 0 6px ${statusColors[member.status]}` : "none",
                            }} />
                          </div>

                          {/* Info */}
                          <div style={{ flex: 1, minWidth: "150px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                              <span style={{ fontSize: "13px", fontWeight: 700, color: "#e8eaf2" }}>{member.name}</span>
                              <span style={{
                                fontSize: "8px", padding: "2px 8px",
                                background: `${roleColors[member.role]}15`,
                                border: `1px solid ${roleColors[member.role]}30`,
                                borderRadius: "20px", color: roleColors[member.role],
                                letterSpacing: "1px", fontWeight: 700,
                              }}>{member.role.toUpperCase()}</span>
                            </div>
                            <div style={{ fontSize: "11px", color: "#4b5563" }}>{member.email}</div>
                          </div>

                          {/* Meta */}
                          <div style={{ display: "flex", gap: "18px", alignItems: "center" }}>
                            <div style={{ textAlign: "center" }}>
                              <div style={{ fontSize: "16px", fontWeight: 800, color: "#818cf8" }}>{member.agents}</div>
                              <div style={{ fontSize: "9px", color: "#374151", letterSpacing: "1px" }}>AGENTS</div>
                            </div>
                            <div style={{ textAlign: "center" }}>
                              <div style={{ fontSize: "10px", color: "#6b7280", fontFamily: "'JetBrains Mono', monospace" }}>{member.lastActive}</div>
                              <div style={{ fontSize: "9px", color: "#374151", letterSpacing: "1px" }}>ACTIVE</div>
                            </div>
                            <div style={{ textAlign: "center" }}>
                              <div style={{ fontSize: "10px", color: statusColors[member.status], fontWeight: 600 }}>{member.status}</div>
                              <div style={{ fontSize: "9px", color: "#374151", letterSpacing: "1px" }}>STATUS</div>
                            </div>
                          </div>

                          {/* Actions */}
                          {member.role !== "Admin" && (
                            <div style={{ display: "flex", gap: "7px" }}>
                              <button
                                onClick={() => setTeamMembers(p => p.map(m => m.id === member.id ? { ...m, role: m.role === "Viewer" ? "Editor" : "Admin" } : m))}
                                style={{
                                  padding: "6px 12px",
                                  background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.18)",
                                  borderRadius: "7px", color: "#818cf8",
                                  fontSize: "9px", fontWeight: 700, cursor: "pointer",
                                  letterSpacing: "0.8px", transition: "all 0.2s",
                                }}>PROMOTE</button>
                              <button
                                onClick={() => setTeamMembers(p => p.filter(m => m.id !== member.id))}
                                style={{
                                  padding: "6px 12px",
                                  background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)",
                                  borderRadius: "7px", color: "#f87171",
                                  fontSize: "9px", fontWeight: 700, cursor: "pointer",
                                  letterSpacing: "0.8px", transition: "all 0.2s",
                                }}>REMOVE</button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── ACTIVITY TAB ── */}
              {teamTab === "activity" && (
                <div>
                  <div style={{
                    background: "rgba(10,16,32,0.85)", border: "1px solid rgba(99,102,241,0.12)",
                    borderRadius: "14px", padding: "22px",
                  }}>
                    <div style={{ fontSize: "9px", color: "#818cf8", letterSpacing: "2.5px", marginBottom: "18px", textTransform: "uppercase", fontWeight: 600 }}>▸ Team Activity Feed</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      {activityFeed.map((item, i) => {
                        const member = teamMembers.find(m => m.name.split(" ")[0] === item.user);
                        return (
                          <div key={i} style={{
                            display: "flex", alignItems: "center", gap: "14px",
                            padding: "12px 14px", borderRadius: "10px",
                            background: i % 2 === 0 ? "rgba(99,102,241,0.03)" : "transparent",
                            transition: "background 0.2s",
                          }}>
                            <div style={{
                              width: "34px", height: "34px", borderRadius: "9px", flexShrink: 0,
                              background: `linear-gradient(135deg, ${member?.color || "#6366f1"}28, ${member?.color || "#6366f1"}14)`,
                              border: `1px solid ${member?.color || "#6366f1"}35`,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: "13px", fontWeight: 800, color: member?.color || "#818cf8",
                            }}>{item.user[0]}</div>
                            <div style={{ flex: 1 }}>
                              <span style={{ fontSize: "12px", color: "#e8eaf2", fontWeight: 600 }}>{item.user} </span>
                              <span style={{ fontSize: "12px", color: "#6b7280" }}>{item.action} </span>
                              <span style={{ fontSize: "12px", color: "#818cf8", fontWeight: 600 }}>{item.target}</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <span style={{ fontSize: "16px" }}>{item.icon}</span>
                              <span style={{ fontSize: "10px", color: "#374151", fontFamily: "'JetBrains Mono', monospace", whiteSpace: "nowrap" }}>{item.time}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ── PERMISSIONS TAB ── */}
              {teamTab === "permissions" && (
                <div>
                  <div style={{
                    background: "rgba(10,16,32,0.85)", border: "1px solid rgba(99,102,241,0.12)",
                    borderRadius: "14px", padding: "24px",
                  }}>
                    <div style={{ fontSize: "9px", color: "#818cf8", letterSpacing: "2.5px", marginBottom: "20px", textTransform: "uppercase", fontWeight: 600 }}>▸ Role Permissions Matrix</div>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                        <thead>
                          <tr>
                            <th style={{ textAlign: "left", padding: "10px 14px", color: "#4b5563", fontSize: "9px", letterSpacing: "1.5px", textTransform: "uppercase", fontWeight: 600, borderBottom: "1px solid rgba(99,102,241,0.1)" }}>Permission</th>
                            {["Admin","Editor","Viewer"].map(r => (
                              <th key={r} style={{ textAlign: "center", padding: "10px 20px", borderBottom: "1px solid rgba(99,102,241,0.1)" }}>
                                <span style={{
                                  fontSize: "10px", padding: "4px 12px", borderRadius: "20px",
                                  background: r === "Admin" ? "rgba(245,200,66,0.12)" : r === "Editor" ? "rgba(129,140,248,0.12)" : "rgba(52,211,153,0.12)",
                                  border: `1px solid ${r === "Admin" ? "rgba(245,200,66,0.25)" : r === "Editor" ? "rgba(129,140,248,0.25)" : "rgba(52,211,153,0.25)"}`,
                                  color: r === "Admin" ? "#f5c842" : r === "Editor" ? "#818cf8" : "#34d399",
                                  fontWeight: 700, letterSpacing: "1px",
                                }}>{r}</span>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            ["Build Agents", true, true, false],
                            ["View Agents", true, true, true],
                            ["Delete Agents", true, false, false],
                            ["Access Marketplace", true, true, true],
                            ["Manage Integrations", true, true, false],
                            ["Invite Members", true, false, false],
                            ["Manage Billing", true, false, false],
                            ["Export Agents (JSON)", true, true, false],
                            ["Change Settings", true, false, false],
                            ["View Analytics", true, true, true],
                          ].map(([perm, ...vals], i) => (
                            <tr key={i} style={{ background: i % 2 === 0 ? "rgba(99,102,241,0.02)" : "transparent" }}>
                              <td style={{ padding: "12px 14px", color: "#9ca3af", fontSize: "12px", borderBottom: "1px solid rgba(99,102,241,0.05)" }}>{perm}</td>
                              {vals.map((v, j) => (
                                <td key={j} style={{ textAlign: "center", padding: "12px 20px", borderBottom: "1px solid rgba(99,102,241,0.05)" }}>
                                  <span style={{
                                    fontSize: "14px",
                                    filter: v ? "none" : "grayscale(1) opacity(0.3)",
                                  }}>{v ? "✅" : "❌"}</span>
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Shared Agents */}
                  <div style={{
                    marginTop: "20px", background: "rgba(10,16,32,0.85)",
                    border: "1px solid rgba(99,102,241,0.12)", borderRadius: "14px", padding: "24px",
                  }}>
                    <div style={{ fontSize: "9px", color: "#c084fc", letterSpacing: "2.5px", marginBottom: "16px", textTransform: "uppercase", fontWeight: 600 }}>▸ Shared Agents</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: "12px" }}>
                      {[
                        { name: "SupportBot Pro", avatar: "🎧", sharedWith: 3, access: "All Team" },
                        { name: "ContentCraft AI", avatar: "✍️", sharedWith: 2, access: "Editors+" },
                        { name: "SEO Wizard", avatar: "🔮", sharedWith: 1, access: "Admin Only" },
                      ].map(ag => (
                        <div key={ag.name} className="agent-card" style={{ borderRadius: "11px", padding: "16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                            <span style={{ fontSize: "22px" }}>{ag.avatar}</span>
                            <div>
                              <div style={{ fontSize: "12px", fontWeight: 700, color: "#e8eaf2" }}>{ag.name}</div>
                              <div style={{ fontSize: "10px", color: "#4b5563" }}>{ag.sharedWith} members</div>
                            </div>
                          </div>
                          <span style={{
                            fontSize: "9px", padding: "3px 10px",
                            background: "rgba(192,132,252,0.1)", border: "1px solid rgba(192,132,252,0.22)",
                            borderRadius: "20px", color: "#c084fc", letterSpacing: "0.8px",
                          }}>{ag.access}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}


          {/* ====== ANALYTICS ====== */}
          {activeNav === "analytics" && (
            <div>
              <div style={{ marginBottom: "26px" }}>
                <h2 style={{ margin: "0 0 5px", fontSize: "21px", fontWeight: 700, letterSpacing: "-0.2px" }}>📊 Analytics & Reporting</h2>
                <p style={{ margin: 0, color: "#6b7280", fontSize: "13px" }}>Track usage, performance, ROI — aur CSV/PDF mein export karo</p>
              </div>

              {/* Tab Switcher */}
              <div style={{ display: "flex", gap: "7px", marginBottom: "24px" }}>
                {[
                  { id: "usage", label: "📈 Usage Dashboard" },
                  { id: "performance", label: "⭐ Performance Score" },
                  { id: "roi", label: "💰 ROI Calculator" },
                  { id: "export", label: "⬇ Export Reports" },
                ].map(tab => (
                  <button key={tab.id} onClick={() => setAnalyticsTab(tab.id)} style={{
                    padding: "8px 16px",
                    background: analyticsTab === tab.id ? "linear-gradient(135deg, #6366f1, #a855f7)" : "rgba(10,16,32,0.8)",
                    border: `1px solid ${analyticsTab === tab.id ? "transparent" : "rgba(99,102,241,0.14)"}`,
                    borderRadius: "20px", color: analyticsTab === tab.id ? "white" : "#6b7280",
                    fontSize: "10px", fontWeight: 600, cursor: "pointer", letterSpacing: "0.5px",
                    transition: "all 0.2s",
                    boxShadow: analyticsTab === tab.id ? "0 2px 12px rgba(99,102,241,0.35)" : "none",
                  }}>{tab.label}</button>
                ))}
              </div>

              {/* USAGE DASHBOARD */}
              {analyticsTab === "usage" && (
                <div>
                  {/* Stats Row */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(175px, 1fr))", gap: "14px", marginBottom: "24px" }}>
                    {[
                      { label: "Total Agent Uses", value: "1,247", delta: "+18%", color: "#818cf8" },
                      { label: "Peak Hour", value: "2–4 PM", delta: "Daily", color: "#34d399" },
                      { label: "Active Users", value: "38", delta: "+5 this week", color: "#fbbf24" },
                      { label: "Avg Session", value: "4.2 min", delta: "↑ from 3.1", color: "#c084fc" },
                    ].map(s => (
                      <div key={s.label} style={{ background: "rgba(10,16,32,0.8)", border: "1px solid rgba(99,102,241,0.1)", borderRadius: "13px", padding: "18px 20px" }}>
                        <div style={{ fontSize: "9px", color: "#4b5563", letterSpacing: "1.5px", marginBottom: "8px", textTransform: "uppercase" }}>{s.label}</div>
                        <div style={{ fontSize: "26px", fontWeight: 800, color: s.color, fontFamily: "'JetBrains Mono', monospace" }}>{s.value}</div>
                        <div style={{ fontSize: "9px", color: "#34d399", marginTop: "5px", fontFamily: "'JetBrains Mono', monospace" }}>{s.delta}</div>
                      </div>
                    ))}
                  </div>

                  {/* Usage by Agent */}
                  <div style={{ background: "rgba(10,16,32,0.85)", border: "1px solid rgba(99,102,241,0.12)", borderRadius: "14px", padding: "22px", marginBottom: "18px" }}>
                    <div style={{ fontSize: "9px", color: "#818cf8", letterSpacing: "2.5px", marginBottom: "18px", textTransform: "uppercase", fontWeight: 600 }}>▸ Usage by Agent</div>
                    {[
                      { name: "ContentCraft AI", avatar: "✍️", uses: 89, pct: 100, color: "#818cf8" },
                      { name: "SupportBot Pro", avatar: "🎧", uses: 47, pct: 53, color: "#34d399" },
                      { name: "CodeReviewer X", avatar: "🔍", uses: 23, pct: 26, color: "#c084fc" },
                    ].map(ag => (
                      <div key={ag.name} style={{ marginBottom: "16px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontSize: "16px" }}>{ag.avatar}</span>
                            <span style={{ fontSize: "12px", color: "#e8eaf2", fontWeight: 600 }}>{ag.name}</span>
                          </div>
                          <span style={{ fontSize: "11px", color: ag.color, fontFamily: "'JetBrains Mono', monospace" }}>{ag.uses} uses</span>
                        </div>
                        <div style={{ height: "6px", background: "rgba(99,102,241,0.1)", borderRadius: "3px" }}>
                          <div style={{ width: `${ag.pct}%`, height: "100%", background: ag.color, borderRadius: "3px", transition: "width 0.5s ease", opacity: 0.8 }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Peak Hours Heatmap */}
                  <div style={{ background: "rgba(10,16,32,0.85)", border: "1px solid rgba(99,102,241,0.12)", borderRadius: "14px", padding: "22px" }}>
                    <div style={{ fontSize: "9px", color: "#818cf8", letterSpacing: "2.5px", marginBottom: "16px", textTransform: "uppercase", fontWeight: 600 }}>▸ Peak Hours (This Week)</div>
                    <div style={{ display: "flex", gap: "5px", alignItems: "flex-end", height: "80px" }}>
                      {[
                        { hour: "6AM", val: 12 }, { hour: "8AM", val: 35 }, { hour: "10AM", val: 68 },
                        { hour: "12PM", val: 55 }, { hour: "2PM", val: 100 }, { hour: "4PM", val: 88 },
                        { hour: "6PM", val: 45 }, { hour: "8PM", val: 30 }, { hour: "10PM", val: 15 },
                      ].map(h => (
                        <div key={h.hour} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "5px" }}>
                          <div style={{ width: "100%", height: `${h.val * 0.65}px`, background: `rgba(99,102,241,${0.2 + h.val * 0.006})`, border: `1px solid rgba(99,102,241,${0.1 + h.val * 0.003})`, borderRadius: "4px 4px 0 0", transition: "height 0.4s ease" }} />
                          <div style={{ fontSize: "8px", color: "#374151", whiteSpace: "nowrap" }}>{h.hour}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* PERFORMANCE SCORE */}
              {analyticsTab === "performance" && (
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
                    {[
                      { name: "SupportBot Pro", avatar: "🎧", score: 94, accuracy: "97%", response: "1.2s", satisfaction: "4.8/5", trend: "+3%", color: "#34d399" },
                      { name: "ContentCraft AI", avatar: "✍️", score: 87, accuracy: "91%", response: "2.1s", satisfaction: "4.6/5", trend: "+1%", color: "#818cf8" },
                      { name: "CodeReviewer X", avatar: "🔍", score: 79, accuracy: "85%", response: "3.4s", satisfaction: "4.3/5", trend: "-2%", color: "#fbbf24" },
                    ].map(ag => (
                      <div key={ag.name} className="glass-card" style={{ borderRadius: "14px", padding: "22px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px" }}>
                          <span style={{ fontSize: "26px" }}>{ag.avatar}</span>
                          <div>
                            <div style={{ fontSize: "13px", fontWeight: 700, color: "#e8eaf2" }}>{ag.name}</div>
                            <div style={{ fontSize: "9px", color: "#4b5563" }}>Performance Score</div>
                          </div>
                          <div style={{ marginLeft: "auto", fontSize: "11px", color: ag.trend.startsWith("+") ? "#34d399" : "#f87171", fontFamily: "'JetBrains Mono', monospace" }}>{ag.trend}</div>
                        </div>
                        {/* Score Ring visual */}
                        <div style={{ display: "flex", alignItems: "center", gap: "18px", marginBottom: "16px" }}>
                          <div style={{ position: "relative", width: "64px", height: "64px", flexShrink: 0 }}>
                            <svg width="64" height="64" style={{ transform: "rotate(-90deg)" }}>
                              <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(99,102,241,0.1)" strokeWidth="6" />
                              <circle cx="32" cy="32" r="26" fill="none" stroke={ag.color} strokeWidth="6"
                                strokeDasharray={`${ag.score * 1.634} 163.4`} strokeLinecap="round" />
                            </svg>
                            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: 800, color: ag.color, fontFamily: "'JetBrains Mono', monospace" }}>{ag.score}</div>
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", flex: 1 }}>
                            {[
                              { label: "Accuracy", val: ag.accuracy },
                              { label: "Response", val: ag.response },
                              { label: "Satisfaction", val: ag.satisfaction },
                            ].map(m => (
                              <div key={m.label} style={{ background: "rgba(99,102,241,0.05)", border: "1px solid rgba(99,102,241,0.08)", borderRadius: "8px", padding: "8px 10px" }}>
                                <div style={{ fontSize: "8px", color: "#4b5563", marginBottom: "3px", textTransform: "uppercase", letterSpacing: "0.8px" }}>{m.label}</div>
                                <div style={{ fontSize: "12px", fontWeight: 700, color: ag.color, fontFamily: "'JetBrains Mono', monospace" }}>{m.val}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ROI CALCULATOR */}
              {analyticsTab === "roi" && (
                <div style={{ maxWidth: "620px" }}>
                  <div style={{ background: "rgba(10,16,32,0.85)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: "14px", padding: "26px", marginBottom: "20px" }}>
                    <div style={{ fontSize: "9px", color: "#818cf8", letterSpacing: "2.5px", marginBottom: "22px", textTransform: "uppercase", fontWeight: 600 }}>▸ ROI Calculator</div>

                    {[
                      { label: "Hours saved per agent per month", key: "hours", val: roiHours, min: 1, max: 200, setter: setRoiHours, unit: "hrs" },
                      { label: "Your hourly rate (USD)", key: "rate", val: roiRate, min: 5, max: 500, setter: setRoiRate, unit: "$" },
                      { label: "Number of active agents", key: "agents", val: roiAgents, min: 1, max: 20, setter: setRoiAgents, unit: "agents" },
                    ].map(item => (
                      <div key={item.key} style={{ marginBottom: "22px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                          <div style={{ fontSize: "12px", color: "#9ca3af" }}>{item.label}</div>
                          <div style={{ fontSize: "13px", fontWeight: 700, color: "#818cf8", fontFamily: "'JetBrains Mono', monospace" }}>{item.key === "rate" ? "$" : ""}{item.val}{item.key === "hours" ? " hrs" : item.key === "agents" ? " agents" : "/hr"}</div>
                        </div>
                        <input type="range" min={item.min} max={item.max} value={item.val} onChange={e => item.setter(Number(e.target.value))} style={{ width: "100%", accentColor: "#6366f1", cursor: "pointer" }} />
                      </div>
                    ))}
                  </div>

                  {/* ROI Result Cards */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                    {[
                      { label: "Monthly Time Saved", value: `${roiHours * roiAgents} hrs`, color: "#818cf8", icon: "⏱" },
                      { label: "Monthly Cost Saved", value: `$${(roiHours * roiRate * roiAgents).toLocaleString()}`, color: "#34d399", icon: "💵" },
                      { label: "Annual Time Saved", value: `${roiHours * roiAgents * 12} hrs`, color: "#c084fc", icon: "📅" },
                      { label: "Annual Cost Saved", value: `$${(roiHours * roiRate * roiAgents * 12).toLocaleString()}`, color: "#fbbf24", icon: "🏆" },
                    ].map(r => (
                      <div key={r.label} style={{ background: `${r.color}0d`, border: `1px solid ${r.color}20`, borderRadius: "13px", padding: "20px" }}>
                        <div style={{ fontSize: "20px", marginBottom: "8px" }}>{r.icon}</div>
                        <div style={{ fontSize: "22px", fontWeight: 800, color: r.color, fontFamily: "'JetBrains Mono', monospace", marginBottom: "4px" }}>{r.value}</div>
                        <div style={{ fontSize: "9px", color: "#4b5563", textTransform: "uppercase", letterSpacing: "1.2px" }}>{r.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* EXPORT REPORTS */}
              {analyticsTab === "export" && (
                <div style={{ maxWidth: "620px" }}>
                  <div style={{ background: "rgba(10,16,32,0.85)", border: "1px solid rgba(99,102,241,0.12)", borderRadius: "14px", padding: "24px", marginBottom: "18px" }}>
                    <div style={{ fontSize: "9px", color: "#818cf8", letterSpacing: "2.5px", marginBottom: "18px", textTransform: "uppercase", fontWeight: 600 }}>▸ Available Reports</div>
                    {[
                      { name: "Monthly Usage Report", desc: "Agent uses, sessions, peak hours — June 2026", size: "2.4 MB", type: "CSV", icon: "📊", color: "#34d399" },
                      { name: "Performance Summary", desc: "Accuracy scores, response times, satisfaction ratings", size: "1.1 MB", type: "PDF", icon: "⭐", color: "#818cf8" },
                      { name: "ROI Report", desc: "Time & cost savings breakdown by agent", size: "0.8 MB", type: "PDF", icon: "💰", color: "#fbbf24" },
                      { name: "Team Activity Log", desc: "All team actions, exports, logins — last 30 days", size: "3.2 MB", type: "CSV", icon: "👥", color: "#c084fc" },
                    ].map(r => (
                      <div key={r.name} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px", background: "rgba(99,102,241,0.04)", border: "1px solid rgba(99,102,241,0.09)", borderRadius: "11px", marginBottom: "10px" }}>
                        <div style={{ fontSize: "22px" }}>{r.icon}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "12px", fontWeight: 700, color: "#e8eaf2", marginBottom: "3px" }}>{r.name}</div>
                          <div style={{ fontSize: "10px", color: "#4b5563" }}>{r.desc}</div>
                        </div>
                        <div style={{ textAlign: "right", marginRight: "8px" }}>
                          <span style={{ fontSize: "9px", padding: "3px 8px", background: `${r.color}15`, border: `1px solid ${r.color}25`, borderRadius: "5px", color: r.color, fontWeight: 700 }}>{r.type}</span>
                          <div style={{ fontSize: "9px", color: "#374151", marginTop: "3px", fontFamily: "'JetBrains Mono', monospace" }}>{r.size}</div>
                        </div>
                        <button onClick={() => {
                          const blob = new Blob([`Report: ${r.name}\nGenerated: ${new Date().toLocaleDateString()}\n\nThis is a sample export from your AI Agent Dashboard.\n\nData summary for: ${r.desc}`], { type: "text/plain" });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a"); a.href = url; a.download = `${r.name.replace(/\s+/g, "_")}.${r.type.toLowerCase()}`; a.click();
                          URL.revokeObjectURL(url);
                        }} style={{
                          padding: "8px 16px",
                          background: `linear-gradient(135deg, ${r.color}22, ${r.color}0d)`,
                          border: `1px solid ${r.color}30`,
                          borderRadius: "9px", color: r.color,
                          fontSize: "9px", fontFamily: "'Sora', sans-serif",
                          fontWeight: 700, letterSpacing: "1px", cursor: "pointer", whiteSpace: "nowrap",
                        }}>⬇ DOWNLOAD</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ====== TEMPLATES ====== */}
          {activeNav === "templates" && (
            <div>
              <div style={{ marginBottom: "26px" }}>
                <h2 style={{ margin: "0 0 5px", fontSize: "21px", fontWeight: 700, letterSpacing: "-0.2px" }}>📋 Agent Templates Library</h2>
                <p style={{ margin: 0, color: "#6b7280", fontSize: "13px" }}>Ready-made agents — one click to build & customize</p>
              </div>

              {/* Category Filters */}
              <div style={{ display: "flex", gap: "7px", marginBottom: "22px", flexWrap: "wrap" }}>
                {["All", "HR", "Sales", "Legal", "Content", "Support", "Finance", "Dev", "Marketing"].map(cat => (
                  <button key={cat} onClick={() => setTemplateCategory(cat)} style={{
                    padding: "6px 16px",
                    background: templateCategory === cat ? "linear-gradient(135deg, #6366f1, #a855f7)" : "rgba(10,16,32,0.8)",
                    border: `1px solid ${templateCategory === cat ? "transparent" : "rgba(99,102,241,0.14)"}`,
                    borderRadius: "20px", color: templateCategory === cat ? "white" : "#6b7280",
                    fontSize: "10px", fontWeight: 600, cursor: "pointer", letterSpacing: "0.8px", transition: "all 0.2s",
                    boxShadow: templateCategory === cat ? "0 2px 12px rgba(99,102,241,0.35)" : "none",
                  }}>{cat}</button>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
                {AGENT_TEMPLATES.filter(t => templateCategory === "All" || t.category === templateCategory).map(tmpl => (
                  <div key={tmpl.id} className="glass-card" style={{ borderRadius: "14px", padding: "22px", cursor: "pointer" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "13px", marginBottom: "14px" }}>
                      <div style={{
                        width: "48px", height: "48px", borderRadius: "12px",
                        background: `${tmpl.color}18`, border: `1px solid ${tmpl.color}30`,
                        display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0,
                      }}>{tmpl.avatar}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "#e8eaf2", marginBottom: "3px" }}>{tmpl.name}</div>
                        <div style={{ fontSize: "10px", color: "#4b5563", lineHeight: 1.4 }}>{tmpl.description}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "16px" }}>
                      {tmpl.tags.map(tag => (
                        <span key={tag} style={{
                          fontSize: "9px", padding: "3px 9px",
                          background: `${tmpl.color}10`, border: `1px solid ${tmpl.color}25`,
                          borderRadius: "20px", color: tmpl.color, letterSpacing: "0.5px",
                        }}>{tag}</span>
                      ))}
                    </div>
                    <button onClick={() => { setPrompt(tmpl.prompt); setActiveNav("generator"); }} style={{
                      width: "100%", padding: "10px",
                      background: `linear-gradient(135deg, ${tmpl.color}22, ${tmpl.color}0d)`,
                      border: `1px solid ${tmpl.color}35`,
                      borderRadius: "9px", color: tmpl.color,
                      fontSize: "10px", fontFamily: "'Sora', sans-serif",
                      fontWeight: 700, letterSpacing: "1.2px", cursor: "pointer", transition: "all 0.2s",
                    }}>⚡ USE THIS TEMPLATE</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ====== AGENT CHAINING ====== */}
          {activeNav === "chaining" && (
            <div style={{ maxWidth: "760px" }}>
              <div style={{ marginBottom: "26px" }}>
                <h2 style={{ margin: "0 0 5px", fontSize: "21px", fontWeight: 700, letterSpacing: "-0.2px" }}>🔀 Agent Chaining</h2>
                <p style={{ margin: 0, color: "#6b7280", fontSize: "13px" }}>Connect agents so one triggers the next — build powerful automated workflows</p>
              </div>

              {/* How it works */}
              <div style={{ display: "flex", gap: "12px", marginBottom: "24px", flexWrap: "wrap" }}>
                {[
                  { icon: "✍️", label: "Content Agent", desc: "Writes blog draft", color: "#818cf8" },
                  { icon: "→", label: "", desc: "", color: "#374151" },
                  { icon: "🔮", label: "SEO Agent", desc: "Optimizes content", color: "#c084fc" },
                  { icon: "→", label: "", desc: "", color: "#374151" },
                  { icon: "📤", label: "Publish Agent", desc: "Posts to platform", color: "#34d399" },
                ].map((step, i) => (
                  step.label ? (
                    <div key={i} style={{
                      background: "rgba(10,16,32,0.8)", border: `1px solid ${step.color}25`,
                      borderRadius: "12px", padding: "14px 18px", display: "flex", flexDirection: "column",
                      alignItems: "center", gap: "6px", minWidth: "110px",
                    }}>
                      <div style={{ fontSize: "22px" }}>{step.icon}</div>
                      <div style={{ fontSize: "10px", fontWeight: 700, color: step.color, letterSpacing: "0.5px" }}>{step.label}</div>
                      <div style={{ fontSize: "9px", color: "#4b5563", textAlign: "center" }}>{step.desc}</div>
                    </div>
                  ) : (
                    <div key={i} style={{ display: "flex", alignItems: "center", fontSize: "20px", color: "#374151" }}>→</div>
                  )
                ))}
              </div>

              {/* Chain Builder */}
              <div style={{ background: "rgba(10,16,32,0.85)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: "16px", padding: "24px", marginBottom: "20px" }}>
                <div style={{ fontSize: "9px", color: "#818cf8", letterSpacing: "2.5px", marginBottom: "18px", textTransform: "uppercase", fontWeight: 600 }}>▸ Your Chain</div>

                {chainSteps.map((step, idx) => (
                  <div key={step.id} style={{ marginBottom: "12px" }}>
                    <div style={{
                      display: "flex", alignItems: "center", gap: "14px",
                      background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.14)",
                      borderRadius: "12px", padding: "14px 18px",
                    }}>
                      <div style={{
                        width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
                        background: "linear-gradient(135deg, #6366f1, #a855f7)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "11px", fontWeight: 700, color: "white",
                      }}>{idx + 1}</div>
                      <div style={{ fontSize: "18px" }}>{step.avatar}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "12px", fontWeight: 700, color: "#e8eaf2" }}>{step.agent}</div>
                        <div style={{ fontSize: "10px", color: "#4b5563" }}>Output: {step.output}</div>
                      </div>
                      <span style={{
                        fontSize: "9px", padding: "3px 10px",
                        background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)",
                        borderRadius: "20px", color: "#34d399",
                      }}>{step.trigger}</span>
                      <button onClick={() => setChainSteps(s => s.filter(x => x.id !== step.id))} style={{
                        background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                        borderRadius: "7px", color: "#f87171", padding: "4px 9px",
                        fontSize: "10px", cursor: "pointer",
                      }}>✕</button>
                    </div>
                    {idx < chainSteps.length - 1 && (
                      <div style={{ textAlign: "center", color: "#374151", fontSize: "18px", margin: "4px 0" }}>↓</div>
                    )}
                  </div>
                ))}

                {/* Add Step */}
                <button onClick={() => setChainSteps(s => [...s, { id: Date.now(), agent: "ContentCraft AI", avatar: "✍️", output: "New Output", trigger: "Auto" }])} style={{
                  width: "100%", padding: "12px",
                  background: "rgba(99,102,241,0.05)", border: "1px dashed rgba(99,102,241,0.25)",
                  borderRadius: "12px", color: "#6b7280", fontSize: "11px",
                  cursor: "pointer", letterSpacing: "1px", fontFamily: "'Sora', sans-serif", fontWeight: 600,
                  transition: "all 0.2s", marginTop: "8px",
                }}>+ ADD AGENT STEP</button>
              </div>

              {/* Run Chain Button */}
              <button onClick={() => {
                setChainRunning(true); setChainProgress(0);
                const interval = setInterval(() => {
                  setChainProgress(p => { if (p >= 100) { clearInterval(interval); setChainRunning(false); return 100; } return p + 2; });
                }, 60);
              }} disabled={chainRunning} style={{
                padding: "14px 32px",
                background: chainRunning ? "rgba(99,102,241,0.15)" : "linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7)",
                border: "none", borderRadius: "12px", color: "white",
                fontSize: "12px", fontFamily: "'Sora', sans-serif",
                fontWeight: 700, letterSpacing: "1.5px", cursor: chainRunning ? "not-allowed" : "pointer",
                boxShadow: chainRunning ? "none" : "0 4px 20px rgba(99,102,241,0.3)",
                display: "flex", alignItems: "center", gap: "10px",
              }}>
                {chainRunning ? <><span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⚙</span> RUNNING CHAIN...</> : "▶ RUN CHAIN"}
              </button>

              {chainRunning && (
                <div style={{ marginTop: "18px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <span style={{ fontSize: "10px", color: "#6b7280" }}>Processing chain...</span>
                    <span style={{ fontSize: "10px", color: "#818cf8", fontFamily: "'JetBrains Mono', monospace" }}>{chainProgress}%</span>
                  </div>
                  <div style={{ height: "6px", background: "rgba(99,102,241,0.1)", borderRadius: "3px" }}>
                    <div style={{ width: `${chainProgress}%`, height: "100%", background: "linear-gradient(90deg, #6366f1, #a855f7)", borderRadius: "3px", transition: "width 0.1s" }} />
                  </div>
                </div>
              )}
              {!chainRunning && chainProgress === 100 && (
                <div style={{ marginTop: "16px", padding: "14px 18px", background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: "12px", color: "#34d399", fontSize: "12px" }}>
                  ✓ Chain completed successfully! All {chainSteps.length} agents ran in sequence.
                </div>
              )}
            </div>
          )}

          {/* ====== VOICE AGENT ====== */}
          {activeNav === "voice" && (
            <div style={{ maxWidth: "680px" }}>
              <div style={{ marginBottom: "26px" }}>
                <h2 style={{ margin: "0 0 5px", fontSize: "21px", fontWeight: 700, letterSpacing: "-0.2px" }}>🎙️ Voice Agent</h2>
                <p style={{ margin: 0, color: "#6b7280", fontSize: "13px" }}>Talk to your agents — type or use voice, get intelligent spoken responses</p>
              </div>

              {/* Agent Selector */}
              <div style={{ background: "rgba(10,16,32,0.85)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: "14px", padding: "20px", marginBottom: "18px" }}>
                <div style={{ fontSize: "9px", color: "#818cf8", letterSpacing: "2.5px", marginBottom: "14px", textTransform: "uppercase", fontWeight: 600 }}>▸ Select Voice Agent</div>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  {savedAgents.slice(0, 4).map(ag => (
                    <div key={ag.id} onClick={() => setSelectedVoiceAgent(ag.agentName)} style={{
                      padding: "10px 16px", borderRadius: "11px", cursor: "pointer",
                      background: selectedVoiceAgent === ag.agentName ? "rgba(99,102,241,0.2)" : "rgba(10,16,32,0.6)",
                      border: `1px solid ${selectedVoiceAgent === ag.agentName ? "rgba(99,102,241,0.45)" : "rgba(99,102,241,0.1)"}`,
                      display: "flex", alignItems: "center", gap: "8px", transition: "all 0.2s",
                    }}>
                      <span style={{ fontSize: "18px" }}>{ag.avatar}</span>
                      <span style={{ fontSize: "11px", fontWeight: 600, color: selectedVoiceAgent === ag.agentName ? "#818cf8" : "#6b7280" }}>{ag.agentName}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Voice Chat Interface */}
              <div style={{ background: "rgba(10,16,32,0.85)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: "14px", overflow: "hidden" }}>
                {/* Chat Messages */}
                <div style={{ minHeight: "280px", maxHeight: "340px", overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  {voiceChat.length === 0 && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "240px", gap: "12px", color: "#374151" }}>
                      <div style={{ fontSize: "48px", filter: "grayscale(0.3)" }}>🎙️</div>
                      <div style={{ fontSize: "12px", color: "#4b5563" }}>Type your message or use the mic below</div>
                    </div>
                  )}
                  {voiceChat.map((msg, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
                      <div style={{
                        maxWidth: "75%", padding: "11px 15px", borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                        background: msg.role === "user" ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "rgba(99,102,241,0.08)",
                        border: msg.role === "user" ? "none" : "1px solid rgba(99,102,241,0.14)",
                        fontSize: "12px", color: msg.role === "user" ? "white" : "#cbd5e1", lineHeight: 1.55,
                      }}>{msg.content}</div>
                    </div>
                  ))}
                  {voiceLoading && (
                    <div style={{ display: "flex", gap: "5px", padding: "8px 0" }}>
                      {[0,1,2].map(d => <div key={d} style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#818cf8", animation: `pulse 1.2s ${d * 0.2}s ease-in-out infinite` }} />)}
                    </div>
                  )}
                </div>

                {/* Input Bar */}
                <div style={{ padding: "14px 16px", borderTop: "1px solid rgba(99,102,241,0.1)", display: "flex", gap: "10px", alignItems: "center" }}>
                  <button
                    onClick={() => { setVoiceListening(v => !v); }}
                    style={{
                      width: "40px", height: "40px", borderRadius: "50%", flexShrink: 0,
                      background: voiceListening ? "linear-gradient(135deg, #ef4444, #dc2626)" : "rgba(99,102,241,0.15)",
                      border: `1px solid ${voiceListening ? "rgba(239,68,68,0.4)" : "rgba(99,102,241,0.25)"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "16px", cursor: "pointer", transition: "all 0.2s",
                      boxShadow: voiceListening ? "0 0 16px rgba(239,68,68,0.35)" : "none",
                      animation: voiceListening ? "glowPulse 1.5s ease-in-out infinite" : "none",
                    }}>🎙️</button>
                  <input
                    value={voiceInput} onChange={e => setVoiceInput(e.target.value)}
                    onKeyDown={async e => {
                      if (e.key !== "Enter" || !voiceInput.trim() || voiceLoading) return;
                      const userMsg = voiceInput.trim();
                      setVoiceChat(c => [...c, { role: "user", content: userMsg }]);
                      setVoiceInput(""); setVoiceLoading(true);
                      try {
                        const res = await fetch("https://api.anthropic.com/v1/messages", {
                          method: "POST", headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            model: "claude-sonnet-4-20250514", max_tokens: 1000,
                            system: `You are ${selectedVoiceAgent}, a helpful voice-enabled AI assistant. Keep responses concise and conversational, as they may be read aloud.`,
                            messages: [...voiceChat, { role: "user", content: userMsg }],
                          }),
                        });
                        const data = await res.json();
                        const reply = data.content?.map(c => c.text || "").join("") || "Sorry, I couldn't respond.";
                        setVoiceChat(c => [...c, { role: "assistant", content: reply }]);
                      } catch { setVoiceChat(c => [...c, { role: "assistant", content: "Connection error. Please try again." }]); }
                      finally { setVoiceLoading(false); }
                    }}
                    placeholder="Type your message... (Enter to send)"
                    style={{
                      flex: 1, background: "rgba(3,5,13,0.7)", border: "1px solid rgba(99,102,241,0.14)",
                      borderRadius: "10px", padding: "11px 14px", color: "#e8eaf2",
                      fontSize: "12px", fontFamily: "'Sora', sans-serif", outline: "none",
                    }}
                  />
                </div>
              </div>
              {voiceListening && (
                <div style={{ marginTop: "14px", padding: "12px 18px", background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)", borderRadius: "11px", color: "#f87171", fontSize: "11px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ animation: "pulse 1s ease-in-out infinite", display: "inline-block", fontSize: "16px" }}>🔴</span> Listening... (Browser mic API integration required in production)
                </div>
              )}
            </div>
          )}

          {/* ====== MEMORY SYSTEM ====== */}
          {activeNav === "memory" && (
            <div style={{ maxWidth: "760px" }}>
              <div style={{ marginBottom: "26px" }}>
                <h2 style={{ margin: "0 0 5px", fontSize: "21px", fontWeight: 700, letterSpacing: "-0.2px" }}>🧠 Memory System</h2>
                <p style={{ margin: 0, color: "#6b7280", fontSize: "13px" }}>Agents remember context, preferences, and facts across all conversations</p>
              </div>

              {/* Stats */}
              <div style={{ display: "flex", gap: "12px", marginBottom: "22px", flexWrap: "wrap" }}>
                {[
                  { label: "Total Memories", value: memories.length, color: "#818cf8", icon: "🧠" },
                  { label: "Active", value: memories.filter(m => m.active).length, color: "#34d399", icon: "✓" },
                  { label: "Inactive", value: memories.filter(m => !m.active).length, color: "#fbbf24", icon: "○" },
                ].map(s => (
                  <div key={s.label} style={{ background: "rgba(10,16,32,0.8)", border: "1px solid rgba(99,102,241,0.1)", borderRadius: "11px", padding: "16px 22px", display: "flex", flexDirection: "column", gap: "4px" }}>
                    <div style={{ fontSize: "22px", fontWeight: 800, color: s.color, fontFamily: "'JetBrains Mono', monospace" }}>{s.value}</div>
                    <div style={{ fontSize: "9px", color: "#4b5563", letterSpacing: "1.5px", textTransform: "uppercase" }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Add Memory */}
              <div style={{ background: "rgba(10,16,32,0.85)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: "14px", padding: "20px", marginBottom: "20px" }}>
                <div style={{ fontSize: "9px", color: "#818cf8", letterSpacing: "2.5px", marginBottom: "14px", textTransform: "uppercase", fontWeight: 600 }}>▸ Add New Memory</div>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <select value={newMemoryAgent} onChange={e => setNewMemoryAgent(e.target.value)} style={{
                    background: "rgba(3,5,13,0.7)", border: "1px solid rgba(99,102,241,0.14)",
                    borderRadius: "9px", padding: "10px 13px", color: "#e8eaf2",
                    fontSize: "12px", fontFamily: "'Sora', sans-serif", cursor: "pointer", outline: "none",
                  }}>
                    {savedAgents.map(ag => <option key={ag.id} value={ag.agentName}>{ag.avatar} {ag.agentName}</option>)}
                  </select>
                  <input
                    value={newMemoryKey} onChange={e => setNewMemoryKey(e.target.value)}
                    placeholder="e.g., User prefers dark mode, speaks Urdu"
                    style={{
                      flex: 1, minWidth: "200px", background: "rgba(3,5,13,0.7)", border: "1px solid rgba(99,102,241,0.14)",
                      borderRadius: "9px", padding: "10px 13px", color: "#e8eaf2",
                      fontSize: "12px", fontFamily: "'Sora', sans-serif", outline: "none",
                    }}
                  />
                  <button onClick={() => {
                    if (!newMemoryKey.trim()) return;
                    const ag = savedAgents.find(a => a.agentName === newMemoryAgent);
                    setMemories(m => [{ id: Date.now(), agent: newMemoryAgent, avatar: ag?.avatar || "🤖", key: newMemoryKey.trim(), type: "user", time: "Just now", active: true }, ...m]);
                    setNewMemoryKey("");
                  }} style={{
                    padding: "10px 20px", background: "linear-gradient(135deg, #6366f1, #a855f7)",
                    border: "none", borderRadius: "9px", color: "white",
                    fontSize: "10px", fontFamily: "'Sora', sans-serif",
                    fontWeight: 700, letterSpacing: "1px", cursor: "pointer",
                  }}>+ ADD</button>
                </div>
              </div>

              {/* Filter Tabs */}
              <div style={{ display: "flex", gap: "7px", marginBottom: "16px" }}>
                {["all", "preference", "context", "technical", "user"].map(f => (
                  <button key={f} onClick={() => setMemoryFilter(f)} style={{
                    padding: "5px 14px",
                    background: memoryFilter === f ? "rgba(99,102,241,0.2)" : "transparent",
                    border: `1px solid ${memoryFilter === f ? "rgba(99,102,241,0.35)" : "rgba(99,102,241,0.1)"}`,
                    borderRadius: "20px", color: memoryFilter === f ? "#818cf8" : "#4b5563",
                    fontSize: "9px", fontWeight: 600, cursor: "pointer", letterSpacing: "0.8px", textTransform: "capitalize",
                  }}>{f}</button>
                ))}
              </div>

              {/* Memory List */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {memories.filter(m => memoryFilter === "all" || m.type === memoryFilter).map(mem => (
                  <div key={mem.id} style={{
                    display: "flex", alignItems: "center", gap: "14px",
                    background: "rgba(10,16,32,0.8)", border: `1px solid ${mem.active ? "rgba(99,102,241,0.14)" : "rgba(99,102,241,0.06)"}`,
                    borderRadius: "12px", padding: "14px 18px", opacity: mem.active ? 1 : 0.5,
                  }}>
                    <span style={{ fontSize: "20px" }}>{mem.avatar}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "12px", fontWeight: 600, color: "#e8eaf2", marginBottom: "3px" }}>{mem.key}</div>
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <span style={{ fontSize: "9px", color: "#4b5563" }}>{mem.agent}</span>
                        <span style={{ fontSize: "8px", color: "#374151" }}>•</span>
                        <span style={{
                          fontSize: "8px", padding: "2px 7px",
                          background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)",
                          borderRadius: "20px", color: "#818cf8", textTransform: "capitalize",
                        }}>{mem.type}</span>
                        <span style={{ fontSize: "8px", color: "#374151" }}>•</span>
                        <span style={{ fontSize: "9px", color: "#374151", fontFamily: "'JetBrains Mono', monospace" }}>{mem.time}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <div onClick={() => setMemories(m => m.map(x => x.id === mem.id ? { ...x, active: !x.active } : x))} style={{
                        width: "36px", height: "20px", borderRadius: "10px", cursor: "pointer",
                        background: mem.active ? "linear-gradient(90deg, #6366f1, #a855f7)" : "rgba(99,102,241,0.1)",
                        border: `1px solid ${mem.active ? "transparent" : "rgba(99,102,241,0.2)"}`,
                        position: "relative", transition: "all 0.25s",
                      }}>
                        <div style={{
                          width: "14px", height: "14px", borderRadius: "50%", background: "white",
                          position: "absolute", top: "2px", transition: "all 0.25s",
                          left: mem.active ? "19px" : "2px",
                          boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                        }} />
                      </div>
                      <button onClick={() => setMemories(m => m.filter(x => x.id !== mem.id))} style={{
                        background: "transparent", border: "none", color: "#374151",
                        fontSize: "14px", cursor: "pointer", padding: "2px 5px",
                        transition: "color 0.2s",
                      }}>✕</button>
                    </div>
                  </div>
                ))}
                {memories.filter(m => memoryFilter === "all" || m.type === memoryFilter).length === 0 && (
                  <div style={{ textAlign: "center", padding: "40px", color: "#374151", fontSize: "12px" }}>No memories found for this filter.</div>
                )}
              </div>
            </div>
          )}

          {/* ====== AFFILIATE PROGRAM ====== */}
          {activeNav === "affiliate" && (() => {
            const totalEarned = affiliateReferrals.reduce((s, r) => s + r.commission, 0);
            const paidOut = affiliateReferrals.filter(r => r.paid).reduce((s, r) => s + r.commission, 0);
            const pending = totalEarned - paidOut;
            const activeCount = affiliateReferrals.filter(r => r.status === "active").length;
            return (
              <div>
                <div style={{ marginBottom: "26px" }}>
                  <h2 style={{ margin: "0 0 5px", fontSize: "21px", fontWeight: 700, letterSpacing: "-0.2px" }}>🤝 Affiliate Program</h2>
                  <p style={{ margin: 0, color: "#6b7280", fontSize: "13px" }}>Refer karo, earn karo — 20% commission har referred subscription pe</p>
                </div>

                {/* Stats Row */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "14px", marginBottom: "24px" }}>
                  {[
                    { label: "Total Earned", value: `$${totalEarned.toFixed(2)}`, icon: "💰", color: "#34d399", sub: "All time" },
                    { label: "Paid Out", value: `$${paidOut.toFixed(2)}`, icon: "✅", color: "#818cf8", sub: "Transferred" },
                    { label: "Pending", value: `$${pending.toFixed(2)}`, icon: "⏳", color: "#fbbf24", sub: "Next payout" },
                    { label: "Active Referrals", value: activeCount, icon: "👥", color: "#c084fc", sub: `${affiliateReferrals.length} total` },
                  ].map(s => (
                    <div key={s.label} style={{ background: "rgba(10,16,32,0.85)", border: `1px solid ${s.color}20`, borderRadius: "14px", padding: "20px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div>
                          <div style={{ fontSize: "9px", color: "#4b5563", letterSpacing: "1.5px", marginBottom: "9px", textTransform: "uppercase" }}>{s.label}</div>
                          <div style={{ fontSize: "26px", fontWeight: 800, color: s.color, fontFamily: "'JetBrains Mono', monospace" }}>{s.value}</div>
                          <div style={{ fontSize: "9px", color: "#374151", marginTop: "5px" }}>{s.sub}</div>
                        </div>
                        <div style={{ fontSize: "22px", opacity: 0.7 }}>{s.icon}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Referral Link Card */}
                <div style={{
                  background: "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(168,85,247,0.07), rgba(52,211,153,0.05))",
                  border: "1px solid rgba(99,102,241,0.25)", borderRadius: "16px", padding: "26px",
                  marginBottom: "22px", position: "relative", overflow: "hidden",
                }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent, #6366f1, #a855f7, #34d399, transparent)" }} />
                  <div style={{ fontSize: "9px", color: "#818cf8", letterSpacing: "2.5px", marginBottom: "14px", textTransform: "uppercase", fontWeight: 600 }}>▸ Your Referral Link</div>
                  <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", marginBottom: "18px" }}>
                    <div style={{
                      flex: 1, minWidth: "240px", background: "rgba(3,5,13,0.7)", border: "1px solid rgba(99,102,241,0.2)",
                      borderRadius: "10px", padding: "12px 16px",
                      fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#818cf8",
                    }}>{AFFILIATE_LINK}</div>
                    <button onClick={() => { navigator.clipboard.writeText(AFFILIATE_LINK); setAffiliateCopied(true); setTimeout(() => setAffiliateCopied(false), 2000); }} style={{
                      padding: "12px 22px",
                      background: affiliateCopied ? "rgba(52,211,153,0.15)" : "linear-gradient(135deg, #6366f1, #a855f7)",
                      border: affiliateCopied ? "1px solid rgba(52,211,153,0.3)" : "none",
                      borderRadius: "10px", color: affiliateCopied ? "#34d399" : "white",
                      fontSize: "11px", fontFamily: "'Sora', sans-serif",
                      fontWeight: 700, letterSpacing: "1px", cursor: "pointer",
                      transition: "all 0.2s", whiteSpace: "nowrap",
                      boxShadow: affiliateCopied ? "none" : "0 4px 16px rgba(99,102,241,0.3)",
                    }}>{affiliateCopied ? "✓ COPIED!" : "⎘ COPY LINK"}</button>
                  </div>

                  {/* Share Buttons */}
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <div style={{ fontSize: "9px", color: "#4b5563", letterSpacing: "1px", marginRight: "4px", display: "flex", alignItems: "center" }}>SHARE VIA:</div>
                    {[
                      { label: "WhatsApp", color: "#25d366", bg: "rgba(37,211,102,0.1)", border: "rgba(37,211,102,0.2)" },
                      { label: "Twitter / X", color: "#1d9bf0", bg: "rgba(29,155,240,0.1)", border: "rgba(29,155,240,0.2)" },
                      { label: "LinkedIn", color: "#0a66c2", bg: "rgba(10,102,194,0.1)", border: "rgba(10,102,194,0.2)" },
                      { label: "Email", color: "#9ca3af", bg: "rgba(156,163,175,0.08)", border: "rgba(156,163,175,0.15)" },
                    ].map(s => (
                      <button key={s.label} style={{
                        padding: "6px 14px", background: s.bg, border: `1px solid ${s.border}`,
                        borderRadius: "20px", color: s.color,
                        fontSize: "10px", fontWeight: 600, cursor: "pointer", letterSpacing: "0.5px",
                      }}>{s.label}</button>
                    ))}
                  </div>
                </div>

                {/* Tabs */}
                <div style={{ display: "flex", gap: "7px", marginBottom: "20px" }}>
                  {[
                    { id: "dashboard", label: "📋 Referrals" },
                    { id: "commission", label: "💸 Commission Structure" },
                    { id: "payout", label: "🏦 Payout Settings" },
                    { id: "promo", label: "🎨 Promo Materials" },
                  ].map(t => (
                    <button key={t.id} onClick={() => setAffiliateTab(t.id)} style={{
                      padding: "7px 15px",
                      background: affiliateTab === t.id ? "linear-gradient(135deg, #6366f1, #a855f7)" : "rgba(10,16,32,0.8)",
                      border: `1px solid ${affiliateTab === t.id ? "transparent" : "rgba(99,102,241,0.14)"}`,
                      borderRadius: "20px", color: affiliateTab === t.id ? "white" : "#6b7280",
                      fontSize: "10px", fontWeight: 600, cursor: "pointer",
                      boxShadow: affiliateTab === t.id ? "0 2px 12px rgba(99,102,241,0.3)" : "none",
                      transition: "all 0.2s",
                    }}>{t.label}</button>
                  ))}
                </div>

                {/* REFERRALS TABLE */}
                {affiliateTab === "dashboard" && (
                  <div style={{ background: "rgba(10,16,32,0.85)", border: "1px solid rgba(99,102,241,0.12)", borderRadius: "14px", overflow: "hidden" }}>
                    <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(99,102,241,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontSize: "9px", color: "#818cf8", letterSpacing: "2.5px", textTransform: "uppercase", fontWeight: 600 }}>▸ Your Referrals</div>
                      <div style={{ fontSize: "10px", color: "#4b5563" }}>{affiliateReferrals.length} total</div>
                    </div>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                          <tr style={{ borderBottom: "1px solid rgba(99,102,241,0.08)" }}>
                            {["User", "Plan", "Joined", "Commission", "Status"].map(h => (
                              <th key={h} style={{ padding: "11px 18px", textAlign: "left", fontSize: "8px", color: "#4b5563", letterSpacing: "1.5px", textTransform: "uppercase", fontWeight: 600 }}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {affiliateReferrals.map((r, i) => (
                            <tr key={r.id} style={{ borderBottom: "1px solid rgba(99,102,241,0.05)", background: i % 2 === 0 ? "rgba(99,102,241,0.015)" : "transparent" }}>
                              <td style={{ padding: "13px 18px" }}>
                                <div style={{ fontSize: "12px", fontWeight: 600, color: "#e8eaf2" }}>{r.name}</div>
                                <div style={{ fontSize: "10px", color: "#4b5563" }}>{r.email}</div>
                              </td>
                              <td style={{ padding: "13px 18px" }}>
                                <span style={{
                                  fontSize: "9px", padding: "3px 10px",
                                  background: r.plan === "Business" ? "rgba(192,132,252,0.12)" : "rgba(129,140,248,0.12)",
                                  border: `1px solid ${r.plan === "Business" ? "rgba(192,132,252,0.25)" : "rgba(129,140,248,0.25)"}`,
                                  borderRadius: "20px", color: r.plan === "Business" ? "#c084fc" : "#818cf8",
                                  fontWeight: 700,
                                }}>{r.plan}</span>
                              </td>
                              <td style={{ padding: "13px 18px", fontSize: "11px", color: "#6b7280", fontFamily: "'JetBrains Mono', monospace" }}>{r.joined}</td>
                              <td style={{ padding: "13px 18px" }}>
                                <div style={{ fontSize: "13px", fontWeight: 700, color: "#34d399", fontFamily: "'JetBrains Mono', monospace" }}>${r.commission.toFixed(2)}/mo</div>
                              </td>
                              <td style={{ padding: "13px 18px" }}>
                                <span style={{
                                  fontSize: "9px", padding: "3px 10px",
                                  background: r.status === "active" ? "rgba(52,211,153,0.1)" : "rgba(251,191,36,0.1)",
                                  border: `1px solid ${r.status === "active" ? "rgba(52,211,153,0.25)" : "rgba(251,191,36,0.25)"}`,
                                  borderRadius: "20px", color: r.status === "active" ? "#34d399" : "#fbbf24",
                                  fontWeight: 600, textTransform: "capitalize",
                                }}>{r.status === "active" ? "✓ Active" : "⏳ Pending"}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* COMMISSION STRUCTURE */}
                {affiliateTab === "commission" && (
                  <div style={{ display: "grid", gap: "14px" }}>
                    {/* Commission tiers */}
                    <div style={{ background: "rgba(10,16,32,0.85)", border: "1px solid rgba(99,102,241,0.12)", borderRadius: "14px", padding: "24px" }}>
                      <div style={{ fontSize: "9px", color: "#818cf8", letterSpacing: "2.5px", marginBottom: "20px", textTransform: "uppercase", fontWeight: 600 }}>▸ Commission Per Plan</div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px" }}>
                        {[
                          { plan: "Pro", price: "$19/mo", commission: "$3.80/mo", pct: "20%", color: "#818cf8", icon: "⭐" },
                          { plan: "Business", price: "$49/mo", commission: "$9.80/mo", pct: "20%", color: "#c084fc", icon: "💎" },
                        ].map(t => (
                          <div key={t.plan} style={{ background: `${t.color}0d`, border: `1px solid ${t.color}22`, borderRadius: "13px", padding: "20px", textAlign: "center" }}>
                            <div style={{ fontSize: "26px", marginBottom: "10px" }}>{t.icon}</div>
                            <div style={{ fontSize: "16px", fontWeight: 800, color: t.color, marginBottom: "4px" }}>{t.plan} Plan</div>
                            <div style={{ fontSize: "11px", color: "#4b5563", marginBottom: "12px" }}>{t.price}</div>
                            <div style={{ fontSize: "22px", fontWeight: 800, color: "#34d399", fontFamily: "'JetBrains Mono', monospace" }}>{t.commission}</div>
                            <div style={{ fontSize: "9px", color: "#374151", marginTop: "4px" }}>{t.pct} recurring commission</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tier bonuses */}
                    <div style={{ background: "rgba(10,16,32,0.85)", border: "1px solid rgba(245,200,66,0.15)", borderRadius: "14px", padding: "24px" }}>
                      <div style={{ fontSize: "9px", color: "#f5c842", letterSpacing: "2.5px", marginBottom: "20px", textTransform: "uppercase", fontWeight: 600 }}>▸ Milestone Bonuses</div>
                      {[
                        { milestone: "5 referrals", bonus: "$25 bonus", reached: true, color: "#34d399" },
                        { milestone: "15 referrals", bonus: "$100 bonus + 25% commission", reached: false, color: "#818cf8" },
                        { milestone: "50 referrals", bonus: "$500 bonus + 30% commission", reached: false, color: "#c084fc" },
                        { milestone: "100 referrals", bonus: "$1,500 bonus + 35% commission", reached: false, color: "#f5c842" },
                      ].map((m, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "13px 0", borderBottom: i < 3 ? "1px solid rgba(99,102,241,0.07)" : "none" }}>
                          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: m.reached ? "rgba(52,211,153,0.15)" : "rgba(99,102,241,0.08)", border: `1px solid ${m.reached ? "rgba(52,211,153,0.3)" : "rgba(99,102,241,0.12)"}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0 }}>{m.reached ? "✓" : "○"}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: "12px", fontWeight: 600, color: m.reached ? "#34d399" : "#9ca3af" }}>{m.milestone}</div>
                            <div style={{ fontSize: "10px", color: "#4b5563" }}>{m.bonus}</div>
                          </div>
                          {m.reached && <span style={{ fontSize: "9px", padding: "3px 10px", background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)", borderRadius: "20px", color: "#34d399", fontWeight: 700 }}>REACHED ✓</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* PAYOUT SETTINGS */}
                {affiliateTab === "payout" && (
                  <div style={{ maxWidth: "520px" }}>
                    <div style={{ background: "rgba(10,16,32,0.85)", border: "1px solid rgba(99,102,241,0.12)", borderRadius: "14px", padding: "24px", marginBottom: "16px" }}>
                      <div style={{ fontSize: "9px", color: "#818cf8", letterSpacing: "2.5px", marginBottom: "20px", textTransform: "uppercase", fontWeight: 600 }}>▸ Payout Method</div>
                      {[
                        { id: "paypal", label: "PayPal", icon: "🅿", desc: "Fast transfers, 1-2 business days" },
                        { id: "bank", label: "Bank Transfer", icon: "🏦", desc: "Direct to your bank, 3-5 days" },
                        { id: "crypto", label: "Crypto (USDT/BTC)", icon: "₿", desc: "Instant, minimal fees" },
                      ].map(m => (
                        <div key={m.id} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "14px", background: "rgba(99,102,241,0.04)", border: "1px solid rgba(99,102,241,0.1)", borderRadius: "11px", marginBottom: "10px", cursor: "pointer" }}>
                          <div style={{ fontSize: "22px" }}>{m.icon}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: "12px", fontWeight: 700, color: "#e8eaf2" }}>{m.label}</div>
                            <div style={{ fontSize: "10px", color: "#4b5563" }}>{m.desc}</div>
                          </div>
                          <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: m.id === "paypal" ? "linear-gradient(135deg, #6366f1, #a855f7)" : "transparent", border: m.id === "paypal" ? "none" : "2px solid rgba(99,102,241,0.2)" }} />
                        </div>
                      ))}
                    </div>

                    <div style={{ background: "rgba(10,16,32,0.85)", border: "1px solid rgba(99,102,241,0.12)", borderRadius: "14px", padding: "24px" }}>
                      <div style={{ fontSize: "9px", color: "#818cf8", letterSpacing: "2.5px", marginBottom: "16px", textTransform: "uppercase", fontWeight: 600 }}>▸ Payout Schedule</div>
                      <div style={{ display: "flex", gap: "10px", marginBottom: "18px" }}>
                        {["Monthly", "Weekly"].map(opt => (
                          <div key={opt} style={{ flex: 1, padding: "12px", background: opt === "Monthly" ? "rgba(99,102,241,0.12)" : "rgba(99,102,241,0.04)", border: `1px solid ${opt === "Monthly" ? "rgba(99,102,241,0.3)" : "rgba(99,102,241,0.1)"}`, borderRadius: "10px", textAlign: "center", cursor: "pointer" }}>
                            <div style={{ fontSize: "12px", fontWeight: 700, color: opt === "Monthly" ? "#818cf8" : "#4b5563" }}>{opt}</div>
                            <div style={{ fontSize: "9px", color: "#374151", marginTop: "3px" }}>{opt === "Monthly" ? "1st of each month" : "Every Monday (Pro+)"}</div>
                          </div>
                        ))}
                      </div>
                      <div style={{ padding: "13px 16px", background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.15)", borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontSize: "11px", color: "#6b7280" }}>Next payout</div>
                          <div style={{ fontSize: "15px", fontWeight: 800, color: "#34d399", fontFamily: "'JetBrains Mono', monospace" }}>${pending.toFixed(2)}</div>
                        </div>
                        <div style={{ fontSize: "10px", color: "#4b5563", textAlign: "right" }}>
                          <div>Jul 1, 2026</div>
                          <div style={{ color: "#374151", marginTop: "2px" }}>via PayPal</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* PROMO MATERIALS */}
                {affiliateTab === "promo" && (
                  <div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "14px" }}>
                      {[
                        { type: "Banner", size: "728×90", format: "PNG", icon: "🖼", color: "#818cf8", desc: "Website leaderboard banner" },
                        { type: "Square Ad", size: "300×250", format: "PNG", icon: "◻", color: "#c084fc", desc: "Blog sidebar or social post" },
                        { type: "Story / Reel", size: "1080×1920", format: "PNG", icon: "📱", color: "#34d399", desc: "Instagram / TikTok story" },
                        { type: "Email Template", size: "600px wide", format: "HTML", icon: "📧", color: "#fbbf24", desc: "Ready-to-send referral email" },
                        { type: "Tweet Copy", size: "280 chars", format: "TXT", icon: "🐦", color: "#60a5fa", desc: "Pre-written Twitter/X post" },
                        { type: "WhatsApp Message", size: "—", format: "TXT", icon: "💬", color: "#25d366", desc: "Quick share via chat" },
                      ].map(m => (
                        <div key={m.type} className="glass-card" style={{ borderRadius: "13px", padding: "20px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                            <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: `${m.color}15`, border: `1px solid ${m.color}25`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>{m.icon}</div>
                            <div>
                              <div style={{ fontSize: "13px", fontWeight: 700, color: "#e8eaf2" }}>{m.type}</div>
                              <div style={{ fontSize: "9px", color: "#4b5563" }}>{m.size} · {m.format}</div>
                            </div>
                          </div>
                          <div style={{ fontSize: "11px", color: "#6b7280", marginBottom: "14px" }}>{m.desc}</div>
                          <button onClick={() => {
                            const content = `Promo Material: ${m.type}\nSize: ${m.size}\nFormat: ${m.format}\nYour Link: ${AFFILIATE_LINK}\n\n[Download from dashboard to get actual assets]`;
                            const blob = new Blob([content], { type: "text/plain" });
                            const url = URL.createObjectURL(blob); const a = document.createElement("a");
                            a.href = url; a.download = `${m.type.replace(/\s+/g,"_")}.${m.format.toLowerCase()}`; a.click(); URL.revokeObjectURL(url);
                          }} style={{
                            width: "100%", padding: "8px 0",
                            background: `${m.color}12`, border: `1px solid ${m.color}25`,
                            borderRadius: "8px", color: m.color,
                            fontSize: "9px", fontFamily: "'Sora', sans-serif",
                            fontWeight: 700, letterSpacing: "1px", cursor: "pointer",
                          }}>⬇ DOWNLOAD</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            );
          })()}


          {/* ====== CONTENT CREATOR ====== */}
          {activeNav === "creator" && (() => {
            const PLATFORM_TEMPLATES = {
              youtube: {
                label: "YouTube", icon: "▶", color: "#ff0000",
                title: "YouTube Video Script",
                fields: [
                  { name: "Hook (0-3s)", placeholder: "Start with a bold question or shocking stat..." },
                  { name: "Intro (3-30s)", placeholder: "Brief intro + what viewers will learn..." },
                  { name: "Main Content", placeholder: "3-5 key points with examples..." },
                  { name: "CTA", placeholder: "Subscribe, like, comment prompt..." },
                ],
                tips: ["Use 70-character title for SEO", "Add timestamps in description", "Upload custom thumbnail (16:9)", "Best upload time: Tue-Thu 2-4pm"],
              },
              instagram: {
                label: "Instagram", icon: "◉", color: "#e1306c",
                title: "Instagram Post / Reel",
                fields: [
                  { name: "Hook (first line)", placeholder: "Scroll-stopping opener (emojis welcome)..." },
                  { name: "Body", placeholder: "Value / story / tips in short paragraphs..." },
                  { name: "CTA", placeholder: "Save this, tag a friend, drop a comment..." },
                  { name: "Hashtags", placeholder: "#contentcreator #aitools #growthhack..." },
                ],
                tips: ["First 125 chars shown before 'More'", "Use 3-5 niche hashtags", "Post Reels for 3x reach", "Story poll within 24h boosts engagement"],
              },
              tiktok: {
                label: "TikTok", icon: "♪", color: "#69c9d0",
                title: "TikTok Script",
                fields: [
                  { name: "Hook (0-2s)", placeholder: "POV: / Wait for it... / You won't believe..." },
                  { name: "Content (2-25s)", placeholder: "Quick value, step-by-step, or story arc..." },
                  { name: "Loop / Rewatch Bait", placeholder: "End that connects back to start..." },
                  { name: "Text Overlay", placeholder: "On-screen text to add..." },
                ],
                tips: ["Vertical 9:16 is mandatory", "Hook must land in first 2 seconds", "Trending audio = more push", "Post 1-3x/day for algorithm"],
              },
              linkedin: {
                label: "LinkedIn", icon: "in", color: "#0077b5",
                title: "LinkedIn Post",
                fields: [
                  { name: "Opening Line", placeholder: "Contrarian take or bold statement..." },
                  { name: "Story / Insight", placeholder: "Personal experience or data-backed insight..." },
                  { name: "Lesson / Takeaway", placeholder: "What readers should apply today..." },
                  { name: "Engagement Question", placeholder: "End with a question to spark comments..." },
                ],
                tips: ["No links in body (kills reach)", "Use line breaks generously", "First comment = add your link", "Best time: Mon-Wed 8-10am"],
              },
            };

            const tmpl = PLATFORM_TEMPLATES[selectedPlatformTemplate] || PLATFORM_TEMPLATES["youtube"];

            const runRepurpose = async () => {
              if (!repurposeInput.trim() || repurposeLoading) return;
              setRepurposeLoading(true);
              setRepurposeResults(null);
              try {
                const res = await fetch("https://api.anthropic.com/v1/messages", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    model: "claude-sonnet-4-20250514",
                    max_tokens: 1000,
                    system: `You are a content repurposing expert. Given a piece of content, generate platform-specific versions. Return ONLY valid JSON (no markdown) with this structure:
{
  "youtube": "YouTube description/script excerpt (2-3 sentences hook)",
  "instagram": "Instagram caption with emojis and hashtags",
  "tiktok": "TikTok script hook and key points (under 150 words)",
  "linkedin": "LinkedIn post (professional, story-driven, 100-150 words)",
  "twitter": "Tweet thread (3 tweets, numbered, under 280 chars each)",
  "email": "Email newsletter intro paragraph"
}`,
                    messages: [{ role: "user", content: `Repurpose this content for all platforms:\n\n${repurposeInput}` }],
                  }),
                });
                const data = await res.json();
                const text = data.content?.map(c => c.text || "").join("") || "";
                const clean = text.replace(/```json|```/g, "").trim();
                setRepurposeResults(JSON.parse(clean));
              } catch (err) {
                console.error("repurpose error:", err);
                setRepurposeResults({ error: true });
              } finally {
                setRepurposeLoading(false);
              }
            };

            return (
              <div>
                {/* Header */}
                <div style={{ marginBottom: "26px" }}>
                  <h2 style={{ margin: "0 0 5px", fontSize: "21px", fontWeight: 700, letterSpacing: "-0.2px" }}>🎨 Content Creator</h2>
                  <p style={{ margin: 0, color: "#6b7280", fontSize: "13px" }}>Plan, repurpose, and publish content across every platform</p>
                </div>

                {/* Tabs */}
                <div style={{ display: "flex", gap: "6px", marginBottom: "24px" }}>
                  {[
                    { id: "calendar", label: "📅 Content Calendar" },
                    { id: "repurpose", label: "♻ Repurpose Tool" },
                    { id: "templates", label: "📐 Platform Templates" },
                  ].map(t => (
                    <button key={t.id} onClick={() => setCreatorTab(t.id)} style={{
                      padding: "9px 18px",
                      background: creatorTab === t.id ? "rgba(99,102,241,0.18)" : "rgba(10,16,32,0.6)",
                      border: `1px solid ${creatorTab === t.id ? "rgba(99,102,241,0.4)" : "rgba(99,102,241,0.1)"}`,
                      borderRadius: "10px", color: creatorTab === t.id ? "#a5b4fc" : "#6b7280",
                      fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "'Sora', sans-serif",
                      transition: "all 0.2s",
                    }}>{t.label}</button>
                  ))}
                </div>

                {/* ── CONTENT CALENDAR ── */}
                {creatorTab === "calendar" && (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" }}>
                      <div style={{ fontSize: "11px", color: "#818cf8", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 600 }}>▸ This Week's Schedule</div>
                      <button onClick={() => {
                        const newPost = {
                          id: Date.now(), date: "New", platform: "Instagram", type: "Post",
                          title: "Untitled Post", status: "draft", color: "#e1306c",
                        };
                        setCalendarPosts(p => [newPost, ...p]);
                      }} style={{
                        padding: "8px 16px",
                        background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)",
                        borderRadius: "9px", color: "#818cf8", fontSize: "11px",
                        fontWeight: 600, cursor: "pointer", fontFamily: "'Sora', sans-serif",
                        letterSpacing: "0.8px",
                      }}>+ ADD POST</button>
                    </div>

                    {/* Platform legend */}
                    <div style={{ display: "flex", gap: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
                      {[
                        { label: "Instagram", color: "#e1306c" },
                        { label: "YouTube", color: "#ff0000" },
                        { label: "TikTok", color: "#69c9d0" },
                        { label: "LinkedIn", color: "#0077b5" },
                      ].map(p => (
                        <div key={p.label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: p.color }} />
                          <span style={{ fontSize: "10px", color: "#4b5563" }}>{p.label}</span>
                        </div>
                      ))}
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {calendarPosts.map(post => (
                        <div key={post.id} className="glass-card" style={{
                          borderRadius: "12px", padding: "16px 18px",
                          display: "flex", alignItems: "center", gap: "16px",
                          borderLeft: `3px solid ${post.color}`,
                        }}>
                          <div style={{ minWidth: "90px" }}>
                            <div style={{ fontSize: "10px", color: "#4b5563", letterSpacing: "0.8px" }}>{post.date}</div>
                          </div>
                          <div style={{
                            width: "32px", height: "32px", borderRadius: "8px", flexShrink: 0,
                            background: `${post.color}20`, border: `1px solid ${post.color}40`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "11px", color: post.color, fontWeight: 700,
                          }}>{post.platform.slice(0, 2).toUpperCase()}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: "13px", fontWeight: 600, color: "#e8eaf2", marginBottom: "3px" }}>{post.title}</div>
                            <div style={{ fontSize: "10px", color: "#4b5563" }}>{post.platform} · {post.type}</div>
                          </div>
                          <div style={{
                            padding: "4px 12px", borderRadius: "20px", fontSize: "10px", fontWeight: 600, letterSpacing: "0.8px",
                            background: post.status === "published" ? "rgba(52,211,153,0.12)" : post.status === "scheduled" ? "rgba(129,140,248,0.12)" : "rgba(107,114,128,0.12)",
                            color: post.status === "published" ? "#34d399" : post.status === "scheduled" ? "#818cf8" : "#6b7280",
                            border: `1px solid ${post.status === "published" ? "rgba(52,211,153,0.25)" : post.status === "scheduled" ? "rgba(129,140,248,0.25)" : "rgba(107,114,128,0.25)"}`,
                            textTransform: "uppercase",
                          }}>{post.status}</div>
                          <button onClick={() => setCalendarPosts(p => p.filter(x => x.id !== post.id))} style={{
                            width: "28px", height: "28px", borderRadius: "7px",
                            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)",
                            color: "#f87171", fontSize: "13px", cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>×</button>
                        </div>
                      ))}
                    </div>

                    {/* Stats row */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginTop: "20px" }}>
                      {[
                        { label: "Scheduled", value: calendarPosts.filter(p => p.status === "scheduled").length, color: "#818cf8" },
                        { label: "Drafts", value: calendarPosts.filter(p => p.status === "draft").length, color: "#fbbf24" },
                        { label: "Published", value: calendarPosts.filter(p => p.status === "published").length, color: "#34d399" },
                      ].map(s => (
                        <div key={s.label} style={{
                          background: "rgba(10,16,32,0.6)", border: "1px solid rgba(99,102,241,0.1)",
                          borderRadius: "12px", padding: "16px", textAlign: "center",
                        }}>
                          <div style={{ fontSize: "28px", fontWeight: 800, color: s.color }}>{s.value}</div>
                          <div style={{ fontSize: "10px", color: "#4b5563", marginTop: "4px", letterSpacing: "1px", textTransform: "uppercase" }}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── REPURPOSE TOOL ── */}
                {creatorTab === "repurpose" && (
                  <div>
                    <div style={{ fontSize: "11px", color: "#818cf8", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 600, marginBottom: "16px" }}>▸ One Piece → All Platforms</div>

                    <div style={{
                      background: "rgba(10,16,32,0.7)", border: "1px solid rgba(99,102,241,0.12)",
                      borderRadius: "14px", padding: "20px", marginBottom: "16px",
                    }}>
                      <div style={{ fontSize: "10px", color: "#4b5563", letterSpacing: "1.2px", marginBottom: "10px", textTransform: "uppercase" }}>YOUR ORIGINAL CONTENT</div>
                      <textarea
                        value={repurposeInput}
                        onChange={e => setRepurposeInput(e.target.value)}
                        placeholder="Paste your blog post, YouTube script, newsletter, podcast transcript, or any content here..."
                        style={{
                          width: "100%", minHeight: "130px", padding: "14px",
                          background: "rgba(3,5,13,0.7)", border: "1px solid rgba(99,102,241,0.12)",
                          borderRadius: "10px", color: "#e8eaf2", fontSize: "13px",
                          fontFamily: "'Sora', sans-serif", resize: "vertical",
                          boxSizing: "border-box",
                        }}
                      />
                      <button onClick={runRepurpose} disabled={repurposeLoading} style={{
                        marginTop: "12px", padding: "11px 28px",
                        background: repurposeLoading ? "rgba(99,102,241,0.1)" : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                        border: "none", borderRadius: "10px", color: "#fff",
                        fontSize: "12px", fontWeight: 700, cursor: repurposeLoading ? "not-allowed" : "pointer",
                        fontFamily: "'Sora', sans-serif", letterSpacing: "1px",
                        boxShadow: repurposeLoading ? "none" : "0 4px 20px rgba(99,102,241,0.4)",
                      }}>
                        {repurposeLoading ? "✦ REPURPOSING..." : "♻ REPURPOSE CONTENT"}
                      </button>
                    </div>

                    {repurposeResults && !repurposeResults.error && (
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "12px" }}>
                        {[
                          { key: "youtube", label: "YouTube", icon: "▶", color: "#ff0000" },
                          { key: "instagram", label: "Instagram", icon: "◉", color: "#e1306c" },
                          { key: "tiktok", label: "TikTok", icon: "♪", color: "#69c9d0" },
                          { key: "linkedin", label: "LinkedIn", icon: "in", color: "#0077b5" },
                          { key: "twitter", label: "Twitter / X", icon: "𝕏", color: "#1da1f2" },
                          { key: "email", label: "Email Newsletter", icon: "✉", color: "#34d399" },
                        ].map(platform => repurposeResults[platform.key] && (
                          <div key={platform.key} className="glass-card" style={{ borderRadius: "12px", padding: "18px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <div style={{
                                  width: "28px", height: "28px", borderRadius: "7px",
                                  background: `${platform.color}18`, border: `1px solid ${platform.color}35`,
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                  fontSize: "11px", color: platform.color, fontWeight: 700,
                                }}>{platform.icon}</div>
                                <span style={{ fontSize: "12px", fontWeight: 600, color: "#e8eaf2" }}>{platform.label}</span>
                              </div>
                              <button onClick={() => navigator.clipboard.writeText(repurposeResults[platform.key])} style={{
                                padding: "4px 10px", background: "rgba(99,102,241,0.1)",
                                border: "1px solid rgba(99,102,241,0.2)", borderRadius: "6px",
                                color: "#818cf8", fontSize: "9px", cursor: "pointer",
                                fontFamily: "'Sora', sans-serif", fontWeight: 600, letterSpacing: "0.8px",
                              }}>COPY</button>
                            </div>
                            <div style={{
                              color: "#9ca3af", lineHeight: "1.6",
                              maxHeight: "120px", overflow: "auto",
                              fontFamily: "'JetBrains Mono', monospace", fontSize: "11px",
                            }}>{repurposeResults[platform.key]}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {repurposeResults?.error && (
                      <div style={{ padding: "16px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: "10px", color: "#f87171", fontSize: "12px" }}>
                        ⚠ Repurpose failed. Please try again.
                      </div>
                    )}
                  </div>
                )}

                {/* ── PLATFORM TEMPLATES ── */}
                {creatorTab === "templates" && (
                  <div>
                    <div style={{ fontSize: "11px", color: "#818cf8", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 600, marginBottom: "16px" }}>▸ Ready-to-Use Format Templates</div>

                    {/* Platform selector */}
                    <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
                      {Object.entries(PLATFORM_TEMPLATES).map(([key, pt]) => (
                        <button key={key} onClick={() => setSelectedPlatformTemplate(key)} style={{
                          padding: "9px 18px", borderRadius: "10px", cursor: "pointer",
                          fontFamily: "'Sora', sans-serif", fontSize: "12px", fontWeight: 600,
                          background: selectedPlatformTemplate === key ? `${pt.color}18` : "rgba(10,16,32,0.6)",
                          border: `1px solid ${selectedPlatformTemplate === key ? pt.color + "55" : "rgba(99,102,241,0.1)"}`,
                          color: selectedPlatformTemplate === key ? pt.color : "#6b7280",
                          transition: "all 0.2s",
                        }}>
                          {pt.icon} {pt.label}
                        </button>
                      ))}
                    </div>

                    {/* Template content */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      {/* Structure */}
                      <div style={{
                        background: "rgba(10,16,32,0.7)", border: `1px solid ${tmpl.color}25`,
                        borderRadius: "14px", padding: "20px",
                      }}>
                        <div style={{ fontSize: "10px", letterSpacing: "1.8px", color: tmpl.color, textTransform: "uppercase", fontWeight: 600, marginBottom: "16px" }}>
                          ▸ {tmpl.title} Structure
                        </div>
                        {tmpl.fields.map((f, i) => (
                          <div key={i} style={{ marginBottom: "14px" }}>
                            <div style={{ fontSize: "10px", color: "#4b5563", letterSpacing: "1px", marginBottom: "6px", textTransform: "uppercase" }}>
                              {i + 1}. {f.name}
                            </div>
                            <textarea
                              placeholder={f.placeholder}
                              style={{
                                width: "100%", padding: "10px 12px",
                                background: "rgba(3,5,13,0.6)", border: "1px solid rgba(99,102,241,0.1)",
                                borderRadius: "8px", color: "#e8eaf2", fontSize: "11px",
                                fontFamily: "'Sora', sans-serif", resize: "none", minHeight: "56px",
                                boxSizing: "border-box",
                              }}
                            />
                          </div>
                        ))}
                        <button style={{
                          width: "100%", padding: "11px",
                          background: `${tmpl.color}18`, border: `1px solid ${tmpl.color}35`,
                          borderRadius: "9px", color: tmpl.color,
                          fontSize: "11px", fontWeight: 700, cursor: "pointer",
                          fontFamily: "'Sora', sans-serif", letterSpacing: "1px",
                        }}>⬇ EXPORT TEMPLATE</button>
                      </div>

                      {/* Tips */}
                      <div style={{
                        background: "rgba(10,16,32,0.7)", border: "1px solid rgba(99,102,241,0.12)",
                        borderRadius: "14px", padding: "20px",
                      }}>
                        <div style={{ fontSize: "10px", letterSpacing: "1.8px", color: "#818cf8", textTransform: "uppercase", fontWeight: 600, marginBottom: "16px" }}>▸ Pro Tips</div>
                        {tmpl.tips.map((tip, i) => (
                          <div key={i} style={{
                            display: "flex", gap: "10px", alignItems: "flex-start",
                            marginBottom: "12px", padding: "11px 14px",
                            background: "rgba(99,102,241,0.05)", borderRadius: "9px",
                            border: "1px solid rgba(99,102,241,0.08)",
                          }}>
                            <span style={{ color: tmpl.color, fontSize: "14px", marginTop: "1px", flexShrink: 0 }}>✦</span>
                            <span style={{ fontSize: "12px", color: "#9ca3af", lineHeight: "1.5" }}>{tip}</span>
                          </div>
                        ))}

                        {/* Best post times */}
                        <div style={{ marginTop: "16px", padding: "14px", background: `${tmpl.color}08`, borderRadius: "10px", border: `1px solid ${tmpl.color}20` }}>
                          <div style={{ fontSize: "9px", color: tmpl.color, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "8px", fontWeight: 600 }}>PLATFORM STATS</div>
                          {selectedPlatformTemplate === "youtube" && <div style={{ fontSize: "11px", color: "#9ca3af", lineHeight: "1.7" }}>📈 Avg watch time goal: <b style={{color:"#e8eaf2"}}>50%+</b><br/>🎯 Ideal length: <b style={{color:"#e8eaf2"}}>8-15 min</b><br/>🔔 Notification: <b style={{color:"#e8eaf2"}}>First 48h critical</b></div>}
                          {selectedPlatformTemplate === "instagram" && <div style={{ fontSize: "11px", color: "#9ca3af", lineHeight: "1.7" }}>📈 Reel reach: <b style={{color:"#e8eaf2"}}>3x vs static</b><br/>🎯 Ideal Reel: <b style={{color:"#e8eaf2"}}>7-15 seconds</b><br/>🔔 Reply to comments in 1h</div>}
                          {selectedPlatformTemplate === "tiktok" && <div style={{ fontSize: "11px", color: "#9ca3af", lineHeight: "1.7" }}>📈 FYP hook rate: <b style={{color:"#e8eaf2"}}>needs 3s retention</b><br/>🎯 Sweet spot: <b style={{color:"#e8eaf2"}}>21-34 seconds</b><br/>🔔 Stitch/Duet for virality</div>}
                          {selectedPlatformTemplate === "linkedin" && <div style={{ fontSize: "11px", color: "#9ca3af", lineHeight: "1.7" }}>📈 Dwell time: <b style={{color:"#e8eaf2"}}>key ranking signal</b><br/>🎯 Ideal length: <b style={{color:"#e8eaf2"}}>1200-1500 chars</b><br/>🔔 Tag 1-2 people max</div>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}


          {/* ====== SETTINGS ====== */}
          {activeNav === "settings" && (
            <div style={{ maxWidth: "580px" }}>
              <div style={{ marginBottom: "26px" }}>
                <h2 style={{ margin: "0 0 5px", fontSize: "21px", fontWeight: 700, letterSpacing: "-0.2px" }}>⚙ Settings</h2>
                <p style={{ margin: 0, color: "#6b7280", fontSize: "13px" }}>Manage your account preferences</p>
              </div>

              {[
                { section: "Profile", fields: [{ label: "Full Name", value: "Rahul Kumar" }, { label: "Email", value: "rahul@example.com" }] },
                { section: "API", fields: [{ label: "Your API Key", value: "bai_••••••••••••••••••••••" }, { label: "Webhook URL", value: "https://your-site.com/webhook" }] },
              ].map(({ section, fields }) => (
                <div key={section} style={{
                  background: "rgba(10,16,32,0.85)", backdropFilter: "blur(20px)",
                  border: "1px solid rgba(99,102,241,0.1)", borderRadius: "14px", padding: "22px", marginBottom: "16px",
                }}>
                  <div style={{ fontSize: "9px", color: "#818cf8", letterSpacing: "2.5px", marginBottom: "18px", textTransform: "uppercase", fontWeight: 600 }}>▸ {section}</div>
                  {fields.map(({ label, value }) => (
                    <div key={label} style={{ marginBottom: "15px" }}>
                      <div style={{ fontSize: "9px", color: "#4b5563", letterSpacing: "1.2px", marginBottom: "7px", textTransform: "uppercase", fontWeight: 500 }}>{label}</div>
                      <div style={{
                        background: "rgba(3,5,13,0.7)", border: "1px solid rgba(99,102,241,0.1)",
                        borderRadius: "9px", padding: "11px 14px", fontSize: "12px", color: "#6b7280",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}>{value}</div>
                    </div>
                  ))}
                  <button style={{
                    padding: "9px 20px",
                    background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)",
                    borderRadius: "9px", color: "#818cf8",
                    fontSize: "10px", fontFamily: "'Sora', sans-serif",
                    fontWeight: 600, cursor: "pointer", letterSpacing: "1px",
                    transition: "all 0.2s",
                  }}>
                    SAVE CHANGES
                  </button>
                </div>
              ))}

              <div style={{
                background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.13)",
                borderRadius: "14px", padding: "22px",
              }}>
                <div style={{ fontSize: "9px", color: "#f87171", letterSpacing: "2.5px", marginBottom: "14px", textTransform: "uppercase", fontWeight: 600 }}>▸ Danger Zone</div>
                <button style={{
                  padding: "9px 20px",
                  background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: "9px", color: "#f87171",
                  fontSize: "10px", fontFamily: "'Sora', sans-serif",
                  fontWeight: 600, cursor: "pointer", letterSpacing: "1px",
                  transition: "all 0.2s",
                }}>
                  DELETE ACCOUNT
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
