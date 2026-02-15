import { z } from 'zod';

/////////////////////////////////////////
// ENUMS COMUNES
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

// Business Enums
export const RoleSchema = z.enum(['ADMIN','VENDOR','CUSTOMER']);
export type RoleType = `${z.infer<typeof RoleSchema>}`

export const BookingStatusSchema = z.enum(['PENDING','ACTIVE','COMPLETED','CANCELLED']);
export type BookingStatusType = `${z.infer<typeof BookingStatusSchema>}`

export const SlotStatusSchema = z.enum(['AVAILABLE','BOOKED','BLOCKED']);
export type SlotStatusType = `${z.infer<typeof SlotStatusSchema>}`

// Scalar Field Enums
export const UserScalarFieldEnumSchema = z.enum(['id','email','password','role','createdAt','updatedAt']);

export const MessageScalarFieldEnumSchema = z.enum(['id','content','senderId','receiverId','isRead','createdAt']);

export const MediaScalarFieldEnumSchema = z.enum(['id','url','key','fileName','mimeType','size','alt','userId','createdAt']);

export const ProfileScalarFieldEnumSchema = z.enum(['id','userId','displayName','bio','avatarUrl','serviceRadiusKm','starsRatio','phone','whatsapp','facebook','instagram','tiktok','twitter','linkedin','youtube','website','ratingAvg','reviewsCount','businessHours','isVerified','companyId']);

export const CompanyScalarFieldEnumSchema = z.enum(['id','businessName','logoUrl','description','rfc','legalName','fiscalRegime','taxAddress','taxAddressZip','taxAddressCity','taxAddressState','taxAddressCounty','isSatVerified','satVerifiedAt','satCertificateUrl','satVerificationDoc','createdAt','updatedAt','isActive']);

export const BranchScalarFieldEnumSchema = z.enum(['id','companyId','name','isMain','description','phone','whatsapp','email','address','addressLine2','city','state','county','zipCode','country','addressNotes','businessHours','createdAt','updatedAt','isActive']);

export const PortfolioItemScalarFieldEnumSchema = z.enum(['id','profileId','imageUrl','description','imageGallery','dynamicAttributes']);

export const CategoryScalarFieldEnumSchema = z.enum(['id','name','slug','description','imageUrl','isActive','parentId']);

export const ServiceUnitScalarFieldEnumSchema = z.enum(['id','name','abbreviation']);

export const ServiceScalarFieldEnumSchema = z.enum(['id','vendorId','companyId','categoryId','unitId','title','slug','description','imageUrl','tags','basePrice','showPrice','isActive','starsRate','reviewsCount','dynamicAttributes','workSchedule','commentsBox']);

export const ServiceMetadataScalarFieldEnumSchema = z.enum(['id','serviceId','key','value']);

export const BookingScalarFieldEnumSchema = z.enum(['id','customerId','serviceId','status','scheduledDate']);

export const BookingDetailsScalarFieldEnumSchema = z.enum(['id','bookingId','serviceSnapshot','unitPrice','quantity','taxTotal','grandTotal']);

export const ServiceSlotScalarFieldEnumSchema = z.enum(['id','serviceId','bookingId','startTime','endTime','status','isRecurring']);

export const PaymentScalarFieldEnumSchema = z.enum(['id','bookingId','amount','processorId','status']);
