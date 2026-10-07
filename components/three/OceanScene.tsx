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
const SAIL  = new THREE.Color('#bff4ff')

/* ── Particle ocean ─────────────────────────────────────────── */
function Ocean({ dense, speed, moonX }: { dense: boolean; speed: number; moonX: number }) {
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
    uMoon:  { value: new THREE.Color('#dcecff') },
    uMoonX: { value: moonX },
  }), [dense, moonX])

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
          uniform vec3 uDeep; uniform vec3 uSonar; uniform vec3 uMoon; uniform float uMoonX; uniform float uTime;
          varying float vH; varying float vDist; varying float vRnd; varying float vX;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            if (d > 0.5) discard;
            float core = smoothstep(0.5, 0.0, d);
            float crest = smoothstep(-0.2, 0.75, vH);
            vec3 col = mix(uDeep, uSonar, crest);
            // moonlight path on the water, widening toward the viewer
            float width = mix(1.5, 6.0, 1.0 - smoothstep(10.0, 55.0, vDist));
            float streak = exp(-pow((vX - uMoonX * smoothstep(5.0, 55.0, vDist)) / width, 2.0));
            col = mix(col, uMoon, streak * 0.8 * crest);
            float twinkle = 0.75 + 0.25 * sin(uTime * 3.0 + vRnd * 40.0);
            float fog = 1.0 - smoothstep(26.0, 62.0, vDist);
            float nearFade = smoothstep(3.0, 9.5, vDist);
            gl_FragColor = vec4(col * 1.2, core * fog * nearFade * (0.4 + crest * 0.8 + streak * 0.5) * twinkle);
          }
        `}
      />
    </points>
  )
}

/* ── Night sky ───────────────────────────────────────────────
   Real star positions (RA°, Dec°, visual magnitude) for the circumpolar
   constellations you see looking north: Big Dipper, Little Dipper + Polaris,
   Cassiopeia. Projected stereographically around the celestial pole. */
const NORTH_SKY: [number, number, number, number][] = [
  // Ursa Major — Big Dipper (Veľký voz)
  [165.93, 61.75, 1.8, 0.3], [165.46, 56.38, 2.4, 0], [178.46, 53.69, 2.4, 0], [183.86, 57.03, 3.3, 0],
  [193.51, 55.96, 1.8, 0], [200.98, 54.93, 2.2, 0], [206.89, 49.31, 1.9, 0],
  // Ursa Minor — Little Dipper (Malý voz) with Polaris
  [37.95, 89.26, 2.0, 0.15], [263.05, 86.59, 4.4, 0], [251.49, 82.04, 4.2, 0], [236.01, 77.79, 4.3, 0],
  [222.68, 74.16, 2.1, 0.8], [230.18, 71.83, 3.0, 0], [244.38, 75.76, 5.0, 0],
  // Cassiopeia
  [2.29, 59.15, 2.3, 0.1], [10.13, 56.54, 2.2, 0.7], [14.18, 60.72, 2.4, 0], [21.45, 60.24, 2.7, 0], [28.6, 63.67, 3.4, 0],
]

const magToSize = (mag: number) => 12.5 * Math.pow(10, -0.17 * mag)

function Stars({ mobile }: { mobile: boolean }) {
  const mat = useRef<THREE.ShaderMaterial>(null)

  const geometry = useMemo(() => {
    const pos: number[] = [], size: number[] = [], phase: number[] = [], tint: number[] = []
    const random = rng(42)

    // Constellations, placed on a plane far behind the horizon
    // Oriented like an autumn evening: Big Dipper low and level, Cassiopeia high on the other side of Polaris.
    // Placed in the empty sky above the headline, clear of the boat.
    const S = mobile ? 12 : 26
    const cx = mobile ? 3 : -18, cy = mobile ? 19 : 18, z = -72
    const rot = (45 * Math.PI) / 180
    for (const [ra, dec, mag, warm] of NORTH_SKY) {
      const r = 2 * Math.tan(((90 - dec) * Math.PI) / 360)
      const a = (ra * Math.PI) / 180 + rot
      pos.push(cx - r * Math.sin(a) * S, cy + r * Math.cos(a) * S, z)
      size.push(magToSize(mag)); phase.push(random()); tint.push(warm)
    }

    // Faint background stars: most are dim, a few are bright
    const count = mobile ? 450 : 850
    for (let i = 0; i < count; i++) {
      const r = 75 + random() * 15
      const theta = random() * Math.PI * 2
      const phi = random() * Math.PI * 0.44
      pos.push(r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi) * 0.55 + 1, r * Math.sin(phi) * Math.sin(theta) - 30)
      const mag = 6.4 - 3.6 * Math.pow(random(), 5)
      size.push(magToSize(mag)); phase.push(random()); tint.push(random() < 0.15 ? random() * 0.6 : 0)
    }

    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    g.setAttribute('aSize', new THREE.Float32BufferAttribute(size, 1))
    g.setAttribute('aPhase', new THREE.Float32BufferAttribute(phase, 1))
    g.setAttribute('aTint', new THREE.Float32BufferAttribute(tint, 1))
    return g
  }, [mobile])

  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uPR: { value: 1 } }), [])

  useFrame((state, dt) => {
    if (!mat.current) return
    mat.current.uniforms.uTime.value += dt
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
          uniform float uPR;
          attribute float aSize; attribute float aPhase; attribute float aTint;
          varying float vPhase; varying float vTint; varying float vY;
          void main() {
            vPhase = aPhase; vTint = aTint; vY = position.y;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = aSize * 1.7 * uPR;
          }
        `}
        fragmentShader={/* glsl */ `
          uniform float uTime;
          varying float vPhase; varying float vTint; varying float vY;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            if (d > 0.5) discard;
            float core = pow(smoothstep(0.5, 0.0, d), 1.8);
            float twinkle = 0.82 + 0.18 * sin(uTime * (1.2 + vPhase * 2.0) + vPhase * 40.0);
            vec3 col = mix(vec3(0.84, 0.91, 1.0), vec3(1.0, 0.8, 0.6), vTint);
            float haze = smoothstep(0.5, 7.0, vY); // dimmer near the horizon
            gl_FragColor = vec4(col, core * twinkle * haze);
          }
        `}
      />
    </points>
  )
}

/* ── Hologram material ──────────────────────────────────────── */
function useHologram(color: THREE.Color, opacity = 1, seams = 0) {
  return useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uColor: { value: color }, uTime: { value: 0 }, uOpacity: { value: opacity }, uSeams: { value: seams } },
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        vertexShader: /* glsl */ `
          varying vec3 vN; varying vec3 vView; varying vec3 vLocal;
          void main() {
            vec4 w = modelMatrix * vec4(position, 1.0);
            vLocal = position;
            vN = normalize(mat3(modelMatrix) * normal);
            vView = normalize(cameraPosition - w.xyz);
            gl_Position = projectionMatrix * viewMatrix * w;
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor; uniform float uOpacity; uniform float uSeams;
          varying vec3 vN; varying vec3 vView; varying vec3 vLocal;
          void main() {
            float fres = pow(1.0 - abs(dot(normalize(vN), normalize(vView))), 2.2);
            // horizontal sail seams, fixed in the sail's own space (they move with the sail, never scroll)
            float f = fract(vLocal.y * 3.2);
            float seam = uSeams * (1.0 - smoothstep(0.0, 0.06, min(f, 1.0 - f)));
            float a = (0.06 + fres * 0.85 + seam * 0.22) * uOpacity;
            gl_FragColor = vec4(uColor * (0.8 + fres * 1.2), a);
          }
        `,
      }),
    [color, opacity, seams],
  )
}

/* Sail as a subdivided triangle with a belly (luff = tack→head, leech = clew→head).
   `trim` swings the finished sail (e.g. around the mast); the outline is traced from
   the same grid so the glowing edge always sits exactly on the sail. */
function makeSail(
  tack: THREE.Vector3,
  head: THREE.Vector3,
  clew: THREE.Vector3,
  belly: number,
  trim: (p: THREE.Vector3) => THREE.Vector3 = (p) => p,
  R = 14,
  C = 10,
) {
  const grid: THREE.Vector3[] = []
  for (let r = 0; r <= R; r++) {
    const v = r / R
    const L = tack.clone().lerp(head, v)
    const E = clew.clone().lerp(head, v)
    for (let c = 0; c <= C; c++) {
      const u = c / C
      const p = L.clone().lerp(E, u)
      p.x += belly * (1 - v) * Math.sin(Math.PI * u)
      grid.push(trim(p))
    }
  }
  const idx: number[] = []
  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      const a = r * (C + 1) + c, b = a + C + 1
      idx.push(a, b, a + 1, b, b + 1, a + 1)
    }
  }
  const g = new THREE.BufferGeometry().setFromPoints(grid)
  g.setIndex(idx)
  g.computeVertexNormals()

  const at = (r: number, c: number) => grid[r * (C + 1) + c]
  const edge: THREE.Vector3[] = []
  for (let r = 0; r <= R; r++) edge.push(at(r, 0))       // luff, up
  for (let r = R; r >= 0; r--) edge.push(at(r, C))       // leech, down
  for (let c = C; c >= 0; c--) edge.push(at(0, c))       // foot, back to tack
  return { surface: g, outline: new THREE.BufferGeometry().setFromPoints(edge) }
}

const MAST_Z = 0.25
const MAIN_TRIM = 0.22 // boom angle off the centreline
const JIB_TRIM = 0.18

/** Rotate around the mast (vertical axis through z = MAST_Z). */
const aroundMast = (angle: number) => {
  const q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle)
  return (p: THREE.Vector3) => { p.z -= MAST_Z; p.applyQuaternion(q); p.z += MAST_Z; return p }
}
/** Rotate around the line a→b (used for the jib, which pivots on the forestay). */
const aroundLine = (a: THREE.Vector3, b: THREE.Vector3, angle: number) => {
  const q = new THREE.Quaternion().setFromAxisAngle(b.clone().sub(a).normalize(), angle)
  return (p: THREE.Vector3) => p.sub(a).applyQuaternion(q).add(a)
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
const YAW = -0.95       // heading, radians
const FREEBOARD = 0.32  // deck height above the mean surface under the hull
const HEEL = 0.05       // slight lean from the wind
function Sailboat({ position, speed, scale = 1 }: { position: [number, number, number]; speed: number; scale?: number }) {
  const time  = useRef(0)

  const hullMat = useHologram(SONAR, 1.35)
  const sailMat = useHologram(SAIL, 0.9, 1)

  const geo = useMemo(() => {
    const hull = makeHull(40, 14)
    const hullWire = new THREE.WireframeGeometry(makeHull(16, 5))
    // Both sails bulge to leeward (−x), the same side the boom swings to.
    const main = makeSail(
      new THREE.Vector3(0, 0.5, MAST_Z), new THREE.Vector3(0, 3.6, MAST_Z), new THREE.Vector3(0, 0.55, -1.75),
      -0.32, aroundMast(MAIN_TRIM),
    )
    // The jib hangs on the forestay (stemhead → mast), so its luff and tack sit on the rig.
    const stem = new THREE.Vector3(0, 0.03, 1.98)
    const hounds = new THREE.Vector3(0, 3.45, MAST_Z + 0.02)
    const onForestay = (t: number) => stem.clone().lerp(hounds, t)
    const jibTack = onForestay(0.04)
    const jibHead = onForestay(0.93)
    const jibTrim = aroundLine(jibTack, jibHead, JIB_TRIM)
    const jib = makeSail(jibTack, jibHead, new THREE.Vector3(0, 0.32, 0.62), -0.22, jibTrim)

    // Standing and running rigging, as line segment pairs
    const jibClew = jibTrim(new THREE.Vector3(0, 0.32, 0.62))
    const boomEnd = aroundMast(MAIN_TRIM)(new THREE.Vector3(0, 0.52, -1.75))
    const masthead = new THREE.Vector3(0, 3.8, MAST_Z)
    const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z)
    const rigging = new THREE.BufferGeometry().setFromPoints([
      stem, hounds,                                   // forestay
      masthead, V(0, 0.03, -1.95),                    // backstay
      V(0, 3.3, MAST_Z), V(0.56, 0.03, 0.12),         // starboard shroud
      V(0, 3.3, MAST_Z), V(-0.56, 0.03, 0.12),        // port shroud
      jibClew, V(-0.5, 0.03, 0.05),                   // jib sheet to the deck
      boomEnd, V(-0.12, 0.03, -1.55),                 // mainsheet to the cockpit
    ])
    const deckCap = new THREE.CircleGeometry(1, 40).scale(0.61, 2.08, 1).rotateX(-Math.PI / 2)
    // match the hull's pinched bow so the cap doesn't poke out past the outline
    const dp = deckCap.attributes.position as THREE.BufferAttribute
    for (let i = 0; i < dp.count; i++) {
      const zn = dp.getZ(i) / 2.08
      const bow = Math.max(zn, 0)
      const stern = zn < 0 ? 1 - Math.pow(-zn, 3) * 0.25 : 1
      dp.setX(i, dp.getX(i) * (1 - Math.pow(bow, 1.6) * 0.92) * stern)
    }
    const deck = new THREE.EdgesGeometry(deckCap)
    const edgeMat = (opacity: number) =>
      new THREE.LineBasicMaterial({ color: '#d9f9ff', transparent: true, opacity, blending: THREE.AdditiveBlending, depthWrite: false })
    const mainLine = new THREE.Line(main.outline, edgeMat(0.9))
    const jibLine  = new THREE.Line(jib.outline, edgeMat(0.75))
    const rig = new THREE.LineSegments(
      rigging,
      new THREE.LineBasicMaterial({ color: '#a6ecf8', transparent: true, opacity: 0.45, blending: THREE.AdditiveBlending, depthWrite: false }),
    )
    return { hull, hullWire, main: main.surface, jib: jib.surface, mainLine, jibLine, deck, deckCap, rig }
  }, [])

  const float = useRef<THREE.Group>(null)
  const hull  = useRef<THREE.Group>(null)
  const pose  = useRef({ y: 0, pitch: 0, roll: 0 })

  useFrame((_, dt) => {
    time.current += dt * speed
    const t = time.current
    if (!float.current || !hull.current) return

    // Sample the swell under bow, stern and both sides along the boat's own axes,
    // so it pitches and rolls like a hull resting on the water.
    const [x, , z] = position
    const fx = Math.sin(YAW), fz = Math.cos(YAW)   // forward
    const sx = Math.cos(YAW), sz = -Math.sin(YAW)  // starboard (+x local)
    const L = 1.9 * scale, B = 0.6 * scale
    const bow   = wave(x + fx * L, z + fz * L, t)
    const stern = wave(x - fx * L, z - fz * L, t)
    const right = wave(x + sx * B, z + sz * B, t)
    const left  = wave(x - sx * B, z - sz * B, t)
    const mid   = wave(x, z, t)

    const k = 1 - Math.exp(-dt * 2.5)
    const p = pose.current
    p.y     += ((bow + stern + right + left + mid) / 5 + FREEBOARD - p.y) * k
    p.pitch += (-Math.atan2(bow - stern, 2 * L) - p.pitch) * k
    p.roll  += (Math.atan2(right - left, 2 * B) * 0.5 + HEEL - p.roll) * k

    float.current.position.y = p.y / scale // parent group is scaled; wave heights are world units
    hull.current.rotation.set(p.pitch, YAW, p.roll, 'YXZ')
  })

  return (
    <group position={[position[0], 0, position[2]]} scale={scale}>
      <group ref={float}>
        <group ref={hull} rotation={[0, YAW, 0]}>
          {/* Solid inner hull + deck: hides the water behind the boat so it reads as floating */}
          <mesh geometry={geo.hull} renderOrder={-1}>
            <meshBasicMaterial color="#0d2a40" side={THREE.DoubleSide} polygonOffset polygonOffsetFactor={2} polygonOffsetUnits={2} />
          </mesh>
          <mesh geometry={geo.deckCap} renderOrder={-1}>
            <meshBasicMaterial color="#12324a" side={THREE.DoubleSide} polygonOffset polygonOffsetFactor={2} polygonOffsetUnits={2} />
          </mesh>
          <mesh geometry={geo.hull} material={hullMat} />
          <lineSegments geometry={geo.hullWire}>
            <lineBasicMaterial color="#5ee7ff" transparent opacity={0.18} blending={THREE.AdditiveBlending} depthWrite={false} />
          </lineSegments>
          <lineSegments geometry={geo.deck}>
            <lineBasicMaterial color="#5ee7ff" transparent opacity={0.8} blending={THREE.AdditiveBlending} depthWrite={false} />
          </lineSegments>
          {/* mast + boom */}
          <mesh position={[0, 1.9, MAST_Z]} material={hullMat}>
            <cylinderGeometry args={[0.022, 0.03, 3.8, 8]} />
          </mesh>
          {/* boom: pivots at the mast together with the mainsail */}
          <group position={[0, 0.52, MAST_Z]} rotation={[0, MAIN_TRIM, 0]}>
            <mesh position={[0, 0, -1.0]} rotation={[Math.PI / 2, 0, 0]} material={hullMat}>
              <cylinderGeometry args={[0.02, 0.02, 2.0, 6]} />
            </mesh>
          </group>
          <mesh geometry={geo.main} material={sailMat} />
          <primitive object={geo.mainLine} />
          <mesh geometry={geo.jib} material={sailMat} />
          <primitive object={geo.jibLine} />
          <primitive object={geo.rig} />
        </group>
        {/* glow halo on the water */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -FREEBOARD - 0.02, 0]}>
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
    </group>
  )
}

/* ── Moon with a soft halo ──────────────────────────────────── */
function Moon({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <circleGeometry args={[1.5, 48]} />
        <meshBasicMaterial color="#eef5ff" toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, -0.1]}>
        <planeGeometry args={[26, 26]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexShader={`varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`}
          fragmentShader={`varying vec2 vUv; void main(){ float d = length(vUv - 0.5) * 2.0; float a = pow(max(1.0 - d, 0.0), 4.0) * 0.55; gl_FragColor = vec4(0.72, 0.86, 1.0, a); }`}
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
      <Stars mobile={isMobile} />
      <Moon position={isMobile ? [-7, 9.5, -46] : [30, 14, -46]} />
      <Ocean dense={!isMobile} speed={speed} moonX={isMobile ? -7 : 30} />
      <Sailboat position={isMobile ? [0.9, 0.15, -3.5] : [4.2, 0.15, -1.2]} scale={isMobile ? 0.8 : 0.82} speed={speed} />
      <Rig pointer={pointer} mobile={isMobile} />
    </Canvas>
  )
}
