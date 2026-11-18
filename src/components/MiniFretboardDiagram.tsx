import React from 'react';
import { GeneratedShape } from '../types';

interface MiniFretboardDiagramProps {
  shape: GeneratedShape;
}

export const MiniFretboardDiagram: React.FC<MiniFretboardDiagramProps> = ({ shape }) => {
  // frets: [string4, string3, string2, string1]
  const [f4, f3, f2, f1] = shape.frets;
  const frets = [f4, f3, f2, f1];

  // Determine fret window display
  const pressedFrets = frets.filter(f => f > 0);
  const minFret = pressedFrets.length > 0 ? Math.min(...pressedFrets) : 1;
  const maxFret = pressedFrets.length > 0 ? Math.max(...pressedFrets) : 4;

  // Window starts at startFret and displays 4 or 5 fret spaces
  let startFret = 1;
  if (maxFret > 4) {
    startFret = Math.max(1, minFret);
  }
  const displayFretCount = 4;
  const endFret = startFret + displayFretCount - 1;

  const isNutVisible = startFret === 1;

  // String labels left to right: String 4 (Ré), String 3 (Sol), String 2 (Si), String 1 (Ré)
  const stringNames = ['Ré', 'Sol', 'Si', 'Ré'];

  return (
    <div className="flex flex-col items-center bg-slate-950/80 p-3 rounded-lg border border-amber-900/30 w-full max-w-[220px]">
      {/* Position indicator if higher frets */}
      {!isNutVisible && (
        <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mb-1 self-start px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
          {startFret}ª Casa
        </div>
      )}

      {/* SVG Fretboard */}
      <svg
        viewBox="0 0 160 170"
        className="w-full h-auto max-h-[160px] drop-shadow"
      >
        {/* Nut (Traste 0) */}
        {isNutVisible ? (
          <rect x="25" y="24" width="110" height="6" fill="#f59e0b" rx="1" />
        ) : (
          <line x1="25" y1="30" x2="135" y2="30" stroke="#78350f" strokeWidth="2" strokeDasharray="3,2" />
        )}

        {/* Fretboard Wood Background */}
        <rect x="25" y="30" width="110" height="120" fill="#1e1b18" rx="2" stroke="#451a03" strokeWidth="1" />

        {/* Fret Lines (Horizontal) */}
        {[0, 1, 2, 3, 4].map(idx => {
          const y = 30 + idx * 30;
          return (
            <line
              key={`fret-${idx}`}
              x1="25"
              y1={y}
              x2="135"
              y2={y}
              stroke="#b45309"
              strokeWidth={idx === 0 && isNutVisible ? '3' : '1.5'}
              opacity={idx === 0 ? 0.9 : 0.6}
            />
          );
        })}

        {/* String Lines (Vertical) - 4 strings */}
        {[0, 1, 2, 3].map(sIdx => {
          const x = 35 + sIdx * 30;
          // String thickness: String 4 (left) thickest (2.5px), String 1 (right) thinnest (1px)
          const strokeWidth = 2.5 - sIdx * 0.4;
          return (
            <line
              key={`string-${sIdx}`}
              x1={x}
              y1="24"
              x2={x}
              y2="150"
              stroke="#e2e8f0"
              strokeWidth={strokeWidth}
              opacity="0.85"
            />
          );
        })}

        {/* Fretting Markers (Finger Dots & Open String Indicators) */}
        {frets.map((fretVal, sIdx) => {
          const x = 35 + sIdx * 30; // x-coordinate for string
          const noteDetail = shape.notesDetail[sIdx];

          if (fretVal === 0) {
            // Open string (fret 0) -> Circle above the nut
            return (
              <g key={`open-${sIdx}`}>
                <circle cx={x} cy="14" r="7" fill="none" stroke="#f59e0b" strokeWidth="2" />
                <text
                  x={x}
                  y="17"
                  textAnchor="middle"
                  fill="#fbbf24"
                  fontSize="8"
                  fontWeight="bold"
                  fontFamily="sans-serif"
                >
                  0
                </text>
              </g>
            );
          } else {
            // Pressed fret
            const fretPosInWindow = fretVal - startFret + 1;
            // Render inside window if valid
            if (fretPosInWindow >= 1 && fretPosInWindow <= displayFretCount) {
              const y = 30 + (fretPosInWindow - 0.5) * 30;
              const isRoot = noteDetail.intervalSemitones === 0;

              return (
                <g key={`pressed-${sIdx}`}>
                  {/* Finger Dot */}
                  <circle
                    cx={x}
                    cy={y}
                    r="10"
                    fill={isRoot ? '#d97706' : '#2563eb'}
                    stroke={isRoot ? '#fef3c7' : '#93c5fd'}
                    strokeWidth="1.5"
                    className="transition-transform duration-200"
                  />
                  {/* Role / Interval Abbreviation inside dot */}
                  <text
                    x={x}
                    y={y + 3.5}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="8.5"
                    fontWeight="extrabold"
                    fontFamily="sans-serif"
                  >
                    {noteDetail.abbreviation}
                  </text>
                </g>
              );
            }
          }
          return null;
        })}

        {/* String Name Footer Labels */}
        {stringNames.map((name, sIdx) => {
          const x = 35 + sIdx * 30;
          return (
            <text
              key={`str-label-${sIdx}`}
              x={x}
              y="164"
              textAnchor="middle"
              fill="#94a3b8"
              fontSize="9"
              fontWeight="600"
              fontFamily="sans-serif"
            >
              {name}
            </text>
          );
        })}
      </svg>
    </div>
  );
};
