import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../shared/models/user';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'stf-tracker-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './tracker-page.component.html',
  styleUrl: './tracker-page.component.scss',
})
export class TrackerPageComponent implements OnInit {
  @Input({ required: true }) user: User | null = null;

  totalPercentage = 0;

  form!: FormGroup;

  photoURL!: string;

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

    return totalItems > 0 ? Math.round(totalPercentage / totalItems) : 0;
  }

  updateParentPercentage(itemIndex: number): void {
    this.calculateParentPercentage(itemIndex);
    this.saveToLocalStorage();
  }

  private getDefaultTemplate(): any[] {
    return [
      this.fb.group({
        name: 'Health',
        subItems: this.fb.array(
          [
            '8h sleep',
            'Morning hygiene',
            'Fitness, exercises',
            'Protein-rich breakfast',
            'Healthy food additions',
            'Enough water',
            'Breaks',
            'Relaxing activities',
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
  }
}
