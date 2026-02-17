'use client';
import { useEffect, useRef, useState } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import {
    BallCollider,
    CuboidCollider,
    Physics,
    RigidBody,
    useRopeJoint,
    useSphericalJoint,
    RigidBodyProps
} from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';

extend({ MeshLineGeometry, MeshLineMaterial });

interface LanyardProps {
    position?: [number, number, number];
    gravity?: [number, number, number];
    fov?: number;
    transparent?: boolean;
}

export default function Lanyard({
    position = [0, 0, 30],
    gravity = [0, -40, 0],
    fov = 20,
    transparent = true
}: LanyardProps) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [eventSource, setEventSource] = useState<HTMLElement | undefined>(undefined);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [isTablet, setIsTablet] = useState<boolean>(false);
    const [isDesktop, setIsDesktop] = useState<boolean>(true);

    useEffect(() => {
        const el = document.getElementById('hero-section');
        if (el) setEventSource(el);

        const handleResize = (): void => {
            const width = window.innerWidth;
            setIsMobile(width < 768);
            setIsTablet(width >= 768 && width < 1024);
            setIsDesktop(width >= 1024);
        };

        // Initial check
        handleResize();

        // Auto-flip timer for mobile/tablet
        const flipInterval = setInterval(() => {
            setIsFlipped(prev => !prev);
        }, 5000);

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            clearInterval(flipInterval);
        };
    }, []);

    // For mobile and tablet, render a static card without physics
    if (isMobile || isTablet) {
        return (
            <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none perspective-1000">
                <div className={`relative w-[210px] h-[310px] md:w-[260px] md:h-[380px] transition-transform duration-[1500ms] preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                    {/* Card Container with Float Animation */}
                    <div className="w-full h-full transform-gpu animate-float preserve-3d">
                        {/* Front of card */}
                        <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl shadow-red-600/20 border-2 border-white/5 backface-hidden bg-neutral-900">
                            {/* Card Content Layout */}
                            <div className="relative w-full h-full flex flex-col">
                                {/* Lanyard Slot/Hole */}
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-10 h-2 bg-black/80 rounded-full border border-white/10 z-20"></div>

                                <img
                                    src="/images/id-image.png"
                                    alt="ID Card Front"
                                    className="w-full h-full object-cover"
                                />

                                {/* Overlay tech patterns */}
                                <div className="absolute inset-0 carbon-pattern opacity-10 pointer-events-none"></div>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                            </div>
                        </div>

                        {/* Back of card */}
                        <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl shadow-red-600/20 border-2 border-white/5 backface-hidden rotate-y-180 bg-neutral-900">
                            <div className="relative w-full h-full flex flex-col">
                                {/* Lanyard Slot/Hole (Visible on back too) */}
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-10 h-2 bg-black/80 rounded-full border border-white/10 z-20"></div>

                                <img
                                    src="/images/back.jpg"
                                    alt="ID Card Back"
                                    className="w-full h-full object-cover"
                                />

                                {/* Technical markings on back */}
                                <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center p-6 text-center">
                                    <div className="w-full h-full border border-red-600/30 rounded-lg flex flex-col items-center justify-center space-y-2">
                                        <div className="text-[8px] font-mono text-white/40 tracking-[0.3em] uppercase">Security Clearance</div>
                                        <div className="text-[10px] font-mono text-red-600 font-bold tracking-[0.4em] uppercase">LEVEL_01</div>
                                    </div>
                                </div>
                                <div className="absolute inset-0 carbon-pattern opacity-20 pointer-events-none"></div>
                            </div>
                        </div>

                        {/* Card Edge (Subtle Thickness) */}
                        <div className="absolute inset-0 rounded-2xl border-x-[3px] border-neutral-800 pointer-events-none opacity-50 transform translate-z-1"></div>
                    </div>

                    {/* Dynamic Floor Shadow */}
                    <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[150px] h-[20px] bg-red-600/10 blur-xl rounded-full"></div>
                </div>

                {/* Perspective & Animation Styles */}
                <style jsx>{`
                    .perspective-1000 {
                        perspective: 1500px;
                    }
                    .preserve-3d {
                        transform-style: preserve-3d;
                    }
                    .backface-hidden {
                        backface-visibility: hidden;
                    }
                    .rotate-y-180 {
                        transform: rotateY(180deg);
                    }
                    .translate-z-1 {
                        transform: translateZ(1px);
                    }
                    @keyframes float {
                        0%, 100% { transform: translateY(0px) rotateX(0deg); }
                        25% { transform: translateY(-10px) rotateX(2deg); }
                        75% { transform: translateY(10px) rotateX(-2deg); }
                    }
                    .animate-float {
                        animation: float 8s ease-in-out infinite;
                    }
                `}</style>
            </div>
        );
    }

    // Desktop version - full physics-based lanyard
    return (
        <div className="absolute inset-0 w-full h-full pointer-events-none">
            <Canvas
                className="pointer-events-auto"
                eventSource={eventSource}
                camera={{ position, fov }}
                dpr={[1, 1.5]}
                gl={{ alpha: transparent, antialias: true }}
                onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
            >
                {/* More balanced lighting for natural colors */}
                <ambientLight intensity={0.8} />
                <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
                <directionalLight position={[-5, 3, -5]} intensity={0.6} />
                <pointLight position={[0, 5, 5]} intensity={0.5} />

                <Physics
                    gravity={gravity}
                    timeStep={1 / 60}
                    interpolate={true}
                >
                    <Band isMobile={false} />
                </Physics>

                <Environment blur={0.75}>
                    <Lightformer
                        intensity={1}
                        color="white"
                        position={[0, -1, 5]}
                        rotation={[0, 0, Math.PI / 3]}
                        scale={[100, 0.1, 1]}
                    />
                    <Lightformer
                        intensity={1.5}
                        color="white"
                        position={[-1, -1, 1]}
                        rotation={[0, 0, Math.PI / 3]}
                        scale={[100, 0.1, 1]}
                    />
                    <Lightformer
                        intensity={1.5}
                        color="white"
                        position={[1, 1, 1]}
                        rotation={[0, 0, Math.PI / 3]}
                        scale={[100, 0.1, 1]}
                    />
                    <Lightformer
                        intensity={2}
                        color="white"
                        position={[-10, 0, 14]}
                        rotation={[0, Math.PI / 2, Math.PI / 3]}
                        scale={[100, 10, 1]}
                    />
                </Environment>
            </Canvas>
        </div>
    );
}

// Desktop Band component (unchanged from your original)
interface BandProps {
    maxSpeed?: number;
    minSpeed?: number;
    isMobile?: boolean;
}

function Band({ maxSpeed = 50, minSpeed = 10, isMobile = false }: BandProps) {
    const band = useRef<any>(null);
    const fixed = useRef<any>(null);
    const j1 = useRef<any>(null);
    const j2 = useRef<any>(null);
    const j3 = useRef<any>(null);
    const card = useRef<any>(null);

    const vec = new THREE.Vector3();
    const ang = new THREE.Vector3();
    const rot = new THREE.Vector3();
    const dir = new THREE.Vector3();

    // Improved segment properties for smoother physics
    const segmentProps: any = {
        type: 'dynamic' as RigidBodyProps['type'],
        canSleep: true,
        colliders: false,
        angularDamping: 2,
        linearDamping: 2,
        restitution: 0.2,
        friction: 0.8
    };

    // LANYARD LENGTH SETTINGS
    const lanyardSegmentLength = 2.0;
    const ropeJointLength = 0.35;

    // Load front and back textures
    const [idTextureLoaded, setIdTextureLoaded] = useState(false);
    const [backTextureLoaded, setBackTextureLoaded] = useState(false);

    const idTexture = useTexture('/images/id-image.png', (texture) => {
        console.log('ID texture loaded successfully');
        setIdTextureLoaded(true);
        texture.flipY = true;
        texture.needsUpdate = true;
        texture.anisotropy = 16;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
    });

    const backTexture = useTexture('/images/back.jpg', (texture) => {
        console.log('Back texture loaded successfully');
        setBackTextureLoaded(true);
        texture.flipY = true;
        texture.needsUpdate = true;
        texture.anisotropy = 16;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
    });

    const lanyardTexture = useTexture('/images/lanyard.jpg');
    const [curve] = useState(
        () =>
            new THREE.CatmullRomCurve3([
                new THREE.Vector3(),
                new THREE.Vector3(),
                new THREE.Vector3(),
                new THREE.Vector3()
            ])
    );
    const [dragged, drag] = useState<false | THREE.Vector3>(false);
    const [hovered, hover] = useState(false);

    // Auto-rotation state
    const rotationTimer = useRef(0);
    const isRotating = useRef(false);
    const targetRotation = useRef(0);
    const lastVelocity = useRef(new THREE.Vector3());
    const restTimer = useRef(0);

    // Rope joints with adjustable length
    useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], ropeJointLength]);
    useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], ropeJointLength]);
    useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], ropeJointLength]);
    useSphericalJoint(j3, card, [
        [0, 0, 0],
        [0, 2.2, 0]
    ]);

    useEffect(() => {
        if (hovered) {
            document.body.style.cursor = dragged ? 'grabbing' : 'grab';
            return () => {
                document.body.style.cursor = 'auto';
            };
        }
    }, [hovered, dragged]);

    useFrame((state, delta) => {
        if (dragged && typeof dragged !== 'boolean') {
            vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
            dir.copy(vec).sub(state.camera.position).normalize();
            vec.add(dir.multiplyScalar(state.camera.position.length()));
            [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
            card.current?.setNextKinematicTranslation({
                x: vec.x - dragged.x,
                y: vec.y - dragged.y,
                z: vec.z - dragged.z
            });

            // Reset auto-rotation when dragging
            restTimer.current = 0;
            isRotating.current = false;
        }

        if (fixed.current) {
            // Improved lerping for smoother band animation
            [j1, j2].forEach(ref => {
                if (!ref.current.lerped) {
                    ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
                }
                const clampedDistance = Math.max(
                    0.1,
                    Math.min(1, ref.current.lerped.distanceTo(ref.current.translation()))
                );
                // Smoother lerp with adjusted speed calculation
                const lerpFactor = Math.min(1, delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)));
                ref.current.lerped.lerp(
                    ref.current.translation(),
                    lerpFactor
                );
            });

            // Update curve points
            curve.points[0].copy(j3.current.translation());
            curve.points[1].copy(j2.current.lerped);
            curve.points[2].copy(j1.current.lerped);
            curve.points[3].copy(fixed.current.translation());

            // Update band geometry with more points for smoother curve
            band.current.geometry.setPoints(curve.getPoints(isMobile ? 24 : 32));

            // Auto-rotation logic
            if (!dragged && card.current) {
                const linvel = card.current.linvel();
                const angvel = card.current.angvel();
                const currentVelocity = new THREE.Vector3(linvel.x, linvel.y, linvel.z);
                const angularSpeed = Math.sqrt(angvel.x ** 2 + angvel.y ** 2 + angvel.z ** 2);

                // Perform smooth rotation over 3 seconds
                if (isRotating.current) {
                    rotationTimer.current += delta;
                    const rotationDuration = 3.0; // 3 seconds for full rotation

                    if (rotationTimer.current < rotationDuration) {
                        // Apply constant angular velocity for smooth rotation
                        const rotationSpeed = (Math.PI * 2) / rotationDuration; // radians per second
                        card.current.setAngvel({ x: 0, y: rotationSpeed, z: 0 }, true);
                    } else {
                        // Rotation complete, stop angular velocity and reset for next cycle
                        card.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
                        isRotating.current = false;
                        restTimer.current = 0; // Reset timer to start counting 5 seconds again
                    }
                } else {
                    // Not currently rotating, check if card is at rest
                    // Don't count rotation as movement
                    const isAtRest = currentVelocity.length() < 0.1 && angularSpeed < 0.1;

                    if (isAtRest) {
                        restTimer.current += delta;

                        // Start rotation after 5 seconds of rest
                        if (restTimer.current >= 5.0) {
                            isRotating.current = true;
                            rotationTimer.current = 0;
                        }
                    } else {
                        // Card is moving from external forces, reset rest timer
                        restTimer.current = 0;
                    }
                }
            }

            // Smoother angular velocity damping (only when not auto-rotating)
            if (!isRotating.current) {
                ang.copy(card.current.angvel());
                rot.copy(card.current.rotation());
                card.current.setAngvel({
                    x: ang.x,
                    y: ang.y - rot.y * 0.15,
                    z: ang.z
                });
            }
        }
    });

    curve.curveType = 'chordal';
    lanyardTexture.wrapS = lanyardTexture.wrapT = THREE.RepeatWrapping;

    // Card dimensions
    const cardWidth = 2.5;
    const cardHeight = 4.0;
    const cardDepth = 0.12;

    return (
        <>
            <group position={[0, 4, 0]}>
                <RigidBody ref={fixed} {...segmentProps} type={'fixed' as RigidBodyProps['type']} />

                {/* Adjustable joint positions based on lanyardSegmentLength */}
                <RigidBody
                    position={[lanyardSegmentLength * 0.33, 0, 0]}
                    ref={j1}
                    {...segmentProps}
                    type={'dynamic' as RigidBodyProps['type']}
                >
                    <BallCollider args={[0.1]} />
                </RigidBody>

                <RigidBody
                    position={[lanyardSegmentLength * 0.66, 0, 0]}
                    ref={j2}
                    {...segmentProps}
                    type={'dynamic' as RigidBodyProps['type']}
                >
                    <BallCollider args={[0.1]} />
                </RigidBody>

                <RigidBody
                    position={[lanyardSegmentLength, 0, 0]}
                    ref={j3}
                    {...segmentProps}
                    type={'dynamic' as RigidBodyProps['type']}
                >
                    <BallCollider args={[0.1]} />
                </RigidBody>

                <RigidBody
                    position={[lanyardSegmentLength + 0.5, 0, 0]}
                    ref={card}
                    {...segmentProps}
                    type={
                        dragged
                            ? ('kinematicPosition' as RigidBodyProps['type'])
                            : ('dynamic' as RigidBodyProps['type'])
                    }
                >
                    {/* Card collider */}
                    <CuboidCollider args={[cardWidth / 2, cardHeight / 2, cardDepth / 2]} />

                    {/* Card group with images */}
                    <group
                        onPointerOver={() => hover(true)}
                        onPointerOut={() => hover(false)}
                        onPointerUp={(e: any) => {
                            e.target.releasePointerCapture(e.pointerId);
                            drag(false);
                        }}
                        onPointerDown={(e: any) => {
                            e.target.setPointerCapture(e.pointerId);
                            drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
                        }}
                    >
                        {/* Card base (white background) */}
                        <mesh position={[0, 0, 0]}>
                            <boxGeometry args={[cardWidth, cardHeight, cardDepth]} />
                            <meshStandardMaterial
                                color="#f5f5f5"
                                roughness={0.4}
                                metalness={0}
                            />
                        </mesh>

                        {/* ID image on front face */}
                        <mesh position={[0, 0, cardDepth / 2 + 0.02]}>
                            <planeGeometry args={[cardWidth * 0.92, cardHeight * 0.92]} />
                            <meshBasicMaterial
                                map={idTexture}
                                transparent={false}
                                side={THREE.FrontSide}
                                toneMapped={false}
                            />
                        </mesh>

                        {/* Technical Details on Front (Chip/Barcode) */}
                        <mesh position={[-0.7, -1.4, cardDepth / 2 + 0.03]}>
                            <planeGeometry args={[0.5, 0.4]} />
                            <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} transparent opacity={0.6} />
                        </mesh>
                        <mesh position={[0.6, -1.4, cardDepth / 2 + 0.03]}>
                            <planeGeometry args={[0.8, 0.3]} />
                            <meshStandardMaterial color="#111" metalness={0.5} roughness={0.5} transparent opacity={0.4} />
                        </mesh>

                        {/* Back image on back face - USING THE BACK.JPG IMAGE */}
                        <mesh position={[0, 0, -cardDepth / 2 - 0.02]} rotation={[0, Math.PI, 0]}>
                            <planeGeometry args={[cardWidth * 0.92, cardHeight * 0.92]} />
                            <meshBasicMaterial
                                map={backTexture}
                                transparent={false}
                                side={THREE.FrontSide}
                                toneMapped={false}
                            />
                        </mesh>

                        {/* Subtle Card Overlays (Holographic effect) */}
                        <mesh position={[0, 0, cardDepth / 2 + 0.015]}>
                            <planeGeometry args={[cardWidth * 0.98, cardHeight * 0.98]} />
                            <meshStandardMaterial
                                color="#ffffff"
                                transparent
                                opacity={0.05}
                                roughness={0.1}
                                metalness={1}
                            />
                        </mesh>

                        {/* Clip attachment point */}
                        <mesh position={[0, cardHeight / 2 - 0.4, 0]}>
                            <boxGeometry args={[0.6, 0.2, 0.2]} />
                            <meshStandardMaterial color="#666666" metalness={0.8} roughness={0.3} />
                        </mesh>

                        {/* Small metal ring for lanyard attachment */}
                        <mesh position={[0, cardHeight / 2 - 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
                            <torusGeometry args={[0.22, 0.04, 16, 32]} />
                            <meshStandardMaterial color="#999999" metalness={0.9} roughness={0.2} />
                        </mesh>
                    </group>
                </RigidBody>
            </group>

            {/* Lanyard band */}
            <mesh ref={band}>
                <meshLineGeometry />
                <meshLineMaterial
                    color="white"
                    depthTest={false}
                    resolution={[1000, 1000]}
                    useMap
                    map={lanyardTexture}
                    repeat={[-4, 1]}
                    lineWidth={1.5}
                />
            </mesh>
        </>
    );
}