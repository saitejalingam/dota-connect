import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

platformBrowserDynamic().bootstrapModule(AppModule);
