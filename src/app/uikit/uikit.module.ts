import { NgModule } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { SelectButtonModule } from 'primeng/selectbutton';

@NgModule({
  imports: [
    TableModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    RippleModule,
    SelectButtonModule,
  ],
  exports: [
    TableModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    RippleModule,
    SelectButtonModule,
  ],
})
export class UikitModule {}
