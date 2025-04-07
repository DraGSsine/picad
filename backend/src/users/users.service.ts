// users.service.ts
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../model/UserSchema';
import * as crypto from 'crypto';
import * as path from 'path';
import * as fs from 'fs';

interface GoogleProfile {
  emails?: Array<{ value: string }>;
  id: string;
  displayName?: string;
  photos?: Array<{ value: string }>;
}

// Interface for template data structure
interface Template {
  id: number;
  name: string;
  category: string;
  imageUrl: string;
}

@Injectable()
export class UsersService {
  private readonly templatesRoot = path.join(process.cwd(), 'public');
  private readonly templatesDir = path.join(this.templatesRoot, 'adsTemplates');

  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  private async checkUserExists(email: string): Promise<void> {
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
  }

  async findOrCreate(profile: GoogleProfile): Promise<User> {
    const email = profile.emails?.[0]?.value;
    if (!email) throw new Error('No email provided in Google profile');

    let user = await this.userModel.findOne({ email });

    if (!user) {
      user = new this.userModel({
        email,
        googleId: profile.id,
        displayName: profile.displayName,
        avatar: profile.photos?.[0]?.value,
        password: crypto.randomBytes(16).toString('hex'),
      });
      await user.save();
    }

    return user;
  }

  async create(userData: Partial<User>): Promise<User> {
    await this.checkUserExists(userData.email!);
    const user = new this.userModel(userData);
    return user.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }

  async getUserInfo(user: { email: string; id: any }) {
    const userExist = await this.userModel.findOne({ email: user.email });
    if (!userExist) {
      return null;
    }
    return {
      email: userExist.email,
      displayName: userExist.displayName,
      avatar: userExist.avatar,
      plan: userExist.plan,
      monthlyCredits: userExist.monthlyCredits,
      creditsUsed: userExist.creditsUsed,
    };
  }

  async updateUserCredits(
    userId: string,
    creditsUsed: number,
  ): Promise<boolean> {
    try {
      const result = await this.userModel.updateOne(
        { _id: userId },
        { $set: { creditsUsed } },
      );
      return result.modifiedCount > 0;
    } catch (error) {
      console.error('Error updating user credits:', error);
      return false;
    }
  }

  async getTemplates(category?: string): Promise<Template[]> {
    try {
      // Ensure the templates directory exists
      if (!fs.existsSync(this.templatesDir)) {
        console.error('Templates directory does not exist:', this.templatesDir);
        return [];
      }

      // Read all files in the directory
      const files = fs.readdirSync(this.templatesDir);

      // Map files to template objects
      const templates: Template[] = files
        .filter(file => file.endsWith('.jfif') || file.endsWith('.jpg') || file.endsWith('.png'))
        .map((file, index) => {
          const id = parseInt(file.split('.')[0], 10) || index + 1;
          let fileCategory = this.assignCategory(id);
          
          return {
            id,
            name: `${fileCategory.charAt(0).toUpperCase() + fileCategory.slice(1)} Template ${id}`,
            category: fileCategory,
            imageUrl: `${process.env.BASE_URL}/adsTemplates/${file}`,
          };
        });

      // Filter by category if provided
      if (category && category !== 'all') {
        return templates.filter(template => template.category === category.toLowerCase());
      }
      
      return templates;
    } catch (error) {
      console.error('Error getting templates:', error);
      return [];
    }
  }

  // Helper to assign category based on template ID
  private assignCategory(id: number): string {
    if (id <= 10) return 'lifestyle';
    if (id <= 30) return 'food';
    if (id <= 60) return 'fashion';
    if (id <= 70) return 'accessories';
    if (id <= 80) return 'shoes';
    return 'tech';
  }
}
