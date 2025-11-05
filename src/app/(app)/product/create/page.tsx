"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { useToast } from "@/hooks/use-toast";
import { useCategories } from "@/hooks/useCategoryQueries";
import { useUOMs } from "@/hooks/useUOMQueries";
import { api } from "@/lib/api";
import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";

const productFormSchema = z.object({
  code: z.string().min(1, "Product code is required"),
  name: z.string().min(1, "Product name is required"),
  name_kh: z.string().optional(),
  description: z.string().optional(),
  cost_price: z
    .union([z.number(), z.string()])
    .transform((val) => (typeof val === "string" ? parseFloat(val) || 0 : val))
    .pipe(z.number().min(0, "Cost price must be positive")),
  selling_price: z
    .union([z.number(), z.string()])
    .transform((val) => (typeof val === "string" ? parseFloat(val) || 0 : val))
    .pipe(z.number().min(0, "Selling price must be positive")),
  uom_id: z.number().min(1, "Unit of measure is required"),
  category_code: z.string().min(1, "Category is required"),
  thumbnail: z.string().min(1, "Thumbnail is required"),
});

type ProductFormData = z.infer<typeof productFormSchema>;

export default function CreateProductPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: uoms, isLoading: uomsLoading } = useUOMs();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedFilePath, setUploadedFilePath] = useState<string>("");

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      code: "",
      name: "",
      name_kh: "",
      description: "",
      cost_price: 0,
      selling_price: 0,
      uom_id: 0,
      category_code: "",
      thumbnail: "",
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive",
        });
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setUploadedFilePath("");
    form.setValue("thumbnail", "");
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select an image file first",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const response = await api.uploadAttachment(selectedFile, "product");
      setUploadedFilePath(response.data.file_path);
      form.setValue("thumbnail", response.data.file_path);
      toast({
        title: "Upload successful",
        description: "Image uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    // Prepare data for API (ensure all fields are properly typed)
    const submitData = {
      code: data.code,
      name: data.name,
      name_kh: data.name_kh || "",
      description: data.description || "",
      cost_price: data.cost_price,
      selling_price: data.selling_price,
      uom_id: data.uom_id,
      category_code: data.category_code,
      thumbnail: data.thumbnail,
    };

    setIsSubmitting(true);
    try {
      await api.createProduct(submitData);
      toast({
        title: "Success",
        description: "Product created successfully",
      });
      router.push("/product");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create product",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Product</CardTitle>
          <CardDescription>Add a new product to your catalog</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Code and Name Row */}
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Code *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="TIGER01"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            // Auto-uppercase code
                            if (e.target.value) {
                              form.setValue(
                                "code",
                                e.target.value.toUpperCase()
                              );
                            }
                          }}
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
                      <FormLabel>Product Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Tiger regular" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Name Kh Row */}
              <FormField
                control={form.control}
                name="name_kh"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name (Khmer)</FormLabel>
                    <FormControl>
                      <Input placeholder="Tiger regular" {...field} />
                    </FormControl>
                    <FormDescription>
                      Optional: Product name in Khmer language
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Product description"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Prices Row */}
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="cost_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cost Price *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="15.00"
                          {...field}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value) || 0;
                            field.onChange(value);
                          }}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="selling_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Selling Price *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="17.10"
                          {...field}
                          onChange={(e) => {
                            const value = parseFloat(e.target.value) || 0;
                            field.onChange(value);
                          }}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* UOM and Category Row */}
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="uom_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unit of Measure *</FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(parseInt(value));
                        }}
                        value={field.value?.toString() || ""}
                        disabled={uomsLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select UOM" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {uoms?.map((uom) => (
                            <SelectItem key={uom.id} value={uom.id.toString()}>
                              <div className="flex items-center gap-2">
                                <span>
                                  {uom.symbol || uom.name}
                                  {uom.symbol && (
                                    <span className="text-muted-foreground ml-1">
                                      ({uom.name})
                                    </span>
                                  )}
                                </span>
                                {uom.name_kh && (
                                  <span className="text-xs text-muted-foreground font-khmer">
                                    {uom.name_kh}
                                  </span>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={categoriesLoading}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories?.map((category) => (
                            <SelectItem
                              key={category.code}
                              value={category.code}
                            >
                              <div className="flex items-center gap-2">
                                <span>{category.name}</span>
                                {category.name_kh && (
                                  <span className="text-xs text-muted-foreground font-khmer">
                                    {category.name_kh}
                                  </span>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Thumbnail Upload */}
              <FormField
                control={form.control}
                name="thumbnail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Image *</FormLabel>
                    <FormControl>
                      {/* Hidden input to register with react-hook-form */}
                      <Input
                        type="hidden"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <div className="space-y-4">
                      {!previewUrl ? (
                        <div className="flex items-center gap-4">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="max-w-md"
                          />
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="relative inline-block">
                            <div className="relative h-48 w-48 rounded-lg border border-border overflow-hidden">
                              <Image
                                src={previewUrl}
                                alt="Preview"
                                fill
                                className="object-cover"
                              />
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                              onClick={handleRemoveFile}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          {!uploadedFilePath && (
                            <Button
                              type="button"
                              onClick={handleUpload}
                              disabled={isUploading}
                              variant="outline"
                            >
                              {isUploading ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Uploading...
                                </>
                              ) : (
                                <>
                                  <Upload className="mr-2 h-4 w-4" />
                                  Upload Image
                                </>
                              )}
                            </Button>
                          )}
                          {uploadedFilePath && (
                            <div className="text-sm text-muted-foreground">
                              ✓ Image uploaded successfully
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <FormDescription>
                      Upload a product thumbnail image (max 5MB)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit Buttons */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  disabled={isSubmitting || isUploading}
                  className="min-w-[120px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Product"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isSubmitting || isUploading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
