import { FormBuilder } from '@angular/forms';
import { buildRoleForm } from './role-form';

describe('buildRoleForm', () => {
  it('rejects role names containing characters other than letters and spaces', () => {
    const form = buildRoleForm(new FormBuilder(), () => []);
    const roleName = form.controls['roleName'];

    roleName.setValue('Admin-1');

    expect(roleName.hasError('pattern')).toBe(true);
  });

  it('accepts role names containing letters and spaces', () => {
    const form = buildRoleForm(new FormBuilder(), () => []);
    const roleName = form.controls['roleName'];

    roleName.setValue('Content Manager');

    expect(roleName.valid).toBe(true);
  });
});
