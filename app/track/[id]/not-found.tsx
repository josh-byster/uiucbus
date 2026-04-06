import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function StopNotFound() {
  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-2xl font-bold">Stop not found</h1>
      <p className="text-muted-foreground">
        This bus stop doesn&apos;t exist. Try searching for another one.
      </p>
      <Button nativeButton={false} render={<Link href="/" />}>
        Search stops
      </Button>
    </div>
  );
}
