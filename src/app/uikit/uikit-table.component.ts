import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'uikit-table',
  standalone: true,
  imports: [TableModule],
  template: `
    <p-table
      [value]="value"
      [columns]="columns"
      [paginator]="paginator"
      [rows]="rows"
      [responsiveLayout]="responsiveLayout"
      [loading]="loading"
      [totalRecords]="totalRecords"
      [sortField]="sortField"
      [sortOrder]="sortOrder ?? 0"
      [selection]="selection"
      (onRowSelect)="onRowSelect.emit($event)"
      (onRowUnselect)="onRowUnselect.emit($event)"
      (onSort)="onSort.emit($event)"
      (onFilter)="onFilter.emit($event)"
      (onPage)="onPage.emit($event)"
      (onSelectionChange)="onSelectionChange.emit($event)"
    >
      <ng-content></ng-content>
    </p-table>
  `,
})
export class UikitTable {
  @Input() value: any[] = [];
  @Input() columns: any[] = [];
  @Input() paginator: boolean = false;
  @Input() rows: number = 10;
  @Input() responsiveLayout: string = 'scroll';
  @Input() loading: boolean = false;
  @Input() totalRecords: number = 0;
  @Input() sortField?: string;
  @Input() sortOrder?: number;
  @Input() selection: any;

  @Output() onRowSelect = new EventEmitter<any>();
  @Output() onRowUnselect = new EventEmitter<any>();
  @Output() onSort = new EventEmitter<any>();
  @Output() onFilter = new EventEmitter<any>();
  @Output() onPage = new EventEmitter<any>();
  @Output() onSelectionChange = new EventEmitter<any>();
}
