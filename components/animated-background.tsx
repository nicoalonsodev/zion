"use client"

import { useCallback, useEffect, useRef } from "react"
import { useTheme } from "next-themes"

type Particle = {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  color: string
  alpha: number
  growing: boolean
}

type AnimatedBackgroundProps = {
  mousePosition: { x: number; y: number }
}

export default function AnimatedBackground({ mousePosition }: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()

  const drawParticles = useCallback(
    (ctx: CanvasRenderingContext2D, particles: Particle[], mousePos: { x: number; y: number }) => {
      particles.forEach((particle) => {
        // Calculate distance from mouse
        const dx = mousePos.x - particle.x
        const dy = mousePos.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        // Adjust particle based on mouse proximity
        let particleAlpha = particle.alpha
        let particleSize = Math.max(0.1, particle.size) // Ensure size is always positive

        if (distance < 150) {
          particleAlpha = Math.min(1, particle.alpha + (150 - distance) / 500)
          particleSize = Math.max(0.1, particle.size * (1 + (150 - distance) / 300)) // Ensure size is always positive
        }

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particleSize, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 204, 68, ${particleAlpha})`
        ctx.fill()

        // Draw connections between nearby particles
        particles.forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 100) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(255, 204, 68, ${0.15 * (1 - dist / 100)})`
            ctx.lineWidth = 0.5
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.stroke()
          }
        })
      })
    },
    [],
  )

  const updateParticles = useCallback(
    (particles: Particle[], width: number, height: number, mousePos: { x: number; y: number }) => {
      return particles.map((particle) => {
        // Normal movement
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Slight attraction to mouse
        const dx = mousePos.x - particle.x
        const dy = mousePos.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 300 && distance > 0) {
          const forceDirectionX = dx / distance
          const forceDirectionY = dy / distance
          const force = (300 - distance) / 150000 // Reducido de 10000 a 50000
          particle.speedX += forceDirectionX * force
          particle.speedY += forceDirectionY * force
        }

        // Apply very minimal friction
        particle.speedX *= 0.9995 // Cambiado de 0.99 a 0.999
        particle.speedY *= 0.9995 // Cambiado de 0.99 a 0.999

        // Pulsate size very slowly
        if (particle.growing) {
          particle.size += 0.0005 // Reducido de 0.01 a 0.001
          if (particle.size > particle.size * 1.2) {
            particle.growing = false
          }
        } else {
          particle.size -= 0.0005 // Reducido de 0.01 a 0.001
          // Ensure size never goes below a minimum value
          if (particle.size < 0.5) {
            particle.size = 0.5
            particle.growing = true
          } else if (particle.size < particle.size * 0.8) {
            particle.growing = true
          }
        }

        // Bounce off edges
        if (particle.x > width) {
          particle.x = width
          particle.speedX = -particle.speedX
        } else if (particle.x < 0) {
          particle.x = 0
          particle.speedX = -particle.speedX
        }

        if (particle.y > height) {
          particle.y = height
          particle.speedY = -particle.speedY
        } else if (particle.y < 0) {
          particle.y = 0
          particle.speedY = -particle.speedY
        }

        return particle
      })
    },
    [],
  )

  const createParticles = useCallback((width: number, height: number, count: number): Particle[] => {
    return Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.02, // Reducido de 0.3 a 0.05
      speedY: (Math.random() - 0.5) * 0.02, // Reducido de 0.3 a 0.05
      color: "#ffcc44",
      alpha: Math.random() * 0.5 + 0.1,
      growing: Math.random() > 0.5,
    }))
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    let particles = createParticles(canvas.width, canvas.height, 150)
    let animationFrameId: number

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw particles
      drawParticles(ctx, particles, mousePosition)

      // Update particles
      particles = updateParticles(particles, canvas.width, canvas.height, mousePosition)

      animationFrameId = window.requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener("resize", handleResize)
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [createParticles, drawParticles, updateParticles, mousePosition])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ opacity: 0.8 }} />
}
