import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/Home.css';

function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="home-container">
      <h1>Welcome to PollCraft</h1>
      <p>
        PollCraft is a simple and intuitive app that lets you <strong>create, vote, and manage polls</strong> with ease. 
        Whether you're making decisions with friends, gathering opinions, or running quick surveys — PollCraft has you covered.
      </p>

      <div className="home-buttons">
        {isLoggedIn ? (
          <button onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
        ) : (
          <>
            <button onClick={() => navigate('/login')}>Login</button>
            <button onClick={() => navigate('/register')}>Register</button>
          </>
        )}
        <button onClick={() => navigate('/public')}>View Public Polls</button>
      </div>
    </div>
  );
}

export default Home;
