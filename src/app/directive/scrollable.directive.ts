import { Directive, HostListener, EventEmitter, Output, ElementRef } from '@angular/core';

@Directive({
  selector: '[appScrollable]'
})
export class ScrollableDirective {

  @Output() scrollPosition = new EventEmitter();

  constructor(public el: ElementRef) { }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event) {
    try {
      const top = event.target.documentElement.scrollTop;
      const ev_height = event.target.documentElement.scrollHeight;
//      const ev_offset = event.target.documentElement.offsetHeight;
//      const el_height = this.el.nativeElement.scrollHeight;
//      const el_offset = this.el.nativeElement.offsetHeight;
// console.log('window height', window.innerHeight);
// console.log('top: ', top);
// console.log('ev_height: ', ev_height);
// console.log('ev_offset: ', ev_offset);
// console.log('el_height: ', el_height);
// console.log('el_offset: ', el_offset);
      // emit bottom event
      if ( top + window.innerHeight >= ev_height - 1 ) {
        this.scrollPosition.emit('bottom');
      }

      // emit top event
      if (top === 0) {
        this.scrollPosition.emit('top');
      }

    } catch (err) {
      console.log('error is: ', err);
    }
  }
}
