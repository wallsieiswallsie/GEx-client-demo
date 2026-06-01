import { useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  ClipboardList,
  Headphones,
  Lightbulb,
  LockKeyhole,
  Package,
  Paperclip,
  Phone,
  Send,
  Sparkles,
  Truck,
  Warehouse,
} from "lucide-react";
import { useAuth } from "../../context/useAuth";
import {
  createCustomerFeedback,
  feedbackCategories,
} from "../../services/api/customerFeedbackApi";

const icons = {
  "Aplikasi GEx": Phone,
  "Pengiriman di GEx": Package,
  "Customer Service": Headphones,
  Kurir: Truck,
  Gudang: Warehouse,
  "Usulan Fitur": Lightbulb,
  Keluhan: ClipboardList,
  Lainnya: Sparkles,
};

const initialForm = {
  category: feedbackCategories[0],
  message: "",
  contact_number: "",
  attachment: null,
};

export default function CustomerFeedbackPage() {
  const navigate = useNavigate();
  const { role, user } = useAuth();
  const [form, setForm] = useState({
    ...initialForm,
    contact_number: user?.whatsapp_number || "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const canSubmit = useMemo(
    () => form.category && form.message.trim().length >= 10 && form.message.trim().length <= 1000,
    [form]
  );

  const update = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }));
    setError("");
  };

  const handleFile = (file) => {
    if (!file) {
      update("attachment", null);
      return;
    }

    const allowed = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
    if (!allowed.includes(file.type)) {
      setError("Lampiran hanya boleh jpg, jpeg, png, atau pdf.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran lampiran maksimal 5 MB.");
      return;
    }

    update("attachment", file);
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!canSubmit || submitting) return;

    try {
      setSubmitting(true);
      setError("");
      const data = new FormData();
      data.append("category", form.category);
      data.append("message", form.message.trim());
      data.append("contact_number", String(form.contact_number || "").trim());
      if (form.attachment) data.append("attachment", form.attachment);

      await createCustomerFeedback(data);
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Masukan belum dapat dikirim. Coba lagi nanti.");
    } finally {
      setSubmitting(false);
    }
  };

  if (role !== "customer") {
    return <Navigate to="/home" replace />;
  }

  if (success) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-gray-50 px-6 pb-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-11 w-11" />
        </div>
        <h1 className="mt-6 text-2xl font-black text-slate-950">Terima kasih atas masukan Anda</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          Masukan Anda telah diterima dan akan ditinjau oleh tim GEx.
        </p>
        <button
          type="button"
          onClick={() => navigate("/home", { replace: true })}
          className="mt-8 h-13 w-full rounded-2xl bg-violet-700 px-5 font-bold text-white shadow-lg shadow-violet-700/20"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-gray-50 pb-28 text-slate-900">
      <section
        className="relative overflow-hidden px-6 pb-16 pt-8 text-white"
        style={{
          backgroundImage: "url('/images/header_background/saran.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute bottom-0 left-0 right-0 h-10 rounded-t-[50%] bg-gray-50" />
        <div className="relative z-10">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur"
              aria-label="Kembali"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-black">Saran & Masukan</h1>
          </div>
          <div className="mt-8 max-w-[260px]">
            <h2 className="text-2xl font-black leading-tight">Kami ingin terus berkembang bersama Anda.</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/85">
              Sampaikan saran, kritik, keluhan, atau pengalaman pengiriman Anda kepada tim GEx.
            </p>
          </div>
        </div>
      </section>

      <main className="relative -mt-10 px-4">
        <form onSubmit={submit} className="space-y-5">
          <section className="rounded-[24px] border border-white bg-white p-5 shadow-[0_14px_36px_rgba(15,23,42,0.10)]">
            <h2 className="text-lg font-black text-slate-950">1. Pilih topik</h2>
            <p className="mt-1 text-sm text-slate-500">Pilih topik yang sesuai dengan saran atau masukan Anda.</p>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {feedbackCategories.map((category) => {
                const Icon = icons[category] || Sparkles;
                const active = form.category === category;
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => update("category", category)}
                    className={`relative min-h-[86px] rounded-2xl border px-1.5 py-2 text-center shadow-sm transition ${
                      active ? "border-violet-600 bg-violet-50 text-violet-700 ring-2 ring-violet-100" : "border-slate-200 bg-white text-slate-700"
                    }`}
                  >
                    {active && (
                      <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-violet-700 text-white">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                    <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-white text-violet-700 shadow-sm">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="mt-2 line-clamp-2 block text-[10px] font-black leading-tight">{category}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="rounded-[24px] border border-white bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black text-slate-950">2. Saran / Masukan</h2>
            <p className="mt-1 text-sm text-slate-500">Semua masukan Anda sangat berharga bagi kami.</p>
            <label className="mt-4 block">
              <textarea
                required
                minLength={10}
                maxLength={1000}
                rows={7}
                value={form.message}
                onChange={(event) => update("message", event.target.value)}
                placeholder="Tuliskan saran, masukan, pengalaman, atau kendala yang Anda alami."
                className="w-full resize-none rounded-2xl border border-slate-200 px-4 py-3 text-sm leading-relaxed outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
              />
              <span className="mt-2 block text-right text-xs font-semibold text-slate-500">
                {form.message.length} / 1000
              </span>
            </label>
          </section>

          <section className="rounded-[24px] border border-white bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black text-slate-950">3. Detail tambahan (opsional)</h2>
            <p className="mt-1 text-sm text-slate-500">Tambahkan lampiran jika dibutuhkan.</p>
            <label className="mt-4 flex min-h-[56px] cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 px-4 text-sm font-bold text-slate-700">
              <Paperclip className="h-5 w-5 text-violet-700" />
              <span className="min-w-0 flex-1 truncate">
                {form.attachment ? form.attachment.name : "Lampiran jpg, jpeg, png, atau pdf"}
              </span>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(event) => handleFile(event.target.files?.[0])}
                className="hidden"
              />
            </label>
          </section>

          <section className="rounded-[24px] border border-white bg-white p-5 shadow-sm">
            <h2 className="text-lg font-black text-slate-950">4. Kontak (opsional)</h2>
            <p className="mt-1 text-sm text-slate-500">Jika berkenan, tinggalkan kontak agar kami bisa menghubungi Anda.</p>
            <label className="relative mt-4 block">
              <Phone className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-violet-700" />
              <input
                value={form.contact_number}
                onChange={(event) => update("contact_number", event.target.value)}
                placeholder="Contoh: 0812 3456 7890"
                className="h-14 w-full rounded-2xl border border-slate-200 pl-12 pr-4 text-sm font-semibold outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
              />
            </label>
            <div className="mt-5 flex gap-3 rounded-2xl bg-violet-50 p-4 text-violet-900">
              <LockKeyhole className="mt-0.5 h-5 w-5 shrink-0 text-violet-700" />
              <p className="text-sm leading-relaxed">
                Data Anda hanya digunakan untuk keperluan tindak lanjut dan peningkatan layanan GEx.
              </p>
            </div>
            {error && <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={!canSubmit || submitting}
              className="mt-5 flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-violet-700 text-base font-black text-white shadow-lg shadow-violet-700/20 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
            >
              <Send className="h-5 w-5" />
              {submitting ? "Mengirim..." : "Kirim Masukan"}
            </button>
          </section>
        </form>
      </main>
    </div>
  );
}
