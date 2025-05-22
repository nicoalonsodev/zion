"use client"

import type React from "react"
import styled, { keyframes } from "styled-components"

const neonGlow = keyframes`
  from {
    text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 15px #ffcc44, 0 0 20px #ffcc44, 0 0 25px #ffcc44, 0 0 30px #ffcc44, 0 0 35px #ffcc44;
  }
  to {
    text-shadow: 0 0 5px #fff, 0 0 10px rgba(255,204,68,0.8), 0 0 15px rgba(255,204,68,0.8), 0 0 20px rgba(255,204,68,0.8), 0 0 25px rgba(255,204,68,0.8), 0 0 30px rgba(255,204,68,0.8), 0 0 35px rgba(255,204,68,0.8);
  }
`

const NeonButtonStyled = styled.button`
  font-size: 20px;
  padding: 10px 20px;
  color: #fff;
  border: 2px solid #ffcc44;
  background-color: transparent;
  cursor: pointer;
  text-transform: uppercase;
  transition: all 0.3s ease-in-out;
  position: relative;
  overflow: hidden;
  border-radius: 5px;

  &:hover {
    color: #fff;
    background-color: #ffcc44;
    border-color: #ffcc44;
    box-shadow: 0 0 10px #ffcc44, 0 0 20px #ffcc44, 0 0 30px #ffcc44;
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, transparent, #ffcc44, transparent);
    z-index: -1;
    transform: translateX(-100%);
    transition: transform 0.5s ease-in-out;
  }

  &:hover:before {
    transform: translateX(0);
  }

  &.neon {
    animation: ${neonGlow} 1.5s ease-in-out infinite alternate;
  }
`

interface NeonButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

const NeonButton: React.FC<NeonButtonProps> = ({ children, onClick, className }) => {
  return (
    <NeonButtonStyled onClick={onClick} className={className}>
      {children}
    </NeonButtonStyled>
  )
}

export default NeonButton
