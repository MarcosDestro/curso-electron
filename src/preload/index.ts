import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { IPC } from "../shared/constants/ipc";
import {
  CreateDocumentResponse,
  DeleteDocumentRequest,
  FetchAllDocumentsResponse,
  FetchDocumentRequest,
  FetchDocumentResponse,
  SaveDocumentRequest }
  from "../shared/types/ipc";

// Custom APIs for renderer
export const api = {

  fetchDocuments(): Promise<FetchAllDocumentsResponse>{
    return ipcRenderer.invoke(IPC.DOCUMENTS.FETCH_ALL);
  },

  fetchDocument(req: FetchDocumentRequest): Promise<FetchDocumentResponse> {
    return ipcRenderer.invoke(IPC.DOCUMENTS.FETCH, req);
  },

  createDocument(): Promise<CreateDocumentResponse>{
    return ipcRenderer.invoke(IPC.DOCUMENTS.CREATE);
  },

  saveDocument(req: SaveDocumentRequest): Promise<void>{
    return ipcRenderer.invoke(IPC.DOCUMENTS.SAVE, req);
  },

  deleteDocument(req: DeleteDocumentRequest): Promise<void>{
    return ipcRenderer.invoke(IPC.DOCUMENTS.DELETE, req);
  }


  /* Pontes de comunicação
    closeApp(){
      return ipcRenderer.send("closeApp");
    },
    maximizeApp(){
      return ipcRenderer.send("maximizeApp");
    },
    minimizeApp(){
      return ipcRenderer.send("minimizeApp");
    }
  */
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
