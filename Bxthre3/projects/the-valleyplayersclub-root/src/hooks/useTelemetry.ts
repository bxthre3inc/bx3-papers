import { useEffect, useRef, useCallback } from 'react';
import { useSocket } from '../contexts/SocketContext';

interface TelemetryPayload {
  x?: number;
  y?: number;
  velocityX?: number;
  velocityY?: number;
  dwellTime?: number;
  intensity?: number;
  tiltX?: number;
  tiltY?: number;
  accelX?: number;
  accelY?: number;
  accelZ?: number;
  rotAlpha?: number;
  rotBeta?: number;
  rotGamma?: number;
  force?: number;
  radius?: number;
  volume?: number;
  batteryLevel?: number;
  isLowBattery?: boolean;
  elementId?: string;
  isInteractable?: boolean;
}

export const useTelemetry = (userId: string | null) => {
  const { send } = useSocket();
  const lastTapRef = useRef<number>(0);
  const eventsBuffer = useRef<Array<{ type: string; payload: TelemetryPayload; timestamp: string }>>([]);
  const lastMousePos = useRef({ x: 0, y: 0, time: 0 });
  const dwellStartTime = useRef<Record<string, number>>({});

  const flushEvents = useCallback(async () => {
    if (eventsBuffer.current.length === 0 || !userId) return;

    const events = [...eventsBuffer.current];
    eventsBuffer.current = [];

    try {
      send('analytics:log', { userId, events });
    } catch (e) {
      console.error('Telemetry flush error:', e);
    }
  }, [userId, send]);

  useEffect(() => {
    const timer = setInterval(flushEvents, 5000);
    return () => clearInterval(timer);
  }, [flushEvents]);

  const logEvent = useCallback((type: string, payload: TelemetryPayload) => {
    if (!userId) return;

    eventsBuffer.current.push({
      type,
      payload,
      timestamp: new Date().toISOString(),
    });
  }, [userId]);

  // Velocity & Mouse Movement Tracker
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      const dt = now - lastMousePos.current.time;
      if (dt > 100) { // Sample every 100ms
        const dx = e.clientX - lastMousePos.current.x;
        const dy = e.clientY - lastMousePos.current.y;
        
        logEvent('movement', {
          x: e.clientX,
          y: e.clientY,
          velocityX: dx / dt,
          velocityY: dy / dt
        });

        lastMousePos.current = { x: e.clientX, y: e.clientY, time: now };
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [logEvent]);

  // Battery & Biometric Aux Proxy
  useEffect(() => {
    const nav = navigator as unknown as { getBattery?: () => Promise<{ level: number; addEventListener: (t: string, cb: () => void) => void }> };
    if (nav.getBattery) {
      nav.getBattery().then((battery) => {
        const logBattery = () => {
          logEvent('biometric_proxy', {
            batteryLevel: battery.level,
            isLowBattery: battery.level < 0.2
          });
        };
        logBattery();
        battery.addEventListener('levelchange', logBattery);
      });
    }
  }, [logEvent]);

  // Global Click & Dwell Tracker
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const now = Date.now();
      const speed = lastTapRef.current ? now - lastTapRef.current : 0;
      lastTapRef.current = now;

      const target = e.target as HTMLElement;
      const elementKey = target.id || target.className || 'unknown';
      const dwell = dwellStartTime.current[elementKey] ? now - dwellStartTime.current[elementKey] : 0;

      const payload: TelemetryPayload = {
        x: e.clientX,
        y: e.clientY,
        intensity: speed < 200 ? 1 : 0.5,
        dwellTime: dwell,
        elementId: elementKey,
        isInteractable: target.tagName === 'BUTTON' || target.getAttribute('role') === 'button'
      };

      if (speed < 150) logEvent('rage_click', payload);
      else logEvent('tap', payload);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const elementKey = target.id || target.className || 'unknown';
      dwellStartTime.current[elementKey] = Date.now();
    };

    window.addEventListener('mousedown', handleGlobalClick);
    window.addEventListener('mouseover', handleMouseOver);
    
    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      const target = e.target as HTMLElement;
      
      // Cast to object with optional biometric properties
      const t = touch as unknown as { force?: number; radiusX?: number };

      logEvent('mobile_touch_start', {
        x: touch.clientX,
        y: touch.clientY,
        force: t.force || 0,
        radius: t.radiusX || 0,
        elementId: target.id || target.className
      });
    };

    window.addEventListener('touchstart', handleTouchStart);

    return () => {
      window.removeEventListener('mousedown', handleGlobalClick);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('touchstart', handleTouchStart);
    };
  }, [logEvent]);

  // Mobile Kinematics (Device Motion)
  useEffect(() => {
    const handleMotion = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity;
      const rot = e.rotationRate;
      
      // Log significant kinetic spikes (Indicates shaking, jerk, or tilt)
      if (acc && (Math.abs(acc.x || 0) > 15 || Math.abs(acc.y || 0) > 15)) {
        logEvent('kinematics_spike', {
          accelX: acc.x || 0,
          accelY: acc.y || 0,
          accelZ: acc.z || 0,
          rotAlpha: rot?.alpha || 0,
          rotBeta: rot?.beta || 0,
          rotGamma: rot?.gamma || 0
        });
      }
    };

    window.addEventListener('devicemotion', handleMotion);
    return () => window.removeEventListener('devicemotion', handleMotion);
  }, [logEvent]);

  // Device Orientation Tracker
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (Math.abs(e.beta || 0) > 10 || Math.abs(e.gamma || 0) > 10) {
        logEvent('motion', {
          tiltX: e.gamma || 0,
          tiltY: e.beta || 0
        });
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [logEvent]);

  return { logEvent };
};
