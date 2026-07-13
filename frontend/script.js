/* ============================================================
   DATA
   ============================================================ */
 
const customers = [
    {
        id: 1,
        type: "company",
        name: "Al-Faisal Trading",
        phone: "0501234567",
        email: "info@alfaisal.com",
        location: "Riyadh — King Fahd Road",
        crNumber: "1010123456",
        taxNumber: "300012345600003",
        contactPerson: "Khalid Al-Faisal",
        status: "Active"
    },
    {
        id: 2,
        type: "company",
        name: "Riyadh Solutions",
        phone: "0559876543",
        email: "contact@riyadhsolutions.com",
        location: "Riyadh — Olaya District",
        crNumber: "1010988776",
        taxNumber: "300098765400003",
        contactPerson: "Sara Al-Qahtani",
        status: "Active"
    },
    {
        id: 3,
        type: "company",
        name: "Gulf Business Group",
        phone: "0531112222",
        email: "hello@gulfgroup.com",
        location: "Jeddah — Tahlia Street",
        crNumber: "1010556677",
        taxNumber: "300055667700003",
        contactPerson: "Omar Al-Harbi",
        status: "Active"
    },
    {
        id: 4,
        type: "individual",
        name: "Ahmed Al-Otaibi",
        phone: "0567891234",
        email: "ahmed.otaibi@example.com",
        location: "Riyadh — Al Malaz",
        nationalId: "1098765432",
        status: "Active"
    }
];
 
 
const invoices = [
    {
        number: "INV-1001",
        customer: "Al-Faisal Trading",
        amount: 10000,
        tax: 1500,
        total: 11500,
        status: "Paid"
    },
    {
        number: "INV-1002",
        customer: "Riyadh Solutions",
        amount: 7000,
        tax: 1050,
        total: 8050,
        status: "Pending"
    },
    {
        number: "INV-1003",
        customer: "Gulf Business Group",
        amount: 15000,
        tax: 2250,
        total: 17250,
        status: "Overdue"
    },
    {
        number: "INV-1004",
        customer: "Ahmed Al-Otaibi",
        amount: 1200,
        tax: 180,
        total: 1380,
        status: "Paid"
    }
];
 
 
const payments = [
    {
        id: 1,
        invoice: "INV-1001",
        customer: "Al-Faisal Trading",
        amount: 11500,
        method: "Bank Transfer",
        status: "Paid"
    },
    {
        id: 2,
        invoice: "INV-1002",
        customer: "Riyadh Solutions",
        amount: 4000,
        method: "Mada",
        status: "Partially Paid"
    },
    {
        id: 3,
        invoice: "INV-1004",
        customer: "Ahmed Al-Otaibi",
        amount: 1380,
        method: "Mada",
        status: "Paid"
    }
];
 
 
const companies = [
    {
        id: 1,
        name: "Aramex",
        phone: "920027447",
        email: "support@aramex.com",
        tracking: "aramex.com/track",
        internalPrice: 13,
        externalPrice: 35,
        handler: "company",
        status: "Active"
    },
    {
        id: 2,
        name: "SMSA Express",
        phone: "920009999",
        email: "info@smsaexpress.com",
        tracking: "smsaexpress.com/track",
        internalPrice: 10,
        externalPrice: 28,
        handler: "self",
        status: "Active"
    },
    {
        id: 3,
        name: "DHL",
        phone: "920003450",
        email: "support@dhl.com",
        tracking: "dhl.com/track",
        internalPrice: 20,
        externalPrice: 55,
        handler: "company",
        status: "Active"
    }
];
 
 
const shipments = [
    {
        tracking: "SHP-3001",
        customer: "Al-Faisal Trading",
        company: "Aramex",
        cost: 85,
        status: "Delivered"
    },
    {
        tracking: "SHP-3002",
        customer: "Riyadh Solutions",
        company: "SMSA Express",
        cost: 60,
        status: "In Transit"
    },
    {
        tracking: "SHP-3003",
        customer: "Gulf Business Group",
        company: "DHL",
        cost: 120,
        status: "Pending"
    },
    {
        tracking: "SHP-3004",
        customer: "Ahmed Al-Otaibi",
        company: "SMSA Express",
        cost: 35,
        status: "Delivered"
    }
];
 
 
const receipts = [
    {
        id: 1,
        shipment: "SHP-3001",
        recipient: "Ahmed Ali",
        date: "2026-07-10",
        status: "Completed"
    },
    {
        id: 2,
        shipment: "SHP-2995",
        recipient: "Mohammed Saeed",
        date: "2026-07-09",
        status: "Completed"
    }
];
 
 
const services = [
    {
        id: 1,
        name: "System Consultation",
        price: 1500,
        duration: "2 Hours",
        status: "Active"
    },
    {
        id: 2,
        name: "Technical Support",
        price: 800,
        duration: "1 Month",
        status: "Active"
    },
    {
        id: 3,
        name: "Software Maintenance",
        price: 2500,
        duration: "3 Months",
        status: "Active"
    }
];
 
 
const inventoryItems = [
    {
        sku: "PRD-001",
        name: "Office Printer",
        quantity: 12,
        price: 1250,
        status: "Available"
    },
    {
        sku: "PRD-002",
        name: "Laptop Stand",
        quantity: 4,
        price: 180,
        status: "Low Stock"
    },
    {
        sku: "PRD-003",
        name: "Wireless Keyboard",
        quantity: 0,
        price: 220,
        status: "Out of Stock"
    }
];
 
 
let currentPage = "dashboard";
let currentLanguage = "en";
let businessChart = null;
 
/* Remembers which record is open in each section's canvas */
const selectedRecord = {};
 
 
const pageInformation = {
    dashboard: {
        title: "Business Dashboard",
        subtitle: "Monitor your business performance and operational activities."
    },
    customers: {
        title: "Customers",
        subtitle: "Manage customer information and contact details."
    },
    invoices: {
        title: "Invoices",
        subtitle: "Manage customer invoices and payment status."
    },
    payments: {
        title: "Payments",
        subtitle: "Track payments received from customers."
    },
    "delivery-companies": {
        title: "Delivery Companies",
        subtitle: "Manage delivery partners, rates and handover terms."
    },
    shipments: {
        title: "Shipments",
        subtitle: "Track shipment operations and delivery status."
    },
    "delivery-receipts": {
        title: "Delivery Receipts",
        subtitle: "Document completed shipment deliveries."
    },
    services: {
        title: "Services",
        subtitle: "Manage company services and pricing."
    },
    inventory: {
        title: "Inventory",
        subtitle: "Manage inventory items and available quantities."
    }
};
 
 
const arabicMenu = [
    "لوحة التحكم",
    "العملاء",
    "الفواتير",
    "المدفوعات",
    "شركات التوصيل",
    "الشحنات",
    "إيصالات التسليم",
    "الخدمات",
    "المخزون"
];
 
 
const englishMenu = [
    "Dashboard",
    "Customers",
    "Invoices",
    "Payments",
    "Delivery Companies",
    "Shipments",
    "Delivery Receipts",
    "Services",
    "Inventory"
];
 
 
/* ============================================================
   NAVIGATION
   ============================================================ */
 
function setupNavigation() {
 
    const menuItems = document.querySelectorAll(".menu-item");
 
    menuItems.forEach(item => {
 
        item.addEventListener("click", function () {
 
            menuItems.forEach(button => {
                button.classList.remove("active");
            });
 
            this.classList.add("active");
 
            showPage(this.dataset.page);
        });
    });
}
 
 
function showPage(pageId) {
 
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active-page");
    });
 
    document.getElementById(pageId).classList.add("active-page");
 
    currentPage = pageId;
 
    updatePageHeader(pageId);
 
    document.getElementById("searchInput").value = "";
 
    renderSection(pageId);
}
 
 
function updatePageHeader(pageId) {
 
    document.getElementById("pageTitle").textContent =
        pageInformation[pageId].title;
 
    document.getElementById("pageSubtitle").textContent =
        pageInformation[pageId].subtitle;
}
 
 
function createStatus(status) {
 
    const className = status
        .toLowerCase()
        .replaceAll(" ", "-");
 
    return `
        <span class="status ${className}">
            ${status}
        </span>
    `;
}
 
 
function money(value) {
    return `SAR ${Number(value).toLocaleString()}`;
}
 
 
function initials(text) {
    return text.trim().charAt(0).toUpperCase();
}
 
 
/* ============================================================
   GENERIC DIRECTORY + CANVAS ENGINE
   Every section (customers, invoices, payments, delivery
   companies, shipments, receipts, services, inventory) is
   rendered as a "directory" list on the left and a "record
   canvas" on the right, instead of a plain stacked table.
   Clicking a directory row opens its full profile.
   ============================================================ */
 
const sectionRegistry = {};
 
function registerSection(key, config) {
    sectionRegistry[key] = config;
}
 
 
function renderSection(key) {
 
    const config = sectionRegistry[key];
 
    if (!config) {
        return;
    }
 
    renderDirectory(key, config.getData());
}
 
 
function renderDirectory(key, data) {
 
    const config = sectionRegistry[key];
    const directory = document.getElementById(`${key}Directory`);
 
    if (!directory) {
        return;
    }
 
    directory.innerHTML = "";
 
    if (data.length === 0) {
        directory.innerHTML = `<div class="directory-empty">No records found</div>`;
        renderCanvasEmpty(key);
        return;
    }
 
    data.forEach(item => {
 
        const id = config.getId(item);
        const row = document.createElement("div");
 
        row.className = "directory-item";
        row.dataset.id = id;
 
        if (String(selectedRecord[key]) === String(id)) {
            row.classList.add("active");
        }
 
        row.innerHTML = `
            <div class="directory-badge" style="background:${config.badgeColor(item)}">
                ${config.badgeText(item)}
            </div>
 
            <div class="directory-main">
                <div class="directory-title">${config.title(item)}</div>
                <div class="directory-sub">${config.subtitle(item)}</div>
            </div>
 
            <div class="directory-meta">
                <strong>${config.metaTop(item)}</strong>
                <span>${config.metaBottom(item)}</span>
            </div>
        `;
 
        row.addEventListener("click", () => {
            selectRecord(key, id);
        });
 
        directory.appendChild(row);
    });
 
    /* Keep or set the open record */
    const stillExists = data.some(
        item => String(config.getId(item)) === String(selectedRecord[key])
    );
 
    if (selectedRecord[key] && stillExists) {
        selectRecord(key, selectedRecord[key], false);
    } else {
        selectRecord(key, config.getId(data[0]));
    }
}
 
 
function selectRecord(key, id, refreshDirectory = true) {
 
    const config = sectionRegistry[key];
 
    selectedRecord[key] = id;
 
    if (refreshDirectory) {
 
        document
            .querySelectorAll(`#${key}Directory .directory-item`)
            .forEach(row => {
                row.classList.toggle(
                    "active",
                    String(row.dataset.id) === String(id)
                );
            });
    }
 
    const item = config
        .getData()
        .find(record => String(config.getId(record)) === String(id));
 
    const canvas = document.getElementById(`${key}Canvas`);
 
    if (!canvas) {
        return;
    }
 
    if (!item) {
        renderCanvasEmpty(key);
        return;
    }
 
    canvas.innerHTML = config.renderDetail(item);
 
    if (typeof config.afterRender === "function") {
        config.afterRender(item, canvas);
    }
}
 
 
function renderCanvasEmpty(key) {
 
    const canvas = document.getElementById(`${key}Canvas`);
 
    if (!canvas) {
        return;
    }
 
    canvas.innerHTML = `
        <div class="canvas-empty">
            <div class="canvas-empty-icon">◌</div>
            <strong>No record selected</strong>
            <p>Select an item from the list to see the full profile here.</p>
        </div>
    `;
}
 
 
function switchTab(key, id, tabName) {
 
    const canvas = document.getElementById(`${key}Canvas`);
 
    if (!canvas) {
        return;
    }
 
    canvas.querySelectorAll(".tab-button").forEach(button => {
        button.classList.toggle("active", button.dataset.tab === tabName);
    });
 
    canvas.querySelectorAll(".tab-panel").forEach(panel => {
        panel.classList.toggle("active", panel.dataset.tab === tabName);
    });
}
 
 
function miniList(rows, emptyLabel) {
 
    if (rows.length === 0) {
        return `<div class="mini-empty">${emptyLabel}</div>`;
    }
 
    return `<div class="mini-list">${rows.join("")}</div>`;
}
 
 
/* ============================================================
   CUSTOMERS
   ============================================================ */
 
function customerStats(customer) {
 
    const customerInvoices = invoices.filter(
        invoice => invoice.customer === customer.name
    );
 
    const customerPayments = payments.filter(
        payment => payment.customer === customer.name
    );
 
    const customerShipments = shipments.filter(
        shipment => shipment.customer === customer.name
    );
 
    const totalInvoiced = customerInvoices.reduce(
        (sum, invoice) => sum + invoice.total, 0
    );
 
    const totalPaid = customerPayments.reduce(
        (sum, payment) => sum + payment.amount, 0
    );
 
    return {
        customerInvoices,
        customerPayments,
        customerShipments,
        totalInvoiced,
        totalPaid
    };
}
 
 
function renderCustomerDetail(customer) {
 
    const {
        customerInvoices,
        customerPayments,
        customerShipments,
        totalInvoiced,
        totalPaid
    } = customerStats(customer);
 
    const typeLabel = customer.type === "company" ? "Company" : "Individual";
    const badgeColor = customer.type === "company"
        ? "linear-gradient(135deg,#7c3aed,#a78bfa)"
        : "linear-gradient(135deg,#2563eb,#60a5fa)";
 
    const overviewRows = [
        ["Phone", customer.phone],
        ["Email", customer.email],
        ["Location", customer.location || "—"]
    ];
 
    if (customer.type === "company") {
        overviewRows.push(
            ["Commercial Registration", customer.crNumber || "—"],
            ["VAT / Tax Number", customer.taxNumber || "—"],
            ["Contact Person", customer.contactPerson || "—"]
        );
    } else {
        overviewRows.push(["National ID", customer.nationalId || "—"]);
    }
 
    const invoiceRows = customerInvoices.map(invoice => `
        <div class="mini-row">
            <div>
                <strong>${invoice.number}</strong>
                <small>${money(invoice.total)}</small>
            </div>
            ${createStatus(invoice.status)}
        </div>
    `);
 
    const shipmentRows = customerShipments.map(shipment => `
        <div class="mini-row">
            <div>
                <strong>${shipment.tracking}</strong>
                <small>${shipment.company} · ${money(shipment.cost)}</small>
            </div>
            ${createStatus(shipment.status)}
        </div>
    `);
 
    const paymentRows = customerPayments.map(payment => `
        <div class="mini-row">
            <div>
                <strong>${money(payment.amount)}</strong>
                <small>${payment.invoice} · ${payment.method}</small>
            </div>
            ${createStatus(payment.status)}
        </div>
    `);
 
    return `
        <div class="canvas-header">
            <div class="canvas-avatar" style="background:${badgeColor}">
                ${initials(customer.name)}
            </div>
 
            <div class="canvas-title">
                <h2>
                    ${customer.name}
                    <span class="pill">${typeLabel}</span>
                </h2>
                <p>${createStatus(customer.status)}</p>
            </div>
 
            <div class="canvas-actions">
                <button class="action-button delete-button" onclick="deleteCustomer(${customer.id})">
                    Delete Customer
                </button>
            </div>
        </div>
 
        <div class="canvas-stats">
            <div class="canvas-stat">
                <span>Invoices</span>
                <strong>${customerInvoices.length}</strong>
            </div>
 
            <div class="canvas-stat">
                <span>Total Invoiced</span>
                <strong>${money(totalInvoiced)}</strong>
            </div>
 
            <div class="canvas-stat">
                <span>Total Paid</span>
                <strong>${money(totalPaid)}</strong>
            </div>
 
            <div class="canvas-stat">
                <span>Shipments</span>
                <strong>${customerShipments.length}</strong>
            </div>
        </div>
 
        <div class="tabs">
            <button class="tab-button active" data-tab="overview"
                onclick="switchTab('customers', ${customer.id}, 'overview')">
                Overview
            </button>
 
            <button class="tab-button" data-tab="invoices"
                onclick="switchTab('customers', ${customer.id}, 'invoices')">
                Invoices (${customerInvoices.length})
            </button>
 
            <button class="tab-button" data-tab="shipments"
                onclick="switchTab('customers', ${customer.id}, 'shipments')">
                Shipments (${customerShipments.length})
            </button>
 
            <button class="tab-button" data-tab="payments"
                onclick="switchTab('customers', ${customer.id}, 'payments')">
                Payments (${customerPayments.length})
            </button>
        </div>
 
        <div class="tab-panel active" data-tab="overview">
            <div class="detail-fields">
                ${overviewRows.map(([label, value]) => `
                    <div class="detail-field">
                        <span>${label}</span>
                        <strong>${value}</strong>
                    </div>
                `).join("")}
            </div>
        </div>
 
        <div class="tab-panel" data-tab="invoices">
            ${miniList(invoiceRows, "No invoices for this customer yet.")}
        </div>
 
        <div class="tab-panel" data-tab="shipments">
            ${miniList(shipmentRows, "No shipments for this customer yet.")}
        </div>
 
        <div class="tab-panel" data-tab="payments">
            ${miniList(paymentRows, "No payments recorded yet.")}
        </div>
    `;
}
 
 
registerSection("customers", {
    getData: () => customers,
    getId: item => item.id,
    badgeColor: item => item.type === "company"
        ? "linear-gradient(135deg,#7c3aed,#a78bfa)"
        : "linear-gradient(135deg,#2563eb,#60a5fa)",
    badgeText: item => initials(item.name),
    title: item => item.name,
    subtitle: item => item.type === "company"
        ? (item.contactPerson || item.email)
        : item.phone,
    metaTop: item => item.type === "company" ? "Company" : "Individual",
    metaBottom: item => item.status,
    renderDetail: renderCustomerDetail
});
 
 
function setupCustomerForm() {
 
    const form = document.getElementById("customerForm");
 
    document
        .getElementById("openCustomerForm")
        .addEventListener("click", () => {
            form.classList.remove("hidden");
        });
 
    document
        .getElementById("closeCustomerForm")
        .addEventListener("click", closeCustomerForm);
 
    document
        .getElementById("cancelCustomer")
        .addEventListener("click", closeCustomerForm);
 
    document
        .getElementById("saveCustomer")
        .addEventListener("click", addCustomer);
 
    document
        .querySelectorAll("#customerTypeSwitch button")
        .forEach(button => {
            button.addEventListener("click", () => {
                setCustomerFormType(button.dataset.type);
            });
        });
}
 
 
function setCustomerFormType(type) {
 
    document
        .querySelectorAll("#customerTypeSwitch button")
        .forEach(button => {
            button.classList.toggle("active", button.dataset.type === type);
        });
 
    document.getElementById("individualFields")
        .classList.toggle("hidden", type !== "individual");
 
    document.getElementById("companyFields")
        .classList.toggle("hidden", type !== "company");
 
    document.getElementById("customerForm").dataset.type = type;
}
 
 
function closeCustomerForm() {
 
    document
        .getElementById("customerForm")
        .classList.add("hidden");
}
 
 
function addCustomer() {
 
    const form = document.getElementById("customerForm");
    const type = form.dataset.type || "individual";
 
    const name = document.getElementById("customerName").value.trim();
    const phone = document.getElementById("customerPhone").value.trim();
    const email = document.getElementById("customerEmail").value.trim();
    const location = document.getElementById("customerLocation").value.trim();
 
    if (!name) {
        showToast("Customer name is required", true);
        return;
    }
 
    const newCustomer = {
        id: customers.length
            ? Math.max(...customers.map(customer => customer.id)) + 1
            : 1,
        type,
        name,
        phone: phone || "-",
        email: email || "-",
        location: location || "-",
        status: "Active"
    };
 
    if (type === "company") {
 
        newCustomer.crNumber = document.getElementById("customerCr").value.trim() || "-";
        newCustomer.taxNumber = document.getElementById("customerTax").value.trim() || "-";
        newCustomer.contactPerson = document.getElementById("customerContact").value.trim() || "-";
 
    } else {
 
        newCustomer.nationalId = document.getElementById("customerNationalId").value.trim() || "-";
    }
 
    customers.push(newCustomer);
 
    form.querySelectorAll("input").forEach(input => {
        input.value = "";
    });
 
    closeCustomerForm();
 
    selectedRecord.customers = newCustomer.id;
    renderDirectory("customers", customers);
 
    showToast("Customer added successfully");
}
 
 
function deleteCustomer(customerId) {
 
    const confirmed = confirm(
        "Are you sure you want to delete this customer?"
    );
 
    if (!confirmed) {
        return;
    }
 
    const customerIndex = customers.findIndex(
        customer => customer.id === customerId
    );
 
    if (customerIndex !== -1) {
        customers.splice(customerIndex, 1);
    }
 
    delete selectedRecord.customers;
    renderDirectory("customers", customers);
 
    showToast("Customer deleted successfully");
}
 
 
/* ============================================================
   INVOICES
   ============================================================ */
 
function renderInvoiceDetail(invoice) {
 
    return `
        <div class="canvas-header">
            <div class="canvas-avatar" style="background:linear-gradient(135deg,#7c3aed,#a78bfa)">▤</div>
 
            <div class="canvas-title">
                <h2>${invoice.number}</h2>
                <p>${invoice.customer}</p>
            </div>
        </div>
 
        <div class="canvas-stats">
            <div class="canvas-stat">
                <span>Subtotal</span>
                <strong>${money(invoice.amount)}</strong>
            </div>
 
            <div class="canvas-stat">
                <span>VAT (15%)</span>
                <strong>${money(invoice.tax)}</strong>
            </div>
 
            <div class="canvas-stat">
                <span>Total</span>
                <strong>${money(invoice.total)}</strong>
            </div>
 
            <div class="canvas-stat">
                <span>Status</span>
                <strong>${createStatus(invoice.status)}</strong>
            </div>
        </div>
 
        <div class="detail-fields">
            <div class="detail-field">
                <span>Customer</span>
                <strong>${invoice.customer}</strong>
            </div>
 
            <div class="detail-field">
                <span>Invoice Number</span>
                <strong>${invoice.number}</strong>
            </div>
        </div>
    `;
}
 
 
registerSection("invoices", {
    getData: () => invoices,
    getId: item => item.number,
    badgeColor: () => "linear-gradient(135deg,#7c3aed,#a78bfa)",
    badgeText: () => "▤",
    title: item => item.number,
    subtitle: item => item.customer,
    metaTop: item => money(item.total),
    metaBottom: item => item.status,
    renderDetail: renderInvoiceDetail
});
 
 
/* ============================================================
   PAYMENTS
   ============================================================ */
 
function renderPaymentDetail(payment) {
 
    return `
        <div class="canvas-header">
            <div class="canvas-avatar" style="background:linear-gradient(135deg,#16a34a,#4ade80)">◆</div>
 
            <div class="canvas-title">
                <h2>${money(payment.amount)}</h2>
                <p>${payment.customer}</p>
            </div>
        </div>
 
        <div class="detail-fields">
            <div class="detail-field">
                <span>Related Invoice</span>
                <strong>${payment.invoice}</strong>
            </div>
 
            <div class="detail-field">
                <span>Payment Method</span>
                <strong>${payment.method}</strong>
            </div>
 
            <div class="detail-field">
                <span>Status</span>
                <strong>${createStatus(payment.status)}</strong>
            </div>
        </div>
    `;
}
 
 
registerSection("payments", {
    getData: () => payments,
    getId: item => item.id,
    badgeColor: () => "linear-gradient(135deg,#16a34a,#4ade80)",
    badgeText: () => "◆",
    title: item => item.customer,
    subtitle: item => item.invoice,
    metaTop: item => money(item.amount),
    metaBottom: item => item.status,
    renderDetail: renderPaymentDetail
});
 
 
/* ============================================================
   DELIVERY COMPANIES
   Every company shows: internal delivery price, external
   delivery price, and who handles the handover (we deliver
   it ourselves, or the company picks it up from us).
   ============================================================ */
 
function setHandler(companyId, handler) {
 
    const company = companies.find(item => item.id === companyId);
 
    if (!company) {
        return;
    }
 
    company.handler = handler;
 
    selectRecord("delivery-companies", companyId);
    renderDirectory("delivery-companies", companies);
 
    showToast(`Handover method updated for ${company.name}`);
}
 
 
function renderCompanyDetail(company) {
 
    const companyShipments = shipments.filter(
        shipment => shipment.company === company.name
    );
 
    const shipmentRows = companyShipments.map(shipment => `
        <div class="mini-row">
            <div>
                <strong>${shipment.tracking}</strong>
                <small>${shipment.customer} · ${money(shipment.cost)}</small>
            </div>
            ${createStatus(shipment.status)}
        </div>
    `);
 
    return `
        <div class="canvas-header">
            <div class="canvas-avatar" style="background:linear-gradient(135deg,#0d9488,#2dd4bf)">
                ${initials(company.name)}
            </div>
 
            <div class="canvas-title">
                <h2>${company.name}</h2>
                <p>${createStatus(company.status)}</p>
            </div>
        </div>
 
        <div class="pricing-grid">
            <div class="pricing-box internal">
                <span>Internal Delivery (Riyadh)</span>
                <strong>${money(company.internalPrice)}</strong>
            </div>
 
            <div class="pricing-box external">
                <span>External Delivery (Other Cities)</span>
                <strong>${money(company.externalPrice)}</strong>
            </div>
 
            <div class="pricing-box handler">
                <span>Handover Method</span>
 
                <div class="segmented small">
                    <button
                        class="${company.handler === 'self' ? 'active' : ''}"
                        onclick="setHandler(${company.id}, 'self')">
                        We deliver to them
                    </button>
 
                    <button
                        class="${company.handler === 'company' ? 'active' : ''}"
                        onclick="setHandler(${company.id}, 'company')">
                        They pick up
                    </button>
                </div>
            </div>
        </div>
 
        <div class="detail-fields">
            <div class="detail-field">
                <span>Phone</span>
                <strong>${company.phone}</strong>
            </div>
 
            <div class="detail-field">
                <span>Email</span>
                <strong>${company.email}</strong>
            </div>
 
            <div class="detail-field">
                <span>Tracking URL</span>
                <strong>${company.tracking}</strong>
            </div>
        </div>
 
        <div class="panel-header inline-header">
            <h3>Shipments handled</h3>
        </div>
 
        ${miniList(shipmentRows, "No shipments handled by this company yet.")}
    `;
}
 
 
registerSection("delivery-companies", {
    getData: () => companies,
    getId: item => item.id,
    badgeColor: () => "linear-gradient(135deg,#0d9488,#2dd4bf)",
    badgeText: item => initials(item.name),
    title: item => item.name,
    subtitle: item => `Internal ${money(item.internalPrice)} · External ${money(item.externalPrice)}`,
    metaTop: item => item.handler === "self" ? "We deliver" : "They pick up",
    metaBottom: item => item.status,
    renderDetail: renderCompanyDetail
});
 
 
/* ============================================================
   SHIPMENTS
   ============================================================ */
 
function renderShipmentDetail(shipment) {
 
    return `
        <div class="canvas-header">
            <div class="canvas-avatar" style="background:linear-gradient(135deg,#ea580c,#fb923c)">➜</div>
 
            <div class="canvas-title">
                <h2>${shipment.tracking}</h2>
                <p>${shipment.customer}</p>
            </div>
        </div>
 
        <div class="detail-fields">
            <div class="detail-field">
                <span>Delivery Company</span>
                <strong>${shipment.company}</strong>
            </div>
 
            <div class="detail-field">
                <span>Shipping Cost</span>
                <strong>${money(shipment.cost)}</strong>
            </div>
 
            <div class="detail-field">
                <span>Status</span>
                <strong>${createStatus(shipment.status)}</strong>
            </div>
        </div>
    `;
}
 
 
registerSection("shipments", {
    getData: () => shipments,
    getId: item => item.tracking,
    badgeColor: () => "linear-gradient(135deg,#ea580c,#fb923c)",
    badgeText: () => "➜",
    title: item => item.tracking,
    subtitle: item => `${item.customer} · ${item.company}`,
    metaTop: item => money(item.cost),
    metaBottom: item => item.status,
    renderDetail: renderShipmentDetail
});
 
 
/* ============================================================
   DELIVERY RECEIPTS
   ============================================================ */
 
function renderReceiptDetail(receipt) {
 
    return `
        <div class="canvas-header">
            <div class="canvas-avatar" style="background:linear-gradient(135deg,#16a34a,#4ade80)">✓</div>
 
            <div class="canvas-title">
                <h2>${receipt.recipient}</h2>
                <p>${receipt.shipment}</p>
            </div>
        </div>
 
        <div class="detail-fields">
            <div class="detail-field">
                <span>Related Shipment</span>
                <strong>${receipt.shipment}</strong>
            </div>
 
            <div class="detail-field">
                <span>Delivery Date</span>
                <strong>${receipt.date}</strong>
            </div>
 
            <div class="detail-field">
                <span>Status</span>
                <strong>${createStatus(receipt.status)}</strong>
            </div>
        </div>
    `;
}
 
 
registerSection("delivery-receipts", {
    getData: () => receipts,
    getId: item => item.id,
    badgeColor: () => "linear-gradient(135deg,#16a34a,#4ade80)",
    badgeText: () => "✓",
    title: item => item.recipient,
    subtitle: item => item.shipment,
    metaTop: item => item.date,
    metaBottom: item => item.status,
    renderDetail: renderReceiptDetail
});
 
 
/* ============================================================
   SERVICES
   ============================================================ */
 
function renderServiceDetail(service) {
 
    return `
        <div class="canvas-header">
            <div class="canvas-avatar" style="background:linear-gradient(135deg,#7c3aed,#a78bfa)">⚙</div>
 
            <div class="canvas-title">
                <h2>${service.name}</h2>
                <p>${createStatus(service.status)}</p>
            </div>
        </div>
 
        <div class="detail-fields">
            <div class="detail-field">
                <span>Price</span>
                <strong>${money(service.price)}</strong>
            </div>
 
            <div class="detail-field">
                <span>Duration</span>
                <strong>${service.duration}</strong>
            </div>
        </div>
    `;
}
 
 
registerSection("services", {
    getData: () => services,
    getId: item => item.id,
    badgeColor: () => "linear-gradient(135deg,#7c3aed,#a78bfa)",
    badgeText: () => "⚙",
    title: item => item.name,
    subtitle: item => item.duration,
    metaTop: item => money(item.price),
    metaBottom: item => item.status,
    renderDetail: renderServiceDetail
});
 
 
/* ============================================================
   INVENTORY
   ============================================================ */
 
function renderInventoryDetail(item) {
 
    return `
        <div class="canvas-header">
            <div class="canvas-avatar" style="background:linear-gradient(135deg,#2563eb,#60a5fa)">
                ${initials(item.name)}
            </div>
 
            <div class="canvas-title">
                <h2>${item.name}</h2>
                <p>${item.sku}</p>
            </div>
        </div>
 
        <div class="canvas-stats">
            <div class="canvas-stat">
                <span>Quantity</span>
                <strong>${item.quantity}</strong>
            </div>
 
            <div class="canvas-stat">
                <span>Unit Price</span>
                <strong>${money(item.price)}</strong>
            </div>
 
            <div class="canvas-stat">
                <span>Status</span>
                <strong>${createStatus(item.status)}</strong>
            </div>
        </div>
    `;
}
 
 
registerSection("inventory", {
    getData: () => inventoryItems,
    getId: item => item.sku,
    badgeColor: () => "linear-gradient(135deg,#2563eb,#60a5fa)",
    badgeText: item => initials(item.name),
    title: item => item.name,
    subtitle: item => item.sku,
    metaTop: item => money(item.price),
    metaBottom: item => item.status,
    renderDetail: renderInventoryDetail
});
 
 
/* ============================================================
   SEARCH
   ============================================================ */
 
function setupSearch() {
 
    document
        .getElementById("searchInput")
        .addEventListener("input", function () {
 
            const value = this.value.toLowerCase();
            const config = sectionRegistry[currentPage];
 
            if (!config) {
                return;
            }
 
            const filtered = config.getData().filter(item => {
                const haystack = `
                    ${config.title(item)}
                    ${config.subtitle(item)}
                `.toLowerCase();
 
                return haystack.includes(value);
            });
 
            renderDirectory(currentPage, filtered);
        });
}
 
 
/* ============================================================
   PLACEHOLDER ADD BUTTONS (sections without a dedicated form)
   ============================================================ */
 
function setupPlaceholderButtons() {
 
    document
        .querySelectorAll(".page:not(#customers) .primary-button")
        .forEach(button => {
 
            button.addEventListener("click", () => {
                showToast("This form is on the way — coming soon");
            });
        });
}
 
 
/* ============================================================
   LANGUAGE
   ============================================================ */
 
function setupLanguage() {
 
    document
        .getElementById("languageButton")
        .addEventListener("click", toggleLanguage);
}
 
 
function toggleLanguage() {
 
    const html = document.documentElement;
    const menuTexts = document.querySelectorAll(".menu-text");
 
    if (currentLanguage === "en") {
 
        currentLanguage = "ar";
 
        html.lang = "ar";
        html.dir = "rtl";
 
        document.getElementById("languageButton").textContent = "English";
        document.getElementById("searchInput").placeholder = "بحث...";
 
        menuTexts.forEach((text, index) => {
            text.textContent = arabicMenu[index];
        });
 
        showToast("تم تغيير اللغة إلى العربية");
 
    } else {
 
        currentLanguage = "en";
 
        html.lang = "en";
        html.dir = "ltr";
 
        document.getElementById("languageButton").textContent = "العربية";
        document.getElementById("searchInput").placeholder = "Search...";
 
        menuTexts.forEach((text, index) => {
            text.textContent = englishMenu[index];
        });
 
        showToast("Language changed to English");
    }
}
 
 
/* ============================================================
   TOAST
   ============================================================ */
 
function showToast(message, isError = false) {
 
    const toast = document.getElementById("toast");
 
    toast.textContent = message;
 
    toast.style.backgroundColor = isError
        ? "#dc2626"
        : "#16a34a";
 
    toast.classList.add("show");
 
    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}
 
 
/* ============================================================
   DASHBOARD
   ============================================================ */
 
function setCurrentDate() {
 
    const date = new Date();
 
    document.getElementById("currentDate").textContent =
        date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });
}
 
 
function createBusinessChart() {
 
    const canvas = document.getElementById("businessChart");
 
    if (!canvas || typeof Chart === "undefined") {
        return;
    }
 
    const context = canvas.getContext("2d");
 
    const revenueGradient = context.createLinearGradient(0, 0, 0, 300);
    revenueGradient.addColorStop(0, "rgba(37, 99, 235, 0.35)");
    revenueGradient.addColorStop(1, "rgba(37, 99, 235, 0.01)");
 
    const paymentGradient = context.createLinearGradient(0, 0, 0, 300);
    paymentGradient.addColorStop(0, "rgba(22, 163, 74, 0.22)");
    paymentGradient.addColorStop(1, "rgba(22, 163, 74, 0.01)");
 
    businessChart = new Chart(canvas, {
        type: "line",
 
        data: {
            labels: [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June"
            ],
 
            datasets: [
                {
                    label: "Revenue",
                    data: [
                        280000,
                        340000,
                        320000,
                        470000,
                        510000,
                        620000
                    ],
                    borderColor: "#2563eb",
                    backgroundColor: revenueGradient,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 7,
                    pointBackgroundColor: "#2563eb"
                },
                {
                    label: "Payments",
                    data: [
                        210000,
                        260000,
                        290000,
                        350000,
                        420000,
                        490000
                    ],
                    borderColor: "#16a34a",
                    backgroundColor: paymentGradient,
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 7,
                    pointBackgroundColor: "#16a34a"
                }
            ]
        },
 
        options: {
            responsive: true,
            maintainAspectRatio: false,
 
            interaction: {
                mode: "index",
                intersect: false
            },
 
            plugins: {
                legend: {
                    position: "top",
                    align: "end",
                    labels: {
                        usePointStyle: true,
                        boxWidth: 8
                    }
                },
 
                tooltip: {
                    backgroundColor: "#0f172a",
                    padding: 12,
 
                    callbacks: {
                        label(context) {
                            return `${context.dataset.label}: SAR ${context.raw.toLocaleString()}`;
                        }
                    }
                }
            },
 
            scales: {
                y: {
                    beginAtZero: true,
 
                    ticks: {
                        color: "#64748b",
 
                        callback(value) {
                            return `SAR ${value / 1000}K`;
                        }
                    },
 
                    grid: {
                        color: "#e2e8f0"
                    }
                },
 
                x: {
                    ticks: {
                        color: "#64748b"
                    },
 
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}
 
 
/* ============================================================
   INIT
   ============================================================ */
 
function initializeApp() {
 
    setupNavigation();
    setupCustomerForm();
    setupSearch();
    setupLanguage();
    setupPlaceholderButtons();
 
    setCurrentDate();
 
    Object.keys(sectionRegistry).forEach(key => {
        renderDirectory(key, sectionRegistry[key].getData());
    });
 
    createBusinessChart();
}
 
 
initializeApp();


getCustomers();
getInvoices();
getPayments();
