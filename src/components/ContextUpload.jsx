import { useState } from 'react'

const SAMPLE_CONTEXTS = [
  {
    name: "AI Industry Update Video Transcript",
    type: "Video Transcript",
    domain: "AI Technology",
    content: "Transcript from latest AI developments video covering OpenAI's new models, Google's AI research updates, Microsoft's enterprise AI tools, regulatory discussions in EU, and startup funding trends. Key topics include model capabilities, pricing changes, ethical considerations, and market competition. Discusses technical breakthroughs, business applications, and future predictions for AI adoption across industries."
  }
]

function ContextUpload({ onComplete }) {
  const [selectedContext, setSelectedContext] = useState(null)
  const [customContext, setCustomContext] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadStatus, setUploadStatus] = useState(null)

  const handleFileUpload = async (file) => {
    const fileName = file.name.toLowerCase()
    
    try {
      setIsProcessing(true)
      setUploadStatus(`Processing ${file.name}...`)
      
      let content = ''
      let type = 'Document'

      if (fileName.endsWith('.txt')) {
        content = await file.text()
        type = 'Text File'
      } else if (fileName.endsWith('.pdf')) {
        // Simple PDF text extraction using local worker
        const pdfjsLib = await import('pdfjs-dist')
        
        // Use the worker from the installed package
        pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
          'pdfjs-dist/build/pdf.worker.min.mjs',
          import.meta.url
        ).toString()
        
        const arrayBuffer = await file.arrayBuffer()
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const textContent = await page.getTextContent()
          const pageText = textContent.items.map(item => item.str).join(' ')
          content += pageText + '\n'
        }
        type = 'PDF Document'
      } else {
        throw new Error('Only PDF and TXT files are supported')
      }

      const contextData = {
        source: file.name,
        type: type,
        domain: 'Unknown',
        content: content,
        timestamp: new Date().toISOString(),
        wordCount: content.split(' ').length
      }
      
      setIsProcessing(false)
      setUploadStatus(null)
      onComplete(contextData)
      
    } catch (error) {
      setIsProcessing(false)
      setUploadStatus(`Error: ${error.message}`)
      setTimeout(() => setUploadStatus(null), 3000)
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleUpload = async (context) => {
    setIsProcessing(true)
    
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
          Upload files or paste text to generate domain-specific conversational agents
        </p>
      </div>

      {/* Simple File Upload */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-plasma mb-4">File Upload</h3>
        
        <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
          <input
            type="file"
            accept=".pdf,.txt"
            onChange={handleFileSelect}
            className="hidden"
            id="file-input"
            disabled={isProcessing}
          />
          
          <label htmlFor="file-input" className="cursor-pointer">
            <div className="text-4xl mb-4">📁</div>
            <p className="text-lg font-semibold text-white mb-2">
              Upload Document
            </p>
            <p className="text-sm text-gray-400">
              PDF or TXT files only
            </p>
          </label>
        </div>

        {uploadStatus && (
          <div className="mt-4 p-3 bg-neural/50 rounded border border-gray-600">
            <p className="text-sm text-gray-300">{uploadStatus}</p>
          </div>
        )}
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
        <h3 className="text-lg font-semibold text-plasma mb-4">Custom Text Content</h3>
        <textarea
          value={customContext}
          onChange={(e) => setCustomContext(e.target.value)}
          placeholder="Paste any text content here..."
          className="w-full h-40 p-4 bg-neural border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-synapse focus:outline-none transition-colors"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => handleUpload(SAMPLE_CONTEXTS[selectedContext])}
          disabled={selectedContext === null || isProcessing}
          className="flex-1 py-3 px-6 bg-synapse hover:bg-synapse/80 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-all"
        >
          {isProcessing ? '🧠 Processing...' : '🧠 Use Sample'}
        </button>
        
        <button
          onClick={() => handleUpload({ content: customContext })}
          disabled={!customContext.trim() || isProcessing}
          className="flex-1 py-3 px-6 bg-plasma hover:bg-plasma/80 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-all"
        >
          {isProcessing ? '🧠 Processing...' : '👻 Upload Text'}
        </button>
      </div>

      {isProcessing && (
        <div className="mt-6 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-synapse"></div>
          <p className="text-gray-400 mt-2">Processing content...</p>
        </div>
      )}
    </div>
  )
}

export default ContextUpload