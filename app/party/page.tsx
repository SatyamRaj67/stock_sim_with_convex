"use client";

import { useCursors } from "@/lib/useCursors";
import { useSession } from "next-auth/react";

export default function CursorPage() {
  const session = useSession();

  const cursors = useCursors("demo-room", session?.data?.user.name || "Guest");

  return (
    <div className="relative h-[calc(100vh-40px)] overflow-hidden bg-gray-100">
      {cursors.map((c) => (
        <div
          key={c.id}
          className={`pointer-events-none absolute text-xs font-bold text-blue-600 after:content-[${c.name}]`}
          style={{
            height: 0,
            width: 0,
            left: c.x,
            top: c.y,
          }}
        >
          ⬤
        </div>
      ))}
    </div>
  );
}
