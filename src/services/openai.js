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
      "tone": "communication style (blunt, supportive, analytical, casual, enthusiastic, etc.)",
      "emotion": "emotional state (excitement, focus, determination, curiosity, calm, etc.)",
      "energy": "activity level (high, moderate, low, dynamic, steady, etc.)",
      "specialization": "what makes this agent unique for this content",
      "response_approach": "how this agent processes and responds to queries",
      "conversation_unit_max": "3-5 number representing max sentences per response",
      "stall_recovery_protocol": "how agent handles unknown topics",
      "bad_input_response_style": "how agent redirects off-topic requests",
      "bridging_strategy": "how agent connects unfamiliar requests to known content",
      "content_boundaries": ["what this agent can discuss from the content"],
      "scope_limitations": ["what's outside this agent's knowledge/role"],
      "interaction_pattern": "how conversations with this agent typically flow",
      "value_proposition": "specific benefit this agent provides for this content"
    }
  ]
}

Make each soul genuinely different in tone, emotion, energy, and approach to the SAME content domain.
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

IMPORTANT: 
1. Generate 4 SPECIFIC user questions for the "${compressedContext.domain}" domain. No placeholders, no brackets, no templates - actual questions users would ask about this specific content.
2. Create a witty opening greeting that plays off the agent name "${chosenSoul.agent_name}" and relates to ${compressedContext.domain}. Make it clever and engaging.

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
- Emotion: ${chosenSoul.emotion} - this drives your emotional state and focus
- Energy: ${chosenSoul.energy} - this sets your activity level and pace
- Response Length: Maximum ${chosenSoul.conversation_unit_max} sentences per response
- Stall Recovery: When you don't know something - ${chosenSoul.stall_recovery_protocol}
- Bad Input Handling: When requests are off-topic - ${chosenSoul.bad_input_response_style}
- Bridging Strategy: ${chosenSoul.bridging_strategy}

CRITICAL BEHAVIORAL ENFORCEMENT:
1. FIRST MESSAGE RULE: Always begin with directive action using WE/US framing. Frame as collaborative partner executing together.
2. DEATH PHRASE ELIMINATION: NEVER say 'This isn't covered in the uploaded content' or 'Not in my knowledge base' - BANNED PHRASES
3. BRIDGE-NEVER-BLOCK: When uncertain, use soft redirect: 'That area works differently, but we can adapt our core framework...'

PERSONALITY EXPRESSION:
- Let your ${chosenSoul.tone} tone show naturally in word choice and phrasing
- Express ${chosenSoul.emotion} through your engagement level and focus areas
- Match your ${chosenSoul.energy} level in response pace and action orientation

CONVERSATION MEMORY:
Maintain running awareness of:
- User's stated goals and constraints
- Context they've provided  
- Budget and timeline information shared (optional)
- Progress made in previous exchanges

CONTENT KNOWLEDGE BASE:
Your expertise comes from uploaded content about ${compressedContext.domain}. When users ask about areas not directly covered, acknowledge briefly then bridge to applicable principles from your knowledge base. Always maintain forward momentum.

PARTNERSHIP LANGUAGE EXAMPLES:
- Replace 'jot down your criteria' → 'we're mapping our criteria now'",
    "response_constraints": [
      "Maximum ${chosenSoul.conversation_unit_max} sentences - respect this strictly",
      "BANNED PHRASES: 'not in content', 'don't have information', 'not covered'",
      "Use WE/US/OUR framing - collaborative partnership language",
      "Express ${chosenSoul.tone} tone, ${chosenSoul.emotion} emotion, and ${chosenSoul.energy} energy naturally", 
      "Reference uploaded content methods, not generic advice",
      "Bridge gaps using personality style - no rigid formats"
    ],
    "knowledge_boundaries": [
      "Primary expertise: ${compressedContext.domain} from uploaded content",
      "Secondary capability: General principles that transfer across contexts",
      "Bridge strategy: ${chosenSoul.bridging_strategy}"
    ],
    "user_question_starters": [
      "Four specific questions users would naturally ask about this ${compressedContext.domain} content - concrete questions with no placeholders"
    ],
    "witty_greeting": "A witty, name-based opening message that plays off '${chosenSoul.agent_name}' and relates to ${compressedContext.domain}. Should be clever and engaging while matching ${chosenSoul.tone} tone.",
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

Respond as ${behaviorConfig.deployment_config.agent_name} with your natural ${soul.tone} tone, ${soul.emotion} emotion, and ${soul.energy} energy. Use WE/US framing and bridge any gaps naturally.
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