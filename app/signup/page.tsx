import type { Metadata } from "next";
import Link from "next/link";
import AuthLayout from "@/components/auth/AuthLayout";
import SignupForm from "@/components/auth/SignupForm";

export const metadata: Metadata = { title: "Daftar – Eclipse" };

export default function SignupPage() {
  return (
    <AuthLayout
      title="Buat akun Eclipse"
      subtitle="Daftar sekali, pesan tiket kapan saja."
      footer={
        <>
          Sudah punya akun?{" "}
          <Link href="/masuk" className="font-medium text-amber hover:underline">Masuk</Link>
        </>
      }
    >
      <SignupForm />
    </AuthLayout>
  );
}
