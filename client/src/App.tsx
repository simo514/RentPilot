import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import RentalForm from './pages/RentalForm';
import RentalHistory from './pages/RentalHistory';
import Cars from './pages/Cars';
import RentalDetails from './pages/RentalDetails';

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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;