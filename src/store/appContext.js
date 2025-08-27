import React, { useState } from "react";
import getState from "./flux";

export const Context = React.createContext(null);

export const AppContextProvider = ({ children }) => {
  const [state, setState] = useState(
    getState({
      getStore: () => state.store,
      getActions: () => state.actions,
      setStore: (updatedStore) =>
        setState({
          store: Object.assign(state.store, updatedStore),
          actions: { ...state.actions }
        })
    })
  );
  return <Context.Provider value={state}>{children}</Context.Provider>;
};
