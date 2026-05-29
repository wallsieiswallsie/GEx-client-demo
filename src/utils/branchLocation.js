export const formatWhatsAppNumber = (phoneNumber) => {
  const digits = String(phoneNumber || "").replace(/\D/g, "");
  if (!digits) return "";

  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  if (digits.startsWith("8")) return `62${digits}`;
  if (digits.startsWith("62")) return digits;

  return digits;
};

export const buildWhatsAppLink = (phoneNumber, branchName = "Gerai GEx") => {
  const formattedNumber = formatWhatsAppNumber(phoneNumber);
  if (!formattedNumber) return "";

  const message = `Halo admin GEx, saya ingin bertanya tentang lokasi gerai ${branchName}.`;
  return `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`;
};

const toCoordinate = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

export const calculateDistanceKm = (userLat, userLng, branchLat, branchLng) => {
  const lat1 = toCoordinate(userLat);
  const lng1 = toCoordinate(userLng);
  const lat2 = toCoordinate(branchLat);
  const lng2 = toCoordinate(branchLng);

  if ([lat1, lng1, lat2, lng2].some((value) => value === null)) return null;

  const earthRadiusKm = 6371;
  const toRadians = (degree) => (degree * Math.PI) / 180;
  const deltaLat = toRadians(lat2 - lat1);
  const deltaLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(deltaLng / 2) *
      Math.sin(deltaLng / 2);

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const sortBranchesByDistance = (branches, userLocation) => {
  if (!userLocation) return [];

  return (branches || [])
    .map((branch) => ({
      ...branch,
      distanceKm: calculateDistanceKm(
        userLocation.latitude,
        userLocation.longitude,
        branch.latitude,
        branch.longitude
      ),
    }))
    .filter((branch) => branch.distanceKm !== null)
    .sort((a, b) => a.distanceKm - b.distanceKm);
};

export const formatDistanceFromUser = (distanceKm) => {
  if (distanceKm === null || distanceKm === undefined || !Number.isFinite(Number(distanceKm))) {
    return "";
  }

  const normalizedDistance = Number(distanceKm);
  if (normalizedDistance < 1) {
    return `${Math.round(normalizedDistance * 1000)} m dari lokasi Anda`;
  }

  return `${normalizedDistance.toFixed(1).replace(".", ",")} km dari lokasi Anda`;
};
