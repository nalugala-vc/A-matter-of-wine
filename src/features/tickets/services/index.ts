import apiClient from '../../../lib/api'
import {
  Ticket,
  TicketApiResponse,
  TicketListApiResponse,
  TicketValidationApiResponse,
  TicketValidationResult,
  MockPaymentData,
  transformTicket,
} from '../types'

export async function purchaseTicket(eventId: string, quantity: number = 1): Promise<Ticket> {
  const response = await apiClient.post<TicketApiResponse>(
    `/tickets/events/${eventId}/purchase`,
    { quantity }
  )
  return transformTicket(response.data)
}

export async function confirmPayment(paymentData: MockPaymentData): Promise<Ticket> {
  const response = await apiClient.post<TicketApiResponse>(
    '/tickets/payments/confirm',
    paymentData
  )
  return transformTicket(response.data)
}

export async function getMyTickets(
  page: number = 1,
  pageSize: number = 20,
  status?: string
): Promise<{ tickets: Ticket[]; total: number; page: number; pageSize: number }> {
  const response = await apiClient.get<TicketListApiResponse>('/tickets/mine', {
    params: {
      page,
      page_size: pageSize,
      status: status || undefined,
    },
  })
  return {
    tickets: response.data.tickets.map(transformTicket),
    total: response.data.total,
    page: response.data.page,
    pageSize: response.data.page_size,
  }
}

export async function getTicket(ticketCode: string): Promise<Ticket> {
  const response = await apiClient.get<TicketApiResponse>(`/tickets/${ticketCode}`)
  return transformTicket(response.data)
}

export function getTicketQrUrl(ticketCode: string): string {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
  return `${baseUrl}/tickets/${ticketCode}/qr`
}

export async function cancelTicket(ticketCode: string): Promise<Ticket> {
  const response = await apiClient.post<TicketApiResponse>(`/tickets/${ticketCode}/cancel`)
  return transformTicket(response.data)
}

export async function validateTicket(ticketCode: string): Promise<TicketValidationResult> {
  const response = await apiClient.post<TicketValidationApiResponse>(
    `/tickets/${ticketCode}/validate`
  )
  return {
    valid: response.data.valid,
    message: response.data.message,
    ticket: response.data.ticket ? transformTicket(response.data.ticket) : null,
  }
}
