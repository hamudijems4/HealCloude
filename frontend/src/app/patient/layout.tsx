import { Sidebar } from "@/components/shared/Sidebar"
import { Header } from "@/components/shared/Header"

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="TenaLink" subtitle="Patient Health Portal" />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
