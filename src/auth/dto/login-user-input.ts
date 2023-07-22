import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class LoginUserInput {
  @Field()
  username: string;

  @Field()
  password: string;
}
