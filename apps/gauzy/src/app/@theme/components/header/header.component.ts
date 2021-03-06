import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
	NbMenuService,
	NbSidebarService,
	NbThemeService,
	NbMenuItem
} from '@nebular/theme';
import { LayoutService } from '../../../@core/utils';
import { Subject } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '../../../@core/services/store.service';
import { SelectorService } from '../../../@core/utils/selector.service';

@Component({
	selector: 'ngx-header',
	styleUrls: ['./header.component.scss'],
	templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
	@Input() position = 'normal';

	showEmployeesSelector = true;
	showDateSelector = true;
	showOrganizationsSelector = true;
	theme: string;
	createContextMenu: NbMenuItem[];
	supportContextMenu: NbMenuItem[];
	showExtraActions = false;
	largeBreakpoint = 1290;

	private _selectedOrganizationId: string;
	private _ngDestroy$ = new Subject<void>();

	constructor(
		private sidebarService: NbSidebarService,
		private menuService: NbMenuService,
		private layoutService: LayoutService,
		private themeService: NbThemeService,
		private router: Router,
		private translate: TranslateService,
		private store: Store,
		private selectorService: SelectorService
	) {}

	ngOnInit() {
		this.showSelectors(this.router.url);

		this.router.events
			.pipe(filter((event) => event instanceof NavigationEnd))
			.pipe(takeUntil(this._ngDestroy$))
			.subscribe((e) => {
				this.showSelectors(e['url']);
			});

		this.menuService
			.onItemClick()
			.pipe(filter(({ tag }) => tag === 'create-context-menu'))
			.pipe(takeUntil(this._ngDestroy$))
			.subscribe((e) => {
				this.router.navigate([e.item.link], {
					queryParams: {
						openAddDialog: true
					}
				});
			});

		this.store.selectedOrganization$
			.pipe(takeUntil(this._ngDestroy$))
			.subscribe((org) => {
				if (org) {
					this._selectedOrganizationId = org.id;
					this.loadItems();
				}
			});

		this.themeService
			.onThemeChange()
			.pipe(takeUntil(this._ngDestroy$))
			.subscribe((t) => {
				this.theme = t.name;
			});

		this.loadItems();
		this._applyTranslationOnSmartTable();
	}

	showSelectors(url: string) {
		const selectors = this.selectorService.showSelectors(url);
		this.showDateSelector = selectors.showDateSelector;
		this.showEmployeesSelector = selectors.showEmployeesSelector;
		this.showOrganizationsSelector = selectors.showOrganizationsSelector;
	}

	toggleSidebar(): boolean {
		if (this.showExtraActions) {
			this.toggleExtraActions(false);
			this.sidebarService.expand('menu-sidebar');
		} else {
			this.sidebarService.toggle(true, 'menu-sidebar');
			this.layoutService.changeLayoutSize();
		}
		return false;
	}

	toggleSettings(): boolean {
		if (this.showExtraActions) {
			this.toggleExtraActions(false);
			this.sidebarService.expand('settings-sidebar');
		} else {
			this.sidebarService.toggle(false, 'settings-sidebar');
		}
		return false;
	}

	navigateHome() {
		this.menuService.navigateHome();
		return false;
	}

	getWindowWidth() {
		return window.innerWidth;
	}

	toggleExtraActions(bool?: boolean) {
		this.showExtraActions =
			bool !== undefined ? bool : !this.showExtraActions;
	}

	loadItems() {
		this.createContextMenu = [
			{
				title: this.getTranslation('CONTEXT_MENU.TIMER'),
				icon: 'clock-outline',
				link: '#'
			},
			// TODO: divider
			{
				title: this.getTranslation('CONTEXT_MENU.ADD_INCOME'),
				icon: 'plus-circle-outline',
				link: 'pages/income'
			},
			{
				title: this.getTranslation('CONTEXT_MENU.ADD_EXPENSE'),
				icon: 'minus-circle-outline',
				link: 'pages/expenses'
			},
			// TODO: divider
			{
				title: this.getTranslation('CONTEXT_MENU.INVOICE'),
				icon: 'archive-outline',
				link: '#'
			},
			{
				title: this.getTranslation('CONTEXT_MENU.PROPOSAL'),
				icon: 'paper-plane-outline',
				link: 'pages/proposals/register'
			},
			{
				title: this.getTranslation('CONTEXT_MENU.CONTRACT'),
				icon: 'file-text-outline',
				link: '#'
			},
			// TODO: divider
			{
				title: this.getTranslation('CONTEXT_MENU.TEAM'),
				icon: 'people-outline',
				link: `pages/organizations/edit/${this._selectedOrganizationId}/settings/teams`
			},
			{
				title: this.getTranslation('CONTEXT_MENU.TASK'),
				icon: 'calendar-outline',
				link: '#'
			},
			{
				title: this.getTranslation('CONTEXT_MENU.CLIENT'),
				icon: 'person-done-outline',
				link: '#'
			},
			{
				title: this.getTranslation('CONTEXT_MENU.PROJECT'),
				icon: 'color-palette-outline',
				link: '#'
			},
			// TODO: divider
			{
				title: this.getTranslation('CONTEXT_MENU.ADD_EMPLOYEE'),
				icon: 'people-outline',
				link: 'pages/employees'
			}
		];

		this.supportContextMenu = [
			{
				title: this.getTranslation('CONTEXT_MENU.CHAT')
			},
			{
				title: this.getTranslation('CONTEXT_MENU.FAQ')
			},
			{
				title: this.getTranslation('CONTEXT_MENU.HELP')
			}
		];
	}

	getTranslation(prefix: string) {
		let result = '';
		this.translate.get(prefix).subscribe((res) => {
			result = res;
		});
		return result;
	}

	private _applyTranslationOnSmartTable() {
		this.translate.onLangChange
			.pipe(takeUntil(this._ngDestroy$))
			.subscribe(() => {
				this.createContextMenu = [];
				this.supportContextMenu = [];
				this.loadItems();
			});
	}

	ngOnDestroy() {
		this._ngDestroy$.next();
		this._ngDestroy$.complete();
	}
}
