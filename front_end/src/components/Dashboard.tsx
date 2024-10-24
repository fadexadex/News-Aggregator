import { CopilotPopup } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import { Input } from "./ui/input";


const Dashboard = () => {
  return (
    <div className="bg-silver h-screen flex flex-col w-screen">
      {/* <img src="/logo.png" alt="Aggregator logo" className="h-16" /> */}
      <header className="p-4">
        <h1 className="px-28 py-5 text-2xl font-open font-bold">Aggregator</h1>
      </header>
      {/* News generation */}
      <div className="flex-grow"></div>
      <CopilotPopup
        className="mb-36"
        labels={{
          title: "Your Assistant",
          initial: "Hi! 👋 How can I assist you today?",
        }}
      />

      {/* {Text Box} */}
      <div className="p-4 mx-40 px-12 mb-5 flex justify-center">
        <Input className="px-5 w-3/4 h-16 bg-slate-700" placeholder="Type a message..." />
      </div>
    </div>
  );
};

export default Dashboard;

{
  /* <div className="fixed bottom-0 left-0 right-0 p-4">
        <Input className="px-5 w-full" /> */
}

// <div className="bg-white p-4 flex items-center space-x-2">
// <Input
//   value={inputValue}
//   onChange={(e) => setInputValue(e.target.value)}
//   placeholder="Type a message..."
//   className="flex-1"
// />
