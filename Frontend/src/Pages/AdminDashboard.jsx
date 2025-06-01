import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const AdminDashboard = () => {
    const [lastMonthInvoices, setLastMonthInvoices] = useState([]);

    useEffect(() => {
        // Simulate fetching real invoices
        const now = new Date();
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

        const mockInvoices = [
            { id: "INV001", customer: "John Doe", amount: 2500, date: "2025-04-12" },
            { id: "INV002", customer: "Jane Smith", amount: 1800, date: "2025-04-18" },
            { id: "INV003", customer: "Amit Kumar", amount: 3200, date: "2025-04-21" },
        ];

        const filtered = mockInvoices.filter((inv) => {
            const date = new Date(inv.date);
            return date >= lastMonthStart && date <= lastMonthEnd;
        });

        setLastMonthInvoices(filtered);
    }, []);

    const downloadPDF = () => {
        if (lastMonthInvoices.length === 0) {
            alert("No invoices found for last month.");
            return;
        }

        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text("Deepak's Mart", 14, 20);
        doc.setFontSize(12);
        doc.text("Invoice Report (Last Month)", 14, 30);
        doc.text("Owner: Deepak Kushwah", 14, 36);
        doc.setFontSize(10);

        const tableData = lastMonthInvoices.map((inv) => [
            inv.id,
            inv.customer,
            `₹${inv.amount.toLocaleString()}`,
            inv.date,
        ]);

        autoTable(doc, {
            startY: 45,
            head: [["Invoice ID", "Customer", "Amount", "Date"]],
            body: tableData,
        });

        const total = lastMonthInvoices.reduce((acc, inv) => acc + inv.amount, 0);
        doc.text(`Total Revenue: ₹${total.toLocaleString()}`, 14, doc.lastAutoTable.finalY + 10);

        doc.save("invoices_last_month.pdf");
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Last Month's Invoices</h2>
                {lastMonthInvoices.length === 0 ? (
                    <p className="text-gray-600">No invoices found for last month.</p>
                ) : (
                    <>
                        <ul className="mb-4 space-y-2">
                            {lastMonthInvoices.map((inv) => (
                                <li key={inv.id} className="flex justify-between border-b pb-2">
                                    <span>{inv.customer}</span>
                                    <span>₹{inv.amount.toLocaleString()}</span>
                                    <span>{inv.date}</span>
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={downloadPDF}
                            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
                        >
                            Download PDF
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
