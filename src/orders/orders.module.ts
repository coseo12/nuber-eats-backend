import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DishRepository } from 'src/restaurants/repositories/dish.repository';
import { RestaurantRepository } from 'src/restaurants/repositories/restaurant.repository';
import { Order } from './entities/order.entity';
import { OrdersResolver } from './orders.resolver';
import { OrdersService } from './orders.service';
import { OrderItemRepository } from './repositories/order-item.repository';
import { OrderRepository } from './repositories/order.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderRepository,
      OrderItemRepository,
      DishRepository,
      RestaurantRepository,
    ]),
  ],
  providers: [OrdersResolver, OrdersService],
})
export class OrdersModule {}
