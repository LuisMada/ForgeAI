import { useState, useRef, useEffect } from 'react'
import { chatWithAgent } from '../services/openai'

function AgentInterface({ agent, soul, onReset }) {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const messagesEndRef = useRef(null)

  // Initial greeting
  useEffect(() => {
    const initialGreeting = `Hello! I'm ${agent.agent_name}, your AI cofounder. I specialize in ${agent.problem.toLowerCase()} for ${agent.who.toLowerCase()}. 

My approach is ${soul.character.toLowerCase()} and I communicate in a ${soul.tone.toLowerCase()} way. I'm driven by ${soul.emotion.toLowerCase()} to solve real problems.

What would you like to work on together? I can help with strategy, execution, problem-solving, or dive deep into the specifics of your startup idea.`

    setMessages([{
      role: 'agent',
      content: initialGreeting,
      timestamp: new Date().toISOString()
    }])
  }, [agent, soul])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isThinking) return

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
      const agentResponse = await chatWithAgent(agent, soul, conversationHistory, inputMessage)
      
      const agentMessage = {
        role: 'agent',
        content: agentResponse,
        timestamp: new Date().toISOString()
      }

      setMessages(prev => [...prev, agentMessage])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage = {
        role: 'agent',
        content: "I apologize, but I'm having trouble processing that right now. Could you try rephrasing your question?",
        timestamp: new Date().toISOString()
      }
      setMessages(prev => [...prev, errorMessage])
    }

    setIsThinking(false)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const exportConversation = () => {
    const conversationData = {
      agent: agent.agent_name,
      soul_characteristics: soul,
      conversation: messages,
      exported_at: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(conversationData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${agent.agent_name.toLowerCase().replace(' ', '-')}-conversation.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="void-panel neural-glow">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-synapse mb-1">
            5️⃣ {agent.agent_name}
          </h2>
          <p className="text-gray-400 text-sm">
            Your AI cofounder is ready • {soul.tone} • Driven by {soul.emotion}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-green-400 text-sm">ONLINE</span>
        </div>
      </div>

      {/* Agent Profile Card */}
      <div className="bg-gradient-to-r from-synapse/10 to-plasma/10 border border-synapse/30 rounded-lg p-4 mb-6">
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-synapse font-semibold">Focus:</span>
            <p className="text-gray-300">{agent.problem}</p>
          </div>
          <div>
            <span className="text-plasma font-semibold">Target:</span>
            <p className="text-gray-300">{agent.who}</p>
          </div>
          <div>
            <span className="text-yellow-400 font-semibold">Approach:</span>
            <p className="text-gray-300">{agent.approach}</p>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="bg-neural/50 rounded-lg border border-gray-600 mb-4" style={{ height: '400px' }}>
        <div className="h-full overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-3xl p-3 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-synapse text-white ml-12' 
                  : 'bg-void border border-plasma/30 text-gray-100 mr-12'
              }`}>
                {message.role === 'agent' && (
                  <div className="text-plasma text-xs font-semibold mb-1">{agent.agent_name}</div>
                )}
                <div className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</div>
                <div className={`text-xs mt-2 ${
                  message.role === 'user' ? 'text-blue-200' : 'text-gray-400'
                }`}>
                  {new Date(message.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          
          {isThinking && (
            <div className="flex justify-start">
              <div className="bg-void border border-plasma/30 text-gray-100 mr-12 p-3 rounded-lg">
                <div className="text-plasma text-xs font-semibold mb-1">{agent.agent_name}</div>
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

      {/* Input Area */}
      <div className="flex gap-3 mb-6">
        <textarea
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask your AI cofounder anything about strategy, execution, problems to solve..."
          className="flex-1 p-3 bg-neural border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-synapse focus:outline-none resize-none"
          rows="3"
          disabled={isThinking}
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputMessage.trim() || isThinking}
          className="px-6 py-3 bg-synapse hover:bg-synapse/80 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-all self-end"
        >
          {isThinking ? '🤔' : '📤'}
        </button>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-4 gap-3 mb-6">
        <button
          onClick={() => setInputMessage("Help me validate this startup idea...")}
          className="p-3 bg-void hover:bg-void/80 border border-gray-600 hover:border-synapse/50 rounded-lg text-sm transition-all"
        >
          💡 Validate Idea
        </button>
        <button
          onClick={() => setInputMessage("What should my MVP look like?")}
          className="p-3 bg-void hover:bg-void/80 border border-gray-600 hover:border-synapse/50 rounded-lg text-sm transition-all"
        >
          🛠️ Plan MVP
        </button>
        <button
          onClick={() => setInputMessage("How should I approach go-to-market?")}
          className="p-3 bg-void hover:bg-void/80 border border-gray-600 hover:border-synapse/50 rounded-lg text-sm transition-all"
        >
          🚀 Go-to-Market
        </button>
        <button
          onClick={() => setInputMessage("What are the biggest risks I should watch out for?")}
          className="p-3 bg-void hover:bg-void/80 border border-gray-600 hover:border-synapse/50 rounded-lg text-sm transition-all"
        >
          ⚠️ Risk Analysis
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={exportConversation}
          className="flex-1 py-3 px-6 bg-void hover:bg-void/80 border border-gray-600 hover:border-plasma/50 rounded-lg font-semibold transition-all"
        >
          💾 Export Chat
        </button>
        
        <button
          onClick={onReset}
          className="flex-1 py-3 px-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg font-semibold transition-all"
        >
          🔄 Create New Agent
        </button>
      </div>

      {/* Agent Soul Summary */}
      <div className="mt-6 p-4 bg-neural/30 rounded-lg border border-gray-700">
        <h4 className="text-plasma font-semibold mb-2">🧠 Agent Personality</h4>
        <div className="grid md:grid-cols-2 gap-4 text-xs text-gray-400">
          <div>
            <span className="text-synapse">Emotion:</span> {soul.emotion}
          </div>
          <div>
            <span className="text-synapse">Tone:</span> {soul.tone}
          </div>
          <div>
            <span className="text-synapse">Character:</span> {soul.character}
          </div>
          <div>
            <span className="text-synapse">Framework:</span> {soul.decision_framework}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AgentInterface