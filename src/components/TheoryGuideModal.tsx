import React from 'react';
import { X, BookOpen, CheckCircle, Lightbulb, Split, Sparkles, Music } from 'lucide-react';

interface TheoryGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TheoryGuideModal: React.FC<TheoryGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div id="modal-theory-guide" className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-amber-900/50 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-amber-100">Guia de Teoria Harmônica para Cavaquinho</h3>
              <p className="text-xs text-slate-400">
                Regras de notação brasileira, omissões (Rootless) e equivalências enarmônicas.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-300 scrollbar-thin scrollbar-thumb-amber-800">
          
          {/* Section 1: Afinação */}
          <section className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-amber-200 flex items-center gap-2 text-base">
              <Sparkles className="w-4 h-4 text-amber-400" />
              1. Afinação Padrão do Cavaquinho
            </h4>
            <p className="text-slate-300 leading-relaxed">
              O cavaquinho possui 4 cordas com afinação padrão em quintas/terças:
            </p>
            <ul className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono font-bold text-amber-300 text-center py-2">
              <li className="p-2 rounded bg-slate-900 border border-slate-800">4ª Corda: Ré (D3)</li>
              <li className="p-2 rounded bg-slate-900 border border-slate-800">3ª Corda: Sol (G3)</li>
              <li className="p-2 rounded bg-slate-900 border border-slate-800">2ª Corda: Si (B3)</li>
              <li className="p-2 rounded bg-slate-900 border border-slate-800">1ª Corda: Ré (D4)</li>
            </ul>
          </section>

          {/* Section 2: Notação e Regra da Barra */}
          <section className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-amber-200 flex items-center gap-2 text-base">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              2. Notação Cifra Brasileira e Regra da Barra ( / )
            </h4>
            <ul className="space-y-1.5 list-disc pl-5 leading-relaxed text-slate-300">
              <li><strong>Acordes Maiores Naturais:</strong> Representados apenas pela letra (ex: <code className="text-amber-300 font-mono">C</code>, <code className="text-amber-300 font-mono font-bold">D</code>, <code className="text-amber-300 font-mono">E</code>).</li>
              <li><strong>Sétimas e Alterações:</strong> Notação padrão brasileira (<code className="text-amber-300 font-mono">C7M</code> para 7ª Maior, <code className="text-amber-300 font-mono">Em7/b5</code> para meio diminuto).</li>
              <li><strong>Regra Obrigatória da Barra (/):</strong> Quando um acorde possui tensões/extensões (como 9ª, 11ª, 13ª, b5, #9), a barra separa obrigatoriamente a tensão da cifra base. Exemplo: notas C, D#, A#, D são grafadas como <code className="text-amber-300 font-mono font-bold">Cm7/9</code>.</li>
            </ul>
          </section>

          {/* Section 3: Omissões (Rootless) */}
          <section className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-amber-200 flex items-center gap-2 text-base">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              3. Omissões Frequentes (Rootless e Sem 5ª)
            </h4>
            <p className="leading-relaxed">
              Como o cavaquinho possui apenas 4 cordas, acordes de 4 ou 5 notas (com 7ª, 9ª e 13ª) frequentemente omitirão a <strong>Fundamental (Tônica)</strong> e/o a <strong>5ª Justa</strong>.
            </p>
            <p className="text-amber-300 bg-amber-950/40 p-3 rounded-lg border border-amber-900/40 italic">
              Exemplo: As notas C, E e G podem representar simultaneamente <strong className="text-amber-200">C</strong> (completo), <strong className="text-amber-200">Am7</strong> (omitindo a tônica A) e <strong className="text-amber-200">Em5+</strong> (omitindo a 5ª B).
            </p>
          </section>

          {/* Section 4: Equivalências Harmônicas */}
          <section className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-amber-200 flex items-center gap-2 text-base">
              <Split className="w-4 h-4 text-indigo-400" />
              4. Regras Fundamentais de Equivalência
            </h4>
            <div className="space-y-2 text-xs leading-relaxed">
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <strong className="text-amber-300">Tensões Enarmônicas:</strong> 6 = 13; 4 = 11; b5 (5-) = #11 (11+); #5 (5+) = b13.
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <strong className="text-amber-300">Diminutos (°):</strong> Possuem equivalência total a cada 1,5 tom (3 semitones). Exemplo: <code className="text-amber-200 font-mono">C° = Eb° = Gb° = A°</code>.
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <strong className="text-amber-300">Meio Diminuto e Menor com 6ª:</strong> Um acorde <code className="text-amber-200 font-mono">m7/b5</code> equivale a um <code className="text-amber-200 font-mono">m6</code> formado 3 semitons (terça menor) acima (ex: <code className="text-amber-200 font-mono">Em7/b5 = Gm6</code>).
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <strong className="text-amber-300">Dominantes 7/b5 (Trítono):</strong> Acordes <code className="text-amber-200 font-mono">7/b5</code> separados por um trítono compartilham a mesma forma (ex: <code className="text-amber-200 font-mono">C7/b5 = F#7/b5</code>).
              </div>
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                <strong className="text-amber-300">Menor com 7ª e Maior com 6ª:</strong> Um acorde <code className="text-amber-200 font-mono">m7</code> equivale a um <code className="text-amber-200 font-mono">Maior com 6ª</code> a uma terça menor acima (ex: <code className="text-amber-200 font-mono">F#m7 = A6</code>).
              </div>
            </div>
          </section>

          {/* Section 5: Acordes com Nona Adicionada (add9) vs Dominante (7/9) */}
          <section className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-amber-200 flex items-center gap-2 text-base">
              <Music className="w-4 h-4 text-amber-400" />
              5. Diferença entre Nona Adicionada (add9) e Nona Dominante (7/9)
            </h4>
            <div className="space-y-2 text-xs leading-relaxed">
              <p className="text-slate-300">
                É comum haver confusão entre acordes com nona. A teoria musical e a prática do cavaquinho distinguem claramente:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                <div className="p-3 rounded bg-slate-900 border border-amber-900/40">
                  <div className="font-bold text-amber-300 text-sm mb-1 font-mono">C(9) ou Cadd9</div>
                  <div className="text-slate-400 text-[11px] mb-1 font-semibold">Tríade Maior + 9ª (Sem 7ª)</div>
                  <p className="text-slate-300 text-[11px]">
                    Notas: <strong className="text-amber-200">C (T), E (3M), G (5J), D (9ª)</strong>.<br />
                    Sonoridade aberta e límpida, sem a dissonância da 7ª menor.
                  </p>
                </div>
                <div className="p-3 rounded bg-slate-900 border border-amber-900/40">
                  <div className="font-bold text-amber-300 text-sm mb-1 font-mono">C7/9</div>
                  <div className="text-slate-400 text-[11px] mb-1 font-semibold">Tétrade Dominante + 9ª (Com 7ª Menor)</div>
                  <p className="text-slate-300 text-[11px]">
                    Notas: <strong className="text-amber-200">C (T), E (3M), Bb (7m), D (9ª)</strong>.<br />
                    Acorde dominante tenso clássico de preparação.
                  </p>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};
