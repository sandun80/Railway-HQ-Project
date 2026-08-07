import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import LoginPage from "./pages/loginPage";
import Layout from "./components/Layout";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import SendingPage from "./pages/SendingPage";
import ReceivingPage from "./pages/ReceivingPage";
import Reports from "./pages/Reports";

import RegisteredLetter from "./pages/registeredLetters";
import NormalLetter from "./pages/NormalLetter";
import RegisteredRecieve from "./pages/RegisteredRecieve";
import Byhand from "./pages/ByhandLetter";
import NormalReceive from "./pages/NormalReceive";
import ByhandReceive from "./pages/ByhandRecieve";
import AllLetters from "./pages/AllLetter";

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

          <Route path="/letters/sending" element={<SendingPage />}>
            <Route index element={<Navigate to="registered" replace />} />
            <Route path="registered" element={<RegisteredLetter />} />
            <Route path="normal" element={<NormalLetter />} />
            <Route path="byhand" element={<Byhand />} />
          </Route>

          <Route path="/letters/receiving" element={<ReceivingPage />}>
            <Route index element={<Navigate to="registered" replace />} />
            <Route path="registered" element={<RegisteredRecieve />} />
            <Route path="normal" element={<NormalReceive />}/>
            <Route path="byhand" element={< ByhandReceive/>} />
          </Route>

          <Route 
            path="/letters/receiving"
            element={<ReceivingPage />}
          />

          <Route 
            path="/reports"
            element={<Reports />}
          />
          
          <Route 
            path="/allletters"
            element={<AllLetters />}
          />

      </Route>


   </Routes>
    
  </>
 )
}

export default App;