import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface ApprovalActionsProps {
  currentApprover: string;
  itemId: string;
  itemType: "PR" | "Memo";
}

const ApprovalActions = ({ currentApprover, itemId, itemType }: ApprovalActionsProps) => {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAction = (action: "approve" | "reject") => {
    if (action === "reject" && !comment.trim()) {
      toast.error("Please add a comment when rejecting.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success(
        `${itemType} ${itemId} has been ${action === "approve" ? "approved" : "rejected"} successfully.`
      );
      setComment("");
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <Card className="border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-base">Take Action</CardTitle>
        <p className="text-xs text-muted-foreground">
          Currently pending approval from <span className="font-medium text-foreground">{currentApprover}</span>
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
            Comment
          </label>
          <Textarea
            placeholder="Add a comment (required for rejection)..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[80px] resize-none"
          />
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => handleAction("approve")}
            disabled={isSubmitting}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <CheckCircle2 className="h-4 w-4" />
            Approve
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleAction("reject")}
            disabled={isSubmitting}
          >
            <XCircle className="h-4 w-4" />
            Reject
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApprovalActions;
