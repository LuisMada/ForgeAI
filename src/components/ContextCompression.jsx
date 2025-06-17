import { useState, useEffect } from 'react'
import { compressContext } from '../services/openai'

function ContextCompression({ contextRaw, onComplete }) {
  const [isCompressing, setIsCompressing] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [compressedData, setCompressedData] = useState(null)
  const [error, setError] = useState(null)

  const compressionSteps = [
    "Analyzing content domain...",
    "Identifying conversation opportunities...",
    "Mapping user question patterns...",
    "Setting content boundaries...",
    "Calculating agent viability..."
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
          ⚠️ Content Analysis Error
        </h2>
        
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
          <p className="text-red-400 mb-4">{error}</p>
          <p className="text-gray-400 text-sm">
            Failed to analyze content for agent opportunities.
          </p>
        </div>

        <button
          onClick={handleRetry}
          className="w-full py-3 px-6 bg-plasma hover:bg-plasma/80 rounded-lg font-semibold transition-colors min-h-[48px]"
        >
          🔄 Retry Analysis
        </button>
      </div>
    )
  }

  if (isCompressing) {
    return (
      <div className="void-panel neural-glow text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-synapse mb-6 sm:mb-8">
          2️⃣ Content Intelligence Analysis
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
          Extracting agent opportunities from your content...
        </p>
      </div>
    )
  }

  const getViabilityColor = (score) => {
    if (score >= 8) return 'text-green-400'
    if (score >= 6) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getDepthColor = (depth) => {
    switch(depth) {
      case 'deep': return 'text-purple-400'
      case 'moderate': return 'text-blue-400'
      case 'surface': return 'text-green-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="void-panel neural-glow">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-synapse mb-2">
          ⚡ Content Analysis Complete
        </h2>
        <p className="text-gray-400">
          Your content has been analyzed for conversational agent opportunities
        </p>
      </div>
      
      {/* Domain Overview */}
      <div className="bg-gradient-to-r from-synapse/10 to-plasma/10 border border-synapse/30 rounded-lg p-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-synapse break-words">{compressedData.domain}</div>
            <div className="text-xs text-gray-400">Content Domain</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getViabilityColor(compressedData.viability_score)}`}>
              {compressedData.viability_score}/10
            </div>
            <div className="text-xs text-gray-400">Agent Viability</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${getDepthColor(compressedData.conversation_depth)}`}>
              {compressedData.conversation_depth.toUpperCase()}
            </div>
            <div className="text-xs text-gray-400">Conversation Depth</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        
        {/* Content Type & Agent Opportunity */}
        <div className="bg-neural/50 p-4 rounded-lg">
          <h3 className="text-base sm:text-lg font-semibold text-blue-400 mb-3">🎯 Agent Opportunity</h3>
          <div className="space-y-2">
            <div>
              <span className="text-blue-400 text-sm">Content Type:</span>
              <p className="text-gray-300 text-sm">{compressedData.content_type}</p>
            </div>
            <div>
              <span className="text-blue-400 text-sm">Agent Role:</span>
              <p className="text-gray-300 text-sm">{compressedData.agent_opportunity}</p>
            </div>
          </div>
        </div>

        {/* Interaction Style */}
        <div className="bg-neural/50 p-4 rounded-lg">
          <h3 className="text-base sm:text-lg font-semibold text-green-400 mb-3">💬 Interaction Style</h3>
          <p className="text-gray-300 text-sm">{compressedData.interaction_style}</p>
        </div>

        {/* User Questions */}
        <div className="bg-neural/50 p-4 rounded-lg">
          <h3 className="text-base sm:text-lg font-semibold text-purple-400 mb-3">❓ Common User Questions</h3>
          <ul className="space-y-2">
            {compressedData.user_questions.map((question, index) => (
              <li key={index} className="text-sm text-gray-300 flex items-start">
                <span className="text-purple-400 mr-2 flex-shrink-0">•</span>
                <span>"{question}"</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Content Boundaries */}
        <div className="bg-neural/50 p-4 rounded-lg">
          <h3 className="text-base sm:text-lg font-semibold text-yellow-400 mb-3">🔒 Content Boundaries</h3>
          <p className="text-gray-300 text-sm mb-2">{compressedData.conversation_scope}</p>
          <div className="space-y-1">
            {compressedData.guardrails.map((guardrail, index) => (
              <div key={index} className="text-xs text-gray-400 flex items-start">
                <span className="text-yellow-400 mr-2 flex-shrink-0">•</span>
                <span>{guardrail}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Value Proposition */}
      <div className="bg-void/50 border border-synapse/30 rounded-lg p-4 mb-6">
        <h4 className="text-synapse font-semibold mb-3">💎 Agent Value Proposition</h4>
        <p className="text-gray-300 text-sm">{compressedData.potential_value}</p>
      </div>

      {/* Viability Assessment */}
      <div className="bg-neural/30 rounded-lg border border-gray-700 p-4 mb-6">
        <h4 className="text-plasma font-semibold mb-2 text-sm">📊 Content Assessment</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-gray-400">
          <div>
            <span className="text-green-400">Viability:</span> {compressedData.viability_score}/10
          </div>
          <div>
            <span className="text-blue-400">Depth:</span> {compressedData.conversation_depth}
          </div>
          <div>
            <span className="text-purple-400">Domain:</span> {compressedData.domain}
          </div>
        </div>
      </div>

      <button
        onClick={handleContinue}
        disabled={compressedData.viability_score < 4}
        className="w-full py-3 px-6 bg-gradient-to-r from-synapse to-plasma hover:from-synapse/80 hover:to-plasma/80 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-all transform hover:scale-105 disabled:hover:scale-100 min-h-[48px]"
      >
        {compressedData.viability_score < 4 
          ? '⚠️ Low Viability - Cannot Generate Agents' 
          : '👻 Generate Agent Souls →'
        }
      </button>

      {compressedData.viability_score < 4 && (
        <p className="text-red-400 text-xs text-center mt-2">
          This content has insufficient depth for conversational agent generation.
        </p>
      )}
    </div>
  )
}

export default ContextCompression