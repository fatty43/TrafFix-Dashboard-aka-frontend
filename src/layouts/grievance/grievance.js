// React and hooks
import React, { useState, useEffect } from "react";
// MetaMask and contract methods
// import { getWeb3, getGrievanceContract } from "../../services/contractService";
import { getWeb3, fileComplaint, getUserComplaints } from "../../services/contractService";

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

function GrievancePage() {
  // Form state
  const [description, setDescription] = useState("");
  const [officerName, setOfficerName] = useState("");
  const [category, setCategory] = useState("Misconduct");


  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
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
    if (!description || !officerName || !date || !time || !location) {
      setError("All fields are required.");
      return;
    }
    try {
      const web3 = await getWeb3();
      const contract = await getGrievanceContract(web3);
      const accounts = await web3.eth.getAccounts();

      await contract.methods.fileComplaint(description, officerName, date, time, location).send({ from: accounts[0] });

      toast.success("Complaint filed successfully!");
      setDescription("");
      setOfficerName("");
      setCategory("Misconduct");
      setDate("");
      setTime("");
      setLocation("");
      fetchComplaints();
    } catch (err) {
      console.error("Error filing complaint:", err);
      toast.error("Error filing complaint. Please try again.");
    }
  };

  return (
    <CoverLayout image={bgImage}>
      <ToastContainer />
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="success"
           alignItems="center"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Grievance 
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
          File a complaint or track existing grievances
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form" onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Officer Name"
                variant="standard"
                fullWidth
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
              <Select
                fullWidth
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((cat, idx) => (
                  <MenuItem key={idx} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Location"
                variant="standard"
                fullWidth
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </MDBox>
            <MDBox mb={2}>
            
              <MDInput
                type="date"
                placeholder="MM/DD/YYYY" // Set placeholder instead of label
                variant="standard"
                fullWidth
                value={date}
                onChange={(e) => setDate(e.target.value)}
               
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="time"
                placeholder="-:-:-:" // Set placeholder instead of label
                variant="standard"
                fullWidth
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </MDBox>




            <MDBox mb={2}>
              <MDInput
                multiline
                rows={4}
                label="Description"
                variant="standard"
                fullWidth
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Checkbox />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;I agree to the&nbsp;
              </MDTypography>
              <MDTypography
                component="a"
                href="#"
                variant="button"
                fontWeight="bold"
                color="info"
                textGradient
              >
                Terms and Conditions
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton
                variant="gradient"
                color="info"
                fullWidth
                type="submit"
              >
                File Complaint
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDTypography variant="h5" fontWeight="medium" mt={2}>
            Past Complaints
          </MDTypography>
          {complaints.map((complaint, idx) => (
            <Card key={idx} sx={{ my: 2, p: 2 }}>
              <MDTypography>
                <strong>Category:</strong> {complaint.category}
              </MDTypography>
              <MDTypography>
                <strong>Officer:</strong> {complaint.officerName}
              </MDTypography>
              <MDTypography>
              <MDTypography>
                <strong>Location:</strong> {complaint.location}
              </MDTypography>
              <MDTypography>
                <strong>Date:</strong> {complaint.date}
              </MDTypography>
              <MDTypography>
                <strong>Time:</strong> {complaint.time}
              </MDTypography>
                <strong>Description:</strong> {complaint.description}
              </MDTypography>
              <MDTypography>
                <strong>Status:</strong> {complaint.status}
              </MDTypography>
              <MDTypography>
                <strong>Timestamp:</strong>{" "}
                {new Date(complaint.timestamp * 1000).toLocaleString()}
              </MDTypography>
            </Card>
          ))}
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default GrievancePage;
