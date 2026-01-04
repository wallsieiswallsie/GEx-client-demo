import { useEffect, useState } from "react";
import {
  fetchSyaratKetentuanApi,
  createSyaratKetentuanApi,
  patchSyaratKetentuanApi,
  deleteSyaratKetentuanApi,

  fetchJadwalKirimApi,
  createJadwalKirimApi,
  patchJadwalKirimApi,
  deleteJadwalKirimApi,

  fetchLokasiKontakApi,
  createLokasiKontakApi,
  patchLokasiKontakApi,
  deleteLokasiKontakApi,

  fetchCaraKirimApi,
  createCaraKirimApi,
  patchCaraKirimApi,
  deleteCaraKirimApi,

  fetchDaftarOngkirApi,
  createDaftarOngkirApi,
  patchDaftarOngkirApi,
  deleteDaftarOngkirApi,

  fetchSeringDitanyakanApi,
  createSeringDitanyakanApi,
  patchSeringDitanyakanApi,
  deleteSeringDitanyakanApi,
} from "../utils/api";

export function useCustomerApi(serviceName, initialQuery = {}) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(initialQuery.page || 1);
  const [limit, setLimit] = useState(initialQuery.limit || 50);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);

    try {
      let data;

      switch (serviceName) {
        case "syaratKetentuan":
          data = await fetchSyaratKetentuanApi();
          break;
        case "jadwalKirim":
          data = await fetchJadwalKirimApi();
          break;
        case "lokasiKontak":
          data = await fetchLokasiKontakApi();
          break;
        case "caraKirim":
          data = await fetchCaraKirimApi();
          break;
        case "daftarOngkir":
          data = await fetchDaftarOngkirApi();
          break;
        case "seringDitanyakan":
          data = await fetchSeringDitanyakanApi();
          break;
        default:
          throw new Error(`Service ${serviceName} tidak ditemukan`);
      }

      setItems(data?.data || data || []);
      setTotal(data?.total ?? (data?.data?.length ?? 0));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createItem = async (payloadOrFormData) => {
    setLoading(true);
    setError(null);

    try {
      let newItem;

      switch (serviceName) {
        case "syaratKetentuan":
          newItem = await createSyaratKetentuanApi(payloadOrFormData);
          break;
        case "jadwalKirim":
          newItem = await createJadwalKirimApi(payloadOrFormData);
          break;
        case "lokasiKontak":
          newItem = await createLokasiKontakApi(payloadOrFormData);
          break;
        case "caraKirim":
          newItem = await createCaraKirimApi(payloadOrFormData);
          break;
        case "daftarOngkir":
          newItem = await createDaftarOngkirApi(payloadOrFormData);
          break;
        case "seringDitanyakan":
          newItem = await createSeringDitanyakanApi(payloadOrFormData);
          break;
        default:
          throw new Error(`Service ${serviceName} tidak ditemukan`);
      }

      setItems((prev) => [...prev, newItem]);
      return newItem;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const patchItem = async (id, payloadOrFormData) => {
    setLoading(true);
    setError(null);

    try {
      let updated;

      switch (serviceName) {
        case "syaratKetentuan":
          updated = await patchSyaratKetentuanApi(id, payloadOrFormData);
          break;
        case "jadwalKirim":
          updated = await patchJadwalKirimApi(id, payloadOrFormData);
          break;
        case "lokasiKontak":
          updated = await patchLokasiKontakApi(id, payloadOrFormData);
          break;
        case "caraKirim":
          updated = await patchCaraKirimApi(id, payloadOrFormData);
          break;
        case "daftarOngkir":
          updated = await patchDaftarOngkirApi(id, payloadOrFormData);
          break;
        case "seringDitanyakan":
          updated = await patchSeringDitanyakanApi(id, payloadOrFormData);
          break;
        default:
          throw new Error(`Service ${serviceName} tidak ditemukan`);
      }

      setItems((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );

      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /** ✅ DELETE FUNCTION */
  const deleteItem = async (id) => {
    setLoading(true);
    setError(null);

    try {
      switch (serviceName) {
        case "syaratKetentuan":
          await deleteSyaratKetentuanApi(id);
          break;
        case "jadwalKirim":
          await deleteJadwalKirimApi(id);
          break;
        case "lokasiKontak":
          await deleteLokasiKontakApi(id);
          break;
        case "caraKirim":
          await deleteCaraKirimApi(id);
          break;
        case "daftarOngkir":
          await deleteDaftarOngkirApi(id);
          break;
        case "seringDitanyakan":
          await deleteSeringDitanyakanApi(id);
          break;
        default:
          throw new Error(`Service ${serviceName} tidak ditemukan`);
      }

      // Hapus dari state
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return {
    items,
    total,
    page,
    limit,
    loading,
    error,

    fetchItems,
    createItem,
    patchItem,
    deleteItem,

    setPage,
    setLimit,
  };
}