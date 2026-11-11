"use client"

import * as React from "react"
import {
    type ColumnDef,
    type SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

// Only serializable props here: a Server Component can't pass functions (e.g. getRowId) to this file
interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    searchPlaceholder?: string
    emptyMessage?: string
    initialSorting?: SortingState
}

export function DataTable<TData, TValue>({
    columns,
    data,
    searchPlaceholder = "Cari...",
    emptyMessage = "Belum ada data.",
    initialSorting = [],
}: DataTableProps<TData, TValue>) {
    // TanStack Table returns unstable function references; opt out of React Compiler if it's enabled
    "use no memo"

    const [sorting, setSorting] = React.useState<SortingState>(initialSorting)
    const [globalFilter, setGlobalFilter] = React.useState("")

    const table = useReactTable({
        data,
        columns,
        state: { sorting, globalFilter },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        // By default a column is skipped by search when the FIRST row's value isn't a string/number
        // (e.g. a null phone number). Accessor-less columns (No., Aksi) are still skipped automatically.
        getColumnCanGlobalFilter: () => true,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    })

    const rows = table.getRowModel().rows
    const totalRows = table.getFilteredRowModel().rows.length
    const { pageIndex } = table.getState().pagination

    return (
        <div className="space-y-4">
            <Input
                value={globalFilter}
                onChange={(event) => setGlobalFilter(event.target.value)}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                className="max-w-sm"
            />

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {rows.length > 0 ? (
                            rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    {globalFilter ? "Tidak ada hasil yang cocok." : emptyMessage}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-muted-foreground">
                    {totalRows} data &middot; Halaman {pageIndex + 1} dari {Math.max(table.getPageCount(), 1)}
                </p>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Sebelumnya
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Berikutnya
                    </Button>
                </div>
            </div>
        </div>
    )
}