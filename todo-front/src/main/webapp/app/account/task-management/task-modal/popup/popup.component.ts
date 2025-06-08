import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ITask } from 'app/models/models/task.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'jhi-popup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss'
})

export class PopupComponent {
  @Input() task: ITask | null = null;
  @Input() isEditOnlyCompleted = false;

  @Output() save = new EventEmitter<ITask>();
  @Output() cancel = new EventEmitter<void>();

  form: FormGroup;

  constructor(private fb: FormBuilder, public modal: NgbActiveModal) {
    this.form = this.fb.group({
      label: ['', Validators.required],
      description: ['', Validators.required],
      completed: [false],
    });
  }

  applyPatch(): void {
    if (this.task) {
      this.form.patchValue(this.task);

      if (this.isEditOnlyCompleted) {
        this.form.get('label')?.disable();
        this.form.get('description')?.disable();
      } else {
        this.form.get('label')?.enable();
        this.form.get('description')?.enable();
      }
    } else {
      this.form.reset({ completed: false });
      this.form.enable(); 
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const fullFormValue = {
        ...this.task,
        ...this.form.getRawValue(),
      };
      this.save.emit(fullFormValue);
      this.modal.close();
    }
  }

  onCancel(): void {
    this.cancel.emit();
    this.modal.dismiss();
  }
}
