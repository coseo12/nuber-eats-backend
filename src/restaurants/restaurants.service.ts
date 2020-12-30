import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { ILike } from 'typeorm';
import { AllCategoriesOutput } from './dtos/all-categories-dto';
import { CategoryInput, CategoryOutput } from './dtos/category.dto';
import { CreateDishInput, CreateDishOutput } from './dtos/create-dish.dto';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from './dtos/create-restaurant.dto';
import { DeleteDishInput, DeleteDishOutput } from './dtos/delete-dish.dto';
import { DeleteRestaurantOutput } from './dtos/delete-restaurant.dto';
import { EditDishInput, EditDishOutput } from './dtos/edit-dish.dto';
import {
  EditRestaurantInput,
  EditRestaurantOutput,
} from './dtos/edit-restaurant.dto';
import { MyRestaurantsOutput } from './dtos/my-restaurants.dto';
import { RestaurantInput, RestaurantOutput } from './dtos/restaurant.dto';
import { RestaurantsInput, RestaurantsOutput } from './dtos/restaurants.dto';
import {
  SearchRestaurantInput,
  SearchRestaurantOutput,
} from './dtos/search-restaurant.dto';
import { Category } from './entities/category.entity';
import { CategoryRepository } from './repositories/category.repository';
import { DishRepository } from './repositories/dish.repository';
import { RestaurantRepository } from './repositories/restaurant.repository';

@Injectable()
export class RestaurantService {
  constructor(
    private readonly restaurants: RestaurantRepository,
    private readonly dishes: DishRepository,
    private readonly categories: CategoryRepository,
  ) {}

  async createRestaurant(
    owner: User,
    createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    try {
      const newRestaurant = this.restaurants.create(createRestaurantInput);
      newRestaurant.owner = owner;
      const category = await this.categories.getOrCreate(
        createRestaurantInput.categoryName,
      );
      newRestaurant.category = category;
      await this.restaurants.save(newRestaurant);
      return {
        ok: true,
        restaurantId: newRestaurant.id,
      };
    } catch {
      return { ok: false, error: 'Could not create restaurant' };
    }
  }

  async myRestaurants(owner: User): Promise<MyRestaurantsOutput> {
    try {
      const restaurants = await this.restaurants.find({ owner });
      return {
        ok: true,
        restaurants,
      };
    } catch (error) {
      return {
        ok: false,
        error: `Could not find restaurants`,
      };
    }
  }

  async editRestaurant(
    owner: User,
    editRestaurantInput: EditRestaurantInput,
  ): Promise<EditRestaurantOutput> {
    try {
      const checkRestaurant = await this.restaurants.checkRestaurant(
        owner.id,
        editRestaurantInput.restaurantId,
      );
      if (!checkRestaurant.ok) {
        return {
          ...checkRestaurant,
        };
      }
      let category: Category = null;
      if (editRestaurantInput.categoryName) {
        category = await this.categories.getOrCreate(
          editRestaurantInput.categoryName,
        );
      }
      await this.restaurants.save([
        {
          id: editRestaurantInput.restaurantId,
          ...editRestaurantInput,
          ...(category && { category }),
        },
      ]);

      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not edit Restaurant',
      };
    }
  }

  async deleteRestaurant(
    owner,
    { restaurantId },
  ): Promise<DeleteRestaurantOutput> {
    try {
      const checkRestaurant = await this.restaurants.checkRestaurant(
        owner.id,
        restaurantId,
      );
      if (!checkRestaurant.ok) {
        return {
          ...checkRestaurant,
        };
      }

      await this.restaurants.delete(restaurantId);

      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not delete Restaurant',
      };
    }
  }

  async allCategories(): Promise<AllCategoriesOutput> {
    try {
      const categories = await this.categories.find();
      return {
        ok: true,
        categories,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not load categories',
      };
    }
  }

  countRestaurants(category: Category): Promise<number> {
    return this.restaurants.count({ category });
  }

  async findCategoryBySlug({
    slug,
    page,
  }: CategoryInput): Promise<CategoryOutput> {
    try {
      const category = await this.categories.findOne({ slug });
      if (!category) {
        return {
          ok: false,
          error: 'Category not found',
        };
      }

      const { restaurants } = await this.restaurants.findPagination(page, {
        category,
      });

      category.restaurants = restaurants;

      const totalResults = await this.countRestaurants(category);

      return {
        ok: true,
        restaurants,
        category,
        totalPages: Math.ceil(totalResults / 25),
        totalResults,
      };
    } catch (error) {
      return {
        ok: false,
        error: `Could not load category`,
      };
    }
  }

  async allRestaurants({ page }: RestaurantsInput): Promise<RestaurantsOutput> {
    try {
      return await this.restaurants.findAndCountPagination(page);
    } catch (error) {
      return {
        ok: false,
        error: `Could not load restaurants`,
      };
    }
  }

  async findRestaurantById({
    restaurantId,
  }: RestaurantInput): Promise<RestaurantOutput> {
    try {
      const restaurant = await this.restaurants.findOne(restaurantId, {
        relations: ['menu', 'category'],
      });
      if (!restaurant) {
        return {
          ok: false,
          error: `Restaurant not found`,
        };
      }

      return {
        ok: true,
        restaurant,
      };
    } catch (error) {
      return {
        ok: false,
        error: `Could not find restaurant`,
      };
    }
  }

  async searchRestaurantByName({
    query,
    page,
  }: SearchRestaurantInput): Promise<SearchRestaurantOutput> {
    try {
      return await this.restaurants.findAndCountPagination(page, {
        name: ILike(`%${query}%`),
      });
    } catch (error) {
      return {
        ok: false,
        error: `Could not search for restaurants`,
      };
    }
  }

  async createDish(
    owner: User,
    createDishInput: CreateDishInput,
  ): Promise<CreateDishOutput> {
    try {
      const restaurant = await this.restaurants.findOne(
        createDishInput.restaurantId,
      );
      if (!restaurant) {
        return {
          ok: false,
          error: 'Restaurant not found',
        };
      }
      if (owner.id !== restaurant.ownerId) {
        return {
          ok: false,
          error: `You can't do that.`,
        };
      }

      await this.dishes.save(
        this.dishes.create({ ...createDishInput, restaurant }),
      );

      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: `Could not create dish`,
      };
    }
  }

  async editDish(
    owner: User,
    editDishInput: EditDishInput,
  ): Promise<EditDishOutput> {
    try {
      const checkDish = await this.dishes.checkDish(
        owner.id,
        editDishInput.dishId,
      );
      if (!checkDish.ok) {
        return {
          ...checkDish,
        };
      }

      await this.dishes.save([
        {
          id: editDishInput.dishId,
          ...editDishInput,
        },
      ]);

      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: `Could not eidt dish`,
      };
    }
  }

  async deleteDish(
    owner: User,
    { dishId }: DeleteDishInput,
  ): Promise<DeleteDishOutput> {
    try {
      const checkDish = await this.dishes.checkDish(owner.id, dishId);
      if (!checkDish.ok) {
        return {
          ...checkDish,
        };
      }

      await this.dishes.delete(dishId);

      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: `Could not delete dish`,
      };
    }
  }
}
