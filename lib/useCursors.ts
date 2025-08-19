"use client";

import { useEffect, useState } from "react";
import PartySocket from "partysocket";
import { env } from "@/env";

type Cursor = { id: string; name: string; x: number; y: number };

export function useCursors(room: string, name: string) {
  const [cursors, setCursors] = useState<Cursor[]>([]);

  useEffect(() => {
    const socket = new PartySocket({
      host: env.NEXT_PUBLIC_PARTYKIT_HOST ?? "localhost:1999",
      room,
    });

    socket.addEventListener("message", (evt) => {
      const cursor: Cursor = JSON.parse(evt.data);
      setCursors((prev) => {
        const rest = prev.filter((c) => c.id !== cursor.id);
        return [...rest, cursor];
      });
    });

    function onMove(e: MouseEvent) {
      socket.send(
        JSON.stringify({
          id: socket.id,
          name,
          x: e.clientX,
          y: e.clientY,
        }),
      );
    }

    window.addEventListener("mousemove", onMove);
    return () => {
      window.removeEventListener("mousemove", onMove);
      socket.close();
    };
  }, [room, name]);

  return cursors;
}
