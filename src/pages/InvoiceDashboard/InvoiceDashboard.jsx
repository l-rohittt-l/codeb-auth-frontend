import React, { useEffect, useState } from "react";
import api from "../../axios";
import Navbar from "../../components/Navbar";
import styles from "./InvoiceDashboard.module.css";
import { toast } from "react-toastify";

const InvoiceDashboard = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await api.get("/api/invoices");
      setInvoices(res.data);
    } catch (err) {
      toast.error("Failed to load invoices");
    }
  };

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <h2 className={styles.heading}>Invoice Dashboard</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Invoice No</th>
              <th>Estimate ID</th>
              <th>Amount Paid (₹)</th>
              <th>Balance (₹)</th>
              <th>Email</th>
              <th>Delivery Date</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv, index) => (
              <tr key={inv.invoiceId}>
                <td>{index + 1}</td>
                <td>{inv.invoiceNumber}</td>
                <td>{inv.estimateId}</td>
                <td>{inv.amountPaid}</td>
                <td>{inv.balanceAmount}</td>
                <td>{inv.email}</td>
                <td>{inv.deliveryDate || "N/A"}</td>
                <td>{new Date(inv.createdAt).toLocaleString("en-GB")}</td>
              </tr>
            ))}
            {invoices.length === 0 && (
              <tr>
                <td colSpan="8" className={styles.noData}>No invoices found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceDashboard;
