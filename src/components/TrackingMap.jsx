import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

export function TrackingMap({ storeCoord, customerCoord, riderCoord }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const riderMarkerRef = useRef(null);
  const polylineRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Default fallback coordinates (Indiranagar, Bengaluru)
    const sLat = storeCoord?.lat || 12.9719;
    const sLng = storeCoord?.lng || 77.6412;
    const cLat = customerCoord?.lat || 12.9718;
    const cLng = customerCoord?.lng || 77.6415;
    const rLat = riderCoord?.lat || sLat;
    const rLng = riderCoord?.lng || sLng;

    const centerLat = (sLat + cLat) / 2;
    const centerLng = (sLng + cLng) / 2;

    // Initialize Leaflet map
    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false
      }).setView([centerLat, centerLng], 14);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
      }).addTo(map);

      // Custom Store Icon
      const storeIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="background:#312e81; color:white; width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(0,0,0,0.25); border:2px solid white; font-size:16px;">
            🏬
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      // Custom Customer Home Icon
      const homeIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="background:#059669; color:white; width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(0,0,0,0.25); border:2px solid white; font-size:16px;">
            🏠
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      // Custom Moving Rider Icon
      const riderIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="background:#ff6b35; color:white; width:38px; height:38px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 15px rgba(255,107,53,0.4); border:2.5px solid white; font-size:18px; animation: bounce-gentle 1.5s infinite;">
            🛵
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
      });

      L.marker([sLat, sLng], { icon: storeIcon }).addTo(map).bindPopup('<b>Store Location</b><br>Items packed here');
      L.marker([cLat, cLng], { icon: homeIcon }).addTo(map).bindPopup('<b>Your Delivery Address</b>');

      riderMarkerRef.current = L.marker([rLat, rLng], { icon: riderIcon }).addTo(map).bindPopup('<b>Delivery Champion</b><br>Moving toward your address');

      // Draw dashed route line
      polylineRef.current = L.polyline([[sLat, sLng], [cLat, cLng]], {
        color: '#4338ca',
        weight: 3.5,
        opacity: 0.8,
        dashArray: '6, 8',
      }).addTo(map);

      mapInstanceRef.current = map;

      // Fit bounds
      const bounds = L.latLngBounds([[sLat, sLng], [cLat, cLng]]);
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [storeCoord, customerCoord]);

  // Update rider position smoothly
  useEffect(() => {
    if (riderMarkerRef.current && riderCoord) {
      riderMarkerRef.current.setLatLng([riderCoord.lat, riderCoord.lng]);
    }
  }, [riderCoord]);

  return (
    <div className="w-full h-72 sm:h-80 rounded-3xl overflow-hidden border border-slate-200 shadow-inner relative z-0">
      <div ref={mapContainerRef} className="w-full h-full" />
      <div className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] font-extrabold text-slate-700 shadow-md border border-slate-100 flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
        <span>Live GPS Simulation</span>
      </div>
    </div>
  );
}
