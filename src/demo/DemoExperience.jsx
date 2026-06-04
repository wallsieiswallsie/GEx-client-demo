import React from "react";
import { useNavigate } from "react-router-dom";
import DemoFloatingPanel from "./DemoFloatingPanel";
import DemoIntroPage from "./DemoIntroPage";
import DemoRolePicker from "./DemoRolePicker";
import { useDemo } from "./useDemo";
import { getDemoRoleConfig } from "./demoUsers";

export default function DemoExperience({ children }) {
  const {
    isDemoMode,
    hasStarted,
    selectedRole,
    startDemo,
    selectRole,
  } = useDemo();
  const navigate = useNavigate();

  if (!isDemoMode) {
    return children;
  }

  const goToRole = (roleKey) => {
    const roleConfig = getDemoRoleConfig(roleKey);
    selectRole(roleKey);
    navigate(roleConfig.defaultPath, { replace: true });
  };

  if (!hasStarted) {
    return <DemoIntroPage onStart={startDemo} />;
  }

  if (!selectedRole) {
    return <DemoRolePicker onSelectRole={goToRole} />;
  }

  return (
    <div className="min-h-dvh">
      {children}
      <DemoFloatingPanel onRoleChange={goToRole} />
    </div>
  );
}
