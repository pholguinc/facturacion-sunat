import {
  Component,
  Input,
  OnInit,
  forwardRef,
  OnDestroy,
  OnChanges,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
  SimpleChanges,
  NgZone,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormControl,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule, MatSelect } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  Subject,
  takeUntil,
  debounceTime,
  distinctUntilChanged,
  fromEvent,
} from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-searchable-select',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './searchable-select.component.html',
  styleUrls: ['./searchable-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchableSelectComponent),
      multi: true,
    },
  ],
})
export class SearchableSelectComponent
  implements OnInit, OnChanges, OnDestroy, ControlValueAccessor
{
  @Input() options: any[] = [];
  @Input() label: string = 'Seleccionar';
  @Input() placeholder: string = 'Buscar...';
  @Input() displayKey: string = 'label';
  @Input() valueKey: string = 'value';
  @Input() required: boolean = false;
  @Input() loading: boolean = false;
  @Input() serverSide: boolean = false;
  @Input() hasMore: boolean = false;

  @Output() searchChange = new EventEmitter<string>();
  @Output() scrolledToEnd = new EventEmitter<void>();

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  @ViewChild('matSelect') matSelect!: MatSelect;

  searchControl = new FormControl('');
  filteredOptions: any[] = [];
  selectedValue: any;
  isDisabled: boolean = false;

  private destroy$ = new Subject<void>();

  onChange = (value: any) => {};
  onTouched = () => {};

  constructor(private ngZone: NgZone) {}

  ngOnInit() {
    this.filteredOptions = [...this.options];

    this.searchControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(this.serverSide ? 400 : 0),
        distinctUntilChanged(),
      )
      .subscribe((value) => {
        const term = value || '';
        if (this.serverSide) {
          this.searchChange.emit(term);
        } else {
          this.filterOptions(term);
        }
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['options'] && !this.serverSide) {
      this.filterOptions(this.searchControl.value || '');
    } else if (changes['options'] && this.serverSide) {
      this.filteredOptions = [...this.options];
      // When new options arrive, check if we still have space to load more
      this.checkAndEmitScrolledToEnd();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  filterOptions(search: string) {
    if (!search) {
      this.filteredOptions = [...this.options];
      return;
    }

    const searchLower = search.toLowerCase();
    this.filteredOptions = this.options.filter((option) =>
      String(option[this.displayKey]).toLowerCase().includes(searchLower),
    );
  }

  onSelectionChange(value: any) {
    this.selectedValue = value;
    this.onChange(value);
    this.onTouched();
  }

  onOpened() {
    this.searchInput.nativeElement.focus();
    this.registerScrollListener();
    // Check if we need more data immediately if the current list is too short to scroll
    this.checkAndEmitScrolledToEnd();
  }

  onClosed() {
    if (!this.serverSide) {
      this.searchControl.setValue('');
    }
  }

  private registerScrollListener() {
    // Wait for the panel to be rendered and the backdrop to be stable
    setTimeout(() => {
      if (!this.matSelect.panel) return;

      const panel = this.matSelect.panel.nativeElement;

      fromEvent(panel, 'scroll')
        .pipe(takeUntil(this.destroy$), takeUntil(this.matSelect.openedChange))
        .subscribe((event: any) => {
          this.handleScroll(event);
        });
    }, 100);
  }

  private handleScroll(event: any) {
    this.checkScrollPosition(event.target);
  }

  private checkAndEmitScrolledToEnd() {
    if (!this.serverSide || this.loading || !this.hasMore) {
      return;
    }

    setTimeout(() => {
      if (!this.matSelect.panel) return;
      this.checkScrollPosition(this.matSelect.panel.nativeElement);
    }, 300); // Give it time to render
  }

  private checkScrollPosition(element: HTMLElement) {
    if (!this.serverSide || this.loading || !this.hasMore) {
      return;
    }

    const threshold = 150;
    const position = element.scrollTop + element.offsetHeight;
    const height = element.scrollHeight;

    // Trigger if we are near the bottom OR if there is no scrollbar yet (height <= offsetHeight)
    if (position >= height - threshold || height <= element.offsetHeight) {
      this.ngZone.run(() => {
        this.scrolledToEnd.emit();
      });
    }
  }

  // ControlValueAccessor methods
  writeValue(value: any): void {
    this.selectedValue = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  clearSearch(event: Event) {
    event.stopPropagation();
    this.searchControl.setValue('');
  }

  trackByFn(index: number, item: any) {
    return item[this.valueKey] || index;
  }
}
