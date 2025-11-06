import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { LESSONS_API_ROUTES } from '../constants/lessons.api.const';
import { ILessonsGroupedByLevel, ILessonsInRoot, ILessonsResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class LessonsService {
  constructor(private http: HttpClient) {}

  private apiRoutes = LESSONS_API_ROUTES;

  getAll(): Observable<ILessonsResponse[]> {
    return this.http.get<ILessonsResponse[]>(this.apiRoutes.all()).pipe();
  }

  getAllGroupedByLevel(): Observable<ILessonsGroupedByLevel[]> {
    return this.getAll().pipe(
      map((res) => {
        const grouped = res.reduce((acc: any, lesson) => {
          const levelId = lesson.educationalLevel.id;
          if (!acc[levelId]) {
            acc[levelId] = {
              id: lesson.educationalLevel.id,
              title: lesson.educationalLevel.title,
              level: lesson.educationalLevel.level,
              lessons: [],
            };
          }
          acc[levelId].lessons.push({
            id: lesson.id.toString(),
            title: lesson.title,
          });
          return acc;
        }, {});

        return Object.values(grouped);
      }),
    );
  }

  getAllInRoot(): Observable<ILessonsInRoot[]> {
    return this.getAll().pipe(
      map((res) => {
        return res.map((lesson) => ({
          ...lesson.fieldOfStudy,
          fieldId: lesson.fieldOfStudy.id.toString(),
          fieldTitle: lesson.fieldOfStudy.title,
          id: lesson.id,
          fullTitle: `${lesson.title} - رشته ${lesson.fieldOfStudy.title} - پایه ${lesson.educationalLevel.title}`,
        }));
      }),
    );
  }
}
