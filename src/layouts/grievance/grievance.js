// // React and hooks

import React, { useState, useEffect } from "react";
// MetaMask and contract methods
import { getWeb3, getGrievanceContract } from "../../services/contractService";

// Material-UI components
import Card from "@mui/material/Card";
import { Checkbox, MenuItem, Select, TextField, Grid } from "@mui/material";
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
    if (!description || !officerName || !category ||!date || !time ) {
      toast.error("All fields are required.");
      return;
    }
    try {
      const web3 = await getWeb3();
      const contract = await getGrievanceContract(web3);
      const accounts = await web3.eth.getAccounts();

      try {
        await contract.methods
          .fileComplaint(description, officerName,category, date, time)
          .send({ from: accounts[0] });
      } catch (err) {
        console.error("MetaMask transaction error:", err);
        toast.error(err.message);
      }


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
          minHeight: "85vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        <ToastContainer />
        <Card sx={{ 
          maxWidth: "550px", 
          width: "100%",
          margin: "auto",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)"
        }}>
          <MDBox 
            variant="gradient" 
            bgColor="info"
            borderRadius="lg" 
            coloredShadow="info" 
            mx={2}
            mt={-3}
            p={2.5}
            mb={1}
            textAlign="center"
          >
            <MDTypography variant="h4" fontWeight="medium" color="white">
              File a Grievance
            </MDTypography>
          </MDBox>

          <MDBox pt={4} pb={3} px={3}>
            <MDBox component="form" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <MDInput 
                    label="Officer Name" 
                    fullWidth 
                    value={officerName} 
                    onChange={(e) => setOfficerName(e.target.value)}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <Select
                    fullWidth
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    sx={{ 
                      height: "45px",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(0, 0, 0, 0.23)"
                      }
                    }}
                  >
                    {categories.map((cat, idx) => (
                      <MenuItem key={idx} value={cat}>{cat}</MenuItem>
                    ))}
                  </Select>
                </Grid>

                <Grid item xs={6}>
                  <MDInput
                    type="date"
                    label="Date"
                    fullWidth
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <MDInput
                    type="time"
                    label="Time"
                    fullWidth
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    multiline
                    rows={4}
                    label="Description"
                    fullWidth
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "rgba(0, 0, 0, 0.23)"
                        }
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <MDButton
                    variant="gradient"
                    color="info"
                    fullWidth
                    type="submit"
                    sx={{ 
                      py: 1.5,
                      mt: 1
                    }}
                  >
                    File Complaint
                  </MDButton>
                </Grid>
              </Grid>
            </MDBox>
          </MDBox>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default GrievancePage;
