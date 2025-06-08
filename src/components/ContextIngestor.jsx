import { useState } from 'react'

const SAMPLE_CONTEXTS = [
  {
    name: "Cybersecurity Operations Manual",
    type: "PDF",
    domain: "Security",
    content: "Manual from emerging market fintech ops team covering threat detection, incident response, and SOPs for 24/7 monitoring with limited human resources."
  },
  {
    name: "Healthcare AI Research Transcripts", 
    type: "YouTube",
    domain: "MedTech",
    content: "Series of interviews with radiologists discussing AI integration challenges, regulatory hurdles, and workflow optimization in resource-constrained hospitals."
  },
  {
    name: "Supply Chain Blog Series",
    type: "Blog",
    domain: "Logistics", 
    content: "Deep dive into last-mile delivery problems in Southeast Asia, focusing on infrastructure gaps, driver shortage, and inventory management inefficiencies."
  }
]

function ContextIngestor({ onComplete }) {
  const [selectedContext, setSelectedContext] = useState(null)
  const [customContext, setCustomContext] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleIngest = async (context) => {
    setIsProcessing(true)
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
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
      <h2 className="text-2xl font-bold text-synapse mb-6">
        🔮 Domain Context Upload
      </h2>
      
      <p className="text-gray-300 mb-8">
        Feed the machine raw domain knowledge. PDFs, transcripts, blogs - anything with founder-relevant pain points.
      </p>

      {/* Sample Contexts */}
      <div className="grid gap-4 mb-8">
        <h3 className="text-lg font-semibold text-plasma">Sample Contexts</h3>
        {SAMPLE_CONTEXTS.map((context, index) => (
          <div 
            key={index}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-105
              ${selectedContext === index 
                ? 'border-synapse bg-synapse/10' 
                : 'border-gray-600 hover:border-plasma/50'}`}
            onClick={() => setSelectedContext(index)}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-white">{context.name}</h4>
              <span className="text-xs px-2 py-1 bg-plasma/20 text-plasma rounded">
                {context.type}
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-2">{context.content}</p>
            <div className="text-xs text-synapse">Domain: {context.domain}</div>
          </div>
        ))}
      </div>

      {/* Custom Input */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-plasma mb-4">Custom Context</h3>
        <textarea
          value={customContext}
          onChange={(e) => setCustomContext(e.target.value)}
          placeholder="Paste your domain knowledge here... (research papers, industry reports, expert interviews, etc.)"
          className="w-full h-32 p-4 bg-neural border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-synapse focus:outline-none"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => handleIngest(SAMPLE_CONTEXTS[selectedContext])}
          disabled={selectedContext === null || isProcessing}
          className="flex-1 py-3 px-6 bg-synapse hover:bg-synapse/80 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
        >
          {isProcessing ? '🔄 Ingesting...' : '⚡ Ingest Sample'}
        </button>
        
        <button
          onClick={() => handleIngest({ content: customContext })}
          disabled={!customContext.trim() || isProcessing}
          className="flex-1 py-3 px-6 bg-plasma hover:bg-plasma/80 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
        >
          {isProcessing ? '🔄 Processing...' : '🚀 Ingest Custom'}
        </button>
      </div>

      {isProcessing && (
        <div className="mt-6 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-synapse"></div>
          <p className="text-gray-400 mt-2">Extracting neural patterns...</p>
        </div>
      )}
    </div>
  )
}

export default ContextIngestor