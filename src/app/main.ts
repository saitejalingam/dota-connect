import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';
import 'rxjs/add/operator/map';

platformBrowserDynamic().bootstrapModule(AppModule);
