import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../../../core/core.reducer';
import { CurrentUserAppState } from '../../../../../core/store/users/current-user';

@Component({
  selector: 'cbs-bond-repayment-form',
  templateUrl: 'bond-repayment-form.component.html',
  styleUrls: ['bond-repayment-form.component.scss']
})

export class BondRepaymentFormComponent implements OnInit, OnDestroy {
  @Output() onAutoTypeChange = new EventEmitter();
  @Output() onTotalEdited = new EventEmitter();
  private currentUserSub: any;
  public repaymentForm: FormGroup;
  public repaymentTypeList = [
    {
      value: 'NORMAL_REPAYMENT',
      name: 'NORMAL_REPAYMENT'
    },
    {
      value: 'EARLY_TOTAL_REPAYMENT',
      name: 'EARLY_TOTAL_REPAYMENT'
    }
  ];

  constructor(private fb: FormBuilder,
              private store$: Store<fromRoot.State>) {
  }

  ngOnInit() {
    this.repaymentForm = this.fb.group({
      timestamp: new FormControl({value: '', disabled: true}, Validators.required),
      repaymentType: new FormControl('NORMAL_REPAYMENT', Validators.required),
      penalty: new FormControl({value: '', disabled: true}, Validators.required),
      interest: new FormControl({value: '', disabled: true}, Validators.required),
      principal: new FormControl({value: '', disabled: true}, Validators.required),
      total: new FormControl({value: '', disabled: true}, [Validators.required])
    });

    this.currentUserSub = this.store$.select(fromRoot.getCurrentUserState)
    .subscribe((user: CurrentUserAppState) => {
      user.permissions.forEach((item) => {
        if (item.group === 'LOANS' && !item.permissions.includes('PAST_REPAYMENTS')) {
          this.repaymentForm.controls['date'].disable({emitEvent: false, onlySelf: true});
        }
      })
    });
  }

  ngOnDestroy() {
    this.currentUserSub.unsubscribe();
  }
}
