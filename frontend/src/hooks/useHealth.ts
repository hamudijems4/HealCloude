import { useQuery, useMutation } from "@tanstack/react-query"
import api from "@/lib/api"
import type { RegionalStats, DiseaseAlert, NationalSummary, WellnessRiskOutput } from "@/types"

export const useMohSummary = () =>
  useQuery<NationalSummary>({
    queryKey: ["moh-summary"],
    queryFn: async () => (await api.get("/api/v1/moh/summary")).data,
    refetchInterval: 30_000,
  })

export const useRegionalStats = () =>
  useQuery<RegionalStats[]>({
    queryKey: ["regional-stats"],
    queryFn: async () => (await api.get("/api/v1/moh/regional-stats")).data,
    refetchInterval: 60_000,
  })

export const useDiseaseAlerts = () =>
  useQuery<DiseaseAlert[]>({
    queryKey: ["disease-alerts"],
    queryFn: async () => (await api.get("/api/v1/moh/disease-alerts")).data,
    refetchInterval: 30_000,
  })

export const useRiskScore = () =>
  useMutation<WellnessRiskOutput, Error, Record<string, unknown>>({
    mutationFn: async (payload) => (await api.post("/api/v1/wellness/risk-score", payload)).data,
  })
