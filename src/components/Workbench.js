import { useState, useEffect, useRef } from "react";
import { Hook, Unhook, Console } from "console-feed";
import AutosizeInput from "react-input-autosize";
import PropTypes from "prop-types";
import {
  CONSOLE_REGEX,
  CUSTOM_CONSOLE_NAME,
  CONSOLE_THEME,
} from "../constants/console";
import { getCustomConsole } from "../utils/console";
import Track from "./Track";
import "./Workbench.css";

let customConsoleCount = 0;
const customConsole = getCustomConsole();

window[CUSTOM_CONSOLE_NAME] = window[CUSTOM_CONSOLE_NAME] || {};

const INITIAL_SNIPPET = `// Add your code here`;

const propTypes = {
  id: PropTypes.number.isRequired,
  onMount: PropTypes.func,
  initialCode: PropTypes.string,
  animate: PropTypes.bool,
};

const defaultProps = {
  initialCode: INITIAL_SNIPPET,
  animate: true,
};

function Workbench(props) {
  const [snippetName, setSnippetName] = useState(`Code snippet ${props.id}`);
  const [isEditingSnippetName, setIsEditingSnippetName] = useState(false);
  const [logs, setLogs] = useState([]);
  const snippetNameInputRef = useRef();
  const workbenchRef = useRef();
  const consoleNameRef = useRef();
  const outputRef = useRef();
  const editorRef = useRef();
  const codeMirrorRef = useRef();

  function handleExecuteBtnClick() {
    const value = codeMirrorRef.current.getDoc().getValue();
    const newValue = value.replace(
      CONSOLE_REGEX,
      `window.${CUSTOM_CONSOLE_NAME}.${consoleNameRef.current}`
    );
    try {
      // eslint-disable-next-line no-unused-vars, no-new-func
      const result = new Function(newValue)();
    } catch (e) {
      window[CUSTOM_CONSOLE_NAME][consoleNameRef.current].error(e);
    }

    Track.event("editor", "editor_execute", "Execute editor code");
  }

  function handleClearButton() {
    setLogs([]);

    Track.event("console", "console_clear", "Clear console");
  }

  function handleSnippetNameClick() {
    setIsEditingSnippetName(true);
  }

  function handleSnippetNameChange(e) {
    setSnippetName(e.target.value);
  }

  function handleSnippetNameBlur() {
    setIsEditingSnippetName(false);
  }

  useEffect(() => {
    // fix hmr issue
    editorRef.current.innerHTML = "";

    // eslint-disable-next-line no-undef
    codeMirrorRef.current = CodeMirror(editorRef.current, {
      value: props.initialCode,
      mode: "javascript",
      lineNumbers: true,
      inputStyle: "contenteditable",
      theme: "material",
      autofocus: true,
    });

    const newMap = {
      "Cmd-Enter": () => {
        handleExecuteBtnClick();
      },
      "Control-Enter": () => {
        handleExecuteBtnClick();
      },
      "Cmd-K": () => {
        handleClearButton();
      },
      "Control-L": () => {
        handleClearButton();
      },
    };

    codeMirrorRef.current.addKeyMap(newMap);
    codeMirrorRef.current.setSize(null, 300);

    consoleNameRef.current = `_${customConsoleCount}_`;
    customConsoleCount++;

    let newConsole = { ...customConsole };
    window[CUSTOM_CONSOLE_NAME][consoleNameRef.current] = newConsole;

    Hook(
      window[CUSTOM_CONSOLE_NAME][consoleNameRef.current],
      (log) => {
        setLogs((logs) => [...logs, log]);
      },
      false
    );

    if (props.onMount) {
      props.onMount(workbenchRef.current);
    }

    return () => {
      Unhook(newConsole);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (outputRef.current) {
      if (outputRef.current.offsetHeight < outputRef.current.scrollHeight) {
        outputRef.current.scrollTop = outputRef.current.scrollHeight;
      }
    }
  });

  return (
    <div
      className={`workbench ${props.animate ? "animation-fade-in" : ""}`}
      ref={workbenchRef}
    >
      <div className="editor-container">
        <div className="workbench-toolbar">
          <div
            className="workbench-toolbar-details-container"
            ref={snippetNameInputRef}
          >
            {isEditingSnippetName ? (
              <AutosizeInput
                autoFocus
                className="editor-name-input"
                placeholder="Enter snippet name"
                value={snippetName}
                onChange={handleSnippetNameChange}
                onBlur={handleSnippetNameBlur}
              />
            ) : (
              <span
                className="workbench-toolbar-title"
                role="button"
                onClick={handleSnippetNameClick}
              >
                {snippetName}
              </span>
            )}
          </div>
          <div>
            <button
              className="workbench-action-btn-text"
              onClick={handleExecuteBtnClick}
              title="Run snippet (⌘ Enter - Ctrl Enter)"
            >
              Run
            </button>
          </div>
        </div>
        <div ref={editorRef} className="editor"></div>
      </div>
      <div className="output-container">
        <div className="workbench-toolbar">
          <div className="workbench-toolbar-details-container">
            <span className="workbench-toolbar-title">Console</span>
          </div>
          <div>
            <button
              className="workbench-action-btn-text"
              onClick={handleClearButton}
              title="Clear console (⌘ K - Ctrl L)"
            >
              Clear
            </button>
          </div>
        </div>
        <div ref={outputRef} className="output">
          <Console logs={logs} variant="dark" styles={CONSOLE_THEME} />
        </div>
      </div>
    </div>
  );
}

Workbench.propTypes = propTypes;
Workbench.defaultProps = defaultProps;

export default Workbench;
