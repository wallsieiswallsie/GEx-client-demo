import React, { useState } from "react";
import {
  BookOpen,
  ChevronDown,
  Monitor,
  RotateCcw,
  Smartphone,
  Users,
  X,
} from "lucide-react";
import { DEMO_GUIDE } from "./demoGuide";
import { DEMO_ROLES, getDemoRoleConfig } from "./demoUsers";
import { useDemo } from "./useDemo";

export default function DemoFloatingPanel({ onRoleChange }) {
  const {
    selectedRole,
    renderViewport,
    isDeviceMobile,
    selectViewport,
    resetIntro,
  } = useDemo();
  const [isOpen, setIsOpen] = useState(false);
  const roleConfig = getDemoRoleConfig(selectedRole);
  const guide = DEMO_GUIDE[selectedRole] || [];

  return (
    <>
      <div className="fixed right-3 top-3 z-[80] flex items-center gap-2">
        <span className="rounded-full border border-white/70 bg-[#4d148c] px-3 py-1 text-xs font-black text-white shadow-lg">
          Demo Mode
        </span>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-xs font-black text-slate-800 shadow-lg transition hover:bg-slate-50"
        >
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline">{roleConfig.label}</span>
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[90] bg-slate-950/35" onClick={() => setIsOpen(false)}>
          <aside
            className="absolute bottom-0 left-0 right-0 max-h-[86dvh] overflow-y-auto rounded-t-2xl bg-white p-4 shadow-2xl md:bottom-auto md:left-auto md:right-4 md:top-16 md:w-[360px] md:rounded-lg"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-black text-slate-950">Demo Control</h2>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Ganti role, viewport, atau buka ulang intro.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200"
                aria-label="Tutup panel demo"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 space-y-2">
              {DEMO_ROLES.map((role) => (
                <button
                  key={role.key}
                  type="button"
                  onClick={() => {
                    onRoleChange(role.key);
                    setIsOpen(false);
                  }}
                  className={`w-full rounded-lg border p-3 text-left transition ${
                    selectedRole === role.key
                      ? "border-[#4d148c] bg-[#4d148c]/10 text-[#4d148c]"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="text-sm font-black">{role.label}</div>
                  <div className="mt-1 text-xs leading-5 text-slate-500">{role.description}</div>
                </button>
              ))}
            </div>

            {!isDeviceMobile && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                <ViewportButton
                  active={renderViewport === "desktop"}
                  icon={Monitor}
                  label="Desktop"
                  onClick={() => selectViewport("desktop")}
                />
                <ViewportButton
                  active={renderViewport === "mobile"}
                  icon={Smartphone}
                  label="Mobile"
                  onClick={() => selectViewport("mobile")}
                />
              </div>
            )}

            <div className="mt-5 rounded-lg bg-slate-100 p-3">
              <div className="flex items-center gap-2 text-sm font-black text-slate-950">
                <BookOpen className="h-4 w-4" />
                Panduan Alur Demo
              </div>
              <ul className="mt-2 space-y-2 text-xs leading-5 text-slate-600">
                {guide.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#4d148c]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={() => {
                resetIntro();
                setIsOpen(false);
              }}
              className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-sm font-black text-slate-700 hover:bg-slate-50"
            >
              <RotateCcw className="h-4 w-4" />
              Buka Intro Lagi
            </button>
          </aside>
        </div>
      )}
    </>
  );
}

function ViewportButton({ active, icon, label, onClick }) {
  const ViewportIcon = icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg text-xs font-black ${
        active
          ? "bg-[#4d148c] text-white"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      }`}
    >
      <ViewportIcon className="h-4 w-4" />
      {label}
    </button>
  );
}
