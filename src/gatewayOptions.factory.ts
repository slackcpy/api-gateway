import { GatewayOptionsFactory,  GatewayModuleOptions } from "@nestjs/graphql";
import { probe } from "@network-utils/tcp-ping";
import { Injectable } from "@nestjs/common";
import { URL } from "url";

interface IProbeOptions {
  address: string;
  port: number;
}
 
@Injectable()
export class AsyncGatewayOptionsFactory implements GatewayOptionsFactory {
  ATTEMPTS = 30;
  
  SERVICES: {name:string; url:string}[] = [
    {name: "users", url: "http://users-service:3001/graphql"},
    {name: 'auth', url: 'http://auth-service:3002/graphql'}
  ];

  OPTIONS: GatewayModuleOptions = {
    server:{
      cors: true,
      context: ({ req }) => ({ req })
    },
    gateway: {
      serviceList: this.SERVICES,
      serviceHealthCheck: true
    }
  };

  async createGatewayOptions(): Promise<GatewayModuleOptions> {
    let i = 0;

    const promise = new Promise((resolve) => {
      const interval = setInterval(async () => {
        if(await this.isAllServicesAvailable() || i >= this.ATTEMPTS) {
          resolve(this.OPTIONS);
          clearInterval(interval);
        }
        i++;
      }, 1000)
    })
    return promise;
  }

  async isAllServicesAvailable(): Promise<boolean> {
    const result = await Promise.all(this.servicesProbeArr);

    return this.reduceServicesAvailability(result)
  }

  reduceServicesAvailability(availabilityArr: boolean[]): boolean {
    return availabilityArr.reduce((prevValue, value) => {
      return prevValue === false ? false : value 
    }, true)
  }

  async probeService(options: IProbeOptions): Promise<boolean> {
    const result = await probe(options.port, options.address);
    console.log(`Connected to ${options.address}: ${result}`)
    return result
  }

  get servicesProbeArr(): Promise<boolean>[] {
    return this.SERVICES.map((service) => this.probeService(this.getHostInfo(service.url)))
  }

  getHostInfo(serviceAddress: string): IProbeOptions {
    const url = new URL(serviceAddress);

    return {
      address: url.hostname,
      port: parseInt(url.port)
    }
  }
}