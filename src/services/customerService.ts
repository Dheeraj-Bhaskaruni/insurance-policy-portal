import { mockCustomers } from '../mocks/data';
import { Customer, PaginatedResponse, FilterParams } from '../types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const customerService = {
  async getCustomers(params: FilterParams = {}): Promise<PaginatedResponse<Customer>> {
    await delay(500);
    let filtered = [...mockCustomers];

    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q),
      );
    }

    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const start = (page - 1) * pageSize;

    return {
      data: filtered.slice(start, start + pageSize),
      total: filtered.length,
      page,
      pageSize,
      totalPages: Math.ceil(filtered.length / pageSize),
    };
  },

  async getCustomerById(id: string): Promise<Customer> {
    await delay(400);
    const customer = mockCustomers.find((c) => c.id === id);
    if (!customer) throw new Error('Customer not found');
    return customer;
  },
};
