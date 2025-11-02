import { ISchoolEducationalLevelsResponse } from '@/modules/schools/models';
import { Component, Input, signal } from '@angular/core';
import { Tag } from 'primeng/tag';

interface IGroupedFieldOfStudy {
  id: number;
  title: string;
}

interface IGroupedLevel {
  id: number;
  title: string;
  level: string;
  fullTitle: string;
}

interface IGroupedEducationalLevels {
  level: IGroupedLevel;
  fields: IGroupedFieldOfStudy[];
}

@Component({
  selector: 'app-educational-levels-tags',
  templateUrl: './educational-levels-tags.component.html',
  imports: [Tag],
})
export class EducationalLevelsTagsComponent {
  constructor() {}

  @Input() educationalLevels!: ISchoolEducationalLevelsResponse[];

  groupedEducationalLevels = signal<IGroupedEducationalLevels[]>([]);

  ngOnInit() {
    this.groupEducationalLevelsByLevel();
  }

  groupEducationalLevelsByLevel() {
    const grouped: { [level: string]: IGroupedEducationalLevels } = {};
    for (const level of this.educationalLevels) {
      if (!grouped[level.educationalLevelLevel]) {
        grouped[level.educationalLevelLevel] = {
          level: {
            id: level.educationalLevelId,
            title: level.educationalLevelTitle,
            level: level.educationalLevelLevel,
            fullTitle: `${level.educationalLevelLevel} (${level.educationalLevelTitle})`,
          },
          fields: [],
        };
      }

      grouped[level.educationalLevelLevel].fields.push({
        id: level.fieldOfStudyId,
        title: level.fieldOfStudyTitle,
      });
    }
    this.groupedEducationalLevels.set(Object.values(grouped));
  }
}
