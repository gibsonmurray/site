"use client"

import {
    useEffect,
    useRef,
    useState,
    type KeyboardEvent,
    type PointerEvent,
} from "react"
import { RotateCcw } from "lucide-react"
import * as THREE from "three"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { glowRgb, type GlowColor } from "@/lib/book-glow"
import { type BookModelAssets } from "@/lib/books"
import { cn } from "@/lib/utils"

const BASE_ROTATION = {
    x: -0.1,
    y: 0.46,
}

const clamp = (value: number, min: number, max: number) =>
    Math.max(min, Math.min(max, value))

type DragState = {
    active: boolean
    startX: number
    startY: number
    startRotationX: number
    startRotationY: number
}

type Book3DPreviewProps = {
    assets: BookModelAssets
    alt: string
    glowColor: GlowColor
    glowColorSoft: GlowColor
    hasGlowColor: boolean
    onFrontImageLoad?: (imageElement: HTMLImageElement) => void
}

export function Book3DPreview({
    assets,
    alt,
    glowColor,
    glowColorSoft,
    hasGlowColor,
    onFrontImageLoad,
}: Book3DPreviewProps) {
    const frameRef = useRef<HTMLDivElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationRef = useRef<number | null>(null)
    const rotationRef = useRef({ ...BASE_ROTATION })
    const targetRotationRef = useRef({ ...BASE_ROTATION })
    const dragRef = useRef<DragState>({
        active: false,
        startX: 0,
        startY: 0,
        startRotationX: BASE_ROTATION.x,
        startRotationY: BASE_ROTATION.y,
    })
    const [isReady, setIsReady] = useState(false)
    const [isDragging, setIsDragging] = useState(false)

    useEffect(() => {
        const frame = frameRef.current
        const canvas = canvasRef.current
        if (!frame || !canvas) return

        let isDisposed = false
        let mesh: THREE.Mesh | null = null
        const textures: THREE.Texture[] = []
        const materials: THREE.Material[] = []
        const geometries: THREE.BufferGeometry[] = []

        const renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
        })
        renderer.outputColorSpace = THREE.SRGBColorSpace
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = 0.82
        renderer.setClearColor(0x000000, 0)

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100)
        camera.position.set(0, 0.04, 9.25)

        const group = new THREE.Group()
        scene.add(group)

        const ambient = new THREE.AmbientLight(0xffffff, 1.12)
        scene.add(ambient)

        const keyLight = new THREE.DirectionalLight(0xfff1db, 1.95)
        keyLight.position.set(3.2, 4.8, 5.8)
        scene.add(keyLight)

        const fillLight = new THREE.DirectionalLight(0x9fc7ff, 0.68)
        fillLight.position.set(-4.5, -1.8, 4)
        scene.add(fillLight)

        const rimLight = new THREE.DirectionalLight(0xffffff, 1.45)
        rimLight.position.set(-3, 2.5, -4)
        scene.add(rimLight)

        const shadowGeometry = new THREE.CircleGeometry(1, 64)
        const shadowMaterial = new THREE.MeshBasicMaterial({
            color: 0x000000,
            depthWrite: false,
            transparent: true,
            opacity: 0.24,
        })
        const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial)
        shadow.position.set(0.12, -2.28, -0.72)
        shadow.scale.set(2, 0.33, 1)
        scene.add(shadow)
        geometries.push(shadowGeometry)
        materials.push(shadowMaterial)

        const loader = new THREE.TextureLoader()

        const configureTexture = (
            texture: THREE.Texture,
            crop?: BookModelAssets["frontImageCrop"],
        ) => {
            texture.colorSpace = THREE.SRGBColorSpace
            texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
            texture.minFilter = THREE.LinearMipmapLinearFilter
            texture.magFilter = THREE.LinearFilter
            texture.wrapS = THREE.ClampToEdgeWrapping
            texture.wrapT = THREE.ClampToEdgeWrapping

            const image = texture.image as HTMLImageElement | undefined
            if (crop && image?.width && image?.height) {
                texture.repeat.set(
                    crop.width / image.width,
                    crop.height / image.height,
                )
                texture.offset.set(
                    crop.x / image.width,
                    1 - (crop.y + crop.height) / image.height,
                )
            }

            texture.needsUpdate = true
            textures.push(texture)
            return texture
        }

        const loadTexture = (
            src: string,
            crop?: BookModelAssets["frontImageCrop"],
        ) =>
            new Promise<THREE.Texture>((resolve, reject) => {
                loader.load(
                    src,
                    (texture) => {
                        if (isDisposed) {
                            texture.dispose()
                            return
                        }
                        resolve(configureTexture(texture, crop))
                    },
                    undefined,
                    reject,
                )
            })

        void Promise.all([
            loadTexture(assets.frontImageSrc, assets.frontImageCrop),
            loadTexture(assets.backImageSrc),
            loadTexture(assets.spineImageSrc),
        ])
            .then(([frontTexture, backTexture, spineTexture]) => {
                if (isDisposed) return

                const frontImage = frontTexture.image
                if (frontImage instanceof HTMLImageElement) {
                    onFrontImageLoad?.(frontImage)
                }

                const frontAspect = assets.frontImageCrop
                    ? assets.frontImageCrop.width / assets.frontImageCrop.height
                    : 0.65
                const width = 2.9
                const height = width / frontAspect
                const depth = width * (assets.thicknessRatio ?? 0.17)

                const geometry = new THREE.BoxGeometry(
                    width,
                    height,
                    depth,
                    2,
                    2,
                    2,
                )
                geometries.push(geometry)

                const pageEdge = new THREE.MeshStandardMaterial({
                    color: assets.pageEdgeColor ?? "#eee4cd",
                    roughness: 0.82,
                    metalness: 0,
                })
                const topPages = new THREE.MeshStandardMaterial({
                    color: assets.pageEdgeColor ?? "#f6eddb",
                    roughness: 0.86,
                    metalness: 0,
                })
                const bottomPages = new THREE.MeshStandardMaterial({
                    color: assets.pageEdgeColor ?? "#d9d2c2",
                    roughness: 0.9,
                    metalness: 0,
                })
                const spine = new THREE.MeshStandardMaterial({
                    color: "#f7edd9",
                    map: spineTexture,
                    roughness: 0.72,
                    metalness: 0,
                })
                const front = new THREE.MeshStandardMaterial({
                    color: "#f8eddb",
                    map: frontTexture,
                    roughness: 0.68,
                    metalness: 0,
                })
                const back = new THREE.MeshStandardMaterial({
                    color: "#f8eddb",
                    map: backTexture,
                    roughness: 0.72,
                    metalness: 0,
                })

                materials.push(
                    pageEdge,
                    topPages,
                    bottomPages,
                    spine,
                    front,
                    back,
                )

                mesh = new THREE.Mesh(geometry, [
                    pageEdge,
                    spine,
                    topPages,
                    bottomPages,
                    front,
                    back,
                ])
                group.add(mesh)
                setIsReady(true)
            })
            .catch(() => {
                if (!isDisposed) setIsReady(true)
            })

        const resize = () => {
            const width = frame.clientWidth
            const height = frame.clientHeight
            if (!width || !height) return

            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
            renderer.setSize(width, height, false)
            camera.aspect = width / height
            camera.updateProjectionMatrix()
        }

        const resizeObserver = new ResizeObserver(resize)
        resizeObserver.observe(frame)
        resize()

        const animate = (time: number) => {
            const rotation = rotationRef.current
            const targetRotation = targetRotationRef.current

            rotation.x += (targetRotation.x - rotation.x) * 0.1
            rotation.y += (targetRotation.y - rotation.y) * 0.1

            group.rotation.x = rotation.x
            group.rotation.y = rotation.y
            group.rotation.z = Math.sin(time * 0.0008) * 0.012
            group.position.y = -0.05 + Math.sin(time * 0.001) * 0.028

            renderer.render(scene, camera)
            animationRef.current = window.requestAnimationFrame(animate)
        }

        animationRef.current = window.requestAnimationFrame(animate)

        return () => {
            isDisposed = true
            resizeObserver.disconnect()
            if (animationRef.current !== null) {
                window.cancelAnimationFrame(animationRef.current)
            }
            if (mesh) group.remove(mesh)
            geometries.forEach((geometry) => geometry.dispose())
            textures.forEach((texture) => texture.dispose())
            materials.forEach((material) => material.dispose())
            renderer.dispose()
        }
    }, [assets, onFrontImageLoad])

    const resetView = () => {
        targetRotationRef.current = { ...BASE_ROTATION }
    }

    const handlePointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
        if (event.pointerType === "mouse" && event.button !== 0) return

        const targetRotation = targetRotationRef.current
        dragRef.current = {
            active: true,
            startX: event.clientX,
            startY: event.clientY,
            startRotationX: targetRotation.x,
            startRotationY: targetRotation.y,
        }
        event.currentTarget.setPointerCapture(event.pointerId)
        setIsDragging(true)
    }

    const finishDrag = (event: PointerEvent<HTMLCanvasElement>) => {
        dragRef.current.active = false
        setIsDragging(false)
        try {
            event.currentTarget.releasePointerCapture(event.pointerId)
        } catch {
            // The pointer may already be released by the browser.
        }
    }

    const handlePointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
        const drag = dragRef.current
        if (!drag.active) return

        const nextX = drag.startRotationX + (event.clientY - drag.startY) / 180
        const nextY = drag.startRotationY + (event.clientX - drag.startX) / 160

        targetRotationRef.current = {
            x: clamp(nextX, -0.78, 0.72),
            y: nextY,
        }
    }

    const handleKeyDown = (event: KeyboardEvent<HTMLCanvasElement>) => {
        const targetRotation = targetRotationRef.current
        const step = event.shiftKey ? 0.24 : 0.12

        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault()
            targetRotationRef.current = {
                ...targetRotation,
                y:
                    targetRotation.y +
                    (event.key === "ArrowLeft" ? -step : step),
            }
        }

        if (event.key === "ArrowUp" || event.key === "ArrowDown") {
            event.preventDefault()
            targetRotationRef.current = {
                ...targetRotation,
                x: clamp(
                    targetRotation.x + (event.key === "ArrowUp" ? -step : step),
                    -0.78,
                    0.72,
                ),
            }
        }

        if (event.key === "Home" || event.key === "Escape") {
            event.preventDefault()
            resetView()
        }
    }

    return (
        <div className="relative h-full min-h-[24rem] overflow-hidden rounded-[2rem] bg-white/[0.06] p-4 sm:p-6">
            <div
                className="pointer-events-none absolute inset-x-8 bottom-12 h-24 rounded-full blur-3xl transition-opacity duration-700"
                style={{
                    background: `rgba(${glowRgb(glowColor)}, 0.54)`,
                    opacity: hasGlowColor ? 1 : 0.45,
                }}
            />
            <div
                className="pointer-events-none absolute inset-[-20%] blur-3xl"
                style={{
                    background: `radial-gradient(circle at center, rgba(${glowRgb(glowColorSoft)}, 0.18), transparent 48%)`,
                }}
            />

            <div
                ref={frameRef}
                className="relative z-10 h-full w-full overflow-hidden rounded-[1.5rem]"
            >
                <canvas
                    ref={canvasRef}
                    tabIndex={0}
                    aria-label={`${alt}, interactive 3D model`}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={finishDrag}
                    onPointerCancel={finishDrag}
                    onKeyDown={handleKeyDown}
                    className={cn(
                        "size-full touch-none transition-opacity duration-500 outline-none focus-visible:ring-2 focus-visible:ring-white/50",
                        isReady ? "opacity-100" : "opacity-0",
                        isDragging ? "cursor-grabbing" : "cursor-grab",
                    )}
                />
                <div
                    className={cn(
                        "pointer-events-none absolute inset-0 grid place-items-center bg-white/[0.025] transition-opacity duration-500",
                        isReady ? "opacity-0" : "opacity-100",
                    )}
                >
                    <div className="size-10 animate-pulse rounded-full bg-white/22 blur-md" />
                </div>

                <Tooltip>
                    <TooltipTrigger
                        render={
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-lg"
                                onClick={resetView}
                                className="absolute top-4 right-4 z-20 rounded-full bg-black/30 text-white backdrop-blur-md hover:bg-black/42 hover:text-white"
                                aria-label="Reset book view"
                            >
                                <RotateCcw className="size-4" />
                            </Button>
                        }
                    />
                    <TooltipContent side="left">Reset view</TooltipContent>
                </Tooltip>
            </div>
        </div>
    )
}
