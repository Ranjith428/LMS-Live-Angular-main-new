import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePackageModal } from './create-package-modal';
import { PackagePayload, PackageRecord } from '../../../services/package.service';

describe('CreatePackageModal', () => {
  let component: CreatePackageModal;
  let fixture: ComponentFixture<CreatePackageModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePackageModal],
    }).compileComponents();

    fixture = TestBed.createComponent(CreatePackageModal);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('existingPackages', []);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('prefills and submits the edited package while retaining its permissions', () => {
    const permissions: PackageRecord['permissions'] = [
      {
        id: 'users',
        name: 'Users',
        enabled: true,
        features: [
          {
            id: 'manage-users',
            name: 'Manage users',
            permissions: { create: true, read: true, update: false, delete: false },
          },
        ],
      },
    ];
    const item: PackageRecord = {
      id: 7,
      name: 'Standard',
      availablePackage: 'Standard',
      description: 'A standard package',
      price: 25,
      billingCycle: 'Monthly',
      userLimit: 10,
      storageLimit: 50,
      status: 'Active',
      createdAt: '2026-01-01T00:00:00Z',
      permissions,
    };
    fixture.componentRef.setInput('existingPackages', [item]);
    fixture.componentRef.setInput('packageToEdit', item);
    fixture.detectChanges();

    const nameInput = (fixture.nativeElement as HTMLElement).querySelector<HTMLInputElement>('[formControlName="name"]');
    if (!nameInput) throw new Error('Package name input was not rendered');
    expect(nameInput.value).toBe(item.name);

    let submitted: PackagePayload | null = null;
    component.next.subscribe((payload) => (submitted = payload));
    const form = (fixture.nativeElement as HTMLElement).querySelector('form');
    if (!form) throw new Error('Package form was not rendered');
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();

    expect(submitted).toEqual({
      name: item.name,
      availablePackage: item.availablePackage,
      description: item.description,
      price: item.price,
      billingCycle: item.billingCycle,
      userLimit: item.userLimit,
      storageLimit: item.storageLimit,
      permissions,
    });
  });
});
