import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import RentalForm from './pages/RentalForm';
import RentalHistory from './pages/RentalHistory';
import Cars from './pages/Cars';
import RentalSummary from './pages/RentalSummary';
import RentalDetails from './pages/RentalDetails';
import Report from './pages/Report';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="rentals/new" element={<RentalForm />} />
          <Route path="rentals" element={<RentalHistory />} />
          <Route path="rental/:id" element={<RentalDetails />} />
          <Route path="cars" element={<Cars />} />
          <Route path="report" element={<Report />} />
          <Route path="rental-summary" element={<RentalSummary />} />
        </Route>
      </Routes>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;