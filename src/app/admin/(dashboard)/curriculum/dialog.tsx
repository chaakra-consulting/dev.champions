"use client"

import { useActionState, useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { curriculum as curriculumTable } from "@/db/schema/curriculum"
import { createCurriculum, CurriculumFormState } from "@/app/actions/admin/curriculum/insert-data"
import { updateCurriculum } from "@/app/actions/admin/curriculum/update-data"


export type CurriculumRow = Pick<
    typeof curriculumTable.$inferSelect,
    "id" | "name" | "desc"
>

type CurriculumFormDialogProps = {
    /** Pass a row to edit it; omit to create a new one */
    item?: CurriculumRow
    /** Optional trigger element, e.g. a <Button>. Omit it when you control `open` yourself. */
    children?: React.ReactNode
    /** Controlled mode: pass both `open` and `onOpenChange` (e.g. to open from a dropdown item) */
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

export function CurriculumFormDialog({
    item,
    children,
    open: openProp,
    onOpenChange,
}: CurriculumFormDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false)
    const isControlled = openProp !== undefined
    const open = isControlled ? openProp : internalOpen
    const isEdit = Boolean(item)

    function setOpen(next: boolean) {
        if (!isControlled) setInternalOpen(next)
        onOpenChange?.(next)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {children && <DialogTrigger asChild>{children}</DialogTrigger>}
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {isEdit ? "Edit kurikulum" : "Tambah kurikulum"}
                    </DialogTitle>
                    <DialogDescription>
                        {isEdit
                            ? "Ubah nama atau deskripsi kurikulum ini."
                            : "Isi data kurikulum baru yang akan didaftarkan."}
                    </DialogDescription>
                </DialogHeader>
                {/* Rendered only while open, so its state resets every time the dialog closes */}
                <CurriculumForm item={item} onSuccess={() => setOpen(false)} />
            </DialogContent>
        </Dialog>
    )
}

const initialState: CurriculumFormState = { status: "idle" }

function CurriculumForm({
    item,
    onSuccess,
}: {
    item?: CurriculumRow
    onSuccess: () => void
}) {
    const action = item ? updateCurriculum.bind(null, item.id) : createCurriculum

    const [state, formAction, pending] = useActionState(
        async (prev: CurriculumFormState, formData: FormData) => {
            const result = await action(prev, formData)
            if (result.status === "success") onSuccess()
            return result
        },
        initialState,
    )

    const nameError = state.errors?.name
    const descError = state.errors?.desc

    return (
        <form action={formAction} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="curriculum-name">Nama</Label>
                <Input
                    id="curriculum-name"
                    name="name"
                    required
                    maxLength={30}
                    autoComplete="off"
                    // React 19 resets uncontrolled fields after an action, so re-apply typed values on error
                    defaultValue={state.values?.name ?? item?.name ?? ""}
                    aria-invalid={Boolean(nameError)}
                    aria-describedby={nameError ? "curriculum-name-error" : undefined}
                />
                {nameError && (
                    <p id="curriculum-name-error" className="text-sm text-destructive">
                        {nameError}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label htmlFor="curriculum-desc">Deskripsi</Label>
                <Textarea
                    id="curriculum-desc"
                    name="desc"
                    rows={4}
                    defaultValue={state.values?.desc ?? item?.desc ?? ""}
                    aria-invalid={Boolean(descError)}
                    aria-describedby={descError ? "curriculum-desc-error" : undefined}
                />
                {descError && (
                    <p id="curriculum-desc-error" className="text-sm text-destructive">
                        {descError}
                    </p>
                )}
            </div>

            {state.status === "error" && state.message && (
                <p role="alert" className="text-sm text-destructive">
                    {state.message}
                </p>
            )}

            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline" disabled={pending}>
                        Batal
                    </Button>
                </DialogClose>
                <Button type="submit" disabled={pending}>
                    {pending && <Loader2 className="animate-spin" />}
                    {item ? "Simpan perubahan" : "Tambah kurikulum"}
                </Button>
            </DialogFooter>
        </form>
    )
}