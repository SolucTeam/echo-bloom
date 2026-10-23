import { Duotone, ImageTexture, Shader } from "shaders/react";

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
