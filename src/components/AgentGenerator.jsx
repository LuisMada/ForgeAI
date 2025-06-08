import { useState, useEffect } from 'react'
import { generateAIAgent } from '../services/openai'

function AgentGenerator({ knowledge, onComplete }) {
  const [isGenerating, setIsGenerating] = useState(true)
  const [currentPhase, setCurrentPhase] = useState(0)
  const [generatedAgent, setGeneratedAgent] = useState(null)
  const [error, setError] = useState(null)

  const generationPhases = [
    "Initializing AI agent substrate...",
    "Encoding domain expertise...",
    "Calibrating founder mindset...",
    "Installing adaptive learning protocols...",
    "Activating autonomous ideation loops...",
    "Agent consciousness emerging..."
  ]

  useEffect(() => {
    generateAgent()
  }, [knowledge])

  const generateAgent = async () => {
    try {
      // Simulate generation phases UI
      for (let i = 0; i < generationPhases.length - 1; i++) {
        setCurrentPhase(i)
        await new Promise(resolve => setTimeout(resolve, 1200))
      }

      setCurrentPhase(generationPhases.length - 1)
      
      // Real AI agent generation
      const agent = await generateAIAgent(knowledge)
      
      // Add metadata
      const enrichedAgent = {
        ...agent,
        id: `agent_${Date.now()}`,
        domain: knowledge.domain,
        sourceKnowledge: knowledge,
        generatedAt: new Date().toISOString(),
        version: '1.0.0'
      }

      setGeneratedAgent(enrichedAgent)
      setIsGenerating(false)
    } catch (err) {
      setError(err.message)
      setIsGenerating(false)
    }
  }

  const handleRegenerateAgent = async () => {
    setError(null)
    setIsGenerating(true)
    setCurrentPhase(0)
    generateAgent()
  }

  const handleContinue = () => {
    onComplete(generatedAgent)
  }

  if (error) {
    return (
      <div className="void-panel neural-glow">
        <h2 className="text-2xl font-bold text-plasma mb-6">
          ⚠️ Agent Generation Error
        </h2>
        
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
          <p className="text-red-400 mb-4">{error}</p>
          <p className="text-gray-400 text-sm">
            The AI agent generation failed. This could be due to API limits or connectivity issues.
          </p>
        </div>

        <button
          onClick={handleRegenerateAgent}
          className="w-full py-3 px-6 bg-plasma hover:bg-plasma/80 rounded-lg font-semibold transition-colors"
        >
          🔄 Regenerate Agent
        </button>
      </div>
    )
  }

  if (isGenerating) {
    return (
      <div className="void-panel neural-glow text-center">
        <h2 className="text-2xl font-bold text-synapse mb-8">
          🧬 AI Agent Generator
        </h2>
        
        <div className="mb-8">
          <div className="relative">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-plasma"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-synapse rounded-full animate-pulse-glow"></div>
            </div>
          </div>
        </div>

        <div className="text-lg text-white mb-4">
          {generationPhases[currentPhase]}
        </div>

        <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
          <div 
            className="bg-gradient-to-r from-synapse to-plasma h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentPhase + 1) / generationPhases.length) * 100}%` }}
          ></div>
        </div>

        <p className="text-gray-400">
          Transmuting knowledge into autonomous intelligence...
        </p>
      </div>
    )
  }

  return (
    <div className="void-panel neural-glow">
      <h2 className="text-2xl font-bold text-synapse mb-6">
        🤖 AI Agent Successfully Generated
      </h2>
      
      {/* Agent Identity Card */}
      <div className="bg-gradient-to-br from-neural to-void border border-synapse/30 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-white">{generatedAgent.name}</h3>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm">ACTIVE</span>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="text-plasma font-semibold mb-2">Persona</h4>
            <div className="text-sm text-gray-300 space-y-1">
              <div><span className="text-synapse">Archetype:</span> {generatedAgent.persona.archetype}</div>
              <div><span className="text-synapse">Specialty:</span> {generatedAgent.persona.specialty}</div>
            </div>
          </div>
          <div>
            <h4 className="text-plasma font-semibold mb-2">Core Stats</h4>
            <div className="text-sm text-gray-300 space-y-1">
              <div><span className="text-synapse">Agency Level:</span> {generatedAgent.agencyLevel}%</div>
              <div><span className="text-synapse">Ethics Mode:</span> {generatedAgent.ethicsMode}</div>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h4 className="text-plasma font-semibold mb-2">Mindset</h4>
          <p className="text-gray-300 text-sm italic">"{generatedAgent.persona.mindset}"</p>
        </div>

        <div className="mb-4">
          <h4 className="text-plasma font-semibold mb-2">Approach</h4>
          <p className="text-gray-300 text-sm">{generatedAgent.persona.approach}</p>
        </div>
      </div>

      {/* Core Objective & Drive */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-neural/50 p-4 rounded-lg">
          <h4 className="text-synapse font-semibold mb-2">🎯 Core Objective</h4>
          <p className="text-gray-300 text-sm">{generatedAgent.coreObjective}</p>
        </div>
        <div className="bg-neural/50 p-4 rounded-lg">
          <h4 className="text-plasma font-semibold mb-2">🔥 Drive</h4>
          <p className="text-gray-300 text-sm">{generatedAgent.drive}</p>
        </div>
      </div>

      {/* Capabilities */}
      <div className="bg-neural/50 p-4 rounded-lg mb-6">
        <h4 className="text-green-400 font-semibold mb-3">⚡ Capabilities</h4>
        <div className="grid md:grid-cols-2 gap-2">
          {generatedAgent.capabilities.map((capability, index) => (
            <div key={index} className="flex items-center text-sm text-gray-300">
              <span className="text-green-400 mr-2">•</span>
              {capability}
            </div>
          ))}
        </div>
      </div>

      {/* Memory Structure */}
      <div className="bg-neural/50 p-4 rounded-lg mb-6">
        <h4 className="text-yellow-400 font-semibold mb-3">🧠 Memory Structure</h4>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <h5 className="text-synapse text-sm font-semibold mb-2">Insights</h5>
            <ul className="space-y-1">
              {generatedAgent.memoryStructure.insights.map((insight, index) => (
                <li key={index} className="text-xs text-gray-400">• {insight}</li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="text-plasma text-sm font-semibold mb-2">Patterns</h5>
            <ul className="space-y-1">
              {generatedAgent.memoryStructure.patterns.map((pattern, index) => (
                <li key={index} className="text-xs text-gray-400">• {pattern}</li>
              ))}
            </ul>
          </div>
          <div>
            <h5 className="text-yellow-400 text-sm font-semibold mb-2">Failures</h5>
            <ul className="space-y-1">
              {generatedAgent.memoryStructure.failures.map((failure, index) => (
                <li key={index} className="text-xs text-gray-400">• {failure}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleRegenerateAgent}
          className="flex-1 py-3 px-6 bg-void hover:bg-void/80 border border-gray-600 hover:border-synapse/50 rounded-lg font-semibold transition-all"
        >
          🔄 Regenerate Agent
        </button>
        
        <button
          onClick={handleContinue}
          className="flex-1 py-3 px-6 bg-gradient-to-r from-synapse to-plasma hover:from-synapse/80 hover:to-plasma/80 rounded-lg font-semibold transition-all transform hover:scale-105"
        >
          🚀 Run Startup Simulation →
        </button>
      </div>
    </div>
  )
}

export default AgentGenerator