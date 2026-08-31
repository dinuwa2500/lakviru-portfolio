'use client';

import * as React from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  Layers,
  Smartphone,
  Server,
  Zap,
  Database,
  Flame,
  Box,
  Cpu,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import { FloatingFeaturedCard } from './FloatingFeaturedCard';
import { ProjectData } from '@/types';

interface LivingArchitectureProps {
  featuredProject?: ProjectData | null;
}

interface NodeData {
  id: string;
  label: string;
  subtitle: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'Realtime';
  x: number; // in SVG viewBox 0-540
  y: number; // in SVG viewBox 0-380
  color: string;
  icon: React.ElementType;
  connectedTo: string[];
}

const NODES: NodeData[] = [
  {
    id: 'nextjs',
    label: 'Next.js / React',
    subtitle: 'App Router & UI',
    category: 'Frontend',
    x: 120,
    y: 60,
    color: '#6366f1', // Indigo
    icon: Layers,
    connectedTo: ['rest', 'sse'],
  },
  {
    id: 'flutter',
    label: 'Flutter',
    subtitle: 'Mobile Client',
    category: 'Frontend',
    x: 420,
    y: 60,
    color: '#0ea5e9', // Sky
    icon: Smartphone,
    connectedTo: ['rest', 'firebase', 'sse'],
  },
  {
    id: 'rest',
    label: 'REST & Actions',
    subtitle: 'API Service Layer',
    category: 'Backend',
    x: 180,
    y: 165,
    color: '#8b5cf6', // Violet
    icon: Server,
    connectedTo: ['nextjs', 'flutter', 'postgres', 'docker', 'sse'],
  },
  {
    id: 'sse',
    label: 'Server-Sent Events',
    subtitle: 'Real-Time Streams',
    category: 'Realtime',
    x: 360,
    y: 165,
    color: '#f59e0b', // Amber
    icon: Zap,
    connectedTo: ['nextjs', 'flutter', 'rest'],
  },
  {
    id: 'postgres',
    label: 'PostgreSQL',
    subtitle: 'Prisma ORM & DB',
    category: 'Database',
    x: 120,
    y: 275,
    color: '#10b981', // Emerald
    icon: Database,
    connectedTo: ['rest', 'docker'],
  },
  {
    id: 'firebase',
    label: 'Firebase',
    subtitle: 'Auth & Cloud',
    category: 'Database',
    x: 420,
    y: 275,
    color: '#f97316', // Orange
    icon: Flame,
    connectedTo: ['flutter', 'docker'],
  },
  {
    id: 'docker',
    label: 'Docker',
    subtitle: 'Containerization',
    category: 'DevOps',
    x: 270,
    y: 335,
    color: '#06b6d4', // Cyan
    icon: Box,
    connectedTo: ['postgres', 'firebase', 'rest'],
  },
];

interface EdgeData {
  id: string;
  from: string;
  to: string;
  path: string;
  speed: number;
}

const EDGES: EdgeData[] = [
  { id: 'e1', from: 'nextjs', to: 'rest', path: 'M 120 60 Q 140 115 180 165', speed: 3.2 },
  { id: 'e2', from: 'flutter', to: 'rest', path: 'M 420 60 Q 300 110 180 165', speed: 3.8 },
  { id: 'e3', from: 'flutter', to: 'firebase', path: 'M 420 60 Q 435 165 420 275', speed: 4.1 },
  { id: 'e4', from: 'rest', to: 'sse', path: 'M 180 165 Q 270 145 360 165', speed: 2.8 },
  { id: 'e5', from: 'sse', to: 'flutter', path: 'M 360 165 Q 390 110 420 60', speed: 3.5 },
  { id: 'e6', from: 'rest', to: 'postgres', path: 'M 180 165 Q 140 220 120 275', speed: 3.0 },
  { id: 'e7', from: 'postgres', to: 'docker', path: 'M 120 275 Q 185 320 270 335', speed: 4.5 },
  { id: 'e8', from: 'firebase', to: 'docker', path: 'M 420 275 Q 355 320 270 335', speed: 4.2 },
  { id: 'e9', from: 'rest', to: 'docker', path: 'M 180 165 Q 235 260 270 335', speed: 3.6 },
];

export function LivingArchitecture({ featuredProject }: LivingArchitectureProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = React.useState<string | null>(null);
  const [isVisible, setIsVisible] = React.useState(true);

  // Mouse Parallax Physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 120 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-6, 6]);

  // IntersectionObserver: Pause heavy transforms when scrolled out of view
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setHoveredNode(null);
  };

  const isNodeHighlighted = (nodeId: string) => {
    if (!hoveredNode) return true;
    if (hoveredNode === nodeId) return true;
    const current = NODES.find((n) => n.id === hoveredNode);
    return current?.connectedTo.includes(nodeId);
  };

  const isEdgeHighlighted = (from: string, to: string) => {
    if (!hoveredNode) return false;
    return (
      (hoveredNode === from && NODES.find((n) => n.id === from)?.connectedTo.includes(to)) ||
      (hoveredNode === to && NODES.find((n) => n.id === to)?.connectedTo.includes(from))
    );
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-xl mx-auto select-none perspective-[1000px]"
    >
      {/* 3D Motion Stage */}
      <motion.div
        style={{
          rotateX: isVisible ? rotateX : 0,
          rotateY: isVisible ? rotateY : 0,
          transformStyle: 'preserve-3d',
        }}
        className="relative rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-950/[0.03] dark:bg-zinc-900/40 backdrop-blur-xl p-4 sm:p-6 shadow-2xl shadow-indigo-500/10 overflow-hidden"
      >
        {/* Subtle Background Radial Grid & Ambient Aura */}
        <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:24px_24px] opacity-15 dark:opacity-25 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-500/10 blur-[90px] rounded-full pointer-events-none" />

        {/* Visual Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-zinc-200/60 dark:border-zinc-800/60 pb-3 mb-2">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-indigo-600 dark:text-indigo-400 animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-wider text-zinc-800 dark:text-zinc-200 uppercase">
              Living Architecture
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Interactive Node Topology</span>
          </div>
        </div>

        {/* SVG Network Graph Canvas */}
        <div className="relative w-full aspect-[540/380]">
          <svg
            viewBox="0 0 540 380"
            className="w-full h-full overflow-visible pointer-events-none"
          >
            <defs>
              {/* Glowing Gradient Filters for Particles */}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.4" />
              </linearGradient>

              <linearGradient id="activeEdgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#818cf8" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.9" />
              </linearGradient>
            </defs>

            {/* Render Static/Base Conduits */}
            {EDGES.map((edge) => {
              const active = isEdgeHighlighted(edge.from, edge.to);
              return (
                <g key={edge.id}>
                  {/* Outer glow line */}
                  <path
                    d={edge.path}
                    fill="none"
                    stroke={active ? 'url(#activeEdgeGradient)' : 'currentColor'}
                    strokeWidth={active ? 2.5 : 1.5}
                    className={
                      active
                        ? 'transition-all duration-300'
                        : 'text-zinc-300/80 dark:text-zinc-700/60 transition-all duration-300'
                    }
                    strokeDasharray={active ? 'none' : '4 4'}
                  />

                  {/* Flowing Data Particles */}
                  {isVisible && (
                    <circle r={active ? 3.5 : 2.5} fill={active ? '#60a5fa' : '#818cf8'} filter="url(#glow)">
                      <animateMotion
                        path={edge.path}
                        dur={`${active ? edge.speed * 0.6 : edge.speed}s`}
                        repeatCount="indefinite"
                        rotate="auto"
                      />
                    </circle>
                  )}
                </g>
              );
            })}
          </svg>

          {/* HTML Overlay Nodes for High-Fidelity Interaction */}
          {NODES.map((node) => {
            const Icon = node.icon;
            const highlighted = isNodeHighlighted(node.id);
            const isSelf = hoveredNode === node.id;

            // Convert viewBox (540x380) to percentage
            const leftPercent = (node.x / 540) * 100;
            const topPercent = (node.y / 380) * 100;

            return (
              <div
                key={node.id}
                style={{
                  left: `${leftPercent}%`,
                  top: `${topPercent}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                onMouseEnter={() => setHoveredNode(node.id)}
                className="absolute z-20 cursor-pointer"
              >
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: isSelf ? 1.15 : highlighted ? 1 : 0.85,
                    opacity: highlighted ? 1 : 0.4,
                  }}
                  transition={{ duration: 0.3 }}
                  className={`group relative flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-xl border backdrop-blur-md transition-all duration-200 ${
                    isSelf
                      ? 'bg-zinc-900 text-white shadow-xl shadow-indigo-500/25 ring-2 ring-indigo-500/60 border-indigo-400'
                      : 'bg-white/90 dark:bg-zinc-900/90 text-zinc-800 dark:text-zinc-200 border-zinc-200/90 dark:border-zinc-800/90 shadow-md hover:border-zinc-400 dark:hover:border-zinc-600'
                  }`}
                >
                  {/* Node Icon with custom category color */}
                  <div
                    className="p-1 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{
                      backgroundColor: `${node.color}15`,
                      color: node.color,
                    }}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </div>

                  {/* Label */}
                  <div className="text-left font-mono">
                    <div className="text-[11px] sm:text-xs font-bold leading-tight line-clamp-1">
                      {node.label}
                    </div>
                    <div className="text-[9px] text-zinc-500 dark:text-zinc-400 hidden sm:block">
                      {node.subtitle}
                    </div>
                  </div>

                  {/* Active Indicator Dot */}
                  <span
                    className="h-1.5 w-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: node.color }}
                  />
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* Floating Featured Project Card Overlay */}
        <div className="relative z-30 pt-3">
          <FloatingFeaturedCard
            project={featuredProject}
            highlightedNode={
              hoveredNode ? NODES.find((n) => n.id === hoveredNode)?.label : null
            }
          />
        </div>
      </motion.div>
    </div>
  );
}
