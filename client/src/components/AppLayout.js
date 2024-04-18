import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="App">
      <Header />
      <div className="allContent">
        <Sidebar />
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default AppLayout;
