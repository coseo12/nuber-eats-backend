import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantRepository } from 'src/restaurants/repositories/restaurant.repository';
import { PaymentsResolver } from './payments.resolver';
import { PaymentsService } from './payments.service';
import { PaymentRepository } from './repositories/payment.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentRepository, RestaurantRepository]),
  ],
  providers: [PaymentsService, PaymentsResolver],
})
export class PaymentsModule {}
