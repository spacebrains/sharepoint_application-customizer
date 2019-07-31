import { ApplicationCustomizerContext } from "@microsoft/sp-application-base";
import {SPHttpClient} from '@microsoft/sp-http';

export interface ICounterProps {
  context: ApplicationCustomizerContext;
  url: string;
  spHttpClient: SPHttpClient;
}

export interface ISPList {
  Url: string;
  view: number;
}

export interface ISPLists {
  value: ISPList[];
}




