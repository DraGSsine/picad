import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/model/UserSchema';
@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    console.log(request.user);
    const userId = request.user.id;
    if (!userId) throw new UnauthorizedException('No user id provided');

    const user = await this.userModel.findById(userId);
    if (!user) throw new UnauthorizedException('User not found');
    const userPlan = user.plan;
    const userUsage = user.creditsUsed;
    const userMonthlyCredits = user.monthlyCredits;
    
    // Special value 9999 represents unlimited credits
    const unlimitedCredits = userMonthlyCredits === 9999;
    const usageExceeded = !unlimitedCredits && userUsage >= userMonthlyCredits;
    
    if (!userPlan || userPlan === 'none')
      throw new UnauthorizedException("You don't have an active subscription plan. Please visit our pricing page.");
    
    if (userPlan === 'Starter' && usageExceeded) {
      await this.userModel.findByIdAndUpdate(userId, { plan: 'none' });
      throw new UnauthorizedException('Starter plan credit limit reached. Please upgrade your subscription.');
    }

    return true;
  }
}
