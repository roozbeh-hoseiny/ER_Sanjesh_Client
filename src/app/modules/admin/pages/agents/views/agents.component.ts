import { Maybe } from '@/core';
import { BreadcrumbService } from '@/core/services';
import { adminNamedRoutes } from '@/modules/admin/constants';
import { CatalogGenderTagComponent } from '@/shared/catalog/gender/gender-tag.component';
import {
  IColumn,
  PageDataListComponent,
} from '@/shared/components/pageDataList/page-data-list.component';
import { CommonModule } from '@angular/common';
import { Component, signal, TemplateRef, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { AdminAgentsFilterComponent } from '../components/agents-filter.component';
import { AdminAgentFormDialogComponent } from '../components/form/agent-form.component';
import { IAdminAgentResponse } from '../models';
import { AgentsStore } from '../store';

@Component({
  selector: 'admin-agents',
  standalone: true,
  templateUrl: './agents.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PageDataListComponent,
    ToggleSwitchModule,
    ButtonModule,
    FormsModule,
    AdminAgentsFilterComponent,
    CatalogGenderTagComponent,
    AdminAgentFormDialogComponent,
  ],
})
export class AdminAgentsComponent {
  constructor(
    private store: AgentsStore,
    private breadcrumbService: BreadcrumbService,
  ) {
    this.breadcrumbService.setItems([adminNamedRoutes.root.meta, adminNamedRoutes.agents.meta]);
  }

  @ViewChild('gender', { static: true }) genderTpl!: TemplateRef<any>;

  columns = [] as IColumn[];

  get isFiltered() {
    return this.store.isFiltered();
  }

  get activePageItems() {
    return this.store.activePageItems();
  }

  get loading() {
    return this.store.loading();
  }

  get totalRecords() {
    return this.store.totalRecords();
  }
  get activePageIndex() {
    return this.store.activePageIndex();
  }
  get perPage() {
    return this.store.perPage();
  }

  isAddFormVisible = signal<boolean>(false);
  selectedItemForEdit = signal<Maybe<IAdminAgentResponse>>(null);

  ngOnInit(): void {
    this.setColumns();
    this.store.initial();
  }

  private setColumns() {
    this.columns = [
      {
        field: 'fullname',
        header: 'نام کارگزار',
        minWidth: '15rem',
      },
      {
        field: 'uniqueId',
        header: 'شناسه',
        width: '5rem',
        minWidth: '5rem',
      },
      {
        field: 'gender',
        header: 'جنسیت',
        width: '4rem',
        minWidth: '4rem',
        customDataModel: this.genderTpl,
      },
    ];
  }

  onPageChange(page: number) {
    this.store.onPageChange(page);
  }

  onNameFilter(name: string) {
    this.store.filterByName(name);
  }

  openAddForm() {
    this.selectedItemForEdit.set(null);
    this.isAddFormVisible.set(true);
  }

  openEditForm(item: IAdminAgentResponse) {
    this.selectedItemForEdit.set(item);
    this.isAddFormVisible.set(true);
  }

  onFormSave($event: any) {
    this.store.refresh();
  }
}
