"use client"

import {
    useEffect,
    useRef,
    useState,
    type KeyboardEvent,
    type PointerEvent,
} from "react"
import { RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
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
}

export function Book3DPreview({ assets, alt }: Book3DPreviewProps) {
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
        let cleanupFn: (() => void) | null = null

        void (async () => {
            const THREE = await import("three")
            if (isDisposed) return

            let mesh: InstanceType<typeof THREE.Mesh> | null = null
            const textures: InstanceType<typeof THREE.Texture>[] = []
            const materials: InstanceType<typeof THREE.Material>[] = []
            const geometries: InstanceType<typeof THREE.BufferGeometry>[] = []

            const renderer = new THREE.WebGLRenderer({
                canvas,
                antialias: true,
                alpha: true,
                powerPreference: "high-performance",
            })
            renderer.outputColorSpace = THREE.SRGBColorSpace
            renderer.toneMapping = THREE.ACESFilmicToneMapping
            renderer.toneMappingExposure = 1.08
            renderer.setClearColor(0x000000, 0)

            const scene = new THREE.Scene()
            const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100)
            camera.position.set(0, 0.04, 9.8)

            const group = new THREE.Group()
            scene.add(group)

            const ambient = new THREE.AmbientLight(0xffffff, 1.5)
            scene.add(ambient)

            const keyLight = new THREE.DirectionalLight(0xffffff, 2.1)
            keyLight.position.set(3.2, 4.8, 5.8)
            scene.add(keyLight)

            const fillLight = new THREE.DirectionalLight(0xffffff, 0.82)
            fillLight.position.set(-4.5, -1.8, 4)
            scene.add(fillLight)

            const rimLight = new THREE.DirectionalLight(0xffffff, 1.45)
            rimLight.position.set(-3, 2.5, -4)
            scene.add(rimLight)

            const loader = new THREE.TextureLoader()

            const configureTexture = (
                texture: InstanceType<typeof THREE.Texture>,
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
                new Promise<InstanceType<typeof THREE.Texture>>(
                    (resolve, reject) => {
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
                    },
                )

            void Promise.all([
                loadTexture(assets.frontImageSrc, assets.frontImageCrop),
                loadTexture(assets.backImageSrc),
                loadTexture(assets.spineImageSrc),
            ])
                .then(([frontTexture, backTexture, spineTexture]) => {
                    if (isDisposed) return

                    const frontAspect = assets.frontImageCrop
                        ? assets.frontImageCrop.width /
                          assets.frontImageCrop.height
                        : 0.65
                    const width = 3.15
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

            cleanupFn = () => {
                resizeObserver.disconnect()
                if (animationRef.current !== null) {
                    window.cancelAnimationFrame(animationRef.current)
                }
                if (mesh) group.remove(mesh)
                geometries.forEach((g) => g.dispose())
                textures.forEach((t) => t.dispose())
                materials.forEach((m) => m.dispose())
                renderer.dispose()
            }
        })()

        return () => {
            isDisposed = true
            if (animationRef.current !== null) {
                window.cancelAnimationFrame(animationRef.current)
            }
            cleanupFn?.()
        }
    }, [assets])

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
        <div className="book-media-stage">
            <div ref={frameRef} className="absolute inset-4 overflow-hidden">
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
                        "focus-visible:ring-primary/40 size-full touch-none transition-opacity duration-500 outline-none focus-visible:ring-2",
                        isReady ? "opacity-100" : "opacity-0",
                        isDragging ? "cursor-grabbing" : "cursor-grab",
                    )}
                />
                <div
                    className={cn(
                        "bg-muted/20 pointer-events-none absolute inset-0 grid place-items-center transition-opacity duration-500",
                        isReady ? "opacity-0" : "opacity-100",
                    )}
                >
                    <div className="bg-primary/20 size-10 animate-pulse rounded-full blur-md" />
                </div>

                <Tooltip>
                    <TooltipTrigger
                        render={
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-lg"
                                onClick={resetView}
                                className="bg-background/90 text-foreground hover:bg-background hover:text-foreground absolute top-4 right-4 z-20 rounded-none border shadow-sm"
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
