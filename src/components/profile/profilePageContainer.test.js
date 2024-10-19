import React from "react";
import { render, screen } from "@testing-library/react";
import ProfilePageContainer from "./ProfilePageContainer";
import { useProfile } from "../../../context/ProfileContext";
import { useParams } from "react-router-dom";
import { loadProfile } from "../loadProfile";
import ProfilePage from "./ProfilePage";

// Mock dependencies
jest.mock("../../context/ProfileContext", () => ({
  useProfile: jest.fn(),
}));
jest.mock("react-router-dom", () => ({
  useParams: jest.fn(),
}));
jest.mock("./loadProfile", () => ({
  loadProfile: jest.fn(),
}));

jest.mock("./ProfilePage", () => () => <div>Mocked ProfilePage</div>);

describe("ProfilePageContainer", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks between tests
  });

  test("renders loading state initially", () => {
    useProfile.mockReturnValue({
      profileData: null,
      fetchUserProfile: jest.fn(),
      loading: true,
    });

    useParams.mockReturnValue({ userId: null });

    render(<ProfilePageContainer />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  test("calls loadProfile when userId is present", () => {
    const mockFetchUserProfile = jest.fn();
    useProfile.mockReturnValue({
      profileData: null,
      fetchUserProfile: mockFetchUserProfile,
      loading: false,
    });

    useParams.mockReturnValue({ userId: "123" });

    render(<ProfilePageContainer />);

    expect(loadProfile).toHaveBeenCalledWith(
      "123", // userId
      mockFetchUserProfile, // fetchUserProfile function
      expect.any(Function), // setOtherProfileData
      expect.any(Function) // setLoading
    );
  });

  test('renders "No profile data available" when displayProfile is null', () => {
    useProfile.mockReturnValue({
      profileData: null,
      fetchUserProfile: jest.fn(),
      loading: false,
    });

    useParams.mockReturnValue({ userId: null });

    render(<ProfilePageContainer />);

    expect(screen.getByText("No profile data available")).toBeInTheDocument();
  });

  test("renders ProfilePage with correct props when profile data is available", () => {
    const mockProfileData = {
      username: "johndoe",
      firstName: "John",
      lastName: "Doe",
    };

    useProfile.mockReturnValue({
      profileData: mockProfileData,
      fetchUserProfile: jest.fn(),
      loading: false,
    });

    useParams.mockReturnValue({ userId: null });

    render(<ProfilePageContainer />);

    // Verify that ProfilePage is rendered with the correct profile data
    expect(screen.getByText("Mocked ProfilePage")).toBeInTheDocument();
    // You can add more checks on props by using jest.spyOn for child components or by using a proper mock
  });

  test("renders ProfilePage with otherProfileData when userId is present", () => {
    const mockFetchUserProfile = jest.fn();
    const mockOtherProfileData = {
      username: "janedoe",
      firstName: "Jane",
      lastName: "Doe",
    };

    useProfile.mockReturnValue({
      profileData: null,
      fetchUserProfile: mockFetchUserProfile,
      loading: false,
    });

    useParams.mockReturnValue({ userId: "123" });

    // Mock the effect of loadProfile setting the otherProfileData
    loadProfile.mockImplementation(
      (userId, fetchUserProfile, setOtherProfileData, setLoading) => {
        setOtherProfileData(mockOtherProfileData);
        setLoading(false);
      }
    );

    render(<ProfilePageContainer />);

    expect(screen.getByText("Mocked ProfilePage")).toBeInTheDocument();
    // Add more checks to verify that ProfilePage gets passed the correct data
  });
});
