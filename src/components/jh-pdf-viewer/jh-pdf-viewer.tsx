import {
  Component,
  ComponentDidLoad,
  Element,
  Event,
  EventEmitter,
  Method,
  Prop,
  Watch
} from '@stencil/core';
import {
  PDFDocumentProxy,
  PDFPageProxy,
  PDFPageViewport,
  PDFRenderParams,
  PDFRenderTask
} from 'pdfjs-dist';
import pdf from 'pdfjs-dist/build/pdf';
import 'pdfjs-dist/web/pdf_viewer';

pdf.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.943/pdf.worker.min.js';

/**
 * PDF Viewing component
 */
@Component({
  tag: 'jh-pdf-viewer',
  styleUrl: 'jh-pdf-viewer.css',
  shadow: true
})
export class StencilPdfJs implements ComponentDidLoad {
  @Element() public component: HTMLElement;

  private isPageRendering: boolean;
  private pdfDocument: any;
  private pageNumPending: number = null;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private scale: number = 1; // hardcoded to scale the document to full canvas size
  private pageNum: number = 1; // hardcoded to start at the page 1

  //
  // --- Properties / Inputs --- //
  //

  /**
   * Rotate the PDF in degrees
   * {number}
   */
  @Prop() public rotation: 0 | 90 | 180 | 270 | 360 = 0;

  /**
   * Src of the PDF to load and render
   * {number}
   */
  @Prop() public src: string;

  /**
   * Listen for changes to src
   * @param newValue
   * @param oldValue
   */
  @Watch('src')
  public doSrc(newValue: string | null, oldValue: string | null): void {
    if (newValue === oldValue) {
      return;
    }
    this.loadAndRender(newValue);
  }

  //
  // --- Event Emitters --- //
  //
  @Event() public pageRendered: EventEmitter<number>;
  @Event() public onError: EventEmitter<any>;
  @Event() public pageChange: EventEmitter<number>;

  //
  // --- Methods --- //
  //

  /**
   * Page forward
   * {MouseEvent} e
   */
  @Method()
  public pageNext(e: MouseEvent): void {
    e.preventDefault();

    if (this.pageNum >= this.pdfDocument.numPages) {
      return;
    }
    this.pageNum += 1;
    this.queueRenderPage(this.pageNum);
  }

  /**
   * Page backward
   * e
   */
  @Method()
  public pagePrev(e: MouseEvent): void {
    e.preventDefault();

    if (this.pageNum <= 1) {
      return;
    }

    this.pageNum -= 1;
    this.queueRenderPage(this.pageNum);
  }

  /**
   * Render the page based on pageNumber
   * {number} pageNumber
   */
  public renderPage(pageNumber: number): void {
    this.isPageRendering = true;

    this.pdfDocument
      .getPage(pageNumber)
      .then(
        (page: PDFPageProxy) => {
          const viewport: PDFPageViewport = page.getViewport(this.scale, this.rotation);
          this.canvas.height = viewport.height;
          this.canvas.width = viewport.width;

          // Render PDF page into canvas context
          const renderContext: PDFRenderParams = {
            viewport,
            canvasContext: this.ctx
          };

          // Render page method
          const renderTask: PDFRenderTask = page.render(renderContext);

          // Wait for rendering to finish
          renderTask
            .then(
              () => {
                this.isPageRendering = false;
                this.pageRendered.emit(this.pageNum);

                if (this.pageNumPending !== null) {
                  this.renderPage(this.pageNumPending); // New page rendering is pending
                  this.pageChange.emit(this.pageNumPending); // emit
                  this.pageNumPending = null;

                }
              }
            );
        }
      );
  }

  private queueRenderPage(pageNumber: number): void {
    if (this.isPageRendering) {
      this.pageNumPending = pageNumber;
    } else {
      this.renderPage(pageNumber);
    }
  }

  public componentDidLoad(): void {
    this.canvas = this.component.shadowRoot.getElementById('pdf-canvas') as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d');

    if (this.src) {
      this.loadAndRender(this.src);
    }
  }

  private loadAndRender(src: string): void {
    pdf
      .getDocument(src)
      .then((pdfDocument: PDFDocumentProxy) => {
        this.pdfDocument = pdfDocument;
        this.renderPage(this.pageNum);
      });
  }

  public render(): JSX.Element {
    return (
      <div>
        <button onClick={this.pagePrev.bind(this)}>Prev</button>
        <button onClick={this.pageNext.bind(this)}>Next</button>
        <canvas id="pdf-canvas"/>
      </div>
    );
  }
}
