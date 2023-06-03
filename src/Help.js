import logo from './logo.svg';
import './App.css';
import Container from 'react-bootstrap/Container';

import { Card, Col, Row } from 'react-bootstrap';


function Help() {


    return (
        <Container>
            <div class="rounded-3 p-1 mb-0 row w-75 justify-content-center align-items-center mx-auto">


                <Card>
                    <Card.Body>
                        <h1 class="display-5 fw-bold text-center">How To Use AMIS</h1>

                        Navigation through the histological image sets on the AMIS website falls into a
                        few basic categories.
                        <br></br>
                        <ol>
                            <li

                            >
                                <a href="#image_set_selection">Image Set Selection</a>


                            </li>
                            <li>
                                <a href="#image_display">Organ Slice Selection</a>

                            </li>
                            <li>
                                <a href="#image_display">Image Display Adjustment</a>

                            </li>
                            <li>
                                <a href="#image_comparison">Image Comparison</a>

                            </li>

                        </ol>

                        Note: These images are 16-bit Fluorescent Images, the GPCR channel is usually
                        the red (tdTomato) and the blue channel is reserved for DAPI images.
                        <br></br>
                        Although these images are 16-bit, some of the data sets are currently
                        displayed as 8-bit images and so the intensity levels are shown as percentage
                        and not values.
                        <br></br>
                        <br></br>

                    </Card.Body>
                </Card>
            </div>
            <div class="rounded-3 p-1 mb-0 row w-75 justify-content-center align-items-center mx-auto"
                id="image_set_selection"
            >

                <Card>
                    <Card.Body>

                        <Row>
                            <Col lg={4}>
                                <img
                                    src={'/tutorial/help1.PNG'}
                                    class="img-fluid rounded-4"
                                    alt="Responsive image"
                                >
                                </img>
                            </Col>
                            <Col lg={8}>
                                <h4>Image Set Selection</h4>

                                Here the user may choose the specific G protein-coupled receptor Gene,
                                the mouse organ, the data set (two positive and two negative controls
                                for each sex).
                                <br></br>
                                The user can also select a 2nd  image set by  using the “Toggle Split Screen” to open a similar control for the Right Panel.
                                <br></br>
                                <br></br>
                                The Current Mouse Id, Age and  Sex should be shown below this dialog box. The Image Set Selection Controls will automatically be hidden but can be activated by moving the mouse over the control.
                                <br></br>
                                Mouseover hints are available or will be added over each control.


                            </Col>




                        </Row>



                    </Card.Body>

                </Card>

            </div>

            <div class="rounded-3 p-1 mb-0 row w-75 justify-content-center align-items-center mx-auto"
                id="image_display"
            >
                <Card>
                    <Card.Body>
                        <Row>
                            <Col lg={4}>
                                <img
                                    src={'/tutorial/help2.PNG'}
                                    class="img-fluid rounded-4 m-1"
                                    alt="Responsive image"
                                >

                                </img>

                            </Col>
                            <Col lg={8}>
                                <h4>Organ Slice Selection</h4>
                                Once a Data set has been selected, one can either input a specific organ slice # (i.e. “19”), use the blue arrows, or use to mouse to
                                scroll through  horizontal  set of  small images at bottom,
                                or  display  an organ slice montage  (pop up)  and select a
                                particular image slice by clicking  on it.
                            </Col>
                            <Col lg={4}>
                                <img
                                    src={'/tutorial/help3.PNG'}
                                    class="img-fluid rounded-4 m-1"
                                    alt="Responsive image"
                                ></img>
                            </Col>
                            <Col lg={8}>

                                The Image Channel for the image slices (bottom images) can be selected, and especially useful for dimmer images , the contrast
                                can be boosted by toggling on the Brightness Boost icon.

                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </div>

            <div class="rounded-3 p-1 mb-0 row w-75 justify-content-center align-items-center mx-auto"
                id="image_comparison"
            >
                <Card>
                    <Card.Body>
                        <Row>
                            <Col lg={4}>
                                <img
                                    src={'/tutorial/help4.PNG'}
                                    class="img-fluid rounded-4 m-1"
                                    alt="Responsive image"
                                >
                                </img>
                            </Col>
                            <Col lg={8}>
                                <h4>Image Display Adjustment</h4>
                                The Active Layers /LUT controls allow one to select which image
                                to channel and Look-up-Table (LUT) to use.  We recommend initially looking at the target channel in Greyscale mode.   For a give image
                                all available channels can be displayed and overlayed.




                            </Col>

                            <Col lg={4}>
                                <img
                                    src={'/tutorial/help5.PNG'}
                                    class="img-fluid rounded-4 m-1"
                                    alt="Responsive image"
                                >
                                </img>
                            </Col>
                            <Col lg={8}>
                                Clicking on the “Image Display Options” opens this dialog  box that allows the user to adjust the contrast , set the min and max  values by  % of the max value (256 levels for 8-bit and 65535 for 16-bit images) more generalized controls are available for Contrast and Brightness.
                                The Opacity controls are available for overlaying Dapi and GPCR target channels. And the Reset and Auto are additional options.
                                <br></br>
                                <br></br>
                                Note: Explicitly setting the Min and Max values  will soon be options.
                            </Col>
                            <Col lg={4}>
                                <img
                                    src={'/tutorial/help6.PNG'}
                                    class="img-fluid rounded-4 m-1"
                                    alt="Responsive image"
                                >
                                </img>
                            </Col>
                            <Col lg={8}>
                                The icon with the down-arrow allows one to hide/unhide the image slice panel
                            </Col>

                        </Row>
                    </Card.Body>
                </Card>
            </div>
            <div class="rounded-3 p-1 mb-2 row w-75 justify-content-center align-items-center mx-auto "
                id="image_comparison"
            >
                <Card>
                    <Card.Body>
                        <Row>

                            <Col lg={4}>
                                <img
                                    src={'/tutorial/help7.PNG'}
                                    class="img-fluid rounded-4 m-1"
                                    alt="Responsive image"
                                >
                                </img>
                            </Col>
                            <Col lg={8}>
                                <h4>Image Comparison</h4>
                                Image Comparison is initiated by toggling the “Toggle Split Screen” , the current image settings should be conferred upon the 2nd image.
                                <br></br>
                                A researcher can use this option to validated negative controls for a given GPCR organ set, compare individual mice for same set, compare GPCR distributions between organs and/or Genes and/or controls.
                                <br></br>
                            </Col>






                        </Row>
                    </Card.Body>
                </Card>
            </div>

        </Container >
    );
}

export default Help;
