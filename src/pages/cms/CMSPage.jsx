import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Navigate } from "react-router-dom";
import {
  ArrowDown,
  ArrowUp,
  ExternalLink,
  FileText,
  Instagram,
  MapPin,
  Pencil,
  Save,
  Ship,
  Sparkles,
  Play,
} from "lucide-react";
import SubPageHeader from "../../components/layout/SubPageHeader";
import { LoadingState } from "../../components/common/Loading";
import { useAuth } from "../../context/useAuth";
import {
  createBannerDashboard,
  createDisplayedBranch,
  createDisplayedShipSchedule,
  createTermsAndConditions,
  getBannerDashboard,
  getDisplayedBranches,
  getDisplayedShipSchedules,
  getTermsAndConditions,
  reorderDisplayedBranches,
  reorderDisplayedShipSchedules,
  reorderTermsAndConditions,
  updateBannerDashboard,
  updateDisplayedBranch,
  updateDisplayedShipSchedule,
  updateTermsAndConditions,
} from "../../services/api/content/contentApi";
import { extractYoutubeVideoId, getYoutubeThumbnail } from "../../utils/youtube";

const sections = [
  { key: "banner-dashboard", title: "Banner Dashboard", icon: Sparkles, color: "bg-sky-100 text-sky-700" },
  { key: "ship-schedules", title: "Jadwal Kapal", icon: Ship, color: "bg-indigo-100 text-indigo-700" },
  { key: "branches", title: "Lokasi Gerai", icon: MapPin, color: "bg-emerald-100 text-emerald-700" },
  { key: "terms", title: "Bantuan / Syarat & Ketentuan", icon: FileText, color: "bg-amber-100 text-amber-700" },
  { key: "instagram", title: "Instagram Content", icon: Instagram, color: "bg-pink-100 text-pink-700" },
];

const configs = {
  "banner-dashboard": {
    title: "Banner Dashboard",
    emptyForm: { content_url: "", title: "", description: "", is_active: true },
    fetch: getBannerDashboard,
    create: createBannerDashboard,
    update: updateBannerDashboard,
    fields: [
      ["content_url", "URL Video YouTube", "url", "https://youtu.be/xxxxx", "Masukkan link video YouTube"],
      ["title", "Judul", "text"],
      ["description", "Deskripsi", "textarea"],
      ["is_active", "Aktif", "checkbox"],
    ],
  },
  "ship-schedules": {
    title: "Jadwal Kapal",
    emptyForm: {
      ship_name: "",
      closing_date: "",
      depart_date: "",
      estimated_arrival: "",
      origin_city: "",
      destination_city: "",
      via_type: "",
      order_number: 0,
    },
    fetch: getDisplayedShipSchedules,
    create: createDisplayedShipSchedule,
    update: updateDisplayedShipSchedule,
    reorder: reorderDisplayedShipSchedules,
    fields: [
      ["ship_name", "Nama Kapal", "text"],
      ["closing_date", "Closing Date", "date"],
      ["depart_date", "Depart Date", "date"],
      ["estimated_arrival", "Estimasi Tiba", "date"],
      ["origin_city", "Kota Asal", "text"],
      ["destination_city", "Kota Tujuan", "text"],
      ["via_type", "Via", "text"],
      ["order_number", "Urutan", "number"],
    ],
  },
  branches: {
    title: "Lokasi Gerai",
    emptyForm: {
      branch_name: "",
      address: "",
      map_url: "",
      phone_number: "",
      whatsapp_url: "",
      order_number: 0,
    },
    fetch: getDisplayedBranches,
    create: createDisplayedBranch,
    update: updateDisplayedBranch,
    reorder: reorderDisplayedBranches,
    fields: [
      ["branch_name", "Nama Gerai", "text"],
      ["address", "Alamat", "textarea"],
      ["map_url", "URL Maps", "url"],
      ["phone_number", "Nomor Telepon", "number"],
      ["whatsapp_url", "URL WhatsApp", "url"],
      ["order_number", "Urutan", "number"],
    ],
  },
  terms: {
    title: "Bantuan / Syarat & Ketentuan",
    emptyForm: { title: "", content: "", order_number: 0 },
    fetch: getTermsAndConditions,
    create: createTermsAndConditions,
    update: updateTermsAndConditions,
    reorder: reorderTermsAndConditions,
    fields: [
      ["title", "Judul", "text"],
      ["content", "Konten", "textarea"],
      ["order_number", "Urutan", "number"],
    ],
  },
};

const canAccessSection = (role, section) => {
  if (role === "general_manager") return true;
  return role === "branch_manager" && section === "ship-schedules";
};

const toDateInput = (value) => (value ? String(value).slice(0, 10) : "");

function Field({ field, form, setForm }) {
  const [name, label, type, placeholder, helperText] = field;
  const value = type === "date" ? toDateInput(form[name]) : form[name] ?? "";

  if (type === "checkbox") {
    return (
      <label className="flex items-center justify-between rounded-xl border bg-white px-3 py-2 text-sm">
        <span className="font-medium text-gray-700">{label}</span>
        <input
          type="checkbox"
          checked={Boolean(form[name])}
          onChange={(e) => setForm({ ...form, [name]: e.target.checked })}
          className="h-4 w-4 accent-blue-600"
        />
      </label>
    );
  }

  if (type === "textarea") {
    return (
      <div>
        <textarea
          value={value}
          onChange={(e) => setForm({ ...form, [name]: e.target.value })}
          placeholder={placeholder || label}
          rows={name === "content" ? 6 : 3}
          className="w-full rounded-xl border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
        {helperText && <p className="mt-1 px-1 text-xs text-gray-500">{helperText}</p>}
      </div>
    );
  }

  return (
    <div>
      <input
        type={type}
        value={value}
        onChange={(e) => setForm({ ...form, [name]: type === "number" ? e.target.value : e.target.value })}
        placeholder={placeholder || label}
        className="w-full rounded-xl border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
      />
      {helperText && <p className="mt-1 px-1 text-xs text-gray-500">{helperText}</p>}
    </div>
  );
}

function BannerPreview({ form }) {
  const [thumbnailError, setThumbnailError] = useState(false);

  useEffect(() => {
    setThumbnailError(false);
  }, [form.content_url]);

  if (!("content_url" in form)) return null;

  const videoId = extractYoutubeVideoId(form.content_url);
  const thumbnail = getYoutubeThumbnail(form.content_url);
  const canPreview = videoId && thumbnail && !thumbnailError;

  return (
    <div className="overflow-hidden rounded-xl border bg-gray-900 text-white">
      {canPreview ? (
        <div className="relative h-32">
          <img
            src={thumbnail}
            alt={form.title || "Thumbnail YouTube"}
            className="h-full w-full object-cover"
            onError={() => setThumbnailError(true)}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/25 text-white backdrop-blur-sm">
              <Play className="ml-0.5 h-6 w-6" fill="white" />
            </div>
          </div>
        </div>
      ) : form.content_url ? (
        <div className="flex h-32 items-center justify-center bg-gray-200 px-4 text-center text-sm text-gray-500">
          Thumbnail YouTube tidak tersedia
        </div>
      ) : (
        <div className="flex h-32 items-center justify-center bg-gray-200 text-sm text-gray-500">Preview thumbnail YouTube</div>
      )}
      <div className="p-3">
        <p className="text-sm font-semibold">{form.title || "Judul banner"}</p>
        <p className="mt-1 text-xs text-white/75">{form.description || "Deskripsi banner"}</p>
      </div>
    </div>
  );
}

function CardSummary({ section, item }) {
  if (section === "banner-dashboard") {
    return (
      <>
        <p className="font-semibold text-gray-800">{item.title || "Tanpa judul"}</p>
        <p className="text-xs text-gray-500">{item.is_active ? "Aktif" : "Nonaktif"}</p>
      </>
    );
  }

  if (section === "ship-schedules") {
    return (
      <>
        <p className="font-semibold text-gray-800">{item.ship_name}</p>
        <p className="text-xs text-gray-500">{item.origin_city || "-"} ke {item.destination_city || "-"}</p>
      </>
    );
  }

  if (section === "branches") {
    return (
      <>
        <p className="font-semibold text-gray-800">{item.branch_name}</p>
        <p className="text-xs text-gray-500">{item.address || "-"}</p>
      </>
    );
  }

  return (
    <>
      <p className="font-semibold text-gray-800">{item.title}</p>
      <p className="line-clamp-2 text-xs text-gray-500">{item.content}</p>
    </>
  );
}

export default function CMSPage() {
  const { role } = useAuth();
  const navigate = useNavigate();
  const { section } = useParams();
  const activeSection = section || "";
  const config = configs[activeSection];
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(config?.emptyForm || {});
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const orderedItems = useMemo(() => items || [], [items]);
  const accessibleSections = useMemo(
    () => sections.filter((item) => canAccessSection(role, item.key)),
    [role]
  );

  useEffect(() => {
    if (!config) return;
    setForm(config.emptyForm);
    setEditingId(null);
    fetchData();
  }, [activeSection]);

  if (!["general_manager", "branch_manager"].includes(role)) {
    return <Navigate to="/home" replace />;
  }

  if (section && !canAccessSection(role, section)) {
    return <Navigate to={role === "branch_manager" ? "/cms/ship-schedules" : "/cms"} replace />;
  }

  if (!section) {
    if (role === "branch_manager") {
      return <Navigate to="/cms/ship-schedules" replace />;
    }

    return (
      <div className="min-h-dvh bg-gray-50 p-4">
        <SubPageHeader title="Konten Customer" subtitle="Kelola konten yang tampil di aplikasi customer" />
        <div className="grid grid-cols-2 gap-3">
          {accessibleSections.map((item) => (
            <button
              key={item.key}
              onClick={() => navigate(`/cms/${item.key}`)}
              className="rounded-xl border bg-white p-4 text-left shadow-sm transition hover:shadow-md"
            >
              <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${item.color}`}>
                <item.icon className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold text-gray-800">{item.title}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (!config) return <Navigate to="/cms" replace />;

  async function fetchData() {
    try {
      setLoading(true);
      setItems(await config.fetch());
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  const resetForm = () => {
    setEditingId(null);
    setForm(config.emptyForm);
  };

  const submit = async () => {
    try {
      setSaving(true);
      const payload = { ...form };
      Object.keys(payload).forEach((key) => {
        if (payload[key] === "") payload[key] = null;
        if (key === "order_number" || key === "phone_number") {
          payload[key] = payload[key] === null ? null : Number(payload[key]);
        }
      });

      if (editingId) await config.update(editingId, payload);
      else await config.create(payload);

      resetForm();
      await fetchData();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const edit = (item) => {
    setEditingId(item.id);
    setForm({ ...config.emptyForm, ...item });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const move = async (index, direction) => {
    const nextIndex = index + direction;
    if (!config.reorder || nextIndex < 0 || nextIndex >= orderedItems.length) return;

    const next = [...orderedItems];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    const payload = next.map((item, idx) => ({ id: item.id, order_number: idx + 1 }));

    try {
      setItems(next.map((item, idx) => ({ ...item, order_number: idx + 1 })));
      await config.reorder(payload);
      await fetchData();
    } catch (err) {
      alert(err.message);
      fetchData();
    }
  };

  return (
    <div className="min-h-dvh bg-gray-50 p-4">
      <SubPageHeader title={config.title} subtitle="Create dan update konten customer" />

      <div className="space-y-4">
        <section className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-800">{editingId ? "Edit Konten" : "Tambah Konten"}</h2>
            {editingId && <button onClick={resetForm} className="text-xs font-medium text-blue-600">Batal edit</button>}
          </div>

          <div className="space-y-3">
            {config.fields.map((field) => (
              <Field key={field[0]} field={field} form={form} setForm={setForm} />
            ))}
            <BannerPreview form={form} />
            <button
              onClick={submit}
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </section>

        <section className="space-y-3">
          {loading ? (
            <LoadingState variant="list" rows={4} />
          ) : orderedItems.length === 0 ? (
            <div className="rounded-xl border bg-white p-5 text-center text-sm text-gray-400">Belum ada konten</div>
          ) : (
            orderedItems.map((item, index) => (
              <div key={item.id} className="rounded-xl border bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <CardSummary section={activeSection} item={item} />
                    {"order_number" in item && (
                      <p className="mt-2 text-[11px] font-medium text-gray-400">Urutan {item.order_number ?? index + 1}</p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    {activeSection === "branches" && item.map_url && (
                      <a href={item.map_url} target="_blank" rel="noreferrer" className="rounded-lg p-2 text-emerald-600 hover:bg-emerald-50">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                    {config.reorder && (
                      <>
                        <button onClick={() => move(index, -1)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
                          <ArrowUp className="h-4 w-4" />
                        </button>
                        <button onClick={() => move(index, 1)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
                          <ArrowDown className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    <button onClick={() => edit(item)} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50">
                      <Pencil className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                {activeSection === "branches" && item.whatsapp_url && (
                  <a href={item.whatsapp_url} target="_blank" rel="noreferrer" className="mt-3 inline-flex text-xs font-semibold text-green-600">
                    WhatsApp
                  </a>
                )}
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
