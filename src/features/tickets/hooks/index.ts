import { useState, useEffect, useCallback } from 'react'
import { Ticket, MockPaymentData } from '../types'
import {
  purchaseTicket as purchaseTicketApi,
  confirmPayment as confirmPaymentApi,
  getMyTickets,
  getTicket,
  cancelTicket as cancelTicketApi,
} from '../services'

interface UseTicketPurchaseState {
  ticket: Ticket | null
  loading: boolean
  error: string | null
  step: 'idle' | 'purchasing' | 'awaiting_payment' | 'processing_payment' | 'confirmed' | 'error'
}

export function useTicketPurchase() {
  const [state, setState] = useState<UseTicketPurchaseState>({
    ticket: null,
    loading: false,
    error: null,
    step: 'idle',
  })

  const purchase = async (eventId: string, quantity: number = 1) => {
    setState({ ticket: null, loading: true, error: null, step: 'purchasing' })

    try {
      const ticket = await purchaseTicketApi(eventId, quantity)

      if (ticket.status === 'confirmed') {
        // Free event - auto-confirmed
        setState({ ticket, loading: false, error: null, step: 'confirmed' })
      } else {
        setState({ ticket, loading: false, error: null, step: 'awaiting_payment' })
      }

      return ticket
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to purchase ticket'
      setState({ ticket: null, loading: false, error: message, step: 'error' })
      throw err
    }
  }

  const confirmPayment = async (paymentData: MockPaymentData) => {
    setState((prev) => ({ ...prev, loading: true, error: null, step: 'processing_payment' }))

    try {
      const ticket = await confirmPaymentApi(paymentData)
      setState({ ticket, loading: false, error: null, step: 'confirmed' })
      return ticket
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Payment failed'
      setState((prev) => ({ ...prev, loading: false, error: message, step: 'error' }))
      throw err
    }
  }

  const reset = () => {
    setState({ ticket: null, loading: false, error: null, step: 'idle' })
  }

  return {
    ...state,
    purchase,
    confirmPayment,
    reset,
  }
}

interface UseMyTicketsState {
  tickets: Ticket[]
  total: number
  loading: boolean
  error: string | null
}

export function useMyTickets(statusFilter?: string) {
  const [state, setState] = useState<UseMyTicketsState>({
    tickets: [],
    total: 0,
    loading: true,
    error: null,
  })

  const fetchTickets = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const result = await getMyTickets(1, 50, statusFilter)
      setState({
        tickets: result.tickets,
        total: result.total,
        loading: false,
        error: null,
      })
    } catch (err: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err.response?.data?.detail || 'Failed to load tickets',
      }))
    }
  }, [statusFilter])

  useEffect(() => {
    fetchTickets()
  }, [fetchTickets])

  return {
    ...state,
    refetch: fetchTickets,
  }
}

interface UseTicketState {
  ticket: Ticket | null
  loading: boolean
  error: string | null
}

export function useTicket(ticketCode: string | null) {
  const [state, setState] = useState<UseTicketState>({
    ticket: null,
    loading: !!ticketCode,
    error: null,
  })

  const fetchTicket = useCallback(async () => {
    if (!ticketCode) {
      setState({ ticket: null, loading: false, error: null })
      return
    }

    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const ticket = await getTicket(ticketCode)
      setState({ ticket, loading: false, error: null })
    } catch (err: any) {
      setState({
        ticket: null,
        loading: false,
        error: err.response?.data?.detail || 'Ticket not found',
      })
    }
  }, [ticketCode])

  useEffect(() => {
    fetchTicket()
  }, [fetchTicket])

  const cancel = async () => {
    if (!ticketCode) return

    try {
      const updated = await cancelTicketApi(ticketCode)
      setState((prev) => ({ ...prev, ticket: updated }))
      return updated
    } catch (err: any) {
      throw err
    }
  }

  return {
    ...state,
    refetch: fetchTicket,
    cancel,
  }
}
