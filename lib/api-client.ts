// API client for interacting with the Python Lambda backend

interface CreateReplyPayload {
  message: string
  key: string
  category: string
}

interface UpdateReplyPayload {
  key: string
  message?: string
  category?: string
}

// Replace these API endpoints with your actual Lambda API endpoints
const API_BASE_URL = "http://127.0.0.1:8000"

export const apiClient = {
  // Get all replies
  async getReplies() {
    try {
      const response = await fetch(`${API_BASE_URL}/replies`)
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error("Error fetching replies:", error)
      throw error
    }
  },

  // Create a new reply
  async createReply(data: CreateReplyPayload) {
    try {
      const response = await fetch(`${API_BASE_URL}/replies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error("Error creating reply:", error)
      throw error
    }
  },

  // Update an existing reply
  async updateReply(data: UpdateReplyPayload) {
    try {
      const response = await fetch(`${API_BASE_URL}/replies/${data.key}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error("Error updating reply:", error)
      throw error
    }
  },

  // Delete a reply
  async deleteReply(key: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/replies/${key}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error("Error deleting reply:", error)
      throw error
    }
  },

  // Auto-reply to a single Jira issue
  async autoReplyJira(key: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/replies/${key}/auto-reply`, {
        method: "POST",
      })
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error("Error auto-replying to Jira:", error)
      throw error
    }
  },

  // Auto-reply to all Jira issues
  async autoReplyAllJira() {
    try {
      const response = await fetch(`${API_BASE_URL}/replies/auto-reply-all`, {
        method: "POST",
      })
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error("Error auto-replying to all Jira issues:", error)
      throw error
    }
  },
}
