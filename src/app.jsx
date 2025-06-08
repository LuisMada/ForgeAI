import { useState } from 'react'
import ContextIngestor from './components/ContextIngestor'
import KnowledgeProcessor from './components/KnowledgeProcessor'
import AgentGenerator from './components/AgentGenerator'
import StartupSimulator from './components/StartupSimulator'
import AgentExport from './components/AgentExport'

const STAGES = {
  INGEST: 'ingest',
  PROCESS: 'process', 
  GENERATE: 'generate',
  SIMULATE: 'simulate',
  EXPORT: 'export'
}

function App() {
  const [currentStage, setCurrentStage] = useState(STAGES.INGEST)
  const [domainContext, setDomainContext] = useState(null)
  const [processedKnowledge, setProcessedKnowledge] = useState(null)
  const [generatedAgent, setGeneratedAgent] = useState(null)
  const [simulationResults, setSimulationResults] = useState(null)

  const progressToNext = (data) => {
    const stages = Object.values(STAGES)
    const currentIndex = stages.indexOf(currentStage)
    
    switch(currentStage) {
      case STAGES.INGEST:
        setDomainContext(data)
        setCurrentStage(STAGES.PROCESS)
        break
      case STAGES.PROCESS:
        setProcessedKnowledge(data)
        setCurrentStage(STAGES.GENERATE)
        break
      case STAGES.GENERATE:
        setGeneratedAgent(data)
        setCurrentStage(STAGES.SIMULATE)
        break
      case STAGES.SIMULATE:
        setSimulationResults(data)
        setCurrentStage(STAGES.EXPORT)
        break
    }
  }

  const resetFlow = () => {
    setCurrentStage(STAGES.INGEST)
    setDomainContext(null)
    setProcessedKnowledge(null)
    setGeneratedAgent(null)
    setSimulationResults(null)
  }

  const renderCurrentStage = () => {
    switch(currentStage) {
      case STAGES.INGEST:
        return <ContextIngestor onComplete={progressToNext} />
      case STAGES.PROCESS:
        return <KnowledgeProcessor context={domainContext} onComplete={progressToNext} />
      case STAGES.GENERATE:
        return <AgentGenerator knowledge={processedKnowledge} onComplete={progressToNext} />
      case STAGES.SIMULATE:
        return <StartupSimulator agent={generatedAgent} onComplete={progressToNext} />
      case STAGES.EXPORT:
        return <AgentExport 
          agent={generatedAgent} 
          simulation={simulationResults} 
          onReset={resetFlow}
        />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neural via-void to-neural p-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-synapse to-plasma bg-clip-text text-transparent mb-4">
            AI COFOUNDER FORGE
          </h1>
          <p className="text-gray-400 text-lg">
            Transmute domain knowledge into evolving intelligence
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            {Object.values(STAGES).map((stage, index) => (
              <div key={stage} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold
                  ${Object.values(STAGES).indexOf(currentStage) >= index 
                    ? 'bg-synapse text-white' 
                    : 'bg-gray-700 text-gray-400'}`}>
                  {index + 1}
                </div>
                {index < Object.values(STAGES).length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 
                    ${Object.values(STAGES).indexOf(currentStage) > index 
                      ? 'bg-synapse' 
                      : 'bg-gray-700'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center text-sm text-gray-400 capitalize">
            {currentStage.replace('_', ' ')} Phase
          </div>
        </div>

        {/* Current Stage Component */}
        <div className="animate-neural-fire">
          {renderCurrentStage()}
        </div>

      </div>
    </div>
  )
}

export default App