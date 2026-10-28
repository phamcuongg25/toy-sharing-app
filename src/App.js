import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import Home from "./pages/Home";
import AddToy from "./pages/AddToy";
import EditToy from "./pages/EditToy";
import MyToys from "./pages/MyToys";
import BorrowList from "./pages/BorrowList";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/add-toy"
            element={
              <PrivateRoute>
                <AddToy />
              </PrivateRoute>
            }
          />
          <Route
            path="/edit-toy/:id"
            element={
              <PrivateRoute>
                <EditToy />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-toys"
            element={
              <PrivateRoute>
                <MyToys />
              </PrivateRoute>
            }
          />
          <Route
            path="/borrow-list"
            element={
              <PrivateRoute>
                <BorrowList />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
