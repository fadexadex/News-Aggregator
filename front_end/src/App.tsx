import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Dashboard from "./components/Dashboard";
import Dash2 from "./components/Dash2";
import { CopilotKit } from "@copilotkit/react-core";

const App = () => {
  return (
    <CopilotKit runtimeUrl="http://localhost:3001/api/copilotkit">
      <div className="flex h-screen font-montserrat justify-center bg-black ">
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dash2" element={<Dash2 />} />
          </Routes>
        </Router>
      </div>
    </CopilotKit>
  );
};

export default App;
