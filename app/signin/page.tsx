import type { Metadata } from "next";
import Link from "next/link";
import AuthLayout from "@/components/auth/AuthLayout";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "Masuk – Eclipse" };

export default function LoginPage() {
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
      <LoginForm />
    </AuthLayout>
  );
}
