const customers = [
    {
        id: 1,
        name: "Al-Faisal Trading",
        phone: "0501234567",
        email: "info@alfaisal.com",
        status: "Active"
    },
    {
        id: 2,
        name: "Riyadh Solutions",
        phone: "0559876543",
        email: "contact@riyadhsolutions.com",
        status: "Active"
    },
    {
        id: 3,
        name: "Gulf Business Group",
        phone: "0531112222",
        email: "hello@gulfgroup.com",
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
    }
];


const companies = [
    {
        id: 1,
        name: "Aramex",
        phone: "920027447",
        email: "support@aramex.com",
        tracking: "aramex.com/track",
        status: "Active"
    },
    {
        id: 2,
        name: "SMSA Express",
        phone: "920009999",
        email: "info@smsaexpress.com",
        tracking: "smsaexpress.com/track",
        status: "Active"
    },
    {
        id: 3,
        name: "DHL",
        phone: "920003450",
        email: "support@dhl.com",
        tracking: "dhl.com/track",
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
        subtitle: "Manage delivery partners and tracking information."
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

    if (pageId === "customers") {
        renderCustomers();
    }
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


function renderCustomers(data = customers) {

    const table = document.getElementById("customersTable");

    table.innerHTML = "";

    data.forEach(customer => {

        table.innerHTML += `
            <tr>
                <td>${customer.id}</td>
                <td><strong>${customer.name}</strong></td>
                <td>${customer.phone}</td>
                <td>${customer.email}</td>
                <td>${createStatus(customer.status)}</td>
                <td>
                    <button class="action-button">
                        Edit
                    </button>

                    <button
                        class="action-button delete-button"
                        onclick="deleteCustomer(${customer.id})"
                    >
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });
}


function renderInvoices() {

    const table = document.getElementById("invoicesTable");

    table.innerHTML = "";

    invoices.forEach(invoice => {

        table.innerHTML += `
            <tr>
                <td><strong>${invoice.number}</strong></td>
                <td>${invoice.customer}</td>
                <td>SAR ${invoice.amount.toLocaleString()}</td>
                <td>SAR ${invoice.tax.toLocaleString()}</td>
                <td><strong>SAR ${invoice.total.toLocaleString()}</strong></td>
                <td>${createStatus(invoice.status)}</td>
            </tr>
        `;
    });
}


function renderPayments() {

    const table = document.getElementById("paymentsTable");

    table.innerHTML = "";

    payments.forEach(payment => {

        table.innerHTML += `
            <tr>
                <td>${payment.id}</td>
                <td>${payment.invoice}</td>
                <td>${payment.customer}</td>
                <td><strong>SAR ${payment.amount.toLocaleString()}</strong></td>
                <td>${payment.method}</td>
                <td>${createStatus(payment.status)}</td>
            </tr>
        `;
    });
}


function renderCompanies() {

    const table = document.getElementById("companiesTable");

    table.innerHTML = "";

    companies.forEach(company => {

        table.innerHTML += `
            <tr>
                <td>${company.id}</td>
                <td><strong>${company.name}</strong></td>
                <td>${company.phone}</td>
                <td>${company.email}</td>
                <td>${company.tracking}</td>
                <td>${createStatus(company.status)}</td>
            </tr>
        `;
    });
}


function renderShipments() {

    const table = document.getElementById("shipmentsTable");

    table.innerHTML = "";

    shipments.forEach(shipment => {

        table.innerHTML += `
            <tr>
                <td><strong>${shipment.tracking}</strong></td>
                <td>${shipment.customer}</td>
                <td>${shipment.company}</td>
                <td>SAR ${shipment.cost.toLocaleString()}</td>
                <td>${createStatus(shipment.status)}</td>
            </tr>
        `;
    });
}


function renderReceipts() {

    const table = document.getElementById("receiptsTable");

    table.innerHTML = "";

    receipts.forEach(receipt => {

        table.innerHTML += `
            <tr>
                <td>${receipt.id}</td>
                <td>${receipt.shipment}</td>
                <td>${receipt.recipient}</td>
                <td>${receipt.date}</td>
                <td>${createStatus(receipt.status)}</td>
            </tr>
        `;
    });
}


function renderServices() {

    const table = document.getElementById("servicesTable");

    table.innerHTML = "";

    services.forEach(service => {

        table.innerHTML += `
            <tr>
                <td>${service.id}</td>
                <td><strong>${service.name}</strong></td>
                <td>SAR ${service.price.toLocaleString()}</td>
                <td>${service.duration}</td>
                <td>${createStatus(service.status)}</td>
            </tr>
        `;
    });
}


function renderInventory() {

    const table = document.getElementById("inventoryTable");

    table.innerHTML = "";

    inventoryItems.forEach(item => {

        table.innerHTML += `
            <tr>
                <td><strong>${item.sku}</strong></td>
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>SAR ${item.price.toLocaleString()}</td>
                <td>${createStatus(item.status)}</td>
            </tr>
        `;
    });
}


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
}


function closeCustomerForm() {

    document
        .getElementById("customerForm")
        .classList.add("hidden");
}


function addCustomer() {

    const name = document.getElementById("customerName").value.trim();
    const phone = document.getElementById("customerPhone").value.trim();
    const email = document.getElementById("customerEmail").value.trim();

    if (!name) {
        showToast("Customer name is required", true);
        return;
    }

    customers.push({
        id: customers.length + 1,
        name,
        phone: phone || "-",
        email: email || "-",
        status: "Active"
    });

    document.getElementById("customerName").value = "";
    document.getElementById("customerPhone").value = "";
    document.getElementById("customerEmail").value = "";
    document.getElementById("customerAddress").value = "";

    closeCustomerForm();
    renderCustomers();

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

    renderCustomers();

    showToast("Customer deleted successfully");
}


function setupSearch() {

    document
        .getElementById("searchInput")
        .addEventListener("input", function () {

            const value = this.value.toLowerCase();

            if (currentPage === "customers") {

                const filteredCustomers = customers.filter(customer => {

                    return (
                        customer.name.toLowerCase().includes(value) ||
                        customer.phone.toLowerCase().includes(value) ||
                        customer.email.toLowerCase().includes(value)
                    );
                });

                renderCustomers(filteredCustomers);
            }
        });
}


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


function initializeApp() {

    setupNavigation();
    setupCustomerForm();
    setupSearch();
    setupLanguage();

    setCurrentDate();

    renderCustomers();
    renderInvoices();
    renderPayments();
    renderCompanies();
    renderShipments();
    renderReceipts();
    renderServices();
    renderInventory();

    createBusinessChart();
}


initializeApp();

async function getCustomers() {
    const response = await fetch(`${API_URL}/customers/`);
    const customers = await response.json();

    const table = document.getElementById("customersTable");
    table.innerHTML = "";

    customers.forEach(customer => {
        const row = `
            <tr>
                <td>${customer.id}</td>
                <td>${customer.name}</td>
                <td>${customer.phone || ""}</td>
                <td>${customer.email || ""}</td>
                <td>${customer.address || ""}</td>
            </tr>
        `;

        table.innerHTML += row;
    });
}


async function addInvoice() {
    const invoiceData = {
        customer_id: Number(document.getElementById("invoice_customer_id").value),
        invoice_number: document.getElementById("invoice_number").value.trim(),
        amount: Number(document.getElementById("invoice_amount").value)
    };

    try {
        const response = await fetch(`${API_URL}/invoices/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(invoiceData)
        });

        const data = await response.json();

        if (!response.ok) {
            alert(JSON.stringify(data));
            return;
        }

        alert("Invoice added successfully");
        getInvoices();

    } catch (error) {
        console.log(error);
        alert("Error adding invoice");
    }
}


async function getInvoices() {
    const response = await fetch(`${API_URL}/invoices/`);
    const invoices = await response.json();

    const table = document.getElementById("invoicesTable");
    table.innerHTML = "";

    invoices.forEach(invoice => {
        const row = `
            <tr>
                <td>${invoice.id}</td>
                <td>${invoice.customer_id}</td>
                <td>${invoice.invoice_number}</td>
                <td>${invoice.amount}</td>
                <td>${invoice.tax_amount}</td>
                <td>${invoice.total}</td>
                <td>${invoice.status}</td>
            </tr>
        `;

        table.innerHTML += row;
    });
}


async function addPayment() {
    const paymentData = {
        customer_id: Number(document.getElementById("payment_customer_id").value),
        invoice_id: Number(document.getElementById("payment_invoice_id").value),
        amount: Number(document.getElementById("payment_amount").value),
        payment_method: document.getElementById("payment_method").value.trim()
    };

    try {
        const response = await fetch(`${API_URL}/payments/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(paymentData)
        });

        const data = await response.json();

        if (!response.ok) {
            alert(JSON.stringify(data));
            return;
        }

        alert("Payment added successfully");
        getPayments();
        getInvoices();

    } catch (error) {
        console.log(error);
        alert("Error adding payment");
    }
}


async function getPayments() {
    const response = await fetch(`${API_URL}/payments/`);
    const payments = await response.json();

    const table = document.getElementById("paymentsTable");
    table.innerHTML = "";

    payments.forEach(payment => {
        const row = `
            <tr>
                <td>${payment.id}</td>
                <td>${payment.customer_id}</td>
                <td>${payment.invoice_id}</td>
                <td>${payment.amount}</td>
                <td>${payment.payment_method}</td>
                <td>${payment.created_at}</td>
            </tr>
        `;

        table.innerHTML += row;
    });
}


getCustomers();
getInvoices();
getPayments();
