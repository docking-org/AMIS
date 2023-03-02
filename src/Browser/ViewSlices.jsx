import axios from "axios";
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Spinner, Col, Row, Container, Navbar, Button, Table, ButtonGroup } from "react-bootstrap";



function ViewSlices(props){

    const [selectedSampleType, setSelectedSampleType] = React.useState(props.selectedSampleType);
    const [selectedGene, setSelectedGene] = React.useState(props.selectedGene);
    const [selectedOrgan, setSelectedOrgan] = React.useState(props.selectedOrgan);
    const [selectedMouse, setSelectedMouse] = React.useState(props.selectedMouse);
    const [selectedWavelength, setSelectedWavelength] = React.useState(props.selectedWavelength);
    const [slices, setSlices] = React.useState(props.slices);
    

  


    React.useEffect(() => {
        // if (loadedDAPI === false && loadedTomato === false){
        //     loadSlices("DAPI");
        //     loadSlices("tdTomato");
        // }
    }, [])

    React.useEffect(() => {
    
    }, [selectedWavelength])

    React.useEffect(() => {
        console.log(slices)
    }, [slices])

    


    function getImages(){
        
        const images = []
        slices[selectedWavelength].map((slice, index) => {
        
            images.push(
                <Col md={4} className="mb-4">
                <img src={slice.img_small} width="100%" height="100%" onClick={() => {
                    
                    props.selectImage(index, selectedWavelength);
                    props.setFolded(true);
                }}
                />
                </Col>)
        })
        return images;
  
    }

    return(
            <Container >
                <Row>
                    <Table striped bordered hover className="mt-3">
                        <thead>
                            <tr>
                            <th>Sample Type</th>
                            <th>Gene</th>
                            <th>Organ</th>
                            <th>Mouse</th>
                            <th>Age</th>
                            <th>Sex</th>
                         
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{selectedSampleType}</td>
                                <td>{selectedGene}</td>
                                <td>{selectedOrgan}</td>
                                <td>{selectedMouse}</td>
                                <td>{slices[selectedWavelength][0].age}</td>
                                <td>{slices[selectedWavelength][0].sex}</td>
                            </tr>
                        </tbody>
                                
                    </Table>

                    <ButtonGroup  className="mb-2">
                        {Object.keys(slices).map((wavelength, index) => {
                            return <Button variant="secondary" onClick={() => { setSelectedWavelength(wavelength) }} active={selectedWavelength === wavelength ? true : false}>{wavelength}</Button> 
                        })}
                    </ButtonGroup>
                    <br/>
                                        
                    {getImages()}
                </Row>
            </Container>
                )
}

export default ViewSlices;