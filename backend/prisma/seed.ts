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

  // ─── Create Courses (7 total) ────────────────────────────────────────────────
  const courses = await Promise.all([
    // CS-401 — already enrolled by student
    prisma.course.create({
      data: {
        code: 'CS-401',
        title: 'Advanced Full-Stack Engineering & Cloud Architecture',
        description:
          'Modern enterprise web application engineering using React, Next.js, Node.js, and serverless infrastructure. Students build and deploy production-grade systems on AWS and GCP.',
        credits: 4,
        department: 'Computer Science',
        instructor: 'Dr. Sarah Jenkins',
        schedule: 'Mon / Wed 10:00 AM – 11:45 AM',
        location: 'Engineering Building – Room 302',
        capacity: 35,
        enrolledCount: 28,
        prerequisites: ['CS-201 Data Structures', 'CS-305 Web Fundamentals'],
      },
    }),
    // CS-480 — enrolled by club president
    prisma.course.create({
      data: {
        code: 'CS-480',
        title: 'Artificial Intelligence & Large Language Model Integration',
        description:
          'Principles of neural networks, NLP, and practical LLM proxy integration. Topics include prompt engineering, RAG pipelines, and responsible AI deployment.',
        credits: 4,
        department: 'Computer Science',
        instructor: 'Prof. Marcus Vance',
        schedule: 'Tue / Thu 02:00 PM – 03:45 PM',
        location: 'Science Complex – Room 108',
        capacity: 40,
        enrolledCount: 38,
        prerequisites: ['CS-310 Algorithms', 'MATH-202 Linear Algebra'],
      },
    }),
    // PM-320 — enrolled by student
    prisma.course.create({
      data: {
        code: 'PM-320',
        title: 'Agile Project Management with AI Workflows',
        description:
          'Scrum, Kanban, and AI-assisted sprint planning, backlog refinement, and automated team metrics for modern software delivery teams.',
        credits: 3,
        department: 'Project Management',
        instructor: 'Prof. Jeeta Gandhi',
        schedule: 'Friday 09:00 AM – 12:00 PM',
        location: 'Business Center – Hall A',
        capacity: 50,
        enrolledCount: 42,
        prerequisites: ['BUS-101 Principles of Management'],
      },
    }),
    // DES-210 — open for enrollment
    prisma.course.create({
      data: {
        code: 'DES-210',
        title: 'User Experience & Modern Design Systems',
        description:
          'UI/UX design principles, responsive layout systems, accessibility standards (WCAG 2.2), and production component library construction with Figma and Storybook.',
        credits: 3,
        department: 'Digital Design',
        instructor: 'Elena Rostova',
        schedule: 'Mon / Wed 01:00 PM – 02:30 PM',
        location: 'Design Studio – Room 12',
        capacity: 25,
        enrolledCount: 20,
        prerequisites: [],
      },
    }),
    // DS-350 — open for enrollment
    prisma.course.create({
      data: {
        code: 'DS-350',
        title: 'Data Science & Predictive Analytics',
        description:
          'Statistical modeling, feature engineering, and machine learning pipelines using Python (pandas, scikit-learn, XGBoost). Includes a capstone real-world dataset project.',
        credits: 4,
        department: 'Data Science',
        instructor: 'Dr. Priya Nair',
        schedule: 'Tue / Thu 10:00 AM – 11:45 AM',
        location: 'Math & Science Hall – Room 220',
        capacity: 45,
        enrolledCount: 31,
        prerequisites: ['MATH-201 Statistics', 'CS-150 Intro to Python'],
      },
    }),
    // CYB-410 — nearly full
    prisma.course.create({
      data: {
        code: 'CYB-410',
        title: 'Cybersecurity & Ethical Hacking',
        description:
          'Offensive and defensive security: penetration testing, vulnerability analysis, network forensics, and secure system design. Includes hands-on CTF lab sessions.',
        credits: 4,
        department: 'Cybersecurity',
        instructor: 'Prof. Daniel Okafor',
        schedule: 'Wed / Fri 02:00 PM – 03:45 PM',
        location: 'Tech Center – Cyber Lab 01',
        capacity: 30,
        enrolledCount: 29,
        prerequisites: ['CS-310 Algorithms', 'NET-201 Networking Fundamentals'],
      },
    }),
    // ETH-215 — open, no prereqs
    prisma.course.create({
      data: {
        code: 'ETH-215',
        title: 'Ethics in Artificial Intelligence & Technology',
        description:
          'Critical examination of AI bias, algorithmic fairness, data privacy, and the societal impact of emerging technologies. Guest lecturers from industry and policy sectors.',
        credits: 3,
        department: 'Philosophy & Ethics',
        instructor: 'Dr. Amara Osei',
        schedule: 'Thursday 06:00 PM – 09:00 PM',
        location: 'Liberal Arts Building – Room 401',
        capacity: 60,
        enrolledCount: 22,
        prerequisites: [],
      },
    }),
  ]);

  console.log(`Created ${courses.length} courses.`);

  // Enroll student persona in CS-401 and PM-320
  // Enroll club president in CS-480
  await prisma.enrollment.createMany({
    data: [
      { userId: studentPersona.id, courseId: courses[0].id, status: 'ENROLLED' },
      { userId: studentPersona.id, courseId: courses[2].id, status: 'ENROLLED' },
      { userId: clubPresidentPersona.id, courseId: courses[1].id, status: 'ENROLLED' },
    ],
  });

  // ─── Create Advisors (5 total) ───────────────────────────────────────────────
  const advisors = await Promise.all([
    prisma.advisor.create({
      data: {
        name: 'Dr. Robert Chen',
        email: 'r.chen@cstu.edu',
        department: 'Computer Science',
        title: 'Senior Academic Advisor & Department Chair',
        office: 'Engineering Hall 405',
        avatarUrl:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
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
        avatarUrl:
          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
        specialities: ['Resume Reviews', 'Interview Prep', 'Industry Networking'],
      },
    }),
    prisma.advisor.create({
      data: {
        name: 'Dr. Marcus Webb',
        email: 'm.webb@cstu.edu',
        department: 'Graduate Studies',
        title: 'Graduate Admissions & Research Advisor',
        office: 'Graduate Center 118',
        avatarUrl:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256',
        specialities: ['MS / PhD Applications', 'Research Proposals', 'Funding & Fellowships'],
      },
    }),
    prisma.advisor.create({
      data: {
        name: 'Counselor Nina Park',
        email: 'n.park@cstu.edu',
        department: 'Student Wellness',
        title: 'Mental Health & Wellness Counselor',
        office: 'Health & Wellness Center 305',
        avatarUrl:
          'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256',
        specialities: ['Academic Stress', 'Burnout Recovery', 'Time Management Coaching'],
      },
    }),
    prisma.advisor.create({
      data: {
        name: 'Advisor James Okonkwo',
        email: 'j.okonkwo@cstu.edu',
        department: 'Financial Aid',
        title: 'Financial Aid & Scholarships Coordinator',
        office: 'Administration Building 202',
        avatarUrl:
          'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256',
        specialities: ['FAFSA Guidance', 'Merit Scholarships', 'Student Loan Planning'],
      },
    }),
  ]);

  console.log(`Created ${advisors.length} advisors.`);

  // ─── Create Events (7 total, covering all categories) ───────────────────────
  const events = await Promise.all([
    // CAREER
    prisma.campusEvent.create({
      data: {
        title: 'Spring 2026 Tech & AI Career Fair',
        description:
          'Meet 50+ leading technology companies, startups, and university research labs hiring for summer internships and full-time roles. Bring printed résumés and dress professionally.',
        category: 'CAREER',
        location: 'Campus Center Great Hall',
        startTime: new Date('2026-08-20T10:00:00Z'),
        endTime: new Date('2026-08-20T16:00:00Z'),
        organizer: 'Campus Career Center',
        capacity: 500,
        rsvpCount: 312,
        imageUrl:
          'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=600',
      },
    }),
    // WORKSHOP
    prisma.campusEvent.create({
      data: {
        title: 'AI Hackathon: Building Sustainable Campus Solutions',
        description:
          'Join a 24-hour sprint to build innovative AI applications addressing energy efficiency, student wellness, and smart campus logistics. Prizes worth $10,000 across 3 tracks.',
        category: 'WORKSHOP',
        location: 'Innovation Hub Lab 1',
        startTime: new Date('2026-08-25T09:00:00Z'),
        endTime: new Date('2026-08-26T12:00:00Z'),
        organizer: 'CSTU Developer Student Club',
        capacity: 120,
        rsvpCount: 89,
        imageUrl:
          'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=600',
      },
    }),
    // SOCIAL
    prisma.campusEvent.create({
      data: {
        title: 'Campus Welcome Back Festival & BBQ',
        description:
          'Celebrate the start of the semester with live music, food trucks, carnival games, and student organization booths. Connect with new and returning students on the Quad!',
        category: 'SOCIAL',
        location: 'University Quad Lawn',
        startTime: new Date('2026-08-28T16:00:00Z'),
        endTime: new Date('2026-08-28T21:00:00Z'),
        organizer: 'Student Government Association',
        capacity: 1000,
        rsvpCount: 650,
        imageUrl:
          'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=600',
      },
    }),
    // ACADEMIC
    prisma.campusEvent.create({
      data: {
        title: 'CS Department Research Symposium 2026',
        description:
          'Faculty and senior students present ongoing research in AI, distributed systems, and quantum computing. Poster sessions, lightning talks, and networking reception included.',
        category: 'ACADEMIC',
        location: 'Engineering Building – Auditorium A',
        startTime: new Date('2026-09-05T13:00:00Z'),
        endTime: new Date('2026-09-05T18:00:00Z'),
        organizer: 'Department of Computer Science',
        capacity: 250,
        rsvpCount: 178,
        imageUrl:
          'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600',
      },
    }),
    // SPORTS
    prisma.campusEvent.create({
      data: {
        title: 'Intramural 3×3 Basketball Tournament',
        description:
          'Form a team of 3 and compete in CSTU\'s annual intramural basketball tournament. Open to all enrolled students. Trophies and campus store gift cards for winners.',
        category: 'SPORTS',
        location: 'Campus Recreation Center – Courts 3 & 4',
        startTime: new Date('2026-09-06T10:00:00Z'),
        endTime: new Date('2026-09-06T17:00:00Z'),
        organizer: 'Campus Recreation & Intramurals',
        capacity: 96,
        rsvpCount: 64,
        imageUrl:
          'https://images.unsplash.com/photo-1546519638405-a9d1b93f4dc5?auto=format&fit=crop&q=80&w=600',
      },
    }),
    // WORKSHOP
    prisma.campusEvent.create({
      data: {
        title: 'Resume & LinkedIn Masterclass',
        description:
          'Hands-on workshop led by Career Services professionals. Learn to craft ATS-optimized resumes, build a standout LinkedIn profile, and leverage alumni networks for your job search.',
        category: 'WORKSHOP',
        location: 'Student Union – Conference Room B',
        startTime: new Date('2026-09-10T14:00:00Z'),
        endTime: new Date('2026-09-10T16:00:00Z'),
        organizer: 'Campus Career Center',
        capacity: 80,
        rsvpCount: 55,
        imageUrl:
          'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=600',
      },
    }),
    // SOCIAL
    prisma.campusEvent.create({
      data: {
        title: 'International Culture Night',
        description:
          'A vibrant evening showcasing student performances, traditional cuisine, and cultural exhibits from 30+ countries represented at CSTU. All are welcome to attend and celebrate diversity.',
        category: 'SOCIAL',
        location: 'Performing Arts Center – Main Stage',
        startTime: new Date('2026-09-19T18:00:00Z'),
        endTime: new Date('2026-09-19T22:00:00Z'),
        organizer: 'International Student Association',
        capacity: 600,
        rsvpCount: 420,
        imageUrl:
          'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=600',
      },
    }),
  ]);

  console.log(`Created ${events.length} campus events.`);

  // RSVP student to Tech Career Fair and AI Hackathon
  await prisma.eventRSVP.createMany({
    data: [
      { userId: studentPersona.id, eventId: events[0].id, status: 'CONFIRMED' },
      { userId: studentPersona.id, eventId: events[1].id, status: 'CONFIRMED' },
      { userId: clubPresidentPersona.id, eventId: events[1].id, status: 'CONFIRMED' },
    ],
  });

  // Create a scheduled appointment for student with Dr. Chen
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
