import React from 'react'
import Navbar from '../components/Navbar.jsx'
import { heroStyles } from '../assets/dummyStyles.js'

const Hero = () => {
  return (
    <div className= {heroStyles.container}>
      <Navbar /> 
    </div>
  )
}

export default Hero
