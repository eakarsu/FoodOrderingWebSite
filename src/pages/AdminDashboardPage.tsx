import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import DataTable, { Column } from "../components/DataTable";
import RowDetailDialog from "../components/RowDetailDialog";
import ConfirmationDialog from "../components/ConfirmationDialog";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { useToast } from "../hooks/use-toast";
import { LayoutDashboard, UtensilsCrossed, ShoppingBag, Mail, Users, Trash2, Eye } from "lucide-react";

export default function AdminDashboardPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedItem, setSelectedItem] = useState<Record<string, any> | null>(null);
  const [detailType, setDetailType] = useState("");
  const [bulkDeleteState, setBulkDeleteState] = useState<{ ids: number[]; type: string } | null>(null);

  // Delete mutations
  const deleteMutation = useMutation({
    mutationFn: async ({ type, id }: { type: string; id: number }) => {
      const res = await fetch(`/api/admin/${type}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Delete failed");
    },
    onSuccess: () => {
      toast({ title: "Deleted", description: "Item deleted successfully." });
      queryClient.invalidateQueries();
      setSelectedItem(null);
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const bulkDeleteMutation = useMutation({
    mutationFn: async ({ type, ids }: { type: string; ids: number[] }) => {
      const res = await fetch(`/api/admin/${type}/bulk`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Bulk delete failed");
    },
    onSuccess: (_, vars) => {
      toast({ title: "Deleted", description: `${vars.ids.length} items deleted.` });
      queryClient.invalidateQueries();
      setBulkDeleteState(null);
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  // Menu columns
  const menuColumns: Column<any>[] = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "category", label: "Category", render: item => <Badge variant="secondary">{item.category}</Badge> },
    { key: "price", label: "Price", render: item => `$${Number(item.price).toFixed(2)}` },
    { key: "available", label: "Available", render: item => (
      <Badge variant={item.available ? "default" : "outline"}>{item.available ? "Yes" : "No"}</Badge>
    )},
    { key: "tags", label: "Tags", render: item => (
      <div className="flex gap-1">{(item.tags || []).map((t: string, i: number) => <Badge key={i} variant="outline" className="text-xs">{t}</Badge>)}</div>
    ), sortable: false },
  ];

  // Order columns
  const orderColumns: Column<any>[] = [
    { key: "id", label: "ID" },
    { key: "customerName", label: "Customer" },
    { key: "email", label: "Email" },
    { key: "total", label: "Total", render: item => `$${Number(item.total).toFixed(2)}` },
    { key: "status", label: "Status", render: item => {
      const colors: Record<string, string> = {
        pending: "bg-yellow-100 text-yellow-800",
        confirmed: "bg-blue-100 text-blue-800",
        preparing: "bg-purple-100 text-purple-800",
        delivered: "bg-green-100 text-green-800",
      };
      return <Badge className={colors[item.status] || ""}>{item.status}</Badge>;
    }},
    { key: "paymentMethod", label: "Payment" },
  ];

  // Contact columns
  const contactColumns: Column<any>[] = [
    { key: "id", label: "ID" },
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "subject", label: "Subject" },
    { key: "message", label: "Message", render: item => (
      <span className="truncate block max-w-[200px]">{item.message}</span>
    ), sortable: false },
  ];

  // User columns
  const userColumns: Column<any>[] = [
    { key: "id", label: "ID" },
    { key: "username", label: "Username" },
    { key: "email", label: "Email" },
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "role", label: "Role", render: item => {
      const colors: Record<string, string> = {
        admin: "bg-red-100 text-red-800",
        manager: "bg-blue-100 text-blue-800",
        user: "bg-gray-100 text-gray-800",
      };
      return <Badge className={colors[item.role] || ""}>{item.role}</Badge>;
    }},
    { key: "emailVerified", label: "Verified", render: item => (
      <Badge variant={item.emailVerified ? "default" : "outline"}>{item.emailVerified ? "Yes" : "No"}</Badge>
    )},
  ];

  const makeRowActions = (type: string) => (item: any) => (
    <div className="flex gap-1">
      <Button variant="ghost" size="icon" onClick={() => { setSelectedItem(item); setDetailType(type); }}>
        <Eye className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate({ type, id: item.id })}>
        <Trash2 className="h-4 w-4 text-red-500" />
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <LayoutDashboard className="h-8 w-8" />
        Admin Dashboard
      </h1>

      <Tabs defaultValue="menu">
        <TabsList className="mb-6">
          <TabsTrigger value="menu" className="flex items-center gap-1">
            <UtensilsCrossed className="h-4 w-4" /> Menu Items
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-1">
            <ShoppingBag className="h-4 w-4" /> Orders
          </TabsTrigger>
          <TabsTrigger value="contacts" className="flex items-center gap-1">
            <Mail className="h-4 w-4" /> Contacts
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-1">
            <Users className="h-4 w-4" /> Users
          </TabsTrigger>
        </TabsList>

        <TabsContent value="menu">
          <DataTable
            columns={menuColumns}
            endpoint="/api/admin/menu"
            enableBulkSelect
            enableExport
            exportEndpoint="/api/admin/menu/export"
            onRowClick={item => { setSelectedItem(item); setDetailType("menu"); }}
            onBulkDelete={ids => setBulkDeleteState({ ids, type: "menu" })}
            renderRowActions={makeRowActions("menu")}
          />
        </TabsContent>

        <TabsContent value="orders">
          <DataTable
            columns={orderColumns}
            endpoint="/api/admin/orders"
            enableBulkSelect
            enableExport
            exportEndpoint="/api/admin/orders/export"
            onRowClick={item => { setSelectedItem(item); setDetailType("orders"); }}
            onBulkDelete={ids => setBulkDeleteState({ ids, type: "orders" })}
            renderRowActions={makeRowActions("orders")}
          />
        </TabsContent>

        <TabsContent value="contacts">
          <DataTable
            columns={contactColumns}
            endpoint="/api/admin/contacts"
            enableBulkSelect
            enableExport
            exportEndpoint="/api/admin/contacts/export"
            onRowClick={item => { setSelectedItem(item); setDetailType("contacts"); }}
            onBulkDelete={ids => setBulkDeleteState({ ids, type: "contacts" })}
            renderRowActions={makeRowActions("contacts")}
          />
        </TabsContent>

        <TabsContent value="users">
          <DataTable
            columns={userColumns}
            endpoint="/api/admin/users"
            onRowClick={item => { setSelectedItem(item); setDetailType("users"); }}
            renderRowActions={makeRowActions("users")}
          />
        </TabsContent>
      </Tabs>

      {/* Row Detail Dialog */}
      <RowDetailDialog
        open={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title={`${detailType.charAt(0).toUpperCase() + detailType.slice(1)} Detail`}
        data={selectedItem}
        onDelete={id => deleteMutation.mutate({ type: detailType, id })}
        isDeleting={deleteMutation.isPending}
      />

      {/* Bulk Delete Confirmation */}
      <ConfirmationDialog
        open={!!bulkDeleteState}
        onConfirm={() => {
          if (bulkDeleteState) {
            bulkDeleteMutation.mutate({ type: bulkDeleteState.type, ids: bulkDeleteState.ids });
          }
        }}
        onCancel={() => setBulkDeleteState(null)}
        title="Bulk Delete"
        description={`Are you sure you want to delete ${bulkDeleteState?.ids.length || 0} items? This action cannot be undone.`}
        variant="destructive"
        isLoading={bulkDeleteMutation.isPending}
      />
    </div>
  );
}
