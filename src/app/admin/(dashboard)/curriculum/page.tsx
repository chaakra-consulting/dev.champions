import { asc } from "drizzle-orm"
import { Plus } from "lucide-react"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { db } from "@/db"
import { curriculum } from "@/db/schema/curriculum"
import { columns } from "./columns"
import { CurriculumFormDialog } from "./dialog"
export default function AdminCurriculumPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Data Kurikulum</h1>
                    <p className="text-muted-foreground">
                        Dibawah ini data Kurikulum yang sudah terdaftar di sistem.
                    </p>
                </div>
                <CurriculumFormDialog>
                    <Button>
                        <Plus />
                        Tambah kurikulum
                    </Button>
                </CurriculumFormDialog>
            </div>
            {/* The static shell above is prerendered; the table streams in per request */}
            <Suspense fallback={<CurriculumSkeleton />}>
                <Curriculum />
            </Suspense>
        </div>
    )
}

function CurriculumSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="space-y-4">
            <Skeleton className="h-9 w-full max-w-sm" />
            <div className="rounded-md border">
                <Table aria-busy="true" aria-label="Memuat data kurikulum">
                    <TableHeader>
                        <TableRow>
                            <TableHead>No.</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Deskripsi</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: rows }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell><Skeleton className="h-4 w-6" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-64" /></TableCell>
                                <TableCell>
                                    <Skeleton className="ml-auto size-8 rounded-md" />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-between gap-4">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-8 w-48" />
            </div>
        </div>
    )
}

async function Curriculum() {
    const rows = await db
        .select({
            id: curriculum.id,
            name: curriculum.name,
            desc: curriculum.desc,
        })
        .from(curriculum)
        .orderBy(asc(curriculum.name))

    return (
        <DataTable
            columns={columns}
            data={rows}
            initialSorting={[{ id: "name", desc: false }]}
            searchPlaceholder="Cari nama"
            emptyMessage="Belum ada data kurikulum."
        />
    )
}