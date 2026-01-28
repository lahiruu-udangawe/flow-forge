import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2, Upload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

const prItemSchema = z.object({
  id: z.string(),
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unitPrice: z.number().min(0, "Unit price must be positive"),
  unit: z.string().min(1, "Unit is required"),
  specifications: z.string().optional(),
});

const prFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  department: z.string().min(1, "Department is required"),
  category: z.string().min(1, "Category is required"),
  items: z.array(prItemSchema).min(1, "At least one item is required"),
  justification: z.string().min(10, "Justification must be at least 10 characters"),
  suggestedVendor: z.string().optional(),
  currency: z.string().min(1, "Currency is required"),
  priority: z.enum(["low", "medium", "high", "urgent"]),
});

type PRFormValues = z.infer<typeof prFormSchema>;

const departments = [
  "Finance",
  "IT",
  "HR",
  "Operations",
  "Marketing",
  "Administration",
  "Procurement",
];

const categories = [
  "IT Equipment",
  "Office Supplies",
  "Furniture",
  "Software & Licenses",
  "Professional Services",
  "Maintenance",
  "Other",
];

interface PRFormProps {
  onSubmit: (data: PRFormValues, action: 'draft' | 'submit') => void;
  initialData?: Partial<PRFormValues>;
}

export function PRForm({ onSubmit, initialData }: PRFormProps) {
  const [attachments, setAttachments] = useState<File[]>([]);
  
  const form = useForm<PRFormValues>({
    resolver: zodResolver(prFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      department: initialData?.department || "",
      category: initialData?.category || "",
      items: initialData?.items || [
        { id: crypto.randomUUID(), description: "", quantity: 1, unitPrice: 0, unit: "pcs", specifications: "" }
      ],
      justification: initialData?.justification || "",
      suggestedVendor: initialData?.suggestedVendor || "",
      currency: initialData?.currency || "USD",
      priority: initialData?.priority || "medium",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const calculateTotal = () => {
    const items = form.watch("items");
    return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      return validTypes.includes(file.type) && file.size <= maxSize;
    });
    setAttachments(prev => [...prev, ...validFiles]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitForm = (action: 'draft' | 'submit') => {
    form.handleSubmit((data) => {
      onSubmit(data, action);
      toast({
        title: action === 'draft' ? "Draft Saved" : "PR Submitted",
        description: action === 'draft' 
          ? "Your purchase requisition has been saved as a draft."
          : "Your purchase requisition has been submitted for approval.",
      });
    })();
  };

  return (
    <Form {...form}>
      <div className="space-y-6">
        {/* Header Section */}
        <Card className="border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Purchase Requisition Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PR Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter PR title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-card">
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-card">
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-card">
                        {categories.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="suggestedVendor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Suggested Vendor (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter vendor name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-card">
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="BDT">BDT - Bangladeshi Taka</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Items Section */}
        <Card className="border-border">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Line Items</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ id: crypto.randomUUID(), description: "", quantity: 1, unitPrice: 0, unit: "pcs", specifications: "" })}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="rounded-lg border border-border bg-background p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Item {index + 1}</span>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name={`items.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input placeholder="Item description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.specifications`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Specifications (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Technical specifications" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                  <FormField
                    control={form.control}
                    name={`items.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="1" 
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.unit`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-background">
                              <SelectValue placeholder="Unit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-card">
                            <SelectItem value="pcs">Pieces</SelectItem>
                            <SelectItem value="sets">Sets</SelectItem>
                            <SelectItem value="boxes">Boxes</SelectItem>
                            <SelectItem value="units">Units</SelectItem>
                            <SelectItem value="licenses">Licenses</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.unitPrice`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit Price</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0.00" 
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div>
                    <FormLabel>Subtotal</FormLabel>
                    <div className="flex h-10 items-center rounded-md border border-border bg-muted px-3 text-sm font-medium">
                      {form.watch("currency")} {(form.watch(`items.${index}.quantity`) * form.watch(`items.${index}.unitPrice`)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Total */}
            <div className="flex justify-end pt-4 border-t border-border">
              <div className="text-right">
                <span className="text-sm text-muted-foreground">Estimated Total</span>
                <p className="text-2xl font-bold text-foreground">
                  {form.watch("currency")} {calculateTotal().toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Justification Section */}
        <Card className="border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Justification</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="justification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Justification</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Explain why this purchase is necessary..."
                      className="min-h-[120px] resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Attachments Section */}
        <Card className="border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Attachments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-border bg-background p-8">
                <label className="flex cursor-pointer flex-col items-center gap-2 text-center">
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Drop files here or click to upload
                  </span>
                  <span className="text-xs text-muted-foreground">
                    PDF, DOC, DOCX, JPG, PNG (Max 10MB)
                  </span>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {attachments.length > 0 && (
                <div className="space-y-2">
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between rounded-lg border border-border bg-background p-3">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAttachment(index)}
                        className="h-8 w-8"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => handleSubmitForm('draft')}>
            Save as Draft
          </Button>
          <Button type="button" onClick={() => handleSubmitForm('submit')}>
            Submit for Approval
          </Button>
        </div>
      </div>
    </Form>
  );
}
