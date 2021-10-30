import "./Masthead.css";
import shapes from "../shapes.png";

function Masthead() {
  return (
    <div className="masthead container">
      <div className="masthead-details">
        <h1 className="masthead-title">CodeSnippet.Run</h1>
        <p className="masthead-description">
          Run multiple JavaScript code snippets independently on a single page.
        </p>
      </div>
      <img src={shapes} alt="Shapes Illustration" className="masthead-image" />
    </div>
  );
}

export default Masthead;
