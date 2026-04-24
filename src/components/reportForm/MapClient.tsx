"use client"
import { MapContainer, TileLayer, Marker, useMap , Popup } from "react-leaflet";
import L from 'leaflet'
import { useEffect } from "react";

type Props = {
    lat: number;
    lng: number;
    setLocation: (location: { lat: number, lng: number }) => void;
    severity: string;
}

const getIcon = (severity: string) => {
  const color =
    severity === 'high' ? 'red' :
    severity === 'medium' ? 'orange' :
    'green'

  return L.divIcon({
    html: `
      <div style="
        width:16px;
        height:16px;
        background:${color};
        border-radius:50%;
        border:2px solid white;
      "></div>
    `,
    className: '',
  })
}
export default function MapClient({ lat, lng, setLocation, severity }: Props) {

    function LocationMarker() {
        const map = useMap();

        useEffect(() => {
            map.flyTo([lat, lng], 16);
            console.log(lat, lng);
        },[])

        return (
            <Marker 
                position={{ lat, lng }} 
                icon={getIcon(severity)} 
                draggable={true}
                eventHandlers={{
                    dragend: (e: any) => {
                        const marker = e.target;
                        const position = marker.getLatLng();
                        setLocation({ lat: position.lat, lng: position.lng });
                    }
                }}
            >

                <Popup>You are here</Popup>
            </Marker>
        )
    }
    return (
        <div className="w-full h-[400px] relative z-40">
            <MapContainer
                key={`${lat}-${lng}`}
                center={{ lat, lng}}
                gestureHandling={true}
                zoom={location && 13}
                style={{ height: "400px", width: "100%" }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationMarker />
            </MapContainer>
        </div>
    )
}