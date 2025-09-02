'use client';
import { useEffect, useState } from 'react';
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
}

export function CampaignBubbleChart() {
  const [campaigns, setCampaigns] = useState<Campaigns | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'global' | 'local'>('global');
  const [selectedGlobal, setSelectedGlobal] = useState<string | null>(null);
  const svgRef =
   React.useRef<SVGSVGElement>(null);

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

    let data: BubbleNode[];
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
    const radiusScale = d3.scaleSqrt().domain([0, maxVal]).range([10, width/6]);
    
    const colorScale = d3.scaleOrdinal<string>()
        .domain(['anti-india', 'not-anti', 'none'])
        .range(['#ef4444', '#3b82f6', '#6b7280']);

    const simulation = d3.forceSimulation(data)
      .force('charge', d3.forceManyBody().strength(5))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(d => radiusScale(d.value) + 2))
      .on('tick', ticked);

    const node = svg.selectAll('.bubble')
      .data(data)
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
        .attr('r', d => radiusScale(d.value))
        .attr('fill', d => colorScale(d.label))
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 2);
    
    node.append('text')
        .attr('dy', '.3em')
        .style('text-anchor', 'middle')
        .style('font-size', d => `${Math.max(10, radiusScale(d.value) / 4)}px`)
        .style('fill', 'white')
        .style('pointer-events', 'none')
        .text(d => d.id.replace(/_/g, ' '));
        
    function ticked() {
      node.attr('transform', d => `translate(${d.x},${d.y})`);
    }

  }, [campaigns, view, selectedGlobal]);

  if (loading) {
    return <Skeleton className="w-full h-full rounded-full" />;
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
