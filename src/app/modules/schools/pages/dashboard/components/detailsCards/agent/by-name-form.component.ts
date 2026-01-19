import { Maybe } from '@/core';
import {
  IAdminAgentRequestPayload,
  IAdminAgentResponse,
} from '@/modules/admin/pages/agents/models';
import { CatalogGenderTagComponent } from '@/shared/catalog/gender/gender-tag.component';
import {
  IColumn,
  PageDataListComponent,
} from '@/shared/components/pageDataList/page-data-list.component';
import {
  Component,
  EventEmitter,
  inject,
  OnDestroy,
  Output,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SchoolDetailsCardsStore } from '../store';

@Component({
  selector: 'school-agent-by-name-form',
  templateUrl: './by-name-form.component.html',
  imports: [
    ReactiveFormsModule,
    ButtonDirective,
    PageDataListComponent,
    CatalogGenderTagComponent,
    InputText,
  ],
})
export class SchoolAgentByNameFormComponent implements OnDestroy {
  @Output() closeForm = new EventEmitter();
  @Output() submitForm = new EventEmitter<IAdminAgentRequestPayload>();

  private store = inject(SchoolDetailsCardsStore);
  searchTerm = new FormControl<string>('');

  submitLoading = signal(false);
  searchedItem = signal<Maybe<IAdminAgentResponse>>(null);
  private search$ = new Subject<string>();
  private searchSub?: Subscription;

  constructor() {
    this.searchTerm.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        this.searchedItem.set(null);
        this.search();
      });
  }

  get schoolId() {
    return this.store.school() ? this.store.school()?.id : null;
  }
  @ViewChild('gender', { static: true }) genderTpl!: TemplateRef<any>;
  @ViewChild('action', { static: true }) actionTPL!: TemplateRef<any>;

  columns = [] as IColumn[];

  ngOnInit(): void {
    this.setColumns();
  }

  loading = signal(false);
  agents = signal<IAdminAgentResponse[]>([]);

  private setColumns() {
    this.columns = [
      {
        field: 'fullname',
        header: 'نام بازاریاب',
        minWidth: '15rem',
      },
      {
        field: 'uniqueId',
        header: 'شناسه',
        canCopy: true,
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
      {
        field: 'action',
        header: '',
        width: '4rem',
        minWidth: '4rem',
        customDataModel: this.actionTPL,
      },
    ];
  }

  setSearchResult(item: Maybe<IAdminAgentResponse>) {
    this.searchedItem.set(item);
  }

  selectAgent(item: IAdminAgentResponse) {
    this.submitLoading.set(true);
    this.store
      .attachAgent({
        agentId: item.id,
        id: this.schoolId!,
      })
      .subscribe({
        next: () => {
          this.submitLoading.set(false);
          this.searchedItem.set(null);
          this.submitForm.emit();
        },
        error: () => {
          this.submitLoading.set(false);
        },
      });
  }

  private search() {
    this.loading.set(true);
    return this.store.searchForAgentByName(this.searchTerm.value || '').subscribe((agents) => {
      this.agents.set(agents);
      this.loading.set(false);
    });
  }

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
    this.search$.complete();
  }

  foundedMessage(agent: Maybe<IAdminAgentResponse>) {
    return agent ? `بازاریاب با نام ${agent.fullname} یافت شد.` : '';
  }

  close() {
    this.closeForm.emit();
  }
}
