import { CameraUtils } from '../../Utils/cesium/CameraUtils.js'

export class Camera {
    static CLOCKWISE = true
    static MOVE_EVENT = 'camera/move'
    static UPDATE_EVENT = 'camera/update'

    starter = {}
    heading
    pitch
    roll
    range
    target = {}

    constructor(settings) {

        // Singleton
        if (!!Camera.instance) {
            return Camera.instance
        }

        this.target.longitude = settings?.target?.longitude ?? vt3d.configuration.starter.longitude
        this.target.latitude = settings?.target?.latitude ?? vt3d.configuration.starter.latitude
        this.target.height = settings?.target?.height ?? vt3d.configuration.starter.height

        this.longitude = undefined
        this.latitude = undefined
        this.height = undefined

        this.heading = settings?.heading ?? vt3d.configuration.camera.heading
        this.pitch = settings?.pitch ?? vt3d.configuration.camera.pitch
        this.roll = settings?.roll ?? vt3d.configuration.camera.roll
        this.range = settings?.range ?? vt3d.configuration.camera.range
        this.clockwise = Camera.CLOCKWISE

        Camera.instance = this

    }

    run360 = () => {
        CameraUtils.run360(this)
        return this.update()
    }

    stop360 = () => {
        vt3d.stop360()
    }

    update = async (data = null) => {
        data = (data === null) ? await CameraUtils.updateCamera() : data[0]
        if (data) {
            this.target = {
                longitude: data.target.longitude,
                latitude: data.target.latitude,
                height: data.target.height,
            }
            this.longitude = data.longitude
            this.latitude = data.latitude
            this.height = data.height
            this.heading = data.heading
            this.pitch = data.pitch
            this.roll = data.roll
            this.range = data.range
        } else {
            this.reset()
        }

        vt3d.events.emit(Camera.UPDATE_EVENT)
        return this

    }

    /**
     * Get the data of the camera instance
     */
    get = () => {
        return {
            target: {
                longitude: this.target.longitude,
                latitude: this.target.latitude,
                height: this.target.height,
            },
            longitude: this.longitude,
            latitude: this.latitude,
            height: this.height,
            heading: this.heading,
            pitch: this.pitch,
            roll: this.roll,
            range: this.range,
        }
    }

    reset = () => {
        this.target = {
            longitude: vt3d.configuration.starter.longitude,
            latitude: vt3d.configuration.starter.latitude,
            height: vt3d.configuration.starter.height,
        }
        this.longitude = undefined
        this.latitude = undefined
        this.height = undefined
        this.heading = vt3d.configuration.camera.heading
        this.pitch = vt3d.configuration.camera.pitch
        this.roll = vt3d.configuration.camera.roll
        this.range = vt3d.configuration.camera.range

        return this
    }

}
