
'use client';
import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import { fetchCampaigns } from '@/lib/api';
import type { Campaigns } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

interface BubbleNode extends d3.SimulationNodeDatum {
  id: string;
  value: number;
  type: 'global' | 'local';
  label: 'anti-india' | 'not-anti' | 'none';
  radius: number;
}

export function CampaignBubbleChart() {
  const [campaigns, setCampaigns] = useState<Campaigns | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'global' | 'local'>('global');
  const [selectedGlobal, setSelectedGlobal] = useState<string | null>(null);
  const svgRef = React.useRef<SVGSVGElement>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchCampaigns();
        setCampaigns(data);
      } catch (error) {
        console.error("Failed to fetch campaigns:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (!campaigns || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = svg.node()?.getBoundingClientRect().width || 600;
    const height = svg.node()?.getBoundingClientRect().height || 600;

    svg.selectAll('*').remove(); // Clear previous render

    let data: Omit<BubbleNode, 'radius'>[];
    if (view === 'global') {
        data = Object.entries(campaigns).map(([global, locals]) => ({
            id: global,
            value: Object.keys(locals).length,
            type: 'global',
            label: 'none'
        }));
    } else if (selectedGlobal && campaigns[selectedGlobal]) {
        data = Object.entries(campaigns[selectedGlobal]).map(([local, details]) => ({
            id: local,
            value: details.tdescription.length, // size by number of tweets
            type: 'local',
            label: details.label
        }));
    } else {
        return;
    }
    
    if(data.length === 0) return;

    const maxVal = d3.max(data, d => d.value) || 1;
    const radiusScale = d3.scaleSqrt().domain([0, maxVal]).range([20, Math.min(width, height) / 4]);

    const nodes: BubbleNode[] = data.map(d => ({ ...d, radius: radiusScale(d.value) }));
    
    const colorScale = d3.scaleOrdinal<string>()
        .domain(['anti-india', 'not-anti', 'none'])
        .range(['#000000', '#000000', '#000000']);

    const simulation = d3.forceSimulation(nodes)
      .force('charge', d3.forceManyBody().strength(5))
      .force('center', d3.forceCenter(width / 2, height / 2).strength(1.5))
      .force('collision', d3.forceCollide().radius(d => d.radius + 1).strength(1))
      .on('tick', ticked);

    const node = svg.selectAll('.bubble')
      .data(nodes)
      .enter().append('g')
      .attr('class', 'bubble')
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        if(d.type === 'global') {
            setSelectedGlobal(d.id);
            setView('local');
        }
      });
      
    node.append('circle')
        .attr('r', d => d.radius)
        .attr('fill', d => colorScale(d.label))
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 2);
    
    node.append('text')
        .attr('dy', '.3em')
        .style('text-anchor', 'middle')
        .style('font-size', d => `${Math.max(10, d.radius / 5)}px`)
        .style('fill', 'white')
        .style('pointer-events', 'none')
        .text(d => d.id.replace(/_/g, ' '));
        
    function ticked() {
      node.attr('transform', d => {
        d.x = Math.max(d.radius, Math.min(width - d.radius, d.x || 0));
        d.y = Math.max(d.radius, Math.min(height - d.radius, d.y || 0));
        return `translate(${d.x},${d.y})`
      });
    }

    // Add a gentle, continuous shake
    d3.timer(() => {
        nodes.forEach(d => {
            d.x! += (Math.random() - 0.5) * 0.1;
            d.y! += (Math.random() - 0.5) * 0.1;
        });
        simulation.alpha(0.01);
    });


  }, [campaigns, view, selectedGlobal]);

  if (loading) {
    return <Skeleton className="w-full h-full rounded-lg" />;
  }
  
  return (
    <div className="relative w-full h-full">
        {view === 'local' && (
            <Button onClick={() => setView('global')} variant="outline" className="absolute top-2 left-2 z-10 bg-white/70">
                &larr; Back to Global
            </Button>
        )}
        <svg ref={svgRef} className="w-full h-full"></svg>
    </div>
  )
}
