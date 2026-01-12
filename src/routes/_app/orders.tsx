import { createFileRoute, Outlet, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Permission } from "@/lib/permissions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useOrders } from "@/hooks/useOrderQueries";

export const Route = createFileRoute("/_app/orders")({
  component: OrdersPage,
});

function OrdersContent() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const PER_PAGE = 20;

  const { data, isLoading, error } = useOrders({
    page,
    perPage: PER_PAGE,
  });

  const orders = data?.orders || [];
  const totalOrders = data?.total || 0;

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">
              Failed to load orders. Please try again.
            </div>
          ) : (
            <>
              <div className="rounded-md border mb-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice No</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                          No orders found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      orders.map((order) => (
                        <TableRow
                          key={order.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onDoubleClick={() =>
                            router.navigate({ to: `/orders/${order.id}` })
                          }
                        >
                          <TableCell className="font-medium">
                            {order.invoice_no}
                          </TableCell>
                          <TableCell>
                            {format(new Date(order.created_at), "PPP p")}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full p-2 text-xs font-medium ${
                                order.status === "COMPLETED"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {order.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            ${order.grand_total}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {totalOrders > 0 && (
                <Pagination
                  currentPage={page}
                  totalItems={totalOrders}
                  itemsPerPage={PER_PAGE}
                  onPageChange={setPage}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function OrdersPage() {
  return (
    <ProtectedRoute permissions={[Permission.VIEW_ORDERS]}>
      <OrdersContent />
      <Outlet />
    </ProtectedRoute>
  );
}
