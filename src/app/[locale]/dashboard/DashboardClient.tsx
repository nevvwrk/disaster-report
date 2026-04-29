"use client";
import { provinceInThailand } from "@/lib/provinceInThailand";

import { useEffect, useState } from "react";

export default function DashboardClient({ reports, user, locale, dict }: any) {
    const province = provinceInThailand.provinces
    const getProvinceLabel = (province: any) => locale === "th" ? province.th : province.en;
    const [selectedProvince, setSelectedProvince] = useState<string>("all");
    const STATUS_CONFIG = {
        PENDING: {
            label: "Pending",
            active: "bg-red-500 text-black",
            inactive: "bg-gray-200",
        },
        VERIFYING: {
            label: "Verifying",
            active: "bg-orange-500 text-black",
            inactive: "bg-gray-200",
        },
        PROGESSING: {
            label: "Progressing",
            active: "bg-green-300 text-black",
            inactive: "bg-gray-200",
        },
        RESOLVED: {
            label: "Resolved",
            active: "bg-green-600 text-black",
            inactive: "bg-gray-200",
        },
    };

    const [loadingId, setLoadingId] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [localReports, setLocalReports] = useState(reports);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const filterWithProvince = localReports.filter((r: any) => {
        const matchStatus =
            statusFilter === "ALL" || r.status === statusFilter;

        const matchProvince =
            selectedProvince === "all" || r.area === selectedProvince;

        return matchStatus && matchProvince;
    });

    const updateStatus = async (id: string, status: string) => {
        setLoadingId(id);

        const oldReports = localReports;

        setLocalReports((prev: any[]) =>
            prev.map((r) => (r.id === id ? { ...r, status } : r))
        );

        try {
            const res = await fetch("/api/reports", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id, status }),
            });

            if (!res.ok) {
                throw new Error("Failed to update status");
            }
        } catch (error) {
            console.error(error);
            setLocalReports(oldReports);
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <main className="p-6 space-y-4">
            <h1 className="text-xl font-bold">
                Dashboard ({user.role})
            </h1>

            {reports.length === 0 && (
                <p>No reports found</p>
            )}
            <nav className="flex gap-2 mb-4 flex-wrap">
                {["ALL", "PENDING", "VERIFYING", "PROGESSING", "RESOLVED"].map((s) => (
                    <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={`px-3 py-1 rounded text-sm border ${statusFilter === s ? "bg-black text-white" : "bg-white"}`}
                    >
                        {s}
                    </button>
                ))}
                <select value={selectedProvince} onChange={(e) => setSelectedProvince(e.target.value.replace(/ /g, ''))}>
                    <option value="all">
                        {locale === "th" ? "ทุกจังหวัด" : "All"}
                    </option>
                    {province.map((province, index) => <option key={index} value={province.en}>{getProvinceLabel(province)}</option>)}
                </select>
            </nav>

            {filterWithProvince.map((r: any) => (
                <div
                    key={r.id}
                    className="border rounded-xl p-4 space-y-2"
                >
                    <h2 className="font-semibold">{r.title}</h2>
                    <p>{r.description}</p>

                    <p className="text-sm text-gray-500">
                        {r.disasterType} | {r.severity}
                    </p>

                    {/* 🖼 images */}
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
                    {r.area}

                    {/* 🔄 status */}
                    <div className="flex gap-2">
                        {Object.entries(STATUS_CONFIG).map(([key, config]) => {
                            const isActive = r.status === key;

                            return (
                                <button
                                    key={key}
                                    onClick={() => updateStatus(r.id, key)}
                                    disabled={loadingId === r.id}
                                    className={`px-3 py-1 rounded cursor-pointer text-sm transition ${isActive ? config.active : config.inactive}`}
                                >
                                    {config.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
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