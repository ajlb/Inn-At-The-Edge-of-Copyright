
import React from 'react';

const GamewideInfo = React.createContext({
    actions: []
});

export default GamewideInfo;








// import * as React from "react";
// import getActions from "../Utils/API"

// let GamewideInfo = React.createContext();

// let initialState = {
//     actions: []
// };

// getActions().then(actions => {
//     initialState = {
//         actions
//     }
// })


// let reducer = (state, action) => {
//   switch (action.type) {
//     case "reset":
//       return initialState;
//     case "increment":
//       return { ...state, count: state.count + 1 };
//     case "decrement":
//       return { ...state, count: state.count - 1 };
//     case "set-color":
//       return { ...state, currentColor: action.payload };
//   }
// };

// function GamewideInfoProvider(props) {
//   // [A]
//   let [state, dispatch] = React.useReducer(reducer, initialState);
//   let value = { state, dispatch };


//   // [B]
//   return (
//     <GamewideInfo.Provider value={value}>{props.children}</GamewideInfo.Provider>
//   );
// }

// let GamewideInfoConsumer = GamewideInfo.Consumer;

// // [C]
// export { GamewideInfo, GamewideInfoProvider, GamewideInfoConsumer };



