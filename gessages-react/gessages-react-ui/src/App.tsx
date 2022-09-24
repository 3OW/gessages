import React, { useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import Map from "./components/map/Map";
import { useAppSelector, useAppDispatch } from "./hooks";
import Notification from "./components/Notification";
import { fetchNearTheads } from "./store/nearThreadsActions";

function App() {
  // const dispatch = useAppDispatch();
  const notification = useAppSelector((state) => state.notification);


  return (
    <div className="App">
      <header className="App-header">
        {notification.isVisible && (
          <Notification
            status={notification.notification.status}
            title={notification.notification.title}
            message={notification.notification.message}
          />
        )}
        <Map />;
      </header>
    </div>
  );
}

export default App;
