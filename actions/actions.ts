"use server";

import { adminDB } from "@/firebase-admin";
import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";

export async function createNewDocument() {
  auth().protect();

  const { sessionClaims } = await auth();
  const docCollectionRef = adminDB.collection("documents");
  const docRef = await docCollectionRef.add({
    title: "New Document",
  });

  await adminDB.collection("users").doc(sessionClaims?.email!).collection("rooms").doc(docRef.id).set({
    userId: sessionClaims?.email,
    role: "owner",
    createdAt: new Date(),
    roomId: docRef.id,
  });

  return { docId: docRef.id };
}

export async function deleteDocument(roomId: string) {
  auth().protect();
  console.log("Document with id:" + roomId + " deleted !");

  try {
    // delete document reference itself
    await adminDB.collection("documents").doc(roomId).delete();
    const query = await adminDB.collectionGroup("rooms").where("roomId", "==", roomId).get();

    const batch = adminDB.batch();
    // deleting the room reference in the user's collection for every user in the room
    query.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    await liveblocks.deleteRoom(roomId);
    return { success: true };
  } catch (error) {
    console.log("Error Deleting document:" + roomId + ",error: " + error);
    return { success: false };
  }
}

export async function inviteUserToDocument(roomId: string, email: string) {
  auth().protect();
  console.log("User addded to room: " + roomId);

  try {
    await adminDB.collection("users").doc(email).collection("rooms").doc(roomId).set({
      userId: email,
      role: "editor",
      createdAt: new Date(),
      roomId,
    });

    return { success: true };
  } catch (error) {
    console.log("Error Deleting document:" + roomId + ",error: " + error);
    return { success: false };
  }
}
export async function removeUserFromDocument(roomId: string, email: string) {
  auth().protect();
  console.log("User: " + email + "removed from: " + roomId);

  try {
    await adminDB.collection("users").doc(email).collection("rooms").doc(roomId).delete();
    return { success: true };
  } catch (error) {
    console.log("Error Deleting document:" + roomId + ",error: " + error);
    return { success: false };
  }
}
