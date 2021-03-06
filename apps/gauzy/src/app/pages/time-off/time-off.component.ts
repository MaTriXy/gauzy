import { Component, OnInit, OnDestroy } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { Subject } from 'rxjs';
import { StatusTypesEnum } from '@gauzy/models';
import { Store } from '../../@core/services/store.service';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
	selector: 'ngx-time-off',
	templateUrl: './time-off.component.html',
	styleUrls: ['./time-off.component.scss']
})
export class TimeOffComponent implements OnInit, OnDestroy {
	constructor(
		private router: Router,
		private dialogService: NbDialogService,
		private store: Store
	) {}

	private _ngDestroy$ = new Subject<void>();
	private _selectedOrganizationId: string;
	selectedDate: Date;
	selectedEmployeeId: string;
	selectedStatus = 'All';
	timeOffStatuses = Object.keys(StatusTypesEnum);
	loading = false;
	displayHolidays = true;

	ngOnInit() {
		this.store.selectedDate$
			.pipe(takeUntil(this._ngDestroy$))
			.subscribe((date) => {
				this.selectedDate = date;

				if (this.selectedEmployeeId) {
					this._loadTableData();
				} else {
					if (this._selectedOrganizationId) {
						this._loadTableData(null, this._selectedOrganizationId);
					}
				}
			});

		this.store.selectedEmployee$
			.pipe(takeUntil(this._ngDestroy$))
			.subscribe((employee) => {
				if (employee && employee.id) {
					this.selectedEmployeeId = employee.id;
					this._loadTableData();
				} else {
					if (this._selectedOrganizationId) {
						this.selectedEmployeeId = null;
						this._loadTableData(null, this._selectedOrganizationId);
					}
				}
			});

		this.store.selectedOrganization$
			.pipe(takeUntil(this._ngDestroy$))
			.subscribe((org) => {
				if (org) {
					this._selectedOrganizationId = org.id;
					if (this.loading) {
						this._loadTableData(
							this.store.selectedEmployee
								? this.store.selectedEmployee.id
								: null,
							this.store.selectedEmployee &&
								this.store.selectedEmployee.id
								? null
								: this._selectedOrganizationId
						);
					}
				}
			});
	}

	private _loadTableData(
		employeeId = this.selectedEmployeeId,
		orgId?: string
	) {}

	openTimeOffSettings() {
		this.router.navigate(['/pages/time-off/settings']);
	}

	requestDaysOff() {}

	addHolidays() {}

	changeDisplayHolidays(checked: boolean) {
		this.displayHolidays = checked;
	}

	ngOnDestroy() {
		this._ngDestroy$.next();
		this._ngDestroy$.complete();
	}
}
