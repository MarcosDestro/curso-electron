import * as Collapsible from "@radix-ui/react-collapsible";
import { Header } from "@renderer/components/Header";
import { Sidebar } from "@renderer/components/Sidebar";
import { TrafficLightBar } from "@renderer/components/Sidebar/TrafficLightBar";
import { useState } from "react";
import { Outlet } from "react-router-dom";

export function Default() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <>
            <TrafficLightBar />
            <Collapsible.Root
                defaultOpen
                onOpenChange={setIsSidebarOpen}
                className="h-screen w-screen bg-rotion-900 text-rotion-100 flex">
                <Sidebar />
                <div className="flex-1 flex flex-col max-h-screen">
                    <Header isSidebarOpen={isSidebarOpen} />
                    <Outlet />
                </div>
            </Collapsible.Root>
        </>
    )
}

