import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

function sendToAnalytics({ id, name, value }) {
  if (typeof gtag !== "undefined") {
    gtag("event", name, {
      event_category: "Web Vitals",
      event_value: Math.round(name === "CLS" ? value * 1000 : value),
      event_label: id,
      non_interaction: true,
    });
  }
}

reportWebVitals(sendToAnalytics);
