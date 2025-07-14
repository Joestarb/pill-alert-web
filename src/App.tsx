import React from "react";
import "./index.css";
import AppRoutes from "./routes/index.routes";
import { BrowserRouter } from "react-router-dom";
const App: React.FC = () => {
  return(
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>)
};

export default App;
