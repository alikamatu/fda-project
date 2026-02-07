'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import {
  VerificationLog,
  VerificationStats,
  VerificationFilter,
  VerificationStatus,
} from '@/types/verification';
import { VerificationService } from '@/services/verification.service';

interface UseVerificationsOptions {
  initialFilters?: VerificationFilter;
  autoFetch?: boolean;
}

interface UseVerificationsReturn {
  // Data
  verifications: VerificationLog[];
  stats: VerificationStats | null;
  selectedVerification: VerificationLog | null;

  // State
  isLoading: boolean;
  isStatsLoading: boolean;
  error: string | null;
  totalPages: number;
  currentPage: number;
  total: number;

  // Filters
  filters: VerificationFilter;

  // Methods
  fetchVerifications: () => Promise<void>;
  fetchStats: () => Promise<void>;
  fetchVerificationDetails: (id: string) => Promise<void>;
  setFilters: (filters: Partial<VerificationFilter>) => void;
  setPage: (page: number) => void;
  setStatus: (status?: VerificationStatus) => void;
  setSearch: (search: string) => void;
  clearFilters: () => void;
  clearError: () => void;
  exportData: () => Promise<void>;
}

/**
 * Hook to manage verification data and operations
 * Provides fetching, filtering, pagination, and error handling
 */
export function useVerifications(options: UseVerificationsOptions = {}): UseVerificationsReturn {
  const { initialFilters = {}, autoFetch = true } = options;

  // State
  const [verifications, setVerifications] = useState<VerificationLog[]>([]);
  const [stats, setStats] = useState<VerificationStats | null>(null);
  const [selectedVerification, setSelectedVerification] = useState<VerificationLog | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStatsLoading, setIsStatsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(initialFilters.page || 1);
  const [total, setTotal] = useState(0);
  const [filters, setFiltersState] = useState<VerificationFilter>({
    page: 1,
    limit: 20,
    ...initialFilters,
  });

  // Ref to prevent multiple simultaneous requests
  const fetchAbortRef = useRef<AbortController | null>(null);

  /**
   * Fetch verifications from API
   */
  const fetchVerifications = useCallback(async () => {
    // Cancel previous request if pending
    if (fetchAbortRef.current) {
      fetchAbortRef.current.abort();
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await VerificationService.getVerifications(filters);
      setVerifications(response.data);
      setTotalPages(response.totalPages);
      setCurrentPage(response.page);
      setTotal(response.total);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch verifications';
      setError(errorMessage);
      console.error('Verification fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  /**
   * Fetch verification statistics
   */
  const fetchStats = useCallback(async () => {
    setIsStatsLoading(true);

    try {
      const response = await VerificationService.getVerificationStats();
      setStats(response);
    } catch (err) {
      console.error('Stats fetch error:', err);
      // Don't set error for stats, it's optional
    } finally {
      setIsStatsLoading(false);
    }
  }, []);

  /**
   * Fetch details for a specific verification
   */
  const fetchVerificationDetails = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await VerificationService.getVerificationDetails(id);
      setSelectedVerification(response);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch verification details';
      setError(errorMessage);
      console.error('Verification details fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update filters
   */
  const setFilters = useCallback((newFilters: Partial<VerificationFilter>) => {
    setFiltersState((prev) => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset to first page on filter change
    }));
  }, []);

  /**
   * Set current page
   */
  const setPage = useCallback((page: number) => {
    setFiltersState((prev) => ({
      ...prev,
      page,
    }));
  }, []);

  /**
   * Filter by status
   */
  const setStatus = useCallback((status?: VerificationStatus) => {
    setFilters({ status });
  }, [setFilters]);

  /**
   * Filter by search term
   */
  const setSearch = useCallback((search: string) => {
    setFilters({ search: search || undefined });
  }, [setFilters]);

  /**
   * Clear all filters
   */
  const clearFilters = useCallback(() => {
    setFiltersState({
      page: 1,
      limit: 20,
    });
  }, []);

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Export verification data
   */
  const exportData = useCallback(async () => {
    try {
      const blob = await VerificationService.exportVerifications(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `verifications-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to export data';
      setError(errorMessage);
      console.error('Export error:', err);
    }
  }, [filters]);

  /**
   * Auto-fetch on mount and when filters change
   */
  useEffect(() => {
    if (autoFetch) {
      fetchVerifications();
      fetchStats();
    }
  }, [filters, autoFetch, fetchVerifications, fetchStats]);

  return {
    verifications,
    stats,
    selectedVerification,
    isLoading,
    isStatsLoading,
    error,
    totalPages,
    currentPage,
    total,
    filters,
    fetchVerifications,
    fetchStats,
    fetchVerificationDetails,
    setFilters,
    setPage,
    setStatus,
    setSearch,
    clearFilters,
    clearError,
    exportData,
  };
}
