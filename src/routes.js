

// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Notifications from "layouts/notifications";

import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import GrievancePage from "layouts/grievance/grievance";




// @mui icons
import Icon from "@mui/material/Icon";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    icon: <Icon fontSize="small">dashboard</Icon>,
    route: "/dashboard",
    component: <Dashboard />,
  },
  

  {
    type: "collapse",
    name: "profile",
    key: "profile",
    icon: <Icon fontSize="small">notifications</Icon>,
    route: "/profile",
    component: <profile />,
  },
  
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/authentication/sign-in",
    component: <SignIn />,
  },
  {
    type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "sign-up",
    component: <SignUp />,
  },


  {
    type: "collapse",
    name: "Grievance",
    key: "grievance",
    icon: <Icon fontSize="small">report_problem</Icon>,
    route: "/grievance",
    component: <GrievancePage />,
  },
  





];

export default routes;
