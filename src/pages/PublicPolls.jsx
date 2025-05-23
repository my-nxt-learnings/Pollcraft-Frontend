import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';


import "../styles/PublicPolls.css"

function PublicPolls() {
  const [publicPolls, setPublicPolls] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublicPolls = async () => {
      try {
        const res = await fetch('https://pollcraft-backend.onrender.com/api/polls/public');
        const data = await res.json();

        if (res.ok) {
          setPublicPolls(data);
        } else {
          setMessage(data.message || 'Failed to fetch public polls');
        }
      } catch (err) {
        setMessage('Error fetching polls');
      }
    };

    fetchPublicPolls();
  }, []);

  const handleVote = async (pollId, optionIndex) => {
    const token = localStorage.getItem('token');
    if (!token) return alert('Please log in to vote');

    try {
      const res = await fetch('https://pollcraft-backend.onrender.com/api/polls/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ pollId, optionIndex }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Vote recorded!');
        // Update the poll options locally with the new vote count
        setPublicPolls((prevPolls) => 
          prevPolls.map((poll) => 
            poll._id === pollId ? { ...poll, options: data.poll.options } : poll
          )
        );
      } else {
        alert(data.message || 'Failed to vote');
      }
    } catch (err) {
      alert('Error voting');
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA46BE', '#FF66C4'];

function renderPollChart(options) {
  const data = options.map(option => ({
    name: option.text,
    value: option.votes
  }));

  return (
    <PieChart width={250} height={250}>
  <Pie
    data={data}
    dataKey="value"
    nameKey="name"
    cx="50%"
    cy="50%"
    outerRadius={80}
    fill="#8884d8"
   
  >
    {data.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
    ))}
  </Pie>
  <Tooltip />
  <Legend  wrapperStyle={{ marginTop: '50px' }}/>
</PieChart>
  );
}


  return (
    <div className="public-polls-container">
      <h2 className="public-polls-heading">Public Polls</h2>
      {message && <p className="error-message">{message}</p>}
      <div className="polls-list">
        {publicPolls.length > 0 ? (
          publicPolls.map((poll) => (
            <div key={poll._id} className="eachpoll">
              <strong className="poll-question">{poll.question}</strong>
              <p className="poll-creator">
                <em>Created by: {poll.createdBy.username}</em>
              </p>
              <div className="options-chart">
                <div className="poll-options">
                  {poll.options.map((option, index) => (
                    <div key={index} className="poll-option">
                      <button
                        className="vote-button"
                        onClick={() => handleVote(poll._id, index)}
                      >
                        {option.text} ({option.votes} votes)
                      </button>
                    </div>
                  ))}
                </div>
                <div className="poll-chart">{renderPollChart(poll.options)}</div>
              </div>
            </div>
          ))
        ) : (
          <p className="no-polls">No public polls available at the moment.</p>
        )}
      </div>
    </div>
  );
}

export default PublicPolls;
