import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-generate-pdf',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule, MatIconModule],
  templateUrl: './generate-pdf.component.html',
  styleUrl: './generate-pdf.component.scss',
})
export class GeneratePdfComponent {
  readonly dialogRef = inject(MatDialogRef<GeneratePdfComponent>);

  onNoClick(): void {
    this.dialogRef.close();
  }

  selectFormat(format: 'A4' | 'ticket'): void {
    this.dialogRef.close(format);
  }
}
