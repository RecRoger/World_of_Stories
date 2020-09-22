import { FormGroup } from '@angular/forms';

export function isValid(form: FormGroup): boolean {
    const controls = Object.keys(form.controls);
    let validCount = 0;
    controls.forEach(control => {
        const formControl = form.get(control);
        // console.log('control: ' + control, 'valid' + formControl.valid)
        if (formControl.valid) {
            validCount++;
        } else {
            formControl.markAsTouched();
        }
    });
    form.markAsTouched();

    return (validCount === controls.length);
}

export function isScrollAtBottom(scrollElement) {
    const rest = scrollElement.scrollHeight - scrollElement.scrollTop - scrollElement.clientHeight;
    return (rest === 0) ||
        (rest >= -2.5 && rest <= 2.5);
}

