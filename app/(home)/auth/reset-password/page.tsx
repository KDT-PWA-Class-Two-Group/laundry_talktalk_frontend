import ResetPwForm from "@/components/customComponents/auth/resetpw/ResetPwForm";

export default async function ResetPasswordPage({ searchParams }: { searchParams: { token?: string } }) {
  const token = searchParams?.token || "";
  return <ResetPwForm token={token} />;
}
