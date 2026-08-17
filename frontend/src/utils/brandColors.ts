export const getTechBrandColor = (name: string, category?: string): string => {
  const n = (name || "").toLowerCase().trim();
  const cat = (category || "").toLowerCase().trim();

  // Frontend / Frameworks / Web UI
  if (n.includes("react")) return "#61DAFB";
  if (n.includes("typescript") || n === "ts") return "#3178C6";
  if (n.includes("javascript") || n === "js") return "#F7DF1E";
  if (n.includes("next")) return "#0070F3";
  if (n.includes("tailwind")) return "#06B6D4";
  if (n.includes("vue")) return "#42B883";
  if (n.includes("angular")) return "#DD0031";
  if (n.includes("svelte")) return "#FF3E00";
  if (n.includes("html")) return "#E34F26";
  if (n.includes("css")) return "#1572B6";
  if (n.includes("redux")) return "#764ABC";
  if (n.includes("three") || n.includes("webgl")) return "#049EF4";
  if (n.includes("vite")) return "#646CFF";
  if (n.includes("sass") || n.includes("scss")) return "#CC6699";
  if (n.includes("bootstrap")) return "#7952B3";
  if (n.includes("mui") || n.includes("material")) return "#007FFF";

  // Backend / Runtimes / Frameworks
  if (n.includes("node")) return "#5FA04E";
  if (n.includes("express")) return "#828282";
  if (n.includes("nest")) return "#E0234E";
  if (n.includes("python") || n.includes("django") || n.includes("flask")) return "#3776AB";
  if (n.includes("java") || n.includes("spring")) return "#5382A1";
  if (n.includes("golang") || n.includes("go")) return "#00ADD8";
  if (n.includes("rust")) return "#DEA584";
  if (n.includes("c#") || n.includes(".net")) return "#239120";
  if (n.includes("php") || n.includes("laravel")) return "#777BB4";
  if (n.includes("graphql")) return "#E10098";
  if (n.includes("socket")) return "#25C2A0";
  if (n.includes("jwt") || n.includes("auth") || n.includes("security")) return "#F59E0B";

  // Databases & Storage
  if (n.includes("mongo")) return "#47A248";
  if (n.includes("postgres")) return "#4169E1";
  if (n.includes("mysql")) return "#4479A1";
  if (n.includes("redis")) return "#DC382D";
  if (n.includes("firebase")) return "#FFCA28";
  if (n.includes("prisma")) return "#2D3748";
  if (n.includes("supabase")) return "#3ECF8E";
  if (n.includes("sqlite")) return "#003B57";

  // DevOps / Cloud / Tools
  if (n.includes("docker")) return "#2496ED";
  if (n.includes("git")) return "#F05032";
  if (n.includes("aws")) return "#FF9900";
  if (n.includes("vercel")) return "#0070F3";
  if (n.includes("render")) return "#46E3B7";
  if (n.includes("linux") || n.includes("bash") || n.includes("shell")) return "#FCC624";
  if (n.includes("nginx")) return "#009639";
  if (n.includes("k8s") || n.includes("kubernetes")) return "#326CE5";
  if (n.includes("ci") || n.includes("cd")) return "#2088FF";
  if (n.includes("cloudinary")) return "#3448C5";
  if (n.includes("postman")) return "#FF6C37";
  if (n.includes("figma")) return "#F24E1E";
  if (n.includes("jest") || n.includes("vitest")) return "#C21325";
  if (n.includes("eslint") || n.includes("prettier")) return "#4B32C3";

  // Category fallbacks
  if (cat.includes("front") || cat.includes("web") || cat.includes("ui")) return "#06B6D4";
  if (cat.includes("back") || cat.includes("api")) return "#10B981";
  if (cat.includes("data") || cat.includes("db")) return "#F59E0B";
  if (cat.includes("devops") || cat.includes("cloud")) return "#8B5CF6";
  if (cat.includes("tool") || cat.includes("design")) return "#EC4899";

  return "#38BDF8"; // Default Cyan / Sky
};
