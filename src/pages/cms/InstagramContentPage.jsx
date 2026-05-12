import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Instagram, Pencil, Save, X } from "lucide-react";
import SubPageHeader from "../../components/layout/SubPageHeader";
import { LoadingState } from "../../components/common/Loading";
import {
  createInstagramContent,
  getInstagramContents,
  reorderInstagramContents,
  updateInstagramContent,
} from "../../services/api/content/instagramContentApi";
import { detectInstagramPostType, extractInstagramCode } from "../../utils/instagram";

const emptyForm = {
  instagram_url: "",
  thumbnail: null,
  title: "",
  caption: "",
  is_active: true,
};

export default function InstagramContentPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const postType = useMemo(() => detectInstagramPostType(form.instagram_url), [form.instagram_url]);
  const isValidUrl = !form.instagram_url || extractInstagramCode(form.instagram_url);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!form.thumbnail) return;

    const objectUrl = URL.createObjectURL(form.thumbnail);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [form.thumbnail]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setItems(await getInstagramContents());
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setPreviewUrl("");
    setForm(emptyForm);
  };

  const submit = async () => {
    if (!extractInstagramCode(form.instagram_url)) {
      alert("Masukkan URL post/reel Instagram yang valid");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        instagram_url: form.instagram_url,
        title: form.title,
        caption: form.caption,
        is_active: String(form.is_active),
      };

      if (form.thumbnail) {
        payload.thumbnail = form.thumbnail;
      }

      if (editingId) await updateInstagramContent(editingId, payload);
      else await createInstagramContent(payload);

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
    setPreviewUrl(item.thumbnail_url || "");
    setForm({
      instagram_url: item.instagram_url || "",
      thumbnail: null,
      title: item.title || "",
      caption: item.caption || "",
      is_active: Boolean(item.is_active),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const move = async (index, direction) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= items.length) return;

    const next = [...items];
    [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
    const payload = next.map((item, idx) => ({ id: item.id, order_number: idx + 1 }));

    try {
      setItems(next.map((item, idx) => ({ ...item, order_number: idx + 1 })));
      await reorderInstagramContents(payload);
      await fetchData();
    } catch (err) {
      alert(err.message);
      fetchData();
    }
  };

  return (
    <div className="min-h-dvh bg-gray-50 p-4">
      <SubPageHeader title="Instagram Content" subtitle="Kelola preview Instagram di homepage customer" />

      <div className="space-y-4">
        <section className="rounded-xl border bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-gray-800">{editingId ? "Edit Konten" : "Tambah Konten"}</h2>
            {editingId && (
              <button onClick={resetForm} className="flex items-center gap-1 text-xs font-medium text-blue-600">
                <X className="h-3 w-3" />
                Batal
              </button>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <input
                value={form.instagram_url}
                onChange={(e) => setForm({ ...form, instagram_url: e.target.value })}
                placeholder="https://www.instagram.com/reel/xxxxx"
                className="w-full rounded-xl border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
              />
              <p className={`mt-1 px-1 text-xs ${isValidUrl ? "text-gray-500" : "text-red-500"}`}>
                Masukkan link post atau reel Instagram
              </p>
            </div>

            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Judul"
              className="w-full rounded-xl border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
            />

            <textarea
              value={form.caption}
              onChange={(e) => setForm({ ...form, caption: e.target.value })}
              placeholder="Caption singkat"
              rows={3}
              className="w-full rounded-xl border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-200"
            />

            <label className="block rounded-xl border border-dashed bg-white p-3 text-sm text-gray-600">
              <span className="font-medium">Thumbnail</span>
              <span className="mt-1 block text-xs text-gray-400">jpg, jpeg, png, webp. Maksimal 5MB.</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setForm({ ...form, thumbnail: e.target.files?.[0] || null })}
                className="mt-3 w-full text-xs"
              />
            </label>

            <label className="flex items-center justify-between rounded-xl border bg-white px-3 py-2 text-sm">
              <span className="font-medium text-gray-700">Aktif</span>
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                className="h-4 w-4 accent-pink-600"
              />
            </label>

            <PreviewCard
              thumbnailUrl={previewUrl}
              postType={postType}
              title={form.title}
              caption={form.caption}
              isActive={form.is_active}
            />

            <button
              onClick={submit}
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-pink-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm disabled:opacity-60"
            >
              <Save className="h-4 w-4" />
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </section>

        <section className="space-y-3">
          {loading ? (
            <LoadingState variant="list" rows={4} />
          ) : items.length === 0 ? (
            <div className="rounded-xl border bg-white p-5 text-center text-sm text-gray-400">Belum ada konten Instagram</div>
          ) : (
            items.map((item, index) => (
              <div key={item.id} className="rounded-xl border bg-white p-3 shadow-sm">
                <div className="flex gap-3">
                  <PreviewCard
                    compact
                    thumbnailUrl={item.thumbnail_url}
                    postType={item.post_type}
                    title={item.title}
                    caption={item.caption}
                    isActive={item.is_active}
                  />
                  <div className="flex shrink-0 flex-col gap-1">
                    <button onClick={() => move(index, -1)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button onClick={() => move(index, 1)} className="rounded-lg p-2 text-gray-500 hover:bg-gray-100">
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button onClick={() => edit(item)} className="rounded-lg p-2 text-blue-600 hover:bg-blue-50">
                      <Pencil className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}

function PreviewCard({ thumbnailUrl, postType, title, caption, isActive, compact = false }) {
  return (
    <div className={`relative overflow-hidden rounded-xl bg-gray-200 ${compact ? "h-32 flex-1" : "h-44 w-full"}`}>
      {thumbnailUrl ? (
        <img src={thumbnailUrl} alt={title || "Instagram thumbnail"} className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs text-gray-400">
          Preview thumbnail
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
      <div className="absolute left-3 top-3 flex items-center gap-2">
        <span className="rounded-full bg-pink-600 px-2 py-0.5 text-[10px] font-bold text-white">
          {postType || "POST"}
        </span>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${isActive ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-700"}`}>
          {isActive ? "AKTIF" : "NONAKTIF"}
        </span>
      </div>
      <div className="absolute bottom-3 left-3 right-3">
        <div className="mb-1 flex items-center gap-1 text-white/90">
          <Instagram className="h-3 w-3" />
          <span className="text-[10px] font-medium">Instagram</span>
        </div>
        <p className="line-clamp-1 text-sm font-bold text-white drop-shadow">{title || "Judul konten"}</p>
        <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-white/80">{caption || "Caption singkat konten"}</p>
      </div>
    </div>
  );
}
