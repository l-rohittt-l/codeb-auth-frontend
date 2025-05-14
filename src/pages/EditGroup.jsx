import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditGroup = () => {
  const { id } = useParams();
  const [groupName, setGroupName] = useState("");
  const [groupCode, setGroupCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await axios.get(`https://codeb-ims.onrender.com/api/groups/${id}`, {
          withCredentials: true,
        });
        setGroupName(res.data.groupName);
        setGroupCode(res.data.groupCode);
      } catch {
        setError("Failed to load group.");
      }
    };
    fetchGroup();
  }, [id]);

  const validateInputs = () => {
    if (!groupName.trim()) return "Group name cannot be empty.";
    if (!groupCode.trim()) return "Group code cannot be empty.";

    const codeRegex = /^[A-Z0-9_-]+$/;
    if (!codeRegex.test(groupCode)) {
      return "Group code must be uppercase and may only contain letters, numbers, hyphens, and underscores.";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await axios.put(
        `https://codeb-ims.onrender.com/api/groups/${id}`,
        {
          groupName: groupName.trim(),
          groupCode: groupCode.trim(),
        },
        { withCredentials: true }
      );
      navigate("/groups/dashboard");
    } catch (err) {
      setError(err.response?.data || "Error updating group.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Edit Group</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Group Name</label>
          <input
            type="text"
            className="form-control"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Group Code</label>
          <input
            type="text"
            className="form-control"
            value={groupCode}
            onChange={(e) => setGroupCode(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-success">Update Group</button>
      </form>
    </div>
  );
};

export default EditGroup;
