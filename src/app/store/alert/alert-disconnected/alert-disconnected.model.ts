import { InfraAlertData } from '../../../modules/dashboard/models/btth.interface';

export interface AlertDisconnected extends InfraAlertData {
  viewed: boolean;
}
