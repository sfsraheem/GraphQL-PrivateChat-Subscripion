import { Box } from "@mui/material";
import React from "react";
import Sidebar from "../components/Sidebar";
import { Route, Routes } from "react-router-dom";
import Welcome from "../components/Welcome";
import ChatScreen from "../components/ChatScreen";

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/:id/:name" element={<ChatScreen />} />
    </Routes>
  );
};

const Home = ({ setIsLoggedIn }) => {
  return (
    <Box display="flex">
      <Sidebar setIsLoggedIn={setIsLoggedIn} />
      <AllRoutes />
    </Box>
  );
};

export default Home;
