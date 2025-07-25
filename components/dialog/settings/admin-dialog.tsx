"use client";

import * as z from "zod";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@/types";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface AdminDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AdminSchema = z.object({
  balance: z.number().min(0, "Balance must be a positive number"),
  role: z.enum([UserRole.USER, UserRole.ADMIN]),
});

export function AdminDialog({ open, onOpenChange }: AdminDialogProps) {
  const [isPending, startTransition] = useTransition();
  const { data: session, update: updateSession } = useSession();

  const user = useQuery(
    api.user.getUserById,
    session?.user?.id ? { id: session.user.id } : "skip",
  );
  const updateUser = useMutation(api.user.updateUserById);

  const form = useForm<z.infer<typeof AdminSchema>>({
    resolver: zodResolver(AdminSchema),
    defaultValues: {
      balance: 10000,
      role: UserRole.USER,
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        balance: user.balance || 10000,
        role: (user.role as UserRole) || UserRole.USER,
      });
    }
  }, [user, form]);

  // Handle form submission
  const onSubmit = (values: z.infer<typeof AdminSchema>) => {
    if (!session!.user.id) {
      toast.error("User session not found. Cannot perform update.");
      return;
    }
    startTransition(async () => {
      await updateUser({
        id: session!.user.id,
        data: values,
      });
      toast.success("Updated successfully!");
      updateSession();
      onOpenChange(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Dev Control Panel</DialogTitle>
          <DialogDescription>
            Modify your own role and balance.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={UserRole.USER}>USER</SelectItem>
                      <SelectItem value={UserRole.ADMIN}>ADMIN</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="balance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Balance</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      min={0}
                      disabled={isPending}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Updating..." : "Update My Account"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
