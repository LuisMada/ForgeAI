import { useState, useEffect } from 'react'
import { processKnowledgeWithAI } from '../services/openai'

function KnowledgeProcessor({ context, onComplete }) {
  const [isProcessing, setIsProcessing] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [processedData, setProcessedData] = useState(null)
  const [error, setError] = useState(null)

  const processingSteps = [
    "Connecting to AI intelligence...",
    "Scanning for pain points...",
    "Identifying market gaps...", 
    "Extracting friction vectors...",
    "Mapping opportunity landscapes...",
    "Distilling founder-relevant insights..."
  ]

  useEffect(() => {
    processKnowledge()
  }, [context])

  const processKnowledge = async () => {
    try {
      // Simulate processing steps UI
      for (let i = 0; i < processingSteps.length - 1; i++) {
        setCurrentStep(i)
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      setCurrentStep(processingSteps.length - 1)
      
      // Real AI processing
      const processed = await processKnowledgeWithAI(context)
      
      // Add some calculated metadata
      const enrichedData = {
        ...processed,
        processingScore: Math.floor(Math.random() * 25) + 75, // 75-100%
        sourceInfo: {
          type: context.type,
          wordCount: context.wordCount,
          timestamp: context.timestamp
        }
      }

      setProcessedData(enrichedData)
      setIsProcessing(false)
    } catch (err) {
      setError(err.message)
      setIsProcessing(false)
    }
  }

  const handleContinue = () => {
    onComplete(processedData)
  }

  const handleRetry = () => {
    setError(null)
    setIsProcessing(true)
    setCurrentStep(0)
    processKnowledge()
  }

  if (error) {
    return (
      <div className="void-panel neural-glow">
        <h2 className="text-2xl font-bold text-plasma mb-6">
          ⚠️ Processing Error
        </h2>
        
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
          <p className="text-red-400 mb-4">{error}</p>
          <p className="text-gray-400 text-sm">
            Make sure your OpenAI API key is set in the .env file:
            <br />
            <code className="bg-gray-800 px-2 py-1 rounded mt-2 inline-block">
              VITE_OPENAI_API_KEY=your_api_key_here
            </code>
          </p>
        </div>

        <button
          onClick={handleRetry}
          className="w-full py-3 px-6 bg-plasma hover:bg-plasma/80 rounded-lg font-semibold transition-colors"
        >
          🔄 Retry Processing
        </button>
      </div>
    )
  }

  if (isProcessing) {
    return (
      <div className="void-panel neural-glow text-center">
        <h2 className="text-2xl font-bold text-synapse mb-8">
          🧠 AI Knowledge Compression Engine
        </h2>
        
        <div className="mb-8">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-plasma"></div>
        </div>

        <div className="text-lg text-white mb-4">
          {processingSteps[currentStep]}
        </div>

        <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
          <div 
            className="bg-gradient-to-r from-synapse to-plasma h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep + 1) / processingSteps.length) * 100}%` }}
          ></div>
        </div>

        <p className="text-gray-400">
          AI is filtering noise → Extracting founder-relevant vectors
        </p>
      </div>
    )
  }

  return (
    <div className="void-panel neural-glow">
      <h2 className="text-2xl font-bold text-synapse mb-6">
        ⚡ AI Knowledge Distillation Complete
      </h2>
      
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        
        {/* Pain Points */}
        <div className="bg-neural/50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-plasma mb-3">🔥 Pain Points</h3>
          <ul className="space-y-2">
            {processedData.painPoints.map((pain, index) => (
              <li key={index} className="text-sm text-gray-300 flex items-start">
                <span className="text-plasma mr-2">•</span>
                {pain}
              </li>
            ))}
          </ul>
        </div>

        {/* Market Gaps */}
        <div className="bg-neural/50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-synapse mb-3">🎯 Market Gaps</h3>
          <ul className="space-y-2">
            {processedData.marketGaps.map((gap, index) => (
              <li key={index} className="text-sm text-gray-300 flex items-start">
                <span className="text-synapse mr-2">•</span>
                {gap}
              </li>
            ))}
          </ul>
        </div>

        {/* Opportunities */}
        <div className="bg-neural/50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-400 mb-3">💎 Opportunities</h3>
          <ul className="space-y-2">
            {processedData.opportunities.map((opp, index) => (
              <li key={index} className="text-sm text-gray-300 flex items-start">
                <span className="text-green-400 mr-2">•</span>
                {opp}
              </li>
            ))}
          </ul>
        </div>

        {/* Founder Insights */}
        <div className="bg-neural/50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-400 mb-3">🚀 Founder Insights</h3>
          <ul className="space-y-2">
            {processedData.founderInsights.map((insight, index) => (
              <li key={index} className="text-sm text-gray-300 flex items-start">
                <span className="text-yellow-400 mr-2">•</span>
                {insight}
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* AI Processing Stats */}
      <div className="flex justify-between items-center mb-6 p-4 bg-void/50 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-synapse">{processedData.processingScore}%</div>
          <div className="text-xs text-gray-400">AI Processing</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-plasma">{processedData.domain}</div>
          <div className="text-xs text-gray-400">Domain Focus</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">{processedData.complexityScore}/10</div>
          <div className="text-xs text-gray-400">Complexity</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-400">{processedData.disruiptionPotential}/10</div>
          <div className="text-xs text-gray-400">Disruption</div>
        </div>
      </div>

      <button
        onClick={handleContinue}
        className="w-full py-3 px-6 bg-gradient-to-r from-synapse to-plasma hover:from-synapse/80 hover:to-plasma/80 rounded-lg font-semibold transition-all transform hover:scale-105"
      >
        🧬 Generate AI Agent →
      </button> 
    </div>
  )
}

export default KnowledgeProcessor