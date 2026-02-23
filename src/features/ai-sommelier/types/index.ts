export type MessageSender = 'user' | 'ai'
export type FeedbackType = 'up' | 'down'

export interface Message {
  id: string
  text: string
  sender: MessageSender
  feedback?: FeedbackType
  createdAt: string
}

export interface Conversation {
  id: string
  title?: string
  messages: Message[]
  createdAt: string
  updatedAt: string
}

export interface ConversationListResponse {
  conversations: Conversation[]
  total: number
}

export interface ChatResponse {
  conversationId: string
  userMessage: Message
  aiMessage: Message
}

// API response types (snake_case from backend)
export interface MessageApiResponse {
  id: string
  text: string
  sender: MessageSender
  feedback?: FeedbackType
  created_at: string
}

export interface ConversationApiResponse {
  id: string
  title?: string
  messages: MessageApiResponse[]
  created_at: string
  updated_at: string
}

export interface ConversationListApiResponse {
  conversations: ConversationApiResponse[]
  total: number
}

export interface ChatApiResponse {
  conversation_id: string
  user_message: MessageApiResponse
  ai_message: MessageApiResponse
}

// Transform functions
export function transformMessage(api: MessageApiResponse): Message {
  return {
    id: api.id,
    text: api.text,
    sender: api.sender,
    feedback: api.feedback,
    createdAt: api.created_at,
  }
}

export function transformConversation(api: ConversationApiResponse): Conversation {
  return {
    id: api.id,
    title: api.title,
    messages: api.messages.map(transformMessage),
    createdAt: api.created_at,
    updatedAt: api.updated_at,
  }
}

export function transformChatResponse(api: ChatApiResponse): ChatResponse {
  return {
    conversationId: api.conversation_id,
    userMessage: transformMessage(api.user_message),
    aiMessage: transformMessage(api.ai_message),
  }
}
