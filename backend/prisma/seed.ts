import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding CampusConnect CSTU persona database...');

  // Clean existing data
  await prisma.chatMessage.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.eventRSVP.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.advisor.deleteMany();
  await prisma.campusEvent.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  // Create CSTU Personas
  const studentPersona = await prisma.user.create({
    data: {
      email: 'student@cstu.edu',
      name: 'Alex Rivera',
      passwordHash: 'password123',
      role: 'STUDENT',
      studentId: 'CSTU-2026-8891',
      major: 'Computer Science & Software Engineering',
      term: 'Senior (Spring 2026)',
      gpa: 3.84,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    },
  });

  const clubPresidentPersona = await prisma.user.create({
    data: {
      email: 'club-president@cstu.edu',
      name: 'Jordan Lee',
      passwordHash: 'password123',
      role: 'STUDENT',
      studentId: 'CSTU-2026-7742',
      major: 'Artificial Intelligence & Data Science',
      term: 'Senior (Spring 2026)',
      gpa: 3.92,
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=256',
    },
  });

  const adminPersona = await prisma.user.create({
    data: {
      email: 'admin@cstu.edu',
      name: 'Morgan Taylor',
      passwordHash: 'password123',
      role: 'ADMIN',
      studentId: 'CSTU-ADM-1001',
      major: 'Academic Operations & System Affairs',
      term: 'Faculty / Admin',
      gpa: 4.0,
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
    },
  });

  console.log(`Created CSTU personas: ${studentPersona.email}, ${clubPresidentPersona.email}, ${adminPersona.email}`);

  // Create Courses
  const courses = await Promise.all([
    prisma.course.create({
      data: {
        code: 'CS-401',
        title: 'Advanced Full-Stack Engineering & Cloud Architecture',
        description: 'Modern enterprise web application engineering using React, Next.js, Node.js, and serverless infrastructure.',
        credits: 4,
        department: 'Computer Science',
        instructor: 'Dr. Sarah Jenkins',
        schedule: 'Mon / Wed 10:00 AM - 11:45 AM',
        location: 'Engineering Building - Room 302',
        capacity: 35,
        enrolledCount: 28,
        prerequisites: ['CS-201 Data Structures', 'CS-305 Web Fundamentals'],
      },
    }),
    prisma.course.create({
      data: {
        code: 'CS-480',
        title: 'Artificial Intelligence & Large Language Model Integration',
        description: 'Principles of neural networks, NLP, and practical LLM proxy integration using modern AI frameworks.',
        credits: 4,
        department: 'Computer Science',
        instructor: 'Prof. Marcus Vance',
        schedule: 'Tue / Thu 02:00 PM - 03:45 PM',
        location: 'Science Complex - Room 108',
        capacity: 40,
        enrolledCount: 38,
        prerequisites: ['CS-310 Algorithms', 'MATH-202 Linear Algebra'],
      },
    }),
    prisma.course.create({
      data: {
        code: 'PM-320',
        title: 'Agile Project Management with AI Workflows',
        description: 'Scrum, Kanban, and AI-assisted sprint planning, backlog refinement, and automated team metrics.',
        credits: 3,
        department: 'Project Management',
        instructor: 'Prof. Jeeta Gandhi',
        schedule: 'Friday 09:00 AM - 12:00 PM',
        location: 'Business Center - Hall A',
        capacity: 50,
        enrolledCount: 42,
        prerequisites: ['BUS-101 Principles of Management'],
      },
    }),
    prisma.course.create({
      data: {
        code: 'DES-210',
        title: 'User Experience & Modern Design Systems',
        description: 'UI/UX design principles, responsive layout design, accessibility standards (WCAG), and component libraries.',
        credits: 3,
        department: 'Digital Design',
        instructor: 'Elena Rostova',
        schedule: 'Mon / Wed 01:00 PM - 02:30 PM',
        location: 'Design Studio - Room 12',
        capacity: 25,
        enrolledCount: 20,
        prerequisites: [],
      },
    }),
  ]);

  console.log(`Created ${courses.length} courses.`);

  // Enroll student persona in CS-401 and PM-320
  await prisma.enrollment.createMany({
    data: [
      { userId: studentPersona.id, courseId: courses[0].id, status: 'ENROLLED' },
      { userId: studentPersona.id, courseId: courses[2].id, status: 'ENROLLED' },
      { userId: clubPresidentPersona.id, courseId: courses[1].id, status: 'ENROLLED' },
    ],
  });

  // Create Advisors
  const advisors = await Promise.all([
    prisma.advisor.create({
      data: {
        name: 'Dr. Robert Chen',
        email: 'r.chen@cstu.edu',
        department: 'Computer Science',
        title: 'Senior Academic Advisor & Department Chair',
        office: 'Engineering Hall 405',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
        specialities: ['Degree Audits', 'Senior Capstones', 'Graduate School Prep'],
      },
    }),
    prisma.advisor.create({
      data: {
        name: 'Prof. Amanda Taylor',
        email: 'a.taylor@cstu.edu',
        department: 'Career Services',
        title: 'Career & Internship Counselor',
        office: 'Student Union 210',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
        specialities: ['Resume Reviews', 'Interview Prep', 'Industry Networking'],
      },
    }),
  ]);

  console.log(`Created ${advisors.length} advisors.`);

  // Create Events
  const events = await Promise.all([
    prisma.campusEvent.create({
      data: {
        title: 'Spring 2026 Tech & AI Career Fair',
        description: 'Meet 50+ leading technology companies, startups, and university research labs hiring for summer internships and full-time roles.',
        category: 'CAREER',
        location: 'Campus Center Great Hall',
        startTime: new Date('2026-08-20T10:00:00Z'),
        endTime: new Date('2026-08-20T16:00:00Z'),
        organizer: 'Campus Career Center',
        capacity: 500,
        rsvpCount: 312,
        imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=600',
      },
    }),
    prisma.campusEvent.create({
      data: {
        title: 'AI Hackathon: Building Sustainable Campus Solutions',
        description: 'Join a 24-hour sprint to build innovative AI applications addressing energy efficiency, student wellness, and smart campus logistics.',
        category: 'WORKSHOP',
        location: 'Innovation Hub Lab 1',
        startTime: new Date('2026-08-25T09:00:00Z'),
        endTime: new Date('2026-08-26T12:00:00Z'),
        organizer: 'CSTU Developer Student Club',
        capacity: 120,
        rsvpCount: 89,
        imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=600',
      },
    }),
    prisma.campusEvent.create({
      data: {
        title: 'Campus Welcome Back Festival & BBQ',
        description: 'Celebrate the start of the semester with live music, food trucks, games, and student organization booths.',
        category: 'SOCIAL',
        location: 'University Quad Lawn',
        startTime: new Date('2026-08-28T16:00:00Z'),
        endTime: new Date('2026-08-28T21:00:00Z'),
        organizer: 'Student Government Association',
        capacity: 1000,
        rsvpCount: 650,
        imageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=600',
      },
    }),
  ]);

  console.log(`Created ${events.length} campus events.`);

  // RSVP student to Tech Career Fair
  await prisma.eventRSVP.create({
    data: {
      userId: studentPersona.id,
      eventId: events[0].id,
      status: 'CONFIRMED',
    },
  });

  // Create an appointment for student
  await prisma.appointment.create({
    data: {
      studentId: studentPersona.id,
      advisorId: advisors[0].id,
      startTime: new Date('2026-08-22T14:00:00Z'),
      endTime: new Date('2026-08-22T14:30:00Z'),
      purpose: 'Senior Capstone Planning & Graduation Audit',
      notes: 'Please review current transcript prior to meeting.',
      status: 'SCHEDULED',
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
