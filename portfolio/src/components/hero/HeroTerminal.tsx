'use client';

import * as React from 'react';
import { Terminal, Play, CheckCircle2, Copy, Check, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export function HeroTerminal() {
  const [activeTab, setActiveTab] = React.useState<'engine' | 'metrics' | 'infra'>('engine');
  const [isRunning, setIsRunning] = React.useState(false);
  const [executionOutput, setExecutionOutput] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);

  const codeSnippets = {
    engine: `// Distributed Event Engine - Partition Broker
import { ClusterNode, RaftEngine, MessageBuffer } from '@core/broker';

export class StreamDispatcher extends ClusterNode {
  private readonly buffer = new MessageBuffer({ capacity: 100_000 });
  private readonly raft = new RaftEngine({ heartbeatMs: 50 });

  async dispatch(event: IngestedEvent): Promise<DispatchAck> {
    const leader = await this.raft.getPartitionLeader(event.topic);
    const writeLog = await leader.appendLog(event.payload);
    
    // Sub-millisecond parallel fan-out
    return this.buffer.push({
      offset: writeLog.offset,
      timestamp: Date.now(),
      status: 'COMMITTED'
    });
  }
}`,
    metrics: `[SYSTEM TELEMETRY REPORT]
--------------------------------------------------
Node Cluster:    5 active nodes (us-east, eu-central)
Event Rate:      104,280 msgs/sec [NORMAL]
P99 Latency:     0.84 ms
Throughput:      248.5 MB/s
Memory Usage:    1.2 GB / 8.0 GB (15%)
Raft Consensus:  HEALTHY (Leader: node-01)`,
    infra: `#!/usr/bin/env bash
# Production Microservice Deployment Pipeline

echo "🚀 Building container images with multi-stage caching..."
docker buildx build --platform linux/amd64 -t registry.lakviru.dev/gateway:v2.4 .
echo "🔒 Verifying mTLS certificates and JWT authorization..."
kubectl apply -f ./k8s/service-mesh.yaml
echo "✅ Zero-downtime rolling update completed successfully."`,
  };

  const handleRun = () => {
    setIsRunning(true);
    setExecutionOutput(null);
    setTimeout(() => {
      setIsRunning(false);
      if (activeTab === 'engine') {
        setExecutionOutput('✓ 100,000 synthetic events ingested in 94ms (P99: 0.81ms) — 0 packet loss.');
      } else if (activeTab === 'metrics') {
        setExecutionOutput('✓ Telemetry stream synced with Prometheus. All 5 cluster nodes reporting healthy.');
      } else {
        setExecutionOutput('✓ Deployment verified. 12 pods healthy across 3 availability zones.');
      }
    }, 600);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(codeSnippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative w-full rounded-2xl border border-zinc-800 bg-zinc-950/90 shadow-2xl shadow-indigo-500/10 backdrop-blur-xl overflow-hidden text-xs sm:text-sm font-mono">
      {/* Top Titlebar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/80 bg-zinc-900/60">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-rose-500/80" />
          <div className="h-3 w-3 rounded-full bg-amber-500/80" />
          <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
          <span className="ml-2 text-zinc-400 font-sans text-xs hidden sm:inline">
            lakviru-perera :: dev-environment
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-zinc-950/80 p-0.5 rounded-lg border border-zinc-800">
          <button
            onClick={() => {
              setActiveTab('engine');
              setExecutionOutput(null);
            }}
            className={cn(
              'px-2.5 py-1 rounded text-xs transition-colors cursor-pointer',
              activeTab === 'engine'
                ? 'bg-zinc-800 text-zinc-100 font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            )}
          >
            engine.ts
          </button>
          <button
            onClick={() => {
              setActiveTab('metrics');
              setExecutionOutput(null);
            }}
            className={cn(
              'px-2.5 py-1 rounded text-xs transition-colors cursor-pointer',
              activeTab === 'metrics'
                ? 'bg-zinc-800 text-zinc-100 font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            )}
          >
            metrics.log
          </button>
          <button
            onClick={() => {
              setActiveTab('infra');
              setExecutionOutput(null);
            }}
            className={cn(
              'px-2.5 py-1 rounded text-xs transition-colors cursor-pointer',
              activeTab === 'infra'
                ? 'bg-zinc-800 text-zinc-100 font-semibold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            )}
          >
            deploy.sh
          </button>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            title="Copy code"
            className="p-1.5 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={handleRun}
            disabled={isRunning}
            title="Execute snippet"
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-sans transition-all cursor-pointer"
          >
            <Play className="h-3 w-3 fill-current" />
            <span className="hidden sm:inline">Run</span>
          </button>
        </div>
      </div>

      {/* Code Editor Body */}
      <div className="p-4 sm:p-5 overflow-x-auto max-h-[340px] leading-relaxed text-zinc-300 font-mono text-xs sm:text-[13px] bg-zinc-950/60">
        <pre className="text-zinc-300">
          <code>{codeSnippets[activeTab]}</code>
        </pre>
      </div>

      {/* Output Console Footer */}
      {executionOutput ? (
        <div className="border-t border-zinc-800 bg-emerald-950/30 px-4 py-2.5 text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          <span>{executionOutput}</span>
        </div>
      ) : isRunning ? (
        <div className="border-t border-zinc-800 bg-indigo-950/30 px-4 py-2.5 text-indigo-300 text-xs flex items-center gap-2 animate-pulse">
          <Sparkles className="h-3.5 w-3.5 animate-spin" />
          <span>Executing simulation & verifying test suites...</span>
        </div>
      ) : (
        <div className="border-t border-zinc-800/60 bg-zinc-900/30 px-4 py-2 text-zinc-500 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>TypeScript 5.x • Node.js Runtime • Docker Ready</span>
          </div>
          <span className="text-zinc-600">UTF-8</span>
        </div>
      )}
    </div>
  );
}
