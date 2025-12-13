import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const cities = [
  { name: "Dhaka", lat: 23.8103, lng: 90.4125, description:'Main Branch' },
  { name: "Chittagong", lat: 22.3569, lng: 91.7832 },
];

export const CoverageMap = () => (
  <section className="py-10">
    <h2 className="text-3xl font-bold mb-6 text-center">Our Coverage Areas</h2>
    <MapContainer center={[23.8103, 90.4125]} zoom={6} className="h-96 w-full">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
      {cities.map(city => (
        <Marker key={city.name} position={[city.lat, city.lng]}>
          <Popup>{city.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  </section>
);
