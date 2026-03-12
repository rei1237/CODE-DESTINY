import { redirect } from "next/navigation";

export default function Home() {
  // Keep Next app router minimal, but serve the real existing static homepage.
  redirect("/index.html");
}
