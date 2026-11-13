// app/admin/mentors/[id]/record-dialogs.tsx
"use client";

import {
    startTransition,
    useActionState,
    useEffect,
    useState,
    type FormEvent,
    type ReactNode,
} from "react";
import dynamic from "next/dynamic";
import { ExternalLink, Loader2, Pencil, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { FormField, withCurrent } from "./edit-mentor-personal";
import {
    saveAchievement,
    saveEducation,
    saveNonformal,
    type RecordState,
} from "@/app/actions/admin/mentor/update-data";

/* -------------------------------------------------------------------------- */
/*                                    Types                                   */
/* -------------------------------------------------------------------------- */

// Plain, serializable shapes prepared by the page (dates as "YYYY-MM-DD").
export type EducationItem = {
    id: number;
    institutionName: string;
    eduLevel: string;
    department: string | null;
    startedYear: number | string;
    isGraduated: "0" | "1";
    graduatedDate: string;
    gpa: string | number | null;
};

export type AchievementItem = {
    id: number;
    name: string;
    rank: string | null;
    scope: string | null;
    desc: string | null;
    attachment: string | null;
};

export type NonformalItem = {
    id: number;
    trainingPurpose: string;
    institutionName: string;
    certNumber: string | null;
    trainingDate: string;
    issuedUntil: string;
};

type RecordAction = (prev: RecordState, formData: FormData) => Promise<RecordState>;
type Item = Record<string, unknown> | undefined;
type FieldsRenderer = (
    state: RecordState,
    form: { setUploading: (busy: boolean) => void },
) => ReactNode;

const EDU_LEVELS = ["SD", "SMP", "SMA", "SMK", "D1", "D2", "D3", "D4", "S1", "S2", "S3"];
const ACHIEVEMENT_SCOPES = ["Sekolah", "Kabupaten/Kota", "Provinsi", "Nasional", "Internasional"];

/* -------------------------------------------------------------------------- */
/*                                Shared plumbing                             */
/* -------------------------------------------------------------------------- */

const initialState: RecordState = { ok: false };

// React 19 resets uncontrolled inputs after every action, so after a failed save
// we re-seed them from what the admin just typed (falling back to the saved item).
function valueOf(state: RecordState, item: Item, name: string) {
    const original = item?.[name];
    return state.values?.[name] ?? (original == null ? "" : String(original));
}

function fieldProps(state: RecordState, item: Item, name: string) {
    const error = state.errors?.[name];
    return {
        id: name,
        name,
        defaultValue: valueOf(state, item, name),
        "aria-invalid": error ? true : undefined,
        "aria-describedby": error ? `${name}-error` : undefined,
    };
}

function RecordForm({
    action,
    submitLabel,
    onSaved,
    children,
}: {
    action: RecordAction;
    submitLabel: string;
    onSaved: () => void;
    children: FieldsRenderer;
}) {
    const [state, formAction, isPending] = useActionState(action, initialState);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (state.ok) onSaved();
    }, [state, onSaved]);

    // Submitting through onSubmit instead of <form action> stops React 19 from resetting
    // the form after every action, so a file chosen in FilePond survives a validation error.
    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startTransition(() => formAction(formData));
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">{children(state, { setUploading })}</div>

            {state.message && !state.ok && (
                <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                    {state.message}
                </p>
            )}

            <DialogFooter>
                <Button type="submit" disabled={isPending || uploading}>
                    {(isPending || uploading) && <Loader2 className="animate-spin" />}
                    {isPending ? "Menyimpan…" : uploading ? "Mengunggah…" : submitLabel}
                </Button>
            </DialogFooter>
        </form>
    );
}

function RecordDialog({
    noun,
    itemLabel,
    editing,
    action,
    children,
}: {
    noun: string;
    itemLabel?: string;
    editing: boolean;
    action: RecordAction;
    children: FieldsRenderer;
}) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {editing ? (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 shrink-0"
                        aria-label={`Ubah ${noun}${itemLabel ? `: ${itemLabel}` : ""}`}
                    >
                        <Pencil />
                    </Button>
                ) : (
                    <Button variant="outline" size="sm">
                        <Plus />
                        Tambah
                    </Button>
                )}
            </DialogTrigger>
            {/* Radix unmounts the content when closed, so the form (and its error state) resets on reopen. */}
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {editing ? "Ubah" : "Tambah"} {noun}
                    </DialogTitle>
                    <DialogDescription>Perubahan berlaku segera setelah disimpan.</DialogDescription>
                </DialogHeader>
                <RecordForm
                    action={action}
                    submitLabel={editing ? "Simpan perubahan" : "Tambah"}
                    onSaved={() => setOpen(false)}
                >
                    {children}
                </RecordForm>
            </DialogContent>
        </Dialog>
    );
}

/* -------------------------------------------------------------------------- */
/*                               Formal education                             */
/* -------------------------------------------------------------------------- */

function EducationFields({ state, item }: { state: RecordState; item?: EducationItem }) {
    const errors = state.errors ?? {};
    const [graduated, setGraduated] = useState(
        (valueOf(state, item, "isGraduated") || "1") === "1",
    );
    const level = valueOf(state, item, "eduLevel");

    return (
        <>
            <FormField id="institutionName" label="Nama institusi" error={errors.institutionName} className="sm:col-span-2">
                <Input {...fieldProps(state, item, "institutionName")} required autoComplete="off" />
            </FormField>

            <FormField id="eduLevel" label="Jenjang" error={errors.eduLevel}>
                <Select name="eduLevel" defaultValue={level || undefined}>
                    <SelectTrigger id="eduLevel" className="w-full">
                        <SelectValue placeholder="Pilih jenjang" />
                    </SelectTrigger>
                    <SelectContent>
                        {withCurrent(EDU_LEVELS, level).map((option) => (
                            <SelectItem key={option} value={option}>
                                {option}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </FormField>
            <FormField id="department" label="Jurusan / program studi" error={errors.department}>
                <Input {...fieldProps(state, item, "department")} />
            </FormField>

            <FormField id="startedYear" label="Tahun masuk" error={errors.startedYear}>
                <Input {...fieldProps(state, item, "startedYear")} type="number" inputMode="numeric" placeholder="mis. 2018" />
            </FormField>
            <FormField id="gpa" label="IPK" error={errors.gpa}>
                <Input {...fieldProps(state, item, "gpa")} inputMode="decimal" placeholder="mis. 3.75" />
            </FormField>

            <FormField id="isGraduated" label="Status kelulusan" error={errors.isGraduated}>
                <Select
                    name="isGraduated"
                    value={graduated ? "1" : "0"}
                    onValueChange={(value) => setGraduated(value === "1")}
                >
                    <SelectTrigger id="isGraduated" className="w-full">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">Lulus</SelectItem>
                        <SelectItem value="0">Belum lulus</SelectItem>
                    </SelectContent>
                </Select>
            </FormField>
            {graduated && (
                <FormField id="graduatedDate" label="Tanggal lulus" error={errors.graduatedDate}>
                    <Input {...fieldProps(state, item, "graduatedDate")} type="date" />
                </FormField>
            )}
        </>
    );
}

export function EducationDialog({
    mentorId,
    education,
}: {
    mentorId: number;
    education?: EducationItem;
}) {
    return (
        <RecordDialog
            noun="pendidikan formal"
            itemLabel={education?.institutionName}
            editing={!!education}
            action={saveEducation.bind(null, mentorId, education?.id ?? null)}
        >
            {(state) => <EducationFields state={state} item={education} />}
        </RecordDialog>
    );
}

/* -------------------------------------------------------------------------- */
/*                                Achievements                                */
/* -------------------------------------------------------------------------- */

// FilePond and its CSS are loaded only in the browser, and only when this field is rendered.
const FilepondAttachment = dynamic(() => import("@/components/ui/filepond-attachment"), {
    ssr: false,
    loading: () => (
        <div className="h-[4.5rem] animate-pulse rounded-lg border border-dashed bg-muted/40" aria-hidden />
    ),
});

function AttachmentField({
    state,
    item,
    onUploadingChange,
}: {
    state: RecordState;
    item?: AchievementItem;
    onUploadingChange: (busy: boolean) => void;
}) {
    const current = item?.attachment;
    const error = state.errors?.attachment;

    return (
        <FormField id="attachment" label="Lampiran" error={error} className="sm:col-span-2">
            {current && (
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm">
                    <a
                        href={current}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-medium underline-offset-4 hover:underline"
                    >
                        <ExternalLink className="size-3.5" />
                        Lampiran saat ini
                    </a>
                    <label className="inline-flex items-center gap-2 text-muted-foreground">
                        <input type="checkbox" name="removeAttachment" value="1" className="size-4 accent-primary" />
                        Hapus lampiran
                    </label>
                </div>
            )}
            <FilepondAttachment acceptedFiles={["image/jpeg", "image/png", "image/webp", "application/pdf"]} clearKey={error ? state : null} onBusyChange={onUploadingChange} />
            <p className="mt-1.5 text-xs text-muted-foreground">
                PDF, JPG, PNG, atau WEBP, maksimal 5 MB.
                {current ? " Memilih file baru akan mengganti lampiran saat ini." : ""}
            </p>
        </FormField>
    );
}

function AchievementFields({
    state,
    item,
    onUploadingChange,
}: {
    state: RecordState;
    item?: AchievementItem;
    onUploadingChange: (busy: boolean) => void;
}) {
    const errors = state.errors ?? {};
    const scope = valueOf(state, item, "scope");

    return (
        <>
            <FormField id="name" label="Nama prestasi" error={errors.name} className="sm:col-span-2">
                <Input {...fieldProps(state, item, "name")} required autoComplete="off" />
            </FormField>

            <FormField id="rank" label="Peringkat / juara" error={errors.rank}>
                <Input {...fieldProps(state, item, "rank")} placeholder="mis. Juara 1" />
            </FormField>
            <FormField id="scope" label="Tingkat" error={errors.scope}>
                <Select name="scope" defaultValue={scope || undefined}>
                    <SelectTrigger id="scope" className="w-full">
                        <SelectValue placeholder="Pilih tingkat" />
                    </SelectTrigger>
                    <SelectContent>
                        {withCurrent(ACHIEVEMENT_SCOPES, scope).map((option) => (
                            <SelectItem key={option} value={option}>
                                {option}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </FormField>

            <FormField id="desc" label="Deskripsi" error={errors.desc} className="sm:col-span-2">
                <Textarea {...fieldProps(state, item, "desc")} rows={3} />
            </FormField>
            <AttachmentField state={state} item={item} onUploadingChange={onUploadingChange} />
        </>
    );
}

export function AchievementDialog({
    mentorId,
    achievement,
}: {
    mentorId: number;
    achievement?: AchievementItem;
}) {
    return (
        <RecordDialog
            noun="prestasi"
            itemLabel={achievement?.name}
            editing={!!achievement}
            action={saveAchievement.bind(null, mentorId, achievement?.id ?? null)}
        >
            {(state, form) => (
                <AchievementFields state={state} item={achievement} onUploadingChange={form.setUploading} />
            )}
        </RecordDialog>
    );
}

/* -------------------------------------------------------------------------- */
/*                             Non-formal education                           */
/* -------------------------------------------------------------------------- */

function NonformalFields({ state, item }: { state: RecordState; item?: NonformalItem }) {
    const errors = state.errors ?? {};

    return (
        <>
            <FormField id="trainingPurpose" label="Nama pelatihan" error={errors.trainingPurpose} className="sm:col-span-2">
                <Input {...fieldProps(state, item, "trainingPurpose")} required autoComplete="off" />
            </FormField>
            <FormField id="institutionName" label="Lembaga penyelenggara" error={errors.institutionName} className="sm:col-span-2">
                <Input {...fieldProps(state, item, "institutionName")} required autoComplete="off" />
            </FormField>

            <FormField id="trainingDate" label="Tanggal pelatihan" error={errors.trainingDate}>
                <Input {...fieldProps(state, item, "trainingDate")} type="date" />
            </FormField>
            <FormField id="issuedUntil" label="Berlaku hingga" error={errors.issuedUntil}>
                <Input {...fieldProps(state, item, "issuedUntil")} type="date" />
            </FormField>

            <FormField id="certNumber" label="Nomor sertifikat" error={errors.certNumber} className="sm:col-span-2">
                <Input {...fieldProps(state, item, "certNumber")} />
            </FormField>
        </>
    );
}

export function NonformalDialog({
    mentorId,
    training,
}: {
    mentorId: number;
    training?: NonformalItem;
}) {
    return (
        <RecordDialog
            noun="pelatihan nonformal"
            itemLabel={training?.trainingPurpose}
            editing={!!training}
            action={saveNonformal.bind(null, mentorId, training?.id ?? null)}
        >
            {(state) => <NonformalFields state={state} item={training} />}
        </RecordDialog>
    );
}