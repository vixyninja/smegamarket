import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';

@WebSocketGateway({
  // namespace: 'event',
  // path: 'event',
  // cors: {
  //   origin: '*',
  //   methods: ['GET', 'POST', 'PUT', 'DELETE'],
  //   allowedHeaders: ['Content-Type', 'Authorization'],
  //   credentials: true,
  // },
})
export class EventGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  constructor() {
    console.log('EventGateway constructor');
  }

  afterInit(@ConnectedSocket() socket: Socket) {
    console.log('EventGateway afterInit');
  }

  handleConnection(@ConnectedSocket() socket: Socket, ...args: any[]) {
    console.log('EventGateway handleConnection');

    console.log('socket.id', socket.id);
  }

  @SubscribeMessage('message')
  handleMessage(@ConnectedSocket() socket: Socket, @MessageBody() data): string {
    console.log('EventGateway handleMessage', data);

    return 'Hello world!';
  }

  @SubscribeMessage('events')
  handleEvent(@ConnectedSocket() socket: Socket, @MessageBody('id') id: number): number {
    return id;
  }

  handleDisconnect(@ConnectedSocket() socket: Socket) {
    console.log('EventGateway handleDisconnect');
  }
}
