import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

interface UsePaginatedDataOptions {
  endpoint: string;
  defaultLimit?: number;
  defaultSortBy?: string;
  defaultSortDir?: "asc" | "desc";
}

export function usePaginatedData<T>({
  endpoint,
  defaultLimit = 10,
  defaultSortBy = "id",
  defaultSortDir = "desc",
}: UsePaginatedDataOptions) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(defaultLimit);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState(defaultSortBy);
  const [sortDir, setSortDir] = useState<"asc" | "desc">(defaultSortDir);
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    if (search) params.set("search", search);
    if (sortBy) params.set("sortBy", sortBy);
    if (sortDir) params.set("sortDir", sortDir);
    if (category) params.set("category", category);
    if (status) params.set("status", status);
    return params.toString();
  }, [page, limit, search, sortBy, sortDir, category, status]);

  const { data, isLoading, error, refetch } = useQuery<{
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>({
    queryKey: [endpoint, queryString],
    queryFn: async () => {
      const res = await fetch(`${endpoint}?${queryString}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch data");
      return res.json();
    },
  });

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, []);

  const handleSort = useCallback((field: string) => {
    if (sortBy === field) {
      setSortDir(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
    setPage(1);
  }, [sortBy]);

  return {
    data: data?.data || [],
    total: data?.total || 0,
    page: data?.page || page,
    totalPages: data?.totalPages || 1,
    limit,
    search,
    sortBy,
    sortDir,
    category,
    status,
    isLoading,
    error,
    setPage,
    setLimit,
    setSearch: handleSearch,
    setCategory: useCallback((v: string) => { setCategory(v); setPage(1); }, []),
    setStatus: useCallback((v: string) => { setStatus(v); setPage(1); }, []),
    handleSort,
    refetch,
  };
}
