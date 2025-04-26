import '../styles/PollItem.css';

function PollItem({ poll, onVote }) {
  return (
    <div className="poll-item">
      <h3>{poll.question}</h3>
      <p>Created by: {poll.createdBy?.username || 'Anonymous'}</p>
      <ul>
        {poll.options.map((option, index) => (
          <li key={index}>
            {option.text} — {option.votes} votes
            <button onClick={() => onVote(poll._id, index)}>Vote</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PollItem;
