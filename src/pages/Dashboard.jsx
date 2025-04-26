import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

function Dashboard() {
  const [userPolls, setUserPolls] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setMessage('Unauthorized access');
      return;
    }

    const fetchUserPolls = async () => {
      try {
        const res = await fetch('https://pollcraft-backend.onrender.com/api/polls/mypolls', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await res.json();

        if (res.ok) {
          setUserPolls(data);
        } else {
          setMessage(data.message || 'Failed to fetch your polls');
        }
      } catch (err) {
        setMessage('Error fetching polls');
      }
    };

    fetchUserPolls();
  }, [token]);

  const handleVote = async (pollId, optionIndex) => {
    try {
      const res = await fetch('https://pollcraft-backend.onrender.com/api/polls/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ pollId, optionIndex })
      });

      const data = await res.json();

      if (res.ok) {
        // Update poll state after vote
        setUserPolls(prevPolls =>
          prevPolls.map(p => p._id === pollId ? data.poll : p)
        );
      } else {
        alert(data.message || 'Voting failed');
      }
    } catch (err) {
      alert('Something went wrong while voting.');
    }
  };

  const hasVoted = (poll) => {
    const userId = JSON.parse(atob(token.split('.')[1])).id;
    return poll.votedUsers.includes(userId);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <h2>Welcome to your Dashboard</h2>
      <button onClick={() => navigate('/create')}>➕ Create New Poll</button>
      {message && <p>{message}</p>}

      <h3>Your Polls:</h3>
      {userPolls.length > 0 ? (
        userPolls.map((poll) => (
          <div key={poll._id} className="poll-card">
            <h4>{poll.question}</h4>
            <p><small>Created on: {new Date(poll.createdAt).toLocaleDateString()}</small></p>
            <ul>
              {poll.options.map((option, index) => (
                <li key={index}>
                  {option.text} - {option.votes} vote(s)
                  <br />
                  <button
                    onClick={() => handleVote(poll._id, index)}
                    disabled={hasVoted(poll)}
                  >
                    {hasVoted(poll) ? 'Already Voted' : 'Vote'}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <p>You haven't created any polls yet.</p>
      )}
    </div>
  );
}

export default Dashboard;
