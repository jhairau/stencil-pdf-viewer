import {
  Component,
  EventEmitter,
  Prop,
  Event,
  Element,
  ComponentWillLoad,
  ComponentDidLoad,
  ComponentDidUpdate
} from '@stencil/core';
import "pdfjs-dist/";
import "pdfjs-dist/web/pdf_viewer";
import {PDFJSStatic} from 'pdfjs-dist';
//https://github.com/VadimDez/ng2-pdf-viewer
//https://jsfiddle.net/pdfjs/wagvs9Lf/?utm_source=website&utm_medium=embed&utm_campaign=wagvs9Lf

declare var PDFJS: PDFJSStatic | any;
PDFJS.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.385/pdf.worker.min.js';

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
  shadow: true
})
export class StencilPdfJs implements ComponentWillLoad, ComponentDidLoad, ComponentDidUpdate {
  private CSS_UNITS: number = 96.0 / 72.0;

  public pdfLinkService: any;
  public pdfViewer: any;
  public pdfFindController: any;
  //private lastLoaded: string | Uint8Array | PDFSource;
  //private resizeTimeout: NodeJS.Timer;
  //private pdf;

  private pdfHistory: any;
  private l10n: any;

  @Prop() first: string;
  @Prop() last: string;
  @Prop() canAutoResize: boolean = true;

  @Event() onEventCreate: EventEmitter<Date>;
  //@Event() afterLoadComplete: EventEmitter<PDFDocumentProxy>;
  @Event() pageRendered: EventEmitter<CustomEvent>;
  @Event() onError: EventEmitter<any>;
  //@Event() onProgress: EventEmitter<PDFProgressData>;
  @Event() pageChange: EventEmitter<number>;


  componentWillLoad() {

  }

  componentDidLoad() {
    // (Optionally) enable hyperlinks within PDF files.
    let linkService = new PDFJS.PDFLinkService();
    this.l10n = PDFJS.NullL10n;
    let container =this.todoListEl.shadowRoot.getElementById('viewerContainer');
    let pdfViewer = new PDFJS.PDFViewer({
      container: container,
      linkService: linkService,
      l10n: this.l10n,
      useOnlyCssZoom: true,
      textLayerMode: 0,
    });
    this.pdfViewer = pdfViewer;
    linkService.setViewer(pdfViewer);

    this.pdfHistory = new PDFJS.PDFHistory({
      linkService: linkService
    });
    linkService.setHistory(this.pdfHistory);

    container.addEventListener('pagesinit', function () {
      // We can use pdfViewer now, e.g. let's change default scale.
      pdfViewer.currentScaleValue = 'page-width';
    });

    this.pdfViewer.currentPageNumber = 0;

// Loading document.
    PDFJS.getDocument('assets/file.pdf').then(function (pdfDocument) {
      // Document loaded, specifying document for the viewer and
      // the (optional) linkService.
      pdfViewer.setDocument(pdfDocument);

      linkService.setDocument(pdfDocument, null);
    });
  }

  pageNext() {
    debugger;
    this.pdfViewer.currentPageNumber++;
  }

  pagePrev() {
    this.pdfViewer.currentPageNumber--;
  }

  componentDidUpdate() {

  }

  //
  // @Listen('window:resize')
  // public onPageResize() {
  //   if (!this.canAutoResize || !this.pdf) {
  //     return;
  //   }
  //
  //   if (this.resizeTimeout) {
  //     clearTimeout(this.resizeTimeout);
  //   }
  //
  //   this.resizeTimeout = setTimeout(() => {
  //     this.updateSize();
  //   }, 100);
  // }
  //
  // @Listen('pagerendered')
  // onPageRendered(e: CustomEvent) {
  //   debugger;
  //   this.pageRendered.emit(e);
  // }
  //
  // //@Prop() src: string | Uint8Array | PDFSource;
  //
  // @Prop() page: number = 1;
  //
  // @Watch('page') watchPage(newValue: number) {
  //   this.page = this.getValidPageNumber(newValue);
  //   this.pageChange.emit(this.page);
  // }
  //
  // @Prop() renderText: boolean = true;
  //
  // @Watch('renderText')
  // doRenderText() {
  //   this.setupViewer();
  //   this.update();
  // }

  @Prop() originalSize: boolean = true;
  @Prop() showAll: boolean = true;
  @Prop() stickToPage: boolean = false;
  @Prop() zoom: number = 0;
  @Prop() rotation: 0 | 90 | 180 | 270 | 360 = 0;
  @Prop() externalLinkTarget: string = 'blank';
  @Prop() autoResize: boolean = true;
  @Prop() fitToPage: boolean = true;

  @Element() todoListEl: HTMLElement;

  // @Watch('src')
  // loadPDF() {
  //   if (!this.src) {
  //     return;
  //   }
  //
  //   if (this.lastLoaded === this.src) {
  //     this.update();
  //     return;
  //   }
  //
  //   // @ts-ignore
  //   let loadingTask: any = PDFJS.getDocument(this.src as any);
  //
  //   loadingTask.onProgress = (progressData: PDFProgressData) => {
  //     this.onProgress.emit(progressData);
  //   };
  //
  //   const src = this.src;
  //   (loadingTask.promise)
  //     .then((pdf: PDFDocumentProxy) => {
  //       this.pdf = pdf;
  //       this.lastLoaded = src;
  //
  //       this.afterLoadComplete.emit(pdf);
  //
  //       this.update();
  //     }, (error: any) => {
  //       this.onError.emit(error);
  //     });
  // }


  // public setupViewer() {
  //   // @ts-ignore
  //  // (PDFJS).disableTextLayer = !this.renderText;
  //   //@ts-ignore
  //   this.pdfLinkService = new (PDFJS).PDFLinkService();
  //
  //   const pdfOptions: PDFViewerParams | any = {
  //     container: this.todoListEl,
  //     removePageBorders: true,
  //     linkService: this.pdfLinkService
  //   };
  //
  //   // @ts-ignore
  //   this.pdfViewer = new PDFJS.PDFViewer(pdfOptions);
  //   //@ts-ignore
  //   this.pdfLinkService.setViewer(this.pdfViewer);
  //   //@ts-ignore
  //   this.pdfFindController = new (PDFJS).PDFFindController({pdfViewer: this.pdfViewer});
  //   this.pdfViewer.setFindController(this.pdfFindController);
  // }
  //
  // public updateSize() {
  //   if (!this.showAll) {
  //     this.renderPage(this.page);
  //     return;
  //   }
  //
  //   this.pdf.getPage(this.pdfViewer.currentPageNumber).then((page: PDFPageProxy) => {
  //     const viewport = page.getViewport(this.zoom, this.rotation);
  //     let scale = this.zoom;
  //     let stickToPage = true;
  //
  //     // Scale the document when it shouldn't be in original size or doesn't fit into the viewport
  //     if (!this.originalSize || (this.fitToPage && viewport.width > this.todoListEl.offsetWidth)) {
  //       scale = this.getScale(page.getViewport(1).width);
  //       stickToPage = !this.stickToPage;
  //     }
  //
  //     this.pdfViewer._setScale(scale, stickToPage);
  //   });
  // }
  //
  // private getValidPageNumber(page: number): number {
  //   if (page < 1 || !this.pdf) {
  //     return 1;
  //   }
  //
  //
  //   if (page > this.pdf.numPages) {
  //     return this.pdf.numPages;
  //   }
  //
  //   return page;
  // }
  //
  // private getLinkTarget(type: string) {
  //   switch (type) {
  //     case 'blank':
  //       //@ts-ignore
  //       return (PDFJS).LinkTarget.BLANK;
  //     case 'none':
  //       //@ts-ignore
  //       return (PDFJS).LinkTarget.NONE;
  //     case 'self':
  //       //@ts-ignore
  //       return (PDFJS).LinkTarget.SELF;
  //     case 'parent':
  //       //@ts-ignore
  //       return (PDFJS).LinkTarget.PARENT;
  //     case 'top':
  //       //@ts-ignore
  //       return (PDFJS).LinkTarget.TOP;
  //   }
  //
  //   return null;
  // }
  //
  // private setExternalLinkTarget(type: string) {
  //   const linkTarget = this.getLinkTarget(type);
  //
  //   if (linkTarget !== null) {
  //     //@ts-ignore
  //     (PDFJS).externalLinkTarget = linkTarget;
  //   }
  // }
  //
  //
  // private update() {
  //   if (this.showAll) {
  //     this.setupViewer();
  //
  //     if (this.pdfViewer) {
  //       this.pdfViewer.setDocument(this.pdf);
  //     }
  //   }
  //
  //   if (this.pdfLinkService) {
  //     this.pdfLinkService.setDocument(this.pdf, null);
  //   }
  //
  //   this.renderPdf();
  // }
  //
  // private renderPdf() {
  //   if (this.showAll) {
  //     this.renderMultiplePages();
  //   } else {
  //     this.renderPage(this.page);
  //   }
  // }
  //
  // private renderMultiplePages() {
  //   this.page = this.getValidPageNumber(this.page);
  //
  //   if (this.rotation !== 0 || this.pdfViewer.pagesRotation !== this.rotation) {
  //     setTimeout(() => {
  //       this.pdfViewer.pagesRotation = this.rotation;
  //     });
  //   }
  //
  //   if (this.stickToPage) {
  //     setTimeout(() => {
  //       this.pdfViewer.currentPageNumber = this.page;
  //     });
  //   }
  //
  //   this.updateSize();
  // }
  //
  // private renderPage(pageNumber: number) {
  //   this.pdf.getPage(pageNumber).then((page: PDFPageProxy) => {
  //     let viewport = page.getViewport(this.zoom, this.rotation);
  //     let container = this.todoListEl.querySelector('.pdfViewer');
  //     let scale = this.zoom;
  //
  //     // Scale the document when it shouldn't be in original size or doesn't fit into the viewport
  //     if (!this.originalSize || (this.fitToPage && viewport.width > this.todoListEl.offsetWidth)) {
  //       viewport = page.getViewport(this.todoListEl.offsetWidth / viewport.width, this.rotation);
  //       scale = this.getScale(page.getViewport(1).width);
  //     }
  //
  //     this.removeAllChildNodes(container as HTMLElement);
  //
  //     // @ts-ignore
  //     (PDFJS).disableTextLayer = !this.renderText;
  //
  //     let pdfOptions: PDFViewerParams | any = {
  //       container,
  //       removePageBorders: true,
  //       defaultViewport: viewport,
  //       scale,
  //       id: this.page,
  //     };
  //
  //     if (this.renderText) {
  //       //@ts-ignore
  //       this.pdfLinkService = new (PDFJS).PDFLinkService();
  //       pdfOptions.linkService = this.pdfLinkService;
  //       this.setExternalLinkTarget(this.externalLinkTarget);
  //       //@ts-ignore
  //       pdfOptions.textLayerFactory = new (PDFJS).DefaultTextLayerFactory();
  //       //@ts-ignore
  //       pdfOptions.annotationLayerFactory = new (PDFJS).DefaultAnnotationLayerFactory();
  //     }
  //
  //     //@ts-ignore
  //     let pdfPageView = new (PDFJS).PDFPageView(pdfOptions);
  //
  //     if (this.renderText) {
  //       this.pdfLinkService.setViewer(pdfPageView);
  //     }
  //
  //     if (this.rotation !== 0 || pdfPageView.rotation !== this.rotation) {
  //       pdfPageView.rotation = this.rotation;
  //     }
  //
  //     pdfPageView.setPdfPage(page);
  //     return pdfPageView.draw();
  //   });
  // }
  //
  // private removeAllChildNodes(element: HTMLElement) {
  //   while (element.firstChild) {
  //     element.removeChild(element.firstChild);
  //   }
  // }
  //
  // private getScale(viewportWidth: number) {
  //   const offsetWidth = this.todoListEl.offsetWidth;
  //
  //   if (offsetWidth === 0) {
  //     return 1;
  //   }
  //
  //   return this.zoom * (offsetWidth / viewportWidth) / this.CSS_UNITS;
  // }

  render() {
    return (
      <div>
        <button onClick={() => this.pagePrev()}>Prev</button>
        <button onClick={() => this.pageNext()}>Next</button>
        <div id="viewerContainer">
          <div id="viewer" class="pdfViewer"></div>
        </div>
      </div>
    );
  }
}
