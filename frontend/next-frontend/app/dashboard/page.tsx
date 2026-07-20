"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  AlertTriangle,
  Archive,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Banknote,
  BarChart3,
  Bell,
  Boxes,
  BrainCircuit,
  Building2,
  CalendarClock,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  CircleAlert,
  CircleGauge,
  CircleDollarSign,
  ClipboardList,
  CreditCard,
  Download,
  Clock3,
  Eye,
  EyeOff,
  FileDown,
  FileSpreadsheet,
  FileText,
  Filter,
  Globe2,
  Landmark,
  Layers3,
  LayoutDashboard,
  Lightbulb,
  Languages,
  LockKeyhole,
  LogOut,
  Loader2,
  Moon,
  Mail,
  MapPin,
  Menu,
  PackageCheck,
  PackageOpen,
  PackageX,
  PieChart,
  Phone,
  Plus,
  ReceiptText,
  RefreshCw,
  Route,
  ScanLine,
  Search,
  Send,
  Settings,
  ShieldAlert,
  ShieldCheck,
  ShoppingCart,
  SlidersHorizontal,
  Sparkles,
  Sun,
  Target,
  TrendingDown,
  TrendingUp,
  Trash2,
  Truck,
  User,
  UserCog,
  UserPlus,
  Users,
  KeyRound,
  WalletCards,
  WandSparkles,
  Warehouse,
  X,
  Zap,
} from "lucide-react";

const API_URL = "https://bi-technology-ai-api.onrender.com/dashboard/";

type ModuleKey =
  | "dashboard"
  | "customers"
  | "carriers"
  | "orders"
  | "invoices"
  | "payments"
  | "shipments"
  | "inventory"
  | "reports"
  | "ai"
  | "users"
  | "settings";

type CustomerType = "individual" | "company";
type CustomerTab = "overview" | "invoices" | "shipments" | "payments" | "notes";
type DeliveryMode = "dropoff" | "pickup";
type Language = "ar" | "en";
type ThemeMode = "light" | "dark";

const UI_TRANSLATIONS: Record<string, string> = {
  "أمس": "Yesterday",
  "جدة": "Jeddah",
  "سبل": "SPL",
  "شحن": "Shipping",
  "فرد": "Individual",
  "مدى": "Mada",
  "نشط": "Active",
  "الآن": "Now",
  "الكل": "All",
  "جاهز": "Ready",
  "جديد": "New",
  "سريع": "Express",
  "سمسا": "SMSA",
  "شركة": "Company",
  "فرصة": "Opportunity",
  "مؤكد": "Confirmed",
  "مالي": "Financial",
  "نقدي": "Cash",
  "أجهزة": "Devices",
  "إغلاق": "Close",
  "الثقة": "Confidence",
  "النمو": "Growth",
  "اليوم": "Today",
  "تحصيل": "Collections",
  "جزئية": "Partially paid",
  "خوادم": "Servers",
  "شبكات": "Networking",
  "عملاء": "Customers",
  "متوسط": "Medium",
  "متوفر": "Available",
  "مجدول": "Scheduled",
  "مخزون": "Inventory",
  "مرتفع": "High",
  "مرفوض": "Rejected",
  "مستقر": "Stable",
  "مسودة": "Draft",
  "منخفض": "Low",
  "أرامكس": "Aramex",
  "أولوية": "Priority",
  "اشتراك": "Subscription",
  "الخدمة": "Service",
  "الدمام": "Dammam",
  "الرياض": "Riyadh",
  "المسار": "Route",
  "تشغيلي": "Operational",
  "متأخرة": "Overdue",
  "متابعة": "Follow-up",
  "مدفوعة": "Paid",
  "ملحقات": "Accessories",
  "اقتصادي": "Economy",
  "الأفراد": "Individuals",
  "التاريخ": "Date",
  "التصنيف": "Category",
  "الشحنات": "Shipments",
  "الشركات": "Companies",
  "العملاء": "Customers",
  "العنوان": "Address",
  "المخزون": "Inventory",
  "المدينة": "City",
  "برمجيات": "Software",
  "دعم فني": "Technical Support",
  "غير نشط": "Inactive",
  "الانحراف": "Variance",
  "التقارير": "Reports",
  "الفاتورة": "Invoice",
  "الفواتير": "Invoices",
  "غير محدد": "Not specified",
  "غير مسجل": "Not registered",
  "منذ ساعة": "1 hour ago",
  "أثر مرتفع": "High impact",
  "الإشعارات": "Notifications",
  "الإعدادات": "Settings",
  "المدفوعات": "Payments",
  "الملاحظات": "Notes",
  "تم تحصيله": "Collected",
  "عدد القطع": "Item count",
  "عميل جديد": "New customer",
  "في الطريق": "In transit",
  "نظرة عامة": "Overview",
  "أجهزة شبكة": "Network devices",
  "اسم الشركة": "Company name",
  "المستودعات": "Warehouses",
  "تحديث يومي": "Daily update",
  "تحويل بنكي": "Bank transfer",
  "تقدم الشهر": "Monthly progress",
  "تم التسليم": "Delivered",
  "رقم التتبع": "Tracking number",
  "رقم الجوال": "Mobile number",
  "رقم الهوية": "National ID",
  "شحنات نشطة": "Active shipments",
  "قرار مقترح": "Recommended decision",
  "محلي ودولي": "Domestic & international",
  "مستودع جدة": "Jeddah warehouse",
  "منذ ساعتين": "2 hours ago",
  "أجهزة شبكات": "Network devices",
  "بدون فاتورة": "No invoice",
  "تسليم للفرع": "Drop off at branch",
  "تم اعتمادها": "Approved",
  "تم الاستلام": "Picked up",
  "تم الاعتماد": "Approved",
  "ثقة النموذج": "Model confidence",
  "خدمات تقنية": "Technology services",
  "خوادم أعمال": "Business servers",
  "دفعات مؤكدة": "Confirmed payments",
  "طريقة الدفع": "Payment method",
  "عدد الطلبات": "Order count",
  "فتح القائمة": "Open menu",
  "قيد الإنشاء": "Being generated",
  "قيد التجهيز": "Preparing",
  "قيد التحصيل": "Collecting",
  "لوحة التحكم": "Dashboard",
  "مجدول الأحد": "Scheduled Sunday",
  "محلي وخليجي": "Domestic & GCC",
  "مراجعة الآن": "Review now",
  "منذ 5 ساعات": "5 hours ago",
  "منذ 8 دقائق": "8 minutes ago",
  "موعد الوصول": "Estimated arrival",
  "نبض المخزون": "Inventory pulse",
  "هذا الأسبوع": "This week",
  "يحتاج توريد": "Restock needed",
  "آخر 30 يومًا": "Last 30 days",
  "أفراد وشركات": "Individuals & companies",
  "إشارات اليوم": "Today's signals",
  "إصدار فاتورة": "Issue invoice",
  "الربع الثاني": "Second quarter",
  "بعد 14 يومًا": "In 14 days",
  "تحتاج متابعة": "Needs follow-up",
  "تهيئة النظام": "System configuration",
  "سمسا إكسبريس": "SMSA Express",
  "شاشات مكتبية": "Desktop monitors",
  "شركة التوصيل": "Delivery company",
  "عدد العمليات": "Transaction count",
  "غدًا، 2:00 م": "Tomorrow, 2:00 PM",
  "فاتورة جديدة": "New invoice",
  "قيد المراجعة": "Under review",
  "قيمة المخزون": "Inventory value",
  "مركز القيادة": "Command center",
  "أجهزة وملحقات": "Devices & accessories",
  "أحدث العمليات": "Latest activity",
  "مركز العمليات التنفيذي": "Executive operations center",
  "مركز المتابعة اليومية": "Daily follow-up center",
  "مركز الاعتمادات": "Approval center",
  "ملخص إرتكاز الذكي": "ERTIKAZ smart summary",
  "سجل النشاطات": "Activity log",
  "نتائج البحث الشامل": "Global search results",
  "مركز الإشعارات": "Notification center",
  "إغلاق القائمة": "Close menu",
  "الاسم الثلاثي": "Full name",
  "الرقم الضريبي": "VAT number",
  "السجل التجاري": "Commercial registration",
  "المرجع البنكي": "Bank reference",
  "اليوم، 6:00 م": "Today, 6:00 PM",
  "تاريخ الإصدار": "Issue date",
  "تطوير برمجيات": "Software development",
  "شركات التوصيل": "Delivery companies",
  "طريقة التسليم": "Handover method",
  "فواتير متأخرة": "Overdue invoices",
  "قيمة الفواتير": "Invoice value",
  "متابعة الدورة": "Workflow tracking",
  "مسؤول التواصل": "Contact person",
  "نسبة الاعتماد": "Approval rate",
  "إجمالي العملاء": "Total customers",
  "إجمالي الوحدات": "Total units",
  "الحالة الحالية": "Current status",
  "الرصيد المتبقي": "Remaining balance",
  "الرصيد المستحق": "Outstanding balance",
  "اليوم، 10:20 ص": "Today, 10:20 AM",
  "بانتظار التحقق": "Awaiting verification",
  "بطاقة ائتمانية": "Credit card",
  "توصيات وتوقعات": "Recommendations & forecasts",
  "لوحات وتحليلات": "Dashboards & analytics",
  "إرسال تذكير ذكي": "Send smart reminder",
  "اشتراك دعم سنوي": "Annual support subscription",
  "التتبع والتسليم": "Tracking & delivery",
  "الذكاء التشغيلي": "Operational intelligence",
  "تنبيهات المخزون": "Inventory alerts",
  "إجمالي التعاملات": "Total business value",
  "استلام من الموقع": "Pickup from location",
  "الاستلام من الموقع": "Pickup from location",
  "أسلّمها في الفرع": "I will drop it off at the branch",
  "تسليم الفرع": "Branch drop-off",
  "الإصدار والتحصيل": "Issuing & collections",
  "التسويات المالية": "Financial settlements",
  "الكميات والحركات": "Quantities & movements",
  "المستودع الرئيسي": "Main warehouse",
  "تطوير تطبيق مخصص": "Custom app development",
  "فرص ومخاطر جديدة": "New opportunities & risks",
  "مرحبًا بك، دانية": "Welcome, Dania",
  "من جميع العمليات": "Across all operations",
  "أصناف تحتاج توريد": "Items needing restock",
  "إنشاء فرصة مبيعات": "Create sales opportunity",
  "ابحث في إرتكاز...": "Search ERTIKAZ...",
  "اسم الشخص المسؤول": "Contact person name",
  "الأسعار والاستلام": "Pricing & pickup",
  "البريد الإلكتروني": "Email address",
  "الفواتير المفتوحة": "Open invoices",
  "المدفوعات المؤكدة": "Confirmed payments",
  "الموقع الإلكتروني": "Website",
  "تحديث حالة الشحنة": "Update shipment status",
  "تم اعتماد التوصية": "Recommendation approved",
  "رحلة التوصيل حيّة": "Live delivery journey",
  "رقم السجل التجاري": "Commercial registration number",
  "صباح الخير، دانية": "Good morning, Dania",
  "مساء الخير، دانية": "Good afternoon, Dania",
  "مساء النور، دانية": "Good evening, Dania",
  "نقاط وصول لاسلكية": "Wireless access points",
  "أجهزة حاسوب محمولة": "Laptops",
  "صحة علاقات العملاء": "Customer relationship health",
  "في جميع المستودعات": "Across all warehouses",
  "أداء التوصيل والشحن": "Delivery & shipping performance",
  "إجراءات بدأت بالفعل": "Actions already started",
  "الحسابات والصلاحيات": "Accounts & permissions",
  "الرئيسي ومستودع جدة": "Main & Jeddah warehouses",
  "تحتاج قرارًا قريبًا": "Needs a decision soon",
  "تم تسجيل دفعة جديدة": "A new payment was recorded",
  "تمت مطابقتها ماليًا": "Financially reconciled",
  "خلال الفترة الحالية": "During the current period",
  "شحنة في هذه المرحلة": "shipment at this stage",
  "متوسط جميع التوصيات": "Average across all recommendations",
  "ملحقات وأجهزة طرفية": "Accessories & peripherals",
  "اشتراك خدمة سكني برو": "Sakkny Pro subscription",
  "توصيات قابلة للتنفيذ": "Actionable recommendations",
  "يحتاج متابعة التحصيل": "Collection follow-up needed",
  "إجمالي الفترة الحالية": "Current period total",
  "إنشاء طلب إعادة توريد": "Create restock request",
  "ملخص الإدارة الأسبوعي": "Weekly management summary",
  "أصناف تحتاج قرار توريد": "Items needing a restock decision",
  "خدمات تطوير وربط أنظمة": "System development & integration services",
  "عند أو تحت الحد الأدنى": "At or below minimum level",
  "تقرير المبيعات والتحصيل": "Sales & collections report",
  "جزئية، متأخرة، أو مسودة": "Partial, overdue, or draft",
  "حل إدارة علاقات العملاء": "Customer relationship management solution",
  "الحي، الشارع، رقم المبنى": "District, street, building number",
  "نبض المدفوعات لحظة بلحظة": "Real-time payment pulse",
  "لا توجد شحنات لهذا العميل": "No shipments for this customer",
  "لا توجد فواتير لهذا العميل": "No invoices for this customer",
  "مثال: شركة الأفق للمقاولات": "Example: Al Ofoq Contracting Company",
  "تم إنشاء ملف العميل حديثًا.": "The customer profile was recently created.",
  "خيار اقتصادي مع انتشار واسع": "An economical option with broad coverage",
  "فرصة بيع إضافية لشركة الأفق": "Upsell opportunity for Al Ofoq",
  "لا توجد مدفوعات لهذا العميل": "No payments for this customer",
  "ملفات 360° للأفراد والشركات": "360° profiles for individuals and companies",
  "ابحث باسم أو رقم أو مدينة...": "Search by name, number, or city...",
  "القيمة الحالية لجميع الأصناف": "Current value of all items",
  "عميل متكرر ومنتظم في السداد.": "A recurring customer with reliable payments.",
  "اعتماد التوصية للشحنة القادمة": "Approve recommendation for next shipment",
  "المخول بالتوقيع: أحمد السالم.": "Authorized signatory: Ahmed Al Salem.",
  "سرعة عالية داخل المدن الرئيسية": "Fast service in major cities",
  "لا توجد ملاحظات على هذا العميل": "No notes for this customer",
  "ابحث برقم الفاتورة أو العميل...": "Search by invoice number or customer...",
  "تغطية قوية للشحن المحلي والدولي": "Strong domestic and international coverage",
  "يوجد اهتمام بخدمة الدعم الممتد.": "Interested in extended support.",
  "فرصة تحصيل مبكر مع مجموعة البنيان": "Early collection opportunity with Al Bonyan Group",
  "شركات التوصيل في لوحة مقارنة واحدة": "Delivery companies in one comparison board",
  "مخزون أجهزة الشبكات سيصل للحد الحرج": "Network device inventory will reach a critical level",
  "العميل في مرحلة اعتماد العرض النهائي.": "The customer is approving the final proposal.",
  "سمسا أسرع للشحنات الشرقية هذا الأسبوع": "SMSA is faster for eastern-region shipments this week",
  "التقارير كمكتبة قرارات، لا كملفات منسية": "Reports as a decision library, not forgotten files",
  "الفواتير كرحلة تحصيل، وليست قائمة أرقام": "Invoices as a collection journey, not a list of numbers",
  "الشحنة كرحلة مرئية من التجهيز إلى التسليم": "A visual shipment journey from preparation to delivery",
  "خريطة المخزون تكشف الخطر قبل أن يصبح نقصًا": "The inventory map reveals risk before it becomes a shortage",
  "تفضل التواصل عبر واتساب بعد الساعة 4 مساءً.": "Prefers WhatsApp contact after 4 PM.",
  "يفضل العميل استلام تحديث أسبوعي عبر البريد.": "The customer prefers a weekly email update.",
  "الأصناف الحرجة، قيمة المخزون، وسرعة الدوران.": "Critical items, inventory value, and turnover speed.",
  "كل عميل في ملف واحد، وكل علاقة لها سياق كامل": "Every customer in one profile, with the full relationship context",
  "أهم المؤشرات والقرارات المطلوبة في صفحة واحدة.": "Key metrics and required decisions in one page.",
  "قيمة العملاء، تكرار الطلبات، وفرص البيع الإضافي.": "Customer value, repeat orders, and upsell opportunities.",
  "مقارنة الشركات، متوسط زمن التسليم، وحالات التعثر.": "Carrier comparison, average delivery time, and delayed cases.",
  "قراءة شاملة للإيرادات، الدفعات، والفواتير المتأخرة.": "A complete view of revenue, payments, and overdue invoices.",
  "رادار القرارات يرى ما يحتاج انتباهك قبل أن تبحثي عنه": "The decision radar surfaces what needs attention before you search",
  "متوسط التسليم إلى الدمام أقل بـ 0.8 يوم مقارنة بالخيارات الأخرى.": "Average delivery to Dammam is 0.8 days faster than other options.",
  "سلوك الطلبات يشير إلى احتياج محتمل لخدمة الدعم الممتد وربط التقارير.": "Order behavior suggests a potential need for extended support and report integration.",
  "كل توصية مرتبطة بنسبة ثقة، أثر متوقع، وإجراء عملي يمكنك اعتماده مباشرة.": "Every recommendation includes confidence, expected impact, and an action you can approve directly.",
  "العميل يسدد عادة خلال 48 ساعة من إرسال تذكير مخصص مع ملخص مراحل المشروع.": "The customer usually pays within 48 hours of a personalized reminder with a project-stage summary.",
  "بمعدل الصرف الحالي، سيصل الصنف NET-SW-24 إلى أقل من الحد الأدنى خلال 6 أيام.": "At the current usage rate, item NET-SW-24 will fall below minimum stock within 6 days.",
  "اختاري التقرير بصريًا، شاهدي ملخصه التنفيذي، ثم حمليه أو شاركيه مباشرة من نفس المساحة.": "Choose a report visually, review its executive summary, then download or share it from the same workspace.",
  "لوحة مليانة حياة: رسوم واضحة، مؤشرات مرئية، وحركة خفيفة تعطيك صورة شاملة بدون كآبة أو فراغ.": "A lively dashboard with clear charts, visual indicators, and subtle motion for a complete view.",
  "تابعي كل حركة مالية كمسار واضح: مصدرها، الفاتورة المرتبطة بها، حالتها، وما يحتاج اعتمادًا منك.": "Track every financial movement through its source, linked invoice, status, and required approvals.",
  "لوحة مراحل حيّة توضّح أين توجد كل شحنة، من المسؤول عنها، وما الخطوة التالية بدون جداول مزدحمة.": "A live stage board shows where every shipment is, who owns it, and the next step without crowded tables.",
  "قارني بين السعر الداخلي والدولي، وحددي لكل شركة هل ستسلمين الشحنة للفرع أو تطلبين استلامها من موقعك.": "Compare domestic and international prices, then choose branch drop-off or pickup from your location.",
  "بدل جدول أصناف جامد، تعرض إرتكاز كل صنف كنبض: مستوى الامتلاء، الحد الأدنى، حركة الصرف، وقيمة المخزون.": "Instead of a rigid table, ERTIKAZ shows every item as a pulse: stock level, minimum, usage movement, and value.",
  "شاهدي نسبة التحصيل داخل كل فاتورة، افتحي التفاصيل، وسجلي السداد من نفس المساحة بدون الانتقال بين صفحات متعددة.": "See collection progress in every invoice, open details, and record payment in the same workspace.",
  "بدل الأسماء المتراصة، تظهر العلاقات كبطاقات ذكية تلخص القيمة، الحالة، الفواتير، والشحنات قبل الدخول إلى الملف التفصيلي.": "Instead of stacked names, smart cards summarize value, status, invoices, and shipments before opening the full profile.",
  "جميع الحقوق محفوظة.": "All rights reserved.",
  "آخر مزامنة: الآن": "Last sync: now",
  "الاتصال آمن": "Secure connection",
  "النظام متصل": "System online",
  "مديرة النظام": "System administrator",
  "تجهيز مركز القيادة": "Preparing the command center",
  "يتم تحميل البيانات وربط وحدات النظام.": "Loading data and connecting system modules.",
  "تجهيز إرتكاز": "Preparing ERTIKAZ",
  "يتم تحميل البيانات والرسوم ولوحات التشغيل.": "Loading data, charts, and operational workspaces.",
  "إضافة عميل": "Add customer",
  "إضافة عميل جديد": "Add a new customer",
  "اختاري نوع العميل ثم أكملي البيانات المناسبة.": "Choose the customer type, then complete the relevant details.",
  "عميل فرد": "Individual customer",
  "بيانات شخصية، هوية، تواصل، وعنوان.": "Personal details, ID, contact information, and address.",
  "اسم الشركة، الضريبة، السجل، الموقع ومسؤول التواصل.": "Company name, VAT, registration, website, and contact person.",
  "إلغاء": "Cancel",
  "حفظ وفتح ملف العميل": "Save and open customer profile",
  "ستظهر البيانات هنا بمجرد إضافتها.": "Data will appear here once added.",
  "العودة إلى العملاء": "Back to customers",
  "إنشاء عملية": "Create transaction",
  "آخر النشاطات": "Latest activity",
  "معلومات التواصل": "Contact information",
  "البيانات النظامية": "Legal information",
  "صحة العلاقة": "Relationship health",
  "علاقة مستقرة مع فرصة نمو": "Stable relationship with growth potential",
  "ملاحظة رقم": "Note number",
  "إجمالي الإيرادات": "Total revenue",
  "فتح القسم": "Open section",
  "مركز الفواتير والتحصيل": "Invoice & collections center",
  "مركز المدفوعات": "Payments center",
  "رحلة الشحنات": "Shipment journey",
  "مكتبة التقارير": "Report library",
  "تحميل التقرير": "Download report",
  "اعتماد التوصية": "Approve recommendation",
  "توريد كمية مقترحة": "Restock suggested quantity",
  "إجمالي المبلغ": "Total amount",
  "المتبقي": "Remaining",
  "المبلغ": "Amount",
  "الفترة": "Period",
  "النوع": "Type",
  "إنشاء فاتورة جديدة": "Create new invoice",
  "تسجيل دفعة جديدة": "Record new payment",
  "اعتماد الدفعة": "Approve payment",
  "الملخص التنفيذي": "Executive summary",
  "لا يوجد تحديد حاليًا": "Nothing selected",
  "اختاري عملية لعرض التفاصيل": "Select a transaction to view details",
  "اختاري تقريرًا من القائمة": "Select a report from the list",
  "العودة إلى لوحة التحكم": "Back to dashboard",
  "فتح الملف الكامل": "Open full profile",
  "إجمالي الفاتورة": "Invoice total",
  "المحصل": "Collected",
  "طريقة تسليم الشحنة": "Shipment handover method",
  "سأسلمها للفرع": "I will drop it off",
  "بدون رسوم استلام": "No pickup fee",
  "الأسعار قابلة للتعديل": "Prices can be edited",
  "القرار المقترح": "Recommended decision",
  "اختاري الشركة حسب نوع الشحنة، وليس السعر فقط": "Choose the carrier by shipment type, not price alone",
  "تكلفة الشحنة المحلية حسب اختيارك": "Domestic shipment cost based on your selection",
  "عرض التحليل": "View analysis",
  "توصية ذكية": "Smart recommendation",
  "فتح الموديول": "Open module",
  "وصول سريع": "Quick access",
  "عرض وإدارة أحدث البيانات داخل الموديول": "View and manage the latest module data",
  "إجمالي السجلات": "Total records",
  "النشطة حاليًا": "Currently active",
  "نمو هذا الشهر": "Growth this month",
  "مركز علاقات العملاء": "Customer Relationship Center",
  "صورة متكاملة للعملاء بدل القوائم التقليدية: القيمة، النشاط، الرصيد المستحق، ونقطة التواصل التالية في مساحة واحدة.": "A complete customer view instead of traditional lists: value, activity, outstanding balance, and the next touchpoint in one workspace.",
  "قاعدة العملاء الحالية": "Current customer base",
  "حسابات شركات موثقة": "Verified company accounts",
  "ملفات أفراد نشطة": "Active individual profiles",
  "قيمة المحفظة": "Portfolio value",
  "إجمالي قيمة العلاقات": "Total relationship value",
  "محفظة العلاقات": "Relationship portfolio",
  "رتبي العملاء حسب النوع وافتحي الملف الكامل بنقرة واحدة.": "Organize customers by type and open the complete profile with one click.",
  "العميل المميز": "Featured customer",
  "فتح ملف العميل": "Open customer profile",
  "الخطوة التالية": "Next step",
  "متابعة الرصيد وعرض الدعم الممتد": "Follow up on the balance and offer extended support",
  "توزيع قاعدة العملاء": "Customer base distribution",
  "الشركات مقابل الأفراد": "Companies versus individuals",
  "توصية العلاقة": "Relationship recommendation",
  "ركزي على العملاء ذوي الرصيد المفتوح": "Focus on customers with open balances",
  "توجد فرص متابعة مالية وبيع إضافي يمكن تنفيذها من ملفات العملاء مباشرة.": "Financial follow-up and upsell opportunities can be handled directly from customer profiles.",
  "عرض قائمة الأولويات": "View priority list",
  "فتح الملف": "Open profile",
  "قيمة العلاقة منذ البداية": "Relationship value since the beginning",
  "مبالغ تحتاج متابعة": "Amounts requiring follow-up",
  "إجمالي الطلبات المسجلة": "Total recorded orders",
  "الشحنات المرتبطة بالعميل": "Shipments linked to the customer",
  "بطاقة العميل": "Customer card",
  "معلومات الاتصال والبيانات النظامية في مكان واحد.": "Contact and legal information in one place.",
  "خط العلاقة الزمني": "Relationship timeline",
  "أحدث الأنشطة المرتبطة بهذا العميل.": "Latest activities linked to this customer.",
  "تم ربط الدفعة بالفاتورة الأخيرة.": "The payment was linked to the latest invoice.",
  "انتقلت الشحنة إلى مرحلة في الطريق.": "The shipment moved to the in-transit stage.",
  "تم إنشاء فاتورة خدمات جديدة.": "A new service invoice was created.",
  "الالتزام بالسداد": "Payment discipline",
  "تكرار الطلبات": "Order frequency",
  "فرصة التوسع": "Expansion opportunity",
  "الإجراء المقترح": "Recommended action",
  "جدولة متابعة شخصية هذا الأسبوع": "Schedule a personal follow-up this week",
  "الجمع بين متابعة الرصيد وعرض خدمة إضافية قد يحسن قيمة العلاقة.": "Combining balance follow-up with an additional service offer may improve relationship value.",
  "إنشاء مهمة متابعة": "Create follow-up task",
  "مسار بصري يوضح أين تقف كل فاتورة، وما تم تحصيله، وما يحتاج إجراءً سريعًا.": "A visual flow showing where every invoice stands, what has been collected, and what needs fast action.",
  "مسار التحصيل": "Collection pipeline",
  "الفواتير مرتبة حسب المرحلة الحالية.": "Invoices are organized by their current stage.",
  "كفاءة التحصيل": "Collection efficiency",
  "قراءة سريعة لصحة الفواتير.": "A quick view of invoice health.",
  "أداء التحصيل جيد": "Collection performance is good",
  "ركزي على الفواتير المتأخرة والجزئية لرفع التدفق النقدي.": "Focus on overdue and partially paid invoices to improve cash flow.",
  "مدفوعة بالكامل": "Fully paid",
  "تحتاج تدخل": "Needs intervention",
  "توصية التحصيل": "Collection recommendation",
  "ابدئي بالفواتير الأعلى قيمة": "Start with the highest-value invoices",
  "متابعة فاتورتين اليوم قد تغطي الجزء الأكبر من الرصيد المفتوح.": "Following up on two invoices today may cover most of the open balance.",
  "لا توجد فواتير في هذه المرحلة": "No invoices at this stage",
  "محصل": "Collected",
  "مركز المدفوعات والتسويات": "Payments and Settlement Center",
  "تدفق مالي واضح يربط كل دفعة بعميلها وفاتورتها وحالة اعتمادها.": "A clear financial stream linking each payment to its customer, invoice, and approval status.",
  "جميع العمليات المسجلة": "All recorded transactions",
  "تمت التسوية بنجاح": "Successfully settled",
  "تحتاج اعتمادًا ماليًا": "Requires financial approval",
  "حركة التدفق الحالية": "Current cash-flow activity",
  "تدفق المدفوعات": "Payment stream",
  "أحدث العمليات مرتبة كخط زمني مالي.": "Latest transactions arranged as a financial timeline.",
  "مزيج طرق الدفع": "Payment method mix",
  "توزيع القيمة حسب قناة الدفع.": "Value distribution by payment channel.",
  "قائمة الاعتماد": "Approval queue",
  "لا توجد دفعات بانتظار الاعتماد": "No payments awaiting approval",
  "برج مراقبة الشحنات": "Shipment Control Tower",
  "كل شحنة تظهر داخل مرحلتها الحالية مع المسار، الناقل، التقدم، وموعد الوصول.": "Each shipment appears in its current stage with route, carrier, progress, and ETA.",
  "تسليمات مكتملة": "Completed deliveries",
  "متوسط التقدم": "Average progress",
  "لكل الشحنات": "Across all shipments",
  "مسار الرحلة": "Journey flow",
  "لوحة مراحل قابلة للتحديث من نفس الشاشة.": "A stage board that can be updated from the same screen.",
  "تحديث حي للحالات": "Live status updates",
  "لا توجد شحنات في هذه المرحلة": "No shipments at this stage",
  "أداء شركات التوصيل": "Carrier performance",
  "قراءة سريعة للتوزيع والسرعة.": "A quick view of distribution and speed.",
  "توصية لوجستية": "Logistics recommendation",
  "اختاري الناقل حسب المدينة والأولوية": "Choose the carrier based on city and priority",
  "السرعة ليست العامل الوحيد؛ قارني التكلفة، التغطية، وخيار الاستلام من الموقع.": "Speed is not the only factor; compare cost, coverage, and pickup options.",
  "الوصول المتوقع": "Estimated arrival",
  "نبض المخزون والمستودعات": "Inventory and Warehouse Pulse",
  "خريطة صحة توضح الأصناف الحرجة، قيمة المخزون، وأولوية التوريد قبل أن تتأثر الطلبات.": "A health map showing critical items, inventory value, and replenishment priority before orders are affected.",
  "القيمة الحالية للأصناف": "Current item value",
  "أصناف موزعة على المستودعات": "Items distributed across warehouses",
  "أقل من الحد الأدنى": "Below minimum level",
  "ضمن المستوى المستهدف": "Within target level",
  "تحديث مباشر للكميات": "Live quantity updates",
  "نسبة الامتلاء": "Fill rate",
  "قيمة المتاح": "Available stock value",
  "أولوية إعادة التوريد": "Restock priority",
  "الأصناف الأقرب للتأثير على الطلبات.": "Items most likely to affect orders.",
  "عاجل": "Urgent",
  "قريب": "Upcoming",
  "توصية المخزون": "Inventory recommendation",
  "اجمعي الأصناف الحرجة في طلب توريد واحد": "Combine critical items into one purchase order",
  "تجميع الاحتياج يقلل تكلفة الشحن ويمنع توقف الطلبات.": "Consolidating demand reduces shipping cost and prevents order disruption.",
  "مخزون صحي": "Healthy inventory",
  "حرج": "Critical",
  "تنبيه": "Alert",
  "مكتبة التقارير التنفيذية": "Executive Report Library",
  "تقارير منظمة حسب المجال مع ملخص تنفيذي، حالة التحديث، وصيغة التصدير.": "Reports organized by domain with an executive summary, update status, and export format.",
  "مكتبة الأداء الحالية": "Current performance library",
  "متاحة للعرض والتحميل": "Available to view and download",
  "يتم تحديثها الآن": "Currently being updated",
  "تُنشأ تلقائيًا": "Generated automatically",
  "اختاري تقريرًا لعرض الملخص": "Select a report to view the summary",
  "تقرير الإدارة": "Management report",
  "اجمعي أهم المؤشرات في ملخص أسبوعي واحد": "Combine the most important metrics into one weekly summary",
  "رادار القرارات الذكية": "Smart Decision Radar",
  "التوصيات مرتبة حسب المجال والأثر ونسبة الثقة، مع إجراء مباشر لكل توصية.": "Recommendations are organized by domain, impact, and confidence, with a direct action for each.",
  "إشارات جديدة": "new signals",
  "رادار الأولويات": "Priority radar",
  "قراءة مركزية للمجالات التي تحتاج انتباهك.": "A central view of the areas that need your attention.",
  "ثقة الرادار": "Radar confidence",
  "أعلى ثقة": "Highest confidence",
  "إجراءات معتمدة": "Approved actions",
  "أفضل إجراء الآن": "Best action now",
  "ابدئي بإشارات الأثر المرتفع": "Start with high-impact signals",
  "تنفيذ التوصيات الأعلى أثرًا أولًا يعطي نتيجة أسرع على التشغيل والتدفق النقدي.": "Executing the highest-impact recommendations first delivers faster operational and cash-flow results.",
  "تفاصيل السجل": "Record details",

  "واجهة مرتبة للوصول إلى العميل، معلوماته، معاملاته، والخطوة التالية بدون ازدحام بصري.": "An organized interface for customer information, transactions, and next actions without visual clutter.",
  "دليل العملاء": "Customer directory",
  "اختاري العميل لفتح ملفه الكامل.": "Select a customer to open the full profile.",
  "ابحث عن عميل...": "Search customers...",
  "أولوية المتابعة": "Follow-up priority",
  "أعلى الأرصدة المفتوحة.": "Highest open balances.",
  "اقتراح اليوم": "Today\'s suggestion",
  "تابعي العملاء ذوي الرصيد المفتوح أولًا": "Follow up with customers who have open balances first",
  "فتح ملف العميل يعطيك الفواتير والمدفوعات والملاحظات قبل التواصل.": "The customer profile gives you invoices, payments, and notes before contact.",
  "قيمة التعاملات": "Relationship value",
  "الرصيد المفتوح": "Open balance",
  "إجمالي المحفظة": "Total portfolio",
  "حسابات أعمال": "Business accounts",
  "شحنة محدثة": "Updated shipment",
  "ملف العميل": "Customer profile",
  "معلومات العميل": "Customer information",
  "بيانات التواصل والبيانات النظامية.": "Contact and legal information.",
  "النشاط الأخير": "Recent activity",
  "آخر العمليات المرتبطة بالعميل.": "Latest activities linked to the customer.",
  "تم ربط الدفعة بآخر فاتورة.": "The payment was linked to the latest invoice.",
  "تم تحديث مرحلة التوصيل.": "The delivery stage was updated.",
  "تم إنشاء فاتورة خدمات.": "A service invoice was created.",
  "ملخص العلاقة": "Relationship summary",
  "حساب منظم وقابل للنمو": "An organized account with growth potential",
  "الشحنات النشطة": "Active shipments",
  "آخر دفعة": "Latest payment",
  "الإجراء التالي": "Next action",
  "جدولة متابعة مع العميل": "Schedule customer follow-up",
  "راجعي الرصيد المفتوح والملاحظات قبل الاتصال.": "Review the open balance and notes before contact.",
  "إدارة إصدار الفواتير والتحصيل من شاشة مرتبة وواضحة، مع نموذج إنشاء فاتورة كامل.": "Manage invoice issuance and collection from a clear workspace with a complete invoice creation form.",
  "سجل الفواتير": "Invoice register",
  "راجعي الحالة والمبلغ والاستحقاق من قائمة واحدة.": "Review status, amount, and due date in one list.",
  "العميل والفاتورة": "Customer and invoice",
  "الإجمالي": "Total",
  "الاستحقاق": "Due date",
  "تحتاج إجراء": "Needs action",
  "أضيفي العميل والبنود ثم راجعي الإجمالي قبل الحفظ.": "Add the customer and line items, then review the total before saving.",
  "بيانات الفاتورة": "Invoice details",
  "اسم العميل أو الشركة": "Customer or company name",
  "بنود الفاتورة": "Invoice line items",
  "أضيفي خدمة أو منتجًا واحدًا أو أكثر.": "Add one or more services or products.",
  "إضافة بند": "Add line",
  "وصف البند": "Line description",
  "اسم الخدمة أو المنتج": "Service or product name",
  "الكمية": "Quantity",
  "سعر الوحدة": "Unit price",
  "شروط الدفع أو أي ملاحظات إضافية...": "Payment terms or additional notes...",
  "ملخص الفاتورة": "Invoice summary",
  "عدد البنود": "Line count",
  "حفظ الفاتورة": "Save invoice",
  "مراجعة الدفعات واعتمادها وربطها بالفواتير في واجهة خفيفة ومنظمة.": "Review and approve payments and link them to invoices in a clean workspace.",
  "سجل المدفوعات": "Payment register",
  "العملية والعميل والفاتورة المرتبطة.": "Transaction, customer, and linked invoice.",
  "قنوات مستخدمة": "Used channels",
  "توزيع طرق الدفع": "Payment method distribution",
  "لا توجد دفعات معلقة.": "No pending payments.",
  "متابعة الكميات والحد الأدنى وحالة التوريد من قائمة واضحة بدون تحليلات زائدة.": "Track quantities, minimum levels, and replenishment status in a clear list without unnecessary analytics.",
  "مستودعات نشطة": "Active warehouses",
  "مواقع التخزين": "Storage locations",
  "توريد": "Restock",
  "أولوية التوريد": "Restock priority",
  "اقتراح التوريد": "Restock suggestion",
  "اجمعي الأصناف الحرجة في طلب واحد": "Combine critical items into one order",
  "يساعد ذلك على تقليل تكلفة الشحن وتفادي توقف الطلبات.": "This helps reduce shipping costs and prevents order disruption.",
  "اسألي إرتكاز عن الفواتير أو العملاء أو المخزون أو الشحن، واحصلي على إجابة مرتبطة ببيانات النظام وإجراءات واضحة.": "Ask Ertikaz about invoices, customers, inventory, or shipping and receive data-backed answers with clear actions.",
  "اسأل مساعد إرتكاز": "Ask Ertikaz Assistant",
  "تحليل فوري لبيانات العرض الحالية.": "Instant analysis of the current demo data.",
  "ما الفواتير التي أتابعها اليوم؟": "Which invoices should I follow up today?",
  "ما الأصناف التي تحتاج توريد؟": "Which items need restocking?",
  "لخص لي الشحنات النشطة": "Summarize active shipments",
  "من أهم العملاء للمتابعة؟": "Which customers should I prioritize?",
  "اكتبي سؤالك التشغيلي هنا...": "Type your operational question here...",
  "نتيجة التحليل": "Analysis result",
  "الأدلة المستخدمة": "Evidence used",
  "الإجراءات المقترحة": "Recommended actions",
  "قائمة القرارات": "Decision queue",
  "مرتبة حسب الأثر والثقة.": "Ordered by impact and confidence.",
  "ملخص العمليات اليوم": "Today\'s operational summary",
  "أولوية التحصيل": "Collection priority",
  "قرار المخزون": "Inventory decision",
  "ملخص الشحن": "Shipping summary",
  "فرصة العميل الأعلى قيمة": "Highest-value customer opportunity",
  "ملخص تنفيذي": "Executive summary",
  "الطلبات": "Orders",
  "طلب جديد": "New order",
  "إجمالي الطلبات": "Total orders",
  "كل الطلبات المسجلة": "All recorded orders",
  "بانتظار الاعتماد": "Awaiting approval",
  "تحتاج قرارًا": "Needs a decision",
  "قيد التنفيذ": "In progress",
  "تحت المعالجة": "Being processed",
  "جاهزة للشحن": "Ready to ship",
  "جاهزة للتسليم": "Ready for delivery",
  "قيمة الطلبات": "Order value",
  "إجمالي قيمة الطلبات": "Total order value",
  "كل الطلبات": "All orders",
  "جديدة": "New",
  "مكتملة": "Completed",
  "ابحث في الطلبات...": "Search orders...",
  "الطلب": "Order",
  "العميل": "Customer",
  "القيمة": "Value",
  "الحالة": "Status",
  "التقدم": "Progress",
  "المسؤول": "Owner",
  "الإجراءات": "Actions",
  "عرض التفاصيل": "View details",
  "تجهيز الفاتورة": "Prepare invoice",
  "تجهيز الشحنة": "Prepare shipment",
  "نقل للمرحلة التالية": "Move to next stage",
  "لا توجد طلبات مطابقة للبحث أو الفلتر الحالي.": "No orders match the current search or filter.",
  "ملاحظات الطلب": "Order notes",
  "الفاتورة جاهزة": "Invoice ready",
  "الشحنة جاهزة": "Shipment ready",
  "نقل الطلب للمرحلة التالية": "Move order to the next stage",
  "إنشاء طلب جديد": "Create new order",
  "اسم العميل": "Customer name",
  "نوع العميل": "Customer type",
  "عنوان الطلب": "Order title",
  "قيمة الطلب": "Order value",
  "الأولوية": "Priority",
  "تاريخ الاستحقاق": "Due date",
  "تفاصيل إضافية عن الطلب...": "Additional order details...",
  "حفظ الطلب": "Save order",
  "المستخدمون": "Users",
  "إضافة مستخدم": "Add user",
  "إجمالي المستخدمين": "Total users",
  "الحسابات المسجلة": "Registered accounts",
  "مستخدمون نشطون": "Active users",
  "يمكنهم الدخول الآن": "Can sign in now",
  "دعوات معلقة": "Pending invitations",
  "لم يتم قبول الدعوة": "Invitation not accepted",
  "أدوار مستخدمة": "Roles in use",
  "مستويات صلاحيات مختلفة": "Different permission levels",
  "ابحث باسم أو بريد أو دور...": "Search by name, email, or role...",
  "الدور والقسم": "Role and department",
  "آخر نشاط": "Last activity",
  "الصلاحيات": "Permissions",
  "صلاحيات": "permissions",
  "عرض وإدارة الصلاحيات": "View and manage permissions",
  "إيقاف الحساب": "Suspend account",
  "تفعيل الحساب": "Activate account",
  "إرسال رسالة": "Send message",
  "اضغطي للتفعيل أو الإلغاء": "Click to enable or disable",
  "إيقاف حساب المستخدم": "Suspend user account",
  "تفعيل حساب المستخدم": "Activate user account",
  "إضافة مستخدم جديد": "Add new user",
  "الاسم الكامل": "Full name",
  "القسم": "Department",
  "الدور": "Role",
  "حالة الحساب": "Account status",
  "إضافة المستخدم": "Add user",
  "مدير النظام": "System administrator",
  "محاسب": "Accountant",
  "مبيعات": "Sales",
  "خدمة عملاء": "Customer service",
  "مشاهد": "Viewer",
  "موقوف": "Suspended",
  "دعوة معلقة": "Pending invitation",
  "إعدادات الحساب": "Account settings",
  "إعدادات النظام": "System settings",
  "الأمان والصلاحيات": "Security and permissions",
  "إلغاء تجهيز الفاتورة": "Undo invoice preparation",
  "إلغاء تجهيز الشحنة": "Undo shipment preparation",

  "مرحبًا بعودتك": "Welcome back",
  "البريد الإلكتروني أو رمز الدخول غير صحيح.": "Incorrect email or password.",
  "هذا الحساب غير نشط. تواصل مع مدير النظام.": "This account is not active. Contact the administrator.",
  "تسجيل الدخول": "Sign in",
  "رمز الدخول": "Password",
  "تسجيل الخروج": "Sign out",
  "داخل المملكة": "Domestic",
  "شحن دولي": "International shipping",
  "توصيل للفرع": "Drop off at branch",
  "استلام من موقعي": "Pickup from my location",
  "السعر النهائي": "Final price",
  "خدمة الاستلام": "Pickup service",
  "بيانات تسجيل الدخول": "Login credentials",
  "إنشاء حساب الدخول": "Create login account",
  "حسابات دخول فعلية": "Real login accounts",
  "نظرة عامة على العمليات": "Operations overview",
  "ملخص محدث لأداء العملاء والمبيعات والتحصيل والتشغيل.": "An updated summary of customer, sales, collection, and operational performance.",
  "الملف الشخصي": "Profile",
  "الأمان وكلمة المرور": "Security and password",
  "الصلاحيات والمستخدمون": "Permissions and users",
  "المظهر واللغة": "Appearance and language",
  "بيانات الحساب": "Account details",
  "حدّث بياناتك الأساسية المستخدمة داخل إرتكاز.": "Update your basic account details used in ERTIKAZ.",
  "حفظ التعديلات": "Save changes",
  "تغيير كلمة المرور": "Change password",
  "استخدم كلمة مرور لا تقل عن 6 خانات.": "Use a password with at least 6 characters.",
  "كلمة المرور الحالية": "Current password",
  "كلمة المرور الجديدة": "New password",
  "تأكيد كلمة المرور الجديدة": "Confirm new password",
  "تحديث كلمة المرور": "Update password",
  "صلاحيات الوصول": "Access permissions",
  "فعّل أو أوقف الأقسام المتاحة لهذا المستخدم.": "Enable or disable the modules available to this user.",
  "لغة النظام": "System language",
  "مظهر النظام": "System appearance",
  "وضع نهاري مشرق أو ليلي ملوّن ومريح.": "A bright light mode or a colorful, comfortable dark mode.",
  "الجلسة الحالية": "Current session",

};

const TEXT_NODE_ORIGINALS = new WeakMap<Text, string>();

const ARABIC_MONTHS: Record<string, string> = {
  يناير: "January",
  فبراير: "February",
  مارس: "March",
  أبريل: "April",
  مايو: "May",
  يونيو: "June",
  يوليو: "July",
  أغسطس: "August",
  سبتمبر: "September",
  أكتوبر: "October",
  نوفمبر: "November",
  ديسمبر: "December",
};

function toWesternDigits(value: string): string {
  const arabicDigits = "٠١٢٣٤٥٦٧٨٩";
  const easternDigits = "۰۱۲۳۴۵۶۷۸۹";
  return value
    .replace(/[٠-٩]/g, (digit) => String(arabicDigits.indexOf(digit)))
    .replace(/[۰-۹]/g, (digit) => String(easternDigits.indexOf(digit)));
}

function translateUiText(value: string): string {
  if (!value) return value;

  const leading = value.match(/^\s*/)?.[0] ?? "";
  const trailing = value.match(/\s*$/)?.[0] ?? "";
  const source = value.trim();

  if (!source) return value;

  const exact = UI_TRANSLATIONS[source];
  if (exact) return `${leading}${exact}${trailing}`;

  let translated = source;

  translated = translated.replace(
    /^(\d+)\s+فواتير تحتاج متابعة$/,
    "$1 invoices need follow-up",
  );
  translated = translated.replace(
    /^نسبة التحصيل\s+([\d٠-٩۰-۹]+)%$/,
    "Collection rate $1%",
  );
  translated = translated.replace(
    /^([\d٠-٩۰-۹]+)%\s+من الإجمالي$/,
    "$1% of total",
  );
  translated = translated.replace(
    /^([\d٠-٩۰-۹]+)\s+شحنة في هذه المرحلة$/,
    "$1 shipments at this stage",
  );
  translated = translated.replace(
    /^ملاحظة رقم\s+([\d٠-٩۰-۹]+)$/,
    "Note $1",
  );
  translated = translated.replace(
    /^منذ\s+([\d٠-٩۰-۹]+)\s+دقائق?$/,
    "$1 minutes ago",
  );
  translated = translated.replace(
    /^منذ\s+([\d٠-٩۰-۹]+)\s+ساعات?$/,
    "$1 hours ago",
  );
  translated = translated.replace(
    /^([\d٠-٩۰-۹]+)\s+موديول متصل$/,
    "$1 connected modules",
  );
  translated = translated.replace(
    /^عرض\s+([\d٠-٩۰-۹]+)\s+سجلات/,
    "Showing $1 records",
  );
  translated = translated.replace(
    /^وصف البند\s+([\d٠-٩۰-۹]+)$/,
    "Line description $1",
  );

  const routeMatch = translated.match(/^(.+?)\s*←\s*(.+)$/);
  if (routeMatch) {
    const from = UI_TRANSLATIONS[routeMatch[1].trim()] ?? routeMatch[1].trim();
    const to = UI_TRANSLATIONS[routeMatch[2].trim()] ?? routeMatch[2].trim();
    translated = `${from} → ${to}`;
  }

  const dateMatch = translated.match(
    /^(\d{1,2})\s+(يناير|فبراير|مارس|أبريل|مايو|يونيو|يوليو|أغسطس|سبتمبر|أكتوبر|نوفمبر|ديسمبر)(?:\s+(\d{4}))?$/,
  );
  if (dateMatch) {
    const month = ARABIC_MONTHS[dateMatch[2]];
    translated = dateMatch[3]
      ? `${month} ${dateMatch[1]}, ${dateMatch[3]}`
      : `${month} ${dateMatch[1]}`;
  }

  translated = translated
    .replace(/ر\.س\.?/g, "SAR")
    .replace(/دانية/g, "Dania");

  translated = toWesternDigits(translated);

  return `${leading}${translated}${trailing}`;
}

function translateDom(root: HTMLElement, language: Language): void {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let currentNode = walker.nextNode();

  while (currentNode) {
    const textNode = currentNode as Text;
    const parent = textNode.parentElement;
    const currentValue = textNode.nodeValue ?? "";

    if (parent?.closest('[data-live-value="true"]')) {
      TEXT_NODE_ORIGINALS.set(textNode, currentValue);
      currentNode = walker.nextNode();
      continue;
    }

    if (
      parent &&
      !["SCRIPT", "STYLE", "CODE", "PRE"].includes(parent.tagName)
    ) {
      let original = TEXT_NODE_ORIGINALS.get(textNode);

      if (original === undefined) {
        original = currentValue;
        TEXT_NODE_ORIGINALS.set(textNode, original);
      } else {
        const expected =
          language === "en" ? translateUiText(original) : original;

        if (
          currentValue !== expected &&
          /[\u0600-\u06FF]/.test(currentValue)
        ) {
          original = currentValue;
          TEXT_NODE_ORIGINALS.set(textNode, original);
        }
      }

      const nextValue =
        language === "en" ? translateUiText(original) : original;

      if (currentValue !== nextValue) {
        textNode.nodeValue = nextValue;
      }
    }

    currentNode = walker.nextNode();
  }

  root.querySelectorAll<HTMLElement>("*").forEach((element) => {
    (["placeholder", "title", "aria-label"] as const).forEach((attribute) => {
      const current = element.getAttribute(attribute);
      if (!current) return;

      const dataKey = `i18nOriginal${attribute
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join("")}`;

      const stored = element.dataset[dataKey];
      let original = stored ?? current;

      if (!stored) {
        element.dataset[dataKey] = current;
      } else {
        const expected =
          language === "en" ? translateUiText(stored) : stored;

        if (current !== expected && /[\u0600-\u06FF]/.test(current)) {
          original = current;
          element.dataset[dataKey] = current;
        }
      }

      const next =
        language === "en" ? translateUiText(original) : original;

      if (current !== next) {
        element.setAttribute(attribute, next);
      }
    });
  });
}


interface DashboardData {
  total_customers?: number;
  customers_count?: number;
  total_invoices?: number;
  invoices_count?: number;
  total_payments?: number;
  payments_total?: number;
  total_shipments?: number;
  shipments_count?: number;
  active_shipments?: number;
  total_revenue?: number;
  revenue?: number;
}

interface NavItem {
  key: ModuleKey;
  label: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  soft: string;
}

interface CustomerInvoice {
  id: string;
  title: string;
  amount: number;
  status: "مدفوعة" | "جزئية" | "متأخرة" | "مسودة";
  issueDate: string;
  dueDate: string;
}

interface CustomerShipment {
  id: string;
  carrier: string;
  route: string;
  status: "تم التسليم" | "في الطريق" | "قيد التجهيز" | "متأخرة";
  date: string;
  tracking: string;
}

interface CustomerPayment {
  id: string;
  method: string;
  amount: number;
  status: "مؤكد" | "قيد المراجعة" | "مرفوض";
  date: string;
}

interface Customer {
  id: string;
  type: CustomerType;
  name: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  status: "نشط" | "متابعة" | "جديد" | "غير نشط";
  joinedAt: string;
  totalOrders: number;
  totalSpent: number;
  outstanding: number;
  vatNumber?: string;
  commercialRegistration?: string;
  companyWebsite?: string;
  contactPerson?: string;
  nationalId?: string;
  invoices: CustomerInvoice[];
  shipments: CustomerShipment[];
  payments: CustomerPayment[];
  notes: string[];
}

interface DeliveryCompany {
  id: string;
  name: string;
  shortName: string;
  description: string;
  domesticPrice: number;
  internationalPrice: number;
  pickupPrice: number;
  internationalPickupPrice: number;
  dropoffPrice: number;
  internationalDropoffPrice: number;
  deliveryTime: string;
  serviceLevel: string;
  coverage: string;
  accent: string;
  glow: string;
}

interface AddCustomerDraft {
  type: CustomerType;
  name: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  nationalId: string;
  vatNumber: string;
  commercialRegistration: string;
  companyWebsite: string;
  contactPerson: string;
}

const navigation: NavItem[] = [
  {
    key: "dashboard",
    label: "لوحة التحكم",
    description: "مركز القيادة",
    icon: LayoutDashboard,
    accent: "from-[#7DAFC0] to-[#85BCAF]",
    soft: "bg-sky-100 text-sky-700",
  },
  {
    key: "customers",
    label: "العملاء",
    description: "أفراد وشركات",
    icon: Users,
    accent: "from-indigo-400 to-violet-400",
    soft: "bg-indigo-100 text-indigo-700",
  },
  {
    key: "carriers",
    label: "شركات التوصيل",
    description: "الأسعار والاستلام",
    icon: Truck,
    accent: "from-[#75B9B1] to-[#79ABC2]",
    soft: "bg-teal-100 text-teal-700",
  },
  {
    key: "orders",
    label: "الطلبات",
    description: "متابعة الدورة",
    icon: ShoppingCart,
    accent: "from-pink-300 to-fuchsia-400",
    soft: "bg-pink-100 text-pink-700",
  },
  {
    key: "invoices",
    label: "الفواتير",
    description: "الإصدار والتحصيل",
    icon: ReceiptText,
    accent: "from-[#AAA3C5] to-[#9C91B5]",
    soft: "bg-violet-100 text-violet-700",
  },
  {
    key: "payments",
    label: "المدفوعات",
    description: "التسويات المالية",
    icon: WalletCards,
    accent: "from-[#91C5B2] to-[#7FAFA6]",
    soft: "bg-emerald-100 text-emerald-700",
  },
  {
    key: "shipments",
    label: "الشحنات",
    description: "التتبع والتسليم",
    icon: PackageCheck,
    accent: "from-[#D1A786] to-[#DDC392]",
    soft: "bg-orange-100 text-orange-700",
  },
  {
    key: "inventory",
    label: "المخزون",
    description: "الكميات والحركات",
    icon: Boxes,
    accent: "from-[#D2A8B3] to-[#C9A6B8]",
    soft: "bg-rose-100 text-rose-700",
  },
  {
    key: "reports",
    label: "التقارير",
    description: "لوحات وتحليلات",
    icon: BarChart3,
    accent: "from-[#8FAFCB] to-[#8E9FBC]",
    soft: "bg-blue-100 text-blue-700",
  },
  {
    key: "ai",
    label: "الذكاء التشغيلي",
    description: "توصيات وتوقعات",
    icon: BrainCircuit,
    accent: "from-[#C1A4BE] to-[#9C91B5]",
    soft: "bg-fuchsia-100 text-fuchsia-700",
  },
  {
    key: "users",
    label: "المستخدمون",
    description: "الحسابات والصلاحيات",
    icon: UserCog,
    accent: "from-[#91C8C6] to-[#7DAFC0]",
    soft: "bg-cyan-100 text-cyan-700",
  },
  {
    key: "settings",
    label: "الإعدادات",
    description: "تهيئة النظام",
    icon: Settings,
    accent: "from-slate-300 to-slate-400",
    soft: "bg-slate-100 text-slate-700",
  },
];

const demoCustomers: Customer[] = [
  {
    id: "CUS-1048",
    type: "company",
    name: "شركة الأفق للمقاولات",
    email: "contact@alofuq.sa",
    phone: "+966 55 123 8890",
    city: "الرياض",
    address: "طريق الملك فهد، حي العليا",
    status: "نشط",
    joinedAt: "12 يناير 2025",
    totalOrders: 24,
    totalSpent: 284500,
    outstanding: 38750,
    vatNumber: "310123456700003",
    commercialRegistration: "1010887456",
    companyWebsite: "www.alofuq.sa",
    contactPerson: "أحمد السالم",
    invoices: [
      {
        id: "INV-2026-018",
        title: "خدمات تطوير وربط أنظمة",
        amount: 38750,
        status: "مدفوعة",
        issueDate: "18 يوليو 2026",
        dueDate: "25 يوليو 2026",
      },
      {
        id: "INV-2026-011",
        title: "اشتراك دعم سنوي",
        amount: 24000,
        status: "جزئية",
        issueDate: "01 يوليو 2026",
        dueDate: "15 يوليو 2026",
      },
      {
        id: "INV-2026-003",
        title: "أجهزة شبكات",
        amount: 68500,
        status: "متأخرة",
        issueDate: "18 يونيو 2026",
        dueDate: "30 يونيو 2026",
      },
    ],
    shipments: [
      {
        id: "SHP-2026-025",
        carrier: "أرامكس",
        route: "الرياض ← جدة",
        status: "في الطريق",
        date: "18 يوليو 2026",
        tracking: "ARX-93847562",
      },
      {
        id: "SHP-2026-019",
        carrier: "سبل",
        route: "الرياض ← الدمام",
        status: "تم التسليم",
        date: "06 يوليو 2026",
        tracking: "SPL-84019273",
      },
    ],
    payments: [
      {
        id: "PAY-2026-041",
        method: "تحويل بنكي",
        amount: 38750,
        status: "مؤكد",
        date: "18 يوليو 2026",
      },
      {
        id: "PAY-2026-030",
        method: "مدى",
        amount: 12000,
        status: "مؤكد",
        date: "03 يوليو 2026",
      },
    ],
    notes: [
      "يفضل العميل استلام تحديث أسبوعي عبر البريد.",
      "المخول بالتوقيع: أحمد السالم.",
      "يوجد اهتمام بخدمة الدعم الممتد.",
    ],
  },
  {
    id: "CUS-1047",
    type: "individual",
    name: "سارة محمد العتيبي",
    email: "sara.alotaibi@email.com",
    phone: "+966 50 882 1144",
    city: "جدة",
    address: "حي الروضة، شارع الأمير سلطان",
    status: "متابعة",
    joinedAt: "03 مارس 2026",
    totalOrders: 7,
    totalSpent: 42700,
    outstanding: 7200,
    nationalId: "1098456732",
    invoices: [
      {
        id: "INV-2026-014",
        title: "اشتراك خدمة سكني برو",
        amount: 14800,
        status: "جزئية",
        issueDate: "10 يوليو 2026",
        dueDate: "22 يوليو 2026",
      },
    ],
    shipments: [
      {
        id: "SHP-2026-021",
        carrier: "سمسا",
        route: "الرياض ← جدة",
        status: "قيد التجهيز",
        date: "17 يوليو 2026",
        tracking: "SMSA-5910283",
      },
    ],
    payments: [
      {
        id: "PAY-2026-038",
        method: "بطاقة ائتمانية",
        amount: 7600,
        status: "مؤكد",
        date: "11 يوليو 2026",
      },
    ],
    notes: ["تفضل التواصل عبر واتساب بعد الساعة 4 مساءً."],
  },
  {
    id: "CUS-1046",
    type: "company",
    name: "مجموعة البنيان التجارية",
    email: "sales@albonyan.sa",
    phone: "+966 54 441 2030",
    city: "الدمام",
    address: "حي الشاطئ الغربي",
    status: "جديد",
    joinedAt: "16 يوليو 2026",
    totalOrders: 3,
    totalSpent: 125000,
    outstanding: 92000,
    vatNumber: "310987654300003",
    commercialRegistration: "2050918843",
    companyWebsite: "www.albonyan.sa",
    contactPerson: "خالد العنزي",
    invoices: [
      {
        id: "INV-2026-017",
        title: "تطوير تطبيق مخصص",
        amount: 92000,
        status: "مسودة",
        issueDate: "17 يوليو 2026",
        dueDate: "01 أغسطس 2026",
      },
    ],
    shipments: [],
    payments: [
      {
        id: "PAY-2026-040",
        method: "تحويل بنكي",
        amount: 33000,
        status: "قيد المراجعة",
        date: "17 يوليو 2026",
      },
    ],
    notes: ["العميل في مرحلة اعتماد العرض النهائي."],
  },
  {
    id: "CUS-1045",
    type: "individual",
    name: "عبدالله ناصر الحربي",
    email: "abdullah.harbi@email.com",
    phone: "+966 56 901 5533",
    city: "المدينة المنورة",
    address: "حي العزيزية",
    status: "نشط",
    joinedAt: "28 فبراير 2026",
    totalOrders: 11,
    totalSpent: 58400,
    outstanding: 0,
    nationalId: "1083341298",
    invoices: [
      {
        id: "INV-2026-012",
        title: "أجهزة وملحقات",
        amount: 7200,
        status: "مدفوعة",
        issueDate: "08 يوليو 2026",
        dueDate: "08 يوليو 2026",
      },
    ],
    shipments: [
      {
        id: "SHP-2026-020",
        carrier: "أرامكس",
        route: "جدة ← المدينة",
        status: "تم التسليم",
        date: "10 يوليو 2026",
        tracking: "ARX-30195822",
      },
    ],
    payments: [
      {
        id: "PAY-2026-036",
        method: "مدى",
        amount: 7200,
        status: "مؤكد",
        date: "08 يوليو 2026",
      },
    ],
    notes: ["عميل متكرر ومنتظم في السداد."],
  },
];

const deliveryCompanies: DeliveryCompany[] = [
  {
    id: "aramex",
    name: "أرامكس",
    shortName: "ARX",
    description: "تغطية قوية للشحن المحلي والدولي",
    domesticPrice: 13,
    internationalPrice: 79,
    pickupPrice: 7,
    internationalPickupPrice: 13,
    dropoffPrice: 1,
    internationalDropoffPrice: 4,
    deliveryTime: "1–3 أيام",
    serviceLevel: "أولوية",
    coverage: "محلي ودولي",
    accent: "from-[#75B9B1] to-[#79ABC2]",
    glow: "bg-teal-300/20",
  },
  {
    id: "smsa",
    name: "سمسا إكسبريس",
    shortName: "SMSA",
    description: "سرعة عالية داخل المدن الرئيسية",
    domesticPrice: 16,
    internationalPrice: 85,
    pickupPrice: 6,
    internationalPickupPrice: 12,
    dropoffPrice: 2,
    internationalDropoffPrice: 5,
    deliveryTime: "1–2 يوم",
    serviceLevel: "سريع",
    coverage: "محلي وخليجي",
    accent: "from-sky-300 to-indigo-400",
    glow: "bg-sky-300/30",
  },
  {
    id: "spl",
    name: "سبل",
    shortName: "SPL",
    description: "خيار اقتصادي مع انتشار واسع",
    domesticPrice: 11,
    internationalPrice: 69,
    pickupPrice: 5,
    internationalPickupPrice: 10,
    dropoffPrice: 1,
    internationalDropoffPrice: 3,
    deliveryTime: "2–4 أيام",
    serviceLevel: "اقتصادي",
    coverage: "داخل المملكة",
    accent: "from-[#91C5B2] to-[#7FAFA6]",
    glow: "bg-emerald-300/30",
  },
];

interface InvoiceRecord {
  id: string;
  customer: string;
  customerType: CustomerType;
  title: string;
  amount: number;
  paid: number;
  status: "مدفوعة" | "جزئية" | "متأخرة" | "مسودة";
  issueDate: string;
  dueDate: string;
  category: string;
  notes?: string;
}

interface InvoiceLineDraft {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

interface InvoiceDraft {
  customer: string;
  customerType: CustomerType;
  category: string;
  issueDate: string;
  dueDate: string;
  notes: string;
  lines: InvoiceLineDraft[];
}

interface PaymentRecord {
  id: string;
  customer: string;
  invoice: string;
  amount: number;
  method: "تحويل بنكي" | "مدى" | "بطاقة ائتمانية" | "نقدي";
  status: "مؤكد" | "قيد المراجعة" | "مرفوض";
  date: string;
  reference: string;
}

interface ShipmentRecord {
  id: string;
  customer: string;
  carrier: string;
  route: string;
  status: "قيد التجهيز" | "تم الاستلام" | "في الطريق" | "تم التسليم";
  progress: number;
  tracking: string;
  eta: string;
  pieces: number;
  mode: "استلام من الموقع" | "تسليم للفرع";
}

interface InventoryRecord {
  id: string;
  name: string;
  category: string;
  sku: string;
  stock: number;
  minimum: number;
  maximum: number;
  warehouse: string;
  unitValue: number;
  movement: number;
}

interface ReportRecord {
  id: string;
  title: string;
  description: string;
  type: "مالي" | "عملاء" | "تشغيلي" | "مخزون";
  format: "PDF" | "Excel" | "Dashboard";
  period: string;
  updatedAt: string;
  status: "جاهز" | "قيد الإنشاء" | "مجدول";
}

interface InsightRecord {
  id: string;
  title: string;
  description: string;
  category: "تحصيل" | "مخزون" | "عملاء" | "شحن";
  confidence: number;
  impact: "مرتفع" | "متوسط" | "منخفض";
  action: string;
}

interface AiAnswer {
  title: string;
  summary: string;
  evidence: string[];
  actions: string[];
  confidence: number;
}


interface OrderRecord {
  id: string;
  customer: string;
  customerType: CustomerType;
  title: string;
  amount: number;
  status: "جديد" | "بانتظار الاعتماد" | "قيد التنفيذ" | "جاهز للشحن" | "مكتمل";
  priority: "عالية" | "متوسطة" | "عادية";
  createdAt: string;
  dueDate: string;
  owner: string;
  progress: number;
  invoiceReady: boolean;
  shipmentReady: boolean;
  notes: string;
}

interface OrderDraft {
  customer: string;
  customerType: CustomerType;
  title: string;
  amount: number;
  priority: OrderRecord["priority"];
  dueDate: string;
  owner: string;
  notes: string;
}

interface UserRecord {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: "مدير النظام" | "محاسب" | "مبيعات" | "خدمة عملاء" | "مخزون" | "مشاهد";
  department: string;
  status: "نشط" | "موقوف" | "دعوة معلقة";
  lastActive: string;
  joinedAt: string;
  permissions: string[];
}

interface UserDraft {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: UserRecord["role"];
  department: string;
  status: UserRecord["status"];
}



type TaskStatus = "مفتوحة" | "مكتملة";
type ApprovalStatus = "بانتظار الاعتماد" | "معتمد" | "مرفوض";

interface DailyTask {
  id: string;
  title: string;
  description: string;
  module: ModuleKey;
  priority: "عالية" | "متوسطة" | "عادية";
  status: TaskStatus;
  due: string;
}

interface ApprovalItem {
  id: string;
  type: "طلب" | "دفعة" | "فاتورة" | "خصم";
  title: string;
  description: string;
  amount?: number;
  module: ModuleKey;
  status: ApprovalStatus;
  requestedBy: string;
  requestedAt: string;
}

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  module: ModuleKey;
  read: boolean;
  tone: "teal" | "blue" | "amber" | "coral";
}

interface ActivityItem {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
  module: ModuleKey;
}

const demoDailyTasks: DailyTask[] = [
  {
    id: "TASK-101",
    title: "متابعة الفواتير المتأخرة",
    description: "التواصل مع أعلى عميلين في الرصيد المفتوح وتحديث نتيجة المتابعة.",
    module: "invoices",
    priority: "عالية",
    status: "مفتوحة",
    due: "اليوم، 11:30 ص",
  },
  {
    id: "TASK-102",
    title: "مراجعة الشحنات القريبة من موعد الوصول",
    description: "التحقق من حالة الناقل قبل إرسال تحديثات العملاء.",
    module: "shipments",
    priority: "متوسطة",
    status: "مفتوحة",
    due: "اليوم، 1:00 م",
  },
  {
    id: "TASK-103",
    title: "اعتماد طلب توريد المخزون",
    description: "مراجعة الأصناف الواقعة تحت الحد الأدنى واعتماد الكمية المقترحة.",
    module: "inventory",
    priority: "عالية",
    status: "مفتوحة",
    due: "اليوم، 2:30 م",
  },
  {
    id: "TASK-104",
    title: "تحديث ملف عميل رئيسي",
    description: "إضافة الملاحظات الجديدة وربط آخر دفعة بملف العميل 360°.",
    module: "customers",
    priority: "عادية",
    status: "مكتملة",
    due: "تمت اليوم",
  },
];

const demoApprovals: ApprovalItem[] = [
  {
    id: "APR-401",
    type: "دفعة",
    title: "اعتماد دفعة مؤسسة رواد الأعمال",
    description: "المرجع البنكي مرفق ويحتاج مراجعة نهائية قبل الربط بالفاتورة.",
    amount: 18500,
    module: "payments",
    status: "بانتظار الاعتماد",
    requestedBy: "قسم المحاسبة",
    requestedAt: "منذ 18 دقيقة",
  },
  {
    id: "APR-402",
    type: "طلب",
    title: "اعتماد نطاق تطوير تطبيق مخصص",
    description: "نطاق العمل والسعر النهائي جاهزان قبل بدء التنفيذ.",
    amount: 92000,
    module: "orders",
    status: "بانتظار الاعتماد",
    requestedBy: "قسم المبيعات",
    requestedAt: "منذ 42 دقيقة",
  },
  {
    id: "APR-403",
    type: "خصم",
    title: "طلب خصم استثنائي 7%",
    description: "الخصم مرتبط بتجديد عقد الدعم السنوي لعميل حالي.",
    amount: 1680,
    module: "invoices",
    status: "بانتظار الاعتماد",
    requestedBy: "إدارة الحسابات",
    requestedAt: "منذ ساعة",
  },
];

const demoNotifications: NotificationItem[] = [
  {
    id: "NOT-1",
    title: "فاتورة تجاوزت موعد الاستحقاق",
    description: "فاتورة مؤسسة رواد الأعمال تحتاج متابعة اليوم.",
    time: "منذ 8 دقائق",
    module: "invoices",
    read: false,
    tone: "amber",
  },
  {
    id: "NOT-2",
    title: "دفعة جاهزة للمراجعة",
    description: "تم رفع المرجع البنكي لدفعة بقيمة 18,500 ر.س.",
    time: "منذ 18 دقيقة",
    module: "payments",
    read: false,
    tone: "teal",
  },
  {
    id: "NOT-3",
    title: "تنبيه مخزون",
    description: "أجهزة الشبكات وصلت إلى الحد الأدنى.",
    time: "منذ 35 دقيقة",
    module: "inventory",
    read: false,
    tone: "coral",
  },
  {
    id: "NOT-4",
    title: "تحديث شحنة",
    description: "تم استلام شحنة شركة الأفق من الناقل.",
    time: "منذ ساعتين",
    module: "shipments",
    read: true,
    tone: "blue",
  },
];

const demoActivities: ActivityItem[] = [
  {
    id: "ACT-1",
    user: "دانية المطلق",
    action: "اعتمدت دفعة",
    target: "PAY-2026-031",
    time: "منذ 12 دقيقة",
    module: "payments",
  },
  {
    id: "ACT-2",
    user: "أحمد السالم",
    action: "حدّث حالة طلب",
    target: "ORD-2026-091",
    time: "منذ 28 دقيقة",
    module: "orders",
  },
  {
    id: "ACT-3",
    user: "سارة خالد",
    action: "أضافت ملاحظة للعميل",
    target: "شركة الأفق للمقاولات",
    time: "منذ 45 دقيقة",
    module: "customers",
  },
  {
    id: "ACT-4",
    user: "خالد محمد",
    action: "حدّث رقم التتبع",
    target: "SHP-2026-118",
    time: "منذ ساعة",
    module: "shipments",
  },
];

const demoOrders: OrderRecord[] = [
  {
    id: "ORD-2026-091",
    customer: "شركة الأفق للمقاولات",
    customerType: "company",
    title: "توريد وربط أجهزة الشبكة",
    amount: 68500,
    status: "قيد التنفيذ",
    priority: "عالية",
    createdAt: "18 يوليو 2026",
    dueDate: "28 يوليو 2026",
    owner: "أحمد السالم",
    progress: 62,
    invoiceReady: true,
    shipmentReady: false,
    notes: "يجب التأكد من توفر أجهزة الشبكة قبل تجهيز الشحنة.",
  },
  {
    id: "ORD-2026-090",
    customer: "مجموعة البنيان التجارية",
    customerType: "company",
    title: "تطوير تطبيق مخصص",
    amount: 92000,
    status: "بانتظار الاعتماد",
    priority: "عالية",
    createdAt: "17 يوليو 2026",
    dueDate: "15 أغسطس 2026",
    owner: "سارة خالد",
    progress: 18,
    invoiceReady: false,
    shipmentReady: false,
    notes: "بانتظار اعتماد نطاق العمل والدفعة الأولى.",
  },
  {
    id: "ORD-2026-089",
    customer: "سارة محمد العتيبي",
    customerType: "individual",
    title: "اشتراك سكني برو",
    amount: 14800,
    status: "جديد",
    priority: "متوسطة",
    createdAt: "17 يوليو 2026",
    dueDate: "24 يوليو 2026",
    owner: "نورة العتيبي",
    progress: 8,
    invoiceReady: false,
    shipmentReady: false,
    notes: "التواصل مع العميل لتأكيد بيانات الاشتراك.",
  },
  {
    id: "ORD-2026-088",
    customer: "عبدالله ناصر الحربي",
    customerType: "individual",
    title: "أجهزة وملحقات مكتبية",
    amount: 7200,
    status: "جاهز للشحن",
    priority: "عادية",
    createdAt: "12 يوليو 2026",
    dueDate: "20 يوليو 2026",
    owner: "خالد محمد",
    progress: 88,
    invoiceReady: true,
    shipmentReady: true,
    notes: "تم تجهيز جميع القطع والتحقق من العنوان.",
  },
  {
    id: "ORD-2026-087",
    customer: "شركة رؤية الأعمال",
    customerType: "company",
    title: "خدمة دعم وتشغيل سنوية",
    amount: 24000,
    status: "مكتمل",
    priority: "عادية",
    createdAt: "02 يوليو 2026",
    dueDate: "10 يوليو 2026",
    owner: "ريم عبدالله",
    progress: 100,
    invoiceReady: true,
    shipmentReady: true,
    notes: "تم التسليم وإغلاق الطلب بنجاح.",
  },
];

const demoUsers: UserRecord[] = [
  {
    id: "USR-001",
    name: "دانية المطلق",
    email: "admin123@gmail.com",
    password: "123456",
    phone: "+966 55 100 2030",
    role: "مدير النظام",
    department: "الإدارة",
    status: "نشط",
    lastActive: "الآن",
    joinedAt: "01 يوليو 2026",
    permissions: ["لوحة التحكم", "العملاء", "الفواتير", "المدفوعات", "الشحنات", "المخزون", "التقارير", "المستخدمون"],
  },
  {
    id: "USR-002",
    name: "أحمد السالم",
    email: "ahmed@ertikaz.sa",
    password: "Ahmed@2026",
    phone: "+966 54 220 8140",
    role: "مبيعات",
    department: "المبيعات",
    status: "نشط",
    lastActive: "منذ 12 دقيقة",
    joinedAt: "04 يوليو 2026",
    permissions: ["العملاء", "الطلبات", "الفواتير"],
  },
  {
    id: "USR-003",
    name: "نورة العتيبي",
    email: "noura@ertikaz.sa",
    password: "Noura@2026",
    phone: "+966 50 410 6621",
    role: "خدمة عملاء",
    department: "خدمة العملاء",
    status: "نشط",
    lastActive: "منذ ساعة",
    joinedAt: "07 يوليو 2026",
    permissions: ["العملاء", "الطلبات", "الشحنات"],
  },
  {
    id: "USR-004",
    name: "سلمان خالد",
    email: "salman@ertikaz.sa",
    password: "Salman@2026",
    phone: "+966 56 330 1918",
    role: "محاسب",
    department: "المالية",
    status: "دعوة معلقة",
    lastActive: "لم يسجل الدخول",
    joinedAt: "18 يوليو 2026",
    permissions: ["الفواتير", "المدفوعات", "التقارير"],
  },
];

const demoInvoices: InvoiceRecord[] = [
  {
    id: "INV-2026-018",
    customer: "شركة الأفق للمقاولات",
    customerType: "company",
    title: "خدمات تطوير وربط أنظمة",
    amount: 38750,
    paid: 38750,
    status: "مدفوعة",
    issueDate: "18 يوليو 2026",
    dueDate: "25 يوليو 2026",
    category: "خدمات تقنية",
  },
  {
    id: "INV-2026-017",
    customer: "مجموعة البنيان التجارية",
    customerType: "company",
    title: "تطوير تطبيق مخصص",
    amount: 92000,
    paid: 33000,
    status: "جزئية",
    issueDate: "17 يوليو 2026",
    dueDate: "01 أغسطس 2026",
    category: "تطوير برمجيات",
  },
  {
    id: "INV-2026-016",
    customer: "مؤسسة رواد الأعمال",
    customerType: "company",
    title: "اشتراك دعم سنوي",
    amount: 18500,
    paid: 0,
    status: "متأخرة",
    issueDate: "15 يوليو 2026",
    dueDate: "17 يوليو 2026",
    category: "دعم فني",
  },
  {
    id: "INV-2026-015",
    customer: "سارة محمد العتيبي",
    customerType: "individual",
    title: "اشتراك خدمة سكني برو",
    amount: 14800,
    paid: 7600,
    status: "جزئية",
    issueDate: "10 يوليو 2026",
    dueDate: "22 يوليو 2026",
    category: "اشتراك",
  },
  {
    id: "INV-2026-014",
    customer: "شركة مدار التقنية",
    customerType: "company",
    title: "حل إدارة علاقات العملاء",
    amount: 29500,
    paid: 0,
    status: "مسودة",
    issueDate: "09 يوليو 2026",
    dueDate: "30 يوليو 2026",
    category: "برمجيات",
  },
];

const demoPayments: PaymentRecord[] = [
  {
    id: "PAY-2026-041",
    customer: "شركة الأفق للمقاولات",
    invoice: "INV-2026-018",
    amount: 38750,
    method: "تحويل بنكي",
    status: "مؤكد",
    date: "18 يوليو 2026",
    reference: "TRX-883471",
  },
  {
    id: "PAY-2026-040",
    customer: "مجموعة البنيان التجارية",
    invoice: "INV-2026-017",
    amount: 33000,
    method: "تحويل بنكي",
    status: "قيد المراجعة",
    date: "17 يوليو 2026",
    reference: "TRX-883090",
  },
  {
    id: "PAY-2026-039",
    customer: "سارة محمد العتيبي",
    invoice: "INV-2026-015",
    amount: 7600,
    method: "مدى",
    status: "مؤكد",
    date: "11 يوليو 2026",
    reference: "MADA-401227",
  },
  {
    id: "PAY-2026-038",
    customer: "شركة مدار التقنية",
    invoice: "INV-2026-012",
    amount: 7200,
    method: "بطاقة ائتمانية",
    status: "مرفوض",
    date: "08 يوليو 2026",
    reference: "CARD-810039",
  },
  {
    id: "PAY-2026-037",
    customer: "عبدالله ناصر الحربي",
    invoice: "INV-2026-010",
    amount: 9800,
    method: "نقدي",
    status: "مؤكد",
    date: "05 يوليو 2026",
    reference: "CASH-0715",
  },
];

const demoShipments: ShipmentRecord[] = [
  {
    id: "SHP-2026-025",
    customer: "شركة الأفق للمقاولات",
    carrier: "أرامكس",
    route: "الرياض ← جدة",
    status: "في الطريق",
    progress: 68,
    tracking: "ARX-93847562",
    eta: "غدًا، 2:00 م",
    pieces: 12,
    mode: "استلام من الموقع",
  },
  {
    id: "SHP-2026-024",
    customer: "مجموعة البنيان التجارية",
    carrier: "سمسا",
    route: "الرياض ← الدمام",
    status: "تم الاستلام",
    progress: 32,
    tracking: "SMSA-4901827",
    eta: "20 يوليو",
    pieces: 8,
    mode: "تسليم للفرع",
  },
  {
    id: "SHP-2026-023",
    customer: "سارة محمد العتيبي",
    carrier: "سبل",
    route: "جدة ← مكة",
    status: "قيد التجهيز",
    progress: 12,
    tracking: "SPL-8840192",
    eta: "21 يوليو",
    pieces: 3,
    mode: "استلام من الموقع",
  },
  {
    id: "SHP-2026-022",
    customer: "عبدالله ناصر الحربي",
    carrier: "أرامكس",
    route: "جدة ← المدينة",
    status: "تم التسليم",
    progress: 100,
    tracking: "ARX-30195822",
    eta: "تم التسليم",
    pieces: 5,
    mode: "تسليم للفرع",
  },
  {
    id: "SHP-2026-021",
    customer: "شركة مدار التقنية",
    carrier: "سمسا",
    route: "الرياض ← القصيم",
    status: "في الطريق",
    progress: 74,
    tracking: "SMSA-5192840",
    eta: "اليوم، 6:00 م",
    pieces: 4,
    mode: "استلام من الموقع",
  },
];

const demoInventory: InventoryRecord[] = [
  {
    id: "STK-501",
    name: "أجهزة حاسوب محمولة",
    category: "أجهزة",
    sku: "LTP-14-PRO",
    stock: 42,
    minimum: 12,
    maximum: 60,
    warehouse: "المستودع الرئيسي",
    unitValue: 3750,
    movement: 18,
  },
  {
    id: "STK-500",
    name: "أجهزة شبكة",
    category: "شبكات",
    sku: "NET-SW-24",
    stock: 9,
    minimum: 15,
    maximum: 55,
    warehouse: "المستودع الرئيسي",
    unitValue: 1200,
    movement: -9,
  },
  {
    id: "STK-499",
    name: "شاشات مكتبية",
    category: "أجهزة",
    sku: "MON-27-QHD",
    stock: 27,
    minimum: 10,
    maximum: 45,
    warehouse: "مستودع جدة",
    unitValue: 980,
    movement: 12,
  },
  {
    id: "STK-498",
    name: "خوادم أعمال",
    category: "خوادم",
    sku: "SRV-RACK-8",
    stock: 3,
    minimum: 5,
    maximum: 18,
    warehouse: "المستودع الرئيسي",
    unitValue: 18500,
    movement: -4,
  },
  {
    id: "STK-497",
    name: "نقاط وصول لاسلكية",
    category: "شبكات",
    sku: "WAP-AX6",
    stock: 18,
    minimum: 8,
    maximum: 35,
    warehouse: "مستودع جدة",
    unitValue: 680,
    movement: 6,
  },
  {
    id: "STK-496",
    name: "ملحقات وأجهزة طرفية",
    category: "ملحقات",
    sku: "ACC-BUNDLE",
    stock: 86,
    minimum: 25,
    maximum: 110,
    warehouse: "المستودع الرئيسي",
    unitValue: 210,
    movement: 24,
  },
];

const demoReports: ReportRecord[] = [
  {
    id: "RPT-118",
    title: "تقرير المبيعات والتحصيل",
    description: "قراءة شاملة للإيرادات، الدفعات، والفواتير المتأخرة.",
    type: "مالي",
    format: "Dashboard",
    period: "يوليو 2026",
    updatedAt: "منذ 8 دقائق",
    status: "جاهز",
  },
  {
    id: "RPT-117",
    title: "صحة علاقات العملاء",
    description: "قيمة العملاء، تكرار الطلبات، وفرص البيع الإضافي.",
    type: "عملاء",
    format: "PDF",
    period: "الربع الثاني",
    updatedAt: "اليوم، 10:20 ص",
    status: "جاهز",
  },
  {
    id: "RPT-116",
    title: "أداء التوصيل والشحن",
    description: "مقارنة الشركات، متوسط زمن التسليم، وحالات التعثر.",
    type: "تشغيلي",
    format: "Excel",
    period: "آخر 30 يومًا",
    updatedAt: "أمس",
    status: "قيد الإنشاء",
  },
  {
    id: "RPT-115",
    title: "نبض المخزون",
    description: "الأصناف الحرجة، قيمة المخزون، وسرعة الدوران.",
    type: "مخزون",
    format: "Dashboard",
    period: "تحديث يومي",
    updatedAt: "منذ ساعة",
    status: "جاهز",
  },
  {
    id: "RPT-114",
    title: "ملخص الإدارة الأسبوعي",
    description: "أهم المؤشرات والقرارات المطلوبة في صفحة واحدة.",
    type: "تشغيلي",
    format: "PDF",
    period: "هذا الأسبوع",
    updatedAt: "مجدول الأحد",
    status: "مجدول",
  },
];

const demoInsights: InsightRecord[] = [
  {
    id: "AI-061",
    title: "مخزون أجهزة الشبكات سيصل للحد الحرج",
    description:
      "بمعدل الصرف الحالي، سيصل الصنف NET-SW-24 إلى أقل من الحد الأدنى خلال 6 أيام.",
    category: "مخزون",
    confidence: 91,
    impact: "مرتفع",
    action: "إنشاء طلب إعادة توريد",
  },
  {
    id: "AI-060",
    title: "فرصة تحصيل مبكر مع مجموعة البنيان",
    description:
      "العميل يسدد عادة خلال 48 ساعة من إرسال تذكير مخصص مع ملخص مراحل المشروع.",
    category: "تحصيل",
    confidence: 86,
    impact: "مرتفع",
    action: "إرسال تذكير ذكي",
  },
  {
    id: "AI-059",
    title: "فرصة بيع إضافية لشركة الأفق",
    description:
      "سلوك الطلبات يشير إلى احتياج محتمل لخدمة الدعم الممتد وربط التقارير.",
    category: "عملاء",
    confidence: 82,
    impact: "متوسط",
    action: "إنشاء فرصة مبيعات",
  },
  {
    id: "AI-058",
    title: "سمسا أسرع للشحنات الشرقية هذا الأسبوع",
    description:
      "متوسط التسليم إلى الدمام أقل بـ 0.8 يوم مقارنة بالخيارات الأخرى.",
    category: "شحن",
    confidence: 78,
    impact: "متوسط",
    action: "اعتماد التوصية للشحنة القادمة",
  },
];

const emptyDraft: AddCustomerDraft = {
  type: "individual",
  name: "",
  email: "",
  phone: "",
  city: "",
  address: "",
  nationalId: "",
  vatNumber: "",
  commercialRegistration: "",
  companyWebsite: "",
  contactPerson: "",
};

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("ar-SA", {
    style: "currency",
    currency: "SAR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("ar-SA").format(value);
}

function statusTone(status: string): string {
  if (
    [
      "نشط",
      "مدفوعة",
      "مؤكد",
      "تم التسليم",
      "متوفر",
      "جاهز",
      "تم الاعتماد",
    ].includes(status)
  ) {
    return "bg-emerald-50 text-emerald-700 ring-emerald-200";
  }
  if (
    [
      "متابعة",
      "جزئية",
      "في الطريق",
      "قيد المراجعة",
      "قيد التحصيل",
      "قيد الإنشاء",
    ].includes(status)
  ) {
    return "bg-sky-50 text-sky-700 ring-sky-200";
  }
  if (["جديد", "قيد التجهيز", "مسودة", "مجدول", "فرصة"].includes(status)) {
    return "bg-violet-50 text-violet-700 ring-violet-200";
  }
  return "bg-amber-50 text-amber-700 ring-amber-200";
}


const MODULE_PERMISSION: Partial<Record<ModuleKey, string>> = {
  dashboard: "لوحة التحكم",
  customers: "العملاء",
  orders: "الطلبات",
  invoices: "الفواتير",
  payments: "المدفوعات",
  shipments: "الشحنات",
  carriers: "الشحنات",
  inventory: "المخزون",
  reports: "التقارير",
  ai: "التقارير",
  users: "المستخدمون",
  settings: "المستخدمون",
};

function canAccessModule(user: UserRecord, module: ModuleKey): boolean {
  if (user.role === "مدير النظام") return true;
  const permission = MODULE_PERMISSION[module];
  return !permission || user.permissions.includes(permission);
}

function firstName(value: string): string {
  return value.trim().split(/\s+/)[0] || value;
}

function AnimatedBackground({ theme }: { theme: ThemeMode }) {
  const dark = theme === "dark";
  const line = dark ? "border-[#315b63]/25" : "border-[#84c8c4]/32";
  const ribbon = dark ? "bg-[#0d2d34]/45" : "bg-[#e7f6f3]/62";
  const ring = dark ? "border-[#35656c]/24" : "border-[#76bbb8]/32";

  return (
    <div
      className={`ertikaz-background pointer-events-none fixed inset-0 -z-10 overflow-hidden ${
        dark ? "bg-[#06181e]" : "bg-[#f7fcfb]"
      }`}
      aria-hidden="true"
    >
      <div className={`background-edge-glow absolute -right-32 top-[-10%] h-[72%] w-[46%] rounded-full blur-[115px] ${dark ? "bg-[#0f6c66]/18" : "bg-[#a9e8dc]/38"}`} />
      <div className={`background-edge-glow absolute -left-44 bottom-[-24%] h-[58%] w-[42%] rounded-full blur-[125px] ${dark ? "bg-[#194f67]/12" : "bg-[#b9ddf2]/32"}`} />

      <div className={`background-ribbon ribbon-one absolute -left-[14%] top-[18%] h-28 w-[128%] rotate-[-7deg] rounded-full border ${line} ${ribbon}`} />
      <div className={`background-ribbon ribbon-two absolute -left-[10%] top-[58%] h-32 w-[124%] rotate-[6deg] rounded-full border ${line} ${ribbon}`} />
      <div className={`background-ribbon ribbon-three absolute -left-[12%] top-[38%] h-px w-[130%] rotate-[-5deg] border-t ${line}`} />
      <div className={`background-ribbon ribbon-four absolute -left-[8%] top-[73%] h-px w-[122%] rotate-[5deg] border-t ${line}`} />

      <div className={`soft-ring ring-one absolute left-[6%] top-[38%] h-[340px] w-[340px] rounded-full border ${ring}`} />
      <div className={`soft-ring ring-two absolute left-[11%] top-[35%] h-[176px] w-[176px] rounded-full border ${ring}`} />
      <div className={`soft-ring ring-three absolute right-[8%] top-[16%] h-[255px] w-[255px] rounded-full border ${ring}`} />
      <div className={`soft-ring ring-four absolute left-[46%] top-[53%] h-[130px] w-[130px] rounded-full border ${ring}`} />

      {[
        "left-[6%] top-[11%]",
        "left-[33%] top-[25%]",
        "right-[16%] top-[35%]",
        "right-[28%] bottom-[27%]",
        "left-[19%] bottom-[27%]",
        "right-[12%] bottom-[13%]",
        "left-[52%] top-[10%]",
      ].map((position, index) => (
        <span
          key={position}
          className={`floating-node node-${(index % 5) + 1} absolute ${position} rounded-full ${
            index % 3 === 0
              ? dark ? "h-2.5 w-2.5 bg-[#5faeb2]/70" : "h-2.5 w-2.5 bg-[#26999c]/58"
              : index % 3 === 1
                ? dark ? "h-2 w-2 bg-[#5f91ae]/65" : "h-2 w-2 bg-[#4b9cc6]/52"
                : dark ? "h-2 w-2 bg-[#b59452]/62" : "h-2 w-2 bg-[#c89d43]/52"
          }`}
        />
      ))}
    </div>
  );
}


function Surface({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`ertikaz-surface rounded-[26px] border border-[#d8ebe7] bg-[#fbfefd] shadow-[0_18px_60px_rgba(15,23,42,0.07)] backdrop-blur-xl ${className}`}
    >
      {children}
    </section>
  );
}

function PageIntro({
  eyebrow,
  title,
  description,
  action,
  showDescription = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
  showDescription?: boolean;
}) {
  return (
    <section className="ertikaz-intro relative mb-5 overflow-hidden rounded-[26px] border border-[#d8ebe7] bg-[#fbfefd] p-5 text-slate-900 shadow-[0_18px_52px_rgba(32,91,92,0.08)] sm:p-6">
      <div className="absolute inset-y-0 right-0 w-1.5 bg-[#198f84]" />
      <div className="absolute -left-12 -top-12 h-40 w-40 rounded-full border border-[#d7ece7] bg-[#eef9f6]" />
      <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          {showDescription && (
            <p className="text-[9px] font-bold tracking-[0.14em] text-[#36746f]">
              {eyebrow}
            </p>
          )}
          <h2 className={`${showDescription ? "mt-2" : ""} text-[22px] font-bold leading-[1.4] sm:text-[28px]`}>
            {title}
          </h2>
          {showDescription && (
            <p className="mt-2 max-w-2xl text-[10px] font-medium leading-6 text-slate-600">
              {description}
            </p>
          )}
        </div>
        {action}
      </div>
    </section>
  );
}

function LoginScreen({
  language,
  theme,
  onToggleLanguage,
  onToggleTheme,
  onLogin,
}: {
  language: Language;
  theme: ThemeMode;
  onToggleLanguage: () => void;
  onToggleTheme: () => void;
  onLogin: (email: string, password: string) => string | null;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    const result = onLogin(email.trim().toLowerCase(), password);
    if (result) {
      setError(result);
      setSubmitting(false);
    }
  };

  const ar = language === "ar";

  return (
    <div
      dir={ar ? "rtl" : "ltr"}
      className={`ertikaz-app relative min-h-screen overflow-hidden ${
        theme === "dark" ? "ertikaz-dark" : "ertikaz-light"
      }`}
    >
      <AnimatedBackground theme={theme} />

      <div className={`absolute top-5 z-30 flex gap-2 ${ar ? "left-5" : "right-5"}`}>
        <button
          type="button"
          onClick={onToggleLanguage}
          className="ertikaz-surface flex h-10 items-center gap-2 rounded-xl border border-white/75 bg-white/72 px-3 text-[9px] font-bold text-slate-700 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5"
        >
          <Languages size={15} />
          {ar ? "EN" : "عربي"}
        </button>
        <button
          type="button"
          onClick={onToggleTheme}
          className="ertikaz-surface flex h-10 w-10 items-center justify-center rounded-xl border border-white/75 bg-white/72 text-slate-700 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5"
          aria-label={ar ? "تغيير المظهر" : "Change theme"}
        >
          {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
        </button>
      </div>

      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12 sm:px-6">
        <div className="login-shell grid w-full max-w-[1120px] overflow-hidden rounded-[36px] border border-white/75 bg-white/58 shadow-[0_38px_130px_rgba(73,88,150,.20)] backdrop-blur-2xl lg:grid-cols-[1.08fr_.92fr]">
          <section className="login-visual relative hidden min-h-[680px] overflow-hidden bg-[#dff6fb] p-10 text-[#18304c] lg:flex lg:flex-col lg:justify-between">
            <div className="absolute -left-24 -top-28 h-96 w-96 rounded-full bg-[#77d5e8]/38 blur-3xl" />
            <div className="absolute right-[8%] top-[12%] h-56 w-56 rounded-full bg-[#ffd166]/26 blur-3xl" />
            <div className="absolute -bottom-32 right-[-12%] h-[430px] w-[430px] rounded-full bg-[#6ee7b7]/26 blur-3xl" />
            <div className="login-orbit absolute left-[17%] top-[29%] h-80 w-80 rounded-full border border-white/32" />
            <div className="login-orbit login-orbit-two absolute left-[28%] top-[40%] h-52 w-52 rounded-full border border-white/30" />
            <div className="data-stream stream-one absolute inset-x-[-20%] top-[45%] h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />

            <div className="relative z-10 flex items-center gap-3">
              <span className="flex h-14 w-14 items-center justify-center rounded-[18px] border border-white/45 bg-white/35 p-3 shadow-lg backdrop-blur-xl">
                <Sparkles size={23} />
              </span>
              <div>
                <p className="text-xl font-bold">{ar ? "إرتكاز" : "ERTIKAZ"}</p>
                <p className="mt-1 text-[9px] font-semibold tracking-[.2em] text-[#294967]/65">
                  OPERATIONS PLATFORM
                </p>
              </div>
            </div>

            <div className="relative z-10 max-w-[500px]">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/45 bg-white/28 px-3.5 py-2 text-[8px] font-bold backdrop-blur-xl">
                <ShieldCheck size={13} />
                {ar ? "مساحة عمل موحدة وآمنة" : "A unified and secure workspace"}
              </span>
              <h1 className="mt-6 text-[38px] font-bold leading-[1.5] text-[#142947]">
                {ar
                  ? "إدارة أعمالك تبدأ من هنا"
                  : "Your work starts here"}
              </h1>
              <p className="mt-4 max-w-md text-[11px] font-medium leading-7 text-[#294967]/76">
                {ar
                  ? "وصول منظم إلى العملاء والطلبات والفواتير والشحنات من شاشة واحدة."
                  : "Access customers, orders, invoices, and shipments from one organized workspace."}
              </p>
            </div>

            <div className="relative z-10 max-w-[480px] rounded-[24px] border border-white/45 bg-white/22 p-5 backdrop-blur-xl">
              <p className="text-[9px] font-bold leading-6 text-[#294967]/80">
                {ar
                  ? "بياناتك وصلاحياتك محفوظة ضمن حساب المستخدم."
                  : "Your data and permissions are protected within your user account."}
              </p>
            </div>
          </section>

          <section className="login-card ertikaz-surface flex min-h-[650px] items-center bg-white/88 p-6 sm:p-10 lg:p-12">
            <div className="mx-auto w-full max-w-sm">
              <div className="lg:hidden">
                <span className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-gradient-to-br from-sky-400 via-cyan-400 to-violet-400 p-3 text-white shadow-lg">
                  <Sparkles size={22} />
                </span>
                <p className="mt-3 text-xl font-bold text-slate-900">{ar ? "إرتكاز" : "ERTIKAZ"}</p>
              </div>

              <p className="mt-7 text-[9px] font-bold tracking-[.18em] text-sky-600 lg:mt-0">
                {ar ? "تسجيل الدخول" : "SECURE SIGN IN"}
              </p>
              <h2 className="mt-3 text-[28px] font-bold text-slate-950">
                {ar ? "تسجيل الدخول" : "Sign in"}
              </h2>
              <p className="mt-2 text-[10px] font-medium leading-6 text-slate-500">
                {ar
                  ? "أدخل بيانات حسابك للمتابعة."
                  : "Enter your account details to continue."}
              </p>

              <form onSubmit={submit} className="mt-8 space-y-4">
                <label className="block">
                  <span className="mb-2 block text-[9px] font-bold text-slate-600">
                    {ar ? "البريد الإلكتروني" : "Email address"}
                  </span>
                  <div className="relative">
                    <Mail
                      size={15}
                      className={`absolute top-1/2 -translate-y-1/2 text-sky-500 ${ar ? "right-4" : "left-4"}`}
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        setError("");
                      }}
                      className={`h-12 w-full rounded-2xl border border-sky-100 bg-sky-50/60 text-[10px] font-medium text-slate-800 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100 ${
                        ar ? "pr-11 pl-4" : "pl-11 pr-4"
                      }`}
                      placeholder="name@company.com"
                      autoComplete="username"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-[9px] font-bold text-slate-600">
                    {ar ? "كلمة المرور" : "Password"}
                  </span>
                  <div className="relative">
                    <LockKeyhole
                      size={15}
                      className={`absolute top-1/2 -translate-y-1/2 text-violet-500 ${ar ? "right-4" : "left-4"}`}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        setError("");
                      }}
                      className={`h-12 w-full rounded-2xl border border-violet-100 bg-violet-50/55 text-[10px] font-medium text-slate-800 outline-none transition focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100 ${
                        ar ? "pr-11 pl-12" : "pl-11 pr-12"
                      }`}
                      placeholder="••••••••"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className={`absolute top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white ${
                        ar ? "left-2" : "right-2"
                      }`}
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </label>

                {error && (
                  <div className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-[9px] font-medium text-amber-700">
                    <CircleAlert size={14} />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting || !email || !password}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#38bdf8_0%,#6ee7c8_42%,#8b8cf6_100%)] text-[10px] font-bold text-white shadow-[0_16px_38px_rgba(76,150,222,.28)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_46px_rgba(76,150,222,.34)] disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {submitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <LogOut size={15} className="rotate-180" />
                  )}
                  {ar ? "الدخول إلى النظام" : "Access workspace"}
                </button>
              </form>

              <div className="mt-7 flex items-center justify-center gap-2 text-[8px] font-medium text-slate-400">
                <ShieldCheck size={13} className="text-emerald-500" />
                <span>{ar ? "اتصال آمن وحسابات محمية" : "Secure connection and protected accounts"}</span>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [greeting, setGreeting] = useState("مرحبًا بك، دانية");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [language, setLanguage] = useState<Language>("ar");
  const [theme, setTheme] = useState<ThemeMode>("light");
  const [preferencesReady, setPreferencesReady] = useState(false);
  const [activeModule, setActiveModule] = useState<ModuleKey>("dashboard");
  const [users, setUsers] = useState<UserRecord[]>(demoUsers);
  const [currentUser, setCurrentUser] = useState<UserRecord | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>(demoCustomers);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null,
  );
  const [customerTab, setCustomerTab] = useState<CustomerTab>("overview");
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [deliveryModes, setDeliveryModes] = useState<
    Record<string, DeliveryMode>
  >({
    aramex: "pickup",
    smsa: "dropoff",
    spl: "pickup",
  });
  const [dailyTasks, setDailyTasks] = useState<DailyTask[]>(demoDailyTasks);
  const [approvals, setApprovals] = useState<ApprovalItem[]>(demoApprovals);
  const [notifications, setNotifications] = useState<NotificationItem[]>(demoNotifications);
  const [activityLog, setActivityLog] = useState<ActivityItem[]>(demoActivities);
  const [workflowReady, setWorkflowReady] = useState(false);

  useEffect(() => {
    try {
      const storedTasks = window.localStorage.getItem("ertikaz-daily-tasks");
      const storedApprovals = window.localStorage.getItem("ertikaz-approvals");
      const storedNotifications = window.localStorage.getItem("ertikaz-notifications");
      const storedActivities = window.localStorage.getItem("ertikaz-activities");
      if (storedTasks) setDailyTasks(JSON.parse(storedTasks) as DailyTask[]);
      if (storedApprovals) setApprovals(JSON.parse(storedApprovals) as ApprovalItem[]);
      if (storedNotifications) setNotifications(JSON.parse(storedNotifications) as NotificationItem[]);
      if (storedActivities) setActivityLog(JSON.parse(storedActivities) as ActivityItem[]);
    } catch (error) {
      console.error("Workflow storage error:", error);
    } finally {
      setWorkflowReady(true);
    }
  }, []);

  useEffect(() => {
    if (!workflowReady) return;
    window.localStorage.setItem("ertikaz-daily-tasks", JSON.stringify(dailyTasks));
    window.localStorage.setItem("ertikaz-approvals", JSON.stringify(approvals));
    window.localStorage.setItem("ertikaz-notifications", JSON.stringify(notifications));
    window.localStorage.setItem("ertikaz-activities", JSON.stringify(activityLog));
  }, [activityLog, approvals, dailyTasks, notifications, workflowReady]);

  const currentModule =
    navigation.find((item) => item.key === activeModule) ?? navigation[0];

  const getDashboardData = useCallback(async (isRefresh = false) => {
    try {
      setHasError(false);
      isRefresh ? setRefreshing(true) : setLoading(true);

      const response = await fetch(API_URL, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Dashboard request failed: ${response.status}`);
      }

      const result = (await response.json()) as DashboardData;
      setDashboardData(result);
    } catch (error) {
      console.error("Dashboard API error:", error);
      setHasError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void getDashboardData();
  }, [getDashboardData]);

  useEffect(() => {
    try {
      const storedUsers = window.localStorage.getItem("ertikaz-users");
      const storedSession = window.localStorage.getItem("ertikaz-session");
      const parsedUsers = storedUsers
        ? (JSON.parse(storedUsers) as UserRecord[])
        : demoUsers;
      const storedManager = parsedUsers.find((item) => item.id === "USR-001");
      const sharedManager: UserRecord = {
        ...demoUsers[0],
        ...(storedManager ?? {}),
        id: "USR-001",
        email: "admin123@gmail.com",
        password: "123456",
        status: "نشط",
        role: "مدير النظام",
        permissions: demoUsers[0].permissions,
      };
      const normalizedUsers = [
        sharedManager,
        ...parsedUsers.filter((item) => item.id !== "USR-001"),
      ];
      setUsers(normalizedUsers);
      if (storedSession) {
        const user = normalizedUsers.find((item) => item.email.toLowerCase() === storedSession.toLowerCase() && item.status === "نشط");
        if (user) setCurrentUser(user);
      }
    } catch (error) {
      console.error("Authentication storage error:", error);
      setUsers(demoUsers);
    } finally {
      setAuthReady(true);
    }
  }, []);

  useEffect(() => {
    if (!authReady) return;
    window.localStorage.setItem("ertikaz-users", JSON.stringify(users));
    if (currentUser) {
      const updated = users.find((item) => item.id === currentUser.id);
      if (updated) {
        setCurrentUser(updated);
        window.localStorage.setItem("ertikaz-session", updated.email);
      }
    }
  }, [authReady, users]);

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem(
      "ertikaz-language",
    ) as Language | null;
    const savedTheme = window.localStorage.getItem(
      "ertikaz-theme",
    ) as ThemeMode | null;
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    if (savedLanguage === "ar" || savedLanguage === "en") {
      setLanguage(savedLanguage);
    }

    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
    } else if (systemPrefersDark) {
      setTheme("dark");
    }

    setPreferencesReady(true);
  }, []);

  useEffect(() => {
    if (!preferencesReady) return;

    window.localStorage.setItem("ertikaz-language", language);
    window.localStorage.setItem("ertikaz-theme", theme);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.style.colorScheme = theme;
  }, [language, preferencesReady, theme]);

  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const hour = now.getHours();

      const name = currentUser ? firstName(currentUser.name) : language === "ar" ? "مستخدم" : "User";
      if (language === "ar") {
        setGreeting(
          hour < 12
            ? `صباح الخير، ${name}`
            : hour < 18
              ? `مساء الخير، ${name}`
              : `مساء النور، ${name}`,
        );
      } else {
        setGreeting(
          hour < 12
            ? `Good morning, ${name}`
            : hour < 18
              ? `Good afternoon, ${name}`
              : `Good evening, ${name}`,
        );
      }

      setCurrentDate(
        new Intl.DateTimeFormat(language === "ar" ? "ar-SA" : "en-US", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }).format(now),
      );
    };

    updateDate();
    const timer = window.setInterval(updateDate, 60000);
    return () => window.clearInterval(timer);
  }, [currentUser, language]);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(
      '[data-ertikaz-root="true"]',
    );

    if (!root) return;

    let animationFrame = 0;
    let observer: MutationObserver;

    const applyTranslation = () => {
      observer.disconnect();
      translateDom(root, language);
      observer.observe(root, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ["placeholder", "title", "aria-label"],
      });
    };

    const scheduleTranslation = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(applyTranslation);
    };

    observer = new MutationObserver(scheduleTranslation);
    applyTranslation();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      observer.disconnect();
    };
  }, [activeModule, customerTab, language, selectedCustomerId, showAddCustomer]);

  const login = (email: string, password: string): string | null => {
    const normalizedEmail = email.trim().toLowerCase();

    // Demo manager fallback: keeps the shared review account available on every browser/device.
    // This is suitable only for the current prototype; production authentication must use a backend.
    const isSharedManagerAccount =
      normalizedEmail === "admin123@gmail.com" && password === "123456";

    let user = users.find(
      (item) => item.email.trim().toLowerCase() === normalizedEmail,
    );

    if (isSharedManagerAccount) {
      const defaultManager = demoUsers[0];
      const managerUser: UserRecord = {
        ...defaultManager,
        ...(user ?? {}),
        id: "USR-001",
        name: user?.name || defaultManager.name,
        email: "admin123@gmail.com",
        password: "123456",
        status: "نشط",
        role: "مدير النظام",
        permissions: defaultManager.permissions,
        lastActive: "الآن",
      };

      setUsers((current) => {
        const managerExists = current.some((item) => item.id === "USR-001");
        return managerExists
          ? current.map((item) =>
              item.id === "USR-001" ? managerUser : item,
            )
          : [managerUser, ...current];
      });
      setCurrentUser(managerUser);
      window.localStorage.setItem("ertikaz-session", managerUser.email);
      setActiveModule("dashboard");
      return null;
    }

    if (!user || user.password !== password) {
      return language === "ar"
        ? "البريد الإلكتروني أو رمز الدخول غير صحيح."
        : "Incorrect email or password.";
    }
    if (user.status !== "نشط") {
      return language === "ar"
        ? "هذا الحساب غير نشط. تواصل مع مدير النظام."
        : "This account is not active. Contact the administrator.";
    }
    const updated = { ...user, lastActive: "الآن" };
    setUsers((current) =>
      current.map((item) => (item.id === user.id ? updated : item)),
    );
    setCurrentUser(updated);
    window.localStorage.setItem("ertikaz-session", updated.email);
    setActiveModule("dashboard");
    return null;
  };

  const logout = () => {
    window.localStorage.removeItem("ertikaz-session");
    setCurrentUser(null);
    setActiveModule("dashboard");
  };

  const openModule = (module: ModuleKey) => {
    if (!currentUser || !canAccessModule(currentUser, module)) return;
    setActiveModule(module);
    setSelectedCustomerId(null);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const selectedCustomer =
    customers.find((customer) => customer.id === selectedCustomerId) ?? null;

  const addCustomer = (draft: AddCustomerDraft) => {
    const customer: Customer = {
      id: `CUS-${1049 + customers.length}`,
      type: draft.type,
      name: draft.name,
      email: draft.email,
      phone: draft.phone,
      city: draft.city,
      address: draft.address,
      status: "جديد",
      joinedAt: new Intl.DateTimeFormat("ar-SA", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date()),
      totalOrders: 0,
      totalSpent: 0,
      outstanding: 0,
      nationalId: draft.type === "individual" ? draft.nationalId : undefined,
      vatNumber: draft.type === "company" ? draft.vatNumber : undefined,
      commercialRegistration:
        draft.type === "company" ? draft.commercialRegistration : undefined,
      companyWebsite:
        draft.type === "company" ? draft.companyWebsite : undefined,
      contactPerson: draft.type === "company" ? draft.contactPerson : undefined,
      invoices: [],
      shipments: [],
      payments: [],
      notes: ["تم إنشاء ملف العميل حديثًا."],
    };

    setCustomers((current) => [customer, ...current]);
    setShowAddCustomer(false);
    setSelectedCustomerId(customer.id);
    setCustomerTab("overview");
  };

  const deleteCustomer = (customerId: string) => {
    setCustomers((current) => current.filter((customer) => customer.id !== customerId));
    if (selectedCustomerId === customerId) {
      setSelectedCustomerId(null);
      setCustomerTab("overview");
    }
  };

  const openCustomerFromSearch = (customerId: string) => {
    if (!currentUser || !canAccessModule(currentUser, "customers")) return;
    setActiveModule("customers");
    setSelectedCustomerId(customerId);
    setCustomerTab("overview");
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleDailyTask = (taskId: string) => {
    const task = dailyTasks.find((item) => item.id === taskId);
    if (!task) return;
    const nextStatus: TaskStatus = task.status === "مكتملة" ? "مفتوحة" : "مكتملة";
    setDailyTasks((current) =>
      current.map((item) => item.id === taskId ? { ...item, status: nextStatus } : item),
    );
    setActivityLog((current) => [
      {
        id: `ACT-${Date.now()}`,
        user: currentUser?.name ?? "مستخدم النظام",
        action: nextStatus === "مكتملة" ? "أكمل مهمة" : "أعاد فتح مهمة",
        target: task.title,
        time: "الآن",
        module: task.module,
      },
      ...current,
    ].slice(0, 10));
  };

  const resolveApproval = (approvalId: string, decision: "معتمد" | "مرفوض") => {
    const approval = approvals.find((item) => item.id === approvalId);
    if (!approval) return;
    setApprovals((current) =>
      current.map((item) => item.id === approvalId ? { ...item, status: decision } : item),
    );
    setActivityLog((current) => [
      {
        id: `ACT-${Date.now()}`,
        user: currentUser?.name ?? "مدير النظام",
        action: decision === "معتمد" ? "اعتمد طلبًا" : "رفض طلبًا",
        target: approval.title,
        time: "الآن",
        module: approval.module,
      },
      ...current,
    ].slice(0, 10));
    setNotifications((current) => [
      {
        id: `NOT-${Date.now()}`,
        title: decision === "معتمد" ? "تم الاعتماد بنجاح" : "تم رفض الطلب",
        description: approval.title,
        time: "الآن",
        module: approval.module,
        read: false,
        tone: decision === "معتمد" ? ("teal" as const) : ("coral" as const),
      },
      ...current,
    ].slice(0, 12));
  };

  const markNotification = (notificationId: string) => {
    setNotifications((current) =>
      current.map((item) => item.id === notificationId ? { ...item, read: true } : item),
    );
  };

  const markAllNotifications = () => {
    setNotifications((current) => current.map((item) => ({ ...item, read: true })));
  };

  if (!authReady) {
    return (
      <div className="relative flex min-h-screen items-center justify-center">
        <AnimatedBackground theme={theme} />
        <Loader2 size={26} className="animate-spin text-slate-500" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <LoginScreen
        language={language}
        theme={theme}
        onToggleLanguage={() => setLanguage((value) => value === "ar" ? "en" : "ar")}
        onToggleTheme={() => setTheme((value) => value === "light" ? "dark" : "light")}
        onLogin={login}
      />
    );
  }

  if (loading) {
    return (
      <div
        dir={language === "ar" ? "rtl" : "ltr"}
        className={`ertikaz-app relative flex min-h-screen items-center justify-center overflow-hidden px-4 ${
          theme === "dark" ? "ertikaz-dark" : "ertikaz-light"
        }`}
      >
        <AnimatedBackground theme={theme} />
        <div className="w-full max-w-sm rounded-[30px] border border-white/85 bg-white/85 p-7 text-center shadow-[0_28px_90px_rgba(15,23,42,0.12)] backdrop-blur-xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#236c83] text-white shadow-lg shadow-[#657491]/20">
            <Loader2 size={25} className="animate-spin" />
          </div>
          <h2 className="mt-4 text-base font-black text-slate-900">
            {language === "ar"
              ? "تجهيز مركز القيادة"
              : "Preparing the command center"}
          </h2>
          <p className="mt-2 text-xs font-semibold leading-6 text-slate-500">
            {language === "ar"
              ? "يتم تحميل البيانات وربط وحدات النظام."
              : "Loading data and connecting system modules."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      data-ertikaz-root="true"
      dir={language === "ar" ? "rtl" : "ltr"}
      className={`ertikaz-app relative min-h-screen text-slate-900 ${
        language === "en" ? "ertikaz-ltr" : "ertikaz-rtl"
      } ${theme === "dark" ? "ertikaz-dark" : "ertikaz-light"}`}
    >
      <AnimatedBackground theme={theme} />

      <style jsx global>{`
        @keyframes dashboardFloatOne {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(-58px, 42px, 0) scale(1.08);
          }
        }
        @keyframes dashboardFloatTwo {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(68px, -38px, 0) scale(1.1);
          }
        }
        @keyframes dashboardFloatThree {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(-38px, -58px, 0) scale(1.06);
          }
        }
        @keyframes dashboardFloatFour {
          0%,
          100% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          50% {
            transform: translate3d(35px, 42px, 0) scale(1.07);
          }
        }
        @keyframes gridDrift {
          from {
            background-position: 0 0;
          }
          to {
            background-position: 64px 64px;
          }
        }
        .orb-one {
          animation: dashboardFloatOne 18s ease-in-out infinite;
        }
        .orb-two {
          animation: dashboardFloatTwo 22s ease-in-out infinite;
        }
        .orb-three {
          animation: dashboardFloatThree 20s ease-in-out infinite;
        }
        .orb-four {
          animation: dashboardFloatFour 17s ease-in-out infinite;
        }
        .dashboard-grid {
          background-image:
            linear-gradient(rgba(48, 137, 130, 0.07) 1px, transparent 1px),
            linear-gradient(
              90deg,
              rgba(55, 118, 151, 0.06) 1px,
              transparent 1px
            );
          background-size: 64px 64px;
          mask-image: linear-gradient(
            to bottom,
            rgba(0, 0, 0, 0.75),
            transparent 92%
          );
          animation: gridDrift 26s linear infinite;
        }

        .ertikaz-app {
          transition:
            background-color 260ms ease,
            color 260ms ease;
          font-family: "IBM Plex Sans Arabic", "Noto Sans Arabic", "Segoe UI", Tahoma, Arial, sans-serif;
          letter-spacing: 0;
        }
        .ertikaz-ltr {
          font-family: Inter, "Segoe UI", Arial, sans-serif;
        }
        .ertikaz-app button,
        .ertikaz-app input,
        .ertikaz-app textarea,
        .ertikaz-app select {
          font: inherit;
        }
        .ertikaz-app .font-black {
          font-weight: 700 !important;
        }
        .ertikaz-app .font-semibold {
          font-weight: 500 !important;
        }
        .ertikaz-ltr .text-right {
          text-align: left !important;
        }
        .ertikaz-ltr .text-left {
          text-align: right !important;
        }
        .ertikaz-dark {
          color-scheme: dark;
          color: #eef2ff !important;
        }
        .ertikaz-dark .ertikaz-background {
          background:
            radial-gradient(circle at 12% 16%, rgba(56, 189, 248, 0.19), transparent 34%),
            radial-gradient(circle at 84% 22%, rgba(139, 92, 246, 0.18), transparent 36%),
            radial-gradient(circle at 52% 84%, rgba(52, 211, 153, 0.13), transparent 34%),
            radial-gradient(circle at 76% 72%, rgba(244, 114, 182, 0.10), transparent 30%),
            linear-gradient(150deg, #07112f 0%, #101a45 42%, #1b174d 72%, #102e45 100%) !important;
        }
        .ertikaz-dark .ertikaz-sidebar,
        .ertikaz-dark .ertikaz-topbar,
        .ertikaz-dark .ertikaz-surface,
        .ertikaz-dark .carrier-card,
        .ertikaz-dark .login-card {
          background-color: rgba(18, 27, 68, 0.86) !important;
          border-color: rgba(137, 170, 255, 0.20) !important;
          box-shadow: 0 22px 70px rgba(3, 7, 28, 0.30) !important;
        }
        .ertikaz-dark .login-shell {
          background-color: rgba(15, 22, 60, 0.62) !important;
          border-color: rgba(173, 197, 255, 0.24) !important;
        }
        .ertikaz-dark .login-visual {
          background:
            radial-gradient(circle at 18% 18%, rgba(125, 211, 252, 0.28), transparent 34%),
            radial-gradient(circle at 76% 28%, rgba(167, 243, 208, 0.19), transparent 34%),
            radial-gradient(circle at 62% 78%, rgba(216, 180, 254, 0.22), transparent 35%),
            linear-gradient(145deg, #163267 0%, #174f66 34%, #3a3575 68%, #5a315f 100%) !important;
          color: #f4f8ff !important;
        }
        .ertikaz-dark .login-visual [class*="text-[#"] {
          color: #f4f8ff !important;
        }
        .ertikaz-dark .login-metric {
          background-color: rgba(255, 255, 255, 0.10) !important;
          border-color: rgba(255, 255, 255, 0.18) !important;
        }
        .ertikaz-dark .ertikaz-intro {
          background:
            radial-gradient(circle at 14% 20%, rgba(56, 189, 248, 0.18), transparent 32%),
            radial-gradient(circle at 78% 70%, rgba(168, 85, 247, 0.16), transparent 34%),
            radial-gradient(circle at 52% 90%, rgba(52, 211, 153, 0.10), transparent 30%),
            linear-gradient(135deg, #17295b 0%, #24295f 42%, #3b275f 72%, #24465b 100%) !important;
          border-color: rgba(157, 184, 255, 0.20) !important;
          color: #f5f7ff !important;
        }
        .ertikaz-dark .ertikaz-intro [class*="text-slate"] { color: rgba(239, 243, 255, 0.88) !important; }
        .ertikaz-dark [class*="bg-white"] { background-color: rgba(22, 31, 76, 0.88) !important; }
        .ertikaz-dark .ertikaz-intro [class*="bg-white"] { background-color: rgba(255, 255, 255, 0.10) !important; }
        .ertikaz-dark [class*="bg-slate-50"] { background-color: rgba(47, 61, 121, 0.26) !important; }
        .ertikaz-dark [class*="bg-slate-100"] { background-color: rgba(66, 79, 145, 0.28) !important; }
        .ertikaz-dark [class*="bg-slate-900"],
        .ertikaz-dark [class*="bg-slate-950"] { background-color: #293a78 !important; }
        .ertikaz-dark [class*="border-white"],
        .ertikaz-dark [class*="border-slate-100"],
        .ertikaz-dark [class*="border-slate-200"] { border-color: rgba(145, 169, 236, 0.20) !important; }
        .ertikaz-dark [class*="text-slate-950"],
        .ertikaz-dark [class*="text-slate-900"],
        .ertikaz-dark [class*="text-slate-800"],
        .ertikaz-dark [class*="text-slate-700"] { color: #f2f5ff !important; }
        .ertikaz-dark [class*="text-slate-600"],
        .ertikaz-dark [class*="text-slate-500"],
        .ertikaz-dark [class*="text-slate-400"] { color: #b8c3ee !important; }
        .ertikaz-dark [class*="bg-sky-50"] { background-color: rgba(56, 189, 248, 0.16) !important; }
        .ertikaz-dark [class*="bg-[#e6f1f8]"],
        .ertikaz-dark [class*="bg-[#eef9f6]"] { background-color: rgba(167, 139, 250, 0.17) !important; }
        .ertikaz-dark [class*="bg-emerald-50"] { background-color: rgba(52, 211, 153, 0.15) !important; }
        .ertikaz-dark [class*="bg-amber-50"],
        .ertikaz-dark [class*="bg-orange-50"] { background-color: rgba(251, 191, 36, 0.14) !important; }
        .ertikaz-dark [class*="bg-[#fff1eb]"],
        .ertikaz-dark [class*="bg-[#fff1eb]"] { background-color: rgba(244, 114, 182, 0.14) !important; }
        .ertikaz-dark [class*="text-sky-700"],
        .ertikaz-dark [class*="text-sky-600"] { color: #8edcff !important; }
        .ertikaz-dark [class*="text-[#2d75a3]"],
        .ertikaz-dark [class*="text-[#147f75]"] { color: #c9b8ff !important; }
        .ertikaz-dark [class*="text-emerald-700"],
        .ertikaz-dark [class*="text-emerald-600"] { color: #8fe7c4 !important; }
        .ertikaz-dark [class*="text-amber-700"],
        .ertikaz-dark [class*="text-orange-700"] { color: #ffd47f !important; }
        .ertikaz-dark [class*="text-[#b4553f]"],
        .ertikaz-dark [class*="text-[#b4553f]"] { color: #f6b3d4 !important; }
        .ertikaz-dark input,
        .ertikaz-dark textarea,
        .ertikaz-dark select {
          color: #f3f6ff !important;
          background-color: rgba(17, 27, 68, 0.88) !important;
          border-color: rgba(139, 166, 239, 0.24) !important;
        }
        .ertikaz-dark input::placeholder,
        .ertikaz-dark textarea::placeholder { color: #8493c8 !important; }

        /* Professional dashboard palette: solid surfaces, calm dark mode, no decorative gradients. */
        .ertikaz-light .ertikaz-background { background: #f3faf8 !important; }
        .ertikaz-dark { color: #e7f0f1 !important; }
        .ertikaz-dark .ertikaz-background { background: #08151d !important; }
        .ertikaz-dark .ertikaz-sidebar,
        .ertikaz-dark .ertikaz-topbar,
        .ertikaz-dark .ertikaz-surface,
        .ertikaz-dark .carrier-card {
          background: rgba(15, 34, 43, 0.94) !important;
          border-color: rgba(91, 139, 145, 0.24) !important;
          box-shadow: 0 20px 58px rgba(0, 8, 14, 0.22) !important;
        }
        .ertikaz-dark .ertikaz-intro {
          background: #102832 !important;
          border-color: rgba(77, 137, 139, 0.28) !important;
          color: #edf5f5 !important;
        }
        .ertikaz-dark [class*="bg-white"] { background-color: #132a34 !important; }
        .ertikaz-dark [class*="bg-slate-50"] { background-color: #152f39 !important; }
        .ertikaz-dark [class*="bg-slate-100"] { background-color: #1a3540 !important; }
        .ertikaz-dark [class*="bg-slate-900"],
        .ertikaz-dark [class*="bg-slate-950"] { background-color: #1c6670 !important; }
        .ertikaz-dark [class*="border-white"],
        .ertikaz-dark [class*="border-slate-100"],
        .ertikaz-dark [class*="border-slate-200"] { border-color: rgba(100, 148, 153, 0.22) !important; }
        .ertikaz-dark [class*="text-slate-950"],
        .ertikaz-dark [class*="text-slate-900"],
        .ertikaz-dark [class*="text-slate-800"],
        .ertikaz-dark [class*="text-slate-700"] { color: #edf5f5 !important; }
        .ertikaz-dark [class*="text-slate-600"],
        .ertikaz-dark [class*="text-slate-500"],
        .ertikaz-dark [class*="text-slate-400"] { color: #9fb6ba !important; }
        .ertikaz-dark [class*="bg-sky-50"],
        .ertikaz-dark [class*="bg-blue-50"] { background-color: rgba(62, 123, 160, 0.20) !important; }
        .ertikaz-dark [class*="bg-emerald-50"] { background-color: rgba(45, 144, 126, 0.18) !important; }
        .ertikaz-dark [class*="bg-amber-50"],
        .ertikaz-dark [class*="bg-orange-50"] { background-color: rgba(184, 133, 44, 0.17) !important; }
        .ertikaz-dark [class*="bg-[#fff1eb]"],
        .ertikaz-dark [class*="bg-[#fff1eb]"] { background-color: rgba(181, 83, 63, 0.17) !important; }
        .ertikaz-dark [class*="bg-[#e6f1f8]"],
        .ertikaz-dark [class*="bg-[#eef9f6]"] { background-color: rgba(74, 121, 141, 0.18) !important; }
        .ertikaz-dark input,
        .ertikaz-dark textarea,
        .ertikaz-dark select {
          color: #edf5f5 !important;
          background-color: #102832 !important;
          border-color: rgba(91, 139, 145, 0.28) !important;
        }
        .ertikaz-dark input::placeholder,
        .ertikaz-dark textarea::placeholder { color: #779499 !important; }


        /* V7: calm dark surfaces and lively solid-color workspaces. */
        .ertikaz-light main [class*="bg-slate-50"] { background-color: #f1f9f7 !important; }
        .ertikaz-light main [class*="bg-slate-100"] { background-color: #e7f3f0 !important; }
        .ertikaz-light main [class*="border-slate-100"],
        .ertikaz-light main [class*="border-slate-200"] { border-color: #d4e8e3 !important; }
        .ertikaz-light main [class*="bg-slate-900"] { background-color: #126f73 !important; }
        .ertikaz-light main [class*="bg-slate-950"] { background-color: #1e718a !important; }
        .ertikaz-light .workspace-header { background-color: #f6fcfa !important; }
        .ertikaz-light .daily-task-row { background-color: #f7fcfa !important; border-color: #d5e9e4 !important; }
        .ertikaz-light .approval-row { background-color: #fffaf0 !important; border-color: #efdfb9 !important; }
        .ertikaz-light .activity-row { background-color: #f5faff !important; }
        .ertikaz-light .chart-panel { background-color: #f5fbf9 !important; }

        .ertikaz-dark .ertikaz-background { background: #09191f !important; }
        .ertikaz-dark .ertikaz-sidebar { background: rgba(10, 28, 34, 0.97) !important; }
        .ertikaz-dark .ertikaz-topbar { background: rgba(12, 31, 38, 0.95) !important; }
        .ertikaz-dark .ertikaz-surface,
        .ertikaz-dark .carrier-card,
        .ertikaz-dark .carrier-brand-card {
          background-color: #122a31 !important;
          border-color: rgba(101, 151, 150, 0.23) !important;
          box-shadow: 0 18px 52px rgba(0, 8, 12, 0.24) !important;
        }
        .ertikaz-dark .workspace-header { background-color: #123139 !important; border-color: rgba(87, 155, 149, 0.27) !important; }
        .ertikaz-dark .dashboard-kpi { border-color: rgba(113, 159, 157, 0.24) !important; box-shadow: 0 16px 44px rgba(0, 8, 12, 0.22) !important; }
        .ertikaz-dark .dashboard-kpi-customers { background-color: #12332f !important; }
        .ertikaz-dark .dashboard-kpi-invoices { background-color: #132f3b !important; }
        .ertikaz-dark .dashboard-kpi-payments { background-color: #352f20 !important; }
        .ertikaz-dark .dashboard-kpi-shipments { background-color: #37271f !important; }
        .ertikaz-dark .daily-task-row { background-color: #142f34 !important; border-color: rgba(82, 145, 137, 0.25) !important; }
        .ertikaz-dark .approval-row { background-color: #302c20 !important; border-color: rgba(184, 147, 75, 0.24) !important; }
        .ertikaz-dark .activity-row { background-color: #142c38 !important; }
        .ertikaz-dark .activity-row:hover { background-color: #173642 !important; }
        .ertikaz-dark .chart-panel { background-color: #0f252c !important; border-color: rgba(91, 145, 142, 0.25) !important; }
        .ertikaz-dark .carrier-price-summary { background-color: #17342f !important; border-color: rgba(83, 151, 133, 0.27) !important; }
        .ertikaz-dark [class*="bg-[#f6fcfa]"],
        .ertikaz-dark [class*="bg-[#f7fbfd]"],
        .ertikaz-dark [class*="bg-[#fffdf5]"],
        .ertikaz-dark [class*="bg-[#fff9f6]"],
        .ertikaz-dark [class*="bg-[#fbfefd]"],
        .ertikaz-dark [class*="bg-[#f9fefd]"],
        .ertikaz-dark [class*="bg-[#f7faf9]"],
        .ertikaz-dark [class*="bg-[#f8fcfb]"],
        .ertikaz-dark [class*="bg-[#f7fcfb]"],
        .ertikaz-dark [class*="bg-[#fff8f8]"],
        .ertikaz-dark [class*="bg-[#f6faff]"],
        .ertikaz-dark [class*="bg-[#f5fcf9]"] {
          background-color: #132d34 !important;
        }
        .ertikaz-dark [class*="bg-[#fff9e8]"],
        .ertikaz-dark [class*="bg-[#fff8e7]"],
        .ertikaz-dark [class*="bg-[#fffaf0]"] { background-color: #342e20 !important; }
        .ertikaz-dark [class*="bg-[#fff1eb]"],
        .ertikaz-dark [class*="bg-[#fff0eb]"],
        .ertikaz-dark [class*="bg-[#fff0f1]"] { background-color: #382522 !important; }
        .ertikaz-dark [class*="bg-[#edf6ff]"],
        .ertikaz-dark [class*="bg-[#edf7fb]"],
        .ertikaz-dark [class*="bg-[#f5faff]"] { background-color: #142e3a !important; }
        .ertikaz-dark [class*="bg-[#eaf8f3]"],
        .ertikaz-dark [class*="bg-[#eaf8f5]"],
        .ertikaz-dark [class*="bg-[#edf8f5]"],
        .ertikaz-dark [class*="bg-[#f7fbfa]"] { background-color: #15332f !important; }
        .ertikaz-dark main [class*="bg-slate-50"] { background-color: #142d34 !important; }
        .ertikaz-dark main [class*="bg-slate-100"] { background-color: #18343b !important; }
        .ertikaz-dark main [class*="border-slate-100"],
        .ertikaz-dark main [class*="border-slate-200"] { border-color: rgba(102, 154, 151, 0.22) !important; }


        /* V8: cheerful module palettes, complete calm night mode, and no gray workspaces. */
        .ertikaz-light .ertikaz-background { background-color: #f6fbff !important; }
        .ertikaz-light .dashboard-grid {
          opacity: .42 !important;
          background-image:
            linear-gradient(rgba(26, 144, 176, 0.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(22, 151, 131, 0.05) 1px, transparent 1px) !important;
        }

        .ertikaz-light main[data-module="customers"] { --module-surface:#f4fbff; --module-soft:#e7f7ff; --module-border:#c8eafa; --module-accent:#0d91b8; --module-ink:#075f79; }
        .ertikaz-light main[data-module="carriers"] { --module-surface:#f8fdfc; --module-soft:#e8f7f4; --module-border:#c9e9e3; --module-accent:#2f8f8a; --module-ink:#205f63; }
        .ertikaz-light main[data-module="orders"] { --module-surface:#fff7ef; --module-soft:#ffead8; --module-border:#f5cfad; --module-accent:#e56f2c; --module-ink:#98451d; }
        .ertikaz-light main[data-module="invoices"] { --module-surface:#f4f8ff; --module-soft:#e6efff; --module-border:#c8daf8; --module-accent:#326fd1; --module-ink:#214c93; }
        .ertikaz-light main[data-module="payments"] { --module-surface:#f2fcf7; --module-soft:#def7ea; --module-border:#bae7cf; --module-accent:#168b64; --module-ink:#0f654a; }
        .ertikaz-light main[data-module="shipments"] { --module-surface:#fff8f1; --module-soft:#ffead8; --module-border:#f5d0ae; --module-accent:#d96a27; --module-ink:#934619; }
        .ertikaz-light main[data-module="inventory"] { --module-surface:#f8fceb; --module-soft:#edf7cf; --module-border:#d5e9a5; --module-accent:#749c18; --module-ink:#506e10; }
        .ertikaz-light main[data-module="reports"] { --module-surface:#f1fbfb; --module-soft:#ddf4f3; --module-border:#bce4e1; --module-accent:#168b88; --module-ink:#0f6260; }
        .ertikaz-light main[data-module="ai"] { --module-surface:#f1f8ff; --module-soft:#e0efff; --module-border:#c0dcf5; --module-accent:#2479b8; --module-ink:#175681; }
        .ertikaz-light main[data-module="users"] { --module-surface:#f6fbf3; --module-soft:#e8f6df; --module-border:#cce6bd; --module-accent:#5d982f; --module-ink:#3e6b1e; }
        .ertikaz-light main[data-module="settings"] { --module-surface:#f3fbff; --module-soft:#e4f5fb; --module-border:#c4e4ef; --module-accent:#187f9d; --module-ink:#105a70; }

        .ertikaz-light main[data-module]:not([data-module="dashboard"]) .ertikaz-surface,
        .ertikaz-light main[data-module]:not([data-module="dashboard"]) .workspace-header {
          background-color: var(--module-surface) !important;
          border-color: var(--module-border) !important;
          box-shadow: 0 18px 48px color-mix(in srgb, var(--module-accent) 10%, transparent) !important;
        }
        .ertikaz-light main[data-module]:not([data-module="dashboard"]) .ertikaz-surface:nth-of-type(3n+2) {
          background-color: color-mix(in srgb, var(--module-surface) 68%, var(--module-soft)) !important;
        }
        .ertikaz-light main[data-module]:not([data-module="dashboard"]) [class*="bg-slate-50"],
        .ertikaz-light main[data-module]:not([data-module="dashboard"]) [class*="bg-slate-100"] {
          background-color: var(--module-soft) !important;
        }
        .ertikaz-light main[data-module]:not([data-module="dashboard"]) [class*="border-slate-100"],
        .ertikaz-light main[data-module]:not([data-module="dashboard"]) [class*="border-slate-200"] {
          border-color: var(--module-border) !important;
        }
        .ertikaz-light main[data-module]:not([data-module="dashboard"]) [class*="bg-slate-900"],
        .ertikaz-light main[data-module]:not([data-module="dashboard"]) [class*="bg-slate-950"] {
          background-color: var(--module-accent) !important;
        }
        .ertikaz-light main[data-module]:not([data-module="dashboard"]) .workspace-header > span,
        .ertikaz-light main[data-module]:not([data-module="dashboard"]) .workspace-header > div > div > span {
          background-color: var(--module-accent) !important;
        }
        .ertikaz-light main[data-module]:not([data-module="dashboard"]) .workspace-header h2,
        .ertikaz-light main[data-module]:not([data-module="dashboard"]) [class*="text-slate-950"] {
          color: var(--module-ink) !important;
        }
        .ertikaz-light main[data-module]:not([data-module="dashboard"]) input,
        .ertikaz-light main[data-module]:not([data-module="dashboard"]) textarea,
        .ertikaz-light main[data-module]:not([data-module="dashboard"]) select {
          background-color: #ffffff !important;
          border-color: var(--module-border) !important;
        }
        .ertikaz-light main[data-module]:not([data-module="dashboard"]) .divide-y > *:hover {
          background-color: var(--module-soft) !important;
        }

        .ertikaz-dark { color: #dbe9ea !important; }
        .ertikaz-dark .ertikaz-background { background-color: #061319 !important; }
        .ertikaz-dark .dashboard-grid { opacity: .12 !important; }
        .ertikaz-dark .ertikaz-sidebar { background-color: #081b22 !important; border-color: #17333c !important; }
        .ertikaz-dark .ertikaz-topbar { background-color: rgba(8, 27, 34, .96) !important; border-color: #17333c !important; }
        .ertikaz-dark .ertikaz-surface,
        .ertikaz-dark .workspace-header,
        .ertikaz-dark .login-card,
        .ertikaz-dark .carrier-card,
        .ertikaz-dark .carrier-brand-card {
          background-color: #0d222a !important;
          border-color: #21404a !important;
          box-shadow: 0 18px 52px rgba(0, 7, 10, .28) !important;
        }
        .ertikaz-dark [class*="bg-white"],
        .ertikaz-dark [class*="bg-slate-50"],
        .ertikaz-dark [class*="bg-slate-100"] {
          background-color: #102a33 !important;
        }
        .ertikaz-dark [class*="bg-slate-900"],
        .ertikaz-dark [class*="bg-slate-950"] {
          background-color: #1f6f78 !important;
        }
        .ertikaz-dark [class*="border-white"],
        .ertikaz-dark [class*="border-slate-100"],
        .ertikaz-dark [class*="border-slate-200"] {
          border-color: #24434d !important;
        }
        .ertikaz-dark [class*="text-slate-950"],
        .ertikaz-dark [class*="text-slate-900"],
        .ertikaz-dark [class*="text-slate-800"],
        .ertikaz-dark [class*="text-slate-700"] { color: #dce9ea !important; }
        .ertikaz-dark [class*="text-slate-600"],
        .ertikaz-dark [class*="text-slate-500"],
        .ertikaz-dark [class*="text-slate-400"] { color: #8fa8ad !important; }
        .ertikaz-dark input,
        .ertikaz-dark textarea,
        .ertikaz-dark select {
          background-color: #0a2028 !important;
          border-color: #26454f !important;
          color: #dce9ea !important;
          box-shadow: none !important;
        }
        .ertikaz-dark input:focus,
        .ertikaz-dark textarea:focus,
        .ertikaz-dark select:focus { background-color: #0d2730 !important; }
        .ertikaz-dark .login-shell { background-color: rgba(7, 25, 32, .82) !important; border-color: #24434d !important; }
        .ertikaz-dark .login-visual { background-color: #0e3038 !important; background-image: none !important; }
        .ertikaz-dark .login-visual [class*="text-[#"] { color: #dbe9ea !important; }
        .ertikaz-dark .carrier-brand-card [class*="bg-white"] { background-color: #f8fafc !important; }

        .ertikaz-dark main[data-module="customers"] { --night-module:#0d2831; --night-soft:#123440; --night-accent:#2a8ba5; }
        .ertikaz-dark main[data-module="carriers"] { --night-module:#102a31; --night-soft:#15363d; --night-accent:#69a9a4; }
        .ertikaz-dark main[data-module="orders"] { --night-module:#2a211b; --night-soft:#37291f; --night-accent:#bd6834; }
        .ertikaz-dark main[data-module="invoices"] { --night-module:#14253a; --night-soft:#192f49; --night-accent:#4b79bf; }
        .ertikaz-dark main[data-module="payments"] { --night-module:#102b27; --night-soft:#15362f; --night-accent:#2d8d70; }
        .ertikaz-dark main[data-module="shipments"] { --night-module:#2b221b; --night-soft:#38291f; --night-accent:#c76d35; }
        .ertikaz-dark main[data-module="inventory"] { --night-module:#222a18; --night-soft:#2d371e; --night-accent:#829d35; }
        .ertikaz-dark main[data-module="reports"] { --night-module:#10292b; --night-soft:#153536; --night-accent:#2e8d8b; }
        .ertikaz-dark main[data-module="ai"] { --night-module:#122938; --night-soft:#173446; --night-accent:#387aa5; }
        .ertikaz-dark main[data-module="users"] { --night-module:#1b2b18; --night-soft:#253820; --night-accent:#6c9c49; }
        .ertikaz-dark main[data-module="settings"] { --night-module:#102933; --night-soft:#153540; --night-accent:#2b8097; }
        .ertikaz-dark main[data-module]:not([data-module="dashboard"]) .ertikaz-surface,
        .ertikaz-dark main[data-module]:not([data-module="dashboard"]) .workspace-header {
          background-color: var(--night-module) !important;
          border-color: color-mix(in srgb, var(--night-accent) 34%, #18333c) !important;
        }
        .ertikaz-dark main[data-module]:not([data-module="dashboard"]) [class*="bg-white"],
        .ertikaz-dark main[data-module]:not([data-module="dashboard"]) [class*="bg-slate-50"],
        .ertikaz-dark main[data-module]:not([data-module="dashboard"]) [class*="bg-slate-100"] {
          background-color: var(--night-soft) !important;
        }
        .ertikaz-dark main[data-module]:not([data-module="dashboard"]) [class*="bg-slate-900"],
        .ertikaz-dark main[data-module]:not([data-module="dashboard"]) [class*="bg-slate-950"] {
          background-color: var(--night-accent) !important;
        }

        @keyframes ribbonTravelOne {
          0%, 100% { transform: translate3d(0,0,0) rotate(-12deg) scaleX(1); opacity: .35; }
          50% { transform: translate3d(-12%,44px,0) rotate(-8deg) scaleX(1.12); opacity: .6; }
        }
        @keyframes ribbonTravelTwo {
          0%, 100% { transform: translate3d(0,0,0) rotate(10deg) scaleX(1); opacity: .28; }
          50% { transform: translate3d(14%,-35px,0) rotate(5deg) scaleX(1.08); opacity: .5; }
        }
        @keyframes ringBreathe {
          0%, 100% { transform: scale(.9); opacity: .2; }
          50% { transform: scale(1.18); opacity: .45; }
        }
        @keyframes particleDrift {
          0%, 100% { transform: translate3d(0,0,0); opacity: .35; }
          50% { transform: translate3d(28px,-38px,0); opacity: .8; }
        }
        @keyframes lightSweep {
          0% { transform: translateX(-30%) rotate(12deg); opacity: 0; }
          20% { opacity: .45; }
          70% { opacity: .18; }
          100% { transform: translateX(430%) rotate(12deg); opacity: 0; }
        }
        .ribbon-one { animation: ribbonTravelOne 20s ease-in-out infinite; }
        .ribbon-two { animation: ribbonTravelTwo 24s ease-in-out infinite; }
        .ring-one { animation: ringBreathe 8s ease-in-out infinite; }
        .ring-two { animation: ringBreathe 10s ease-in-out infinite reverse; }
        .particle { animation: particleDrift 9s ease-in-out infinite; }
        .particle-two { animation-delay: -2s; }
        .particle-three { animation-delay: -4s; }
        .particle-four { animation-delay: -6s; }
        .moving-light { animation: lightSweep 13s linear infinite; }


        @keyframes auroraFlowOne {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg) scale(1); }
          33% { transform: translate3d(-7%, 8%, 0) rotate(14deg) scale(1.08); }
          66% { transform: translate3d(5%, 3%, 0) rotate(-8deg) scale(.96); }
        }
        @keyframes auroraFlowTwo {
          0%, 100% { transform: translate3d(0, 0, 0) rotate(0deg) scale(1); }
          50% { transform: translate3d(10%, -9%, 0) rotate(-16deg) scale(1.1); }
        }
        @keyframes auroraFlowThree {
          0%, 100% { transform: translate3d(0, 0, 0) scale(.92); opacity: .55; }
          50% { transform: translate3d(-8%, 10%, 0) scale(1.14); opacity: .9; }
        }
        @keyframes railMove {
          0% { transform: translateX(-18%) rotate(var(--rail-angle)); opacity: 0; }
          20% { opacity: .55; }
          80% { opacity: .25; }
          100% { transform: translateX(18%) rotate(var(--rail-angle)); opacity: 0; }
        }
        @keyframes orbitRotate {
          from { transform: rotate(0deg) scale(.94); opacity: .16; }
          50% { transform: rotate(180deg) scale(1.08); opacity: .34; }
          to { transform: rotate(360deg) scale(.94); opacity: .16; }
        }
        @keyframes nodeFloat {
          0%, 100% { transform: translate3d(0,0,0); opacity: .35; }
          45% { transform: translate3d(34px,-42px,0); opacity: .95; }
          75% { transform: translate3d(-16px,-12px,0); opacity: .6; }
        }
        @keyframes professionalScan {
          0% { transform: translateX(-25%) rotate(9deg); opacity: 0; }
          20% { opacity: .26; }
          72% { opacity: .12; }
          100% { transform: translateX(520%) rotate(9deg); opacity: 0; }
        }
        .aurora-one { animation: auroraFlowOne 26s ease-in-out infinite; }
        .aurora-two { animation: auroraFlowTwo 31s ease-in-out infinite; }
        .aurora-three { animation: auroraFlowThree 23s ease-in-out infinite; }
        .rail-one { --rail-angle: -7deg; animation: railMove 18s ease-in-out infinite; }
        .rail-two { --rail-angle: 8deg; animation: railMove 22s ease-in-out infinite reverse; }
        .rail-three { --rail-angle: -3deg; animation: railMove 26s ease-in-out infinite; }
        .orbit-one { animation: orbitRotate 28s linear infinite; }
        .orbit-two { animation: orbitRotate 34s linear infinite reverse; }
        .orbit-three { animation: orbitRotate 20s linear infinite; }
        .floating-node { animation: nodeFloat 12s ease-in-out infinite; }
        .node-two { animation-delay: -3s; }
        .node-three { animation-delay: -6s; }
        .node-four { animation-delay: -8s; }
        .node-five { animation-delay: -10s; }
        .light-scan { animation: professionalScan 16s linear infinite; }

        @keyframes waveFloatOne {
          0%,100% { transform: translate3d(0,0,0) rotate(-6deg) scaleX(1); opacity: .32; }
          50% { transform: translate3d(-7%,30px,0) rotate(-3deg) scaleX(1.08); opacity: .58; }
        }
        @keyframes waveFloatTwo {
          0%,100% { transform: translate3d(0,0,0) rotate(7deg) scaleX(1); opacity: .25; }
          50% { transform: translate3d(8%,-28px,0) rotate(4deg) scaleX(1.1); opacity: .5; }
        }
        @keyframes streamFlow { from { transform: translateX(-16%); opacity: 0; } 20% { opacity: .35; } 80% { opacity: .16; } to { transform: translateX(16%); opacity: 0; } }
        @keyframes loginOrbit { from { transform: rotate(0deg) scale(.94); opacity: .25; } 50% { transform: rotate(180deg) scale(1.08); opacity: .45; } to { transform: rotate(360deg) scale(.94); opacity: .25; } }
        .wave-one { animation: waveFloatOne 24s ease-in-out infinite; }
        .wave-two { animation: waveFloatTwo 28s ease-in-out infinite; }
        .wave-three { animation: waveFloatOne 31s ease-in-out infinite reverse; }
        .stream-one { animation: streamFlow 17s ease-in-out infinite; }
        .stream-two { animation: streamFlow 22s ease-in-out infinite reverse; }
        .login-orbit { animation: loginOrbit 24s linear infinite; }
        .login-orbit-two { animation-duration: 17s; animation-direction: reverse; }

        @media (prefers-reduced-motion: reduce) {
          .orb-one,
          .orb-two,
          .orb-three,
          .orb-four,
          .dashboard-grid,
          .background-ribbon,
          .soft-ring,
          .particle,
          .moving-light,
          .aurora,
          .flow-rail,
          .orbit,
          .floating-node,
          .light-scan {
            animation: none !important;
          }
        }


        /* V9: premium workspaces, pastel light mode, and low-glare dark mode. */
        @keyframes moduleOrbOne {
          0%, 100% { transform: translate3d(0, 0, 0) scale(.92); opacity: .22; }
          50% { transform: translate3d(-56px, 38px, 0) scale(1.12); opacity: .42; }
        }
        @keyframes moduleOrbTwo {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); opacity: .16; }
          50% { transform: translate3d(42px, -44px, 0) scale(.9); opacity: .34; }
        }
        @keyframes surfaceLift {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }

        .ertikaz-light .ertikaz-background {
          background: #f7fcff !important;
        }
        .ertikaz-light main[data-module] {
          position: relative;
          isolation: isolate;
          overflow: hidden;
        }
        .ertikaz-light main[data-module]::before,
        .ertikaz-light main[data-module]::after {
          content: "";
          position: absolute;
          z-index: -1;
          border-radius: 999px;
          filter: blur(2px);
          pointer-events: none;
        }
        .ertikaz-light main[data-module]::before {
          right: -90px;
          top: 90px;
          width: 260px;
          height: 260px;
          border: 1px solid color-mix(in srgb, var(--module-accent, #159487) 22%, transparent);
          background-color: color-mix(in srgb, var(--module-soft, #e9f8f5) 48%, transparent);
          animation: moduleOrbOne 18s ease-in-out infinite;
        }
        .ertikaz-light main[data-module]::after {
          left: -70px;
          bottom: 70px;
          width: 210px;
          height: 210px;
          border: 1px solid color-mix(in srgb, var(--module-accent, #159487) 16%, transparent);
          background-color: color-mix(in srgb, var(--module-soft, #e9f8f5) 32%, transparent);
          animation: moduleOrbTwo 22s ease-in-out infinite;
        }
        .ertikaz-light main[data-module] > div {
          position: relative;
          z-index: 1;
        }

        .ertikaz-light main[data-module="customers"] { --module-surface:#f7fdff; --module-soft:#e7f8ff; --module-border:#bfe8f6; --module-accent:#158faf; --module-ink:#0d6075; }
        .ertikaz-light main[data-module="carriers"] { --module-surface:#f8fdfc; --module-soft:#e8f7f4; --module-border:#c9e9e3; --module-accent:#2f8f8a; --module-ink:#205f63; }
        .ertikaz-light main[data-module="orders"] { --module-surface:#fffaf6; --module-soft:#fff0e3; --module-border:#f3d1b5; --module-accent:#d97836; --module-ink:#8b451e; }
        .ertikaz-light main[data-module="invoices"] { --module-surface:#f7faff; --module-soft:#eaf1ff; --module-border:#c9d9f4; --module-accent:#4779c5; --module-ink:#2e5592; }
        .ertikaz-light main[data-module="payments"] { --module-surface:#f6fdf9; --module-soft:#e4f8ee; --module-border:#c2e8d5; --module-accent:#278a68; --module-ink:#176146; }
        .ertikaz-light main[data-module="shipments"] { --module-surface:#fffaf7; --module-soft:#ffede4; --module-border:#f3cdbb; --module-accent:#cf7044; --module-ink:#884528; }
        .ertikaz-light main[data-module="inventory"] { --module-surface:#fbfdf5; --module-soft:#eff7dc; --module-border:#d6e7ae; --module-accent:#799a35; --module-ink:#526b22; }
        .ertikaz-light main[data-module="reports"] { --module-surface:#f5fcfc; --module-soft:#e1f5f3; --module-border:#bfe4df; --module-accent:#278a83; --module-ink:#19615d; }
        .ertikaz-light main[data-module="ai"] { --module-surface:#f5fbff; --module-soft:#e5f3fb; --module-border:#c4e1ef; --module-accent:#2d789d; --module-ink:#1d5570; }
        .ertikaz-light main[data-module="users"] { --module-surface:#f8fdf6; --module-soft:#e9f6df; --module-border:#cde5bd; --module-accent:#639143; --module-ink:#46682e; }
        .ertikaz-light main[data-module="settings"] { --module-surface:#f7fcff; --module-soft:#e8f5fa; --module-border:#c8e2eb; --module-accent:#347d95; --module-ink:#23576a; }

        .ertikaz-light main[data-module]:not([data-module="dashboard"]) .workspace-header,
        .ertikaz-light main[data-module]:not([data-module="dashboard"]) .ertikaz-surface {
          background-color: color-mix(in srgb, #ffffff 82%, var(--module-surface)) !important;
          border-color: var(--module-border) !important;
          box-shadow:
            inset 0 3px 0 color-mix(in srgb, var(--module-accent) 48%, transparent),
            0 18px 46px color-mix(in srgb, var(--module-accent) 9%, transparent) !important;
        }
        .ertikaz-light main[data-module]:not([data-module="dashboard"]) .ertikaz-surface {
          transition: transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease;
        }
        .ertikaz-light main[data-module]:not([data-module="dashboard"]) .ertikaz-surface:hover {
          border-color: color-mix(in srgb, var(--module-accent) 42%, var(--module-border)) !important;
        }
        .ertikaz-light main[data-module]:not([data-module="dashboard"]) [class*="bg-slate-50"],
        .ertikaz-light main[data-module]:not([data-module="dashboard"]) [class*="bg-slate-100"] {
          background-color: var(--module-soft) !important;
        }
        .ertikaz-light main[data-module]:not([data-module="dashboard"]) .divide-y > button:nth-child(4n + 1),
        .ertikaz-light main[data-module]:not([data-module="dashboard"]) .divide-y > article:nth-child(4n + 1) {
          background-color: color-mix(in srgb, #ffffff 78%, var(--module-soft)) !important;
        }
        .ertikaz-light main[data-module]:not([data-module="dashboard"]) .divide-y > button:nth-child(4n + 3),
        .ertikaz-light main[data-module]:not([data-module="dashboard"]) .divide-y > article:nth-child(4n + 3) {
          background-color: color-mix(in srgb, #ffffff 88%, var(--module-soft)) !important;
        }
        .ertikaz-light main[data-module]:not([data-module="dashboard"]) .divide-y > button:hover,
        .ertikaz-light main[data-module]:not([data-module="dashboard"]) .divide-y > article:hover {
          background-color: var(--module-soft) !important;
        }
        .ertikaz-light main[data-module]:not([data-module="dashboard"]) [class*="bg-slate-900"],
        .ertikaz-light main[data-module]:not([data-module="dashboard"]) [class*="bg-slate-950"] {
          background-color: var(--module-accent) !important;
        }
        .ertikaz-light main[data-module]:not([data-module="dashboard"]) input,
        .ertikaz-light main[data-module]:not([data-module="dashboard"]) textarea,
        .ertikaz-light main[data-module]:not([data-module="dashboard"]) select {
          background-color: #ffffff !important;
          border-color: var(--module-border) !important;
          box-shadow: 0 8px 20px color-mix(in srgb, var(--module-accent) 5%, transparent) !important;
        }
        .ertikaz-light main[data-module]:not([data-module="dashboard"]) input:focus,
        .ertikaz-light main[data-module]:not([data-module="dashboard"]) textarea:focus,
        .ertikaz-light main[data-module]:not([data-module="dashboard"]) select:focus {
          border-color: var(--module-accent) !important;
          box-shadow: 0 0 0 4px color-mix(in srgb, var(--module-accent) 12%, transparent) !important;
        }

        .carrier-logo-plate {
          background-color: #f9fbfc !important;
          border-color: #dce8ec !important;
          box-shadow: inset 0 1px 0 rgba(255,255,255,.95), 0 8px 20px rgba(35,65,77,.07);
        }
        .carrier-selector-card::after {
          content: "";
          position: absolute;
          left: 16px;
          bottom: 12px;
          width: 34px;
          height: 34px;
          border-radius: 999px;
          border: 1px solid color-mix(in srgb, var(--carrier-accent) 20%, transparent);
          opacity: .55;
          transition: transform 280ms ease;
        }
        .carrier-selector-card:hover::after,
        .carrier-selector-card.is-active::after { transform: scale(1.32); }
        .carrier-metric,
        .carrier-cost-row,
        .carrier-option-card,
        .carrier-compare-row {
          background-color: rgba(255,255,255,.68);
          border-color: rgba(116,151,163,.20);
        }
        .carrier-option-card:hover { transform: translateY(-2px); }
        .carrier-option-card.is-selected {
          background-color: color-mix(in srgb, #ffffff 74%, var(--option-accent)) !important;
          border-color: color-mix(in srgb, var(--option-accent) 48%, #ffffff) !important;
          box-shadow: inset 0 3px 0 var(--option-accent), 0 12px 28px color-mix(in srgb, var(--option-accent) 12%, transparent);
        }
        .carrier-option-icon {
          color: var(--option-accent);
          background-color: color-mix(in srgb, #ffffff 70%, var(--option-accent));
        }
        .carrier-compare-row span:first-child {
          background-color: #edf5f7;
          color: #52717b;
        }
        .carrier-compare-row.is-active {
          background-color: color-mix(in srgb, #ffffff 78%, var(--carrier-accent));
          border-color: color-mix(in srgb, var(--carrier-accent) 38%, #d9e7eb);
        }
        .carrier-compare-row.is-active span:first-child {
          background-color: var(--carrier-accent);
          color: white;
        }

        .ertikaz-dark {
          color: #d3dfdc !important;
        }
        .ertikaz-dark .ertikaz-background {
          background: #071316 !important;
        }
        .ertikaz-dark .dashboard-grid {
          opacity: .065 !important;
        }
        .ertikaz-dark .aurora,
        .ertikaz-dark .background-ribbon,
        .ertikaz-dark .soft-ring,
        .ertikaz-dark .flow-rail {
          opacity: .42 !important;
        }
        .ertikaz-dark main[data-module]::before,
        .ertikaz-dark main[data-module]::after {
          display: none !important;
        }
        .ertikaz-dark .ertikaz-sidebar {
          background-color: #09191d !important;
          border-color: #193139 !important;
        }
        .ertikaz-dark .ertikaz-topbar {
          background-color: rgba(9, 25, 29, .96) !important;
          border-color: #193139 !important;
        }
        .ertikaz-dark .ertikaz-surface,
        .ertikaz-dark .workspace-header,
        .ertikaz-dark .login-card,
        .ertikaz-dark .carrier-config-panel,
        .ertikaz-dark .carrier-checkout-card,
        .ertikaz-dark .carrier-comparison-card,
        .ertikaz-dark .carrier-selector-card {
          background-color: #102126 !important;
          border-color: #223b42 !important;
          box-shadow: 0 18px 48px rgba(0, 5, 7, .24) !important;
        }
        .ertikaz-dark main[data-module] [class*="bg-white"],
        .ertikaz-dark main[data-module] [class*="bg-slate-50"],
        .ertikaz-dark main[data-module] [class*="bg-slate-100"],
        .ertikaz-dark main[data-module] [class*="bg-sky-50"],
        .ertikaz-dark main[data-module] [class*="bg-blue-50"],
        .ertikaz-dark main[data-module] [class*="bg-cyan-50"],
        .ertikaz-dark main[data-module] [class*="bg-emerald-50"],
        .ertikaz-dark main[data-module] [class*="bg-green-50"],
        .ertikaz-dark main[data-module] [class*="bg-amber-50"],
        .ertikaz-dark main[data-module] [class*="bg-orange-50"],
        .ertikaz-dark main[data-module] [class*="bg-yellow-50"],
        .ertikaz-dark main[data-module] [class*="bg-red-50"],
        .ertikaz-dark main[data-module] [class*="bg-rose-50"],
        .ertikaz-dark main[data-module] [class*="bg-violet-50"],
        .ertikaz-dark main[data-module] [class*="bg-purple-50"],
        .ertikaz-dark main[data-module] [class*="bg-fuchsia-50"],
        .ertikaz-dark main[data-module] [class*="bg-[#"] {
          background-color: #14282d !important;
          background-image: none !important;
        }
        .ertikaz-dark main[data-module] [class*="border-white"],
        .ertikaz-dark main[data-module] [class*="border-slate"],
        .ertikaz-dark main[data-module] [class*="border-[#"] {
          border-color: #29444b !important;
        }
        .ertikaz-dark [class*="text-slate-950"],
        .ertikaz-dark [class*="text-slate-900"],
        .ertikaz-dark [class*="text-slate-800"],
        .ertikaz-dark [class*="text-slate-700"] {
          color: #d5e1de !important;
        }
        .ertikaz-dark [class*="text-slate-600"],
        .ertikaz-dark [class*="text-slate-500"],
        .ertikaz-dark [class*="text-slate-400"] {
          color: #8fa5a5 !important;
        }
        .ertikaz-dark main[data-module] [class*="bg-slate-900"],
        .ertikaz-dark main[data-module] [class*="bg-slate-950"] {
          background-color: #2b6970 !important;
          color: #e5f0ed !important;
        }
        .ertikaz-dark input,
        .ertikaz-dark textarea,
        .ertikaz-dark select {
          background-color: #0d1d21 !important;
          border-color: #29434a !important;
          color: #d5e1de !important;
          box-shadow: none !important;
        }
        .ertikaz-dark input:focus,
        .ertikaz-dark textarea:focus,
        .ertikaz-dark select:focus {
          background-color: #112429 !important;
          border-color: #3f7176 !important;
          box-shadow: 0 0 0 4px rgba(63, 113, 118, .12) !important;
        }
        .ertikaz-dark .carrier-logo-plate {
          background-color: #dce5e3 !important;
          border-color: #9eaeac !important;
          box-shadow: none !important;
        }
        .ertikaz-dark .carrier-metric,
        .ertikaz-dark .carrier-cost-row,
        .ertikaz-dark .carrier-option-card,
        .ertikaz-dark .carrier-compare-row,
        .ertikaz-dark .carrier-total-row {
          background-color: #14282d !important;
          border-color: #29444b !important;
        }
        .ertikaz-dark .carrier-option-card.is-selected,
        .ertikaz-dark .carrier-compare-row.is-active {
          background-color: #193239 !important;
          border-color: color-mix(in srgb, var(--option-accent, var(--carrier-accent)) 38%, #29444b) !important;
          box-shadow: inset 0 3px 0 color-mix(in srgb, var(--option-accent, var(--carrier-accent)) 58%, #718d8d) !important;
        }
        .ertikaz-dark .carrier-option-icon,
        .ertikaz-dark .carrier-compare-row span:first-child {
          background-color: #1d353b !important;
          color: #a8bdba !important;
        }
        .ertikaz-dark .carrier-compare-row.is-active span:first-child {
          background-color: #2c646a !important;
          color: #dbe8e5 !important;
        }
        .ertikaz-dark .carrier-selector-card::after { opacity: .18; }
        .ertikaz-dark .carrier-selector-card [class*="bg-[#"],
        .ertikaz-dark .carrier-config-panel [class*="bg-[#"],
        .ertikaz-dark .carrier-checkout-card [class*="bg-[#"] {
          background-color: #193137 !important;
        }
        .ertikaz-dark .carrier-checkout-card button[style*="background-color"] {
          filter: saturate(.72) brightness(.78);
        }

        @media (prefers-reduced-motion: reduce) {
          .ertikaz-light main[data-module]::before,
          .ertikaz-light main[data-module]::after,
          .aurora,
          .floating-node,
          .soft-ring,
          .background-ribbon,
          .flow-rail {
            animation: none !important;
          }
        }


        /* V10 — Unified illustrated background, softer night mode, organized pastel workspaces. */
        .ertikaz-light .ertikaz-background { background-color: #f7fcfb !important; }
        .ertikaz-dark .ertikaz-background { background-color: #06181e !important; }
        .ribbon-three { animation: ribbonTravelOne 27s ease-in-out infinite reverse; }
        .ribbon-four { animation: ribbonTravelTwo 30s ease-in-out infinite; }
        .ring-four { animation: ringBreathe 12s ease-in-out infinite reverse; }

        .ertikaz-light .ertikaz-sidebar,
        .ertikaz-light .ertikaz-topbar,
        .ertikaz-light .ertikaz-surface,
        .ertikaz-light .workspace-modal-card {
          background: rgba(252, 255, 254, .91) !important;
          border-color: rgba(158, 207, 200, .42) !important;
          box-shadow: 0 18px 54px rgba(34, 105, 111, .075) !important;
          backdrop-filter: blur(18px);
        }
        .ertikaz-light main[data-module="customers"] { --module-accent:#2f9eb4; --module-soft:#eaf8fb; --module-border:#c8eaf0; }
        .ertikaz-light main[data-module="carriers"] { --module-accent:#2f8f8a; --module-soft:#e8f7f4; --module-border:#c9e9e3; }
        .ertikaz-light main[data-module="orders"] { --module-accent:#df8450; --module-soft:#fff2e9; --module-border:#f3d0bc; }
        .ertikaz-light main[data-module="invoices"] { --module-accent:#4f82c4; --module-soft:#edf4fd; --module-border:#cfdef3; }
        .ertikaz-light main[data-module="payments"] { --module-accent:#2c9a78; --module-soft:#eaf8f2; --module-border:#c8e9db; }
        .ertikaz-light main[data-module="shipments"] { --module-accent:#dc7b3d; --module-soft:#fff3e9; --module-border:#f1d2bd; }
        .ertikaz-light main[data-module="inventory"] { --module-accent:#799d3d; --module-soft:#f2f8e8; --module-border:#d9e7bf; }
        .ertikaz-light main[data-module="reports"] { --module-accent:#318d91; --module-soft:#eaf7f6; --module-border:#cae5e3; }
        .ertikaz-light main[data-module="ai"] { --module-accent:#4e86aa; --module-soft:#edf6fb; --module-border:#cee3ee; }
        .ertikaz-light main[data-module="users"] { --module-accent:#608f55; --module-soft:#eef7ec; --module-border:#d1e5cc; }
        .ertikaz-light main[data-module="settings"] { --module-accent:#3b8c9f; --module-soft:#eaf7fa; --module-border:#cce5eb; }
        .ertikaz-light main[data-module]:not([data-module="dashboard"]) .ertikaz-surface,
        .ertikaz-light main[data-module]:not([data-module="dashboard"]) .workspace-header {
          background: rgba(252,255,254,.93) !important;
          border-color: var(--module-border) !important;
        }
        .ertikaz-light main[data-module]:not([data-module="dashboard"]) .workspace-header {
          background: color-mix(in srgb, var(--module-soft) 72%, white) !important;
        }
        .ertikaz-light main[data-module]:not([data-module="dashboard"]) .record-card {
          border-color: var(--module-border);
          box-shadow: 0 16px 42px color-mix(in srgb, var(--module-accent) 9%, transparent);
        }
        .ertikaz-light main[data-module]:not([data-module="dashboard"]) .record-icon {
          background: var(--module-soft);
          color: var(--module-accent);
        }

        .record-card {
          position: relative;
          overflow: hidden;
          border: 1px solid #dceceb;
          border-radius: 24px;
          background: rgba(255,255,255,.94);
          padding: 18px;
          transition: transform .24s ease, box-shadow .24s ease, border-color .24s ease;
        }
        .record-card::before { content:""; position:absolute; inset-inline:0; top:0; height:3px; background:var(--module-accent,#3b8c9f); opacity:.72; }
        .record-card:hover { transform: translateY(-3px); }
        .record-icon { display:flex; height:42px; width:42px; align-items:center; justify-content:center; border-radius:15px; background:#edf7f6; color:#318d91; }
        .record-meta { display:flex; min-height:34px; align-items:center; justify-content:center; border-radius:12px; background:var(--module-soft,#eef7f6); padding:7px 9px; text-align:center; }
        .record-action { display:inline-flex; min-height:36px; align-items:center; justify-content:center; gap:5px; border:1px solid var(--module-border,#d8e8e5); border-radius:11px; background:rgba(255,255,255,.75); padding:0 10px; font-size:7px; font-weight:700; color:#526a6d; transition:.2s ease; }
        .record-action:hover { border-color:var(--module-accent,#3b8c9f); color:var(--module-accent,#3b8c9f); }
        .record-action-danger { color:#b75c5c; }
        .workspace-primary-button { display:inline-flex; min-height:42px; align-items:center; justify-content:center; gap:7px; border-radius:13px; background:#237c82; padding:0 16px; font-size:8px; font-weight:700; color:#fff; box-shadow:0 10px 25px rgba(35,124,130,.16); }
        .workspace-secondary-button { display:inline-flex; min-height:42px; align-items:center; justify-content:center; gap:7px; border:1px solid #cfe3df; border-radius:13px; background:#f5fbf9; padding:0 16px; font-size:8px; font-weight:700; color:#3e6d70; }
        .workspace-filter { border:1px solid transparent; border-radius:11px; background:var(--module-soft,#eef7f6); padding:8px 13px; font-size:7px; font-weight:700; color:#62777a; transition:.2s ease; }
        .workspace-filter.is-active { border-color:var(--module-accent,#3b8c9f); background:var(--module-accent,#3b8c9f); color:white; }
        .workspace-modal,
        .calm-add-backdrop {
          position:fixed;
          inset:0;
          z-index:120;
          display:flex;
          align-items:center;
          justify-content:center;
          background:rgba(5,25,31,.60) !important;
          padding:18px;
          backdrop-filter:blur(15px) saturate(.72);
        }
        .workspace-modal-card,
        .calm-add-card {
          width:min(680px,100%);
          max-height:92vh;
          overflow:auto;
          border:1px solid rgba(185,220,214,.72) !important;
          border-radius:30px !important;
          background:#fbfefd !important;
          box-shadow:0 30px 110px rgba(3,35,41,.24) !important;
        }
        .workspace-modal-card { padding:24px; }
        .calm-add-card { position:relative; }
        .invoice-create-card {
          width:min(1120px,calc(100vw - 28px)) !important;
          height:min(900px,calc(100dvh - 28px));
          max-height:calc(100dvh - 28px) !important;
          overflow:hidden !important;
        }
        .invoice-create-scroll {
          min-height:0;
          flex:1;
          overflow-y:auto;
          overscroll-behavior:contain;
          scrollbar-gutter:stable;
        }
        @media (max-width: 767px) {
          .invoice-create-card {
            width:calc(100vw - 16px) !important;
            height:calc(100dvh - 16px);
            max-height:calc(100dvh - 16px) !important;
            border-radius:22px !important;
          }
        }
        .calm-add-card::before {
          content:"";
          position:absolute;
          inset-inline:28px;
          top:0;
          height:3px;
          border-radius:0 0 999px 999px;
          background:#65a9a4;
          opacity:.55;
        }
        .calm-add-header {
          background:rgba(247,252,251,.96) !important;
          border-color:#dcebe8 !important;
        }
        .calm-add-footer {
          background:#f8fcfb !important;
          border-color:#dcebe8 !important;
        }
        .workspace-input { min-height:46px; width:100%; border:1px solid #d7e8e5; border-radius:13px; background:#f7fbfa; padding:0 14px; font-size:9px; font-weight:500; color:#273f43; outline:none; transition:.2s ease; }
        .workspace-input:focus { border-color:#5a9da0; background:#fff; box-shadow:0 0 0 4px rgba(90,157,160,.10); }
        .modal-close { display:flex; height:38px; width:38px; align-items:center; justify-content:center; border-radius:12px; background:#edf6f4; color:#60777a; }

        .carrier-directory-row { transition:transform .22s ease, box-shadow .22s ease; }
        .carrier-directory-row:hover { transform:translateX(-2px); background:#f8fcfb !important; }
        .carrier-directory-row.is-active { box-shadow:0 12px 30px color-mix(in srgb, var(--carrier-color) 12%, transparent); }
        .carrier-choice { display:grid; width:100%; grid-template-columns:auto 1fr auto; align-items:center; gap:10px; border:1px solid #dce9e7; border-radius:16px; background:rgba(255,255,255,.72); padding:11px; text-align:right; transition:.2s ease; }
        .carrier-choice strong { display:block; font-size:8px; color:#263d42; }
        .carrier-choice small { display:block; margin-top:3px; font-size:7px; color:#7a8f92; }
        .carrier-choice.is-selected { border-color:var(--carrier-color); box-shadow:0 0 0 3px color-mix(in srgb, var(--carrier-color) 10%, transparent); }
        .carrier-step-number { display:inline-flex; height:28px; min-width:34px; align-items:center; justify-content:center; border-radius:9px; background:#edf6f4; padding:0 8px; font-size:7px; font-weight:700; color:#4c7377; }
        .carrier-brand-identity { min-width:0; }

        .ertikaz-dark { color:#d7e4e4 !important; }
        .ertikaz-dark .ertikaz-sidebar,
        .ertikaz-dark .ertikaz-topbar,
        .ertikaz-dark .ertikaz-surface,
        .ertikaz-dark .workspace-header,
        .ertikaz-dark .workspace-modal-card,
        .ertikaz-dark .record-card,
        .ertikaz-dark .carrier-compare-tile {
          background:#0d252d !important;
          border-color:#234049 !important;
          box-shadow:0 18px 52px rgba(0,7,10,.22) !important;
        }
        .ertikaz-dark .workspace-header { background:#102b33 !important; }
        .ertikaz-dark .workspace-modal,
        .ertikaz-dark .calm-add-backdrop {
          background:rgba(1,10,14,.78) !important;
          backdrop-filter:blur(16px) saturate(.62);
        }
        .ertikaz-dark .workspace-modal-card,
        .ertikaz-dark .calm-add-card {
          background:#0d252d !important;
          border-color:#24434a !important;
          box-shadow:0 32px 120px rgba(0,4,7,.52) !important;
        }
        .ertikaz-dark .calm-add-header,
        .ertikaz-dark .calm-add-footer {
          background:#102b33 !important;
          border-color:#24434a !important;
        }
        .ertikaz-dark [class*="bg-white"],
        .ertikaz-dark [class*="bg-slate-50"],
        .ertikaz-dark [class*="bg-slate-100"],
        .ertikaz-dark .record-meta,
        .ertikaz-dark .carrier-choice,
        .ertikaz-dark .carrier-step-number,
        .ertikaz-dark .modal-close {
          background:#112d35 !important;
          border-color:#294750 !important;
        }
        .ertikaz-dark main[data-module]:not([data-module="dashboard"]) .ertikaz-surface,
        .ertikaz-dark main[data-module]:not([data-module="dashboard"]) .workspace-header,
        .ertikaz-dark main[data-module]:not([data-module="dashboard"]) .record-card {
          background:#0d252d !important;
          border-color:#24434b !important;
        }
        .ertikaz-dark main[data-module]:not([data-module="dashboard"]) .record-icon { background:#14333b !important; color:#7fa9aa !important; }
        .ertikaz-dark .workspace-primary-button { background:#386d72 !important; color:#e5eeee !important; box-shadow:none !important; }
        .ertikaz-dark .workspace-secondary-button,
        .ertikaz-dark .record-action { background:#112d35 !important; border-color:#294750 !important; color:#a8bfc0 !important; }
        .ertikaz-dark .workspace-filter { background:#112d35 !important; border-color:#294750 !important; color:#9bb2b4 !important; }
        .ertikaz-dark .workspace-filter.is-active { background:#3a686c !important; color:#e4eeee !important; }
        .ertikaz-dark .workspace-input { background:#0a2027 !important; border-color:#294750 !important; color:#cddddd !important; }
        .ertikaz-dark .workspace-input:focus { background:#0d252d !important; border-color:#527f82 !important; box-shadow:0 0 0 4px rgba(82,127,130,.10) !important; }
        .ertikaz-dark [class*="text-slate-950"],
        .ertikaz-dark [class*="text-slate-900"],
        .ertikaz-dark [class*="text-slate-800"],
        .ertikaz-dark [class*="text-slate-700"] { color:#d4e1e1 !important; }
        .ertikaz-dark [class*="text-slate-600"],
        .ertikaz-dark [class*="text-slate-500"],
        .ertikaz-dark [class*="text-slate-400"] { color:#829ca0 !important; }
        .ertikaz-dark [class*="bg-emerald-50"] { background:#12342f !important; }
        .ertikaz-dark [class*="bg-amber-50"], .ertikaz-dark [class*="bg-orange-50"] { background:#342c1e !important; }
        .ertikaz-dark [class*="bg-sky-50"], .ertikaz-dark [class*="bg-blue-50"] { background:#122e3a !important; }
        .ertikaz-dark .carrier-directory-row.is-active { background:#112d35 !important; }
        .ertikaz-dark .carrier-brand-identity > span:first-child { filter:saturate(.62) brightness(.75); }

      `}</style>

      {sidebarOpen && (
        <button
          type="button"
          aria-label="إغلاق القائمة"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/25 backdrop-blur-sm lg:hidden"
        />
      )}

      <Sidebar
        activeModule={activeModule}
        sidebarOpen={sidebarOpen}
        language={language}
        currentUser={currentUser}
        onOpen={openModule}
        onClose={() => setSidebarOpen(false)}
      />

      <div
        className={`min-h-screen ${
          language === "ar" ? "lg:mr-[284px]" : "lg:ml-[284px]"
        }`}
      >
        <Topbar
          currentModule={currentModule}
          language={language}
          theme={theme}
          currentUser={currentUser}
          customers={customers}
          notifications={notifications}
          onOpenSidebar={() => setSidebarOpen(true)}
          onToggleLanguage={() =>
            setLanguage((current) => (current === "ar" ? "en" : "ar"))
          }
          onToggleTheme={() =>
            setTheme((current) => (current === "light" ? "dark" : "light"))
          }
          onLogout={logout}
          onOpenModule={openModule}
          onOpenCustomer={openCustomerFromSearch}
          onMarkNotification={markNotification}
          onMarkAllNotifications={markAllNotifications}
        />

        <main data-module={activeModule} className="px-4 py-5 sm:px-6 xl:px-7 xl:py-6">
          <div className="mx-auto max-w-[1580px]">
            {activeModule === "dashboard" && (
              <DashboardView
                greeting={greeting}
                currentDate={currentDate}
                customers={
                  dashboardData.total_customers ??
                  dashboardData.customers_count ??
                  customers.length
                }
                invoices={
                  dashboardData.total_invoices ??
                  dashboardData.invoices_count ??
                  0
                }
                payments={
                  dashboardData.total_payments ??
                  dashboardData.payments_total ??
                  0
                }
                shipments={
                  dashboardData.active_shipments ??
                  dashboardData.total_shipments ??
                  dashboardData.shipments_count ??
                  0
                }
                revenue={
                  dashboardData.total_revenue ??
                  dashboardData.revenue ??
                  dashboardData.total_payments ??
                  dashboardData.payments_total ??
                  0
                }
                refreshing={refreshing}
                hasError={hasError}
                dailyTasks={dailyTasks}
                approvals={approvals}
                activityLog={activityLog}
                onRefresh={() => void getDashboardData(true)}
                onOpenModule={openModule}
                onToggleTask={toggleDailyTask}
                onResolveApproval={resolveApproval}
              />
            )}

            {activeModule === "customers" && !selectedCustomer && (
              <CustomersView
                customers={customers}
                onOpenCustomer={(customerId) => {
                  setSelectedCustomerId(customerId);
                  setCustomerTab("overview");
                }}
                onAddCustomer={() => setShowAddCustomer(true)}
                onDeleteCustomer={deleteCustomer}
              />
            )}

            {activeModule === "customers" && selectedCustomer && (
              <CustomerDetail
                customer={selectedCustomer}
                activeTab={customerTab}
                onChangeTab={setCustomerTab}
                onBack={() => setSelectedCustomerId(null)}
              />
            )}

            {activeModule === "carriers" && (
              <CarriersView
                deliveryModes={deliveryModes}
                onChangeMode={(carrierId, mode) =>
                  setDeliveryModes((current) => ({
                    ...current,
                    [carrierId]: mode,
                  }))
                }
              />
            )}

            {activeModule === "invoices" && <InvoicesWorkspace />}
            {activeModule === "payments" && <PaymentsWorkspace />}
            {activeModule === "shipments" && <ShipmentsWorkspace />}
            {activeModule === "inventory" && <InventoryWorkspace />}
            {activeModule === "reports" && <ReportsWorkspace />}
            {activeModule === "ai" && <AIWorkspace language={language} />}

            {activeModule === "orders" && <OrdersWorkspace />}
            {activeModule === "users" && <UsersWorkspace users={users} setUsers={setUsers} currentUser={currentUser} />}
            {activeModule === "settings" && (
              <SettingsWorkspace
                currentUser={currentUser}
                users={users}
                setUsers={setUsers}
                language={language}
                theme={theme}
                onToggleLanguage={() =>
                  setLanguage((current) => (current === "ar" ? "en" : "ar"))
                }
                onToggleTheme={() =>
                  setTheme((current) => (current === "light" ? "dark" : "light"))
                }
              />
            )}

            <footer className="mt-7 flex flex-col gap-2 border-t border-white/70 pt-4 text-[9px] font-semibold text-slate-400 sm:flex-row sm:items-center sm:justify-between">
              <p>{language === "ar" ? "© 2026 إرتكاز. جميع الحقوق محفوظة." : "© 2026 ERTIKAZ. All rights reserved."}</p>
              <div className="flex items-center gap-2">
                <Clock3 size={12} />
                <span>آخر مزامنة: الآن</span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <ShieldCheck size={12} className="text-emerald-600" />
                <span>الاتصال آمن</span>
              </div>
            </footer>
          </div>
        </main>
      </div>

      {showAddCustomer && (
        <AddCustomerModal
          onClose={() => setShowAddCustomer(false)}
          onSave={addCustomer}
        />
      )}
    </div>
  );
}

function Sidebar({
  activeModule,
  sidebarOpen,
  language,
  currentUser,
  onOpen,
  onClose,
}: {
  activeModule: ModuleKey;
  sidebarOpen: boolean;
  language: Language;
  currentUser: UserRecord;
  onOpen: (module: ModuleKey) => void;
  onClose: () => void;
}) {
  const allowedNavigation = navigation.filter((item) => canAccessModule(currentUser, item.key));

  return (
    <aside
      className={`ertikaz-sidebar fixed inset-y-0 z-50 flex w-[284px] flex-col overflow-hidden border-[#d9e9e5] bg-[#fbfefd]/94 text-slate-900 shadow-[0_0_55px_rgba(33,78,80,0.09)] backdrop-blur-2xl transition-transform duration-300 lg:translate-x-0 ${
        language === "ar"
          ? `right-0 border-l ${sidebarOpen ? "translate-x-0" : "translate-x-full"}`
          : `left-0 border-r ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`
      }`}
    >
      <div className="absolute inset-x-0 top-0 h-44 bg-[#eef8f5]/75" />
      <div className="relative flex h-[78px] items-center justify-between border-b border-white/70 px-4">
        <button type="button" onClick={() => onOpen("dashboard")} className="flex items-center gap-3 text-right">
          <div className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-[#147f75] text-white shadow-[0_10px_24px_rgba(20,127,117,.18)]">
            <Sparkles size={21} />
          </div>
          <div>
            <p className="text-sm font-bold tracking-tight">{language === "ar" ? "إرتكاز" : "ERTIKAZ"}</p>
            <p className="mt-0.5 text-[9px] font-medium tracking-[0.16em] text-slate-500">ERTIKAZ OPERATIONS</p>
          </div>
        </button>
        <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/60 text-slate-500 lg:hidden" aria-label="إغلاق القائمة">
          <X size={17} />
        </button>
      </div>

      <div className="relative flex-1 overflow-y-auto px-3 py-4">
        <div className="grid grid-cols-2 gap-2">
          {allowedNavigation.map((item) => {
            const Icon = item.icon;
            const active = activeModule === item.key;
            return (
              <button key={item.key} type="button" onClick={() => onOpen(item.key)} className={`group relative min-h-[91px] overflow-hidden rounded-[19px] border p-3 text-right transition duration-300 ${active ? "border-[#cce5df] bg-white shadow-[0_14px_32px_rgba(33,78,80,0.10)]" : "border-[#e0ece9] bg-white/70 hover:-translate-y-0.5 hover:bg-white"}`}>
                {active && <span className="absolute inset-x-0 top-0 h-1 bg-[#198f84]" />}
                <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${item.soft}`}><Icon size={17} /></span>
                <span className="mt-2.5 block text-[10px] font-bold text-slate-900">{language === "ar" ? item.label : translateUiText(item.label)}</span>
                <span className="mt-1 block text-[8px] font-medium text-slate-500">{language === "ar" ? item.description : translateUiText(item.description)}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="relative border-t border-white/70 p-3">
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/72 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-35" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" /></span>
              <div><p className="text-[9px] font-bold text-slate-700">{firstName(currentUser.name)}</p><p className="mt-0.5 text-[7px] font-medium text-slate-400">{currentUser.role}</p></div>
            </div>
            <span className="text-[8px] font-bold text-emerald-600">Online</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

function Topbar({
  currentModule,
  language,
  theme,
  currentUser,
  customers,
  notifications,
  onOpenSidebar,
  onToggleLanguage,
  onToggleTheme,
  onLogout,
  onOpenModule,
  onOpenCustomer,
  onMarkNotification,
  onMarkAllNotifications,
}: {
  currentModule: NavItem;
  language: Language;
  theme: ThemeMode;
  currentUser: UserRecord;
  customers: Customer[];
  notifications: NotificationItem[];
  onOpenSidebar: () => void;
  onToggleLanguage: () => void;
  onToggleTheme: () => void;
  onLogout: () => void;
  onOpenModule: (module: ModuleKey) => void;
  onOpenCustomer: (customerId: string) => void;
  onMarkNotification: (notificationId: string) => void;
  onMarkAllNotifications: () => void;
}) {
  const Icon = currentModule.icon;
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const unreadCount = notifications.filter((item) => !item.read).length;

  const searchResults = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];

    const results: Array<{
      key: string;
      title: string;
      meta: string;
      module: ModuleKey;
      customerId?: string;
      icon: LucideIcon;
    }> = [];

    customers.forEach((customer) => {
      const haystack = `${customer.name} ${customer.id} ${customer.email} ${customer.phone}`.toLowerCase();
      if (haystack.includes(normalized)) {
        results.push({ key: customer.id, title: customer.name, meta: `${customer.id} · ملف عميل 360°`, module: "customers", customerId: customer.id, icon: customer.type === "company" ? Building2 : User });
      }
    });
    demoOrders.forEach((order) => {
      const haystack = `${order.id} ${order.customer} ${order.title}`.toLowerCase();
      if (haystack.includes(normalized)) results.push({ key: order.id, title: order.title, meta: `${order.id} · ${order.customer}`, module: "orders", icon: ShoppingCart });
    });
    demoInvoices.forEach((invoice) => {
      const haystack = `${invoice.id} ${invoice.customer} ${invoice.category}`.toLowerCase();
      if (haystack.includes(normalized)) results.push({ key: invoice.id, title: invoice.customer, meta: `${invoice.id} · ${formatCurrency(invoice.amount)}`, module: "invoices", icon: ReceiptText });
    });
    demoShipments.forEach((shipment) => {
      const haystack = `${shipment.id} ${shipment.customer} ${shipment.tracking} ${shipment.carrier}`.toLowerCase();
      if (haystack.includes(normalized)) results.push({ key: shipment.id, title: shipment.customer, meta: `${shipment.id} · ${shipment.tracking}`, module: "shipments", icon: Truck });
    });
    return results.slice(0, 8);
  }, [customers, query]);

  const openSearchResult = (result: (typeof searchResults)[number]) => {
    if (result.customerId) onOpenCustomer(result.customerId);
    else onOpenModule(result.module);
    setQuery("");
    setSearchOpen(false);
  };

  const notificationTone: Record<NotificationItem["tone"], string> = {
    teal: "bg-[#e4f5f1] text-[#147f75]",
    blue: "bg-[#e6f1f8] text-[#2d75a3]",
    amber: "bg-[#fff4d9] text-[#9b6b16]",
    coral: "bg-[#ffebe4] text-[#b4553f]",
  };

  return (
    <header className="ertikaz-topbar sticky top-0 z-30 border-b border-[#dcebe8] bg-[#fbfefd]/92 backdrop-blur-2xl">
      <div className="flex h-[72px] items-center justify-between gap-3 px-4 sm:px-6 xl:px-7">
        <div className="flex min-w-0 items-center gap-3">
          <button type="button" onClick={onOpenSidebar} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#d8e8e4] bg-white text-slate-700 shadow-sm lg:hidden" aria-label="فتح القائمة"><Menu size={19} /></button>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#147f75] text-white shadow-[0_8px_20px_rgba(20,127,117,.18)]"><Icon size={18} /></div>
          <div className="min-w-0">
            <h1 className="truncate text-[15px] font-bold text-slate-950 sm:text-base">{language === "ar" ? currentModule.label : translateUiText(currentModule.label)}</h1>
            <p className="mt-0.5 truncate text-[9px] font-medium text-slate-400">{language === "ar" ? currentModule.description : translateUiText(currentModule.description)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative hidden md:block">
            <Search size={14} className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-slate-400 ${language === "ar" ? "right-3.5" : "left-3.5"}`} />
            <input
              type="search"
              value={query}
              onFocus={() => setSearchOpen(true)}
              onChange={(event) => { setQuery(event.target.value); setSearchOpen(true); }}
              placeholder="ابحث عن عميل، طلب، فاتورة أو شحنة..."
              className={`h-10 w-72 rounded-xl border border-[#d8e8e4] bg-white text-[10px] ${language === "ar" ? "pr-9 pl-3" : "pl-9 pr-3"} font-medium text-slate-700 shadow-sm outline-none transition focus:border-[#57a9a0] focus:ring-4 focus:ring-[#dff2ee]`}
            />
            {searchOpen && query.trim() && (
              <div className={`absolute top-12 z-50 w-[360px] overflow-hidden rounded-2xl border border-[#d8e8e4] bg-white p-2 shadow-[0_24px_70px_rgba(20,61,68,.16)] ${language === "ar" ? "right-0" : "left-0"}`}>
                <div className="flex items-center justify-between px-3 py-2"><p className="text-[9px] font-bold text-slate-700">نتائج البحث الشامل</p><button type="button" onClick={() => setSearchOpen(false)} className="text-slate-400"><X size={13} /></button></div>
                {searchResults.length > 0 ? (
                  <div className="space-y-1">
                    {searchResults.map((result) => { const ResultIcon = result.icon; return (
                      <button key={`${result.module}-${result.key}`} type="button" onClick={() => openSearchResult(result)} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-right transition hover:bg-[#f0f8f6]">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e5f4f1] text-[#147f75]"><ResultIcon size={15} /></span>
                        <span className="min-w-0 flex-1"><span className="block truncate text-[10px] font-bold text-slate-800">{result.title}</span><span className="mt-1 block truncate text-[8px] font-medium text-slate-400">{result.meta}</span></span>
                        <ArrowLeft size={13} className="text-slate-300" />
                      </button>
                    ); })}
                  </div>
                ) : <div className="px-4 py-8 text-center text-[9px] font-medium text-slate-400">لا توجد نتائج مطابقة.</div>}
              </div>
            )}
          </div>

          <button type="button" onClick={onToggleLanguage} className="flex h-10 items-center gap-1.5 rounded-xl border border-[#d8e8e4] bg-white px-3 text-[9px] font-bold text-slate-700 shadow-sm"><Languages size={16} /><span>{language === "ar" ? "EN" : "ع"}</span></button>
          <button type="button" onClick={onToggleTheme} className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#d8e8e4] bg-white text-slate-600 shadow-sm">{theme === "light" ? <Moon size={16} /> : <Sun size={16} />}</button>

          <div className="relative">
            <button type="button" onClick={() => setNotificationsOpen((value) => !value)} className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#d8e8e4] bg-white text-slate-600 shadow-sm" aria-label="الإشعارات">
              <Bell size={17} />
              {unreadCount > 0 && <span className="absolute -left-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#e57c55] px-1 text-[7px] font-bold text-white ring-2 ring-white">{unreadCount}</span>}
            </button>
            {notificationsOpen && (
              <div className={`absolute top-12 z-50 w-[350px] overflow-hidden rounded-2xl border border-[#d8e8e4] bg-white shadow-[0_24px_70px_rgba(20,61,68,.16)] ${language === "ar" ? "left-0" : "right-0"}`}>
                <div className="flex items-center justify-between border-b border-[#e5efed] px-4 py-3"><div><p className="text-[10px] font-bold text-slate-800">مركز الإشعارات</p><p className="mt-1 text-[8px] font-medium text-slate-400">{unreadCount} إشعارات غير مقروءة</p></div><button type="button" onClick={onMarkAllNotifications} className="text-[8px] font-bold text-[#147f75]">تحديد الكل كمقروء</button></div>
                <div className="max-h-[360px] overflow-y-auto p-2">
                  {notifications.map((item) => (
                    <button key={item.id} type="button" onClick={() => { onMarkNotification(item.id); onOpenModule(item.module); setNotificationsOpen(false); }} className={`flex w-full items-start gap-3 rounded-xl p-3 text-right transition hover:bg-[#f3f9f7] ${item.read ? "opacity-65" : "bg-[#fbfefd]"}`}>
                      <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${notificationTone[item.tone]}`}><Bell size={14} /></span>
                      <span className="min-w-0 flex-1"><span className="flex items-center gap-2"><span className="truncate text-[9px] font-bold text-slate-800">{item.title}</span>{!item.read && <span className="h-1.5 w-1.5 rounded-full bg-[#198f84]" />}</span><span className="mt-1 block text-[8px] font-medium leading-5 text-slate-500">{item.description}</span><span className="mt-1 block text-[7px] font-medium text-slate-400">{item.time}</span></span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="hidden h-8 w-px bg-[#dce9e6] sm:block" />
          <div className="group relative flex items-center gap-2 rounded-xl border border-[#d8e8e4] bg-white p-1.5 pr-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#236c83] text-[10px] font-bold text-white">{firstName(currentUser.name).slice(0, 1)}</div>
            <div className="hidden text-right lg:block"><p className="max-w-28 truncate text-[9px] font-bold text-slate-800">{currentUser.name}</p><p className="mt-0.5 text-[8px] font-medium text-slate-400">{currentUser.role}</p></div>
            <button type="button" onClick={onLogout} title={language === "ar" ? "تسجيل الخروج" : "Sign out"} className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 transition hover:bg-[#fff1eb] hover:text-[#b4553f]"><LogOut size={14} /></button>
          </div>
        </div>
      </div>
    </header>
  );
}

function DashboardView({
  greeting,
  currentDate,
  customers,
  invoices,
  payments,
  shipments,
  revenue,
  refreshing,
  hasError,
  dailyTasks,
  approvals,
  activityLog,
  onRefresh,
  onOpenModule,
  onToggleTask,
  onResolveApproval,
}: {
  greeting: string;
  currentDate: string;
  customers: number;
  invoices: number;
  payments: number;
  shipments: number;
  revenue: number;
  refreshing: boolean;
  hasError: boolean;
  dailyTasks: DailyTask[];
  approvals: ApprovalItem[];
  activityLog: ActivityItem[];
  onRefresh: () => void;
  onOpenModule: (module: ModuleKey) => void;
  onToggleTask: (taskId: string) => void;
  onResolveApproval: (approvalId: string, decision: "معتمد" | "مرفوض") => void;
}) {
  const collected = demoInvoices.reduce((sum, invoice) => sum + invoice.paid, 0);
  const invoiced = demoInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const openAmount = demoInvoices.reduce((sum, invoice) => sum + Math.max(0, invoice.amount - invoice.paid), 0);
  const collectionRate = invoiced ? Math.round((collected / invoiced) * 100) : 0;
  const dueInvoices = demoInvoices.filter((invoice) => ["جزئية", "متأخرة"].includes(invoice.status)).length;
  const lowInventory = demoInventory.filter((item) => item.stock <= item.minimum).length;
  const activeShipments = demoShipments.filter((item) => item.status !== "تم التسليم").length;
  const pendingApprovals = approvals.filter((item) => item.status === "بانتظار الاعتماد");
  const openTasks = dailyTasks.filter((item) => item.status === "مفتوحة");

  const kpis = [
    { key: "customers" as ModuleKey, title: "العملاء", value: formatNumber(Number(customers)), hint: "ملفات متكاملة 360°", icon: Users, card: "border-[#cfe9e3] bg-[#f6fcfa]", iconTone: "bg-[#dff3ee] text-[#147f75]", line: "bg-[#198f84]" },
    { key: "invoices" as ModuleKey, title: "الفواتير", value: formatNumber(Number(invoices || demoInvoices.length)), hint: `${dueInvoices} تحتاج متابعة`, icon: ReceiptText, card: "border-[#d4e6f0] bg-[#f7fbfd]", iconTone: "bg-[#e3f0f7] text-[#2d75a3]", line: "bg-[#3b82a6]" },
    { key: "payments" as ModuleKey, title: "التحصيل", value: `${collectionRate}%`, hint: formatCurrency(Number(payments || collected)), icon: WalletCards, card: "border-[#e8dfbf] bg-[#fffdf5]", iconTone: "bg-[#fff2ca] text-[#956613]", line: "bg-[#d4a33b]" },
    { key: "shipments" as ModuleKey, title: "الشحنات النشطة", value: formatNumber(Number(shipments || activeShipments)), hint: "متابعة الحالة والموعد", icon: Truck, card: "border-[#f0d7cc] bg-[#fff9f6]", iconTone: "bg-[#ffe8df] text-[#b4553f]", line: "bg-[#df7652]" },
  ];

  return (
    <>
      <PageIntro
        eyebrow="مركز العمليات التنفيذي"
        title={greeting}
        description="نظرة موحدة على الأداء والمهام والاعتمادات التي تحتاج قرارًا اليوم."
        showDescription
        action={
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={onRefresh} disabled={refreshing} className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#cfe3df] bg-white px-4 text-[10px] font-bold text-slate-700 shadow-sm transition hover:border-[#84bbb3] disabled:opacity-60"><RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />تحديث البيانات</button>
            <button type="button" onClick={() => onOpenModule("reports")} className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#147f75] px-4 text-[10px] font-bold text-white shadow-[0_10px_24px_rgba(20,127,117,.18)]"><BarChart3 size={14} />التقرير التنفيذي</button>
          </div>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-2 text-[10px] font-bold text-slate-500">
        <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#d8e8e4] bg-white px-3 py-2 shadow-sm"><CalendarDays size={13} className="text-[#2d75a3]" />{currentDate}</span>
        <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#cfe9e3] bg-[#eef9f6] px-3 py-2 text-[#147f75]"><CheckCircle2 size={13} />جميع الوحدات متصلة</span>
        <span className="inline-flex items-center gap-1.5 rounded-xl border border-[#eadfbd] bg-[#fff9e8] px-3 py-2 text-[#956613]"><Clock3 size={13} />{openTasks.length} مهام مفتوحة اليوم</span>
      </div>

      {hasError && <div className="mb-5 rounded-2xl border border-[#efd7b0] bg-[#fff8e8] p-4 text-[10px] font-semibold text-[#8a5c14]">تعذر تحديث بعض بيانات الـAPI، لكن بيانات العرض ومركز العمليات يعملان بصورة طبيعية.</div>}

      <section className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((card) => { const CardIcon = card.icon; return (
          <button key={card.key} type="button" onClick={() => onOpenModule(card.key)} className={`dashboard-kpi dashboard-kpi-${card.key} relative overflow-hidden rounded-[24px] border p-5 text-right shadow-[0_14px_42px_rgba(33,78,80,.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_52px_rgba(33,78,80,.11)] ${card.card}`}>
            <span className={`absolute inset-y-0 right-0 w-1 ${card.line}`} />
            <div className="flex items-start justify-between"><span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${card.iconTone}`}><CardIcon size={19} /></span><ArrowLeft size={14} className="text-slate-300" /></div>
            <p className="mt-5 text-[9px] font-bold text-slate-500">{card.title}</p><p className="mt-1 text-[24px] font-bold text-slate-950">{card.value}</p><p className="mt-1.5 text-[9px] font-medium text-slate-500">{card.hint}</p>
          </button>
        ); })}
      </section>

      <section className="mb-5 grid gap-5 xl:grid-cols-[1.05fr_.95fr]">
        <Surface className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#e2eeeb] px-5 py-4"><div><h3 className="text-[13px] font-bold text-slate-900">مركز المتابعة اليومية</h3><p className="mt-1 text-[8px] font-medium text-slate-400">المهام ذات الأولوية مع انتقال مباشر للقسم المرتبط.</p></div><span className="rounded-xl bg-[#eef9f6] px-3 py-2 text-[8px] font-bold text-[#147f75]">{openTasks.length} مهام مفتوحة</span></div>
          <div className="space-y-3 p-5">
            {dailyTasks.map((task) => (
              <div key={task.id} className={`daily-task-row flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center ${task.status === "مكتملة" ? "border-[#dce8e5] bg-[#f7faf9] opacity-70" : "border-[#dce9e6] bg-white"}`}>
                <button type="button" onClick={() => onToggleTask(task.id)} className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${task.status === "مكتملة" ? "border-[#9fcfc5] bg-[#dff3ee] text-[#147f75]" : "border-[#d4e5e1] bg-[#f7fbfa] text-slate-300"}`}>{task.status === "مكتملة" ? <Check size={15} /> : <CircleGauge size={15} />}</button>
                <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><p className={`text-[10px] font-bold ${task.status === "مكتملة" ? "text-slate-400 line-through" : "text-slate-800"}`}>{task.title}</p><span className={`rounded-full px-2.5 py-1 text-[7px] font-bold ${task.priority === "عالية" ? "bg-[#ffebe4] text-[#b4553f]" : task.priority === "متوسطة" ? "bg-[#fff4d9] text-[#956613]" : "bg-[#e6f1f8] text-[#2d75a3]"}`}>{task.priority}</span></div><p className="mt-1 text-[8px] font-medium leading-5 text-slate-500">{task.description}</p><p className="mt-1 text-[7px] font-medium text-slate-400">{task.due}</p></div>
                <button type="button" onClick={() => onOpenModule(task.module)} className="h-9 shrink-0 rounded-xl border border-[#d7e7e3] bg-white px-3 text-[8px] font-bold text-[#147f75]">فتح القسم</button>
              </div>
            ))}
          </div>
        </Surface>

        <Surface className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#e2eeeb] px-5 py-4"><div><h3 className="text-[13px] font-bold text-slate-900">مركز الاعتمادات</h3><p className="mt-1 text-[8px] font-medium text-slate-400">قرارات الإدارة المعلقة في مكان واحد.</p></div><span className="rounded-xl bg-[#fff4d9] px-3 py-2 text-[8px] font-bold text-[#956613]">{pendingApprovals.length} بانتظار القرار</span></div>
          <div className="space-y-3 p-5">
            {approvals.map((approval) => (
              <div key={approval.id} className="approval-row rounded-2xl border border-[#dde9e6] bg-white p-4">
                <div className="flex items-start justify-between gap-3"><div><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-[#e6f1f8] px-2.5 py-1 text-[7px] font-bold text-[#2d75a3]">{approval.type}</span><span className={`rounded-full px-2.5 py-1 text-[7px] font-bold ${approval.status === "معتمد" ? "bg-[#dff3ee] text-[#147f75]" : approval.status === "مرفوض" ? "bg-[#ffebe4] text-[#b4553f]" : "bg-[#fff4d9] text-[#956613]"}`}>{approval.status}</span></div><h4 className="mt-2 text-[10px] font-bold text-slate-800">{approval.title}</h4><p className="mt-1 text-[8px] font-medium leading-5 text-slate-500">{approval.description}</p></div>{approval.amount && <p className="shrink-0 text-[11px] font-bold text-slate-900">{formatCurrency(approval.amount)}</p>}</div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[#edf3f1] pt-3"><p className="text-[7px] font-medium text-slate-400">{approval.requestedBy} · {approval.requestedAt}</p>{approval.status === "بانتظار الاعتماد" ? <div className="flex gap-2"><button type="button" onClick={() => onResolveApproval(approval.id, "مرفوض")} className="h-8 rounded-lg bg-[#fff0eb] px-3 text-[7px] font-bold text-[#b4553f]">رفض</button><button type="button" onClick={() => onResolveApproval(approval.id, "معتمد")} className="h-8 rounded-lg bg-[#147f75] px-3 text-[7px] font-bold text-white">اعتماد</button></div> : <button type="button" onClick={() => onOpenModule(approval.module)} className="text-[7px] font-bold text-[#147f75]">عرض التفاصيل</button>}</div>
              </div>
            ))}
          </div>
        </Surface>
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
        <Surface className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#e2eeeb] px-5 py-4"><div><h3 className="text-[13px] font-bold text-slate-900">اتجاه الإيرادات والتحصيل</h3><p className="mt-1 text-[8px] font-medium text-slate-400">مقارنة شهرية مبسطة بألوان واضحة بدون تدرجات.</p></div><span className="rounded-xl bg-[#e6f1f8] px-3 py-2 text-[8px] font-bold text-[#2d75a3]">آخر 12 شهرًا</span></div>
          <div className="p-5">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4"><div><p className="text-[8px] font-medium text-slate-400">إجمالي الإيرادات</p><p className="mt-1 text-[25px] font-bold text-slate-950">{formatCurrency(Number(revenue || collected))}</p></div><div className="flex gap-4 text-[8px] font-bold"><span className="inline-flex items-center gap-1.5 text-[#147f75]"><span className="h-2.5 w-2.5 rounded-sm bg-[#198f84]" />محصل</span><span className="inline-flex items-center gap-1.5 text-[#2d75a3]"><span className="h-2.5 w-2.5 rounded-sm bg-[#3b82a6]" />مفوتر</span></div></div>
            <div className="chart-panel relative h-64 rounded-[22px] border border-[#d5e9e5] bg-[#f6fcfa] p-4"><div className="absolute inset-x-4 top-1/4 border-t border-dashed border-[#dce8e5]" /><div className="absolute inset-x-4 top-1/2 border-t border-dashed border-[#dce8e5]" /><div className="absolute inset-x-4 top-3/4 border-t border-dashed border-[#dce8e5]" /><div className="relative flex h-full items-end gap-2">{[38,54,49,67,61,76,84,72,91,83,96,88].map((value,index) => <div key={`${value}-${index}`} className="group flex h-full flex-1 items-end justify-center"><div className={`w-full max-w-7 rounded-t-lg transition duration-300 group-hover:-translate-y-1 ${index % 4 === 0 ? "bg-[#198f84]" : index % 4 === 1 ? "bg-[#3b82a6]" : index % 4 === 2 ? "bg-[#d4a33b]" : "bg-[#df7652]"}`} style={{height:`${value}%`}} /></div>)}</div></div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3"><div className="rounded-2xl bg-[#eef9f6] p-4"><p className="text-[8px] font-medium text-[#4d817b]">نسبة التحصيل</p><p className="mt-2 text-xl font-bold text-[#147f75]">{collectionRate}%</p></div><div className="rounded-2xl bg-[#fff9e8] p-4"><p className="text-[8px] font-medium text-[#9b7a35]">الرصيد المفتوح</p><p className="mt-2 text-xl font-bold text-[#956613]">{formatCurrency(openAmount)}</p></div><div className="rounded-2xl bg-[#fff1eb] p-4"><p className="text-[8px] font-medium text-[#a76553]">تنبيهات المخزون</p><p className="mt-2 text-xl font-bold text-[#b4553f]">{lowInventory}</p></div></div>
          </div>
        </Surface>

        <Surface className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#e2eeeb] px-5 py-4"><div><h3 className="text-[13px] font-bold text-slate-900">سجل النشاطات</h3><p className="mt-1 text-[8px] font-medium text-slate-400">آخر الإجراءات المنفذة داخل النظام.</p></div><Activity size={17} className="text-[#147f75]" /></div>
          <div className="space-y-1 p-3">
            {activityLog.slice(0, 7).map((activity) => (
              <button key={activity.id} type="button" onClick={() => onOpenModule(activity.module)} className="activity-row flex w-full items-start gap-3 rounded-2xl p-3 text-right transition hover:bg-[#eaf7f4]"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e6f1f8] text-[#2d75a3]"><Activity size={14} /></span><span className="min-w-0 flex-1"><span className="block text-[9px] font-bold text-slate-800">{activity.user} <span className="font-medium text-slate-500">{activity.action}</span></span><span className="mt-1 block truncate text-[8px] font-medium text-slate-500">{activity.target}</span><span className="mt-1 block text-[7px] font-medium text-slate-400">{activity.time}</span></span><ArrowLeft size={12} className="mt-2 text-slate-300" /></button>
            ))}
          </div>
        </Surface>
      </section>
    </>
  );
}

function CustomersView({
  customers,
  onOpenCustomer,
  onAddCustomer,
  onDeleteCustomer,
}: {
  customers: Customer[];
  onOpenCustomer: (customerId: string) => void;
  onAddCustomer: () => void;
  onDeleteCustomer: (customerId: string) => void;
}) {
  const [filter, setFilter] = useState<"all" | CustomerType>("all");
  const [search, setSearch] = useState("");

  const filteredCustomers = useMemo(() => {
    const value = search.trim().toLowerCase();
    return customers.filter((customer) => {
      const typeMatches = filter === "all" || customer.type === filter;
      const searchMatches =
        !value ||
        `${customer.name} ${customer.email} ${customer.phone} ${customer.city}`
          .toLowerCase()
          .includes(value);
      return typeMatches && searchMatches;
    });
  }, [customers, filter, search]);

  const totalPortfolio = customers.reduce(
    (sum, customer) => sum + customer.totalSpent,
    0,
  );
  const openBalance = customers.reduce(
    (sum, customer) => sum + customer.outstanding,
    0,
  );
  const priorityCustomers = [...customers]
    .filter((customer) => customer.outstanding > 0)
    .sort((a, b) => b.outstanding - a.outstanding)
    .slice(0, 3);

  return (
    <>
      <WorkspaceHeader
        eyebrow="ERTIKAZ CUSTOMER WORKSPACE"
        title="مركز العملاء"
        description="واجهة مرتبة للوصول إلى العميل، معلوماته، معاملاته، والخطوة التالية بدون ازدحام بصري."
        icon={Users}
        action={
          <button
            type="button"
            onClick={onAddCustomer}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-slate-900 px-5 text-[9px] font-bold text-white shadow-lg transition hover:-translate-y-0.5"
          >
            <Plus size={15} />
            إضافة عميل
          </button>
        }
      />

      <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MiniStat label="إجمالي العملاء" value={formatNumber(customers.length)} icon={Users} tone="bg-sky-50 text-sky-700" note="الأفراد والشركات" />
        <MiniStat label="الشركات" value={formatNumber(customers.filter((item) => item.type === "company").length)} icon={Building2} tone="bg-[#e6f1f8] text-[#2d75a3]" note="حسابات أعمال" />
        <MiniStat label="قيمة التعاملات" value={formatCurrency(totalPortfolio)} icon={CircleDollarSign} tone="bg-emerald-50 text-emerald-700" note="إجمالي المحفظة" />
        <MiniStat label="الرصيد المفتوح" value={formatCurrency(openBalance)} icon={WalletCards} tone="bg-amber-50 text-amber-700" note="يحتاج متابعة" />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1fr_310px]">
        <Surface className="overflow-hidden">
          <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h3 className="text-[13px] font-bold text-slate-900">دليل العملاء</h3>
              <p className="mt-1 text-[9px] font-medium text-slate-400">اختاري العميل لفتح ملفه الكامل.</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex gap-2">
                {[
                  { key: "all" as const, label: "الكل" },
                  { key: "company" as const, label: "الشركات" },
                  { key: "individual" as const, label: "الأفراد" },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setFilter(item.key)}
                    className={`rounded-xl px-3.5 py-2 text-[8px] font-bold transition ${
                      filter === item.key
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search size={14} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="ابحث عن عميل..."
                  className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pr-10 pl-3 text-[9px] font-medium outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
                />
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredCustomers.map((customer, index) => (
              <CustomerCard
                key={customer.id}
                customer={customer}
                index={index}
                onOpen={() => onOpenCustomer(customer.id)}
                onDelete={() => onDeleteCustomer(customer.id)}
              />
            ))}
            {filteredCustomers.length === 0 && (
              <div className="p-10 text-center">
                <Search size={24} className="mx-auto text-slate-300" />
                <p className="mt-3 text-[9px] font-medium text-slate-400">لا توجد نتائج مطابقة.</p>
              </div>
            )}
          </div>
        </Surface>

        <div className="space-y-5">
          <Surface className="overflow-hidden">
            <div className="border-b border-slate-100 px-5 py-4">
              <h3 className="text-[12px] font-bold text-slate-900">أولوية المتابعة</h3>
              <p className="mt-1 text-[8px] font-medium text-slate-400">أعلى الأرصدة المفتوحة.</p>
            </div>
            <div className="space-y-3 p-4">
              {priorityCustomers.map((customer, index) => (
                <button
                  key={customer.id}
                  type="button"
                  onClick={() => onOpenCustomer(customer.id)}
                  className="flex w-full items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3 text-right transition hover:bg-white hover:shadow-sm"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[10px] font-bold text-slate-600 shadow-sm">{index + 1}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[9px] font-bold text-slate-800">{customer.name}</p>
                    <p className="mt-1 text-[8px] font-medium text-slate-400">{customer.city}</p>
                  </div>
                  <span className="text-[9px] font-bold text-amber-700">{formatCurrency(customer.outstanding)}</span>
                </button>
              ))}
            </div>
          </Surface>

          <div className="rounded-[24px] bg-slate-900 p-5 text-white shadow-lg">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10"><Lightbulb size={17} /></span>
              <div>
                <p className="text-[8px] font-medium text-white/55">اقتراح اليوم</p>
                <h3 className="mt-1 text-[10px] font-bold">تابعي العملاء ذوي الرصيد المفتوح أولًا</h3>
              </div>
            </div>
            <p className="mt-4 text-[8px] font-medium leading-5 text-white/65">فتح ملف العميل يعطيك الفواتير والمدفوعات والملاحظات قبل التواصل.</p>
          </div>
        </div>
      </section>
    </>
  );
}

function CustomerCard({
  customer,
  index,
  onOpen,
  onDelete,
}: {
  customer: Customer;
  index: number;
  onOpen: () => void;
  onDelete: () => void;
}) {
  const iconTones = [
    "bg-sky-50 text-sky-700",
    "bg-[#e6f1f8] text-[#2d75a3]",
    "bg-emerald-50 text-emerald-700",
    "bg-amber-50 text-amber-700",
  ];

  return (
    <div className="group grid w-full gap-3 border-b border-slate-100 px-4 py-3 md:grid-cols-[1fr_auto] md:items-center">
      <button
        type="button"
        onClick={onOpen}
        className="grid w-full gap-4 rounded-2xl p-2 text-right transition hover:bg-slate-50/80 md:grid-cols-[minmax(240px,1.2fr)_repeat(3,minmax(100px,.55fr))_auto] md:items-center"
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${iconTones[index % iconTones.length]}`}>
            {customer.type === "company" ? <Building2 size={18} /> : <User size={18} />}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-[10px] font-bold text-slate-900">{customer.name}</h3>
              <span className={`rounded-full px-2.5 py-1 text-[7px] font-bold ring-1 ${statusTone(customer.status)}`}>{customer.status}</span>
            </div>
            <p className="mt-1 truncate text-[8px] font-medium text-slate-400">{customer.id} · {customer.city} · {customer.type === "company" ? "شركة" : "فرد"}</p>
          </div>
        </div>
        <div><p className="text-[7px] font-medium text-slate-400">إجمالي التعاملات</p><p className="mt-1 text-[9px] font-bold text-slate-800">{formatCurrency(customer.totalSpent)}</p></div>
        <div><p className="text-[7px] font-medium text-slate-400">الرصيد المستحق</p><p className={`mt-1 text-[9px] font-bold ${customer.outstanding > 0 ? "text-amber-700" : "text-emerald-700"}`}>{formatCurrency(customer.outstanding)}</p></div>
        <div><p className="text-[7px] font-medium text-slate-400">آخر نشاط</p><p className="mt-1 text-[9px] font-bold text-slate-700">{customer.shipments.length > 0 ? "شحنة محدثة" : "ملف العميل"}</p></div>
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-400 transition group-hover:-translate-x-1 group-hover:bg-slate-900 group-hover:text-white"><ArrowLeft size={13} /></span>
      </button>
      <button
        type="button"
        onClick={() => {
          if (window.confirm(`حذف العميل ${customer.name}؟`)) onDelete();
        }}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-500 transition hover:bg-red-500 hover:text-white"
        aria-label="حذف العميل"
        title="حذف العميل"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

function CustomerDetail({
  customer,
  activeTab,
  onChangeTab,
  onBack,
}: {
  customer: Customer;
  activeTab: CustomerTab;
  onChangeTab: (tab: CustomerTab) => void;
  onBack: () => void;
}) {
  const tabs: Array<{ key: CustomerTab; label: string; icon: LucideIcon; count?: number }> = [
    { key: "overview", label: "نظرة عامة", icon: LayoutDashboard },
    { key: "invoices", label: "الفواتير", icon: ReceiptText, count: customer.invoices.length },
    { key: "shipments", label: "الشحنات", icon: PackageCheck, count: customer.shipments.length },
    { key: "payments", label: "المدفوعات", icon: WalletCards, count: customer.payments.length },
    { key: "notes", label: "الملاحظات", icon: ClipboardList, count: customer.notes.length },
  ];
  const relationshipScore = Math.min(96, Math.max(62, 68 + customer.totalOrders + customer.payments.length * 4));

  return (
    <>
      <section className="relative mb-5 overflow-hidden rounded-[28px] border border-[#d4e8e3] bg-[#fbfefd] p-5 shadow-[0_20px_58px_rgba(33,78,80,0.09)] sm:p-6">
        <div className="absolute inset-y-0 right-0 w-1.5 bg-[#198f84]" />
        <div className="absolute -left-16 -top-20 h-56 w-56 rounded-full border border-[#d8ebe7] bg-[#eef9f6]" />
        <div className="relative z-10">
          <button type="button" onClick={onBack} className="mb-5 inline-flex items-center gap-1.5 text-[9px] font-black text-slate-600 transition hover:text-slate-900"><ChevronLeft size={13} /> العودة إلى العملاء</button>
          <div className="grid gap-5 xl:grid-cols-[1fr_auto] xl:items-center">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[24px] bg-[#236c83] text-white shadow-[0_14px_32px_rgba(35,108,131,.18)]">{customer.type === "company" ? <Building2 size={32} /> : <User size={32} />}</span>
              <div>
                <div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-white/70 px-3 py-1 text-[8px] font-black text-slate-600">{customer.type === "company" ? "شركة" : "فرد"}</span><span className={`rounded-full px-3 py-1 text-[8px] font-black ring-1 ${statusTone(customer.status)}`}>{customer.status}</span><span className="rounded-full bg-slate-900 px-3 py-1 text-[8px] font-black text-white">صحة العلاقة {relationshipScore}%</span></div>
                <p className="mt-3 text-[8px] font-bold tracking-[.12em] text-[#147f75]">ملف العميل 360°</p><h2 className="mt-1 text-[24px] font-black text-slate-950">{customer.name}</h2>
                <p className="mt-1 text-[10px] font-semibold text-slate-500">{customer.id} · عميل منذ {customer.joinedAt} · {customer.city}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2"><button type="button" className="inline-flex h-10 items-center gap-2 rounded-xl border border-white bg-white/75 px-4 text-[9px] font-black text-slate-700 shadow-sm"><Mail size={14} /> إرسال رسالة</button><button type="button" className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-900 px-4 text-[9px] font-black text-white shadow-lg"><Plus size={14} /> إنشاء عملية</button></div>
          </div>
        </div>
      </section>

      <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MiniStat label="إجمالي التعاملات" value={formatCurrency(customer.totalSpent)} icon={CircleDollarSign} tone="bg-emerald-50 text-emerald-700" note="قيمة العلاقة منذ البداية" />
        <MiniStat label="الرصيد المستحق" value={formatCurrency(customer.outstanding)} icon={WalletCards} tone="bg-amber-50 text-amber-700" note="مبالغ تحتاج متابعة" />
        <MiniStat label="عدد الطلبات" value={formatNumber(customer.totalOrders)} icon={ShoppingCart} tone="bg-sky-50 text-sky-700" note="إجمالي الطلبات المسجلة" />
        <MiniStat label="الشحنات" value={formatNumber(customer.shipments.length)} icon={Truck} tone="bg-[#e6f1f8] text-[#2d75a3]" note="الشحنات المرتبطة بالعميل" />
      </section>

      <Surface className="mb-5 overflow-hidden p-2"><div className="flex gap-2 overflow-x-auto">{tabs.map((tab) => { const Icon = tab.icon; const active = activeTab === tab.key; return <button key={tab.key} type="button" onClick={() => onChangeTab(tab.key)} className={`flex shrink-0 items-center gap-2 rounded-2xl px-4 py-3 text-[9px] font-black transition ${active ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-slate-100"}`}><Icon size={14} />{tab.label}{typeof tab.count === "number" && <span className={`rounded-lg px-2 py-0.5 text-[8px] ${active ? "bg-white/10" : "bg-slate-100"}`}>{tab.count}</span>}</button>; })}</div></Surface>

      {activeTab === "overview" && <CustomerOverview customer={customer} />}
      {activeTab === "invoices" && <InvoiceCards invoices={customer.invoices} />}
      {activeTab === "shipments" && <ShipmentCards shipments={customer.shipments} />}
      {activeTab === "payments" && <PaymentCards payments={customer.payments} />}
      {activeTab === "notes" && <NotesCards notes={customer.notes} />}
    </>
  );
}

function CustomerOverview({ customer }: { customer: Customer }) {
  const contactItems = [
    { label: "البريد الإلكتروني", value: customer.email, icon: Mail },
    { label: "رقم الجوال", value: customer.phone, icon: Phone },
    { label: "المدينة", value: customer.city, icon: MapPin },
    { label: "العنوان", value: customer.address, icon: Globe2 },
  ];

  const identityItems = customer.type === "company"
    ? [
        { label: "الرقم الضريبي", value: customer.vatNumber ?? "غير مسجل", icon: ReceiptText },
        { label: "السجل التجاري", value: customer.commercialRegistration ?? "غير مسجل", icon: FileText },
        { label: "مسؤول التواصل", value: customer.contactPerson ?? "غير محدد", icon: UserCog },
        { label: "الموقع الإلكتروني", value: customer.companyWebsite ?? "غير مسجل", icon: Globe2 },
      ]
    : [
        { label: "رقم الهوية", value: customer.nationalId ?? "غير مسجل", icon: BadgeCheck },
        { label: "نوع العميل", value: "فرد", icon: User },
      ];

  const latestActivities = [
    { title: "تم تسجيل دفعة جديدة", description: "تم ربط الدفعة بآخر فاتورة.", date: "منذ ساعتين", icon: WalletCards, tone: "bg-emerald-50 text-emerald-700" },
    { title: "تحديث حالة الشحنة", description: "تم تحديث مرحلة التوصيل.", date: "منذ 5 ساعات", icon: Truck, tone: "bg-sky-50 text-sky-700" },
    { title: "إصدار فاتورة", description: "تم إنشاء فاتورة خدمات.", date: "أمس", icon: ReceiptText, tone: "bg-[#e6f1f8] text-[#2d75a3]" },
  ];

  return (
    <section className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
      <div className="space-y-5">
        <Surface className="overflow-hidden">
          <div className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-[13px] font-bold text-slate-900">معلومات العميل</h3>
            <p className="mt-1 text-[8px] font-medium text-slate-400">بيانات التواصل والبيانات النظامية.</p>
          </div>
          <div className="grid gap-5 p-5 lg:grid-cols-2">
            <div className="space-y-3">
              <p className="text-[8px] font-bold text-slate-500">معلومات التواصل</p>
              {contactItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3.5">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-sky-600 shadow-sm"><Icon size={14} /></span>
                    <div className="min-w-0"><p className="text-[7px] font-medium text-slate-400">{item.label}</p><p className="mt-1 truncate text-[9px] font-bold text-slate-800">{item.value}</p></div>
                  </div>
                );
              })}
            </div>
            <div className="space-y-3">
              <p className="text-[8px] font-bold text-slate-500">البيانات النظامية</p>
              {identityItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3.5 shadow-sm">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e6f1f8] text-[#2d75a3]"><Icon size={14} /></span>
                    <div className="min-w-0"><p className="text-[7px] font-medium text-slate-400">{item.label}</p><p className="mt-1 truncate text-[9px] font-bold text-slate-800">{item.value}</p></div>
                  </div>
                );
              })}
            </div>
          </div>
        </Surface>

        <Surface className="overflow-hidden">
          <div className="border-b border-slate-100 px-5 py-4">
            <h3 className="text-[13px] font-bold text-slate-900">النشاط الأخير</h3>
            <p className="mt-1 text-[8px] font-medium text-slate-400">آخر العمليات المرتبطة بالعميل.</p>
          </div>
          <div className="divide-y divide-slate-100 px-5">
            {latestActivities.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex items-center gap-3 py-4">
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.tone}`}><Icon size={14} /></span>
                  <div className="min-w-0 flex-1"><p className="text-[9px] font-bold text-slate-800">{item.title}</p><p className="mt-1 text-[8px] font-medium text-slate-400">{item.description}</p></div>
                  <span className="text-[8px] font-medium text-slate-400">{item.date}</span>
                </div>
              );
            })}
          </div>
        </Surface>
      </div>

      <div className="space-y-5">
        <Surface className="p-5">
          <div className="flex items-center justify-between">
            <div><p className="text-[8px] font-medium text-slate-400">ملخص العلاقة</p><h3 className="mt-1 text-[13px] font-bold text-slate-900">حساب منظم وقابل للنمو</h3></div>
            <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[8px] font-bold text-emerald-700">مستقر</span>
          </div>
          <div className="mt-5 space-y-3">
            {[
              { label: "الفواتير المفتوحة", value: String(customer.invoices.filter((item) => item.status !== "مدفوعة").length) },
              { label: "الشحنات النشطة", value: String(customer.shipments.filter((item) => item.status !== "تم التسليم").length) },
              { label: "آخر دفعة", value: customer.payments[0]?.date ?? "غير متوفر" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"><span className="text-[8px] font-medium text-slate-500">{item.label}</span><span className="text-[9px] font-bold text-slate-800">{item.value}</span></div>
            ))}
          </div>
        </Surface>

        <div className="rounded-[24px] bg-slate-900 p-5 text-white shadow-lg">
          <div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10"><Lightbulb size={17} /></span><div><p className="text-[8px] font-medium text-white/55">الإجراء التالي</p><h3 className="mt-1 text-[10px] font-bold">جدولة متابعة مع العميل</h3></div></div>
          <p className="mt-4 text-[8px] font-medium leading-5 text-white/65">راجعي الرصيد المفتوح والملاحظات قبل الاتصال.</p>
          <button type="button" className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-white text-[8px] font-bold text-slate-900"><CalendarClock size={14} /> إنشاء مهمة متابعة</button>
        </div>
      </div>
    </section>
  );
}

function InvoiceCards({ invoices }: { invoices: CustomerInvoice[] }) {
  if (invoices.length === 0) {
    return <EmptyState title="لا توجد فواتير لهذا العميل" icon={ReceiptText} />;
  }

  return (
    <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
      {invoices.map((invoice) => (
        <Surface key={invoice.id} className="overflow-hidden p-5">
          <div className="flex items-start justify-between gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F0EDF4] text-[#716983]">
              <ReceiptText size={18} />
            </span>
            <span
              className={`rounded-full px-3 py-1 text-[8px] font-black ring-1 ${statusTone(
                invoice.status,
              )}`}
            >
              {invoice.status}
            </span>
          </div>
          <p className="mt-4 text-[10px] font-black text-[#456B82]">
            {invoice.id}
          </p>
          <h3 className="mt-1.5 text-[12px] font-black text-slate-900">
            {invoice.title}
          </h3>
          <p className="mt-3 text-[21px] font-black text-slate-950">
            {formatCurrency(invoice.amount)}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2 text-[8px] font-bold text-slate-400">
            <div className="rounded-xl bg-slate-50 p-3">
              <p>تاريخ الإصدار</p>
              <p className="mt-1 text-slate-700">{invoice.issueDate}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <p>تاريخ الاستحقاق</p>
              <p className="mt-1 text-slate-700">{invoice.dueDate}</p>
            </div>
          </div>
        </Surface>
      ))}
    </section>
  );
}

function ShipmentCards({ shipments }: { shipments: CustomerShipment[] }) {
  if (shipments.length === 0) {
    return <EmptyState title="لا توجد شحنات لهذا العميل" icon={PackageOpen} />;
  }

  return (
    <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
      {shipments.map((shipment) => (
        <Surface key={shipment.id} className="p-5">
          <div className="flex items-start justify-between gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F5EFE5] text-[#8E704E]">
              <Truck size={18} />
            </span>
            <span
              className={`rounded-full px-3 py-1 text-[8px] font-black ring-1 ${statusTone(
                shipment.status,
              )}`}
            >
              {shipment.status}
            </span>
          </div>

          <p className="mt-4 text-[10px] font-black text-[#8E704E]">
            {shipment.id}
          </p>
          <h3 className="mt-1.5 text-[12px] font-black text-slate-900">
            {shipment.carrier}
          </h3>
          <p className="mt-2 text-[10px] font-semibold text-slate-500">
            {shipment.route}
          </p>

          <div className="mt-4 rounded-2xl bg-slate-50 p-3">
            <p className="text-[8px] font-bold text-slate-400">رقم التتبع</p>
            <p className="mt-1 text-[10px] font-black text-slate-800">
              {shipment.tracking}
            </p>
          </div>

          <p className="mt-3 text-[8px] font-bold text-slate-400">
            {shipment.date}
          </p>
        </Surface>
      ))}
    </section>
  );
}

function PaymentCards({ payments }: { payments: CustomerPayment[] }) {
  if (payments.length === 0) {
    return (
      <EmptyState title="لا توجد مدفوعات لهذا العميل" icon={WalletCards} />
    );
  }

  return (
    <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
      {payments.map((payment) => (
        <Surface key={payment.id} className="p-5">
          <div className="flex items-start justify-between gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <WalletCards size={18} />
            </span>
            <span
              className={`rounded-full px-3 py-1 text-[8px] font-black ring-1 ${statusTone(
                payment.status,
              )}`}
            >
              {payment.status}
            </span>
          </div>

          <p className="mt-4 text-[10px] font-black text-emerald-700">
            {payment.id}
          </p>
          <p className="mt-2 text-[21px] font-black text-slate-950">
            {formatCurrency(payment.amount)}
          </p>
          <p className="mt-2 text-[10px] font-semibold text-slate-500">
            {payment.method}
          </p>
          <p className="mt-4 text-[8px] font-bold text-slate-400">
            {payment.date}
          </p>
        </Surface>
      ))}
    </section>
  );
}

function NotesCards({ notes }: { notes: string[] }) {
  if (notes.length === 0) {
    return (
      <EmptyState title="لا توجد ملاحظات على هذا العميل" icon={ClipboardList} />
    );
  }

  return (
    <section className="grid gap-4 md:grid-cols-2">
      {notes.map((note, index) => (
        <Surface key={`${note}-${index}`} className="p-5">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#F5EFE5] text-[#8E704E]">
              <ClipboardList size={17} />
            </span>
            <div>
              <p className="text-[9px] font-bold text-slate-400">
                ملاحظة رقم {index + 1}
              </p>
              <p className="mt-2 text-[11px] font-semibold leading-6 text-slate-700">
                {note}
              </p>
            </div>
          </div>
        </Surface>
      ))}
    </section>
  );
}

function EmptyState({
  title,
  icon: Icon,
}: {
  title: string;
  icon: LucideIcon;
}) {
  return (
    <Surface className="p-10 text-center">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
        <Icon size={23} />
      </span>
      <h3 className="mt-4 text-sm font-black text-slate-800">{title}</h3>
      <p className="mt-2 text-[10px] font-semibold text-slate-400">
        ستظهر البيانات هنا بمجرد إضافتها.
      </p>
    </Surface>
  );
}


function CarrierLogo({
  carrierId,
  compact = false,
}: {
  carrierId: string;
  compact?: boolean;
}) {
  const brands: Record<string, { name: string; latin: string; code: string; color: string; soft: string; border: string }> = {
    aramex: { name: "أرامكس", latin: "ARAMEX", code: "ARX", color: "#C9272C", soft: "#FFF4F4", border: "#F2D1D2" },
    smsa: { name: "سمسا إكسبريس", latin: "SMSA EXPRESS", code: "SMSA", color: "#66418D", soft: "#F8F4FC", border: "#E3D7EE" },
    spl: { name: "سبل", latin: "SAUDI POST | SPL", code: "SPL", color: "#2176A8", soft: "#F2F8FC", border: "#CEE3EF" },
  };
  const brand = brands[carrierId] ?? brands.spl;

  return (
    <div
      className={`carrier-brand-identity flex items-center ${compact ? "gap-2" : "gap-3"}`}
      aria-label={brand.name}
    >
      <span
        className={`flex shrink-0 items-center justify-center rounded-xl font-bold ${compact ? "h-9 w-9 text-[8px]" : "h-11 w-11 text-[9px]"}`}
        style={{ backgroundColor: brand.soft, color: brand.color, border: `1px solid ${brand.border}` }}
      >
        {brand.code}
      </span>
      <span className="min-w-0 text-right">
        <strong className={`${compact ? "text-[9px]" : "text-[11px]"} block truncate font-bold text-slate-900`}>{brand.name}</strong>
        <small className={`${compact ? "text-[6px]" : "text-[7px]"} mt-0.5 block truncate font-medium tracking-[.08em] text-slate-400`}>{brand.latin}</small>
      </span>
    </div>
  );
}


function CarriersView({
  deliveryModes,
  onChangeMode,
}: {
  deliveryModes: Record<string, DeliveryMode>;
  onChangeMode: (carrierId: string, mode: DeliveryMode) => void;
}) {
  type ShippingScope = "domestic" | "international";

  const [quote, setQuote] = useState<{
    carrierId: string;
    scope: ShippingScope;
    mode: DeliveryMode;
  }>({
    carrierId: "aramex",
    scope: "domestic",
    mode: deliveryModes.aramex ?? "pickup",
  });
  const [confirmed, setConfirmed] = useState(false);

  const palette: Record<string, { color: string; soft: string; border: string }> = {
    aramex: { color: "#C9272C", soft: "#FFF7F7", border: "#F1D4D5" },
    smsa: { color: "#66418D", soft: "#FAF7FC", border: "#E6DCEF" },
    spl: { color: "#2176A8", soft: "#F4F9FC", border: "#D2E5EF" },
  };

  const carrier =
    deliveryCompanies.find((item) => item.id === quote.carrierId) ??
    deliveryCompanies[0];
  const brand = palette[carrier.id];

  const calculateQuote = useCallback(
    (item: DeliveryCompany, scope: ShippingScope, itemMode: DeliveryMode) => {
      const shippingPrice =
        scope === "domestic" ? item.domesticPrice : item.internationalPrice;
      const handoverPrice =
        itemMode === "pickup"
          ? scope === "domestic"
            ? item.pickupPrice
            : item.internationalPickupPrice
          : scope === "domestic"
            ? item.dropoffPrice
            : item.internationalDropoffPrice;

      return {
        shippingPrice,
        handoverPrice,
        total: shippingPrice + handoverPrice,
      };
    },
    [],
  );

  const activePricing = useMemo(
    () => calculateQuote(carrier, quote.scope, quote.mode),
    [calculateQuote, carrier, quote.scope, quote.mode],
  );

  const chooseCarrier = (carrierId: string) => {
    const nextMode = deliveryModes[carrierId] ?? "pickup";
    setQuote((current) => ({ ...current, carrierId, mode: nextMode }));
    setConfirmed(false);
  };

  const chooseScope = (scope: ShippingScope) => {
    setQuote((current) => ({ ...current, scope }));
    setConfirmed(false);
  };

  const chooseMode = (mode: DeliveryMode) => {
    setQuote((current) => ({ ...current, mode }));
    onChangeMode(quote.carrierId, mode);
    setConfirmed(false);
  };

  const priceFor = (item: DeliveryCompany) => {
    const itemMode =
      item.id === quote.carrierId
        ? quote.mode
        : deliveryModes[item.id] ?? "pickup";
    return calculateQuote(item, quote.scope, itemMode).total;
  };

  return (
    <>
      <WorkspaceHeader
        eyebrow="DELIVERY MANAGEMENT"
        title="شركات التوصيل"
        description="اختيار الناقل وإعداد طريقة الشحن واعتماد التكلفة من مسار واحد واضح."
        icon={Truck}
      />

      <section className="carrier-command-grid grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)]">
        <Surface className="carrier-directory overflow-hidden p-0">
          <div className="border-b border-[#dcece9] bg-[#f5fbfa] px-5 py-4">
            <p className="text-[8px] font-medium text-[#6c8888]">شركات التوصيل المتاحة</p>
            <h3 className="mt-1 text-[12px] font-bold text-slate-900">اختاري الناقل</h3>
          </div>
          <div className="space-y-2.5 p-3">
            {deliveryCompanies.map((item) => {
              const active = item.id === quote.carrierId;
              const itemPalette = palette[item.id];
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => chooseCarrier(item.id)}
                  className={`carrier-directory-row w-full rounded-[20px] border p-3.5 text-right transition ${active ? "is-active" : ""}`}
                  style={{
                    borderColor: active ? itemPalette.border : "#e4efed",
                    backgroundColor: active ? itemPalette.soft : "rgba(255,255,255,.72)",
                    ["--carrier-color" as string]: itemPalette.color,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <CarrierLogo carrierId={item.id} compact />
                    <span className="mr-auto text-left">
                      <small className="block text-[6px] font-medium text-slate-400">
                        السعر الحالي
                      </small>
                      <strong
                        className="mt-1 block text-[12px] font-bold"
                        style={{ color: itemPalette.color }}
                      >
                        <span data-live-value="true">{priceFor(item)}</span> ر.س
                      </strong>
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-black/5 pt-3 text-[7px] font-medium text-slate-500">
                    <span>{item.deliveryTime}</span>
                    <span>{item.coverage}</span>
                    {active && (
                      <span
                        className="inline-flex items-center gap-1 font-bold"
                        style={{ color: itemPalette.color }}
                      >
                        <Check size={11} /> محددة
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </Surface>

        <div className="min-w-0 space-y-5">
          <Surface className="carrier-workflow overflow-hidden p-0">
            <div className="carrier-workflow-head flex flex-col gap-4 border-b border-[#dcece9] bg-[#f7fcfb] p-5 sm:flex-row sm:items-center sm:justify-between">
              <CarrierLogo carrierId={carrier.id} />
              <div className="flex flex-wrap gap-2">
                {[carrier.serviceLevel, carrier.deliveryTime, carrier.coverage].map((value) => (
                  <span
                    key={value}
                    className="rounded-full border border-[#dcece9] bg-white/80 px-3 py-1.5 text-[7px] font-medium text-[#587477]"
                  >
                    {value}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-0 lg:grid-cols-3">
              <div className="carrier-step border-b border-[#e2efed] p-5 lg:border-b-0 lg:border-l">
                <span className="carrier-step-number">01</span>
                <h4 className="mt-3 text-[10px] font-bold text-slate-900">نطاق الشحنة</h4>
                <p className="mt-1 text-[7px] font-medium leading-5 text-slate-400">
                  السعر الأساسي يختلف مباشرة بين المحلي والدولي.
                </p>
                <div className="mt-4 space-y-2">
                  {([
                    {
                      value: "domestic" as const,
                      label: "داخل المملكة",
                      icon: MapPin,
                      price: carrier.domesticPrice,
                    },
                    {
                      value: "international" as const,
                      label: "شحن دولي",
                      icon: Globe2,
                      price: carrier.internationalPrice,
                    },
                  ]).map((option) => {
                    const Icon = option.icon;
                    const active = quote.scope === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => chooseScope(option.value)}
                        className={`carrier-choice ${active ? "is-selected" : ""}`}
                        style={{ ["--carrier-color" as string]: "#2f8f8a" }}
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#edf7f5] text-[#377b79]">
                          <Icon size={15} />
                        </span>
                        <span>
                          <strong>{option.label}</strong>
                          <small>
                            <span data-live-value="true">{option.price}</span> ر.س
                          </small>
                        </span>
                        {active && <CheckCircle2 size={15} className="text-[#2f8f8a]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="carrier-step border-b border-[#e2efed] p-5 lg:border-b-0 lg:border-l">
                <span className="carrier-step-number">02</span>
                <h4 className="mt-3 text-[10px] font-bold text-slate-900">تسليم الشحنة للناقل</h4>
                <p className="mt-1 text-[7px] font-medium leading-5 text-slate-400">
                  رسوم الطريقة تختلف حسب نطاق الشحن المختار.
                </p>
                <div className="mt-4 space-y-2">
                  {([
                    {
                      value: "dropoff" as const,
                      label: "أسلّمها في الفرع",
                      icon: PackageOpen,
                      fee:
                        quote.scope === "domestic"
                          ? carrier.dropoffPrice
                          : carrier.internationalDropoffPrice,
                    },
                    {
                      value: "pickup" as const,
                      label: "استلام من موقعي",
                      icon: Truck,
                      fee:
                        quote.scope === "domestic"
                          ? carrier.pickupPrice
                          : carrier.internationalPickupPrice,
                    },
                  ]).map((option) => {
                    const Icon = option.icon;
                    const active = quote.mode === option.value;
                    return (
                      <button
                        key={`${quote.scope}-${option.value}`}
                        type="button"
                        onClick={() => chooseMode(option.value)}
                        className={`carrier-choice ${active ? "is-selected" : ""}`}
                        style={{ ["--carrier-color" as string]: "#2f8f8a" }}
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#edf7f5] text-[#377b79]">
                          <Icon size={15} />
                        </span>
                        <span>
                          <strong>{option.label}</strong>
                          <small>
                            +<span data-live-value="true">{option.fee}</span> ر.س
                          </small>
                        </span>
                        {active && <CheckCircle2 size={15} className="text-[#2f8f8a]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="carrier-step p-5">
                <span className="carrier-step-number">03</span>
                <h4 className="mt-3 text-[10px] font-bold text-slate-900">الإجمالي النهائي</h4>
                <p className="mt-1 text-[7px] font-medium leading-5 text-slate-400">
                  يتحدث فورًا مع كل اختيار بدون إعادة تحميل.
                </p>
                <div
                  key={`${quote.carrierId}-${quote.scope}-${quote.mode}`}
                  className="mt-4 rounded-[20px] border border-[#d7ebe7] bg-[#f2faf8] p-4"
                >
                  <div className="flex justify-between text-[8px] font-medium text-slate-500">
                    <span>{quote.scope === "domestic" ? "الشحن المحلي" : "الشحن الدولي"}</span>
                    <strong className="text-slate-800">
                      <span data-live-value="true">{activePricing.shippingPrice}</span> ر.س
                    </strong>
                  </div>
                  <div className="mt-3 flex justify-between text-[8px] font-medium text-slate-500">
                    <span>{quote.mode === "pickup" ? "الاستلام من الموقع" : "التسليم للفرع"}</span>
                    <strong className="text-slate-800">
                      <span data-live-value="true">{activePricing.handoverPrice}</span> ر.س
                    </strong>
                  </div>
                  <div className="mt-4 border-t border-[#d7e8e5] pt-4">
                    <p className="text-[7px] font-medium text-slate-400">الإجمالي المتوقع</p>
                    <p className="mt-1 text-[26px] font-bold text-[#247d7a]">
                      <span data-live-value="true">{activePricing.total}</span>{" "}
                      <span className="text-[8px] text-slate-500">ر.س</span>
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setConfirmed(true)}
                  className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#2f8f8a] text-[9px] font-bold text-white shadow-[0_10px_26px_rgba(47,143,138,.18)] transition hover:bg-[#287d79]"
                >
                  <ShieldCheck size={15} /> اعتماد الناقل
                </button>
                {confirmed && (
                  <p className="mt-3 flex items-center gap-2 text-[8px] font-bold text-emerald-700">
                    <CheckCircle2 size={14} /> تم حفظ الاختيار بسعر{" "}
                    <span data-live-value="true">{activePricing.total}</span> ر.س
                  </p>
                )}
              </div>
            </div>
          </Surface>

          <Surface className="overflow-hidden p-0">
            <div className="border-b border-[#dcece9] bg-[#f7fcfb] px-5 py-4">
              <h3 className="text-[11px] font-bold text-slate-900">مقارنة حسب اختيارك الحالي</h3>
              <p className="mt-1 text-[7px] font-medium text-slate-400">
                جميع الأسعار أدناه محسوبة على نطاق الشحن وطريقة التسليم المحددين.
              </p>
            </div>
            <div className="grid gap-3 p-4 md:grid-cols-3">
              {deliveryCompanies.map((item) => (
                <button
                  key={`${item.id}-${quote.scope}-${deliveryModes[item.id] ?? "pickup"}`}
                  type="button"
                  onClick={() => chooseCarrier(item.id)}
                  className="carrier-compare-tile rounded-[18px] border border-[#dfecea] bg-white/80 p-4 text-right transition hover:-translate-y-0.5 hover:border-[#b9ddd7]"
                >
                  <CarrierLogo carrierId={item.id} compact />
                  <div className="mt-4 flex items-end justify-between">
                    <span className="text-[7px] font-medium text-slate-400">{item.deliveryTime}</span>
                    <strong className="text-[15px] font-bold" style={{ color: palette[item.id].color }}>
                      <span data-live-value="true">{priceFor(item)}</span> ر.س
                    </strong>
                  </div>
                </button>
              ))}
            </div>
          </Surface>
        </div>
      </section>
    </>
  );
}

function WorkspaceHeader({
  eyebrow: _eyebrow,
  title,
  description: _description,
  icon: Icon,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  action?: ReactNode;
}) {
  return (
    <section className="workspace-header ertikaz-surface relative mb-5 overflow-hidden rounded-[24px] border border-[#cfe7e2] bg-[#f7fcfb] px-5 py-4 shadow-[0_14px_44px_rgba(47,108,106,0.08)] backdrop-blur-xl sm:px-6">
      <span className="absolute inset-y-0 right-0 w-1.5 bg-[#159487]" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#147f75] text-white shadow-lg shadow-[#147f75]/15">
            <Icon size={18} />
          </span>
          <h2 className="text-[20px] font-bold text-slate-950 sm:text-[24px]">{title}</h2>
        </div>
        {action}
      </div>
    </section>
  );
}

function MiniStat({
  label,
  value,
  icon: Icon,
  tone,
  note,
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  tone: string;
  note: string;
}) {
  return (
    <Surface className="group relative overflow-hidden p-4 transition hover:-translate-y-0.5">
      <div className="relative flex items-center gap-3">
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${tone}`}>
          <Icon size={17} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[8px] font-medium text-slate-400">{label}</p>
          <div className="mt-1 flex items-end justify-between gap-2">
            <p className="truncate text-[17px] font-bold text-slate-950">{value}</p>
          </div>
          <p className="mt-1 truncate text-[8px] font-medium text-slate-400">{note}</p>
        </div>
      </div>
    </Surface>
  );
}

function InvoicesWorkspace() {
  const [invoices, setInvoices] = useState<InvoiceRecord[]>(demoInvoices);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"الكل" | InvoiceRecord["status"]>("الكل");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCreateInvoice, setShowCreateInvoice] = useState(false);

  const selected = invoices.find((invoice) => invoice.id === selectedId) ?? null;
  const visibleInvoices = invoices.filter((invoice) => {
    const value = search.trim().toLowerCase();
    const searchMatches = !value || `${invoice.id} ${invoice.customer} ${invoice.title}`.toLowerCase().includes(value);
    const statusMatches = statusFilter === "الكل" || invoice.status === statusFilter;
    return searchMatches && statusMatches;
  });

  const total = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
  const collected = invoices.reduce((sum, invoice) => sum + invoice.paid, 0);
  const outstanding = total - collected;

  const deleteInvoice = (invoiceId: string) => {
    setInvoices((current) => current.filter((invoice) => invoice.id !== invoiceId));
    setSelectedId(null);
  };

  const registerPayment = (invoiceId: string) => {
    setInvoices((current) =>
      current.map((invoice) =>
        invoice.id === invoiceId
          ? { ...invoice, paid: invoice.amount, status: "مدفوعة" }
          : invoice,
      ),
    );
  };

  const createInvoice = (draft: InvoiceDraft) => {
    const amount = draft.lines.reduce(
      (sum, line) => sum + line.quantity * line.unitPrice,
      0,
    );
    const nextId = `INV-2026-${String(20 + invoices.length).padStart(3, "0")}`;
    const next: InvoiceRecord = {
      id: nextId,
      customer: draft.customer,
      customerType: draft.customerType,
      title: draft.lines[0]?.description || "فاتورة خدمات",
      amount,
      paid: 0,
      status: "مسودة",
      issueDate: draft.issueDate,
      dueDate: draft.dueDate,
      category: draft.category,
      notes: draft.notes,
    };
    setInvoices((current) => [next, ...current]);
    setShowCreateInvoice(false);
    setSelectedId(nextId);
  };

  return (
    <>
      <WorkspaceHeader
        eyebrow="ERTIKAZ INVOICE WORKSPACE"
        title="الفواتير"
        description="إدارة إصدار الفواتير والتحصيل من شاشة مرتبة وواضحة، مع نموذج إنشاء فاتورة كامل."
        icon={ReceiptText}
        action={
          <button
            type="button"
            onClick={() => setShowCreateInvoice(true)}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-slate-900 px-5 text-[9px] font-bold text-white shadow-lg"
          >
            <Plus size={15} />
            إنشاء فاتورة
          </button>
        }
      />

      <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MiniStat label="قيمة الفواتير" value={formatCurrency(total)} icon={ReceiptText} tone="bg-[#e6f1f8] text-[#2d75a3]" note="إجمالي الفواتير" />
        <MiniStat label="تم تحصيله" value={formatCurrency(collected)} icon={CheckCircle2} tone="bg-emerald-50 text-emerald-700" note="دفعات مؤكدة" />
        <MiniStat label="الرصيد المتبقي" value={formatCurrency(outstanding)} icon={WalletCards} tone="bg-amber-50 text-amber-700" note="قيد التحصيل" />
        <MiniStat label="الفواتير المفتوحة" value={String(invoices.filter((item) => item.status !== "مدفوعة").length)} icon={FileText} tone="bg-sky-50 text-sky-700" note="تحتاج إجراء" />
      </section>

      <Surface className="overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-slate-100 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h3 className="text-[13px] font-bold text-slate-900">سجل الفواتير</h3>
            <p className="mt-1 text-[8px] font-medium text-slate-400">راجعي الحالة والمبلغ والاستحقاق من قائمة واحدة.</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-wrap gap-2">
              {(["الكل", "مسودة", "جزئية", "متأخرة", "مدفوعة"] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-xl px-3 py-2 text-[8px] font-bold transition ${statusFilter === status ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500"}`}
                >
                  {status}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-64">
              <Search size={14} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="ابحث في الفواتير..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pr-10 pl-3 text-[9px] font-medium outline-none focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
              />
            </div>
          </div>
        </div>

        <div className="hidden grid-cols-[1.35fr_.65fr_.65fr_.7fr_.55fr_auto] gap-3 border-b border-slate-100 bg-slate-50 px-5 py-3 text-[7px] font-bold text-slate-400 md:grid">
          <span>العميل والفاتورة</span><span>الإجمالي</span><span>المحصل</span><span>الاستحقاق</span><span>الحالة</span><span />
        </div>

        <div className="divide-y divide-slate-100">
          {visibleInvoices.map((invoice) => {
            const progress = Math.round((invoice.paid / Math.max(invoice.amount, 1)) * 100);
            return (
              <button
                key={invoice.id}
                type="button"
                onClick={() => setSelectedId(invoice.id)}
                className="group grid w-full gap-3 px-5 py-4 text-right transition hover:bg-slate-50/80 md:grid-cols-[1.35fr_.65fr_.65fr_.7fr_.55fr_auto] md:items-center"
              >
                <div className="min-w-0"><p className="text-[8px] font-bold text-[#367fa9]">{invoice.id}</p><h3 className="mt-1 truncate text-[9px] font-bold text-slate-900">{invoice.customer}</h3><p className="mt-1 truncate text-[8px] font-medium text-slate-400">{invoice.title}</p></div>
                <div><p className="text-[7px] font-medium text-slate-400 md:hidden">الإجمالي</p><p className="mt-1 text-[9px] font-bold text-slate-800">{formatCurrency(invoice.amount)}</p></div>
                <div><p className="text-[7px] font-medium text-slate-400 md:hidden">المحصل</p><p className="mt-1 text-[9px] font-bold text-emerald-700">{formatCurrency(invoice.paid)}</p><div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#88B8AC]" style={{ width: `${progress}%` }} /></div></div>
                <div><p className="text-[7px] font-medium text-slate-400 md:hidden">الاستحقاق</p><p className="mt-1 text-[8px] font-bold text-slate-700">{invoice.dueDate}</p></div>
                <span className={`w-fit rounded-full px-3 py-1 text-[7px] font-bold ring-1 ${statusTone(invoice.status)}`}>{invoice.status}</span>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-400 transition group-hover:bg-slate-900 group-hover:text-white"><ArrowLeft size={12} /></span>
              </button>
            );
          })}
        </div>
      </Surface>

      {selected && (
        <DetailPanel title={selected.id} subtitle={selected.customer} icon={ReceiptText} onClose={() => setSelectedId(null)}>
          <div className="rounded-[22px] bg-[#f8fcfb] p-5">
            <p className="text-[8px] font-bold text-[#367fa9]">{selected.category}</p>
            <h3 className="mt-2 text-[14px] font-bold text-slate-900">{selected.title}</h3>
            <p className="mt-3 text-[23px] font-bold text-slate-950">{formatCurrency(selected.amount)}</p>
          </div>
          <InfoGrid items={[
            { label: "تاريخ الإصدار", value: selected.issueDate },
            { label: "تاريخ الاستحقاق", value: selected.dueDate },
            { label: "تم تحصيله", value: formatCurrency(selected.paid) },
            { label: "المتبقي", value: formatCurrency(selected.amount - selected.paid) },
          ]} />
          {selected.notes && <div className="mt-4 rounded-2xl bg-slate-50 p-4"><p className="text-[8px] font-medium text-slate-400">ملاحظات</p><p className="mt-2 text-[9px] font-medium leading-5 text-slate-700">{selected.notes}</p></div>}
          {selected.status !== "مدفوعة" && (
            <button type="button" onClick={() => registerPayment(selected.id)} className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-[9px] font-bold text-white shadow-lg shadow-emerald-200"><CheckCircle2 size={15} /> تسجيل السداد الكامل</button>
          )}
          <button type="button" onClick={() => { if (window.confirm("حذف هذه الفاتورة؟")) deleteInvoice(selected.id); }} className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 text-[9px] font-bold text-red-600"><Trash2 size={14} /> حذف الفاتورة</button>
        </DetailPanel>
      )}

      {showCreateInvoice && (
        <InvoiceCreateModal
          onClose={() => setShowCreateInvoice(false)}
          onSave={createInvoice}
        />
      )}
    </>
  );
}

function PaymentsWorkspace() {
  const [payments, setPayments] = useState<PaymentRecord[]>(demoPayments);
  const [method, setMethod] = useState<"الكل" | PaymentRecord["method"]>("الكل");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Omit<PaymentRecord, "id">>({ customer: "", invoice: "", amount: 0, method: "تحويل بنكي", status: "قيد المراجعة", date: "", reference: "" });

  useEffect(() => {
    const saved = window.localStorage.getItem("ertikaz-payments-v10");
    if (saved) { try { setPayments(JSON.parse(saved)); } catch { /* keep demo data */ } }
  }, []);
  useEffect(() => { window.localStorage.setItem("ertikaz-payments-v10", JSON.stringify(payments)); }, [payments]);

  const selected = payments.find((payment) => payment.id === selectedId) ?? null;
  const visible = payments.filter((payment) => method === "الكل" || payment.method === method);
  const total = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const confirmed = payments.filter((payment) => payment.status === "مؤكد").reduce((sum, payment) => sum + payment.amount, 0);
  const pendingPayments = payments.filter((payment) => payment.status === "قيد المراجعة");

  const openNew = () => { setEditingId(null); setDraft({ customer: "", invoice: "", amount: 0, method: "تحويل بنكي", status: "قيد المراجعة", date: "", reference: "" }); setFormOpen(true); };
  const openEdit = (payment: PaymentRecord) => { const { id, ...rest } = payment; setEditingId(id); setDraft(rest); setFormOpen(true); };
  const savePayment = () => {
    if (!draft.customer.trim() || !draft.invoice.trim() || draft.amount <= 0) return;
    if (editingId) setPayments((current) => current.map((item) => item.id === editingId ? { id: editingId, ...draft } : item));
    else setPayments((current) => [{ id: `PAY-${Date.now().toString().slice(-6)}`, ...draft }, ...current]);
    setFormOpen(false);
  };
  const deletePayment = (paymentId: string) => { setPayments((current) => current.filter((payment) => payment.id !== paymentId)); setSelectedId(null); };
  const approvePayment = (paymentId: string) => setPayments((current) => current.map((payment) => payment.id === paymentId ? { ...payment, status: "مؤكد" } : payment));

  return (
    <>
      <WorkspaceHeader eyebrow="PAYMENT OPERATIONS" title="المدفوعات" description="إضافة الدفعات ومراجعتها وتعديلها وربطها بالفواتير." icon={WalletCards} action={<button type="button" onClick={openNew} className="workspace-primary-button"><Plus size={14} /> إضافة دفعة</button>} />
      <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MiniStat label="إجمالي المدفوعات" value={formatCurrency(total)} icon={WalletCards} tone="bg-sky-50 text-sky-700" note="كل العمليات" />
        <MiniStat label="دفعات مؤكدة" value={formatCurrency(confirmed)} icon={CheckCircle2} tone="bg-emerald-50 text-emerald-700" note="تم اعتمادها" />
        <MiniStat label="قيد المراجعة" value={String(pendingPayments.length)} icon={ScanLine} tone="bg-amber-50 text-amber-700" note="تحتاج اعتماد" />
        <MiniStat label="طرق الدفع" value={String(new Set(payments.map((item) => item.method)).size)} icon={CreditCard} tone="bg-blue-50 text-blue-700" note="قنوات مستخدمة" />
      </section>

      <Surface className="overflow-hidden p-0">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div><h3 className="text-[12px] font-bold text-slate-900">سجل المدفوعات</h3><p className="mt-1 text-[7px] font-medium text-slate-400">يمكنك الإضافة والتعديل والاعتماد والحذف.</p></div>
          <div className="flex flex-wrap gap-2">{(["الكل", "تحويل بنكي", "مدى", "بطاقة ائتمانية", "نقدي"] as const).map((item) => <button key={item} type="button" onClick={() => setMethod(item)} className={`workspace-filter ${method === item ? "is-active" : ""}`}>{item}</button>)}</div>
        </div>
        <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((payment) => (
            <article key={payment.id} className="record-card record-card-payment">
              <div className="flex items-start justify-between gap-3"><span className="record-icon"><WalletCards size={17} /></span><span className={`rounded-full px-3 py-1 text-[7px] font-bold ring-1 ${statusTone(payment.status)}`}>{payment.status}</span></div>
              <p className="mt-4 text-[8px] font-bold text-emerald-700">{payment.id}</p>
              <h3 className="mt-1 text-[10px] font-bold text-slate-900">{payment.customer}</h3>
              <p className="mt-3 text-[20px] font-bold text-slate-950">{formatCurrency(payment.amount)}</p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-[7px] font-medium text-slate-500"><span className="record-meta">{payment.method}</span><span className="record-meta">{payment.invoice}</span></div>
              <div className="mt-4 flex gap-2"><button type="button" onClick={() => setSelectedId(payment.id)} className="record-action flex-1"><Eye size={13} /> عرض</button><button type="button" onClick={() => openEdit(payment)} className="record-action"><SlidersHorizontal size={13} /></button><button type="button" onClick={() => { if (window.confirm("حذف هذه الدفعة؟")) deletePayment(payment.id); }} className="record-action record-action-danger"><Trash2 size={13} /></button></div>
            </article>
          ))}
        </div>
      </Surface>

      {selected && <DetailPanel title={selected.id} subtitle={selected.customer} icon={WalletCards} onClose={() => setSelectedId(null)}><div className="rounded-[20px] bg-emerald-50 p-5"><p className="text-[8px] font-bold text-emerald-700">{selected.invoice}</p><p className="mt-2 text-[23px] font-bold text-slate-950">{formatCurrency(selected.amount)}</p></div><InfoGrid items={[{ label: "المرجع", value: selected.reference }, { label: "التاريخ", value: selected.date }, { label: "الطريقة", value: selected.method }, { label: "الحالة", value: selected.status }]} /><div className="mt-4 grid grid-cols-2 gap-2"><button type="button" onClick={() => openEdit(selected)} className="workspace-secondary-button"><SlidersHorizontal size={14} /> تعديل</button>{selected.status === "قيد المراجعة" && <button type="button" onClick={() => approvePayment(selected.id)} className="workspace-primary-button"><CheckCircle2 size={14} /> اعتماد</button>}</div></DetailPanel>}

      {formOpen && <div className="workspace-modal"><div className="workspace-modal-card"><div className="flex items-center justify-between"><div><p className="text-[8px] font-medium text-emerald-700">المدفوعات</p><h3 className="mt-1 text-[15px] font-bold text-slate-900">{editingId ? "تعديل الدفعة" : "إضافة دفعة جديدة"}</h3></div><button type="button" onClick={() => setFormOpen(false)} className="modal-close"><X size={16} /></button></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><input className="workspace-input" placeholder="اسم العميل" value={draft.customer} onChange={(e) => setDraft({ ...draft, customer: e.target.value })} /><input className="workspace-input" placeholder="رقم الفاتورة" value={draft.invoice} onChange={(e) => setDraft({ ...draft, invoice: e.target.value })} /><input className="workspace-input" type="number" placeholder="المبلغ" value={draft.amount || ""} onChange={(e) => setDraft({ ...draft, amount: Number(e.target.value) })} /><input className="workspace-input" placeholder="المرجع" value={draft.reference} onChange={(e) => setDraft({ ...draft, reference: e.target.value })} /><input className="workspace-input" placeholder="التاريخ" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} /><select className="workspace-input" value={draft.method} onChange={(e) => setDraft({ ...draft, method: e.target.value as PaymentRecord["method"] })}><option>تحويل بنكي</option><option>مدى</option><option>بطاقة ائتمانية</option><option>نقدي</option></select><select className="workspace-input sm:col-span-2" value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as PaymentRecord["status"] })}><option>مؤكد</option><option>قيد المراجعة</option><option>مرفوض</option></select></div><button type="button" onClick={savePayment} className="workspace-primary-button mt-5 w-full">{editingId ? "حفظ التعديلات" : "إضافة الدفعة"}</button></div></div>}
    </>
  );
}


function ShipmentsWorkspace() {
  const [shipments, setShipments] = useState<ShipmentRecord[]>(demoShipments);
  const [statusFilter, setStatusFilter] = useState<"الكل" | ShipmentRecord["status"]>("الكل");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Omit<ShipmentRecord, "id">>({ customer: "", carrier: "أرامكس", route: "", status: "قيد التجهيز", progress: 12, tracking: "", eta: "", pieces: 1, mode: "استلام من الموقع" });
  useEffect(() => {
    const saved = window.localStorage.getItem("ertikaz-shipments-v10");
    if (saved) { try { setShipments(JSON.parse(saved)); } catch { /* keep demo data */ } }
  }, []);
  useEffect(() => { window.localStorage.setItem("ertikaz-shipments-v10", JSON.stringify(shipments)); }, [shipments]);
  const stages: ShipmentRecord["status"][] = ["قيد التجهيز", "تم الاستلام", "في الطريق", "تم التسليم"];
  const visible = shipments.filter((shipment) => statusFilter === "الكل" || shipment.status === statusFilter);
  const active = shipments.filter((shipment) => shipment.status !== "تم التسليم").length;
  const delivered = shipments.filter((shipment) => shipment.status === "تم التسليم").length;

  const openNew = () => { setEditingId(null); setDraft({ customer: "", carrier: "أرامكس", route: "", status: "قيد التجهيز", progress: 12, tracking: "", eta: "", pieces: 1, mode: "استلام من الموقع" }); setFormOpen(true); };
  const openEdit = (shipment: ShipmentRecord) => { const { id, ...rest } = shipment; setEditingId(id); setDraft(rest); setFormOpen(true); };
  const saveShipment = () => {
    if (!draft.customer.trim() || !draft.route.trim() || !draft.tracking.trim()) return;
    const progressMap: Record<ShipmentRecord["status"], number> = { "قيد التجهيز": 12, "تم الاستلام": 35, "في الطريق": 72, "تم التسليم": 100 };
    const record = { ...draft, progress: progressMap[draft.status] };
    if (editingId) setShipments((current) => current.map((item) => item.id === editingId ? { id: editingId, ...record } : item));
    else setShipments((current) => [{ id: `SHP-${Date.now().toString().slice(-6)}`, ...record }, ...current]);
    setFormOpen(false);
  };
  const deleteShipment = (id: string) => setShipments((current) => current.filter((item) => item.id !== id));
  const advanceShipment = (id: string) => setShipments((current) => current.map((shipment) => { if (shipment.id !== id) return shipment; const index = stages.indexOf(shipment.status); if (index >= stages.length - 1) return shipment; const status = stages[index + 1]; return { ...shipment, status, progress: status === "تم الاستلام" ? 35 : status === "في الطريق" ? 72 : 100 }; }));

  return (
    <>
      <WorkspaceHeader eyebrow="SHIPMENT OPERATIONS" title="الشحنات" description="إنشاء الشحنات وتعديل بيانات التتبع وتحديث مراحل التوصيل." icon={PackageCheck} action={<button type="button" onClick={openNew} className="workspace-primary-button"><Plus size={14} /> إضافة شحنة</button>} />
      <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><MiniStat label="إجمالي الشحنات" value={String(shipments.length)} icon={PackageOpen} tone="bg-blue-50 text-blue-700" note="كل السجلات" /><MiniStat label="شحنات نشطة" value={String(active)} icon={Truck} tone="bg-orange-50 text-orange-700" note="قيد التنفيذ" /><MiniStat label="تم التسليم" value={String(delivered)} icon={PackageCheck} tone="bg-emerald-50 text-emerald-700" note="مكتملة" /><MiniStat label="شركات مستخدمة" value={String(new Set(shipments.map((item) => item.carrier)).size)} icon={Route} tone="bg-sky-50 text-sky-700" note="ناقلون نشطون" /></section>
      <Surface className="mb-5 p-4"><div className="flex flex-wrap gap-2">{(["الكل", ...stages] as const).map((item) => <button key={item} type="button" onClick={() => setStatusFilter(item)} className={`workspace-filter ${statusFilter === item ? "is-active" : ""}`}>{item}</button>)}</div></Surface>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((shipment) => (
          <article key={shipment.id} className="record-card record-card-shipment">
            <div className="flex items-start justify-between gap-3"><span className="record-icon"><Truck size={17} /></span><span className={`rounded-full px-3 py-1 text-[7px] font-bold ring-1 ${statusTone(shipment.status)}`}>{shipment.status}</span></div>
            <p className="mt-4 text-[8px] font-bold text-orange-700">{shipment.id}</p><h3 className="mt-1 text-[10px] font-bold text-slate-900">{shipment.customer}</h3><p className="mt-2 text-[8px] font-medium text-slate-500">{shipment.carrier} · {shipment.route}</p>
            <div className="mt-4"><div className="mb-2 flex justify-between text-[7px] font-medium text-slate-400"><span>{shipment.tracking}</span><span>{shipment.progress}%</span></div><div className="h-2 overflow-hidden rounded-full bg-orange-50"><div className="h-full rounded-full bg-orange-400" style={{ width: `${shipment.progress}%` }} /></div></div>
            <div className="mt-4 grid grid-cols-2 gap-2"><span className="record-meta">{shipment.pieces} قطع</span><span className="record-meta">{shipment.eta}</span></div>
            <div className="mt-4 grid grid-cols-3 gap-2"><button type="button" onClick={() => advanceShipment(shipment.id)} disabled={shipment.status === "تم التسليم"} className="record-action disabled:opacity-40"><ArrowLeft size={13} /> تحديث</button><button type="button" onClick={() => openEdit(shipment)} className="record-action"><SlidersHorizontal size={13} /> تعديل</button><button type="button" onClick={() => { if (window.confirm("حذف هذه الشحنة؟")) deleteShipment(shipment.id); }} className="record-action record-action-danger"><Trash2 size={13} /></button></div>
          </article>
        ))}
      </section>
      {formOpen && <div className="workspace-modal"><div className="workspace-modal-card"><div className="flex items-center justify-between"><div><p className="text-[8px] font-medium text-orange-700">الشحنات</p><h3 className="mt-1 text-[15px] font-bold text-slate-900">{editingId ? "تعديل الشحنة" : "إضافة شحنة جديدة"}</h3></div><button type="button" onClick={() => setFormOpen(false)} className="modal-close"><X size={16} /></button></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><input className="workspace-input" placeholder="اسم العميل" value={draft.customer} onChange={(e) => setDraft({ ...draft, customer: e.target.value })} /><select className="workspace-input" value={draft.carrier} onChange={(e) => setDraft({ ...draft, carrier: e.target.value })}><option>أرامكس</option><option>سمسا</option><option>سبل</option></select><input className="workspace-input" placeholder="المسار: الرياض ← جدة" value={draft.route} onChange={(e) => setDraft({ ...draft, route: e.target.value })} /><input className="workspace-input" placeholder="رقم التتبع" value={draft.tracking} onChange={(e) => setDraft({ ...draft, tracking: e.target.value })} /><input className="workspace-input" placeholder="موعد الوصول" value={draft.eta} onChange={(e) => setDraft({ ...draft, eta: e.target.value })} /><input className="workspace-input" type="number" min="1" placeholder="عدد القطع" value={draft.pieces} onChange={(e) => setDraft({ ...draft, pieces: Number(e.target.value) })} /><select className="workspace-input" value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as ShipmentRecord["status"] })}>{stages.map((item) => <option key={item}>{item}</option>)}</select><select className="workspace-input" value={draft.mode} onChange={(e) => setDraft({ ...draft, mode: e.target.value as ShipmentRecord["mode"] })}><option>استلام من الموقع</option><option>تسليم للفرع</option></select></div><button type="button" onClick={saveShipment} className="workspace-primary-button mt-5 w-full">{editingId ? "حفظ التعديلات" : "إضافة الشحنة"}</button></div></div>}
    </>
  );
}


function InventoryWorkspace() {
  const [items, setItems] = useState<InventoryRecord[]>(demoInventory);
  const [category, setCategory] = useState("الكل");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Omit<InventoryRecord, "id">>({ name: "", category: "أجهزة", sku: "", stock: 0, minimum: 5, maximum: 50, warehouse: "المستودع الرئيسي", unitValue: 0, movement: 0 });
  useEffect(() => {
    const saved = window.localStorage.getItem("ertikaz-inventory-v10");
    if (saved) { try { setItems(JSON.parse(saved)); } catch { /* keep demo data */ } }
  }, []);
  useEffect(() => { window.localStorage.setItem("ertikaz-inventory-v10", JSON.stringify(items)); }, [items]);
  const categories = ["الكل", ...Array.from(new Set(items.map((item) => item.category)))];
  const visible = items.filter((item) => category === "الكل" || item.category === category);
  const totalValue = items.reduce((sum, item) => sum + item.stock * item.unitValue, 0);
  const lowItems = items.filter((item) => item.stock <= item.minimum);

  const openNew = () => { setEditingId(null); setDraft({ name: "", category: "أجهزة", sku: "", stock: 0, minimum: 5, maximum: 50, warehouse: "المستودع الرئيسي", unitValue: 0, movement: 0 }); setFormOpen(true); };
  const openEdit = (item: InventoryRecord) => { const { id, ...rest } = item; setEditingId(id); setDraft(rest); setFormOpen(true); };
  const saveItem = () => { if (!draft.name.trim() || !draft.sku.trim()) return; if (editingId) setItems((current) => current.map((item) => item.id === editingId ? { id: editingId, ...draft } : item)); else setItems((current) => [{ id: `STK-${Date.now().toString().slice(-5)}`, ...draft }, ...current]); setFormOpen(false); };
  const deleteItem = (id: string) => setItems((current) => current.filter((item) => item.id !== id));
  const restock = (id: string) => setItems((current) => current.map((item) => item.id === id ? { ...item, stock: Math.min(item.maximum, item.stock + Math.max(item.minimum, 10)), movement: Math.abs(item.movement) + 5 } : item));

  return (
    <>
      <WorkspaceHeader eyebrow="INVENTORY CONTROL" title="المخزون" description="إضافة الأصناف وتعديل الكميات والحدود وإدارة التوريد." icon={Warehouse} action={<button type="button" onClick={openNew} className="workspace-primary-button"><Plus size={14} /> إضافة صنف</button>} />
      <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><MiniStat label="قيمة المخزون" value={formatCurrency(totalValue)} icon={CircleDollarSign} tone="bg-sky-50 text-sky-700" note="القيمة الحالية" /><MiniStat label="إجمالي الأصناف" value={String(items.length)} icon={Boxes} tone="bg-blue-50 text-blue-700" note="كل المستودعات" /><MiniStat label="تحتاج توريد" value={String(lowItems.length)} icon={ShieldAlert} tone="bg-amber-50 text-amber-700" note="أقل من الحد الأدنى" /><MiniStat label="مستودعات نشطة" value={String(new Set(items.map((item) => item.warehouse)).size)} icon={Warehouse} tone="bg-emerald-50 text-emerald-700" note="مواقع التخزين" /></section>
      <Surface className="mb-5 p-4"><div className="flex flex-wrap gap-2">{categories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`workspace-filter ${category === item ? "is-active" : ""}`}>{item}</button>)}</div></Surface>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((item) => { const ratio = Math.min(100, Math.round((item.stock / Math.max(item.maximum, 1)) * 100)); const low = item.stock <= item.minimum; return (
          <article key={item.id} className="record-card record-card-inventory">
            <div className="flex items-start justify-between gap-3"><span className="record-icon"><Boxes size={17} /></span><span className={`rounded-full px-3 py-1 text-[7px] font-bold ${low ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}>{low ? "يحتاج توريد" : "متوفر"}</span></div>
            <p className="mt-4 text-[8px] font-bold text-lime-700">{item.sku}</p><h3 className="mt-1 text-[10px] font-bold text-slate-900">{item.name}</h3><p className="mt-2 text-[8px] font-medium text-slate-500">{item.category} · {item.warehouse}</p>
            <div className="mt-4"><div className="mb-2 flex justify-between text-[7px] font-medium text-slate-400"><span>المتاح {item.stock}</span><span>الحد الأقصى {item.maximum}</span></div><div className="h-2 overflow-hidden rounded-full bg-lime-50"><div className={`h-full rounded-full ${low ? "bg-amber-400" : "bg-lime-500"}`} style={{ width: `${ratio}%` }} /></div></div>
            <div className="mt-4 grid grid-cols-2 gap-2"><span className="record-meta">الحد الأدنى {item.minimum}</span><span className="record-meta">{formatCurrency(item.unitValue)}</span></div>
            <div className="mt-4 grid grid-cols-3 gap-2"><button type="button" onClick={() => restock(item.id)} className="record-action"><Plus size={13} /> توريد</button><button type="button" onClick={() => openEdit(item)} className="record-action"><SlidersHorizontal size={13} /> تعديل</button><button type="button" onClick={() => { if (window.confirm("حذف هذا الصنف؟")) deleteItem(item.id); }} className="record-action record-action-danger"><Trash2 size={13} /></button></div>
          </article>
        ); })}
      </section>
      {formOpen && <div className="workspace-modal"><div className="workspace-modal-card"><div className="flex items-center justify-between"><div><p className="text-[8px] font-medium text-lime-700">المخزون</p><h3 className="mt-1 text-[15px] font-bold text-slate-900">{editingId ? "تعديل الصنف" : "إضافة صنف جديد"}</h3></div><button type="button" onClick={() => setFormOpen(false)} className="modal-close"><X size={16} /></button></div><div className="mt-5 grid gap-3 sm:grid-cols-2"><input className="workspace-input" placeholder="اسم الصنف" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /><input className="workspace-input" placeholder="SKU" value={draft.sku} onChange={(e) => setDraft({ ...draft, sku: e.target.value })} /><input className="workspace-input" placeholder="التصنيف" value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} /><input className="workspace-input" placeholder="المستودع" value={draft.warehouse} onChange={(e) => setDraft({ ...draft, warehouse: e.target.value })} /><input className="workspace-input" type="number" placeholder="الكمية" value={draft.stock} onChange={(e) => setDraft({ ...draft, stock: Number(e.target.value) })} /><input className="workspace-input" type="number" placeholder="الحد الأدنى" value={draft.minimum} onChange={(e) => setDraft({ ...draft, minimum: Number(e.target.value) })} /><input className="workspace-input" type="number" placeholder="الحد الأقصى" value={draft.maximum} onChange={(e) => setDraft({ ...draft, maximum: Number(e.target.value) })} /><input className="workspace-input" type="number" placeholder="قيمة الوحدة" value={draft.unitValue} onChange={(e) => setDraft({ ...draft, unitValue: Number(e.target.value) })} /></div><button type="button" onClick={saveItem} className="workspace-primary-button mt-5 w-full">{editingId ? "حفظ التعديلات" : "إضافة الصنف"}</button></div></div>}
    </>
  );
}


function ReportsWorkspace() {
  const [reportType, setReportType] = useState<"الكل" | ReportRecord["type"]>("الكل");
  const [selectedId, setSelectedId] = useState<string | null>(demoReports[0]?.id ?? null);
  const selected = demoReports.find((report) => report.id === selectedId) ?? null;
  const visible = demoReports.filter((report) => reportType === "الكل" || report.type === reportType);
  const ready = demoReports.filter((report) => report.status === "جاهز").length;

  const downloadReport = (report: ReportRecord) => {
    const content = [`إرتكاز - ${report.title}`, report.description, `الفترة: ${report.period}`, `آخر تحديث: ${report.updatedAt}`, `الحالة: ${report.status}`].join("\n");
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${report.id}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <WorkspaceHeader eyebrow="ERTIKAZ EXECUTIVE REPORT LIBRARY" title="مكتبة التقارير التنفيذية" description="تقارير منظمة حسب المجال مع ملخص تنفيذي، حالة التحديث، وصيغة التصدير." icon={BarChart3} action={<span className="inline-flex items-center gap-2 rounded-xl border border-white/70 bg-white/55 px-4 py-3 text-[9px] font-black text-slate-700 shadow-sm"><FileSpreadsheet size={14} /> {ready} تقارير جاهزة</span>} />
      <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><MiniStat label="إجمالي التقارير" value={String(demoReports.length)} icon={BarChart3} tone="bg-sky-50 text-sky-700" note="مكتبة الأداء الحالية" /><MiniStat label="تقارير جاهزة" value={String(ready)} icon={CheckCircle2} tone="bg-emerald-50 text-emerald-700" note="متاحة للعرض والتحميل" /><MiniStat label="قيد الإنشاء" value={String(demoReports.filter((report) => report.status === "قيد الإنشاء").length)} icon={Loader2} tone="bg-[#e6f1f8] text-[#2d75a3]" note="يتم تحديثها الآن" /><MiniStat label="تقارير مجدولة" value={String(demoReports.filter((report) => report.status === "مجدول").length)} icon={CalendarClock} tone="bg-amber-50 text-amber-700" note="تُنشأ تلقائيًا" /></section>
      <Surface className="mb-5 p-4"><div className="flex flex-wrap gap-2">{(["الكل", "مالي", "عملاء", "تشغيلي", "مخزون"] as const).map((item) => <button key={item} type="button" onClick={() => setReportType(item)} className={`rounded-xl px-4 py-2 text-[9px] font-black transition ${reportType === item ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500"}`}>{item}</button>)}</div></Surface>

      <section className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4">{visible.map((report, index) => { const icons = [CircleDollarSign, Users, Truck, Warehouse, ClipboardList]; const ReportIcon = icons[index % icons.length]; const tones = ["bg-[#147f75]", "bg-[#236c83]", "bg-[#d4a33b]", "bg-[#2f8f83]", "bg-[#df7652]"]; return <button key={report.id} type="button" onClick={() => setSelectedId(report.id)} className={`group w-full overflow-hidden rounded-[24px] border p-4 text-right transition ${selectedId === report.id ? "border-sky-300 bg-white shadow-[0_18px_50px_rgba(105,135,190,.13)] ring-4 ring-sky-100/70" : "border-white/85 bg-white/86 shadow-sm hover:-translate-y-0.5"}`}><div className="flex items-start gap-4"><span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${tones[index]} text-white shadow-lg`}><ReportIcon size={19} /></span><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><div><p className="text-[8px] font-bold text-sky-600">{report.id} · {report.type}</p><h3 className="mt-1 text-[11px] font-black text-slate-900">{report.title}</h3></div><span className={`rounded-full px-3 py-1 text-[7px] font-black ring-1 ${statusTone(report.status)}`}>{report.status}</span></div><p className="mt-2 text-[8px] font-semibold leading-5 text-slate-500">{report.description}</p><div className="mt-3 flex items-center justify-between text-[7px] font-bold text-slate-400"><span>{report.period}</span><span>{report.format}</span><span>{report.updatedAt}</span></div></div><ArrowLeft size={12} className="mt-1 shrink-0 text-slate-300 transition group-hover:-translate-x-1" /></div></button>; })}</div>

        <div className="space-y-5">
          <Surface className="overflow-hidden">{selected ? <><div className="bg-[#f8fcfb] p-5"><div className="flex items-start justify-between gap-4"><div><p className="text-[8px] font-black text-sky-600">{selected.id} · {selected.type}</p><h3 className="mt-2 text-[18px] font-black text-slate-950">{selected.title}</h3><p className="mt-2 text-[9px] font-semibold leading-5 text-slate-600">{selected.description}</p></div><span className="rounded-2xl bg-white/70 px-3 py-2 text-[8px] font-black text-slate-600">{selected.format}</span></div></div><div className="p-5"><div className="grid grid-cols-3 gap-3">{[{ label: "النمو", value: "+18.6%", color: "bg-emerald-50 text-emerald-700" }, { label: "الانحراف", value: "4.2%", color: "bg-amber-50 text-amber-700" }, { label: "الثقة", value: "92%", color: "bg-[#e6f1f8] text-[#2d75a3]" }].map((item) => <div key={item.label} className={`rounded-2xl p-4 text-center ${item.color}`}><p className="text-[17px] font-black">{item.value}</p><p className="mt-1 text-[7px] font-bold opacity-65">{item.label}</p></div>)}</div><div className="mt-5 rounded-[22px] border border-slate-100 bg-slate-50 p-4"><p className="text-[8px] font-bold text-slate-400">الملخص التنفيذي</p><p className="mt-2 text-[10px] font-semibold leading-6 text-slate-700">{selected.description} توضح القراءة أن المؤشرات الأساسية مستقرة، مع وجود نقاط محددة تحتاج متابعة إدارية.</p></div><div className="mt-4 grid grid-cols-2 gap-3"><div className="rounded-2xl border border-slate-100 p-4"><p className="text-[7px] font-bold text-slate-400">الفترة</p><p className="mt-1 text-[9px] font-black text-slate-800">{selected.period}</p></div><div className="rounded-2xl border border-slate-100 p-4"><p className="text-[7px] font-bold text-slate-400">آخر تحديث</p><p className="mt-1 text-[9px] font-black text-slate-800">{selected.updatedAt}</p></div></div><button type="button" onClick={() => downloadReport(selected)} disabled={selected.status !== "جاهز"} className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 text-[9px] font-black text-white disabled:opacity-40"><Download size={14} /> تحميل التقرير</button></div></> : <div className="p-10 text-center"><BarChart3 size={28} className="mx-auto text-slate-300" /><p className="mt-4 text-[9px] font-semibold text-slate-400">اختاري تقريرًا لعرض الملخص</p></div>}</Surface>
          <div className="rounded-[26px] bg-slate-900 p-5 text-white shadow-lg"><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10"><Sparkles size={18} /></span><div><p className="text-[8px] font-bold text-white/55">تقرير الإدارة</p><h3 className="mt-1 text-[11px] font-black">اجمعي أهم المؤشرات في ملخص أسبوعي واحد</h3></div></div></div>
        </div>
      </section>
    </>
  );
}

function AIWorkspace({ language }: { language: Language }) {
  const [applied, setApplied] = useState<string[]>([]);
  const [category, setCategory] = useState<"الكل" | InsightRecord["category"]>("الكل");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<AiAnswer>({
    title: "ملخص العمليات اليوم",
    summary: "توجد أولوية واضحة في التحصيل والمخزون. البدء بالفاتورة المتأخرة والصنف الأقل من الحد الأدنى يعطي أثرًا أسرع.",
    evidence: [
      "فاتورة مؤسسة رواد الأعمال متأخرة بقيمة 18,500 ر.س",
      "أجهزة الشبكات قريبة من الحد الحرج",
      "هناك دفعة واحدة بانتظار الاعتماد",
    ],
    actions: [
      "إرسال تذكير تحصيل مخصص",
      "إنشاء طلب توريد لأجهزة الشبكات",
      "اعتماد الدفعة المعلقة بعد مراجعة المرجع",
    ],
    confidence: 89,
  });
  const [thinking, setThinking] = useState(false);

  const visible = demoInsights.filter((insight) => category === "الكل" || insight.category === category);

  const buildAnswer = (prompt: string): AiAnswer => {
    const normalized = prompt.trim().toLowerCase();
    const english = language === "en";

    if (/فاتور|تحصيل|مدفوع|invoice|collection|payment/.test(normalized)) {
      const overdue = demoInvoices.filter((item) => item.status === "متأخرة");
      const openAmount = demoInvoices.reduce(
        (sum, item) => sum + (item.amount - item.paid),
        0,
      );
      return english
        ? {
            title: "Collection priority",
            summary: `The current open balance is ${formatCurrency(openAmount)}. Start with overdue invoices, then the highest-value partially paid invoices.`,
            evidence:
              overdue.length > 0
                ? overdue.map(
                    (item) =>
                      `${item.customer}: ${formatCurrency(item.amount - item.paid)}`,
                  )
                : ["There are no overdue invoices right now."],
            actions: [
              "Send a personalized reminder to the customer with the highest balance",
              "Schedule a follow-up within 24 hours",
              "Update the invoice status after contact",
            ],
            confidence: 92,
          }
        : {
            title: "أولوية التحصيل",
            summary: `الرصيد المفتوح الحالي ${formatCurrency(openAmount)}. أفضل بداية هي الفواتير المتأخرة ثم الجزئية ذات القيمة الأعلى.`,
            evidence:
              overdue.length > 0
                ? overdue.map(
                    (item) =>
                      `${item.customer}: ${formatCurrency(item.amount - item.paid)}`,
                  )
                : ["لا توجد فواتير متأخرة حاليًا"],
            actions: [
              "إرسال تذكير مخصص للعميل الأعلى رصيدًا",
              "تحديد موعد متابعة خلال 24 ساعة",
              "تحديث حالة الفاتورة بعد التواصل",
            ],
            confidence: 92,
          };
    }

    if (/مخزون|توريد|صنف|inventory|stock|restock/.test(normalized)) {
      const low = demoInventory.filter((item) => item.stock <= item.minimum);
      return english
        ? {
            title: "Inventory decision",
            summary:
              low.length > 0
                ? `${low.length} items are below their minimum level and should be replenished before orders are affected.`
                : "Current inventory levels are within the safe range.",
            evidence:
              low.length > 0
                ? low.map(
                    (item) =>
                      `${item.name}: available ${item.stock}, minimum ${item.minimum}`,
                  )
                : ["There are no critical inventory items."],
            actions: [
              "Create one consolidated purchase order",
              "Review orders linked to these items",
              "Confirm the supplier delivery date",
            ],
            confidence: 90,
          }
        : {
            title: "قرار المخزون",
            summary:
              low.length > 0
                ? `يوجد ${low.length} صنف أقل من الحد الأدنى ويحتاج توريدًا قبل تأثر الطلبات.`
                : "المخزون الحالي ضمن الحدود الآمنة.",
            evidence:
              low.length > 0
                ? low.map(
                    (item) =>
                      `${item.name}: المتاح ${item.stock} والحد الأدنى ${item.minimum}`,
                  )
                : ["لا توجد أصناف حرجة"],
            actions: [
              "إنشاء طلب توريد موحد",
              "مراجعة الطلبات المرتبطة بالأصناف",
              "تأكيد موعد المورد",
            ],
            confidence: 90,
          };
    }

    if (/شحن|ناقل|توصيل|shipping|shipment|carrier|delivery/.test(normalized)) {
      const active = demoShipments.filter(
        (item) => item.status !== "تم التسليم",
      );
      return english
        ? {
            title: "Shipping summary",
            summary: `${active.length} shipments are active. In-transit shipments should be checked against their ETA before updating customers.`,
            evidence: active
              .slice(0, 3)
              .map(
                (item) =>
                  `${item.customer} · ${item.carrier} · ${item.status}`,
              ),
            actions: [
              "Review shipments close to their ETA",
              "Confirm the latest carrier status",
              "Send an update to the customer",
            ],
            confidence: 86,
          }
        : {
            title: "ملخص الشحن",
            summary: `يوجد ${active.length} شحنات نشطة. الشحنات في الطريق تحتاج متابعة موعد الوصول قبل التواصل مع العميل.`,
            evidence: active
              .slice(0, 3)
              .map(
                (item) =>
                  `${item.customer} · ${item.carrier} · ${item.status}`,
              ),
            actions: [
              "مراجعة الشحنات القريبة من موعد الوصول",
              "تأكيد حالة الناقل",
              "إرسال تحديث للعميل",
            ],
            confidence: 86,
          };
    }

    if (/عميل|عملاء|مبيعات|فرصة|customer|client|sales|opportunity/.test(normalized)) {
      const top = [...demoCustomers].sort(
        (a, b) => b.totalSpent - a.totalSpent,
      )[0];
      return english
        ? {
            title: "Highest-value customer opportunity",
            summary: `${top.name} currently has the highest relationship value. Combine financial follow-up with a relevant additional service offer.`,
            evidence: [
              `Total relationship value: ${formatCurrency(top.totalSpent)}`,
              `Order count: ${top.totalOrders}`,
              `Open balance: ${formatCurrency(top.outstanding)}`,
            ],
            actions: [
              "Review the customer history",
              "Prepare a complementary service offer",
              "Schedule a follow-up with the contact person",
            ],
            confidence: 84,
          }
        : {
            title: "فرصة العميل الأعلى قيمة",
            summary: `${top.name} هو الأعلى تعاملًا حاليًا، وهناك فرصة لربط المتابعة المالية بعرض خدمة إضافية مناسبة.`,
            evidence: [
              `إجمالي التعاملات ${formatCurrency(top.totalSpent)}`,
              `عدد الطلبات ${top.totalOrders}`,
              `الرصيد المفتوح ${formatCurrency(top.outstanding)}`,
            ],
            actions: [
              "مراجعة سجل العميل",
              "تجهيز عرض خدمة مكملة",
              "جدولة متابعة مع مسؤول التواصل",
            ],
            confidence: 84,
          };
    }

    return english
      ? {
          title: "Executive summary",
          summary:
            "Today's highest priorities are collections, approving pending payments, and preventing inventory from reaching critical levels.",
          evidence: [
            "Open invoices need follow-up",
            "Some payments are awaiting review",
            "Several items are close to their minimum stock level",
          ],
          actions: [
            "Start with collections",
            "Approve verified payments",
            "Launch the replenishment request",
          ],
          confidence: 87,
        }
      : {
          title: "ملخص تنفيذي",
          summary:
            "أعلى أولويات اليوم هي التحصيل، اعتماد الدفعات المعلقة، ثم حماية المخزون من الوصول للحد الحرج.",
          evidence: [
            "فواتير مفتوحة تحتاج متابعة",
            "دفعات قيد المراجعة",
            "أصناف قريبة من الحد الأدنى",
          ],
          actions: [
            "البدء بالتحصيل",
            "اعتماد الدفعات",
            "إطلاق طلب التوريد",
          ],
          confidence: 87,
        };
  };
  const askAssistant = (prompt = question) => {
    if (!prompt.trim()) return;
    setThinking(true);
    window.setTimeout(() => {
      setAnswer(buildAnswer(prompt));
      setThinking(false);
      setQuestion("");
    }, 450);
  };

  const applyInsight = (id: string) => setApplied((current) => current.includes(id) ? current : [...current, id]);

  return (
    <>
      <WorkspaceHeader eyebrow="ERTIKAZ OPERATIONAL INTELLIGENCE" title="الذكاء التشغيلي" description="اسألي إرتكاز عن الفواتير أو العملاء أو المخزون أو الشحن، واحصلي على إجابة مرتبطة ببيانات النظام وإجراءات واضحة." icon={BrainCircuit} />

      <section className="grid gap-5 xl:grid-cols-[1.05fr_.95fr]">
        <div className="space-y-5">
          <Surface className="overflow-hidden">
            <div className="border-b border-slate-100 px-5 py-4"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#e6f1f8] text-[#2d75a3]"><Sparkles size={17} /></span><div><h3 className="text-[13px] font-bold text-slate-900">اسأل مساعد إرتكاز</h3><p className="mt-1 text-[8px] font-medium text-slate-400">تحليل فوري لبيانات العرض الحالية.</p></div></div></div>
            <div className="p-5">
              <div className="flex flex-wrap gap-2">
                {["ما الفواتير التي أتابعها اليوم؟", "ما الأصناف التي تحتاج توريد؟", "لخص لي الشحنات النشطة", "من أهم العملاء للمتابعة؟"].map((prompt) => <button key={prompt} type="button" onClick={() => askAssistant(prompt)} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[8px] font-medium text-slate-600 transition hover:border-[#c8dfe9] hover:bg-[#e6f1f8]">{prompt}</button>)}
              </div>
              <div className="mt-4 flex gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm"><textarea value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="اكتبي سؤالك التشغيلي هنا..." rows={3} className="min-h-[78px] flex-1 resize-none bg-transparent px-3 py-2 text-[9px] font-medium text-slate-800 outline-none placeholder:text-slate-300" /><button type="button" onClick={() => askAssistant()} disabled={!question.trim() || thinking} className="flex w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white disabled:opacity-40">{thinking ? <Loader2 size={17} className="animate-spin" /> : <Send size={16} />}</button></div>
            </div>
          </Surface>

          <Surface className="overflow-hidden">
            <div className="border-b border-slate-100 px-5 py-4"><div className="flex items-center justify-between"><div><p className="text-[8px] font-medium text-[#367fa9]">نتيجة التحليل</p><h3 className="mt-1 text-[13px] font-bold text-slate-900">{answer.title}</h3></div><span className="rounded-full bg-emerald-50 px-3 py-1.5 text-[8px] font-bold text-emerald-700">ثقة {answer.confidence}%</span></div></div>
            <div className="p-5"><p className="text-[9px] font-medium leading-6 text-slate-600">{answer.summary}</p><div className="mt-5 grid gap-4 md:grid-cols-2"><div><p className="mb-3 text-[8px] font-bold text-slate-500">الأدلة المستخدمة</p><div className="space-y-2">{answer.evidence.map((item, index) => <div key={`${item}-${index}`} className="flex items-start gap-2 rounded-2xl bg-slate-50 p-3"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-white text-[7px] font-bold text-slate-500 shadow-sm">{index + 1}</span><p className="text-[8px] font-medium leading-5 text-slate-600">{item}</p></div>)}</div></div><div><p className="mb-3 text-[8px] font-bold text-slate-500">الإجراءات المقترحة</p><div className="space-y-2">{answer.actions.map((item, index) => <button key={`${item}-${index}`} type="button" className="flex w-full items-center gap-2 rounded-2xl border border-slate-100 bg-white p-3 text-right transition hover:bg-slate-50"><span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700"><Check size={11} /></span><span className="text-[8px] font-bold text-slate-700">{item}</span></button>)}</div></div></div></div>
          </Surface>
        </div>

        <div className="space-y-5">
          <Surface className="p-4"><div className="flex flex-wrap gap-2">{(["الكل", "تحصيل", "مخزون", "عملاء", "شحن"] as const).map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`rounded-xl px-4 py-2 text-[8px] font-bold transition ${category === item ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500"}`}>{item}</button>)}</div></Surface>
          <Surface className="overflow-hidden"><div className="border-b border-slate-100 px-5 py-4"><h3 className="text-[12px] font-bold text-slate-900">قائمة القرارات</h3><p className="mt-1 text-[8px] font-medium text-slate-400">مرتبة حسب الأثر والثقة.</p></div><div className="divide-y divide-slate-100">{visible.map((insight) => { const done = applied.includes(insight.id); return <article key={insight.id} className="p-4"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-sky-50 px-2.5 py-1 text-[7px] font-bold text-sky-700">{insight.category}</span><span className={`rounded-full px-2.5 py-1 text-[7px] font-bold ${insight.impact === "مرتفع" ? "bg-amber-50 text-amber-700" : "bg-[#e6f1f8] text-[#2d75a3]"}`}>أثر {insight.impact}</span></div><h3 className="mt-3 text-[10px] font-bold text-slate-900">{insight.title}</h3><p className="mt-2 text-[8px] font-medium leading-5 text-slate-500">{insight.description}</p></div><span className="shrink-0 text-[11px] font-bold text-slate-700">{insight.confidence}%</span></div><button type="button" onClick={() => applyInsight(insight.id)} disabled={done} className={`mt-3 inline-flex h-9 w-full items-center justify-center gap-2 rounded-xl text-[8px] font-bold ${done ? "bg-emerald-50 text-emerald-700" : "bg-slate-900 text-white"}`}>{done ? <CheckCircle2 size={13} /> : <Zap size={13} />}{done ? "تم اعتماد التوصية" : insight.action}</button></article>; })}</div></Surface>
        </div>
      </section>
    </>
  );
}

function DetailPanel({
  title,
  subtitle,
  icon: Icon,
  onClose,
  children,
}: {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-slate-950/25 backdrop-blur-md" onMouseDown={onClose}>
      <aside className="ertikaz-surface h-full w-full max-w-lg overflow-y-auto border-r border-white/40 bg-white/95 shadow-[-30px_0_90px_rgba(15,23,42,.18)] backdrop-blur-2xl" onMouseDown={(event) => event.stopPropagation()}>
        <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/90 p-5 backdrop-blur-xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#236c83] text-white shadow-lg"><Icon size={19} /></span>
              <div>
                <p className="text-[8px] font-bold text-sky-600">تفاصيل السجل</p>
                <h3 className="mt-1 text-sm font-black text-slate-900">{title}</h3>
                <p className="mt-1 text-[9px] font-semibold text-slate-400">{subtitle}</p>
              </div>
            </div>
            <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200"><X size={16} /></button>
          </div>
        </div>
        <div className="p-5">{children}</div>
      </aside>
    </div>
  );
}

function InfoGrid({
  items,
}: {
  items: Array<{ label: string; value: string }>;
}) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-3">
      {items.map((item) => (
        <div
          key={`${item.label}-${item.value}`}
          className="rounded-2xl border border-slate-100 bg-slate-50 p-3"
        >
          <p className="text-[8px] font-bold text-slate-400">{item.label}</p>
          <p className="mt-1.5 text-[9px] font-black text-slate-800">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}

function OrdersWorkspace() {
  const [orders, setOrders] = useState<OrderRecord[]>(demoOrders);
  const [statusFilter, setStatusFilter] = useState<"الكل" | OrderRecord["status"]>("الكل");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const selected = orders.find((order) => order.id === selectedId) ?? null;
  const deleteOrder = (orderId: string) => {
    setOrders((current) => current.filter((order) => order.id !== orderId));
    setSelectedId(null);
  };
  const statuses: Array<{ key: "الكل" | OrderRecord["status"]; label: string; icon: LucideIcon; tone: string }> = [
    { key: "الكل", label: "كل الطلبات", icon: ShoppingCart, tone: "bg-slate-100 text-slate-700" },
    { key: "جديد", label: "جديدة", icon: Plus, tone: "bg-[#e6f1f8] text-[#2d75a3]" },
    { key: "بانتظار الاعتماد", label: "بانتظار الاعتماد", icon: Clock3, tone: "bg-amber-50 text-amber-700" },
    { key: "قيد التنفيذ", label: "قيد التنفيذ", icon: Activity, tone: "bg-sky-50 text-sky-700" },
    { key: "جاهز للشحن", label: "جاهزة للشحن", icon: PackageCheck, tone: "bg-[#eef9f6] text-[#147f75]" },
    { key: "مكتمل", label: "مكتملة", icon: CheckCircle2, tone: "bg-emerald-50 text-emerald-700" },
  ];

  const visibleOrders = useMemo(() => {
    const query = search.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesStatus = statusFilter === "الكل" || order.status === statusFilter;
      const matchesSearch = !query || `${order.id} ${order.customer} ${order.title} ${order.owner}`.toLowerCase().includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [orders, search, statusFilter]);

  const nextStatus = (status: OrderRecord["status"]): OrderRecord["status"] => {
    const path: OrderRecord["status"][] = ["جديد", "بانتظار الاعتماد", "قيد التنفيذ", "جاهز للشحن", "مكتمل"];
    return path[Math.min(path.indexOf(status) + 1, path.length - 1)];
  };

  const advanceOrder = (orderId: string) => {
    setOrders((current) => current.map((order) => {
      if (order.id !== orderId || order.status === "مكتمل") return order;
      const status = nextStatus(order.status);
      const progress = status === "بانتظار الاعتماد" ? 20 : status === "قيد التنفيذ" ? 58 : status === "جاهز للشحن" ? 86 : 100;
      return { ...order, status, progress };
    }));
  };

  const toggleInvoice = (orderId: string) => {
    setOrders((current) => current.map((order) => order.id === orderId ? { ...order, invoiceReady: !order.invoiceReady } : order));
  };

  const toggleShipment = (orderId: string) => {
    setOrders((current) => current.map((order) => order.id === orderId ? { ...order, shipmentReady: !order.shipmentReady } : order));
  };

  const createOrder = (draft: OrderDraft) => {
    const next: OrderRecord = {
      id: `ORD-2026-${String(92 + orders.length).padStart(3, "0")}`,
      customer: draft.customer,
      customerType: draft.customerType,
      title: draft.title,
      amount: draft.amount,
      status: "جديد",
      priority: draft.priority,
      createdAt: new Intl.DateTimeFormat("ar-SA", { day: "numeric", month: "long", year: "numeric" }).format(new Date()),
      dueDate: draft.dueDate,
      owner: draft.owner,
      progress: 8,
      invoiceReady: false,
      shipmentReady: false,
      notes: draft.notes,
    };
    setOrders((current) => [next, ...current]);
    setSelectedId(next.id);
    setShowCreate(false);
  };

  return (
    <>
      <WorkspaceHeader
        eyebrow="ORDERS"
        title="الطلبات"
        description=""
        icon={ShoppingCart}
        action={
          <button type="button" onClick={() => setShowCreate(true)} className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-900 px-4 text-[9px] font-bold text-white shadow-lg">
            <Plus size={14} />
            طلب جديد
          </button>
        }
      />

      <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <MiniStat label="إجمالي الطلبات" value={String(orders.length)} icon={ShoppingCart} tone="bg-sky-50 text-sky-700" note="كل الطلبات المسجلة" />
        <MiniStat label="بانتظار الاعتماد" value={String(orders.filter((order) => order.status === "بانتظار الاعتماد").length)} icon={Clock3} tone="bg-amber-50 text-amber-700" note="تحتاج قرارًا" />
        <MiniStat label="قيد التنفيذ" value={String(orders.filter((order) => order.status === "قيد التنفيذ").length)} icon={Activity} tone="bg-[#e6f1f8] text-[#2d75a3]" note="تحت المعالجة" />
        <MiniStat label="جاهزة للشحن" value={String(orders.filter((order) => order.status === "جاهز للشحن").length)} icon={PackageCheck} tone="bg-[#eef9f6] text-[#147f75]" note="جاهزة للتسليم" />
        <MiniStat label="قيمة الطلبات" value={formatCurrency(orders.reduce((sum, order) => sum + order.amount, 0))} icon={CircleDollarSign} tone="bg-emerald-50 text-emerald-700" note="إجمالي قيمة الطلبات" />
      </section>

      <Surface className="overflow-hidden">
        <div className="border-b border-slate-100 p-4 sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {statuses.map((item) => {
                const Icon = item.icon;
                const active = statusFilter === item.key;
                const count = item.key === "الكل" ? orders.length : orders.filter((order) => order.status === item.key).length;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setStatusFilter(item.key)}
                    title={`عرض ${item.label}`}
                    className={`group flex min-w-[112px] shrink-0 items-center gap-2 rounded-2xl border px-3 py-2.5 text-right transition ${active ? "border-slate-900 bg-slate-900 text-white shadow-lg" : "border-slate-100 bg-slate-50 text-slate-600 hover:border-sky-200 hover:bg-white"}`}
                  >
                    <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${active ? "bg-white/12 text-white" : item.tone}`}>
                      <Icon size={14} />
                    </span>
                    <span>
                      <span className="block text-[8px] font-bold">{item.label}</span>
                      <span className={`mt-0.5 block text-[10px] font-bold ${active ? "text-white" : "text-slate-900"}`}>{count}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="relative w-full xl:w-72">
              <Search size={14} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ابحث في الطلبات..." className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pr-10 pl-3 text-[9px] font-medium outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100" />
            </div>
          </div>
        </div>

        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[1040px] border-collapse text-right">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[8px] font-bold text-slate-400">
                <th className="px-5 py-3">الطلب</th>
                <th className="px-4 py-3">العميل</th>
                <th className="px-4 py-3">القيمة</th>
                <th className="px-4 py-3">الحالة</th>
                <th className="px-4 py-3">التقدم</th>
                <th className="px-4 py-3">المسؤول</th>
                <th className="px-5 py-3">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {visibleOrders.map((order) => (
                <tr key={order.id} className="border-b border-slate-100/80 transition hover:bg-sky-50/35">
                  <td className="px-5 py-4">
                    <p className="text-[9px] font-bold text-sky-700">{order.id}</p>
                    <p className="mt-1 max-w-[220px] truncate text-[10px] font-bold text-slate-900">{order.title}</p>
                    <p className="mt-1 text-[7px] font-medium text-slate-400">الاستحقاق {order.dueDate}</p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e6f1f8] text-[#2d75a3]">{order.customerType === "company" ? <Building2 size={14} /> : <User size={14} />}</span>
                      <span className="max-w-[180px] truncate text-[9px] font-bold text-slate-700">{order.customer}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[10px] font-bold text-slate-900">{formatCurrency(order.amount)}</td>
                  <td className="px-4 py-4"><span className={`rounded-full px-3 py-1.5 text-[7px] font-bold ring-1 ${statusTone(order.status)}`}>{order.status}</span></td>
                  <td className="px-4 py-4">
                    <div className="w-32">
                      <div className="mb-1 flex items-center justify-between text-[7px] font-medium text-slate-400"><span>{order.progress}%</span><span>{order.priority}</span></div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#236c83]" style={{ width: `${order.progress}%` }} /></div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[9px] font-medium text-slate-600">{order.owner}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <ActionIcon label="عرض التفاصيل" icon={Eye} onClick={() => setSelectedId(order.id)} />
                      <ActionIcon label={order.invoiceReady ? "إلغاء تجهيز الفاتورة" : "تجهيز الفاتورة"} icon={ReceiptText} active={order.invoiceReady} onClick={() => toggleInvoice(order.id)} />
                      <ActionIcon label={order.shipmentReady ? "إلغاء تجهيز الشحنة" : "تجهيز الشحنة"} icon={Truck} active={order.shipmentReady} onClick={() => toggleShipment(order.id)} />
                      <ActionIcon label="نقل للمرحلة التالية" icon={ArrowLeft} disabled={order.status === "مكتمل"} onClick={() => advanceOrder(order.id)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid gap-3 p-4 lg:hidden">
          {visibleOrders.map((order) => (
            <article key={order.id} className="rounded-[22px] border border-slate-100 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div><p className="text-[8px] font-bold text-sky-700">{order.id}</p><h3 className="mt-1 text-[11px] font-bold text-slate-900">{order.title}</h3><p className="mt-1 text-[8px] font-medium text-slate-400">{order.customer}</p></div>
                <span className={`rounded-full px-3 py-1 text-[7px] font-bold ring-1 ${statusTone(order.status)}`}>{order.status}</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2"><div className="rounded-xl bg-white p-3"><p className="text-[7px] text-slate-400">القيمة</p><p className="mt-1 text-[10px] font-bold text-slate-900">{formatCurrency(order.amount)}</p></div><div className="rounded-xl bg-white p-3"><p className="text-[7px] text-slate-400">المسؤول</p><p className="mt-1 text-[9px] font-bold text-slate-900">{order.owner}</p></div></div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white"><div className="h-full rounded-full bg-[#236c83]" style={{ width: `${order.progress}%` }} /></div>
              <div className="mt-3 flex items-center gap-2"><ActionIcon label="التفاصيل" icon={Eye} onClick={() => setSelectedId(order.id)} /><ActionIcon label="الفاتورة" icon={ReceiptText} active={order.invoiceReady} onClick={() => toggleInvoice(order.id)} /><ActionIcon label="الشحنة" icon={Truck} active={order.shipmentReady} onClick={() => toggleShipment(order.id)} /><ActionIcon label="التالي" icon={ArrowLeft} disabled={order.status === "مكتمل"} onClick={() => advanceOrder(order.id)} /></div>
            </article>
          ))}
        </div>

        {visibleOrders.length === 0 && <div className="p-10 text-center text-[9px] font-medium text-slate-400">لا توجد طلبات مطابقة للبحث أو الفلتر الحالي.</div>}
      </Surface>

      {selected && (
        <DetailPanel title={selected.id} subtitle={selected.customer} icon={ShoppingCart} onClose={() => setSelectedId(null)}>
          <div className="rounded-[22px] bg-[#f8fcfb] p-5">
            <div className="flex items-start justify-between gap-3"><div><p className="text-[8px] font-bold text-sky-700">{selected.priority} الأولوية</p><h3 className="mt-2 text-[15px] font-bold text-slate-900">{selected.title}</h3><p className="mt-2 text-[22px] font-bold text-slate-950">{formatCurrency(selected.amount)}</p></div><span className={`rounded-full px-3 py-1 text-[7px] font-bold ring-1 ${statusTone(selected.status)}`}>{selected.status}</span></div>
          </div>
          <InfoGrid items={[{ label: "المسؤول", value: selected.owner }, { label: "تاريخ الإنشاء", value: selected.createdAt }, { label: "تاريخ الاستحقاق", value: selected.dueDate }, { label: "نسبة الإنجاز", value: `${selected.progress}%` }]} />
          <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-4"><p className="text-[8px] font-medium text-slate-400">ملاحظات الطلب</p><p className="mt-2 text-[9px] font-medium leading-5 text-slate-700">{selected.notes || "لا توجد ملاحظات."}</p></div>
          <div className="mt-4 grid grid-cols-2 gap-3"><button type="button" onClick={() => toggleInvoice(selected.id)} className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl text-[9px] font-bold ${selected.invoiceReady ? "bg-emerald-50 text-emerald-700" : "bg-slate-900 text-white"}`}><ReceiptText size={14} />{selected.invoiceReady ? "الفاتورة جاهزة" : "تجهيز الفاتورة"}</button><button type="button" onClick={() => toggleShipment(selected.id)} className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl text-[9px] font-bold ${selected.shipmentReady ? "bg-sky-50 text-sky-700" : "bg-slate-900 text-white"}`}><Truck size={14} />{selected.shipmentReady ? "الشحنة جاهزة" : "تجهيز الشحنة"}</button></div>
          {selected.status !== "مكتمل" && <button type="button" onClick={() => advanceOrder(selected.id)} className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#236c83] text-[9px] font-bold text-white"><ArrowLeft size={14} />نقل الطلب للمرحلة التالية</button>}
          <button type="button" onClick={() => { if (window.confirm("حذف هذا الطلب؟")) deleteOrder(selected.id); }} className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 text-[9px] font-bold text-red-600"><Trash2 size={14} /> حذف الطلب</button>
        </DetailPanel>
      )}

      {showCreate && <OrderCreateModal onClose={() => setShowCreate(false)} onSave={createOrder} />}
    </>
  );
}

function ActionIcon({ label, icon: Icon, onClick, active = false, disabled = false }: { label: string; icon: LucideIcon; onClick: () => void; active?: boolean; disabled?: boolean }) {
  return (
    <button type="button" title={label} aria-label={label} onClick={onClick} disabled={disabled} className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${active ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-500 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"} disabled:cursor-not-allowed disabled:opacity-35`}>
      <Icon size={14} />
    </button>
  );
}

function OrderCreateModal({ onClose, onSave }: { onClose: () => void; onSave: (draft: OrderDraft) => void }) {
  const [draft, setDraft] = useState<OrderDraft>({ customer: "", customerType: "company", title: "", amount: 0, priority: "متوسطة", dueDate: "", owner: "", notes: "" });
  const canSave = draft.customer.trim().length > 1 && draft.title.trim().length > 2 && draft.amount > 0 && draft.dueDate && draft.owner.trim().length > 1;
  const update = <K extends keyof OrderDraft>(key: K, value: OrderDraft[K]) => setDraft((current) => ({ ...current, [key]: value }));

  return (
    <div className="calm-add-backdrop px-4 py-6">
      <div className="calm-add-card max-h-[92vh] w-full max-w-2xl overflow-y-auto">
        <div className="calm-add-header sticky top-0 z-10 flex items-center justify-between border-b px-5 py-4 backdrop-blur"><div><h2 className="text-[16px] font-bold text-slate-900">إنشاء طلب جديد</h2></div><button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500"><X size={16} /></button></div>
        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <Field label="اسم العميل" value={draft.customer} onChange={(value) => update("customer", value)} placeholder="اسم العميل أو الشركة" required />
          <label className="block"><span className="mb-2 block text-[9px] font-bold text-slate-600">نوع العميل</span><select value={draft.customerType} onChange={(event) => update("customerType", event.target.value as CustomerType)} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-[9px] outline-none"><option value="company">شركة</option><option value="individual">فرد</option></select></label>
          <div className="sm:col-span-2"><Field label="عنوان الطلب" value={draft.title} onChange={(value) => update("title", value)} placeholder="مثال: توريد وربط أجهزة الشبكة" required /></div>
          <label className="block"><span className="mb-2 block text-[9px] font-bold text-slate-600">قيمة الطلب</span><input type="number" min="0" value={draft.amount || ""} onChange={(event) => update("amount", Number(event.target.value))} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-[9px] outline-none" placeholder="0" /></label>
          <label className="block"><span className="mb-2 block text-[9px] font-bold text-slate-600">الأولوية</span><select value={draft.priority} onChange={(event) => update("priority", event.target.value as OrderRecord["priority"])} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-[9px] outline-none"><option value="عالية">عالية</option><option value="متوسطة">متوسطة</option><option value="عادية">عادية</option></select></label>
          <Field label="المسؤول" value={draft.owner} onChange={(value) => update("owner", value)} placeholder="اسم المسؤول عن الطلب" required />
          <label className="block"><span className="mb-2 block text-[9px] font-bold text-slate-600">تاريخ الاستحقاق</span><input type="date" value={draft.dueDate} onChange={(event) => update("dueDate", event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-[9px] outline-none" /></label>
          <label className="block sm:col-span-2"><span className="mb-2 block text-[9px] font-bold text-slate-600">ملاحظات</span><textarea value={draft.notes} onChange={(event) => update("notes", event.target.value)} rows={4} className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-[9px] outline-none" placeholder="تفاصيل إضافية عن الطلب..." /></label>
        </div>
        <div className="calm-add-footer flex justify-end gap-2 border-t p-5"><button type="button" onClick={onClose} className="h-10 rounded-xl border border-slate-200 px-4 text-[9px] font-bold text-slate-600">إلغاء</button><button type="button" disabled={!canSave} onClick={() => onSave(draft)} className="h-10 rounded-xl bg-[#237c82] px-5 text-[9px] font-bold text-white shadow-[0_10px_25px_rgba(35,124,130,.18)] disabled:opacity-40">حفظ الطلب</button></div>
      </div>
    </div>
  );
}

function UsersWorkspace({
  users,
  setUsers,
  currentUser,
}: {
  users: UserRecord[];
  setUsers: React.Dispatch<React.SetStateAction<UserRecord[]>>;
  currentUser: UserRecord;
}) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"الكل" | UserRecord["role"]>("الكل");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showCredential, setShowCredential] = useState(false);
  const [passwordDraft, setPasswordDraft] = useState("");
  const selected = users.find((user) => user.id === selectedId) ?? null;

  useEffect(() => {
    setPasswordDraft(selected?.password ?? "");
    setShowCredential(false);
  }, [selectedId, selected?.password]);

  const visibleUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return users.filter((user) => (roleFilter === "الكل" || user.role === roleFilter) && (!query || `${user.name} ${user.email} ${user.department} ${user.role}`.toLowerCase().includes(query)));
  }, [users, search, roleFilter]);

  const toggleStatus = (userId: string) => {
    if (userId === currentUser.id) return;
    setUsers((current) => current.map((user) => user.id === userId ? { ...user, status: user.status === "نشط" ? "موقوف" : "نشط", lastActive: user.status === "نشط" ? "تم إيقاف الحساب" : "الآن" } : user));
  };

  const togglePermission = (userId: string, permission: string) => {
    setUsers((current) => current.map((user) => user.id === userId ? { ...user, permissions: user.permissions.includes(permission) ? user.permissions.filter((item) => item !== permission) : [...user.permissions, permission] } : user));
  };

  const addUser = (draft: UserDraft) => {
    const defaultPermissions: Record<UserRecord["role"], string[]> = {
      "مدير النظام": ["لوحة التحكم", "العملاء", "الطلبات", "الفواتير", "المدفوعات", "الشحنات", "المخزون", "التقارير", "المستخدمون"],
      "محاسب": ["الفواتير", "المدفوعات", "التقارير"],
      "مبيعات": ["العملاء", "الطلبات", "الفواتير"],
      "خدمة عملاء": ["العملاء", "الطلبات", "الشحنات"],
      "مخزون": ["الطلبات", "الشحنات", "المخزون"],
      "مشاهد": ["لوحة التحكم", "التقارير"],
    };
    const next: UserRecord = { id: `USR-${String(users.length + 1).padStart(3, "0")}`, ...draft, lastActive: draft.status === "نشط" ? "الآن" : "لم يسجل الدخول", joinedAt: new Intl.DateTimeFormat("ar-SA", { day: "numeric", month: "long", year: "numeric" }).format(new Date()), permissions: defaultPermissions[draft.role] };
    setUsers((current) => [next, ...current]);
    setSelectedId(next.id);
    setShowCreate(false);
  };

  const savePassword = () => {
    if (!selected || passwordDraft.trim().length < 6) return;
    setUsers((current) => current.map((user) => user.id === selected.id ? { ...user, password: passwordDraft } : user));
  };

  const roles: Array<"الكل" | UserRecord["role"]> = ["الكل", "مدير النظام", "محاسب", "مبيعات", "خدمة عملاء", "مخزون", "مشاهد"];

  return (
    <>
      <WorkspaceHeader eyebrow="USERS" title="المستخدمون" description="" icon={Users} action={<button type="button" onClick={() => setShowCreate(true)} className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-900 px-4 text-[9px] font-bold text-white shadow-lg"><UserPlus size={14} />إضافة مستخدم</button>} />

      <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MiniStat label="إجمالي المستخدمين" value={String(users.length)} icon={Users} tone="bg-sky-50 text-sky-700" note="حسابات دخول فعلية" />
        <MiniStat label="مستخدمون نشطون" value={String(users.filter((user) => user.status === "نشط").length)} icon={CheckCircle2} tone="bg-emerald-50 text-emerald-700" note="يمكنهم تسجيل الدخول" />
        <MiniStat label="حسابات متوقفة" value={String(users.filter((user) => user.status === "موقوف").length)} icon={ShieldAlert} tone="bg-amber-50 text-amber-700" note="لا يمكنها الدخول" />
        <MiniStat label="أدوار مستخدمة" value={String(new Set(users.map((user) => user.role)).size)} icon={ShieldCheck} tone="bg-[#e6f1f8] text-[#2d75a3]" note="صلاحيات مختلفة" />
      </section>

      <Surface className="overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:p-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1">{roles.map((role) => <button key={role} type="button" onClick={() => setRoleFilter(role)} className={`shrink-0 rounded-xl px-3.5 py-2 text-[8px] font-bold transition ${roleFilter === role ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>{role}</button>)}</div>
          <div className="relative w-full xl:w-72"><Search size={14} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ابحث باسم أو بريد أو دور..." className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pr-10 pl-3 text-[9px] outline-none focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100" /></div>
        </div>

        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[980px] text-right"><thead><tr className="border-b border-slate-100 bg-slate-50/70 text-[8px] font-bold text-slate-400"><th className="px-5 py-3">المستخدم</th><th className="px-4 py-3">بيانات الدخول</th><th className="px-4 py-3">الدور والقسم</th><th className="px-4 py-3">الحالة</th><th className="px-4 py-3">آخر نشاط</th><th className="px-5 py-3">الإجراءات</th></tr></thead>
            <tbody>{visibleUsers.map((user) => <tr key={user.id} className="border-b border-slate-100/80 transition hover:bg-sky-50/30"><td className="px-5 py-4"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#236c83] text-[10px] font-bold text-white">{user.name.slice(0, 1)}</span><div><p className="text-[10px] font-bold text-slate-900">{user.name}</p><p className="mt-1 text-[8px] font-medium text-slate-400">{user.id}</p></div></div></td><td className="px-4 py-4"><p className="text-[9px] font-bold text-slate-700">{user.email}</p><p className="mt-1 text-[8px] tracking-[.18em] text-slate-400">••••••••</p></td><td className="px-4 py-4"><p className="text-[9px] font-bold text-slate-700">{user.role}</p><p className="mt-1 text-[8px] text-slate-400">{user.department}</p></td><td className="px-4 py-4"><span className={`rounded-full px-3 py-1.5 text-[7px] font-bold ring-1 ${statusTone(user.status)}`}>{user.status}</span></td><td className="px-4 py-4 text-[8px] font-medium text-slate-500">{user.lastActive}</td><td className="px-5 py-4"><div className="flex items-center gap-1.5"><ActionIcon label="بيانات الحساب والصلاحيات" icon={Eye} onClick={() => setSelectedId(user.id)} /><ActionIcon label={user.id === currentUser.id ? "لا يمكن إيقاف حسابك الحالي" : user.status === "نشط" ? "إيقاف الحساب" : "تفعيل الحساب"} icon={user.status === "نشط" ? X : Check} active={user.status === "نشط"} disabled={user.id === currentUser.id} onClick={() => toggleStatus(user.id)} /><ActionIcon label="إرسال رسالة" icon={Mail} onClick={() => { if (typeof window !== "undefined") window.location.href = `mailto:${user.email}`; }} /></div></td></tr>)}</tbody>
          </table>
        </div>

        <div className="grid gap-3 p-4 sm:grid-cols-2 lg:hidden">{visibleUsers.map((user) => <article key={user.id} className="rounded-[22px] border border-slate-100 bg-slate-50 p-4"><div className="flex items-start justify-between"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#236c83] text-[10px] font-bold text-white">{user.name.slice(0, 1)}</span><div><p className="text-[10px] font-bold text-slate-900">{user.name}</p><p className="mt-1 text-[8px] text-slate-400">{user.role}</p></div></div><span className={`rounded-full px-3 py-1 text-[7px] font-bold ring-1 ${statusTone(user.status)}`}>{user.status}</span></div><p className="mt-4 text-[8px] font-medium text-slate-500">{user.email}</p><div className="mt-4 flex items-center gap-2"><ActionIcon label="التفاصيل" icon={Eye} onClick={() => setSelectedId(user.id)} /><ActionIcon label="تغيير الحالة" icon={user.status === "نشط" ? X : Check} active={user.status === "نشط"} disabled={user.id === currentUser.id} onClick={() => toggleStatus(user.id)} /></div></article>)}</div>
      </Surface>

      {selected && <DetailPanel title={selected.name} subtitle={`${selected.role} · ${selected.department}`} icon={UserCog} onClose={() => setSelectedId(null)}>
        <div className="rounded-[22px] bg-[#f8fcfb] p-5"><div className="flex items-center gap-4"><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#236c83] text-lg font-bold text-white">{selected.name.slice(0, 1)}</span><div><h3 className="text-[15px] font-bold text-slate-900">{selected.name}</h3><p className="mt-1 text-[9px] text-slate-500">{selected.email}</p><span className={`mt-2 inline-flex rounded-full px-3 py-1 text-[7px] font-bold ring-1 ${statusTone(selected.status)}`}>{selected.status}</span></div></div></div>
        <InfoGrid items={[{ label: "رقم الجوال", value: selected.phone }, { label: "تاريخ الانضمام", value: selected.joinedAt }, { label: "آخر نشاط", value: selected.lastActive }, { label: "القسم", value: selected.department }]} />
        <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4"><div className="flex items-center justify-between"><div><p className="text-[8px] font-bold text-slate-500">بيانات تسجيل الدخول</p><p className="mt-1 text-[8px] font-medium text-slate-400">يمكن للمستخدم الدخول بهذه البيانات عندما يكون الحساب نشطًا.</p></div><button type="button" onClick={() => setShowCredential((value) => !value)} className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-500">{showCredential ? <EyeOff size={14} /> : <Eye size={14} />}</button></div><div className="mt-4 space-y-3"><div className="rounded-xl bg-white p-3"><p className="text-[7px] font-medium text-slate-400">البريد الإلكتروني</p><p className="mt-1 text-[9px] font-bold text-slate-800">{selected.email}</p></div><label className="block"><span className="mb-2 block text-[7px] font-medium text-slate-400">رمز الدخول</span><input type={showCredential ? "text" : "password"} value={passwordDraft} onChange={(event) => setPasswordDraft(event.target.value)} className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-[9px] font-medium text-slate-800 outline-none focus:border-[#9bb4be]" /></label><button type="button" disabled={passwordDraft.trim().length < 6 || passwordDraft === selected.password} onClick={savePassword} className="h-10 w-full rounded-xl bg-slate-900 text-[8px] font-bold text-white disabled:opacity-35">حفظ رمز الدخول الجديد</button></div></div>
        <div className="mt-5"><div className="mb-3 flex items-center justify-between"><h4 className="text-[10px] font-bold text-slate-900">الصلاحيات</h4><span className="text-[8px] text-slate-400">اضغطي للتفعيل أو الإلغاء</span></div><div className="grid grid-cols-2 gap-2">{["لوحة التحكم", "العملاء", "الطلبات", "الفواتير", "المدفوعات", "الشحنات", "المخزون", "التقارير", "المستخدمون"].map((permission) => { const active = selected.permissions.includes(permission); return <button key={permission} type="button" onClick={() => togglePermission(selected.id, permission)} className={`flex items-center justify-between rounded-xl border p-3 text-[8px] font-bold transition ${active ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-500"}`}><span>{permission}</span>{active ? <Check size={12} /> : <Plus size={12} />}</button>; })}</div></div>
        <button type="button" disabled={selected.id === currentUser.id} onClick={() => toggleStatus(selected.id)} className={`mt-5 h-11 w-full rounded-xl text-[9px] font-bold disabled:cursor-not-allowed disabled:opacity-35 ${selected.status === "نشط" ? "bg-amber-50 text-amber-700" : "bg-emerald-500 text-white"}`}>{selected.id === currentUser.id ? "هذا هو حسابك الحالي" : selected.status === "نشط" ? "إيقاف حساب المستخدم" : "تفعيل حساب المستخدم"}</button>
        <button type="button" disabled={selected.id === currentUser.id} onClick={() => { if (window.confirm("حذف هذا المستخدم؟")) { setUsers((current) => current.filter((user) => user.id !== selected.id)); setSelectedId(null); } }} className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 text-[9px] font-bold text-red-600 disabled:opacity-35"><Trash2 size={14} /> حذف المستخدم</button>
      </DetailPanel>}
      {showCreate && <UserCreateModal users={users} onClose={() => setShowCreate(false)} onSave={addUser} />}
    </>
  );
}

function UserCreateModal({
  users,
  onClose,
  onSave,
}: {
  users: UserRecord[];
  onClose: () => void;
  onSave: (draft: UserDraft) => void;
}) {
  const [draft, setDraft] = useState<UserDraft>({ name: "", email: "", password: "", phone: "", role: "مبيعات", department: "المبيعات", status: "نشط" });
  const [showPassword, setShowPassword] = useState(false);
  const update = <K extends keyof UserDraft>(key: K, value: UserDraft[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const emailExists = users.some((user) => user.email.toLowerCase() === draft.email.trim().toLowerCase());
  const canSave = draft.name.trim().length > 2 && draft.email.includes("@") && !emailExists && draft.password.trim().length >= 6 && draft.phone.trim().length > 6 && draft.department.trim().length > 1;

  return (
    <div className="calm-add-backdrop px-4 py-6">
      <div className="calm-add-card w-full max-w-xl">
        <div className="calm-add-header flex items-center justify-between border-b px-5 py-4"><div><h2 className="text-[16px] font-bold text-slate-900">إضافة مستخدم جديد</h2><p className="mt-1 text-[8px] font-medium text-slate-400">أنشئي حسابًا يمكن استخدامه مباشرة في شاشة الدخول.</p></div><button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500"><X size={16} /></button></div>
        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <Field label="الاسم الكامل" value={draft.name} onChange={(value) => update("name", value)} placeholder="اسم المستخدم" required />
          <div><Field label="البريد الإلكتروني" value={draft.email} onChange={(value) => update("email", value)} placeholder="name@company.com" required />{emailExists && <p className="mt-1 text-[7px] font-medium text-amber-700">البريد مستخدم بالفعل.</p>}</div>
          <label className="block"><span className="mb-2 block text-[9px] font-bold text-slate-600">رمز الدخول</span><div className="relative"><input type={showPassword ? "text" : "password"} value={draft.password} onChange={(event) => update("password", event.target.value)} placeholder="6 أحرف أو أرقام على الأقل" className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pl-11 text-[9px] font-medium text-slate-800 outline-none focus:border-[#9bb4be] focus:bg-white" /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl text-slate-400">{showPassword ? <EyeOff size={14} /> : <Eye size={14} />}</button></div></label>
          <Field label="رقم الجوال" value={draft.phone} onChange={(value) => update("phone", value)} placeholder="+966 5X XXX XXXX" required />
          <Field label="القسم" value={draft.department} onChange={(value) => update("department", value)} placeholder="مثال: المبيعات" required />
          <label className="block"><span className="mb-2 block text-[9px] font-bold text-slate-600">الدور</span><select value={draft.role} onChange={(event) => update("role", event.target.value as UserRecord["role"])} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-[9px] outline-none"><option>مدير النظام</option><option>محاسب</option><option>مبيعات</option><option>خدمة عملاء</option><option>مخزون</option><option>مشاهد</option></select></label>
          <label className="block"><span className="mb-2 block text-[9px] font-bold text-slate-600">حالة الحساب</span><select value={draft.status} onChange={(event) => update("status", event.target.value as UserRecord["status"])} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-[9px] outline-none"><option>نشط</option><option>دعوة معلقة</option><option>موقوف</option></select></label>
        </div>
        <div className="calm-add-footer flex justify-end gap-2 border-t p-5"><button type="button" onClick={onClose} className="h-10 rounded-xl border border-slate-200 px-4 text-[9px] font-bold text-slate-600">إلغاء</button><button type="button" disabled={!canSave} onClick={() => onSave(draft)} className="h-10 rounded-xl bg-[#237c82] px-5 text-[9px] font-bold text-white disabled:opacity-40">إنشاء حساب الدخول</button></div>
      </div>
    </div>
  );
}

function SettingsWorkspace({
  currentUser,
  users,
  setUsers,
  language,
  theme,
  onToggleLanguage,
  onToggleTheme,
}: {
  currentUser: UserRecord;
  users: UserRecord[];
  setUsers: React.Dispatch<React.SetStateAction<UserRecord[]>>;
  language: Language;
  theme: ThemeMode;
  onToggleLanguage: () => void;
  onToggleTheme: () => void;
}) {
  type SettingsTab = "profile" | "security" | "permissions" | "preferences";
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [department, setDepartment] = useState(currentUser.department);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);
  const [managedUserId, setManagedUserId] = useState(currentUser.id);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    setName(currentUser.name);
    setEmail(currentUser.email);
    setPhone(currentUser.phone);
    setDepartment(currentUser.department);
  }, [currentUser]);

  const managedUser = users.find((user) => user.id === managedUserId) ?? currentUser;
  const allPermissions = [
    "لوحة التحكم",
    "العملاء",
    "الطلبات",
    "الفواتير",
    "المدفوعات",
    "الشحنات",
    "المخزون",
    "التقارير",
    "المستخدمون",
  ];

  const showMessage = (type: "success" | "error", text: string) => {
    setMessage({ type, text });
    window.setTimeout(() => setMessage(null), 3500);
  };

  const saveProfile = () => {
    const normalizedEmail = email.trim().toLowerCase();
    if (name.trim().length < 3 || !normalizedEmail.includes("@")) {
      showMessage("error", "تحققي من الاسم والبريد الإلكتروني.");
      return;
    }
    const duplicated = users.some(
      (user) => user.id !== currentUser.id && user.email.toLowerCase() === normalizedEmail,
    );
    if (duplicated) {
      showMessage("error", "البريد الإلكتروني مستخدم في حساب آخر.");
      return;
    }
    setUsers((current) =>
      current.map((user) =>
        user.id === currentUser.id
          ? {
              ...user,
              name: name.trim(),
              email: normalizedEmail,
              phone: phone.trim(),
              department: department.trim(),
            }
          : user,
      ),
    );
    window.localStorage.setItem("ertikaz-session", normalizedEmail);
    showMessage("success", "تم حفظ بيانات الحساب بنجاح.");
  };

  const changePassword = () => {
    if (currentPassword !== currentUser.password) {
      showMessage("error", "كلمة المرور الحالية غير صحيحة.");
      return;
    }
    if (newPassword.length < 6) {
      showMessage("error", "كلمة المرور الجديدة يجب ألا تقل عن 6 خانات.");
      return;
    }
    if (newPassword !== confirmPassword) {
      showMessage("error", "تأكيد كلمة المرور غير مطابق.");
      return;
    }
    setUsers((current) =>
      current.map((user) =>
        user.id === currentUser.id ? { ...user, password: newPassword } : user,
      ),
    );
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    showMessage("success", "تم تغيير كلمة المرور بنجاح.");
  };

  const togglePermission = (permission: string) => {
    setUsers((current) =>
      current.map((user) => {
        if (user.id !== managedUser.id) return user;
        const active = user.permissions.includes(permission);
        return {
          ...user,
          permissions: active
            ? user.permissions.filter((item) => item !== permission)
            : [...user.permissions, permission],
        };
      }),
    );
  };

  const updateManagedUser = (updates: Partial<UserRecord>) => {
    setUsers((current) =>
      current.map((user) => (user.id === managedUser.id ? { ...user, ...updates } : user)),
    );
    showMessage("success", "تم تحديث إعدادات المستخدم.");
  };

  const tabs: Array<{ key: SettingsTab; label: string; icon: LucideIcon }> = [
    { key: "profile", label: "الملف الشخصي", icon: UserCog },
    { key: "security", label: "الأمان وكلمة المرور", icon: KeyRound },
    { key: "permissions", label: "الصلاحيات والمستخدمون", icon: ShieldCheck },
    { key: "preferences", label: "المظهر واللغة", icon: Settings },
  ];

  return (
    <>
      <WorkspaceHeader
        eyebrow="SETTINGS"
        title="الإعدادات"
        description=""
        icon={Settings}
      />

      {message && (
        <div
          className={`mb-5 flex items-center gap-2 rounded-2xl border p-4 text-[9px] font-bold ${
            message.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-amber-200 bg-amber-50 text-amber-700"
          }`}
        >
          {message.type === "success" ? <CheckCircle2 size={15} /> : <CircleAlert size={15} />}
          {message.text}
        </div>
      )}

      <section className="grid gap-5 xl:grid-cols-[260px_1fr]">
        <Surface className="h-fit p-3">
          <div className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex w-full items-center gap-3 rounded-2xl p-3.5 text-right transition ${
                    active
                      ? "bg-[#f8fcfb] text-slate-900 shadow-sm"
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      active ? "bg-white text-[#367fa9] shadow-sm" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <Icon size={16} />
                  </span>
                  <span className="text-[9px] font-bold">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </Surface>

        <div>
          {activeTab === "profile" && (
            <Surface className="overflow-hidden">
              <div className="flex items-center gap-4 border-b border-slate-100 p-5">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#236c83] text-lg font-bold text-white shadow-lg">
                  {currentUser.name.slice(0, 1)}
                </span>
                <div>
                  <h3 className="text-[14px] font-bold text-slate-900">بيانات الحساب</h3>
                  <p className="mt-1 text-[8px] font-medium text-slate-400">حدّث بياناتك الأساسية المستخدمة داخل إرتكاز.</p>
                </div>
              </div>
              <div className="grid gap-4 p-5 sm:grid-cols-2">
                <Field label="الاسم الكامل" value={name} onChange={setName} placeholder="الاسم الكامل" required />
                <Field label="البريد الإلكتروني" value={email} onChange={setEmail} placeholder="name@company.com" required />
                <Field label="رقم الجوال" value={phone} onChange={setPhone} placeholder="+966 5X XXX XXXX" />
                <Field label="القسم" value={department} onChange={setDepartment} placeholder="الإدارة" />
                <div className="sm:col-span-2 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-[7px] font-medium text-slate-400">الدور الحالي</p>
                    <p className="mt-1 text-[10px] font-bold text-slate-800">{currentUser.role}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-[7px] font-medium text-slate-400">حالة الحساب</p>
                    <p className="mt-1 text-[10px] font-bold text-emerald-700">{currentUser.status}</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end border-t border-slate-100 p-5">
                <button
                  type="button"
                  onClick={saveProfile}
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-slate-900 px-5 text-[9px] font-bold text-white"
                >
                  <Check size={14} />
                  حفظ التعديلات
                </button>
              </div>
            </Surface>
          )}

          {activeTab === "security" && (
            <Surface className="overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 p-5">
                <div>
                  <h3 className="text-[14px] font-bold text-slate-900">تغيير كلمة المرور</h3>
                  <p className="mt-1 text-[8px] font-medium text-slate-400">استخدم كلمة مرور لا تقل عن 6 خانات.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPasswords((value) => !value)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e6f1f8] text-[#2d75a3]"
                >
                  {showPasswords ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <div className="max-w-xl space-y-4 p-5">
                <label className="block">
                  <span className="mb-2 block text-[9px] font-bold text-slate-600">كلمة المرور الحالية</span>
                  <input
                    type={showPasswords ? "text" : "password"}
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-[9px] outline-none focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[9px] font-bold text-slate-600">كلمة المرور الجديدة</span>
                  <input
                    type={showPasswords ? "text" : "password"}
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-[9px] outline-none focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[9px] font-bold text-slate-600">تأكيد كلمة المرور الجديدة</span>
                  <input
                    type={showPasswords ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-[9px] outline-none focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  />
                </label>
                <button
                  type="button"
                  onClick={changePassword}
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-slate-900 px-5 text-[9px] font-bold text-white"
                >
                  <KeyRound size={14} />
                  تحديث كلمة المرور
                </button>
              </div>
            </Surface>
          )}

          {activeTab === "permissions" && (
            <div className="space-y-5">
              <Surface className="p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <label className="block flex-1">
                    <span className="mb-2 block text-[9px] font-bold text-slate-600">المستخدم</span>
                    <select
                      value={managedUserId}
                      onChange={(event) => setManagedUserId(event.target.value)}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-[9px] outline-none focus:border-sky-300"
                    >
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} — {user.role}
                        </option>
                      ))}
                    </select>
                  </label>
                  <div className="flex gap-2">
                    <label className="block">
                      <span className="mb-2 block text-[9px] font-bold text-slate-600">الدور</span>
                      <select
                        value={managedUser.role}
                        onChange={(event) => updateManagedUser({ role: event.target.value as UserRecord["role"] })}
                        className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-[9px] outline-none"
                      >
                        <option>مدير النظام</option>
                        <option>محاسب</option>
                        <option>مبيعات</option>
                        <option>خدمة عملاء</option>
                        <option>مخزون</option>
                        <option>مشاهد</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-[9px] font-bold text-slate-600">الحالة</span>
                      <select
                        value={managedUser.status}
                        disabled={managedUser.id === currentUser.id}
                        onChange={(event) => updateManagedUser({ status: event.target.value as UserRecord["status"] })}
                        className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-[9px] outline-none disabled:opacity-50"
                      >
                        <option>نشط</option>
                        <option>موقوف</option>
                        <option>دعوة معلقة</option>
                      </select>
                    </label>
                  </div>
                </div>
              </Surface>

              <Surface className="overflow-hidden">
                <div className="border-b border-slate-100 p-5">
                  <h3 className="text-[13px] font-bold text-slate-900">صلاحيات الوصول</h3>
                  <p className="mt-1 text-[8px] font-medium text-slate-400">فعّل أو أوقف الأقسام المتاحة لهذا المستخدم.</p>
                </div>
                <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-3">
                  {allPermissions.map((permission) => {
                    const active = managedUser.permissions.includes(permission);
                    const navItem = navigation.find((item) => item.label === permission);
                    const Icon = navItem?.icon ?? ShieldCheck;
                    return (
                      <button
                        key={permission}
                        type="button"
                        onClick={() => togglePermission(permission)}
                        className={`flex items-center justify-between rounded-2xl border p-4 text-right transition ${
                          active
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 bg-slate-50 text-slate-500"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${active ? "bg-white" : "bg-slate-100"}`}>
                            <Icon size={15} />
                          </span>
                          <span className="text-[9px] font-bold">{permission}</span>
                        </div>
                        {active ? <Check size={14} /> : <Plus size={14} />}
                      </button>
                    );
                  })}
                </div>
              </Surface>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="grid gap-5 md:grid-cols-2">
              <Surface className="p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                    <Languages size={17} />
                  </span>
                  <div>
                    <h3 className="text-[12px] font-bold text-slate-900">لغة النظام</h3>
                    <p className="mt-1 text-[8px] font-medium text-slate-400">العربية والإنجليزية مع تغيير اتجاه الصفحة.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onToggleLanguage}
                  className="mt-5 h-11 w-full rounded-xl bg-sky-50 text-[9px] font-bold text-sky-700"
                >
                  {language === "ar" ? "التبديل إلى English" : "Switch to العربية"}
                </button>
              </Surface>

              <Surface className="p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e6f1f8] text-[#2d75a3]">
                    {theme === "light" ? <Sun size={17} /> : <Moon size={17} />}
                  </span>
                  <div>
                    <h3 className="text-[12px] font-bold text-slate-900">مظهر النظام</h3>
                    <p className="mt-1 text-[8px] font-medium text-slate-400">وضع نهاري مشرق أو ليلي ملوّن ومريح.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onToggleTheme}
                  className="mt-5 h-11 w-full rounded-xl bg-[#e6f1f8] text-[9px] font-bold text-[#2d75a3]"
                >
                  {theme === "light" ? "تفعيل الوضع الليلي" : "تفعيل الوضع النهاري"}
                </button>
              </Surface>

              <Surface className="p-5 md:col-span-2">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-sky-50 p-4">
                    <p className="text-[8px] font-medium text-sky-600">الجلسة الحالية</p>
                    <p className="mt-1 text-[10px] font-bold text-slate-800">{currentUser.email}</p>
                  </div>
                  <div className="rounded-2xl bg-emerald-50 p-4">
                    <p className="text-[8px] font-medium text-emerald-600">آخر نشاط</p>
                    <p className="mt-1 text-[10px] font-bold text-slate-800">{currentUser.lastActive}</p>
                  </div>
                  <div className="rounded-2xl bg-[#e6f1f8] p-4">
                    <p className="text-[8px] font-medium text-[#367fa9]">حالة الحساب</p>
                    <p className="mt-1 text-[10px] font-bold text-slate-800">{currentUser.status}</p>
                  </div>
                </div>
              </Surface>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function InvoiceCreateModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (draft: InvoiceDraft) => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const defaultDue = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const [draft, setDraft] = useState<InvoiceDraft>({
    customer: "",
    customerType: "company",
    category: "خدمات تقنية",
    issueDate: today,
    dueDate: defaultDue,
    notes: "",
    lines: [
      { id: "line-1", description: "", quantity: 1, unitPrice: 0 },
    ],
  });

  const total = draft.lines.reduce(
    (sum, line) => sum + line.quantity * line.unitPrice,
    0,
  );
  const canSave =
    draft.customer.trim().length > 1 &&
    draft.lines.some(
      (line) => line.description.trim() && line.quantity > 0 && line.unitPrice >= 0,
    ) &&
    total > 0;

  const updateLine = (
    id: string,
    field: keyof Omit<InvoiceLineDraft, "id">,
    value: string | number,
  ) => {
    setDraft((current) => ({
      ...current,
      lines: current.lines.map((line) =>
        line.id === id ? { ...line, [field]: value } : line,
      ),
    }));
  };

  const addLine = () => {
    setDraft((current) => ({
      ...current,
      lines: [
        ...current.lines,
        {
          id: `line-${Date.now()}`,
          description: "",
          quantity: 1,
          unitPrice: 0,
        },
      ],
    }));
  };

  const removeLine = (id: string) => {
    setDraft((current) => ({
      ...current,
      lines:
        current.lines.length === 1
          ? current.lines
          : current.lines.filter((line) => line.id !== id),
    }));
  };

  return (
    <div className="calm-add-backdrop px-2 py-2 sm:px-4 sm:py-4">
      <div className="calm-add-card invoice-create-card flex w-full flex-col">
        <div className="calm-add-header z-10 flex shrink-0 items-center justify-between border-b px-5 py-4 backdrop-blur-xl">
          <div>
            <h2 className="text-[15px] font-bold text-slate-900">إنشاء فاتورة جديدة</h2>
            <p className="mt-1 text-[8px] font-medium text-slate-400">أضيفي العميل والبنود ثم راجعي الإجمالي قبل الحفظ.</p>
          </div>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500"><X size={16} /></button>
        </div>

        <div className="invoice-create-scroll grid gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-5">
            <Surface className="p-5">
              <h3 className="text-[11px] font-bold text-slate-900">بيانات الفاتورة</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="اسم العميل" value={draft.customer} onChange={(value) => setDraft((current) => ({ ...current, customer: value }))} placeholder="اسم العميل أو الشركة" required />
                <label className="block"><span className="mb-2 block text-[8px] font-bold text-slate-600">نوع العميل</span><select value={draft.customerType} onChange={(event) => setDraft((current) => ({ ...current, customerType: event.target.value as CustomerType }))} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-[9px] font-medium text-slate-800 outline-none focus:border-sky-300 focus:bg-white"><option value="company">شركة</option><option value="individual">فرد</option></select></label>
                <Field label="التصنيف" value={draft.category} onChange={(value) => setDraft((current) => ({ ...current, category: value }))} placeholder="خدمات تقنية" required />
                <label className="block"><span className="mb-2 block text-[8px] font-bold text-slate-600">تاريخ الإصدار</span><input type="date" value={draft.issueDate} onChange={(event) => setDraft((current) => ({ ...current, issueDate: event.target.value }))} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-[9px] font-medium text-slate-800 outline-none focus:border-sky-300 focus:bg-white" /></label>
                <label className="block"><span className="mb-2 block text-[8px] font-bold text-slate-600">تاريخ الاستحقاق</span><input type="date" value={draft.dueDate} onChange={(event) => setDraft((current) => ({ ...current, dueDate: event.target.value }))} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-[9px] font-medium text-slate-800 outline-none focus:border-sky-300 focus:bg-white" /></label>
              </div>
            </Surface>

            <Surface className="overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h3 className="text-[11px] font-bold text-slate-900">بنود الفاتورة</h3><p className="mt-1 text-[8px] font-medium text-slate-400">أضيفي خدمة أو منتجًا واحدًا أو أكثر.</p></div><button type="button" onClick={addLine} className="inline-flex h-9 items-center gap-2 rounded-xl bg-slate-900 px-3 text-[8px] font-bold text-white"><Plus size={12} /> إضافة بند</button></div>
              <div className="space-y-3 p-5">
                {draft.lines.map((line, index) => (
                  <div key={line.id} className="grid gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3 lg:grid-cols-[minmax(180px,1fr)_82px_118px_105px_44px] lg:items-end">
                    <Field label={`وصف البند ${index + 1}`} value={line.description} onChange={(value) => updateLine(line.id, "description", value)} placeholder="اسم الخدمة أو المنتج" required />
                    <label className="block"><span className="mb-2 block text-[8px] font-bold text-slate-600">الكمية</span><input type="number" min={1} value={line.quantity} onChange={(event) => updateLine(line.id, "quantity", Number(event.target.value))} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-[9px] font-medium outline-none" /></label>
                    <label className="block"><span className="mb-2 block text-[8px] font-bold text-slate-600">سعر الوحدة</span><input type="number" min={0} value={line.unitPrice} onChange={(event) => updateLine(line.id, "unitPrice", Number(event.target.value))} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-[9px] font-medium outline-none" /></label>
                    <div><p className="mb-2 text-[8px] font-bold text-slate-600">الإجمالي</p><div className="flex h-11 items-center rounded-xl bg-white px-3 text-[9px] font-bold text-slate-800">{formatCurrency(line.quantity * line.unitPrice)}</div></div>
                    <button type="button" onClick={() => removeLine(line.id)} disabled={draft.lines.length === 1} className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-400 disabled:opacity-30"><X size={14} /></button>
                  </div>
                ))}
              </div>
            </Surface>

            <label className="block"><span className="mb-2 block text-[8px] font-bold text-slate-600">ملاحظات</span><textarea value={draft.notes} onChange={(event) => setDraft((current) => ({ ...current, notes: event.target.value }))} rows={3} placeholder="شروط الدفع أو أي ملاحظات إضافية..." className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[9px] font-medium text-slate-800 outline-none focus:border-sky-300 focus:bg-white" /></label>
          </div>

          <div className="space-y-4">
            <Surface className="p-5 lg:sticky lg:top-4">
              <p className="text-[8px] font-medium text-slate-400">ملخص الفاتورة</p>
              <p className="mt-2 text-[24px] font-bold text-slate-950">{formatCurrency(total)}</p>
              <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between text-[8px]"><span className="font-medium text-slate-500">عدد البنود</span><span className="font-bold text-slate-800">{draft.lines.length}</span></div>
                <div className="flex items-center justify-between text-[8px]"><span className="font-medium text-slate-500">الحالة</span><span className="rounded-full bg-[#e6f1f8] px-2.5 py-1 font-bold text-[#2d75a3]">مسودة</span></div>
                <div className="flex items-center justify-between text-[8px]"><span className="font-medium text-slate-500">الاستحقاق</span><span className="font-bold text-slate-800">{draft.dueDate}</span></div>
              </div>
              <button type="button" disabled={!canSave} onClick={() => onSave(draft)} className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 text-[9px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-35"><Check size={14} /> حفظ الفاتورة</button>
              <button type="button" onClick={onClose} className="mt-2 h-10 w-full rounded-xl border border-slate-200 text-[8px] font-bold text-slate-500">إلغاء</button>
            </Surface>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddCustomerModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (draft: AddCustomerDraft) => void;
}) {
  const [draft, setDraft] = useState<AddCustomerDraft>(emptyDraft);

  const setField = <K extends keyof AddCustomerDraft>(
    field: K,
    value: AddCustomerDraft[K],
  ) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const canSave =
    draft.name.trim() &&
    draft.phone.trim() &&
    draft.city.trim() &&
    (draft.type === "individual"
      ? draft.nationalId.trim()
      : draft.vatNumber.trim() && draft.commercialRegistration.trim());

  return (
    <div className="calm-add-backdrop px-4 py-6">
      <div className="calm-add-card max-h-[92vh] w-full max-w-3xl overflow-y-auto">
        <div className="calm-add-header sticky top-0 z-10 flex items-center justify-between border-b px-5 py-4 backdrop-blur">
          <div>
            <h2 className="text-base font-black text-slate-900">
              إضافة عميل جديد
            </h2>
            <p className="mt-1 text-[9px] font-semibold text-slate-400">
              اختاري نوع العميل ثم أكملي البيانات المناسبة.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500"
            aria-label="إغلاق"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setField("type", "individual")}
              className={`relative overflow-hidden rounded-[22px] border p-4 text-right transition ${
                draft.type === "individual"
                  ? "border-[#9CB5BF] bg-[#EDF3F5] ring-4 ring-[#DCE8EC]"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#236c83] text-white">
                  <User size={19} />
                </span>
                <div>
                  <p className="text-[12px] font-black text-slate-900">
                    عميل فرد
                  </p>
                  <p className="mt-1 text-[9px] font-semibold leading-5 text-slate-500">
                    بيانات شخصية، هوية، تواصل، وعنوان.
                  </p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setField("type", "company")}
              className={`relative overflow-hidden rounded-[22px] border p-4 text-right transition ${
                draft.type === "company"
                  ? "border-[#B2A8BE] bg-[#F2EFF5] ring-4 ring-[#E5DFEA]"
                  : "border-slate-200 bg-white"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#236c83] text-white">
                  <Building2 size={19} />
                </span>
                <div>
                  <p className="text-[12px] font-black text-slate-900">شركة</p>
                  <p className="mt-1 text-[9px] font-semibold leading-5 text-slate-500">
                    اسم الشركة، الضريبة، السجل، الموقع ومسؤول التواصل.
                  </p>
                </div>
              </div>
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field
              label={draft.type === "company" ? "اسم الشركة" : "اسم العميل"}
              value={draft.name}
              onChange={(value) => setField("name", value)}
              placeholder={
                draft.type === "company"
                  ? "مثال: شركة الأفق للمقاولات"
                  : "الاسم الثلاثي"
              }
              required
            />
            <Field
              label="رقم الجوال"
              value={draft.phone}
              onChange={(value) => setField("phone", value)}
              placeholder="+966 5X XXX XXXX"
              required
            />
            <Field
              label="البريد الإلكتروني"
              value={draft.email}
              onChange={(value) => setField("email", value)}
              placeholder="name@example.com"
            />
            <Field
              label="المدينة"
              value={draft.city}
              onChange={(value) => setField("city", value)}
              placeholder="الرياض"
              required
            />
            <div className="sm:col-span-2">
              <Field
                label="العنوان"
                value={draft.address}
                onChange={(value) => setField("address", value)}
                placeholder="الحي، الشارع، رقم المبنى"
              />
            </div>

            {draft.type === "individual" ? (
              <Field
                label="رقم الهوية"
                value={draft.nationalId}
                onChange={(value) => setField("nationalId", value)}
                placeholder="10 أرقام"
                required
              />
            ) : (
              <>
                <Field
                  label="الرقم الضريبي"
                  value={draft.vatNumber}
                  onChange={(value) => setField("vatNumber", value)}
                  placeholder="15 رقمًا"
                  required
                />
                <Field
                  label="السجل التجاري"
                  value={draft.commercialRegistration}
                  onChange={(value) =>
                    setField("commercialRegistration", value)
                  }
                  placeholder="رقم السجل التجاري"
                  required
                />
                <Field
                  label="مسؤول التواصل"
                  value={draft.contactPerson}
                  onChange={(value) => setField("contactPerson", value)}
                  placeholder="اسم الشخص المسؤول"
                />
                <Field
                  label="الموقع الإلكتروني"
                  value={draft.companyWebsite}
                  onChange={(value) => setField("companyWebsite", value)}
                  placeholder="www.company.sa"
                />
              </>
            )}
          </div>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="h-11 rounded-xl border border-slate-200 px-5 text-[10px] font-black text-slate-600"
            >
              إلغاء
            </button>
            <button
              type="button"
              disabled={!canSave}
              onClick={() => onSave(draft)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#237c82] px-6 text-[10px] font-black text-white shadow-[0_10px_25px_rgba(35,124,130,.18)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Check size={14} />
              حفظ وفتح ملف العميل
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-1 text-[9px] font-black text-slate-600">
        {label}
        {required && <span className="text-[#8E704E]">*</span>}
      </span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-[10px] font-semibold text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-[#9CB5BF] focus:bg-white focus:ring-4 focus:ring-[#DCE8EC]"
      />
    </label>
  );
}