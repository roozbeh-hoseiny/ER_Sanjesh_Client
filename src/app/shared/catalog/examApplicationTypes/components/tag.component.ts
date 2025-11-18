import { Component, computed, Input } from '@angular/core';
import { Tag } from 'primeng/tag';
import { findExamApplicationTypeById } from '../constants/examApplicationTypes.const';

@Component({
  selector: 'catalog-exam-application-types-tag',
  templateUrl: './tag.component.html',
  imports: [Tag],
})
export class ExamApplicationTypesTagComponent {
  @Input() examApplicationTypeId!: number;

  examApplicationType = computed(() => {
    return findExamApplicationTypeById(this.examApplicationTypeId);
  });
}
