import { AppDataSource } from '../data-source';
import { Card } from '../entity/card';
import path from 'path';
import fs from 'fs';

const cardsDir = path.join(__dirname, '..', '..', 'resources/cards');

const cards: Partial<Card>[] = [
  { title: 'Business', imagePath: 'cards/business.jpg' },
  { title: 'Caregiving', imagePath: 'cards/caregiving.jpg' },
  { title: 'Co-Caregiving', imagePath: 'cards/co-caregiving.jpg' },
  { title: 'Collaboration', imagePath: 'cards/collaboration.jpg' },
  { title: 'Emotional Intimacy', imagePath: 'cards/emotional-intimacy.jpg' },
  { title: 'Emotional Support', imagePath: 'cards/emotional-support.jpg' },
  { title: 'Financial', imagePath: 'cards/financial.jpg' },
  { title: 'Friendship', imagePath: 'cards/friendship.jpg' },
  { title: 'Kink', imagePath: 'cards/kink.jpg' },
  { title: 'Life Partnership', imagePath: 'cards/life-partnership.jpg' },
  { title: 'Nesting', imagePath: 'cards/nesting.jpg' },
  { title: 'Physical Touch', imagePath: 'cards/physical-touch.jpg' },
  { title: 'Romance', imagePath: 'cards/romance.jpg' },
  { title: 'Sex', imagePath: 'cards/sex.jpg' },
  { title: 'Social Partnership', imagePath: 'cards/social-partnership.jpg' },
];


async function seedCards() {
  try {
    await AppDataSource.initialize();
    const cardRepo = AppDataSource.getRepository(Card);

    const existingCount = await cardRepo.count();
    if (existingCount > 0) {
      console.log('🔁 Cards already exist. Skipping seeding.');
      return;
    }

    // Check that image files exist
    for (const card of cards) {
      const filePath = path.join(cardsDir, path.basename(card.imagePath!));
      if (!fs.existsSync(filePath)) {
        throw new Error(`Image file not found: ${filePath}`);
      }
    }

    await cardRepo.save(cards);
    console.log(`✅ Seeded ${cards.length} cards successfully.`);
  } catch (error) {
    console.error('❌ Error seeding cards:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

seedCards();
