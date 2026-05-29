import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import {
  AlertTriangle,
  Calculator,
  CheckCircle2,
  CreditCard,
  Eye,
  Grid2X2,
  Headphones,
  MapPin,
  PackageSearch,
  Pencil,
  Plus,
  Rocket,
  Save,
  Search,
  Settings,
  ShieldCheck,
  Star,
  Trash2,
  X,
} from "lucide-react";
import SubPageHeader from "../../components/layout/SubPageHeader";
import { isGeneralManagerRole } from "../../utils/roleAccess";
import { LoadingState } from "../../components/common/Loading";
import { useAuth } from "../../context/useAuth";
import {
  createHelpCategory,
  createHelpFaq,
  deleteHelpCategory,
  deleteHelpFaq,
  getInternalHelpCategories,
  getInternalHelpFaqs,
  getInternalHelpSettings,
  toggleHelpFaqActive,
  toggleHelpFaqPopular,
  updateHelpCategory,
  updateHelpFaq,
  updateInternalHelpSettings,
} from "../../services/api/helpApi";

const tabs = [
  { key: "categories", label: "Kategori" },
  { key: "faqs", label: "FAQ" },
  { key: "settings", label: "Pengaturan" },
];

const iconOptions = [
  { key: "Rocket", label: "Pengiriman", Icon: Rocket },
  { key: "Calculator", label: "Tarif", Icon: Calculator },
  { key: "PackageSearch", label: "Lacak", Icon: PackageSearch },
  { key: "AlertTriangle", label: "Peringatan", Icon: AlertTriangle },
  { key: "CreditCard", label: "Bayar", Icon: CreditCard },
  { key: "ShieldCheck", label: "Klaim", Icon: ShieldCheck },
  { key: "MapPin", label: "Embargo", Icon: MapPin },
  { key: "Grid2X2", label: "Lainnya", Icon: Grid2X2 },
];

const iconMap = Object.fromEntries(iconOptions.map((item) => [item.key, item.Icon]));

const emptyCategory = {
  name: "",
  slug: "",
  description: "",
  icon: "Rocket",
  sort_order: 0,
  is_active: true,
};

const emptyFaq = {
  category_id: null,
  question: "",
  answer: "",
  keywords: "",
  is_popular: false,
  is_active: true,
  sort_order: 0,
};

const emptySettings = {
  support_whatsapp: "",
  support_message: "Halo GEx, saya membutuhkan bantuan.",
  header_title: "Ada yang bisa GEx bantu?",
  header_subtitle: "Temukan jawaban atau solusi dari pertanyaanmu di sini.",
};

const toSlug = (value) =>
  value
    .toLowerCase()
    .replace(/&/g, "dan")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function StatusBadge({ active }) {
  return (
    <span className={`rounded-full px-2 py-1 text-[11px] font-bold ${active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
      {active ? "Aktif" : "Nonaktif"}
    </span>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/40 p-3 sm:items-center">
      <div className="max-h-[88dvh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-black text-slate-950">{title}</h2>
          <button type="button" onClick={onClose} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ConfirmModal({ confirm, onCancel, onConfirm, busy }) {
  if (!confirm) return null;

  return (
    <Modal title={confirm.title} onClose={onCancel}>
      <p className="text-sm leading-relaxed text-slate-600">{confirm.message}</p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <button type="button" onClick={onCancel} className="h-11 rounded-xl border font-bold text-slate-600">
          Batal
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={busy}
          className="h-11 rounded-xl bg-red-600 font-bold text-white disabled:opacity-60"
        >
          {busy ? "Memproses..." : "Ya, nonaktifkan"}
        </button>
      </div>
    </Modal>
  );
}

function TextField({ label, value, onChange, type = "text", required = false, placeholder }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-slate-600">{label}</span>
      <input
        type={type}
        required={required}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder || label}
        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
      />
    </label>
  );
}

function TextAreaField({ label, value, onChange, rows = 4, required = false }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-slate-600">{label}</span>
      <textarea
        rows={rows}
        required={required}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder={label}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
      />
    </label>
  );
}

function ToggleField({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between rounded-xl border bg-white px-3 py-2 text-sm">
      <span className="font-bold text-slate-700">{label}</span>
      <input
        type="checkbox"
        checked={Boolean(checked)}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 accent-violet-700"
      />
    </label>
  );
}

function CategoryForm({ initialValue, onSubmit, onClose, saving }) {
  const [form, setForm] = useState(initialValue || emptyCategory);

  const update = (key, value) => {
    setForm((current) => {
      const next = { ...current, [key]: value };
      if (key === "name" && !current.id) next.slug = toSlug(value);
      return next;
    });
  };

  const submit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      sort_order: Number(form.sort_order || 0),
    });
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <TextField label="Nama kategori" required value={form.name} onChange={(value) => update("name", value)} />
      <TextField label="Slug" required value={form.slug} onChange={(value) => update("slug", toSlug(value))} />
      <TextAreaField label="Deskripsi" rows={3} value={form.description} onChange={(value) => update("description", value)} />
      <TextField label="Urutan" type="number" value={form.sort_order} onChange={(value) => update("sort_order", value)} />

      <div>
        <span className="mb-2 block text-xs font-bold text-slate-600">Icon</span>
        <div className="grid grid-cols-4 gap-2">
          {iconOptions.map(({ key, label, Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => update("icon", key)}
              className={`rounded-xl border p-2 text-center ${form.icon === key ? "border-violet-400 bg-violet-50 text-violet-700" : "border-slate-200 text-slate-500"}`}
            >
              <Icon className="mx-auto h-5 w-5" />
              <span className="mt-1 block truncate text-[10px] font-bold">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <ToggleField label="Aktif" checked={form.is_active} onChange={(value) => update("is_active", value)} />
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button type="button" onClick={onClose} className="h-11 rounded-xl border font-bold text-slate-600">Batal</button>
        <button disabled={saving} className="flex h-11 items-center justify-center gap-2 rounded-xl bg-violet-700 font-bold text-white disabled:opacity-60">
          <Save className="h-4 w-4" />
          {saving ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );
}

function FaqForm({ initialValue, categories, onSubmit, onClose, saving }) {
  const [form, setForm] = useState(initialValue || emptyFaq);
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      category_id: form.category_id ? Number(form.category_id) : null,
      sort_order: Number(form.sort_order || 0),
    });
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <label className="block">
        <span className="mb-1.5 block text-xs font-bold text-slate-600">Kategori</span>
        <select
          value={form.category_id || ""}
          onChange={(event) => update("category_id", event.target.value || null)}
          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
        >
          <option value="">Tanpa kategori</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </label>
      <TextField label="Pertanyaan" required value={form.question} onChange={(value) => update("question", value)} />
      <TextAreaField label="Jawaban" required rows={6} value={form.answer} onChange={(value) => update("answer", value)} />
      <TextAreaField label="Keywords" rows={3} value={form.keywords} onChange={(value) => update("keywords", value)} />
      <TextField label="Urutan" type="number" value={form.sort_order} onChange={(value) => update("sort_order", value)} />
      <div className="grid grid-cols-2 gap-2">
        <ToggleField label="Populer" checked={form.is_popular} onChange={(value) => update("is_popular", value)} />
        <ToggleField label="Aktif" checked={form.is_active} onChange={(value) => update("is_active", value)} />
      </div>
      <div className="grid grid-cols-2 gap-3 pt-2">
        <button type="button" onClick={onClose} className="h-11 rounded-xl border font-bold text-slate-600">Batal</button>
        <button disabled={saving} className="flex h-11 items-center justify-center gap-2 rounded-xl bg-violet-700 font-bold text-white disabled:opacity-60">
          <Save className="h-4 w-4" />
          {saving ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </form>
  );
}

export default function HelpManagementPage() {
  const { role } = useAuth();
  const [activeTab, setActiveTab] = useState("categories");
  const [categories, setCategories] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [settings, setSettings] = useState(emptySettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [categoryModal, setCategoryModal] = useState(null);
  const [faqModal, setFaqModal] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [faqSearch, setFaqSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const activeCategories = useMemo(
    () => categories.filter((category) => category.is_active),
    [categories]
  );

  const filteredFaqs = useMemo(() => {
    const term = faqSearch.toLowerCase();
    return faqs.filter((faq) => {
      const matchSearch = !term || [faq.question, faq.answer, faq.keywords].some((value) => String(value || "").toLowerCase().includes(term));
      const matchCategory = !categoryFilter || String(faq.category_id || "") === categoryFilter;
      return matchSearch && matchCategory;
    });
  }, [faqs, faqSearch, categoryFilter]);

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError("");
      const [categoryData, faqData, settingsData] = await Promise.all([
        getInternalHelpCategories(),
        getInternalHelpFaqs(),
        getInternalHelpSettings(),
      ]);
      setCategories(categoryData || []);
      setFaqs(faqData || []);
      setSettings({ ...emptySettings, ...(settingsData || {}) });
    } catch (err) {
      setError(err.message || "Gagal mengambil data bantuan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  if (!isGeneralManagerRole(role)) {
    return <Navigate to="/home" replace />;
  }

  const saveCategory = async (payload) => {
    try {
      setSaving(true);
      if (categoryModal?.id) await updateHelpCategory(categoryModal.id, payload);
      else await createHelpCategory(payload);
      setCategoryModal(null);
      await fetchAll();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const saveFaq = async (payload) => {
    try {
      setSaving(true);
      if (faqModal?.id) await updateHelpFaq(faqModal.id, payload);
      else await createHelpFaq(payload);
      setFaqModal(null);
      await fetchAll();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const runConfirm = async () => {
    if (!confirm) return;
    try {
      setSaving(true);
      await confirm.action();
      setConfirm(null);
      await fetchAll();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const saveSettings = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      const updated = await updateInternalHelpSettings(settings);
      setSettings({ ...emptySettings, ...(updated || {}) });
      alert("Pengaturan bantuan berhasil disimpan");
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-dvh bg-slate-50 p-4 text-slate-900">
      <SubPageHeader title="Bantuan / FAQ" subtitle="Kelola konten bantuan customer GEx" />

      {error && <div className="mb-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</div>}

      <div className="mb-4 grid grid-cols-3 rounded-2xl bg-white p-1 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`h-10 rounded-xl text-sm font-bold ${activeTab === tab.key ? "bg-violet-700 text-white" : "text-slate-500"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingState variant="list" rows={5} />
      ) : activeTab === "categories" ? (
        <section className="space-y-3">
          <button
            type="button"
            onClick={() => setCategoryModal(emptyCategory)}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-violet-700 font-bold text-white"
          >
            <Plus className="h-5 w-5" />
            Tambah Kategori
          </button>

          {categories.map((category) => {
            const Icon = iconMap[category.icon] || Grid2X2;
            return (
              <article key={category.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-black text-slate-950">{category.name}</h3>
                      <StatusBadge active={category.is_active} />
                    </div>
                    <p className="mt-1 text-xs font-semibold text-slate-400">/{category.slug} - Urutan {category.sort_order || 0}</p>
                    {category.description && <p className="mt-2 text-sm leading-relaxed text-slate-500">{category.description}</p>}
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button type="button" onClick={() => setCategoryModal(category)} className="rounded-xl p-2 text-blue-600 hover:bg-blue-50">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirm({
                        title: "Nonaktifkan kategori?",
                        message: "Kategori akan disembunyikan dari customer, tetapi data tidak dihapus permanen.",
                        action: () => deleteHelpCategory(category.id),
                      })}
                      className="rounded-xl p-2 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      ) : activeTab === "faqs" ? (
        <section className="space-y-3">
          <button
            type="button"
            onClick={() => setFaqModal(emptyFaq)}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-violet-700 font-bold text-white"
          >
            <Plus className="h-5 w-5" />
            Tambah FAQ
          </button>

          <div className="grid gap-2 rounded-2xl bg-white p-3 shadow-sm">
            <label className="relative block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={faqSearch}
                onChange={(event) => setFaqSearch(event.target.value)}
                placeholder="Cari FAQ"
                className="h-11 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-violet-300"
              />
            </label>
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-300"
            >
              <option value="">Semua kategori</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>

          {filteredFaqs.length === 0 ? (
            <div className="rounded-2xl border bg-white p-5 text-center text-sm text-slate-400">Belum ada FAQ</div>
          ) : (
            filteredFaqs.map((faq) => (
              <article key={faq.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge active={faq.is_active} />
                      {faq.is_popular && (
                        <span className="rounded-full bg-amber-50 px-2 py-1 text-[11px] font-bold text-amber-700">Populer</span>
                      )}
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-500">{faq.category_name || "Tanpa kategori"}</span>
                    </div>
                    <h3 className="mt-2 font-black leading-snug text-slate-950">{faq.question}</h3>
                    <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-slate-500">{faq.answer}</p>
                    <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-slate-400">
                      <Eye className="h-4 w-4" />
                      {Number(faq.view_count || 0).toLocaleString("id-ID")} views - Urutan {faq.sort_order || 0}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-4 gap-2">
                  <button type="button" onClick={() => setFaqModal(faq)} className="flex h-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={async () => { await toggleHelpFaqPopular(faq.id); fetchAll(); }} className="flex h-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                    <Star className="h-4 w-4" fill={faq.is_popular ? "currentColor" : "none"} />
                  </button>
                  <button type="button" onClick={async () => { await toggleHelpFaqActive(faq.id); fetchAll(); }} className="flex h-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirm({
                      title: "Nonaktifkan FAQ?",
                      message: "FAQ akan disembunyikan dari customer, tetapi tetap tersimpan untuk internal.",
                      action: () => deleteHelpFaq(faq.id),
                    })}
                    className="flex h-10 items-center justify-center rounded-xl bg-red-50 text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </article>
            ))
          )}
        </section>
      ) : (
        <form onSubmit={saveSettings} className="space-y-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
          <div className="mb-2 flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
              <Settings className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-black text-slate-950">Pengaturan Bantuan</h2>
              <p className="text-xs text-slate-500">Nomor CS dan teks halaman customer</p>
            </div>
          </div>
          <TextField label="Nomor WhatsApp CS" value={settings.support_whatsapp} onChange={(value) => setSettings({ ...settings, support_whatsapp: value })} placeholder="08123456789" />
          <TextAreaField label="Pesan default WhatsApp" rows={3} value={settings.support_message} onChange={(value) => setSettings({ ...settings, support_message: value })} />
          <TextField label="Judul header bantuan" value={settings.header_title} onChange={(value) => setSettings({ ...settings, header_title: value })} />
          <TextAreaField label="Subtitle header bantuan" rows={3} value={settings.header_subtitle} onChange={(value) => setSettings({ ...settings, header_subtitle: value })} />
          <button disabled={saving} className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-violet-700 font-bold text-white disabled:opacity-60">
            <Headphones className="h-5 w-5" />
            {saving ? "Menyimpan..." : "Simpan Pengaturan"}
          </button>
        </form>
      )}

      {categoryModal && (
        <Modal title={categoryModal.id ? "Edit Kategori" : "Tambah Kategori"} onClose={() => setCategoryModal(null)}>
          <CategoryForm initialValue={categoryModal} onSubmit={saveCategory} onClose={() => setCategoryModal(null)} saving={saving} />
        </Modal>
      )}

      {faqModal && (
        <Modal title={faqModal.id ? "Edit FAQ" : "Tambah FAQ"} onClose={() => setFaqModal(null)}>
          <FaqForm initialValue={faqModal} categories={activeCategories} onSubmit={saveFaq} onClose={() => setFaqModal(null)} saving={saving} />
        </Modal>
      )}

      <ConfirmModal confirm={confirm} onCancel={() => setConfirm(null)} onConfirm={runConfirm} busy={saving} />
    </div>
  );
}
