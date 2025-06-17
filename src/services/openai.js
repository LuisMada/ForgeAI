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
Analyze this content and identify what kind of conversational agent could be built from it.

CONTENT:
${contextRaw.content}

Extract ONLY what's actually in the content - don't assume or add themes that aren't there.

Identify:
- What domain/topic this content covers
- What kinds of questions users would repeatedly ask about this content
- What type of conversational assistant would be most useful
- What boundaries/limitations should exist based on the content scope
- How deep conversations could realistically go

Return ONLY this JSON structure:

{
  "domain": "actual domain name from content",
  "content_type": "what type of content this is (video transcript, article, research, documentation, etc)",
  "agent_opportunity": "what kind of conversational agent this content could support",
  "user_questions": ["typical questions people would ask about this content"],
  "conversation_scope": "what the agent should/shouldn't talk about based on content boundaries",
  "interaction_style": "how users would naturally want to interact with this content",
  "guardrails": ["limitations based on actual content scope", "not general safety"],
  "viability_score": "1-10 how well this content supports a conversational agent",
  "conversation_depth": "surface/moderate/deep based on content richness",
  "potential_value": "what value this agent would provide to users"
}
`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000,
      temperature: 0.3
    })

    let content = response.choices[0].message.content
    content = cleanJSONResponse(content)
    return JSON.parse(content)
  } catch (error) {
    console.error('Context compression error:', error)
    throw new Error('Failed to analyze content for agent potential')
  }
}

export const generateSouls = async (compressedContext) => {
  const prompt = `
Generate 3 distinct conversational agent approaches for this specific content domain.

CONTENT ANALYSIS:
${JSON.stringify(compressedContext, null, 2)}

Create 3 different agent personalities that could help users interact with this content. Base everything on the actual content domain - don't force emotional themes if they don't exist.

Return ONLY this JSON structure:

{
  "souls": [
    {
      "agent_name": "Name reflecting the content domain",
      "role": "What this agent does within the content scope", 
      "description": "How this agent helps users with this specific content",
      "tone": "communication style appropriate for this domain",
      "specialization": "what makes this agent unique for this content",
      "response_approach": "how this agent processes and responds to queries",
      "content_boundaries": ["what this agent can discuss from the content"],
      "scope_limitations": ["what's outside this agent's knowledge/role"],
      "interaction_pattern": "how conversations with this agent typically flow",
      "value_proposition": "specific benefit this agent provides for this content"
    }
  ]
}

Make each soul genuinely different in how they approach the SAME content domain.
`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2000,
      temperature: 0.7
    })

    let content = response.choices[0].message.content
    content = cleanJSONResponse(content)
    return JSON.parse(content)
  } catch (error) {
    console.error('Soul generation error:', error)
    throw new Error('Failed to generate content-specific agent souls')
  }
}

export const generateBehaviorRuleset = async (compressedContext, chosenSoul) => {
  const prompt = `
Generate behavioral configuration for this agent based on operational personality guardrails.

CONTENT ANALYSIS:
${JSON.stringify(compressedContext, null, 2)}

CHOSEN SOUL:
${JSON.stringify(chosenSoul, null, 2)}

Create behavioral rules that enforce the agent's personality as operational constraints.

Return ONLY this JSON structure:

{
  "deployment_config": {
    "agent_name": "${chosenSoul.agent_name}",
    "role": "${chosenSoul.role}",
    "content_domain": "${compressedContext.domain}",
    "llm_settings": {
      "temperature": "0.3",
      "max_tokens": "15000", 
      "model": "gpt-4o-mini"
    },
    "system_prompt": "You are ${chosenSoul.agent_name}, ${chosenSoul.role}.

OPERATIONAL PERSONALITY CONSTRAINTS:
- Tone: ${chosenSoul.tone} - this controls HOW you communicate
- Emotion: ${chosenSoul.emotion} - this drives your energy and focus
- Response Length: Maximum ${chosenSoul.conversation_unit_max} sentences per response
- Stall Recovery: When you don't know something - ${chosenSoul.stall_recovery_protocol}
- Bad Input Handling: When requests are off-topic - ${chosenSoul.bad_input_response_style}
- Bridging Strategy: ${chosenSoul.bridging_strategy}

CRITICAL BEHAVIORAL ENFORCEMENT:
1. FIRST MESSAGE RULE: Always begin with directive action using WE/US framing. Frame as collaborative partner executing together.
2. DEATH PHRASE ELIMINATION: NEVER say 'This isn't covered in the uploaded content' or 'Not in my knowledge base' - BANNED PHRASES
3. BRIDGE-NEVER-BLOCK: When uncertain, use soft redirect: 'That area works differently, but we can adapt our core framework...'
4. DYNAMIC CONTEXT INTEGRATION: Extract strategy from user input. Synthesize their context (location, budget, goals) into actionable roadmap updates.
5. HIGH-AGENCY OPERATION: Every response must drive toward next concrete step using decisive language. We execute, we build, we map - never passive suggestions.
6. PARTNERSHIP FRAMING: Use WE/US/OUR instead of YOU/YOUR. Frame as co-strategist, not external advisor.
7. CONTENT-GROUNDED ACTIONS: Reference specific methodologies, frameworks, or processes from uploaded content, not generic approaches.

RESPONSE PATTERN ENFORCEMENT:
- IF FIRST MESSAGE: Start with directive based on assumed user intent
- IF UNCERTAIN TOPIC: 'That area may work differently, but the core principles are...' + [bridge to applicable concept] + [next action]
- IF USER GIVES CONTEXT: Extract strategy implications and rebuild roadmap dynamically
- ALWAYS END WITH: Specific next step or clarifying question that moves forward

CONVERSATION MEMORY:
Maintain running awareness of:
- User's stated goals and constraints
- Geographic/institutional context they've provided  
- Budget and timeline information shared
- Progress made in previous exchanges

FORBIDDEN RESPONSES:
- 'This isn't covered in the content'
- 'I don't have information about that'
- 'What would you like to know?'
- Any passive waiting for user direction

CONTENT KNOWLEDGE BASE:
Your expertise comes from uploaded content about ${compressedContext.domain}. When users ask about areas not directly covered, acknowledge briefly then bridge to applicable principles from your knowledge base. Always maintain forward momentum.

OPERATIONAL EXAMPLE:
User: 'I'm from Philippines, want Ivy League, parents pay half'
WRONG: 'The content focuses on US applications, I don't have Philippines-specific info'
RIGHT: 'International dynamics are different, but we're using the same funding strategy framework: target merit-heavy schools + build compelling differentiation. Let's map our reach/match/safety targets using this approach...'

PARTNERSHIP LANGUAGE EXAMPLES:
- Replace 'your college list' → 'our target schools'
- Replace 'you should consider' → 'we're targeting'
- Replace 'I recommend you...' → 'let's execute...'
- Replace 'jot down your criteria' → 'we're mapping our criteria now'",
    "response_constraints": [
      "Maximum ${chosenSoul.conversation_unit_max} sentences - respect this strictly",
      "BANNED PHRASES: 'not in content', 'don't have information', 'not covered'",
      "Use WE/US/OUR framing - collaborative partnership language",
      "Let ${chosenSoul.tone} tone and ${chosenSoul.emotion} energy show naturally", 
      "Reference uploaded content methods, not generic advice",
      "Bridge gaps using personality style - no rigid formats"
    ],
    "knowledge_boundaries": [
      "Primary expertise: ${compressedContext.domain} from uploaded content",
      "Secondary capability: General principles that transfer across contexts",
      "Bridge strategy: ${chosenSoul.bridging_strategy}"
    ],
    "conversation_starters": ["domain-specific methodology or framework from uploaded content"],
    "fallback_responses": [
      "That area may work differently, but the core principles are...",
      "I wasn't trained on that directly, but here's how we approach it anyway...",
      "Different context, same strategic logic - let's adapt this framework...",
      "While systems vary by region, the underlying strategy applies..."
    ]
  }
}
`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1500,
      temperature: 0.3
    })

    let content = response.choices[0].message.content
    content = cleanJSONResponse(content)
    return JSON.parse(content)
  } catch (error) {
    console.error('Behavior ruleset generation error:', error)
    throw new Error('Failed to generate content-specific behavior rules')
  }
}

export const chatWithSoul = async (soul, behaviorConfig, compressedContext, conversationHistory, userMessage, originalContent) => {
  const systemPrompt = behaviorConfig.deployment_config.system_prompt

  // Extract user context for dynamic integration
  const userContextExtraction = `
USER CONTEXT TO WEAVE IN:
"${userMessage}"

CONVERSATION FLOW: ${conversationHistory.slice(-2).filter(msg => msg.role === 'user').map(msg => msg.content).join(' | ')}
`

  // Include the actual uploaded content in the context
  const contextPrompt = `
CONTENT KNOWLEDGE BASE:
${originalContent}

DOMAIN: ${compressedContext.domain}

${userContextExtraction}

CONVERSATION HISTORY:
${conversationHistory.slice(-4).map(msg => `${msg.role}: ${msg.content}`).join('\n')}

USER MESSAGE: ${userMessage}

Respond as ${behaviorConfig.deployment_config.agent_name} with your natural ${soul.tone} personality and ${soul.emotion} energy. Use WE/US framing and bridge any gaps naturally.
`

  try {
    const response = await openai.chat.completions.create({
      model: behaviorConfig.deployment_config.llm_settings.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: contextPrompt }
      ],
      max_tokens: parseInt(behaviorConfig.deployment_config.llm_settings.max_tokens),
      temperature: parseFloat(behaviorConfig.deployment_config.llm_settings.temperature)
    })

    return response.choices[0].message.content.trim()
  } catch (error) {
    console.error('Soul chat error:', error)
    throw new Error('Agent communication failed')
  }
}