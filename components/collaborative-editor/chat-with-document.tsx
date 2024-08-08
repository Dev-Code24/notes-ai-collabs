"use client";
import * as Y from "yjs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormEvent, useState, useTransition } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import Markdown from "react-markdown";
import { BotIcon, MessageCircleCode } from "lucide-react";
import { Input } from "../ui/input";
export default function ChatWithDocument({ doc }: { doc: Y.Doc }) {
  const [isOpen, setIsOpen] = useState(false);
  const [summary, setSummary] = useState<string>("");
  const [question, setQuestion] = useState<string>("");
  const [input, setInput] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const handleAskQuestion = (e: FormEvent) => {
    e.preventDefault();
    setQuestion(input);

    startTransition(async () => {
      const documentData = doc.get("document-store").toJSON();
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/chat-with-document`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ documentData, question: input }),
      });

      if (res.ok) {
        const responseJson = await res.json();
        console.log("Parsed JSON:", responseJson);
        if (responseJson.response) {
          setSummary(responseJson.response);
          setInput("");
          toast.success("Question asked successfully!");
        } else {
          toast.error("Failed to get a valid response!");
        }
      } else {
        toast.error("AI unreachable!");
      }
    });
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button asChild variant="outline">
        <DialogTrigger>
          <MessageCircleCode className="mr-2" />
          Chat with document
        </DialogTrigger>
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chat with the document</DialogTitle>
          <DialogDescription>Ask your query related to the document to an AI</DialogDescription>
          <hr className="mt-5" />
          {question && <p className="mt-5 text-gray-500">Q: {question}</p>}
        </DialogHeader>

        {summary && (
          <div className="flex flex-col items-start max-h-96 overflow-y-scroll gap-2 p-5 bg-gray-100">
            <div className="flex">
              <BotIcon className="w-10 flex-shrink-0" />
              <p className="font-bold">GPT {isPending ? "is thinking" : "says,"}</p>
            </div>
            <p>{isPending ? "Thinking..." : <Markdown>{summary}</Markdown>}</p>
          </div>
        )}

        <form onSubmit={handleAskQuestion} className="flex gap-2">
          <Input
            type="text"
            placeholder="i.e. What is this about?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full"
          />
          <Button type="submit" disabled={!input || isPending}>
            {isPending ? "Asking..." : "Ask"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
