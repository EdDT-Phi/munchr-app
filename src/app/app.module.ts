import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Login } from '../pages/login/login';
import { Main } from '../pages/main/main';
import { Create } from '../pages/create/create';

@NgModule({
  declarations: [
    MyApp,
    Login,
    Main,
    Create
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Login,
    Main,
    Create
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
