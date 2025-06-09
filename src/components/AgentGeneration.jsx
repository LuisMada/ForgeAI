import { useState, useEffect } from 'react'
import { generateAgentCandidates } from '../services/openai'

function AgentGeneration({ compressedContext, onAgentsGenerated, onAgentChosen }) {
  const [isGenerating, setIsGenerating] = useState(true)
  const [currentPhase, setCurrentPhase] = useState(0)
  const [agents, setAgents] = useState([])
  const [selectedAgent, setSelectedAgent] = useState(null)
  const [error, setError] = useState(null)

  const generationPhases = [
    "Analyzing problem space...",
    "Mapping stakeholder patterns...",
    "Generating mainstream agents...",
    "Creating ethical edge agent...",
    "Finalizing agent deck..."
  ]

  useEffect(() => {
    generateAgents()
  }, [compressedContext])

  const generateAgents = async () => {
    try {
      // Simulate generation phases
      for (let i = 0; i < generationPhases.length - 1; i++) {
        setCurrentPhase(i)
        await new Promise(resolve => setTimeout(resolve, 1200))
      }

      setCurrentPhase(generationPhases.length - 1)
      
      // Real AI agent generation
      const result = await generateAgentCandidates(compressedContext)
      
      setAgents(result.agents)
      onAgentsGenerated(result.agents)
      setIsGenerating(false)
    } catch (err) {
      setError(err.message)
      setIsGenerating(false)
    }
  }

  const handleAgentSelect = (agent) => {
    setSelectedAgent(agent)
  }

  const handleChooseAgent = () => {
    onAgentChosen(selectedAgent)
  }

  const handleRegenerate = () => {
    setError(null)
    setIsGenerating(true)
    setCurrentPhase(0)
    setSelectedAgent(null)
    generateAgents()
  }

  const getRiskColor = (riskLevel) => {
    switch(riskLevel) {
      case 'low': return 'text-green-400'
      case 'medium': return 'text-yellow-400'
      case 'high': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getModeIcon = (mode) => {
    return mode === 'edge' ? '☠️' : '🤖'
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
            Failed to generate agent candidates from compressed context.
          </p>
        </div>

        <button
          onClick={handleRegenerate}
          className="w-full py-3 px-6 bg-plasma hover:bg-plasma/80 rounded-lg font-semibold transition-colors"
        >
          🔄 Regenerate Agents
        </button>
      </div>
    )
  }

  if (isGenerating) {
    return (
      <div className="void-panel neural-glow text-center">
        <h2 className="text-2xl font-bold text-synapse mb-8">
          3️⃣ Agent Archetype Generation
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
          Forging multiple startup minds from one context...
        </p>
      </div>
    )
  }

  return (
    <div className="void-panel neural-glow">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-synapse mb-2">
          🎯 Choose Your AI Cofounder
        </h2>
        <p className="text-gray-400">
          Select one agent to develop its soul and begin working together
        </p>
      </div>

      {/* Agent Cards */}
      <div className="grid gap-6 mb-8">
        {agents.map((agent, index) => (
          <div 
            key={index}
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all hover:scale-[1.02] ${
              selectedAgent === agent
                ? 'border-synapse bg-synapse/10 shadow-lg shadow-synapse/20'
                : agent.mode === 'edge'
                ? 'border-red-500/50 bg-red-900/10 hover:border-red-400'
                : 'border-gray-600 hover:border-plasma/50'
            }`}
            onClick={() => handleAgentSelect(agent)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{getModeIcon(agent.mode)}</span>
                <div>
                  <h3 className="text-xl font-bold text-white">{agent.agent_name}</h3>
                  <div className="flex items-center gap-4 mt-1">
                    <span className={`text-sm font-medium ${getRiskColor(agent.risk_level)}`}>
                      {agent.risk_level.toUpperCase()} RISK
                    </span>
                    {agent.mode === 'edge' && (
                      <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded-full">
                        ETHICAL EDGE
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {selectedAgent === agent && (
                <div className="w-6 h-6 bg-synapse rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="text-plasma font-semibold mb-2">🎯 Target & Problem</h4>
                <div className="text-sm text-gray-300 space-y-1">
                  <div><span className="text-synapse">WHO:</span> {agent.who}</div>
                  <div><span className="text-synapse">PROBLEM:</span> {agent.problem}</div>
                </div>
              </div>
              <div>
                <h4 className="text-plasma font-semibold mb-2">🧠 AI Architecture</h4>
                <div className="text-sm text-gray-300 space-y-1">
                  <div><span className="text-synapse">INPUT:</span> {agent.ai_architecture.input}</div>
                  <div><span className="text-synapse">MODEL:</span> {agent.ai_architecture.model}</div>
                  <div><span className="text-synapse">OUTPUT:</span> {agent.ai_architecture.output}</div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-plasma font-semibold mb-2">🔥 Why This Matters</h4>
              <p className="text-gray-300 text-sm">{agent.why}</p>
            </div>

            <div className="mb-4">
              <h4 className="text-plasma font-semibold mb-2">⚡ Approach</h4>
              <p className="text-gray-300 text-sm">{agent.approach}</p>
            </div>

            {agent.mode === 'edge' && (
              <div className="mt-4 p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-xs font-medium mb-1">⚠️ ETHICAL EDGE AGENT</p>
                <p className="text-gray-400 text-xs">
                  High-risk, high-impact opportunities in gray areas. Proceed with caution and ethical consideration.
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleRegenerate}
          className="flex-1 py-3 px-6 bg-void hover:bg-void/80 border border-gray-600 hover:border-synapse/50 rounded-lg font-semibold transition-all"
        >
          🔄 Generate New Agents
        </button>
        
        <button
          onClick={handleChooseAgent}
          disabled={!selectedAgent}
          className="flex-1 py-3 px-6 bg-gradient-to-r from-synapse to-plasma hover:from-synapse/80 hover:to-plasma/80 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-all transform hover:scale-105 disabled:hover:scale-100"
        >
          🧬 Derive Agent Soul →
        </button>
      </div>
    </div>
  )
}

export default AgentGeneration