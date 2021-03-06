// Printer models

/**
 * Config for service - used in forRoot
 */
export class PrintServiceConfig {
  /** Print in a new window or not */
  printOpenWindow ? = true;

  /** Wait time before opening print dialog */
  timeToWaitRender ? = 200;

  /** Class name to be used when printing in current window */
  renderClass ? = 'default';

  /* Name ofapp route component - usally 'app-root' used by print to same window */
  appRootName ?  = 'app-root';
}