// API client for VMIS-HRMS
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  total?: number;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    
    // Get token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('vmis_token');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('vmis_token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('vmis_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}/api${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.request<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }
    
    return response;
  }

  async logout() {
    this.clearToken();
  }

  // Employee endpoints
  async getEmployees(filters?: {
    companyId?: string;
    departmentId?: string;
    status?: string;
  }) {
    const params = new URLSearchParams();
    if (filters?.companyId) params.append('companyId', filters.companyId);
    if (filters?.departmentId) params.append('departmentId', filters.departmentId);
    if (filters?.status) params.append('status', filters.status);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/employees${query}`);
  }

  async getEmployee(id: string) {
    return this.request(`/employees/${id}`);
  }

  async createEmployee(data: any) {
    return this.request('/employees', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateEmployee(id: string, data: any) {
    return this.request(`/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteEmployee(id: string) {
    return this.request(`/employees/${id}`, {
      method: 'DELETE',
    });
  }

  // Department endpoints
  async getDepartments(companyId?: string) {
    const params = companyId ? `?companyId=${companyId}` : '';
    return this.request(`/departments${params}`);
  }

  async getDepartment(id: string) {
    return this.request(`/departments/${id}`);
  }

  async createDepartment(data: any) {
    return this.request('/departments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateDepartment(id: string, data: any) {
    return this.request(`/departments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteDepartment(id: string) {
    return this.request(`/departments/${id}`, {
      method: 'DELETE',
    });
  }

  // Job Title endpoints
  async getJobTitles(departmentId?: string) {
    const params = departmentId ? `?departmentId=${departmentId}` : '';
    return this.request(`/job-titles${params}`);
  }

  async getJobTitle(id: string) {
    return this.request(`/job-titles/${id}`);
  }

  async createJobTitle(data: any) {
    return this.request('/job-titles', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateJobTitle(id: string, data: any) {
    return this.request(`/job-titles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteJobTitle(id: string) {
    return this.request(`/job-titles/${id}`, {
      method: 'DELETE',
    });
  }

  // Leave endpoints
  async getLeaves(filters?: {
    employeeId?: string;
    departmentId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const params = new URLSearchParams();
    if (filters?.employeeId) params.append('employeeId', filters.employeeId);
    if (filters?.departmentId) params.append('departmentId', filters.departmentId);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/leaves${query}`);
  }

  async getLeave(id: string) {
    return this.request(`/leaves/${id}`);
  }

  async createLeave(data: any) {
    return this.request('/leaves', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateLeave(id: string, data: any) {
    return this.request(`/leaves/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteLeave(id: string) {
    return this.request(`/leaves/${id}`, {
      method: 'DELETE',
    });
  }

  async approveLeave(id: string, approvedBy: string, comments?: string) {
    return this.request(`/leaves/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ approvedBy, comments }),
    });
  }

  async acknowledgeLeave(id: string, acknowledgedBy: string, comments?: string) {
    return this.request(`/leaves/${id}/acknowledge`, {
      method: 'POST',
      body: JSON.stringify({ acknowledgedBy, comments }),
    });
  }

  async rejectLeave(id: string, rejectedBy: string, comments: string) {
    return this.request(`/leaves/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ rejectedBy, comments }),
    });
  }

  // Company endpoints
  async getCompanies() {
    return this.request('/companies');
  }

  async createCompany(data: any) {
    return this.request('/companies', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;