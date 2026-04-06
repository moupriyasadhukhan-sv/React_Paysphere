import * as Icons from "lucide-react";

export function useIcon(name) {
  if (!name || typeof name !== "string") return null;

  // find icon by component name
  const Icon = Icons[name];

  if (!Icon) {
    console.warn(`Icon "${name}" not found in lucide-react`);
    return null;
  }

  return Icon;
}