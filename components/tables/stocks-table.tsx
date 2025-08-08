"use client";

import * as React from "react";
import Image from "next/image";
import { usePaginatedQuery } from "convex/react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  TbDotsVertical,
  TbLayoutColumns,
  TbPlus,
  TbEye,
  TbEdit,
  TbTrash,
} from "react-icons/tb";

import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "@/components/tables/common/data-table-pagination";
import { usePathname } from "next/navigation";
import { AddStocksDialog } from "../dialogs/addStocks-dialog";
import Link from "next/link";

// Define the columns for the table
export const baseColumns: ColumnDef<Doc<"stock">>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Image
          src={row.original.logoUrl ?? "/placeholder.svg"}
          alt={row.original.name ?? "Stock logo"}
          width={32}
          height={32}
          className="rounded-full object-cover"
        />
        <div className="flex flex-col">
          <div className="font-medium">{row.original.symbol}</div>
          <div className="text-muted-foreground max-w-40 truncate text-xs">
            {row.original.name}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "currentPrice",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Price
      </Button>
    ),
    cell: ({ row }) => (
      <div>{`$${Number(row.getValue("currentPrice")).toFixed(2)}`}</div>
    ),
  },
  {
    accessorKey: "marketCap",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Market Cap
      </Button>
    ),
    cell: ({ row }) => (
      <div>
        {row.getValue("marketCap")
          ? `$${Number(row.getValue("marketCap")).toFixed(2)}`
          : "N/A"}
      </div>
    ),
  },
  {
    accessorKey: "sector",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Sector
      </Button>
    ),
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive");
      const isFrozen = row.original.isFrozen;
      return (
        <div className="flex flex-col gap-1">
          {isActive ? (
            <Badge variant="secondary">Active</Badge>
          ) : (
            <Badge variant="outline">Inactive</Badge>
          )}
          {isFrozen && <Badge variant="destructive">Frozen</Badge>}
        </div>
      );
    },
  },
];

export function StocksTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [addStocksDialogOpen, setAddStocksDialogOpen] = React.useState(false);

  const pathName = usePathname();
  const isAdminPage = pathName.includes("/admin");

  const columns = React.useMemo<ColumnDef<Doc<"stock">>[]>(() => {
    const allColumns = [...baseColumns];

    if (isAdminPage) {
      allColumns.push({
        accessorKey: "_creationTime",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Created At
          </Button>
        ),
        cell: ({ row }) =>
          new Date(row.original._creationTime).toLocaleDateString(),
      });

      allColumns.push({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          return (
            <div className="flex items-center gap-1">
              <Link href={`/market/${row.original.symbol}`}>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <span className="sr-only">View stock</span>
                  <TbEye className="h-4 w-4" />
                </Button>
              </Link>
              <Link href={`/admin/market/${row.original.symbol}`}>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <span className="sr-only">Edit stock</span>
                  <TbEdit className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive h-8 w-8 p-0"
                onClick={() => {
                  // Handle delete action - functionality to be added later
                  console.log("Delete", row.original);
                }}
              >
                <span className="sr-only">Delete stock</span>
                <TbTrash className="h-4 w-4" />
              </Button>
            </div>
          );
        },
      });
    } else {
      // For non-admin pages, only show view action
      allColumns.push({
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          return (
            <div className="flex items-center">
              <Link href={`/market/${row.original.symbol}`}>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <span className="sr-only">View stock</span>
                  <TbEye className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          );
        },
      });
    }

    return allColumns;
  }, [isAdminPage]);

  const {
    results: data,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.stock.getAllStocks,
    {
      searchQuery: searchQuery || undefined,
    },
    { initialNumItems: 150 },
  );

  const table = useReactTable({
    data: data ?? [],
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  const onClick = () => {
    setAddStocksDialogOpen(true);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <Input
          placeholder="Search by name or symbol..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          className="max-w-sm"
        />
        {isAdminPage && (
          <Button className="mx-2" onClick={onClick}>
            <TbPlus />
            Add Stocks
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              <TbLayoutColumns className="mr-2 h-4 w-4" /> Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  {status === "LoadingFirstPage" ? "Loading..." : "No results."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} status={status} loadMore={loadMore} />
      <AddStocksDialog
        open={addStocksDialogOpen}
        onOpenChange={setAddStocksDialogOpen}
      />
    </div>
  );
}
