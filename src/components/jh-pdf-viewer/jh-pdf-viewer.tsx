import {
  Component,
  EventEmitter,
  Prop,
  Event,
  Element,
  ComponentDidLoad, Method, Watch
} from '@stencil/core';
import "pdfjs-dist/";
import "pdfjs-dist/web/pdf_viewer";
import {PDFJSStatic} from 'pdfjs-dist';
//https://jsfiddle.net/pdfjs/wagvs9Lf/?utm_source=website&utm_medium=embed&utm_campaign=wagvs9Lf

declare var PDFJS: PDFJSStatic | any;
PDFJS.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.385/pdf.worker.min.js';

@Component({
  tag: 'jh-pdf-viewer',
  styleUrl: 'jh-pdf-viewer.css',
  shadow: true
})
export class StencilPdfJs implements ComponentDidLoad {

  @Element() component: HTMLElement;

  @Prop() rotation: 0 | 90 | 180 | 270 | 360 = 0;
  @Prop() src: string;

  @Watch('src') doSrc(newValue, oldValue) {
    if (newValue === oldValue) return;
    this.loadAndRender(newValue);
  }


  @Event() pageRendered: EventEmitter<number>;
  @Event() onError: EventEmitter<any>;
  @Event() pageChange: EventEmitter<number>;

  @Method() pageNext() {
    if (this.pageNum >= this.pdfDocument.numPages) {
      return;
    }
    this.pageNum++;
    this.queueRenderPage(this.pageNum);
  }

  @Method() pagePrev() {
    if (this.pageNum <= 1) return;

    this.pageNum--;
    this.queueRenderPage(this.pageNum);
  }

  private pageRendering: boolean;
  private pdfDocument: any;
  private pageNumPending: number = null;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private scale: number = 1;
  private pageNum: number = 1;

  renderPage(pageNumber: number) {
    this.pageRendering = true;
    // Using promise to fetch the page
    this.pdfDocument.getPage(pageNumber).then((page) => {
      const viewport = page.getViewport(this.scale, this.rotation);
      this.canvas.height = viewport.height;
      this.canvas.width = viewport.width;

      // Render PDF page into canvas context
      const renderContext = {
        canvasContext: this.ctx,
        viewport: viewport
      };
      let renderTask = page.render(renderContext);

      // Wait for rendering to finish
      renderTask.promise.then(() => {
        this.pageRendering = false;
        this.pageRendered.emit(this.pageNum);
        if (this.pageNumPending !== null) {
          // New page rendering is pending
          this.renderPage(this.pageNumPending);
          this.pageChange.emit(this.pageNumPending); // emit
          this.pageNumPending = null;

        }
      });
    });
  }

  queueRenderPage(pageNumber: number) {
    if (this.pageRendering) {
      this.pageNumPending = pageNumber;
    } else {
      this.renderPage(pageNumber);
    }
  }


  componentDidLoad() {
    this.canvas = this.component.shadowRoot.getElementById('pdf-canvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d');

    if (this.src) {
      this.loadAndRender(this.src);
    }
  }

  private loadAndRender(src) {
    PDFJS.getDocument(src)
      .then((pdfDocument) => {
        this.pdfDocument = pdfDocument;
        this.renderPage(this.pageNum);
      });
  }


  render() {
    return (
      <canvas id="pdf-canvas"></canvas>
    );
  }
}
