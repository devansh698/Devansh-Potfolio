'use client';

import { useEffect, useMemo, useRef, useState, type MutableRefObject, type ReactNode } from 'react';
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { ContactShadows, RoundedBox, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import type { ThemeDef } from '@/components/providers/ThemeProvider';

export type DeskObject = 'monitor' | 'mug' | 'plant' | 'books';

type Palette = ThemeDef['palette'];

const CLAY = { desk: '#f5f2eb', wood: '#caa27a', dark: '#1b1b20', key: '#e6e0d4' };

interface Token {
  w: number;
  color: number;
}
interface Line {
  indent: number;
  tokens: Token[];
}

function makeLines(count: number): Line[] {
  // Deterministic pseudo-random so the "code" looks the same every visit.
  let seed = 7;
  const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  return Array.from({ length: count }, () => ({
    indent: Math.floor(rand() * 3),
    tokens: Array.from({ length: 1 + Math.floor(rand() * 4) }, () => ({ w: 18 + rand() * 70, color: Math.floor(rand() * 4) })),
  }));
}

const DIVE_LINES = ['$ whoami', 'devansh handa', 'software engineer', '', '$ cd ./about'];
const DIVE_CHARS = DIVE_LINES.reduce((n, l) => n + l.length, 0);

/** 0 → 1 across the part of the hero scroll where the camera flies into the monitor. */
export function diveAmount(progress: number): number {
  return THREE.MathUtils.smoothstep(progress, 0.12, 0.82);
}

/**
 * Monitor screen: types code line by line, tinted by the theme. During the scroll dive it
 * switches to a readable shell prompt, typed in step with scroll progress.
 */
function useCodeTexture(palette: Palette, progress: MutableRefObject<number>): THREE.CanvasTexture {
  const colorsRef = useRef<string[]>([]);
  useEffect(() => {
    colorsRef.current = [palette.accent, '#f3f1ec', palette.accent2, '#8a8896'];
  }, [palette]);

  const { texture, step } = useMemo(() => {
    const canvas = document.createElement('canvas');
    // Drawn at 2× so the screen stays crisp when the camera fills the viewport with it.
    canvas.width = 1024;
    canvas.height = 600;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.scale(2, 2);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    const lines = makeLines(64);
    const cursor = { line: 11, token: 0 };

    const render = () => {
      const colors = colorsRef.current.length ? colorsRef.current : ['#c8ff4d', '#f3f1ec', '#8f7dff', '#8a8896'];
      ctx.fillStyle = '#0f0f13';
      ctx.fillRect(0, 0, 512, 300);
      ctx.fillStyle = '#1b1b22';
      ctx.fillRect(0, 0, 512, 26);
      ['#ff5f57', '#febc2e', '#28c840'].forEach((c, i) => {
        ctx.fillStyle = c;
        ctx.beginPath();
        ctx.arc(16 + i * 16, 13, 4.5, 0, Math.PI * 2);
        ctx.fill();
      });
      const dive = diveAmount(progress.current);
      if (dive > 0.3) {
        let budget = Math.floor(THREE.MathUtils.clamp((dive - 0.3) / 0.6, 0, 1) * DIVE_CHARS);
        let caret = { x: 30, y: 52 };
        DIVE_LINES.forEach((line, i) => {
          if (budget < 0) return;
          const shown = line.slice(0, budget);
          budget -= line.length;
          ctx.font = i === 1 ? 'bold 34px monospace' : '20px monospace';
          ctx.fillStyle = line.startsWith('$') ? colors[0] : i === 1 ? '#f3f1ec' : colors[2];
          ctx.fillText(shown, 30, 70 + i * 44);
          caret = { x: 34 + ctx.measureText(shown).width, y: 52 + i * 44 };
          if (budget === 0) budget = -1;
        });
        if (Date.now() % 1000 < 550) {
          ctx.fillStyle = colors[0];
          ctx.fillRect(caret.x, caret.y, 12, 24);
        }
        tex.needsUpdate = true;
        return;
      }
      const start = Math.max(0, cursor.line - 11);
      for (let l = start; l <= cursor.line; l++) {
        const y = 40 + (l - start) * 20;
        ctx.fillStyle = '#34343d';
        ctx.fillRect(14, y, 12, 8);
        let x = 40 + lines[l].indent * 22;
        const tokens = l === cursor.line ? lines[l].tokens.slice(0, cursor.token) : lines[l].tokens;
        for (const t of tokens) {
          ctx.fillStyle = colors[t.color];
          ctx.fillRect(x, y, t.w, 8);
          x += t.w + 8;
        }
        if (l === cursor.line) {
          ctx.fillStyle = colors[0];
          ctx.fillRect(x, y - 3, 3, 14);
        }
      }
      tex.needsUpdate = true;
    };

    const advance = () => {
      cursor.token++;
      if (cursor.token > lines[cursor.line].tokens.length) {
        cursor.token = 0;
        cursor.line = (cursor.line + 1) % lines.length;
      }
      render();
    };
    return { texture: tex, step: advance };
  }, [progress]);

  const elapsed = useRef(0);
  useFrame((_, delta) => {
    elapsed.current += delta;
    if (elapsed.current > 0.11) {
      elapsed.current = 0;
      step();
    }
  });

  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}

type Reaction = 'hop' | 'grow' | 'spin';

interface InteractiveProps {
  name: DeskObject;
  position: [number, number, number];
  rotation?: [number, number, number];
  onHover: (name: DeskObject | null) => void;
  onActivate: (name: DeskObject) => void;
  children: ReactNode;
  /** Increments on each activation to trigger a reaction animation. */
  pulse: number;
  reaction: Reaction;
}

/** Hover lifts the object; clicking plays a small physical reaction. */
function Interactive({ name, position, rotation, onHover, onActivate, children, pulse, reaction }: InteractiveProps) {
  const ref = useRef<THREE.Group>(null);
  const [isHovered, setHovered] = useState(false);
  const kick = useRef(0);
  const lastPulse = useRef(pulse);
  const baseRotY = rotation?.[1] ?? 0;

  useFrame((_, delta) => {
    const g = ref.current;
    if (!g) return;
    if (pulse !== lastPulse.current) {
      lastPulse.current = pulse;
      kick.current = 1;
    }
    kick.current = Math.max(0, kick.current - delta * 1.6);
    const k = Math.sin(kick.current * Math.PI);
    const lift = isHovered ? 0.08 : 0;
    g.position.y = THREE.MathUtils.damp(g.position.y, position[1] + lift + (reaction !== 'grow' ? k * 0.35 : 0), 10, delta);
    if (reaction === 'spin') g.rotation.y = baseRotY + (kick.current > 0 ? (1 - kick.current) * Math.PI * 2 : 0);
    if (reaction === 'hop') g.rotation.z = k * 0.12;
    const growth = reaction === 'grow' ? 1 + Math.min(pulse, 5) * 0.1 + k * 0.15 : 1;
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, growth * (isHovered ? 1.06 : 1), 8, delta));
  });

  const over = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setHovered(true);
    onHover(name);
  };
  const out = () => {
    setHovered(false);
    onHover(null);
  };

  return (
    <group
      ref={ref}
      position={position}
      rotation={rotation}
      onPointerOver={over}
      onPointerOut={out}
      onClick={(e) => {
        e.stopPropagation();
        onActivate(name);
      }}
    >
      {children}
    </group>
  );
}

function Screen({ palette, progress }: { palette: Palette; progress: MutableRefObject<number> }) {
  const map = useCodeTexture(palette, progress);
  return (
    <mesh position={[0, 1.1, 0.062]}>
      <planeGeometry args={[2.16, 1.26]} />
      <meshBasicMaterial map={map} toneMapped={false} />
    </mesh>
  );
}

function Keyboard() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const keys = useMemo(() => {
    const out: [number, number][] = [];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 13; c++) out.push([-0.66 + c * 0.11, -0.16 + r * 0.105]);
    return out;
  }, []);

  useEffect(() => {
    const m = new THREE.Matrix4();
    keys.forEach(([x, z], i) => {
      m.setPosition(x, 0.06, z);
      ref.current?.setMatrixAt(i, m);
    });
    if (ref.current) ref.current.instanceMatrix.needsUpdate = true;
  }, [keys]);

  return (
    <group position={[-0.15, 0.1, 0.55]} rotation={[0, 0.06, 0]}>
      <RoundedBox args={[1.52, 0.07, 0.52]} radius={0.03} smoothness={3}>
        <meshStandardMaterial color={CLAY.key} roughness={0.7} />
      </RoundedBox>
      <instancedMesh ref={ref} args={[undefined, undefined, keys.length]}>
        <boxGeometry args={[0.085, 0.04, 0.08]} />
        <meshStandardMaterial color="#fbf9f4" roughness={0.6} />
      </instancedMesh>
    </group>
  );
}

export interface DeskSceneProps {
  isReady: boolean;
  palette: Palette;
  pulses: Record<DeskObject, number>;
  onHover: (name: DeskObject | null) => void;
  onActivate: (name: DeskObject) => void;
  /** Hero scroll progress, 0 → 1, written by ScrollTrigger. */
  progress: MutableRefObject<number>;
}

const LEAVES: [number, number, number, number][] = [
  [0, 0.55, 0, 0.2],
  [0.12, 0.42, 0.06, 0.14],
  [-0.12, 0.45, -0.04, 0.15],
  [0.04, 0.7, -0.05, 0.12],
];

const CAM_START = new THREE.Vector3(6.8, 5.2, 8.5);
// Screen centre in world space once the desk is squared up: group y (-0.6) + monitor (0.1) + screen (1.1).
const SCREEN_CENTER = new THREE.Vector3(0, 0.6, -0.39);
const CAM_END = new THREE.Vector3(0, 0.6, 1.25);
const CAM_CURVE_CONTROL = new THREE.Vector3(3.2, 2.2, 5.5);

/** Flies the camera along a curve into the monitor as the hero scrolls. */
function CameraRig({ progress }: { progress: MutableRefObject<number> }) {
  const { camera, size } = useThree();
  const curve = useMemo(() => new THREE.QuadraticBezierCurve3(CAM_START.clone(), CAM_CURVE_CONTROL, CAM_END), []);
  const look = useRef(new THREE.Vector3());
  const smoothed = useRef(0);

  useFrame((_, delta) => {
    smoothed.current = THREE.MathUtils.damp(smoothed.current, diveAmount(progress.current), 6, delta);
    const d = smoothed.current;
    // Narrow screens pull the start point back so the whole desk fits.
    const aspect = size.width / size.height;
    const pullBack = aspect < 1 ? THREE.MathUtils.lerp(1, 0.75 / aspect, 1 - d) : 1;
    curve.v0.copy(CAM_START).multiplyScalar(pullBack);
    camera.position.copy(curve.getPoint(d));
    look.current.set(0, 0.2, 0).lerp(SCREEN_CENTER, d);
    camera.lookAt(look.current);
  });

  return null;
}

function Desk({ isReady, palette, pulses, onHover, onActivate, progress }: DeskSceneProps) {
  const group = useRef<THREE.Group>(null);
  const shared = { onHover, onActivate };
  const { camera, size } = useThree();
  const offset = useRef(new THREE.Vector3());
  const right = useRef(new THREE.Vector3());
  const up = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const dive = diveAmount(progress.current);
    // Slightly smaller at rest on wide screens; back to full size for the dive framing.
    const restScale = size.width >= 768 ? THREE.MathUtils.lerp(0.82, 1, dive) : 1;
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, isReady ? restScale : 0.001, 3.2, delta));

    // Pointer tilt and idle bob fade out as the camera commits to the dive.
    const tiltY = (0.3 + state.pointer.x * 0.3) * (1 - dive);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, tiltY, 4, delta);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, state.pointer.y * -0.06 * (1 - dive), 4, delta);

    // Park the desk right of the headline (desktop) or below the intro copy (mobile), in screen space.
    const isWide = size.width >= 768;
    right.current.setFromMatrixColumn(camera.matrixWorld, 0);
    up.current.setFromMatrixColumn(camera.matrixWorld, 1);
    offset.current
      .set(0, 0, 0)
      .addScaledVector(right.current, isWide ? THREE.MathUtils.clamp((size.width / size.height) * 1.3, 1.6, 3) : 0)
      .addScaledVector(up.current, isWide ? 0.55 : -1.5)
      .multiplyScalar(1 - dive);
    g.position.x = offset.current.x;
    g.position.z = offset.current.z;
    g.position.y = -0.6 + offset.current.y + Math.sin(state.clock.elapsedTime * 0.8) * 0.04 * (1 - dive);
  });

  return (
    <group ref={group} scale={0.001}>
      {/* Floor platform: a soft plinth with a glowing accent rim instead of flat rugs. */}
      <mesh position={[0, -1.16, 0]}>
        <cylinderGeometry args={[2.75, 2.85, 0.1, 96]} />
        <meshStandardMaterial color={palette.surface} roughness={0.85} />
      </mesh>
      <mesh position={[0, -1.105, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.35, 2.75, 96]} />
        <meshStandardMaterial color={palette.accent2} roughness={0.9} transparent opacity={0.55} />
      </mesh>
      <mesh position={[0, -1.11, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.78, 0.025, 12, 128]} />
        <meshBasicMaterial color={palette.accent} toneMapped={false} />
      </mesh>
      <Sparkles count={36} scale={[6, 3.2, 4]} position={[0, 0.6, 0]} size={2.4} speed={0.35} opacity={0.7} color={palette.accent} />

      <RoundedBox args={[4.2, 0.16, 2.1]} radius={0.06} smoothness={4}>
        <meshStandardMaterial color={CLAY.desk} roughness={0.6} />
      </RoundedBox>
      {[
        [-1.9, -0.9],
        [1.9, -0.9],
        [-1.9, 0.9],
        [1.9, 0.9],
      ].map(([x, z], i) => (
        <mesh key={i} position={[x, -0.6, z]}>
          <cylinderGeometry args={[0.06, 0.05, 1.05, 16]} />
          <meshStandardMaterial color={CLAY.wood} roughness={0.7} />
        </mesh>
      ))}

      <Interactive name="monitor" position={[0, 0.1, -0.45]} pulse={pulses.monitor} reaction="hop" {...shared}>
        <mesh position={[0, 0.03, 0]}>
          <cylinderGeometry args={[0.32, 0.36, 0.06, 32]} />
          <meshStandardMaterial color={CLAY.dark} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.4, -0.05]}>
          <boxGeometry args={[0.12, 0.75, 0.08]} />
          <meshStandardMaterial color={CLAY.dark} roughness={0.5} />
        </mesh>
        <RoundedBox args={[2.3, 1.4, 0.12]} radius={0.05} smoothness={4} position={[0, 1.1, 0]}>
          <meshStandardMaterial color={CLAY.dark} roughness={0.45} />
        </RoundedBox>
        <Screen palette={palette} progress={progress} />
        {/* Screen spill light so the desk picks up the monitor's glow. */}
        <pointLight position={[0, 1.1, 0.6]} intensity={2.2} distance={3.2} decay={2} color={palette.accent2} />
        <mesh position={[1.08, 1.62, 0.07]} rotation={[0, 0, -0.18]}>
          <planeGeometry args={[0.3, 0.3]} />
          <meshStandardMaterial color={palette.accent} roughness={0.9} side={THREE.DoubleSide} />
        </mesh>
      </Interactive>

      <Keyboard />
      <RoundedBox args={[0.18, 0.06, 0.28]} radius={0.03} position={[0.95, 0.12, 0.6]}>
        <meshStandardMaterial color="#fbf9f4" roughness={0.6} />
      </RoundedBox>

      <Interactive name="mug" position={[1.45, 0.1, 0.45]} pulse={pulses.mug} reaction="spin" {...shared}>
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.16, 0.14, 0.4, 32]} />
          <meshStandardMaterial color={palette.accent2} roughness={0.55} />
        </mesh>
        <mesh position={[0.17, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.09, 0.03, 12, 24]} />
          <meshStandardMaterial color={palette.accent2} roughness={0.55} />
        </mesh>
        <mesh position={[0, 0.39, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.02, 24]} />
          <meshStandardMaterial color="#4a2f1f" roughness={0.3} />
        </mesh>
      </Interactive>

      <Interactive name="plant" position={[-1.6, 0.1, -0.55]} pulse={pulses.plant} reaction="grow" {...shared}>
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.2, 0.15, 0.3, 24]} />
          <meshStandardMaterial color="#f5f2eb" roughness={0.8} />
        </mesh>
        {LEAVES.map(([x, y, z, s], i) => (
          <mesh key={i} position={[x, y, z]}>
            <icosahedronGeometry args={[s, 1]} />
            <meshStandardMaterial color="#4f8a4b" roughness={0.8} flatShading />
          </mesh>
        ))}
      </Interactive>

      <Interactive name="books" position={[1.5, 0, -0.5]} rotation={[0, -0.3, 0]} pulse={pulses.books} reaction="hop" {...shared}>
        {(
          [
            [palette.accent, 0.1, 0.15],
            ['#f5f2eb', 0.08, 0.24],
            [CLAY.dark, 0.12, 0.34],
          ] as const
        ).map(([color, h, y], i) => (
          <RoundedBox key={i} args={[0.7 - i * 0.05, h, 0.5]} radius={0.015} position={[0, y, 0]} rotation={[0, i * 0.12, 0]}>
            <meshStandardMaterial color={color} roughness={0.7} />
          </RoundedBox>
        ))}
      </Interactive>

      <ContactShadows position={[0, -1.1, 0]} opacity={0.55} scale={7} blur={2.2} far={2.2} />
    </group>
  );
}

export default function DeskScene(props: DeskSceneProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  // Stop rendering once the hero leaves the viewport.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="h-full w-full">
      <Canvas
        frameloop={isVisible ? 'always' : 'never'}
        dpr={[1, 1.75]}
        camera={{ position: [6.8, 5.2, 8.5], fov: 28, near: 0.05 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ touchAction: 'pan-y' }}
      >
        <hemisphereLight args={['#fffaf0', '#6f6a7a', 1.25]} />
        <directionalLight position={[4, 8, 5]} intensity={2.2} color="#fff4e2" />
        <directionalLight position={[-6, 3, -2]} intensity={1.1} color={props.palette.accent2} />
        {/* Accent rim light from behind gives the silhouette an edge against dark themes. */}
        <directionalLight position={[2, 4, -7]} intensity={1.4} color={props.palette.accent} />
        <CameraRig progress={props.progress} />
        <Desk {...props} />
      </Canvas>
    </div>
  );
}
