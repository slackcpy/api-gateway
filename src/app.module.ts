import { Module } from '@nestjs/common';
import { GraphQLGatewayModule } from '@nestjs/graphql';
import { ConfigModule } from '@nestjs/config';
import { AsyncGatewayOptionsFactory } from './gatewayOptions.factory';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLGatewayModule.forRootAsync({
    useClass: AsyncGatewayOptionsFactory
    })]
})
export class AppModule {}
