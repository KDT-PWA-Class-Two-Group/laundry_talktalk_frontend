"use client";
import { ENDPOINTS } from "@/lib/api";
import { useState } from "react";

export default function LoginForm() {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(ENDPOINTS.AUTH.LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login_id: loginId, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "로그인 실패");
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full max-w-md mx-auto">
      <input
        type="text"
        placeholder="아이디"
        value={loginId}
        onChange={e => setLoginId(e.target.value)}
        className="border px-3 py-2 rounded"
        required
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="border px-3 py-2 rounded"
        required
      />
      <button type="submit" className="bg-blue-600 text-white py-2 rounded" disabled={loading}>
        {loading ? "로그인 중..." : "로그인"}
      </button>
      {error && <p className="text-red-500">{error}</p>}
      {result && <pre className="bg-gray-100 p-2 rounded text-sm">{JSON.stringify(result, null, 2)}</pre>}
    </form>
  );
}
