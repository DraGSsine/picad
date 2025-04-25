import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop()
  email: string;

  @Prop({ default: null })
  googleId?: string;

  @Prop()
  displayName?: string;

  @Prop({ default: 'https://www.gravatar.com/avatar/  ' })
  avatar?: string;

  @Prop()
  password: string;

  @Prop({ enum: ['none', 'Starter', 'Growth', 'Annual'], default: 'none' })
  plan: string;

  @Prop({ default: 0 })
  creditsUsed: number;

  @Prop({ enum: [150, 400, 9999], default: 150 })
  monthlyCredits: number;
  
  @Prop({ enum: ['monthly', 'yearly'], default: 'monthly' })
  subscriptionType: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
