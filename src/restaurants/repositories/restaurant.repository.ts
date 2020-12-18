import { EntityRepository, Repository } from 'typeorm';
import { RepositoryRestaurantOutput } from '../dtos/repository-restaurant.dto';
import { Restaurant } from '../entities/restaurants.entity';

@EntityRepository(Restaurant)
export class RestaurantRepository extends Repository<Restaurant> {
  take() {
    return 25;
  }

  skip(page: number) {
    return (page - 1) * this.take();
  }

  totalPages(totalResults: number) {
    return Math.ceil(totalResults / this.take());
  }

  async checkRestaurant(
    ownerId: number,
    restaurantId: number,
  ): Promise<RepositoryRestaurantOutput> {
    const restaurant = await this.findOneOrFail(restaurantId);
    if (!restaurant) {
      return {
        ok: false,
        error: `Restaurant not found`,
      };
    }
    if (ownerId !== restaurant.ownerId) {
      return {
        ok: false,
        error: `You can't changed a restaurant that you don't own`,
      };
    }
    return {
      ok: true,
    };
  }

  async findPagination(
    page: number,
    where: object = null,
  ): Promise<RepositoryRestaurantOutput> {
    const restaurants = await this.find({
      where: {
        ...where,
      },
      take: this.take(),
      skip: this.skip(page),
    });
    return {
      ok: true,
      restaurants,
    };
  }

  async findAndCountPagination(
    page: number,
    where: object = null,
  ): Promise<RepositoryRestaurantOutput> {
    const [restaurants, totalResults] = await this.findAndCount({
      where: {
        ...where,
      },
      skip: (page - 1) * this.take(),
      take: this.take(),
    });

    return {
      ok: true,
      restaurants,
      totalPages: this.totalPages(totalResults),
      totalResults,
    };
  }
}
