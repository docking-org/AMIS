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

//a leaflet control that displays a scale bar. At 100% zoom, the image is 1.5379 pixels per micron
// at 10% zoom, the image is 15.379 pixels per micron, etc.


function Scale(props) {

    function createMenu() {
        let scale = L.Control.Scale.extend({
            transformation: new L.Transformation(1, 0, 1, 0),
            _updateMetric: function (maxMeters) {
                //do this to find the scale
                //Find half the map height in pixels (middle of map)
                // Get Leaflet to determine the lat/long of (0,middle of map)
                // Get Leaflet to determine the lat/long of (100,middle of map)
                // Get Leaflet to calculate the real world distance in meters between the two points.
                // Get the pixels per physical screen millimeter
                // Add a div with height:1mm; to the page
                // Get the calculated height in pixels
                // Multiply 100px by the pixels/mm
                // Convert physical screen size of 100px from milimeters to meters
                // Divide real world meters per 100px by screen meters per 100px
                // once we have the scale, we use it to calculate pixels per micron
                // when fully zoomed out, the image is 1.5379 pixels per micron
                let map = this._map;
                let y = map.getSize().y / 2;
                let x = map.getSize().x / 2;
                let latlng1 = map.containerPointToLatLng([x, y]);
                let latlng2 = map.containerPointToLatLng([x + 100, y]);
                let meters = latlng1.distanceTo(latlng2);
                let pixelsPerMm = 100 / 550;
                let screenMeters = 100 * pixelsPerMm / 1000;
                let scale = meters / screenMeters;
                let pixelsPerMicron = scale / 1000000;
                let maxMetersPerPixel = maxMeters / pixelsPerMicron;
                let metersPerPixel = this._getRoundNum(maxMetersPerPixel);
                let label = metersPerPixel < 1000 ? metersPerPixel + ' μm' : (metersPerPixel / 1000) + ' mm';
                this._updateScale(this._mScale, label, metersPerPixel / maxMetersPerPixel);




            }
        });

        return new scale()
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

export default withMap(Scale);
