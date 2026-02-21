import { PrismaService } from '../prisma.service';

/**
 * Actualiza el campo location usando PostGIS raw query
 */
export async function updateProfileLocation(prisma: PrismaService, profileId: string, lat: number, lng: number) {
  await prisma.$executeRaw`
    UPDATE "Profile"
    SET location = ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326)
    WHERE id = ${profileId}
  `;
}
