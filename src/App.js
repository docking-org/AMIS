import logo from './logo.svg';
import './App.css';
import Container from 'react-bootstrap/Container';
import { useState } from 'react';
import { Card } from 'react-bootstrap';
const file_list = [
  "Michaelangelo.png",
  "Banksy.PNG",
  "Bosch.PNG",
  "Bose.PNG",
  "Bruegel.PNG",
  "Cezanne.PNG",
  "DaVinci.PNG",
  "Disney.PNG",
  "Escher.PNG",
  "GWilliams.PNG",
  "Hokusai.PNG",
  "Kahlo.PNG",
  "Miro.PNG",
  "Mondrian.PNG",
  "Murillo.PNG",
  "Picasso.PNG",
  "Pollock.PNG",
  "Rafael.PNG",
  "Rembrant.PNG",
  "Renoir.PNG",
  "Rothko.PNG",
  "Taikan.PNG",
  "Vangogh.PNG",
  "Vermeer.PNG",
  "Warhol.PNG",
  "Whistler.PNG",
  "Wyeth.PNG"
]

function App() {
  const [current_image, set_current_image] = useState(23);

  return (
    <Container>
      <div class="rounded-3 p-3 m-4 mb-0 row">
        <div class="col-md-6">
          <Card>
            <Card.Header> Click to change the image</Card.Header>
            <Card.Img
              variant="top"
              src={'/mouse_images/' + file_list[current_image]}
              class="img-fluid"
              alt="Responsive image"
              onClick={() => {
                let img = Math.floor(Math.random() * file_list.length)
                while (img == current_image) {
                  img = Math.floor(Math.random() * file_list.length)
                }
                set_current_image(img)
              }}
            >
            </Card.Img>

            <Card.Body>
              <Card.Text>
                <b>
                  Mouse Using A Microscope
                </b>
                <br />
                In the style of {file_list[current_image].split('.')[0]}  (created by prompting Stable Diffusion)
              </Card.Text>
            </Card.Body>
          </Card>


        </div>
        <div class="col-md-6">
          <Card>
            <Card.Body>
              <h1 class="display-5 fw-bold text-center">AMIS</h1>

              Welcome to A Mouse Imaging Server (<b>AMIS</b>), the home for mouse
              imaging data generated via the NIH Common fund Program for
              Illuminating the Druggable Genome  (<a target="_blank" href="https://druggablegenome.net/DRGC_GPCR">IDG</a>). Our goal is to provide the research
              community with free access to the whole body distribution of understudied genes via engineered mouse lines.

              AMIS is provided by the Roth Lab at UNC Chapel Hill and the Shoichet/Irwin labs at the University of California
              San Francisco (UCSF).
              <br />
              <br />

              The Website has been designed with the goal of observing and comparing images depicting certain GPCR
              distributions which fall into two categories: histological (fluorescent) or cleared (Light-Sheet-Microscopy videos)
              image sets.

              <br />
              <br />
              From here you may <a href="/image_browser">Browse images</a>, <a href="/help">review web navigation</a>, examine
              sample tables or sample preparation, or overview the basic
              workflows.
              <br />
              <br />

              AMIS is a work in progress, and we are planning to continue to add content. In its current condition, the
              histological images are available, videos of cleared-mice imaged using Light-Sheet-Microscopy should be
              available shortly.
              <br></br>
              And of course, your <a href="/feedback">feedback</a> is welcome!
            </Card.Body>

          </Card>
        </div>


      </div>
      <br />
      <div
        class="p-3 "
      >
        <Card
          className="rounded-3 row mb-1 mx-5"
        >
          <Card.Header>Acknowledgements</Card.Header>
          <Card.Body>
            <Card.Text>

              <b>Noah Sciaky</b>, Yi-Ting Chiu, Sreeparna Majumdar, Dewran Daniel Kocak, Justin English
              <br />
              Image Acquisition, Processing, and Artistic contributions

              <br />
              <br />
              <b>
                Mar Castanon</b>, Chinzo Dakar, Khanh Tang


              <br />
              Web Development
              <br ></br>
              <br ></br>
              UNC histology Core (Curtis Connor and Ashley Ezzell)
              <br />
              Histological Specimen and Slide Preparation
              <br ></br>
              UNC Cystic Fibrosis Core (Claire M. Doerschuk and Michael Chua)
              <br />
              Olympus VS120 Slice Scanner
              <br ></br>
              <br ></br>
              Cornelli (Zhuhao Wu and Kunjie Hua)
              <br />
              Light Sheet Microscopy
              <br ></br>
              <br ></br>
              Overlords (John Irwin and Bryan Roth)
              <br />
              <br></br>
              This site was built using React.JS, Bootstrap, Leaflet, Flask, and Postgres.

            </Card.Text>
          </Card.Body>

        </Card>
      </div>



    </Container >
  );
}

export default App;
