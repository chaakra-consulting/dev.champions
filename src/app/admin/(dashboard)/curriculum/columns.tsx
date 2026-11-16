"use client"

import type { ColumnDef } from "@tanstack/react-table"
import {
    ArrowDownIcon,
    ArrowUpDownIcon,
    ArrowUpIcon,
    MoreHorizontal,
    MoreHorizontalIcon,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
// Type-only import: nothing from the DB layer ends up in the client bundle
import type { curriculum } from "@/db/schema/curriculum"
import Link from "next/link"
import { CurriculumFormDialog, CurriculumRow } from "./dialog"
import { useState } from "react"

// Keep in sync with the .select({...}) in page.tsx
export type Curriculum = Pick<
    typeof curriculum.$inferSelect,
    "id" | "name" | "desc"
>

function ActionsCell({ item }: { item: CurriculumRow }) {
    // The dialog lives outside the dropdown so it stays mounted after the menu closes
    const [editOpen, setEditOpen] = useState(false)
 
    return (
        <div className="flex justify-end">
            {/* modal={false} avoids Radix leaving the page unclickable when a dialog opens from a menu item */}
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Aksi untuk ${item.name}`}
                    >
                        <MoreHorizontal />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => setEditOpen(true)}>
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">Hapus</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
 
            <CurriculumFormDialog
                item={item}
                open={editOpen}
                onOpenChange={setEditOpen}
            />
        </div>
    )
}


export const columns: ColumnDef<Curriculum>[] = [
    {
        id: "no",
        header: "No.",
        // Running number that follows the current sort/search, across pages
        cell: ({ row, table }) => (
            <span className="font-medium">
                {table.getSortedRowModel().rows.findIndex((r) => r.id === row.id) + 1}
            </span>
        ),
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            const sorted = column.getIsSorted()
            return (
                <Button
                    variant="ghost"
                    className="-ml-3"
                    onClick={() => column.toggleSorting(sorted === "asc")}
                >
                    Nama
                    {sorted === "asc" ? (
                        <ArrowUpIcon className="size-4" />
                    ) : sorted === "desc" ? (
                        <ArrowDownIcon className="size-4" />
                    ) : (
                        <ArrowUpDownIcon className="size-4" />
                    )}
                </Button>
            )
        },
        cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    
    {
        id: "desc",
        header: "Deskripsi",
        enableSorting: false,
        cell: ({ row }) => (
           <span className="font-medium">{row.original.desc}</span>
        ),
    },
    {
        id: "actions",
        header: () => <div className="text-right">Aksi</div>,
        cell: ({ row }) => <ActionsCell item={row.original} />,
    },
]