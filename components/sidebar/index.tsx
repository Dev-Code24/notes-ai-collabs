"use client";
import { useEffect, useState } from "react";
import { db } from "@/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import { collectionGroup, DocumentData, query, where } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MenuIcon } from "lucide-react";
import NewDocumentButton from "./new-document-button";
import SidebarOptions from "./sidebar-options";

interface RoomDocument extends DocumentData {
  createdAt: string;
  role: "owner" | "editor";
  roomId: string;
  userId: string;
}

const Sidebar = () => {
  const [groupedData, setGroupedData] = useState<{
    owner: RoomDocument[];
    editor: RoomDocument[];
  }>({
    owner: [],
    editor: [],
  });

  const { user } = useUser();
  const [data, loading, error] = useCollection(
    user && query(collectionGroup(db, "rooms"), where("userId", "==", user.emailAddresses[0].toString()))
  );

  useEffect(() => {
    if (!data) {
      return;
    }
    // [doc1, doc2, doc3....] -> { "owner": [doc1,doc2],  "editor":[doc3..] }
    const grouped = data.docs.reduce<{
      owner: RoomDocument[];
      editor: RoomDocument[];
    }>(
      (acc, curr) => {
        const roomData = curr.data() as RoomDocument;
        if (roomData.role === "owner") {
          acc.owner.push({
            id: curr.id,
            ...roomData,
          });
        } else {
          acc.editor.push({
            id: curr.id,
            ...roomData,
          });
        }

        return acc;
      },
      {
        owner: [],
        editor: [],
      }
    );
    setGroupedData(grouped);
  }, [data]);

  const menuOptions = (
    <div>
      <NewDocumentButton />
      {/* My Documents */}
      <div className="flex py-4 flex-col space-y-4 md:max-w-36">
        <h2 className="text-gray-500 font-semibold text-sm mt-4">My Documents</h2>
        {groupedData.owner.length === 0 ? (
          <h2 className="text-gray-500 font-semibold text-sm mt-4">No documents found!</h2>
        ) : (
          <>
            {groupedData.owner.map((doc) => (
              <SidebarOptions key={doc.id} id={doc.id} href={`/doc/${doc.id}`} />
            ))}
          </>
        )}
        {/* Share with me */}
        {groupedData.editor.length > 0 &&
          groupedData.editor.map(() => (
            <>
              <h2 className="text-gray-500 font-semibold text-sm">Shared with me</h2>
              {groupedData.editor.map((doc) => (
                <SidebarOptions key={doc.id} id={doc.id} href={`/doc/${doc.id}`} />
              ))}
            </>
          ))}
      </div>
    </div>
  );
  return (
    <div className="p-2 md:p-5 bg-gray-200 relative">
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger>
            <MenuIcon className="p-2 hover:opacity-30 rounded-lg" size={40} />
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle className="text-center">Menu</SheetTitle>
              <div>{menuOptions}</div>
              <SheetDescription></SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden md:inline">{menuOptions}</div>
    </div>
  );
};
export default Sidebar;
