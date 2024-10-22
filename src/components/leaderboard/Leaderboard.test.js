import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { act } from 'react';
import Leaderboard from "./Leaderboard";
import { BrowserRouter as Router } from "react-router-dom";
import '@testing-library/jest-dom/extend-expect';

// Mock Firestore methods
jest.mock('firebase/firestore', () => ({
    getFirestore: jest.fn(),
    collection: jest.fn(),
    query: jest.fn(),
    orderBy: jest.fn(),
    limit: jest.fn(),
    onSnapshot: jest.fn((query, callback) => {
      const mockData = Array.from({ length: 10 }, (_, i) => ({
        id: `user${i + 1}`,
        data: () => ({
          username: `User${i + 1}`,
          points: (i + 1) * 10,
        }),
      }));
  
      // Simulate the data being returned to the snapshot
      callback({
        docs: mockData.map(user => ({
          id: user.id,
          data: user.data,
        })),
      });
  
      // Return a mock unsubscribe function to avoid errors
      return jest.fn();
    }),
  }));
  
  // Mock Firebase Auth
  jest.mock('firebase/auth', () => ({
    getAuth: jest.fn(),
    currentUser: {
      uid: 'test-uid',
      displayName: 'Test User',
      email: 'test@example.com',
    },
  }));
  
  // Mock Firebase Storage to avoid potential ReadableStream issues
  jest.mock('firebase/storage', () => ({
    getStorage: jest.fn(),
  }));
  
  //test 1
  test("renders the leaderboard component", async () => {
    // Act block to wrap the async render call
    await act(async () => {
      render(
        <Router>
          <Leaderboard />
        </Router>
      );
    });
  
    // Wait for the "Leaderboard" element to appear in the DOM after loading completes
    const titleElement = await waitFor(() => screen.getByText("Leaderboard"));
    expect(titleElement).toBeInTheDocument();
  });

  //test 2
  test("should display top 10 users on the leaderboard", async () => {
    render(
      <Router>
        <Leaderboard />
      </Router>
    );
  
    // Correctly counts 11 rows (1 header + 10 user rows)
    await waitFor(() => {
      expect(screen.getAllByRole('row')).toHaveLength(11);
    });
  });

  //test 3
  test("should display current user’s rank", async () => {
    render(
      <Router>
        <Leaderboard />
      </Router>
    );
  
    await waitFor(() => {
      expect(screen.getByText('Your Position')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument(); // Assuming test user is rank 1
    });
  });

  //test 4
  test("should reflect real-time data updates on leaderboard", async () => {
    render(
      <Router>
        <Leaderboard />
      </Router>
    );
  
    // Initial data render
    await waitFor(() => {
      expect(screen.getByText('User1')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument(); // Initial points for User1
    });
  
    // Updated data after real-time update
    await waitFor(() => {
      expect(screen.getByText('UpdatedUser1')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument(); // Updated points for User1
    });
  });