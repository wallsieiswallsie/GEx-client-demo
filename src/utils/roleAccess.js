export const INTERNAL_ROLES = [
  "branch_staff",
  "branch_manager",
  "general_manager",
  "super_admin",
];

export const CUSTOMER_ROLES = ["customer"];

export function hasAllowedRole(role, allowedRoles = []) {
  if (!allowedRoles.length) return true;
  return allowedRoles.includes(role);
}

export function isGeneralManagerRole(role) {
  return ["general_manager", "super_admin"].includes(role);
}
