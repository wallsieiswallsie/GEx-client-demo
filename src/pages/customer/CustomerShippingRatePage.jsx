import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BadgeInfo,
  Box,
  Building2,
  Calculator,
  Clock3,
  Info,
  MapPin,
  Plane,
  Ruler,
  Search,
  ShieldCheck,
  Ship,
  Sparkles,
  Timer,
  Wallet,
  Weight,
  Zap,
} from "lucide-react";
import {
  checkCustomerShippingRate,
  getCustomerShippingRateBranches,
} from "../../services/api/customerShippingRateApi";

const initialForm = {
  origin_branch: "",
  destination_branch: "",
  real_weight: "",
  length: "",
  width: "",
  height: "",
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const numberValue = (value) => Number(String(value).replace(",", "."));

function getBranchLabel(branch) {
  return branch.city || branch.branch_name || branch.district || branch.branch_code;
}

function getViaVisual(viaCode, viaName) {
  const code = String(viaCode || "").toLowerCase();
  const name = String(viaName || "").toLowerCase();

  if (code === "p" || name.includes("pesawat") || name.includes("udara")) {
    return {
      Icon: Plane,
      accent: "blue",
      card: "border-blue-100 bg-blue-50/60",
      icon: "bg-blue-100 text-blue-600",
      price: "text-blue-600",
      badge: "bg-blue-50 text-blue-700",
    };
  }

  return {
    Icon: Ship,
    accent: "red",
    card: "border-red-100 bg-red-50/60",
    icon: "bg-red-100 text-red-600",
    price: "text-red-600",
    badge: "bg-red-50 text-red-700",
  };
}

export default function CustomerShippingRatePage() {
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [results, setResults] = useState([]);
  const [hasChecked, setHasChecked] = useState(false);
  const [loadingBranches, setLoadingBranches] = useState(true);
  const [checking, setChecking] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    getCustomerShippingRateBranches()
      .then((data) => setBranches(data || []))
      .catch(() => {
        setBranches([]);
        setServerError("Gagal mengambil daftar gudang. Coba lagi nanti.");
      })
      .finally(() => setLoadingBranches(false));
  }, []);

  const branchOptions = useMemo(
    () =>
      branches.map((branch) => ({
        value: branch.branch_code,
        label: getBranchLabel(branch),
        meta: [branch.district, branch.province].filter(Boolean).join(", "),
      })),
    [branches]
  );

  const validateForm = (nextForm = form) => {
    const nextErrors = {};

    if (!nextForm.origin_branch) nextErrors.origin_branch = "Pilih gudang asal.";
    if (!nextForm.destination_branch) nextErrors.destination_branch = "Pilih gudang tujuan.";
    if (
      nextForm.origin_branch &&
      nextForm.destination_branch &&
      nextForm.origin_branch === nextForm.destination_branch
    ) {
      nextErrors.destination_branch = "Gudang tujuan harus berbeda dari gudang asal.";
    }

    [
      ["real_weight", "Berat aktual"],
      ["length", "Panjang"],
      ["width", "Lebar"],
      ["height", "Tinggi"],
    ].forEach(([key, label]) => {
      if (!nextForm[key]) {
        nextErrors[key] = `${label} wajib diisi.`;
      } else if (!Number.isFinite(numberValue(nextForm[key])) || numberValue(nextForm[key]) <= 0) {
        nextErrors[key] = `${label} harus lebih dari 0.`;
      }
    });

    return nextErrors;
  };

  const isFormComplete =
    Object.values(form).every(Boolean) && Object.keys(validateForm()).length === 0;

  const updateField = (key, value) => {
    const nextForm = { ...form, [key]: value };
    setForm(nextForm);
    setErrors(validateForm(nextForm));
    setServerError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateForm();
    setErrors(nextErrors);
    setHasChecked(true);
    setServerError("");

    if (Object.keys(nextErrors).length > 0) return;

    setChecking(true);
    try {
      const data = await checkCustomerShippingRate({
        origin_branch: form.origin_branch,
        destination_branch: form.destination_branch,
        real_weight: numberValue(form.real_weight),
        length: numberValue(form.length),
        width: numberValue(form.width),
        height: numberValue(form.height),
      });

      setResults(data || []);
    } catch (err) {
      setResults([]);
      setServerError(err.message || "Gagal mengecek tarif. Coba lagi nanti.");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-dvh bg-gray-50 pb-6 text-slate-900">
      <section
        className="relative overflow-hidden px-6 pb-16 pt-8 text-white"
        style={{
          backgroundImage: "url('/images/header_background/cek_ongkir.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute bottom-0 left-0 right-0 h-10 rounded-t-[50%] bg-gray-50" />

        <div className="relative z-10 flex items-start gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur transition hover:bg-white/25"
            aria-label="Kembali"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-3xl font-bold leading-tight">Cek Tarif</h1>
            <p className="mt-2 max-w-[180px] text-sm leading-relaxed text-white/85">
              Hitung ongkos kirim dengan mudah dan cepat
            </p>
          </div>
        </div>
      </section>

      <main className="relative -mt-10 space-y-5 px-4">
        <form
          onSubmit={handleSubmit}
          className="rounded-[28px] border border-white bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.12)]"
        >
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <Search className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-950">Hitung Ongkos Kirim</h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-500">
                Masukkan detail paket untuk melihat estimasi biaya.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <SelectField
              label="Gudang Asal"
              icon={MapPin}
              inputIcon={Building2}
              accent="violet"
              value={form.origin_branch}
              placeholder={loadingBranches ? "Memuat gudang..." : "Pilih gudang asal"}
              options={branchOptions}
              error={errors.origin_branch}
              onChange={(value) => updateField("origin_branch", value)}
            />

            <SelectField
              label="Gudang Tujuan"
              icon={MapPin}
              inputIcon={Building2}
              accent="red"
              value={form.destination_branch}
              placeholder={loadingBranches ? "Memuat gudang..." : "Pilih gudang tujuan"}
              options={branchOptions}
              error={errors.destination_branch}
              onChange={(value) => updateField("destination_branch", value)}
            />

            <div className="border-t border-dashed border-slate-200 pt-5">
              <NumberField
                label="Berat Aktual (Kg)"
                icon={Weight}
                inputIcon={Weight}
                value={form.real_weight}
                placeholder="Contoh: 5.5"
                error={errors.real_weight}
                onChange={(value) => updateField("real_weight", value)}
              />
            </div>

            <div>
              <div className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700">
                <Ruler className="h-5 w-5 text-violet-700" />
                Dimensi Paket (cm)
              </div>
              <div className="grid grid-cols-3 gap-2">
                <DimensionField
                  label="Panjang"
                  value={form.length}
                  error={errors.length}
                  onChange={(value) => updateField("length", value)}
                />
                <DimensionField
                  label="Lebar"
                  value={form.width}
                  error={errors.width}
                  onChange={(value) => updateField("width", value)}
                />
                <DimensionField
                  label="Tinggi"
                  value={form.height}
                  error={errors.height}
                  onChange={(value) => updateField("height", value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 rounded-2xl bg-violet-50 p-4">
              <div className="flex min-w-0 items-start gap-3">
                <Info className="mt-0.5 h-6 w-6 shrink-0 text-violet-700" />
                <div>
                  <p className="font-bold text-violet-800">Informasi</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-600">
                    Pastikan berat dan dimensi paket sudah sesuai dengan paket yang akan dikirim.
                  </p>
                </div>
              </div>
              <img
                src="/images/dimensi-cek_tarif.png"
                alt=""
                className="h-20 w-28 shrink-0 object-contain sm:h-24 sm:w-32"
              />
            </div>

            {serverError && (
              <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {serverError}
              </p>
            )}

            <button
              type="submit"
              disabled={!isFormComplete || checking}
              className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-red-600 px-5 text-base font-bold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
            >
              {checking ? "Menghitung..." : "Cek Tarif Sekarang"}
              {!checking && <ArrowRight className="h-6 w-6" />}
            </button>

            {hasChecked && Object.keys(errors).length > 0 && (
              <p className="text-center text-xs font-medium text-red-500">
                Lengkapi data paket dengan benar sebelum mengecek tarif.
              </p>
            )}
          </div>
        </form>

        {!hasChecked && (
          <div className="grid grid-cols-3 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <TrustItem icon={ShieldCheck} title="Tarif Akurat" text="Perhitungan real-time" />
            <TrustItem icon={Timer} title="Cepat" text="Hasil hitungan detik" />
            <TrustItem icon={Sparkles} title="Aman" text="Hanya kalkulasi tarif" />
          </div>
        )}

        {hasChecked && (
          <section className="space-y-4">
            <div className="flex items-start gap-3">
              <Box className="mt-1 h-6 w-6 text-violet-700" />
              <div>
                <h2 className="text-xl font-bold text-slate-950">Hasil Perhitungan</h2>
                <p className="text-sm text-slate-500">
                  Berikut estimasi biaya pengiriman untuk paket Anda.
                </p>
              </div>
            </div>

            {checking ? (
              <div className="rounded-2xl border bg-white p-5 text-center text-sm font-medium text-slate-500">
                Mengambil opsi pengiriman terbaik...
              </div>
            ) : results.length === 0 ? (
              <div className="rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-700">
                  <Calculator className="h-7 w-7" />
                </div>
                <h3 className="font-bold text-slate-900">Rute belum tersedia</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">
                  Kami belum menemukan tarif untuk gudang asal dan tujuan tersebut.
                  Silakan pilih kombinasi gudang lain.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {results.map((item) => (
                  <RateResultCard key={item.route_code} item={item} />
                ))}
              </div>
            )}

            <div className="flex items-center gap-3 rounded-2xl bg-violet-50 p-4">
              <BadgeInfo className="h-8 w-8 shrink-0 text-violet-700" />
              <div className="min-w-0 flex-1">
                <p className="font-bold text-violet-800">Catatan Penting</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">
                  Estimasi biaya dapat berubah sesuai dengan berat aktual dan kebijakan pengiriman terbaru.
                </p>
              </div>
              <Wallet className="h-12 w-12 shrink-0 text-violet-500" />
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function SelectField({
  label,
  icon: Icon,
  inputIcon: InputIcon,
  accent,
  value,
  placeholder,
  options,
  error,
  onChange,
}) {
  const accentClass = accent === "red" ? "text-red-600 bg-red-50" : "text-violet-700 bg-violet-50";

  return (
    <label className="block">
      <span className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700">
        <Icon className={`h-5 w-5 ${accent === "red" ? "text-red-600" : "text-violet-700"}`} />
        {label}
      </span>
      <span className="relative block">
        <span className={`pointer-events-none absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl ${accentClass}`}>
          <InputIcon className="h-5 w-5" />
        </span>
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-14 w-full appearance-none rounded-2xl border border-slate-200 bg-white py-0 pl-16 pr-10 text-base font-semibold text-slate-800 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.meta ? `${option.label} - ${option.meta}` : option.label}
            </option>
          ))}
        </select>
        <ArrowRight className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 rotate-90 text-slate-500" />
      </span>
      {error && <span className="mt-2 block text-xs font-medium text-red-500">{error}</span>}
    </label>
  );
}

function NumberField({ label, icon: Icon, inputIcon: InputIcon, value, placeholder, error, onChange }) {
  return (
    <label className="block">
      <span className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-700">
        <Icon className="h-5 w-5 text-violet-700" />
        {label}
      </span>
      <span className="relative block">
        <span className="pointer-events-none absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
          <InputIcon className="h-5 w-5" />
        </span>
        <input
          type="number"
          min="0"
          step="0.01"
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="h-14 w-full rounded-2xl border border-slate-200 bg-white py-0 pl-16 pr-4 text-base font-semibold text-slate-800 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
        />
      </span>
      {error && <span className="mt-2 block text-xs font-medium text-red-500">{error}</span>}
    </label>
  );
}

function DimensionField({ label, value, error, onChange }) {
  return (
    <label className="block min-w-0">
      <span className="relative block">
        <Box className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-violet-700" />
        <input
          type="number"
          min="0"
          step="0.1"
          inputMode="decimal"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={label}
          aria-label={label}
          className="h-14 w-full rounded-2xl border border-slate-200 bg-white py-0 pl-10 pr-2 text-sm font-semibold text-slate-800 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
        />
      </span>
      {error && <span className="mt-1 block text-[10px] font-medium leading-tight text-red-500">{error}</span>}
    </label>
  );
}

function TrustItem({ icon: Icon, title, text }) {
  return (
    <div className="border-r border-slate-100 p-3 last:border-r-0">
      <Icon className="mb-2 h-6 w-6 text-violet-700" />
      <p className="text-[11px] font-bold text-slate-800">{title}</p>
      <p className="mt-1 text-[10px] leading-snug text-slate-500">{text}</p>
    </div>
  );
}

function RateResultCard({ item }) {
  const visual = getViaVisual(item.via_code, item.via_name);
  const Icon = visual.Icon;
  const isFast = item.label === "Paling Cepat";

  return (
    <article className={`rounded-2xl border p-4 shadow-sm ${visual.card}`}>
      <div className="flex items-center gap-4">
        <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${visual.icon}`}>
          <Icon className="h-9 w-9" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-bold text-slate-950">{item.via_name}</h3>
          {item.estimated_days && (
            <p className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold ${visual.badge}`}>
              <Clock3 className="h-3.5 w-3.5" />
              Estimasi {item.estimated_days}
            </p>
          )}
          <p className="mt-3 text-sm text-slate-600">
            Berat Dihitung: <span className="font-bold text-slate-800">{item.used_weight} Kg</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-medium text-slate-500">Estimasi Biaya</p>
          <p className={`mt-2 whitespace-nowrap text-2xl font-black ${visual.price}`}>
            {formatCurrency(item.price)}
          </p>
          {item.label && (
            <p className={`mt-3 inline-flex items-center gap-1 rounded-full bg-white px-2 py-1 text-xs font-bold ${visual.price}`}>
              {isFast ? <Zap className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
              {item.label}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
