"use client";

import { useState } from "react";
import { StopSearch } from "@/components/stop-search";
import { SavedStops } from "@/components/saved-stops";
import { NearestStopsDialog } from "@/components/nearest-stops-dialog";
import { RouteSearch } from "@/components/route-search";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HomePage() {
  const [nearestOpen, setNearestOpen] = useState(false);

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-6 px-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            UIUC Bus Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="stop">
            <TabsList variant="line" className="mb-4 w-full">
              <TabsTrigger value="stop">Stop</TabsTrigger>
              <TabsTrigger value="route">Origin → Destination</TabsTrigger>
            </TabsList>

            <TabsContent value="stop" className="space-y-4">
              <StopSearch onNearestClick={() => setNearestOpen(true)} />
            </TabsContent>

            <TabsContent value="route" className="space-y-4">
              <RouteSearch />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <SavedStops />

      <NearestStopsDialog open={nearestOpen} onOpenChange={setNearestOpen} />
    </div>
  );
}
