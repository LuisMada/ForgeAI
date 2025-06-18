// src/services/okpo.js

class OkPoClient {
    constructor() {
      this.token = import.meta.env.VITE_OKPO_ACCESS_TOKEN
      this.baseUrl = "https://okpo.com/api/1.1/wf"
      this.headers = { "Authorization": `Bearer ${this.token}` }
    }
  
    async createAgent(agentConfig) {
      const { agentName, systemPrompt, greeting, description } = agentConfig
      
      const data = {
        "gpt_model": "gpt-4o-mini",
        "display_name": agentName,
        "description": description,
        "first_greeting": greeting,
        "system_instructions": systemPrompt,
        "behavior_content": "Helpful and professional",
        "content_description": "AI Assistant"
      }
  
      try {
        // Create FormData properly
        const formData = new FormData()
        Object.entries(data).forEach(([key, value]) => {
          formData.append(key, value)
        })
  
        const response = await fetch(`${this.baseUrl}/create_character`, {
          method: 'POST',
          headers: this.headers,
          body: formData
        })
  
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
  
        const result = await response.json()
        
        if (result.status === "success") {
          const agentData = result.response
          return {
            success: true,
            id: agentData.unique_id,
            url: agentData.redirect_url,
            message: agentData.message
          }
        } else {
          throw new Error(result.message || 'Failed to create agent')
        }
      } catch (error) {
        console.error('OkPo agent creation error:', error)
        throw new Error(`Failed to create OkPo agent: ${error.message}`)
      }
    }
  
    async startConversation(message, assistantId, username = "User") {
      const data = {
        "assistant_id": assistantId,
        "user_message": message,
        "username": username
      }
  
      try {
        const response = await fetch(`${this.baseUrl}/create_thread_and_run`, {
          method: 'POST',
          headers: {
            ...this.headers,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
  
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
  
        const result = await response.json()
        
        if (result.status === "success") {
          return {
            threadId: result.response.thread_id,
            runId: result.response.run_id,
            status: result.response.status
          }
        } else {
          throw new Error(result.message || 'Failed to start conversation')
        }
      } catch (error) {
        console.error('OkPo conversation start error:', error)
        throw error
      }
    }
  
    async checkRunStatus(threadId, runId) {
      const params = new URLSearchParams({
        thread_id: threadId,
        run_id: runId
      })
  
      try {
        const response = await fetch(`${this.baseUrl}/retrieve_run?${params}`, {
          method: 'GET',
          headers: this.headers
        })
  
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
  
        const result = await response.json()
        
        if (result.status === "success") {
          return result.response.status
        } else {
          throw new Error(result.message || 'Failed to check run status')
        }
      } catch (error) {
        console.error('OkPo run status check error:', error)
        throw error
      }
    }
  
    async getMessage(threadId, runId) {
      const formData = new FormData()
      formData.append('thread_id', threadId)
      formData.append('run_id', runId)
  
      try {
        const response = await fetch(`${this.baseUrl}/retrieve_run_message`, {
          method: 'POST',
          headers: this.headers,
          body: formData
        })
  
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
  
        const result = await response.json()
        
        if (result.status === "success") {
          return {
            message: result.response.message,
            disposition: result.response.disposition,
            messageId: result.response.message_id
          }
        } else {
          throw new Error(result.message || 'Failed to get message')
        }
      } catch (error) {
        console.error('OkPo message retrieval error:', error)
        throw error
      }
    }
  
    async waitForCompletion(threadId, runId, maxWaitTime = 30000) {
      const startTime = Date.now()
      const pollInterval = 1000 // 1 second
  
      while (Date.now() - startTime < maxWaitTime) {
        const status = await this.checkRunStatus(threadId, runId)
        
        if (status === "completed") {
          return true
        } else if (status === "failed") {
          throw new Error("Assistant run failed")
        }
        
        // Wait before next poll
        await new Promise(resolve => setTimeout(resolve, pollInterval))
      }
      
      throw new Error("Timeout waiting for assistant response")
    }
  
    async testAgent(assistantId, testMessage = "Hello! Can you tell me what you can help with?") {
      try {
        // Start conversation
        const { threadId, runId } = await this.startConversation(testMessage, assistantId)
        
        // Wait for completion
        await this.waitForCompletion(threadId, runId)
        
        // Get response
        const { message } = await this.getMessage(threadId, runId)
        
        return {
          success: true,
          testMessage,
          response: message,
          threadId
        }
      } catch (error) {
        console.error('OkPo agent test error:', error)
        return {
          success: false,
          error: error.message
        }
      }
    }
  }
  
  // Export utility function for easy agent creation
  export const exportToOkPo = async (soul, behaviorConfig, compressedContext) => {
    const client = new OkPoClient()
    
    // Prepare agent configuration
    const agentConfig = {
      agentName: behaviorConfig.deployment_config.agent_name,
      systemPrompt: behaviorConfig.deployment_config.system_prompt,
      greeting: behaviorConfig.deployment_config.witty_greeting,
      description: `${soul.role}. ${compressedContext.domain}. ${soul.description}`
    }
  
    try {
      // Create the agent
      const result = await client.createAgent(agentConfig)
      
      if (result.success) {
        // Test the agent to verify it's working
        const testResult = await client.testAgent(result.id)
        
        return {
          success: true,
          agent: result,
          test: testResult,
          client // Return client for potential future use
        }
      }
    } catch (error) {
      console.error('Export to OkPo failed:', error)
      throw error
    }
  }
  
  export default OkPoClient