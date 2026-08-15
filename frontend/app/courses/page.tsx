'use client';

import React, { useEffect, useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Sidebar } from '@/components/sidebar';
import { Footer } from '@/components/footer';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert } from '@/components/ui/alert';
import { BookOpen, Clock, MapPin, User, AlertCircle } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { Course } from '@campusconnect/shared';

type MockCourse = Course & { registered: boolean };

interface UserState {
  registeredCourseIds: string[];
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<MockCourse[]>([]);
  const [userState, setUserState] = useState<UserState>({ registeredCourseIds: [] });
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'danger'; message: string } | null>(null);

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true);
      const res = await apiClient.getCourses();
      if (res.data) {
        setCourses(res.data.map((course) => ({ ...course, registered: false })));
      }
      setLoading(false);
    }
    fetchCourses();
  }, []);

  const handleRegister = async (courseId: string) => {
    setFeedback(null);
    setActionLoading(courseId);
    const response = await apiClient.enrollCourse(courseId);
    setActionLoading(null);
    if (!response.success) {
      setFeedback({ type: 'danger', message: response.error?.message || 'Course registration failed.' });
      return;
    }
    setCourses((currentCourses) => currentCourses.map((course) =>
      course.id === courseId ? { ...course, registered: true, enrolledCount: course.enrolledCount + 1 } : course
    ));
    setUserState((currentUserState) => ({
      registeredCourseIds: currentUserState.registeredCourseIds.includes(courseId)
        ? currentUserState.registeredCourseIds
        : [...currentUserState.registeredCourseIds, courseId],
    }));
    setFeedback({ type: 'success', message: 'Course registered and added to your semester schedule.' });
  };

  const handleRemove = async (courseId: string) => {
    setFeedback(null);
    setActionLoading(courseId);
    const response = await apiClient.dropCourse(courseId);
    setActionLoading(null);
    if (!response.success) {
      setFeedback({ type: 'danger', message: response.error?.message || 'Course removal failed.' });
      return;
    }
    setCourses((currentCourses) => currentCourses.map((course) =>
      course.id === courseId ? { ...course, registered: false, enrolledCount: Math.max(0, course.enrolledCount - 1) } : course
    ));
    setUserState((currentUserState) => ({
      registeredCourseIds: currentUserState.registeredCourseIds.filter((id) => id !== courseId),
    }));
    setFeedback({ type: 'success', message: 'Course removed from your semester schedule.' });
  };

  const filteredCourses = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.instructor.toLowerCase().includes(search.toLowerCase())
  );
  const registeredCourses = courses.filter((course) => userState.registeredCourseIds.includes(course.id));

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 lg:p-8 space-y-6 max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
                <BookOpen className="h-7 w-7 text-brand-400" /> Course Registration Catalog
              </h1>
              <p className="text-sm text-slate-400">Spring 2026 Academic Term Course Selection</p>
            </div>

            <div className="w-full md:w-72">
              <Input
                placeholder="Search code, title, or instructor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-slate-900 border-slate-800"
              />
            </div>
          </div>

          {feedback && (
            <Alert variant={feedback.type} title={feedback.type === 'success' ? 'Success' : 'Error'}>
              {feedback.message}
            </Alert>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_18rem] gap-6 items-start">
              {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCourses.map((course) => {
                const isRegistered = course.registered;
                const isFull = course.enrolledCount >= course.capacity;

                return (
                  <Card key={course.id} className="flex flex-col justify-between hover:border-brand-500/40">
                    <CardHeader className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-bold text-brand-400 font-mono">{course.code}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="neutral">{course.credits} Credits</Badge>
                          {isRegistered && <Badge variant="success">Registered</Badge>}
                        </div>
                      </div>
                      <CardTitle className="text-lg leading-snug">{course.title}</CardTitle>
                      <CardDescription className="line-clamp-2 text-xs leading-relaxed">
                        {course.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4 pt-4 border-t border-slate-800/80">
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{course.instructor}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{course.schedule}</span>
                        </div>
                        <div className="flex items-center gap-1.5 col-span-2">
                          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{course.location}</span>
                        </div>
                      </div>

                      {course.prerequisites.length > 0 && (
                        <div className="text-[11px] text-slate-400 space-y-1">
                          <span className="font-semibold text-slate-300">Prerequisites:</span>
                          <p>{course.prerequisites.join(', ')}</p>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2">
                        <div className="text-xs text-slate-400 font-mono">
                          Seats: <span className={isFull ? 'text-rose-400' : 'text-emerald-400'}>{course.enrolledCount}</span> / {course.capacity}
                        </div>

                        {isRegistered ? (
                          <Button
                            variant="danger"
                            size="sm"
                            isLoading={actionLoading === course.id}
                            onClick={() => handleRemove(course.id)}
                          >
                            Remove
                          </Button>
                        ) : (
                          <Button
                            variant="primary"
                            size="sm"
                            disabled={isFull}
                            isLoading={actionLoading === course.id}
                            onClick={() => handleRegister(course.id)}
                          >
                            {isFull ? 'Course Full' : 'Register'}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
              </div>
              ) : (
                <div className="text-center py-16 glass-panel rounded-2xl space-y-2 border border-slate-800">
                  <AlertCircle className="h-8 w-8 text-slate-500 mx-auto" />
                  <h3 className="text-base font-semibold text-white">No courses match your query</h3>
                  <p className="text-xs text-slate-400">Try searching for a different course code, title, or instructor.</p>
                </div>
              )}
              <Card className="xl:sticky xl:top-24">
                <h2 className="text-base font-semibold text-white">My Semester Schedule</h2>
                <p className="mt-1 text-xs text-slate-400">{registeredCourses.length} registered course{registeredCourses.length === 1 ? '' : 's'}</p>
                <div className="mt-4 space-y-3">
                  {registeredCourses.length > 0 ? registeredCourses.map((course) => (
                    <div key={course.id} className="rounded-lg border border-slate-800 bg-slate-900/70 p-3">
                      <p className="text-xs font-semibold text-brand-400">{course.code}</p>
                      <p className="mt-1 text-xs text-slate-200">{course.title}</p>
                      <p className="mt-2 text-[11px] text-slate-400">{course.schedule}</p>
                    </div>
                  )) : <p className="py-5 text-center text-xs text-slate-500">Register for a course to build your schedule.</p>}
                </div>
              </Card>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
