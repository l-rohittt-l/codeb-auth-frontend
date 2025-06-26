import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../axios";
import Navbar from "../../components/Navbar";
import { toast } from "react-toastify";
import styles from "./CreateInvoice.module.css";

const CreateInvoice = () => {
  const { estimateId } = useParams();
  const navigate = useNavigate();

  const [prefill, setPrefill] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [formData, setFormData] = useState({
    amountPaid: "",
    email: ""
  });

  const [balanceAmount, setBalanceAmount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPrefillData();
    fetchExistingInvoices();
  }, [estimateId]);

  const fetchPrefillData = async () => {
    try {
      const res = await api.get(`/api/invoices/prepare/${estimateId}`);
      setPrefill(res.data);
    } catch (err) {
      toast.error("Failed to load invoice data");
    }
  };

  const fetchExistingInvoices = async () => {
    try {
      const res = await api.get(`/api/invoices/by-estimate/${estimateId}`);
      setInvoices(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (prefill) {
      if (invoices.length === 0) {
        setBalanceAmount(prefill.totalCost);
      } else {
        const paidSoFar = invoices.reduce((sum, inv) => sum + inv.amountPaid, 0);
        const balance = prefill.totalCost - paidSoFar;
        setBalanceAmount(balance > 0 ? balance : 0);
      }
    }
  }, [prefill, invoices]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOtpSend = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.amountPaid) {
      toast.error("Please fill in both email and amount.");
      return;
    }

    try {
      setLoading(true);

      // Send OTP
      await api.post(`/api/otp/send?email=${encodeURIComponent(formData.email)}`);
      toast.success("OTP sent to email");

      // Store form + prefill in session
      const fullInvoiceData = {
        ...formData,
        estimateId: prefill.estimateId,
        deliveryDate: prefill.deliveryDate,
        deliveryDetails: prefill.deliveryDetails
      };
      sessionStorage.setItem("invoiceData", JSON.stringify(fullInvoiceData));

      navigate(`/verify-otp?email=${encodeURIComponent(formData.email)}&mode=invoice`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  if (!prefill) return <div>Loading...</div>;

  return (
    <div>
      <Navbar />
      <div className={styles.invoiceContainer}>
        <h2 className={styles.heading}>
          {balanceAmount === 0 && invoices.length > 0 ? "Invoice Summary" : "Create Invoice"}
        </h2>

        <div className={styles.readOnlyBlock}>
          <p><strong>Estimate ID:</strong> {prefill.estimateId}</p>
          <p><strong>Chain ID:</strong> {prefill.chainId}</p>
          <p><strong>Group:</strong> {prefill.groupName}</p>
          <p><strong>Brand:</strong> {prefill.brandName}</p>
          <p><strong>Zone:</strong> {prefill.zoneName}</p>
          <p><strong>Service:</strong> {prefill.service}</p>
          <p><strong>Quantity:</strong> {prefill.qty}</p>
          <p><strong>Unit Cost (₹):</strong> {prefill.costPerUnit}</p>
          <p><strong>Total Cost (₹):</strong> {prefill.totalCost}</p>
          <p><strong>GST Number:</strong> {prefill.gstin}</p>
          <p><strong>Delivery Date:</strong> {prefill.deliveryDate}</p>
          <p><strong>Delivery Details:</strong> {prefill.deliveryDetails}</p>
        </div>

        <p className={styles.balanceLabel}>
          Balance Amount Left: ₹{balanceAmount}
        </p>

        {balanceAmount === 0 && invoices.length > 0 && (
          <p className={styles.successText}>✓ All amount has been paid.</p>
        )}

        {balanceAmount > 0 || invoices.length === 0 ? (
          <form onSubmit={handleOtpSend} className={styles.form}>
            <label>Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
            />

            <label>Amount Paid (₹)</label>
            <input
              type="number"
              name="amountPaid"
              required
              value={formData.amountPaid}
              onChange={handleChange}
            />

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? "Sending OTP..." : "Generate Invoice"}
            </button>
          </form>
        ) : null}

        {invoices.length > 0 ? (
          <table className={styles.invoiceTable}>
            <thead>
              <tr>
                <th>Invoice No</th>
                <th>Amount Paid</th>
                <th>Balance</th>
                <th>Email</th>
                <th>Payment Date</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.invoiceId}>
                  <td>{inv.invoiceNumber}</td>
                  <td>₹{inv.amountPaid}</td>
                  <td>₹{inv.balanceAmount}</td>
                  <td>{inv.email}</td>
                  <td>
                    {inv.createdAt && Array.isArray(inv.createdAt)
                      ? new Date(
                          inv.createdAt[0],
                          inv.createdAt[1] ,
                          inv.createdAt[2]
                        )
                          .toISOString()
                          .split("T")[0]
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className={styles.noData}>No invoices generated yet.</p>
        )}
      </div>
    </div>
  );
};

export default CreateInvoice;
