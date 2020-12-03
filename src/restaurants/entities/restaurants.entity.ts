import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Restaurant {
  @Field(type => String)
  name: string;
  @Field(type => Boolean, { nullable: true })
  isVegan: true;
  @Field(type => String)
  address: string;
  @Field(type => String)
  ownersName: string;
}
