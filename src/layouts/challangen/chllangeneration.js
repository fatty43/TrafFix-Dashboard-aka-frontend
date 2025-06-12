// React and hooks
import React, { useState } from "react";
// MetaMask and contract methods
import { getWeb3, getChallanContract } from "services/trafficChallan";

// Material-UI components
import Card from "@mui/material/Card";
import { MenuItem, Select, TextField, Grid } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Layout
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// Images
import bgImage from "assets/images/signInn.jpg";
// Toast styles
import "react-toastify/dist/ReactToastify.css";

function ChallanGeneration() {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [offense, setOffense] = useState("Over Speeding");
  const [fineAmount, setFineAmount] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [challanId, setChallanId] = useState(null);

  // Offense categories
  const offenseTypes = [
    "Over Speeding",
    "Signal Violation",
    "No Helmet",
    "Driving Without License",
    "No Number Plate"
  ];

  const handleGenerateChallan = async (e) => {
    e.preventDefault();
    setLoading(true);
    setChallanId(null);

    if (!vehicleNumber || !offense || !fineAmount || !date || !time) {
      toast.error("All fields are required.");
      setLoading(false);
      return;
    }

    try {
      const web3 = await getWeb3();
      const contract = await getChallanContract(web3);
      const accounts = await web3.eth.getAccounts();

      await contract.methods
        .generateChallan(vehicleNumber, offense, parseInt(fineAmount), date, time)
        .send({ from: accounts[0] })
        .on("receipt", (receipt) => {
          const event = receipt.events.ChallanGenerated;
          if (event && event.returnValues) {
            const newChallanId = event.returnValues.challanId;
            setChallanId(newChallanId);
            toast.success(`Challan generated successfully! Challan ID: ${newChallanId}`);
          } else {
            toast.error('Challan generated but no ID found.');
          }
        });
    } catch (err) {
      console.error("Error:", err);
      toast.error('Failed to generate challan. Please try again.');
    }

    setLoading(false);
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
              Generate Traffic Challan
            </MDTypography>
          </MDBox>

          <MDBox pt={4} pb={3} px={3}>
            <MDBox component="form" onSubmit={handleGenerateChallan}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <MDInput 
                    label="Vehicle Number" 
                    fullWidth 
                    value={vehicleNumber} 
                    onChange={(e) => setVehicleNumber(e.target.value)}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <Select
                    fullWidth
                    value={offense}
                    onChange={(e) => setOffense(e.target.value)}
                    sx={{ 
                      height: "45px",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(0, 0, 0, 0.23)"
                      }
                    }}
                  >
                    {offenseTypes.map((type, idx) => (
                      <MenuItem key={idx} value={type}>{type}</MenuItem>
                    ))}
                  </Select>
                </Grid>

                <Grid item xs={12}>
                  <MDInput 
                    label="Fine Amount (in Wei)" 
                    type="number"
                    fullWidth 
                    value={fineAmount} 
                    onChange={(e) => setFineAmount(e.target.value)}
                    required
                  />
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
                  <MDButton
                    variant="gradient"
                    color="info"
                    fullWidth
                    type="submit"
                    disabled={loading}
                    sx={{ 
                      py: 1.5,
                      mt: 1
                    }}
                  >
                    {loading ? "Generating..." : "Generate Challan"}
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

export default ChallanGeneration;
