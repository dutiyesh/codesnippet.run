export function getCustomConsole() {
  let custom = {};
  const globalConsole = window.console;

  for (let prop in globalConsole) {
    if (globalConsole.hasOwnProperty(prop)) {
      custom[prop] = (...args) => {
        globalConsole[prop].apply(globalConsole, args);
      };
    }
  }

  return custom;
}
