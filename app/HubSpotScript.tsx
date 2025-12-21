"use client";

import { useEffect } from "react";
import Script from "next/script";

/**
 * HubSpot CRM Integration Component
 * 
 * This component loads the HubSpot tracking script and prevents unload event listeners
 * from being registered by external scripts (like HubSpot) that could interfere with
 * page navigation.
 * 
 * Usage:
 * - Only rendered when privacy consent is given (see app/page.tsx)
 * - Automatically tracks visitor behavior
 * - Enables form submission handling
 * - Integrates with lead automation workflow
 * 
 * Environment Variable Required:
 * - HubSpot Portal ID should be updated in the script src
 * 
 * Related Files:
 * - app/page.tsx (lead submission logic)
 * - app/api/submit-lead.ts (server-side lead processing)
 */
export default function HubSpotScript() {
  useEffect(() => {
    // Skip if running in SSR/server environment
    if (typeof window === "undefined") return;

    /**
     * Event blocking configuration
     * 
     * We prevent 'beforeunload' and 'unload' event listeners from being registered
     * because HubSpot's tracking script may try to register these events, which can:
     * - Cause page navigation issues
     * - Show unwanted "Are you sure you want to leave?" prompts
     * - Interfere with Next.js navigation
     * 
     * The patch is temporary (reverted on cleanup) and only affects event listeners
     * added AFTER this component mounts.
     */
    const blockedEvents: Array<keyof WindowEventMap> = [
      "beforeunload",  // Triggered before page unload
      "unload"         // Triggered when page unloads
    ];
    
    const blockedProps = [
      "onbeforeunload",  // Property for beforeunload handler
      "onunload"         // Property for unload handler
    ] as const;

    // Store original addEventListener function
    const originalAddEventListener = window.addEventListener;

    /**
     * Patched addEventListener function
     * 
     * Intercepts addEventListener calls and blocks those targeting unload events.
     * All other event listeners pass through normally.
     */
    const patchedAddEventListener: typeof window.addEventListener = function (
      type,
      listener,
      options
    ) {
      // Check if this is a blocked event type
      if (blockedEvents.includes(type as keyof WindowEventMap)) {
        // Silently ignore the registration
        return;
      }
      // Allow all other event listeners
      return originalAddEventListener.call(
        this,
        type,
        listener as EventListenerOrEventListenerObject,
        options as boolean | AddEventListenerOptions | undefined
      );
    };

    // Apply the patch
    window.addEventListener = patchedAddEventListener;

    /**
     * Store original property descriptors
     * 
     * We save the original state of onbeforeunload and onunload properties
     * so we can restore them exactly when the component unmounts.
     * This ensures compatibility with other scripts that might depend on these properties.
     */
    const originalDescriptors = blockedProps.map((prop) => ({
      prop,
      descriptor: Object.getOwnPropertyDescriptor(window, prop),
    }));

    /**
     * Redefine blocked properties
     * 
     * We override onbeforeunload and onunload to prevent scripts from
     * being able to set these properties directly.
     * 
     * This getter/setter pattern:
     * - Returns null when accessed (transparent to scripts)
     * - Silently ignores attempts to set values
     * - Prevents "Are you sure?" dialogs from being triggered
     */
    blockedProps.forEach((prop) => {
      try {
        Object.defineProperty(window, prop, {
          configurable: true,        // Can be reconfigured later
          enumerable: false,         // Won't show in enumeration
          get: () => null,           // Always return null
          set: () => undefined,      // Ignore assignment attempts
        });
      } catch (error) {
        // Some browsers (especially in strict mode) may not allow
        // redefining these properties. We silently ignore these cases.
        // The fallback is that unload handlers may work, but that's acceptable.
      }
    });

    /**
     * Cleanup function
     * 
     * When the component unmounts (or on re-render), we restore everything
     * to its original state. This ensures:
     * - No memory leaks
     * - Other scripts aren't permanently affected
     * - The page behaves normally if this component is unmounted
     */
    return () => {
      // Restore original addEventListener function
      window.addEventListener = originalAddEventListener;
      
      // Restore original property descriptors
      originalDescriptors.forEach(({ prop, descriptor }) => {
        if (descriptor) {
          // Property existed before, restore it exactly
          Object.defineProperty(window, prop, descriptor);
        } else {
          // Property didn't exist before, delete it
          delete (window as any)[prop];
        }
      });
    };
  }, []); // Empty dependency array: run once on mount

  /**
   * HubSpot Tracking Script
   * 
   * This script loads the HubSpot tracking code from the CDN.
   * 
   * Parameters:
   * - id: Unique identifier for this Script component
   * - src: HubSpot tracking script URL (EU region: js-eu1)
   *   - Portal ID: 147219365 (Meridian Coastal Group portal)
   *   - Region: EU (js-eu1) for GDPR compliance
   * - strategy: 'lazyOnload' = load after page interactive
   * - async/defer: Let browser load asynchronously
   * 
   * Note: Portal ID should be updated when deploying to different HubSpot accounts
   * See .env.example for HUBSPOT_PORTAL_ID configuration
   */
  return (
    <Script
      id="hubspot-script"
      src="//js-eu1.hs-scripts.com/147219365.js"
      strategy="lazyOnload"
      async
      defer
    />
  );
}
