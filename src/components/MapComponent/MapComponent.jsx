import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const MapComponent = ({ address, companyName }) => {
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
  const mapRef = useRef(null);

  useEffect(() => {
    const fetchCoordinates = async () => {
      const cachedData = localStorage.getItem(address);

      if (cachedData) {
        setCoordinates(JSON.parse(cachedData));
        return;
      }

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
        );
        const data = await response.json();

        if (data.length > 0) {
          const coords = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
          setCoordinates(coords);
          localStorage.setItem(address, JSON.stringify(coords));
        }
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      }
    };

    fetchCoordinates();
  }, [address]);

  useEffect(() => {
    if (coordinates.lat !== 0 && coordinates.lng !== 0) {
      if (!mapRef.current) {
        mapRef.current = L.map("map").setView([coordinates.lat, coordinates.lng], 16);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(mapRef.current);

        L.marker([coordinates.lat, coordinates.lng])
          .addTo(mapRef.current)
          .bindPopup(`<b>${companyName}</b><br>${address}`)
          .openPopup();
      }
    }
  }, [coordinates, companyName, address]);

  return <div id="map" style={{ height: "400px", width: "100%" }}></div>;
};

export default MapComponent;
