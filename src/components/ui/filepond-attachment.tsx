// app/admin/mentors/[id]/attachment-dropzone.tsx
"use client";

import "filepond/dist/filepond.min.css";
// import "./attachment-dropzone.css";

import { useEffect, useRef } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";

import { revertFile, uploadFile } from "@/app/actions/admin/upload-attachment";

registerPlugin(FilePondPluginFileValidateSize, FilePondPluginFileValidateType);

// Loaded with next/dynamic (ssr: false) from record-dialogs.tsx, so it needs a default export.
//
// How it works: FilePond uploads the file right away through the `uploadFile` server action
// and keeps a hidden <input name="attachment"> holding the returned id. The form posts only
// that id; saveAchievement moves the file into public/mentor/achievement.
export default function FilepondAttachment({
    clearKey,
    onBusyChange,
    acceptedFiles,
}: {
    clearKey?: unknown;
    acceptedFiles?: string[];
    /** true while a file is uploading, so the form can block "Simpan" until the id exists */
    onBusyChange?: (busy: boolean) => void;
}) {
    const pondRef = useRef<FilePond>(null);
    const uploadedIdRef = useRef<string | null>(null); // uploaded but not saved yet

    // The server rejected the attachment on save: drop it so the admin picks another one.
    useEffect(() => {
        if (clearKey) pondRef.current?.removeFiles();
    }, [clearKey]);

    // Dialog closed without saving: discard the temporary file. After a successful save the file
    // has already been moved, so this is a harmless no-op on the server.
    useEffect(() => {
        return () => {
            // eslint-disable-next-line react-hooks/exhaustive-deps -- we want the latest id at unmount
            const id = uploadedIdRef.current;
            if (id) void revertFile(id);
        };
    }, []);

    return (
        <div className="attachment-pond">
            <FilePond
                ref={pondRef}
                id="attachment" // links the browse input to the <label htmlFor="attachment">
                name="attachment" // the hidden input that carries the uploaded file id
                allowMultiple={false}
                maxFiles={1}
                credits={false}
                // acceptedFileTypes={["application/pdf", "image/jpeg", "image/png", "image/webp"]}
                acceptedFileTypes={acceptedFiles}
                server={{
                    process: (_fieldName, file, _metadata, load, error, progress, abort) => {
                        let cancelled = false;
                        progress(false, 0, 0); // server actions report no progress: show the busy state

                        const formData = new FormData();
                        formData.append("file", file, file.name);

                        uploadFile(formData)
                            .then((result: any) => {
                                if ("error" in result) return error(result.error);
                                if (cancelled) return void revertFile(result.id); // cancelled mid-upload: clean up
                                uploadedIdRef.current = result.id;
                                load(result.id); // FilePond stores this as the hidden input's value
                            })
                            .catch(() => error("Gagal mengunggah file"));

                        return {
                            abort: () => {
                                cancelled = true; // a server action can't be aborted, so discard its result
                                abort();
                            },
                        };
                    },
                    revert: (uniqueFileId, load, error) => {
                        revertFile(uniqueFileId)
                            .then((result: any) => {
                                if ("error" in result) return error("Gagal menghapus file");
                                if (uploadedIdRef.current === uniqueFileId) uploadedIdRef.current = null;
                                load();
                            })
                            .catch(() => error("Gagal menghapus file"));
                    },
                }}
                onprocessfilestart={() => onBusyChange?.(true)}
                onprocessfile={() => onBusyChange?.(false)} // fires on success and on error
                onprocessfileabort={() => onBusyChange?.(false)}
                labelIdle='Seret &amp; lepas file di sini, atau <span class="filepond--label-action">telusuri</span>'
                labelFileTypeNotSupported="Format file tidak didukung"
                fileValidateTypeLabelExpectedTypes="Harus berupa PDF, JPG, PNG, atau WEBP"
                labelMaxFileSizeExceeded="File terlalu besar"
                labelMaxFileSize="Ukuran maksimal {filesize}"
                labelFileLoading="Memuat"
                labelFileLoadError="File tidak dapat dibaca"
                labelFileProcessing="Mengunggah"
                labelFileProcessingComplete="Selesai diunggah"
                labelFileProcessingError="Gagal mengunggah"
                labelFileProcessingRevertError="Gagal menghapus"
                labelTapToCancel="ketuk untuk batal"
                labelTapToUndo="ketuk untuk membatalkan"
                labelButtonRemoveItem="Hapus"
            />
        </div>
    );
}