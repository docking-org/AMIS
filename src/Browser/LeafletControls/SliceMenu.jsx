import React, { Component } from "react";
import { useMap } from "react-leaflet";
import L, { LeafletMouseEvent, Map } from "leaflet";
import { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { createRoot } from 'react-dom/client';
function SliceMenu(props) {
    function createSliceMenu() {



        const Slices = L.Control.extend({



            onAdd: function (map) {
                map._initControlPos = function (_initControlPos) {
                    return function () {
                        //Original function/method
                        _initControlPos.apply(this, arguments);

                        //Adding new control-containers

                        //topcenter is the same as the rest of control-containers
                        this._controlCorners['topcenter'] = L.DomUtil.create('div', 'leaflet-top leaflet-center', this._controlContainer);

                        //bottomcenter need an extra container to be placed at the bottom
                        this._controlCorners['bottomcenter'] =
                            L.DomUtil.create(
                                'div',
                                'leaflet-bottom leaflet-center',
                                L.DomUtil.create('div', 'leaflet-control-bottomcenter', this._controlContainer)
                            );
                    };
                }(map._initControlPos);

                const container = L.DomUtil.create('div', '');


                var accordion = (


                    <div>
                        {props.children}
                    </div>


                );
                const root = createRoot(container);
                root.render(accordion);
                return container;
            }
        });
        return new Slices({ position: props.position });
    }
    useEffect(() => {
        const menu = createSliceMenu();

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

export default withMap(SliceMenu);
