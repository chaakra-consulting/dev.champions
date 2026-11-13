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
    pageSize?: number
    pageSizeOptions?: number[]
}

export function DataTable<TData, TValue>({
    columns,
    data,
    searchPlaceholder = "Cari...",
    emptyMessage = "Belum ada data.",
    initialSorting = [],
    pageSize: initialPageSize = 10,
    pageSizeOptions = [10, 20, 50, 100],
}: DataTableProps<TData, TValue>) {
    // TanStack Table returns unstable function references; opt out of React Compiler if it's enabled
    "use no memo"

    const [sorting, setSorting] = React.useState<SortingState>(initialSorting)
    const [globalFilter, setGlobalFilter] = React.useState("")
    const pageSizeId = React.useId()

    const table = useReactTable({
        data,
        columns,
        state: { sorting, globalFilter },
        initialState: { pagination: { pageSize: initialPageSize } },
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
    const { pageIndex, pageSize } = table.getState().pagination

    // Keep the current page size selectable even if it isn't in the given options
    const sizeOptions = Array.from(new Set([...pageSizeOptions, pageSize])).sort((a, b) => a - b)
    const firstRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1
    const lastRow = Math.min((pageIndex + 1) * pageSize, totalRows)

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

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                    Menampilkan {firstRow}&ndash;{lastRow} dari {totalRows} data
                </p>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                    <div className="flex items-center gap-2">
                        <label htmlFor={pageSizeId} className="text-sm text-muted-foreground">
                            Baris per halaman
                        </label>
                        <select
                            id={pageSizeId}
                            value={pageSize}
                            onChange={(event) => table.setPageSize(Number(event.target.value))}
                            className="border-input bg-background h-8 rounded-md border px-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        >
                            {sizeOptions.map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>

                    <p className="text-sm text-muted-foreground">
                        Halaman {pageIndex + 1} dari {Math.max(table.getPageCount(), 1)}
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
        </div>
    )
}