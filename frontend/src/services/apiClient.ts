/**
 * API Client for Chat Interface
 */

interface ChatRequest {
  message: string;
  conversation_id?: number;
}

interface ChatResponse {
  conversation_id: number;
  response: string;
  tool_calls: Array<{
    name: string;
    arguments: Record<string, any>;
  }>;
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
  }

  /**
   * Send a chat message to the backend
   */
  async sendChatMessage(userId: string, request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/${userId}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sending chat message:', error);
      throw error;
    }
  }

  /**
   * Get auth token from localStorage or other storage mechanism
   */
  private getAuthToken(): string {
    // In a real implementation, this would retrieve the auth token
    // from wherever it's stored (localStorage, cookies, etc.)
    return localStorage.getItem('authToken') || '';
  }

  /**
   * Get conversation history
   */
  async getConversationHistory(userId: string, conversationId: number): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/${userId}/conversations/${conversationId}/messages`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching conversation history:', error);
      throw error;
    }
  }
}

export default new ApiClient();