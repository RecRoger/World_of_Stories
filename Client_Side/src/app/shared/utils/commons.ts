import { FormGroup } from '@angular/forms';

export function isValid(form: FormGroup): boolean {
    const controls = Object.keys(form.controls);
    let validCount = 0;
    controls.forEach(control => {
        if (form.get(control).valid) {
            validCount++;
        } else {
            form.get(control).markAsTouched();
        }
    });
    form.markAsTouched();

    return (validCount === controls.length);
}