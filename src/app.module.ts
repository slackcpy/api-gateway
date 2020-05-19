import { Module } from '@nestjs/common';
import { GraphQLGatewayModule } from '@nestjs/graphql';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLGatewayModule.forRoot({
    server:{
      cors: true
    },
    gateway: {
      serviceList: [{name: "users", url: "http://users-service:3001/graphql"}]
    }
  })]
})
export class AppModule {}
