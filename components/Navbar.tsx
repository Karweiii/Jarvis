"use client";
import { useState, useEffect } from "react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from 'lucide-react'
import { usePathname } from 'next/navigation'



export default function Navbar(){
  const [isOpen, setIsOpen] = useState(false)
  const [role, setRole] = useState<"student" | "advisor" | "admin" | "guest" |null>(null);
  const pathname = usePathname()
  
  // Don't render the navbar on login or register pages
  if (pathname.includes('login') || pathname.includes('register')) {
    return null;
  }


  useEffect(() => {
    const storedRole = localStorage.getItem('userRole') as 'student' | 'advisor' | 'admin' | null;
    if (storedRole) {
      setRole(storedRole);
    } else {
      setRole("guest"); // or handle the case where role is not set
    }
  }, []);

  if (role === null) {
    return null;
  }

  const navItems = {
    student: [
      { name: 'Dashboard', href: '/' },
      { name: 'Courses', href: '/courses' },
      { name: 'Appointment', href: '/appointment' },
      { name: 'AI Chatbot', href: '/chatbot' },
      { name: 'Profile', href: '/profile' },
      {name:'Logout',href:'/login'}
    ],
    advisor: [
      { name: 'Dashboard', href: '/advisor-dashboard' },
      { name: 'Profile', href: '/profile' },
      { name: 'Logout', href: '/login' },
    ],
    admin: [
      { name: 'Dashboard', href: '/admin/dashboard' },
      { name: 'Manage Course', href: '/admin/course-management' },
      { name: 'Logout', href: '/login' },
    ],
    guest: [
      { name: 'Dashboard', href: '/' },
      { name: 'Courses', href: '/courses' },
      { name: 'Login', href: '/login' },
    ],
  }
  const items = navItems[role ?? 'guest'] || [];


    return (
      <header className="sticky px-4 top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className=" container place-self-center flex h-[8vh] items-center justify-center">
        <a href="/" className="flex items-center space-x-2 ml-4 md:ml-2">
          <span className="font-bold text-xl">University</span>
        </a>
        <nav className="ml-auto hidden md:flex gap-4">
          {items.map((item)=>(
            <a key={item.name} href={item.href} className="text-sm font-medium hover:underline underline-offset-4">
              {item.name}
            </a>
          ))}
          
        </nav>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="ml-auto md:hidden rounded-full">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-4">
            {items.map((item)=>(
            <a key={item.name} href={item.href} className="text-sm font-medium hover:underline underline-offset-4">
              {item.name}
            </a>
          ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
    )
}