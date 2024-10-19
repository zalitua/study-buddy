import React from "react";
import { render, screen } from "@testing-library/react";
import ProfilePage from "./ProfilePage";
import { BrowserRouter as Router } from "react-router-dom";

const mockProfile = {
  username: "johndoe",
};

// test 1 - view data properly
test("renders username correctly", () => {
  render(
    <Router>
      <ProfilePage profileInfo={mockProfile} canEdit={false} />
    </Router>
  );

  expect(screen.getByText("johndoe")).toBeInTheDocument();
});

// test 2 - view default value in case of missing data
test("renders default value if first name field is empty", () => {
  render(
    <Router>
      <ProfilePage profileInfo={mockProfile} canEdit={false} />
    </Router>
  );

  expect(screen.getByText("No name")).toBeInTheDocument();
});

// test 3 - edit profile button doesn't render if canEdit is false
test('does not render "Edit Profile" link when canEdit is false', () => {
  render(
    <Router>
      <ProfilePage profileInfo={mockProfile} canEdit={false} />
    </Router>
  );

  expect(screen.queryByText("Edit Profile")).toBeNull();
});

// test 4 - edit profile button renders if canEdit is true
test('renders "Edit Profile" link when canEdit is true', () => {
  render(
    <Router>
      <ProfilePage profileInfo={mockProfile} canEdit={true} />
    </Router>
  );

  expect(screen.getByText("Edit Profile")).toBeInTheDocument();
});
