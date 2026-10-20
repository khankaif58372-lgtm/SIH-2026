import React, { useEffect, useState, useRef, Component, ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

import { AICore, STATE_TARGETS } from '../3d/AICore'
import { OrbitalParticles, AmbientParticles } from '../3d/Particles'
import { useAppStore } from '../../store/useAppStore'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

class CanvasErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.warn('Canvas 3D rendering fallback activated:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}

interface MasterSceneRigProps {
  reducedMotion?: boolean
  isDarkMode?: boolean
}

function MasterSceneRig({ reducedMotion = false }: MasterSceneRigProps) {
  const coreGroupRef = useRef<THREE.Group>(null!)

  useFrame((state, delta) => {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight)
    const scrollProgress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1)

    let targetCamX = 0.0
    let targetCamY = 0.0
    let targetCamZ = 8.2

    if (!reducedMotion) {
      targetCamX = state.pointer.x * 0.35
      targetCamY = state.pointer.y * 0.25
    }

    if (scrollProgress < 0.35) {
      const t = scrollProgress / 0.35
      targetCamZ = THREE.MathUtils.lerp(8.2, 7.6, t)
      targetCamY += THREE.MathUtils.lerp(0.0, -0.2, t)
    } else if (scrollProgress < 0.7) {
      const t = (scrollProgress - 0.35) / 0.35
      targetCamZ = THREE.MathUtils.lerp(7.6, 9.0, t)
      targetCamY += THREE.MathUtils.lerp(-0.2, 0.4, t)
    } else {
      const t = (scrollProgress - 0.7) / 0.3
      targetCamZ = THREE.MathUtils.lerp(9.0, 7.8, t)
      targetCamY += THREE.MathUtils.lerp(0.4, 0.8, t)
    }

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetCamX, delta * 3)
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetCamY, delta * 3)
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetCamZ, delta * 3)
    state.camera.lookAt(0, 0, 0)

    if (coreGroupRef.current) {
      let coreTargetY = 0.0
      let coreTargetScale = 1.0

      if (scrollProgress < 0.35) {
        coreTargetY = 0.0
        coreTargetScale = 1.0
      } else if (scrollProgress < 0.7) {
        coreTargetY = 0.8
        coreTargetScale = 0.75
      } else {
        coreTargetY = 1.4
        coreTargetScale = 0.65
      }

      coreGroupRef.current.position.y = THREE.MathUtils.lerp(coreGroupRef.current.position.y, coreTargetY, delta * 3)
      coreGroupRef.current.scale.lerp(new THREE.Vector3(coreTargetScale, coreTargetScale, coreTargetScale), delta * 3)
    }
  })

  return (
    <group ref={coreGroupRef} position={[0, 0, 0]}>
      <AICore
        state={useAppStore.getState().assistantState.mode}
        scale={1}
        reducedMotion={reducedMotion}
      />
    </group>
  )
}

export function LandingCanvas() {
  const { isDarkMode, assistantState } = useAppStore()
  const activeState = assistantState.mode
  const targetConfig = STATE_TARGETS[activeState] ?? STATE_TARGETS.idle

  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const FallbackAura = (
    <div
      className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full blur-[140px] pointer-events-none"
      style={{
        background: isDarkMode
          ? 'radial-gradient(ellipse at center, rgba(6,182,212,0.12) 0%, rgba(139,92,246,0.08) 50%, transparent 80%)'
          : 'radial-gradient(ellipse at center, rgba(6,182,212,0.08) 0%, rgba(139,92,246,0.05) 50%, transparent 80%)',
      }}
    />
  )

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      <CanvasErrorBoundary fallback={FallbackAura}>
        <Canvas
          camera={{ position: [0, 0, 8.2], fov: 42 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
            stencil: false,
            depth: true,
          }}
          dpr={[1, 1.5]}
        >
          {isDarkMode ? (
            <>
              <ambientLight intensity={0.4} color="#14141c" />
              <directionalLight position={[6, 8, 6]} intensity={1.2} color="#06b6d4" />
              <pointLight position={[-6, -3, -4]} intensity={0.8} color="#8b5cf6" />
              <pointLight position={[0, -5, 4]} intensity={0.4} color="#3b82f6" />
            </>
          ) : (
            <>
              <ambientLight intensity={0.7} color="#fafaf9" />
              <directionalLight position={[6, 8, 6]} intensity={1.6} color="#fff7ed" />
              <pointLight position={[-6, -3, -4]} intensity={0.9} color="#e0e7ff" />
              <pointLight position={[0, -5, 4]} intensity={0.5} color="#f3e8ff" />
            </>
          )}

          <MasterSceneRig reducedMotion={reducedMotion} isDarkMode={isDarkMode} />

          <OrbitalParticles
            state={activeState}
            primaryColor={targetConfig.primary}
            reducedMotion={reducedMotion}
          />

          <AmbientParticles count={35} reducedMotion={reducedMotion} />

          <EffectComposer multisampling={0}>
            <Bloom
              luminanceThreshold={isDarkMode ? 0.6 : 0.75}
              luminanceSmoothing={0.85}
              mipmapBlur
              intensity={isDarkMode ? 0.5 : 0.3}
            />
          </EffectComposer>
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  )
}
