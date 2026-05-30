"use client";

import dynamic from "next/dynamic";

const MapViewer = dynamic(
  () => import("@/components/shared/map-viewer/MapViewer"),
  { ssr: false, loading: () => <div className="h-64 animate-pulse rounded-2xl bg-zinc-100" /> },
);

type Props = {
  lat: number;
  lng: number;
  name: string;
};

export function AttractionMap({ lat, lng, name }: Props) {
  return (
    <MapViewer
      center={[lat, lng]}
      zoom={15}
      height="280px"
      markers={[{ id: "attraction", position: [lat, lng], label: name }]}
    />
  );
}
