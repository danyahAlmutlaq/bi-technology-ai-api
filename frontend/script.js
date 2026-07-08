const API_URL = "http://127.0.0.1:8000";


async function addCustomer() {
    const customerData = {
        name: document.getElementById("name").value.trim(),
        phone: document.getElementById("phone").value.trim() || null,
        email: document.getElementById("email").value.trim() || null,
        address: document.getElementById("address").value.trim() || null,
        tax_number: document.getElementById("tax_number").value.trim() || null,
        notes: document.getElementById("notes").value.trim() || null
    };

    try {
        const response = await fetch(`${API_URL}/customers/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(customerData)
        });

        const data = await response.json();

        if (!response.ok) {
            alert(JSON.stringify(data));
            return;
        }

        alert("Customer added successfully");
        getCustomers();

    } catch (error) {
        console.log(error);
        alert("Error adding customer");
    }
}


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
