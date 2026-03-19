import type { Feature, GeoJsonProperties, Geometry } from "geojson"
import type { Layer, PathOptions } from "leaflet"
import { memo, useState } from "react"
import { GeoJSON, MapContainer } from "react-leaflet"
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
  selectedCountryCode?: string | null
}

type WorldCountryFeature = Feature<Geometry, GeoJsonProperties> & {
  id?: string | number
}

const countryNamesPtBr: Record<string, string> = {
  Afghanistan: "Afeganistao",
  Albania: "Albania",
  Algeria: "Argelia",
  Angola: "Angola",
  Argentina: "Argentina",
  Armenia: "Armenia",
  Australia: "Australia",
  Austria: "Austria",
  Azerbaijan: "Azerbaijao",
  Bangladesh: "Bangladesh",
  Belgium: "Belgica",
  Bolivia: "Bolivia",
  Brazil: "Brasil",
  Bulgaria: "Bulgaria",
  Cambodia: "Camboja",
  Cameroon: "Camaroes",
  Canada: "Canada",
  Chile: "Chile",
  China: "China",
  Colombia: "Colombia",
  "Costa Rica": "Costa Rica",
  Croatia: "Croacia",
  Cuba: "Cuba",
  Cyprus: "Chipre",
  "Czech Republic": "Republica Tcheca",
  Denmark: "Dinamarca",
  Dominican: "Republica Dominicana",
  Ecuador: "Equador",
  Egypt: "Egito",
  England: "Inglaterra",
  Estonia: "Estonia",
  Ethiopia: "Etiopia",
  Finland: "Finlandia",
  France: "Franca",
  Georgia: "Georgia",
  Germany: "Alemanha",
  Greece: "Grecia",
  Greenland: "Groenlandia",
  Guatemala: "Guatemala",
  Haiti: "Haiti",
  Honduras: "Honduras",
  Hungary: "Hungria",
  Iceland: "Islandia",
  India: "India",
  Indonesia: "Indonesia",
  Iran: "Ira",
  Iraq: "Iraque",
  Ireland: "Irlanda",
  Israel: "Israel",
  Italy: "Italia",
  Jamaica: "Jamaica",
  Japan: "Japao",
  Jordan: "Jordania",
  Kazakhstan: "Cazaquistao",
  Kenya: "Quenia",
  Kuwait: "Kuwait",
  Lebanon: "Libano",
  Libya: "Libia",
  Madagascar: "Madagascar",
  Malaysia: "Malasia",
  Mali: "Mali",
  Mexico: "Mexico",
  Mongolia: "Mongolia",
  Morocco: "Marrocos",
  Mozambique: "Mocambique",
  Myanmar: "Mianmar",
  Namibia: "Namibia",
  Nepal: "Nepal",
  Netherlands: "Paises Baixos",
  "New Zealand": "Nova Zelandia",
  Nicaragua: "Nicaragua",
  Nigeria: "Nigeria",
  Norway: "Noruega",
  Oman: "Oma",
  Pakistan: "Paquistao",
  Panama: "Panama",
  Paraguay: "Paraguai",
  Peru: "Peru",
  Philippines: "Filipinas",
  Poland: "Polonia",
  Portugal: "Portugal",
  Qatar: "Catar",
  Romania: "Romenia",
  Russia: "Russia",
  "Saudi Arabia": "Arabia Saudita",
  Senegal: "Senegal",
  Serbia: "Servia",
  Singapore: "Singapura",
  Slovakia: "Eslovaquia",
  Slovenia: "Eslovenia",
  Somalia: "Somalia",
  "South Africa": "Africa do Sul",
  "South Korea": "Coreia do Sul",
  Spain: "Espanha",
  Sweden: "Suecia",
  Switzerland: "Suica",
  Syria: "Siria",
  Taiwan: "Taiwan",
  Thailand: "Tailandia",
  Tunisia: "Tunisia",
  Turkey: "Turquia",
  Ukraine: "Ucrania",
  "United Arab Emirates": "Emirados Arabes Unidos",
  "United Kingdom": "Reino Unido",
  "United States of America": "Estados Unidos",
  Uruguay: "Uruguai",
  Venezuela: "Venezuela",
  Vietnam: "Vietna",
}

const WorldMap = ({
  exchangeData,
  onMarkerClick,
  selectedCountryCode = null,
}: WorldMapProps) => {
  const geoJsonLayerKey = Object.keys(exchangeData)
    .sort()
    .join("|")

  const [hoveredCountryCode, setHoveredCountryCode] = useState<string | null>(
    null
  )

  const getCountryCode = (feature?: WorldCountryFeature): string => {
    if (!feature?.id) {
      return ""
    }

    return String(feature.id)
  }

  const getCountryName = (feature?: WorldCountryFeature): string => {
    const countryCode = getCountryCode(feature)
    const countryFromData = exchangeData[countryCode]?.nome
    if (countryFromData) {
      return countryFromData
    }

    const rawName = feature?.properties?.name
    if (typeof rawName !== "string") {
      return "Pais"
    }

    return countryNamesPtBr[rawName] ?? rawName
  }

  const getCountryStyle = (feature?: WorldCountryFeature): PathOptions => {
    const countryCode = getCountryCode(feature)
    const hasOpportunity = Boolean(exchangeData[countryCode])
    const isHovered = countryCode !== "" && hoveredCountryCode === countryCode
    const isSelected =
      countryCode !== "" && selectedCountryCode !== null && selectedCountryCode === countryCode

    if (isSelected) {
      return {
        fillColor: "#f59e0b",
        fillOpacity: 0.78,
        color: "#fef3c7",
        weight: 2.2,
      }
    }

    if (hasOpportunity) {
      return {
        fillColor: isHovered ? "#f59e0b" : "#facc15",
        fillOpacity: isHovered ? 0.65 : 0.45,
        color: isHovered ? "#fde68a" : "#f59e0b",
        weight: isHovered ? 1.6 : 1.1,
      }
    }

    return {
      fillColor: isHovered ? "#334155" : "#1e293b",
      fillOpacity: isHovered ? 0.9 : 0.8,
      color: isHovered ? "#94a3b8" : "#475569",
      weight: isHovered ? 1.25 : 1,
    }
  }

  const onEachCountry = (feature: WorldCountryFeature, layer: Layer) => {
    const countryCode = getCountryCode(feature)
    const countryName = getCountryName(feature)
    const hasOpportunity = Boolean(exchangeData[countryCode])

    layer.bindTooltip(countryName, {
      className: "country-tooltip",
      direction: "top",
      opacity: 0.95,
      sticky: true,
    })

    layer.on({
      mouseout: () => {
        setHoveredCountryCode((current) =>
          current === countryCode ? null : current
        )
        const path = layer as Layer & { _path?: SVGPathElement }
        if (path._path) {
          path._path.style.cursor = ""
        }
      },
      mouseover: () => {
        setHoveredCountryCode(countryCode)
        const path = layer as Layer & { _path?: SVGPathElement }
        if (path._path) {
          path._path.style.cursor = hasOpportunity ? "pointer" : "default"
        }
      },
    })

    if (hasOpportunity) {
      layer.on({
        click: () => {
          const countryData = exchangeData[countryCode]
          if (countryData) {
            onMarkerClick(countryData)
          }
        },
      })
    }
  }

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
      <GeoJSON
        data={worldCountriesData.features}
        key={geoJsonLayerKey}
        onEachFeature={onEachCountry}
        style={getCountryStyle}
      />
    </MapContainer>
  )
}

export default memo(WorldMap)
