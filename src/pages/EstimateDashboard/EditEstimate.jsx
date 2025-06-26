import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../axios";
import Navbar from "../../components/Navbar";
import styles from "./EditEstimate.module.css";
import { toast } from "react-toastify";

const EditEstimate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [chains, setChains] = useState([]);
  const [brands, setBrands] = useState([]);
  const [zones, setZones] = useState([]);

  const [formData, setFormData] = useState({
    chainId: "",
    groupName: "",
    brandName: "",
    zoneName: "",
    service: "",
    qty: "",
    costPerUnit: "",
    totalCost: "",
    deliveryDate: "",
    deliveryDetails: ""
  });

  useEffect(() => {
    fetchEstimate();
    fetchChains();
  }, []);

  const fetchChains = async () => {
    try {
      const res = await api.get("/api/chains");
      setChains(res.data);
    } catch {
      toast.error("Failed to load chains");
    }
  };

  const fetchEstimate = async () => {
    try {
      const res = await api.get("/api/estimates");
      const estimate = res.data.find((e) => e.estimatedId === parseInt(id));
      if (!estimate) {
        toast.error("Estimate not found");
        navigate("/estimates");
        return;
      }

      setFormData({
        chainId: estimate.chainId,
        groupName: estimate.groupName,
        brandName: estimate.brandName,
        zoneName: estimate.zoneName,
        service: estimate.service,
        qty: estimate.qty,
        costPerUnit: estimate.costPerUnit,
        totalCost: estimate.totalCost,
        deliveryDate: estimate.deliveryDate,
        deliveryDetails: estimate.deliveryDetails
      });

      if (estimate.chainId) {
        const brandRes = await api.get(`/api/brands/names/by-chain/${estimate.chainId}`);
        setBrands(brandRes.data);
      }

      if (estimate.brandName) {
        const zoneRes = await api.get(`/api/zones/names/by-brand/${estimate.brandName}`);
        setZones(zoneRes.data);
      }
    } catch (err) {
      toast.error("Error loading estimate");
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;

    let updatedForm = { ...formData, [name]: value };

    if (name === "chainId") {
      const selected = chains.find((c) => c.chainId.toString() === value);
      updatedForm.groupName = selected?.group?.groupName || "";
      updatedForm.brandName = "";
      updatedForm.zoneName = "";
      setBrands([]);
      setZones([]);

      if (value) {
        try {
          const res = await api.get(`/api/brands/names/by-chain/${value}`);
          setBrands(res.data);
        } catch {
          toast.error("Failed to load brands");
        }
      }
    }

    if (name === "brandName") {
      updatedForm.zoneName = "";
      setZones([]);

      if (value) {
        try {
          const res = await api.get(`/api/zones/names/by-brand/${value}`);
          setZones(res.data);
        } catch {
          toast.error("Failed to load zones");
        }
      }
    }

    if (name === "qty" || name === "costPerUnit") {
      const qty = parseFloat(name === "qty" ? value : formData.qty);
      const cost = parseFloat(name === "costPerUnit" ? value : formData.costPerUnit);
      const total = qty > 0 && cost > 0 ? qty * cost : "";
      updatedForm.totalCost = total;
    }

    setFormData(updatedForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      chainId: parseInt(formData.chainId),
      groupName: formData.groupName,
      brandName: formData.brandName,
      zoneName: formData.zoneName,
      service: formData.service,
      qty: parseInt(formData.qty),
      costPerUnit: parseFloat(formData.costPerUnit),
      totalCost: parseFloat(formData.totalCost),
      deliveryDate: formData.deliveryDate,
      deliveryDetails: formData.deliveryDetails
    };

    try {
      await api.put(`/api/estimates/${id}`, payload);
      toast.success("Estimate updated");
      navigate("/estimates");
    } catch (err) {
      toast.error("Failed to update");
    }
  };

  return (
    <div>
      <Navbar />
      <div className={styles.container}>
        <h2 className={styles.heading}>Edit Estimate</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label>Chain</label>
          <select name="chainId" required value={formData.chainId} onChange={handleChange}>
            <option value="">Select Chain</option>
            {chains.map((chain) => (
              <option key={chain.chainId} value={chain.chainId} style={{ color: "black" }}>
                {chain.companyName}
              </option>
            ))}
          </select>

          <label>Group Name</label>
          <input type="text" name="groupName" value={formData.groupName} readOnly required />

          <label>Brand Name</label>
          <select
            name="brandName"
            value={formData.brandName}
            onChange={handleChange}
            disabled={!brands.length}
            required
          >
            <option value="">Select Brand</option>
            {brands.map((name) => (
              <option key={name} value={name} style={{ color: "black" }}>
                {name}
              </option>
            ))}
          </select>

          <label>Zone Name</label>
          <select
            name="zoneName"
            value={formData.zoneName}
            onChange={handleChange}
            disabled={!zones.length}
            required
          >
            <option value="">Select Zone</option>
            {zones.map((name) => (
              <option key={name} value={name} style={{ color: "black" }}>
                {name}
              </option>
            ))}
          </select>

          <label>Service Provided</label>
          <input type="text" name="service" value={formData.service} onChange={handleChange} required />

          <label>Quantity</label>
          <input type="number" name="qty" value={formData.qty} onChange={handleChange} required />

          <label>Cost Per Unit (₹)</label>
          <input type="number" name="costPerUnit" value={formData.costPerUnit} onChange={handleChange} required />

          <label>Total Cost (₹)</label>
          <input type="number" name="totalCost" value={formData.totalCost} readOnly />

          <label>Delivery Date</label>
          <input type="date" name="deliveryDate" value={formData.deliveryDate} onChange={handleChange} />

          <label>Additional Delivery Details</label>
          <input type="text" name="deliveryDetails" value={formData.deliveryDetails} onChange={handleChange} />

          <button type="submit" className={styles.submitBtn}>Update Estimate</button>
        </form>
      </div>
    </div>
  );
};

export default EditEstimate;
