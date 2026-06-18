// src/app/page.tsx
import { redirect } from "next/navigation";

export default function RootPage() {
  // Redirige immédiatement vers la page de connexion/inscription
  redirect("/auth");
}
