import 'zone.js/dist/zone';
import { Component, effect, Injector, OnInit, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="filterFormGroup">
    <label>Signal One: 
      <input formControlName="signalOne" type="number">
    </label>
    <label>
      <input formControlName="signalTwo" type="checkbox"> Signal Two
    </label>
  </form>
  `,
})
export class App implements OnInit {
  filterFormGroup = this.fb.group({
    signalOne: [0 as number | null | undefined],
    signalTwo: [false as boolean | null | undefined],
  });
  signalOne: Signal<number | null | undefined>;
  signalTwo: Signal<boolean | null | undefined>;

  constructor(private fb: FormBuilder, private injector: Injector) {
    this.signalOne = toSignal(
      this.filterFormGroup.get('signalOne')!.valueChanges,
      { initialValue: 0 }
    );
    this.signalTwo = toSignal(
      this.filterFormGroup.get('signalTwo')!.valueChanges,
      { initialValue: false }
    );

    effect(
      () => {
        console.log('An effect!');
        this.logChanges();
      },
      { injector: this.injector }
    );
  }

  private logChanges() {
    console.log('Signal One:', this.signalOne());
    console.log('Signal Two:', this.signalTwo());
  }

  ngOnInit() {}
}

bootstrapApplication(App);
