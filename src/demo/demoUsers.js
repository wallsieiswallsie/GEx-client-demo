export const DEMO_MODE =
  String(import.meta.env.VITE_DEMO_MODE || "").toLowerCase() === "true";

export const DEMO_ACCESS_TOKEN = "gex-demo-access-token";

export const DEMO_ROLES = [
  {
    key: "customer",
    label: "Customer",
    description: "Cek ongkir, lacak paket, paketku, jadwal kapal, dan bantuan.",
    defaultPath: "/home",
  },
  {
    key: "general_manager",
    label: "General Manager",
    description: "Pantau performa semua cabang, batch, invoice, dan nilai pengiriman.",
    defaultPath: "/home",
  },
  {
    key: "branch_manager",
    label: "Branch Manager",
    description: "Awasi operasional cabang destination Remu dan arus invoice.",
    defaultPath: "/home",
  },
  {
    key: "branch_staff_origin",
    label: "Branch Staff - Origin Warehouse",
    description: "Input paket, packing, batch, karung, dan paket gagal X-Ray.",
    defaultPath: "/input",
  },
  {
    key: "branch_staff_destination",
    label: "Branch Staff - Destination Warehouse",
    description: "Kelola paket tiba kota tujuan, siap diambil, dan pengantaran.",
    defaultPath: "/home",
  },
];

export const DEMO_USERS = {
  customer: {
    id: 9001,
    name: "Demo Customer",
    username: "demo_customer",
    role: "customer",
    cabang: "Sorong",
    branch_code: "DEMO_SORONG",
  },
  general_manager: {
    id: 9002,
    name: "Demo General Manager",
    username: "demo_general_manager",
    role: "general_manager",
    cabang: "All Branch",
  },
  branch_manager: {
    id: 9003,
    name: "Demo Branch Manager",
    username: "demo_branch_manager",
    role: "branch_manager",
    cabang: "Remu",
    branch_code: "DEMO_REMU",
    is_origin: false,
  },
  branch_staff_origin: {
    id: 9004,
    name: "Demo Staff Origin",
    username: "demo_staff_origin",
    role: "branch_staff",
    cabang: "Bekasi",
    branch_code: "DEMO_BEKASI",
    is_origin: true,
  },
  branch_staff_destination: {
    id: 9005,
    name: "Demo Staff Destination",
    username: "demo_staff_destination",
    role: "branch_staff",
    cabang: "Remu",
    branch_code: "DEMO_REMU",
    is_origin: false,
  },
};

export function getDemoUser(roleKey) {
  return DEMO_USERS[roleKey] || null;
}

export function getDemoRoleConfig(roleKey) {
  return DEMO_ROLES.find((role) => role.key === roleKey) || DEMO_ROLES[0];
}
