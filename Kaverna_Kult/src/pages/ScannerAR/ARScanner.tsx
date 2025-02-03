import { useEffect, useRef } from "react";
import * as MindAR from "mind-ar";

const ARScanner: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const startAR = async () => {
      if (!containerRef.current) return;

      const mindarThree = new MindAR.MindARThree({
        container: containerRef.current,
        imageTargetSrc: "/targets.mind", // Arquivo treinado
        maxTrack: 1,
      });

      const { renderer, scene, camera } = mindarThree;

      const video = document.createElement("video");
      video.src = "/animacao.mp4";
      video.loop = true;
      video.muted = true;
      video.autoplay = true;

      const anchor = mindarThree.addAnchor(0);
      anchor.group.add(video);

      await mindarThree.start();

      const animate = () => {
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      };
      animate();
    };

    startAR().catch(console.error);

    return () => {
      // Cleanup
    };
  }, []);

  return <div ref={containerRef} className="w-full h-screen bg-black"></div>;
};

export default ARScanner;
