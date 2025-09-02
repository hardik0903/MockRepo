'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { NetworkGraphData } from '@/lib/types';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface NodeObject extends THREE.Object3D {
    velocity: THREE.Vector3;
    isPinned: boolean;
}

export function NetworkGraph3D({ data }: { data: NetworkGraphData }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current || !data) return;

    const width = mountRef.current.clientWidth;
    const height = 500;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialiias: true, alpha: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);
    
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    camera.position.z = 35;

    const nodeMap = new Map<string, { id: number, type: 'campaign' | 'user' | 'keyword' }>();
    let nodeCount = 0;

    const getNode = (name: string, type: 'campaign' | 'user' | 'keyword') => {
        if (!nodeMap.has(name)) {
            nodeMap.set(name, { id: nodeCount++, type });
        }
        return nodeMap.get(name)!.id;
    };
    
    const links: { source: number, target: number }[] = [];

    // Process campaigns
    for (const campaignName in data.campaign) {
        const campaignId = getNode(campaignName, 'campaign');
        const users = data.campaign[campaignName];
        for (const userName in users) {
            const userId = getNode(userName, 'user');
            links.push({ source: campaignId, target: userId });
            const { hatekeywords } = users[userName];
            for (const keyword of hatekeywords) {
                const keywordId = getNode(keyword, 'keyword');
                links.push({ source: userId, target: keywordId });
            }
        }
    }

    const nodes = Array.from(nodeMap.entries()).map(([name, { id, type }]) => ({ id, name, type }));
    
    const nodeObjects: NodeObject[] = [];
    const linkObjects: THREE.Line[] = [];

    const nodeColors = { campaign: 0x8b5cf6, user: 0xec4899, keyword: 0xf4f4f5 };
    const nodeSizes = { campaign: 1.0, user: 0.6, keyword: 0.3 };

    // Create nodes
    nodes.forEach(node => {
        const geometry = new THREE.SphereGeometry(nodeSizes[node.type], 16, 16);
        const material = new THREE.MeshBasicMaterial({ color: nodeColors[node.type] });
        const sphere = new THREE.Mesh(geometry, material) as NodeObject;
        sphere.position.set((Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30, (Math.random() - 0.5) * 30);
        sphere.velocity = new THREE.Vector3();
        sphere.isPinned = false;
        scene.add(sphere);
        nodeObjects.push(sphere);
    });

    // Create links
    links.forEach(() => {
        const material = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.15 });
        const geometry = new THREE.BufferGeometry();
        const line = new THREE.Line(geometry, material);
        scene.add(line);
        linkObjects.push(line);
    });
    
    const animate = () => {
        requestAnimationFrame(animate);

        // Force simulation
        const repulsionStrength = 0.1;
        const attractionStrength = 0.002;
        const centerStrength = 0.001;

        // Repulsion force
        for (let i = 0; i < nodeObjects.length; i++) {
            for (let j = i + 1; j < nodeObjects.length; j++) {
                const nodeA = nodeObjects[i];
                const nodeB = nodeObjects[j];
                const delta = new THREE.Vector3().subVectors(nodeA.position, nodeB.position);
                const distance = delta.length() + 0.1;
                const force = delta.normalize().multiplyScalar(repulsionStrength / (distance * distance));
                nodeA.velocity.add(force);
                nodeB.velocity.sub(force);
            }
        }
        
        // Attraction force (links)
        links.forEach(link => {
            const sourceNode = nodeObjects[link.source];
            const targetNode = nodeObjects[link.target];
            const delta = new THREE.Vector3().subVectors(targetNode.position, sourceNode.position);
            const force = delta.multiplyScalar(attractionStrength);
            sourceNode.velocity.add(force);
            targetNode.velocity.sub(force);
        });

        // Centering force
        nodeObjects.forEach(node => {
            const force = node.position.clone().multiplyScalar(-centerStrength);
            node.velocity.add(force);
        });

        // Update positions
        nodeObjects.forEach(node => {
            if (!node.isPinned) {
                node.position.add(node.velocity);
            }
            node.velocity.multiplyScalar(0.95); // Damping
        });

        // Update link positions
        links.forEach((link, i) => {
            const sourcePos = nodeObjects[link.source].position;
            const targetPos = nodeObjects[link.target].position;
            const positions = new Float32Array([sourcePos.x, sourcePos.y, sourcePos.z, targetPos.x, targetPos.y, targetPos.z]);
            linkObjects[i].geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        });
        
        controls.update();
        renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (mountRef.current) {
        const newWidth = mountRef.current.clientWidth;
        camera.aspect = newWidth / height;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, height);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('resize', handleResize);
        if (mountRef.current) {
            mountRef.current.removeChild(renderer.domElement);
        }
        controls.dispose();
    };
  }, [data]);

  return <div ref={mountRef} className="w-full h-[500px] cursor-grab active:cursor-grabbing rounded-lg bg-muted/20" />;
}
