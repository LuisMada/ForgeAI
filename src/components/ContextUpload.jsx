import { useState } from 'react'

const SAMPLE_CONTEXTS = [
  {
    name: "Healthcare Workflow Documentation",
    type: "Internal Docs",
    domain: "Healthcare Operations",
    content: "Documentation of patient intake processes, nurse scheduling conflicts, insurance verification bottlenecks, and electronic health record inefficiencies across 3 hospitals. Notable pain points include 40% of nurses spending 2+ hours daily on administrative tasks, insurance verification taking 24-72 hours causing treatment delays, and patient data scattered across 7 different systems requiring manual reconciliation."
  },
  {
    name: "Supply Chain Analysis Report", 
    type: "Research",
    domain: "Logistics & Manufacturing",
    content: "Analysis of last-mile delivery challenges in urban environments, focusing on driver shortage (15% increase in turnover), inventory management failures (23% of items overstocked while 18% understocked), and real-time tracking limitations. Key finding: manual dispatch routing wastes 35% of delivery capacity, and customer communication gaps lead to 28% failed first-delivery attempts."
  },
  {
    name: "Financial Services Compliance Notes",
    type: "Meeting Transcripts",
    domain: "FinTech Regulatory",
    content: "Notes from compliance meetings discussing KYC verification delays (average 3-5 business days), manual AML screening processes requiring 4 FTE resources, and regulatory reporting consuming 60+ hours monthly per compliance officer. Major friction: customer onboarding drops 45% after day 2 due to verification delays, and audit preparation requires 200+ man-hours quarterly."
  }
]

function ContextUpload({ onComplete }) {
  const [selectedContext, setSelectedContext] = useState(null)
  const [customContext, setCustomContext] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleUpload = async (context) => {
    setIsProcessing(true)
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const contextData = {
      source: context.name || 'Custom Input',
      type: context.type || 'Text',
      domain: context.domain || 'Unknown',
      content: context.content || customContext,
      timestamp: new Date().toISOString(),
      wordCount: (context.content || customContext).split(' ').length
    }
    
    setIsProcessing(false)
    onComplete(contextData)
  }

  return (
    <div className="void-panel neural-glow">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-synapse mb-2">
          Step 1: Feed the Forge
        </h2>
        <p className="text-gray-400">
          Upload domain knowledge to extract startup intelligence
        </p>
      </div>

      {/* Sample Contexts */}
      <div className="grid gap-4 mb-8">
        <h3 className="text-lg font-semibold text-plasma">Sample Contexts</h3>
        {SAMPLE_CONTEXTS.map((context, index) => (
          <div 
            key={index}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-[1.02]
              ${selectedContext === index 
                ? 'border-synapse bg-synapse/10 shadow-lg shadow-synapse/20' 
                : 'border-gray-600 hover:border-plasma/50'}`}
            onClick={() => setSelectedContext(index)}
          >
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-semibold text-white text-lg">{context.name}</h4>
              <span className="text-xs px-3 py-1 bg-plasma/20 text-plasma rounded-full">
                {context.type}
              </span>
            </div>
            <p className="text-sm text-gray-300 mb-3 leading-relaxed">{context.content}</p>
            <div className="text-xs text-synapse font-medium">
              Domain: {context.domain}
            </div>
          </div>
        ))}
      </div>

      {/* Custom Input */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-plasma mb-4">Custom Context</h3>
        <textarea
          value={customContext}
          onChange={(e) => setCustomContext(e.target.value)}
          placeholder="Paste your domain knowledge here... (research, docs, transcripts, reports, etc.)"
          className="w-full h-40 p-4 bg-neural border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-synapse focus:outline-none transition-colors"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => handleUpload(SAMPLE_CONTEXTS[selectedContext])}
          disabled={selectedContext === null || isProcessing}
          className="flex-1 py-3 px-6 bg-synapse hover:bg-synapse/80 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-all transform hover:scale-105 disabled:hover:scale-100"
        >
          {isProcessing ? '⚡ Processing...' : '⚡ Use Sample Context'}
        </button>
        
        <button
          onClick={() => handleUpload({ content: customContext })}
          disabled={!customContext.trim() || isProcessing}
          className="flex-1 py-3 px-6 bg-plasma hover:bg-plasma/80 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-all transform hover:scale-105 disabled:hover:scale-100"
        >
          {isProcessing ? '⚡ Processing...' : '🚀 Upload Custom'}
        </button>
      </div>

      {isProcessing && (
        <div className="mt-6 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-synapse"></div>
          <p className="text-gray-400 mt-2">Feeding the forge...</p>
        </div>
      )}
    </div>
  )
}

export default ContextUpload