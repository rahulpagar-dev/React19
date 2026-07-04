import { useState, createContext, useContext, useRef } from "react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from "recharts";
import {
  LayoutDashboard, Users, Briefcase, ArrowLeftRight, FileBarChart2,
  Settings, Bell, Search, TrendingUp, TrendingDown, Shield,
  CircleDot, Sun, Moon, Eye, Minimize2, Maximize2, ArrowUpRight,
  ArrowDownRight, ChevronRight, Wallet, CreditCard, Send,
  ArrowRight, Check, X, Plus, Minus, Lock, Mail, User,
  BarChart2, Globe, Building2, Star, Menu, LogOut, Home,
  PiggyBank, RefreshCw, Download, Upload, ChevronDown,
  AlertCircle
} from "lucide-react";

// ─── Theme Definitions ────────────────────────────────────────────────────────

type ThemeMode = "light" | "dark" | "night";

interface ThemeVars {
  "--background": string;
  "--foreground": string;
  "--card": string;
  "--card-foreground": string;
  "--popover": string;
  "--popover-foreground": string;
  "--primary": string;
  "--primary-foreground": string;
  "--secondary": string;
  "--secondary-foreground": string;
  "--muted": string;
  "--muted-foreground": string;
  "--accent": string;
  "--accent-foreground": string;
  "--border": string;
  "--input-background": string;
  "--ring": string;
  "--destructive": string;
  "--chart-pos": string;
  "--chart-neg": string;
  [key: string]: string;
}

const themes: Record<ThemeMode, ThemeVars> = {
  light: {
    "--background": "#F5F3EE",
    "--foreground": "#0F1520",
    "--card": "#FFFFFF",
    "--card-foreground": "#0F1520",
    "--popover": "#FFFFFF",
    "--popover-foreground": "#0F1520",
    "--primary": "#9A7A2C",
    "--primary-foreground": "#FFFFFF",
    "--secondary": "#ECEAE3",
    "--secondary-foreground": "#0F1520",
    "--muted": "#EBEBDF",
    "--muted-foreground": "#7A7868",
    "--accent": "#9A7A2C",
    "--accent-foreground": "#FFFFFF",
    "--border": "rgba(0,0,0,0.09)",
    "--input-background": "#ECEAE3",
    "--ring": "#9A7A2C",
    "--destructive": "#C0392B",
    "--chart-pos": "#2E7D32",
    "--chart-neg": "#C0392B",
  },
  dark: {
    "--background": "#080C14",
    "--foreground": "#E2E8F2",
    "--card": "#0F1623",
    "--card-foreground": "#E2E8F2",
    "--popover": "#131E2E",
    "--popover-foreground": "#E2E8F2",
    "--primary": "#C9A84C",
    "--primary-foreground": "#080C14",
    "--secondary": "#151E2E",
    "--secondary-foreground": "#A8B5C8",
    "--muted": "#111827",
    "--muted-foreground": "#5C6E85",
    "--accent": "#C9A84C",
    "--accent-foreground": "#080C14",
    "--border": "rgba(255,255,255,0.07)",
    "--input-background": "#111827",
    "--ring": "#C9A84C",
    "--destructive": "#E05252",
    "--chart-pos": "#7BC67E",
    "--chart-neg": "#E05252",
  },
  night: {
    "--background": "#0A0602",
    "--foreground": "#D4A87A",
    "--card": "#120C04",
    "--card-foreground": "#D4A87A",
    "--popover": "#160E06",
    "--popover-foreground": "#D4A87A",
    "--primary": "#D4884C",
    "--primary-foreground": "#0A0602",
    "--secondary": "#1C1006",
    "--secondary-foreground": "#B8896A",
    "--muted": "#160E06",
    "--muted-foreground": "#6B5030",
    "--accent": "#D4884C",
    "--accent-foreground": "#0A0602",
    "--border": "rgba(212,168,122,0.09)",
    "--input-background": "#160E06",
    "--ring": "#D4884C",
    "--destructive": "#C0392B",
    "--chart-pos": "#A0A050",
    "--chart-neg": "#C06030",
  },
};

// ─── Theme Context ────────────────────────────────────────────────────────────

interface AppContext {
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  focusMode: boolean;
  setFocusMode: (v: boolean) => void;
  navigate: (page: NavPage, subview?: string) => void;
  currentPage: NavPage;
  currentSubview: string;
}

const Ctx = createContext<AppContext>({} as AppContext);
const useApp = () => useContext(Ctx);

type NavPage = "home" | "login" | "signup" | "app" | "payment" | "wallet";

// ─── Data ─────────────────────────────────────────────────────────────────────

const performanceData = [
  { month: "Jan", portfolio: 4.82, benchmark: 3.40 },
  { month: "Feb", portfolio: 6.14, benchmark: 4.10 },
  { month: "Mar", portfolio: 5.50, benchmark: 4.80 },
  { month: "Apr", portfolio: 8.20, benchmark: 5.60 },
  { month: "May", portfolio: 7.90, benchmark: 5.20 },
  { month: "Jun", portfolio: 10.40, benchmark: 6.80 },
  { month: "Jul", portfolio: 9.80, benchmark: 7.10 },
  { month: "Aug", portfolio: 12.60, benchmark: 8.30 },
  { month: "Sep", portfolio: 11.20, benchmark: 7.90 },
  { month: "Oct", portfolio: 14.50, benchmark: 9.40 },
  { month: "Nov", portfolio: 16.20, benchmark: 10.70 },
  { month: "Dec", portfolio: 18.74, benchmark: 12.30 },
];

const allocationData = [
  { name: "US Equities", value: 38, color: "var(--primary)" },
  { name: "International", value: 22, color: "#4A9EBF" },
  { name: "Fixed Income", value: 18, color: "var(--chart-pos)" },
  { name: "Alternatives", value: 12, color: "#A87DC9" },
  { name: "Cash & Equiv.", value: 10, color: "var(--muted-foreground)" },
];

const monthlyReturns = [
  { month: "Jul", return: 1.8 },
  { month: "Aug", return: 2.9 },
  { month: "Sep", return: -0.7 },
  { month: "Oct", return: 3.4 },
  { month: "Nov", return: 1.9 },
  { month: "Dec", return: 2.6 },
];

const holdings = [
  { ticker: "AAPL", name: "Apple Inc.", sector: "Technology", shares: 1420, price: 192.45, value: 273279, change: 2.34, weight: 8.2 },
  { ticker: "MSFT", name: "Microsoft Corp.", sector: "Technology", shares: 890, price: 378.85, value: 337177, change: 1.12, weight: 10.1 },
  { ticker: "BRK.B", name: "Berkshire Hathaway B", sector: "Financials", shares: 640, price: 364.20, value: 233088, change: 0.45, weight: 7.0 },
  { ticker: "JPM", name: "JPMorgan Chase", sector: "Financials", shares: 1100, price: 196.70, value: 216370, change: -0.83, weight: 6.5 },
  { ticker: "V", name: "Visa Inc.", sector: "Financials", shares: 780, price: 271.30, value: 211614, change: 1.67, weight: 6.3 },
  { ticker: "NVDA", name: "NVIDIA Corp.", sector: "Technology", shares: 460, price: 495.80, value: 228068, change: 4.21, weight: 6.8 },
  { ticker: "JNJ", name: "Johnson & Johnson", sector: "Healthcare", shares: 960, price: 158.40, value: 152064, change: -0.31, weight: 4.6 },
  { ticker: "XOM", name: "Exxon Mobil Corp.", sector: "Energy", shares: 1240, price: 104.60, value: 129704, change: 0.92, weight: 3.9 },
  { ticker: "TLT", name: "iShares 20Y Treasury", sector: "Fixed Income", shares: 2400, price: 92.35, value: 221640, change: -0.18, weight: 6.6 },
  { ticker: "GLD", name: "SPDR Gold Shares", sector: "Commodities", shares: 620, price: 186.40, value: 115568, change: 0.74, weight: 3.5 },
];

const clients = [
  { id: "CL-0041", name: "Hartwell Family Trust", advisor: "M. Okafor", aum: 8420000, ytd: 18.74, risk: "Moderate Growth", lastContact: "Dec 18, 2024", status: "active" },
  { id: "CL-0038", name: "Brennan Capital LLC", advisor: "S. Nakamura", aum: 14200000, ytd: 21.30, risk: "Aggressive", lastContact: "Dec 20, 2024", status: "active" },
  { id: "CL-0055", name: "R. & P. Vásquez", advisor: "M. Okafor", aum: 2180000, ytd: 14.60, risk: "Conservative", lastContact: "Nov 29, 2024", status: "active" },
  { id: "CL-0062", name: "Stonegate Endowment", advisor: "T. Lindqvist", aum: 31500000, ytd: 16.20, risk: "Balanced", lastContact: "Dec 22, 2024", status: "active" },
  { id: "CL-0029", name: "Miriam Hoeffel IRA", advisor: "S. Nakamura", aum: 945000, ytd: 12.40, risk: "Conservative", lastContact: "Dec 10, 2024", status: "review" },
  { id: "CL-0071", name: "Pellegrini Industries", advisor: "T. Lindqvist", aum: 6750000, ytd: 19.80, risk: "Moderate Growth", lastContact: "Dec 19, 2024", status: "active" },
  { id: "CL-0048", name: "Driftwood Foundation", advisor: "M. Okafor", aum: 19800000, ytd: 15.90, risk: "Balanced", lastContact: "Dec 5, 2024", status: "active" },
];

const transactions = [
  { id: "TXN-8841", date: "Dec 23, 2024", client: "Brennan Capital LLC", type: "BUY", ticker: "NVDA", shares: 120, price: 495.80, amount: 59496, status: "settled" },
  { id: "TXN-8840", date: "Dec 22, 2024", client: "Stonegate Endowment", type: "SELL", ticker: "TLT", shares: 800, price: 92.35, amount: 73880, status: "settled" },
  { id: "TXN-8839", date: "Dec 22, 2024", client: "Hartwell Family Trust", type: "BUY", ticker: "AAPL", shares: 200, price: 192.45, amount: 38490, status: "settled" },
  { id: "TXN-8838", date: "Dec 20, 2024", client: "Pellegrini Industries", type: "BUY", ticker: "JPM", shares: 350, price: 196.70, amount: 68845, status: "settled" },
  { id: "TXN-8837", date: "Dec 19, 2024", client: "Driftwood Foundation", type: "SELL", ticker: "GLD", shares: 180, price: 186.40, amount: 33552, status: "settled" },
  { id: "TXN-8836", date: "Dec 18, 2024", client: "Stonegate Endowment", type: "BUY", ticker: "MSFT", shares: 290, price: 378.85, amount: 109867, status: "settled" },
  { id: "TXN-8835", date: "Dec 17, 2024", client: "R. & P. Vásquez", type: "BUY", ticker: "V", shares: 140, price: 271.30, amount: 37982, status: "pending" },
  { id: "TXN-8834", date: "Dec 16, 2024", client: "Miriam Hoeffel IRA", type: "SELL", ticker: "JNJ", shares: 60, price: 158.40, amount: 9504, status: "settled" },
];

const walletFunds = [
  { id: "MER-EQ", name: "Meridian Equity Fund", type: "Equities", balance: 3284500, nav: 142.84, change: 1.92, aum: 1200000000, minInvest: 100000, risk: "Moderate Growth", chart: [120, 125, 122, 130, 128, 138, 135, 140, 137, 143] },
  { id: "MER-FI", name: "Meridian Fixed Income", type: "Fixed Income", balance: 1420000, nav: 98.72, change: 0.14, aum: 840000000, minInvest: 50000, risk: "Conservative", chart: [94, 95, 95.5, 96, 96.2, 97, 97.3, 97.8, 98.2, 98.72] },
  { id: "MER-ALT", name: "Meridian Alternatives", type: "Alternatives", balance: 920000, nav: 204.30, change: 2.48, aum: 560000000, minInvest: 250000, risk: "Aggressive", chart: [180, 185, 178, 190, 195, 188, 200, 198, 202, 204.3] },
  { id: "MER-BAL", name: "Meridian Balanced", type: "Balanced", balance: 760000, nav: 116.55, change: -0.32, aum: 420000000, minInvest: 25000, risk: "Balanced", chart: [112, 113, 114, 113.5, 115, 114.8, 115.5, 116.2, 116.8, 116.55] },
];

const paymentHistory = [
  { id: "PAY-4421", date: "Dec 23, 2024", to: "Hartwell Family Trust", method: "Wire Transfer", amount: 250000, status: "completed", ref: "WIRE-8841" },
  { id: "PAY-4418", date: "Dec 19, 2024", to: "Meridian Equity Fund", method: "Fund Subscription", amount: 500000, status: "completed", ref: "SUB-2244" },
  { id: "PAY-4415", date: "Dec 15, 2024", to: "External — HSBC Priv.", method: "Wire Transfer", amount: 180000, status: "completed", ref: "WIRE-8827" },
  { id: "PAY-4411", date: "Dec 10, 2024", to: "Meridian Fixed Income", method: "Fund Subscription", amount: 75000, status: "completed", ref: "SUB-2238" },
  { id: "PAY-4409", date: "Dec 8, 2024", to: "Pellegrini Industries", method: "ACH Transfer", amount: 32500, status: "completed", ref: "ACH-5512" },
  { id: "PAY-4405", date: "Dec 2, 2024", to: "External — Citi Private", method: "Wire Transfer", amount: 420000, status: "completed", ref: "WIRE-8819" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number, d = 2) => n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
const fmtCurrency = (n: number) => {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
};

// ─── Shared Primitives ────────────────────────────────────────────────────────

const mono = { fontFamily: "'DM Mono', monospace" };
const condensed = { fontFamily: "'Barlow Condensed', sans-serif" };
const body = { fontFamily: "'Barlow', sans-serif" };

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] text-muted-foreground tracking-widest uppercase" style={mono}>{children}</div>
  );
}

function MetricCard({ label, value, sub, positive, delta, className = "" }: {
  label: string; value: string; sub?: string; positive?: boolean; delta?: string; className?: string;
}) {
  return (
    <div className={`bg-card border border-border p-5 flex flex-col gap-2 hover:border-primary/40 transition-colors ${className}`}>
      <Label>{label}</Label>
      <div className="text-2xl text-foreground" style={{ ...condensed, fontWeight: 700, letterSpacing: "0.03em" }}>{value}</div>
      {delta !== undefined && (
        <div className={`flex items-center gap-1 text-xs ${positive ? "text-[var(--chart-pos)]" : "text-destructive"}`} style={mono}>
          {positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}{delta}
        </div>
      )}
      {sub && <div className="text-[11px] text-muted-foreground" style={mono}>{sub}</div>}
    </div>
  );
}

function Btn({
  children, variant = "primary", onClick, className = "", type = "button", disabled = false
}: {
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "outline" | "danger";
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const base = "inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs tracking-widest transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-primary text-primary-foreground hover:opacity-90",
    ghost: "text-muted-foreground hover:text-foreground hover:bg-muted",
    outline: "border border-border text-foreground hover:border-primary/50 hover:text-primary",
    danger: "border border-destructive/40 text-destructive hover:bg-destructive/10",
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
      style={condensed}
    >
      {children}
    </button>
  );
}

function Input({
  label, type = "text", placeholder, value, onChange, icon: Icon
}: {
  label?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
  icon?: React.ElementType;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs text-muted-foreground tracking-widest uppercase" style={mono}>{label}</label>}
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange?.(e.target.value)}
          className={`w-full bg-[var(--input-background)] border border-border text-foreground placeholder-muted-foreground outline-none focus:border-primary/60 transition-colors py-2.5 text-sm ${Icon ? "pl-9 pr-4" : "px-4"}`}
          style={body}
        />
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: "text-[var(--chart-pos)] border-[var(--chart-pos)]/30 bg-[var(--chart-pos)]/5",
    review: "text-primary border-primary/30 bg-primary/5",
    settled: "text-muted-foreground border-border",
    pending: "text-primary border-primary/40 bg-primary/5",
    completed: "text-[var(--chart-pos)] border-[var(--chart-pos)]/30",
    scheduled: "text-[#4A9EBF] border-[#4A9EBF]/30",
    draft: "text-primary border-primary/30",
    published: "text-[var(--chart-pos)] border-[var(--chart-pos)]/30",
  };
  return (
    <span className={`text-[10px] px-2 py-0.5 border tracking-widest ${colors[status] ?? "text-muted-foreground border-border"}`} style={mono}>
      {status.toUpperCase()}
    </span>
  );
}

// ─── Theme Switcher ───────────────────────────────────────────────────────────

function ThemeSwitcher() {
  const { theme, setTheme, focusMode, setFocusMode } = useApp();
  const buttons = [
    { mode: "light" as ThemeMode, icon: Sun, label: "Light" },
    { mode: "dark" as ThemeMode, icon: Moon, label: "Dark" },
    { mode: "night" as ThemeMode, icon: Eye, label: "Night" },
  ];
  return (
    <div className="flex items-center gap-1">
      {buttons.map(({ mode, icon: Icon, label }) => (
        <button key={mode} onClick={() => setTheme(mode)} title={label}
          className={`p-2 transition-all duration-150 border ${theme === mode ? "border-primary text-primary bg-primary/10" : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"}`}
        >
          <Icon className="w-3.5 h-3.5" />
        </button>
      ))}
      <div className="w-px h-4 bg-border mx-1" />
      <button onClick={() => setFocusMode(!focusMode)} title={focusMode ? "Exit Focus" : "Focus Mode"}
        className={`p-2 transition-all duration-150 border ${focusMode ? "border-primary text-primary bg-primary/10" : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"}`}
      >
        {focusMode ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "portfolio", label: "Portfolio", icon: Briefcase },
  { id: "clients", label: "Clients", icon: Users },
  { id: "transactions", label: "Transactions", icon: ArrowLeftRight },
  { id: "reports", label: "Reports", icon: FileBarChart2 },
];

function Sidebar({ active, onNav }: { active: string; onNav: (id: string) => void }) {
  const { focusMode, navigate } = useApp();

  if (focusMode) {
    return (
      <aside className="flex flex-col w-12 shrink-0 border-r border-border bg-background h-screen items-center py-4 gap-2">
        <div className="w-7 h-7 bg-primary flex items-center justify-center mb-2">
          <Shield className="w-4 h-4 text-primary-foreground" strokeWidth={2} />
        </div>
        {navItems.map(({ id, icon: Icon }) => (
          <button key={id} onClick={() => onNav(id)} title={id}
            className={`p-2.5 transition-colors ${active === id ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Icon className="w-4 h-4" strokeWidth={active === id ? 2 : 1.5} />
          </button>
        ))}
        <div className="flex-1" />
        <button onClick={() => navigate("wallet")} title="Wallet" className="p-2.5 text-muted-foreground hover:text-foreground">
          <Wallet className="w-4 h-4" strokeWidth={1.5} />
        </button>
        <button onClick={() => navigate("payment")} title="Payment" className="p-2.5 text-muted-foreground hover:text-foreground">
          <CreditCard className="w-4 h-4" strokeWidth={1.5} />
        </button>
      </aside>
    );
  }

  return (
    <aside className="flex flex-col w-56 shrink-0 border-r border-border bg-background h-screen">
      <div className="px-5 py-4 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-primary flex items-center justify-center shrink-0">
            <Shield className="w-4 h-4 text-primary-foreground" strokeWidth={2} />
          </div>
          <div>
            <div className="text-sm font-bold tracking-widest text-foreground" style={{ ...condensed, letterSpacing: "0.15em" }}>MERIDIAN</div>
            <div className="text-[9px] text-muted-foreground tracking-widest" style={mono}>ASSET MANAGEMENT</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-3 px-3 space-y-0.5">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button key={id} onClick={() => onNav(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all duration-150 border-l-2 ${isActive ? "bg-primary/10 text-primary border-primary pl-[10px]" : "text-muted-foreground hover:text-foreground hover:bg-muted border-transparent"}`}
            >
              <Icon className="w-4 h-4 shrink-0" strokeWidth={isActive ? 2 : 1.5} />
              <span className="text-sm" style={{ ...condensed, fontWeight: 500, letterSpacing: "0.06em" }}>{label.toUpperCase()}</span>
            </button>
          );
        })}

        <div className="pt-3 pb-1 px-3">
          <div className="text-[9px] text-muted-foreground tracking-widest" style={mono}>FINANCE</div>
        </div>

        {[
          { id: "wallet", label: "Wallet", icon: Wallet },
          { id: "payment", label: "Payments", icon: CreditCard },
        ].map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => navigate(id as NavPage)}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all duration-150 border-l-2 text-muted-foreground hover:text-foreground hover:bg-muted border-transparent"
          >
            <Icon className="w-4 h-4 shrink-0" strokeWidth={1.5} />
            <span className="text-sm" style={{ ...condensed, fontWeight: 500, letterSpacing: "0.06em" }}>{label.toUpperCase()}</span>
          </button>
        ))}
      </nav>

      <div className="border-t border-border p-3 space-y-2">
        <button onClick={() => navigate("home")}
          className="w-full flex items-center gap-3 px-3 py-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Home className="w-4 h-4" strokeWidth={1.5} />
          <span className="text-sm" style={{ ...condensed, fontWeight: 500, letterSpacing: "0.06em" }}>HOME</span>
        </button>
        <div className="flex items-center gap-3 px-3 pt-1">
          <div className="w-7 h-7 bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0">
            <span className="text-[10px] text-primary font-bold" style={condensed}>MO</span>
          </div>
          <div className="min-w-0">
            <div className="text-xs text-foreground truncate" style={{ ...body, fontWeight: 500 }}>M. Okafor</div>
            <div className="text-[10px] text-muted-foreground" style={mono}>Portfolio Manager</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

// ─── Topbar ───────────────────────────────────────────────────────────────────

function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  const { focusMode } = useApp();
  return (
    <div className={`flex items-center justify-between border-b border-border bg-background shrink-0 ${focusMode ? "px-6 py-3" : "px-8 py-4"}`}>
      <div>
        <h1 style={{ ...condensed, fontWeight: 700, fontSize: focusMode ? "1.3rem" : "1.6rem", letterSpacing: "0.08em", textTransform: "uppercase" }}
          className="text-foreground leading-none">{title}</h1>
        {subtitle && !focusMode && <p className="text-[10px] text-muted-foreground mt-0.5" style={mono}>{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {!focusMode && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input placeholder="Search..." className="bg-muted border border-border pl-9 pr-4 py-2 text-xs text-foreground placeholder-muted-foreground outline-none focus:border-primary/50 w-48 transition-colors" style={mono} />
          </div>
        )}
        {!focusMode && (
          <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors border border-border hover:border-primary/40">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-primary rounded-full" />
          </button>
        )}
        <ThemeSwitcher />
      </div>
    </div>
  );
}

// ─── Custom Chart Tooltip ─────────────────────────────────────────────────────

function ChartTip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-popover border border-border px-3 py-2 text-xs" style={mono}>
      <p className="text-muted-foreground mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {fmt(p.value)}%</p>
      ))}
    </div>
  );
}

// ─── Dashboard View ───────────────────────────────────────────────────────────

function DashboardView() {
  const totalAUM = clients.reduce((s, c) => s + c.aum, 0);
  const { theme } = useApp();
  const chartPos = theme === "night" ? "#A0A050" : theme === "light" ? "#2E7D32" : "#7BC67E";
  const chartNeg = theme === "night" ? "#C06030" : theme === "light" ? "#C0392B" : "#E05252";
  const primary = theme === "night" ? "#D4884C" : theme === "light" ? "#9A7A2C" : "#C9A84C";
  const blue = "#4A9EBF";

  return (
    <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total AUM" value={fmtCurrency(totalAUM)} delta="+12.4% YTD" positive sub="As of Dec 23, 2024" />
        <MetricCard label="YTD Return" value="18.74%" delta="+6.44% vs benchmark" positive sub="Benchmark: 12.30%" />
        <MetricCard label="Active Clients" value={`${clients.filter(c => c.status === "active").length}`} sub="1 pending review" />
        <MetricCard label="Sharpe Ratio" value="1.84" delta="+0.22 vs prior year" positive sub="Risk-adjusted" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card border border-border p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <Label>Portfolio vs Benchmark</Label>
              <div className="text-lg text-foreground mt-1" style={{ ...condensed, fontWeight: 600, letterSpacing: "0.04em" }}>YTD Cumulative Return</div>
            </div>
            <div className="flex items-center gap-4 text-[10px]" style={mono}>
              <span className="flex items-center gap-1.5" style={{ color: primary }}><CircleDot className="w-2.5 h-2.5" />Portfolio</span>
              <span className="flex items-center gap-1.5 text-muted-foreground"><CircleDot className="w-2.5 h-2.5" />Benchmark</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={performanceData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gP" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={primary} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={primary} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gB" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={blue} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={blue} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(128,128,128,0.1)" />
              <XAxis dataKey="month" tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontFamily: "'DM Mono', monospace" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontFamily: "'DM Mono', monospace" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip content={<ChartTip />} />
              <Area type="monotone" dataKey="benchmark" name="Benchmark" stroke={blue} strokeWidth={1.5} fill="url(#gB)" dot={false} />
              <Area type="monotone" dataKey="portfolio" name="Portfolio" stroke={primary} strokeWidth={2} fill="url(#gP)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border p-5">
          <Label>Asset Allocation</Label>
          <div className="text-lg text-foreground mt-1 mb-4" style={{ ...condensed, fontWeight: 600, letterSpacing: "0.04em" }}>Current Mix</div>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={allocationData} cx="50%" cy="50%" innerRadius={42} outerRadius={65} paddingAngle={2} dataKey="value" stroke="none">
                {allocationData.map((entry, i) => (
                  <Cell key={i} fill={entry.color === "var(--primary)" ? primary : entry.color === "var(--chart-pos)" ? chartPos : entry.color === "var(--muted-foreground)" ? "#5C6E85" : entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {allocationData.map((d, i) => {
              const resolved = d.color === "var(--primary)" ? primary : d.color === "var(--chart-pos)" ? chartPos : d.color === "var(--muted-foreground)" ? "#5C6E85" : d.color;
              return (
                <div key={d.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-muted-foreground" style={body}>
                    <span className="w-2 h-2 shrink-0" style={{ background: resolved }} />{d.name}
                  </span>
                  <span style={{ color: resolved, ...mono, fontSize: "11px" }}>{d.value}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border p-5">
          <Label>Monthly Performance</Label>
          <div className="text-lg text-foreground mt-1 mb-4" style={{ ...condensed, fontWeight: 600, letterSpacing: "0.04em" }}>Last 6 Months</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={monthlyReturns} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(128,128,128,0.08)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontFamily: "'DM Mono', monospace" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontFamily: "'DM Mono', monospace" }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <Tooltip formatter={(v: any) => [`${v}%`, "Return"]} contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 0, fontSize: 11, fontFamily: "'DM Mono', monospace" }} itemStyle={{ color: primary }} cursor={{ fill: "rgba(128,128,128,0.05)" }} />
              <Bar dataKey="return" radius={[2, 2, 0, 0]}>
                {monthlyReturns.map((e, i) => <Cell key={i} fill={e.return >= 0 ? primary : chartNeg} fillOpacity={0.85} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border p-5">
          <Label>Largest Accounts</Label>
          <div className="text-lg text-foreground mt-1 mb-4" style={{ ...condensed, fontWeight: 600, letterSpacing: "0.04em" }}>By AUM</div>
          <div className="space-y-3">
            {[...clients].sort((a, b) => b.aum - a.aum).slice(0, 4).map((c) => (
              <div key={c.id} className="flex items-center justify-between">
                <div className="min-w-0">
                  <div className="text-sm text-foreground truncate" style={{ ...body, fontWeight: 500 }}>{c.name}</div>
                  <div className="text-[10px] text-muted-foreground" style={mono}>{c.id} · {c.advisor}</div>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <div className="text-sm text-foreground" style={mono}>{fmtCurrency(c.aum)}</div>
                  <div className="text-[10px]" style={{ ...mono, color: chartPos }}>+{fmt(c.ytd)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Portfolio View ───────────────────────────────────────────────────────────

function PortfolioView() {
  const totalValue = holdings.reduce((s, h) => s + h.value, 0);
  const { theme } = useApp();
  const chartPos = theme === "night" ? "#A0A050" : theme === "light" ? "#2E7D32" : "#7BC67E";

  return (
    <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Portfolio Value" value={fmtCurrency(totalValue)} delta="+18.74% YTD" positive />
        <MetricCard label="Positions" value={`${holdings.length}`} sub="Across 6 sectors" />
        <MetricCard label="Day Change" value="+$84,320" delta="+0.62% today" positive />
        <MetricCard label="Beta" value="0.91" sub="vs S&P 500" />
      </div>

      <div className="bg-card border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <Label>Holdings — Composite Portfolio</Label>
          <div className="flex gap-2 text-[10px] text-muted-foreground" style={mono}>
            <span>{holdings.length} positions</span><span>·</span><span className="text-foreground">{fmtCurrency(totalValue)}</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Ticker", "Name", "Sector", "Shares", "Price", "Mkt Value", "Day Chg", "Weight"].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] text-muted-foreground tracking-widest uppercase whitespace-nowrap" style={mono}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {holdings.map((h, i) => (
                <tr key={h.ticker} className={`border-b border-border hover:bg-muted/40 transition-colors cursor-pointer ${i % 2 !== 0 ? "bg-muted/10" : ""}`}>
                  <td className="px-5 py-3.5"><span className="text-primary font-bold" style={{ ...condensed, fontSize: "13px", letterSpacing: "0.08em" }}>{h.ticker}</span></td>
                  <td className="px-5 py-3.5 text-foreground whitespace-nowrap" style={{ ...body, fontWeight: 400 }}>{h.name}</td>
                  <td className="px-5 py-3.5"><span className="text-[10px] text-muted-foreground px-2 py-0.5 border border-border" style={mono}>{h.sector}</span></td>
                  <td className="px-5 py-3.5 text-foreground" style={{ ...mono, fontSize: "12px" }}>{h.shares.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-foreground" style={{ ...mono, fontSize: "12px" }}>${fmt(h.price)}</td>
                  <td className="px-5 py-3.5 text-foreground font-medium" style={{ ...mono, fontSize: "12px" }}>{fmtCurrency(h.value)}</td>
                  <td className="px-5 py-3.5">
                    <span className={`flex items-center gap-1 text-xs`} style={{ ...mono, color: h.change >= 0 ? chartPos : "var(--destructive)" }}>
                      {h.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {h.change >= 0 ? "+" : ""}{fmt(h.change)}%
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-muted overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${(h.weight / 12) * 100}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground" style={mono}>{fmt(h.weight)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Clients View ─────────────────────────────────────────────────────────────

function ClientsView() {
  const [selected, setSelected] = useState<string | null>(null);
  const { theme } = useApp();
  const chartPos = theme === "night" ? "#A0A050" : theme === "light" ? "#2E7D32" : "#7BC67E";

  return (
    <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Clients" value={`${clients.length}`} sub="7 accounts" />
        <MetricCard label="Total AUM" value={fmtCurrency(clients.reduce((s, c) => s + c.aum, 0))} delta="+12.4% YTD" positive />
        <MetricCard label="Avg. Return" value={`${fmt(clients.reduce((s, c) => s + c.ytd, 0) / clients.length)}%`} sub="YTD composite" />
        <MetricCard label="Under Review" value={`${clients.filter(c => c.status === "review").length}`} sub="Requires attention" />
      </div>

      <div className="bg-card border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <Label>Client Accounts</Label>
          <Btn variant="outline">+ NEW CLIENT</Btn>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Client ID", "Name", "Advisor", "AUM", "YTD", "Risk Profile", "Status", "Last Contact"].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] text-muted-foreground tracking-widest uppercase whitespace-nowrap" style={mono}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id} onClick={() => setSelected(selected === c.id ? null : c.id)}
                  className={`border-b border-border hover:bg-muted/40 transition-colors cursor-pointer ${selected === c.id ? "bg-primary/5 border-l-2 border-l-primary" : ""}`}
                >
                  <td className="px-5 py-3.5 text-muted-foreground" style={{ ...mono, fontSize: "11px" }}>{c.id}</td>
                  <td className="px-5 py-3.5 text-foreground font-medium whitespace-nowrap" style={body}>{c.name}</td>
                  <td className="px-5 py-3.5 text-muted-foreground whitespace-nowrap" style={{ ...body, fontSize: "12px" }}>{c.advisor}</td>
                  <td className="px-5 py-3.5 text-foreground" style={{ ...mono, fontSize: "12px" }}>{fmtCurrency(c.aum)}</td>
                  <td className="px-5 py-3.5 text-xs" style={{ ...mono, color: c.ytd >= 0 ? chartPos : "var(--destructive)" }}>
                    {c.ytd >= 0 ? "+" : ""}{fmt(c.ytd)}%
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground text-xs whitespace-nowrap" style={body}>{c.risk}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={c.status} /></td>
                  <td className="px-5 py-3.5 text-muted-foreground text-xs whitespace-nowrap" style={mono}>{c.lastContact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Transactions View ────────────────────────────────────────────────────────

function TransactionsView() {
  const [filter, setFilter] = useState("ALL");
  const filtered = filter === "ALL" ? transactions : filter === "PENDING" ? transactions.filter(t => t.status === "pending") : transactions.filter(t => t.type === filter);

  return (
    <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Today's Volume" value="$281,680" sub="6 transactions" />
        <MetricCard label="Buys" value="4" delta="+$495,700 notional" positive />
        <MetricCard label="Sells" value="3" delta="-$116,936 notional" />
        <MetricCard label="Pending" value="1" sub="Awaiting settlement" />
      </div>

      <div className="bg-card border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between flex-wrap gap-3">
          <Label>Transaction Ledger</Label>
          <div className="flex gap-1">
            {["ALL", "BUY", "SELL", "PENDING"].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`text-[10px] px-2.5 py-1 border tracking-widest transition-colors ${filter === f ? "border-primary text-primary bg-primary/10" : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40"}`}
                style={mono}>{f}</button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Ref.", "Date", "Client", "Type", "Ticker", "Shares", "Price", "Amount", "Status"].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] text-muted-foreground tracking-widest uppercase whitespace-nowrap" style={mono}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t, i) => (
                <tr key={t.id} className={`border-b border-border hover:bg-muted/40 transition-colors ${i % 2 !== 0 ? "bg-muted/10" : ""}`}>
                  <td className="px-5 py-3.5 text-muted-foreground" style={{ ...mono, fontSize: "11px" }}>{t.id}</td>
                  <td className="px-5 py-3.5 text-muted-foreground whitespace-nowrap" style={{ ...mono, fontSize: "11px" }}>{t.date}</td>
                  <td className="px-5 py-3.5 text-foreground whitespace-nowrap" style={{ ...body, fontSize: "12px" }}>{t.client}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[10px] px-2 py-0.5 border tracking-widest font-bold ${t.type === "BUY" ? "text-[var(--chart-pos)] border-[var(--chart-pos)]/30 bg-[var(--chart-pos)]/5" : "text-destructive border-destructive/30 bg-destructive/5"}`}
                      style={{ ...condensed, letterSpacing: "0.1em" }}>{t.type}</span>
                  </td>
                  <td className="px-5 py-3.5 text-primary font-bold" style={{ ...condensed, letterSpacing: "0.08em" }}>{t.ticker}</td>
                  <td className="px-5 py-3.5 text-foreground" style={{ ...mono, fontSize: "12px" }}>{t.shares.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-foreground" style={{ ...mono, fontSize: "12px" }}>${fmt(t.price)}</td>
                  <td className="px-5 py-3.5 text-foreground font-medium" style={{ ...mono, fontSize: "12px" }}>${t.amount.toLocaleString()}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={t.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Reports View ─────────────────────────────────────────────────────────────

function ReportsView() {
  const reports = [
    { title: "Q4 2024 Performance Report", date: "Dec 31, 2024", type: "Quarterly", status: "scheduled", size: "—" },
    { title: "Q3 2024 Performance Report", date: "Sep 30, 2024", type: "Quarterly", status: "published", size: "3.2 MB" },
    { title: "November 2024 Statement", date: "Nov 30, 2024", type: "Monthly", status: "published", size: "1.8 MB" },
    { title: "October 2024 Statement", date: "Oct 31, 2024", type: "Monthly", status: "published", size: "1.9 MB" },
    { title: "2024 Midyear Review", date: "Jun 30, 2024", type: "Semiannual", status: "published", size: "5.6 MB" },
    { title: "Risk Assessment — Stonegate", date: "Nov 15, 2024", type: "Custom", status: "published", size: "2.1 MB" },
    { title: "Tax-Loss Harvesting Summary", date: "Dec 15, 2024", type: "Custom", status: "draft", size: "—" },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Published" value="5" sub="This quarter" />
        <MetricCard label="Scheduled" value="1" sub="Q4 — Dec 31" />
        <MetricCard label="Drafts" value="1" sub="Pending review" />
        <MetricCard label="Last Generated" value="Dec 15" sub="Tax-Loss Harvest" />
      </div>
      <div className="bg-card border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <Label>Report Archive</Label>
          <Btn variant="outline">+ GENERATE REPORT</Btn>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {["Title", "Period", "Type", "Status", "Size", ""].map(h => (
                <th key={h} className="px-5 py-3 text-left text-[10px] text-muted-foreground tracking-widest uppercase" style={mono}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reports.map((r, i) => (
              <tr key={i} className="border-b border-border hover:bg-muted/40 transition-colors cursor-pointer">
                <td className="px-5 py-3.5 text-foreground" style={body}>{r.title}</td>
                <td className="px-5 py-3.5 text-muted-foreground whitespace-nowrap" style={{ ...mono, fontSize: "11px" }}>{r.date}</td>
                <td className="px-5 py-3.5"><span className="text-[10px] text-muted-foreground border border-border px-2 py-0.5 tracking-widest" style={mono}>{r.type.toUpperCase()}</span></td>
                <td className="px-5 py-3.5"><StatusBadge status={r.status} /></td>
                <td className="px-5 py-3.5 text-muted-foreground" style={{ ...mono, fontSize: "11px" }}>{r.size}</td>
                <td className="px-5 py-3.5">
                  {r.status === "published" && (
                    <button className="text-[10px] text-primary hover:underline flex items-center gap-1" style={mono}>
                      VIEW <ArrowUpRight className="w-2.5 h-2.5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Wallet / Fund Management Page ───────────────────────────────────────────

function WalletPage() {
  const { theme } = useApp();
  const primary = theme === "night" ? "#D4884C" : theme === "light" ? "#9A7A2C" : "#C9A84C";
  const chartPos = theme === "night" ? "#A0A050" : theme === "light" ? "#2E7D32" : "#7BC67E";
  const [modal, setModal] = useState<{ type: "deposit" | "withdraw"; fund: string } | null>(null);
  const [amount, setAmount] = useState("");
  const totalBalance = walletFunds.reduce((s, f) => s + f.balance, 0);

  return (
    <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 relative">
      {/* Header metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Wallet Balance" value={fmtCurrency(totalBalance)} delta="+14.2% MTD" positive className="lg:col-span-2" />
        <MetricCard label="Active Funds" value={`${walletFunds.length}`} sub="All performing" />
        <MetricCard label="Available Cash" value="$284,300" sub="Uninvested" />
      </div>

      {/* Fund cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <Label>Fund Holdings</Label>
            <div className="text-lg text-foreground mt-1" style={{ ...condensed, fontWeight: 600, letterSpacing: "0.04em" }}>Your Investments</div>
          </div>
          <Btn variant="outline"><Plus className="w-3.5 h-3.5" />SUBSCRIBE TO FUND</Btn>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {walletFunds.map((fund) => {
            const chartData = fund.chart.map((v, i) => ({ i, v }));
            const isPos = fund.change >= 0;
            const lineColor = isPos ? primary : "var(--destructive)";
            return (
              <div key={fund.id} className="bg-card border border-border p-5 hover:border-primary/40 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-[10px] text-muted-foreground tracking-widest mb-1" style={mono}>{fund.id} · {fund.type.toUpperCase()}</div>
                    <div className="text-base text-foreground" style={{ ...condensed, fontWeight: 600, letterSpacing: "0.04em" }}>{fund.name}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5" style={mono}>AUM: {fmtCurrency(fund.aum)} · Min: {fmtCurrency(fund.minInvest)} · {fund.risk}</div>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <div className="text-lg text-foreground" style={{ ...condensed, fontWeight: 700 }}>{fmtCurrency(fund.balance)}</div>
                    <div className={`text-xs flex items-center justify-end gap-1`} style={{ ...mono, color: isPos ? chartPos : "var(--destructive)" }}>
                      {isPos ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {isPos ? "+" : ""}{fmt(fund.change)}% today
                    </div>
                  </div>
                </div>

                <div className="h-16 mb-3">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <Line type="monotone" dataKey="v" stroke={lineColor} strokeWidth={1.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-[10px] text-muted-foreground" style={mono}>NAV: ${fmt(fund.nav)}</div>
                  <div className="flex gap-2">
                    <Btn variant="outline" onClick={() => setModal({ type: "deposit", fund: fund.name })}>
                      <Upload className="w-3 h-3" />DEPOSIT
                    </Btn>
                    <Btn variant="ghost" onClick={() => setModal({ type: "withdraw", fund: fund.name })}>
                      <Download className="w-3 h-3" />WITHDRAW
                    </Btn>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-card border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <Label>Recent Fund Activity</Label>
          <button className="text-[10px] text-primary flex items-center gap-1" style={mono}>ALL HISTORY <ChevronRight className="w-3 h-3" /></button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {["Date", "Fund", "Type", "Amount", "Status"].map(h => (
                <th key={h} className="px-5 py-3 text-left text-[10px] text-muted-foreground tracking-widest uppercase" style={mono}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { date: "Dec 23, 2024", fund: "Meridian Equity Fund", type: "Subscription", amount: 500000, status: "completed" },
              { date: "Dec 18, 2024", fund: "Meridian Fixed Income", type: "Redemption", amount: 75000, status: "completed" },
              { date: "Dec 12, 2024", fund: "Meridian Alternatives", type: "Subscription", amount: 250000, status: "completed" },
              { date: "Dec 5, 2024", fund: "Meridian Balanced", type: "Dividend", amount: 12440, status: "completed" },
            ].map((row, i) => (
              <tr key={i} className="border-b border-border hover:bg-muted/40 transition-colors">
                <td className="px-5 py-3.5 text-muted-foreground" style={{ ...mono, fontSize: "11px" }}>{row.date}</td>
                <td className="px-5 py-3.5 text-foreground" style={body}>{row.fund}</td>
                <td className="px-5 py-3.5">
                  <span className={`text-[10px] px-2 py-0.5 border tracking-widest ${row.type === "Subscription" ? "text-primary border-primary/30 bg-primary/5" : row.type === "Dividend" ? "text-[#4A9EBF] border-[#4A9EBF]/30" : "text-muted-foreground border-border"}`}
                    style={mono}>{row.type.toUpperCase()}</span>
                </td>
                <td className="px-5 py-3.5 text-foreground" style={{ ...mono, fontSize: "12px" }}>${row.amount.toLocaleString()}</td>
                <td className="px-5 py-3.5"><StatusBadge status={row.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setModal(null)}>
          <div className="bg-card border border-border p-6 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-[10px] text-muted-foreground tracking-widest uppercase mb-1" style={mono}>{modal.type}</div>
                <div className="text-lg text-foreground" style={{ ...condensed, fontWeight: 700 }}>{modal.type === "deposit" ? "Add Funds" : "Withdraw Funds"}</div>
              </div>
              <button onClick={() => setModal(null)} className="text-muted-foreground hover:text-foreground"><X className="w-4 h-4" /></button>
            </div>
            <div className="text-xs text-muted-foreground mb-4 pb-4 border-b border-border" style={mono}>{modal.fund}</div>
            <div className="space-y-4">
              <Input label="Amount (USD)" placeholder="Enter amount..." value={amount} onChange={setAmount} icon={CreditCard} />
              <div className="grid grid-cols-3 gap-2">
                {["10,000", "50,000", "100,000"].map(v => (
                  <button key={v} onClick={() => setAmount(v)}
                    className="text-[10px] py-2 border border-border text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors" style={mono}>
                    ${v}
                  </button>
                ))}
              </div>
              <Btn variant="primary" className="w-full justify-center" onClick={() => setModal(null)}>
                {modal.type === "deposit" ? "CONFIRM DEPOSIT" : "CONFIRM WITHDRAWAL"}
              </Btn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Payment Page ─────────────────────────────────────────────────────────────

function PaymentPage() {
  const [step, setStep] = useState<"form" | "review" | "success">("form");
  const [payTo, setPayTo] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Wire Transfer");
  const [reference, setReference] = useState("");

  const methods = ["Wire Transfer", "ACH Transfer", "Fund Subscription", "Internal Transfer"];

  return (
    <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Sent This Month" value="$1.46M" sub="6 transactions" />
        <MetricCard label="Pending" value="$37,982" sub="1 awaiting settlement" />
        <MetricCard label="Avg. Processing" value="1.4 days" sub="Wire transfers" />
        <MetricCard label="Available Balance" value="$284,300" sub="Cleared funds" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Send payment form */}
        <div className="lg:col-span-2 bg-card border border-border p-6">
          <Label>New Payment</Label>
          <div className="text-lg text-foreground mt-1 mb-6" style={{ ...condensed, fontWeight: 700 }}>Send Funds</div>

          {step === "form" && (
            <div className="space-y-4">
              <Input label="Pay To" placeholder="Client name or account..." value={payTo} onChange={setPayTo} icon={User} />
              <Input label="Amount (USD)" placeholder="0.00" value={amount} onChange={setAmount} icon={CreditCard} />
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-muted-foreground tracking-widest uppercase" style={mono}>Payment Method</label>
                <div className="space-y-1">
                  {methods.map(m => (
                    <button key={m} onClick={() => setMethod(m)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 border transition-colors text-left text-sm ${method === m ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"}`}
                      style={body}
                    >
                      <div className={`w-3 h-3 border flex items-center justify-center ${method === m ? "border-primary" : "border-muted-foreground"}`}>
                        {method === m && <div className="w-1.5 h-1.5 bg-primary" />}
                      </div>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <Input label="Reference / Notes" placeholder="Optional memo..." value={reference} onChange={setReference} />
              <Btn variant="primary" className="w-full justify-center" onClick={() => setStep("review")} disabled={!payTo || !amount}>
                REVIEW PAYMENT <ArrowRight className="w-3.5 h-3.5" />
              </Btn>
            </div>
          )}

          {step === "review" && (
            <div className="space-y-4">
              <div className="bg-muted border border-border p-4 space-y-3">
                {[["To", payTo], ["Amount", `$${parseFloat(amount.replace(/,/g, "")).toLocaleString()}`], ["Method", method], ["Reference", reference || "—"]].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm">
                    <span className="text-muted-foreground" style={mono}>{k}</span>
                    <span className="text-foreground font-medium" style={body}>{v}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-start gap-2 p-3 border border-primary/20 bg-primary/5">
                <AlertCircle className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                <p className="text-[11px] text-muted-foreground" style={mono}>Please verify all details before confirming. Wire transfers are typically irreversible.</p>
              </div>
              <div className="flex gap-2">
                <Btn variant="ghost" onClick={() => setStep("form")} className="flex-1 justify-center">BACK</Btn>
                <Btn variant="primary" onClick={() => setStep("success")} className="flex-1 justify-center">CONFIRM</Btn>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 bg-primary/10 border border-primary/40 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6 text-primary" />
              </div>
              <div className="text-lg text-foreground" style={{ ...condensed, fontWeight: 700 }}>Payment Initiated</div>
              <p className="text-sm text-muted-foreground" style={body}>Your payment has been submitted and is being processed.</p>
              <div className="text-[10px] text-muted-foreground" style={mono}>REF: PAY-{Date.now().toString().slice(-4)}</div>
              <Btn variant="outline" className="w-full justify-center" onClick={() => { setStep("form"); setPayTo(""); setAmount(""); setReference(""); }}>
                NEW PAYMENT
              </Btn>
            </div>
          )}
        </div>

        {/* Payment history */}
        <div className="lg:col-span-3 bg-card border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border flex items-center justify-between">
            <Label>Payment History</Label>
            <button className="text-[10px] text-primary flex items-center gap-1" style={mono}>EXPORT <Download className="w-3 h-3" /></button>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Ref.", "Date", "Recipient", "Method", "Amount", "Status"].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[10px] text-muted-foreground tracking-widest uppercase whitespace-nowrap" style={mono}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paymentHistory.map((p, i) => (
                <tr key={p.id} className={`border-b border-border hover:bg-muted/40 transition-colors ${i % 2 !== 0 ? "bg-muted/10" : ""}`}>
                  <td className="px-5 py-3.5 text-muted-foreground" style={{ ...mono, fontSize: "11px" }}>{p.id}</td>
                  <td className="px-5 py-3.5 text-muted-foreground whitespace-nowrap" style={{ ...mono, fontSize: "11px" }}>{p.date}</td>
                  <td className="px-5 py-3.5 text-foreground whitespace-nowrap" style={{ ...body, fontSize: "12px" }}>{p.to}</td>
                  <td className="px-5 py-3.5 text-muted-foreground whitespace-nowrap" style={{ ...body, fontSize: "12px" }}>{p.method}</td>
                  <td className="px-5 py-3.5 text-foreground font-medium" style={{ ...mono, fontSize: "12px" }}>${p.amount.toLocaleString()}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── App Shell (Dashboard wrapper) ───────────────────────────────────────────

const viewMeta: Record<string, { title: string; subtitle: string }> = {
  dashboard: { title: "Overview", subtitle: "DEC 23, 2024  ·  COMPOSITE PORTFOLIO" },
  portfolio: { title: "Portfolio", subtitle: "COMPOSITE HOLDINGS  ·  ALL ACCOUNTS" },
  clients: { title: "Clients", subtitle: "ACCOUNT MANAGEMENT  ·  7 ACCOUNTS" },
  transactions: { title: "Transactions", subtitle: "TRADE LEDGER  ·  Q4 2024" },
  reports: { title: "Reports", subtitle: "PERFORMANCE REPORTING" },
};

function AppShell({ subview, onNav }: { subview: string; onNav: (v: string) => void }) {
  const meta = viewMeta[subview] ?? { title: "Dashboard", subtitle: "" };
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <Sidebar active={subview} onNav={onNav} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar title={meta.title} subtitle={meta.subtitle} />
        <div className="flex-1 overflow-hidden flex flex-col">
          {subview === "dashboard" && <DashboardView />}
          {subview === "portfolio" && <PortfolioView />}
          {subview === "clients" && <ClientsView />}
          {subview === "transactions" && <TransactionsView />}
          {subview === "reports" && <ReportsView />}
        </div>
      </div>
    </div>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────

function HomePage() {
  const { navigate, theme } = useApp();
  const primary = theme === "night" ? "#D4884C" : theme === "light" ? "#9A7A2C" : "#C9A84C";

  const stats = [
    { value: "$84.2B", label: "Assets Under Management" },
    { value: "312", label: "Institutional Clients" },
    { value: "18.74%", label: "Average YTD Return" },
    { value: "24 yrs", label: "Years of Excellence" },
  ];

  const services = [
    { icon: BarChart2, title: "Equity Management", desc: "Actively managed equity portfolios targeting long-term capital appreciation across global markets." },
    { icon: Shield, title: "Fixed Income", desc: "Precision-crafted bond portfolios balancing yield with duration risk across sovereign and corporate debt." },
    { icon: Globe, title: "Alternative Investments", desc: "Access to hedge funds, private equity, real assets, and infrastructure unavailable to retail investors." },
    { icon: Building2, title: "Wealth Planning", desc: "Integrated estate, tax, and succession planning for families and institutional endowments." },
  ];

  return (
    <div className="min-h-screen bg-background" style={body}>
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-40 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-primary flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary-foreground" strokeWidth={2} />
            </div>
            <div>
              <div className="text-sm font-bold text-foreground" style={{ ...condensed, letterSpacing: "0.15em" }}>MERIDIAN</div>
              <div className="text-[9px] text-muted-foreground" style={mono}>ASSET MANAGEMENT</div>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            {["Services", "Performance", "About", "Insights"].map(item => (
              <a key={item} href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors" style={{ ...condensed, letterSpacing: "0.06em" }}>{item.toUpperCase()}</a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            <Btn variant="ghost" onClick={() => navigate("login")}>LOG IN</Btn>
            <Btn variant="primary" onClick={() => navigate("signup")}>OPEN ACCOUNT</Btn>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-24 px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="text-[10px] text-muted-foreground tracking-widest mb-6 flex items-center gap-2" style={mono}>
              <span className="w-8 h-px bg-primary inline-block" />
              REGULATED · SEC & FINRA REGISTERED
            </div>
            <h1 className="leading-none mb-6" style={{ ...condensed, fontWeight: 700, fontSize: "clamp(2.5rem, 5vw, 4.5rem)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
              <span className="text-foreground">Capital</span><br />
              <span className="text-foreground">Managed</span><br />
              <span style={{ color: primary }}>With</span>{" "}
              <span className="text-foreground">Precision</span>
            </h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-lg leading-relaxed" style={{ fontWeight: 300 }}>
              Meridian delivers institutional-grade investment management to family offices, endowments, and high-net-worth individuals. Rigorous process. Exceptional outcomes.
            </p>
            <div className="flex flex-wrap gap-3">
              <Btn variant="primary" onClick={() => navigate("signup")} className="px-6 py-3 text-sm">
                OPEN AN ACCOUNT <ArrowRight className="w-4 h-4" />
              </Btn>
              <Btn variant="outline" onClick={() => navigate("login")} className="px-6 py-3 text-sm">
                CLIENT LOGIN
              </Btn>
            </div>
          </div>

          {/* Stats panel */}
          <div className="grid grid-cols-2 gap-3">
            {stats.map((s) => (
              <div key={s.label} className="bg-card border border-border p-6">
                <div className="text-3xl text-foreground mb-1" style={{ ...condensed, fontWeight: 700, color: primary }}>{s.value}</div>
                <div className="text-xs text-muted-foreground" style={mono}>{s.label.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ticker */}
      <div className="border-y border-border bg-muted/30 py-3 overflow-hidden">
        <div className="flex gap-8 animate-none whitespace-nowrap text-[11px] text-muted-foreground px-8 overflow-x-auto" style={mono}>
          {[
            { t: "AAPL", v: "+2.34%" }, { t: "MSFT", v: "+1.12%" }, { t: "NVDA", v: "+4.21%" },
            { t: "JPM", v: "-0.83%" }, { t: "V", v: "+1.67%" }, { t: "BRK.B", v: "+0.45%" },
            { t: "SPX", v: "+0.78%" }, { t: "NDX", v: "+1.02%" }, { t: "GOLD", v: "+0.74%" },
            { t: "TLT", v: "-0.18%" }, { t: "DXY", v: "+0.22%" },
          ].map(({ t, v }) => (
            <span key={t} className="shrink-0">
              <span className="text-foreground mr-1.5">{t}</span>
              <span style={{ color: v.startsWith("+") ? primary : "var(--destructive)" }}>{v}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Services */}
      <section className="py-24 px-8 max-w-7xl mx-auto">
        <div className="mb-12">
          <div className="text-[10px] text-muted-foreground tracking-widest mb-3 flex items-center gap-2" style={mono}>
            <span className="w-8 h-px bg-primary inline-block" />OUR SERVICES
          </div>
          <h2 style={{ ...condensed, fontWeight: 700, fontSize: "2.5rem", letterSpacing: "0.04em", textTransform: "uppercase" }} className="text-foreground">
            Institutional-Grade<br />Investment Solutions
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-card border border-border p-6 hover:border-primary/50 transition-colors group">
              <div className="w-10 h-10 bg-primary/10 border border-primary/30 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
              </div>
              <h3 className="text-foreground mb-2" style={{ ...condensed, fontWeight: 600, fontSize: "1.1rem", letterSpacing: "0.04em" }}>{title.toUpperCase()}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed" style={{ fontWeight: 300 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-8 border-t border-border">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-[10px] text-muted-foreground tracking-widest mb-4" style={mono}>BEGIN YOUR JOURNEY</div>
          <h2 style={{ ...condensed, fontWeight: 700, fontSize: "2.5rem", letterSpacing: "0.04em", textTransform: "uppercase" }} className="text-foreground mb-4">
            Ready to invest with conviction?
          </h2>
          <p className="text-muted-foreground mb-8" style={{ fontWeight: 300 }}>Join over 300 institutional and private clients who trust Meridian to manage their most important capital.</p>
          <div className="flex justify-center gap-3 flex-wrap">
            <Btn variant="primary" onClick={() => navigate("signup")} className="px-8 py-3 text-sm">
              OPEN AN ACCOUNT <ArrowRight className="w-4 h-4" />
            </Btn>
            <Btn variant="outline" onClick={() => navigate("app")} className="px-8 py-3 text-sm">
              VIEW PLATFORM DEMO
            </Btn>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-primary flex items-center justify-center">
                <Shield className="w-3.5 h-3.5 text-primary-foreground" strokeWidth={2} />
              </div>
              <span className="text-sm font-bold text-foreground" style={{ ...condensed, letterSpacing: "0.12em" }}>MERIDIAN</span>
            </div>
            <p className="text-[10px] text-muted-foreground max-w-xs" style={mono}>
              Meridian Asset Management LLC is registered with the SEC as an investment adviser. Past performance does not guarantee future results.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-8 text-[11px]" style={mono}>
            {[
              { title: "Platform", links: ["Dashboard", "Portfolio", "Clients", "Reports"] },
              { title: "Company", links: ["About", "Team", "Careers", "Press"] },
              { title: "Legal", links: ["Privacy", "Terms", "Disclosures", "ADV Form"] },
            ].map(col => (
              <div key={col.title}>
                <div className="text-foreground tracking-widest mb-3">{col.title.toUpperCase()}</div>
                {col.links.map(l => (
                  <div key={l} className="text-muted-foreground hover:text-foreground cursor-pointer mb-1.5 transition-colors">{l}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Login Page ───────────────────────────────────────────────────────────────

function LoginPage() {
  const { navigate } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); navigate("app"); }, 1200);
  };

  return (
    <div className="min-h-screen bg-background flex" style={body}>
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 border-r border-border bg-card relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "repeating-linear-gradient(0deg, currentColor, currentColor 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, currentColor, currentColor 1px, transparent 1px, transparent 40px)",
          color: "var(--foreground)"
        }} />
        <div className="relative flex items-center gap-2.5">
          <div className="w-7 h-7 bg-primary flex items-center justify-center">
            <Shield className="w-4 h-4 text-primary-foreground" strokeWidth={2} />
          </div>
          <div>
            <div className="text-sm font-bold text-foreground" style={{ ...condensed, letterSpacing: "0.15em" }}>MERIDIAN</div>
            <div className="text-[9px] text-muted-foreground" style={mono}>ASSET MANAGEMENT</div>
          </div>
        </div>
        <div className="relative">
          <div className="text-[10px] text-muted-foreground tracking-widest mb-4 flex items-center gap-2" style={mono}>
            <span className="w-8 h-px bg-primary inline-block" />CLIENT PORTAL
          </div>
          <h2 style={{ ...condensed, fontWeight: 700, fontSize: "2.8rem", letterSpacing: "0.04em", textTransform: "uppercase", lineHeight: 1.1 }} className="text-foreground mb-4">
            Your portfolio.<br /><span className="text-primary">Anywhere.</span>
          </h2>
          <p className="text-muted-foreground" style={{ fontWeight: 300 }}>Access real-time performance data, review your allocations, and communicate with your advisor — all in one secure place.</p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              { label: "Bank-grade security", icon: Lock },
              { label: "Real-time data", icon: RefreshCw },
              { label: "Multi-account view", icon: Briefcase },
              { label: "24/7 access", icon: Globe },
            ].map(({ label, icon: Icon }) => (
              <div key={label} className="flex items-center gap-2 text-xs text-muted-foreground" style={mono}>
                <Icon className="w-3.5 h-3.5 text-primary shrink-0" strokeWidth={1.5} />{label}
              </div>
            ))}
          </div>
        </div>
        <div className="relative text-[10px] text-muted-foreground" style={mono}>
          © 2024 Meridian Asset Management LLC · SEC Registered
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="w-7 h-7 bg-primary flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary-foreground" strokeWidth={2} />
            </div>
            <span className="text-sm font-bold text-foreground" style={{ ...condensed, letterSpacing: "0.15em" }}>MERIDIAN</span>
          </div>

          <div className="mb-8">
            <h1 style={{ ...condensed, fontWeight: 700, fontSize: "2rem", letterSpacing: "0.06em", textTransform: "uppercase" }} className="text-foreground mb-1">
              Sign In
            </h1>
            <p className="text-sm text-muted-foreground" style={{ fontWeight: 300 }}>Welcome back. Please enter your credentials.</p>
          </div>

          <div className="space-y-4">
            <Input label="Email Address" type="email" placeholder="you@firm.com" value={email} onChange={setEmail} icon={Mail} />
            <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={setPassword} icon={Lock} />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <div className="w-4 h-4 border border-border bg-input-background flex items-center justify-center">
                  <div className="w-2 h-2 bg-primary opacity-0" />
                </div>
                <span className="text-xs text-muted-foreground" style={mono}>REMEMBER ME</span>
              </label>
              <button className="text-xs text-primary hover:underline" style={mono}>FORGOT PASSWORD?</button>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading || !email || !password}
              className="w-full py-3 bg-primary text-primary-foreground text-sm tracking-widest disabled:opacity-40 hover:opacity-90 transition-all flex items-center justify-center gap-2"
              style={condensed}
            >
              {loading ? (
                <><RefreshCw className="w-4 h-4 animate-spin" />SIGNING IN...</>
              ) : (
                <>SIGN IN <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-xs text-muted-foreground" style={mono}>
              DON'T HAVE AN ACCOUNT?{" "}
              <button onClick={() => navigate("signup")} className="text-primary hover:underline">OPEN ACCOUNT</button>
            </p>
          </div>

          <div className="mt-6 flex justify-center">
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Signup Page ──────────────────────────────────────────────────────────────

function SignupPage() {
  const { navigate } = useApp();
  const [step, setStep] = useState(1);
  const [accountType, setAccountType] = useState("individual");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firm, setFirm] = useState("");
  const [loading, setLoading] = useState(false);

  const steps = [
    { n: 1, label: "Account Type" },
    { n: 2, label: "Your Details" },
    { n: 3, label: "Security" },
  ];

  const handleFinish = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); navigate("app"); }, 1400);
  };

  return (
    <div className="min-h-screen bg-background flex" style={body}>
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-2/5 flex-col justify-between p-12 border-r border-border bg-card relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.025]" style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
          backgroundSize: "24px 24px", color: "var(--foreground)"
        }} />
        <div className="relative flex items-center gap-2.5">
          <div className="w-7 h-7 bg-primary flex items-center justify-center">
            <Shield className="w-4 h-4 text-primary-foreground" strokeWidth={2} />
          </div>
          <div>
            <div className="text-sm font-bold text-foreground" style={{ ...condensed, letterSpacing: "0.15em" }}>MERIDIAN</div>
            <div className="text-[9px] text-muted-foreground" style={mono}>ASSET MANAGEMENT</div>
          </div>
        </div>

        <div className="relative">
          <div className="text-[10px] text-muted-foreground tracking-widest mb-4 flex items-center gap-2" style={mono}>
            <span className="w-8 h-px bg-primary inline-block" />ONBOARDING
          </div>
          <h2 style={{ ...condensed, fontWeight: 700, fontSize: "2.5rem", letterSpacing: "0.04em", textTransform: "uppercase", lineHeight: 1.1 }} className="text-foreground mb-4">
            Start building<br /><span className="text-primary">wealth</span> today.
          </h2>
          <div className="space-y-4 mt-8">
            {steps.map(({ n, label }) => (
              <div key={n} className={`flex items-center gap-3 ${step >= n ? "text-foreground" : "text-muted-foreground"}`}>
                <div className={`w-6 h-6 border flex items-center justify-center text-xs shrink-0 transition-colors ${step > n ? "bg-primary border-primary text-primary-foreground" : step === n ? "border-primary text-primary" : "border-border"}`} style={mono}>
                  {step > n ? <Check className="w-3 h-3" /> : n}
                </div>
                <span className="text-sm" style={condensed}>{label.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative text-[10px] text-muted-foreground" style={mono}>
          © 2024 Meridian Asset Management LLC
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="text-[10px] text-muted-foreground mb-2" style={mono}>STEP {step} OF {steps.length}</div>
            <h1 style={{ ...condensed, fontWeight: 700, fontSize: "1.8rem", letterSpacing: "0.06em", textTransform: "uppercase" }} className="text-foreground mb-1">
              {steps[step - 1].label}
            </h1>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4" style={{ fontWeight: 300 }}>Select the account type that best describes you.</p>
              {[
                { id: "individual", title: "Individual / Family", desc: "Personal investment account or family office", icon: User },
                { id: "institutional", title: "Institutional", desc: "Endowment, foundation, pension, or corporate", icon: Building2 },
                { id: "advisor", title: "Financial Advisor", desc: "RIA or advisor managing client assets", icon: Briefcase },
              ].map(({ id, title, desc, icon: Icon }) => (
                <button key={id} onClick={() => setAccountType(id)}
                  className={`w-full flex items-center gap-4 p-4 border text-left transition-colors ${accountType === id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}
                >
                  <div className={`w-10 h-10 border flex items-center justify-center shrink-0 ${accountType === id ? "border-primary bg-primary/10" : "border-border"}`}>
                    <Icon className={`w-4 h-4 ${accountType === id ? "text-primary" : "text-muted-foreground"}`} strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="text-sm text-foreground" style={{ ...condensed, fontWeight: 600, letterSpacing: "0.04em" }}>{title.toUpperCase()}</div>
                    <div className="text-xs text-muted-foreground mt-0.5" style={mono}>{desc}</div>
                  </div>
                  {accountType === id && <Check className="w-4 h-4 text-primary ml-auto shrink-0" />}
                </button>
              ))}
              <Btn variant="primary" className="w-full justify-center mt-2" onClick={() => setStep(2)}>
                CONTINUE <ArrowRight className="w-4 h-4" />
              </Btn>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2"><Input label="Full Name" placeholder="Margaret Okafor" value={name} onChange={setName} icon={User} /></div>
                <div className="col-span-2"><Input label="Email Address" type="email" placeholder="m.okafor@firm.com" value={email} onChange={setEmail} icon={Mail} /></div>
                {accountType !== "individual" && (
                  <div className="col-span-2"><Input label="Firm / Organization" placeholder="Firm name..." value={firm} onChange={setFirm} icon={Building2} /></div>
                )}
              </div>
              <div className="flex gap-3 mt-2">
                <Btn variant="ghost" onClick={() => setStep(1)} className="flex-1 justify-center">BACK</Btn>
                <Btn variant="primary" onClick={() => setStep(3)} disabled={!name || !email} className="flex-1 justify-center">
                  CONTINUE <ArrowRight className="w-4 h-4" />
                </Btn>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <Input label="Create Password" type="password" placeholder="Minimum 12 characters" value={password} onChange={setPassword} icon={Lock} />
              <div className="grid grid-cols-4 gap-1">
                {["8+ chars", "Uppercase", "Number", "Symbol"].map((req, i) => {
                  const met = i === 0 ? password.length >= 8 : i === 1 ? /[A-Z]/.test(password) : i === 2 ? /\d/.test(password) : /[!@#$%]/.test(password);
                  return (
                    <div key={req} className={`text-[10px] px-2 py-1 border text-center ${met ? "border-primary/40 text-primary bg-primary/5" : "border-border text-muted-foreground"}`} style={mono}>{req}</div>
                  );
                })}
              </div>
              <div className="p-4 bg-muted border border-border text-xs text-muted-foreground" style={mono}>
                By creating an account, you agree to our Terms of Service and Privacy Policy. Meridian is SEC registered (CRD# 284471).
              </div>
              <div className="flex gap-3 mt-2">
                <Btn variant="ghost" onClick={() => setStep(2)} className="flex-1 justify-center">BACK</Btn>
                <button onClick={handleFinish} disabled={loading || password.length < 8}
                  className="flex-1 py-2.5 bg-primary text-primary-foreground text-xs tracking-widest disabled:opacity-40 hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  style={condensed}
                >
                  {loading ? <><RefreshCw className="w-4 h-4 animate-spin" />CREATING...</> : <>CREATE ACCOUNT <Check className="w-4 h-4" /></>}
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-xs text-muted-foreground" style={mono}>
              ALREADY HAVE AN ACCOUNT?{" "}
              <button onClick={() => navigate("login")} className="text-primary hover:underline">SIGN IN</button>
            </p>
          </div>

          <div className="mt-6 flex justify-center">
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Wallet + Payment App Shells ──────────────────────────────────────────────

function FinancePage({ view }: { view: "wallet" | "payment" }) {
  const { navigate } = useApp();
  const titles = { wallet: { title: "Wallet", subtitle: "FUND MANAGEMENT  ·  DEC 2024" }, payment: { title: "Payments", subtitle: "FUND TRANSFERS  ·  DEC 2024" } };
  const [subview, setSubview] = useState("dashboard");

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <Sidebar active={view} onNav={(v) => {
        if (v === "wallet" || v === "payment") navigate(v);
        else { navigate("app", v); }
      }} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar title={titles[view].title} subtitle={titles[view].subtitle} />
        <div className="flex-1 overflow-hidden flex flex-col">
          {view === "wallet" && <WalletPage />}
          {view === "payment" && <PaymentPage />}
        </div>
      </div>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [focusMode, setFocusMode] = useState(false);
  const [currentPage, setCurrentPage] = useState<NavPage>("home");
  const [currentSubview, setCurrentSubview] = useState("dashboard");

  const navigate = (page: NavPage, subview = "dashboard") => {
    setCurrentPage(page);
    if (subview) setCurrentSubview(subview);
  };

  const ctx: AppContext = { theme, setTheme, focusMode, setFocusMode, navigate, currentPage, currentSubview };

  return (
    <Ctx.Provider value={ctx}>
      <div
        style={themes[theme] as React.CSSProperties}
        className="size-full"
      >
        {currentPage === "home" && <HomePage />}
        {currentPage === "login" && <LoginPage />}
        {currentPage === "signup" && <SignupPage />}
        {currentPage === "app" && (
          <AppShell
            subview={currentSubview}
            onNav={(v) => {
              if (v === "wallet" || v === "payment") navigate(v as NavPage);
              else setCurrentSubview(v);
            }}
          />
        )}
        {currentPage === "wallet" && <FinancePage view="wallet" />}
        {currentPage === "payment" && <FinancePage view="payment" />}
      </div>
    </Ctx.Provider>
  );
}
