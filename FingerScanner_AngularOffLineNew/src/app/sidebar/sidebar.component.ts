import { Component, OnInit } from '@angular/core';


export interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}

export const ROUTES: RouteInfo[] = [
		{ path: '/cadastro',  								title: 'Biometric Register',  			icon:'',       class: '' },
		//{ path: '/biographical-information',  title: 'Biographical Information',  icon:'',       class: '' },
		//{ path: '/fingers-enrollment',     		title: 'Fingers Enrollment',        icon:'',       class: '' },
		//{ path: '/face-enrollment',     			title: 'Face Enrollment',         	icon:'',       class: '' },
		//{ path: '/confirm-details',     			title: 'Confirm Details',         	icon:'',       class: '' },
];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
    }
}
