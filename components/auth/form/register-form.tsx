"use client";

import type * as z from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { RegisterSchema } from "@/schemas";

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
import { register } from "@/actions/register";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const RegisterForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [isPending, startTransition] = useTransition();
  const [isBreaking, setIsBreaking] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [proceedAnyway, setProceedAnyway] = useState(false);

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
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

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    // Check if user is trying to use email functionality without proceeding
    if (!proceedAnyway && values.email) {
      triggerBreakdown();
      return;
    }

    setError("");
    setSuccess("");

    startTransition(async () => {
      await register(values).then((response) => {
        setError(response.error);
        setSuccess(response.success);
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
          headerLabel="Create an Account"
          backButtonLabel="Already have an account?"
          backButtonHref="/auth/login"
          showSocial
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                {/* Name Field */}
                <motion.div
                  animate={
                    isBreaking ? getRandomPosition() : { x: 0, y: 0, rotate: 0 }
                  }
                  transition={{ duration: 1.1, delay: 0.1 }}
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel> Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder="Ananya"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>

                {/* Email Field */}
                <motion.div
                  animate={
                    isBreaking ? getRandomPosition() : { x: 0, y: 0, rotate: 0 }
                  }
                  transition={{ duration: 1.3, delay: 0.2 }}
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
                    isBreaking ? getRandomPosition() : { x: 0, y: 0, rotate: 0 }
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
              </div>

              {/* Form Messages */}
              <motion.div
                animate={
                  isBreaking ? getRandomPosition() : { x: 0, y: 0, rotate: 0 }
                }
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <FormError message={error} />
                <FormSuccess message={success} />
              </motion.div>

              {/* Submit Button */}
              <motion.div
                animate={
                  isBreaking ? getRandomPosition() : { x: 0, y: 0, rotate: 0 }
                }
                transition={{ duration: 1.2, delay: 0.15 }}
              >
                <Button disabled={isPending} type="submit" className="w-full">
                  Register
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
                  animate={{
                    rotate: [0, 15, -15, 0],
                    scale: [1, 1.1, 0.9, 1],
                  }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="text-6xl"
                >
                  💥
                </motion.div>

                <h2 className="text-2xl font-bold">REGISTRATION MELTDOWN!</h2>

                <div className="space-y-3 text-sm">
                  <p>
                    🎪 <strong>Welcome to the chaos!</strong> You've triggered
                    our email apocalypse!
                  </p>
                  <p>
                    📧 <strong>Email verification is broken:</strong> Resend
                    requires a verified domain, but we're still in development
                    mode!
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
                    🔧 Reset
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleProceedAnyway}
                    className="flex-1 rounded-lg bg-white px-4 py-2 font-semibold text-black transition-colors hover:bg-gray-200"
                  >
                    🎯 Register Anyway
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
