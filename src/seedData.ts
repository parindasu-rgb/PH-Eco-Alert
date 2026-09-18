import { BuildingInfo, DepartmentInfo, NotificationItem, SystemLog, Ticket, UserProfile } from './types';
import { KKU_LOCATIONS, FACULTIES } from './constants/locations';

export { KKU_LOCATIONS, FACULTIES };


export const DEPARTMENTS: DepartmentInfo[] = [
  {
    id: 'DEP001',
    nameTh: 'กองกายภาพและสิ่งแวดล้อม',
    nameEn: 'Physical Plant & Environment Division',
    responsibleCategory: 'water',
    phone: '043-202-222',
    email: 'envi@kku.ac.th',
  },
  {
    id: 'DEP002',
    nameTh: 'หน่วยจัดการขยะและสิ่งแวดล้อม',
    nameEn: 'Sanitation & Waste Management Unit',
    responsibleCategory: 'waste',
    phone: '043-202-223',
    email: 'waste@kku.ac.th',
  },
  {
    id: 'DEP003',
    nameTh: 'ศูนย์ความปลอดภัย มหาวิทยาลัย (Security Control)',
    nameEn: 'Campus Safety & Security Center',
    responsibleCategory: 'air',
    phone: '043-202-111',
    email: 'safety@kku.ac.th',
  },
  {
    id: 'DEP004',
    nameTh: 'งานป้องกันและยับยั้งภัยพิบัติ / สัตว์พิษ',
    nameEn: 'Disaster Prevention & Pest Control Unit',
    responsibleCategory: 'vector',
    phone: '043-202-999',
    email: 'disaster@kku.ac.th',
  },
];

export const BUILDINGS: BuildingInfo[] = [
  {
    id: 'BLD001',
    nameTh: 'อาคาร EN06 (วิศวกรรมเครื่องกล)',
    nameEn: 'Engineering Building EN06',
    faculty: 'คณะวิศวกรรมศาสตร์ (Faculty of Engineering)',
    latitude: 16.4745,
    longitude: 102.8228,
  },
  {
    id: 'BLD002',
    nameTh: 'ศูนย์อาหาร Student Complex ชั้น 1',
    nameEn: 'Student Complex Cafeteria Floor 1',
    faculty: 'ศูนย์อาหารและบริการ (Student Complex / Cafeteria)',
    latitude: 16.4712,
    longitude: 102.8251,
  },
  {
    id: 'BLD003',
    nameTh: 'อาคารหอสมุดกลาง 1',
    nameEn: 'Central Library Building 1',
    faculty: 'สำนักหอสมุดกลาง (Central Library)',
    latitude: 16.4731,
    longitude: 102.8219,
  },
  {
    id: 'BLD004',
    nameTh: 'หอพักนักศึกษาหญิง 4',
    nameEn: 'Female Student Dormitory 4',
    faculty: 'หอพักนักศึกษา (Student Dormitories)',
    latitude: 16.4782,
    longitude: 102.8265,
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'NTF-001',
    ticketId: 'ENV-2026-000001',
    title: 'อัปเดตสถานะ Ticket: ENV-2026-000001',
    message: 'การแก้ไขปัญหาน้ำเสียบริเวณตึก EN06 เสร็จสิ้นเรียบร้อยแล้ว',
    timestamp: '2026-08-02 14:15:00',
    read: false,
    type: 'status_changed',
  },
  {
    id: 'NTF-002',
    ticketId: 'ENV-2026-000002',
    title: 'รับแจ้งเหตุใหม่: ENV-2026-000002',
    message: 'ขยะล้นถังบริเวณศูนย์อาหาร Complex เข้าสู่ระบบเรียบร้อย',
    timestamp: '2026-08-02 11:20:00',
    read: true,
    type: 'new_ticket',
  },
];

export const INITIAL_SYSTEM_LOGS: SystemLog[] = [
  {
    id: 'LOG-1001',
    userId: 'USR-8821',
    userName: 'กิตติศักดิ์ ชัยชนะ',
    action: 'CREATE_REPORT',
    description: 'ส่งรายงานมลพิษน้ำเสีย Ticket ID: ENV-2026-000001',
    ipAddress: '102.82.14.88',
    timestamp: '2026-08-01 09:30:00',
  },
  {
    id: 'LOG-1002',
    userId: 'OFF-001',
    userName: 'สมชาย มีสุข (Staff)',
    action: 'UPDATE_STATUS',
    description: 'อัปเดตสถานะ ENV-2026-000001 เป็น "resolved"',
    ipAddress: '102.82.10.12',
    timestamp: '2026-08-02 14:15:00',
  },
];

export const INITIAL_USER: UserProfile = {
  id: 'USR-8821',
  name: 'กิตติศักดิ์ ชัยชนะ (Kittisak C.)',
  role: 'student',
  email: 'kittisak.c@kkumail.com',
  studentId: '663040123-4',
  faculty: 'คณะวิศวกรรมศาสตร์ (Faculty of Engineering)',
  phone: '081-234-5678',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
};

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'ENV-2026-000002',
    category: 'waste',
    title: 'ขยะล้นถังและมีเศษขยะกระจัดกระจาย บริเวณจุดคัดแยกขยะ อาคาร 1 คณะสาธารณสุขศาสตร์',
    description: 'ถังขยะแยกประเภทบริเวณด้านข้างอาคาร 1 มีขยะล้นออกมาเป็นจำนวนมาก ส่งกลิ่นเหม็นและเริ่มมีแมลงวันตอม',
    location: {
      faculty: 'คณะสาธารณสุขศาสตร์ (Faculty of Public Health)',
      building: 'อาคาร 1 (อรุณ จิรวัฒน์กุล)',
      roomOrDetails: 'จุดคัดแยกขยะ ชั้น 1 ทางเดินทิศตะวันออก',
      latitude: 16.4691,
      longitude: 102.8272,
    },
    photoUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
    isAnonymous: true,
    reporter: {
      role: 'guest',
    },
    status: 'in_progress',
    urgency: 'medium',
    department: 'หน่วยกายภาพและสิ่งแวดล้อม คณะสาธารณสุขศาสตร์',
    assignedStaff: 'นายช่างประจำคณะสาธารณสุขศาสตร์',
    createdAt: '2026-08-02 11:20:00',
    updatedAt: '2026-08-02 13:00:00',
    timeline: [
      {
        status: 'reported',
        timestamp: '2026-08-02 11:20:00',
        remark: 'รับแจ้งเหตุแบบไม่เปิดเผยตัวตน (Anonymous)',
        updatedBy: 'ระบบอัตโนมัติ (Google Apps Script)',
      },
      {
        status: 'in_progress',
        timestamp: '2026-08-02 13:00:00',
        remark: 'เจ้าหน้าที่เข้าดำเนินการเปลี่ยนถุงขยะ ทำความสะอาดจุดคัดแยก และพ่นน้ำยาฆ่าเชื้อ',
        updatedBy: 'เจ้าหน้าที่สิ่งแวดล้อม คณะสาธารณสุขศาสตร์',
      },
    ],
    aiAnalysis: {
      suggestedCategory: 'waste',
      urgency: 'medium',
      recommendedDepartment: 'หน่วยกายภาพและสิ่งแวดล้อม คณะสาธารณสุขศาสตร์',
      initialSafetyAdvice: 'อย่าสัมผัสขยะโดยตรง และสวมหน้ากากอนามัยขณะเดินผ่าน',
      initialSafetyAdviceEn: 'Do not handle waste directly and wear a mask.',
      aiSummary: 'ขยะล้นถังบริเวณจุดคัดแยกขยะ อาคาร 1 คณะสาธารณสุขศาสตร์',
      aiSummaryEn: 'Overflowing bins at Building 1, Faculty of Public Health.',
    },
  },
  {
    id: 'ENV-2026-000003',
    category: 'water',
    title: 'น้ำประปาไหลอ่อนและมีสีขุ่น บริเวณห้องน้ำชั้น 2 อาคาร 2 (ห้องแล็บอนามัยสิ่งแวดล้อม)',
    description: 'พบน้ำประปามีสีสนิมขุ่นและแรงดันตก ส่งผลกระทบต่อการล้างมือและการทำความสะอาดเครื่องแก้วในแล็บ',
    location: {
      faculty: 'คณะสาธารณสุขศาสตร์ (Faculty of Public Health)',
      building: 'อาคาร 2 (ห้องปฏิบัติการอนามัยสิ่งแวดล้อม)',
      roomOrDetails: 'ห้องน้ำชาย-หญิง ชั้น 2',
      latitude: 16.4694,
      longitude: 102.8269,
    },
    photoUrl: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=800&q=80',
    isAnonymous: false,
    reporter: {
      name: 'ชลธิชา สุขเจริญ',
      email: 'chonthicha.s@kkumail.com',
      studentId: '653020088-1',
      role: 'student',
    },
    status: 'investigating',
    urgency: 'medium',
    department: 'งานซ่อมบำรุงระบบสาธารณูปโภค คณะสาธารณสุขศาสตร์',
    createdAt: '2026-08-02 14:45:00',
    updatedAt: '2026-08-02 15:10:00',
    timeline: [
      {
        status: 'reported',
        timestamp: '2026-08-02 14:45:00',
        remark: 'รับเรื่องแจ้งปัญหาน้ำประปาสีขุ่น',
        updatedBy: 'ระบบอัตโนมัติ (Google Apps Script)',
      },
      {
        status: 'investigating',
        timestamp: '2026-08-02 15:10:00',
        remark: 'ช่างประปาลงพื้นที่ตรวจเช็กถังพักน้ำดาดฟ้าและระบบกรองน้ำ',
        updatedBy: 'ช่างเทคนิค คณะสาธารณสุขศาสตร์',
      },
    ],
  },
  {
    id: 'ENV-2026-000004',
    category: 'vector',
    title: 'พบแหล่งน้ำขังและลูกน้ำยุงลาย บริเวณกระถางต้นไม้สวนหย่อม คณะสาธารณสุขศาสตร์',
    description: 'มีน้ำขังในจานรองกระถางและร่องระบายน้ำรอบสวนหย่อม พบลูกน้ำยุงชุกชุม เสี่ยงต่อการแพร่ระบาดไข้เลือดออก',
    location: {
      faculty: 'คณะสาธารณสุขศาสตร์ (Faculty of Public Health)',
      building: 'สวนหย่อมและลานกิจกรรมหน้าคณะ',
      roomOrDetails: 'บริเวณซุ้มที่นั่งอ่านหนังสือสวนหย่อม',
      latitude: 16.4687,
      longitude: 102.8275,
    },
    photoUrl: 'https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?auto=format&fit=crop&w=800&q=80',
    repairPhotoUrl: 'https://images.unsplash.com/photo-1587049352847-81a56d773cae?auto=format&fit=crop&w=800&q=80',
    isAnonymous: false,
    reporter: {
      name: 'อาจารย์ประจำสาขาวิชาอนามัยสิ่งแวดล้อม',
      role: 'staff',
      email: 'staff.ph@kku.ac.th',
    },
    status: 'resolved',
    urgency: 'critical',
    department: 'กลุ่มงานควบคุมโรคติดต่อและสุขาภิบาล คณะสาธารณสุขศาสตร์',
    assignedStaff: 'ทีมสุขาภิบาลสิ่งแวดล้อม',
    createdAt: '2026-07-28 16:00:00',
    updatedAt: '2026-07-29 10:30:00',
    timeline: [
      {
        status: 'reported',
        timestamp: '2026-07-28 16:00:00',
        remark: 'รับแจ้งเหตุแหล่งเพาะพันธุ์ยุงลาย',
        updatedBy: 'ระบบอัตโนมัติ (Google Apps Script)',
      },
      {
        status: 'in_progress',
        timestamp: '2026-07-28 18:00:00',
        remark: 'ใส่ทรายอะเบท (Abate) กำจัดลูกน้ำ และเทคว่ำจานรองน้ำขังทั้งหมด',
        updatedBy: 'ทีมสุขาภิบาลสิ่งแวดล้อม',
      },
      {
        status: 'resolved',
        timestamp: '2026-07-29 10:30:00',
        remark: 'ตรวจสอบซ้ำ ไม่พบลูกน้ำยุง พร้อมฉีดพ่นละอองฝอย ULV ป้องกันยุงลาย',
        updatedBy: 'ทีมสุขาภิบาลสิ่งแวดล้อม',
      },
    ],
  },
];

