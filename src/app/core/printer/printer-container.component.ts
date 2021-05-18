import {
    Component,
    Renderer2,
    ElementRef,
    Output,
    EventEmitter
  } from '@angular/core';
  
  /**
   * Component used to render content when printed to current window
   */
  @Component({
    selector: 'az-printer-container',
    template: `
      <ng-content></ng-content>
    `,
    styles: [
        `:host.default {
            background-color: white;
            height: 100%;
            width: 100%;
            position: fixed;
            top: 0;
            left: 0;
            margin: 0;
            z-index: 1000000;
        }`
    ]
  })
  export class PrinterContainerComponent {
  
    private _renderClass = 'default';
    public get renderClass() {
      return this._renderClass;
    }
    public set renderClass(value) {
      this._renderClass = value;
      this._setCustomClass();
    }
  
    @Output() public completed = new EventEmitter<boolean>();
  
    public constructor(private elementRef: ElementRef, private renderer: Renderer2) {}
  
    /**
     * Attach custom class to element
     */
    private _setCustomClass() {
      const natElement = this.elementRef.nativeElement;
  
      this.renderer.removeClass(natElement, 'default');
      this.renderer.addClass(natElement, this._renderClass);
    }
  }