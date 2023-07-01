import React, { useEffect, useState } from "react";
import "./App.css";
import AuthScreen from "./Pages/AuthScreen";
import Home from "./Pages/Home";

function App() {
  const token = localStorage.getItem("token");

  const [isLoggedIn, setIsLoggedIn] = useState(token ? true : false);
  if (isLoggedIn) {
    return <Home setIsLoggedIn={setIsLoggedIn} />;
  } else {
    return <AuthScreen setIsLoggedIn={setIsLoggedIn} />;
  }
}

export default App;
