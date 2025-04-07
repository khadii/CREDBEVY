'use client'
import React from 'react'

export default function CustomizedButton({text,onClick}:{text:any,onClick?:any}) {
  return (
    <button
    type="submit"
    className="bg-[#156064] text-white w-[134px] h-[36px] rounded-[4px] text-center text-[12px] font-bold"
  >
    {text}
  </button>
  )
}
