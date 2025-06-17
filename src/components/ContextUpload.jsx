import { useState } from 'react'

const SAMPLE_CONTEXTS = [
  {
    name: "AI Industry Update Video Transcript",
    type: "Video Transcript",
    domain: "AI Technology",
    content: "Transcript from latest AI developments video covering OpenAI's new models, Google's AI research updates, Microsoft's enterprise AI tools, regulatory discussions in EU, and startup funding trends. Key topics include model capabilities, pricing changes, ethical considerations, and market competition. Discusses technical breakthroughs, business applications, and future predictions for AI adoption across industries."
  },
  {
    name: "React.js Documentation", 
    type: "Technical Documentation",
    domain: "Web Development",
    content: "Official React documentation covering hooks, component patterns, state management, performance optimization, and best practices. Includes code examples, API references, migration guides, and troubleshooting common issues. Covers beginner to advanced concepts including custom hooks, context API, suspense, and concurrent features."
  },
  {
    name: "Marketing Strategy Workshop Notes",
    type: "Workshop Notes", 
    domain: "Digital Marketing",
    content: "Notes from 3-day marketing workshop covering customer acquisition strategies, conversion optimization, A/B testing methodologies, social media advertising, content marketing frameworks, and analytics interpretation. Includes case studies from successful campaigns, budget allocation strategies, and ROI measurement techniques."
  },
  {
    name: "Mental Health Research Findings",
    type: "Research Data",
    domain: "Psychology",
    content: "Research findings on anxiety patterns in Generation Z students. Key themes include social media comparison stress, academic pressure intensified by uncertain job markets, identity formation challenges in digital spaces, and emotional numbness as a coping mechanism. Many report feeling 'stuck between being told they're resilient and feeling completely overwhelmed.'"
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
          1️⃣ Input Any Domain Content
        </h2>
        <p className="text-gray-400">
          Upload any content to generate domain-specific conversational agents
        </p>
      </div>

      {/* Sample Contexts */}
      <div className="grid gap-4 mb-8">
        <h3 className="text-lg font-semibold text-plasma">Sample Content Types</h3>
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
        <h3 className="text-lg font-semibold text-plasma mb-4">Custom Content</h3>
        <textarea
          value={customContext}
          onChange={(e) => setCustomContext(e.target.value)}
          placeholder="Paste any content here... (video transcripts, documentation, articles, research, meeting notes, tutorials, etc.)"
          className="w-full h-40 p-4 bg-neural border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-synapse focus:outline-none transition-colors"
        />
        <p className="text-xs text-gray-500 mt-2">
          💡 Works with any domain: technical docs, business content, educational material, research, tutorials, etc.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => handleUpload(SAMPLE_CONTEXTS[selectedContext])}
          disabled={selectedContext === null || isProcessing}
          className="flex-1 py-3 px-6 bg-synapse hover:bg-synapse/80 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-all transform hover:scale-105 disabled:hover:scale-100"
        >
          {isProcessing ? '🧠 Analyzing...' : '🧠 Use Sample Content'}
        </button>
        
        <button
          onClick={() => handleUpload({ content: customContext })}
          disabled={!customContext.trim() || isProcessing}
          className="flex-1 py-3 px-6 bg-plasma hover:bg-plasma/80 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-all transform hover:scale-105 disabled:hover:scale-100"
        >
          {isProcessing ? '🧠 Analyzing...' : '👻 Upload Custom'}
        </button>
      </div>

      {isProcessing && (
        <div className="mt-6 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-synapse"></div>
          <p className="text-gray-400 mt-2">Analyzing content for agent opportunities...</p>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 p-4 bg-neural/30 rounded-lg border border-gray-700">
        <h4 className="text-yellow-400 font-semibold mb-2 text-sm">💡 What Content Works?</h4>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>• <span className="text-green-400">Rich content</span> - Detailed information users would want to interact with</li>
          <li>• <span className="text-blue-400">Any domain</span> - Tech, business, education, research, entertainment, etc.</li>
          <li>• <span className="text-purple-400">Conversational potential</span> - Content people would ask questions about</li>
          <li>• <span className="text-yellow-400">Examples:</span> Video transcripts, docs, tutorials, research, meeting notes</li>
        </ul>
      </div>
    </div>
  )
}

export default ContextUpload