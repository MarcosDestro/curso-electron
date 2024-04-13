export function TrafficLightBar() {
    const api = window.api;

    return (
        <div className="flex gap-3 p-2 top-4 ml-4 region-no-drag fixed z-50">
            <button
                // onClick={() => api.closeApp()}
                onClick={() => window.electron.ipcRenderer.send("closeApp")}
                style={{ backgroundColor: "#f64f58", width: 16, height: 16, borderRadius: "50%" }}>
            </button>

            <button
                // onClick={() => api.maximizeApp()}
                onClick={() => window.electron.ipcRenderer.send("maximizeApp")}
                style={{ backgroundColor: "#e1c53d", width: 16, height: 16, borderRadius: "50%" }}>
            </button>

            <button
                // onClick={() => api.minimizeApp()}
                onClick={() => window.electron.ipcRenderer.send("minimizeApp")}
                style={{ backgroundColor: "#58ca36", width: 16, height: 16, borderRadius: "50%" }}>
            </button>
        </div>
    )
}
