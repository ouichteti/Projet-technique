import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PopupComponent } from './popup.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PopupComponent', () => {
  let component: PopupComponent;
  let fixture: ComponentFixture<PopupComponent>;
  let modal: NgbActiveModal;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupComponent, ReactiveFormsModule, HttpClientTestingModule],
      providers: [NgbActiveModal],
    }).compileComponents();

    fixture = TestBed.createComponent(PopupComponent);
    component = fixture.componentInstance;
    modal = TestBed.inject(NgbActiveModal);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should patch and disable fields if isEditOnlyCompleted is true', () => {
    component.task = { id: 1, label: 'Task', description: 'Desc', completed: true };
    component.isEditOnlyCompleted = true;

    component.applyPatch();

    expect(component.form.get('label')?.disabled).toBe(true);
    expect(component.form.get('description')?.disabled).toBe(true);
    expect(component.form.get('completed')?.value).toBe(true);
  });

  it('should patch and enable fields if isEditOnlyCompleted is false', () => {
    component.task = { id: 2, label: 'X', description: 'Y', completed: false };
    component.isEditOnlyCompleted = false;

    component.applyPatch();

    expect(component.form.get('label')?.enabled).toBe(true);
    expect(component.form.get('label')?.value).toBe('X');
    expect(component.form.get('description')?.enabled).toBe(true);
  });

  it('should reset form if task is null', () => {
    component.task = null;
    component.applyPatch();

    expect(component.form.get('label')?.value).toBeNull();
    expect(component.form.get('completed')?.value).toBe(false);
  });

  it('should emit save and close modal when form is valid', () => {
    const saveSpy = jest.spyOn(component.save, 'emit');
    const closeSpy = jest.spyOn(modal, 'close');

    component.task = { id: 3 };
    component.form.setValue({
      label: 'A',
      description: 'B',
      completed: true,
    });

    component.onSubmit();

    expect(saveSpy).toHaveBeenCalledWith({
      id: 3,
      label: 'A',
      description: 'B',
      completed: true,
    });
    expect(closeSpy).toHaveBeenCalled();
  });

  it('should not emit save if form is invalid', () => {
    const saveSpy = jest.spyOn(component.save, 'emit');
    component.form.setValue({
      label: '', // required
      description: 'B',
      completed: false,
    });

    component.onSubmit();

    expect(saveSpy).not.toHaveBeenCalled();
  });

  it('should emit cancel and dismiss modal', () => {
    const cancelSpy = jest.spyOn(component.cancel, 'emit');
    const dismissSpy = jest.spyOn(modal, 'dismiss');

    component.onCancel();

    expect(cancelSpy).toHaveBeenCalled();
    expect(dismissSpy).toHaveBeenCalled();
  });
});
