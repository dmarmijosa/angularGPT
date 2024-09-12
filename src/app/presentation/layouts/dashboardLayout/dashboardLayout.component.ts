import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarMenuItemComponent } from '../../components/sidebarMenuItem/sidebarMenuItem.component';
import { routes } from '../../../app.routes';
import { HelpersService } from 'app/presentation/services/helpers.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarMenuItemComponent],
  templateUrl: './dashboardLayout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardLayoutComponent {
  isOpenMenu = signal(false);
  private screenService = inject(HelpersService);
  routes = signal(routes[0].children?.filter((route) => route.data));

  constructor() {
    this.screenService.isDesktop$.subscribe((resp) => {
      if (!resp) {
        this.routes.set(
          routes[0].children?.filter(
            (route) => route.data && route.path != 'image-tunning'
          )
        );
      } else {
        this.routes.set(routes[0].children?.filter((route) => route.data));
      }
    });
  }
  toggleMenu() {
    this.isOpenMenu.update((prev) => (prev = !prev));
  }
}
