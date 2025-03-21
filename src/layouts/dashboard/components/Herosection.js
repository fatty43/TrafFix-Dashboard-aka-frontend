import React from "react";
import { Grid, Box, Typography, Button } from "@mui/material";
import { styled } from "@mui/system";
// import docupl from "assets/images/docsupl.png";


const HeroSection = styled(Box)({
  backgroundColor: "FFFFFF", // Purple background
  color: "white",
  
  padding: "60px 20px",
  borderRadius: "0 0 0 0", // Curved bottom
  textAlign: "center",
});

const DashboardHero = () => {
  return (
    <HeroSection>
      <Grid container spacing={4} alignItems="center">
        {/* Left Side - Text */}
        <Grid item xs={19} md={14}>
          <Typography variant="h1" fontWeight="bold" gutterBottom >
            Your Safe And Secure Document Wallet
          </Typography>
          <Button variant="contained" color="black" 
         
        >
            Get Started
          </Button>
        </Grid>

        
      </Grid>
    </HeroSection>
  );
};

export default DashboardHero;
