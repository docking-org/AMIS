import axios from "axios";
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Spinner, Col, Row, Container, Navbar, Card, Table, Dropdown } from "react-bootstrap";



function ViewSlices(props){

    const [slicesTomato,setSlicesTomato] =  React.useState(null);
    const [slicesDAPI,setSlicesDAPI] =  React.useState(null);
    const [loadedDAPI, setLoadedDAPI] = React.useState(false);
    const [loadedTomato, setLoadedTomato] = React.useState(false);
    const [selectedSampleType, setSelectedSampleType] = props.selectedSampleType;
    const [selectedGene, setSelectedGene] = props.selectedGene;
    const [selectedOrgan, setSelectedOrgan] = props.selectedOrgan;
    const [selectedMouse, setSelectedMouse] = props.selectedMouse;

    const [selectedSlice, setSelectedSlice] = React.useState(0);
    const [wavelengths, setWavelengths] = React.useState(["DAPI", "tdTomato"]);
    const [selectedWaveLength, setSelectedWaveLength] = React.useState("tdTomato");
    const [slices, setSlices] = React.useState(null);
    const [imagesDAPI, setImagesDAPI] = React.useState([]);
    const [imagesTomato, setImagesTomato] = React.useState([]);

  

    function loadSlices(wavelength) {
            
            var sampleType = props.selectedSampleType;
            var gene = props.selectedGene;
            var organ = props.selectedOrgan;
            var mouse = props.selectedMouse;
 
            var url = "/slices?per_page=-1&order_by=slice_id";
            url += "&instrument=" + sampleType;
            url += "&gene=" + gene;
            url += "&organ=" + organ;
            url += "&mouse_number=" + mouse;
            url += "&wavelength=" + wavelength;
            
            axios({
                method: "GET",
                url: url,
                dataType: "json",
                dataSrc: "items",
            }).then((response) => {
                var res = response.data.items;
                
           
                if (wavelength === "tdTomato"){
                    console.log(res);
                    setSlicesTomato(res)
                    setLoadedTomato(true)
                }
                else{
                    console.log(res);
                    setSlicesDAPI(res)
                    setLoadedDAPI(true)
                }
           
            })
        
    }

    React.useEffect(() => {
        if (loadedDAPI === false && loadedTomato === false){
            loadSlices("DAPI");
            loadSlices("tdTomato");
        }
    }, [])

    React.useEffect(() => {
       getImages()
        
    }, [selectedWaveLength])

    React.useEffect(() => {
        
    }, [slicesDAPI, slicesTomato])

    React.useEffect(() => {
  
    }, [loadedTomato, loadedDAPI])



    function getImages(){
        
        if(slicesDAPI && slicesTomato){
            
            if (selectedWaveLength === "DAPI"){
                return slicesDAPI.map((slice, index) => {
                    return(
                    <Col md={4} className="mb-4">
                    <img src={slice.img_small} width="100%" height="100%" onClick={() => {
                        
                        props.selectImage(index);
                    }}
                    />
                    </Col>)
                });
            
            }
            else{
                return slicesTomato.map((slice, index) => {
                    return(<Col md={4} className="mb-4">
                     <img src={slice.img_small} width="100%" height="100%" onClick={() => {
                      
                        props.selectImage(index);
                    }} />
                    
                    </Col>)
                });
            }
        }
        else{
            return []
        }
        
  
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
                            <th>Wavelength</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                            <td>{selectedSampleType}</td>
                            <td>{selectedGene}</td>
                            <td>{selectedOrgan}</td>
                            <td>{selectedMouse}</td>
                            <td>{slicesTomato ? "":""}</td>
                            <td>{slicesTomato ? "": ""}</td>
                            <td><Dropdown>
                                <Dropdown.Toggle variant="success" id="dropdown-basic">
                                    {selectedWaveLength}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {wavelengths.map((wavelength) => {
                                        return <Dropdown.Item onClick={() => setSelectedWaveLength(wavelength)}>{wavelength}</Dropdown.Item>
                                    })}
                                </Dropdown.Menu>
                            </Dropdown></td>

                            </tr>
                        </tbody>
                        </Table>
                                        
                    {getImages()}
                </Row>
            </Container>
                )

        


}

export default ViewSlices;