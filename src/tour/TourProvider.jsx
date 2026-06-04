import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HelpCircle, Map, RotateCcw, UserRound } from "lucide-react";
import { useAuth } from "../context/useAuth";
import { useDemo } from "../demo/useDemo";
import { TourContext } from "./TourContext";
import { getTourSteps, TOUR_PROGRESS_KEY, TOUR_SEEN_KEY } from "./tourSteps";

function readProgress() {
  try {
    return JSON.parse(sessionStorage.getItem(TOUR_PROGRESS_KEY) || "{}");
  } catch {
    return {};
  }
}

function getElementRect(selector) {
  const element = selector ? document.querySelector(selector) : null;
  if (!element) return null;
  return element.getBoundingClientRect();
}

export function TourProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { role, user } = useAuth();
  const { selectedRole, demoUser, isDemoMode } = useDemo();
  const roleKey = selectedRole || role || demoUser?.role || user?.role || "customer";
  const steps = useMemo(() => getTourSteps(selectedRole, role), [selectedRole, role]);
  const [isActive, setIsActive] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const [helpOpen, setHelpOpen] = useState(false);

  const currentStep = steps[currentIndex] || null;

  const persistProgress = useCallback((active, index) => {
    sessionStorage.setItem(
      TOUR_PROGRESS_KEY,
      JSON.stringify({ active, index, roleKey })
    );
  }, [roleKey]);

  const finishTour = useCallback(() => {
    localStorage.setItem(TOUR_SEEN_KEY, "true");
    sessionStorage.removeItem(TOUR_PROGRESS_KEY);
    setIsActive(false);
    setShowWelcome(false);
    setCurrentIndex(0);
  }, []);

  const startTour = useCallback((index = 0) => {
    const nextIndex = Math.min(Math.max(index, 0), steps.length - 1);
    setHelpOpen(false);
    setShowWelcome(false);
    setCurrentIndex(nextIndex);
    setIsActive(true);
    persistProgress(true, nextIndex);
    const targetPath = steps[nextIndex]?.path;
    if (targetPath && location.pathname !== targetPath) {
      navigate(targetPath);
    }
  }, [location.pathname, navigate, persistProgress, steps]);

  const restartTour = useCallback(() => {
    sessionStorage.removeItem(TOUR_PROGRESS_KEY);
    startTour(0);
  }, [startTour]);

  const nextStep = useCallback(() => {
    if (currentIndex >= steps.length - 1) {
      finishTour();
      return;
    }
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    persistProgress(true, nextIndex);
    const targetPath = steps[nextIndex]?.path;
    if (targetPath && location.pathname !== targetPath) {
      navigate(targetPath);
    }
  }, [currentIndex, finishTour, location.pathname, navigate, persistProgress, steps]);

  const previousStep = useCallback(() => {
    const nextIndex = Math.max(0, currentIndex - 1);
    setCurrentIndex(nextIndex);
    persistProgress(true, nextIndex);
    const targetPath = steps[nextIndex]?.path;
    if (targetPath && location.pathname !== targetPath) {
      navigate(targetPath);
    }
  }, [currentIndex, location.pathname, navigate, persistProgress, steps]);

  useEffect(() => {
    const progress = readProgress();
    if (progress.active && progress.roleKey === roleKey) {
      setCurrentIndex(Number(progress.index) || 0);
      setIsActive(true);
      return;
    }

    const hasSeen = localStorage.getItem(TOUR_SEEN_KEY) === "true";
    const readyForTour = !isDemoMode || Boolean(selectedRole);
    if (!hasSeen && readyForTour) {
      const timer = window.setTimeout(() => setShowWelcome(true), 500);
      return () => window.clearTimeout(timer);
    }

    return undefined;
  }, [isDemoMode, roleKey, selectedRole]);

  useEffect(() => {
    if (!isActive || !currentStep) return;

    const syncRect = () => {
      const rect = getElementRect(currentStep.target);
      setTargetRect(rect);
      const element = currentStep.target ? document.querySelector(currentStep.target) : null;
      element?.scrollIntoView({ block: "center", inline: "center", behavior: "smooth" });
    };

    syncRect();
    const timer = window.setTimeout(syncRect, 350);
    window.addEventListener("resize", syncRect);
    window.addEventListener("scroll", syncRect, true);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", syncRect);
      window.removeEventListener("scroll", syncRect, true);
    };
  }, [currentStep, isActive, location.pathname]);

  useEffect(() => {
    if (!isActive || !currentStep?.target) return undefined;
    const element = document.querySelector(currentStep.target);
    if (!element) return undefined;
    element.classList.add("gex-tour-highlight");
    return () => element.classList.remove("gex-tour-highlight");
  }, [currentStep, isActive, targetRect]);

  useEffect(() => {
    if (!isActive || !currentStep) return;
    if (currentStep.waitForPath && location.pathname === currentStep.waitForPath) {
      const timer = window.setTimeout(nextStep, 300);
      return () => window.clearTimeout(timer);
    }
    if (currentStep.waitForTarget && document.querySelector(currentStep.waitForTarget)) {
      const timer = window.setTimeout(nextStep, 300);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [currentStep, isActive, location.pathname, nextStep]);

  const value = useMemo(() => ({
    isActive,
    currentStep,
    currentIndex,
    totalSteps: steps.length,
    startTour,
    restartTour,
    nextStep,
    previousStep,
    skipTour: finishTour,
    finishTour,
  }), [currentIndex, currentStep, finishTour, isActive, nextStep, previousStep, restartTour, startTour, steps.length]);

  return (
    <TourContext.Provider value={value}>
      {children}
      <FloatingHelpPanel
        isOpen={helpOpen}
        onToggle={() => setHelpOpen((open) => !open)}
        onStart={restartTour}
        onFlow={() => {
          setHelpOpen(false);
          navigate("/bagaimana-gex-bekerja");
        }}
        roleLabel={getRoleLabel(roleKey, user)}
      />
      {showWelcome && (
        <WelcomeModal
          onStart={() => startTour(0)}
          onSkip={finishTour}
        />
      )}
      {isActive && currentStep && (
        <TourOverlay
          step={currentStep}
          rect={targetRect}
          index={currentIndex}
          total={steps.length}
          onNext={nextStep}
          onPrevious={previousStep}
          onSkip={finishTour}
        />
      )}
    </TourContext.Provider>
  );
}

function WelcomeModal({ onStart, onSkip }) {
  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center bg-slate-950/60 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl">
        <h2 className="text-xl font-black text-slate-950">Selamat Datang di GEx Demo</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          GEx Demo membantu Anda memahami alur pengiriman dari customer, gudang asal,
          batch pengiriman, gudang tujuan, sampai paket selesai.
        </p>
        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={onStart}
            className="flex-1 rounded-xl bg-[#4d148c] px-4 py-3 text-sm font-bold text-white shadow-lg shadow-violet-900/20"
          >
            Mulai Panduan
          </button>
          <button
            type="button"
            onClick={onSkip}
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600"
          >
            Lewati
          </button>
        </div>
      </div>
    </div>
  );
}

function TourOverlay({ step, rect, index, total, onNext, onPrevious, onSkip }) {
  const box = rect
    ? {
      top: Math.max(12, rect.bottom + 14),
      left: Math.min(Math.max(16, rect.left), window.innerWidth - 336),
    }
    : { top: Math.max(96, window.innerHeight / 2 - 120), left: Math.max(16, window.innerWidth / 2 - 160) };

  const shouldFlip = box.top > window.innerHeight - 230 && rect;
  const tooltipTop = shouldFlip ? Math.max(16, rect.top - 210) : box.top;

  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-[1000] bg-slate-950/58" />
      {rect && (
        <div
          className="pointer-events-none fixed z-[1002] rounded-[18px] border-2 border-white shadow-[0_0_0_9999px_rgba(2,6,23,0.58),0_0_0_6px_rgba(124,58,237,0.35)]"
          style={{
            top: rect.top - 8,
            left: rect.left - 8,
            width: rect.width + 16,
            height: rect.height + 16,
          }}
        />
      )}
      <div
        className="fixed z-[1100] w-[calc(100vw-2rem)] max-w-[320px] rounded-2xl bg-white p-4 shadow-2xl"
        style={{ top: tooltipTop, left: box.left }}
      >
        <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-[#4d148c] transition-all"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
        <p className="text-xs font-black uppercase tracking-normal text-[#4d148c]">
          Langkah {index + 1} dari {total}
        </p>
        <h3 className="mt-1 text-base font-black text-slate-950">{step.title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">{step.content}</p>
        <div className="mt-4 grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={onPrevious}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 disabled:opacity-40"
            disabled={index === 0}
          >
            Sebelumnya
          </button>
          <button
            type="button"
            onClick={onNext}
            className="rounded-xl bg-[#4d148c] px-3 py-2 text-xs font-bold text-white"
          >
            {index === total - 1 ? "Selesai" : "Berikutnya"}
          </button>
          <button
            type="button"
            onClick={onSkip}
            className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600"
          >
            Lewati
          </button>
        </div>
      </div>
    </>
  );
}

function FloatingHelpPanel({ isOpen, onToggle, onStart, onFlow, roleLabel }) {
  return (
    <div className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-[max(1rem,calc((100vw-430px)/2+1rem))] z-[950]">
      {isOpen && (
        <div className="mb-3 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl">
          <button
            type="button"
            onClick={onStart}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            <RotateCcw className="h-4 w-4 text-[#4d148c]" />
            Mulai/Ulangi Panduan
          </button>
          <button
            type="button"
            onClick={onFlow}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            <Map className="h-4 w-4 text-[#4d148c]" />
            Lihat Alur Bisnis GEx
          </button>
          <div className="flex items-start gap-3 rounded-xl px-3 py-3 text-sm text-slate-600">
            <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-[#4d148c]" />
            <div>
              <p className="font-bold text-slate-800">Tentang Role Saat Ini</p>
              <p className="mt-1 text-xs leading-5">{roleLabel}</p>
            </div>
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={onToggle}
        aria-label="Bantuan aplikasi"
        title="Bantuan aplikasi"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#4d148c] shadow-xl ring-1 ring-slate-200 transition active:scale-95"
      >
        <HelpCircle className="h-6 w-6" />
      </button>
    </div>
  );
}

function getRoleLabel(roleKey, user) {
  const labels = {
    customer: "Customer dapat cek ongkir, lacak paket, mendaftarkan paket, dan melihat jadwal serta gerai.",
    general_manager: "General Manager memantau operasional lintas cabang, batch, invoice, dan nilai pengiriman.",
    branch_manager: "Branch Manager mengawasi paket, batch, pengiriman, dan laporan untuk cabang terkait.",
    branch_staff_origin: "Staff gudang asal menginput paket, packing, membuat batch, dan menangani paket gagal X-Ray.",
    branch_staff_destination: "Staff gudang tujuan menerima batch, validasi paket, dan menyiapkan pengambilan atau pengantaran.",
  };
  return labels[roleKey] || `Role aktif: ${user?.role || roleKey || "customer"}.`;
}
