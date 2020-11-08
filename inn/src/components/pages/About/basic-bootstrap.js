import '../../Console/css/styles.css';
import Nancy from "./images/Nancy.jpg";
import Plover from "./images/Plover.jpg";
import Nick from "./images/Nick.jpg";
import Talia from "./images/Talia.jpg";
import Jeneth from "./images/Jeneth.jpg";
import github from "./images/github.png";
import linkedin from "./images/linkedin.png";

function About() {
    return (<div>
      
<h1>Meet our team:</h1>

<div className="inside-border">
    <div className="card">
        <div className="image-div">
            {/* <img src={require("./images/Plover.jpg")} alt="hidden item to size box to square" className="hidden-figure"/> */}
            <img src={Nancy} alt="headshot of Nancy Lambert-Brown" className="card-img-left"/>
        </div>
        <div className="card-body">
            <div className="card-text-elements">
                <h4 className="card-title">Nancy Lambert-Brown</h4>
                <p className="card-text">I'm a creative thinker and problem solver and love to design, build and deliver complex scalable products with an easy to use UX. I have a strong background in SQL and JS and I'm bringing it all together into full-stack development. I enjoy hard challenges - like this game, where we had to work with publish/subscribe within JS and build out a story with data objects that could scale.</p>
            </div>
        </div>
        <div className="card-buttons">
            <a id="github-a" href="https://github.com/n-lambert" className="btn btn-primary"><img src={github} alt="github icon"/></a>
            <a id="linkedin-a" href="https://www.linkedin.com/in/njlambert/" className="btn btn-primary"><img src={linkedin} alt="linkedin icon"/></a>
        </div>
    </div>

    <div className="card">
        <img src={Nick} alt="headshot of Nicholas Konzen" className="card-img-left"/>
        <div className="card-body">
            <div className="card-text-elements">
                <h4 className="card-title">Nicholas Konzen</h4>
                <p className="card-text">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Est blanditiis minima aspernatur doloremque officiis, dolorum amet, consequuntur impedit ducimus quae quod ab laudantium aliquid officia consectetur obcaecati odio iste maiores beatae sequi ad esse quisquam quasi. Laborum earum nulla ducimus impedit dolores quasi accusantium tempora, odit fugiat itaque nihil? Porro sed repellendus deserunt nihil a aliquid debitis, adipisci hic.</p>
            </div>
        </div>
        <div className="card-buttons">
            <a id="github-a" href="https://github.com/NTKonzen" className="btn btn-primary"><img src={github} alt="github icon"/></a>
            <a id="linkedin-a" href="https://www.linkedin.com/in/nicholas-konzen-7160881b0/" className="btn btn-primary"><img src={linkedin} alt="linkedin icon"/></a>
        </div>
    </div>

    <div className="card">
        <img src={Plover} alt="headshot of Plover Brown" className="card-img-left"/>
        <div className="card-body">
            <div className="card-text-elements">
                <h4 className="card-title">Plover Brown</h4>
                <p className="card-text">I'm a developer based in San Diego, living in the sun and enjoying the outdoors with my kid. When I'm inside, I love to work on detailed, lengthy coding problems like this game. It's been absolutely a blast to dive into all of the intricacies of responding to user input in a wide variety of interesting ways, and fun also to pop into the front of the application to work on the user experience, accessibility, and security aspects.</p>
            </div>
        </div>
        <div className="card-buttons">
            <a id="github-a" href="https://github.com/rebgrasshopper" className="btn btn-primary"><img src={github} alt="github icon"/></a>
            <a id="linkedin-a" href="https://www.linkedin.com/in/plover-brown-37b6981a5/" className="btn btn-primary"><img src={linkedin} alt="linkedin icon"/></a>
        </div>
    </div>

    <div className="card">
        <img src={Talia} alt="headshot of Talia Vazquez" className="card-img-left"/>
        <div className="card-body">
            <div className="card-text-elements">
                <h4 className="card-title">Talia Vazquez</h4>
                <p className="card-text">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Est blanditiis minima aspernatur doloremque officiis, dolorum amet, consequuntur impedit ducimus quae quod ab laudantium aliquid officia consectetur obcaecati odio iste maiores beatae sequi ad esse quisquam quasi. Laborum earum nulla ducimus impedit dolores quasi accusantium tempora, odit fugiat itaque nihil? Porro sed repellendus deserunt nihil a aliquid debitis, adipisci hic.</p>
            </div>
        </div>
        <div className="card-buttons">
            <a id="github-a" href="https://github.com/taliavazquez" className="btn btn-primary"><img src={github} alt="github icon"/></a>
            <a id="linkedin-a" href="https://www.linkedin.com/in/talia-vazquez-1768461a9/" className="btn btn-primary"><img src={linkedin} alt="linkedin icon"/></a>
        </div>
    </div>

    <div className="card">
        <div className="image-div">
            {/* <img src="./images/Plover.jpg" alt="hidden image to size box to square" className="hidden-figure"/> */}
            <img src={Jeneth} alt="headshot of Jeneth Diesta" className="card-img-left"/>
        </div>
        <div className="card-body">
            <div className="card-text-elements">
                <h4 className="card-title">Jeneth Diesta</h4>
                <p className="card-text">I'm an IT project manager for a global financial institution looking to expand my skillset by learning how to code. I have a "customer first" mindset and believe in earning the customer's trust by paying close attention to the details.  Beyond the workday, I'm involved in NextGen Leaders, an ERG which seeks to bring together individuals to network and collaborate.</p>
            </div>
        </div>
        <div className="card-buttons">
            <a id="github-a" href="https://github.com/jen6one9" className="btn btn-primary"><img src={github} alt="github icon"/></a>
            <a id="linkedin-a" href="https://www.linkedin.com/in/jeneth-diesta/" className="btn btn-primary"><img src={linkedin} alt="linkedin icon"/></a>
        </div>
    </div>
</div>
<footer id="play-link"><a href="/play">Back to the game!</a></footer>

<script src="./js/about.js"></script>
</div>);
  }
  
  export default About;
  