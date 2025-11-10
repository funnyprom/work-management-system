import { Task, PurchaseRequest } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper function for API requests
async function apiRequest<T>(
  endpoint: string, 
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// ==================== TASKS API ====================

export const tasksApi = {
  // Get all tasks
  getAll: async (): Promise<Task[]> => {
    return apiRequest<Task[]>('/tasks');
  },

  // Get single task
  getById: async (id: string): Promise<Task> => {
    return apiRequest<Task>(`/tasks/${id}`);
  },

  // Create task
  create: async (task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
    return apiRequest<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  },

  // Update task
  update: async (id: string, task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
    return apiRequest<Task>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(task),
    });
  },

  // Delete task
  delete: async (id: string): Promise<void> => {
    return apiRequest<void>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },

  // Get task statistics
  getStats: async (): Promise<{
    total: number;
    todo: number;
    inProgress: number;
    done: number;
    highPriority: number;
    overdue: number;
  }> => {
    return apiRequest('/tasks/stats/summary');
  },
};

// ==================== PURCHASE REQUESTS API ====================

export const purchaseRequestsApi = {
  // Get all purchase requests
  getAll: async (): Promise<PurchaseRequest[]> => {
    return apiRequest<PurchaseRequest[]>('/purchase-requests');
  },

  // Get single purchase request
  getById: async (id: string): Promise<PurchaseRequest> => {
    return apiRequest<PurchaseRequest>(`/purchase-requests/${id}`);
  },

  // Create purchase request
  create: async (pr: Omit<PurchaseRequest, 'id' | 'createdAt'>): Promise<PurchaseRequest> => {
    return apiRequest<PurchaseRequest>('/purchase-requests', {
      method: 'POST',
      body: JSON.stringify(pr),
    });
  },

  // Update purchase request
  update: async (id: string, pr: Omit<PurchaseRequest, 'id' | 'createdAt'>): Promise<PurchaseRequest> => {
    return apiRequest<PurchaseRequest>(`/purchase-requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(pr),
    });
  },

  // Delete purchase request
  delete: async (id: string): Promise<void> => {
    return apiRequest<void>(`/purchase-requests/${id}`, {
      method: 'DELETE',
    });
  },

  // Get purchase request statistics
  getStats: async (): Promise<{
    total: number;
    draft: number;
    pending: number;
    approved: number;
    rejected: number;
    totalAmount: number;
  }> => {
    return apiRequest('/purchase-requests/stats/summary');
  },
};

// ==================== DEPARTMENTS API ====================

export const departmentsApi = {
  // Get all departments
  getAll: async (): Promise<{ id: number; name: string; code: string }[]> => {
    return apiRequest('/departments');
  },

  // Create department
  create: async (department: { name: string; code: string }) => {
    return apiRequest('/departments', {
      method: 'POST',
      body: JSON.stringify(department),
    });
  },
};

// ==================== USERS API ====================

export const usersApi = {
  // Get all users
  getAll: async (): Promise<{
    id: number;
    username: string;
    fullName: string;
    email: string;
    department: string;
  }[]> => {
    return apiRequest('/users');
  },

  // Get single user
  getById: async (id: number) => {
    return apiRequest(`/users/${id}`);
  },

  // Create user
  create: async (user: {
    username: string;
    fullName: string;
    email: string;
    department?: string;
  }) => {
    return apiRequest('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  },
};

// ==================== HEALTH CHECK ====================

export const healthCheck = async (): Promise<{ status: string; message: string }> => {
  return apiRequest('/health');
};

