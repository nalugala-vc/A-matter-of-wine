import apiClient from '../../../lib/api'
import { 
  Conversation,
  Message,
  ChatResponse,
  FeedbackType,
  ConversationApiResponse, 
  ConversationListApiResponse,
  ChatApiResponse,
  MessageApiResponse,
  transformConversation,
  transformChatResponse,
  transformMessage,
} from '../types'

export async function getConversations(): Promise<{ conversations: Conversation[]; total: number }> {
  const response = await apiClient.get<ConversationListApiResponse>('/sommelier/conversations')
  
  return {
    conversations: response.data.conversations.map(transformConversation),
    total: response.data.total,
  }
}

export async function getConversation(conversationId: string): Promise<Conversation> {
  const response = await apiClient.get<ConversationApiResponse>(`/sommelier/conversations/${conversationId}`)
  return transformConversation(response.data)
}

export async function createConversation(initialMessage?: string): Promise<Conversation> {
  const response = await apiClient.post<ConversationApiResponse>('/sommelier/conversations', {
    initial_message: initialMessage,
  })
  return transformConversation(response.data)
}

export async function sendMessage(conversationId: string, text: string): Promise<ChatResponse> {
  const response = await apiClient.post<ChatApiResponse>(
    `/sommelier/conversations/${conversationId}/messages`,
    { text }
  )
  return transformChatResponse(response.data)
}

export async function addFeedback(
  conversationId: string, 
  messageId: string, 
  feedback: FeedbackType
): Promise<void> {
  await apiClient.post(`/sommelier/conversations/${conversationId}/messages/${messageId}/feedback`, {
    feedback,
  })
}

export async function regenerateMessage(
  conversationId: string, 
  messageId: string
): Promise<Message> {
  const response = await apiClient.post<MessageApiResponse>(
    `/sommelier/conversations/${conversationId}/messages/${messageId}/regenerate`
  )
  return transformMessage(response.data)
}

export async function deleteConversation(conversationId: string): Promise<void> {
  await apiClient.delete(`/sommelier/conversations/${conversationId}`)
}
