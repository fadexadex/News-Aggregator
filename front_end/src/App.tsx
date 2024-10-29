import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dash2 from "./components/Dash2";
import { CopilotKit } from "@copilotkit/react-core";

const App = () => {
  return (
    <CopilotKit runtimeUrl="https://news-aggregator-production-a8fd.up.railway.app/api/copilotkit">
      <div className="flex h-screen font-montserrat justify-center bg-black ">
        <Router>
          <Routes>
            <Route path="/" element={<Dash2 />} />
          </Routes>
        </Router>
      </div>
    </CopilotKit>
  );
};

export default App;
