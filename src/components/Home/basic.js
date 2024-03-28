import React from "react";
import { MapContainer, TileLayer } from 'react-leaflet';
import osm from "./osm-providers";
import { useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
const BasicMap = () => {
    const [center, setCenter] = useState({ lat: 26.922070, lng: 75.778885 });
    const ZOOM_LEVEL = 9;
    const mapRef = useRef();
    return (
        <div className="col">
            <MapContainer center={center} zoom={ZOOM_LEVEL} ref={mapRef}>
                <TileLayer url={osm.maptiler.url} attribution={osm.maptiler.attribution} />
            </MapContainer>
        </div>
    )
};
export default BasicMap;