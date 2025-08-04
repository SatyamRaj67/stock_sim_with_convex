"use client";

import type * as z from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { LoginSchema } from "@/schemas";

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

import { CardWrapper } from "@/components/auth/card/card-wrapper";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { login } from "@/actions/login";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { motion, AnimatePresence } from "framer-motion";

export const LoginForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider!"
      : "";

  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [isBreaking, setIsBreaking] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [proceedAnyway, setProceedAnyway] = useState(false);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const triggerBreakdown = () => {
    setIsBreaking(true);
    // Show message after elements have scattered
    setTimeout(() => {
      setShowMessage(true);
    }, 1500);
  };

  const resetForm = () => {
    setIsBreaking(false);
    setShowMessage(false);
    setProceedAnyway(false);
  };

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    // Check if user is trying to use email functionality without proceeding
    if (!proceedAnyway && values.email && !showTwoFactor) {
      triggerBreakdown();
      return;
    }

    setError("");
    setSuccess("");

    startTransition(() => {
      login(values, callbackUrl)
        .then((data) => {
          if (data?.error) {
            form.reset();
            setError(data.error);
          }

          if (data?.success) {
            form.reset();
            setSuccess(data.success);
          }

          if (data?.twoFactor) {
            setShowTwoFactor(true);
          }
        })
        .catch(() => {
          setError("Something went wrong!");
        });
    });
  };

  const handleProceedAnyway = () => {
    setProceedAnyway(true);
    resetForm();
    // Trigger form submission after reset
    setTimeout(() => {
      const values = form.getValues();
      onSubmit(values);
    }, 100);
  };

  // Random positions for scattered elements
  const getRandomPosition = () => ({
    x: (Math.random() - 0.5) * 800,
    y: (Math.random() - 0.5) * 600,
    rotate: (Math.random() - 0.5) * 360,
  });

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Main Form Container */}
      <motion.div
        animate={isBreaking ? getRandomPosition() : { x: 0, y: 0, rotate: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative z-10"
      >
        <CardWrapper
          headerLabel="Welcome Back"
          backButtonLabel="Don't have an account?"
          backButtonHref="/auth/register"
          showSocial
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                {showTwoFactor && (
                  <motion.div
                    animate={
                      isBreaking
                        ? getRandomPosition()
                        : { x: 0, y: 0, rotate: 0 }
                    }
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem className="flex flex-col items-center">
                          <FormLabel className="text-center">
                            Two-Factor Code
                          </FormLabel>
                          <FormControl className="flex justify-center">
                            <InputOTP
                              {...field}
                              maxLength={6}
                              disabled={isPending}
                              pattern={REGEXP_ONLY_DIGITS}
                            >
                              <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                              </InputOTPGroup>
                              <InputOTPSeparator />
                              <InputOTPGroup>
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                              </InputOTPGroup>
                            </InputOTP>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                )}
                {!showTwoFactor && (
                  <div className="space-y-4">
                    {/* Email Field */}
                    <motion.div
                      animate={
                        isBreaking
                          ? getRandomPosition()
                          : { x: 0, y: 0, rotate: 0 }
                      }
                      transition={{ duration: 1.2, delay: 0.1 }}
                    >
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel> Email</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={isPending}
                                placeholder="ananya@mine.com"
                                type="email"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>

                    {/* Password Field */}
                    <motion.div
                      animate={
                        isBreaking
                          ? getRandomPosition()
                          : { x: 0, y: 0, rotate: 0 }
                      }
                      transition={{ duration: 0.9, delay: 0.3 }}
                    >
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel> Password</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                disabled={isPending}
                                placeholder="******"
                                type="password"
                              />
                            </FormControl>
                            <motion.div
                              animate={
                                isBreaking
                                  ? getRandomPosition()
                                  : { x: 0, y: 0, rotate: 0 }
                              }
                              transition={{ duration: 1.1, delay: 0.4 }}
                            >
                              <Button
                                size="sm"
                                variant="link"
                                asChild
                                className="px-0 font-normal"
                              >
                                <Link href="/auth/reset">Forgot Password?</Link>
                              </Button>
                            </motion.div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  </div>
                )}
              </div>

              {/* Form Messages */}
              <motion.div
                animate={
                  isBreaking ? getRandomPosition() : { x: 0, y: 0, rotate: 0 }
                }
                transition={{ duration: 0.7, delay: 0.5 }}
              >
                <FormError message={error ?? urlError} />
                <FormSuccess message={success} />
              </motion.div>

              {/* Submit Button */}
              <motion.div
                animate={
                  isBreaking ? getRandomPosition() : { x: 0, y: 0, rotate: 0 }
                }
                transition={{ duration: 1.3, delay: 0.2 }}
              >
                <Button disabled={isPending} type="submit" className="w-full">
                  {showTwoFactor ? "Confirm" : "Login"}
                </Button>
              </motion.div>
            </form>
          </Form>
        </CardWrapper>
      </motion.div>

      {/* Chaotic Message Overlay */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ scale: 0, rotate: 180, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: -180, opacity: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.6 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 100 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative mx-4 max-w-md overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 via-gray-500 to-gray-800 p-8 text-white shadow-2xl"
            >
              <div className="relative z-10 space-y-4 text-center">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="text-6xl"
                >
                  🚨
                </motion.div>

                <h2 className="text-2xl font-bold">SYSTEM BREAKDOWN!</h2>

                <div className="space-y-3 text-sm">
                  <p>
                    🎭 <strong>Oops!</strong> You just broke the internet!
                  </p>
                  <p>
                    📧 <strong>Email services are offline:</strong> Resend needs
                    a verified domain, but we're still in dev mode!
                  </p>
                  <p className="text-xs opacity-80">
                    💡{" "}
                    <em>
                      Pro tip: You can still create an account with socials
                    </em>
                  </p>
                </div>

                <div className="mt-6 flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={resetForm}
                    className="flex-1 rounded-lg bg-white/20 px-4 py-2 transition-colors hover:bg-white/30"
                  >
                    🔧 Fix It!
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleProceedAnyway}
                    className="flex-1 rounded-lg bg-white px-4 py-2 font-semibold text-black transition-colors hover:bg-gray-200"
                  >
                    🚀 Proceed Anyway
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
