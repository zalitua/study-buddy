// AppRoutes removes route logice from App.js
import React from "react";
import { Routes, Route } from "react-router-dom";

import Dashboard from "../dashboard/Dashboard";
import Chat from "../chat/Chat";
import Leaderboard from "../leaderboard/Leaderboard";
import ProfileFormContainer from "../profile/profileform/ProfileFormContainer";
import ProfilePageContainer from "../profile/ProfilePageContainer";
import Calendar from "../calendar/Calendar";
import Home from "../home/Home";
import Tasks from "../tasks/Tasks";
import Group from "../group/Group";
import CustomAvatar from "../avatar/CustomAvatar";
import Layout from "../layout/Layout";

import ForumHome from "../forum/ForumHome";
import ForumPage from "../forum/forumPages/ForumPages";

import ProtectedRoute from "../protectedroutes/ProtectedRoute";
import GroupPage from "../group/groupPage/GroupPage";

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
