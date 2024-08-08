"use client";
import { LiveList } from "@liveblocks/client";
import { ClientSideSuspense, RoomProvider } from "@liveblocks/react/suspense";
import LoadingSpinner from "./loading-spinner";
import LiveCursorProvider from "./live-cursor-provider";

const Room_Provider = ({ roomId, children }: { roomId: string; children: React.ReactNode }) => {
  return (
    <RoomProvider
      id={roomId}
      initialPresence={{
        cursor: null,
      }}
    >
      <ClientSideSuspense fallback={<LoadingSpinner />}>
        <LiveCursorProvider>{children}</LiveCursorProvider>
      </ClientSideSuspense>
    </RoomProvider>
  );
};
export default Room_Provider;
