const API_BASE = 'http://localhost:5000/api'; // update when deployed

export async function registerUser(userData) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData)
  });

  return res.json();
}

export async function loginUser(userData) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData)
  });

  return res.json();
}

export async function getPublicPolls() {
    const res = await fetch(`${API_BASE}/polls/public`);
    return res.json();
  }
  
  export async function votePoll(data, token) {
    const res = await fetch(`${API_BASE}/polls/vote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return res.json();
  }
  