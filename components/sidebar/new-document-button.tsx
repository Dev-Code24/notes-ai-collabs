"use client";
import { useTransition } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { createNewDocument } from "@/actions/actions";

const NewDocumentButton = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const handleCreateNewDocuments = () => {
    startTransition(async () => {
      // Create new document
      const { docId } = await createNewDocument();
      router.push(`/doc/${docId}`);
    });
  };

  return <Button onClick={handleCreateNewDocuments} disabled={isPending}>{isPending ? "Creating..." : "New Document"}</Button>;
};
export default NewDocumentButton;
