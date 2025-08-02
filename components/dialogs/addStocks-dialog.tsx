"use client";

import * as React from "react";
import { useMutation } from "convex/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "next-auth/react";

const stockFormSchema = z.object({
  // Required fields only
  symbol: z.string().min(1, "Symbol is required").max(10, "Symbol too long"),
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  currentPrice: z.number().min(0.01, "Price must be greater than 0"),

  // Optional fields
  description: z.string().optional(),
  logoUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  sector: z.string().optional(),
  openPrice: z.number().min(0, "Open price must be positive").optional(),
  previousClosePrice: z
    .number()
    .min(0, "Previous close must be positive")
    .optional(),
  volume: z.number().min(0, "Volume must be positive").optional(),
  marketCap: z.number().min(0, "Market cap must be positive").optional(),
});

const sectors = [
  "Technology",
  "Healthcare",
  "Financial Services",
  "Consumer Cyclical",
  "Industrials",
  "Communication Services",
  "Consumer Defensive",
  "Energy",
  "Utilities",
  "Real Estate",
  "Basic Materials",
];

interface AddStocksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddStocksDialog({ open, onOpenChange }: AddStocksDialogProps) {
  const [isPending, startTransition] = React.useTransition();
  const [activeTab, setActiveTab] = React.useState("basic");
  const session = useSession();
  const createStock = useMutation(api.stock.createStock);

  const form = useForm<z.infer<typeof stockFormSchema>>({
    resolver: zodResolver(stockFormSchema),
    defaultValues: {
      symbol: "",
      name: "",
      currentPrice: 0,
      description: "",
      logoUrl: "",
      sector: "",
      openPrice: undefined,
      previousClosePrice: undefined,
      volume: undefined,
      marketCap: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof stockFormSchema>) => {
    if (!session?.data?.user?.id) {
      toast.error("User session not found. Cannot perform update.");
      return;
    }

    startTransition(async () => {
      try {
        const result = await createStock({
          ...values,
          createdBy: session.data.user.id,
          isActive: true,
          isFrozen: false,
        });

        if (result) {
          toast.success("Stock created successfully!");
          form.reset();
          onOpenChange(false);
          setActiveTab("basic"); // Reset to first tab
        } else {
          toast.error("Failed to create stock. Please try again.");
        }
      } catch (error) {
        console.error("Error creating stock:", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to create stock",
        );
      }
    });
  };

  const validateCurrentTab = async () => {
    if (activeTab === "basic") {
      return await form.trigger(["symbol", "name", "currentPrice"]);
    }
    return true;
  };

  const handleTabChange = async (newTab: string) => {
    const isValid = await validateCurrentTab();
    if (isValid || newTab === "basic") {
      setActiveTab(newTab);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Stock</DialogTitle>
          <DialogDescription>
            Create a new stock entry for the trading simulation. Fill in the
            basic information to get started.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>

              {/* Basic Information Tab */}
              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="symbol"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock Symbol *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="AAPL"
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.value.toUpperCase())
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Apple Inc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="currentPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Price * ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="150.00"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sector"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sector</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a sector" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {sectors.map((sector) => (
                            <SelectItem key={sector} value={sector}>
                              {sector}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>

              {/* Pricing Information Tab */}
              <TabsContent value="pricing" className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="openPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Open Price ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="148.50"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                parseFloat(e.target.value) || undefined,
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="previousClosePrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Previous Close ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="149.75"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                parseFloat(e.target.value) || undefined,
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="volume"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Volume</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="1000000"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                parseInt(e.target.value) || undefined,
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="marketCap"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Market Cap ($)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="2500000000000"
                            {...field}
                            onChange={(e) =>
                              field.onChange(
                                parseInt(e.target.value) || undefined,
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              {/* Additional Details Tab */}
              <TabsContent value="details" className="space-y-4">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Brief description of the company..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="logoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com/logo.png"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>

            <DialogFooter className="flex justify-between">
              <div className="flex gap-2">
                {activeTab !== "basic" && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const tabs = ["basic", "pricing", "details"];
                      const currentIndex = tabs.indexOf(activeTab);
                      if (currentIndex > 0)
                        setActiveTab(tabs[currentIndex - 1]!);
                    }}
                  >
                    Previous
                  </Button>
                )}
                {activeTab !== "details" && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={async () => {
                      const isValid = await validateCurrentTab();
                      if (isValid) {
                        const tabs = ["basic", "pricing", "details"];
                        const currentIndex = tabs.indexOf(activeTab);
                        if (currentIndex < tabs.length - 1)
                          setActiveTab(tabs[currentIndex + 1]!);
                      }
                    }}
                  >
                    Next
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Creating..." : "Create Stock"}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
