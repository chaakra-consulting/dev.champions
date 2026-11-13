"use client"

import type { ColumnDef } from "@tanstack/react-table"
import {
    ArrowDownIcon,
    ArrowUpDownIcon,
    ArrowUpIcon,
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
import type { mentorPersonal } from "@/db/schema/mentor-personal"
import Link from "next/link"

// Keep in sync with the .select({...}) in page.tsx
export type Mentor = Pick<
    typeof mentorPersonal.$inferSelect,
    "id" | "nik" | "nip" | "name" | "sex" | "phone" | "dob" | "pob" | "address" | "marriageStatus"
>

// "Budi Santoso" -> "BS", "Budi" -> "B"
function getInitials(name?: string | null) {
    const parts = (name ?? "").trim().split(/\s+/).filter(Boolean)
    if (parts.length === 0) return "?"
    const first = parts[0][0]
    const last = parts.length > 1 ? parts[parts.length - 1][0] : ""
    return (first + last).toUpperCase()
}

export const columns: ColumnDef<Mentor>[] = [
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
        id: "profile",
        header: "Foto",
        enableSorting: false,
        // Shows initials. If the table has a photo column, add it to the Mentor type and the
        // .select({...}) in page.tsx, then render it here:
        // <AvatarImage src={row.original.photo} alt={row.original.name} />
        // (import AvatarImage from "@/components/ui/avatar")
        cell: ({ row }) => (
            <Avatar className="size-9">
                <AvatarFallback>{getInitials(row.original.name)}</AvatarFallback>
            </Avatar>
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
        // One display column, but searchable by both NIK and NIP
        id: "nikNip",
        header: "NIK / NIP",
        accessorFn: (row) => `${row.nik} ${row.nip ?? ""}`,
        enableSorting: false,
        cell: ({ row }) => (
            <>
                <div className="text-sm">{row.original.nik}</div>
                <div className="text-xs text-muted-foreground">{row.original.nip == "" ? "-" : row.original.nip}</div>
            </>
        ),
    },
    {
        accessorKey: "sex",
        header: "Jenis Kelamin",
        cell: ({ row }) => <span className="capitalize">{row.original.sex =="male" ? "Laki-laki" : "Perempuan"}</span>,
    },
    {
        accessorKey: "phone",
        header: "Telepon",
        cell: ({ row }) => row.original.phone ?? "-",
    },
    {
        accessorKey: "dob",
        header: "Tempat, Tanggal Lahir",
        cell: ({ row }) => (
            <>
                <div className="text-sm">{row.original.pob}</div>
                <div className="text-xs text-muted-foreground">{row.original.dob?.toLocaleString("id-ID", { dateStyle: "medium" })}</div>
            </>
        ),
        
    },
    {
        accessorKey: "marriageStatus",
        header: "Status Pernikahan",
        cell: ({ row }) => (
            <span className="capitalize">{row.original.marriageStatus == "married" ? "Menikah" : "Belum Menikah"}</span>
        ),
    },
    {
        id: "actions",
        header: () => <div className="text-right">Aksi</div>,
        enableSorting: false,
        cell: ({ row }) => (
            <div className="flex justify-end">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="size-8">
                            <MoreHorizontalIcon className="size-4" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href={`mentor/detail/${row.original.id}`}>Detail</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive">Hapus</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        ),
    },
]