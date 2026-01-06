import { NgIf } from '@angular/common';
import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-control-error',
  imports: [MatFormFieldModule, MatInputModule, NgIf],
  templateUrl: './control-error.component.html',
  styleUrl: './control-error.component.scss',
})
export class ControlErrorComponent {
  textError = '';

  @Input() set error(value: string) {
    if (value !== this.textError) {
      this.textError = value;
      this.cdr.detectChanges();
    }
  }

  constructor(private cdr: ChangeDetectorRef) {}
}
