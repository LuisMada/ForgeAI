// src/components/SoulNudging.jsx
import { useState } from 'react'
import { generateConversationalResponse } from '../services/openai'

function SoulNudging({ onNudgesUpdate, onGenerateRequested, initialNudges = [] }) {
  const [currentInput, setCurrentInput] = useState('')
  const [accumulatedNudges, setAccumulatedNudges] = useState(initialNudges)
  const [isProcessing, setIsProcessing] = useState(false)
  const [lastResponse, setLastResponse] = useState('')
  const [isWaitingForGeneration, setIsWaitingForGeneration] = useState(false)

  const handleSubmitNudge = async (e) => {
    e.preventDefault()
    if (!currentInput.trim() || isProcessing) return

    setIsProcessing(true)
    
    try {
      // Use OpenAI to generate a conversational response and extract guidance
      const result = await generateConversationalResponse(currentInput.trim(), accumulatedNudges)
      
      // Check if this is a generation request or intent
      if (result.shouldGenerate) {
        setLastResponse(result.response)
        setIsWaitingForGeneration(true)
        setCurrentInput('')
        setIsProcessing(false)
        return
      }

      // Handle confirmation of generation
      if (isWaitingForGeneration && (currentInput.toLowerCase().includes('yes') || currentInput.toLowerCase().includes('generate') || currentInput.toLowerCase().includes('go'))) {
        onGenerateRequested(accumulatedNudges)
        setIsWaitingForGeneration(false)
        setLastResponse("Perfect! Generating your souls now...")
        setCurrentInput('')
        setIsProcessing(false)
        return
      }

      // Handle regular nudge
      const processedNudge = {
        id: Date.now(),
        original: currentInput.trim(),
        guidance: result.guidance,
        type: result.type,
        timestamp: new Date().toISOString()
      }

      const newAccumulatedNudges = [...accumulatedNudges, processedNudge]
      setAccumulatedNudges(newAccumulatedNudges)
      onNudgesUpdate(newAccumulatedNudges)
      setLastResponse(result.response)
      setCurrentInput('')
      
    } catch (error) {
      console.error('Nudge processing error:', error)
      setLastResponse("Got it! I'll incorporate that into the soul generation.")
    }
    
    setIsProcessing(false)
  }

  const clearAllNudges = () => {
    setAccumulatedNudges([])
    onNudgesUpdate([])
    setLastResponse('')
    setIsWaitingForGeneration(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmitNudge(e)
    }
  }

  return (
    <div className="mb-6">
      {/* Simple Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-plasma mb-2">
          🎯 Guide Soul Creation
        </h3>
        <p className="text-gray-400 text-sm">
          Tell me how you want the agents to communicate or behave
        </p>
      </div>

      {/* Clear All Button (only show if we have nudges) */}
      {accumulatedNudges.length > 0 && (
        <div className="mb-4 flex justify-end">
          <button
            onClick={clearAllNudges}
            className="text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            Clear All Guidance
          </button>
        </div>
      )}

      {/* System Response */}
      {lastResponse && (
        <div className="mb-4 p-3 bg-plasma/10 border border-plasma/30 rounded-lg">
          <div className="flex items-start gap-2">
            <span className="text-plasma text-sm">🤖</span>
            <p className="text-gray-300 text-sm">{lastResponse}</p>
          </div>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSubmitNudge} className="flex gap-3">
        <textarea
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={
            isWaitingForGeneration 
              ? "Type 'yes' or 'generate' to proceed, or give me more guidance..."
              : "Hey, make them more analytical... or like a mentor figure... whatever you want..."
          }
          className="flex-1 p-3 bg-neural border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-synapse focus:outline-none resize-none text-sm"
          rows="2"
          disabled={isProcessing}
        />
        <button
          type="submit"
          disabled={!currentInput.trim() || isProcessing}
          className="px-4 py-2 bg-plasma hover:bg-plasma/80 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-all self-end"
        >
          {isProcessing ? '⚡' : '💫'}
        </button>
      </form>
    </div>
  )
}

export default SoulNudging
