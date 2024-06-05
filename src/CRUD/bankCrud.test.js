import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BankCrud from './bankCrud';

// Mocking the API functions
const mockFetchCustomers = jest.fn();
const mockCreateCustomer = jest.fn();
const mockUpdateCustomer = jest.fn();
const mockDeleteCustomer = jest.fn();

jest.mock('axios', () => ({
  get: (url) => mockFetchCustomers(url),
  post: (url, data) => {
    if (url.includes('/add')) {
      return mockCreateCustomer(data);
    } else if (url.includes('/updateProfile')) {
      return mockUpdateCustomer(data);
    }
  },
  delete: (url) => mockDeleteCustomer(url),
}));

describe('BankCrud Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('fetches and displays customers', async () => {
    const customers = [
      { id: 1, fullName: 'John Doe', email: 'john@example.com' },
      { id: 2, fullName: 'Jane Doe', email: 'jane@example.com' }
    ];

    mockFetchCustomers.mockResolvedValue({ data: customers });

    render(<BankCrud />);

    await waitFor(() => {
      customers.forEach(customer => {
        expect(screen.getByText(customer.fullName)).toBeInTheDocument();
        expect(screen.getByText(customer.email)).toBeInTheDocument();
      });
    });
  });

  test('adds a new customer', async () => {
    const newCustomer = { id: 3, fullName: 'New Customer', email: 'new@example.com' };

    mockCreateCustomer.mockResolvedValue({ data: newCustomer });

    render(<BankCrud />);

    fireEvent.change(screen.getByPlaceholderText('Full Name'), { target: { value: newCustomer.fullName } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: newCustomer.email } });
    fireEvent.click(screen.getByText('Add Customer'));

    await waitFor(() => {
      expect(mockCreateCustomer).toHaveBeenCalledWith({
        fullName: newCustomer.fullName,
        email: newCustomer.email
      });
      expect(screen.getByText(newCustomer.fullName)).toBeInTheDocument();
      expect(screen.getByText(newCustomer.email)).toBeInTheDocument();
    });
  });

  test('updates an existing customer', async () => {
    const existingCustomer = { id: 1, fullName: 'John Doe', email: 'john@example.com' };
    const updatedCustomer = { ...existingCustomer, fullName: 'Updated Name', email: 'updated@example.com' };

    mockFetchCustomers.mockResolvedValue({ data: [existingCustomer] });
    mockUpdateCustomer.mockResolvedValue({ data: updatedCustomer });

    render(<BankCrud />);

    await waitFor(() => {
      fireEvent.click(screen.getByText('Edit'));
    });

    fireEvent.change(screen.getByPlaceholderText('Full Name'), { target: { value: updatedCustomer.fullName } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: updatedCustomer.email } });
    fireEvent.click(screen.getByText('Update Customer'));

    await waitFor(() => {
      expect(mockUpdateCustomer).toHaveBeenCalledWith({
        params: { customerId: updatedCustomer.id, fullName: updatedCustomer.fullName, email: updatedCustomer.email }
      });
      expect(screen.getByText(updatedCustomer.fullName)).toBeInTheDocument();
      expect(screen.getByText(updatedCustomer.email)).toBeInTheDocument();
    });
  });

  test('deletes a customer', async () => {
    const customers = [
      { id: 1, fullName: 'John Doe', email: 'john@example.com' },
      { id: 2, fullName: 'Jane Doe', email: 'jane@example.com' }
    ];

    mockFetchCustomers.mockResolvedValue({ data: customers });
    mockDeleteCustomer.mockResolvedValue();

    render(<BankCrud />);

    await waitFor(() => {
      fireEvent.click(screen.getByText('Delete'));
    });

    await waitFor(() => {
      expect(mockDeleteCustomer).toHaveBeenCalledWith('http://localhost:8181/api/customers/delete/1');
      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });
  });

  // Add more test cases as needed...

});
