import "../../components/Console/css/styles.css";
import Editor from "../../components/Editor/Editor";

function Home() {
    return (
      <div className="wrapper">
          <header className="jumbotron">
              <Editor />
          </header>
      </div>
    );
  }
  
  export default Home;
  