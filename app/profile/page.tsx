'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaEdit, FaKey } from 'react-icons/fa';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface StudentData{
  preferredField:string;
  educationBg:string;
}

interface AdvisorData{
  office:string;
  experience:string;
} 

type RoleData = StudentData | AdvisorData;

interface Profile {
  id: string;
  username: string;
  email: string;
  dob: string; // Expected in YYYY-MM-DD format
  role:'student' | 'advisor';
  roleData:RoleData | null
}

export default function Profile() {
  const {toast} =useToast()
  const [user, setUser] = useState<Profile | null>(null);
  const [roleData, setRoleData] = useState<StudentData | AdvisorData | null>(null);
  const [editedUser, setEditedUser] = useState<Profile>({
    id: '',
    username: '',
    email: '',
    dob: '',
    role: 'student',
    roleData:null // Default to student or based on actual data
  });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile');
      if (res.ok) {
        const{user, roleData}= await res.json();
        setUser(user)
        const normalizedRoleData = roleData && roleData.length > 0 ? roleData[0] : null;
        setRoleData(normalizedRoleData);
  
        // Combine user and roleData to set editedUser
        setEditedUser({
          ...user,
          roleData: normalizedRoleData,});
        // Parse dob to ensure it's in "YYYY-MM-DD"
        // const parsedDob = userData.user.dob
        //   ? userData.user.dob.split('T')[0] // Extract only date if ISO
        //   : '';

        // const profileData = {
        //   id: userData.user.id,
        //   username: userData.user.username,
        //   email: userData.user.email,
        //   dob: parsedDob,
        //   role:userData.user.role,
        //   studentData: userData.user.role === 'student' ? userData.user.studentData : undefined,
        //   advisorData: userData.user.role === 'advisor' ? userData.user.advisorData : undefined,
        // };

        // setUser(profileData);
        // setEditedUser(profileData);
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      toast({
        title: "Error",
        description: "Failed to fetch profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedUser),
      });

      if (res.ok) {
        setUser({ ...user!, ...editedUser });
        setIsEditDialogOpen(false);
        await fetchProfile();
        toast({
          variant: "success",
          title: "Success",
          description: "Profile updated successfully.",
        });
      } else {
        toast({
          variant:"failure",
          title: "Error",
          description: "Failed to update profile. Please try again."
        });
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "failure",
      });
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email:user?.email,
          oldPassword, 
          newPassword 
        }),
      });

      if (res.ok) {
        setIsPasswordDialogOpen(false);
        setOldPassword('');
        setNewPassword('');
        toast({
          variant: "success",
          title: "Success",
          description: "Password changed successfully.",
        });
        router.push('/login');
      } else {
        toast({
          title: "Error",
          description: "Failed to change password. Please check your old password and try again.",
          variant: "failure",
        });
      }
    } catch (error) {
      console.error('Failed to change password:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "failure",
      });
    }
  };

  function isStudentData(roleData: RoleData | null): roleData is StudentData {
    return (roleData as StudentData)?.preferredField !== undefined;
  }

  if (!user) return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h2 className="text-2xl text-gray-600">Loading...</h2>
      </div>
    </div>
  );

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white shadow-lg rounded-lg p-8">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Profile</h1>
      <div className="">
        <p className='p-4'><strong>Username:</strong> {user.username}</p>
        <p className='p-4'><strong>Email:</strong> {user.email}</p>
        <p className='p-4'><strong>Date of Birth:</strong> {new Date(user.dob).toLocaleDateString('en-CA')}</p>

        {user.role==='student' && isStudentData(roleData) && (
          <div>
            <p className='p-4'><strong>Preferred Field:</strong> {roleData.preferredField}</p>
            <p className='p-4'><strong>Education Background:</strong> {roleData.educationBg}</p>
          </div>
        )}

        {user.role==='advisor' && !isStudentData(roleData) && (
          <div>
            <p className='p-4'><strong>Preferred Field:</strong> {roleData?.office}</p>
            <p className='p-4'><strong>Education Background:</strong> {roleData?.experience} Years</p>
          </div>
        )}

        <div className="flex mt-4 space-x-4">
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FaEdit className="mr-2" /> Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Make changes to your profile here. Click save when you're done.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleEdit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                      Username
                    </Label>
                    <Input
                      id="username"
                      value={editedUser.username}
                      onChange={(e) => setEditedUser({ ...editedUser, username: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={editedUser.email}
                      onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="dob" className="text-right">
                      Date of Birth
                    </Label>
                    <Input
                      id="dob"
                      type="date"
                      value={new Date(editedUser.dob).toLocaleDateString('en-CA')}
                      onChange={(e) => setEditedUser({ ...editedUser, dob: e.target.value })}
                      className="col-span-3"
                    />
                  </div>

                  {editedUser.role === 'student' &&  isStudentData(editedUser.roleData) &&(
                    <>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="preferredField" className="text-right">Preferred Field</Label>
                        <Select
                          onValueChange={(value) =>
                            setEditedUser({
                              ...editedUser,
                              roleData: {
                                ...(editedUser.roleData || {}),
                                preferredField: value,
                                educationBg: (editedUser.roleData as StudentData)?.educationBg || '',
                              },
                            })
                          }
                          value={editedUser.roleData.preferredField || ''}
                        >
                          <SelectTrigger id="preferredField" className="col-span-3">
                            <SelectValue placeholder="Select your preferred field" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Accounting, Business, Finance, Marketing">Accounting, Business, Finance, Marketing</SelectItem>
                            <SelectItem value="Actuarial, Statistics">Actuarial, Statistics</SelectItem>
                            <SelectItem value="Biology, Medicine and Psychology">Biology, Medicine and Psychology</SelectItem>
                            <SelectItem value="Communication, Creative Arts">Communication, Creative Arts</SelectItem>
                            <SelectItem value="Computing">Computing</SelectItem>
                            <SelectItem value="Engineering">Engineering</SelectItem>
                            <SelectItem value="Hospitality, Culinary, Events Management">Hospitality, Culinary, Events Management</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="educationBg" className="text-right">Education Background</Label>
                        <Select
                          onValueChange={(value) =>
                            setEditedUser({
                              ...editedUser,
                              roleData: {
                                ...(editedUser.roleData || {}),
                                preferredField: (editedUser.roleData as StudentData)?.preferredField || '',
                                educationBg: value,
                              },
                            })
                          }
                          value={editedUser.roleData.educationBg || ''}
                        >
                          <SelectTrigger id="educationBg" className="col-span-3">
                            <SelectValue placeholder="Select your education background" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SPM">SPM</SelectItem>
                            <SelectItem value="STPM">STPM</SelectItem>
                            <SelectItem value="A-levels">A-levels</SelectItem>
                            <SelectItem value="IGCSE">IGCSE</SelectItem>
                            <SelectItem value="Diploma">Diploma</SelectItem>
                            <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                            <SelectItem value="Postgraduate">Postgraduate</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  {editedUser.role === 'advisor' &&  !isStudentData(editedUser.roleData) &&(
                    <>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="office" className="text-right">Office Location</Label>
                        <Input
                            id="office"
                            value={(editedUser.roleData as AdvisorData)?.office || ''}
                            onChange={(e) =>
                              setEditedUser({
                                ...editedUser,
                                roleData: {
                                  ...(editedUser.roleData as AdvisorData), // Ensure we're updating an AdvisorData object
                                  office: e.target.value, // Update the office field
                                },
                              })
                            }
                            className="col-span-3"
                          />
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="experience" className="text-right">Experience (Years)</Label>
                        <Input
                          id="experience"
                          value={(editedUser.roleData as AdvisorData)?.experience || ''}
                          onChange={(e) =>
                            setEditedUser({
                              ...editedUser,
                              roleData: {
                                ...(editedUser.roleData as AdvisorData), // Ensure we're updating an AdvisorData object
                                experience: e.target.value, // Update the experience field
                              },
                            })
                          }
                          className="col-span-3"
                        />
                      </div>
                    </>
                  )}
                </div>
                <DialogFooter>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FaKey className="mr-2" /> Change Password
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Change Password</DialogTitle>
                <DialogDescription>
                  Enter your old password and a new password to change it.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handlePasswordChange}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="oldPassword" className="text-right">
                      Old Password
                    </Label>
                    <Input
                      id="oldPassword"
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="newPassword" className="text-right">
                      New Password
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Change Password</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

