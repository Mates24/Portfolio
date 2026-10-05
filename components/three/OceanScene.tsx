'use client'
import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/* ─────────────────────────────────────────────────────────────
   Shared wave function — the GLSL and JS versions must match so
   the boat rides exactly on the particle surface.
   ───────────────────────────────────────────────────────────── */
const WAVE_GLSL = /* glsl */ `
float wave(vec2 p, float t) {
  float h = 0.0;
  h += sin(p.x * 0.16 + t * 0.80) * 0.42;
  h += sin(p.y * 0.21 + t * 0.62) * 0.34;
  h += sin((p.x + p.y) * 0.33 + t * 1.25) * 0.17;
  h += sin((p.x * 0.8 - p.y * 0.6) * 1.1 + t * 1.9) * 0.06;
  return h;
}
`
function wave(x: number, z: number, t: number) {
  return (
    Math.sin(x * 0.16 + t * 0.8) * 0.42 +
    Math.sin(z * 0.21 + t * 0.62) * 0.34 +
    Math.sin((x + z) * 0.33 + t * 1.25) * 0.17 +
    Math.sin((x * 0.8 - z * 0.6) * 1.1 + t * 1.9) * 0.06
  )
}

// Seeded PRNG keeps geometry generation pure/deterministic across renders.
function rng(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const SONAR = new THREE.Color('#5ee7ff')
const DEEP  = new THREE.Color('#123a6b')
const FLARE = new THREE.Color('#ff8a4c')

/* ── Particle ocean ─────────────────────────────────────────── */
function Ocean({ dense, speed }: { dense: boolean; speed: number }) {
  const mat = useRef<THREE.ShaderMaterial>(null)
  const geometry = useMemo(() => {
    const cols = dense ? 190 : 110
    const rows = dense ? 150 : 90
    const W = 90, D = 70
    const pos = new Float32Array(cols * rows * 3)
    const rnd = new Float32Array(cols * rows)
    const random = rng(7)
    let k = 0
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        pos[k * 3]     = (i / (cols - 1) - 0.5) * W
        pos[k * 3 + 1] = 0
        pos[k * 3 + 2] = (j / (rows - 1) - 0.5) * D - 18
        rnd[k] = random()
        k++
      }
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    g.setAttribute('aRnd', new THREE.BufferAttribute(rnd, 1))
    return g
  }, [dense])

  const uniforms = useMemo(() => ({
    uTime:  { value: 0 },
    uSize:  { value: dense ? 58 : 70 },
    uPR:    { value: 1 },
    uDeep:  { value: DEEP },
    uSonar: { value: SONAR },
    uFlare: { value: FLARE },
  }), [dense])

  useFrame((state, dt) => {
    if (!mat.current) return
    mat.current.uniforms.uTime.value += dt * speed
    mat.current.uniforms.uPR.value = state.viewport.dpr
  })

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={/* glsl */ `
          ${WAVE_GLSL}
          uniform float uTime; uniform float uSize; uniform float uPR;
          attribute float aRnd;
          varying float vH; varying float vDist; varying float vRnd; varying float vX;
          void main() {
            vec3 p = position;
            float h = wave(p.xz, uTime);
            p.y += h;
            vH = h; vRnd = aRnd; vX = p.x;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            vDist = -mv.z;
            gl_Position = projectionMatrix * mv;
            gl_PointSize = uSize * uPR * (0.6 + aRnd * 0.6) / vDist;
          }
        `}
        fragmentShader={/* glsl */ `
          uniform vec3 uDeep; uniform vec3 uSonar; uniform vec3 uFlare; uniform float uTime;
          varying float vH; varying float vDist; varying float vRnd; varying float vX;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            if (d > 0.5) discard;
            float core = smoothstep(0.5, 0.0, d);
            float crest = smoothstep(-0.2, 0.75, vH);
            vec3 col = mix(uDeep, uSonar, crest);
            // a warm sunset streak far out on the horizon
            float streak = exp(-pow(vX * 0.09, 2.0)) * smoothstep(18.0, 50.0, vDist);
            col = mix(col, uFlare, streak * 0.75 * crest);
            float twinkle = 0.75 + 0.25 * sin(uTime * 3.0 + vRnd * 40.0);
            float fog = 1.0 - smoothstep(26.0, 62.0, vDist);
            float nearFade = smoothstep(3.0, 9.5, vDist);
            gl_FragColor = vec4(col * 1.25, core * fog * nearFade * (0.45 + crest * 0.85) * twinkle);
          }
        `}
      />
    </points>
  )
}

/* ── Stars ──────────────────────────────────────────────────── */
function Stars({ count = 900 }) {
  const geometry = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const random = rng(42)
    for (let i = 0; i < count; i++) {
      const r = 70 + random() * 20
      const theta = random() * Math.PI * 2
      const phi = random() * Math.PI * 0.42
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.cos(phi) * 0.6 + 2
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta) - 30
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return g
  }, [count])
  return (
    <points geometry={geometry}>
      <pointsMaterial size={1.4} sizeAttenuation={false} color="#bfe9ff" transparent opacity={0.55} depthWrite={false} />
    </points>
  )
}

/* ── Hologram material ──────────────────────────────────────── */
function useHologram(color: THREE.Color, opacity = 1) {
  return useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uColor: { value: color }, uTime: { value: 0 }, uOpacity: { value: opacity } },
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        vertexShader: /* glsl */ `
          varying vec3 vN; varying vec3 vView; varying vec3 vWorld;
          void main() {
            vec4 w = modelMatrix * vec4(position, 1.0);
            vWorld = w.xyz;
            vN = normalize(mat3(modelMatrix) * normal);
            vView = normalize(cameraPosition - w.xyz);
            gl_Position = projectionMatrix * viewMatrix * w;
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor; uniform float uTime; uniform float uOpacity;
          varying vec3 vN; varying vec3 vView; varying vec3 vWorld;
          void main() {
            float fres = pow(1.0 - abs(dot(normalize(vN), normalize(vView))), 2.2);
            float scan = step(0.82, fract(vWorld.y * 9.0 - uTime * 0.9)) * 0.35;
            float a = (0.06 + fres * 0.85 + scan * 0.4) * uOpacity;
            gl_FragColor = vec4(uColor * (0.8 + fres * 1.2), a);
          }
        `,
      }),
    [color, opacity],
  )
}

/* Sail as a subdivided triangle with a belly (luff = tack→head, leech = clew→head). */
function makeSail(tack: THREE.Vector3, head: THREE.Vector3, clew: THREE.Vector3, belly: number, R = 14, C = 10) {
  const pos: number[] = []
  const idx: number[] = []
  for (let r = 0; r <= R; r++) {
    const v = r / R
    const L = tack.clone().lerp(head, v)
    const E = clew.clone().lerp(head, v)
    for (let c = 0; c <= C; c++) {
      const u = c / C
      const p = L.clone().lerp(E, u)
      p.x += belly * (1 - v) * Math.sin(Math.PI * u)
      pos.push(p.x, p.y, p.z)
    }
  }
  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      const a = r * (C + 1) + c, b = a + C + 1
      idx.push(a, b, a + 1, b, b + 1, a + 1)
    }
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setIndex(idx)
  g.computeVertexNormals()
  return g
}

function makeHull(widthSeg: number, heightSeg: number) {
  // Lower half of a sphere, pinched toward a sharp bow.
  const g = new THREE.SphereGeometry(1, widthSeg, heightSeg, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2)
  const p = g.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i)
    const bow = Math.max(z, 0)
    const pinch = 1 - Math.pow(bow, 1.6) * 0.92
    const stern = z < 0 ? 1 - Math.pow(-z, 3) * 0.25 : 1
    p.setXYZ(i, x * 0.62 * pinch * stern, y * 0.48, z * 2.1)
  }
  g.computeVertexNormals()
  return g
}

/* ── Holographic sailboat ───────────────────────────────────── */
function Sailboat({ position, speed, scale = 1 }: { position: [number, number, number]; speed: number; scale?: number }) {
  const group = useRef<THREE.Group>(null)
  const time  = useRef(0)

  const hullMat = useHologram(SONAR, 1)
  const sailMat = useHologram(new THREE.Color('#bff4ff'), 0.9)
  const flagMat = useHologram(FLARE, 1.2)

  const geo = useMemo(() => {
    const hull = makeHull(40, 14)
    const hullWire = new THREE.WireframeGeometry(makeHull(16, 5))
    const main = makeSail(new THREE.Vector3(0, 0.5, 0.25), new THREE.Vector3(0, 3.6, 0.25), new THREE.Vector3(0, 0.55, -1.75), 0.32)
    const jib  = makeSail(new THREE.Vector3(0, 0.3, 2.05), new THREE.Vector3(0, 3.25, 0.32), new THREE.Vector3(0, 0.5, 0.55), 0.22)
    const outline = (pts: number[][]) =>
      new THREE.BufferGeometry().setFromPoints(pts.map((v) => new THREE.Vector3(...(v as [number, number, number]))))
    const mainEdge = outline([[0.05, 0.5, 0.25], [0.05, 3.6, 0.25], [0.12, 0.55, -1.75], [0.05, 0.5, 0.25]])
    const jibEdge  = outline([[0.03, 0.3, 2.05], [0.03, 3.25, 0.32], [0.08, 0.5, 0.55], [0.03, 0.3, 2.05]])
    const deck = new THREE.EdgesGeometry(new THREE.CircleGeometry(1, 40).scale(0.62, 2.1, 1).rotateX(-Math.PI / 2))
    const flag = new THREE.BufferGeometry()
    flag.setAttribute('position', new THREE.Float32BufferAttribute([0, 3.8, 0.25, 0, 3.58, 0.25, 0, 3.69, -0.22], 3))
    flag.computeVertexNormals()
    const edgeMat = (opacity: number) =>
      new THREE.LineBasicMaterial({ color: '#d9f9ff', transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false })
    const mainLine = new THREE.Line(mainEdge, edgeMat(0.9))
    const jibLine  = new THREE.Line(jibEdge, edgeMat(0.75))
    return { hull, hullWire, main, jib, mainLine, jibLine, deck, flag }
  }, [])

  useFrame((_, dt) => {
    time.current += dt * speed
    const t = time.current
    ;[hullMat, sailMat, flagMat].forEach((m) => (m.uniforms.uTime.value = t))
    if (!group.current) return
    const [x, , z] = position
    const h  = wave(x, z, t)
    const hx = wave(x + 0.6, z, t) - wave(x - 0.6, z, t)
    const hz = wave(x, z + 0.6, t) - wave(x, z - 0.6, t)
    group.current.position.y = position[1] + h * 0.9
    group.current.rotation.z = -hx * 0.4 + 0.06 // heel
    group.current.rotation.x = hz * 0.5
  })

  return (
    <group position={position} scale={scale}>
      <group ref={group}>
        <group rotation={[0, -0.95, 0]}>
          <mesh geometry={geo.hull} material={hullMat} />
          <lineSegments geometry={geo.hullWire}>
            <lineBasicMaterial color="#5ee7ff" transparent opacity={0.18} blending={THREE.AdditiveBlending} depthWrite={false} />
          </lineSegments>
          <lineSegments geometry={geo.deck}>
            <lineBasicMaterial color="#5ee7ff" transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} />
          </lineSegments>
          {/* mast + boom */}
          <mesh position={[0, 1.9, 0.25]} material={hullMat}>
            <cylinderGeometry args={[0.022, 0.03, 3.8, 8]} />
          </mesh>
          <mesh position={[0, 0.52, -0.75]} rotation={[Math.PI / 2, 0, 0]} material={hullMat}>
            <cylinderGeometry args={[0.02, 0.02, 2.0, 6]} />
          </mesh>
          <group rotation={[0, 0.22, 0]}>
            <mesh geometry={geo.main} material={sailMat} />
            <primitive object={geo.mainLine} />
          </group>
          <group rotation={[0, 0.14, 0]}>
            <mesh geometry={geo.jib} material={sailMat} />
            <primitive object={geo.jibLine} />
          </group>
          <mesh geometry={geo.flag} material={flagMat} />
          <pointLight position={[0, 3.9, 0.25]} color="#ff8a4c" intensity={2} distance={3} />
        </group>
      </group>
      {/* glow halo on the water */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <circleGeometry args={[2.6, 48]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexShader={`varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`}
          fragmentShader={`varying vec2 vUv; void main(){ float d = length(vUv - 0.5) * 2.0; gl_FragColor = vec4(0.37, 0.9, 1.0, pow(1.0 - d, 3.0) * 0.18); }`}
        />
      </mesh>
    </group>
  )
}

/* ── Camera rig: mouse parallax + scroll dolly ──────────────── */
function Rig({ pointer, mobile }: { pointer: React.RefObject<{ x: number; y: number }>; mobile: boolean }) {
  const look = useMemo(() => new THREE.Vector3(), [])
  useFrame(({ camera }) => {
    const p = pointer.current ?? { x: 0, y: 0 }
    const s = Math.min(window.scrollY / window.innerHeight, 1.2)
    const tx = p.x * 1.4
    const ty = 2.1 - p.y * 0.6 + s * 2.2
    const tz = 9.5 - s * 3.5
    camera.position.x += (tx - camera.position.x) * 0.04
    camera.position.y += (ty - camera.position.y) * 0.04
    camera.position.z += (tz - camera.position.z) * 0.04
    // On phones the copy sits low, so aim the camera down to lift the horizon into the empty top half.
    look.set(p.x * 0.4, (mobile ? -1.6 : 0.9) - s * 0.6, -4)
    camera.lookAt(look)
  })
  return null
}

export default function OceanScene({ active }: { active: boolean }) {
  const pointer = useRef({ x: 0, y: 0 })
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const speed = reduce ? 0.25 : 1

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = e.clientX / window.innerWidth - 0.5
      pointer.current.y = e.clientY / window.innerHeight - 0.5
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 2.1, 9.5], fov: isMobile ? 62 : 48, near: 0.1, far: 200 }}
    >
      <Stars count={isMobile ? 500 : 900} />
      <Ocean dense={!isMobile} speed={speed} />
      <Sailboat position={isMobile ? [0.9, 0.15, -3.5] : [4.2, 0.15, -1.2]} scale={isMobile ? 0.8 : 0.82} speed={speed} />
      <Rig pointer={pointer} mobile={isMobile} />
    </Canvas>
  )
}
