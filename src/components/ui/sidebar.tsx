import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { VariantProps, cva } from "class-variance-authority"
import { PanelLeft } from "lucide-react"
import { BarChart3, ClipboardList, Users, Cloud, Smartphone, Bell, Heart, Sparkles, Star, BookOpen, Camera, Trophy, Flame, MessageSquare, PieChart, Calendar, Shield, Lightbulb, GraduationCap, Globe, Settings, Search, X, ChevronRight, Keyboard, MousePointer, Monitor, Smartphone as MobileIcon, Home, Key } from 'lucide-react'

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useAuth } from '@/hooks/useAuth'
import { Badge } from '@/components/ui/badge'

const SIDEBAR_COOKIE_NAME = "sidebar:state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b"

type SidebarContext = {
  state: "expanded" | "collapsed"
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContext | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile()
    const [openMobile, setOpenMobile] = React.useState(false)

    // This is the internal state of the sidebar.
    // We use openProp and setOpenProp for control from outside the component.
    const [_open, _setOpen] = React.useState(defaultOpen)
    const open = openProp ?? _open
    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === "function" ? value(open) : value
        if (setOpenProp) {
          setOpenProp(openState)
        } else {
          _setOpen(openState)
        }

        // This sets the cookie to keep the sidebar state.
        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
      },
      [setOpenProp, open]
    )

    // Helper to toggle the sidebar.
    const toggleSidebar = React.useCallback(() => {
      return isMobile
        ? setOpenMobile((open) => !open)
        : setOpen((open) => !open)
    }, [isMobile, setOpen, setOpenMobile])

    // Adds a keyboard shortcut to toggle the sidebar.
    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault()
          toggleSidebar()
        }
      }

      window.addEventListener("keydown", handleKeyDown)
      return () => window.removeEventListener("keydown", handleKeyDown)
    }, [toggleSidebar])

    // We add a state so that we can do data-state="expanded" or "collapsed".
    // This makes it easier to style the sidebar with Tailwind classes.
    const state = open ? "expanded" : "collapsed"

    const contextValue = React.useMemo<SidebarContext>(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
    )

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH,
                "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                ...style,
              } as React.CSSProperties
            }
            className={cn(
              "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    )
  }
)
SidebarProvider.displayName = "SidebarProvider"

const allNavItems = [
  // Free features
  { name: 'Free Habit Preview', icon: <BarChart3 className="h-5 w-5" />, path: 'free-preview', feature: 'free_habit_preview', minPlan: 'Free' },
  { name: 'Pi Network Integration', icon: <Users className="h-5 w-5" />, path: 'pi-network', feature: 'pi_network_integration', minPlan: 'Free' },
  // Basic features
  { name: 'Habit Tracking', icon: <BarChart3 className="h-5 w-5" />, path: 'habits', feature: 'habit_tracking', minPlan: 'Basic' },
  { name: 'Task Management', icon: <ClipboardList className="h-5 w-5" />, path: 'tasks', feature: 'task_management', minPlan: 'Basic' },
  { name: 'Community Challenges', icon: <Users className="h-5 w-5" />, path: 'challenges', feature: 'community_challenges', minPlan: 'Basic' },
  { name: 'Cross-Platform Sync', icon: <Cloud className="h-5 w-5" />, path: 'sync', feature: 'cross_platform_sync', minPlan: 'Basic' },
  { name: 'Mobile App Access', icon: <Smartphone className="h-5 w-5" />, path: 'mobile', feature: 'mobile_app', minPlan: 'Basic' },
  { name: 'Basic Notifications', icon: <Bell className="h-5 w-5" />, path: 'notifications', feature: 'basic_notifications', minPlan: 'Basic' },
  // Pro features
  { name: 'Mood Tracker', icon: <Heart className="h-5 w-5" />, path: 'mood', feature: 'mood_tracking', minPlan: 'Pro' },
  { name: 'Advanced Goals', icon: <Star className="h-5 w-5" />, path: 'goals', feature: 'advanced_goals', minPlan: 'Pro' },
  { name: 'Habit Journal', icon: <BookOpen className="h-5 w-5" />, path: 'journal', feature: 'habit_journal', minPlan: 'Pro' },
  { name: 'Progress Photos', icon: <Camera className="h-5 w-5" />, path: 'photos', feature: 'progress_photos', minPlan: 'Pro' },
  { name: 'Custom Challenges', icon: <Trophy className="h-5 w-5" />, path: 'custom-challenges', feature: 'custom_challenges', minPlan: 'Pro' },
  { name: 'Streak Protection', icon: <Flame className="h-5 w-5" />, path: 'streak-protection', feature: 'streak_protection', minPlan: 'Pro' },
  { name: 'Smart Reminders', icon: <Bell className="h-5 w-5" />, path: 'smart-reminders', feature: 'smart_reminders', minPlan: 'Pro' },
  { name: 'Priority Support', icon: <MessageSquare className="h-5 w-5" />, path: 'support', feature: 'priority_support', minPlan: 'Pro' },
  // Premium features
  { name: 'AI Personal Coach', icon: <Sparkles className="h-5 w-5" />, path: 'ai-coach', feature: 'ai_coaching', minPlan: 'Premium' },
  { name: 'Advanced Analytics', icon: <PieChart className="h-5 w-5" />, path: 'analytics', feature: 'advanced_analytics', minPlan: 'Premium' },
  { name: 'Calendar Integration', icon: <Calendar className="h-5 w-5" />, path: 'calendar', feature: 'calendar_integration', minPlan: 'Premium' },
  { name: 'VIP Support', icon: <Shield className="h-5 w-5" />, path: 'vip-support', feature: 'vip_support', minPlan: 'Premium' },
  { name: 'Exclusive Features', icon: <Lightbulb className="h-5 w-5" />, path: 'exclusive', feature: 'exclusive_features', minPlan: 'Premium' },
  { name: 'Personalized Courses', icon: <GraduationCap className="h-5 w-5" />, path: 'courses', feature: 'personalized_courses', minPlan: 'Premium' },
  { name: 'API Access', icon: <Globe className="h-5 w-5" />, path: 'api', feature: 'api_access', minPlan: 'Premium' },
  { name: 'White-Label Options', icon: <Settings className="h-5 w-5" />, path: 'white-label', feature: 'white_label', minPlan: 'Premium' },
];

export const Sidebar = ({ 
  onLockedFeatureClick, 
  userPlan = 'Free',
  userPlanExpiry = null
}: { 
  onLockedFeatureClick?: (feature: string, minPlan: string) => void;
  userPlan?: string;
  userPlanExpiry?: Date | null;
}) => {
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [focusedIndex, setFocusedIndex] = React.useState(-1);

  // Check if user has access to a specific plan level
  const hasPlanAccess = (requiredPlan: string) => {
    const planHierarchy = { 'Free': 0, 'Basic': 1, 'Pro': 2, 'Premium': 3 };
    const userPlanLevel = planHierarchy[userPlan] || 0;
    const requiredPlanLevel = planHierarchy[requiredPlan] || 0;
    return userPlanLevel >= requiredPlanLevel;
  };

  // Filter items based on search
  const filteredItems = allNavItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex(prev => Math.min(prev + 1, filteredItems.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        event.preventDefault();
        if (focusedIndex >= 0) {
          const item = filteredItems[focusedIndex];
          if (hasPlanAccess(item.minPlan)) {
            window.location.href = `#${item.path}`;
          } else {
            onLockedFeatureClick?.(item.feature, item.minPlan);
          }
        }
        break;
      case 'Escape':
        setSearchQuery('');
        setFocusedIndex(-1);
        break;
    }
  };

  return (
    <aside className="h-screen w-64 bg-white border-r border-slate-200 flex flex-col shadow-lg">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between gap-3 px-6 py-6 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img src="/logo.png" alt="Salenus AI Logo" className="h-10 w-10 rounded-full" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <span className="font-heading text-xl font-bold text-navy-900">Salenus A.I</span>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-xs">
                {userPlan} Plan
              </Badge>
              {isMobile && (
                <Badge variant="secondary" className="text-xs">
                  <MobileIcon className="h-3 w-3 mr-1" />
                  Mobile
                </Badge>
              )}
            </div>
          </div>
        </div>
        
        {/* Mobile Close Button */}
        {isMobile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {/* Enhanced Plan indicator */}
      <div className="px-6 py-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700">{userPlan} Plan</span>
            <div className="flex items-center gap-1">
              {isMobile ? (
                <MobileIcon className="h-3 w-3 text-slate-400" />
              ) : (
                <Monitor className="h-3 w-3 text-slate-400" />
              )}
            </div>
          </div>
          {userPlan !== 'Premium' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onLockedFeatureClick && onLockedFeatureClick('upgrade', userPlan === 'Free' ? 'Basic' : userPlan === 'Basic' ? 'Pro' : 'Premium')}
              className="text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              Upgrade
            </Button>
          )}
        </div>
        {userPlanExpiry && userPlan !== 'Free' && (
          <div className="mt-2 text-xs text-slate-500">
            Expires: {userPlanExpiry.toLocaleDateString()}
            {new Date(userPlanExpiry) < new Date() && (
              <span className="ml-2 text-red-500 font-medium">(Expired)</span>
            )}
          </div>
        )}
      </div>

      {/* Enhanced Search Bar */}
      <div className="px-4 py-3 border-b border-slate-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search features..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-10 pr-4 h-9 text-sm"
          />
        </div>
      </div>
      {/* Home Button */}
      <div className="px-4 pt-4">
        <button
          className="flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all duration-200 sidebar-item w-full text-left text-slate-700 hover:bg-slate-100 mb-4"
          onClick={() => {
            window.location.href = '/';
            if (isMobile) {
              // Try to close the drawer if possible
              const evt = new CustomEvent('closeSidebarDrawer');
              window.dispatchEvent(evt);
            }
          }}
        >
          <Home className="h-5 w-5" />
          <span>Home</span>
        </button>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {/* Free Features */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2 flex items-center gap-2">
            <span>Free Features</span>
            <Badge variant="secondary" className="text-xs">2</Badge>
          </h3>
          {filteredItems.filter(item => item.minPlan === 'Free').map((item, index) => {
            const locked = !hasPlanAccess(item.minPlan);
            const isFocused = focusedIndex === index;
            
            return (
              <div key={item.name} className="mb-1">
                {locked ? (
                  <Button
                    variant="ghost"
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-slate-400 cursor-pointer w-full hover:bg-slate-50 relative sidebar-item transition-all duration-200 ${
                      isFocused ? 'bg-slate-100 ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => onLockedFeatureClick && onLockedFeatureClick(item.feature, item.minPlan)}
                    onFocus={() => setFocusedIndex(index)}
                    onBlur={() => setFocusedIndex(-1)}
                  >
                    {item.icon}
                    <span className="flex-1 text-left">{item.name}</span>
                    <Key className="h-4 w-4 text-slate-300" />
                  </Button>
                ) : (
                  <button
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all duration-200 sidebar-item w-full text-left ${
                      isFocused ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-slate-700 hover:bg-slate-100'
                    } ${isFocused ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => {
                      if (onLockedFeatureClick) {
                        onLockedFeatureClick(item.name, item.path);
                      }
                    }}
                    onFocus={() => setFocusedIndex(index)}
                    onBlur={() => setFocusedIndex(-1)}
                  >
                    {item.icon}
                    <span className="flex-1">{item.name}</span>
                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Basic Features */}
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2 flex items-center gap-2">
            <span>Basic Features</span>
            <Badge variant="default" className="text-xs">6</Badge>
          </h3>
          {filteredItems.filter(item => item.minPlan === 'Basic').map((item, index) => {
            const locked = !hasPlanAccess(item.minPlan);
            const globalIndex = filteredItems.filter(i => i.minPlan === 'Free').length + index;
            const isFocused = focusedIndex === globalIndex;
            
            return (
              <div key={item.name} className="mb-1">
                {locked ? (
                  <Button
                    variant="ghost"
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-slate-400 cursor-pointer w-full hover:bg-slate-50 relative sidebar-item transition-all duration-200 ${
                      isFocused ? 'bg-slate-100 ring-2 ring-blue-500' : ''
                    }`}
                    onClick={() => onLockedFeatureClick && onLockedFeatureClick(item.feature, item.minPlan)}
                    onFocus={() => setFocusedIndex(globalIndex)}
                    onBlur={() => setFocusedIndex(-1)}
                  >
                    {item.icon}
                    <span className="flex-1 text-left">{item.name}</span>
                    <Key className="h-4 w-4 text-slate-300" />
                  </Button>
                ) : (
                  <button
                    className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all duration-200 sidebar-item w-full text-left ${
                      isFocused ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-slate-700 hover:bg-slate-100'
                    } ${isFocused ? 'ring-2 ring-blue-500' : ''}`}
                    onClick={() => {
                      if (onLockedFeatureClick) {
                        onLockedFeatureClick(item.name, item.path);
                      }
                    }}
                    onFocus={() => setFocusedIndex(globalIndex)}
                    onBlur={() => setFocusedIndex(-1)}
                  >
                    {item.icon}
                    <span className="flex-1 text-left">{item.name}</span>
                    <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Pro Features */}
        {hasPlanAccess('Pro') && (
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2 flex items-center gap-2">
              <span>Pro Features</span>
              <Badge variant="outline" className="text-xs">8</Badge>
            </h3>
            {filteredItems.filter(item => item.minPlan === 'Pro').map((item, index) => {
              const locked = !hasPlanAccess(item.minPlan);
              const globalIndex = filteredItems.filter(i => ['Free', 'Basic'].includes(i.minPlan)).length + index;
              const isFocused = focusedIndex === globalIndex;
              
              return (
                <div key={item.name} className="mb-1">
                  {locked ? (
                    <Button
                      variant="ghost"
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-slate-400 cursor-pointer w-full hover:bg-slate-50 relative sidebar-item transition-all duration-200 ${
                        isFocused ? 'bg-slate-100 ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => onLockedFeatureClick && onLockedFeatureClick(item.feature, item.minPlan)}
                      onFocus={() => setFocusedIndex(globalIndex)}
                      onBlur={() => setFocusedIndex(-1)}
                    >
                      {item.icon}
                      <span className="flex-1 text-left">{item.name}</span>
                      <Key className="h-4 w-4 text-slate-300" />
                    </Button>
                  ) : (
                    <button
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all duration-200 sidebar-item w-full text-left ${
                        isFocused ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-slate-700 hover:bg-slate-100'
                      } ${isFocused ? 'ring-2 ring-blue-500' : ''}`}
                      onClick={() => {
                        if (onLockedFeatureClick) {
                          onLockedFeatureClick(item.name, item.path);
                        }
                      }}
                      onFocus={() => setFocusedIndex(globalIndex)}
                      onBlur={() => setFocusedIndex(-1)}
                    >
                      {item.icon}
                      <span className="flex-1 text-left">{item.name}</span>
                      <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Premium Features */}
        {hasPlanAccess('Premium') && (
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2 flex items-center gap-2">
              <span>Premium Features</span>
              <Badge variant="default" className="text-xs">8</Badge>
            </h3>
            {filteredItems.filter(item => item.minPlan === 'Premium').map((item, index) => {
              const locked = !hasPlanAccess(item.minPlan);
              const globalIndex = filteredItems.filter(i => ['Free', 'Basic', 'Pro'].includes(i.minPlan)).length + index;
              const isFocused = focusedIndex === globalIndex;
              
              return (
                <div key={item.name} className="mb-1">
                  {locked ? (
                    <Button
                      variant="ghost"
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-slate-400 cursor-pointer w-full hover:bg-slate-50 relative sidebar-item transition-all duration-200 ${
                        isFocused ? 'bg-slate-100 ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => onLockedFeatureClick && onLockedFeatureClick(item.feature, item.minPlan)}
                      onFocus={() => setFocusedIndex(globalIndex)}
                      onBlur={() => setFocusedIndex(-1)}
                    >
                      {item.icon}
                      <span className="flex-1 text-left">{item.name}</span>
                      <Key className="h-4 w-4 text-slate-300" />
                    </Button>
                  ) : (
                    <button
                      className={`flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition-all duration-200 sidebar-item w-full text-left ${
                        isFocused ? 'bg-blue-100 text-blue-700 shadow-sm' : 'text-slate-700 hover:bg-slate-100'
                      } ${isFocused ? 'ring-2 ring-blue-500' : ''}`}
                      onClick={() => {
                        if (onLockedFeatureClick) {
                          onLockedFeatureClick(item.name, item.path);
                        }
                      }}
                      onFocus={() => setFocusedIndex(globalIndex)}
                      onBlur={() => setFocusedIndex(-1)}
                    >
                      {item.icon}
                      <span className="flex-1 text-left">{item.name}</span>
                      <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Show locked Pro/Premium features for lower plans */}
        {!hasPlanAccess('Pro') && (
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2 flex items-center gap-2">
              <span>Pro Features</span>
              <Badge variant="outline" className="text-xs">8</Badge>
            </h3>
            {filteredItems.filter(item => item.minPlan === 'Pro').slice(0, 3).map((item, index) => (
              <Button
                key={item.name}
                variant="ghost"
                className="flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-slate-400 cursor-pointer w-full hover:bg-slate-50 relative sidebar-item transition-all duration-200"
                onClick={() => onLockedFeatureClick && onLockedFeatureClick(item.feature, item.minPlan)}
              >
                {item.icon}
                <span className="flex-1 text-left">{item.name}</span>
                <Key className="h-4 w-4 text-slate-300" />
              </Button>
            ))}
            <Button
              variant="ghost"
              className="flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-blue-600 cursor-pointer w-full hover:bg-blue-50 sidebar-item transition-all duration-200"
              onClick={() => onLockedFeatureClick && onLockedFeatureClick('upgrade', 'Pro')}
            >
              <Sparkles className="h-4 w-4" />
              <span className="flex-1 text-left">Upgrade to Pro</span>
            </Button>
          </div>
        )}

        {!hasPlanAccess('Premium') && (
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2 flex items-center gap-2">
              <span>Premium Features</span>
              <Badge variant="default" className="text-xs">8</Badge>
            </h3>
            {filteredItems.filter(item => item.minPlan === 'Premium').slice(0, 3).map((item, index) => (
              <Button
                key={item.name}
                variant="ghost"
                className="flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-slate-400 cursor-pointer w-full hover:bg-slate-50 relative sidebar-item transition-all duration-200"
                onClick={() => onLockedFeatureClick && onLockedFeatureClick(item.feature, item.minPlan)}
              >
                {item.icon}
                <span className="flex-1 text-left">{item.name}</span>
                <Key className="h-4 w-4 text-slate-300" />
              </Button>
            ))}
            <Button
              variant="ghost"
              className="flex items-center gap-3 px-4 py-2 rounded-lg font-medium text-purple-600 cursor-pointer w-full hover:bg-purple-50 sidebar-item transition-all duration-200"
              onClick={() => onLockedFeatureClick && onLockedFeatureClick('upgrade', 'Premium')}
            >
              <Sparkles className="h-4 w-4" />
              <span className="flex-1 text-left">Upgrade to Premium</span>
            </Button>
          </div>
        )}
      </nav>

      {/* Enhanced Footer */}
      <div className="px-4 py-3 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            {isMobile ? (
              <>
                <MobileIcon className="h-3 w-3" />
                <span>Mobile View</span>
              </>
            ) : (
              <>
                <Monitor className="h-3 w-3" />
                <span>Desktop View</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Keyboard className="h-3 w-3" />
            <span>⌘B</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      ref={ref}
      data-sidebar="trigger"
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7", className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <PanelLeft />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

const SidebarRail = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar()

  return (
    <button
      ref={ref}
      data-sidebar="rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        "absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex",
        "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className
      )}
      {...props}
    />
  )
})
SidebarRail.displayName = "SidebarRail"

const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"main">
>(({ className, ...props }, ref) => {
  return (
    <main
      ref={ref}
      className={cn(
        "relative flex min-h-svh flex-1 flex-col bg-background",
        "peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow",
        className
      )}
      {...props}
    />
  )
})
SidebarInset.displayName = "SidebarInset"

const SidebarInput = React.forwardRef<
  React.ElementRef<typeof Input>,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      data-sidebar="input"
      className={cn(
        "h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
        className
      )}
      {...props}
    />
  )
})
SidebarInput.displayName = "SidebarInput"

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="header"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="footer"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  )
})
SidebarFooter.displayName = "SidebarFooter"

const SidebarSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentProps<typeof Separator>
>(({ className, ...props }, ref) => {
  return (
    <Separator
      ref={ref}
      data-sidebar="separator"
      className={cn("mx-2 w-auto bg-sidebar-border", className)}
      {...props}
    />
  )
})
SidebarSeparator.displayName = "SidebarSeparator"

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarContent.displayName = "SidebarContent"

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
      {...props}
    />
  )
})
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "div"

  return (
    <Comp
      ref={ref}
      data-sidebar="group-label"
      className={cn(
        "duration-200 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opa] ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className
      )}
      {...props}
    />
  )
})
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarGroupAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={ref}
      data-sidebar="group-action"
      className={cn(
        "absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarGroupAction.displayName = "SidebarGroupAction"

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="group-content"
    className={cn("w-full text-sm", className)}
    {...props}
  />
))
SidebarGroupContent.displayName = "SidebarGroupContent"

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu"
    className={cn("flex w-full min-w-0 flex-col gap-1", className)}
    {...props}
  />
))
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-sidebar="menu-item"
    className={cn("group/menu-item relative", className)}
    {...props}
  />
))
SidebarMenuItem.displayName = "SidebarMenuItem"

const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:!p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    isActive?: boolean
    tooltip?: string | React.ComponentProps<typeof TooltipContent>
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(
  (
    {
      asChild = false,
      isActive = false,
      variant = "default",
      size = "default",
      tooltip,
      className,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : "button"
    const { isMobile, state } = useSidebar()

    const button = (
      <Comp
        ref={ref}
        data-sidebar="menu-button"
        data-size={size}
        data-active={isActive}
        className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
        {...props}
      />
    )

    if (!tooltip) {
      return button
    }

    if (typeof tooltip === "string") {
      tooltip = {
        children: tooltip,
      }
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          side="right"
          align="center"
          hidden={state !== "collapsed" || isMobile}
          {...tooltip}
        />
      </Tooltip>
    )
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"

const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    showOnHover?: boolean
  }
>(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-action"
      className={cn(
        "absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 after:md:hidden",
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        "group-data-[collapsible=icon]:hidden",
        showOnHover &&
          "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuAction.displayName = "SidebarMenuAction"

const SidebarMenuBadge = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar="menu-badge"
    className={cn(
      "absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground select-none pointer-events-none",
      "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
      "peer-data-[size=sm]/menu-button:top-1",
      "peer-data-[size=default]/menu-button:top-1.5",
      "peer-data-[size=lg]/menu-button:top-2.5",
      "group-data-[collapsible=icon]:hidden",
      className
    )}
    {...props}
  />
))
SidebarMenuBadge.displayName = "SidebarMenuBadge"

const SidebarMenuSkeleton = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    showIcon?: boolean
  }
>(({ className, showIcon = false, ...props }, ref) => {
  // Random width between 50 to 90%.
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`
  }, [])

  return (
    <div
      ref={ref}
      data-sidebar="menu-skeleton"
      className={cn("rounded-md h-8 flex gap-2 px-2 items-center", className)}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="size-4 rounded-md"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        className="h-4 flex-1 max-w-[--skeleton-width]"
        data-sidebar="menu-skeleton-text"
        style={
          {
            "--skeleton-width": width,
          } as React.CSSProperties
        }
      />
    </div>
  )
})
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton"

const SidebarMenuSub = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar="menu-sub"
    className={cn(
      "mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5",
      "group-data-[collapsible=icon]:hidden",
      className
    )}
    {...props}
  />
))
SidebarMenuSub.displayName = "SidebarMenuSub"

const SidebarMenuSubItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ ...props }, ref) => <li ref={ref} {...props} />)
SidebarMenuSubItem.displayName = "SidebarMenuSubItem"

const SidebarMenuSubButton = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<"a"> & {
    asChild?: boolean
    size?: "sm" | "md"
    isActive?: boolean
  }
>(({ asChild = false, size = "md", isActive, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        "flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuSubButton.displayName = "SidebarMenuSubButton"

export {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
}
