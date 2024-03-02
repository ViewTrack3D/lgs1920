import { icon, library } from '@fortawesome/fontawesome-svg-core'
import { Canvg }         from 'canvg'
import * as Cesium       from 'cesium'

// Pin Marker Type
export const PIN_ICON = 1
export const PIN_TEXT = 2
export const PIN_COLOR = 3
//Other paths
export const PIN_CIRCLE = 4
export const JUST_ICON = 5

export const NO_MARKER_COLOR = 'transparent'

export class MarkerUtils {
    static draw = async (marker) => {

        let markerOptions = {
            name: marker.name,
            description: marker.description,
            position: Cesium.Cartesian3.fromDegrees(marker.coordinates[0], marker.coordinates[1], marker.coordinates[2]),
        }
        const pinBuilder = new Cesium.PinBuilder()

        markerOptions.billboard = {
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND, verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
        }

        const backgroundColor = Cesium.Color.fromCssColorString(marker.backgroundColor)
        const foregroundColor = marker.foregroundColor ? Cesium.Color.fromCssColorString(marker.foregroundColor) : undefined

        let entity

        switch (marker.type) {
            case PIN_CIRCLE:
                entity = vt3d.viewer.entities.add({
                    point: {
                        position: Cesium.Cartesian3.fromDegrees(marker.coordinates[0], marker.coordinates[1]),
                        backgroundPadding: Cesium.Cartesian2(8, 4),
                        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                        disableDepthTestDistance: Number.POSITIVE_INFINITY,
                        color: marker.backgroundColor,
                        pixelSize: marker.size,
                        outlineColor: marker.foregroundColor,
                        outlineWidth: marker.border,
                    },
                })
                break
            case PIN_COLOR:
                markerOptions.billboard.image = pinBuilder.fromColor(backgroundColor, marker.size).toDataURL()
                entity = await vt3d.viewer.entities.add(markerOptions)
                break
            case PIN_TEXT:
                markerOptions.billboard.image = pinBuilder.fromText(marker.text, backgroundColor, marker.size).toDataURL()
                entity = await vt3d.viewer.entities.add(markerOptions)
                break
            case PIN_ICON:
                pinBuilder.fromUrl(MarkerUtils.useFontAwesome(marker).src, backgroundColor, marker.size).then(async image => {
                    markerOptions.billboard.image = image
                    entity = await vt3d.viewer.entities.add(markerOptions)
                })
                break
            case JUST_ICON:
                MarkerUtils.useOnlyFontAwesome(marker).then(async canvas => {
                    markerOptions.billboard.image = canvas
                    entity = await vt3d.viewer.entities.add(markerOptions)
                })
                break
        }

        return entity
    }
    static useFontAwesome = (marker) => {
        library.add(marker.icon)
        const html = icon(marker.icon).html[0]
        // Get SVG
        const svg = (new DOMParser()).parseFromString(html, 'image/svg+xml').querySelector('svg')
        // add foreground
        svg.querySelector('path').setAttribute('fill', marker.foregroundColor)
        if (marker.backgroundColor !== NO_MARKER_COLOR) {
            // add background
            const rectangle = document.createElement('rect')
            rectangle.setAttribute('rx', 10)
            rectangle.setAttribute('ry', 10)
            rectangle.setAttribute('width', '100%')
            rectangle.setAttribute('height', '100%')
            rectangle.setAttribute('fill', marker.backgroundColor)
            svg.insertBefore(rectangle, svg.firstChild)
        }
        
        return {
            src: `data:image/svg+xml,${encodeURIComponent(svg.outerHTML)}`,
            html: svg.outerHTML,
            width: svg.viewBox.baseVal.width,
            height: svg.viewBox.baseVal.height,
        }
    }

    static useOnlyFontAwesome = async (marker) => {
        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        context.imageSmoothingEnabled = true
        context.imageSmoothingQuality = 'high'
        const image = MarkerUtils.useFontAwesome(marker)
        const ratio = image.height / image.width
        canvas.width = marker.size * (ratio > 1 ? 1 : ratio)
        canvas.height = marker.size * (ratio > 1 ? ratio : 1)
        const v = Canvg.fromString(context, MarkerUtils.useFontAwesome(marker).html)
        v.start()
        return canvas
    }
}