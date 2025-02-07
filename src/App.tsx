import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Call } from "./components/Call";
import NotificationsPage from "./pages/NotificationsPage";

const App: React.FC = () => {
  return (
    <Router>
      <div className="bg-slate-800 w-screen h-screen flex-col flex justify-center items-center">
        <Routes>
          <Route path="/call" element={<Call />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
