import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { catchError, of, tap } from 'rxjs';
import {
  EntityState,
  EntityStore,
  PaginatedState,
  PaginatedStore,
} from '../../../core/state/base-store';
import { Maybe } from '../../../core/types';

/**
 * Exam interface
 */
export interface Exam {
  id: string;
  title: string;
  description: string;
  subject: string;
  duration: number; // minutes
  totalQuestions: number;
  passingScore: number;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed' | 'expired';
  isAttempted: boolean;
  score?: number;
  completedAt?: string;
  timeRemaining?: number;
}

/**
 * Student result interface
 */
export interface StudentResult {
  id: string;
  examId: string;
  examTitle: string;
  subject: string;
  score: number;
  totalScore: number;
  percentage: number;
  grade: string;
  completedAt: string;
  duration: number;
  correctAnswers: number;
  totalQuestions: number;
  rank?: number;
  feedback?: string;
}

/**
 * Student profile interface
 */
export interface StudentProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
  phoneNumber: string;
  dateOfBirth: string;
  grade: string;
  section: string;
  avatar?: string;
  address?: string;
  emergencyContact?: {
    name: string;
    phoneNumber: string;
    relationship: string;
  };
}

/**
 * Student dashboard stats
 */
export interface StudentStats {
  totalExams: number;
  completedExams: number;
  averageScore: number;
  bestScore: number;
  currentRank: number;
  totalStudents: number;
  upcomingExams: number;
  recentActivities: ActivityItem[];
}

/**
 * Activity item
 */
export interface ActivityItem {
  id: string;
  type: 'exam_completed' | 'exam_started' | 'result_published' | 'reminder';
  title: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

/**
 * Student exams state
 */
export interface StudentExamsState extends PaginatedState<Exam> {
  upcomingExams: Exam[];
  activeExams: Exam[];
  completedExams: Exam[];
  currentExam: Maybe<Exam>;
  examFilters: {
    status: string;
    subject: string;
    search: string;
  };
}

/**
 * Student results state
 */
export interface StudentResultsState extends PaginatedState<StudentResult> {
  resultFilters: {
    subject: string;
    dateRange: {
      start: Maybe<string>;
      end: Maybe<string>;
    };
    minScore: Maybe<number>;
    maxScore: Maybe<number>;
  };
  chartData: {
    scoreHistory: Array<{ date: string; score: number }>;
    subjectPerformance: Array<{ subject: string; averageScore: number }>;
  };
}

/**
 * Student profile state
 */
export interface StudentProfileState extends EntityState<StudentProfile> {
  stats: Maybe<StudentStats>;
  isUpdating: boolean;
}

/**
 * Student exams store
 */
@Injectable({
  providedIn: 'root',
})
export class StudentExamsStore extends PaginatedStore<Exam, StudentExamsState> {
  private readonly http = inject(HttpClient);

  constructor() {
    super({
      loading: false,
      error: null,
      lastUpdated: null,
      items: [],
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      hasMore: false,
      upcomingExams: [],
      activeExams: [],
      completedExams: [],
      currentExam: null,
      examFilters: {
        status: 'all',
        subject: 'all',
        search: '',
      },
    });
  }

  // Computed selectors
  readonly upcomingExams = computed(() => this._state().upcomingExams);
  readonly activeExams = computed(() => this._state().activeExams);
  readonly completedExams = computed(() => this._state().completedExams);
  readonly currentExam = computed(() => this._state().currentExam);
  readonly examFilters = computed(() => this._state().examFilters);

  /**
   * Load all exams
   */
  loadExams(page: number = 1, pageSize: number = 10) {
    this.setLoading(true);

    const params = {
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...this._state().examFilters,
    };

    return this.http
      .get<{ data: Exam[]; totalCount: number }>('/api/student/exams', { params })
      .pipe(
        tap((response) => {
          this.setItems(response.data, response.totalCount, page);
          this.categorizeExams(response.data);
        }),
        catchError((error) => {
          this.setError('خطا در بارگذاری آزمون‌ها');
          return of(null);
        })
      );
  }

  /**
   * Load upcoming exams
   */
  loadUpcomingExams() {
    return this.http.get<Exam[]>('/api/student/exams/upcoming').pipe(
      tap((exams) => {
        this.patchState({ upcomingExams: exams });
      }),
      catchError((error) => {
        console.error('Error loading upcoming exams:', error);
        return of([]);
      })
    );
  }

  /**
   * Load active exams
   */
  loadActiveExams() {
    return this.http.get<Exam[]>('/api/student/exams/active').pipe(
      tap((exams) => {
        this.patchState({ activeExams: exams });
      }),
      catchError((error) => {
        console.error('Error loading active exams:', error);
        return of([]);
      })
    );
  }

  /**
   * Set current exam
   */
  setCurrentExam(exam: Maybe<Exam>): void {
    this.patchState({ currentExam: exam });
  }

  /**
   * Update exam filters
   */
  updateFilters(filters: Partial<StudentExamsState['examFilters']>): void {
    const currentFilters = this._state().examFilters;
    const newFilters = { ...currentFilters, ...filters };

    this.patchState({ examFilters: newFilters });

    // Reload exams with new filters
    this.loadExams(1).subscribe();
  }

  /**
   * Start exam
   */
  startExam(examId: string) {
    this.setLoading(true);

    return this.http
      .post<{ exam: Exam; token: string }>(`/api/student/exams/${examId}/start`, {})
      .pipe(
        tap((response) => {
          this.setCurrentExam(response.exam);
          this.setLoading(false);
        }),
        catchError((error) => {
          this.setError('خطا در شروع آزمون');
          return of(null);
        })
      );
  }

  /**
   * Submit exam
   */
  submitExam(examId: string, answers: Record<string, any>) {
    this.setLoading(true);

    return this.http
      .post<{ result: StudentResult }>(`/api/student/exams/${examId}/submit`, { answers })
      .pipe(
        tap((response) => {
          this.setCurrentExam(null);
          this.setLoading(false);
          // Refresh exams list
          this.loadExams().subscribe();
        }),
        catchError((error) => {
          this.setError('خطا در ارسال آزمون');
          return of(null);
        })
      );
  }

  /**
   * Categorize exams by status
   */
  private categorizeExams(exams: Exam[]): void {
    const upcoming = exams.filter((exam) => exam.status === 'upcoming');
    const active = exams.filter((exam) => exam.status === 'active');
    const completed = exams.filter((exam) => exam.status === 'completed');

    this.patchState({
      upcomingExams: upcoming,
      activeExams: active,
      completedExams: completed,
    });
  }

  /**
   * Reset state
   */
  reset(): void {
    this.setState({
      loading: false,
      error: null,
      lastUpdated: null,
      items: [],
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      hasMore: false,
      upcomingExams: [],
      activeExams: [],
      completedExams: [],
      currentExam: null,
      examFilters: {
        status: 'all',
        subject: 'all',
        search: '',
      },
    });
  }
}

/**
 * Student results store
 */
@Injectable({
  providedIn: 'root',
})
export class StudentResultsStore extends PaginatedStore<StudentResult, StudentResultsState> {
  private readonly http = inject(HttpClient);

  constructor() {
    super({
      loading: false,
      error: null,
      lastUpdated: null,
      items: [],
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      hasMore: false,
      resultFilters: {
        subject: 'all',
        dateRange: {
          start: null,
          end: null,
        },
        minScore: null,
        maxScore: null,
      },
      chartData: {
        scoreHistory: [],
        subjectPerformance: [],
      },
    });
  }

  // Computed selectors
  readonly resultFilters = computed(() => this._state().resultFilters);
  readonly chartData = computed(() => this._state().chartData);
  readonly averageScore = computed(() => {
    const items = this._state().items;
    if (items.length === 0) return 0;
    const total = items.reduce((sum, result) => sum + result.percentage, 0);
    return Math.round(total / items.length);
  });

  /**
   * Load results
   */
  loadResults(page: number = 1, pageSize: number = 10) {
    this.setLoading(true);

    const filters = this._state().resultFilters;
    const params: Record<string, string> = {
      page: page.toString(),
      pageSize: pageSize.toString(),
      subject: filters.subject,
    };

    // Add optional parameters if they have values
    if (filters.dateRange.start) {
      params['startDate'] = filters.dateRange.start;
    }
    if (filters.dateRange.end) {
      params['endDate'] = filters.dateRange.end;
    }
    if (filters.minScore !== null) {
      params['minScore'] = filters.minScore.toString();
    }
    if (filters.maxScore !== null) {
      params['maxScore'] = filters.maxScore.toString();
    }

    return this.http
      .get<{ data: StudentResult[]; totalCount: number }>('/api/student/results', { params })
      .pipe(
        tap((response) => {
          this.setItems(response.data, response.totalCount, page);
        }),
        catchError((error) => {
          this.setError('خطا در بارگذاری نتایج');
          return of(null);
        })
      );
  }

  /**
   * Load chart data
   */
  loadChartData() {
    return this.http
      .get<{
        scoreHistory: Array<{ date: string; score: number }>;
        subjectPerformance: Array<{ subject: string; averageScore: number }>;
      }>('/api/student/results/charts')
      .pipe(
        tap((chartData) => {
          this.patchState({ chartData });
        }),
        catchError((error) => {
          console.error('Error loading chart data:', error);
          return of(null);
        })
      );
  }

  /**
   * Update filters
   */
  updateFilters(filters: Partial<StudentResultsState['resultFilters']>): void {
    const currentFilters = this._state().resultFilters;
    const newFilters = { ...currentFilters, ...filters };

    this.patchState({ resultFilters: newFilters });

    // Reload results with new filters
    this.loadResults(1).subscribe();
  }

  /**
   * Reset state
   */
  reset(): void {
    this.setState({
      loading: false,
      error: null,
      lastUpdated: null,
      items: [],
      totalCount: 0,
      currentPage: 1,
      pageSize: 10,
      hasMore: false,
      resultFilters: {
        subject: 'all',
        dateRange: {
          start: null,
          end: null,
        },
        minScore: null,
        maxScore: null,
      },
      chartData: {
        scoreHistory: [],
        subjectPerformance: [],
      },
    });
  }
}

/**
 * Student profile store
 */
@Injectable({
  providedIn: 'root',
})
export class StudentProfileStore extends EntityStore<StudentProfile, StudentProfileState> {
  private readonly http = inject(HttpClient);

  constructor() {
    super({
      loading: false,
      error: null,
      lastUpdated: null,
      entities: {},
      selectedId: null,
      ids: [],
      stats: null,
      isUpdating: false,
    });
  }

  // Computed selectors
  readonly stats = computed(() => this._state().stats);
  readonly isUpdating = computed(() => this._state().isUpdating);

  /**
   * Load profile
   */
  loadProfile() {
    this.setLoading(true);

    return this.http.get<StudentProfile>('/api/student/profile').pipe(
      tap((profile) => {
        this.upsertEntities([profile], (p) => p.id);
        this.selectEntity(profile.id);
        this.setLoading(false);
      }),
      catchError((error) => {
        this.setError('خطا در بارگذاری پروفایل');
        return of(null);
      })
    );
  }

  /**
   * Load student stats
   */
  loadStats() {
    return this.http.get<StudentStats>('/api/student/stats').pipe(
      tap((stats) => {
        this.patchState({ stats });
      }),
      catchError((error) => {
        console.error('Error loading student stats:', error);
        return of(null);
      })
    );
  }

  /**
   * Update profile
   */
  updateProfile(updates: Partial<StudentProfile>) {
    this.patchState({ isUpdating: true });

    return this.http.put<StudentProfile>('/api/student/profile', updates).pipe(
      tap((updatedProfile) => {
        this.upsertEntities([updatedProfile], (p) => p.id);
        this.patchState({ isUpdating: false });
      }),
      catchError((error) => {
        this.patchState({ isUpdating: false });
        this.setError('خطا در به‌روزرسانی پروفایل');
        return of(null);
      })
    );
  }

  /**
   * Reset state
   */
  reset(): void {
    this.setState({
      loading: false,
      error: null,
      lastUpdated: null,
      entities: {},
      selectedId: null,
      ids: [],
      stats: null,
      isUpdating: false,
    });
  }
}
