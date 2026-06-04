import React from "react";
import { useNavigate } from "react-router-dom";
import DemoFloatingPanel from "./DemoFloatingPanel";
import DemoIntroPage from "./DemoIntroPage";
import DemoRolePicker from "./DemoRolePicker";
import DemoViewportSwitcher from "./DemoViewportSwitcher";
import { useDemo } from "./useDemo";
import { getDemoRoleConfig } from "./demoUsers";

export default function DemoExperience({ children }) {
  const {
    isDemoMode,
    hasStarted,
    selectedRole,
    selectedViewport,
    isDeviceMobile,
    renderViewport,
    startDemo,
    selectRole,
    selectViewport,
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

  if (!isDeviceMobile && !selectedViewport) {
    return <DemoViewportSwitcher onSelectViewport={selectViewport} />;
  }

  if (renderViewport === "mobile" && !isDeviceMobile) {
    return (
      <div className="gex-demo-mobile-shell min-h-dvh overflow-hidden bg-slate-950 px-3 py-4">
        <div className="mx-auto h-[calc(100dvh-2rem)] w-full max-w-[420px] overflow-hidden rounded-[28px] border-[10px] border-slate-800 bg-white shadow-2xl">
          <div className="gex-demo-mobile-frame h-full overflow-hidden">
            {children}
          </div>
        </div>
        <DemoFloatingPanel onRoleChange={goToRole} />
      </div>
    );
  }

  return (
    <div className="min-h-dvh">
      {children}
      <DemoFloatingPanel onRoleChange={goToRole} />
    </div>
  );
}
