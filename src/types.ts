export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  dueDate: string;
  createdAt: string;
}

export interface PurchaseRequest {
  id: string;
  requestNumber: string;
  requestor: string;
  department: string;
  date: string;
  items: PRItem[];
  totalAmount: number;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  notes: string;
  createdAt: string;
}

export interface PRItem {
  id: string;
  itemName: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

