import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../shared/models/user';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Subject, takeUntil, tap, timer } from 'rxjs';
@Component({
  selector: 'stf-tracker-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatExpansionModule,
    MatSnackBarModule,
    MatProgressBarModule,
  ],
  templateUrl: './tracker-page.component.html',
  styleUrl: './tracker-page.component.scss',
})
export class TrackerPageComponent implements OnInit, OnDestroy {
  @Input({ required: true }) user: User | null = null;

  totalPercentage = 0;
  form!: FormGroup;

  photoURL!: string;

  clipboardText!: string;

  showStars = false;
  starPositions: any = [];
  isAchievedStars = false;
  private destroy$ = new Subject<void>();

  readonly SUCCESS_RATE = 80;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.user = this.route.parent?.snapshot.data['user'];

    this.form = this.fb.group({
      items: this.fb.array(this.getDefaultTemplate()),
    });

    this.loadFromLocalStorage();

    this.photoURL = this.user?.photoURL ?? '';

    if (this.calculateInitialGlobalPercentage() >= this.SUCCESS_RATE) {
      this.isAchievedStars = true;
    }
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  getSubItems(index: number): FormArray {
    return this.items.at(index).get('subItems') as FormArray;
  }

  calculateParentPercentage(itemIndex: number): number {
    const subItems = this.getSubItems(itemIndex).controls;
    const totalSubItems = subItems.length;
    const activeSubItems = subItems.filter(
      (subItem) => subItem.get('included')?.value,
    ).length;

    return totalSubItems > 0
      ? Math.round((activeSubItems / totalSubItems) * 100)
      : 0;
  }

  calculateGlobalPercentage(): number {
    let totalPercentage = 0;
    const totalItems = this.items.controls.length;

    this.items.controls.forEach((_, index) => {
      totalPercentage += this.calculateParentPercentage(index);
    });

    const total = totalItems > 0 ? Math.round(totalPercentage / totalItems) : 0;

    if (total >= this.SUCCESS_RATE && !this.isAchievedStars) {
      this.showStars = true;
      this.generateStarPositions();
      this.animateStars();
    }

    return total;
  }

  calculateInitialGlobalPercentage() {
    let totalPercentage = 0;
    const totalItems = this.items.controls.length;

    this.items.controls.forEach((_, index) => {
      totalPercentage += this.calculateParentPercentage(index);
    });

    return totalItems > 0 ? Math.round(totalPercentage / totalItems) : 0;
  }

  updateParentPercentage(itemIndex: number): void {
    this.calculateParentPercentage(itemIndex);
    this.saveToLocalStorage();
  }

  private generateStarPositions(): void {
    const positions = [];
    for (let i = 0; i < 30; i++) {
      const top = Math.random() * 100 + '%';
      const left = Math.random() * 100 + '%';
      const size = Math.random() * 2 + 1 + 'rem';
      const rotationSpeed = Math.random() * 3 + 1;
      const rotation = Math.random() * 360 + 'deg';
      positions.push({ top, left, size, rotation, rotationSpeed });
    }
    this.starPositions = positions;
  }

  private animateStars(): void {
    timer(5000)
      .pipe(
        tap(() => {
          this.showStars = false;
          this.isAchievedStars = true;
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  private getDefaultTemplate(): any[] {
    return [
      this.fb.group({
        name: 'Health',
        subItems: this.fb.array(
          [
            '8h sleep',
            'Morning hygiene',
            'Protein-rich breakfast',
            'Fitness / exercises / stretching',
            'Cardio / Workout ',
            'Healthy food additions',
            'Enough water',
            'Breaks',
            'Relaxing activities',
            'Light dinner',
            'Evening hygiene',
          ].map((name) => this.createSubItem(name)),
        ),
      }),
      this.fb.group({
        name: 'Cognitive',
        subItems: this.fb.array(
          [
            'Hardworking / (holiday) Contribution',
            'English',
            'Learning + Implementing',
            'Exercises Problem-solving Base. DS, Alg',
          ].map((name) => this.createSubItem(name)),
        ),
      }),
      this.fb.group({
        name: 'Social',
        subItems: this.fb.array(
          [
            'Family time',
            'Friend communication',
            'Community interaction actions',
            'Content, notes for content',
          ].map((name) => this.createSubItem(name)),
        ),
      }),
    ];
  }

  private createSubItem(name: string): FormGroup {
    return this.fb.group({
      name: name,
      included: false,
    });
  }

  private saveToLocalStorage(): void {
    const formValue = this.form.value;
    localStorage.setItem('trackerFormState', JSON.stringify(formValue));
  }

  private loadFromLocalStorage(): void {
    const savedState = localStorage.getItem('trackerFormState');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      this.form.setValue(parsedState);
    }
  }

  clearForm(): void {
    const items = this.form.get('items') as FormArray;

    items.controls.forEach((item) => {
      const subItems = item.get('subItems') as FormArray;
      subItems.controls.forEach((subItem) => {
        subItem.get('included')?.setValue(false);
      });
    });

    localStorage.removeItem('trackerFormState');

    this.clipboardText = '';
    this.isAchievedStars = false;
  }

  copyToClipboard(): void {
    const healthPercentage = this.calculateParentPercentage(0);
    const cognitivePercentage = this.calculateParentPercentage(1);
    const socialPercentage = this.calculateParentPercentage(2);
    const globalPercentage = this.calculateGlobalPercentage();

    this.clipboardText = `EDF: ${globalPercentage}% - H: ${healthPercentage}%, C: ${cognitivePercentage}%; S: ${socialPercentage}%`;

    navigator.clipboard.writeText(this.clipboardText).then(
      () => {
        console.log('Copied to clipboard:', this.clipboardText);
      },
      (err) => {
        console.error('Failed to copy to clipboard:', err);
      },
    );
  }

  getProgressBarColor(percentage: number): any {
    if (percentage < 20) {
      return 'warn';
    } else if (percentage < 50) {
      return 'accent';
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
