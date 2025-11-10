import { useState, useEffect } from "react";
import { fetchJson } from '@/config/api';
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Package, Home, TrendingUp, Plus, Users, DollarSign, Calendar, CheckCircle } from "lucide-react";
import { Navigation } from "@/components/Navigation";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [donations, setDonations] = useState<any[]>([]);
  const [homes, setHomes] = useState<any[]>([]);
  const [distributions, setDistributions] = useState<any[]>([]);
  const [stats, setStats] = useState({ 
    total: 0, 
    pending: 0, 
    accepted: 0, 
    supplied: 0,
    totalAmount: 0,
    totalDonors: 0,
    recentDistributions: 0
  });
  const [selectedDonation, setSelectedDonation] = useState<any>(null);
  const [selectedHome, setSelectedHome] = useState("");
  const [distributionNotes, setDistributionNotes] = useState("");
  const [newHome, setNewHome] = useState({ name: "", location: "", contact_info: "" });
  const [homeDialogOpen, setHomeDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await Promise.all([fetchDonations(), fetchHomes(), fetchDistributions()]);
  };

  const fetchDonations = async () => {
    const { data, error } = await (async ()=>{ throw new Error('This Supabase call was not automatically migrated — please implement equivalent fetchJson call') })()
      .from("donations")
      .select("*, profiles(full_name)")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setDonations(data);
      
      const uniqueDonors = new Set(data.map(d => d.donor_id));
      const monetaryTotal = data
        .filter(d => d.type === "monetary" && d.amount)
        .reduce((sum, d) => sum + Number(d.amount), 0);
      
      const now = new Date();
      const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const recentDists = distributions.filter(d => new Date(d.created_at) > lastWeek).length;

      setStats({
        total: data.length,
        pending: data.filter((d) => d.status === "pending").length,
        accepted: data.filter((d) => d.status === "accepted").length,
        supplied: data.filter((d) => d.status === "supplied").length,
        totalAmount: monetaryTotal,
        totalDonors: uniqueDonors.size,
        recentDistributions: recentDists
      });
    }
  };

  const fetchHomes = async () => {
    const { data, error } = await (async ()=>{ throw new Error('This Supabase call was not automatically migrated — please implement equivalent fetchJson call') })()
      .from("children_homes")
      .select("*")
      .order("name");

    if (!error && data) setHomes(data);
  };

  const fetchDistributions = async () => {
    const { data, error } = await (async ()=>{ throw new Error('This Supabase call was not automatically migrated — please implement equivalent fetchJson call') })()
      .from("distributions")
      .select("*, donations(*), children_homes(*)")
      .order("created_at", { ascending: false });

    if (!error && data) setDistributions(data);
  };

  const updateDonationStatus = async (donationId: string, status: string) => {
    const { error } = await (async ()=>{ throw new Error('This Supabase call was not automatically migrated — please implement equivalent fetchJson call') })()
      .from("donations")
      .update({ status })
      .eq("id", donationId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: `Donation status updated to ${status}` });
      fetchDonations();
    }
  };

  const createDistribution = async () => {
    if (!selectedDonation || !selectedHome) {
      toast({ title: "Error", description: "Please select a donation and home", variant: "destructive" });
      return;
    }

    const { data: userData } = await (async ()=>{ throw new Error('This Supabase call was not automatically migrated — please implement equivalent fetchJson call') })().auth.getUser();

    const { error } = await (async ()=>{ throw new Error('This Supabase call was not automatically migrated — please implement equivalent fetchJson call') })().from("distributions").insert({
      donation_id: selectedDonation.id,
      children_home_id: selectedHome,
      distributed_by: userData?.user?.id,
      notes: distributionNotes,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      await updateDonationStatus(selectedDonation.id, "supplied");
      setSelectedDonation(null);
      setSelectedHome("");
      setDistributionNotes("");
      toast({ title: "Success", description: "Distribution recorded successfully" });
      fetchDistributions();
    }
  };

  const createHome = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: userData } = await (async ()=>{ throw new Error('This Supabase call was not automatically migrated — please implement equivalent fetchJson call') })().auth.getUser();

    const { error } = await (async ()=>{ throw new Error('This Supabase call was not automatically migrated — please implement equivalent fetchJson call') })().from("children_homes").insert({
      ...newHome,
      registered_by: userData?.user?.id,
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Home registered successfully" });
      setNewHome({ name: "", location: "", contact_info: "" });
      setHomeDialogOpen(false);
      fetchHomes();
    }
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", className?: string }> = {
      pending: { variant: "secondary", className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100" },
      accepted: { variant: "default", className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100" },
      supplied: { variant: "default", className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" },
      rejected: { variant: "destructive" },
    };
    const { variant, className } = config[status] || { variant: "default" };
    return <Badge variant={variant} className={className}>{status}</Badge>;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Page Header */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">View donations, manage homes, and distribute resources</p>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Donations</CardTitle>
              <Package className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">All time donations received</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
              <Calendar className="h-5 w-5 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.pending}</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting your approval</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Distributed</CardTitle>
              <CheckCircle className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.supplied}</div>
              <p className="text-xs text-muted-foreground mt-1">Successfully delivered</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-accent">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Donors</CardTitle>
              <Users className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.totalDonors}</div>
              <p className="text-xs text-muted-foreground mt-1">Active contributors</p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Insights Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Monetary Donations</CardTitle>
              <DollarSign className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">KES {stats.totalAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Total funds raised</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-accent/10 to-accent/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <TrendingUp className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.recentDistributions}</div>
              <p className="text-xs text-muted-foreground mt-1">Distributions in last 7 days</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="donations" className="space-y-4">
          <TabsList>
            <TabsTrigger value="donations">Donations</TabsTrigger>
            <TabsTrigger value="homes">Children's Homes</TabsTrigger>
            <TabsTrigger value="distributions">Distributions</TabsTrigger>
          </TabsList>

          <TabsContent value="donations">
            <Card>
              <CardHeader>
                <CardTitle>All Donations</CardTitle>
                <CardDescription>Review and manage donation submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Donor</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead>Amount/Qty</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {donations.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                            No donations yet. They will appear here once donors start contributing.
                          </TableCell>
                        </TableRow>
                      ) : (
                        donations.map((donation) => (
                          <TableRow key={donation.id}>
                            <TableCell className="font-medium">{donation.profiles?.full_name || "Unknown"}</TableCell>
                            <TableCell className="capitalize">{donation.type.replace("_", " ")}</TableCell>
                            <TableCell>
                              {donation.type === "monetary" ? "Payment" : donation.item_name}
                            </TableCell>
                            <TableCell>
                              {donation.type === "monetary"
                                ? `KES ${Number(donation.amount).toLocaleString()}`
                                : `${donation.quantity} ${donation.quantity_unit}`}
                            </TableCell>
                            <TableCell>{getStatusBadge(donation.status)}</TableCell>
                            <TableCell>{new Date(donation.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                            <div className="flex gap-2">
                              {donation.status === "pending" && (
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => updateDonationStatus(donation.id, "accepted")}
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    Accept
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => updateDonationStatus(donation.id, "rejected")}
                                  >
                                    Reject
                                  </Button>
                                </>
                              )}
                              {donation.status === "accepted" && (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button size="sm" onClick={() => setSelectedDonation(donation)}>
                                      Distribute
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Create Distribution</DialogTitle>
                                      <DialogDescription>
                                        Assign this donation to a children's home
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div className="space-y-2">
                                        <Label>Select Home</Label>
                                        <Select value={selectedHome} onValueChange={setSelectedHome}>
                                          <SelectTrigger>
                                            <SelectValue placeholder="Choose a home" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {homes.map((home) => (
                                              <SelectItem key={home.id} value={home.id}>
                                                {home.name} - {home.location}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="space-y-2">
                                        <Label>Notes</Label>
                                        <Textarea
                                          value={distributionNotes}
                                          onChange={(e) => setDistributionNotes(e.target.value)}
                                          placeholder="Additional notes about this distribution"
                                        />
                                      </div>
                                      <Button onClick={createDistribution} className="w-full">
                                        Complete Distribution
                                      </Button>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              )}
                            </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="homes">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Children's Homes</CardTitle>
                  <CardDescription>Manage registered homes and institutions</CardDescription>
                </div>
                <Dialog open={homeDialogOpen} onOpenChange={setHomeDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Home
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Register New Home</DialogTitle>
                      <DialogDescription>Add a new children's home or institution</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={createHome} className="space-y-4">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input
                          value={newHome.name}
                          onChange={(e) => setNewHome({ ...newHome, name: e.target.value })}
                          placeholder="Enter home name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input
                          value={newHome.location}
                          onChange={(e) => setNewHome({ ...newHome, location: e.target.value })}
                          placeholder="City, County"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Contact Information</Label>
                        <Textarea
                          value={newHome.contact_info}
                          onChange={(e) => setNewHome({ ...newHome, contact_info: e.target.value })}
                          placeholder="Phone number, email, or other contact details"
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        Register Home
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Registered</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {homes.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                            No homes registered yet. Click "Add Home" to register the first one.
                          </TableCell>
                        </TableRow>
                      ) : (
                        homes.map((home) => (
                        <TableRow key={home.id}>
                          <TableCell className="font-medium">{home.name}</TableCell>
                          <TableCell>{home.location}</TableCell>
                          <TableCell>{home.contact_info}</TableCell>
                          <TableCell>{new Date(home.created_at).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="distributions">
            <Card>
              <CardHeader>
                <CardTitle>Distribution History</CardTitle>
                <CardDescription>Track all completed distributions to homes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Donation Type</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead>Home</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {distributions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                            No distributions yet. Accept donations and distribute them to see them here.
                          </TableCell>
                        </TableRow>
                      ) : (
                        distributions.map((dist) => (
                          <TableRow key={dist.id}>
                            <TableCell className="capitalize">
                              {dist.donations?.type.replace("_", " ")}
                            </TableCell>
                            <TableCell>
                              {dist.donations?.type === "monetary"
                                ? `KES ${Number(dist.donations?.amount).toLocaleString()}`
                                : dist.donations?.item_name}
                            </TableCell>
                            <TableCell className="font-medium">{dist.children_homes?.name}</TableCell>
                            <TableCell>{dist.children_homes?.location}</TableCell>
                            <TableCell>{dist.notes || "—"}</TableCell>
                            <TableCell>{new Date(dist.created_at).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}