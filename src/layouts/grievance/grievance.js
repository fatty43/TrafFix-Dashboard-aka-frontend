// // React and hooks

import React, { useState, useEffect } from "react";
// MetaMask and contract methods
import { getWeb3, getGrievanceContract } from "../../services/contractService";

// Material-UI components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { ToastContainer, toast } from "react-toastify";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
// Layout
import CoverLayout from "layouts/authentication/components/CoverLayout";
// Images
import bgImage from "assets/images/signnnnup.jpg";
// Toast styles
import "react-toastify/dist/ReactToastify.css";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

function GrievancePage() {
  // Form state
  const [description, setDescription] = useState("");
  const [officerName, setOfficerName] = useState("");
  const [category, setCategory] = useState("Misconduct");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [complaints, setComplaints] = useState([]);

  // Complaint categories
  const categories = ["Misconduct", "Unfair Fine", "Corruption", "Others"];

  // Fetch user complaints
  const fetchComplaints = async () => {
    try {
      const web3 = await getWeb3();
      const contract = await getGrievanceContract(web3);
      const accounts = await web3.eth.getAccounts();
      const result = await contract.methods.getComplaintsByUser(accounts[0]).call();
      setComplaints(result);
    } catch (err) {
      console.error("Error fetching complaints:", err);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  // Submit a complaint
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !officerName || !date || !time ) {
      toast.error("All fields are required.");
      return;
    }
    try {
      const web3 = await getWeb3();
      const contract = await getGrievanceContract(web3);
      const accounts = await web3.eth.getAccounts();

      await contract.methods
        .fileComplaint(category, officerName, date, time, description)
        .send({ from: accounts[0] });

      toast.success("Complaint filed successfully!");
       setComplaints([]); // Clear complaints after filing a new one
      setDescription("");
      setOfficerName("");
      setCategory("Misconduct");
      setDate("");
      setTime("");
      fetchComplaints();
    } catch (err) {
      console.error("Error filing complaint:", err);
      toast.error("Error filing complaint. Please try again.");
    }
  };

  return (

    <DashboardLayout>
    <DashboardNavbar />

    <div
    style={{
      backgroundImage: `url(${bgImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "10px",
    }} 
    >
    <CoverLayout >
      <ToastContainer />
      <Card>
        <MDBox textAlign="center" p={3}>
          <MDTypography variant="h4">Grievance</MDTypography>
          <MDTypography>File a complaint or track existing grievances</MDTypography>
        </MDBox>
        <MDBox component="form" onSubmit={handleSubmit} p={3}>
          <MDInput label="Officer Name" fullWidth value={officerName} onChange={(e) => setOfficerName(e.target.value)} />
          <Select fullWidth value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((cat, idx) => (
              <MenuItem key={idx} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
          
          <MDInput type="date" fullWidth value={date} onChange={(e) => setDate(e.target.value)} />
          <MDInput type="time" fullWidth value={time} onChange={(e) => setTime(e.target.value)} />
          <MDInput multiline rows={4} label="Description" fullWidth value={description} onChange={(e) => setDescription(e.target.value)} />
          
          <MDButton variant="contained" style={{ backgroundColor: "#007bff" }} fullWidth type="submit">File Complaint</MDButton>
        </MDBox>
        {/* <MDBox p={3}>
          <MDTypography variant="h5">Past Complaints</MDTypography>
          {complaints.map((complaint, idx) => (
            <Card key={idx} sx={{ my: 2, p: 2 }}>
              <MDTypography><strong>Category:</strong> {complaint.category}</MDTypography>
              <MDTypography><strong>Officer:</strong> {complaint.officerName}</MDTypography>
              <MDTypography><strong>Date:</strong> {complaint.date}</MDTypography>
              <MDTypography><strong>Time:</strong> {complaint.time}</MDTypography>
              <MDTypography><strong>Description:</strong> {complaint.description}</MDTypography>
              <MDTypography><strong>Status:</strong> {complaint.status}</MDTypography>
              <MDTypography><strong>Timestamp:</strong> {new Date(Number(complaint.timestamp) * 1000).toLocaleString()}</MDTypography>

              {/* <MDTypography><strong>Timestamp:</strong> {new Date(complaint.timestamp * 1000).toLocaleString()}</MDTypography> */}
             </Card> 
          {/* ))} */}
        {/* </MDBox>
      </Card>  */}
    </CoverLayout>
    
    </div>
    </DashboardLayout>
  );
}

export default GrievancePage;
