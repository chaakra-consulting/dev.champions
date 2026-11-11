import { Suspense } from "react";
import AdminInsertMentorForm from "./form";

export default function AdminInsertMentorPage() {
  return (
    <Suspense fallback={<div className="mx-auto justify-center">Loading..</div>}>
      <AdminInsertMentorForm />
    </Suspense>
  );
}