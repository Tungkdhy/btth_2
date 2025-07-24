import { EndpointsEsModel } from '../../endpoint/models/endpoints-es.model';

export interface ReferenceFmsModel {
  main: EndpointsEsModel;
  sub: EndpointsEsModel;
}
