import { useCallback } from "react";
import { useErrors } from "../context/ErrorsContext";
import { API_URL, ACCESS_TOKEN_KEY } from "./constants";

/** low-level fetch wrapper */
export const apiFetch = async (path, options = {}) => {
  const url = path.startsWith("http") ? path : `${API_URL}${path}`;
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(url, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || data.message || "Terjadi kesalahan");
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
};

/** endpoints (pure, tidak menulis localStorage) */
export const loginApi = async (payload) =>
  apiFetch("/auth/login", { method: "POST", body: JSON.stringify(payload) });

export const registerApi = async (payload) =>
  apiFetch("/auth/register", { method: "POST", body: JSON.stringify(payload) });

export const createPackageApi = async (formData) => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);

  const res = await fetch(`${API_URL}/packages`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      // Jangan set Content-Type manual (biarkan browser buat boundary)
    },
    body: formData,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || "Gagal menyimpan data paket");
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
};

export const fetchPackagesApi = async (query = {}) => {
  const params = new URLSearchParams(query).toString();
  return apiFetch(`/packages?${params}`);
};

export const updatePackageApi = async (payload) =>
  apiFetch("/packages/update", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

export const createInvoiceApi = async (payload) =>
  apiFetch("/invoices", { method: "POST", body: JSON.stringify(payload) });

export const fetchInvoicesApi = async () => apiFetch("/invoices");

export const fetchArchivedInvoicesApi = async () => {
  return apiFetch("/archived_invoices");
};

export const fetchInvoiceDetailApi = async (id) =>
  apiFetch(`/invoices/${id}`);

export const addPackagesByResiToInvoiceApi = async (invoiceId, resiList) =>
  apiFetch(`/invoices/${invoiceId}/packages`, {
    method: "POST",
    body: JSON.stringify({ resiList }),
  });

export const removePackageFromInvoiceApi = async (invoiceId, packageId) =>
  apiFetch(`/invoices/${invoiceId}/packages/${Number(packageId)}`, { method: "DELETE" });

export const archivePackagesByInvoicesApi = async ({ invoiceIds, paymentMethod }) => {
  return apiFetch("/invoices/archive-packages", {
    method: "POST",
    body: JSON.stringify({ invoiceIds, paymentMethod }),
  });
};

export const removeActivePackageApi = async (packageId) =>
  apiFetch(`/activePackages/${(packageId)}`, { method: "DELETE" });

export const fetchArchivePackagesApi = async ({
  filter = "",
  sortBy = "created_at",
  sortOrder = "desc",
  page = 1,
  limit = 50,
} = {}) => {
  const params = new URLSearchParams({
    filter,
    sortBy,
    sortOrder,
    page,
    limit,
  });

  return apiFetch(`/archive_packages?${params.toString()}`);
};

export const confirmPackageApi = async ({ resi, kode, nama }) =>
  apiFetch("/packages/confirm", {
    method: "POST",
    body: JSON.stringify({ resi, kode, nama }),
  });

export const fetchUnmovedConfirmedPackagesApi = async () =>
  apiFetch("/packages/confirm-unmoved");

export const markConfirmedPackageAsMovedApi = async (resi) =>
  apiFetch("/packages/confirm-moved", {
    method: "POST",
    body: JSON.stringify({ resi }),
  });

export const createBatchesKapalApi = async (payload) =>
  apiFetch("/batches/kapal", { method: "POST", body: JSON.stringify(payload) });

export const createBatchesPesawatApi = async (payload) =>
  apiFetch("/batches/pesawat", { method: "POST", body: JSON.stringify(payload) });

export const fetchBatchesKapalApi = async () => apiFetch("/batches/kapal");

export const fetchBatchesPesawatApi = async () => apiFetch("/batches/pesawat");

export const fetchBatchKapalDetailApi = async (batchId) =>
  apiFetch(`/batches/kapal/${batchId}`);

export const fetchBatchPesawatDetailApi = async (batchId) =>
  apiFetch(`/batches/pesawat/${batchId}`);

export const failPackageXrayApi = async (resi) =>
  apiFetch("/packages/failed_xray", {
    method: "POST",
    body: JSON.stringify({ resi }),
  });

export const fetchFailedXrayPackagesApi = async () =>
  apiFetch("/packages/failed_xray");  

export const addPackageToBatchKapalApi = async (batchId, resi) =>
  apiFetch(`/batches/kapal/${batchId}/packages`, { method: "POST", body: JSON.stringify({ resi }) });

export const addPackageToBatchPesawatApi = async (batchId, resi) =>
  apiFetch(`/batches/pesawat/${batchId}/packages`, { method: "POST", body: JSON.stringify({ resi }) });

export const addNoKarungToBatchKapalApi = async (batchId, noKarung) =>
  apiFetch(`/batches/kapal/${batchId}/karung`, { 
    method: "POST",
    body: JSON.stringify({ noKarung }),
  });
  
export const addPackageToKarungApi = async (batchId, resi, noKarung) =>
  apiFetch(`/batches/kapal/${batchId}/karung/add-package`, {
    method: "POST",
    body: JSON.stringify({ resi, noKarung }),
  }); 

export const getBatchWithKarungApi = async (batchId) =>
  apiFetch(`/batches/kapal/${batchId}/karung`, {
    method: "GET",
  });

export const getPackagesByKarungApi = async (batchId, noKarung, search = "") =>
  apiFetch(`/batches/kapal/${batchId}/karung/${noKarung}/packages?search=${search}`);

export const movePackageToKarungApi = async (batchId, resi, noKarungBaru) =>
  apiFetch(`/batches/kapal/${batchId}/karung/move-package`, {
    method: "POST",
    body: JSON.stringify({ resi, noKarungBaru }),
  });

/** PENGANTARAN API */

// Tambah invoice ke deliveries
export const createPengantaranApi = async (payload) =>
  apiFetch("/pengantaran", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const activePengantaranApi = async (resi) =>
  apiFetch("/pengantaran", {
    method: "PATCH",
    body: JSON.stringify({ resi }),
  });

export const archivePengantaranApi = async (resi) =>
  apiFetch("/pengantaran_archive", {
    method: "PATCH",
    body: JSON.stringify({ resi }),
  });

// Ambil semua invoice yang sudah masuk ke deliveries
export const fetchPengantaranApi = async () =>
  apiFetch("/pengantaran");

export const fetchActivePengantaranApi = async () =>
  apiFetch("/pengantaran_active");

export const fetchArchivePengantaranApi = async () =>
  apiFetch("/pengantaran_archive");

// Ambil detail invoice tertentu dari deliveries
export const fetchPengantaranDetailApi = async (id) =>
  apiFetch(`/pengantaran/${id}`);

/** STATUS API */
// Tambah atau update status paket (status wajib, batchId opsional)
// Tambah atau update status paket / batch
export const addPackageStatus = async (packageId, status, batchId) => {
  const payload = { status };

  // kalau status 3, pakai endpoint batch
  if (status === 3) {
    if (!batchId) {
      throw new Error("batchId wajib untuk status 3");
    }
    payload.batchId = batchId;
    return apiFetch(`/batches/${batchId}/status3`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  }

  else if (status === 4) {
    if (!batchId) {
      throw new Error("batchId wajib untuk status 4");
    }
    payload.batchId = batchId;
    return apiFetch(`/batches/${batchId}/status4`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  }

  // default: pakai endpoint package
  return apiFetch(`/packages/${packageId}/status`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
};

// Ambil status terakhir sebuah paket
export const fetchLatestPackageStatusApi = async (packageId) =>
  apiFetch(`/packages/${packageId}/status/latest`);

/** useApi hook: memetakan error ke ErrorsContext dan memoize request */
export const useApi = () => {
  const { setError } = useErrors();

  const request = useCallback(
    async (pathOrFetcher, options) => {
      try {
        if (typeof pathOrFetcher === "function") {
          return await pathOrFetcher();
        }
        return await apiFetch(pathOrFetcher, options);
      } catch (err) {
      const status = err.status || 500;

      // hanya kirim error global kalau status benar-benar 500 ke atas
      if (status >= 500) {
        setError(status, err.message || "Terjadi kesalahan");
      } else {
        console.warn(`API Warning (${status}):`, err.message);
      }

      throw err;
    }

    }, [setError]
  );

  return { request };
};

/** FINANCE API */

// Ambil total harga semua paket dalam batch berdasarkan kode
export const fetchFinanceTotalApi = async (batchId, kode) =>
  apiFetch(`/finance/${batchId}/${kode}/total`);

// Ambil total harga paket yang finished = true
export const fetchFinanceFinishedApi = async (batchId, kode) =>
  apiFetch(`/finance/${batchId}/${kode}/finished`);

// Ambil total harga paket yang finished = false
export const fetchFinanceUnfinishedApi = async (batchId, kode) =>
  apiFetch(`/finance/${batchId}/${kode}/unfinished`);

export const addPaymentMethodApi = async (payload) => {
  return apiFetch("/finance/payment_method", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
};

export const fetchFinanceFinishedGroupedApi = async (batchId, kode) =>
  apiFetch(`/finance/${batchId}/${kode}/finished/grouped`);


/** =================== SYARAT KETENTUAN =================== */
export const fetchSyaratKetentuanApi = () => apiFetch("/customer/syarat-ketentuan");
export const fetchSyaratKetentuanByIdApi = (id) => apiFetch(`/customer/syarat-ketentuan/${id}`);
export const createSyaratKetentuanApi = (payload) =>
  apiFetch("/customer/syarat-ketentuan", { method: "POST", body: JSON.stringify(payload) });
export const patchSyaratKetentuanApi = (id, payload) =>
  apiFetch(`/customer/syarat-ketentuan/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
export const deleteSyaratKetentuanApi = (id) =>
  apiFetch(`/customer/syarat-ketentuan/${id}`, { method: "DELETE" });

/** =================== JADWAL KIRIM =================== */
export const fetchJadwalKirimApi = () => apiFetch("/customer/jadwal-kirim");
export const fetchJadwalKirimByIdApi = (id) => apiFetch(`/customer/jadwal-kirim/${id}`);
export const createJadwalKirimApi = (payload) =>
  apiFetch("/customer/jadwal-kirim", { method: "POST", body: JSON.stringify(payload) });
export const patchJadwalKirimApi = (id, payload) =>
  apiFetch(`/customer/jadwal-kirim/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
export const deleteJadwalKirimApi = (id) =>
  apiFetch(`/customer/jadwal-kirim/${id}`, { method: "DELETE" });

/** =================== LOKASI KONTAK =================== */
export const fetchLokasiKontakApi = () => apiFetch("/customer/lokasi-kontak");
export const fetchLokasiKontakByIdApi = (id) => apiFetch(`/customer/lokasi-kontak/${id}`);
export const createLokasiKontakApi = (payload) =>
  apiFetch("/customer/lokasi-kontak", { method: "POST", body: JSON.stringify(payload) });
export const patchLokasiKontakApi = (id, payload) =>
  apiFetch(`/customer/lokasi-kontak/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
export const deleteLokasiKontakApi = (id) =>
  apiFetch(`/customer/lokasi-kontak/${id}`, { method: "DELETE" });

/** =================== CARA KIRIM =================== */
export const fetchCaraKirimApi = () => apiFetch("/customer/cara-kirim");
export const fetchCaraKirimByIdApi = (id) => apiFetch(`/customer/cara-kirim/${id}`);
export const createCaraKirimApi = (formData) => {
  const token = localStorage.getItem("ACCESS_TOKEN_KEY");
  return fetch(`${process.env.REACT_APP_API_URL}/customer/cara-kirim`, {
    method: "POST",
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: formData,
  }).then((res) => res.json());
};
export const patchCaraKirimApi = (id, formDataOrJson) => {
  const token = localStorage.getItem("ACCESS_TOKEN_KEY");
  const isFormData = formDataOrJson instanceof FormData;
  return fetch(`${process.env.REACT_APP_API_URL}/customer/cara-kirim/${id}`, {
    method: "PATCH",
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(isFormData ? {} : { "Content-Type": "application/json" }) },
    body: isFormData ? formDataOrJson : JSON.stringify(formDataOrJson),
  }).then((res) => res.json());
};
export const deleteCaraKirimApi = (id) => {
  const token = localStorage.getItem("ACCESS_TOKEN_KEY");
  return fetch(`${process.env.REACT_APP_API_URL}/customer/cara-kirim/${id}`, {
    method: "DELETE",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  }).then((res) => res.json());
};

/** =================== DAFTAR ONGKIR =================== */
export const fetchDaftarOngkirApi = () => apiFetch("/customer/daftar-ongkir");
export const fetchDaftarOngkirByIdApi = (id) => apiFetch(`/customer/daftar-ongkir/${id}`);
export const createDaftarOngkirApi = (payload) =>
  apiFetch("/customer/daftar-ongkir", { method: "POST", body: JSON.stringify(payload) });
export const patchDaftarOngkirApi = (id, payload) =>
  apiFetch(`/customer/daftar-ongkir/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
export const deleteDaftarOngkirApi = (id) =>
  apiFetch(`/customer/daftar-ongkir/${id}`, { method: "DELETE" });

/** =================== SERING DITANYAKAN =================== */
export const fetchSeringDitanyakanApi = () => apiFetch("/customer/sering-ditanyakan");
export const fetchSeringDitanyakanByIdApi = (id) => apiFetch(`/customer/sering-ditanyakan/${id}`);
export const createSeringDitanyakanApi = (payload) =>
  apiFetch("/customer/sering-ditanyakan", { method: "POST", body: JSON.stringify(payload) });
export const patchSeringDitanyakanApi = (id, payload) =>
  apiFetch(`/customer/sering-ditanyakan/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
export const deleteSeringDitanyakanApi = (id) =>
  apiFetch(`/customer/sering-ditanyakan/${id}`, { method: "DELETE" });
