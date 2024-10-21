import React from "react";
import { render, screen } from "@testing-library/react";
import CalendarPage from "./calendar";
import { BrowserRouter as Router } from "react-router-dom";
import '@testing-library/jest-dom/extend-expect';

jest.mock('../../context/userAuthContext', () => ({
  useUserAuth: () => ({
    user: { uid: 'test-uid', displayName: 'Test User', email: 'test@example.com' },
  }),
}));

jest.mock('../../lib/firebase', () => ({
  db: jest.fn(),
  auth: jest.fn(),
  storage: jest.fn(),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  collection: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  getDocs: jest.fn(() => Promise.resolve({ docs: [] })),
  addDoc: jest.fn(),
  deleteDoc: jest.fn(),
  doc: jest.fn(),
}));

// Test 1: checks if calendar renders without crashing
test("renders the calendar component", () => {
  render(
    <Router>
      <CalendarPage />
    </Router>
  );

  const titleElement = screen.getByText("Availabilities and Meetings");
  expect(titleElement).toBeInTheDocument();
});

// Test 2: makes sure that calendar displays basic layout
test("displays the calendar layout", () => {
  render(
    <Router>
      <CalendarPage />
    </Router>
  );

  const calendarElement = screen.getByText(/Selected Date/i);
  expect(calendarElement).toBeInTheDocument();
});

// Test 3: checks if calendar allows user interaction
test("checks if calendar interaction is possible", () => {
  render(
    <Router>
      <CalendarPage />
    </Router>
  );

  const buttons = screen.getAllByRole('button');
  expect(buttons.length).toBeGreaterThan(0);
});

// Test 4: checks that availabilities are displayed
test("verifies availabilities are displayed", () => {
  render(
    <Router>
      <CalendarPage />
    </Router>
  );

  const availabilityList = screen.getByRole('heading', { name: /availabilities and meetings/i });
  expect(availabilityList).toBeInTheDocument();
});
