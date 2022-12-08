import "./App.scss";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header/Header";
import Home from "./pages/Home/Home";
import { useState } from "react";
import { useLoadScript } from "@react-google-maps/api";

function App() {
  const [libraries] = useState(["places"]);

  // initializing Google Maps Platform API
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_KEY,
    libraries,
  });

  if (!isLoaded) {
    return;
  }

  return (
    <BrowserRouter>
      <Header />
      <main className="main">
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/compare" element={<h1>Compare</h1>} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;