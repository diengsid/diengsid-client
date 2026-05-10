/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { renderToString } from "react-dom/server";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

import { Home } from "lucide-react";
import { useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";

type MarkerItem = {
  id: string;
  position: [number, number];
  label?: string;
};

type MapViewerProps = {
  center?: [number, number];
  zoom?: number;
  markers?: MarkerItem[];
  height?: string;
};

const iconHtml = renderToString(
  <div className="flex w-fit items-center justify-center  rounded-full bg-black p-2.5 text-white shadow-lg">
    <Home size={30} />
  </div>,
);

const customIcon = L.divIcon({
  className: "",
  html: iconHtml,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

export default function MapViewer({
  center = [-7.363, 109.9], // default: Wonosobo/Dieng
  zoom = 10,
  markers = [],
  height = "400px",
}: MapViewerProps) {
  const mapCenter = useMemo(() => center, [center]);

  return (
    <div className="w-full rounded-2xl overflow-hidden relative z-0">
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {markers.map((marker) => (
          <Marker key={marker.id} position={marker.position} icon={customIcon}>
            {marker.label && <Popup>{marker.label}</Popup>}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
