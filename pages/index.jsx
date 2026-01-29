import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import * as THREE from 'three';

export default function ResignationSimulator() {
  const canvasRef = useRef(null);
  const [stage, setStage] = useState('intro');
  const [currentLog, setCurrentLog] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  // All the data for our resignation simulator
  const stages = {
    intro: {
      title: "RESIGNATION SIMULATOR",
      subtitle: "NUCLEAR MODE ACTIVATED",
      duration: 3000
    },
    management: {
      title: "TESTING MANAGEMENT SYSTEM",
      logs: [
        { type: 'error', text: 'Management Decision: do_opposite_of_expert_advice', delay: 500 },
        { type: 'warning', text: 'Management.listen_to_employees() → pass', delay: 1000 },
        { type: 'comment', text: '# Function intentionally left empty', delay: 1200 },
        { type: 'error', text: "NotImplementedError: 'Feature never planned'", delay: 1800 },
        { type: 'warning', text: 'Entering infinite loop...', delay: 2300 },
        { type: 'warning', text: '  └─ create_confusion()', delay: 2600 },
        { type: 'warning', text: '  └─ micromanage()', delay: 2900 },
        { type: 'warning', text: '  └─ contradict_self()', delay: 3200 },
      ]
    },
    infrastructure: {
      title: "COMPANY INFRASTRUCTURE HEALTH",
      metrics: [
        { name: 'Stability', value: 10, color: 'red' },
        { name: 'Security', value: 5, color: 'red' },
        { name: 'Competence', value: 0, status: 'DECEASED' },
        { name: 'Will to Live', value: 15, color: 'yellow' },
        { name: 'Market Value', status: 'DEPRECATED' },
        { name: 'Future Prospects', status: 'DECEASED' },
      ]
    },
    culture: {
      title: "WORKPLACE CULTURE METRICS",
      metrics: [
        { name: 'Toxicity Level', value: 'Chernobyl ☢️' },
        { name: 'Morale', value: 'Lower than expectations' },
        { name: 'Trust in Leadership', value: 'System.NullReferenceException' },
        { name: 'Work-Life Balance', value: 'Error 404 - Not Found' },
        { name: 'Employee Value', value: 'Deprecated 3 years ago' },
      ]
    },
    bugs: {
      title: "CRITICAL BUGS LEFT BEHIND",
      items: [
        'Management.brain() returns undefined',
        'Company.future() throws StackOverflowError',
        'Ethics.check() function never called',
        'Employee.retention() permanent FAIL state',
        'Product.quality() degrading exponentially',
        'HR.handleComplaint() infinite loop detected',
        'Workplace.diversity() returns false',
        'Leadership.competence() - NullPointerException',
      ]
    },
    compensation: {
      title: "COMPENSATION ANALYSIS",
      query: "SELECT * FROM employee_compensation\nWHERE fairness > 0\nAND matches_market_rate = true;",
      result: "0 rows returned"
    },
    final: {
      title: "RESIGNATION COMPLETE",
      statuses: [
        { name: 'Employee Retention', status: 'FAILED', color: 'red' },
        { name: 'Company Reputation', status: 'DESTROYED', color: 'red' },
        { name: 'Management Ego', status: 'BRUISED', color: 'yellow' },
        { name: 'My Patience', status: 'DEPLETED', color: 'red' },
        { name: 'My Future', status: 'BRIGHT', color: 'green' },
        { name: 'Your Future', status: 'YIKES', color: 'red' },
        { name: 'This Letter', status: 'LEGENDARY', color: 'cyan' },
      ]
    }
  };

  // Initialize Three.js scene
  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Create glowing particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 5000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 100;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x00ff00,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Create rotating wireframe sphere
    const sphereGeometry = new THREE.IcosahedronGeometry(3, 1);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);

    // Create glowing torus
    const torusGeometry = new THREE.TorusGeometry(4, 0.4, 16, 100);
    const torusMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ffff,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    scene.add(torus);

    camera.position.z = 15;

    // Animation loop
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      particlesMesh.rotation.y += 0.001;
      particlesMesh.rotation.x += 0.0005;

      sphere.rotation.x += 0.01;
      sphere.rotation.y += 0.01;

      torus.rotation.x += 0.005;
      torus.rotation.y += 0.005;

      // Pulse effect based on stage
      const time = Date.now() * 0.001;
      sphere.scale.set(
        1 + Math.sin(time) * 0.1,
        1 + Math.sin(time) * 0.1,
        1 + Math.sin(time) * 0.1
      );

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
    };
  }, []);

  // Stage progression logic
  useEffect(() => {
    if (stage === 'intro') {
      setTimeout(() => setStage('management'), 3000);
    }
  }, [stage]);

  const progressStage = () => {
    const stageOrder = ['intro', 'management', 'infrastructure', 'culture', 'bugs', 'compensation', 'final'];
    const currentIndex = stageOrder.indexOf(stage);
    if (currentIndex < stageOrder.length - 1) {
      setStage(stageOrder[currentIndex + 1]);
      setCurrentLog([]);
    }
  };

  const resetSimulator = () => {
    setStage('intro');
    setCurrentLog([]);
  };

  return (
    <>
      <Head>
        <title>Resignation Simulator - Nuclear Mode 🔥</title>
        <meta name="description" content="The most badass resignation letter simulator with 3D graphics" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🔥</text></svg>" />
      </Head>
      <div className="container">
      <canvas ref={canvasRef} className="background-canvas" />
      
      <div className="content">
        {stage === 'intro' && (
          <div className="intro-screen" key="intro">
            <div className="glitch-wrapper">
              <h1 className="title glitch" data-text="RESIGNATION SIMULATOR">
                RESIGNATION SIMULATOR
              </h1>
            </div>
            <p className="subtitle">NUCLEAR MODE ACTIVATED 🔥</p>
            <div className="loading-bar">
              <div className="loading-progress"></div>
            </div>
          </div>
        )}

        {stage === 'management' && (
          <div className="terminal-screen" key="management">
            <div className="terminal-header">
              <span className="terminal-title">TESTING MANAGEMENT SYSTEM</span>
              <div className="terminal-controls">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
            </div>
            <div className="terminal-body">
              {stages.management.logs.map((log, i) => (
                <div key={i} className={`log-line ${log.type} fade-in`} style={{animationDelay: `${i * 0.2}s`}}>
                  <span className="log-prefix">{log.type === 'error' ? '🔥' : log.type === 'warning' ? '⚠️' : '💬'}</span>
                  {log.text}
                </div>
              ))}
            </div>
            <button className="next-btn" onClick={progressStage}>CONTINUE →</button>
          </div>
        )}

        {stage === 'infrastructure' && (
          <div className="metrics-screen" key="infrastructure">
            <h2 className="section-title">{stages.infrastructure.title}</h2>
            <div className="health-panel">
              {stages.infrastructure.metrics.map((metric, i) => (
                <div key={i} className="metric-row fade-in" style={{animationDelay: `${i * 0.15}s`}}>
                  <span className="metric-name">{metric.name}</span>
                  {metric.status ? (
                    <span className={`metric-status ${metric.status === 'DECEASED' ? 'dead' : 'deprecated'}`}>
                      {metric.status === 'DECEASED' ? '💀 DECEASED' : '⚠️ DEPRECATED'}
                    </span>
                  ) : (
                    <div className="metric-bar-container">
                      <div className={`metric-bar ${metric.color}`} style={{width: `${metric.value}%`}}>
                        <span className="metric-value">{metric.value}%</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button className="next-btn" onClick={progressStage}>CONTINUE →</button>
          </div>
        )}

        {stage === 'culture' && (
          <div className="metrics-screen" key="culture">
            <h2 className="section-title">{stages.culture.title}</h2>
            <div className="culture-panel">
              {stages.culture.metrics.map((metric, i) => (
                <div key={i} className="culture-row fade-in" style={{animationDelay: `${i * 0.15}s`}}>
                  <span className="culture-name">{metric.name}</span>
                  <span className="culture-value">{metric.value}</span>
                </div>
              ))}
            </div>
            <button className="next-btn" onClick={progressStage}>CONTINUE →</button>
          </div>
        )}

        {stage === 'bugs' && (
          <div className="bugs-screen" key="bugs">
            <h2 className="section-title">{stages.bugs.title}</h2>
            <div className="bugs-panel">
              {stages.bugs.items.map((bug, i) => (
                <div key={i} className="bug-item fade-in" style={{animationDelay: `${i * 0.1}s`}}>
                  <span className="bug-icon">🔴</span>
                  <span className="bug-label">CRITICAL:</span>
                  <span className="bug-text">{bug}</span>
                </div>
              ))}
            </div>
            <p className="bugs-footer">Good luck fixing those. You won't. 💀</p>
            <button className="next-btn" onClick={progressStage}>CONTINUE →</button>
          </div>
        )}

        {stage === 'compensation' && (
          <div className="sql-screen" key="compensation">
            <h2 className="section-title">{stages.compensation.title}</h2>
            <div className="sql-panel">
              <pre className="sql-query fade-in">{stages.compensation.query}</pre>
              <div className="sql-executing fade-in" style={{animationDelay: '0.5s'}}>
                Executing query<span className="dots">...</span>
              </div>
              <div className="sql-result fade-in" style={{animationDelay: '1s'}}>
                <span className="result-error">❌ {stages.compensation.result}</span>
                <span className="result-comment">-- (Exactly what I expected)</span>
              </div>
            </div>
            <button className="next-btn" onClick={progressStage}>CONTINUE →</button>
          </div>
        )}

        {stage === 'final' && (
          <div className="final-screen" key="final">
            <h2 className="section-title final-title">╔════════════════════════════════════╗</h2>
            <h2 className="section-title final-title">║   RESIGNATION DEPLOYMENT COMPLETE  ║</h2>
            <h2 className="section-title final-title">╠════════════════════════════════════╣</h2>
            <div className="final-panel">
              {stages.final.statuses.map((status, i) => (
                <div key={i} className="final-row fade-in" style={{animationDelay: `${i * 0.15}s`}}>
                  <span className="final-name">{status.name}</span>
                  <span className={`final-status ${status.color}`}>[{status.status}]</span>
                </div>
              ))}
            </div>
            <h2 className="section-title final-title">╚════════════════════════════════════╝</h2>
            
            <div className="goodbye-section fade-in" style={{animationDelay: '1.5s'}}>
              <pre className="goodbye-script">
{`#!/bin/bash
# Goodbye script

sudo rm -rf /company/my_loyalty
sudo rm -rf /company/my_patience
sudo rm -rf /company/my_respect
sudo rm -rf /company/any_fucks_to_give

exit 0  # I'm out ✌️`}
              </pre>
            </div>

            <div className="final-message fade-in" style={{animationDelay: '2s'}}>
              <p className="success">✓ Resignation letter deployed successfully</p>
              <p className="success">✓ Bridges burned completely</p>
              <p className="success">✓ Truth bombs delivered</p>
              <p className="success">✓ Freedom achieved</p>
            </div>

            <button className="restart-btn" onClick={resetSimulator}>RESTART SIMULATOR</button>
          </div>
        )}
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Orbitron:wght@700;900&display=swap');

        .container {
          position: relative;
          min-height: 100vh;
          width: 100%;
          background: #000;
          color: #00ff00;
          font-family: 'JetBrains Mono', monospace;
          overflow-x: hidden;
        }

        .background-canvas {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
        }

        .content {
          position: relative;
          z-index: 1;
          padding: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
        }

        /* Intro Screen */
        .intro-screen {
          text-align: center;
          animation: fadeIn 1s ease-in;
        }

        .glitch-wrapper {
          position: relative;
          margin-bottom: 2rem;
        }

        .title {
          font-family: 'Orbitron', sans-serif;
          font-size: clamp(2rem, 8vw, 6rem);
          font-weight: 900;
          margin: 0;
          text-shadow: 
            0 0 10px #ff0000,
            0 0 20px #ff0000,
            0 0 30px #ff0000,
            0 0 40px #ff0000;
          animation: pulse 2s ease-in-out infinite;
        }

        .glitch {
          position: relative;
        }

        .glitch::before,
        .glitch::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .glitch::before {
          animation: glitch1 2.5s infinite;
          color: #ff0000;
          z-index: -1;
        }

        .glitch::after {
          animation: glitch2 2.5s infinite;
          color: #00ffff;
          z-index: -2;
        }

        @keyframes glitch1 {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
        }

        @keyframes glitch2 {
          0%, 100% { transform: translate(0); }
          20% { transform: translate(2px, -2px); }
          40% { transform: translate(2px, 2px); }
          60% { transform: translate(-2px, -2px); }
          80% { transform: translate(-2px, 2px); }
        }

        .subtitle {
          font-size: clamp(1rem, 3vw, 1.5rem);
          color: #ff6600;
          margin-bottom: 3rem;
          text-shadow: 0 0 10px #ff6600;
        }

        .loading-bar {
          width: 300px;
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          margin: 0 auto;
          border-radius: 2px;
          overflow: hidden;
        }

        .loading-progress {
          height: 100%;
          background: linear-gradient(90deg, #ff0000, #ff6600, #00ff00);
          animation: loading 3s ease-in-out;
        }

        @keyframes loading {
          from { width: 0%; }
          to { width: 100%; }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        /* Terminal Screen */
        .terminal-screen {
          width: 90%;
          max-width: 900px;
          background: rgba(0, 0, 0, 0.9);
          border: 2px solid #00ff00;
          border-radius: 8px;
          box-shadow: 
            0 0 20px rgba(0, 255, 0, 0.3),
            inset 0 0 40px rgba(0, 255, 0, 0.05);
          animation: fadeIn 0.5s ease-in;
        }

        .terminal-header {
          background: rgba(0, 255, 0, 0.1);
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #00ff00;
        }

        .terminal-title {
          font-weight: 700;
          color: #00ff00;
          text-shadow: 0 0 10px #00ff00;
        }

        .terminal-controls {
          display: flex;
          gap: 0.5rem;
        }

        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .dot.red { background: #ff5555; box-shadow: 0 0 10px #ff5555; }
        .dot.yellow { background: #ffff55; box-shadow: 0 0 10px #ffff55; }
        .dot.green { background: #55ff55; box-shadow: 0 0 10px #55ff55; }

        .terminal-body {
          padding: 2rem;
          min-height: 300px;
          max-height: 500px;
          overflow-y: auto;
        }

        .log-line {
          margin: 0.8rem 0;
          font-size: 0.95rem;
          display: flex;
          gap: 0.5rem;
          align-items: flex-start;
        }

        .log-line.error {
          color: #ff5555;
        }

        .log-line.warning {
          color: #ffff55;
        }

        .log-line.comment {
          color: #888;
          font-style: italic;
        }

        .log-prefix {
          flex-shrink: 0;
        }

        /* Metrics Screen */
        .metrics-screen {
          width: 90%;
          max-width: 900px;
          animation: fadeIn 0.5s ease-in;
        }

        .section-title {
          font-family: 'Orbitron', sans-serif;
          font-size: clamp(1.5rem, 4vw, 2.5rem);
          text-align: center;
          color: #00ffff;
          text-shadow: 0 0 20px #00ffff;
          margin-bottom: 2rem;
        }

        .health-panel,
        .culture-panel {
          background: rgba(0, 0, 0, 0.9);
          border: 2px solid #00ffff;
          border-radius: 8px;
          padding: 2rem;
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
        }

        .metric-row,
        .culture-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
          border-bottom: 1px solid rgba(0, 255, 255, 0.2);
        }

        .metric-row:last-child,
        .culture-row:last-child {
          border-bottom: none;
        }

        .metric-name,
        .culture-name {
          color: #ffff55;
          font-weight: 700;
        }

        .metric-status {
          font-weight: 700;
        }

        .metric-status.dead {
          color: #ff5555;
        }

        .metric-status.deprecated {
          color: #ff9955;
        }

        .metric-bar-container {
          flex: 1;
          max-width: 300px;
          height: 24px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          margin-left: 1rem;
          overflow: hidden;
        }

        .metric-bar {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          transition: width 1s ease-out;
          position: relative;
        }

        .metric-bar.red {
          background: linear-gradient(90deg, #ff0000, #ff5555);
          box-shadow: 0 0 10px #ff0000;
        }

        .metric-bar.yellow {
          background: linear-gradient(90deg, #ffaa00, #ffff55);
          box-shadow: 0 0 10px #ffaa00;
        }

        .metric-value {
          font-size: 0.8rem;
          font-weight: 700;
          color: #000;
        }

        .culture-value {
          color: #ff5555;
          text-align: right;
          max-width: 60%;
        }

        /* Bugs Screen */
        .bugs-screen {
          width: 90%;
          max-width: 900px;
          animation: fadeIn 0.5s ease-in;
        }

        .bugs-panel {
          background: rgba(0, 0, 0, 0.9);
          border: 2px solid #ff0000;
          border-radius: 8px;
          padding: 2rem;
          box-shadow: 0 0 20px rgba(255, 0, 0, 0.3);
        }

        .bug-item {
          display: flex;
          gap: 0.5rem;
          align-items: flex-start;
          margin: 1rem 0;
          padding: 0.5rem;
          background: rgba(255, 0, 0, 0.05);
          border-left: 3px solid #ff0000;
        }

        .bug-icon {
          flex-shrink: 0;
        }

        .bug-label {
          color: #ff5555;
          font-weight: 700;
          flex-shrink: 0;
        }

        .bug-text {
          color: #ffff55;
        }

        .bugs-footer {
          text-align: center;
          color: #ff5555;
          margin-top: 2rem;
          font-size: 1.2rem;
        }

        /* SQL Screen */
        .sql-screen {
          width: 90%;
          max-width: 900px;
          animation: fadeIn 0.5s ease-in;
        }

        .sql-panel {
          background: rgba(0, 0, 0, 0.9);
          border: 2px solid #00ffff;
          border-radius: 8px;
          padding: 2rem;
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.3);
        }

        .sql-query {
          color: #00ffff;
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .sql-executing {
          color: #ffff55;
          margin: 1rem 0;
        }

        .dots {
          animation: ellipsis 1.5s infinite;
        }

        @keyframes ellipsis {
          0%, 20% { content: '.'; }
          40% { content: '..'; }
          60%, 100% { content: '...'; }
        }

        .sql-result {
          margin-top: 2rem;
        }

        .result-error {
          color: #ff5555;
          font-weight: 700;
          display: block;
          margin-bottom: 0.5rem;
        }

        .result-comment {
          color: #888;
          font-style: italic;
          display: block;
        }

        /* Final Screen */
        .final-screen {
          width: 90%;
          max-width: 900px;
          animation: fadeIn 0.5s ease-in;
        }

        .final-title {
          font-family: 'JetBrains Mono', monospace;
          font-size: clamp(0.8rem, 2vw, 1.2rem);
          color: #00ff00;
        }

        .final-panel {
          background: rgba(0, 0, 0, 0.9);
          border: 2px solid #00ff00;
          border-radius: 8px;
          padding: 2rem;
          margin: 1rem 0;
          box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
        }

        .final-row {
          display: flex;
          justify-content: space-between;
          padding: 0.8rem 0;
          border-bottom: 1px solid rgba(0, 255, 0, 0.2);
        }

        .final-row:last-child {
          border-bottom: none;
        }

        .final-name {
          color: #ffff55;
        }

        .final-status {
          font-weight: 700;
        }

        .final-status.red { color: #ff5555; }
        .final-status.yellow { color: #ffff55; }
        .final-status.green { color: #55ff55; }
        .final-status.cyan { color: #00ffff; }

        .goodbye-section {
          margin: 2rem 0;
        }

        .goodbye-script {
          background: rgba(0, 0, 0, 0.9);
          border: 2px solid #00ff00;
          border-radius: 8px;
          padding: 1.5rem;
          color: #00ff00;
          font-size: 0.9rem;
          line-height: 1.6;
          box-shadow: 0 0 20px rgba(0, 255, 0, 0.3);
        }

        .final-message {
          text-align: center;
          margin: 2rem 0;
        }

        .success {
          color: #55ff55;
          font-size: 1.1rem;
          margin: 0.5rem 0;
        }

        /* Buttons */
        .next-btn,
        .restart-btn {
          display: block;
          margin: 2rem auto 0;
          padding: 1rem 3rem;
          background: linear-gradient(45deg, #ff0000, #ff6600);
          border: 2px solid #ff6600;
          border-radius: 4px;
          color: #fff;
          font-family: 'Orbitron', sans-serif;
          font-weight: 700;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 0 20px rgba(255, 102, 0, 0.5);
          text-transform: uppercase;
        }

        .next-btn:hover,
        .restart-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 30px rgba(255, 102, 0, 0.8);
        }

        .restart-btn {
          background: linear-gradient(45deg, #00ff00, #00ffff);
          border-color: #00ffff;
          box-shadow: 0 0 20px rgba(0, 255, 255, 0.5);
        }

        .restart-btn:hover {
          box-shadow: 0 0 30px rgba(0, 255, 255, 0.8);
        }

        /* Animations */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-in {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }

        /* Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
        }

        ::-webkit-scrollbar-thumb {
          background: #00ff00;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #00ffff;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .content {
            padding: 1rem;
          }

          .terminal-body,
          .health-panel,
          .culture-panel,
          .bugs-panel,
          .sql-panel,
          .final-panel {
            padding: 1rem;
          }

          .bug-item {
            flex-direction: column;
          }

          .metric-bar-container {
            max-width: 150px;
          }
        }
      `}</style>
    </div>
    </>
  );
}
