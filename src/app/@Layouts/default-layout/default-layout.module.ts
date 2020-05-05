import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DefaultLayoutComponent} from './default-layout.component';
import {DefaultLayoutRoutingModule} from './default-layout-routing.module';
import {BottomBarModule} from '../../@Components/bottom-bar/bottom-bar.module';
import {TopBarModule} from '../../@Components/top-bar/top-bar.module';
import {SidebarModule} from '../../@Components/sidebar/sidebar.module';
import {ChooseLangSubpageModule} from '../../@SubPages/choose-lang-subpage/choose-lang-subpage.module';


@NgModule({
  declarations: [DefaultLayoutComponent],
  imports: [
    CommonModule,
    DefaultLayoutRoutingModule,
    BottomBarModule,
    TopBarModule,
    SidebarModule,
    ChooseLangSubpageModule
  ],
  exports: [DefaultLayoutComponent]
})
export class DefaultLayoutModule {
}
