import React from "react";
import { Grid, Button } from "@mui/material";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import StorefrontIcon from "@mui/icons-material/Storefront";

const features = [
  // { label: "Bike Insurance", icon: <DirectionsBikeIcon />, color: "secondary" },
  { label: "Car Insurance", icon: <DirectionsCarIcon />, color: "primary" },
  { label: "Challan generation", icon: <MonetizationOnIcon />, color: "success" },
  // { label: "Sell Your Car", icon: <StorefrontIcon />, color: "warning" },
];

const FeatureButtons = () => {
  return (
    <Grid container spacing={2} sx={{ p: 2 }}>
      {features.map((feature, index) => (
        <Grid item xs={6} sm={3} key={index}>
          <Button
            variant="contained"
            color={feature.color}
            fullWidth
            startIcon={feature.icon}
          >
            {feature.label}
          </Button>
        </Grid>
      ))}
    </Grid>
  );
};

export default FeatureButtons;
