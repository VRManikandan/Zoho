import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Customers from "./pages/Customers";
import Vendors from "./pages/Vendors";
import Items from "./pages/Items";
import Taxes from "./pages/Taxes";
import Expenses from "./pages/Expenses";
import Banking from "./pages/Banking";
import Notifications from "./pages/Notifications";
import Reminders from "./pages/Reminders";
import Dashboard from "./pages/Dashboard";
// import bills from "./pages/Bills";
// import Invoices from "./pages/invoices";
// import Reports from "./pages/Reports";
// import Payments from "./pages/Payments";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/customers" element={<Customers />} />
        <Route path="/vendors" element={<Vendors />} />
        <Route path="/items" element={<Items />} />
        <Route path="/taxes" element={<Taxes />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/banking" element={<Banking />} />
        <Route path="/notifications" element={<Notifications />} />
        {/* <Route path="/bills" element={<Bills />} /> */}
        <Route path="/dashboard" element={<Dashboard />} />
        {/* <Route path="/invoices" element={<Invoices />} /> */}
        {/* <Route path="/reports" element={<Reports />} /> */}
        {/* <Route path="/settings" element={<Settings />} /> */}
        <Route path="/reminders" element={<Reminders />} />  
        {/* <Route path="/payments" element={<Payments />} />   */}
      </Routes>
    </Router>
  );
}

export default App;
