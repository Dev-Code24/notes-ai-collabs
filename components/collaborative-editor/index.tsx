"use client";
import * as Y from "yjs";
import { useRoom, useSelf } from "@liveblocks/react/suspense";
import { useEffect, useState } from "react";
import { LiveblocksYjsProvider } from "@liveblocks/yjs";
import { Button } from "../ui/button";
import { MoonIcon, SunIcon } from "lucide-react";
import { BlockNoteView } from "@blocknote/shadcn";
import { BlockNoteEditor } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import stringToColor from "@/lib/string-to-color";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/shadcn/style.css";
import TranslateDocument from "./translate-document";
import ChatWithDocument from "./chat-with-document";

interface EditorProps {
  doc: Y.Doc;
  provider: any;
  darkMode: boolean;
}

function BlockNote({ doc, provider, darkMode }: EditorProps) {
  const userInfo = useSelf((me) => me.info);
  const editor: BlockNoteEditor = useCreateBlockNote({
    collaboration: {
      provider,
      fragment: doc.getXmlFragment("document-store"),
      user: {
        name: userInfo?.name,
        color: stringToColor(userInfo?.email),
      },
    },
  });
  return (
    <div className="relative max-w-6xl mx-auto">
      <BlockNoteView editor={editor} theme={darkMode ? "dark" : "light"} className="min-h-screen" />
    </div>
  );
}

export default function CollaborativeEditor() {
  const room = useRoom();
  const [doc, setDoc] = useState<Y.Doc>();
  const [provider, setProvider] = useState<LiveblocksYjsProvider>();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const ydoc = new Y.Doc();
    const yprovider = new LiveblocksYjsProvider(room, ydoc);
    setDoc(ydoc);
    setProvider(yprovider);

    return () => {
      ydoc?.destroy();
      yprovider?.destroy();
    };
  }, [room]);

  if (!doc || !provider) return null;

  const style = `hover:text-white ${
    darkMode
      ? "bg-gray-700 text-gray-300 hover:bg-gray-100 hover:text-gray-700"
      : "hover:bg-gray-200 hover:text-gray-700 bg-gray-200 hover:text-gray-700"
  }`;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-2 justify-end mb-10 p-2">
        {/* Translate Document */}
        <TranslateDocument doc={doc}  />
        {/* Chat with Document */}
        <ChatWithDocument doc={doc} />
        {/* Button for dark mode */}
        <Button className={style} onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <SunIcon /> : <MoonIcon />}
        </Button>
      </div>

      {/* BlockNote */}
      <BlockNote doc={doc} provider={provider} darkMode={darkMode} />
    </div>
  );
}
