import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SCHOOLS_API_ROUTES } from '../constants/apiRoutes';

@Injectable({ providedIn: 'root' })
export class SchoolsTeachersLessonsService {
  constructor(private http: HttpClient) {}

  private apiRoutes = SCHOOLS_API_ROUTES;

  assignTeacher(teacherId: string, lessonId: number): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutes.assignTeacher(), {
      teacherId,
      lessonId,
    });
  }
  removeTeacher(teacherId: string): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutes.detachTeacher(), {
      teacherId,
    });
  }

  approveAllLessons(teacherId: string): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutes.approveAllLessons(), {
      teacherId,
    });
  }

  rejectAllLessons(teacherId: string): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutes.rejectAllLessons(), {
      teacherId,
    });
  }

  approveLesson(teacherId: string, teacherLessonId: number): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutes.approveLesson(), {
      teacherId,
      teacherLessonId,
    });
  }

  rejectLesson(teacherId: string, teacherLessonId: number): Observable<boolean> {
    return this.http.post<boolean>(this.apiRoutes.rejectLesson(), {
      teacherId,
      teacherLessonId,
    });
  }
}
