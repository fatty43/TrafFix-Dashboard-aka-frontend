// import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import trafficBgImage from "assets/images/sinupp.jpg"; // Replace with actual path
import logo from "assets/images/logo.png"; // Logo image


const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `url(${trafficBgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        position: "relative",
        px: 2, // Adds padding for responsiveness

      }}
    >


{/* Logo at Top Left */}
<Box
        sx={{
          position: "absolute",
          top: 20,
          left: 20,
          display: "flex",
          alignItems: "center",
        }}
      >
        <img src={logo} alt="Logo" style={{ width: "300px", height: "auto" }} />
      </Box>






      {/* Signup Buttons at Top Right */}
      <Box
        sx={{
          position: "absolute",
          top: 20,
          right: 20,
          display: "flex",
          gap: 2,
        }}
      >
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#1976d2",
            color: "black !important",
            "&:hover": { backgroundColor: "#1565c0" },
          }}
          onClick={() => {
            localStorage.setItem("user", "user"); // storing role as 'user'
            navigate("/sign-up");
          }}
        >
          Sign Up as Driver
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#1976d2",
            color: "black !important",
            "&:hover": { backgroundColor: "#1565c0" },
          }}
          onClick={() => {
            localStorage.setItem("user", "admin"); // storing role as 'admin'
            navigate("/sign-up");
          }}
        >
          Sign Up as Officer
        </Button>
      </Box>

      {/* Centered Text Without Background */}
      <Box sx={{ px: 2 }}>
  <Typography
    variant="h3"
    sx={{
      fontFamily: "'Bebas Neue', sans-serif",
      fontSize: "40px",
      color: "#fff",
      letterSpacing: "3px",
      textTransform: "uppercase", // Optional: Makes text all caps for Bebas Neue style
      textShadow: "2px 2px 8px rgba(0,0,0,0.3)", // Optional: Adds a soft shadow
      mb: 2, // Adds margin below heading

    }}
  >
    Manage Your Traffic Documents with Ease
  </Typography>
  <Typography
    variant="body1"
    sx={{
      fontSize: "20px",
      color: "#fff",
      fontWeight: "400",
      maxWidth: "700px", // Prevents text from stretching too wide
      lineHeight: "1.8",
      display: "flex",
      flexDirection: "column",
      alignItems: "center", // Ensures text is centered properly
    }}
  >
          Keep all your traffic-related documents secure and accessible
          
        </Typography>
      </Box>
    </Box>
  );
};

export default WelcomePage;
