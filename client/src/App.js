import Play from "./pages/Play/Index";
import Home from "./pages/Home/Index";
import Signup from "./pages/Signup/Index";
import About from "./pages/About";
import Admin from "./pages/Admin";
import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div>
        <Route exact path="/" component={Home} />
        <Route exact path="/play" component={Home} />
        <Route exact path="/signup" component={Signup} />
        <Route path="/about" component={About} />
        <Route path="/secrets/admin" component={Admin} />
      </div>
    </Router>
  );
}

export default App;
