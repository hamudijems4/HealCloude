import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString("en-ET", {
    year: "numeric", month: "short", day: "numeric",
  })
}

export function getRiskBadgeClass(level: string): string {
  return {
    low:      "badge badge-success",
    medium:   "badge badge-warning",
    high:     "badge badge-danger",
    critical: "badge bg-red-100 text-red-700 border-red-200",
  }[level] ?? "badge badge-info"
}

export function getSeverityBadge(severity: string): string {
  return {
    watch:     "badge badge-info",
    warning:   "badge badge-warning",
    emergency: "badge badge-danger",
  }[severity] ?? "badge badge-info"
}

export function getRiskBarColor(level: string): string {
  return {
    low:      "bg-success",
    medium:   "bg-warning",
    high:     "bg-danger",
    critical: "bg-red-600",
  }[level] ?? "bg-gray-300"
}

export function getRiskColor(level: string): string {
  return {
    low:      "text-success",
    medium:   "text-warning",
    high:     "text-danger",
    critical: "text-red-700",
  }[level] ?? "text-info"
}

export function getRiskBg(level: string): string {
  return {
    low:      "bg-success-light",
    medium:   "bg-warning-light",
    high:     "bg-danger-light",
    critical: "bg-red-100",
  }[level] ?? "bg-info-light"
}

export function getScoreColor(score: number): string {
  if (score >= 70) return "text-success-dark"
  if (score >= 50) return "text-warning-dark"
  return "text-danger-dark"
}
