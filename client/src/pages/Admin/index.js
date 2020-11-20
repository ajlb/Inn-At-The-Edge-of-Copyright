import "../../components/Console/css/styles.css";
import Editor from "../../components/Editor/Editor";

function Home() {
    return (
      <div className="wrapper">
          <header className="jumbotron">
              <h1>Admin</h1>
          </header>
              <Editor />
      </div>
    );
  }
  
  export default Home;
  