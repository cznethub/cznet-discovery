<template>
  <v-card class="cd-spatial-coverage-map">
    <div ref="map" class="map-container">

    </div>
  </v-card>
</template>

<script lang="ts">
  import { Component, Vue, Prop, Ref } from 'vue-property-decorator'
  import { Loader, LoaderOptions } from "google-maps"

  @Component({
    name: 'cd-spatial-coverage-map',
    components: { },
  })
  export default class CdSpatialCoverageMap extends Vue {
    @Prop() value!: string
    @Prop() loader!: Loader
    @Prop() loaderOptions!: LoaderOptions

    @Ref('map') mapContainer
    protected map: google.maps.Map | null = null
    protected marker: google.maps.Marker | null = null
    protected rectangle: any = null
    protected markerOptions: google.maps.MarkerOptions = {}
    protected rectangleOptions: google.maps.RectangleOptions = {}
    protected mapType: 'point' | 'box' | 'shape' = 'point'

    async mounted() {
      await this.initMap()
      this.loadDrawing()
      if (this.map) {
        if (this.mapType === 'box') {
          // Zoom and center to rectangle
          (this.map as google.maps.Map).fitBounds(this.rectangle.bounds)
        }
        else {
          // Recenter at marker
          // (this.map as google.maps.Map).setCenter({
          //   lat: 0,
          //   lng: 0,
          // });
          if (this.marker) {
            (this.map as google.maps.Map).setCenter(this.marker.getPosition() as google.maps.LatLng);
          }
        }
      }
    }

    created() {

    }

    protected async initMap() {
      const google = await this.loader.load()

      this.map = new google.maps.Map(this.mapContainer, {
        center: { lat: 39.8097343, lng: -98.5556199 },
        zoom: 5,
      })

      // Icon base from: http://kml4earth.appspot.com/icons.html
      const iconBase = "http://earth.google.com/images/kml-icons/"
      const icons = {
        track_directional: {
          icon: iconBase + "track-directional/track-8.png",
        }
      }

      this.markerOptions = { 
        ...this.markerOptions, 
        // animation: google.maps.Animation.DROP,
        icon: {
          url: icons.track_directional.icon,
          anchor: new google.maps.Point(20, 35),
          scaledSize: new google.maps.Size(40, 40)
        }
      }

      this.rectangleOptions = {
        ...this.rectangleOptions,
        fillColor: "#1976d2",
        fillOpacity: 0.25,
        strokeWeight: 2,
        strokeColor: "#1976d2",
        editable: false,
        zIndex: 1,
        draggable: false,
      }
      
    }

    protected loadDrawing() {
      if (this.mapType === "point") {
        this.loadPoint()
      } else {
        // this.loadRectangle()
      }
    }

    protected clearMarkers() {
      if (this.marker) {
        this.marker.setMap(null);
        this.marker = null;
      }
    }

    protected loadPoint() {
      if (this.map) {
        this.clearMarkers()

        const marker = new google.maps.Marker({
          ...this.markerOptions,
          position: { lat: 0, lng: 0 },
          map: this.map,
        })
        
        this.marker = marker
      }
    }

    protected clearRectangles() {
      if (this.rectangle) {
        this.rectangle.setMap(null)
        this.rectangle = null;
      }
    }

    protected loadRectangle() {
      if (this.map) {
        this.clearRectangles()

        this.rectangle = new google.maps.Rectangle({
          ...this.rectangleOptions,
          bounds: {
            north: 0,
            south: 0,
            east: 0,
            west: 0,
          },
          map: this.map,
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .map-container {
    min-width: 20rem;
    min-height: 10rem;
  }

  .cd-spatial-coverage-map {
    padding: 2px;
  }
</style>
