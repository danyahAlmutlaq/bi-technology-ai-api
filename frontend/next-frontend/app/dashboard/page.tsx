"use client";
import QRCode from "qrcode";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import {
  createCustomer as createCustomerApi,
  deleteCustomer as deleteCustomerApi,
  getCustomers as getCustomersApi,
  type Customer as ApiCustomer,
} from "@/services/customers";
import {
  getPayments as getPaymentsApi,
  createPayment as createPaymentApi,
  type Payment as ApiPayment,
} from "@/services/payments";
import {
  getInvoices as getInvoicesApi,
  type Invoice as ApiInvoice,
} from "@/services/invoices";
import {
  createBooking as createBookingApi,
  updateBookingStatus as updateBookingStatusApi,
  type BookingStatus,
  getBookings as getBookingsApi,
  getCustomers as getBookingCustomersApi,
  type Booking as ApiBooking,
  type CreateBookingPayload as CreateBookingApiPayload,
  type CustomerOption,
} from "@/services/bookings";
import {
  getCustomers as getShipmentCustomersApi,
  getDeliveryCompanies as getDeliveryCompaniesApi,
  getShipments as getShipmentsApi,
  createShipment as createShipmentApi,
  updateShipment as updateShipmentApi,
  deleteShipment as deleteShipmentApi,
  updateDeliveryCompanyPricing as updateDeliveryCompanyPricingApi,
  type Shipment as ApiShipment,
  type CustomerOption as ShipmentCustomerOption,
  type DeliveryCompanyOption,
  type DeliveryCompanyPricingPayload,
} from "@/services/shipments";
import {
  getCustomers as getOrderCustomersApi,
  getOrders as getOrdersApi,
  createOrder as createOrderApi,
  advanceOrder as advanceOrderApi,
  toggleInvoiceReady as toggleInvoiceReadyApi,
  toggleShipmentReady as toggleShipmentReadyApi,
  deleteOrder as deleteOrderApi,
  type Order as ApiOrder,
  type CustomerOption as ApiOrderCustomerOption,
} from "@/services/orders";
import {
  getInventory as getInventoryApi,
  getCustomers as getInventoryCustomersApi,
  createInventoryItem as createInventoryItemApi,
  updateInventoryItem as updateInventoryItemApi,
  restockInventoryItem as restockInventoryItemApi,
  deleteInventoryItem as deleteInventoryItemApi,
  type InventoryItem as ApiInventoryItem,
  type CustomerOption as InventoryCustomerOption,
} from "@/services/inventory";
import {
  getWarehouses as getWarehousesApi,
  createWarehouse as createWarehouseApi,
  type Warehouse as WarehouseRecord,
} from "@/services/warehouses";
import {
  getCustoms as getCustomsApi,
  createCustoms as createCustomsApi,
  updateCustoms as updateCustomsApi,
  deleteCustoms as deleteCustomsApi,
  type CustomsRecord as ApiCustomsRecord,
  type CustomsStatus,
} from "@/services/customs";
import {
  getShipments as getCustomsShipmentsApi,
  type Shipment as CustomsShipmentOption,
} from "@/services/shipments";
import {
  getReceiving as getReceivingApi,
  createReceiving as createReceivingApi,
  recordArrival as recordArrivalApi,
  sendReceivingReceipt as sendReceivingReceiptApi,
  deleteReceiving as deleteReceivingApi,
  type ReceivingRecord as ApiReceivingRecord,
  type ReceivingStatus,
} from "@/services/receiving";
import {
  getDeliveryReceipts as getDeliveryReceiptsApi,
  createDeliveryReceipt as createDeliveryReceiptApi,
  updateDeliveryReceipt as updateDeliveryReceiptApi,
  deleteDeliveryReceipt as deleteDeliveryReceiptApi,
  type DeliveryReceiptRecord as ApiDeliveryReceiptRecord,
} from "@/services/deliveryReceipts";
import {
  getPicking as getPickingApi,
  createPicking as createPickingApi,
  startPicking as startPickingApi,
  reportMissing as reportMissingApi,
  packOrder as packOrderApi,
  deletePicking as deletePickingApi,
  sendToDelivery as sendToDeliveryApi,
  type PickingRecord as ApiPickingRecord,
  type PickingStatus,
} from "@/services/picking";
import {
  getOrders as getPickingOrdersApi,
  type Order as PickingOrderOption,
} from "@/services/orders";
import {
  getDispatchRoutes as getDispatchRoutesApi,
  createDispatchRoute as createDispatchRouteApi,
  updateDispatchRoute as updateDispatchRouteApi,
  addDispatchItem as addDispatchItemApi,
  scanDispatchItem as scanDispatchItemApi,
  closeDispatchRoute as closeDispatchRouteApi,
  deleteDispatchRoute as deleteDispatchRouteApi,
  type DispatchRoute as ApiDispatchRoute,
  type DispatchStatus,
} from "@/services/dispatch";
import {
  getVehicles as getVehiclesApi,
  createVehicle as createVehicleApi,
  type Vehicle as VehicleRecord,
} from "@/services/vehicles";
import {
  getDeliveries as getDeliveriesApi,
  createDelivery as createDeliveryApi,
  completeDelivery as completeDeliveryApi,
  failDelivery as failDeliveryApi,
  deleteDelivery as deleteDeliveryApi,
  type DeliveryRecord as ApiDeliveryRecord,
  type DeliveryStatus,
} from "@/services/delivery";
import {
  getReturns as getReturnsApi,
  createReturn as createReturnApi,
  resolveReturn as resolveReturnApi,
  deleteReturn as deleteReturnApi,
  type ReturnRecord as ApiReturnRecord,
  type ReturnStatus,
  type ReturnCondition,
  type ReturnOutcome,
} from "@/services/returns";
import {
  getPendingCash as getPendingCashApi,
  getSettlements as getSettlementsApi,
  createSettlement as createSettlementApi,
  confirmSettlement as confirmSettlementApi,
  type CashSettlementStatus,
} from "@/services/cash";
import {
  getPendingBilling as getPendingBillingApi,
  generateInvoice as generateInvoiceApi,
} from "@/services/billing";
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
  RotateCcw,
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
  Pencil,
  ChevronDown,
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


type ModuleKey =
  | "dashboard"
  | "customers"
  | "bookings"
  | "carriers"
  | "orders"
  | "invoices"
  | "payments"
  | "shipments"
  | "inventory"
  | "reports"
  | "ai"
  | "users"
  | "settings"
  | "customs"
  | "receiving"
  | "picking"
  | "dispatch"
  | "delivery"
  | "delivery-receipts"
  | "cash"
  | "returns"
  | "billing";

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

  "، لكن بيانات العرض ومركز العمليات يعملان بصورة طبيعية": "However, the display data and operations center are working normally",
  "آخر 6 أشهر": "Last 6 months",
  "آخر العمليات المرتبطة بالعميل": "Latest transactions related to the client",
  "أبريل": "April",
  "أجهزة الشبكات وصلت إلى الحد الأدنى": "Networking devices have reached a minimum",
  "أجهزة وملحقات مكتبية": "Office devices and accessories",
  "أحدث الأنشطة المرتبطة بهذا العميل": "Latest activity associated with this customer",
  "أحدث العمليات مرتبة كخط زمني مالي": "Latest transactions arranged as a financial timeline",
  "أحرف أو أرقام على الأقل": "At least letters or numbers",
  "أحرف على الأقل": "At least letters",
  "أحمد السالم": "Ahmed Al-Salem",
  "أخرى": "Other",
  "أداء التسليم والمالية هذا الشهر": "Delivery and financial performance this month",
  "أدخل بيانات حسابك للمتابعة": "Enter your account information to continue",
  "أدخلي المبلغ الفعلي اللي استلمتيه من السائق (المتوقع بالنظام": "Enter the actual amount you received from the driver (expected by the system).",
  "أدخلي نقطة الانطلاق والوجهة": "Enter your starting point and destination",
  "أرخص بـ": "Cheaper for",
  "أرشفة": "Archive",
  "أرشفة خط السير هذا؟": "Archive this itinerary?",
  "أرشفة هذا السجل؟": "Archive this record?",
  "أرقام": "numbers",
  "أرقام حقيقية من الباكند مباشرة": "Real numbers directly from the backend",
  "أسعار": "Prices",
  "أصناف منخفضة المخزون": "Low stock items",
  "أصناف وصلت أو اقتربت من الحد الأدنى": "Items have reached or are close to the minimum level",
  "أضيفي العميل والبنود ثم راجعي الإجمالي قبل الحفظ": "Add the customer and items, then review the total before saving",
  "أضيفي خدمة أو منتجًا واحدًا أو أكثر": "Add one or more services or products",
  "أعداد حقيقية ومباشرة من كل مرحلة تشغيلية": "Real and direct numbers from each operational stage",
  "أعلى الأرصدة المفتوحة": "Highest open balances",
  "أعلى بـ": "Top with",
  "أعيد للمخزون": "Back in stock",
  "أغسطس": "August",
  "أغسطس 2026": "August 2026",
  "أفضل العملاء": "Best customers",
  "أفضل العملاء إنفاقًا": "Best spending customers",
  "أفضل العملاء حسب الفوترة": "Best customers by billing",
  "أكبر الفواتير المفتوحة فعليًا، مرتبة حسب المبلغ": "The largest invoices actually open, sorted by amount",
  "أكبر بنود المصاريف": "The largest expense items",
  "أكتوبر": "October",
  "أنشئي حسابًا يمكن استخدامه مباشرة في شاشة الدخول": "Create an account that can be used directly on the login screen",
  "أهم المؤشرات والقرارات المطلوبة في صفحة واحدة": "The most important indicators and required decisions on one page",
  "أو أدخلي كود الصندوق يدويًا": "Or enter the box code manually",
  "أولويات ذكية اليوم": "Smart priorities today",
  "أولويات ومؤشرات محسوبة لحظيًا": "Priorities and indicators calculated in real time",
  "أي تفاصيل إضافية": "Any additional details",
  "أي ملاحظات إضافية": "Any additional comments",
  "أيام": "days",
  "إبلاغ نقص": "Report a shortage",
  "إتمام التغليف": "Complete the packaging",
  "إثبات التسليم": "Proof of delivery",
  "إجمالي إثباتات التسليم": "Total proof of delivery",
  "إجمالي الأصناف": "Total items",
  "إجمالي الحجوزات": "Total bookings",
  "إجمالي الخطوط": "Total lines",
  "إجمالي الرسوم": "Total fees",
  "إجمالي الشحنات": "Total shipments",
  "إجمالي الشحنات المسجلة": "Total registered shipments",
  "إجمالي الفواتير": "Total bills",
  "إجمالي المبلغ المفتوح": "Total open amount",
  "إجمالي المحصّل": "Total sum",
  "إجمالي المدفوع": "Total paid",
  "إجمالي المدفوعات": "Total payments",
  "إجمالي المصروفات المعتمدة": "Total approved expenses",
  "إجمالي المعاملات": "Total transactions",
  "إجمالي المفوتر": "Total billed",
  "إخفاء": "Hide",
  "إدارة أسعار شركات التوصيل": "Manage delivery company prices",
  "إدارة أعمالك تبدأ من هنا": "Managing your business starts from here",
  "إدارة إصدار الفواتير والتحصيل من شاشة مرتبة وواضحة، مع نموذج إنشاء فاتورة كامل": "Manage billing and collection from a clear, organized screen, with a complete invoice creation form",
  "إدارة الحجوزات من الاستلام حتى تحويلها لشحنة": "Managing reservations from receipt until transfer to shipment",
  "إرتكاز": "fulcrum",
  "إرجاع للعميل": "Return to customer",
  "إرجاع للمخزون": "Return to stock",
  "إرسال": "send",
  "إرسال الإيصال": "Submit the receipt",
  "إشعارات غير مقروءة": "Unread notifications",
  "إضافة إثبات تسليم": "Add proof of delivery",
  "إضافة الأصناف وتعديل الكميات والحدود وإدارة التوريد": "Adding items, modifying quantities and limits, and managing supply",
  "إضافة الإثبات": "Add proof",
  "إضافة الدفعة": "Add batch",
  "إضافة السجل": "Add record",
  "إضافة الشحنة": "Add shipment",
  "إضافة الصنف": "Add the category",
  "إضافة المعاملة": "Add transaction",
  "إضافة حجز جديد": "Add a new reservation",
  "إضافة دفعة": "Add batch",
  "إضافة دفعة جديدة": "Add a new batch",
  "إضافة شحنة": "Add shipment",
  "إضافة شحنة جديدة": "Add a new shipment",
  "إضافة صنف": "Add a category",
  "إضافة صنف جديد": "Add a new category",
  "إضافة طلب": "Add a request",
  "إضافة معاملة": "Add a transaction",
  "إضافة معاملة جمركية": "Add a customs transaction",
  "إعادة المحاولة": "Retry",
  "إلى": "to",
  "إلى (التسليم)": "to (delivery)",
  "إلى أقل من الحد الأدنى خلال 6 أيام": "to less than the minimum within 6 days",
  "إنشاء الحساب": "Create account",
  "إنشاء الشحنات وتعديل بيانات التتبع وتحديث مراحل التوصيل": "Create shipments, modify tracking data, and update delivery stages",
  "إنشاء دخول للعميل": "Create a customer login",
  "إنشاء فاتورة": "Create an invoice",
  "إنهاء التخليص": "End clearance",
  "ابحث باسم أو بريد أو دور": "Search by name, email or role",
  "ابحث باسم أو رقم أو مدينة": "Search by name, number or city",
  "ابحث برقم الفاتورة أو العميل": "Search by invoice or customer number",
  "ابحث عن عميل": "Find a client",
  "ابحث عن عميل، طلب، فاتورة أو شحنة": "Search for a customer, order, invoice or shipment",
  "ابحث في إرتكاز": "Search for fulcrum",
  "ابحث في الطلبات": "Search requests",
  "ابحث في الفواتير": "Search invoices",
  "ابحثي عن عميل": "Find a client",
  "اتجاه الإيرادات والتحصيل": "Revenue trend and collections",
  "اتصال آمن وحسابات محمية": "Secure connection and protected accounts",
  "اختاري التقرير بصريًا، شاهدي ملخصه التنفيذي، ثم حمليه أو شاركيه مباشرة من نفس المساحة": "Visually select the report, view its executive summary, then download or share it directly from the same space",
  "اختاري العميل": "Choose the client",
  "اختاري العميل لفتح ملفه الكامل": "Choose the client to open his full file",
  "اختاري العميل وأكملي بيانات الحجز": "Choose the customer and complete the reservation information",
  "اختاري شركة التوصيل": "Choose the delivery company",
  "اختاري عميلاً من القائمة": "Choose a client from the list",
  "اختاري عميلًا": "Choose a client",
  "اختاري نوع العميل ثم أكملي البيانات المناسبة": "Choose the customer type and then complete the appropriate data",
  "اختر التسليم": "Choose delivery",
  "اختر الشحنة": "Select shipment",
  "اختر الطلب": "Choose the order",
  "اختر العميل": "Select the client",
  "اختيار تلقائي (الأنسب سعرًا)": "Automatic selection (best price)",
  "اسألي إرتكاز عن الفواتير أو العملاء أو المخزون أو الشحن، واحصلي على إجابة مرتبطة ببيانات النظام وإجراءات واضحة": "Ask Ertikaz about invoices, customers, inventory, or shipping, and get an answer linked to system data and clear procedures",
  "استئناف التجهيز": "Resume processing",
  "استخدم كلمة مرور لا تقل عن 6 خانات": "Use a password of at least 6 characters",
  "استلام": "to receive",
  "استلم البضاعة": "Received the goods",
  "اسم الشركة، الضريبة، السجل، الموقع ومسؤول التواصل": "Company name, tax, register, location and contact person",
  "اسم الصنف": "Item name",
  "اسم المسؤول عن الطلب": "Name of the person responsible for the request",
  "اسم المستخدم": "user name",
  "اسم المستلم": "Recipient's name",
  "اسم المستودع الجديد": "Name of the new repository",
  "اسم من استلم البضاعة": "The name of the person who received the goods",
  "اشتراك سكني برو": "Residential Pro subscription",
  "اضضغطي على أي عميل لفتح ملفه الكامل": "Click on any client to open his full file",
  "اطبعي هذا الكود والصقيه على الصندوق ليُمسح عند الإرسال": "Print this code and stick it on the box to be erased upon sending",
  "اطلب": "Ask",
  "اكتبي سؤالك التشغيلي هنا": "Write your operational question here",
  "الأسعار الحقيقية لكل شركة، مع هامش الربح ومسؤولية التسليم": "Real prices for each company, with profit margin and delivery responsibility",
  "الأصناف الأقرب للتأثير على الطلبات": "Items most likely to influence orders",
  "الأصناف الحرجة، قيمة المخزون، وسرعة الدوران": "Critical items, inventory value, and turnover speed",
  "الأعلى": "Top",
  "الأعلى تعاملًا حسب إجمالي الفوترة الفعلي": "Highest transaction based on actual billing total",
  "الأعلى ربحًا": "Highest profit",
  "الأعلى هامش ربح": "Highest profit margin",
  "الأقل": "least",
  "الأقل سعرًا": "Lowest price",
  "الأكثر حركة": "Most mobile",
  "الإبلاغ عن نقص": "Report a shortage",
  "الإجماليات": "Totals",
  "الإدارة": "Management",
  "الإرسال": "Transmission",
  "الاتجاه الشهري": "Monthly trend",
  "الاجمالي": "Total",
  "الاستلام": "Receiving",
  "البريد": "mail",
  "البريد الإلكتروني أو رمز الدخول غير صحيح": "Invalid email or access code",
  "البريد الإلكتروني مستخدم في حساب آخر": "The email is in use on another account",
  "البريد مستخدم بالفعل": "Mail is already in use",
  "البنك": "Bank",
  "البيانات هنا تُستخدم لاحقًا لإنشاء الحجز والشحنة تلقائيًا": "The data here is later used to automatically create the booking and shipment",
  "التالي": "the next",
  "التبديل إلى": "Switch to",
  "التجهيز والتغليف": "Preparation and packaging",
  "التحصيل": "Collection",
  "التحصيل ممتاز": "The achievement is excellent",
  "التخليص والرسوم": "Clearance and fees",
  "التسليم": "Delivery",
  "التسليم الفاشل": "Failed delivery",
  "التفاصيل": "the details",
  "التكلفة": "Cost",
  "التواصل مع العميل لتأكيد بيانات الاشتراك": "Communicate with the customer to confirm subscription data",
  "التوصيات مرتبة حسب المجال والأثر ونسبة الثقة، مع إجراء مباشر لكل توصية": "Recommendations are arranged by scope, impact and confidence level, with a direct action for each recommendation",
  "الجدولة والمسؤول": "Scheduling and admin",
  "الجمارك": "Customs",
  "الجمع بين متابعة الرصيد وعرض خدمة إضافية قد يحسن قيمة العلاقة": "Combining balance tracking and offering an additional service may improve the value of the relationship",
  "الحجوزات": "Reservations",
  "الحد الأدنى": "minimum",
  "الحد الأدنى (تنبيه التوريد)": "Minimum (Supply Alert)",
  "الحد الأقصى للتخزين": "Maximum storage",
  "الخصم": "opponent",
  "الدخول إلى النظام": "Login to the system",
  "الدور الحالي": "Current role",
  "الربح": "Profit",
  "الربح المتوقع": "Expected profit",
  "الرجاء إدخال مبلغ صحيح": "Please enter a valid amount",
  "الرسوم الجمركية (ر.س)": "Customs duties (SAR)",
  "الرقم الضريبي يجب أن يكون 15 رقمًا ويبدأ وينتهي بالرقم 3": "The tax number must be 15 digits and begin and end with the number 3",
  "السائق": "The driver",
  "السجل التجاري يجب أن يكون 10 أرقام": "The commercial registration must be 10 numbers",
  "السرعة ليست العامل الوحيد؛ قارني التكلفة، التغطية، وخيار الاستلام من الموقع": "Speed ​​is not the only factor; Compare cost, coverage, and on-site pickup option",
  "الشحن الدولي": "International shipping",
  "الشحن المحلي": "Domestic shipping",
  "الشحن وشركة التوصيل": "Shipping and delivery company",
  "الشحنة": "Shipment",
  "الشهر الماضي": "last month",
  "الصندوق": "The box",
  "الصنف": "Class",
  "الضريبة": "Tax",
  "الطلب المرسل": "Sent request",
  "الطلب والعميل": "Demand and customer",
  "الطلبات على هذا الخط": "Orders on this line",
  "الطلبات وحالاتها وأولوياتها": "Requests, their statuses and priorities",
  "العربية": "Arabic",
  "العربية والإنجليزية مع تغيير اتجاه الصفحة": "Arabic and English with changing page orientation",
  "العملية والعميل والفاتورة المرتبطة": "The associated process, customer and invoice",
  "العميل (صاحب البضاعة)": "Customer (owner of the goods)",
  "العميل غير متواجد": "The client is not online",
  "العميل في مرحلة اعتماد العرض النهائي": "The client is in the final offer approval stage",
  "العميل يسدد عادة خلال 48 ساعة من إرسال تذكير مخصص مع ملخص مراحل المشروع": "The client usually pays within 48 hours of sending a personalized reminder with a summary of project milestones",
  "العنوان غير صحيح": "The address is incorrect",
  "الفئة والمستودع": "Category and repository",
  "الفواتير الصادرة": "Invoices issued",
  "الفواتير مرتبة حسب المرحلة الحالية": "Invoices are sorted by current stage",
  "الفواتير والتحصيل والمصروفات": "Billing, collections and expenses",
  "الفواتير والشحنات والمدفوعات بمكان واحد": "Invoices, shipments and payments in one place",
  "الفوترة": "Billing",
  "القصيم": "Al-Qassim",
  "القيمة الإجمالية": "Total value",
  "القيمة التقديرية للوحدة (ر.س)": "Estimated value of the unit (SAR)",
  "القيمة الحالية": "Current value",
  "القيمة حسب التصنيف": "Value by classification",
  "الكاش": "Cash",
  "الكمية الفعلية المستلمة": "Actual quantity received",
  "الكمية المتوفرة": "Quantity available",
  "الكمية المتوقعة": "Expected quantity",
  "المبلغ المحصّل نقداً (ر.س)": "Amount collected in cash (SAR)",
  "المبلغ المدفوع": "Amount paid",
  "المبلغ المستحق": "Amount due",
  "المبيعات": "Sales",
  "المتاح": "Available",
  "المتبقي على الفاتورة": "remaining on the bill",
  "المجموع الفرعي": "Subtotal",
  "المحصّل من الفاتورة": "Collected from the invoice",
  "المحصّل هذا الشهر": "Collection this month",
  "المخول بالتوقيع: أحمد السالم": "Authorized signatory: Ahmed Al-Salem",
  "المرتجعات": "Returns",
  "المركبة": "The vehicle",
  "المستخدم": "user",
  "المستودع": "warehouse",
  "المصروفات": "Expenses",
  "المصروفات هذا الشهر": "Expenses this month",
  "الهاتف": "Phone",
  "الوجهة": "Destination",
  "الوجهة النهائية": "final destination",
  "الوزن الإجمالي": "Gross weight",
  "الوزن الإجمالي (كجم)": "Gross weight (kg)",
  "امسحي الرمز للتحقق": "Scan the code to verify",
  "انتقلت الشحنة إلى مرحلة في الطريق": "The shipment has moved to a stage en route",
  "انتهاء المهلة المجانية": "Free time limit expires",
  "بإثبات صورة": "With photo proof",
  "باقي": "rest",
  "بالانتظار": "Waiting",
  "بالطريق للعميل": "On the way to the customer",
  "بانتظار اعتماد نطاق العمل والدفعة الأولى": "Waiting for the scope of work and the first payment to be approved",
  "بانتظار الإجراءات": "Waiting for procedures",
  "بانتظار الاستلام": "Waiting for receipt",
  "بانتظار التجهيز": "Waiting for preparation",
  "بانتظار التسوية": "Waiting for settlement",
  "بانتظار الفوترة": "Waiting for billing",
  "بانتظار المعالجة": "Waiting for processing",
  "بانتظار مسح": "Waiting for a scan",
  "بحاجة توريد": "Need supply",
  "بحاجة توريد فوري": "Need immediate supply",
  "بحاجة متابعة": "Need follow up",
  "بحاجة متابعة تحصيل": "Need follow up collection",
  "بدء التجهيز": "Start processing",
  "بدء التخليص": "Start clearance",
  "بدء التسليم": "Start delivery",
  "بدء تجهيز طلب": "Start processing a request",
  "بدء تسليم": "Start delivery",
  "بدء تسليم جديد": "Start a new delivery",
  "بداية العملية": "The beginning of the process",
  "بدل الأسماء المتراصة، تظهر العلاقات كبطاقات ذكية تلخص القيمة، الحالة، الفواتير، والشحنات قبل الدخول إلى الملف التفصيلي": "Instead of names, relationships appear as smart cards that summarize value, status, invoices, and shipments before entering the detailed file.",
  "بدل جدول أصناف جامد، تعرض إرتكاز كل صنف كنبض: مستوى الامتلاء، الحد الأدنى، حركة الصرف، وقيمة المخزون": "Instead of a rigid item table, it displays the basis of each item as a pulse: fullness level, minimum, exchange movement, and inventory value.",
  "بدون رقم تتبع": "Without tracking number",
  "بدون سائق محدد": "No specific driver",
  "بدون صورة": "Without a picture",
  "بدون صورة إثبات": "Without photo proof",
  "بدون فاتورة منذ 45 يومًا فأكثر": "No invoice for 45 days or more",
  "بدون مركبة محددة": "No specific vehicle",
  "بدون مسؤول تواصل": "Without a contact person",
  "بدون نشاط لفترة طويلة": "Inactive for a long time",
  "بضاعة العملاء المخزّنة لديك": "Customer merchandise you have in stock",
  "بمعدل الصرف الحالي، سيصل الصنف": "At the current exchange rate, the item will arrive",
  "بند": "item",
  "بنود معلّقة": "Pending items",
  "بوابة العملاء": "Customer portal",
  "بيانات التواصل والبيانات النظامية": "Communication data and regulatory data",
  "بيانات الحساب والصلاحيات": "Account information and permissions",
  "بيانات الدخول": "Login data",
  "بيانات الفاتورة والعميل": "Invoice and customer data",
  "بيانات شخصية، هوية، تواصل، وعنوان": "Personal data, identity, contact, and address",
  "بياناتك وصلاحياتك محفوظة ضمن حساب المستخدم": "Your data and permissions are stored within the user account",
  "تأكدي إن كل الصناديق انمسحت": "Make sure all boxes are cleared",
  "تأكدي من إعطاء الإذن للمتصفح، أو أدخلي الكاميرا يدويًا": "Make sure to give permission to the browser, or enter the camera manually",
  "تأكيد": "to be sure",
  "تأكيد الإبلاغ عن النقص": "Confirm deficiency reporting",
  "تأكيد الاستلام": "Confirm receipt",
  "تأكيد التحويل": "Confirm the transfer",
  "تأكيد التسليم": "Delivery confirmation",
  "تأكيد المعالجة": "Confirm processing",
  "تأكيد فشل التسليم": "Confirm delivery failure",
  "تأكيد كلمة المرور غير مطابق": "Confirm password does not match",
  "تأكيد وإنشاء الحجز": "Confirm and create your reservation",
  "تابعي كل حركة مالية كمسار واضح: مصدرها، الفاتورة المرتبطة بها، حالتها، وما يحتاج اعتمادًا منك": "Follow every financial transaction as a clear path: its source, the invoice associated with it, its status, and what requires your approval",
  "تاريخ الإرسال": "Posting date",
  "تاريخ الإنشاء": "Creation date",
  "تاريخ الاستلام": "Date of receipt",
  "تاريخ الانضمام": "Joining date",
  "تاريخ التسليم المتوقع": "Expected delivery date",
  "تاريخ الدفعة": "Payment date",
  "تالفة": "Damaged",
  "تجميع الاحتياج يقلل تكلفة الشحن ويمنع توقف الطلبات": "Assembling requirements reduces shipping costs and prevents interruption of orders",
  "تجميع الطلبات المعبأة بخطوط سير، وتعيين السائق والمركبة، ومسح كل صندوق قبل الإرسال": "Assemble packaged orders with itineraries, assign driver and vehicle, and scan each box before dispatch",
  "تجميع تلقائي للمستحقات من الطلبات والشحن والجمارك، وإصدار فاتورة واحدة لكل عميل": "Automatic collection of receivables from orders, shipping, and customs, and issuing one invoice to each customer",
  "تجميع تلقائي وإصدار الفواتير": "Automated collection and invoicing",
  "تجهيز": "to equip",
  "تجهيز الطلب للشحن": "Preparing the order for shipping",
  "تجهيز الطلبات من المخزون وتغليفها وتوليد رقم التسليم": "Preparing orders from stock, packaging them, and generating the delivery number",
  "تجهيز الطلبات وتعبئتها": "Preparing and packing orders",
  "تحتاج توريد": "Need supply",
  "تحتاج متابعة تحصيل": "You need to follow up on collection",
  "تحديث": "to update",
  "تحديث البيانات": "Data update",
  "تحديث شحنة": "Shipment update",
  "تحديد الكل كمقروء": "Mark all as read",
  "تحقق من الاتصال بالخادم": "Check the connection to the server",
  "تحققي من الاسم والبريد الإلكتروني": "Verify name and email",
  "تحليل تلقائي حي لبيانات النظام الفعلية": "Automated live analysis of actual system data",
  "تحليل حي لبيانات النظام الفعلية": "Live analysis of actual system data",
  "تحليل فوري لبيانات العرض الحالية": "Real-time analysis of current display data",
  "تحميل": "download",
  "تحويل الحجز إلى شحنة": "Convert your reservation into a shipment",
  "تحويل لشحنة": "Transfer to shipment",
  "تحوّل لشحنة": "Convert to shipment",
  "تدفق مالي واضح يربط كل دفعة بعميلها وفاتورتها وحالة اعتمادها": "A clear financial flow links each payment to its customer, invoice and approval status",
  "ترويسة الفاتورة": "Invoice header",
  "تسجيل استلام البضاعة": "Recording the receipt of the goods",
  "تسجيل الاستلام": "Record receipt",
  "تسجيل الدفعات الحقيقية وربطها بالفواتير المفتوحة": "Record real payments and link them to open invoices",
  "تسجيل السداد الكامل": "Record full payment",
  "تسجيل المرتجع": "Register the return",
  "تسجيل فشل التسليم": "Log delivery failure",
  "تسجيل مرتجع": "Returned recording",
  "تسجيل مرتجع جديد": "Register a new return",
  "تسليم": "delivery",
  "تسليم الطلبات الخارجة للعملاء، توثيق الاستلام، وتحصيل النقد عند التسليم": "Delivering outgoing orders to customers, documenting receipt, and collecting cash on delivery",
  "تسليم العميل وتحصيل النقد": "Customer delivery and cash collection",
  "تسويات معلّقة": "Pending settlements",
  "تسوية": "settlement",
  "تسوية المبالغ النقدية المحصّلة من العملاء عند التسليم مع كل سائق": "Settle the cash amounts collected from customers upon delivery with each driver",
  "تسوية النقد المحصّل عند التسليم": "Settlement of cash collected on delivery",
  "تسوية كامل المبلغ": "Settle the full amount",
  "تشغيل الكاميرا": "Turn on the camera",
  "تصنيفات العملاء": "Customer ratings",
  "تعديل": "amendment",
  "تعديل الأسعار": "Price adjustment",
  "تعديل الإثبات": "Modify the proof",
  "تعديل الصنف": "Modify the category",
  "تعديل المعاملة": "Modify the transaction",
  "تعذر أرشفة السجل": "The log could not be archived",
  "تعذر أرشفة خط السير": "The itinerary could not be archived",
  "تعذر إتمام التغليف": "Unable to complete packaging",
  "تعذر إرسال الإيصال": "The receipt could not be sent",
  "تعذر إصدار الفاتورة": "The invoice could not be issued",
  "تعذر إضافة الحجز": "Unable to add reservation",
  "تعذر إضافة الدفعة": "The payment could not be added",
  "تعذر إضافة الشحنة": "Unable to add shipment",
  "تعذر إضافة الطلب لخط السير": "The request could not be added to the route",
  "تعذر إضافة العميل": "Unable to add customer",
  "تعذر إضافة المركبة": "Unable to add vehicle",
  "تعذر إضافة المستودع": "Unable to add repository",
  "تعذر إضافة سجل الاستلام": "Unable to add receipt record",
  "تعذر إضافة سجل التجهيز": "Unable to add processing record",
  "تعذر إنشاء التسوية": "The settlement could not be created",
  "تعذر إنشاء الحجز": "The reservation could not be created",
  "تعذر إنشاء الحساب": "The account could not be created",
  "تعذر إنشاء الطلب": "The request could not be created",
  "تعذر إنشاء المستخدم": "Unable to create user",
  "تعذر إنشاء خط السير": "Unable to create route",
  "تعذر الاتصال بالخادم": "Unable to connect to the server",
  "تعذر الاتصال بالخادم. تأكدي أن الباكند شغّال": "Unable to connect to the server. Make sure the backend is on",
  "تعذر بدء التجهيز": "Unable to start processing",
  "تعذر بدء التسليم": "Unable to start delivery",
  "تعذر تأكيد التسوية": "The settlement could not be confirmed",
  "تعذر تجهيز الشحنة": "The shipment could not be processed",
  "تعذر تحديث الشحنة": "Unable to update shipment",
  "تعذر تحديث بعض بيانات الـ": "Unable to update some data",
  "تعذر تحديث حالة الحجز": "Unable to update reservation status",
  "تعذر تحديث حالة الشحنة": "Unable to update shipment status",
  "تعذر تحديث حالة الطلب": "Unable to update order status",
  "تعذر تحديث حالة الفاتورة": "Unable to update invoice status",
  "تعذر تحديث حالة المعاملة": "Unable to update transaction status",
  "تعذر تحميل إثباتات التسليم": "Unable to upload proofs of delivery",
  "تعذر تحميل الاستخبارات التشغيلية": "Unable to load operational intelligence",
  "تعذر تحميل البيانات": "Unable to load data",
  "تعذر تحميل التقارير": "Unable to load reports",
  "تعذر تحميل الحجوزات": "Unable to load reservations",
  "تعذر تحميل الشحنات": "Unable to load shipments",
  "تعذر تحميل الطلبات": "Unable to load orders",
  "تعذر تحميل الفاتورة": "Unable to download invoice",
  "تعذر تحميل الفواتير": "Unable to download invoices",
  "تعذر تحميل الفواتير الصادرة": "Unable to download issued invoices",
  "تعذر تحميل المخزون": "Unable to load inventory",
  "تعذر تحميل المدفوعات": "Payments could not be uploaded",
  "تعذر تحميل بيانات الإرسال": "Unable to load transmission data",
  "تعذر تحميل بيانات الاستلام": "Unable to load receipt data",
  "تعذر تحميل بيانات التجهيز": "Unable to load staging data",
  "تعذر تحميل بيانات التسليم": "Unable to load delivery data",
  "تعذر تحميل بيانات الجمارك": "Unable to download customs data",
  "تعذر تحميل بيانات الكاش": "Unable to load cache data",
  "تعذر تحميل بيانات المرتجعات": "Unable to load returns data",
  "تعذر تحميل شركات التوصيل": "Unable to download delivery companies",
  "تعذر تحميل قائمة العملاء": "Unable to load customer list",
  "تعذر تحميل مستحقات الفوترة": "Billing receivables could not be uploaded",
  "تعذر تسجيل الاستلام": "Unable to register receipt",
  "تعذر تسجيل التسليم": "The delivery could not be registered",
  "تعذر تسجيل المرتجع": "The return could not be registered",
  "تعذر تسجيل النقص": "The deficiency could not be recorded",
  "تعذر تسجيل فشل التسليم": "Unable to log delivery failure",
  "تعذر تشغيل الكاميرا": "The camera could not be turned on",
  "تعذر توريد الصنف": "The item could not be supplied",
  "تعذر حذف الشحنة": "The shipment could not be deleted",
  "تعذر حذف الصنف": "The item could not be deleted",
  "تعذر حذف الطلب": "The request could not be deleted",
  "تعذر حذف العميل": "Unable to delete client",
  "تعذر حذف المعاملة": "The transaction could not be deleted",
  "تعذر حفظ إثبات التسليم": "Proof of delivery could not be saved",
  "تعذر حفظ الأسعار": "Unable to save prices",
  "تعذر حفظ الصنف": "The item could not be saved",
  "تعذر حفظ معاملة الجمارك": "The customs transaction could not be saved",
  "تعذر قفل خط السير": "The route could not be locked",
  "تعذر مسح الصندوق": "The box could not be cleared",
  "تعذر معالجة المرتجع": "The return could not be processed",
  "تغيير الحالة": "Change status",
  "تغيير المظهر": "Change appearance",
  "تفاصيل إضافية عن الطلب": "Additional details about the request",
  "تفضل التواصل عبر واتساب بعد الساعة 4 مساءً": "Please contact us via WhatsApp after 4pm",
  "تفعيل الوضع الليلي": "Activate night mode",
  "تفعيل الوضع النهاري": "Activate day mode",
  "تقارير حية محسوبة لحظيًا من بيانات النظام الفعلية": "Live reports calculated in real time from actual system data",
  "تقارير حية محسوبة من بيانات النظام الفعلية": "Live reports calculated from actual system data",
  "تقارير منظمة حسب المجال مع ملخص تنفيذي، حالة التحديث، وصيغة التصدير": "Reports organized by field with executive summary, update status, and export format",
  "تقرير": "a report",
  "تكلفة الشحن": "Shipping cost",
  "تكلفة الشحن (اختياري)": "Shipping cost (optional)",
  "تم إرسال الإيصال للعميل": "The receipt has been sent to the customer",
  "تم إصدار الفاتورة": "The invoice has been issued",
  "تم إنشاء حساب الدخول": "Login account has been created",
  "تم إنشاء فاتورة خدمات": "A utility invoice has been created",
  "تم إنشاء فاتورة خدمات جديدة": "A new utility invoice has been created",
  "تم إنشاء ملف العميل حديثًا": "The client file has been newly created",
  "تم استلام شحنة شركة الأفق من الناقل": "The Horizon Company shipment has been received from the carrier",
  "تم الإرسال": "Sent",
  "تم التخليص": "Cleared",
  "تم التسليم وإغلاق الطلب بنجاح": "The order was delivered and closed successfully",
  "تم الحفظ": "Saved",
  "تم المسح": "Scanned",
  "تم تجهيز جميع القطع والتحقق من العنوان": "All lots fitted and title verified",
  "تم تحديث إعدادات المستخدم": "User settings have been updated",
  "تم تحديث مرحلة التوصيل": "The delivery stage has been updated",
  "تم تسليمه للمحاسبة": "He was handed over to accounting",
  "تم تسليمها": "It was delivered",
  "تم تغيير كلمة المرور بنجاح": "The password has been changed successfully",
  "تم حفظ بيانات الحساب بنجاح": "Account data has been saved successfully",
  "تم ربط الدفعة بآخر فاتورة": "The payment is linked to the most recent invoice",
  "تم ربط الدفعة بالفاتورة الأخيرة": "The payment is linked to the last invoice",
  "تم رفع المرجع البنكي لدفعة بقيمة 18,500 ر.س": "The bank reference has been raised for a payment of 18,500 SAR",
  "تمت المعالجة": "Processed",
  "تنبيه مخزون": "Stock alert",
  "تنبيهات": "Alerts",
  "تنبيهات إضافية اختيارية": "Optional additional alerts",
  "تنفيذ التوصيات الأعلى أثرًا أولًا يعطي نتيجة أسرع على التشغيل والتدفق النقدي": "Implementing the highest-impact recommendations first yields a faster operating and cash flow result",
  "توثيق استلام العميل": "Documenting customer receipt",
  "توثيق استلام العميل للبضاعة باسم المستلم وصورة الإثبات": "Documenting the customer’s receipt of the goods with the recipient’s name and a copy of proof",
  "توجد فرص متابعة مالية وبيع إضافي يمكن تنفيذها من ملفات العملاء مباشرة": "There are financial follow-up and upsell opportunities that can be implemented directly from client files",
  "توريد وربط أجهزة الشبكة": "Supply and connect network devices",
  "توزيع العملاء": "Customer distribution",
  "توزيع القيمة حسب قناة الدفع": "Distribution of value according to payment channel",
  "توزيع حالات الطلبات": "Distribution of order statuses",
  "جاري إعداد التقارير": "Reports are being prepared",
  "جاري التجهيز": "Preparing",
  "جاري التحميل": "Loading",
  "جاري الحفظ": "Saving",
  "جاري تحليل البيانات": "Data analysis is underway",
  "جاري تحميل إثباتات التسليم": "Loading proofs of delivery",
  "جاري تحميل التنبيهات": "Loading alerts",
  "جاري تحميل الحجوزات": "Loading reservations",
  "جاري تحميل الشحنات": "Loading shipments",
  "جاري تحميل الطلبات": "Loading orders",
  "جاري تحميل الفاتورة": "Loading invoice",
  "جاري تحميل الفواتير": "Loading invoices",
  "جاري تحميل المخزون": "Loading inventory",
  "جاري تحميل المدفوعات": "Loading payments",
  "جاري تحميل بيانات الإرسال": "Loading transmission data",
  "جاري تحميل بيانات الاستلام": "Loading receipt data",
  "جاري تحميل بيانات التجهيز": "Loading processing data",
  "جاري تحميل بيانات التسليم": "Loading delivery data",
  "جاري تحميل بيانات الجمارك": "Loading customs data",
  "جاري تحميل بيانات الكاش": "Loading cache data",
  "جاري تحميل بيانات المرتجعات": "Loading returns data",
  "جاري تحميل قائمة العملاء": "Loading customer list",
  "جاري تحميل مستحقات الفوترة": "Loading billing dues",
  "جاهز للإرسال": "Ready to send",
  "جاهز للشحن": "Ready to ship",
  "جدول البنود": "Table of items",
  "جمارك": "customs",
  "جميع الحقوق محفوظة": "All rights reserved",
  "حالات متعددة": "Multiple cases",
  "حالة البضاعة": "Condition of the goods",
  "حالة الدفع": "Payment status",
  "حالة تالفة": "Damaged condition",
  "حجر جانبي": "Side stone",
  "حجز جديد": "New reservation",
  "حجوزات": "Reservations",
  "حجوزات اليوم": "Reservations today",
  "حجوزات متأخرة تحتاج متابعة عاجلة اليوم": "Late reservations require urgent follow-up today",
  "حجوزات مجدولة اليوم": "Reservations scheduled today",
  "حدث خطأ غير متوقع": "An unexpected error occurred",
  "حدّث بياناتك الأساسية المستخدمة داخل إرتكاز": "Update your basic data used within Ertekaz",
  "حذف": "delete",
  "حذف الطلب": "Delete the request",
  "حذف العميل": "Delete client",
  "حذف الفاتورة": "Delete invoice",
  "حذف المستخدم": "Delete user",
  "حذف هذا الصنف؟": "Delete this item?",
  "حذف هذا الطلب؟": "Delete this request?",
  "حذف هذا الطلب؟ لا يمكن التراجع": "Delete this request? It cannot be undone",
  "حذف هذا المستخدم؟": "Delete this user?",
  "حذف هذه الشحنة؟": "Delete this shipment?",
  "حذف هذه الفاتورة؟": "Delete this invoice?",
  "حذف هذه المعاملة؟": "Delete this transaction?",
  "حسابات متوقفة": "Suspended accounts",
  "حسب الأولوية": "According to priority",
  "حسب الحالة": "Depending on the situation",
  "حسب المستودع": "According to the warehouse",
  "حفظ": "save",
  "حفظ الأسعار": "Save prices",
  "حفظ الحجز": "Save your reservation",
  "حفظ رمز الدخول الجديد": "Save the new access code",
  "خالد محمد": "Khaled Muhammad",
  "خدمة دعم وتشغيل سنوية": "Annual support and operation service",
  "خرجت للتسليم": "I went out for delivery",
  "خريطة صحة توضح الأصناف الحرجة، قيمة المخزون، وأولوية التوريد قبل أن تتأثر الطلبات": "A health map showing critical items, inventory value, and supply priority before orders are affected",
  "خصم": "rival",
  "خط سير جديد": "New itinerary",
  "خطر رسوم تأخير إضافية": "Risk of additional late fees",
  "خطوط السير والشحن": "Routes and shipping",
  "دانية": "Dania",
  "دفع عند الاستلام": "Payment upon receipt",
  "دفعات مسجلة": "Recorded payments",
  "دفعة": "batch",
  "دفعة جاهزة للمراجعة": "Batch ready for review",
  "دقائق": "minutes",
  "دولي": "international",
  "ديسمبر": "December",
  "ديسمبر)": "December)",
  "ر.س": "Rs",
  "رابط صورة الإثبات (اختياري)": "Proof image link (optional)",
  "راجعي الحالة والمبلغ والاستحقاق من قائمة واحدة": "Check status, amount and eligibility from one list",
  "راجعي الرصيد المفتوح والملاحظات قبل الاتصال": "Review the open balance and notes before calling",
  "رتبي العملاء حسب النوع وافتحي الملف الكامل بنقرة واحدة": "Sort clients by type and open the full file with one click",
  "رسوم الموانئ (ر.س)": "Port fees (SAR)",
  "رف 12": "Rack 12",
  "رفض الاستلام": "Refused to receive",
  "رقم التتبع (اختياري)": "Tracking number (optional)",
  "رقم التسليم": "Delivery number",
  "رقم الجوال غير صحيح. مثال: 0512345678": "Mobile number is incorrect. Example: 0512345678",
  "رقم الحساب البنكي": "Bank account number",
  "رقم الدفعة (اختياري)": "Batch number (optional)",
  "رقم الفاتورة": "Invoice number",
  "رقم الهاتف": "phone number",
  "رقم الهوية يجب أن يكون 10 أرقام ويبدأ بـ 1 أو 2": "The ID number must be 10 digits and start with 1 or 2",
  "رقم لوحة المركبة الجديدة": "New vehicle plate number",
  "رقمًا": "Number",
  "ركزي على الفواتير المتأخرة والجزئية لرفع التدفق النقدي": "Focus on late and partial invoices to increase cash flow",
  "رمز الخطأ": "Error code",
  "ريم عبدالله": "Reem Abdullah",
  "سائقين لديهم كاش": "Drivers have cash",
  "سارة خالد": "Sarah Khaled",
  "سارة محمد العتيبي": "Sarah Mohammed Al-Otaibi",
  "ساعات": "hours",
  "سبب الفشل": "Cause of failure",
  "سبب النقص": "Cause of shortage",
  "سبتمبر": "September",
  "ستظهر البيانات هنا بمجرد إضافتها": "The data will appear here once it is added",
  "سجل استلام": "Record receipt",
  "سجل استلام جديد": "New receipt record",
  "سجل التسويات": "Registry of settlements",
  "سجلات": "records",
  "سعر البيع": "selling price",
  "سعر البيع (الإجمالي)": "Selling price (total)",
  "سعر التكلفة": "Cost price",
  "سعر مقترح حسب النوع، يمكنك تعديله يدويًا": "Suggested price by type, you can edit it manually",
  "سلوك الطلبات يشير إلى احتياج محتمل لخدمة الدعم الممتد وربط التقارير": "Request behavior indicates a potential need for extended support service and reporting connectivity",
  "سليمة": "Intact",
  "شاهدي نسبة التحصيل داخل كل فاتورة، افتحي التفاصيل، وسجلي السداد من نفس المساحة بدون الانتقال بين صفحات متعددة": "View the collection percentage within each invoice, open the details, and record payment from the same space without moving between multiple pages",
  "شحن محلي": "Local shipping",
  "شحنات تم تسليمها": "Shipments delivered",
  "شحنة": "shipment",
  "شركات": "Companies",
  "شركات التوصيل المعتمدة": "Accredited delivery companies",
  "شركات مستخدمة": "Companies used",
  "شركة الأفق للمقاولات": "Horizon Contracting Company",
  "شركة رؤية الأعمال": "Business Vision Company",
  "شركة مدار التقنية": "Madar Technology Company",
  "شروط الدفع أو أي ملاحظات إضافية": "Payment terms or any additional notes",
  "صافي هذا الشهر": "Net this month",
  "صالحة للبيع مجدداً": "Available for sale again",
  "صباح الخير،": "Good morning,",
  "صلاحيات مختلفة": "Different powers",
  "صندوق": "fund",
  "صنف": "Classify",
  "صورة متكاملة للعملاء بدل القوائم التقليدية: القيمة، النشاط، الرصيد المستحق، ونقطة التواصل التالية في مساحة واحدة": "An integrated picture of customers instead of traditional lists: value, activity, balance due, and next touchpoint in one space",
  "ضريبة": "tax",
  "ضريبة القيمة المضافة": "Value added tax",
  "ضريبة القيمة المضافة (ر.س)": "Value Added Tax (SAR)",
  "طباعة / تحميل": "Print/Download",
  "طرد": "eviction",
  "طرق الدفع": "Payment methods",
  "طلب": "to request",
  "طلبات": "Requests",
  "طلبات التسليم هذا الشهر": "Delivery orders this month",
  "طلبات مكتملة": "Completed requests",
  "طلبات وشحنات وجمارك": "Orders, shipments and customs",
  "عادية": "Normal",
  "عالية": "High",
  "عام": "general",
  "عبدالله ناصر الحربي": "Abdullah Nasser Al-Harbi",
  "عدد الطرود": "Number of parcels",
  "عدد الطرود (اختياري)": "Number of parcels (optional)",
  "عدد الفواتير المتأخرة": "Number of overdue invoices",
  "عربي": "Arab",
  "عرض": "an offer",
  "عرض / طباعة": "View/Print",
  "عملاء بحاجة متابعة": "Clients need follow up",
  "عملاء جدد هذا الشهر": "New clients this month",
  "عملاء غير نشطين": "Inactive clients",
  "عملاء لديهم مستحقات": "Clients with receivables",
  "عملاء نشطون": "Active clients",
  "عملية": "practical",
  "عميل": "client",
  "عميل غير محدد": "Unspecified client",
  "عميل متكرر ومنتظم في السداد": "A repeat customer who pays regularly",
  "عميل)": "client)",
  "عن الشهر الماضي": "About last month",
  "عندك": "you have",
  "غير صالحة للبيع": "Not valid for sale",
  "غير مدفوع": "unpaid",
  "غير مسجلة": "Not registered",
  "غير مسددة بالكامل": "Not paid in full",
  "فاتورة": "invoice",
  "فاتورة الى": "Invoice to",
  "فاتورة تجاوزت موعد الاستحقاق": "An invoice is past due",
  "فاتورة تحتاج متابعة": "An invoice needs follow-up",
  "فاتورة خدمات": "Utility bill",
  "فاتورة ضريبية": "Tax invoice",
  "فاتورة عمليات لوجستية": "Logistics invoice",
  "فاتورة غير مسددة": "Unpaid invoice",
  "فاتورة مؤسسة رواد الأعمال تحتاج متابعة اليوم": "The Entrepreneurs Foundation bill needs to be followed up today",
  "فبراير": "February",
  "فتح التقرير": "Open the report",
  "فتح ملف العميل يعطيك الفواتير والمدفوعات والملاحظات قبل التواصل": "Opening a client file gives you invoices, payments and notes before communicating",
  "فحص البضاعة الواردة ومطابقة الكميات وتسجيل التلف قبل التخزين": "Inspecting incoming goods, matching quantities, and recording damage before storage",
  "فحص واستلام البضاعة": "Inspecting and receiving the goods",
  "فرق بالكمية": "Difference in quantity",
  "فشل التسليم": "Delivery failed",
  "فعلي": "actual",
  "فعّل أو أوقف الأقسام المتاحة لهذا المستخدم": "Activate or disable the sections available to this user",
  "فواتير": "Bills",
  "فواتير تحتاج متابعة": "Bills need follow up",
  "فواتير متأخرة ومخزون منخفض وعملاء غير نشطين": "Late invoices, low inventory, and inactive customers",
  "فواتير مسددة بالكامل": "Invoices paid in full",
  "قارني بين السعر الداخلي والدولي، وحددي لكل شركة هل ستسلمين الشحنة للفرع أو تطلبين استلامها من موقعك": "Compare the domestic and international price, and determine for each company whether you will deliver the shipment to the branch or request to receive it from your location.",
  "قراءة سريعة لصحة الفواتير": "Quick read of invoice validity",
  "قراءة سريعة للتوزيع والسرعة": "Fast reading distribution and speed",
  "قراءة شاملة للإيرادات، الدفعات، والفواتير المتأخرة": "Comprehensive reading of revenues, payments, and late invoices",
  "قراءة مركزية للمجالات التي تحتاج انتباهك": "Central reading of the areas that need your attention",
  "قفل وإرسال": "Lock and send",
  "قيد الانتظار": "On hold",
  "قيد التخليص": "Under clearance",
  "قيد التوصيل": "Under delivery",
  "قيد العمل": "In progress",
  "قيمة العملاء، تكرار الطلبات، وفرص البيع الإضافي": "Customer value, repeat orders, and up-sell opportunities",
  "قيمة المخزون وحركته بالمستودعات": "Inventory value and movement in warehouses",
  "قيمة هذه الدفعة": "The value of this payment",
  "كاش بانتظار التسوية حسب السائق": "Cash is awaiting settlement according to the driver",
  "كاش مستلم": "Cash received",
  "كاش معلّق": "Pending cash",
  "كجم": "kg",
  "كل الأصناف ضمن المستوى الآمن حاليًا": "All items are currently within safe level",
  "كل التقارير": "All reports",
  "كل الحجوزات على المسار الصحيح، لا يوجد تأخير": "All bookings are on track, no delays",
  "كل الخطوط": "All fonts",
  "كل الدفعات على هذه الفاتورة": "All payments are on this invoice",
  "كل السجلات": "All records",
  "كل الطلبات النشطة": "All active orders",
  "كل العملاء لديهم نشاط حديث": "All clients have recent activity",
  "كل العملاء نشطون حالياً": "All clients are currently active",
  "كل العمليات": "All operations",
  "كل الفواتير الصادرة": "All invoices issued",
  "كل المستودعات": "All warehouses",
  "كل الوحدات متصلة الآن": "All units are now connected",
  "كل توصية مرتبطة بنسبة ثقة، أثر متوقع، وإجراء عملي يمكنك اعتماده مباشرة": "Each recommendation is linked to a confidence rating, an expected impact, and a practical action that you can take immediately",
  "كل دفعة مربوطة بفاتورة حقيقية من النظام": "Each payment is linked to a real invoice from the system",
  "كل شحنة تظهر داخل مرحلتها الحالية مع المسار، الناقل، التقدم، وموعد الوصول": "Each shipment is shown within its current phase along with the route, carrier, progress, and arrival time",
  "كل مدفوعات هذا العميل": "All payments for this customer",
  "كلمة المرور": "password",
  "كلمة المرور الجديدة يجب ألا تقل عن 6 خانات": "The new password must not be less than 6 characters",
  "كلمة المرور الحالية غير صحيحة": "The current password is incorrect",
  "كود الصندوق": "Fund code",
  "لإضافة أول حجز": "To add the first reservation",
  "لإنشاء أول شحنة": "To create the first shipment",
  "لا توجد أصناف منخفضة حالياً": "There are currently no low price items",
  "لا توجد أولويات عاجلة حاليًا": "There are no urgent priorities currently",
  "لا توجد إثباتات تسليم بعد": "There are no proofs of delivery yet",
  "لا توجد بنود": "There are no items",
  "لا توجد بيانات فوترة كافية بعد": "There is not enough billing data yet",
  "لا توجد تسويات مسجلة": "There are no settlements recorded",
  "لا توجد حجوزات بعد. اضغطي": "There are no reservations yet. Press",
  "لا توجد خطوط سير بعد": "There are no itineraries yet",
  "لا توجد دفعات معلقة": "There are no pending payments",
  "لا توجد سجلات تسليم بعد": "There are no delivery records yet",
  "لا توجد شحنات بعد. اضغطي": "No shipments yet. Press",
  "لا توجد طلبات مطابقة للبحث أو الفلتر الحالي": "There are no requests matching the current search or filter",
  "لا توجد فواتير صادرة بعد": "There are no invoices issued yet",
  "لا توجد فواتير متأخرة حاليًا": "There are currently no overdue invoices",
  "لا توجد فواتير متأخرة، ممتاز": "No late bills, excellent",
  "لا توجد فواتير مفتوحة بحاجة لتحصيل حالياً": "There are no open invoices that need to be collected at this time",
  "لا توجد مدفوعات بعد": "No payments yet",
  "لا توجد مرتجعات مسجلة": "There are no returns recorded",
  "لا توجد مستحقات معلّقة حالياً": "There are no outstanding dues currently",
  "لا توجد مصاريف مسجلة بعد": "There are no expenses recorded yet",
  "لا توجد ملاحظات": "There are no notes",
  "لا توجد نتائج مطابقة": "No matching results found",
  "لا يمكن إيقاف حسابك الحالي": "Your existing account cannot be suspended",
  "لا يمكنها الدخول": "She can't get in",
  "لا يوجد": "nothing",
  "لا يوجد تعامل بعد": "No transaction yet",
  "لا يوجد عملاء بعد": "No clients yet",
  "لا يوجد كاش معلّق حالياً": "There is no pending cash currently",
  "لا يوجد معاملات متجاوزة للمهلة الجمركية المجانية": "There are no transactions that exceed the free customs period",
  "لا يوجد نشاط مسجل": "No activity recorded",
  "لحظي": "My moment",
  "لسا ما انقفل": "It's not closed yet",
  "لعرض بياناته وطلباته وفواتيره ومدفوعاته والملاحظات المرتبطة به بمكان واحد": "To display his data, orders, invoices, payments, and notes associated with him in one place",
  "للأفراد والشركات": "For individuals and companies",
  "لم تُسوّ بعد": "Not settled yet",
  "لم تُفحص بعد": "Not checked yet",
  "لم تُفوتر بعد": "Not yet invoiced",
  "لم يبدأ بعد": "It hasn't started yet",
  "لم يتم تسجيل أي دفعة بعد": "No payment has been recorded yet",
  "لم يُرسل الإيصال بعد": "The receipt has not been sent yet",
  "لوحة مراحل حيّة توضّح أين توجد كل شحنة، من المسؤول عنها، وما الخطوة التالية بدون جداول مزدحمة": "A live progress dashboard shows where each shipment is, who's responsible for it, and what's next without busy schedules",
  "لوحة مراحل قابلة للتحديث من نفس الشاشة": "Stages panel refreshable from the same screen",
  "لوحة مليانة حياة: رسوم واضحة، مؤشرات مرئية، وحركة خفيفة تعطيك صورة شاملة بدون كآبة أو فراغ": "A painting full of life: clear drawings, visual indicators, and subtle movement give you a comprehensive picture without gloom or emptiness",
  "مؤسسة رواد الأعمال": "Entrepreneurship Foundation",
  "مارس": "March",
  "مافي طلبات بهذا الخط بعد": "There are no requests for this line yet",
  "مالي، عملاء، مخزون، وتشغيلي": "Financial, customer, inventory, and operational",
  "مايو": "May",
  "مباشر": "direct",
  "مبالغ مفتوحة": "Open amounts",
  "متأخر": "late",
  "متابعة الكميات والحد الأدنى وحالة التوريد من قائمة واضحة بدون تحليلات زائدة": "Track quantities, minimums and supply status from a clear list without excessive analytics",
  "متابعة فاتورتين اليوم قد تغطي الجزء الأكبر من الرصيد المفتوح": "Following up on two bills today may cover the bulk of the open balance",
  "متابعة معاملات التخليص الجمركي والرسوم لكل شحنة": "Follow up on customs clearance transactions and fees for each shipment",
  "متوسط أيام التسليم": "Average delivery days",
  "متوسط التسليم إلى الدمام أقل بـ 0.8 يوم مقارنة بالخيارات الأخرى": "The average delivery time to Dammam is 0.8 days less compared to other options",
  "متوسط قيمة الطلب": "Average order value",
  "متوسط مدة التسليم": "Average delivery time",
  "متوسط هامش الربح": "Average profit margin",
  "متوسطة": "Medium",
  "متوقع": "expected",
  "مثال": "example",
  "مثال: أثاث مكتبي مستورد": "Example: Imported office furniture",
  "مثال: أثاث، أجهزة، مواد غذائية": "Example: furniture, appliances, food",
  "مثال: الرياض": "Example: Riyadh",
  "مثال: المبيعات": "Example: sales",
  "مثال: توريد وربط أجهزة الشبكة": "Example: supplying and connecting network devices",
  "مثال: جدة": "Example: Jeddah",
  "مثال: شركة التوصيل": "Example: Delivery company",
  "مثال: ممر": "Example: corridor",
  "مثال: نقص 5 قطع من الصنف": "Example: A shortage of 5 pieces of an item",
  "مجموعة البنيان التجارية": "Al-Bunyan Commercial Group",
  "محسوبة تلقائيًا من بياناتك": "Automatically calculated from your data",
  "محلي": "local",
  "مخزون بحاجة توريد": "Stock need supply",
  "مدفوع": "paid",
  "مدفوع جزئيًا": "Partially paid",
  "مرئي للأدمن فقط": "Visible to admin only",
  "مراجعة الدفعات واعتمادها وربطها بالفواتير في واجهة خفيفة ومنظمة": "Review and approve payments and link them to invoices in a light and organized interface",
  "مرتبة حسب الأثر والثقة": "Ranked by impact and trust",
  "مرتجع": "Returned",
  "مركز القيادة التنفيذي": "Executive Leadership Center",
  "مسؤولية التسليم": "Delivery responsibility",
  "مسؤولية التسليم عند التأخير أو التلف": "Responsibility for delivery in case of delay or damage",
  "مساء الخير،": "Good evening,",
  "مساء النور،": "Good evening,",
  "مساحة عمل موحدة وآمنة": "A unified and secure workspace",
  "مسار الشحنة": "Shipment path",
  "مسار بصري يوضح أين تقف كل فاتورة، وما تم تحصيله، وما يحتاج إجراءً سريعًا": "A visual trail that shows where each invoice stands, what has been collected, and what needs quick action",
  "مستحق من فواتير غير مسددة بالكامل": "Due from invoices not paid in full",
  "مستحقات معلّقة": "Pending receivables",
  "مستحقات مفتوحة": "Open receivables",
  "مستخدم": "user",
  "مستودع": "storehouse",
  "مستوى المخزون": "Stock level",
  "مسح الصندوق": "Clear the box",
  "مصروفات": "Expenses",
  "مطابقة كاملة": "Complete matching",
  "معالجة": "to treat",
  "معالجة الشحنات المرتجعة": "Processing returned shipments",
  "معالجة الشحنات المرتجعة نتيجة فشل التسليم، وتحديد حالتها النهائية ووجهتها": "Processing returned shipments as a result of delivery failure, and determining their final status and destination",
  "معالجة المرتجع": "Return processing",
  "معاملة تجاوزت المهلة المجانية": "A transaction exceeded the free time limit",
  "معاملة رقم": "Transaction number",
  "معاينة الفاتورة الضريبية": "View tax invoice",
  "معبأ وجاهز": "Packed and ready",
  "معتمد": "Certified",
  "معدل إنجاز": "Completion rate",
  "معدل الإنجاز": "Completion rate",
  "معدل التسليم": "Delivery rate",
  "معدل التسليم وسرعة التنفيذ هذا الشهر": "Delivery rate and execution speed this month",
  "معلومات الاتصال والبيانات النظامية في مكان واحد": "Contact information and regulatory data in one place",
  "مغلّف": "envelope",
  "مفتوحة": "open",
  "مفوتر": "Postpaid",
  "مقابل الشهر الماضي": "versus last month",
  "مقارنة الشركات، متوسط زمن التسليم، وحالات التعثر": "Compare companies, average delivery time, and defaults",
  "مقارنة حية بالشهر الماضي": "Live comparison to last month",
  "مكة": "Mecca",
  "مكتمل": "complete",
  "ملاحظات": "comments",
  "ملاحظات (اختياري)": "Notes (optional)",
  "ملاحظات التلف": "Damage notes",
  "ملاحظات التلف (اختياري)": "Damage notes (optional)",
  "ملاحظات ذكية": "Smart notes",
  "ملخص الأداء التشغيلي لليوم": "Summary of today's operational performance",
  "ملخص محدث لأداء العملاء والمبيعات والتحصيل والتشغيل": "An up-to-date summary of customer, sales, collections and operating performance",
  "ملغاة": "Canceled",
  "ملف عميل 360": "360 client profile",
  "ملفات 360": "360 files",
  "ملفات متكاملة 360": "Integrated files 360",
  "من": "from",
  "من (الاستلام)": "from (receiving)",
  "من أصل": "Out of",
  "من الإجمالي": "Of the total",
  "من المتوسط": "From average",
  "منذ": "since",
  "منذ 18 دقيقة": "18 minutes ago",
  "منذ 35 دقيقة": "35 minutes ago",
  "موانئ": "Ports",
  "موثق بصورة": "Documented with a photo",
  "موثقة بصورة": "Documented with a photo",
  "موديول متصل": "Connected module",
  "موقع التخزين": "Storage location",
  "موقع التخزين (اختياري)": "Storage location (optional)",
  "موقع السعر مقارنة بباقي الناقلين": "Price location compared to other carriers",
  "نافد المخزون": "Out of stock",
  "ناقل إكسبرس": "Express conveyor",
  "ناقلون نشطون": "Active carriers",
  "نبض السلسلة اللوجستية": "Pulse of the logistics chain",
  "نسبة الإنجاز": "Completion rate",
  "نسبة التحصيل": "Collection rate",
  "نسبة التحصيل من الفاتورة": "Collection percentage of the invoice",
  "نسبة التحويل لشحنة": "Conversion ratio for a shipment",
  "نسبة التسليم بالوقت": "Time delivery rate",
  "نشاط العملاء وأفضلهم تعاملاً": "Customer activity and best dealings",
  "نقد عند التسليم": "Cash on delivery",
  "نقص بالمخزون": "Shortage of stock",
  "نقطة الانطلاق": "tee",
  "نمو الطلبات": "Order growth",
  "نورة العتيبي": "Noura Al-Otaibi",
  "نوع الحجز": "Reservation type",
  "نوع الخدمة": "Service type",
  "نوع الخدمة (اختياري)": "Service type (optional)",
  "نوفمبر": "November",
  "هذا الحساب غير نشط. تواصل مع مدير النظام": "This account is inactive. Contact the system administrator",
  "هذا هو حسابك الحالي": "This is your current account",
  "هذه الدفعة": "This batch",
  "هذي الأسعار ما تظهر للموظفين": "These prices are not shown to employees",
  "واجهة مرتبة للوصول إلى العميل، معلوماته، معاملاته، والخطوة التالية بدون ازدحام بصري": "An uncluttered interface to access the customer, their information, transactions, and the next step without visual clutter",
  "وصف أي ضرر أو نقص": "Description of any damage or deficiency",
  "وصف النقص": "Describe the deficiency",
  "وصل الحد الأدنى": "Minimum reached",
  "وصول منظم إلى العملاء والطلبات والفواتير والشحنات من شاشة واحدة": "Organized access to customers, orders, invoices and shipments from a single screen",
  "وضع نهاري مشرق أو ليلي ملوّن ومريح": "Bright day or colorful and comfortable night mode",
  "يتحدث تلقائي": "Automatic speaking",
  "يتم تحميل البيانات والرسوم ولوحات التشغيل": "Data, graphics, and operation panels are loaded",
  "يتم تحميل البيانات وربط وحدات النظام": "Data is loaded and system modules are connected",
  "يجب التأكد من توفر أجهزة الشبكة قبل تجهيز الشحنة": "You must ensure that network devices are available before preparing the shipment",
  "يحتاج إعادة محاولة": "Needs retry",
  "يحتاج مراجعة": "Needs review",
  "يساعد ذلك على تقليل تكلفة الشحن وتفادي توقف الطلبات": "This helps reduce shipping costs and avoid interrupted orders",
  "يفضل إضافتها لاحقاً": "It is preferable to add it later",
  "يفضل العميل استلام تحديث أسبوعي عبر البريد": "Customer prefers to receive a weekly update via mail",
  "يمكن للمستخدم الدخول بهذه البيانات عندما يكون الحساب نشطًا": "The user can access this data when the account is active",
  "يمكنهم تسجيل الدخول": "They can log in",
  "يناير": "January",
  "ينتهي اليوم": "Ends today",
  "يوجد اهتمام بخدمة الدعم الممتد": "There is interest in extended support service",
  "يوليو": "July",
  "يوليو 2026": "July 2026",
  "يوم": "day",
  "يونيو": "June",
  "٠-٩": "0-9",
  "٠-٩۰-۹": "0-90-9",
  "٠١٢٣٤٥٦٧٨٩": "0123456789",
  "۰-۹": "0-9",
  "۰۱۲۳۴۵۶۷۸۹": "0123456789",
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
    accent: "from-[#149188] to-[#0f766e]",
    soft: "bg-[#eaf3ee] text-[#0f766e]",
  },
  {
    key: "customers",
    label: "العملاء",
    description: "أفراد وشركات",
    icon: Users,
    accent: "from-[#d9a63b] to-[#c9962c]",
    soft: "bg-[#fdf1de] text-[#b9852b]",
  },
  {
    key: "carriers",
    label: "شركات التوصيل",
    description: "الأسعار والاستلام",
    icon: Truck,
    accent: "from-[#9c86bd] to-[#8a72ab]",
    soft: "bg-[#f2eef9] text-[#8a72ab]",
  },
  {
    key: "bookings",
    label: "الحجوزات",
    description: "بداية العملية",
    icon: ClipboardList,
    accent: "from-[#d17750] to-[#c2653f]",
    soft: "bg-[#fbeee7] text-[#c2653f]",
  },
  {
    key: "shipments",
    label: "الشحنات",
    description: "التتبع والتسليم",
    icon: PackageCheck,
    accent: "from-[#7ba25d] to-[#6b8f4e]",
    soft: "bg-[#eef3e7] text-[#6b8f4e]",
  },
  {
    key: "customs",
    label: "الجمارك",
    description: "التخليص والرسوم",
    icon: Landmark,
    accent: "from-[#4b8ba5] to-[#3e7a94]",
    soft: "bg-[#eaf0f4] text-[#3e7a94]",
  },
  {
    key: "receiving",
    label: "الاستلام",
    description: "فحص واستلام البضاعة",
    icon: PackageOpen,
    accent: "from-[#d16d90] to-[#c15a80]",
    soft: "bg-[#fbe9ef] text-[#c15a80]",
  },
  {
    key: "inventory",
    label: "المخزون",
    description: "الكميات والحركات",
    icon: Boxes,
    accent: "from-[#149188] to-[#0f766e]",
    soft: "bg-[#eaf3ee] text-[#0f766e]",
  },
  {
    key: "orders",
    label: "الطلبات",
    description: "متابعة الدورة",
    icon: ShoppingCart,
    accent: "from-[#d9a63b] to-[#c9962c]",
    soft: "bg-[#fdf1de] text-[#b9852b]",
  },
  {
    key: "picking",
    label: "التجهيز والتغليف",
    description: "تجهيز الطلبات وتعبئتها",
    icon: ScanLine,
    accent: "from-[#9c86bd] to-[#8a72ab]",
    soft: "bg-[#f2eef9] text-[#8a72ab]",
  },
  {
    key: "dispatch",
    label: "الإرسال",
    description: "خطوط السير والشحن",
    icon: Route,
    accent: "from-[#4f83b0] to-[#2b6cb0]",
    soft: "bg-[#eaf2fa] text-[#2b6cb0]",
  },
  {
    key: "delivery",
    label: "التسليم",
    description: "تسليم العميل وتحصيل النقد",
    icon: MapPin,
    accent: "from-[#7ba25d] to-[#6b8f4e]",
    soft: "bg-[#eef3e7] text-[#6b8f4e]",
  },
  {
    key: "cash",
    label: "الكاش (COD)",
    description: "تسوية النقد المحصّل عند التسليم",
    icon: Banknote,
    accent: "from-[#d16d90] to-[#c15a80]",
    soft: "bg-[#fbe9ef] text-[#c15a80]",
  },
  {
    key: "returns",
    label: "المرتجعات",
    description: "معالجة الشحنات المرتجعة",
    icon: RotateCcw,
    accent: "from-[#149188] to-[#0f766e]",
    soft: "bg-[#eaf3ee] text-[#0f766e]",
  },
  {
    key: "billing",
    label: "الفوترة",
    description: "تجميع تلقائي وإصدار الفواتير",
    icon: ReceiptText,
    accent: "from-[#d9a63b] to-[#c9962c]",
    soft: "bg-[#fdf1de] text-[#b9852b]",
  },
  {
    key: "payments",
    label: "المدفوعات",
    description: "التسويات المالية",
    icon: WalletCards,
    accent: "from-[#9c86bd] to-[#8a72ab]",
    soft: "bg-[#f2eef9] text-[#8a72ab]",
  },
  {
    key: "reports",
    label: "التقارير",
    description: "لوحات وتحليلات",
    icon: BarChart3,
    accent: "from-[#d17750] to-[#c2653f]",
    soft: "bg-[#fbeee7] text-[#c2653f]",
  },
  {
    key: "ai",
    label: "الذكاء التشغيلي",
    description: "توصيات وتوقعات",
    icon: BrainCircuit,
    accent: "from-[#7ba25d] to-[#6b8f4e]",
    soft: "bg-[#eef3e7] text-[#6b8f4e]",
  },
  {
    key: "users",
    label: "المستخدمون",
    description: "الحسابات والصلاحيات",
    icon: UserCog,
    accent: "from-[#4b8ba5] to-[#3e7a94]",
    soft: "bg-[#eaf0f4] text-[#3e7a94]",
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
    accent: "from-[#6a97a3] to-[#557d89]",
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
    accent: "from-[#68a690] to-[#548f79]",
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
  dbId: number;
  name: string;
  category: string;
  sku: string;
  stock: number;
  minimum: number;
  maximum: number;
  warehouse: string;
  location: string;
  batchNumber: string;
  customerId: number;
  customerName: string;
  unitValue: number;
  movement: number;
}

interface CustomsUIRecord {
  id: number;
  shipmentId: number;
  shipmentLabel: string;
  status: CustomsStatus;
  dutyAmount: number;
  vatAmount: number;
  portCharges: number;
  freeTimeExpiry: string;
  releasedAt: string;
  notes: string;
}
interface ReceivingUIRecord {
  id: number;
  shipmentId: number;
  shipmentLabel: string;
  expectedQuantity: number;
  actualQuantity: number | null;
  storageLocation: string;
  damageNotes: string;
  status: ReceivingStatus;
  receiptSent: boolean;
  receivedAt: string;
}
interface DeliveryReceiptUIRecord {
  id: number;
  shipmentId: number;
  shipmentLabel: string;
  recipientName: string;
  proofImageUrl: string;
  notes: string;
  createdAt: string;
}
interface PickingUIRecord {
  id: number;
  orderId: number;
  orderLabel: string;
  status: PickingStatus;
  deliveryNumber: string;
  missingNotes: string;
  createdAt: string;
  packedAt: string;
  boxCode: string;
}
interface DispatchUIItem {
  id: number;
  pickingId: number;
  label: string;
  scanned: boolean;
}
interface DispatchUIRoute {
  id: number;
  routeNumber: string;
  driverName: string;
  driverPhone: string;
  vehiclePlate: string;
  status: DispatchStatus;
  notes: string;
  createdAt: string;
  dispatchedAt: string;
  items: DispatchUIItem[];
}
interface DeliveryUIRecord {
  id: number;
  pickingId: number;
  pickingLabel: string;
  status: DeliveryStatus;
  recipientName: string;
  proofImageUrl: string;
  cashCollected: number;
  failureReason: string;
  notes: string;
  createdAt: string;
  deliveredAt: string;
}
interface ReturnUIRecord {
  id: number;
  deliveryId: number;
  deliveryLabel: string;
  status: ReturnStatus;
  condition: ReturnCondition | null;
  outcome: ReturnOutcome | null;
  notes: string;
  createdAt: string;
  resolvedAt: string;
}
interface CashUIDeliveryDetail {
  recipientName: string | null;
  cashCollected: number;
  deliveredAt: string | null;
}
interface CashUIPendingGroup {
  driverName: string;
  totalAmount: number;
  deliveryCount: number;
  deliveries: CashUIDeliveryDetail[];
}
interface CashUISettlementItemDetail {
  recipientName: string | null;
  amount: number;
  deliveredAt: string | null;
}
interface CashUISettlement {
  id: number;
  driverName: string;
  totalAmount: number;
  status: CashSettlementStatus;
  notes: string;
  createdAt: string;
  settledAt: string;
  items: CashUISettlementItemDetail[];
}
interface BillingUIChargeItem {
  sourceType: string;
  sourceId: number;
  description: string;
  amount: number;
}
interface BillingUICustomerGroup {
  customerId: number;
  customerName: string;
  totalAmount: number;
  items: BillingUIChargeItem[];
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
  dbId: number;
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
  origin?: string;
  destination?: string;
  recipientName?: string;
  recipientPhone?: string;
  recipientAddress?: string;
  deliveryMethod?: string;
  balance?: number;
  financialStatus?: string;
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

const demoOrders: OrderRecord[] = [
  {
    id: "ORD-2026-091",
    dbId: 0,
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
    dbId: 0,
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
    dbId: 0,
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
    dbId: 0,
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
    dbId: 0,
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
    numberingSystem: "latn",
  }).format(value);
}
function customerAccentColor(type: CustomerType): string {
  return type === "company" ? "#c9962c" : "#0f766e";
}
function customerAccentGradient(type: CustomerType): string {
  return type === "company"
    ? "linear-gradient(135deg, #e8c06a 0%, #c9962c 100%)"
    : "linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)";
}
function mapApiCustomerToLocal(apiCustomer: ApiCustomer): Customer {
  const type: CustomerType =
    apiCustomer.customer_type === "company" ? "company" : "individual";
  return {
    id: `CUS-${apiCustomer.id}`,
    type,
    name: apiCustomer.name,
    email: apiCustomer.email ?? "",
    phone: apiCustomer.phone ?? "",
    city: apiCustomer.city ?? "",
    address: apiCustomer.address ?? "",
    status: "نشط",
    joinedAt: new Intl.DateTimeFormat("ar-SA", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(apiCustomer.created_at)),
    totalOrders: 0,
    totalSpent: 0,
    outstanding: 0,
    nationalId: apiCustomer.national_id ?? undefined,
    vatNumber: apiCustomer.tax_number ?? undefined,
    commercialRegistration: apiCustomer.commercial_registration ?? undefined,
    companyWebsite: apiCustomer.company_website ?? undefined,
    contactPerson: apiCustomer.contact_person ?? undefined,
    invoices: [],
    shipments: [],
    payments: [],
    notes: apiCustomer.notes ? [apiCustomer.notes] : [],
  };
}
function enrichCustomer(
  apiCustomer: ApiCustomer,
  invoices: ApiInvoice[],
  payments: ApiPayment[],
  orders: ApiOrder[]
): Customer {
  const base = mapApiCustomerToLocal(apiCustomer);
  const customerInvoices = invoices.filter((item) => item.customer_id === apiCustomer.id);
  const customerPayments = payments.filter((item) => item.customer_id === apiCustomer.id);
  const customerOrders = orders.filter((item) => item.customer_id === apiCustomer.id);
  const invoiceStatusLabel = (status: string): CustomerInvoice["status"] => {
    if (status === "paid") return "مدفوعة";
    if (status === "partially_paid") return "جزئية";
    return "مسودة";
  };
  const paidForInvoice = (invoiceId: number) =>
    customerPayments.filter((item) => item.invoice_id === invoiceId).reduce((sum, item) => sum + item.amount, 0);
  base.invoices = customerInvoices.map((invoice) => ({
    id: invoice.invoice_number,
    title: "فاتورة عمليات لوجستية",
    amount: invoice.total,
    status: invoiceStatusLabel(invoice.status),
    issueDate: "-",
    dueDate: "-",
  }));
  base.payments = customerPayments.map((payment) => ({
    id: `PAY-${String(payment.id).padStart(5, "0")}`,
    method: payment.payment_method,
    amount: payment.amount,
    status: "مؤكد" as const,
    date: new Date(payment.created_at).toLocaleDateString("ar-SA"),
  }));
  base.totalOrders = customerOrders.length;
  base.totalSpent = customerPayments.reduce((sum, item) => sum + item.amount, 0);
  base.outstanding = customerInvoices.reduce(
    (sum, invoice) => sum + Math.max(0, invoice.total - paidForInvoice(invoice.id)),
    0
  );
  return base;
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("ar-SA", { numberingSystem: "latn" }).format(value);
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
  const line = dark ? "border-[#4a3d22]/28" : "border-[#e3c98e]/38";
  const ribbon = dark ? "bg-[#2a2210]/40" : "bg-[#faf0d8]/55";
  const ring = dark ? "border-[#4a3d22]/26" : "border-[#e3c98e]/32";

  return (
    <div
      className={`ertikaz-background pointer-events-none fixed inset-0 -z-10 overflow-hidden ${
        dark ? "bg-[#0f2119]" : "bg-[#faf6ec]"
      }`}
      aria-hidden="true"
    >
      <div className={`background-edge-glow absolute -right-32 top-[-10%] h-[72%] w-[46%] rounded-full blur-[115px] ${dark ? "bg-[#c9962c]/8" : "bg-[#e8c476]/16"}`} />
      <div className={`background-edge-glow absolute -left-44 bottom-[-24%] h-[58%] w-[42%] rounded-full blur-[125px] ${dark ? "bg-[#c9962c]/8" : "bg-[#e8c476]/16"}`} />

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
            <p className="text-[12.5px] font-bold tracking-[0.14em] text-[#36746f]">
              {eyebrow}
            </p>
          )}
          <h2 className={`${showDescription ? "mt-2" : ""} text-[25.5px] font-bold leading-[1.4] sm:text-[31.5px]`}>
            {title}
          </h2>
          {showDescription && (
            <p className="mt-2 max-w-2xl text-[13.5px] font-medium leading-6 text-slate-600">
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
  onLogin: (email: string, password: string) => Promise<string | null>;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    const result = await onLogin(email.trim().toLowerCase(), password);
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
          className="ertikaz-surface flex h-10 items-center gap-2 rounded-xl border border-white/75 bg-white/72 px-3 text-[12.5px] font-bold text-slate-700 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5"
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
                <p className="mt-1 text-[12.5px] font-semibold tracking-[.2em] text-[#294967]/65">
                  OPERATIONS PLATFORM
                </p>
              </div>
            </div>

            <div className="relative z-10 max-w-[500px]">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/45 bg-white/28 px-3.5 py-2 text-[11.5px] font-bold backdrop-blur-xl">
                <ShieldCheck size={13} />
                {ar ? "مساحة عمل موحدة وآمنة" : "A unified and secure workspace"}
              </span>
              <h1 className="mt-6 text-[41.5px] font-bold leading-[1.5] text-[#142947]">
                {ar
                  ? "إدارة أعمالك تبدأ من هنا"
                  : "Your work starts here"}
              </h1>
              <p className="mt-4 max-w-md text-[14.5px] font-medium leading-7 text-[#294967]/76">
                {ar
                  ? "وصول منظم إلى العملاء والطلبات والفواتير والشحنات من شاشة واحدة."
                  : "Access customers, orders, invoices, and shipments from one organized workspace."}
              </p>
            </div>

            <div className="relative z-10 max-w-[480px] rounded-[24px] border border-white/45 bg-white/22 p-5 backdrop-blur-xl">
              <p className="text-[12.5px] font-bold leading-6 text-[#294967]/80">
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

              <p className="mt-7 text-[12.5px] font-bold tracking-[.18em] text-sky-600 lg:mt-0">
                {ar ? "تسجيل الدخول" : "SECURE SIGN IN"}
              </p>
              <h2 className="mt-3 text-[31.5px] font-bold text-slate-950">
                {ar ? "تسجيل الدخول" : "Sign in"}
              </h2>
              <p className="mt-2 text-[13.5px] font-medium leading-6 text-slate-500">
                {ar
                  ? "أدخل بيانات حسابك للمتابعة."
                  : "Enter your account details to continue."}
              </p>

              <form onSubmit={submit} className="mt-8 space-y-4">
                <label className="block">
                  <span className="mb-2 block text-[12.5px] font-bold text-slate-600">
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
                      className={`h-12 w-full rounded-2xl border border-sky-100 bg-sky-50/60 text-[13.5px] font-medium text-slate-800 outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100 ${
                        ar ? "pr-11 pl-4" : "pl-11 pr-4"
                      }`}
                      placeholder="name@company.com"
                      autoComplete="username"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-[12.5px] font-bold text-slate-600">
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
                      className={`h-12 w-full rounded-2xl border border-violet-100 bg-violet-50/55 text-[13.5px] font-medium text-slate-800 outline-none transition focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100 ${
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
                  <div className="flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-[12.5px] font-medium text-amber-700">
                    <CircleAlert size={14} />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting || !email || !password}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#38bdf8_0%,#6ee7c8_42%,#8b8cf6_100%)] text-[13.5px] font-bold text-white shadow-[0_16px_38px_rgba(76,150,222,.28)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_46px_rgba(76,150,222,.34)] disabled:cursor-not-allowed disabled:opacity-45"
                >
                  {submitting ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <LogOut size={15} className="rotate-180" />
                  )}
                  {ar ? "الدخول إلى النظام" : "Access workspace"}
                </button>
              </form>

              <div className="mt-7 flex items-center justify-center gap-2 text-[11.5px] font-medium text-slate-400">
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
  useEffect(() => {
    const handler = () => setActiveModule("billing");
    window.addEventListener("ertikaz-open-invoice", handler);
    return () => window.removeEventListener("ertikaz-open-invoice", handler);
  }, []);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [currentUser, setCurrentUser] = useState<UserRecord | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null,
  );
  const [customerTab, setCustomerTab] = useState<CustomerTab>("overview");
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [customersError, setCustomersError] = useState<string | null>(null);
  const [isSavingCustomer, setIsSavingCustomer] = useState(false);
  const [addCustomerError, setAddCustomerError] = useState<string | null>(null);
  const loadCustomers = useCallback(async () => {
    try {
      setCustomersLoading(true);
      setCustomersError(null);
      const [apiCustomers, apiInvoices, apiPayments, apiOrders] = await Promise.all([
        getCustomersApi(),
        getInvoicesApi(),
        getPaymentsApi(),
        getOrdersApi(),
      ]);
      setCustomers(
        apiCustomers.map((apiCustomer) => enrichCustomer(apiCustomer, apiInvoices, apiPayments, apiOrders))
      );
    } catch (error) {
      console.error("Customers API error:", error);
      setCustomersError(
        error instanceof Error
          ? error.message
          : "تعذر تحميل قائمة العملاء — تحقق من الاتصال بالخادم"
      );
    } finally {
      setCustomersLoading(false);
    }
  }, []);
  useEffect(() => {
    if (!authReady) return;
    void loadCustomers();
  }, [loadCustomers, authReady]);
  const [deliveryModes, setDeliveryModes] = useState<
    Record<string, DeliveryMode>
  >({
    aramex: "pickup",
    smsa: "dropoff",
    spl: "pickup",
  });
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [workflowReady, setWorkflowReady] = useState(false);

    useEffect(() => {
    try {
      const storedNotifications = window.localStorage.getItem("ertikaz-notifications");
      if (storedNotifications) setNotifications(JSON.parse(storedNotifications) as NotificationItem[]);
    } catch (error) {
      console.error("Workflow storage error:", error);
    } finally {
      setWorkflowReady(true);
    }
  }, []);
  useEffect(() => {
    if (!workflowReady) return;
    window.localStorage.setItem("ertikaz-notifications", JSON.stringify(notifications));
  }, [notifications, workflowReady]);

  const currentModule =
    navigation.find((item) => item.key === activeModule) ?? navigation[0];

    const [metricInvoices, setMetricInvoices] = useState<ApiInvoice[]>([]);
  const [metricPayments, setMetricPayments] = useState<ApiPayment[]>([]);
  const [metricShipments, setMetricShipments] = useState<ApiShipment[]>([]);
  const [metricInventory, setMetricInventory] = useState<ApiInventoryItem[]>([]);
  const [metricBookings, setMetricBookings] = useState<unknown[]>([]);
  const [metricCustoms, setMetricCustoms] = useState<unknown[]>([]);
  const [metricReceiving, setMetricReceiving] = useState<unknown[]>([]);
  const [metricOrders, setMetricOrders] = useState<unknown[]>([]);
  const [metricDispatch, setMetricDispatch] = useState<unknown[]>([]);
  const [metricDeliveries, setMetricDeliveries] = useState<unknown[]>([]);
  const getDashboardData = useCallback(async (isRefresh = false) => {
    try {
      setHasError(false);
      isRefresh ? setRefreshing(true) : setLoading(true);
      const [
        invoicesList,
        paymentsList,
        shipmentsList,
        inventoryList,
        bookingsList,
        customsList,
        receivingList,
        ordersList,
        dispatchList,
        deliveriesList,
      ] = await Promise.all([
        getInvoicesApi(),
        getPaymentsApi(),
        getShipmentsApi(),
        getInventoryApi(),
        getBookingsApi(),
        getCustomsApi(),
        getReceivingApi(),
        getOrdersApi(),
        getDispatchRoutesApi(),
        getDeliveriesApi(),
      ]);
      setMetricInvoices(invoicesList);
      setMetricPayments(paymentsList);
      setMetricShipments(shipmentsList);
      setMetricInventory(inventoryList);
      setMetricBookings(bookingsList);
      setMetricCustoms(customsList);
      setMetricReceiving(receivingList);
      setMetricOrders(ordersList);
      setMetricDispatch(dispatchList);
      setMetricDeliveries(deliveriesList);
    } catch (error) {
      console.error("Dashboard metrics error:", error);
      setHasError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);
  useEffect(() => {
    void getDashboardData();
  }, [getDashboardData]);
  const dashboardMetrics = useMemo(() => {
    const totalInvoiced = metricInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const paidForInvoice = (invoiceId: number) =>
      metricPayments.filter((item) => item.invoice_id === invoiceId).reduce((sum, item) => sum + item.amount, 0);
    const openAmount = metricInvoices.reduce((sum, inv) => sum + Math.max(0, inv.total - paidForInvoice(inv.id)), 0);
    const totalCollected = metricPayments.reduce((sum, item) => sum + item.amount, 0);
    const collectionRate = totalInvoiced > 0 ? Math.round((totalCollected / totalInvoiced) * 100) : 0;
    const dueInvoicesCount = metricInvoices.filter((inv) => inv.status !== "paid").length;
    const lowStockCount = metricInventory.filter((item) => item.quantity <= item.minimum).length;
    const pulseStages = [
      { key: "bookings" as ModuleKey, label: "حجوزات نشطة", count: metricBookings.length, color: "#378ade" },
      { key: "customs" as ModuleKey, label: "قيد التخليص الجمركي", count: metricCustoms.length, color: "#ba7517" },
      { key: "receiving" as ModuleKey, label: "استلام بضائع", count: metricReceiving.length, color: "#3b6d11" },
      { key: "inventory" as ModuleKey, label: "المخزون التشغيلي", count: metricInventory.length, color: "#993556" },
      { key: "orders" as ModuleKey, label: "طلبات جارية", count: metricOrders.length, color: "#993c1d" },
      { key: "dispatch" as ModuleKey, label: "قيد الإرسال", count: metricDispatch.length, color: "#2b6cb0" },
      { key: "delivery" as ModuleKey, label: "تم التسليم", count: metricDeliveries.length, color: "#0f6e56" },
    ];
    const unpaidInvoiceItems = metricInvoices
      .map((inv) => ({ inv, remaining: Math.max(0, inv.total - paidForInvoice(inv.id)) }))
      .filter((item) => item.inv.status !== "paid" && item.remaining > 0)
      .sort((a, b) => b.remaining - a.remaining)
      .slice(0, 3)
      .map((item) => ({
        module: "billing" as ModuleKey,
        title: `فاتورة ${item.inv.invoice_number} غير مسددة بالكامل`,
        subtitle: `المتبقي ${formatCurrency(item.remaining)}`,
        color: "#d4534b",
      }));
    const lowStockItems = metricInventory
      .filter((item) => item.quantity <= item.minimum)
      .slice(0, 3)
      .map((item) => ({
        module: "inventory" as ModuleKey,
        title: `صنف «${item.name}» وصل الحد الأدنى`,
        subtitle: `المتبقي ${item.quantity} من أصل ${item.maximum}`,
        color: "#c9962c",
      }));
    const priorityItems = [...unpaidInvoiceItems, ...lowStockItems].slice(0, 5);
    const sortedCustomers = [...customers].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);
    const maxSpent = sortedCustomers.length > 0 ? sortedCustomers[0].totalSpent || 1 : 1;
    const topCustomers = sortedCustomers.map((item) => ({
      name: item.name,
      amount: item.totalSpent,
      percent: Math.round((item.totalSpent / maxSpent) * 100),
    }));
    return {
      customersCount: customers.length,
      invoicesCount: metricInvoices.length,
      totalInvoiced,
      openAmount,
      totalCollected,
      collectionRate,
      dueInvoicesCount,
      shipmentsCount: metricShipments.length,
      lowStockCount,
      pulseStages,
      priorityItems,
      topCustomers,
    };
  }, [customers, metricInvoices, metricPayments, metricShipments, metricInventory, metricBookings, metricCustoms, metricReceiving, metricOrders, metricDispatch, metricDeliveries]);

  const mapApiUser = (apiUser: {
    id: string; name: string; email: string; phone: string; role: string;
    department: string; status: string; permissions: string[];
    last_active: string; joined_at: string;
  }): UserRecord => ({
    id: apiUser.id,
    name: apiUser.name,
    email: apiUser.email,
    password: "",
    phone: apiUser.phone,
    role: apiUser.role as UserRecord["role"],
    department: apiUser.department,
    status: apiUser.status as UserRecord["status"],
    lastActive: apiUser.last_active,
    joinedAt: apiUser.joined_at,
    permissions: apiUser.permissions,
  });
  const fetchUsers = async (token: string) => {
    try {
      const res = await fetch("/backend/users/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setUsers((data as Array<Parameters<typeof mapApiUser>[0]>).map(mapApiUser));
    } catch (error) {
      console.error("Users fetch error:", error);
    }
  };
  useEffect(() => {
    const token = window.localStorage.getItem("ertikaz-token");
    if (!token) {
      setAuthReady(true);
      return;
    }
    (async () => {
      try {
        const res = await fetch("/backend/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) {
          window.localStorage.removeItem("ertikaz-token");
          return;
        }
        if (!res.ok) {
          return;
        }
        const data = await res.json();
        setCurrentUser(mapApiUser(data));
        await fetchUsers(token);
      } catch (error) {
        console.error("Session restore error:", error);
      } finally {
        setAuthReady(true);
      }
    })();
  }, []);

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
      if (language === "en") {
        observer.observe(root, {
          childList: true,
          subtree: true,
          characterData: true,
          attributes: true,
          attributeFilter: ["placeholder", "title", "aria-label"],
        });
      }
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

  const login = async (email: string, password: string): Promise<string | null> => {
    try {
      const res = await fetch("/backend/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      if (!res.ok) {
        if ([502, 503, 504].includes(res.status)) {
          return language === "ar"
            ? "الخادم كان متوقفًا مؤقتًا ويستيقظ الآن، حاولي تسجيل الدخول مرة أخرى بعد نصف دقيقة."
            : "The server was asleep and is waking up now, please try again in about 30 seconds.";
        }
        const data = await res.json().catch(() => null);
        return (
          data?.detail ||
          (language === "ar"
            ? "البريد الإلكتروني أو رمز الدخول غير صحيح."
            : "Incorrect email or password.")
        );
      }
      const data = await res.json();
      const mappedUser = mapApiUser(data.user);
      window.localStorage.setItem("ertikaz-token", data.token);
      setCurrentUser(mappedUser);
      setActiveModule("dashboard");
      void fetchUsers(data.token);
      return null;
    } catch (error) {
      console.error("Login error:", error);
      return language === "ar"
        ? "تعذر الاتصال بالخادم. تأكدي أن الباكند شغّال."
        : "Could not reach the server.";
    }
  };
  const logout = () => {
    const token = window.localStorage.getItem("ertikaz-token");
    if (token) {
      void fetch("/backend/auth/logout", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    window.localStorage.removeItem("ertikaz-token");
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

  const addCustomer = async (draft: AddCustomerDraft) => {
    try {
      setIsSavingCustomer(true);
      setAddCustomerError(null);
      const created = await createCustomerApi({
        name: draft.name,
        type: draft.type,
        phone: draft.phone,
        email: draft.email || undefined,
        city: draft.city || undefined,
        address: draft.address || undefined,
        taxNumber: draft.type === "company" ? draft.vatNumber || undefined : undefined,
        nationalId:
          draft.type === "individual" ? draft.nationalId || undefined : undefined,
        commercialRegistration:
          draft.type === "company"
            ? draft.commercialRegistration || undefined
            : undefined,
        companyWebsite:
          draft.type === "company" ? draft.companyWebsite || undefined : undefined,
        contactPerson:
          draft.type === "company" ? draft.contactPerson || undefined : undefined,
        isActive: true,
      });
      const customer = mapApiCustomerToLocal(created);
      setCustomers((current) => [customer, ...current]);
      setShowAddCustomer(false);
      setSelectedCustomerId(customer.id);
      setCustomerTab("overview");
    } catch (error) {
      console.error("Create customer API error:", error);
      setAddCustomerError(
        error instanceof Error ? error.message : "تعذر إضافة العميل"
      );
    } finally {
      setIsSavingCustomer(false);
    }
  };
  const deleteCustomer = async (customerId: string) => {
    try {
      await deleteCustomerApi(Number(customerId.replace("CUS-", "")));
      setCustomers((current) => current.filter((customer) => customer.id !== customerId));
      if (selectedCustomerId === customerId) {
        setSelectedCustomerId(null);
        setCustomerTab("overview");
      }
    } catch (error) {
      console.error("Delete customer API error:", error);
      window.alert(error instanceof Error ? error.message : "تعذر حذف العميل");
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
        .ertikaz-dark [class~="bg-slate-900"],
        .ertikaz-dark [class~="bg-slate-950"] { background-color: #293a78 !important; }
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
        .ertikaz-dark [class~="bg-slate-900"],
        .ertikaz-dark [class~="bg-slate-950"] { background-color: #1c6670 !important; }
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
        .ertikaz-light main [class~="bg-slate-900"] { background-color: #126f73 !important; }
        .ertikaz-light main [class~="bg-slate-950"] { background-color: #1e718a !important; }
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
        .ertikaz-light main[data-module="payments"] { --module-surface:#f8f6fc; --module-soft:#f2eef9; --module-border:#ded3ec; --module-accent:#8a72ab; --module-ink:#5f4a7a; }
        .ertikaz-light main[data-module="shipments"] { --module-surface:#fff8f1; --module-soft:#ffead8; --module-border:#f5d0ae; --module-accent:#d96a27; --module-ink:#934619; }
        .ertikaz-light main[data-module="inventory"] { --module-surface:#f8fceb; --module-soft:#edf7cf; --module-border:#d5e9a5; --module-accent:#749c18; --module-ink:#506e10; }
        .ertikaz-light main[data-module="reports"] { --module-surface:#fdf9f6; --module-soft:#fbeee7; --module-border:#f0d6c4; --module-accent:#c2653f; --module-ink:#8a4527; }
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
        .ertikaz-light main[data-module]:not([data-module="dashboard"]) [class~="bg-slate-900"],
        .ertikaz-light main[data-module]:not([data-module="dashboard"]) [class~="bg-slate-950"] {
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
        .ertikaz-dark [class~="bg-slate-900"],
        .ertikaz-dark [class~="bg-slate-950"] {
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
        .ertikaz-dark main[data-module="payments"] { --night-module:#2a2338; --night-soft:#332b44; --night-accent:#9c86bd; }
        .ertikaz-dark main[data-module="shipments"] { --night-module:#2b221b; --night-soft:#38291f; --night-accent:#c76d35; }
        .ertikaz-dark main[data-module="inventory"] { --night-module:#222a18; --night-soft:#2d371e; --night-accent:#829d35; }
        .ertikaz-dark main[data-module="reports"] { --night-module:#2e1f16; --night-soft:#3a2a1d; --night-accent:#d4874f; }
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
        .ertikaz-dark main[data-module]:not([data-module="dashboard"]) [class~="bg-slate-900"],
        .ertikaz-dark main[data-module]:not([data-module="dashboard"]) [class~="bg-slate-950"] {
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
        .ertikaz-light main[data-module="payments"] { --module-surface:#f8f6fc; --module-soft:#f2eef9; --module-border:#ded3ec; --module-accent:#8a72ab; --module-ink:#5f4a7a; }
        .ertikaz-light main[data-module="shipments"] { --module-surface:#fffaf7; --module-soft:#ffede4; --module-border:#f3cdbb; --module-accent:#cf7044; --module-ink:#884528; }
        .ertikaz-light main[data-module="inventory"] { --module-surface:#fbfdf5; --module-soft:#eff7dc; --module-border:#d6e7ae; --module-accent:#799a35; --module-ink:#526b22; }
        .ertikaz-light main[data-module="reports"] { --module-surface:#fdf9f6; --module-soft:#fbeee7; --module-border:#f0d6c4; --module-accent:#c2653f; --module-ink:#8a4527; }
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
        .ertikaz-light main[data-module]:not([data-module="dashboard"]) [class~="bg-slate-900"],
        .ertikaz-light main[data-module]:not([data-module="dashboard"]) [class~="bg-slate-950"] {
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
        .ertikaz-dark main[data-module] [class~="bg-slate-900"],
        .ertikaz-dark main[data-module] [class~="bg-slate-950"] {
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
        .ertikaz-light .ertikaz-background { background-color: #faf6ec !important; }
        .ertikaz-dark .ertikaz-background { background-color: #0f2119 !important; }
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
        .ertikaz-light main[data-module="payments"] { --module-accent:#8a72ab; --module-soft:#f2eef9; --module-border:#ded3ec; }
        .ertikaz-light main[data-module="shipments"] { --module-accent:#dc7b3d; --module-soft:#fff3e9; --module-border:#f1d2bd; }
        .ertikaz-light main[data-module="inventory"] { --module-accent:#799d3d; --module-soft:#f2f8e8; --module-border:#d9e7bf; }
        .ertikaz-light main[data-module="reports"] { --module-accent:#c2653f; --module-soft:#fbeee7; --module-border:#f0d6c4; }
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
          <div className="w-full">
            {activeModule === "dashboard" && (
              <DashboardView
                greeting={greeting}
                currentDate={currentDate}
                customers={dashboardMetrics.customersCount}
                invoices={dashboardMetrics.invoicesCount}
                payments={dashboardMetrics.totalCollected}
                shipments={dashboardMetrics.shipmentsCount}
                revenue={dashboardMetrics.totalCollected}
                invoicedAmountProp={dashboardMetrics.totalInvoiced}
                openAmountProp={dashboardMetrics.openAmount}
                collectionRateProp={dashboardMetrics.collectionRate}
                dueInvoicesProp={dashboardMetrics.dueInvoicesCount}
                lowStockProp={dashboardMetrics.lowStockCount}
                pulseStagesProp={dashboardMetrics.pulseStages}
                priorityItemsProp={dashboardMetrics.priorityItems}
                topCustomersProp={dashboardMetrics.topCustomers}
                refreshing={refreshing}
                hasError={hasError}
                onRefresh={() => { void getDashboardData(true); void loadCustomers(); }}
                onOpenModule={openModule}
              />
            )}

            {activeModule === "customers" && customersLoading && (
              <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-[14.5px] font-bold text-slate-500">
                جاري تحميل قائمة العملاء...
              </div>
            )}
            {activeModule === "customers" && !customersLoading && customersError && (
              <div className="flex flex-col items-center gap-3 rounded-3xl border border-red-200 bg-red-50 p-10 text-center">
                <p className="text-[14.5px] font-bold text-red-600">{customersError}</p>
                <button
                  type="button"
                  onClick={() => void loadCustomers()}
                  className="rounded-xl bg-red-600 px-4 py-2 text-[13.5px] font-black text-white"
                >
                  إعادة المحاولة
                </button>
              </div>
            )}
            {activeModule === "customers" && !customersLoading && !customersError && (
              <CustomersSplitView
                customers={customers}
                selectedCustomer={selectedCustomer}
                onSelectCustomer={(customerId) => {
                  setSelectedCustomerId(customerId);
                  setCustomerTab("overview");
                }}
                onAddCustomer={() => setShowAddCustomer(true)}
                onDeleteCustomer={deleteCustomer}
              >
                {selectedCustomer && (
                  <CustomerDetail
                    key={selectedCustomer.id}
                    customer={selectedCustomer}
                    activeTab={customerTab}
                    onChangeTab={setCustomerTab}
                    onBack={() => setSelectedCustomerId(null)}
                    onDeleteCustomer={deleteCustomer}
                  />
                )}
              </CustomersSplitView>
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
                currentUser={currentUser}
              />
            )}

            {activeModule === "payments" && <PaymentsWorkspace />}
            {activeModule === "shipments" && <ShipmentsWorkspace />}
            {activeModule === "inventory" && <InventoryWorkspace />}
            {activeModule === "customs" && <CustomsWorkspace />}
            {activeModule === "receiving" && <ReceivingWorkspace />}
            {activeModule === "delivery-receipts" && <DeliveryReceiptsWorkspace />}
            {activeModule === "picking" && <PickingPackingWorkspace />}
            {activeModule === "dispatch" && <DispatchWorkspace />}
            {activeModule === "delivery" && <DeliveryWorkspace />}
            {activeModule === "returns" && <ReturnsWorkspace />}
            {activeModule === "cash" && <CashWorkspace />}
            {activeModule === "billing" && <BillingWorkspace />}
            {activeModule === "reports" && <ReportsWorkspace />}
            {activeModule === "ai" && <AIWorkspace language={language} />}

            {activeModule === "bookings" && <BookingsWorkspace />}
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


          </div>
        </main>
      </div>

      {showAddCustomer && (
        <AddCustomerModal
          onClose={() => setShowAddCustomer(false)}
          onSave={addCustomer}
          isSaving={isSavingCustomer}
          errorMessage={addCustomerError}
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
      className={`ertikaz-sidebar fixed inset-y-0 z-50 flex w-[284px] flex-col overflow-hidden border-[#ece0c4] bg-[#fefcf7]/94 text-slate-900 shadow-[0_0_55px_rgba(60,45,10,0.09)] backdrop-blur-2xl transition-transform duration-300 lg:translate-x-0 ${
        language === "ar"
          ? `right-0 border-l ${sidebarOpen ? "translate-x-0" : "translate-x-full"}`
          : `left-0 border-r ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`
      }`}
    >
      <div className="absolute inset-x-0 top-0 h-44 bg-[#fbf3e2]/75" />
      <div className="relative flex h-[78px] items-center justify-between border-b border-white/70 px-4">
        <button type="button" onClick={() => onOpen("dashboard")} className="flex items-center gap-3 text-right">
          <div className="flex h-11 items-center justify-center">
            <img src="/logo.png" alt="إرتكاز" className="h-full w-auto object-contain" />
          </div>
          <div>
            <p className="text-sm font-bold tracking-tight">{language === "ar" ? "إرتكاز" : "ERTIKAZ"}</p>
            <p className="mt-0.5 text-[12.5px] font-medium tracking-[0.16em] text-slate-500">ERTIKAZ OPERATIONS</p>
          </div>
        </button>
        <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/60 text-slate-500 lg:hidden" aria-label="إغلاق القائمة">
          <X size={17} />
        </button>
      </div>

      <div className="relative flex-1 overflow-y-auto px-3 py-4">
        <div className="grid grid-cols-2 gap-2.5">
          {allowedNavigation.map((item) => {
            const Icon = item.icon;
            const active = activeModule === item.key;
            return (
              <button key={item.key} type="button" onClick={() => onOpen(item.key)} className={`group relative flex flex-col items-center justify-center gap-1.5 overflow-hidden rounded-2xl border px-3 py-3.5 text-center transition duration-300 ${active ? "border-[#f0ddb0] bg-white shadow-[0_14px_32px_rgba(60,45,10,0.10)]" : `border-transparent ${item.soft} hover:-translate-y-0.5`}`}>
                {active && <span className="absolute inset-x-0 top-0 h-1 bg-[#c9962c]" />}
                <span className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${item.accent} text-white shadow-sm`}><Icon size={17} /></span>
                <span className="block text-[14px] font-bold text-slate-800">{language === "ar" ? item.label : translateUiText(item.label)}</span>
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
              <div><p className="text-[12.5px] font-bold text-slate-700">{firstName(currentUser.name)}</p><p className="mt-0.5 text-[10.5px] font-medium text-slate-400">{currentUser.role}</p></div>
            </div>
            <span className="text-[11.5px] font-bold text-emerald-600">Online</span>
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

  const moduleAccentMatch = currentModule.soft.match(/text-\[(#[0-9a-fA-F]{6})\]/);
  const moduleAccentHex = moduleAccentMatch ? moduleAccentMatch[1] : "#147f75";
  return (
    <header className="ertikaz-topbar sticky top-0 z-30 border-b border-[#dcebe8] bg-[#fbfefd]/92 backdrop-blur-2xl">
      <div className="flex h-[72px] items-center justify-between gap-3 px-4 sm:px-6 xl:px-7">
        <div className="flex min-w-0 items-center gap-3">
          <button type="button" onClick={onOpenSidebar} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#d8e8e4] bg-white text-slate-700 shadow-sm lg:hidden" aria-label="فتح القائمة"><Menu size={19} /></button>
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
              className={`h-10 w-72 rounded-xl border border-[#d8e8e4] bg-white text-[13.5px] ${language === "ar" ? "pr-9 pl-3" : "pl-9 pr-3"} font-medium text-slate-700 shadow-sm outline-none transition focus:border-[#57a9a0] focus:ring-4 focus:ring-[#dff2ee]`}
            />
            {searchOpen && query.trim() && (
              <div className={`absolute top-12 z-50 w-[360px] overflow-hidden rounded-2xl border border-[#d8e8e4] bg-white p-2 shadow-[0_24px_70px_rgba(20,61,68,.16)] ${language === "ar" ? "right-0" : "left-0"}`}>
                <div className="flex items-center justify-between px-3 py-2"><p className="text-[12.5px] font-bold text-slate-700">نتائج البحث الشامل</p><button type="button" onClick={() => setSearchOpen(false)} className="text-slate-400"><X size={13} /></button></div>
                {searchResults.length > 0 ? (
                  <div className="space-y-1">
                    {searchResults.map((result) => { const ResultIcon = result.icon; return (
                      <button key={`${result.module}-${result.key}`} type="button" onClick={() => openSearchResult(result)} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-right transition hover:bg-[#f0f8f6]">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e5f4f1] text-[#147f75]"><ResultIcon size={15} /></span>
                        <span className="min-w-0 flex-1"><span className="block truncate text-[13.5px] font-bold text-slate-800">{result.title}</span><span className="mt-1 block truncate text-[11.5px] font-medium text-slate-400">{result.meta}</span></span>
                        <ArrowLeft size={13} className="text-slate-300" />
                      </button>
                    ); })}
                  </div>
                ) : <div className="px-4 py-8 text-center text-[12.5px] font-medium text-slate-400">لا توجد نتائج مطابقة.</div>}
              </div>
            )}
          </div>

          <button type="button" onClick={onToggleLanguage} className="flex h-10 items-center gap-1.5 rounded-xl border border-[#d8e8e4] bg-white px-3 text-[12.5px] font-bold text-slate-700 shadow-sm"><Languages size={16} /><span>{language === "ar" ? "EN" : "ع"}</span></button>
          <button type="button" onClick={onToggleTheme} className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#d8e8e4] bg-white text-slate-600 shadow-sm">{theme === "light" ? <Moon size={16} /> : <Sun size={16} />}</button>

          <div className="relative">
            <button type="button" onClick={() => setNotificationsOpen((value) => !value)} className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#d8e8e4] bg-white text-slate-600 shadow-sm" aria-label="الإشعارات">
              <Bell size={17} />
              {unreadCount > 0 && <span className="absolute -left-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#e57c55] px-1 text-[10.5px] font-bold text-white ring-2 ring-white">{unreadCount}</span>}
            </button>
            {notificationsOpen && (
              <div className={`absolute top-12 z-50 w-[350px] overflow-hidden rounded-2xl border border-[#d8e8e4] bg-white shadow-[0_24px_70px_rgba(20,61,68,.16)] ${language === "ar" ? "left-0" : "right-0"}`}>
                <div className="flex items-center justify-between border-b border-[#e5efed] px-4 py-3"><div><p className="text-[13.5px] font-bold text-slate-800">مركز الإشعارات</p><p className="mt-1 text-[11.5px] font-medium text-slate-400">{unreadCount} إشعارات غير مقروءة</p></div><button type="button" onClick={onMarkAllNotifications} className="text-[11.5px] font-bold text-[#147f75]">تحديد الكل كمقروء</button></div>
                <div className="max-h-[360px] overflow-y-auto p-2">
                  {notifications.map((item) => (
                    <button key={item.id} type="button" onClick={() => { onMarkNotification(item.id); onOpenModule(item.module); setNotificationsOpen(false); }} className={`flex w-full items-start gap-3 rounded-xl p-3 text-right transition hover:bg-[#f3f9f7] ${item.read ? "opacity-65" : "bg-[#fbfefd]"}`}>
                      <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${notificationTone[item.tone]}`}><Bell size={14} /></span>
                      <span className="min-w-0 flex-1"><span className="flex items-center gap-2"><span className="truncate text-[12.5px] font-bold text-slate-800">{item.title}</span>{!item.read && <span className="h-1.5 w-1.5 rounded-full bg-[#198f84]" />}</span><span className="mt-1 block text-[11.5px] font-medium leading-5 text-slate-500">{item.description}</span><span className="mt-1 block text-[10.5px] font-medium text-slate-400">{item.time}</span></span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="hidden h-8 w-px bg-[#dce9e6] sm:block" />
          <div className="group relative flex items-center gap-2 rounded-xl border border-[#d8e8e4] bg-white p-1.5 pr-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#236c83] text-[13.5px] font-bold text-white">{firstName(currentUser.name).slice(0, 1)}</div>
            <div className="hidden text-right lg:block"><p className="max-w-28 truncate text-[12.5px] font-bold text-slate-800">{currentUser.name}</p><p className="mt-0.5 text-[11.5px] font-medium text-slate-400">{currentUser.role}</p></div>
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
  invoicedAmountProp,
  openAmountProp,
  collectionRateProp,
  dueInvoicesProp,
  lowStockProp,
  pulseStagesProp,
  priorityItemsProp,
  topCustomersProp,
  refreshing,
  hasError,
  onRefresh,
  onOpenModule,
}: {
  greeting: string;
  currentDate: string;
  customers: number;
  invoices: number;
  payments: number;
  shipments: number;
  revenue: number;
  invoicedAmountProp: number;
  openAmountProp: number;
  collectionRateProp: number;
  dueInvoicesProp: number;
  lowStockProp: number;
  pulseStagesProp: { key: ModuleKey; label: string; count: number; color: string }[];
  priorityItemsProp: { module: ModuleKey; title: string; subtitle: string; color: string }[];
  topCustomersProp: { name: string; amount: number; percent: number }[];
  refreshing: boolean;
  hasError: boolean;
  onRefresh: () => void;
  onOpenModule: (module: ModuleKey) => void;
}) {
  const collected = payments;
  const invoiced = invoicedAmountProp;
  const openAmount = openAmountProp;
  const collectionRate = collectionRateProp;
  const dueInvoices = dueInvoicesProp;
  const lowInventory = lowStockProp;
  const activeShipments = shipments;
  
  const avatarColors = ["#c9962c", "#147f75", "#3b82a6", "#a76553", "#712b13"];
  const kpis = [
    { key: "customers" as ModuleKey, title: "العملاء", value: formatNumber(Number(customers)), hint: "ملفات متكاملة 360°", icon: Users, card: "border-[#e0d9f7] bg-[#faf9ff]", iconTone: "bg-[#ece7fb] text-[#6d4fc4]", line: "bg-[#8a6fd6]" },
    { key: "billing" as ModuleKey, title: "الفوترة", value: formatCurrency(Number(invoiced)), hint: `${dueInvoices} فاتورة غير مسددة`, icon: ReceiptText, card: "border-[#cfe9d7] bg-[#f6fcf8]", iconTone: "bg-[#e1f3e6] text-[#2f8f52]", line: "bg-[#3fa869]" },
    { key: "payments" as ModuleKey, title: "التحصيل", value: `${collectionRate}%`, hint: formatCurrency(Number(payments)), icon: WalletCards, card: "border-[#cbe8e2] bg-[#f5fcfb]", iconTone: "bg-[#dcf3ef] text-[#147f75]", line: "bg-[#1f9c8d]" },
    { key: "shipments" as ModuleKey, title: "الشحنات", value: formatNumber(Number(shipments)), hint: "إجمالي الشحنات المسجلة", icon: Truck, card: "border-[#f3ddbe] bg-[#fffaf3]", iconTone: "bg-[#ffe9d6] text-[#c9762c]", line: "bg-[#e08a3a]" },
  ];

  return (
    <>
            <section className="mb-5 overflow-hidden rounded-[26px] bg-[#356554] p-5 text-white sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[12.5px] font-bold tracking-[0.14em] text-[#b3987a]">{currentDate} — مركز القيادة التنفيذي</p>
            <h2 className="mt-2 text-[23.5px] font-bold leading-[1.4] sm:text-[27.5px]">ملخص الأداء التشغيلي لليوم</h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {!hasError && <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-2 text-[12.5px] font-bold text-[#ecdcc2]"><CheckCircle2 size={13} className="text-[#e8c476]" />كل الوحدات متصلة الآن</span>}
            <button type="button" onClick={onRefresh} disabled={refreshing} className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 text-[13.5px] font-bold text-white transition hover:bg-white/20 disabled:opacity-60"><RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />تحديث البيانات</button>
            
          </div>
        </div>
      </section>

      {hasError && <div className="mb-5 rounded-2xl border border-[#efd7b0] bg-[#fff8e8] p-4 text-[13.5px] font-semibold text-[#8a5c14]">تعذر تحديث بعض بيانات الـAPI، لكن بيانات العرض ومركز العمليات يعملان بصورة طبيعية.</div>}

      <section className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((card) => { const CardIcon = card.icon; return (
          <button key={card.key} type="button" onClick={() => onOpenModule(card.key)} className={`dashboard-kpi dashboard-kpi-${card.key} relative overflow-hidden rounded-[24px] border p-5 text-right shadow-[0_14px_42px_rgba(33,78,80,.07)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_52px_rgba(33,78,80,.11)] ${card.card}`}>
            <span className={`absolute inset-y-0 right-0 w-1 ${card.line}`} />
            <div className="flex items-start justify-between"><span className={`flex h-11 w-11 items-center justify-center rounded-2xl ${card.iconTone}`}><CardIcon size={19} /></span><ArrowLeft size={14} className="text-slate-300" /></div>
            <p className="mt-5 text-[12.5px] font-bold text-slate-500">{card.title}</p><p className="mt-1 text-[27.5px] font-bold text-slate-950">{card.value}</p><p className="mt-1.5 text-[12.5px] font-medium text-slate-500">{card.hint}</p>
          </button>
        ); })}
      </section>
      <section className="mb-5 overflow-hidden rounded-[24px] border border-[#e2eeeb] bg-white p-5">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-[14.5px] font-bold text-slate-700">نبض السلسلة اللوجستية</p>
            <p className="mt-1 text-[13px] font-medium text-slate-400">أعداد حقيقية ومباشرة من كل مرحلة تشغيلية</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eef9f6] px-3 py-1.5 text-[11.5px] font-bold text-[#147f75]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#198f84] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#198f84]" />
            </span>
            مباشر
          </span>
        </div>
        <div className="relative flex items-end justify-between gap-2 pt-4 sm:gap-3">
          <style>{`
            .ertikaz-pulse-line { animation: ertikazDashFlow 3.2s linear infinite; }
            @keyframes ertikazDashFlow { to { stroke-dashoffset: -28; } }
          `}</style>
          <svg className="pointer-events-none absolute inset-x-2 top-1/2 hidden h-10 w-[calc(100%-1rem)] -translate-y-1/2 sm:block" viewBox="0 0 700 60" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0,30 C60,4 120,56 180,30 C240,4 300,56 360,30 C420,4 480,56 540,30 C600,4 660,56 700,30" fill="none" stroke="#d8c79a" strokeWidth="2" strokeDasharray="6 8" className="ertikaz-pulse-line" />
          </svg>
          {(() => {
            const maxPulseCount = Math.max(1, ...pulseStagesProp.map((s) => s.count));
            return pulseStagesProp.map((stage) => {
              const ratio = stage.count / maxPulseCount;
              const tier = ratio >= 0.66 ? 2 : ratio >= 0.33 ? 1 : 0;
              const dotSize = tier === 2 ? "h-16 w-16" : tier === 1 ? "h-14 w-14" : "h-12 w-12";
              const ringSize = tier === 2 ? "h-20 w-20" : tier === 1 ? "h-[72px] w-[72px]" : "h-16 w-16";
              const lift = tier === 2 ? 0 : tier === 1 ? 10 : 18;
              return (
                <button key={stage.key} type="button" onClick={() => onOpenModule(stage.key)} className="group relative flex flex-1 flex-col items-center gap-2" style={{ marginBottom: lift }}>
                  <span className={`relative flex ${ringSize} items-center justify-center rounded-full transition group-hover:scale-105`} style={{ backgroundColor: `${stage.color}22` }}>
                    <span className={`relative flex ${dotSize} items-center justify-center rounded-full text-[15.5px] font-bold text-white`} style={{ backgroundColor: stage.color }}>{stage.count}</span>
                  </span>
                  <span className="text-[14px] font-bold text-slate-600">{stage.label}</span>
                </button>
              );
            });
          })()}
        </div>
      </section>
      <section className="mb-5 grid gap-5 lg:grid-cols-[1.1fr_1fr]">
        <div className="rounded-[24px] border border-[#e2eeeb] bg-white p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[14.5px] font-bold text-slate-700">أولويات ذكية اليوم</p>
            <span className="rounded-lg bg-slate-50 px-2 py-1 text-[10.5px] font-medium text-slate-400">محسوبة تلقائيًا من بياناتك</span>
          </div>
          {priorityItemsProp.length === 0 && <p className="py-6 text-center text-[12.5px] font-medium text-slate-400">لا توجد أولويات عاجلة حاليًا.</p>}
          {priorityItemsProp.map((item, index) => (
            <button key={index} type="button" onClick={() => onOpenModule(item.module)} className="flex w-full items-center gap-3 border-b border-slate-50 py-2.5 text-right last:border-0">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white" style={{ backgroundColor: ["#d4534b", "#c9962c", "#3b82a6", "#7d5ba6", "#1f9c8d"][index % 5] }}>{item.module === "billing" ? <ReceiptText size={16} /> : <Boxes size={16} />}</span>
              <span className="flex-1">
                <span className="block text-[14px] font-bold text-slate-800">{item.title}</span>
                <span className="mt-0.5 block text-[13px] font-medium text-slate-400">{item.subtitle}</span>
              </span>
            </button>
          ))}
        </div>
        <div className="rounded-[24px] border border-[#e2eeeb] bg-white p-5">
          <p className="mb-3 text-[14.5px] font-bold text-slate-700">أفضل العملاء إنفاقًا</p>
          {topCustomersProp.length === 0 && <p className="py-6 text-center text-[12.5px] font-medium text-slate-400">لا يوجد عملاء بعد.</p>}
          {topCustomersProp.map((item, index) => (
            <div key={index} className="mb-2.5 flex items-center gap-2 last:mb-0">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12.5px] font-bold text-white" style={{ backgroundColor: avatarColors[index % avatarColors.length] }}>{item.name.trim().charAt(0)}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-bold text-slate-700">{item.name}</span>
                <span className="mt-1 block h-1.5 rounded-full bg-slate-100"><span className="block h-1.5 rounded-full bg-[#c9962c]" style={{ width: `${item.percent}%` }} /></span>
              </span>
              <span className="shrink-0 text-[13px] font-bold text-slate-700">{formatCurrency(item.amount)}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="grid gap-5">
        <Surface className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#e2eeeb] px-5 py-4"><div><h3 className="text-[16.5px] font-bold text-slate-900">اتجاه الإيرادات والتحصيل</h3><p className="mt-1 text-[11.5px] font-medium text-slate-400">أرقام حقيقية من الباكند مباشرة.</p></div><span className="rounded-xl bg-[#e6f1f8] px-3 py-2 text-[11.5px] font-bold text-[#2d75a3]">لحظي</span></div>
          <div className="p-5">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4"><div><p className="text-[11.5px] font-medium text-slate-400">إجمالي الإيرادات</p><p className="mt-1 text-[28.5px] font-bold text-slate-950">{formatCurrency(Number(revenue))}</p></div><div className="flex gap-4 text-[11.5px] font-bold"><span className="inline-flex items-center gap-1.5 text-[#147f75]"><span className="h-2.5w-2.5 rounded-sm bg-[#198f84]" />محصل</span><span className="inline-flex items-center gap-1.5 text-[#2d75a3]"><span className="h-2.5 w-2.5 rounded-sm bg-[#3b82a6]"/>مفوتر</span></div></div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl bg-[#fff9e8] p-4"><p className="text-[11.5px] font-medium text-[#9b7a35]">الرصيد المفتوح</p><p className="mt-2 text-xl font-bold text-[#956613]">{formatCurrency(openAmount)}</p></div><div className="rounded-2xl bg-[#eef9f6] p-4"><p className="text-[11.5px] font-medium text-[#4d817b]">فواتير مسددة بالكامل</p><p className="mt-2 text-xl font-bold text-[#147f75]">{Math.max(0, Number(invoices) - dueInvoices)}</p></div></div>
          </div>
        </Surface>
      </section>
    </>
  );
}

function CustomersSplitView({
  customers,
  selectedCustomer,
  onSelectCustomer,
  onAddCustomer,
  onDeleteCustomer,
  children,
}: {
  customers: Customer[];
  selectedCustomer: Customer | null;
  onSelectCustomer: (customerId: string) => void;
  onAddCustomer: () => void;
  onDeleteCustomer: (customerId: string) => void;
  children?: React.ReactNode;
}) {
  const [filter, setFilter] = useState<"all" | CustomerType>("all");
  const [search, setSearch] = useState("");
  const filteredCustomers = useMemo(() => {
    const value = search.trim().toLowerCase();
    return customers.filter((customer) => {
      const typeMatches = filter === "all" || customer.type === filter;
      const haystack = [customer.name, customer.email, customer.phone, customer.city].join(" ").toLowerCase();
      const searchMatches = !value || haystack.includes(value);
      return typeMatches && searchMatches;
    });
  }, [customers, filter, search]);
  return (
    <>
      <WorkspaceHeader
        eyebrow="ERTIKAZ CUSTOMER WORKSPACE"
        title="العملاء"
        description={"اضضغطي على أي عميل لفتح ملفه الكامل — الفواتير والشحنات والمدفوعات بمكان واحد. (" + customers.length + " عميل)"}
        icon={Users}
        accent={{ bar: "#fdf8ee", border: "#f0dfb8", stripe: "#c9962c", icon: "#c9962c" }}
        action={
          <button type="button" onClick={onAddCustomer} className="inline-flex h-11 items-center gap-2 rounded-xl bg-gradient-to-l from-[#d9a63b] to-[#c9962c] px-5 text-[12.5px] font-black text-white shadow-lg transition hover:-translate-y-0.5">
            <Plus size={15} /> إضافة عميل
          </button>
        }
      />
      <section className="grid gap-5 xl:grid-cols-[340px_1fr] xl:items-start">
        <Surface className="overflow-hidden p-3">
          <div className="mb-3 space-y-2 px-1">
            <div className="relative">
              <Search size={14} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="ابحثي عن عميل..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pr-10 pl-3 text-[12.5px] font-medium outline-none transition focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              />
            </div>
            <div className="flex gap-2">
              {[
                { key: "all" as const, label: "الكل", active: "bg-[#3d3a2f] text-white", idle: "bg-slate-100 text-slate-500 hover:bg-slate-200" },
                { key: "company" as const, label: "الشركات", active: "bg-[#c9962c] text-white", idle: "bg-[#fdf1de] text-[#b9852b] hover:bg-[#fbe6c4]" },
                { key: "individual" as const, label: "الأفراد", active: "bg-[#0f766e] text-white", idle: "bg-[#eaf3ee] text-[#0f766e] hover:bg-[#dcefe6]" },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setFilter(item.key)}
                  className={"flex-1 rounded-xl px-3 py-2 text-[11.5px] font-bold transition " + (filter === item.key ? item.active : item.idle)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="max-h-[640px] space-y-1.5 overflow-y-auto p-1">
            {filteredCustomers.map((customer) => {
              const color = customerAccentColor(customer.type);
              const active = selectedCustomer?.id === customer.id;
              return (
                <div
                  key={customer.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => onSelectCustomer(customer.id)}
                  onKeyDown={(event) => { if (event.key === "Enter") onSelectCustomer(customer.id); }}
                  className="flex items-center gap-2.5 rounded-2xl p-2.5 text-right transition duration-200 hover:bg-slate-50 hover:-translate-y-0.5"
                  style={{ background: active ? color + "14" : undefined, borderInlineEnd: "3px solid " + (active ? color : color + "2a") }}
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[16.5px] font-black text-white shadow-sm" style={{ background: customerAccentGradient(customer.type) }}>
                    {customer.name.trim().charAt(0)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-black text-slate-900">{customer.name}</p>
                    <p className="mt-0.5 truncate text-[11.5px] font-semibold text-slate-400">{customer.type === "company" ? (customer.contactPerson || "بدون مسؤول تواصل") : customer.phone}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-start gap-1">
                    <span className="text-[10.5px] font-black" style={{ color: color }}>{customer.type === "company" ? "شركة" : "فرد"}</span>
                    <span className={"text-[10.5px] font-black " + (customer.status === "نشط" ? "text-emerald-600" : "text-slate-400")}>{customer.status}</span>
                  </div>
                  <button
                    type="button"
                    onClick={(event) => { event.stopPropagation(); onDeleteCustomer(customer.id); }}
                    className="shrink-0 rounded-lg p-1.5 text-rose-400 transition hover:bg-rose-50 hover:text-rose-600"
                    aria-label="حذف العميل"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              );
            })}
            {filteredCustomers.length === 0 && (
              <div className="p-10 text-center">
                <Search size={22} className="mx-auto text-slate-300" />
                <p className="mt-3 text-[12.5px] font-medium text-slate-400">لا توجد نتائج مطابقة.</p>
              </div>
            )}
          </div>
        </Surface>
        <div className="min-w-0">
          {children ? (
            children
          ) : (
            <Surface className="flex flex-col items-center justify-center gap-3 p-16 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-[22px] bg-gradient-to-br from-[#c9962c] to-[#e0b354] text-white shadow-lg">
                <Users size={26} />
              </span>
              <h3 className="text-[16.5px] font-black text-slate-800">اختاري عميلاً من القائمة</h3>
              <p className="max-w-[280px] text-[12.5px] font-semibold leading-5 text-slate-400">لعرض بياناته وطلباته وفواتيره ومدفوعاته والملاحظات المرتبطة به بمكان واحد.</p>
            </Surface>
          )}
        </div>
      </section>
    </>
  );
}

function CustomerDetail({
  customer,
  activeTab,
  onChangeTab,
  onBack,
  onDeleteCustomer,
}: {
  customer: Customer;
  activeTab: CustomerTab;
  onChangeTab: (tab: CustomerTab) => void;
  onBack: () => void;
  onDeleteCustomer: (customerId: string) => void;
}) {
  const [portalModalOpen, setPortalModalOpen] = useState(false);
  const [portalEmail, setPortalEmail] = useState("");
  const [portalPassword, setPortalPassword] = useState("");
  const [portalError, setPortalError] = useState<string | null>(null);
  const [portalSuccess, setPortalSuccess] = useState<string | null>(null);
  const [isSavingPortal, setIsSavingPortal] = useState(false);
  const createPortalAccount = async () => {
    setIsSavingPortal(true);
    setPortalError(null);
    try {
      const rawId = Number(customer.id.replace("CUS-", ""));
      const response = await fetch("/backend/customer-portal/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer_id: rawId, email: portalEmail, password: portalPassword }),
      });
      if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(text || "تعذر إنشاء الحساب");
      }
      setPortalSuccess("تم إنشاء حساب الدخول: " + portalEmail);
      setPortalModalOpen(false);
      setPortalEmail("");
      setPortalPassword("");
    } catch (error) {
      setPortalError(error instanceof Error ? error.message : "تعذر إنشاء الحساب");
    } finally {
      setIsSavingPortal(false);
    }
  };
  const color = customerAccentColor(customer.type);
  const totalInvoiced = customer.totalSpent + customer.outstanding;
  const tabs: Array<{ key: CustomerTab; label: string; icon: LucideIcon; count?: number }> = [
    { key: "overview", label: "نظرة عامة", icon: LayoutDashboard },
    { key: "invoices", label: "الفواتير", icon: ReceiptText, count: customer.invoices.length },
    { key: "shipments", label: "الشحنات", icon: PackageCheck, count: customer.shipments.length },
    { key: "payments", label: "المدفوعات", icon: WalletCards, count: customer.payments.length },
    { key: "notes", label: "الملاحظات", icon: ClipboardList, count: customer.notes.length },
  ];
  const statTiles = [
    { label: "الشحنات", value: formatNumber(customer.shipments.length), icon: Truck },
    { label: "إجمالي المدفوع", value: formatCurrency(customer.totalSpent), icon: WalletCards },
    { label: "إجمالي المفوتر", value: formatCurrency(totalInvoiced), icon: ReceiptText },
    { label: "الفواتير", value: formatNumber(customer.invoices.length), icon: ClipboardList },
  ];
  return (
    <>
      <button type="button" onClick={onBack} className="mb-3 inline-flex items-center gap-1.5 text-[12.5px] font-black text-slate-600 transition hover:text-slate-900"><ChevronLeft size={13} /> العودة إلى العملاء</button>
      <Surface className="mb-5 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-[19.5px] font-black text-white shadow-md" style={{ background: customerAccentGradient(customer.type) }}>{customer.name.trim().charAt(0)}</span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full px-2.5 py-1 text-[11.5px] font-bold" style={{ backgroundColor: color + "1a", color: color }}>{customer.type === "company" ? "شركة" : "فرد"}</span>
                <h2 className="text-[21.5px] font-black text-slate-900">{customer.name}</h2>
              </div>
              <span className={"mt-2 inline-block rounded-full px-2.5 py-1 text-[11.5px] font-bold ring-1 " + statusTone(customer.status)}>{customer.status}</span>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => { setPortalError(null); setPortalSuccess(null); setPortalModalOpen(true); }}
              className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-slate-50 px-3.5 text-[11.5px] font-bold text-slate-600 transition hover:bg-slate-100"
            >
              <UserCog size={13} /> إنشاء دخول للعميل
            </button>
            <button
              type="button"
              onClick={() => { onDeleteCustomer(customer.id); }}
              className="h-9 rounded-xl bg-rose-50 px-3.5 text-[11.5px] font-bold text-rose-600 transition hover:bg-rose-100"
            >
              حذف العميل
            </button>
          </div>
        </div>
        <div className="my-5 h-px bg-slate-100" />
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {statTiles.map((tile) => (
            <div key={tile.label} className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 transition hover:bg-slate-100">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white" style={{ background: customerAccentGradient(customer.type) }}>
                <tile.icon size={15} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[11.5px] font-medium text-slate-400">{tile.label}</p>
                <p className="mt-0.5 truncate text-[17.5px] font-black text-slate-900">{tile.value}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
          {tabs.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => onChangeTab(tab.key)}
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[12.5px] font-black transition"
                style={active ? { background: color + "14", border: "1.5px solid " + color, color: color } : { border: "1.5px solid transparent", color: "#64748b" }}
              >
                <tab.icon size={12} />
                {tab.label}
                {typeof tab.count === "number" ? " (" + tab.count + ")" : ""}
              </button>
            );
          })}
        </div>
      </Surface>
      {activeTab === "overview" && <CustomerOverview customer={customer} />}
      {activeTab === "invoices" && <InvoiceCards invoices={customer.invoices} />}
      {activeTab === "shipments" && <ShipmentCards shipments={customer.shipments} />}
      {activeTab === "payments" && <PaymentCards payments={customer.payments} />}
      {activeTab === "notes" && <NotesCards notes={customer.notes} />}
      {portalSuccess && (
        <div className="mt-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-[12.5px] font-bold text-emerald-700">{portalSuccess}</div>
      )}
      {portalModalOpen && <div className="workspace-modal"><div className="workspace-modal-card">
        <div className="flex items-center justify-between"><div><p className="text-[11.5px] font-medium text-slate-700">بوابة العملاء</p><h3 className="mt-1 text-[18.5px] font-bold text-slate-900">إنشاء دخول للعميل</h3></div><button type="button" onClick={() => setPortalModalOpen(false)} className="modal-close"><X size={16} /></button></div>
        {portalError && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-[12.5px] font-bold text-red-600">{portalError}</div>}
        <div className="mt-5 grid gap-3">
          <label className="block"><span className="mb-1.5 block text-[11.5px] font-bold text-slate-500">البريد الإلكتروني</span><input className="workspace-input" type="email" placeholder="customer@example.com" value={portalEmail} onChange={(e) => setPortalEmail(e.target.value)} /></label>
          <label className="block"><span className="mb-1.5 block text-[11.5px] font-bold text-slate-500">كلمة المرور</span><input className="workspace-input" type="password" placeholder="8 أحرف على الأقل" value={portalPassword} onChange={(e) => setPortalPassword(e.target.value)} /></label>
        </div>
        <button type="button" disabled={isSavingPortal || !portalEmail || portalPassword.length < 4} onClick={createPortalAccount} className="workspace-primary-button mt-5 w-full disabled:opacity-50">{isSavingPortal ? "جاري الحفظ..." : "إنشاء الحساب"}</button>
      </div></div>}
    </>
  );
}
function CustomerOverview({ customer }: { customer: Customer }) {
  const items = customer.type === "company"
    ? [
        { label: "البريد الإلكتروني", value: customer.email || "غير مسجل" },
        { label: "رقم الجوال", value: customer.phone || "غير مسجل" },
        { label: "السجل التجاري", value: customer.commercialRegistration ?? "غير مسجل" },
        { label: "المدينة", value: customer.city || "غير مسجلة" },
        { label: "مسؤول التواصل", value: customer.contactPerson ?? "غير محدد" },
        { label: "الرقم الضريبي", value: customer.vatNumber ?? "غير مسجل" },
      ]
    : [
        { label: "البريد الإلكتروني", value: customer.email || "غير مسجل" },
        { label: "رقم الجوال", value: customer.phone || "غير مسجل" },
        { label: "رقم الهوية", value: customer.nationalId ?? "غير مسجل" },
        { label: "المدينة", value: customer.city || "غير مسجلة" },
      ];
  return (
    <Surface className="p-5 sm:p-6">
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <div key={item.label} className="rounded-2xl bg-slate-50 p-4">
            <p className="text-[11.5px] font-medium text-slate-400">{item.label}</p>
            <p className="mt-1.5 text-[14.5px] font-bold text-slate-900">{item.value}</p>
          </div>
        ))}
      </div>
    </Surface>
  );
}
function InvoiceCards({ invoices }: { invoices: CustomerInvoice[] }) {
  if (invoices.length === 0) {
    return <EmptyState title="لا توجد فواتير لهذا العميل" icon={ReceiptText} />;
  }
  return (
    <Surface className="divide-y divide-slate-100 overflow-hidden">
      {invoices.map((invoice) => (
        <div key={invoice.id} className="flex flex-wrap items-center gap-4 p-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F0EDF4] text-[#716983]"><ReceiptText size={18} /></span>
          <div className="min-w-[140px] flex-1">
            <p className="text-[13.5px] font-black text-[#456B82]">{invoice.id}</p>
            <h3 className="mt-0.5 text-[14.5px] font-black text-slate-900">{invoice.title}</h3>
          </div>
          <div className="text-[11.5px] font-bold text-slate-400">
            <p>تاريخ الإصدار</p>
            <p className="mt-0.5 text-slate-700">{invoice.issueDate}</p>
          </div>
          <div className="text-[11.5px] font-bold text-slate-400">
            <p>تاريخ الاستحقاق</p>
            <p className="mt-0.5 text-slate-700">{invoice.dueDate}</p>
          </div>
          <p className="text-[17.5px] font-black text-slate-950">{formatCurrency(invoice.amount)}</p>
          <span className={"rounded-full px-3 py-1 text-[11.5px] font-black ring-1 " + statusTone(invoice.status)}>{invoice.status}</span>
        </div>
      ))}
    </Surface>
  );
}
function ShipmentCards({ shipments }: { shipments: CustomerShipment[] }) {
  if (shipments.length === 0) {
    return <EmptyState title="لا توجد شحنات لهذا العميل" icon={PackageOpen} />;
  }
  return (
    <Surface className="divide-y divide-slate-100 overflow-hidden">
      {shipments.map((shipment) => (
        <div key={shipment.id} className="flex flex-wrap items-center gap-4 p-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#F5EFE5] text-[#8E704E]"><Truck size={18} /></span>
          <div className="min-w-[140px] flex-1">
            <p className="text-[13.5px] font-black text-[#8E704E]">{shipment.id}</p>
            <h3 className="mt-0.5 text-[14.5px] font-black text-slate-900">{shipment.carrier}</h3>
            <p className="mt-0.5 text-[12.5px] font-semibold text-slate-500">{shipment.route}</p>
          </div>
          <div className="text-[11.5px] font-bold text-slate-400">
            <p>رقم التتبع</p>
            <p className="mt-0.5 text-[13.5px] font-black text-slate-800">{shipment.tracking}</p>
          </div>
          <p className="text-[11.5px] font-bold text-slate-400">{shipment.date}</p>
          <span className={"rounded-full px-3 py-1 text-[11.5px] font-black ring-1 " + statusTone(shipment.status)}>{shipment.status}</span>
        </div>
      ))}
    </Surface>
  );
}
function PaymentCards({ payments }: { payments: CustomerPayment[] }) {
  if (payments.length === 0) {
    return <EmptyState title="لا توجد مدفوعات لهذا العميل" icon={WalletCards} />;
  }
  return (
    <Surface className="divide-y divide-slate-100 overflow-hidden">
      {payments.map((payment) => (
        <div key={payment.id} className="flex flex-wrap items-center gap-4 p-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"><WalletCards size={18} /></span>
          <div className="min-w-[140px] flex-1">
            <p className="text-[13.5px] font-black text-emerald-700">{payment.id}</p>
            <p className="mt-0.5 text-[12.5px] font-semibold text-slate-500">{payment.method}</p>
          </div>
          <p className="text-[11.5px] font-bold text-slate-400">{payment.date}</p>
          <p className="text-[17.5px] font-black text-slate-950">{formatCurrency(payment.amount)}</p>
          <span className={"rounded-full px-3 py-1 text-[11.5px] font-black ring-1 " + statusTone(payment.status)}>{payment.status}</span>
        </div>
      ))}
    </Surface>
  );
}
function NotesCards({ notes }: { notes: string[] }) {
  if (notes.length === 0) {
    return <EmptyState title="لا توجد ملاحظات على هذا العميل" icon={ClipboardList} />;
  }
  return (
    <Surface className="divide-y divide-slate-100 overflow-hidden">
      {notes.map((note, index) => (
        <div key={note + "-" + index} className="flex items-start gap-3 p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#F5EFE5] text-[#8E704E]"><ClipboardList size={17} /></span>
          <div>
            <p className="text-[11.5px] font-bold text-slate-400">ملاحظة رقم {index + 1}</p>
            <p className="mt-1 text-[13.5px] font-semibold leading-6 text-slate-700">{note}</p>
          </div>
        </div>
      ))}
    </Surface>
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
      <p className="mt-2 text-[13.5px] font-semibold text-slate-400">
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
        className={`flex shrink-0 items-center justify-center rounded-xl font-bold ${compact ? "h-9 w-9 text-[11.5px]" : "h-11 w-11 text-[12.5px]"}`}
        style={{ backgroundColor: brand.soft, color: brand.color, border: `1px solid ${brand.border}` }}
      >
        {brand.code}
      </span>
      <span className="min-w-0 text-right">
        <strong className={`${compact ? "text-[12.5px]" : "text-[14.5px]"} block truncate font-bold text-slate-900`}>{brand.name}</strong>
        <small className={`${compact ? "text-[9.5px]" : "text-[10.5px]"} mt-0.5 block truncate font-medium tracking-[.08em] text-slate-400`}>{brand.latin}</small>
      </span>
    </div>
  );
}


function CarriersView({
  currentUser,
}: {
  deliveryModes?: Record<string, DeliveryMode>;
  onChangeMode?: (carrierId: string, mode: DeliveryMode) => void;
  currentUser: UserRecord | null;
}) {
  const isAdmin = currentUser?.role === "مدير النظام";
  const [companies, setCompanies] = useState<DeliveryCompanyOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [scope, setScope] = useState<"domestic" | "international">("domestic");
  const [viewId, setViewId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<DeliveryCompanyPricingPayload>({});
  const [savingId, setSavingId] = useState<number | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setLoadError(null);
        const data = await getDeliveryCompaniesApi();
        if (!cancelled) {
          setCompanies(data);
          if (data.length > 0) {
            setViewId(data[0].id);
          }
        }
      } catch (err) {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : "تعذر تحميل شركات التوصيل");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const brandTheme = (name: string) => {
    if (name.indexOf("أرامكس") !== -1) {
      return { bg: "#FFF7F7", border: "#F1D4D5", accent: "#C9272C", badge: "ARX", badgeBg: "#C9272C", badgeText: "#ffffff" };
    }
    if (name.indexOf("سمسا") !== -1) {
      return { bg: "#FAF7FC", border: "#E6DCEF", accent: "#66418D", badge: "SMSA", badgeBg: "#66418D", badgeText: "#ffffff" };
    }
    if (name.indexOf("سبل") !== -1) {
      return { bg: "#F4F9FC", border: "#D2E5EF", accent: "#2176A8", badge: "SPL", badgeBg: "#2176A8", badgeText: "#ffffff" };
    }
    if (name.indexOf("DHL") !== -1) {
      return { bg: "#FFF9E5", border: "#FCE38A", accent: "#D40511", badge: "DHL", badgeBg: "#FFCC00", badgeText: "#D40511" };
    }
    if (name.indexOf("ناقل إكسبرس") !== -1) {
      return { bg: "#EEF1F7", border: "#C9D3E4", accent: "#0B1F45", badge: "NAQL", badgeBg: "#0B1F45", badgeText: "#ffffff" };
    }
    return { bg: "#faf7fc", border: "#e4d7ee", accent: "#7c5a9e", badge: name.slice(0, 3).toUpperCase(), badgeBg: "#7c5a9e", badgeText: "#ffffff" };
  };

  const priceFor = (company: DeliveryCompanyOption) => {
    const cost = scope === "domestic" ? company.domestic_cost_price : company.international_cost_price;
    const sell = scope === "domestic" ? company.domestic_sell_price : company.international_sell_price;
    return { cost: cost ?? 0, sell: sell ?? 0, profit: (sell ?? 0) - (cost ?? 0) };
  };

  const priceForLive = (company: DeliveryCompanyOption) => {
    if (editingId === company.id) {
      const cost = scope === "domestic" ? draft.domestic_cost_price : draft.international_cost_price;
      const sell = scope === "domestic" ? draft.domestic_sell_price : draft.international_sell_price;
      return { cost: cost ?? 0, sell: sell ?? 0, profit: (sell ?? 0) - (cost ?? 0) };
    }
    return priceFor(company);
  };

  const cheapestId = companies.length
    ? companies.reduce((best, item) => {
        const bestSell = priceForLive(best).sell;
        const itemSell = priceForLive(item).sell;
        if (itemSell > 0 && (bestSell === 0 || itemSell < bestSell)) return item;
        return best;
      }, companies[0]).id
    : null;

  const marginRows = companies
    .map((item) => {
      const p = priceForLive(item);
      return p.sell > 0 ? { id: item.id, name: item.name, margin: (p.profit / p.sell) * 100 } : null;
    })
    .filter((value): value is { id: number; name: string; margin: number } => value !== null);
  const avgMargin = marginRows.length
    ? Math.round(marginRows.reduce((sum, value) => sum + value.margin, 0) / marginRows.length)
    : 0;
  const topMargin = marginRows.length
    ? marginRows.reduce((best, value) => (value.margin > best.margin ? value : best), marginRows[0])
    : null;

  const startEdit = (company: DeliveryCompanyOption) => {
    setEditingId(company.id);
    setSaveError(null);
    setDraft({
      domestic_cost_price: company.domestic_cost_price ?? 0,
      domestic_sell_price: company.domestic_sell_price ?? 0,
      international_cost_price: company.international_cost_price ?? 0,
      international_sell_price: company.international_sell_price ?? 0,
      responsibility_note: company.responsibility_note ?? "",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setSaveError(null);
  };

  const updateDraft = (field: string, value: string) => {
    setDraft((current) => ({
      ...current,
      [field]: field === "responsibility_note" ? value : Number(value),
    }));
  };

  const saveEdit = async (company: DeliveryCompanyOption) => {
    try {
      setSavingId(company.id);
      setSaveError(null);
      const updated = await updateDeliveryCompanyPricingApi(company.id, draft);
      setCompanies((current) => current.map((item) => (item.id === company.id ? updated : item)));
      setEditingId(null);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "تعذر حفظ الأسعار");
    } finally {
      setSavingId(null);
    }
  };

  const draftCost = scope === "domestic" ? draft.domestic_cost_price : draft.international_cost_price;
  const draftSell = scope === "domestic" ? draft.domestic_sell_price : draft.international_sell_price;
  const draftProfit = (draftSell ?? 0) - (draftCost ?? 0);

  const viewedCompany = companies.find((item) => item.id === viewId) || null;

  return (
    <>
      <WorkspaceHeader
        eyebrow="DELIVERY MANAGEMENT"
        title="شركات التوصيل"
        description="الأسعار الحقيقية لكل شركة، مع هامش الربح ومسؤولية التسليم."
        icon={Truck}
        accent={{ bar: "#f1ecf6", border: "#e0d4ec", stripe: "#7c5a9e", icon: "#7c5a9e" }}
      />
      <section>
        {!loading && !loadError && companies.length > 0 && (
          <div className="mb-6 grid grid-cols-3 gap-4">
            <div className="rounded-2xl border border-[#e4d7ee] bg-white p-5">
              <p className="text-[12.5px] font-bold text-slate-400">شركات التوصيل المعتمدة</p>
              <p className="mt-1.5 text-[19.5px] font-bold text-slate-900">{companies.length} شركات</p>
            </div>
            <div className="rounded-2xl border border-[#e4d7ee] bg-white p-5">
              <p className="text-[12.5px] font-bold text-slate-400">الأعلى هامش ربح</p>
              <p className="mt-1.5 text-[19.5px] font-bold text-slate-900">{topMargin ? topMargin.name : "—"}</p>
              {topMargin && <p className="mt-0.5 text-[12.5px] font-bold text-emerald-600">{Math.round(topMargin.margin)}%</p>}
            </div>
            <div className="rounded-2xl border border-[#e4d7ee] bg-white p-5">
              <p className="text-[12.5px] font-bold text-slate-400">متوسط هامش الربح</p>
              <p className="mt-1.5 text-[19.5px] font-bold text-emerald-700">{avgMargin}%</p>
            </div>
          </div>
        )}

        <div className="mb-5 flex justify-end gap-2">
          {([
            { key: "domestic" as const, label: "الشحن المحلي" },
            { key: "international" as const, label: "الشحن الدولي" },
          ]).map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => setScope(option.key)}
              className={
                "h-10 rounded-xl px-5 text-[13.5px] font-bold transition " +
                (scope === option.key ? "bg-[#0f766e] text-white shadow-md" : "bg-slate-100 text-slate-500 hover:bg-slate-200")
              }
            >
              {option.label}
            </button>
          ))}
        </div>

        {loading && <p className="py-10 text-center text-[13.5px] font-semibold text-slate-400">جاري التحميل...</p>}
        {loadError && <p className="py-10 text-center text-[13.5px] font-semibold text-rose-600">{loadError}</p>}

        {!loading && !loadError && (
          <div className="flex gap-5">
            <aside className="flex w-72 shrink-0 flex-col gap-2.5">
              {companies.map((company) => {
                const theme = brandTheme(company.name);
                const price = priceForLive(company);
                const isViewed = viewId === company.id;
                const isCheapest = cheapestId === company.id;
                const isTopMargin = topMargin ? topMargin.id === company.id : false;
                return (
                  <button
                    key={company.id}
                    type="button"
                    onClick={() => {
                      setViewId(company.id);
                      setEditingId(null);
                    }}
                    className="rounded-xl border p-3.5 text-right transition"
                    style={{
                      borderColor: isViewed ? theme.accent : theme.border,
                      backgroundColor: isViewed ? theme.bg : "#ffffff",
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[12.5px] font-bold"
                        style={{ backgroundColor: theme.badgeBg, color: theme.badgeText }}
                      >
                        {theme.badge}
                      </span>
                      <div>
                        <p className="text-[15.5px] font-bold text-slate-900">{company.name}</p>
                        <p className="text-[12.5px] font-bold text-slate-400">{price.sell} ر.س</p>
                      </div>
                    </div>
                    {(isCheapest || isTopMargin) && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {isCheapest && (
                          <span
                            className="inline-block rounded-md px-2 py-0.5 text-[10.5px] font-bold text-white"
                            style={{ backgroundColor: theme.accent }}
                          >
                            الأقل سعرًا
                          </span>
                        )}
                        {isTopMargin && (
                          <span className="inline-block rounded-md bg-emerald-600 px-2 py-0.5 text-[10.5px] font-bold text-white">
                            الأعلى ربحًا
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </aside>

            <div className="flex-1">
              {viewedCompany && (() => {
                const theme = brandTheme(viewedCompany.name);
                const price = priceFor(viewedCompany);
                const editing = editingId === viewedCompany.id;
                const others = companies
                  .filter((item) => item.id !== viewedCompany.id)
                  .map((item) => priceFor(item).sell)
                  .filter((value) => value > 0);
                const marketAvg = others.length ? Math.round(others.reduce((sum, value) => sum + value, 0) / others.length) : null;
                const diffPct = marketAvg && marketAvg > 0 ? Math.round(((price.sell - marketAvg) / marketAvg) * 100) : null;
                const allSells = companies.map((item) => priceFor(item).sell).filter((value) => value > 0);
                const marketMin = allSells.length ? Math.min(...allSells) : 0;
                const marketMax = allSells.length ? Math.max(...allSells) : 0;
                const barPct = marketMax > marketMin ? Math.round(((price.sell - marketMin) / (marketMax - marketMin)) * 100) : 50;
                return (
                  <div key={viewedCompany.id + "-" + scope} className="rounded-[20px] border p-6" style={{ borderColor: theme.border, backgroundColor: theme.bg }}>
                    <div className="mb-5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span
                          key={"badge-" + viewedCompany.id}
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-[14.5px] font-bold"
                          style={{ backgroundColor: theme.badgeBg, color: theme.badgeText }}
                        >
                          {theme.badge}
                        </span>
                        <div>
                          <p className="text-[18.5px] font-bold text-slate-900">{viewedCompany.name}</p>
                          <p className="mt-0.5 text-[12.5px] font-bold text-slate-400">
                            {scope === "domestic" ? "شحن محلي" : "شحن دولي"}
                          </p>
                        </div>
                      </div>
                      {isAdmin && !editing && (
                        <button
                          type="button"
                          onClick={() => startEdit(viewedCompany)}
                          className="flex h-9 items-center gap-1.5 rounded-lg px-3.5 text-[12.5px] font-bold text-white"
                          style={{ backgroundColor: theme.accent }}
                        >
                          <Pencil size={12} /> تعديل الأسعار
                        </button>
                      )}
                    </div>

                    {editing ? (
                      <div key="carrier-edit-form" className="space-y-4 rounded-2xl bg-white p-5">
                        <p className="text-[12.5px] font-bold text-slate-500">الشحن المحلي</p>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="mb-1 block text-[10.5px] font-bold text-slate-400">سعر التكلفة</label>
                            <input
                              type="number"
                              value={draft.domestic_cost_price ?? 0}
                              onChange={(event) => updateDraft("domestic_cost_price", event.target.value)}
                              className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[14.5px] font-semibold"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-[10.5px] font-bold text-slate-400">سعر البيع (الإجمالي)</label>
                            <input
                              type="number"
                              value={draft.domestic_sell_price ?? 0}
                              onChange={(event) => updateDraft("domestic_sell_price", event.target.value)}
                              className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[14.5px] font-semibold"
                            />
                          </div>
                        </div>
                        <p className="text-[12.5px] font-bold text-slate-500">الشحن الدولي</p>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="mb-1 block text-[10.5px] font-bold text-slate-400">سعر التكلفة</label>
                            <input
                              type="number"
                              value={draft.international_cost_price ?? 0}
                              onChange={(event) => updateDraft("international_cost_price", event.target.value)}
                              className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[14.5px] font-semibold"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-[10.5px] font-bold text-slate-400">سعر البيع (الإجمالي)</label>
                            <input
                              type="number"
                              value={draft.international_sell_price ?? 0}
                              onChange={(event) => updateDraft("international_sell_price", event.target.value)}
                              className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[14.5px] font-semibold"
                            />
                          </div>
                        </div>
                        <div className="flex items-center justify-between rounded-lg px-3.5 py-2.5" style={{ backgroundColor: theme.bg }}>
                          <span className="text-[11.5px] font-bold text-slate-500">
                            الربح المتوقع ({scope === "domestic" ? "محلي" : "دولي"}) - يتحدث تلقائي
                          </span>
                          <span className="text-[16.5px] font-bold" style={{ color: theme.accent }}>
                            {draftProfit} ر.س
                          </span>
                        </div>
                        <div>
                          <label className="mb-1 block text-[10.5px] font-bold text-slate-400">مسؤولية التسليم</label>
                          <input
                            type="text"
                            value={draft.responsibility_note ?? ""}
                            onChange={(event) => updateDraft("responsibility_note", event.target.value)}
                            placeholder="مثال: شركة التوصيل"
                            className="h-10 w-full rounded-lg border border-slate-200 px-3 text-[14.5px] font-semibold"
                          />
                        </div>
                        {saveError && <p className="text-[11.5px] font-bold text-rose-600">{saveError}</p>}
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => saveEdit(viewedCompany)}
                            disabled={savingId === viewedCompany.id}
                            className="h-10 flex-1 rounded-lg text-[13.5px] font-bold text-white disabled:opacity-60"
                            style={{ backgroundColor: theme.accent }}
                          >
                            {savingId === viewedCompany.id ? "جاري الحفظ..." : "حفظ"}
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="h-10 flex-1 rounded-lg bg-slate-100 text-[13.5px] font-bold text-slate-600"
                          >
                            إلغاء
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div key="carrier-view-panel" className="rounded-2xl bg-white p-7">
                        <p className="mb-5 text-[12.5px] font-bold text-slate-400">
                          أسعار {scope === "domestic" ? "الشحن المحلي" : "الشحن الدولي"}
                        </p>
                        <div className="mb-6 grid grid-cols-3 gap-4">
                          <div className="rounded-xl bg-slate-50 px-4 py-4">
                            <p className="text-[11.5px] font-bold text-slate-400">التكلفة</p>
                            <p className="mt-1 text-[20.5px] font-bold text-slate-800">{price.cost} ر.س</p>
                          </div>
                          <div className="rounded-xl px-4 py-4" style={{ backgroundColor: theme.bg }}>
                            <p className="text-[11.5px] font-bold" style={{ color: theme.accent }}>الإجمالي</p>
                            <p className="mt-1 text-[20.5px] font-bold" style={{ color: theme.accent }}>{price.sell} ر.س</p>
                          </div>
                          <div className="rounded-xl bg-emerald-50 px-4 py-4">
                            <p className="text-[11.5px] font-bold text-emerald-700">الربح</p>
                            <p className="mt-1 text-[20.5px] font-bold text-emerald-700">{price.profit} ر.س</p>
                          </div>
                        </div>

                        {marketAvg !== null && (
                          <div className="mb-6 rounded-xl border border-slate-100 bg-slate-50 p-4">
                            <div className="mb-3 flex items-center justify-between">
                              <p className="text-[12.5px] font-bold text-slate-400">موقع السعر مقارنة بباقي الناقلين</p>
                              {diffPct !== null && (
                                <p
                                  className="text-[13.5px] font-bold"
                                  style={{ color: diffPct <= 0 ? "#15803d" : "#c2653f" }}
                                >
                                  {diffPct <= 0
                                    ? "أرخص بـ " + Math.abs(diffPct) + "% من المتوسط"
                                    : "أعلى بـ " + diffPct + "% من المتوسط"}
                                </p>
                              )}
                            </div>
                            <div className="relative h-2 w-full rounded-full bg-slate-200">
                              <div
                                className="absolute top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-2 border-white shadow"
                                style={{ right: (100 - barPct) + "%", backgroundColor: theme.accent }}
                              />
                            </div>
                            <div className="mt-2 flex justify-between text-[10.5px] font-bold text-slate-400">
                              <span>الأعلى {marketMax} ر.س</span>
                              <span>الأقل {marketMin} ر.س</span>
                            </div>
                          </div>
                        )}

                        {viewedCompany.responsibility_note && (
                          <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                            <p className="text-[11.5px] font-bold text-slate-400">مسؤولية التسليم</p>
                            <p className="mt-1 text-[14.5px] font-semibold text-slate-600">{viewedCompany.responsibility_note}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </section>
    </>
  );
}
function CarrierPricingModal({ onClose }: { onClose: () => void }) {
  const [companies, setCompanies] = useState<DeliveryCompanyOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [saveError, setSaveError] = useState<Record<number, string>>({});
  const [saveSuccess, setSaveSuccess] = useState<Record<number, boolean>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setLoadError(null);
        const data = await getDeliveryCompaniesApi();
        if (!cancelled) setCompanies(data);
      } catch (err) {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : "تعذر تحميل شركات التوصيل");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const updateField = (id: number, field: string, value: string) => {
    setCompanies((current) =>
      current.map((company) => {
        if (company.id !== id) return company;
        if (field === "responsibility_note") {
          return { ...company, responsibility_note: value };
        }
        return { ...company, [field]: Number(value) };
      })
    );
  };

  const brandTheme = (name: string) => {
    if (name.indexOf("أرامكس") !== -1) {
      return { bg: "#FFF7F7", border: "#F1D4D5", accent: "#C9272C", badge: "ARX" };
    }
    if (name.indexOf("سمسا") !== -1) {
      return { bg: "#FAF7FC", border: "#E6DCEF", accent: "#66418D", badge: "SMSA" };
    }
    if (name.indexOf("سبل") !== -1) {
      return { bg: "#F4F9FC", border: "#D2E5EF", accent: "#2176A8", badge: "SPL" };
    }
    return { bg: "#faf7fc", border: "#e4d7ee", accent: "#7c5a9e", badge: name.slice(0, 3).toUpperCase() };
  };

  const handleSave = async (company: DeliveryCompanyOption) => {
    try {
      setSavingId(company.id);
      setSaveError((current) => ({ ...current, [company.id]: "" }));
      const payload: DeliveryCompanyPricingPayload = {
        domestic_cost_price: company.domestic_cost_price ?? 0,
        domestic_sell_price: company.domestic_sell_price ?? 0,
        international_cost_price: company.international_cost_price ?? 0,
        international_sell_price: company.international_sell_price ?? 0,
        responsibility_note: company.responsibility_note ?? "",
      };
      await updateDeliveryCompanyPricingApi(company.id, payload);
      setSaveSuccess((current) => ({ ...current, [company.id]: true }));
      setTimeout(() => {
        setSaveSuccess((current) => ({ ...current, [company.id]: false }));
      }, 2000);
    } catch (err) {
      setSaveError((current) => ({
        ...current,
        [company.id]: err instanceof Error ? err.message : "تعذر حفظ الأسعار",
      }));
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[24px] bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-[18.5px] font-bold text-slate-900">إدارة أسعار شركات التوصيل</h3>
            <p className="mt-1 text-[12.5px] font-medium text-slate-400">مرئي للأدمن فقط — هذي الأسعار ما تظهر للموظفين.</p>
          </div>
          <button type="button" onClick={onClose} className="modal-close"><X size={16} /></button>
        </div>
        {loading && <p className="py-8 text-center text-[13.5px] font-semibold text-slate-400">جاري التحميل...</p>}
        {loadError && <p className="py-8 text-center text-[13.5px] font-semibold text-rose-600">{loadError}</p>}
        {!loading && !loadError && (
          <div className="space-y-4">
            {companies.map((company) => {
              const theme = brandTheme(company.name);
              const domesticProfit = (company.domestic_sell_price ?? 0) - (company.domestic_cost_price ?? 0);
              const internationalProfit = (company.international_sell_price ?? 0) - (company.international_cost_price ?? 0);
              return (
                <div key={company.id} className="overflow-hidden rounded-[16px] border" style={{ borderColor: theme.border }}>
                  <div className="flex items-center gap-2.5 px-4 py-3" style={{ backgroundColor: theme.bg }}>
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[13.5px] font-bold text-white"
                      style={{ backgroundColor: theme.accent }}
                    >
                      {theme.badge}
                    </span>
                    <p className="text-[15.5px] font-bold text-slate-900">{company.name}</p>
                  </div>
                  <div className="p-4">
                    <p className="mb-2 text-[12.5px] font-bold text-slate-500">الشحن المحلي</p>
                    <div className="mb-3 grid grid-cols-3 gap-2">
                      <div>
                        <label className="mb-1 block text-[10.5px] font-bold text-slate-400">سعر التكلفة</label>
                        <input
                          type="number"
                          value={company.domestic_cost_price ?? 0}
                          onChange={(event) => updateField(company.id, "domestic_cost_price", event.target.value)}
                          className="h-9 w-full rounded-lg border border-slate-200 px-2 text-[13.5px] font-semibold"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[10.5px] font-bold text-slate-400">سعر البيع</label>
                        <input
                          type="number"
                          value={company.domestic_sell_price ?? 0}
                          onChange={(event) => updateField(company.id, "domestic_sell_price", event.target.value)}
                          className="h-9 w-full rounded-lg border border-slate-200 px-2 text-[13.5px] font-semibold"
                        />
                      </div>
                      <div className="rounded-lg bg-emerald-50 px-2 py-1.5">
                        <p className="text-[10.5px] font-bold text-emerald-700">الربح</p>
                        <p className="text-[15.5px] font-bold text-emerald-700">{domesticProfit} ر.س</p>
                      </div>
                    </div>
                    <p className="mb-2 text-[12.5px] font-bold text-slate-500">الشحن الدولي</p>
                    <div className="mb-3 grid grid-cols-3 gap-2">
                      <div>
                        <label className="mb-1 block text-[10.5px] font-bold text-slate-400">سعر التكلفة</label>
                        <input
                          type="number"
                          value={company.international_cost_price ?? 0}
                          onChange={(event) => updateField(company.id, "international_cost_price", event.target.value)}
                          className="h-9 w-full rounded-lg border border-slate-200 px-2 text-[13.5px] font-semibold"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[10.5px] font-bold text-slate-400">سعر البيع</label>
                        <input
                          type="number"
                          value={company.international_sell_price ?? 0}
                          onChange={(event) => updateField(company.id, "international_sell_price", event.target.value)}
                          className="h-9 w-full rounded-lg border border-slate-200 px-2 text-[13.5px] font-semibold"
                        />
                      </div>
                      <div className="rounded-lg bg-emerald-50 px-2 py-1.5">
                        <p className="text-[10.5px] font-bold text-emerald-700">الربح</p>
                        <p className="text-[15.5px] font-bold text-emerald-700">{internationalProfit} ر.س</p>
                      </div>
                    </div>
                    <label className="mb-1 block text-[10.5px] font-bold text-slate-400">مسؤولية التسليم عند التأخير أو التلف</label>
                    <input
                      type="text"
                      value={company.responsibility_note ?? ""}
                      onChange={(event) => updateField(company.id, "responsibility_note", event.target.value)}
                      placeholder="مثال: شركة التوصيل"
                      className="mb-3 h-9 w-full rounded-lg border border-slate-200 px-3 text-[13.5px] font-semibold"
                    />
                    {saveError[company.id] && (
                      <p className="mb-2 text-[11.5px] font-bold text-rose-600">{saveError[company.id]}</p>
                    )}
                    <button
                      type="button"
                      onClick={() => handleSave(company)}
                      disabled={savingId === company.id}
                      className="h-9 w-full rounded-lg text-[12.5px] font-bold text-white disabled:opacity-60"
                      style={{ backgroundColor: theme.accent }}
                    >
                      {savingId === company.id ? "جاري الحفظ..." : saveSuccess[company.id] ? "تم الحفظ" : "حفظ الأسعار"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
function WorkspaceHeader({
  eyebrow,
  title,
  description: _description,
  icon: Icon,
  action,
  accent,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  action?: ReactNode;
  accent?: { bar: string; border: string; stripe: string; icon: string };
}) {
  const theme = accent ?? { bar: "#f7fcfb", border: "#cfe7e2", stripe: "#159487", icon: "#147f75" };
  return (
    <section
      className="workspace-header ertikaz-surface relative mb-5 overflow-hidden rounded-[24px] border px-5 py-4 shadow-[0_14px_44px_rgba(47,108,106,0.08)] backdrop-blur-xl sm:px-6"
      style={{ borderColor: theme.border, background: "linear-gradient(135deg, " + theme.bar + " 0%, #ffffff 68%)" }}
    >
      <span className="absolute inset-y-0 right-0 w-1.5" style={{ backgroundColor: theme.stripe }} />
      <Icon
        size={132}
        className="pointer-events-none absolute -bottom-8 -left-8 opacity-[0.07]"
        style={{ color: theme.icon, transform: "rotate(-14deg)" }}
      />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg"
            style={{ background: "linear-gradient(135deg, " + theme.icon + ", " + theme.stripe + ")", boxShadow: "0 10px 22px -4px " + theme.icon + "66" }}
          >
            <Icon size={18} />
          </span>
          <div className="min-w-0">
            {eyebrow && (
              <p className="mb-0.5 text-[11.5px] font-black tracking-[0.16em]" style={{ color: theme.icon }}>
                {eyebrow}
              </p>
            )}
            <h2 className="text-[23.5px] font-bold text-slate-950 sm:text-[27.5px]">{title}</h2>
          </div>
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
          <p className="text-[11.5px] font-medium text-slate-400">{label}</p>
          <div className="mt-1 flex items-end justify-between gap-2">
            <p className="truncate text-[20.5px] font-bold text-slate-950">{value}</p>
          </div>
          <p className="mt-1 truncate text-[11.5px] font-medium text-slate-400">{note}</p>
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
        accent={{ bar: "#fffbeb", border: "#fde68a", stripe: "#d97706", icon: "#b45309" }}
        action={
          <button
            type="button"
            onClick={() => setShowCreateInvoice(true)}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-slate-900 px-5 text-[12.5px] font-bold text-white shadow-lg"
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
            <h3 className="text-[16.5px] font-bold text-slate-900">سجل الفواتير</h3>
            <p className="mt-1 text-[11.5px] font-medium text-slate-400">راجعي الحالة والمبلغ والاستحقاق من قائمة واحدة.</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex flex-wrap gap-2">
              {(["الكل", "مسودة", "جزئية", "متأخرة", "مدفوعة"] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={`rounded-xl px-3 py-2 text-[11.5px] font-bold transition ${statusFilter === status ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500"}`}
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
                className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pr-10 pl-3 text-[12.5px] font-medium outline-none focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
              />
            </div>
          </div>
        </div>

        <div className="hidden grid-cols-[1.35fr_.65fr_.65fr_.7fr_.55fr_auto] gap-3 border-b border-slate-100 bg-slate-50 px-5 py-3 text-[10.5px] font-bold text-slate-400 md:grid">
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
                <div className="min-w-0"><p className="text-[11.5px] font-bold text-[#367fa9]">{invoice.id}</p><h3 className="mt-1 truncate text-[12.5px] font-bold text-slate-900">{invoice.customer}</h3><p className="mt-1 truncate text-[11.5px] font-medium text-slate-400">{invoice.title}</p></div>
                <div><p className="text-[10.5px] font-medium text-slate-400 md:hidden">الإجمالي</p><p className="mt-1 text-[12.5px] font-bold text-slate-800">{formatCurrency(invoice.amount)}</p></div>
                <div><p className="text-[10.5px] font-medium text-slate-400 md:hidden">المحصل</p><p className="mt-1 text-[12.5px] font-bold text-emerald-700">{formatCurrency(invoice.paid)}</p><div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#88B8AC]" style={{ width: `${progress}%` }} /></div></div>
                <div><p className="text-[10.5px] font-medium text-slate-400 md:hidden">الاستحقاق</p><p className="mt-1 text-[11.5px] font-bold text-slate-700">{invoice.dueDate}</p></div>
                <span className={`w-fit rounded-full px-3 py-1 text-[10.5px] font-bold ring-1 ${statusTone(invoice.status)}`}>{invoice.status}</span>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-400 transition group-hover:bg-slate-900 group-hover:text-white"><ArrowLeft size={12} /></span>
              </button>
            );
          })}
        </div>
      </Surface>

      {selected && (
        <DetailPanel title={selected.id} subtitle={selected.customer} icon={ReceiptText} onClose={() => setSelectedId(null)}>
          <div className="rounded-[22px] bg-[#f8fcfb] p-5">
            <p className="text-[11.5px] font-bold text-[#367fa9]">{selected.category}</p>
            <h3 className="mt-2 text-[17.5px] font-bold text-slate-900">{selected.title}</h3>
            <p className="mt-3 text-[26.5px] font-bold text-slate-950">{formatCurrency(selected.amount)}</p>
          </div>
          <InfoGrid items={[
            { label: "تاريخ الإصدار", value: selected.issueDate },
            { label: "تاريخ الاستحقاق", value: selected.dueDate },
            { label: "تم تحصيله", value: formatCurrency(selected.paid) },
            { label: "المتبقي", value: formatCurrency(selected.amount - selected.paid) },
          ]} />
          {selected.notes && <div className="mt-4 rounded-2xl bg-slate-50 p-4"><p className="text-[11.5px] font-medium text-slate-400">ملاحظات</p><p className="mt-2 text-[12.5px] font-medium leading-5 text-slate-700">{selected.notes}</p></div>}
          {selected.status !== "مدفوعة" && (
            <button type="button" onClick={() => registerPayment(selected.id)} className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 text-[12.5px] font-bold text-white shadow-lg shadow-emerald-200"><CheckCircle2 size={15} /> تسجيل السداد الكامل</button>
          )}
          <button type="button" onClick={() => { if (window.confirm("حذف هذه الفاتورة؟")) deleteInvoice(selected.id); }} className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 text-[12.5px] font-bold text-red-600"><Trash2 size={14} /> حذف الفاتورة</button>
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
  const [payments, setPayments] = useState<ApiPayment[]>([]);
  const [invoices, setInvoices] = useState<ApiInvoice[]>([]);
  const [customers, setCustomers] = useState<ApiCustomer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [method, setMethod] = useState<string>("الكل");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [draft, setDraft] = useState({ invoice_id: "", amount: "", payment_method: "تحويل بنكي" });
  const loadAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [paymentsList, invoicesList, customersList] = await Promise.all([
        getPaymentsApi(),
        getInvoicesApi(),
        getCustomersApi(),
      ]);
      setPayments(paymentsList);
      setInvoices(invoicesList);
      setCustomers(customersList);
    } catch (err) {
      console.error("Payments API error:", err);
      setError(err instanceof Error ? err.message : "تعذر تحميل المدفوعات");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { void loadAll(); }, [loadAll]);
  const customerName = (id: number) => customers.find((item) => item.id === id)?.name ?? `عميل #${id}`;
  const paidForInvoice = (invoiceId: number) => payments.filter((item) => item.invoice_id === invoiceId).reduce((sum, item) => sum + item.amount, 0);
  const openInvoices = invoices.map((invoice) => ({ invoice, remaining: invoice.total - paidForInvoice(invoice.id) })).filter((item) => item.remaining > 0.01);
  const methods = Array.from(new Set(["تحويل بنكي", "دفع عند الاستلام", "Apple Pay", ...payments.map((item) => item.payment_method)]));
  const selected = payments.find((item) => item.id === selectedId) ?? null;
  const visible = payments.filter((item) => method === "الكل" || item.payment_method === method);
  const total = payments.reduce((sum, item) => sum + item.amount, 0);
  const openAmount = openInvoices.reduce((sum, item) => sum + item.remaining, 0);
  const openNew = () => {
    setDraft({ invoice_id: openInvoices[0] ? String(openInvoices[0].invoice.id) : "", amount: "", payment_method: "تحويل بنكي" });
    setSaveError(null);
    setFormOpen(true);
  };
  const selectedInvoice = invoices.find((item) => item.id === Number(draft.invoice_id)) ?? null;
  const selectedRemaining = selectedInvoice ? selectedInvoice.total - paidForInvoice(selectedInvoice.id) : 0;
  const savePayment = async () => {
    if (!draft.invoice_id || !draft.amount || Number(draft.amount) <= 0) return;
    const invoice = invoices.find((item) => item.id === Number(draft.invoice_id));
    if (!invoice) return;
    try {
      setIsSaving(true);
      setSaveError(null);
      await createPaymentApi({ customer_id: invoice.customer_id, invoice_id: invoice.id, amount: Number(draft.amount), payment_method: draft.payment_method });
      setFormOpen(false);
      await loadAll();
    } catch (err) {
      console.error("Create payment API error:", err);
      setSaveError(err instanceof Error ? err.message : "تعذر إضافة الدفعة");
    } finally {
      setIsSaving(false);
    }
  };
  const methodColors: Record<string, string> = {
    "تحويل بنكي": "#8a72ab",
    "دفع عند الاستلام": "#c2853a",
    "Apple Pay": "#3a3a3c",
  };
    return (
    <>
      <WorkspaceHeader
        eyebrow="PAYMENT OPERATIONS"
        title="المدفوعات"
        description="تسجيل الدفعات الحقيقية وربطها بالفواتير المفتوحة."
        icon={WalletCards}
        accent={{ bar: "#f2eef9", border: "#ded3ec", stripe: "#8a72ab", icon: "#8a72ab" }}
        action={<button type="button" onClick={openNew} disabled={openInvoices.length === 0} className="workspace-primary-button"><Plus size={14} /> إضافة دفعة</button>}
      />
<section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MiniStat label="إجمالي المدفوعات" value={formatCurrency(total)} icon={WalletCards} tone="bg-sky-50 text-sky-700" note="كل العمليات" />
        <MiniStat label="عدد العمليات" value={String(payments.length)} icon={CheckCircle2} tone="bg-emerald-50 text-emerald-700" note="دفعات مسجلة" />
        <MiniStat label="مبالغ مفتوحة" value={formatCurrency(openAmount)} icon={ScanLine} tone="bg-amber-50 text-amber-700" note="مستحق من فواتير غير مسددة بالكامل" />
        <MiniStat label="طرق الدفع" value={String(methods.length)} icon={CreditCard} tone="bg-blue-50 text-blue-700" note="قنوات مستخدمة" />
      </section>
      {loading && (
        <Surface className="p-10 text-center text-[14.5px] font-bold text-slate-500">جاري تحميل المدفوعات...</Surface>
      )}
      {!loading && error && (
        <Surface className="flex flex-col items-center gap-3 border-red-200 bg-red-50 p-10 text-center">
          <p className="text-[14.5px] font-bold text-red-600">{error}</p>
          <button type="button" onClick={() => void loadAll()} className="rounded-xl bg-red-600 px-4 py-2 text-[13.5px] font-black text-white">إعادة المحاولة</button>
        </Surface>
      )}
      {!loading && !error && (
        <>
          <Surface className="p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h3 className="text-[15.5px] font-bold text-slate-900">سجل المدفوعات</h3>
                <p className="mt-1 text-[10.5px] font-medium text-slate-400">كل دفعة مربوطة بفاتورة حقيقية من النظام.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {["الكل", ...methods].map((item) => (
                  <button key={item} type="button" onClick={() => setMethod(item)} className={`workspace-filter ${method === item ? "is-active" : ""}`}>{item}</button>
                ))}
              </div>
            </div>
          </Surface>
          {visible.length === 0 && (
            <Surface className="mt-4 p-10 text-center text-[14.5px] font-bold text-slate-400">لا توجد مدفوعات بعد.</Surface>
          )}
          {visible.length > 0 && (
            <div className="mt-4 rounded-3xl bg-[#f5f2fa] p-4 sm:p-5">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {visible.map((payment) => {
                  const invoice = invoices.find((item) => item.id === payment.invoice_id);
                  const methodColor = methodColors[payment.payment_method] || "#8a72ab";
                  return (
                    <button
                      key={payment.id}
                      type="button"
                      onClick={() => setSelectedId(payment.id)}
                      className="group relative flex w-full flex-col overflow-hidden rounded-2xl bg-white text-right shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      <span className="absolute inset-y-0 right-0 w-1.5" style={{ background: methodColor }} />
                      <div className="flex items-center justify-between gap-3 p-4 pr-5">
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: `${methodColor}18`, color: methodColor }}>
                            <WalletCards size={16} />
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-[13px] font-bold text-slate-800">{customerName(payment.customer_id)}</p>
                            <p className="mt-0.5 truncate text-[10.5px] font-medium text-slate-400">{invoice?.invoice_number ?? `فاتورة #${payment.invoice_id}`}</p>
                          </div>
                        </div>
                        <span className="shrink-0 text-[9.5px] font-bold text-slate-300">PAY-{String(payment.id).padStart(5, "0")}</span>
                      </div>
                      <div className="mx-4 border-t border-dashed border-slate-200" />
                      <div className="flex items-center justify-between p-4 pr-5 pt-3">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-300">{payment.payment_method}</p>
                          <p className="mt-0.5 text-[10.5px] font-medium text-slate-400">{new Date(payment.created_at).toLocaleDateString("ar-SA")}</p>
                        </div>
                        <p className="text-[18.5px] font-black" style={{ color: methodColor }}>{formatCurrency(payment.amount)}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
      {selected && (() => {
        const invoice = invoices.find((item) => item.id === selected.invoice_id);
        const invoicePayments = payments.filter((item) => item.invoice_id === selected.invoice_id);
        const paidTotal = invoicePayments.reduce((sum, item) => sum + item.amount, 0);
        const remaining = invoice ? invoice.total - paidTotal : 0;
        const pct = invoice && invoice.total > 0 ? Math.min(100, (paidTotal / invoice.total) * 100) : 0;
        const customerPayments = payments.filter((item) => item.customer_id === selected.customer_id);
        const customerTotal = customerPayments.reduce((sum, item) => sum + item.amount, 0);
        return (
          <DetailPanel title={`PAY-${String(selected.id).padStart(5, "0")}`} subtitle={customerName(selected.customer_id)} icon={WalletCards} onClose={() => setSelectedId(null)}>
            <div className="rounded-2xl bg-gradient-to-l from-[#6f5993] to-[#8a72ab] p-5 text-white">
              <p className="text-[11.5px] font-bold text-white/70">{invoice?.invoice_number ?? `فاتورة #${selected.invoice_id}`}</p>
              <p className="mt-2 text-[26.5px] font-black">{formatCurrency(selected.amount)}</p>
              <p className="mt-1 text-[11px] font-semibold text-white/60">قيمة هذه الدفعة</p>
            </div>
            <InfoGrid items={[
              { label: "طريقة الدفع", value: selected.payment_method },
              { label: "تاريخ الدفعة", value: new Date(selected.created_at).toLocaleDateString("ar-SA") },
              { label: "العميل", value: customerName(selected.customer_id) },
              { label: "إجمالي الفاتورة", value: invoice ? formatCurrency(invoice.total) : "-" },
              { label: "المحصّل من الفاتورة", value: formatCurrency(paidTotal) },
              { label: "المتبقي على الفاتورة", value: formatCurrency(Math.max(0, remaining)) },
            ]} />
            <div className="mt-4">
              <div className="mb-1.5 flex items-center justify-between text-[11px] font-bold text-slate-500">
                <span>نسبة التحصيل من الفاتورة</span>
                <span>{pct.toFixed(0)}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-[#8a72ab]" style={{ width: `${pct}%` }} />
              </div>
            </div>
            {invoicePayments.length > 1 && (
              <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <p className="mb-3 text-[11.5px] font-bold text-slate-500">كل الدفعات على هذه الفاتورة</p>
                <div className="space-y-2">
                  {invoicePayments.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-[12px] font-semibold text-slate-700">
                      <span>{new Date(item.created_at).toLocaleDateString("ar-SA")} · {item.payment_method}</span>
                      <span className={item.id === selected.id ? "font-black text-[#237c82]" : ""}>{formatCurrency(item.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
                      {customerPayments.length > 1 && (
              <div className="mt-5 rounded-2xl p-4" style={{ background: "#f2eef9" }}>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[11.5px] font-bold text-slate-600">كل مدفوعات هذا العميل</p>
                  <p className="text-[11.5px] font-black text-[#8a72ab]">{formatCurrency(customerTotal)}</p>
                </div>
                <div className="space-y-2">
                  {customerPayments.map((item) => {
                    const itemInvoice = invoices.find((inv) => inv.id === item.invoice_id);
                    return (
                      <div key={item.id} className="flex items-center justify-between rounded-xl bg-white/70 px-3 py-2 text-[12px] font-semibold text-slate-700">
                        <span className="truncate">{itemInvoice?.invoice_number ?? item.invoice_id} · {new Date(item.created_at).toLocaleDateString("ar-SA")}</span>
                        <span className={item.id === selected.id ? "font-black text-[#8a72ab]" : ""}>{formatCurrency(item.amount)}{item.id === selected.id ? " · هذه الدفعة" : ""}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </DetailPanel>
        );
      })()}
      {formOpen && (
        <div className="workspace-modal">
          <div className="workspace-modal-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11.5px] font-medium text-emerald-700">المدفوعات</p>
                <h3 className="mt-1 text-[18.5px] font-bold text-slate-900">إضافة دفعة جديدة</h3>
              </div>
              <button type="button" onClick={() => setFormOpen(false)} className="modal-close"><X size={16} /></button>
            </div>
            {openInvoices.length === 0 && <p className="mt-4 text-[12.5px] font-bold text-slate-500">لا توجد فواتير مفتوحة بحاجة لتحصيل حالياً.</p>}
            {openInvoices.length > 0 && (
              <div className="mt-5 grid gap-3">
                <select className="workspace-input" value={draft.invoice_id} onChange={(e) => setDraft({ ...draft, invoice_id: e.target.value })}>
                  {openInvoices.map(({ invoice, remaining }) => (
                    <option key={invoice.id} value={invoice.id}>{invoice.invoice_number} — {customerName(invoice.customer_id)} — المتبقي {formatCurrency(remaining)}</option>
                  ))}
                </select>
                <input className="workspace-input" type="number" placeholder="المبلغ" value={draft.amount} onChange={(e) => setDraft({ ...draft, amount: e.target.value })} max={selectedRemaining} />
                <select className="workspace-input" value={draft.payment_method} onChange={(e) => setDraft({ ...draft, payment_method: e.target.value })}>
                  <option>تحويل بنكي</option>
                  <option>دفع عند الاستلام</option>
                </select>
                {saveError && <p className="text-[12.5px] font-bold text-red-600">{saveError}</p>}
                <button type="button" disabled={isSaving} onClick={() => void savePayment()} className="workspace-primary-button w-full">{isSaving ? "جاري الحفظ..." : "إضافة الدفعة"}</button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
function ShipmentsWorkspace() {
  const DOMESTIC_DEFAULT_COST = 25;
  const INTERNATIONAL_DEFAULT_COST = 150;
  const INTERNATIONAL_STAGES: { value: string; label: string }[] = [
    { value: "pending", label: "تم الحجز" },
    { value: "departed", label: "غادرت بلد المنشأ" },
    { value: "in_transit", label: "في الطريق" },
    { value: "arrived_port", label: "وصلت الميناء" },
    { value: "customs_pending", label: "بانتظار التخليص الجمركي" },
    { value: "customs_cleared", label: "تم التخليص الجمركي" },
    { value: "delivered", label: "وصلت المستودع" },
  ];
  const [shipments, setShipments] = useState<ApiShipment[]>([]);
  const [shipmentCustomers, setShipmentCustomers] = useState<ShipmentCustomerOption[]>([]);
  const [companies, setCompanies] = useState<DeliveryCompanyOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [draft, setDraft] = useState({
    customer_id: "",
    delivery_company_id: "",
    shipping_cost: String(DOMESTIC_DEFAULT_COST),
    service_type: "domestic",
    container_number: "",
    bill_of_lading_number: "",
    vessel_name: "",
    arrival_date: "",
    notes: "",
  });

  const loadAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [shipmentsList, customersList, companiesList] = await Promise.all([
        getShipmentsApi(),
        getShipmentCustomersApi(),
        getDeliveryCompaniesApi(),
      ]);
      setShipments(shipmentsList);
      setShipmentCustomers(customersList);
      setCompanies(companiesList);
    } catch (err) {
      console.error("Shipments API error:", err);
      setError(err instanceof Error ? err.message : "تعذر تحميل الشحنات");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  const customerName = (id: number) =>
    shipmentCustomers.find((item) => item.id === id)?.name ?? `عميل #${id}`;
  const companyName = (id: number) =>
    companies.find((item) => item.id === id)?.name ?? `شركة #${id}`;

  const serviceTypeLabel = (value: string) =>
    value === "international" ? "دولي" : "محلي";

  const statusLabel = (statusValue: string, serviceType?: string | null) => {
    if (serviceType === "international") {
      const stage = INTERNATIONAL_STAGES.find((s) => s.value === statusValue);
      if (stage) return stage.label;
    }
    if (statusValue === "in_transit") return "في الطريق";
    if (statusValue === "delivered") return "تم التسليم";
    if (statusValue === "cancelled") return "ملغاة";
    return "قيد التجهيز";
  };
  const statusProgress = (statusValue: string, serviceType?: string | null) => {
    if (serviceType === "international") {
      const idx = INTERNATIONAL_STAGES.findIndex((s) => s.value === statusValue);
      if (idx >= 0) return Math.round(((idx + 1) / INTERNATIONAL_STAGES.length) * 100);
    }
    if (statusValue === "in_transit") return 60;
    if (statusValue === "delivered") return 100;
    if (statusValue === "cancelled") return 0;
    return 15;
  };
  const statusToneLocal = (statusValue: string) => {
    if (statusValue === "delivered") return "bg-emerald-50 text-emerald-700";
    if (statusValue === "in_transit") return "bg-orange-50 text-orange-700";
    if (statusValue === "cancelled") return "bg-red-50 text-red-700";
    return "bg-slate-100 text-slate-600";
  };
  const nextStatusValue = (statusValue: string, serviceType?: string | null) => {
    if (serviceType === "international") {
      const idx = INTERNATIONAL_STAGES.findIndex((s) => s.value === statusValue);
      if (idx >= 0 && idx < INTERNATIONAL_STAGES.length - 1) return INTERNATIONAL_STAGES[idx + 1].value;
      return null;
    }
    if (statusValue === "pending") return "in_transit";
    if (statusValue === "in_transit") return "delivered";
    return null;
  };

  const [activeServiceTab, setActiveServiceTab] = useState<"all" | "domestic" | "international">("all");
  const [expandedTimelineIds, setExpandedTimelineIds] = useState<Set<number>>(new Set());
  const domesticCount = shipments.filter((item) => (item.service_type || "domestic") === "domestic").length;
  const internationalCount = shipments.filter((item) => item.service_type === "international").length;
  const visibleShipments = shipments.filter((item) => {
    if (activeServiceTab === "domestic") return (item.service_type || "domestic") === "domestic";
    if (activeServiceTab === "international") return item.service_type === "international";
    return true;
  });
  const active = shipments.filter(
    (item) => item.status !== "delivered" && item.status !== "cancelled"
  ).length;
  const delivered = shipments.filter((item) => item.status === "delivered").length;

  const openNew = () => {
    setDraft({
      customer_id: "",
      delivery_company_id: "",
      shipping_cost: String(DOMESTIC_DEFAULT_COST),
      service_type: "domestic",
      container_number: "",
      bill_of_lading_number: "",
      vessel_name: "",
      arrival_date: "",
      notes: "",
    });
    setSaveError(null);
    setFormOpen(true);
  };

  const handleServiceTypeChange = (value: string) => {
    const suggested = value === "international" ? INTERNATIONAL_DEFAULT_COST : DOMESTIC_DEFAULT_COST;
    setDraft((current) => ({ ...current, service_type: value, shipping_cost: String(suggested) }));
  };

  const saveShipment = async () => {
    if (!draft.customer_id || !draft.delivery_company_id) return;
    try {
      setIsSaving(true);
      setSaveError(null);
      await createShipmentApi({
        customer_id: Number(draft.customer_id),
        delivery_company_id: Number(draft.delivery_company_id),
        shipping_cost: draft.shipping_cost ? Number(draft.shipping_cost) : 0,
        service_type: draft.service_type,
        container_number: draft.container_number.trim() || undefined,
        bill_of_lading_number: draft.bill_of_lading_number.trim() || undefined,
        vessel_name: draft.vessel_name.trim() || undefined,
        arrival_date: draft.arrival_date || undefined,
        notes: draft.notes.trim() || undefined,
      });
      setFormOpen(false);
      await loadAll();
    } catch (err) {
      console.error("Create shipment API error:", err);
      setSaveError(err instanceof Error ? err.message : "تعذر إضافة الشحنة");
    } finally {
      setIsSaving(false);
    }
  };

  const advanceShipment = async (shipment: ApiShipment) => {
    const next = nextStatusValue(shipment.status, shipment.service_type);
    if (!next) return;
    try {
      setUpdatingId(shipment.id);
      await updateShipmentApi(shipment.id, { status: next });
      await loadAll();
    } catch (err) {
      console.error("Update shipment API error:", err);
      setError(err instanceof Error ? err.message : "تعذر تحديث الشحنة");
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteShipmentRecord = async (shipmentId: number) => {
    if (!window.confirm("حذف هذه الشحنة؟")) return;
    try {
      setUpdatingId(shipmentId);
      await deleteShipmentApi(shipmentId);
      await loadAll();
    } catch (err) {
      console.error("Delete shipment API error:", err);
      setError(err instanceof Error ? err.message : "تعذر حذف الشحنة");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <>
      <WorkspaceHeader
        eyebrow="SHIPMENT OPERATIONS"
        title="الشحنات"
        description="إنشاء الشحنات وتعديل بيانات التتبع وتحديث مراحل التوصيل."
        icon={PackageCheck}
        accent={{ bar: "#eef3e7", border: "#dbe8cc", stripe: "#6b8f4e", icon: "#6b8f4e" }}
        action={
          <button type="button" onClick={openNew} disabled={loading} className="workspace-primary-button disabled:opacity-50">
            <Plus size={14} /> إضافة شحنة
          </button>
        }
      />
      <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MiniStat label="إجمالي الشحنات" value={String(shipments.length)} icon={PackageOpen} tone="bg-blue-50 text-blue-700" note="كل السجلات" />
        <MiniStat label="شحنات نشطة" value={String(active)} icon={Truck} tone="bg-orange-50 text-orange-700" note="قيد التنفيذ" />
        <MiniStat label="تم التسليم" value={String(delivered)} icon={PackageCheck} tone="bg-emerald-50 text-emerald-700" note="مكتملة" />
        <MiniStat label="شركات مستخدمة" value={String(new Set(shipments.map((item) => item.delivery_company_id)).size)} icon={Route} tone="bg-sky-50 text-sky-700" note="ناقلون نشطون" />
      </section>
      <div className="mb-4 flex gap-2">
        <button type="button" onClick={() => setActiveServiceTab("all")} className={`rounded-xl px-4 py-2 text-[12.5px] font-bold transition-all ${activeServiceTab === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500"}`}>الكل</button>
        <button type="button" onClick={() => setActiveServiceTab("domestic")} className={`rounded-xl px-4 py-2 text-[12.5px] font-bold transition-all ${activeServiceTab === "domestic" ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`}>محلي ({domesticCount})</button>
        <button type="button" onClick={() => setActiveServiceTab("international")} className={`rounded-xl px-4 py-2 text-[12.5px] font-bold transition-all ${activeServiceTab === "international" ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-500"}`}>دولي ({internationalCount})</button>
      </div>
      {loading && (
        <Surface className="p-10 text-center text-[14.5px] font-bold text-slate-500">
          جاري تحميل الشحنات...
        </Surface>
      )}
      {!loading && error && (
        <Surface className="flex flex-col items-center gap-3 border-red-200 bg-red-50 p-10 text-center">
          <p className="text-[14.5px] font-bold text-red-600">{error}</p>
          <button type="button" onClick={() => void loadAll()} className="rounded-xl bg-red-600 px-4 py-2 text-[13.5px] font-black text-white">
            إعادة المحاولة
          </button>
        </Surface>
      )}
      {!loading && !error && visibleShipments.length === 0 && (
        <Surface className="p-10 text-center text-[14.5px] font-bold text-slate-400">
          لا توجد شحنات بعد. اضغطي "إضافة شحنة" لإنشاء أول شحنة.
        </Surface>
      )}
      {!loading && !error && visibleShipments.length > 0 && (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleShipments.map((shipment) => (
            <article key={shipment.id} className="record-card record-card-shipment">
              {(() => {
                const isLate =
                  shipment.status !== "delivered" &&
                  shipment.status !== "cancelled" &&
                  ((shipment.service_type === "international" && shipment.arrival_date && new Date(shipment.arrival_date).getTime() < Date.now()) ||
                    (shipment.service_type !== "international" &&
                      new Date(shipment.created_at).getTime() < Date.now() - 3 * 24 * 60 * 60 * 1000));
                if (!isLate) return null;
                return (
                  <div className="mb-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                    <span className="text-[10px] font-bold text-red-600">متأخرة عن الموعد المتوقع</span>
                  </div>
                );
              })()}
              <div className="flex items-start justify-between gap-3">
                <span className="record-icon"><Truck size={17} /></span>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10.5px] font-bold ring-1 ${statusToneLocal(shipment.status)}`}>
                  {shipment.status === "in_transit" && (
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-orange-500" />
                    </span>
                  )}
                  {statusLabel(shipment.status, shipment.service_type)}
                </span>
              </div>
              <p className="mt-4 text-[11.5px] font-bold text-orange-700">SHP-{shipment.id}</p>
              <h3 className="mt-1 text-[13.5px] font-bold text-slate-900">{customerName(shipment.customer_id)}</h3>
              <p className="mt-2 text-[11.5px] font-medium text-slate-500">
                {companyName(shipment.delivery_company_id)} · {shipment.tracking_number || "بدون رقم تتبع"} · {serviceTypeLabel(shipment.service_type || "domestic")}
              </p>
              {shipment.service_type === "international" && (shipment.container_number || shipment.vessel_name || shipment.bill_of_lading_number) && (
                <p className="mt-1 text-[10.5px] font-medium text-slate-400">
                  {[shipment.vessel_name, shipment.container_number, shipment.bill_of_lading_number].filter(Boolean).join(" · ")}
                </p>
              )}
              {shipment.service_type === "international" && (() => {
                const currentIdx = INTERNATIONAL_STAGES.findIndex((s) => s.value === shipment.status);
                const currentStage = INTERNATIONAL_STAGES[currentIdx] ?? INTERNATIONAL_STAGES[0];
                const isExpanded = expandedTimelineIds.has(shipment.id);
                return (
                  <div className="mt-3 rounded-xl bg-slate-50 p-2.5">
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedTimelineIds((current) => {
                          const next = new Set(current);
                          if (next.has(shipment.id)) next.delete(shipment.id);
                          else next.add(shipment.id);
                          return next;
                        })
                      }
                      className="flex w-full items-center justify-between gap-2"
                    >
                      <span className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
                        <span className="text-[10px] font-bold text-sky-700">
                          {currentStage.label} · المرحلة {currentIdx + 1} من {INTERNATIONAL_STAGES.length}
                        </span>
                      </span>
                      <span className="text-[9.5px] font-bold text-slate-400">{isExpanded ? "إخفاء" : "عرض التتبع الكامل"}</span>
                    </button>
                    {isExpanded && (
                      <div className="mt-2 grid gap-1">
                        {INTERNATIONAL_STAGES.map((stage) => {
                          const stageIdx = INTERNATIONAL_STAGES.findIndex((s) => s.value === stage.value);
                          const done = currentIdx >= 0 && stageIdx <= currentIdx;
                          const isCurrent = stageIdx === currentIdx;
                          return (
                            <div key={stage.value} className="flex items-center gap-2">
                              <span className={`h-1.5 w-1.5 rounded-full ${done ? "bg-sky-500" : "bg-slate-300"}`} />
                              <span className={`text-[10px] font-bold ${isCurrent ? "text-sky-700" : done ? "text-slate-500" : "text-slate-400"}`}>
                                {stage.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })()}
              <div className="mt-5">
                <div className="mb-2 flex justify-between text-[10.5px] font-medium text-slate-400">
                  <span>{formatCurrency(shipment.shipping_cost)}</span>
                  <span>{statusProgress(shipment.status, shipment.service_type)}%</span>
                </div>
                <div className="relative h-2 overflow-visible rounded-full bg-orange-50">
                  <div className="h-full rounded-full bg-orange-400 transition-all" style={{ width: `${statusProgress(shipment.status, shipment.service_type)}%` }} />
                  <span
                    className="absolute -top-[7px] flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full bg-white text-orange-600 shadow ring-1 ring-orange-200"
                    style={{ right: `${statusProgress(shipment.status, shipment.service_type)}%` }}
                  >
                    <Truck size={9} />
                  </span>
                </div>
                <div className="mt-2.5 flex justify-between text-[10px] font-bold text-slate-300">
                  <span>المستودع</span>
                  <span>العميل</span>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => void advanceShipment(shipment)}
                  disabled={updatingId === shipment.id || !nextStatusValue(shipment.status, shipment.service_type)}
                  className="record-action disabled:opacity-40"
                >
                  <ArrowLeft size={13} /> تحديث
                </button>
                <button
                  type="button"
                  onClick={() => void deleteShipmentRecord(shipment.id)}
                  disabled={updatingId === shipment.id}
                  className="record-action record-action-danger disabled:opacity-40"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </article>
          ))}
        </section>
      )}
      {formOpen && (
        <div className="workspace-modal">
          <div className="workspace-modal-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11.5px] font-medium text-orange-700">الشحنات</p>
                <h3 className="mt-1 text-[18.5px] font-bold text-slate-900">إضافة شحنة جديدة</h3>
              </div>
              <button type="button" onClick={() => setFormOpen(false)} className="modal-close">
                <X size={16} />
              </button>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <select
                className="workspace-input"
                value={draft.customer_id}
                onChange={(e) => setDraft({ ...draft, customer_id: e.target.value })}
              >
                <option value="">{loading ? "جاري التحميل..." : "اختاري العميل"}</option>
                {shipmentCustomers.map((customer) => (
                  <option key={customer.id} value={customer.id}>{customer.name}</option>
                ))}
              </select>
              <select
                className="workspace-input"
                value={draft.delivery_company_id}
                onChange={(e) => setDraft({ ...draft, delivery_company_id: e.target.value })}
              >
                <option value="">{loading ? "جاري التحميل..." : "اختاري شركة التوصيل"}</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>{company.name}</option>
                ))}
              </select>
              <select
                className="workspace-input"
                value={draft.service_type}
                onChange={(e) => handleServiceTypeChange(e.target.value)}
              >
                <option value="domestic">محلي</option>
                <option value="international">دولي</option>
              </select>
              <div>
                <input
                  className="workspace-input w-full"
                  type="number"
                  min="0"
                  placeholder="تكلفة الشحن"
                  value={draft.shipping_cost}
                  onChange={(e) => setDraft({ ...draft, shipping_cost: e.target.value })}
                />
                <p className="mt-1 text-[10.5px] font-medium text-slate-400">
                  سعر مقترح حسب النوع، يمكنك تعديله يدويًا.
                </p>
              </div>
              {draft.service_type === "international" && (
                <>
                  <input
                    className="workspace-input"
                    placeholder="رقم الحاوية"
                    value={draft.container_number}
                    onChange={(e) => setDraft({ ...draft, container_number: e.target.value })}
                  />
                  <input
                    className="workspace-input"
                    placeholder="رقم البوليصة"
                    value={draft.bill_of_lading_number}
                    onChange={(e) => setDraft({ ...draft, bill_of_lading_number: e.target.value })}
                  />
                  <input
                    className="workspace-input"
                    placeholder="اسم السفينة"
                    value={draft.vessel_name}
                    onChange={(e) => setDraft({ ...draft, vessel_name: e.target.value })}
                  />
                  <input
                    className="workspace-input"
                    type="date"
                    placeholder="تاريخ الوصول المتوقع"
                    value={draft.arrival_date}
                    onChange={(e) => setDraft({ ...draft, arrival_date: e.target.value })}
                  />
                </>
              )}
              <div className="sm:col-span-2">
                <input
                  className="workspace-input w-full"
                  placeholder="ملاحظات"
                  value={draft.notes}
                  onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
                />
              </div>
            </div>
            {saveError && (
              <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13.5px] font-bold text-red-600">
                {saveError}
              </div>
            )}
            <button
              type="button"
              onClick={() => void saveShipment()}
              disabled={isSaving || !draft.customer_id || !draft.delivery_company_id}
              className="workspace-primary-button mt-5 w-full disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isSaving ? "جاري الحفظ..." : "إضافة الشحنة"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
function DeliveryWorkspace() {
  const [records, setRecords] = useState<DeliveryUIRecord[]>([]);
  const [availablePicking, setAvailablePicking] = useState<{ id: number; label: string }[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedPickingId, setSelectedPickingId] = useState(0);
  const [completeTargetId, setCompleteTargetId] = useState<number | null>(null);
  const [failTargetId, setFailTargetId] = useState<number | null>(null);
  const [deliveryLoading, setDeliveryLoading] = useState(true);
  const [deliveryError, setDeliveryError] = useState<string | null>(null);
  const [isSavingItem, setIsSavingItem] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const emptyCompleteDraft = { recipientName: "", proofImageUrl: "", cashCollected: 0, notes: "" };
  const [completeDraft, setCompleteDraft] = useState(emptyCompleteDraft);
  const [failReason, setFailReason] = useState("العميل غير متواجد");
  const [failNotes, setFailNotes] = useState("");
  const failureReasons = ["العميل غير متواجد", "العنوان غير صحيح", "رفض الاستلام", "أخرى"];
  const statusLabels: Record<DeliveryStatus, string> = { out_for_delivery: "بالطريق للعميل", delivered: "تم التسليم", failed: "فشل التسليم" };
  const statusTones: Record<DeliveryStatus, string> = { out_for_delivery: "bg-sky-50 text-sky-700", delivered: "bg-emerald-50 text-emerald-700", failed: "bg-red-50 text-red-700" };
  const mapItem = (item: ApiDeliveryRecord, pickingLabelById: Map<number, string>): DeliveryUIRecord => ({
    id: item.id,
    pickingId: item.picking_id,
    pickingLabel: pickingLabelById.get(item.picking_id) ?? `تجهيز #${item.picking_id}`,
    status: item.status,
    recipientName: item.recipient_name ?? "",
    proofImageUrl: item.proof_image_url ?? "",
    cashCollected: item.cash_collected,
    failureReason: item.failure_reason ?? "",
    notes: item.notes ?? "",
    createdAt: item.created_at,
    deliveredAt: item.delivered_at ?? "",
  });
  const loadDeliveries = useCallback(async () => {
    setDeliveryLoading(true);
    setDeliveryError(null);
    try {
      const [ordersData, pickingData, deliveriesData] = await Promise.all([
        getPickingOrdersApi(),
        getPickingApi(),
        getDeliveriesApi(),
      ]);
      const ordersById = new Map(ordersData.map((o) => [o.id, o]));
      const pickingLabelById = new Map(
        pickingData.map((item) => [
          item.id,
          (() => {
            const order = ordersById.get(item.order_id);
            return order ? `${order.order_number} — ${order.title}` : `طلب #${item.order_id}`;
          })(),
        ])
      );
      setAvailablePicking(
        pickingData
          .filter((item) => item.status === "dispatched")
          .map((item) => ({ id: item.id, label: pickingLabelById.get(item.id) ?? `تجهيز #${item.id}` }))
      );
      setRecords(deliveriesData.map((item) => mapItem(item, pickingLabelById)));
    } catch (error) {
      setDeliveryError(error instanceof Error ? error.message : "تعذر تحميل بيانات التسليم");
    } finally {
      setDeliveryLoading(false);
    }
  }, []);
  useEffect(() => {
    loadDeliveries();
  }, [loadDeliveries]);
  const outCount = records.filter((item) => item.status === "out_for_delivery").length;
  const deliveredCount = records.filter((item) => item.status === "delivered").length;
  const failedCount = records.filter((item) => item.status === "failed").length;
  const totalCash = records.reduce((sum, item) => sum + item.cashCollected, 0);
  const openNew = () => { setSaveError(null); setSelectedPickingId(0); setFormOpen(true); };
  const startDelivery = async () => {
    if (!selectedPickingId) return;
    setIsSavingItem(true);
    setSaveError(null);
    try {
      await createDeliveryApi({ picking_id: selectedPickingId });
      setFormOpen(false);
      await loadDeliveries();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "تعذر بدء التسليم");
    } finally {
      setIsSavingItem(false);
    }
  };
  const openComplete = (id: number) => { setCompleteTargetId(id); setCompleteDraft(emptyCompleteDraft); setSaveError(null); };
  const submitComplete = async () => {
    if (completeTargetId == null || !completeDraft.recipientName.trim()) return;
    setIsSavingItem(true);
    setSaveError(null);
    try {
      await completeDeliveryApi(completeTargetId, {
        recipient_name: completeDraft.recipientName,
        proof_image_url: completeDraft.proofImageUrl || null,
        cash_collected: completeDraft.cashCollected,
        notes: completeDraft.notes || null,
      });
      setCompleteTargetId(null);
      await loadDeliveries();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "تعذر تسجيل التسليم");
    } finally {
      setIsSavingItem(false);
    }
  };
  const openFail = (id: number) => { setFailTargetId(id); setFailReason("العميل غير متواجد"); setFailNotes(""); setSaveError(null); };
  const submitFail = async () => {
    if (failTargetId == null) return;
    setIsSavingItem(true);
    setSaveError(null);
    try {
      await failDeliveryApi(failTargetId, { failure_reason: failReason, notes: failNotes || null });
      setFailTargetId(null);
      await loadDeliveries();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "تعذر تسجيل فشل التسليم");
    } finally {
      setIsSavingItem(false);
    }
  };
  const archiveItem = async (id: number) => {
    try {
      await deleteDeliveryApi(id);
      setRecords((current) => current.filter((item) => item.id !== id));
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "تعذر أرشفة السجل");
    }
  };
  return (
    <>
      <WorkspaceHeader eyebrow="DELIVERY" title="التسليم" description="تسليم الطلبات الخارجة للعملاء، توثيق الاستلام، وتحصيل النقد عند التسليم." icon={MapPin} accent={{ bar: "#eef3e7", border: "#dbe8cc", stripe: "#6b8f4e", icon: "#6b8f4e" }} action={<button type="button" onClick={openNew} className="workspace-primary-button"><Plus size={14} /> بدء تسليم</button>} />
      <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MiniStat label="بالطريق للعميل" value={String(outCount)} icon={MapPin} tone="bg-sky-50 text-sky-700" note="قيد التوصيل" />
        <MiniStat label="تم التسليم" value={String(deliveredCount)} icon={CheckCircle2} tone="bg-emerald-50 text-emerald-700" note="مكتملة" />
        <MiniStat label="فشل التسليم" value={String(failedCount)} icon={AlertTriangle} tone="bg-red-50 text-red-700" note="يحتاج إعادة محاولة" />
        <MiniStat label="إجمالي المحصّل" value={formatCurrency(totalCash)} icon={CircleDollarSign} tone="bg-blue-50 text-blue-700" note="نقد عند التسليم" />
      </section>
      {deliveryLoading && (
        <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center text-[12.5px] font-medium text-slate-400">جاري تحميل بيانات التسليم...</div>
      )}
      {!deliveryLoading && deliveryError && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-[12.5px] font-bold text-red-600">تعذر تحميل بيانات التسليم — رمز الخطأ: {deliveryError}</div>
      )}
      {!deliveryLoading && !deliveryError && (
      <div className="relative space-y-0 border-r-2 border-dashed border-emerald-100 pr-6">
        {records.length === 0 && <p className="rounded-2xl border border-slate-100 bg-white p-6 text-center text-[12.5px] font-medium text-slate-400">لا توجد سجلات تسليم بعد.</p>}
        {records.map((item) => (
          <div key={item.id} className="relative pb-6 last:pb-0">
            <span className={`absolute -right-[31px] top-0 flex h-8 w-8 items-center justify-center rounded-full ring-4 ring-white ${item.status === "delivered" ? "bg-emerald-500 text-white" : item.status === "failed" ? "bg-red-500 text-white" : "bg-sky-500 text-white"}`}>
              {item.status === "delivered" ? <CheckCircle2 size={15} /> : item.status === "failed" ? <AlertTriangle size={15} /> : <Truck size={15} />}
            </span>
            <div className={`ml-2 rounded-2xl border p-4 ${item.status === "delivered" ? "border-emerald-100 bg-emerald-50/40" : item.status === "failed" ? "border-red-100 bg-red-50/40" : "border-sky-100 bg-sky-50/40"}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-[10.5px] font-bold text-lime-700">{item.pickingLabel}</p>
                  <h3 className="mt-0.5 text-[13.5px] font-bold text-slate-900">تسليم DEL-{item.id}</h3>
                </div>
                <span className={`rounded-full px-3 py-1 text-[10.5px] font-bold ${statusTones[item.status]}`}>{statusLabels[item.status]}</span>
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                {item.recipientName && <span className="inline-flex items-center gap-1 text-[11.5px] font-medium text-slate-500"><User size={11} /> {item.recipientName}</span>}
                {item.cashCollected > 0 && <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10.5px] font-bold text-emerald-700"><CircleDollarSign size={11} /> {formatCurrency(item.cashCollected)}</span>}
              </div>
              {item.status === "delivered" && (item.recipientName || item.proofImageUrl) && (
                <div className="mt-3 flex items-center gap-3 rounded-xl border border-emerald-100 bg-white/70 p-2.5">
                  {item.proofImageUrl ? (
                    <a href={item.proofImageUrl} target="_blank" rel="noreferrer" className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-emerald-200 bg-emerald-50">
                      <img src={item.proofImageUrl} alt="إثبات التسليم" className="h-full w-full object-cover" />
                    </a>
                  ) : (
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-dashed border-slate-200 text-slate-300"><BadgeCheck size={16} /></span>
                  )}
                  <div className="min-w-0">
                    <p className="text-[10.5px] font-black text-emerald-700">إثبات التسليم</p>
                    <p className="truncate text-[10.5px] font-medium text-slate-500">{item.recipientName ? `استلمها ${item.recipientName}` : "لا يوجد اسم مستلم مسجّل"}{item.proofImageUrl ? " · الصورة مرفقة" : " · بدون صورة"}</p>
                  </div>
                </div>
              )}
              {item.failureReason && <p className="mt-1.5 text-[10.5px] font-medium text-red-500">سبب الفشل: {item.failureReason}</p>}
              <div className="mt-3 flex items-center gap-2">
                {item.status === "out_for_delivery" && (
                  <>
                    <button type="button" onClick={() => openComplete(item.id)} className="inline-flex h-7 items-center gap-1 rounded-lg bg-emerald-600 px-2.5 text-[10.5px] font-bold text-white hover:bg-emerald-700"><Check size={11} /> تم التسليم</button>
                    <button type="button" onClick={() => openFail(item.id)} className="inline-flex h-7 items-center gap-1 rounded-lg bg-red-50 px-2.5 text-[10.5px] font-bold text-red-600 hover:bg-red-100"><AlertTriangle size={11} /> فشل التسليم</button>
                  </>
                )}
                <button type="button" onClick={() => { if (window.confirm("أرشفة هذا السجل؟")) archiveItem(item.id); }} className="inline-flex h-7 items-center gap-1 rounded-lg px-2.5 text-[10.5px] font-bold text-slate-400 hover:bg-slate-100"><Archive size={11} /> أرشفة</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      )}
      {formOpen && <div className="workspace-modal"><div className="workspace-modal-card">
        <div className="flex items-center justify-between"><div><p className="text-[11.5px] font-medium text-red-700">التسليم</p><h3 className="mt-1 text-[18.5px] font-bold text-slate-900">بدء تسليم جديد</h3></div><button type="button" onClick={() => setFormOpen(false)} className="modal-close"><X size={16} /></button></div>
        {saveError && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-[12.5px] font-bold text-red-600">{saveError}</div>}
        <div className="mt-5 grid gap-3">
          <label className="block"><span className="mb-1.5 block text-[11.5px] font-bold text-slate-500">الطلب المرسل</span><select className="workspace-input" value={selectedPickingId || ""} onChange={(e) => setSelectedPickingId(Number(e.target.value))}><option value="">اختر الطلب...</option>{availablePicking.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
        </div>
        <button type="button" disabled={isSavingItem || !selectedPickingId} onClick={startDelivery} className="workspace-primary-button mt-5 w-full disabled:opacity-50">{isSavingItem ? "جاري الحفظ..." : "بدء التسليم"}</button>
      </div></div>}
      {completeTargetId != null && <div className="workspace-modal"><div className="workspace-modal-card">
        <div className="flex items-center justify-between"><div><p className="text-[11.5px] font-medium text-emerald-700">التسليم</p><h3 className="mt-1 text-[18.5px] font-bold text-slate-900">تأكيد التسليم</h3></div><button type="button" onClick={() => setCompleteTargetId(null)} className="modal-close"><X size={16} /></button></div>
        {saveError && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-[12.5px] font-bold text-red-600">{saveError}</div>}
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className="block sm:col-span-2"><span className="mb-1.5 block text-[11.5px] font-bold text-slate-500">اسم المستلم</span><input className="workspace-input" placeholder="اسم من استلم البضاعة" value={completeDraft.recipientName} onChange={(e) => setCompleteDraft({ ...completeDraft, recipientName: e.target.value })} /></label>
          <label className="block sm:col-span-2"><span className="mb-1.5 block text-[11.5px] font-bold text-slate-500">رابط صورة الإثبات (اختياري)</span><input className="workspace-input" placeholder="https://..." value={completeDraft.proofImageUrl} onChange={(e) => setCompleteDraft({ ...completeDraft, proofImageUrl: e.target.value })} /></label>
          <label className="block"><span className="mb-1.5 block text-[11.5px] font-bold text-slate-500">المبلغ المحصّل نقداً (ر.س)</span><input className="workspace-input" type="number" placeholder="0" value={completeDraft.cashCollected} onChange={(e) => setCompleteDraft({ ...completeDraft, cashCollected: Number(e.target.value) })} /></label>
          <label className="block sm:col-span-2"><span className="mb-1.5 block text-[11.5px] font-bold text-slate-500">ملاحظات (اختياري)</span><input className="workspace-input" placeholder="أي تفاصيل إضافية" value={completeDraft.notes} onChange={(e) => setCompleteDraft({ ...completeDraft, notes: e.target.value })} /></label>
        </div>
        <button type="button" disabled={isSavingItem || !completeDraft.recipientName.trim()} onClick={submitComplete} className="workspace-primary-button mt-5 w-full disabled:opacity-50">{isSavingItem ? "جاري الحفظ..." : "تأكيد التسليم"}</button>
      </div></div>}
      {failTargetId != null && <div className="workspace-modal"><div className="workspace-modal-card">
        <div className="flex items-center justify-between"><div><p className="text-[11.5px] font-medium text-red-700">التسليم</p><h3 className="mt-1 text-[18.5px] font-bold text-slate-900">تسجيل فشل التسليم</h3></div><button type="button" onClick={() => setFailTargetId(null)} className="modal-close"><X size={16} /></button></div>
        {saveError && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-[12.5px] font-bold text-red-600">{saveError}</div>}
        <div className="mt-5 grid gap-3">
          <label className="block"><span className="mb-1.5 block text-[11.5px] font-bold text-slate-500">سبب الفشل</span><select className="workspace-input" value={failReason} onChange={(e) => setFailReason(e.target.value)}>{failureReasons.map((reason) => <option key={reason} value={reason}>{reason}</option>)}</select></label>
          <label className="block"><span className="mb-1.5 block text-[11.5px] font-bold text-slate-500">ملاحظات (اختياري)</span><input className="workspace-input" placeholder="أي تفاصيل إضافية" value={failNotes} onChange={(e) => setFailNotes(e.target.value)} /></label>
        </div>
        <button type="button" disabled={isSavingItem} onClick={submitFail} className="workspace-primary-button mt-5 w-full disabled:opacity-50">{isSavingItem ? "جاري الحفظ..." : "تأكيد فشل التسليم"}</button>
      </div></div>}
    </>
  );
}
function ReturnsWorkspace() {
  const [records, setRecords] = useState<ReturnUIRecord[]>([]);
  const [availableDeliveries, setAvailableDeliveries] = useState<{ id: number; label: string }[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedDeliveryId, setSelectedDeliveryId] = useState(0);
  const [resolveTargetId, setResolveTargetId] = useState<number | null>(null);
  const [returnsLoading, setReturnsLoading] = useState(true);
  const [returnsError, setReturnsError] = useState<string | null>(null);
  const [isSavingItem, setIsSavingItem] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const emptyResolveDraft = { condition: "good" as ReturnCondition, outcome: "back_to_stock" as ReturnOutcome, notes: "" };
  const [resolveDraft, setResolveDraft] = useState(emptyResolveDraft);
  const statusLabels: Record<ReturnStatus, string> = { pending: "قيد المراجعة", resolved: "تمت المعالجة" };
  const statusTones: Record<ReturnStatus, string> = { pending: "bg-amber-50 text-amber-700", resolved: "bg-emerald-50 text-emerald-700" };
  const conditionLabels: Record<ReturnCondition, string> = { good: "سليمة", damaged: "تالفة" };
  const outcomeLabels: Record<ReturnOutcome, string> = { back_to_stock: "إرجاع للمخزون", quarantine: "حجر جانبي", return_to_customer: "إرجاع للعميل" };
  const mapItem = (item: ApiReturnRecord, deliveryLabelById: Map<number, string>): ReturnUIRecord => ({
    id: item.id,
    deliveryId: item.delivery_id,
    deliveryLabel: deliveryLabelById.get(item.delivery_id) ?? `تسليم DEL-${item.delivery_id}`,
    status: item.status,
    condition: item.condition,
    outcome: item.outcome,
    notes: item.notes ?? "",
    createdAt: item.created_at,
    resolvedAt: item.resolved_at ?? "",
  });
  const loadReturns = useCallback(async () => {
    setReturnsLoading(true);
    setReturnsError(null);
    try {
      const [deliveriesData, returnsData] = await Promise.all([
        getDeliveriesApi(),
        getReturnsApi(),
      ]);
      const deliveryLabelById = new Map(
        deliveriesData.map((item) => [item.id, `تسليم DEL-${item.id}${item.recipient_name ? " — " + item.recipient_name : ""}`])
      );
      const returnedDeliveryIds = new Set(returnsData.map((r) => r.delivery_id));
      setAvailableDeliveries(
        deliveriesData
          .filter((item) => item.status === "failed" && !returnedDeliveryIds.has(item.id))
          .map((item) => ({ id: item.id, label: deliveryLabelById.get(item.id) ?? `تسليم DEL-${item.id}` }))
      );
      setRecords(returnsData.map((item) => mapItem(item, deliveryLabelById)));
    } catch (error) {
      setReturnsError(error instanceof Error ? error.message : "تعذر تحميل بيانات المرتجعات");
    } finally {
      setReturnsLoading(false);
    }
  }, []);
  useEffect(() => {
    loadReturns();
  }, [loadReturns]);
  const pendingCount = records.filter((item) => item.status === "pending").length;
  const resolvedCount = records.filter((item) => item.status === "resolved").length;
  const damagedCount = records.filter((item) => item.condition === "damaged").length;
  const backToStockCount = records.filter((item) => item.outcome === "back_to_stock").length;
  const openNew = () => { setSaveError(null); setSelectedDeliveryId(0); setFormOpen(true); };
  const startReturn = async () => {
    if (!selectedDeliveryId) return;
    setIsSavingItem(true);
    setSaveError(null);
    try {
      await createReturnApi({ delivery_id: selectedDeliveryId });
      setFormOpen(false);
      await loadReturns();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "تعذر تسجيل المرتجع");
    } finally {
      setIsSavingItem(false);
    }
  };
  const openResolve = (id: number) => { setResolveTargetId(id); setResolveDraft(emptyResolveDraft); setSaveError(null); };
  const submitResolve = async () => {
    if (resolveTargetId == null) return;
    setIsSavingItem(true);
    setSaveError(null);
    try {
      await resolveReturnApi(resolveTargetId, {
        condition: resolveDraft.condition,
        outcome: resolveDraft.outcome,
        notes: resolveDraft.notes || null,
      });
      setResolveTargetId(null);
      await loadReturns();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "تعذر معالجة المرتجع");
    } finally {
      setIsSavingItem(false);
    }
  };
  const archiveItem = async (id: number) => {
    try {
      await deleteReturnApi(id);
      setRecords((current) => current.filter((item) => item.id !== id));
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "تعذر أرشفة السجل");
    }
  };
  return (
    <>
      <WorkspaceHeader eyebrow="RETURNS" title="المرتجعات" description="معالجة الشحنات المرتجعة نتيجة فشل التسليم، وتحديد حالتها النهائية ووجهتها." icon={RotateCcw} accent={{ bar: "#eaf3ee", border: "#cfe7de", stripe: "#0f766e", icon: "#0f766e" }} action={<button type="button" onClick={openNew} className="workspace-primary-button"><Plus size={14} /> تسجيل مرتجع</button>} />
      <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MiniStat label="قيد المراجعة" value={String(pendingCount)} icon={Clock3} tone="bg-amber-50 text-amber-700" note="بانتظار المعالجة" />
        <MiniStat label="تمت المعالجة" value={String(resolvedCount)} icon={CheckCircle2} tone="bg-emerald-50 text-emerald-700" note="مكتملة" />
        <MiniStat label="حالة تالفة" value={String(damagedCount)} icon={AlertTriangle} tone="bg-red-50 text-red-700" note="غير صالحة للبيع" />
        <MiniStat label="أعيد للمخزون" value={String(backToStockCount)} icon={Boxes} tone="bg-blue-50 text-blue-700" note="صالحة للبيع مجدداً" />
      </section>
      {returnsLoading && (
        <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center text-[12.5px] font-medium text-slate-400">جاري تحميل بيانات المرتجعات...</div>
      )}
      {!returnsLoading && returnsError && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-[12.5px] font-bold text-red-600">تعذر تحميل بيانات المرتجعات — رمز الخطأ: {returnsError}</div>
      )}
      {!returnsLoading && !returnsError && (
      <div className="space-y-2.5">
        {records.length === 0 && <p className="rounded-2xl border border-slate-100 bg-white p-6 text-center text-[12.5px] font-medium text-slate-400">لا توجد مرتجعات مسجلة.</p>}
        {records.map((item) => (
          <div key={item.id} className={`flex flex-wrap items-center gap-3 rounded-2xl border border-slate-100 bg-white p-3.5 pr-4 border-r-4 ${item.condition === "damaged" ? "border-r-rose-400" : "border-r-emerald-400"}`}>
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${item.condition === "damaged" ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"}`}><RotateCcw size={15} /></span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[10.5px] font-bold text-zinc-500">{item.deliveryLabel}</p>
              <h3 className="text-[13px] font-bold text-slate-900">مرتجع #{item.id}</h3>
            </div>
            <div className="flex items-center gap-1.5 text-[10.5px] font-bold">
              {item.condition && <span className={`rounded-full px-2 py-1 ${item.condition === "damaged" ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"}`}>{conditionLabels[item.condition]}</span>}
              {item.outcome && (
                <>
                  <ArrowLeft size={10} className="text-slate-300" />
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-slate-600">
                    {item.outcome === "back_to_stock" ? <Boxes size={10} /> : item.outcome === "quarantine" ? <ShieldAlert size={10} /> : <User size={10} />}
                    {outcomeLabels[item.outcome]}
                  </span>
                </>
              )}
            </div>
            <span className={`rounded-full px-2.5 py-1 text-[10.5px] font-bold ${statusTones[item.status]}`}>{statusLabels[item.status]}</span>
            <div className="flex items-center gap-1.5">
              {item.status === "pending" && (
                <button type="button" onClick={() => openResolve(item.id)} className="inline-flex h-7 items-center gap-1 rounded-lg bg-teal-600 px-2.5 text-[10.5px] font-bold text-white hover:bg-teal-700"><Check size={11} /> معالجة</button>
              )}
              <button type="button" onClick={() => { if (window.confirm("أرشفة هذا السجل؟")) archiveItem(item.id); }} className="inline-flex h-7 items-center gap-1 rounded-lg px-2 text-[10.5px] font-bold text-slate-400 hover:bg-slate-100"><Archive size={11} /></button>
            </div>
            {item.notes && <p className="w-full text-[10.5px] font-medium text-slate-400">{item.notes}</p>}
          </div>
        ))}
      </div>
      )}
      {formOpen && <div className="workspace-modal"><div className="workspace-modal-card">
        <div className="flex items-center justify-between"><div><p className="text-[11.5px] font-medium text-zinc-700">المرتجعات</p><h3 className="mt-1 text-[18.5px] font-bold text-slate-900">تسجيل مرتجع جديد</h3></div><button type="button" onClick={() => setFormOpen(false)} className="modal-close"><X size={16} /></button></div>
        {saveError && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-[12.5px] font-bold text-red-600">{saveError}</div>}
        <div className="mt-5 grid gap-3">
          <label className="block"><span className="mb-1.5 block text-[11.5px] font-bold text-slate-500">التسليم الفاشل</span><select className="workspace-input" value={selectedDeliveryId || ""} onChange={(e) => setSelectedDeliveryId(Number(e.target.value))}><option value="">اختر التسليم...</option>{availableDeliveries.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
        </div>
        <button type="button" disabled={isSavingItem || !selectedDeliveryId} onClick={startReturn} className="workspace-primary-button mt-5 w-full disabled:opacity-50">{isSavingItem ? "جاري الحفظ..." : "تسجيل المرتجع"}</button>
      </div></div>}
      {resolveTargetId != null && <div className="workspace-modal"><div className="workspace-modal-card">
        <div className="flex items-center justify-between"><div><p className="text-[11.5px] font-medium text-emerald-700">المرتجعات</p><h3 className="mt-1 text-[18.5px] font-bold text-slate-900">معالجة المرتجع</h3></div><button type="button" onClick={() => setResolveTargetId(null)} className="modal-close"><X size={16} /></button></div>
        {saveError && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-[12.5px] font-bold text-red-600">{saveError}</div>}
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className="block"><span className="mb-1.5 block text-[11.5px] font-bold text-slate-500">حالة البضاعة</span><select className="workspace-input" value={resolveDraft.condition} onChange={(e) => setResolveDraft({ ...resolveDraft, condition: e.target.value as ReturnCondition })}><option value="good">سليمة</option><option value="damaged">تالفة</option></select></label>
          <label className="block"><span className="mb-1.5 block text-[11.5px] font-bold text-slate-500">الوجهة النهائية</span><select className="workspace-input" value={resolveDraft.outcome} onChange={(e) => setResolveDraft({ ...resolveDraft, outcome: e.target.value as ReturnOutcome })}><option value="back_to_stock">إرجاع للمخزون</option><option value="quarantine">حجر جانبي</option><option value="return_to_customer">إرجاع للعميل</option></select></label>
          <label className="block sm:col-span-2"><span className="mb-1.5 block text-[11.5px] font-bold text-slate-500">ملاحظات (اختياري)</span><input className="workspace-input" placeholder="أي تفاصيل إضافية" value={resolveDraft.notes} onChange={(e) => setResolveDraft({ ...resolveDraft, notes: e.target.value })} /></label>
        </div>
        <button type="button" disabled={isSavingItem} onClick={submitResolve} className="workspace-primary-button mt-5 w-full disabled:opacity-50">{isSavingItem ? "جاري الحفظ..." : "تأكيد المعالجة"}</button>
      </div></div>}
    </>
  );
}
function CashWorkspace() {
  const [pendingGroups, setPendingGroups] = useState<CashUIPendingGroup[]>([]);
  const [settlements, setSettlements] = useState<CashUISettlement[]>([]);
  const [cashLoading, setCashLoading] = useState(true);
  const [cashError, setCashError] = useState<string | null>(null);
  const [isSavingItem, setIsSavingItem] = useState(false);
  const [expandedDriver, setExpandedDriver] = useState<string | null>(null);
  const [expandedSettlement, setExpandedSettlement] = useState<number | null>(null);
  const statusLabels: Record<CashSettlementStatus, string> = { pending: "بانتظار الاستلام", settled: "تم الاستلام" };
  const statusTones: Record<CashSettlementStatus, string> = { pending: "bg-amber-50 text-amber-700", settled: "bg-teal-50 text-teal-700" };
  const loadCash = useCallback(async () => {
    setCashLoading(true);
    setCashError(null);
    try {
      const [pendingData, settlementsData] = await Promise.all([
        getPendingCashApi(),
        getSettlementsApi(),
      ]);
      setPendingGroups(
        pendingData.map((group) => ({
          driverName: group.driver_name,
          totalAmount: group.total_amount,
          deliveryCount: group.deliveries.length,
          deliveries: group.deliveries.map((d) => ({
            recipientName: d.recipient_name,
            cashCollected: d.cash_collected,
            deliveredAt: d.delivered_at,
          })),
        }))
      );
      setSettlements(
        settlementsData.map((item) => ({
          id: item.id,
          driverName: item.driver_name,
          totalAmount: item.total_amount,
          status: item.status,
          notes: item.notes ?? "",
          createdAt: item.created_at,
          settledAt: item.settled_at ?? "",
          items: item.items.map((i) => ({
            recipientName: i.recipient_name ?? null,
            amount: i.amount,
            deliveredAt: i.delivered_at ?? null,
          })),
        }))
      );
    } catch (error) {
      setCashError(error instanceof Error ? error.message : "تعذر تحميل بيانات الكاش");
    } finally {
      setCashLoading(false);
    }
  }, []);
  useEffect(() => {
    loadCash();
  }, [loadCash]);
  const totalPendingAmount = pendingGroups.reduce((sum, g) => sum + g.totalAmount, 0);
  const pendingSettlementsCount = settlements.filter((s) => s.status === "pending").length;
  const settledAmount = settlements.filter((s) => s.status === "settled").reduce((sum, s) => sum + s.totalAmount, 0);
  const createSettlement = async (driverName: string) => {
    setIsSavingItem(true);
    try {
      await createSettlementApi({ driver_name: driverName });
      await loadCash();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "تعذر إنشاء التسوية");
    } finally {
      setIsSavingItem(false);
    }
  };
  const confirmItem = async (id: number, expectedAmount: number) => {
    const input = window.prompt(
      "أدخلي المبلغ الفعلي اللي استلمتيه من السائق (المتوقع بالنظام: " + formatCurrency(expectedAmount) + ")",
      String(expectedAmount)
    );
    if (input === null) return;
    const counted = Number(input);
    if (!Number.isFinite(counted) || counted < 0) {
      window.alert("الرجاء إدخال مبلغ صحيح");
      return;
    }
    setIsSavingItem(true);
    try {
      await confirmSettlementApi(id, counted);
      await loadCash();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "تعذر تأكيد التسوية");
    } finally {
      setIsSavingItem(false);
    }
  };
  return (
    <>
      <WorkspaceHeader eyebrow="CASH" title="الكاش (COD)" description="تسوية المبالغ النقدية المحصّلة من العملاء عند التسليم مع كل سائق." icon={Banknote} accent={{ bar: "#fbe9ef", border: "#f3d3e0", stripe: "#c15a80", icon: "#c15a80" }} />
      <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MiniStat label="كاش معلّق" value={formatCurrency(totalPendingAmount)} icon={Banknote} tone="bg-[#fbe9ef] text-[#c15a80]" note="لم تُسوّ بعد" />
        <MiniStat label="سائقين لديهم كاش" value={String(pendingGroups.length)} icon={Truck} tone="bg-[#fdf2f6] text-[#b5527a]" note="بانتظار التسوية" />
        <MiniStat label="تسويات معلّقة" value={String(pendingSettlementsCount)} icon={Clock3} tone="bg-[#f9e4ec] text-[#a83e64]" note="بانتظار الاستلام" />
        <MiniStat label="كاش مستلم" value={formatCurrency(settledAmount)} icon={CheckCircle2} tone="bg-teal-50 text-teal-700" note="تم تسليمه للمحاسبة" />
      </section>
      {cashLoading && (
        <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center text-[12.5px] font-medium text-slate-400">جاري تحميل بيانات الكاش...</div>
      )}
      {!cashLoading && cashError && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-[12.5px] font-bold text-red-600">تعذر تحميل بيانات الكاش — رمز الخطأ: {cashError}</div>
      )}
      {!cashLoading && !cashError && (
      <>
        <h3 className="mb-3 text-[13.5px] font-bold text-slate-900">كاش بانتظار التسوية حسب السائق</h3>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {pendingGroups.length === 0 && (
            <p className="col-span-full rounded-2xl border border-[#f3d3e0] bg-gradient-to-br from-[#fdf0f5] to-white p-6 text-center text-[12.5px] font-medium text-[#b5527a]">لا يوجد كاش معلّق حالياً</p>
          )}
          {pendingGroups.map((group) => {
            const isOpen = expandedDriver === group.driverName;
            return (
              <div key={group.driverName} className="overflow-hidden rounded-2xl border border-[#f3d3e0] bg-gradient-to-br from-[#fdf0f5] to-white">
                <button type="button" onClick={() => setExpandedDriver(isOpen ? null : group.driverName)} className="flex w-full items-center gap-3 p-4 text-right">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fbe9ef] text-[#c15a80]"><Banknote size={18} /></span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12.5px] font-bold text-slate-900">{group.driverName} <span className="text-[9.5px] font-medium text-slate-400">(سائق)</span></p>
                    <p className="text-[10.5px] font-medium text-slate-400">{group.deliveryCount} تسليم</p>
                  </div>
                  <div className="text-left">
                    <p className="text-[15px] font-black text-[#c15a80]">{formatCurrency(group.totalAmount)}</p>
                    <p className="mt-0.5 flex items-center justify-end gap-1 text-[10px] font-bold text-[#c15a80]">{isOpen ? "إخفاء" : "التفاصيل"}<ChevronDown size={11} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} /></p>
                  </div>
                </button>
                {isOpen && (
                  <div className="border-t border-dashed border-[#f3d3e0] p-3">
                    <div className="space-y-2">
                      {group.deliveries.map((d, idx) => (
                        <div key={idx} className="flex items-center justify-between rounded-xl bg-[#fbe9ef]/50 px-3 py-2">
                          <div className="min-w-0">
                            <p className="truncate text-[11.5px] font-bold text-slate-800">{d.recipientName ?? "عميل غير محدد"}</p>
                            <p className="text-[10px] font-medium text-slate-400">{fmtInvoiceDate(d.deliveredAt)}</p>
                          </div>
                          <span className="shrink-0 text-[12px] font-black text-[#c15a80]">{formatCurrency(d.cashCollected)}</span>
                        </div>
                      ))}
                    </div>
                    <button type="button" disabled={isSavingItem} onClick={() => createSettlement(group.driverName)} className="mt-3 inline-flex h-7 w-full items-center justify-center gap-1 rounded-full bg-[#c15a80] text-[10.5px] font-bold text-white hover:bg-[#a8456b] disabled:opacity-50"><Check size={10} /> تسوية كامل المبلغ</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <h3 className="mb-3 mt-6 text-[13.5px] font-bold text-slate-900">سجل التسويات</h3>
        <div className="space-y-2">
          {settlements.length === 0 && <p className="rounded-2xl border border-[#f3d3e0] bg-gradient-to-br from-[#fdf0f5] to-white p-6 text-center text-[12.5px] font-medium text-[#b5527a]">لا توجد تسويات مسجلة</p>}
          {settlements.map((item) => {
            const isOpen = expandedSettlement === item.id;
            return (
              <div key={item.id} className="overflow-hidden rounded-2xl border border-[#f3d3e0] bg-gradient-to-br from-[#fdf0f5]/70 to-white">
                <button type="button" onClick={() => setExpandedSettlement(isOpen ? null : item.id)} className="flex w-full items-center gap-3 p-3 text-right">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${item.status === "pending" ? "bg-amber-400" : "bg-teal-500"}`} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[11.5px] font-bold text-slate-800">{item.driverName} <span className="text-[9.5px] font-medium text-slate-400">(سائق)</span> <span className="font-medium text-slate-400">· تسوية #{item.id}</span></p>
                    <p className="text-[10px] font-medium text-slate-400">{item.items.length} عملية · {fmtInvoiceDate(item.createdAt)}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${statusTones[item.status]}`}>{statusLabels[item.status]}</span>
                  <div className="text-left">
                    <p className="text-[12.5px] font-black text-[#c15a80]">{formatCurrency(item.totalAmount)}</p>
                    <p className="mt-0.5 flex items-center justify-end gap-1 text-[10px] font-bold text-[#c15a80]">{isOpen ? "إخفاء" : "التفاصيل"}<ChevronDown size={11} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} /></p>
                  </div>
                </button>
                {isOpen && (
                  <div className="border-t border-dashed border-[#f3d3e0] p-3">
                    <div className="space-y-2">
                      {item.items.map((detail, idx) => (
                        <div key={idx} className="flex items-center justify-between rounded-xl bg-[#fbe9ef]/50 px-3 py-2">
                          <div className="min-w-0">
                            <p className="truncate text-[11.5px] font-bold text-slate-800">{detail.recipientName ?? "عميل غير محدد"}</p>
                            <p className="text-[10px] font-medium text-slate-400">{fmtInvoiceDate(detail.deliveredAt)}</p>
                          </div>
                          <span className="shrink-0 text-[12px] font-black text-slate-900">{formatCurrency(detail.amount)}</span>
                        </div>
                      ))}
                    </div>
                    {item.notes && <p className="mt-2 rounded-xl bg-[#fbe9ef]/50 px-3 py-2 text-[11px] font-medium text-slate-500">ملاحظات: {item.notes}</p>}
                    {item.status === "pending" && (
                      <button type="button" disabled={isSavingItem} onClick={() => confirmItem(item.id, item.totalAmount)} className="mt-3 inline-flex h-7 w-full items-center justify-center gap-1 rounded-full bg-emerald-600 text-[10.5px] font-bold text-white hover:bg-emerald-700 disabled:opacity-50"><Check size={10} /> تأكيد الاستلام</button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </>
      )}
    </>
  );
}
type IssuedInvoice = {
  id: number;
  customer_id: number;
  customer_name: string;
  invoice_number: string;
  amount: number;
  tax_amount: number;
  total: number;
  paid_amount: number;
  due_amount: number;
  status: string;
  created_at: string;
};
type InvoicePrintItem = { description: string; quantity: number; unit_price: number; tax_percent: number; discount_percent: number; total: number };
type InvoicePrintPayment = { amount: number; payment_method: string; created_at: string | null };
type InvoicePrintData = {
  invoice: { id: number; invoice_number: string; amount: number; tax_amount: number; total: number; status: string; created_at: string | null; due_date: string | null };
  customer: { name: string; phone: string | null; email: string | null; address: string | null; city: string | null; tax_number: string | null };
  company: {
    company_name: string;
    tax_number: string | null;
    commercial_registration: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    website: string | null;
    logo_path: string | null;
    bank_name: string;
    bank_account_number: string;
  };
  items: InvoicePrintItem[];
  payments: InvoicePrintPayment[];
  paid_amount: number;
  due_amount: number;
  payment_status: "paid" | "partial" | "unpaid";
  qr_data: string;
};
function fmtInvoiceDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB");
}
function paymentStatusLabel(status: string): { ar: string; en: string; tone: string } {
  if (status === "paid") return { ar: "مدفوع", en: "Paid", tone: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200" };
  if (status === "partial") return { ar: "مدفوع جزئيًا", en: "Partially paid", tone: "bg-amber-50 text-amber-700 ring-1 ring-amber-200" };
  return { ar: "غير مدفوع", en: "Unpaid", tone: "bg-rose-50 text-rose-700 ring-1 ring-rose-200" };
}
function invoiceLogoInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "BI";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}
function InvoicePrintModal({ invoiceId, onClose }: { invoiceId: number; onClose: () => void }) {
  const [data, setData] = useState<InvoicePrintData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qrImage, setQrImage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fetch(`/backend/invoices/${invoiceId}/print`, { headers: { Accept: "application/json" }, cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("تعذر تحميل الفاتورة");
        return res.json();
      })
      .then((json: InvoicePrintData) => {
        if (active) setData(json);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : "تعذر تحميل الفاتورة");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [invoiceId]);

  useEffect(() => {
    if (!data?.qr_data) return;
    let active = true;
    QRCode.toDataURL(data.qr_data, { margin: 1, width: 176 })
      .then((url: string) => {
        if (active) setQrImage(url);
      })
      .catch(() => {
        if (active) setQrImage(null);
      });
    return () => {
      active = false;
    };
  }, [data?.qr_data]);

  return (
    <div className="workspace-modal">
      <div className="workspace-modal-card !max-w-4xl">
        <div className="no-print flex items-center justify-between">
          <h3 className="text-[16.5px] font-bold text-slate-900">معاينة الفاتورة الضريبية</h3>
          <div className="flex items-center gap-2">
            {data && (
              <button type="button" onClick={() => window.print()} className="inline-flex h-9 items-center gap-2 rounded-xl bg-slate-900 px-4 text-[12.5px] font-bold text-white">
                <Download size={13} /> طباعة / تحميل PDF
              </button>
            )}
            <button type="button" onClick={onClose} className="modal-close"><X size={16} /></button>
          </div>
        </div>
        {loading && <div className="p-10 text-center text-[12.5px] font-medium text-slate-400">جاري تحميل الفاتورة...</div>}
        {!loading && error && <div className="p-6 text-center text-[12.5px] font-bold text-red-600">{error}</div>}
        {!loading && !error && data && (
          <div id="invoice-print-area" className="mt-5 rounded-2xl border border-slate-200 bg-white p-8 text-slate-800" dir="rtl">
            {/* ترويسة الفاتورة */}
            <div className="flex flex-wrap items-start justify-between gap-6 border-b-2 border-slate-800 pb-6">
              <div className="min-w-[180px] text-right">
                <p className="text-2xl font-black tracking-tight text-slate-900">فاتورة ضريبية</p>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Tax Invoice</p>
                <p className="mt-3 text-sm font-bold text-slate-900">{data.company.company_name}</p>
                <p className="mt-1 max-w-[220px] text-xs font-medium leading-5 text-slate-500">{data.company.address}</p>
                <div className="mt-3 space-y-0.5 text-xs font-semibold text-slate-600">
                  <p>الرقم الضريبي / Tax No. <span className="font-bold text-slate-900">{data.company.tax_number}</span></p>
                  <p>رقم الهاتف / Phone <span className="font-bold text-slate-900">{data.company.phone}</span></p>
                </div>
              </div>
              {qrImage && (
                <div className="flex flex-col items-center gap-1">
                  <img src={qrImage} alt="QR" className="h-32 w-32 rounded-lg border border-slate-200 p-1" />
                  <p className="text-[13.5px] font-semibold text-slate-400">امسحي الرمز للتحقق</p>
                </div>
              )}
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-lg font-black text-white">
                {invoiceLogoInitials(data.company.company_name)}
              </div>
            </div>

            {/* بيانات الفاتورة والعميل */}
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400">فاتورة الى / Bill to</p>
                <p className="text-sm font-bold text-slate-900">{data.customer.name}</p>
                <div className="mt-2 space-y-1 text-xs font-medium text-slate-600">
                  {data.customer.phone && <p>الهاتف / Phone: {data.customer.phone}</p>}
                  {data.customer.email && <p>البريد / Email: {data.customer.email}</p>}
                  {data.customer.city && <p>المدينة / City: {data.customer.city}</p>}
                  {data.customer.tax_number && <p>الرقم الضريبي / Tax No: {data.customer.tax_number}</p>}
                </div>
              </div>
              <div className="space-y-2 text-xs font-semibold text-slate-600">
                <div className="flex items-center justify-between border-b border-dashed border-slate-200 pb-2"><span>رقم الفاتورة / Invoice No.</span><span className="font-bold text-slate-900">{data.invoice.invoice_number}</span></div>
                <div className="flex items-center justify-between border-b border-dashed border-slate-200 pb-2"><span>التاريخ / Date</span><span className="font-bold text-slate-900">{fmtInvoiceDate(data.invoice.created_at)}</span></div>
                <div className="flex items-center justify-between border-b border-dashed border-slate-200 pb-2"><span>تاريخ الاستحقاق / Due date</span><span className="font-bold text-slate-900">{fmtInvoiceDate(data.invoice.due_date)}</span></div>
                <div className="flex items-center justify-between border-b border-dashed border-slate-200 pb-2">
                  <span>حالة الدفع / Payment status</span>
                  <span className={`rounded-full px-3 py-1 text-[13.5px] font-bold ${paymentStatusLabel(data.payment_status).tone}`}>{paymentStatusLabel(data.payment_status).ar} / {paymentStatusLabel(data.payment_status).en}</span>
                </div>
                <div className="flex items-center justify-between border-b border-dashed border-slate-200 pb-2"><span>رقم الحساب البنكي / Bank acc.</span><span className="font-bold text-slate-900">{data.company.bank_account_number}</span></div>
                <div className="flex items-center justify-between"><span>البنك / Bank</span><span className="font-bold text-slate-900">{data.company.bank_name}</span></div>
              </div>
            </div>

            {/* جدول البنود */}
            <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-xs">
                <thead className="bg-slate-900 text-white">
                  <tr>
                    <th className="p-3 text-center font-bold">#</th>
                    <th className="p-3 text-right font-bold">الصنف / Item</th>
                    <th className="p-3 text-center font-bold">الكمية</th>
                    <th className="p-3 text-center font-bold">سعر الوحدة</th>
                    <th className="p-3 text-center font-bold">الضريبة</th>
                    <th className="p-3 text-center font-bold">الخصم</th>
                    <th className="p-3 text-center font-bold">الاجمالي</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.length === 0 ? (
                    <tr><td colSpan={7} className="p-6 text-center text-slate-400">لا توجد بنود.</td></tr>
                  ) : (
                    data.items.map((item, index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                        <td className="p-3 text-center font-bold text-slate-500">{index + 1}</td>
                        <td className="p-3 text-right font-semibold text-slate-800">{item.description}</td>
                        <td className="p-3 text-center text-slate-600">{item.quantity}</td>
                        <td className="p-3 text-center text-slate-600">{item.unit_price.toFixed(2)}</td>
                        <td className="p-3 text-center text-slate-600">{item.tax_percent}%</td>
                        <td className="p-3 text-center text-slate-600">{item.discount_percent}%</td>
                        <td className="p-3 text-center font-bold text-slate-900">{item.total.toFixed(2)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* الإجماليات */}
            <div className="mt-5 flex justify-end">
              <div className="w-full max-w-[300px] space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs font-semibold text-slate-600">
                <div className="flex justify-between"><span>المجموع الفرعي / Subtotal</span><span className="font-bold text-slate-900">{data.invoice.amount.toFixed(2)} ر.س.</span></div>
                <div className="flex justify-between"><span>ضريبة القيمة المضافة / VAT</span><span className="font-bold text-slate-900">{data.invoice.tax_amount.toFixed(2)} ر.س.</span></div>
                <div className="flex justify-between border-t border-slate-300 pt-2 text-sm"><span className="font-bold text-slate-900">الاجمالي / Total</span><span className="font-black text-slate-900">{data.invoice.total.toFixed(2)} ر.س.</span></div>
              </div>
            </div>

            {/* طريقة الدفع */}
            <div className="mt-6 border-t border-dashed border-slate-300 pt-5">
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-400">طريقة الدفع / Payment method</p>
              {data.payments.length === 0 ? (
                <p className="text-xs font-medium text-slate-400">لم يتم تسجيل أي دفعة بعد.</p>
              ) : (
                <div className="space-y-1.5 text-xs font-semibold text-slate-600">
                  {data.payments.map((p, i) => (
                    <div key={i} className="flex justify-between"><span>{p.payment_method}</span><span>{p.amount.toFixed(2)} ر.س.</span></div>
                  ))}
                </div>
              )}
              <div className="mt-3 flex justify-end">
                <div className="w-full max-w-[300px] space-y-1.5 text-xs font-bold">
                  <div className="flex justify-between text-slate-700"><span>المبلغ المدفوع / Paid</span><span>{data.paid_amount.toFixed(2)} ر.س.</span></div>
                  <div className="flex justify-between text-rose-600"><span>المبلغ المستحق / Due</span><span>{data.due_amount.toFixed(2)} ر.س.</span></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
function BillingWorkspace() {
  const [pendingGroups, setPendingGroups] = useState<BillingUICustomerGroup[]>([]);
  const [billingLoading, setBillingLoading] = useState(true);
  const [billingError, setBillingError] = useState<string | null>(null);
  const [isSavingItem, setIsSavingItem] = useState(false);
  const [lastInvoice, setLastInvoice] = useState<string | null>(null);
  const [issuedInvoices, setIssuedInvoices] = useState<IssuedInvoice[]>([]);
  const [invoicesLoading, setInvoicesLoading] = useState(true);
  const [invoicesError, setInvoicesError] = useState<string | null>(null);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<number | null>(null);
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<number>).detail;
      if (typeof detail === "number") setSelectedInvoiceId(detail);
    };
    window.addEventListener("ertikaz-open-invoice", handler);
    return () => window.removeEventListener("ertikaz-open-invoice", handler);
  }, []);
  const loadBilling = useCallback(async () => {
    setBillingLoading(true);
    setBillingError(null);
    try {
      const data = await getPendingBillingApi();
      setPendingGroups(
        data.map((group) => ({
          customerId: group.customer_id,
          customerName: group.customer_name,
          totalAmount: group.total_amount,
          items: group.items.map((item) => ({
            sourceType: item.source_type,
            sourceId: item.source_id,
            description: item.description,
            amount: item.amount,
          })),
        }))
      );
    } catch (error) {
      setBillingError(error instanceof Error ? error.message : "تعذر تحميل مستحقات الفوترة");
    } finally {
      setBillingLoading(false);
    }
  }, []);
  const loadIssuedInvoices = useCallback(async () => {
    setInvoicesLoading(true);
    setInvoicesError(null);
    try {
      const res = await fetch("/backend/invoices/", { headers: { Accept: "application/json" }, cache: "no-store" });
      if (!res.ok) throw new Error("تعذر تحميل الفواتير الصادرة");
      const json = (await res.json()) as IssuedInvoice[];
      setIssuedInvoices(json);
    } catch (error) {
      setInvoicesError(error instanceof Error ? error.message : "تعذر تحميل الفواتير الصادرة");
    } finally {
      setInvoicesLoading(false);
    }
  }, []);
  useEffect(() => {
    loadBilling();
    loadIssuedInvoices();
  }, [loadBilling, loadIssuedInvoices]);
  const totalPendingAmount = pendingGroups.reduce((sum, g) => sum + g.totalAmount, 0);
  const itemsCount = pendingGroups.reduce((sum, g) => sum + g.items.length, 0);
  const generateForCustomer = async (customerId: number) => {
    setIsSavingItem(true);
    setLastInvoice(null);
    try {
      const invoice = await generateInvoiceApi(customerId);
      setLastInvoice(`${invoice.invoice_number} — الإجمالي ${formatCurrency(invoice.total)}`);
      await loadBilling();
      await loadIssuedInvoices();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "تعذر إصدار الفاتورة");
    } finally {
      setIsSavingItem(false);
    }
  };
  return (
    <>
      <WorkspaceHeader eyebrow="BILLING" title="الفوترة" description="تجميع تلقائي للمستحقات من الطلبات والشحن والجمارك، وإصدار فاتورة واحدة لكل عميل." icon={ReceiptText}accent={{ bar: "#fdf1de", border: "#f0dfb8", stripe: "#c9962c", icon: "#c9962c" }} />
      <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <MiniStat label="مستحقات معلّقة" value={formatCurrency(totalPendingAmount)} icon={CircleDollarSign} tone="bg-violet-50 text-violet-700" note="لم تُفوتر بعد" />
        <MiniStat label="عملاء لديهم مستحقات" value={String(pendingGroups.length)} icon={Building2} tone="bg-sky-50 text-sky-700" note="بانتظار الفوترة" />
        <MiniStat label="بنود معلّقة" value={String(itemsCount)} icon={FileText} tone="bg-amber-50 text-amber-700" note="طلبات وشحنات وجمارك" />
      </section>
      {lastInvoice && (
        <div className="mb-5 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-[12.5px] font-bold text-emerald-700">تم إصدار الفاتورة: {lastInvoice}</div>
      )}
      {billingLoading && (
        <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center text-[12.5px] font-medium text-slate-400">جاري تحميل مستحقات الفوترة...</div>
      )}
      {!billingLoading && billingError && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-[12.5px] font-bold text-red-600">تعذر تحميل مستحقات الفوترة — رمز الخطأ: {billingError}</div>
      )}
      {!billingLoading && !billingError && (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {pendingGroups.length === 0 && (
          <div className="rounded-2xl border border-slate-100 bg-white p-6 text-center text-[12.5px] font-medium text-slate-400 sm:col-span-2 xl:col-span-3">لا توجد مستحقات معلّقة حالياً</div>
        )}
        {pendingGroups.map((group) => (
          <div key={group.customerId} className="overflow-hidden rounded-xl border border-amber-100 bg-white shadow-sm">
            <div className="border-b border-dashed border-amber-200 bg-amber-50/50 p-3">
              <p className="text-[10.5px] font-bold text-amber-700">العميل</p>
              <h3 className="mt-0.5 text-[13.5px] font-bold text-slate-900">{group.customerName}</h3>
            </div>
            <div className="space-y-1 p-3">
              {group.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between gap-2 text-[10.5px] font-medium text-slate-500">
                  <span className="truncate">{item.description}</span>
                  <span className="shrink-0 font-bold text-slate-700">{formatCurrency(item.amount)}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-dashed border-amber-200 p-3">
              <span className="text-[10.5px] font-bold text-slate-400">{group.items.length} بند</span>
              <span className="text-[14.5px] font-black text-amber-700">{formatCurrency(group.totalAmount)}</span>
            </div>
            <button type="button" disabled={isSavingItem} onClick={() => generateForCustomer(group.customerId)} className="flex w-full items-center justify-center gap-1.5 bg-amber-600 py-2.5 text-[11.5px] font-bold text-white hover:bg-amber-700 disabled:opacity-50"><Check size={12} /> إصدار فاتورة</button>
          </div>
        ))}
      </div>
      )}

      <div className="mt-8 mb-4 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 text-white"><FileText size={14} /></span>
        <h3 className="text-[15.5px] font-bold text-slate-900">الفواتير الصادرة</h3>
      </div>
      {invoicesLoading && (
        <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center text-[12.5px] font-medium text-slate-400">جاري تحميل الفواتير...</div>
      )}
      {!invoicesLoading && invoicesError && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-[12.5px] font-bold text-red-600">تعذر تحميل الفواتير — رمز الخطأ: {invoicesError}</div>
      )}
      {!invoicesLoading && !invoicesError && (
        <Surface className="overflow-hidden">
          {issuedInvoices.length === 0 ? (
            <p className="p-6 text-center text-[12.5px] font-medium text-slate-400">لا توجد فواتير صادرة بعد.</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {issuedInvoices.map((invoice) => {
                const status = invoice.due_amount <= 0 && invoice.paid_amount > 0 ? "paid" : invoice.paid_amount > 0 ? "partial" : "unpaid";
                const label = paymentStatusLabel(status);
                return (
                  <div key={invoice.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                    <div className="min-w-0">
                      <p className="text-[12.5px] font-bold text-slate-800">{invoice.invoice_number} <span className="font-medium text-slate-400">· {invoice.customer_name}</span></p>
                      <p className="mt-1 text-[10.5px] font-medium text-slate-400">{fmtInvoiceDate(invoice.created_at)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`rounded-full px-3 py-1 text-[10.5px] font-bold ${label.tone}`}>{label.ar}</span>
                      <span className="text-[13.5px] font-bold text-slate-900">{formatCurrency(invoice.total)}</span>
                      <button type="button" onClick={() => setSelectedInvoiceId(invoice.id)} className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-slate-100 px-3 text-[11.5px] font-bold text-slate-700 hover:bg-slate-200">
                        <Download size={12} /> عرض / طباعة
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Surface>
      )}
      {selectedInvoiceId != null && (
        <InvoicePrintModal invoiceId={selectedInvoiceId} onClose={() => setSelectedInvoiceId(null)} />
      )}
    </>
  );
}
function DispatchWorkspace() {
  const [routes, setRoutes] = useState<DispatchUIRoute[]>([]);
  const [availablePicking, setAvailablePicking] = useState<{ id: number; label: string }[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingRouteId, setEditingRouteId] = useState<number | null>(null);
  const [addItemRouteId, setAddItemRouteId] = useState<number | null>(null);
  const [selectedPickingId, setSelectedPickingId] = useState(0);
  const [dispatchLoading, setDispatchLoading] = useState(true);
  const [dispatchError, setDispatchError] = useState<string | null>(null);
  const [isSavingItem, setIsSavingItem] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [scanModal, setScanModal] = useState<{ routeId: number; itemId: number; label: string } | null>(null);
  const [scanFeedback, setScanFeedback] = useState<string | null>(null);
  const [expandedRouteId, setExpandedRouteId] = useState<number | null>(null);
  const [vehicles, setVehicles] = useState<VehicleRecord[]>([]);
  const emptyDraft = { driverName: "", driverPhone: "", vehiclePlate: "", notes: "" };
  const [draft, setDraft] = useState(emptyDraft);
  const statusLabels: Record<DispatchStatus, string> = { building: "قيد التجهيز", dispatched: "تم الإرسال" };
  const statusTones: Record<DispatchStatus, string> = { building: "bg-amber-50 text-amber-700", dispatched: "bg-emerald-50 text-emerald-700" };
  const mapRoute = (route: ApiDispatchRoute, pickingLabelById: Map<number, string>): DispatchUIRoute => ({
    id: route.id,
    routeNumber: route.route_number ?? `#${route.id}`,
    driverName: route.driver_name ?? "",
    driverPhone: route.driver_phone ?? "",
    vehiclePlate: route.vehicle_plate ?? "",
    status: route.status,
    notes: route.notes ?? "",
    createdAt: route.created_at,
    dispatchedAt: route.dispatched_at ?? "",
    items: route.items.map((item) => ({
      id: item.id,
      pickingId: item.picking_id,
      label: pickingLabelById.get(item.picking_id) ?? `تجهيز #${item.picking_id}`,
      scanned: item.scanned,
    })),
  });
  const loadDispatch = useCallback(async () => {
    setDispatchLoading(true);
    setDispatchError(null);
    try {
      const [ordersData, pickingData, routesData] = await Promise.all([
        getPickingOrdersApi(),
        getPickingApi(),
        getDispatchRoutesApi(),
      ]);
      const ordersById = new Map(ordersData.map((o) => [o.id, o]));
      const pickingLabelById = new Map(
        pickingData.map((item) => [
          item.id,
          (() => {
            const order = ordersById.get(item.order_id);
            return order ? `${order.order_number} — ${order.title}` : `طلب #${item.order_id}`;
          })(),
        ])
      );
      const assignedPickingIds = new Set(routesData.flatMap((route) => route.items.map((item) => item.picking_id)));
      setAvailablePicking(
        pickingData
          .filter((item) => item.status === "packed" && !assignedPickingIds.has(item.id))
          .map((item) => ({ id: item.id, label: pickingLabelById.get(item.id) ?? `تجهيز #${item.id}` }))
      );
      setRoutes(routesData.map((route) => mapRoute(route, pickingLabelById)));
    } catch (error) {
      setDispatchError(error instanceof Error ? error.message : "تعذر تحميل بيانات الإرسال");
    } finally {
      setDispatchLoading(false);
    }
  }, []);
  useEffect(() => {
    loadDispatch();
  }, [loadDispatch]);
  useEffect(() => {
    getVehiclesApi().then(setVehicles).catch(() => {});
  }, []);
  const addVehicle = async () => {
    const plate = window.prompt("رقم لوحة المركبة الجديدة");
    if (!plate || !plate.trim()) return;
    try {
      const created = await createVehicleApi({ plate: plate.trim() });
      setVehicles((current) => [...current, created]);
      setDraft((current) => ({ ...current, vehiclePlate: created.plate }));
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "تعذر إضافة المركبة");
    }
  };
  const buildingCount = routes.filter((route) => route.status === "building").length;
  const dispatchedCount = routes.filter((route) => route.status === "dispatched").length;
  const openNew = () => { setSaveError(null); setEditingRouteId(null); setDraft(emptyDraft); setFormOpen(true); };
  const openEditDriver = (route: DispatchUIRoute) => { setSaveError(null); setEditingRouteId(route.id); setDraft({ driverName: route.driverName, driverPhone: route.driverPhone, vehiclePlate: route.vehiclePlate, notes: route.notes }); setFormOpen(true); };
  const createRoute = async () => {
    setIsSavingItem(true);
    setSaveError(null);
    try {
      const payload = {
        driver_name: draft.driverName || null,
        driver_phone: draft.driverPhone || null,
        vehicle_plate: draft.vehiclePlate || null,
        notes: draft.notes || null,
      };
      if (editingRouteId) {
        await updateDispatchRouteApi(editingRouteId, payload);
      } else {
        await createDispatchRouteApi(payload);
      }
      setFormOpen(false);
      await loadDispatch();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "تعذر إنشاء خط السير");
    } finally {
      setIsSavingItem(false);
    }
  };
  const openAddItem = (routeId: number) => { setAddItemRouteId(routeId); setSelectedPickingId(0); setSaveError(null); };
  const submitAddItem = async () => {
    if (addItemRouteId == null || !selectedPickingId) return;
    setIsSavingItem(true);
    setSaveError(null);
    try {
      await addDispatchItemApi(addItemRouteId, selectedPickingId);
      setAddItemRouteId(null);
      await loadDispatch();
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "تعذر إضافة الطلب لخط السير");
    } finally {
      setIsSavingItem(false);
    }
  };
  const scanItem = async (routeId: number, itemId: number, boxCode: string) => {
    try {
      await scanDispatchItemApi(routeId, itemId, boxCode);
      await loadDispatch();
      setScanModal(null);
      setScanFeedback(null);
    } catch (error) {
      setScanFeedback(error instanceof Error ? error.message : "تعذر مسح الصندوق");
    }
  };
  const closeRoute = async (routeId: number) => {
    try {
      await closeDispatchRouteApi(routeId);
      await loadDispatch();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "تعذر قفل خط السير — تأكدي إن كل الصناديق انمسحت");
    }
  };
  const archiveRoute = async (routeId: number) => {
    try {
      await deleteDispatchRouteApi(routeId);
      setRoutes((current) => current.filter((route) => route.id !== routeId));
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "تعذر أرشفة خط السير");
    }
  };
  return (
    <>
      <WorkspaceHeader eyebrow="DISPATCH" title="الإرسال" description="تجميع الطلبات المعبأة بخطوط سير، وتعيين السائق والمركبة، ومسح كل صندوق قبل الإرسال." icon={Route} accent={{ bar: "#eaf2fa", border: "#cfe0ef", stripe: "#2b6cb0", icon: "#2b6cb0" }} action={<button type="button" onClick={openNew} className="workspace-primary-button"><Plus size={14} /> خط سير جديد</button>} />
      <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <MiniStat label="إجمالي الخطوط" value={String(routes.length)} icon={Route} tone="bg-sky-50 text-sky-700" note="كل الخطوط" />
        <MiniStat label="قيد التجهيز" value={String(buildingCount)} icon={ShieldAlert} tone="bg-[#eaf2fa] text-[#2b6cb0]" note="لسا ما انقفل" />
        <MiniStat label="تم الإرسال" value={String(dispatchedCount)} icon={CheckCircle2} tone="bg-teal-50 text-teal-700" note="خرجت للتسليم" />
      </section>
      {dispatchLoading && (
        <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center text-[12.5px] font-medium text-slate-400">جاري تحميل بيانات الإرسال...</div>
      )}
      {!dispatchLoading && dispatchError && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-[12.5px] font-bold text-red-600">تعذر تحميل بيانات الإرسال — رمز الخطأ: {dispatchError}</div>
      )}
      {!dispatchLoading && !dispatchError && (
      <div className="space-y-3">
        {routes.length === 0 && <p className="rounded-2xl border border-slate-100 bg-white p-6 text-center text-[12.5px] font-medium text-slate-400">لا توجد خطوط سير بعد.</p>}
        {routes.map((route) => {
          const scannedCount = route.items.filter((item) => item.scanned).length;
          const totalCount = route.items.length;
          const allScanned = totalCount > 0 && scannedCount === totalCount;
          const pct = totalCount > 0 ? Math.round((scannedCount / totalCount) * 100) : 0;
          return (
            <div key={route.id} className="relative overflow-hidden rounded-2xl border bg-white p-4 pr-5 transition" style={{ borderColor: route.status === "dispatched" ? "#bfe0da" : "#cfe0ef" }}>
              <span className="absolute inset-y-0 right-0 w-1.5" style={{ background: route.status === "dispatched" ? "#0f766e" : "#2b6cb0" }} />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-white" style={{ background: route.status === "dispatched" ? "#0f766e" : "#2b6cb0" }}>
                    <Route size={18} />
                  </span>
                  <div>
                    <h3 className="text-[15px] font-bold text-slate-900">{route.routeNumber}</h3>
                    <p className="mt-0.5 text-[11.5px] font-medium text-slate-500">{route.driverName || "بدون سائق محدد"}{route.driverPhone ? ` · ${route.driverPhone}` : ""} · {route.vehiclePlate || "بدون مركبة محددة"}</p>
                  </div>
                </div>
                <span className="rounded-full px-3 py-1.5 text-[10.5px] font-bold text-white" style={{ background: route.status === "dispatched" ? "#0f766e" : "#2b6cb0" }}>{statusLabels[route.status]}</span>
                <button type="button" onClick={() => openEditDriver(route)} className="rounded-full border px-3 py-1.5 text-[10.5px] font-bold transition" style={{ borderColor: route.status === "dispatched" ? "#bfe0da" : "#cfe0ef", color: route.status === "dispatched" ? "#0f766e" : "#2b6cb0" }}>تعديل السائق</button>
                <button type="button" onClick={() => setExpandedRouteId(expandedRouteId === route.id ? null : route.id)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition" style={{ borderColor: route.status === "dispatched" ? "#bfe0da" : "#cfe0ef", color: route.status === "dispatched" ? "#0f766e" : "#2b6cb0", background: expandedRouteId === route.id ? (route.status === "dispatched" ? "#f0f9f7" : "#eaf2fa") : "white" }}>
                  <Eye size={14} />
                </button>
              </div>
              {expandedRouteId === route.id && (
                <div className="mt-3 rounded-xl p-3 text-[11px] font-medium text-slate-600" style={{ background: route.status === "dispatched" ? "#f0f9f7" : "#eaf2fa" }}>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    <div><p className="text-[9.5px] font-bold text-slate-400">السائق</p><p className="mt-0.5 font-bold text-slate-800">{route.driverName || "—"}</p></div>
                    <div><p className="text-[9.5px] font-bold text-slate-400">جوال السائق</p><p className="mt-0.5 font-bold text-slate-800">{route.driverPhone ? <a href={`tel:${route.driverPhone}`} className="underline">{route.driverPhone}</a> : "—"}</p></div>
                    <div><p className="text-[9.5px] font-bold text-slate-400">المركبة</p><p className="mt-0.5 font-bold text-slate-800">{route.vehiclePlate || "—"}</p></div>
                    <div><p className="text-[9.5px] font-bold text-slate-400">تاريخ الإنشاء</p><p className="mt-0.5 font-bold text-slate-800">{fmtInvoiceDate(route.createdAt)}</p></div>
                    <div><p className="text-[9.5px] font-bold text-slate-400">تاريخ الإرسال</p><p className="mt-0.5 font-bold text-slate-800">{route.dispatchedAt ? fmtInvoiceDate(route.dispatchedAt) : "—"}</p></div>
                  </div>
                  {route.notes && <p className="mt-2 rounded-lg bg-white/70 px-2 py-1.5 text-[10.5px] font-medium text-slate-600">ملاحظات: {route.notes}</p>}
                  {route.items.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <p className="text-[9.5px] font-bold text-slate-400">الطلبات على هذا الخط</p>
                      {route.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between rounded-lg bg-white/70 px-2 py-1">
                          <span className="truncate text-[10.5px] font-bold text-slate-700">{item.label}</span>
                          <span className={`text-[9.5px] font-bold ${item.scanned ? "text-emerald-600" : "text-slate-400"}`}>{item.scanned ? "تم المسح" : "بالانتظار"}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <div className="mt-4 flex flex-wrap items-center gap-1.5">
                {route.items.length === 0 && <p className="text-[12px] font-semibold text-slate-500">مافي طلبات بهذا الخط بعد.</p>}
                {route.items.map((item, idx) => (
                  <div key={item.id} className="group relative">
                    <button type="button" disabled={item.scanned || route.status !== "building"} onClick={() => { setScanFeedback(null); setScanModal({ routeId: route.id, itemId: item.id, label: item.label }); }} className={`flex h-10 w-10 items-center justify-center rounded-xl border-2 text-[11.5px] font-bold transition ${item.scanned ? "border-emerald-400 bg-emerald-50 text-emerald-700" : "border-dashed border-slate-300 bg-slate-50 text-slate-400 hover:border-[#2b6cb0] hover:text-[#2b6cb0]"}`}>
                      {item.scanned ? <PackageCheck size={15} /> : idx + 1}
                    </button>
                    <span className="pointer-events-none absolute -bottom-6 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded bg-slate-900 px-2 py-1 text-[9.5px] font-bold text-white group-hover:block">{item.label}</span>
                  </div>
                ))}
              </div>
              {route.items.length > 0 && (
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full" style={{ width: `${pct}%`, background: allScanned ? "#0f766e" : "#c2653f" }} /></div>
                  <span className="text-[10px] font-bold text-slate-400">{scannedCount}/{totalCount} صندوق</span>
                </div>
              )}
              <div className="mt-4">
                <svg viewBox="0 0 400 10" className="block h-2.5 w-full" preserveAspectRatio="none">
                  <path d="M0 5 Q 12.5 -1, 25 5 T 50 5 T 75 5 T 100 5 T 125 5 T 150 5 T 175 5 T 200 5 T 225 5 T 250 5 T 275 5 T 300 5 T 325 5 T 350 5 T 375 5 T 400 5" fill="none" stroke={route.status === "dispatched" ? "#bfe0da" : "#cfe0ef"} strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 pt-1">
                {route.status === "building" && (
                  <>
                    <button type="button" onClick={() => openAddItem(route.id)} className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-slate-100 px-3.5 text-[11.5px] font-bold text-slate-700 hover:bg-slate-200"><Plus size={13} /> إضافة طلب</button>
                    <button
                      type="button"
                      disabled={!allScanned}
                      onClick={() => closeRoute(route.id)}
                      className="inline-flex h-9 items-center gap-1.5 rounded-xl px-3.5 text-[11.5px] font-bold text-white transition disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
                      style={allScanned ? { background: "#2b6cb0" } : undefined}
                    >
                      <PackageCheck size={13} /> {allScanned ? "قفل وإرسال" : `بانتظار مسح ${totalCount - scannedCount} صندوق`}
                    </button>
                  </>
                )}
                <button type="button" onClick={() => { if (window.confirm("أرشفة خط السير هذا؟")) archiveRoute(route.id); }} className="mr-auto inline-flex h-9 w-9 items-center justify-center rounded-xl text-red-400 transition hover:bg-red-50 hover:text-red-600">
                  <Archive size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      )}
      {formOpen && (
        <div className="workspace-modal">
          <div className="workspace-modal-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11.5px] font-medium text-sky-700">الإرسال</p>
                <h3 className="mt-1 text-[18.5px] font-bold text-slate-900">{editingRouteId ? "تعديل بيانات السائق" : "خط سير جديد"}</h3>
              </div>
              <button type="button" onClick={() => setFormOpen(false)} className="modal-close"><X size={16} /></button>
            </div>
            {saveError && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-[12.5px] font-bold text-red-600">{saveError}</div>}
            <div className="mt-5 grid gap-3">
              <label className="block"><span className="mb-1.5 block text-[11.5px] font-bold text-slate-500">اسم السائق</span><input className="workspace-input" placeholder="مثال: محمد العتيبي" value={draft.driverName} onChange={(e) => setDraft({ ...draft, driverName: e.target.value })} /></label>
              <label className="block"><span className="mb-1.5 block text-[11.5px] font-bold text-slate-500">جوال السائق</span><input className="workspace-input" placeholder="05xxxxxxxx" value={draft.driverPhone} onChange={(e) => setDraft({ ...draft, driverPhone: e.target.value })} /></label>
              <label className="block"><span className="mb-1.5 block text-[11.5px] font-bold text-slate-500">رقم لوحة المركبة</span><input className="workspace-input" placeholder="أ ب ج 1234" value={draft.vehiclePlate} onChange={(e) => setDraft({ ...draft, vehiclePlate: e.target.value })} /></label>
              <label className="block"><span className="mb-1.5 block text-[11.5px] font-bold text-slate-500">ملاحظات (اختياري)</span><input className="workspace-input" value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} /></label>
            </div>
            <button type="button" disabled={isSavingItem} onClick={createRoute} className="workspace-primary-button mt-5 w-full disabled:opacity-50">{isSavingItem ? "جاري الحفظ..." : editingRouteId ? "حفظ التعديلات" : "إنشاء خط السير"}</button>
          </div>
        </div>
      )}
      {scanModal && (
        <BoxScannerModal
          label={scanModal.label}
          error={scanFeedback}
          onClose={() => { setScanModal(null); setScanFeedback(null); }}
          onDecode={(code) => scanItem(scanModal.routeId, scanModal.itemId, code)}
        />
      )}
      {addItemRouteId != null && (
        <div className="workspace-modal">
          <div className="workspace-modal-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11.5px] font-medium text-sky-700">الإرسال</p>
                <h3 className="mt-1 text-[18.5px] font-bold text-slate-900">إضافة طلب لخط السير</h3>
              </div>
              <button type="button" onClick={() => setAddItemRouteId(null)} className="modal-close"><X size={16} /></button>
            </div>
            {saveError && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-[12.5px] font-bold text-red-600">{saveError}</div>}
            {availablePicking.length === 0 ? (
              <p className="mt-5 text-[12.5px] font-semibold text-slate-500">لا يوجد طلبات جاهزة للإرسال حاليًا (بانتظار اكتمال التجهيز والتغليف).</p>
            ) : (
              <label className="mt-5 block">
                <span className="mb-1.5 block text-[11.5px] font-bold text-slate-500">اختاري الطلب</span>
                <select className="workspace-input" value={selectedPickingId} onChange={(e) => setSelectedPickingId(Number(e.target.value))}>
                  <option value={0}>-- اختاري طلب --</option>
                  {availablePicking.map((item) => (
                    <option key={item.id} value={item.id}>{item.label}</option>
                  ))}
                </select>
              </label>
            )}
            <button type="button" disabled={isSavingItem || !selectedPickingId} onClick={submitAddItem} className="workspace-primary-button mt-5 w-full disabled:opacity-50">{isSavingItem ? "جاري الإضافة..." : "إضافة للخط"}</button>
          </div>
        </div>
      )}
    </>
  );
}
function BoxScannerModal({ label, error, onClose, onDecode }: { label: string; error: string | null; onClose: () => void; onDecode: (code: string) => void }) {
  const [manualCode, setManualCode] = useState("");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  useEffect(() => {
    if (!cameraOn) return;
    let active = true;
    let scannerInstance: any = null;
    (async () => {
      try {
        const mod = await import("html5-qrcode");
        if (!active) return;
        const Html5Qrcode = mod.Html5Qrcode;
        scannerInstance = new Html5Qrcode("box-scanner-view");
        await scannerInstance.start(
          { facingMode: "environment" },
          { fps: 10, qrbox: 220 },
          (decodedText: string) => { onDecode(decodedText); },
          () => {}
        );
      } catch (err) {
        if (active) {
          setCameraError("تعذر تشغيل الكاميرا — تأكدي من إعطاء الإذن للمتصفح، أو أدخلي الكاميرا يدويًا.");
          setCameraOn(false);
        }
      }
    })();
    return () => {
      active = false;
      if (scannerInstance) {
        try {
          scannerInstance.stop().then(() => scannerInstance.clear()).catch(() => {});
        } catch (e) {}
      }
    };
  }, [cameraOn, onDecode]);
  return (
    <div className="workspace-modal">
      <div className="workspace-modal-card">
        <div className="flex items-center justify-between">
          <div><p className="text-[11.5px] font-medium text-sky-700">مسح الصندوق</p><h3 className="mt-1 text-[16.5px] font-bold text-slate-900">{label}</h3></div>
          <button type="button" onClick={onClose} className="modal-close"><X size={16} /></button>
        </div>
        {error && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-[12.5px] font-bold text-red-600">{error}</div>}
        {cameraError && <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-[12.5px] font-bold text-amber-700">{cameraError}</div>}
        {!cameraOn && (
          <button type="button" onClick={() => { setCameraError(null); setCameraOn(true); }} className="workspace-primary-button mt-4 w-full">تشغيل الكاميرا</button>
        )}
        {cameraOn && <div id="box-scanner-view" className="mt-4 overflow-hidden rounded-2xl bg-black" style={{ minHeight: 220 }} />}
        <div className="mt-4 grid gap-2">
          <label className="block">
            <span className="mb-1.5 block text-[11.5px] font-bold text-slate-500">أو أدخلي كود الصندوق يدويًا</span>
            <div className="flex gap-2">
              <input className="workspace-input" placeholder="BOX-00001" value={manualCode} onChange={(e) => setManualCode(e.target.value)} />
              <button type="button" disabled={!manualCode.trim()} onClick={() => onDecode(manualCode.trim())} className="record-action disabled:opacity-50">تأكيد</button>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
function PickingPackingWorkspace() {
  const [records, setRecords] = useState<PickingUIRecord[]>([]);
  const [orders, setOrders] = useState<PickingOrderOption[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [missingTargetId, setMissingTargetId] = useState<number | null>(null);
  const [missingNotes, setMissingNotes] = useState("");
  const [pickingLoading, setPickingLoading] = useState(true);
  const [pickingError, setPickingError] = useState<string | null>(null);
  const [isSavingItem, setIsSavingItem] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [draftOrderId, setDraftOrderId] = useState(0);
  const statusLabels: Record<PickingStatus, string> = { pending: "بانتظار التجهيز", picking: "جاري التجهيز", missing: "نقص بالمخزون", packed: "معبأ وجاهز", dispatched: "تم الإرسال" };
  const statusTones: Record<PickingStatus, string> = { pending: "bg-amber-50 text-amber-700", picking: "bg-sky-50 text-sky-700", missing: "bg-red-50 text-red-700", packed: "bg-emerald-50 text-emerald-700", dispatched: "bg-blue-50 text-blue-700" };
  const mapItem = (item: ApiPickingRecord, ordersById: Map<number, PickingOrderOption>): PickingUIRecord => {
    const order = ordersById.get(item.order_id);
    return {
      id: item.id,
      orderId: item.order_id,
      orderLabel: order ? `${order.order_number} — ${order.title}` : `طلب #${item.order_id}`,
      status: item.status,
      deliveryNumber: item.delivery_number ?? "",
      missingNotes: item.missing_notes ?? "",
      createdAt: item.created_at,
      packedAt: item.packed_at ?? "",
      boxCode: item.box_code ?? "",
    };
  };
  const loadPicking = useCallback(async () => {
    setPickingLoading(true);
    setPickingError(null);
    try {
      const [ordersData, pickingData] = await Promise.all([getPickingOrdersApi(), getPickingApi()]);
      setOrders(ordersData);
      const ordersById = new Map(ordersData.map((o) => [o.id, o]));
      setRecords(pickingData.map((item) => mapItem(item, ordersById)));
    } catch (error) {
      setPickingError(error instanceof Error ? error.message : "تعذر تحميل بيانات التجهيز");
    } finally {
      setPickingLoading(false);
    }
  }, []);
  useEffect(() => {
    loadPicking();
  }, [loadPicking]);
  const pendingCount = records.filter((item) => item.status === "pending").length;
  const pickingCount = records.filter((item) => item.status === "picking").length;
  const missingCount = records.filter((item) => item.status === "missing").length;
  const packedCount = records.filter((item) => item.status === "packed").length;
  const openNew = () => { setSaveError(null); setDraftOrderId(0); setFormOpen(true); };
  const createRecord = async () => {
    if (!draftOrderId) return;
    setIsSavingItem(true);
    setSaveError(null);
    try {
      const ordersById = new Map(orders.map((o) => [o.id, o]));
      const created = await createPickingApi({ order_id: draftOrderId });
      setRecords((current) => [mapItem(created, ordersById), ...current]);
      setFormOpen(false);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "تعذر إضافة سجل التجهيز");
    } finally {
      setIsSavingItem(false);
    }
  };
  const startItem = async (id: number) => {
    try {
      const ordersById = new Map(orders.map((o) => [o.id, o]));
      const updated = await startPickingApi(id);
      setRecords((current) => current.map((item) => (item.id === id ? mapItem(updated, ordersById) : item)));
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "تعذر بدء التجهيز");
    }
  };
  const openMissingForm = (id: number) => { setMissingTargetId(id); setMissingNotes(""); setSaveError(null); };
  const submitMissing = async () => {
    if (missingTargetId == null || !missingNotes.trim()) return;
    setIsSavingItem(true);
    setSaveError(null);
    try {
      const ordersById = new Map(orders.map((o) => [o.id, o]));
      const updated = await reportMissingApi(missingTargetId, { missing_notes: missingNotes });
      setRecords((current) => current.map((item) => (item.id === missingTargetId ? mapItem(updated, ordersById) : item)));
      setMissingTargetId(null);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "تعذر تسجيل النقص");
    } finally {
      setIsSavingItem(false);
    }
  };
  const packItem = async (id: number) => {
    try {
      const ordersById = new Map(orders.map((o) => [o.id, o]));
      const updated = await packOrderApi(id);
      setRecords((current) => current.map((item) => (item.id === id ? mapItem(updated, ordersById) : item)));
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "تعذر إتمام التغليف");
    }
  };
  const sendToDeliveryItem = async (id: number) => {
    try {
      const ordersById = new Map(orders.map((o) => [o.id, o]));
      const updated = await sendToDeliveryApi(id);
      setRecords((current) => current.map((item) => (item.id === id ? mapItem(updated, ordersById) : item)));
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "تعذر إرسال الطلب للتسليم");
    }
  };
  const archiveItem = async (id: number) => {
    try {
      await deletePickingApi(id);
      setRecords((current) => current.filter((item) => item.id !== id));
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "تعذر أرشفة السجل");
    }
  };
  return (
    <>
      <WorkspaceHeader eyebrow="PICKING & PACKING" title="التجهيز والتغليف" description="تجهيز الطلبات من المخزون وتغليفها وتوليد رقم التسليم." icon={ScanLine} accent={{ bar: "#f1ecf6", border: "#e0d4ec", stripe: "#7c5a9e", icon: "#7c5a9e" }} action={<button type="button" onClick={openNew} className="workspace-primary-button"><Plus size={14} /> بدء تجهيز طلب</button>} />
      <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MiniStat label="بانتظار التجهيز" value={String(pendingCount)} icon={ShieldAlert} tone="bg-amber-50 text-amber-700" note="لم يبدأ بعد" />
        <MiniStat label="جاري التجهيز" value={String(pickingCount)} icon={ScanLine} tone="bg-sky-50 text-sky-700" note="قيد العمل" />
        <MiniStat label="نقص بالمخزون" value={String(missingCount)} icon={AlertTriangle} tone="bg-red-50 text-red-700" note="يحتاج مراجعة" />
        <MiniStat label="معبأ وجاهز" value={String(packedCount)} icon={CheckCircle2} tone="bg-emerald-50 text-emerald-700" note="جاهز للإرسال" />
      </section>
      {pickingLoading && (
        <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center text-[12.5px] font-medium text-slate-400">جاري تحميل بيانات التجهيز...</div>
      )}
      {!pickingLoading && pickingError && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-[12.5px] font-bold text-red-600">تعذر تحميل بيانات التجهيز — رمز الخطأ: {pickingError}</div>
      )}
      {!pickingLoading && !pickingError && (
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {records.map((item) => (
          <article key={item.id} className="record-card">
            <div className="flex items-start justify-between gap-3"><span className="record-icon"><ScanLine size={17} /></span><span className={`rounded-full px-3 py-1 text-[10.5px] font-bold ${statusTones[item.status]}`}>{statusLabels[item.status]}</span></div>
            <p className="mt-4 text-[11.5px] font-bold text-lime-700">{item.orderLabel}</p>
            <h3 className="mt-1 text-[13.5px] font-bold text-slate-900">تجهيز PCK-{item.id}</h3>
                <div className="mt-3 flex items-center gap-1">
                  {["pending", "picking", "packed", "dispatched"].map((stage, stageIndex) => (
                    <span key={stage} className={"h-1.5 flex-1 rounded-full " + (item.status === "missing" ? (stageIndex === 1 ? "bg-red-400" : stageIndex < 1 ? "bg-violet-500" : "bg-slate-100") : (stageIndex <= ["pending", "picking", "packed", "dispatched"].indexOf(item.status) ? "bg-violet-500" : "bg-slate-100"))} />
                  ))}
                </div>
                {item.deliveryNumber && <p className="mt-2 text-[11.5px] font-bold text-emerald-700">رقم التسليم: {item.deliveryNumber}</p>}
            {item.missingNotes && <p className="mt-1 text-[10.5px] font-medium text-red-500">سبب النقص: {item.missingNotes}</p>}
            {item.status === "packed" && item.boxCode && (
              <div className="relative mt-3 flex items-center gap-3 overflow-hidden rounded-xl border border-violet-100 bg-violet-50 p-3">
                <span className="absolute -left-8 top-2 w-28 -rotate-45 bg-violet-600 py-0.5 text-center text-[9.5px] font-black tracking-wider text-white shadow">مغلّف</span>
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=${encodeURIComponent(item.boxCode)}`} alt="QR الصندوق" width={64} height={64} className="rounded-lg bg-white p-1" />
                <div>
                  <p className="text-[10.5px] font-bold text-violet-700">كود الصندوق</p>
                  <p className="mt-0.5 text-[13.5px] font-black text-violet-900">{item.boxCode}</p>
                  <p className="mt-0.5 text-[9.5px] font-medium text-violet-500">اطبعي هذا الكود والصقيه على الصندوق ليُمسح عند الإرسال</p>
                </div>
              </div>
            )}
            <div className="mt-4 grid grid-cols-2 gap-2">
              {item.status === "pending" && <button type="button" onClick={() => startItem(item.id)} className="record-action"><ScanLine size={13} /> بدء التجهيز</button>}
              {item.status === "picking" && <button type="button" onClick={() => openMissingForm(item.id)} className="record-action"><AlertTriangle size={13} /> إبلاغ نقص</button>}
              {item.status === "picking" && <button type="button" onClick={() => packItem(item.id)} className="record-action"><PackageCheck size={13} /> إتمام التغليف</button>}
              {item.status === "missing" && <button type="button" onClick={() => startItem(item.id)} className="record-action"><RefreshCw size={13} /> استئناف التجهيز</button>}
              {item.status !== "dispatched" && <button type="button" onClick={() => { if (window.confirm("إرسال هذا الطلب مباشرة لقسم التسليم؟")) sendToDeliveryItem(item.id); }} className="record-action" style={{ gridColumn: "1 / -1", background: "#eaf5f4", color: "#237c82", fontWeight: 800 }}><Truck size={13} /> إرسال مباشر للتسليم</button>}
              <button type="button" onClick={() => { if (window.confirm("أرشفة هذا السجل؟")) archiveItem(item.id); }} className="record-action record-action-danger"><Archive size={13} /> أرشفة</button>
            </div>
          </article>
        ))}
      </section>
      )}
      {formOpen && <div className="workspace-modal"><div className="workspace-modal-card">
        <div className="flex items-center justify-between"><div><p className="text-[11.5px] font-medium text-lime-700">التجهيز والتغليف</p><h3 className="mt-1 text-[18.5px] font-bold text-slate-900">بدء تجهيز طلب</h3></div><button type="button" onClick={() => setFormOpen(false)} className="modal-close"><X size={16} /></button></div>
        {saveError && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-[12.5px] font-bold text-red-600">{saveError}</div>}
        <div className="mt-5 grid gap-3">
          <label className="block"><span className="mb-1.5 block text-[11.5px] font-bold text-slate-500">الطلب</span><select className="workspace-input" value={draftOrderId || ""} onChange={(e) => setDraftOrderId(Number(e.target.value))}><option value="">اختر الطلب...</option>{orders.map((o) => <option key={o.id} value={o.id}>{o.order_number} — {o.title}</option>)}</select></label>
        </div>
        <button type="button" disabled={isSavingItem || !draftOrderId} onClick={createRecord} className="workspace-primary-button mt-5 w-full disabled:opacity-50">{isSavingItem ? "جاري الحفظ..." : "بدء التجهيز"}</button>
      </div></div>}
      {missingTargetId != null && <div className="workspace-modal"><div className="workspace-modal-card">
        <div className="flex items-center justify-between"><div><p className="text-[11.5px] font-medium text-red-700">التجهيز والتغليف</p><h3 className="mt-1 text-[18.5px] font-bold text-slate-900">الإبلاغ عن نقص</h3></div><button type="button" onClick={() => setMissingTargetId(null)} className="modal-close"><X size={16} /></button></div>
        {saveError && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-[12.5px] font-bold text-red-600">{saveError}</div>}
        <div className="mt-5 grid gap-3">
          <label className="block"><span className="mb-1.5 block text-[11.5px] font-bold text-slate-500">وصف النقص</span><input className="workspace-input" placeholder="مثال: نقص 5 قطع من الصنف X" value={missingNotes} onChange={(e) => setMissingNotes(e.target.value)} /></label>
        </div>
        <button type="button" disabled={isSavingItem || !missingNotes.trim()} onClick={submitMissing} className="workspace-primary-button mt-5 w-full disabled:opacity-50">{isSavingItem ? "جاري الحفظ..." : "تأكيد الإبلاغ عن النقص"}</button>
      </div></div>}
    </>
  );
}
function DeliveryReceiptsWorkspace() {
  const [records, setRecords] = useState<DeliveryReceiptUIRecord[]>([]);
  const [shipments, setShipments] = useState<CustomsShipmentOption[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [receiptsLoading, setReceiptsLoading] = useState(true);
  const [receiptsError, setReceiptsError] = useState<string | null>(null);
  const [isSavingItem, setIsSavingItem] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const emptyDraft = { shipmentId: 0, recipientName: "", proofImageUrl: "", notes: "" };
  const [draft, setDraft] = useState(emptyDraft);
  const mapItem = (item: ApiDeliveryReceiptRecord, shipmentsById: Map<number, CustomsShipmentOption>): DeliveryReceiptUIRecord => {
    const shipment = shipmentsById.get(item.shipment_id);
    return {
      id: item.id,
      shipmentId: item.shipment_id,
      shipmentLabel: shipment ? (shipment.tracking_number || `شحنة #${shipment.id}`) : `شحنة #${item.shipment_id}`,
      recipientName: item.recipient_name,
      proofImageUrl: item.proof_image_url ?? "",
      notes: item.notes ?? "",
      createdAt: item.created_at,
    };
  };
  const loadReceipts = useCallback(async () => {
    setReceiptsLoading(true);
    setReceiptsError(null);
    try {
      const [shipmentsData, receiptsData] = await Promise.all([getCustomsShipmentsApi(), getDeliveryReceiptsApi()]);
      setShipments(shipmentsData);
      const shipmentsById = new Map(shipmentsData.map((s) => [s.id, s]));
      setRecords(receiptsData.map((item) => mapItem(item, shipmentsById)));
    } catch (error) {
      setReceiptsError(error instanceof Error ? error.message : "تعذر تحميل إثباتات التسليم");
    } finally {
      setReceiptsLoading(false);
    }
  }, []);
  useEffect(() => {
    loadReceipts();
  }, [loadReceipts]);
  const withImage = records.filter((item) => item.proofImageUrl).length;
  const withoutImage = records.length - withImage;
  const openNew = () => { setEditingId(null); setSaveError(null); setDraft(emptyDraft); setFormOpen(true); };
  const openEdit = (item: DeliveryReceiptUIRecord) => { setEditingId(item.id); setSaveError(null); setDraft({ shipmentId: item.shipmentId, recipientName: item.recipientName, proofImageUrl: item.proofImageUrl, notes: item.notes }); setFormOpen(true); };
  const saveItem = async () => {
    if (!draft.shipmentId || !draft.recipientName.trim()) return;
    setIsSavingItem(true);
    setSaveError(null);
    try {
      const shipmentsById = new Map(shipments.map((s) => [s.id, s]));
      if (editingId) {
        const updated = await updateDeliveryReceiptApi(editingId, {
          recipient_name: draft.recipientName,
          proof_image_url: draft.proofImageUrl || null,
          notes: draft.notes || null,
        });
        setRecords((current) => current.map((item) => (item.id === editingId ? mapItem(updated, shipmentsById) : item)));
      } else {
        const created = await createDeliveryReceiptApi({
          shipment_id: draft.shipmentId,
          recipient_name: draft.recipientName,
          proof_image_url: draft.proofImageUrl || null,
          notes: draft.notes || null,
        });
        setRecords((current) => [mapItem(created, shipmentsById), ...current]);
      }
      setFormOpen(false);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "تعذر حفظ إثبات التسليم");
    } finally {
      setIsSavingItem(false);
    }
  };
  const archiveItem = async (id: number) => {
    try {
      await deleteDeliveryReceiptApi(id);
      setRecords((current) => current.filter((item) => item.id !== id));
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "تعذر أرشفة السجل");
    }
  };
  return (
    <>
      <WorkspaceHeader eyebrow="PROOF OF DELIVERY" title="إثبات التسليم" description="توثيق استلام العميل للبضاعة باسم المستلم وصورة الإثبات." icon={BadgeCheck} accent={{ bar: "#eaf0f4", border: "#d3e1e9", stripe: "#3e7a94", icon: "#3e7a94" }} action={<button type="button" onClick={openNew} className="workspace-primary-button"><Plus size={14} /> إضافة إثبات تسليم</button>} />
      <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <MiniStat label="إجمالي إثباتات التسليم" value={String(records.length)} icon={BadgeCheck} tone="bg-sky-50 text-sky-700" note="كل السجلات" />
        <MiniStat label="بإثبات صورة" value={String(withImage)} icon={CheckCircle2} tone="bg-emerald-50 text-emerald-700" note="موثقة بصورة" />
        <MiniStat label="بدون صورة إثبات" value={String(withoutImage)} icon={ShieldAlert} tone="bg-amber-50 text-amber-700" note="يفضل إضافتها لاحقاً" />
      </section>
      {receiptsLoading && (
        <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center text-[12.5px] font-medium text-slate-400">جاري تحميل إثباتات التسليم...</div>
      )}
      {!receiptsLoading && receiptsError && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-[12.5px] font-bold text-red-600">تعذر تحميل إثباتات التسليم — رمز الخطأ: {receiptsError}</div>
      )}
      {!receiptsLoading && !receiptsError && (
      <div className="columns-1 gap-4 sm:columns-2 xl:columns-3">
        {records.length === 0 && <p className="mb-4 break-inside-avoid rounded-2xl border border-slate-100 bg-white p-6 text-center text-[12.5px] font-medium text-slate-400">لا توجد إثباتات تسليم بعد.</p>}
        {records.map((item, idx) => (
          <div key={item.id} className="mb-4 break-inside-avoid rounded-2xl border border-sky-100 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[10.5px] font-bold text-sky-600">{item.shipmentLabel}</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${item.proofImageUrl ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{item.proofImageUrl ? "موثق بصورة" : "بدون صورة"}</span>
            </div>
            <div className="mt-3 flex justify-center">
              {item.proofImageUrl ? (
                <div className={`relative rounded bg-white p-1.5 pb-4 shadow-md ${idx % 2 === 0 ? "-rotate-2" : "rotate-2"}`}>
                  <span className="absolute -top-1.5 left-1/2 h-3 w-8 -translate-x-1/2 -rotate-1 bg-amber-100/80" />
                  <img src={item.proofImageUrl} alt="إثبات التسليم" className="h-24 w-full rounded-sm object-cover" />
                </div>
              ) : (
                <div className="flex h-24 w-full items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 text-slate-300">
                  <EyeOff size={20} />
                </div>
              )}
            </div>
            <div className="mt-3 border-t border-dashed border-slate-200 pt-2 text-center">
              <p className="text-[10px] font-bold text-slate-400">استلم البضاعة</p>
              <p className="mt-0.5 text-[13.5px] font-bold text-slate-900">{item.recipientName}</p>
            </div>
            {item.notes && <p className="mt-2 rounded-lg bg-amber-50 p-2 text-[10px] font-medium text-amber-700">{item.notes}</p>}
            <div className="mt-3 flex items-center gap-2">
              <button type="button" onClick={() => openEdit(item)} className="inline-flex h-7 flex-1 items-center justify-center gap-1 rounded-lg bg-slate-100 text-[10.5px] font-bold text-slate-700 hover:bg-slate-200"><SlidersHorizontal size={11} /> تعديل</button>
              <button type="button" onClick={() => { if (window.confirm("أرشفة هذا السجل؟")) archiveItem(item.id); }} className="inline-flex h-7 flex-1 items-center justify-center gap-1 rounded-lg bg-red-50 text-[10.5px] font-bold text-red-500 hover:bg-red-100"><Archive size={11} /> أرشفة</button>
            </div>
          </div>
        ))}
      </div>
      )}
      {formOpen && <div className="workspace-modal"><div className="workspace-modal-card">
        <div className="flex items-center justify-between"><div><p className="text-[11.5px] font-medium text-purple-700">إثبات التسليم</p><h3 className="mt-1 text-[18.5px] font-bold text-slate-900">{editingId ? "تعديل الإثبات" : "إضافة إثبات تسليم"}</h3></div><button type="button" onClick={() => setFormOpen(false)} className="modal-close"><X size={16} /></button></div>
        {saveError && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-[12.5px] font-bold text-red-600">{saveError}</div>}
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className="block sm:col-span-2"><span className="mb-1.5 block text-[11.5px] font-bold text-slate-500">الشحنة</span><select className="workspace-input" disabled={!!editingId} value={draft.shipmentId || ""} onChange={(e) => setDraft({ ...draft, shipmentId: Number(e.target.value) })}><option value="">اختر الشحنة...</option>{shipments.map((s) => <option key={s.id} value={s.id}>{s.tracking_number || `شحنة #${s.id}`}</option>)}</select></label>
          <label className="block sm:col-span-2"><span className="mb-1.5 block text-[11.5px] font-bold text-slate-500">اسم المستلم</span><input className="workspace-input" placeholder="اسم من استلم البضاعة" value={draft.recipientName} onChange={(e) => setDraft({ ...draft, recipientName: e.target.value })} /></label>
          <label className="block sm:col-span-2"><span className="mb-1.5 block text-[11.5px] font-bold text-slate-500">رابط صورة الإثبات (اختياري)</span><input className="workspace-input" placeholder="https://..." value={draft.proofImageUrl} onChange={(e) => setDraft({ ...draft, proofImageUrl: e.target.value })} /></label>
          <label className="block sm:col-span-2"><span className="mb-1.5 block text-[11.5px] font-bold text-slate-500">ملاحظات (اختياري)</span><input className="workspace-input" placeholder="أي تفاصيل إضافية" value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} /></label>
        </div>
        <button type="button" disabled={isSavingItem || !draft.shipmentId || !draft.recipientName.trim()} onClick={saveItem} className="workspace-primary-button mt-5 w-full disabled:opacity-50">{isSavingItem ? "جاري الحفظ..." : editingId ? "حفظ التعديلات" : "إضافة الإثبات"}</button>
      </div></div>}
    </>
  );
}
function ReceivingWorkspace() {
  const [records, setRecords] = useState<ReceivingUIRecord[]>([]);
  const [shipments, setShipments] = useState<CustomsShipmentOption[]>([]);
  const [statusFilter, setStatusFilter] = useState("الكل");
  const [formOpen, setFormOpen] = useState(false);
  const [receiveTargetId, setReceiveTargetId] = useState<number | null>(null);
  const [receivingLoading, setReceivingLoading] = useState(true);
  const [receivingError, setReceivingError] = useState<string | null>(null);
  const [isSavingItem, setIsSavingItem] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const emptyDraft = { shipmentId: 0, expectedQuantity: 0 };
  const [draft, setDraft] = useState(emptyDraft);
  const emptyReceiveDraft = { actualQuantity: 0, storageLocation: "", damageNotes: "" };
  const [receiveDraft, setReceiveDraft] = useState(emptyReceiveDraft);
  const statusLabels: Record<ReceivingStatus, string> = { pending: "بانتظار الاستلام", received: "تم الاستلام", discrepancy: "فرق بالكمية" };
  const statusTones: Record<ReceivingStatus, string> = { pending: "bg-amber-50 text-amber-700", received: "bg-emerald-50 text-emerald-700", discrepancy: "bg-red-50 text-red-700" };
  const mapItem = (item: ApiReceivingRecord, shipmentsById: Map<number, CustomsShipmentOption>): ReceivingUIRecord => {
    const shipment = shipmentsById.get(item.shipment_id);
    return {
      id: item.id,
      shipmentId: item.shipment_id,
      shipmentLabel: shipment ? (shipment.tracking_number || `شحنة #${shipment.id}`) : `شحنة #${item.shipment_id}`,
      expectedQuantity: item.expected_quantity,
      actualQuantity: item.actual_quantity,
      storageLocation: item.storage_location ?? "",
      damageNotes: item.damage_notes ?? "",
      status: item.status,
      receiptSent: item.receipt_sent,
      receivedAt: item.received_at ?? "",
    };
  };
  const loadReceiving = useCallback(async () => {
    setReceivingLoading(true);
    setReceivingError(null);
    try {
      const [shipmentsData, receivingData] = await Promise.all([getCustomsShipmentsApi(), getReceivingApi()]);
      setShipments(shipmentsData);
      const shipmentsById = new Map(shipmentsData.map((s) => [s.id, s]));
      setRecords(receivingData.map((item) => mapItem(item, shipmentsById)));
    } catch (error) {
      setReceivingError(error instanceof Error ? error.message : "تعذر تحميل بيانات الاستلام");
    } finally {
      setReceivingLoading(false);
    }
  }, []);
  useEffect(() => {
    loadReceiving();
  }, [loadReceiving]);
  const statusOptions = ["الكل", "بانتظار الاستلام", "تم الاستلام", "فرق بالكمية"];
  const statusFilterMap: Record<string, ReceivingStatus | null> = { "الكل": null, "بانتظار الاستلام": "pending", "تم الاستلام": "received", "فرق بالكمية": "discrepancy" };
  const visible = records.filter((item) => { const target = statusFilterMap[statusFilter]; return !target || item.status === target; });
  const pendingCount = records.filter((item) => item.status === "pending").length;
  const receivedCount = records.filter((item) => item.status === "received").length;
  const discrepancyCount = records.filter((item) => item.status === "discrepancy").length;
  const openNew = () => { setSaveError(null); setDraft(emptyDraft); setFormOpen(true); };
  const openReceiveForm = (item: ReceivingUIRecord) => { setReceiveTargetId(item.id); setSaveError(null); setReceiveDraft({ actualQuantity: item.expectedQuantity, storageLocation: "", damageNotes: "" }); };
  const saveNewRecord = async () => {
    if (!draft.shipmentId || draft.expectedQuantity <= 0) return;
    setIsSavingItem(true);
    setSaveError(null);
    try {
      const shipmentsById = new Map(shipments.map((s) => [s.id, s]));
      const created = await createReceivingApi({ shipment_id: draft.shipmentId, expected_quantity: draft.expectedQuantity });
      setRecords((current) => [mapItem(created, shipmentsById), ...current]);
      setFormOpen(false);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "تعذر إضافة سجل الاستلام");
    } finally {
      setIsSavingItem(false);
    }
  };
  const submitReceive = async () => {
    if (receiveTargetId == null || receiveDraft.actualQuantity < 0) return;
    setIsSavingItem(true);
    setSaveError(null);
    try {
      const shipmentsById = new Map(shipments.map((s) => [s.id, s]));
      const updated = await recordArrivalApi(receiveTargetId, {
        actual_quantity: receiveDraft.actualQuantity,
        storage_location: receiveDraft.storageLocation || null,
        damage_notes: receiveDraft.damageNotes || null,
      });
      setRecords((current) => current.map((item) => (item.id === receiveTargetId ? mapItem(updated, shipmentsById) : item)));
      setReceiveTargetId(null);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "تعذر تسجيل الاستلام");
    } finally {
      setIsSavingItem(false);
    }
  };
  const sendReceipt = async (id: number) => {
    try {
      const shipmentsById = new Map(shipments.map((s) => [s.id, s]));
      const updated = await sendReceivingReceiptApi(id);
      setRecords((current) => current.map((item) => (item.id === id ? mapItem(updated, shipmentsById) : item)));
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "تعذر إرسال الإيصال");
    }
  };
  const archiveItem = async (id: number) => {
    try {
      await deleteReceivingApi(id);
      setRecords((current) => current.filter((item) => item.id !== id));
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "تعذر أرشفة السجل");
    }
  };
  return (
    <>
      <WorkspaceHeader eyebrow="RECEIVING" title="الاستلام" description="فحص البضاعة الواردة ومطابقة الكميات وتسجيل التلف قبل التخزين." icon={PackageOpen} accent={{ bar: "#fbe9ef", border: "#f3d3e0", stripe: "#c15a80", icon: "#c15a80" }} action={<button type="button" onClick={openNew} className="workspace-primary-button"><Plus size={14} /> سجل استلام جديد</button>} />
      <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MiniStat label="إجمالي السجلات" value={String(records.length)} icon={PackageOpen} tone="bg-sky-50 text-sky-700" note="كل السجلات" />
        <MiniStat label="بانتظار الاستلام" value={String(pendingCount)} icon={ShieldAlert} tone="bg-amber-50 text-amber-700" note="لم تُفحص بعد" />
        <MiniStat label="تم الاستلام" value={String(receivedCount)} icon={CheckCircle2} tone="bg-emerald-50 text-emerald-700" note="مطابقة كاملة" />
        <MiniStat label="فرق بالكمية" value={String(discrepancyCount)} icon={CircleAlert} tone="bg-red-50 text-red-700" note="يحتاج مراجعة" />
      </section>
      {receivingLoading && (
        <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center text-[12.5px] font-medium text-slate-400">جاري تحميل بيانات الاستلام...</div>
      )}
      {!receivingLoading && receivingError && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-[12.5px] font-bold text-red-600">تعذر تحميل بيانات الاستلام — رمز الخطأ: {receivingError}</div>
      )}
      {!receivingLoading && !receivingError && (
      <>
      <Surface className="mb-5 p-4"><div className="flex flex-wrap gap-2">{statusOptions.map((item) => <button key={item} type="button" onClick={() => setStatusFilter(item)} className={`workspace-filter ${statusFilter === item ? "is-active" : ""}`}>{item}</button>)}</div></Surface>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((item) => (
          <article key={item.id} className="record-card">
            <div className="flex items-start justify-between gap-3"><span className="record-icon"><PackageOpen size={17} /></span><span className={`-rotate-3 rounded-md border-2 border-dashed px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${statusTones[item.status]}`} style={{ borderColor: "currentColor" }}>{statusLabels[item.status]}</span></div>
            <p className="mt-4 text-[11.5px] font-bold text-emerald-700">{item.shipmentLabel}</p>
            <h3 className="mt-1 text-[13.5px] font-bold text-slate-900">سجل استلام REC-{item.id}</h3>
            <div className="mt-3 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="w-10 shrink-0 text-[10px] font-bold text-slate-400">متوقع</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-slate-300" style={{ width: "100%" }} /></div>
                    <span className="w-6 shrink-0 text-left text-[10.5px] font-black text-slate-600">{item.expectedQuantity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-10 shrink-0 text-[10px] font-bold text-slate-400">فعلي</span>
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                      {item.actualQuantity != null && (
                        <div className={`h-full rounded-full ${item.actualQuantity === item.expectedQuantity ? "bg-emerald-400" : "bg-red-400"}`} style={{ width: `${Math.min(100, Math.round((item.actualQuantity / Math.max(item.expectedQuantity, 1)) * 100))}%` }} />
                      )}
                    </div>
                    <span className={`w-6 shrink-0 text-left text-[10.5px] font-black ${item.actualQuantity != null ? (item.actualQuantity === item.expectedQuantity ? "text-emerald-600" : "text-red-500") : "text-slate-300"}`}>{item.actualQuantity ?? "—"}</span>
                  </div>
                  {item.actualQuantity != null && item.actualQuantity !== item.expectedQuantity && (
                    <div className="flex items-center gap-2">
                      <span className="w-10 shrink-0 text-[10px] font-bold text-red-500">الفرق</span>
                      <div className="h-1.5 flex-1" />
                      <span className="w-10 shrink-0 text-left text-[10.5px] font-black text-red-600">{item.actualQuantity - item.expectedQuantity > 0 ? "+" : ""}{item.actualQuantity - item.expectedQuantity}</span>
                    </div>
                  )}
                </div>
            {item.storageLocation && <p className="mt-2 text-[11.5px] font-medium text-slate-500">موقع التخزين: {item.storageLocation}</p>}
            {item.damageNotes && <p className="mt-1 text-[10.5px] font-medium text-red-500">ملاحظات التلف: {item.damageNotes}</p>}
            {item.status !== "pending" && <p className="mt-2 text-[10.5px] font-medium text-slate-400">{item.receiptSent ? "تم إرسال الإيصال للعميل" : "لم يُرسل الإيصال بعد"}</p>}
            <div className="mt-4 grid grid-cols-2 gap-2">
              {item.status === "pending" && <button type="button" onClick={() => openReceiveForm(item)} className="record-action"><PackageCheck size={13} /> تسجيل الاستلام</button>}
              {item.status !== "pending" && !item.receiptSent && <button type="button" onClick={() => sendReceipt(item.id)} className="record-action"><Send size={13} /> إرسال الإيصال</button>}
              <button type="button" onClick={() => { if (window.confirm("أرشفة هذا السجل؟")) archiveItem(item.id); }} className="record-action record-action-danger"><Archive size={13} /> أرشفة</button>
            </div>
          </article>
        ))}
      </section>
      </>
      )}
      {formOpen && <div className="workspace-modal"><div className="workspace-modal-card">
        <div className="flex items-center justify-between"><div><p className="text-[11.5px] font-medium text-emerald-700">الاستلام</p><h3 className="mt-1 text-[18.5px] font-bold text-slate-900">سجل استلام جديد</h3></div><button type="button" onClick={() => setFormOpen(false)} className="modal-close"><X size={16} /></button></div>
        {saveError && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-[12.5px] font-bold text-red-600">{saveError}</div>}
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className="block sm:col-span-2"><span className="mb-1.5 block text-[11.5px] font-bold text-slate-500">الشحنة</span><select className="workspace-input" value={draft.shipmentId || ""} onChange={(e) => setDraft({ ...draft, shipmentId: Number(e.target.value) })}><option value="">اختر الشحنة...</option>{shipments.map((s) => <option key={s.id} value={s.id}>{s.tracking_number || `شحنة #${s.id}`}</option>)}</select></label>
          <label className="block"><span className="mb-1.5 block text-[11.5px] font-bold text-slate-500">الكمية المتوقعة</span><input className="workspace-input" type="number" placeholder="0" value={draft.expectedQuantity} onChange={(e) => setDraft({ ...draft, expectedQuantity: Number(e.target.value) })} /></label>
        </div>
        <button type="button" disabled={isSavingItem || !draft.shipmentId || draft.expectedQuantity <= 0} onClick={saveNewRecord} className="workspace-primary-button mt-5 w-full disabled:opacity-50">{isSavingItem ? "جاري الحفظ..." : "إضافة السجل"}</button>
      </div></div>}
      {receiveTargetId != null && <div className="workspace-modal"><div className="workspace-modal-card">
        <div className="flex items-center justify-between"><div><p className="text-[11.5px] font-medium text-emerald-700">الاستلام</p><h3 className="mt-1 text-[18.5px] font-bold text-slate-900">تسجيل استلام البضاعة</h3></div><button type="button" onClick={() => setReceiveTargetId(null)} className="modal-close"><X size={16} /></button></div>
        {saveError && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-[12.5px] font-bold text-red-600">{saveError}</div>}
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className="block"><span className="mb-1.5 block text-[11.5px] font-bold text-slate-500">الكمية الفعلية المستلمة</span><input className="workspace-input" type="number" placeholder="0" value={receiveDraft.actualQuantity} onChange={(e) => setReceiveDraft({ ...receiveDraft, actualQuantity: Number(e.target.value) })} /></label>
          <label className="block"><span className="mb-1.5 block text-[11.5px] font-bold text-slate-500">موقع التخزين</span><input className="workspace-input" placeholder="مثال: ممر A - رف 12" value={receiveDraft.storageLocation} onChange={(e) => setReceiveDraft({ ...receiveDraft, storageLocation: e.target.value })} /></label>
          <label className="block sm:col-span-2"><span className="mb-1.5 block text-[11.5px] font-bold text-slate-500">ملاحظات التلف (اختياري)</span><input className="workspace-input" placeholder="وصف أي ضرر أو نقص" value={receiveDraft.damageNotes} onChange={(e) => setReceiveDraft({ ...receiveDraft, damageNotes: e.target.value })} /></label>
        </div>
        <button type="button" disabled={isSavingItem} onClick={submitReceive} className="workspace-primary-button mt-5 w-full disabled:opacity-50">{isSavingItem ? "جاري الحفظ..." : "تأكيد الاستلام"}</button>
      </div></div>}
    </>
  );
}
function CustomsWorkspace() {
  const [records, setRecords] = useState<CustomsUIRecord[]>([]);
  const [shipments, setShipments] = useState<CustomsShipmentOption[]>([]);
  const [statusFilter, setStatusFilter] = useState("الكل");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [customsLoading, setCustomsLoading] = useState(true);
  const [customsError, setCustomsError] = useState<string | null>(null);
  const [isSavingItem, setIsSavingItem] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const emptyDraft = { shipmentId: 0, dutyAmount: 0, vatAmount: 0, portCharges: 0, freeTimeExpiry: "", notes: "" };
  const [draft, setDraft] = useState(emptyDraft);
  const statusLabels: Record<CustomsStatus, string> = { pending: "قيد الانتظار", in_progress: "قيد التخليص", released: "تم التخليص" };
  const statusTones: Record<CustomsStatus, string> = { pending: "bg-amber-50 text-amber-700", in_progress: "bg-sky-50 text-sky-700", released: "bg-emerald-50 text-emerald-700" };
  const mapItem = (item: ApiCustomsRecord, shipmentsById: Map<number, CustomsShipmentOption>): CustomsUIRecord => {
    const shipment = shipmentsById.get(item.shipment_id);
    return {
      id: item.id,
      shipmentId: item.shipment_id,
      shipmentLabel: shipment ? (shipment.tracking_number || `شحنة #${shipment.id}`) : `شحنة #${item.shipment_id}`,
      status: item.status as CustomsStatus,
      dutyAmount: item.duty_amount,
      vatAmount: item.vat_amount,
      portCharges: item.port_charges,
      freeTimeExpiry: item.free_time_expiry ?? "",
      releasedAt: item.released_at ?? "",
      notes: item.notes ?? "",
    };
  };
  const loadCustoms = useCallback(async () => {
    setCustomsLoading(true);
    setCustomsError(null);
    try {
      const [shipmentsData, customsData] = await Promise.all([getCustomsShipmentsApi(), getCustomsApi()]);
      setShipments(shipmentsData);
      const shipmentsById = new Map(shipmentsData.map((s) => [s.id, s]));
      setRecords(customsData.map((item) => mapItem(item, shipmentsById)));
    } catch (error) {
      setCustomsError(error instanceof Error ? error.message : "تعذر تحميل بيانات الجمارك");
    } finally {
      setCustomsLoading(false);
    }
  }, []);
  useEffect(() => {
    loadCustoms();
  }, [loadCustoms]);
  const statusOptions = ["الكل", "قيد الانتظار", "قيد التخليص", "تم التخليص"];
  const statusFilterMap: Record<string, CustomsStatus | null> = { "الكل": null, "قيد الانتظار": "pending", "قيد التخليص": "in_progress", "تم التخليص": "released" };
  const visible = records.filter((item) => { const target = statusFilterMap[statusFilter]; return !target || item.status === target; }).sort((a, b) => {
    const urgency = (item: any) => {
      if (item.status === "released" || !item.freeTimeExpiry) return 999999;
      return Math.ceil((new Date(item.freeTimeExpiry).getTime() - Date.now()) / 86400000);
    };
    return urgency(a) - urgency(b);
  });
  const totalFees = records.reduce((sum, item) => sum + item.dutyAmount + item.vatAmount + item.portCharges, 0);
  const pendingCount = records.filter((item) => item.status === "pending").length;
  const releasedCount = records.filter((item) => item.status === "released").length;
  const openNew = () => { setEditingId(null); setSaveError(null); setDraft(emptyDraft); setFormOpen(true); };
  const openEdit = (item: CustomsUIRecord) => { setEditingId(item.id); setSaveError(null); setDraft({ shipmentId: item.shipmentId, dutyAmount: item.dutyAmount, vatAmount: item.vatAmount, portCharges: item.portCharges, freeTimeExpiry: item.freeTimeExpiry, notes: item.notes }); setFormOpen(true); };
  const saveItem = async () => {
    if (!draft.shipmentId) return;
    setIsSavingItem(true);
    setSaveError(null);
    try {
      const shipmentsById = new Map(shipments.map((s) => [s.id, s]));
      if (editingId) {
        const updated = await updateCustomsApi(editingId, {
          duty_amount: draft.dutyAmount,
          vat_amount: draft.vatAmount,
          port_charges: draft.portCharges,
          free_time_expiry: draft.freeTimeExpiry || null,
          notes: draft.notes || null,
        });
        setRecords((current) => current.map((item) => (item.id === editingId ? mapItem(updated, shipmentsById) : item)));
      } else {
        const created = await createCustomsApi({
          shipment_id: draft.shipmentId,
          duty_amount: draft.dutyAmount,
          vat_amount: draft.vatAmount,
          port_charges: draft.portCharges,
          free_time_expiry: draft.freeTimeExpiry || null,
          notes: draft.notes || null,
        });
        setRecords((current) => [mapItem(created, shipmentsById), ...current]);
      }
      setFormOpen(false);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "تعذر حفظ معاملة الجمارك");
    } finally {
      setIsSavingItem(false);
    }
  };
  const deleteItem = async (id: number) => {
    try {
      await deleteCustomsApi(id);
      setRecords((current) => current.filter((item) => item.id !== id));
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "تعذر حذف المعاملة");
    }
  };
  const advanceStatus = async (id: number, nextStatus: CustomsStatus) => {
    try {
      const shipmentsById = new Map(shipments.map((s) => [s.id, s]));
      const updated = await updateCustomsApi(id, { status: nextStatus });
      setRecords((current) => current.map((item) => (item.id === id ? mapItem(updated, shipmentsById) : item)));
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "تعذر تحديث حالة المعاملة");
    }
  };
  return (
    <>
      <WorkspaceHeader eyebrow="CUSTOMS CLEARANCE" title="الجمارك" description="متابعة معاملات التخليص الجمركي والرسوم لكل شحنة." icon={Landmark} accent={{ bar: "#eaf0f4", border: "#d3e1e9", stripe: "#3e7a94", icon: "#3e7a94" }} action={<button type="button" onClick={openNew} className="workspace-primary-button"><Plus size={14} /> إضافة معاملة</button>} />
      {(() => {
        const overdueCount = records.filter((item) => item.status !== "released" && item.freeTimeExpiry && item.freeTimeExpiry < new Date().toISOString().slice(0, 10)).length;
        const insight = overdueCount > 0
          ? { text: "⚠ عندك " + overdueCount + " معاملة تجاوزت المهلة المجانية — خطر رسوم تأخير إضافية", bg: "#fff1f2", fg: "#be123c" }
          : { text: "✓ لا يوجد معاملات متجاوزة للمهلة الجمركية المجانية", bg: "#eaf0f4", fg: "#3e7a94" };
        return (
          <div className="mb-4 rounded-2xl px-4 py-3 text-[13.5px] font-bold" style={{ backgroundColor: insight.bg, color: insight.fg }}>
            {insight.text}
          </div>
        );
      })()}
      <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MiniStat label="إجمالي المعاملات" value={String(records.length)} icon={Landmark} tone="bg-sky-50 text-sky-700" note="كل السجلات" />
        <MiniStat label="قيد الانتظار" value={String(pendingCount)} icon={ShieldAlert} tone="bg-amber-50 text-amber-700" note="بانتظار الإجراءات" />
        <MiniStat label="تم التخليص" value={String(releasedCount)} icon={CheckCircle2} tone="bg-emerald-50 text-emerald-700" note="مكتملة" />
        <MiniStat label="إجمالي الرسوم" value={formatCurrency(totalFees)} icon={CircleDollarSign} tone="bg-blue-50 text-blue-700" note="جمارك + ضريبة + موانئ" />
      </section>
      {customsLoading && (
        <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center text-[12.5px] font-medium text-slate-400">جاري تحميل بيانات الجمارك...</div>
      )}
      {!customsLoading && customsError && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-[12.5px] font-bold text-red-600">تعذر تحميل بيانات الجمارك — رمز الخطأ: {customsError}</div>
      )}
      {!customsLoading && !customsError && (
      <>
      <Surface className="mb-5 p-4"><div className="flex flex-wrap gap-2">{statusOptions.map((item) => <button key={item} type="button" onClick={() => setStatusFilter(item)} className={`workspace-filter ${statusFilter === item ? "is-active" : ""}`}>{item}</button>)}</div></Surface>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((item) => (
          <article key={item.id} className="record-card">
            <div className="flex items-start justify-between gap-3"><span className="record-icon"><Landmark size={17} /></span><span className={`rounded-full px-3 py-1 text-[10.5px] font-bold ${statusTones[item.status]}`}>{statusLabels[item.status]}</span></div>
            <p className="mt-4 text-[11.5px] font-bold text-amber-700">{item.shipmentLabel}</p>
            <h3 className="mt-1 text-[13.5px] font-bold text-slate-900">معاملة رقم CUST-{item.id}</h3>
            {item.freeTimeExpiry && item.status !== "released" && (() => {
                const diffDays = Math.ceil((new Date(item.freeTimeExpiry).getTime() - new Date().setHours(0,0,0,0)) / 86400000);
                const tone = diffDays < 0 ? "bg-rose-50 text-rose-700" : diffDays <= 3 ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700";
                const label = diffDays < 0 ? ("متأخر " + Math.abs(diffDays) + " يوم") : diffDays === 0 ? "ينتهي اليوم" : ("باقي " + diffDays + " يوم");
                return <span className={`mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10.5px] font-bold ${tone}`}>⏱ {label}</span>;
              })()}
            {item.notes && <p className="mt-1 text-[10.5px] font-medium text-slate-400">{item.notes}</p>}
            {(() => {
                const total = item.dutyAmount + item.vatAmount + item.portCharges;
                const dutyPct = total ? (item.dutyAmount / total) * 100 : 0;
                const vatPct = total ? (item.vatAmount / total) * 100 : 0;
                const portPct = total ? (item.portCharges / total) * 100 : 0;
                return (
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-[10.5px] font-bold text-slate-400">
                      <span>إجمالي الرسوم</span>
                      <span className="text-[14.5px] font-black text-slate-900">{formatCurrency(total)}</span>
                    </div>
                    <div className="mt-1.5 flex h-2 overflow-hidden rounded-full bg-slate-100">
                      <div style={{ width: dutyPct + "%", backgroundColor: "#3e7a94" }} title={"جمارك " + formatCurrency(item.dutyAmount)} />
                      <div style={{ width: vatPct + "%", backgroundColor: "#d97706" }} title={"ضريبة " + formatCurrency(item.vatAmount)} />
                      <div style={{ width: portPct + "%", backgroundColor: "#7c5a9e" }} title={"موانئ " + formatCurrency(item.portCharges)} />
                    </div>
                    <div className="mt-1.5 flex justify-between text-[9.5px] font-bold text-slate-400">
                      <span>جمارك {formatCurrency(item.dutyAmount)}</span>
                      <span>ضريبة {formatCurrency(item.vatAmount)}</span>
                      <span>موانئ {formatCurrency(item.portCharges)}</span>
                    </div>
                  </div>
                );
              })()}
            <div className="mt-4 grid grid-cols-3 gap-2">
              {item.status === "pending" && <button type="button" onClick={() => advanceStatus(item.id, "in_progress")} className="record-action"><Clock3 size={13} /> بدء التخليص</button>}
              {item.status === "in_progress" && <button type="button" onClick={() => advanceStatus(item.id, "released")} className="record-action"><Check size={13} /> إنهاء التخليص</button>}
              {item.status === "released" && <span className="record-action opacity-40">تم التخليص</span>}
              <button type="button" onClick={() => openEdit(item)} className="record-action"><SlidersHorizontal size={13} /> تعديل</button>
              <button type="button" onClick={() => { if (window.confirm("حذف هذه المعاملة؟")) deleteItem(item.id); }} className="record-action record-action-danger"><Trash2 size={13} /></button>
            </div>
          </article>
        ))}
      </section>
      </>
      )}
      {formOpen && <div className="workspace-modal"><div className="workspace-modal-card">
        <div className="flex items-center justify-between"><div><p className="text-[11.5px] font-medium text-amber-700">الجمارك</p><h3 className="mt-1 text-[18.5px] font-bold text-slate-900">{editingId ? "تعديل المعاملة" : "إضافة معاملة جمركية"}</h3></div><button type="button" onClick={() => setFormOpen(false)} className="modal-close"><X size={16} /></button></div>
        {saveError && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-[12.5px] font-bold text-red-600">{saveError}</div>}
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className="block sm:col-span-2"><span className="mb-1.5 block text-[11.5px] font-bold text-slate-500">الشحنة</span><select className="workspace-input" value={draft.shipmentId || ""} onChange={(e) => setDraft({ ...draft, shipmentId: Number(e.target.value) })}><option value="">اختر الشحنة...</option>{shipments.map((s) => <option key={s.id} value={s.id}>{s.tracking_number || `شحنة #${s.id}`}</option>)}</select></label>
          <label className="block"><span className="mb-1.5 block text-[11.5px] font-bold text-slate-500">الرسوم الجمركية (ر.س)</span><input className="workspace-input" type="number" placeholder="0" value={draft.dutyAmount} onChange={(e) => setDraft({ ...draft, dutyAmount: Number(e.target.value) })} /></label>
          <label className="block"><span className="mb-1.5 block text-[11.5px] font-bold text-slate-500">ضريبة القيمة المضافة (ر.س)</span><input className="workspace-input" type="number" placeholder="0" value={draft.vatAmount} onChange={(e) => setDraft({ ...draft, vatAmount: Number(e.target.value) })} /></label>
          <label className="block"><span className="mb-1.5 block text-[11.5px] font-bold text-slate-500">رسوم الموانئ (ر.س)</span><input className="workspace-input" type="number" placeholder="0" value={draft.portCharges} onChange={(e) => setDraft({ ...draft, portCharges: Number(e.target.value) })} /></label>
          <label className="block"><span className="mb-1.5 block text-[11.5px] font-bold text-slate-500">انتهاء المهلة المجانية</span><input className="workspace-input" type="date" value={draft.freeTimeExpiry} onChange={(e) => setDraft({ ...draft, freeTimeExpiry: e.target.value })} /></label>
          <label className="block sm:col-span-2"><span className="mb-1.5 block text-[11.5px] font-bold text-slate-500">ملاحظات (اختياري)</span><input className="workspace-input" placeholder="أي تفاصيل إضافية" value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} /></label>
        </div>
        <button type="button" disabled={isSavingItem || !draft.shipmentId} onClick={saveItem} className="workspace-primary-button mt-5 w-full disabled:opacity-50">{isSavingItem ? "جاري الحفظ..." : editingId ? "حفظ التعديلات" : "إضافة المعاملة"}</button>
      </div></div>}
    </>
  );
}
function InventoryWorkspace() {
  const [items, setItems] = useState<InventoryRecord[]>([]);
  const [customers, setCustomers] = useState<InventoryCustomerOption[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseRecord[]>([]);
  const [category, setCategory] = useState("الكل");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [inventoryLoading, setInventoryLoading] = useState(true);
  const [inventoryError, setInventoryError] = useState<string | null>(null);
  const [isSavingItem, setIsSavingItem] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const emptyDraft = { name: "", category: "أجهزة", sku: "", stock: 0, minimum: 5, maximum: 50, warehouse: "المستودع الرئيسي", location: "", batchNumber: "", customerId: 0, customerName: "", unitValue: 0, movement: 0 };
  const [draft, setDraft] = useState<Omit<InventoryRecord, "id" | "dbId">>(emptyDraft);

  const mapItem = (item: ApiInventoryItem, customersById: Map<number, InventoryCustomerOption>): InventoryRecord => {
    const customer = item.customer_id != null ? customersById.get(item.customer_id) : undefined;
    return {
      id: String(item.id),
      dbId: item.id,
      name: item.name,
      category: item.category ?? "عام",
      sku: item.sku,
      stock: item.quantity,
      minimum: item.minimum,
      maximum: item.maximum,
      warehouse: item.warehouse ?? "المستودع الرئيسي",
      location: item.location ?? "",
      batchNumber: item.batch_number ?? "",
      customerId: item.customer_id ?? 0,
      customerName: customer?.name ?? "غير محدد",
      unitValue: item.unit_price,
      movement: item.movement,
    };
  };

  const loadInventory = useCallback(async () => {
    setInventoryLoading(true);
    setInventoryError(null);
    try {
      const [customersData, inventoryData] = await Promise.all([getInventoryCustomersApi(), getInventoryApi()]);
      setCustomers(customersData);
      const customersById = new Map(customersData.map((customer) => [customer.id, customer]));
      setItems(inventoryData.map((item) => mapItem(item, customersById)));
    } catch (error) {
      setInventoryError(error instanceof Error ? error.message : "تعذر تحميل المخزون");
    } finally {
      setInventoryLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);
  useEffect(() => {
    getWarehousesApi().then(setWarehouses).catch(() => {});
  }, []);
  const addWarehouse = async () => {
    const name = window.prompt("اسم المستودع الجديد");
    if (!name || !name.trim()) return;
    try {
      const created = await createWarehouseApi({ name: name.trim() });
      setWarehouses((current) => [...current, created]);
      setDraft((current) => ({ ...current, warehouse: created.name }));
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "تعذر إضافة المستودع");
    }
  };

  const categories = ["الكل", ...Array.from(new Set(items.map((item) => item.category)))];
  const visible = items.filter((item) => category === "الكل" || item.category === category);
  const totalValue = items.reduce((sum, item) => sum + item.stock * item.unitValue, 0);
  const lowItems = items.filter((item) => item.stock <= item.minimum);
  const openNew = () => { setEditingId(null); setSaveError(null); setDraft(emptyDraft); setFormOpen(true); };
  const openEdit = (item: InventoryRecord) => { const { id, dbId, ...rest } = item; setEditingId(id); setSaveError(null); setDraft(rest); setFormOpen(true); };
  const saveItem = async () => {
    if (!draft.name.trim() || !draft.sku.trim() || !draft.customerId) return;
    setIsSavingItem(true);
    setSaveError(null);
    try {
      const customersById = new Map(customers.map((customer) => [customer.id, customer]));
      if (editingId) {
        const target = items.find((item) => item.id === editingId);
        if (!target) return;
        const updated = await updateInventoryItemApi(target.dbId, {
          name: draft.name,
          sku: draft.sku,
          quantity: draft.stock,
          unit_price: draft.unitValue,
          category: draft.category,
          warehouse: draft.warehouse,
          location: draft.location,
          batch_number: draft.batchNumber,
          customer_id: draft.customerId,
          minimum: draft.minimum,
          maximum: draft.maximum,
        });
        setItems((current) => current.map((item) => item.id === editingId ? mapItem(updated, customersById) : item));
      } else {
        const created = await createInventoryItemApi({
          name: draft.name,
          quantity: draft.stock,
          unit_price: draft.unitValue,
          customer_id: draft.customerId,
          category: draft.category,
          warehouse: draft.warehouse,
          location: draft.location,
          batch_number: draft.batchNumber,
          minimum: draft.minimum,
          maximum: draft.maximum,
        });
        setItems((current) => [mapItem(created, customersById), ...current]);
      }
      setFormOpen(false);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "تعذر حفظ الصنف");
    } finally {
      setIsSavingItem(false);
    }
  };
  const deleteItem = async (id: string) => {
    const target = items.find((item) => item.id === id);
    if (!target) return;
    try {
      await deleteInventoryItemApi(target.dbId);
      setItems((current) => current.filter((item) => item.id !== id));
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "تعذر حذف الصنف");
    }
  };
  const restock = async (id: string) => {
    const target = items.find((item) => item.id === id);
    if (!target) return;
    try {
      const customersById = new Map(customers.map((customer) => [customer.id, customer]));
      const updated = await restockInventoryItemApi(target.dbId);
      setItems((current) => current.map((item) => item.id === id ? mapItem(updated, customersById) : item));
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "تعذر توريد الصنف");
    }
  };
  return (
    <>
      <WorkspaceHeader eyebrow="INVENTORY CONTROL" title="المخزون" description="بضاعة العملاء المخزّنة لديك — إضافة الأصناف وتعديل الكميات والحدود وإدارة التوريد." icon={Warehouse} accent={{ bar: "#eaf3ee", border: "#cfe7de", stripe: "#0f766e", icon: "#0f766e" }} action={<button type="button" onClick={openNew} className="workspace-primary-button"><Plus size={14} /> إضافة صنف</button>} />
      <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><MiniStat label="قيمة المخزون" value={formatCurrency(totalValue)} icon={CircleDollarSign} tone="bg-sky-50 text-sky-700" note="القيمة الحالية" /><MiniStat label="إجمالي الأصناف" value={String(items.length)} icon={Boxes} tone="bg-blue-50 text-blue-700" note="كل المستودعات" /><MiniStat label="تحتاج توريد" value={String(lowItems.length)} icon={ShieldAlert} tone="bg-amber-50 text-amber-700" note="أقل من الحد الأدنى" /><MiniStat label="مستودعات نشطة" value={String(new Set(items.map((item) => item.warehouse)).size)} icon={Warehouse} tone="bg-emerald-50 text-emerald-700" note="مواقع التخزين" /></section>
      {inventoryLoading && (
        <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center text-[12.5px] font-medium text-slate-400">جاري تحميل المخزون...</div>
      )}
      {!inventoryLoading && inventoryError && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-[12.5px] font-bold text-red-600">تعذر تحميل المخزون — رمز الخطأ: {inventoryError}</div>
      )}
      {!inventoryLoading && !inventoryError && (
      <>
      <Surface className="mb-5 p-4"><div className="flex flex-wrap gap-2">{categories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`workspace-filter ${category === item ? "is-active" : ""}`}>{item}</button>)}</div></Surface>
      <Surface className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-right">
            <thead>
              <tr className="border-b border-slate-100 bg-teal-50/40">
                <th className="p-3 text-[10.5px] font-bold text-teal-700">الصنف</th>
                <th className="p-3 text-[10.5px] font-bold text-teal-700">الفئة والمستودع</th>
                <th className="p-3 text-[10.5px] font-bold text-teal-700">العميل</th>
                <th className="p-3 text-[10.5px] font-bold text-teal-700">مستوى المخزون</th>
                <th className="p-3 text-[10.5px] font-bold text-teal-700">القيمة</th>
                <th className="p-3 text-[10.5px] font-bold text-teal-700"></th>
              </tr>
            </thead>
            <tbody>
              {visible.map((item) => {
                const ratio = Math.min(100, Math.round((item.stock / Math.max(item.maximum, 1)) * 100));
                const minRatio = Math.min(100, Math.round((item.minimum / Math.max(item.maximum, 1)) * 100));
                const low = item.stock <= item.minimum;
                return (
                  <tr key={item.id} className="border-b border-slate-50 transition hover:bg-teal-50/30">
                    <td className="p-3 align-top">
                      <div className="flex items-start gap-2.5">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white" style={{ background: "linear-gradient(135deg, #14b8a6, #0f766e)" }}><Boxes size={15} /></span>
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-black text-slate-900">{item.name}</p>
                          <p className="mt-0.5 text-[10.5px] font-bold text-teal-700">{item.sku}</p>
                          {item.location && <p className="mt-0.5 text-[10px] font-medium text-slate-400">{item.location}{item.batchNumber ? ` · دفعة ${item.batchNumber}` : ""}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 align-top">
                      <p className="text-[11.5px] font-bold text-slate-600">{item.category}</p>
                      <p className="mt-0.5 text-[10.5px] font-medium text-slate-400">{item.warehouse}</p>
                    </td>
                    <td className="p-3 align-top text-[11.5px] font-bold text-sky-700">{item.customerName}</td>
                    <td className="p-3 align-top">
                      <div className="relative h-2 w-[130px] rounded-full bg-slate-100">
                        <div className="absolute inset-y-0 right-0 rounded-full" style={{ width: `${ratio}%`, background: low ? "#f59e0b" : "linear-gradient(90deg, #5eead4, #0f766e)" }} />
                        <span className="absolute top-1/2 h-3 w-0.5 -translate-y-1/2 rounded-full bg-rose-400" style={{ right: `${minRatio}%` }} />
                      </div>
                      <p className={"mt-1 text-[10.5px] font-bold " + (low ? "text-amber-600" : "text-slate-400")}>{item.stock} / {item.maximum}{low ? " · يحتاج توريد" : ""}</p>
                    </td>
                    <td className="p-3 align-top text-[12.5px] font-black text-slate-900">{formatCurrency(item.unitValue)}</td>
                    <td className="p-3 align-top">
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => restock(item.id)} className="rounded-lg p-1.5 text-teal-600 transition hover:bg-teal-50" title="توريد"><Plus size={13} /></button>
                        <button type="button" onClick={() => openEdit(item)} className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100" title="تعديل"><SlidersHorizontal size={13} /></button>
                        <button type="button" onClick={() => { if (window.confirm("حذف هذا الصنف؟")) deleteItem(item.id); }} className="rounded-lg p-1.5 text-rose-500 transition hover:bg-rose-50" title="حذف"><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Surface>
      </>
      )}
      {formOpen && <div className="workspace-modal"><div className="workspace-modal-card"><div className="flex items-center justify-between"><div><p className="text-[11.5px] font-medium text-lime-700">المخزون</p><h3 className="mt-1 text-[18.5px] font-bold text-slate-900">{editingId ? "تعديل الصنف" : "إضافة صنف جديد"}</h3></div><button type="button" onClick={() => setFormOpen(false)} className="modal-close"><X size={16} /></button></div>
        {saveError && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-[12.5px] font-bold text-red-600">{saveError}</div>}
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className="block"><span className="mb-1.5 block text-[11.5px] font-bold text-slate-500">اسم الصنف</span><input className="workspace-input" placeholder="مثال: أثاث مكتبي مستورد" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })}/></label>
          <label className="block"><span className="mb-1.5 block text-[11.5px] font-bold text-slate-500">SKU</span><input className="workspace-input" placeholder="مثال: FUR-2026-001" value={draft.sku} onChange={(e) => setDraft({ ...draft, sku: e.target.value })} /></label>
          <label className="block sm:col-span-2"><span className="mb-1.5 block text-[11.5px] font-bold text-slate-500">العميل (صاحب البضاعة)</span><select className="workspace-input" value={draft.customerId || ""} onChange={(e) => { const id = Number(e.target.value); const found = customers.find((c) => c.id === id); setDraft({ ...draft, customerId: id, customerName: found?.name ?? "" }); }}><option value="">اختر العميل...</option>{customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
          <label className="block"><span className="mb-1.5 block text-[11.5px] font-bold text-slate-500">التصنيف</span><input className="workspace-input" placeholder="مثال: أثاث، أجهزة، مواد غذائية" value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} /></label>
          <label className="block"><span className="mb-1.5 block text-[11.5px] font-bold text-slate-500">المستودع</span><div className="flex gap-2"><select className="workspace-input" value={draft.warehouse} onChange={(e) => setDraft({ ...draft, warehouse: e.target.value })}>{warehouses.filter((w) => w.is_active).map((w) => <option key={w.id} value={w.name}>{w.name}</option>)}{!warehouses.some((w) => w.name === draft.warehouse) && draft.warehouse && <option value={draft.warehouse}>{draft.warehouse}</option>}</select><button type="button" onClick={addWarehouse} className="record-action">+ مستودع</button></div></label>
          <label className="block"><span className="mb-1.5 block text-[11.5px] font-bold text-slate-500">موقع التخزين (اختياري)</span><input className="workspace-input" placeholder="مثال: ممر A - رف 12" value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} /></label>
          <label className="block"><span className="mb-1.5 block text-[11.5px] font-bold text-slate-500">رقم الدفعة (اختياري)</span><input className="workspace-input" placeholder="مثال: BATCH-0728" value={draft.batchNumber} onChange={(e) => setDraft({ ...draft, batchNumber: e.target.value })} /></label>
          <label className="block"><span className="mb-1.5 block text-[11.5px] font-bold text-slate-500">الكمية المتوفرة</span><input className="workspace-input" type="number" placeholder="0" value={draft.stock} onChange={(e) => setDraft({ ...draft, stock: Number(e.target.value) })} /></label>
          <label className="block"><span className="mb-1.5 block text-[11.5px] font-bold text-slate-500">الحد الأدنى (تنبيه التوريد)</span><input className="workspace-input" type="number" placeholder="5" value={draft.minimum} onChange={(e) => setDraft({ ...draft, minimum: Number(e.target.value) })} /></label>
          <label className="block"><span className="mb-1.5 block text-[11.5px] font-bold text-slate-500">الحد الأقصى للتخزين</span><input className="workspace-input" type="number" placeholder="50" value={draft.maximum} onChange={(e) => setDraft({ ...draft, maximum: Number(e.target.value) })} /></label>
          <label className="block"><span className="mb-1.5 block text-[11.5px] font-bold text-slate-500">القيمة التقديرية للوحدة (ر.س)</span><input className="workspace-input" type="number" placeholder="0" value={draft.unitValue} onChange={(e) => setDraft({ ...draft, unitValue: Number(e.target.value) })} /></label>
        </div>
        <button type="button" disabled={isSavingItem} onClick={saveItem} className="workspace-primary-button mt-5 w-full disabled:opacity-50">{isSavingItem ? "جاري الحفظ..." : editingId ? "حفظ التعديلات" : "إضافة الصنف"}</button>
      </div></div>}
    </>
  );
}
type ReportsData = {
  financial: {
    kpis: {
      total_invoiced: number;
      total_collected: number;
      total_expenses: number;
      total_outstanding: number;
      net_this_month: number;
      collected_growth_percent: number;
    };
    monthly_trend: { month: string; label: string; invoiced: number; collected: number; expenses: number; net: number }[];
    top_expense_categories: { category: string; amount: number }[];
    insights: string[];
  };
  customers: {
    kpis: { total_customers: number; new_this_month: number; inactive_customers: number; new_customers_growth_percent: number };
    monthly_growth: { month: string; label: string; new_customers: number }[];
    by_type: { type: string; count: number }[];
    top_customers: { customer_name: string; total_revenue: number; invoice_count: number }[];
    insights: string[];
  };
  inventory: {
    kpis: { total_value: number; total_items: number; low_stock_count: number; out_of_stock_count: number };
    by_category: { category: string; quantity: number; value: number }[];
    by_warehouse: { warehouse: string; quantity: number; value: number }[];
    top_movement: { name: string; sku: string; movement: number }[];
    insights: string[];
  };
  operational: {
    kpis: { total_orders: number; completed_orders: number; completion_rate_percent: number; orders_growth_percent: number };
    orders_by_status: { status: string; count: number }[];
    orders_by_priority: { priority: string; count: number }[];
    orders_trend: { month: string; label: string; orders: number; amount: number }[];
    insights: string[];
  };
  generated_at: string;
};
type ReportTabKey = "financial" | "customers" | "inventory" | "operational" | "alerts" | "delivery";
function ReportsWorkspace() {
  const [data, setData] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ReportTabKey>("financial");
  const [reportOpen, setReportOpen] = useState(false);
  const [insights, setInsights] = useState<InsightsData | null>(null);
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/backend/reports/", { headers: { Accept: "application/json" }, cache: "no-store" });
      if (!res.ok) throw new Error("تعذر تحميل التقارير");
      const json = (await res.json()) as ReportsData;
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
    try {
      const insightsRes = await fetch("/backend/insights/", { headers: { Accept: "application/json" }, cache: "no-store" });
      if (insightsRes.ok) {
        const insightsJson = (await insightsRes.json()) as InsightsData;
        setInsights(insightsJson);
      }
    } catch {
      // تنبيهات إضافية اختيارية
    }
  }, []);
  useEffect(() => {
    void load();
  }, [load]);

  const tabs: { key: ReportTabKey; label: string; icon: typeof CircleDollarSign; color: string; description: string }[] = [
    { key: "financial", label: "مالي", icon: CircleDollarSign, color: "#059669", description: "الفواتير والتحصيل والمصروفات" },
    { key: "customers", label: "عملاء", icon: Users, color: "#0284c7", description: "نشاط العملاء وأفضلهم تعاملاً" },
    { key: "inventory", label: "مخزون", icon: Warehouse, color: "#65a30d", description: "قيمة المخزون وحركته بالمستودعات" },
    { key: "operational", label: "تشغيلي", icon: ShoppingCart, color: "#4f46e5", description: "الطلبات وحالاتها وأولوياتها" },
    { key: "alerts", label: "تنبيهات", icon: AlertTriangle, color: "#dc2626", description: "فواتير متأخرة ومخزون منخفض وعملاء غير نشطين" },
    { key: "delivery", label: "التسليم", icon: Truck, color: "#0891b2", description: "معدل التسليم وسرعة التنفيذ هذا الشهر" },
  ];

  if (loading && !data) {
    return (
      <>
        <WorkspaceHeader eyebrow="ERTIKAZ EXECUTIVE REPORT LIBRARY" title="مكتبة التقارير التنفيذية" description="تقارير حية محسوبة من بيانات النظام الفعلية." icon={BarChart3} accent={{ bar: "#fdf9f6", border: "#f0d6c4", stripe: "#c2653f", icon: "#c2653f" }} />
        <Surface className="flex h-40 items-center justify-center gap-2 text-[13.5px] font-bold text-slate-400">
          <Loader2 size={16} className="animate-spin" />
          جاري إعداد التقارير...
        </Surface>
      </>
    );
  }
  if (error || !data) {
    return (
      <>
        <WorkspaceHeader eyebrow="ERTIKAZ EXECUTIVE REPORT LIBRARY" title="مكتبة التقارير التنفيذية" description="تقارير حية محسوبة من بيانات النظام الفعلية." icon={BarChart3} accent={{ bar: "#fdf9f6", border: "#f0d6c4", stripe: "#c2653f", icon: "#c2653f" }} />
        <Surface className="flex flex-col items-center gap-3 p-8 text-center">
          <AlertTriangle size={22} className="text-amber-500" />
          <p className="text-[13.5px] font-bold text-slate-600">{error || "تعذر تحميل البيانات"}</p>
          <button type="button" onClick={() => void load()} className="inline-flex h-9 items-center gap-2 rounded-xl bg-slate-900 px-4 text-[12.5px] font-bold text-white">
            <RefreshCw size={13} /> إعادة المحاولة
          </button>
        </Surface>
      </>
    );
  }

  const section = data[activeTab as keyof ReportsData];
  const downloadUrl = `/backend/reports/export?type=${activeTab}`;

  return (
    <>
      <WorkspaceHeader
        eyebrow="ERTIKAZ EXECUTIVE REPORT LIBRARY"
        title="مكتبة التقارير التنفيذية"
        description="تقارير حية محسوبة لحظيًا من بيانات النظام الفعلية — مالي، عملاء، مخزون، وتشغيلي."
        icon={BarChart3}
        accent={{ bar: "#fdf9f6", border: "#f0d6c4", stripe: "#c2653f", icon: "#c2653f" }}
        action={
          <a href={downloadUrl} download className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-900 px-4 text-[12.5px] font-bold text-white">
            <Download size={14} /> تحميل CSV
          </a>
        }
      />
      {!reportOpen && (
        <section className="mb-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {tabs.map((tab, index) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => { setActiveTab(tab.key); setReportOpen(true); }}
                className="group relative flex flex-col items-start gap-3 rounded-2xl border p-5 text-right transition hover:-translate-y-1 hover:shadow-lg"
                style={{ background: `${tab.color}1f`, borderColor: `${tab.color}4d` }}
              >
                <span className="absolute -top-2 right-6 h-4 w-10 rounded-t-lg" style={{ background: tab.color }} />
                <div className="flex w-full items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl text-white" style={{ background: tab.color }}>
                    <TabIcon size={20} />
                  </span>
                  <span className="text-[22px] font-black" style={{ color: tab.color }}>{String(index + 1).padStart(2, "0")}</span>
                </div>
                <div>
                  <p className="text-[15px] font-bold text-slate-900">تقرير {tab.label}</p>
                  <p className="mt-1 text-[11px] font-medium text-slate-500">{tab.description}</p>
                </div>
                <span className="mt-2 inline-flex items-center gap-1 text-[10.5px] font-bold" style={{ color: tab.color }}>فتح التقرير <ArrowLeft size={12} /></span>
              </button>
            );
          })}
        </section>
      )}
      {reportOpen && (
        <button
          type="button"
          onClick={() => setReportOpen(false)}
          className="mb-4 inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-[11.5px] font-bold text-slate-600 hover:bg-slate-200"
        >
          <ArrowRight size={13} /> كل التقارير
        </button>
      )}{reportOpen && activeTab === "financial" && (
        <>
          <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MiniStat label="إجمالي الفواتير" value={formatCurrency(data.financial.kpis.total_invoiced)} icon={ReceiptText} tone="bg-sky-50 text-sky-700" note="كل الفواتير الصادرة" />
            <MiniStat label="المحصل" value={formatCurrency(data.financial.kpis.total_collected)} icon={CircleDollarSign} tone="bg-emerald-50 text-emerald-700" note={`${data.financial.kpis.collected_growth_percent >= 0 ? "+" : ""}${data.financial.kpis.collected_growth_percent}% عن الشهر الماضي`} />
            <MiniStat label="المصروفات" value={formatCurrency(data.financial.kpis.total_expenses)} icon={WalletCards} tone="bg-amber-50 text-amber-700" note="إجمالي المصروفات المعتمدة" />
            <MiniStat label="مستحقات مفتوحة" value={formatCurrency(data.financial.kpis.total_outstanding)} icon={AlertTriangle} tone="bg-rose-50 text-rose-700" note="تحتاج متابعة تحصيل" />
          </section>
          <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
            <Surface className="p-5">
              <h3 className="text-[15.5px] font-bold text-slate-900">الاتجاه الشهري — آخر 6 أشهر</h3>
              <div className="mt-4">
                <svg viewBox={`0 0 ${data.financial.monthly_trend.length * 90} 190`} className="w-full" preserveAspectRatio="xMidYMid meet">
                  {(() => {
                    const trend = data.financial.monthly_trend;
                    const max = Math.max(...trend.flatMap((r) => [r.invoiced, r.collected, r.expenses]), 1);
                    const scale = (v: number) => (v / max) * 130;
                    return trend.map((row, i) => {
                      const groupX = i * 90 + 10;
                      const bw = 16;
                      const gap = 6;
                      return (
                        <g key={row.month}>
                          <rect x={groupX} y={150 - scale(row.invoiced)} width={bw} height={scale(row.invoiced)} rx={4} fill="#0284c7" />
                          <rect x={groupX + bw + gap} y={150 - scale(row.collected)} width={bw} height={scale(row.collected)} rx={4} fill="#059669" />
                          <rect x={groupX + (bw + gap) * 2} y={150 - scale(row.expenses)} width={bw} height={scale(row.expenses)} rx={4} fill="#d97706" />
                          <text x={groupX + bw + gap} y={168} textAnchor="middle" fontSize="9" fontWeight="700" fill="#64748b">{row.label}</text>
                        </g>
                      );
                    });
                  })()}
                </svg>
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-[10.5px] font-bold text-slate-400">
                <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#0284c7]" /> فواتير</span>
                <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#059669]" /> تحصيل</span>
                <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#d97706]" /> مصروفات</span>
              </div>
            </Surface>
            <div className="space-y-5">
              <Surface className="overflow-hidden">
                <div className="border-b border-slate-100 px-5 py-4"><h3 className="text-[15.5px] font-bold text-slate-900">أكبر بنود المصاريف</h3></div>
                <div className="divide-y divide-slate-100">
                  {data.financial.top_expense_categories.length === 0 ? (
                    <p className="p-5 text-[12.5px] font-medium text-slate-400">لا توجد مصاريف مسجلة بعد.</p>
                  ) : (
                    data.financial.top_expense_categories.map((item) => (
                      <div key={item.category} className="flex items-center justify-between gap-3 p-4">
                        <p className="text-[12.5px] font-bold text-slate-700">{item.category}</p>
                        <span className="text-[13.5px] font-bold text-amber-700">{formatCurrency(item.amount)}</span>
                      </div>
                    ))
                  )}
                </div>
              </Surface>
              <div className="rounded-[26px] bg-slate-900 p-5 text-white shadow-lg">
                <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10"><Sparkles size={18} /></span><p className="text-[11.5px] font-bold text-white/55">ملاحظات ذكية</p></div>
                <ul className="mt-4 space-y-2">{data.financial.insights.map((item, i) => <li key={i} className="text-[12.5px] font-semibold leading-5 text-white/90">• {item}</li>)}</ul>
              </div>
            </div>
          </section>
        </>
      )}

      {reportOpen && activeTab === "customers" && (
        <>
          <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MiniStat label="إجمالي العملاء" value={String(data.customers.kpis.total_customers)} icon={Users} tone="bg-sky-50 text-sky-700" note="عملاء نشطون" />
            <MiniStat label="عملاء جدد هذا الشهر" value={String(data.customers.kpis.new_this_month)} icon={CheckCircle2} tone="bg-emerald-50 text-emerald-700" note={`${data.customers.kpis.new_customers_growth_percent >= 0 ? "+" : ""}${data.customers.kpis.new_customers_growth_percent}% عن الشهر الماضي`} />
            <MiniStat label="بحاجة متابعة" value={String(data.customers.kpis.inactive_customers)} icon={Clock3} tone="bg-rose-50 text-rose-700" note="بدون نشاط لفترة طويلة" />
            <MiniStat label="تصنيفات العملاء" value={String(data.customers.by_type.length)} icon={ClipboardList} tone="bg-[#e6f1f8] text-[#2d75a3]" note="أفراد وشركات" />
          </section>
          <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
            <Surface className="overflow-hidden">
              <div className="border-b border-slate-100 px-5 py-4"><h3 className="text-[15.5px] font-bold text-slate-900">أفضل العملاء حسب الفوترة</h3></div>
              <div className="divide-y divide-slate-100">
                {data.customers.top_customers.length === 0 ? (
                  <p className="p-5 text-[12.5px] font-medium text-slate-400">لا توجد بيانات فوترة كافية بعد.</p>
                ) : (
                  data.customers.top_customers.map((item, index) => (
                    <div key={item.customer_name} className="flex items-center justify-between gap-3 p-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[12.5px] font-bold text-white">{index + 1}</span>
                        <div className="min-w-0"><p className="truncate text-[13.5px] font-bold text-slate-800">{item.customer_name}</p><p className="mt-1 text-[11.5px] font-medium text-slate-400">{item.invoice_count} فاتورة</p></div>
                      </div>
                      <span className="shrink-0 text-[14.5px] font-bold text-emerald-700">{formatCurrency(item.total_revenue)}</span>
                    </div>
                  ))
                )}
              </div>
            </Surface>
            <div className="space-y-5">
              <Surface className="p-5">
                <h3 className="text-[15.5px] font-bold text-slate-900">توزيع العملاء</h3>
                <div className="mt-4 space-y-3">
                  {data.customers.by_type.map((item) => {
                    const max = Math.max(...data.customers.by_type.map((x) => x.count), 1);
                    return (
                      <div key={item.type}>
                        <div className="mb-1 flex items-center justify-between text-[11.5px] font-bold text-slate-500"><span>{item.type}</span><span>{item.count}</span></div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-slate-700" style={{ width: `${Math.round((item.count / max) * 100)}%` }} /></div>
                      </div>
                    );
                  })}
                </div>
              </Surface>
              <div className="rounded-[26px] bg-slate-900 p-5 text-white shadow-lg">
                <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10"><Sparkles size={18} /></span><p className="text-[11.5px] font-bold text-white/55">ملاحظات ذكية</p></div>
                <ul className="mt-4 space-y-2">{data.customers.insights.map((item, i) => <li key={i} className="text-[12.5px] font-semibold leading-5 text-white/90">• {item}</li>)}</ul>
              </div>
            </div>
          </section>
        </>
      )}

      {reportOpen && activeTab === "inventory" && (
        <>
          <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MiniStat label="قيمة المخزون" value={formatCurrency(data.inventory.kpis.total_value)} icon={CircleDollarSign} tone="bg-sky-50 text-sky-700" note="القيمة الحالية" />
            <MiniStat label="إجمالي الأصناف" value={String(data.inventory.kpis.total_items)} icon={Boxes} tone="bg-blue-50 text-blue-700" note="كل المستودعات" />
            <MiniStat label="تحتاج توريد" value={String(data.inventory.kpis.low_stock_count)} icon={ShieldAlert} tone="bg-amber-50 text-amber-700" note="أقل من الحد الأدنى" />
            <MiniStat label="نافد المخزون" value={String(data.inventory.kpis.out_of_stock_count)} icon={AlertTriangle} tone="bg-rose-50 text-rose-700" note="بحاجة توريد فوري" />
          </section>
          <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
            <Surface className="p-5">
              <h3 className="text-[15.5px] font-bold text-slate-900">القيمة حسب التصنيف</h3>
              <div className="mt-4 space-y-3">
                {data.inventory.by_category.map((item) => {
                  const max = Math.max(...data.inventory.by_category.map((x) => x.value), 1);
                  return (
                    <div key={item.category}>
                      <div className="mb-1 flex items-center justify-between text-[11.5px] font-bold text-slate-500"><span>{item.category}</span><span>{formatCurrency(item.value)}</span></div>
                      <div className="h-2 overflow-hidden rounded-full bg-lime-50"><div className="h-full rounded-full bg-lime-500" style={{ width: `${Math.round((item.value / max) * 100)}%` }} /></div>
                    </div>
                  );
                })}
              </div>
              <h3 className="mt-6 text-[15.5px] font-bold text-slate-900">الأكثر حركة</h3>
              <div className="mt-3 divide-y divide-slate-100">
                {data.inventory.top_movement.map((item) => (
                  <div key={item.sku} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0"><p className="truncate text-[12.5px] font-bold text-slate-700">{item.name}</p><p className="text-[10.5px] font-medium text-slate-400">{item.sku}</p></div>
                    <span className="text-[12.5px] font-bold text-slate-600">{item.movement}</span>
                  </div>
                ))}
              </div>
            </Surface>
            <div className="space-y-5">
              <Surface className="overflow-hidden">
                <div className="border-b border-slate-100 px-5 py-4"><h3 className="text-[15.5px] font-bold text-slate-900">حسب المستودع</h3></div>
                <div className="divide-y divide-slate-100">
                  {data.inventory.by_warehouse.map((item) => (
                    <div key={item.warehouse} className="flex items-center justify-between gap-3 p-4">
                      <p className="text-[12.5px] font-bold text-slate-700">{item.warehouse}</p>
                      <span className="text-[13.5px] font-bold text-slate-600">{formatCurrency(item.value)}</span>
                    </div>
                  ))}
                </div>
              </Surface>
              <div className="rounded-[26px] bg-slate-900 p-5 text-white shadow-lg">
                <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10"><Sparkles size={18} /></span><p className="text-[11.5px] font-bold text-white/55">ملاحظات ذكية</p></div>
                <ul className="mt-4 space-y-2">{data.inventory.insights.map((item, i) => <li key={i} className="text-[12.5px] font-semibold leading-5 text-white/90">• {item}</li>)}</ul>
              </div>
            </div>
          </section>
        </>
      )}

      {reportOpen && activeTab === "operational" && (
        <>
          <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MiniStat label="إجمالي الطلبات" value={String(data.operational.kpis.total_orders)} icon={ClipboardList} tone="bg-sky-50 text-sky-700" note="كل الطلبات النشطة" />
            <MiniStat label="طلبات مكتملة" value={String(data.operational.kpis.completed_orders)} icon={CheckCircle2} tone="bg-emerald-50 text-emerald-700" note={`معدل إنجاز ${data.operational.kpis.completion_rate_percent}%`} />
            <MiniStat label="نمو الطلبات" value={`${data.operational.kpis.orders_growth_percent >= 0 ? "+" : ""}${data.operational.kpis.orders_growth_percent}%`} icon={data.operational.kpis.orders_growth_percent >= 0 ? TrendingUp : TrendingDown} tone={data.operational.kpis.orders_growth_percent >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"} note="عن الشهر الماضي" />
            <MiniStat label="حالات متعددة" value={String(data.operational.orders_by_status.length)} icon={Truck} tone="bg-[#e6f1f8] text-[#2d75a3]" note="توزيع حالات الطلبات" />
          </section>
          <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
            <Surface className="p-5">
              <h3 className="text-[15.5px] font-bold text-slate-900">الطلبات — آخر 6 أشهر</h3>
              <div className="mt-4 space-y-3">
                {data.operational.orders_trend.map((row) => {
                  const max = Math.max(...data.operational.orders_trend.map((x) => x.orders), 1);
                  return (
                    <div key={row.month}>
                      <div className="mb-1 flex items-center justify-between text-[11.5px] font-bold text-slate-500"><span>{row.label}</span><span>{row.orders} طلب · {formatCurrency(row.amount)}</span></div>
                      <div className="h-2 overflow-hidden rounded-full bg-indigo-50"><div className="h-full rounded-full bg-indigo-500" style={{ width: `${Math.round((row.orders / max) * 100)}%` }} /></div>
                    </div>
                  );
                })}
              </div>
              <h3 className="mt-6 text-[15.5px] font-bold text-slate-900">حسب الحالة</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {data.operational.orders_by_status.map((item) => (
                  <span key={item.status} className="rounded-xl bg-slate-100 px-3 py-2 text-[11.5px] font-bold text-slate-600">{item.status} · {item.count}</span>
                ))}
              </div>
            </Surface>
            <div className="space-y-5">
              <Surface className="overflow-hidden">
                <div className="border-b border-slate-100 px-5 py-4"><h3 className="text-[15.5px] font-bold text-slate-900">حسب الأولوية</h3></div>
                <div className="divide-y divide-slate-100">
                  {data.operational.orders_by_priority.map((item) => (
                    <div key={item.priority} className="flex items-center justify-between gap-3 p-4">
                      <p className="text-[12.5px] font-bold text-slate-700">{item.priority}</p>
                      <span className="text-[13.5px] font-bold text-slate-600">{item.count}</span>
                    </div>
                  ))}
                </div>
              </Surface>
              <div className="rounded-[26px] bg-slate-900 p-5 text-white shadow-lg">
                <div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10"><Sparkles size={18} /></span><p className="text-[11.5px] font-bold text-white/55">ملاحظات ذكية</p></div>
                <ul className="mt-4 space-y-2">{data.operational.insights.map((item, i) => <li key={i} className="text-[12.5px] font-semibold leading-5 text-white/90">• {item}</li>)}</ul>
              </div>
            </div>
          </section>
        </>
      )}
      {reportOpen && activeTab === "alerts" && (
        <>
          {!insights ? (
            <Surface className="flex h-40 items-center justify-center gap-2 text-[13.5px] font-bold text-slate-400">
              <Loader2 size={16} className="animate-spin" />
              جاري تحميل التنبيهات...
            </Surface>
          ) : (
            <>
              <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <MiniStat label="عدد الفواتير المتأخرة" value={String(insights.overdue_invoices.length)} icon={AlertTriangle} tone="bg-rose-50 text-rose-700" note="بحاجة متابعة تحصيل" />
                <MiniStat label="إجمالي المبلغ المفتوح" value={formatCurrency(insights.total_open_amount)} icon={CircleDollarSign} tone="bg-amber-50 text-amber-700" note="بحاجة متابعة تحصيل" />
                <MiniStat label="أصناف منخفضة المخزون" value={String(insights.low_stock.length)} icon={ShieldAlert} tone="bg-orange-50 text-orange-700" note="بحاجة توريد" />
                <MiniStat label="عملاء غير نشطين" value={String(insights.inactive_customers.length)} icon={Clock3} tone="bg-slate-100 text-slate-600" note="بدون نشاط لفترة طويلة" />
              </section>
              <section className="grid gap-5 xl:grid-cols-2">
                <Surface className="overflow-hidden">
                  <div className="border-b border-slate-100 px-5 py-4"><h3 className="text-[15.5px] font-bold text-slate-900">فواتير متأخرة</h3></div>
                  <div className="divide-y divide-slate-100">
                    {insights.overdue_invoices.length === 0 ? (
                      <p className="p-5 text-[12.5px] font-medium text-slate-400">لا توجد فواتير متأخرة، ممتاز.</p>
                    ) : (
                      insights.overdue_invoices.map((item) => (
                        <div key={item.invoice_number} className="flex items-center justify-between gap-3 p-4">
                          <div className="min-w-0">
                            <p className="truncate text-[12.5px] font-bold text-slate-700">{item.customer_name}</p>
                            <p className="text-[10.5px] font-medium text-slate-400">{item.invoice_number} · {item.days_since_issued} يوم</p>
                          </div>
                          <span className="shrink-0 text-[13.5px] font-bold text-rose-700">{formatCurrency(item.open_amount)}</span>
                        </div>
                      ))
                    )}
                  </div>
                </Surface>
                <div className="space-y-5">
                  <Surface className="overflow-hidden">
                    <div className="border-b border-slate-100 px-5 py-4"><h3 className="text-[15.5px] font-bold text-slate-900">مخزون بحاجة توريد</h3></div>
                    <div className="divide-y divide-slate-100">
                      {insights.low_stock.length === 0 ? (
                        <p className="p-5 text-[12.5px] font-medium text-slate-400">لا توجد أصناف منخفضة حالياً.</p>
                      ) : (
                        insights.low_stock.map((item) => (
                          <div key={item.sku} className="flex items-center justify-between gap-3 p-4">
                            <div className="min-w-0"><p className="truncate text-[12.5px] font-bold text-slate-700">{item.name}</p><p className="text-[10.5px] font-medium text-slate-400">{item.sku}</p></div>
                            <span className="shrink-0 text-[11.5px] font-bold text-orange-700">{item.quantity} / {item.minimum}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </Surface>
                  <Surface className="overflow-hidden">
                    <div className="border-b border-slate-100 px-5 py-4"><h3 className="text-[15.5px] font-bold text-slate-900">عملاء بحاجة متابعة</h3></div>
                    <div className="divide-y divide-slate-100">
                      {insights.inactive_customers.length === 0 ? (
                        <p className="p-5 text-[12.5px] font-medium text-slate-400">كل العملاء نشطون حالياً.</p>
                      ) : (
                        insights.inactive_customers.map((item) => (
                          <div key={item.customer_name} className="flex items-center justify-between gap-3 p-4">
                            <p className="text-[12.5px] font-bold text-slate-700">{item.customer_name}</p>
                            <span className="shrink-0 text-[11.5px] font-bold text-slate-500">{item.days_since_last_activity != null ? `${item.days_since_last_activity} يوم` : "لا يوجد نشاط مسجل"}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </Surface>
                </div>
              </section>
            </>
          )}
        </>
      )}
      {reportOpen && activeTab === "delivery" && (
        <>
          {!insights ? (
            <Surface className="flex h-40 items-center justify-center gap-2 text-[13.5px] font-bold text-slate-400">
              <Loader2 size={16} className="animate-spin" />
              جاري تحميل التنبيهات...
            </Surface>
          ) : (
            <>
              <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <MiniStat label="طلبات التسليم هذا الشهر" value={String(insights.delivery.total_this_month)} icon={Truck} tone="bg-sky-50 text-sky-700" note="مقابل الشهر الماضي" />
                <MiniStat label="تم تسليمها" value={String(insights.delivery.delivered_this_month)} icon={CheckCircle2} tone="bg-emerald-50 text-emerald-700" note="معدل الإنجاز" />
                <MiniStat label="معدل التسليم" value={`${insights.delivery.delivery_rate_percent}%`} icon={TrendingUp} tone="bg-cyan-50 text-cyan-700" note={`الشهر الماضي: ${insights.delivery.delivery_rate_last_month}%`} />
                <MiniStat label="متوسط أيام التسليم" value={insights.delivery.avg_delivery_days != null ? `${insights.delivery.avg_delivery_days} يوم` : "-"} icon={Clock3} tone="bg-indigo-50 text-indigo-700" note="معدل الإنجاز" />
              </section>
              <Surface className="p-5">
                <h3 className="text-[15.5px] font-bold text-slate-900">معدل الإنجاز</h3>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-[11.5px] font-bold text-slate-500"><span>معدل التسليم</span><span>{insights.delivery.delivery_rate_percent}%</span></div>
                  <div className="h-3 overflow-hidden rounded-full bg-cyan-50"><div className="h-full rounded-full bg-cyan-600" style={{ width: `${Math.min(100, insights.delivery.delivery_rate_percent)}%` }} /></div>
                </div>
              </Surface>
            </>
          )}
        </>
      )}

    </>
  );
}
type InsightsData = {
  overdue_invoices: {
    customer_name: string;
    invoice_number: string;
    open_amount: number;
    days_since_issued: number;
  }[];
  total_open_amount: number;
  low_stock: {
    name: string;
    sku: string;
    quantity: number;
    minimum: number;
    suggested_reorder: number;
  }[];
  delayed_shipments: {
    shipment_id: number;
    customer_name: string;
    customer_id: number;
    status: string;
    service_type: string;
    days_late: number;
  }[];
  delayed_shipments_count: number;
  repeat_delay_customers: { customer_name: string; delayed_count: number }[];
  top_customers: { customer_name: string; total_revenue: number; invoice_count: number }[];
  inactive_customers: { customer_name: string; days_since_last_activity: number | null }[];
  delivery: {
    total_this_month: number;
    delivered_this_month: number;
    delivery_rate_percent: number;
    avg_delivery_days: number | null;
    delivery_rate_last_month: number;
  };
  financial: {
    collected_this_month: number;
    collected_last_month: number;
    expenses_this_month: number;
    expenses_last_month: number;
    net_this_month: number;
  };
  generated_at: string;
};

function AIWorkspace({ language: _language }: { language: Language }) {
  const [data, setData] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/backend/insights/", {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      if (!res.ok) throw new Error("تعذر تحميل الاستخبارات التشغيلية");
      const json = (await res.json()) as InsightsData;
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading && !data) {
    return (
      <>
        <WorkspaceHeader eyebrow="ERTIKAZ OPERATIONAL INTELLIGENCE" title="الذكاء التشغيلي" description="تحليل حي لبيانات النظام الفعلية." icon={BrainCircuit} />
        <Surface className="flex h-40 items-center justify-center gap-2 text-[13.5px] font-bold text-slate-400">
          <Loader2 size={16} className="animate-spin" />
          جاري تحليل البيانات...
        </Surface>
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <WorkspaceHeader eyebrow="ERTIKAZ OPERATIONAL INTELLIGENCE" title="الذكاء التشغيلي" description="تحليل حي لبيانات النظام الفعلية." icon={BrainCircuit} />
        <Surface className="flex flex-col items-center gap-3 p-8 text-center">
          <AlertTriangle size={22} className="text-amber-500" />
          <p className="text-[13.5px] font-bold text-slate-600">{error || "تعذر تحميل البيانات"}</p>
          <button type="button" onClick={() => void load()} className="inline-flex h-9 items-center gap-2 rounded-xl bg-slate-900 px-4 text-[12.5px] font-bold text-white">
            <RefreshCw size={13} /> إعادة المحاولة
          </button>
        </Surface>
      </>
    );
  }

  const deliveryTrend = data.delivery.delivery_rate_percent - data.delivery.delivery_rate_last_month;

  return (
    <>
      <WorkspaceHeader
        eyebrow="ERTIKAZ OPERATIONAL INTELLIGENCE"
        title="الذكاء التشغيلي"
        description="تحليل تلقائي حي لبيانات النظام الفعلية — أولويات ومؤشرات محسوبة لحظيًا."
        icon={BrainCircuit}
        action={
          <button type="button" onClick={() => void load()} className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-100 px-4 text-[12.5px] font-bold text-slate-600">
            <RefreshCw size={14} /> تحديث
          </button>
        }
      />

      <section className="mb-5 overflow-hidden rounded-2xl border border-slate-100 bg-white">
        <div className="grid divide-y divide-slate-100 sm:grid-cols-2 sm:divide-y-0 sm:divide-x sm:divide-x-reverse xl:grid-cols-4">
          {[
            { label: "الرصيد المفتوح", value: formatCurrency(data.total_open_amount), icon: CircleDollarSign, note: `${data.overdue_invoices.length} فاتورة تحتاج متابعة`, tint: "#c98a2e" },
            { label: "نسبة التسليم بالوقت", value: `${data.delivery.delivery_rate_percent}%`, icon: deliveryTrend >= 0 ? TrendingUp : TrendingDown, note: `${deliveryTrend >= 0 ? "+" : ""}${deliveryTrend.toFixed(1)}% عن الشهر الماضي`, tint: deliveryTrend >= 0 ? "#1f9d76" : "#c9433d" },
            { label: "صافي هذا الشهر", value: formatCurrency(data.financial.net_this_month), icon: WalletCards, note: `تحصيل ${formatCurrency(data.financial.collected_this_month)} · مصروفات ${formatCurrency(data.financial.expenses_this_month)}`, tint: "#2d75a3" },
            { label: "عملاء بحاجة متابعة", value: String(data.inactive_customers.length), icon: Users, note: "بدون نشاط لفترة طويلة", tint: "#c9536b" },
          ].map((stat, index) => {
            const StatIcon = stat.icon;
            return (
              <div key={index} className="p-5">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full" style={{ background: `${stat.tint}1a` }}><StatIcon size={13} color={stat.tint} /></span>
                  <span className="text-[11.5px] font-bold text-slate-400">{stat.label}</span>
                </div>
                <p className="mt-3 text-[22.5px] font-black text-slate-900">{stat.value}</p>
                <p className="mt-1 truncate text-[11px] font-medium text-slate-400">{stat.note}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <Surface className="overflow-hidden border-r-4 border-amber-300">
          <div className="border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-50 text-amber-700"><ReceiptText size={17} /></span>
              <div>
                <h3 className="text-[16.5px] font-bold text-slate-900">أولوية التحصيل</h3>
                <p className="mt-1 text-[11.5px] font-medium text-slate-400">أكبر الفواتير المفتوحة فعليًا، مرتبة حسب المبلغ.</p>
              </div>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {data.overdue_invoices.length === 0 ? (
              <p className="p-5 text-[12.5px] font-medium text-slate-400">لا توجد فواتير متأخرة حاليًا — التحصيل ممتاز.</p>
            ) : (
              data.overdue_invoices.map((item) => (
                <div key={item.invoice_number} className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="truncate text-[13.5px] font-bold text-slate-800">{item.customer_name}</p>
                    <p className="mt-1 text-[11.5px] font-medium text-slate-400">{item.invoice_number} · منذ {item.days_since_issued} يوم</p>
                  </div>
                  <span className="shrink-0 text-[14.5px] font-bold text-amber-700">{formatCurrency(item.open_amount)}</span>
                </div>
              ))
            )}
          </div>
        </Surface>

        <Surface className="overflow-hidden border-r-4 border-rose-300">
          <div className="border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-rose-700"><PackageX size={17} /></span>
              <div>
                <h3 className="text-[16.5px] font-bold text-slate-900">تنبيهات المخزون</h3>
                <p className="mt-1 text-[11.5px] font-medium text-slate-400">أصناف وصلت أو اقتربت من الحد الأدنى.</p>
              </div>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {data.low_stock.length === 0 ? (
              <p className="p-5 text-[12.5px] font-medium text-slate-400">كل الأصناف ضمن المستوى الآمن حاليًا.</p>
            ) : (
              data.low_stock.map((item) => (
                <div key={item.sku} className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="truncate text-[13.5px] font-bold text-slate-800">{item.name}</p>
                    <p className="mt-1 text-[11.5px] font-medium text-slate-400">المتاح {item.quantity} · الحد الأدنى {item.minimum}</p>
                  </div>
                  <span className="shrink-0 text-[12.5px] font-bold text-rose-700">اطلب {item.suggested_reorder}</span>
                </div>
              ))
            )}
          </div>
        </Surface>

        <Surface className="overflow-hidden border-r-4 border-red-300">
          <div className="border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-50 text-red-700"><Truck size={17} /></span>
              <div>
                <h3 className="text-[16.5px] font-bold text-slate-900">شحنات متأخرة</h3>
                <p className="mt-1 text-[11.5px] font-medium text-slate-400">{data.delayed_shipments_count} شحنة تجاوزت الموعد المتوقع.</p>
              </div>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {data.delayed_shipments.length === 0 ? (
              <p className="p-5 text-[12.5px] font-medium text-slate-400">لا توجد شحنات متأخرة حاليًا.</p>
            ) : (
              data.delayed_shipments.map((item) => (
                <div key={item.shipment_id} className="flex items-center justify-between gap-3 p-4">
                  <div className="min-w-0">
                    <p className="truncate text-[13.5px] font-bold text-slate-800">SHP-{item.shipment_id} · {item.customer_name}</p>
                    <p className="mt-1 text-[11.5px] font-medium text-slate-400">{item.service_type === "international" ? "دولي" : "محلي"}</p>
                  </div>
                  <span className="shrink-0 text-[12.5px] font-bold text-red-700">{item.days_late} يوم</span>
                </div>
              ))
            )}
            {data.repeat_delay_customers.length > 0 && (
              <div className="p-4">
                <p className="mb-2 text-[11.5px] font-bold text-slate-400">عملاء يتكرر تأخير شحناتهم</p>
                {data.repeat_delay_customers.map((c) => (
                  <div key={c.customer_name} className="flex items-center justify-between gap-3 py-1.5">
                    <span className="text-[12.5px] font-bold text-slate-700">{c.customer_name}</span>
                    <span className="text-[11.5px] font-bold text-red-600">{c.delayed_count} شحنات متأخرة</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Surface>

        <Surface className="overflow-hidden border-r-4 border-emerald-300">
          <div className="border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700"><Target size={17} /></span>
              <div>
                <h3 className="text-[16.5px] font-bold text-slate-900">أفضل العملاء</h3>
                <p className="mt-1 text-[11.5px] font-medium text-slate-400">الأعلى تعاملًا حسب إجمالي الفوترة الفعلي.</p>
              </div>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {data.top_customers.length === 0 ? (
              <p className="p-5 text-[12.5px] font-medium text-slate-400">لا توجد بيانات فوترة كافية بعد.</p>
            ) : (
              data.top_customers.map((item, index) => (
                <div key={item.customer_name} className="flex items-center justify-between gap-3 p-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900 text-[12.5px] font-bold text-white">{index + 1}</span>
                    <div className="min-w-0">
                      <p className="truncate text-[13.5px] font-bold text-slate-800">{item.customer_name}</p>
                      <p className="mt-1 text-[11.5px] font-medium text-slate-400">{item.invoice_count} فاتورة</p>
                    </div>
                  </div>
                  <span className="shrink-0 text-[14.5px] font-bold text-emerald-700">{formatCurrency(item.total_revenue)}</span>
                </div>
              ))
            )}
          </div>
        </Surface>

        <Surface className="overflow-hidden border-r-4 border-sky-300">
          <div className="border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-50 text-sky-700"><Clock3 size={17} /></span>
              <div>
                <h3 className="text-[16.5px] font-bold text-slate-900">عملاء بحاجة متابعة</h3>
                <p className="mt-1 text-[11.5px] font-medium text-slate-400">بدون فاتورة منذ 45 يومًا فأكثر.</p>
              </div>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {data.inactive_customers.length === 0 ? (
              <p className="p-5 text-[12.5px] font-medium text-slate-400">كل العملاء لديهم نشاط حديث.</p>
            ) : (
              data.inactive_customers.map((item) => (
                <div key={item.customer_name} className="flex items-center justify-between gap-3 p-4">
                  <p className="truncate text-[13.5px] font-bold text-slate-800">{item.customer_name}</p>
                  <span className="shrink-0 text-[12.5px] font-bold text-slate-500">
                    {item.days_since_last_activity === null ? "لا يوجد تعامل بعد" : `منذ ${item.days_since_last_activity} يوم`}
                  </span>
                </div>
              ))
            )}
          </div>
        </Surface>
      </section>

      <section className="mt-5">
        <Surface className="overflow-hidden border-r-4 border-[#2d75a3]/40">
          <div className="border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#e6f1f8] text-[#2d75a3]"><Truck size={17} /></span>
              <div>
                <h3 className="text-[16.5px] font-bold text-slate-900">أداء التسليم والمالية هذا الشهر</h3>
                <p className="mt-1 text-[11.5px] font-medium text-slate-400">مقارنة حية بالشهر الماضي.</p>
              </div>
            </div>
          </div>
          <div className="grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-[11.5px] font-bold text-slate-500">شحنات تم تسليمها</p>
              <p className="mt-2 text-[19.5px] font-black text-slate-900">{data.delivery.delivered_this_month}/{data.delivery.total_this_month}</p>
              <p className="mt-1 text-[11.5px] font-medium text-slate-400">متوسط مدة التسليم: {data.delivery.avg_delivery_days ?? "—"} يوم</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-[11.5px] font-bold text-slate-500">نسبة التسليم بالوقت</p>
              <p className="mt-2 text-[19.5px] font-black text-slate-900">{data.delivery.delivery_rate_percent}%</p>
              <p className="mt-1 text-[11.5px] font-medium text-slate-400">الشهر الماضي: {data.delivery.delivery_rate_last_month}%</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-[11.5px] font-bold text-slate-500">المحصّل هذا الشهر</p>
              <p className="mt-2 text-[19.5px] font-black text-slate-900">{formatCurrency(data.financial.collected_this_month)}</p>
              <p className="mt-1 text-[11.5px] font-medium text-slate-400">الشهر الماضي: {formatCurrency(data.financial.collected_last_month)}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-[11.5px] font-bold text-slate-500">المصروفات هذا الشهر</p>
              <p className="mt-2 text-[19.5px] font-black text-slate-900">{formatCurrency(data.financial.expenses_this_month)}</p>
              <p className="mt-1 text-[11.5px] font-medium text-slate-400">الشهر الماضي: {formatCurrency(data.financial.expenses_last_month)}</p>
            </div>
          </div>
        </Surface>
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/40 backdrop-blur-md p-4" onMouseDown={onClose}>
      <aside className="ertikaz-surface max-h-[88vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-white/40 bg-white/95 shadow-[0_30px_90px_rgba(15,23,42,.25)] backdrop-blur-2xl" onMouseDown={(event) => event.stopPropagation()}>
        <div className="sticky top-0 z-10 rounded-t-3xl border-b border-slate-100 bg-white/90 p-5 backdrop-blur-xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#236c83] text-white shadow-lg"><Icon size={19} /></span>
              <div>
                <p className="text-[11.5px] font-bold text-sky-600">تفاصيل السجل</p>
                <h3 className="mt-1 text-sm font-black text-slate-900">{title}</h3>
                <p className="mt-1 text-[12.5px] font-semibold text-slate-400">{subtitle}</p>
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
          <p className="text-[11.5px] font-bold text-slate-400">{item.label}</p>
          <p className="mt-1.5 text-[12.5px] font-black text-slate-800">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}

function AddBookingModal({
  customers,
  isSaving,
  errorMessage,
  onClose,
  onSave,
}: {
  customers: CustomerOption[];
  isSaving: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onSave: (payload: CreateBookingApiPayload) => void;
}) {
  const [customerId, setCustomerId] = useState<string>("");
  const [serviceType, setServiceType] = useState<"domestic" | "international">("domestic");
  const [shippingMode, setShippingMode] = useState<"sea" | "air">("sea");
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState("");
  const [packageCount, setPackageCount] = useState("1");
  const [totalWeight, setTotalWeight] = useState("");
  const [notes, setNotes] = useState("");

  const canSave =
    customerId !== "" &&
    origin.trim() !== "" &&
    destination.trim() !== "" &&
    packageCount !== "" &&
    totalWeight.trim() !== "";

  const handleSave = () => {
    onSave({
      customer_id: Number(customerId),
      service_type: serviceType,
      shipping_mode: serviceType === "international" ? shippingMode : undefined,
      origin: origin.trim(),
      destination: destination.trim(),
      pickup_date: pickupDate || undefined,
      expected_delivery_date: expectedDeliveryDate || undefined,
      package_count: Number(packageCount),
      total_weight: Number(totalWeight),
      notes: notes.trim() || undefined,
    });
  };

  return (
    <div className="calm-add-backdrop px-4 py-6">
      <div className="calm-add-card max-h-[92vh] w-full max-w-2xl overflow-y-auto">
        <div className="calm-add-header sticky top-0 z-10 flex items-center justify-between border-b px-5 py-4 backdrop-blur">
          <div>
            <h2 className="text-base font-black text-slate-900">إضافة حجز جديد</h2>
            <p className="mt-1 text-[12.5px] font-semibold text-slate-400">
              اختاري العميل وأكملي بيانات الحجز.
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
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 flex items-center gap-1 text-[12.5px] font-black text-slate-600">
                العميل
                <span className="text-[#8E704E]">*</span>
              </span>
              <select
                value={customerId}
                onChange={(event) => setCustomerId(event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-[13.5px] font-semibold text-slate-800 outline-none transition focus:border-[#9CB5BF] focus:bg-white focus:ring-4 focus:ring-[#DCE8EC]"
              >
                <option value="">اختاري عميلًا</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 flex items-center gap-1 text-[12.5px] font-black text-slate-600">
                نوع الحجز
                <span className="text-[#8E704E]">*</span>
              </span>
              <select
                value={serviceType}
                onChange={(event) =>
                  setServiceType(event.target.value as "domestic" | "international")
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-[13.5px] font-semibold text-slate-800 outline-none transition focus:border-[#9CB5BF] focus:bg-white focus:ring-4 focus:ring-[#DCE8EC]"
              >
                <option value="domestic">محلي</option>
                <option value="international">دولي</option>
              </select>
            </label>
            {serviceType === "international" && (
              <label className="block">
                <span className="mb-2 flex items-center gap-1 text-[12.5px] font-black text-slate-600">
                  طريقة الشحن
                  <span className="text-[#8E704E]">*</span>
                </span>
                <select
                  value={shippingMode}
                  onChange={(event) => setShippingMode(event.target.value as "sea" | "air")}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-[13.5px] font-semibold text-slate-800 outline-none transition focus:border-[#9CB5BF] focus:bg-white focus:ring-4 focus:ring-[#DCE8EC]"
                >
                  <option value="sea">بحر</option>
                  <option value="air">جو</option>
                </select>
              </label>
            )}
            <Field label="من (الاستلام)" value={origin} onChange={setOrigin} placeholder="الرياض" required />
            <Field label="إلى (التسليم)" value={destination} onChange={setDestination} placeholder="جدة" required />
            <label className="block">
              <span className="mb-2 flex items-center gap-1 text-[12.5px] font-black text-slate-600">
                تاريخ الاستلام
              </span>
              <input
                type="date"
                value={pickupDate}
                onChange={(event) => setPickupDate(event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-[13.5px] font-semibold text-slate-800 outline-none transition focus:border-[#9CB5BF] focus:bg-white focus:ring-4 focus:ring-[#DCE8EC]"
              />
            </label>
            <label className="block">
              <span className="mb-2 flex items-center gap-1 text-[12.5px] font-black text-slate-600">
                تاريخ التسليم المتوقع
              </span>
              <input
                type="date"
                value={expectedDeliveryDate}
                onChange={(event) => setExpectedDeliveryDate(event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-[13.5px] font-semibold text-slate-800 outline-none transition focus:border-[#9CB5BF] focus:bg-white focus:ring-4 focus:ring-[#DCE8EC]"
              />
            </label>
            <label className="block">
              <span className="mb-2 flex items-center gap-1 text-[12.5px] font-black text-slate-600">
                عدد الطرود
                <span className="text-[#8E704E]">*</span>
              </span>
              <input
                type="number"
                min={1}
                value={packageCount}
                onChange={(event) => setPackageCount(event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-[13.5px] font-semibold text-slate-800 outline-none transition focus:border-[#9CB5BF] focus:bg-white focus:ring-4 focus:ring-[#DCE8EC]"
              />
            </label>
            <label className="block">
              <span className="mb-2 flex items-center gap-1 text-[12.5px] font-black text-slate-600">
                الوزن الإجمالي (كجم)
                <span className="text-[#8E704E]">*</span>
              </span>
              <input
                type="number"
                min={0}
                step="0.1"
                value={totalWeight}
                onChange={(event) => setTotalWeight(event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-[13.5px] font-semibold text-slate-800 outline-none transition focus:border-[#9CB5BF] focus:bg-white focus:ring-4 focus:ring-[#DCE8EC]"
              />
            </label>
            <div className="sm:col-span-2">
              <Field label="الملاحظات" value={notes} onChange={setNotes} placeholder="أي ملاحظات إضافية" />
            </div>
          </div>
          {errorMessage && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13.5px] font-bold text-red-600">
              {errorMessage}
            </div>
          )}
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="h-11 rounded-xl border border-slate-200 px-5 text-[13.5px] font-black text-slate-600 disabled:opacity-50"
            >
              إلغاء
            </button>
            <button
              type="button"
              disabled={!canSave || isSaving}
              onClick={handleSave}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#237c82] px-6 text-[13.5px] font-black text-white shadow-[0_10px_25px_rgba(35,124,130,.18)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Check size={14} />
              {isSaving ? "جاري الحفظ..." : "حفظ الحجز"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
function BookingsWorkspace() {
  const [bookings, setBookings] = useState<ApiBooking[]>([]);
  const [bookingCustomers, setBookingCustomers] = useState<CustomerOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState<number | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [deliveryCompanies, setDeliveryCompanies] = useState<DeliveryCompanyOption[]>([]);
  const [convertingBooking, setConvertingBooking] = useState<ApiBooking | null>(null);
  const [convertCompanyId, setConvertCompanyId] = useState("");
  const [convertTrackingNumber, setConvertTrackingNumber] = useState("");
  const [convertShippingCost, setConvertShippingCost] = useState("");
  const [convertError, setConvertError] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<ApiBooking | null>(null);

  const loadBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [bookingsList, customersList] = await Promise.all([
        getBookingsApi(),
        getBookingCustomersApi(),
      ]);
      setBookings(bookingsList);
      setBookingCustomers(customersList);
    } catch (err) {
      console.error("Bookings API error:", err);
      setError(err instanceof Error ? err.message : "تعذر تحميل الحجوزات");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadBookings();
  }, [loadBookings]);

  useEffect(() => {
    getDeliveryCompaniesApi()
      .then(setDeliveryCompanies)
      .catch(() => setDeliveryCompanies([]));
  }, []);

  const customerName = (customerId: number) =>
    bookingCustomers.find((item) => item.id === customerId)?.name ?? "عميل #" + customerId;

  const createBookingRecord = async (payload: CreateBookingApiPayload) => {
    try {
      setIsSaving(true);
      setSaveError(null);
      await createBookingApi(payload);
      setShowCreate(false);
      await loadBookings();
    } catch (err) {
      console.error("Create booking API error:", err);
      setSaveError(err instanceof Error ? err.message : "تعذر إضافة الحجز");
    } finally {
      setIsSaving(false);
    }
  };

  const changeStatus = async (
    booking: ApiBooking,
    newStatus: BookingStatus,
    extra?: { deliveryCompanyId?: number; shippingCost?: number; trackingNumber?: string }
  ) => {
    try {
      setStatusUpdatingId(booking.id);
      setStatusError(null);
      const updated = await updateBookingStatusApi(booking.id, newStatus, extra);
      setBookings((current) => current.map((item) => (item.id === booking.id ? updated : item)));
      return true;
    } catch (err) {
      setStatusError(err instanceof Error ? err.message : "تعذر تحديث حالة الحجز");
      return false;
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const formatDate = (value?: string | null) => {
    if (!value) return "—";
    try {
      return new Intl.DateTimeFormat("ar-SA", { day: "numeric", month: "short" }).format(new Date(value));
    } catch {
      return value;
    }
  };

  const todayStr = new Date().toISOString().slice(0, 10);

  const accent = "#c2653f";
  const accentSoft = "#fbeee7";
  const accentBorder = "#f0d9cc";

  const columns: Array<{ key: BookingStatus; label: string; tone: string; dot: string; nextLabel?: string }> = [
    { key: "draft", label: "مسودة", tone: "bg-amber-50 text-amber-700 border-amber-100", dot: "#d97706", nextLabel: "تأكيد" },
    { key: "confirmed", label: "مؤكد", tone: "bg-emerald-50 text-emerald-700 border-emerald-100", dot: "#059669", nextLabel: "تحويل لشحنة" },
    { key: "converted_to_shipment", label: "تحوّل لشحنة", tone: "bg-indigo-50 text-indigo-700 border-indigo-100", dot: "#4f46e5" },
    { key: "cancelled", label: "ملغاة", tone: "bg-rose-50 text-rose-700 border-rose-100", dot: "#e11d48" },
  ];

  const nextStatus: Partial<Record<BookingStatus, BookingStatus>> = {
    draft: "confirmed",
    confirmed: "converted_to_shipment",
  };

  return (
    <>
      <WorkspaceHeader
        eyebrow="BOOKING"
        title="الحجوزات"
        description="إدارة الحجوزات من الاستلام حتى تحويلها لشحنة."
        icon={ClipboardList}
        accent={{ bar: accentSoft, border: accentBorder, stripe: accent, icon: accent }}
        action={
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="inline-flex h-10 items-center gap-2 rounded-xl px-4 text-[12.5px] font-bold text-white shadow-lg"
            style={{ backgroundColor: accent }}
          >
            <Plus size={14} />
            حجز جديد
          </button>
        }
      />

      {loading && (
        <Surface className="p-10 text-center text-[14.5px] font-bold text-slate-500">
          جاري تحميل الحجوزات...
        </Surface>
      )}
      {!loading && error && (
        <Surface className="flex flex-col items-center gap-3 border-red-200 bg-red-50 p-10 text-center">
          <p className="text-[14.5px] font-bold text-red-600">{error}</p>
          <button
            type="button"
            onClick={() => void loadBookings()}
            className="rounded-xl bg-red-600 px-4 py-2 text-[13.5px] font-black text-white"
          >
            إعادة المحاولة
          </button>
        </Surface>
      )}
      {!loading && !error && bookings.length === 0 && (
        <Surface className="p-10 text-center text-[14.5px] font-bold text-slate-400">
          لا توجد حجوزات بعد. اضغطي "حجز جديد" لإضافة أول حجز.
        </Surface>
      )}

      {statusError && (
        <p className="mb-3 text-[12.5px] font-bold text-rose-600">{statusError}</p>
      )}

      {!loading && !error && bookings.length > 0 && (
        <>
        {(() => {
          const lateCount = bookings.filter((b) => b.status === "draft" && b.pickup_date && b.pickup_date < todayStr).length;
          const todayCount = bookings.filter((b) => b.pickup_date === todayStr).length;
          const convertedCount = bookings.filter((b) => b.status === "converted_to_shipment").length;
          const conversionRate = bookings.length ? Math.round((convertedCount / bookings.length) * 100) : 0;
          const insight = lateCount > 0
            ? { text: "⚠ عندك " + lateCount + " حجوزات متأخرة تحتاج متابعة عاجلة اليوم", bg: "#fff1f2", fg: "#be123c" }
            : todayCount > 0
            ? { text: "📅 عندك " + todayCount + " حجوزات مجدولة اليوم", bg: accentSoft, fg: accent }
            : { text: "✓ كل الحجوزات على المسار الصحيح، لا يوجد تأخير", bg: "#ecfdf5", fg: "#047857" };
          return (
            <>
              <div className="mb-3 rounded-2xl px-4 py-3 text-[13.5px] font-bold" style={{ backgroundColor: insight.bg, color: insight.fg }}>
                {insight.text}
              </div>
              <div className="mb-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                <div className="flex items-center gap-2.5 rounded-2xl border p-3" style={{ borderColor: accentBorder, backgroundColor: accentSoft }}>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-white" style={{ background: "linear-gradient(135deg, " + accent + "cc, " + accent + ")" }}><Layers3 size={14} /></span>
                  <div className="min-w-0"><p className="truncate text-[10.5px] font-bold" style={{ color: accent }}>إجمالي الحجوزات</p><p className="mt-0.5 text-[18.5px] font-black text-slate-900">{bookings.length}</p></div>
                </div>
                <div className="flex items-center gap-2.5 rounded-2xl border border-slate-100 bg-slate-50 p-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-700 text-white"><CalendarClock size={14} /></span>
                  <div className="min-w-0"><p className="truncate text-[10.5px] font-bold text-slate-400">حجوزات اليوم</p><p className="mt-0.5 text-[18.5px] font-black text-slate-900">{todayCount}</p></div>
                </div>
                <div className="flex items-center gap-2.5 rounded-2xl border border-indigo-100 bg-indigo-50 p-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white"><TrendingUp size={14} /></span>
                  <div className="min-w-0"><p className="truncate text-[10.5px] font-bold text-indigo-500">نسبة التحويل لشحنة</p><p className="mt-0.5 text-[18.5px] font-black text-indigo-700">{conversionRate}%</p></div>
                </div>
                <div className="flex items-center gap-2.5 rounded-2xl border border-rose-100 bg-rose-50 p-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-rose-600 text-white"><AlertTriangle size={14} /></span>
                  <div className="min-w-0"><p className="truncate text-[10.5px] font-bold text-rose-500">متأخرة</p><p className="mt-0.5 text-[18.5px] font-black text-rose-700">{lateCount}</p></div>
                </div>
              </div>
            </>
          );
        })()}
        <div key={"kanban-" + bookings.length} className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {columns.map((column, columnIndex) => {
            const items = bookings.filter((item) => item.status === column.key);
            const advanceTo = nextStatus[column.key];
            return (
              <div key={column.key} className="flex flex-col">
                <div className={"mb-4 flex items-center justify-between rounded-xl border px-4 py-3.5 " + column.tone}>
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full text-[11.5px] font-black text-white" style={{ backgroundColor: column.dot }}>{columnIndex + 1}</span>
                    <p className="text-[14.5px] font-black">{column.label}</p>
                  </div>
                  <span className="text-[14.5px] font-black">{items.length}</span>
                </div>

                <div className="flex flex-col gap-3.5">
                  {items.length === 0 && (
                    <div className="flex min-h-[110px] items-center justify-center rounded-xl border border-dashed border-slate-200 p-4 text-center text-[12.5px] font-bold text-slate-300">
                      لا يوجد
                    </div>
                  )}
                  {items.map((booking) => {
                    const isToday = booking.pickup_date === todayStr;
                    const isLate = column.key === "draft" && booking.pickup_date && booking.pickup_date < todayStr;
                    return (
                      <div
                        key={booking.id}
                        onClick={() => setSelectedBooking(booking)}
                        className="cursor-pointer rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md"
                        style={{ borderRight: "4px solid " + column.dot }}
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <p className="text-[15.5px] font-black text-slate-900">{booking.booking_number}</p>
                          {isToday && (
                            <span className="rounded-full px-2.5 py-1 text-[10.5px] font-black text-white" style={{ backgroundColor: accent }}>
                              اليوم
                            </span>
                          )}
                          {isLate && (
                            <span className="rounded-full bg-rose-100 px-2.5 py-1 text-[10.5px] font-black text-rose-700">متأخر</span>
                          )}
                        </div>
                        <p className="text-[13px] font-bold text-slate-500">{customerName(booking.customer_id)}</p>
                        <div className="mt-2.5 flex items-center gap-1.5">
                          <span className="max-w-[68px] truncate text-[12.5px] font-black text-slate-700">{booking.origin}</span>
                          <span className="flex flex-1 items-center gap-1">
                            <span className="h-px flex-1 border-t border-dashed" style={{ borderColor: column.dot }} />
                            <Route size={11} style={{ color: column.dot }} />
                            <span className="h-px flex-1 border-t border-dashed" style={{ borderColor: column.dot }} />
                          </span>
                          <span className="max-w-[68px] truncate text-[12.5px] font-black text-slate-700">{booking.destination}</span>
                        </div>
                        <div className="relative mt-3.5 flex items-center justify-between border-t border-dashed border-slate-200 pt-2.5 text-[11.5px] font-bold text-slate-400">
                          <span className="flex items-center gap-1"><CalendarClock size={11} className="text-slate-300" />{formatDate(booking.pickup_date)}</span>
                          <span className="flex items-center gap-1"><Boxes size={11} className="text-slate-300" />{booking.package_count} طرد · {booking.total_weight} كجم</span>
                        </div>
                        {(column.key === "draft" || column.key === "confirmed") && (
                          <div className="mt-4 flex gap-2" onClick={(event) => event.stopPropagation()}>
                            {advanceTo && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (advanceTo === "converted_to_shipment") {
                                    setConvertingBooking(booking);
                                    setConvertCompanyId("");
                                    setConvertTrackingNumber("");
                                    setConvertShippingCost("");
                                    setConvertError(null);
                                  } else {
                                    changeStatus(booking, advanceTo);
                                  }
                                }}
                                disabled={statusUpdatingId === booking.id}
                                className="h-9 flex-1 rounded-xl text-[11.5px] font-bold text-white disabled:opacity-60"
                                style={{ backgroundColor: accent }}
                              >
                                {statusUpdatingId === booking.id ? "..." : column.nextLabel}
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => changeStatus(booking, "cancelled")}
                              disabled={statusUpdatingId === booking.id}
                              className="h-9 flex-1 rounded-xl bg-rose-50 text-[11.5px] font-bold text-rose-600 disabled:opacity-60"
                            >
                              إلغاء
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        </>
      )}

      {showCreate && (
        <AddBookingModal
          customers={bookingCustomers}
          isSaving={isSaving}
          errorMessage={saveError}
          onClose={() => setShowCreate(false)}
          onSave={createBookingRecord}
        />
      )}

      {convertingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-[380px] rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="mb-1 text-[16.5px] font-black text-slate-900">تحويل الحجز إلى شحنة</h3>
            <p className="mb-4 text-[12.5px] font-bold text-slate-400">{convertingBooking.booking_number}</p>
            <label className="mb-1 block text-[12.5px] font-bold text-slate-500">شركة التوصيل</label>
            <select
              value={convertCompanyId}
              onChange={(event) => setConvertCompanyId(event.target.value)}
              className="mb-3 h-10 w-full rounded-xl border border-slate-200 px-3 text-[13.5px] font-bold text-slate-700"
            >
              <option value="">اختاري شركة التوصيل</option>
              {deliveryCompanies.map((company) => (
                <option key={company.id} value={company.id}>{company.name}</option>
              ))}
            </select>
            <label className="mb-1 block text-[12.5px] font-bold text-slate-500">رقم التتبع (اختياري)</label>
            <input type="text" value={convertTrackingNumber} onChange={(event) => setConvertTrackingNumber(event.target.value)} className="mb-3 h-10 w-full rounded-xl border border-slate-200 px-3 text-[13.5px] font-bold text-slate-700" />
            <label className="mb-1 block text-[12.5px] font-bold text-slate-500">تكلفة الشحن (اختياري)</label>
            <input type="number" value={convertShippingCost} onChange={(event) => setConvertShippingCost(event.target.value)} className="mb-4 h-10 w-full rounded-xl border border-slate-200 px-3 text-[13.5px] font-bold text-slate-700" />
            {convertError && (<p className="mb-3 text-[12.5px] font-bold text-rose-600">{convertError}</p>)}
            <div className="flex gap-2">
              <button type="button" onClick={() => setConvertingBooking(null)} className="h-10 flex-1 rounded-xl bg-slate-100 text-[12.5px] font-bold text-slate-600">إلغاء</button>
              <button
                type="button"
                disabled={isConverting}
                onClick={async () => {
                  if (!convertCompanyId) { setConvertError("اختاري شركة التوصيل"); return; }
                  setIsConverting(true);
                  const ok = await changeStatus(convertingBooking, "converted_to_shipment", {
                    deliveryCompanyId: Number(convertCompanyId),
                    shippingCost: convertShippingCost ? Number(convertShippingCost) : undefined,
                    trackingNumber: convertTrackingNumber || undefined,
                  });
                  setIsConverting(false);
                  if (ok) { setConvertingBooking(null); }
                }}
                className="h-10 flex-1 rounded-xl text-[12.5px] font-bold text-white disabled:opacity-60"
                style={{ backgroundColor: accent }}
              >
                {isConverting ? "..." : "تأكيد التحويل"}
              </button>
            </div>
          </div>
        </div>
      )}
      {selectedBooking && (
        <DetailPanel
          title={selectedBooking.booking_number}
          subtitle={customerName(selectedBooking.customer_id)}
          icon={CalendarClock}
          onClose={() => setSelectedBooking(null)}
        >
          <InfoGrid
            items={[
              { label: "نوع الخدمة", value: selectedBooking.service_type },
              ...(selectedBooking.shipping_mode ? [{ label: "طريقة الشحن", value: selectedBooking.shipping_mode === "air" ? "جو" : "بحر" }] : []),
              { label: "الحالة", value: selectedBooking.status },
              { label: "من", value: selectedBooking.origin },
              { label: "إلى", value: selectedBooking.destination },
              { label: "تاريخ الاستلام", value: formatDate(selectedBooking.pickup_date) },
              { label: "تاريخ التسليم المتوقع", value: formatDate(selectedBooking.expected_delivery_date) },
              { label: "عدد الطرود", value: String(selectedBooking.package_count) },
              { label: "الوزن الإجمالي", value: selectedBooking.total_weight + " كجم" },
              { label: "تاريخ الإنشاء", value: formatDate(selectedBooking.created_at) },
            ]}
          />
          {selectedBooking.notes && (
            <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-[11.5px] font-bold text-slate-500">ملاحظات</p>
              <p className="mt-2 text-[13.5px] font-medium text-slate-700">{selectedBooking.notes}</p>
            </div>
          )}
        </DetailPanel>
      )}
    </>
  );
}
const ORDER_STATUS_LABELS: Record<string, OrderRecord["status"]> = {
  new: "جديد",
  pending_approval: "بانتظار الاعتماد",
  in_progress: "قيد التنفيذ",
  ready_to_ship: "جاهز للشحن",
  completed: "مكتمل",
};

const ORDER_PRIORITY_LABELS: Record<string, OrderRecord["priority"]> = {
  high: "عالية",
  medium: "متوسطة",
  normal: "عادية",
};

const ORDER_PRIORITY_TO_API: Record<OrderRecord["priority"], "high" | "medium" | "normal"> = {
  "عالية": "high",
  "متوسطة": "medium",
  "عادية": "normal",
};

const FINANCIAL_STATUS_META: Record<string, { label: string; tone: string }> = {
  paid: { label: "🟢 مدفوع بالكامل", tone: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  partial: { label: "🟠 مدفوع جزئيًا", tone: "bg-amber-50 text-amber-700 ring-amber-200" },
  unpaid: { label: "🔴 مستحق", tone: "bg-red-50 text-red-700 ring-red-200" },
  no_invoice: { label: "بدون فاتورة", tone: "bg-slate-50 text-slate-500 ring-slate-200" },
};

function mapApiOrderToLocal(order: ApiOrder, customersById: Map<number, ApiOrderCustomerOption>): OrderRecord {
  const customer = customersById.get(order.customer_id);
  return {
    id: order.order_number,
    dbId: order.id,
    customer: customer?.name ?? `عميل #${order.customer_id}`,
    customerType: customer?.customer_type === "company" ? "company" : "individual",
    title: order.title,
    amount: order.amount,
    status: ORDER_STATUS_LABELS[order.status] ?? "جديد",
    priority: ORDER_PRIORITY_LABELS[order.priority] ?? "عادية",
    createdAt: new Intl.DateTimeFormat("ar-SA", { day: "numeric", month: "long", year: "numeric" }).format(new Date(order.created_at)),
    dueDate: order.due_date ?? "",
    owner: order.owner ?? "",
    progress: order.progress,
    invoiceReady: order.invoice_ready,
    shipmentReady: order.shipment_ready,
    notes: order.notes ?? "",
    origin: order.origin ?? "",
    destination: order.destination ?? "",
    recipientName: order.recipient_name ?? "",
    recipientPhone: order.recipient_phone ?? "",
    recipientAddress: order.recipient_address ?? "",
    deliveryMethod: order.delivery_method ?? "internal",
    balance: order.balance ?? 0,
    financialStatus: order.financial_status ?? "no_invoice",
  };
}

interface OrderFormDraft {
  customerId: number | "";
  title: string;
  amount: number;
  priority: OrderRecord["priority"];
  dueDate: string;
  owner: string;
  notes: string;
  origin: string;
  destination: string;
  serviceType: "domestic" | "international";
  packageCount: number;
  deliveryCompanyId: number | "";
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  deliveryMethod: "internal" | "external";
  inventoryItemId: number | "";
  quantity: number;
}

function OrdersWorkspace() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [customers, setCustomers] = useState<ApiOrderCustomerOption[]>([]);
  const [deliveryCompanies, setDeliveryCompanies] = useState<DeliveryCompanyOption[]>([]);
  const [inventoryItems, setInventoryItems] = useState<ApiInventoryItem[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [addOrderError, setAddOrderError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"الكل" | OrderRecord["status"]>("الكل");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [shipmentModalOrder, setShipmentModalOrder] = useState<OrderRecord | null>(null);
  const [shipmentOrigin, setShipmentOrigin] = useState("");
  const [shipmentDestination, setShipmentDestination] = useState("");
  const [shipmentServiceType, setShipmentServiceType] = useState("");
  const [shipmentPackageCount, setShipmentPackageCount] = useState("");
  const [shipmentModalError, setShipmentModalError] = useState<string | null>(null);
  const [isSubmittingShipment, setIsSubmittingShipment] = useState(false);
  const selected = orders.find((order) => order.id === selectedId) ?? null;

  const loadOrders = useCallback(async () => {
    setOrdersLoading(true);
    setOrdersError(null);
    try {
      const [customersData, ordersData, companiesData, inventoryData] = await Promise.all([getOrderCustomersApi(), getOrdersApi(), getDeliveryCompaniesApi(), getInventoryApi()]);
      setCustomers(customersData);
      setDeliveryCompanies(companiesData);
      setInventoryItems(inventoryData);
      const customersById = new Map(customersData.map((customer) => [customer.id, customer]));
      setOrders(ordersData.map((order) => mapApiOrderToLocal(order, customersById)));
    } catch (error) {
      setOrdersError(error instanceof Error ? error.message : "تعذر تحميل الطلبات");
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const deleteOrder = async (orderId: string) => {
    const target = orders.find((order) => order.id === orderId);
    if (!target) return;
    try {
      await deleteOrderApi(target.dbId);
      setOrders((current) => current.filter((order) => order.id !== orderId));
      setSelectedId(null);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "تعذر حذف الطلب");
    }
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
  const advanceOrder = async (orderId: string) => {
    const target = orders.find((order) => order.id === orderId);
    if (!target || target.status === "مكتمل") return;
    try {
      const updated = await advanceOrderApi(target.dbId);
      const customersById = new Map(customers.map((customer) => [customer.id, customer]));
      setOrders((current) => current.map((order) => order.id === orderId ? mapApiOrderToLocal(updated, customersById) : order));
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "تعذر تحديث حالة الطلب");
    }
  };
  const toggleInvoice = async (orderId: string) => {
    const target = orders.find((order) => order.id === orderId);
    if (!target) return;
    try {
      const updated = await toggleInvoiceReadyApi(target.dbId);
      const customersById = new Map(customers.map((customer) => [customer.id, customer]));
      setOrders((current) => current.map((order) => order.id === orderId ? mapApiOrderToLocal(updated, customersById) : order));
      if (updated.invoice_ready && updated.invoice_id) {
        window.dispatchEvent(new CustomEvent("ertikaz-open-invoice", { detail: updated.invoice_id }));
      }
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "تعذر تحديث حالة الفاتورة");
    }
  };
  const toggleShipment = async (orderId: string) => {
    const target = orders.find((order) => order.id === orderId);
    if (!target) return;
    if (!target.shipmentReady) {
      if (target.origin && target.destination) {
        try {
          const updated = await toggleShipmentReadyApi(target.dbId);
          const customersById = new Map(customers.map((customer) => [customer.id, customer]));
          setOrders((current) => current.map((order) => order.id === orderId ? mapApiOrderToLocal(updated, customersById) : order));
        } catch (error) {
          window.alert(error instanceof Error ? error.message : "تعذر تجهيز الشحنة");
        }
        return;
      }
      setShipmentModalOrder(target);
      setShipmentOrigin("");
      setShipmentDestination("");
      setShipmentServiceType("");
      setShipmentPackageCount("");
      setShipmentModalError(null);
      return;
    }
    try {
      const updated = await toggleShipmentReadyApi(target.dbId);
      const customersById = new Map(customers.map((customer) => [customer.id, customer]));
      setOrders((current) => current.map((order) => order.id === orderId ? mapApiOrderToLocal(updated, customersById) : order));
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "تعذر تحديث حالة الشحنة");
    }
  };
  const submitShipmentToggle = async () => {
    if (!shipmentModalOrder) return;
    if (!shipmentOrigin.trim() || !shipmentDestination.trim()) {
      setShipmentModalError("أدخلي نقطة الانطلاق والوجهة");
      return;
    }
    setIsSubmittingShipment(true);
    setShipmentModalError(null);
    try {
      const updated = await toggleShipmentReadyApi(shipmentModalOrder.dbId, {
        origin: shipmentOrigin,
        destination: shipmentDestination,
        service_type: shipmentServiceType || undefined,
        package_count: shipmentPackageCount ? Number(shipmentPackageCount) : undefined,
      });
      const customersById = new Map(customers.map((customer) => [customer.id, customer]));
      setOrders((current) => current.map((order) => order.id === shipmentModalOrder.id ? mapApiOrderToLocal(updated, customersById) : order));
      setShipmentModalOrder(null);
    } catch (error) {
      setShipmentModalError(error instanceof Error ? error.message : "تعذر إنشاء الحجز");
    } finally {
      setIsSubmittingShipment(false);
    }
  };
  const createOrder = async (draft: OrderFormDraft) => {
    if (draft.customerId === "") return;
    setIsSavingOrder(true);
    setAddOrderError(null);
    try {
      const created = await createOrderApi({
        customer_id: draft.customerId,
        title: draft.title,
        amount: draft.amount,
        priority: ORDER_PRIORITY_TO_API[draft.priority],
        due_date: draft.dueDate || null,
        owner: draft.owner || null,
        notes: draft.notes || null,
        origin: draft.origin || null,
        destination: draft.destination || null,
        service_type: draft.serviceType || null,
        package_count: draft.packageCount || 1,
        delivery_company_id: draft.deliveryCompanyId || null,
        delivery_method: draft.deliveryMethod,
        recipient_name: draft.recipientName || null,
        recipient_phone: draft.recipientPhone || null,
        recipient_address: draft.recipientAddress || null,
        inventory_item_id: draft.inventoryItemId || null,
        quantity: draft.quantity || 1,
      });
      const customersById = new Map(customers.map((customer) => [customer.id, customer]));
      const mapped = mapApiOrderToLocal(created, customersById);
      setOrders((current) => [mapped, ...current]);
      setShowCreate(false);
    } catch (error) {
      setAddOrderError(error instanceof Error ? error.message : "تعذر إنشاء الطلب");
    } finally {
      setIsSavingOrder(false);
    }
  };
  return (
    <>
      <WorkspaceHeader
        eyebrow="ORDERS"
        title="الطلبات"
        description=""
        icon={ShoppingCart}
        accent={{ bar: "#fdf1de", border: "#f0dfb8", stripe: "#c9962c", icon: "#c9962c" }}
        action={
          <button type="button" onClick={() => setShowCreate(true)} className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-900 px-4 text-[12.5px] font-bold text-white shadow-lg">
            <Plus size={14} />
            طلب جديد
          </button>
        }
      />
      {ordersLoading && (
        <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center text-[12.5px] font-medium text-slate-400">جاري تحميل الطلبات...</div>
      )}
      {!ordersLoading && ordersError && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-[12.5px] font-bold text-red-600">تعذر تحميل الطلبات — رمز الخطأ: {ordersError}</div>
      )}
      {!ordersLoading && !ordersError && (
      <Surface className="overflow-hidden">
        <div className="border-b border-slate-100 p-4 sm:p-5">
          <div className="mb-4">
            <div className="flex items-center justify-between rounded-2xl border p-3" style={{ borderColor: "#f0dfb8" }}>
              {statuses.filter((item) => item.key !== "الكل").map((item, idx, arr) => {
                const active = statusFilter === item.key;
                const count = orders.filter((order) => order.status === item.key).length;
                const isLast = idx === arr.length - 1;
                const StepIcon = item.icon;
                return (
                  <div key={item.key} className="flex flex-1 items-center">
                    <button type="button" onClick={() => setStatusFilter(active ? "الكل" : item.key)} className="flex flex-1 flex-col items-center gap-1">
                      <span className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition ${active ? "border-[#c9962c] bg-[#c9962c] text-white shadow-md" : "border-slate-200 bg-white text-slate-400 hover:border-[#c9962c] hover:text-[#c9962c]"}`}>
                        <StepIcon size={14} />
                      </span>
                      <span className={`text-[10.5px] font-bold ${active ? "text-[#c9962c]" : "text-slate-400"}`}>{item.label}</span>
                      <span className="text-[13.5px] font-black text-slate-800">{count}</span>
                    </button>
                    {!isLast && <div className="mx-1 h-0.5 flex-1" style={{ backgroundColor: "#f0dfb8", marginTop: "-18px" }} />}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div className="rounded-2xl border p-3" style={{ borderColor: "#f0dfb8", backgroundColor: "#fdf1de" }}>
              <p className="text-[10.5px] font-bold" style={{ color: "#b9852b" }}>إجمالي الطلبات</p>
              <p className="mt-1 text-[18.5px] font-black text-slate-900">{orders.length}</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
              <p className="text-[10.5px] font-bold text-slate-400">القيمة الإجمالية</p>
              <p className="mt-1 text-[18.5px] font-black text-slate-900">{formatCurrency(orders.reduce((sum, order) => sum + order.amount, 0))}</p>
            </div>
            <div className="rounded-2xl border border-rose-100 bg-rose-50 p-3">
              <p className="text-[10.5px] font-bold text-rose-500">متأخرة</p>
              <p className="mt-1 text-[18.5px] font-black text-rose-700">{orders.filter((o) => o.status !== "مكتمل" && o.dueDate && new Date(o.dueDate) < new Date()).length}</p>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-3">
              <p className="text-[10.5px] font-bold text-emerald-600">متوسط قيمة الطلب</p>
              <p className="mt-1 text-[18.5px] font-black text-emerald-800">{formatCurrency(orders.length ? orders.reduce((sum, order) => sum + order.amount, 0) / orders.length : 0)}</p>
            </div>
          </div>
          <div className="relative w-full xl:w-72">
            <Search size={14} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ابحث في الطلبات..." className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pr-10 pl-3 text-[12.5px] font-medium outline-none transition focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100" />
          </div>
        </div>
        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[1040px] border-collapse text-right">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[11.5px] font-bold text-slate-400">
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
                    <p className="text-[12.5px] font-bold text-sky-700">{order.id}</p>
                    <p className="mt-1 max-w-[220px] truncate text-[13.5px] font-bold text-slate-900">{order.title}</p>
                    <p className="mt-1 text-[10.5px] font-medium text-slate-400">الاستحقاق {order.dueDate}</p>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e6f1f8] text-[#2d75a3]">{order.customerType === "company" ? <Building2 size={14} /> : <User size={14} />}</span>
                      <span className="max-w-[180px] truncate text-[12.5px] font-bold text-slate-700">{order.customer}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[13.5px] font-bold text-slate-900">{formatCurrency(order.amount)}</td>
                  <td className="px-4 py-4"><span className={`rounded-full px-3 py-1.5 text-[10.5px] font-bold ring-1 ${statusTone(order.status)}`}>{order.status}</span></td>
                  <td className="px-4 py-4">
                    <div className="w-32">
                      <div className="mb-1 flex items-center justify-between text-[10.5px] font-medium text-slate-400"><span>{order.progress}%</span><span>{order.priority}</span></div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#236c83]" style={{ width: `${order.progress}%` }} /></div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[12.5px] font-medium text-slate-600">{order.owner}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <ActionIcon label="عرض التفاصيل" icon={Eye} onClick={() => setSelectedId(order.id)} />
                      <ActionIcon label={order.invoiceReady ? "إلغاء تجهيز الفاتورة" : "تجهيز الفاتورة"} icon={ReceiptText} active={order.invoiceReady} onClick={() => toggleInvoice(order.id)} />
                      <ActionIcon label={order.shipmentReady ? "إلغاء تجهيز الشحنة" : "تجهيز الشحنة"} icon={Truck} active={order.shipmentReady} onClick={() => toggleShipment(order.id)} />
                      <ActionIcon label="نقل للمرحلة التالية" icon={ArrowLeft} disabled={order.status === "مكتمل"} onClick={() => advanceOrder(order.id)} />
                      <ActionIcon label="حذف الطلب" icon={Trash2} onClick={() => { if (window.confirm("حذف هذا الطلب؟ لا يمكن التراجع.")) deleteOrder(order.id); }} />
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
                <div><p className="text-[11.5px] font-bold text-sky-700">{order.id}</p><h3 className="mt-1 text-[14.5px] font-bold text-slate-900">{order.title}</h3><p className="mt-1 text-[11.5px] font-medium text-slate-400">{order.customer}</p></div>
                <span className={`rounded-full px-3 py-1 text-[10.5px] font-bold ring-1 ${statusTone(order.status)}`}>{order.status}</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2"><div className="rounded-xl bg-white p-3"><p className="text-[10.5px] text-slate-400">القيمة</p><p className="mt-1 text-[13.5px] font-bold text-slate-900">{formatCurrency(order.amount)}</p></div><div className="rounded-xl bg-white p-3"><p className="text-[10.5px] text-slate-400">المسؤول</p><p className="mt-1 text-[12.5px] font-bold text-slate-900">{order.owner}</p></div></div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white"><div className="h-full rounded-full bg-[#236c83]" style={{ width: `${order.progress}%` }} /></div>
              <div className="mt-3 flex items-center gap-2"><ActionIcon label="التفاصيل" icon={Eye} onClick={() => setSelectedId(order.id)} /><ActionIcon label="الفاتورة" icon={ReceiptText} active={order.invoiceReady} onClick={() => toggleInvoice(order.id)} /><ActionIcon label="الشحنة" icon={Truck} active={order.shipmentReady} onClick={() => toggleShipment(order.id)} /><ActionIcon label="التالي" icon={ArrowLeft} disabled={order.status === "مكتمل"} onClick={() => advanceOrder(order.id)} /><ActionIcon label="حذف" icon={Trash2} onClick={() => { if (window.confirm("حذف هذا الطلب؟ لا يمكن التراجع.")) deleteOrder(order.id); }} /></div>
            </article>
          ))}
        </div>
        {visibleOrders.length === 0 && <div className="p-10 text-center text-[12.5px] font-medium text-slate-400">لا توجد طلبات مطابقة للبحث أو الفلتر الحالي.</div>}
      </Surface>
      )}
      {selected && (
        <DetailPanel title={selected.id} subtitle={selected.customer} icon={ShoppingCart} onClose={() => setSelectedId(null)}>
          <div className="rounded-[22px] bg-[#f8fcfb] p-5">
            <div className="flex items-start justify-between gap-3"><div><p className="text-[11.5px] font-bold text-sky-700">{selected.priority} الأولوية</p><h3 className="mt-2 text-[18.5px] font-bold text-slate-900">{selected.title}</h3><p className="mt-2 text-[25.5px] font-bold text-slate-950">{formatCurrency(selected.amount)}</p></div><span className={`rounded-full px-3 py-1 text-[10.5px] font-bold ring-1 ${statusTone(selected.status)}`}>{selected.status}</span></div>
          </div>
          <InfoGrid items={[{ label: "المسؤول", value: selected.owner }, { label: "تاريخ الإنشاء", value: selected.createdAt }, { label: "تاريخ الاستحقاق", value: selected.dueDate }, { label: "نسبة الإنجاز", value: `${selected.progress}%` }]} />
          <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-4"><p className="text-[11.5px] font-medium text-slate-400">ملاحظات الطلب</p><p className="mt-2 text-[12.5px] font-medium leading-5 text-slate-700">{selected.notes || "لا توجد ملاحظات."}</p></div>
          <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-4">
              <p className="mb-3 text-[11.5px] font-bold text-slate-400">مراحل الطلب</p>
              <div className="flex items-center gap-1">
                {statuses.slice(1).map((s, idx, arr) => {
                  const currentIdx = arr.findIndex((x) => x.key === selected.status);
                  const done = currentIdx >= 0 && idx <= currentIdx;
                  const isCurrent = idx === currentIdx;
                  const StageIcon = s.icon;
                  return (
                    <div key={s.key} className="flex flex-1 flex-col items-center gap-1.5">
                      <div className="flex w-full items-center">
                        {idx > 0 && <div className={`h-0.5 flex-1 ${done ? "bg-sky-500" : "bg-slate-200"}`} />}
                        <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${isCurrent ? "bg-sky-600 text-white ring-4 ring-sky-100" : done ? "bg-sky-500 text-white" : "bg-slate-100 text-slate-400"}`}>
                          <StageIcon size={13} />
                        </div>
                        {idx < arr.length - 1 && <div className={`h-0.5 flex-1 ${idx < currentIdx ? "bg-sky-500" : "bg-slate-200"}`} />}
                      </div>
                      <span className={`text-center text-[9.5px] font-bold leading-tight ${isCurrent ? "text-sky-700" : "text-slate-400"}`}>{s.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3"><button type="button" onClick={() => toggleInvoice(selected.id)} className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl text-[12.5px] font-bold ${selected.invoiceReady ? "bg-emerald-50 text-emerald-700" : "bg-slate-900 text-white"}`}><ReceiptText size={14} />{selected.invoiceReady ? "الفاتورة جاهزة" : "تجهيز الفاتورة"}</button><button type="button" onClick={() => toggleShipment(selected.id)} className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl text-[12.5px] font-bold ${selected.shipmentReady ? "bg-sky-50 text-sky-700" : "bg-slate-900 text-white"}`}><Truck size={14} />{selected.shipmentReady ? "الشحنة جاهزة" : "تجهيز الشحنة"}</button></div>
          {selected.status !== "مكتمل" && <button type="button" onClick={() => advanceOrder(selected.id)} className="mt-3 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#236c83] text-[12.5px] font-bold text-white"><ArrowLeft size={14} />نقل الطلب للمرحلة التالية</button>}
          <button type="button" onClick={() => { if (window.confirm("حذف هذا الطلب؟")) deleteOrder(selected.id); }} className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 text-[12.5px] font-bold text-red-600"><Trash2 size={14} /> حذف الطلب</button>
        </DetailPanel>
      )}
      {showCreate && (
        <OrderCreateModal
          customers={customers}
          deliveryCompanies={deliveryCompanies}
          inventoryItems={inventoryItems}
          isSaving={isSavingOrder}
          errorMessage={addOrderError}
          onClose={() => setShowCreate(false)}
          onSave={createOrder}
        />
      )}
      {shipmentModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-[380px] rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="mb-1 text-[16.5px] font-black text-slate-900">تجهيز الطلب للشحن</h3>
            <p className="mb-4 text-[12.5px] font-bold text-slate-400">{shipmentModalOrder.id}</p>
            <label className="mb-1 block text-[12.5px] font-bold text-slate-500">نقطة الانطلاق</label>
            <input type="text" value={shipmentOrigin} onChange={(event) => setShipmentOrigin(event.target.value)} className="mb-3 h-10 w-full rounded-xl border border-slate-200 px-3 text-[13.5px] font-bold text-slate-700" />
            <label className="mb-1 block text-[12.5px] font-bold text-slate-500">الوجهة</label>
            <input type="text" value={shipmentDestination} onChange={(event) => setShipmentDestination(event.target.value)} className="mb-3 h-10 w-full rounded-xl border border-slate-200 px-3 text-[13.5px] font-bold text-slate-700" />
            <label className="mb-1 block text-[12.5px] font-bold text-slate-500">نوع الخدمة (اختياري)</label>
            <input type="text" value={shipmentServiceType} onChange={(event) => setShipmentServiceType(event.target.value)} placeholder="domestic" className="mb-3 h-10 w-full rounded-xl border border-slate-200 px-3 text-[13.5px] font-bold text-slate-700" />
            <label className="mb-1 block text-[12.5px] font-bold text-slate-500">عدد الطرود (اختياري)</label>
            <input type="number" value={shipmentPackageCount} onChange={(event) => setShipmentPackageCount(event.target.value)} className="mb-4 h-10 w-full rounded-xl border border-slate-200 px-3 text-[13.5px] font-bold text-slate-700" />
            {shipmentModalError && (<p className="mb-3 text-[12.5px] font-bold text-rose-600">{shipmentModalError}</p>)}
            <div className="flex gap-2">
              <button type="button" onClick={() => setShipmentModalOrder(null)} className="h-10 flex-1 rounded-xl bg-slate-100 text-[12.5px] font-bold text-slate-600">إلغاء</button>
              <button type="button" disabled={isSubmittingShipment} onClick={submitShipmentToggle} className="h-10 flex-1 rounded-xl bg-slate-900 text-[12.5px] font-bold text-white disabled:opacity-60">
                {isSubmittingShipment ? "..." : "تأكيد وإنشاء الحجز"}
              </button>
            </div>
          </div>
        </div>
      )}
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
function OrderCreateModal({
  customers,
  deliveryCompanies,
  inventoryItems,
  isSaving,
  errorMessage,
  onClose,
  onSave,
}: {
  customers: ApiOrderCustomerOption[];
  deliveryCompanies: DeliveryCompanyOption[];
  inventoryItems: ApiInventoryItem[];
  isSaving: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onSave: (draft: OrderFormDraft) => void;
}) {
  const [draft, setDraft] = useState<OrderFormDraft>({ customerId: "", title: "", amount: 0, priority: "متوسطة", dueDate: "", owner: "", notes: "", origin: "", destination: "", serviceType: "domestic", packageCount: 1, deliveryCompanyId: "", recipientName: "", recipientPhone: "", recipientAddress: "", deliveryMethod: "internal", inventoryItemId: "", quantity: 1 });
  const [activeTab, setActiveTab] = useState<"order" | "shipping" | "schedule">("order");
  const canSave = draft.customerId !== "" && draft.title.trim().length > 2 && draft.amount > 0 && draft.dueDate.length > 0 && draft.owner.trim().length > 1 && draft.origin.trim().length > 0 && draft.destination.trim().length > 0 && !isSaving;
  const update = <K extends keyof OrderFormDraft>(key: K, value: OrderFormDraft[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const tabs: Array<{ key: "order" | "shipping" | "schedule"; label: string; icon: LucideIcon; tint: string }> = [
    { key: "order", label: "الطلب والعميل", icon: ClipboardList, tint: "#1f2937" },
    { key: "shipping", label: "الشحن وشركة التوصيل", icon: Truck, tint: "#0369a1" },
    { key: "schedule", label: "الجدولة والمسؤول", icon: UserCog, tint: "#b45309" },
  ];
  return (
    <div className="calm-add-backdrop px-4 py-6">
      <div className="calm-add-card max-h-[92vh] w-full max-w-2xl overflow-y-auto">
        <div className="calm-add-header sticky top-0 z-10 flex items-center justify-between border-b px-5 py-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#237c82] text-white shadow-lg"><ClipboardList size={18} /></span>
            <div>
              <h2 className="text-[18.5px] font-black text-slate-900">إنشاء طلب جديد</h2>
              <p className="mt-0.5 text-[11.5px] font-bold text-slate-400">البيانات هنا تُستخدم لاحقًا لإنشاء الحجز والشحنة تلقائيًا</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition hover:bg-slate-200"><X size={16} /></button>
        </div>
        <div className="space-y-4 p-5">
          {errorMessage && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-[12.5px] font-bold text-red-600">{errorMessage}</div>
          )}

          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-[#1b5f64] to-[#2f9e93] p-5 text-white">
            <p className="mb-4 text-[11.5px] font-black text-white/70">مسار الشحنة</p>
            <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col items-center gap-1">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15"><MapPin size={15} /></span>
                <p className="max-w-[90px] truncate text-[11.5px] font-bold">{draft.origin || "نقطة الانطلاق"}</p>
              </div>
              <div className="flex flex-1 items-center">
                <div className="h-0 flex-1 border-t-2 border-dashed border-white/40" />
                <Truck size={16} className="mx-2 shrink-0 animate-pulse" />
                <div className="h-0 flex-1 border-t-2 border-dashed border-white/40" />
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15"><MapPin size={15} /></span>
                <p className="max-w-[90px] truncate text-[11.5px] font-bold">{draft.destination || "الوجهة"}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 rounded-2xl bg-slate-100 p-1.5">
            {tabs.map((tab) => {
              const TabIcon = tab.icon;
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-[12px] font-black transition"
                  style={active ? { background: tab.tint, color: "#fff", boxShadow: "0 8px 18px " + tab.tint + "40" } : { color: "#64748b" }}
                >
                  <TabIcon size={13} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {activeTab === "order" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-[12.5px] font-bold text-slate-600">العميل</span>
                <select value={draft.customerId} onChange={(event) => update("customerId", event.target.value ? Number(event.target.value) : "")} className="h-11 w-full rounded-xl border border-slate-200 bg-neutral-50 px-3 text-[12.5px] outline-none">
                  <option value="">اختر العميل...</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>{customer.name}</option>
                  ))}
                </select>
              </label>
              <div className="sm:col-span-2"><Field label="عنوان الطلب" value={draft.title} onChange={(value) => update("title", value)} placeholder="مثال: توريد وربط أجهزة الشبكة" required /></div>
              <label className="block"><span className="mb-2 block text-[12.5px] font-bold text-slate-600">قيمة الطلب</span><input type="number" min="0" value={draft.amount || ""} onChange={(event) => update("amount", Number(event.target.value))} className="h-11 w-full rounded-xl border border-slate-200 bg-neutral-50 px-3 text-[12.5px] outline-none" placeholder="0" /></label>
              <label className="block"><span className="mb-2 block text-[12.5px] font-bold text-slate-600">الأولوية</span><select value={draft.priority} onChange={(event) => update("priority", event.target.value as OrderRecord["priority"])} className="h-11 w-full rounded-xl border border-slate-200 bg-neutral-50 px-3 text-[12.5px] outline-none"><option value="عالية">عالية</option><option value="متوسطة">متوسطة</option><option value="عادية">عادية</option></select></label>
              <div className="sm:col-span-2 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3">
                <p className="mb-2 text-[11.5px] font-black text-slate-500">حجز من المخزون (اختياري)</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <select value={draft.inventoryItemId} onChange={(event) => update("inventoryItemId", event.target.value ? Number(event.target.value) : "")} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-[12.5px] outline-none">
                    <option value="">بدون ربط بصنف محدد</option>
                    {inventoryItems.filter((item) => !draft.customerId || item.customer_id === draft.customerId).map((item) => (
                      <option key={item.id} value={item.id} disabled={item.quantity <= 0}>{item.name} — متوفر: {item.quantity}</option>
                    ))}
                  </select>
                  <input type="number" min="1" disabled={!draft.inventoryItemId} value={draft.quantity} onChange={(event) => update("quantity", Number(event.target.value) || 1)} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-[12.5px] outline-none disabled:opacity-50" placeholder="الكمية" />
                </div>
              </div>
              <label className="block sm:col-span-2"><span className="mb-2 block text-[12.5px] font-bold text-slate-600">ملاحظات</span><textarea value={draft.notes} onChange={(event) => update("notes", event.target.value)} rows={3} className="w-full rounded-xl border border-slate-200 bg-neutral-50 p-3 text-[12.5px] outline-none" placeholder="تفاصيل إضافية عن الطلب..." /></label>
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="نقطة الانطلاق" value={draft.origin} onChange={(value) => update("origin", value)} placeholder="مثال: الرياض" required />
              <Field label="الوجهة" value={draft.destination} onChange={(value) => update("destination", value)} placeholder="مثال: جدة" required />
              <label className="block"><span className="mb-2 block text-[12.5px] font-bold text-slate-600">نوع الخدمة</span><select value={draft.serviceType} onChange={(event) => update("serviceType", event.target.value as OrderFormDraft["serviceType"])} className="h-11 w-full rounded-xl border border-slate-200 bg-neutral-50 px-3 text-[12.5px] outline-none"><option value="domestic">محلي</option><option value="international">دولي</option></select></label>
              <label className="block"><span className="mb-2 block text-[12.5px] font-bold text-slate-600">عدد الطرود</span><input type="number" min="1" value={draft.packageCount || ""} onChange={(event) => update("packageCount", Number(event.target.value) || 1)} className="h-11 w-full rounded-xl border border-slate-200 bg-neutral-50 px-3 text-[12.5px] outline-none" placeholder="1" /></label>
              <div className="sm:col-span-2 mt-1 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3">
                <p className="mb-2 text-[11.5px] font-black text-slate-500">بيانات المستلم (الشخص الذي سيستلم الطلب)</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="اسم المستلم" value={draft.recipientName} onChange={(value) => update("recipientName", value)} placeholder="مثال: محمد أحمد" />
                  <Field label="جوال المستلم" value={draft.recipientPhone} onChange={(value) => update("recipientPhone", value)} placeholder="05xxxxxxxx" />
                  <div className="sm:col-span-2"><Field label="عنوان المستلم" value={draft.recipientAddress} onChange={(value) => update("recipientAddress", value)} placeholder="الحي، الشارع، تفاصيل إضافية" /></div>
                </div>
              </div>
              <div className="sm:col-span-2">
                <span className="mb-2 block text-[12.5px] font-bold text-slate-600">طريقة التوصيل</span>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => update("deliveryMethod", "internal")} className={`h-11 rounded-xl border text-[12.5px] font-bold transition ${draft.deliveryMethod === "internal" ? "border-[#237c82] bg-[#eaf5f4] text-[#237c82]" : "border-slate-200 bg-neutral-50 text-slate-500"}`}>أسطول إرتكاز</button>
                  <button type="button" onClick={() => update("deliveryMethod", "external")} className={`h-11 rounded-xl border text-[12.5px] font-bold transition ${draft.deliveryMethod === "external" ? "border-[#237c82] bg-[#eaf5f4] text-[#237c82]" : "border-slate-200 bg-neutral-50 text-slate-500"}`}>شركة توصيل خارجية</button>
                </div>
              </div>
              {draft.deliveryMethod === "external" && (
                <label className="block sm:col-span-2">
                  <span className="mb-2 block text-[12.5px] font-bold text-slate-600">شركة التوصيل</span>
                  <select value={draft.deliveryCompanyId} onChange={(event) => update("deliveryCompanyId", event.target.value ? Number(event.target.value) : "")} className="h-11 w-full rounded-xl border border-slate-200 bg-neutral-50 px-3 text-[12.5px] outline-none">
                    <option value="">اختيار تلقائي (الأنسب سعرًا)</option>
                    {deliveryCompanies.filter((company) => !company.is_internal_fleet).map((company) => (
                      <option key={company.id} value={company.id}>{company.name}</option>
                    ))}
                  </select>
                </label>
              )}
            </div>
          )}

          {activeTab === "schedule" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="المسؤول" value={draft.owner} onChange={(value) => update("owner", value)} placeholder="اسم المسؤول عن الطلب" required />
              <label className="block"><span className="mb-2 block text-[12.5px] font-bold text-slate-600">تاريخ الاستحقاق</span><input type="date" value={draft.dueDate} onChange={(event) => update("dueDate", event.target.value)} className="h-11 w-full rounded-xl border border-slate-200 bg-neutral-50 px-3 text-[12.5px] outline-none" /></label>
            </div>
          )}
        </div>
        <div className="calm-add-footer flex justify-end gap-2 border-t p-5"><button type="button" onClick={onClose} className="h-10 rounded-xl border border-slate-200 px-4 text-[12.5px] font-bold text-slate-600">إلغاء</button><button type="button" disabled={!canSave} onClick={() => onSave(draft)} className="h-10 rounded-xl bg-[#237c82] px-5 text-[12.5px] font-bold text-white shadow-[0_10px_25px_rgba(35,124,130,.18)] disabled:opacity-40">{isSaving ? "جاري الحفظ..." : "حفظ الطلب"}</button></div>
      </div>
    </div>
  );
}
const mapApiUser = (apiUser: {
  id: string; name: string; email: string; phone: string; role: string;
  department: string; status: string; permissions: string[];
  last_active: string; joined_at: string;
}): UserRecord => ({
  id: apiUser.id,
  name: apiUser.name,
  email: apiUser.email,
  password: "",
  phone: apiUser.phone,
  role: apiUser.role as UserRecord["role"],
  department: apiUser.department,
  status: apiUser.status as UserRecord["status"],
  lastActive: apiUser.last_active,
  joinedAt: apiUser.joined_at,
  permissions: apiUser.permissions,
});

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
  const roleColors: Record<UserRecord["role"], string> = {
    "مدير النظام": "#236c83",
    "محاسب": "#7c5a9e",
    "مبيعات": "#2563eb",
    "خدمة عملاء": "#c98a2e",
    "مخزون": "#1f9d76",
    "مشاهد": "#64748b",
  };

  useEffect(() => {
    setPasswordDraft(selected?.password ?? "");
    setShowCredential(false);
  }, [selectedId, selected?.password]);

  const visibleUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return users.filter((user) => (roleFilter === "الكل" || user.role === roleFilter) && (!query || `${user.name} ${user.email} ${user.department} ${user.role}`.toLowerCase().includes(query)));
  }, [users, search, roleFilter]);

  const toggleStatus = async (userId: string) => {
    if (userId === currentUser.id) return;
    const target = users.find((user) => user.id === userId);
    if (!target) return;
    const nextStatus = target.status === "نشط" ? "موقوف" : "نشط";
    const token = window.localStorage.getItem("ertikaz-token");
    if (!token) return;
    try {
      const res = await fetch(`/backend/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) return;
      const data = await res.json();
      setUsers((current) => current.map((user) => (user.id === userId ? mapApiUser(data) : user)));
    } catch (error) {
      console.error("toggleStatus error:", error);
    }
  };

  const togglePermission = async (userId: string, permission: string) => {
    const target = users.find((user) => user.id === userId);
    if (!target) return;
    const nextPermissions = target.permissions.includes(permission)
      ? target.permissions.filter((item) => item !== permission)
      : [...target.permissions, permission];
    const token = window.localStorage.getItem("ertikaz-token");
    if (!token) return;
    try {
      const res = await fetch(`/backend/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ permissions: nextPermissions }),
      });
      if (!res.ok) return;
      const data = await res.json();
      setUsers((current) => current.map((user) => (user.id === userId ? mapApiUser(data) : user)));
    } catch (error) {
      console.error("togglePermission error:", error);
    }
  };

  const addUser = async (draft: UserDraft) => {
    const defaultPermissions: Record<UserRecord["role"], string[]> = {
      "مدير النظام": ["لوحة التحكم", "العملاء", "الطلبات", "الفواتير", "المدفوعات", "الشحنات", "المخزون", "التقارير", "المستخدمون"],
      "محاسب": ["الفواتير", "المدفوعات", "التقارير"],
      "مبيعات": ["العملاء", "الطلبات", "الفواتير"],
      "خدمة عملاء": ["العملاء", "الطلبات", "الشحنات"],
      "مخزون": ["الطلبات", "الشحنات", "المخزون"],
      "مشاهد": ["لوحة التحكم", "التقارير"],
    };
    const token = window.localStorage.getItem("ertikaz-token");
    if (!token) return;
    try {
      const createRes = await fetch("/backend/users/", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: draft.name,
          email: draft.email,
          password: draft.password,
          phone: draft.phone,
          role: draft.role,
          department: draft.department,
          status: draft.status,
        }),
      });
      if (!createRes.ok) {
        const errData = await createRes.json().catch(() => null);
        let message = "تعذر إنشاء المستخدم.";
        if (errData?.detail) {
          if (typeof errData.detail === "string") {
            message = errData.detail;
          } else if (Array.isArray(errData.detail) && errData.detail[0]?.msg) {
            message = String(errData.detail[0].msg).replace(/^Value error,\s*/, "");
          }
        }
        window.alert(message);
        return;
      }
      const createdRaw = await createRes.json();
      const permRes = await fetch(`/backend/users/${createdRaw.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ permissions: defaultPermissions[draft.role] }),
      });
      const finalRaw = permRes.ok ? await permRes.json() : createdRaw;
      const next = mapApiUser(finalRaw);
      setUsers((current) => [next, ...current]);
      setSelectedId(next.id);
      setShowCreate(false);
    } catch (error) {
      console.error("addUser error:", error);
      window.alert("تعذر الاتصال بالخادم.");
    }
  };

  const savePassword = async () => {
    if (!selected || passwordDraft.trim().length < 6) return;
    const token = window.localStorage.getItem("ertikaz-token");
    if (!token) return;
    try {
      const res = await fetch(`/backend/users/${selected.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ password: passwordDraft }),
      });
      if (!res.ok) return;
      const data = await res.json();
      setUsers((current) => current.map((user) => (user.id === selected.id ? mapApiUser(data) : user)));
    } catch (error) {
      console.error("savePassword error:", error);
    }
  };

  const roles: Array<"الكل" | UserRecord["role"]> = ["الكل", "مدير النظام", "محاسب", "مبيعات", "خدمة عملاء", "مخزون", "مشاهد"];

  return (
    <>
      <WorkspaceHeader eyebrow="USERS" title="المستخدمون" description="" icon={Users} accent={{ bar: "#eaf0f4", border: "#d3e1e9", stripe: "#3e7a94", icon: "#3e7a94" }} action={<button type="button" onClick={() => setShowCreate(true)} className="inline-flex h-10 items-center gap-2 rounded-xl bg-slate-900 px-4 text-[12.5px] font-bold text-white shadow-lg"><UserPlus size={14} />إضافة مستخدم</button>} />

      <section className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MiniStat label="إجمالي المستخدمين" value={String(users.length)} icon={Users} tone="bg-sky-50 text-sky-700" note="حسابات دخول فعلية" />
        <MiniStat label="مستخدمون نشطون" value={String(users.filter((user) => user.status === "نشط").length)} icon={CheckCircle2} tone="bg-emerald-50 text-emerald-700" note="يمكنهم تسجيل الدخول" />
        <MiniStat label="حسابات متوقفة" value={String(users.filter((user) => user.status === "موقوف").length)} icon={ShieldAlert} tone="bg-amber-50 text-amber-700" note="لا يمكنها الدخول" />
        <MiniStat label="أدوار مستخدمة" value={String(new Set(users.map((user) => user.role)).size)} icon={ShieldCheck} tone="bg-[#e6f1f8] text-[#2d75a3]" note="صلاحيات مختلفة" />
      </section>

      <Surface className="overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:p-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1">{roles.map((role) => <button key={role} type="button" onClick={() => setRoleFilter(role)} className={`shrink-0 rounded-xl px-3.5 py-2 text-[11.5px] font-bold transition ${roleFilter === role ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>{role}</button>)}</div>
          <div className="relative w-full xl:w-72"><Search size={14} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ابحث باسم أو بريد أو دور..." className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pr-10 pl-3 text-[12.5px] outline-none focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100" /></div>
        </div>

        <div className="hidden overflow-x-auto lg:block">
          <table className="w-full min-w-[980px] text-right"><thead><tr className="border-b border-slate-100 bg-slate-50/70 text-[11.5px] font-bold text-slate-400"><th className="px-5 py-3">المستخدم</th><th className="px-4 py-3">بيانات الدخول</th><th className="px-4 py-3">الدور والقسم</th><th className="px-4 py-3">الحالة</th><th className="px-4 py-3">آخر نشاط</th><th className="px-5 py-3">الإجراءات</th></tr></thead>
            <tbody>{visibleUsers.map((user) => <tr key={user.id} className="border-b border-slate-100/80 transition hover:bg-sky-50/30"><td className="px-5 py-4"><div className="flex items-center gap-3"><span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-[13.5px] font-bold text-white" style={{ background: roleColors[user.role] }}>{user.name.slice(0, 1)}<span className={`absolute -bottom-0.5 -left-0.5 h-3 w-3 rounded-full ring-2 ring-white ${user.status === "نشط" ? "bg-emerald-500" : "bg-slate-300"}`} /></span><div><p className="text-[13.5px] font-bold text-slate-900">{user.name}</p><p className="mt-1 text-[11.5px] font-medium text-slate-400">{user.id}</p></div></div></td><td className="px-4 py-4"><p className="text-[12.5px] font-bold text-slate-700">{user.email}</p><p className="mt-1 text-[11.5px] tracking-[.18em] text-slate-400">••••••••</p></td><td className="px-4 py-4"><p className="text-[12.5px] font-bold text-slate-700">{user.role}</p><p className="mt-1 text-[11.5px] text-slate-400">{user.department}</p></td><td className="px-4 py-4"><span className={`rounded-full px-3 py-1.5 text-[10.5px] font-bold ring-1 ${statusTone(user.status)}`}>{user.status}</span></td><td className="px-4 py-4 text-[11.5px] font-medium text-slate-500">{user.lastActive}</td><td className="px-5 py-4"><div className="flex items-center gap-1.5"><ActionIcon label="بيانات الحساب والصلاحيات" icon={Eye} onClick={() => setSelectedId(user.id)} /><ActionIcon label={user.id === currentUser.id ? "لا يمكن إيقاف حسابك الحالي" : user.status === "نشط" ? "إيقاف الحساب" : "تفعيل الحساب"} icon={user.status === "نشط" ? X : Check} active={user.status === "نشط"} disabled={user.id === currentUser.id} onClick={() => toggleStatus(user.id)} /><ActionIcon label="إرسال رسالة" icon={Mail} onClick={() => { if (typeof window !== "undefined") window.location.href = `mailto:${user.email}`; }} /></div></td></tr>)}</tbody>
          </table>
        </div>

        <div className="grid gap-3 p-4 sm:grid-cols-2 lg:hidden">{visibleUsers.map((user) => <article key={user.id} className="rounded-[22px] border border-slate-100 bg-slate-50 p-4"><div className="flex items-start justify-between"><div className="flex items-center gap-3"><span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-[13.5px] font-bold text-white" style={{ background: roleColors[user.role] }}>{user.name.slice(0, 1)}<span className={`absolute -bottom-0.5 -left-0.5 h-3 w-3 rounded-full ring-2 ring-white ${user.status === "نشط" ? "bg-emerald-500" : "bg-slate-300"}`} /></span><div><p className="text-[13.5px] font-bold text-slate-900">{user.name}</p><p className="mt-1 text-[11.5px] text-slate-400">{user.role}</p></div></div><span className={`rounded-full px-3 py-1 text-[10.5px] font-bold ring-1 ${statusTone(user.status)}`}>{user.status}</span></div><p className="mt-4 text-[11.5px] font-medium text-slate-500">{user.email}</p><div className="mt-4 flex items-center gap-2"><ActionIcon label="التفاصيل" icon={Eye} onClick={() => setSelectedId(user.id)} /><ActionIcon label="تغيير الحالة" icon={user.status === "نشط" ? X : Check} active={user.status === "نشط"} disabled={user.id === currentUser.id} onClick={() => toggleStatus(user.id)} /></div></article>)}</div>
      </Surface>

      {selected && <DetailPanel title={selected.name} subtitle={`${selected.role} · ${selected.department}`} icon={UserCog} onClose={() => setSelectedId(null)}>
        <div className="rounded-[22px] bg-[#f8fcfb] p-5"><div className="flex items-center gap-4"><span className="relative flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-bold text-white" style={{ background: roleColors[selected.role] }}>{selected.name.slice(0, 1)}<span className={`absolute -bottom-0.5 -left-0.5 h-4 w-4 rounded-full ring-2 ring-white ${selected.status === "نشط" ? "bg-emerald-500" : "bg-slate-300"}`} /></span><div><h3 className="text-[18.5px] font-bold text-slate-900">{selected.name}</h3><p className="mt-1 text-[12.5px] text-slate-500">{selected.email}</p><span className={`mt-2 inline-flex rounded-full px-3 py-1 text-[10.5px] font-bold ring-1 ${statusTone(selected.status)}`}>{selected.status}</span></div></div></div>
        <InfoGrid items={[{ label: "رقم الجوال", value: selected.phone }, { label: "تاريخ الانضمام", value: selected.joinedAt }, { label: "آخر نشاط", value: selected.lastActive }, { label: "القسم", value: selected.department }]} />
        <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50 p-4"><div className="flex items-center justify-between"><div><p className="text-[11.5px] font-bold text-slate-500">بيانات تسجيل الدخول</p><p className="mt-1 text-[11.5px] font-medium text-slate-400">يمكن للمستخدم الدخول بهذه البيانات عندما يكون الحساب نشطًا.</p></div><button type="button" onClick={() => setShowCredential((value) => !value)} className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-slate-500">{showCredential ? <EyeOff size={14} /> : <Eye size={14} />}</button></div><div className="mt-4 space-y-3"><div className="rounded-xl bg-white p-3"><p className="text-[10.5px] font-medium text-slate-400">البريد الإلكتروني</p><p className="mt-1 text-[12.5px] font-bold text-slate-800">{selected.email}</p></div><label className="block"><span className="mb-2 block text-[10.5px] font-medium text-slate-400">رمز الدخول</span><input type={showCredential ? "text" : "password"} value={passwordDraft} onChange={(event) => setPasswordDraft(event.target.value)} className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-[12.5px] font-medium text-slate-800 outline-none focus:border-[#9bb4be]" /></label><button type="button" disabled={passwordDraft.trim().length < 6 || passwordDraft === selected.password} onClick={savePassword} className="h-10 w-full rounded-xl bg-slate-900 text-[11.5px] font-bold text-white disabled:opacity-35">حفظ رمز الدخول الجديد</button></div></div>
        <div className="mt-5"><div className="mb-3 flex items-center justify-between"><h4 className="text-[13.5px] font-bold text-slate-900">الصلاحيات</h4><span className="text-[11.5px] text-slate-400">اضغطي للتفعيل أو الإلغاء</span></div><div className="grid grid-cols-2 gap-2">{["لوحة التحكم", "العملاء", "الطلبات", "الفواتير", "المدفوعات", "الشحنات", "المخزون", "التقارير", "المستخدمون"].map((permission) => { const active = selected.permissions.includes(permission); return <button key={permission} type="button" onClick={() => togglePermission(selected.id, permission)} className={`flex items-center justify-between rounded-xl border p-3 text-[11.5px] font-bold transition ${active ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-500"}`}><span>{permission}</span>{active ? <Check size={12} /> : <Plus size={12} />}</button>; })}</div></div>
        <button type="button" disabled={selected.id === currentUser.id} onClick={() => toggleStatus(selected.id)} className={`mt-5 h-11 w-full rounded-xl text-[12.5px] font-bold disabled:cursor-not-allowed disabled:opacity-35 ${selected.status === "نشط" ? "bg-amber-50 text-amber-700" : "bg-emerald-500 text-white"}`}>{selected.id === currentUser.id ? "هذا هو حسابك الحالي" : selected.status === "نشط" ? "إيقاف حساب المستخدم" : "تفعيل حساب المستخدم"}</button>
        <button type="button" disabled={selected.id === currentUser.id} onClick={() => { if (window.confirm("حذف هذا المستخدم؟")) { setUsers((current) => current.filter((user) => user.id !== selected.id)); setSelectedId(null); } }} className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 text-[12.5px] font-bold text-red-600 disabled:opacity-35"><Trash2 size={14} /> حذف المستخدم</button>
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
        <div className="calm-add-header flex items-center justify-between border-b px-5 py-4"><div><h2 className="text-[19.5px] font-bold text-slate-900">إضافة مستخدم جديد</h2><p className="mt-1 text-[11.5px] font-medium text-slate-400">أنشئي حسابًا يمكن استخدامه مباشرة في شاشة الدخول.</p></div><button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500"><X size={16} /></button></div>
        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <Field label="الاسم الكامل" value={draft.name} onChange={(value) => update("name", value)} placeholder="اسم المستخدم" required />
          <div><Field label="البريد الإلكتروني" value={draft.email} onChange={(value) => update("email", value)} placeholder="name@company.com" required />{emailExists && <p className="mt-1 text-[10.5px] font-medium text-amber-700">البريد مستخدم بالفعل.</p>}</div>
          <label className="block"><span className="mb-2 block text-[12.5px] font-bold text-slate-600">رمز الدخول</span><div className="relative"><input type={showPassword ? "text" : "password"} value={draft.password} onChange={(event) => update("password", event.target.value)} placeholder="6 أحرف أو أرقام على الأقل" className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pl-11 text-[12.5px] font-medium text-slate-800 outline-none focus:border-[#9bb4be] focus:bg-white" /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute left-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl text-slate-400">{showPassword ? <EyeOff size={14} /> : <Eye size={14} />}</button></div></label>
          <Field label="رقم الجوال" value={draft.phone} onChange={(value) => update("phone", value)} placeholder="+966 5X XXX XXXX" required />
          <Field label="القسم" value={draft.department} onChange={(value) => update("department", value)} placeholder="مثال: المبيعات" required />
          <label className="block"><span className="mb-2 block text-[12.5px] font-bold text-slate-600">الدور</span><select value={draft.role} onChange={(event) => update("role", event.target.value as UserRecord["role"])} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-[12.5px] outline-none"><option>مدير النظام</option><option>محاسب</option><option>مبيعات</option><option>خدمة عملاء</option><option>مخزون</option><option>مشاهد</option></select></label>
          <label className="block"><span className="mb-2 block text-[12.5px] font-bold text-slate-600">حالة الحساب</span><select value={draft.status} onChange={(event) => update("status", event.target.value as UserRecord["status"])} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-[12.5px] outline-none"><option>نشط</option><option>دعوة معلقة</option><option>موقوف</option></select></label>
        </div>
        <div className="calm-add-footer flex justify-end gap-2 border-t p-5"><button type="button" onClick={onClose} className="h-10 rounded-xl border border-slate-200 px-4 text-[12.5px] font-bold text-slate-600">إلغاء</button><button type="button" disabled={!canSave} onClick={() => onSave(draft)} className="h-10 rounded-xl bg-[#237c82] px-5 text-[12.5px] font-bold text-white disabled:opacity-40">إنشاء حساب الدخول</button></div>
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
          className={`mb-5 flex items-center gap-2 rounded-2xl border p-4 text-[12.5px] font-bold ${
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
                  <span className="text-[12.5px] font-bold">{tab.label}</span>
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
                  <h3 className="text-[17.5px] font-bold text-slate-900">بيانات الحساب</h3>
                  <p className="mt-1 text-[11.5px] font-medium text-slate-400">حدّث بياناتك الأساسية المستخدمة داخل إرتكاز.</p>
                </div>
              </div>
              <div className="grid gap-4 p-5 sm:grid-cols-2">
                <Field label="الاسم الكامل" value={name} onChange={setName} placeholder="الاسم الكامل" required />
                <Field label="البريد الإلكتروني" value={email} onChange={setEmail} placeholder="name@company.com" required />
                <Field label="رقم الجوال" value={phone} onChange={setPhone} placeholder="+966 5X XXX XXXX" />
                <Field label="القسم" value={department} onChange={setDepartment} placeholder="الإدارة" />
                <div className="sm:col-span-2 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-[10.5px] font-medium text-slate-400">الدور الحالي</p>
                    <p className="mt-1 text-[13.5px] font-bold text-slate-800">{currentUser.role}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-[10.5px] font-medium text-slate-400">حالة الحساب</p>
                    <p className="mt-1 text-[13.5px] font-bold text-emerald-700">{currentUser.status}</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end border-t border-slate-100 p-5">
                <button
                  type="button"
                  onClick={saveProfile}
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-slate-900 px-5 text-[12.5px] font-bold text-white"
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
                  <h3 className="text-[17.5px] font-bold text-slate-900">تغيير كلمة المرور</h3>
                  <p className="mt-1 text-[11.5px] font-medium text-slate-400">استخدم كلمة مرور لا تقل عن 6 خانات.</p>
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
                  <span className="mb-2 block text-[12.5px] font-bold text-slate-600">كلمة المرور الحالية</span>
                  <input
                    type={showPasswords ? "text" : "password"}
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-[12.5px] outline-none focus:border-sky-300 focus:bg-white focus:ring-4 focus:ring-sky-100"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[12.5px] font-bold text-slate-600">كلمة المرور الجديدة</span>
                  <input
                    type={showPasswords ? "text" : "password"}
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-[12.5px] outline-none focus:border-violet-300 focus:bg-white focus:ring-4 focus:ring-violet-100"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-[12.5px] font-bold text-slate-600">تأكيد كلمة المرور الجديدة</span>
                  <input
                    type={showPasswords ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-[12.5px] outline-none focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                  />
                </label>
                <button
                  type="button"
                  onClick={changePassword}
                  className="inline-flex h-11 items-center gap-2 rounded-xl bg-slate-900 px-5 text-[12.5px] font-bold text-white"
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
                    <span className="mb-2 block text-[12.5px] font-bold text-slate-600">المستخدم</span>
                    <select
                      value={managedUserId}
                      onChange={(event) => setManagedUserId(event.target.value)}
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-[12.5px] outline-none focus:border-sky-300"
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
                      <span className="mb-2 block text-[12.5px] font-bold text-slate-600">الدور</span>
                      <select
                        value={managedUser.role}
                        onChange={(event) => updateManagedUser({ role: event.target.value as UserRecord["role"] })}
                        className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-[12.5px] outline-none"
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
                      <span className="mb-2 block text-[12.5px] font-bold text-slate-600">الحالة</span>
                      <select
                        value={managedUser.status}
                        disabled={managedUser.id === currentUser.id}
                        onChange={(event) => updateManagedUser({ status: event.target.value as UserRecord["status"] })}
                        className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-[12.5px] outline-none disabled:opacity-50"
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
                  <h3 className="text-[16.5px] font-bold text-slate-900">صلاحيات الوصول</h3>
                  <p className="mt-1 text-[11.5px] font-medium text-slate-400">فعّل أو أوقف الأقسام المتاحة لهذا المستخدم.</p>
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
                          <span className="text-[12.5px] font-bold">{permission}</span>
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
                    <h3 className="text-[15.5px] font-bold text-slate-900">لغة النظام</h3>
                    <p className="mt-1 text-[11.5px] font-medium text-slate-400">العربية والإنجليزية مع تغيير اتجاه الصفحة.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onToggleLanguage}
                  className="mt-5 h-11 w-full rounded-xl bg-sky-50 text-[12.5px] font-bold text-sky-700"
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
                    <h3 className="text-[15.5px] font-bold text-slate-900">مظهر النظام</h3>
                    <p className="mt-1 text-[11.5px] font-medium text-slate-400">وضع نهاري مشرق أو ليلي ملوّن ومريح.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onToggleTheme}
                  className="mt-5 h-11 w-full rounded-xl bg-[#e6f1f8] text-[12.5px] font-bold text-[#2d75a3]"
                >
                  {theme === "light" ? "تفعيل الوضع الليلي" : "تفعيل الوضع النهاري"}
                </button>
              </Surface>

              <Surface className="p-5 md:col-span-2">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl bg-sky-50 p-4">
                    <p className="text-[11.5px] font-medium text-sky-600">الجلسة الحالية</p>
                    <p className="mt-1 text-[13.5px] font-bold text-slate-800">{currentUser.email}</p>
                  </div>
                  <div className="rounded-2xl bg-emerald-50 p-4">
                    <p className="text-[11.5px] font-medium text-emerald-600">آخر نشاط</p>
                    <p className="mt-1 text-[13.5px] font-bold text-slate-800">{currentUser.lastActive}</p>
                  </div>
                  <div className="rounded-2xl bg-[#e6f1f8] p-4">
                    <p className="text-[11.5px] font-medium text-[#367fa9]">حالة الحساب</p>
                    <p className="mt-1 text-[13.5px] font-bold text-slate-800">{currentUser.status}</p>
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
            <h2 className="text-[18.5px] font-bold text-slate-900">إنشاء فاتورة جديدة</h2>
            <p className="mt-1 text-[11.5px] font-medium text-slate-400">أضيفي العميل والبنود ثم راجعي الإجمالي قبل الحفظ.</p>
          </div>
          <button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500"><X size={16} /></button>
        </div>

        <div className="invoice-create-scroll grid gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_280px]">
          <div className="space-y-5">
            <Surface className="p-5">
              <h3 className="text-[14.5px] font-bold text-slate-900">بيانات الفاتورة</h3>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="اسم العميل" value={draft.customer} onChange={(value) => setDraft((current) => ({ ...current, customer: value }))} placeholder="اسم العميل أو الشركة" required />
                <label className="block"><span className="mb-2 block text-[11.5px] font-bold text-slate-600">نوع العميل</span><select value={draft.customerType} onChange={(event) => setDraft((current) => ({ ...current, customerType: event.target.value as CustomerType }))} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-[12.5px] font-medium text-slate-800 outline-none focus:border-sky-300 focus:bg-white"><option value="company">شركة</option><option value="individual">فرد</option></select></label>
                <Field label="التصنيف" value={draft.category} onChange={(value) => setDraft((current) => ({ ...current, category: value }))} placeholder="خدمات تقنية" required />
                <label className="block"><span className="mb-2 block text-[11.5px] font-bold text-slate-600">تاريخ الإصدار</span><input type="date" value={draft.issueDate} onChange={(event) => setDraft((current) => ({ ...current, issueDate: event.target.value }))} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-[12.5px] font-medium text-slate-800 outline-none focus:border-sky-300 focus:bg-white" /></label>
                <label className="block"><span className="mb-2 block text-[11.5px] font-bold text-slate-600">تاريخ الاستحقاق</span><input type="date" value={draft.dueDate} onChange={(event) => setDraft((current) => ({ ...current, dueDate: event.target.value }))} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-[12.5px] font-medium text-slate-800 outline-none focus:border-sky-300 focus:bg-white" /></label>
              </div>
            </Surface>

            <Surface className="overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h3 className="text-[14.5px] font-bold text-slate-900">بنود الفاتورة</h3><p className="mt-1 text-[11.5px] font-medium text-slate-400">أضيفي خدمة أو منتجًا واحدًا أو أكثر.</p></div><button type="button" onClick={addLine} className="inline-flex h-9 items-center gap-2 rounded-xl bg-slate-900 px-3 text-[11.5px] font-bold text-white"><Plus size={12} /> إضافة بند</button></div>
              <div className="space-y-3 p-5">
                {draft.lines.map((line, index) => (
                  <div key={line.id} className="grid gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3 lg:grid-cols-[minmax(180px,1fr)_82px_118px_105px_44px] lg:items-end">
                    <Field label={`وصف البند ${index + 1}`} value={line.description} onChange={(value) => updateLine(line.id, "description", value)} placeholder="اسم الخدمة أو المنتج" required />
                    <label className="block"><span className="mb-2 block text-[11.5px] font-bold text-slate-600">الكمية</span><input type="number" min={1} value={line.quantity} onChange={(event) => updateLine(line.id, "quantity", Number(event.target.value))} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-[12.5px] font-medium outline-none" /></label>
                    <label className="block"><span className="mb-2 block text-[11.5px] font-bold text-slate-600">سعر الوحدة</span><input type="number" min={0} value={line.unitPrice} onChange={(event) => updateLine(line.id, "unitPrice", Number(event.target.value))} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-[12.5px] font-medium outline-none" /></label>
                    <div><p className="mb-2 text-[11.5px] font-bold text-slate-600">الإجمالي</p><div className="flex h-11 items-center rounded-xl bg-white px-3 text-[12.5px] font-bold text-slate-800">{formatCurrency(line.quantity * line.unitPrice)}</div></div>
                    <button type="button" onClick={() => removeLine(line.id)} disabled={draft.lines.length === 1} className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-400 disabled:opacity-30"><X size={14} /></button>
                  </div>
                ))}
              </div>
            </Surface>

            <label className="block"><span className="mb-2 block text-[11.5px] font-bold text-slate-600">ملاحظات</span><textarea value={draft.notes} onChange={(event) => setDraft((current) => ({ ...current, notes: event.target.value }))} rows={3} placeholder="شروط الدفع أو أي ملاحظات إضافية..." className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-[12.5px] font-medium text-slate-800 outline-none focus:border-sky-300 focus:bg-white" /></label>
          </div>

          <div className="space-y-4">
            <Surface className="p-5 lg:sticky lg:top-4">
              <p className="text-[11.5px] font-medium text-slate-400">ملخص الفاتورة</p>
              <p className="mt-2 text-[27.5px] font-bold text-slate-950">{formatCurrency(total)}</p>
              <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
                <div className="flex items-center justify-between text-[11.5px]"><span className="font-medium text-slate-500">عدد البنود</span><span className="font-bold text-slate-800">{draft.lines.length}</span></div>
                <div className="flex items-center justify-between text-[11.5px]"><span className="font-medium text-slate-500">الحالة</span><span className="rounded-full bg-[#e6f1f8] px-2.5 py-1 font-bold text-[#2d75a3]">مسودة</span></div>
                <div className="flex items-center justify-between text-[11.5px]"><span className="font-medium text-slate-500">الاستحقاق</span><span className="font-bold text-slate-800">{draft.dueDate}</span></div>
              </div>
              <button type="button" disabled={!canSave} onClick={() => onSave(draft)} className="mt-5 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 text-[12.5px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-35"><Check size={14} /> حفظ الفاتورة</button>
              <button type="button" onClick={onClose} className="mt-2 h-10 w-full rounded-xl border border-slate-200 text-[11.5px] font-bold text-slate-500">إلغاء</button>
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
  isSaving = false,
  errorMessage = null,
}: {
  onClose: () => void;
  onSave: (draft: AddCustomerDraft) => void;
  isSaving?: boolean;
  errorMessage?: string | null;
}) {
  const [draft, setDraft] = useState<AddCustomerDraft>(emptyDraft);

  const setField = <K extends keyof AddCustomerDraft>(
    field: K,
    value: AddCustomerDraft[K],
  ) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const cleanDigits = (value: string) => value.replace(/\s|-/g, "");
  const PHONE_RE = /^(?:\+?966|0)?5\d{8}$/;
  const NATIONAL_ID_RE = /^[12]\d{9}$/;
  const CR_RE = /^\d{10}$/;
  const TAX_NUMBER_RE = /^3\d{13}3$/;

  const phoneError =
    draft.phone.trim() && !PHONE_RE.test(cleanDigits(draft.phone))
      ? "رقم الجوال غير صحيح. مثال: 0512345678"
      : null;
  const nationalIdError =
    draft.type === "individual" &&
    draft.nationalId.trim() &&
    !NATIONAL_ID_RE.test(cleanDigits(draft.nationalId))
      ? "رقم الهوية يجب أن يكون 10 أرقام ويبدأ بـ 1 أو 2"
      : null;
  const vatNumberError =
    draft.type === "company" &&
    draft.vatNumber.trim() &&
    !TAX_NUMBER_RE.test(cleanDigits(draft.vatNumber))
      ? "الرقم الضريبي يجب أن يكون 15 رقمًا ويبدأ وينتهي بالرقم 3"
      : null;
  const commercialRegistrationError =
    draft.type === "company" &&
    draft.commercialRegistration.trim() &&
    !CR_RE.test(cleanDigits(draft.commercialRegistration))
      ? "السجل التجاري يجب أن يكون 10 أرقام"
      : null;

  const canSave =
    draft.name.trim() &&
    draft.phone.trim() &&
    !phoneError &&
    draft.city.trim() &&
    (draft.type === "individual"
      ? draft.nationalId.trim() && !nationalIdError
      : draft.vatNumber.trim() &&
        !vatNumberError &&
        draft.commercialRegistration.trim() &&
        !commercialRegistrationError);

  return (
    <div className="calm-add-backdrop px-4 py-6">
      <div className="calm-add-card max-h-[92vh] w-full max-w-3xl overflow-y-auto">
        <div className="calm-add-header sticky top-0 z-10 flex items-center justify-between border-b px-5 py-4 backdrop-blur">
          <div>
            <h2 className="text-base font-black text-slate-900">
              إضافة عميل جديد
            </h2>
            <p className="mt-1 text-[12.5px] font-semibold text-slate-400">
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
                  <p className="text-[15.5px] font-black text-slate-900">
                    عميل فرد
                  </p>
                  <p className="mt-1 text-[12.5px] font-semibold leading-5 text-slate-500">
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
                  <p className="text-[15.5px] font-black text-slate-900">شركة</p>
                  <p className="mt-1 text-[12.5px] font-semibold leading-5 text-slate-500">
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
            
              error={phoneError}
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
              
                error={nationalIdError}
              />
            ) : (
              <>
                <Field
                  label="الرقم الضريبي"
                  value={draft.vatNumber}
                  onChange={(value) => setField("vatNumber", value)}
                  placeholder="15 رقمًا"
                  required
                
                  error={vatNumberError}
                />
                <Field
                  label="السجل التجاري"
                  value={draft.commercialRegistration}
                  onChange={(value) =>
                    setField("commercialRegistration", value)
                  }
                  placeholder="رقم السجل التجاري"
                  required
                
                  error={commercialRegistrationError}
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

          {errorMessage && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13.5px] font-bold text-red-600">
              {errorMessage}
            </div>
          )}
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="h-11 rounded-xl border border-slate-200 px-5 text-[13.5px] font-black text-slate-600 disabled:opacity-50"
            >
              إلغاء
            </button>
            <button
              type="button"
              disabled={!canSave || isSaving}
              onClick={() => onSave(draft)}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#237c82] px-6 text-[13.5px] font-black text-white shadow-[0_10px_25px_rgba(35,124,130,.18)] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Check size={14} />
              {isSaving ? "جاري الحفظ..." : "حفظ وفتح ملف العميل"}
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
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  error?: string | null;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-1 text-[12.5px] font-black text-slate-600">
        {label}
        {required && <span className="text-[#8E704E]">*</span>}
      </span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`h-11 w-full rounded-xl border bg-neutral-50 px-4 text-[13.5px] font-semibold text-slate-800 outline-none transition placeholder:text-slate-300 focus:bg-neutral-100 focus:ring-4 ${
          error
            ? "border-red-400 focus:border-red-400 focus:ring-red-100"
            : "border-slate-200 focus:border-[#9CB5BF] focus:ring-[#DCE8EC]"
        }`}
      />
      {error && (
        <span className="mt-1 block text-[12.5px] font-bold text-red-500">
          {error}
        </span>
      )}
    </label>
  );
}
