"use client";
import { useState, useEffect } from "react";
import { compressImage } from "../../lib/compressImage";
import { getDictionary } from "../../lib/i18n";
import fetchWithRetry from "@/lib/fetchWithRetry";
import dynamic from 'next/dynamic';
const MapClient = dynamic(() => import('./MapClient'), { ssr: false });

type Props = {
  locale: string;
};

export default function ReportForm({ locale }: Props) {

  const safeDict = locale === "th" || locale === "en" ? locale : "th";
  const dict = getDictionary(safeDict);
  if (!dict || !dict.report || !dict.common) {
    console.error("Invalid dictionary:", dict);
    return <div>Loading...</div>;
  }
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [location, setLocation] = useState<{
    lat: number;
    lng: number;
  }>({ lat: 15.691, lng: 100.124 });
  const [disasterType, setDisasterType] = useState<string>("flood");

  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const [locLoading, setLocLoading] = useState(false);
  const [severity, setSeverity] = useState("");
  const [area, setArea] = useState<string>('');



  // 📍 Get location
  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      console.log("Geolocation not supported");
      return;
    }
    setLocLoading(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        console.log("Got location:", pos.coords.latitude, pos.coords.longitude);
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocLoading(false);
      },
      (err) => {
        console.error(err);

        if (err.code === 1) {
          alert(dict.report.locationError.permissionDenied);
        } else {
          alert(dict.report.locationError.positionUnavailable);
        }

        setLocLoading(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // setArea name to state and send state to payload for backend
  useEffect(() => {
    try {
      const nominatim = async () => {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${location.lat}&lon=${location.lng}`, {
          headers: {
            'User-Agent': 'disaster_report'
          }
        })
        if(!res.ok) return;
        const data = await res.json();
        if(data.address.province) {
          const trimProvince = data.address.province.replace("Province","").replace(/ /g,'');
          setArea(trimProvince)
        }
      }
      nominatim();
    } catch(error) {
      console.log('error fetch in nominatim is: ',error);
    }
  }, [location.lat,location.lng])


  // 🖼️ Handle image (lightweight compression)
  const handleImages = async (files: FileList) => {
    if (files.length === 0 || !files) return alert(dict.common.noFile);
    const newFiles = Array.from(files);
    if (imageFile.length >= 3 || files.length >= 4) return alert("อัพโหลดได้มากที่สุด 3 รูปเท่านั้น")

    try {
      const compressedFiles = await Promise.all(
        newFiles.map((file) => compressImage(file))
      );
      const newPreviews = compressedFiles.map((file) => URL.createObjectURL(file));

      setImageFile((prev) => prev ? [...prev, ...compressedFiles] : compressedFiles);
      setPreviewUrls((prev) => [...prev, ...newPreviews]);
    } catch (error) {
      console.error("Error compressing images:", error);
      alert("Image error: " + (error instanceof Error ? error.message : "Unknown error"));
    }

  };

  // ❌ Remove image
  const removeImage = (index: number) => {
    setImageFile((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  //prevent memory leak
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    }
  },[previewUrls]);


  // 🚀 Submit
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    if(severity === "") return alert(dict.report.severityError)
    if(isNaN(location.lat) || isNaN(location.lng)) {
      console.log(Number(location.lat), Number(location.lng));
      alert("Invalid location is NaN")
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData(e.target);

      const uploadImage = async (file: File) => {
        const formData = new FormData()
        formData.append('file', file)

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        if (!res.ok) {
          const text = await res.text();
          console.error('API ERROR', text);
          throw new Error(text || "Request failed")
        }

        const data = await res.json()
        return data.url
      }


      // 📉 minimal payload
      const payload = {
        title: String(formData.get("title")),
        description: String(formData.get("description")),
        disasterType: disasterType.toUpperCase(),
        latitude: Number(location.lat),
        longitude: Number(location.lng),
        area: String(area),
        imageUrl: imageFile.length > 0 ? await Promise.all(imageFile.map((file) => uploadImage(file))): [],
        severity: severity.toUpperCase(),
        tel: String(formData.get("telephone") || ""),
        email: String(formData.get("email") || ""),
      };

      // 1️⃣ Send report first (fast)
      const res = await fetchWithRetry("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('API ERROR', text);
        throw new Error(text || "Request failed")
      }

      const data = await res.json();

      e.target.reset();
      setImageFile([]);
      setLocation({ lat: 15.691, lng: 100.124 });
      setPreviewUrls([]);
      return data
    } catch (err) {
      console.error(err);
      alert(dict.report.error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 max-w-2xl"
    >
      {/* Title */}
      <input
        name="title"
        required
        placeholder={dict.report.title}
        className="border p-2"
      />

      {/* Description */}
      <textarea
        name="description"
        required
        placeholder={dict.report.description}
        className="border p-2"
      />

      {/* Type */}
      <select
        required
        name="type"
        className="border p-2"
        onChange={(e) => setDisasterType(e.target.value)}
      >
        <option value="flood">{dict.report.disasterType.flood}</option>
        <option value="earthquake">{dict.report.disasterType.earthquake}</option>
        <option value="fire">{dict.report.disasterType.fire}</option>
        <option value="storm">{dict.report.disasterType.storm}</option>
        <option value="other">{dict.report.disasterType.other}</option>
      </select>

      {area && <p>{area}</p>}
      {/* Map leaflet */}
      <MapClient lat={location.lat} lng={location.lng} setLocation={setLocation} severity={severity} />

      {/* Location */}
      <button
        type="button"
        onClick={getLocation}
        className="bg-gray-200 p-2 cursor-pointer"
      >
        {locLoading
          ? dict.report.locLoading
          : dict.report.location
        }
      </button>

      {/* Image Upload */}
      <input
        type="file"
        accept="image/*"
        multiple
        className="bg-amber-200 w-auto rounded p-1"
        onChange={(e) => {
          if (e.target.files) {
            handleImages(e.target.files);
            e.target.value = "";
          }
        }
        }
      />

      {/* Preview */}
      <div className="flex gap-2 flex-wrap">
        {previewUrls.map((url, index) => (
          <div key={index} className="relative" onClick={() => setSelectedImage(url)}>
            <img
              src={url}
              alt="preview"
              className="w-30 h-30 object-cover border"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1"
            >
              X
            </button>
          </div>
        ))}
      </div>
      {/** when click on preview image has open big image */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)} // close when click background
        >
          <img
            src={selectedImage}
            className="max-w-[90%] max-h-[90%] rounded-lg"
            onClick={(e) => e.stopPropagation()} // prevent close when clicking image
          />
        </div>
      )}
      {/* severity */}
      <select
        name="severity"
        className="border p-2"
        onChange={(e) => setSeverity(e.target.value)}
        required
      >
        <option value="">-- {dict.report.severity.selectSeverity} --</option>
        <option value="low">{dict.report.severity.low}</option>
        <option value="medium">{dict.report.severity.medium}</option>
        <option value="high">{dict.report.severity.high}</option>
      </select>

      {/* Contact */}
      <div className="flex flex-rows gap-2 flex-wrap">
        <input
          name="telephone"
          type="tel"
          pattern="[0-9]{10}"
          placeholder={dict.report.contact.phone}
          className="border p-2"
        />
        <input
          name="email"
          type="email"
          placeholder={dict.report.contact.email}
          className="border p-2"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white p-2"
      >
        {loading ? dict.common.loading : dict.common.submit}
      </button>
    </form>
  );
}