export type Role = 'USER' | 'ORGANIZER' | 'ADMIN';
export type OrderStatus = 'PENDING' | 'PAID' | 'CANCELLED' | 'EXPIRED';
export type PaymentMethod = 
  | 'QRIS'
  | 'BCA_VA'
  | 'MANDIRI_VA'
  | 'BNI_VA'
  | 'BRI_VA'
  | 'GOPAY'
  | 'OVO'
  | 'CREDIT_CARD';

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  imageUrl?: string;
  color?: string;
}

export interface TicketTier {
  id: string;
  eventId: string;
  name: string;
  description?: string;
  price: number;
  quota: number;
  soldCount: number;
  maxPerOrder: number;
  salesStart?: string;
  salesEnd?: string;
}

export interface Organizer {
  id: string;
  userId: string;
  organizationName: string;
  description?: string;
  logo?: string;
  verified: boolean;
  phone?: string;
  website?: string;
}

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  tagline?: string;
  description: string;
  terms?: string;
  bannerUrl: string;
  thumbnailUrl?: string;
  categoryId: string;
  category?: Category;
  organizerId: string;
  organizer?: Organizer;
  venueName: string;
  address: string;
  city: string;
  mapsUrl?: string;
  startDate: string;
  endDate: string;
  isFeatured: boolean;
  isPopular: boolean;
  status: 'DRAFT' | 'PUBLISHED' | 'ENDED';
  ticketTiers: TicketTier[];
  createdAt?: string;
}

export interface OrderItemInput {
  ticketTierId: string;
  quantity: number;
}

export interface OrderItem {
  id: string;
  orderId: string;
  ticketTierId: string;
  ticketTier?: TicketTier;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Ticket {
  id: string;
  ticketCode: string;
  qrData: string;
  orderId: string;
  ticketTierId: string;
  ticketTierName?: string;
  eventTitle?: string;
  eventDate?: string;
  eventVenue?: string;
  attendeeName: string;
  attendeeEmail: string;
  isCheckedIn: boolean;
  checkedInAt?: string | null;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  eventId: string;
  event?: EventItem;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerIdCard?: string;
  totalAmount: number;
  platformFee: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentRef?: string;
  paidAt?: string | null;
  expiredAt: string;
  createdAt: string;
  items: OrderItem[];
  tickets: Ticket[];
}
