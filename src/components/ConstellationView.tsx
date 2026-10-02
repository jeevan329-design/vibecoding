import React, { useState, useRef, useMemo } from 'react';
import { useCommunity } from '../context/CommunityContext';
import { EntityType, UrgencyLevel } from '../types';
import { ZoomIn, ZoomOut, RotateCcw, AlertTriangle, Sparkles, CheckCircle, Info } from 'lucide-react';

interface CanvasNode {
  id: string;
  type: EntityType;
  title: string;
  subtitle: string;
  x: number;
  y: number;
  r: number;
  color: string;
  textColor: string;
  urgency?: UrgencyLevel;
  status?: string;
  situationId?: string | null;
  connections: string[];
}

export const ConstellationView: React.FC = () => {
  const {
    situations,
    needs,
    resources,
    people,
    organizations,
    matches,
    filterTypes,
    filterUrgency,
    filterCategory,
    searchQuery,
    selectEntity,
    openSituationRoom
  } = useCommunity();

  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Compute Layout Positions for Nodes & Threads
  const { nodes, edges } = useMemo(() => {
    const calculatedNodes: CanvasNode[] = [];
    const calculatedEdges: Array<{
      id: string;
      sourceId: string;
      targetId: string;
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      type: 'matched' | 'suggested' | 'hub';
      color: string;
    }> = [];

    // Base coordinate system: 1200 x 700 virtual canvas
    const situationCenters: Record<string, { x: number; y: number; r: number }> = {
      'sit-riverside-water': { x: 480, y: 340, r: 42 },
      'sit-elm-garden': { x: 220, y: 220, r: 32 },
      'sit-food-pantry': { x: 860, y: 460, r: 30 },
      'sit-winter-shelter-2025': { x: 880, y: 190, r: 28 }
    };

    // 1. Situations (Hub Nodes)
    situations.forEach(sit => {
      if (!filterTypes.situation) return;
      const pos = situationCenters[sit.id] || { x: 600, y: 350, r: 32 };
      calculatedNodes.push({
        id: sit.id,
        type: 'situation',
        title: sit.title,
        subtitle: `${sit.needsMetCount}/${sit.needsCount} needs met`,
        x: pos.x,
        y: pos.y,
        r: pos.r,
        color: '#1F5C5A',
        textColor: '#FFFFFF',
        status: sit.status,
        connections: []
      });
    });

    // 2. Needs (Marigold #F2A93B)
    needs.forEach((need, idx) => {
      if (!filterTypes.need) return;
      if (filterUrgency !== 'all' && need.urgency !== filterUrgency) return;
      if (filterCategory !== 'all' && need.category !== filterCategory) return;
      if (searchQuery && !need.title.toLowerCase().includes(searchQuery.toLowerCase())) return;

      const sitCenter = need.situationId ? situationCenters[need.situationId] : { x: 500, y: 550, r: 30 };
      const angle = (idx * 37 * Math.PI) / 180;
      const distance = 95 + (idx % 3) * 35;
      const x = (sitCenter ? sitCenter.x : 500) + Math.cos(angle) * distance;
      const y = (sitCenter ? sitCenter.y : 350) + Math.sin(angle) * distance;

      calculatedNodes.push({
        id: need.id,
        type: 'need',
        title: need.title,
        subtitle: need.urgency === 'today' ? 'Needed Today' : 'Open Need',
        x,
        y,
        r: need.urgency === 'today' ? 14 : 11,
        color: '#F2A93B',
        textColor: '#1F2A2E',
        urgency: need.urgency,
        status: need.status,
        situationId: need.situationId,
        connections: need.situationId ? [need.situationId] : []
      });

      if (need.situationId) {
        calculatedEdges.push({
          id: `edge-sit-${need.id}`,
          sourceId: need.situationId,
          targetId: need.id,
          x1: sitCenter.x,
          y1: sitCenter.y,
          x2: x,
          y2: y,
          type: 'hub',
          color: '#D9CFB9'
        });
      }
    });

    // 3. Resources (Leaf #3E9B6B)
    resources.forEach((res, idx) => {
      if (!filterTypes.resource) return;
      if (searchQuery && !res.title.toLowerCase().includes(searchQuery.toLowerCase())) return;

      const angle = (idx * 48 * Math.PI) / 180 + 1.2;
      const sitCenter = situationCenters['sit-riverside-water'];
      const distance = 160 + (idx % 2) * 50;
      const x = sitCenter.x + Math.cos(angle) * distance;
      const y = sitCenter.y + Math.sin(angle) * distance;

      calculatedNodes.push({
        id: res.id,
        type: 'resource',
        title: res.title,
        subtitle: res.quantity,
        x,
        y,
        r: 12,
        color: '#3E9B6B',
        textColor: '#FFFFFF',
        status: res.status,
        connections: []
      });
    });

    // 4. Organizations (Indigo #3D4F9F)
    organizations.forEach((org, idx) => {
      if (!filterTypes.organization) return;
      if (searchQuery && !org.name.toLowerCase().includes(searchQuery.toLowerCase())) return;

      const angle = (idx * 72 * Math.PI) / 180 + 2.5;
      const x = 500 + Math.cos(angle) * 240;
      const y = 350 + Math.sin(angle) * 200;

      calculatedNodes.push({
        id: org.id,
        type: 'organization',
        title: org.name,
        subtitle: 'Verified Partner',
        x,
        y,
        r: 18,
        color: '#3D4F9F',
        textColor: '#FFFFFF',
        connections: org.activeSituationIds
      });

      org.activeSituationIds.forEach(sitId => {
        const sitPos = situationCenters[sitId];
        if (sitPos) {
          calculatedEdges.push({
            id: `edge-org-${org.id}-${sitId}`,
            sourceId: org.id,
            targetId: sitId,
            x1: x,
            y1: y,
            x2: sitPos.x,
            y2: sitPos.y,
            type: 'hub',
            color: '#3D4F9F'
          });
        }
      });
    });

    // 5. Matches Threads (Solid for confirmed, dashed for suggested)
    matches.forEach(m => {
      const needNode = calculatedNodes.find(n => n.id === m.needId);
      const resNode = calculatedNodes.find(n => n.id === m.resourceId);

      if (needNode && resNode) {
        needNode.connections.push(resNode.id);
        resNode.connections.push(needNode.id);

        calculatedEdges.push({
          id: `match-thread-${m.id}`,
          sourceId: m.needId,
          targetId: m.resourceId,
          x1: needNode.x,
          y1: needNode.y,
          x2: resNode.x,
          y2: resNode.y,
          type: m.state === 'confirmed' ? 'matched' : 'suggested',
          color: m.state === 'confirmed' ? '#1F5C5A' : '#F2A93B'
        });
      }
    });

    return { nodes: calculatedNodes, edges: calculatedEdges };
  }, [situations, needs, resources, organizations, matches, filterTypes, filterUrgency, filterCategory, searchQuery]);

  // Compute connected nodes for hover focus (Section 8.6: hovered node and its connections stay lit, others dim to 20%)
  const highlightedNodeIds = useMemo(() => {
    if (!hoveredNodeId) return null;
    const active = new Set<string>([hoveredNodeId]);
    const target = nodes.find(n => n.id === hoveredNodeId);
    if (target) {
      target.connections.forEach(id => active.add(id));
    }
    edges.forEach(e => {
      if (e.sourceId === hoveredNodeId) active.add(e.targetId);
      if (e.targetId === hoveredNodeId) active.add(e.sourceId);
    });
    return active;
  }, [hoveredNodeId, nodes, edges]);

  // Canvas Mouse Pan Controls
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const resetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div
      className="relative w-full h-[620px] rounded-2xl bg-[#FAF6EE] dark:bg-[#10201F] border border-[#D9CFB9] dark:border-[#243E3B] overflow-hidden select-none cursor-grab active:cursor-grabbing shadow-inner transition-colors"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Paper texture overlay */}
      <div className="absolute inset-0 paper-texture opacity-60 pointer-events-none" />

      {/* Floating Canvas Controls (Zoom In/Out, Reset, Legend) */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <div className="flex items-center gap-1 p-1 bg-[#FAF6EE]/90 dark:bg-[#172A29]/90 backdrop-blur-md rounded-xl border border-[#D9CFB9] dark:border-[#243E3B] shadow-sm">
          <button
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 2.2))}
            title="Zoom In"
            className="p-2 text-[#1F2A2E] dark:text-[#F3EEE2] hover:bg-[#EFE7D6] dark:hover:bg-[#10201F] rounded-lg transition-colors cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.6))}
            title="Zoom Out"
            className="p-2 text-[#1F2A2E] dark:text-[#F3EEE2] hover:bg-[#EFE7D6] dark:hover:bg-[#10201F] rounded-lg transition-colors cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={resetView}
            title="Reset Pan & Zoom"
            className="p-2 text-[#1F2A2E] dark:text-[#F3EEE2] hover:bg-[#EFE7D6] dark:hover:bg-[#10201F] rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Legend & Guidance Badge */}
      <div className="absolute bottom-4 left-4 z-20 hidden sm:flex items-center gap-3 px-3.5 py-2 bg-[#FAF6EE]/90 dark:bg-[#172A29]/90 backdrop-blur-md rounded-xl border border-[#D9CFB9] dark:border-[#243E3B] text-xs text-[#5B6B6E] dark:text-[#8F9FA1]">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#1F5C5A]" />
          <span>Situation Hub</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#F2A93B]" />
          <span>Need</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3E9B6B]" />
          <span>Resource</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#3D4F9F]" />
          <span>Organization</span>
        </div>
        <span aria-hidden="true" className="text-[#D9CFB9]">|</span>
        <span className="text-[11px]">Hover to illuminate connections · Click to open</span>
      </div>

      {/* SVG Rendering Stage with Pan/Zoom Transform */}
      <svg
        viewBox="0 0 1200 700"
        className="w-full h-full"
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
          transformOrigin: 'center center',
          transition: isDragging ? 'none' : 'transform 0.15s ease-out'
        }}
      >
        <defs>
          {/* Subtle Glow Filters */}
          <filter id="hub-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="urgent-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. EDGES / THREADS */}
        <g id="edges">
          {edges.map(edge => {
            const isDimmed =
              highlightedNodeIds &&
              !highlightedNodeIds.has(edge.sourceId) &&
              !highlightedNodeIds.has(edge.targetId);

            const isSolid = edge.type === 'matched' || edge.type === 'hub';

            return (
              <g key={edge.id} opacity={isDimmed ? 0.15 : 0.85} className="transition-opacity duration-150">
                <line
                  x1={edge.x1}
                  y1={edge.y1}
                  x2={edge.x2}
                  y2={edge.y2}
                  stroke={edge.color}
                  strokeWidth={edge.type === 'matched' ? 2 : 1}
                  strokeDasharray={isSolid ? undefined : '4 4'}
                />
              </g>
            );
          })}
        </g>

        {/* 2. NODES */}
        <g id="nodes">
          {nodes.map(node => {
            const isDimmed = highlightedNodeIds && !highlightedNodeIds.has(node.id);
            const isHovered = hoveredNodeId === node.id;
            const isSituation = node.type === 'situation';
            const isUrgent = node.urgency === 'today';
            const isIdleResource = node.type === 'resource' && node.status === 'idle';

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                opacity={isDimmed ? 0.2 : 1}
                className="transition-opacity duration-150 cursor-pointer"
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                onClick={() => {
                  if (isSituation) {
                    openSituationRoom(node.id);
                  } else {
                    selectEntity(node.type, node.id);
                  }
                }}
              >
                {/* Situation Hub Outer Ring */}
                {isSituation && (
                  <circle
                    r={node.r + 8}
                    fill="#1F5C5A"
                    opacity={0.08}
                  />
                )}

                {/* Urgent Need Ring */}
                {isUrgent && (
                  <circle
                    r={node.r + 4}
                    fill="none"
                    stroke="#C8372D"
                    strokeWidth={1.5}
                    strokeDasharray="2 2"
                  />
                )}

                {/* Idle Resource subtle ring */}
                {isIdleResource && (
                  <circle
                    r={node.r + 4}
                    fill="none"
                    stroke="#3E9B6B"
                    strokeWidth={1}
                    opacity={0.5}
                  />
                )}

                {/* Main Node Body */}
                <circle
                  r={isHovered ? node.r * 1.12 : node.r}
                  fill={node.color}
                  stroke="#FAF6EE"
                  strokeWidth={1.5}
                  className="transition-transform duration-100"
                />

                {/* Center Label for Situation Hubs */}
                {isSituation && (
                  <text
                    textAnchor="middle"
                    dy="4"
                    fill="#FFFFFF"
                    fontSize="11"
                    fontWeight="bold"
                    className="pointer-events-none font-display"
                  >
                    Hub
                  </text>
                )}

                {/* Node Title Label (shown for hubs or on hover) */}
                {(isSituation || isHovered) && (
                  <g transform={`translate(0, ${node.r + 14})`}>
                    <rect
                      x={-Math.min(node.title.length * 4.5, 90)}
                      y={-10}
                      width={Math.min(node.title.length * 9, 180)}
                      height={20}
                      rx={6}
                      fill="#1F2A2E"
                      opacity={0.9}
                    />
                    <text
                      textAnchor="middle"
                      dy="4"
                      fill="#FAF6EE"
                      fontSize="10"
                      fontWeight="500"
                      className="pointer-events-none"
                    >
                      {node.title.length > 24 ? node.title.slice(0, 22) + '...' : node.title}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
};
