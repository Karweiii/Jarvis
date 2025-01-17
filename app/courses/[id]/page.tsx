import Link from 'next/link'
import { notFound } from 'next/navigation'
import { IoCalendar } from "react-icons/io5"
import { GiDuration } from "react-icons/gi"
import { MdWork } from "react-icons/md"
import { FaBook } from "react-icons/fa";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { ChevronDown } from 'lucide-react'

async function getCourse(courseId: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/course/${courseId}`)
    if (!res.ok) {
      const errorData = await res.json()
      throw new Error(errorData.error || 'Failed to fetch course')
    }
    return await res.json()
  } catch (error) {
    console.error('Error:', error)
    throw error
  }
}

interface Subject {
  id: number
  course_id: number
  year: number
  subjects: string
}

interface Elective {
  id: number
  course_id: number
  year: number
  electives: string
}

interface Course {
  id: number
  name: string
  description: string
  intake: string
  duration: string
  study_mode: string
  career_prospects: string
  fees: string
  course_id: number
  level: string
  categoryName: string
  qualifications: string
}

interface PageProps {
  params: {
    id: string
  }
}

export default async function CoursePage({ params }: { params: { id: string } }) {
  let data;
  const {id}=await params;
  try {
    
    data = await getCourse(id)
    console.log(data)
  } catch (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-red-600">{error instanceof Error ? error.message : 'Failed to fetch course'}</p>
          <Link href="/courses" className="text-slate-600 hover:underline mt-4 inline-block">
            &larr; Back to Course List
          </Link>
        </div>
      </div>
    )
  }

  const { course, subjects,electives }: { course: Course, subjects: Subject[],electives:Elective[] } = data
  console.log( electives)
  console.log(course.qualifications)
  
  if (!course || !subjects) {
    notFound()
  }

  let careerArray: string[] = [];
  try {
    careerArray = course.career_prospects ? JSON.parse(course.career_prospects) : [];
  } catch (e) {
    console.error('Error parsing career prospects:', e);
  }

  let coursefee = { local: 'N/A', international: 'N/A' };
  try {
    coursefee = JSON.parse(course.fees);
  } catch (e) {
    console.error('Error parsing course fees:', e);
  }

  let qualifications = [];
  try {
    qualifications = Array.isArray(course.qualifications) ? course.qualifications : JSON.parse(course.qualifications || '[]');
  } catch (e) {
    console.error('Error parsing qualifications:', e);
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="container mx-auto p-8">
        <Link href="/courses" className="text-slate-600 hover:underline  mb-4 inline-block">&larr; Back to Course List</Link>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-3xl font-bold mb-4">{course.name}</h2>
          <p className="text-xl mb-6">{course.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className='bg-[#6AACE0] p-4 rounded-lg text-white'>
              <h3 className="text-2xl font-semibold mb-2">Course Details</h3>    
              <div className='mb-4 flex flex-row'>
                <IoCalendar className='w-8 h-8 mr-4'/>
                <p><strong>Intakes </strong><br/>{course.intake}</p>
              </div>
              <div className='mb-4 flex flex-row'>
                <GiDuration className='w-8 h-8 mr-4'/>
                <p><strong>Duration </strong><br/>{course.duration} ({course.study_mode})</p>
              </div>
              <div className='mb-4 flex flex-row'>
                <MdWork className='w-8 h-8 mr-4'/>
                <div>
                  <p><strong>Career Prospects </strong></p>
                  <ul className="mt-2 pl-2 grid grid-rows-4 grid-flow-col gap-4 list-disc list-inside">
                    {careerArray.map((prospect, index) => (
                      <li key={index}>{prospect}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className='mb-4 flex flex-row'>
                <MdWork className='w-8 h-8 mr-4'/>
                <div>
                  <p><strong>Estimated Annual Course Fee </strong></p>
                  <ul className='pl-2 grid grid-rows-1 grid-flow-col gap-4 list-disc list-inside'>
                    <li className='mr-4'><strong>Local:</strong> RM {coursefee.local}</li>
                    <li><strong>International:</strong> USD {coursefee.international}</li>
                  </ul>
                </div>
              </div>
              <div className='mb-2 flex flex-row'>
                <FaBook className='w-8 h-8 mr-4'/>
                <div>
                  <p><strong>Entry Requirements </strong></p>
                  <ul className="grid grid-rows-4 grid-flow-col pl-2  list-disc list-inside">
                    {qualifications.map((qualification:{type:string;requirement:string}, index:number) => (
                      <li key={`${index}-${qualification.type}`} className="mb-2">
                        <strong>{qualification.type}: </strong>{qualification.requirement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
            </div>
            <div className="p-4 bg-[#65D46E] text-white rounded-lg">
            <h3 className="text-2xl font-semibold mb-4">Course Structure</h3>
            <Accordion type="single" collapsible className="w-full">
              {subjects.map((subject) => (
                <AccordionItem className='' key={`subject-${subject.year}`} value={`subjectyear-${subject.year}`}>
                  <AccordionTrigger className="hover:no-underline group ">
                    <span className="text-left font-bold text-xl flex-grow">Year {subject.year}</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul key={`${subject.year}-${subject.id}-${subject.course_id}`} className="grid grid-rows-5 gap-2 grid-flow-col pl-6 list-disc">
                      {JSON.parse(subject.subjects).map((course: {  course_name: string }) => (
                        <li className=" ">
                          <strong>{course.course_name}</strong>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
              {electives.map((elective) => (
                <AccordionItem className='' key={`elective-${elective.year}`} value={`electiveyear-${elective.year}`}>
                  <AccordionTrigger className="hover:no-underline group ">
                    <span className="text-left font-bold text-xl flex-grow">Elective Subjects for Year {elective.year}</span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul key={elective.year} className="grid grid-rows-5 gap-2 grid-flow-col pl-6 list-disc ">
                      {JSON.parse(elective.electives).map((elective: { course_code: string; elective_name: string }) => (
                        <li className="mb-2">
                          <strong>{elective.elective_name}</strong>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          </div>
        </div>
      </main>
    </div>
  )
}

