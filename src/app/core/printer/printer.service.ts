import {
  Injectable,
  TemplateRef,
  ComponentFactoryResolver,
  Injector,
  Optional,
  Type,
  ElementRef
} from '@angular/core';
import { PrinterContainerComponent } from './printer-container.component';
import { BehaviorSubject } from 'rxjs';
import { PrintServiceConfig } from './printer.models';
import { ComponentRef } from '@angular/core';

export type Content = TemplateRef<any> | Type<any> | string | HTMLElement;

/**
 * Main print service
 */
@Injectable()
export class PrinterService {
  private _printWindowOpen = new BehaviorSubject<boolean>(false);
  private _openPrinter: Node | undefined | null;
  private _eventAdded: { [key: string]: any } = {};

  /**
   * Wait time to render before open print dialog in ms
   * Default is 200
   */
  private _timeToWaitRender = 200;

  /**
   * Class used in component when printing to current window
   */
  private _renderClass = 'default';

  /**
   * Open new window to print or not
   * Default is true
   */
  private _printOpenWindow = true;

  /**
   * Name of root component
   * Default is app-root
   */
  private _appRootName = 'app-root';
  private _appRoot: HTMLElement | undefined;
  private _appRootDislaySetting = '';
  
  public printWindowOpen$ = this._printWindowOpen.asObservable();
  
  public constructor(
    @Optional() config: PrintServiceConfig,
    private resolver: ComponentFactoryResolver,
    private injector: Injector
  ) {
    this._setRootConfigOptions(config);
  }

  /**
   * Set config from forRoot
   */
  private _setRootConfigOptions(config: PrintServiceConfig): void {
    if (config) {
      if (config.printOpenWindow != null) {
        this._printOpenWindow = config.printOpenWindow;
      }
      if (config.timeToWaitRender) {
        this._timeToWaitRender = config.timeToWaitRender;
      }
      if (config.renderClass) {
        this._renderClass = config.renderClass;
      }
      if (config.appRootName) {
        this._appRootName = config.appRootName;
      }
    }
  }

  /**
   * Print Angular TemplateRef or a Component or String
   * @example
   * this.printerService.printAngular(this.PrintTemplateTpl);
   */
  public printAngular(contentToPrint: TemplateRef<any> | Type<any> | string, context?: any): void {
    const nativeEl: ElementRef = this._createComponent(contentToPrint, context);
    this._print(nativeEl.nativeElement, this._printOpenWindow);
  }

  /**
   * Print an native Element (HTML Element)
   * @example
   * this.printerService.printHTMLElement(this.PrintComponent.nativeElement);
   */
  public printHTMLElement(nativeElement: HTMLElement): void {
    this._print(nativeElement, this._printOpenWindow);
  }

  /**
   * Create and render component
   */
  private _createComponent(contentToRender: Content, context?: any): ElementRef<any> {
    const factory = this.resolver.resolveComponentFactory(PrinterContainerComponent);
    let componentRef: ComponentRef<PrinterContainerComponent>;

    if (contentToRender) {
      if (context === undefined) {
        context = null;
      }
      const ngContent = this._resolveNgContent(contentToRender, context);
      componentRef = factory.create(this.injector, ngContent);
    } else {
      componentRef = factory.create(this.injector);
    }
    componentRef.instance.renderClass = this._renderClass;

    componentRef.hostView.detectChanges();
    return componentRef.location; // location is native element
  }

  /**
   * Main print function
   */
  private _print(printContent: any, printOpenWindow: boolean): void {
    if (printOpenWindow) {
      const printContentClone = document.importNode(printContent, true);
      this._printInNewWindow(printContentClone);
    } else {
      const printContentClone = document.importNode(printContent, true);
      const nativeEl = this._createComponent(printContentClone).nativeElement;
      this._openPrinter = nativeEl;
      document.body.appendChild(this._openPrinter as Node);
      this._getAppRoot();
      if (this._appRoot) {
        this._appRoot.style.display = 'none';
      }
      this._printCurrentWindow();
    }
  }

  /**
   * Print using a new window / tab
   */
  private _printInNewWindow(divToPrint: HTMLElement): void {
    const printWindow = window.open('', 'PRINT');
    const title = document.title;

    if (printWindow) {
        printWindow.document.write(
            `<HTML><HEAD><TITLE>${title}</TITLE></HEAD><BODY></BODY></HTML>'`
          );
      
          const printWindowDoc = printWindow.document;
          this._copyCss(printWindowDoc);
          printWindowDoc.body.style.margin = '0 0';
          printWindowDoc.body.appendChild(divToPrint);
          printWindow.document.close();
          setTimeout(
            () => this._printTabWindow(printWindow, printWindowDoc),
            this._timeToWaitRender
          );
    }
  }

  /**
   * Copy Css links to new page
   */
  private _copyCss(printWindowDoc: Document) {

    const links = document.querySelectorAll('link');
    const styles = document.querySelectorAll('style');
    const base = document.querySelector('base');

    const targetHead = printWindowDoc.getElementsByTagName('head')[0];

    if (base) { targetHead.appendChild(document.importNode(base, true)); }
    links.forEach(link => targetHead.appendChild(document.importNode(link, true)));
    styles.forEach(style => targetHead.appendChild(document.importNode(style, true)));
  }

  /**
   * Print window in new tab
   */
  private _printTabWindow(printWindow: Window, printWindowDoc: Document): void {
    this._registerPrintEvent(printWindow, true);
    this._printWindowOpen.next(true);
    printWindow.focus(); // necessary for IE >= 10*/
    if (printWindowDoc.execCommand('print') === false) {
      printWindow.print();
    }
  }

  /**
   * Print the whole current window
   */
  private _printCurrentWindow(): void {
    this._registerPrintEvent(window, false);
    setTimeout(() => {
      this._printWindowOpen.next(true);
      if (document.execCommand('print') === false) {
        window.print();
      }
    }, this._timeToWaitRender);
  }

  /**
   * Listen to print event of window
   */
  private _registerPrintEvent(printWindow: Window, printWithOpenInNewWindow: boolean) {
    const that = this;
    printWindow.focus(); // necessary for IE >= 10*/

    if (that._eventAdded[printWindow.name]) {
      return;
    }
    printWindow.addEventListener('afterprint', () => {
      this._eventAdded[printWindow.name] = true;
      if (printWithOpenInNewWindow) {
        that._eventAdded[printWindow.name] = false;
      }
      that._cleanUp(printWindow, printWithOpenInNewWindow);
      that._printWindowOpen.next(false);
    });
  }

  /**
   * Close tab or clean up dom
   */
  private _cleanUp(printWindow: Window, printOpenWindow: boolean): void {
    if (printOpenWindow === true) {
      printWindow.close();
      setTimeout(() => {
        printWindow.close();
      }, 20);
    }
    if (printOpenWindow === false) {
        if (!this._openPrinter) {
          return;
        }
        if (document.body.getElementsByTagName('az-printer-container').length === 0) {
          return;
        }

        if (this._appRoot) {
          if (this._appRootDislaySetting !== '') {
            this._appRoot.style.display = this._appRootDislaySetting;
          } else {
            this._appRoot.style.display = '';
          }
        }

        document.body.removeChild(this._openPrinter);
        this._openPrinter = null;
    }
  }

  /**
   * Create node or angular component
   */
  private _resolveNgContent(content: Content, context: any): any[] {
    if (typeof content === 'string') {
      const element = document.createTextNode(content);
      return [[element]];
    }

    if (content instanceof TemplateRef) {
      const viewRef = content.createEmbeddedView(context);
      viewRef.detectChanges();
      return [viewRef.rootNodes];
    }

    if (content instanceof HTMLElement) {
      return [[content]];
    }

    /** Otherwise it's a component */
    const factory = this.resolver.resolveComponentFactory(content);

    const componentRef = factory.create(this.injector);
    componentRef.changeDetectorRef.detectChanges();
    return [[componentRef.location.nativeElement]];
  }

  /**
   * Search for Angular App Root
   */
  private _getAppRoot(): void {
    const appRoot = document.body.getElementsByTagName(this._appRootName);
    if (appRoot.length !== 0) {
      this._appRoot = appRoot[0] as HTMLElement;
      this._appRootDislaySetting = this._appRoot.style.display;
    }
  }
}