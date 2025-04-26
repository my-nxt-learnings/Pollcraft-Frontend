import { useState } from 'react';
import '../styles/CreatePoll.css';

function CreatePoll() {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']); // Start with 2 options
  const [isPublic, setIsPublic] = useState(true);
  const [expiresAt, setExpiresAt] = useState('');
  const [message, setMessage] = useState('');

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, '']);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return setMessage('Please login to create a poll');
    console.log("Token:", token);

    const res = await fetch('https://pollcraft-backend.onrender.com/api/polls/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ question, options, isPublic, expiresAt })
    });

    const data = await res.json();
    if (res.ok) {
      setMessage('Poll created successfully!');
      setQuestion('');
      setOptions(['', '']);
      setIsPublic(true);
      setExpiresAt('');
    } else {
      setMessage(data.message || 'Failed to create poll');
    }
  };

  return (
    <div className="create-poll">
      <h2>Create a New Poll</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Poll question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />

        {options.map((opt, idx) => (
          <input
            key={idx}
            type="text"
            placeholder={`Option ${idx + 1}`}
            value={opt}
            onChange={(e) => handleOptionChange(idx, e.target.value)}
            required
          />
        ))}

        <button type="button" onClick={addOption}>Add Option</button>

        <label>
          Public Poll:
          <input
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
          />
        </label>

        <label>
          Expiration Date (optional):
          <input
            type="datetime-local"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
          />
        </label>

        <button type="submit">Create Poll</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default CreatePoll;
