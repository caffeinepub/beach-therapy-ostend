import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  LogOut,
  Pencil,
  Plus,
  Trash2,
  Upload,
  Waves,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob } from "../backend";
import type { CVEntry, PricingPackage, SessionContentItem } from "../backend.d";
import { CVType } from "../backend.d";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  photoBytesToUrl,
  useAddOrUpdateCVEntry,
  useAddOrUpdatePricingPackage,
  useAddOrUpdateSessionContentItem,
  useCVEntries,
  useContactFormSubmissions,
  useDeleteCVEntry,
  useDeletePricingPackage,
  useDeleteSessionContentItem,
  useIsAdmin,
  usePricingPackages,
  useSessionContentItems,
  useTherapistProfile,
  useUpdateProfilePhoto,
  useUpdateTherapistProfile,
} from "../hooks/useQueries";

// ---- Profile Tab ----
function ProfileTab() {
  const { data: profile } = useTherapistProfile();
  const updateProfile = useUpdateTherapistProfile();
  const updatePhoto = useUpdateProfilePhoto();
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ name: "", tagline: "", bio: "" });
  const [initialized, setInitialized] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  if (profile && !initialized) {
    setForm({ name: profile.name, tagline: profile.tagline, bio: profile.bio });
    setInitialized(true);
  }

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync({
        name: form.name,
        tagline: form.tagline,
        bio: form.bio,
        photo: profile?.photo ?? new Uint8Array(),
      });
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile.");
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((p) =>
        setUploadProgress(p),
      );
      await updatePhoto.mutateAsync(blob);
      toast.success("Photo updated!");
      setUploadProgress(0);
    } catch {
      toast.error("Failed to upload photo.");
      setUploadProgress(0);
    }
  };

  const profilePhotoUrl =
    profile?.photo && profile.photo.length > 0
      ? photoBytesToUrl(profile.photo)
      : null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-teal">
            Profile Photo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-sea border border-border">
              {profilePhotoUrl ? (
                <img
                  src={profilePhotoUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Waves className="w-8 h-8 text-teal/40" />
                </div>
              )}
            </div>
            <div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
              <Button
                variant="outline"
                className="rounded-full text-teal border-teal/30"
                onClick={() => fileRef.current?.click()}
                disabled={updatePhoto.isPending}
                data-ocid="profile.upload_button"
              >
                {updatePhoto.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading{" "}
                    {uploadProgress}%
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" /> Upload Photo
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-teal">
            Profile Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-teal uppercase tracking-wide">
              Name
            </Label>
            <Input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="rounded-xl"
              data-ocid="profile.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-teal uppercase tracking-wide">
              Tagline
            </Label>
            <Input
              value={form.tagline}
              onChange={(e) =>
                setForm((p) => ({ ...p, tagline: e.target.value }))
              }
              className="rounded-xl"
              data-ocid="profile.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-teal uppercase tracking-wide">
              Bio
            </Label>
            <Textarea
              value={form.bio}
              onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
              rows={6}
              className="rounded-xl resize-none"
              data-ocid="profile.textarea"
            />
          </div>
          <Button
            onClick={handleSave}
            disabled={updateProfile.isPending}
            className="rounded-full bg-tan text-teal-dark hover:bg-tan-dark"
            data-ocid="profile.save_button"
          >
            {updateProfile.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
              </>
            ) : (
              "Save Profile"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ---- CV Tab ----
const emptyCVEntry = (): Omit<CVEntry, "id"> => ({
  title: "",
  yearRange: "",
  type: CVType.education,
  description: "",
  organization: "",
});

function CVTab() {
  const { data: entries = [] } = useCVEntries();
  const addOrUpdate = useAddOrUpdateCVEntry();
  const deleteEntry = useDeleteCVEntry();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CVEntry | null>(null);
  const [form, setForm] = useState(emptyCVEntry());

  const openNew = () => {
    setEditing(null);
    setForm(emptyCVEntry());
    setOpen(true);
  };
  const openEdit = (e: CVEntry) => {
    setEditing(e);
    setForm({
      title: e.title,
      yearRange: e.yearRange,
      type: e.type,
      description: e.description,
      organization: e.organization,
    });
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      await addOrUpdate.mutateAsync({
        id: editing?.id ?? crypto.randomUUID(),
        ...form,
      });
      toast.success(editing ? "Entry updated!" : "Entry added!");
      setOpen(false);
    } catch {
      toast.error("Failed to save entry.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteEntry.mutateAsync(id);
      toast.success("Entry deleted.");
    } catch {
      toast.error("Failed to delete.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-display font-bold text-teal text-lg">
          CV Entries ({entries.length})
        </h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={openNew}
              className="rounded-full bg-tan text-teal-dark hover:bg-tan-dark"
              data-ocid="cv.open_modal_button"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl" data-ocid="cv.dialog">
            <DialogHeader>
              <DialogTitle className="font-display text-teal">
                {editing ? "Edit Entry" : "Add CV Entry"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-teal uppercase tracking-wide">
                    Title
                  </Label>
                  <Input
                    value={form.title}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, title: e.target.value }))
                    }
                    className="rounded-xl"
                    data-ocid="cv.input"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-teal uppercase tracking-wide">
                    Year Range
                  </Label>
                  <Input
                    value={form.yearRange}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, yearRange: e.target.value }))
                    }
                    placeholder="2018 – 2022"
                    className="rounded-xl"
                    data-ocid="cv.input"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-teal uppercase tracking-wide">
                  Organization
                </Label>
                <Input
                  value={form.organization}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, organization: e.target.value }))
                  }
                  className="rounded-xl"
                  data-ocid="cv.input"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-teal uppercase tracking-wide">
                  Type
                </Label>
                <Select
                  value={form.type as unknown as string}
                  onValueChange={(v) =>
                    setForm((p) => ({
                      ...p,
                      type: v as unknown as CVEntry["type"],
                    }))
                  }
                >
                  <SelectTrigger className="rounded-xl" data-ocid="cv.select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="experience">Experience</SelectItem>
                    <SelectItem value="certification">Certification</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-teal uppercase tracking-wide">
                  Description
                </Label>
                <Textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  rows={3}
                  className="rounded-xl resize-none"
                  data-ocid="cv.textarea"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="rounded-full"
                data-ocid="cv.cancel_button"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={addOrUpdate.isPending}
                className="rounded-full bg-tan text-teal-dark"
                data-ocid="cv.save_button"
              >
                {addOrUpdate.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div
        className="rounded-2xl overflow-hidden border border-border"
        data-ocid="cv.table"
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-sea/50">
              <TableHead className="font-body font-semibold text-teal text-xs uppercase tracking-wide">
                Title
              </TableHead>
              <TableHead className="font-body font-semibold text-teal text-xs uppercase tracking-wide">
                Organization
              </TableHead>
              <TableHead className="font-body font-semibold text-teal text-xs uppercase tracking-wide">
                Years
              </TableHead>
              <TableHead className="font-body font-semibold text-teal text-xs uppercase tracking-wide">
                Type
              </TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.length === 0 && (
              <TableRow data-ocid="cv.empty_state">
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground font-body text-sm py-8"
                >
                  No CV entries yet. Add your first one!
                </TableCell>
              </TableRow>
            )}
            {entries.map((entry, i) => (
              <TableRow key={entry.id} data-ocid={`cv.row.${i + 1}`}>
                <TableCell className="font-body font-medium text-sm text-teal">
                  {entry.title}
                </TableCell>
                <TableCell className="font-body text-sm text-foreground/70">
                  {entry.organization}
                </TableCell>
                <TableCell className="font-body text-sm text-foreground/70">
                  {entry.yearRange}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className="capitalize font-body text-xs"
                  >
                    {entry.type as unknown as string}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2 justify-end">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => openEdit(entry)}
                      className="w-8 h-8"
                      data-ocid={`cv.edit_button.${i + 1}`}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(entry.id)}
                      className="w-8 h-8 text-destructive"
                      data-ocid={`cv.delete_button.${i + 1}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ---- Sessions Tab ----
const emptySession = (): Omit<SessionContentItem, "id"> => ({
  title: "",
  description: "",
  iconName: "waves",
});

function SessionsTab() {
  const { data: items = [] } = useSessionContentItems();
  const addOrUpdate = useAddOrUpdateSessionContentItem();
  const deleteItem = useDeleteSessionContentItem();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<SessionContentItem | null>(null);
  const [form, setForm] = useState(emptySession());

  const openNew = () => {
    setEditing(null);
    setForm(emptySession());
    setOpen(true);
  };
  const openEdit = (item: SessionContentItem) => {
    setEditing(item);
    setForm({
      title: item.title,
      description: item.description,
      iconName: item.iconName,
    });
    setOpen(true);
  };

  const handleSave = async () => {
    try {
      await addOrUpdate.mutateAsync({
        id: editing?.id ?? crypto.randomUUID(),
        ...form,
      });
      toast.success(editing ? "Session updated!" : "Session added!");
      setOpen(false);
    } catch {
      toast.error("Failed to save.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteItem.mutateAsync(id);
      toast.success("Deleted.");
    } catch {
      toast.error("Failed to delete.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-display font-bold text-teal text-lg">
          Session Content ({items.length})
        </h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={openNew}
              className="rounded-full bg-tan text-teal-dark hover:bg-tan-dark"
              data-ocid="sessions.open_modal_button"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Item
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl" data-ocid="sessions.dialog">
            <DialogHeader>
              <DialogTitle className="font-display text-teal">
                {editing ? "Edit Session Item" : "Add Session Item"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-teal uppercase tracking-wide">
                    Title
                  </Label>
                  <Input
                    value={form.title}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, title: e.target.value }))
                    }
                    className="rounded-xl"
                    data-ocid="sessions.input"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-teal uppercase tracking-wide">
                    Icon Name
                  </Label>
                  <Input
                    value={form.iconName}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, iconName: e.target.value }))
                    }
                    placeholder="waves, walk, mindfulness..."
                    className="rounded-xl"
                    data-ocid="sessions.input"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-teal uppercase tracking-wide">
                  Description
                </Label>
                <Textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  rows={3}
                  className="rounded-xl resize-none"
                  data-ocid="sessions.textarea"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="rounded-full"
                data-ocid="sessions.cancel_button"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={addOrUpdate.isPending}
                className="rounded-full bg-tan text-teal-dark"
                data-ocid="sessions.save_button"
              >
                {addOrUpdate.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        data-ocid="sessions.list"
      >
        {items.length === 0 && (
          <div
            className="col-span-full text-center py-10 text-muted-foreground font-body text-sm"
            data-ocid="sessions.empty_state"
          >
            No session content items. Add your first one!
          </div>
        )}
        {items.map((item, i) => (
          <Card
            key={item.id}
            className="rounded-2xl border-border"
            data-ocid={`sessions.item.${i + 1}`}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-body font-bold text-teal text-sm">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground font-body">
                    Icon: {item.iconName}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => openEdit(item)}
                    className="w-7 h-7"
                    data-ocid={`sessions.edit_button.${i + 1}`}
                  >
                    <Pencil className="w-3 h-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(item.id)}
                    className="w-7 h-7 text-destructive"
                    data-ocid={`sessions.delete_button.${i + 1}`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <p className="text-xs text-foreground/70 font-body leading-relaxed line-clamp-2">
                {item.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ---- Pricing Tab ----
const emptyPkg = (): Omit<PricingPackage, "id"> => ({
  name: "",
  duration: "",
  price: 0,
  description: "",
  bulletPoints: [],
  highlighted: false,
});

function PricingTab() {
  const { data: packages = [] } = usePricingPackages();
  const addOrUpdate = useAddOrUpdatePricingPackage();
  const deletePkg = useDeletePricingPackage();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<PricingPackage | null>(null);
  const [form, setForm] = useState(emptyPkg());
  const [bulletInput, setBulletInput] = useState("");

  const openNew = () => {
    setEditing(null);
    setForm(emptyPkg());
    setBulletInput("");
    setOpen(true);
  };
  const openEdit = (pkg: PricingPackage) => {
    setEditing(pkg);
    setForm({
      name: pkg.name,
      duration: pkg.duration,
      price: pkg.price,
      description: pkg.description,
      bulletPoints: [...pkg.bulletPoints],
      highlighted: pkg.highlighted,
    });
    setBulletInput(pkg.bulletPoints.join("\n"));
    setOpen(true);
  };

  const handleSave = async () => {
    const bullets = bulletInput
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    try {
      await addOrUpdate.mutateAsync({
        id: editing?.id ?? crypto.randomUUID(),
        ...form,
        bulletPoints: bullets,
      });
      toast.success(editing ? "Package updated!" : "Package added!");
      setOpen(false);
    } catch {
      toast.error("Failed to save.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deletePkg.mutateAsync(id);
      toast.success("Package deleted.");
    } catch {
      toast.error("Failed to delete.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-display font-bold text-teal text-lg">
          Pricing Packages ({packages.length})
        </h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={openNew}
              className="rounded-full bg-tan text-teal-dark hover:bg-tan-dark"
              data-ocid="pricing.open_modal_button"
            >
              <Plus className="w-4 h-4 mr-2" /> Add Package
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-2xl" data-ocid="pricing.dialog">
            <DialogHeader>
              <DialogTitle className="font-display text-teal">
                {editing ? "Edit Package" : "Add Package"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-teal uppercase tracking-wide">
                    Name
                  </Label>
                  <Input
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    className="rounded-xl"
                    data-ocid="pricing.input"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-teal uppercase tracking-wide">
                    Duration
                  </Label>
                  <Input
                    value={form.duration}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, duration: e.target.value }))
                    }
                    placeholder="60 min"
                    className="rounded-xl"
                    data-ocid="pricing.input"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-teal uppercase tracking-wide">
                    Price (€)
                  </Label>
                  <Input
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, price: Number(e.target.value) }))
                    }
                    className="rounded-xl"
                    data-ocid="pricing.input"
                  />
                </div>
                <div className="space-y-1 flex items-end pb-1">
                  <Label className="text-xs font-semibold text-teal uppercase tracking-wide mr-3">
                    Highlighted
                  </Label>
                  <Switch
                    checked={form.highlighted}
                    onCheckedChange={(v) =>
                      setForm((p) => ({ ...p, highlighted: v }))
                    }
                    data-ocid="pricing.switch"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-teal uppercase tracking-wide">
                  Description
                </Label>
                <Input
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  className="rounded-xl"
                  data-ocid="pricing.input"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-teal uppercase tracking-wide">
                  Bullet Points (one per line)
                </Label>
                <Textarea
                  value={bulletInput}
                  onChange={(e) => setBulletInput(e.target.value)}
                  rows={4}
                  className="rounded-xl resize-none"
                  data-ocid="pricing.textarea"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="rounded-full"
                data-ocid="pricing.cancel_button"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={addOrUpdate.isPending}
                className="rounded-full bg-tan text-teal-dark"
                data-ocid="pricing.save_button"
              >
                {addOrUpdate.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Save"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {packages.length === 0 && (
          <div
            className="col-span-full text-center py-10 text-muted-foreground font-body text-sm"
            data-ocid="pricing.empty_state"
          >
            No pricing packages. Add your first one!
          </div>
        )}
        {packages.map((pkg, i) => (
          <Card
            key={pkg.id}
            className={`rounded-2xl ${pkg.highlighted ? "border-teal bg-teal/5" : "border-border"}`}
            data-ocid={`pricing.item.${i + 1}`}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-1">
                <div>
                  <p className="font-display font-bold text-teal">{pkg.name}</p>
                  <p className="text-xs text-muted-foreground font-body">
                    {pkg.duration}
                  </p>
                </div>
                <div className="flex gap-1">
                  {pkg.highlighted && (
                    <Badge className="bg-tan text-teal-dark text-xs">
                      Featured
                    </Badge>
                  )}
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => openEdit(pkg)}
                    className="w-7 h-7"
                    data-ocid={`pricing.edit_button.${i + 1}`}
                  >
                    <Pencil className="w-3 h-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDelete(pkg.id)}
                    className="w-7 h-7 text-destructive"
                    data-ocid={`pricing.delete_button.${i + 1}`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <p className="text-2xl font-display font-bold text-teal mb-1">
                €{pkg.price}
              </p>
              <p className="text-xs text-foreground/70 font-body">
                {pkg.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ---- Contacts Tab ----
function ContactsTab() {
  const { data: submissions = [] } = useContactFormSubmissions();
  return (
    <div className="space-y-4">
      <h3 className="font-display font-bold text-teal text-lg">
        Contact Submissions ({submissions.length})
      </h3>
      <div
        className="rounded-2xl overflow-hidden border border-border"
        data-ocid="contacts.table"
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-sea/50">
              <TableHead className="font-body font-semibold text-teal text-xs uppercase tracking-wide">
                Name
              </TableHead>
              <TableHead className="font-body font-semibold text-teal text-xs uppercase tracking-wide">
                Email
              </TableHead>
              <TableHead className="font-body font-semibold text-teal text-xs uppercase tracking-wide">
                Phone
              </TableHead>
              <TableHead className="font-body font-semibold text-teal text-xs uppercase tracking-wide">
                Message
              </TableHead>
              <TableHead className="font-body font-semibold text-teal text-xs uppercase tracking-wide">
                Date
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.length === 0 && (
              <TableRow data-ocid="contacts.empty_state">
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground font-body text-sm py-8"
                >
                  No submissions yet.
                </TableCell>
              </TableRow>
            )}
            {submissions.map((sub, i) => (
              <TableRow key={sub.id} data-ocid={`contacts.row.${i + 1}`}>
                <TableCell className="font-body font-medium text-sm text-teal">
                  {sub.name}
                </TableCell>
                <TableCell className="font-body text-sm text-foreground/70">
                  {sub.email}
                </TableCell>
                <TableCell className="font-body text-sm text-foreground/70">
                  {sub.phone ?? "—"}
                </TableCell>
                <TableCell className="font-body text-sm text-foreground/70 max-w-xs">
                  <p className="truncate">{sub.message}</p>
                </TableCell>
                <TableCell className="font-body text-xs text-foreground/60">
                  {new Date(
                    Number(sub.timestamp) / 1_000_000,
                  ).toLocaleDateString("en-BE")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ---- Main Admin Page ----
export function AdminPage() {
  const { login, clear, loginStatus, identity, isInitializing } =
    useInternetIdentity();
  const { data: isAdmin, isLoading: isAdminLoading } = useIsAdmin();

  if (isInitializing || isAdminLoading) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center"
        data-ocid="admin.loading_state"
      >
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-teal mx-auto mb-4" />
          <p className="font-body text-teal/70">Loading...</p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="max-w-sm w-full text-center">
          <div className="w-16 h-16 rounded-full bg-sea flex items-center justify-center mx-auto mb-6">
            <Waves className="w-8 h-8 text-teal" />
          </div>
          <h1 className="font-display font-bold text-teal text-2xl mb-2">
            Admin Panel
          </h1>
          <p className="font-body text-foreground/70 text-sm mb-8">
            Sign in to manage your therapy website content.
          </p>
          <Button
            onClick={() => login()}
            disabled={loginStatus === "logging-in"}
            className="w-full rounded-full bg-tan text-teal-dark hover:bg-tan-dark font-body font-semibold"
            data-ocid="admin.primary_button"
          >
            {loginStatus === "logging-in" ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="max-w-sm w-full text-center">
          <h1 className="font-display font-bold text-teal text-2xl mb-2">
            Access Denied
          </h1>
          <p className="font-body text-foreground/70 text-sm mb-6">
            Your account does not have admin access to this site.
          </p>
          <Button
            onClick={() => clear()}
            variant="outline"
            className="rounded-full"
            data-ocid="admin.secondary_button"
          >
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="bg-teal text-sand-light border-b border-teal-dark/30 sticky top-0 z-40">
        <div className="container mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Waves className="w-5 h-5 text-sea" />
            <span className="font-display font-bold text-sm tracking-wide uppercase">
              Admin Panel
            </span>
            <span className="text-sea-light/60 text-xs font-body ml-2">
              Ostend Beach Therapy
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sea-light/70 font-body text-xs hidden md:block">
              {identity.getPrincipal().toString().slice(0, 12)}...
            </span>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => clear()}
              className="text-sea-light hover:text-sand-light hover:bg-teal-dark rounded-full"
              data-ocid="admin.secondary_button"
            >
              <LogOut className="w-4 h-4 mr-1.5" /> Sign Out
            </Button>
            <Button
              asChild
              size="sm"
              variant="ghost"
              className="text-sea-light hover:text-sand-light rounded-full"
            >
              <a href="/">← View Site</a>
            </Button>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="profile">
          <TabsList
            className="bg-sea/50 rounded-full mb-8 p-1"
            data-ocid="admin.tab"
          >
            <TabsTrigger
              value="profile"
              className="rounded-full font-body text-sm"
              data-ocid="admin.tab"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="cv"
              className="rounded-full font-body text-sm"
              data-ocid="admin.tab"
            >
              CV
            </TabsTrigger>
            <TabsTrigger
              value="sessions"
              className="rounded-full font-body text-sm"
              data-ocid="admin.tab"
            >
              Sessions
            </TabsTrigger>
            <TabsTrigger
              value="pricing"
              className="rounded-full font-body text-sm"
              data-ocid="admin.tab"
            >
              Pricing
            </TabsTrigger>
            <TabsTrigger
              value="contacts"
              className="rounded-full font-body text-sm"
              data-ocid="admin.tab"
            >
              Contacts
            </TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <ProfileTab />
          </TabsContent>
          <TabsContent value="cv">
            <CVTab />
          </TabsContent>
          <TabsContent value="sessions">
            <SessionsTab />
          </TabsContent>
          <TabsContent value="pricing">
            <PricingTab />
          </TabsContent>
          <TabsContent value="contacts">
            <ContactsTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
