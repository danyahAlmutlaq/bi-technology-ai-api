"use client";

import { useState } from "react";
import {
  Package,
  Truck,
  ReceiptText,
  LogOut,
  Lock,
  Mail as MailIcon,
  CheckCircle2,
  Clock3,
  MapPin,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  CircleDollarSign,
  FileCheck2,
  Landmark,
  Warehouse,
} from "lucide-react";

const API_BASE_URL = "/backend";

interface CustomerInfo {
  customer_id: number;
  customer_name: string;
  email: string;
}

interface OrderItem {
  id: number;
  order_number: string;
  title: string;
  status: string;
  amount: number;
  due_date: string | null;
}

interface ShipmentItem {
  id: number;
  tracking_number: string | null;
  status: string;
  service_type: string | null;
  shipping_cost: number;
}

interface InvoiceItem {
  id: number;
  invoice_number: string;
  amount: number;
  tax_amount: number;
  total: number;
  status: string;
  created_at: string;
}

function formatCurrency(value: number): string {
  return `${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ر.س`;
}

const statusMeta: Record<string, { label: string; tone: string; icon: typeof CheckCircle2 }> = {
  pending_approval: { label: "بانتظار الموافقة", tone: "bg-amber-50 text-amber-700 ring-amber-100", icon: Clock3 },
  new: { label: "جديد", tone: "bg-sky-50 text-sky-700 ring-sky-100", icon: Sparkles },
  in_progress: { label: "قيد التنفيذ", tone: "bg-blue-50 text-blue-700 ring-blue-100", icon: Clock3 },
  completed: { label: "مكتمل", tone: "bg-emerald-50 text-emerald-700 ring-emerald-100", icon: CheckCircle2 },
  pending: { label: "قيد الانتظار", tone: "bg-amber-50 text-amber-700 ring-amber-100", icon: Clock3 },
  in_transit: { label: "في الطريق", tone: "bg-blue-50 text-blue-700 ring-blue-100", icon: Truck },
  customs: { label: "لدى الجمارك", tone: "bg-violet-50 text-violet-700 ring-violet-100", icon: Landmark },
  warehouse: { label: "في المستودع", tone: "bg-indigo-50 text-indigo-700 ring-indigo-100", icon: Warehouse },
  departed: { label: "غادرت بلد المنشأ", tone: "bg-blue-50 text-blue-700 ring-blue-100", icon: Truck },
  arrived_port: { label: "وصلت منفذ الوصول", tone: "bg-sky-50 text-sky-700 ring-sky-100", icon: Landmark },
  customs_pending: { label: "بانتظار التخليص الجمركي", tone: "bg-violet-50 text-violet-700 ring-violet-100", icon: Landmark },
  customs_cleared: { label: "تم التخليص الجمركي", tone: "bg-violet-50 text-violet-700 ring-violet-100", icon: CheckCircle2 },
  dispatched: { label: "تم الإرسال", tone: "bg-blue-50 text-blue-700 ring-blue-100", icon: Truck },
  delivered: { label: "تم التسليم", tone: "bg-emerald-50 text-emerald-700 ring-emerald-100", icon: CheckCircle2 },
  failed: { label: "فشل التسليم", tone: "bg-red-50 text-red-700 ring-red-100", icon: AlertTriangle },
  draft: { label: "مسودة", tone: "bg-slate-100 text-slate-600 ring-slate-200", icon: FileCheck2 },
  paid: { label: "مدفوعة", tone: "bg-emerald-50 text-emerald-700 ring-emerald-100", icon: CheckCircle2 },
  sent: { label: "مرسلة", tone: "bg-blue-50 text-blue-700 ring-blue-100", icon: MailIcon },
};

function getStatusMeta(status: string) {
  return statusMeta[status] ?? { label: status, tone: "bg-slate-100 text-slate-600 ring-slate-200", icon: Clock3 };
}

const domesticSteps = [
  { key: "pending", label: "استلام الطلب", icon: Package },
  { key: "customs", label: "الجمارك", icon: Landmark },
  { key: "warehouse", label: "المستودع", icon: Warehouse },
  { key: "in_transit", label: "التوصيل", icon: Truck },
  { key: "delivered", label: "تم التسليم", icon: CheckCircle2 },
];

const internationalSteps = [
  { key: "pending", label: "تم الحجز", icon: Package },
  { key: "departed", label: "غادرت المنشأ", icon: Truck },
  { key: "in_transit", label: "في الطريق", icon: Truck },
  { key: "arrived_port", label: "وصلت المنفذ", icon: Landmark },
  { key: "customs_pending", label: "التخليص الجمركي", icon: Landmark },
  { key: "customs_cleared", label: "تم التخليص", icon: CheckCircle2 },
  { key: "delivered", label: "تم التسليم", icon: CheckCircle2 },
];

function getShipmentSteps(serviceType: string | null) {
  return serviceType === "international" ? internationalSteps : domesticSteps;
}

function shipmentStepIndex(status: string, steps: typeof domesticSteps): number {
  const idx = steps.findIndex((s) => s.key === status);
  return idx === -1 ? 0 : idx;
}

function StatusBadge({ status }: { status: string }) {
  const meta = getStatusMeta(status);
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold ring-1 ${meta.tone}`}>
      <Icon size={12} /> {meta.label}
    </span>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  tone,
  gradient,
}: {
  label: string;
  value: string;
  icon: typeof CheckCircle2;
  tone: string;
  gradient: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border p-5 shadow-sm bg-gradient-to-br ${gradient}`} style={{ animation: "cardFloat 4s ease-in-out infinite" }}>
      <Icon className="pointer-events-none absolute -left-2 -bottom-2 opacity-10" size={64} />
      <div className={`relative inline-flex h-10 w-10 items-center justify-center rounded-xl ${tone}`}>
        <Icon size={18} />
      </div>
      <p className="relative mt-3 text-[11px] font-bold text-slate-500">{label}</p>
      <p className="relative mt-1 text-[18px] font-black text-slate-900">{value}</p>
    </div>
  );
}

const journeyKeyframes = `
@keyframes truckBounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
@keyframes roadDash { from { transform: translateX(0); } to { transform: translateX(-40px); } }
@keyframes cloudDriftA { from { transform: translateX(-8px); } to { transform: translateX(8px); } }
@keyframes cloudDriftB { from { transform: translateX(8px); } to { transform: translateX(-8px); } }
@keyframes stampDown { 0%,100% { transform: translateY(-12px); } 50% { transform: translateY(4px); } }
@keyframes boxBob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
@keyframes boxBobDelay1 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
@keyframes boxBobDelay2 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
@keyframes sparkPulse { 0%,100% { opacity: .25; transform: scale(.75); } 50% { opacity: 1; transform: scale(1.15); } }
@keyframes popIn { 0% { transform: scale(0); opacity: 0; } 70% { transform: scale(1.15); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
@keyframes confettiFall { 0% { transform: translateY(-6px) rotate(0deg); opacity: 0; } 20% { opacity: 1; } 100% { transform: translateY(34px) rotate(200deg); opacity: 0; } }
@keyframes sunPulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.08); } }
@keyframes bgRoadScroll { from { background-position-x: 0; } to { background-position-x: -40px; } }
@keyframes driveAcross { from { transform: translateX(115vw); } to { transform: translateX(-25vw); } }
@keyframes personWave { 0%,100% { transform: rotate(-10deg); } 50% { transform: rotate(25deg); } }
@keyframes cardFloat { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }
@keyframes cloudFloatSlow { from { transform: translateX(-15px); } to { transform: translateX(15px); } }
@keyframes cloudFloatSlow2 { from { transform: translateX(15px); } to { transform: translateX(-15px); } }
`;

function PortalAmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#dbeafe] via-[#eff6ff] to-slate-50" />
      <div className="absolute right-[6%] top-8 h-20 w-20 rounded-full bg-[#fde68a]" style={{ animation: "sunPulse 4s ease-in-out infinite", boxShadow: "0 0 45px 16px rgba(253,230,138,0.55)" }} />
      <div className="absolute left-[8%] top-16 opacity-90" style={{ animation: "cloudFloatSlow 9s ease-in-out infinite alternate" }}>
        <svg width="90" height="40" viewBox="0 0 90 40"><circle cx="20" cy="24" r="14" fill="white" /><circle cx="36" cy="18" r="17" fill="white" /><circle cx="55" cy="24" r="13" fill="white" /></svg>
      </div>
      <div className="absolute right-[12%] top-32 opacity-85" style={{ animation: "cloudFloatSlow2 11s ease-in-out infinite alternate" }}>
        <svg width="70" height="32" viewBox="0 0 70 32"><circle cx="16" cy="20" r="11" fill="white" /><circle cx="30" cy="15" r="13" fill="white" /><circle cx="44" cy="20" r="10" fill="white" /></svg>
      </div>
      <div className="absolute left-[35%] top-12 opacity-75" style={{ animation: "cloudFloatSlow 13s ease-in-out infinite alternate" }}>
        <svg width="60" height="28" viewBox="0 0 60 28"><circle cx="14" cy="17" r="9" fill="white" /><circle cx="26" cy="12" r="11" fill="white" /><circle cx="38" cy="17" r="8" fill="white" /></svg>
      </div>
      <div className="absolute left-[55%] top-20 opacity-75" style={{ animation: "cloudFloatSlow2 10s ease-in-out infinite alternate" }}>
        <svg width="65" height="30" viewBox="0 0 65 30"><circle cx="15" cy="18" r="10" fill="white" /><circle cx="28" cy="13" r="12" fill="white" /><circle cx="41" cy="18" r="9" fill="white" /></svg>
      </div>
      <div className="absolute right-[30%] top-8 opacity-65" style={{ animation: "cloudFloatSlow 10s ease-in-out infinite alternate" }}>
        <svg width="55" height="26" viewBox="0 0 55 26"><circle cx="13" cy="16" r="8" fill="white" /><circle cx="24" cy="11" r="10" fill="white" /><circle cx="35" cy="16" r="7" fill="white" /></svg>
      </div>
    </div>
  );
}

function PortalStreetStrip() {
  const truckDelays = [0, -4.33, -8.66];
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-0 h-28 overflow-hidden">
      <div className="absolute inset-x-0 bottom-0 h-9 bg-[#334155]" />
      <div
        className="absolute inset-x-0 bottom-[16px] h-1.5"
        style={{
          backgroundImage: "repeating-linear-gradient(90deg, #94a3b8 0 20px, transparent 20px 40px)",
          animation: "bgRoadScroll 0.8s linear infinite",
        }}
      />
      {truckDelays.map((delay, i) => (
        <div key={i} className="absolute bottom-9" style={{ animation: `driveAcross 13s linear ${delay}s infinite` }}>
          <svg width="86" height="42" viewBox="0 0 86 42" style={{ transform: "scaleX(-1)" }}>
            <rect x="4" y="10" width="52" height="26" rx="5" fill="#0f766e" />
            <rect x="56" y="18" width="24" height="18" rx="3" fill="#0e7490" />
            <rect x="60" y="22" width="11" height="9" rx="1.5" fill="#bae6fd" />
            <g>
              <circle cx="20" cy="38" r="7" fill="#1e293b" />
              <rect x="18.5" y="31" width="3" height="6" fill="#64748b" />
              <animateTransform attributeName="transform" type="rotate" from="0 20 38" to="360 20 38" dur="0.5s" repeatCount="indefinite" />
            </g>
            <g>
              <circle cx="68" cy="38" r="7" fill="#1e293b" />
              <rect x="66.5" y="31" width="3" height="6" fill="#64748b" />
              <animateTransform attributeName="transform" type="rotate" from="0 68 38" to="360 68 38" dur="0.5s" repeatCount="indefinite" />
            </g>
          </svg>
        </div>
      ))}
      <div className="absolute bottom-9" style={{ animation: "driveAcross 13s linear infinite" }}>
        <svg width="24" height="38" viewBox="0 0 24 38">
          <circle cx="12" cy="8" r="6" fill="#f2c39a" />
          <rect x="6" y="15" width="12" height="16" rx="5" fill="#f59e0b" />
          <rect x="9" y="30" width="3" height="7" rx="1.5" fill="#334155" />
          <rect x="14" y="30" width="3" height="7" rx="1.5" fill="#334155" />
          <rect x="16" y="16" width="3" height="10" rx="1.5" fill="#f2c39a" style={{ transformBox: "fill-box", transformOrigin: "top center", animation: "personWave 1s ease-in-out infinite" }} />
        </svg>
      </div>
    </div>
  );
}

const confettiSpecs: [number, number, string, number][] = [
  [80, 18, "#f59e0b", 0],
  [102, 8, "#0ea5e9", 0.3],
  [58, 30, "#ec4899", 0.6],
  [340, 55, "#a855f7", 0.2],
  [320, 78, "#22c55e", 0.5],
  [95, 45, "#f43f5e", 0.15],
];

function ShipmentJourneyScene({ status }: { status: string }) {
  const stageMap: Record<string, string> = {
    pending: "pending",
    departed: "in_transit",
    in_transit: "in_transit",
    arrived_port: "in_transit",
    customs_pending: "customs",
    customs_cleared: "customs",
    warehouse: "warehouse",
    delivered: "delivered",
  };
  const stage = stageMap[status] ?? "pending";

  if (stage === "delivered") {
    return (
      <svg viewBox="0 0 400 150" className="h-32 w-full sm:h-36" preserveAspectRatio="xMidYMid meet">
        <rect x="0" y="0" width="400" height="150" rx="18" fill="#ecfdf5" />
        <circle cx="345" cy="30" r="16" fill="#fde68a" style={{ transformBox: "fill-box", transformOrigin: "center", animation: "sunPulse 3s ease-in-out infinite" }} />
        <rect x="130" y="70" width="110" height="60" rx="6" fill="#10b981" />
        <polygon points="120,72 185,32 250,72" fill="#059669" />
        <rect x="170" y="95" width="30" height="35" rx="3" fill="#ecfdf5" />
        <circle cx="150" cy="105" r="7" fill="#a7f3d0" />
        <g style={{ animation: "boxBob 2.4s ease-in-out infinite" }}>
          <rect x="245" y="108" width="34" height="26" rx="4" fill="#c48a52" />
          <rect x="245" y="118" width="34" height="4" fill="#8a5a2e" />
          <rect x="259" y="108" width="4" height="26" fill="#8a5a2e" />
        </g>
        <g style={{ transformBox: "fill-box", transformOrigin: "center", animation: "popIn .6s ease-out .3s both" }}>
          <circle cx="300" cy="95" r="20" fill="#10b981" />
          <path d="M291 95 l7 7 l12 -14" stroke="white" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        {confettiSpecs.map(([cx, cy, fill, delay], i) => (
          <rect key={i} x={cx} y={cy} width="5" height="5" fill={fill} style={{ transformBox: "fill-box", transformOrigin: "center", animation: `confettiFall 1.8s ease-in ${delay}s infinite` }} />
        ))}
      </svg>
    );
  }

  if (stage === "customs") {
    return (
      <svg viewBox="0 0 400 150" className="h-32 w-full sm:h-36" preserveAspectRatio="xMidYMid meet">
        <rect x="0" y="0" width="400" height="150" rx="18" fill="#f5f3ff" />
        <rect x="130" y="30" width="12" height="90" rx="4" fill="#7c3aed" />
        <rect x="258" y="30" width="12" height="90" rx="4" fill="#7c3aed" />
        <rect x="122" y="20" width="156" height="16" rx="8" fill="#6d28d9" />
        <rect x="176" y="2" width="48" height="18" rx="4" fill="#ede9fe" />
        <text x="200" y="15" textAnchor="middle" fontSize="9" fontWeight="700" fill="#6d28d9">CUSTOMS</text>
        <rect x="150" y="112" width="100" height="10" rx="4" fill="#c4b5fd" />
        <g>
          <rect x="178" y="86" width="44" height="34" rx="4" fill="#c48a52" />
          <rect x="178" y="100" width="44" height="4" fill="#8a5a2e" />
          <rect x="198" y="86" width="4" height="34" fill="#8a5a2e" />
        </g>
        <g style={{ animation: "stampDown 1.6s ease-in-out infinite" }}>
          <rect x="284" y="46" width="32" height="12" rx="3" fill="#a78bfa" />
          <circle cx="300" cy="68" r="16" fill="#8b5cf6" />
          <path d="M292 68 l6 6 l10 -12" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        {[[95, 45], [95, 60], [95, 75]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3" fill="#a78bfa" style={{ transformBox: "fill-box", transformOrigin: "center", animation: `sparkPulse 1.6s ease-in-out ${i * 0.3}s infinite` }} />
        ))}
      </svg>
    );
  }

  if (stage === "warehouse") {
    return (
      <svg viewBox="0 0 400 150" className="h-32 w-full sm:h-36" preserveAspectRatio="xMidYMid meet">
        <rect x="0" y="0" width="400" height="150" rx="18" fill="#eef2ff" />
        <rect x="70" y="55" width="140" height="70" rx="4" fill="#6366f1" />
        <polygon points="60,57 140,20 220,57" fill="#4f46e5" />
        <rect x="120" y="90" width="40" height="35" rx="2" fill="#c7d2fe" />
        <g style={{ animation: "boxBob 2.2s ease-in-out infinite" }}>
          <rect x="245" y="95" width="34" height="30" rx="3" fill="#f59e0b" />
        </g>
        <g style={{ animation: "boxBobDelay1 2.2s ease-in-out .3s infinite" }}>
          <rect x="285" y="80" width="34" height="45" rx="3" fill="#0ea5e9" />
        </g>
        <g style={{ animation: "boxBobDelay2 2.2s ease-in-out .6s infinite" }}>
          <rect x="325" y="100" width="30" height="25" rx="3" fill="#f43f5e" />
        </g>
      </svg>
    );
  }

  if (stage === "in_transit") {
    return (
      <svg viewBox="0 0 400 150" className="h-32 w-full sm:h-36" preserveAspectRatio="xMidYMid meet">
        <rect x="0" y="0" width="400" height="150" rx="18" fill="#eff6ff" />
        <circle cx="345" cy="28" r="16" fill="#fde68a" style={{ transformBox: "fill-box", transformOrigin: "center", animation: "sunPulse 3s ease-in-out infinite" }} />
        <g style={{ animation: "cloudDriftA 6s ease-in-out infinite alternate" }}>
          <circle cx="70" cy="35" r="12" fill="white" />
          <circle cx="85" cy="30" r="15" fill="white" />
          <circle cx="100" cy="37" r="10" fill="white" />
        </g>
        <g style={{ animation: "cloudDriftB 8s ease-in-out infinite alternate" }}>
          <circle cx="220" cy="20" r="9" fill="white" />
          <circle cx="232" cy="17" r="11" fill="white" />
        </g>
        <rect x="0" y="118" width="400" height="26" fill="#334155" />
        <g style={{ animation: "roadDash 0.7s linear infinite" }}>
          {[0, 40, 80, 120, 160, 200, 240, 280, 320, 360, 400, 440].map((x, i) => (
            <rect key={i} x={x} y="129" width="20" height="4" rx="2" fill="#94a3b8" />
          ))}
        </g>
        <g style={{ animation: "truckBounce 0.5s ease-in-out infinite" }}>
          <rect x="150" y="80" width="90" height="38" rx="6" fill="#0f766e" />
          <rect x="240" y="92" width="34" height="26" rx="4" fill="#0e7490" />
          <rect x="246" y="98" width="16" height="12" rx="2" fill="#bae6fd" />
          <g>
            <circle cx="178" cy="120" r="11" fill="#1e293b" />
            <rect x="176" y="110" width="4" height="8" fill="#64748b" />
            <animateTransform attributeName="transform" type="rotate" from="0 178 120" to="360 178 120" dur="0.6s" repeatCount="indefinite" />
          </g>
          <g>
            <circle cx="252" cy="120" r="11" fill="#1e293b" />
            <rect x="250" y="110" width="4" height="8" fill="#64748b" />
            <animateTransform attributeName="transform" type="rotate" from="0 252 120" to="360 252 120" dur="0.6s" repeatCount="indefinite" />
          </g>
        </g>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 400 150" className="h-32 w-full sm:h-36" preserveAspectRatio="xMidYMid meet">
      <rect x="0" y="0" width="400" height="150" rx="18" fill="#fff7ed" />
      <rect x="0" y="120" width="400" height="30" fill="#fde8d0" />
      <circle cx="160" cy="55" r="16" fill="#f2c39a" />
      <rect x="145" y="70" width="30" height="40" rx="10" fill="#2563eb" />
      <path d="M145 80 q-20 5 -25 25" stroke="#2563eb" strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d="M175 80 q20 5 25 25" stroke="#2563eb" strokeWidth="9" fill="none" strokeLinecap="round" />
      <g style={{ animation: "boxBob 2s ease-in-out infinite" }}>
        <rect x="185" y="88" width="40" height="32" rx="4" fill="#c48a52" />
        <rect x="185" y="100" width="40" height="4" fill="#8a5a2e" />
        <rect x="203" y="88" width="4" height="32" fill="#8a5a2e" />
      </g>
      {[[230, 60], [245, 80], [220, 95]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill="#fb923c" style={{ transformBox: "fill-box", transformOrigin: "center", animation: `sparkPulse 1.5s ease-in-out ${i * 0.25}s infinite` }} />
      ))}
      <g style={{ transformBox: "fill-box", transformOrigin: "center", animation: "popIn .6s ease-out .2s both" }}>
        <circle cx="280" cy="55" r="18" fill="#22c55e" />
        <path d="M271 55 l6 6 l11 -13" stroke="white" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

export default function CustomerPortalPage() {
  const [customer, setCustomer] = useState<CustomerInfo | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [shipments, setShipments] = useState<ShipmentItem[]>([]);
  const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"orders" | "shipments" | "invoices">("orders");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);
    try {
      const response = await fetch(`${API_BASE_URL}/customer-portal/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      }
      const data: CustomerInfo = await response.json();
      setCustomer(data);
      await loadAllData(data.customer_id);
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : "تعذر تسجيل الدخول");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const loadAllData = async (customerId: number) => {
    setDataLoading(true);
    try {
      const [ordersRes, shipmentsRes, invoicesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/customer-portal/${customerId}/orders`, { cache: "no-store" }),
        fetch(`${API_BASE_URL}/customer-portal/${customerId}/shipments`, { cache: "no-store" }),
        fetch(`${API_BASE_URL}/customer-portal/${customerId}/invoices`, { cache: "no-store" }),
      ]);
      setOrders(ordersRes.ok ? await ordersRes.json() : []);
      setShipments(shipmentsRes.ok ? await shipmentsRes.json() : []);
      setInvoices(invoicesRes.ok ? await invoicesRes.json() : []);
    } finally {
      setDataLoading(false);
    }
  };

  const handleLogout = () => {
    setCustomer(null);
    setEmail("");
    setPassword("");
    setOrders([]);
    setShipments([]);
    setInvoices([]);
  };

  if (!customer) {
    return (
      <div dir="rtl" className="relative min-h-screen overflow-hidden bg-slate-50 flex items-center justify-center px-4 py-10">
        <style>{journeyKeyframes}</style>
        <PortalAmbientBackground />
        <PortalStreetStrip />
        <div className="relative z-10 grid w-full max-w-4xl overflow-hidden rounded-[28px] shadow-2xl md:grid-cols-2">
          <div className="relative hidden flex-col justify-between bg-gradient-to-br from-[#0369a1] via-[#0e7490] to-[#1e3a8a] p-10 text-white md:flex">
            <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-white/10" />
            <div className="absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-white/5" />
            <div className="relative z-10">
              <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-[10px] font-bold">
                <ShieldCheck size={13} /> بياناتك محفوظة وآمنة
              </div>
              <h1 className="mt-8 text-[26px] font-black leading-tight">متابعة شحناتك<br />من مكان واحد</h1>
              <p className="mt-3 text-[12px] font-medium text-white/75">شحناتك، طلباتك، وفواتيرك — كل شي أول بأول وبشفافية كاملة.</p>
            </div>
            <div className="relative z-10 grid gap-3">
              <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15"><Package size={16} /></span>
                <p className="text-[11px] font-bold">تتبع حالة الطلبات لحظة بلحظة</p>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15"><Truck size={16} /></span>
                <p className="text-[11px] font-bold">تتبع الشحن من الجمارك للتسليم</p>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15"><ReceiptText size={16} /></span>
                <p className="text-[11px] font-bold">فواتيرك ومستحقاتك بشكل واضح</p>
              </div>
            </div>
          </div>
          <form onSubmit={handleLogin} className="bg-white p-8 sm:p-10">
            <div className="inline-flex rounded-xl border border-slate-100 bg-white px-3 py-2 shadow-sm">
              <img src="/logo.png" alt="إرتكاز" className="h-12 w-auto object-contain" />
            </div>
            <h2 className="mt-5 text-[19px] font-black text-slate-900">بوابة العملاء</h2>
            <p className="mt-1 text-[11px] font-medium text-slate-500">سجلي الدخول لمتابعة شحناتك وطلباتك وفواتيرك</p>
            {loginError && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-[11px] font-bold text-red-600">
                <AlertTriangle size={14} /> {loginError}
              </div>
            )}
            <div className="mt-6 grid gap-4">
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-bold text-slate-500">البريد الإلكتروني</span>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 focus-within:border-slate-400">
                  <MailIcon size={15} className="text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-[12px] outline-none"
                    placeholder="you@example.com"
                  />
                </div>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-bold text-slate-500">كلمة المرور</span>
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 focus-within:border-slate-400">
                  <Lock size={15} className="text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent text-[12px] outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </label>
            </div>
            <button
              type="submit"
              disabled={isLoggingIn}
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-[#0369a1] to-[#1e3a8a] px-4 py-3 text-[12px] font-black text-white shadow-lg disabled:opacity-50"
            >
              {isLoggingIn ? "جاري الدخول..." : <>الدخول إلى حسابي <ArrowLeft size={14} /></>}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const activeOrders = orders.filter((o) => o.status !== "completed").length;
  const activeShipments = shipments.filter((s) => s.status !== "delivered").length;
  const pendingInvoicesAmount = invoices.filter((i) => i.status !== "paid").reduce((sum, i) => sum + i.total, 0);
  const totalSpent = invoices.reduce((sum, i) => sum + i.total, 0);

  return (
    <div dir="rtl" className="relative min-h-screen overflow-hidden bg-slate-50">
      <style>{journeyKeyframes}</style>
      <PortalAmbientBackground />
      <PortalStreetStrip />
      <header className="relative z-10 px-4 pt-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between rounded-3xl border border-white/70 bg-white/85 px-6 py-4 shadow-[0_10px_30px_-14px_rgba(30,64,175,0.3)] backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="inline-flex rounded-xl border border-sky-100 bg-white px-2.5 py-1.5 shadow-sm">
              <img src="/logo.png" alt="إرتكاز" className="h-10 w-auto object-contain" />
            </div>
            <div>
              <p className="text-[9px] font-bold text-slate-400">بوابة العملاء</p>
              <h1 className="text-[15px] font-black text-slate-900">{customer.customer_name}</h1>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[11px] font-bold text-slate-600 hover:bg-slate-50"
          >
            <LogOut size={14} /> تسجيل الخروج
          </button>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-7 pb-24">
        <section className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="طلبات نشطة" value={String(activeOrders)} icon={Package} tone="bg-sky-100 text-sky-700" gradient="from-sky-50 to-white border-sky-100" />
          <StatCard label="شحنات قيد التنفيذ" value={String(activeShipments)} icon={Truck} tone="bg-blue-100 text-blue-700" gradient="from-blue-50 to-white border-blue-100" />
          <StatCard label="مستحقات غير مدفوعة" value={formatCurrency(pendingInvoicesAmount)} icon={CircleDollarSign} tone="bg-amber-100 text-amber-700" gradient="from-amber-50 to-white border-amber-100" />
          <StatCard label="إجمالي التعاملات" value={formatCurrency(totalSpent)} icon={ReceiptText} tone="bg-emerald-100 text-emerald-700" gradient="from-emerald-50 to-white border-emerald-100" />
        </section>

        <div className="mb-5 flex gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("orders")}
            className={`flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-[11px] font-bold transition ${activeTab === "orders" ? "bg-slate-900 text-white shadow-lg" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"}`}
          >
            <Package size={14} /> الطلبات <span className={`rounded-lg px-2 py-0.5 text-[9px] ${activeTab === "orders" ? "bg-white/15" : "bg-slate-100"}`}>{orders.length}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("shipments")}
            className={`flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-[11px] font-bold transition ${activeTab === "shipments" ? "bg-slate-900 text-white shadow-lg" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"}`}
          >
            <Truck size={14} /> الشحنات <span className={`rounded-lg px-2 py-0.5 text-[9px] ${activeTab === "shipments" ? "bg-white/15" : "bg-slate-100"}`}>{shipments.length}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("invoices")}
            className={`flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-[11px] font-bold transition ${activeTab === "invoices" ? "bg-slate-900 text-white shadow-lg" : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"}`}
          >
            <ReceiptText size={14} /> الفواتير <span className={`rounded-lg px-2 py-0.5 text-[9px] ${activeTab === "invoices" ? "bg-white/15" : "bg-slate-100"}`}>{invoices.length}</span>
          </button>
        </div>

        {dataLoading && (
          <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center text-[11px] font-medium text-slate-400">جاري تحميل البيانات...</div>
        )}

        {!dataLoading && activeTab === "orders" && (
          <div className="grid gap-4 sm:grid-cols-2">
            {orders.length === 0 && (
              <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center text-[11px] font-medium text-slate-400 sm:col-span-2">
                <Package className="mx-auto mb-2 text-slate-300" size={28} />
                لا توجد طلبات حالياً
              </div>
            )}
            {orders.map((order) => (
              <article key={order.id} className="relative overflow-hidden rounded-2xl border border-sky-100 bg-gradient-to-br from-sky-50/70 to-white p-5 shadow-sm">
                <span className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-l from-sky-400 to-blue-500" />
                <div className="flex items-start justify-between gap-2">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-700" style={{ animation: "cardFloat 3s ease-in-out infinite" }}><Package size={17} /></span>
                  <StatusBadge status={order.status} />
                </div>
                <p className="mt-4 text-[10px] font-bold text-slate-400">{order.order_number}</p>
                <h3 className="mt-1 text-[14px] font-black text-slate-900">{order.title}</h3>
                <p className="mt-2 text-[13px] font-black text-emerald-700">{formatCurrency(order.amount)}</p>
                {order.due_date && (
                  <p className="mt-2 flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
                    <Clock3 size={12} /> التسليم المتوقع: {order.due_date}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}

        {!dataLoading && activeTab === "shipments" && (
          <div className="grid gap-4">
            {shipments.length === 0 && (
              <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center text-[11px] font-medium text-slate-400">
                <Truck className="mx-auto mb-2 text-slate-300" size={28} />
                لا توجد شحنات حالياً
              </div>
            )}
            {shipments.map((shipment) => {
              const steps = getShipmentSteps(shipment.service_type);
              const currentIndex = shipmentStepIndex(shipment.status, steps);
              return (
                <article key={shipment.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <ShipmentJourneyScene status={shipment.status} />
                  <div className="p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Truck size={17} /></span>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400">{shipment.tracking_number ?? `شحنة #${shipment.id}`}</p>
                          <h3 className="text-[13px] font-black text-slate-900">{shipment.service_type ?? "شحن"}</h3>
                        </div>
                      </div>
                      <div className="text-left">
                        <StatusBadge status={shipment.status} />
                        <p className="mt-2 text-[12px] font-black text-emerald-700">{formatCurrency(shipment.shipping_cost)}</p>
                      </div>
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                      {steps.map((step, index) => {
                        const StepIcon = step.icon;
                        const done = index <= currentIndex;
                        return (
                          <div key={step.key} className="flex flex-1 flex-col items-center text-center">
                            <div className="flex w-full items-center">
                              {index !== 0 && <div className={`h-0.5 flex-1 ${index <= currentIndex ? "bg-emerald-400" : "bg-slate-150"}`} />}
                              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${done ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"}`}>
                                <StepIcon size={14} />
                              </span>
                              {index !== steps.length - 1 && <div className={`h-0.5 flex-1 ${index < currentIndex ? "bg-emerald-400" : "bg-slate-150"}`} />}
                            </div>
                            <p className={`mt-2 text-[8px] font-bold ${done ? "text-emerald-700" : "text-slate-400"}`}>{step.label}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {!dataLoading && activeTab === "invoices" && (
          <div className="grid gap-4 sm:grid-cols-2">
            {invoices.length === 0 && (
              <div className="rounded-2xl border border-slate-100 bg-white p-8 text-center text-[11px] font-medium text-slate-400 sm:col-span-2">
                <ReceiptText className="mx-auto mb-2 text-slate-300" size={28} />
                لا توجد فواتير حالياً
              </div>
            )}
            {invoices.map((invoice) => (
              <article key={invoice.id} className="relative overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/70 to-white p-5 shadow-sm">
                <span className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-l from-violet-400 to-purple-500" />
                <div className="flex items-start justify-between gap-2">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700" style={{ animation: "cardFloat 3.4s ease-in-out infinite" }}><ReceiptText size={17} /></span>
                  <StatusBadge status={invoice.status} />
                </div>
                <p className="mt-4 text-[10px] font-bold text-slate-400">{invoice.invoice_number}</p>
                <h3 className="mt-1 text-[16px] font-black text-slate-900">{formatCurrency(invoice.total)}</h3>
                <div className="mt-3 grid gap-1 rounded-xl bg-violet-50/60 p-3 text-[10px] font-medium text-slate-500">
                  <div className="flex justify-between"><span>المبلغ</span><span className="font-bold text-slate-700">{formatCurrency(invoice.amount)}</span></div>
                  <div className="flex justify-between"><span>الضريبة</span><span className="font-bold text-slate-700">{formatCurrency(invoice.tax_amount)}</span></div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
