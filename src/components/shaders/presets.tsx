import { Duotone, FloatingParticles, Fog, ImageTexture, Shader } from "shaders/react";

/**
 * WebGPU effect composition for Green Ivory, rendered exclusively through
 * `ClientShader` so it only ever runs in a WebGPU-capable browser with motion
 * allowed.
 */

/** Cards: photos rest in the brand's forest-green duotone; hovering the card
 * fades the canvas out (handled by the caller's classes) to reveal the true
 * colors underneath. */
export function DuotoneCard({ image }: { image?: string }) {
  return (
    <Shader className="h-full w-full">
      <Duotone colorA="#1a3c2a" colorB="#e6eedb">
        <ImageTexture url={image ?? ""} objectFit="cover" />
      </Duotone>
    </Shader>
  );
}

/** Hero : brume de forêt aux couleurs de la marque, avec particules organiques.
 *  Rendu derrière le texte ; l'appelant contrôle l'opacité (faible) via className. */
export function HeroAmbient() {
  return (
    <Shader className="h-full w-full">
      <Fog colorA="#a0c49d" colorB="#e6eedb" speed={0.4} turbulence={0.7} seed={7} />
      <FloatingParticles particleColor="#2d5a3d" softness={0.8} twinkle={0.4} opacity={0.35} />
    </Shader>
  );
}
