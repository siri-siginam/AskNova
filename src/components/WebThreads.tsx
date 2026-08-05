import React, { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle, Color } from 'ogl';

export interface WebThreadsProps {
  color1?: string;
  color2?: string;
  color3?: string;
  speed?: number;
  threadCount?: number;
  frequency?: number;
  spread?: number;
  taper?: number;
  position?: number;
  fanMode?: 'center' | 'left' | 'right' | 'top' | 'bottom';
  glow?: number;
  falloff?: number;
  thickness?: number;
  brightness?: number;
  opacity?: number;
  mirror?: boolean;
  shimmer?: boolean;
  grain?: boolean;
  grainIntensity?: number;
  mouseInteraction?: boolean;
  mouseStrength?: number;
  className?: string;
  style?: React.CSSProperties;
}

function hexToRgb(hex: string): [number, number, number] {
  const c = hex.replace('#', '');
  if (c.length === 3) {
    return [
      parseInt(c[0] + c[0], 16) / 255,
      parseInt(c[1] + c[1], 16) / 255,
      parseInt(c[2] + c[2], 16) / 255,
    ];
  }
  if (c.length >= 6) {
    return [
      parseInt(c.substring(0, 2), 16) / 255,
      parseInt(c.substring(2, 4), 16) / 255,
      parseInt(c.substring(4, 6), 16) / 255,
    ];
  }
  return [0.32, 0.15, 1.0];
}

const vertexShader = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform float iTime;
uniform vec2 iResolution;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uSpeed;
uniform float uThreadCount;
uniform float uFrequency;
uniform float uSpread;
uniform float uTaper;
uniform float uPosition;
uniform float uGlow;
uniform float uFalloff;
uniform float uThickness;
uniform float uBrightness;
uniform float uOpacity;
uniform bool uMirror;
uniform bool uShimmer;
uniform bool uGrain;
uniform float uGrainIntensity;
uniform vec2 uMouse;
uniform float uMouseStrength;

float rand(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    vec2 st = (gl_FragCoord.xy - 0.5 * iResolution.xy) / min(iResolution.x, iResolution.y);

    if (uMirror && st.x < 0.0) {
        st.x = -st.x;
    }

    float time = iTime * uSpeed;
    vec2 mouseOffset = (uMouse - 0.5) * uMouseStrength;

    vec3 finalColor = vec3(0.0);
    float totalAlpha = 0.0;

    int count = int(clamp(uThreadCount, 1.0, 30.0));
    for (int i = 0; i < 30; i++) {
        if (i >= count) break;
        float fi = float(i) / max(1.0, uThreadCount - 1.0);
        
        float offset = (fi - 0.5) * uSpread + (uPosition - 0.5);
        
        float x = st.x + mouseOffset.x * (1.0 - abs(st.y));
        float wave = sin(x * uFrequency + time * 2.0 + fi * 6.28318) * 0.15;
        wave += cos(x * uFrequency * 0.5 - time * 1.5 + fi * 3.14159) * 0.1;

        float dist = abs(st.y - (offset + wave + mouseOffset.y));

        float taperFactor = pow(1.0 - clamp(abs(st.x) * 0.8, 0.0, 1.0), uTaper);
        
        float lineThick = uThickness * 0.005 * taperFactor;
        float lineCore = smoothstep(lineThick, 0.0, dist);
        float lineGlow = exp(-dist * (1.0 / max(0.001, uGlow + 0.01))) * uFalloff;

        float intensity = lineCore + lineGlow * 0.6;
        intensity *= taperFactor;

        if (uShimmer) {
            intensity *= 0.8 + 0.2 * sin(time * 5.0 + fi * 10.0 + st.x * 20.0);
        }

        vec3 threadColor = mix(uColor1, uColor2, fi);
        if (fi > 0.5) {
            threadColor = mix(uColor2, uColor3, (fi - 0.5) * 2.0);
        }

        finalColor += threadColor * intensity;
        totalAlpha += intensity;
    }

    finalColor *= uBrightness;

    if (uGrain) {
        float n = (rand(uv + fract(iTime)) - 0.5) * uGrainIntensity;
        finalColor += n;
    }

    float alpha = clamp(totalAlpha, 0.0, 1.0) * uOpacity;
    gl_FragColor = vec4(finalColor, alpha);
}
`;

export const WebThreads: React.FC<WebThreadsProps> = ({
  color1 = '#5227FF',
  color2 = '#FF9FFC',
  color3 = '#FFFFFF',
  speed = 0.2,
  threadCount = 6,
  frequency = 5,
  spread = 0.18,
  taper = 1,
  position = 0.5,
  fanMode = 'center',
  glow = 0.02,
  falloff = 0.6,
  thickness = 1.1,
  brightness = 0.6,
  opacity = 1,
  mirror = true,
  shimmer = false,
  grain = true,
  grainIntensity = 0.05,
  mouseInteraction = true,
  mouseStrength = 0.3,
  className = '',
  style = {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: Renderer | null = new Renderer({ alpha: true, dpr: Math.min(window.devicePixelRatio, 2) });
    let gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const geometry = new Triangle(gl);

    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    const rgb3 = hexToRgb(color3);

    let program: Program | null = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Color(gl.canvas.width, gl.canvas.height, 0) },
        uColor1: { value: new Color(...rgb1) },
        uColor2: { value: new Color(...rgb2) },
        uColor3: { value: new Color(...rgb3) },
        uSpeed: { value: speed },
        uThreadCount: { value: threadCount },
        uFrequency: { value: frequency },
        uSpread: { value: spread },
        uTaper: { value: taper },
        uPosition: { value: position },
        uGlow: { value: glow },
        uFalloff: { value: falloff },
        uThickness: { value: thickness },
        uBrightness: { value: brightness },
        uOpacity: { value: opacity },
        uMirror: { value: mirror },
        uShimmer: { value: shimmer },
        uGrain: { value: grain },
        uGrainIntensity: { value: grainIntensity },
        uMouse: { value: new Float32Array([0.5, 0.5]) },
        uMouseStrength: { value: mouseStrength },
      },
    });

    let mesh: Mesh | null = new Mesh(gl, { geometry, program });

    const canvas = gl.canvas as HTMLCanvasElement;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';

    container.appendChild(canvas);

    let currentMouse = [0.5, 0.5];
    let targetMouse = [0.5, 0.5];

    const resize = () => {
      if (!container || !renderer || !program) return;
      const { clientWidth, clientHeight } = container;
      const w = clientWidth || window.innerWidth;
      const h = clientHeight || window.innerHeight;
      renderer.setSize(w, h);
      program.uniforms.iResolution.value.r = w;
      program.uniforms.iResolution.value.g = h;
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      targetMouse = [x, y];
    };

    const handleMouseLeave = () => {
      targetMouse = [0.5, 0.5];
    };

    window.addEventListener('resize', resize);
    if (mouseInteraction) {
      window.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('mouseleave', handleMouseLeave);
    }

    resize();

    let animationId: number;

    const update = (t: number) => {
      if (!program || !renderer || !mesh) return;

      if (mouseInteraction) {
        const smoothing = 0.05;
        currentMouse[0] += smoothing * (targetMouse[0] - currentMouse[0]);
        currentMouse[1] += smoothing * (targetMouse[1] - currentMouse[1]);
        program.uniforms.uMouse.value[0] = currentMouse[0];
        program.uniforms.uMouse.value[1] = currentMouse[1];
      }

      program.uniforms.iTime.value = t * 0.001;
      program.uniforms.uColor1.value.set(...hexToRgb(color1));
      program.uniforms.uColor2.value.set(...hexToRgb(color2));
      program.uniforms.uColor3.value.set(...hexToRgb(color3));
      program.uniforms.uSpeed.value = speed;
      program.uniforms.uThreadCount.value = threadCount;
      program.uniforms.uFrequency.value = frequency;
      program.uniforms.uSpread.value = spread;
      program.uniforms.uTaper.value = taper;
      program.uniforms.uPosition.value = position;
      program.uniforms.uGlow.value = glow;
      program.uniforms.uFalloff.value = falloff;
      program.uniforms.uThickness.value = thickness;
      program.uniforms.uBrightness.value = brightness;
      program.uniforms.uOpacity.value = opacity;
      program.uniforms.uMirror.value = mirror;
      program.uniforms.uShimmer.value = shimmer;
      program.uniforms.uGrain.value = grain;
      program.uniforms.uGrainIntensity.value = grainIntensity;
      program.uniforms.uMouseStrength.value = mouseStrength;

      renderer.render({ scene: mesh });
      animationId = requestAnimationFrame(update);
    };

    animationId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (container) {
        container.removeEventListener('mouseleave', handleMouseLeave);
        if (canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
      }
      if (gl) {
        gl.getExtension('WEBGL_lose_context')?.loseContext();
      }
      renderer = null;
      gl = null;
      program = null;
      mesh = null;
    };
  }, [
    color1,
    color2,
    color3,
    speed,
    threadCount,
    frequency,
    spread,
    taper,
    position,
    fanMode,
    glow,
    falloff,
    thickness,
    brightness,
    opacity,
    mirror,
    shimmer,
    grain,
    grainIntensity,
    mouseInteraction,
    mouseStrength,
  ]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full relative pointer-events-none ${className}`}
      style={style}
    />
  );
};
