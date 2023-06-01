import React, { Component } from "react";
import { useMap } from "react-leaflet";
import L, { LeafletMouseEvent, Map } from "leaflet";
import { useState, useEffect, useRef, useCallback, useContext } from 'react';
import Select from 'react-select';
import * as ReactDOM from 'react-dom';
import { Accordion, Card } from "react-bootstrap";
import Slider from "./Slider";
import { createRoot } from 'react-dom/client';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';

function SliderMenu(props) {
    function CustomToggle({ children, eventKey }) {
        const decoratedOnClick = useAccordionButton(eventKey, () => {
            props.toggleAccordion()
            props.map.dragging.enable();
            props.map.scrollWheelZoom.enable();

            window.removeEventListener('wheel', preventDefault, false)

        }
        );

        return (
            <div
                style={{ width: '100%' }}
                onClick={decoratedOnClick}
            >
                {children}
            </div>
        );
    }


    function preventDefault(e) {
        e = e || window.event
        if (e.preventDefault) {
            e.preventDefault()
        }
        e.returnValue = false
    }
    function createMenu() {

        const Menu = L.Control.extend({
            onAdd: function (map) {

                const container = L.DomUtil.create('div', '');


                var accordion = (
                    <Accordion style={{
                        width: "auto", padding: '4px', animation: '0s'
                    }
                    } defaultActiveKey={props.active ? "0" : "1"} >
                        <Card>
                            <CustomToggle eventKey="0" map={map}>
                                <Card.Header>
                                    {props.logo}
                                </Card.Header>
                            </CustomToggle>
                            <Accordion.Collapse eventKey="0">


                                <div style={{ padding: '6px' }}>
                                    <div style={{ padding: '6px' }}>
                                        {props.description}
                                    </div>



                                    {props.children}
                                </div>


                            </Accordion.Collapse>
                        </Card>


                    </Accordion >);

                container.onmouseover = function () {
                    //make map unclicable
                    map.dragging.disable();
                    map.scrollWheelZoom.disable();
                    window.addEventListener('wheel', preventDefault, {
                        passive: false,
                    })

                }

                container.onmouseout = function () {
                    map.dragging.enable();
                    map.scrollWheelZoom.enable();

                    window.removeEventListener('wheel', preventDefault, false)
                }

                container.ondrag = function () {
                    map.dragging.disable();
                    map.scrollWheelZoom.disable();
                    window.addEventListener('wheel', preventDefault, {
                        passive: false,
                    })
                }


                const root = createRoot(container);
                root.render(accordion);

                return container;
            }
        });
        return new Menu({ position: props.position });
    }
    useEffect(() => {
        const menu = createMenu();

        menu.addTo(props.map);
        return function cleanup() {
            props.map.removeControl(menu);
        }
    });
}

function withMap(Component) {
    return function WrappedComponent(props) {
        const map = useMap();
        return <Component {...props} map={map} />;
    }
}

export default withMap(SliderMenu);
