import './style.css'
import { TextValueUI } from '@Components/TextValueUI/TextValueUI.jsx'

import { faAngle, faCompass, faMountains, faVideo }         from '@fortawesome/pro-regular-svg-icons'
import { SlAnimation, SlButton, SlCard, SlIcon, SlTooltip } from '@shoelace-style/shoelace/dist/react'
import { CameraUtils }                                      from '@Utils/cesium/CameraUtils'
import { FA2SL }                                            from '@Utils/FA2SL'
import { forwardRef }                                       from 'react'
import { useCesium }                                        from 'resium'
import { useSnapshot }                                      from 'valtio'
import { meter, mile }                                      from '../../../Utils/UnitUtils'


export const CameraPositionUI = forwardRef(function CameraPositionUI(props, ref) {
    vt3d.viewer = useCesium().viewer

    const cameraStore = vt3d.mainProxy.components.camera
    const cameraSnap = useSnapshot(cameraStore)

    const toggle = () => {
        // Update camera info
        if (!cameraStore.show) {
            cameraStore.show = !cameraStore.show
            CameraUtils.updateCamera(vt3d?.camera).then(data => {
                if (data !== undefined) {
                    cameraStore.position = data
                }
            })
            return
        }
        cameraStore.show = false

    }


    return (
        <div id="camera-position" ref={ref}>
            <SlTooltip placement={'right'} content="Show real time camera information">

                <SlButton size={'small'} className={'square-icon'} onClick={toggle}><SlIcon library="fa"
                                                                                            name={FA2SL.set(faVideo)}></SlIcon></SlButton>
            </SlTooltip>

            {cameraSnap.show &&
                <SlAnimation size="small" easing="bounceInLeft" duration={1000} iterations={1}
                             play={cameraSnap.show}
                             onSlFinish={() => toggle()}>
                    <SlCard id="camera-data-panel" ref={ref} open={cameraSnap.show}>
                        <sl-icon library="fa" name={FA2SL.set(faCompass)}></sl-icon>
                        <TextValueUI value={cameraSnap.position.longitude.toFixed(5)}
                                     id={'camera-longitude'}
                                     text={'Lon:'}/>
                        <TextValueUI value={cameraSnap.position.latitude.toFixed(5)}
                                     id={'camera-latitude'}
                                     text={'Lat:'}/>
                        <sl-icon library="fa" name={FA2SL.set(faAngle)}></sl-icon>
                        <TextValueUI value={cameraSnap.position.heading.toFixed()}
                                     id={'camera-heading'} text={'Heading:'} units={'°'}/>
                        <TextValueUI value={(cameraSnap.position.pitch).toFixed()}
                                     id={'camera-pitch'} text={'Pitch:'} units={'°'}/>
                        <sl-icon library="fa" name={FA2SL.set(faMountains)}></sl-icon>
                        <TextValueUI value={cameraSnap.position.altitude.toFixed()}
                                     id={'camera-altitude'}
                                     units={[meter, mile]}/>
                    </SlCard>
                </SlAnimation>
            }
        </div>
    )

})

