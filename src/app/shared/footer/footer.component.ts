import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [MatIconModule, NgClass],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss',
})
export class Footer {
    @Input() isExpanded: boolean = true;
    currentYear = new Date().getFullYear();
}
