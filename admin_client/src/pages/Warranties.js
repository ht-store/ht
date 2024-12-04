import React, { useState, useEffect } from "react";
import ReusableTable from "../components/ReusableTable";
import AddClaimForm from "../components/AddClaimForm";
import axios from "axios";
import AddCostForm from "../components/AddCostForm";
import UpdateClaimStatusForm from "../components/UpdateClaimStatusForm";

const Warranties = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openAddCostModal, setOpenAddCostModal] = useState(false);
  const [openUpdateStatusModal, setOpenUpdateStatusModal] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [selectedClaimForCost, setSelectedClaimForCost] = useState(null);
  const [claims, setClaim] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const fetchClaims = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8001/warranties/claims"
        );
        const formattedClaims = response.data.map((claim) => ({
          ...claim,
          claimDate: formatDate(claim.claimDate),
        }));
        console.log(formattedClaims);
        setClaim(formattedClaims);
      } catch (err) {
        setError("Failed to fetch Claims");
      } finally {
        setLoading(false);
      }
    };

    fetchClaims();
  }, []);

  const handleAddClick = () => {
    setOpenAddModal(true);
  };

  const handleAddClaim = async (formData) => {
    try {
      const response = await axios.post(
        "http://localhost:8001/warranties/claim",
        formData
      );
      setClaim((prevClaims) => [...prevClaims, response.data.data]);
    } catch (error) {
      console.error("Failed to add claim:", error);
      setError("Failed to add claim");
    } finally {
      setOpenAddModal(false);
    }
  };

  const handleDelete = async (rowsDeleted) => {
    const indexes = rowsDeleted.data.map((d) => d.dataIndex);
    const idsToDelete = indexes.map((index) => claims[index].id);
    try {
      await axios.delete(
        `http://localhost:8001/warranties/claim/${idsToDelete[0]}`
      );
      const updatedClaims = claims.filter(
        (_, index) => !indexes.includes(index)
      );
      setClaim(updatedClaims);
    } catch (error) {
      console.error("Failed to delete claims:", error);
      setError("Failed to delete claims");
    }
  };

  const handleAddCost = (id) => {
    const claim = claims.find((Claim) => Claim.id === id);
    setSelectedClaimForCost(claim);
    setOpenAddCostModal(true);
  };

  const handleAddCostSubmit = async (costData) => {
    const data = { ...costData, claimId: selectedClaimForCost.id };
    const updatedData = {
      ...data,
      repairCost: parseFloat(data.repairCost),
      partsCost: parseFloat(data.partsCost),
      shippingCost: parseFloat(data.shippingCost),
    };

    try {
      const response = await axios.post(
        `http://localhost:8001/warranties/claim/cost`,
        updatedData
      );
      console.log(response.data);
    } catch (error) {
      console.error("Failed to add cost:", error);
      setError("Failed to add cost");
    } finally {
      setOpenAddCostModal(false);
      setSelectedClaimForCost(null);
    }
  };

  const handleOpenUpdateStatus = (id, currentStatus) => {
    if (["completed", "reject"].includes(currentStatus)) {
      alert("Cannot update status once it's completed or rejected.");
      return;
    }

    const claim = claims.find((Claim) => Claim.id === id);
    setSelectedClaim(claim);
    setOpenUpdateStatusModal(true);
  };

  const handleUpdateStatusSubmit = async (updatedData) => {
    console.log(updatedData);
    try {
      const response = await axios.put(
        `http://localhost:8001/warranties/claim/status`,
        updatedData
      );
      setClaim((prevClaims) =>
        prevClaims.map((claim) =>
          claim.id === selectedClaim.id
            ? { ...claim, claimStatus: updatedData.status }
            : claim
        )
      );
      alert("Status updated successfully!");
    } catch (error) {
      console.error("Failed to update status:", error);
      setError("Failed to update status.");
    } finally {
      setOpenUpdateStatusModal(false);
      setSelectedClaim(null);
    }
  };

  const columns = [
    { name: "id", label: "ID" },
    { name: "claimDate", label: "Claim Date" },
    { name: "claimStatus", label: "Claim Status" },
    {
      name: "actions",
      label: "Actions",
      options: {
        customBodyRender: (value, tableMeta, updateValue) => {
          const id = tableMeta.rowData[0];
          const currentStatus = tableMeta.rowData[2];
          return (
            <div className="flex space-x-2">
              <button
                onClick={() => handleAddCost(id)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Add Cost
              </button>
              <button
                onClick={() => handleOpenUpdateStatus(id, currentStatus)}
                className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-700"
              >
                Update Status
              </button>
            </div>
          );
        },
      },
    },
  ];

  const options = {
    filter: true,
    selectableRows: "single",
    responsive: "standard",
    download: true,
    print: true,
    pagination: true,
    onRowsDelete: handleDelete,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl">Claim Management</h1>
        <button
          onClick={handleAddClick}
          className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <i className="fas fa-plus-circle mr-2"></i> Add Claim
        </button>
      </div>

      {loading && <p>Loading Claims...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <ReusableTable
          title="Claim List"
          columns={columns}
          data={claims || []}
          options={options}
        />
      )}

      {openAddModal && (
        <AddClaimForm
          onSubmit={handleAddClaim}
          onClose={() => setOpenAddModal(false)}
        />
      )}

      {openAddCostModal && selectedClaimForCost && (
        <AddCostForm
          onSubmit={handleAddCostSubmit}
          onClose={() => {
            setOpenAddCostModal(false);
            setSelectedClaimForCost(null);
          }}
        />
      )}

      {openUpdateStatusModal && selectedClaim && (
        <UpdateClaimStatusForm
          initialData={{
            status: selectedClaim.claimStatus,
            claimId: selectedClaim.id,
          }}
          onSubmit={handleUpdateStatusSubmit}
          onClose={() => setOpenUpdateStatusModal(false)}
        />
      )}
    </div>
  );
};

export default Warranties;
