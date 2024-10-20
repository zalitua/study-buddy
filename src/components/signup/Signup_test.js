import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Signup from './Signup'; // Import your Signup component

// Mocking necessary contexts or services
jest.mock('../../context/userAuthContext', () => ({
  useUserAuth: () => ({
    signUp: jest.fn().mockResolvedValue({
      user: { uid: '123', email: 'test@example.com' }
    }),
    logIn: jest.fn()
  })
}));

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn()
}));

// Mocking toast to verify it is called correctly
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

describe('Signup Component', () => {
  test('successfully signs up a user, awards 10 points, and shows a toast message', async () => {
    render(<Signup />);

    // Simulate user typing in the email and password
    fireEvent.change(screen.getByPlaceholderText('Email address'), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByText('Sign up'));

    // Assert that the toast message for successful signup is displayed
    await expect(screen.findByText('Signup successful! You\'ve earned 10 points.')).toBeInTheDocument();

    // Additional checks can be made here, such as verifying calls to your context functions
  });
});
