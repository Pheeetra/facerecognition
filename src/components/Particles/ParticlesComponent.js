import Particles, { initParticlesEngine } from "@tsparticles/react";
import { useEffect, useMemo } from "react";
import { loadSlim } from "@tsparticles/slim"; // Import loadSlim from @tsparticles/slim

const ParticlesComponent = (props) => {
  // Load particles engine on component mount
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine); // Use loadSlim to load the slim version of particles
    });
  }, []);

  // Callback function when particles are loaded
  const particlesLoaded = (container) => {
    console.log(container);
  };

  // Define particles options
  const options = useMemo(
    () => ({
      background: {
        color: {
          value: "transparent", // Set background color to transparent
        },
      },
      fpsLimit: 120,
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: "repulse",
          },
          onHover: {
            enable: true,
            mode: "grab",
          },
        },
        modes: {
          push: {
            distance: 200,
            duration: 15,
          },
          grab: {
            distance: 150,
          },
        },
      },
      particles: {
        color: {
          value: "#FFFFFF",
        },
        links: {
          color: "#FFFFFF",
          distance: 150,
          enable: true,
          opacity: 0.3,
          width: 1,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "bounce",
          },
          random: true,
          speed: 1,
          straight: false,
        },
        number: {
    
          density: {
            enable: true,
          },
          value: 350,
        },
        opacity: {
          value: 1.0,
        },
        shape: {
          type: "circle",
        },
        size: {
          value: { min: 1, max: 3 },
        },
      },
      detectRetina: true,
    }),
    []
  );

  // Render Particles component
  return (
    // Set up a container with absolute positioning to contain the particles
    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>
      {/* Render the Particles component with provided id, load callback, and options */}
      <Particles id={props.id} init={particlesLoaded} options={options} />
    </div>
  );
};

export default ParticlesComponent;
