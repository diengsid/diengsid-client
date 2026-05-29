"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { Property } from "../schemas/schema-property";

interface Props {
  properties: Property[];
  hoveredId?: string | null;
}

const PLACEHOLDER = "https://placehold.co/400x300/e5e7eb/9ca3af?text=No+Image";

function makePriceIcon(label: string, active: boolean) {
  const bg = active ? "#18181b" : "#ffffff";
  const color = active ? "#ffffff" : "#18181b";
  const shadow = active
    ? "0 2px 12px rgba(0,0,0,0.35)"
    : "0 2px 8px rgba(0,0,0,0.18)";
  const html = `<div style="
    display:inline-block;
    padding:5px 10px;
    border-radius:9999px;
    font-size:12px;
    font-weight:700;
    white-space:nowrap;
    background:${bg};
    color:${color};
    border:2px solid white;
    box-shadow:${shadow};
    transform:translateX(-50%) ${active ? "scale(1.12)" : "scale(1)"};
    transition:all .15s;
    cursor:pointer;
  ">${label}</div>`;

  return L.divIcon({
    className: "",
    html,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

function Recenter({ properties }: { properties: Property[] }) {
  const map = useMap();
  const first = properties.find((p) => p.lat != null && p.lng != null);
  useEffect(() => {
    if (first?.lat != null && first?.lng != null) {
      map.setView([first.lat, first.lng], map.getZoom(), { animate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [properties.length]);
  return null;
}

function PropertyPopupCard({ property }: { property: Property }) {
  const thumbnail =
    property.thumbnail_url ||
    property.images?.find((img) => img.is_primary)?.image_url ||
    property.images?.[0]?.image_url ||
    PLACEHOLDER;

  const minPrice = property.rentable?.length
    ? Math.min(...property.rentable.map((r) => r.base_price))
    : null;

  const href = `/properties/${property.id}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ display: "block", textDecoration: "none", color: "inherit", width: 220 }}
    >
      {/* image */}
      <div style={{ position: "relative", width: "100%", height: 130, overflow: "hidden", background: "#e5e7eb" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={thumbnail}
          alt={property.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          onError={(e) => { (e.target as HTMLImageElement).src = PLACEHOLDER; }}
        />
        <span style={{
          position: "absolute",
          top: 8,
          left: 8,
          background: "rgba(0,0,0,0.45)",
          color: "#fff",
          fontSize: 10,
          fontWeight: 600,
          padding: "2px 8px",
          borderRadius: 999,
          textTransform: "capitalize",
        }}>
          {property.property_type}
        </span>
      </div>

      {/* content */}
      <div style={{ padding: "10px 12px 12px" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#18181b", margin: 0, lineHeight: 1.3, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
          {property.title}
        </p>
        <p style={{ fontSize: 11, color: "#71717a", margin: "3px 0 0", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
          {property.address}
        </p>
        <div style={{ marginTop: 8, display: "flex", alignItems: "baseline", gap: 4 }}>
          {minPrice != null ? (
            <>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#18181b" }}>
                Rp {minPrice.toLocaleString("id-ID")}
              </span>
              <span style={{ fontSize: 11, color: "#a1a1aa" }}>/ malam</span>
            </>
          ) : (
            <span style={{ fontSize: 11, color: "#a1a1aa" }}>Harga belum tersedia</span>
          )}
        </div>
      </div>
    </a>
  );
}

export default function SearchMap({ properties, hoveredId }: Props) {
  const withCoords = properties.filter((p) => p.lat != null && p.lng != null);

  const center: [number, number] =
    withCoords.length > 0
      ? [withCoords[0].lat!, withCoords[0].lng!]
      : [-7.363, 109.9];

  return (
    <div className="h-full w-full">
      <MapContainer
        center={center}
        zoom={11}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Recenter properties={properties} />

        {withCoords.map((p) => {
          const minPrice = p.rentable?.length
            ? Math.min(...p.rentable.map((r) => r.base_price))
            : null;
          const label = minPrice
            ? `Rp ${(minPrice / 1000).toFixed(0)}rb`
            : p.title.slice(0, 10);
          const icon = makePriceIcon(label, hoveredId === p.id);

          return (
            <Marker key={p.id} position={[p.lat!, p.lng!]} icon={icon}>
              <Popup className="property-card-popup" closeButton autoPan={false}>
                <PropertyPopupCard property={p} />
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
