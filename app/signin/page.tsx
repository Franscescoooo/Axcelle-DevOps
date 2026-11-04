import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "Masuk – Eclipse" };

export default function SignInPage() {
  return (
    <AuthLayout
      title="Masuk ke Eclipse"
      subtitle="Lihat tiket dan riwayat pesananmu."
      footer={
        <>
          Belum punya akun?{" "}
          <Link href="/signup" className="font-medium text-amber hover:underline">Daftar</Link>
        </>
      }
    >
      {/* Suspense dibutuhkan karena LoginForm membaca query string */}
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
