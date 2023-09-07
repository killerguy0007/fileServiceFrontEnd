import React from "react";
import {BrowserRouter, Routes,Route} from "react-router-dom";
import { routes } from "./Routes/routes";
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {routes.map((route,index) => (
            <Route key = {index} path={route.path} element={<route.element />} />
          ))}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
