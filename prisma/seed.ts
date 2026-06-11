/**
 * Prisma seed — populates the database with initial development data.
 * Run with: npm run prisma:seed
 *
 * Reflects the current schema:
 *   Client, Child, Provider, ProviderAdmin, Teacher, Activity,
 *   ActivityTeacher, Session, Booking, Payment
 */
import 'dotenv/config';
import { PrismaNeon } from '@prisma/adapter-neon';
import {
  PrismaClient,
  ActivityCategory,
  BookingStatus,
  PaymentStatus,
  ParticipantType,
  StripeAccountStatus,
} from '../src/generated/prisma/client';

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  console.log('🌱 Seeding database...');

  // ─── Provider (organisation) ───────────────────────────────────────────────
  const provider = await prisma.provider.upsert({
    where: { id: 'seed-provider-001' },
    update: {},
    create: {
      id: 'seed-provider-001',
      name: 'AquaKids Studio',
      description: 'A sample swimming school for development seeding.',
      phone: '416-555-0100',
      city: 'Toronto',
      province: 'ON',
      postalCode: 'M5V 3A8',
      // Stripe Connect — simulated active connected account
      stripeAccountId: 'acct_seed_provider_001',
      stripeAccountStatus: StripeAccountStatus.ACTIVE,
      stripeChargesEnabled: true,
      stripePayoutsEnabled: true,
      stripeOnboardedAt: new Date('2026-01-15T00:00:00Z'),
      platformFeePercent: 0.10,
    },
  });
  console.log(`✅ Provider: ${provider.name}`);

  // ─── Provider admin (logs in to manage the provider) ──────────────────────
  const providerAdmin = await prisma.providerAdmin.upsert({
    where: { email: 'admin@aquakids.ca' },
    update: {},
    create: {
      auth0Id: 'auth0|provideradmin-seed-001',
      email: 'admin@aquakids.ca',
      firstName: 'Laura',
      lastName: 'Chen',
      providerId: provider.id,
    },
  });
  console.log(`✅ Provider admin: ${providerAdmin.firstName} ${providerAdmin.lastName}`);

  // ─── Teacher ───────────────────────────────────────────────────────────────
  const teacher = await prisma.teacher.upsert({
    where: { id: 'seed-teacher-001' },
    update: {},
    create: {
      id: 'seed-teacher-001',
      auth0Id: 'auth0|teacher-seed-001',
      email: 'maria@aquakids.ca',
      providerId: provider.id,
      firstName: 'Maria',
      lastName: 'Santos',
      phone: '416-555-0200',
      bio: 'Certified swimming instructor with 10 years of experience.',
    },
  });
  console.log(`✅ Teacher: ${teacher.firstName} ${teacher.lastName}`);

  // ─── Activity ──────────────────────────────────────────────────────────────
  const activity = await prisma.activity.upsert({
    where: { id: 'seed-activity-001' },
    update: {},
    create: {
      id: 'seed-activity-001',
      providerId: provider.id,
      title: 'Beginner Swimming Lessons',
      description: 'Fun and safe swimming lessons for all ages.',
      category: ActivityCategory.SWIMMING,
      ageMin: null,
      ageMax: null,
      price: 25.0,
      currency: 'CAD',
      duration: 45,
      maxCapacity: 8,
      location: '123 Poolside Ave, Toronto, ON',
      isOnline: false,
      // Assign teacher via join table
      teachers: {
        create: [{ teacherId: teacher.id }],
      },
    },
  });
  console.log(`✅ Activity: ${activity.title}`);

  // ─── Session ───────────────────────────────────────────────────────────────
  const session = await prisma.session.upsert({
    where: { id: 'seed-session-001' },
    update: {},
    create: {
      id: 'seed-session-001',
      activityId: activity.id,
      startTime: new Date('2026-07-01T10:00:00Z'),
      endTime: new Date('2026-07-01T10:45:00Z'),
      capacity: 8,
    },
  });
  console.log(`✅ Session: ${session.startTime.toISOString()}`);

  // ─── Adult client — books for themselves ──────────────────────────────────
  const adultClient = await prisma.client.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      auth0Id: 'auth0|client-adult-001',
      email: 'john@example.com',
      firstName: 'John',
      lastName: 'Smith',
      phone: '416-555-0300',
    },
  });
  console.log(`✅ Adult client: ${adultClient.firstName} ${adultClient.lastName}`);

  const adultBooking = await prisma.booking.upsert({
    where: { id: 'seed-booking-adult-001' },
    update: {},
    create: {
      id: 'seed-booking-adult-001',
      clientId: adultClient.id,
      activityId: activity.id,
      sessionId: session.id,
      participantType: ParticipantType.SELF,
      participantChildId: null,
      status: BookingStatus.CONFIRMED,
      totalAmount: 25.0,
      currency: 'CAD',
      payment: {
        create: {
          stripePaymentIntentId: 'pi_seed_adult_001',
          stripeChargeId: 'ch_seed_adult_001',
          stripeTransferId: 'tr_seed_adult_001',
          amount: 25.0,
          platformFee: 2.50,
          providerAmount: 22.50,
          currency: 'CAD',
          status: PaymentStatus.COMPLETED,
          method: 'card',
          last4: '4242',
        },
      },
    },
  });
  console.log(`✅ Adult booking [SELF]: ${adultBooking.id}`);

  // ─── Guardian client — books for a child ──────────────────────────────────
  const guardianClient = await prisma.client.upsert({
    where: { email: 'sarah@example.com' },
    update: {},
    create: {
      auth0Id: 'auth0|client-guardian-001',
      email: 'sarah@example.com',
      firstName: 'Sarah',
      lastName: 'Doe',
      phone: '416-555-0400',
    },
  });
  console.log(`✅ Guardian client: ${guardianClient.firstName} ${guardianClient.lastName}`);

  const child = await prisma.child.upsert({
    where: { id: 'seed-child-001' },
    update: {},
    create: {
      id: 'seed-child-001',
      clientId: guardianClient.id,
      firstName: 'Emma',
      lastName: 'Doe',
      dateOfBirth: new Date('2018-04-15'),
      allergies: 'None',
    },
  });
  console.log(`✅ Child: ${child.firstName} ${child.lastName}`);

  const childBooking = await prisma.booking.upsert({
    where: { id: 'seed-booking-child-001' },
    update: {},
    create: {
      id: 'seed-booking-child-001',
      clientId: guardianClient.id,
      activityId: activity.id,
      sessionId: session.id,
      participantType: ParticipantType.CHILD,
      participantChildId: child.id,
      status: BookingStatus.CONFIRMED,
      totalAmount: 25.0,
      currency: 'CAD',
      payment: {
        create: {
          stripePaymentIntentId: 'pi_seed_child_001',
          stripeChargeId: 'ch_seed_child_001',
          stripeTransferId: 'tr_seed_child_001',
          amount: 25.0,
          platformFee: 2.50,
          providerAmount: 22.50,
          currency: 'CAD',
          status: PaymentStatus.COMPLETED,
          method: 'card',
          last4: '1234',
        },
      },
    },
  });
  console.log(`✅ Child booking [CHILD]: ${childBooking.id}`);

  console.log('\n🎉 Seed complete!');
}

main()
  .catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
