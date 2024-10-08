import React from "react";
import ReactDOM from "react-dom";

import "./App.css";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import { useState, useEffect, createRef, useMemo } from "react";
import axios from "axios";
import Select from "react-select";
import {
  MapContainer,
  TileLayer,
  LayersControl,
  ScaleControl,
  Tooltip,
  useMap,
} from "react-leaflet";
import { CRS, setOptions } from "leaflet";
import {
  Button,
  Card,
  DropdownButton,
  Dropdown,
  Form,
  Overlay,
  OverlayTrigger,
  Tooltip as BSTooltip,
} from "react-bootstrap";
import $ from "jquery";
import Sly from "sly-scroll";
import LUTSelector from "./LeafletControls/LUTSelector";
import Slider from "./LeafletControls/Slider";
import SliderMenu from "./LeafletControls/SliderMenu";
import GetTiles from "./LeafletControls/GetTiles";
import "leaflet-fullscreen/dist/Leaflet.fullscreen.js";
import "leaflet-fullscreen/dist/leaflet.fullscreen.css";
import OpenPopup from "./LeafletControls/OpenPopup";
import { render, createPortal } from "react-dom";
import ViewSlices from "./ViewSlices";
import Scale from "./LeafletControls/Scale";
import SliceToggle from "./LeafletControls/SliceToggle";
import Rotate from "./LeafletControls/Rotate";
import { useLayoutEffect } from "react";
import KittenLayer from "./LeafletControls/GetTiles";
import TiledSlice from "./LeafletControls/GetTiles";

const DropdownIndicator = (props) => {
  return <div></div>;
};

function ImageRenderer(props) {
  const [rotation, setRotation] = useState(0);
  const [auto, setAuto] = useState(false);
  const lutRef = createRef(null);
  const colorRef = createRef(null);
  const [windowOpen, setWindowOpen] = useState(false);
  const [folded, setFolded] = useState(false);
  const [sampleTypes, updateSampleTypes] = useState(props.state.sampleTypes);
  const [genes, updateGenes] = useState(props.state.genes);
  const [subtypes, updateSubtypes] = useState(props.state.subtypes);
  const [organs, updateOrgans] = useState(props.state.organs);
  const [mice, updateMice] = useState(props.state.mice);
  const [activeLayers, updateActiveLayers] = useState(props.state.activeLayers);
  const [controlsHidden, setControlsHidden] = useState(
    props.state.controlsHidden
  );
  const [slices, updateSlices] = useState(props.state.slices);
  const [map, setMap] = useState(null);
  const [selectedSampleType, updateSelectedSampleType] = useState(
    props.state.selectedSampleType
  );
  const [selectedGene, updateSelectedGene] = useState(props.state.selectedGene);
  const [selectedOrgan, updateSelectedOrgan] = useState(
    props.state.selectedOrgan
  );
  const [selectedMouse, updateSelectedMouse] = useState(
    props.state.selectedMouse
  );
  const [selectedSlice, updateSelectedSlice] = useState(
    props.state.selectedMouse
  );
  const [selectedSubtype, updateSelectedSubtype] = useState(
    props.state.selectedSubtype
  );
  const [selectedWavelength, updateselectedWavelength] = useState(
    props.state.selectedWavelength
  );
  const [colorAccordion, setColorAccordion] = useState(false);
  const [lutAccordion, setlutAccordion] = useState(false);
  const [slider, setSlider] = useState(null);
  const [loaded, setLoaded] = useState(null);
  const [optionsLoaded, setOptionsLoaded] = useState(false);
  const [options, updateOptions] = useState(props.state.options);
  const [selections, updateSelections] = useState(props.state.selections);
  const [lut, updateLut] = useState(props.state.lut);
  const [layers, updateLayers] = useState(props.state.layers);
  const [brightnessBoost, updateBrightnessBoost] = useState(
    props.state.brightnessBoost
  );
  const [slicesLoaded, setSlicesLoaded] = useState(false);

  var $frame = $("#forcecentered " + (props.main ? 1 : 2));

  var slyOptions = {
    horizontal: 1,
    itemNav: "forceCentered",
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

  useEffect(() => {
    document.addEventListener("cloneDisplayOptions", (e) => {
      console.log(e.detail.options);
      updateOptions(e.detail.options);
    });

    return () => {
      if (slider) {
        slider.destroy();

        window.removeEventListener("wheel", preventDefault, { passive: false });
        window.removeEventListener("touchmove", preventDefault, {
          passive: false,
        });
        window.removeEventListener("mousewheel", preventDefault, {
          passive: false,
        });
      }
    };
  }, []);

  function selectSlice(id) {
    updateSelectedSlice(id);
  }

  function preventDefault(e) {
    e = e || window.event;
    if (e.preventDefault) {
      e.preventDefault();
    }
    e.returnValue = false;
  }

  useEffect(() => {
    if (slider) {
      slider.on("active", function (e, i) {
        selectSlice(i);
      });
      slider.reload();
    }
  }, [props.renderSize, slider]);

  useEffect(() => {
    loadSlices();
  }, [selectedMouse]);

  useEffect(() => {
    if (map) {
      map.setZoom(0);
      map.setBearing(0);
    }
  }, [selectedSlice]);

  window.addEventListener("resize", () => {
    if (slider) {
      slider.reload();
      try {
        slider.activate(selectedSlice);
      } catch (e) {
        console.log();
      }
    }
  });

  function loadSlices() {
    if (selectedMouse) {
      var url = "/slices?per_page=-1&order_by=slice_id";
      url += "&instrument=" + "Histological";
      url += "&gene=" + selectedGene["value"];
      url += "&organ=" + selectedOrgan["value"];
      url += "&mouse_number=" + selectedMouse["value"];

      axios({
        method: "GET",
        url: url,
        dataType: "json",
        dataSrc: "items",
      }).then((response) => {
        var res = response.data.items;

        console.log(res);

        var slices = {};
        res.forEach((slice) => {
          if (!slices[slice.wavelength]) {
            slices[slice.wavelength] = [];
          }
          slices[slice.wavelength].push(slice);
        });
        console.log(slices);
        updateSlices(slices);
        updateselectedWavelength(Object.keys(slices).sort().reverse()[0]);
        updateActiveLayers([Object.keys(slices).sort().reverse()[0]]);
        setSlicesLoaded(true);
        if (!slider) {
          try {
            setSlider(
              new Sly(
                "#forcecentered" + (props.main ? 1 : 2),
                slyOptions
              ).init()
            );

            slider.activate(props.state.selectedSlice);
          } catch (e) {
            console.log();
          }
        } else {
          slider.reload();
          try {
            slider.activate(props.state.selectedSlice);
          } catch (e) {
            console.log();
          }
        }
      });
    }
  }

  useLayoutEffect(() => {
    if (!props.main) {
      setFolded(true);
    }
    if (slicesLoaded) {
      updateSelectedMouse(null);
      updateMice([]);
      updateSelectedOrgan(null);
      updateOrgans([]);
      updateLayers([]);
    }
  }, [selectedGene, selectedSubtype]);

  useLayoutEffect(() => {
    if (slicesLoaded) {
      updateSelectedSubtype(null);
      updateSelectedOrgan(null);
      updateOrgans([]);
      updateSelectedMouse(null);
      updateMice([]);
      updateLayers([]);
    }
  }, [selectedGene]);

  useEffect(() => {
    updateSelectedMouse(null);
    updateMice([]);
    updateLayers([]);
    console.log("selectedOrgan changed");
    if (selectedGene && selectedOrgan && selectedSampleType) {
      let url = "/mice?";
      console.log(selectedSubtype);
      if (selectedSubtype) {
        url += "&subtype=" + selectedSubtype["value"];
      }
      url += "&instrument=" + selectedSampleType["value"];
      url += "&gene=" + selectedGene["value"];
      url += "&organ=" + selectedOrgan["value"];

      axios({
        method: "GET",
        url: url,
        dataType: "json",
        dataSrc: "items",
      }).then((response) => {
        var res = response.data.items;

        updateMice(res);
        if (props.state.selectedMouse) {
          updateSelectedMouse(props.state.selectedMouse);
        }
      });
    }
  }, [selectedOrgan]);

  function updateOption(key, value) {
    if (options[key] != value) {
      updateOptions({ ...options, [key]: value });
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
    try {
      if (
        !event.target.className.includes("accordion") &&
        !event.target.closest(".accordion")
      ) {
        closeAccordions();
      }
    } catch (e) {
      console.log();
    }
  }

  //on load, load selections
  useEffect(() => {
    if (!optionsLoaded) {
      loadAllFilters();
    }
  }, [props.main, optionsLoaded]);

  function togglelutAccordion() {
    setlutAccordion(!lutAccordion);
  }

  function toggleColorAccordion() {
    setColorAccordion(!colorAccordion);
  }

  function changeLut(layer, option) {
    if (lut[layer] != option) {
      updateLut({ ...lut, [layer]: option });
    }
  }

  function buildState() {
    setControlsHidden(false);

    // const blob = new Blob([JSON.stringify(d)], { type: 'application/json' });
    // const href = URL.createObjectURL(blob);
    // const link = document.createElement('a');
    // link.href = href;
    // link.download = "file.json";
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
    return {
      genes: genes,
      organs: organs,
      mice: mice,
      selectedSampleType: selectedSampleType,
      selectedGene: selectedGene,
      selectedSubtype: selectedSubtype,
      selectedOrgan: selectedOrgan,
      selectedMouse: selectedMouse,
      selectedSlice: selectedSlice,
      selectedWavelength: selectedWavelength,
      loaded: loaded,
      options: options,
      slices: slices,
      lut: lut,
      selections: selections,
      sampleTypes: sampleTypes,
      optionsLoaded: optionsLoaded,
      activeLayers: activeLayers,
      controlsHidden: false,
    };
  }

  useEffect(() => {
    if (!props.main && !loaded) {
      loadSlices();
      updateSelectedSlice(props.state.selectedSlice);

      setLoaded(true);
    }
  }, [selectedMouse]);

  useEffect(() => {
    if (slider) {
      slider.reload();
      slider.activate(selectedSlice);
    }
  }, [selectedWavelength]);

  useEffect(() => {
    console.log(selectedSampleType);
  }, [selectedSampleType]);

  function getSliceThumbnails() {
    if (slices[selectedWavelength]) {
      return slices[selectedWavelength];
    } else return [];
  }

  function resetValues() {
    updateOptions({
      brightness: 100,
      contrast: 100,
      min: 0,
      max: 100,
      blend: 100,
      opacityThreshold: 2,
    });
  }

  function getAutoValues() {
    var selectedUrl = "";

    selectedUrl = slices[selectedWavelength][selectedSlice].img_no_ext;

    axios({
      method: "GET",
      url: "/getAutoValues?url=" + encodeURIComponent(selectedUrl),
      dataType: "json",
      dataSrc: "items",
    }).then((response) => {
      var res = response.data;
      console.log(res);
      updateOptions({
        brightness: parseInt(res.brightness),
        contrast: Math.round((parseFloat(res.contrast) / 3) * 100),
        min: parseInt(res.min),
        max: parseInt(res.max),
        blend: options.blend,
        opacityThreshold: options.opacityThreshold,
      });
      console.log(options);
    });
  }

  function loadAllFilters() {
    //loads all available filters from /filters endpoint
    //sample return line {"experiment":"Ai9","gene":"GPR68","organ":"heart","sample_type":"Histological","unique":"GPR68Ai9heartHistological"},
    // the filters are unique to the combination of gene, organ, and sample type

    axios({
      method: "GET",
      url: "/filters",
      dataType: "json",
      dataSrc: "items",
    }).then((response) => {
      var res = response.data.items;

      var genes = [];
      var subtypes = [];
      var organs = [];

      var response = [];
      //sample line in res {"experiment":"Ai9","gene":"GPR85","organ":"kidney","sample_type":"Cleared","unique":"GPR85Ai9kidneyCleared"},
      var sampleTypes = {};
      res.forEach((filter) => {
        if (!sampleTypes[filter.sample_type]) {
          sampleTypes[filter.sample_type] = { genes: [] };
        }
        if (genes.length == 0 || !genes.includes(filter.gene)) {
          genes.push(filter.gene);
        }
        console.log(filter);

        if (filter.subtype) {
          if (!sampleTypes[filter.sample_type].genes[filter.gene]) {
            sampleTypes[filter.sample_type].genes[filter.gene] = {
              subtypes: [],
            };
          }
          if (
            !sampleTypes[filter.sample_type].genes[filter.gene].subtypes[
              filter.subtype
            ]
          ) {
            sampleTypes[filter.sample_type].genes[filter.gene].subtypes[
              filter.subtype
            ] = { organs: [] };
          }
          if (organs.length == 0 || !organs.includes(filter.organ)) {
            organs.push(filter.organ);
          }
          if (
            !sampleTypes[filter.sample_type].genes[filter.gene].subtypes[
              filter.subtype
            ].organs[filter.organ]
          ) {
            sampleTypes[filter.sample_type].genes[filter.gene].subtypes[
              filter.subtype
            ].organs[filter.organ] = { mice: [] };
          }
        }

        //add subtypes
        else {
          if (!sampleTypes[filter.sample_type].genes[filter.gene]) {
            sampleTypes[filter.sample_type].genes[filter.gene] = { organs: [] };
          }
          if (organs.length == 0 || !organs.includes(filter.organ)) {
            organs.push(filter.organ);
          }

          if (
            sampleTypes[filter.sample_type].genes[filter.gene].organs &&
            !sampleTypes[filter.sample_type].genes[filter.gene].organs[
              filter.organ
            ]
          ) {
            sampleTypes[filter.sample_type].genes[filter.gene].organs[
              filter.organ
            ] = { mice: [] };
          }
        }
      });

      //remove 0 entries from sampleTypes, which are created by the [{}]

      console.log(sampleTypes);
      updateSelections(sampleTypes);
      updateSelectedSampleType({
        value: "Histological",
        label: "Histological",
      });
      setOptionsLoaded(true);
    });
  }

  function fold() {
    setFolded(!folded);
  }

  useEffect(() => {
    if (!controlsHidden) {
      if (slider) {
        slider.reload();
        slider.activate(selectedSlice);
      }
    }
  }, [folded]);

  const NewWindow = ({ children, close }) => {
    const newWindow = useMemo(() =>
      window.open("about:blank", "newWin", `width=800,height=600`)
    );
    newWindow.onbeforeunload = () => {
      setWindowOpen(false);
    };
    copyStyles(document, newWindow.document);
    //copy javascript
    const script = document.createElement("script");
    script.src =
      "https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js";
    script.async = true;
    newWindow.document.head.appendChild(script);

    const script4 = document.createElement("script");
    script.src =
      "https://ajax.googleapis.com/ajax/libs/jqueryui/1.9.1/jquery-ui.min.js";
    script.async = true;
    newWindow.document.head.appendChild(script4);

    //bootstrap js
    const script2 = document.createElement("script");
    script2.src =
      "https://cdn.jsdelivr.net/npm/react-bootstrap@next/dist/react-bootstrap.min.js";
    script2.async = true;
    newWindow.document.head.appendChild(script2);

    //bootstrap css
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css";
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
    console.log(selectedMouse);
  }, [windowOpen]);

  function copyStyles(sourceDoc, targetDoc) {
    Array.from(sourceDoc.styleSheets).forEach((styleSheet) => {
      if (styleSheet.cssRules) {
        // for <style> elements
        const newStyleEl = sourceDoc.createElement("style");

        Array.from(styleSheet.cssRules).forEach((cssRule) => {
          // write the text of each rule into the body of the style element
          newStyleEl.appendChild(sourceDoc.createTextNode(cssRule.cssText));
        });

        targetDoc.head.appendChild(newStyleEl);
      } else if (styleSheet.href) {
        // for <link> elements loading CSS from a URL
        const newLinkEl = sourceDoc.createElement("link");

        newLinkEl.rel = "stylesheet";
        newLinkEl.href = styleSheet.href;
        targetDoc.head.appendChild(newLinkEl);
      }
    });
  }
  function selectImage(i, wavelength) {
    updateActiveLayers([wavelength]);
    updateSlices(slices);
    selectSlice(i);
    slider.activate(i);
    console.log(activeLayers);
    //activate tilelayer for selected wavelength
  }

  const mapRef = React.useRef(null);

  useEffect(() => {
    var layers = [];

    Object.keys(slices)
      .sort()
      .reverse()
      .forEach((wavelength) => {
        console.log(wavelength);
        let active = activeLayers.includes(wavelength);
        if (active) {
          layers.push(
            <TiledSlice
              wavelength={wavelength}
              lut={lut[wavelength]}
              url={encodeURIComponent(
                slices[wavelength][selectedSlice]
                  ? slices[wavelength][selectedSlice].img_no_ext
                  : null
              )}
              brightness={options.brightness}
              contrast={options.contrast}
              opacityThreshold={options.opacityThreshold}
              min={options.min}
              max={options.max}
              autoBrightness={auto}
            />
          );
        }
      });

    updateLayers(layers);
  }, [
    selectedWavelength,
    selectedSlice,
    slices,
    selectedMouse,
    options,
    lut,
    activeLayers,
    auto,
  ]);

  // useEffect(() => {
  //   let tiles = document.getElementsByClassName("leaflet-tile");
  //   for (let i = 0; i < tiles.length; i++) {
  //     tiles[i].style.filter = `brightness(${options.brightness}%) contrast(${options.contrast
  //       }%)`;
  //   }
  // }, [options]);

  function InitMap() {
    const map = useMap();
    map.zoomControl.setPosition(props.main ? "topright" : "topleft");
    map.fullscreenControl.setPosition(props.main ? "topright" : "topleft");
    map.rotateControl.setPosition(props.main ? "topright" : "topleft");
    setMap(map);
    return null;
  }

  const cloneOptionsEvent = new CustomEvent("cloneDisplayOptions", {
    detail: {
      options: options,
    },
  });
  return (
    <div>
      <Container fluid className="imageBrowser g-0">
        <Col>
          <Row className="justify-content-end">
            <div
              className={
                props.main
                  ? folded
                    ? "sidebar-left"
                    : "sidebar-left open"
                  : folded
                  ? "sidebar-right"
                  : "sidebar-right open"
              }
              // onMouseEnter={() => setFolded(false)}
              // onMouseLeave={() =>
              //   selectedMouse ? setFolded(true) : setFolded(false)
              // }
            >
              <div
                className="select-card"
                onClick={() => {
                  if (folded) {
                    setFolded(false);
                  }
                }}
              >
                {optionsLoaded ? (
                  <div>
                    <label className="col-sm-4 col-form-label">Gene</label>
                    <Select
                      components={{ DropdownIndicator }}
                      defaultValue={selectedGene}
                      value={selectedGene}
                      isDisabled={!selectedSampleType}
                      isClearable={props.renderSize === 12 ? true : false}
                      options={
                        selectedSampleType
                          ? Object.keys(
                              selections[selectedSampleType["value"]].genes
                            )
                              .sort()
                              .map((gene) => ({ value: gene, label: gene }))
                          : []
                      }
                      onChange={(option) =>
                        updateSelectedGene(option ? option : null)
                      }
                    />
                    {selectedGene &&
                    selections[selectedSampleType["value"]].genes[
                      selectedGene["value"]
                    ].subtypes ? (
                      <div>
                        <label className="col-sm-4 col-form-label">
                          Subtype
                        </label>

                        <Select
                          components={{ DropdownIndicator }}
                          defaultValue={selectedSubtype}
                          value={selectedSubtype}
                          isDisabled={!selectedSampleType}
                          isClearable={props.renderSize === 12 ? true : false}
                          options={
                            //if selectedGene and gene has subtypes, return subtypes, else return empty array

                            selectedGene &&
                            selections[selectedSampleType["value"]].genes[
                              selectedGene["value"]
                            ].subtypes
                              ? Object.keys(
                                  selections[selectedSampleType["value"]].genes[
                                    selectedGene["value"]
                                  ].subtypes
                                )
                                  .sort()
                                  .map((subtype) => ({
                                    value: subtype,
                                    label: subtype,
                                  }))
                              : []
                          }
                          onChange={(option) => {
                            updateSelectedSubtype(option ? option : null);
                          }}
                        />
                      </div>
                    ) : null}
                    <label className="col-sm-4 col-form-label">Organ</label>
                    <Select
                      components={{ DropdownIndicator }}
                      defaultValue={selectedOrgan}
                      value={selectedOrgan}
                      isDisabled={
                        !selectedGene ||
                        (selectedGene &&
                          selections[selectedSampleType["value"]].genes[
                            selectedGene["value"]
                          ].subtypes &&
                          !selectedSubtype)
                      }
                      isClearable={props.renderSize === 12 ? true : false}
                      options={
                        selectedGene
                          ? selectedGene &&
                            selections[selectedSampleType["value"]].genes[
                              selectedGene["value"]
                            ].subtypes
                            ? selectedSubtype
                              ? Object.keys(
                                  selections[selectedSampleType["value"]].genes[
                                    selectedGene["value"]
                                  ].subtypes[selectedSubtype["value"]].organs
                                )
                                  .sort()
                                  .map((organ) => ({
                                    value: organ,
                                    label: organ,
                                  }))
                              : []
                            : Object.keys(
                                selections[selectedSampleType["value"]].genes[
                                  selectedGene["value"]
                                ].organs
                              )
                                .sort()
                                .map((organ) => ({
                                  value: organ,
                                  label: organ,
                                }))
                          : []

                        // Object.keys(selections[selectedSampleType['value']].genes[selectedGene['value']].subtypes[selectedSubtype['value']].organs).sort().map(organ => ({"value": organ, "label": organ }))
                        // : selectedGene ? Object.keys(selections[selectedSampleType['value']].genes[selectedGene['value']].organs).sort().map(organ => ({"value": organ, "label": organ })) : []
                      }
                      onChange={(option) =>
                        updateSelectedOrgan(option ? option : null)
                      }
                    />
                    <label className="col-sm-4 col-form-label">Mouse</label>
                    <Select
                      components={{ DropdownIndicator }}
                      defaultValue={selectedMouse}
                      value={selectedMouse}
                      isDisabled={!selectedOrgan}
                      isClearable={props.renderSize === 12 ? true : false}
                      options={
                        selectedOrgan
                          ? mice
                              .sort((a, b) => {
                                return a.spec < b.spec
                                  ? -1
                                  : a.spec > b.spec
                                  ? 1
                                  : 0;
                              })
                              .map((mouse) => ({
                                value: mouse.number,
                                label:
                                  (mouse.sex !== true ? "♀" : "♂") +
                                  "  " +
                                  mouse.number +
                                  "  " +
                                  (mouse.spec === "+" ? "pos" : "neg"),
                              }))
                          : []
                      }
                      onChange={(option) =>
                        updateSelectedMouse(option ? option : null)
                      }
                    />
                    <br />
                    <Button onClick={() => setFolded(!folded)}>
                      {folded ? "Show" : "Hide"} Filters
                    </Button>
                    {/* 
                                            {props.main ?
                                                (


                                                    <button type="button" className="btn btn-toggle-split btn-dark"
                                                        title='Add a new display to the right panel'
                                                        onClick={() => { props.splitScreen(buildState()) }}>Toggle Split Screen</button>



                                                )
                                                : null} */}
                    &nbsp;
                    <div className="col-sm-hidden col-md-10 row slice_details"></div>
                  </div>
                ) : (
                  <div className="select-card">
                    <Spinner animation="border" role="status">
                      <span className="sr-only">Loading...</span>
                    </Spinner>
                  </div>
                )}
              </div>
              {selectedMouse ? (
                <div
                  className="select-card"
                  onClick={() => {
                    if (folded) {
                      setFolded(false);
                    }
                  }}
                >
                  <b>Experiment</b>
                  <br></br>
                  <br></br>
                  Mouse Id: {selectedMouse ? selectedMouse.value : null}
                  <br></br>
                  Age:{" "}
                  {slices[selectedWavelength]
                    ? slices[selectedWavelength][0].age
                    : null}
                  <br></br>
                  Sex:{" "}
                  {slices[selectedWavelength]
                    ? slices[selectedWavelength][0].sex
                    : null}
                  <br></br>
                  Construct:{" "}
                  {slices[selectedWavelength]
                    ? slices[selectedWavelength][0].construct
                    : null}
                </div>
              ) : null}
            </div>

            {/* {
                            !selectedMouse &&

                            <Row className='justify-content-center mt-1'>
                                <Col
                                    lg={{ span: 6, offset: 3 }}
                                >
                                    <div class="bg-light border rounded-3 p-3">
                                        <h3>No mouse selected, please use the panel on the {props.main ? 'left' : 'right'} to select a mouse</h3>
                                    </div>
                                </Col>
                            </Row>



                        } */}

            <Col
              lg={
                // if folded and the render size is 6, then size is 12
                // if folded and the render size is 12, then size is 10
                // if not folded and the render size is 6, then size is 12
                // if not folded and the render size is 12, then size is 12
                props.renderSize === 6 ? 12 : folded ? 12 : 10
              }
              style={{ height: controlsHidden ? "90vh" : "65vh" }}
            >
              <MapContainer
                whenReady={(mapInstance) => {
                  mapRef.current = mapInstance;
                }}
                rotate={true}
                shiftKeyRotate={true}
                rotateControl={{
                  resetValues: 0,
                  closeOnZeroBearing: false,
                  position: props.main ? "topright" : "topleft",
                }}
                bearing={rotation || "0"}
                style={{ height: "100%" }}
                attributionControl={false}
                fullscreenControl={true}
                center={[-250, 250]}
                crs={CRS.Simple}
                scrollWheelZoom
                zoom={1}
              >
                {/* <OpenPopup position="topright"
                                    setWindowOpen={setWindowOpen}
                                >



                                </OpenPopup> */}

                <InitMap />

                <SliderMenu
                  position="bottomleft"
                  active={colorAccordion}
                  closeAccordions={closeAccordions}
                  toggleAccordion={toggleColorAccordion}
                  logo={"Image Display Options"}
                  className="color-accordion"
                >
                  <Slider
                    label="min"
                    value="min"
                    updateOption={updateOption}
                    defaultValue={options["min"]}
                    onChange={() => console.log()}
                    tooltip="Adjust Min Value"
                    min={0}
                    max={100}
                    delta={15}
                    maxValue={65535}
                  />
                  <Slider
                    label="max"
                    value="max"
                    updateOption={updateOption}
                    defaultValue={options["max"]}
                    onChange={() => console.log()}
                    tooltip="Adjust Max Value"
                    min={0}
                    max={100}
                    delta={15}
                    maxValue={65535}
                  />
                  {/* <Slider
                    icon="tint"
                    value="blend"
                    updateOption={updateOption}
                    defaultValue={options["blend"]}
                    onChange={() => console.log()}
                    tooltip="Adjust Opacity"
                    min={0}
                    max={100}
                    delta={15}
                    maxValue={100}
                  /> */}
                  {/* <Slider
                    icon="tint"
                    value="opacityThreshold"
                    updateOption={updateOption}
                    defaultValue={options["opacityThreshold"]}
                    onChange={() => console.log()}
                    tooltip="Adjust Opacity Threshold (lowest % of pixel values will be transparent)"
                    min={0}
                    max={255}
                    delta={10}
                    maxValue={65534}
                  /> */}
                  <Slider
                    icon="sun"
                    value="brightness"
                    updateOption={updateOption}
                    defaultValue={options["brightness"]}
                    onChange={() => console.log()}
                    tooltip="Adjust Brightness"
                    min={-8100}
                    max={8300}
                    delta={1000}
                    maxValue={65534}
                    minValue={-65534}
                  />
                  <Slider
                    icon="adjust"
                    value="contrast"
                    updateOption={updateOption}
                    defaultValue={options["contrast"]}
                    onChange={() => console.log()}
                    tooltip="Adjust Contrast"
                    min={0}
                    max={200}
                    delta={10}
                    maxValue={65525}
                    minValue={-65525}
                  />
                  <br></br>
                  <Button size="sm" onClick={() => resetValues()}>
                    {" "}
                    Reset Values
                  </Button>
                  &nbsp;
                  <Button
                    size="sm"
                    onClick={() => setAuto(!auto)}
                    variant={auto ? "primary" : "outline-secondary"}
                  >
                    {" "}
                    Auto
                  </Button>
                  &nbsp;
                  <br />
                  {props.renderSize !== 12 ? (
                    <Button
                      size="sm"
                      className="mt-1"
                      onClick={() => {
                        document.dispatchEvent(cloneOptionsEvent);
                      }}
                    >
                      Apply to {props.main ? "Right" : "Left"} Panel
                    </Button>
                  ) : (
                    ""
                  )}
                </SliderMenu>
                {/* 
                                <SliderMenu position="bottomright" closeAccordions={closeAccordions} active={lutAccordion} toggleAccordion={togglelutAccordion}
                                    className="lut-accordion"
                                    description={'Apply a Look Up Table to the layers'}
                                    logo={"LUT"}

                                >
                                    



                                </SliderMenu> */}
                {layers}

                {props.main ? (
                  <div className="leaflet-bottom leaflet-right">
                    <div className="leaflet-control">
                      <button
                        type="button"
                        className="btn btn-toggle-split btn-dark "
                        title="Add a new display to the right panel"
                        onClick={() => {
                          props.splitScreen(buildState());
                        }}
                      >
                        Toggle Split Screen
                      </button>
                    </div>
                  </div>
                ) : null}

                <div
                  className="leaflet-bottom leaflet-center"
                  onClick={() => {
                    setControlsHidden(!controlsHidden);
                    console.log(controlsHidden);
                  }}
                >
                  <OverlayTrigger
                    overlay={
                      <BSTooltip>
                        {controlsHidden
                          ? "Show Slice Viewer"
                          : "Hide Slice Viewer"}
                      </BSTooltip>
                    }
                  >
                    <div className="leaflet-control">
                      <Button variant="secondary">
                        <i
                          className={
                            "fas fa-arrow-" + (controlsHidden ? "up" : "down")
                          }
                          aria-hidden="true"
                        ></i>
                      </Button>
                    </div>
                  </OverlayTrigger>
                </div>
              </MapContainer>
              <Row hidden={!selectedMouse} className="g-1">
                <Col lg={2} hidden={controlsHidden} className="ms-0 mx-0">
                  <Card>
                    <Card.Header style={{ "font-size": ".9em" }}>
                      Active Layers / LUT
                      <div style={{ float: "right" }}>
                        <OverlayTrigger
                          overlay={
                            <BSTooltip>
                              Show/hide Layers in the map or apply a Look Up
                              Table to the layers
                            </BSTooltip>
                          }
                        >
                          <i className="fas fa-info"></i>
                        </OverlayTrigger>
                      </div>
                    </Card.Header>
                    <Card.Body className="p-1" style={{ "font-size": ".8em" }}>
                      <div className="">
                        {Object.keys(slices).length >= 1
                          ? Object.keys(slices)
                              .sort()
                              .reverse()
                              .map((wavelength, index) => {
                                return (
                                  <div className="mb-2">
                                    <Form.Check
                                      type="checkbox"
                                      label={wavelength}
                                      checked={activeLayers.includes(
                                        wavelength
                                      )}
                                      onChange={() => {
                                        if (activeLayers.includes(wavelength)) {
                                          updateActiveLayers(
                                            activeLayers.filter(
                                              (item) => item !== wavelength
                                            )
                                          );
                                        } else {
                                          updateActiveLayers(
                                            activeLayers.concat(wavelength)
                                          );
                                        }
                                        console.log(activeLayers);
                                      }}
                                    />

                                    <LUTSelector
                                      layer={wavelength}
                                      changeLut={changeLut}
                                      option={lut[wavelength]}
                                    />
                                  </div>
                                );
                              })
                          : ""}

                        {/* <ButtonGroup aria-label="Basic example">
                                                    {
                                                        Object.keys(slices).length >= 1 ?
                                                            Object.keys(slices).sort().reverse().map((wavelength, index) => {
                                                                return <Button variant="secondary" onClick={() => { updateselectedWavelength(wavelength) }} active={selectedWavelength === wavelength ? true : false}>{wavelength}</Button>
                                                            }) : ""
                                                    }
                                                    <Button
                                                        onClick={() => {
                                                            updateBrightnessBoost(!brightnessBoost)
                                                        }}
                                                        variant={brightnessBoost ? "warning" : "secondary"}
                                                    >
                                                        <i className="fa fa-sun"
                                                        >  </i>
                                                    </Button>
                                                </ButtonGroup> */}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={10}>
                  <div className="wrap" hidden={controlsHidden}>
                    <Card className="ps-1 pe-1 bg-dark pb-2">
                      <div
                        className="frame"
                        id={"forcecentered" + (props.main ? 1 : 2)}
                      >
                        <ul className="clearfix">
                          {getSliceThumbnails().map((slice, index) => {
                            return (
                              <li
                                key={index}
                                id={"_" + index}
                                index={index}
                                //onclick, slide to slice and update selected slice
                                onClick={() => {
                                  if (!controlsHidden) {
                                    selectImage(index, selectedWavelength);
                                  }
                                }}
                              >
                                <img
                                  src={slice.img_no_ext + ".webp"}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = `${slice.img_no_ext}.png`;
                                  }}
                                  style={{
                                    filter: `brightness(${
                                      brightnessBoost ? 20 : 1
                                    })`,
                                  }}
                                  className="slice"
                                />
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                      <Row>
                        <Col lg={3} hidden={props.renderSize !== 12}></Col>
                        <Col lg={6}>
                          <div
                            className="controls center"
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <OverlayTrigger
                              overlay={<BSTooltip>Previous Slice</BSTooltip>}
                            >
                              <Button onClick={() => slider.prev()}>
                                <i className="fa fa-arrow-left"></i>
                              </Button>
                            </OverlayTrigger>
                            &nbsp; &nbsp;
                            <div className="mt-1">
                              <span
                                className=""
                                style={{
                                  fontWeight: "bold",
                                  color: "#0aaaf1",
                                  fontSize: "larger",
                                }}
                              >
                                Slice{" "}
                                <input
                                  className="current_id"
                                  type="number"
                                  min="0"
                                  style={{ width: "50px" }}
                                  value={
                                    selectedSlice === ""
                                      ? selectedSlice
                                      : selectedSlice + 1
                                  }
                                  onChange={(e) => {
                                    //if slice is valid and value is not null
                                    console.log(e.target.value);
                                    if (e.target.value === "") {
                                      updateSelectedSlice("");
                                    } else if (
                                      e.target.value &&
                                      e.target.value <=
                                        slices[selectedWavelength].length &&
                                      e.target.value > 0
                                    ) {
                                      selectImage(
                                        e.target.value - 1,
                                        selectedWavelength
                                      );
                                    }
                                  }}
                                />
                                &nbsp; of{" "}
                                <span className="total_result">
                                  {slices[selectedWavelength]
                                    ? slices[selectedWavelength].length
                                    : 0}
                                </span>
                              </span>
                            </div>
                            &nbsp; &nbsp;
                            <OverlayTrigger
                              overlay={<BSTooltip>Next Slice</BSTooltip>}
                            >
                              <Button onClick={() => slider.next()}>
                                <i className="fa fa-arrow-right"></i>
                              </Button>
                            </OverlayTrigger>
                          </div>
                        </Col>

                        <Col
                          lg={props.renderSize === 12 ? 3 : 5}
                          className="mt-2"
                        >
                          <div
                            style={{ display: "flex", justifyContent: "end" }}
                          >
                            <OverlayTrigger
                              overlay={
                                <BSTooltip>Select Slice Viewer Layer</BSTooltip>
                              }
                            >
                              <DropdownButton
                                drop="start"
                                title={selectedWavelength}
                              >
                                {Object.keys(slices).length >= 1
                                  ? Object.keys(slices)
                                      .sort()
                                      .reverse()
                                      .map((wavelength, index) => {
                                        return (
                                          <Dropdown.Item
                                            onClick={() => {
                                              updateselectedWavelength(
                                                wavelength
                                              );
                                            }}
                                            active={
                                              selectedWavelength === wavelength
                                                ? true
                                                : false
                                            }
                                          >
                                            {wavelength}
                                          </Dropdown.Item>
                                        );
                                      })
                                  : ""}
                              </DropdownButton>
                            </OverlayTrigger>
                            &nbsp;
                            <OverlayTrigger
                              overlay={
                                <BSTooltip>
                                  {brightnessBoost ? "Disable" : "Enable"}{" "}
                                  Brightness Boost
                                </BSTooltip>
                              }
                            >
                              <Button
                                onClick={() => {
                                  updateBrightnessBoost(!brightnessBoost);
                                }}
                                variant={
                                  brightnessBoost ? "warning" : "secondary"
                                }
                              >
                                <i className="fa fa-sun"> </i>
                              </Button>
                            </OverlayTrigger>
                            &nbsp;
                            <OverlayTrigger
                              overlay={
                                <BSTooltip>
                                  Open Slice Viewer in New Window
                                </BSTooltip>
                              }
                            >
                              <Button
                                onClick={() => {
                                  setControlsHidden(true);
                                  setWindowOpen(true);
                                }}
                                variant="secondary"
                              >
                                <i className="fa fa-external-link-alt"> </i>
                              </Button>
                            </OverlayTrigger>
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Container>

      {selectedMouse && windowOpen && (
        <NewWindow>
          <ViewSlices
            selectedSampleType={selectedSampleType.value}
            selectedOrgan={selectedOrgan.value}
            selectedGene={selectedGene.value}
            selectedMouse={selectedMouse.value}
            selectImage={selectImage}
            setFolded={setFolded}
            slices={slices}
            selectedWavelength={selectedWavelength}
          ></ViewSlices>
        </NewWindow>
      )}
    </div>
  );
}

export default ImageRenderer;
