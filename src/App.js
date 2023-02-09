import logo from './logo.svg';
import './App.css';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';

function App() {
  return (
    <div className="App">
      <MapContainer center={[51.505, -0.09]} zoom={13}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

      </MapContainer>
    </div>
  );
}

export default App;
