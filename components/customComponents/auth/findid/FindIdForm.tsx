"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function FindIdForm() {
	const [form, setForm] = useState({
		email: "",
		phone: "",
	});
	const [loading, setLoading] = useState(false);
	const [foundId, setFoundId] = useState<string | null>(null);
	const [error, setError] = useState("");

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		setFoundId(null);
		// TODO: 아이디 찾기 API 연동
		// 임시 목업
		setTimeout(() => {
			setFoundId("testuser123");
			setLoading(false);
		}, 1000);
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col gap-4 w-full max-w-md mx-auto"
		>
			<div className="mt-12 mb-2" />
			<h1 className="text-3xl font-bold text-center mb-4">ID 찾기</h1>
			<div className="grid gap-2">
				<Label htmlFor="email">이메일</Label>
				<Input
					id="email"
					name="email"
					placeholder="이메일"
					value={form.email}
					onChange={handleChange}
					required
				/>
			</div>
			<div className="grid gap-2">
				<Label htmlFor="phone">전화번호</Label>
				<Input
					id="phone"
					name="phone"
					placeholder="전화번호"
					value={form.phone}
					onChange={handleChange}
					required
				/>
			</div>
			<Separator />
			<Button type="submit" className="w-full rounded-full py-3 text-lg font-bold" disabled={loading}>
				{loading ? "찾는 중..." : "ID 찾기"}
			</Button>
			{foundId && (
				<div className="mt-8 text-center text-lg font-bold">
					고객님의 ID는 <span className="underline">{foundId}</span> 입니다.
				</div>
			)}
			{error && <p className="text-center text-sm text-red-600">{error}</p>}
			{foundId && (
				<div className="flex justify-center mt-4">
					<Button asChild variant="outline" className="w-32">
						<Link href="/auth/sign-in">로그인</Link>
					</Button>
				</div>
			)}
		</form>
	);
}
