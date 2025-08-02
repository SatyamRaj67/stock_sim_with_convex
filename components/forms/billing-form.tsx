"use client"

import React, {  useState, useTransition } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { Button } from "../ui/button";
import { coupon } from "@/actions/coupon";

export const CouponSchema = z.object({
  code: z.string().min(1, {
    message: "Coupon code is required",
  }),
});

const BillingForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof CouponSchema>>({
    resolver: zodResolver(CouponSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = (values: z.infer<typeof CouponSchema>) => {
    startTransition(() => {
      coupon(values)
        .then(async (data) => {
          if (data?.error) {
            setError(data.error);
          }
          if (data?.success) {
            setSuccess(data.success);
          }
        })
        .catch(() => setError("An error occurred!"));
    });
  };

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-center text-2xl font-semibold">🏷️Coupon</p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coupon Code</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter your coupon code" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button disabled={isPending} type="submit">
              Apply
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default BillingForm;
