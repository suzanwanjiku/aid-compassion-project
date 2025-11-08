import { useState, useEffect } from "react";
import { apiClient } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Package, Heart, TrendingUp, Gift, CheckCircle, Clock, XCircle } from "lucide-react";

type DonationType = "monetary" | "non_monetary";

export default function DonorDashboard() {
  const { user, signOut } = useAuth();
  const [donationType, setDonationType] = useState<DonationType>("non_monetary");
  const [amount, setAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [quantityUnit, setQuantityUnit] = useState("kg");
  const [loading, setLoading] = useState(false);
  const [donations, setDonations] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    supplied: 0,
    totalAmount: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchDonations();
    }
  }, [user]);

  const fetchDonations = async () => {
    if (!user) return;

    try {
      const data = await apiClient.get("/donations");

      setDonations(data);

      const monetaryTotal = data
        .filter((d: any) => d.type === "monetary" && d.status === "supplied")
        .reduce((sum: number, d: any) => sum + Number(d.amount), 0);

      setStats({
        total: data.length,
        pending: data.filter((d: any) => d.status === "pending").length,
        accepted: data.filter((d: any) => d.status === "accepted").length,
        supplied: data.filter((d: any) => d.status === "supplied").length,
        totalAmount: monetaryTotal,
      });
    } catch (error) {
      console.error("Error fetching donations:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (donationType === "monetary") {
        if (!amount || !phoneNumber) {
          toast({
            title: "Missing Information",
            description: "Please provide amount and phone number",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        await apiClient.post("/donations", {
          type: donationType,
          amount: parseFloat(amount),
          phoneNumber,
        });

        toast({
          title: "Payment Initiated",
          description: "Check your phone for the M-Pesa prompt",
        });
      } else {
        if (!itemName || !quantity) {
          toast({
            title: "Missing Information",
            description: "Please provide item name and quantity",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        await apiClient.post("/donations", {
          type: donationType,
          itemName,
          itemDescription,
          quantity: parseFloat(quantity),
          quantityUnit,
        });

        toast({
          title: "Success!",
          description: "Your donation has been submitted for review",
        });
      }

      setAmount("");
      setPhoneNumber("");
      setItemName("");
      setItemDescription("");
      setQuantity("");
      setQuantityUnit("kg");
      fetchDonations();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { icon: any, variant: "default" | "secondary" | "destructive" | "outline", className: string }> = {
      pending: { 
        icon: Clock, 
        variant: "secondary", 
        className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100" 
      },
      accepted: { 
        icon: CheckCircle, 
        variant: "default", 
        className: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100" 
      },
      supplied: { 
        icon: Gift, 
        variant: "default", 
        className: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" 
      },
      rejected: { 
        icon: XCircle, 
        variant: "destructive",
        className: ""
      },
    };
    
    const { icon: Icon, variant, className } = config[status] || { icon: Clock, variant: "default", className: "" };
    
    return (
      <Badge variant={variant} className={`${className} gap-1`}>
        <Icon className="h-3 w-3" />
        {status}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Donor Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">Make a difference, one donation at a time</p>
          </div>
          <Button variant="outline" onClick={signOut} className="gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Donations</CardTitle>
              <Package className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">Your contributions</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-yellow-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
              <Clock className="h-5 w-5 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.pending}</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting review</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Distributed</CardTitle>
              <Gift className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.supplied}</div>
              <p className="text-xs text-muted-foreground mt-1">Delivered successfully</p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-accent bg-gradient-to-br from-accent/10 to-accent/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">Impact</CardTitle>
              <Heart className="h-5 w-5 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">KES {stats.totalAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">Funds distributed</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Donation Form */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Make a Donation
              </CardTitle>
              <CardDescription>
                Choose how you'd like to contribute to children in need
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <Label>Donation Type</Label>
                  <RadioGroup
                    value={donationType}
                    onValueChange={(value) => setDonationType(value as DonationType)}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div>
                      <RadioGroupItem value="non_monetary" id="non_monetary" className="peer sr-only" />
                      <Label
                        htmlFor="non_monetary"
                        className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                      >
                        <Package className="mb-3 h-6 w-6" />
                        <span className="font-medium">Non-Monetary</span>
                        <span className="text-xs text-muted-foreground text-center mt-1">
                          Food, clothes, etc.
                        </span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="monetary" id="monetary" className="peer sr-only" />
                      <Label
                        htmlFor="monetary"
                        className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                      >
                        <Heart className="mb-3 h-6 w-6" />
                        <span className="font-medium">Monetary</span>
                        <span className="text-xs text-muted-foreground text-center mt-1">
                          M-Pesa payment
                        </span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {donationType === "monetary" ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (KES)</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="1000"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phoneNumber">M-Pesa Phone Number</Label>
                      <Input
                        id="phoneNumber"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="254712345678"
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        You'll receive an M-Pesa prompt to complete the payment
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="itemName">Item Name</Label>
                      <Input
                        id="itemName"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        placeholder="e.g., Rice, Clothes, Books"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="itemDescription">Description (Optional)</Label>
                      <Textarea
                        id="itemDescription"
                        value={itemDescription}
                        onChange={(e) => setItemDescription(e.target.value)}
                        placeholder="Additional details about the item"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                          id="quantity"
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          placeholder="10"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="unit">Unit</Label>
                        <Select value={quantityUnit} onValueChange={setQuantityUnit}>
                          <SelectTrigger id="unit">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kg">Kilograms (kg)</SelectItem>
                            <SelectItem value="bags">Bags</SelectItem>
                            <SelectItem value="pieces">Pieces</SelectItem>
                            <SelectItem value="boxes">Boxes</SelectItem>
                            <SelectItem value="liters">Liters</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={loading} size="lg">
                  {loading ? "Processing..." : "Submit Donation"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Donation History */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Your Donation History
              </CardTitle>
              <CardDescription>Track the status of your contributions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {donations.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No donations yet</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Submit your first donation to get started
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {donations.slice(0, 5).map((donation) => (
                      <Card key={donation.id} className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <p className="font-medium">
                              {donation.type === "monetary"
                                ? `KES ${Number(donation.amount).toLocaleString()}`
                                : donation.item_name}
                            </p>
                            {donation.type !== "monetary" && (
                              <p className="text-sm text-muted-foreground">
                                {donation.quantity} {donation.quantity_unit}
                              </p>
                            )}
                          </div>
                          {getStatusBadge(donation.status)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(donation.created_at).toLocaleDateString()} at{" "}
                          {new Date(donation.created_at).toLocaleTimeString()}
                        </p>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Full Donation Table */}
        {donations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Complete Donation Records</CardTitle>
              <CardDescription>Detailed view of all your donations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Details</TableHead>
                      <TableHead>Amount/Quantity</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {donations.map((donation) => (
                      <TableRow key={donation.id}>
                        <TableCell>{new Date(donation.created_at).toLocaleDateString()}</TableCell>
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
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}