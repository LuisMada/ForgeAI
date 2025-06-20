import { useState, useRef, useEffect } from 'react'
import { chatWithSoul } from '../services/openai'
import { exportToOkPo } from '../services/okpo'

function AgentInterface({ soul, behaviorConfig, compressedContext, originalContent, onReset }) {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [stats, setStats] = useState({ interactions: 0, avgResponseTime: 0 })
  const [showSystemPrompt, setShowSystemPrompt] = useState(false)
  const [okpoExport, setOkpoExport] = useState({ status: 'idle', data: null, error: null })
  const messagesEndRef = useRef(null)

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

  // Initial greeting with authentic soul-driven personality
  useEffect(() => {
    const agentName = renderValue(behaviorConfig?.deployment_config?.agent_name, 'AI Agent')
    const domain = renderValue(compressedContext?.domain, 'this domain')
    
    // Use AI-generated witty greeting or fallback
    const greeting = renderValue(
      behaviorConfig?.deployment_config?.witty_greeting, 
      `I'm ${agentName}. Let's work on ${domain} together.`
    )

    setMessages([{
      role: 'agent',
      content: greeting,
      timestamp: new Date().toISOString()
    }])
  }, [soul, behaviorConfig, compressedContext])

  useEffect(() => {
    // Only scroll for the initial greeting message
    if (messages.length === 1) {
      scrollToBottom()
    }
  }, [messages])

  const scrollToBottom = () => {
    // Use a small delay to ensure DOM has updated
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })
    }, 100)
  }

  const handleSendMessage = async (e) => {
    // Prevent default form submission if this is triggered by a form
    if (e) {
      e.preventDefault()
    }
    
    if (!inputMessage.trim() || isThinking) return

    const startTime = Date.now()
    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsThinking(true)

    try {
      const conversationHistory = [...messages, userMessage]
      const agentResponse = await chatWithSoul(soul, behaviorConfig, compressedContext, conversationHistory, inputMessage, originalContent.content)
      
      const responseTime = Date.now() - startTime
      
      const agentMessage = {
        role: 'agent',
        content: agentResponse,
        timestamp: new Date().toISOString(),
        responseTime
      }

      setMessages(prev => [...prev, agentMessage])
      
      // Update stats
      setStats(prev => ({
        interactions: prev.interactions + 1,
        avgResponseTime: Math.round((prev.avgResponseTime * prev.interactions + responseTime) / (prev.interactions + 1))
      }))

    } catch (error) {
      console.error('Agent communication error:', error)
      const errorMessage = {
        role: 'agent',
        content: "I apologize, but I'm having trouble processing that right now. Could you try rephrasing your message?",
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorMessage])
    }

    setIsThinking(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault() // Prevent default behavior
      handleSendMessage(e) // Pass the event to handleSendMessage
    }
  }

  const handleOkPoExport = async () => {
    setOkpoExport({ status: 'loading', data: null, error: null })

    try {
      const result = await exportToOkPo(soul, behaviorConfig, compressedContext, originalContent)
      
      setOkpoExport({ 
        status: 'success', 
        data: result, 
        error: null 
      })
    } catch (error) {
      setOkpoExport({ 
        status: 'error', 
        data: null, 
        error: error.message 
      })
    }
  }

  const handleRetryExport = () => {
    setOkpoExport({ status: 'idle', data: null, error: null })
  }

  const exportConversation = () => {
    const conversationData = {
      agent_name: renderValue(behaviorConfig?.deployment_config?.agent_name),
      agent_role: renderValue(behaviorConfig?.deployment_config?.role),
      domain: renderValue(compressedContext?.domain),
      session_stats: stats,
      conversation: messages,
      exported_at: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(conversationData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${renderValue(behaviorConfig?.deployment_config?.agent_name, 'agent').toLowerCase().replace(/\s+/g, '-')}-conversation.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const agentName = renderValue(behaviorConfig?.deployment_config?.agent_name, 'AI Agent')
  const agentRole = renderValue(behaviorConfig?.deployment_config?.role, 'AI Assistant')
  const domain = renderValue(compressedContext?.domain, 'Unknown Domain')
  const tone = renderValue(soul?.tone, 'helpful')
  
  // Safe access to user question starters
  const userQuestionStarters = behaviorConfig?.deployment_config?.user_question_starters || []
  const quickStarters = Array.isArray(userQuestionStarters) ? userQuestionStarters.slice(0, 4) : []

  return (
    <div className="void-panel neural-glow">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-synapse mb-1">
            5️⃣ {agentName}
          </h2>
          <p className="text-gray-400 text-sm">
            {agentRole} • {tone} tone • {stats.interactions} interactions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-sm">ACTIVE</span>
        </div>
      </div>

      {/* Agent Profile Card */}
      <div className="bg-gradient-to-r from-synapse/10 to-plasma/10 border border-synapse/30 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-synapse font-semibold">Domain:</span>
            <p className="text-gray-300">{domain}</p>
          </div>
          <div>
            <span className="text-plasma font-semibold">Specialization:</span>
            <p className="text-gray-300">{renderValue(soul?.specialization, 'General assistance')}</p>
          </div>
          <div>
            <span className="text-yellow-400 font-semibold">Content Source:</span>
            <p className="text-gray-300">{renderValue(originalContent?.source, 'Unknown')}</p>
          </div>
          <div>
            <span className="text-purple-400 font-semibold">Content Words:</span>
            <p className="text-gray-300">{renderValue(originalContent?.wordCount, 'N/A')}</p>
          </div>
        </div>
        
        {/* System Prompt Viewer Toggle */}
        <div className="mt-4 pt-4 border-t border-gray-600">
          <button
            onClick={() => setShowSystemPrompt(!showSystemPrompt)}
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
            {showSystemPrompt ? '🔽 Hide System Prompt' : '🔍 View System Prompt'}
          </button>
        </div>
      </div>

      {/* System Prompt Viewer */}
      {showSystemPrompt && (
        <div className="bg-gray-900 border border-gray-600 rounded-lg p-4 mb-6">
          <h4 className="text-blue-400 font-semibold mb-3 text-sm">🔍 System Prompt</h4>
          <div className="bg-black p-3 rounded text-xs text-green-400 font-mono max-h-60 overflow-y-auto whitespace-pre-wrap">
            {renderValue(behaviorConfig?.deployment_config?.system_prompt, 'No system prompt available')}
          </div>
          <div className="mt-3 text-xs text-gray-500">
            This is the exact prompt that defines your agent's behavior and knowledge boundaries.
          </div>
        </div>
      )}

      {/* OkPo Export Status */}
      {okpoExport.status !== 'idle' && (
        <div className="mb-6">
          {okpoExport.status === 'loading' && (
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
                <div>
                  <h4 className="text-blue-400 font-semibold">🚀 Deploying to OkPo...</h4>
                  <p className="text-gray-400 text-sm">Creating your live conversational agent</p>
                </div>
              </div>
            </div>
          )}

          {okpoExport.status === 'success' && (
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
              <h4 className="text-green-400 font-semibold mb-3">✅ Agent Successfully Deployed!</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-300 text-sm mb-2">Your agent is now live and ready to chat:</p>
                  <a 
                    href={`https://${okpoExport.data.agent.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white font-semibold transition-colors"
                  >
                    🌐 Open Live Agent
                  </a>
                </div>
                
                <div className="bg-gray-800 p-3 rounded">
                  <p className="text-xs text-gray-400 mb-1">Share URL:</p>
                  <p className="text-green-400 text-sm font-mono break-all">
                    https://{okpoExport.data.agent.url}
                  </p>
                </div>

                {okpoExport.data.test?.success && (
                  <div className="bg-gray-800 p-3 rounded">
                    <p className="text-xs text-gray-400 mb-2">✅ Agent Test Successful:</p>
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-blue-400">Test Message:</span>
                        <p className="text-gray-300 ml-2">"{okpoExport.data.test.testMessage}"</p>
                      </div>
                      <div>
                        <span className="text-green-400">Agent Response:</span>
                        <p className="text-gray-300 ml-2">"{okpoExport.data.test.response}"</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {okpoExport.status === 'error' && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
              <h4 className="text-red-400 font-semibold mb-2">❌ Export Failed</h4>
              <p className="text-gray-300 text-sm mb-3">{okpoExport.error}</p>
              <div className="flex gap-2">
                <button
                  onClick={handleRetryExport}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white text-sm transition-colors"
                >
                  🔄 Retry
                </button>
                <button
                  onClick={handleRetryExport}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white text-sm transition-colors"
                >
                  ❌ Dismiss
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Chat Messages */}
      <div className="bg-neural/50 rounded-lg border border-gray-600 mb-4" style={{ height: window.innerWidth < 768 ? '300px' : '400px' }}>
        <div className="h-full overflow-y-auto p-3 sm:p-4 space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] sm:max-w-3xl p-3 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-synapse text-white' 
                  : 'bg-void border border-plasma/30 text-gray-100'
              }`}>
                {message.role === 'agent' && (
                  <div className="text-plasma text-xs font-semibold mb-1">{agentName}</div>
                )}
                <div className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</div>
                <div className={`text-xs mt-2 flex justify-between ${
                  message.role === 'user' ? 'text-blue-200' : 'text-gray-400'
                }`}>
                  <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                  {message.responseTime && (
                    <span>{message.responseTime}ms</span>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {isThinking && (
            <div className="flex justify-start">
              <div className="bg-void border border-plasma/30 text-gray-100 p-3 rounded-lg max-w-[85%]">
                <div className="text-plasma text-xs font-semibold mb-1">{agentName}</div>
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-plasma"></div>
                  <span className="text-sm text-gray-400">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Wrapped in form to handle submission properly */}
      <form onSubmit={handleSendMessage} className="flex gap-2 sm:gap-3 mb-6">
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={`Ask ${agentName} about ${domain}...`}
          className="flex-1 p-3 bg-neural border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-synapse focus:outline-none resize-none text-sm"
          rows="3"
          disabled={isThinking}
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || isThinking}
          className="px-4 sm:px-6 py-3 bg-synapse hover:bg-synapse/80 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-all self-end min-h-[48px]"
        >
          {isThinking ? '🤔' : '💬'}
        </button>
      </form>

      {/* Quick Conversation Starters */}
      {quickStarters.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-6">
          {quickStarters.map((starter, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setInputMessage(starter)}
              className="p-3 bg-void hover:bg-void/80 border border-gray-600 hover:border-synapse/50 rounded-lg text-xs sm:text-sm transition-all min-h-[48px] text-left"
            >
              💡 {starter}
            </button>
          ))}
        </div>
      )}

      {/* Content Grounding Display */}
      <div className="bg-neural/30 rounded-lg border border-gray-700 p-4 mb-6">
        <h4 className="text-green-400 font-semibold mb-2 text-sm">🧠 Agent Operational Philosophy</h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-gray-400 mb-3">
          <div>
            <span className="text-green-400">✅ Never Blocks:</span> Always finds connecting principles
          </div>
          <div>
            <span className="text-blue-400">🌉 Always Bridges:</span> Links unknown to known concepts  
          </div>
          <div>
            <span className="text-purple-400">⚡ Personality-Driven:</span> {renderValue(soul?.tone, 'Unknown tone')} + {renderValue(soul?.emotion, 'Unknown emotion')} + {renderValue(soul?.energy, 'Unknown energy')}
          </div>
        </div>
        <div className="bg-gray-800 p-3 rounded max-h-32 overflow-y-auto">
          <p className="text-xs text-gray-300 leading-relaxed">
            <strong className="text-blue-400">Knowledge Base:</strong><br/>
            {originalContent?.content ? 
              (originalContent.content.length > 300 ? 
                originalContent.content.substring(0, 300) + '...' : 
                originalContent.content
              ) : 
              'No content available'
            }
          </p>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Agent adapts this knowledge using general principles that transfer across contexts.
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        {okpoExport.status === 'idle' ? (
          <button
            type="button"
            onClick={handleOkPoExport}
            className="flex-1 py-3 px-6 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-lg font-semibold transition-all min-h-[48px]"
          >
            🚀 Deploy to OkPo
          </button>
        ) : (
          <button
            type="button"
            onClick={exportConversation}
            className="flex-1 py-3 px-6 bg-void hover:bg-void/80 border border-gray-600 hover:border-plasma/50 rounded-lg font-semibold transition-all min-h-[48px]"
          >
            🚀 Deploy to OkPo
          </button>
        )}
        
        <button
          type="button"
          onClick={onReset}
          className="flex-1 py-3 px-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg font-semibold transition-all min-h-[48px]"
        >
          🔄 Create New Agent
        </button>
      </div>

      {/* Session Performance */}
      <div className="mt-6 p-4 bg-neural/30 rounded-lg border border-gray-700">
        <h4 className="text-synapse font-semibold mb-2 text-sm">📊 Session Performance</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-gray-400">
          <div>
            <span className="text-green-400">Interactions:</span> {stats.interactions}
          </div>
          <div>
            <span className="text-blue-400">Avg Response:</span> {stats.avgResponseTime}ms
          </div>
          <div>
            <span className="text-yellow-400">Temperature:</span> {renderValue(behaviorConfig?.deployment_config?.llm_settings?.temperature, 'N/A')}
          </div>
          <div>
            <span className="text-purple-400">Domain:</span> {domain}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AgentInterface