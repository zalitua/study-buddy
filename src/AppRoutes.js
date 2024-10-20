// AppRoutes removes route logice from App.js
import React from "react";
import { Routes, Route } from "react-router-dom";

import Dashboard from "./components/dashboard/Dashboard";
import Login from "./components/login/Login";
import Signup from "./components/signup/Signup";
import Chat from "./components/chat/Chat";
import Leaderboard from "./components/leaderboard/Leaderboard";
import ProfileFormContainer from "./components/profile/profileform/ProfileFormContainer";
import ProfilePageContainer from "./components/profile/ProfilePageContainer";
import Calendar from "./components/calendar/Calendar";
import Home from "./components/home/Home";
import Tasks from "./components/tasks/Tasks";
import Group from "./components/group/Group";
import CustomAvatar from "./components/avatar/CustomAvatar";
import Layout from "./components/layout/Layout";

import ForumHome from "./components/forum/ForumHome";
import ForumPage from "./components/forum/forumPages/ForumPages";

import ProtectedRoute from "./components/protectedroutes/ProtectedRoute";
import GroupPage from "./components/group/groupPage/GroupPage";

// define routes for app
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* each route is defined */}
        <Route path="/" element={<Home />} />
        {/* routes that require a user to be logged in are protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/chat/:groupId/:chatId"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route
          path="/group"
          element={
            <ProtectedRoute>
              <Group />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profileForm"
          element={
            <ProtectedRoute>
              <ProfileFormContainer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profilePage"
          element={
            <ProtectedRoute>
              <ProfilePageContainer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profilePage/:userId"
          element={
            <ProtectedRoute>
              <ProfilePageContainer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <Calendar />
            </ProtectedRoute>
          }
        />
        <Route path="/customAvatar" element={<CustomAvatar />} />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <Tasks />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forumHome"
          element={
            <ProtectedRoute>
              <ForumHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forumHome/:forumId"
          element={
            <ProtectedRoute>
              <ForumPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/group/groupPage/:groupId"
          element={
            <ProtectedRoute>
              <GroupPage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
