import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  imports: [ButtonModule],
})
export class PaginatorComponent {
  @Input() totalRecords!: number;
  @Input() currentPage: number = 1;
  @Input() perPage: number = 10;
  @Input() loading: boolean = false;
  @Output() onChange = new EventEmitter<number>();

  totalPages = signal<number>(0);

  ngOnChanges() {
    this.totalPages.set(Math.ceil(this.totalRecords / this.perPage));
  }

  onPageChange(newPage: number) {
    this.onChange.emit(newPage);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.onPageChange(this.currentPage - 1);
    }
  }
  nextPage() {
    if (this.currentPage < this.totalPages()) {
      this.onPageChange(this.currentPage + 1);
    }
  }
}
