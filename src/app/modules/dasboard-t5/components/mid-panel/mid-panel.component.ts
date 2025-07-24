import { Component, ElementRef, ViewChild } from '@angular/core';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import { Feature } from 'ol';
import { Point } from 'ol/geom';
import { Icon, Style } from 'ol/style';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Component({
  selector: 'app-map-component',
  templateUrl: './mid-panel.component.html',
  styleUrls: ['./mid-panel.component.scss'],
  imports: [CommonModule],
  standalone: true
})
export class MidPanelT5Component {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  backendUrl = 'http://localhost:3001';
  mapInstance!: Map;
  markerLayer!: VectorLayer<VectorSource>;

  rows$ = new BehaviorSubject<any[]>([]);
  expandedRows: number[] = [];
  expandedParentRows: number[] = [];
  selectedChild: any = null;
  hanoiCoordinate = [105.8542, 21.0285];
  zoomOutGlobal = 2;

  constructor(private http: HttpClient,private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.fetchData();
    this.initMap();
    
    // console.log(this.rows);
  }

  createWaveIcon(radius: number): string {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 2 * radius;
    const context = canvas.getContext('2d')!;
    const gradient = context.createRadialGradient(radius, radius, 0, radius, radius, radius);
    gradient.addColorStop(0, 'rgba(0, 153, 255, 0.9)');
    gradient.addColorStop(1, 'rgba(0, 153, 255, 0)');
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(radius, radius, radius, 0, 2 * Math.PI);
    context.fill();
    return canvas.toDataURL();
  }

  initMap() {
    this.markerLayer = new VectorLayer({
      source: new VectorSource(),
      style: new Style({
        image: new Icon({
          src: this.createWaveIcon(5),
          scale: 1,
          anchor: [0.5, 0.5]
        })
      })
    });

    this.mapInstance = new Map({
      target: 'map',
      layers: [
        new TileLayer({ source: new OSM() }),
        this.markerLayer
      ],
      view: new View({
        center: fromLonLat(this.hanoiCoordinate),
        zoom: this.zoomOutGlobal
      })
    });

    this.mapInstance.on('click', (event) => {
      const feature = this.mapInstance.forEachFeatureAtPixel(event.pixel, (feature) => feature);
      if (feature && feature.get('childData')) {
        const childData = feature.get('childData');
        this.selectedChild = childData;
        this.mapInstance.getView().animate({
          center: fromLonLat([childData.lon, childData.lat]),
          zoom: 10,
          duration: 1000
        });
      }
    });
  }

  fetchData() {
    this.http.get<any[]>(`${this.backendUrl}/api/force-data`).subscribe((data) => {
      console.log('✅ rows before fetch:', data); //
      let change = data.map((row) => {
        row.total = row.children.length;
        row.current = row.children.filter((c: any) => c.status === 1).length;
        const childCountMap = row.children.reduce((acc: any, c: any) => {
          acc[c.parent_id] = (acc[c.parent_id] || 0) + 1;
          return acc;
        }, {});
        const childStatusMap = row.children.reduce((acc: any, c: any) => {
          if (c.status === 1) acc[c.parent_id] = (acc[c.parent_id] || 0) + 1;
          return acc;
        }, {});
        row.parents = row.parents.map((parent: any) => ({
          ...parent,
          child_number: childCountMap[parent.id] || 0,
          success_count: childStatusMap[parent.id] || 0
        }));

        row.children.forEach((child: any) => {
          const marker = new Feature({
            geometry: new Point(fromLonLat([child.lon, child.lat])),
            childData: child
          });
          this.markerLayer.getSource()?.addFeature(marker);
        });

        return row;
      });
      this.rows$.next(change);
    });
    this.cdr.detectChanges();

  }

  handleFileChange(event: any) {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    this.http.post(`${this.backendUrl}/upload-json`, formData, { responseType: 'text' }).subscribe(
      (result) => alert(result),
      (error) => {
        console.error('Upload error', error);
        alert('Error uploading file');
      }
    );
  }

  handleDivClick() {
    this.fileInput.nativeElement.click();
  }

  handleParentRowClick(id: number) {
    if (this.expandedParentRows.includes(id)) {
      this.expandedParentRows = [];
    } else {
      this.expandedParentRows = [id];
      this.expandedRows = [];
    }
    this.selectedChild = null;
  }
  findFirstChild(row: any, parentId: number) {
    if (!row || !row.children) return null;
    return row.children.find((c: any) => c.parent_id === parentId);
  }
  
  onParentRowClick(parentId: number, row: any) {
    this.handleRowClick(parentId);
    const child = this.findFirstChild(row, parentId);
    if (child) {
      this.moveToLocation(child.lat, child.lon);
    }
  }
  filterChildrenByParent(row: any, parentId: number) {
    if (!row || !row.children) return [];
    return row.children.filter((c: any) => c.parent_id === parentId);
  }
  handleRowClick(id: number) {
    if (this.expandedRows.includes(id)) {
      this.expandedRows = [];
    } else {
      this.expandedRows = [id];
    }
    this.selectedChild = null;
  }

  moveToLocation(lat: number, lon: number) {
    this.mapInstance.getView().animate({
      center: fromLonLat([lon, lat]),
      zoom: 10
    });
  }

  resetZoom() {
    this.mapInstance.getView().animate({
      center: fromLonLat(this.hanoiCoordinate),
      zoom: this.zoomOutGlobal,
      duration: 1000
    });
    this.expandedRows = [];
    this.expandedParentRows = [];
    this.selectedChild = null;
  }

  renderStatusIcon(status: number) {
    return status === 0 ? '✘' : '✔';
  }
}
