import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { OrganizationProvider } from "./context/OrganizationContext";
import Layout from "./layouts/MainLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Vendors from "./pages/Vendors";
import Items from "./pages/Items";
import Taxes from "./pages/Taxes";
import Expenses from "./pages/Expenses";
import Banking from "./pages/Banking";
import Notifications from "./pages/Notifications";
import Reminders from "./pages/Reminders";
import Invoices from "./pages/Invoices";
import Estimates from "./pages/Estimates";
import SalesOrders from "./pages/SalesOrders";
import PurchaseOrders from "./pages/PurchaseOrders";
import Bills from "./pages/Bills";
import Payments from "./pages/Payments";
import ChartOfAccounts from "./pages/ChartOfAccounts";
import JournalEntries from "./pages/JournalEntries";
import Projects from "./pages/Projects";
import TimeTracking from "./pages/TimeTracking";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Inventory from "./pages/Inventory";

function App() {
  return (
    <AuthProvider>
      <OrganizationProvider>
        <Router>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="customers" element={<Customers />} />
              <Route path="vendors" element={<Vendors />} />
              <Route path="items" element={<Items />} />
              <Route path="taxes" element={<Taxes />} />
              <Route path="expenses" element={<Expenses />} />
              <Route path="banking" element={<Banking />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="reminders" element={<Reminders />} />
              <Route path="invoices" element={<Invoices />} />
              <Route path="estimates" element={<Estimates />} />
              <Route path="payments" element={<Payments />} />
              <Route path="sales-orders" element={<SalesOrders />} />
              <Route path="purchase-orders" element={<PurchaseOrders />} />
              <Route path="bills" element={<Bills />} />
              <Route path="chart-of-accounts" element={<ChartOfAccounts />} />
              <Route path="journal-entries" element={<JournalEntries />} />
              <Route path="projects" element={<Projects />} />
              <Route path="time-tracking" element={<TimeTracking />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
      </OrganizationProvider>
    </AuthProvider>
  );
}

export default App;
