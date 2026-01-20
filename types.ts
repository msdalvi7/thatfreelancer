
export enum UserRole {
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN'
}

export enum OrderStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  DELIVERED = 'Delivered',
  REVISION = 'Revision Requested'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface ServicePackage {
  id: string;
  name: string;
  price: number;
  deliveryTime: string;
  revisions: number;
  features: string[];
}

export interface Service {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: string;
  packages: ServicePackage[];
}

export interface Order {
  id: string;
  serviceId: string;
  clientId: string;
  packageName: string;
  price: number;
  status: OrderStatus;
  createdAt: string;
  brief: string;
  files?: string[];
  deliverables?: string[];
}

export interface ChatMessage {
  id: string;
  orderId: string;
  senderId: string;
  text: string;
  timestamp: string;
}
