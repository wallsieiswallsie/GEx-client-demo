export function canAccessFinance(user, role) {
  if (role === "general_manager") {
    return true;
  }

  if (!["branch_staff", "branch_manager"].includes(role)) {
    return false;
  }

  return user?.is_origin === false;
}
