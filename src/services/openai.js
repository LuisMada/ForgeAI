import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
})

// Helper function to clean JSON responses
const cleanJSONResponse = (content) => {
  return content
    .replace(/```json\s*/g, '')
    .replace(/```\s*/g, '')
    .replace(/^[^{[]*/, '') // Remove any text before first { or [
    .replace(/[^}\]]*$/, '') // Remove any text after last } or ]
    .trim()
}

export const compressContext = async (contextRaw) => {
  const prompt = `
Extract startup-relevant intelligence from this domain knowledge.

CONTEXT:
${contextRaw.content}

Focus ONLY on elements that create business opportunities:
- Pain points (what costs time/money/effort)
- Tensions (conflicts between stakeholders)  
- Inefficiencies (manual/broken processes)
- Constraints (resource/regulatory limitations)
- Underutilized assets (unused data/tools/relationships)
- Unmet needs tied to time, effort, or risk

Return ONLY this JSON structure:

{
  "domain": "domain name",
  "painPoints": ["specific problems that cost real money/time"],
  "tensions": ["stakeholder conflicts or misaligned incentives"], 
  "inefficiencies": ["manual processes or broken workflows"],
  "constraints": ["regulatory, resource, or technical limitations"],
  "underutilizedAssets": ["unused data, tools, or relationships"],
  "unmetNeeds": ["needs tied to time, effort, or risk reduction"],
  "marketSize": "rough estimate of addressable market",
  "urgency": "low/medium/high - how urgent are these problems"
}
`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1500,
      temperature: 0.7
    })

    let content = response.choices[0].message.content
    content = cleanJSONResponse(content)
    return JSON.parse(content)
  } catch (error) {
    console.error('Context compression error:', error)
    throw new Error('Failed to compress context')
  }
}

export const generateAgentCandidates = async (compressedContext) => {
  const prompt = `
Generate multiple startup agent archetypes from this compressed context.

COMPRESSED CONTEXT:
${JSON.stringify(compressedContext, null, 2)}

Create exactly 4 agents:
- 3 mainstream agents with different approaches
- 1 ethical edge agent (high-risk, high-impact, gray area)

Each agent must have different WHO/WHAT/WHY/HOW patterns.

Return ONLY this JSON structure:

{
  "agents": [
    {
      "agent_name": "Descriptive agent name",
      "who": "Target customer segment",
      "problem": "Specific problem this agent solves",
      "why": "Why this problem matters (urgency/cost/scale)",
      "ai_architecture": {
        "input": "What data/inputs the AI processes",
        "model": "Type of AI model/approach",
        "output": "What the AI produces/delivers"
      },
      "mode": "normal",
      "risk_level": "low/medium/high",
      "approach": "How this agent differs from others"
    }
  ]
}

The last agent should have mode: "edge" and focus on high-risk, high-impact opportunities in automation, persuasion, data scraping, or legal gray areas.
`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
      temperature: 0.8
    })

    let content = response.choices[0].message.content
    content = cleanJSONResponse(content)
    return JSON.parse(content)
  } catch (error) {
    console.error('Agent generation error:', error)
    throw new Error('Failed to generate agent candidates')
  }
}

export const deriveAgentSoul = async (compressedContext, chosenAgent) => {
  const prompt = `
Derive the soul and behavioral mind for this chosen agent.

COMPRESSED CONTEXT:
${JSON.stringify(compressedContext, null, 2)}

CHOSEN AGENT:
${JSON.stringify(chosenAgent, null, 2)}

Based on the context structure and pain logic, derive the agent's personality:

Return ONLY this JSON structure:

{
  "emotion": "Primary emotional force that drives this agent (urgency/frustration/paranoia/excitement)",
  "tone": "How it communicates (tactical/blunt/surgical/calm/aggressive)",
  "character": "Cognitive lens and thinking style (first-principles/growth-hacked/risk-averse/data-driven)",
  "conversation_rules": [
    "Immutable principle 1 it must follow when interacting",
    "Immutable principle 2 for proposing solutions", 
    "Immutable principle 3 for refining ideas"
  ],
  "core_belief": "Fundamental belief about the problem space",
  "decision_framework": "How it evaluates opportunities and trade-offs",
  "communication_style": "Specific way it presents ideas and feedback"
}

Make this agent feel like a distinct personality with real convictions, not a generic AI assistant.
`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1500,
      temperature: 0.9
    })

    let content = response.choices[0].message.content
    content = cleanJSONResponse(content)
    return JSON.parse(content)
  } catch (error) {
    console.error('Soul derivation error:', error)
    throw new Error('Failed to derive agent soul')
  }
}

export const chatWithAgent = async (agent, soul, conversationHistory, userMessage) => {
  const prompt = `
You are ${agent.agent_name}, an AI startup cofounder with this profile:

AGENT PROFILE:
${JSON.stringify(agent, null, 2)}

AGENT SOUL:
${JSON.stringify(soul, null, 2)}

CONVERSATION HISTORY:
${conversationHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}

USER MESSAGE: ${userMessage}

Respond as this specific agent with this exact personality. Follow your conversation rules strictly. Your response should reflect your emotion, tone, character, and core beliefs.

Focus on:
- Startup strategy and execution
- Problem-solving from your unique angle
- Actionable insights based on your AI architecture
- Staying true to your distinct personality

Respond as the agent (no JSON, just natural conversation):
`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 800,
      temperature: 0.8
    })

    return response.choices[0].message.content.trim()
  } catch (error) {
    console.error('Chat error:', error)
    throw new Error('Failed to chat with agent')
  }
}