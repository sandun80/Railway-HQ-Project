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
import ReplayDashboard from "./pages/replayDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminPortal from "./pages/AdminPortal";
import UserManagemnt from "./pages/UserMngAdmin";

function App(){
 return (
  <>
  
    <Routes>

      <Route 
        path="/" 
        element={<LoginPage />} 
      />


      <Route element={<ProtectedRoute>
          <Layout />
        </ProtectedRoute>
        }>

          <Route 
            path="/dashboard" 
            element={<ProtectedRoute allowedRoles={['officer']}>
                  <Dashboard />
              </ProtectedRoute>} 
          />

          <Route
            path="/admin"
            element={
                <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminPortal />
                </ProtectedRoute>
            }
        />

          <Route path="/letters/sending" element={<ProtectedRoute allowedRoles={['officer']}><SendingPage /></ProtectedRoute>}>
            <Route index element={<Navigate to="registered" replace />} />
            <Route path="registered" element={<RegisteredLetter />} />
            <Route path="normal" element={<NormalLetter />} />
            <Route path="byhand" element={<Byhand />} />
          </Route>

          <Route path="/letters/receiving" element={<ProtectedRoute allowedRoles={['officer']}><ReceivingPage /></ProtectedRoute>}>
            <Route index element={<Navigate to="registered" replace />} />
            <Route path="registered" element={<RegisteredRecieve />} />
            <Route path="normal" element={<NormalReceive />}/>
            <Route path="byhand" element={< ByhandReceive/>} />
          </Route>

          <Route 
            path="/letters/receiving"
            element={<ProtectedRoute allowedRoles={['officer']}><ReceivingPage /></ProtectedRoute>}
          />

          <Route 
            path="/reports"
            element={<ProtectedRoute allowedRoles={['officer']}><Reports /></ProtectedRoute>}
          />
          
          <Route 
            path="/allletters"
            element={<ProtectedRoute allowedRoles={['officer', 'viewer']}>
                  <AllLetters />
              </ProtectedRoute>}
          />

          <Route
            path="/inbox"
            element={<ProtectedRoute excludedRoles={['officer', 'viewer', 'admin']}><ReplayDashboard /></ProtectedRoute>}
          />

          <Route
            path="/userlist"
            element={
                <ProtectedRoute allowedRoles={["admin"]}>
                    <UserManagemnt />
                </ProtectedRoute>
            }
        />

      </Route>


   </Routes>
    
  </>
 )
}

export default App;