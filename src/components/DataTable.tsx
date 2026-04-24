import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Search, ArrowUpDown, ArrowUp, ArrowDown, Download, Trash2, Pencil, X } from "lucide-react";
import { usePaginatedData } from "../hooks/usePaginatedData";
import { Skeleton } from "./ui/skeleton";

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T extends { id: number }> {
  columns: Column<T>[];
  endpoint: string;
  enableSearch?: boolean;
  enableSort?: boolean;
  enablePagination?: boolean;
  enableBulkSelect?: boolean;
  enableExport?: boolean;
  onRowClick?: (item: T) => void;
  onBulkDelete?: (ids: number[]) => void;
  renderRowActions?: (item: T) => React.ReactNode;
  defaultSortBy?: string;
  exportEndpoint?: string;
}

export default function DataTable<T extends { id: number }>({
  columns,
  endpoint,
  enableSearch = true,
  enableSort = true,
  enablePagination = true,
  enableBulkSelect = false,
  enableExport = false,
  onRowClick,
  onBulkDelete,
  renderRowActions,
  defaultSortBy = "id",
  exportEndpoint,
}: DataTableProps<T>) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const {
    data,
    total,
    page,
    totalPages,
    limit,
    search,
    sortBy,
    sortDir,
    isLoading,
    setPage,
    setSearch,
    handleSort,
  } = usePaginatedData<T>({ endpoint, defaultSortBy });

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === data.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(data.map(item => item.id)));
    }
  };

  const clearSelection = () => setSelectedIds(new Set());

  const getSortIcon = (key: string) => {
    if (sortBy !== key) return <ArrowUpDown className="h-4 w-4 ml-1" />;
    return sortDir === "asc" ? <ArrowUp className="h-4 w-4 ml-1" /> : <ArrowDown className="h-4 w-4 ml-1" />;
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {enableSearch && (
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        )}
        <div className="flex items-center gap-2">
          {enableExport && exportEndpoint && (
            <>
              <Button variant="outline" size="sm" onClick={() => window.open(`${exportEndpoint}/csv`, "_blank")}>
                <Download className="h-4 w-4 mr-1" /> CSV
              </Button>
              <Button variant="outline" size="sm" onClick={() => window.open(`${exportEndpoint}/pdf`, "_blank")}>
                <Download className="h-4 w-4 mr-1" /> PDF
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Bulk action bar */}
      {enableBulkSelect && selectedIds.size > 0 && (
        <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
          <span className="text-sm font-medium">{selectedIds.size} items selected</span>
          {onBulkDelete && (
            <Button variant="destructive" size="sm" onClick={() => onBulkDelete(Array.from(selectedIds))}>
              <Trash2 className="h-4 w-4 mr-1" /> Bulk Delete
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={clearSelection}>
            <X className="h-4 w-4 mr-1" /> Clear
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {enableBulkSelect && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={data.length > 0 && selectedIds.size === data.length}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
              )}
              {columns.map(col => (
                <TableHead key={col.key}>
                  {enableSort && col.sortable !== false ? (
                    <button
                      className="flex items-center font-medium hover:text-primary"
                      onClick={() => handleSort(col.key)}
                    >
                      {col.label}
                      {getSortIcon(col.key)}
                    </button>
                  ) : (
                    col.label
                  )}
                </TableHead>
              ))}
              {renderRowActions && <TableHead className="w-24">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {enableBulkSelect && <TableCell><Skeleton className="h-4 w-4" /></TableCell>}
                  {columns.map(col => (
                    <TableCell key={col.key}><Skeleton className="h-4 w-24" /></TableCell>
                  ))}
                  {renderRowActions && <TableCell><Skeleton className="h-4 w-16" /></TableCell>}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length + (enableBulkSelect ? 1 : 0) + (renderRowActions ? 1 : 0)} className="text-center py-8 text-gray-500">
                  No results found
                </TableCell>
              </TableRow>
            ) : (
              data.map(item => (
                <TableRow
                  key={item.id}
                  className={onRowClick ? "cursor-pointer hover:bg-gray-50" : ""}
                  onClick={() => onRowClick?.(item)}
                >
                  {enableBulkSelect && (
                    <TableCell onClick={e => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedIds.has(item.id)}
                        onCheckedChange={() => toggleSelect(item.id)}
                      />
                    </TableCell>
                  )}
                  {columns.map(col => (
                    <TableCell key={col.key}>
                      {col.render ? col.render(item) : String((item as any)[col.key] ?? "")}
                    </TableCell>
                  ))}
                  {renderRowActions && (
                    <TableCell onClick={e => e.stopPropagation()}>
                      {renderRowActions(item)}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {enablePagination && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing {((page - 1) * limit) + 1}-{Math.min(page * limit, total)} of {total}
          </p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" disabled={page <= 1} onClick={() => setPage(1)}>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" disabled={page <= 1} onClick={() => setPage(page - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-3 text-sm">Page {page} of {totalPages}</span>
            <Button variant="outline" size="icon" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" disabled={page >= totalPages} onClick={() => setPage(totalPages)}>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
