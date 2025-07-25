import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import CreateElection from './components/CreateElection';
import ViewResults from './components/ViewResults';
import DeleteElection from './components/DeleteElection';
import AdminRegister from './components/AdminRegister';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/delete" element={<DeleteElection />} />
        <Route path="/create" element={<CreateElection />} />
        <Route path="/results" element={<ViewResults />} />
      </Routes>
    </Router>
  );
}

export default App;
