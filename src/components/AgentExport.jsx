import { useState } from 'react'

function AgentExport({ agent, simulation, onReset }) {
  const [exportFormat, setExportFormat] = useState('json')
  const [copied, setCopied] = useState(false)

  const generateExportData = () => {
    const exportData = {
      agent: {
        name: agent.name,
        persona: agent.persona,
        coreObjective: agent.coreObjective,
        drive: agent.drive,
        capabilities: agent.capabilities,
        memoryStructure: agent.memoryStructure,
        agencyLevel: agent.agencyLevel,
        ethicsMode: agent.ethicsMode
      },
      bestStartupIdea: simulation.standardResults?.finalRecommendation || null,
      allCycles: simulation.standardResults?.cycles || [],
      abyssIdeas: simulation.abyssResults?.abyssIdeas || null,
      metadata: {
        generatedAt: agent.generatedAt,
        domain: agent.domain,
        version: agent.version,
        exportedAt: new Date().toISOString()
      },
      implementationGuide: generateImplementationGuide(),
      nextSteps: generateNextSteps()
    }

    return exportData
  }

  const generateImplementationGuide = () => {
    return {
      cli_tool: {
        description: "Convert this agent into a CLI tool for rapid ideation",
        tech_stack: ["Node.js", "Commander.js", "OpenAI API"],
        sample_command: `npx ${agent.name.toLowerCase().replace(' ', '-')}-agent --domain "your domain" --iterations 5`
      },
      streamlit_app: {
        description: "Build an interactive web app for continuous agent interaction",
        tech_stack: ["Streamlit", "Python", "OpenAI API"],
        features: ["Agent chat interface", "Idea generation", "MVP planning", "Export functionality"]
      },
      api_service: {
        description: "Deploy as a microservice for integration into existing workflows",
        tech_stack: ["FastAPI", "Docker", "Redis", "PostgreSQL"],
        endpoints: ["/generate-ideas", "/validate-concept", "/simulate-mvp", "/agent-chat"]
      }
    }
  }

  const generateNextSteps = () => {
    const bestIdea = simulation.standardResults?.finalRecommendation?.bestIdea
    
    return [
      {
        phase: "Week 1-2: Validation",
        tasks: [
          "Interview 10 potential customers about the core problem",
          "Research direct and indirect competitors",
          "Validate key assumptions with landing page + email signup",
          "Calculate rough market size and pricing models"
        ]
      },
      {
        phase: "Week 3-4: MVP Planning", 
        tasks: [
          "Define core feature set for MVP",
          "Choose tech stack and architecture",
          "Create wireframes and user flow",
          "Estimate development timeline and resources"
        ]
      },
      {
        phase: "Month 2: MVP Development",
        tasks: [
          "Build core functionality",
          "Implement basic UI/UX",
          "Set up analytics and feedback collection",
          "Prepare for initial user testing"
        ]
      },
      {
        phase: "Month 3: Launch & Iterate",
        tasks: [
          "Launch MVP to beta users",
          "Collect and analyze user feedback", 
          "Iterate on core features",
          "Plan scaling strategy based on traction"
        ]
      }
    ]
  }

  const formatExportData = (data) => {
    switch(exportFormat) {
      case 'json':
        return JSON.stringify(data, null, 2)
      case 'yaml':
        return convertToYAML(data)
      case 'markdown':
        return convertToMarkdown(data)
      default:
        return JSON.stringify(data, null, 2)
    }
  }

  const convertToYAML = (data) => {
    // Simple YAML conversion (in production, use a proper YAML library)
    return `# AI Agent Export
agent:
  name: "${data.agent.name}"
  persona:
    archetype: "${data.agent.persona.archetype}"
    mindset: "${data.agent.persona.mindset}"
    approach: "${data.agent.persona.approach}"
  core_objective: "${data.agent.coreObjective}"
  agency_level: ${data.agent.agencyLevel}

best_startup_idea: "${data.bestStartupIdea?.bestIdea || 'N/A'}"

implementation:
  cli_tool: "${data.implementationGuide.cli_tool.sample_command}"
  tech_stack: ${JSON.stringify(data.implementationGuide.cli_tool.tech_stack)}

export_date: "${data.metadata.exportedAt}"`
  }

  const convertToMarkdown = (data) => {
    return `# ${data.agent.name} - AI Agent Export

## Agent Profile
- **Archetype**: ${data.agent.persona.archetype}
- **Mindset**: ${data.agent.persona.mindset}
- **Core Objective**: ${data.agent.coreObjective}
- **Agency Level**: ${data.agent.agencyLevel}%

## Best Startup Idea
**${data.bestStartupIdea?.bestIdea || 'N/A'}**

${data.bestStartupIdea?.reasoning || ''}

## Implementation Options

### CLI Tool
\`\`\`bash
${data.implementationGuide.cli_tool.sample_command}
\`\`\`

### Tech Stack
- ${data.implementationGuide.cli_tool.tech_stack.join('\n- ')}

## Next Steps
${data.nextSteps.map(step => `
### ${step.phase}
${step.tasks.map(task => `- ${task}`).join('\n')}
`).join('\n')}

---
*Exported: ${data.metadata.exportedAt}*`
  }

  const handleCopyToClipboard = async () => {
    const data = generateExportData()
    const formattedData = formatExportData(data)
    
    try {
      await navigator.clipboard.writeText(formattedData)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleDownload = () => {
    const data = generateExportData()
    const formattedData = formatExportData(data)
    const fileName = `${agent.name.toLowerCase().replace(' ', '-')}-agent.${exportFormat}`
    
    const blob = new Blob([formattedData], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const exportData = generateExportData()

  return (
    <div className="void-panel neural-glow">
      <h2 className="text-2xl font-bold text-synapse mb-6">
        📦 Agent Export & Implementation
      </h2>

      {/* Export Summary Card */}
      <div className="bg-gradient-to-br from-synapse/10 to-plasma/10 border border-synapse/30 rounded-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-white mb-4">
          🤖 {agent.name} - Ready for Deployment
        </h3>
        
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <h4 className="text-plasma font-semibold mb-2">Agent Stats</h4>
            <div className="text-sm text-gray-300 space-y-1">
              <div>Agency Level: <span className="text-synapse">{agent.agencyLevel}%</span></div>
              <div>Domain: <span className="text-synapse">{agent.domain}</span></div>
              <div>Ethics Mode: <span className="text-synapse">{agent.ethicsMode}</span></div>
            </div>
          </div>
          <div>
            <h4 className="text-plasma font-semibold mb-2">Best Idea</h4>
            <p className="text-sm text-gray-300">
              {exportData.bestStartupIdea?.bestIdea || 'No recommendation generated'}
            </p>
          </div>
        </div>
      </div>

      {/* Implementation Options */}
      <div className="grid md:grid-cols-3 gap-6 mb-6">
        <div className="bg-neural/50 p-4 rounded-lg">
          <h4 className="text-green-400 font-semibold mb-3">🖥️ CLI Tool</h4>
          <p className="text-sm text-gray-300 mb-3">
            Convert to a command-line tool for rapid ideation and validation.
          </p>
          <div className="bg-gray-800 p-2 rounded text-xs text-green-400 font-mono">
            {exportData.implementationGuide.cli_tool.sample_command}
          </div>
        </div>
        
        <div className="bg-neural/50 p-4 rounded-lg">
          <h4 className="text-blue-400 font-semibold mb-3">🌐 Streamlit App</h4>
          <p className="text-sm text-gray-300 mb-3">
            Build an interactive web interface for continuous agent interaction.
          </p>
          <div className="flex flex-wrap gap-1">
            {exportData.implementationGuide.streamlit_app.tech_stack.map((tech, index) => (
              <span key={index} className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs">
                {tech}
              </span>
            ))}
          </div>
        </div>
        
        <div className="bg-neural/50 p-4 rounded-lg">
          <h4 className="text-purple-400 font-semibold mb-3">🚀 API Service</h4>
          <p className="text-sm text-gray-300 mb-3">
            Deploy as a microservice for integration into existing workflows.
          </p>
          <div className="text-xs text-gray-400">
            {exportData.implementationGuide.api_service.endpoints.length} endpoints ready
          </div>
        </div>
      </div>

      {/* Export Controls */}
      <div className="bg-neural/50 p-4 rounded-lg mb-6">
        <h4 className="text-plasma font-semibold mb-4">📄 Export Configuration</h4>
        
        <div className="flex items-center gap-4 mb-4">
          <span className="text-sm text-gray-300">Format:</span>
          {['json', 'yaml', 'markdown'].map((format) => (
            <button
              key={format}
              onClick={() => setExportFormat(format)}
              className={`px-3 py-1 rounded text-sm font-semibold transition-colors ${
                exportFormat === format 
                  ? 'bg-synapse text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {format.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="bg-gray-800 p-4 rounded-lg max-h-40 overflow-y-auto mb-4">
          <pre className="text-xs text-gray-300 whitespace-pre-wrap">
            {formatExportData(exportData).substring(0, 500)}...
          </pre>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleCopyToClipboard}
            className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
              copied 
                ? 'bg-green-600 text-white' 
                : 'bg-synapse hover:bg-synapse/80 text-white'
            }`}
          >
            {copied ? '✅ Copied!' : '📋 Copy to Clipboard'}
          </button>
          
          <button
            onClick={handleDownload}
            className="flex-1 py-2 px-4 bg-plasma hover:bg-plasma/80 text-white rounded-lg font-semibold transition-colors"
          >
            💾 Download File
          </button>
        </div>
      </div>

      {/* Next Steps Timeline */}
      <div className="bg-neural/50 p-4 rounded-lg mb-6">
        <h4 className="text-yellow-400 font-semibold mb-4">🗺️ Implementation Roadmap</h4>
        <div className="space-y-4">
          {exportData.nextSteps.map((step, index) => (
            <div key={index} className="border-l-2 border-yellow-400/30 pl-4">
              <h5 className="text-white font-semibold mb-2">{step.phase}</h5>
              <ul className="space-y-1">
                {step.tasks.map((task, taskIndex) => (
                  <li key={taskIndex} className="text-sm text-gray-300 flex items-start">
                    <span className="text-yellow-400 mr-2">•</span>
                    {task}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onReset}
          className="flex-1 py-3 px-6 bg-void hover:bg-void/80 border border-gray-600 hover:border-plasma/50 rounded-lg font-semibold transition-all"
        >
          🔄 Create New Agent
        </button>
        
        <button
          onClick={handleDownload}
          className="flex-1 py-3 px-6 bg-gradient-to-r from-synapse to-plasma hover:from-synapse/80 hover:to-plasma/80 rounded-lg font-semibold transition-all transform hover:scale-105"
        >
          🚀 Export & Deploy
        </button>
      </div>
    </div>
  )
}

export default AgentExport