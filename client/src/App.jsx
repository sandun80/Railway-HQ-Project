import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import LoginPage from "./pages/loginPage";
import Layout from "./components/Layout";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import SendingPage from "./pages/SendingPage";
import ReceivingPage from "./pages/ReceivingPage";

function App(){
 return (
  <>
  
    <Routes>

      <Route 
        path="/" 
        element={<LoginPage />} 
      />


      <Route element={<Layout />}>

          <Route 
            path="/dashboard" 
            element={<Dashboard />} 
          />

          <Route 
            path="/letters/sending"
            element={SendingPage}
          />

          <Route 
          path="/letters/receiving"
          element={ReceivingPage}
          />

      </Route>


   </Routes>
    
  </>
 )
}

export default App;