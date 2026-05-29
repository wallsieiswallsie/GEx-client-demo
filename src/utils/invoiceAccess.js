import { isGeneralManagerRole } from "./roleAccess";

export function canAccessInvoice(user, role) {
  if (isGeneralManagerRole(role)) {
    return true;
  }

  if (!["branch_staff", "branch_manager"].includes(role)) {
    return false;
  }

  return user?.is_origin === false;
}
