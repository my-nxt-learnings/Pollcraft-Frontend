import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import RequireAuth from './components/RequireAuth';
import PollList from './components/PollList';
import CreatePoll from './components/CreatePoll';
import PublicPolls from './pages/PublicPolls';

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ padding: '1rem' }}>
      <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/dashboard" element={
    <RequireAuth>
      <Dashboard />
    </RequireAuth>
  } />
  <Route path="/" element={<PollList />} />
  <Route path="/create" element={<RequireAuth><CreatePoll /></RequireAuth>} />
  <Route path="/public" element={<PublicPolls />} />
</Routes>
      </div>
    </Router>
  );
}

export default App;
