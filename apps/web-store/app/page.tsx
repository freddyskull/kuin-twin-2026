"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFetch = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api");
      const result = await response.text();
      setData(result);
    } catch (error) {
      console.error("Fetch error:", error);
      setData("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Next.js + NestJS Proxy Test
          </h1>

          <div className="flex flex-col gap-4">
            <button
              onClick={handleFetch}
              disabled={loading}
              className="flex h-12 items-center justify-center rounded-full bg-blue-600 px-8 text-white transition-colors hover:bg-blue-700 disabled:bg-blue-300"
            >
              {loading ? "Cargando..." : "Hacer Fetch a /api"}
            </button>

            {data && (
              <div className="mt-4 p-4 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                <p className="text-sm font-mono text-zinc-600 dark:text-zinc-400">Respuesta del servidor:</p>
                <p className="text-lg font-bold text-blue-600">{data}</p>
              </div>
            )}
          </div>

          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Este botón hace una petición a <code className="bg-zinc-200 dark:bg-zinc-800 px-1 rounded">/api</code>,
            la cual es redirigida a <code className="bg-zinc-200 dark:bg-zinc-800 px-1 rounded">http://localhost:3001/api</code> gracias al rewrite en <code className="bg-zinc-200 dark:bg-zinc-800 px-1 rounded">next.config.ts</code>.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
