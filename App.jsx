import React from 'react';
import Galaxy from './Galaxy.js';

const App = () => {
  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
      <Galaxy 
        mouseRepulsion={true}
        mouseInteraction={true}
        density={1.5}
        glowIntensity={0.5}
        saturation={0.8}
        hueShift={240}
        transparent={true}
      />
      
      {/* Luna Website Content */}
      <div style={{ position: 'relative', zIndex: 10, color: 'white' }}>
        <header style={{ padding: '20px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Luna - The Mystical Wanderer</h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.8 }}>Experience the magic of the cosmos</p>
        </header>
        
        <main style={{ padding: '20px' }}>
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>About Luna</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
              Born under a rare lunar eclipse, Luna inherited the ability to navigate by starlight 
              and communicate with celestial beings. She travels across dimensions, collecting stories 
              and wisdom from ancient civilizations and mystical realms.
            </p>
          </section>
          
          <section style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Luna's Wisdom</h2>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.1)', 
              padding: '20px', 
              borderRadius: '10px',
              backdropFilter: 'blur(10px)'
            }}>
              <p style={{ fontSize: '1.1rem', fontStyle: 'italic' }}>
                "The stars speak to those who listen with their hearts, not just their eyes."
              </p>
            </div>
          </section>
          
          <section>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Join Luna's Journey</h2>
            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
              <button style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '25px',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)'
              }}>
                🌙 Follow Luna
              </button>
              <button style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '25px',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)'
              }}>
                ✨ Join the Adventure
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default App; 