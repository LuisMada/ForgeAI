import { useState, useEffect } from 'react'
import { generateSouls } from '../services/openai'
import SoulNudging from './SoulNudging'

function SoulGeneration({ compressedContext, onSoulsGenerated, onSoulChosen }) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [currentPhase, setCurrentPhase] = useState(0)
  const [souls, setSouls] = useState([])
  const [selectedSoul, setSelectedSoul] = useState(null)
  const [error, setError] = useState(null)
  const [soulNudges, setSoulNudges] = useState([])
  const [hasGenerated, setHasGenerated] = useState(false)

  const generationPhases = [
    "Analyzing content domain...",
    "Processing your guidance...",
    "Mapping conversation patterns...",
    "Generating soul archetype 1...",
    "Generating soul archetype 2...", 
    "Generating soul archetype 3...",
    "Finalizing agent souls..."
  ]

  // Auto-generate souls when component first loads (without nudges)
  useEffect(() => {
    if (!hasGenerated) {
      generateAgentSouls([])
    }
  }, [compressedContext])

  const generateAgentSouls = async (nudges = soulNudges) => {
    try {
      setIsGenerating(true)
      setError(null)
      setSelectedSoul(null)
      
      // Simulate generation phases
      for (let i = 0; i < generationPhases.length - 1; i++) {
        setCurrentPhase(i)
        await new Promise(resolve => setTimeout(resolve, 1200))
      }

      setCurrentPhase(generationPhases.length - 1)
      
      // Real AI soul generation with nudges
      const result = await generateSouls(compressedContext, nudges)
      
      setSouls(result.souls)
      onSoulsGenerated(result.souls)
      setIsGenerating(false)
      setHasGenerated(true)
    } catch (err) {
      setError(err.message)
      setIsGenerating(false)
    }
  }

  const handleNudgesUpdate = (newNudges) => {
    setSoulNudges(newNudges)
  }

  const handleRegenerateWithNudges = () => {
    generateAgentSouls(soulNudges)
  }

  const handleSoulSelect = (soul) => {
    setSelectedSoul(soul)
  }

  const handleChooseSoul = () => {
    onSoulChosen(selectedSoul)
  }

  const handleRegenerate = () => {
    generateAgentSouls([]) // Regenerate without nudges
  }

  // Helper function to safely render any value
  const renderValue = (value, fallback = 'Not specified') => {
    if (value === null || value === undefined) {
      return fallback
    }
    if (typeof value === 'object') {
      if (Array.isArray(value)) {
        return value.join(', ')
      }
      return JSON.stringify(value, null, 2)
    }
    return String(value)
  }

  if (error) {
    return (
      <div className="void-panel neural-glow">
        <h2 className="text-xl sm:text-2xl font-bold text-plasma mb-6">
          ⚠️ Soul Generation Error
        </h2>
        
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
          <p className="text-red-400 mb-4">{error}</p>
          <p className="text-gray-400 text-sm">
            Failed to generate agent souls from content analysis.
          </p>
        </div>

        <button
          onClick={() => generateAgentSouls(soulNudges)}
          className="w-full py-3 px-6 bg-plasma hover:bg-plasma/80 rounded-lg font-semibold transition-colors min-h-[48px]"
        >
          🔄 Regenerate Souls
        </button>
      </div>
    )
  }

  if (isGenerating) {
    return (
      <div className="void-panel neural-glow text-center">
        <h2 className="text-xl sm:text-2xl font-bold text-synapse mb-6 sm:mb-8">
          3️⃣ Generating Souls
        </h2>
        
        <div className="mb-6 sm:mb-8">
          <div className="relative">
            <div className="inline-block animate-spin rounded-full h-12 sm:h-16 w-12 sm:w-16 border-b-4 border-plasma"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 sm:w-8 h-6 sm:h-8 bg-synapse rounded-full animate-pulse-glow"></div>
            </div>
          </div>
        </div>

        <div className="text-base sm:text-lg text-white mb-4">
          {generationPhases[currentPhase]}
        </div>

        <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
          <div 
            className="bg-gradient-to-r from-synapse to-plasma h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentPhase + 1) / generationPhases.length) * 100}%` }}
          ></div>
        </div>

        <p className="text-gray-400 px-4">
          {soulNudges.length > 0 
            ? "Forging souls based on your guidance..." 
            : "Forging distinct conversational souls from content patterns..."
          }
        </p>
        
        {soulNudges.length > 0 && (
          <div className="mt-4 text-sm text-plasma">
            Applying {soulNudges.length} guidance{soulNudges.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="void-panel neural-glow">
      <div className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-synapse mb-2">
          3️⃣ Choose Your Agent Soul
        </h2>
        <p className="text-gray-400">
          Guide the soul creation or select from generated options
        </p>
      </div>

      {/* Soul Nudging Interface */}
      <SoulNudging 
        onNudgesUpdate={handleNudgesUpdate}
        onGenerateRequested={handleRegenerateWithNudges}
        initialNudges={soulNudges}
      />

      {/* Generated Souls Display */}
      {souls.length > 0 && (
        <>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white mb-2">
              👻 Generated Souls
              {soulNudges.length > 0 && (
                <span className="text-sm text-plasma ml-2">
                  (with {soulNudges.length} guidance{soulNudges.length !== 1 ? 's' : ''})
                </span>
              )}
            </h3>
          </div>

          {/* Soul Cards */}
          <div className="grid gap-4 sm:gap-6 mb-6 sm:mb-8">
            {souls.map((soul, index) => (
              <div 
                key={index}
                className={`p-4 sm:p-6 rounded-lg border-2 cursor-pointer transition-all hover:scale-[1.01] ${
                  selectedSoul === soul
                    ? 'border-synapse bg-synapse/10 shadow-lg shadow-synapse/20'
                    : 'border-gray-600 hover:border-plasma/50'
                }`}
                onClick={() => handleSoulSelect(soul)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-xl sm:text-2xl">👻</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-white break-words">{renderValue(soul.agent_name)}</h3>
                      <p className="text-sm text-plasma font-medium">{renderValue(soul.role)}</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        <span className="text-xs text-gray-400">Tone: {renderValue(soul.tone)}</span>
                        <span className="text-xs text-blue-400">•</span>
                        <span className="text-xs text-gray-400">Emotion: {renderValue(soul.emotion)}</span>
                        <span className="text-xs text-green-400">•</span>
                        <span className="text-xs text-gray-400">Energy: {renderValue(soul.energy)}</span>
                      </div>
                    </div>
                  </div>
                  {selectedSoul === soul && (
                    <div className="w-6 h-6 bg-synapse rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                      <span className="text-white text-sm">✓</span>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <h4 className="text-plasma font-semibold mb-2">🎯 Purpose</h4>
                  <p className="text-gray-300 text-sm">{renderValue(soul.description)}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-yellow-400 font-semibold mb-2">💬 Communication Soul</h4>
                    <div className="text-sm text-gray-300 space-y-1">
                      <div><span className="text-synapse">Tone:</span> {renderValue(soul.tone, 'Not specified')}</div>
                      <div><span className="text-synapse">Emotion:</span> {renderValue(soul.emotion, 'Not specified')}</div>
                      <div><span className="text-synapse">Energy:</span> {renderValue(soul.energy, 'Not specified')}</div>
                      <div><span className="text-synapse">Expression Type:</span> {renderValue(soul.response_expression?.preferred_type, 'Not specified')}</div>
                      <div><span className="text-synapse">Format Instincts:</span> {renderValue(soul.response_expression?.format_bias, 'Not specified')}</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-green-400 font-semibold mb-2">🔄 Operational Behavior</h4>
                    <div className="text-sm text-gray-300 space-y-1">
                      <div><span className="text-synapse">Unknown Requests:</span> {renderValue(soul.stall_recovery_protocol, 'Bridge with principles')}</div>
                      <div><span className="text-synapse">Off-topic Handling:</span> {renderValue(soul.bad_input_response_style, 'Redirect adaptively')}</div>
                      <div><span className="text-synapse">Flexibility:</span> {renderValue(soul.response_expression?.adaptive_variance, 'Not specified')}</div>
                    </div>
                  </div>
                </div>

                {/* Bridging Strategy */}
                <div className="mb-4">
                  <h4 className="text-purple-400 font-semibold mb-2">🌉 Bridging Strategy</h4>
                  <p className="text-gray-300 text-sm">{renderValue(soul.bridging_strategy, 'Connects unfamiliar requests to known content')}</p>
                </div>

                {/* Content Boundaries */}
                {soul.content_boundaries && Array.isArray(soul.content_boundaries) && soul.content_boundaries.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-blue-400 font-semibold mb-2">📚 Knowledge Scope</h4>
                    <ul className="space-y-1">
                      {soul.content_boundaries.slice(0, 3).map((boundary, idx) => (
                        <li key={idx} className="text-xs text-gray-400 flex items-start">
                          <span className="text-blue-400 mr-2 flex-shrink-0">•</span>
                          <span>{renderValue(boundary)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Scope Limitations */}
                {soul.scope_limitations && Array.isArray(soul.scope_limitations) && soul.scope_limitations.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-red-400 font-semibold mb-2">🚫 Limitations</h4>
                    <ul className="space-y-1">
                      {soul.scope_limitations.slice(0, 3).map((limitation, idx) => (
                        <li key={idx} className="text-xs text-gray-400 flex items-start">
                          <span className="text-red-400 mr-2 flex-shrink-0">•</span>
                          <span>{renderValue(limitation)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Value Proposition */}
                <div className="bg-neural/30 rounded p-3">
                  <h4 className="text-orange-400 font-semibold mb-1 text-sm">💎 Agent Philosophy</h4>
                  <p className="text-xs text-gray-300 mb-2">{renderValue(soul.value_proposition)}</p>
                  <div className="text-xs text-gray-400">
                    <span className="text-orange-400">Never blocks requests</span> • Always bridges gaps • Expression drives form
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={handleRegenerate}
              className="flex-1 py-3 px-6 bg-void hover:bg-void/80 border border-gray-600 hover:border-synapse/50 rounded-lg font-semibold transition-all min-h-[48px]"
            >
              🔄 Generate New Souls
            </button>
            
            <button
              onClick={handleChooseSoul}
              disabled={!selectedSoul}
              className="flex-1 py-3 px-6 bg-gradient-to-r from-synapse to-plasma hover:from-synapse/80 hover:to-plasma/80 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-all transform hover:scale-105 disabled:hover:scale-100 min-h-[48px]"
            >
              ⚙️ Configure Behavior →
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default SoulGeneration