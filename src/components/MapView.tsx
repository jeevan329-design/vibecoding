import React, { useState } from 'react';
import { useCommunity } from '../context/CommunityContext';
import { EntityType } from '../types';
import { MapPin, Navigation, Eye, AlertCircle, Package, Building, Users } from 'lucide-react';

export const MapView: React.FC = () => {
  const {
    situations,
    needs,
    resources,
    organizations,
    people,
    filterTypes,
    filterUrgency,
    filterCategory,
    searchQuery,
    selectEntity,
    openSituationRoom
  } = useCommunity();

  const [activePin, setActivePin] = useState<{ id: string; type: EntityType; title: string; area: string } | null>(null);

  // Map coordinate conversion for Riverside approximate bounds
  // Lat: 45.510 to 45.528 -> Y (650 to 50)
  // Lng: -122.688 to -122.668 -> X (50 to 850)
  const toX = (lng: number) => {
    const minLng = -122.688;
    const maxLng = -122.668;
    return 60 + ((lng - minLng) / (maxLng - minLng)) * 780;
  };

  const toY = (lat: number) => {
    const minLat = 45.510;
    const maxLat = 45.528;
    return 580 - ((lat - minLat) / (maxLat - minLat)) * 520;
  };

  return (
    <div className="relative w-full h-[620px] rounded-2xl bg-[#EFE7D6]/80 dark:bg-[#172A29]/80 border border-[#D9CFB9] dark:border-[#243E3B] overflow-hidden select-none shadow-inner transition-colors">
      {/* Map Header Overlay */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 bg-[#FAF6EE]/90 dark:bg-[#10201F]/90 backdrop-blur-md rounded-xl border border-[#D9CFB9] dark:border-[#243E3B] text-xs font-medium text-[#1F5C5A] dark:text-[#5FB3AE]">
        <Navigation className="w-3.5 h-3.5" />
        <span>Riverside Civic Map · Approximate Coordinates Only</span>
      </div>

      {/* SVG Stylized Map */}
      <svg viewBox="0 0 900 620" className="w-full h-full">
        {/* River Feature */}
        <path
          d="M 520 0 Q 480 200 460 320 T 430 620 L 490 620 Q 520 320 540 200 T 580 0 Z"
          fill="#3D4F9F"
          opacity="0.16"
        />
        <text x="490" y="240" fill="#3D4F9F" opacity="0.4" fontSize="13" fontWeight="600" transform="rotate(78 490 240)">
          Riverside Waterway
        </text>

        {/* Bridges */}
        <line x1="435" y1="200" x2="565" y2="200" stroke="#D9CFB9" strokeWidth="6" strokeLinecap="round" />
        <line x1="400" y1="420" x2="510" y2="420" stroke="#D9CFB9" strokeWidth="6" strokeLinecap="round" />

        {/* District Soft Pods */}
        {/* Riverside Water Emergency Zone */}
        <ellipse cx="620" cy="320" rx="140" ry="110" fill="#1F5C5A" opacity="0.08" stroke="#1F5C5A" strokeWidth="1" strokeDasharray="6 6" />
        <text x="620" y="235" textAnchor="middle" fill="#1F5C5A" fontSize="11" fontWeight="600">
          Eastern Water Alert Pod
        </text>

        {/* Elm Street Park Zone */}
        <circle cx="210" cy="160" r="85" fill="#3E9B6B" opacity="0.08" stroke="#3E9B6B" strokeWidth="1" strokeDasharray="4 4" />
        <text x="210" y="100" textAnchor="middle" fill="#2B7A50" fontSize="11" fontWeight="600">
          Elm Street Commons
        </text>

        {/* St. Jude Civic Zone */}
        <circle cx="580" cy="490" r="90" fill="#3D4F9F" opacity="0.08" stroke="#3D4F9F" strokeWidth="1" strokeDasharray="4 4" />
        <text x="580" y="420" textAnchor="middle" fill="#3D4F9F" fontSize="11" fontWeight="600">
          St. Jude Relief Hub
        </text>

        {/* PINS */}
        {/* 1. Situations */}
        {filterTypes.situation &&
          situations.map(sit => {
            const cx = toX(sit.area.lng);
            const cy = toY(sit.area.lat);
            return (
              <g
                key={sit.id}
                transform={`translate(${cx}, ${cy})`}
                className="cursor-pointer"
                onClick={() => openSituationRoom(sit.id)}
                onMouseEnter={() =>
                  setActivePin({ id: sit.id, type: 'situation', title: sit.title, area: sit.area.areaName })
                }
                onMouseLeave={() => setActivePin(null)}
              >
                <circle r="14" fill="#1F5C5A" stroke="#FAF6EE" strokeWidth="2" />
                <text x="0" y="4" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="bold">
                  S
                </text>
              </g>
            );
          })}

        {/* 2. Needs */}
        {filterTypes.need &&
          needs.map(n => {
            if (filterUrgency !== 'all' && n.urgency !== filterUrgency) return null;
            if (filterCategory !== 'all' && n.category !== filterCategory) return null;
            if (searchQuery && !n.title.toLowerCase().includes(searchQuery.toLowerCase())) return null;

            const cx = toX(n.locationApprox.lng);
            const cy = toY(n.locationApprox.lat);
            return (
              <g
                key={n.id}
                transform={`translate(${cx}, ${cy})`}
                className="cursor-pointer"
                onClick={() => selectEntity('need', n.id)}
                onMouseEnter={() =>
                  setActivePin({ id: n.id, type: 'need', title: n.title, area: n.locationApprox.areaName })
                }
                onMouseLeave={() => setActivePin(null)}
              >
                <circle r="7" fill="#F2A93B" stroke="#FAF6EE" strokeWidth="1.5" />
              </g>
            );
          })}

        {/* 3. Resources */}
        {filterTypes.resource &&
          resources.map(r => {
            if (searchQuery && !r.title.toLowerCase().includes(searchQuery.toLowerCase())) return null;
            const cx = toX(r.locationApprox.lng);
            const cy = toY(r.locationApprox.lat);
            return (
              <g
                key={r.id}
                transform={`translate(${cx}, ${cy})`}
                className="cursor-pointer"
                onClick={() => selectEntity('resource', r.id)}
                onMouseEnter={() =>
                  setActivePin({ id: r.id, type: 'resource', title: r.title, area: r.locationApprox.areaName })
                }
                onMouseLeave={() => setActivePin(null)}
              >
                <rect x="-6" y="-6" width="12" height="12" rx="2" fill="#3E9B6B" stroke="#FAF6EE" strokeWidth="1.5" />
              </g>
            );
          })}

        {/* 4. Organizations */}
        {filterTypes.organization &&
          organizations.map(o => {
            if (searchQuery && !o.name.toLowerCase().includes(searchQuery.toLowerCase())) return null;
            const cx = toX(o.area.lng);
            const cy = toY(o.area.lat);
            return (
              <g
                key={o.id}
                transform={`translate(${cx}, ${cy})`}
                className="cursor-pointer"
                onClick={() => selectEntity('organization', o.id)}
                onMouseEnter={() =>
                  setActivePin({ id: o.id, type: 'organization', title: o.name, area: o.area.areaName })
                }
                onMouseLeave={() => setActivePin(null)}
              >
                <polygon points="0,-9 9,7 -9,7" fill="#3D4F9F" stroke="#FAF6EE" strokeWidth="1.5" />
              </g>
            );
          })}
      </svg>

      {/* Hover Info Tooltip */}
      {activePin && (
        <div className="absolute bottom-4 right-4 z-20 max-w-xs p-3 bg-[#FAF6EE] dark:bg-[#172A29] rounded-xl border border-[#D9CFB9] dark:border-[#243E3B] shadow-lg animate-in fade-in duration-150">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#5B6B6E] dark:text-[#8F9FA1]">
            {activePin.type} · {activePin.area}
          </div>
          <div className="text-sm font-semibold text-[#1F2A2E] dark:text-[#F3EEE2] mt-0.5 line-clamp-2">
            {activePin.title}
          </div>
          <div className="text-[11px] text-[#1F5C5A] dark:text-[#5FB3AE] mt-1 font-medium">
            Click to view full details
          </div>
        </div>
      )}
    </div>
  );
};
