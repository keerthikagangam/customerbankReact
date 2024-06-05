import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

function AssignmentCrud() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the users!', error);
      });
  }, []);

  const isEmailValid = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const createUser = () => {
    if (!isEmailValid(email)) {
      setEmailError('Invalid email format');
      return;
    }
    axios.post('https://jsonplaceholder.typicode.com/users', {
      name,
      email,
    })
      .then(response => {
        setUsers([...users, response.data]);
        setName('');
        setEmail('');
        setEmailError('');
      })
      .catch(error => {
        console.error('There was an error creating the user!', error);
      });
  };

  // Update a user
  const updateUser = (user) => {
    if (!isEmailValid(email)) {
      setEmailError('Invalid email format');
      return;
    }
    axios.put(`https://jsonplaceholder.typicode.com/users/${user.id}`, user)
      .then(response => {
        setUsers(users.map(u => (u.id === user.id ? response.data : u)));
        setEditingUser(null);
        setName('');
        setEmail('');
        setEmailError('');
      })
      .catch(error => {
        console.error('There was an error updating the user!', error);
      });
  };

  // Delete a user
  const deleteUser = (id) => {
    axios.delete(`https://jsonplaceholder.typicode.com/users/${id}`)
      .then(() => {
        setUsers(users.filter(user => user.id !== id));
      })
      .catch(error => {
        console.error('There was an error deleting the user!', error);
      });
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setEmailError('');
  };

  const handleSaveClick = () => {
    if (editingUser) {
      updateUser({ ...editingUser, name, email });
    } else {
      createUser();
    }
  };

  return (
    <div className="container mt-5" style={{backgroundColor: 'yellow'}}>
      <h1 className="text-center mb-4">React Axios CRUD Example</h1>
      <div className="row" style={{backgroundColor: 'Pink'}}>
        <div className="col-md-6">
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <span className="text-danger">{emailError}</span>
          <button
            className="btn btn-primary mt-3"
            onClick={handleSaveClick}
          >
            {editingUser ? 'Update User' : 'Add User'}
          </button>
        </div>
        <div className="col-md-6" style={{backgroundColor: 'lightblue'}}>
          <ul className="list-group">
            {users.map(user => (
              <li key={user.id} className="list-group-item">
                <h2>{user.name}</h2>
                <p>{user.email}</p>
                <button
                  className="btn btn-warning me-2"
                  onClick={() => handleEditClick(user)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => deleteUser(user.id)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AssignmentCrud;
