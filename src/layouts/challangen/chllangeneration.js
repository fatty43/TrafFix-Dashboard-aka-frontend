// import React, { useState } from 'react';
import React, { useState } from 'react';  // Import useState from React

import { ethers } from 'ethers';
import { TextField, Button, Typography, CircularProgress, Card, Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { getWeb3, getChallanContract } from "services/trafficChallan"; // 

import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import signinImage from "assets/images/signInn.jpg"; // Import the image

function ChallanGeneration() {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [offense, setOffense] = useState('');
  const [fineAmount, setFineAmount] = useState('');
  const [date, setDate] = useState('');  // Date state
  const [time, setTime] = useState('');  // Time state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [challanId, setChallanId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleGenerateChallan = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');
    setChallanId(null);

    if (!vehicleNumber || !offense || !fineAmount || !date || !time) {  // Check if date and time are filled
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    try {
      const contract = await getChallanContract();
      const web3 = await getWeb3();


      const tx = await contract.generateChallan(
        vehicleNumber,
        offense,
        parseInt(fineAmount),
        date,  // Include date
        time   // Include time
      );

      const receipt = await tx.wait();
      const event = receipt.events.find((e) => e.event === 'ChallanGenerated');

      if (event && event.args) {
        const newChallanId = event.args.challanId;
        setChallanId(newChallanId.toString());
        setSuccessMessage(`Challan generated successfully! Challan ID: ${newChallanId}`);
      } else {
        setError('Challan generated but no ID found.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to generate challan. Please try again.');
    }

    setLoading(false);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="calc(100vh - 100px)"
        p={2}
        sx={{
          backgroundImage: `url(${signinImage})`, // Use the imported image
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      > 
        <Card sx={{ padding: 4, width: '100%', maxWidth: 500 }}>
          <Typography variant="h4" gutterBottom align="center">
            Traffic Challan
          </Typography>
          <form onSubmit={handleGenerateChallan}>
            <TextField
              label="Vehicle Number"
              fullWidth
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="offense-label">Offense</InputLabel>
              <Select
                labelId="offense-label"
                id="offense-select"
                value={offense}
                onChange={(e) => setOffense(e.target.value)}
                label="Offense"
              >
                <MenuItem value="Over Speeding">Over Speeding</MenuItem>
                <MenuItem value="Signal Violation">Signal Violation</MenuItem>
                <MenuItem value="No Helmet">No Helmet</MenuItem>
                <MenuItem value="Driving Without License">Driving Without License</MenuItem>
                <MenuItem value="No Number Plate">No Number Plate</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Fine Amount (in Ether)"
              fullWidth
              type="number"
              value={fineAmount}
              onChange={(e) => setFineAmount(e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Date"
              fullWidth
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              variant="outlined"  // Ensures the label floats above the input
              sx={{ mb: 2 }}
             
            />
            <TextField
              label="Time"
              fullWidth
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              variant="outlined"  // Ensures the label floats above the input
              sx={{ mb: 2 }}
            />

            <Button
              variant="contained"
              color="primary"
              fullWidth
              type="submit"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate Challan'}
            </Button>
          </form>

          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          {successMessage && (
            <Typography color="success.main" sx={{ mt: 2 }}>
              {successMessage}
            </Typography>
          )}
          {challanId && (
            <Typography sx={{ mt: 2 }}>
              Challan ID: <strong>{challanId}</strong>
            </Typography>
          )}
        </Card>
      </Box>
    </DashboardLayout>
  );
}

export default ChallanGeneration;
