import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { RestaurantRepository } from 'src/restaurants/repositories/restaurant.repository';
import { User } from 'src/users/entities/user.entity';
import { LessThan } from 'typeorm';
import {
  CreatePaymentInput,
  CreatePaymentOutput,
} from './dtos/create-payment.dto';
import { GetPaymentOutput } from './dtos/get-payment.dto';
import { PaymentRepository } from './repositories/payment.repository';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly payments: PaymentRepository,
    private readonly restaurants: RestaurantRepository,
  ) {}

  async createPayment(
    owner: User,
    { transactionId, restaurantId }: CreatePaymentInput,
  ): Promise<CreatePaymentOutput> {
    try {
      const restaurant = await this.restaurants.findOne(restaurantId);
      if (!restaurant) {
        return {
          ok: false,
          error: 'Restaurant not found',
        };
      }
      if (restaurant.ownerId !== owner.id) {
        return {
          ok: false,
          error: `You are not allowed to do this`,
        };
      }

      const date = new Date();
      date.setDate(date.getDate() + 7);

      restaurant.isPromoted = true;
      restaurant.promotedUntil = date;

      this.restaurants.save(restaurant);

      await this.payments.save(
        this.payments.create({
          transactionId,
          user: owner,
          restaurant,
        }),
      );

      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: `Could not create payment`,
      };
    }
  }

  async getPayments(user: User): Promise<GetPaymentOutput> {
    try {
      const payments = await this.payments.find({ user: user });

      return {
        ok: true,
        payments,
      };
    } catch (error) {
      return {
        ok: false,
        error: `Could not load payments`,
      };
    }
  }

  @Interval(100 * 1000)
  async checkPromotedRestaurants() {
    try {
      const restaurants = await this.restaurants.find({
        isPromoted: true,
        promotedUntil: LessThan(new Date()),
      });

      restaurants.forEach(async restaurant => {
        restaurant.isPromoted = false;
        restaurant.promotedUntil = null;
        await this.restaurants.save(restaurant);
      });
    } catch (error) {}
  }
}
