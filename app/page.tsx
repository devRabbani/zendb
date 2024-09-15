import ToolpageHeader from "@/components/toolpage-header";
import CharLength from "@/components/tools/char-length";

export default function HomePage() {
  return (
    <footer className="border-t">
      <div className="container mx-auto py-4 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} ZenDB. Created by{" "}
        <a
          href="https://rabbani.updash.in"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline font-medium"
        >
          devRabbani
        </a>
        .
      </div>
    </footer>
  );
}
