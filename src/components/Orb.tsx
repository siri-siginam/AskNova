import React, { useEffect, useRef } from 'react';
import { Renderer, Program, Mesh, Triangle } from 'ogl';

interface OrbProps {
  hue?: number;
  hoverIntensity?: number;
  rotateOnHover?: boolean;
  forceHoverState?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const vert = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
}
`;

const frag = `
precision highp float;

uniform float uTime;
uniform float uHue;
uniform float uHover;
uniform float uHoverIntensity;
uniform vec2 uResolution;
uniform vec2 uMouse;

varying vec2 vUv;

// Cosine based palette generator
vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ) {
    return a + b*cos( 6.28318*(c*t+d) );
}

// Simplex Noise 3D implementation
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + D.xxxx;
  vec4 y = y_ * ns.x + D.xxxx;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

void main() {
    vec2 st = (gl_FragCoord.xy - 0.5 * uResolution.xy) / min(uResolution.x, uResolution.y);
    float dist = length(st);

    float radius = 0.42;
    float alpha = smoothstep(radius + 0.06, radius - 0.02, dist);

    if (alpha <= 0.001) {
        discard;
    }

    float hover = uHover * uHoverIntensity;
    float time = uTime * (0.35 + hover * 0.75);

    vec3 pos = vec3(st * 2.8, time * 0.4);
    float noiseVal = snoise(pos + vec3(uMouse * hover * 1.5, time * 0.2));
    float detailNoise = snoise(pos * 2.2 + vec3(noiseVal));

    float hueRad = uHue * 3.14159265 / 180.0;
    vec3 baseColor = vec3(0.5, 0.5, 0.5);
    vec3 amp = vec3(0.5, 0.5, 0.5);
    vec3 freq = vec3(1.0, 1.0, 1.0);
    vec3 phase = vec3(hueRad / 6.28, (hueRad + 2.094) / 6.28, (hueRad + 4.188) / 6.28);

    vec3 col = palette(dist * 1.8 + noiseVal * 0.45 + detailNoise * 0.25, baseColor, amp, freq, phase);

    float rim = 1.0 - smoothstep(0.0, radius, dist);
    col += vec3(0.25, 0.2, 0.4) * pow(rim, 2.5);
    col += vec3(0.35, 0.45, 0.6) * (noiseVal * 0.5 + 0.5) * hover;

    vec2 lightPos = vec2(-0.12, 0.12) + uMouse * 0.15;
    float highlight = smoothstep(0.22, 0.0, length(st - lightPos));
    col += vec3(0.9, 0.95, 1.0) * highlight * 0.35;

    gl_FragColor = vec4(col, alpha * (0.85 + 0.15 * rim));
}
`;

export const Orb: React.FC<OrbProps> = ({
  hue = 0,
  hoverIntensity = 0.2,
  rotateOnHover = true,
  forceHoverState = false,
  className = '',
  style = {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetHoverRef = useRef<number>(forceHoverState ? 1 : 0);
  const currentHoverRef = useRef<number>(forceHoverState ? 1 : 0);

  useEffect(() => {
    targetHoverRef.current = forceHoverState ? 1 : 0;
  }, [forceHoverState]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({ alpha: true, dpr: Math.min(window.devicePixelRatio, 2) });
    const gl = renderer.gl;
    container.appendChild(gl.canvas);

    gl.clearColor(0, 0, 0, 0);

    const geometry = new Triangle(gl);

    const program = new Program(gl, {
      vertex: vert,
      fragment: frag,
      uniforms: {
        uTime: { value: 0 },
        uHue: { value: hue },
        uHover: { value: currentHoverRef.current },
        uHoverIntensity: { value: hoverIntensity },
        uResolution: { value: [container.clientWidth || 1080, container.clientHeight || 1080] },
        uMouse: { value: [0, 0] },
      },
      transparent: true,
    });

    const mesh = new Mesh(gl, { geometry, program });

    function resize() {
      if (!container) return;
      const width = container.clientWidth || 1080;
      const height = container.clientHeight || 1080;
      renderer.setSize(width, height);
      program.uniforms.uResolution.value = [width, height];
    }

    resize();
    window.addEventListener('resize', resize);

    let animationId: number;
    let startTime = performance.now();

    function update(t: number) {
      animationId = requestAnimationFrame(update);

      const elapsed = (t - startTime) * 0.001;
      program.uniforms.uTime.value = elapsed;
      program.uniforms.uHue.value = hue;
      program.uniforms.uHoverIntensity.value = hoverIntensity;

      // Smooth hover interpolation
      currentHoverRef.current += (targetHoverRef.current - currentHoverRef.current) * 0.05;
      program.uniforms.uHover.value = currentHoverRef.current;

      renderer.render({ scene: mesh });
    }

    animationId = requestAnimationFrame(update);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      program.uniforms.uMouse.value = [x, y];
    };

    const handleMouseEnter = () => {
      if (rotateOnHover || hoverIntensity > 0) {
        targetHoverRef.current = 1;
      }
    };

    const handleMouseLeave = () => {
      if (!forceHoverState) {
        targetHoverRef.current = 0;
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      if (gl.canvas.parentNode) {
        gl.canvas.parentNode.removeChild(gl.canvas);
      }
    };
  }, [hue, hoverIntensity, rotateOnHover, forceHoverState]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full relative overflow-hidden ${className}`}
      style={style}
    />
  );
};
