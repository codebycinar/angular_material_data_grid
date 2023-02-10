import GridHeadingInterface from './grid-heading-type';
import {Observable} from "rxjs";

export default interface ChildGridConfigType {

    headings: GridHeadingInterface[];
    url: string;
    entity: any;
    serverSidePagination: boolean;
    getLocalData: ((pageNo: any, recordsPerPage: any) => Observable<any>) | undefined;
}
