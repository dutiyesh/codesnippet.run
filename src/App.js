import { useEffect } from "react";
import Masthead from "./components/Masthead";
import WorkbenchList from "./components/WorkbenchList";
import Footer from "./components/Footer";
import Track from "./components/Track";
import "./App.css";

function App() {
  useEffect(() => {
    Track.pageview();
  }, []);

  return (
    <div className="app-container">
      <Masthead />

      <main className="main-container container">
        <WorkbenchList />
      </main>

      <Footer />
    </div>
  );
}

export default App;
