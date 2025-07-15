"use client"

import Link from "next/link"
import Image from "next/image"
import { Mail, MapPin, Phone, Facebook, Twitter, Linkedin, Youtube, Globe, Github } from "lucide-react" // Added Globe and Github

export function Footer() {
  return (
    <footer className="bg-[#1A2B6B] text-white py-8">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center mb-8">
          <Image src="/tata-steel-logo.png" alt="Tata Steel Logo" width={100} height={100} className="mb-2" />
          <p className="text-lg font-semibold">TATA STEEL</p>
          <p className="text-sm text-gray-300">Learning & Development</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center justify-center md:justify-start">
                <MapPin className="mr-2 h-4 w-4" /> Kalinganagar, Jajpur, Odisha
              </li>
              <li className="flex items-center justify-center md:justify-start">
                <Phone className="mr-2 h-4 w-4" /> +91-6758-660000
              </li>
              <li className="flex items-center justify-center md:justify-start">
                <Mail className="mr-2 h-4 w-4" /> learning@tatasteel.com
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/training-modules" className="text-gray-300 hover:text-white">
                  Modules
                </Link>
              </li>
              <li>
                <Link href="/calendar" className="text-gray-300 hover:text-white">
                  Calendar
                </Link>
              </li>
              <li>
                <Link href="/courses" className="text-gray-300 hover:text-white">
                  Courses
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.tatasteel.com/"
                  className="text-gray-300 hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Original Website
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Social Media</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-center md:justify-start">
                <Facebook className="mr-2 h-4 w-4" />
                <Link
                  href="https://www.facebook.com/TataSteelLtd/"
                  className="text-gray-300 hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook
                </Link>
              </li>
              <li className="flex items-center justify-center md:justify-start">
                <Twitter className="mr-2 h-4 w-4" />
                <Link
                  href="https://x.com/tatasteelltd"
                  className="text-gray-300 hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Twitter
                </Link>
              </li>
              <li className="flex items-center justify-center md:justify-start">
                <Linkedin className="mr-2 h-4 w-4" />
                <Link
                  href="https://www.linkedin.com/company/tatasteelltd/"
                  className="text-gray-300 hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </Link>
              </li>
              <li className="flex items-center justify-center md:justify-start">
                <Youtube className="mr-2 h-4 w-4" />
                <Link
                  href="https://www.youtube.com/@TataSteelIndiaLtd"
                  className="text-gray-300 hover:text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  YouTube
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Creator</h3>
            <p className="text-sm text-gray-300 mb-4">Abhisek Panda</p>
            <div className="flex gap-4 justify-center md:justify-start">
              <Link
                href="https://abhisekpanda072.vercel.app/"
                className="text-gray-300 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Abhisek Panda's Personal Website"
              >
                <Globe className="h-6 w-6" />
              </Link>
              <Link
                href="https://github.com/abhisek2004"
                className="text-gray-300 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Abhisek Panda's GitHub"
              >
                <Github className="h-6 w-6" />
              </Link>
              <Link
                href="https://www.linkedin.com/in/abhisekpanda2004/"
                className="text-gray-300 hover:text-white"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Abhisek Panda's LinkedIn"
              >
                <Linkedin className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Tata Steel Learning & Development. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
