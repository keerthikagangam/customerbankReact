import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

function BankCrud() {
  const [customers, setCustomers] = useState([]);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:8181/api/customers/list');
      setCustomers(response.data);
    } catch (error) {
      console.error('There was an error fetching the customers!', error);
    }
  };

  const isEmailValid = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const createCustomer = () => {
    if (!isEmailValid(email)) {
      setEmailError('Invalid email format');
      return;
    }
    axios.post('http://localhost:8181/api/customers/add', {
      fullName,
      email,
    })
      .then(response => {
        setCustomers([...customers, response.data]);
        setFullName('');
        setEmail('');
        setEmailError('');
      })
      .catch(error => {
        console.error('There was an error creating the customer!', error);
      });
  };

  const updateCustomer = (customer) => {
    if (!isEmailValid(email)) {
      setEmailError('Invalid email format');
      return;
    }
    axios.post(`http://localhost:8181/api/customers/updateProfile`, null, {
      params: { customerId: customer.id, fullName, email }
    })
      .then(response => {
        setCustomers(customers.map(c => (c.id === customer.id ? response.data : c)));
        setEditingCustomer(null);
        setFullName('');
        setEmail('');
        setEmailError('');
      })
      .catch(error => {
        console.error('There was an error updating the customer!', error);
      });
  };

  const deleteCustomer = (id) => {
    axios.delete(`http://localhost:8181/api/customers/delete/${id}`)
      .then(() => {
        setCustomers(customers.filter(customer => customer.id !== id));
      })
      .catch(error => {
        console.error('There was an error deleting the customer!', error);
      });
  };

  const handleEditClick = (customer) => {
    setEditingCustomer(customer);
    setFullName(customer.fullName);
    setEmail(customer.email);
    setEmailError('');
  };

  const handleSaveClick = () => {
    if (editingCustomer) {
      updateCustomer(editingCustomer);
    } else {
      createCustomer();
    }
  };

  return (
    <div className="container mt-5" style={{ backgroundColor: 'yellow' }}>
      <h1 className="text-center mb-4">React Axios CRUD Example</h1>
      <div className="row" style={{ backgroundColor: 'Pink' }}>
        <div className="col-md-6">
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
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
            {editingCustomer ? 'Update Customer' : 'Add Customer'}
          </button>
        </div>
        <div className="col-md-6" style={{ backgroundColor: 'lightblue' }}>
          <ul className="list-group">
            {customers.map(customer => (
              <li key={customer.id} className="list-group-item">
                <h2>{customer.fullName}</h2>
                <p>{customer.email}</p>
                <button
                  className="btn btn-warning me-2"
                  onClick={() => handleEditClick(customer)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => deleteCustomer(customer.id)}
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

export default BankCrud;
