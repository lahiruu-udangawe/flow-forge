import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Upload, FileText, X, Bold, Italic, List, ListOrdered, Link2 } from "lucide-react";
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
import { toast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const memoFormSchema = z.object({
  subject: z.string().min(1, "Subject is required").max(200),
  addressedTo: z.string().min(1, "Addressed to is required"),
  addressedToDesignation: z.string().optional(),
  from: z.string().min(1, "From is required"),
  fromDesignation: z.string().optional(),
  department: z.string().min(1, "Department is required"),
  referenceNumber: z.string().optional(),
  body: z.string().min(20, "Memo body must be at least 20 characters"),
  priority: z.enum(["normal", "urgent", "confidential"]),
});

type MemoFormValues = z.infer<typeof memoFormSchema>;

const departments = [
  "Finance",
  "IT",
  "HR",
  "Operations",
  "Marketing",
  "Administration",
  "Procurement",
  "Risk Management",
  "Compliance",
  "Internal Audit",
];

const designations = [
  "Managing Director",
  "Deputy Managing Director",
  "Chief Executive Officer",
  "General Manager",
  "Deputy General Manager",
  "Assistant General Manager",
  "Senior Manager",
  "Manager",
  "Assistant Manager",
  "Senior Officer",
  "Officer",
];

interface MemoFormProps {
  onSubmit: (data: MemoFormValues, action: 'draft' | 'submit') => void;
  initialData?: Partial<MemoFormValues>;
}

export function MemoForm({ onSubmit, initialData }: MemoFormProps) {
  const [attachments, setAttachments] = useState<File[]>([]);
  
  const form = useForm<MemoFormValues>({
    resolver: zodResolver(memoFormSchema),
    defaultValues: {
      subject: initialData?.subject || "",
      addressedTo: initialData?.addressedTo || "",
      addressedToDesignation: initialData?.addressedToDesignation || "",
      from: initialData?.from || "John Doe",
      fromDesignation: initialData?.fromDesignation || "Senior Manager",
      department: initialData?.department || "",
      referenceNumber: initialData?.referenceNumber || "",
      body: initialData?.body || "",
      priority: initialData?.priority || "normal",
    },
  });

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
        title: action === 'draft' ? "Draft Saved" : "Memo Submitted",
        description: action === 'draft' 
          ? "Your memo has been saved as a draft."
          : "Your memo has been submitted for approval.",
      });
    })();
  };

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-destructive text-destructive-foreground";
      case "confidential":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Form {...form}>
      <div className="space-y-6">
        {/* Memo Header */}
        <Card className="border-border">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Office Memo</CardTitle>
              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityBadgeClass(form.watch("priority"))}`}>
                {form.watch("priority").charAt(0).toUpperCase() + form.watch("priority").slice(1)}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Recipient Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Recipient</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="addressedTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>To</FormLabel>
                      <FormControl>
                        <Input placeholder="Recipient name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="addressedToDesignation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Designation</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select designation" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-card">
                          {designations.map((des) => (
                            <SelectItem key={des} value={des}>{des}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Sender Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Sender</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="from"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fromDesignation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Designation</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-background">
                            <SelectValue placeholder="Select designation" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-card">
                          {designations.map((des) => (
                            <SelectItem key={des} value={des}>{des}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Meta Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Details</h3>
              <div className="grid gap-4 md:grid-cols-3">
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
                  name="referenceNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reference Number (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="REF-2025-001" {...field} />
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
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                          <SelectItem value="confidential">Confidential</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subject & Body */}
        <Card className="border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Memo Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter memo subject" 
                      className="text-lg font-medium"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Memo Body</FormLabel>
                  <div className="space-y-2">
                    {/* Formatting Toolbar */}
                    <div className="flex items-center gap-1 rounded-md border border-border bg-background p-1">
                      <ToggleGroup type="multiple" className="gap-0">
                        <ToggleGroupItem value="bold" size="sm" className="h-8 w-8 p-0">
                          <Bold className="h-4 w-4" />
                        </ToggleGroupItem>
                        <ToggleGroupItem value="italic" size="sm" className="h-8 w-8 p-0">
                          <Italic className="h-4 w-4" />
                        </ToggleGroupItem>
                      </ToggleGroup>
                      <Separator orientation="vertical" className="h-6" />
                      <ToggleGroup type="single" className="gap-0">
                        <ToggleGroupItem value="bullet" size="sm" className="h-8 w-8 p-0">
                          <List className="h-4 w-4" />
                        </ToggleGroupItem>
                        <ToggleGroupItem value="number" size="sm" className="h-8 w-8 p-0">
                          <ListOrdered className="h-4 w-4" />
                        </ToggleGroupItem>
                      </ToggleGroup>
                      <Separator orientation="vertical" className="h-6" />
                      <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Link2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <FormControl>
                      <Textarea 
                        placeholder="Write your memo content here..."
                        className="min-h-[250px] resize-none font-serif"
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Attachments Section */}
        <Card className="border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Supporting Documents</CardTitle>
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
