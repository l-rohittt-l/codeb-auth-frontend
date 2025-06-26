import React, { useEffect, useState } from "react";
import api from "../../axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import styles from "./AddEstimate.module.css";
import { toast } from "react-toastify";

const AddEstimate = () => {
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
    fetchChains();
  }, []);

  const fetchChains = async () => {
    

    try {
      const res = await api.get("/api/chains");
      console.log("Chains data:", res.data);
      setChains(res.data);
    } catch (err) {
      toast.error("Failed to fetch chains");
    }
    
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    let updatedForm = { ...formData, [name]: value };

    if (name === "chainId") {
      const selected = chains.find(c => c.chainId.toString() === value);
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
      const unitCost = parseFloat(name === "costPerUnit" ? value : formData.costPerUnit);
      const total = qty > 0 && unitCost > 0 ? qty * unitCost : "";
      updatedForm.totalCost = total;
    }

    setFormData(updatedForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/estimates", formData);
      toast.success("Estimate created");
      navigate("/estimates");
    } catch {
      toast.error("Error creating estimate");
    }
  };

  return (
    <div>
      <Navbar />
      <div className={styles.estimateContainer}>
        <h2 className={styles.estimateHeading}>Create New Estimate</h2>
        <form onSubmit={handleSubmit} className={styles.estimateForm}>
          <label>Chain</label>
          <select 
            name="chainId" 
            required 
            value={formData.chainId} 
            onChange={handleChange}
            style={{ backgroundColor: 'white', color: 'black' }}
          >
            <option value="">Select Chain</option>
            {chains.map((chain) => (
              <option 
                key={chain.chainId} 
                value={chain.chainId}
                style={{ backgroundColor: 'white', color: 'black' }}
              >
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
            style={{ backgroundColor: 'white', color: 'black' }}
          >
            <option value="">Select Brand</option>
            {brands.map((name) => (
              <option 
                key={name} 
                value={name}
                style={{ backgroundColor: 'white', color: 'black' }}
              >
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
            style={{ backgroundColor: 'white', color: 'black' }}
          >
            <option value="">Select Zone</option>
            {zones.map((name) => (
              <option 
                key={name} 
                value={name}
                style={{ backgroundColor: 'white', color: 'black' }}
              >
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

          <button type="submit" className={styles.estimateSubmitBtn}>Create Estimate</button>
        </form>
      </div>
    </div>
  );
};

export default AddEstimate;