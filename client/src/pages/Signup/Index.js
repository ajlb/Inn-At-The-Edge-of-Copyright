import '../../components/Console/css/styles.css'
// import { makePlayer } from "./signup";

var playerValidate = false;


function Signup() {


  function handleSubmit(event){
    event.preventDefault();
        // if (playerValidate === false) {
        //     window.location.href = "/newPlayer";//reload this page
        // } else {
        //     makePlayer();
        // }
  }



  return (
    <div id="whole-form">
      <form
      class="signup"
      onClick={handleSubmit}>
        <div class="form-group">
          <label class="form-control" for="PlayerName">What is your Character Name:</label>
          <input type="text" class="form-control" id="PlayerName" /><button type="submit" id="validate"
            class="btn btn-default">Check Availability</button>
          <div style={{display:"none"}} id="alert" class="alert" role="alert">
            <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
            <span class="msg"></span>
          </div>
          <div style={{display:"none"}} id="continueSignUp">
          < label class="form-control" for="Email">What is your email address:</label>
          <input type="email" class="form-control" id="Email" />
                    <label class="form-control" for="Password">Set your password:</label>
          <input type="password" class="form-control" id="Password" />
          <label class="form-control" for="Verify">Verify your password:</label>
          <input type="password" class="form-control" id="Verify" />
          <div style={{display:"none"}} id="passalert" class="alert" role="alert">
            <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
            <span class="msg"></span>
          </div>
          <span class="input-group-btn">
            <button type="submit" id="submit-button" class="btn btn-default">Submit</button>
          </span>
        </div>
            </div>
        </form>
    </div >
    );
}

export default Signup;
