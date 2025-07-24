import { Injectable } from '@angular/core';
import {
  ResultListNoPaginationModel,
  ResultListPaginationModel,
} from '../models/api-response.model';
import {
  IEndPoint,
  IEndPointDto,
} from '../../modules/endpoint/models/endpoint.model';
import { IDevice, IDeviceDto } from '../../modules/device/models/device.model';
import { ConfirmDeleteModalComponent } from '../../shared/confirm-delete-modal/confirm-delete-modal.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { SearchInfoSec } from '../models/search';
import { Constant } from '../config/constant';
import { ComputerService } from '../../modules/endpoint/services/computer.service';
import { UnitService } from '../../modules/unit/services/unit.service';
import { BehaviorSubject } from 'rxjs';
import { UnitModel } from '../../modules/unit/models/unit.model';
import { NetworkDeviceService } from '../../modules/device/services/network-device.service';
import { DataPaginatingModel } from '../models/data-paginating.model';

@Injectable({
  providedIn: 'root',
})
export class CommonInfoSecService {
  constructor(
    private networkDeviceService: NetworkDeviceService,
    private computerService: ComputerService,
    private modalService: NgbModal,
    private unitService: UnitService,
  ) {}

  private computerListDto = new BehaviorSubject<IEndPointDto[]>([]);
  private deviceListDto = new BehaviorSubject<IDeviceDto[]>([]);
  private unitTree = new BehaviorSubject<UnitModel[]>([]);
  private unitTreeSelected = new BehaviorSubject<UnitModel[]>([]);
  private dataPagination = new BehaviorSubject<DataPaginatingModel>({
    data: [],
    total: 0,
  });

  currentComputerListDto = this.computerListDto.asObservable();
  currentDeviceListDto = this.deviceListDto.asObservable();
  currentUnitTree = this.unitTree.asObservable();
  currentUnitTreeSelected = this.unitTreeSelected.asObservable();
  currentDataPagination = this.dataPagination.asObservable();

  public type = Constant.UNIT.TYPE_UNIT;
  public discriminator = Constant.UNIT.DISCRIMINATOR_TSLQS;

  public findDeviceListPaginationUseSearch(search: SearchInfoSec): void {
    this.networkDeviceService
      .getDevices(search)
      .subscribe((res: ResultListPaginationModel<any>) => {
        const deviceList: IDeviceDto | IEndPointDto[] = res.data.content;
        this.dataPagination.next({
          data: deviceList,
          total: res.data.totalElements,
        });
      });
  }

  public findComputerListPaginationUseSearch(search: SearchInfoSec): void {
    this.computerService
      .getDevices(search)
      .subscribe((res: ResultListPaginationModel<any>) => {
        const deviceList: IDeviceDto | IEndPointDto[] = res.data.content;
        this.dataPagination.next({
          data: deviceList,
          total: res.data.totalElements,
        });
      });
  }

  private static convertStringDateFormat(date: string): string {
    return new Date(date).toLocaleString();
  }

  public openModalDelete(data: any): NgbModalRef {
    const modalRef = this.modalService.open(ConfirmDeleteModalComponent, {
      centered: true,
    });
    modalRef.componentInstance.data = data;
    return modalRef;
  }

  public getUnitTree(): void {
    this.unitService
      .getRootTreeByTypeAndDiscriminator(this.type, this.discriminator)
      .subscribe((res: ResultListNoPaginationModel) => {
        this.unitTree.next(res.data);
      });
  }

  public getUnitTreeSelected(device: IDevice | IEndPoint): void {
    // this.unitService.getRootTreeByTypeAndDiscriminator(this.type, this.discriminator).subscribe(
    //   (res: ResultListNoPaginationModel) => {
    //     const unitList = selectedArrayTreeObject(res.data, device.unitId) as UnitModel[];
    //     this.unitTreeSelected.next(unitList);
    //   }
    // )
  }

  public getDataByUUID(uuid: string, list: any[]): any {
    return list.filter((item: any) => item.uuid === uuid)[0];
  }
}
