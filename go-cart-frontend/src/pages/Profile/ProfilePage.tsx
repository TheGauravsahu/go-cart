import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SquarePen } from "lucide-react";
import ProfileForm from "./ProfileForm";
import EditProfileDialog from "./EditProfileDialog";

function ProfilePage() {
  return (
    <Card className="w-sm lg:w-4xl md:w-3xl md:mx-0 mx-auto h-[75vh] bg-secondary rounded-none shadow-none">
      <CardHeader className="border-b">
        <CardTitle className="text-xl">Personal Information</CardTitle>
        <EditProfileDialog>
          <CardAction className="text-pink-600 flex items-center gap-2">
            <SquarePen size={20} />
            <span className="hidden md:block">Change Profile Information</span>
          </CardAction>
        </EditProfileDialog>
      </CardHeader>
      <CardContent>
        <ProfileForm editable={false} />
      </CardContent>
    </Card>
  );
}

export default ProfilePage;
