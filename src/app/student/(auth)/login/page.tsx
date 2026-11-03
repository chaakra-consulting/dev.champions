// app/login/page.tsx
import { redirect } from "next/navigation";
import StudentLoginForm from "./form";

export default async function StudentLoginPage() {
  return (
    <>
      <StudentLoginForm />
    </>
  );
}