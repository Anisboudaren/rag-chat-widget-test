/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { BuildPageSkeleton } from '@/components/skeleton/EditPage';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function Page() {
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const handleSaveAndRedirect = () => {
    // TODO: Save customization request here
    // Example: await saveCustomization(customizationData);

    router.push(`/v1/agents/connect/${id}`);
  };

  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="relative pb-14">
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2 px-4 md:px-6">
            <div className="flex justify-between gap-4 py-4 md:gap-6 md:py-6">
              <div className="px-2">
                <h1 className="text-2xl font-semibold">Test Your AI Build</h1>
              </div>
            </div>

            {loading ? (
              <BuildPageSkeleton />
            ) : (
              <div className="flex h-full flex-col gap-4 md:flex-row">
                <div className="bg-sidebar flex w-full flex-col justify-between rounded-2xl border-[0.5px] border-gray-400 p-6 md:w-1/3">
                  <div>
                    <h2 className="mb-4 text-xl font-semibold">Customization</h2>
                    <p className="text-muted-foreground">
                      Customize your AI agent&apos;s appearance and behavior to match your brand.
                    </p>
                  </div>

                  {/* Save and Redirect Button at the bottom */}
                  <div className="mt-6">
                    <button
                      onClick={handleSaveAndRedirect}
                      className="bg-primary hover:bg-primary/90 w-full rounded-lg px-4 py-2 text-white"
                    >
                      Save & Continue to Connect
                    </button>
                  </div>
                </div>

                <div className="bg-sidebar flex w-full flex-col rounded-2xl border-[0.5px] border-gray-400 p-6 md:w-2/3">
                  <h2 className="mb-4 text-xl font-semibold">Preview</h2>
                  <div className="h-0 flex-grow">
                    <iframe
                      src={`/chat-preview.html?id=${id}`}
                      className="h-full w-full rounded-lg border"
                      title="Chat Preview"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
