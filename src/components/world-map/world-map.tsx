import { memo } from "react"
import { CircleMarker, GeoJSON, MapContainer, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import "./WorldMap.css"
import worldCountriesData from "../../utils/countries.geo.json"

interface InterchangeEntry {
  intercambios: unknown[]
  nome: string
}

interface WorldMapProps {
  exchangeData: Record<string, InterchangeEntry>
  onMarkerClick: (data: InterchangeEntry) => void
}

const paisesCoordenadas: Record<string, [number, number]> = {
  US: [39.8283, -98.5795],
  CA: [56.1304, -106.3468],
  GB: [55.3781, -3.436],
  DE: [51.1657, 10.4515],
  FR: [46.6033, 1.8883],
  AU: [-25.2744, 133.7751],
  JP: [36.2048, 138.2529],
  KR: [35.9078, 127.7669],
  CN: [35.8617, 104.1954],
  NZ: [-40.9006, 174.886],
  IE: [53.4129, -8.2439],
  SE: [60.1282, 18.6435],
  NO: [60.472, 8.4689],
  CL: [-35.6751, -71.543],
  AR: [-34.6037, -58.3816],
  ES: [40.4637, -3.7492],
  IT: [41.8719, 12.5674],
  BR: [-14.235, -51.9253],
  MX: [23.6345, -102.5528],
  CH: [46.8182, 8.2275],
  NL: [52.1326, 5.2913],
  AT: [47.5162, 14.5501],
  BE: [50.8503, 4.3517],
  DK: [56.2639, 9.5018],
  FI: [61.9241, 25.7482],
  PT: [39.3999, -8.2245],
  TH: [15.87, 100.9925],
  MY: [4.2105, 101.9758],
  SG: [1.3521, 103.8198],
  TW: [23.6978, 120.9605],
  VN: [14.0583, 108.2772],
  ID: [-0.7893, 113.9213],
  PH: [12.8797, 121.774],
  TR: [38.9637, 35.2433],
  GR: [39.0742, 21.8243],
  EG: [26.8206, 30.8025],
  SA: [23.8859, 45.0792],
  AE: [23.4241, 53.8478],
  ZA: [-30.5595, 22.9375],
  CR: [9.7489, -83.7534],
  JO: [30.5852, 36.2384],
  BD: [23.685, 90.3563],
  NP: [28.3949, 84.124],
  PK: [30.3753, 69.3451],
  KG: [41.2044, 74.7661],
  UA: [48.3794, 31.1656],
  PL: [51.9194, 19.1451],
  CZ: [49.8175, 15.473],
  HU: [47.1625, 19.5033],
  RO: [45.9432, 24.9668],
  RS: [44.0165, 21.0059],
  ME: [42.7087, 19.3744],
  XK: [42.6026, 20.903],
  AL: [41.1533, 20.1683],
  HK: [22.3, 114.17],
}

const countryStyle = {
  fillColor: "#1e293b",
  fillOpacity: 0.8,
  color: "#475569",
  weight: 1,
}

const circleMarkerStyle = {
  color: "#facc15",
  fillColor: "#facc15",
  fillOpacity: 0.7,
  radius: 3,
}

const WorldMap = ({ exchangeData, onMarkerClick }: WorldMapProps) => {
  const markerPositions = Object.keys(exchangeData)
    .filter((code) => Object.hasOwn(paisesCoordenadas, code))
    .map((code) => ({
      code,
      position: paisesCoordenadas[code],
      data: exchangeData[code],
    }))

  return (
    <MapContainer
      boxZoom={false}
      center={[0, 0]}
      className="h-full w-full"
      doubleClickZoom={false}
      dragging={true}
      maxBounds={[
        [-75, -180],
        [85, 180],
      ]}
      maxBoundsViscosity={1.0}
      maxZoom={3}
      minZoom={2}
      scrollWheelZoom={true}
      style={{ minHeight: "100%", zIndex: 1, backgroundColor: "#020617" }}
      touchZoom={true}
      zoom={2}
      zoomControl={false}
    >
      <GeoJSON data={worldCountriesData.features} style={countryStyle} />
      {markerPositions.map(({ code, position, data }) => (
        <CircleMarker
          center={position}
          eventHandlers={{ click: () => onMarkerClick(data) }}
          key={code}
          pathOptions={circleMarkerStyle}
        >
          <Popup className="custom-popup">
            <div className="text-slate-900">
              <h4 className="font-bold">{data?.nome}</h4>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  )
}

export default memo(WorldMap)
