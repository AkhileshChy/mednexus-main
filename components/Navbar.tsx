"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { SignInButton, UserButton, useUser } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { MoonIcon, SunIcon, ChevronDownIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Stethoscope, Brain, FileText, Video } from "lucide-react"
import { FaLungs, FaEye, FaTooth } from "react-icons/fa"
import { GiMedicines, GiLiver } from "react-icons/gi"
import { RiMentalHealthLine } from "react-icons/ri"
import { motion } from "framer-motion"

const languages = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
]

const navItems = [
  // { name: 'Home', href: '/' },
  {
    name: "AI Diagnostics",
    items: [
      { name: "Brain Tumor Detection", icon: Brain, href: "/ai-diagnostics/brain-tumor" },
      { name: "Pneumonia Detection", icon: FaLungs, href: "/ai-diagnostics/pneumonia" },
      { name: "Bone Fracture", icon: GiLiver, href: "/ai-diagnostics/bone-fracture" },
      { name: "Skin Cancer", icon: RiMentalHealthLine, href: "/ai-diagnostics/skin-cancer" },
      { name: "Eye Conjunctiva Detector", icon: FaEye, href: "/ai-diagnostics/eye-conjunctiva" },
      { name: "Cavity Detection", icon: FaTooth, href: "/ai-diagnostics/cavity" },
      // { name: "Drugs Detection", icon: GiMedicines, href: "/ai-diagnostics/drugs" },
    ],
  },
  {
    name: "Health Analysis",
    icon: FileText,
    items: [
      { name: "EHR Analysis", icon: FileText, href: "/analysis/ehr-analysis" },
      { name: "Prescription", icon: Stethoscope, href: "/analysis/prescription" },
      { name: "Symptom Checker", icon: Stethoscope, href: "/analysis/symptom-checker" },
    ],
  },
  {
    name: "Virtual Health Assistant",
    icon: Video,
    href: "/telemedicine/virtual-assistant",
  },
  {
    name: "Mental Health Chatbot",
    icon: Brain,
    href: "/mental-health-chatbot",
  },
]

export default function Navbar() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const { isSignedIn } = useUser()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const changeLanguage = (lang: string) => {
    console.log(`Switching to language: ${lang}`)
  }

  return (
    <nav className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-0">
        <div className="flex h-20 items-center justify-first px-0  ">
          {/* Logo - Left */}
          <div className="flex-none px-0">
            <Link href="/" className="flex items-center">
              <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-3">
                <Brain className="h-8 w-8 text-purple-500" />
                <span
                  className="text-xl font-bold bg-gradient-to-r from-purple-600 to-purple-500 
                  text-transparent bg-clip-text"
                >
                  MEDNEXUS
                </span>
              </motion.div>
            </Link>
          </div>

          {/* Navigation - Center */}
          <div className="hidden sm:flex flex-1 items-center justify-center space-x-4">
            {navItems.map((item) =>
              item.items ? (
                <DropdownMenu key={item.name}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg rounded-md focus:outline-none focus:ring-2 ring-purple-500 focus:ring-offset-2 ring-offset-gray-800 transition-all duration-200 hover:shadow-md transition-shadow"
                    >
                      {item.name} <ChevronDownIcon className="ml-1 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="text-gray-900 dark:text-white hover:bg-purple-100 dark:bg-gray-700 shadow-lg'">
                    {item.items.map((subItem) => (
                      <DropdownMenuItem
                        key={subItem.name}
                        className="hover:bg-purple-50 dark:hover:bg-gray-700 rounded-md focus:bg-purple-100 dark:focus:bg-gray-600 focus:outline-none"
                      >
                        <Link
                          href={subItem.href}
                          className="w-full hover:bg-purple-50 dark:hover:bg-gray-700 rounded-md focus:bg-purple-100 dark:focus:bg-gray-600 shadow-lg"
                        >
                          {/* {subItem.icon} */}
                          {subItem.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${pathname === item.href
                      ? "bg-purple-100 text-purple-900 dark:bg-purple-900/30 dark:text-purple-300"
                      : "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg"
                    } focus:outline-none focus:ring-2 ring-purple-500 focus:ring-offset-2 ring-offset-gray-800`}
                >
                  {item.name}
                </Link>
              ),
            )}
          </div>

          {/* Utility Items - Right */}
          <div className="flex items-center space-x-4">
            {/* <DropdownMenu> */}
              {/* <DropdownMenuTrigger asChild> */}
                <Button
                  variant="ghost"
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg rounded-md focus:outline-none focus:ring-2 ring-purple-500 focus:ring-offset-2 ring-offset-gray-800 transition-all duration-200 hover:shadow-md transition-shadow"
                  onClick={() => window.location.href = "http://localhost:5173/"}
                >
                  MEDFUND
                </Button>

              {/* </DropdownMenuTrigger> */}
              {/* <DropdownMenuContent className="bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className="hover:bg-purple-50 dark:hover:bg-gray-700 rounded-md focus:bg-purple-100 dark:focus:bg-gray-600 focus:outline-none"
                  >
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu> */}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="text-gray-900 dark:text-white hover:bg-purple-100 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 ring-purple-500 focus:ring-offset-2 ring-offset-gray-800 transition-all duration-200 hover:shadow-md transition-shadow"
            >
              {theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            </Button>

            {!isSignedIn && (
              <SignInButton mode="modal">
                <Button
                  variant="ghost"
                  className="bg-purple-50 dark:bg-gray-800 text-gray-900 dark:text-white border-gray-200 dark:border-gray-700 hover:bg-purple-100 dark:bg-gray-700 rounded-md focus:outline-none focus:ring-2 ring-purple-500 focus:ring-offset-2 ring-offset-gray-800 transition-all duration-200 hover:shadow-md transition-shadow"
                >
                  Sign In
                </Button>
              </SignInButton>
            )}

            {isSignedIn && (
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox:
                      "w-10 h-10 rounded-full border-2 border-sapphire-300 dark:border-sapphire-600 hover:border-sapphire-500 dark:hover:border-sapphire-400 transition-all duration-200",
                  },
                }}
              />
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

