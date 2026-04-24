import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Trash2, Pencil } from "lucide-react";
import ConfirmationDialog from "./ConfirmationDialog";

interface RowDetailDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  data: Record<string, any> | null;
  onDelete?: (id: number) => void;
  onEdit?: (item: Record<string, any>) => void;
  isDeleting?: boolean;
}

function formatValue(key: string, value: any): React.ReactNode {
  if (value === null || value === undefined) return <span className="text-gray-400">N/A</span>;
  if (typeof value === "boolean") {
    return <Badge variant={value ? "default" : "outline"}>{value ? "Yes" : "No"}</Badge>;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-gray-400">None</span>;
    return (
      <div className="flex flex-wrap gap-1">
        {value.map((v, i) => (
          <Badge key={i} variant="secondary">{typeof v === "object" ? JSON.stringify(v) : String(v)}</Badge>
        ))}
      </div>
    );
  }
  if (typeof value === "object") {
    return <pre className="text-xs bg-gray-50 rounded p-2 max-h-40 overflow-auto">{JSON.stringify(value, null, 2)}</pre>;
  }
  if (key === "status") {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      preparing: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
    };
    return <Badge className={colors[String(value)] || ""}>{String(value)}</Badge>;
  }
  if (key === "role") {
    const colors: Record<string, string> = {
      admin: "bg-red-100 text-red-800",
      manager: "bg-blue-100 text-blue-800",
      user: "bg-gray-100 text-gray-800",
    };
    return <Badge className={colors[String(value)] || ""}>{String(value)}</Badge>;
  }
  if (key.includes("price") || key.includes("total") || key.includes("subtotal") || key.includes("tax") || key.includes("Fee")) {
    return `$${Number(value).toFixed(2)}`;
  }
  return String(value);
}

function formatLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, s => s.toUpperCase())
    .replace(/_/g, " ");
}

export default function RowDetailDialog({
  open,
  onClose,
  title,
  data,
  onDelete,
  onEdit,
  isDeleting = false,
}: RowDetailDialogProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!data) return null;

  const hiddenKeys = ["password", "verificationToken", "resetToken", "resetTokenExpiry"];

  return (
    <>
      <Dialog open={open} onOpenChange={v => { if (!v) onClose(); }}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>ID: {data.id}</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {Object.entries(data)
              .filter(([key]) => !hiddenKeys.includes(key))
              .map(([key, value]) => (
                <div key={key} className="flex flex-col">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {formatLabel(key)}
                  </span>
                  <div className="mt-0.5">{formatValue(key, value)}</div>
                </div>
              ))}
          </div>
          <DialogFooter className="gap-2">
            {onEdit && (
              <Button variant="outline" onClick={() => onEdit(data)}>
                <Pencil className="h-4 w-4 mr-1" /> Edit
              </Button>
            )}
            {onDelete && (
              <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)}>
                <Trash2 className="h-4 w-4 mr-1" /> Delete
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmationDialog
        open={showDeleteConfirm}
        onConfirm={() => {
          onDelete?.(data.id);
          setShowDeleteConfirm(false);
        }}
        onCancel={() => setShowDeleteConfirm(false)}
        title="Delete Item"
        description="Are you sure you want to delete this item? This action cannot be undone."
        variant="destructive"
        isLoading={isDeleting}
      />
    </>
  );
}
