import { Component, computed, Input } from '@angular/core';

@Component({
  selector: 'catalog-gender-tag',
  templateUrl: './gender-tag.component.html',
})
export class CatalogGenderTagComponent {
  @Input() gender!: boolean;

  constructor() {}

  genderTitle = computed(() => (this.gender ? 'مرد' : 'زن'));
}
