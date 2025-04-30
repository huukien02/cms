export type Lot = {
  id: number
  company_id: string
  company_name: string
  plan_metadata: [
    {
      quantity: number
      plan_type: number
    },
    {
      quantity: number
      plan_type: number
    },
    {
      quantity: number
      plan_type: number
    },
  ]
  is_active: number
  start_on: Date
  end_on: Date
  issued_at: Date
  ticket_count: number
  rest_ticket_count: number
}

export type LotParams = {
  page?: number
  query?: string
  company_id?: string
  company_name?: string
  di?: number
  branch_number?: number
  issued_from?: string
  issued_to?: string
  end_on_from?: string
  end_on_to?: string
  is_active?: 0 | 1
  plan_type?: 1 | 2 | 3
  duration_type?: 0 | 1
}

export type LotSearchFormValue = {
  query?: string
  companyId?: string
  companyName?: string
  lot_id?: number
  branchNumber?: number
  issuedFrom?: Date
  issuedTo?: Date
  endOnFrom?: Date
  endOnTo?: Date
  isActive?: 0 | 1
  planType?: 1 | 2 | 3
  durationType?: 0 | 1
  freeWord?: string
  plan_type?: number
}

export type LotResponse = {
  code: string
  data: Lot[]
  last_page: number
  current_page: number
  per_page: number
  total: number
}
