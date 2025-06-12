

// Material Dashboard 2 React layouts
import Dashboard from "layouts/dashboard";
import Notifications from "layouts/notifications";

import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import GrievancePage from "layouts/grievance/grievance";
import UploadDocument from "layouts/documnts/UploadDocument"; 
import WelcomePage from "layouts/welcome/welcomepage";
import DocumentVerifier from "layouts/DocVerf/DocumentVerifier"
import ChallanGeneration from "layouts/challangen/chllangeneration";


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
    name: "Welcome",
    key: "welcome",
    icon: <Icon fontSize="small">home</Icon>,
    route: "/welcome",
    component: <WelcomePage />,

  },


  {
    type: "collapse",
    name: "Sign Up",
    key: "sign-up",
    icon: <Icon fontSize="small">assignment</Icon>,
    route: "/sign-up",
    component: <SignUp />,
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
    name: "Upload Document", // New Route
    key: "upload-document",
    icon: <Icon fontSize="small">upload_file</Icon>,
    route: "/upload-document",
    component: <UploadDocument />, // Ensure the path is correct
  },


 
  


  {
    type: "collapse",
    name: "Grievance",
    key: "grievance",
    icon: <Icon fontSize="small">report_problem</Icon>,
    route: "/grievance",
    component: <GrievancePage />,
  },
  {
    type: "collapse",
    name: "Document Verifier", // New Route
    key: "document-verifier",
    icon: <Icon fontSize="small">check_circle</Icon>,
    route: "/document-verifier",
    component: <DocumentVerifier />, 
  },
  
  {
    type: "collapse",
    name: "Challan Generation",
    key: "challan-generation",
    icon: <Icon fontSize="small">gavel</Icon>,
    route: "/challan-generation",
    component: <ChallanGeneration />,
  },
  
  
];



export default routes;