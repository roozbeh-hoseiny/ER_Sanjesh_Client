import { AppCardComponent } from '@/shared/components';
import { IColumn } from '@/shared/components/pageDataList/page-data-list.component';
import { UikitEmptyStateComponent } from '@/uikit';
import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonDirective } from 'primeng/button';
import { Skeleton } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { SchoolDetailsCardsStore } from '../store';

@Component({
  selector: 'school-teachers-simple-list',
  templateUrl: './teachers-simple-list.component.html',
  imports: [AppCardComponent, TableModule, ButtonDirective, UikitEmptyStateComponent, Skeleton],
})
export class TeachersSimpleListComponent {
  private store = inject(SchoolDetailsCardsStore);

  constructor(private router: Router) {
    this.getAll();
  }
  @ViewChild('lessons', { static: true }) lessonsTpl!: TemplateRef<any>;

  columns = [
    { field: 'fullname', header: 'نام دبیر', minWidth: '14rem' },
    { field: 'mobile', header: 'شماره موبایل', width: '10rem' },
    { field: 'uniqueId', header: 'شناسه', canCopy: true, width: '5rem' },
    { field: 'lessons', header: 'تعداد دروس', customDataModel: this.lessonsTpl, width: '8rem' },
  ] as IColumn[];

  teachers = this.store.teachers;

  teachersLoading = this.store.teachersLoading;

  get teachersManagementPageRoute() {
    return this.store.teachersManagementPageRoute();
  }

  toTeachersPage() {
    if (this.teachersManagementPageRoute) {
      this.router.navigateByUrl(this.teachersManagementPageRoute);
    }
  }

  getAll() {
    this.store.getTeachers().subscribe();
  }
}
