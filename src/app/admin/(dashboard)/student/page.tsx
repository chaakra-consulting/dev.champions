import { asc } from "drizzle-orm"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Link from "next/link";
import { Suspense } from "react";
import { db } from "@/db";
import { studentPersonal } from "@/db/schema/student-personal"
import { columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"

export default function AdminMentorPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Data Siswa</h1>
                <p className="text-muted-foreground">Dibawah ini data siswa yang sudah terdaftar di sistem.</p>
            </div>
            <div>
                {/* <Button asChild>
                    <Link href="mentor/insert">Tambah </Link>
                </Button> */}
            </div>
            {/* The static shell above is prerendered; the table streams in per request */}
            <Suspense fallback={<StudentTableSkeleton />}>
                <StudentTable />
            </Suspense>
        </div>
    );
}

// Mirrors the layout of <DataTable> (search box, bordered table, pagination row) so nothing shifts on load.
// If you change the columns in columns.tsx, update the header and cells here to match.
function StudentTableSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="space-y-4">
            <Skeleton className="h-9 w-full max-w-sm" />
            <div className="rounded-md border">
                <Table aria-busy="true" aria-label="Memuat data mentor">
                    <TableHeader>
                        <TableRow>
                            <TableHead>No.</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Nama Sekolah / Kelas</TableHead>
                            <TableHead>Gender</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: rows }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell><Skeleton className="h-4 w-6" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                                <TableCell>
                                    <div className="space-y-1.5">
                                        <Skeleton className="h-4 w-36" />
                                        <Skeleton className="h-3 w-44" />
                                    </div>
                                </TableCell>
                                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-28" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
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
    );
}

// Async Server Component: the MySQL query runs here, on the server, on every request.
// The rows are then handed to the client-side <DataTable> for sorting, search and pagination.
async function StudentTable() {
    // Select only what the table shows: every field returned here is serialized into the page payload sent to the browser
    const rows = await db
        .select({
            id: studentPersonal.id,
            schoolGrade: studentPersonal.schoolGrade,
            schoolName: studentPersonal.schoolName,
            name: studentPersonal.name,
            sex: studentPersonal.sex,
            dob: studentPersonal.dob,
            pob: studentPersonal.pob,
            religion: studentPersonal.religion,
            address: studentPersonal.address,
            phone: studentPersonal.phone,
        })
        .from(studentPersonal)
        .orderBy(asc(studentPersonal.name));

    return (
        <DataTable
            columns={columns}
            data={rows}
            initialSorting={[{ id: "name", desc: false }]}
            searchPlaceholder="Cari nama, NIK, NIP, atau telepon..."
            emptyMessage="Belum ada data mentor."
        />
    );
}