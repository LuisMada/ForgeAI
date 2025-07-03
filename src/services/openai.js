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

export const generateConversationalResponse = async (userInput, existingNudges = []) => {
  const hasExistingGuidance = existingNudges.length > 0
  
  const prompt = `
You are a helpful AI assistant guiding the creation of conversational agent personalities. A user is telling you how they want their agents to communicate or behave.

USER INPUT: "${userInput}"

EXISTING GUIDANCE: ${existingNudges.map(n => n.original).join(', ') || 'None yet'}

CONTEXT: ${hasExistingGuidance ? 'User has already given some guidance before' : 'This is fresh guidance'}

Your job is to:
1. Detect if the user wants to generate/regenerate souls now (words like "generate", "create", "ready", "done", "that's it", "go ahead", "regenerate", "remake")
2. If they want to generate, ask if they're ready to proceed (be enthusiastic!)
3. If they're giving new guidance, respond conversationally and extract it
4. If they have existing guidance and add more, offer to regenerate with all the guidance

Respond with this JSON structure:
{
  "response": "A friendly, conversational response (2-3 sentences max, casual tone)",
  "guidance": "Clean, actionable guidance extracted from their input (only if they gave new guidance)",
  "type": "character_reference | style_adjustment | role_definition | tone_preference | energy_level | communication_style | general",
  "shouldGenerate": false
}

Rules:
- If they want to generate/regenerate: set shouldGenerate to true and ask "Ready to generate?" or "Want me to regenerate with this new guidance?"
- If they're giving guidance: set shouldGenerate to false and extract the guidance
- If they add guidance to existing guidance: acknowledge it and ask if they want to regenerate

Examples:
- "make them more like Hermione" → shouldGenerate: false, extract guidance
- "that's good, generate them" → shouldGenerate: true, ask if ready
- "regenerate them" → shouldGenerate: true, ask if ready  
- "want me to regenerate?" → shouldGenerate: true, ask if ready
- Adding guidance when guidance exists → acknowledge and ask "Want me to regenerate with all this guidance?"

Be natural and conversational.
`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
      temperature: 0.4
    })

    let content = response.choices[0].message.content
    content = cleanJSONResponse(content)
    return JSON.parse(content)
  } catch (error) {
    console.error('Conversational response error:', error)
    // Fallback response
    const shouldGenerate = userInput.toLowerCase().includes('generate') || 
                          userInput.toLowerCase().includes('ready') || 
                          userInput.toLowerCase().includes('create') ||
                          userInput.toLowerCase().includes('regenerate')
    
    return {
      response: shouldGenerate 
        ? "Ready to generate your souls?" 
        : "Got it! I'll incorporate that into the soul generation.",
      guidance: shouldGenerate ? "" : userInput,
      type: "general",
      shouldGenerate
    }
  }
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

export const generateSouls = async (compressedContext, nudges = []) => {
  // Build nudge context dynamically
  let nudgeContext = ''
  
  if (nudges.length > 0) {
    nudgeContext = `
USER GUIDANCE FOR SOUL CREATION:
The user has provided the following guidance for how they want the agent souls to be:

${nudges.map((nudge, index) => `${index + 1}. ${nudge.original} (Interpreted as: ${nudge.guidance})`).join('\n')}

IMPORTANT: Interpret these nudges creatively and appropriately for the ${compressedContext.domain} domain. 
- If character references are made (like "Hermione Granger", "Lister", etc.), extract the communication patterns and personality traits that would work well for this content domain
- If style preferences are mentioned (like "more analytical", "casual", "mentor-like"), adjust the personality traits accordingly
- If role preferences are specified, ensure the agent souls embody those characteristics while staying relevant to the content
- Balance user preferences with content domain appropriateness - don't force characteristics that don't fit the material

Generate souls that reflect these preferences while ensuring they remain effective for the ${compressedContext.domain} content.
`
  }

  const prompt = `
Generate 3 distinct conversational agent approaches for this specific content domain.

CONTENT ANALYSIS:
${JSON.stringify(compressedContext, null, 2)}

${nudgeContext}

Create 3 different agent personalities that could help users interact with this content. Base everything on the actual content domain${nudges.length > 0 ? ' while incorporating the user guidance above' : ' - don\'t force emotional themes if they don\'t exist'}.

${nudges.length > 0 ? 'Each soul should reflect the user\'s preferences in different ways, creating variety while honoring their guidance.' : 'Make each soul genuinely different in tone, emotion, energy, and approach to the SAME content domain.'}

Return ONLY this JSON structure:

{
  "souls": [
    {
      "agent_name": "Name reflecting the content domain${nudges.length > 0 ? ' and user preferences' : ''}",
      "role": "What this agent does within the content scope", 
      "description": "How this agent helps users with this specific content${nudges.length > 0 ? ', incorporating user guidance' : ''}",
      "tone": "communication style (blunt, supportive, analytical, casual, enthusiastic, etc.)${nudges.length > 0 ? ' - influenced by user preferences' : ''}",
      "emotion": "emotional state (excitement, focus, determination, curiosity, calm, etc.)${nudges.length > 0 ? ' - adjusted per user guidance' : ''}",
      "energy": "activity level (high, moderate, low, dynamic, steady, etc.)${nudges.length > 0 ? ' - reflecting user preferences' : ''}",
      "specialization": "what makes this agent unique for this content${nudges.length > 0 ? ', considering user guidance' : ''}",
      "response_expression": {
        "preferred_type": "natural communication form (diagnostic, narrative, conversational, structured, exploratory, etc.)${nudges.length > 0 ? ' - adapted to user preferences' : ''}",
        "adaptive_variance": "flexibility level (high, moderate, low)",
        "format_bias": ["primary format tendencies like: story, list, dialogue, reflection, analysis, tutorial${nudges.length > 0 ? ' - influenced by user style preferences' : ''}"]
      },
      "response_approach": "how this agent processes and responds to queries${nudges.length > 0 ? ', incorporating user guidance' : ''}",
      "stall_recovery_protocol": "how agent handles unknown topics",
      "bad_input_response_style": "how agent redirects off-topic requests",
      "bridging_strategy": "how agent connects unfamiliar requests to known content",
      "content_boundaries": ["what this agent can discuss from the content"],
      "scope_limitations": ["what's outside this agent's knowledge/role"],
      "interaction_pattern": "how conversations with this agent typically flow${nudges.length > 0 ? ', reflecting user preferences' : ''}",
      "value_proposition": "specific benefit this agent provides for this content${nudges.length > 0 ? ', enhanced by user guidance' : ''}"
    }
  ]
}

${nudges.length > 0 ? 'Ensure each soul interprets the user guidance differently while maintaining effectiveness for the content domain.' : 'Make each soul genuinely different in tone, emotion, energy, and approach to the SAME content domain.'}
`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 2500,
      temperature: nudges.length > 0 ? 0.8 : 0.7, // Higher creativity when nudges are provided
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
Generate behavioral configuration for this agent based on expressive soul instincts.

CONTENT ANALYSIS:
${JSON.stringify(compressedContext, null, 2)}

CHOSEN SOUL:
${JSON.stringify(chosenSoul, null, 2)}

Create behavioral rules that encode the agent's natural communication fingerprint as operational guidance.

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

EXPRESSIVE SOUL PROFILE:
- Tone: ${chosenSoul.tone} - this controls your communicative attitude and approach
- Emotion: ${chosenSoul.emotion} - this drives your emotional state and relational dynamics  
- Energy: ${chosenSoul.energy} - this sets your pacing and assertiveness level
- Expression Style: ${chosenSoul.response_expression.preferred_type} with ${chosenSoul.response_expression.adaptive_variance} flexibility
- Format Instincts: Naturally gravitates toward ${chosenSoul.response_expression.format_bias.join(', ')} when expressing ideas

COMMUNICATION FINGERPRINT:
This agent expresses insight through ${chosenSoul.response_expression.preferred_type} form and adapts fluidly to conversation needs. While maintaining natural ${chosenSoul.tone} attitude and ${chosenSoul.emotion} engagement, it avoids rigid repetition and favors authentic expression that matches the situational context.

BEHAVIORAL INSTINCTS:
- Stall Recovery: When uncertain about specifics - ${chosenSoul.stall_recovery_protocol}
- Redirect Style: When requests go off-topic - ${chosenSoul.bad_input_response_style}  
- Bridging Approach: ${chosenSoul.bridging_strategy}

CRITICAL BEHAVIORAL ENFORCEMENT:
1. PARTNERSHIP FRAMING: Always use WE/US collaborative language - you're executing together with the user
2. NEVER-BLOCK PRINCIPLE: Never say 'not covered' or 'not in knowledge base' - bridge with applicable principles
3. ADAPTIVE EXPRESSION: Let your soul's communication instincts guide response form naturally
4. LIST HANDLING: When listing information, still apply expression styles ${chosenSoul.response_expression.preferred_type} with ${chosenSoul.response_expression.adaptive_variance} flexibility.
5. 95% ACCURACY RESPONSES: Aim for 95% accuracy in responses, but if uncertain, use bridging strategies to connect to known content or opt to ask user for more context.

CONVERSATION MEMORY:
Maintain awareness of user goals, constraints, context, and progress throughout the dialogue.

CONTENT KNOWLEDGE BASE:
Your expertise stems from uploaded content about ${compressedContext.domain}. When users ask beyond direct coverage, acknowledge briefly then bridge using core principles while maintaining natural expression flow.

PARTNERSHIP LANGUAGE EXAMPLES:
- Replace 'jot down your criteria' → 'we're mapping our criteria now'",
    "response_constraints": [
      "Express through your natural ${chosenSoul.response_expression.preferred_type} communication instincts",
      "BANNED PHRASES: 'not in content', 'don't have information', 'not covered'", 
      "Use WE/US/OUR collaborative partnership language",
      "Blend ${chosenSoul.tone} tone, ${chosenSoul.emotion} emotion, and ${chosenSoul.energy} energy authentically",
      "Reference uploaded content methods and principles, not generic advice",
      "Adapt format naturally using ${chosenSoul.response_expression.format_bias.join('/')} instincts"
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