"use client";
import { getDictionary } from "@/lib/i18n";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/dist/client/link";

type Props = {
  locale: string
}

export default function LoginPage({ locale }: Props) {
  const safeDict = locale === "th" || locale === "en" ? locale : "th";
  const dict = getDictionary(safeDict);
  if (!dict || !dict.login || !dict.common) {
    console.error("Invalid dictionary:", dict);
    return <div>Loading...</div>;
  }
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Login failed");
      }

      // redirect to dashboard
      router.push(`/${safeDict}/dashboard`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 flex-col">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-sm border">
        <h1 className="text-2xl font-semibold text-center mb-6">
          {dict.login.login_header}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-black text-white hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-4">
          Protected admin access only
        </p>

      </div>
      <article className="register-link">
        <p>Don't have an account?
          <Link href={`/${locale}/register`} className="text-blue-500 hover:underline">
            Register here
          </Link>
        </p>
      </article>
    </div>
  );
}
