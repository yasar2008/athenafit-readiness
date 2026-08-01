import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Play, Square, Navigation, MapPin, Activity, Flame, ShieldAlert, Award, Clock, Heart 
} from "lucide-react";
import { toast } from "sonner";

// Pre-defined scenic track coordinates for simulation (Central Park Loop representation)
const SIMULATED_TRACK = [
  [40.785091, -73.968285],
  [40.784501, -73.967000],
  [40.783100, -73.966200],
  [40.781800, -73.965800],
  [40.780100, -73.965100],
  [40.778800, -73.965500],
  [40.777000, -73.966900],
  [40.776100, -73.968000],
  [40.776800, -73.969800],
  [40.778200, -73.971200],
  [40.780000, -73.971900],
  [40.781900, -73.971500],
  [40.783501, -73.970285],
  [40.785091, -73.968285]
];

const LiveRouteTracker = () => {
  const mapRef = useRef<any>(null);
  const pathRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const watchIdRef = useRef<number | null>(null);
  const timerIdRef = useRef<any>(null);
  const simIndexRef = useRef<number>(0);

  const [isTracking, setIsTracking] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  
  // Tracking metrics
  const [duration, setDuration] = useState(0); // in seconds
  const [distance, setDistance] = useState(0); // in kilometers
  const [heartRate, setHeartRate] = useState(72); // in bpm
  const [calories, setCalories] = useState(0); // active kcal
  const [gpsSupported, setGpsSupported] = useState(true);

  // Initialize Map on mount
  useEffect(() => {
    // Check if Geolocation exists
    if (!navigator.geolocation) {
      setGpsSupported(false);
    }

    const L = (window as any).L;
    if (!L) return;

    // Build the Leaflet Map
    const map = L.map("live-map", {
      zoomControl: false,
      attributionControl: false
    }).setView([40.785091, -73.968285], 14);

    // Apply dark maps tileset from OpenStreetMap Carto (CartoDB Dark Matter fits perfectly for our sporty dark mode!)
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19
    }).addTo(map);

    // Store references
    mapRef.current = map;
    
    // Add custom zoom control at bottom right
    L.control.zoom({
      position: "bottomright"
    }).addTo(map);

    return () => {
      stopAllTracking();
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, []);

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const calculatePace = () => {
    if (distance === 0) return "00:00";
    const totalMinutes = duration / 60;
    const paceDecimal = totalMinutes / distance;
    const paceMins = Math.floor(paceDecimal);
    const paceSecs = Math.round((paceDecimal - paceMins) * 60);
    return `${paceMins.toString().padStart(2, "0")}:${paceSecs.toString().padStart(2, "0")}`;
  };

  const stopAllTracking = () => {
    // Clear Geolocation position watcher
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    // Clear simulation/timer intervals
    if (timerIdRef.current) {
      clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    }
    setIsTracking(false);
    setIsSimulating(false);
  };

  const startGpsTracking = () => {
    const L = (window as any).L;
    if (!L || !mapRef.current) return;

    stopAllTracking();
    setIsTracking(true);
    setDuration(0);
    setDistance(0);
    setCalories(0);
    setHeartRate(80);

    const map = mapRef.current;
    let coordinateList: any[] = [];

    // Clear previous layers
    if (pathRef.current) map.removeLayer(pathRef.current);
    if (markerRef.current) map.removeLayer(markerRef.current);

    // Set up path line and pulsing marker
    pathRef.current = L.polyline([], { color: "#10B981", weight: 4, opacity: 0.85 }).addTo(map);
    markerRef.current = L.circleMarker([0, 0], {
      radius: 7,
      color: "#0B0F13",
      fillColor: "#10B981",
      fillOpacity: 1,
      weight: 2
    }).addTo(map);

    // Start timer increment
    timerIdRef.current = setInterval(() => {
      setDuration((prev) => {
        const nextTime = prev + 1;
        // Simulate calorie burn based on distance/time
        setCalories(Math.round(nextTime * 0.12));
        return nextTime;
      });
    }, 1000);

    // Watch position
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        const latlng = [latitude, longitude];

        // Zoom map and update marker location
        map.setView(latlng, 16);
        markerRef.current.setLatLng(latlng);

        // Add coordinate to polyline path
        coordinateList.push(latlng);
        pathRef.current.setLatLngs(coordinateList);

        // Compute simulated running metrics
        if (coordinateList.length > 1) {
          const prev = coordinateList[coordinateList.length - 2];
          const distIncrement = calculateDistance(prev[0], prev[1], latitude, longitude);
          setDistance((d) => Number((d + distIncrement).toFixed(2)));
          // Increase HR relative to movement
          setHeartRate((hr) => Math.min(165, Math.max(110, hr + Math.round(Math.random() * 6 - 3))));
        } else {
          setHeartRate(115);
        }
      },
      (err) => {
        toast.error("GPS Signal Timeout. Switching to simulation mode.");
        stopAllTracking();
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );

    toast.success("GPS tracking activated. Get moving!");
  };

  const startRouteSimulation = () => {
    const L = (window as any).L;
    if (!L || !mapRef.current) return;

    stopAllTracking();
    setIsSimulating(true);
    setDuration(0);
    setDistance(0);
    setCalories(0);
    setHeartRate(72);
    simIndexRef.current = 0;

    const map = mapRef.current;
    
    // Clear old layers
    if (pathRef.current) map.removeLayer(pathRef.current);
    if (markerRef.current) map.removeLayer(markerRef.current);

    // Zoom to simulation starting coordinate
    map.setView(SIMULATED_TRACK[0], 15);

    // Create polyline and pulsing marker layers
    pathRef.current = L.polyline([], { color: "#0ea5e9", weight: 4, opacity: 0.9 }).addTo(map);
    
    markerRef.current = L.circleMarker(SIMULATED_TRACK[0], {
      radius: 8,
      color: "#0B0F13",
      fillColor: "#0ea5e9",
      fillOpacity: 1,
      weight: 2
    }).addTo(map);

    let coordsAccumulator: any[] = [];

    // Run simulation loop (update runner location every 2.5 seconds)
    timerIdRef.current = setInterval(() => {
      setDuration((prev) => {
        const nextTime = prev + 3; // Step counts 3 seconds
        setCalories(Math.round(nextTime * 0.15));
        return nextTime;
      });

      const nextCoord = SIMULATED_TRACK[simIndexRef.current];
      markerRef.current.setLatLng(nextCoord);
      map.panTo(nextCoord);

      coordsAccumulator.push(nextCoord);
      pathRef.current.setLatLngs(coordsAccumulator);

      // Increment Distance
      if (simIndexRef.current > 0) {
        const prev = SIMULATED_TRACK[simIndexRef.current - 1];
        const stepDist = calculateDistance(prev[0], prev[1], nextCoord[0], nextCoord[1]);
        setDistance((d) => Number((d + stepDist).toFixed(2)));
        setHeartRate((hr) => Math.min(155, Math.max(125, hr + Math.round(Math.random() * 8 - 3))));
      } else {
        setHeartRate(128);
      }

      // Cycle indexes
      simIndexRef.current = (simIndexRef.current + 1) % SIMULATED_TRACK.length;
    }, 2500);

    toast.info("Scenic Central Park trail simulation started!");
  };

  // Haversine formula helper to calculate distance
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <div className="glass-card rounded-2xl p-6 border border-border/50 bg-background/95 w-full flex flex-col gap-6 fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <h3 className="font-serif text-title">Live GPS Running Tracker</h3>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Log your outdoor runs or test using our scenic simulation.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {!(isTracking || isSimulating) ? (
            <>
              <Button 
                onClick={startGpsTracking} 
                disabled={!gpsSupported}
                size="sm" 
                variant="hero" 
                className="text-xs uppercase tracking-wide font-serif py-4 flex items-center gap-1.5"
              >
                <Navigation className="h-3.5 w-3.5" />
                Start Outdoor Track
              </Button>
              <Button 
                onClick={startRouteSimulation} 
                size="sm" 
                variant="outline" 
                className="text-xs uppercase tracking-wide font-serif py-4 hover:bg-muted"
              >
                <Play className="h-3.5 w-3.5" />
                Simulate Route
              </Button>
            </>
          ) : (
            <Button 
              onClick={stopAllTracking} 
              size="sm" 
              variant="outline" 
              className="text-xs uppercase tracking-wide font-serif py-4 border-destructive/30 hover:bg-destructive/10 text-destructive flex items-center gap-1.5"
            >
              <Square className="h-3.5 w-3.5 fill-destructive" />
              Stop Tracking
            </Button>
          )}
        </div>
      </div>

      {/* METRICS HUD GRID */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        
        {/* Metric: Duration */}
        <div className="p-3 bg-muted/30 border border-border/30 rounded-xl flex flex-col justify-center">
          <span className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
            <Clock className="h-3 w-3 text-info" /> Time
          </span>
          <span className="font-mono text-lg font-bold text-foreground mt-1">
            {formatTime(duration)}
          </span>
        </div>

        {/* Metric: Distance */}
        <div className="p-3 bg-muted/30 border border-border/30 rounded-xl flex flex-col justify-center">
          <span className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
            <MapPin className="h-3 w-3 text-primary" /> Distance
          </span>
          <span className="font-mono text-lg font-bold text-foreground mt-1">
            {distance} <span className="text-[10px] text-muted-foreground uppercase">km</span>
          </span>
        </div>

        {/* Metric: Pace */}
        <div className="p-3 bg-muted/30 border border-border/30 rounded-xl flex flex-col justify-center">
          <span className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
            <Activity className="h-3 w-3 text-success" /> Pace
          </span>
          <span className="font-mono text-lg font-bold text-foreground mt-1">
            {calculatePace()} <span className="text-[10px] text-muted-foreground">/km</span>
          </span>
        </div>

        {/* Metric: Heart Rate */}
        <div className="p-3 bg-muted/30 border border-border/30 rounded-xl flex flex-col justify-center">
          <span className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
            <Heart className="h-3 w-3 text-destructive animate-pulse" /> Pulse
          </span>
          <span className="font-mono text-lg font-bold text-foreground mt-1 flex items-baseline gap-1">
            {isTracking || isSimulating ? heartRate : "--"}
            <span className="text-[10px] text-muted-foreground uppercase font-sans">bpm</span>
          </span>
        </div>

        {/* Metric: Calories */}
        <div className="p-3 bg-muted/30 border border-border/30 rounded-xl flex flex-col justify-center col-span-2 md:col-span-1">
          <span className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
            <Flame className="h-3 w-3 text-warning animate-bounce" /> Energy
          </span>
          <span className="font-mono text-lg font-bold text-foreground mt-1">
            {calories} <span className="text-[10px] text-muted-foreground uppercase font-sans">kcal</span>
          </span>
        </div>

      </div>

      {/* MAP CANVAS */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-border/50 shadow-inner">
        <div id="live-map" className="h-[350px] w-full bg-[#0B0F13]"></div>
        
        {/* Status Badge overlay */}
        <div className="absolute top-4 left-4 z-[400]">
          {isTracking && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success/15 border border-success/30 text-[10px] font-bold text-success uppercase tracking-wider animate-pulse shadow-glow">
              ● Live GPS Tracking Active
            </span>
          )}
          {isSimulating && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-info/15 border border-info/30 text-[10px] font-bold text-info uppercase tracking-wider animate-pulse shadow-glow">
              ● Simulating Route Trail
            </span>
          )}
          {!(isTracking || isSimulating) && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted/80 border border-border/40 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              ● Signal Standby
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveRouteTracker;
