"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";
import { useDocumentData } from "react-firebase-hooks/firestore";
import CollaborativeEditor from "./collaborative-editor";
import useOwner from "@/hooks/use-owner";
import DeleteDocument from "./document/delete-document";
import InviteUser from "./document/invite-user";
import ManageUsers from "./document/manage-users";
import Avatars from "./document/avatars";

const Document = ({ id }: { id: string }) => {
  const [data, loading, error] = useDocumentData(doc(db, "documents", id));
  const [input, setInput] = useState("");
  const [isUpdating, startUpdating] = useTransition();
  const isOwner = useOwner();

  useEffect(() => {
    if (data) {
      setInput(data.title);
    }
  }, [data]);

  const updateTitle = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      startUpdating(async () => {
        await updateDoc(doc(db, "documents", id), {
          title: input,
        });
      });
    }
  };

  return (
    <div className="flex-1 h-full bg-white p-5">
      <div className="flex max-w-6xl mx-auto justify-between p-2">
        <form onSubmit={updateTitle} className="flex space-x-2 flex-1">
          {/* update title */}
          <Input value={input} onChange={(e) => setInput(e.target.value)} />
          <Button disabled={isUpdating} type="submit">
            {isUpdating ? "Updating..." : "Update"}
          </Button>
          {/* IF/NOT owner */}
          {isOwner && (
            <>
              {/* Invite user */}
              <InviteUser />
              {/* Delete doc */}
              <DeleteDocument />
            </>
          )}
        </form>
      </div>
      <div className="flex max-w-6xl mx-auto justify-between items-center mb-5">
        {/* Manage users */}
        <ManageUsers />
        {/* avatars */}
        <Avatars />
      </div>
      <hr className="pb-10" />
      {/* Collaborative Users */}
      <CollaborativeEditor />
    </div>
  );
};
export default Document;
