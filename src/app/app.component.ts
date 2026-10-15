import { Component, inject } from '@angular/core';
import { DOCUMENT, ViewportScroller } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HeaderComponent } from './header/header.component';
import { NavigationSkipped, NavigationSkippedCode, Router, RouterOutlet } from '@angular/router';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
  
})
export class AppComponent {
  title = 'Luz Violeta Macrãme';

    private readonly document = inject(DOCUMENT);

    constructor(router: Router, private readonly viewportScroller: ViewportScroller) {
        viewportScroller.setOffset([0, 76]);
        router.events.pipe(takeUntilDestroyed()).subscribe(event => {
            if (event instanceof NavigationSkipped && event.code === NavigationSkippedCode.IgnoredSameUrlNavigation) {
                const fragment = router.parseUrl(router.url).fragment;
                if (fragment) {
                    viewportScroller.scrollToAnchor(fragment);
                } else {
                    viewportScroller.scrollToPosition([0, 0]);
                }
            }
        });
    }

    public skipToContent(event: Event): void {
        event.preventDefault();
        this.document.getElementById('main-content')?.focus();
        this.viewportScroller.scrollToAnchor('main-content');
    }
}
