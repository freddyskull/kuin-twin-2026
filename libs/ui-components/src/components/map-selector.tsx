import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
// @ts-ignore
import 'leaflet/dist/leaflet.css';
import { cn } from '../lib/utils';

interface ReferencePoint {
  id: string;
  lat: number;
  lng: number;
  title?: string;
}

interface MapSelectorProps {
  initialLatitude?: number;
  initialLongitude?: number;
  onLocationChange: (lat: number, lng: number) => void;
  onAddressChange?: (address: string) => void;
  referencePoints?: ReferencePoint[];
  className?: string;
}

let customIcon: any = null;
let referenceIcon: any = null;

if (typeof window !== 'undefined') {
  /* @ts-ignore */
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });

  customIcon = L.divIcon({
    className: 'custom-div-icon',
    html: `
      <div class="relative flex flex-col items-center group">
        <div class="bg-[#E5C068] text-[#0a0b1e] p-2 rounded-full shadow-[0_0_20px_rgba(229,192,104,0.4)] transform -translate-y-4 transition-all scale-125 z-50">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>
      </div>
    `,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
  });

  referenceIcon = L.divIcon({
    className: 'reference-div-icon',
    html: `
      <div class="relative flex flex-col items-center opacity-60 hover:opacity-100 transition-opacity">
        <div class="bg-slate-400 text-[#0a0b1e] p-1.5 rounded-full shadow-lg transform -translate-y-2 scale-90">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>
      </div>
    `,
    iconSize: [20, 28],
    iconAnchor: [10, 28],
  });
}

// Cache simple para evitar peticiones repetidas al mismo punto
const geocodeCache = new Map<string, string>();
const failedGeocodes = new Set<string>();

// Helper for reverse geocoding (Nominatim - Free OSM API)
const reverseGeocode = async (lat: number, lng: number) => {
  const key = `${lat.toFixed(5)},${lng.toFixed(5)}`;
  if (geocodeCache.has(key)) return geocodeCache.get(key)!;
  if (failedGeocodes.has(key)) return '';

  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'es',
          'User-Agent': 'KuinTwin-AdminPanel-V2'
        }
      }
    );
    
    if (response.status === 429) {
      console.warn("Nominatim API rate limit reached (429). Stopping requests for this point.");
      failedGeocodes.add(key);
      return '';
    }

    const data = await response.json();
    const address = data.display_name || '';
    if (address) geocodeCache.set(key, address);
    return address;
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    failedGeocodes.add(key);
    return '';
  }
};

// Component to handle map clicks and recentering
const MapController = ({ position, setPosition, onLocationChange, onAddressChange, lastReportedRef }: any) => {
  const map = useMap();

  const handleUpdate = useCallback(async (lat: number, lng: number, skipGeocode = false) => {
    // Evitar llamadas duplicadas si la posición no ha cambiado significativamente
    if (lastReportedRef.current && 
        Math.abs(lastReportedRef.current.lat - lat) < 0.00001 && 
        Math.abs(lastReportedRef.current.lng - lng) < 0.00001) {
      return;
    }

    lastReportedRef.current = { ...lastReportedRef.current, lat, lng };
    setPosition([lat, lng]);
    onLocationChange(lat, lng);

    if (onAddressChange && !skipGeocode) {
      const address = await reverseGeocode(lat, lng);
      if (address && lastReportedRef.current.address !== address) {
        lastReportedRef.current.address = address;
        onAddressChange(address);
      }
    }
  }, [onLocationChange, onAddressChange, setPosition, lastReportedRef]);

  // Listen for clicks on the map
  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;
      await handleUpdate(lat, lng);
    },
  });

  // Recenter map when position changes (for geolocation or manual address search)
  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom());
    }
  }, [position, map]);

  return position ? (
    <Marker
      position={position}
      icon={customIcon}
      draggable={true}
      eventHandlers={{
        dragend: async (e) => {
          const marker = e.target;
          const { lat, lng } = marker.getLatLng();
          await handleUpdate(lat, lng);
        },
      }}
    />
  ) : null;
};

// Helper for geocoding (Address to Coordinates)
const geocode = async (address: string) => {
  if (!address || address.length < 3) return null;
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
      {
        headers: {
          'Accept-Language': 'es',
          'User-Agent': 'KuinTwin-AdminPanel-V2'
        }
      }
    );
    const data = await response.json();
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      };
    }
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
};

export const MapSelector: React.FC<MapSelectorProps> = ({
  initialLatitude = 0,
  initialLongitude = 0,
  onLocationChange,
  onAddressChange,
  referencePoints = [],
  className,
}) => {
  // Medellín by default if no coordinates provided and geo fails
  const defaultPos: [number, number] = [6.2442, -75.5812];

  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState<[number, number] | null>(
    initialLatitude && initialLongitude && initialLatitude !== 0
      ? [initialLatitude, initialLongitude]
      : null
  );

  // Ref to track last values reported to parent or received from initial props
  const lastReportedRef = useRef<{lat: number, lng: number, address: string | null}>({
    lat: initialLatitude || 0,
    lng: initialLongitude || 0,
    address: null
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update position if initial coordinates change significantly (and not from our own update)
  useEffect(() => {
    if (initialLatitude && initialLongitude && initialLatitude !== 0) {
      const hasChanged = Math.abs(lastReportedRef.current.lat - initialLatitude) > 0.0001 || 
                         Math.abs(lastReportedRef.current.lng - initialLongitude) > 0.0001;
      
      if (hasChanged) {
        lastReportedRef.current.lat = initialLatitude;
        lastReportedRef.current.lng = initialLongitude;
        setPosition([initialLatitude, initialLongitude]);
      }
    }
  }, [initialLatitude, initialLongitude]);

  // Auto-detect user location if no initial position provided
  useEffect(() => {
    if ((!initialLatitude || initialLatitude === 0) && !position && mounted) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            const newPos: [number, number] = [latitude, longitude];
            
            lastReportedRef.current.lat = latitude;
            lastReportedRef.current.lng = longitude;
            
            setPosition(newPos);
            onLocationChange(latitude, longitude);

            // Trigger reverse geocode for user location
            if (onAddressChange) {
              reverseGeocode(latitude, longitude).then(address => {
                if (address) {
                  lastReportedRef.current.address = address;
                  onAddressChange(address);
                }
              });
            }
          },
          (error) => {
            console.warn("Geolocation denied or failed, using default:", error.message);
            setPosition(defaultPos);
            lastReportedRef.current.lat = defaultPos[0];
            lastReportedRef.current.lng = defaultPos[1];
            onLocationChange(defaultPos[0], defaultPos[1]);
          }
        );
      } else {
        setPosition(defaultPos);
        lastReportedRef.current.lat = defaultPos[0];
        lastReportedRef.current.lng = defaultPos[1];
        onLocationChange(defaultPos[0], defaultPos[1]);
      }
    }
  }, [initialLatitude, onLocationChange, onAddressChange, position, mounted]);

  if (!mounted) return <div className={cn("w-full h-[400px] rounded-3xl bg-[#0a0b1e]", className)} />;

  return (
    <div className={cn("relative w-full h-[400px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#0a0b1e]", className)}>
      <MapContainer
        center={position || defaultPos}
        zoom={13}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%', background: '#0a0b1e' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {/* Render reference points (other services) */}
        {mounted && referencePoints?.map((point) => (
          <Marker
            key={point.id}
            position={[point.lat, point.lng]}
            icon={referenceIcon}
          >
            {point.title && (
              <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                <span className="text-[10px] font-bold text-slate-800">{point.title}</span>
              </Tooltip>
            )}
          </Marker>
        ))}

        <MapController
          position={position}
          setPosition={setPosition}
          onLocationChange={onLocationChange}
          onAddressChange={onAddressChange}
          lastReportedRef={lastReportedRef}
        />
      </MapContainer>

      <div className="absolute bottom-6 left-6 right-6 z-[1000] flex gap-4 pointer-events-none">
        <div className="bg-[#1a1c3d]/90 backdrop-blur-xl border border-white/10 px-6 py-3 rounded-2xl shadow-2xl pointer-events-auto flex gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Latitud</span>
            <span className="text-xs font-mono font-bold text-white">{position ? position[0].toFixed(6) : '0.000000'}</span>
          </div>
          <div className="w-px h-8 bg-white/5" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Longitud</span>
            <span className="text-xs font-mono font-bold text-white">{position ? position[1].toFixed(6) : '0.000000'}</span>
          </div>
        </div>
      </div>

      <div className="absolute top-4 left-4 z-[1000] bg-black/40 backdrop-blur-md border border-white/5 px-3 py-1.5 rounded-full">
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Powered by Carto + OSM (Free)</span>
      </div>
    </div>
  );
};

// Export the geocode helper for external use
export { geocode };
