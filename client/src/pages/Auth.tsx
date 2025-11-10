import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { fetchJson } from '@/config/api';

const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(2, "Name must be at least 2 characters").optional(),
  role: z.enum(['admin','donor']).optional()
});

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mode, setMode] = useState<'login'|'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('donor');

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (mode === 'register') {
        // Register user
        const user = await fetchJson('/users/register', {
          method: 'POST',
          body: JSON.stringify({ name: fullName, email, password })
        });
        // create role
        await fetchJson('/user_roles', {
          method: 'POST',
          body: JSON.stringify({ user_id: user._id, role })
        });
        toast({ title: 'Registered', description: 'Account created. You can now login.'});
        setMode('login');
      } else {
        // Login
        const res = await fetchJson('/users/login', {
          method: 'POST',
          body: JSON.stringify({ email, password })
        });
        // res contains token and user info
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify({ _id: res._id, name: res.name, email: res.email }));
        toast({ title: 'Logged in', description: 'Welcome back!' });
        navigate('/');
      }
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Auth error' });
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>{mode === 'login' ? 'Login' : 'Register'}</CardTitle>
          <CardDescription>{mode === 'login' ? 'Sign in to your account' : 'Create an account'}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            {mode === 'register' && (
              <>
                <Label>Full name</Label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
                <Label>Role</Label>
                <RadioGroup value={role} onValueChange={(v)=>setRole(v)}>
                  <RadioGroupItem value="donor" /> Donor
                  <RadioGroupItem value="admin" /> Admin
                </RadioGroup>
              </>
            )}
            <Label>Email</Label>
            <Input value={email} onChange={(e)=>setEmail(e.target.value)} />
            <Label>Password</Label>
            <Input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
            <div className="flex items-center justify-between">
              <Button type="submit">{mode === 'login' ? 'Login' : 'Register'}</Button>
              <Button variant="ghost" onClick={()=>setMode(mode === 'login' ? 'register' : 'login')}>
                {mode === 'login' ? 'Create an account' : 'Have an account? Login'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
