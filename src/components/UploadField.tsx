import { useRef } from "react";
import { ImagePlus } from "lucide-react";

/** Bouton d'import de fichier : zone visible et indicative qui remplace l'input natif brut. */
export function UploadField({
  label,
  accept = "image/*",
  multiple = false,
  disabled = false,
  onFiles,
}: {
  label: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  onFiles: (files: File[]) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  return (
    <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-dashed border-border bg-muted/40 px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
      <ImagePlus className="h-4 w-4" aria-hidden />
      {label}
      <input
        ref={input}
        aria-label={label}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="sr-only"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length) onFiles(files);
          e.target.value = "";
        }}
      />
    </label>
  );
}
