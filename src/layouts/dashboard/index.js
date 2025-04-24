// import Grid from "@mui/material/Grid";
import { Box } from "@mui/material";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Layout Components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Grid from "@mui/material/Grid";





import DashboardHero from "layouts/dashboard/components/Herosection";

function Dashboard() {
  return (
    <DashboardLayout>
      <DashboardNavbar />

      <Box sx={{ px: 3 }}>
      <Grid container spacing={3} alignItems="center" justifyContent="center">          {/* Right Section */}
          <Grid item xs={12} md={5}>
            <DashboardHero />
            <MDBox p={5}>
              {/* <LinkVehicle /> */}
              {/* <FeatureButtons /> */}
            </MDBox>
          </Grid>
        </Grid>
      </Box>

      <Footer />
    </DashboardLayout>
  );
}

export default Dashboard;
