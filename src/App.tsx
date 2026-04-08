import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import PurchaseRequisitions from "./pages/PurchaseRequisitions";
import PRDetail from "./pages/PRDetail";
import Memos from "./pages/Memos";
import MemoDetail from "./pages/MemoDetail";
import WorkflowBuilderPage from "./pages/WorkflowBuilderPage";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/purchase-requisitions" element={<PurchaseRequisitions />} />
          <Route path="/purchase-requisitions/new" element={<PurchaseRequisitions />} />
          <Route path="/purchase-requisitions/:id" element={<PRDetail />} />
          <Route path="/memos" element={<Memos />} />
          <Route path="/memos/new" element={<Memos />} />
          <Route path="/memos/:id" element={<MemoDetail />} />
          <Route path="/workflow-builder" element={<WorkflowBuilderPage />} />
          <Route path="/reports" element={<Reports />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
