import Play from "./pages/Play/Index";
import Home from "./pages/Home/Index";
import Signup from "./pages/Singup/Index";
import About from "./pages/About";
import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";


 




function App() {
  return (
   <Router>
      <div>
        <Route exact path="/" component={Home} />
        <Route exact path="/play" component={Play} />
        <Route exact path="/signup" component={Signup} />
        <Route path="/about" component={About} />
      </div>
    </Router>
  );
}

export default App;
