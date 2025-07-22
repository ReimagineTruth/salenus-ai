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
    
    console.log('Device detection:', {
      isMobile: this.isMobile,
      isPiBrowser: this.isPiBrowser,
      userAgent: navigator.userAgent
    });
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
    document.documentElement.style.webkitOverflowScrolling = 'touch';
    
    // Fix for iOS Safari momentum scrolling
    const elements = document.querySelectorAll('.mobile-scroll');
    elements.forEach(element => {
      (element as HTMLElement).style.webkitOverflowScrolling = 'touch';
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