export interface MessageContent {
  message: string
}

export interface Notice {
  id: number
  title: string
  content: string
  from_date: Date
  to_date: Date
}

export interface NoticeContent extends Notice {
  name: string
  content: string
}

export interface Rule {
  id: number
}

export interface RuleContent extends Rule {
  content: string
}

export interface Version {
  id: number
}

export interface VersionContent extends Version {
  content: string
}

export interface Privacy {
  id: number
}

export interface PrivacyContent extends Privacy {
  content: string
}

export interface Plan {
  id: number
  store_plan_id: string
  name: string
  description: string
  price: number
  max_file: number
  duration: number
  duration_type: number
  start_time: Date
  expire_time: Date
  buffer_time: Date
}

export interface User {
  id: number
  last_name: string
  first_name: string
  hashed_id: string
  email: string
  email_verified_at: string
  company: string
  affiliation: string
  started_at: string
  created_at: string
  updated_at: string
  deactivation: number
  deleted_at: string
  start_time: string
  expire_time: string
  latest_status_checked_at: string
  plan_status: number
  plan_name: string
  app_plan_name: string
  ticket_name: string
  plan_type: number
  lot_id: number
  plan: Plan
}

export interface Admin {
  id: number
  admin_id: string
  email: string
  created_at: string
  updated_at: string
  deleted_at: string
}

export interface Post {
  folder_id: number
  folder_name: string
  files: {
    id: number
    file_id: string
    isSafe: boolean
  }[]
}

export interface Report {
  id: number
  post_file_id: number
  name: string
  email: string
  content: string
  created_at: string
  updated_at: string
  ai_report_status: number
}

export interface AiReport {
  id: number
  post_file_id: number
  report_data: string
  created_at: string
  updated_at: string
}

export interface File {
  id: number
  folder_id: string
  file_id: number
  file_name: string
  address: string
  shooting_place_lat: string
  shooting_place_long: string
  shooting_datetime: string
  device_uuid: string
  stash: number
  stop_shared: number
  report_status: number
  ai_report_status: number
  scheduled_at: string
  created_at: string
  updated_at: string
  user_id: number
  hashed_id: string
  file_url_accessed: boolean
  folder_share_key: string
  file_share_key: string
  report: Report[]
  ai_report: AiReport
  extension: string
  user_name: string
  folder_name: string
  created_at_posts: string
  email: string
  folder_url_accessed: string
}

export interface Payment {
  id: number
  user_id: number
  receipt: string
  signature: string
  plan: string
  platform: number
  created_at: string
  updated_at: string
}

export interface PaymentTransactions extends Payment {
  id: number
  receipt: string
  signature: string
  plan: string
  platform: number
  last_name: string
  first_name: string
  payment_status: number
  start_time: string
  expire_time: string
  created_at: string
  updated_at: string
}

export interface PaymentTransactionsUser {
  last_name: string
  first_name: string
  hashed_id: string
  email: string
}

export interface Ticket {
  id: number
  company_id: string
  company_name: string
  user_id: number | null
  email: string | null
  fullname: string | null
  user_company_name: string | null
  lot_id: number
  no: string
  plan_type: number
  plan_type_label: string
  name: string
  is_active: number
  status: number
  start_on: Date | null
  end_on: Date | null
  start_time: string
  expire_time: string
  issued_at: Date
  created_at: string
}
