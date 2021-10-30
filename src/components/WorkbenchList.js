import React, { useEffect, useState } from "react";
import Workbench from "./Workbench";
import Track from "./Track";
import "./WorkbenchList.css";

const EXAMPLE_SNIPPET = `const message = "Hello, Console!"
console.log(message);`;

function WorkbenchList() {
  const [count, setCount] = useState(1);
  const [workbench, setWorkbench] = useState([
    {
      id: count,
      name: `workbench-${count}`,
    },
  ]);

  function handleAddBtnClick() {
    const newCount = count + 1;

    setCount(newCount);
    setWorkbench((workbench) => [
      ...workbench,
      {
        id: newCount,
        name: `workbench-${newCount}`,
      },
    ]);

    Track.event("snippet", "snippet_add", "Add new snippet");
  }

  function handleWorkbenchOnMount(element) {
    window.scrollTo({
      left: 0,
      top: element.offsetTop - element.offsetHeight / 1.25,
      behavior: "smooth",
    });
  }

  useEffect(() => {
    function handleWindowBeforeUnload(e) {
      e.preventDefault();
      e.returnValue = "";
    }

    window.addEventListener("beforeunload", handleWindowBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleWindowBeforeUnload);
    };
  }, []);

  return (
    <React.Fragment>
      <ul className="workbench-list">
        {workbench.map((bench) => {
          return (
            <li key={bench.id} className="workbench-list-item">
              <Workbench
                id={bench.id}
                onMount={count > 1 ? handleWorkbenchOnMount : null}
                initialCode={bench.id === 1 ? EXAMPLE_SNIPPET : undefined}
                animate={bench.id !== 1}
              />
            </li>
          );
        })}
      </ul>

      <div className="workbench-add-btn-container">
        <button className="workbench-add-btn" onClick={handleAddBtnClick}>
          New snippet
        </button>
      </div>
    </React.Fragment>
  );
}

export default WorkbenchList;
