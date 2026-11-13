// app/admin/mentors/[id]/edit-mentor-dialog.tsx
"use client";

import { useActionState, useEffect, useState, type ReactNode } from "react";
import { Loader2, Pencil } from "lucide-react";

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
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import {
    updateMentorPersonal,
    type FieldName,
    type UpdateMentorState,
} from "@/app/actions/admin/mentor/update-data";

export type EditableMentor = {
    id: number;
    name: string;
    nip: string | null;
    nik: string | null;
    phone: string | null;
    sex: "male" | "female" | ""; // normalized by the page
    pob: string | null;
    dob: string; // "YYYY-MM-DD" or ""
    religion: string | null;
    marriageStatus: "married" | "single" | ""; // normalized by the page
    xOfSiblings: number | null;
    siblings: number | null;
    address: string | null;
    ktpAddress: string | null;
};

// The values saved to the `sex` column. Change them if your table uses "L" / "P".
const GENDER_OPTIONS = [
    { value: "male", label: "Laki-laki" },
    { value: "female", label: "Perempuan" },
] as const;

const RELIGIONS = ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"];
// `value` is what gets saved to the column, `label` is what the admin sees.
const MARITAL_OPTIONS = [
    { value: "single", label: "Belum menikah" },
    { value: "married", label: "Menikah" },
] as const;

// If the stored value isn't one of the standard options (e.g. older data),
// keep it as an extra option so saving the form doesn't silently erase it.
export function withCurrent(options: string[], current: string) {
    return current && !options.includes(current) ? [current, ...options] : options;
}

const initialState: UpdateMentorState = { ok: false };

export function FormField({
    id,
    label,
    error,
    className,
    children,
}: {
    id: string;
    label: string;
    error?: string;
    className?: string;
    children: ReactNode;
}) {
    return (
        <div className={className}>
            <Label htmlFor={id} className="mb-1.5">
                {label}
            </Label>
            {children}
            {error && (
                <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-destructive">
                    {error}
                </p>
            )}
        </div>
    );
}

function MentorForm({
    mentor,
    onSaved,
}: {
    mentor: EditableMentor;
    onSaved: () => void;
}) {
    const [state, formAction, isPending] = useActionState(
        updateMentorPersonal.bind(null, mentor.id),
        initialState,
    );

    useEffect(() => {
        if (state.ok) onSaved();
    }, [state, onSaved]);

    const errors = state.errors ?? {};
    // React 19 resets uncontrolled inputs after every action, so after a failed
    // save we re-seed them from what the admin just typed.
    const initial = (field: FieldName) => {
        const original = mentor[field as keyof EditableMentor];
        return state.values?.[field] ?? (original == null ? "" : String(original));
    };
    const common = (field: FieldName) => ({
        id: field,
        name: field,
        defaultValue: initial(field),
        "aria-invalid": errors[field] ? true : undefined,
        "aria-describedby": errors[field] ? `${field}-error` : undefined,
    });

    const religion = initial("religion");
    const religionOptions = withCurrent(RELIGIONS, religion);

    return (
        <form action={formAction} className="space-y-6">
            <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
                <FormField id="name" label="Nama lengkap" error={errors.name} className="sm:col-span-2">
                    <Input {...common("name")} required autoComplete="off" />
                </FormField>

                <FormField id="nik" label="NIK" error={errors.nik}>
                    <Input {...common("nik")} inputMode="numeric" maxLength={16} />
                </FormField>
                <FormField id="nip" label="NIP" error={errors.nip}>
                    <Input {...common("nip")} />
                </FormField>

                <FormField id="phone" label="Nomor telepon" error={errors.phone}>
                    <Input {...common("phone")} type="tel" inputMode="tel" />
                </FormField>
                <FormField id="sex" label="Jenis kelamin" error={errors.sex}>
                    <Select name="sex" defaultValue={initial("sex") || undefined}>
                        <SelectTrigger id="sex" className="w-full">
                            <SelectValue placeholder="Pilih jenis kelamin" />
                        </SelectTrigger>
                        <SelectContent>
                            {GENDER_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </FormField>

                <FormField id="pob" label="Tempat lahir" error={errors.pob}>
                    <Input {...common("pob")} />
                </FormField>
                <FormField id="dob" label="Tanggal lahir" error={errors.dob}>
                    <Input {...common("dob")} type="date" />
                </FormField>

                <FormField id="religion" label="Agama" error={errors.religion}>
                    <Select name="religion" defaultValue={religion || undefined}>
                        <SelectTrigger id="religion" className="w-full">
                            <SelectValue placeholder="Pilih agama" />
                        </SelectTrigger>
                        <SelectContent>
                            {religionOptions.map((item) => (
                                <SelectItem key={item} value={item}>
                                    {item}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </FormField>
                <FormField id="marriageStatus" label="Status pernikahan" error={errors.marriageStatus}>
                    <Select name="marriageStatus" defaultValue={initial("marriageStatus") || undefined}>
                        <SelectTrigger id="marriageStatus" className="w-full">
                            <SelectValue placeholder="Pilih status pernikahan" />
                        </SelectTrigger>
                        <SelectContent>
                            {MARITAL_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </FormField>

                <FormField id="xOfSiblings" label="Anak ke-" error={errors.xOfSiblings}>
                    <Input {...common("xOfSiblings")} type="number" min={1} inputMode="numeric" />
                </FormField>
                <FormField id="siblings" label="Jumlah bersaudara" error={errors.siblings}>
                    <Input {...common("siblings")} type="number" min={1} inputMode="numeric" />
                </FormField>

                <FormField id="address" label="Alamat saat ini" error={errors.address} className="sm:col-span-2">
                    <Textarea {...common("address")} rows={3} />
                </FormField>
                <FormField id="ktpAddress" label="Alamat sesuai KTP" error={errors.ktpAddress} className="sm:col-span-2">
                    <Textarea {...common("ktpAddress")} rows={3} />
                </FormField>
            </div>

            {state.message && !state.ok && (
                <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                    {state.message}
                </p>
            )}

            <DialogFooter>
                <Button type="submit" disabled={isPending}>
                    {isPending && <Loader2 className="animate-spin" />}
                    {isPending ? "Menyimpan…" : "Simpan perubahan"}
                </Button>
            </DialogFooter>
        </form>
    );
}

export function EditMentorDialog({ mentor }: { mentor: EditableMentor }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Pencil />
                    Ubah data
                </Button>
            </DialogTrigger>
            {/* Radix unmounts the content when closed, so the form (and its error state) resets on reopen. */}
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Ubah data mentor</DialogTitle>
                    <DialogDescription>
                        Perubahan berlaku segera setelah disimpan.
                    </DialogDescription>
                </DialogHeader>
                <MentorForm mentor={mentor} onSaved={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    );
}