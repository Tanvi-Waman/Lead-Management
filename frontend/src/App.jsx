import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import Users from "./pages/User";
import Tags from "./pages/Tags";
import ImportExport from "./pages/ImportExport";
import ActivityLogs from "./pages/ActivityLogs";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/users" element={<Users />} />
        <Route path="/tags" element={<Tags />} />
        <Route path="/import-export" element={<ImportExport />} />
        <Route path="/activitylogs" element={<ActivityLogs />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
