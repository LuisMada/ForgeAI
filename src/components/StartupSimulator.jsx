import { useState, useEffect } from 'react'
import { simulateStartup, generateAbyssMode } from '../services/openai'

function StartupSimulator({ agent, onComplete }) {
  const [isSimulating, setIsSimulating] = useState(true)
  const [currentCycle, setCurrentCycle] = useState(0)
  const [simulationResults, setSimulationResults] = useState(null)
  const [error, setError] = useState(null)
  const [abyssMode, setAbyssMode] = useState(false)
  const [abyssResults, setAbyssResults] = useState(null)

  const simulationPhases = [
    "Agent initializing startup protocols...",
    "Running ideation cycle 1...",
    "Validating assumptions...",
    "Running ideation cycle 2...", 
    "MVP design iteration...",
    "Running ideation cycle 3...",
    "Market feedback simulation...",
    "Finalizing recommendations..."
  ]

  useEffect(() => {
    runSimulation()
  }, [agent])

  const runSimulation = async () => {
    try {
      // Simulate phases UI
      for (let i = 0; i < simulationPhases.length - 1; i++) {
        setCurrentCycle(i)
        await new Promise(resolve => setTimeout(resolve, 1500))
      }

      setCurrentCycle(simulationPhases.length - 1)
      
      // Real AI simulation
      const results = await simulateStartup(agent, 3)
      
      setSimulationResults(results)
      setIsSimulating(false)
    } catch (err) {
      setError(err.message)
      setIsSimulating(false)
    }
  }

  const handleAbyssMode = async () => {
    try {
      setAbyssMode(true)
      const abyssIdeas = await generateAbyssMode(agent)
      setAbyssResults(abyssIdeas)
    } catch (err) {
      console.error('Abyss mode error:', err)
      setAbyssMode(false)
    }
  }

  const handleContinue = () => {
    onComplete({
      standardResults: simulationResults,
      abyssResults: abyssResults,
      agent: agent
    })
  }

  const handleRetrySimulation = () => {
    setError(null)
    setIsSimulating(true)
    setCurrentCycle(0)
    runSimulation()
  }

  if (error) {
    return (
      <div className="void-panel neural-glow">
        <h2 className="text-2xl font-bold text-plasma mb-6">
          ⚠️ Simulation Error
        </h2>
        
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
          <p className="text-red-400 mb-4">{error}</p>
          <p className="text-gray-400 text-sm">
            The startup simulation failed. This could be due to API limits or model capacity.
          </p>
        </div>

        <button
          onClick={handleRetrySimulation}
          className="w-full py-3 px-6 bg-plasma hover:bg-plasma/80 rounded-lg font-semibold transition-colors"
        >
          🔄 Retry Simulation
        </button>
      </div>
    )
  }

  if (isSimulating) {
    return (
      <div className="void-panel neural-glow text-center">
        <h2 className="text-2xl font-bold text-synapse mb-8">
          🚀 Startup Simulation Engine
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
          {simulationPhases[currentCycle]}
        </div>

        <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
          <div 
            className="bg-gradient-to-r from-synapse to-plasma h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentCycle + 1) / simulationPhases.length) * 100}%` }}
          ></div>
        </div>

        <p className="text-gray-400">
          Agent is running ideation → validation → MVP cycles...
        </p>
      </div>
    )
  }

  return (
    <div className="void-panel neural-glow">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-synapse">
          🎯 Startup Simulation Results
        </h2>
        <div className="text-sm text-gray-400">
          Agent: {agent.name}
        </div>
      </div>

      {/* Simulation Cycles */}
      <div className="space-y-6 mb-8">
        {simulationResults.cycles.map((cycle, index) => (
          <div key={index} className="bg-neural/50 rounded-lg p-4 border-l-4 border-synapse">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                Cycle {cycle.cycle}: {cycle.idea.name}
              </h3>
              <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                cycle.decision === 'continue' ? 'bg-green-500/20 text-green-400' :
                cycle.decision === 'pivot' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {cycle.decision.toUpperCase()}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Idea */}
              <div>
                <h4 className="text-plasma font-semibold mb-2">💡 Idea</h4>
                <div className="text-sm text-gray-300 space-y-1">
                  <div><span className="text-synapse">Problem:</span> {cycle.idea.problem}</div>
                  <div><span className="text-synapse">Solution:</span> {cycle.idea.solution}</div>
                  <div><span className="text-synapse">Target:</span> {cycle.idea.target}</div>
                </div>
              </div>

              {/* MVP */}
              <div>
                <h4 className="text-green-400 font-semibold mb-2">🛠️ MVP</h4>
                <div className="text-sm text-gray-300 space-y-1">
                  <div><span className="text-synapse">Timeline:</span> {cycle.mvp.timeline}</div>
                  <div><span className="text-synapse">Resources:</span> {cycle.mvp.resources}</div>
                </div>
              </div>
            </div>

            {/* Feedback */}
            <div className="mt-4">
              <h4 className="text-yellow-400 font-semibold mb-2">📊 Market Feedback</h4>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-300">{cycle.feedback.marketResponse}</p>
                <div className="text-lg font-bold text-yellow-400">
                  {cycle.feedback.score}/10
                </div>
              </div>
            </div>

            {/* Key Features */}
            <div className="mt-3">
              <h4 className="text-blue-400 font-semibold mb-2">🔧 Core Features</h4>
              <div className="flex flex-wrap gap-2">
                {cycle.mvp.features.map((feature, fIndex) => (
                  <span key={fIndex} className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Final Recommendation */}
      <div className="bg-gradient-to-br from-synapse/10 to-plasma/10 border border-synapse/30 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-synapse mb-4">🏆 Final Recommendation</h3>
        <div className="mb-4">
          <h4 className="text-plasma font-semibold mb-2">Best Idea</h4>
          <p className="text-white font-semibold">{simulationResults.finalRecommendation.bestIdea}</p>
        </div>
        <div className="mb-4">
          <h4 className="text-plasma font-semibold mb-2">Reasoning</h4>
          <p className="text-gray-300 text-sm">{simulationResults.finalRecommendation.reasoning}</p>
        </div>
        <div>
          <h4 className="text-plasma font-semibold mb-2">Next Steps</h4>
          <ul className="space-y-1">
            {simulationResults.finalRecommendation.nextSteps.map((step, index) => (
              <li key={index} className="text-sm text-gray-300 flex items-start">
                <span className="text-synapse mr-2">{index + 1}.</span>
                {step}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Abyss Mode Section */}
      <div className="bg-red-900/10 border border-red-500/30 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-red-400">🔥 Abyss Mode</h3>
          <div className="text-xs text-gray-400">Morally Questionable Ideas</div>
        </div>
        
        {!abyssMode ? (
          <div>
            <p className="text-gray-300 text-sm mb-4">
              Explore the dark side of innovation. Generate strategically brilliant but ethically questionable startup ideas.
              <span className="text-red-400 block mt-2">⚠️ For strategic analysis only</span>
            </p>
            <button
              onClick={handleAbyssMode}
              className="w-full py-3 px-6 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
            >
              🕳️ Enter The Abyss
            </button>
          </div>
        ) : abyssResults ? (
          <div>
            <p className="text-red-400 text-sm mb-4">
              {abyssResults.warning}
            </p>
            <div className="space-y-4">
              {abyssResults.abyssIdeas.map((idea, index) => (
                <div key={index} className="bg-red-900/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-red-300 font-semibold">{idea.name}</h4>
                    <div className="flex space-x-2 text-xs">
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">
                        Disruption: {idea.disruptionPotential}/10
                      </span>
                      <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded">
                        Moral: {idea.moralScore}/10
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">{idea.concept}</p>
                  <div className="grid md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-green-400">Strategic Advantage:</span>
                      <p className="text-gray-400">{idea.strategicAdvantage}</p>
                    </div>
                    <div>
                      <span className="text-red-400">Societal Threat:</span>
                      <p className="text-gray-400">{idea.societalThreat}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-400"></div>
            <p className="text-red-400 mt-2">Generating abyss ideas...</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleRetrySimulation}
          className="flex-1 py-3 px-6 bg-void hover:bg-void/80 border border-gray-600 hover:border-synapse/50 rounded-lg font-semibold transition-all"
        >
          🔄 Re-run Simulation
        </button>
        
        <button
          onClick={handleContinue}
          className="flex-1 py-3 px-6 bg-gradient-to-r from-synapse to-plasma hover:from-synapse/80 hover:to-plasma/80 rounded-lg font-semibold transition-all transform hover:scale-105"
        >
          📦 Export Agent →
        </button>
      </div>
    </div>
  )
}

export default StartupSimulator