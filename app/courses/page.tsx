'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


interface Course {
  course_id: string;
  name: string;
  description: string;
  level: string;
  category: string;
}

const levels = ['diploma', 'undergraduate', 'postgraduate']
const courseTypes = ['Accounting, Business, Finance, Marketing', 'Actuarial, Statistics', 'Biology, Medicine and Psychology', 'Communication, Creative Arts','Computing', 'Engineering', 'Hospitality, Culinary, Events Management']

export default function CoursesPage() {
  const searchParams = useSearchParams()
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function getCourses() {
    try {
      const response = await fetch("/api/course")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      const courses = Array.isArray(data.course) ? data.course : [];
      if (!Array.isArray(courses)) {
        throw new Error("Courses is not an array");
      }
      const transformedCourses = courses.map(course => ({
        course_id: course.course_id, // Rename to match your expected key
        name: course.name,
        description: course.description,
        level: course.level.toLowerCase(), // Normalize level to lowercase
        category: course.category, // Normalize categoryName to type
      }));
  
      setCourses(transformedCourses);
      setFilteredCourses(transformedCourses);
      setError(null);
      
    } catch (error) {
      console.error("Error fetching courses:", error)
      setError("Failed to load courses. Please try again later.")
      setCourses([])
      setFilteredCourses([])
    }
  }

  useEffect(() => {
    if (courses.length === 0) {
      getCourses();
    }
    const level = searchParams.get('level') || 'all';
    const type = searchParams.get('type') || 'all';
    
    // Normalize the values as before
    const normalizedLevel = level === "all" ? "" : level;
    const normalizedType = type === "all" ? "" : type;
    
    setSelectedLevel(normalizedLevel);
    setSelectedType(normalizedType);
  
    // Apply filters immediately after setting the state
    const filtered = filterCourses(courses, normalizedLevel, normalizedType, searchQuery);
    setFilteredCourses(filtered);
  }, [searchParams, courses, searchQuery]);

  const filterCourses = (allCourses: Course[], level: string, type: string, query: string): Course[] => {
    let filtered = allCourses
    if (level) {
      filtered = filtered.filter(course => course.level === level)
    }
    if (type) {
      filtered = filtered.filter(course => course.category === type)
    }
    if (query) {
      filtered = filtered.filter(course => 
        course.name.toLowerCase().includes(query.toLowerCase())
      )
    }
    return filtered
  }

  useEffect(() => {
    const filtered = filterCourses(courses, selectedLevel, selectedType, searchQuery)
    setFilteredCourses(filtered)
  }, [courses, selectedLevel, selectedType, searchQuery])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const filtered = filterCourses(courses, selectedLevel, selectedType, searchQuery)
    setFilteredCourses(filtered)
  }

  const handleLevelChange = (value: string) => {
    const level = value === "all" ? "" : value
    setSelectedLevel(level)
  }

  const handleTypeChange = (value: string) => {
    const type = value === "all" ? "" : value
    setSelectedType(type)
  }

  const groupedCourses = filteredCourses.reduce((acc, course) => {
    if (!acc[course.level]) {
      acc[course.level] = []
    }
    acc[course.level].push(course)
    return acc
  }, {} as Record<string, Course[]>)

  return (
    <div className="min-h-screen">
      <main className="container mx-auto py-8 px-8">
        <h2 className="text-3xl font-bold mb-6">Available Courses</h2>
        <div className="mb-8 space-y-4">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
            <Input
              type="text"
              placeholder="Search courses..."
              className="w-full md:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Select value={selectedLevel} onValueChange={handleLevelChange}>
              <SelectTrigger className="w-full md:w-48 ">
                <SelectValue placeholder="Select Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {levels.map(level => (
                  <SelectItem key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={handleTypeChange}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {courseTypes.map(type => (
                  <SelectItem key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit" className='bg-green-500 hover:bg-green-600'>Search</Button>
          </form>
        </div>
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          Object.entries(groupedCourses).map(([level, levelCourses]) => (
            <div key={level} className="mb-8 px-4">
              <h3 className="text-2xl font-semibold mb-4 capitalize">{level} Courses</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {levelCourses.map((course) => (
                  <Link href={`/courses/${course.course_id}`} key={course.course_id}>
                    <Card className="h-full  from-[#6AACE0] to-[#65D46E] hover:shadow-lg transition-shadow duration-200">
                      <CardHeader>
                        <CardTitle className=' text-xl'>{course.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-20 overflow-hidden">
                          <p className="text-gray-600 truncate-text">{course.description}</p>
                        </div>
                        
                        <p className="text-sm text-gray-500 mt-2">Type: {course.category}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  )
}

