import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material';
import { faChevronUp, faChevronDown, faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { Select, Store } from '@ngxs/store';
import { SetReadFragment } from 'src/app/shared/store/users/users.actions';
import { UserState } from 'src/app/shared/store/users/users.reducer';
import { Decision, DeciosionOption, Place, Npc, City, Character } from 'wos-api';

@Component({
    selector: 'app-story-selector',
    templateUrl: 'story-selector.component.html',
})
export class StorySelectorComponent {
    @Select(UserState.getCharacter) character$: Observable<Character>;

    decision: Decision;

    faUp = faChevronUp;
    faDown = faChevronDown;
    faRight = faChevronRight;
    faLeft = faChevronLeft;

    selectedOption: DeciosionOption;
    loading = [];

    enterBtn = false;

    constructor(
        @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
        private bottomSheetRef: MatBottomSheetRef<StorySelectorComponent>,
        private store: Store,
        private cd: ChangeDetectorRef) {
        this.decision = data.decision;
    }

    async selectDecision(option: DeciosionOption) {
        this.selectedOption = option;
        this.enterBtn = false;
        this.cd.markForCheck();
    }


    showEnter(fragmentId) {
        this.store.dispatch(new SetReadFragment({ fragmentId }));
        this.enterBtn = true;
        this.cd.markForCheck();
    }

    takeDecision(option) {
        this.bottomSheetRef.dismiss(option);
    }

}