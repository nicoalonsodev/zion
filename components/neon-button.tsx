"use client"

import type React from "react"

import Link from "next/link"
import { motion } from "framer-motion"

type NeonButtonProps = {
  href: string
  text: string
  icon?: React.ReactNode
}

export default function NeonButton({ href, text, icon }: NeonButtonProps) {
  return (
    <motion.div className="relative inline-block" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-[#ffcc44]/20 rounded-lg blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>

      <Link
        href={href}
        className="relative inline-flex items-center justify-center px-8 py-4 overflow-hidden rounded-lg bg-gradient-to-br from-[#ffcc44] to-[#fcd467] text-black font-bold text-lg md:text-xl transition-all duration-500 ease-out group"
      >
        {/* Inner glow and effects */}
        <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-10"></span>
        <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>

        {/* Button content */}
        <span className="relative flex items-center">
          {icon}
          {text}
        </span>

        {/* Shine effect */}
        <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
      </Link>
    </motion.div>
  )
}
