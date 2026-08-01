/**
 * Seed script — populates the database with initial demo data.
 * Run with: npm run seed
 */
require('dotenv').config();
const mongoose = require('mongoose');
const dbConnect = require('../api/_lib/dbConnect');

const User = require('../api/_lib/models/User');
const Doctor = require('../api/_lib/models/Doctor');
const Service = require('../api/_lib/models/Service');
const Settings = require('../api/_lib/models/Settings');
const Testimonial = require('../api/_lib/models/Testimonial');

const run = async () => {
  await dbConnect();

  console.log('🌱 Clearing existing data...');
  await Promise.all([
    User.deleteMany({}),
    Doctor.deleteMany({}),
    Service.deleteMany({}),
    Settings.deleteMany({}),
    Testimonial.deleteMany({}),
  ]);

  console.log('🌱 Creating admin user...');
  await User.create({
    name: 'Admin',
    email: 'admin@lotusdental.com',
    password: 'Admin@123', // change immediately after first login
    role: 'admin',
  });

  console.log('🌱 Creating services...');
  const services = await Service.insertMany([
    {
      name: { ar: 'تنظيف وتبييض الأسنان', en: 'Cleaning & Whitening' },
      description: {
        ar: 'إزالة الجير والتصبغات لابتسامة أكثر نصاعة',
        en: 'Removes tartar and stains for a brighter smile',
      },
      icon: 'sparkles',
      durationMinutes: 30,
      price: 500,
      order: 1,
    },
    {
      name: { ar: 'حشوات تجميلية', en: 'Cosmetic Fillings' },
      description: { ar: 'حشوات بلون الأسنان الطبيعي', en: 'Tooth-colored fillings' },
      icon: 'tooth',
      durationMinutes: 45,
      price: 400,
      order: 2,
    },
    {
      name: { ar: 'علاج عصب', en: 'Root Canal Treatment' },
      description: { ar: 'علاج جذور الأسنان المصابة', en: 'Treatment for infected tooth roots' },
      icon: 'activity',
      durationMinutes: 60,
      price: 1200,
      order: 3,
    },
    {
      name: { ar: 'تقويم الأسنان', en: 'Orthodontics (Braces)' },
      description: { ar: 'تقويم معدني أو شفاف', en: 'Metal or clear aligners' },
      icon: 'align-center',
      durationMinutes: 45,
      price: 0,
      showPrice: false,
      order: 4,
    },
    {
      name: { ar: 'زراعة الأسنان', en: 'Dental Implants' },
      description: { ar: 'بدائل ثابتة للأسنان المفقودة', en: 'Permanent replacement for missing teeth' },
      icon: 'anchor',
      durationMinutes: 90,
      price: 0,
      showPrice: false,
      order: 5,
    },
    {
      name: { ar: 'ابتسامة هوليوود (فينير)', en: 'Hollywood Smile (Veneers)' },
      description: { ar: 'تحويل شامل للابتسامة', en: 'Complete smile makeover' },
      icon: 'star',
      durationMinutes: 60,
      price: 0,
      showPrice: false,
      order: 6,
    },
  ]);

  console.log('🌱 Creating doctors...');
  const standardHours = [
    { day: 'sunday', startTime: '10:00', endTime: '18:00' },
    { day: 'monday', startTime: '10:00', endTime: '18:00' },
    { day: 'tuesday', startTime: '10:00', endTime: '18:00' },
    { day: 'wednesday', startTime: '10:00', endTime: '18:00' },
    { day: 'thursday', startTime: '10:00', endTime: '16:00' },
  ];

  await Doctor.insertMany([
    {
      name: { ar: 'د. أحمد المصري', en: 'Dr. Ahmed El-Masry' },
      specialty: { ar: 'استشاري تقويم الأسنان', en: 'Orthodontics Consultant' },
      bio: {
        ar: 'خبرة أكثر من 12 عامًا في تقويم الأسنان للأطفال والبالغين',
        en: 'Over 12 years of experience in orthodontics for children and adults',
      },
      yearsOfExperience: 12,
      qualifications: [{ ar: 'دكتوراه تقويم الأسنان - جامعة القاهرة', en: 'PhD Orthodontics - Cairo University' }],
      workingHours: standardHours,
      services: [services[3]._id],
    },
    {
      name: { ar: 'د. سارة عبد الرحمن', en: 'Dr. Sara AbdelRahman' },
      specialty: { ar: 'أخصائية جراحة الفم والزراعة', en: 'Oral Surgery & Implants Specialist' },
      bio: {
        ar: 'متخصصة في زراعة الأسنان الفورية بأحدث التقنيات',
        en: 'Specialist in immediate dental implants with the latest technology',
      },
      yearsOfExperience: 9,
      qualifications: [{ ar: 'ماجستير جراحة الفم - عين شمس', en: 'MSc Oral Surgery - Ain Shams University' }],
      workingHours: standardHours,
      services: [services[4]._id],
    },
    {
      name: { ar: 'د. مينا فوزي', en: 'Dr. Mina Fawzy' },
      specialty: { ar: 'طب أسنان تجميلي وعام', en: 'Cosmetic & General Dentistry' },
      bio: { ar: 'خبير في ابتسامة هوليوود والتجميل', en: 'Expert in Hollywood smile makeovers' },
      yearsOfExperience: 7,
      qualifications: [{ ar: 'بكالوريوس طب الفم والأسنان - الإسكندرية', en: 'BDS - Alexandria University' }],
      workingHours: standardHours,
      services: [services[0]._id, services[1]._id, services[5]._id],
    },
  ]);

  console.log('🌱 Creating settings...');
  await Settings.create({
    clinicName: { ar: 'عيادة لوتس لطب الأسنان', en: 'Lotus Dental Care' },
    phone: ['+201000000000', '+20221234567'],
    whatsapp: '+201000000000',
    email: 'info@lotusdental.com',
    address: {
      ar: '15 شارع النصر، مدينة نصر، القاهرة',
      en: '15 El Nasr St, Nasr City, Cairo',
    },
    socialLinks: {
      facebook: 'https://facebook.com/lotusdental',
      instagram: 'https://instagram.com/lotusdental',
    },
    workingHours: [
      { day: 'sunday', startTime: '10:00', endTime: '18:00', isClosed: false },
      { day: 'monday', startTime: '10:00', endTime: '18:00', isClosed: false },
      { day: 'tuesday', startTime: '10:00', endTime: '18:00', isClosed: false },
      { day: 'wednesday', startTime: '10:00', endTime: '18:00', isClosed: false },
      { day: 'thursday', startTime: '10:00', endTime: '16:00', isClosed: false },
      { day: 'friday', startTime: '', endTime: '', isClosed: true },
      { day: 'saturday', startTime: '', endTime: '', isClosed: true },
    ],
    aboutUs: {
      ar: 'عيادة لوتس لطب الأسنان تقدم رعاية متكاملة بأحدث الأجهزة وفريق طبي متخصص منذ أكثر من 10 سنوات.',
      en: 'Lotus Dental Care provides comprehensive care with the latest equipment and a specialized medical team for over 10 years.',
    },
    stats: { patients: 5000, yearsExperience: 10, doctorsCount: 3 },
  });

  console.log('🌱 Creating testimonials...');
  await Testimonial.insertMany([
    {
      patientName: 'محمد علي',
      text: {
        ar: 'تجربة رائعة، الدكتور كان محترف جدًا والعيادة نظيفة ومنظمة',
        en: 'Great experience, the doctor was very professional and the clinic was clean and organized',
      },
      rating: 5,
    },
    {
      patientName: 'نور حسن',
      text: {
        ar: 'حجزت أونلاين بسهولة وماكانش في أي انتظار، شكرًا لوتس',
        en: 'Booked online easily with no waiting time, thank you Lotus',
      },
      rating: 5,
    },
  ]);

  console.log('✅ Seeding complete!');
  console.log('   Admin login -> email: admin@lotusdental.com | password: Admin@123');
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
