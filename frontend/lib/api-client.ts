import {
  User,
  Course,
  Enrollment,
  CampusEvent,
  EventRSVP,
  Advisor,
  Appointment,
  ChatMessage,
  ApiResponse,
  LoginInput,
  ScheduleAppointmentInput,
  AiQueryInput,
} from '@campusconnect/shared';
import { STORAGE_USER_KEY, AuthUser } from './auth-context';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

/** Full profile payload returned by GET /auth/profile, including relations. */
export type UserProfile = User & {
  enrollments: Enrollment[];
  rsvps: EventRSVP[];
  appointments: Appointment[];
};

class ApiClient {
  /**
   * Reads the currently signed-in user straight from localStorage (the same
   * place auth-context.tsx persists it) so every request — even ones made
   * outside a React component — carries the real logged-in identity instead
   * of a hardcoded 'STUDENT' placeholder.
   */
  private getStoredUser(): AuthUser | null {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(STORAGE_USER_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch (_err) {
      return null;
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const currentUser = this.getStoredUser();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(currentUser
        ? {
            'x-user-id': currentUser.id,
            'x-user-role': currentUser.role,
            'x-user-email': currentUser.email,
            'x-user-name': currentUser.name,
          }
        : {}),
      ...(options.headers as Record<string, string>),
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const json = await response.json();
      if (!response.ok) {
        return {
          success: false,
          error: json.error || { code: 'HTTP_ERROR', message: `Server error: ${response.status}` },
        };
      }

      return json;
    } catch (err: unknown) {
      return {
        success: false,
        error: {
          code: 'NETWORK_ERROR',
          message: err instanceof Error ? err.message : 'Network failure connecting to backend API',
        },
      };
    }
  }

  // Auth API
  async login(payload: LoginInput): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getProfile(): Promise<ApiResponse<UserProfile>> {
    return this.request<UserProfile>('/auth/profile');
  }

  // Courses API
  async getCourses(): Promise<ApiResponse<Course[]>> {
    return this.request<Course[]>('/courses');
  }

  async enrollCourse(courseId: string): Promise<ApiResponse<Enrollment>> {
    return this.request<Enrollment>('/courses/enroll', {
      method: 'POST',
      body: JSON.stringify({ courseId }),
    });
  }

  async dropCourse(courseId: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/courses/${courseId}`, {
      method: 'DELETE',
    });
  }

  // Events API
  async getEvents(): Promise<ApiResponse<CampusEvent[]>> {
    return this.request<CampusEvent[]>('/events');
  }

  async rsvpEvent(eventId: string): Promise<ApiResponse<EventRSVP>> {
    return this.request<EventRSVP>('/events/rsvp', {
      method: 'POST',
      body: JSON.stringify({ eventId }),
    });
  }

  async cancelRsvp(eventId: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/events/rsvp/${eventId}`, {
      method: 'DELETE',
    });
  }

  // Appointments API
  async getAdvisors(): Promise<ApiResponse<Advisor[]>> {
    return this.request<Advisor[]>('/appointments/advisors');
  }

  async getAppointments(): Promise<ApiResponse<Appointment[]>> {
    return this.request<Appointment[]>('/appointments');
  }

  async scheduleAppointment(payload: ScheduleAppointmentInput): Promise<ApiResponse<Appointment>> {
    return this.request<Appointment>('/appointments', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async cancelAppointment(appointmentId: string): Promise<ApiResponse<Appointment>> {
    return this.request<Appointment>(`/appointments/${appointmentId}/cancel`, {
      method: 'PATCH',
    });
  }

  // AI Assistant API
  async askAi(payload: AiQueryInput): Promise<ApiResponse<ChatMessage>> {
    return this.request<ChatMessage>('/ai/chat', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Developer Panel API
  async resetDemoData(): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>('/dev/reset', {
      method: 'POST',
    });
  }
}

export const apiClient = new ApiClient();
