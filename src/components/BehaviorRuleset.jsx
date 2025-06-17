import { useState, useEffect } from 'react'
import { generateBehaviorRuleset } from '../services/openai'

function BehaviorRuleset({ compressedContext, chosenSoul, onComplete }) {
  const [isGenerating, setIsGenerating] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [behaviorConfig, setBehaviorConfig] = useState(null)
  const [error, setError] = useState(null)

  const generationSteps = [
    "Analyzing soul constraints...",
    "Defining content boundaries...",
    "Calibrating response patterns...",
    "Setting conversation scope...",
    "Finalizing deployment configuration..."
  ]

  useEffect(() => {
    generateBehaviorConfiguration()
  }, [chosenSoul])

  const generateBehaviorConfiguration = async () => {
    try {
      // Simulate generation steps
      for (let i = 0; i < generationSteps.length - 1; i++) {
        setCurrentStep(i)
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      setCurrentStep(generationSteps.length - 1)
      
      // Real AI behavior configuration
      const config = await generateBehaviorRuleset(compressedContext, chosenSoul)
      
      setBehaviorConfig(config)
      setIsGenerating(false)
    } catch (err) {
      setError(err.message)
      setIsGenerating(false)
    }
  }

  const handleDeploy = () => {
    onComplete(behaviorConfig)
  }

  const handleRetry = () => {
    setError(null)
    setIsGenerating(true)
    setCurrentStep(0)
    generateBehaviorConfiguration()
  }

  // Helper function to safely render any value
  const renderValue = (value) => {
    if (value === null || value === undefined) {
      return 'Not specified'
    }
    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        return value.join(', ')
      }
      return JSON.stringify(value, null, 2)
    }
    return String(value)
  }

  // Helper function to render arrays properly
  const renderArray = (arr) => {
    if (!Array.isArray(arr)) {
      return [renderValue(arr)]
    }
    return arr.map((item, index) => renderValue(item))
  }

  if (error) {
    return (
      <div className="void-panel neural-glow">
        <h2 className="text-xl sm:text-2xl font-bold text-plasma mb-6">
          ⚠️ Behavior Configuration Error
        </h2>
        
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
          <p className="text-red-400 mb-4">{error}</p>
          <p className="text-gray-400 text-sm">
            Failed to generate behavior ruleset for agent soul.
          </p>
        </div>

        <button
          onClick={handleRetry}
          className="w-full py-3 px-6 bg-plasma hover:bg-plasma/80 rounded-lg font-semibold transition-colors min-h-[48px]"
        >
          🔄 Retry Configuration
        </button>
      </div>
    )
  }

  if (isGenerating) {
    return (
      <div className="void-panel neural-glow text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-synapse mb-6 sm:mb-8">
          4️⃣ Configuring Agent Behavior
        </h2>
        
        <div className="mb-6 sm:mb-8">
          <div className="relative">
            <div className="inline-block animate-spin rounded-full h-12 sm:h-16 w-12 sm:w-16 border-b-4 border-plasma"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 sm:w-8 h-6 sm:h-8 bg-synapse rounded-full animate-neural-fire"></div>
            </div>
          </div>
        </div>

        <div className="text-base sm:text-lg text-white mb-4">
          {generationSteps[currentStep]}
        </div>

        <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
          <div 
            className="bg-gradient-to-r from-synapse to-plasma h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep + 1) / generationSteps.length) * 100}%` }}
          ></div>
        </div>

        <p className="text-gray-400 px-4">
          Setting behavioral boundaries for {chosenSoul.agent_name}...
        </p>
      </div>
    )
  }

  const config = behaviorConfig.deployment_config

  return (
    <div className="void-panel neural-glow">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-synapse mb-2">
          ⚙️ {renderValue(config.agent_name)} - Behavior Configured
        </h2>
        <p className="text-gray-400">
          Your agent is ready for deployment with content-specific behavioral constraints
        </p>
      </div>

      {/* Agent Overview */}
      <div className="bg-gradient-to-br from-neural to-void border border-synapse/30 rounded-lg p-4 sm:p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
          <h3 className="text-lg sm:text-xl font-bold text-white break-words">{renderValue(config.agent_name)}</h3>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm">CONFIGURED</span>
          </div>
        </div>
        
        <div className="text-sm text-gray-300 mb-4">
          <span className="text-synapse font-semibold">Role:</span> {renderValue(config.role)}
        </div>
        <div className="text-sm text-gray-300">
          <span className="text-plasma font-semibold">Content Domain:</span> {renderValue(config.content_domain)}
        </div>
      </div>

      {/* LLM Settings */}
      <div className="bg-neural/50 p-4 rounded-lg mb-6">
        <h4 className="text-synapse font-semibold mb-3">🧠 AI Configuration</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-blue-400 font-medium">Model:</span>
            <p className="text-gray-300">{renderValue(config.llm_settings?.model)}</p>
          </div>
          <div>
            <span className="text-green-400 font-medium">Temperature:</span>
            <p className="text-gray-300">{renderValue(config.llm_settings?.temperature)}</p>
          </div>
          <div>
            <span className="text-purple-400 font-medium">Max Tokens:</span>
            <p className="text-gray-300">{renderValue(config.llm_settings?.max_tokens)}</p>
          </div>
        </div>
      </div>

      {/* Response Constraints */}
      {config.response_constraints && (
        <div className="bg-neural/50 p-4 rounded-lg mb-6">
          <h4 className="text-plasma font-semibold mb-3">📝 Response Constraints</h4>
          <ul className="space-y-2">
            {renderArray(config.response_constraints).map((constraint, index) => (
              <li key={index} className="text-sm text-gray-300 flex items-start">
                <span className="text-plasma mr-2 flex-shrink-0">•</span>
                <span>{constraint}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Knowledge Boundaries */}
      {config.knowledge_boundaries && (
        <div className="bg-neural/50 p-4 rounded-lg mb-6">
          <h4 className="text-red-400 font-semibold mb-3">🔒 Knowledge Boundaries</h4>
          <ul className="space-y-2">
            {renderArray(config.knowledge_boundaries).map((boundary, index) => (
              <li key={index} className="text-sm text-gray-300 flex items-start">
                <span className="text-red-400 mr-2 flex-shrink-0">•</span>
                <span>{boundary}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* System Prompt Preview */}
      <div className="bg-neural/50 p-4 rounded-lg mb-6">
        <h4 className="text-yellow-400 font-semibold mb-3">🎭 System Prompt Preview</h4>
        <div className="bg-gray-800 p-3 rounded max-h-40 overflow-y-auto">
          <p className="text-gray-300 text-xs leading-relaxed whitespace-pre-wrap">{renderValue(config.system_prompt)}</p>
        </div>
      </div>

      {/* User Question Starters */}
      {config.user_question_starters && (
        <div className="bg-neural/50 p-4 rounded-lg mb-6">
          <h4 className="text-green-400 font-semibold mb-3">💬 Sample Questions (Your POV)</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {renderArray(config.user_question_starters).slice(0, 4).map((question, index) => (
              <div key={index} className="bg-void/50 p-3 rounded border border-gray-600">
                <p className="text-gray-300 text-sm italic">"{question}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fallback Responses */}
      {config.fallback_responses && (
        <div className="bg-neural/50 p-4 rounded-lg mb-6">
          <h4 className="text-orange-400 font-semibold mb-3">🔄 Fallback Responses</h4>
          <ul className="space-y-2">
            {renderArray(config.fallback_responses).map((fallback, index) => (
              <li key={index} className="text-sm text-gray-300 flex items-start">
                <span className="text-orange-400 mr-2 flex-shrink-0">•</span>
                <span>"{fallback}"</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Deployment Preview */}
      <div className="bg-void/50 border border-synapse/30 rounded-lg p-4 mb-6">
        <h4 className="text-synapse font-semibold mb-3">🚀 Deployment Ready</h4>
        <div className="text-sm text-gray-300">
          <div className="mb-2">
            <span className="text-yellow-400">Agent Name:</span> {renderValue(config.agent_name)}
          </div>
          <div className="mb-2">
            <span className="text-yellow-400">Domain:</span> {renderValue(config.content_domain)}
          </div>
          <div>
            <span className="text-yellow-400">Deployment Type:</span> In-site chat with content-specific constraints
          </div>
        </div>
      </div>

      <button
        onClick={handleDeploy}
        className="w-full py-3 px-6 bg-gradient-to-r from-synapse to-plasma hover:from-synapse/80 hover:to-plasma/80 rounded-lg font-semibold transition-all transform hover:scale-105 min-h-[48px]"
      >
        🌟 Deploy Agent →
      </button>
    </div>
  )
}

export default BehaviorRuleset