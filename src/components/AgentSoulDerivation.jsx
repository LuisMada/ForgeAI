import { useState, useEffect } from 'react'
import { deriveAgentSoul } from '../services/openai'

function AgentSoulDerivation({ compressedContext, chosenAgent, onComplete }) {
  const [isDeriving, setIsDeriving] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [agentSoul, setAgentSoul] = useState(null)
  const [error, setError] = useState(null)

  const derivationSteps = [
    "Analyzing agent's emotional drivers...",
    "Calibrating communication patterns...",
    "Establishing cognitive framework...",
    "Setting conversation principles...",
    "Finalizing agent personality..."
  ]

  useEffect(() => {
    deriveAgentPersonality()
  }, [chosenAgent])

  const deriveAgentPersonality = async () => {
    try {
      // Simulate derivation steps
      for (let i = 0; i < derivationSteps.length - 1; i++) {
        setCurrentStep(i)
        await new Promise(resolve => setTimeout(resolve, 1000))
      }

      setCurrentStep(derivationSteps.length - 1)
      
      // Real AI soul derivation
      const soul = await deriveAgentSoul(compressedContext, chosenAgent)
      
      setAgentSoul(soul)
      setIsDeriving(false)
    } catch (err) {
      setError(err.message)
      setIsDeriving(false)
    }
  }

  const handleContinue = () => {
    onComplete(agentSoul)
  }

  const handleRetry = () => {
    setError(null)
    setIsDeriving(true)
    setCurrentStep(0)
    deriveAgentPersonality()
  }

  if (error) {
    return (
      <div className="void-panel neural-glow">
        <h2 className="text-2xl font-bold text-plasma mb-6">
          ⚠️ Soul Derivation Error
        </h2>
        
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
          <p className="text-red-400 mb-4">{error}</p>
          <p className="text-gray-400 text-sm">
            Failed to derive agent soul and personality.
          </p>
        </div>

        <button
          onClick={handleRetry}
          className="w-full py-3 px-6 bg-plasma hover:bg-plasma/80 rounded-lg font-semibold transition-colors"
        >
          🔄 Retry Soul Derivation
        </button>
      </div>
    )
  }

  if (isDeriving) {
    return (
      <div className="void-panel neural-glow text-center">
        <h2 className="text-2xl font-bold text-synapse mb-8">
          4️⃣ Agent Soul Derivation
        </h2>
        
        <div className="mb-8">
          <div className="relative">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-plasma"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-synapse rounded-full animate-neural-fire"></div>
            </div>
          </div>
        </div>

        <div className="text-lg text-white mb-4">
          {derivationSteps[currentStep]}
        </div>

        <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
          <div 
            className="bg-gradient-to-r from-synapse to-plasma h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep + 1) / derivationSteps.length) * 100}%` }}
          ></div>
        </div>

        <p className="text-gray-400">
          Giving {chosenAgent.agent_name} its spirit and behavioral mind...
        </p>
      </div>
    )
  }

  return (
    <div className="void-panel neural-glow">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-synapse mb-2">
          🧠 {chosenAgent.agent_name} - Soul Derived
        </h2>
        <p className="text-gray-400">
          Your AI cofounder now has a distinct personality and behavioral mind
        </p>
      </div>

      {/* Agent Overview */}
      <div className="bg-gradient-to-br from-neural to-void border border-synapse/30 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">{chosenAgent.agent_name}</h3>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm">SOUL ACTIVE</span>
          </div>
        </div>
        
        <div className="text-sm text-gray-300 mb-4">
          <span className="text-synapse">Focus:</span> {chosenAgent.problem}
        </div>
        <div className="text-sm text-gray-300">
          <span className="text-synapse">Target:</span> {chosenAgent.who}
        </div>
      </div>

      {/* Soul Characteristics */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        
        <div className="bg-neural/50 p-4 rounded-lg">
          <h4 className="text-red-400 font-semibold mb-3">🔥 Emotional Driver</h4>
          <p className="text-gray-300 text-sm">{agentSoul.emotion}</p>
        </div>

        <div className="bg-neural/50 p-4 rounded-lg">
          <h4 className="text-blue-400 font-semibold mb-3">🗣️ Communication Tone</h4>
          <p className="text-gray-300 text-sm">{agentSoul.tone}</p>
        </div>

        <div className="bg-neural/50 p-4 rounded-lg">
          <h4 className="text-green-400 font-semibold mb-3">🧩 Cognitive Character</h4>
          <p className="text-gray-300 text-sm">{agentSoul.character}</p>
        </div>

        <div className="bg-neural/50 p-4 rounded-lg">
          <h4 className="text-purple-400 font-semibold mb-3">⚖️ Decision Framework</h4>
          <p className="text-gray-300 text-sm">{agentSoul.decision_framework}</p>
        </div>

      </div>

      {/* Core Belief */}
      <div className="bg-neural/50 p-4 rounded-lg mb-6">
        <h4 className="text-yellow-400 font-semibold mb-3">💡 Core Belief</h4>
        <p className="text-gray-300 text-sm italic">"{agentSoul.core_belief}"</p>
      </div>

      {/* Conversation Rules */}
      <div className="bg-neural/50 p-4 rounded-lg mb-6">
        <h4 className="text-synapse font-semibold mb-3">📋 Conversation Rules</h4>
        <ul className="space-y-2">
          {agentSoul.conversation_rules.map((rule, index) => (
            <li key={index} className="text-sm text-gray-300 flex items-start">
              <span className="text-synapse mr-2">{index + 1}.</span>
              {rule}
            </li>
          ))}
        </ul>
      </div>

      {/* Communication Style */}
      <div className="bg-neural/50 p-4 rounded-lg mb-6">
        <h4 className="text-plasma font-semibold mb-3">💬 Communication Style</h4>
        <p className="text-gray-300 text-sm">{agentSoul.communication_style}</p>
      </div>

      {/* Preview Message */}
      <div className="bg-void/50 border border-synapse/30 rounded-lg p-4 mb-6">
        <h4 className="text-synapse font-semibold mb-3">🎭 Personality Preview</h4>
        <div className="bg-neural p-3 rounded border-l-4 border-synapse">
          <p className="text-gray-300 text-sm italic">
            "Ready to work together. I approach problems with {agentSoul.character.toLowerCase()}, 
            communicate in a {agentSoul.tone.toLowerCase()} manner, and I'm driven by {agentSoul.emotion.toLowerCase()}. 
            Let's build something that matters."
          </p>
          <div className="text-xs text-synapse mt-2">- {chosenAgent.agent_name}</div>
        </div>
      </div>

      <button
        onClick={handleContinue}
        className="w-full py-3 px-6 bg-gradient-to-r from-synapse to-plasma hover:from-synapse/80 hover:to-plasma/80 rounded-lg font-semibold transition-all transform hover:scale-105"
      >
        💬 Start Working Together →
      </button>
    </div>
  )
}

export default AgentSoulDerivation