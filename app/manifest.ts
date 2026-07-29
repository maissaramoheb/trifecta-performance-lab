import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Trifecta Performance Lab",
    short_name: "Trifecta Lab",
    description: "Bilingual trainer-development and performance-diagnosis workspace.",
    start_url: "/",
    display: "standalone",
    background_color: "#0d0e0e",
    theme_color: "#0d0e0e",
    lang: "ar",
    dir: "rtl",
  };
}
