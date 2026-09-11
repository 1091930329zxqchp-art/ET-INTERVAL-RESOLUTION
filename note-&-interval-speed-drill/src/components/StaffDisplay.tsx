import React from 'react';
import { NoteInfo } from '../types/music';

interface StaffDisplayProps {
  notes?: NoteInfo[];
  resolutionNotes?: NoteInfo[];
  showResolution?: boolean;
  degrees?: (number | string)[];
  resolutionDegrees?: (number | string)[];
  intervalLabel?: string;
  resolutionIntervalLabel?: string;
  activeNoteIndex?: number;
  clef?: 'treble' | 'bass';
  className?: string;
}

const NATURAL_LIST = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

function getNoteY(note: NoteInfo): { y: number; needsLedger: number[] } {
  const naturalIdx = NATURAL_LIST.indexOf(note.natural);
  const diatonicVal = note.octave * 7 + (naturalIdx >= 0 ? naturalIdx : 0);
  // Reference: B4 is Line 3 (y = 70), diatonicVal = 4*7 + 6 = 34
  const delta = (34 - diatonicVal) * 10;
  const y = 70 + delta;

  // Check ledger lines
  const ledgers: number[] = [];
  // Below staff: bottom line is y = 110 (E4). Ledger lines at y = 130 (C4), 150 (A3), etc.
  if (y >= 130) {
    for (let ly = 130; ly <= y + 5; ly += 20) {
      ledgers.push(ly);
    }
  }
  // Above staff: top line is y = 30 (F5). Ledger lines at y = 10 (A5), -10 (C6), etc.
  if (y <= 10) {
    for (let ly = 10; ly >= y - 5; ly -= 20) {
      ledgers.push(ly);
    }
  }

  return { y, needsLedger: ledgers };
}

export const StaffDisplay: React.FC<StaffDisplayProps> = ({
  notes = [],
  resolutionNotes = [],
  showResolution = false,
  degrees,
  resolutionDegrees,
  intervalLabel,
  resolutionIntervalLabel,
  activeNoteIndex,
  className = '',
}) => {
  // SVG viewBox setup
  // Staff lines at y = 30, 50, 70, 90, 110
  const staffWidth = showResolution ? 440 : 320;
  const staffHeight = 190;

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      <svg
        viewBox={`0 0 ${staffWidth} ${staffHeight}`}
        className="w-full max-w-[460px] h-auto drop-shadow-sm overflow-visible"
        aria-label="Musical Staff"
      >
        {/* Background manuscript parchment card inside SVG */}
        <rect
          x="4"
          y="4"
          width={staffWidth - 8}
          height={staffHeight - 8}
          rx="2"
          fill="#fdfaf3"
          stroke="#1a1a1a"
          strokeWidth="1"
        />

        {/* Staff Lines (5 lines, classical ink width) */}
        {[30, 50, 70, 90, 110].map((y, idx) => (
          <line
            key={`staff-line-${idx}`}
            x1="25"
            y1={y}
            x2={staffWidth - 25}
            y2={y}
            stroke="#1a1a1a"
            strokeWidth="0.75"
            strokeLinecap="square"
          />
        ))}

        {/* Start Bar Line */}
        <line x1="25" y1="30" x2="25" y2="110" stroke="#1a1a1a" strokeWidth="1.5" />

        {/* Treble Clef Symbol */}
        <text
          x="30"
          y="95"
          fontFamily="'Cormorant Garamond', serif"
          fontSize="68"
          fill="#1a1a1a"
          className="select-none pointer-events-none"
        >
          𝄞
        </text>

        {/* Measure Line / Divider between first interval and resolution */}
        {showResolution && (
          <>
            <line
              x1="220"
              y1="30"
              x2="220"
              y2="110"
              stroke="#1a1a1a"
              strokeWidth="1"
            />
            <line
              x1="225"
              y1="30"
              x2="225"
              y2="110"
              stroke="#1a1a1a"
              strokeWidth="2"
            />

            {/* Handwritten pen-red resolution arrow between measures */}
            <path
              d="M 195 70 L 210 70 M 205 66 L 210 70 L 205 74"
              stroke="#d44c4c"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          </>
        )}

        {/* First Set of Notes */}
        {notes.map((note, index) => {
          const { y, needsLedger } = getNoteY(note);
          let x = 140;
          if (notes.length === 2) {
            x = 135;
            if (index === 1 && Math.abs(notes[0].midi - notes[1].midi) <= 2) {
              x = 150;
            }
          }

          const isActive = activeNoteIndex === index;

          return (
            <g key={`note-1-${index}-${note.name}`}>
              {/* Ledger Lines */}
              {needsLedger.map((ly) => (
                <line
                  key={`ledger-1-${index}-${ly}`}
                  x1={x - 14}
                  y1={ly}
                  x2={x + 14}
                  y2={ly}
                  stroke="#1a1a1a"
                  strokeWidth="1"
                />
              ))}

              {/* Accidental (# or b) */}
              {note.accidental && (
                <text
                  x={x - 18}
                  y={y + 5}
                  fontSize="22"
                  fontFamily="'Cormorant Garamond', serif"
                  fontWeight="bold"
                  fill={isActive ? '#d44c4c' : '#1a1a1a'}
                  textAnchor="middle"
                >
                  {note.accidental === '#' ? '♯' : '♭'}
                </text>
              )}

              {/* Notehead (Classical whole note engraving style) */}
              <ellipse
                cx={x}
                cy={y}
                rx="8"
                ry="5.5"
                fill={isActive ? '#d44c4c' : '#1a1a1a'}
                stroke="#1a1a1a"
                strokeWidth="1.5"
                transform={`rotate(-20 ${x} ${y})`}
              />

              {/* Inner hole for manuscript whole note aesthetic */}
              <ellipse
                cx={x}
                cy={y}
                rx="4.5"
                ry="2.2"
                fill="#fdfaf3"
                transform={`rotate(-40 ${x} ${y})`}
              />

              {/* Note Name & Degree Tag below staff (Handwritten red annotation) */}
              <text
                x={x}
                y={150 + index * 16}
                fontSize="14"
                fontFamily="'Cormorant Garamond', serif"
                fontWeight="600"
                fill={isActive ? '#d44c4c' : '#1a1a1a'}
                textAnchor="middle"
              >
                {note.name}
                {degrees && degrees[index] !== undefined && (
                  <tspan fill="#d44c4c" fontFamily="'Gaegu', cursive" fontSize="16" fontWeight="bold">
                    {' '}(^{degrees[index]})
                  </tspan>
                )}
              </text>
            </g>
          );
        })}

        {/* Resolution Notes (ET Class 2 pairing) */}
        {showResolution &&
          resolutionNotes.map((note, index) => {
            const { y, needsLedger } = getNoteY(note);
            let x = 320;
            if (resolutionNotes.length === 2) {
              x = 315;
              if (index === 1 && Math.abs(resolutionNotes[0].midi - resolutionNotes[1].midi) <= 2) {
                x = 330;
              }
            }

            return (
              <g key={`note-res-${index}-${note.name}`}>
                {/* Ledger Lines */}
                {needsLedger.map((ly) => (
                  <line
                    key={`ledger-res-${index}-${ly}`}
                    x1={x - 14}
                    y1={ly}
                    x2={x + 14}
                    y2={ly}
                    stroke="#1a1a1a"
                    strokeWidth="1"
                  />
                ))}

                {/* Accidental */}
                {note.accidental && (
                  <text
                    x={x - 18}
                    y={y + 5}
                    fontSize="22"
                    fontFamily="'Cormorant Garamond', serif"
                    fontWeight="bold"
                    fill="#d44c4c"
                    textAnchor="middle"
                  >
                    {note.accidental === '#' ? '♯' : '♭'}
                  </text>
                )}

                {/* Notehead */}
                <ellipse
                  cx={x}
                  cy={y}
                  rx="8"
                  ry="5.5"
                  fill="#1a1a1a"
                  stroke="#d44c4c"
                  strokeWidth="1.5"
                  transform={`rotate(-20 ${x} ${y})`}
                />
                <ellipse
                  cx={x}
                  cy={y}
                  rx="4.5"
                  ry="2.2"
                  fill="#fdfaf3"
                  transform={`rotate(-40 ${x} ${y})`}
                />

                {/* Note Name & Degree below */}
                <text
                  x={x}
                  y={150 + index * 16}
                  fontSize="14"
                  fontFamily="'Cormorant Garamond', serif"
                  fontWeight="600"
                  fill="#1a1a1a"
                  textAnchor="middle"
                >
                  {note.name}
                  {resolutionDegrees && resolutionDegrees[index] !== undefined && (
                    <tspan fill="#d44c4c" fontFamily="'Gaegu', cursive" fontSize="16" fontWeight="bold">
                      {' '}(^{resolutionDegrees[index]})
                    </tspan>
                  )}
                </text>
              </g>
            );
          })}

        {/* Interval labels above staff (Cursive / Manuscript annotations) */}
        {intervalLabel && (
          <text
            x="135"
            y="20"
            fontSize="15"
            fontFamily="'Gaegu', cursive"
            fontWeight="bold"
            fill="#d44c4c"
            textAnchor="middle"
          >
            {intervalLabel}
          </text>
        )}

        {showResolution && resolutionIntervalLabel && (
          <text
            x="320"
            y="20"
            fontSize="15"
            fontFamily="'Gaegu', cursive"
            fontWeight="bold"
            fill="#d44c4c"
            textAnchor="middle"
          >
            {resolutionIntervalLabel}
          </text>
        )}
      </svg>
    </div>
  );
};
