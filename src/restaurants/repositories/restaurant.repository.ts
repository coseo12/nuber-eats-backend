import { EntityRepository, Repository } from 'typeorm';
import { RepositoryRestaurantOutput } from '../dtos/repository-restaurant.dto';
import { Restaurant } from '../entities/restaurants.entity';

@EntityRepository(Restaurant)
export class RestaurantRepository extends Repository<Restaurant> {
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
}
