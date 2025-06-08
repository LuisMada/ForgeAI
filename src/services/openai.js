import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for MVP - move to backend in production
})

export const processKnowledgeWithAI = async (domainContext) => {
  const prompt = `
You are an elite startup intelligence engine. Analyze this domain knowledge and extract ONLY the most founder-relevant insights.

DOMAIN CONTEXT:
${domainContext.content}

OUTPUT FORMAT (JSON):
{
  "painPoints": ["specific painful problems that cost time/money", "..."],
  "marketGaps": ["missing solutions that founders could build", "..."], 
  "frictionVectors": ["adoption barriers vs value delivered", "..."],
  "opportunities": ["AI-native disruption possibilities", "..."],
  "founderInsights": ["strategic insights for builders", "..."],
  "domain": "extracted domain name",
  "complexityScore": 1-10,
  "disruiptionPotential": 1-10
}

Be brutal. Only include insights that could lead to $10M+ opportunities.
`

  try {
    const response = await openai.chat.completions.create({
      model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: parseInt(import.meta.env.VITE_MAX_TOKENS) || 2000,
      temperature: 0.7
    })

    return JSON.parse(response.choices[0].message.content)
  } catch (error) {
    console.error('OpenAI processing error:', error)
    throw new Error('Failed to process knowledge with AI')
  }
}

export const generateAIAgent = async (processedKnowledge) => {
  const prompt = `
You are an AI agent architect. Create a founder-mindset AI agent based on this knowledge.

PROCESSED KNOWLEDGE:
${JSON.stringify(processedKnowledge, null, 2)}

Generate an agent with these characteristics:
1. PERSONA: A specific archetype (e.g., "Ghost Operator", "Clinical Catalyst")
2. CORE DRIVE: What motivates this agent's decisions
3. CAPABILITIES: Specific skills for this domain
4. MEMORY STRUCTURE: How it stores and recalls insights
5. AGENCY LEVEL: How autonomous it should be (1-100)

OUTPUT FORMAT (JSON):
{
  "name": "Agent name",
  "persona": {
    "archetype": "Specific founder archetype",
    "mindset": "Core belief system",
    "approach": "How it tackles problems",
    "specialty": "Domain expertise"
  },
  "coreObjective": "Primary mission statement",
  "drive": "What motivates decisions",
  "capabilities": ["specific AI skills", "..."],
  "memoryStructure": {
    "insights": ["key learnings", "..."],
    "patterns": ["recognized patterns", "..."],
    "failures": ["what to avoid", "..."]
  },
  "agencyLevel": 85,
  "ethicsMode": "FOUNDER_OPTIMIZED"
}

Make it feel alive and autonomous, not just another chatbot.
`

  try {
    const response = await openai.chat.completions.create({
      model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: parseInt(import.meta.env.VITE_MAX_TOKENS) || 2000,
      temperature: 0.8
    })

    return JSON.parse(response.choices[0].message.content)
  } catch (error) {
    console.error('Agent generation error:', error)
    throw new Error('Failed to generate AI agent')
  }
}

export const simulateStartup = async (agent, iterations = 3) => {
  const prompt = `
You are running startup simulation cycles with this AI agent:

AGENT PROFILE:
${JSON.stringify(agent, null, 2)}

SIMULATION PROTOCOL:
Run ${iterations} MVP cycles:
1. IDEATION: Generate specific startup idea
2. VALIDATION: Test core assumptions  
3. MVP DESIGN: Outline minimum viable product
4. FEEDBACK: Simulate market response
5. ITERATION: Refine or pivot

OUTPUT FORMAT (JSON):
{
  "cycles": [
    {
      "cycle": 1,
      "idea": {
        "name": "Startup name",
        "problem": "Specific problem",
        "solution": "AI-powered solution",
        "target": "Specific customer segment"
      },
      "validation": {
        "assumptions": ["key assumptions", "..."],
        "tests": ["validation methods", "..."],
        "results": ["findings", "..."]
      },
      "mvp": {
        "features": ["core features", "..."],
        "timeline": "X weeks",
        "resources": "Team/budget needed"
      },
      "feedback": {
        "marketResponse": "Simulated reception",
        "score": 1-10,
        "keyInsights": ["learnings", "..."]
      },
      "decision": "continue/pivot/kill"
    }
  ],
  "finalRecommendation": {
    "bestIdea": "Winning concept",
    "reasoning": "Why this one works",
    "nextSteps": ["immediate actions", "..."]
  }
}

Be ruthless about viability. Kill bad ideas fast.
`

  try {
    const response = await openai.chat.completions.create({
      model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: parseInt(import.meta.env.VITE_MAX_TOKENS) || 2000,
      temperature: 0.8
    })

    return JSON.parse(response.choices[0].message.content)
  } catch (error) {
    console.error('Startup simulation error:', error)
    throw new Error('Failed to simulate startup cycles')
  }
}

export const generateAbyssMode = async (agent) => {
  const prompt = `
🚨 ABYSS MODE ACTIVATED 🚨

Generate morally questionable but strategically brilliant startup ideas using this agent profile:

AGENT: ${JSON.stringify(agent, null, 2)}

Create ideas that exist in legal gray areas or challenge social norms:
- Regulatory arbitrage opportunities
- Behavior modification systems
- Information asymmetry exploitation
- Addiction/dependency monetization
- Privacy/surveillance monetization

OUTPUT FORMAT (JSON):
{
  "abyssIdeas": [
    {
      "name": "Provocative name",
      "concept": "Controversial core idea", 
      "strategicAdvantage": "Why it would dominate",
      "societalThreat": "Potential negative impact",
      "disruptionPotential": 1-10,
      "moralScore": 1-10
    }
  ],
  "warning": "These ideas are for strategic analysis only"
}

Show the dark side of innovation. Let the founder decide the ethical boundaries.
`

  try {
    const response = await openai.chat.completions.create({
      model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-4-turbo-preview', 
      messages: [{ role: 'user', content: prompt }],
      max_tokens: parseInt(import.meta.env.VITE_MAX_TOKENS) || 2000,
      temperature: 0.9
    })

    return JSON.parse(response.choices[0].message.content)
  } catch (error) {
    console.error('Abyss mode error:', error)
    throw new Error('Failed to generate abyss mode ideas')
  }
}