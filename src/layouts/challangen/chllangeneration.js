// import React, { useState } from 'react';
 import React, { useState } from 'react';

import {
  TextField,
  Button,
  Typography,
  CircularProgress,
  Card,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from '@mui/material';

import { getWeb3, getChallanContract } from "services/trafficChallan";

import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import signinImage from "assets/images/signInn.jpg";

function ChallanGeneration() {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [offense, setOffense] = useState('');
  const [fineAmount, setFineAmount] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
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

    if (!vehicleNumber || !offense || !fineAmount || !date || !time) {
      setError('Please fill in all fields.');
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
            setSuccessMessage(`Challan generated successfully! Challan ID: ${newChallanId}`);
          } else {
            setError('Challan generated but no ID found.');
          }
        });
    } catch (err) {
      console.error("Error:", err);
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
          backgroundImage: `url(${signinImage})`,
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
            <TextField label="Vehicle Number" fullWidth value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)} sx={{ mb: 2 }} />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="offense-label">Offense</InputLabel>
              <Select
                labelId="offense-label"
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
            <TextField label="Fine Amount (in Wei)" type="number" fullWidth value={fineAmount} onChange={(e) => setFineAmount(e.target.value)} sx={{ mb: 2 }} />
            <TextField label="Date" type="date" fullWidth value={date} onChange={(e) => setDate(e.target.value)} InputLabelProps={{ shrink: true }} sx={{ mb: 2 }} />
            <TextField label="Time" type="time" fullWidth value={time} onChange={(e) => setTime(e.target.value)} InputLabelProps={{ shrink: true }} sx={{ mb: 2 }} />
            <Button type="submit" variant="contained" fullWidth color="primary" disabled={loading}>
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate Challan'}
            </Button>
          </form>

          {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
          {successMessage && <Typography color="success.main" sx={{ mt: 2 }}>{successMessage}</Typography>}
          {challanId && <Typography sx={{ mt: 2 }}>Challan ID: <strong>{challanId}</strong></Typography>}
        </Card>
      </Box>
    </DashboardLayout>
  );
}

export default ChallanGeneration;
