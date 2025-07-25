"use client";

import SettingsForm from "@/components/form/settings-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRef, useState } from "react";
import { ReferralDialog } from "@/components/dialog/settings/referral-dialog";
import { toast } from "sonner";
import { AdminDialog } from "@/components/dialog/settings/admin-dialog";

const SettingsPage = () => {
  const clickCount = useRef(0);
  const [isRotating, setIsRotating] = useState(false);

  const handleClick = () => {
    setIsRotating(true);
    setTimeout(() => {
      setIsRotating(false);
    }, 200);

    clickCount.current += 1;
    if (clickCount.current % 5 === 0) {
      setReferralDialogOpen(true);
    }
  };

  const [referralDialogOpen, setReferralDialogOpen] = useState(false);
  const [adminDialogOpen, setAdminDialogOpen] = useState(false);

  const handleReferralSuccess = () => {
    setReferralDialogOpen(false);
    setAdminDialogOpen(true);
    toast.success("Admin mode activated!");
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6">
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2 text-xl font-semibold sm:text-2xl">
            <span
              onClick={handleClick}
              className={`inline-block cursor-pointer transition-transform duration-200 ease-in-out hover:scale-110 ${
                isRotating ? "rotate-45" : "rotate-0"
              }`}
            >
              ⚙️
            </span>
            Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6">
          <SettingsForm />
        </CardContent>
      </Card>
      <ReferralDialog
        open={referralDialogOpen}
        onOpenChange={setReferralDialogOpen}
        onSuccess={handleReferralSuccess}
      />
      <AdminDialog
        open={adminDialogOpen}
        onOpenChange={setAdminDialogOpen}
      />
    </div>
  );
};

export default SettingsPage;
