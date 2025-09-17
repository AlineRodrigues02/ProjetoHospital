import React from 'react'

export default function MedicalLanding() {
  return (
    <div className="min-h-screen bg-[#f6f7fb] text-slate-900">
      <header className="mx-auto max-w-6xl px-4 pt-4">
        <div className="flex items-center justify-between rounded-full bg-white/90 px-5 py-3 shadow-sm ring-1 ring-black/5">
          <div className="flex items-center gap-3">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-sm font-semibold tracking-tight">Centro Médico Atlântico</span>
            <span className="text-slate-300">|</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:text-slate-900">
            
            </button>
          
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-16 pt-6">
        <section
          className="relative mt-4 overflow-hidden rounded-3xl"
          style={{
            backgroundImage: "url('/hero-section.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <div className="absolute inset-0 bg-[#232D69]/70" />
          <div className="relative grid items-center justify-center px-10 py-14 text-center md:py-20">
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl">
              Assistência Médica
            </h1>
          </div>
        </section>

        <section className="mx-auto mt-10 max-w-3xl text-center">
          <p className="text-xl font-semibold text-slate-800">Nossos Médicos E Clínicas Receberam Mais</p>
          <p className="text-xl font-extrabold tracking-tight text-slate-900">De 5.000 Avaliações No Google!</p>
        </section>

        <section className="mt-10 grid grid-cols-12 gap-6">
          <article className="col-span-12 overflow-hidden rounded-3xl bg-[#EFD469] p-7 shadow-sm md:col-span-7">
            <div className="grid h-full grid-cols-12 gap-4">
              <div className="col-span-7 flex flex-col">
                <h3 className="text-2xl font-extrabold leading-snug text-[#1f2a44]">Nutrição E Saúde<br/> Mental.</h3>
                <p className="mt-3 max-w-[38ch] text-sm leading-relaxed text-[#1f2a44]/80">
                  Os alimentos que comemos fornecem os nutrientes que nosso corpo precisa para funcionar adequadamente.
                </p>
              </div>
              <div className="col-span-5 flex items-end justify-end">
                <GroceriesSVG className="h-44 w-44 text-[#1f2a44]" />
              </div>
            </div>
          </article>

          <article className="col-span-12 overflow-hidden rounded-3xl bg-[#2B3F8D] p-7 text-white shadow-sm md:col-span-5">
            <div className="flex h-full flex-col justify-between">
              <div>
                <h3 className="text-2xl font-extrabold leading-snug">Hábitos Saudáveis<br/> Para Um Coração<br/> Feliz</h3>
              </div>
              <GiftSVG className="ml-auto mt-6 h-16 w-16 opacity-80" />
            </div>
          </article>

          <div className="col-span-12 grid grid-cols-12 gap-6 md:col-span-5 md:col-start-8">
            <article className="col-span-6 rounded-3xl bg-[#CDEBE2] p-6 shadow-sm">
              <div className="flex items-end gap-3">
                <span className="text-4xl font-extrabold leading-none">09</span>
              </div>
              <p className="mt-2 text-xs tracking-wide text-slate-600">Anos de Experiência.</p>
              <LaptopSVG className="ml-auto mt-3 h-12 w-12 opacity-80" />
            </article>
            <article className="col-span-6 rounded-3xl bg-[#F0C8D0] p-6 shadow-sm">
              <div className="flex items-end gap-3">
                <span className="text-4xl font-extrabold leading-none">150k</span>
              </div>
              <p className="mt-2 text-xs tracking-wide text-slate-700">Clientes Satisfeitos.</p>
              <PhoneSVG className="ml-auto mt-3 h-12 w-12 opacity-80" />
            </article>
          </div>
        </section>
      </main>
    </div>
  )
}

function GroceriesSVG({ className = "" }) {
  return (
    <svg viewBox="0 0 220 220" className={className} fill="none">
      <rect x="40" y="120" width="140" height="70" rx="8" stroke="currentColor" strokeWidth="3" />
      <path d="M45 120l20-35h90l20 35" stroke="currentColor" strokeWidth="3" fill="none" />
      <path d="M85 115v-25m20 25v-30m20 30v-20m20 20v-26" stroke="currentColor" strokeWidth="3" />
      <circle cx="90" cy="75" r="8" stroke="currentColor" strokeWidth="3" />
    </svg>
  )
}

function GiftSVG({ className = "" }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor">
      <rect x="8" y="22" width="48" height="34" rx="6" strokeWidth="2" />
      <path d="M8 30h48M32 22v34" strokeWidth="2" />
      <path d="M22 18c0-4 6-6 10 0 4-6 10-4 10 0 0 4-4 6-10 6s-10-2-10-6z" strokeWidth="2" />
    </svg>
  )
}

function LaptopSVG({ className = "" }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor">
      <rect x="10" y="14" width="44" height="28" rx="3" strokeWidth="2" />
      <path d="M4 48h56" strokeWidth="2" />
    </svg>
  )
}

function PhoneSVG({ className = "" }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" stroke="currentColor">
      <rect x="22" y="6" width="20" height="52" rx="6" strokeWidth="2" />
      <circle cx="32" cy="52" r="2" />
    </svg>
  )
}
