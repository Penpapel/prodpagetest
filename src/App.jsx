import React from 'react'
import SpaceframingKitsPage from './components/SpaceframingKitsPage.jsx'
import SpaceframingTechnologySection from './components/SpaceframingTechnologySection.jsx'

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <SpaceframingKitsPage />
      <SpaceframingTechnologySection />
    </div>
  )
}
