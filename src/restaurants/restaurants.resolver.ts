import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { Restaurant } from './entities/restaurants.entity';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dtos/create-restaurant.dto';
import { RestaurantService } from './restaurants.service';
import { User } from 'src/users/entities/user.entity';
import { AuthUser } from 'src/auth/auth-user.decorator';

@Resolver(of => Restaurant)
export class RestaurantResolver {
  constructor(private readonly rastaurantService: RestaurantService) {}

  @Mutation(returns => CreateRestaurantOutput)
  async createRestaurant(
    @AuthUser() authUser: User,
    @Args('input') createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    return this.rastaurantService.createRestaurant(
      authUser,
      createRestaurantInput,
    );
  }
}
