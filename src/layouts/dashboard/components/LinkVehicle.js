import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import KeyIcon from "@mui/icons-material/VpnKey";

const LinkVehicle = () => {
  return (
    <Card sx={{ m: 2, p: 2, display: "flex", alignItems: "center" }}>
      <KeyIcon fontSize="large" color="primary" sx={{ mr: 2 }} />
      <CardContent>
        <Typography variant="h6">Link Your Vehicle</Typography>
        <Typography variant="body2" color="textSecondary">
          Track RC status, pending challans, insurance expiry, and more
        </Typography>
      </CardContent>
      <Button variant="contained" color="primary">
        Add Vehicle
      </Button>
    </Card>
  );
};

export default LinkVehicle;
