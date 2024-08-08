import Room_Provider from "@/components/room-provider";
import { auth } from "@clerk/nextjs/server";

const DocLayout = ({ children, params: { id } }: { children: React.ReactNode; params: { id: string } }) => {
  auth().protect();
  return <Room_Provider roomId={id}>{children}</Room_Provider>;
};
export default DocLayout;
