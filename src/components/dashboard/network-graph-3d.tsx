'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { networkGraphData } from '@/lib/mock-data';

export function NetworkGraph3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / 400, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, 400);
    mountRef.current.appendChild(renderer.domElement);
    
    camera.position.z = 30;
    
    const nodes = networkGraphData.nodes;
    const links = networkGraphData.links;
    
    const nodeObjects: THREE.Mesh[] = [];
    const linkObjects: THREE.Line[] = [];

    const nodeColors: { [key: string]: number } = {
        campaign: 0xf97316,
        user: 0xfbc08a,
        keyword: 0xffffff
    };

    // Create nodes
    nodes.forEach(node => {
        const geometry = new THREE.SphereGeometry(0.5, 32, 32);
        const material = new THREE.MeshBasicMaterial({ color: nodeColors[node.type] || 0xffffff });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(Math.random() * 20 - 10, Math.random() * 20 - 10, Math.random() * 20 - 10);
        scene.add(sphere);
        nodeObjects.push(sphere);
    });

    // Create links
    links.forEach(link => {
        const material = new THREE.LineBasicMaterial({ color: 0xcccccc, transparent: true, opacity: 0.3 });
        const geometry = new THREE.BufferGeometry();
        const line = new THREE.Line(geometry, material);
        scene.add(line);
        linkObjects.push(line);
    });
    
    // Mouse interaction
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    const onMouseDown = (event: MouseEvent) => {
        isDragging = true;
        previousMousePosition = { x: event.clientX, y: event.clientY };
    };
    const onMouseMove = (event: MouseEvent) => {
        if (!isDragging) return;
        const deltaMove = {
            x: event.clientX - previousMousePosition.x,
            y: event.clientY - previousMousePosition.y
        };

        scene.rotation.y += deltaMove.x * 0.005;
        scene.rotation.x += deltaMove.y * 0.005;

        previousMousePosition = { x: event.clientX, y: event.clientY };
    };
    const onMouseUp = () => { isDragging = false; };
    const onWheel = (event: WheelEvent) => {
        camera.position.z += event.deltaY * 0.01;
    };
    
    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('wheel', onWheel);

    const animate = () => {
        requestAnimationFrame(animate);

        // Simple force simulation
        nodes.forEach((nodeA, i) => {
            nodes.forEach((nodeB, j) => {
                if (i === j) return;
                const posA = nodeObjects[i].position;
                const posB = nodeObjects[j].position;
                const distance = posA.distanceTo(posB);
                if (distance < 10) {
                    const force = new THREE.Vector3().subVectors(posA, posB).normalize().multiplyScalar(0.01);
                    posA.add(force);
                    posB.sub(force);
                }
            });
        });

        links.forEach((link, i) => {
            const sourceNode = nodeObjects[link.source];
            const targetNode = nodeObjects[link.target];
            const distance = sourceNode.position.distanceTo(targetNode.position);
            const force = (distance - 15) * 0.001;
            const direction = new THREE.Vector3().subVectors(targetNode.position, sourceNode.position).normalize();
            sourceNode.position.add(direction.clone().multiplyScalar(force));
            targetNode.position.sub(direction.clone().multiplyScalar(force));
        });

        // Update link positions
        links.forEach((link, i) => {
            const sourcePos = nodeObjects[link.source].position;
            const targetPos = nodeObjects[link.target].position;
            const positions = new Float32Array([sourcePos.x, sourcePos.y, sourcePos.z, targetPos.x, targetPos.y, targetPos.z]);
            linkObjects[i].geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            linkObjects[i].geometry.attributes.position.needsUpdate = true;
        });
        
        renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (mountRef.current) {
        camera.aspect = mountRef.current.clientWidth / 400;
        camera.updateProjectionMatrix();
        renderer.setSize(mountRef.current.clientWidth, 400);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('resize', handleResize);
        if (mountRef.current) {
            mountRef.current.removeChild(renderer.domElement);
        }
        renderer.domElement.removeEventListener('mousedown', onMouseDown);
        renderer.domElement.removeEventListener('mousemove', onMouseMove);
        renderer.domElement.removeEventListener('mouseup', onMouseUp);
        renderer.domElement.removeEventListener('wheel', onWheel);
    };
  }, []);

  return <div ref={mountRef} className="w-full h-[400px] cursor-grab active:cursor-grabbing rounded-lg" />;
}
