import React from 'react';
import ReactDOM from 'react-dom';

import './App.css';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { useState, useEffect, createRef, useMemo } from 'react';
import axios from "axios";
import Select from 'react-select';
import { MapContainer, TileLayer, LayersControl } from 'react-leaflet';
import { CRS, setOptions } from 'leaflet';
import { Button } from 'react-bootstrap';
import $ from 'jquery';
import Sly from 'sly-scroll';
import LUTSelector from './LeafletControls/LUTSelector';
import Slider from './LeafletControls/Slider';
import SliderMenu from './LeafletControls/SliderMenu';
import 'leaflet-fullscreen/dist/Leaflet.fullscreen.js';
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css';
import OpenPopup from './LeafletControls/OpenPopup';
import { render, createPortal } from "react-dom";
import ViewSlices from "./ViewSlices";

const DropdownIndicator = (
    props
) => {
    return (
        <div></div>
    );
};

function ImageRenderer(props) {
    
    const lutRef = createRef(null);
    const colorRef = createRef(null);
    const [windowOpen, setWindowOpen] = useState(false);
    const [folded, setFolded] = useState(false);
    const [sampleTypes, updateSampleTypes] = useState(props.state.sampleTypes)
    const [genes, updateGenes] = useState(props.state.genes)
    const [organs, updateOrgans] = useState(props.state.organs)
    const [mice, updateMice] = useState(props.state.mice)
    const [slicesTomato, updateSlicesTomato] = useState(props.state.slicesTomato)
    const [slicesDAPI, updateSlicesDAPI] = useState(props.state.slicesDAPI)
    const [selectedSampleType, updateSelectedSampleType] = useState(props.state.selectedSampleType)
    const [selectedGene, updateSelectedGene] = useState(props.state.selectedGene)
    const [selectedOrgan, updateSelectedOrgan] = useState(props.state.selectedOrgan)
    const [selectedMouse, updateSelectedMouse] = useState(props.state.selectedMouse)
    const [selectedSlice, updateSelectedSlice] = useState(props.state.selectedMouse)
    const [selectedWavelength, updateselectedWavelength] = useState(props.state.selectedWavelength)
    const [colorAccordion, setColorAccordion] = useState(false);
    const [lutAccordion, setlutAccordion] = useState(false);
    const [slider, setSlider] = useState(null);
    const [loaded, setLoaded] = useState(null);
    const [optionsLoaded, setOptionsLoaded] = useState(false);
    const [options, updateOptions] = useState(props.state.options)
    const [selections, updateSelections] = useState(props.state.selections)
    const [lut, updateLut] = useState(props.state.lut)




    var $frame = $('#forcecentered ' + (props.main ? 1 : 2));

    var slyOptions = {
        horizontal: 1,
        itemNav: 'forceCentered',
        smart: true,
        activateMiddle: 1,

        mouseDragging: 1,
        touchDragging: 1,
        releaseSwing: 1,
        startAt: props.state.selectedSlice,

        scrollBy: 1,
        speed: 300,
        elasticBounds: 1,

        dragHandle: 1,
        dynamicHandle: 1,
        clickBar: 1,
        

    };




    function selectSlice(id) {


        updateSelectedSlice(id)
    }


    function preventDefault(e) {
        e = e || window.event
        if (e.preventDefault) {
            e.preventDefault()
        }
        e.returnValue = false
    }





    useEffect(() => {
        if (slider) {
            slider.on('active', function (e, i) {
                selectSlice(i)
            });
            slider.reload()

        }
    }, [props.renderSize, slider, slicesTomato, slicesDAPI])




    useEffect(() => {
        loadSlices("DAPI")
        loadSlices("tdTomato")

    }, [selectedMouse])

    function loadSlices(wavelength) {
        if (selectedMouse) {
            var url = "/slices?per_page=-1&order_by=slice_id";
            url += "&instrument=" + selectedSampleType['value'];
            url += "&gene=" + selectedGene['value'];
            url += "&organ=" + selectedOrgan['value'];
            url += "&wavelength=" + wavelength;
            url += "&mouse_number=" + selectedMouse['value'];

            axios({
                method: "GET",
                url: url,
                dataType: "json",
                dataSrc: "items",
            }).then((response) => {
                var res = response.data.items




                wavelength === "DAPI" ? updateSlicesDAPI(res) : updateSlicesTomato(res)

                if (!slider) {
                    try {
                        setSlider(new Sly('#forcecentered' + (props.main ? 1 : 2), slyOptions).init())

                        slider.activate(props.state.selectedSlice)

                    } catch (e) {
                        console.log()
                    }
                }
                else {
                    slider.reload()
                    try {
                        slider.activate(props.state.selectedSlice)

                    } catch (e) {
                        console.log()
                    }
                }

            })
        }
    }

    useEffect(() => {
        updateSelectedMouse(null);
        updateMice([]);
        console.log("selectedOrgan changed")
        if (selectedGene && selectedOrgan && selectedSampleType) {
            let url = "/mice?";

            url += "&instrument=" + selectedSampleType['value'];
            url += "&gene=" + selectedGene['value'];
            url += "&organ=" + selectedOrgan['value'];

            axios({
                method: "GET",
                url: url,
                dataType: "json",
                dataSrc: "items",
            }).then((response) => {
                var res = response.data.items
                
                updateMice(res)
                if(props.state.selectedMouse){
                    updateSelectedMouse(props.state.selectedMouse)
                }
            })
        }
    }, [selectedOrgan])

    function updateOption(key, value) {
        if (options[key] != value) {
            updateOptions({ ...options, [key]: value })
        }
    }

    function closeAccordions() {
        setColorAccordion(false);
        setlutAccordion(false);
    }

    // on click outside of the accordion, run closeAccordions()
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // if the click is outside of the accordion, close it
    function handleClickOutside(event) {

        // if classname is not lut-accordion or color-accordion, or if the event target does not contain a parent with the class lut-accordion or color-accordion, close the accordions
        try{
        if (!event.target.className.includes("accordion") && !event.target.closest(".accordion")) {
            closeAccordions()
        }
    }catch(e){
        console.log()
    }





    }


    //on load, load selections
    useEffect(() => {
        if (!optionsLoaded) {
            loadAllFilters()
            
        }

    }, [props.main, optionsLoaded])

    function togglelutAccordion() {
        setlutAccordion(!lutAccordion)

    }

    function toggleColorAccordion() {
        setColorAccordion(!colorAccordion)

    }

    function changeLut(layer, option) {
        if (lut[layer] != option) {
            updateLut({ ...lut, [layer]: option })

        }

    }




    function buildState() {
        return {
            genes: genes,
            organs: organs,
            mice: mice,
            slicesTomato: slicesTomato,
            slicesDAPI: slicesDAPI,
            selectedSampleType: selectedSampleType,
            selectedGene: selectedGene,
            selectedOrgan: selectedOrgan,
            selectedMouse: selectedMouse,
            selectedSlice: selectedSlice,
            selectedWavelength: selectedWavelength,
            loaded: loaded,
            options: options,
            lut: lut,
            selections:selections,
            sampleTypes:sampleTypes,
            optionsLoaded:optionsLoaded,
        }
    }


    useEffect(() => {
        if (!props.main && !loaded) {
            loadSlices("DAPI")
            loadSlices("tdTomato")
            updateSelectedSlice(props.state.selectedSlice)

            setLoaded(true)
        }

    }, [selectedMouse])

    useEffect(() => {
        if (slider) {
            slider.reload()
            slider.activate(selectedSlice)
        }
    }, [selectedWavelength])

    

    useEffect(() => {
        console.log(selectedSampleType  )
    }, [selectedSampleType])

  



    function getSliceThumbnails() {
        return selectedWavelength === 'tdTomato' ? slicesTomato : slicesDAPI

    }
    function resetValues() {
        updateOptions({
            'brightness': 0,
            'contrast': 0,
            'min': 0,
            'max': 255,
            'blend': 100
        })
    }

    function getAutoValues() {
        var selectedUrl = "";
        if (selectedWavelength === "tdTomato") {
            selectedUrl = slicesTomato[selectedSlice] ? selectedUrl = slicesTomato[selectedSlice].img_no_ext : null
        }
        if (selectedWavelength === "DAPI") {
            selectedUrl = slicesDAPI[selectedSlice] ? slicesDAPI[selectedSlice].img_no_ext : null
        }


        axios({
            method: "GET",
            url: "http://localhost:5000/getAutoValues?url=" + encodeURIComponent(selectedUrl),
            dataType: "json",
            dataSrc: "items",
        }).then((response) => {
            var res = response.data
            updateOptions({
                brightness: parseInt(res.brightness),
                contrast: Math.round(parseFloat(res.contrast) / 3 * 100),
                min: res.min,
                max: res.max,
                blend: options.blend
            })
            console.log(options)


        })
    }

    function loadAllFilters(){
        
        //loads all available filters from /filters endpoint
        //sample return line {"experiment":"Ai9","gene":"GPR68","organ":"heart","sample_type":"Histological","unique":"GPR68Ai9heartHistological"},
        // the filters are unique to the combination of gene, organ, and sample type
        
        axios({
            method: "GET",
            url: "http://localhost:5000/filters",
            dataType: "json",
            dataSrc: "items",
        }).then((response) => {
            var res = response.data.items

            var genes = []
            var organs = []
            
            var response = []
            //sample line in res {"experiment":"Ai9","gene":"GPR85","organ":"kidney","sample_type":"Cleared","unique":"GPR85Ai9kidneyCleared"},
            var sampleTypes = {}  
            res.forEach(filter => {
                //convert res to format
                //[{sampleType: "Histological", genes: {"GPR68": {organs: {"heart" : {'mice': []}}}}}]
              
                if(!sampleTypes[filter.sample_type]){
                    sampleTypes[filter.sample_type] = {genes: []}
                }
                if(genes.length == 0 || !genes.includes(filter.gene)){
                    genes.push(filter.gene)
                }
                
                if(!sampleTypes[filter.sample_type].genes[filter.gene]){
                    
                    sampleTypes[filter.sample_type].genes[filter.gene] = {organs: []}
                }
                if(organs.length == 0 || !organs.includes(filter.organ)){
                    organs.push(filter.organ)
                }
                if(!sampleTypes[filter.sample_type].genes[filter.gene].organs[filter.organ]){
                    sampleTypes[filter.sample_type].genes[filter.gene].organs[filter.organ] = {mice: []}
                }
                
                
            })    
           
            //remove 0 entries from sampleTypes, which are created by the [{}]
          

            console.log(sampleTypes)
            updateSelections(sampleTypes)
            setOptionsLoaded(true)
        })          
    }

    function fold(){
        setFolded(!folded)
    }

    
    const NewWindow = ({ children, close }) => {
        const newWindow = useMemo(() =>
            window.open(
                "about:blank",
                "newWin",
                `width=800,height=400`
            )
        );
        newWindow.onbeforeunload = () => {
            setWindowOpen(false)
          
        };
        copyStyles(document, newWindow.document);
        //copy javascript 
        const script = document.createElement("script");
        script.src = "http://ajax.googleapis.com/ajax/libs/jqueryui/1.9.1/jquery.min.js";
        script.async = true;
        newWindow.document.head.appendChild(script);

        const script4 = document.createElement("script");
        script.src = "http://ajax.googleapis.com/ajax/libs/jqueryui/1.9.1/jquery-ui.min.js";
        script.async = true;
        newWindow.document.head.appendChild(script4);

        //bootstrap js
        const script2 = document.createElement("script");
        script2.src = "https://cdn.jsdelivr.net/npm/react-bootstrap@next/dist/react-bootstrap.min.js";
        script2.async = true;
        newWindow.document.head.appendChild(script2);

        //bootstrap css
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css";
        newWindow.document.head.appendChild(link);
        
        //close window
        useEffect(() => {
            return () => {
                newWindow.close();
            };
        }, []);


        return createPortal(children, newWindow.document.body, "newWin");
    };

    useEffect(() => {
        console.log(selectedMouse)
    }, [windowOpen])

    
    function copyStyles(sourceDoc, targetDoc) {
        Array.from(sourceDoc.styleSheets).forEach(styleSheet => {
        if (styleSheet.cssRules) { // for <style> elements
            const newStyleEl = sourceDoc.createElement('style');
    
            Array.from(styleSheet.cssRules).forEach(cssRule => {
            // write the text of each rule into the body of the style element
            newStyleEl.appendChild(sourceDoc.createTextNode(cssRule.cssText));
            });
    
            targetDoc.head.appendChild(newStyleEl);
        } else if (styleSheet.href) { // for <link> elements loading CSS from a URL
            const newLinkEl = sourceDoc.createElement('link');
    
            newLinkEl.rel = 'stylesheet';
            newLinkEl.href = styleSheet.href;
            targetDoc.head.appendChild(newLinkEl);
        }
        });
    }
    function selectImage(i){
        selectSlice(i)
        slider.activate(i)
        console.log(windowOpen)
    }

    return (
        <div>
    
      
        <Container fluid className="imageBrowser">
      
            <Col>
                <Row className='justify-content-center'>
                    <Col lg={2}>
                        <div className='select-card'>
                            {optionsLoaded ?                            
                            (
                                <div>
                            <label className="col-sm-12 col-form-label">Sample Type</label>
                            <Select
                                components={{ DropdownIndicator }}
                                defaultValue={selectedSampleType}
                                value={selectedSampleType}
                                isClearable={props.renderSize === 12 ? true : false} options={
                                    //use the selections keys to get the sample types
                                    Object.keys(selections).map(selection => ({ "value": selection, "label": selection }))
                                } onChange={(option) => updateSelectedSampleType(option ? option : null)} />

                            <label className="col-sm-4 col-form-label">Gene</label>

                            <Select
                                components={{ DropdownIndicator }}
                                defaultValue={selectedGene}
                                value={selectedGene}
                                isDisabled={!selectedSampleType} isClearable={props.renderSize === 12 ? true : false} options={
                                    
                                    selectedSampleType ? Object.keys(selections[selectedSampleType['value']].genes).map(gene => ({ "value": gene, "label": gene })): []
                                    
                                } onChange={(option) => updateSelectedGene(option ? option : null)} />

                            <label className="col-sm-4 col-form-label">Organ</label>
                            <Select
                                components={{ DropdownIndicator }}
                                defaultValue={selectedOrgan}
                                value={selectedOrgan}
                                isDisabled={!selectedGene} isClearable={props.renderSize === 12 ? true : false} options={
                                    selectedGene ? Object.keys(selections[selectedSampleType['value']].genes[selectedGene['value']].organs).map(organ => ({ "value": organ, "label": organ })): []
                                } onChange={(option) => updateSelectedOrgan(option ? option : null)} />

                            <label className="col-sm-4 col-form-label">Mouse</label>

                            <Select
                                components={{ DropdownIndicator }}
                                defaultValue={selectedMouse}
                                value={selectedMouse}
                                isDisabled={!selectedOrgan} isClearable={props.renderSize === 12 ? true : false} options={

                                    selectedOrgan ? mice.map(mouse => ({
                                        "value": mouse.number, "label": (mouse.sex !== true ? "♀" : "♂") + "  " + mouse.number + "  " +
                                            (mouse.spec === "+" ? "pos" : "neg")
                                    })) : []

                                } onChange={(option) => updateSelectedMouse(option ? option : null)} />

                            <br />


                            {props.main ? <button type="button" className="btn btn-toggle-split btn-dark" onClick={() => { props.splitScreen(buildState()) }}>Toggle Split Screen</button> : null}
                            
                          

                            <div className="col-sm-hidden col-md-10 row slice_details"></div>

                            </div> ) :   
                            (
                            <div className='select-card'>
                                <Spinner animation="border" role="status">
                                    <span className="sr-only">Loading...</span>
                                </Spinner>
                            </div>
                            )}
                        </div>
                        {selectedMouse ?

                            <div className='select-card'>
                                <b>Experiment</b>
                                <br></br>
                                <br></br>
                                Mouse Id: {selectedMouse ? selectedMouse.value : null}

                                <br></br>
                                Age: {slicesTomato[selectedSlice] ? slicesTomato[selectedSlice].age : null}
                                <br></br>
                                Sex: {slicesTomato[selectedSlice] ? slicesTomato[selectedSlice].sex : null}

                            </div>
                            : 

                          null
                            
                            }


                    </Col>




                    <Col lg={10} style={{
                        height: '550px'
                    }} >

                        <MapContainer
                            fullscreenControl={true}
                            center={[-50, -50]} maxBoundsViscosity={1.0} nowrap={true} scrollWheelZoom zoom={2} >
                            
                            <OpenPopup  position="topright" selectedWavelength={selectedWavelength} selectedGene={selectedGene} selectedMouse={selectedMouse} 
                            slicesTomato={slicesTomato} slicesDAPI={slicesDAPI} selectedOrgan={selectedOrgan} selectedSampleType={selectedSampleType}
                            setWindowOpen={setWindowOpen}
                            >

                            </OpenPopup>
                            <SliderMenu position="bottomleft" active={colorAccordion} closeAccordions={closeAccordions} toggleAccordion={toggleColorAccordion}
                                logo={"Color Options"}
                                className="color-accordion"
                            >

                                <Slider label="min" value='min' updateOption={updateOption} defaultValue={options['min']} onChange={() => console.log()} tooltip='Adjust Min Value' min={0} max={255} delta={10} />
                                <Slider label="max" value='max' updateOption={updateOption} defaultValue={options['max']} onChange={() => console.log()} tooltip='Adjust Max Value' min={0} max={255} delta={10} />
                                <Slider icon='tint' value='blend' updateOption={updateOption} defaultValue={options['blend']} onChange={() => console.log()} tooltip='Adjust Opacity' min={0} max={100} delta={15} />
                                <Slider icon='sun' value='brightness' updateOption={updateOption} defaultValue={options['brightness']} onChange={() => console.log()} tooltip='Adjust Brightness' min={-255} max={255} delta={10} />
                                <Slider icon='adjust' value='contrast' updateOption={updateOption} defaultValue={options['contrast']} onChange={() => console.log()} tooltip='Adjust Contrast' min={-255} max={255} delta={10} />
                                <br></br>
                                <Button size='sm' onClick={() => resetValues()}> Reset Values</Button>
                                &nbsp;
                                <Button size='sm' onClick={() => getAutoValues()}> Auto</Button>
                            </SliderMenu>
                            <SliderMenu position="bottomright" closeAccordions={closeAccordions} active={lutAccordion} toggleAccordion={togglelutAccordion}
                                className="lut-accordion"
                                description={''}
                                logo={"LUT"}
                            >
                                <LUTSelector layer={'tdTomato'} changeLut={changeLut} option={lut['tdTomato']} />

                                <LUTSelector layer={'DAPI'} changeLut={changeLut} option={lut['DAPI']} />
                            </SliderMenu>

                            <LayersControl position="topright">

                                <LayersControl.Overlay checked name="tdTomato">
                                    <TileLayer
                                        opacity={options.blend / 100}
                                        tms={true}
                                        minZoom={2}
                                        maxZoom={7}
                                        noWrap={true}

                                        crs={CRS.Simple}
                                        bounds={[[-150, -150], [500, 180]]}

                                        url={ selectedMouse?
                                            
                                            "http://localhost:5000/lut" + '/{z}/{x}/{y}.png' + "?lut=" + lut['tdTomato'] + "&url=" + encodeURIComponent(slicesTomato[selectedSlice] ? slicesTomato[selectedSlice].img_no_ext : null) + "&brightness=" + options.brightness +
                                            "&contrast=" + options.contrast +
                                            "&cliplow=" + options.min +
                                            "&cliphigh=" + options.max : ""}
                                    />
                                </LayersControl.Overlay>
                                <LayersControl.Overlay name="DAPI">
                                    <TileLayer
                                        opacity={options.blend / 100}
                                        tms={true}
                                        minZoom={2}
                                        maxZoom={7}
                                        noWrap={true}

                                        crs={CRS.Simple}
                                        bounds={[[-150, -150], [500, 180]]}

                                        url={ selectedMouse?
                                            "http://localhost:5000/lut" + '/{z}/{x}/{y}.png' + "?lut=" + lut['DAPI'] + "&url=" + encodeURIComponent(slicesDAPI[selectedSlice] ? slicesDAPI[selectedSlice].img_no_ext : null) + "&brightness=" + options.brightness +
                                            "&contrast=" + options.contrast +
                                            "&cliplow=" + options.min +
                                            "&cliphigh=" + options.max : ""}
                                    />
                                </LayersControl.Overlay>
                            </LayersControl>

                        </MapContainer>



                        <div className="wrap">
                            <Row>
                                <Col lg={1}>
                                    <div className="controls center" >
                                        <ButtonGroup aria-label="Basic example">
                                            <Button variant="danger"
                                                disabled={selectedWavelength === "tdTomato"}
                                                onClick={() => updateselectedWavelength("tdTomato")}
                                            >tdTomato</Button>
                                            <Button variant="info"
                                                disabled={selectedWavelength === "DAPI"}
                                                onClick={() => updateselectedWavelength("DAPI")}
                                            >DAPI</Button>
                                        </ButtonGroup>
                                    </div>
                                </Col>
                                <Col lg={11}>

                                    <div className="controls center" >
                                        <Button onClick={() => slider.prev()}>
                                            <i className="fa fa-arrow-left"></i>
                                        </Button>
                                        &nbsp;
                                        &nbsp;
                                        <span className="" style={{ fontWeight: 'bold', color: '#0aaaf1', fontSize: 'larger' }}>

                                            Slice <input className="current_id" type="number" min="0" style={{ width: '50px' }}
                                                value={selectedSlice === 0 ? 1 : selectedSlice + 1} onChange={() => console.log()} />
                                            &nbsp; of <span className="total_result">{slicesTomato.length}</span>
                                        </span>
                                        &nbsp;
                                        &nbsp;
                                        <Button onClick={() => slider.next()}>
                                            <i className="fa fa-arrow-right"></i>
                                        </Button>

                                    </div>
                                </Col>
                            </Row>


                            <div className="frame" id={"forcecentered" + (props.main ? 1 : 2)}>
                                <ul className="clearfix">

                                    {
                                        getSliceThumbnails().map((slice, index) => {
                                            return <li key={index} id={"_" + index} index={index}
                                                //onclick, slide to slice and update selected slice
                                                onClick={() => {
                                                    slider.activate(index)

                                                }}  >
                                                <img src={slice.img_no_ext + ".webp"} className="slice" />
                                            </li>
                                        })
                                    }
                                </ul>
                            </div>

                        </div>

                    </Col>
                </Row>
            </Col >
        </Container >
        {selectedMouse&&windowOpen && (
        <NewWindow >
            <ViewSlices selectedSampleType={selectedSampleType.value} selectedOrgan={selectedOrgan.value} selectedGene={selectedGene.value} selectedMouse={selectedMouse.value} selectImage={selectImage}
            ></ViewSlices>
        </NewWindow>
      )}
        </div>
    );
}

export default ImageRenderer;
