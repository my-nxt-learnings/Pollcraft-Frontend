import { useState, useEffect } from 'react';

function PollsList() {
  const [polls, setPolls] = useState([]);
  const [message, setMessage] = useState('');

  // Fetch polls from backend
  useEffect(() => {
    const fetchPolls = async () => {
      const res = await fetch('http://localhost:5000/api/polls/public');
      const data = await res.json();
      setPolls(data);
    };

    fetchPolls();
  }, []);

  const handleVote = async (pollId, optionIndex) => {
    const token = localStorage.getItem('token');
    if (!token) return setMessage('Please login to vote');

    const res = await fetch('http://localhost:5000/api/polls/vote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ pollId, optionIndex }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage('Vote recorded');
      setPolls(polls.map((poll) => (poll._id === pollId ? data.poll : poll)));
    } else {
      setMessage(data.message || 'Failed to vote');
    }
  };

  return (
    <div>
      <h2>Public Polls</h2>
      {message && <p>{message}</p>}
      <ul>
        {polls.map((poll) => (
          <li key={poll._id}>
            <h3>{poll.question}</h3>
            <ul>
              {poll.options.map((option, index) => (
                <li key={index}>
                  {option.text} ({option.votes} votes)
                  <button onClick={() => handleVote(poll._id, index)}>
                    Vote
                  </button>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PollsList;
