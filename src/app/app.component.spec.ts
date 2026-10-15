import { ViewportScroller } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { DefaultUrlSerializer, NavigationSkipped, NavigationSkippedCode, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AppComponent } from './app.component';

describe('Page navigation accessibility', () => {
    let events: Subject<NavigationSkipped>;
    let scroller: jasmine.SpyObj<ViewportScroller>;

    beforeEach(() => {
        events = new Subject<NavigationSkipped>();
        scroller = jasmine.createSpyObj<ViewportScroller>('ViewportScroller', ['setOffset', 'scrollToAnchor', 'scrollToPosition']);
        TestBed.configureTestingModule({
            imports: [AppComponent],
            providers: [
                { provide: ViewportScroller, useValue: scroller },
                { provide: Router, useValue: {
                    events,
                    url: '/home#process',
                    parseUrl: (url: string) => new DefaultUrlSerializer().parse(url),
                } },
            ],
        }).overrideComponent(AppComponent, { set: { imports: [], template: '<main id="main-content" tabindex="-1"></main>' } });
    });

    it('offsets anchors below the header and repeats same-URL anchor navigation', () => {
        TestBed.createComponent(AppComponent);
        expect(scroller.setOffset).toHaveBeenCalledWith([0, 76]);
        events.next(new NavigationSkipped(1, '/home#process', 'Same URL', NavigationSkippedCode.IgnoredSameUrlNavigation));
        expect(scroller.scrollToAnchor).toHaveBeenCalledWith('process');
    });

    it('focuses main content without following the base URL', () => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const event = new Event('click', { cancelable: true });
        fixture.componentInstance.skipToContent(event);
        expect(event.defaultPrevented).toBeTrue();
        expect(document.activeElement?.id).toBe('main-content');
        expect(scroller.scrollToAnchor).toHaveBeenCalledWith('main-content');
    });
});
