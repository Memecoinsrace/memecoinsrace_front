import logo from "./logo.svg";
import "./App.css";
import Sidebar from "./Components/Sidebar/Sidebar";
import Main from "./Components/Main/Main";
import HowItWorks from "./Components/HowItWorks/HowItWorks";

function App() {
  return (
    <div className="App">
      <Sidebar />
      <Main />
    </div>
  );
}

export default App;
