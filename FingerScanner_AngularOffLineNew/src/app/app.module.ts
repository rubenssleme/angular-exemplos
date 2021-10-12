import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; //Novo
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { ToastrModule } from "ngx-toastr";
import { HttpClientModule } from '@angular/common/http';

import {JsonPipe} from '@angular/common';

import { SidebarModule } from './sidebar/sidebar.module';
import { FooterModule } from './shared/footer/footer.module';
import { NavbarModule} from './shared/navbar/navbar.module';
import { FixedPluginModule} from './shared/fixedplugin/fixedplugin.module';

import { AppComponent } from './app.component';
import { AppRoutes } from './app.routing';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { NoSanitizePipe } from './no-sanitize.pipe';

@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    NoSanitizePipe,
  ],
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    HttpClientModule,		
    RouterModule.forRoot(AppRoutes,{
      useHash: true
    }),
    SidebarModule,
    NavbarModule,
    ToastrModule.forRoot(),
    FooterModule,
    FixedPluginModule
  ],
	exports:[NoSanitizePipe],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
