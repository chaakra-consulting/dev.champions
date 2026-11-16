// src/app/admin/(dashboard)/student/detail/[id]/page.tsx
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import {
    ArrowLeft,
    BookOpen,
    CalendarDays,
    GraduationCap,
    MapPin,
    Pencil,
    Phone,
    School,
    UserRound,
    Users,
    type LucideIcon,
} from "lucide-react";

// Adjust these two imports to match your project structure
import { db } from "@/db";
import { studentPersonal } from "@/db/schema/student-personal";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const SEX_LABEL = {
    male: "Laki-laki",
    female: "Perempuan",
} as const;

const RELATION_LABEL = {
    mother: "Ibu",
    father: "Ayah",
    other: "Wali",
} as const;

const dateTimeFormat = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
});

function getInitials(name: string) {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("");
}

function InfoItem({
    icon: Icon,
    label,
    children,
}: {
    icon: LucideIcon;
    label: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex items-start gap-3">
            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <Icon className="size-4" />
            </div>
            <div className="min-w-0 space-y-0.5">
                <dt className="text-sm text-muted-foreground">{label}</dt>
                <dd className="text-sm font-medium break-words">{children}</dd>
            </div>
        </div>
    );
}

function PhoneLink({ phone }: { phone: string }) {
    return (
        <a
            href={`tel:${phone.replace(/\s+/g, "")}`}
            className="underline-offset-4 hover:underline"
        >
            {phone}
        </a>
    );
}

/* -------------------------------------------------------------------------- */
/*  Loading skeleton (shown while the student data streams in)                */
/* -------------------------------------------------------------------------- */

function SkeletonItem() {
    return (
        <div className="flex items-start gap-3">
            <Skeleton className="size-8 shrink-0 rounded-md" />
            <div className="w-full space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-40 max-w-full" />
            </div>
        </div>
    );
}

function StudentDetailSkeleton() {
    return (
        <div className="space-y-6" aria-busy="true">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Skeleton className="size-20 shrink-0 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-8 w-56 max-w-full" />
                    <Skeleton className="h-5 w-72 max-w-full" />
                </div>
            </div>

            <Separator />

            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader className="space-y-2">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-4 w-56" />
                    </CardHeader>
                    <CardContent className="grid gap-5 sm:grid-cols-2">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <SkeletonItem key={i} />
                        ))}
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-5 w-36" />
                        </CardHeader>
                        <CardContent className="space-y-5">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <SkeletonItem key={i} />
                            ))}
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-5 w-28" />
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Dynamic part: reads params + queries the database                         */
/* -------------------------------------------------------------------------- */

async function StudentDetail({ params }: { params: Promise<{ id: string }> }) {
    // `params` is request-time data, so it is awaited here (inside <Suspense>),
    // not in the page component.
    const { id } = await params;
    const studentId = Number(id);

    if (!Number.isInteger(studentId) || studentId <= 0) {
        notFound();
    }

    const student = await db.query.studentPersonal.findFirst({
        where: eq(studentPersonal.id, studentId),
        with: { parent: true },
    });

    if (!student) {
        notFound();
    }

    const { parent } = student;

    return (
        <div className="space-y-6">
            {/* Profile header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Avatar className="size-20 text-xl">
                    <AvatarFallback>{getInitials(student.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 space-y-2">
                    <h1 className="text-2xl font-semibold tracking-tight break-words">
                        {student.name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary">{SEX_LABEL[student.sex]}</Badge>
                        <Badge variant="outline">Kelas {student.schoolGrade}</Badge>
                        <span className="text-sm text-muted-foreground">
                            {student.schoolName}
                        </span>
                    </div>
                </div>
                <Button size="sm" asChild className="sm:ml-auto">
                    <Link href={`/admin/student/edit/${student.id}`}>
                        <Pencil className="size-4" />
                        Ubah data siswa
                    </Link>
                </Button>
            </div>

            <Separator />

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main column */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Informasi siswa</CardTitle>
                        <CardDescription>
                            Data pribadi, sekolah, dan kontak.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <dl className="grid gap-5 sm:grid-cols-2">
                            <InfoItem icon={UserRound} label="Nama lengkap">
                                {student.name}
                            </InfoItem>
                            <InfoItem icon={UserRound} label="Jenis kelamin">
                                {SEX_LABEL[student.sex]}
                            </InfoItem>
                            <InfoItem icon={MapPin} label="Tempat lahir">
                                {student.pob}
                            </InfoItem>
                            <InfoItem icon={CalendarDays} label="Tanggal lahir">
                                {student.dob}
                            </InfoItem>
                            <InfoItem icon={BookOpen} label="Agama">
                                {student.religion}
                            </InfoItem>
                        </dl>

                        <Separator />

                        <dl className="grid gap-5 sm:grid-cols-2">
                            <InfoItem icon={School} label="Sekolah">
                                {student.schoolName}
                            </InfoItem>
                            <InfoItem icon={GraduationCap} label="Kelas">
                                {student.schoolGrade}
                            </InfoItem>
                        </dl>

                        <Separator />

                        <dl className="grid gap-5 sm:grid-cols-2">
                            <InfoItem icon={Phone} label="Nomor telepon">
                                <PhoneLink phone={student.phone} />
                            </InfoItem>
                            <InfoItem icon={MapPin} label="Alamat">
                                <span className="whitespace-pre-line">{student.address}</span>
                            </InfoItem>
                        </dl>
                    </CardContent>
                </Card>

                {/* Side column */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Orang tua / wali</CardTitle>
                            {parent && (
                                <CardDescription>
                                    <Badge variant="secondary">
                                        {RELATION_LABEL[parent.relation]}
                                    </Badge>
                                </CardDescription>
                            )}
                        </CardHeader>
                        <CardContent>
                            {parent ? (
                                <dl className="space-y-5">
                                    <InfoItem icon={Users} label="Nama">
                                        {parent.name}
                                    </InfoItem>
                                    <InfoItem icon={Phone} label="Nomor telepon">
                                        <PhoneLink phone={parent.phone} />
                                    </InfoItem>
                                    <InfoItem icon={MapPin} label="Alamat">
                                        <span className="whitespace-pre-line">
                                            {parent.address}
                                        </span>
                                    </InfoItem>
                                </dl>
                            ) : (
                                <div className="space-y-3 text-sm">
                                    <p className="text-muted-foreground">
                                        Belum ada orang tua atau wali yang terhubung dengan siswa ini.
                                    </p>
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={`/admin/student/edit/${student.id}`}>
                                            Hubungkan orang tua
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Riwayat data</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <dl className="space-y-3 text-sm">
                                <div className="flex justify-between gap-4">
                                    <dt className="text-muted-foreground">Dibuat</dt>
                                    <dd className="font-medium">
                                        {dateTimeFormat.format(student.createdAt)}
                                    </dd>
                                </div>
                                <div className="flex justify-between gap-4">
                                    <dt className="text-muted-foreground">Terakhir diperbarui</dt>
                                    <dd className="font-medium">
                                        {dateTimeFormat.format(student.updatedAt)}
                                    </dd>
                                </div>
                            </dl>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*  Page: static shell + streamed content                                     */
/* -------------------------------------------------------------------------- */

export default function AdminStudentDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    return (
        <div className="mx-auto w-full max-w-5xl space-y-6 p-4 md:p-6">
            {/* Static: prerendered instantly */}
            <Button variant="ghost" size="sm" asChild className="-ml-2">
                <Link href="/admin/student">
                    <ArrowLeft className="size-4" />
                    Kembali ke daftar siswa
                </Link>
            </Button>

            {/* Dynamic: params is passed down un-awaited and resolved inside */}
            <Suspense fallback={<StudentDetailSkeleton />}>
                <StudentDetail params={params} />
            </Suspense>
        </div>
    );
}