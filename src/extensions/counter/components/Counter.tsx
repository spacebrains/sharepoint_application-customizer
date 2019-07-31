import * as React from 'react';
import {SPHttpClient, SPHttpClientResponse} from "@microsoft/sp-http";
import {DefaultButton} from 'office-ui-fabric-react/lib/Button';
import {TooltipHost} from 'office-ui-fabric-react/lib/Tooltip';
import {getId} from 'office-ui-fabric-react/lib/Utilities';
import {ICounterProps, ISPList} from './ICounter';
import './style.css';


export interface ICounterState {
  counter: number;
  items: Array<ISPList>;
}

export default class Counter extends React.PureComponent<ICounterProps, ICounterState> {

  private ID: string = getId('tooltipHost');
  private LIST_NAME: string = 'counter';

  public state = {
    counter: 1,
    items: []
  };

  public componentDidMount(): void {
    this.loadItems()
  }

  private async loadItems() {
    try {
      const response = await this.props.spHttpClient
        .get(`${this.props.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${this.LIST_NAME}')/items`,
          SPHttpClient.configurations.v1) as SPHttpClientResponse;

      const items = await response.json();

      this.setState(
        {...this.state, items: items.value},
        () => {
          this.checkItem();
        });
    }
    catch (error) {
      console.error('loadItems',error);
    }

  }

  private checkItem(): void {
    try {
      const {items} = this.state;
      const {url} = this.props;
      console.log(items);
      const id = items.indexOf(i => i.Url === url);
      if (id + 1) {
        const item = items[id];
        const countItem: number = item.view;
        this.setState(
          {
            ...this.state,
            counter: countItem
          },
          () => {
            this.updateItem(id, url);
          }
        );
      } else {
        this.addNewItem(url);
      }
    }
    catch (error) {
      console.error('checkItem',error);
    }
  }

  private updateItem(id: number, url: string): void {
    try {
      const body: string = JSON.stringify({
        'ID page': url,
        'view': this.state.counter + 1
      });
      this.props.spHttpClient.post(`${this.props.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${this.LIST_NAME}')/items(${id})`, SPHttpClient.configurations.v1, {
        headers: {
          'Accept': "application/json;odata=nometadata",
          'Content-type': "application/json;odata=nometadata",
          'odata-version': '',
          'IF-MATCH': '*',
          'X-HTTP-Method': 'MERGE'
        },
        body: body
      });
      this.setState(
        {
          ...this.state,
          counter: this.state.counter + 1
        });
    }
    catch (error) {
      console.error('updateItem',error);
    }
  }

  private addNewItem(url: string): void {
    try {
      const body: string = JSON.stringify({
        'view': this.state.counter,
        'Url': url,
        'Title': 'test'
      });
      this.props.spHttpClient.post(`${this.props.context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${this.LIST_NAME}')/items`, SPHttpClient.configurations.v1, {
        body: body
      });
    }
    catch (error) {
      console.error('addNewItem',error);
    }
  }

  public render(): React.ReactElement<ICounterProps> {
    const {counter} = this.state;
    return (
      <div className={'links'}>
        <div className={'container'}>
          <TooltipHost content="view counter." id={this.ID} calloutProps={{gapSpace: 20}}>
            <DefaultButton iconProps={{iconName: 'View'}} href={this.props.url} aria-labelledby={this.ID}>
              {counter}
            </DefaultButton>
          </TooltipHost>
        </div>
      </div>
    );
  }
}
