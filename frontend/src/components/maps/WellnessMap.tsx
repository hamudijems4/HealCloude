"use client"
import { useEffect, useState } from "react"
import type { RegionalStats } from "@/types"

interface Props { regions: RegionalStats[] }

export function WellnessMap({ regions }: Props) {
  const [Map, setMap] = useState<any>(null)

  useEffect(() => {
    Promise.all([import("react-leaflet"), import("leaflet")]).then(([rl, L]) => {
      delete (L.default.Icon.Default.prototype as any)._getIconUrl
      L.default.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      })
      setMap(rl)
    })
  }, [])

  if (!Map) {
    return (
      <div className="w-full min-h-[350px] flex items-center justify-center bg-gray-50 rounded-xl border border-gray-100">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary-300 border-t-primary-500 rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-ink-muted font-medium">Loading map...</p>
        </div>
      </div>
    )
  }

  const { MapContainer, TileLayer, CircleMarker, Tooltip } = Map

  function getColor(score: number) {
    if (score >= 70) return "#22c55e"
    if (score >= 55) return "#f59e0b"
    return "#ef4444"
  }

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <MapContainer
        center={[9.145, 40.489]}
        zoom={5.5}
        style={{ height: "350px", width: "100%", borderRadius: "10px" }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />
        {regions.map((r) => (
          <CircleMarker
            key={r.region}
            center={r.coordinates}
            radius={Math.max(10, Math.sqrt(r.total_patients / 800))}
            fillColor={getColor(r.avg_wellness_score)}
            color={getColor(r.avg_wellness_score)}
            fillOpacity={0.5}
            weight={2}
          >
            <Tooltip>
              <div style={{ fontSize: 12, lineHeight: 1.6 }}>
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
