import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import WorkTracking from './pages/WorkTracking';
import PurchaseRequest from './pages/PurchaseRequest';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/work-tracking" element={<WorkTracking />} />
          <Route path="/purchase-request" element={<PurchaseRequest />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

