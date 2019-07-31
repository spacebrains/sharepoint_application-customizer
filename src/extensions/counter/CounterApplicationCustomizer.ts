import * as React from "react";
import * as ReactDom from 'react-dom';
import {override} from '@microsoft/decorators';
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from '@microsoft/sp-application-base';
import Counter from './components/Counter';
import {ICounterProps} from './components/ICounter';

const LOG_SOURCE: string = 'CounterApplicationCustomizer';


export interface ICounterAppCustomizerProps {
  url: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class CounterApplicationCustomizer extends BaseApplicationCustomizer<ICounterAppCustomizerProps> {
  private _headerPlaceholder: PlaceholderContent;

  @override
  public onInit(): Promise<void> {
    this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders);
    this._renderPlaceHolders();
    return Promise.resolve();
  }

  private _renderPlaceHolders(): void {
    if (this._headerPlaceholderAvailableAndNotCreatedYet()) {
      this._headerPlaceholder = this.context.placeholderProvider.tryCreateContent(PlaceholderName.Top);

      if (!this._headerPlaceholder) {
        console.error(`${LOG_SOURCE} The expected placeholder (PageHeader) was not found.`);
        return;
      }

      if (this._headerPlaceholder.domElement) {
        const element: React.ReactElement<ICounterProps> = React.createElement(
          Counter,
          {
            context: this.context,
            url: window.top.location.href,
            spHttpClient: this.context.spHttpClient
          }
        );
        ReactDom.render(element, this._headerPlaceholder.domElement);
      }
    }
  }

  private _headerPlaceholderAvailableAndNotCreatedYet(): boolean {
    return !this._headerPlaceholder
      && this.context.placeholderProvider.placeholderNames.indexOf(PlaceholderName.Top) !== -1;
  }
}


