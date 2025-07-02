"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-primary text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/tata-steel-logo.png" alt="Tata Steel Logo" width={80} height={32} className="object-contain" />
          <span className="text-xl font-bold">Tata Steel L&D</span>
        </Link>
        <div className="space-x-6">
          <Link
            href="/"
            className={cn("hover:text-gray-200", pathname === "/" && "font-semibold border-b-2 border-white")}
          >
            Home
          </Link>
          <Link
            href="/courses"
            className={cn(
              "hover:text-gray-200",
              pathname.startsWith("/courses") && "font-semibold border-b-2 border-white",
            )}
          >
            Courses
          </Link>
          <Link
            href="/training-modules"
            className={cn(
              "hover:text-gray-200",
              pathname.startsWith("/training-modules") && "font-semibold border-b-2 border-white",
            )}
          >
            Training Modules
          </Link>
          <Link
            href="/calendar"
            className={cn(
              "hover:text-gray-200",
              pathname.startsWith("/calendar") && "font-semibold border-b-2 border-white",
            )}
          >
            Calendar
          </Link>
          <Link
            href="/training-reports"
            className={cn(
              "hover:text-gray-200",
              pathname.startsWith("/training-reports") && "font-semibold border-b-2 border-white",
            )}
          >
            Training Reports
          </Link>
        </div>
      </div>
    </nav>
  )
}
