"use client"
import Image from "next/image";
import { Button } from "@/components/ui/button"
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState } from 'react'
import { RiRobot2Line } from "react-icons/ri";

const courseCategories = [
  { name: 'Diploma', slug: 'diploma' },
  { name: 'Undergraduate', slug: 'undergraduate' },
  { name: 'Postgraduate', slug: 'postgraduate' },
]


export default function Home() {


  return (
    <div className="flex flex-col min-h-screen font-[family-name:var(--font-geist-sans)]">
      <main className="flex-1">
      <section id="hero" className="w-full py-12 md:py-24 lg:py-32 xl:py-30 bg-gradient-to-r from-[#6AACE0] to-[#65D46E] bg-center bg-cover">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <h1 className="text-3xl text-white font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Discover your path to Success
              </h1>
              <p className="mx-auto font-medium italic max-w-[650px] text-white-foreground md:text-xl">
              Explore our wide range of courses and find the perfect program for your goals.
              </p>
              
            <Link href="/chatbot">
              <Button className="">
                <RiRobot2Line className="mr-2 h-30 w-30" />Try our AI course consultant chatbot
              </Button>
            </Link>
            </div>
          </div>
        </section>

        <section className="container mx-auto py-12 px-6">
          <h2 className="text-3xl font-bold mb-8 text-center">Explore Our Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {courseCategories.map((category) => (
              <Link href={`/courses?level=${category.slug}&type=all`} key={category.slug}>
                <Card className="hover:shadow-lg transition-shadow duration-200 h-full">
                  <CardHeader>
                    <CardTitle className="text-2xl">{category.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Explore our {category.name.toLowerCase()} programs and take the next step in your education journey.</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
        
      </main>
      
    </div>
  );
}
