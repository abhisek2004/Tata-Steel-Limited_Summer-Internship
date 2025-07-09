"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { User, LogOut } from "lucide-react"

export function Navigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session, status } = useSession()
  
  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/login')
  }

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
          {status === "authenticated" && (
            <>
              <Link
                href="/dashboard"
                className={cn(
                  "hover:text-gray-200",
                  pathname.startsWith("/dashboard") && "font-semibold border-b-2 border-white",
                )}
              >
                Dashboard
              </Link>
              <Link
                href="/completed-courses"
                className={cn(
                  "hover:text-gray-200",
                  pathname.startsWith("/completed-courses") && "font-semibold border-b-2 border-white",
                )}
              >
                Completed Courses
              </Link>
            </>
          )}
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
          {session?.user?.role === "admin" && (
            <Link
              href="/training-reports"
              className={cn(
                "hover:text-gray-200",
                pathname.startsWith("/training-reports") && "font-semibold border-b-2 border-white",
              )}
            >
              Training Reports
            </Link>
          )}
        </div>
        <div>
          {status === "authenticated" ? (
            <div className="flex items-center gap-4">
              <span className="text-sm">{session.user.name}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleLogout} 
                className="bg-white text-primary hover:bg-gray-100 flex items-center gap-1"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => router.push('/login')} 
              className="bg-white text-primary hover:bg-gray-100 flex items-center gap-1"
            >
              <User className="h-4 w-4" />
              Login
            </Button>
          )}
        </div>
      </div>
    </nav>
  )
}
