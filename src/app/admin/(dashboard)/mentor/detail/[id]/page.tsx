// app/admin/mentors/[id]/page.tsx
import { Suspense, type ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Phone } from "lucide-react";

import { db } from "@/db";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { EditMentorDialog } from "./edit-mentor-personal";
import { AchievementDialog, EducationDialog, NonformalDialog } from "./edit-mentor-other";

/* -------------------------------------------------------------------------- */
/*                                    Data                                    */
/* -------------------------------------------------------------------------- */

// One relational query: the mentor row plus its three child collections.
// Requires the relations in mentor-relations.ts and a `db` created with `schema`.
async function getMentorDetail(id: number) {
    return db.query.mentorPersonal.findFirst({
        where: (mentor, { eq }) => eq(mentor.id, id),
        with: {
            educations: {
                orderBy: (education, { desc }) => [desc(education.startedYear)],
            },
            achievements: true,
            nonformalEducations: {
                orderBy: (training, { desc }) => [desc(training.trainingDate)],
            },
        },
    });
}

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

type MentorDetail = NonNullable<Awaited<ReturnType<typeof getMentorDetail>>>;
type Education = MentorDetail["educations"][number];
type Achievement = MentorDetail["achievements"][number];
type NonFormal = MentorDetail["nonformalEducations"][number];

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

const DATE_LOCALE = "id-ID";

function formatDate(value: Date | string | null | undefined) {
    if (!value) return null;
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return new Intl.DateTimeFormat(DATE_LOCALE, {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(date);
}

// "YYYY-MM-DD" for <input type="date">. Uses UTC parts so the day can't shift with server timezone.
function toDateInput(value: Date | string | null | undefined) {
    if (!value) return "";
    if (typeof value === "string") return value.slice(0, 10);
    if (Number.isNaN(value.getTime())) return "";
    return value.toISOString().slice(0, 10);
}

function getAge(dob: Date | string | null | undefined) {
    if (!dob) return null;
    const birth = dob instanceof Date ? dob : new Date(dob);
    if (Number.isNaN(birth.getTime())) return null;

    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

function getInitials(name: string) {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");
}

const GENDER_LABEL: Record<string, string> = {
    male: "Laki-laki",
    female: "Perempuan",
    m: "Laki-laki",
    f: "Perempuan",
    l: "Laki-laki", // laki-laki
    p: "Perempuan", // perempuan
};

function formatGender(value: string | null | undefined) {
    if (!value) return null;
    return GENDER_LABEL[value.toLowerCase()] ?? value;
}

// Maps whatever is stored in the DB to the option values used by the edit form.
function normalizeGender(value: string | null | undefined): "male" | "female" | "" {
    const label = formatGender(value);
    if (label === "Laki-laki") return "male";
    if (label === "Perempuan") return "female";
    return "";
}

// Stored values (English or Indonesian, any casing) -> the form's option values.
const MARRIAGE_STATUS: Record<string, "married" | "single"> = {
    married: "married",
    menikah: "married",
    "sudah menikah": "married",
    kawin: "married",
    single: "single",
    "belum menikah": "single",
    "belum kawin": "single",
    lajang: "single",
};

const MARRIAGE_LABEL = {
    married: "Menikah",
    single: "Belum menikah",
} as const;

function normalizeMarriageStatus(value: string | null | undefined): "married" | "single" | "" {
    if (!value) return "";
    return MARRIAGE_STATUS[value.trim().toLowerCase()] ?? "";
}

// Unrecognized legacy values are shown as stored instead of being hidden.
function formatMarriageStatus(value: string | null | undefined) {
    if (!value) return null;
    const key = normalizeMarriageStatus(value);
    return key ? MARRIAGE_LABEL[key] : value;
}

/* -------------------------------------------------------------------------- */
/*                              Small building blocks                         */
/* -------------------------------------------------------------------------- */

function Section({
    title,
    count,
    action,
    children,
}: {
    title: string;
    count?: number;
    action?: ReactNode;
    children: ReactNode;
}) {
    return (
        <section className="space-y-5">
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
                    {count !== undefined && <Badge variant="secondary">{count}</Badge>}
                </div>
                {action}
            </div>
            {children}
        </section>
    );
}

function Field({
    label,
    value,
    className,
}: {
    label: string;
    value?: ReactNode;
    className?: string;
}) {
    const isEmpty = value === null || value === undefined || value === "";
    return (
        <div className={className}>
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="mt-1 break-words text-sm font-medium">
                {isEmpty ? (
                    <span className="font-normal text-muted-foreground">Belum diisi</span>
                ) : (
                    value
                )}
            </dd>
        </div>
    );
}

function EmptyState({ children }: { children: ReactNode }) {
    return (
        <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            {children}
        </p>
    );
}

/* -------------------------------------------------------------------------- */
/*                                  Sections                                  */
/* -------------------------------------------------------------------------- */

function EducationTimeline({
    mentorId,
    educations,
}: {
    mentorId: number;
    educations: Education[];
}) {
    if (educations.length === 0) {
        return <EmptyState>Belum ada pendidikan formal untuk mentor ini.</EmptyState>;
    }

    return (
        <ol className="ml-1.5 border-l">
            {educations.map((edu) => {
                const graduated = edu.isGraduated === 1;
                const graduatedOn = formatDate(edu.graduatedDate);

                return (
                    <li key={edu.id} className="relative pb-8 pl-6 last:pb-0">
                        <span
                            aria-hidden
                            className={cn(
                                "absolute -left-[5px] top-1.5 size-2.5 rounded-full ring-4 ring-background",
                                graduated ? "bg-primary" : "bg-muted-foreground/40",
                            )}
                        />
                        <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-medium">{edu.institutionName}</h3>
                            <Badge variant="secondary">{edu.eduLevel}</Badge>
                            <Badge variant={graduated ? "default" : "outline"}>
                                {graduated ? "Lulus" : "Belum lulus"}
                            </Badge>
                            <div className="ml-auto">
                                <EducationDialog
                                    mentorId={mentorId}
                                    education={{
                                        id: edu.id,
                                        institutionName: edu.institutionName,
                                        eduLevel: edu.eduLevel,
                                        department: edu.department,
                                        startedYear: edu.startedYear?.toString() ?? "",
                                        isGraduated: graduated ? "1" : "0",
                                        graduatedDate: toDateInput(edu.graduatedDate),
                                        gpa: edu.gpa,
                                    }}
                                />
                            </div>
                        </div>

                        {edu.department && (
                            <p className="mt-0.5 text-sm text-muted-foreground">
                                {edu.department}
                            </p>
                        )}

                        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
                            <span>Mulai {edu.startedYear}</span>
                            {graduated && graduatedOn && <span>Lulus {graduatedOn}</span>}
                            {edu.gpa && <span>IPK/Nilai {edu.gpa}</span>}
                        </div>
                    </li>
                );
            })}
        </ol>
    );
}

function AchievementList({
    mentorId,
    achievements,
}: {
    mentorId: number;
    achievements: Achievement[];
}) {
    if (achievements.length === 0) {
        return <EmptyState>Belum ada prestasi untuk mentor ini.</EmptyState>;
    }

    return (
        <ul className="divide-y rounded-lg border">
            {achievements.map((item) => (
                <li
                    key={item.id}
                    className="flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between"
                >
                    <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-medium">{item.name}</h3>
                            {item.rank && <Badge variant="secondary">Peringkat {item.rank}</Badge>}
                            {item.scope && <Badge variant="outline">{item.scope}</Badge>}
                        </div>
                        {item.desc && (
                            <p className="max-w-prose text-sm text-muted-foreground">
                                {item.desc}
                            </p>
                        )}
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                        {item.attachment && (
                            <Button asChild variant="outline" size="sm">
                                <a href={item.attachment} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink />
                                    Lihat lampiran
                                </a>
                            </Button>
                        )}
                        <AchievementDialog
                            mentorId={mentorId}
                            achievement={{
                                id: item.id,
                                name: item.name ?? "",
                                rank: item.rank,
                                scope: item.scope,
                                desc: item.desc,
                                attachment: item.attachment,
                            }}
                        />
                    </div>
                </li>
            ))}
        </ul>
    );
}

function NonFormalTable({
    mentorId,
    items,
}: {
    mentorId: number;
    items: NonFormal[];
}) {
    if (items.length === 0) {
        return <EmptyState>Belum ada pelatihan nonformal untuk mentor ini.</EmptyState>;
    }

    return (
        <div className="rounded-lg border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Pelatihan</TableHead>
                        <TableHead>Lembaga</TableHead>
                        <TableHead>Nomor sertifikat</TableHead>
                        <TableHead>Tanggal pelatihan</TableHead>
                        <TableHead>Berlaku hingga</TableHead>
                        <TableHead className="w-12">
                            <span className="sr-only">Aksi</span>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell className="max-w-64 whitespace-normal font-medium">
                                {item.trainingPurpose}
                            </TableCell>
                            <TableCell>{item.institutionName}</TableCell>
                            <TableCell>{item.certNumber || "—"}</TableCell>
                            <TableCell className="whitespace-nowrap">
                                {formatDate(item.trainingDate) ?? "—"}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                                {formatDate(item.issuedUntil) ?? "—"}
                            </TableCell>
                            <TableCell>
                                <NonformalDialog
                                    mentorId={mentorId}
                                    training={{
                                        id: item.id,
                                        trainingPurpose: item.trainingPurpose,
                                        institutionName: item.institutionName,
                                        certNumber: item.certNumber,
                                        trainingDate: toDateInput(item.trainingDate),
                                        issuedUntil: toDateInput(item.issuedUntil),
                                    }}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*                                    Page                                    */
/* -------------------------------------------------------------------------- */

async function MentorDetailContent({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const mentorId = Number(id);
    if (!Number.isInteger(mentorId)) notFound();

    const detail = await getMentorDetail(mentorId);
    if (!detail) notFound();

    const {
        educations,
        achievements,
        nonformalEducations: nonFormals,
        ...personal
    } = detail;

    const age = getAge(personal.dob);
    const dobLabel = formatDate(personal.dob);
    const birthOrder =
        personal.xOfSiblings != null && personal.siblings != null
            ? `Anak ke-${personal.xOfSiblings} dari ${personal.siblings} bersaudara`
            : null;

    return (
        <div className="mx-auto w-full max-w-4xl space-y-10 p-6">
            <Button asChild variant="ghost" size="sm" className="-ml-3">
                <Link href="/admin/mentor">
                    <ArrowLeft />
                    Semua mentor
                </Link>
            </Button>

            {/* Header */}
            <header className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <Avatar className="size-24">
                    <AvatarImage
                        src={personal.profileImage ?? undefined}
                        alt={personal.name}
                        className="object-cover"
                    />
                    <AvatarFallback className="text-2xl">
                        {getInitials(personal.name)}
                    </AvatarFallback>
                </Avatar>

                <div className="space-y-1.5">
                    <h1 className="text-2xl font-semibold tracking-tight">{personal.name}</h1>
                    <p className="text-sm text-muted-foreground">{personal.nip == "" ? "—" : personal.nip}</p>
                    {personal.phone && (
                        <a
                            href={`tel:${personal.phone}`}
                            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                        >
                            <Phone className="size-3.5" />
                            {personal.phone}
                        </a>
                    )}
                </div>

                <div className="sm:ml-auto">
                    <EditMentorDialog
                        mentor={{
                            id: personal.id,
                            name: personal.name,
                            nip: personal.nip,
                            nik: personal.nik,
                            phone: personal.phone,
                            sex: normalizeGender(personal.sex),
                            pob: personal.pob,
                            dob: toDateInput(personal.dob),
                            religion: personal.religion,
                            marriageStatus: normalizeMarriageStatus(personal.marriageStatus),
                            xOfSiblings: parseInt(personal.xOfSiblings ?? "0"),
                            siblings: parseInt(personal.siblings ?? "0"),
                            address: personal.address,
                            ktpAddress: personal.ktpAddress,
                        }}
                    />
                </div>
            </header>

            <Separator />

            {/* Personal information */}
            <Section title="Informasi pribadi">
                <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
                    <Field label="NIK" value={personal.nik} />
                    <Field label="NIP" value={personal.nip} />
                    <Field label="Nomor telepon" value={personal.phone} />
                    <Field label="Jenis kelamin" value={formatGender(personal.sex)} />
                    <Field label="Tempat lahir" value={personal.pob} />
                    <Field
                        label="Tanggal lahir"
                        value={dobLabel ? `${dobLabel}${age !== null ? ` (${age} tahun)` : ""}` : null}
                    />
                    <Field label="Agama" value={personal.religion} />
                    <Field label="Status pernikahan" value={formatMarriageStatus(personal.marriageStatus)} />
                    <Field label="Urutan kelahiran" value={birthOrder} />
                </dl>

                <dl className="grid gap-x-8 gap-y-5 sm:grid-cols-2">
                    <Field label="Alamat saat ini" value={personal.address} />
                    <Field label="Alamat sesuai KTP" value={personal.ktpAddress} />
                </dl>
            </Section>

            <Separator />

            {/* Formal education */}
            <Section
                title="Pendidikan formal"
                count={educations.length}
                action={<EducationDialog mentorId={mentorId} />}
            >
                <EducationTimeline mentorId={mentorId} educations={educations} />
            </Section>

            <Separator />

            {/* Achievements */}
            <Section
                title="Prestasi"
                count={achievements.length}
                action={<AchievementDialog mentorId={mentorId} />}
            >
                <AchievementList mentorId={mentorId} achievements={achievements} />
            </Section>

            <Separator />

            {/* Non-formal education */}
            <Section
                title="Pelatihan nonformal"
                count={nonFormals.length}
                action={<NonformalDialog mentorId={mentorId} />}
            >
                <NonFormalTable mentorId={mentorId} items={nonFormals} />
            </Section>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*                         Loading fallback + page entry                      */
/* -------------------------------------------------------------------------- */

function MentorDetailSkeleton() {
    return (
        <div className="mx-auto w-full max-w-4xl space-y-10 p-6" aria-busy="true">
            <Skeleton className="h-8 w-28" />

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <Skeleton className="size-24 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-7 w-56" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-40" />
                </div>
                <Skeleton className="h-8 w-28 sm:ml-auto" />
            </div>

            <Separator />

            <div className="space-y-5">
                <Skeleton className="h-6 w-48" />
                <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 9 }).map((_, index) => (
                        <div key={index} className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-36" />
                        </div>
                    ))}
                </div>
            </div>

            <Separator />

            <div className="space-y-5">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-24 w-full" />
            </div>
        </div>
    );
}

// `params` is runtime data, so it is only awaited inside the Suspense boundary.
// That lets Next prerender the skeleton instantly and stream the real page in.
export default function AdminMentorDetail({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    return (
        <Suspense fallback={<MentorDetailSkeleton />}>
            <MentorDetailContent params={params} />
        </Suspense>
    );
}