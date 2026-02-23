export interface Ticket {
  id: string
  ticketCode: string
  eventId: string
  userId: string
  userEmail: string
  userName: string
  eventTitle: string
  eventDate: string
  eventLocation: string
  quantity: number
  amountPaid: number
  status: TicketStatus
  paymentToken: string | null
  qrCodeUrl: string | null
  purchasedAt: string | null
  checkedInAt: string | null
  createdAt: string
  updatedAt: string
}

export type TicketStatus = 'pending_payment' | 'confirmed' | 'cancelled' | 'checked_in'

export interface TicketListResponse {
  tickets: Ticket[]
  total: number
  page: number
  pageSize: number
}

export interface TicketValidationResult {
  valid: boolean
  message: string
  ticket: Ticket | null
}

// API response types (snake_case from backend)
export interface TicketApiResponse {
  id: string
  ticket_code: string
  event_id: string
  user_id: string
  user_email: string
  user_name: string
  event_title: string
  event_date: string
  event_location: string
  quantity: number
  amount_paid: number
  status: TicketStatus
  payment_token: string | null
  qr_code_url: string | null
  purchased_at: string | null
  checked_in_at: string | null
  created_at: string
  updated_at: string
}

export interface TicketListApiResponse {
  tickets: TicketApiResponse[]
  total: number
  page: number
  page_size: number
}

export interface TicketValidationApiResponse {
  valid: boolean
  message: string
  ticket: TicketApiResponse | null
}

export interface MockPaymentData {
  ticket_id: string
  payment_token: string
  card_number: string
  card_holder: string
  expiry: string
  cvv: string
}

export function transformTicket(api: TicketApiResponse): Ticket {
  return {
    id: api.id,
    ticketCode: api.ticket_code,
    eventId: api.event_id,
    userId: api.user_id,
    userEmail: api.user_email,
    userName: api.user_name,
    eventTitle: api.event_title,
    eventDate: api.event_date,
    eventLocation: api.event_location,
    quantity: api.quantity,
    amountPaid: api.amount_paid,
    status: api.status,
    paymentToken: api.payment_token,
    qrCodeUrl: api.qr_code_url,
    purchasedAt: api.purchased_at,
    checkedInAt: api.checked_in_at,
    createdAt: api.created_at,
    updatedAt: api.updated_at,
  }
}
