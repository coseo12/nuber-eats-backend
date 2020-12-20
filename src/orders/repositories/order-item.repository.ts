import { EntityRepository, Repository } from 'typeorm';
import { OrderItem } from '../entities/order-item.entity';

@EntityRepository(OrderItem)
export class OrderItemRepository extends Repository<OrderItem> {}
