// Mobile-specific utilities to prevent white screens and improve mobile experience

export class MobileUtils {
  private static instance: MobileUtils;
  private isMobile: boolean = false;
  private isPiBrowser: boolean = false;

  private constructor() {
    this.detectDevice();
    this.applyMobileFixes();
  }

  public static getInstance(): MobileUtils {
    if (!MobileUtils.instance) {
      MobileUtils.instance = new MobileUtils();
    }
    return MobileUtils.instance;
  }

  private detectDevice(): void {
    const userAgent = navigator.userAgent.toLowerCase();
    this.isMobile = /mobile|android|iphone|ipad|phone|blackberry|opera mini|iemobile/i.test(userAgent);
    this.isPiBrowser = userAgent.includes('pi') || userAgent.includes('minepi');
    
    // Detect Pi subdomain
    const isPiSubdomain = window.location.hostname.includes('pinet.com') || 
                         window.location.hostname.includes('minepi.com');
    
    // Detect iframe
    const isInIframe = window.self !== window.top;
    
    console.log('Device detection:', {
      isMobile: this.isMobile,
      isPiBrowser: this.isPiBrowser,
      isPiSubdomain: isPiSubdomain,
      isInIframe: isInIframe,
      hostname: window.location.hostname,
      userAgent: navigator.userAgent
    });
    
    // Apply subdomain-specific fixes
    if (isPiSubdomain) {
      this.applySubdomainFixes();
    }
    
    // Apply iframe-specific fixes
    if (isInIframe) {
      this.applyIframeFixes();
    }
  }

  private applySubdomainFixes(): void {
    console.log('Applying Pi subdomain specific fixes...');
    
    // Force HTTPS for subdomains
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      console.log('Forcing HTTPS for subdomain...');
      window.location.replace(window.location.href.replace('http:', 'https:'));
    }
    
    // Add subdomain class
    document.body.classList.add('pi-subdomain');
    
    // Force repaint for subdomain
    this.forceSubdomainRepaint();
    
    // Enhanced viewport fixes for subdomain
    this.fixSubdomainViewport();
  }

  private applyIframeFixes(): void {
    console.log('Applying iframe specific fixes...');
    
    // Add iframe class
    document.body.classList.add('pi-iframe');
    
    // Force repaint for iframe
    this.forceIframeRepaint();
    
    // Enhanced viewport fixes for iframe
    this.fixIframeViewport();
  }

  private forceSubdomainRepaint(): void {
    // Force a repaint to prevent white screen on subdomains
    document.body.style.display = 'none';
    document.body.offsetHeight; // Trigger reflow
    document.body.style.display = '';
    
    // Multiple repaints to ensure rendering
    setTimeout(() => {
      document.body.style.display = 'none';
      document.body.offsetHeight;
      document.body.style.display = '';
    }, 100);
    
    setTimeout(() => {
      document.body.style.display = 'none';
      document.body.offsetHeight;
      document.body.style.display = '';
    }, 500);
  }

  private forceIframeRepaint(): void {
    // Force a repaint to prevent white screen in iframe
    document.body.style.display = 'none';
    document.body.offsetHeight; // Trigger reflow
    document.body.style.display = '';
    
    // Multiple repaints to ensure rendering
    setTimeout(() => {
      document.body.style.display = 'none';
      document.body.offsetHeight;
      document.body.style.display = '';
    }, 100);
    
    setTimeout(() => {
      document.body.style.display = 'none';
      document.body.offsetHeight;
      document.body.style.display = '';
    }, 500);
  }

  private fixSubdomainViewport(): void {
    // Fix viewport height for subdomains
    const setSubdomainVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      
      // Ensure body and root have proper height and background
      document.body.style.minHeight = '100vh';
      document.body.style.minHeight = '100dvh';
      document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      
      const root = document.getElementById('root');
      if (root) {
        root.style.minHeight = '100vh';
        root.style.minHeight = '100dvh';
        root.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      }
    };
    
    setSubdomainVH();
    window.addEventListener('resize', setSubdomainVH);
    window.addEventListener('orientationchange', setSubdomainVH);
    
    // Force repaint after a short delay
    setTimeout(setSubdomainVH, 100);
    setTimeout(setSubdomainVH, 500);
    setTimeout(setSubdomainVH, 1000);
  }

  private fixIframeViewport(): void {
    // Fix viewport height for iframe
    const setIframeVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      
      // Ensure body and root have proper height and background
      document.body.style.minHeight = '100vh';
      document.body.style.minHeight = '100dvh';
      document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      
      const root = document.getElementById('root');
      if (root) {
        root.style.minHeight = '100vh';
        root.style.minHeight = '100dvh';
        root.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      }
    };
    
    setIframeVH();
    window.addEventListener('resize', setIframeVH);
    window.addEventListener('orientationchange', setIframeVH);
    
    // Force repaint after a short delay
    setTimeout(setIframeVH, 100);
    setTimeout(setIframeVH, 500);
    setTimeout(setIframeVH, 1000);
  }

  private applyMobileFixes(): void {
    if (!this.isMobile) return;

    console.log('Applying mobile-specific fixes...');

    // Fix viewport height issues on mobile
    this.fixViewportHeight();

    // Prevent zoom on double tap
    this.preventDoubleTapZoom();

    // Prevent pull-to-refresh
    this.preventPullToRefresh();

    // Fix touch scrolling
    this.fixTouchScrolling();

    // Handle orientation changes
    this.handleOrientationChange();

    // Fix safe area issues
    this.fixSafeArea();

    // Pi Browser specific fixes
    if (this.isPiBrowser) {
      this.applyPiBrowserFixes();
    }
  }

  private applyPiBrowserFixes(): void {
    console.log('Applying Pi Browser specific fixes...');

    // Force repaint to prevent white screen
    this.forceRepaint();

    // Fix Pi Browser viewport issues
    this.fixPiBrowserViewport();

    // Handle Pi Browser specific errors
    this.handlePiBrowserErrors();

    // Add Pi Browser specific styles
    this.addPiBrowserStyles();
  }

  private forceRepaint(): void {
    // Force a repaint to prevent white screen
    document.body.style.display = 'none';
    document.body.offsetHeight; // Trigger reflow
    document.body.style.display = '';
  }

  private fixPiBrowserViewport(): void {
    // Fix viewport height for Pi Browser
    const setPiBrowserVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      
      // Ensure body and root have proper height
      document.body.style.minHeight = '100vh';
      document.body.style.minHeight = '100dvh';
      document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      
      const root = document.getElementById('root');
      if (root) {
        root.style.minHeight = '100vh';
        root.style.minHeight = '100dvh';
        root.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      }
    };

    setPiBrowserVH();
    window.addEventListener('resize', setPiBrowserVH);
    window.addEventListener('orientationchange', setPiBrowserVH);
    
    // Force repaint after a short delay
    setTimeout(setPiBrowserVH, 100);
    setTimeout(setPiBrowserVH, 500);
    setTimeout(setPiBrowserVH, 1000);
  }

  private handlePiBrowserErrors(): void {
    // Prevent Pi Browser specific errors
    window.addEventListener('error', (event) => {
      // Prevent common Pi Browser errors
      if (event.message.includes('Pi') || 
          event.message.includes('pi-sdk') ||
          event.message.includes('ResizeObserver') ||
          event.message.includes('IntersectionObserver')) {
        console.warn('Pi Browser error caught:', event.message);
        event.preventDefault();
        return false;
      }
    });

    // Handle Pi Browser specific unhandled rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.warn('Pi Browser unhandled rejection:', event.reason);
      event.preventDefault();
    });
  }

  private addPiBrowserStyles(): void {
    // Add Pi Browser specific styles
    const style = document.createElement('style');
    style.textContent = `
      .pi-browser {
        transform: translateZ(0);
        -webkit-transform: translateZ(0);
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
        min-height: 100dvh;
      }
      
      .pi-browser body {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
        min-height: 100dvh;
        overflow-x: hidden;
      }
      
      .pi-browser #root {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
        min-height: 100dvh;
        display: flex;
        flex-direction: column;
      }
      
      @media screen and (max-width: 768px) {
        .pi-browser body {
          position: fixed;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .pi-browser #root {
          height: 100vh;
          height: 100dvh;
          overflow-y: auto;
          overflow-x: hidden;
          -webkit-overflow-scrolling: touch;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
      }
    `;
    document.head.appendChild(style);
  }

  private fixViewportHeight(): void {
    // Fix for mobile browsers that don't handle 100vh correctly
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);
  }

  private preventDoubleTapZoom(): void {
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (event) => {
      const now = (new Date()).getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    }, false);
  }

  private preventPullToRefresh(): void {
    let startY = 0;
    let currentY = 0;

    document.addEventListener('touchstart', (event) => {
      startY = event.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchmove', (event) => {
      currentY = event.touches[0].clientY;
      const diff = startY - currentY;

      // Prevent pull-to-refresh when scrolling up
      if (diff < 0 && window.scrollY === 0) {
        event.preventDefault();
      }
    }, { passive: false });
  }

  private fixTouchScrolling(): void {
    // Enable smooth scrolling on mobile
    document.documentElement.style.setProperty('-webkit-overflow-scrolling', 'touch');
    
    // Fix for iOS Safari momentum scrolling
    const elements = document.querySelectorAll('.mobile-scroll');
    elements.forEach(element => {
      (element as HTMLElement).style.setProperty('-webkit-overflow-scrolling', 'touch');
    });
  }

  private handleOrientationChange(): void {
    window.addEventListener('orientationchange', () => {
      // Force a repaint after orientation change
      setTimeout(() => {
        window.scrollTo(0, 0);
        document.body.style.height = '100vh';
        document.body.style.height = '100dvh';
      }, 100);
    });
  }

  private fixSafeArea(): void {
    // Add safe area support for devices with notches
    const style = document.createElement('style');
    style.textContent = `
      .safe-area-top {
        padding-top: env(safe-area-inset-top);
      }
      .safe-area-bottom {
        padding-bottom: env(safe-area-inset-bottom);
      }
      .safe-area-left {
        padding-left: env(safe-area-inset-left);
      }
      .safe-area-right {
        padding-right: env(safe-area-inset-right);
      }
    `;
    document.head.appendChild(style);
  }

  // Public methods
  public isMobileDevice(): boolean {
    return this.isMobile;
  }

  public isPiBrowserDevice(): boolean {
    return this.isPiBrowser;
  }

  public addMobileClass(): void {
    if (this.isMobile) {
      document.body.classList.add('mobile-device');
    }
    if (this.isPiBrowser) {
      document.body.classList.add('pi-browser');
    }
  }

  public handleMobileErrors(): void {
    // Prevent common mobile errors from breaking the app
    window.addEventListener('error', (event) => {
      // Prevent Pi SDK errors from breaking the app
      if (event.message.includes('Pi') || event.message.includes('pi-sdk')) {
        console.warn('Pi SDK error caught:', event.message);
        event.preventDefault();
        return false;
      }

      // Prevent other common mobile errors
      if (event.message.includes('ResizeObserver') || 
          event.message.includes('IntersectionObserver')) {
        console.warn('Observer error caught:', event.message);
        event.preventDefault();
        return false;
      }
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.warn('Unhandled promise rejection:', event.reason);
      event.preventDefault();
    });
  }

  public optimizeForMobile(): void {
    if (!this.isMobile) return;

    // Reduce animations on mobile for better performance
    const style = document.createElement('style');
    style.textContent = `
      @media (max-width: 768px) {
        * {
          animation-duration: 0.3s !important;
          transition-duration: 0.2s !important;
        }
        
        .animate-spin {
          animation-duration: 1s !important;
        }
      }
    `;
    document.head.appendChild(style);

    // Disable hover effects on mobile
    document.body.classList.add('no-hover');
  }

  public showMobileLoadingScreen(): void {
    if (!this.isMobile) return;

    const loadingScreen = document.createElement('div');
    loadingScreen.id = 'mobile-loading-screen';
    loadingScreen.className = 'loading-screen';
    loadingScreen.innerHTML = `
      <div class="text-center text-white">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
        <h1 class="text-2xl font-bold mb-2">Salenus AI</h1>
        <p class="text-lg opacity-90">Loading your AI coach...</p>
        <div class="mt-4 text-sm opacity-75">
          <div class="loading-dots">Initializing</div>
        </div>
      </div>
    `;

    document.body.appendChild(loadingScreen);
  }

  public hideMobileLoadingScreen(): void {
    const loadingScreen = document.getElementById('mobile-loading-screen');
    if (loadingScreen) {
      loadingScreen.remove();
    }
  }

  public getMobileInfo(): { isMobile: boolean; isPiBrowser: boolean; userAgent: string } {
    return {
      isMobile: this.isMobile,
      isPiBrowser: this.isPiBrowser,
      userAgent: navigator.userAgent
    };
  }
}

// Export singleton instance
export const mobileUtils = MobileUtils.getInstance(); 