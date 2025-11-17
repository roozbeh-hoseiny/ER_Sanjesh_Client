import { AppCardComponent } from '@/shared/components';
import { IColumn } from '@/shared/components/pageDataList/page-data-list.component';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonDirective } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { SchoolDetailsCardsStore } from '../store';

@Component({
  selector: 'school-teachers-simple-list',
  templateUrl: './teachers-simple-list.component.html',
  imports: [AppCardComponent, TableModule, ButtonDirective],
})
export class TeachersSimpleListComponent {
  constructor(
    private store: SchoolDetailsCardsStore,
    private router: Router,
  ) {}
  @ViewChild('lessons', { static: true }) lessonsTpl!: TemplateRef<any>;

  columns = [
    { field: 'fullname', header: 'نام دبیر', minWidth: '14rem' },
    { field: 'mobile', header: 'شماره موبایل', width: '10rem' },
    { field: 'uniqueId', header: 'شناسه', width: '5rem' },
    { field: 'lessons', header: 'تعداد دروس', customDataModel: this.lessonsTpl, width: '8rem' },
  ] as IColumn[];

  get teachers() {
    return this.store.teachers() || [];
  }

  get teachersManagementPageRoute() {
    return this.store.teachersManagementPageRoute();
  }

  toTeachersPage() {
    if (this.teachersManagementPageRoute) {
      this.router.navigateByUrl(this.teachersManagementPageRoute);
    }
  }
}
