export type AvailabilityStatus = "IN STOCK" | "LIMITED STOCK" | "OUT OF STOCK";

export type OrderStatus =
  | "NEW"
  | "CONFIRMED"
  | "PROCESSING"
  | "READY_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export type CampaignStatus =
  | "DRAFT"
  | "QUEUED"
  | "SENDING"
  | "COMPLETED"
  | "PARTIALLY_COMPLETED"
  | "FAILED"
  | "CANCELLED";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  is_active: boolean | number;
  created_at: string;
  updated_at?: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  r2_key: string;
  alt_text?: string;
  sort_order?: number;
  is_primary: boolean | number;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  category_name?: string;
  description: string;
  price: number; // in UGX
  discount_price?: number | null;
  currency?: string;
  availability: AvailabilityStatus;
  is_featured: boolean | number;
  is_new_arrival: boolean | number;
  is_active: boolean | number;
  specifications?: Record<string, string>;
  images: ProductImage[];
  created_at: string;
  updated_at?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name_snapshot: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  location: string;
  delivery_address: string;
  note?: string;
  status: OrderStatus;
  total_amount: number;
  currency?: string;
  items?: OrderItem[];
  created_at: string;
  updated_at?: string;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  email?: string;
  location?: string | null;
  address?: string | null;
  source: string;
  marketing_opt_in: boolean | number;
  is_active?: boolean | number;
  groups?: string[];
  created_at: string;
  updated_at?: string;
}

export interface ContactGroup {
  id: string;
  name: string;
  description?: string;
  member_count?: number;
  created_at: string;
}

export interface SmsCampaign {
  id: string;
  name: string;
  type: "PRODUCT" | "GENERAL_BROADCAST";
  message_template: string;
  product_id?: string;
  recipient_count: number;
  sms_units?: number;
  estimated_cost: number;
  actual_cost?: number;
  status: CampaignStatus;
  created_by?: string;
  created_at: string;
  updated_at?: string;
}
