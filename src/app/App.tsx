import { useState, useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import { Flower2, X, Trash2 } from "lucide-react";

type FlowerId =
  | "rosa" | "margarida" | "tulipa" | "girassol" | "lavanda" | "papoula"
  | "gardenia" | "cravo" | "orquidea" | "folhagem" | "eucalipto" | "samambaia";

type VaseId =
  | "classic" | "tall" | "wide" | "vintage"
  | "glass" | "stripegreen" | "striperose" | "amber";

interface PlacedFlower {
  uid: string;
  flowerId: FlowerId;
  offsetX: number;
  offsetY: number;
  lean: number;
  stemLen: number;
}

interface DragState {
  uid: string;
  startPX: number;
  startPY: number;
  startOX: number;
  startOY: number;
  hasMoved: boolean;
}

const CW = 520, CH = 620, MCX = 260, MY = 370;

const VASES: { id: VaseId; name: string; mouthHW: number; mouthOffset: number }[] = [
  { id: "classic",     name: "Clássico",      mouthHW: 44, mouthOffset: 14 },
  { id: "tall",        name: "Esguio",         mouthHW: 28, mouthOffset: 15 },
  { id: "wide",        name: "Bojudo",         mouthHW: 62, mouthOffset: 16 },
  { id: "vintage",     name: "Vintage",        mouthHW: 22, mouthOffset: 15 },
  { id: "glass",       name: "Cristal",        mouthHW: 44, mouthOffset: 14 },
  { id: "stripegreen", name: "Verde Listrado", mouthHW: 62, mouthOffset: 16 },
  { id: "striperose",  name: "Rosa Listrado",  mouthHW: 22, mouthOffset: 15 },
  { id: "amber",       name: "Âmbar",          mouthHW: 28, mouthOffset: 15 },
];

const FLOWERS: { id: FlowerId; name: string; desc: string }[] = [
  { id: "rosa",      name: "Rosa",      desc: "delicada"   },
  { id: "margarida", name: "Margarida", desc: "alegre"     },
  { id: "tulipa",    name: "Tulipa",    desc: "elegante"   },
  { id: "girassol",  name: "Girassol",  desc: "radiante"   },
  { id: "lavanda",   name: "Lavanda",   desc: "aromática"  },
  { id: "papoula",   name: "Papoula",   desc: "vibrante"   },
  { id: "gardenia",  name: "Gardênia",  desc: "perfumada"  },
  { id: "cravo",     name: "Cravo",     desc: "apaixonado" },
  { id: "orquidea",  name: "Orquídea",  desc: "exótica"    },
  { id: "folhagem",  name: "Folhagem",  desc: "natural"    },
  { id: "eucalipto", name: "Eucalipto", desc: "fresco"     },
  { id: "samambaia", name: "Samambaia", desc: "silvestre"  },
];

let uidN = 0;
const mkuid = () => `f${++uidN}`;
const rnd = (a: number, b: number) => a + Math.random() * (b - a);

function GlobalDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute", overflow: "hidden" }}>
      <defs>
        <filter id="sk" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05 0.075" numOctaves={4} seed={7} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={4} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="sk2" x="-15%" y="-15%" width="130%" height="130%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03 0.05" numOctaves={3} seed={13} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={2.5} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="sk3" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.025 0.04" numOctaves={3} seed={2} result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={1.8} xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <pattern id="vase-stripe-g" patternUnits="userSpaceOnUse" width="16" height="400">
          <rect width="8" height="400" fill="#c4dcc0" />
          <rect x="8" width="8" height="400" fill="#f0ece0" />
        </pattern>
        <pattern id="vase-stripe-r" patternUnits="userSpaceOnUse" width="16" height="400">
          <rect width="8" height="400" fill="#f0c8d0" />
          <rect x="8" width="8" height="400" fill="#f5f0ea" />
        </pattern>
      </defs>
    </svg>
  );
}

function RosaHead() {
  return (
    <g filter="url(#sk)">
      {[0, 60, 120, 180, 240, 300].map(a => (
        <g key={a} transform={`rotate(${a})`}>
          <path d="M 0 3 C -10 -7 -13 -24 0 -29 C 13 -24 10 -7 0 3Z" fill="#e8849a" stroke="#c04565" strokeWidth="1.4" />
        </g>
      ))}
      {[30, 90, 150, 210, 270, 330].map(a => (
        <g key={a} transform={`rotate(${a})`}>
          <path d="M 0 2 C -6 -6 -7 -17 0 -19 C 7 -17 6 -6 0 2Z" fill="#cc607a" stroke="#b03055" strokeWidth="0.9" />
        </g>
      ))}
      <circle cx="0" cy="0" r="5.5" fill="#a03050" />
      <circle cx="0" cy="-1" r="3" fill="#701028" />
    </g>
  );
}

function MargaridaHead() {
  return (
    <g filter="url(#sk)">
      {Array.from({ length: 14 }, (_, i) => (
        <g key={i} transform={`rotate(${i * (360 / 14)})`}>
          <ellipse cx="0" cy="-21" rx="4.5" ry="12" fill="#f8f4e2" stroke="#c8b870" strokeWidth="1" />
        </g>
      ))}
      <circle cx="0" cy="0" r="10" fill="#f0c030" stroke="#c89020" strokeWidth="1.4" />
      <circle cx="-2" cy="-2" r="6.5" fill="#d8a020" opacity="0.5" />
    </g>
  );
}

function TulipaHead() {
  return (
    <g filter="url(#sk)">
      <path d="M -4 15 C -20 4 -24 -20 -13 -38 C -6 -47 -2 -24 -4 15Z" fill="#b870c8" stroke="#8840a0" strokeWidth="1.4" />
      <path d="M 4 15 C 20 4 24 -20 13 -38 C 6 -47 2 -24 4 15Z" fill="#b870c8" stroke="#8840a0" strokeWidth="1.4" />
      <path d="M -2 17 C -16 8 -18 -22 0 -46 C 18 -22 16 8 2 17Z" fill="#d090d8" stroke="#8840a0" strokeWidth="1.4" />
      <path d="M 0 -42 C -11 -34 -13 -20 0 -14 C 13 -20 11 -34 0 -42Z" fill="#9050a8" opacity="0.4" />
      <ellipse cx="0" cy="13" rx="10" ry="5.5" fill="#8040a0" stroke="#6030a0" strokeWidth="1" />
    </g>
  );
}

function GirassolHead() {
  return (
    <g filter="url(#sk)">
      {Array.from({ length: 16 }, (_, i) => (
        <g key={i} transform={`rotate(${i * 22.5})`}>
          <ellipse cx="0" cy="-28" rx="6" ry="14" fill="#f4c040" stroke="#c88820" strokeWidth="1" />
        </g>
      ))}
      {Array.from({ length: 16 }, (_, i) => (
        <g key={`b${i}`} transform={`rotate(${i * 22.5 + 11.25})`}>
          <ellipse cx="0" cy="-23" rx="4.5" ry="10" fill="#e8b030" opacity="0.7" />
        </g>
      ))}
      <circle cx="0" cy="0" r="14.5" fill="#5a2e10" stroke="#3a1808" strokeWidth="1.6" />
      {[-5, 0, 5].flatMap(dx => [-5, 0, 5].map(dy => (
        <circle key={`${dx}_${dy}`} cx={dx} cy={dy} r="2" fill="#3a2010" opacity="0.55" />
      )))}
    </g>
  );
}

function LavandaHead() {
  const ys = [-38, -30, -22, -14, -6, 2];
  return (
    <g filter="url(#sk)">
      <line x1="0" y1="0" x2="0" y2="-44" stroke="#9870c0" strokeWidth="2" strokeLinecap="round" />
      {ys.map((y, i) => {
        const off = i % 2 === 0 ? 2 : -2;
        return (
          <g key={i}>
            <ellipse cx="-6" cy={y + off} rx="4.5" ry="6.5" fill="#c8a8e0" stroke="#9070b8" strokeWidth="1" transform={`rotate(-22, -6, ${y + off})`} />
            <ellipse cx="6" cy={y - off} rx="4.5" ry="6.5" fill="#c8a8e0" stroke="#9070b8" strokeWidth="1" transform={`rotate(22, 6, ${y - off})`} />
          </g>
        );
      })}
    </g>
  );
}

function PapoulaHead() {
  return (
    <g filter="url(#sk)">
      {[0, 90, 180, 270].map(a => (
        <g key={a} transform={`rotate(${a})`}>
          <path d="M 0 3 C -16 -5 -22 -24 -9 -34 C -3 -38 2 -20 0 3Z" fill="#e07060" stroke="#b03030" strokeWidth="1.4" />
        </g>
      ))}
      {[45, 135, 225, 315].map(a => (
        <g key={a} transform={`rotate(${a})`}>
          <path d="M 0 3 C -11 -3 -15 -19 -6 -27 C -1 -29 2 -15 0 3Z" fill="#cc5848" stroke="#a02828" strokeWidth="1" opacity="0.8" />
        </g>
      ))}
      <circle cx="0" cy="0" r="9" fill="#1e2e08" stroke="#0e1a04" strokeWidth="1.4" />
      <circle cx="0" cy="0" r="6" fill="#2e4010" opacity="0.7" />
    </g>
  );
}

function GardeniaHead() {
  return (
    <g filter="url(#sk)">
      {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
        <g key={a} transform={`rotate(${a})`}>
          <path d="M 0 2 C -10 -8 -11 -24 0 -27 C 11 -24 10 -8 0 2Z" fill="#f8f5e8" stroke="#d4c880" strokeWidth="1" />
        </g>
      ))}
      {[22, 67, 112, 157, 202, 247, 292, 337].map(a => (
        <g key={a} transform={`rotate(${a})`}>
          <path d="M 0 1 C -6 -6 -7 -17 0 -19 C 7 -17 6 -6 0 1Z" fill="#f5f0e0" stroke="#c8c080" strokeWidth="0.9" />
        </g>
      ))}
      {[0, 60, 120, 180, 240, 300].map(a => (
        <g key={a} transform={`rotate(${a})`}>
          <path d="M 0 1 C -4 -4 -5 -11 0 -13 C 5 -11 4 -4 0 1Z" fill="#fffef8" stroke="#d0c870" strokeWidth="0.8" />
        </g>
      ))}
      <circle cx="0" cy="0" r="4" fill="#f0e890" />
      <circle cx="0" cy="0" r="2" fill="#d8d060" />
    </g>
  );
}

function CravoHead() {
  const p = "M 0 3 C -9 -3 -13 -18 -5 -28 C -1 -32 1 -32 5 -28 C 13 -18 9 -3 0 3Z";
  return (
    <g filter="url(#sk)">
      {[0, 22, 45, 67, 90, 112, 135, 157, 180, 202, 225, 247, 270, 292, 315, 337].map(a => (
        <g key={a} transform={`rotate(${a})`}>
          <path d={p} fill="#e87890" stroke="#c04060" strokeWidth="0.9" />
        </g>
      ))}
      {[11, 33, 56, 78, 101, 123, 146, 168, 191, 213, 236, 258].map(a => (
        <g key={a} transform={`rotate(${a}) scale(0.65)`}>
          <path d={p} fill="#f090a8" stroke="#c85070" strokeWidth="0.8" />
        </g>
      ))}
      <circle cx="0" cy="0" r="5" fill="#c84068" />
    </g>
  );
}

function OrquidHead() {
  return (
    <g filter="url(#sk)">
      <path d="M 0 -2 C -8 -10 -8 -26 0 -32 C 8 -26 8 -10 0 -2Z" fill="#d880d8" stroke="#a040a0" strokeWidth="1.2" />
      <path d="M -2 0 C -8 -6 -24 -8 -30 -2 C -26 6 -10 8 -2 0Z" fill="#d880d8" stroke="#a040a0" strokeWidth="1.2" />
      <path d="M 2 0 C 8 -6 24 -8 30 -2 C 26 6 10 8 2 0Z" fill="#d880d8" stroke="#a040a0" strokeWidth="1.2" />
      <path d="M -2 -2 C -12 2 -16 14 -8 22 C -2 26 2 18 -2 -2Z" fill="#e898e8" stroke="#a040a0" strokeWidth="1" />
      <path d="M 2 -2 C 12 2 16 14 8 22 C 2 26 -2 18 2 -2Z" fill="#e898e8" stroke="#a040a0" strokeWidth="1" />
      <path d="M -7 2 C -10 10 -6 22 0 26 C 6 22 10 10 7 2 C 3 6 -3 6 -7 2Z" fill="#f8d0f8" stroke="#a040a0" strokeWidth="1.2" />
      <ellipse cx="0" cy="10" rx="3" ry="2.5" fill="#c050b8" />
    </g>
  );
}

function FolhagemHead() {
  return (
    <g filter="url(#sk2)">
      <path d="M 0 0 C -12 -16 -10 -38 0 -44 C 10 -38 12 -16 0 0Z" fill="#5a8048" stroke="#3a6030" strokeWidth="1.2" />
      <path d="M -2 -8 C -16 -18 -22 -32 -12 -38 C -5 -38 0 -24 -2 -8Z" fill="#6a9058" stroke="#4a7038" strokeWidth="1" />
      <path d="M 2 -12 C 16 -22 22 -36 12 -42 C 5 -42 0 -28 2 -12Z" fill="#6a9058" stroke="#4a7038" strokeWidth="1" />
      <path d="M -3 -20 C -14 -26 -16 -36 -8 -38 C -2 -36 0 -28 -3 -20Z" fill="#78a068" stroke="#4a7038" strokeWidth="0.8" />
    </g>
  );
}

function EucalyptoHead() {
  return (
    <g filter="url(#sk2)">
      <path d="M 0 0 Q -3 -24 0 -50" stroke="#7a9878" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {[[-12, -8], [13, -16], [-11, -26], [12, -36], [-9, -46]].map(([cx, cy], i) => (
        <ellipse key={i} cx={cx} cy={cy} rx="11" ry="7" fill="#90b888" stroke="#608060" strokeWidth="1"
          transform={`rotate(${cx < 0 ? -25 : 25}, ${cx}, ${cy})`} />
      ))}
    </g>
  );
}

function SamambaiaHead() {
  const left = [[-8, -8], [-14, -16], [-16, -24], [-14, -32], [-10, -40]];
  const right = [[8, -12], [14, -20], [14, -28], [12, -36]];
  return (
    <g filter="url(#sk2)">
      <path d="M 0 0 Q -6 -26 0 -50" stroke="#5a7848" strokeWidth="2" fill="none" strokeLinecap="round" />
      {left.map(([cx, cy], i) => (
        <path key={`l${i}`} d={`M 0 ${cy + 4} Q ${cx - 2} ${cy - 6} ${cx} ${cy}`}
          stroke="#6a8a58" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      ))}
      {right.map(([cx, cy], i) => (
        <path key={`r${i}`} d={`M 0 ${cy + 4} Q ${cx + 2} ${cy - 6} ${cx} ${cy}`}
          stroke="#6a8a58" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      ))}
    </g>
  );
}

function FlowerHead({ id }: { id: FlowerId }) {
  switch (id) {
    case "rosa":      return <RosaHead />;
    case "margarida": return <MargaridaHead />;
    case "tulipa":    return <TulipaHead />;
    case "girassol":  return <GirassolHead />;
    case "lavanda":   return <LavandaHead />;
    case "papoula":   return <PapoulaHead />;
    case "gardenia":  return <GardeniaHead />;
    case "cravo":     return <CravoHead />;
    case "orquidea":  return <OrquidHead />;
    case "folhagem":  return <FolhagemHead />;
    case "eucalipto": return <EucalyptoHead />;
    case "samambaia": return <SamambaiaHead />;
  }
}

function Stem({ len }: { len: number }) {
  const mid = -len * 0.42;
  const c = len * 0.06;
  return (
    <g filter="url(#sk3)">
      <path d={`M 0 0 Q ${-c} ${-len * 0.5} 0 ${-len}`} stroke="#5a7848" strokeWidth="2.8" fill="none" strokeLinecap="round" />
      <path d={`M 0 ${mid} Q -24 ${mid - 22} -15 ${mid - 8}`} fill="#6a9058" stroke="#4a6838" strokeWidth="1" />
      <path d={`M 0 ${mid - 20} Q 20 ${mid - 34} 14 ${mid - 21}`} fill="#6a9058" stroke="#4a6838" strokeWidth="1" />
    </g>
  );
}

function ClassicPaths() {
  return (
    <g>
      <path d="M 56 14 C 42 38, 18 80, 18 130 C 18 190, 44 230, 62 245 L 138 245 C 156 230, 182 190, 182 130 C 182 80, 158 38, 144 14 Q 120 6, 100 5 Q 80 6, 56 14 Z" fill="#c87040" stroke="#a05030" strokeWidth="2.2" filter="url(#sk3)" />
      <path d="M 52 14 Q 100 5, 148 14 Q 146 26, 100 28 Q 54 26, 52 14 Z" fill="#b06030" stroke="#904020" strokeWidth="1.6" filter="url(#sk)" />
      <ellipse cx="100" cy="14" rx="44" ry="10" fill="#7a3818" opacity="0.35" />
      <path d="M 35 88 Q 28 138, 34 180" stroke="#e0a070" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.45" filter="url(#sk3)" />
      <ellipse cx="100" cy="246" rx="62" ry="6" fill="#5a2810" opacity="0.2" />
    </g>
  );
}

function TallPaths() {
  return (
    <g>
      <path d="M 72 15 C 64 40, 54 80, 54 140 C 54 200, 66 232, 72 248 L 128 248 C 134 232, 146 200, 146 140 C 146 80, 136 40, 128 15 Q 114 8, 100 7 Q 86 8, 72 15 Z" fill="#a0b8c8" stroke="#6080a0" strokeWidth="2.2" filter="url(#sk3)" />
      <path d="M 68 15 Q 100 8, 132 15 Q 130 25, 100 27 Q 70 25, 68 15 Z" fill="#8090b8" stroke="#6070a0" strokeWidth="1.6" filter="url(#sk)" />
      <ellipse cx="100" cy="15" rx="28" ry="7" fill="#3a5070" opacity="0.3" />
      <path d="M 64 82 Q 57 130, 62 168" stroke="#c0d4e0" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.5" filter="url(#sk3)" />
      <ellipse cx="100" cy="249" rx="44" ry="5" fill="#304060" opacity="0.2" />
    </g>
  );
}

function WidePaths() {
  return (
    <g>
      <path d="M 38 16 C 22 38, 8 78, 8 118 C 8 178, 34 220, 52 242 L 148 242 C 166 220, 192 178, 192 118 C 192 78, 178 38, 162 16 Q 134 6, 100 5 Q 66 6, 38 16 Z" fill="#d4b870" stroke="#a08840" strokeWidth="2.2" filter="url(#sk3)" />
      <path d="M 34 16 Q 100 5, 166 16 Q 164 28, 100 30 Q 36 28, 34 16 Z" fill="#c0a050" stroke="#a08030" strokeWidth="1.6" filter="url(#sk)" />
      <ellipse cx="100" cy="16" rx="62" ry="12" fill="#706020" opacity="0.3" />
      <path d="M 22 82 Q 15 128, 20 168" stroke="#e8d090" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.45" filter="url(#sk3)" />
      <ellipse cx="100" cy="243" rx="78" ry="7" fill="#504010" opacity="0.2" />
    </g>
  );
}

function VintagePaths() {
  return (
    <g>
      <path d="M 78 15 C 74 28, 68 50, 60 82 C 44 122, 34 162, 46 206 C 56 238, 80 248, 100 248 C 120 248, 144 238, 154 206 C 166 162, 156 122, 140 82 C 132 50, 126 28, 122 15 Q 112 8, 100 7 Q 88 8, 78 15 Z" fill="#809870" stroke="#507048" strokeWidth="2.2" filter="url(#sk3)" />
      <path d="M 76 15 Q 100 8, 124 15 Q 122 25, 100 27 Q 78 25, 76 15 Z" fill="#607858" stroke="#405838" strokeWidth="1.6" filter="url(#sk)" />
      <ellipse cx="100" cy="15" rx="22" ry="7" fill="#203818" opacity="0.3" />
      <path d="M 50 112 Q 42 152, 48 186" stroke="#a0b888" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.45" filter="url(#sk3)" />
      <ellipse cx="100" cy="249" rx="48" ry="6" fill="#182810" opacity="0.2" />
    </g>
  );
}

function GlassPaths() {
  return (
    <g>
      <path d="M 56 14 C 42 38, 18 80, 18 130 C 18 190, 44 230, 62 245 L 138 245 C 156 230, 182 190, 182 130 C 182 80, 158 38, 144 14 Q 120 6, 100 5 Q 80 6, 56 14 Z" fill="rgba(210,235,250,0.13)" stroke="rgba(160,205,235,0.72)" strokeWidth="2.2" filter="url(#sk3)" />
      <path d="M 52 14 Q 100 5, 148 14 Q 146 26, 100 28 Q 54 26, 52 14 Z" fill="rgba(200,225,242,0.28)" stroke="rgba(160,205,235,0.7)" strokeWidth="1.6" filter="url(#sk)" />
      <ellipse cx="100" cy="14" rx="44" ry="10" fill="rgba(100,160,210,0.18)" />
      <path d="M 35 88 Q 28 138, 34 180" stroke="rgba(255,255,255,0.82)" strokeWidth="6" strokeLinecap="round" fill="none" filter="url(#sk3)" />
      <path d="M 50 60 Q 47 90, 50 120" stroke="rgba(255,255,255,0.45)" strokeWidth="2.5" strokeLinecap="round" fill="none" filter="url(#sk3)" />
      <ellipse cx="100" cy="246" rx="62" ry="6" fill="rgba(100,160,210,0.1)" />
    </g>
  );
}

function StripeGreenPaths() {
  return (
    <g>
      <path d="M 38 16 C 22 38, 8 78, 8 118 C 8 178, 34 220, 52 242 L 148 242 C 166 220, 192 178, 192 118 C 192 78, 178 38, 162 16 Q 134 6, 100 5 Q 66 6, 38 16 Z" fill="url(#vase-stripe-g)" stroke="#78a870" strokeWidth="2.2" filter="url(#sk3)" />
      <path d="M 34 16 Q 100 5, 166 16 Q 164 28, 100 30 Q 36 28, 34 16 Z" fill="#a8c8a0" stroke="#78a870" strokeWidth="1.6" filter="url(#sk)" />
      <ellipse cx="100" cy="16" rx="62" ry="12" fill="#487048" opacity="0.28" />
      <path d="M 22 82 Q 15 128, 20 168" stroke="rgba(255,255,255,0.5)" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.4" filter="url(#sk3)" />
      <ellipse cx="100" cy="243" rx="78" ry="7" fill="#487048" opacity="0.18" />
    </g>
  );
}

function StripeRosePaths() {
  return (
    <g>
      <path d="M 78 15 C 74 28, 68 50, 60 82 C 44 122, 34 162, 46 206 C 56 238, 80 248, 100 248 C 120 248, 144 238, 154 206 C 166 162, 156 122, 140 82 C 132 50, 126 28, 122 15 Q 112 8, 100 7 Q 88 8, 78 15 Z" fill="url(#vase-stripe-r)" stroke="#c08898" strokeWidth="2.2" filter="url(#sk3)" />
      <path d="M 76 15 Q 100 8, 124 15 Q 122 25, 100 27 Q 78 25, 76 15 Z" fill="#d8a0b0" stroke="#c08898" strokeWidth="1.6" filter="url(#sk)" />
      <ellipse cx="100" cy="15" rx="22" ry="7" fill="#804858" opacity="0.28" />
      <path d="M 50 112 Q 42 152, 48 186" stroke="rgba(255,255,255,0.5)" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.4" filter="url(#sk3)" />
      <ellipse cx="100" cy="249" rx="48" ry="6" fill="#804858" opacity="0.18" />
    </g>
  );
}

function AmberPaths() {
  return (
    <g>
      <path d="M 72 15 C 64 40, 54 80, 54 140 C 54 200, 66 232, 72 248 L 128 248 C 134 232, 146 200, 146 140 C 146 80, 136 40, 128 15 Q 114 8, 100 7 Q 86 8, 72 15 Z" fill="rgba(215,145,42,0.24)" stroke="rgba(180,105,20,0.7)" strokeWidth="2.2" filter="url(#sk3)" />
      <path d="M 68 15 Q 100 8, 132 15 Q 130 25, 100 27 Q 70 25, 68 15 Z" fill="rgba(205,135,30,0.38)" stroke="rgba(175,100,18,0.72)" strokeWidth="1.6" filter="url(#sk)" />
      <ellipse cx="100" cy="15" rx="28" ry="7" fill="rgba(120,70,10,0.3)" />
      <path d="M 64 82 Q 57 130, 62 168" stroke="rgba(255,205,100,0.75)" strokeWidth="5" strokeLinecap="round" fill="none" filter="url(#sk3)" />
      <path d="M 76 58 Q 73 88, 76 115" stroke="rgba(255,222,140,0.4)" strokeWidth="2.5" strokeLinecap="round" fill="none" filter="url(#sk3)" />
      <ellipse cx="100" cy="249" rx="44" ry="5" fill="rgba(120,70,10,0.2)" />
    </g>
  );
}

function VasePaths({ id }: { id: VaseId }) {
  switch (id) {
    case "classic":     return <ClassicPaths />;
    case "tall":        return <TallPaths />;
    case "wide":        return <WidePaths />;
    case "vintage":     return <VintagePaths />;
    case "glass":       return <GlassPaths />;
    case "stripegreen": return <StripeGreenPaths />;
    case "striperose":  return <StripeRosePaths />;
    case "amber":       return <AmberPaths />;
  }
}

function ArrangementCanvas({
  placed, vaseId, onRemove, onMove,
}: {
  placed: PlacedFlower[];
  vaseId: VaseId;
  onRemove: (uid: string) => void;
  onMove: (uid: string, ox: number, oy: number) => void;
}) {
  const cfg = VASES.find(v => v.id === vaseId)!;
  const svgRef = useRef<SVGSVGElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const [draggingUid, setDraggingUid] = useState<string | null>(null);

  function getSvgPt(e: React.PointerEvent) {
    const svg = svgRef.current!;
    const r = svg.getBoundingClientRect();
    return {
      x: (e.clientX - r.left) * (CW / r.width),
      y: (e.clientY - r.top) * (CH / r.height),
    };
  }

  function onPointerDown(e: React.PointerEvent<SVGGElement>, pf: PlacedFlower) {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    const { x, y } = getSvgPt(e);
    dragRef.current = { uid: pf.uid, startPX: x, startPY: y, startOX: pf.offsetX, startOY: pf.offsetY, hasMoved: false };
    setDraggingUid(pf.uid);
  }

  function onPointerMove(e: React.PointerEvent<SVGGElement>, pf: PlacedFlower) {
    const d = dragRef.current;
    if (!d || d.uid !== pf.uid) return;
    const { x, y } = getSvgPt(e);
    const dx = x - d.startPX, dy = y - d.startPY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      d.hasMoved = true;
      onMove(pf.uid, d.startOX + dx, d.startOY + dy);
    }
  }

  function onPointerUp(e: React.PointerEvent<SVGGElement>, pf: PlacedFlower) {
    const d = dragRef.current;
    if (!d || d.uid !== pf.uid) return;
    if (!d.hasMoved) onRemove(pf.uid);
    dragRef.current = null;
    setDraggingUid(null);
  }

  return (
    <svg ref={svgRef} width={CW} height={CH} viewBox={`0 0 ${CW} ${CH}`} style={{ display: "block" }}>
      {placed.map(pf => (
        <g
          key={pf.uid}
          transform={`translate(${MCX + pf.offsetX}, ${MY + pf.offsetY}) rotate(${pf.lean})`}
          style={{ cursor: draggingUid === pf.uid ? "grabbing" : "grab" }}
          onPointerDown={e => onPointerDown(e, pf)}
          onPointerMove={e => onPointerMove(e, pf)}
          onPointerUp={e => onPointerUp(e, pf)}
        >
          <rect x="-18" y={-pf.stemLen - 35} width="36" height={pf.stemLen + 55} fill="transparent" />
          <Stem len={pf.stemLen} />
          <g transform={`translate(0, ${-pf.stemLen})`}>
            <FlowerHead id={pf.flowerId} />
          </g>
        </g>
      ))}
      <g transform={`translate(${MCX - 100}, ${MY - cfg.mouthOffset})`}>
        <VasePaths id={vaseId} />
      </g>
      {placed.length === 0 && (
        <text x={MCX} y={MY - 90} textAnchor="middle" fill="#a07850" fontSize="12"
          fontFamily="Lato, sans-serif" opacity="0.55" letterSpacing="0.8">
          ✦  abra o menu para montar seu arranjo  ✦
        </text>
      )}
    </svg>
  );
}

function FlowerPreview({ id }: { id: FlowerId }) {
  return (
    <svg viewBox="-30 -100 60 110" width="52" height="96" style={{ overflow: "visible" }}>
      <Stem len={46} />
      <g transform="translate(0, -46)">
        <FlowerHead id={id} />
      </g>
    </svg>
  );
}

function ShopModal({
  open, onOpenChange, selectedVase, onSelectVase, onAddFlower,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  selectedVase: VaseId;
  onSelectVase: (id: VaseId) => void;
  onAddFlower: (id: FlowerId) => void;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/15 backdrop-blur-[2px]" />
        <Dialog.Content
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-2xl shadow-2xl outline-none overflow-hidden"
          style={{ width: 560, maxHeight: "80vh", background: "#fdf5f0", display: "flex", flexDirection: "column" }}
          aria-describedby={undefined}
        >
          <Dialog.Title className="sr-only">Personalized Flower Jar</Dialog.Title>
          <Dialog.Close asChild>
            <button className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors text-muted-foreground z-10">
              <X size={16} />
            </button>
          </Dialog.Close>
          <Tabs.Root defaultValue="flores" className="flex flex-col flex-1 overflow-hidden">
            <Tabs.List className="flex gap-0 border-b border-border/30 px-6 pt-5 shrink-0">
              {[
                { value: "flores", label: "Flores" },
                { value: "jarros", label: "Jarros" },
              ].map(t => (
                <Tabs.Trigger
                  key={t.value}
                  value={t.value}
                  className="px-5 py-2.5 text-sm font-medium text-muted-foreground border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-foreground transition-colors -mb-px"
                  style={{ fontFamily: "'Lato', sans-serif" }}
                >
                  {t.label}
                </Tabs.Trigger>
              ))}
            </Tabs.List>
            <Tabs.Content value="flores" className="flex-1 overflow-y-auto p-5">
              <div className="grid grid-cols-4 gap-2.5">
                {FLOWERS.map(f => (
                  <button
                    key={f.id}
                    onClick={() => onAddFlower(f.id)}
                    className="flex flex-col items-center gap-1 pt-3 pb-2 px-2 rounded-xl border-2 border-transparent hover:border-accent hover:bg-accent/20 transition-all duration-150 cursor-pointer bg-white/40 group"
                  >
                    <div className="relative h-[96px] flex items-end justify-center">
                      <FlowerPreview id={f.id} />
                      <span className="absolute inset-0 flex items-center justify-center text-lg text-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none pb-6">+</span>
                    </div>
                    <span className="text-[11px] font-bold text-foreground">{f.name}</span>
                    <span className="text-[9px] text-muted-foreground italic">{f.desc}</span>
                  </button>
                ))}
              </div>
            </Tabs.Content>
            <Tabs.Content value="jarros" className="flex-1 overflow-y-auto p-5">
              <div className="grid grid-cols-4 gap-2.5">
                {VASES.map(v => (
                  <button
                    key={v.id}
                    onClick={() => onSelectVase(v.id)}
                    className={`flex flex-col items-center gap-2 pt-4 pb-3 px-2 rounded-xl border-2 transition-all duration-150 cursor-pointer ${
                      selectedVase === v.id
                        ? "border-primary/60 bg-primary/8"
                        : "border-transparent hover:border-border bg-white/40"
                    }`}
                  >
                    <svg viewBox="0 0 200 248" width="52" height="65" style={{ overflow: "visible" }}>
                      <VasePaths id={v.id} />
                    </svg>
                    <span className="text-[11px] font-medium text-foreground">{v.name}</span>
                  </button>
                ))}
              </div>
            </Tabs.Content>
          </Tabs.Root>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default function App() {
  const [selectedVase, setSelectedVase] = useState<VaseId>("classic");
  const [placed, setPlaced] = useState<PlacedFlower[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const vaseInfo = VASES.find(v => v.id === selectedVase)!;

  function addFlower(flowerId: FlowerId) {
    const hw = vaseInfo.mouthHW;
    setPlaced(prev => [
      ...prev,
      {
        uid: mkuid(),
        flowerId,
        offsetX: rnd(-hw * 0.82, hw * 0.82),
        offsetY: 0,
        lean: rnd(-26, 26),
        stemLen: rnd(210, 290),
      },
    ]);
  }

  function removeFlower(uid: string) {
    setPlaced(prev => prev.filter(f => f.uid !== uid));
  }

  function moveFlower(uid: string, ox: number, oy: number) {
    setPlaced(prev => prev.map(f => f.uid === uid ? { ...f, offsetX: ox, offsetY: oy } : f));
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#f5ede8", fontFamily: "'Lato', sans-serif" }}
    >
      <GlobalDefs />
      <div className="relative" style={{ width: CW, height: CH }}>
        <ArrangementCanvas
          placed={placed}
          vaseId={selectedVase}
          onRemove={removeFlower}
          onMove={moveFlower}
        />
        <div className="absolute flex flex-col gap-2.5" style={{ left: 400, top: 220 }}>
          <button
            onClick={() => setModalOpen(true)}
            className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
            style={{ background: "#b06030", color: "#fdf5f0" }}
            title="Abrir menu"
          >
            <Flower2 size={20} />
          </button>
          {placed.length > 0 && (
            <button
              onClick={() => setPlaced([])}
              className="w-12 h-12 rounded-full shadow-md flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
              style={{ background: "rgba(255,255,255,0.75)", color: "#8a6040", backdropFilter: "blur(4px)" }}
              title="Limpar arranjo"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>
      <ShopModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        selectedVase={selectedVase}
        onSelectVase={setSelectedVase}
        onAddFlower={addFlower}
      />
    </div>
  );
}
