import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { Restaurant } from './entities/restaurants.entity';
import { CreateRestaurantDto } from './dtos/create-restaurant.dto';
import { RestaurantService } from './restaurants.service';
import { UpdateRestaurantDto } from './dtos/update-restaurant.dto';

@Resolver(of => Restaurant)
export class RestaurantResolver {
  constructor(private readonly rastaurantService: RestaurantService) {}

  @Query(returns => [Restaurant])
  restaurants(): Promise<Restaurant[]> {
    return this.rastaurantService.getAll();
  }

  @Mutation(returns => Boolean)
  async createRestaurant(
    @Args('input') createRestaurantDto: CreateRestaurantDto,
  ): Promise<boolean> {
    try {
      await this.rastaurantService.createRestaurant(createRestaurantDto);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  @Mutation(returns => Boolean)
  async updateRestaurant(
    @Args('update') updateRestaurantDto: UpdateRestaurantDto,
  ) {
    try {
      await this.rastaurantService.updateRestaurant(updateRestaurantDto);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
