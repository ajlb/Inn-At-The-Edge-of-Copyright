import React, { useEffect, useState } from 'react';
import "./signupStyle.css";
import { getCharacters } from "../../clientUtilities/API";


function SignupForm(){


    const [newPlayer, setNewPlayer] = useState({
        PlayerName: "",
        Email:"",
        Password:"",
        Verify:""
    })
    const [isValid, setIsValid] = useState(undefined);
    const [passwordMatch, setPasswordMatch] = useState(undefined);

    useEffect(()=>{
        document.body.style.backgroundColor = 'black'
    })
    
    let playerNameField;
    const handleSubmit = () => {
        return null;
    }

    const validator = (e) => {
        e.preventDefault();
        console.log(playerNameField.value);
        getCharacters(playerNameField.value).then(data=>{
            console.log(data);
            if (data.data.length === 0){
                console.log("valid!");
                setIsValid(true);
            } else {
                console.log("invalid");
                setIsValid(false);
            }
            console.log(isValid);
        })
    }


    const handleChange = (e) => {
        (e.target.id === "PlayerName") && setIsValid(undefined);
        if (e.target.id === "Verify") {
            if (e.target.value === newPlayer.Password){
                setPasswordMatch(true);
            } else {
                setPasswordMatch(false);
            }
        }
        console.log(e.target.id, e.target.value);
        let playerData = newPlayer;
        playerData[e.target.id] = e.target.value;
        setNewPlayer(playerData);
        console.log(newPlayer);
        console.log(isValid);
    }

    return (
        <div id="whole-form">
        <form
          className="signup"
          onClick={handleSubmit}>
          <div className="form-group">
            <label className="form-control" htmlFor="PlayerName">What is your Character Name:</label>
            <input
              type="text"
              className="form-control"
              id="PlayerName" 
              ref={el => playerNameField = el}
              onChange={handleChange}/>
            <button
              type="submit"
              id="validate"
              className="btn btn-default"
              onClick={validator}>Check Availability</button>
            <div style={!isValid ? { display: "block" } : { display: "none" }} id="alert" className="alert" role="alert">
              <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
              <span className="msg"></span>
            </div>
            <div style={isValid ? { display: "block" } : { display: "none" }} id="continueSignUp">
              < label className="form-control" htmlFor="Email">What is your email address:</label>
              <input 
              type="email" 
              className="form-control" 
              id="Email"
              onChange={handleChange} />
              <label className="form-control" htmlFor="Password">Set your password:</label>
              <input type="password" className="form-control" id="Password"
              onChange={handleChange} />
              <label className="form-control" htmlFor="Verify">Verify your password:</label>
              <input type="password" className="form-control" id="Verify"
              onChange={handleChange} style={(passwordMatch === false) ? { backgroundColor: "pink"} : { backgroundColor: "white"}}/>
              <div style={{ display: "none" }} id="passalert" className="alert" role="alert">
                <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
                <span className="msg"></span>
              </div>
              <span className="input-group-btn">
                <button type="submit" id="submit-button" className="btn btn-default">Submit</button>
              </span>
            </div>
          </div>
        </form>
      </div >
    )
}

export default SignupForm;