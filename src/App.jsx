import { useState } from 'react'
import ContextUpload from './components/ContextUpload.jsx'
import ContextCompression from './components/ContextCompression.jsx'
import SoulGeneration from './components/SoulGeneration.jsx'
import BehaviorRuleset from './components/BehaviorRuleset.jsx'
import AgentInterface from './components/AgentInterface.jsx'

const STAGES = {
  UPLOAD: 'upload',
  COMPRESS: 'compress',
  GENERATE: 'generate',
  CONFIGURE: 'configure', 
  DEPLOY: 'deploy'
}

function App() {
  const [currentStage, setCurrentStage] = useState(STAGES.UPLOAD)
  const [contextRaw, setContextRaw] = useState(null)
  const [compressedContext, setCompressedContext] = useState(null)
  const [availableSouls, setAvailableSouls] = useState([])
  const [chosenSoul, setChosenSoul] = useState(null)
  const [behaviorConfig, setBehaviorConfig] = useState(null)

  const progressToNext = (data) => {
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
        setChosenSoul(data)
        setCurrentStage(STAGES.CONFIGURE)
        break
      case STAGES.CONFIGURE:
        setBehaviorConfig(data)
        setCurrentStage(STAGES.DEPLOY)
        break
    }
  }

  const handleSoulsGenerated = (souls) => {
    setAvailableSouls(souls)
  }

  const resetFlow = () => {
    setCurrentStage(STAGES.UPLOAD)
    setContextRaw(null)
    setCompressedContext(null)
    setAvailableSouls([])
    setChosenSoul(null)
    setBehaviorConfig(null)
  }

  const renderCurrentStage = () => {
    switch(currentStage) {
      case STAGES.UPLOAD:
        return <ContextUpload onComplete={progressToNext} />
      case STAGES.COMPRESS:
        return <ContextCompression contextRaw={contextRaw} onComplete={progressToNext} />
      case STAGES.GENERATE:
        return (
          <SoulGeneration 
            compressedContext={compressedContext}
            onSoulsGenerated={handleSoulsGenerated}
            onSoulChosen={progressToNext}
          />
        )
      case STAGES.CONFIGURE:
        return (
          <BehaviorRuleset 
            compressedContext={compressedContext}
            chosenSoul={chosenSoul}
            onComplete={progressToNext}
          />
        )
      case STAGES.DEPLOY:
        return (
          <AgentInterface 
            soul={chosenSoul}
            behaviorConfig={behaviorConfig}
            compressedContext={compressedContext}
            originalContent={contextRaw}
            onReset={resetFlow}
          />
        )
      default:
        return null
    }
  }

  const stageNames = {
    [STAGES.UPLOAD]: 'Input',
    [STAGES.COMPRESS]: 'Extract', 
    [STAGES.GENERATE]: 'Generate',
    [STAGES.CONFIGURE]: 'Configure',
    [STAGES.DEPLOY]: 'Deploy'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neural via-void to-neural">
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold bg-gradient-to-r from-synapse to-plasma bg-clip-text text-transparent mb-3 sm:mb-4">
            Durinthal
          </h1>
          <p className="text-gray-400 text-base sm:text-lg px-4">
            Role Agent Product System
          </p>
          <p className="text-gray-500 text-sm px-4 mt-2">
            Transform domain content into emotionally bounded conversational agents
          </p>
        </div>

        {/* Progress Flow */}
        <div className="mb-6 sm:mb-8">
          <div className="flex justify-between items-center mb-2 px-2">
            {Object.values(STAGES).map((stage, index) => (
              <div key={stage} className="flex items-center">
                <div className={`w-8 sm:w-10 h-8 sm:h-10 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-300
                  ${Object.values(STAGES).indexOf(currentStage) >= index 
                    ? 'bg-synapse text-white shadow-lg shadow-synapse/30' 
                    : 'bg-gray-700 text-gray-400'}`}>
                  {index + 1}
                </div>
                {index < Object.values(STAGES).length - 1 && (
                  <div className={`w-6 sm:w-12 h-0.5 mx-1 sm:mx-2 transition-colors duration-300
                    ${Object.values(STAGES).indexOf(currentStage) > index 
                      ? 'bg-synapse shadow-sm shadow-synapse/30' 
                      : 'bg-gray-700'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center text-xs sm:text-sm text-gray-400">
            {stageNames[currentStage]} Phase
          </div>
        </div>

        {/* Current Stage Component */}
        <div className="w-full">
          {renderCurrentStage()}
        </div>

      </div>
    </div>
  )
}

export default App