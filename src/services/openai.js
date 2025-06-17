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
Generate behavioral configuration for this agent based on the specific content domain.

CONTENT ANALYSIS:
${JSON.stringify(compressedContext, null, 2)}

CHOSEN SOUL:
${JSON.stringify(chosenSoul, null, 2)}

Create behavioral rules that keep this agent focused on its content domain and role.

Return ONLY this JSON structure:

{
  "deployment_config": {
    "agent_name": "${chosenSoul.agent_name}",
    "role": "${chosenSoul.role}",
    "content_domain": "${compressedContext.domain}",
    "llm_settings": {
      "temperature": "0.1-1.0 based on content type and agent approach",
      "max_tokens": "appropriate length for this domain",
      "model": "gpt-4"
    },
    "system_prompt": "Complete system prompt that defines this agent's behavior, knowledge scope, and response style for this specific content domain",
    "response_constraints": ["specific behavioral rules for this content type"],
    "knowledge_boundaries": ["what this agent knows/doesn't know based on content"],
    "conversation_starters": ["relevant opening questions for this domain"],
    "fallback_responses": ["what to say when asked about topics outside content scope"]
  }
}

Base all rules on the actual content domain, not generic safety guidelines.
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

  // Include the actual uploaded content in the context
  const contextPrompt = `
UPLOADED CONTENT (Your primary knowledge source):
${originalContent}

CONTENT DOMAIN: ${compressedContext.domain}
AGENT ROLE: ${behaviorConfig.deployment_config.agent_name}

INSTRUCTIONS:
- Base ALL responses on the uploaded content above
- When information isn't in the content, clearly state: "This isn't covered in the uploaded content"
- Reference specific parts of the content when answering
- Do not use external knowledge beyond what's provided

CONVERSATION HISTORY:
${conversationHistory.slice(-6).map(msg => `${msg.role}: ${msg.content}`).join('\n')}

USER MESSAGE: ${userMessage}

Respond as ${behaviorConfig.deployment_config.agent_name} using ONLY the uploaded content as your knowledge base.
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