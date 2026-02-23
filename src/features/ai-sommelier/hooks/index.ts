import { useState, useEffect, useCallback } from 'react'
import { Conversation, Message, FeedbackType } from '../types'
import { 
  getConversations, 
  getConversation, 
  createConversation,
  sendMessage, 
  addFeedback,
  regenerateMessage,
  deleteConversation,
} from '../services'

interface UseConversationsState {
  conversations: Conversation[]
  total: number
  loading: boolean
  error: string | null
}

export function useConversations() {
  const [state, setState] = useState<UseConversationsState>({
    conversations: [],
    total: 0,
    loading: true,
    error: null,
  })

  const fetchConversations = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const result = await getConversations()
      setState({
        conversations: result.conversations,
        total: result.total,
        loading: false,
        error: null,
      })
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch conversations',
      }))
    }
  }, [])

  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  const removeConversation = async (conversationId: string) => {
    await deleteConversation(conversationId)
    await fetchConversations()
  }

  return {
    ...state,
    refetch: fetchConversations,
    deleteConversation: removeConversation,
  }
}

interface UseConversationState {
  conversation: Conversation | null
  messages: Message[]
  loading: boolean
  sending: boolean
  error: string | null
}

export function useConversation(conversationId: string | null) {
  const [state, setState] = useState<UseConversationState>({
    conversation: null,
    messages: [],
    loading: !!conversationId,
    sending: false,
    error: null,
  })

  const fetchConversation = useCallback(async () => {
    if (!conversationId) {
      setState({ conversation: null, messages: [], loading: false, sending: false, error: null })
      return
    }

    setState(prev => ({ ...prev, loading: true, error: null }))
    
    try {
      const conversation = await getConversation(conversationId)
      setState({
        conversation,
        messages: conversation.messages,
        loading: false,
        sending: false,
        error: null,
      })
    } catch (err) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to fetch conversation',
      }))
    }
  }, [conversationId])

  useEffect(() => {
    fetchConversation()
  }, [fetchConversation])

  const send = async (text: string): Promise<void> => {
    if (!conversationId) return

    setState(prev => ({ ...prev, sending: true, error: null }))
    
    try {
      const response = await sendMessage(conversationId, text)
      
      setState(prev => ({
        ...prev,
        messages: [...prev.messages, response.userMessage, response.aiMessage],
        sending: false,
      }))
    } catch (err) {
      setState(prev => ({
        ...prev,
        sending: false,
        error: err instanceof Error ? err.message : 'Failed to send message',
      }))
      throw err
    }
  }

  const giveFeedback = async (messageId: string, feedback: FeedbackType): Promise<void> => {
    if (!conversationId) return

    try {
      await addFeedback(conversationId, messageId, feedback)
      
      // Update local state
      setState(prev => ({
        ...prev,
        messages: prev.messages.map(msg => 
          msg.id === messageId ? { ...msg, feedback } : msg
        ),
      }))
    } catch (err) {
      throw err
    }
  }

  const regenerate = async (messageId: string): Promise<void> => {
    if (!conversationId) return

    setState(prev => ({ ...prev, sending: true }))
    
    try {
      const newMessage = await regenerateMessage(conversationId, messageId)
      
      // Update the message in local state
      setState(prev => ({
        ...prev,
        messages: prev.messages.map(msg => 
          msg.id === messageId ? newMessage : msg
        ),
        sending: false,
      }))
    } catch (err) {
      setState(prev => ({ ...prev, sending: false }))
      throw err
    }
  }

  return {
    ...state,
    refetch: fetchConversation,
    sendMessage: send,
    giveFeedback,
    regenerateMessage: regenerate,
  }
}

// Hook to manage a chat session (create new or load existing)
export function useChatSession() {
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startNewConversation = async (initialMessage?: string): Promise<string> => {
    setCreating(true)
    setError(null)
    
    try {
      const conversation = await createConversation(initialMessage)
      setConversationId(conversation.id)
      return conversation.id
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create conversation')
      throw err
    } finally {
      setCreating(false)
    }
  }

  const loadConversation = (id: string) => {
    setConversationId(id)
  }

  const clearConversation = () => {
    setConversationId(null)
  }

  return {
    conversationId,
    creating,
    error,
    startNewConversation,
    loadConversation,
    clearConversation,
  }
}
