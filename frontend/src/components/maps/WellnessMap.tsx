"use client"
import { useEffect, useState } from "react"
import type { RegionalStats } from "@/types"

interface Props {
  regions: RegionalStats[]
}

export function WellnessMap({ regions }: Props) {
  const [MapComponents, setMapComponents] = useState<any>(null)

  // Dynamically import leaflet (SSR safe)
  useEffect(() => {
    Promise.all([
      import("react-leaflet"),
      import("leaflet"),
    ]).then(([rl, L]) => {
      // Fix default icon issue
      delete (L.default.Icon.Default.prototype as any)._getIconUrl
      L.default.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      })
      setMapComponents(rl)
    })
  }, [])

  if (!MapComponents) {
    return (
      <div className="w-full h-full min-h-[350px] flex items-center justify-center bg-gray-900 rounded-lg">
        <p className="text-gray-500 text-sm">Loading map...</p>
      </div>
    )
  }

  const { MapContainer, TileLayer, CircleMarker, Tooltip } = MapComponents

  function getColor(score: number) {
    if (score >= 70) return "#22c55e"
    if (score >= 55) return "#eab308"
    return "#ef4444"
  }

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      <MapContainer
        center={[9.145, 40.489]}
        zoom={5.5}
        style={{ height: "350px", width: "100%", borderRadius: "8px", background: "#111827" }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />
        {regions.map((r) => (
          <CircleMarker
            key={r.region}
            center={r.coordinates}
            radius={Math.max(8, Math.sqrt(r.total_patients / 1000))}
            fillColor={getColor(r.avg_wellness_score)}
            color={getColor(r.avg_wellness_score)}
            fillOpacity={0.6}
            weight={1}
          >
            <Tooltip>
              <div className="text-xs">
                <strong>{r.region}</strong><br />
                Wellness: {r.avg_wellness_score}%<br />
                Patients: {r.total_patients.toLocaleString()}<br />
                Alerts: {r.active_alerts}
              </div>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </>
  )
}
