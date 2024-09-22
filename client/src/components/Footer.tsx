// import React from 'react'
import modelLogo from '../assets/modelLogo1.png'

export default function Footer() {
  return (
    <div>
      <footer className='h-[6rem] w-full flex justify-evenly items-center border-t-gray-200 border-t-2'>
        <img src={modelLogo} alt="EazyAPI" className='h-[60px] w-auto cursor-pointer' title='Smart API generation for modern day Programmers'/>
        <p className='text-gray-500 text-lg font-mono'>&copy; 2024 EazyAPI</p>
        <span className='text-md font-sans'>Open Source <a href="https://github.com/Vedant794/RESTGenius" className='text-blue-400'>CLI</a></span>
      </footer>
    </div>
  )
}
