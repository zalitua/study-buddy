//tests for the forum page

import ForumPage from "./ForumPages.jsx";

import { render, fireEvent, screen  } from "@testing-library/react";

import { auth, db } from "../../../lib/firebase.js";

jest.mock("../../../lib/firebase", () => ({
    auth: {
      onAuthStateChanged: jest.fn(),
      currentUser: {
        uid: "mockUserId",
      },
    },
    db: {
      collection: jest.fn(),
      doc: jest.fn(),
      getDoc: jest.fn(),
    },
}));

// Mock implementation of Firebase methods
beforeEach(() => {
    // Mock onAuthStateChanged to call its callback immediately
    auth.onAuthStateChanged.mockImplementation((callback) => {
      callback({
        uid: "mockUserId",
      });
    });
  
    // Mock Firestore `getDoc` function to return a fake forum name
    db.getDoc.mockResolvedValue({
      exists: () => true,
      data: () => ({
        name: "Mock Forum Name",
      }),
    });
  
    // Mock Firestore real-time updates (onSnapshot)
    db.collection.mockReturnValue({
      onSnapshot: jest.fn((callback) => {
        callback({
          docs: [
            { id: "1", data: () => ({ text: "Hello", senderName: "User1", createdAt: { toDate: () => new Date() } }) },
          ],
        });
      }),
    });

    jest.mock('react-router-dom', () => ({
        useParams: () => ({ forumId: '1'}),
      }));
  });


//test msg
/*test("test that a msg is empty when run with out any imput", () => {
    render(<ForumPage />);


});
*/

//test user specific info

//test forums name


test("input for sending messagas should be rendered", () => {
    render(<ForumPage />);
    const userInputElement = screen.getByPlaceholderText(/Type your message.../i);
    expect(userInputElement).toBeInTheDocument();

});


