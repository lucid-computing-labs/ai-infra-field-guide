import React, {useEffect, useRef} from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export default function NetworkMesh() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const nodesRef = useRef<Node[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    // Initialize nodes
    const nodeCount = 40;
    if (nodesRef.current.length === 0) {
      nodesRef.current = Array.from({length: nodeCount}, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      }));
    }

    const connectionDist = 150;

    const animate = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const nodes = nodesRef.current;

      // Update positions
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        node.x = Math.max(0, Math.min(canvas.width, node.x));
        node.y = Math.max(0, Math.min(canvas.height, node.y));
      }

      // Draw connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist) {
            const opacity = (1 - dist / connectionDist) * 0.15;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(91, 155, 213, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const node of nodes) {
        ctx.beginPath();
        ctx.fillStyle = 'rgba(91, 155, 213, 0.3)';
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw occasional "data packets" moving along connections
      const time = Date.now() * 0.001;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDist * 0.7) {
            const packetPhase = ((i * 7 + j * 13 + time) % 3) / 3;
            if (packetPhase < 0.5) {
              const t = packetPhase * 2;
              const px = nodes[i].x + (nodes[j].x - nodes[i].x) * t;
              const py = nodes[i].y + (nodes[j].y - nodes[i].y) * t;

              ctx.beginPath();
              ctx.fillStyle = 'rgba(91, 155, 213, 0.5)';
              ctx.arc(px, py, 1.5, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="network-mesh"
      aria-hidden="true"
    />
  );
}
