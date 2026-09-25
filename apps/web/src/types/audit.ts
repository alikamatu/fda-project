export interface AuditLog {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata: Record<string, unknown>;
  performedBy: string;
  createdAt: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  };
}

export interface AuditLogsResponse {
  data: AuditLog[];
  meta: {
    total: number;
    skip: number;
    take: number;
  };
}

export interface AuditLogsFilter {
  action?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
