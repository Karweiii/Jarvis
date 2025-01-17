'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Search, Plus, Eye, Trash2, Edit } from 'lucide-react'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { set } from 'date-fns'
import { METHODS } from 'http'


interface Course {
  course_id: string
  name: string
  description: string
  intake: string
  duration: string
  study_mode: string
  level: string
  category: string
  fees: string
  career_prospects: string
  qualifications: string
}

interface Subject {
    subject_id: string
  course_id: string
  name:string
  subjects: string
  year: number
  
}

interface Elective {
  elective_id: string
  course_id: string
  name:string
  year: number
  electives: string
}

export default function CourseManagement() {
  const [courses, setCourses] = useState<Course[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [electives, setElectives] = useState<Elective[]>([])
  const [courseSearch, setCourseSearch] = useState('')
  const [subjectSearch, setSubjectSearch] = useState('')
  const [electiveSearch, setElectiveSearch] = useState('')
  const [newCourse, setNewCourse] = useState<Course>({
    course_id: '', name: '', description: '', intake: '', duration: '', 
    study_mode: '', level: '', category: '', fees: '', career_prospects: '', qualifications: ''
  })
  const{toast}=useToast()
  const [newSubject, setNewSubject] = useState<Subject>({ subject_id: '',course_id:'', name: '', year: 1, subjects: '' })
  const [newElective, setNewElective] = useState<Elective>({ elective_id: '', course_id: '',name:'', year: 1, electives: '' })
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)
  const [editingElective, setEditingElective] = useState<Elective | null>(null)
  const [viewingCourse, setViewingCourse] = useState<Course | null>(null)
  const [viewingElective, setViewingElective] = useState<Elective | null>(null)
  const [isNewCourseDialogOpen, setIsNewCourseDialogOpen] = useState(false)
  const [isNewSubjectDialogOpen, setIsNewSubjectDialogOpen] = useState(false)
  const [isNewElectiveDialogOpen, setIsNewElectiveDialogOpen] = useState(false)

  useEffect(() => {
    fetchCourses()
    fetchSubjects()
    fetchElectives()
  }, [])

  useEffect(() => {
    console.log('New subject updated:', newSubject);
  }, [newSubject]);

  const fetchCourses = async () => {
    try{
        const response=await fetch('/api/course')
        if(!response.ok){
            throw new Error('Failed to fetch courses')
        }

        const data= await response.json()
        setCourses(data.course)
    }catch(error){
        console.error('Failed to fetch courses:',error)
        toast({
            title:"Error",
            description:"Failed to fetch courses",
            variant:"failure"
        })
    }
    // Placeholder: Replace with actual API call
  }


  const fetchSubjects = async () => {
    try{
        const response=await fetch('/api/subject')
        if(!response.ok){
            throw new Error('Failed to fetch subjects')
        }
        const data=await response.json()
        setSubjects(data.subject)
    }catch(error){
        console.error('Failed to fetch subjects:',error)
        toast({
            title:"Error",
            description:"Failed to fetch subjects",
            variant:"failure"
        })
    }
  }

  const fetchElectives = async () => {
    try{
        const response=await fetch('/api/elective')
        if(!response.ok){
            throw new Error('Failed to fetch electives')
        }
        const data=await response.json()
        setElectives(data.electives)
    }catch(error){
        console.error('Failed to fetch electives:',error)
        toast({
            title:"Error",
            description:"Failed to fetch electives",
            variant:"failure"
        })
    }
  }

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    try{
        const response=await fetch('/api/course',{
            method:"POST",
            headers:{
                'Content-Type':'application/json'  
            },
            body:JSON.stringify(newCourse)
        })

        if(!response.ok){
            const error=await response.json()
            console.error('Error creating course:',error.error)
            toast({
                title:"Error creating course",
                description:"Failed to create course",
                variant:"failure"
            })
            return;
        }
        
        fetchCourses()
        setNewCourse({ course_id: '', name: '', description: '', intake: '', duration: '', study_mode: '', level: '', category: '', fees: '', career_prospects: '', qualifications: '' })
        setIsNewCourseDialogOpen(false)
        toast({ title: "Success",
             description: "Course created successfully.",
            variant:"success" })
    }catch(error){
        console.error('Error creating course:',error)
        toast({
            title:"Error",
            description:"Failed to create course",
            variant:"failure"
        })
    }
    
  }

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault()
    try{
        const response=await fetch(`/api/course/`,{
            method:'PUT',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({
                courseId:editingCourse?.course_id,
                name:editingCourse?.name,
                description:editingCourse?.description,
                intake:editingCourse?.intake,
                duration:editingCourse?.duration,
                study_mode:editingCourse?.study_mode,
                level:editingCourse?.level,
                category:editingCourse?.category,
                fees:editingCourse?.fees,
                career_prospects:editingCourse?.career_prospects,
                qualifications:editingCourse?.qualifications
            })
        });

        if (!response.ok){
            const error=await response.json()
            console.error('Error updating course',error.error)
            toast({
                title:"Error updating course",
                description:"Failed to update course",
                variant:"failure"
            })
            return;
        }
        fetchCourses()
        setEditingCourse(null)
        toast({ title: "Success", description: "Course updated successfully." })
    }catch(error){
        console.error('Error updating course:',error)
        toast({
            title:"Error",
            description:"Failed to update course",
            variant:"failure"
        })
    }
    
  }

  const handleDeleteCourse = async (courseId: string) => {
    try{
        const response=await fetch(`/api/course/${courseId}`,{
            method:'DELETE',
        });
        const result=await response.json()
        if(!response.ok){
            console.error('Error deleting course:',result.error)
            toast({
                title:"Error",
                description:"Failed to delete course",
                variant:"failure"
            })
            return
        }
        fetchCourses()
        toast({ title: "Success", description: "Course deleted successfully.",variant:"success" })
    }catch(error){
        console.error('Error deleting course:',error)
        toast({
            title:"Error",
            description:"Failed to delete course",
            variant:"failure"
        })
    }
    
  }

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault()
    try{
        const response= await fetch('/api/subject',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({
                courseId:newSubject.course_id,
                subjects:newSubject.subjects,
                year:newSubject.year
            })
        })

        if(!response.ok){
            const error=await response.json()
            console.error('Error creating subject:',error.error)
            toast({
                title:"Error creating course",
                description:"Failed to create course",
                variant:"failure"
            })
            return;
        }

        fetchSubjects()
        setNewSubject({ subject_id: '',course_id:'', name: '', year: 1, subjects: '' })
        setIsNewSubjectDialogOpen(false)
        toast({ title: "Success", description: "Subject created successfully.",variant:"success" })
    }catch(error){
        console.error('Error creating subject:',error)
        toast({
            title:"Error",
            description:"Failed to create subject",
            variant:"failure"
        })
    }
  }

  const handleUpdateSubject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingSubject) return
    console.log('Updating subject:', editingSubject)
    try{
        const response= await fetch(`/api/subject`,{
            method:'PUT',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({
                subjectId:editingSubject.subject_id,
                subjects:editingSubject.subjects,
                year:editingSubject.year
            })
        })

        if(!response.ok){
            const error=await response.json()
            console.error('Error updating subject:',error.error)
            toast({
                title:"Error",
                description:"Failed to update subject",
                variant:"failure"
            })
            return
        }
        fetchSubjects()
        setEditingSubject(null)
        toast({ title: "Success", description: "Subject updated successfully." })
    }catch(error){
        console.error('Error updating subject:',error)
        toast({
            title:"Error",
            description:"Failed to update subject",
            variant:"failure"
        })
    }
    
  }

  const handleDeleteSubject = async (subjectId: string) => {
    try{
        const response=await fetch(`/api/subject`,{
            method:'DELETE',
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({subjectId})
        })
        const data=await response.json()
        if(!response.ok){
            console.error('Error deleting subject:',data.error)
            toast({
                title:"Error",
                description:"Failed to delete subject",
                variant:"failure"
            })
            return
        }
        fetchSubjects()
        toast({ title: "Success", description: "Subject deleted successfully.",variant:"success" })
    }catch(error){
        console.error('Error deleting subject:',error)
        toast({
            title:"Error",
            description:"Failed to delete subject",
            variant:"failure"
        })
    }
  }

  const handleCreateElective = async (e: React.FormEvent) => {
    e.preventDefault()
    try{
        const response= await fetch(`/api/elective`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({
                courseId:newElective.course_id,
                electives:newElective.electives,
                year:newElective.year
            })  
        })

        if(!response.ok){
            const error=await response.json()
            console.error('Error creating elective:',error.error)
            toast({
                title:"Error",
                description:"Failed to create elective",
                variant:"failure"
            })
            return;
        }
        fetchElectives()
        setNewElective({ elective_id: '', name: '',course_id:'', year: 1, electives: '' })
        setIsNewElectiveDialogOpen(false)
        toast({ title: "Success", description: "Elective created successfully." ,variant:"success"})
    }catch(error){
        console.error('Error creating elective:',error)
        toast({
            title:"Error",
            description:"Failed to create elective",
            variant:"failure"
        })
    }
  }

  const handleUpdateElective = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingElective) return
    try{
        const response=await fetch(`/api/elective`,{
            method:'PUT',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                electiveId:editingElective.elective_id,
                electives:editingElective.electives,
                year:editingElective.year
            })
        })

        if(!response.ok){
            const error=await response.json()
            console.error('Error updating elective:',error.error)
            toast({
                title:"Error",
                description:"Failed to update elective",
                variant:"failure"
            })
            return
        }
        fetchElectives()
        setEditingElective(null)
        toast({ title: "Success", description: "Elective updated successfully.",variant:"success" })
    }catch(error){
        console.error('Error updating elective:',error)
        toast({
            title:"Error",
            description:"Failed to update elective",
            variant:"failure"
        })
    }
  }

  const handleDeleteElective = async (electiveId: string) => {
    console.log(electiveId)
    try{
        const response=await fetch(`/api/elective`,{
            method:'DELETE',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({electiveId})
        })
        const data=await response.json()
        if(!response.ok){
            console.error('Error deleting elective:',data.error)
            toast({
                title:"Error",
                description:"Failed to delete elective",
                variant:"failure"
            })
            return
        }
        fetchElectives()
        toast({ title: "Success", description: "Elective deleted successfully.",variant:"success" })   
    }catch(error){
        console.error('Error deleting elective:',error)
        toast({
            title:"Error",
            description:"Failed to delete elective",
            variant:"failure"
        })
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Course Management</h1>
      
      <Tabs defaultValue="courses" className="mb-8">
        <TabsList>
          <TabsTrigger value="courses">Manage Courses</TabsTrigger>
          <TabsTrigger value="subjects">Manage Subjects</TabsTrigger>
          <TabsTrigger value="electives">Manage Electives</TabsTrigger>
        </TabsList>
        
        <TabsContent value="courses">
          <Card>
            <CardHeader>
              <CardTitle>Manage Courses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Search className="w-5 h-5 text-gray-500" />
                  <Input
                    placeholder="Search courses..."
                    value={courseSearch}
                    onChange={(e) => setCourseSearch(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                <Dialog open={isNewCourseDialogOpen} onOpenChange={setIsNewCourseDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Course
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Course</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateCourse}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="courseName">Course Name</Label>
                            <Input
                              id="courseName"
                              value={newCourse.name}
                              onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
                              required
                              placeholder='Enter course name...'
                            />
                          </div>
                          <div>
                            <Label htmlFor="courseLevel">Level</Label>
                            <Select
                                onValueChange={(value) => setNewCourse({ ...newCourse, level: value })}
                                required>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Diploma">Diploma</SelectItem>
                                    <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                                    <SelectItem value="Postgraduate">Postgraduate</SelectItem>
                                </SelectContent>
                                    
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="courseDescription">Description</Label>
                          <Textarea
                            id="courseDescription"
                            value={newCourse.description}
                            onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                            required
                            placeholder='Enter course description...'
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="courseIntakes">Intakes</Label>
                            <Input
                              id="courseIntakes"
                              value={newCourse.intake}
                              onChange={(e) => setNewCourse({...newCourse, intake: e.target.value})}
                              required
                                placeholder='eg. January, May, September'
                            />
                          </div>
                          <div>
                            <Label htmlFor="courseDuration">Duration</Label>
                            <Input
                              id="courseDuration"
                              value={newCourse.duration}
                              onChange={(e) => setNewCourse({...newCourse, duration: e.target.value})}
                              required
                              placeholder='eg. 3 years, 4 years'
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="courseStudyMode">Study Mode</Label>
                            <Input
                              id="courseStudyMode"
                              value={newCourse.study_mode}
                              onChange={(e) => setNewCourse({...newCourse, study_mode: e.target.value})}
                              required
                              placeholder='eg. Full-time, Part-time'
                            />
                          </div>
                          <div>
                            <Label htmlFor="courseCategory">Category</Label>
                            <Select
                                
                                onValueChange={(value) => setNewCourse({ ...newCourse, category: value })}  // 
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Accounting, Business, Finance, Marketing">Accounting, Business, Finance, Marketing</SelectItem>
                                    <SelectItem value="Actuarial, Statistics">Actuarial, Statistics</SelectItem>
                                    <SelectItem value="Biology, Medicine and Psychology">Biology, Medicine and Psychology</SelectItem>
                                    <SelectItem value="Computing">Computing</SelectItem>
                                    <SelectItem value="Communication, Creative Arts">Communication, Creative Arts</SelectItem>
                                    <SelectItem value="Engineering">Engineering</SelectItem>
                                    <SelectItem value="Hospitality, Culinary, Events Management">Hospitality, Culinary, Events Management</SelectItem>
                                </SelectContent>

                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="courseFees">Fees</Label>
                          <Input
                            id="courseFees"
                            value={newCourse.fees}
                            onChange={(e) => setNewCourse({...newCourse, fees: e.target.value})}
                            required
                            placeholder='Enter fees...(json format)'
                          />
                        </div>
                        <div>
                          <Label htmlFor="courseCareerProspect">Career Prospect</Label>
                          <Input
                            id="courseCareerProspect"
                            value={newCourse.career_prospects}
                            onChange={(e) => setNewCourse({...newCourse, career_prospects: e.target.value})}
                            required
                            placeholder='Enter career prospects...(json format)'
                          />
                        </div>
                        <div>
                          <Label htmlFor="courseQualifications">Qualifications</Label>
                          <Input
                            id="courseQualifications"
                            value={newCourse.qualifications}
                            onChange={(e) => setNewCourse({...newCourse, qualifications: e.target.value})}
                            required
                            placeholder='Enter qualifications...(json format)'
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Add Course</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses
                    .filter(course => 
                      course.name.toLowerCase().includes(courseSearch.toLowerCase()) ||
                      course.course_id.toLowerCase().includes(courseSearch.toLowerCase())
                    )
                    .map((course) => (
                    <TableRow key={course.course_id}>
                      <TableCell>{course.course_id}</TableCell>
                      <TableCell>{course.name}</TableCell>
                      <TableCell>{course.level}</TableCell>
                      <TableCell>
                        <Button 
                          onClick={() => setViewingCourse(course)}
                          variant="outline"
                          size="sm"
                          className="mr-2"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button 
                          onClick={() => handleDeleteCourse(course.course_id)}
                          variant="destructive"
                          size="sm"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="subjects">
          <Card>
            <CardHeader>
              <CardTitle>Manage Subjects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Search className="w-5 h-5 text-gray-500" />
                  <Input
                    placeholder="Search subjects..."
                    value={subjectSearch}
                    onChange={(e) => setSubjectSearch(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                <Dialog open={isNewSubjectDialogOpen} onOpenChange={setIsNewSubjectDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Subject
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Subject</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateSubject}>
                      <div className="grid gap-4 py-4">
                      <div>
                        <Label htmlFor="subjectCourse">Course</Label>
                        <Select
                            value={newSubject.course_id || ''}
                            onValueChange={(value) => {
                                console.log('Selected course ID:', value, typeof value);
                                console.log('Courses:', courses);
                                const selectedCourse = courses.find(course => {
                                    console.log('Comparing:', course.course_id, typeof course.course_id, 'with', value, typeof value);
                                    const courseIdAsString = course.course_id.toString();
                                    const valueAsString = value.toString();
                                    return courseIdAsString === valueAsString;
                                  });
                                console.log('Found course:', selectedCourse);
                            setNewSubject({...newSubject, course_id: value, name: selectedCourse?.name || ''});
                            
                            }}
                            required
                        >
                            <SelectTrigger id="subjectCourse">
                                <SelectValue placeholder="Select Course"  />
                            </SelectTrigger>
                            <SelectContent>
                            {courses.map((course) => (
                                <SelectItem key={course.course_id} value={course.course_id.toString()}>{course.name}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                       
                        </div>
                        <div>
                          <Label htmlFor="subjectYear">Year</Label>
                          <Input
                            id="subjectYear"
                            type="number"
                            value={newSubject.year}
                            onChange={(e) => setNewSubject({...newSubject, year: parseInt(e.target.value)})}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="subjectName">Subject Name</Label>
                          <Textarea
                            id="subjectName"
                            value={newSubject.subjects}
                            onChange={(e) => setNewSubject({...newSubject, subjects: e.target.value})}
                            required
                            className='h-[250px]'
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Add Subject</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course Name</TableHead>
                    <TableHead className='text-center'>Year</TableHead>
                    <TableHead>Subjects</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subjects
                    .filter(subject => 
                      subject.name.toLowerCase().includes(subjectSearch.toLowerCase()) ||
                      subject.subjects.toLowerCase().includes(subjectSearch.toLowerCase()) ||
                      subject.year.toString().includes(subjectSearch.toLowerCase())
                    )
                    .map((subject) => (
                    <TableRow key={subject.subject_id}>
                      <TableCell className='w-[20%]'>{subject.name}</TableCell>
                      <TableCell className='w-[10%] text-center'>{subject.year}</TableCell>
                      <TableCell className='w-[40%]'>
                        {(() => {
                                try {
                                // Parse the JSON string into an array of objects
                                const parsedSubjects = JSON.parse(subject.subjects);
                                return (
                                    <ul className="list-disc ml-4">
                                    {parsedSubjects.map((subject: { course_name: string }, index: number) => (
                                        <li key={index}>{subject.course_name}</li>
                                    ))}
                                    </ul>
                                );
                                } catch (error) {
                                // If parsing fails, just display the string
                                return subject.subjects;
                                }
                            })()}
                        </TableCell>
                      <TableCell className='w-[15%]'>
                        <Button 
                          onClick={() => setEditingSubject(subject)}
                          variant="outline"
                          size="sm"
                          className="mr-2"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button 
                          onClick={() => handleDeleteSubject(subject.subject_id)}
                          variant="destructive"
                          size="sm"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="electives">
          <Card>
            <CardHeader>
              <CardTitle>Manage Electives</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Search className="w-5 h-5 text-gray-500" />
                  <Input
                    placeholder="Search electives..."
                    value={electiveSearch}
                    onChange={(e) => setElectiveSearch(e.target.value)}
                    className="max-w-sm"
                  />
                </div>
                <Dialog open={isNewElectiveDialogOpen} onOpenChange={setIsNewElectiveDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add New Elective
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Elective</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateElective}>
                      <div className="grid gap-4 py-4">
                        <div>
                          <Label htmlFor="electiveCourse">Course</Label>
                          <Select
                            value={newElective.course_id || ''}
                            onValueChange={(value) => {
                                console.log('Selected course ID:', value, typeof value);
                                console.log('Courses:', courses);
                                const selectedCourse = courses.find(course => {
                                    console.log('Comparing:', course.course_id, typeof course.course_id, 'with', value, typeof value);
                                    const courseIdAsString = course.course_id.toString();
                                    const valueAsString = value.toString();
                                    return courseIdAsString === valueAsString;
                                  });
                                console.log('Found course:', selectedCourse);
                            setNewElective({...newElective, course_id: value, name: selectedCourse?.name || ''});
                            
                            }}
                            required
                        >
                            <SelectTrigger id="electiveCourse">
                                <SelectValue placeholder="Select Course"  />
                            </SelectTrigger>
                            <SelectContent>
                            {courses.map((course) => (
                                <SelectItem key={course.course_id} value={course.course_id.toString()}>{course.name}</SelectItem>
                            ))}
                            </SelectContent>
                        </Select>
                        </div>
                        <div>
                          <Label htmlFor="electiveYear">Year</Label>
                          <Input
                            id="electiveYear"
                            type="number"
                            value={newElective.year}
                            onChange={(e) => setNewElective({...newElective, year: parseInt(e.target.value)})}
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="electiveName">Elective Name</Label>
                          <Textarea
                            id="electiveName"
                            value={newElective.electives}
                            onChange={(e) => setNewElective({...newElective, electives: e.target.value})}
                            required
                            className='h-[250px]'
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Add Elective</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course Name</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Elective</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {electives
                    .filter(elective => 
                      elective.name.toLowerCase().includes(electiveSearch.toLowerCase()) ||
                      elective.electives.toLowerCase().includes(electiveSearch.toLowerCase())||
                      elective.year.toString().includes(electiveSearch.toLowerCase())
                    )
                    .map((elective) => (
                    <TableRow key={elective.elective_id}>
                      <TableCell className='w-[20%]'>{elective.name}</TableCell>
                      <TableCell className='w-[10%]'>{elective.year}</TableCell>
                      <TableCell className='w-[40%]'>
                      {(() => {
                                try {
                                // Parse the JSON string into an array of objects
                                const parsedElectives = JSON.parse(elective.electives);
                                return (
                                    <ul className="list-disc ml-4">
                                    {parsedElectives.map((elective: { elective_name: string }, index: number) => (
                                        <li key={index}>{elective.elective_name}</li>
                                    ))}
                                    </ul>
                                );
                                } catch (error) {
                                // If parsing fails, just display the string
                                return elective.electives;
                                }
                            })()}
                            </TableCell>
                      <TableCell className='w-[15%]'>
                        <Button 
                          onClick={() => setEditingElective(elective)}
                          variant="outline"
                          size="sm"
                          className="mr-2"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button 
                          onClick={() => handleDeleteElective(elective.elective_id)}
                          variant="destructive"
                          size="sm"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Course Dialog */}
      {viewingCourse && (
        <Dialog open={!!viewingCourse} onOpenChange={() => setViewingCourse(null)}>
          <DialogContent className='max-w-4xl'>
            <DialogHeader>
              <DialogTitle>View Course</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
  <div className="flex gap-8">
    {/* Left Section */}
    <div className="flex-1 space-y-4">
      <div>
        <Label className='font-bold'>Name</Label>
        <div>{viewingCourse.name}</div>
      </div>
      <div>
        <Label className='font-bold'>Description</Label>
        <div>{viewingCourse.description}</div>
      </div>
    </div>

    {/* Right Section */}
    <div className="flex-1 space-y-4">
      <div>
        <Label className='font-bold'>Intakes</Label>
        <div>{viewingCourse.intake}</div>
      </div>
      <div>
        <Label className='font-bold'>Duration</Label>
        <div>{viewingCourse.duration}</div>
      </div>
      <div>
        <Label className='font-bold'>Study Mode</Label>
        <div>{viewingCourse.study_mode}</div>
      </div>
      <div>
        <Label className='font-bold'>Level</Label>
        <div>{viewingCourse.level}</div>
      </div>
      <div>
        <Label className='font-bold'>Category</Label>
        <div>{viewingCourse.category}</div>
      </div>
      <div>
        <Label className='font-bold'>Fees</Label>
            {(() => {
            try {
                const parsedFees = JSON.parse(viewingCourse.fees);
                return (
                <>
                    <div>
                    <strong>Local:</strong> {parsedFees.local.toLocaleString()}
                    </div>
                    <div>
                    <strong>International:</strong> {parsedFees.international.toLocaleString()}
                    </div>
                </>
                );
            } catch {
                return <div>{viewingCourse.fees}</div>;
            }
            })()}
        </div>
        <div>
            <Label className='font-bold'>Career Prospect</Label>
            <div className="grid grid-cols-2 gap-4">
                {(() => {
                try {
                    const careerProspects = JSON.parse(viewingCourse.career_prospects);
                    return (
                    Array.isArray(careerProspects) &&
                    careerProspects.map((career, index) => (
                        <div key={index}>- {career}</div>
                    ))
                    );
                } catch {
                    return <div>{viewingCourse.career_prospects}</div>; // Fallback if parsing fails
                }
                })()}
            </div>
        </div>
        <div>
            <Label className='font-bold'>Qualifications</Label>
            <div>
                {(() => {
                try {
                    const qualifications = JSON.parse(viewingCourse.qualifications);
                    return (
                    Array.isArray(qualifications) &&
                    qualifications.map((qualification, index) => (
                        <div key={index}>
                        <strong>{qualification.type}:</strong> {qualification.requirement}
                        </div>
                    ))
                    );
                } catch {
                    return <div>{viewingCourse.qualifications}</div>; // Fallback if parsing fails
                }
                })()}
            </div>
      </div>
    </div>
  </div>
</div>
            <DialogFooter>
              <Button onClick={() => {
                setEditingCourse(viewingCourse)
                setViewingCourse(null)
              }}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Course Dialog */}
      {editingCourse && (
        <Dialog open={!!editingCourse} onOpenChange={() => setEditingCourse(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Course</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleUpdateCourse}>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="editCourseName">Course Name</Label>
                  <Input
                    id="editCourseName"
                    value={editingCourse.name}
                    onChange={(e) => setEditingCourse({...editingCourse, name: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="editCourseDescription">Description</Label>
                  <Textarea
                    id="editCourseDescription"
                    value={editingCourse.description}
                    onChange={(e) => setEditingCourse({...editingCourse, description: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="editCourseIntakes">Intakes</Label>
                  <Input
                    id="editCourseIntakes"
                    value={editingCourse.intake}
                    onChange={(e) => setEditingCourse({...editingCourse, intake: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="editCourseDuration">Duration</Label>
                  <Input
                    id="editCourseDuration"
                    value={editingCourse.duration}
                    onChange={(e) => setEditingCourse({...editingCourse, duration: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="editCourseStudyMode">Study Mode</Label>
                  <Input
                    id="editCourseStudyMode"
                    value={editingCourse.study_mode}
                    onChange={(e) => setEditingCourse({...editingCourse, study_mode: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="editCourseLevel">Level</Label>
                  <Select
                    value={editingCourse.level}  
                    onValueChange={(value) => setEditingCourse({ ...editingCourse, level: value })}
                    required>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Level" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Diploma">Diploma</SelectItem>
                        <SelectItem value="Undergraduate">Undergraduate</SelectItem>
                        <SelectItem value="Postgraduate">Postgraduate</SelectItem>
                    </SelectContent>
                        
                  </Select>
                </div>
                <div>
                  <Label htmlFor="editCourseCategory">Category</Label>
                  <Select
                    value={editingCourse.category} 
                    onValueChange={(value) => setEditingCourse({ ...editingCourse, category: value })}  // 
                    required
                  >
                    <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Accounting, Business, Finance, Marketing">Accounting, Business, Finance, Marketing</SelectItem>
                        <SelectItem value="Actuarial, Statistics">Actuarial, Statistics</SelectItem>
                        <SelectItem value="Biology, Medicine and Psychology">Biology, Medicine and Psychology</SelectItem>
                        <SelectItem value="Computing">Computing</SelectItem>
                        <SelectItem value="Communication, Creative Arts">Communication, Creative Arts</SelectItem>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Hospitality, Culinary, Events Management">Hospitality, Culinary, Events Management</SelectItem>
                    </SelectContent>

                  </Select>
                </div>
                <div>
                  <Label htmlFor="editCourseFees">Fees</Label>
                  <Input
                    id="editCourseFees"
                    value={editingCourse.fees}
                    onChange={(e) => setEditingCourse({...editingCourse, fees: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="editCourseCareerProspect">Career Prospect</Label>
                  <Input
                    id="editCourseCareerProspect"
                    value={editingCourse.career_prospects}
                    onChange={(e) => setEditingCourse({...editingCourse, career_prospects: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="editCourseQualifications">Qualifications</Label>
                <Input
                  id="editCourseQualifications"
                  value={editingCourse.qualifications}
                  onChange={(e) => setEditingCourse({...editingCourse, qualifications: e.target.value})}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Update Course</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    )}


    {/* Edit Subject Dialog */}
    {editingSubject && (
      <Dialog open={!!editingSubject} onOpenChange={() => setEditingSubject(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subject</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateSubject}>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="editSubjectYear">Year</Label>
                <Input
                  id="editSubjectYear"
                  type="number"
                  value={editingSubject.year}
                  onChange={(e) => setEditingSubject({...editingSubject, year: parseInt(e.target.value)})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="editSubjectName">Subject</Label>
                <Textarea
                  id="editSubjectName"
                  value={editingSubject.subjects}
                  onChange={(e) => setEditingSubject({...editingSubject, subjects: e.target.value})}
                  required
                  className='h-[250px]'
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Update Subject</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    )}


    {/* Edit Elective Dialog */}
    {editingElective && (
      <Dialog open={!!editingElective} onOpenChange={() => setEditingElective(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Elective</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateElective}>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="editElectiveYear">Year</Label>
                <Input
                  id="editElectiveYear"
                  type="number"
                  value={editingElective.year}
                  onChange={(e) => setEditingElective({...editingElective, year: parseInt(e.target.value)})}
                  required
                />
              </div>
              <div>
                <Label htmlFor="editElectiveName">Elective</Label>
                <Textarea
                  id="editElectiveName"
                  value={editingElective.electives}
                  onChange={(e) => setEditingElective({...editingElective, electives: e.target.value})}
                  required
                  className='h-[250px]'
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Update Elective</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    )}
  </div>
)
}

