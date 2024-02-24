export class TracksEditorUtils {

    /**
     * We change its key to rerender the list component
     */
    static reRenderTracksList = () => {
        vt3d.mainProxy.components.tracksEditor.trackListKey++
    }

    static reRenderTrackSettings = () => {
        vt3d.mainProxy.components.tracksEditor.trackSettingsKey++
    }


    static prepareTrackEdition = (event) => {
        // SUbscribe to change  https://valtio.pmnd.rs/docs/api/advanced/subscribe
        console.log('prepare')
        if (isOK(event)) {
            vt3d.editorProxy.track = vt3d.getTrackBySlug(event.target.value)
            TracksEditorUtils.reRenderTrackSettings()
        }
    }

}