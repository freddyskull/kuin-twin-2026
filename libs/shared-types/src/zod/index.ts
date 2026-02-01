import { z } from 'zod';
import { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

// JSON
//------------------------------------------------------

export type NullableJsonInput = Prisma.JsonValue | null | 'JsonNull' | 'DbNull' | Prisma.NullTypes.DbNull | Prisma.NullTypes.JsonNull;

export const transformJsonNull = (v?: NullableJsonInput) => {
  if (!v || v === 'DbNull') return Prisma.NullTypes.DbNull;
  if (v === 'JsonNull') return Prisma.NullTypes.JsonNull;
  return v;
};

export const JsonValueSchema: z.ZodType<Prisma.JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.literal(null),
    z.record(z.string(), z.lazy(() => JsonValueSchema.optional())),
    z.array(z.lazy(() => JsonValueSchema)),
  ])
);

export type JsonValueType = z.infer<typeof JsonValueSchema>;

export const NullableJsonValue = z
  .union([JsonValueSchema, z.literal('DbNull'), z.literal('JsonNull')])
  .nullable()
  .transform((v) => transformJsonNull(v));

export type NullableJsonValueType = z.infer<typeof NullableJsonValue>;

export const InputJsonValueSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.object({ toJSON: z.any() }),
    z.record(z.string(), z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
    z.array(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
  ])
);

export type InputJsonValueType = z.infer<typeof InputJsonValueSchema>;

// DECIMAL
//------------------------------------------------------

export const DecimalJsLikeSchema: z.ZodType<Prisma.DecimalJsLike> = z.object({
  d: z.array(z.number()),
  e: z.number(),
  s: z.number(),
  toFixed: z.any(),
})

export const DECIMAL_STRING_REGEX = /^(?:-?Infinity|NaN|-?(?:0[bB][01]+(?:\.[01]+)?(?:[pP][-+]?\d+)?|0[oO][0-7]+(?:\.[0-7]+)?(?:[pP][-+]?\d+)?|0[xX][\da-fA-F]+(?:\.[\da-fA-F]+)?(?:[pP][-+]?\d+)?|(?:\d+|\d*\.\d+)(?:[eE][-+]?\d+)?))$/;

export const isValidDecimalInput =
  (v?: null | string | number | Prisma.DecimalJsLike): v is string | number | Prisma.DecimalJsLike => {
    if (v === undefined || v === null) return false;
    return (
      (typeof v === 'object' && 'd' in v && 'e' in v && 's' in v && 'toFixed' in v) ||
      (typeof v === 'string' && DECIMAL_STRING_REGEX.test(v)) ||
      typeof v === 'number'
    )
  };

/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','email','password','role','createdAt','updatedAt']);

export const MessageScalarFieldEnumSchema = z.enum(['id','content','senderId','receiverId','isRead','createdAt']);

export const MediaScalarFieldEnumSchema = z.enum(['id','url','key','fileName','mimeType','size','alt','userId','createdAt']);

export const ProfileScalarFieldEnumSchema = z.enum(['id','userId','displayName','bio','avatarUrl','serviceRadiusKm','ratingAvg','reviewsCount','businessHours','isVerified']);

export const PortfolioItemScalarFieldEnumSchema = z.enum(['id','profileId','imageUrl','description','imageGallery','dynamicAttributes']);

export const CategoryScalarFieldEnumSchema = z.enum(['id','name','slug','description','imageUrl','isActive','parentId']);

export const ServiceUnitScalarFieldEnumSchema = z.enum(['id','name','abbreviation']);

export const ServiceScalarFieldEnumSchema = z.enum(['id','vendorId','categoryId','unitId','title','description','imageUrl','basePrice','isActive','dynamicAttributes']);

export const ServiceMetadataScalarFieldEnumSchema = z.enum(['id','serviceId','key','value']);

export const BookingScalarFieldEnumSchema = z.enum(['id','customerId','serviceId','status','scheduledDate']);

export const BookingDetailsScalarFieldEnumSchema = z.enum(['id','bookingId','serviceSnapshot','unitPrice','quantity','taxTotal','grandTotal']);

export const ServiceSlotScalarFieldEnumSchema = z.enum(['id','serviceId','bookingId','startTime','endTime','status','isRecurring']);

export const PaymentScalarFieldEnumSchema = z.enum(['id','bookingId','amount','processorId','status']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const NullableJsonNullValueInputSchema: z.ZodType<Prisma.NullableJsonNullValueInput> = z.enum(['DbNull','JsonNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.DbNull : value);

export const JsonNullValueInputSchema: z.ZodType<Prisma.JsonNullValueInput> = z.enum(['JsonNull',]).transform((value) => (value === 'JsonNull' ? Prisma.JsonNull : value));

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const JsonNullValueFilterSchema: z.ZodType<Prisma.JsonNullValueFilter> = z.enum(['DbNull','JsonNull','AnyNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.DbNull : value === 'AnyNull' ? Prisma.AnyNull : value);

export const RoleSchema = z.enum(['ADMIN','VENDOR','CUSTOMER']);

export type RoleType = `${z.infer<typeof RoleSchema>}`

export const BookingStatusSchema = z.enum(['PENDING','ACTIVE','COMPLETED','CANCELLED']);

export type BookingStatusType = `${z.infer<typeof BookingStatusSchema>}`

export const SlotStatusSchema = z.enum(['AVAILABLE','BOOKED','BLOCKED']);

export type SlotStatusType = `${z.infer<typeof SlotStatusSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  role: RoleSchema,
  id: z.string().uuid(),
  email: z.string(),
  password: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// MESSAGE SCHEMA
/////////////////////////////////////////

export const MessageSchema = z.object({
  id: z.string().uuid(),
  content: z.string(),
  senderId: z.string(),
  receiverId: z.string(),
  isRead: z.boolean(),
  createdAt: z.coerce.date(),
})

export type Message = z.infer<typeof MessageSchema>

/////////////////////////////////////////
// MEDIA SCHEMA
/////////////////////////////////////////

export const MediaSchema = z.object({
  id: z.string().uuid(),
  url: z.string(),
  key: z.string().nullable(),
  fileName: z.string(),
  mimeType: z.string(),
  size: z.number().int(),
  alt: z.string().nullable(),
  userId: z.string(),
  createdAt: z.coerce.date(),
})

export type Media = z.infer<typeof MediaSchema>

/////////////////////////////////////////
// PROFILE SCHEMA
/////////////////////////////////////////

export const ProfileSchema = z.object({
  id: z.string().uuid(),
  userId: z.string(),
  displayName: z.string(),
  bio: z.string().nullable(),
  avatarUrl: z.string().nullable(),
  serviceRadiusKm: z.number().int(),
  ratingAvg: z.instanceof(Prisma.Decimal, { message: "Field 'ratingAvg' must be a Decimal. Location: ['Models', 'Profile']"}),
  reviewsCount: z.number().int(),
  businessHours: JsonValueSchema.nullable(),
  isVerified: z.boolean(),
})

export type Profile = z.infer<typeof ProfileSchema>

/////////////////////////////////////////
// PORTFOLIO ITEM SCHEMA
/////////////////////////////////////////

export const PortfolioItemSchema = z.object({
  id: z.string().uuid(),
  profileId: z.string(),
  imageUrl: z.string(),
  description: z.string().nullable(),
  imageGallery: z.string().array(),
  dynamicAttributes: JsonValueSchema.nullable(),
})

export type PortfolioItem = z.infer<typeof PortfolioItemSchema>

/////////////////////////////////////////
// CATEGORY SCHEMA
/////////////////////////////////////////

export const CategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  imageUrl: z.string().nullable(),
  isActive: z.boolean(),
  parentId: z.string().nullable(),
})

export type Category = z.infer<typeof CategorySchema>

/////////////////////////////////////////
// SERVICE UNIT SCHEMA
/////////////////////////////////////////

export const ServiceUnitSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  abbreviation: z.string(),
})

export type ServiceUnit = z.infer<typeof ServiceUnitSchema>

/////////////////////////////////////////
// SERVICE SCHEMA
/////////////////////////////////////////

export const ServiceSchema = z.object({
  id: z.string().uuid(),
  vendorId: z.string(),
  categoryId: z.string(),
  unitId: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  imageUrl: z.string().nullable(),
  basePrice: z.instanceof(Prisma.Decimal, { message: "Field 'basePrice' must be a Decimal. Location: ['Models', 'Service']"}),
  isActive: z.boolean(),
  dynamicAttributes: JsonValueSchema.nullable(),
})

export type Service = z.infer<typeof ServiceSchema>

/////////////////////////////////////////
// SERVICE METADATA SCHEMA
/////////////////////////////////////////

export const ServiceMetadataSchema = z.object({
  id: z.string().uuid(),
  serviceId: z.string(),
  key: z.string(),
  value: z.string(),
})

export type ServiceMetadata = z.infer<typeof ServiceMetadataSchema>

/////////////////////////////////////////
// BOOKING SCHEMA
/////////////////////////////////////////

export const BookingSchema = z.object({
  status: BookingStatusSchema,
  id: z.string().uuid(),
  customerId: z.string(),
  serviceId: z.string(),
  scheduledDate: z.coerce.date(),
})

export type Booking = z.infer<typeof BookingSchema>

/////////////////////////////////////////
// BOOKING DETAILS SCHEMA
/////////////////////////////////////////

export const BookingDetailsSchema = z.object({
  id: z.string().uuid(),
  bookingId: z.string(),
  serviceSnapshot: JsonValueSchema,
  unitPrice: z.instanceof(Prisma.Decimal, { message: "Field 'unitPrice' must be a Decimal. Location: ['Models', 'BookingDetails']"}),
  quantity: z.number().int(),
  taxTotal: z.instanceof(Prisma.Decimal, { message: "Field 'taxTotal' must be a Decimal. Location: ['Models', 'BookingDetails']"}),
  grandTotal: z.instanceof(Prisma.Decimal, { message: "Field 'grandTotal' must be a Decimal. Location: ['Models', 'BookingDetails']"}),
})

export type BookingDetails = z.infer<typeof BookingDetailsSchema>

/////////////////////////////////////////
// SERVICE SLOT SCHEMA
/////////////////////////////////////////

export const ServiceSlotSchema = z.object({
  status: SlotStatusSchema,
  id: z.string().uuid(),
  serviceId: z.string(),
  bookingId: z.string().nullable(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  isRecurring: z.boolean(),
})

export type ServiceSlot = z.infer<typeof ServiceSlotSchema>

/////////////////////////////////////////
// PAYMENT SCHEMA
/////////////////////////////////////////

export const PaymentSchema = z.object({
  id: z.string().uuid(),
  bookingId: z.string(),
  amount: z.instanceof(Prisma.Decimal, { message: "Field 'amount' must be a Decimal. Location: ['Models', 'Payment']"}),
  processorId: z.string(),
  status: z.string(),
})

export type Payment = z.infer<typeof PaymentSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  profile: z.union([z.boolean(),z.lazy(() => ProfileArgsSchema)]).optional(),
  services: z.union([z.boolean(),z.lazy(() => ServiceFindManyArgsSchema)]).optional(),
  bookings: z.union([z.boolean(),z.lazy(() => BookingFindManyArgsSchema)]).optional(),
  media: z.union([z.boolean(),z.lazy(() => MediaFindManyArgsSchema)]).optional(),
  sentMessages: z.union([z.boolean(),z.lazy(() => MessageFindManyArgsSchema)]).optional(),
  receivedMessages: z.union([z.boolean(),z.lazy(() => MessageFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const UserArgsSchema: z.ZodType<Prisma.UserDefaultArgs> = z.object({
  select: z.lazy(() => UserSelectSchema).optional(),
  include: z.lazy(() => UserIncludeSchema).optional(),
}).strict();

export const UserCountOutputTypeArgsSchema: z.ZodType<Prisma.UserCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish(),
}).strict();

export const UserCountOutputTypeSelectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = z.object({
  services: z.boolean().optional(),
  bookings: z.boolean().optional(),
  media: z.boolean().optional(),
  sentMessages: z.boolean().optional(),
  receivedMessages: z.boolean().optional(),
}).strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  email: z.boolean().optional(),
  password: z.boolean().optional(),
  role: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  profile: z.union([z.boolean(),z.lazy(() => ProfileArgsSchema)]).optional(),
  services: z.union([z.boolean(),z.lazy(() => ServiceFindManyArgsSchema)]).optional(),
  bookings: z.union([z.boolean(),z.lazy(() => BookingFindManyArgsSchema)]).optional(),
  media: z.union([z.boolean(),z.lazy(() => MediaFindManyArgsSchema)]).optional(),
  sentMessages: z.union([z.boolean(),z.lazy(() => MessageFindManyArgsSchema)]).optional(),
  receivedMessages: z.union([z.boolean(),z.lazy(() => MessageFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

// MESSAGE
//------------------------------------------------------

export const MessageIncludeSchema: z.ZodType<Prisma.MessageInclude> = z.object({
  sender: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  receiver: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict();

export const MessageArgsSchema: z.ZodType<Prisma.MessageDefaultArgs> = z.object({
  select: z.lazy(() => MessageSelectSchema).optional(),
  include: z.lazy(() => MessageIncludeSchema).optional(),
}).strict();

export const MessageSelectSchema: z.ZodType<Prisma.MessageSelect> = z.object({
  id: z.boolean().optional(),
  content: z.boolean().optional(),
  senderId: z.boolean().optional(),
  receiverId: z.boolean().optional(),
  isRead: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  sender: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  receiver: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// MEDIA
//------------------------------------------------------

export const MediaIncludeSchema: z.ZodType<Prisma.MediaInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict();

export const MediaArgsSchema: z.ZodType<Prisma.MediaDefaultArgs> = z.object({
  select: z.lazy(() => MediaSelectSchema).optional(),
  include: z.lazy(() => MediaIncludeSchema).optional(),
}).strict();

export const MediaSelectSchema: z.ZodType<Prisma.MediaSelect> = z.object({
  id: z.boolean().optional(),
  url: z.boolean().optional(),
  key: z.boolean().optional(),
  fileName: z.boolean().optional(),
  mimeType: z.boolean().optional(),
  size: z.boolean().optional(),
  alt: z.boolean().optional(),
  userId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// PROFILE
//------------------------------------------------------

export const ProfileIncludeSchema: z.ZodType<Prisma.ProfileInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  portfolio: z.union([z.boolean(),z.lazy(() => PortfolioItemFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ProfileCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const ProfileArgsSchema: z.ZodType<Prisma.ProfileDefaultArgs> = z.object({
  select: z.lazy(() => ProfileSelectSchema).optional(),
  include: z.lazy(() => ProfileIncludeSchema).optional(),
}).strict();

export const ProfileCountOutputTypeArgsSchema: z.ZodType<Prisma.ProfileCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => ProfileCountOutputTypeSelectSchema).nullish(),
}).strict();

export const ProfileCountOutputTypeSelectSchema: z.ZodType<Prisma.ProfileCountOutputTypeSelect> = z.object({
  portfolio: z.boolean().optional(),
}).strict();

export const ProfileSelectSchema: z.ZodType<Prisma.ProfileSelect> = z.object({
  id: z.boolean().optional(),
  userId: z.boolean().optional(),
  displayName: z.boolean().optional(),
  bio: z.boolean().optional(),
  avatarUrl: z.boolean().optional(),
  serviceRadiusKm: z.boolean().optional(),
  ratingAvg: z.boolean().optional(),
  reviewsCount: z.boolean().optional(),
  businessHours: z.boolean().optional(),
  isVerified: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  portfolio: z.union([z.boolean(),z.lazy(() => PortfolioItemFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ProfileCountOutputTypeArgsSchema)]).optional(),
}).strict()

// PORTFOLIO ITEM
//------------------------------------------------------

export const PortfolioItemIncludeSchema: z.ZodType<Prisma.PortfolioItemInclude> = z.object({
  profile: z.union([z.boolean(),z.lazy(() => ProfileArgsSchema)]).optional(),
}).strict();

export const PortfolioItemArgsSchema: z.ZodType<Prisma.PortfolioItemDefaultArgs> = z.object({
  select: z.lazy(() => PortfolioItemSelectSchema).optional(),
  include: z.lazy(() => PortfolioItemIncludeSchema).optional(),
}).strict();

export const PortfolioItemSelectSchema: z.ZodType<Prisma.PortfolioItemSelect> = z.object({
  id: z.boolean().optional(),
  profileId: z.boolean().optional(),
  imageUrl: z.boolean().optional(),
  description: z.boolean().optional(),
  imageGallery: z.boolean().optional(),
  dynamicAttributes: z.boolean().optional(),
  profile: z.union([z.boolean(),z.lazy(() => ProfileArgsSchema)]).optional(),
}).strict()

// CATEGORY
//------------------------------------------------------

export const CategoryIncludeSchema: z.ZodType<Prisma.CategoryInclude> = z.object({
  parent: z.union([z.boolean(),z.lazy(() => CategoryArgsSchema)]).optional(),
  children: z.union([z.boolean(),z.lazy(() => CategoryFindManyArgsSchema)]).optional(),
  services: z.union([z.boolean(),z.lazy(() => ServiceFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CategoryCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const CategoryArgsSchema: z.ZodType<Prisma.CategoryDefaultArgs> = z.object({
  select: z.lazy(() => CategorySelectSchema).optional(),
  include: z.lazy(() => CategoryIncludeSchema).optional(),
}).strict();

export const CategoryCountOutputTypeArgsSchema: z.ZodType<Prisma.CategoryCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => CategoryCountOutputTypeSelectSchema).nullish(),
}).strict();

export const CategoryCountOutputTypeSelectSchema: z.ZodType<Prisma.CategoryCountOutputTypeSelect> = z.object({
  children: z.boolean().optional(),
  services: z.boolean().optional(),
}).strict();

export const CategorySelectSchema: z.ZodType<Prisma.CategorySelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  slug: z.boolean().optional(),
  description: z.boolean().optional(),
  imageUrl: z.boolean().optional(),
  isActive: z.boolean().optional(),
  parentId: z.boolean().optional(),
  parent: z.union([z.boolean(),z.lazy(() => CategoryArgsSchema)]).optional(),
  children: z.union([z.boolean(),z.lazy(() => CategoryFindManyArgsSchema)]).optional(),
  services: z.union([z.boolean(),z.lazy(() => ServiceFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CategoryCountOutputTypeArgsSchema)]).optional(),
}).strict()

// SERVICE UNIT
//------------------------------------------------------

export const ServiceUnitIncludeSchema: z.ZodType<Prisma.ServiceUnitInclude> = z.object({
  services: z.union([z.boolean(),z.lazy(() => ServiceFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ServiceUnitCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const ServiceUnitArgsSchema: z.ZodType<Prisma.ServiceUnitDefaultArgs> = z.object({
  select: z.lazy(() => ServiceUnitSelectSchema).optional(),
  include: z.lazy(() => ServiceUnitIncludeSchema).optional(),
}).strict();

export const ServiceUnitCountOutputTypeArgsSchema: z.ZodType<Prisma.ServiceUnitCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => ServiceUnitCountOutputTypeSelectSchema).nullish(),
}).strict();

export const ServiceUnitCountOutputTypeSelectSchema: z.ZodType<Prisma.ServiceUnitCountOutputTypeSelect> = z.object({
  services: z.boolean().optional(),
}).strict();

export const ServiceUnitSelectSchema: z.ZodType<Prisma.ServiceUnitSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  abbreviation: z.boolean().optional(),
  services: z.union([z.boolean(),z.lazy(() => ServiceFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ServiceUnitCountOutputTypeArgsSchema)]).optional(),
}).strict()

// SERVICE
//------------------------------------------------------

export const ServiceIncludeSchema: z.ZodType<Prisma.ServiceInclude> = z.object({
  vendor: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  category: z.union([z.boolean(),z.lazy(() => CategoryArgsSchema)]).optional(),
  unit: z.union([z.boolean(),z.lazy(() => ServiceUnitArgsSchema)]).optional(),
  metadata: z.union([z.boolean(),z.lazy(() => ServiceMetadataFindManyArgsSchema)]).optional(),
  slots: z.union([z.boolean(),z.lazy(() => ServiceSlotFindManyArgsSchema)]).optional(),
  bookings: z.union([z.boolean(),z.lazy(() => BookingFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ServiceCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const ServiceArgsSchema: z.ZodType<Prisma.ServiceDefaultArgs> = z.object({
  select: z.lazy(() => ServiceSelectSchema).optional(),
  include: z.lazy(() => ServiceIncludeSchema).optional(),
}).strict();

export const ServiceCountOutputTypeArgsSchema: z.ZodType<Prisma.ServiceCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => ServiceCountOutputTypeSelectSchema).nullish(),
}).strict();

export const ServiceCountOutputTypeSelectSchema: z.ZodType<Prisma.ServiceCountOutputTypeSelect> = z.object({
  metadata: z.boolean().optional(),
  slots: z.boolean().optional(),
  bookings: z.boolean().optional(),
}).strict();

export const ServiceSelectSchema: z.ZodType<Prisma.ServiceSelect> = z.object({
  id: z.boolean().optional(),
  vendorId: z.boolean().optional(),
  categoryId: z.boolean().optional(),
  unitId: z.boolean().optional(),
  title: z.boolean().optional(),
  description: z.boolean().optional(),
  imageUrl: z.boolean().optional(),
  basePrice: z.boolean().optional(),
  isActive: z.boolean().optional(),
  dynamicAttributes: z.boolean().optional(),
  vendor: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  category: z.union([z.boolean(),z.lazy(() => CategoryArgsSchema)]).optional(),
  unit: z.union([z.boolean(),z.lazy(() => ServiceUnitArgsSchema)]).optional(),
  metadata: z.union([z.boolean(),z.lazy(() => ServiceMetadataFindManyArgsSchema)]).optional(),
  slots: z.union([z.boolean(),z.lazy(() => ServiceSlotFindManyArgsSchema)]).optional(),
  bookings: z.union([z.boolean(),z.lazy(() => BookingFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ServiceCountOutputTypeArgsSchema)]).optional(),
}).strict()

// SERVICE METADATA
//------------------------------------------------------

export const ServiceMetadataIncludeSchema: z.ZodType<Prisma.ServiceMetadataInclude> = z.object({
  service: z.union([z.boolean(),z.lazy(() => ServiceArgsSchema)]).optional(),
}).strict();

export const ServiceMetadataArgsSchema: z.ZodType<Prisma.ServiceMetadataDefaultArgs> = z.object({
  select: z.lazy(() => ServiceMetadataSelectSchema).optional(),
  include: z.lazy(() => ServiceMetadataIncludeSchema).optional(),
}).strict();

export const ServiceMetadataSelectSchema: z.ZodType<Prisma.ServiceMetadataSelect> = z.object({
  id: z.boolean().optional(),
  serviceId: z.boolean().optional(),
  key: z.boolean().optional(),
  value: z.boolean().optional(),
  service: z.union([z.boolean(),z.lazy(() => ServiceArgsSchema)]).optional(),
}).strict()

// BOOKING
//------------------------------------------------------

export const BookingIncludeSchema: z.ZodType<Prisma.BookingInclude> = z.object({
  customer: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  service: z.union([z.boolean(),z.lazy(() => ServiceArgsSchema)]).optional(),
  details: z.union([z.boolean(),z.lazy(() => BookingDetailsArgsSchema)]).optional(),
  payment: z.union([z.boolean(),z.lazy(() => PaymentArgsSchema)]).optional(),
  slots: z.union([z.boolean(),z.lazy(() => ServiceSlotFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => BookingCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const BookingArgsSchema: z.ZodType<Prisma.BookingDefaultArgs> = z.object({
  select: z.lazy(() => BookingSelectSchema).optional(),
  include: z.lazy(() => BookingIncludeSchema).optional(),
}).strict();

export const BookingCountOutputTypeArgsSchema: z.ZodType<Prisma.BookingCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => BookingCountOutputTypeSelectSchema).nullish(),
}).strict();

export const BookingCountOutputTypeSelectSchema: z.ZodType<Prisma.BookingCountOutputTypeSelect> = z.object({
  slots: z.boolean().optional(),
}).strict();

export const BookingSelectSchema: z.ZodType<Prisma.BookingSelect> = z.object({
  id: z.boolean().optional(),
  customerId: z.boolean().optional(),
  serviceId: z.boolean().optional(),
  status: z.boolean().optional(),
  scheduledDate: z.boolean().optional(),
  customer: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  service: z.union([z.boolean(),z.lazy(() => ServiceArgsSchema)]).optional(),
  details: z.union([z.boolean(),z.lazy(() => BookingDetailsArgsSchema)]).optional(),
  payment: z.union([z.boolean(),z.lazy(() => PaymentArgsSchema)]).optional(),
  slots: z.union([z.boolean(),z.lazy(() => ServiceSlotFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => BookingCountOutputTypeArgsSchema)]).optional(),
}).strict()

// BOOKING DETAILS
//------------------------------------------------------

export const BookingDetailsIncludeSchema: z.ZodType<Prisma.BookingDetailsInclude> = z.object({
  booking: z.union([z.boolean(),z.lazy(() => BookingArgsSchema)]).optional(),
}).strict();

export const BookingDetailsArgsSchema: z.ZodType<Prisma.BookingDetailsDefaultArgs> = z.object({
  select: z.lazy(() => BookingDetailsSelectSchema).optional(),
  include: z.lazy(() => BookingDetailsIncludeSchema).optional(),
}).strict();

export const BookingDetailsSelectSchema: z.ZodType<Prisma.BookingDetailsSelect> = z.object({
  id: z.boolean().optional(),
  bookingId: z.boolean().optional(),
  serviceSnapshot: z.boolean().optional(),
  unitPrice: z.boolean().optional(),
  quantity: z.boolean().optional(),
  taxTotal: z.boolean().optional(),
  grandTotal: z.boolean().optional(),
  booking: z.union([z.boolean(),z.lazy(() => BookingArgsSchema)]).optional(),
}).strict()

// SERVICE SLOT
//------------------------------------------------------

export const ServiceSlotIncludeSchema: z.ZodType<Prisma.ServiceSlotInclude> = z.object({
  service: z.union([z.boolean(),z.lazy(() => ServiceArgsSchema)]).optional(),
  booking: z.union([z.boolean(),z.lazy(() => BookingArgsSchema)]).optional(),
}).strict();

export const ServiceSlotArgsSchema: z.ZodType<Prisma.ServiceSlotDefaultArgs> = z.object({
  select: z.lazy(() => ServiceSlotSelectSchema).optional(),
  include: z.lazy(() => ServiceSlotIncludeSchema).optional(),
}).strict();

export const ServiceSlotSelectSchema: z.ZodType<Prisma.ServiceSlotSelect> = z.object({
  id: z.boolean().optional(),
  serviceId: z.boolean().optional(),
  bookingId: z.boolean().optional(),
  startTime: z.boolean().optional(),
  endTime: z.boolean().optional(),
  status: z.boolean().optional(),
  isRecurring: z.boolean().optional(),
  service: z.union([z.boolean(),z.lazy(() => ServiceArgsSchema)]).optional(),
  booking: z.union([z.boolean(),z.lazy(() => BookingArgsSchema)]).optional(),
}).strict()

// PAYMENT
//------------------------------------------------------

export const PaymentIncludeSchema: z.ZodType<Prisma.PaymentInclude> = z.object({
  booking: z.union([z.boolean(),z.lazy(() => BookingArgsSchema)]).optional(),
}).strict();

export const PaymentArgsSchema: z.ZodType<Prisma.PaymentDefaultArgs> = z.object({
  select: z.lazy(() => PaymentSelectSchema).optional(),
  include: z.lazy(() => PaymentIncludeSchema).optional(),
}).strict();

export const PaymentSelectSchema: z.ZodType<Prisma.PaymentSelect> = z.object({
  id: z.boolean().optional(),
  bookingId: z.boolean().optional(),
  amount: z.boolean().optional(),
  processorId: z.boolean().optional(),
  status: z.boolean().optional(),
  booking: z.union([z.boolean(),z.lazy(() => BookingArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  password: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  role: z.union([ z.lazy(() => EnumRoleFilterSchema), z.lazy(() => RoleSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  profile: z.union([ z.lazy(() => ProfileNullableScalarRelationFilterSchema), z.lazy(() => ProfileWhereInputSchema) ]).optional().nullable(),
  services: z.lazy(() => ServiceListRelationFilterSchema).optional(),
  bookings: z.lazy(() => BookingListRelationFilterSchema).optional(),
  media: z.lazy(() => MediaListRelationFilterSchema).optional(),
  sentMessages: z.lazy(() => MessageListRelationFilterSchema).optional(),
  receivedMessages: z.lazy(() => MessageListRelationFilterSchema).optional(),
}).strict();

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  profile: z.lazy(() => ProfileOrderByWithRelationInputSchema).optional(),
  services: z.lazy(() => ServiceOrderByRelationAggregateInputSchema).optional(),
  bookings: z.lazy(() => BookingOrderByRelationAggregateInputSchema).optional(),
  media: z.lazy(() => MediaOrderByRelationAggregateInputSchema).optional(),
  sentMessages: z.lazy(() => MessageOrderByRelationAggregateInputSchema).optional(),
  receivedMessages: z.lazy(() => MessageOrderByRelationAggregateInputSchema).optional(),
}).strict();

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.union([
  z.object({
    id: z.uuid(),
    email: z.string(),
  }),
  z.object({
    id: z.uuid(),
  }),
  z.object({
    email: z.string(),
  }),
])
.and(z.object({
  id: z.uuid().optional(),
  email: z.string().optional(),
  AND: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  password: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  role: z.union([ z.lazy(() => EnumRoleFilterSchema), z.lazy(() => RoleSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  profile: z.union([ z.lazy(() => ProfileNullableScalarRelationFilterSchema), z.lazy(() => ProfileWhereInputSchema) ]).optional().nullable(),
  services: z.lazy(() => ServiceListRelationFilterSchema).optional(),
  bookings: z.lazy(() => BookingListRelationFilterSchema).optional(),
  media: z.lazy(() => MediaListRelationFilterSchema).optional(),
  sentMessages: z.lazy(() => MessageListRelationFilterSchema).optional(),
  receivedMessages: z.lazy(() => MessageListRelationFilterSchema).optional(),
}).strict());

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional(),
}).strict();

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema), z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema), z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  password: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  role: z.union([ z.lazy(() => EnumRoleWithAggregatesFilterSchema), z.lazy(() => RoleSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
}).strict();

export const MessageWhereInputSchema: z.ZodType<Prisma.MessageWhereInput> = z.object({
  AND: z.union([ z.lazy(() => MessageWhereInputSchema), z.lazy(() => MessageWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MessageWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MessageWhereInputSchema), z.lazy(() => MessageWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  content: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  senderId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  receiverId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  isRead: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  sender: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
  receiver: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const MessageOrderByWithRelationInputSchema: z.ZodType<Prisma.MessageOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  senderId: z.lazy(() => SortOrderSchema).optional(),
  receiverId: z.lazy(() => SortOrderSchema).optional(),
  isRead: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  sender: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  receiver: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
}).strict();

export const MessageWhereUniqueInputSchema: z.ZodType<Prisma.MessageWhereUniqueInput> = z.object({
  id: z.uuid(),
})
.and(z.object({
  id: z.uuid().optional(),
  AND: z.union([ z.lazy(() => MessageWhereInputSchema), z.lazy(() => MessageWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MessageWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MessageWhereInputSchema), z.lazy(() => MessageWhereInputSchema).array() ]).optional(),
  content: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  senderId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  receiverId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  isRead: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  sender: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
  receiver: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const MessageOrderByWithAggregationInputSchema: z.ZodType<Prisma.MessageOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  senderId: z.lazy(() => SortOrderSchema).optional(),
  receiverId: z.lazy(() => SortOrderSchema).optional(),
  isRead: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => MessageCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => MessageMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => MessageMinOrderByAggregateInputSchema).optional(),
}).strict();

export const MessageScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.MessageScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => MessageScalarWhereWithAggregatesInputSchema), z.lazy(() => MessageScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => MessageScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MessageScalarWhereWithAggregatesInputSchema), z.lazy(() => MessageScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  content: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  senderId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  receiverId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  isRead: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema), z.boolean() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
}).strict();

export const MediaWhereInputSchema: z.ZodType<Prisma.MediaWhereInput> = z.object({
  AND: z.union([ z.lazy(() => MediaWhereInputSchema), z.lazy(() => MediaWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MediaWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MediaWhereInputSchema), z.lazy(() => MediaWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  url: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  key: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  fileName: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  mimeType: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  size: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  alt: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict();

export const MediaOrderByWithRelationInputSchema: z.ZodType<Prisma.MediaOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  key: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  fileName: z.lazy(() => SortOrderSchema).optional(),
  mimeType: z.lazy(() => SortOrderSchema).optional(),
  size: z.lazy(() => SortOrderSchema).optional(),
  alt: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
}).strict();

export const MediaWhereUniqueInputSchema: z.ZodType<Prisma.MediaWhereUniqueInput> = z.object({
  id: z.uuid(),
})
.and(z.object({
  id: z.uuid().optional(),
  AND: z.union([ z.lazy(() => MediaWhereInputSchema), z.lazy(() => MediaWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MediaWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MediaWhereInputSchema), z.lazy(() => MediaWhereInputSchema).array() ]).optional(),
  url: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  key: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  fileName: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  mimeType: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  size: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  alt: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
}).strict());

export const MediaOrderByWithAggregationInputSchema: z.ZodType<Prisma.MediaOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  key: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  fileName: z.lazy(() => SortOrderSchema).optional(),
  mimeType: z.lazy(() => SortOrderSchema).optional(),
  size: z.lazy(() => SortOrderSchema).optional(),
  alt: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => MediaCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => MediaAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => MediaMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => MediaMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => MediaSumOrderByAggregateInputSchema).optional(),
}).strict();

export const MediaScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.MediaScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => MediaScalarWhereWithAggregatesInputSchema), z.lazy(() => MediaScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => MediaScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MediaScalarWhereWithAggregatesInputSchema), z.lazy(() => MediaScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  url: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  key: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  fileName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  mimeType: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  size: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  alt: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
}).strict();

export const ProfileWhereInputSchema: z.ZodType<Prisma.ProfileWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ProfileWhereInputSchema), z.lazy(() => ProfileWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProfileWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProfileWhereInputSchema), z.lazy(() => ProfileWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  displayName: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  bio: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  avatarUrl: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  serviceRadiusKm: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  ratingAvg: z.union([ z.lazy(() => DecimalFilterSchema), z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  reviewsCount: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  businessHours: z.lazy(() => JsonNullableFilterSchema).optional(),
  isVerified: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
  portfolio: z.lazy(() => PortfolioItemListRelationFilterSchema).optional(),
}).strict();

export const ProfileOrderByWithRelationInputSchema: z.ZodType<Prisma.ProfileOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  displayName: z.lazy(() => SortOrderSchema).optional(),
  bio: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  avatarUrl: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  serviceRadiusKm: z.lazy(() => SortOrderSchema).optional(),
  ratingAvg: z.lazy(() => SortOrderSchema).optional(),
  reviewsCount: z.lazy(() => SortOrderSchema).optional(),
  businessHours: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  isVerified: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  portfolio: z.lazy(() => PortfolioItemOrderByRelationAggregateInputSchema).optional(),
}).strict();

export const ProfileWhereUniqueInputSchema: z.ZodType<Prisma.ProfileWhereUniqueInput> = z.union([
  z.object({
    id: z.uuid(),
    userId: z.string(),
  }),
  z.object({
    id: z.uuid(),
  }),
  z.object({
    userId: z.string(),
  }),
])
.and(z.object({
  id: z.uuid().optional(),
  userId: z.string().optional(),
  AND: z.union([ z.lazy(() => ProfileWhereInputSchema), z.lazy(() => ProfileWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProfileWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProfileWhereInputSchema), z.lazy(() => ProfileWhereInputSchema).array() ]).optional(),
  displayName: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  bio: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  avatarUrl: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  serviceRadiusKm: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  ratingAvg: z.union([ z.lazy(() => DecimalFilterSchema), z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  reviewsCount: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  businessHours: z.lazy(() => JsonNullableFilterSchema).optional(),
  isVerified: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
  portfolio: z.lazy(() => PortfolioItemListRelationFilterSchema).optional(),
}).strict());

export const ProfileOrderByWithAggregationInputSchema: z.ZodType<Prisma.ProfileOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  displayName: z.lazy(() => SortOrderSchema).optional(),
  bio: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  avatarUrl: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  serviceRadiusKm: z.lazy(() => SortOrderSchema).optional(),
  ratingAvg: z.lazy(() => SortOrderSchema).optional(),
  reviewsCount: z.lazy(() => SortOrderSchema).optional(),
  businessHours: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  isVerified: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ProfileCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ProfileAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ProfileMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ProfileMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ProfileSumOrderByAggregateInputSchema).optional(),
}).strict();

export const ProfileScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ProfileScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ProfileScalarWhereWithAggregatesInputSchema), z.lazy(() => ProfileScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProfileScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProfileScalarWhereWithAggregatesInputSchema), z.lazy(() => ProfileScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  displayName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  bio: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  avatarUrl: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  serviceRadiusKm: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  ratingAvg: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema), z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  reviewsCount: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  businessHours: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  isVerified: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema), z.boolean() ]).optional(),
}).strict();

export const PortfolioItemWhereInputSchema: z.ZodType<Prisma.PortfolioItemWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PortfolioItemWhereInputSchema), z.lazy(() => PortfolioItemWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PortfolioItemWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PortfolioItemWhereInputSchema), z.lazy(() => PortfolioItemWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  profileId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  imageUrl: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  imageGallery: z.lazy(() => StringNullableListFilterSchema).optional(),
  dynamicAttributes: z.lazy(() => JsonNullableFilterSchema).optional(),
  profile: z.union([ z.lazy(() => ProfileScalarRelationFilterSchema), z.lazy(() => ProfileWhereInputSchema) ]).optional(),
}).strict();

export const PortfolioItemOrderByWithRelationInputSchema: z.ZodType<Prisma.PortfolioItemOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  profileId: z.lazy(() => SortOrderSchema).optional(),
  imageUrl: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  imageGallery: z.lazy(() => SortOrderSchema).optional(),
  dynamicAttributes: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  profile: z.lazy(() => ProfileOrderByWithRelationInputSchema).optional(),
}).strict();

export const PortfolioItemWhereUniqueInputSchema: z.ZodType<Prisma.PortfolioItemWhereUniqueInput> = z.object({
  id: z.uuid(),
})
.and(z.object({
  id: z.uuid().optional(),
  AND: z.union([ z.lazy(() => PortfolioItemWhereInputSchema), z.lazy(() => PortfolioItemWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PortfolioItemWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PortfolioItemWhereInputSchema), z.lazy(() => PortfolioItemWhereInputSchema).array() ]).optional(),
  profileId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  imageUrl: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  imageGallery: z.lazy(() => StringNullableListFilterSchema).optional(),
  dynamicAttributes: z.lazy(() => JsonNullableFilterSchema).optional(),
  profile: z.union([ z.lazy(() => ProfileScalarRelationFilterSchema), z.lazy(() => ProfileWhereInputSchema) ]).optional(),
}).strict());

export const PortfolioItemOrderByWithAggregationInputSchema: z.ZodType<Prisma.PortfolioItemOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  profileId: z.lazy(() => SortOrderSchema).optional(),
  imageUrl: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  imageGallery: z.lazy(() => SortOrderSchema).optional(),
  dynamicAttributes: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => PortfolioItemCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => PortfolioItemMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => PortfolioItemMinOrderByAggregateInputSchema).optional(),
}).strict();

export const PortfolioItemScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.PortfolioItemScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => PortfolioItemScalarWhereWithAggregatesInputSchema), z.lazy(() => PortfolioItemScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => PortfolioItemScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PortfolioItemScalarWhereWithAggregatesInputSchema), z.lazy(() => PortfolioItemScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  profileId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  imageUrl: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  imageGallery: z.lazy(() => StringNullableListFilterSchema).optional(),
  dynamicAttributes: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
}).strict();

export const CategoryWhereInputSchema: z.ZodType<Prisma.CategoryWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CategoryWhereInputSchema), z.lazy(() => CategoryWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CategoryWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CategoryWhereInputSchema), z.lazy(() => CategoryWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  slug: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  imageUrl: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  isActive: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  parentId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  parent: z.union([ z.lazy(() => CategoryNullableScalarRelationFilterSchema), z.lazy(() => CategoryWhereInputSchema) ]).optional().nullable(),
  children: z.lazy(() => CategoryListRelationFilterSchema).optional(),
  services: z.lazy(() => ServiceListRelationFilterSchema).optional(),
}).strict();

export const CategoryOrderByWithRelationInputSchema: z.ZodType<Prisma.CategoryOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  imageUrl: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  isActive: z.lazy(() => SortOrderSchema).optional(),
  parentId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  parent: z.lazy(() => CategoryOrderByWithRelationInputSchema).optional(),
  children: z.lazy(() => CategoryOrderByRelationAggregateInputSchema).optional(),
  services: z.lazy(() => ServiceOrderByRelationAggregateInputSchema).optional(),
}).strict();

export const CategoryWhereUniqueInputSchema: z.ZodType<Prisma.CategoryWhereUniqueInput> = z.union([
  z.object({
    id: z.uuid(),
    name: z.string(),
    slug: z.string(),
  }),
  z.object({
    id: z.uuid(),
    name: z.string(),
  }),
  z.object({
    id: z.uuid(),
    slug: z.string(),
  }),
  z.object({
    id: z.uuid(),
  }),
  z.object({
    name: z.string(),
    slug: z.string(),
  }),
  z.object({
    name: z.string(),
  }),
  z.object({
    slug: z.string(),
  }),
])
.and(z.object({
  id: z.uuid().optional(),
  name: z.string().optional(),
  slug: z.string().optional(),
  AND: z.union([ z.lazy(() => CategoryWhereInputSchema), z.lazy(() => CategoryWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CategoryWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CategoryWhereInputSchema), z.lazy(() => CategoryWhereInputSchema).array() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  imageUrl: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  isActive: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  parentId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  parent: z.union([ z.lazy(() => CategoryNullableScalarRelationFilterSchema), z.lazy(() => CategoryWhereInputSchema) ]).optional().nullable(),
  children: z.lazy(() => CategoryListRelationFilterSchema).optional(),
  services: z.lazy(() => ServiceListRelationFilterSchema).optional(),
}).strict());

export const CategoryOrderByWithAggregationInputSchema: z.ZodType<Prisma.CategoryOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  imageUrl: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  isActive: z.lazy(() => SortOrderSchema).optional(),
  parentId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => CategoryCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => CategoryMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => CategoryMinOrderByAggregateInputSchema).optional(),
}).strict();

export const CategoryScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CategoryScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => CategoryScalarWhereWithAggregatesInputSchema), z.lazy(() => CategoryScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => CategoryScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CategoryScalarWhereWithAggregatesInputSchema), z.lazy(() => CategoryScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  slug: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  imageUrl: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  isActive: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema), z.boolean() ]).optional(),
  parentId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
}).strict();

export const ServiceUnitWhereInputSchema: z.ZodType<Prisma.ServiceUnitWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ServiceUnitWhereInputSchema), z.lazy(() => ServiceUnitWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ServiceUnitWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ServiceUnitWhereInputSchema), z.lazy(() => ServiceUnitWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  abbreviation: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  services: z.lazy(() => ServiceListRelationFilterSchema).optional(),
}).strict();

export const ServiceUnitOrderByWithRelationInputSchema: z.ZodType<Prisma.ServiceUnitOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  abbreviation: z.lazy(() => SortOrderSchema).optional(),
  services: z.lazy(() => ServiceOrderByRelationAggregateInputSchema).optional(),
}).strict();

export const ServiceUnitWhereUniqueInputSchema: z.ZodType<Prisma.ServiceUnitWhereUniqueInput> = z.union([
  z.object({
    id: z.uuid(),
    name: z.string(),
    abbreviation: z.string(),
  }),
  z.object({
    id: z.uuid(),
    name: z.string(),
  }),
  z.object({
    id: z.uuid(),
    abbreviation: z.string(),
  }),
  z.object({
    id: z.uuid(),
  }),
  z.object({
    name: z.string(),
    abbreviation: z.string(),
  }),
  z.object({
    name: z.string(),
  }),
  z.object({
    abbreviation: z.string(),
  }),
])
.and(z.object({
  id: z.uuid().optional(),
  name: z.string().optional(),
  abbreviation: z.string().optional(),
  AND: z.union([ z.lazy(() => ServiceUnitWhereInputSchema), z.lazy(() => ServiceUnitWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ServiceUnitWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ServiceUnitWhereInputSchema), z.lazy(() => ServiceUnitWhereInputSchema).array() ]).optional(),
  services: z.lazy(() => ServiceListRelationFilterSchema).optional(),
}).strict());

export const ServiceUnitOrderByWithAggregationInputSchema: z.ZodType<Prisma.ServiceUnitOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  abbreviation: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ServiceUnitCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ServiceUnitMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ServiceUnitMinOrderByAggregateInputSchema).optional(),
}).strict();

export const ServiceUnitScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ServiceUnitScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ServiceUnitScalarWhereWithAggregatesInputSchema), z.lazy(() => ServiceUnitScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ServiceUnitScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ServiceUnitScalarWhereWithAggregatesInputSchema), z.lazy(() => ServiceUnitScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  abbreviation: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
}).strict();

export const ServiceWhereInputSchema: z.ZodType<Prisma.ServiceWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ServiceWhereInputSchema), z.lazy(() => ServiceWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ServiceWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ServiceWhereInputSchema), z.lazy(() => ServiceWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  vendorId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  categoryId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  unitId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  imageUrl: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  basePrice: z.union([ z.lazy(() => DecimalFilterSchema), z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  isActive: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  dynamicAttributes: z.lazy(() => JsonNullableFilterSchema).optional(),
  vendor: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => CategoryScalarRelationFilterSchema), z.lazy(() => CategoryWhereInputSchema) ]).optional(),
  unit: z.union([ z.lazy(() => ServiceUnitScalarRelationFilterSchema), z.lazy(() => ServiceUnitWhereInputSchema) ]).optional(),
  metadata: z.lazy(() => ServiceMetadataListRelationFilterSchema).optional(),
  slots: z.lazy(() => ServiceSlotListRelationFilterSchema).optional(),
  bookings: z.lazy(() => BookingListRelationFilterSchema).optional(),
}).strict();

export const ServiceOrderByWithRelationInputSchema: z.ZodType<Prisma.ServiceOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  vendorId: z.lazy(() => SortOrderSchema).optional(),
  categoryId: z.lazy(() => SortOrderSchema).optional(),
  unitId: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  imageUrl: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  basePrice: z.lazy(() => SortOrderSchema).optional(),
  isActive: z.lazy(() => SortOrderSchema).optional(),
  dynamicAttributes: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  vendor: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  category: z.lazy(() => CategoryOrderByWithRelationInputSchema).optional(),
  unit: z.lazy(() => ServiceUnitOrderByWithRelationInputSchema).optional(),
  metadata: z.lazy(() => ServiceMetadataOrderByRelationAggregateInputSchema).optional(),
  slots: z.lazy(() => ServiceSlotOrderByRelationAggregateInputSchema).optional(),
  bookings: z.lazy(() => BookingOrderByRelationAggregateInputSchema).optional(),
}).strict();

export const ServiceWhereUniqueInputSchema: z.ZodType<Prisma.ServiceWhereUniqueInput> = z.object({
  id: z.uuid(),
})
.and(z.object({
  id: z.uuid().optional(),
  AND: z.union([ z.lazy(() => ServiceWhereInputSchema), z.lazy(() => ServiceWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ServiceWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ServiceWhereInputSchema), z.lazy(() => ServiceWhereInputSchema).array() ]).optional(),
  vendorId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  categoryId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  unitId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  imageUrl: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  basePrice: z.union([ z.lazy(() => DecimalFilterSchema), z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  isActive: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  dynamicAttributes: z.lazy(() => JsonNullableFilterSchema).optional(),
  vendor: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
  category: z.union([ z.lazy(() => CategoryScalarRelationFilterSchema), z.lazy(() => CategoryWhereInputSchema) ]).optional(),
  unit: z.union([ z.lazy(() => ServiceUnitScalarRelationFilterSchema), z.lazy(() => ServiceUnitWhereInputSchema) ]).optional(),
  metadata: z.lazy(() => ServiceMetadataListRelationFilterSchema).optional(),
  slots: z.lazy(() => ServiceSlotListRelationFilterSchema).optional(),
  bookings: z.lazy(() => BookingListRelationFilterSchema).optional(),
}).strict());

export const ServiceOrderByWithAggregationInputSchema: z.ZodType<Prisma.ServiceOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  vendorId: z.lazy(() => SortOrderSchema).optional(),
  categoryId: z.lazy(() => SortOrderSchema).optional(),
  unitId: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  imageUrl: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  basePrice: z.lazy(() => SortOrderSchema).optional(),
  isActive: z.lazy(() => SortOrderSchema).optional(),
  dynamicAttributes: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => ServiceCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ServiceAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ServiceMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ServiceMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ServiceSumOrderByAggregateInputSchema).optional(),
}).strict();

export const ServiceScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ServiceScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ServiceScalarWhereWithAggregatesInputSchema), z.lazy(() => ServiceScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ServiceScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ServiceScalarWhereWithAggregatesInputSchema), z.lazy(() => ServiceScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  vendorId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  categoryId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  unitId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  imageUrl: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  basePrice: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema), z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  isActive: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema), z.boolean() ]).optional(),
  dynamicAttributes: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
}).strict();

export const ServiceMetadataWhereInputSchema: z.ZodType<Prisma.ServiceMetadataWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ServiceMetadataWhereInputSchema), z.lazy(() => ServiceMetadataWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ServiceMetadataWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ServiceMetadataWhereInputSchema), z.lazy(() => ServiceMetadataWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  serviceId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  key: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  value: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  service: z.union([ z.lazy(() => ServiceScalarRelationFilterSchema), z.lazy(() => ServiceWhereInputSchema) ]).optional(),
}).strict();

export const ServiceMetadataOrderByWithRelationInputSchema: z.ZodType<Prisma.ServiceMetadataOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  serviceId: z.lazy(() => SortOrderSchema).optional(),
  key: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  service: z.lazy(() => ServiceOrderByWithRelationInputSchema).optional(),
}).strict();

export const ServiceMetadataWhereUniqueInputSchema: z.ZodType<Prisma.ServiceMetadataWhereUniqueInput> = z.object({
  id: z.uuid(),
})
.and(z.object({
  id: z.uuid().optional(),
  AND: z.union([ z.lazy(() => ServiceMetadataWhereInputSchema), z.lazy(() => ServiceMetadataWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ServiceMetadataWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ServiceMetadataWhereInputSchema), z.lazy(() => ServiceMetadataWhereInputSchema).array() ]).optional(),
  serviceId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  key: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  value: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  service: z.union([ z.lazy(() => ServiceScalarRelationFilterSchema), z.lazy(() => ServiceWhereInputSchema) ]).optional(),
}).strict());

export const ServiceMetadataOrderByWithAggregationInputSchema: z.ZodType<Prisma.ServiceMetadataOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  serviceId: z.lazy(() => SortOrderSchema).optional(),
  key: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ServiceMetadataCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ServiceMetadataMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ServiceMetadataMinOrderByAggregateInputSchema).optional(),
}).strict();

export const ServiceMetadataScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ServiceMetadataScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ServiceMetadataScalarWhereWithAggregatesInputSchema), z.lazy(() => ServiceMetadataScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ServiceMetadataScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ServiceMetadataScalarWhereWithAggregatesInputSchema), z.lazy(() => ServiceMetadataScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  serviceId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  key: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  value: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
}).strict();

export const BookingWhereInputSchema: z.ZodType<Prisma.BookingWhereInput> = z.object({
  AND: z.union([ z.lazy(() => BookingWhereInputSchema), z.lazy(() => BookingWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => BookingWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BookingWhereInputSchema), z.lazy(() => BookingWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  customerId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  serviceId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  status: z.union([ z.lazy(() => EnumBookingStatusFilterSchema), z.lazy(() => BookingStatusSchema) ]).optional(),
  scheduledDate: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  customer: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
  service: z.union([ z.lazy(() => ServiceScalarRelationFilterSchema), z.lazy(() => ServiceWhereInputSchema) ]).optional(),
  details: z.union([ z.lazy(() => BookingDetailsNullableScalarRelationFilterSchema), z.lazy(() => BookingDetailsWhereInputSchema) ]).optional().nullable(),
  payment: z.union([ z.lazy(() => PaymentNullableScalarRelationFilterSchema), z.lazy(() => PaymentWhereInputSchema) ]).optional().nullable(),
  slots: z.lazy(() => ServiceSlotListRelationFilterSchema).optional(),
}).strict();

export const BookingOrderByWithRelationInputSchema: z.ZodType<Prisma.BookingOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  customerId: z.lazy(() => SortOrderSchema).optional(),
  serviceId: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  scheduledDate: z.lazy(() => SortOrderSchema).optional(),
  customer: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  service: z.lazy(() => ServiceOrderByWithRelationInputSchema).optional(),
  details: z.lazy(() => BookingDetailsOrderByWithRelationInputSchema).optional(),
  payment: z.lazy(() => PaymentOrderByWithRelationInputSchema).optional(),
  slots: z.lazy(() => ServiceSlotOrderByRelationAggregateInputSchema).optional(),
}).strict();

export const BookingWhereUniqueInputSchema: z.ZodType<Prisma.BookingWhereUniqueInput> = z.object({
  id: z.uuid(),
})
.and(z.object({
  id: z.uuid().optional(),
  AND: z.union([ z.lazy(() => BookingWhereInputSchema), z.lazy(() => BookingWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => BookingWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BookingWhereInputSchema), z.lazy(() => BookingWhereInputSchema).array() ]).optional(),
  customerId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  serviceId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  status: z.union([ z.lazy(() => EnumBookingStatusFilterSchema), z.lazy(() => BookingStatusSchema) ]).optional(),
  scheduledDate: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  customer: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
  service: z.union([ z.lazy(() => ServiceScalarRelationFilterSchema), z.lazy(() => ServiceWhereInputSchema) ]).optional(),
  details: z.union([ z.lazy(() => BookingDetailsNullableScalarRelationFilterSchema), z.lazy(() => BookingDetailsWhereInputSchema) ]).optional().nullable(),
  payment: z.union([ z.lazy(() => PaymentNullableScalarRelationFilterSchema), z.lazy(() => PaymentWhereInputSchema) ]).optional().nullable(),
  slots: z.lazy(() => ServiceSlotListRelationFilterSchema).optional(),
}).strict());

export const BookingOrderByWithAggregationInputSchema: z.ZodType<Prisma.BookingOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  customerId: z.lazy(() => SortOrderSchema).optional(),
  serviceId: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  scheduledDate: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => BookingCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => BookingMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => BookingMinOrderByAggregateInputSchema).optional(),
}).strict();

export const BookingScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.BookingScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => BookingScalarWhereWithAggregatesInputSchema), z.lazy(() => BookingScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => BookingScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BookingScalarWhereWithAggregatesInputSchema), z.lazy(() => BookingScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  customerId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  serviceId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  status: z.union([ z.lazy(() => EnumBookingStatusWithAggregatesFilterSchema), z.lazy(() => BookingStatusSchema) ]).optional(),
  scheduledDate: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
}).strict();

export const BookingDetailsWhereInputSchema: z.ZodType<Prisma.BookingDetailsWhereInput> = z.object({
  AND: z.union([ z.lazy(() => BookingDetailsWhereInputSchema), z.lazy(() => BookingDetailsWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => BookingDetailsWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BookingDetailsWhereInputSchema), z.lazy(() => BookingDetailsWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  bookingId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  serviceSnapshot: z.lazy(() => JsonFilterSchema).optional(),
  unitPrice: z.union([ z.lazy(() => DecimalFilterSchema), z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  quantity: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  taxTotal: z.union([ z.lazy(() => DecimalFilterSchema), z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  grandTotal: z.union([ z.lazy(() => DecimalFilterSchema), z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  booking: z.union([ z.lazy(() => BookingScalarRelationFilterSchema), z.lazy(() => BookingWhereInputSchema) ]).optional(),
}).strict();

export const BookingDetailsOrderByWithRelationInputSchema: z.ZodType<Prisma.BookingDetailsOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  bookingId: z.lazy(() => SortOrderSchema).optional(),
  serviceSnapshot: z.lazy(() => SortOrderSchema).optional(),
  unitPrice: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  taxTotal: z.lazy(() => SortOrderSchema).optional(),
  grandTotal: z.lazy(() => SortOrderSchema).optional(),
  booking: z.lazy(() => BookingOrderByWithRelationInputSchema).optional(),
}).strict();

export const BookingDetailsWhereUniqueInputSchema: z.ZodType<Prisma.BookingDetailsWhereUniqueInput> = z.union([
  z.object({
    id: z.uuid(),
    bookingId: z.string(),
  }),
  z.object({
    id: z.uuid(),
  }),
  z.object({
    bookingId: z.string(),
  }),
])
.and(z.object({
  id: z.uuid().optional(),
  bookingId: z.string().optional(),
  AND: z.union([ z.lazy(() => BookingDetailsWhereInputSchema), z.lazy(() => BookingDetailsWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => BookingDetailsWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BookingDetailsWhereInputSchema), z.lazy(() => BookingDetailsWhereInputSchema).array() ]).optional(),
  serviceSnapshot: z.lazy(() => JsonFilterSchema).optional(),
  unitPrice: z.union([ z.lazy(() => DecimalFilterSchema), z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  quantity: z.union([ z.lazy(() => IntFilterSchema), z.number().int() ]).optional(),
  taxTotal: z.union([ z.lazy(() => DecimalFilterSchema), z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  grandTotal: z.union([ z.lazy(() => DecimalFilterSchema), z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  booking: z.union([ z.lazy(() => BookingScalarRelationFilterSchema), z.lazy(() => BookingWhereInputSchema) ]).optional(),
}).strict());

export const BookingDetailsOrderByWithAggregationInputSchema: z.ZodType<Prisma.BookingDetailsOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  bookingId: z.lazy(() => SortOrderSchema).optional(),
  serviceSnapshot: z.lazy(() => SortOrderSchema).optional(),
  unitPrice: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  taxTotal: z.lazy(() => SortOrderSchema).optional(),
  grandTotal: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => BookingDetailsCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => BookingDetailsAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => BookingDetailsMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => BookingDetailsMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => BookingDetailsSumOrderByAggregateInputSchema).optional(),
}).strict();

export const BookingDetailsScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.BookingDetailsScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => BookingDetailsScalarWhereWithAggregatesInputSchema), z.lazy(() => BookingDetailsScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => BookingDetailsScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BookingDetailsScalarWhereWithAggregatesInputSchema), z.lazy(() => BookingDetailsScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  bookingId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  serviceSnapshot: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
  unitPrice: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema), z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  quantity: z.union([ z.lazy(() => IntWithAggregatesFilterSchema), z.number() ]).optional(),
  taxTotal: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema), z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  grandTotal: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema), z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
}).strict();

export const ServiceSlotWhereInputSchema: z.ZodType<Prisma.ServiceSlotWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ServiceSlotWhereInputSchema), z.lazy(() => ServiceSlotWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ServiceSlotWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ServiceSlotWhereInputSchema), z.lazy(() => ServiceSlotWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  serviceId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  bookingId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  startTime: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  endTime: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  status: z.union([ z.lazy(() => EnumSlotStatusFilterSchema), z.lazy(() => SlotStatusSchema) ]).optional(),
  isRecurring: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  service: z.union([ z.lazy(() => ServiceScalarRelationFilterSchema), z.lazy(() => ServiceWhereInputSchema) ]).optional(),
  booking: z.union([ z.lazy(() => BookingNullableScalarRelationFilterSchema), z.lazy(() => BookingWhereInputSchema) ]).optional().nullable(),
}).strict();

export const ServiceSlotOrderByWithRelationInputSchema: z.ZodType<Prisma.ServiceSlotOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  serviceId: z.lazy(() => SortOrderSchema).optional(),
  bookingId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  startTime: z.lazy(() => SortOrderSchema).optional(),
  endTime: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  isRecurring: z.lazy(() => SortOrderSchema).optional(),
  service: z.lazy(() => ServiceOrderByWithRelationInputSchema).optional(),
  booking: z.lazy(() => BookingOrderByWithRelationInputSchema).optional(),
}).strict();

export const ServiceSlotWhereUniqueInputSchema: z.ZodType<Prisma.ServiceSlotWhereUniqueInput> = z.object({
  id: z.uuid(),
})
.and(z.object({
  id: z.uuid().optional(),
  AND: z.union([ z.lazy(() => ServiceSlotWhereInputSchema), z.lazy(() => ServiceSlotWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ServiceSlotWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ServiceSlotWhereInputSchema), z.lazy(() => ServiceSlotWhereInputSchema).array() ]).optional(),
  serviceId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  bookingId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  startTime: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  endTime: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  status: z.union([ z.lazy(() => EnumSlotStatusFilterSchema), z.lazy(() => SlotStatusSchema) ]).optional(),
  isRecurring: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  service: z.union([ z.lazy(() => ServiceScalarRelationFilterSchema), z.lazy(() => ServiceWhereInputSchema) ]).optional(),
  booking: z.union([ z.lazy(() => BookingNullableScalarRelationFilterSchema), z.lazy(() => BookingWhereInputSchema) ]).optional().nullable(),
}).strict());

export const ServiceSlotOrderByWithAggregationInputSchema: z.ZodType<Prisma.ServiceSlotOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  serviceId: z.lazy(() => SortOrderSchema).optional(),
  bookingId: z.union([ z.lazy(() => SortOrderSchema), z.lazy(() => SortOrderInputSchema) ]).optional(),
  startTime: z.lazy(() => SortOrderSchema).optional(),
  endTime: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  isRecurring: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ServiceSlotCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ServiceSlotMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ServiceSlotMinOrderByAggregateInputSchema).optional(),
}).strict();

export const ServiceSlotScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ServiceSlotScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ServiceSlotScalarWhereWithAggregatesInputSchema), z.lazy(() => ServiceSlotScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ServiceSlotScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ServiceSlotScalarWhereWithAggregatesInputSchema), z.lazy(() => ServiceSlotScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  serviceId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  bookingId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  startTime: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  endTime: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  status: z.union([ z.lazy(() => EnumSlotStatusWithAggregatesFilterSchema), z.lazy(() => SlotStatusSchema) ]).optional(),
  isRecurring: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema), z.boolean() ]).optional(),
}).strict();

export const PaymentWhereInputSchema: z.ZodType<Prisma.PaymentWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PaymentWhereInputSchema), z.lazy(() => PaymentWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PaymentWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PaymentWhereInputSchema), z.lazy(() => PaymentWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  bookingId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  amount: z.union([ z.lazy(() => DecimalFilterSchema), z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  processorId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  status: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  booking: z.union([ z.lazy(() => BookingScalarRelationFilterSchema), z.lazy(() => BookingWhereInputSchema) ]).optional(),
}).strict();

export const PaymentOrderByWithRelationInputSchema: z.ZodType<Prisma.PaymentOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  bookingId: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  processorId: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  booking: z.lazy(() => BookingOrderByWithRelationInputSchema).optional(),
}).strict();

export const PaymentWhereUniqueInputSchema: z.ZodType<Prisma.PaymentWhereUniqueInput> = z.union([
  z.object({
    id: z.uuid(),
    bookingId: z.string(),
  }),
  z.object({
    id: z.uuid(),
  }),
  z.object({
    bookingId: z.string(),
  }),
])
.and(z.object({
  id: z.uuid().optional(),
  bookingId: z.string().optional(),
  AND: z.union([ z.lazy(() => PaymentWhereInputSchema), z.lazy(() => PaymentWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PaymentWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PaymentWhereInputSchema), z.lazy(() => PaymentWhereInputSchema).array() ]).optional(),
  amount: z.union([ z.lazy(() => DecimalFilterSchema), z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  processorId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  status: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  booking: z.union([ z.lazy(() => BookingScalarRelationFilterSchema), z.lazy(() => BookingWhereInputSchema) ]).optional(),
}).strict());

export const PaymentOrderByWithAggregationInputSchema: z.ZodType<Prisma.PaymentOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  bookingId: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  processorId: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => PaymentCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => PaymentAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => PaymentMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => PaymentMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => PaymentSumOrderByAggregateInputSchema).optional(),
}).strict();

export const PaymentScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.PaymentScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => PaymentScalarWhereWithAggregatesInputSchema), z.lazy(() => PaymentScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => PaymentScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PaymentScalarWhereWithAggregatesInputSchema), z.lazy(() => PaymentScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  bookingId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  amount: z.union([ z.lazy(() => DecimalWithAggregatesFilterSchema), z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  processorId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  status: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
}).strict();

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.object({
  id: z.uuid().optional(),
  email: z.string(),
  password: z.string(),
  role: z.lazy(() => RoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  profile: z.lazy(() => ProfileCreateNestedOneWithoutUserInputSchema).optional(),
  services: z.lazy(() => ServiceCreateNestedManyWithoutVendorInputSchema).optional(),
  bookings: z.lazy(() => BookingCreateNestedManyWithoutCustomerInputSchema).optional(),
  media: z.lazy(() => MediaCreateNestedManyWithoutUserInputSchema).optional(),
  sentMessages: z.lazy(() => MessageCreateNestedManyWithoutSenderInputSchema).optional(),
  receivedMessages: z.lazy(() => MessageCreateNestedManyWithoutReceiverInputSchema).optional(),
}).strict();

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.object({
  id: z.uuid().optional(),
  email: z.string(),
  password: z.string(),
  role: z.lazy(() => RoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  profile: z.lazy(() => ProfileUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  services: z.lazy(() => ServiceUncheckedCreateNestedManyWithoutVendorInputSchema).optional(),
  bookings: z.lazy(() => BookingUncheckedCreateNestedManyWithoutCustomerInputSchema).optional(),
  media: z.lazy(() => MediaUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sentMessages: z.lazy(() => MessageUncheckedCreateNestedManyWithoutSenderInputSchema).optional(),
  receivedMessages: z.lazy(() => MessageUncheckedCreateNestedManyWithoutReceiverInputSchema).optional(),
}).strict();

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema), z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  profile: z.lazy(() => ProfileUpdateOneWithoutUserNestedInputSchema).optional(),
  services: z.lazy(() => ServiceUpdateManyWithoutVendorNestedInputSchema).optional(),
  bookings: z.lazy(() => BookingUpdateManyWithoutCustomerNestedInputSchema).optional(),
  media: z.lazy(() => MediaUpdateManyWithoutUserNestedInputSchema).optional(),
  sentMessages: z.lazy(() => MessageUpdateManyWithoutSenderNestedInputSchema).optional(),
  receivedMessages: z.lazy(() => MessageUpdateManyWithoutReceiverNestedInputSchema).optional(),
}).strict();

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema), z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  profile: z.lazy(() => ProfileUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  services: z.lazy(() => ServiceUncheckedUpdateManyWithoutVendorNestedInputSchema).optional(),
  bookings: z.lazy(() => BookingUncheckedUpdateManyWithoutCustomerNestedInputSchema).optional(),
  media: z.lazy(() => MediaUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sentMessages: z.lazy(() => MessageUncheckedUpdateManyWithoutSenderNestedInputSchema).optional(),
  receivedMessages: z.lazy(() => MessageUncheckedUpdateManyWithoutReceiverNestedInputSchema).optional(),
}).strict();

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.object({
  id: z.uuid().optional(),
  email: z.string(),
  password: z.string(),
  role: z.lazy(() => RoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
}).strict();

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema), z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema), z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MessageCreateInputSchema: z.ZodType<Prisma.MessageCreateInput> = z.object({
  id: z.uuid().optional(),
  content: z.string(),
  isRead: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  sender: z.lazy(() => UserCreateNestedOneWithoutSentMessagesInputSchema),
  receiver: z.lazy(() => UserCreateNestedOneWithoutReceivedMessagesInputSchema),
}).strict();

export const MessageUncheckedCreateInputSchema: z.ZodType<Prisma.MessageUncheckedCreateInput> = z.object({
  id: z.uuid().optional(),
  content: z.string(),
  senderId: z.string(),
  receiverId: z.string(),
  isRead: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
}).strict();

export const MessageUpdateInputSchema: z.ZodType<Prisma.MessageUpdateInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isRead: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sender: z.lazy(() => UserUpdateOneRequiredWithoutSentMessagesNestedInputSchema).optional(),
  receiver: z.lazy(() => UserUpdateOneRequiredWithoutReceivedMessagesNestedInputSchema).optional(),
}).strict();

export const MessageUncheckedUpdateInputSchema: z.ZodType<Prisma.MessageUncheckedUpdateInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  senderId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  receiverId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isRead: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MessageCreateManyInputSchema: z.ZodType<Prisma.MessageCreateManyInput> = z.object({
  id: z.uuid().optional(),
  content: z.string(),
  senderId: z.string(),
  receiverId: z.string(),
  isRead: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
}).strict();

export const MessageUpdateManyMutationInputSchema: z.ZodType<Prisma.MessageUpdateManyMutationInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isRead: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MessageUncheckedUpdateManyInputSchema: z.ZodType<Prisma.MessageUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  senderId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  receiverId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isRead: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MediaCreateInputSchema: z.ZodType<Prisma.MediaCreateInput> = z.object({
  id: z.uuid().optional(),
  url: z.string(),
  key: z.string().optional().nullable(),
  fileName: z.string(),
  mimeType: z.string(),
  size: z.number().int(),
  alt: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutMediaInputSchema),
}).strict();

export const MediaUncheckedCreateInputSchema: z.ZodType<Prisma.MediaUncheckedCreateInput> = z.object({
  id: z.uuid().optional(),
  url: z.string(),
  key: z.string().optional().nullable(),
  fileName: z.string(),
  mimeType: z.string(),
  size: z.number().int(),
  alt: z.string().optional().nullable(),
  userId: z.string(),
  createdAt: z.coerce.date().optional(),
}).strict();

export const MediaUpdateInputSchema: z.ZodType<Prisma.MediaUpdateInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  key: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  fileName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  mimeType: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  size: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  alt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutMediaNestedInputSchema).optional(),
}).strict();

export const MediaUncheckedUpdateInputSchema: z.ZodType<Prisma.MediaUncheckedUpdateInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  key: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  fileName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  mimeType: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  size: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  alt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MediaCreateManyInputSchema: z.ZodType<Prisma.MediaCreateManyInput> = z.object({
  id: z.uuid().optional(),
  url: z.string(),
  key: z.string().optional().nullable(),
  fileName: z.string(),
  mimeType: z.string(),
  size: z.number().int(),
  alt: z.string().optional().nullable(),
  userId: z.string(),
  createdAt: z.coerce.date().optional(),
}).strict();

export const MediaUpdateManyMutationInputSchema: z.ZodType<Prisma.MediaUpdateManyMutationInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  key: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  fileName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  mimeType: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  size: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  alt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MediaUncheckedUpdateManyInputSchema: z.ZodType<Prisma.MediaUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  key: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  fileName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  mimeType: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  size: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  alt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProfileCreateInputSchema: z.ZodType<Prisma.ProfileCreateInput> = z.object({
  id: z.uuid().optional(),
  displayName: z.string(),
  bio: z.string().optional().nullable(),
  avatarUrl: z.string().optional().nullable(),
  serviceRadiusKm: z.number().int().optional(),
  ratingAvg: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  reviewsCount: z.number().int().optional(),
  businessHours: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  isVerified: z.boolean().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutProfileInputSchema),
  portfolio: z.lazy(() => PortfolioItemCreateNestedManyWithoutProfileInputSchema).optional(),
}).strict();

export const ProfileUncheckedCreateInputSchema: z.ZodType<Prisma.ProfileUncheckedCreateInput> = z.object({
  id: z.uuid().optional(),
  userId: z.string(),
  displayName: z.string(),
  bio: z.string().optional().nullable(),
  avatarUrl: z.string().optional().nullable(),
  serviceRadiusKm: z.number().int().optional(),
  ratingAvg: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  reviewsCount: z.number().int().optional(),
  businessHours: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  isVerified: z.boolean().optional(),
  portfolio: z.lazy(() => PortfolioItemUncheckedCreateNestedManyWithoutProfileInputSchema).optional(),
}).strict();

export const ProfileUpdateInputSchema: z.ZodType<Prisma.ProfileUpdateInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  displayName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  bio: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  avatarUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  serviceRadiusKm: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  ratingAvg: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  reviewsCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  businessHours: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  isVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutProfileNestedInputSchema).optional(),
  portfolio: z.lazy(() => PortfolioItemUpdateManyWithoutProfileNestedInputSchema).optional(),
}).strict();

export const ProfileUncheckedUpdateInputSchema: z.ZodType<Prisma.ProfileUncheckedUpdateInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  displayName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  bio: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  avatarUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  serviceRadiusKm: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  ratingAvg: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  reviewsCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  businessHours: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  isVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  portfolio: z.lazy(() => PortfolioItemUncheckedUpdateManyWithoutProfileNestedInputSchema).optional(),
}).strict();

export const ProfileCreateManyInputSchema: z.ZodType<Prisma.ProfileCreateManyInput> = z.object({
  id: z.uuid().optional(),
  userId: z.string(),
  displayName: z.string(),
  bio: z.string().optional().nullable(),
  avatarUrl: z.string().optional().nullable(),
  serviceRadiusKm: z.number().int().optional(),
  ratingAvg: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  reviewsCount: z.number().int().optional(),
  businessHours: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  isVerified: z.boolean().optional(),
}).strict();

export const ProfileUpdateManyMutationInputSchema: z.ZodType<Prisma.ProfileUpdateManyMutationInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  displayName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  bio: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  avatarUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  serviceRadiusKm: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  ratingAvg: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  reviewsCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  businessHours: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  isVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ProfileUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ProfileUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  displayName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  bio: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  avatarUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  serviceRadiusKm: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  ratingAvg: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  reviewsCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  businessHours: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  isVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PortfolioItemCreateInputSchema: z.ZodType<Prisma.PortfolioItemCreateInput> = z.object({
  id: z.uuid().optional(),
  imageUrl: z.string(),
  description: z.string().optional().nullable(),
  imageGallery: z.union([ z.lazy(() => PortfolioItemCreateimageGalleryInputSchema), z.string().array() ]).optional(),
  dynamicAttributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  profile: z.lazy(() => ProfileCreateNestedOneWithoutPortfolioInputSchema),
}).strict();

export const PortfolioItemUncheckedCreateInputSchema: z.ZodType<Prisma.PortfolioItemUncheckedCreateInput> = z.object({
  id: z.uuid().optional(),
  profileId: z.string(),
  imageUrl: z.string(),
  description: z.string().optional().nullable(),
  imageGallery: z.union([ z.lazy(() => PortfolioItemCreateimageGalleryInputSchema), z.string().array() ]).optional(),
  dynamicAttributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
}).strict();

export const PortfolioItemUpdateInputSchema: z.ZodType<Prisma.PortfolioItemUpdateInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageGallery: z.union([ z.lazy(() => PortfolioItemUpdateimageGalleryInputSchema), z.string().array() ]).optional(),
  dynamicAttributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  profile: z.lazy(() => ProfileUpdateOneRequiredWithoutPortfolioNestedInputSchema).optional(),
}).strict();

export const PortfolioItemUncheckedUpdateInputSchema: z.ZodType<Prisma.PortfolioItemUncheckedUpdateInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  profileId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageGallery: z.union([ z.lazy(() => PortfolioItemUpdateimageGalleryInputSchema), z.string().array() ]).optional(),
  dynamicAttributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
}).strict();

export const PortfolioItemCreateManyInputSchema: z.ZodType<Prisma.PortfolioItemCreateManyInput> = z.object({
  id: z.uuid().optional(),
  profileId: z.string(),
  imageUrl: z.string(),
  description: z.string().optional().nullable(),
  imageGallery: z.union([ z.lazy(() => PortfolioItemCreateimageGalleryInputSchema), z.string().array() ]).optional(),
  dynamicAttributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
}).strict();

export const PortfolioItemUpdateManyMutationInputSchema: z.ZodType<Prisma.PortfolioItemUpdateManyMutationInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageGallery: z.union([ z.lazy(() => PortfolioItemUpdateimageGalleryInputSchema), z.string().array() ]).optional(),
  dynamicAttributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
}).strict();

export const PortfolioItemUncheckedUpdateManyInputSchema: z.ZodType<Prisma.PortfolioItemUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  profileId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageGallery: z.union([ z.lazy(() => PortfolioItemUpdateimageGalleryInputSchema), z.string().array() ]).optional(),
  dynamicAttributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
}).strict();

export const CategoryCreateInputSchema: z.ZodType<Prisma.CategoryCreateInput> = z.object({
  id: z.uuid().optional(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  parent: z.lazy(() => CategoryCreateNestedOneWithoutChildrenInputSchema).optional(),
  children: z.lazy(() => CategoryCreateNestedManyWithoutParentInputSchema).optional(),
  services: z.lazy(() => ServiceCreateNestedManyWithoutCategoryInputSchema).optional(),
}).strict();

export const CategoryUncheckedCreateInputSchema: z.ZodType<Prisma.CategoryUncheckedCreateInput> = z.object({
  id: z.uuid().optional(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  parentId: z.string().optional().nullable(),
  children: z.lazy(() => CategoryUncheckedCreateNestedManyWithoutParentInputSchema).optional(),
  services: z.lazy(() => ServiceUncheckedCreateNestedManyWithoutCategoryInputSchema).optional(),
}).strict();

export const CategoryUpdateInputSchema: z.ZodType<Prisma.CategoryUpdateInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  parent: z.lazy(() => CategoryUpdateOneWithoutChildrenNestedInputSchema).optional(),
  children: z.lazy(() => CategoryUpdateManyWithoutParentNestedInputSchema).optional(),
  services: z.lazy(() => ServiceUpdateManyWithoutCategoryNestedInputSchema).optional(),
}).strict();

export const CategoryUncheckedUpdateInputSchema: z.ZodType<Prisma.CategoryUncheckedUpdateInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  parentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  children: z.lazy(() => CategoryUncheckedUpdateManyWithoutParentNestedInputSchema).optional(),
  services: z.lazy(() => ServiceUncheckedUpdateManyWithoutCategoryNestedInputSchema).optional(),
}).strict();

export const CategoryCreateManyInputSchema: z.ZodType<Prisma.CategoryCreateManyInput> = z.object({
  id: z.uuid().optional(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  parentId: z.string().optional().nullable(),
}).strict();

export const CategoryUpdateManyMutationInputSchema: z.ZodType<Prisma.CategoryUpdateManyMutationInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CategoryUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CategoryUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  parentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const ServiceUnitCreateInputSchema: z.ZodType<Prisma.ServiceUnitCreateInput> = z.object({
  id: z.uuid().optional(),
  name: z.string(),
  abbreviation: z.string(),
  services: z.lazy(() => ServiceCreateNestedManyWithoutUnitInputSchema).optional(),
}).strict();

export const ServiceUnitUncheckedCreateInputSchema: z.ZodType<Prisma.ServiceUnitUncheckedCreateInput> = z.object({
  id: z.uuid().optional(),
  name: z.string(),
  abbreviation: z.string(),
  services: z.lazy(() => ServiceUncheckedCreateNestedManyWithoutUnitInputSchema).optional(),
}).strict();

export const ServiceUnitUpdateInputSchema: z.ZodType<Prisma.ServiceUnitUpdateInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  abbreviation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  services: z.lazy(() => ServiceUpdateManyWithoutUnitNestedInputSchema).optional(),
}).strict();

export const ServiceUnitUncheckedUpdateInputSchema: z.ZodType<Prisma.ServiceUnitUncheckedUpdateInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  abbreviation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  services: z.lazy(() => ServiceUncheckedUpdateManyWithoutUnitNestedInputSchema).optional(),
}).strict();

export const ServiceUnitCreateManyInputSchema: z.ZodType<Prisma.ServiceUnitCreateManyInput> = z.object({
  id: z.uuid().optional(),
  name: z.string(),
  abbreviation: z.string(),
}).strict();

export const ServiceUnitUpdateManyMutationInputSchema: z.ZodType<Prisma.ServiceUnitUpdateManyMutationInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  abbreviation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ServiceUnitUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ServiceUnitUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  abbreviation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ServiceCreateInputSchema: z.ZodType<Prisma.ServiceCreateInput> = z.object({
  id: z.uuid().optional(),
  title: z.string(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  basePrice: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  isActive: z.boolean().optional(),
  dynamicAttributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  vendor: z.lazy(() => UserCreateNestedOneWithoutServicesInputSchema),
  category: z.lazy(() => CategoryCreateNestedOneWithoutServicesInputSchema),
  unit: z.lazy(() => ServiceUnitCreateNestedOneWithoutServicesInputSchema),
  metadata: z.lazy(() => ServiceMetadataCreateNestedManyWithoutServiceInputSchema).optional(),
  slots: z.lazy(() => ServiceSlotCreateNestedManyWithoutServiceInputSchema).optional(),
  bookings: z.lazy(() => BookingCreateNestedManyWithoutServiceInputSchema).optional(),
}).strict();

export const ServiceUncheckedCreateInputSchema: z.ZodType<Prisma.ServiceUncheckedCreateInput> = z.object({
  id: z.uuid().optional(),
  vendorId: z.string(),
  categoryId: z.string(),
  unitId: z.string(),
  title: z.string(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  basePrice: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  isActive: z.boolean().optional(),
  dynamicAttributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  metadata: z.lazy(() => ServiceMetadataUncheckedCreateNestedManyWithoutServiceInputSchema).optional(),
  slots: z.lazy(() => ServiceSlotUncheckedCreateNestedManyWithoutServiceInputSchema).optional(),
  bookings: z.lazy(() => BookingUncheckedCreateNestedManyWithoutServiceInputSchema).optional(),
}).strict();

export const ServiceUpdateInputSchema: z.ZodType<Prisma.ServiceUpdateInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  basePrice: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  dynamicAttributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  vendor: z.lazy(() => UserUpdateOneRequiredWithoutServicesNestedInputSchema).optional(),
  category: z.lazy(() => CategoryUpdateOneRequiredWithoutServicesNestedInputSchema).optional(),
  unit: z.lazy(() => ServiceUnitUpdateOneRequiredWithoutServicesNestedInputSchema).optional(),
  metadata: z.lazy(() => ServiceMetadataUpdateManyWithoutServiceNestedInputSchema).optional(),
  slots: z.lazy(() => ServiceSlotUpdateManyWithoutServiceNestedInputSchema).optional(),
  bookings: z.lazy(() => BookingUpdateManyWithoutServiceNestedInputSchema).optional(),
}).strict();

export const ServiceUncheckedUpdateInputSchema: z.ZodType<Prisma.ServiceUncheckedUpdateInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  vendorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  categoryId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  unitId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  basePrice: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  dynamicAttributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  metadata: z.lazy(() => ServiceMetadataUncheckedUpdateManyWithoutServiceNestedInputSchema).optional(),
  slots: z.lazy(() => ServiceSlotUncheckedUpdateManyWithoutServiceNestedInputSchema).optional(),
  bookings: z.lazy(() => BookingUncheckedUpdateManyWithoutServiceNestedInputSchema).optional(),
}).strict();

export const ServiceCreateManyInputSchema: z.ZodType<Prisma.ServiceCreateManyInput> = z.object({
  id: z.uuid().optional(),
  vendorId: z.string(),
  categoryId: z.string(),
  unitId: z.string(),
  title: z.string(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  basePrice: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  isActive: z.boolean().optional(),
  dynamicAttributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
}).strict();

export const ServiceUpdateManyMutationInputSchema: z.ZodType<Prisma.ServiceUpdateManyMutationInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  basePrice: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  dynamicAttributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
}).strict();

export const ServiceUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ServiceUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  vendorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  categoryId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  unitId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  basePrice: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  dynamicAttributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
}).strict();

export const ServiceMetadataCreateInputSchema: z.ZodType<Prisma.ServiceMetadataCreateInput> = z.object({
  id: z.uuid().optional(),
  key: z.string(),
  value: z.string(),
  service: z.lazy(() => ServiceCreateNestedOneWithoutMetadataInputSchema),
}).strict();

export const ServiceMetadataUncheckedCreateInputSchema: z.ZodType<Prisma.ServiceMetadataUncheckedCreateInput> = z.object({
  id: z.uuid().optional(),
  serviceId: z.string(),
  key: z.string(),
  value: z.string(),
}).strict();

export const ServiceMetadataUpdateInputSchema: z.ZodType<Prisma.ServiceMetadataUpdateInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  key: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  service: z.lazy(() => ServiceUpdateOneRequiredWithoutMetadataNestedInputSchema).optional(),
}).strict();

export const ServiceMetadataUncheckedUpdateInputSchema: z.ZodType<Prisma.ServiceMetadataUncheckedUpdateInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  key: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ServiceMetadataCreateManyInputSchema: z.ZodType<Prisma.ServiceMetadataCreateManyInput> = z.object({
  id: z.uuid().optional(),
  serviceId: z.string(),
  key: z.string(),
  value: z.string(),
}).strict();

export const ServiceMetadataUpdateManyMutationInputSchema: z.ZodType<Prisma.ServiceMetadataUpdateManyMutationInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  key: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ServiceMetadataUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ServiceMetadataUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  key: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BookingCreateInputSchema: z.ZodType<Prisma.BookingCreateInput> = z.object({
  id: z.uuid().optional(),
  status: z.lazy(() => BookingStatusSchema).optional(),
  scheduledDate: z.coerce.date(),
  customer: z.lazy(() => UserCreateNestedOneWithoutBookingsInputSchema),
  service: z.lazy(() => ServiceCreateNestedOneWithoutBookingsInputSchema),
  details: z.lazy(() => BookingDetailsCreateNestedOneWithoutBookingInputSchema).optional(),
  payment: z.lazy(() => PaymentCreateNestedOneWithoutBookingInputSchema).optional(),
  slots: z.lazy(() => ServiceSlotCreateNestedManyWithoutBookingInputSchema).optional(),
}).strict();

export const BookingUncheckedCreateInputSchema: z.ZodType<Prisma.BookingUncheckedCreateInput> = z.object({
  id: z.uuid().optional(),
  customerId: z.string(),
  serviceId: z.string(),
  status: z.lazy(() => BookingStatusSchema).optional(),
  scheduledDate: z.coerce.date(),
  details: z.lazy(() => BookingDetailsUncheckedCreateNestedOneWithoutBookingInputSchema).optional(),
  payment: z.lazy(() => PaymentUncheckedCreateNestedOneWithoutBookingInputSchema).optional(),
  slots: z.lazy(() => ServiceSlotUncheckedCreateNestedManyWithoutBookingInputSchema).optional(),
}).strict();

export const BookingUpdateInputSchema: z.ZodType<Prisma.BookingUpdateInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => BookingStatusSchema), z.lazy(() => EnumBookingStatusFieldUpdateOperationsInputSchema) ]).optional(),
  scheduledDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  customer: z.lazy(() => UserUpdateOneRequiredWithoutBookingsNestedInputSchema).optional(),
  service: z.lazy(() => ServiceUpdateOneRequiredWithoutBookingsNestedInputSchema).optional(),
  details: z.lazy(() => BookingDetailsUpdateOneWithoutBookingNestedInputSchema).optional(),
  payment: z.lazy(() => PaymentUpdateOneWithoutBookingNestedInputSchema).optional(),
  slots: z.lazy(() => ServiceSlotUpdateManyWithoutBookingNestedInputSchema).optional(),
}).strict();

export const BookingUncheckedUpdateInputSchema: z.ZodType<Prisma.BookingUncheckedUpdateInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => BookingStatusSchema), z.lazy(() => EnumBookingStatusFieldUpdateOperationsInputSchema) ]).optional(),
  scheduledDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.lazy(() => BookingDetailsUncheckedUpdateOneWithoutBookingNestedInputSchema).optional(),
  payment: z.lazy(() => PaymentUncheckedUpdateOneWithoutBookingNestedInputSchema).optional(),
  slots: z.lazy(() => ServiceSlotUncheckedUpdateManyWithoutBookingNestedInputSchema).optional(),
}).strict();

export const BookingCreateManyInputSchema: z.ZodType<Prisma.BookingCreateManyInput> = z.object({
  id: z.uuid().optional(),
  customerId: z.string(),
  serviceId: z.string(),
  status: z.lazy(() => BookingStatusSchema).optional(),
  scheduledDate: z.coerce.date(),
}).strict();

export const BookingUpdateManyMutationInputSchema: z.ZodType<Prisma.BookingUpdateManyMutationInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => BookingStatusSchema), z.lazy(() => EnumBookingStatusFieldUpdateOperationsInputSchema) ]).optional(),
  scheduledDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BookingUncheckedUpdateManyInputSchema: z.ZodType<Prisma.BookingUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => BookingStatusSchema), z.lazy(() => EnumBookingStatusFieldUpdateOperationsInputSchema) ]).optional(),
  scheduledDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BookingDetailsCreateInputSchema: z.ZodType<Prisma.BookingDetailsCreateInput> = z.object({
  id: z.uuid().optional(),
  serviceSnapshot: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]),
  unitPrice: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  quantity: z.number().int().optional(),
  taxTotal: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  grandTotal: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  booking: z.lazy(() => BookingCreateNestedOneWithoutDetailsInputSchema),
}).strict();

export const BookingDetailsUncheckedCreateInputSchema: z.ZodType<Prisma.BookingDetailsUncheckedCreateInput> = z.object({
  id: z.uuid().optional(),
  bookingId: z.string(),
  serviceSnapshot: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]),
  unitPrice: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  quantity: z.number().int().optional(),
  taxTotal: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  grandTotal: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
}).strict();

export const BookingDetailsUpdateInputSchema: z.ZodType<Prisma.BookingDetailsUpdateInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceSnapshot: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  unitPrice: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  taxTotal: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  grandTotal: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  booking: z.lazy(() => BookingUpdateOneRequiredWithoutDetailsNestedInputSchema).optional(),
}).strict();

export const BookingDetailsUncheckedUpdateInputSchema: z.ZodType<Prisma.BookingDetailsUncheckedUpdateInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  bookingId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceSnapshot: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  unitPrice: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  taxTotal: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  grandTotal: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BookingDetailsCreateManyInputSchema: z.ZodType<Prisma.BookingDetailsCreateManyInput> = z.object({
  id: z.uuid().optional(),
  bookingId: z.string(),
  serviceSnapshot: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]),
  unitPrice: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  quantity: z.number().int().optional(),
  taxTotal: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  grandTotal: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
}).strict();

export const BookingDetailsUpdateManyMutationInputSchema: z.ZodType<Prisma.BookingDetailsUpdateManyMutationInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceSnapshot: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  unitPrice: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  taxTotal: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  grandTotal: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BookingDetailsUncheckedUpdateManyInputSchema: z.ZodType<Prisma.BookingDetailsUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  bookingId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceSnapshot: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  unitPrice: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  taxTotal: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  grandTotal: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ServiceSlotCreateInputSchema: z.ZodType<Prisma.ServiceSlotCreateInput> = z.object({
  id: z.uuid().optional(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  status: z.lazy(() => SlotStatusSchema).optional(),
  isRecurring: z.boolean().optional(),
  service: z.lazy(() => ServiceCreateNestedOneWithoutSlotsInputSchema),
  booking: z.lazy(() => BookingCreateNestedOneWithoutSlotsInputSchema).optional(),
}).strict();

export const ServiceSlotUncheckedCreateInputSchema: z.ZodType<Prisma.ServiceSlotUncheckedCreateInput> = z.object({
  id: z.uuid().optional(),
  serviceId: z.string(),
  bookingId: z.string().optional().nullable(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  status: z.lazy(() => SlotStatusSchema).optional(),
  isRecurring: z.boolean().optional(),
}).strict();

export const ServiceSlotUpdateInputSchema: z.ZodType<Prisma.ServiceSlotUpdateInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => SlotStatusSchema), z.lazy(() => EnumSlotStatusFieldUpdateOperationsInputSchema) ]).optional(),
  isRecurring: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  service: z.lazy(() => ServiceUpdateOneRequiredWithoutSlotsNestedInputSchema).optional(),
  booking: z.lazy(() => BookingUpdateOneWithoutSlotsNestedInputSchema).optional(),
}).strict();

export const ServiceSlotUncheckedUpdateInputSchema: z.ZodType<Prisma.ServiceSlotUncheckedUpdateInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  bookingId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => SlotStatusSchema), z.lazy(() => EnumSlotStatusFieldUpdateOperationsInputSchema) ]).optional(),
  isRecurring: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ServiceSlotCreateManyInputSchema: z.ZodType<Prisma.ServiceSlotCreateManyInput> = z.object({
  id: z.uuid().optional(),
  serviceId: z.string(),
  bookingId: z.string().optional().nullable(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  status: z.lazy(() => SlotStatusSchema).optional(),
  isRecurring: z.boolean().optional(),
}).strict();

export const ServiceSlotUpdateManyMutationInputSchema: z.ZodType<Prisma.ServiceSlotUpdateManyMutationInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => SlotStatusSchema), z.lazy(() => EnumSlotStatusFieldUpdateOperationsInputSchema) ]).optional(),
  isRecurring: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ServiceSlotUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ServiceSlotUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  bookingId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => SlotStatusSchema), z.lazy(() => EnumSlotStatusFieldUpdateOperationsInputSchema) ]).optional(),
  isRecurring: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PaymentCreateInputSchema: z.ZodType<Prisma.PaymentCreateInput> = z.object({
  id: z.uuid().optional(),
  amount: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  processorId: z.string(),
  status: z.string(),
  booking: z.lazy(() => BookingCreateNestedOneWithoutPaymentInputSchema),
}).strict();

export const PaymentUncheckedCreateInputSchema: z.ZodType<Prisma.PaymentUncheckedCreateInput> = z.object({
  id: z.uuid().optional(),
  bookingId: z.string(),
  amount: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  processorId: z.string(),
  status: z.string(),
}).strict();

export const PaymentUpdateInputSchema: z.ZodType<Prisma.PaymentUpdateInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  processorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  booking: z.lazy(() => BookingUpdateOneRequiredWithoutPaymentNestedInputSchema).optional(),
}).strict();

export const PaymentUncheckedUpdateInputSchema: z.ZodType<Prisma.PaymentUncheckedUpdateInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  bookingId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  processorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PaymentCreateManyInputSchema: z.ZodType<Prisma.PaymentCreateManyInput> = z.object({
  id: z.uuid().optional(),
  bookingId: z.string(),
  amount: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  processorId: z.string(),
  status: z.string(),
}).strict();

export const PaymentUpdateManyMutationInputSchema: z.ZodType<Prisma.PaymentUpdateManyMutationInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  processorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PaymentUncheckedUpdateManyInputSchema: z.ZodType<Prisma.PaymentUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  bookingId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  processorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const EnumRoleFilterSchema: z.ZodType<Prisma.EnumRoleFilter> = z.object({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema), z.lazy(() => NestedEnumRoleFilterSchema) ]).optional(),
}).strict();

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const ProfileNullableScalarRelationFilterSchema: z.ZodType<Prisma.ProfileNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => ProfileWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => ProfileWhereInputSchema).optional().nullable(),
}).strict();

export const ServiceListRelationFilterSchema: z.ZodType<Prisma.ServiceListRelationFilter> = z.object({
  every: z.lazy(() => ServiceWhereInputSchema).optional(),
  some: z.lazy(() => ServiceWhereInputSchema).optional(),
  none: z.lazy(() => ServiceWhereInputSchema).optional(),
}).strict();

export const BookingListRelationFilterSchema: z.ZodType<Prisma.BookingListRelationFilter> = z.object({
  every: z.lazy(() => BookingWhereInputSchema).optional(),
  some: z.lazy(() => BookingWhereInputSchema).optional(),
  none: z.lazy(() => BookingWhereInputSchema).optional(),
}).strict();

export const MediaListRelationFilterSchema: z.ZodType<Prisma.MediaListRelationFilter> = z.object({
  every: z.lazy(() => MediaWhereInputSchema).optional(),
  some: z.lazy(() => MediaWhereInputSchema).optional(),
  none: z.lazy(() => MediaWhereInputSchema).optional(),
}).strict();

export const MessageListRelationFilterSchema: z.ZodType<Prisma.MessageListRelationFilter> = z.object({
  every: z.lazy(() => MessageWhereInputSchema).optional(),
  some: z.lazy(() => MessageWhereInputSchema).optional(),
  none: z.lazy(() => MessageWhereInputSchema).optional(),
}).strict();

export const ServiceOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ServiceOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const BookingOrderByRelationAggregateInputSchema: z.ZodType<Prisma.BookingOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const MediaOrderByRelationAggregateInputSchema: z.ZodType<Prisma.MediaOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const MessageOrderByRelationAggregateInputSchema: z.ZodType<Prisma.MessageOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional(),
}).strict();

export const EnumRoleWithAggregatesFilterSchema: z.ZodType<Prisma.EnumRoleWithAggregatesFilter> = z.object({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema), z.lazy(() => NestedEnumRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumRoleFilterSchema).optional(),
}).strict();

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional(),
}).strict();

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const UserScalarRelationFilterSchema: z.ZodType<Prisma.UserScalarRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional(),
}).strict();

export const MessageCountOrderByAggregateInputSchema: z.ZodType<Prisma.MessageCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  senderId: z.lazy(() => SortOrderSchema).optional(),
  receiverId: z.lazy(() => SortOrderSchema).optional(),
  isRead: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const MessageMaxOrderByAggregateInputSchema: z.ZodType<Prisma.MessageMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  senderId: z.lazy(() => SortOrderSchema).optional(),
  receiverId: z.lazy(() => SortOrderSchema).optional(),
  isRead: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const MessageMinOrderByAggregateInputSchema: z.ZodType<Prisma.MessageMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  content: z.lazy(() => SortOrderSchema).optional(),
  senderId: z.lazy(() => SortOrderSchema).optional(),
  receiverId: z.lazy(() => SortOrderSchema).optional(),
  isRead: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional(),
}).strict();

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.object({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional(),
}).strict();

export const MediaCountOrderByAggregateInputSchema: z.ZodType<Prisma.MediaCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  key: z.lazy(() => SortOrderSchema).optional(),
  fileName: z.lazy(() => SortOrderSchema).optional(),
  mimeType: z.lazy(() => SortOrderSchema).optional(),
  size: z.lazy(() => SortOrderSchema).optional(),
  alt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const MediaAvgOrderByAggregateInputSchema: z.ZodType<Prisma.MediaAvgOrderByAggregateInput> = z.object({
  size: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const MediaMaxOrderByAggregateInputSchema: z.ZodType<Prisma.MediaMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  key: z.lazy(() => SortOrderSchema).optional(),
  fileName: z.lazy(() => SortOrderSchema).optional(),
  mimeType: z.lazy(() => SortOrderSchema).optional(),
  size: z.lazy(() => SortOrderSchema).optional(),
  alt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const MediaMinOrderByAggregateInputSchema: z.ZodType<Prisma.MediaMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  key: z.lazy(() => SortOrderSchema).optional(),
  fileName: z.lazy(() => SortOrderSchema).optional(),
  mimeType: z.lazy(() => SortOrderSchema).optional(),
  size: z.lazy(() => SortOrderSchema).optional(),
  alt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const MediaSumOrderByAggregateInputSchema: z.ZodType<Prisma.MediaSumOrderByAggregateInput> = z.object({
  size: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional(),
}).strict();

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional(),
}).strict();

export const DecimalFilterSchema: z.ZodType<Prisma.DecimalFilter> = z.object({
  equals: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  in: z.union([z.number().array(),z.string().array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  notIn: z.union([z.number().array(),z.string().array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  lt: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lte: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gt: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gte: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  not: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NestedDecimalFilterSchema) ]).optional(),
}).strict();

export const JsonNullableFilterSchema: z.ZodType<Prisma.JsonNullableFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
}).strict();

export const PortfolioItemListRelationFilterSchema: z.ZodType<Prisma.PortfolioItemListRelationFilter> = z.object({
  every: z.lazy(() => PortfolioItemWhereInputSchema).optional(),
  some: z.lazy(() => PortfolioItemWhereInputSchema).optional(),
  none: z.lazy(() => PortfolioItemWhereInputSchema).optional(),
}).strict();

export const PortfolioItemOrderByRelationAggregateInputSchema: z.ZodType<Prisma.PortfolioItemOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const ProfileCountOrderByAggregateInputSchema: z.ZodType<Prisma.ProfileCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  displayName: z.lazy(() => SortOrderSchema).optional(),
  bio: z.lazy(() => SortOrderSchema).optional(),
  avatarUrl: z.lazy(() => SortOrderSchema).optional(),
  serviceRadiusKm: z.lazy(() => SortOrderSchema).optional(),
  ratingAvg: z.lazy(() => SortOrderSchema).optional(),
  reviewsCount: z.lazy(() => SortOrderSchema).optional(),
  businessHours: z.lazy(() => SortOrderSchema).optional(),
  isVerified: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const ProfileAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ProfileAvgOrderByAggregateInput> = z.object({
  serviceRadiusKm: z.lazy(() => SortOrderSchema).optional(),
  ratingAvg: z.lazy(() => SortOrderSchema).optional(),
  reviewsCount: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const ProfileMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ProfileMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  displayName: z.lazy(() => SortOrderSchema).optional(),
  bio: z.lazy(() => SortOrderSchema).optional(),
  avatarUrl: z.lazy(() => SortOrderSchema).optional(),
  serviceRadiusKm: z.lazy(() => SortOrderSchema).optional(),
  ratingAvg: z.lazy(() => SortOrderSchema).optional(),
  reviewsCount: z.lazy(() => SortOrderSchema).optional(),
  isVerified: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const ProfileMinOrderByAggregateInputSchema: z.ZodType<Prisma.ProfileMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  displayName: z.lazy(() => SortOrderSchema).optional(),
  bio: z.lazy(() => SortOrderSchema).optional(),
  avatarUrl: z.lazy(() => SortOrderSchema).optional(),
  serviceRadiusKm: z.lazy(() => SortOrderSchema).optional(),
  ratingAvg: z.lazy(() => SortOrderSchema).optional(),
  reviewsCount: z.lazy(() => SortOrderSchema).optional(),
  isVerified: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const ProfileSumOrderByAggregateInputSchema: z.ZodType<Prisma.ProfileSumOrderByAggregateInput> = z.object({
  serviceRadiusKm: z.lazy(() => SortOrderSchema).optional(),
  ratingAvg: z.lazy(() => SortOrderSchema).optional(),
  reviewsCount: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const DecimalWithAggregatesFilterSchema: z.ZodType<Prisma.DecimalWithAggregatesFilter> = z.object({
  equals: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  in: z.union([z.number().array(),z.string().array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  notIn: z.union([z.number().array(),z.string().array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  lt: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lte: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gt: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gte: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  not: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NestedDecimalWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedDecimalFilterSchema).optional(),
  _sum: z.lazy(() => NestedDecimalFilterSchema).optional(),
  _min: z.lazy(() => NestedDecimalFilterSchema).optional(),
  _max: z.lazy(() => NestedDecimalFilterSchema).optional(),
}).strict();

export const JsonNullableWithAggregatesFilterSchema: z.ZodType<Prisma.JsonNullableWithAggregatesFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedJsonNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedJsonNullableFilterSchema).optional(),
}).strict();

export const StringNullableListFilterSchema: z.ZodType<Prisma.StringNullableListFilter> = z.object({
  equals: z.string().array().optional().nullable(),
  has: z.string().optional().nullable(),
  hasEvery: z.string().array().optional(),
  hasSome: z.string().array().optional(),
  isEmpty: z.boolean().optional(),
}).strict();

export const ProfileScalarRelationFilterSchema: z.ZodType<Prisma.ProfileScalarRelationFilter> = z.object({
  is: z.lazy(() => ProfileWhereInputSchema).optional(),
  isNot: z.lazy(() => ProfileWhereInputSchema).optional(),
}).strict();

export const PortfolioItemCountOrderByAggregateInputSchema: z.ZodType<Prisma.PortfolioItemCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  profileId: z.lazy(() => SortOrderSchema).optional(),
  imageUrl: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  imageGallery: z.lazy(() => SortOrderSchema).optional(),
  dynamicAttributes: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const PortfolioItemMaxOrderByAggregateInputSchema: z.ZodType<Prisma.PortfolioItemMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  profileId: z.lazy(() => SortOrderSchema).optional(),
  imageUrl: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const PortfolioItemMinOrderByAggregateInputSchema: z.ZodType<Prisma.PortfolioItemMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  profileId: z.lazy(() => SortOrderSchema).optional(),
  imageUrl: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const CategoryNullableScalarRelationFilterSchema: z.ZodType<Prisma.CategoryNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => CategoryWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => CategoryWhereInputSchema).optional().nullable(),
}).strict();

export const CategoryListRelationFilterSchema: z.ZodType<Prisma.CategoryListRelationFilter> = z.object({
  every: z.lazy(() => CategoryWhereInputSchema).optional(),
  some: z.lazy(() => CategoryWhereInputSchema).optional(),
  none: z.lazy(() => CategoryWhereInputSchema).optional(),
}).strict();

export const CategoryOrderByRelationAggregateInputSchema: z.ZodType<Prisma.CategoryOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const CategoryCountOrderByAggregateInputSchema: z.ZodType<Prisma.CategoryCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  imageUrl: z.lazy(() => SortOrderSchema).optional(),
  isActive: z.lazy(() => SortOrderSchema).optional(),
  parentId: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const CategoryMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CategoryMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  imageUrl: z.lazy(() => SortOrderSchema).optional(),
  isActive: z.lazy(() => SortOrderSchema).optional(),
  parentId: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const CategoryMinOrderByAggregateInputSchema: z.ZodType<Prisma.CategoryMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  imageUrl: z.lazy(() => SortOrderSchema).optional(),
  isActive: z.lazy(() => SortOrderSchema).optional(),
  parentId: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const ServiceUnitCountOrderByAggregateInputSchema: z.ZodType<Prisma.ServiceUnitCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  abbreviation: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const ServiceUnitMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ServiceUnitMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  abbreviation: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const ServiceUnitMinOrderByAggregateInputSchema: z.ZodType<Prisma.ServiceUnitMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  abbreviation: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const CategoryScalarRelationFilterSchema: z.ZodType<Prisma.CategoryScalarRelationFilter> = z.object({
  is: z.lazy(() => CategoryWhereInputSchema).optional(),
  isNot: z.lazy(() => CategoryWhereInputSchema).optional(),
}).strict();

export const ServiceUnitScalarRelationFilterSchema: z.ZodType<Prisma.ServiceUnitScalarRelationFilter> = z.object({
  is: z.lazy(() => ServiceUnitWhereInputSchema).optional(),
  isNot: z.lazy(() => ServiceUnitWhereInputSchema).optional(),
}).strict();

export const ServiceMetadataListRelationFilterSchema: z.ZodType<Prisma.ServiceMetadataListRelationFilter> = z.object({
  every: z.lazy(() => ServiceMetadataWhereInputSchema).optional(),
  some: z.lazy(() => ServiceMetadataWhereInputSchema).optional(),
  none: z.lazy(() => ServiceMetadataWhereInputSchema).optional(),
}).strict();

export const ServiceSlotListRelationFilterSchema: z.ZodType<Prisma.ServiceSlotListRelationFilter> = z.object({
  every: z.lazy(() => ServiceSlotWhereInputSchema).optional(),
  some: z.lazy(() => ServiceSlotWhereInputSchema).optional(),
  none: z.lazy(() => ServiceSlotWhereInputSchema).optional(),
}).strict();

export const ServiceMetadataOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ServiceMetadataOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const ServiceSlotOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ServiceSlotOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const ServiceCountOrderByAggregateInputSchema: z.ZodType<Prisma.ServiceCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  vendorId: z.lazy(() => SortOrderSchema).optional(),
  categoryId: z.lazy(() => SortOrderSchema).optional(),
  unitId: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  imageUrl: z.lazy(() => SortOrderSchema).optional(),
  basePrice: z.lazy(() => SortOrderSchema).optional(),
  isActive: z.lazy(() => SortOrderSchema).optional(),
  dynamicAttributes: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const ServiceAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ServiceAvgOrderByAggregateInput> = z.object({
  basePrice: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const ServiceMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ServiceMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  vendorId: z.lazy(() => SortOrderSchema).optional(),
  categoryId: z.lazy(() => SortOrderSchema).optional(),
  unitId: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  imageUrl: z.lazy(() => SortOrderSchema).optional(),
  basePrice: z.lazy(() => SortOrderSchema).optional(),
  isActive: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const ServiceMinOrderByAggregateInputSchema: z.ZodType<Prisma.ServiceMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  vendorId: z.lazy(() => SortOrderSchema).optional(),
  categoryId: z.lazy(() => SortOrderSchema).optional(),
  unitId: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  imageUrl: z.lazy(() => SortOrderSchema).optional(),
  basePrice: z.lazy(() => SortOrderSchema).optional(),
  isActive: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const ServiceSumOrderByAggregateInputSchema: z.ZodType<Prisma.ServiceSumOrderByAggregateInput> = z.object({
  basePrice: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const ServiceScalarRelationFilterSchema: z.ZodType<Prisma.ServiceScalarRelationFilter> = z.object({
  is: z.lazy(() => ServiceWhereInputSchema).optional(),
  isNot: z.lazy(() => ServiceWhereInputSchema).optional(),
}).strict();

export const ServiceMetadataCountOrderByAggregateInputSchema: z.ZodType<Prisma.ServiceMetadataCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  serviceId: z.lazy(() => SortOrderSchema).optional(),
  key: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const ServiceMetadataMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ServiceMetadataMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  serviceId: z.lazy(() => SortOrderSchema).optional(),
  key: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const ServiceMetadataMinOrderByAggregateInputSchema: z.ZodType<Prisma.ServiceMetadataMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  serviceId: z.lazy(() => SortOrderSchema).optional(),
  key: z.lazy(() => SortOrderSchema).optional(),
  value: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const EnumBookingStatusFilterSchema: z.ZodType<Prisma.EnumBookingStatusFilter> = z.object({
  equals: z.lazy(() => BookingStatusSchema).optional(),
  in: z.lazy(() => BookingStatusSchema).array().optional(),
  notIn: z.lazy(() => BookingStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => BookingStatusSchema), z.lazy(() => NestedEnumBookingStatusFilterSchema) ]).optional(),
}).strict();

export const BookingDetailsNullableScalarRelationFilterSchema: z.ZodType<Prisma.BookingDetailsNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => BookingDetailsWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => BookingDetailsWhereInputSchema).optional().nullable(),
}).strict();

export const PaymentNullableScalarRelationFilterSchema: z.ZodType<Prisma.PaymentNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => PaymentWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => PaymentWhereInputSchema).optional().nullable(),
}).strict();

export const BookingCountOrderByAggregateInputSchema: z.ZodType<Prisma.BookingCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  customerId: z.lazy(() => SortOrderSchema).optional(),
  serviceId: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  scheduledDate: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const BookingMaxOrderByAggregateInputSchema: z.ZodType<Prisma.BookingMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  customerId: z.lazy(() => SortOrderSchema).optional(),
  serviceId: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  scheduledDate: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const BookingMinOrderByAggregateInputSchema: z.ZodType<Prisma.BookingMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  customerId: z.lazy(() => SortOrderSchema).optional(),
  serviceId: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  scheduledDate: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const EnumBookingStatusWithAggregatesFilterSchema: z.ZodType<Prisma.EnumBookingStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => BookingStatusSchema).optional(),
  in: z.lazy(() => BookingStatusSchema).array().optional(),
  notIn: z.lazy(() => BookingStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => BookingStatusSchema), z.lazy(() => NestedEnumBookingStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumBookingStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumBookingStatusFilterSchema).optional(),
}).strict();

export const JsonFilterSchema: z.ZodType<Prisma.JsonFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
}).strict();

export const BookingScalarRelationFilterSchema: z.ZodType<Prisma.BookingScalarRelationFilter> = z.object({
  is: z.lazy(() => BookingWhereInputSchema).optional(),
  isNot: z.lazy(() => BookingWhereInputSchema).optional(),
}).strict();

export const BookingDetailsCountOrderByAggregateInputSchema: z.ZodType<Prisma.BookingDetailsCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  bookingId: z.lazy(() => SortOrderSchema).optional(),
  serviceSnapshot: z.lazy(() => SortOrderSchema).optional(),
  unitPrice: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  taxTotal: z.lazy(() => SortOrderSchema).optional(),
  grandTotal: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const BookingDetailsAvgOrderByAggregateInputSchema: z.ZodType<Prisma.BookingDetailsAvgOrderByAggregateInput> = z.object({
  unitPrice: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  taxTotal: z.lazy(() => SortOrderSchema).optional(),
  grandTotal: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const BookingDetailsMaxOrderByAggregateInputSchema: z.ZodType<Prisma.BookingDetailsMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  bookingId: z.lazy(() => SortOrderSchema).optional(),
  unitPrice: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  taxTotal: z.lazy(() => SortOrderSchema).optional(),
  grandTotal: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const BookingDetailsMinOrderByAggregateInputSchema: z.ZodType<Prisma.BookingDetailsMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  bookingId: z.lazy(() => SortOrderSchema).optional(),
  unitPrice: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  taxTotal: z.lazy(() => SortOrderSchema).optional(),
  grandTotal: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const BookingDetailsSumOrderByAggregateInputSchema: z.ZodType<Prisma.BookingDetailsSumOrderByAggregateInput> = z.object({
  unitPrice: z.lazy(() => SortOrderSchema).optional(),
  quantity: z.lazy(() => SortOrderSchema).optional(),
  taxTotal: z.lazy(() => SortOrderSchema).optional(),
  grandTotal: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const JsonWithAggregatesFilterSchema: z.ZodType<Prisma.JsonWithAggregatesFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedJsonFilterSchema).optional(),
  _max: z.lazy(() => NestedJsonFilterSchema).optional(),
}).strict();

export const EnumSlotStatusFilterSchema: z.ZodType<Prisma.EnumSlotStatusFilter> = z.object({
  equals: z.lazy(() => SlotStatusSchema).optional(),
  in: z.lazy(() => SlotStatusSchema).array().optional(),
  notIn: z.lazy(() => SlotStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => SlotStatusSchema), z.lazy(() => NestedEnumSlotStatusFilterSchema) ]).optional(),
}).strict();

export const BookingNullableScalarRelationFilterSchema: z.ZodType<Prisma.BookingNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => BookingWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => BookingWhereInputSchema).optional().nullable(),
}).strict();

export const ServiceSlotCountOrderByAggregateInputSchema: z.ZodType<Prisma.ServiceSlotCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  serviceId: z.lazy(() => SortOrderSchema).optional(),
  bookingId: z.lazy(() => SortOrderSchema).optional(),
  startTime: z.lazy(() => SortOrderSchema).optional(),
  endTime: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  isRecurring: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const ServiceSlotMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ServiceSlotMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  serviceId: z.lazy(() => SortOrderSchema).optional(),
  bookingId: z.lazy(() => SortOrderSchema).optional(),
  startTime: z.lazy(() => SortOrderSchema).optional(),
  endTime: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  isRecurring: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const ServiceSlotMinOrderByAggregateInputSchema: z.ZodType<Prisma.ServiceSlotMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  serviceId: z.lazy(() => SortOrderSchema).optional(),
  bookingId: z.lazy(() => SortOrderSchema).optional(),
  startTime: z.lazy(() => SortOrderSchema).optional(),
  endTime: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  isRecurring: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const EnumSlotStatusWithAggregatesFilterSchema: z.ZodType<Prisma.EnumSlotStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => SlotStatusSchema).optional(),
  in: z.lazy(() => SlotStatusSchema).array().optional(),
  notIn: z.lazy(() => SlotStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => SlotStatusSchema), z.lazy(() => NestedEnumSlotStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumSlotStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumSlotStatusFilterSchema).optional(),
}).strict();

export const PaymentCountOrderByAggregateInputSchema: z.ZodType<Prisma.PaymentCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  bookingId: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  processorId: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const PaymentAvgOrderByAggregateInputSchema: z.ZodType<Prisma.PaymentAvgOrderByAggregateInput> = z.object({
  amount: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const PaymentMaxOrderByAggregateInputSchema: z.ZodType<Prisma.PaymentMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  bookingId: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  processorId: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const PaymentMinOrderByAggregateInputSchema: z.ZodType<Prisma.PaymentMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  bookingId: z.lazy(() => SortOrderSchema).optional(),
  amount: z.lazy(() => SortOrderSchema).optional(),
  processorId: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const PaymentSumOrderByAggregateInputSchema: z.ZodType<Prisma.PaymentSumOrderByAggregateInput> = z.object({
  amount: z.lazy(() => SortOrderSchema).optional(),
}).strict();

export const ProfileCreateNestedOneWithoutUserInputSchema: z.ZodType<Prisma.ProfileCreateNestedOneWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => ProfileCreateWithoutUserInputSchema), z.lazy(() => ProfileUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProfileCreateOrConnectWithoutUserInputSchema).optional(),
  connect: z.lazy(() => ProfileWhereUniqueInputSchema).optional(),
}).strict();

export const ServiceCreateNestedManyWithoutVendorInputSchema: z.ZodType<Prisma.ServiceCreateNestedManyWithoutVendorInput> = z.object({
  create: z.union([ z.lazy(() => ServiceCreateWithoutVendorInputSchema), z.lazy(() => ServiceCreateWithoutVendorInputSchema).array(), z.lazy(() => ServiceUncheckedCreateWithoutVendorInputSchema), z.lazy(() => ServiceUncheckedCreateWithoutVendorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ServiceCreateOrConnectWithoutVendorInputSchema), z.lazy(() => ServiceCreateOrConnectWithoutVendorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ServiceCreateManyVendorInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ServiceWhereUniqueInputSchema), z.lazy(() => ServiceWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const BookingCreateNestedManyWithoutCustomerInputSchema: z.ZodType<Prisma.BookingCreateNestedManyWithoutCustomerInput> = z.object({
  create: z.union([ z.lazy(() => BookingCreateWithoutCustomerInputSchema), z.lazy(() => BookingCreateWithoutCustomerInputSchema).array(), z.lazy(() => BookingUncheckedCreateWithoutCustomerInputSchema), z.lazy(() => BookingUncheckedCreateWithoutCustomerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BookingCreateOrConnectWithoutCustomerInputSchema), z.lazy(() => BookingCreateOrConnectWithoutCustomerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BookingCreateManyCustomerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => BookingWhereUniqueInputSchema), z.lazy(() => BookingWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const MediaCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.MediaCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => MediaCreateWithoutUserInputSchema), z.lazy(() => MediaCreateWithoutUserInputSchema).array(), z.lazy(() => MediaUncheckedCreateWithoutUserInputSchema), z.lazy(() => MediaUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MediaCreateOrConnectWithoutUserInputSchema), z.lazy(() => MediaCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MediaCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => MediaWhereUniqueInputSchema), z.lazy(() => MediaWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const MessageCreateNestedManyWithoutSenderInputSchema: z.ZodType<Prisma.MessageCreateNestedManyWithoutSenderInput> = z.object({
  create: z.union([ z.lazy(() => MessageCreateWithoutSenderInputSchema), z.lazy(() => MessageCreateWithoutSenderInputSchema).array(), z.lazy(() => MessageUncheckedCreateWithoutSenderInputSchema), z.lazy(() => MessageUncheckedCreateWithoutSenderInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MessageCreateOrConnectWithoutSenderInputSchema), z.lazy(() => MessageCreateOrConnectWithoutSenderInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MessageCreateManySenderInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => MessageWhereUniqueInputSchema), z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const MessageCreateNestedManyWithoutReceiverInputSchema: z.ZodType<Prisma.MessageCreateNestedManyWithoutReceiverInput> = z.object({
  create: z.union([ z.lazy(() => MessageCreateWithoutReceiverInputSchema), z.lazy(() => MessageCreateWithoutReceiverInputSchema).array(), z.lazy(() => MessageUncheckedCreateWithoutReceiverInputSchema), z.lazy(() => MessageUncheckedCreateWithoutReceiverInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MessageCreateOrConnectWithoutReceiverInputSchema), z.lazy(() => MessageCreateOrConnectWithoutReceiverInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MessageCreateManyReceiverInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => MessageWhereUniqueInputSchema), z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ProfileUncheckedCreateNestedOneWithoutUserInputSchema: z.ZodType<Prisma.ProfileUncheckedCreateNestedOneWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => ProfileCreateWithoutUserInputSchema), z.lazy(() => ProfileUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProfileCreateOrConnectWithoutUserInputSchema).optional(),
  connect: z.lazy(() => ProfileWhereUniqueInputSchema).optional(),
}).strict();

export const ServiceUncheckedCreateNestedManyWithoutVendorInputSchema: z.ZodType<Prisma.ServiceUncheckedCreateNestedManyWithoutVendorInput> = z.object({
  create: z.union([ z.lazy(() => ServiceCreateWithoutVendorInputSchema), z.lazy(() => ServiceCreateWithoutVendorInputSchema).array(), z.lazy(() => ServiceUncheckedCreateWithoutVendorInputSchema), z.lazy(() => ServiceUncheckedCreateWithoutVendorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ServiceCreateOrConnectWithoutVendorInputSchema), z.lazy(() => ServiceCreateOrConnectWithoutVendorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ServiceCreateManyVendorInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ServiceWhereUniqueInputSchema), z.lazy(() => ServiceWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const BookingUncheckedCreateNestedManyWithoutCustomerInputSchema: z.ZodType<Prisma.BookingUncheckedCreateNestedManyWithoutCustomerInput> = z.object({
  create: z.union([ z.lazy(() => BookingCreateWithoutCustomerInputSchema), z.lazy(() => BookingCreateWithoutCustomerInputSchema).array(), z.lazy(() => BookingUncheckedCreateWithoutCustomerInputSchema), z.lazy(() => BookingUncheckedCreateWithoutCustomerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BookingCreateOrConnectWithoutCustomerInputSchema), z.lazy(() => BookingCreateOrConnectWithoutCustomerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BookingCreateManyCustomerInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => BookingWhereUniqueInputSchema), z.lazy(() => BookingWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const MediaUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.MediaUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => MediaCreateWithoutUserInputSchema), z.lazy(() => MediaCreateWithoutUserInputSchema).array(), z.lazy(() => MediaUncheckedCreateWithoutUserInputSchema), z.lazy(() => MediaUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MediaCreateOrConnectWithoutUserInputSchema), z.lazy(() => MediaCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MediaCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => MediaWhereUniqueInputSchema), z.lazy(() => MediaWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const MessageUncheckedCreateNestedManyWithoutSenderInputSchema: z.ZodType<Prisma.MessageUncheckedCreateNestedManyWithoutSenderInput> = z.object({
  create: z.union([ z.lazy(() => MessageCreateWithoutSenderInputSchema), z.lazy(() => MessageCreateWithoutSenderInputSchema).array(), z.lazy(() => MessageUncheckedCreateWithoutSenderInputSchema), z.lazy(() => MessageUncheckedCreateWithoutSenderInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MessageCreateOrConnectWithoutSenderInputSchema), z.lazy(() => MessageCreateOrConnectWithoutSenderInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MessageCreateManySenderInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => MessageWhereUniqueInputSchema), z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const MessageUncheckedCreateNestedManyWithoutReceiverInputSchema: z.ZodType<Prisma.MessageUncheckedCreateNestedManyWithoutReceiverInput> = z.object({
  create: z.union([ z.lazy(() => MessageCreateWithoutReceiverInputSchema), z.lazy(() => MessageCreateWithoutReceiverInputSchema).array(), z.lazy(() => MessageUncheckedCreateWithoutReceiverInputSchema), z.lazy(() => MessageUncheckedCreateWithoutReceiverInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MessageCreateOrConnectWithoutReceiverInputSchema), z.lazy(() => MessageCreateOrConnectWithoutReceiverInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MessageCreateManyReceiverInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => MessageWhereUniqueInputSchema), z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional(),
}).strict();

export const EnumRoleFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumRoleFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => RoleSchema).optional(),
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional(),
}).strict();

export const ProfileUpdateOneWithoutUserNestedInputSchema: z.ZodType<Prisma.ProfileUpdateOneWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProfileCreateWithoutUserInputSchema), z.lazy(() => ProfileUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProfileCreateOrConnectWithoutUserInputSchema).optional(),
  upsert: z.lazy(() => ProfileUpsertWithoutUserInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => ProfileWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => ProfileWhereInputSchema) ]).optional(),
  connect: z.lazy(() => ProfileWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ProfileUpdateToOneWithWhereWithoutUserInputSchema), z.lazy(() => ProfileUpdateWithoutUserInputSchema), z.lazy(() => ProfileUncheckedUpdateWithoutUserInputSchema) ]).optional(),
}).strict();

export const ServiceUpdateManyWithoutVendorNestedInputSchema: z.ZodType<Prisma.ServiceUpdateManyWithoutVendorNestedInput> = z.object({
  create: z.union([ z.lazy(() => ServiceCreateWithoutVendorInputSchema), z.lazy(() => ServiceCreateWithoutVendorInputSchema).array(), z.lazy(() => ServiceUncheckedCreateWithoutVendorInputSchema), z.lazy(() => ServiceUncheckedCreateWithoutVendorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ServiceCreateOrConnectWithoutVendorInputSchema), z.lazy(() => ServiceCreateOrConnectWithoutVendorInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ServiceUpsertWithWhereUniqueWithoutVendorInputSchema), z.lazy(() => ServiceUpsertWithWhereUniqueWithoutVendorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ServiceCreateManyVendorInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ServiceWhereUniqueInputSchema), z.lazy(() => ServiceWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ServiceWhereUniqueInputSchema), z.lazy(() => ServiceWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ServiceWhereUniqueInputSchema), z.lazy(() => ServiceWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ServiceWhereUniqueInputSchema), z.lazy(() => ServiceWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ServiceUpdateWithWhereUniqueWithoutVendorInputSchema), z.lazy(() => ServiceUpdateWithWhereUniqueWithoutVendorInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ServiceUpdateManyWithWhereWithoutVendorInputSchema), z.lazy(() => ServiceUpdateManyWithWhereWithoutVendorInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ServiceScalarWhereInputSchema), z.lazy(() => ServiceScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const BookingUpdateManyWithoutCustomerNestedInputSchema: z.ZodType<Prisma.BookingUpdateManyWithoutCustomerNestedInput> = z.object({
  create: z.union([ z.lazy(() => BookingCreateWithoutCustomerInputSchema), z.lazy(() => BookingCreateWithoutCustomerInputSchema).array(), z.lazy(() => BookingUncheckedCreateWithoutCustomerInputSchema), z.lazy(() => BookingUncheckedCreateWithoutCustomerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BookingCreateOrConnectWithoutCustomerInputSchema), z.lazy(() => BookingCreateOrConnectWithoutCustomerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => BookingUpsertWithWhereUniqueWithoutCustomerInputSchema), z.lazy(() => BookingUpsertWithWhereUniqueWithoutCustomerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BookingCreateManyCustomerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => BookingWhereUniqueInputSchema), z.lazy(() => BookingWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => BookingWhereUniqueInputSchema), z.lazy(() => BookingWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => BookingWhereUniqueInputSchema), z.lazy(() => BookingWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => BookingWhereUniqueInputSchema), z.lazy(() => BookingWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => BookingUpdateWithWhereUniqueWithoutCustomerInputSchema), z.lazy(() => BookingUpdateWithWhereUniqueWithoutCustomerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => BookingUpdateManyWithWhereWithoutCustomerInputSchema), z.lazy(() => BookingUpdateManyWithWhereWithoutCustomerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => BookingScalarWhereInputSchema), z.lazy(() => BookingScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const MediaUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.MediaUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => MediaCreateWithoutUserInputSchema), z.lazy(() => MediaCreateWithoutUserInputSchema).array(), z.lazy(() => MediaUncheckedCreateWithoutUserInputSchema), z.lazy(() => MediaUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MediaCreateOrConnectWithoutUserInputSchema), z.lazy(() => MediaCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => MediaUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => MediaUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MediaCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => MediaWhereUniqueInputSchema), z.lazy(() => MediaWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => MediaWhereUniqueInputSchema), z.lazy(() => MediaWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => MediaWhereUniqueInputSchema), z.lazy(() => MediaWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MediaWhereUniqueInputSchema), z.lazy(() => MediaWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => MediaUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => MediaUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => MediaUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => MediaUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => MediaScalarWhereInputSchema), z.lazy(() => MediaScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const MessageUpdateManyWithoutSenderNestedInputSchema: z.ZodType<Prisma.MessageUpdateManyWithoutSenderNestedInput> = z.object({
  create: z.union([ z.lazy(() => MessageCreateWithoutSenderInputSchema), z.lazy(() => MessageCreateWithoutSenderInputSchema).array(), z.lazy(() => MessageUncheckedCreateWithoutSenderInputSchema), z.lazy(() => MessageUncheckedCreateWithoutSenderInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MessageCreateOrConnectWithoutSenderInputSchema), z.lazy(() => MessageCreateOrConnectWithoutSenderInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => MessageUpsertWithWhereUniqueWithoutSenderInputSchema), z.lazy(() => MessageUpsertWithWhereUniqueWithoutSenderInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MessageCreateManySenderInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => MessageWhereUniqueInputSchema), z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => MessageWhereUniqueInputSchema), z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => MessageWhereUniqueInputSchema), z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MessageWhereUniqueInputSchema), z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => MessageUpdateWithWhereUniqueWithoutSenderInputSchema), z.lazy(() => MessageUpdateWithWhereUniqueWithoutSenderInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => MessageUpdateManyWithWhereWithoutSenderInputSchema), z.lazy(() => MessageUpdateManyWithWhereWithoutSenderInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => MessageScalarWhereInputSchema), z.lazy(() => MessageScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const MessageUpdateManyWithoutReceiverNestedInputSchema: z.ZodType<Prisma.MessageUpdateManyWithoutReceiverNestedInput> = z.object({
  create: z.union([ z.lazy(() => MessageCreateWithoutReceiverInputSchema), z.lazy(() => MessageCreateWithoutReceiverInputSchema).array(), z.lazy(() => MessageUncheckedCreateWithoutReceiverInputSchema), z.lazy(() => MessageUncheckedCreateWithoutReceiverInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MessageCreateOrConnectWithoutReceiverInputSchema), z.lazy(() => MessageCreateOrConnectWithoutReceiverInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => MessageUpsertWithWhereUniqueWithoutReceiverInputSchema), z.lazy(() => MessageUpsertWithWhereUniqueWithoutReceiverInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MessageCreateManyReceiverInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => MessageWhereUniqueInputSchema), z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => MessageWhereUniqueInputSchema), z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => MessageWhereUniqueInputSchema), z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MessageWhereUniqueInputSchema), z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => MessageUpdateWithWhereUniqueWithoutReceiverInputSchema), z.lazy(() => MessageUpdateWithWhereUniqueWithoutReceiverInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => MessageUpdateManyWithWhereWithoutReceiverInputSchema), z.lazy(() => MessageUpdateManyWithWhereWithoutReceiverInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => MessageScalarWhereInputSchema), z.lazy(() => MessageScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ProfileUncheckedUpdateOneWithoutUserNestedInputSchema: z.ZodType<Prisma.ProfileUncheckedUpdateOneWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProfileCreateWithoutUserInputSchema), z.lazy(() => ProfileUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProfileCreateOrConnectWithoutUserInputSchema).optional(),
  upsert: z.lazy(() => ProfileUpsertWithoutUserInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => ProfileWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => ProfileWhereInputSchema) ]).optional(),
  connect: z.lazy(() => ProfileWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ProfileUpdateToOneWithWhereWithoutUserInputSchema), z.lazy(() => ProfileUpdateWithoutUserInputSchema), z.lazy(() => ProfileUncheckedUpdateWithoutUserInputSchema) ]).optional(),
}).strict();

export const ServiceUncheckedUpdateManyWithoutVendorNestedInputSchema: z.ZodType<Prisma.ServiceUncheckedUpdateManyWithoutVendorNestedInput> = z.object({
  create: z.union([ z.lazy(() => ServiceCreateWithoutVendorInputSchema), z.lazy(() => ServiceCreateWithoutVendorInputSchema).array(), z.lazy(() => ServiceUncheckedCreateWithoutVendorInputSchema), z.lazy(() => ServiceUncheckedCreateWithoutVendorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ServiceCreateOrConnectWithoutVendorInputSchema), z.lazy(() => ServiceCreateOrConnectWithoutVendorInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ServiceUpsertWithWhereUniqueWithoutVendorInputSchema), z.lazy(() => ServiceUpsertWithWhereUniqueWithoutVendorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ServiceCreateManyVendorInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ServiceWhereUniqueInputSchema), z.lazy(() => ServiceWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ServiceWhereUniqueInputSchema), z.lazy(() => ServiceWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ServiceWhereUniqueInputSchema), z.lazy(() => ServiceWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ServiceWhereUniqueInputSchema), z.lazy(() => ServiceWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ServiceUpdateWithWhereUniqueWithoutVendorInputSchema), z.lazy(() => ServiceUpdateWithWhereUniqueWithoutVendorInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ServiceUpdateManyWithWhereWithoutVendorInputSchema), z.lazy(() => ServiceUpdateManyWithWhereWithoutVendorInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ServiceScalarWhereInputSchema), z.lazy(() => ServiceScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const BookingUncheckedUpdateManyWithoutCustomerNestedInputSchema: z.ZodType<Prisma.BookingUncheckedUpdateManyWithoutCustomerNestedInput> = z.object({
  create: z.union([ z.lazy(() => BookingCreateWithoutCustomerInputSchema), z.lazy(() => BookingCreateWithoutCustomerInputSchema).array(), z.lazy(() => BookingUncheckedCreateWithoutCustomerInputSchema), z.lazy(() => BookingUncheckedCreateWithoutCustomerInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BookingCreateOrConnectWithoutCustomerInputSchema), z.lazy(() => BookingCreateOrConnectWithoutCustomerInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => BookingUpsertWithWhereUniqueWithoutCustomerInputSchema), z.lazy(() => BookingUpsertWithWhereUniqueWithoutCustomerInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BookingCreateManyCustomerInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => BookingWhereUniqueInputSchema), z.lazy(() => BookingWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => BookingWhereUniqueInputSchema), z.lazy(() => BookingWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => BookingWhereUniqueInputSchema), z.lazy(() => BookingWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => BookingWhereUniqueInputSchema), z.lazy(() => BookingWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => BookingUpdateWithWhereUniqueWithoutCustomerInputSchema), z.lazy(() => BookingUpdateWithWhereUniqueWithoutCustomerInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => BookingUpdateManyWithWhereWithoutCustomerInputSchema), z.lazy(() => BookingUpdateManyWithWhereWithoutCustomerInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => BookingScalarWhereInputSchema), z.lazy(() => BookingScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const MediaUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.MediaUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => MediaCreateWithoutUserInputSchema), z.lazy(() => MediaCreateWithoutUserInputSchema).array(), z.lazy(() => MediaUncheckedCreateWithoutUserInputSchema), z.lazy(() => MediaUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MediaCreateOrConnectWithoutUserInputSchema), z.lazy(() => MediaCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => MediaUpsertWithWhereUniqueWithoutUserInputSchema), z.lazy(() => MediaUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MediaCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => MediaWhereUniqueInputSchema), z.lazy(() => MediaWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => MediaWhereUniqueInputSchema), z.lazy(() => MediaWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => MediaWhereUniqueInputSchema), z.lazy(() => MediaWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MediaWhereUniqueInputSchema), z.lazy(() => MediaWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => MediaUpdateWithWhereUniqueWithoutUserInputSchema), z.lazy(() => MediaUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => MediaUpdateManyWithWhereWithoutUserInputSchema), z.lazy(() => MediaUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => MediaScalarWhereInputSchema), z.lazy(() => MediaScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const MessageUncheckedUpdateManyWithoutSenderNestedInputSchema: z.ZodType<Prisma.MessageUncheckedUpdateManyWithoutSenderNestedInput> = z.object({
  create: z.union([ z.lazy(() => MessageCreateWithoutSenderInputSchema), z.lazy(() => MessageCreateWithoutSenderInputSchema).array(), z.lazy(() => MessageUncheckedCreateWithoutSenderInputSchema), z.lazy(() => MessageUncheckedCreateWithoutSenderInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MessageCreateOrConnectWithoutSenderInputSchema), z.lazy(() => MessageCreateOrConnectWithoutSenderInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => MessageUpsertWithWhereUniqueWithoutSenderInputSchema), z.lazy(() => MessageUpsertWithWhereUniqueWithoutSenderInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MessageCreateManySenderInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => MessageWhereUniqueInputSchema), z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => MessageWhereUniqueInputSchema), z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => MessageWhereUniqueInputSchema), z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MessageWhereUniqueInputSchema), z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => MessageUpdateWithWhereUniqueWithoutSenderInputSchema), z.lazy(() => MessageUpdateWithWhereUniqueWithoutSenderInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => MessageUpdateManyWithWhereWithoutSenderInputSchema), z.lazy(() => MessageUpdateManyWithWhereWithoutSenderInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => MessageScalarWhereInputSchema), z.lazy(() => MessageScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const MessageUncheckedUpdateManyWithoutReceiverNestedInputSchema: z.ZodType<Prisma.MessageUncheckedUpdateManyWithoutReceiverNestedInput> = z.object({
  create: z.union([ z.lazy(() => MessageCreateWithoutReceiverInputSchema), z.lazy(() => MessageCreateWithoutReceiverInputSchema).array(), z.lazy(() => MessageUncheckedCreateWithoutReceiverInputSchema), z.lazy(() => MessageUncheckedCreateWithoutReceiverInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => MessageCreateOrConnectWithoutReceiverInputSchema), z.lazy(() => MessageCreateOrConnectWithoutReceiverInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => MessageUpsertWithWhereUniqueWithoutReceiverInputSchema), z.lazy(() => MessageUpsertWithWhereUniqueWithoutReceiverInputSchema).array() ]).optional(),
  createMany: z.lazy(() => MessageCreateManyReceiverInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => MessageWhereUniqueInputSchema), z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => MessageWhereUniqueInputSchema), z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => MessageWhereUniqueInputSchema), z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => MessageWhereUniqueInputSchema), z.lazy(() => MessageWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => MessageUpdateWithWhereUniqueWithoutReceiverInputSchema), z.lazy(() => MessageUpdateWithWhereUniqueWithoutReceiverInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => MessageUpdateManyWithWhereWithoutReceiverInputSchema), z.lazy(() => MessageUpdateManyWithWhereWithoutReceiverInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => MessageScalarWhereInputSchema), z.lazy(() => MessageScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutSentMessagesInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutSentMessagesInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutSentMessagesInputSchema), z.lazy(() => UserUncheckedCreateWithoutSentMessagesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSentMessagesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
}).strict();

export const UserCreateNestedOneWithoutReceivedMessagesInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutReceivedMessagesInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutReceivedMessagesInputSchema), z.lazy(() => UserUncheckedCreateWithoutReceivedMessagesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutReceivedMessagesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
}).strict();

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional(),
}).strict();

export const UserUpdateOneRequiredWithoutSentMessagesNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutSentMessagesNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutSentMessagesInputSchema), z.lazy(() => UserUncheckedCreateWithoutSentMessagesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutSentMessagesInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutSentMessagesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutSentMessagesInputSchema), z.lazy(() => UserUpdateWithoutSentMessagesInputSchema), z.lazy(() => UserUncheckedUpdateWithoutSentMessagesInputSchema) ]).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutReceivedMessagesNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutReceivedMessagesNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutReceivedMessagesInputSchema), z.lazy(() => UserUncheckedCreateWithoutReceivedMessagesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutReceivedMessagesInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutReceivedMessagesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutReceivedMessagesInputSchema), z.lazy(() => UserUpdateWithoutReceivedMessagesInputSchema), z.lazy(() => UserUncheckedUpdateWithoutReceivedMessagesInputSchema) ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutMediaInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutMediaInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutMediaInputSchema), z.lazy(() => UserUncheckedCreateWithoutMediaInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutMediaInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable(),
}).strict();

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional(),
}).strict();

export const UserUpdateOneRequiredWithoutMediaNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutMediaNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutMediaInputSchema), z.lazy(() => UserUncheckedCreateWithoutMediaInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutMediaInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutMediaInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutMediaInputSchema), z.lazy(() => UserUpdateWithoutMediaInputSchema), z.lazy(() => UserUncheckedUpdateWithoutMediaInputSchema) ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutProfileInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutProfileInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutProfileInputSchema), z.lazy(() => UserUncheckedCreateWithoutProfileInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutProfileInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
}).strict();

export const PortfolioItemCreateNestedManyWithoutProfileInputSchema: z.ZodType<Prisma.PortfolioItemCreateNestedManyWithoutProfileInput> = z.object({
  create: z.union([ z.lazy(() => PortfolioItemCreateWithoutProfileInputSchema), z.lazy(() => PortfolioItemCreateWithoutProfileInputSchema).array(), z.lazy(() => PortfolioItemUncheckedCreateWithoutProfileInputSchema), z.lazy(() => PortfolioItemUncheckedCreateWithoutProfileInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PortfolioItemCreateOrConnectWithoutProfileInputSchema), z.lazy(() => PortfolioItemCreateOrConnectWithoutProfileInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PortfolioItemCreateManyProfileInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PortfolioItemWhereUniqueInputSchema), z.lazy(() => PortfolioItemWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const PortfolioItemUncheckedCreateNestedManyWithoutProfileInputSchema: z.ZodType<Prisma.PortfolioItemUncheckedCreateNestedManyWithoutProfileInput> = z.object({
  create: z.union([ z.lazy(() => PortfolioItemCreateWithoutProfileInputSchema), z.lazy(() => PortfolioItemCreateWithoutProfileInputSchema).array(), z.lazy(() => PortfolioItemUncheckedCreateWithoutProfileInputSchema), z.lazy(() => PortfolioItemUncheckedCreateWithoutProfileInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PortfolioItemCreateOrConnectWithoutProfileInputSchema), z.lazy(() => PortfolioItemCreateOrConnectWithoutProfileInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PortfolioItemCreateManyProfileInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => PortfolioItemWhereUniqueInputSchema), z.lazy(() => PortfolioItemWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const DecimalFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DecimalFieldUpdateOperationsInput> = z.object({
  set: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  increment: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  decrement: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  multiply: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  divide: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutProfileNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutProfileNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutProfileInputSchema), z.lazy(() => UserUncheckedCreateWithoutProfileInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutProfileInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutProfileInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutProfileInputSchema), z.lazy(() => UserUpdateWithoutProfileInputSchema), z.lazy(() => UserUncheckedUpdateWithoutProfileInputSchema) ]).optional(),
}).strict();

export const PortfolioItemUpdateManyWithoutProfileNestedInputSchema: z.ZodType<Prisma.PortfolioItemUpdateManyWithoutProfileNestedInput> = z.object({
  create: z.union([ z.lazy(() => PortfolioItemCreateWithoutProfileInputSchema), z.lazy(() => PortfolioItemCreateWithoutProfileInputSchema).array(), z.lazy(() => PortfolioItemUncheckedCreateWithoutProfileInputSchema), z.lazy(() => PortfolioItemUncheckedCreateWithoutProfileInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PortfolioItemCreateOrConnectWithoutProfileInputSchema), z.lazy(() => PortfolioItemCreateOrConnectWithoutProfileInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PortfolioItemUpsertWithWhereUniqueWithoutProfileInputSchema), z.lazy(() => PortfolioItemUpsertWithWhereUniqueWithoutProfileInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PortfolioItemCreateManyProfileInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PortfolioItemWhereUniqueInputSchema), z.lazy(() => PortfolioItemWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PortfolioItemWhereUniqueInputSchema), z.lazy(() => PortfolioItemWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PortfolioItemWhereUniqueInputSchema), z.lazy(() => PortfolioItemWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PortfolioItemWhereUniqueInputSchema), z.lazy(() => PortfolioItemWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PortfolioItemUpdateWithWhereUniqueWithoutProfileInputSchema), z.lazy(() => PortfolioItemUpdateWithWhereUniqueWithoutProfileInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PortfolioItemUpdateManyWithWhereWithoutProfileInputSchema), z.lazy(() => PortfolioItemUpdateManyWithWhereWithoutProfileInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PortfolioItemScalarWhereInputSchema), z.lazy(() => PortfolioItemScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PortfolioItemUncheckedUpdateManyWithoutProfileNestedInputSchema: z.ZodType<Prisma.PortfolioItemUncheckedUpdateManyWithoutProfileNestedInput> = z.object({
  create: z.union([ z.lazy(() => PortfolioItemCreateWithoutProfileInputSchema), z.lazy(() => PortfolioItemCreateWithoutProfileInputSchema).array(), z.lazy(() => PortfolioItemUncheckedCreateWithoutProfileInputSchema), z.lazy(() => PortfolioItemUncheckedCreateWithoutProfileInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => PortfolioItemCreateOrConnectWithoutProfileInputSchema), z.lazy(() => PortfolioItemCreateOrConnectWithoutProfileInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => PortfolioItemUpsertWithWhereUniqueWithoutProfileInputSchema), z.lazy(() => PortfolioItemUpsertWithWhereUniqueWithoutProfileInputSchema).array() ]).optional(),
  createMany: z.lazy(() => PortfolioItemCreateManyProfileInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => PortfolioItemWhereUniqueInputSchema), z.lazy(() => PortfolioItemWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => PortfolioItemWhereUniqueInputSchema), z.lazy(() => PortfolioItemWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => PortfolioItemWhereUniqueInputSchema), z.lazy(() => PortfolioItemWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => PortfolioItemWhereUniqueInputSchema), z.lazy(() => PortfolioItemWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => PortfolioItemUpdateWithWhereUniqueWithoutProfileInputSchema), z.lazy(() => PortfolioItemUpdateWithWhereUniqueWithoutProfileInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => PortfolioItemUpdateManyWithWhereWithoutProfileInputSchema), z.lazy(() => PortfolioItemUpdateManyWithWhereWithoutProfileInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => PortfolioItemScalarWhereInputSchema), z.lazy(() => PortfolioItemScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PortfolioItemCreateimageGalleryInputSchema: z.ZodType<Prisma.PortfolioItemCreateimageGalleryInput> = z.object({
  set: z.string().array(),
}).strict();

export const ProfileCreateNestedOneWithoutPortfolioInputSchema: z.ZodType<Prisma.ProfileCreateNestedOneWithoutPortfolioInput> = z.object({
  create: z.union([ z.lazy(() => ProfileCreateWithoutPortfolioInputSchema), z.lazy(() => ProfileUncheckedCreateWithoutPortfolioInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProfileCreateOrConnectWithoutPortfolioInputSchema).optional(),
  connect: z.lazy(() => ProfileWhereUniqueInputSchema).optional(),
}).strict();

export const PortfolioItemUpdateimageGalleryInputSchema: z.ZodType<Prisma.PortfolioItemUpdateimageGalleryInput> = z.object({
  set: z.string().array().optional(),
  push: z.union([ z.string(),z.string().array() ]).optional(),
}).strict();

export const ProfileUpdateOneRequiredWithoutPortfolioNestedInputSchema: z.ZodType<Prisma.ProfileUpdateOneRequiredWithoutPortfolioNestedInput> = z.object({
  create: z.union([ z.lazy(() => ProfileCreateWithoutPortfolioInputSchema), z.lazy(() => ProfileUncheckedCreateWithoutPortfolioInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ProfileCreateOrConnectWithoutPortfolioInputSchema).optional(),
  upsert: z.lazy(() => ProfileUpsertWithoutPortfolioInputSchema).optional(),
  connect: z.lazy(() => ProfileWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ProfileUpdateToOneWithWhereWithoutPortfolioInputSchema), z.lazy(() => ProfileUpdateWithoutPortfolioInputSchema), z.lazy(() => ProfileUncheckedUpdateWithoutPortfolioInputSchema) ]).optional(),
}).strict();

export const CategoryCreateNestedOneWithoutChildrenInputSchema: z.ZodType<Prisma.CategoryCreateNestedOneWithoutChildrenInput> = z.object({
  create: z.union([ z.lazy(() => CategoryCreateWithoutChildrenInputSchema), z.lazy(() => CategoryUncheckedCreateWithoutChildrenInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CategoryCreateOrConnectWithoutChildrenInputSchema).optional(),
  connect: z.lazy(() => CategoryWhereUniqueInputSchema).optional(),
}).strict();

export const CategoryCreateNestedManyWithoutParentInputSchema: z.ZodType<Prisma.CategoryCreateNestedManyWithoutParentInput> = z.object({
  create: z.union([ z.lazy(() => CategoryCreateWithoutParentInputSchema), z.lazy(() => CategoryCreateWithoutParentInputSchema).array(), z.lazy(() => CategoryUncheckedCreateWithoutParentInputSchema), z.lazy(() => CategoryUncheckedCreateWithoutParentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CategoryCreateOrConnectWithoutParentInputSchema), z.lazy(() => CategoryCreateOrConnectWithoutParentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CategoryCreateManyParentInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CategoryWhereUniqueInputSchema), z.lazy(() => CategoryWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ServiceCreateNestedManyWithoutCategoryInputSchema: z.ZodType<Prisma.ServiceCreateNestedManyWithoutCategoryInput> = z.object({
  create: z.union([ z.lazy(() => ServiceCreateWithoutCategoryInputSchema), z.lazy(() => ServiceCreateWithoutCategoryInputSchema).array(), z.lazy(() => ServiceUncheckedCreateWithoutCategoryInputSchema), z.lazy(() => ServiceUncheckedCreateWithoutCategoryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ServiceCreateOrConnectWithoutCategoryInputSchema), z.lazy(() => ServiceCreateOrConnectWithoutCategoryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ServiceCreateManyCategoryInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ServiceWhereUniqueInputSchema), z.lazy(() => ServiceWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CategoryUncheckedCreateNestedManyWithoutParentInputSchema: z.ZodType<Prisma.CategoryUncheckedCreateNestedManyWithoutParentInput> = z.object({
  create: z.union([ z.lazy(() => CategoryCreateWithoutParentInputSchema), z.lazy(() => CategoryCreateWithoutParentInputSchema).array(), z.lazy(() => CategoryUncheckedCreateWithoutParentInputSchema), z.lazy(() => CategoryUncheckedCreateWithoutParentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CategoryCreateOrConnectWithoutParentInputSchema), z.lazy(() => CategoryCreateOrConnectWithoutParentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CategoryCreateManyParentInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CategoryWhereUniqueInputSchema), z.lazy(() => CategoryWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ServiceUncheckedCreateNestedManyWithoutCategoryInputSchema: z.ZodType<Prisma.ServiceUncheckedCreateNestedManyWithoutCategoryInput> = z.object({
  create: z.union([ z.lazy(() => ServiceCreateWithoutCategoryInputSchema), z.lazy(() => ServiceCreateWithoutCategoryInputSchema).array(), z.lazy(() => ServiceUncheckedCreateWithoutCategoryInputSchema), z.lazy(() => ServiceUncheckedCreateWithoutCategoryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ServiceCreateOrConnectWithoutCategoryInputSchema), z.lazy(() => ServiceCreateOrConnectWithoutCategoryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ServiceCreateManyCategoryInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ServiceWhereUniqueInputSchema), z.lazy(() => ServiceWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CategoryUpdateOneWithoutChildrenNestedInputSchema: z.ZodType<Prisma.CategoryUpdateOneWithoutChildrenNestedInput> = z.object({
  create: z.union([ z.lazy(() => CategoryCreateWithoutChildrenInputSchema), z.lazy(() => CategoryUncheckedCreateWithoutChildrenInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CategoryCreateOrConnectWithoutChildrenInputSchema).optional(),
  upsert: z.lazy(() => CategoryUpsertWithoutChildrenInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => CategoryWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => CategoryWhereInputSchema) ]).optional(),
  connect: z.lazy(() => CategoryWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CategoryUpdateToOneWithWhereWithoutChildrenInputSchema), z.lazy(() => CategoryUpdateWithoutChildrenInputSchema), z.lazy(() => CategoryUncheckedUpdateWithoutChildrenInputSchema) ]).optional(),
}).strict();

export const CategoryUpdateManyWithoutParentNestedInputSchema: z.ZodType<Prisma.CategoryUpdateManyWithoutParentNestedInput> = z.object({
  create: z.union([ z.lazy(() => CategoryCreateWithoutParentInputSchema), z.lazy(() => CategoryCreateWithoutParentInputSchema).array(), z.lazy(() => CategoryUncheckedCreateWithoutParentInputSchema), z.lazy(() => CategoryUncheckedCreateWithoutParentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CategoryCreateOrConnectWithoutParentInputSchema), z.lazy(() => CategoryCreateOrConnectWithoutParentInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CategoryUpsertWithWhereUniqueWithoutParentInputSchema), z.lazy(() => CategoryUpsertWithWhereUniqueWithoutParentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CategoryCreateManyParentInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CategoryWhereUniqueInputSchema), z.lazy(() => CategoryWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CategoryWhereUniqueInputSchema), z.lazy(() => CategoryWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CategoryWhereUniqueInputSchema), z.lazy(() => CategoryWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CategoryWhereUniqueInputSchema), z.lazy(() => CategoryWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CategoryUpdateWithWhereUniqueWithoutParentInputSchema), z.lazy(() => CategoryUpdateWithWhereUniqueWithoutParentInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CategoryUpdateManyWithWhereWithoutParentInputSchema), z.lazy(() => CategoryUpdateManyWithWhereWithoutParentInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CategoryScalarWhereInputSchema), z.lazy(() => CategoryScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ServiceUpdateManyWithoutCategoryNestedInputSchema: z.ZodType<Prisma.ServiceUpdateManyWithoutCategoryNestedInput> = z.object({
  create: z.union([ z.lazy(() => ServiceCreateWithoutCategoryInputSchema), z.lazy(() => ServiceCreateWithoutCategoryInputSchema).array(), z.lazy(() => ServiceUncheckedCreateWithoutCategoryInputSchema), z.lazy(() => ServiceUncheckedCreateWithoutCategoryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ServiceCreateOrConnectWithoutCategoryInputSchema), z.lazy(() => ServiceCreateOrConnectWithoutCategoryInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ServiceUpsertWithWhereUniqueWithoutCategoryInputSchema), z.lazy(() => ServiceUpsertWithWhereUniqueWithoutCategoryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ServiceCreateManyCategoryInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ServiceWhereUniqueInputSchema), z.lazy(() => ServiceWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ServiceWhereUniqueInputSchema), z.lazy(() => ServiceWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ServiceWhereUniqueInputSchema), z.lazy(() => ServiceWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ServiceWhereUniqueInputSchema), z.lazy(() => ServiceWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ServiceUpdateWithWhereUniqueWithoutCategoryInputSchema), z.lazy(() => ServiceUpdateWithWhereUniqueWithoutCategoryInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ServiceUpdateManyWithWhereWithoutCategoryInputSchema), z.lazy(() => ServiceUpdateManyWithWhereWithoutCategoryInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ServiceScalarWhereInputSchema), z.lazy(() => ServiceScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CategoryUncheckedUpdateManyWithoutParentNestedInputSchema: z.ZodType<Prisma.CategoryUncheckedUpdateManyWithoutParentNestedInput> = z.object({
  create: z.union([ z.lazy(() => CategoryCreateWithoutParentInputSchema), z.lazy(() => CategoryCreateWithoutParentInputSchema).array(), z.lazy(() => CategoryUncheckedCreateWithoutParentInputSchema), z.lazy(() => CategoryUncheckedCreateWithoutParentInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CategoryCreateOrConnectWithoutParentInputSchema), z.lazy(() => CategoryCreateOrConnectWithoutParentInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CategoryUpsertWithWhereUniqueWithoutParentInputSchema), z.lazy(() => CategoryUpsertWithWhereUniqueWithoutParentInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CategoryCreateManyParentInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CategoryWhereUniqueInputSchema), z.lazy(() => CategoryWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CategoryWhereUniqueInputSchema), z.lazy(() => CategoryWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CategoryWhereUniqueInputSchema), z.lazy(() => CategoryWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CategoryWhereUniqueInputSchema), z.lazy(() => CategoryWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CategoryUpdateWithWhereUniqueWithoutParentInputSchema), z.lazy(() => CategoryUpdateWithWhereUniqueWithoutParentInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CategoryUpdateManyWithWhereWithoutParentInputSchema), z.lazy(() => CategoryUpdateManyWithWhereWithoutParentInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CategoryScalarWhereInputSchema), z.lazy(() => CategoryScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ServiceUncheckedUpdateManyWithoutCategoryNestedInputSchema: z.ZodType<Prisma.ServiceUncheckedUpdateManyWithoutCategoryNestedInput> = z.object({
  create: z.union([ z.lazy(() => ServiceCreateWithoutCategoryInputSchema), z.lazy(() => ServiceCreateWithoutCategoryInputSchema).array(), z.lazy(() => ServiceUncheckedCreateWithoutCategoryInputSchema), z.lazy(() => ServiceUncheckedCreateWithoutCategoryInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ServiceCreateOrConnectWithoutCategoryInputSchema), z.lazy(() => ServiceCreateOrConnectWithoutCategoryInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ServiceUpsertWithWhereUniqueWithoutCategoryInputSchema), z.lazy(() => ServiceUpsertWithWhereUniqueWithoutCategoryInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ServiceCreateManyCategoryInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ServiceWhereUniqueInputSchema), z.lazy(() => ServiceWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ServiceWhereUniqueInputSchema), z.lazy(() => ServiceWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ServiceWhereUniqueInputSchema), z.lazy(() => ServiceWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ServiceWhereUniqueInputSchema), z.lazy(() => ServiceWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ServiceUpdateWithWhereUniqueWithoutCategoryInputSchema), z.lazy(() => ServiceUpdateWithWhereUniqueWithoutCategoryInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ServiceUpdateManyWithWhereWithoutCategoryInputSchema), z.lazy(() => ServiceUpdateManyWithWhereWithoutCategoryInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ServiceScalarWhereInputSchema), z.lazy(() => ServiceScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ServiceCreateNestedManyWithoutUnitInputSchema: z.ZodType<Prisma.ServiceCreateNestedManyWithoutUnitInput> = z.object({
  create: z.union([ z.lazy(() => ServiceCreateWithoutUnitInputSchema), z.lazy(() => ServiceCreateWithoutUnitInputSchema).array(), z.lazy(() => ServiceUncheckedCreateWithoutUnitInputSchema), z.lazy(() => ServiceUncheckedCreateWithoutUnitInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ServiceCreateOrConnectWithoutUnitInputSchema), z.lazy(() => ServiceCreateOrConnectWithoutUnitInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ServiceCreateManyUnitInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ServiceWhereUniqueInputSchema), z.lazy(() => ServiceWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ServiceUncheckedCreateNestedManyWithoutUnitInputSchema: z.ZodType<Prisma.ServiceUncheckedCreateNestedManyWithoutUnitInput> = z.object({
  create: z.union([ z.lazy(() => ServiceCreateWithoutUnitInputSchema), z.lazy(() => ServiceCreateWithoutUnitInputSchema).array(), z.lazy(() => ServiceUncheckedCreateWithoutUnitInputSchema), z.lazy(() => ServiceUncheckedCreateWithoutUnitInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ServiceCreateOrConnectWithoutUnitInputSchema), z.lazy(() => ServiceCreateOrConnectWithoutUnitInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ServiceCreateManyUnitInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ServiceWhereUniqueInputSchema), z.lazy(() => ServiceWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ServiceUpdateManyWithoutUnitNestedInputSchema: z.ZodType<Prisma.ServiceUpdateManyWithoutUnitNestedInput> = z.object({
  create: z.union([ z.lazy(() => ServiceCreateWithoutUnitInputSchema), z.lazy(() => ServiceCreateWithoutUnitInputSchema).array(), z.lazy(() => ServiceUncheckedCreateWithoutUnitInputSchema), z.lazy(() => ServiceUncheckedCreateWithoutUnitInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ServiceCreateOrConnectWithoutUnitInputSchema), z.lazy(() => ServiceCreateOrConnectWithoutUnitInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ServiceUpsertWithWhereUniqueWithoutUnitInputSchema), z.lazy(() => ServiceUpsertWithWhereUniqueWithoutUnitInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ServiceCreateManyUnitInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ServiceWhereUniqueInputSchema), z.lazy(() => ServiceWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ServiceWhereUniqueInputSchema), z.lazy(() => ServiceWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ServiceWhereUniqueInputSchema), z.lazy(() => ServiceWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ServiceWhereUniqueInputSchema), z.lazy(() => ServiceWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ServiceUpdateWithWhereUniqueWithoutUnitInputSchema), z.lazy(() => ServiceUpdateWithWhereUniqueWithoutUnitInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ServiceUpdateManyWithWhereWithoutUnitInputSchema), z.lazy(() => ServiceUpdateManyWithWhereWithoutUnitInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ServiceScalarWhereInputSchema), z.lazy(() => ServiceScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ServiceUncheckedUpdateManyWithoutUnitNestedInputSchema: z.ZodType<Prisma.ServiceUncheckedUpdateManyWithoutUnitNestedInput> = z.object({
  create: z.union([ z.lazy(() => ServiceCreateWithoutUnitInputSchema), z.lazy(() => ServiceCreateWithoutUnitInputSchema).array(), z.lazy(() => ServiceUncheckedCreateWithoutUnitInputSchema), z.lazy(() => ServiceUncheckedCreateWithoutUnitInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ServiceCreateOrConnectWithoutUnitInputSchema), z.lazy(() => ServiceCreateOrConnectWithoutUnitInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ServiceUpsertWithWhereUniqueWithoutUnitInputSchema), z.lazy(() => ServiceUpsertWithWhereUniqueWithoutUnitInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ServiceCreateManyUnitInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ServiceWhereUniqueInputSchema), z.lazy(() => ServiceWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ServiceWhereUniqueInputSchema), z.lazy(() => ServiceWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ServiceWhereUniqueInputSchema), z.lazy(() => ServiceWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ServiceWhereUniqueInputSchema), z.lazy(() => ServiceWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ServiceUpdateWithWhereUniqueWithoutUnitInputSchema), z.lazy(() => ServiceUpdateWithWhereUniqueWithoutUnitInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ServiceUpdateManyWithWhereWithoutUnitInputSchema), z.lazy(() => ServiceUpdateManyWithWhereWithoutUnitInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ServiceScalarWhereInputSchema), z.lazy(() => ServiceScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutServicesInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutServicesInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutServicesInputSchema), z.lazy(() => UserUncheckedCreateWithoutServicesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutServicesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
}).strict();

export const CategoryCreateNestedOneWithoutServicesInputSchema: z.ZodType<Prisma.CategoryCreateNestedOneWithoutServicesInput> = z.object({
  create: z.union([ z.lazy(() => CategoryCreateWithoutServicesInputSchema), z.lazy(() => CategoryUncheckedCreateWithoutServicesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CategoryCreateOrConnectWithoutServicesInputSchema).optional(),
  connect: z.lazy(() => CategoryWhereUniqueInputSchema).optional(),
}).strict();

export const ServiceUnitCreateNestedOneWithoutServicesInputSchema: z.ZodType<Prisma.ServiceUnitCreateNestedOneWithoutServicesInput> = z.object({
  create: z.union([ z.lazy(() => ServiceUnitCreateWithoutServicesInputSchema), z.lazy(() => ServiceUnitUncheckedCreateWithoutServicesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ServiceUnitCreateOrConnectWithoutServicesInputSchema).optional(),
  connect: z.lazy(() => ServiceUnitWhereUniqueInputSchema).optional(),
}).strict();

export const ServiceMetadataCreateNestedManyWithoutServiceInputSchema: z.ZodType<Prisma.ServiceMetadataCreateNestedManyWithoutServiceInput> = z.object({
  create: z.union([ z.lazy(() => ServiceMetadataCreateWithoutServiceInputSchema), z.lazy(() => ServiceMetadataCreateWithoutServiceInputSchema).array(), z.lazy(() => ServiceMetadataUncheckedCreateWithoutServiceInputSchema), z.lazy(() => ServiceMetadataUncheckedCreateWithoutServiceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ServiceMetadataCreateOrConnectWithoutServiceInputSchema), z.lazy(() => ServiceMetadataCreateOrConnectWithoutServiceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ServiceMetadataCreateManyServiceInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ServiceMetadataWhereUniqueInputSchema), z.lazy(() => ServiceMetadataWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ServiceSlotCreateNestedManyWithoutServiceInputSchema: z.ZodType<Prisma.ServiceSlotCreateNestedManyWithoutServiceInput> = z.object({
  create: z.union([ z.lazy(() => ServiceSlotCreateWithoutServiceInputSchema), z.lazy(() => ServiceSlotCreateWithoutServiceInputSchema).array(), z.lazy(() => ServiceSlotUncheckedCreateWithoutServiceInputSchema), z.lazy(() => ServiceSlotUncheckedCreateWithoutServiceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ServiceSlotCreateOrConnectWithoutServiceInputSchema), z.lazy(() => ServiceSlotCreateOrConnectWithoutServiceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ServiceSlotCreateManyServiceInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ServiceSlotWhereUniqueInputSchema), z.lazy(() => ServiceSlotWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const BookingCreateNestedManyWithoutServiceInputSchema: z.ZodType<Prisma.BookingCreateNestedManyWithoutServiceInput> = z.object({
  create: z.union([ z.lazy(() => BookingCreateWithoutServiceInputSchema), z.lazy(() => BookingCreateWithoutServiceInputSchema).array(), z.lazy(() => BookingUncheckedCreateWithoutServiceInputSchema), z.lazy(() => BookingUncheckedCreateWithoutServiceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BookingCreateOrConnectWithoutServiceInputSchema), z.lazy(() => BookingCreateOrConnectWithoutServiceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BookingCreateManyServiceInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => BookingWhereUniqueInputSchema), z.lazy(() => BookingWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ServiceMetadataUncheckedCreateNestedManyWithoutServiceInputSchema: z.ZodType<Prisma.ServiceMetadataUncheckedCreateNestedManyWithoutServiceInput> = z.object({
  create: z.union([ z.lazy(() => ServiceMetadataCreateWithoutServiceInputSchema), z.lazy(() => ServiceMetadataCreateWithoutServiceInputSchema).array(), z.lazy(() => ServiceMetadataUncheckedCreateWithoutServiceInputSchema), z.lazy(() => ServiceMetadataUncheckedCreateWithoutServiceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ServiceMetadataCreateOrConnectWithoutServiceInputSchema), z.lazy(() => ServiceMetadataCreateOrConnectWithoutServiceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ServiceMetadataCreateManyServiceInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ServiceMetadataWhereUniqueInputSchema), z.lazy(() => ServiceMetadataWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ServiceSlotUncheckedCreateNestedManyWithoutServiceInputSchema: z.ZodType<Prisma.ServiceSlotUncheckedCreateNestedManyWithoutServiceInput> = z.object({
  create: z.union([ z.lazy(() => ServiceSlotCreateWithoutServiceInputSchema), z.lazy(() => ServiceSlotCreateWithoutServiceInputSchema).array(), z.lazy(() => ServiceSlotUncheckedCreateWithoutServiceInputSchema), z.lazy(() => ServiceSlotUncheckedCreateWithoutServiceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ServiceSlotCreateOrConnectWithoutServiceInputSchema), z.lazy(() => ServiceSlotCreateOrConnectWithoutServiceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ServiceSlotCreateManyServiceInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ServiceSlotWhereUniqueInputSchema), z.lazy(() => ServiceSlotWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const BookingUncheckedCreateNestedManyWithoutServiceInputSchema: z.ZodType<Prisma.BookingUncheckedCreateNestedManyWithoutServiceInput> = z.object({
  create: z.union([ z.lazy(() => BookingCreateWithoutServiceInputSchema), z.lazy(() => BookingCreateWithoutServiceInputSchema).array(), z.lazy(() => BookingUncheckedCreateWithoutServiceInputSchema), z.lazy(() => BookingUncheckedCreateWithoutServiceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BookingCreateOrConnectWithoutServiceInputSchema), z.lazy(() => BookingCreateOrConnectWithoutServiceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BookingCreateManyServiceInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => BookingWhereUniqueInputSchema), z.lazy(() => BookingWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutServicesNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutServicesNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutServicesInputSchema), z.lazy(() => UserUncheckedCreateWithoutServicesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutServicesInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutServicesInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutServicesInputSchema), z.lazy(() => UserUpdateWithoutServicesInputSchema), z.lazy(() => UserUncheckedUpdateWithoutServicesInputSchema) ]).optional(),
}).strict();

export const CategoryUpdateOneRequiredWithoutServicesNestedInputSchema: z.ZodType<Prisma.CategoryUpdateOneRequiredWithoutServicesNestedInput> = z.object({
  create: z.union([ z.lazy(() => CategoryCreateWithoutServicesInputSchema), z.lazy(() => CategoryUncheckedCreateWithoutServicesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CategoryCreateOrConnectWithoutServicesInputSchema).optional(),
  upsert: z.lazy(() => CategoryUpsertWithoutServicesInputSchema).optional(),
  connect: z.lazy(() => CategoryWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CategoryUpdateToOneWithWhereWithoutServicesInputSchema), z.lazy(() => CategoryUpdateWithoutServicesInputSchema), z.lazy(() => CategoryUncheckedUpdateWithoutServicesInputSchema) ]).optional(),
}).strict();

export const ServiceUnitUpdateOneRequiredWithoutServicesNestedInputSchema: z.ZodType<Prisma.ServiceUnitUpdateOneRequiredWithoutServicesNestedInput> = z.object({
  create: z.union([ z.lazy(() => ServiceUnitCreateWithoutServicesInputSchema), z.lazy(() => ServiceUnitUncheckedCreateWithoutServicesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ServiceUnitCreateOrConnectWithoutServicesInputSchema).optional(),
  upsert: z.lazy(() => ServiceUnitUpsertWithoutServicesInputSchema).optional(),
  connect: z.lazy(() => ServiceUnitWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ServiceUnitUpdateToOneWithWhereWithoutServicesInputSchema), z.lazy(() => ServiceUnitUpdateWithoutServicesInputSchema), z.lazy(() => ServiceUnitUncheckedUpdateWithoutServicesInputSchema) ]).optional(),
}).strict();

export const ServiceMetadataUpdateManyWithoutServiceNestedInputSchema: z.ZodType<Prisma.ServiceMetadataUpdateManyWithoutServiceNestedInput> = z.object({
  create: z.union([ z.lazy(() => ServiceMetadataCreateWithoutServiceInputSchema), z.lazy(() => ServiceMetadataCreateWithoutServiceInputSchema).array(), z.lazy(() => ServiceMetadataUncheckedCreateWithoutServiceInputSchema), z.lazy(() => ServiceMetadataUncheckedCreateWithoutServiceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ServiceMetadataCreateOrConnectWithoutServiceInputSchema), z.lazy(() => ServiceMetadataCreateOrConnectWithoutServiceInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ServiceMetadataUpsertWithWhereUniqueWithoutServiceInputSchema), z.lazy(() => ServiceMetadataUpsertWithWhereUniqueWithoutServiceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ServiceMetadataCreateManyServiceInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ServiceMetadataWhereUniqueInputSchema), z.lazy(() => ServiceMetadataWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ServiceMetadataWhereUniqueInputSchema), z.lazy(() => ServiceMetadataWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ServiceMetadataWhereUniqueInputSchema), z.lazy(() => ServiceMetadataWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ServiceMetadataWhereUniqueInputSchema), z.lazy(() => ServiceMetadataWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ServiceMetadataUpdateWithWhereUniqueWithoutServiceInputSchema), z.lazy(() => ServiceMetadataUpdateWithWhereUniqueWithoutServiceInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ServiceMetadataUpdateManyWithWhereWithoutServiceInputSchema), z.lazy(() => ServiceMetadataUpdateManyWithWhereWithoutServiceInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ServiceMetadataScalarWhereInputSchema), z.lazy(() => ServiceMetadataScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ServiceSlotUpdateManyWithoutServiceNestedInputSchema: z.ZodType<Prisma.ServiceSlotUpdateManyWithoutServiceNestedInput> = z.object({
  create: z.union([ z.lazy(() => ServiceSlotCreateWithoutServiceInputSchema), z.lazy(() => ServiceSlotCreateWithoutServiceInputSchema).array(), z.lazy(() => ServiceSlotUncheckedCreateWithoutServiceInputSchema), z.lazy(() => ServiceSlotUncheckedCreateWithoutServiceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ServiceSlotCreateOrConnectWithoutServiceInputSchema), z.lazy(() => ServiceSlotCreateOrConnectWithoutServiceInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ServiceSlotUpsertWithWhereUniqueWithoutServiceInputSchema), z.lazy(() => ServiceSlotUpsertWithWhereUniqueWithoutServiceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ServiceSlotCreateManyServiceInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ServiceSlotWhereUniqueInputSchema), z.lazy(() => ServiceSlotWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ServiceSlotWhereUniqueInputSchema), z.lazy(() => ServiceSlotWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ServiceSlotWhereUniqueInputSchema), z.lazy(() => ServiceSlotWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ServiceSlotWhereUniqueInputSchema), z.lazy(() => ServiceSlotWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ServiceSlotUpdateWithWhereUniqueWithoutServiceInputSchema), z.lazy(() => ServiceSlotUpdateWithWhereUniqueWithoutServiceInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ServiceSlotUpdateManyWithWhereWithoutServiceInputSchema), z.lazy(() => ServiceSlotUpdateManyWithWhereWithoutServiceInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ServiceSlotScalarWhereInputSchema), z.lazy(() => ServiceSlotScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const BookingUpdateManyWithoutServiceNestedInputSchema: z.ZodType<Prisma.BookingUpdateManyWithoutServiceNestedInput> = z.object({
  create: z.union([ z.lazy(() => BookingCreateWithoutServiceInputSchema), z.lazy(() => BookingCreateWithoutServiceInputSchema).array(), z.lazy(() => BookingUncheckedCreateWithoutServiceInputSchema), z.lazy(() => BookingUncheckedCreateWithoutServiceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BookingCreateOrConnectWithoutServiceInputSchema), z.lazy(() => BookingCreateOrConnectWithoutServiceInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => BookingUpsertWithWhereUniqueWithoutServiceInputSchema), z.lazy(() => BookingUpsertWithWhereUniqueWithoutServiceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BookingCreateManyServiceInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => BookingWhereUniqueInputSchema), z.lazy(() => BookingWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => BookingWhereUniqueInputSchema), z.lazy(() => BookingWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => BookingWhereUniqueInputSchema), z.lazy(() => BookingWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => BookingWhereUniqueInputSchema), z.lazy(() => BookingWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => BookingUpdateWithWhereUniqueWithoutServiceInputSchema), z.lazy(() => BookingUpdateWithWhereUniqueWithoutServiceInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => BookingUpdateManyWithWhereWithoutServiceInputSchema), z.lazy(() => BookingUpdateManyWithWhereWithoutServiceInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => BookingScalarWhereInputSchema), z.lazy(() => BookingScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ServiceMetadataUncheckedUpdateManyWithoutServiceNestedInputSchema: z.ZodType<Prisma.ServiceMetadataUncheckedUpdateManyWithoutServiceNestedInput> = z.object({
  create: z.union([ z.lazy(() => ServiceMetadataCreateWithoutServiceInputSchema), z.lazy(() => ServiceMetadataCreateWithoutServiceInputSchema).array(), z.lazy(() => ServiceMetadataUncheckedCreateWithoutServiceInputSchema), z.lazy(() => ServiceMetadataUncheckedCreateWithoutServiceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ServiceMetadataCreateOrConnectWithoutServiceInputSchema), z.lazy(() => ServiceMetadataCreateOrConnectWithoutServiceInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ServiceMetadataUpsertWithWhereUniqueWithoutServiceInputSchema), z.lazy(() => ServiceMetadataUpsertWithWhereUniqueWithoutServiceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ServiceMetadataCreateManyServiceInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ServiceMetadataWhereUniqueInputSchema), z.lazy(() => ServiceMetadataWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ServiceMetadataWhereUniqueInputSchema), z.lazy(() => ServiceMetadataWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ServiceMetadataWhereUniqueInputSchema), z.lazy(() => ServiceMetadataWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ServiceMetadataWhereUniqueInputSchema), z.lazy(() => ServiceMetadataWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ServiceMetadataUpdateWithWhereUniqueWithoutServiceInputSchema), z.lazy(() => ServiceMetadataUpdateWithWhereUniqueWithoutServiceInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ServiceMetadataUpdateManyWithWhereWithoutServiceInputSchema), z.lazy(() => ServiceMetadataUpdateManyWithWhereWithoutServiceInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ServiceMetadataScalarWhereInputSchema), z.lazy(() => ServiceMetadataScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ServiceSlotUncheckedUpdateManyWithoutServiceNestedInputSchema: z.ZodType<Prisma.ServiceSlotUncheckedUpdateManyWithoutServiceNestedInput> = z.object({
  create: z.union([ z.lazy(() => ServiceSlotCreateWithoutServiceInputSchema), z.lazy(() => ServiceSlotCreateWithoutServiceInputSchema).array(), z.lazy(() => ServiceSlotUncheckedCreateWithoutServiceInputSchema), z.lazy(() => ServiceSlotUncheckedCreateWithoutServiceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ServiceSlotCreateOrConnectWithoutServiceInputSchema), z.lazy(() => ServiceSlotCreateOrConnectWithoutServiceInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ServiceSlotUpsertWithWhereUniqueWithoutServiceInputSchema), z.lazy(() => ServiceSlotUpsertWithWhereUniqueWithoutServiceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ServiceSlotCreateManyServiceInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ServiceSlotWhereUniqueInputSchema), z.lazy(() => ServiceSlotWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ServiceSlotWhereUniqueInputSchema), z.lazy(() => ServiceSlotWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ServiceSlotWhereUniqueInputSchema), z.lazy(() => ServiceSlotWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ServiceSlotWhereUniqueInputSchema), z.lazy(() => ServiceSlotWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ServiceSlotUpdateWithWhereUniqueWithoutServiceInputSchema), z.lazy(() => ServiceSlotUpdateWithWhereUniqueWithoutServiceInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ServiceSlotUpdateManyWithWhereWithoutServiceInputSchema), z.lazy(() => ServiceSlotUpdateManyWithWhereWithoutServiceInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ServiceSlotScalarWhereInputSchema), z.lazy(() => ServiceSlotScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const BookingUncheckedUpdateManyWithoutServiceNestedInputSchema: z.ZodType<Prisma.BookingUncheckedUpdateManyWithoutServiceNestedInput> = z.object({
  create: z.union([ z.lazy(() => BookingCreateWithoutServiceInputSchema), z.lazy(() => BookingCreateWithoutServiceInputSchema).array(), z.lazy(() => BookingUncheckedCreateWithoutServiceInputSchema), z.lazy(() => BookingUncheckedCreateWithoutServiceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BookingCreateOrConnectWithoutServiceInputSchema), z.lazy(() => BookingCreateOrConnectWithoutServiceInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => BookingUpsertWithWhereUniqueWithoutServiceInputSchema), z.lazy(() => BookingUpsertWithWhereUniqueWithoutServiceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BookingCreateManyServiceInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => BookingWhereUniqueInputSchema), z.lazy(() => BookingWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => BookingWhereUniqueInputSchema), z.lazy(() => BookingWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => BookingWhereUniqueInputSchema), z.lazy(() => BookingWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => BookingWhereUniqueInputSchema), z.lazy(() => BookingWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => BookingUpdateWithWhereUniqueWithoutServiceInputSchema), z.lazy(() => BookingUpdateWithWhereUniqueWithoutServiceInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => BookingUpdateManyWithWhereWithoutServiceInputSchema), z.lazy(() => BookingUpdateManyWithWhereWithoutServiceInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => BookingScalarWhereInputSchema), z.lazy(() => BookingScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ServiceCreateNestedOneWithoutMetadataInputSchema: z.ZodType<Prisma.ServiceCreateNestedOneWithoutMetadataInput> = z.object({
  create: z.union([ z.lazy(() => ServiceCreateWithoutMetadataInputSchema), z.lazy(() => ServiceUncheckedCreateWithoutMetadataInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ServiceCreateOrConnectWithoutMetadataInputSchema).optional(),
  connect: z.lazy(() => ServiceWhereUniqueInputSchema).optional(),
}).strict();

export const ServiceUpdateOneRequiredWithoutMetadataNestedInputSchema: z.ZodType<Prisma.ServiceUpdateOneRequiredWithoutMetadataNestedInput> = z.object({
  create: z.union([ z.lazy(() => ServiceCreateWithoutMetadataInputSchema), z.lazy(() => ServiceUncheckedCreateWithoutMetadataInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ServiceCreateOrConnectWithoutMetadataInputSchema).optional(),
  upsert: z.lazy(() => ServiceUpsertWithoutMetadataInputSchema).optional(),
  connect: z.lazy(() => ServiceWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ServiceUpdateToOneWithWhereWithoutMetadataInputSchema), z.lazy(() => ServiceUpdateWithoutMetadataInputSchema), z.lazy(() => ServiceUncheckedUpdateWithoutMetadataInputSchema) ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutBookingsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutBookingsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutBookingsInputSchema), z.lazy(() => UserUncheckedCreateWithoutBookingsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutBookingsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
}).strict();

export const ServiceCreateNestedOneWithoutBookingsInputSchema: z.ZodType<Prisma.ServiceCreateNestedOneWithoutBookingsInput> = z.object({
  create: z.union([ z.lazy(() => ServiceCreateWithoutBookingsInputSchema), z.lazy(() => ServiceUncheckedCreateWithoutBookingsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ServiceCreateOrConnectWithoutBookingsInputSchema).optional(),
  connect: z.lazy(() => ServiceWhereUniqueInputSchema).optional(),
}).strict();

export const BookingDetailsCreateNestedOneWithoutBookingInputSchema: z.ZodType<Prisma.BookingDetailsCreateNestedOneWithoutBookingInput> = z.object({
  create: z.union([ z.lazy(() => BookingDetailsCreateWithoutBookingInputSchema), z.lazy(() => BookingDetailsUncheckedCreateWithoutBookingInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => BookingDetailsCreateOrConnectWithoutBookingInputSchema).optional(),
  connect: z.lazy(() => BookingDetailsWhereUniqueInputSchema).optional(),
}).strict();

export const PaymentCreateNestedOneWithoutBookingInputSchema: z.ZodType<Prisma.PaymentCreateNestedOneWithoutBookingInput> = z.object({
  create: z.union([ z.lazy(() => PaymentCreateWithoutBookingInputSchema), z.lazy(() => PaymentUncheckedCreateWithoutBookingInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PaymentCreateOrConnectWithoutBookingInputSchema).optional(),
  connect: z.lazy(() => PaymentWhereUniqueInputSchema).optional(),
}).strict();

export const ServiceSlotCreateNestedManyWithoutBookingInputSchema: z.ZodType<Prisma.ServiceSlotCreateNestedManyWithoutBookingInput> = z.object({
  create: z.union([ z.lazy(() => ServiceSlotCreateWithoutBookingInputSchema), z.lazy(() => ServiceSlotCreateWithoutBookingInputSchema).array(), z.lazy(() => ServiceSlotUncheckedCreateWithoutBookingInputSchema), z.lazy(() => ServiceSlotUncheckedCreateWithoutBookingInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ServiceSlotCreateOrConnectWithoutBookingInputSchema), z.lazy(() => ServiceSlotCreateOrConnectWithoutBookingInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ServiceSlotCreateManyBookingInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ServiceSlotWhereUniqueInputSchema), z.lazy(() => ServiceSlotWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const BookingDetailsUncheckedCreateNestedOneWithoutBookingInputSchema: z.ZodType<Prisma.BookingDetailsUncheckedCreateNestedOneWithoutBookingInput> = z.object({
  create: z.union([ z.lazy(() => BookingDetailsCreateWithoutBookingInputSchema), z.lazy(() => BookingDetailsUncheckedCreateWithoutBookingInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => BookingDetailsCreateOrConnectWithoutBookingInputSchema).optional(),
  connect: z.lazy(() => BookingDetailsWhereUniqueInputSchema).optional(),
}).strict();

export const PaymentUncheckedCreateNestedOneWithoutBookingInputSchema: z.ZodType<Prisma.PaymentUncheckedCreateNestedOneWithoutBookingInput> = z.object({
  create: z.union([ z.lazy(() => PaymentCreateWithoutBookingInputSchema), z.lazy(() => PaymentUncheckedCreateWithoutBookingInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PaymentCreateOrConnectWithoutBookingInputSchema).optional(),
  connect: z.lazy(() => PaymentWhereUniqueInputSchema).optional(),
}).strict();

export const ServiceSlotUncheckedCreateNestedManyWithoutBookingInputSchema: z.ZodType<Prisma.ServiceSlotUncheckedCreateNestedManyWithoutBookingInput> = z.object({
  create: z.union([ z.lazy(() => ServiceSlotCreateWithoutBookingInputSchema), z.lazy(() => ServiceSlotCreateWithoutBookingInputSchema).array(), z.lazy(() => ServiceSlotUncheckedCreateWithoutBookingInputSchema), z.lazy(() => ServiceSlotUncheckedCreateWithoutBookingInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ServiceSlotCreateOrConnectWithoutBookingInputSchema), z.lazy(() => ServiceSlotCreateOrConnectWithoutBookingInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ServiceSlotCreateManyBookingInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ServiceSlotWhereUniqueInputSchema), z.lazy(() => ServiceSlotWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const EnumBookingStatusFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumBookingStatusFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => BookingStatusSchema).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutBookingsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutBookingsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutBookingsInputSchema), z.lazy(() => UserUncheckedCreateWithoutBookingsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutBookingsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutBookingsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutBookingsInputSchema), z.lazy(() => UserUpdateWithoutBookingsInputSchema), z.lazy(() => UserUncheckedUpdateWithoutBookingsInputSchema) ]).optional(),
}).strict();

export const ServiceUpdateOneRequiredWithoutBookingsNestedInputSchema: z.ZodType<Prisma.ServiceUpdateOneRequiredWithoutBookingsNestedInput> = z.object({
  create: z.union([ z.lazy(() => ServiceCreateWithoutBookingsInputSchema), z.lazy(() => ServiceUncheckedCreateWithoutBookingsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ServiceCreateOrConnectWithoutBookingsInputSchema).optional(),
  upsert: z.lazy(() => ServiceUpsertWithoutBookingsInputSchema).optional(),
  connect: z.lazy(() => ServiceWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ServiceUpdateToOneWithWhereWithoutBookingsInputSchema), z.lazy(() => ServiceUpdateWithoutBookingsInputSchema), z.lazy(() => ServiceUncheckedUpdateWithoutBookingsInputSchema) ]).optional(),
}).strict();

export const BookingDetailsUpdateOneWithoutBookingNestedInputSchema: z.ZodType<Prisma.BookingDetailsUpdateOneWithoutBookingNestedInput> = z.object({
  create: z.union([ z.lazy(() => BookingDetailsCreateWithoutBookingInputSchema), z.lazy(() => BookingDetailsUncheckedCreateWithoutBookingInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => BookingDetailsCreateOrConnectWithoutBookingInputSchema).optional(),
  upsert: z.lazy(() => BookingDetailsUpsertWithoutBookingInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => BookingDetailsWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => BookingDetailsWhereInputSchema) ]).optional(),
  connect: z.lazy(() => BookingDetailsWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => BookingDetailsUpdateToOneWithWhereWithoutBookingInputSchema), z.lazy(() => BookingDetailsUpdateWithoutBookingInputSchema), z.lazy(() => BookingDetailsUncheckedUpdateWithoutBookingInputSchema) ]).optional(),
}).strict();

export const PaymentUpdateOneWithoutBookingNestedInputSchema: z.ZodType<Prisma.PaymentUpdateOneWithoutBookingNestedInput> = z.object({
  create: z.union([ z.lazy(() => PaymentCreateWithoutBookingInputSchema), z.lazy(() => PaymentUncheckedCreateWithoutBookingInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PaymentCreateOrConnectWithoutBookingInputSchema).optional(),
  upsert: z.lazy(() => PaymentUpsertWithoutBookingInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => PaymentWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => PaymentWhereInputSchema) ]).optional(),
  connect: z.lazy(() => PaymentWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PaymentUpdateToOneWithWhereWithoutBookingInputSchema), z.lazy(() => PaymentUpdateWithoutBookingInputSchema), z.lazy(() => PaymentUncheckedUpdateWithoutBookingInputSchema) ]).optional(),
}).strict();

export const ServiceSlotUpdateManyWithoutBookingNestedInputSchema: z.ZodType<Prisma.ServiceSlotUpdateManyWithoutBookingNestedInput> = z.object({
  create: z.union([ z.lazy(() => ServiceSlotCreateWithoutBookingInputSchema), z.lazy(() => ServiceSlotCreateWithoutBookingInputSchema).array(), z.lazy(() => ServiceSlotUncheckedCreateWithoutBookingInputSchema), z.lazy(() => ServiceSlotUncheckedCreateWithoutBookingInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ServiceSlotCreateOrConnectWithoutBookingInputSchema), z.lazy(() => ServiceSlotCreateOrConnectWithoutBookingInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ServiceSlotUpsertWithWhereUniqueWithoutBookingInputSchema), z.lazy(() => ServiceSlotUpsertWithWhereUniqueWithoutBookingInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ServiceSlotCreateManyBookingInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ServiceSlotWhereUniqueInputSchema), z.lazy(() => ServiceSlotWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ServiceSlotWhereUniqueInputSchema), z.lazy(() => ServiceSlotWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ServiceSlotWhereUniqueInputSchema), z.lazy(() => ServiceSlotWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ServiceSlotWhereUniqueInputSchema), z.lazy(() => ServiceSlotWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ServiceSlotUpdateWithWhereUniqueWithoutBookingInputSchema), z.lazy(() => ServiceSlotUpdateWithWhereUniqueWithoutBookingInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ServiceSlotUpdateManyWithWhereWithoutBookingInputSchema), z.lazy(() => ServiceSlotUpdateManyWithWhereWithoutBookingInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ServiceSlotScalarWhereInputSchema), z.lazy(() => ServiceSlotScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const BookingDetailsUncheckedUpdateOneWithoutBookingNestedInputSchema: z.ZodType<Prisma.BookingDetailsUncheckedUpdateOneWithoutBookingNestedInput> = z.object({
  create: z.union([ z.lazy(() => BookingDetailsCreateWithoutBookingInputSchema), z.lazy(() => BookingDetailsUncheckedCreateWithoutBookingInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => BookingDetailsCreateOrConnectWithoutBookingInputSchema).optional(),
  upsert: z.lazy(() => BookingDetailsUpsertWithoutBookingInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => BookingDetailsWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => BookingDetailsWhereInputSchema) ]).optional(),
  connect: z.lazy(() => BookingDetailsWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => BookingDetailsUpdateToOneWithWhereWithoutBookingInputSchema), z.lazy(() => BookingDetailsUpdateWithoutBookingInputSchema), z.lazy(() => BookingDetailsUncheckedUpdateWithoutBookingInputSchema) ]).optional(),
}).strict();

export const PaymentUncheckedUpdateOneWithoutBookingNestedInputSchema: z.ZodType<Prisma.PaymentUncheckedUpdateOneWithoutBookingNestedInput> = z.object({
  create: z.union([ z.lazy(() => PaymentCreateWithoutBookingInputSchema), z.lazy(() => PaymentUncheckedCreateWithoutBookingInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PaymentCreateOrConnectWithoutBookingInputSchema).optional(),
  upsert: z.lazy(() => PaymentUpsertWithoutBookingInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => PaymentWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => PaymentWhereInputSchema) ]).optional(),
  connect: z.lazy(() => PaymentWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PaymentUpdateToOneWithWhereWithoutBookingInputSchema), z.lazy(() => PaymentUpdateWithoutBookingInputSchema), z.lazy(() => PaymentUncheckedUpdateWithoutBookingInputSchema) ]).optional(),
}).strict();

export const ServiceSlotUncheckedUpdateManyWithoutBookingNestedInputSchema: z.ZodType<Prisma.ServiceSlotUncheckedUpdateManyWithoutBookingNestedInput> = z.object({
  create: z.union([ z.lazy(() => ServiceSlotCreateWithoutBookingInputSchema), z.lazy(() => ServiceSlotCreateWithoutBookingInputSchema).array(), z.lazy(() => ServiceSlotUncheckedCreateWithoutBookingInputSchema), z.lazy(() => ServiceSlotUncheckedCreateWithoutBookingInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ServiceSlotCreateOrConnectWithoutBookingInputSchema), z.lazy(() => ServiceSlotCreateOrConnectWithoutBookingInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ServiceSlotUpsertWithWhereUniqueWithoutBookingInputSchema), z.lazy(() => ServiceSlotUpsertWithWhereUniqueWithoutBookingInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ServiceSlotCreateManyBookingInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ServiceSlotWhereUniqueInputSchema), z.lazy(() => ServiceSlotWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ServiceSlotWhereUniqueInputSchema), z.lazy(() => ServiceSlotWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ServiceSlotWhereUniqueInputSchema), z.lazy(() => ServiceSlotWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ServiceSlotWhereUniqueInputSchema), z.lazy(() => ServiceSlotWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ServiceSlotUpdateWithWhereUniqueWithoutBookingInputSchema), z.lazy(() => ServiceSlotUpdateWithWhereUniqueWithoutBookingInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ServiceSlotUpdateManyWithWhereWithoutBookingInputSchema), z.lazy(() => ServiceSlotUpdateManyWithWhereWithoutBookingInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ServiceSlotScalarWhereInputSchema), z.lazy(() => ServiceSlotScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const BookingCreateNestedOneWithoutDetailsInputSchema: z.ZodType<Prisma.BookingCreateNestedOneWithoutDetailsInput> = z.object({
  create: z.union([ z.lazy(() => BookingCreateWithoutDetailsInputSchema), z.lazy(() => BookingUncheckedCreateWithoutDetailsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => BookingCreateOrConnectWithoutDetailsInputSchema).optional(),
  connect: z.lazy(() => BookingWhereUniqueInputSchema).optional(),
}).strict();

export const BookingUpdateOneRequiredWithoutDetailsNestedInputSchema: z.ZodType<Prisma.BookingUpdateOneRequiredWithoutDetailsNestedInput> = z.object({
  create: z.union([ z.lazy(() => BookingCreateWithoutDetailsInputSchema), z.lazy(() => BookingUncheckedCreateWithoutDetailsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => BookingCreateOrConnectWithoutDetailsInputSchema).optional(),
  upsert: z.lazy(() => BookingUpsertWithoutDetailsInputSchema).optional(),
  connect: z.lazy(() => BookingWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => BookingUpdateToOneWithWhereWithoutDetailsInputSchema), z.lazy(() => BookingUpdateWithoutDetailsInputSchema), z.lazy(() => BookingUncheckedUpdateWithoutDetailsInputSchema) ]).optional(),
}).strict();

export const ServiceCreateNestedOneWithoutSlotsInputSchema: z.ZodType<Prisma.ServiceCreateNestedOneWithoutSlotsInput> = z.object({
  create: z.union([ z.lazy(() => ServiceCreateWithoutSlotsInputSchema), z.lazy(() => ServiceUncheckedCreateWithoutSlotsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ServiceCreateOrConnectWithoutSlotsInputSchema).optional(),
  connect: z.lazy(() => ServiceWhereUniqueInputSchema).optional(),
}).strict();

export const BookingCreateNestedOneWithoutSlotsInputSchema: z.ZodType<Prisma.BookingCreateNestedOneWithoutSlotsInput> = z.object({
  create: z.union([ z.lazy(() => BookingCreateWithoutSlotsInputSchema), z.lazy(() => BookingUncheckedCreateWithoutSlotsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => BookingCreateOrConnectWithoutSlotsInputSchema).optional(),
  connect: z.lazy(() => BookingWhereUniqueInputSchema).optional(),
}).strict();

export const EnumSlotStatusFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumSlotStatusFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => SlotStatusSchema).optional(),
}).strict();

export const ServiceUpdateOneRequiredWithoutSlotsNestedInputSchema: z.ZodType<Prisma.ServiceUpdateOneRequiredWithoutSlotsNestedInput> = z.object({
  create: z.union([ z.lazy(() => ServiceCreateWithoutSlotsInputSchema), z.lazy(() => ServiceUncheckedCreateWithoutSlotsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ServiceCreateOrConnectWithoutSlotsInputSchema).optional(),
  upsert: z.lazy(() => ServiceUpsertWithoutSlotsInputSchema).optional(),
  connect: z.lazy(() => ServiceWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ServiceUpdateToOneWithWhereWithoutSlotsInputSchema), z.lazy(() => ServiceUpdateWithoutSlotsInputSchema), z.lazy(() => ServiceUncheckedUpdateWithoutSlotsInputSchema) ]).optional(),
}).strict();

export const BookingUpdateOneWithoutSlotsNestedInputSchema: z.ZodType<Prisma.BookingUpdateOneWithoutSlotsNestedInput> = z.object({
  create: z.union([ z.lazy(() => BookingCreateWithoutSlotsInputSchema), z.lazy(() => BookingUncheckedCreateWithoutSlotsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => BookingCreateOrConnectWithoutSlotsInputSchema).optional(),
  upsert: z.lazy(() => BookingUpsertWithoutSlotsInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => BookingWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => BookingWhereInputSchema) ]).optional(),
  connect: z.lazy(() => BookingWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => BookingUpdateToOneWithWhereWithoutSlotsInputSchema), z.lazy(() => BookingUpdateWithoutSlotsInputSchema), z.lazy(() => BookingUncheckedUpdateWithoutSlotsInputSchema) ]).optional(),
}).strict();

export const BookingCreateNestedOneWithoutPaymentInputSchema: z.ZodType<Prisma.BookingCreateNestedOneWithoutPaymentInput> = z.object({
  create: z.union([ z.lazy(() => BookingCreateWithoutPaymentInputSchema), z.lazy(() => BookingUncheckedCreateWithoutPaymentInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => BookingCreateOrConnectWithoutPaymentInputSchema).optional(),
  connect: z.lazy(() => BookingWhereUniqueInputSchema).optional(),
}).strict();

export const BookingUpdateOneRequiredWithoutPaymentNestedInputSchema: z.ZodType<Prisma.BookingUpdateOneRequiredWithoutPaymentNestedInput> = z.object({
  create: z.union([ z.lazy(() => BookingCreateWithoutPaymentInputSchema), z.lazy(() => BookingUncheckedCreateWithoutPaymentInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => BookingCreateOrConnectWithoutPaymentInputSchema).optional(),
  upsert: z.lazy(() => BookingUpsertWithoutPaymentInputSchema).optional(),
  connect: z.lazy(() => BookingWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => BookingUpdateToOneWithWhereWithoutPaymentInputSchema), z.lazy(() => BookingUpdateWithoutPaymentInputSchema), z.lazy(() => BookingUncheckedUpdateWithoutPaymentInputSchema) ]).optional(),
}).strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const NestedEnumRoleFilterSchema: z.ZodType<Prisma.NestedEnumRoleFilter> = z.object({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema), z.lazy(() => NestedEnumRoleFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional(),
}).strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const NestedEnumRoleWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumRoleWithAggregatesFilter> = z.object({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema), z.lazy(() => NestedEnumRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumRoleFilterSchema).optional(),
}).strict();

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional(),
}).strict();

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional(),
}).strict();

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional(),
}).strict();

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional(),
}).strict();

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const NestedDecimalFilterSchema: z.ZodType<Prisma.NestedDecimalFilter> = z.object({
  equals: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  in: z.union([z.number().array(),z.string().array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  notIn: z.union([z.number().array(),z.string().array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  lt: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lte: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gt: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gte: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  not: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NestedDecimalFilterSchema) ]).optional(),
}).strict();

export const NestedDecimalWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDecimalWithAggregatesFilter> = z.object({
  equals: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  in: z.union([z.number().array(),z.string().array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  notIn: z.union([z.number().array(),z.string().array(),z.instanceof(Prisma.Decimal).array(),DecimalJsLikeSchema.array(),]).refine((v) => Array.isArray(v) && (v as any[]).every((v) => isValidDecimalInput(v)), { message: 'Must be a Decimal' }).optional(),
  lt: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  lte: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gt: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  gte: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  not: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => NestedDecimalWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedDecimalFilterSchema).optional(),
  _sum: z.lazy(() => NestedDecimalFilterSchema).optional(),
  _min: z.lazy(() => NestedDecimalFilterSchema).optional(),
  _max: z.lazy(() => NestedDecimalFilterSchema).optional(),
}).strict();

export const NestedJsonNullableFilterSchema: z.ZodType<Prisma.NestedJsonNullableFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
}).strict();

export const NestedEnumBookingStatusFilterSchema: z.ZodType<Prisma.NestedEnumBookingStatusFilter> = z.object({
  equals: z.lazy(() => BookingStatusSchema).optional(),
  in: z.lazy(() => BookingStatusSchema).array().optional(),
  notIn: z.lazy(() => BookingStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => BookingStatusSchema), z.lazy(() => NestedEnumBookingStatusFilterSchema) ]).optional(),
}).strict();

export const NestedEnumBookingStatusWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumBookingStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => BookingStatusSchema).optional(),
  in: z.lazy(() => BookingStatusSchema).array().optional(),
  notIn: z.lazy(() => BookingStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => BookingStatusSchema), z.lazy(() => NestedEnumBookingStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumBookingStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumBookingStatusFilterSchema).optional(),
}).strict();

export const NestedJsonFilterSchema: z.ZodType<Prisma.NestedJsonFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
}).strict();

export const NestedEnumSlotStatusFilterSchema: z.ZodType<Prisma.NestedEnumSlotStatusFilter> = z.object({
  equals: z.lazy(() => SlotStatusSchema).optional(),
  in: z.lazy(() => SlotStatusSchema).array().optional(),
  notIn: z.lazy(() => SlotStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => SlotStatusSchema), z.lazy(() => NestedEnumSlotStatusFilterSchema) ]).optional(),
}).strict();

export const NestedEnumSlotStatusWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumSlotStatusWithAggregatesFilter> = z.object({
  equals: z.lazy(() => SlotStatusSchema).optional(),
  in: z.lazy(() => SlotStatusSchema).array().optional(),
  notIn: z.lazy(() => SlotStatusSchema).array().optional(),
  not: z.union([ z.lazy(() => SlotStatusSchema), z.lazy(() => NestedEnumSlotStatusWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumSlotStatusFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumSlotStatusFilterSchema).optional(),
}).strict();

export const ProfileCreateWithoutUserInputSchema: z.ZodType<Prisma.ProfileCreateWithoutUserInput> = z.object({
  id: z.uuid().optional(),
  displayName: z.string(),
  bio: z.string().optional().nullable(),
  avatarUrl: z.string().optional().nullable(),
  serviceRadiusKm: z.number().int().optional(),
  ratingAvg: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  reviewsCount: z.number().int().optional(),
  businessHours: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  isVerified: z.boolean().optional(),
  portfolio: z.lazy(() => PortfolioItemCreateNestedManyWithoutProfileInputSchema).optional(),
}).strict();

export const ProfileUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.ProfileUncheckedCreateWithoutUserInput> = z.object({
  id: z.uuid().optional(),
  displayName: z.string(),
  bio: z.string().optional().nullable(),
  avatarUrl: z.string().optional().nullable(),
  serviceRadiusKm: z.number().int().optional(),
  ratingAvg: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  reviewsCount: z.number().int().optional(),
  businessHours: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  isVerified: z.boolean().optional(),
  portfolio: z.lazy(() => PortfolioItemUncheckedCreateNestedManyWithoutProfileInputSchema).optional(),
}).strict();

export const ProfileCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.ProfileCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => ProfileWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProfileCreateWithoutUserInputSchema), z.lazy(() => ProfileUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const ServiceCreateWithoutVendorInputSchema: z.ZodType<Prisma.ServiceCreateWithoutVendorInput> = z.object({
  id: z.uuid().optional(),
  title: z.string(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  basePrice: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  isActive: z.boolean().optional(),
  dynamicAttributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  category: z.lazy(() => CategoryCreateNestedOneWithoutServicesInputSchema),
  unit: z.lazy(() => ServiceUnitCreateNestedOneWithoutServicesInputSchema),
  metadata: z.lazy(() => ServiceMetadataCreateNestedManyWithoutServiceInputSchema).optional(),
  slots: z.lazy(() => ServiceSlotCreateNestedManyWithoutServiceInputSchema).optional(),
  bookings: z.lazy(() => BookingCreateNestedManyWithoutServiceInputSchema).optional(),
}).strict();

export const ServiceUncheckedCreateWithoutVendorInputSchema: z.ZodType<Prisma.ServiceUncheckedCreateWithoutVendorInput> = z.object({
  id: z.uuid().optional(),
  categoryId: z.string(),
  unitId: z.string(),
  title: z.string(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  basePrice: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  isActive: z.boolean().optional(),
  dynamicAttributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  metadata: z.lazy(() => ServiceMetadataUncheckedCreateNestedManyWithoutServiceInputSchema).optional(),
  slots: z.lazy(() => ServiceSlotUncheckedCreateNestedManyWithoutServiceInputSchema).optional(),
  bookings: z.lazy(() => BookingUncheckedCreateNestedManyWithoutServiceInputSchema).optional(),
}).strict();

export const ServiceCreateOrConnectWithoutVendorInputSchema: z.ZodType<Prisma.ServiceCreateOrConnectWithoutVendorInput> = z.object({
  where: z.lazy(() => ServiceWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ServiceCreateWithoutVendorInputSchema), z.lazy(() => ServiceUncheckedCreateWithoutVendorInputSchema) ]),
}).strict();

export const ServiceCreateManyVendorInputEnvelopeSchema: z.ZodType<Prisma.ServiceCreateManyVendorInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ServiceCreateManyVendorInputSchema), z.lazy(() => ServiceCreateManyVendorInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const BookingCreateWithoutCustomerInputSchema: z.ZodType<Prisma.BookingCreateWithoutCustomerInput> = z.object({
  id: z.uuid().optional(),
  status: z.lazy(() => BookingStatusSchema).optional(),
  scheduledDate: z.coerce.date(),
  service: z.lazy(() => ServiceCreateNestedOneWithoutBookingsInputSchema),
  details: z.lazy(() => BookingDetailsCreateNestedOneWithoutBookingInputSchema).optional(),
  payment: z.lazy(() => PaymentCreateNestedOneWithoutBookingInputSchema).optional(),
  slots: z.lazy(() => ServiceSlotCreateNestedManyWithoutBookingInputSchema).optional(),
}).strict();

export const BookingUncheckedCreateWithoutCustomerInputSchema: z.ZodType<Prisma.BookingUncheckedCreateWithoutCustomerInput> = z.object({
  id: z.uuid().optional(),
  serviceId: z.string(),
  status: z.lazy(() => BookingStatusSchema).optional(),
  scheduledDate: z.coerce.date(),
  details: z.lazy(() => BookingDetailsUncheckedCreateNestedOneWithoutBookingInputSchema).optional(),
  payment: z.lazy(() => PaymentUncheckedCreateNestedOneWithoutBookingInputSchema).optional(),
  slots: z.lazy(() => ServiceSlotUncheckedCreateNestedManyWithoutBookingInputSchema).optional(),
}).strict();

export const BookingCreateOrConnectWithoutCustomerInputSchema: z.ZodType<Prisma.BookingCreateOrConnectWithoutCustomerInput> = z.object({
  where: z.lazy(() => BookingWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => BookingCreateWithoutCustomerInputSchema), z.lazy(() => BookingUncheckedCreateWithoutCustomerInputSchema) ]),
}).strict();

export const BookingCreateManyCustomerInputEnvelopeSchema: z.ZodType<Prisma.BookingCreateManyCustomerInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => BookingCreateManyCustomerInputSchema), z.lazy(() => BookingCreateManyCustomerInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const MediaCreateWithoutUserInputSchema: z.ZodType<Prisma.MediaCreateWithoutUserInput> = z.object({
  id: z.uuid().optional(),
  url: z.string(),
  key: z.string().optional().nullable(),
  fileName: z.string(),
  mimeType: z.string(),
  size: z.number().int(),
  alt: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
}).strict();

export const MediaUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.MediaUncheckedCreateWithoutUserInput> = z.object({
  id: z.uuid().optional(),
  url: z.string(),
  key: z.string().optional().nullable(),
  fileName: z.string(),
  mimeType: z.string(),
  size: z.number().int(),
  alt: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
}).strict();

export const MediaCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.MediaCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => MediaWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MediaCreateWithoutUserInputSchema), z.lazy(() => MediaUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const MediaCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.MediaCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => MediaCreateManyUserInputSchema), z.lazy(() => MediaCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const MessageCreateWithoutSenderInputSchema: z.ZodType<Prisma.MessageCreateWithoutSenderInput> = z.object({
  id: z.uuid().optional(),
  content: z.string(),
  isRead: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  receiver: z.lazy(() => UserCreateNestedOneWithoutReceivedMessagesInputSchema),
}).strict();

export const MessageUncheckedCreateWithoutSenderInputSchema: z.ZodType<Prisma.MessageUncheckedCreateWithoutSenderInput> = z.object({
  id: z.uuid().optional(),
  content: z.string(),
  receiverId: z.string(),
  isRead: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
}).strict();

export const MessageCreateOrConnectWithoutSenderInputSchema: z.ZodType<Prisma.MessageCreateOrConnectWithoutSenderInput> = z.object({
  where: z.lazy(() => MessageWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MessageCreateWithoutSenderInputSchema), z.lazy(() => MessageUncheckedCreateWithoutSenderInputSchema) ]),
}).strict();

export const MessageCreateManySenderInputEnvelopeSchema: z.ZodType<Prisma.MessageCreateManySenderInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => MessageCreateManySenderInputSchema), z.lazy(() => MessageCreateManySenderInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const MessageCreateWithoutReceiverInputSchema: z.ZodType<Prisma.MessageCreateWithoutReceiverInput> = z.object({
  id: z.uuid().optional(),
  content: z.string(),
  isRead: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  sender: z.lazy(() => UserCreateNestedOneWithoutSentMessagesInputSchema),
}).strict();

export const MessageUncheckedCreateWithoutReceiverInputSchema: z.ZodType<Prisma.MessageUncheckedCreateWithoutReceiverInput> = z.object({
  id: z.uuid().optional(),
  content: z.string(),
  senderId: z.string(),
  isRead: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
}).strict();

export const MessageCreateOrConnectWithoutReceiverInputSchema: z.ZodType<Prisma.MessageCreateOrConnectWithoutReceiverInput> = z.object({
  where: z.lazy(() => MessageWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => MessageCreateWithoutReceiverInputSchema), z.lazy(() => MessageUncheckedCreateWithoutReceiverInputSchema) ]),
}).strict();

export const MessageCreateManyReceiverInputEnvelopeSchema: z.ZodType<Prisma.MessageCreateManyReceiverInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => MessageCreateManyReceiverInputSchema), z.lazy(() => MessageCreateManyReceiverInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const ProfileUpsertWithoutUserInputSchema: z.ZodType<Prisma.ProfileUpsertWithoutUserInput> = z.object({
  update: z.union([ z.lazy(() => ProfileUpdateWithoutUserInputSchema), z.lazy(() => ProfileUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => ProfileCreateWithoutUserInputSchema), z.lazy(() => ProfileUncheckedCreateWithoutUserInputSchema) ]),
  where: z.lazy(() => ProfileWhereInputSchema).optional(),
}).strict();

export const ProfileUpdateToOneWithWhereWithoutUserInputSchema: z.ZodType<Prisma.ProfileUpdateToOneWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => ProfileWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ProfileUpdateWithoutUserInputSchema), z.lazy(() => ProfileUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const ProfileUpdateWithoutUserInputSchema: z.ZodType<Prisma.ProfileUpdateWithoutUserInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  displayName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  bio: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  avatarUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  serviceRadiusKm: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  ratingAvg: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  reviewsCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  businessHours: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  isVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  portfolio: z.lazy(() => PortfolioItemUpdateManyWithoutProfileNestedInputSchema).optional(),
}).strict();

export const ProfileUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.ProfileUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  displayName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  bio: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  avatarUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  serviceRadiusKm: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  ratingAvg: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  reviewsCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  businessHours: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  isVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  portfolio: z.lazy(() => PortfolioItemUncheckedUpdateManyWithoutProfileNestedInputSchema).optional(),
}).strict();

export const ServiceUpsertWithWhereUniqueWithoutVendorInputSchema: z.ZodType<Prisma.ServiceUpsertWithWhereUniqueWithoutVendorInput> = z.object({
  where: z.lazy(() => ServiceWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ServiceUpdateWithoutVendorInputSchema), z.lazy(() => ServiceUncheckedUpdateWithoutVendorInputSchema) ]),
  create: z.union([ z.lazy(() => ServiceCreateWithoutVendorInputSchema), z.lazy(() => ServiceUncheckedCreateWithoutVendorInputSchema) ]),
}).strict();

export const ServiceUpdateWithWhereUniqueWithoutVendorInputSchema: z.ZodType<Prisma.ServiceUpdateWithWhereUniqueWithoutVendorInput> = z.object({
  where: z.lazy(() => ServiceWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ServiceUpdateWithoutVendorInputSchema), z.lazy(() => ServiceUncheckedUpdateWithoutVendorInputSchema) ]),
}).strict();

export const ServiceUpdateManyWithWhereWithoutVendorInputSchema: z.ZodType<Prisma.ServiceUpdateManyWithWhereWithoutVendorInput> = z.object({
  where: z.lazy(() => ServiceScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ServiceUpdateManyMutationInputSchema), z.lazy(() => ServiceUncheckedUpdateManyWithoutVendorInputSchema) ]),
}).strict();

export const ServiceScalarWhereInputSchema: z.ZodType<Prisma.ServiceScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ServiceScalarWhereInputSchema), z.lazy(() => ServiceScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ServiceScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ServiceScalarWhereInputSchema), z.lazy(() => ServiceScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  vendorId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  categoryId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  unitId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  imageUrl: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  basePrice: z.union([ z.lazy(() => DecimalFilterSchema), z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }) ]).optional(),
  isActive: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  dynamicAttributes: z.lazy(() => JsonNullableFilterSchema).optional(),
}).strict();

export const BookingUpsertWithWhereUniqueWithoutCustomerInputSchema: z.ZodType<Prisma.BookingUpsertWithWhereUniqueWithoutCustomerInput> = z.object({
  where: z.lazy(() => BookingWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => BookingUpdateWithoutCustomerInputSchema), z.lazy(() => BookingUncheckedUpdateWithoutCustomerInputSchema) ]),
  create: z.union([ z.lazy(() => BookingCreateWithoutCustomerInputSchema), z.lazy(() => BookingUncheckedCreateWithoutCustomerInputSchema) ]),
}).strict();

export const BookingUpdateWithWhereUniqueWithoutCustomerInputSchema: z.ZodType<Prisma.BookingUpdateWithWhereUniqueWithoutCustomerInput> = z.object({
  where: z.lazy(() => BookingWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => BookingUpdateWithoutCustomerInputSchema), z.lazy(() => BookingUncheckedUpdateWithoutCustomerInputSchema) ]),
}).strict();

export const BookingUpdateManyWithWhereWithoutCustomerInputSchema: z.ZodType<Prisma.BookingUpdateManyWithWhereWithoutCustomerInput> = z.object({
  where: z.lazy(() => BookingScalarWhereInputSchema),
  data: z.union([ z.lazy(() => BookingUpdateManyMutationInputSchema), z.lazy(() => BookingUncheckedUpdateManyWithoutCustomerInputSchema) ]),
}).strict();

export const BookingScalarWhereInputSchema: z.ZodType<Prisma.BookingScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => BookingScalarWhereInputSchema), z.lazy(() => BookingScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => BookingScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BookingScalarWhereInputSchema), z.lazy(() => BookingScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  customerId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  serviceId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  status: z.union([ z.lazy(() => EnumBookingStatusFilterSchema), z.lazy(() => BookingStatusSchema) ]).optional(),
  scheduledDate: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
}).strict();

export const MediaUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.MediaUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => MediaWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => MediaUpdateWithoutUserInputSchema), z.lazy(() => MediaUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => MediaCreateWithoutUserInputSchema), z.lazy(() => MediaUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const MediaUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.MediaUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => MediaWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => MediaUpdateWithoutUserInputSchema), z.lazy(() => MediaUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const MediaUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.MediaUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => MediaScalarWhereInputSchema),
  data: z.union([ z.lazy(() => MediaUpdateManyMutationInputSchema), z.lazy(() => MediaUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const MediaScalarWhereInputSchema: z.ZodType<Prisma.MediaScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => MediaScalarWhereInputSchema), z.lazy(() => MediaScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MediaScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MediaScalarWhereInputSchema), z.lazy(() => MediaScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  url: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  key: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  fileName: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  mimeType: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  size: z.union([ z.lazy(() => IntFilterSchema), z.number() ]).optional(),
  alt: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
}).strict();

export const MessageUpsertWithWhereUniqueWithoutSenderInputSchema: z.ZodType<Prisma.MessageUpsertWithWhereUniqueWithoutSenderInput> = z.object({
  where: z.lazy(() => MessageWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => MessageUpdateWithoutSenderInputSchema), z.lazy(() => MessageUncheckedUpdateWithoutSenderInputSchema) ]),
  create: z.union([ z.lazy(() => MessageCreateWithoutSenderInputSchema), z.lazy(() => MessageUncheckedCreateWithoutSenderInputSchema) ]),
}).strict();

export const MessageUpdateWithWhereUniqueWithoutSenderInputSchema: z.ZodType<Prisma.MessageUpdateWithWhereUniqueWithoutSenderInput> = z.object({
  where: z.lazy(() => MessageWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => MessageUpdateWithoutSenderInputSchema), z.lazy(() => MessageUncheckedUpdateWithoutSenderInputSchema) ]),
}).strict();

export const MessageUpdateManyWithWhereWithoutSenderInputSchema: z.ZodType<Prisma.MessageUpdateManyWithWhereWithoutSenderInput> = z.object({
  where: z.lazy(() => MessageScalarWhereInputSchema),
  data: z.union([ z.lazy(() => MessageUpdateManyMutationInputSchema), z.lazy(() => MessageUncheckedUpdateManyWithoutSenderInputSchema) ]),
}).strict();

export const MessageScalarWhereInputSchema: z.ZodType<Prisma.MessageScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => MessageScalarWhereInputSchema), z.lazy(() => MessageScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => MessageScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => MessageScalarWhereInputSchema), z.lazy(() => MessageScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  content: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  senderId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  receiverId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  isRead: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
}).strict();

export const MessageUpsertWithWhereUniqueWithoutReceiverInputSchema: z.ZodType<Prisma.MessageUpsertWithWhereUniqueWithoutReceiverInput> = z.object({
  where: z.lazy(() => MessageWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => MessageUpdateWithoutReceiverInputSchema), z.lazy(() => MessageUncheckedUpdateWithoutReceiverInputSchema) ]),
  create: z.union([ z.lazy(() => MessageCreateWithoutReceiverInputSchema), z.lazy(() => MessageUncheckedCreateWithoutReceiverInputSchema) ]),
}).strict();

export const MessageUpdateWithWhereUniqueWithoutReceiverInputSchema: z.ZodType<Prisma.MessageUpdateWithWhereUniqueWithoutReceiverInput> = z.object({
  where: z.lazy(() => MessageWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => MessageUpdateWithoutReceiverInputSchema), z.lazy(() => MessageUncheckedUpdateWithoutReceiverInputSchema) ]),
}).strict();

export const MessageUpdateManyWithWhereWithoutReceiverInputSchema: z.ZodType<Prisma.MessageUpdateManyWithWhereWithoutReceiverInput> = z.object({
  where: z.lazy(() => MessageScalarWhereInputSchema),
  data: z.union([ z.lazy(() => MessageUpdateManyMutationInputSchema), z.lazy(() => MessageUncheckedUpdateManyWithoutReceiverInputSchema) ]),
}).strict();

export const UserCreateWithoutSentMessagesInputSchema: z.ZodType<Prisma.UserCreateWithoutSentMessagesInput> = z.object({
  id: z.uuid().optional(),
  email: z.string(),
  password: z.string(),
  role: z.lazy(() => RoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  profile: z.lazy(() => ProfileCreateNestedOneWithoutUserInputSchema).optional(),
  services: z.lazy(() => ServiceCreateNestedManyWithoutVendorInputSchema).optional(),
  bookings: z.lazy(() => BookingCreateNestedManyWithoutCustomerInputSchema).optional(),
  media: z.lazy(() => MediaCreateNestedManyWithoutUserInputSchema).optional(),
  receivedMessages: z.lazy(() => MessageCreateNestedManyWithoutReceiverInputSchema).optional(),
}).strict();

export const UserUncheckedCreateWithoutSentMessagesInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutSentMessagesInput> = z.object({
  id: z.uuid().optional(),
  email: z.string(),
  password: z.string(),
  role: z.lazy(() => RoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  profile: z.lazy(() => ProfileUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  services: z.lazy(() => ServiceUncheckedCreateNestedManyWithoutVendorInputSchema).optional(),
  bookings: z.lazy(() => BookingUncheckedCreateNestedManyWithoutCustomerInputSchema).optional(),
  media: z.lazy(() => MediaUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  receivedMessages: z.lazy(() => MessageUncheckedCreateNestedManyWithoutReceiverInputSchema).optional(),
}).strict();

export const UserCreateOrConnectWithoutSentMessagesInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutSentMessagesInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutSentMessagesInputSchema), z.lazy(() => UserUncheckedCreateWithoutSentMessagesInputSchema) ]),
}).strict();

export const UserCreateWithoutReceivedMessagesInputSchema: z.ZodType<Prisma.UserCreateWithoutReceivedMessagesInput> = z.object({
  id: z.uuid().optional(),
  email: z.string(),
  password: z.string(),
  role: z.lazy(() => RoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  profile: z.lazy(() => ProfileCreateNestedOneWithoutUserInputSchema).optional(),
  services: z.lazy(() => ServiceCreateNestedManyWithoutVendorInputSchema).optional(),
  bookings: z.lazy(() => BookingCreateNestedManyWithoutCustomerInputSchema).optional(),
  media: z.lazy(() => MediaCreateNestedManyWithoutUserInputSchema).optional(),
  sentMessages: z.lazy(() => MessageCreateNestedManyWithoutSenderInputSchema).optional(),
}).strict();

export const UserUncheckedCreateWithoutReceivedMessagesInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutReceivedMessagesInput> = z.object({
  id: z.uuid().optional(),
  email: z.string(),
  password: z.string(),
  role: z.lazy(() => RoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  profile: z.lazy(() => ProfileUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  services: z.lazy(() => ServiceUncheckedCreateNestedManyWithoutVendorInputSchema).optional(),
  bookings: z.lazy(() => BookingUncheckedCreateNestedManyWithoutCustomerInputSchema).optional(),
  media: z.lazy(() => MediaUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sentMessages: z.lazy(() => MessageUncheckedCreateNestedManyWithoutSenderInputSchema).optional(),
}).strict();

export const UserCreateOrConnectWithoutReceivedMessagesInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutReceivedMessagesInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutReceivedMessagesInputSchema), z.lazy(() => UserUncheckedCreateWithoutReceivedMessagesInputSchema) ]),
}).strict();

export const UserUpsertWithoutSentMessagesInputSchema: z.ZodType<Prisma.UserUpsertWithoutSentMessagesInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutSentMessagesInputSchema), z.lazy(() => UserUncheckedUpdateWithoutSentMessagesInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutSentMessagesInputSchema), z.lazy(() => UserUncheckedCreateWithoutSentMessagesInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional(),
}).strict();

export const UserUpdateToOneWithWhereWithoutSentMessagesInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutSentMessagesInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutSentMessagesInputSchema), z.lazy(() => UserUncheckedUpdateWithoutSentMessagesInputSchema) ]),
}).strict();

export const UserUpdateWithoutSentMessagesInputSchema: z.ZodType<Prisma.UserUpdateWithoutSentMessagesInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema), z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  profile: z.lazy(() => ProfileUpdateOneWithoutUserNestedInputSchema).optional(),
  services: z.lazy(() => ServiceUpdateManyWithoutVendorNestedInputSchema).optional(),
  bookings: z.lazy(() => BookingUpdateManyWithoutCustomerNestedInputSchema).optional(),
  media: z.lazy(() => MediaUpdateManyWithoutUserNestedInputSchema).optional(),
  receivedMessages: z.lazy(() => MessageUpdateManyWithoutReceiverNestedInputSchema).optional(),
}).strict();

export const UserUncheckedUpdateWithoutSentMessagesInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutSentMessagesInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema), z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  profile: z.lazy(() => ProfileUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  services: z.lazy(() => ServiceUncheckedUpdateManyWithoutVendorNestedInputSchema).optional(),
  bookings: z.lazy(() => BookingUncheckedUpdateManyWithoutCustomerNestedInputSchema).optional(),
  media: z.lazy(() => MediaUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  receivedMessages: z.lazy(() => MessageUncheckedUpdateManyWithoutReceiverNestedInputSchema).optional(),
}).strict();

export const UserUpsertWithoutReceivedMessagesInputSchema: z.ZodType<Prisma.UserUpsertWithoutReceivedMessagesInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutReceivedMessagesInputSchema), z.lazy(() => UserUncheckedUpdateWithoutReceivedMessagesInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutReceivedMessagesInputSchema), z.lazy(() => UserUncheckedCreateWithoutReceivedMessagesInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional(),
}).strict();

export const UserUpdateToOneWithWhereWithoutReceivedMessagesInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutReceivedMessagesInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutReceivedMessagesInputSchema), z.lazy(() => UserUncheckedUpdateWithoutReceivedMessagesInputSchema) ]),
}).strict();

export const UserUpdateWithoutReceivedMessagesInputSchema: z.ZodType<Prisma.UserUpdateWithoutReceivedMessagesInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema), z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  profile: z.lazy(() => ProfileUpdateOneWithoutUserNestedInputSchema).optional(),
  services: z.lazy(() => ServiceUpdateManyWithoutVendorNestedInputSchema).optional(),
  bookings: z.lazy(() => BookingUpdateManyWithoutCustomerNestedInputSchema).optional(),
  media: z.lazy(() => MediaUpdateManyWithoutUserNestedInputSchema).optional(),
  sentMessages: z.lazy(() => MessageUpdateManyWithoutSenderNestedInputSchema).optional(),
}).strict();

export const UserUncheckedUpdateWithoutReceivedMessagesInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutReceivedMessagesInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema), z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  profile: z.lazy(() => ProfileUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  services: z.lazy(() => ServiceUncheckedUpdateManyWithoutVendorNestedInputSchema).optional(),
  bookings: z.lazy(() => BookingUncheckedUpdateManyWithoutCustomerNestedInputSchema).optional(),
  media: z.lazy(() => MediaUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sentMessages: z.lazy(() => MessageUncheckedUpdateManyWithoutSenderNestedInputSchema).optional(),
}).strict();

export const UserCreateWithoutMediaInputSchema: z.ZodType<Prisma.UserCreateWithoutMediaInput> = z.object({
  id: z.uuid().optional(),
  email: z.string(),
  password: z.string(),
  role: z.lazy(() => RoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  profile: z.lazy(() => ProfileCreateNestedOneWithoutUserInputSchema).optional(),
  services: z.lazy(() => ServiceCreateNestedManyWithoutVendorInputSchema).optional(),
  bookings: z.lazy(() => BookingCreateNestedManyWithoutCustomerInputSchema).optional(),
  sentMessages: z.lazy(() => MessageCreateNestedManyWithoutSenderInputSchema).optional(),
  receivedMessages: z.lazy(() => MessageCreateNestedManyWithoutReceiverInputSchema).optional(),
}).strict();

export const UserUncheckedCreateWithoutMediaInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutMediaInput> = z.object({
  id: z.uuid().optional(),
  email: z.string(),
  password: z.string(),
  role: z.lazy(() => RoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  profile: z.lazy(() => ProfileUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  services: z.lazy(() => ServiceUncheckedCreateNestedManyWithoutVendorInputSchema).optional(),
  bookings: z.lazy(() => BookingUncheckedCreateNestedManyWithoutCustomerInputSchema).optional(),
  sentMessages: z.lazy(() => MessageUncheckedCreateNestedManyWithoutSenderInputSchema).optional(),
  receivedMessages: z.lazy(() => MessageUncheckedCreateNestedManyWithoutReceiverInputSchema).optional(),
}).strict();

export const UserCreateOrConnectWithoutMediaInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutMediaInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutMediaInputSchema), z.lazy(() => UserUncheckedCreateWithoutMediaInputSchema) ]),
}).strict();

export const UserUpsertWithoutMediaInputSchema: z.ZodType<Prisma.UserUpsertWithoutMediaInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutMediaInputSchema), z.lazy(() => UserUncheckedUpdateWithoutMediaInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutMediaInputSchema), z.lazy(() => UserUncheckedCreateWithoutMediaInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional(),
}).strict();

export const UserUpdateToOneWithWhereWithoutMediaInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutMediaInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutMediaInputSchema), z.lazy(() => UserUncheckedUpdateWithoutMediaInputSchema) ]),
}).strict();

export const UserUpdateWithoutMediaInputSchema: z.ZodType<Prisma.UserUpdateWithoutMediaInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema), z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  profile: z.lazy(() => ProfileUpdateOneWithoutUserNestedInputSchema).optional(),
  services: z.lazy(() => ServiceUpdateManyWithoutVendorNestedInputSchema).optional(),
  bookings: z.lazy(() => BookingUpdateManyWithoutCustomerNestedInputSchema).optional(),
  sentMessages: z.lazy(() => MessageUpdateManyWithoutSenderNestedInputSchema).optional(),
  receivedMessages: z.lazy(() => MessageUpdateManyWithoutReceiverNestedInputSchema).optional(),
}).strict();

export const UserUncheckedUpdateWithoutMediaInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutMediaInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema), z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  profile: z.lazy(() => ProfileUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  services: z.lazy(() => ServiceUncheckedUpdateManyWithoutVendorNestedInputSchema).optional(),
  bookings: z.lazy(() => BookingUncheckedUpdateManyWithoutCustomerNestedInputSchema).optional(),
  sentMessages: z.lazy(() => MessageUncheckedUpdateManyWithoutSenderNestedInputSchema).optional(),
  receivedMessages: z.lazy(() => MessageUncheckedUpdateManyWithoutReceiverNestedInputSchema).optional(),
}).strict();

export const UserCreateWithoutProfileInputSchema: z.ZodType<Prisma.UserCreateWithoutProfileInput> = z.object({
  id: z.uuid().optional(),
  email: z.string(),
  password: z.string(),
  role: z.lazy(() => RoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  services: z.lazy(() => ServiceCreateNestedManyWithoutVendorInputSchema).optional(),
  bookings: z.lazy(() => BookingCreateNestedManyWithoutCustomerInputSchema).optional(),
  media: z.lazy(() => MediaCreateNestedManyWithoutUserInputSchema).optional(),
  sentMessages: z.lazy(() => MessageCreateNestedManyWithoutSenderInputSchema).optional(),
  receivedMessages: z.lazy(() => MessageCreateNestedManyWithoutReceiverInputSchema).optional(),
}).strict();

export const UserUncheckedCreateWithoutProfileInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutProfileInput> = z.object({
  id: z.uuid().optional(),
  email: z.string(),
  password: z.string(),
  role: z.lazy(() => RoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  services: z.lazy(() => ServiceUncheckedCreateNestedManyWithoutVendorInputSchema).optional(),
  bookings: z.lazy(() => BookingUncheckedCreateNestedManyWithoutCustomerInputSchema).optional(),
  media: z.lazy(() => MediaUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sentMessages: z.lazy(() => MessageUncheckedCreateNestedManyWithoutSenderInputSchema).optional(),
  receivedMessages: z.lazy(() => MessageUncheckedCreateNestedManyWithoutReceiverInputSchema).optional(),
}).strict();

export const UserCreateOrConnectWithoutProfileInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutProfileInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutProfileInputSchema), z.lazy(() => UserUncheckedCreateWithoutProfileInputSchema) ]),
}).strict();

export const PortfolioItemCreateWithoutProfileInputSchema: z.ZodType<Prisma.PortfolioItemCreateWithoutProfileInput> = z.object({
  id: z.uuid().optional(),
  imageUrl: z.string(),
  description: z.string().optional().nullable(),
  imageGallery: z.union([ z.lazy(() => PortfolioItemCreateimageGalleryInputSchema), z.string().array() ]).optional(),
  dynamicAttributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
}).strict();

export const PortfolioItemUncheckedCreateWithoutProfileInputSchema: z.ZodType<Prisma.PortfolioItemUncheckedCreateWithoutProfileInput> = z.object({
  id: z.uuid().optional(),
  imageUrl: z.string(),
  description: z.string().optional().nullable(),
  imageGallery: z.union([ z.lazy(() => PortfolioItemCreateimageGalleryInputSchema), z.string().array() ]).optional(),
  dynamicAttributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
}).strict();

export const PortfolioItemCreateOrConnectWithoutProfileInputSchema: z.ZodType<Prisma.PortfolioItemCreateOrConnectWithoutProfileInput> = z.object({
  where: z.lazy(() => PortfolioItemWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PortfolioItemCreateWithoutProfileInputSchema), z.lazy(() => PortfolioItemUncheckedCreateWithoutProfileInputSchema) ]),
}).strict();

export const PortfolioItemCreateManyProfileInputEnvelopeSchema: z.ZodType<Prisma.PortfolioItemCreateManyProfileInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => PortfolioItemCreateManyProfileInputSchema), z.lazy(() => PortfolioItemCreateManyProfileInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const UserUpsertWithoutProfileInputSchema: z.ZodType<Prisma.UserUpsertWithoutProfileInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutProfileInputSchema), z.lazy(() => UserUncheckedUpdateWithoutProfileInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutProfileInputSchema), z.lazy(() => UserUncheckedCreateWithoutProfileInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional(),
}).strict();

export const UserUpdateToOneWithWhereWithoutProfileInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutProfileInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutProfileInputSchema), z.lazy(() => UserUncheckedUpdateWithoutProfileInputSchema) ]),
}).strict();

export const UserUpdateWithoutProfileInputSchema: z.ZodType<Prisma.UserUpdateWithoutProfileInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema), z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  services: z.lazy(() => ServiceUpdateManyWithoutVendorNestedInputSchema).optional(),
  bookings: z.lazy(() => BookingUpdateManyWithoutCustomerNestedInputSchema).optional(),
  media: z.lazy(() => MediaUpdateManyWithoutUserNestedInputSchema).optional(),
  sentMessages: z.lazy(() => MessageUpdateManyWithoutSenderNestedInputSchema).optional(),
  receivedMessages: z.lazy(() => MessageUpdateManyWithoutReceiverNestedInputSchema).optional(),
}).strict();

export const UserUncheckedUpdateWithoutProfileInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutProfileInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema), z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  services: z.lazy(() => ServiceUncheckedUpdateManyWithoutVendorNestedInputSchema).optional(),
  bookings: z.lazy(() => BookingUncheckedUpdateManyWithoutCustomerNestedInputSchema).optional(),
  media: z.lazy(() => MediaUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sentMessages: z.lazy(() => MessageUncheckedUpdateManyWithoutSenderNestedInputSchema).optional(),
  receivedMessages: z.lazy(() => MessageUncheckedUpdateManyWithoutReceiverNestedInputSchema).optional(),
}).strict();

export const PortfolioItemUpsertWithWhereUniqueWithoutProfileInputSchema: z.ZodType<Prisma.PortfolioItemUpsertWithWhereUniqueWithoutProfileInput> = z.object({
  where: z.lazy(() => PortfolioItemWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => PortfolioItemUpdateWithoutProfileInputSchema), z.lazy(() => PortfolioItemUncheckedUpdateWithoutProfileInputSchema) ]),
  create: z.union([ z.lazy(() => PortfolioItemCreateWithoutProfileInputSchema), z.lazy(() => PortfolioItemUncheckedCreateWithoutProfileInputSchema) ]),
}).strict();

export const PortfolioItemUpdateWithWhereUniqueWithoutProfileInputSchema: z.ZodType<Prisma.PortfolioItemUpdateWithWhereUniqueWithoutProfileInput> = z.object({
  where: z.lazy(() => PortfolioItemWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => PortfolioItemUpdateWithoutProfileInputSchema), z.lazy(() => PortfolioItemUncheckedUpdateWithoutProfileInputSchema) ]),
}).strict();

export const PortfolioItemUpdateManyWithWhereWithoutProfileInputSchema: z.ZodType<Prisma.PortfolioItemUpdateManyWithWhereWithoutProfileInput> = z.object({
  where: z.lazy(() => PortfolioItemScalarWhereInputSchema),
  data: z.union([ z.lazy(() => PortfolioItemUpdateManyMutationInputSchema), z.lazy(() => PortfolioItemUncheckedUpdateManyWithoutProfileInputSchema) ]),
}).strict();

export const PortfolioItemScalarWhereInputSchema: z.ZodType<Prisma.PortfolioItemScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PortfolioItemScalarWhereInputSchema), z.lazy(() => PortfolioItemScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PortfolioItemScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PortfolioItemScalarWhereInputSchema), z.lazy(() => PortfolioItemScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  profileId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  imageUrl: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  imageGallery: z.lazy(() => StringNullableListFilterSchema).optional(),
  dynamicAttributes: z.lazy(() => JsonNullableFilterSchema).optional(),
}).strict();

export const ProfileCreateWithoutPortfolioInputSchema: z.ZodType<Prisma.ProfileCreateWithoutPortfolioInput> = z.object({
  id: z.uuid().optional(),
  displayName: z.string(),
  bio: z.string().optional().nullable(),
  avatarUrl: z.string().optional().nullable(),
  serviceRadiusKm: z.number().int().optional(),
  ratingAvg: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  reviewsCount: z.number().int().optional(),
  businessHours: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  isVerified: z.boolean().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutProfileInputSchema),
}).strict();

export const ProfileUncheckedCreateWithoutPortfolioInputSchema: z.ZodType<Prisma.ProfileUncheckedCreateWithoutPortfolioInput> = z.object({
  id: z.uuid().optional(),
  userId: z.string(),
  displayName: z.string(),
  bio: z.string().optional().nullable(),
  avatarUrl: z.string().optional().nullable(),
  serviceRadiusKm: z.number().int().optional(),
  ratingAvg: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }).optional(),
  reviewsCount: z.number().int().optional(),
  businessHours: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  isVerified: z.boolean().optional(),
}).strict();

export const ProfileCreateOrConnectWithoutPortfolioInputSchema: z.ZodType<Prisma.ProfileCreateOrConnectWithoutPortfolioInput> = z.object({
  where: z.lazy(() => ProfileWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProfileCreateWithoutPortfolioInputSchema), z.lazy(() => ProfileUncheckedCreateWithoutPortfolioInputSchema) ]),
}).strict();

export const ProfileUpsertWithoutPortfolioInputSchema: z.ZodType<Prisma.ProfileUpsertWithoutPortfolioInput> = z.object({
  update: z.union([ z.lazy(() => ProfileUpdateWithoutPortfolioInputSchema), z.lazy(() => ProfileUncheckedUpdateWithoutPortfolioInputSchema) ]),
  create: z.union([ z.lazy(() => ProfileCreateWithoutPortfolioInputSchema), z.lazy(() => ProfileUncheckedCreateWithoutPortfolioInputSchema) ]),
  where: z.lazy(() => ProfileWhereInputSchema).optional(),
}).strict();

export const ProfileUpdateToOneWithWhereWithoutPortfolioInputSchema: z.ZodType<Prisma.ProfileUpdateToOneWithWhereWithoutPortfolioInput> = z.object({
  where: z.lazy(() => ProfileWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ProfileUpdateWithoutPortfolioInputSchema), z.lazy(() => ProfileUncheckedUpdateWithoutPortfolioInputSchema) ]),
}).strict();

export const ProfileUpdateWithoutPortfolioInputSchema: z.ZodType<Prisma.ProfileUpdateWithoutPortfolioInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  displayName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  bio: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  avatarUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  serviceRadiusKm: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  ratingAvg: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  reviewsCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  businessHours: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  isVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutProfileNestedInputSchema).optional(),
}).strict();

export const ProfileUncheckedUpdateWithoutPortfolioInputSchema: z.ZodType<Prisma.ProfileUncheckedUpdateWithoutPortfolioInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  displayName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  bio: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  avatarUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  serviceRadiusKm: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  ratingAvg: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  reviewsCount: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  businessHours: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  isVerified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CategoryCreateWithoutChildrenInputSchema: z.ZodType<Prisma.CategoryCreateWithoutChildrenInput> = z.object({
  id: z.uuid().optional(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  parent: z.lazy(() => CategoryCreateNestedOneWithoutChildrenInputSchema).optional(),
  services: z.lazy(() => ServiceCreateNestedManyWithoutCategoryInputSchema).optional(),
}).strict();

export const CategoryUncheckedCreateWithoutChildrenInputSchema: z.ZodType<Prisma.CategoryUncheckedCreateWithoutChildrenInput> = z.object({
  id: z.uuid().optional(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  parentId: z.string().optional().nullable(),
  services: z.lazy(() => ServiceUncheckedCreateNestedManyWithoutCategoryInputSchema).optional(),
}).strict();

export const CategoryCreateOrConnectWithoutChildrenInputSchema: z.ZodType<Prisma.CategoryCreateOrConnectWithoutChildrenInput> = z.object({
  where: z.lazy(() => CategoryWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CategoryCreateWithoutChildrenInputSchema), z.lazy(() => CategoryUncheckedCreateWithoutChildrenInputSchema) ]),
}).strict();

export const CategoryCreateWithoutParentInputSchema: z.ZodType<Prisma.CategoryCreateWithoutParentInput> = z.object({
  id: z.uuid().optional(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  children: z.lazy(() => CategoryCreateNestedManyWithoutParentInputSchema).optional(),
  services: z.lazy(() => ServiceCreateNestedManyWithoutCategoryInputSchema).optional(),
}).strict();

export const CategoryUncheckedCreateWithoutParentInputSchema: z.ZodType<Prisma.CategoryUncheckedCreateWithoutParentInput> = z.object({
  id: z.uuid().optional(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  children: z.lazy(() => CategoryUncheckedCreateNestedManyWithoutParentInputSchema).optional(),
  services: z.lazy(() => ServiceUncheckedCreateNestedManyWithoutCategoryInputSchema).optional(),
}).strict();

export const CategoryCreateOrConnectWithoutParentInputSchema: z.ZodType<Prisma.CategoryCreateOrConnectWithoutParentInput> = z.object({
  where: z.lazy(() => CategoryWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CategoryCreateWithoutParentInputSchema), z.lazy(() => CategoryUncheckedCreateWithoutParentInputSchema) ]),
}).strict();

export const CategoryCreateManyParentInputEnvelopeSchema: z.ZodType<Prisma.CategoryCreateManyParentInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => CategoryCreateManyParentInputSchema), z.lazy(() => CategoryCreateManyParentInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const ServiceCreateWithoutCategoryInputSchema: z.ZodType<Prisma.ServiceCreateWithoutCategoryInput> = z.object({
  id: z.uuid().optional(),
  title: z.string(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  basePrice: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  isActive: z.boolean().optional(),
  dynamicAttributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  vendor: z.lazy(() => UserCreateNestedOneWithoutServicesInputSchema),
  unit: z.lazy(() => ServiceUnitCreateNestedOneWithoutServicesInputSchema),
  metadata: z.lazy(() => ServiceMetadataCreateNestedManyWithoutServiceInputSchema).optional(),
  slots: z.lazy(() => ServiceSlotCreateNestedManyWithoutServiceInputSchema).optional(),
  bookings: z.lazy(() => BookingCreateNestedManyWithoutServiceInputSchema).optional(),
}).strict();

export const ServiceUncheckedCreateWithoutCategoryInputSchema: z.ZodType<Prisma.ServiceUncheckedCreateWithoutCategoryInput> = z.object({
  id: z.uuid().optional(),
  vendorId: z.string(),
  unitId: z.string(),
  title: z.string(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  basePrice: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  isActive: z.boolean().optional(),
  dynamicAttributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  metadata: z.lazy(() => ServiceMetadataUncheckedCreateNestedManyWithoutServiceInputSchema).optional(),
  slots: z.lazy(() => ServiceSlotUncheckedCreateNestedManyWithoutServiceInputSchema).optional(),
  bookings: z.lazy(() => BookingUncheckedCreateNestedManyWithoutServiceInputSchema).optional(),
}).strict();

export const ServiceCreateOrConnectWithoutCategoryInputSchema: z.ZodType<Prisma.ServiceCreateOrConnectWithoutCategoryInput> = z.object({
  where: z.lazy(() => ServiceWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ServiceCreateWithoutCategoryInputSchema), z.lazy(() => ServiceUncheckedCreateWithoutCategoryInputSchema) ]),
}).strict();

export const ServiceCreateManyCategoryInputEnvelopeSchema: z.ZodType<Prisma.ServiceCreateManyCategoryInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ServiceCreateManyCategoryInputSchema), z.lazy(() => ServiceCreateManyCategoryInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const CategoryUpsertWithoutChildrenInputSchema: z.ZodType<Prisma.CategoryUpsertWithoutChildrenInput> = z.object({
  update: z.union([ z.lazy(() => CategoryUpdateWithoutChildrenInputSchema), z.lazy(() => CategoryUncheckedUpdateWithoutChildrenInputSchema) ]),
  create: z.union([ z.lazy(() => CategoryCreateWithoutChildrenInputSchema), z.lazy(() => CategoryUncheckedCreateWithoutChildrenInputSchema) ]),
  where: z.lazy(() => CategoryWhereInputSchema).optional(),
}).strict();

export const CategoryUpdateToOneWithWhereWithoutChildrenInputSchema: z.ZodType<Prisma.CategoryUpdateToOneWithWhereWithoutChildrenInput> = z.object({
  where: z.lazy(() => CategoryWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CategoryUpdateWithoutChildrenInputSchema), z.lazy(() => CategoryUncheckedUpdateWithoutChildrenInputSchema) ]),
}).strict();

export const CategoryUpdateWithoutChildrenInputSchema: z.ZodType<Prisma.CategoryUpdateWithoutChildrenInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  parent: z.lazy(() => CategoryUpdateOneWithoutChildrenNestedInputSchema).optional(),
  services: z.lazy(() => ServiceUpdateManyWithoutCategoryNestedInputSchema).optional(),
}).strict();

export const CategoryUncheckedUpdateWithoutChildrenInputSchema: z.ZodType<Prisma.CategoryUncheckedUpdateWithoutChildrenInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  parentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  services: z.lazy(() => ServiceUncheckedUpdateManyWithoutCategoryNestedInputSchema).optional(),
}).strict();

export const CategoryUpsertWithWhereUniqueWithoutParentInputSchema: z.ZodType<Prisma.CategoryUpsertWithWhereUniqueWithoutParentInput> = z.object({
  where: z.lazy(() => CategoryWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => CategoryUpdateWithoutParentInputSchema), z.lazy(() => CategoryUncheckedUpdateWithoutParentInputSchema) ]),
  create: z.union([ z.lazy(() => CategoryCreateWithoutParentInputSchema), z.lazy(() => CategoryUncheckedCreateWithoutParentInputSchema) ]),
}).strict();

export const CategoryUpdateWithWhereUniqueWithoutParentInputSchema: z.ZodType<Prisma.CategoryUpdateWithWhereUniqueWithoutParentInput> = z.object({
  where: z.lazy(() => CategoryWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => CategoryUpdateWithoutParentInputSchema), z.lazy(() => CategoryUncheckedUpdateWithoutParentInputSchema) ]),
}).strict();

export const CategoryUpdateManyWithWhereWithoutParentInputSchema: z.ZodType<Prisma.CategoryUpdateManyWithWhereWithoutParentInput> = z.object({
  where: z.lazy(() => CategoryScalarWhereInputSchema),
  data: z.union([ z.lazy(() => CategoryUpdateManyMutationInputSchema), z.lazy(() => CategoryUncheckedUpdateManyWithoutParentInputSchema) ]),
}).strict();

export const CategoryScalarWhereInputSchema: z.ZodType<Prisma.CategoryScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CategoryScalarWhereInputSchema), z.lazy(() => CategoryScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CategoryScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CategoryScalarWhereInputSchema), z.lazy(() => CategoryScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  slug: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  imageUrl: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  isActive: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  parentId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
}).strict();

export const ServiceUpsertWithWhereUniqueWithoutCategoryInputSchema: z.ZodType<Prisma.ServiceUpsertWithWhereUniqueWithoutCategoryInput> = z.object({
  where: z.lazy(() => ServiceWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ServiceUpdateWithoutCategoryInputSchema), z.lazy(() => ServiceUncheckedUpdateWithoutCategoryInputSchema) ]),
  create: z.union([ z.lazy(() => ServiceCreateWithoutCategoryInputSchema), z.lazy(() => ServiceUncheckedCreateWithoutCategoryInputSchema) ]),
}).strict();

export const ServiceUpdateWithWhereUniqueWithoutCategoryInputSchema: z.ZodType<Prisma.ServiceUpdateWithWhereUniqueWithoutCategoryInput> = z.object({
  where: z.lazy(() => ServiceWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ServiceUpdateWithoutCategoryInputSchema), z.lazy(() => ServiceUncheckedUpdateWithoutCategoryInputSchema) ]),
}).strict();

export const ServiceUpdateManyWithWhereWithoutCategoryInputSchema: z.ZodType<Prisma.ServiceUpdateManyWithWhereWithoutCategoryInput> = z.object({
  where: z.lazy(() => ServiceScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ServiceUpdateManyMutationInputSchema), z.lazy(() => ServiceUncheckedUpdateManyWithoutCategoryInputSchema) ]),
}).strict();

export const ServiceCreateWithoutUnitInputSchema: z.ZodType<Prisma.ServiceCreateWithoutUnitInput> = z.object({
  id: z.uuid().optional(),
  title: z.string(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  basePrice: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  isActive: z.boolean().optional(),
  dynamicAttributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  vendor: z.lazy(() => UserCreateNestedOneWithoutServicesInputSchema),
  category: z.lazy(() => CategoryCreateNestedOneWithoutServicesInputSchema),
  metadata: z.lazy(() => ServiceMetadataCreateNestedManyWithoutServiceInputSchema).optional(),
  slots: z.lazy(() => ServiceSlotCreateNestedManyWithoutServiceInputSchema).optional(),
  bookings: z.lazy(() => BookingCreateNestedManyWithoutServiceInputSchema).optional(),
}).strict();

export const ServiceUncheckedCreateWithoutUnitInputSchema: z.ZodType<Prisma.ServiceUncheckedCreateWithoutUnitInput> = z.object({
  id: z.uuid().optional(),
  vendorId: z.string(),
  categoryId: z.string(),
  title: z.string(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  basePrice: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  isActive: z.boolean().optional(),
  dynamicAttributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  metadata: z.lazy(() => ServiceMetadataUncheckedCreateNestedManyWithoutServiceInputSchema).optional(),
  slots: z.lazy(() => ServiceSlotUncheckedCreateNestedManyWithoutServiceInputSchema).optional(),
  bookings: z.lazy(() => BookingUncheckedCreateNestedManyWithoutServiceInputSchema).optional(),
}).strict();

export const ServiceCreateOrConnectWithoutUnitInputSchema: z.ZodType<Prisma.ServiceCreateOrConnectWithoutUnitInput> = z.object({
  where: z.lazy(() => ServiceWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ServiceCreateWithoutUnitInputSchema), z.lazy(() => ServiceUncheckedCreateWithoutUnitInputSchema) ]),
}).strict();

export const ServiceCreateManyUnitInputEnvelopeSchema: z.ZodType<Prisma.ServiceCreateManyUnitInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ServiceCreateManyUnitInputSchema), z.lazy(() => ServiceCreateManyUnitInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const ServiceUpsertWithWhereUniqueWithoutUnitInputSchema: z.ZodType<Prisma.ServiceUpsertWithWhereUniqueWithoutUnitInput> = z.object({
  where: z.lazy(() => ServiceWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ServiceUpdateWithoutUnitInputSchema), z.lazy(() => ServiceUncheckedUpdateWithoutUnitInputSchema) ]),
  create: z.union([ z.lazy(() => ServiceCreateWithoutUnitInputSchema), z.lazy(() => ServiceUncheckedCreateWithoutUnitInputSchema) ]),
}).strict();

export const ServiceUpdateWithWhereUniqueWithoutUnitInputSchema: z.ZodType<Prisma.ServiceUpdateWithWhereUniqueWithoutUnitInput> = z.object({
  where: z.lazy(() => ServiceWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ServiceUpdateWithoutUnitInputSchema), z.lazy(() => ServiceUncheckedUpdateWithoutUnitInputSchema) ]),
}).strict();

export const ServiceUpdateManyWithWhereWithoutUnitInputSchema: z.ZodType<Prisma.ServiceUpdateManyWithWhereWithoutUnitInput> = z.object({
  where: z.lazy(() => ServiceScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ServiceUpdateManyMutationInputSchema), z.lazy(() => ServiceUncheckedUpdateManyWithoutUnitInputSchema) ]),
}).strict();

export const UserCreateWithoutServicesInputSchema: z.ZodType<Prisma.UserCreateWithoutServicesInput> = z.object({
  id: z.uuid().optional(),
  email: z.string(),
  password: z.string(),
  role: z.lazy(() => RoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  profile: z.lazy(() => ProfileCreateNestedOneWithoutUserInputSchema).optional(),
  bookings: z.lazy(() => BookingCreateNestedManyWithoutCustomerInputSchema).optional(),
  media: z.lazy(() => MediaCreateNestedManyWithoutUserInputSchema).optional(),
  sentMessages: z.lazy(() => MessageCreateNestedManyWithoutSenderInputSchema).optional(),
  receivedMessages: z.lazy(() => MessageCreateNestedManyWithoutReceiverInputSchema).optional(),
}).strict();

export const UserUncheckedCreateWithoutServicesInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutServicesInput> = z.object({
  id: z.uuid().optional(),
  email: z.string(),
  password: z.string(),
  role: z.lazy(() => RoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  profile: z.lazy(() => ProfileUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  bookings: z.lazy(() => BookingUncheckedCreateNestedManyWithoutCustomerInputSchema).optional(),
  media: z.lazy(() => MediaUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sentMessages: z.lazy(() => MessageUncheckedCreateNestedManyWithoutSenderInputSchema).optional(),
  receivedMessages: z.lazy(() => MessageUncheckedCreateNestedManyWithoutReceiverInputSchema).optional(),
}).strict();

export const UserCreateOrConnectWithoutServicesInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutServicesInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutServicesInputSchema), z.lazy(() => UserUncheckedCreateWithoutServicesInputSchema) ]),
}).strict();

export const CategoryCreateWithoutServicesInputSchema: z.ZodType<Prisma.CategoryCreateWithoutServicesInput> = z.object({
  id: z.uuid().optional(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  parent: z.lazy(() => CategoryCreateNestedOneWithoutChildrenInputSchema).optional(),
  children: z.lazy(() => CategoryCreateNestedManyWithoutParentInputSchema).optional(),
}).strict();

export const CategoryUncheckedCreateWithoutServicesInputSchema: z.ZodType<Prisma.CategoryUncheckedCreateWithoutServicesInput> = z.object({
  id: z.uuid().optional(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  parentId: z.string().optional().nullable(),
  children: z.lazy(() => CategoryUncheckedCreateNestedManyWithoutParentInputSchema).optional(),
}).strict();

export const CategoryCreateOrConnectWithoutServicesInputSchema: z.ZodType<Prisma.CategoryCreateOrConnectWithoutServicesInput> = z.object({
  where: z.lazy(() => CategoryWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CategoryCreateWithoutServicesInputSchema), z.lazy(() => CategoryUncheckedCreateWithoutServicesInputSchema) ]),
}).strict();

export const ServiceUnitCreateWithoutServicesInputSchema: z.ZodType<Prisma.ServiceUnitCreateWithoutServicesInput> = z.object({
  id: z.uuid().optional(),
  name: z.string(),
  abbreviation: z.string(),
}).strict();

export const ServiceUnitUncheckedCreateWithoutServicesInputSchema: z.ZodType<Prisma.ServiceUnitUncheckedCreateWithoutServicesInput> = z.object({
  id: z.uuid().optional(),
  name: z.string(),
  abbreviation: z.string(),
}).strict();

export const ServiceUnitCreateOrConnectWithoutServicesInputSchema: z.ZodType<Prisma.ServiceUnitCreateOrConnectWithoutServicesInput> = z.object({
  where: z.lazy(() => ServiceUnitWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ServiceUnitCreateWithoutServicesInputSchema), z.lazy(() => ServiceUnitUncheckedCreateWithoutServicesInputSchema) ]),
}).strict();

export const ServiceMetadataCreateWithoutServiceInputSchema: z.ZodType<Prisma.ServiceMetadataCreateWithoutServiceInput> = z.object({
  id: z.uuid().optional(),
  key: z.string(),
  value: z.string(),
}).strict();

export const ServiceMetadataUncheckedCreateWithoutServiceInputSchema: z.ZodType<Prisma.ServiceMetadataUncheckedCreateWithoutServiceInput> = z.object({
  id: z.uuid().optional(),
  key: z.string(),
  value: z.string(),
}).strict();

export const ServiceMetadataCreateOrConnectWithoutServiceInputSchema: z.ZodType<Prisma.ServiceMetadataCreateOrConnectWithoutServiceInput> = z.object({
  where: z.lazy(() => ServiceMetadataWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ServiceMetadataCreateWithoutServiceInputSchema), z.lazy(() => ServiceMetadataUncheckedCreateWithoutServiceInputSchema) ]),
}).strict();

export const ServiceMetadataCreateManyServiceInputEnvelopeSchema: z.ZodType<Prisma.ServiceMetadataCreateManyServiceInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ServiceMetadataCreateManyServiceInputSchema), z.lazy(() => ServiceMetadataCreateManyServiceInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const ServiceSlotCreateWithoutServiceInputSchema: z.ZodType<Prisma.ServiceSlotCreateWithoutServiceInput> = z.object({
  id: z.uuid().optional(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  status: z.lazy(() => SlotStatusSchema).optional(),
  isRecurring: z.boolean().optional(),
  booking: z.lazy(() => BookingCreateNestedOneWithoutSlotsInputSchema).optional(),
}).strict();

export const ServiceSlotUncheckedCreateWithoutServiceInputSchema: z.ZodType<Prisma.ServiceSlotUncheckedCreateWithoutServiceInput> = z.object({
  id: z.uuid().optional(),
  bookingId: z.string().optional().nullable(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  status: z.lazy(() => SlotStatusSchema).optional(),
  isRecurring: z.boolean().optional(),
}).strict();

export const ServiceSlotCreateOrConnectWithoutServiceInputSchema: z.ZodType<Prisma.ServiceSlotCreateOrConnectWithoutServiceInput> = z.object({
  where: z.lazy(() => ServiceSlotWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ServiceSlotCreateWithoutServiceInputSchema), z.lazy(() => ServiceSlotUncheckedCreateWithoutServiceInputSchema) ]),
}).strict();

export const ServiceSlotCreateManyServiceInputEnvelopeSchema: z.ZodType<Prisma.ServiceSlotCreateManyServiceInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ServiceSlotCreateManyServiceInputSchema), z.lazy(() => ServiceSlotCreateManyServiceInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const BookingCreateWithoutServiceInputSchema: z.ZodType<Prisma.BookingCreateWithoutServiceInput> = z.object({
  id: z.uuid().optional(),
  status: z.lazy(() => BookingStatusSchema).optional(),
  scheduledDate: z.coerce.date(),
  customer: z.lazy(() => UserCreateNestedOneWithoutBookingsInputSchema),
  details: z.lazy(() => BookingDetailsCreateNestedOneWithoutBookingInputSchema).optional(),
  payment: z.lazy(() => PaymentCreateNestedOneWithoutBookingInputSchema).optional(),
  slots: z.lazy(() => ServiceSlotCreateNestedManyWithoutBookingInputSchema).optional(),
}).strict();

export const BookingUncheckedCreateWithoutServiceInputSchema: z.ZodType<Prisma.BookingUncheckedCreateWithoutServiceInput> = z.object({
  id: z.uuid().optional(),
  customerId: z.string(),
  status: z.lazy(() => BookingStatusSchema).optional(),
  scheduledDate: z.coerce.date(),
  details: z.lazy(() => BookingDetailsUncheckedCreateNestedOneWithoutBookingInputSchema).optional(),
  payment: z.lazy(() => PaymentUncheckedCreateNestedOneWithoutBookingInputSchema).optional(),
  slots: z.lazy(() => ServiceSlotUncheckedCreateNestedManyWithoutBookingInputSchema).optional(),
}).strict();

export const BookingCreateOrConnectWithoutServiceInputSchema: z.ZodType<Prisma.BookingCreateOrConnectWithoutServiceInput> = z.object({
  where: z.lazy(() => BookingWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => BookingCreateWithoutServiceInputSchema), z.lazy(() => BookingUncheckedCreateWithoutServiceInputSchema) ]),
}).strict();

export const BookingCreateManyServiceInputEnvelopeSchema: z.ZodType<Prisma.BookingCreateManyServiceInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => BookingCreateManyServiceInputSchema), z.lazy(() => BookingCreateManyServiceInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const UserUpsertWithoutServicesInputSchema: z.ZodType<Prisma.UserUpsertWithoutServicesInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutServicesInputSchema), z.lazy(() => UserUncheckedUpdateWithoutServicesInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutServicesInputSchema), z.lazy(() => UserUncheckedCreateWithoutServicesInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional(),
}).strict();

export const UserUpdateToOneWithWhereWithoutServicesInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutServicesInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutServicesInputSchema), z.lazy(() => UserUncheckedUpdateWithoutServicesInputSchema) ]),
}).strict();

export const UserUpdateWithoutServicesInputSchema: z.ZodType<Prisma.UserUpdateWithoutServicesInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema), z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  profile: z.lazy(() => ProfileUpdateOneWithoutUserNestedInputSchema).optional(),
  bookings: z.lazy(() => BookingUpdateManyWithoutCustomerNestedInputSchema).optional(),
  media: z.lazy(() => MediaUpdateManyWithoutUserNestedInputSchema).optional(),
  sentMessages: z.lazy(() => MessageUpdateManyWithoutSenderNestedInputSchema).optional(),
  receivedMessages: z.lazy(() => MessageUpdateManyWithoutReceiverNestedInputSchema).optional(),
}).strict();

export const UserUncheckedUpdateWithoutServicesInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutServicesInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema), z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  profile: z.lazy(() => ProfileUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  bookings: z.lazy(() => BookingUncheckedUpdateManyWithoutCustomerNestedInputSchema).optional(),
  media: z.lazy(() => MediaUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sentMessages: z.lazy(() => MessageUncheckedUpdateManyWithoutSenderNestedInputSchema).optional(),
  receivedMessages: z.lazy(() => MessageUncheckedUpdateManyWithoutReceiverNestedInputSchema).optional(),
}).strict();

export const CategoryUpsertWithoutServicesInputSchema: z.ZodType<Prisma.CategoryUpsertWithoutServicesInput> = z.object({
  update: z.union([ z.lazy(() => CategoryUpdateWithoutServicesInputSchema), z.lazy(() => CategoryUncheckedUpdateWithoutServicesInputSchema) ]),
  create: z.union([ z.lazy(() => CategoryCreateWithoutServicesInputSchema), z.lazy(() => CategoryUncheckedCreateWithoutServicesInputSchema) ]),
  where: z.lazy(() => CategoryWhereInputSchema).optional(),
}).strict();

export const CategoryUpdateToOneWithWhereWithoutServicesInputSchema: z.ZodType<Prisma.CategoryUpdateToOneWithWhereWithoutServicesInput> = z.object({
  where: z.lazy(() => CategoryWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CategoryUpdateWithoutServicesInputSchema), z.lazy(() => CategoryUncheckedUpdateWithoutServicesInputSchema) ]),
}).strict();

export const CategoryUpdateWithoutServicesInputSchema: z.ZodType<Prisma.CategoryUpdateWithoutServicesInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  parent: z.lazy(() => CategoryUpdateOneWithoutChildrenNestedInputSchema).optional(),
  children: z.lazy(() => CategoryUpdateManyWithoutParentNestedInputSchema).optional(),
}).strict();

export const CategoryUncheckedUpdateWithoutServicesInputSchema: z.ZodType<Prisma.CategoryUncheckedUpdateWithoutServicesInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  parentId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  children: z.lazy(() => CategoryUncheckedUpdateManyWithoutParentNestedInputSchema).optional(),
}).strict();

export const ServiceUnitUpsertWithoutServicesInputSchema: z.ZodType<Prisma.ServiceUnitUpsertWithoutServicesInput> = z.object({
  update: z.union([ z.lazy(() => ServiceUnitUpdateWithoutServicesInputSchema), z.lazy(() => ServiceUnitUncheckedUpdateWithoutServicesInputSchema) ]),
  create: z.union([ z.lazy(() => ServiceUnitCreateWithoutServicesInputSchema), z.lazy(() => ServiceUnitUncheckedCreateWithoutServicesInputSchema) ]),
  where: z.lazy(() => ServiceUnitWhereInputSchema).optional(),
}).strict();

export const ServiceUnitUpdateToOneWithWhereWithoutServicesInputSchema: z.ZodType<Prisma.ServiceUnitUpdateToOneWithWhereWithoutServicesInput> = z.object({
  where: z.lazy(() => ServiceUnitWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ServiceUnitUpdateWithoutServicesInputSchema), z.lazy(() => ServiceUnitUncheckedUpdateWithoutServicesInputSchema) ]),
}).strict();

export const ServiceUnitUpdateWithoutServicesInputSchema: z.ZodType<Prisma.ServiceUnitUpdateWithoutServicesInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  abbreviation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ServiceUnitUncheckedUpdateWithoutServicesInputSchema: z.ZodType<Prisma.ServiceUnitUncheckedUpdateWithoutServicesInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  abbreviation: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ServiceMetadataUpsertWithWhereUniqueWithoutServiceInputSchema: z.ZodType<Prisma.ServiceMetadataUpsertWithWhereUniqueWithoutServiceInput> = z.object({
  where: z.lazy(() => ServiceMetadataWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ServiceMetadataUpdateWithoutServiceInputSchema), z.lazy(() => ServiceMetadataUncheckedUpdateWithoutServiceInputSchema) ]),
  create: z.union([ z.lazy(() => ServiceMetadataCreateWithoutServiceInputSchema), z.lazy(() => ServiceMetadataUncheckedCreateWithoutServiceInputSchema) ]),
}).strict();

export const ServiceMetadataUpdateWithWhereUniqueWithoutServiceInputSchema: z.ZodType<Prisma.ServiceMetadataUpdateWithWhereUniqueWithoutServiceInput> = z.object({
  where: z.lazy(() => ServiceMetadataWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ServiceMetadataUpdateWithoutServiceInputSchema), z.lazy(() => ServiceMetadataUncheckedUpdateWithoutServiceInputSchema) ]),
}).strict();

export const ServiceMetadataUpdateManyWithWhereWithoutServiceInputSchema: z.ZodType<Prisma.ServiceMetadataUpdateManyWithWhereWithoutServiceInput> = z.object({
  where: z.lazy(() => ServiceMetadataScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ServiceMetadataUpdateManyMutationInputSchema), z.lazy(() => ServiceMetadataUncheckedUpdateManyWithoutServiceInputSchema) ]),
}).strict();

export const ServiceMetadataScalarWhereInputSchema: z.ZodType<Prisma.ServiceMetadataScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ServiceMetadataScalarWhereInputSchema), z.lazy(() => ServiceMetadataScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ServiceMetadataScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ServiceMetadataScalarWhereInputSchema), z.lazy(() => ServiceMetadataScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  serviceId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  key: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  value: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
}).strict();

export const ServiceSlotUpsertWithWhereUniqueWithoutServiceInputSchema: z.ZodType<Prisma.ServiceSlotUpsertWithWhereUniqueWithoutServiceInput> = z.object({
  where: z.lazy(() => ServiceSlotWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ServiceSlotUpdateWithoutServiceInputSchema), z.lazy(() => ServiceSlotUncheckedUpdateWithoutServiceInputSchema) ]),
  create: z.union([ z.lazy(() => ServiceSlotCreateWithoutServiceInputSchema), z.lazy(() => ServiceSlotUncheckedCreateWithoutServiceInputSchema) ]),
}).strict();

export const ServiceSlotUpdateWithWhereUniqueWithoutServiceInputSchema: z.ZodType<Prisma.ServiceSlotUpdateWithWhereUniqueWithoutServiceInput> = z.object({
  where: z.lazy(() => ServiceSlotWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ServiceSlotUpdateWithoutServiceInputSchema), z.lazy(() => ServiceSlotUncheckedUpdateWithoutServiceInputSchema) ]),
}).strict();

export const ServiceSlotUpdateManyWithWhereWithoutServiceInputSchema: z.ZodType<Prisma.ServiceSlotUpdateManyWithWhereWithoutServiceInput> = z.object({
  where: z.lazy(() => ServiceSlotScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ServiceSlotUpdateManyMutationInputSchema), z.lazy(() => ServiceSlotUncheckedUpdateManyWithoutServiceInputSchema) ]),
}).strict();

export const ServiceSlotScalarWhereInputSchema: z.ZodType<Prisma.ServiceSlotScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ServiceSlotScalarWhereInputSchema), z.lazy(() => ServiceSlotScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ServiceSlotScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ServiceSlotScalarWhereInputSchema), z.lazy(() => ServiceSlotScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  serviceId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  bookingId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  startTime: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  endTime: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  status: z.union([ z.lazy(() => EnumSlotStatusFilterSchema), z.lazy(() => SlotStatusSchema) ]).optional(),
  isRecurring: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
}).strict();

export const BookingUpsertWithWhereUniqueWithoutServiceInputSchema: z.ZodType<Prisma.BookingUpsertWithWhereUniqueWithoutServiceInput> = z.object({
  where: z.lazy(() => BookingWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => BookingUpdateWithoutServiceInputSchema), z.lazy(() => BookingUncheckedUpdateWithoutServiceInputSchema) ]),
  create: z.union([ z.lazy(() => BookingCreateWithoutServiceInputSchema), z.lazy(() => BookingUncheckedCreateWithoutServiceInputSchema) ]),
}).strict();

export const BookingUpdateWithWhereUniqueWithoutServiceInputSchema: z.ZodType<Prisma.BookingUpdateWithWhereUniqueWithoutServiceInput> = z.object({
  where: z.lazy(() => BookingWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => BookingUpdateWithoutServiceInputSchema), z.lazy(() => BookingUncheckedUpdateWithoutServiceInputSchema) ]),
}).strict();

export const BookingUpdateManyWithWhereWithoutServiceInputSchema: z.ZodType<Prisma.BookingUpdateManyWithWhereWithoutServiceInput> = z.object({
  where: z.lazy(() => BookingScalarWhereInputSchema),
  data: z.union([ z.lazy(() => BookingUpdateManyMutationInputSchema), z.lazy(() => BookingUncheckedUpdateManyWithoutServiceInputSchema) ]),
}).strict();

export const ServiceCreateWithoutMetadataInputSchema: z.ZodType<Prisma.ServiceCreateWithoutMetadataInput> = z.object({
  id: z.uuid().optional(),
  title: z.string(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  basePrice: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  isActive: z.boolean().optional(),
  dynamicAttributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  vendor: z.lazy(() => UserCreateNestedOneWithoutServicesInputSchema),
  category: z.lazy(() => CategoryCreateNestedOneWithoutServicesInputSchema),
  unit: z.lazy(() => ServiceUnitCreateNestedOneWithoutServicesInputSchema),
  slots: z.lazy(() => ServiceSlotCreateNestedManyWithoutServiceInputSchema).optional(),
  bookings: z.lazy(() => BookingCreateNestedManyWithoutServiceInputSchema).optional(),
}).strict();

export const ServiceUncheckedCreateWithoutMetadataInputSchema: z.ZodType<Prisma.ServiceUncheckedCreateWithoutMetadataInput> = z.object({
  id: z.uuid().optional(),
  vendorId: z.string(),
  categoryId: z.string(),
  unitId: z.string(),
  title: z.string(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  basePrice: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  isActive: z.boolean().optional(),
  dynamicAttributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  slots: z.lazy(() => ServiceSlotUncheckedCreateNestedManyWithoutServiceInputSchema).optional(),
  bookings: z.lazy(() => BookingUncheckedCreateNestedManyWithoutServiceInputSchema).optional(),
}).strict();

export const ServiceCreateOrConnectWithoutMetadataInputSchema: z.ZodType<Prisma.ServiceCreateOrConnectWithoutMetadataInput> = z.object({
  where: z.lazy(() => ServiceWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ServiceCreateWithoutMetadataInputSchema), z.lazy(() => ServiceUncheckedCreateWithoutMetadataInputSchema) ]),
}).strict();

export const ServiceUpsertWithoutMetadataInputSchema: z.ZodType<Prisma.ServiceUpsertWithoutMetadataInput> = z.object({
  update: z.union([ z.lazy(() => ServiceUpdateWithoutMetadataInputSchema), z.lazy(() => ServiceUncheckedUpdateWithoutMetadataInputSchema) ]),
  create: z.union([ z.lazy(() => ServiceCreateWithoutMetadataInputSchema), z.lazy(() => ServiceUncheckedCreateWithoutMetadataInputSchema) ]),
  where: z.lazy(() => ServiceWhereInputSchema).optional(),
}).strict();

export const ServiceUpdateToOneWithWhereWithoutMetadataInputSchema: z.ZodType<Prisma.ServiceUpdateToOneWithWhereWithoutMetadataInput> = z.object({
  where: z.lazy(() => ServiceWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ServiceUpdateWithoutMetadataInputSchema), z.lazy(() => ServiceUncheckedUpdateWithoutMetadataInputSchema) ]),
}).strict();

export const ServiceUpdateWithoutMetadataInputSchema: z.ZodType<Prisma.ServiceUpdateWithoutMetadataInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  basePrice: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  dynamicAttributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  vendor: z.lazy(() => UserUpdateOneRequiredWithoutServicesNestedInputSchema).optional(),
  category: z.lazy(() => CategoryUpdateOneRequiredWithoutServicesNestedInputSchema).optional(),
  unit: z.lazy(() => ServiceUnitUpdateOneRequiredWithoutServicesNestedInputSchema).optional(),
  slots: z.lazy(() => ServiceSlotUpdateManyWithoutServiceNestedInputSchema).optional(),
  bookings: z.lazy(() => BookingUpdateManyWithoutServiceNestedInputSchema).optional(),
}).strict();

export const ServiceUncheckedUpdateWithoutMetadataInputSchema: z.ZodType<Prisma.ServiceUncheckedUpdateWithoutMetadataInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  vendorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  categoryId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  unitId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  basePrice: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  dynamicAttributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  slots: z.lazy(() => ServiceSlotUncheckedUpdateManyWithoutServiceNestedInputSchema).optional(),
  bookings: z.lazy(() => BookingUncheckedUpdateManyWithoutServiceNestedInputSchema).optional(),
}).strict();

export const UserCreateWithoutBookingsInputSchema: z.ZodType<Prisma.UserCreateWithoutBookingsInput> = z.object({
  id: z.uuid().optional(),
  email: z.string(),
  password: z.string(),
  role: z.lazy(() => RoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  profile: z.lazy(() => ProfileCreateNestedOneWithoutUserInputSchema).optional(),
  services: z.lazy(() => ServiceCreateNestedManyWithoutVendorInputSchema).optional(),
  media: z.lazy(() => MediaCreateNestedManyWithoutUserInputSchema).optional(),
  sentMessages: z.lazy(() => MessageCreateNestedManyWithoutSenderInputSchema).optional(),
  receivedMessages: z.lazy(() => MessageCreateNestedManyWithoutReceiverInputSchema).optional(),
}).strict();

export const UserUncheckedCreateWithoutBookingsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutBookingsInput> = z.object({
  id: z.uuid().optional(),
  email: z.string(),
  password: z.string(),
  role: z.lazy(() => RoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  profile: z.lazy(() => ProfileUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  services: z.lazy(() => ServiceUncheckedCreateNestedManyWithoutVendorInputSchema).optional(),
  media: z.lazy(() => MediaUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  sentMessages: z.lazy(() => MessageUncheckedCreateNestedManyWithoutSenderInputSchema).optional(),
  receivedMessages: z.lazy(() => MessageUncheckedCreateNestedManyWithoutReceiverInputSchema).optional(),
}).strict();

export const UserCreateOrConnectWithoutBookingsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutBookingsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutBookingsInputSchema), z.lazy(() => UserUncheckedCreateWithoutBookingsInputSchema) ]),
}).strict();

export const ServiceCreateWithoutBookingsInputSchema: z.ZodType<Prisma.ServiceCreateWithoutBookingsInput> = z.object({
  id: z.uuid().optional(),
  title: z.string(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  basePrice: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  isActive: z.boolean().optional(),
  dynamicAttributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  vendor: z.lazy(() => UserCreateNestedOneWithoutServicesInputSchema),
  category: z.lazy(() => CategoryCreateNestedOneWithoutServicesInputSchema),
  unit: z.lazy(() => ServiceUnitCreateNestedOneWithoutServicesInputSchema),
  metadata: z.lazy(() => ServiceMetadataCreateNestedManyWithoutServiceInputSchema).optional(),
  slots: z.lazy(() => ServiceSlotCreateNestedManyWithoutServiceInputSchema).optional(),
}).strict();

export const ServiceUncheckedCreateWithoutBookingsInputSchema: z.ZodType<Prisma.ServiceUncheckedCreateWithoutBookingsInput> = z.object({
  id: z.uuid().optional(),
  vendorId: z.string(),
  categoryId: z.string(),
  unitId: z.string(),
  title: z.string(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  basePrice: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  isActive: z.boolean().optional(),
  dynamicAttributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  metadata: z.lazy(() => ServiceMetadataUncheckedCreateNestedManyWithoutServiceInputSchema).optional(),
  slots: z.lazy(() => ServiceSlotUncheckedCreateNestedManyWithoutServiceInputSchema).optional(),
}).strict();

export const ServiceCreateOrConnectWithoutBookingsInputSchema: z.ZodType<Prisma.ServiceCreateOrConnectWithoutBookingsInput> = z.object({
  where: z.lazy(() => ServiceWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ServiceCreateWithoutBookingsInputSchema), z.lazy(() => ServiceUncheckedCreateWithoutBookingsInputSchema) ]),
}).strict();

export const BookingDetailsCreateWithoutBookingInputSchema: z.ZodType<Prisma.BookingDetailsCreateWithoutBookingInput> = z.object({
  id: z.uuid().optional(),
  serviceSnapshot: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]),
  unitPrice: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  quantity: z.number().int().optional(),
  taxTotal: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  grandTotal: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
}).strict();

export const BookingDetailsUncheckedCreateWithoutBookingInputSchema: z.ZodType<Prisma.BookingDetailsUncheckedCreateWithoutBookingInput> = z.object({
  id: z.uuid().optional(),
  serviceSnapshot: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]),
  unitPrice: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  quantity: z.number().int().optional(),
  taxTotal: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  grandTotal: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
}).strict();

export const BookingDetailsCreateOrConnectWithoutBookingInputSchema: z.ZodType<Prisma.BookingDetailsCreateOrConnectWithoutBookingInput> = z.object({
  where: z.lazy(() => BookingDetailsWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => BookingDetailsCreateWithoutBookingInputSchema), z.lazy(() => BookingDetailsUncheckedCreateWithoutBookingInputSchema) ]),
}).strict();

export const PaymentCreateWithoutBookingInputSchema: z.ZodType<Prisma.PaymentCreateWithoutBookingInput> = z.object({
  id: z.uuid().optional(),
  amount: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  processorId: z.string(),
  status: z.string(),
}).strict();

export const PaymentUncheckedCreateWithoutBookingInputSchema: z.ZodType<Prisma.PaymentUncheckedCreateWithoutBookingInput> = z.object({
  id: z.uuid().optional(),
  amount: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  processorId: z.string(),
  status: z.string(),
}).strict();

export const PaymentCreateOrConnectWithoutBookingInputSchema: z.ZodType<Prisma.PaymentCreateOrConnectWithoutBookingInput> = z.object({
  where: z.lazy(() => PaymentWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PaymentCreateWithoutBookingInputSchema), z.lazy(() => PaymentUncheckedCreateWithoutBookingInputSchema) ]),
}).strict();

export const ServiceSlotCreateWithoutBookingInputSchema: z.ZodType<Prisma.ServiceSlotCreateWithoutBookingInput> = z.object({
  id: z.uuid().optional(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  status: z.lazy(() => SlotStatusSchema).optional(),
  isRecurring: z.boolean().optional(),
  service: z.lazy(() => ServiceCreateNestedOneWithoutSlotsInputSchema),
}).strict();

export const ServiceSlotUncheckedCreateWithoutBookingInputSchema: z.ZodType<Prisma.ServiceSlotUncheckedCreateWithoutBookingInput> = z.object({
  id: z.uuid().optional(),
  serviceId: z.string(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  status: z.lazy(() => SlotStatusSchema).optional(),
  isRecurring: z.boolean().optional(),
}).strict();

export const ServiceSlotCreateOrConnectWithoutBookingInputSchema: z.ZodType<Prisma.ServiceSlotCreateOrConnectWithoutBookingInput> = z.object({
  where: z.lazy(() => ServiceSlotWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ServiceSlotCreateWithoutBookingInputSchema), z.lazy(() => ServiceSlotUncheckedCreateWithoutBookingInputSchema) ]),
}).strict();

export const ServiceSlotCreateManyBookingInputEnvelopeSchema: z.ZodType<Prisma.ServiceSlotCreateManyBookingInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ServiceSlotCreateManyBookingInputSchema), z.lazy(() => ServiceSlotCreateManyBookingInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const UserUpsertWithoutBookingsInputSchema: z.ZodType<Prisma.UserUpsertWithoutBookingsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutBookingsInputSchema), z.lazy(() => UserUncheckedUpdateWithoutBookingsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutBookingsInputSchema), z.lazy(() => UserUncheckedCreateWithoutBookingsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional(),
}).strict();

export const UserUpdateToOneWithWhereWithoutBookingsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutBookingsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutBookingsInputSchema), z.lazy(() => UserUncheckedUpdateWithoutBookingsInputSchema) ]),
}).strict();

export const UserUpdateWithoutBookingsInputSchema: z.ZodType<Prisma.UserUpdateWithoutBookingsInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema), z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  profile: z.lazy(() => ProfileUpdateOneWithoutUserNestedInputSchema).optional(),
  services: z.lazy(() => ServiceUpdateManyWithoutVendorNestedInputSchema).optional(),
  media: z.lazy(() => MediaUpdateManyWithoutUserNestedInputSchema).optional(),
  sentMessages: z.lazy(() => MessageUpdateManyWithoutSenderNestedInputSchema).optional(),
  receivedMessages: z.lazy(() => MessageUpdateManyWithoutReceiverNestedInputSchema).optional(),
}).strict();

export const UserUncheckedUpdateWithoutBookingsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutBookingsInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema), z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  profile: z.lazy(() => ProfileUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  services: z.lazy(() => ServiceUncheckedUpdateManyWithoutVendorNestedInputSchema).optional(),
  media: z.lazy(() => MediaUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  sentMessages: z.lazy(() => MessageUncheckedUpdateManyWithoutSenderNestedInputSchema).optional(),
  receivedMessages: z.lazy(() => MessageUncheckedUpdateManyWithoutReceiverNestedInputSchema).optional(),
}).strict();

export const ServiceUpsertWithoutBookingsInputSchema: z.ZodType<Prisma.ServiceUpsertWithoutBookingsInput> = z.object({
  update: z.union([ z.lazy(() => ServiceUpdateWithoutBookingsInputSchema), z.lazy(() => ServiceUncheckedUpdateWithoutBookingsInputSchema) ]),
  create: z.union([ z.lazy(() => ServiceCreateWithoutBookingsInputSchema), z.lazy(() => ServiceUncheckedCreateWithoutBookingsInputSchema) ]),
  where: z.lazy(() => ServiceWhereInputSchema).optional(),
}).strict();

export const ServiceUpdateToOneWithWhereWithoutBookingsInputSchema: z.ZodType<Prisma.ServiceUpdateToOneWithWhereWithoutBookingsInput> = z.object({
  where: z.lazy(() => ServiceWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ServiceUpdateWithoutBookingsInputSchema), z.lazy(() => ServiceUncheckedUpdateWithoutBookingsInputSchema) ]),
}).strict();

export const ServiceUpdateWithoutBookingsInputSchema: z.ZodType<Prisma.ServiceUpdateWithoutBookingsInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  basePrice: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  dynamicAttributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  vendor: z.lazy(() => UserUpdateOneRequiredWithoutServicesNestedInputSchema).optional(),
  category: z.lazy(() => CategoryUpdateOneRequiredWithoutServicesNestedInputSchema).optional(),
  unit: z.lazy(() => ServiceUnitUpdateOneRequiredWithoutServicesNestedInputSchema).optional(),
  metadata: z.lazy(() => ServiceMetadataUpdateManyWithoutServiceNestedInputSchema).optional(),
  slots: z.lazy(() => ServiceSlotUpdateManyWithoutServiceNestedInputSchema).optional(),
}).strict();

export const ServiceUncheckedUpdateWithoutBookingsInputSchema: z.ZodType<Prisma.ServiceUncheckedUpdateWithoutBookingsInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  vendorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  categoryId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  unitId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  basePrice: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  dynamicAttributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  metadata: z.lazy(() => ServiceMetadataUncheckedUpdateManyWithoutServiceNestedInputSchema).optional(),
  slots: z.lazy(() => ServiceSlotUncheckedUpdateManyWithoutServiceNestedInputSchema).optional(),
}).strict();

export const BookingDetailsUpsertWithoutBookingInputSchema: z.ZodType<Prisma.BookingDetailsUpsertWithoutBookingInput> = z.object({
  update: z.union([ z.lazy(() => BookingDetailsUpdateWithoutBookingInputSchema), z.lazy(() => BookingDetailsUncheckedUpdateWithoutBookingInputSchema) ]),
  create: z.union([ z.lazy(() => BookingDetailsCreateWithoutBookingInputSchema), z.lazy(() => BookingDetailsUncheckedCreateWithoutBookingInputSchema) ]),
  where: z.lazy(() => BookingDetailsWhereInputSchema).optional(),
}).strict();

export const BookingDetailsUpdateToOneWithWhereWithoutBookingInputSchema: z.ZodType<Prisma.BookingDetailsUpdateToOneWithWhereWithoutBookingInput> = z.object({
  where: z.lazy(() => BookingDetailsWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => BookingDetailsUpdateWithoutBookingInputSchema), z.lazy(() => BookingDetailsUncheckedUpdateWithoutBookingInputSchema) ]),
}).strict();

export const BookingDetailsUpdateWithoutBookingInputSchema: z.ZodType<Prisma.BookingDetailsUpdateWithoutBookingInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceSnapshot: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  unitPrice: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  taxTotal: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  grandTotal: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BookingDetailsUncheckedUpdateWithoutBookingInputSchema: z.ZodType<Prisma.BookingDetailsUncheckedUpdateWithoutBookingInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceSnapshot: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  unitPrice: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  quantity: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  taxTotal: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  grandTotal: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PaymentUpsertWithoutBookingInputSchema: z.ZodType<Prisma.PaymentUpsertWithoutBookingInput> = z.object({
  update: z.union([ z.lazy(() => PaymentUpdateWithoutBookingInputSchema), z.lazy(() => PaymentUncheckedUpdateWithoutBookingInputSchema) ]),
  create: z.union([ z.lazy(() => PaymentCreateWithoutBookingInputSchema), z.lazy(() => PaymentUncheckedCreateWithoutBookingInputSchema) ]),
  where: z.lazy(() => PaymentWhereInputSchema).optional(),
}).strict();

export const PaymentUpdateToOneWithWhereWithoutBookingInputSchema: z.ZodType<Prisma.PaymentUpdateToOneWithWhereWithoutBookingInput> = z.object({
  where: z.lazy(() => PaymentWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => PaymentUpdateWithoutBookingInputSchema), z.lazy(() => PaymentUncheckedUpdateWithoutBookingInputSchema) ]),
}).strict();

export const PaymentUpdateWithoutBookingInputSchema: z.ZodType<Prisma.PaymentUpdateWithoutBookingInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  processorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PaymentUncheckedUpdateWithoutBookingInputSchema: z.ZodType<Prisma.PaymentUncheckedUpdateWithoutBookingInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  amount: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  processorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ServiceSlotUpsertWithWhereUniqueWithoutBookingInputSchema: z.ZodType<Prisma.ServiceSlotUpsertWithWhereUniqueWithoutBookingInput> = z.object({
  where: z.lazy(() => ServiceSlotWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ServiceSlotUpdateWithoutBookingInputSchema), z.lazy(() => ServiceSlotUncheckedUpdateWithoutBookingInputSchema) ]),
  create: z.union([ z.lazy(() => ServiceSlotCreateWithoutBookingInputSchema), z.lazy(() => ServiceSlotUncheckedCreateWithoutBookingInputSchema) ]),
}).strict();

export const ServiceSlotUpdateWithWhereUniqueWithoutBookingInputSchema: z.ZodType<Prisma.ServiceSlotUpdateWithWhereUniqueWithoutBookingInput> = z.object({
  where: z.lazy(() => ServiceSlotWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ServiceSlotUpdateWithoutBookingInputSchema), z.lazy(() => ServiceSlotUncheckedUpdateWithoutBookingInputSchema) ]),
}).strict();

export const ServiceSlotUpdateManyWithWhereWithoutBookingInputSchema: z.ZodType<Prisma.ServiceSlotUpdateManyWithWhereWithoutBookingInput> = z.object({
  where: z.lazy(() => ServiceSlotScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ServiceSlotUpdateManyMutationInputSchema), z.lazy(() => ServiceSlotUncheckedUpdateManyWithoutBookingInputSchema) ]),
}).strict();

export const BookingCreateWithoutDetailsInputSchema: z.ZodType<Prisma.BookingCreateWithoutDetailsInput> = z.object({
  id: z.uuid().optional(),
  status: z.lazy(() => BookingStatusSchema).optional(),
  scheduledDate: z.coerce.date(),
  customer: z.lazy(() => UserCreateNestedOneWithoutBookingsInputSchema),
  service: z.lazy(() => ServiceCreateNestedOneWithoutBookingsInputSchema),
  payment: z.lazy(() => PaymentCreateNestedOneWithoutBookingInputSchema).optional(),
  slots: z.lazy(() => ServiceSlotCreateNestedManyWithoutBookingInputSchema).optional(),
}).strict();

export const BookingUncheckedCreateWithoutDetailsInputSchema: z.ZodType<Prisma.BookingUncheckedCreateWithoutDetailsInput> = z.object({
  id: z.uuid().optional(),
  customerId: z.string(),
  serviceId: z.string(),
  status: z.lazy(() => BookingStatusSchema).optional(),
  scheduledDate: z.coerce.date(),
  payment: z.lazy(() => PaymentUncheckedCreateNestedOneWithoutBookingInputSchema).optional(),
  slots: z.lazy(() => ServiceSlotUncheckedCreateNestedManyWithoutBookingInputSchema).optional(),
}).strict();

export const BookingCreateOrConnectWithoutDetailsInputSchema: z.ZodType<Prisma.BookingCreateOrConnectWithoutDetailsInput> = z.object({
  where: z.lazy(() => BookingWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => BookingCreateWithoutDetailsInputSchema), z.lazy(() => BookingUncheckedCreateWithoutDetailsInputSchema) ]),
}).strict();

export const BookingUpsertWithoutDetailsInputSchema: z.ZodType<Prisma.BookingUpsertWithoutDetailsInput> = z.object({
  update: z.union([ z.lazy(() => BookingUpdateWithoutDetailsInputSchema), z.lazy(() => BookingUncheckedUpdateWithoutDetailsInputSchema) ]),
  create: z.union([ z.lazy(() => BookingCreateWithoutDetailsInputSchema), z.lazy(() => BookingUncheckedCreateWithoutDetailsInputSchema) ]),
  where: z.lazy(() => BookingWhereInputSchema).optional(),
}).strict();

export const BookingUpdateToOneWithWhereWithoutDetailsInputSchema: z.ZodType<Prisma.BookingUpdateToOneWithWhereWithoutDetailsInput> = z.object({
  where: z.lazy(() => BookingWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => BookingUpdateWithoutDetailsInputSchema), z.lazy(() => BookingUncheckedUpdateWithoutDetailsInputSchema) ]),
}).strict();

export const BookingUpdateWithoutDetailsInputSchema: z.ZodType<Prisma.BookingUpdateWithoutDetailsInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => BookingStatusSchema), z.lazy(() => EnumBookingStatusFieldUpdateOperationsInputSchema) ]).optional(),
  scheduledDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  customer: z.lazy(() => UserUpdateOneRequiredWithoutBookingsNestedInputSchema).optional(),
  service: z.lazy(() => ServiceUpdateOneRequiredWithoutBookingsNestedInputSchema).optional(),
  payment: z.lazy(() => PaymentUpdateOneWithoutBookingNestedInputSchema).optional(),
  slots: z.lazy(() => ServiceSlotUpdateManyWithoutBookingNestedInputSchema).optional(),
}).strict();

export const BookingUncheckedUpdateWithoutDetailsInputSchema: z.ZodType<Prisma.BookingUncheckedUpdateWithoutDetailsInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => BookingStatusSchema), z.lazy(() => EnumBookingStatusFieldUpdateOperationsInputSchema) ]).optional(),
  scheduledDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  payment: z.lazy(() => PaymentUncheckedUpdateOneWithoutBookingNestedInputSchema).optional(),
  slots: z.lazy(() => ServiceSlotUncheckedUpdateManyWithoutBookingNestedInputSchema).optional(),
}).strict();

export const ServiceCreateWithoutSlotsInputSchema: z.ZodType<Prisma.ServiceCreateWithoutSlotsInput> = z.object({
  id: z.uuid().optional(),
  title: z.string(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  basePrice: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  isActive: z.boolean().optional(),
  dynamicAttributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  vendor: z.lazy(() => UserCreateNestedOneWithoutServicesInputSchema),
  category: z.lazy(() => CategoryCreateNestedOneWithoutServicesInputSchema),
  unit: z.lazy(() => ServiceUnitCreateNestedOneWithoutServicesInputSchema),
  metadata: z.lazy(() => ServiceMetadataCreateNestedManyWithoutServiceInputSchema).optional(),
  bookings: z.lazy(() => BookingCreateNestedManyWithoutServiceInputSchema).optional(),
}).strict();

export const ServiceUncheckedCreateWithoutSlotsInputSchema: z.ZodType<Prisma.ServiceUncheckedCreateWithoutSlotsInput> = z.object({
  id: z.uuid().optional(),
  vendorId: z.string(),
  categoryId: z.string(),
  unitId: z.string(),
  title: z.string(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  basePrice: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  isActive: z.boolean().optional(),
  dynamicAttributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  metadata: z.lazy(() => ServiceMetadataUncheckedCreateNestedManyWithoutServiceInputSchema).optional(),
  bookings: z.lazy(() => BookingUncheckedCreateNestedManyWithoutServiceInputSchema).optional(),
}).strict();

export const ServiceCreateOrConnectWithoutSlotsInputSchema: z.ZodType<Prisma.ServiceCreateOrConnectWithoutSlotsInput> = z.object({
  where: z.lazy(() => ServiceWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ServiceCreateWithoutSlotsInputSchema), z.lazy(() => ServiceUncheckedCreateWithoutSlotsInputSchema) ]),
}).strict();

export const BookingCreateWithoutSlotsInputSchema: z.ZodType<Prisma.BookingCreateWithoutSlotsInput> = z.object({
  id: z.uuid().optional(),
  status: z.lazy(() => BookingStatusSchema).optional(),
  scheduledDate: z.coerce.date(),
  customer: z.lazy(() => UserCreateNestedOneWithoutBookingsInputSchema),
  service: z.lazy(() => ServiceCreateNestedOneWithoutBookingsInputSchema),
  details: z.lazy(() => BookingDetailsCreateNestedOneWithoutBookingInputSchema).optional(),
  payment: z.lazy(() => PaymentCreateNestedOneWithoutBookingInputSchema).optional(),
}).strict();

export const BookingUncheckedCreateWithoutSlotsInputSchema: z.ZodType<Prisma.BookingUncheckedCreateWithoutSlotsInput> = z.object({
  id: z.uuid().optional(),
  customerId: z.string(),
  serviceId: z.string(),
  status: z.lazy(() => BookingStatusSchema).optional(),
  scheduledDate: z.coerce.date(),
  details: z.lazy(() => BookingDetailsUncheckedCreateNestedOneWithoutBookingInputSchema).optional(),
  payment: z.lazy(() => PaymentUncheckedCreateNestedOneWithoutBookingInputSchema).optional(),
}).strict();

export const BookingCreateOrConnectWithoutSlotsInputSchema: z.ZodType<Prisma.BookingCreateOrConnectWithoutSlotsInput> = z.object({
  where: z.lazy(() => BookingWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => BookingCreateWithoutSlotsInputSchema), z.lazy(() => BookingUncheckedCreateWithoutSlotsInputSchema) ]),
}).strict();

export const ServiceUpsertWithoutSlotsInputSchema: z.ZodType<Prisma.ServiceUpsertWithoutSlotsInput> = z.object({
  update: z.union([ z.lazy(() => ServiceUpdateWithoutSlotsInputSchema), z.lazy(() => ServiceUncheckedUpdateWithoutSlotsInputSchema) ]),
  create: z.union([ z.lazy(() => ServiceCreateWithoutSlotsInputSchema), z.lazy(() => ServiceUncheckedCreateWithoutSlotsInputSchema) ]),
  where: z.lazy(() => ServiceWhereInputSchema).optional(),
}).strict();

export const ServiceUpdateToOneWithWhereWithoutSlotsInputSchema: z.ZodType<Prisma.ServiceUpdateToOneWithWhereWithoutSlotsInput> = z.object({
  where: z.lazy(() => ServiceWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ServiceUpdateWithoutSlotsInputSchema), z.lazy(() => ServiceUncheckedUpdateWithoutSlotsInputSchema) ]),
}).strict();

export const ServiceUpdateWithoutSlotsInputSchema: z.ZodType<Prisma.ServiceUpdateWithoutSlotsInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  basePrice: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  dynamicAttributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  vendor: z.lazy(() => UserUpdateOneRequiredWithoutServicesNestedInputSchema).optional(),
  category: z.lazy(() => CategoryUpdateOneRequiredWithoutServicesNestedInputSchema).optional(),
  unit: z.lazy(() => ServiceUnitUpdateOneRequiredWithoutServicesNestedInputSchema).optional(),
  metadata: z.lazy(() => ServiceMetadataUpdateManyWithoutServiceNestedInputSchema).optional(),
  bookings: z.lazy(() => BookingUpdateManyWithoutServiceNestedInputSchema).optional(),
}).strict();

export const ServiceUncheckedUpdateWithoutSlotsInputSchema: z.ZodType<Prisma.ServiceUncheckedUpdateWithoutSlotsInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  vendorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  categoryId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  unitId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  basePrice: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  dynamicAttributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  metadata: z.lazy(() => ServiceMetadataUncheckedUpdateManyWithoutServiceNestedInputSchema).optional(),
  bookings: z.lazy(() => BookingUncheckedUpdateManyWithoutServiceNestedInputSchema).optional(),
}).strict();

export const BookingUpsertWithoutSlotsInputSchema: z.ZodType<Prisma.BookingUpsertWithoutSlotsInput> = z.object({
  update: z.union([ z.lazy(() => BookingUpdateWithoutSlotsInputSchema), z.lazy(() => BookingUncheckedUpdateWithoutSlotsInputSchema) ]),
  create: z.union([ z.lazy(() => BookingCreateWithoutSlotsInputSchema), z.lazy(() => BookingUncheckedCreateWithoutSlotsInputSchema) ]),
  where: z.lazy(() => BookingWhereInputSchema).optional(),
}).strict();

export const BookingUpdateToOneWithWhereWithoutSlotsInputSchema: z.ZodType<Prisma.BookingUpdateToOneWithWhereWithoutSlotsInput> = z.object({
  where: z.lazy(() => BookingWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => BookingUpdateWithoutSlotsInputSchema), z.lazy(() => BookingUncheckedUpdateWithoutSlotsInputSchema) ]),
}).strict();

export const BookingUpdateWithoutSlotsInputSchema: z.ZodType<Prisma.BookingUpdateWithoutSlotsInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => BookingStatusSchema), z.lazy(() => EnumBookingStatusFieldUpdateOperationsInputSchema) ]).optional(),
  scheduledDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  customer: z.lazy(() => UserUpdateOneRequiredWithoutBookingsNestedInputSchema).optional(),
  service: z.lazy(() => ServiceUpdateOneRequiredWithoutBookingsNestedInputSchema).optional(),
  details: z.lazy(() => BookingDetailsUpdateOneWithoutBookingNestedInputSchema).optional(),
  payment: z.lazy(() => PaymentUpdateOneWithoutBookingNestedInputSchema).optional(),
}).strict();

export const BookingUncheckedUpdateWithoutSlotsInputSchema: z.ZodType<Prisma.BookingUncheckedUpdateWithoutSlotsInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => BookingStatusSchema), z.lazy(() => EnumBookingStatusFieldUpdateOperationsInputSchema) ]).optional(),
  scheduledDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.lazy(() => BookingDetailsUncheckedUpdateOneWithoutBookingNestedInputSchema).optional(),
  payment: z.lazy(() => PaymentUncheckedUpdateOneWithoutBookingNestedInputSchema).optional(),
}).strict();

export const BookingCreateWithoutPaymentInputSchema: z.ZodType<Prisma.BookingCreateWithoutPaymentInput> = z.object({
  id: z.uuid().optional(),
  status: z.lazy(() => BookingStatusSchema).optional(),
  scheduledDate: z.coerce.date(),
  customer: z.lazy(() => UserCreateNestedOneWithoutBookingsInputSchema),
  service: z.lazy(() => ServiceCreateNestedOneWithoutBookingsInputSchema),
  details: z.lazy(() => BookingDetailsCreateNestedOneWithoutBookingInputSchema).optional(),
  slots: z.lazy(() => ServiceSlotCreateNestedManyWithoutBookingInputSchema).optional(),
}).strict();

export const BookingUncheckedCreateWithoutPaymentInputSchema: z.ZodType<Prisma.BookingUncheckedCreateWithoutPaymentInput> = z.object({
  id: z.uuid().optional(),
  customerId: z.string(),
  serviceId: z.string(),
  status: z.lazy(() => BookingStatusSchema).optional(),
  scheduledDate: z.coerce.date(),
  details: z.lazy(() => BookingDetailsUncheckedCreateNestedOneWithoutBookingInputSchema).optional(),
  slots: z.lazy(() => ServiceSlotUncheckedCreateNestedManyWithoutBookingInputSchema).optional(),
}).strict();

export const BookingCreateOrConnectWithoutPaymentInputSchema: z.ZodType<Prisma.BookingCreateOrConnectWithoutPaymentInput> = z.object({
  where: z.lazy(() => BookingWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => BookingCreateWithoutPaymentInputSchema), z.lazy(() => BookingUncheckedCreateWithoutPaymentInputSchema) ]),
}).strict();

export const BookingUpsertWithoutPaymentInputSchema: z.ZodType<Prisma.BookingUpsertWithoutPaymentInput> = z.object({
  update: z.union([ z.lazy(() => BookingUpdateWithoutPaymentInputSchema), z.lazy(() => BookingUncheckedUpdateWithoutPaymentInputSchema) ]),
  create: z.union([ z.lazy(() => BookingCreateWithoutPaymentInputSchema), z.lazy(() => BookingUncheckedCreateWithoutPaymentInputSchema) ]),
  where: z.lazy(() => BookingWhereInputSchema).optional(),
}).strict();

export const BookingUpdateToOneWithWhereWithoutPaymentInputSchema: z.ZodType<Prisma.BookingUpdateToOneWithWhereWithoutPaymentInput> = z.object({
  where: z.lazy(() => BookingWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => BookingUpdateWithoutPaymentInputSchema), z.lazy(() => BookingUncheckedUpdateWithoutPaymentInputSchema) ]),
}).strict();

export const BookingUpdateWithoutPaymentInputSchema: z.ZodType<Prisma.BookingUpdateWithoutPaymentInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => BookingStatusSchema), z.lazy(() => EnumBookingStatusFieldUpdateOperationsInputSchema) ]).optional(),
  scheduledDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  customer: z.lazy(() => UserUpdateOneRequiredWithoutBookingsNestedInputSchema).optional(),
  service: z.lazy(() => ServiceUpdateOneRequiredWithoutBookingsNestedInputSchema).optional(),
  details: z.lazy(() => BookingDetailsUpdateOneWithoutBookingNestedInputSchema).optional(),
  slots: z.lazy(() => ServiceSlotUpdateManyWithoutBookingNestedInputSchema).optional(),
}).strict();

export const BookingUncheckedUpdateWithoutPaymentInputSchema: z.ZodType<Prisma.BookingUncheckedUpdateWithoutPaymentInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => BookingStatusSchema), z.lazy(() => EnumBookingStatusFieldUpdateOperationsInputSchema) ]).optional(),
  scheduledDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.lazy(() => BookingDetailsUncheckedUpdateOneWithoutBookingNestedInputSchema).optional(),
  slots: z.lazy(() => ServiceSlotUncheckedUpdateManyWithoutBookingNestedInputSchema).optional(),
}).strict();

export const ServiceCreateManyVendorInputSchema: z.ZodType<Prisma.ServiceCreateManyVendorInput> = z.object({
  id: z.uuid().optional(),
  categoryId: z.string(),
  unitId: z.string(),
  title: z.string(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  basePrice: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  isActive: z.boolean().optional(),
  dynamicAttributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
}).strict();

export const BookingCreateManyCustomerInputSchema: z.ZodType<Prisma.BookingCreateManyCustomerInput> = z.object({
  id: z.uuid().optional(),
  serviceId: z.string(),
  status: z.lazy(() => BookingStatusSchema).optional(),
  scheduledDate: z.coerce.date(),
}).strict();

export const MediaCreateManyUserInputSchema: z.ZodType<Prisma.MediaCreateManyUserInput> = z.object({
  id: z.uuid().optional(),
  url: z.string(),
  key: z.string().optional().nullable(),
  fileName: z.string(),
  mimeType: z.string(),
  size: z.number().int(),
  alt: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
}).strict();

export const MessageCreateManySenderInputSchema: z.ZodType<Prisma.MessageCreateManySenderInput> = z.object({
  id: z.uuid().optional(),
  content: z.string(),
  receiverId: z.string(),
  isRead: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
}).strict();

export const MessageCreateManyReceiverInputSchema: z.ZodType<Prisma.MessageCreateManyReceiverInput> = z.object({
  id: z.uuid().optional(),
  content: z.string(),
  senderId: z.string(),
  isRead: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
}).strict();

export const ServiceUpdateWithoutVendorInputSchema: z.ZodType<Prisma.ServiceUpdateWithoutVendorInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  basePrice: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  dynamicAttributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  category: z.lazy(() => CategoryUpdateOneRequiredWithoutServicesNestedInputSchema).optional(),
  unit: z.lazy(() => ServiceUnitUpdateOneRequiredWithoutServicesNestedInputSchema).optional(),
  metadata: z.lazy(() => ServiceMetadataUpdateManyWithoutServiceNestedInputSchema).optional(),
  slots: z.lazy(() => ServiceSlotUpdateManyWithoutServiceNestedInputSchema).optional(),
  bookings: z.lazy(() => BookingUpdateManyWithoutServiceNestedInputSchema).optional(),
}).strict();

export const ServiceUncheckedUpdateWithoutVendorInputSchema: z.ZodType<Prisma.ServiceUncheckedUpdateWithoutVendorInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  categoryId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  unitId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  basePrice: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  dynamicAttributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  metadata: z.lazy(() => ServiceMetadataUncheckedUpdateManyWithoutServiceNestedInputSchema).optional(),
  slots: z.lazy(() => ServiceSlotUncheckedUpdateManyWithoutServiceNestedInputSchema).optional(),
  bookings: z.lazy(() => BookingUncheckedUpdateManyWithoutServiceNestedInputSchema).optional(),
}).strict();

export const ServiceUncheckedUpdateManyWithoutVendorInputSchema: z.ZodType<Prisma.ServiceUncheckedUpdateManyWithoutVendorInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  categoryId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  unitId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  basePrice: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  dynamicAttributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
}).strict();

export const BookingUpdateWithoutCustomerInputSchema: z.ZodType<Prisma.BookingUpdateWithoutCustomerInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => BookingStatusSchema), z.lazy(() => EnumBookingStatusFieldUpdateOperationsInputSchema) ]).optional(),
  scheduledDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  service: z.lazy(() => ServiceUpdateOneRequiredWithoutBookingsNestedInputSchema).optional(),
  details: z.lazy(() => BookingDetailsUpdateOneWithoutBookingNestedInputSchema).optional(),
  payment: z.lazy(() => PaymentUpdateOneWithoutBookingNestedInputSchema).optional(),
  slots: z.lazy(() => ServiceSlotUpdateManyWithoutBookingNestedInputSchema).optional(),
}).strict();

export const BookingUncheckedUpdateWithoutCustomerInputSchema: z.ZodType<Prisma.BookingUncheckedUpdateWithoutCustomerInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => BookingStatusSchema), z.lazy(() => EnumBookingStatusFieldUpdateOperationsInputSchema) ]).optional(),
  scheduledDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.lazy(() => BookingDetailsUncheckedUpdateOneWithoutBookingNestedInputSchema).optional(),
  payment: z.lazy(() => PaymentUncheckedUpdateOneWithoutBookingNestedInputSchema).optional(),
  slots: z.lazy(() => ServiceSlotUncheckedUpdateManyWithoutBookingNestedInputSchema).optional(),
}).strict();

export const BookingUncheckedUpdateManyWithoutCustomerInputSchema: z.ZodType<Prisma.BookingUncheckedUpdateManyWithoutCustomerInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => BookingStatusSchema), z.lazy(() => EnumBookingStatusFieldUpdateOperationsInputSchema) ]).optional(),
  scheduledDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MediaUpdateWithoutUserInputSchema: z.ZodType<Prisma.MediaUpdateWithoutUserInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  key: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  fileName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  mimeType: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  size: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  alt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MediaUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.MediaUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  key: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  fileName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  mimeType: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  size: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  alt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MediaUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.MediaUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  key: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  fileName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  mimeType: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  size: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  alt: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MessageUpdateWithoutSenderInputSchema: z.ZodType<Prisma.MessageUpdateWithoutSenderInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isRead: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  receiver: z.lazy(() => UserUpdateOneRequiredWithoutReceivedMessagesNestedInputSchema).optional(),
}).strict();

export const MessageUncheckedUpdateWithoutSenderInputSchema: z.ZodType<Prisma.MessageUncheckedUpdateWithoutSenderInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  receiverId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isRead: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MessageUncheckedUpdateManyWithoutSenderInputSchema: z.ZodType<Prisma.MessageUncheckedUpdateManyWithoutSenderInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  receiverId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isRead: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MessageUpdateWithoutReceiverInputSchema: z.ZodType<Prisma.MessageUpdateWithoutReceiverInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isRead: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  sender: z.lazy(() => UserUpdateOneRequiredWithoutSentMessagesNestedInputSchema).optional(),
}).strict();

export const MessageUncheckedUpdateWithoutReceiverInputSchema: z.ZodType<Prisma.MessageUncheckedUpdateWithoutReceiverInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  senderId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isRead: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const MessageUncheckedUpdateManyWithoutReceiverInputSchema: z.ZodType<Prisma.MessageUncheckedUpdateManyWithoutReceiverInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  content: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  senderId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isRead: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PortfolioItemCreateManyProfileInputSchema: z.ZodType<Prisma.PortfolioItemCreateManyProfileInput> = z.object({
  id: z.uuid().optional(),
  imageUrl: z.string(),
  description: z.string().optional().nullable(),
  imageGallery: z.union([ z.lazy(() => PortfolioItemCreateimageGalleryInputSchema), z.string().array() ]).optional(),
  dynamicAttributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
}).strict();

export const PortfolioItemUpdateWithoutProfileInputSchema: z.ZodType<Prisma.PortfolioItemUpdateWithoutProfileInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageGallery: z.union([ z.lazy(() => PortfolioItemUpdateimageGalleryInputSchema), z.string().array() ]).optional(),
  dynamicAttributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
}).strict();

export const PortfolioItemUncheckedUpdateWithoutProfileInputSchema: z.ZodType<Prisma.PortfolioItemUncheckedUpdateWithoutProfileInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageGallery: z.union([ z.lazy(() => PortfolioItemUpdateimageGalleryInputSchema), z.string().array() ]).optional(),
  dynamicAttributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
}).strict();

export const PortfolioItemUncheckedUpdateManyWithoutProfileInputSchema: z.ZodType<Prisma.PortfolioItemUncheckedUpdateManyWithoutProfileInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageGallery: z.union([ z.lazy(() => PortfolioItemUpdateimageGalleryInputSchema), z.string().array() ]).optional(),
  dynamicAttributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
}).strict();

export const CategoryCreateManyParentInputSchema: z.ZodType<Prisma.CategoryCreateManyParentInput> = z.object({
  id: z.uuid().optional(),
  name: z.string(),
  slug: z.string(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
}).strict();

export const ServiceCreateManyCategoryInputSchema: z.ZodType<Prisma.ServiceCreateManyCategoryInput> = z.object({
  id: z.uuid().optional(),
  vendorId: z.string(),
  unitId: z.string(),
  title: z.string(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  basePrice: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  isActive: z.boolean().optional(),
  dynamicAttributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
}).strict();

export const CategoryUpdateWithoutParentInputSchema: z.ZodType<Prisma.CategoryUpdateWithoutParentInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  children: z.lazy(() => CategoryUpdateManyWithoutParentNestedInputSchema).optional(),
  services: z.lazy(() => ServiceUpdateManyWithoutCategoryNestedInputSchema).optional(),
}).strict();

export const CategoryUncheckedUpdateWithoutParentInputSchema: z.ZodType<Prisma.CategoryUncheckedUpdateWithoutParentInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  children: z.lazy(() => CategoryUncheckedUpdateManyWithoutParentNestedInputSchema).optional(),
  services: z.lazy(() => ServiceUncheckedUpdateManyWithoutCategoryNestedInputSchema).optional(),
}).strict();

export const CategoryUncheckedUpdateManyWithoutParentInputSchema: z.ZodType<Prisma.CategoryUncheckedUpdateManyWithoutParentInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ServiceUpdateWithoutCategoryInputSchema: z.ZodType<Prisma.ServiceUpdateWithoutCategoryInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  basePrice: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  dynamicAttributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  vendor: z.lazy(() => UserUpdateOneRequiredWithoutServicesNestedInputSchema).optional(),
  unit: z.lazy(() => ServiceUnitUpdateOneRequiredWithoutServicesNestedInputSchema).optional(),
  metadata: z.lazy(() => ServiceMetadataUpdateManyWithoutServiceNestedInputSchema).optional(),
  slots: z.lazy(() => ServiceSlotUpdateManyWithoutServiceNestedInputSchema).optional(),
  bookings: z.lazy(() => BookingUpdateManyWithoutServiceNestedInputSchema).optional(),
}).strict();

export const ServiceUncheckedUpdateWithoutCategoryInputSchema: z.ZodType<Prisma.ServiceUncheckedUpdateWithoutCategoryInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  vendorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  unitId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  basePrice: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  dynamicAttributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  metadata: z.lazy(() => ServiceMetadataUncheckedUpdateManyWithoutServiceNestedInputSchema).optional(),
  slots: z.lazy(() => ServiceSlotUncheckedUpdateManyWithoutServiceNestedInputSchema).optional(),
  bookings: z.lazy(() => BookingUncheckedUpdateManyWithoutServiceNestedInputSchema).optional(),
}).strict();

export const ServiceUncheckedUpdateManyWithoutCategoryInputSchema: z.ZodType<Prisma.ServiceUncheckedUpdateManyWithoutCategoryInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  vendorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  unitId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  basePrice: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  dynamicAttributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
}).strict();

export const ServiceCreateManyUnitInputSchema: z.ZodType<Prisma.ServiceCreateManyUnitInput> = z.object({
  id: z.uuid().optional(),
  vendorId: z.string(),
  categoryId: z.string(),
  title: z.string(),
  description: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  basePrice: z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),
  isActive: z.boolean().optional(),
  dynamicAttributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
}).strict();

export const ServiceUpdateWithoutUnitInputSchema: z.ZodType<Prisma.ServiceUpdateWithoutUnitInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  basePrice: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  dynamicAttributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  vendor: z.lazy(() => UserUpdateOneRequiredWithoutServicesNestedInputSchema).optional(),
  category: z.lazy(() => CategoryUpdateOneRequiredWithoutServicesNestedInputSchema).optional(),
  metadata: z.lazy(() => ServiceMetadataUpdateManyWithoutServiceNestedInputSchema).optional(),
  slots: z.lazy(() => ServiceSlotUpdateManyWithoutServiceNestedInputSchema).optional(),
  bookings: z.lazy(() => BookingUpdateManyWithoutServiceNestedInputSchema).optional(),
}).strict();

export const ServiceUncheckedUpdateWithoutUnitInputSchema: z.ZodType<Prisma.ServiceUncheckedUpdateWithoutUnitInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  vendorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  categoryId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  basePrice: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  dynamicAttributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  metadata: z.lazy(() => ServiceMetadataUncheckedUpdateManyWithoutServiceNestedInputSchema).optional(),
  slots: z.lazy(() => ServiceSlotUncheckedUpdateManyWithoutServiceNestedInputSchema).optional(),
  bookings: z.lazy(() => BookingUncheckedUpdateManyWithoutServiceNestedInputSchema).optional(),
}).strict();

export const ServiceUncheckedUpdateManyWithoutUnitInputSchema: z.ZodType<Prisma.ServiceUncheckedUpdateManyWithoutUnitInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  vendorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  categoryId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  imageUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  basePrice: z.union([ z.union([z.number(),z.string(),z.instanceof(Prisma.Decimal),DecimalJsLikeSchema,]).refine((v) => isValidDecimalInput(v), { message: 'Must be a Decimal' }),z.lazy(() => DecimalFieldUpdateOperationsInputSchema) ]).optional(),
  isActive: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  dynamicAttributes: z.union([ z.lazy(() => NullableJsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
}).strict();

export const ServiceMetadataCreateManyServiceInputSchema: z.ZodType<Prisma.ServiceMetadataCreateManyServiceInput> = z.object({
  id: z.uuid().optional(),
  key: z.string(),
  value: z.string(),
}).strict();

export const ServiceSlotCreateManyServiceInputSchema: z.ZodType<Prisma.ServiceSlotCreateManyServiceInput> = z.object({
  id: z.uuid().optional(),
  bookingId: z.string().optional().nullable(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  status: z.lazy(() => SlotStatusSchema).optional(),
  isRecurring: z.boolean().optional(),
}).strict();

export const BookingCreateManyServiceInputSchema: z.ZodType<Prisma.BookingCreateManyServiceInput> = z.object({
  id: z.uuid().optional(),
  customerId: z.string(),
  status: z.lazy(() => BookingStatusSchema).optional(),
  scheduledDate: z.coerce.date(),
}).strict();

export const ServiceMetadataUpdateWithoutServiceInputSchema: z.ZodType<Prisma.ServiceMetadataUpdateWithoutServiceInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  key: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ServiceMetadataUncheckedUpdateWithoutServiceInputSchema: z.ZodType<Prisma.ServiceMetadataUncheckedUpdateWithoutServiceInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  key: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ServiceMetadataUncheckedUpdateManyWithoutServiceInputSchema: z.ZodType<Prisma.ServiceMetadataUncheckedUpdateManyWithoutServiceInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  key: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  value: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ServiceSlotUpdateWithoutServiceInputSchema: z.ZodType<Prisma.ServiceSlotUpdateWithoutServiceInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => SlotStatusSchema), z.lazy(() => EnumSlotStatusFieldUpdateOperationsInputSchema) ]).optional(),
  isRecurring: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  booking: z.lazy(() => BookingUpdateOneWithoutSlotsNestedInputSchema).optional(),
}).strict();

export const ServiceSlotUncheckedUpdateWithoutServiceInputSchema: z.ZodType<Prisma.ServiceSlotUncheckedUpdateWithoutServiceInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  bookingId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => SlotStatusSchema), z.lazy(() => EnumSlotStatusFieldUpdateOperationsInputSchema) ]).optional(),
  isRecurring: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ServiceSlotUncheckedUpdateManyWithoutServiceInputSchema: z.ZodType<Prisma.ServiceSlotUncheckedUpdateManyWithoutServiceInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  bookingId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => SlotStatusSchema), z.lazy(() => EnumSlotStatusFieldUpdateOperationsInputSchema) ]).optional(),
  isRecurring: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BookingUpdateWithoutServiceInputSchema: z.ZodType<Prisma.BookingUpdateWithoutServiceInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => BookingStatusSchema), z.lazy(() => EnumBookingStatusFieldUpdateOperationsInputSchema) ]).optional(),
  scheduledDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  customer: z.lazy(() => UserUpdateOneRequiredWithoutBookingsNestedInputSchema).optional(),
  details: z.lazy(() => BookingDetailsUpdateOneWithoutBookingNestedInputSchema).optional(),
  payment: z.lazy(() => PaymentUpdateOneWithoutBookingNestedInputSchema).optional(),
  slots: z.lazy(() => ServiceSlotUpdateManyWithoutBookingNestedInputSchema).optional(),
}).strict();

export const BookingUncheckedUpdateWithoutServiceInputSchema: z.ZodType<Prisma.BookingUncheckedUpdateWithoutServiceInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => BookingStatusSchema), z.lazy(() => EnumBookingStatusFieldUpdateOperationsInputSchema) ]).optional(),
  scheduledDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  details: z.lazy(() => BookingDetailsUncheckedUpdateOneWithoutBookingNestedInputSchema).optional(),
  payment: z.lazy(() => PaymentUncheckedUpdateOneWithoutBookingNestedInputSchema).optional(),
  slots: z.lazy(() => ServiceSlotUncheckedUpdateManyWithoutBookingNestedInputSchema).optional(),
}).strict();

export const BookingUncheckedUpdateManyWithoutServiceInputSchema: z.ZodType<Prisma.BookingUncheckedUpdateManyWithoutServiceInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  customerId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => BookingStatusSchema), z.lazy(() => EnumBookingStatusFieldUpdateOperationsInputSchema) ]).optional(),
  scheduledDate: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ServiceSlotCreateManyBookingInputSchema: z.ZodType<Prisma.ServiceSlotCreateManyBookingInput> = z.object({
  id: z.uuid().optional(),
  serviceId: z.string(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  status: z.lazy(() => SlotStatusSchema).optional(),
  isRecurring: z.boolean().optional(),
}).strict();

export const ServiceSlotUpdateWithoutBookingInputSchema: z.ZodType<Prisma.ServiceSlotUpdateWithoutBookingInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => SlotStatusSchema), z.lazy(() => EnumSlotStatusFieldUpdateOperationsInputSchema) ]).optional(),
  isRecurring: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  service: z.lazy(() => ServiceUpdateOneRequiredWithoutSlotsNestedInputSchema).optional(),
}).strict();

export const ServiceSlotUncheckedUpdateWithoutBookingInputSchema: z.ZodType<Prisma.ServiceSlotUncheckedUpdateWithoutBookingInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => SlotStatusSchema), z.lazy(() => EnumSlotStatusFieldUpdateOperationsInputSchema) ]).optional(),
  isRecurring: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ServiceSlotUncheckedUpdateManyWithoutBookingInputSchema: z.ZodType<Prisma.ServiceSlotUncheckedUpdateManyWithoutBookingInput> = z.object({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  serviceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  startTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  endTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => SlotStatusSchema), z.lazy(() => EnumSlotStatusFieldUpdateOperationsInputSchema) ]).optional(),
  isRecurring: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z.object({
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z.object({
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithAggregationInputSchema.array(), UserOrderByWithAggregationInputSchema ]).optional(),
  by: UserScalarFieldEnumSchema.array(), 
  having: UserScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const UserFindUniqueArgsSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema, 
}).strict();

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema, 
}).strict();

export const MessageFindFirstArgsSchema: z.ZodType<Prisma.MessageFindFirstArgs> = z.object({
  select: MessageSelectSchema.optional(),
  include: MessageIncludeSchema.optional(),
  where: MessageWhereInputSchema.optional(), 
  orderBy: z.union([ MessageOrderByWithRelationInputSchema.array(), MessageOrderByWithRelationInputSchema ]).optional(),
  cursor: MessageWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MessageScalarFieldEnumSchema, MessageScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const MessageFindFirstOrThrowArgsSchema: z.ZodType<Prisma.MessageFindFirstOrThrowArgs> = z.object({
  select: MessageSelectSchema.optional(),
  include: MessageIncludeSchema.optional(),
  where: MessageWhereInputSchema.optional(), 
  orderBy: z.union([ MessageOrderByWithRelationInputSchema.array(), MessageOrderByWithRelationInputSchema ]).optional(),
  cursor: MessageWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MessageScalarFieldEnumSchema, MessageScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const MessageFindManyArgsSchema: z.ZodType<Prisma.MessageFindManyArgs> = z.object({
  select: MessageSelectSchema.optional(),
  include: MessageIncludeSchema.optional(),
  where: MessageWhereInputSchema.optional(), 
  orderBy: z.union([ MessageOrderByWithRelationInputSchema.array(), MessageOrderByWithRelationInputSchema ]).optional(),
  cursor: MessageWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MessageScalarFieldEnumSchema, MessageScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const MessageAggregateArgsSchema: z.ZodType<Prisma.MessageAggregateArgs> = z.object({
  where: MessageWhereInputSchema.optional(), 
  orderBy: z.union([ MessageOrderByWithRelationInputSchema.array(), MessageOrderByWithRelationInputSchema ]).optional(),
  cursor: MessageWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const MessageGroupByArgsSchema: z.ZodType<Prisma.MessageGroupByArgs> = z.object({
  where: MessageWhereInputSchema.optional(), 
  orderBy: z.union([ MessageOrderByWithAggregationInputSchema.array(), MessageOrderByWithAggregationInputSchema ]).optional(),
  by: MessageScalarFieldEnumSchema.array(), 
  having: MessageScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const MessageFindUniqueArgsSchema: z.ZodType<Prisma.MessageFindUniqueArgs> = z.object({
  select: MessageSelectSchema.optional(),
  include: MessageIncludeSchema.optional(),
  where: MessageWhereUniqueInputSchema, 
}).strict();

export const MessageFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.MessageFindUniqueOrThrowArgs> = z.object({
  select: MessageSelectSchema.optional(),
  include: MessageIncludeSchema.optional(),
  where: MessageWhereUniqueInputSchema, 
}).strict();

export const MediaFindFirstArgsSchema: z.ZodType<Prisma.MediaFindFirstArgs> = z.object({
  select: MediaSelectSchema.optional(),
  include: MediaIncludeSchema.optional(),
  where: MediaWhereInputSchema.optional(), 
  orderBy: z.union([ MediaOrderByWithRelationInputSchema.array(), MediaOrderByWithRelationInputSchema ]).optional(),
  cursor: MediaWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MediaScalarFieldEnumSchema, MediaScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const MediaFindFirstOrThrowArgsSchema: z.ZodType<Prisma.MediaFindFirstOrThrowArgs> = z.object({
  select: MediaSelectSchema.optional(),
  include: MediaIncludeSchema.optional(),
  where: MediaWhereInputSchema.optional(), 
  orderBy: z.union([ MediaOrderByWithRelationInputSchema.array(), MediaOrderByWithRelationInputSchema ]).optional(),
  cursor: MediaWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MediaScalarFieldEnumSchema, MediaScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const MediaFindManyArgsSchema: z.ZodType<Prisma.MediaFindManyArgs> = z.object({
  select: MediaSelectSchema.optional(),
  include: MediaIncludeSchema.optional(),
  where: MediaWhereInputSchema.optional(), 
  orderBy: z.union([ MediaOrderByWithRelationInputSchema.array(), MediaOrderByWithRelationInputSchema ]).optional(),
  cursor: MediaWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ MediaScalarFieldEnumSchema, MediaScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const MediaAggregateArgsSchema: z.ZodType<Prisma.MediaAggregateArgs> = z.object({
  where: MediaWhereInputSchema.optional(), 
  orderBy: z.union([ MediaOrderByWithRelationInputSchema.array(), MediaOrderByWithRelationInputSchema ]).optional(),
  cursor: MediaWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const MediaGroupByArgsSchema: z.ZodType<Prisma.MediaGroupByArgs> = z.object({
  where: MediaWhereInputSchema.optional(), 
  orderBy: z.union([ MediaOrderByWithAggregationInputSchema.array(), MediaOrderByWithAggregationInputSchema ]).optional(),
  by: MediaScalarFieldEnumSchema.array(), 
  having: MediaScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const MediaFindUniqueArgsSchema: z.ZodType<Prisma.MediaFindUniqueArgs> = z.object({
  select: MediaSelectSchema.optional(),
  include: MediaIncludeSchema.optional(),
  where: MediaWhereUniqueInputSchema, 
}).strict();

export const MediaFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.MediaFindUniqueOrThrowArgs> = z.object({
  select: MediaSelectSchema.optional(),
  include: MediaIncludeSchema.optional(),
  where: MediaWhereUniqueInputSchema, 
}).strict();

export const ProfileFindFirstArgsSchema: z.ZodType<Prisma.ProfileFindFirstArgs> = z.object({
  select: ProfileSelectSchema.optional(),
  include: ProfileIncludeSchema.optional(),
  where: ProfileWhereInputSchema.optional(), 
  orderBy: z.union([ ProfileOrderByWithRelationInputSchema.array(), ProfileOrderByWithRelationInputSchema ]).optional(),
  cursor: ProfileWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProfileScalarFieldEnumSchema, ProfileScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ProfileFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ProfileFindFirstOrThrowArgs> = z.object({
  select: ProfileSelectSchema.optional(),
  include: ProfileIncludeSchema.optional(),
  where: ProfileWhereInputSchema.optional(), 
  orderBy: z.union([ ProfileOrderByWithRelationInputSchema.array(), ProfileOrderByWithRelationInputSchema ]).optional(),
  cursor: ProfileWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProfileScalarFieldEnumSchema, ProfileScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ProfileFindManyArgsSchema: z.ZodType<Prisma.ProfileFindManyArgs> = z.object({
  select: ProfileSelectSchema.optional(),
  include: ProfileIncludeSchema.optional(),
  where: ProfileWhereInputSchema.optional(), 
  orderBy: z.union([ ProfileOrderByWithRelationInputSchema.array(), ProfileOrderByWithRelationInputSchema ]).optional(),
  cursor: ProfileWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProfileScalarFieldEnumSchema, ProfileScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ProfileAggregateArgsSchema: z.ZodType<Prisma.ProfileAggregateArgs> = z.object({
  where: ProfileWhereInputSchema.optional(), 
  orderBy: z.union([ ProfileOrderByWithRelationInputSchema.array(), ProfileOrderByWithRelationInputSchema ]).optional(),
  cursor: ProfileWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const ProfileGroupByArgsSchema: z.ZodType<Prisma.ProfileGroupByArgs> = z.object({
  where: ProfileWhereInputSchema.optional(), 
  orderBy: z.union([ ProfileOrderByWithAggregationInputSchema.array(), ProfileOrderByWithAggregationInputSchema ]).optional(),
  by: ProfileScalarFieldEnumSchema.array(), 
  having: ProfileScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const ProfileFindUniqueArgsSchema: z.ZodType<Prisma.ProfileFindUniqueArgs> = z.object({
  select: ProfileSelectSchema.optional(),
  include: ProfileIncludeSchema.optional(),
  where: ProfileWhereUniqueInputSchema, 
}).strict();

export const ProfileFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ProfileFindUniqueOrThrowArgs> = z.object({
  select: ProfileSelectSchema.optional(),
  include: ProfileIncludeSchema.optional(),
  where: ProfileWhereUniqueInputSchema, 
}).strict();

export const PortfolioItemFindFirstArgsSchema: z.ZodType<Prisma.PortfolioItemFindFirstArgs> = z.object({
  select: PortfolioItemSelectSchema.optional(),
  include: PortfolioItemIncludeSchema.optional(),
  where: PortfolioItemWhereInputSchema.optional(), 
  orderBy: z.union([ PortfolioItemOrderByWithRelationInputSchema.array(), PortfolioItemOrderByWithRelationInputSchema ]).optional(),
  cursor: PortfolioItemWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PortfolioItemScalarFieldEnumSchema, PortfolioItemScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const PortfolioItemFindFirstOrThrowArgsSchema: z.ZodType<Prisma.PortfolioItemFindFirstOrThrowArgs> = z.object({
  select: PortfolioItemSelectSchema.optional(),
  include: PortfolioItemIncludeSchema.optional(),
  where: PortfolioItemWhereInputSchema.optional(), 
  orderBy: z.union([ PortfolioItemOrderByWithRelationInputSchema.array(), PortfolioItemOrderByWithRelationInputSchema ]).optional(),
  cursor: PortfolioItemWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PortfolioItemScalarFieldEnumSchema, PortfolioItemScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const PortfolioItemFindManyArgsSchema: z.ZodType<Prisma.PortfolioItemFindManyArgs> = z.object({
  select: PortfolioItemSelectSchema.optional(),
  include: PortfolioItemIncludeSchema.optional(),
  where: PortfolioItemWhereInputSchema.optional(), 
  orderBy: z.union([ PortfolioItemOrderByWithRelationInputSchema.array(), PortfolioItemOrderByWithRelationInputSchema ]).optional(),
  cursor: PortfolioItemWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PortfolioItemScalarFieldEnumSchema, PortfolioItemScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const PortfolioItemAggregateArgsSchema: z.ZodType<Prisma.PortfolioItemAggregateArgs> = z.object({
  where: PortfolioItemWhereInputSchema.optional(), 
  orderBy: z.union([ PortfolioItemOrderByWithRelationInputSchema.array(), PortfolioItemOrderByWithRelationInputSchema ]).optional(),
  cursor: PortfolioItemWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const PortfolioItemGroupByArgsSchema: z.ZodType<Prisma.PortfolioItemGroupByArgs> = z.object({
  where: PortfolioItemWhereInputSchema.optional(), 
  orderBy: z.union([ PortfolioItemOrderByWithAggregationInputSchema.array(), PortfolioItemOrderByWithAggregationInputSchema ]).optional(),
  by: PortfolioItemScalarFieldEnumSchema.array(), 
  having: PortfolioItemScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const PortfolioItemFindUniqueArgsSchema: z.ZodType<Prisma.PortfolioItemFindUniqueArgs> = z.object({
  select: PortfolioItemSelectSchema.optional(),
  include: PortfolioItemIncludeSchema.optional(),
  where: PortfolioItemWhereUniqueInputSchema, 
}).strict();

export const PortfolioItemFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.PortfolioItemFindUniqueOrThrowArgs> = z.object({
  select: PortfolioItemSelectSchema.optional(),
  include: PortfolioItemIncludeSchema.optional(),
  where: PortfolioItemWhereUniqueInputSchema, 
}).strict();

export const CategoryFindFirstArgsSchema: z.ZodType<Prisma.CategoryFindFirstArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereInputSchema.optional(), 
  orderBy: z.union([ CategoryOrderByWithRelationInputSchema.array(), CategoryOrderByWithRelationInputSchema ]).optional(),
  cursor: CategoryWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CategoryScalarFieldEnumSchema, CategoryScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const CategoryFindFirstOrThrowArgsSchema: z.ZodType<Prisma.CategoryFindFirstOrThrowArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereInputSchema.optional(), 
  orderBy: z.union([ CategoryOrderByWithRelationInputSchema.array(), CategoryOrderByWithRelationInputSchema ]).optional(),
  cursor: CategoryWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CategoryScalarFieldEnumSchema, CategoryScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const CategoryFindManyArgsSchema: z.ZodType<Prisma.CategoryFindManyArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereInputSchema.optional(), 
  orderBy: z.union([ CategoryOrderByWithRelationInputSchema.array(), CategoryOrderByWithRelationInputSchema ]).optional(),
  cursor: CategoryWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CategoryScalarFieldEnumSchema, CategoryScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const CategoryAggregateArgsSchema: z.ZodType<Prisma.CategoryAggregateArgs> = z.object({
  where: CategoryWhereInputSchema.optional(), 
  orderBy: z.union([ CategoryOrderByWithRelationInputSchema.array(), CategoryOrderByWithRelationInputSchema ]).optional(),
  cursor: CategoryWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const CategoryGroupByArgsSchema: z.ZodType<Prisma.CategoryGroupByArgs> = z.object({
  where: CategoryWhereInputSchema.optional(), 
  orderBy: z.union([ CategoryOrderByWithAggregationInputSchema.array(), CategoryOrderByWithAggregationInputSchema ]).optional(),
  by: CategoryScalarFieldEnumSchema.array(), 
  having: CategoryScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const CategoryFindUniqueArgsSchema: z.ZodType<Prisma.CategoryFindUniqueArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereUniqueInputSchema, 
}).strict();

export const CategoryFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.CategoryFindUniqueOrThrowArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereUniqueInputSchema, 
}).strict();

export const ServiceUnitFindFirstArgsSchema: z.ZodType<Prisma.ServiceUnitFindFirstArgs> = z.object({
  select: ServiceUnitSelectSchema.optional(),
  include: ServiceUnitIncludeSchema.optional(),
  where: ServiceUnitWhereInputSchema.optional(), 
  orderBy: z.union([ ServiceUnitOrderByWithRelationInputSchema.array(), ServiceUnitOrderByWithRelationInputSchema ]).optional(),
  cursor: ServiceUnitWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ServiceUnitScalarFieldEnumSchema, ServiceUnitScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ServiceUnitFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ServiceUnitFindFirstOrThrowArgs> = z.object({
  select: ServiceUnitSelectSchema.optional(),
  include: ServiceUnitIncludeSchema.optional(),
  where: ServiceUnitWhereInputSchema.optional(), 
  orderBy: z.union([ ServiceUnitOrderByWithRelationInputSchema.array(), ServiceUnitOrderByWithRelationInputSchema ]).optional(),
  cursor: ServiceUnitWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ServiceUnitScalarFieldEnumSchema, ServiceUnitScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ServiceUnitFindManyArgsSchema: z.ZodType<Prisma.ServiceUnitFindManyArgs> = z.object({
  select: ServiceUnitSelectSchema.optional(),
  include: ServiceUnitIncludeSchema.optional(),
  where: ServiceUnitWhereInputSchema.optional(), 
  orderBy: z.union([ ServiceUnitOrderByWithRelationInputSchema.array(), ServiceUnitOrderByWithRelationInputSchema ]).optional(),
  cursor: ServiceUnitWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ServiceUnitScalarFieldEnumSchema, ServiceUnitScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ServiceUnitAggregateArgsSchema: z.ZodType<Prisma.ServiceUnitAggregateArgs> = z.object({
  where: ServiceUnitWhereInputSchema.optional(), 
  orderBy: z.union([ ServiceUnitOrderByWithRelationInputSchema.array(), ServiceUnitOrderByWithRelationInputSchema ]).optional(),
  cursor: ServiceUnitWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const ServiceUnitGroupByArgsSchema: z.ZodType<Prisma.ServiceUnitGroupByArgs> = z.object({
  where: ServiceUnitWhereInputSchema.optional(), 
  orderBy: z.union([ ServiceUnitOrderByWithAggregationInputSchema.array(), ServiceUnitOrderByWithAggregationInputSchema ]).optional(),
  by: ServiceUnitScalarFieldEnumSchema.array(), 
  having: ServiceUnitScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const ServiceUnitFindUniqueArgsSchema: z.ZodType<Prisma.ServiceUnitFindUniqueArgs> = z.object({
  select: ServiceUnitSelectSchema.optional(),
  include: ServiceUnitIncludeSchema.optional(),
  where: ServiceUnitWhereUniqueInputSchema, 
}).strict();

export const ServiceUnitFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ServiceUnitFindUniqueOrThrowArgs> = z.object({
  select: ServiceUnitSelectSchema.optional(),
  include: ServiceUnitIncludeSchema.optional(),
  where: ServiceUnitWhereUniqueInputSchema, 
}).strict();

export const ServiceFindFirstArgsSchema: z.ZodType<Prisma.ServiceFindFirstArgs> = z.object({
  select: ServiceSelectSchema.optional(),
  include: ServiceIncludeSchema.optional(),
  where: ServiceWhereInputSchema.optional(), 
  orderBy: z.union([ ServiceOrderByWithRelationInputSchema.array(), ServiceOrderByWithRelationInputSchema ]).optional(),
  cursor: ServiceWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ServiceScalarFieldEnumSchema, ServiceScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ServiceFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ServiceFindFirstOrThrowArgs> = z.object({
  select: ServiceSelectSchema.optional(),
  include: ServiceIncludeSchema.optional(),
  where: ServiceWhereInputSchema.optional(), 
  orderBy: z.union([ ServiceOrderByWithRelationInputSchema.array(), ServiceOrderByWithRelationInputSchema ]).optional(),
  cursor: ServiceWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ServiceScalarFieldEnumSchema, ServiceScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ServiceFindManyArgsSchema: z.ZodType<Prisma.ServiceFindManyArgs> = z.object({
  select: ServiceSelectSchema.optional(),
  include: ServiceIncludeSchema.optional(),
  where: ServiceWhereInputSchema.optional(), 
  orderBy: z.union([ ServiceOrderByWithRelationInputSchema.array(), ServiceOrderByWithRelationInputSchema ]).optional(),
  cursor: ServiceWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ServiceScalarFieldEnumSchema, ServiceScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ServiceAggregateArgsSchema: z.ZodType<Prisma.ServiceAggregateArgs> = z.object({
  where: ServiceWhereInputSchema.optional(), 
  orderBy: z.union([ ServiceOrderByWithRelationInputSchema.array(), ServiceOrderByWithRelationInputSchema ]).optional(),
  cursor: ServiceWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const ServiceGroupByArgsSchema: z.ZodType<Prisma.ServiceGroupByArgs> = z.object({
  where: ServiceWhereInputSchema.optional(), 
  orderBy: z.union([ ServiceOrderByWithAggregationInputSchema.array(), ServiceOrderByWithAggregationInputSchema ]).optional(),
  by: ServiceScalarFieldEnumSchema.array(), 
  having: ServiceScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const ServiceFindUniqueArgsSchema: z.ZodType<Prisma.ServiceFindUniqueArgs> = z.object({
  select: ServiceSelectSchema.optional(),
  include: ServiceIncludeSchema.optional(),
  where: ServiceWhereUniqueInputSchema, 
}).strict();

export const ServiceFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ServiceFindUniqueOrThrowArgs> = z.object({
  select: ServiceSelectSchema.optional(),
  include: ServiceIncludeSchema.optional(),
  where: ServiceWhereUniqueInputSchema, 
}).strict();

export const ServiceMetadataFindFirstArgsSchema: z.ZodType<Prisma.ServiceMetadataFindFirstArgs> = z.object({
  select: ServiceMetadataSelectSchema.optional(),
  include: ServiceMetadataIncludeSchema.optional(),
  where: ServiceMetadataWhereInputSchema.optional(), 
  orderBy: z.union([ ServiceMetadataOrderByWithRelationInputSchema.array(), ServiceMetadataOrderByWithRelationInputSchema ]).optional(),
  cursor: ServiceMetadataWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ServiceMetadataScalarFieldEnumSchema, ServiceMetadataScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ServiceMetadataFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ServiceMetadataFindFirstOrThrowArgs> = z.object({
  select: ServiceMetadataSelectSchema.optional(),
  include: ServiceMetadataIncludeSchema.optional(),
  where: ServiceMetadataWhereInputSchema.optional(), 
  orderBy: z.union([ ServiceMetadataOrderByWithRelationInputSchema.array(), ServiceMetadataOrderByWithRelationInputSchema ]).optional(),
  cursor: ServiceMetadataWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ServiceMetadataScalarFieldEnumSchema, ServiceMetadataScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ServiceMetadataFindManyArgsSchema: z.ZodType<Prisma.ServiceMetadataFindManyArgs> = z.object({
  select: ServiceMetadataSelectSchema.optional(),
  include: ServiceMetadataIncludeSchema.optional(),
  where: ServiceMetadataWhereInputSchema.optional(), 
  orderBy: z.union([ ServiceMetadataOrderByWithRelationInputSchema.array(), ServiceMetadataOrderByWithRelationInputSchema ]).optional(),
  cursor: ServiceMetadataWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ServiceMetadataScalarFieldEnumSchema, ServiceMetadataScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ServiceMetadataAggregateArgsSchema: z.ZodType<Prisma.ServiceMetadataAggregateArgs> = z.object({
  where: ServiceMetadataWhereInputSchema.optional(), 
  orderBy: z.union([ ServiceMetadataOrderByWithRelationInputSchema.array(), ServiceMetadataOrderByWithRelationInputSchema ]).optional(),
  cursor: ServiceMetadataWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const ServiceMetadataGroupByArgsSchema: z.ZodType<Prisma.ServiceMetadataGroupByArgs> = z.object({
  where: ServiceMetadataWhereInputSchema.optional(), 
  orderBy: z.union([ ServiceMetadataOrderByWithAggregationInputSchema.array(), ServiceMetadataOrderByWithAggregationInputSchema ]).optional(),
  by: ServiceMetadataScalarFieldEnumSchema.array(), 
  having: ServiceMetadataScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const ServiceMetadataFindUniqueArgsSchema: z.ZodType<Prisma.ServiceMetadataFindUniqueArgs> = z.object({
  select: ServiceMetadataSelectSchema.optional(),
  include: ServiceMetadataIncludeSchema.optional(),
  where: ServiceMetadataWhereUniqueInputSchema, 
}).strict();

export const ServiceMetadataFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ServiceMetadataFindUniqueOrThrowArgs> = z.object({
  select: ServiceMetadataSelectSchema.optional(),
  include: ServiceMetadataIncludeSchema.optional(),
  where: ServiceMetadataWhereUniqueInputSchema, 
}).strict();

export const BookingFindFirstArgsSchema: z.ZodType<Prisma.BookingFindFirstArgs> = z.object({
  select: BookingSelectSchema.optional(),
  include: BookingIncludeSchema.optional(),
  where: BookingWhereInputSchema.optional(), 
  orderBy: z.union([ BookingOrderByWithRelationInputSchema.array(), BookingOrderByWithRelationInputSchema ]).optional(),
  cursor: BookingWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ BookingScalarFieldEnumSchema, BookingScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const BookingFindFirstOrThrowArgsSchema: z.ZodType<Prisma.BookingFindFirstOrThrowArgs> = z.object({
  select: BookingSelectSchema.optional(),
  include: BookingIncludeSchema.optional(),
  where: BookingWhereInputSchema.optional(), 
  orderBy: z.union([ BookingOrderByWithRelationInputSchema.array(), BookingOrderByWithRelationInputSchema ]).optional(),
  cursor: BookingWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ BookingScalarFieldEnumSchema, BookingScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const BookingFindManyArgsSchema: z.ZodType<Prisma.BookingFindManyArgs> = z.object({
  select: BookingSelectSchema.optional(),
  include: BookingIncludeSchema.optional(),
  where: BookingWhereInputSchema.optional(), 
  orderBy: z.union([ BookingOrderByWithRelationInputSchema.array(), BookingOrderByWithRelationInputSchema ]).optional(),
  cursor: BookingWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ BookingScalarFieldEnumSchema, BookingScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const BookingAggregateArgsSchema: z.ZodType<Prisma.BookingAggregateArgs> = z.object({
  where: BookingWhereInputSchema.optional(), 
  orderBy: z.union([ BookingOrderByWithRelationInputSchema.array(), BookingOrderByWithRelationInputSchema ]).optional(),
  cursor: BookingWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const BookingGroupByArgsSchema: z.ZodType<Prisma.BookingGroupByArgs> = z.object({
  where: BookingWhereInputSchema.optional(), 
  orderBy: z.union([ BookingOrderByWithAggregationInputSchema.array(), BookingOrderByWithAggregationInputSchema ]).optional(),
  by: BookingScalarFieldEnumSchema.array(), 
  having: BookingScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const BookingFindUniqueArgsSchema: z.ZodType<Prisma.BookingFindUniqueArgs> = z.object({
  select: BookingSelectSchema.optional(),
  include: BookingIncludeSchema.optional(),
  where: BookingWhereUniqueInputSchema, 
}).strict();

export const BookingFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.BookingFindUniqueOrThrowArgs> = z.object({
  select: BookingSelectSchema.optional(),
  include: BookingIncludeSchema.optional(),
  where: BookingWhereUniqueInputSchema, 
}).strict();

export const BookingDetailsFindFirstArgsSchema: z.ZodType<Prisma.BookingDetailsFindFirstArgs> = z.object({
  select: BookingDetailsSelectSchema.optional(),
  include: BookingDetailsIncludeSchema.optional(),
  where: BookingDetailsWhereInputSchema.optional(), 
  orderBy: z.union([ BookingDetailsOrderByWithRelationInputSchema.array(), BookingDetailsOrderByWithRelationInputSchema ]).optional(),
  cursor: BookingDetailsWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ BookingDetailsScalarFieldEnumSchema, BookingDetailsScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const BookingDetailsFindFirstOrThrowArgsSchema: z.ZodType<Prisma.BookingDetailsFindFirstOrThrowArgs> = z.object({
  select: BookingDetailsSelectSchema.optional(),
  include: BookingDetailsIncludeSchema.optional(),
  where: BookingDetailsWhereInputSchema.optional(), 
  orderBy: z.union([ BookingDetailsOrderByWithRelationInputSchema.array(), BookingDetailsOrderByWithRelationInputSchema ]).optional(),
  cursor: BookingDetailsWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ BookingDetailsScalarFieldEnumSchema, BookingDetailsScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const BookingDetailsFindManyArgsSchema: z.ZodType<Prisma.BookingDetailsFindManyArgs> = z.object({
  select: BookingDetailsSelectSchema.optional(),
  include: BookingDetailsIncludeSchema.optional(),
  where: BookingDetailsWhereInputSchema.optional(), 
  orderBy: z.union([ BookingDetailsOrderByWithRelationInputSchema.array(), BookingDetailsOrderByWithRelationInputSchema ]).optional(),
  cursor: BookingDetailsWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ BookingDetailsScalarFieldEnumSchema, BookingDetailsScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const BookingDetailsAggregateArgsSchema: z.ZodType<Prisma.BookingDetailsAggregateArgs> = z.object({
  where: BookingDetailsWhereInputSchema.optional(), 
  orderBy: z.union([ BookingDetailsOrderByWithRelationInputSchema.array(), BookingDetailsOrderByWithRelationInputSchema ]).optional(),
  cursor: BookingDetailsWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const BookingDetailsGroupByArgsSchema: z.ZodType<Prisma.BookingDetailsGroupByArgs> = z.object({
  where: BookingDetailsWhereInputSchema.optional(), 
  orderBy: z.union([ BookingDetailsOrderByWithAggregationInputSchema.array(), BookingDetailsOrderByWithAggregationInputSchema ]).optional(),
  by: BookingDetailsScalarFieldEnumSchema.array(), 
  having: BookingDetailsScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const BookingDetailsFindUniqueArgsSchema: z.ZodType<Prisma.BookingDetailsFindUniqueArgs> = z.object({
  select: BookingDetailsSelectSchema.optional(),
  include: BookingDetailsIncludeSchema.optional(),
  where: BookingDetailsWhereUniqueInputSchema, 
}).strict();

export const BookingDetailsFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.BookingDetailsFindUniqueOrThrowArgs> = z.object({
  select: BookingDetailsSelectSchema.optional(),
  include: BookingDetailsIncludeSchema.optional(),
  where: BookingDetailsWhereUniqueInputSchema, 
}).strict();

export const ServiceSlotFindFirstArgsSchema: z.ZodType<Prisma.ServiceSlotFindFirstArgs> = z.object({
  select: ServiceSlotSelectSchema.optional(),
  include: ServiceSlotIncludeSchema.optional(),
  where: ServiceSlotWhereInputSchema.optional(), 
  orderBy: z.union([ ServiceSlotOrderByWithRelationInputSchema.array(), ServiceSlotOrderByWithRelationInputSchema ]).optional(),
  cursor: ServiceSlotWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ServiceSlotScalarFieldEnumSchema, ServiceSlotScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ServiceSlotFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ServiceSlotFindFirstOrThrowArgs> = z.object({
  select: ServiceSlotSelectSchema.optional(),
  include: ServiceSlotIncludeSchema.optional(),
  where: ServiceSlotWhereInputSchema.optional(), 
  orderBy: z.union([ ServiceSlotOrderByWithRelationInputSchema.array(), ServiceSlotOrderByWithRelationInputSchema ]).optional(),
  cursor: ServiceSlotWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ServiceSlotScalarFieldEnumSchema, ServiceSlotScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ServiceSlotFindManyArgsSchema: z.ZodType<Prisma.ServiceSlotFindManyArgs> = z.object({
  select: ServiceSlotSelectSchema.optional(),
  include: ServiceSlotIncludeSchema.optional(),
  where: ServiceSlotWhereInputSchema.optional(), 
  orderBy: z.union([ ServiceSlotOrderByWithRelationInputSchema.array(), ServiceSlotOrderByWithRelationInputSchema ]).optional(),
  cursor: ServiceSlotWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ServiceSlotScalarFieldEnumSchema, ServiceSlotScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ServiceSlotAggregateArgsSchema: z.ZodType<Prisma.ServiceSlotAggregateArgs> = z.object({
  where: ServiceSlotWhereInputSchema.optional(), 
  orderBy: z.union([ ServiceSlotOrderByWithRelationInputSchema.array(), ServiceSlotOrderByWithRelationInputSchema ]).optional(),
  cursor: ServiceSlotWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const ServiceSlotGroupByArgsSchema: z.ZodType<Prisma.ServiceSlotGroupByArgs> = z.object({
  where: ServiceSlotWhereInputSchema.optional(), 
  orderBy: z.union([ ServiceSlotOrderByWithAggregationInputSchema.array(), ServiceSlotOrderByWithAggregationInputSchema ]).optional(),
  by: ServiceSlotScalarFieldEnumSchema.array(), 
  having: ServiceSlotScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const ServiceSlotFindUniqueArgsSchema: z.ZodType<Prisma.ServiceSlotFindUniqueArgs> = z.object({
  select: ServiceSlotSelectSchema.optional(),
  include: ServiceSlotIncludeSchema.optional(),
  where: ServiceSlotWhereUniqueInputSchema, 
}).strict();

export const ServiceSlotFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ServiceSlotFindUniqueOrThrowArgs> = z.object({
  select: ServiceSlotSelectSchema.optional(),
  include: ServiceSlotIncludeSchema.optional(),
  where: ServiceSlotWhereUniqueInputSchema, 
}).strict();

export const PaymentFindFirstArgsSchema: z.ZodType<Prisma.PaymentFindFirstArgs> = z.object({
  select: PaymentSelectSchema.optional(),
  include: PaymentIncludeSchema.optional(),
  where: PaymentWhereInputSchema.optional(), 
  orderBy: z.union([ PaymentOrderByWithRelationInputSchema.array(), PaymentOrderByWithRelationInputSchema ]).optional(),
  cursor: PaymentWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PaymentScalarFieldEnumSchema, PaymentScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const PaymentFindFirstOrThrowArgsSchema: z.ZodType<Prisma.PaymentFindFirstOrThrowArgs> = z.object({
  select: PaymentSelectSchema.optional(),
  include: PaymentIncludeSchema.optional(),
  where: PaymentWhereInputSchema.optional(), 
  orderBy: z.union([ PaymentOrderByWithRelationInputSchema.array(), PaymentOrderByWithRelationInputSchema ]).optional(),
  cursor: PaymentWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PaymentScalarFieldEnumSchema, PaymentScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const PaymentFindManyArgsSchema: z.ZodType<Prisma.PaymentFindManyArgs> = z.object({
  select: PaymentSelectSchema.optional(),
  include: PaymentIncludeSchema.optional(),
  where: PaymentWhereInputSchema.optional(), 
  orderBy: z.union([ PaymentOrderByWithRelationInputSchema.array(), PaymentOrderByWithRelationInputSchema ]).optional(),
  cursor: PaymentWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PaymentScalarFieldEnumSchema, PaymentScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const PaymentAggregateArgsSchema: z.ZodType<Prisma.PaymentAggregateArgs> = z.object({
  where: PaymentWhereInputSchema.optional(), 
  orderBy: z.union([ PaymentOrderByWithRelationInputSchema.array(), PaymentOrderByWithRelationInputSchema ]).optional(),
  cursor: PaymentWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const PaymentGroupByArgsSchema: z.ZodType<Prisma.PaymentGroupByArgs> = z.object({
  where: PaymentWhereInputSchema.optional(), 
  orderBy: z.union([ PaymentOrderByWithAggregationInputSchema.array(), PaymentOrderByWithAggregationInputSchema ]).optional(),
  by: PaymentScalarFieldEnumSchema.array(), 
  having: PaymentScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const PaymentFindUniqueArgsSchema: z.ZodType<Prisma.PaymentFindUniqueArgs> = z.object({
  select: PaymentSelectSchema.optional(),
  include: PaymentIncludeSchema.optional(),
  where: PaymentWhereUniqueInputSchema, 
}).strict();

export const PaymentFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.PaymentFindUniqueOrThrowArgs> = z.object({
  select: PaymentSelectSchema.optional(),
  include: PaymentIncludeSchema.optional(),
  where: PaymentWhereUniqueInputSchema, 
}).strict();

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserCreateInputSchema, UserUncheckedCreateInputSchema ]),
}).strict();

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema, 
  create: z.union([ UserCreateInputSchema, UserUncheckedCreateInputSchema ]),
  update: z.union([ UserUpdateInputSchema, UserUncheckedUpdateInputSchema ]),
}).strict();

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema, UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const UserCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserCreateManyAndReturnArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema, UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema, 
}).strict();

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserUpdateInputSchema, UserUncheckedUpdateInputSchema ]),
  where: UserWhereUniqueInputSchema, 
}).strict();

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema, UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const UserUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.UserUpdateManyAndReturnArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema, UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z.object({
  where: UserWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const MessageCreateArgsSchema: z.ZodType<Prisma.MessageCreateArgs> = z.object({
  select: MessageSelectSchema.optional(),
  include: MessageIncludeSchema.optional(),
  data: z.union([ MessageCreateInputSchema, MessageUncheckedCreateInputSchema ]),
}).strict();

export const MessageUpsertArgsSchema: z.ZodType<Prisma.MessageUpsertArgs> = z.object({
  select: MessageSelectSchema.optional(),
  include: MessageIncludeSchema.optional(),
  where: MessageWhereUniqueInputSchema, 
  create: z.union([ MessageCreateInputSchema, MessageUncheckedCreateInputSchema ]),
  update: z.union([ MessageUpdateInputSchema, MessageUncheckedUpdateInputSchema ]),
}).strict();

export const MessageCreateManyArgsSchema: z.ZodType<Prisma.MessageCreateManyArgs> = z.object({
  data: z.union([ MessageCreateManyInputSchema, MessageCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const MessageCreateManyAndReturnArgsSchema: z.ZodType<Prisma.MessageCreateManyAndReturnArgs> = z.object({
  data: z.union([ MessageCreateManyInputSchema, MessageCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const MessageDeleteArgsSchema: z.ZodType<Prisma.MessageDeleteArgs> = z.object({
  select: MessageSelectSchema.optional(),
  include: MessageIncludeSchema.optional(),
  where: MessageWhereUniqueInputSchema, 
}).strict();

export const MessageUpdateArgsSchema: z.ZodType<Prisma.MessageUpdateArgs> = z.object({
  select: MessageSelectSchema.optional(),
  include: MessageIncludeSchema.optional(),
  data: z.union([ MessageUpdateInputSchema, MessageUncheckedUpdateInputSchema ]),
  where: MessageWhereUniqueInputSchema, 
}).strict();

export const MessageUpdateManyArgsSchema: z.ZodType<Prisma.MessageUpdateManyArgs> = z.object({
  data: z.union([ MessageUpdateManyMutationInputSchema, MessageUncheckedUpdateManyInputSchema ]),
  where: MessageWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const MessageUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.MessageUpdateManyAndReturnArgs> = z.object({
  data: z.union([ MessageUpdateManyMutationInputSchema, MessageUncheckedUpdateManyInputSchema ]),
  where: MessageWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const MessageDeleteManyArgsSchema: z.ZodType<Prisma.MessageDeleteManyArgs> = z.object({
  where: MessageWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const MediaCreateArgsSchema: z.ZodType<Prisma.MediaCreateArgs> = z.object({
  select: MediaSelectSchema.optional(),
  include: MediaIncludeSchema.optional(),
  data: z.union([ MediaCreateInputSchema, MediaUncheckedCreateInputSchema ]),
}).strict();

export const MediaUpsertArgsSchema: z.ZodType<Prisma.MediaUpsertArgs> = z.object({
  select: MediaSelectSchema.optional(),
  include: MediaIncludeSchema.optional(),
  where: MediaWhereUniqueInputSchema, 
  create: z.union([ MediaCreateInputSchema, MediaUncheckedCreateInputSchema ]),
  update: z.union([ MediaUpdateInputSchema, MediaUncheckedUpdateInputSchema ]),
}).strict();

export const MediaCreateManyArgsSchema: z.ZodType<Prisma.MediaCreateManyArgs> = z.object({
  data: z.union([ MediaCreateManyInputSchema, MediaCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const MediaCreateManyAndReturnArgsSchema: z.ZodType<Prisma.MediaCreateManyAndReturnArgs> = z.object({
  data: z.union([ MediaCreateManyInputSchema, MediaCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const MediaDeleteArgsSchema: z.ZodType<Prisma.MediaDeleteArgs> = z.object({
  select: MediaSelectSchema.optional(),
  include: MediaIncludeSchema.optional(),
  where: MediaWhereUniqueInputSchema, 
}).strict();

export const MediaUpdateArgsSchema: z.ZodType<Prisma.MediaUpdateArgs> = z.object({
  select: MediaSelectSchema.optional(),
  include: MediaIncludeSchema.optional(),
  data: z.union([ MediaUpdateInputSchema, MediaUncheckedUpdateInputSchema ]),
  where: MediaWhereUniqueInputSchema, 
}).strict();

export const MediaUpdateManyArgsSchema: z.ZodType<Prisma.MediaUpdateManyArgs> = z.object({
  data: z.union([ MediaUpdateManyMutationInputSchema, MediaUncheckedUpdateManyInputSchema ]),
  where: MediaWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const MediaUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.MediaUpdateManyAndReturnArgs> = z.object({
  data: z.union([ MediaUpdateManyMutationInputSchema, MediaUncheckedUpdateManyInputSchema ]),
  where: MediaWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const MediaDeleteManyArgsSchema: z.ZodType<Prisma.MediaDeleteManyArgs> = z.object({
  where: MediaWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ProfileCreateArgsSchema: z.ZodType<Prisma.ProfileCreateArgs> = z.object({
  select: ProfileSelectSchema.optional(),
  include: ProfileIncludeSchema.optional(),
  data: z.union([ ProfileCreateInputSchema, ProfileUncheckedCreateInputSchema ]),
}).strict();

export const ProfileUpsertArgsSchema: z.ZodType<Prisma.ProfileUpsertArgs> = z.object({
  select: ProfileSelectSchema.optional(),
  include: ProfileIncludeSchema.optional(),
  where: ProfileWhereUniqueInputSchema, 
  create: z.union([ ProfileCreateInputSchema, ProfileUncheckedCreateInputSchema ]),
  update: z.union([ ProfileUpdateInputSchema, ProfileUncheckedUpdateInputSchema ]),
}).strict();

export const ProfileCreateManyArgsSchema: z.ZodType<Prisma.ProfileCreateManyArgs> = z.object({
  data: z.union([ ProfileCreateManyInputSchema, ProfileCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const ProfileCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ProfileCreateManyAndReturnArgs> = z.object({
  data: z.union([ ProfileCreateManyInputSchema, ProfileCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const ProfileDeleteArgsSchema: z.ZodType<Prisma.ProfileDeleteArgs> = z.object({
  select: ProfileSelectSchema.optional(),
  include: ProfileIncludeSchema.optional(),
  where: ProfileWhereUniqueInputSchema, 
}).strict();

export const ProfileUpdateArgsSchema: z.ZodType<Prisma.ProfileUpdateArgs> = z.object({
  select: ProfileSelectSchema.optional(),
  include: ProfileIncludeSchema.optional(),
  data: z.union([ ProfileUpdateInputSchema, ProfileUncheckedUpdateInputSchema ]),
  where: ProfileWhereUniqueInputSchema, 
}).strict();

export const ProfileUpdateManyArgsSchema: z.ZodType<Prisma.ProfileUpdateManyArgs> = z.object({
  data: z.union([ ProfileUpdateManyMutationInputSchema, ProfileUncheckedUpdateManyInputSchema ]),
  where: ProfileWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ProfileUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.ProfileUpdateManyAndReturnArgs> = z.object({
  data: z.union([ ProfileUpdateManyMutationInputSchema, ProfileUncheckedUpdateManyInputSchema ]),
  where: ProfileWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ProfileDeleteManyArgsSchema: z.ZodType<Prisma.ProfileDeleteManyArgs> = z.object({
  where: ProfileWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const PortfolioItemCreateArgsSchema: z.ZodType<Prisma.PortfolioItemCreateArgs> = z.object({
  select: PortfolioItemSelectSchema.optional(),
  include: PortfolioItemIncludeSchema.optional(),
  data: z.union([ PortfolioItemCreateInputSchema, PortfolioItemUncheckedCreateInputSchema ]),
}).strict();

export const PortfolioItemUpsertArgsSchema: z.ZodType<Prisma.PortfolioItemUpsertArgs> = z.object({
  select: PortfolioItemSelectSchema.optional(),
  include: PortfolioItemIncludeSchema.optional(),
  where: PortfolioItemWhereUniqueInputSchema, 
  create: z.union([ PortfolioItemCreateInputSchema, PortfolioItemUncheckedCreateInputSchema ]),
  update: z.union([ PortfolioItemUpdateInputSchema, PortfolioItemUncheckedUpdateInputSchema ]),
}).strict();

export const PortfolioItemCreateManyArgsSchema: z.ZodType<Prisma.PortfolioItemCreateManyArgs> = z.object({
  data: z.union([ PortfolioItemCreateManyInputSchema, PortfolioItemCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const PortfolioItemCreateManyAndReturnArgsSchema: z.ZodType<Prisma.PortfolioItemCreateManyAndReturnArgs> = z.object({
  data: z.union([ PortfolioItemCreateManyInputSchema, PortfolioItemCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const PortfolioItemDeleteArgsSchema: z.ZodType<Prisma.PortfolioItemDeleteArgs> = z.object({
  select: PortfolioItemSelectSchema.optional(),
  include: PortfolioItemIncludeSchema.optional(),
  where: PortfolioItemWhereUniqueInputSchema, 
}).strict();

export const PortfolioItemUpdateArgsSchema: z.ZodType<Prisma.PortfolioItemUpdateArgs> = z.object({
  select: PortfolioItemSelectSchema.optional(),
  include: PortfolioItemIncludeSchema.optional(),
  data: z.union([ PortfolioItemUpdateInputSchema, PortfolioItemUncheckedUpdateInputSchema ]),
  where: PortfolioItemWhereUniqueInputSchema, 
}).strict();

export const PortfolioItemUpdateManyArgsSchema: z.ZodType<Prisma.PortfolioItemUpdateManyArgs> = z.object({
  data: z.union([ PortfolioItemUpdateManyMutationInputSchema, PortfolioItemUncheckedUpdateManyInputSchema ]),
  where: PortfolioItemWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const PortfolioItemUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.PortfolioItemUpdateManyAndReturnArgs> = z.object({
  data: z.union([ PortfolioItemUpdateManyMutationInputSchema, PortfolioItemUncheckedUpdateManyInputSchema ]),
  where: PortfolioItemWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const PortfolioItemDeleteManyArgsSchema: z.ZodType<Prisma.PortfolioItemDeleteManyArgs> = z.object({
  where: PortfolioItemWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const CategoryCreateArgsSchema: z.ZodType<Prisma.CategoryCreateArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  data: z.union([ CategoryCreateInputSchema, CategoryUncheckedCreateInputSchema ]),
}).strict();

export const CategoryUpsertArgsSchema: z.ZodType<Prisma.CategoryUpsertArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereUniqueInputSchema, 
  create: z.union([ CategoryCreateInputSchema, CategoryUncheckedCreateInputSchema ]),
  update: z.union([ CategoryUpdateInputSchema, CategoryUncheckedUpdateInputSchema ]),
}).strict();

export const CategoryCreateManyArgsSchema: z.ZodType<Prisma.CategoryCreateManyArgs> = z.object({
  data: z.union([ CategoryCreateManyInputSchema, CategoryCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const CategoryCreateManyAndReturnArgsSchema: z.ZodType<Prisma.CategoryCreateManyAndReturnArgs> = z.object({
  data: z.union([ CategoryCreateManyInputSchema, CategoryCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const CategoryDeleteArgsSchema: z.ZodType<Prisma.CategoryDeleteArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  where: CategoryWhereUniqueInputSchema, 
}).strict();

export const CategoryUpdateArgsSchema: z.ZodType<Prisma.CategoryUpdateArgs> = z.object({
  select: CategorySelectSchema.optional(),
  include: CategoryIncludeSchema.optional(),
  data: z.union([ CategoryUpdateInputSchema, CategoryUncheckedUpdateInputSchema ]),
  where: CategoryWhereUniqueInputSchema, 
}).strict();

export const CategoryUpdateManyArgsSchema: z.ZodType<Prisma.CategoryUpdateManyArgs> = z.object({
  data: z.union([ CategoryUpdateManyMutationInputSchema, CategoryUncheckedUpdateManyInputSchema ]),
  where: CategoryWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const CategoryUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.CategoryUpdateManyAndReturnArgs> = z.object({
  data: z.union([ CategoryUpdateManyMutationInputSchema, CategoryUncheckedUpdateManyInputSchema ]),
  where: CategoryWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const CategoryDeleteManyArgsSchema: z.ZodType<Prisma.CategoryDeleteManyArgs> = z.object({
  where: CategoryWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ServiceUnitCreateArgsSchema: z.ZodType<Prisma.ServiceUnitCreateArgs> = z.object({
  select: ServiceUnitSelectSchema.optional(),
  include: ServiceUnitIncludeSchema.optional(),
  data: z.union([ ServiceUnitCreateInputSchema, ServiceUnitUncheckedCreateInputSchema ]),
}).strict();

export const ServiceUnitUpsertArgsSchema: z.ZodType<Prisma.ServiceUnitUpsertArgs> = z.object({
  select: ServiceUnitSelectSchema.optional(),
  include: ServiceUnitIncludeSchema.optional(),
  where: ServiceUnitWhereUniqueInputSchema, 
  create: z.union([ ServiceUnitCreateInputSchema, ServiceUnitUncheckedCreateInputSchema ]),
  update: z.union([ ServiceUnitUpdateInputSchema, ServiceUnitUncheckedUpdateInputSchema ]),
}).strict();

export const ServiceUnitCreateManyArgsSchema: z.ZodType<Prisma.ServiceUnitCreateManyArgs> = z.object({
  data: z.union([ ServiceUnitCreateManyInputSchema, ServiceUnitCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const ServiceUnitCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ServiceUnitCreateManyAndReturnArgs> = z.object({
  data: z.union([ ServiceUnitCreateManyInputSchema, ServiceUnitCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const ServiceUnitDeleteArgsSchema: z.ZodType<Prisma.ServiceUnitDeleteArgs> = z.object({
  select: ServiceUnitSelectSchema.optional(),
  include: ServiceUnitIncludeSchema.optional(),
  where: ServiceUnitWhereUniqueInputSchema, 
}).strict();

export const ServiceUnitUpdateArgsSchema: z.ZodType<Prisma.ServiceUnitUpdateArgs> = z.object({
  select: ServiceUnitSelectSchema.optional(),
  include: ServiceUnitIncludeSchema.optional(),
  data: z.union([ ServiceUnitUpdateInputSchema, ServiceUnitUncheckedUpdateInputSchema ]),
  where: ServiceUnitWhereUniqueInputSchema, 
}).strict();

export const ServiceUnitUpdateManyArgsSchema: z.ZodType<Prisma.ServiceUnitUpdateManyArgs> = z.object({
  data: z.union([ ServiceUnitUpdateManyMutationInputSchema, ServiceUnitUncheckedUpdateManyInputSchema ]),
  where: ServiceUnitWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ServiceUnitUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.ServiceUnitUpdateManyAndReturnArgs> = z.object({
  data: z.union([ ServiceUnitUpdateManyMutationInputSchema, ServiceUnitUncheckedUpdateManyInputSchema ]),
  where: ServiceUnitWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ServiceUnitDeleteManyArgsSchema: z.ZodType<Prisma.ServiceUnitDeleteManyArgs> = z.object({
  where: ServiceUnitWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ServiceCreateArgsSchema: z.ZodType<Prisma.ServiceCreateArgs> = z.object({
  select: ServiceSelectSchema.optional(),
  include: ServiceIncludeSchema.optional(),
  data: z.union([ ServiceCreateInputSchema, ServiceUncheckedCreateInputSchema ]),
}).strict();

export const ServiceUpsertArgsSchema: z.ZodType<Prisma.ServiceUpsertArgs> = z.object({
  select: ServiceSelectSchema.optional(),
  include: ServiceIncludeSchema.optional(),
  where: ServiceWhereUniqueInputSchema, 
  create: z.union([ ServiceCreateInputSchema, ServiceUncheckedCreateInputSchema ]),
  update: z.union([ ServiceUpdateInputSchema, ServiceUncheckedUpdateInputSchema ]),
}).strict();

export const ServiceCreateManyArgsSchema: z.ZodType<Prisma.ServiceCreateManyArgs> = z.object({
  data: z.union([ ServiceCreateManyInputSchema, ServiceCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const ServiceCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ServiceCreateManyAndReturnArgs> = z.object({
  data: z.union([ ServiceCreateManyInputSchema, ServiceCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const ServiceDeleteArgsSchema: z.ZodType<Prisma.ServiceDeleteArgs> = z.object({
  select: ServiceSelectSchema.optional(),
  include: ServiceIncludeSchema.optional(),
  where: ServiceWhereUniqueInputSchema, 
}).strict();

export const ServiceUpdateArgsSchema: z.ZodType<Prisma.ServiceUpdateArgs> = z.object({
  select: ServiceSelectSchema.optional(),
  include: ServiceIncludeSchema.optional(),
  data: z.union([ ServiceUpdateInputSchema, ServiceUncheckedUpdateInputSchema ]),
  where: ServiceWhereUniqueInputSchema, 
}).strict();

export const ServiceUpdateManyArgsSchema: z.ZodType<Prisma.ServiceUpdateManyArgs> = z.object({
  data: z.union([ ServiceUpdateManyMutationInputSchema, ServiceUncheckedUpdateManyInputSchema ]),
  where: ServiceWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ServiceUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.ServiceUpdateManyAndReturnArgs> = z.object({
  data: z.union([ ServiceUpdateManyMutationInputSchema, ServiceUncheckedUpdateManyInputSchema ]),
  where: ServiceWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ServiceDeleteManyArgsSchema: z.ZodType<Prisma.ServiceDeleteManyArgs> = z.object({
  where: ServiceWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ServiceMetadataCreateArgsSchema: z.ZodType<Prisma.ServiceMetadataCreateArgs> = z.object({
  select: ServiceMetadataSelectSchema.optional(),
  include: ServiceMetadataIncludeSchema.optional(),
  data: z.union([ ServiceMetadataCreateInputSchema, ServiceMetadataUncheckedCreateInputSchema ]),
}).strict();

export const ServiceMetadataUpsertArgsSchema: z.ZodType<Prisma.ServiceMetadataUpsertArgs> = z.object({
  select: ServiceMetadataSelectSchema.optional(),
  include: ServiceMetadataIncludeSchema.optional(),
  where: ServiceMetadataWhereUniqueInputSchema, 
  create: z.union([ ServiceMetadataCreateInputSchema, ServiceMetadataUncheckedCreateInputSchema ]),
  update: z.union([ ServiceMetadataUpdateInputSchema, ServiceMetadataUncheckedUpdateInputSchema ]),
}).strict();

export const ServiceMetadataCreateManyArgsSchema: z.ZodType<Prisma.ServiceMetadataCreateManyArgs> = z.object({
  data: z.union([ ServiceMetadataCreateManyInputSchema, ServiceMetadataCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const ServiceMetadataCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ServiceMetadataCreateManyAndReturnArgs> = z.object({
  data: z.union([ ServiceMetadataCreateManyInputSchema, ServiceMetadataCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const ServiceMetadataDeleteArgsSchema: z.ZodType<Prisma.ServiceMetadataDeleteArgs> = z.object({
  select: ServiceMetadataSelectSchema.optional(),
  include: ServiceMetadataIncludeSchema.optional(),
  where: ServiceMetadataWhereUniqueInputSchema, 
}).strict();

export const ServiceMetadataUpdateArgsSchema: z.ZodType<Prisma.ServiceMetadataUpdateArgs> = z.object({
  select: ServiceMetadataSelectSchema.optional(),
  include: ServiceMetadataIncludeSchema.optional(),
  data: z.union([ ServiceMetadataUpdateInputSchema, ServiceMetadataUncheckedUpdateInputSchema ]),
  where: ServiceMetadataWhereUniqueInputSchema, 
}).strict();

export const ServiceMetadataUpdateManyArgsSchema: z.ZodType<Prisma.ServiceMetadataUpdateManyArgs> = z.object({
  data: z.union([ ServiceMetadataUpdateManyMutationInputSchema, ServiceMetadataUncheckedUpdateManyInputSchema ]),
  where: ServiceMetadataWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ServiceMetadataUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.ServiceMetadataUpdateManyAndReturnArgs> = z.object({
  data: z.union([ ServiceMetadataUpdateManyMutationInputSchema, ServiceMetadataUncheckedUpdateManyInputSchema ]),
  where: ServiceMetadataWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ServiceMetadataDeleteManyArgsSchema: z.ZodType<Prisma.ServiceMetadataDeleteManyArgs> = z.object({
  where: ServiceMetadataWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const BookingCreateArgsSchema: z.ZodType<Prisma.BookingCreateArgs> = z.object({
  select: BookingSelectSchema.optional(),
  include: BookingIncludeSchema.optional(),
  data: z.union([ BookingCreateInputSchema, BookingUncheckedCreateInputSchema ]),
}).strict();

export const BookingUpsertArgsSchema: z.ZodType<Prisma.BookingUpsertArgs> = z.object({
  select: BookingSelectSchema.optional(),
  include: BookingIncludeSchema.optional(),
  where: BookingWhereUniqueInputSchema, 
  create: z.union([ BookingCreateInputSchema, BookingUncheckedCreateInputSchema ]),
  update: z.union([ BookingUpdateInputSchema, BookingUncheckedUpdateInputSchema ]),
}).strict();

export const BookingCreateManyArgsSchema: z.ZodType<Prisma.BookingCreateManyArgs> = z.object({
  data: z.union([ BookingCreateManyInputSchema, BookingCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const BookingCreateManyAndReturnArgsSchema: z.ZodType<Prisma.BookingCreateManyAndReturnArgs> = z.object({
  data: z.union([ BookingCreateManyInputSchema, BookingCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const BookingDeleteArgsSchema: z.ZodType<Prisma.BookingDeleteArgs> = z.object({
  select: BookingSelectSchema.optional(),
  include: BookingIncludeSchema.optional(),
  where: BookingWhereUniqueInputSchema, 
}).strict();

export const BookingUpdateArgsSchema: z.ZodType<Prisma.BookingUpdateArgs> = z.object({
  select: BookingSelectSchema.optional(),
  include: BookingIncludeSchema.optional(),
  data: z.union([ BookingUpdateInputSchema, BookingUncheckedUpdateInputSchema ]),
  where: BookingWhereUniqueInputSchema, 
}).strict();

export const BookingUpdateManyArgsSchema: z.ZodType<Prisma.BookingUpdateManyArgs> = z.object({
  data: z.union([ BookingUpdateManyMutationInputSchema, BookingUncheckedUpdateManyInputSchema ]),
  where: BookingWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const BookingUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.BookingUpdateManyAndReturnArgs> = z.object({
  data: z.union([ BookingUpdateManyMutationInputSchema, BookingUncheckedUpdateManyInputSchema ]),
  where: BookingWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const BookingDeleteManyArgsSchema: z.ZodType<Prisma.BookingDeleteManyArgs> = z.object({
  where: BookingWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const BookingDetailsCreateArgsSchema: z.ZodType<Prisma.BookingDetailsCreateArgs> = z.object({
  select: BookingDetailsSelectSchema.optional(),
  include: BookingDetailsIncludeSchema.optional(),
  data: z.union([ BookingDetailsCreateInputSchema, BookingDetailsUncheckedCreateInputSchema ]),
}).strict();

export const BookingDetailsUpsertArgsSchema: z.ZodType<Prisma.BookingDetailsUpsertArgs> = z.object({
  select: BookingDetailsSelectSchema.optional(),
  include: BookingDetailsIncludeSchema.optional(),
  where: BookingDetailsWhereUniqueInputSchema, 
  create: z.union([ BookingDetailsCreateInputSchema, BookingDetailsUncheckedCreateInputSchema ]),
  update: z.union([ BookingDetailsUpdateInputSchema, BookingDetailsUncheckedUpdateInputSchema ]),
}).strict();

export const BookingDetailsCreateManyArgsSchema: z.ZodType<Prisma.BookingDetailsCreateManyArgs> = z.object({
  data: z.union([ BookingDetailsCreateManyInputSchema, BookingDetailsCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const BookingDetailsCreateManyAndReturnArgsSchema: z.ZodType<Prisma.BookingDetailsCreateManyAndReturnArgs> = z.object({
  data: z.union([ BookingDetailsCreateManyInputSchema, BookingDetailsCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const BookingDetailsDeleteArgsSchema: z.ZodType<Prisma.BookingDetailsDeleteArgs> = z.object({
  select: BookingDetailsSelectSchema.optional(),
  include: BookingDetailsIncludeSchema.optional(),
  where: BookingDetailsWhereUniqueInputSchema, 
}).strict();

export const BookingDetailsUpdateArgsSchema: z.ZodType<Prisma.BookingDetailsUpdateArgs> = z.object({
  select: BookingDetailsSelectSchema.optional(),
  include: BookingDetailsIncludeSchema.optional(),
  data: z.union([ BookingDetailsUpdateInputSchema, BookingDetailsUncheckedUpdateInputSchema ]),
  where: BookingDetailsWhereUniqueInputSchema, 
}).strict();

export const BookingDetailsUpdateManyArgsSchema: z.ZodType<Prisma.BookingDetailsUpdateManyArgs> = z.object({
  data: z.union([ BookingDetailsUpdateManyMutationInputSchema, BookingDetailsUncheckedUpdateManyInputSchema ]),
  where: BookingDetailsWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const BookingDetailsUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.BookingDetailsUpdateManyAndReturnArgs> = z.object({
  data: z.union([ BookingDetailsUpdateManyMutationInputSchema, BookingDetailsUncheckedUpdateManyInputSchema ]),
  where: BookingDetailsWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const BookingDetailsDeleteManyArgsSchema: z.ZodType<Prisma.BookingDetailsDeleteManyArgs> = z.object({
  where: BookingDetailsWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ServiceSlotCreateArgsSchema: z.ZodType<Prisma.ServiceSlotCreateArgs> = z.object({
  select: ServiceSlotSelectSchema.optional(),
  include: ServiceSlotIncludeSchema.optional(),
  data: z.union([ ServiceSlotCreateInputSchema, ServiceSlotUncheckedCreateInputSchema ]),
}).strict();

export const ServiceSlotUpsertArgsSchema: z.ZodType<Prisma.ServiceSlotUpsertArgs> = z.object({
  select: ServiceSlotSelectSchema.optional(),
  include: ServiceSlotIncludeSchema.optional(),
  where: ServiceSlotWhereUniqueInputSchema, 
  create: z.union([ ServiceSlotCreateInputSchema, ServiceSlotUncheckedCreateInputSchema ]),
  update: z.union([ ServiceSlotUpdateInputSchema, ServiceSlotUncheckedUpdateInputSchema ]),
}).strict();

export const ServiceSlotCreateManyArgsSchema: z.ZodType<Prisma.ServiceSlotCreateManyArgs> = z.object({
  data: z.union([ ServiceSlotCreateManyInputSchema, ServiceSlotCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const ServiceSlotCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ServiceSlotCreateManyAndReturnArgs> = z.object({
  data: z.union([ ServiceSlotCreateManyInputSchema, ServiceSlotCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const ServiceSlotDeleteArgsSchema: z.ZodType<Prisma.ServiceSlotDeleteArgs> = z.object({
  select: ServiceSlotSelectSchema.optional(),
  include: ServiceSlotIncludeSchema.optional(),
  where: ServiceSlotWhereUniqueInputSchema, 
}).strict();

export const ServiceSlotUpdateArgsSchema: z.ZodType<Prisma.ServiceSlotUpdateArgs> = z.object({
  select: ServiceSlotSelectSchema.optional(),
  include: ServiceSlotIncludeSchema.optional(),
  data: z.union([ ServiceSlotUpdateInputSchema, ServiceSlotUncheckedUpdateInputSchema ]),
  where: ServiceSlotWhereUniqueInputSchema, 
}).strict();

export const ServiceSlotUpdateManyArgsSchema: z.ZodType<Prisma.ServiceSlotUpdateManyArgs> = z.object({
  data: z.union([ ServiceSlotUpdateManyMutationInputSchema, ServiceSlotUncheckedUpdateManyInputSchema ]),
  where: ServiceSlotWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ServiceSlotUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.ServiceSlotUpdateManyAndReturnArgs> = z.object({
  data: z.union([ ServiceSlotUpdateManyMutationInputSchema, ServiceSlotUncheckedUpdateManyInputSchema ]),
  where: ServiceSlotWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ServiceSlotDeleteManyArgsSchema: z.ZodType<Prisma.ServiceSlotDeleteManyArgs> = z.object({
  where: ServiceSlotWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const PaymentCreateArgsSchema: z.ZodType<Prisma.PaymentCreateArgs> = z.object({
  select: PaymentSelectSchema.optional(),
  include: PaymentIncludeSchema.optional(),
  data: z.union([ PaymentCreateInputSchema, PaymentUncheckedCreateInputSchema ]),
}).strict();

export const PaymentUpsertArgsSchema: z.ZodType<Prisma.PaymentUpsertArgs> = z.object({
  select: PaymentSelectSchema.optional(),
  include: PaymentIncludeSchema.optional(),
  where: PaymentWhereUniqueInputSchema, 
  create: z.union([ PaymentCreateInputSchema, PaymentUncheckedCreateInputSchema ]),
  update: z.union([ PaymentUpdateInputSchema, PaymentUncheckedUpdateInputSchema ]),
}).strict();

export const PaymentCreateManyArgsSchema: z.ZodType<Prisma.PaymentCreateManyArgs> = z.object({
  data: z.union([ PaymentCreateManyInputSchema, PaymentCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const PaymentCreateManyAndReturnArgsSchema: z.ZodType<Prisma.PaymentCreateManyAndReturnArgs> = z.object({
  data: z.union([ PaymentCreateManyInputSchema, PaymentCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const PaymentDeleteArgsSchema: z.ZodType<Prisma.PaymentDeleteArgs> = z.object({
  select: PaymentSelectSchema.optional(),
  include: PaymentIncludeSchema.optional(),
  where: PaymentWhereUniqueInputSchema, 
}).strict();

export const PaymentUpdateArgsSchema: z.ZodType<Prisma.PaymentUpdateArgs> = z.object({
  select: PaymentSelectSchema.optional(),
  include: PaymentIncludeSchema.optional(),
  data: z.union([ PaymentUpdateInputSchema, PaymentUncheckedUpdateInputSchema ]),
  where: PaymentWhereUniqueInputSchema, 
}).strict();

export const PaymentUpdateManyArgsSchema: z.ZodType<Prisma.PaymentUpdateManyArgs> = z.object({
  data: z.union([ PaymentUpdateManyMutationInputSchema, PaymentUncheckedUpdateManyInputSchema ]),
  where: PaymentWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const PaymentUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.PaymentUpdateManyAndReturnArgs> = z.object({
  data: z.union([ PaymentUpdateManyMutationInputSchema, PaymentUncheckedUpdateManyInputSchema ]),
  where: PaymentWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const PaymentDeleteManyArgsSchema: z.ZodType<Prisma.PaymentDeleteManyArgs> = z.object({
  where: PaymentWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();