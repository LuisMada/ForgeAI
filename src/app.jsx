import { useState } from 'react'
import ContextUpload from './components/ContextUpload.jsx'
import ContextCompression from './components/ContextCompression.jsx'
import AgentGeneration from './components/AgentGeneration.jsx'
import AgentSoulDerivation from './components/AgentSoulDerivation.jsx'
import AgentInterface from './components/AgentInterface.jsx'

const STAGES = {
  UPLOAD: 'upload',
  COMPRESS: 'compress',
  GENERATE: 'generate', 
  DERIVE: 'derive',
  INTERFACE: 'interface'
}

function App() {
  const [currentStage, setCurrentStage] = useState(STAGES.UPLOAD)
  const [contextRaw, setContextRaw] = useState(null)
  const [compressedContext, setCompressedContext] = useState(null)
  const [agentCandidates, setAgentCandidates] = useState([])
  const [chosenAgent, setChosenAgent] = useState(null)
  const [agentSoul, setAgentSoul] = useState(null)

  const progressToNext = (data, targetStage) => {
    switch(currentStage) {
      case STAGES.UPLOAD:
        setContextRaw(data)
        setCurrentStage(STAGES.COMPRESS)
        break
      case STAGES.COMPRESS:
        setCompressedContext(data)
        setCurrentStage(STAGES.GENERATE)
        break
      case STAGES.GENERATE:
        setChosenAgent(data)
        setCurrentStage(STAGES.DERIVE)
        break
      case STAGES.DERIVE:
        setAgentSoul(data)
        setCurrentStage(STAGES.INTERFACE)
        break
    }
  }

  const setAgents = (agents) => {
    setAgentCandidates(agents)
  }

  const resetFlow = () => {
    setCurrentStage(STAGES.UPLOAD)
    setContextRaw(null)
    setCompressedContext(null)
    setAgentCandidates([])
    setChosenAgent(null)
    setAgentSoul(null)
  }

  const renderCurrentStage = () => {
    switch(currentStage) {
      case STAGES.UPLOAD:
        return <ContextUpload onComplete={progressToNext} />
      case STAGES.COMPRESS:
        return <ContextCompression contextRaw={contextRaw} onComplete={progressToNext} />
      case STAGES.GENERATE:
        return <AgentGeneration 
          compressedContext={compressedContext} 
          onAgentsGenerated={setAgents}
          onAgentChosen={progressToNext} 
        />
      case STAGES.DERIVE:
        return <AgentSoulDerivation 
          compressedContext={compressedContext}
          chosenAgent={chosenAgent} 
          onComplete={progressToNext} 
        />
      case STAGES.INTERFACE:
        return <AgentInterface 
          agent={chosenAgent}
          soul={agentSoul}
          onReset={resetFlow}
        />
      default:
        return null
    }
  }

  const stageNames = {
    [STAGES.UPLOAD]: 'Upload',
    [STAGES.COMPRESS]: 'Compress', 
    [STAGES.GENERATE]: 'Generate',
    [STAGES.DERIVE]: 'Derive',
    [STAGES.INTERFACE]: 'Interface'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neural via-void to-neural">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-synapse to-plasma bg-clip-text text-transparent mb-4">
            Durinthal
          </h1>
          <p className="text-gray-400 text-lg">
            Transform knowledge into autonomous founder minds
          </p>
        </div>

        {/* Progress Flow */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            {Object.values(STAGES).map((stage, index) => (
              <div key={stage} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300
                  ${Object.values(STAGES).indexOf(currentStage) >= index 
                    ? 'bg-synapse text-white shadow-lg shadow-synapse/30' 
                    : 'bg-gray-700 text-gray-400'}`}>
                  {index + 1}
                </div>
                {index < Object.values(STAGES).length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 transition-colors duration-300
                    ${Object.values(STAGES).indexOf(currentStage) > index 
                      ? 'bg-synapse shadow-sm shadow-synapse/30' 
                      : 'bg-gray-700'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center text-sm text-gray-400">
            {stageNames[currentStage]} Phase
          </div>
        </div>

        {/* Current Stage Component - Stable Container */}
        <div className="w-full">
          {renderCurrentStage()}
        </div>

      </div>
    </div>
  )
}

export default App