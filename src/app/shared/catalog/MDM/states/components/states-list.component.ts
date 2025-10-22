import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import {
  IColumn,
  PageDataListComponent,
} from '@/shared/components/pageDataList/page-data-list.component';
import { StatesService } from '../services';

@Component({
  selector: 'states-list',
  templateUrl: './states-list.component.html',
  imports: [CommonModule, TableModule, PageDataListComponent],
})
export class StatesListComponent {
  private statesService = inject(StatesService);

  items = signal<any[]>([]);
  loading = signal<boolean>(true);

  columns = [
    {
      field: 'title',
      header: 'عنوان',
    },
  ] as IColumn[];

  ngOnInit(): void {
    this.loading.set(true);
    this.statesService.getRegionTree().subscribe((data) => {
      this.items.set(data);
      this.loading.set(false);
    });
  }
}
