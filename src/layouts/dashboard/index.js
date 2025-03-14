// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import LinkVehicle from "layouts/dashboard/components/LinkVehicle";
import FeatureButtons from "layouts/dashboard/components/FeatureButtons";
import DashboardHero from "layouts/dashboard/components/Herosection"; 



import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";

function Dashboard() {
  // const { sales, tasks } = reportsLineChartData;
return (
  <DashboardLayout>
      <DashboardNavbar />
      {/* <h1 style={{ textAlign: "center", color: "bloack" }}>Document Wallet To Empower Citizens</h1> */}
      <DashboardHero /> {/* New Curved Section */}
      <MDBox p={2}>
        <LinkVehicle />
        <FeatureButtons />
      </MDBox>
    </DashboardLayout>
  );
};

export default Dashboard;