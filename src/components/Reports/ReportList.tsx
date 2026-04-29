"use client";
import { useState } from 'react';
export default function ReportsList({
  reports,
  locale,
}: {
  reports: any[];
  locale: string;
}) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  return (
    <main className="p-6 max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">
        {locale === "th" ? "รายการรายงานภัยพิบัติ" : "Disaster Reports"}
      </h1>

      {reports.length === 0 && (
        <p className="text-gray-500">
          {locale === "th" ? "ยังไม่มีรายงาน" : "No reports yet"}
        </p>
      )}

      {reports.map((r) => (
        <article
          key={r.id}
          className="border rounded-xl p-4 space-y-3 bg-white"
        >
          <div>
            <h2 className="font-semibold text-lg">{r.title}</h2>
            <p className="text-sm text-gray-500">
              {r.area} · {r.disasterType} · {r.severity} · {r.status}
            </p>
          </div>

          <p>{r.description}</p>

          {r.imageUrl?.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {Array.isArray(r.imageUrl) &&
                r.imageUrl.map((img: string, i: number) => {
                  const src = img.startsWith("/") ? img : `/${img}`;

                  return (
                    <img
                      key={i}
                      src={src}
                      alt={r.title || "report image"}
                      onClick={() => setPreviewImage(src)}
                      className="w-24 h-24 object-cover rounded border cursor-pointer hover:opacity-80"
                    />
                  );
                })}
            </div>
          )}
        </article>
      ))}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="Preview"
            onClick={(e) => e.stopPropagation()}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg bg-white"
          />
        </div>
      )}
    </main>
  );
}