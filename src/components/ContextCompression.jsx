import { useState, useEffect } from 'react'
import { compressContext } from '../services/openai'

function ContextCompression({ contextRaw, onComplete }) {
  const [isCompressing, setIsCompressing] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [compressedData, setCompressedData] = useState(null)
  const [error, setError] = useState(null)

  const compressionSteps = [
    "Scanning for pain points...",
    "Identifying tensions & conflicts...",
    "Mapping inefficiencies...",
    "Analyzing constraints...",
    "Finding underutilized assets...",
    "Extracting startup intelligence..."
  ]

  useEffect(() => {
    compressContextData()
  }, [contextRaw])

  const compressContextData = async () => {
    try {
      // Simulate compression steps
      for (let i = 0; i < compressionSteps.length - 1; i++) {
        setCurrentStep(i)
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      setCurrentStep(compressionSteps.length - 1)
      
      // Real AI compression
      const compressed = await compressContext(contextRaw)
      
      setCompressedData(compressed)
      setIsCompressing(false)
    } catch (err) {
      setError(err.message)
      setIsCompressing(false)
    }
  }

  const handleContinue = () => {
    onComplete(compressedData)
  }

  const handleRetry = () => {
    setError(null)
    setIsCompressing(true)
    setCurrentStep(0)
    compressContextData()
  }

  if (error) {
    return (
      <div className="void-panel neural-glow">
        <h2 className="text-xl sm:text-2xl font-bold text-plasma mb-6">
          ⚠️ Compression Error
        </h2>
        
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
          <p className="text-red-400 mb-4">{error}</p>
          <p className="text-gray-400 text-sm">
            Failed to extract startup intelligence from context.
          </p>
        </div>

        <button
          onClick={handleRetry}
          className="w-full py-3 px-6 bg-plasma hover:bg-plasma/80 rounded-lg font-semibold transition-colors min-h-[48px]"
        >
          🔄 Retry Compression
        </button>
      </div>
    )
  }

  if (isCompressing) {
    return (
      <div className="void-panel neural-glow text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-synapse mb-6 sm:mb-8">
          2️⃣ Context Compression Engine
        </h2>
        
        <div className="mb-6 sm:mb-8">
          <div className="inline-block animate-spin rounded-full h-12 sm:h-16 w-12 sm:w-16 border-b-4 border-plasma"></div>
        </div>

        <div className="text-base sm:text-lg text-white mb-4">
          {compressionSteps[currentStep]}
        </div>

        <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
          <div 
            className="bg-gradient-to-r from-synapse to-plasma h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep + 1) / compressionSteps.length) * 100}%` }}
          ></div>
        </div>

        <p className="text-gray-400 px-4">
          Extracting startup-relevant intelligence only...
        </p>
      </div>
    )
  }

  return (
    <div className="void-panel neural-glow">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-synapse mb-2">
          ⚡ Context Intelligence Extracted
        </h2>
        <p className="text-gray-400">
          Domain compressed into startup opportunities
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        
        {/* Pain Points */}
        <div className="bg-neural/50 p-4 rounded-lg">
          <h3 className="text-base sm:text-lg font-semibold text-red-400 mb-3">🔥 Pain Points</h3>
          <ul className="space-y-2">
            {compressedData.painPoints.map((pain, index) => (
              <li key={index} className="text-sm text-gray-300 flex items-start">
                <span className="text-red-400 mr-2 flex-shrink-0">•</span>
                <span>{pain}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tensions */}
        <div className="bg-neural/50 p-4 rounded-lg">
          <h3 className="text-base sm:text-lg font-semibold text-orange-400 mb-3">⚡ Tensions</h3>
          <ul className="space-y-2">
            {compressedData.tensions.map((tension, index) => (
              <li key={index} className="text-sm text-gray-300 flex items-start">
                <span className="text-orange-400 mr-2 flex-shrink-0">•</span>
                <span>{tension}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Inefficiencies */}
        <div className="bg-neural/50 p-4 rounded-lg">
          <h3 className="text-base sm:text-lg font-semibold text-yellow-400 mb-3">🐌 Inefficiencies</h3>
          <ul className="space-y-2">
            {compressedData.inefficiencies.map((inefficiency, index) => (
              <li key={index} className="text-sm text-gray-300 flex items-start">
                <span className="text-yellow-400 mr-2 flex-shrink-0">•</span>
                <span>{inefficiency}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Constraints */}
        <div className="bg-neural/50 p-4 rounded-lg">
          <h3 className="text-base sm:text-lg font-semibold text-blue-400 mb-3">🔒 Constraints</h3>
          <ul className="space-y-2">
            {compressedData.constraints.map((constraint, index) => (
              <li key={index} className="text-sm text-gray-300 flex items-start">
                <span className="text-blue-400 mr-2 flex-shrink-0">•</span>
                <span>{constraint}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Underutilized Assets */}
        <div className="bg-neural/50 p-4 rounded-lg">
          <h3 className="text-base sm:text-lg font-semibold text-green-400 mb-3">💎 Underutilized Assets</h3>
          <ul className="space-y-2">
            {compressedData.underutilizedAssets.map((asset, index) => (
              <li key={index} className="text-sm text-gray-300 flex items-start">
                <span className="text-green-400 mr-2 flex-shrink-0">•</span>
                <span>{asset}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Unmet Needs */}
        <div className="bg-neural/50 p-4 rounded-lg">
          <h3 className="text-base sm:text-lg font-semibold text-purple-400 mb-3">🎯 Unmet Needs</h3>
          <ul className="space-y-2">
            {compressedData.unmetNeeds.map((need, index) => (
              <li key={index} className="text-sm text-gray-300 flex items-start">
                <span className="text-purple-400 mr-2 flex-shrink-0">•</span>
                <span>{need}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Market Intelligence */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 p-4 bg-void/50 rounded-lg gap-4">
        <div className="text-center">
          <div className="text-lg sm:text-2xl font-bold text-synapse break-words">{compressedData.domain}</div>
          <div className="text-xs text-gray-400">Domain Focus</div>
        </div>
        <div className="text-center">
          <div className="text-lg sm:text-2xl font-bold text-plasma">{compressedData.marketSize}</div>
          <div className="text-xs text-gray-400">Market Size</div>
        </div>
        <div className="text-center">
          <div className={`text-lg sm:text-2xl font-bold ${
            compressedData.urgency === 'high' ? 'text-red-400' :
            compressedData.urgency === 'medium' ? 'text-yellow-400' : 'text-green-400'
          }`}>
            {compressedData.urgency.toUpperCase()}
          </div>
          <div className="text-xs text-gray-400">Urgency</div>
        </div>
      </div>

      <button
        onClick={handleContinue}
        className="w-full py-3 px-6 bg-gradient-to-r from-synapse to-plasma hover:from-synapse/80 hover:to-plasma/80 rounded-lg font-semibold transition-all transform hover:scale-105 min-h-[48px]"
      >
        🧬 Generate Agent Candidates →
      </button> 
    </div>
  )
}

export default ContextCompression