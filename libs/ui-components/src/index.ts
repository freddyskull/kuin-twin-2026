// Export utilities
export { cn, getAbsoluteUrl, formatCurrency } from "./lib/utils";

// Export components
export { Button, buttonVariants } from "./components/ui/button";
export type { ButtonProps } from "./components/ui/button";
export { Input } from "./components/ui/input";
export { Label } from "./components/ui/label";
export { FormInput } from "./components/form-input";
export { FormSelect } from "./components/form-select";
export { FormCheckbox } from "./components/form-checkbox";
export { FormSelect as SharedFormSelect } from "./components/form-select"; // Evitar colisión si es necesario
export { FormSwitch } from "./components/form-switch";
export { FormTextarea } from "./components/form-textarea";
export { CustomForm } from "./components/custom-form";
// export { MapSelector, geocode } from "./components/map-selector";
export { FormChips } from "./components/form-chips";
export { DataTable } from "./components/data-table";
export { SmartSubmitButton } from "./components/smart-submit-button";
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from "./components/ui/select";
export { Textarea } from "./components/ui/textarea";
export { Checkbox } from "./components/ui/checkbox";
export { Switch } from "./components/ui/switch";


// Export toast components
export { Toaster } from "./components/ui/toaster";
export { useToast } from "./hooks/use-toast";
export {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  type ToastProps,
  type ToastActionElement,
} from "./components/ui/toast";

// Export sidebar components
export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "./components/ui/sidebar";

export { AppSidebar } from "./components/app-sidebar";
export { SearchForm } from "./components/search-form";
export { VersionSwitcher } from "./components/version-switcher";
export { NavMain } from "./components/nav-main";
export { NavProjects } from "./components/nav-projects";
export { NavUser } from "./components/nav-user";
export { TeamSwitcher } from "./components/team-switcher";

// Export other UI components
export {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "./components/ui/breadcrumb";

export {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "./components/ui/collapsible";

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from "./components/ui/dropdown-menu";

export { Separator } from "./components/ui/separator";

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "./components/ui/sheet";

export { Skeleton } from "./components/ui/skeleton";

export {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "./components/ui/tooltip";

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption } from "./components/ui/table";
export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent } from "./components/ui/card";
export { Badge, badgeVariants } from "./components/ui/badge";
export { ServiceCard } from "./components/service-card";
export { ServiceGallery } from "./components/service-gallery";
export { ServiceFaqs } from "./components/service-faqs";
export { ServiceDetailPreview } from "./components/service-detail-preview";
export { NotificationBell } from "./components/notification-bell";
export type { NotificationMessage, NotificationBellProps } from "./components/notification-bell";
