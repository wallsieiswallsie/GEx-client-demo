import React from "react";
import { ArrowRight, Users } from "lucide-react";
import { DEMO_ROLES } from "./demoUsers";

export default function DemoRolePicker({ onSelectRole }) {
  return (
    <main className="min-h-dvh bg-slate-100 px-4 py-6 text-slate-950">
      <section className="mx-auto flex min-h-[calc(100dvh-3rem)] max-w-5xl flex-col justify-center">
        <div className="mb-5">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-black text-[#4d148c] shadow-sm">
            <Users className="h-4 w-4" />
            Pilih role demo
          </div>
          <h1 className="text-3xl font-black tracking-normal sm:text-4xl">
            Mau melihat GEx dari sisi siapa?
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Setiap role memakai data demo dan akses yang berbeda, sehingga recruiter
            atau investor bisa memahami alur end-to-end tanpa login manual.
          </p>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {DEMO_ROLES.map((role) => (
            <button
              key={role.key}
              type="button"
              onClick={() => onSelectRole(role.key)}
              className="group min-h-[116px] rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#4d148c] hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-base font-black text-slate-950">{role.label}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{role.description}</p>
                </div>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 text-[#4d148c] transition group-hover:bg-[#4d148c] group-hover:text-white">
                  <ArrowRight className="h-5 w-5" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
